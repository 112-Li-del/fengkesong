import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import type { ToolSet } from "ai";

const allowed = new Set([
  "maps_text_search",
  "maps_around_search",
  "maps_search_detail",
  "maps_direction_walking",
  "maps_geo",
  "maps_regeocode",
  "maps_distance",
]);
export async function openAmapTools(signal: AbortSignal) {
  const key = process.env.AMAP_WEB_SERVICE_KEY?.trim();
  const empty = {
    tools: {} as ToolSet,
    status: "not_configured",
    close: async () => {},
  };
  if (!key) return empty;
  let client: Awaited<ReturnType<typeof createMCPClient>> | undefined;
  try {
    const url = new URL("https://mcp.amap.com/mcp");
    url.searchParams.set("key", key);
    client = await createMCPClient({
      transport: {
        type: "http",
        url: url.toString(),
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            signal: AbortSignal.any([
              signal,
              AbortSignal.timeout(10000),
              ...(init?.signal ? [init.signal] : []),
            ]),
          }),
      },
    });
    const discovered = await client.tools();
    const tools: ToolSet = {};
    for (const [name, definition] of Object.entries(discovered)) {
      if (!allowed.has(name)) continue;
      const execute = definition.execute;
      tools["amap_" + name] = {
        ...definition,
        ...(execute
          ? {
              execute: async (input, options) => {
                try {
                  return await execute(input, options);
                } catch {
                  return {
                    status: "unavailable",
                    message:
                      "高德查询失败，请稍后重试。不能编造地点、距离或路线。",
                  };
                }
              },
            }
          : {}),
      };
    }
    let closed = false;
    const close = async () => {
      if (closed) return;
      closed = true;
      await client?.close().catch(() => {});
    };
    return {
      tools,
      status: Object.keys(tools).length ? "ready" : "unavailable",
      close,
    };
  } catch {
    await client?.close().catch(() => {});
    return { ...empty, status: "unavailable" };
  }
}
