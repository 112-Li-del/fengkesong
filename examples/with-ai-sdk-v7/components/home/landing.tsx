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

/** 枫叶轮廓（24×24 viewBox），品牌图标 / 伞面印花 / 飘落枫叶共用 */
const MAPLE_LEAF_PATH =
  "M12 1.8C11 4.4 8.6 5.1 6.1 4.6c.4 2.1-.8 3.2-2.8 3.9 1.8.8 2.2 2.5 1 4.3 2.1-.5 3.7.4 4.4 2.2.9-1.2 2.2-.9 3.3.9 1.1-1.8 2.4-2.1 3.3-.9.7-1.8 2.3-2.7 4.4-2.2-1.2-1.8-.8-3.5 1-4.3-2-.7-3.2-1.8-2.8-3.9-2.5.5-4.9-.2-6.1-2.8z";

/**
 * 转场「多伞齐开」（参考《王者荣耀》万象棋·长安舞榭）：
 * 点击进入后 6 把朱红鎏金伞先在屏幕中心收拢，再同步撑开、旋停展示并同时散场；
 * 地图在伞面撑开后才从伞下逐步显露，不在转场开始时抢先出现。
 * 向左右 + 四角放射状旋转飞出；每把伞大小、倾斜、初始角度、自转圈数不同，层层重叠。
 * 最大的一把（index 5）在最上层向左飞出，次大的一把（index 4）紧贴其下一层向右飞出。
 * 配合金色祥云流动、零星红枫飘落、斜向暖金光束与雾气，地图随伞面从中央亮起。
 */
const GATE_UMBRELLAS = [
  {
    size: 420,
    variant: "lotus" as const,
    flyx: "60vw",
    flyy: "-82vh",
    spin: "-540deg",
    rot0: "150deg",
    tilt: "-12deg",
    squash: 0.86,
  },
  {
    size: 460,
    variant: "gold" as const,
    flyx: "-64vw",
    flyy: "-80vh",
    spin: "600deg",
    rot0: "20deg",
    tilt: "10deg",
    squash: 0.84,
  },
  {
    size: 520,
    variant: "gold" as const,
    flyx: "70vw",
    flyy: "74vh",
    spin: "-640deg",
    rot0: "250deg",
    tilt: "-8deg",
    squash: 0.9,
  },
  {
    size: 560,
    variant: "lotus" as const,
    flyx: "-70vw",
    flyy: "78vh",
    spin: "680deg",
    rot0: "110deg",
    tilt: "12deg",
    squash: 0.88,
  },
  {
    size: 640,
    variant: "gold" as const,
    flyx: "108vw",
    flyy: "-6vh",
    spin: "-760deg",
    rot0: "80deg",
    tilt: "-6deg",
    squash: 0.94,
  },
  {
    size: 820,
    variant: "lotus" as const,
    flyx: "-116vw",
    flyy: "-10vh",
    spin: "840deg",
    rot0: "0deg",
    tilt: "6deg",
    squash: 0.95,
  },
];

/** 金色勾边祥云：从画面下方缓缓流过（确定性配置，避免 SSR 不一致） */
const GATE_CLOUDS = [
  { left: "2%", bottom: "4%", size: 300, delay: "0.1s", o: 0.85, drift: "6vw" },
  {
    right: "0%",
    bottom: "14%",
    size: 360,
    delay: "0.3s",
    o: 0.75,
    drift: "-7vw",
  },
  { left: "34%", bottom: "-2%", size: 220, delay: "0s", o: 0.65, drift: "4vw" },
];

