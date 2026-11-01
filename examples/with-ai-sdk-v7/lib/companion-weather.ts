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

/** 用分钟级降水点算出“多久后开始/停止”，算不出时退回服务商摘要。 */
export function rainWindow(
  minutely: WeatherSnapshot["minutely"],
  raining: boolean,
  now = Date.now(),
) {
  const points = (minutely?.points ?? []).filter(
    (point) => (point.precipitation ?? 0) > 0.02,
  );
  if (!points.length) return null;
  const first = Date.parse(points[0]!.time);
  const last = Date.parse(points.at(-1)!.time) + 5 * 60_000;
  if (!Number.isFinite(first) || !Number.isFinite(last)) return null;
  const startIn = Math.round((first - now) / 60_000);
  const stopIn = Math.round((last - now) / 60_000);
  if (raining || startIn <= 0)
    return stopIn <= 0 ? "降雨即将结束" : `约 ${stopIn} 分钟后雨停`;
  return startIn <= 120 ? `约 ${startIn} 分钟后开始下雨` : null;
}

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
  const window_ = rainWindow(snapshot.minutely, raining, now);
  if (window_)
    items.push({
      id: "weather:minutely",
      title: window_,
      body:
        snapshot.minutely?.summary?.trim() ||
        "分钟级降水来自和风天气临近预报，每 5 分钟更新，覆盖未来两小时。",
    });
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
    raining
      ? (window_ ?? "地面湿滑")
      : rainSoon
        ? (window_ ?? "三小时内可能下雨")
        : "山顶低约 1.6℃",
  ].join(" · ");

  return {
    headline,
    items,
    source: actualSource,
    at: Date.parse(snapshot.retrievedAt) || now,
  };
}
