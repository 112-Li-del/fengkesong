"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  Cloud,
  CloudRain,
  ChevronDown,
  Droplets,
  MapPin,
  Navigation,
  RefreshCw,
  Sun,
  Moon,
  Thermometer,
  Wind,
  Clock3,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import type { WeatherSnapshot } from "@/lib/weather";
import { MagicBento } from "./magic-bento";
import "./weather.css";

function number(value: number | null | undefined, digits = 0) {
  return value == null ? "—" : value.toFixed(digits);
}
function timeRange(time: string, seconds: number) {
  const end = new Date(`${time}Z`);
  const start = new Date(end.getTime() - seconds * 1000);
  return `${start.toISOString().slice(11, 16)}–${time.slice(11, 16)}`;
}
function windDirection(degrees: number | null | undefined) {
  return degrees == null
    ? "风向暂无数据"
    : `${["北", "东北", "东", "东南", "南", "西南", "西", "西北"][Math.round(degrees / 45) % 8]}风`;
}
function ConditionIcon({
  condition,
  isDay,
  size = 24,
}: {
  condition: string;
  isDay?: boolean | null;
  size?: number;
}) {
  if (/雨|雷/.test(condition))
    return <CloudRain size={size} strokeWidth={1.3} />;
  if (/晴/.test(condition))
    return isDay === false ? (
      <Moon size={size} strokeWidth={1.3} />
    ) : (
      <Sun size={size} strokeWidth={1.3} />
    );
  return <Cloud size={size} strokeWidth={1.3} />;
}

