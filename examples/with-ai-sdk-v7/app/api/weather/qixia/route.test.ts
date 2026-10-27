import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const qixia = {
  id: 1,
  name: "栖霞山",
  latitude: 32.16043,
  longitude: 118.96479,
  country: "中国",
};
const forecast = {
  timezone: "Asia/Shanghai",
  current: {
    time: "2026-10-27T12:00",
    temperature_2m: 19,
    apparent_temperature: 18,
    relative_humidity_2m: 50,
    weather_code: 0,
    wind_speed_10m: 10,
    wind_direction_10m: 20,
    precipitation: 0,
    interval: 900,
  },
  hourly: {
    time: ["2026-10-27T13:00"],
    temperature_2m: [20],
    weather_code: [0],
    precipitation_probability: [0],
    precipitation: [0],
  },
  daily: {
    time: ["2026-10-27"],
    weather_code: [51],
    temperature_2m_max: [22],
    temperature_2m_min: [12],
    precipitation_probability_max: [40],
  },
};
function provider(location = qixia) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async (input) =>
      Response.json(
        String(input).includes("geocoding-api")
          ? { results: [location] }
          : forecast,
      ),
    );
}
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("QWEATHER_API_HOST", "");
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-27T04:00:00Z"));
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
describe("resident Qixia weather endpoint", () => {
  it("queries fixed mountain coordinates without geocoding and caches for one minute", async () => {
    const fetchMock = provider();
    const { GET } = await import("./route");
    vi.useFakeTimers();
    const first = await GET();
    expect(first.status).toBe(200);
    expect(await first.json()).toMatchObject({
      location: { name: "栖霞山", latitude: 32.16043, longitude: 118.96479 },
      current: { temperature: 19, precipitation: 0 },
      hourly: [{ time: "2026-10-27T13:00", precipitationProbability: 0 }],
    });
    expect((await GET()).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(60001);
    expect((await GET()).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(
      fetchMock.mock.calls.every(
        ([url]) =>
          new URL(String(url)).hostname === "api.open-meteo.com" &&
          new URL(String(url)).searchParams.get("latitude") === "32.16043",
      ),
    ).toBe(true);
  });
  it("labels retained data as stale on failure, then stops serving it after thirty minutes", async () => {
    const mock = provider();
    const { GET } = await import("./route");
    await GET();
    mock.mockRejectedValue(new Error("offline"));
    vi.advanceTimersByTime(60001);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      stale: true,
      retrievedAt: "2026-10-27T04:00:00.000Z",
    });
    vi.advanceTimersByTime(30 * 60000);
    expect((await GET()).status).toBe(503);
  });
  it("never substitutes Nanjing city-center data for the mountain card", async () => {
    provider({
      ...qixia,
      name: "南京",
      latitude: 32.06167,
      longitude: 118.77778,
    });
    const { GET } = await import("./route");
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      location: { latitude: 32.16043, longitude: 118.96479 },
    });
  });
});
