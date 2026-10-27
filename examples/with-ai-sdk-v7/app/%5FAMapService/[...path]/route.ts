const allowed = new Set([
  "v3/log/init",
  "v3/ip",
  "v3/geocode/regeo",
  "v3/geocode/geo",
  "v3/assistant/coordinate/convert",
  "v3/place/text",
  "v3/place/around",
  "v3/place/detail",
  "v3/direction/walking",
  "v4/map/styles",
]);
export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const key = process.env.AMAP_JS_API_KEY?.trim();
  const security = process.env.AMAP_JS_SECURITY_CODE?.trim();
  if (!key || !security)
    return Response.json({ message: "地图配置未完成" }, { status: 503 });
  const path = (await context.params).path.join("/");
  if (!allowed.has(path))
    return Response.json({ message: "不支持的地图服务" }, { status: 404 });
  const incoming = new URL(request.url);
  if (incoming.searchParams.get("key") !== key)
    return Response.json({ message: "地图 Key 不匹配" }, { status: 403 });
  const callback = incoming.searchParams.get("callback");
  if (callback && !/^[A-Za-z_$][A-Za-z0-9_$]{0,120}$/.test(callback))
    return Response.json({ message: "无效的回调参数" }, { status: 400 });
  const target = new URL(
    path,
    path === "v4/map/styles"
      ? "https://webapi.amap.com/"
      : "https://restapi.amap.com/",
  );
  target.search = incoming.search;
  target.searchParams.set("jscode", security);
  try {
    const response = await fetch(target, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10000)]),
    });
    if (!response.ok) throw new Error("Map provider unavailable");
    return new Response(await response.text(), {
      headers: {
        "Content-Type": callback
          ? "application/javascript; charset=utf-8"
          : (response.headers.get("Content-Type") ?? "application/json"),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return Response.json(
      { message: "地图服务暂时不可用，请重试" },
      { status: 502 },
    );
  }
}
