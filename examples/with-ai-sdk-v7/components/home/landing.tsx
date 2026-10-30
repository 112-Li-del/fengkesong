"use client";

import { useRef, useState } from "react";
import "./landing.css";

const SPOTS = [
  "栖霞古寺",
  "千佛岩",
  "舍利塔",
  "彩虹明镜",
  "明征君碑",
  "桃花涧",
];

/**
 * 转场「多伞齐开」：点击进入后 6 把伞同时重合在屏幕中心，并「同时」向外散开——所有伞飞行时长一致、
 * 同起同落，形成整齐划一的放射「绽放」；层次感由大小、方向、初始角度、自转圈数差异带来，
 * 而非飞行速度差（避免大伞显得「最慢启动」）。
 * 最大的一把（index 5）在最上层，向左侧飞出；次大的一把（index 4）紧贴其下一层，向右侧飞出。
 * 数组按「小→大」排列，DOM 后渲染的伞自然叠在前者之上。
 * 末把（index 5）触发 onLeaveDone（所有伞同时结束）。
 */
const GATE_UMBRELLAS = [
  { size: 380, flyx: "92vw", flyy: "-72vh", spin: "-640deg", rot0: "160deg" },
  { size: 430, flyx: "-92vw", flyy: "-74vh", spin: "680deg", rot0: "30deg" },
  { size: 470, flyx: "94vw", flyy: "76vh", spin: "-740deg", rot0: "240deg" },
  { size: 510, flyx: "-94vw", flyy: "78vh", spin: "780deg", rot0: "120deg" },
  { size: 580, flyx: "106vw", flyy: "0vh", spin: "-820deg", rot0: "90deg" },
  { size: 740, flyx: "-112vw", flyy: "-4vh", spin: "960deg", rot0: "0deg" },
];

function MapleLeafIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 1.8C11 4.4 8.6 5.1 6.1 4.6c.4 2.1-.8 3.2-2.8 3.9 1.8.8 2.2 2.5 1 4.3 2.1-.5 3.7.4 4.4 2.2.9-1.2 2.2-.9 3.3.9 1.1-1.8 2.4-2.1 3.3-.9.7-1.8 2.3-2.7 4.4-2.2-1.2-1.8-.8-3.5 1-4.3-2-.7-3.2-1.8-2.8-3.9-2.5.5-4.9-.2-6.1-2.8z" />
      <path
        d="M12 13.6V21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 油纸伞：红枫渐变伞面 + 伞骨 + 伞面枫叶印花 + 伞柄（微斜俯视）。
 * 每把伞独立渐变色 id，避免多伞共用一个 defs 导致的串色。
 */
function Umbrella({ id, size = 120 }: { id: string; size?: number }) {
  const gradId = `umbrella-grad-${id}`;
  const spokes = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
  const leaves = Array.from({ length: 8 }, (_, i) => (i * 360) / 8 + 22.5);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="38%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#f6a35c" />
          <stop offset="52%" stopColor="#e05a2a" />
          <stop offset="100%" stopColor="#a62212" />
        </radialGradient>
      </defs>

      {/* 伞柄 */}
      <path
        d="M60 60 L99 105"
        stroke="#7a3a1e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="99" cy="105" r="3" fill="#7a3a1e" />

      {/* 伞面 */}
      <circle
        cx="60"
        cy="60"
        r="47"
        fill={`url(#${gradId})`}
        stroke="#6f1f16"
        strokeWidth="1.6"
      />
      <circle
        cx="60"
        cy="60"
        r="41"
        fill="none"
        stroke="#fbe0b4"
        strokeWidth="0.8"
        opacity="0.28"
      />

      {/* 伞骨 */}
      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 60 + Math.cos(rad) * 44;
        const y = 60 + Math.sin(rad) * 44;
        return (
          <line
            key={deg}
            x1="60"
            y1="60"
            x2={x}
            y2={y}
            stroke="#7a1f12"
            strokeWidth="1.2"
            opacity="0.55"
          />
        );
      })}

      {/* 伞面枫叶印花（环形分布，尖朝外） */}
      {leaves.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 60 + Math.cos(rad) * 30;
        const y = 60 + Math.sin(rad) * 30;
        return (
          <path
            key={deg}
            d="M12 1.8C11 4.4 8.6 5.1 6.1 4.6c.4 2.1-.8 3.2-2.8 3.9 1.8.8 2.2 2.5 1 4.3 2.1-.5 3.7.4 4.4 2.2.9-1.2 2.2-.9 3.3.9 1.1-1.8 2.4-2.1 3.3-.9.7-1.8 2.3-2.7 4.4-2.2-1.2-1.8-.8-3.5 1-4.3-2-.7-3.2-1.8-2.8-3.9-2.5.5-4.9-.2-6.1-2.8z"
            fill="#fbe0b4"
            opacity="0.9"
            transform={`translate(${(x - 12).toFixed(2)} ${(y - 12).toFixed(2)}) rotate(${deg + 90}) scale(0.28)`}
          />
        );
      })}

      {/* 中心伞尖 */}
      <circle cx="60" cy="60" r="4" fill="#fbe0b4" />
      <circle cx="60" cy="60" r="1.8" fill="#7a1f12" />
    </svg>
  );
}

