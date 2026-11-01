// 静态部署下的天气来源：Open-Meteo 免密钥、支持跨域，可以直接在浏览器里取。
// 服务端版本 lib/qixia-weather.ts 里的和风实况（分钟级降水、生活指数）依赖服务端密钥，
// 静态站没有服务端，这里退回到模型预报，并把这一点如实写进 notices。

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

export async function getQixiaWeatherClient(
  signal?: AbortSignal,
): Promise<WeatherSnapshot | null> {
  const result = await getWeather(
    { city: "栖霞山", date: "next_7_days", countryCode: "CN" },
    signal,
    QIXIA_LOCATION,
  );
  if (result.status !== "success") return null;
  return {
    ...result,
    provider: "open-meteo",
    timeBasis: "data",
    indices: [],
    minutely: null,
    notices: ["当前使用模型预报；分钟级降水和生活指数暂不可用。"],
    attributions: ["Open-Meteo · CC BY 4.0"],
  };
}
