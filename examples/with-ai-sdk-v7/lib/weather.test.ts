import { afterEach, describe, expect, it, vi } from "vitest";
import { getWeather } from "./weather";

const nanjing = {
  id: 1799962,
  name: "南京",
  country: "中国",
  admin1: "江苏",
  latitude: 32.06167,
  longitude: 118.77778,
  feature_code: "PPLA",
};
const dates = [
  "2026-10-27",
  "2026-10-28",
  "2026-10-29",
  "2026-10-30",
  "2026-10-31",
  "2026-11-01",
  "2026-11-02",
];
function forecast() {
  return {
    timezone: "Asia/Shanghai",
    current: {
      time: "2026-10-27T08:15",
      temperature_2m: 21.7,
      apparent_temperature: 20.1,
      relative_humidity_2m: 64,
      weather_code: 2,
      wind_speed_10m: 8.4,
    },
    daily: {
      time: dates,
      weather_code: [2, 61, 3, 0, 1, 2, 3],
      temperature_2m_max: [23.2, 18.4, 21.6, 24.1, 22.5, 20.7, 21.3],
      temperature_2m_min: [15.1, 13.2, 14.6, 16.3, 15.4, 14.9, 13.6],
      precipitation_probability_max: [12, 57, 34, 3, 8, 17, 23],
    },
  };
}
const districtData = [
  {
    adcode: 100000,
    name: "中华人民共和国",
    level: "country",
    parent: null,
    lng: 116.3683244,
    lat: 39.915085,
  },
  {
    adcode: 330000,
    name: "浙江省",
    level: "province",
    parent: 100000,
    lng: 120.153576,
    lat: 30.287459,
  },
  {
    adcode: 330100,
    name: "杭州市",
    level: "city",
    parent: 330000,
    lng: 120.153576,
    lat: 30.287459,
  },
  {
    adcode: 330106,
    name: "西湖区",
    level: "district",
    parent: 330100,
    lng: 120.026268,
    lat: 30.279164,
  },
  {
    adcode: 320000,
    name: "江苏省",
    level: "province",
    parent: 100000,
    lng: 118.767413,
    lat: 32.041544,
  },
  {
    adcode: 320100,
    name: "南京市",
    level: "city",
    parent: 320000,
    lng: 118.767413,
    lat: 32.041544,
  },
  {
    adcode: 320113,
    name: "栖霞区",
    level: "district",
    parent: 320100,
    lng: 118.808702,
    lat: 32.102147,
  },
  {
    adcode: 320106,
    name: "鼓楼区",
    level: "district",
    parent: 320100,
    lng: 118.769739,
    lat: 32.066966,
  },
  {
    adcode: 350000,
    name: "福建省",
    level: "province",
    parent: 100000,
    lng: 119.306239,
    lat: 26.075302,
  },
  {
    adcode: 350100,
    name: "福州市",
    level: "city",
    parent: 350000,
    lng: 119.306239,
    lat: 26.075302,
  },
  {
    adcode: 350102,
    name: "鼓楼区",
    level: "district",
    parent: 350100,
    lng: 119.29929,
    lat: 26.082284,
  },
  {
    adcode: 370000,
    name: "山东省",
    level: "province",
    parent: 100000,
    lng: 117.000923,
    lat: 36.675807,
  },
  {
    adcode: 370600,
    name: "烟台市",
    level: "city",
    parent: 370000,
    lng: 121.391382,
    lat: 37.539297,
  },
  {
    adcode: 370686,
    name: "栖霞市",
    level: "district",
    parent: 370600,
    lng: 120.834097,
    lat: 37.305854,
  },
];
function respond(locations = [nanjing], weather: unknown = forecast()) {
  const fetchMock = vi.spyOn(globalThis, "fetch");
  fetchMock.mockImplementation(
    async (input) =>
      new Response(
        JSON.stringify(
          String(input).includes("geo.datav.aliyun.com")
            ? districtData
            : String(input).includes("geocoding-api")
              ? { results: locations }
              : weather,
        ),
        { headers: { "content-type": "application/json" } },
      ),
  );
  return fetchMock;
}
afterEach(() => {
  vi.restoreAllMocks();
});

