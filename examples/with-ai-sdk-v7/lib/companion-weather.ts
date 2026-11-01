import type { WeatherSnapshot } from "./weather";

export type WeatherBrief = {
  headline: string;
  items: { id: string; title: string; body: string }[];
  source: string;
  at: number;
};

const wet = /雨|雪|雷|冰雹/;
const round = (value: number | null | undefined, digits = 0) =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toFixed(digits)
    : null;

/**
 * 把天气快照变成一句结论 + 几条可执行建议。
 * 只用快照里已有的字段，海拔温差按经验公式标注为估算，不写成实测。
 */
export function weatherBrief(
  snapshot: WeatherSnapshot,
  now = Date.now(),
): WeatherBrief | null {
  const current = snapshot.current;
  if (!current) return null;
  const condition = current.condition ?? "天气未知";
  const temperature = round(current.temperature);
  const precipitation = current.precipitation ?? 0;
  const raining = precipitation > 0 || wet.test(condition);
  const soon = (snapshot.hourly ?? [])
    .slice(0, 3)
    .map((hour) => hour.precipitationProbability ?? 0);
  const maxProbability = soon.length ? Math.max(...soon) : 0;
  const rainSoon = !raining && maxProbability >= 50;
  const actualSource =
    snapshot.provider === "qweather" ? "和风天气" : "Open-Meteo 模型预报";

  const items: WeatherBrief["items"] = [];
  if (raining)
    items.push({
      id: "weather:rain",
      title: "正在下雨，石阶会滑",
      body: `当前${condition}${precipitation ? `、过去一小时降水约 ${precipitation.toFixed(1)} 毫米` : ""}。放慢速度，优先走山门一带，保留返程时间。`,
    });
  else if (rainSoon)
    items.push({
      id: "weather:rain-soon",
      title: "三小时内可能下雨",
      body: `逐小时降水概率最高约 ${Math.round(maxProbability)}%。建议先走靠近山门的点，把山顶留到天气转好时。`,
    });

  items.push({
    id: "weather:lapse",
    title: "山顶比山门低约 1.6℃",
    body: "按 286 米高差、每 100 米约 0.6℃ 估算；加上风，体感更低，上山带件外套。这是估算，不是山顶实测。",
  });

  const uv = current.uvIndex;
  if (typeof uv === "number" && uv >= 6)
    items.push({
      id: "weather:uv",
      title: "紫外线较强",
      body: `紫外线指数 ${Math.round(uv)}，晴天时段注意遮阳补水。`,
    });

  const wind = current.windSpeed;
  if (typeof wind === "number" && wind >= 25)
    items.push({
      id: "weather:wind",
      title: "风偏大",
      body: `${Math.round(wind)} km/h 的风在山脊和观景台更明显，注意帽子和随身物品。`,
    });

  const headline = [
    `${condition}${temperature ? ` ${temperature}℃` : ""}`,
    raining ? "地面湿滑" : rainSoon ? "三小时内可能下雨" : "山顶低约 1.6℃",
  ].join(" · ");

  return {
    headline,
    items,
    source: actualSource,
    at: Date.parse(snapshot.retrievedAt) || now,
  };
}
