import { createOpenAI } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/ai-sdk";
import {
  type JSONSchema7,
  streamText,
  convertToModelMessages,
  type UIMessage,
  tool,
  stepCountIs,
  zodSchema,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    return new Response("请先在 .env.local 中填写 DEEPSEEK_API_KEY。", {
      status: 503,
    });
  }
  const deepseek = createOpenAI({
    apiKey,
    baseURL:
      process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com",
    name: "deepseek",
    // Non-thinking mode avoids reasoning_content requirements in tool continuations.
    fetch: (url, init) =>
      fetch(url, {
        ...init,
        body: JSON.stringify({
          ...JSON.parse(init?.body as string),
          thinking: { type: "disabled" },
        }),
      }),
  });
  const {
    messages,
    system,
    tools,
  }: {
    messages: UIMessage[];
    system?: string;
    tools?: Record<string, { description?: string; parameters: JSONSchema7 }>;
  } = await req.json();

  const aiSDKTools = {
    ...frontendTools(tools ?? {}),
    get_current_weather: tool({
      description: "Get the current weather",
      inputSchema: zodSchema(
        z.object({
          city: z.string(),
        }),
      ),
      execute: async ({ city }) => {
        return `The weather in ${city} is sunny`;
      },
    }),
  };
  const result = streamText({
    abortSignal: req.signal,
    model: deepseek.chat(
      process.env.DEEPSEEK_MODEL?.trim() || "deepseek-flash",
    ),
    messages: await convertToModelMessages(messages, { tools: aiSDKTools }),
    ...(system ? { system } : {}),
    stopWhen: stepCountIs(10),
    tools: aiSDKTools,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
