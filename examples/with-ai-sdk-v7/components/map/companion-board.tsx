"use client";

import {
  BellRing,
  ChevronDown,
  CloudRain,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useState } from "react";
import type { WeatherBrief } from "@/lib/companion-weather";
import type { Suggestion } from "@/lib/companion";

const KIND_LABEL: Record<Suggestion["kind"], string> = {
  arrive: "到达",
  approach: "接近",
  care: "顺路",
  facility: "设施",
};

type Props = {
  suggestions: Suggestion[];
  weather?: WeatherBrief | null;
  onOpen: (suggestion: Suggestion) => void;
  onDismiss: (id: string) => void;
  onClear: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
};

export function CompanionBoard({
  suggestions,
  weather,
  onOpen,
  onDismiss,
  onClear,
  voiceEnabled,
  onToggleVoice,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      className={`companion-board${collapsed ? " is-collapsed" : ""}`}
      aria-label="霞宝建议"
    >
      <header className="companion-board-head">
        <span className="companion-board-title">
          <BellRing size={15} />
          霞宝
        </span>
        <small>
          {suggestions.length ? `${suggestions.length} 条建议` : "待命中"}
        </small>
        {suggestions.length > 0 && !collapsed && (
          <button
            type="button"
            className="companion-board-clear"
            onClick={onClear}
          >
            清空
          </button>
        )}
        <button
          type="button"
          className={`companion-board-voice${voiceEnabled ? " is-on" : ""}`}
          aria-pressed={voiceEnabled}
          aria-label={voiceEnabled ? "关闭语音播报" : "开启语音播报"}
          onClick={onToggleVoice}
        >
          {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
        <button
          type="button"
          className="companion-board-toggle"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "展开霞宝建议" : "收起霞宝建议"}
          onClick={() => setCollapsed((value) => !value)}
        >
          <ChevronDown size={14} />
        </button>
      </header>
      {!collapsed && weather && (
        <section className="companion-weather" aria-label="霞宝天气建议">
          <div className="companion-weather-head">
            <CloudRain size={14} />
            <span>天气 · {weather.source}</span>
          </div>
          <strong>{weather.headline}</strong>
          <ul>
            {weather.items.slice(0, 3).map((item) => (
              <li key={item.id}>
                <b>{item.title}</b>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
          <small>
            山顶代表点 · 数据{" "}
            {new Date(weather.at).toLocaleTimeString("zh-CN", {
              hour12: false,
            })}{" "}
            · 非景区实测
          </small>
        </section>
      )}
      {collapsed ? null : suggestions.length === 0 ? (
        <p className="companion-board-empty">
          靠近景点时，这里会不断刷新新的建议。
        </p>
      ) : (
        <ul className="companion-board-list" aria-live="polite">
          {suggestions.map((item) => (
            <li key={item.id} className={`companion-card kind-${item.kind}`}>
              <div className="companion-card-top">
                <span className="companion-card-kind">
                  {KIND_LABEL[item.kind]}
                </span>
                <button
                  type="button"
                  className="companion-card-close"
                  aria-label={`关闭${item.placeName}的建议`}
                  onClick={() => onDismiss(item.id)}
                >
                  <X size={13} />
                </button>
              </div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <button
                type="button"
                className="companion-card-open"
                onClick={() => onOpen(item)}
              >
                {item.action === "locate" ? "在地图上看" : "听听讲解"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
