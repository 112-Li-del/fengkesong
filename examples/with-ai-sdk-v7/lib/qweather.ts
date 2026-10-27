import { z } from "zod";
import type { WeatherSnapshot } from "./weather";

const isoTime = z
  .string()
  .refine(
    (v) => /(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v)),
  );
const quantity = z.object({
  value: z.number().finite().nullable(),
  unit: z.string(),
});
const optionalQuantity = quantity.nullish();
const metadata = z.object({ attributions: z.array(z.string()).default([]) });
const condition = z.object({ text: z.string(), code: z.string() });
const precipitation = z.object({
  amount: optionalQuantity,
  intensity: optionalQuantity,
  probability: z.number().min(0).max(1).nullish(),
  type: z.string().nullish(),
});
const currentSchema = z.object({
  metadata,
  condition,
  temperature: quantity,
  feelsLike: optionalQuantity,
  humidity: z.number().min(0).max(1).nullish(),
  wind: z
    .object({
      direction: z.object({ degree: z.number().nullish() }).nullish(),
      speed: optionalQuantity,
    })
    .nullish(),
  windGust: optionalQuantity,
  precipitation: precipitation.nullish(),
  pressure: optionalQuantity,
  visibility: optionalQuantity,
  dewPoint: optionalQuantity,
  cloudCover: z.number().min(0).max(1).nullish(),
  uvIndex: z.number().nullish(),
});
const hourlySchema = z.object({
  metadata,
  hours: z.array(
    z.object({
      forecastTime: isoTime,
      condition,
      temperature: quantity,
      precipitation: precipitation.nullish(),
    }),
  ),
});
const dailySchema = z.object({
  metadata,
  days: z
    .array(
      z.object({
        forecastStartTime: isoTime,
        temperatureMax: optionalQuantity,
        temperatureMin: optionalQuantity,
        uvIndexMax: z.number().nullish(),
        astro: z
          .object({
            sunrise: z.string().nullish(),
            sunset: z.string().nullish(),
          })
          .nullish(),
        daytime: z.object({
          condition,
          precipitation: precipitation.nullish(),
        }),
        nighttime: z
          .object({ precipitation: precipitation.nullish() })
          .nullish(),
      }),
    )
    .min(1),
});
const numericString = z
  .union([
    z.number().finite(),
    z
      .string()
      .trim()
      .min(1)
      .refine((v) => Number.isFinite(Number(v)))
      .transform(Number),
  ])
  .nullable();
const refer = z
  .object({
    sources: z.array(z.string()).nullish(),
    license: z.array(z.string()).nullish(),
  })
  .optional();
const minutelySchema = z.object({
  code: z.literal("200"),
  updateTime: isoTime,
  summary: z.string(),
  refer,
  minutely: z
    .array(
      z.object({ fxTime: isoTime, precip: numericString, type: z.string() }),
    )
    .min(1),
});
const indicesSchema = z.object({
  code: z.literal("200"),
  refer,
  daily: z.array(
    z.object({
      date: z.string(),
      type: z.string(),
      name: z.string(),
      category: z.string(),
      text: z.string().nullish(),
    }),
  ),
});

