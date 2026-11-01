"use client";

import { useEffect, useState } from "react";
import { weatherBrief, type WeatherBrief } from "./companion-weather";
import type { WeatherSnapshot } from "./weather";

/** 地图建议板与聊天首屏共用同一份天气结论。 */
export function useWeatherBrief(intervalMs = 5 * 60 * 1000) {
  const [brief, setBrief] = useState<WeatherBrief | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (document.hidden) return;
      try {
        const response = await fetch("/api/weather/qixia", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const snapshot = (await response.json()) as WeatherSnapshot;
        if (cancelled) return;
        const next = weatherBrief(snapshot);
        if (next) setBrief(next);
      } catch {
        // 静态部署没有服务端接口时保持静默，不编造天气。
      }
    }
    void load();
    const timer = window.setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [intervalMs]);
  return brief;
}