/** 零星红枫：随伞散开从中心带出的飘落枫叶（确定性配置） */
const GATE_FALL_LEAVES = [
  {
    dx: "-18vw",
    dy: "42vh",
    rot: "320deg",
    size: 42,
    delay: "1.1s",
    dur: "2.4s",
    color: "#e8a04c",
  },
  {
    dx: "14vw",
    dy: "48vh",
    rot: "-280deg",
    size: 34,
    delay: "1.2s",
    dur: "2.3s",
    color: "#d9762f",
  },
  {
    dx: "-30vw",
    dy: "20vh",
    rot: "260deg",
    size: 30,
    delay: "1.15s",
    dur: "2.2s",
    color: "#f0bd6a",
  },
  {
    dx: "26vw",
    dy: "26vh",
    rot: "-300deg",
    size: 38,
    delay: "1.25s",
    dur: "2.35s",
    color: "#e0562a",
  },
  {
    dx: "4vw",
    dy: "52vh",
    rot: "340deg",
    size: 28,
    delay: "1.3s",
    dur: "2.3s",
    color: "#e8a04c",
  },
  {
    dx: "-8vw",
    dy: "30vh",
    rot: "-240deg",
    size: 32,
    delay: "1.2s",
    dur: "2.4s",
    color: "#d9762f",
  },
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
 * 朱红鎏金油纸伞（照搬长安舞榭）：
 * - 伞沿一圈米白宽环带 + 外金边 + 金色连珠；
 * - 两种伞面：gold=金红缠枝卷草、lotus=红白大莲瓣；
 * - 16 根鎏金伞骨、伞心金团花 + 金珠高光。
 * viewBox 200×200，伞心 (100,100)。每把伞独立渐变 id 防串色。
 */
function Umbrella({
  id,
  size = 120,
  variant = "gold",
}: {
  id: string;
  size?: number;
  variant?: "gold" | "lotus";
}) {
  const canopyId = `canopy-${id}`;
  const goldId = `gold-${id}`;
  const beadId = `bead-${id}`;
  const spokes = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  const petals = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id={canopyId} cx="45%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#d63a24" />
          <stop offset="58%" stopColor="#b02314" />
          <stop offset="100%" stopColor="#7c0f08" />
        </radialGradient>
        <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e2b0" />
          <stop offset="100%" stopColor="#cda24e" />
        </linearGradient>
        <radialGradient id={beadId} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#fff3d4" />
          <stop offset="55%" stopColor="#ecc172" />
          <stop offset="100%" stopColor="#a87a2e" />
        </radialGradient>
      </defs>

      {/* 伞柄（鎏金，斜向右下） */}
      <path
        d="M100 100 L150 158"
        stroke={`url(#${goldId})`}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="150" cy="158" r="4" fill="#caa04f" />

      {/* 伞沿米白宽环带（底色），外金边 */}
      <circle cx="100" cy="100" r="90" fill="#f2e4cb" />
      {/* 伞面朱红 */}
      <circle cx="100" cy="100" r="76" fill={`url(#${canopyId})`} />

      {/* 伞面纹样：莲瓣 or 缠枝卷草（局部坐标，尖朝外，旋转复制 8 份） */}
      <g transform="translate(100 100)">
        {variant === "lotus"
          ? petals.map((deg) => (
              <path
                key={deg}
                d="M0 -26 C 20 -40, 26 -62, 0 -78 C -26 -62, -20 -40, 0 -26 Z"
                fill="#f6ecd9"
                opacity="0.92"
                stroke="#d4a94f"
                strokeWidth="0.8"
                transform={`rotate(${deg})`}
              />
            ))
          : petals.map((deg) => (
              <path
                key={deg}
                d="M0 -30 C 22 -38, 30 -52, 14 -58 C 2 -62, -4 -50, 6 -48 M14 -58 C 26 -66, 22 -78, 8 -74"
                fill="none"
                stroke={`url(#${goldId})`}
                strokeWidth="2.2"
                strokeLinecap="round"
                transform={`rotate(${deg})`}
              />
            ))}
      </g>

      {/* 16 根鎏金伞骨（穿过伞面与米白环带） */}
      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 100 + Math.cos(rad) * 88;
        const y = 100 + Math.sin(rad) * 88;
        return (
          <line
            key={deg}
            x1="100"
            y1="100"
            x2={x}
            y2={y}
            stroke="#e9c887"
            strokeWidth="1.1"
            opacity="0.75"
          />
        );
      })}

      {/* 环带内金线 + 外金边 */}
      <circle
        cx="100"
        cy="100"
        r="76"
        fill="none"
        stroke={`url(#${goldId})`}
        strokeWidth="1.2"
        opacity="0.7"
      />
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke={`url(#${goldId})`}
        strokeWidth="2.5"
      />

      {/* 环带金色连珠（骨线之间） */}
      {spokes.map((deg) => {
        const rad = ((deg + 11.25) * Math.PI) / 180;
        const x = 100 + Math.cos(rad) * 83;
        const y = 100 + Math.sin(rad) * 83;
        return (
          <circle
            key={`dot-${deg}`}
            cx={x}
            cy={y}
            r="1.6"
            fill="#d4a94f"
            opacity="0.85"
          />
        );
      })}

      {/* 伞心金团花 + 金珠高光 */}
      <g transform="translate(100 100)">
        {petals.map((deg) => (
          <path
            key={`c-${deg}`}
            d="M0 -3 C 6 -8, 7 -16, 0 -20 C -7 -16, -6 -8, 0 -3 Z"
            fill={`url(#${goldId})`}
            transform={`rotate(${deg + 22.5})`}
          />
        ))}
        <circle
          r="7"
          fill={`url(#${beadId})`}
          stroke="#a87a2e"
          strokeWidth="0.8"
        />
        <circle cx="-2" cy="-2" r="2" fill="#fff6e2" opacity="0.9" />
      </g>
    </svg>
  );
}

