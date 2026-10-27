import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const meta = {
  metadata: {
    attributions: ["https://developer.qweather.com/attribution.html"],
  },
};
const current = {
  ...meta,
  condition: { text: "小雨", code: "305" },
  temperature: { value: 18.5, unit: "°C" },
  feelsLike: { value: 17, unit: "°C" },
  humidity: 0.69,
  wind: { direction: { degree: 225 }, speed: { value: 4, unit: "m/s" } },
  windGust: { value: 7, unit: "m/s" },
  precipitation: {
    amount: { value: 0.5, unit: "mm" },
    intensity: { value: 0.3, unit: "mm/h" },
    type: "rain",
  },
  pressure: { value: 1013, unit: "hPa" },
  visibility: { value: 15000, unit: "m" },
  dewPoint: { value: 13, unit: "°C" },
  cloudCover: 0.8,
  uvIndex: 2,
};
const daily = {
  ...meta,
  days: [
    {
      forecastStartTime: "2026-10-26T22:00Z",
      temperatureMax: { value: 21, unit: "°C" },
      temperatureMin: { value: 12, unit: "°C" },
      uvIndexMax: 4,
      astro: { sunrise: "2026-10-26T22:15Z", sunset: "2026-10-27T09:20Z" },
      daytime: {
        condition: { text: "小雨", code: "305" },
        precipitation: { probability: 0.4 },
      },
      nighttime: { precipitation: { probability: 0.7 } },
    },
  ],
};
function transport(failMinute = false, failCurrent = false) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const path = new URL(String(input)).pathname;
    if (path.includes("/current/"))
      return Response.json(failCurrent ? { error: "unauthorized" } : current, {
        status: failCurrent ? 401 : 200,
      });
    if (path.includes("/daily/")) return Response.json(daily);
    if (path.includes("/hourly/"))
      return Response.json({
        ...meta,
        hours: [
          {
            forecastTime: "2026-10-27T05:00Z",
            condition: current.condition,
            temperature: current.temperature,
            precipitation: {
              probability: 0.31,
              amount: { value: 0.2, unit: "mm" },
            },
          },
        ],
      });
    if (path.includes("/minutely/"))
      return Response.json(
        failMinute
          ? { code: "403" }
          : {
              code: "200",
              updateTime: "2026-10-27T12:00+08:00",
              summary: "未来两小时有降雨",
              minutely: [
                {
                  fxTime: "2026-10-27T12:05+08:00",
                  precip: "0.15",
                  type: "rain",
                },
              ],
              refer: { license: ["Minute data license"] },
            },
      );
    return Response.json({
      code: "200",
      daily: [
        {
          date: "2026-10-27",
          type: "3",
          name: "穿衣指数",
          category: "较舒适",
          text: "建议穿薄外套",
        },
      ],
    });
  });
}
beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-27T04:00:00Z"));
  vi.stubEnv("QWEATHER_API_HOST", "test.xy.qweatherapi.com");
  vi.stubEnv("QWEATHER_API_KEY", "test-key");
  vi.stubEnv("QWEATHER_JWT", "");
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe("QWeather provider", () => {
  it("normalizes official v1 units, v7 five-minute amounts, local dates and attribution", async () => {
    const mock = transport();
    const { getQWeather } = await import("./qweather");
    const data = await getQWeather();
    expect(data.current).toMatchObject({
      temperature: 18.5,
      humidity: 69,
      windSpeed: 14.4,
      windGust: 25.2,
      visibility: 15,
      cloudCover: 80,
      precipitation: 0.5,
      precipitationIntensity: 0.3,
    });
    expect(data.current.time).toBe("2026-10-27T12:00");
    expect(data.timeBasis).toBe("retrieved");
    expect(data.hourly[0]).toMatchObject({
      time: "2026-10-27T13:00",
      precipitationProbability: 31,
    });
    expect(data.daily[0]).toMatchObject({
      date: "2026-10-27",
      maxPrecipitationProbability: 70,
    });
    expect(data.astronomy).toMatchObject({
      sunrise: "2026-10-27T06:15",
      sunset: "2026-10-27T17:20",
    });
    expect(data.minutely?.points[0]?.precipitation).toBe(0.15);
    expect(data.attributions).toContain("Minute data license");
    expect(data.indices?.[0]?.category).toBe("较舒适");
    const indexRequest = mock.mock.calls.find(
      ([url]) => new URL(String(url)).pathname === "/v7/indices/1d",
    );
    expect(new URL(String(indexRequest?.[0])).searchParams.get("type")).toBe(
      "3,6,5",
    );
    const [, init] = mock.mock.calls[0]!;
    expect(init?.headers).toEqual({ "X-QW-Api-Key": "test-key" });
    expect(String(mock.mock.calls[0]![0])).toContain(
      "/weather/v1/current/32.16043/118.96479",
    );
    expect(JSON.stringify(data)).not.toContain("test-key");
  });
  it("keeps real current weather when minute precipitation is denied", async () => {
    transport(true);
    const { getQWeather } = await import("./qweather");
    const data = await getQWeather();
    expect(data.current.temperature).toBe(18.5);
    expect(data.minutely).toBeNull();
    expect(data.notices).toContain("分钟级降水暂不可用");
  });
  it("coalesces concurrent calls and refreshes only current weather after one minute", async () => {
    const mock = transport();
    const { getQWeather } = await import("./qweather");
    await Promise.all([getQWeather(), getQWeather()]);
    expect(mock).toHaveBeenCalledTimes(5);
    vi.advanceTimersByTime(60001);
    await getQWeather();
    expect(mock).toHaveBeenCalledTimes(6);
    expect(String(mock.mock.calls[5]![0])).toContain("/current/");
  });
  it("uses Bearer JWT without also sending the API key", async () => {
    vi.stubEnv("QWEATHER_JWT", "test-jwt");
    const mock = transport();
    const { getQWeather } = await import("./qweather");
    await getQWeather();
    expect(mock.mock.calls[0]?.[1]?.headers).toEqual({
      Authorization: "Bearer test-jwt",
    });
  });
  it("falls back at the same coordinates when the primary current service fails", async () => {
    const mock = transport(false, true);
    const primary = mock.getMockImplementation()!;
    mock.mockImplementation(async (input, init) => {
      if (new URL(String(input)).hostname !== "api.open-meteo.com")
        return primary(input, init);
      return Response.json({
        timezone: "Asia/Shanghai",
        current: {
          time: "2026-10-27T12:00",
          temperature_2m: 19,
          apparent_temperature: 18,
          relative_humidity_2m: 60,
          weather_code: 0,
          wind_speed_10m: 8,
        },
        daily: {
          time: ["2026-10-27"],
          weather_code: [0],
          temperature_2m_max: [22],
          temperature_2m_min: [12],
          precipitation_probability_max: [0],
        },
      });
    });
    const { getQixiaWeather } = await import("./qixia-weather");
    const data = await getQixiaWeather();
    expect(data).toMatchObject({
      provider: "open-meteo",
      current: { temperature: 19 },
      location: { latitude: 32.16043, longitude: 118.96479 },
      minutely: null,
    });
    expect(data?.notices).toContain("实况服务暂不可用，已切换至模型预报。");
  });
  it("shares the endpoint snapshot with the chat tool and filters by the requested date", async () => {
    const mock = transport();
    const { getQixiaWeather, getTripWeather } = await import("./qixia-weather");
    await getQixiaWeather();
    const result = await getTripWeather({ city: "南京栖霞山", date: "today" });
    expect(result).toMatchObject({
      status: "success",
      provider: "qweather",
      requestedDate: "2026-10-27",
    });
    expect(mock).toHaveBeenCalledTimes(5);
    expect(
      await getTripWeather({ city: "栖霞山", date: "tomorrow" }),
    ).toMatchObject({
      status: "date_out_of_range",
      requestedDate: "2026-10-28",
    });
  });
});
