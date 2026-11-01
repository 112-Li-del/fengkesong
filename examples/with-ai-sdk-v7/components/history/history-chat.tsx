"use client";

import { createLocalStorageAdapter } from "@assistant-ui/core/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/ai-sdk";
import {
  AssistantRuntimeProvider,
  useRemoteThreadListRuntime,
} from "@assistant-ui/react";
import { useState } from "react";
import { getTripContext, tripContextForMessage } from "@/lib/trip-context";
import { createZionChatTransport } from "@/lib/zion-chat-transport";
import { FKS_STATIC, zionChatConfigured } from "@/lib/zion-config";
import { HistoryWorkspace } from "./workspace";
import "./history.css";

function useTripChatRuntime() {
  const [transport] = useState(
    () =>
      new AssistantChatTransport({
        prepareSendMessagesRequest: async (options) => {
          const last = options.messages.at(-1);
          const text =
            last?.role === "user"
              ? last.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join(" ")
              : "";
          const tripContext = text
            ? await tripContextForMessage(text)
            : getTripContext();
          return {
            body: {
              ...options.body,
              id: options.id,
              messages: options.messages,
              trigger: options.trigger,
              messageId: options.messageId,
              metadata: options.requestMetadata,
              tripContext,
            },
          };
        },
      }),
  );
  return useChatRuntime({ transport });
}
// 静态部署下没有 /api/chat，改用 Zion 的 AI 智能体做流式对话。
function useZionChatRuntime() {
  const [transport] = useState(() => createZionChatTransport());
  return useChatRuntime({ transport });
}
export function HistoryChat() {
  const [storageError, setStorageError] = useState(false);
  const [adapter] = useState(() =>
    createLocalStorageAdapter({
      prefix: "fengsongke:history:",
      storage: {
        async getItem(key) {
          try {
            return window.localStorage.getItem(key);
          } catch (error) {
            setStorageError(true);
            throw error;
          }
        },
        async setItem(key, value) {
          try {
            window.localStorage.setItem(key, value);
          } catch (error) {
            setStorageError(true);
            throw error;
          }
        },
        async removeItem(key) {
          try {
            window.localStorage.removeItem(key);
          } catch (error) {
            setStorageError(true);
            throw error;
          }
        },
      },
      titleGenerator: {
        async generateTitle(messages) {
          const text = messages
            .find((message) => message.role === "user")
            ?.content.filter((part) => part.type === "text")
            .map((part) => part.text)
            .join(" ")
            .trim();
          return text ? Array.from(text).slice(0, 36).join("") : "新对话";
        },
      },
    }),
  );
  // 关键：useRemoteThreadListRuntime 不会把额外字段（如 transport）透传给
  // runtimeHook，它只会“无参”调用 runtimeHook。若写成 `runtimeHook: useChatRuntime`
  // 再在外层塞 transport，transport 会被丢掉，useChatRuntime 退回默认的
  // AssistantChatTransport（POST /api/chat）——静态站没有该路由，于是报
  // “Failed to fetch the chat response.”。必须用闭包把 transport 传进 useChatRuntime。
  // 静态部署走 Zion 智能体，本地开发走带 tripContext 的 /api/chat。
  const runtime = useRemoteThreadListRuntime({
    runtimeHook:
      FKS_STATIC && zionChatConfigured()
        ? useZionChatRuntime
        : useTripChatRuntime,
    adapter,
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <HistoryWorkspace runtime={runtime} storageError={storageError} />
    </AssistantRuntimeProvider>
  );
}
