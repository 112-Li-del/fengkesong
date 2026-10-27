"use client";

import {
  Cloud,
  CloudRain,
  Eye,
  Gauge,
  Mountain,
  Shirt,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";
import type { WeatherSnapshot } from "@/lib/weather";

const reading = (value: number | null | undefined, digits = 0) =>
  value == null ? "—" : value.toFixed(digits);
const clockTime = (time: string | null | undefined) =>
  time ? time.slice(11, 16) : "—";

export function weatherDetailItems(
  snapshot: WeatherSnapshot | null,
  clock: number,
) {
  const current = snapshot?.current;
  const minute = snapshot?.minutely;
  const minuteFresh =
    minute && clock - Date.parse(minute.updatedAt) < 20 * 60000;
  const points = minuteFresh
    ? minute.points.filter((p) => Date.parse(p.time) + 5 * 60000 > clock)
    : [];
  const maxRain = Math.max(0.1, ...points.map((p) => p.precipitation ?? 0));
  const dailyUv = current?.uvIndex == null;
  const uv = current?.uvIndex ?? snapshot?.dailyUvMax;
  const metrics = [
    {
      id: "gust",
      title: "阵风",
      value: current?.windGust,
      digits: 1,
      unit: "km/h",
      Icon: Wind,
      note: "短时风速变化，山脊注意防风",
    },
    {
      id: "visibility",
      title: "能见度",
      value: current?.visibility,
      digits: 1,
      unit: "km",
      Icon: Eye,
      note: "低能见度时留意路标与台阶",
    },
    {
      id: "pressure",
      title: "海平面气压",
      value: current?.pressure,
      digits: 0,
      unit: "hPa",
      Icon: Gauge,
      note: "海平面订正值，非山顶站压",
    },
    {
      id: "dew",
      title: "露点",
      value: current?.dewPoint,
      digits: 1,
      unit: "°C",
      Icon: Thermometer,
      note: "反映空气中水汽含量",
    },
    {
      id: "cloud",
      title: "云量",
      value: current?.cloudCover,
      digits: 0,
      unit: "%",
      Icon: Cloud,
      note: "天空被云层覆盖的比例",
    },
    {
      id: "uv",
      title: dailyUv
        ? "今日最高紫外线"
        : snapshot?.provider === "open-meteo"
          ? "整点紫外线"
          : "当前紫外线",
      value: uv,
      digits: 1,
      unit: "UVI",
      Icon: Sun,
      note:
        snapshot?.indices?.find((i) => i.type === "5")?.text ??
        (uv == null
          ? "等待紫外线数据"
          : uv < 3
            ? "较弱，长时间户外仍需防晒"
            : uv < 6
              ? "中等，建议遮阳并涂抹防晒霜"
              : "较强，减少长时间直接曝晒"),
    },
  ];
  const indices = [
    { type: "3", title: "穿衣建议", Icon: Shirt },
    { type: "6", title: "旅游指数", Icon: Mountain },
  ];
  return [
    {
      id: "minutely",
      className: "weather-wide-card",
      colSpan: 4,
      content: (
        <>
          <div className="weather-tile-heading">
            <span>
              <CloudRain size={16} />
              未来两小时降水
            </span>
            <span className="weather-estimate-badge">5分钟一格</span>
          </div>
          <div className="weather-minute-summary">
            {points.length ? minute!.summary : "分钟级降水暂不可用"}
          </div>
          {points.length ? (
            <>
              <div
                className="weather-rain-chart"
                role="img"
                aria-label="未来两小时降水柱状图，每格为五分钟累计降水量，单位毫米"
              >
                {points.map((p) => (
                  <div
                    key={p.time}
                    className="weather-rain-column"
                    title={`${clockTime(p.time)} · ${reading(p.precipitation, 2)} mm / 5分钟 · ${p.type === "snow" ? "雪" : "降水"}`}
                  >
                    <span
                      style={{
                        height:
                          p.precipitation == null || p.precipitation === 0
                            ? 0
                            : `${Math.max(3, (p.precipitation / maxRain) * 100)}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="weather-chart-axis">
                <span>{clockTime(points[0]?.time)}</span>
                <span>每格累计量 · mm / 5分钟</span>
                <span>{clockTime(points.at(-1)?.time)}</span>
              </div>
              <p className="weather-detail-note">
                和风天气 · 更新 {clockTime(minute!.updatedAt)} ·
                预报会变化，不保证降雨起止时刻。
              </p>
            </>
          ) : (
            <p className="weather-detail-note">
              暂时无法判断几分钟后下雨或停雨，请结合下方逐小时预报和现场天气安排登山。
            </p>
          )}
        </>
      ),
    },
    ...metrics.map(({ id, title, value, digits, unit, Icon, note }) => ({
      id,
      content: (
        <>
          <div className="weather-tile-heading">
            <span>{title}</span>
            <Icon size={18} />
          </div>
          <div className="weather-metric">
            {reading(value, digits)}
            <small>{unit}</small>
          </div>
          <p className="weather-detail-note">
            {value == null ? "该项数据暂不可用" : note}
          </p>
        </>
      ),
    })),
    ...indices.map(({ type, title, Icon }) => {
      const index = snapshot?.indices?.find((i) => i.type === type);
      return {
        id: `index-${type}`,
        content: (
          <>
            <div className="weather-tile-heading">
              <span>{title}</span>
              <Icon size={18} />
            </div>
            <div className="weather-index-category">
              {index?.category ?? "暂无指数"}
            </div>
            <p className="weather-detail-note">
              {index?.text ??
                "天气指数暂不可用，请根据气温、风雨与个人体力安排出行。"}
            </p>
            {index && (
              <span className="weather-index-date">
                {index.date} · 和风天气
              </span>
            )}
          </>
        ),
      };
    }),
    {
      id: "astronomy",
      colSpan: 2,
      content: (
        <>
          <div className="weather-tile-heading">
            <span>日出与日落</span>
            <Sun size={18} />
          </div>
          <div className="weather-sun-times">
            <div>
              <Sunrise size={22} />
              <span>日出</span>
              <strong>{clockTime(snapshot?.astronomy?.sunrise)}</strong>
            </div>
            <div>
              <Sunset size={22} />
              <span>日落</span>
              <strong>{clockTime(snapshot?.astronomy?.sunset)}</strong>
            </div>
          </div>
          <p className="weather-detail-note">
            {snapshot?.astronomy?.date ?? "今日"} · 北京时间 ·{" "}
            {snapshot?.astronomy?.source ?? "等待天文数据"}
            。请结合闭园时间提前下山，山谷可能更早变暗。
          </p>
        </>
      ),
    },
  ];
}