describe("weather tool", () => {
  it("uses destination-local forecast dates for tomorrow and keeps current conditions separate", async () => {
    const fetchMock = respond();
    const result = await getWeather({
      city: "南京",
      date: "tomorrow",
      countryCode: "CN",
    });
    expect(result.status).toBe("success");
    if (result.status !== "success") throw new Error("Expected weather result");
    expect(result.daily).toEqual([
      {
        date: "2026-10-28",
        condition: "小雨",
        maxTemperature: 18.4,
        minTemperature: 13.2,
        maxPrecipitationProbability: 57,
      },
    ]);
    expect(result.current.temperature).toBe(21.7);
    expect(result.timezone).toBe("Asia/Shanghai");
    expect(result.source.name).toBe("Open-Meteo");
    const search = new URL(String(fetchMock.mock.calls[0]![0]));
    expect(search.searchParams.get("countryCode")).toBe("CN");
    const request = new URL(String(fetchMock.mock.calls[1]![0]));
    expect(request.searchParams.get("latitude")).toBe("32.06167");
    expect(request.searchParams.get("timezone")).toBe("auto");
  });
  it("returns seven distinct daily forecasts when a week is requested", async () => {
    respond();
    const result = await getWeather({ city: "南京", date: "next_7_days" });
    if (result.status !== "success") throw new Error("Expected weather result");
    expect(result.daily.map((day) => day.date)).toEqual(dates);
    expect(result.daily[6]!.minTemperature).toBe(13.6);
  });
  it("asks for clarification instead of choosing between same-name cities", async () => {
    const fetchMock = respond([
      { ...nanjing, id: 1, name: "同名市", feature_code: "PPLA2" },
      {
        ...nanjing,
        id: 2,
        name: "同名市",
        admin1: "其他省",
        feature_code: "PPLA2",
      },
    ]);
    const result = await getWeather({ city: "同名市", date: "today" });
    expect(result.status).toBe("needs_clarification");
    if (result.status === "needs_clarification")
      expect(result.candidates).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("does not make a weather request for an unknown place", async () => {
    const fetchMock = respond([]);
    expect(
      (await getWeather({ city: "找不到的景点", date: "today" })).status,
    ).toBe("not_found");
    expect(
      fetchMock.mock.calls.some((args) =>
        String(args[0]).includes("api.open-meteo.com/v1/forecast"),
      ),
    ).toBe(false);
  });
  it("rejects unavailable dates instead of substituting the nearest forecast", async () => {
    respond();
    const result = await getWeather({ city: "南京", date: "2026-11-15" });
    expect(result.status).toBe("date_out_of_range");
    expect(result).not.toHaveProperty("current");
    expect(result).not.toHaveProperty("daily");
  });
  it("keeps missing rainfall as null instead of reporting a zero percent chance", async () => {
    const data = forecast();
    respond([nanjing], {
      ...data,
      daily: {
        ...data.daily,
        precipitation_probability_max: [null, 57, 34, 3, 8, 17, 23],
      },
    });
    const result = await getWeather({ city: "南京", date: "today" });
    if (result.status !== "success") throw new Error("Expected weather result");
    expect(result.daily[0]!.maxPrecipitationProbability).toBeNull();
  });
  it("reports malformed upstream data without inventing weather", async () => {
    respond([nanjing], { current: { temperature_2m: "not-a-number" } });
    const result = await getWeather({ city: "南京", date: "today" });
    expect(result.status).toBe("unavailable");
    expect(result).not.toHaveProperty("current");
  });
  it("reports provider failures and propagates a cancelled request", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new DOMException("The request timed out", "TimeoutError"),
    );
    expect((await getWeather({ city: "南京", date: "today" })).status).toBe(
      "unavailable",
    );
    const signal = AbortSignal.abort();
    await expect(
      getWeather({ city: "南京", date: "today" }, signal),
    ).rejects.toThrow();
  });
  it.each(["南京栖霞区", "栖霞区, 南京, 江苏", "江苏省南京市栖霞区"])(
    "resolves district addresses without substituting city-center weather: %s",
    async (city) => {
      const mock = respond([]);
      const result = await getWeather({
        city,
        date: "today",
        countryCode: "CN",
      });
      expect(result.status).toBe("success");
      if (result.status !== "success")
        throw new Error("Expected district weather");
      expect(result.location.name).toBe("栖霞区");
      expect(result.location.label).toContain("南京市");
      expect(result.location.latitude).not.toBe(nanjing.latitude);
      const call = mock.mock.calls.find((args) =>
        String(args[0]).includes("api.open-meteo.com/v1/forecast"),
      );
      expect(new URL(String(call![0])).searchParams.get("latitude")).toBe(
        String(result.location.latitude),
      );
    },
  );
  it("keeps ambiguous district names ambiguous across provinces", async () => {
    const mock = respond([]);
    const result = await getWeather({ city: "鼓楼区", date: "today" });
    expect(result.status).toBe("needs_clarification");
    expect(
      mock.mock.calls.some((args) =>
        String(args[0]).includes("api.open-meteo.com/v1/forecast"),
      ),
    ).toBe(false);
  });
  it("does not substitute a namesake district in a conflicting province", async () => {
    respond([]);
    expect(
      (await getWeather({ city: "栖霞区, 山东", date: "today" })).status,
    ).toBe("not_found");
  });
  it("converts GCJ-02 reference coordinates before querying the WGS84 weather grid", async () => {
    respond([]);
    const result = await getWeather({ city: "杭州市西湖区", date: "today" });
    if (result.status !== "success")
      throw new Error("Expected district weather");
    expect(result.location.longitude).toBeCloseTo(120.021519, 4);
    expect(result.location.latitude).toBeCloseTo(30.281543, 4);
  });
  it("does not use the Chinese district index when the requested country differs", async () => {
    const mock = respond([]);
    expect(
      (await getWeather({ city: "栖霞区", countryCode: "JP", date: "today" }))
        .status,
    ).toBe("not_found");
    expect(
      mock.mock.calls.some((args) =>
        String(args[0]).includes("geo.datav.aliyun.com"),
      ),
    ).toBe(false);
  });
  it("separates current rain from the day's worst condition and preserves hourly timestamps", async () => {
    const data = forecast();
    const mock = respond([nanjing], {
      ...data,
      current: {
        ...data.current,
        weather_code: 0,
        precipitation: 0,
        interval: 900,
        wind_direction_10m: 25,
        is_day: 1,
      },
      daily: { ...data.daily, weather_code: [51, 61, 3, 0, 1, 2, 3] },
      hourly: {
        time: ["2026-10-27T08:00", "2026-10-27T09:00", "2026-10-27T10:00"],
        temperature_2m: [21, 22, 23],
        is_day: [1, 1, 0],
        weather_code: [0, 0, 51],
        precipitation_probability: [0, 12, null],
        precipitation: [0, 0, null],
      },
    });
    const result = await getWeather({ city: "南京", date: "today" });
    if (result.status !== "success") throw new Error("Expected weather");
    expect(result.current).toMatchObject({
      condition: "晴",
      precipitation: 0,
      intervalSeconds: 900,
      windDirection: 25,
      isDay: true,
    });
    expect(result.daily[0]!.condition).toBe("小毛毛雨");
    expect(result.hourly).toEqual([
      {
        time: "2026-10-27T09:00",
        isDay: true,
        temperature: 22,
        condition: "晴",
        precipitationProbability: 12,
        precipitation: 0,
      },
      {
        time: "2026-10-27T10:00",
        isDay: false,
        temperature: 23,
        condition: "小毛毛雨",
        precipitationProbability: null,
        precipitation: null,
      },
    ]);
    const query = new URL(String(mock.mock.calls[1]![0]));
    expect(query.searchParams.get("hourly")).toContain(
      "precipitation_probability",
    );
    expect(result.units.precipitation).toBe("mm");
  });
  it("rejects mismatched hourly arrays rather than associating rain with the wrong time", async () => {
    respond([nanjing], {
      ...forecast(),
      hourly: {
        time: ["2026-10-27T09:00"],
        temperature_2m: [21],
        weather_code: [0],
        precipitation_probability: [],
        precipitation: [0],
      },
    });
    expect((await getWeather({ city: "南京", date: "today" })).status).toBe(
      "unavailable",
    );
  });
});
