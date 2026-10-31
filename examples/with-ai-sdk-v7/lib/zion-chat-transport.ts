"use client";

// 把 assistant-ui / AI SDK 的聊天请求接到 Zion 的「AI 智能体」上。
// 官方 headless 链路（docs.functorz.com/docs/code/headless）：
//   1. HTTP mutation  fz_zai_create_conversation  —— inputArgs 的键用 argKey，不是显示名
//   2. WebSocket 订阅 fz_zai_listen_conversation_result —— 子协议 graphql-ws
//   3. data 是「到目前为止累积的文本」，增量 = data.slice(已输出长度)
// 每轮提问建一个会话，历史由前端拼进 question，避免多轮发送与「正在生成中」冲突。

import type { ChatTransport, UIMessage, UIMessageChunk } from "ai";
import { ZION_GRAPHQL, ZION_WS, ZION_ZAI_CONFIG_ID } from "./zion-config";
import { ZAI_QUESTION_ARG_KEY } from "./zion-zai";
import { readSelectedPlace } from "./place-context";
import { formatPlaceContext } from "./qixia-chat-prompt";

const CREATE_CONVERSATION = `mutation($inputArgs: Map_String_ObjectScalar!, $z: String!){ fz_zai_create_conversation(inputArgs: $inputArgs, zaiConfigId: $z) }`;
const LISTEN_RESULT = `subscription($id: Long!){ fz_zai_listen_conversation_result(conversationId: $id){ conversationId status data } }`;

const TERMINAL = new Set(["COMPLETED", "FAILED", "CANCELED"]);

type ListenResult = {
  conversationId: number;
  status: string;
  data: string | null;
};

async function gql(
  query: string,
  variables: Record<string, unknown>,
): Promise<{ data?: Record<string, unknown>; errors?: unknown[] }> {
  const response = await fetch(ZION_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  return (await response.json()) as {
    data?: Record<string, unknown>;
    errors?: unknown[];
  };
}

function textOf(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text",
    )
    .map((part) => part.text)
    .join("\n")
    .trim();
}

/** 地图选点上下文原本由服务端注入；静态部署下在这里补回给模型。 */
function withPlaceContext(message: UIMessage): string {
  const base = textOf(message);
  const place = readSelectedPlace(message.metadata);
  if (!place) return base;
  const meta: {
    name: string;
    referenceCode?: string;
    address?: string;
    lng: number;
    lat: number;
    poiId?: string;
  } = { name: place.name, lng: place.lng, lat: place.lat };
  const referenceCode = place.referenceCode ?? place.referenceName;
  if (referenceCode) meta.referenceCode = referenceCode;
  if (place.address) meta.address = place.address;
  if (place.poiId) meta.poiId = place.poiId;
  return [formatPlaceContext(meta), base].join("\n");
}

/** 把历史与当前问题拼成一个字符串，作为智能体的 question 入参。 */
export function buildQuestion(messages: UIMessage[]): string {
  const last = messages[messages.length - 1];
  if (!last) return "";
  const history = messages.slice(0, -1);
  const lines: string[] = [];
  for (const message of history) {
    const text = textOf(message);
    if (!text) continue;
    lines.push(`${message.role === "user" ? "游客" : "讲解员"}：${text}`);
  }
  if (lines.length)
    lines.unshift("以下是之前的对话，供你保持上下文，不要复述：");
  lines.push(withPlaceContext(last));
  return lines.join("\n");
}

export function createZionChatTransport(): ChatTransport<UIMessage> {
  return {
    async sendMessages({ messages, abortSignal }) {
      const question = buildQuestion(messages);
      const created = await gql(CREATE_CONVERSATION, {
        inputArgs: { [ZAI_QUESTION_ARG_KEY]: question },
        z: ZION_ZAI_CONFIG_ID,
      });
      const conversationId = created.data?.fz_zai_create_conversation as
        | number
        | undefined;
      if (!conversationId) throw new Error("Zion 会话创建失败");

      let socket: WebSocket | undefined;
      const stream = new ReadableStream<UIMessageChunk>({
        start(controller) {
          let settled = false;
          let emitted = "";
          const finish = () => {
            if (settled) return;
            settled = true;
            socket?.close();
            controller.close();
          };

          socket = new WebSocket(ZION_WS, "graphql-ws");
          socket.onopen = () => {
            socket?.send(
              JSON.stringify({ type: "connection_init", payload: {} }),
            );
          };
          socket.onmessage = (event) => {
            let frame: { type?: string; payload?: any };
            try {
              frame = JSON.parse(String(event.data));
            } catch {
              return;
            }
            if (frame.type === "connection_ack") {
              socket?.send(
                JSON.stringify({
                  id: "1",
                  type: "start",
                  payload: {
                    query: LISTEN_RESULT,
                    variables: { id: conversationId },
                  },
                }),
              );
              controller.enqueue({ type: "start" });
              controller.enqueue({ type: "text-start", id: "0" });
              return;
            }
            if (frame.type !== "data") return;
            const result = frame.payload?.data
              ?.fz_zai_listen_conversation_result as ListenResult | undefined;
            if (!result) return;
            const text = typeof result.data === "string" ? result.data : "";
            // data 是累积文本，只把新增的部分作为增量发出去。
            if (text.length > emitted.length) {
              controller.enqueue({
                type: "text-delta",
                id: "0",
                delta: text.slice(emitted.length),
              });
              emitted = text;
            }
            if (!TERMINAL.has(result.status)) return;
            if (result.status === "FAILED") {
              controller.enqueue({
                type: "error",
                errorText: "讲解员暂时没有回应，请稍后再试。",
              });
            } else {
              controller.enqueue({ type: "text-end", id: "0" });
              controller.enqueue({ type: "finish" });
            }
            finish();
          };
          socket.onerror = () => {
            controller.enqueue({
              type: "error",
              errorText: "实时连接失败，请检查网络后重试。",
            });
            finish();
          };

          abortSignal?.addEventListener("abort", () => {
            controller.enqueue({ type: "abort", reason: "用户取消" });
            finish();
          });
        },
        cancel() {
          socket?.close();
        },
      });

      return stream;
    },
    async reconnectToStream() {
      return null;
    },
  };
}
