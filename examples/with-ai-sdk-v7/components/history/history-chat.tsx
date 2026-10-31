"use client";

import { createLocalStorageAdapter } from "@assistant-ui/core/react";
import { useChatRuntime } from "@assistant-ui/ai-sdk";
import {
  AssistantRuntimeProvider,
  useRemoteThreadListRuntime,
} from "@assistant-ui/react";
import { useMemo, useState } from "react";
import { createZionChatTransport } from "@/lib/zion-chat-transport";
import { FKS_STATIC, zionChatConfigured } from "@/lib/zion-config";
import { HistoryWorkspace } from "./workspace";
import "./history.css";

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
  // 静态部署下没有 /api/chat，改用 Zion 的 AI 智能体做流式对话。
  const zionTransport = useMemo(
    () =>
      FKS_STATIC && zionChatConfigured()
        ? createZionChatTransport()
        : undefined,
    [],
  );
  const runtime = useRemoteThreadListRuntime({
    runtimeHook: useChatRuntime,
    adapter,
    ...(zionTransport ? { transport: zionTransport } : {}),
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <HistoryWorkspace runtime={runtime} storageError={storageError} />
    </AssistantRuntimeProvider>
  );
}
