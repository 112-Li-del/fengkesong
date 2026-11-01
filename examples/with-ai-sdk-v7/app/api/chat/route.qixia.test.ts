import { afterEach, expect, it, vi } from "vitest";
import { POST } from "./route";

function stream(delta: Record<string, unknown>, finishReason: string) {
  const chunks = [
    {
      id: "test-qixia",
      object: "chat.completion.chunk",
      created: 0,
      model: "test-qixia",
      choices: [{ index: 0, delta, finish_reason: null }],
    },
    {
      id: "test-qixia",
      object: "chat.completion.chunk",
      created: 0,
      model: "test-qixia",
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

it("把地图选点转成隐藏上下文，工具只返回审核后的口径", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test-placeholder");
  vi.stubEnv("OPENAI_BASE_URL", "https://test-model.invalid");
  vi.stubEnv("OPENAI_MODEL", "test-qixia");
  const modelRequests: {
    messages: {
      role: string;
      content?: string | { type: string; text?: string }[];
    }[];
  }[] = [];
  let toolResult: Record<string, unknown> | undefined;
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const url = String(input);
    if (!url.startsWith("https://test-model.invalid/"))
      throw new Error(`Unexpected network request: ${url}`);
    const body = JSON.parse(init?.body as string);
    modelRequests.push(body);
    if (modelRequests.length === 1)
      return stream(
        {
          role: "assistant",
          tool_calls: [
            {
              index: 0,
              id: "knowledge-call",
              type: "function",
              function: {
                name: "get_qixia_knowledge",
                arguments: '{"query":"舍利塔"}',
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
      { role: "assistant", content: "舍利塔就在栖霞寺里。" },
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
            id: "user-selected",
            role: "user",
            parts: [{ type: "text", text: "介绍一下舍利塔" }],
            metadata: {
              custom: {
                qixiaPlace: {
                  name: "舍利塔",
                  referenceCode: "B6",
                  lng: 118.956292,
                  lat: 32.150991,
                },
              },
            },
          },
        ],
      }),
    }),
  );
  await response.text();

  expect(modelRequests).toHaveLength(2);
  const firstUserMessage = modelRequests[0]?.messages.find(
    (message) => message.role === "user",
  );
  const container = Array.isArray(firstUserMessage?.content)
    ? firstUserMessage.content
    : [];
  const userText = container.map((part) => part.text ?? "").join("\n");
  expect(userText).toContain("[地图选中]");
  expect(userText).toContain("118.956292,32.150991");
  expect(userText).toContain("介绍一下舍利塔");
  expect(userText).toContain("query 填「B6」");

  expect(toolResult).toMatchObject({
    matched: true,
    coverage: "full",
    name: "舍利塔",
    unsettled: [],
  });
  const serialized = JSON.stringify(toolResult);
  expect(serialized).toContain("18.04");
  expect(serialized).toContain("五丈余");
  for (const hidden of ["18.74", "http", "basis", "detail", "B6"])
    expect(serialized).not.toContain(hidden);
});

it("人物查询保留 main 的资料并明确其尚未交叉核实", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test-placeholder");
  vi.stubEnv("OPENAI_BASE_URL", "https://test-model.invalid");
  vi.stubEnv("OPENAI_MODEL", "test-qixia");
  let calls = 0;
  let result: Record<string, unknown> | undefined;
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    if (!String(input).startsWith("https://test-model.invalid/"))
      throw new Error("Unexpected request");
    const body = JSON.parse(init?.body as string);
    if (++calls === 1)
      return stream(
        {
          role: "assistant",
          tool_calls: [
            {
              index: 0,
              id: "person-call",
              type: "function",
              function: {
                name: "get_qixia_knowledge",
                arguments: '{"query":"李白"}',
              },
            },
          ],
        },
        "tool_calls",
      );
    result = JSON.parse(
      body.messages.find((message: { role: string }) => message.role === "tool")
        .content,
    );
    return stream(
      {
        role: "assistant",
        content: "相传李白曾寓居栖霞，品茶赋诗。",
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
            id: "person-query",
            role: "user",
            parts: [{ type: "text", text: "李白和栖霞山有什么关系" }],
          },
        ],
      }),
    }),
  );
  await response.text();
  expect(calls).toBe(2);
  expect(result).toMatchObject({
    matched: true,
    kind: "person",
    persons: expect.arrayContaining([
      expect.objectContaining({ name: "李白" }),
    ]),
  });
  expect(result?.guidance).toContain("尚未交叉核实");
  expect(JSON.stringify(result)).not.toContain("参赛阅读");
});

it("餐饮推荐正文使用已核验数据，模型不能把直线距离编成步行路线", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test-placeholder");
  vi.stubEnv("OPENAI_BASE_URL", "https://test-model.invalid");
  vi.stubEnv("OPENAI_MODEL", "test-qixia");
  vi.stubEnv("AMAP_WEB_SERVICE_KEY", "");
  let calls = 0;
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    if (!String(input).startsWith("https://test-model.invalid/"))
      throw new Error("Unexpected request");
    if (++calls === 1)
      return stream(
        {
          role: "assistant",
          tool_calls: [
            {
              index: 0,
              id: "food-call",
              type: "function",
              function: {
                name: "recommend_qixia_trip",
                arguments: JSON.stringify({
                  need: "food",
                  startName: "栖霞古寺",
                  returnName: "西门",
                }),
              },
            },
          ],
        },
        "tool_calls",
      );
    return stream(
      { role: "assistant", content: "沿平路步行22分钟，餐馆一定有座位。" },
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
            id: "food",
            role: "user",
            parts: [{ type: "text", text: "在栖霞古寺附近吃点东西再回西门" }],
          },
        ],
      }),
    }),
  );
  const events = (await response.text())
    .split("\n")
    .filter((line) => line.startsWith("data: {"))
    .map((line) => JSON.parse(line.slice(6)));
  const text = events
    .filter((e) => e.type === "text-delta")
    .map((e) => e.delta)
    .join("");
  expect(text).toContain("千佛斋素菜馆");
  expect(text).toContain("直线约");
  expect(text).toContain("暂未取得可靠步行路线");
  expect(text).not.toContain("22分钟");
  expect(text).not.toContain("一定有座位");
  expect(events.some((e) => e.type === "tool-output-available")).toBe(true);
});
