import { afterEach, expect, it, vi } from "vitest";
import { POST } from "./route";

function stream(delta: Record<string, unknown>, finishReason: string) {
  const chunks = [
    {
      id: "test-weather",
      object: "chat.completion.chunk",
      created: 0,
      model: "test-weather",
      choices: [{ index: 0, delta, finish_reason: null }],
    },
    {
      id: "test-weather",
      object: "chat.completion.chunk",
      created: 0,
      model: "test-weather",
      choices: [{ index: 0, delta: {}, finish_reason: finishReason }],
    },
  ];
  return new Response(
    chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("") +
      "data: [DONE]\n\n",
    { headers: { "content-type": "text/event-stream" } },
  );
}
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

it("executes the weather tool and sends its sourced forecast back to the model before streaming a reply", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test-placeholder");
  vi.stubEnv("OPENAI_BASE_URL", "https://test-model.invalid");
  vi.stubEnv("OPENAI_MODEL", "test-weather");
  const modelRequests: Record<string, unknown>[] = [];
  let toolResult: Record<string, unknown> | undefined;
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = String(input);
    if (url.startsWith("https://geocoding-api.open-meteo.com/"))
      return Response.json({
        results: [
          {
            id: 1799962,
            name: "南京",
            country: "中国",
            admin1: "江苏",
            latitude: 32.06167,
            longitude: 118.77778,
            feature_code: "PPLA",
          },
        ],
      });
    if (url.startsWith("https://api.open-meteo.com/"))
      return Response.json({
        timezone: "Asia/Shanghai",
        current: {
          time: "2026-10-27T09:00",
          temperature_2m: 22.1,
          apparent_temperature: 21,
          relative_humidity_2m: 65,
          weather_code: 2,
          wind_speed_10m: 7.6,
        },
        daily: {
          time: ["2026-10-27", "2026-10-28"],
          weather_code: [2, 61],
          temperature_2m_max: [24, 19],
          temperature_2m_min: [16, 12],
          precipitation_probability_max: [8, 76],
        },
      });
    if (!url.startsWith("https://test-model.invalid/"))
      throw new Error("Unexpected network request");
    const body = JSON.parse(init?.body as string);
    modelRequests.push(body);
    if (modelRequests.length === 1)
      return stream(
        {
          role: "assistant",
          tool_calls: [
            {
              index: 0,
              id: "weather-call",
              type: "function",
              function: {
                name: "get_current_weather",
                arguments: '{"city":"南京","date":"tomorrow"}',
              },
            },
          ],
        },
        "tool_calls",
      );
    const resultMessage = body.messages.find(
      (message: { role: string }) => message.role === "tool",
    );
    toolResult = JSON.parse(resultMessage.content);
    return stream(
      {
        role: "assistant",
        content: "南京明天小雨，12–19°C，降水概率76%。来源：Open-Meteo。",
      },
      "stop",
    );
  });
  const response = await POST(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            id: "test-user",
            role: "user",
            parts: [{ type: "text", text: "南京明天天气怎么样？" }],
          },
        ],
      }),
    }),
  );
  const text = await response.text();
  expect(modelRequests).toHaveLength(2);
  expect(toolResult).toMatchObject({
    status: "success",
    requestedDate: "2026-10-28",
    source: { name: "Open-Meteo" },
    daily: [
      {
        date: "2026-10-28",
        condition: "小雨",
        minTemperature: 12,
        maxTemperature: 19,
        maxPrecipitationProbability: 76,
      },
    ],
  });
  expect(text).toContain("南京明天小雨");
  expect(text).toContain("tool-output-available");
});
