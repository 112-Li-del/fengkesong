"use client";

import { Thread } from "@/components/zh-ui/thread.aui";
import {
  AssistantRuntimeProvider,
  useAui,
  AuiProvider,
  AuiConfig,
  Suggestions,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/ai-sdk";

function ThreadWithSuggestions() {
  const aui = useAui();
  const config = AuiConfig({
    suggestions: Suggestions([
      {
        title: "现在东京",
        label: "天气怎么样？",
        prompt: "东京现在的天气怎么样？",
      },
      {
        title: "讲一个有趣的小知识",
        label: "什么主题都可以",
        prompt: "给我讲一个关于太空的有趣小知识。",
      },
    ]),
  });
  return (
    <AuiProvider extends={aui} config={config}>
      <Thread />
    </AuiProvider>
  );
}

export default function Home() {
  const runtime = useChatRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-full">
        <ThreadWithSuggestions />
      </div>
    </AssistantRuntimeProvider>
  );
}
