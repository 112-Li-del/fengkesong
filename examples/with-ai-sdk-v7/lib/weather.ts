import { z } from "zod";
import { findChineseDistricts } from "./china-locations";

export const weatherInputSchema = z.object({
  city: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .describe(
      "保留完整区县或景点名，如‘南京栖霞区’、‘栖霞区, 南京, 江苏’。不得把区县改写成市中心，也不得编造坐标。",
    ),
  countryCode: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .optional()
    .describe("用户已明确的两位国家代码，例如 CN、JP；不确定时省略。"),
  date: z
    .string()
    .regex(
      /^(today|tomorrow|day_after_tomorrow|next_7_days|\d{4}-\d{2}-\d{2})$/,
    )
    .default("today")
    .describe(
      "today=今天，tomorrow=明天，day_after_tomorrow=后天，next_7_days=未来七天；也可传 YYYY-MM-DD。相对日期按查询地点时区计算。",
    ),
});

type WeatherInput = z.infer<typeof weatherInputSchema>;

const locationSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  country: z.string().optional(),
  admin1: z.string().optional(),
  admin2: z.string().optional(),
  feature_code: z.string().optional(),
  locationSource: z
    .object({ name: z.string(), url: z.string(), note: z.string() })
    .optional(),
});
const geocodingSchema = z.object({
  results: z.array(locationSchema).optional(),
});
const values = z.array(z.number().nullable());
const forecastSchema = z.object({
  timezone: z.string(),
  current: z.object({
    time: z.string(),
    temperature_2m: z.number().nullable(),
    apparent_temperature: z.number().nullable(),
    relative_humidity_2m: z.number().nullable(),
    weather_code: z.number().nullable(),
    wind_speed_10m: z.number().nullable(),
    wind_direction_10m: z.number().nullable().optional(),
    precipitation: z.number().nullable().optional(),
    interval: z.number().positive().optional(),
    is_day: z.number().nullable().optional(),
  }),
  hourly: z
    .object({
      time: z.array(z.string()),
      is_day: values.optional(),
      temperature_2m: values,
      precipitation_probability: values,
      precipitation: values,
      weather_code: values,
    })
    .refine((hourly) =>
      [
        hourly.temperature_2m,
        hourly.precipitation_probability,
        hourly.precipitation,
        hourly.weather_code,
        ...(hourly.is_day ? [hourly.is_day] : []),
      ].every((array) => array.length === hourly.time.length),
    )
    .optional(),
  daily: z
    .object({
      time: z.array(z.string()).min(1),
      weather_code: values,
      temperature_2m_max: values,
      temperature_2m_min: values,
      precipitation_probability_max: values,
    })
    .refine((daily) =>
      [
        daily.weather_code,
        daily.temperature_2m_max,
        daily.temperature_2m_min,
        daily.precipitation_probability_max,
      ].every((array) => array.length === daily.time.length),
    ),
});

const weatherCodes: Record<number, string> = {
  0: "晴",
  1: "大部晴朗",
  2: "局部多云",
  3: "阴",
  45: "雾",
  48: "雾凇",
  51: "小毛毛雨",
  53: "中毛毛雨",
  55: "强毛毛雨",
  56: "轻度冻毛毛雨",
  57: "强冻毛毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  66: "轻度冻雨",
  67: "强冻雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  77: "雪粒",
  80: "小阵雨",
  81: "中阵雨",
  82: "强阵雨",
  85: "小阵雪",
  86: "强阵雪",
  95: "雷暴",
  96: "雷暴伴小冰雹",
  99: "雷暴伴强冰雹",
};

