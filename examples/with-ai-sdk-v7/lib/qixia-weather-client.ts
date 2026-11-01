// 静态部署下的天气来源：Open-Meteo 免密钥、支持跨域，可以直接在浏览器里取。
// 服务端版本 lib/qixia-weather.ts 用的和风实况（分钟级降水）依赖服务端密钥，静态站没有
// 服务端，这里退回到模型预报，并把这一点如实写进 notices。
//
// 生活指数（穿衣 / 旅游 / 紫外线）是例外：和风 indices 接口开放跨域，且这些指数每天
// 只变一次，属于公共信息，所以由浏览器直连和风取，保持与本地一致的官方口径。
// 仅这一项使用前端可见的 key（NEXT_PUBLIC_QWEATHER_*），其余密钥仍只在服务端。

import { getWeather, type WeatherSnapshot } from "./weather";

const QIXIA_LOCATION = {
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

type WeatherIndex = NonNullable<WeatherSnapshot["indices"]>[number];

// 构建期内联；未配置时静默跳过，退回「生活指数暂不可用」的旧提示。
const QWEATHER_HOST = process.env.NEXT_PUBLIC_QWEATHER_API_HOST;
const QWEATHER_KEY = process.env.NEXT_PUBLIC_QWEATHER_API_KEY;

function todayInShanghai() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** 直连和风生活指数（3 穿衣 / 6 旅游 / 5 紫外线）。失败一律返回空数组，不影响主流程。 */
async function getQixiaIndices(signal?: AbortSignal): Promise<WeatherIndex[]> {
  if (!QWEATHER_HOST || !QWEATHER_KEY) return [];
  try {
    const host = QWEATHER_HOST.startsWith("https://")
      ? QWEATHER_HOST
      : `https://${QWEATHER_HOST}`;
    const url = new URL("/v7/indices/1d", host);
    url.search = new URLSearchParams({
      location: `${QIXIA_LOCATION.longitude.toFixed(2)},${QIXIA_LOCATION.latitude.toFixed(2)}`,
      type: "3,6,5",
      lang: "zh",
    }).toString();
    const response = await fetch(url, {
      headers: { "X-QW-Api-Key": QWEATHER_KEY },
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(7000)])
        : AbortSignal.timeout(7000),
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data: {
      code?: string;
      daily?: {
        date?: string;
        type?: string | number;
        name?: string;
        category?: string;
        text?: string | null;
      }[];
    } = await response.json();
    if (data.code !== "200" || !Array.isArray(data.daily)) return [];
    const today = todayInShanghai();
    return data.daily
      .filter((item) => item.date === today && item.category)
      .map((item) => ({
        date: item.date!,
        type: String(item.type ?? ""),
        name: item.name ?? "",
        category: item.category!,
        text: item.text || "暂无详细建议",
      }));
  } catch {
    return [];
  }
}

export async function getQixiaWeatherClient(
  signal?: AbortSignal,
): Promise<WeatherSnapshot | null> {
  const [result, indices] = await Promise.all([
    getWeather(
      { city: "栖霞山", date: "next_7_days", countryCode: "CN" },
      signal,
      QIXIA_LOCATION,
    ),
    getQixiaIndices(signal),
  ]);
  if (result.status !== "success") return null;
  return {
    ...result,
    provider: "open-meteo",
    timeBasis: "data",
    indices,
    minutely: null,
    notices: [
      indices.length
        ? "当前使用模型预报；分钟级降水暂不可用。"
        : "当前使用模型预报；分钟级降水和生活指数暂不可用。",
    ],
    attributions: indices.length
      ? ["Open-Meteo · CC BY 4.0", "和风天气 · QWeather"]
      : ["Open-Meteo · CC BY 4.0"],
  };
}
