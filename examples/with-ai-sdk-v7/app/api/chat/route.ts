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
import { getWeather, weatherInputSchema } from "../../../lib/weather";

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
      description:
        "查询城市或景点的当前天气及当地今天起七天预报。天气问题必须调用本工具；同名地点应先澄清。日期支持 today、tomorrow、day_after_tomorrow、next_7_days 或 YYYY-MM-DD。",
      inputSchema: zodSchema(weatherInputSchema),
      execute: async (input, { abortSignal }) => getWeather(input, abortSignal),
    }),
  };
  const result = streamText({
    abortSignal: req.signal,
    model: provider.chat(model),
    messages: await convertToModelMessages(messages, { tools: aiSDKTools }),
    system: [
      system,
      "请使用中文回答。涉及当前或未来天气的事实必须调用 get_current_weather，以工具返回为依据。相对日期优先原样传 today、tomorrow、day_after_tomorrow，由工具按地点时区解析。查询未来某天必须使用该天的 daily，不能用 current 代替。daily.condition 仅是全天最不利天气，不能描述为当前天气或暗示现在正在下雨。问具体何时下雨时，必须根据 hourly 返回的具体时段和概率回答，不得把全天天气代码当成降雨时间；预报概率不等于现场确定降雨。输入中有完整区县名时必须保留，如南京栖霞区，不能把栖霞区擅自替换为栖霞山或南京市中心。地点未明确时先询问；needs_clarification 时请用户从候选地点中确认；not_found、date_out_of_range、unavailable 时如实解释，不能捏造温度、降水概率或查询成功。成功时注明完整地点、日期、数据时间、单位及来源链接 [Open-Meteo](https://open-meteo.com/)，null 表示暂无数据。当前天气为气象模型估算，不能宣称现场实测。若 location.source 存在，回复注明其地点来源链接，并说明这是区县代表位置的预报，不代表整个区县的所有位置。",
    ]
      .filter(Boolean)
      .join("\n\n"),
    stopWhen: stepCountIs(10),
    tools: aiSDKTools,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