export function Landing({ onLeaveDone }: { onLeaveDone: () => void }) {
  const enterRef = useRef<HTMLButtonElement>(null);
  const [leaving, setLeaving] = useState(false);

  function enter() {
    if (leaving) return;
    setLeaving(true);
    // 尊重系统“减少动态效果”设置：直接进入，不播放开叶动画
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onLeaveDone();
    }
  }

  return (
    <div className={`landing ${leaving ? "is-burning" : ""}`}>
      {/* 落地页场景：烧屏开叶时整体淡出，露出背后已预加载的地图 */}
      <div className="landing-scene">
        <div
          className="landing-bg"
          role="img"
          aria-label="栖霞山红枫动漫风景"
        />
        <div className="landing-vignette" />

        <header className="landing-brand">
          <MapleLeafIcon size={22} />
          <span>枫客松</span>
        </header>

        <main className="landing-hero">
          <p className="landing-eyebrow">栖霞山 · 智能伴游系统</p>
          <h1 className="landing-title">栖霞山</h1>
          <p className="landing-subtitle">一座栖霞山 · 半部金陵史</p>
          <p className="landing-desc">
            漫山红枫、千年古刹、千佛名蓝…… 让我陪你游遍栖霞山的一草一木。
          </p>

          <button
            type="button"
            className="landing-enter"
            ref={enterRef}
            onClick={enter}
          >
            <MapleLeafIcon size={22} />
            <span>进入栖霞山</span>
            <span className="landing-enter-arrow">→</span>
          </button>

          <div className="landing-spots">
            {SPOTS.map((spot) => (
              <span className="landing-spot" key={spot}>
                {spot}
              </span>
            ))}
          </div>
        </main>

        <footer className="landing-footer">
          <span>枫客松 · 栖霞山智能伴游</span>
          <span className="landing-footer-sep">·</span>
          <span>红枫季</span>
        </footer>
      </div>

      {/* 多伞齐开：6 把伞同时重合在中心，同时向左右及四角放射状散开，主页随伞面揭开露出地图 */}
      {leaving && (
        <div className="landing-gate" aria-hidden="true">
          {GATE_UMBRELLAS.map((u, i) => (
            <span
              key={i}
              className="gate-umbrella"
              onAnimationEnd={
                i === GATE_UMBRELLAS.length - 1 ? onLeaveDone : undefined
              }
              style={
                {
                  width: u.size,
                  height: u.size,
                  "--flyx": u.flyx,
                  "--flyy": u.flyy,
                  "--spin": u.spin,
                  "--rot0": u.rot0,
                } as React.CSSProperties
              }
            >
              <Umbrella id={`gate-${i}`} size={u.size} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
