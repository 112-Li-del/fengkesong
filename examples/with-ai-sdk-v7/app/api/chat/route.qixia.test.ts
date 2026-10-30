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

it("把地图选点转成隐藏上下文，并用定稿口径回答，不再并列冲突数字", async () => {
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

  expect(toolResult).toMatchObject({ matched: true, coverage: "full" });
  expect(JSON.stringify(toolResult)).not.toContain("18.74");
  expect(JSON.stringify(toolResult)).not.toContain("http");
  expect(toolResult).toMatchObject({
    facts: expect.arrayContaining([{ label: "高度", value: "约 15 米" }]),
  });
});
