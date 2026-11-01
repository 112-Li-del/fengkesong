import { describe, expect, it } from "vitest";
import { weatherBrief } from "./companion-weather";
import type { WeatherSnapshot } from "./weather";

function snapshot(overrides: Partial<WeatherSnapshot> = {}): WeatherSnapshot {
  return {
    status: "success",
    location: {
      name: "栖霞山",
      label: "中国 · 江苏 · 南京 · 栖霞山",
      latitude: 32.16043,
      longitude: 118.96479,
    },
    timezone: "Asia/Shanghai",
    requestedDate: "next_7_days",
    retrievedAt: "2026-11-01T10:59:00.000Z",
    units: {
      temperature: "°C",
      windSpeed: "km/h",
      humidity: "%",
      precipitationProbability: "%",
      precipitation: "mm",
    },
    current: {
      time: "2026-11-01T10:55",
      condition: "小雨",
      temperature: 17.6,
      feelsLike: 16,
      humidity: 88,
      windSpeed: 12,
      windDirection: 90,
      precipitation: 0.4,
      intervalSeconds: 900,
    },
    hourly: [
      {
        time: "2026-11-01T11:00",
        temperature: 18,
        condition: "小雨",
        precipitationProbability: 80,
        precipitation: 0.3,
      },
    ],
    daily: [],
    provider: "qweather",
    timeBasis: "data",
    indices: [],
    minutely: null,
    notices: [],
    attributions: ["和风天气"],
    source: { name: "和风天气", url: "https://www.qweather.com/" },
    ...overrides,
  } as WeatherSnapshot;
}

describe("weatherBrief", () => {
  it("正在下雨时给出湿滑提醒并标出降水", () => {
    const brief = weatherBrief(snapshot())!;
    expect(brief.headline).toContain("地面湿滑");
    expect(brief.items[0]!.id).toBe("weather:rain");
    expect(brief.items[0]!.body).toContain("0.4");
  });

  it("没在下雨但三小时内概率高时提示可能下雨", () => {
    const dry = snapshot({
      current: { ...snapshot().current, condition: "多云", precipitation: 0 },
    });
    const brief = weatherBrief(dry)!;
    expect(brief.headline).toContain("三小时内可能下雨");
    expect(brief.items[0]!.id).toBe("weather:rain-soon");
    expect(brief.items[0]!.body).toContain("80");
  });

  it("始终给出山顶温差估算并注明不是实测", () => {
    const brief = weatherBrief(
      snapshot({
        current: { ...snapshot().current, condition: "晴", precipitation: 0 },
        hourly: [],
      }),
    )!;
    const lapse = brief.items.find((item) => item.id === "weather:lapse")!;
    expect(lapse.title).toContain("1.6");
    expect(lapse.body).toContain("不是山顶实测");
  });

  it("数据缺失时不编造结论", () => {
    expect(weatherBrief(snapshot({ current: null as never }))).toBeNull();
  });

  it("分钟级降水给出多久后雨停", () => {
    const now = Date.parse("2026-11-01T03:00:00.000Z");
    const at = (minutes: number) =>
      new Date(now + minutes * 60_000).toISOString();
    const brief = weatherBrief(
      snapshot({
        minutely: {
          updatedAt: at(0),
          summary: "小雨将在20分钟后停止",
          points: [
            { time: at(5), precipitation: 0.2, type: "rain" },
            { time: at(10), precipitation: 0.1, type: "rain" },
            { time: at(15), precipitation: 0, type: "rain" },
          ],
        } as never,
      }),
      now,
    )!;
    expect(brief.headline).toContain("15 分钟后雨停");
    expect(brief.items[0]!.id).toBe("weather:minutely");
    expect(brief.items[0]!.body).toContain("小雨将在20分钟后停止");
  });

  it("还没下雨时给出多久后开始下雨", () => {
    const now = Date.parse("2026-11-01T03:00:00.000Z");
    const at = (minutes: number) =>
      new Date(now + minutes * 60_000).toISOString();
    const brief = weatherBrief(
      snapshot({
        current: { ...snapshot().current, condition: "多云", precipitation: 0 },
        minutely: {
          updatedAt: at(0),
          summary: "20分钟后开始下小雨",
          points: [
            { time: at(20), precipitation: 0.3, type: "rain" },
            { time: at(25), precipitation: 0.3, type: "rain" },
          ],
        } as never,
      }),
      now,
    )!;
    expect(brief.headline).toContain("约 20 分钟后开始下雨");
  });
});
