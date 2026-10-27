import type { Tool } from "ai";
import { afterEach, expect, it, vi } from "vitest";
import { openAmapTools } from "./amap-mcp";
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
it("leaves chat usable without a map service credential", async () => {
  vi.stubEnv("AMAP_WEB_SERVICE_KEY", "");
  const mock = vi.spyOn(globalThis, "fetch");
  const session = await openAmapTools(new AbortController().signal);
  expect(session.status).toBe("not_configured");
  expect(session.tools).toEqual({});
  expect(mock).not.toHaveBeenCalled();
  await session.close();
});
it("discovers tools with the real MCP client and only exposes the intended map queries", async () => {
  vi.stubEnv("AMAP_WEB_SERVICE_KEY", "test-web-key");
  const methods: string[] = [];
  vi.spyOn(globalThis, "fetch").mockImplementation(async (_input, init) => {
    if (!init?.body) return new Response(null, { status: 204 });
    const body = JSON.parse(init.body as string);
    methods.push(body.method);
    if (body.method === "notifications/initialized")
      return new Response(null, { status: 202 });
    const result =
      body.method === "initialize"
        ? {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "test-amap", version: "1" },
          }
        : body.method === "tools/list"
          ? {
              tools: [
                {
                  name: "maps_text_search",
                  description: "查找地点",
                  inputSchema: {
                    type: "object",
                    properties: { keywords: { type: "string" } },
                    required: ["keywords"],
                  },
                },
                { name: "maps_weather", inputSchema: { type: "object" } },
                { name: "send_message", inputSchema: { type: "object" } },
              ],
            }
          : body.method === "tools/call"
            ? {
                content: [
                  { type: "text", text: '{"pois":[{"name":"栖霞寺"}]}' },
                ],
              }
            : {};
    return Response.json({ jsonrpc: "2.0", id: body.id, result });
  });
  const session = await openAmapTools(new AbortController().signal);
  expect(session.status).toBe("ready");
  expect(Object.keys(session.tools)).toEqual(["amap_maps_text_search"]);
  const tool = session.tools.amap_maps_text_search as Tool<
    { keywords: string },
    unknown
  >;
  const result = await tool.execute!(
    { keywords: "栖霞寺" },
    { toolCallId: "test-call", messages: [], context: {} },
  );
  expect(JSON.stringify(result)).toContain("栖霞寺");
  expect(methods).toContain("tools/call");
  await session.close();
  await session.close();
});
it("returns an unavailable status when the MCP provider cannot be reached", async () => {
  vi.stubEnv("AMAP_WEB_SERVICE_KEY", "test-web-key");
  vi.spyOn(globalThis, "fetch").mockRejectedValue(
    new Error("private URL failed"),
  );
  const session = await openAmapTools(new AbortController().signal);
  expect(session.status).toBe("unavailable");
  expect(session.tools).toEqual({});
});
