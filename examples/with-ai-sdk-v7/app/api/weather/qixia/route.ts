import { getQixiaWeather } from "../../../../lib/qixia-weather";

export async function GET() {
  const snapshot = await getQixiaWeather();
  return Response.json(
    snapshot ?? {
      status: "unavailable",
      message: "暂时无法获取栖霞山天气，请稍后重试。",
    },
    {
      status: snapshot ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