export const QIXIA_LOCATION = {
  id: 0,
  name: "栖霞山",
  country: "中国",
  admin1: "江苏",
  admin2: "南京",
  latitude: 32.16043,
  longitude: 118.96479,
  locationSource: {
    name: "栖霞山山顶代表点",
    url: "https://www.openstreetmap.org/?mlat=32.16043&mlon=118.96479#map=16/32.16043/118.96479",
    note: "WGS84，凤翔峰附近代表点；不代表所有山路、山门或景区气象站实测。",
  },
};
export function qweatherConfigured() {
  return !!(
    process.env.QWEATHER_API_HOST?.trim() &&
    (process.env.QWEATHER_API_KEY?.trim() || process.env.QWEATHER_JWT?.trim())
  );
}
type CachedResponse = {
  data: unknown;
  retrievedAt: string;
  dataTime: string | null;
  expires: number;
};
const responses = new Map<string, CachedResponse>();
const requests = new Map<string, Promise<CachedResponse>>();
async function request(
  path: string,
  ttl: number,
  params: Record<string, string> = {},
) {
  const host = process.env.QWEATHER_API_HOST?.trim() ?? "";
  const origin = new URL(
    host.startsWith("https://") ? host : `https://${host}`,
  );
  if (
    origin.protocol !== "https:" ||
    !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+qweatherapi\.com$/i.test(
      origin.hostname,
    ) ||
    origin.port ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  )
    throw new Error("Invalid QWeather host");
  const url = new URL(path, origin);
  url.search = new URLSearchParams({ lang: "zh", ...params }).toString();
  const key = url.toString();
  const cached = responses.get(key);
  if (cached && cached.expires > Date.now()) return cached;
  const pending = requests.get(key);
  if (pending) return pending;
  const promise = (async () => {
    const jwt = process.env.QWEATHER_JWT?.trim();
    const headers: Record<string, string> = jwt
      ? { Authorization: `Bearer ${jwt}` }
      : { "X-QW-Api-Key": process.env.QWEATHER_API_KEY?.trim() ?? "" };
    const response = await fetch(url, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
      redirect: "error",
    });
    if (!response.ok) throw new Error(`QWeather HTTP ${response.status}`);
    const data: unknown = await response.json();
    if (
      typeof data === "object" &&
      data &&
      "code" in data &&
      data.code !== "200"
    )
      throw new Error("QWeather service unavailable");
    const modified = response.headers.get("last-modified");
    const result = {
      data,
      retrievedAt: new Date().toISOString(),
      dataTime:
        modified && Number.isFinite(Date.parse(modified))
          ? new Date(modified).toISOString()
          : null,
      expires: Date.now() + ttl,
    };
    responses.set(key, result);
    return result;
  })();
  requests.set(key, promise);
  try {
    return await promise;
  } finally {
    requests.delete(key);
  }
}
export function localTime(iso: string) {
  return new Date(new Date(iso).getTime() + 8 * 3600000)
    .toISOString()
    .slice(0, 16);
}
function value(q: z.infer<typeof optionalQuantity>, unit: string) {
  return q?.unit === unit ? q.value : null;
}
function speed(q: z.infer<typeof optionalQuantity>) {
  return q?.value == null
    ? null
    : q.unit === "m/s"
      ? q.value * 3.6
      : q.unit === "km/h"
        ? q.value
        : null;
}
function percent(v: number | null | undefined) {
  return v == null ? null : v * 100;
}
function statements(result: z.infer<typeof refer>) {
  return [...(result?.sources ?? []), ...(result?.license ?? [])];
}