function condition(code: number | null) {
  return code === null
    ? "暂无天气状况数据"
    : (weatherCodes[code] ?? "未知天气状况");
}
function locationLabel(location: z.infer<typeof locationSchema>) {
  return [
    ...new Set(
      [
        location.country,
        location.admin1,
        location.admin2,
        location.name,
      ].filter(Boolean),
    ),
  ].join(" · ");
}
async function requestJSON(url: URL, signal?: AbortSignal) {
  const timeout = AbortSignal.timeout(7000);
  const response = await fetch(url, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Weather service HTTP ${response.status}`);
  return response.json();
}
function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export async function getWeather(input: WeatherInput, signal?: AbortSignal) {
  try {
    const searchURL = new URL("https://geocoding-api.open-meteo.com/v1/search");
    searchURL.search = new URLSearchParams({
      name: input.city,
      count: "10",
      language: "zh",
      format: "json",
    }).toString();
    if (input.countryCode)
      searchURL.searchParams.set("countryCode", input.countryCode);
    const geocoding = geocodingSchema.parse(
      await requestJSON(searchURL, signal),
    );
    let locations = [
      ...new Map(
        (geocoding.results ?? []).map((location) => [location.id, location]),
      ).values(),
    ];
    if (!locations.length) {
      locations = (
        await findChineseDistricts(input.city, input.countryCode, signal)
      ).map((location) => locationSchema.parse(location));
    }
    if (!locations.length)
      return {
        status: "not_found" as const,
        message: `未找到‘${input.city}’的坐标，请提供城市、所在省份或更完整的地名。不能把其他地点的天气当作该地天气。`,
      };
    // Administrative centers take precedence over unqualified village matches.
    const administrativeLocations = locations.filter((location) =>
      /^PPL(C|A[0-4]?)$/.test(location.feature_code ?? ""),
    );
    const candidates = administrativeLocations.length
      ? administrativeLocations
      : locations;
    if (candidates.length > 1)
      return {
        status: "needs_clarification" as const,
        message:
          "发现多个同名地点，请先让用户确认国家或省份，再使用更完整的地点重新查询。",
        candidates: candidates.slice(0, 5).map((location) => ({
          label: locationLabel(location),
          query: `${location.name}, ${location.admin1 || location.country || ""}`,
        })),
      };
    const location = candidates[0]!;
    const forecastURL = new URL("https://api.open-meteo.com/v1/forecast");
    forecastURL.search = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      current:
        "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation,is_day",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      hourly:
        "temperature_2m,precipitation_probability,precipitation,weather_code,is_day",
      timezone: "auto",
      forecast_days: "7",
      temperature_unit: "celsius",
      wind_speed_unit: "kmh",
    }).toString();
    const forecast = forecastSchema.parse(
      await requestJSON(forecastURL, signal),
    );
    const localToday = forecast.daily.time[0]!;
    const offset = { today: 0, tomorrow: 1, day_after_tomorrow: 2 };
    const requestedDate =
      input.date in offset
        ? shiftDate(localToday, offset[input.date as keyof typeof offset])
        : input.date;
    if (
      requestedDate !== "next_7_days" &&
      !forecast.daily.time.includes(requestedDate)
    )
      return {
        status: "date_out_of_range" as const,
        message:
          "本工具仅提供查询地点当地今天起七天的预报。所请求日期不在范围内，不能用今天或临近日期的天气代替。",
        requestedDate,
        availableDates: forecast.daily.time,
        timezone: forecast.timezone,
      };
    const daily = forecast.daily.time
      .map((date, index) => ({
        date,
        condition: condition(forecast.daily.weather_code[index]!),
        maxTemperature: forecast.daily.temperature_2m_max[index]!,
        minTemperature: forecast.daily.temperature_2m_min[index]!,
        maxPrecipitationProbability:
          forecast.daily.precipitation_probability_max[index]!,
      }))
      .filter(
        (day) => requestedDate === "next_7_days" || day.date === requestedDate,
      );
    return {
      status: "success" as const,
      location: {
        name: location.name,
        label: locationLabel(location),
        latitude: location.latitude,
        longitude: location.longitude,
        ...(location.locationSource ? { source: location.locationSource } : {}),
      },
      timezone: forecast.timezone,
      requestedDate,
      retrievedAt: new Date().toISOString(),
      units: {
        temperature: "°C",
        windSpeed: "km/h",
        humidity: "%",
        precipitationProbability: "%",
        precipitation: "mm",
      },
      current: {
        time: forecast.current.time,
        condition: condition(forecast.current.weather_code),
        temperature: forecast.current.temperature_2m,
        feelsLike: forecast.current.apparent_temperature,
        humidity: forecast.current.relative_humidity_2m,
        windSpeed: forecast.current.wind_speed_10m,
        windDirection: forecast.current.wind_direction_10m ?? null,
        precipitation: forecast.current.precipitation ?? null,
        intervalSeconds: forecast.current.interval ?? null,
        isDay:
          forecast.current.is_day == null
            ? null
            : forecast.current.is_day === 1,
      },
      hourly: (forecast.hourly?.time ?? [])
        .map((time, index) => ({
          time,
          temperature: forecast.hourly!.temperature_2m[index]!,
          isDay:
            forecast.hourly!.is_day?.[index] == null
              ? null
              : forecast.hourly?.is_day?.[index] === 1,
          condition: condition(forecast.hourly!.weather_code[index]!),
          precipitationProbability:
            forecast.hourly!.precipitation_probability[index]!,
          precipitation: forecast.hourly!.precipitation[index]!,
        }))
        .filter((hour) => hour.time > forecast.current.time)
        .slice(0, 12),
      daily,
      source: {
        name: "Open-Meteo",
        url: "https://open-meteo.com/",
        queryURL: forecastURL.toString(),
        note: "当前天气为对应时刻的气象模型估算。daily.condition 是全天最严重状况，不表示当前正在发生，也不能确定降水时刻。hourly 降水量与概率对应该时点之前一小时的时段。未来日期用 daily，具体时段用 hourly。null 为暂无数据。",
      },
    };
  } catch (error) {
    if (signal?.aborted) throw error;
    return {
      status: "unavailable" as const,
      message:
        "天气服务暂时不可用、请求超时或返回数据不完整，请稍后重试。不能编造天气数据。",
    };
  }
}

export type WeatherResult = Awaited<ReturnType<typeof getWeather>>;
export type WeatherSnapshot = Extract<WeatherResult, { status: "success" }>;
