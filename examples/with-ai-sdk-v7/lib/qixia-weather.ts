import {
  getWeather,
  weatherInputSchema,
  type WeatherSnapshot,
} from "./weather";
import { getQWeather, qweatherConfigured, QIXIA_LOCATION } from "./qweather";

let cached: { snapshot: WeatherSnapshot; expires: number } | undefined;
let pending: Promise<WeatherSnapshot | null> | undefined;
async function load(): Promise<WeatherSnapshot | null> {
  const notices: string[] = [];
  if (qweatherConfigured()) {
    try {
      return await getQWeather();
    } catch {
      notices.push("实况服务暂不可用，已切换至模型预报。");
    }
  } else notices.push("当前使用模型预报；分钟级降水和生活指数暂不可用。");
  const result = await getWeather(
    { city: "栖霞山", date: "next_7_days", countryCode: "CN" },
    undefined,
    QIXIA_LOCATION,
  );
  if (result.status !== "success") return null;
  return {
    ...result,
    provider: "open-meteo",
    timeBasis: "data",
    indices: [],
    minutely: null,
    notices,
    attributions: ["Open-Meteo · CC BY 4.0"],
  };
}
export async function getQixiaWeather(): Promise<WeatherSnapshot | null> {
  if (cached && cached.expires > Date.now()) return cached.snapshot;
  pending ??= load();
  try {
    const result = await pending;
    if (result) {
      cached = { snapshot: result, expires: Date.now() + 60000 };
      return result;
    }
    if (
      cached &&
      Date.now() - Date.parse(cached.snapshot.retrievedAt) < 30 * 60000
    )
      return {
        ...cached.snapshot,
        stale: true,
        notices: [
          ...(cached.snapshot.notices ?? []),
          "更新失败，保留上次数据，请注意时间。",
        ],
      };
    return null;
  } finally {
    pending = undefined;
  }
}

export async function getTripWeather(
  input: ReturnType<typeof weatherInputSchema.parse>,
  signal?: AbortSignal,
) {
  if (
    !/^(南京市?|江苏省?)?[ ·,，]*栖霞山(风景区|景区|风景名胜区)?$/.test(
      input.city.trim(),
    ) ||
    (input.countryCode && input.countryCode !== "CN")
  )
    return getWeather(input, signal);
  signal?.throwIfAborted();
  const snapshot = await getQixiaWeather();
  signal?.throwIfAborted();
  if (!snapshot)
    return {
      status: "unavailable" as const,
      message: "栖霞山天气暂不可用，请稍后重试。",
    };
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const offsets: Record<string, number> = {
    today: 0,
    tomorrow: 1,
    day_after_tomorrow: 2,
  };
  const offset = offsets[input.date];
  const requestedDate =
    offset == null
      ? input.date
      : new Date(Date.parse(`${today}T00:00:00Z`) + offset * 86400000)
          .toISOString()
          .slice(0, 10);
  if (
    requestedDate !== "next_7_days" &&
    !snapshot.daily.some((d) => d.date === requestedDate)
  )
    return {
      status: "date_out_of_range" as const,
      message: "所请求日期暂无预报，不能用其他日期代替。",
      requestedDate,
      availableDates: snapshot.daily.map((d) => d.date),
    };
  return {
    ...snapshot,
    requestedDate,
    daily: snapshot.daily.filter(
      (d) => requestedDate === "next_7_days" || d.date === requestedDate,
    ),
  };
}