export async function getQWeather(): Promise<WeatherSnapshot> {
  const point = `${QIXIA_LOCATION.latitude}/${QIXIA_LOCATION.longitude}`;
  const legacyPoint = `${QIXIA_LOCATION.longitude.toFixed(2)},${QIXIA_LOCATION.latitude.toFixed(2)}`;
  const results = await Promise.allSettled([
    request(`/weather/v1/current/${point}`, 60000, { localTime: "true" }),
    request(`/weather/v1/hourly/${point}`, 30 * 60000, {
      localTime: "true",
      hours: "24",
    }),
    request(`/weather/v1/daily/${point}`, 3 * 3600000, {
      localTime: "true",
      days: "7",
    }),
    request("/v7/minutely/5m", 5 * 60000, { location: legacyPoint }),
    request("/v7/indices/1d", 3 * 3600000, {
      location: legacyPoint,
      type: "3,6,5",
    }),
  ]);
  const main = results[0]!;
  if (main.status !== "fulfilled")
    throw new Error("QWeather current unavailable");
  const now = currentSchema.parse(main.value.data);
  const attributions = new Set(now.metadata.attributions);
  const notices: string[] = [];
  function optional<T>(index: number, schema: z.ZodType<T>, label: string) {
    const item = results[index]!;
    const parsed =
      item.status === "fulfilled" ? schema.safeParse(item.value.data) : null;
    if (parsed?.success) return parsed.data;
    notices.push(`${label}暂不可用`);
    return null;
  }
  const hourly = optional(1, hourlySchema, "逐小时预报");
  const daily = optional(2, dailySchema, "七天预报与日出日落");
  const minute = optional(3, minutelySchema, "分钟级降水");
  const indices = optional(4, indicesSchema, "生活指数");
  for (const data of [hourly, daily])
    data?.metadata.attributions.forEach((s) => attributions.add(s));
  for (const data of [minute, indices])
    statements(data?.refer).forEach((s) => attributions.add(s));
  const today = localTime(main.value.retrievedAt).slice(0, 10);
  const todayForecast = daily?.days.find(
    (day) => localTime(day.forecastStartTime).slice(0, 10) === today,
  );
  const sunset = todayForecast?.astro?.sunset;
  const sunrise = todayForecast?.astro?.sunrise;
  const isDay =
    sunrise && sunset
      ? Date.parse(main.value.retrievedAt) >= Date.parse(sunrise) &&
        Date.parse(main.value.retrievedAt) < Date.parse(sunset)
      : null;
  return {
    status: "success",
    provider: "qweather",
    timeBasis: main.value.dataTime ? "data" : "retrieved",
    location: {
      name: "栖霞山",
      label: "中国 · 江苏 · 南京 · 栖霞山",
      latitude: QIXIA_LOCATION.latitude,
      longitude: QIXIA_LOCATION.longitude,
      source: QIXIA_LOCATION.locationSource,
    },
    timezone: "Asia/Shanghai",
    requestedDate: "next_7_days",
    retrievedAt: main.value.retrievedAt,
    units: {
      temperature: "°C",
      windSpeed: "km/h",
      humidity: "%",
      precipitationProbability: "%",
      precipitation: "mm",
    },
    current: {
      time: localTime(main.value.dataTime ?? main.value.retrievedAt),
      condition: now.condition.text,
      temperature: value(now.temperature, "°C"),
      feelsLike: value(now.feelsLike, "°C"),
      humidity: percent(now.humidity),
      windSpeed: speed(now.wind?.speed),
      windDirection: now.wind?.direction?.degree ?? null,
      windGust: speed(now.windGust),
      precipitation: value(now.precipitation?.amount, "mm"),
      intervalSeconds: 3600,
      precipitationIntensity: value(now.precipitation?.intensity, "mm/h"),
      precipitationType: now.precipitation?.type ?? null,
      pressure: value(now.pressure, "hPa"),
      visibility:
        now.visibility?.unit === "m" && now.visibility.value != null
          ? now.visibility.value / 1000
          : value(now.visibility, "km"),
      dewPoint: value(now.dewPoint, "°C"),
      cloudCover: percent(now.cloudCover),
      uvIndex: now.uvIndex ?? null,
      isDay,
    },
    hourly: (hourly?.hours ?? [])
      .map((h) => ({
        time: localTime(h.forecastTime),
        temperature: value(h.temperature, "°C"),
        condition: h.condition.text,
        isDay: null,
        precipitationProbability: percent(h.precipitation?.probability),
        precipitation: value(h.precipitation?.amount, "mm"),
      }))
      .filter((h) => h.time > localTime(main.value.retrievedAt))
      .slice(0, 12),
    daily: (daily?.days ?? []).map((d) => ({
      date: localTime(d.forecastStartTime).slice(0, 10),
      condition: d.daytime.condition.text,
      maxTemperature: value(d.temperatureMax, "°C"),
      minTemperature: value(d.temperatureMin, "°C"),
      maxPrecipitationProbability:
        d.daytime.precipitation?.probability == null &&
        d.nighttime?.precipitation?.probability == null
          ? null
          : Math.max(
              percent(d.daytime.precipitation?.probability) ?? 0,
              percent(d.nighttime?.precipitation?.probability) ?? 0,
            ),
    })),
    astronomy: {
      date: today,
      sunrise: sunrise ? localTime(sunrise) : null,
      sunset: sunset ? localTime(sunset) : null,
      source: "和风天气",
    },
    dailyUvMax: todayForecast?.uvIndexMax ?? null,
    minutely: minute
      ? {
          updatedAt: minute.updateTime,
          summary: minute.summary,
          points: minute.minutely.map((p) => ({
            time: p.fxTime,
            precipitation: p.precip,
            type: p.type,
          })),
        }
      : null,
    indices: (indices?.daily ?? [])
      .filter((i) => i.date === today)
      .map((i) => ({ ...i, text: i.text ?? "暂无详细建议" })),
    notices,
    attributions: [...attributions],
    source: {
      name: "和风天气",
      url: "https://www.qweather.com/",
      queryURL: "https://dev.qweather.com/docs/api/weather/weather-current/",
      note: "多源融合实况，非景区气象站实测。查询山顶代表点；当前降水量为过去一小时累计量；分钟级降水每点是五分钟累计量，非降水概率。实况接口未返回数据时间时仅标获取时间。小时预报为对应时段预报。日天气为白天天气，日降水概率取昼夜预报较大值。",
    },
  };
}
