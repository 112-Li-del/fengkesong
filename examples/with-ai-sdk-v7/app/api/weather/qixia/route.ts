import { getWeather, type WeatherSnapshot } from "../../../../lib/weather";

let cached: { snapshot: WeatherSnapshot; expiresAt: number } | undefined;
let pending: Promise<Awaited<ReturnType<typeof getWeather>>> | undefined;

export async function GET(request: Request) {
  const refresh = new URL(request.url).searchParams.get("refresh") === "1";
  if (!refresh && cached && cached.expiresAt > Date.now()) {
    return Response.json(cached.snapshot, {
      headers: { "Cache-Control": "no-store" },
    });
  }
  pending ??= getWeather({
    city: "栖霞山",
    countryCode: "CN",
    date: "next_7_days",
  });
  try {
    const result = await pending;
    if (result.status !== "success" || result.location.name !== "栖霞山") {
      return Response.json(
        {
          status: "unavailable",
          message: "暂时无法获取栖霞山天气，请稍后重试。",
        },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
    cached = { snapshot: result, expiresAt: Date.now() + 300000 };
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } finally {
    pending = undefined;
  }
}
