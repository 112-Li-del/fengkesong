import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GET } from "./route";
const context = (path: string) => ({
  params: Promise.resolve({ path: path.split("/") }),
});
const request = (query = "key=public-js-key") =>
  new Request("http://localhost/_AMapService/v3/place/around?" + query);
beforeEach(() => {
  vi.stubEnv("AMAP_JS_API_KEY", "public-js-key");
  vi.stubEnv("AMAP_JS_SECURITY_CODE", "private-security");
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
it("keeps the safety code on the server and forwards only an allowed service", async () => {
  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(Response.json({ status: "1", pois: [] }));
  const response = await GET(
    request("key=public-js-key&jscode=attacker"),
    context("v3/place/around"),
  );
  const url = new URL(String(fetchMock.mock.calls[0]![0]));
  expect(url.origin).toBe("https://restapi.amap.com");
  expect(url.searchParams.get("jscode")).toBe("private-security");
  expect(await response.text()).not.toContain("private-security");
});
it("uses a script MIME type for the SDK's validated JSONP callback", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response('jsonp_123_({"status":"1"})', {
      headers: { "content-type": "application/json" },
    }),
  );
  const response = await GET(
    request("key=public-js-key&callback=jsonp_123_"),
    context("v3/place/around"),
  );
  expect(response.headers.get("content-type")).toContain(
    "application/javascript",
  );
  expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  expect(await response.text()).toBe('jsonp_123_({"status":"1"})');
});
it("blocks arbitrary paths, foreign keys, and injected callback code before making a request", async () => {
  const mock = vi.spyOn(globalThis, "fetch");
  expect((await GET(request(), context("v4/grasproad/driving"))).status).toBe(
    404,
  );
  expect(
    (await GET(request("key=foreign"), context("v3/place/around"))).status,
  ).toBe(403);
  expect(
    (
      await GET(
        request("key=public-js-key&callback=alert(1)"),
        context("v3/place/around"),
      )
    ).status,
  ).toBe(400);
  expect(mock).not.toHaveBeenCalled();
});
it("reports an upstream failure without leaking request URLs or credentials", async () => {
  vi.spyOn(globalThis, "fetch").mockRejectedValue(
    new Error("request with private-security failed"),
  );
  const response = await GET(request(), context("v3/place/around"));
  expect(response.status).toBe(502);
  expect(await response.text()).not.toContain("private-security");
});
