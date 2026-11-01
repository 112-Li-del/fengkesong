"use client";

import "./landing.css";

const SPOTS = [
  "栖霞古寺",
  "千佛岩",
  "舍利塔",
  "彩虹明镜",
  "明征君碑",
  "桃花涧",
];

/** 枫叶轮廓（24×24 viewBox），品牌图标 / 飘落枫叶共用 */
const MAPLE_LEAF_PATH =
  "M12 1.8C11 4.4 8.6 5.1 6.1 4.6c.4 2.1-.8 3.2-2.8 3.9 1.8.8 2.2 2.5 1 4.3 2.1-.5 3.7.4 4.4 2.2.9-1.2 2.2-.9 3.3.9 1.1-1.8 2.4-2.1 3.3-.9.7-1.8 2.3-2.7 4.4-2.2-1.2-1.8-.8-3.5 1-4.3-2-.7-3.2-1.8-2.8-3.9-2.5.5-4.9-.2-6.1-2.8z";

function MapleLeafIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={MAPLE_LEAF_PATH} />
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
 * 落地首页（无入场动画）：
 * 仅作为「进入栖霞山」的静态入口；点击后直接移除自身，露出背后已预加载好的地图，
 * 不再播放多伞齐开 / 烧屏等转场动画。
 */
export function Landing({ onLeaveDone }: { onLeaveDone: () => void }) {
  return (
    <div className="landing">
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

          <button type="button" className="landing-enter" onClick={onLeaveDone}>
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
    </div>
  );
}
