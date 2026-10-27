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
const request = (force = false) =>
  new Request(
    "http://localhost/api/weather/qixia" + (force ? "?refresh=1" : ""),
  );
beforeEach(() => {
  vi.resetModules();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
describe("resident Qixia weather endpoint", () => {
  it("serves mountain data without an LLM and reuses data for five minutes", async () => {
    const fetchMock = provider();
    const { GET } = await import("./route");
    vi.useFakeTimers();
    const first = await GET(request());
    expect(first.status).toBe(200);
    expect(await first.json()).toMatchObject({
      location: { name: "栖霞山", latitude: 32.16043, longitude: 118.96479 },
      current: { temperature: 19, precipitation: 0 },
      hourly: [{ time: "2026-10-27T13:00", precipitationProbability: 0 }],
    });
    expect((await GET(request())).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(300001);
    expect((await GET(request())).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(
      fetchMock.mock.calls.every(([url]) =>
        /geocoding-api.open-meteo.com|api.open-meteo.com/.test(String(url)),
      ),
    ).toBe(true);
  });
  it("allows a manual refresh and returns failure rather than disguising stale data as fresh", async () => {
    const mock = provider();
    const { GET } = await import("./route");
    await GET(request());
    mock.mockRejectedValue(new Error("offline"));
    const response = await GET(request(true));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ status: "unavailable" });
    expect((await GET(request())).status).toBe(200);
  });
  it("never substitutes Nanjing city-center data for the mountain card", async () => {
    provider({
      ...qixia,
      name: "南京",
      latitude: 32.06167,
      longitude: 118.77778,
    });
    const { GET } = await import("./route");
    const response = await GET(request());
    expect(response.status).toBe(503);
    expect(await response.json()).not.toHaveProperty("current");
  });
});
