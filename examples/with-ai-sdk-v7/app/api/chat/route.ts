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
  const useLegacyConfig =
    !process.env.OPENAI_API_KEY?.trim() &&
    !!process.env.DEEPSEEK_API_KEY?.trim();
  const apiKey = useLegacyConfig
    ? process.env.DEEPSEEK_API_KEY?.trim()
    : process.env.OPENAI_API_KEY?.trim();
  const baseURL = useLegacyConfig
    ? process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com"
    : process.env.OPENAI_BASE_URL?.trim();
  const model = useLegacyConfig
    ? process.env.DEEPSEEK_MODEL?.trim() || "deepseek-flash"
    : process.env.OPENAI_MODEL?.trim();
  if (!apiKey || !baseURL || !model) {
    return new Response(
      "请在 .env.local 中填写 OPENAI_API_KEY、OPENAI_BASE_URL 和 OPENAI_MODEL。",
      { status: 503 },
    );
  }
  const provider = createOpenAI({
    apiKey,
    baseURL,
    name: "openai-compatible",
    // DeepSeek tool continuations require non-thinking mode without reasoning_content.
    ...(/^https:\/\/api\.deepseek\.com(?:\/|$)/.test(baseURL)
      ? {
          fetch: (url, init) =>
            fetch(url, {
              ...init,
              body: JSON.stringify({
                ...JSON.parse(init?.body as string),
                thinking: { type: "disabled" },
              }),
            }),
        }
      : {}),
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
    model: provider.chat(model),
    messages: await convertToModelMessages(messages, { tools: aiSDKTools }),
    ...(system ? { system } : {}),
    stopWhen: stepCountIs(10),
    tools: aiSDKTools,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
