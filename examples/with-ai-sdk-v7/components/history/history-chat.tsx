"use client";

import { createLocalStorageAdapter } from "@assistant-ui/core/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/ai-sdk";
import {
  AssistantRuntimeProvider,
  useRemoteThreadListRuntime,
} from "@assistant-ui/react";
import { useState } from "react";
import { getTripContext } from "@/lib/trip-context";
import { HistoryWorkspace } from "./workspace";
import "./history.css";

function useTripChatRuntime() {
  const [transport] = useState(
    () =>
      new AssistantChatTransport({
        body: () => ({ tripContext: getTripContext() }),
      }),
  );
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
  const runtime = useRemoteThreadListRuntime({
    runtimeHook: useTripChatRuntime,
    adapter,
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <HistoryWorkspace runtime={runtime} storageError={storageError} />
    </AssistantRuntimeProvider>
  );
}