/** 金色勾边祥云（卷云/如意纹） */
function CloudIcon({ size = 200 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 200 100"
      aria-hidden="true"
    >
      <path
        d="M30 72 Q14 72 14 56 Q14 42 30 42 Q27 24 48 24 Q52 8 74 13 Q86 1 102 12 Q120 3 130 18 Q150 13 152 32 Q170 32 168 50 Q182 56 172 72 Z"
        fill="rgba(240, 214, 156, 0.16)"
        stroke="#e9c887"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
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

      {/* 多伞齐开：朱红鎏金伞围拢绽放 + 祥云/红枫/光束/雾气，主页随伞面揭开露出地图 */}
      {leaving && (
        <div className="landing-gate" aria-hidden="true">
          {/* 暖金雾气（最底层，随散开渐亮） */}
          <div className="gate-haze" />
          {/* 斜向暖金光束 */}
          <div className="gate-beam" />

          {/* 金色祥云：从画面下方缓缓流过 */}
          {GATE_CLOUDS.map((c, i) => (
            <span
              key={`cloud-${i}`}
              className="gate-cloud"
              style={
                {
                  left: c.left,
                  right: c.right,
                  bottom: c.bottom,
                  "--cloud-o": c.o,
                  "--cloud-delay": c.delay,
                  "--cloud-drift": c.drift,
                } as React.CSSProperties
              }
            >
              <CloudIcon size={c.size} />
            </span>
          ))}

          {/* 朱红鎏金伞：围拢收紧后同时绽放，向左右 + 四角旋转飞出 */}
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
              <span
                className="gate-umbrella-tilt"
                style={
                  {
                    "--tilt": u.tilt,
                    "--squash": u.squash,
                  } as React.CSSProperties
                }
              >
                <Umbrella id={`gate-${i}`} size={u.size} variant={u.variant} />
              </span>
            </span>
          ))}

          {/* 零星红枫：随散开从中心带出，旋转飘落 */}
          {GATE_FALL_LEAVES.map((l, i) => (
            <span
              key={`leaf-${i}`}
              className="gate-fall-leaf"
              style={
                {
                  width: l.size,
                  height: l.size,
                  color: l.color,
                  "--leaf-dx": l.dx,
                  "--leaf-dy": l.dy,
                  "--leaf-rot": l.rot,
                  "--leaf-delay": l.delay,
                  "--leaf-dur": l.dur,
                } as React.CSSProperties
              }
            >
              <svg
                width={l.size}
                height={l.size}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={MAPLE_LEAF_PATH} />
              </svg>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