export function WeatherDashboard() {
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [clock, setClock] = useState(() => Date.now());
  const [slide, setSlide] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDetailsElement>(null);
  const controller = useRef<AbortController | null>(null);
  const refresh = useCallback(async (force = false) => {
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    setRefreshing(true);
    try {
      const response = await fetch(
        `/api/weather/qixia${force ? "?refresh=1" : ""}`,
        { signal: next.signal, cache: "no-store" },
      );
      if (!response.ok) throw new Error("Weather unavailable");
      const data: WeatherSnapshot = await response.json();
      if (
        data.status !== "success" ||
        data.location.name !== "栖霞山" ||
        !Array.isArray(data.hourly)
      )
        throw new Error("Unexpected location");
      setSnapshot(data);
      setFailed(false);
      setClock(Date.now());
    } catch {
      if (!next.signal.aborted) setFailed(true);
    } finally {
      if (!next.signal.aborted) setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => {
      if (!document.hidden) void refresh();
    }, 300000);
    const tick = window.setInterval(() => setClock(Date.now()), 60000);
    const resume = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    return () => {
      controller.current?.abort();
      clearTimeout(initial);
      clearInterval(timer);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("online", resume);
    };
  }, [refresh]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const current = snapshot?.current;
  const hours = snapshot?.hourly?.slice(0, 6) ?? [];
  const old = snapshot
    ? clock - new Date(`${snapshot.current.time}+08:00`).getTime() > 45 * 60000
    : false;
  const dateTime = current?.time.replace("T", " ") ?? "等待气象数据";
  const fetchedTime = snapshot
    ? new Date(snapshot.retrievedAt).toLocaleTimeString("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
  const slides = current
    ? [
        {
          id: "temp",
          icon: (
            <ConditionIcon
              condition={current.condition}
              isDay={current.isDay ?? null}
              size={14}
            />
          ),
          text: `${number(current.temperature, 1)}°C ${current.condition}`,
        },
        {
          id: "feels",
          icon: <Thermometer size={13} />,
          text: `体感 ${number(current.feelsLike, 1)}°C`,
        },
        {
          id: "humidity",
          icon: <Droplets size={13} />,
          text: `湿度 ${number(current.humidity)}%`,
        },
        {
          id: "wind",
          icon: <Wind size={13} />,
          text:
            current.windSpeed == null
              ? "风速暂无数据"
              : `${number(current.windSpeed, 1)} km/h ${windDirection(current.windDirection)}`,
        },
        {
          id: "rain",
          icon: <CloudRain size={13} />,
          text: `降水 ${number(current.precipitation, 1)}mm`,
        },
      ]
    : [
        {
          id: "wait",
          icon: <Cloud size={13} />,
          text: failed ? "天气暂时不可用" : "正在获取天气",
        },
      ];
  useEffect(() => {
    if (reduced || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [slides.length, reduced]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!panel.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  const items = [
    {
      id: "current",
      className: "weather-current",
      colSpan: 2,
      rowSpan: 2,
      content: (
        <>
          <div className="weather-tile-heading">
            <span>
              <MapPin size={14} />
              栖霞山附近
            </span>
            <span className="weather-estimate-badge">模型估算</span>
          </div>
          <div className="weather-current-reading">
            <div>
              <span className="weather-big-temperature">
                {number(current?.temperature, 1)}
              </span>
              <span className="weather-big-unit">°C</span>
            </div>
            <div className="weather-main-icon">
              <ConditionIcon
                condition={current?.condition ?? ""}
                isDay={current?.isDay ?? null}
                size={68}
              />
            </div>
          </div>
          <div className="weather-current-description">
            <strong>
              {current?.condition ?? (failed ? "暂时无法获取" : "正在获取天气")}
            </strong>
            <span>体感 {number(current?.feelsLike, 1)}°C</span>
          </div>
          <div className="weather-time">
            <Clock3 size={12} />
            <span>数据对应时间 · {dateTime}</span>
          </div>
          <div className="weather-current-foot">
            <span>南京 · 栖霞山</span>
            <span>当地时间 UTC+8</span>
          </div>
        </>
      ),
    },
    {
      id: "humidity",
      content: (
        <>
          <div className="weather-tile-heading">
            <span>相对湿度</span>
            <Droplets size={18} />
          </div>
          <div className="weather-metric">
            {number(current?.humidity)}
            <small>%</small>
          </div>
          <div className="weather-humidity-track">
            <span
              style={{
                width: `${Math.min(100, Math.max(0, current?.humidity ?? 0))}%`,
              }}
            />
          </div>
          <span className="weather-metric-note">与当前温度同一时刻</span>
        </>
      ),
    },
    {
      id: "wind",
      content: (
        <>
          <div className="weather-tile-heading">
            <span>风速</span>
            <Wind size={18} />
          </div>
          <div className="weather-metric">
            {number(current?.windSpeed, 1)}
            <small>km/h</small>
          </div>
          <span className="weather-wind-direction">
            <Navigation
              size={12}
              style={{ transform: `rotate(${current?.windDirection ?? 0}deg)` }}
            />
            {windDirection(current?.windDirection)}
          </span>
        </>
      ),
    },
    {
      id: "rain",
      colSpan: 2,
      content: (
        <>
          <div className="weather-tile-heading">
            <span>当前时段降水估算</span>
            <CloudRain size={18} />
          </div>
          <div className="weather-rain-reading">
            <div className="weather-metric">
              {number(current?.precipitation, 1)}
              <small>mm</small>
            </div>
            <span>
              {current?.intervalSeconds
                ? timeRange(current.time, current.intervalSeconds)
                : "统计时段待返回"}
              <br />
              模型累计量，非现场雨量计
            </span>
          </div>
        </>
      ),
    },
    {
      id: "hourly",
      className: "weather-hourly-card",
      colSpan: 4,
      content: (
        <>
          <div className="weather-tile-heading">
            <span>逐小时预报</span>
            <span className="weather-hourly-label">具体时段 · 降水概率</span>
          </div>
          <div className="weather-hourly-list">
            {hours.length ? (
              hours.map((hour) => (
                <div className="weather-hour" key={hour.time}>
                  <span className="weather-hour-range">
                    {hour.time.slice(11, 16)}
                  </span>
                  <ConditionIcon
                    condition={hour.condition}
                    isDay={hour.isDay}
                    size={23}
                  />
                  <strong>{number(hour.temperature, 1)}°</strong>
                  <span className="weather-hour-condition">
                    {hour.condition}
                  </span>
                  <span className="weather-hour-range">
                    {timeRange(hour.time, 3600)}
                  </span>
                  <span className="weather-hour-rain">
                    <Droplets size={10} />
                    {number(hour.precipitationProbability)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="weather-hourly-empty">
                {failed
                  ? "暂时无法获取逐小时预报，请重试。"
                  : "正在获取逐小时预报…"}
              </p>
            )}
          </div>
          <div className="weather-forecast-note">
            温度和天气对应标注时刻；降水概率对应此前一小时，不表示必定下雨。
          </div>
        </>
      ),
    },
  ];
  return (
    <details className="map-weather-panel" ref={panel} open={open}>
      <summary
        className="weather-summary"
        onClick={(event) => {
          event.preventDefault();
          setOpen((prev) => !prev);
        }}
      >
        <span className="weather-summary-icon">
          <ConditionIcon
            condition={current?.condition ?? ""}
            isDay={current?.isDay ?? null}
            size={16}
          />
        </span>
        <span className="weather-summary-title">栖霞山天气</span>
        <div className="weather-ticker">
          <div
            className="weather-ticker-track"
            style={{
              transform: `translateY(-${(slide % slides.length) * 20}px)`,
            }}
          >
            {slides.map((entry) => (
              <div
                className={`weather-ticker-item${slides.length === 1 ? " is-pending" : ""}`}
                key={entry.id}
              >
                {entry.icon}
                <span className="weather-ticker-value">{entry.text}</span>
              </div>
            ))}
          </div>
        </div>
        <ChevronDown size={15} className="weather-summary-chevron" />
      </summary>
      <div className="weather-panel-body">
        <section className="qixia-weather-stage" aria-label="栖霞山常驻天气">
          <div className="qixia-weather-wrap">
            <div className="qixia-section-heading">
              <div>
                <div className="qixia-kicker">
                  <span /> QIXIA MOUNTAIN
                </div>
                <h1>山间天气</h1>
                <p>只关注栖霞山附近，让出发多一份把握。</p>
              </div>
              <button
                className="weather-refresh"
                disabled={refreshing}
                onClick={() => void refresh(true)}
                aria-label="刷新栖霞山天气"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "is-spinning" : ""}
                />
                <span>{refreshing ? "更新中" : "刷新"}</span>
              </button>
            </div>
            {(failed || old) && (
              <div className="weather-update-notice" role="status">
                <AlertCircle size={14} />
                {failed
                  ? snapshot
                    ? "更新失败，以下保留上次获取的数据，请注意数据时间。"
                    : "天气接口暂时不可用，暂不显示天气数值。"
                  : "气象数据已超过45分钟，可能已过时，请谨慎参考。"}
              </div>
            )}
            <MagicBento items={items} />
            <div className="weather-data-footer">
              <span>每5分钟自动更新 · 最近获取 {fetchedTime}</span>
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noreferrer"
              >
                数据来源 Open-Meteo <ArrowUpRight size={11} />
              </a>
            </div>
            <p className="weather-truth-note">
              当前天气与预报均来自气象模型，可能与山中具体位置的实际感受不同，不是景区气象站实测。
            </p>
          </div>
        </section>
      </div>
    </details>
  );
}
