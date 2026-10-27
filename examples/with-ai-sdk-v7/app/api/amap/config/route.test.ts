import { afterEach, expect, it, vi } from "vitest";
import { GET } from "./route";
afterEach(() => vi.unstubAllEnvs());
it("exposes only the public JS key and configuration flags", async () => {
  vi.stubEnv("AMAP_JS_API_KEY", "public-js-key");
  vi.stubEnv("AMAP_JS_SECURITY_CODE", "secret-security-code");
  vi.stubEnv("AMAP_WEB_SERVICE_KEY", "secret-web-key");
  const response = await GET();
  const data = await response.json();
  expect(data).toEqual({
    configured: true,
    key: "public-js-key",
    mcpConfigured: true,
  });
  expect(JSON.stringify(data)).not.toContain("secret-");
  expect(response.headers.get("cache-control")).toBe("no-store");
});
it("does not announce a usable map when the safety configuration is missing", async () => {
  vi.stubEnv("AMAP_JS_API_KEY", "public-js-key");
  vi.stubEnv("AMAP_JS_SECURITY_CODE", "");
  vi.stubEnv("AMAP_WEB_SERVICE_KEY", "");
  expect(await (await GET()).json()).toEqual({
    configured: false,
    key: null,
    mcpConfigured: false,
  });
});
