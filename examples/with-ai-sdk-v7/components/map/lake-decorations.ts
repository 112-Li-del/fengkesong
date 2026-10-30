import waterBodies from "@/lib/qixia-water-bodies.json";
import type { MapAPI, MapInstance, Overlay } from "./amap-types";

// —— 坐标换算：GCJ-02 下 1 米对应的经纬度增量（南京栖霞山纬度约 32.15°）——
const LAT_PER_M = 1 / 111_320;
const LNG_PER_M = 1 / (111_320 * Math.cos((32.15 * Math.PI) / 180));

type Point = [number, number];

// —— 水体配色（据官方导览图实测采样：统一偏蓝青的天蓝色水纹，无实心填充、无深色描边）——
const WATER_LINE = "#3fa8c4"; // 水纹线主色（偏蓝的青色，导览图湖泊/溪流统一色）
const WATER_LINE_OPACITY = 0.9;
const LAKE_RIPPLE_WEIGHT = 1.1; // 湖泊水纹线宽（细，与导览图一致）
const STREAM_COLOR = "#3fa8c4"; // 溪流波浪线（同水纹色）
const STREAM_WEIGHT = 1.4; // 每条波浪线宽（多条并排，故略细于湖泊水纹）
const STREAM_WAVE_COUNT = 4; // 并排波浪线条数（导览图为密集多线）

/** 以中心点 + 尺寸（米）生成近圆/椭圆轮廓（GCJ-02）。aspect 为长短轴比。 */
function ellipseRing(
  center: Point,
  sizeMeters: number,
  aspect = 1,
  points = 24,
): Point[] {
  const [lng, lat] = center;
  const rx = (sizeMeters / 2) * LNG_PER_M;
  const ry = (sizeMeters / 2) * aspect * LAT_PER_M;
  const ring: Point[] = [];
  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2;
    ring.push([lng + Math.cos(t) * rx, lat + Math.sin(t) * ry]);
  }
  return ring;
}

/** 方形轮廓（明镜湖近似方形）。 */
function squareRing(center: Point, sizeMeters: number): Point[] {
  const [lng, lat] = center;
  const hx = (sizeMeters / 2) * LNG_PER_M;
  const hy = (sizeMeters / 2) * LAT_PER_M;
  return [
    [lng - hx, lat - hy],
    [lng + hx, lat - hy],
    [lng + hx, lat + hy],
    [lng - hx, lat + hy],
  ];
}

/** 月牙形轮廓（白莲池/月牙池）。开口朝东，两端平滑收口、无折角。 */
function crescentRing(center: Point, sizeMeters: number): Point[] {
  const [lng, lat] = center;
  const r = (sizeMeters / 2) * LNG_PER_M;
  const ry = (sizeMeters / 2) * LAT_PER_M;
  const ring: Point[] = [];
  const N = 40; // 单弧采样点数
  // 月牙由外弧（半径 r）与内弧（半径 0.62r，圆心右移 0.45r）围成，
  // 两弧在顶部（t≈0.5π，即正北）和底部（t≈1.5π，即正南）处相切闭合，
  // 避免内弧直接跳变导致两端交错。
  const outerCx = 0;
  const innerCx = r * 0.45;
  const innerR = r * 0.62;
  // 外弧：从底端(南)逆时针到顶端(北) —— 覆盖左侧凸面
  // 使用角度从 1.5π 到 0.5π（即 270° → 90°，经 180°，左侧）
  const outerStart = Math.PI * 1.5;
  const outerEnd = Math.PI * 0.5;
  for (let i = 0; i <= N; i++) {
    const t = outerStart + ((outerEnd - outerStart) * i) / N;
    ring.push([lng + outerCx + Math.cos(t) * r, lat + Math.sin(t) * ry]);
  }
  // 内弧：从顶端(北)顺时针回到底端(南) —— 覆盖右侧凹面
  // 角度从 0.5π 到 1.5π（即 90° → 270°）
  const innerStart = Math.PI * 0.5;
  const innerEnd = Math.PI * 1.5;
  for (let i = 0; i <= N; i++) {
    const t = innerStart + ((innerEnd - innerStart) * i) / N;
    ring.push([
      lng + innerCx + Math.cos(t) * innerR,
      lat + Math.sin(t) * ry * 0.9,
    ]);
  }
  return ring;
}

/** 由相对中心（米）的自然轮廓点生成经纬度多边形，并对顶点做 Catmull-Rom 平滑，贴合自然岸线。 */
function naturalRing(center: Point, outlineMeters: Point[]): Point[] {
  const [lng, lat] = center;
  const raw: Point[] = outlineMeters.map(([mx, my]) => [
    lng + mx * LNG_PER_M,
    lat + my * LAT_PER_M,
  ]);
  // Catmull-Rom 平滑（闭合），让折线变成自然曲线
  const smooth: Point[] = [];
  const n = raw.length;
  for (let i = 0; i < n; i++) {
    const p0 = raw[(i + n - 1) % n]!;
    const p1 = raw[i]!;
    const p2 = raw[(i + 1) % n]!;
    const p3 = raw[(i + 2) % n]!;
    for (let s = 0; s < 5; s++) {
      const t = s / 5;
      const t2 = t * t;
      const t3 = t2 * t;
      smooth.push([
        0.5 *
          (2 * p1[0] +
            (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 *
          (2 * p1[1] +
            (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  return smooth;
}

function shapeRing(lake: (typeof waterBodies.lakes)[number]): Point[] {
  const center = lake.center as Point;
  const size = lake.sizeMeters as number;
  switch (lake.shape) {
    case "square":
      return squareRing(center, size);
    case "crescent":
      return crescentRing(center, size);
    case "natural":
      return naturalRing(center, lake.outlineMeters as Point[]);
    case "ellipse":
    default:
      return ellipseRing(center, size, 0.82);
  }
}

/**
 * 对折线做 Chaikin 切角平滑，形成自然蜿蜒曲线。
 * 用 Chaikin 而非 Catmull-Rom：Chaikin 生成的曲线严格落在原折线的凸包内，
 * 不会在急转弯处向外过冲（overshoot），因此不会把溪流推到道路或建筑上。
 */
function smoothPath(path: Point[], iterations = 3): Point[] {
  if (path.length < 3) return path;
  let pts = path;
  for (let k = 0; k < iterations; k++) {
    const out: Point[] = [pts[0]!];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i]!;
      const b = pts[i + 1]!;
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    out.push(pts[pts.length - 1]!);
    pts = out;
  }
  return pts;
}

/**
 * 导览图风格溪流：沿中心线生成多条密集平行波浪线。
 * 波浪按实际弧长（米）计算相位，保证起伏均匀；两端用包络衰减，避免端点散开。
 */
function streamWaveLines(
  path: Point[],
  count = 4,
  spacingM = 1.6,
  ampM = 0.75,
  waveLenM = 9,
): Point[][] {
  const n = path.length;
  if (n < 2) return [];
  // 逐点法线（在米空间求单位法线）与累计弧长（米）
  const normals: { nx: number; ny: number }[] = [];
  const cum: number[] = [0];
  for (let i = 0; i < n; i++) {
    const a = path[Math.max(0, i - 1)]!;
    const b = path[Math.min(n - 1, i + 1)]!;
    const dxM = (b[0] - a[0]) / LNG_PER_M;
    const dyM = (b[1] - a[1]) / LAT_PER_M;
    const len = Math.hypot(dxM, dyM) || 1;
    normals.push({ nx: -dyM / len, ny: dxM / len });
    if (i > 0) {
      const pa = path[i - 1]!;
      const pb = path[i]!;
      const sx = (pb[0] - pa[0]) / LNG_PER_M;
      const sy = (pb[1] - pa[1]) / LAT_PER_M;
      cum.push(cum[i - 1]! + Math.hypot(sx, sy));
    }
  }
  const total = cum[n - 1]! || 1;

  const lines: Point[][] = [];
  for (let w = 0; w < count; w++) {
    // 以中心线为基准向两侧对称偏移，形成密集并排的水纹束
    const offM = (w - (count - 1) / 2) * spacingM;
    const line: Point[] = [];
    for (let i = 0; i < n; i++) {
      const s = cum[i]!;
      const t = s / total;
      // 两端包络衰减（首尾起伏小，中段起伏正常）
      const envelope = Math.sin(t * Math.PI) * 0.65 + 0.35;
      const wobble =
        Math.sin((s / waveLenM) * Math.PI * 2 + w * 0.9) * ampM * envelope;
      const { nx, ny } = normals[i]!;
      const d = offM + wobble;
      line.push([
        path[i]![0] + nx * d * LNG_PER_M,
        path[i]![1] + ny * d * LAT_PER_M,
      ]);
    }
    if (line.length >= 2) lines.push(line);
  }
  return lines;
}

/**
 * 求水平扫描线 y 与闭合多边形 ring 的内部区间（用于把水纹裁进湖岸）。
 * 用射线交点法：收集所有跨过 y 的边交点的 x，排序后两两配对即为内部区间。
 */
function scanlineSpans(ring: Point[], y: number): [number, number][] {
  const xs: number[] = [];
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % n]!;
    const ay = a[1];
    const by = b[1];
    // 半开区间判定，避免顶点被重复计数
    if ((ay <= y && by > y) || (by <= y && ay > y)) {
      const t = (y - ay) / (by - ay);
      xs.push(a[0] + (b[0] - a[0]) * t);
    }
  }
  xs.sort((p, q) => p - q);
  const spans: [number, number][] = [];
  for (let i = 0; i + 1 < xs.length; i += 2) {
    spans.push([xs[i]!, xs[i + 1]!]);
  }
  return spans;
}

/**
 * 导览图风格湖泊水纹：水平波浪线贯穿整个湖面，两端被湖岸自然裁断。
 * 行数按湖的高度自动适配（小池 2~3 行，大湖 6~8 行），线间距约 9 米。
 */
function lakeRipples(ring: Point[]): Point[][] {
  const ys = ring.map((p) => p[1]);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const heightM = (maxY - minY) / LAT_PER_M; // 湖的南北高度（米）
  if (heightM <= 0) return [];
  const rows = Math.max(3, Math.min(14, Math.round(heightM / 4.5)));
  const lines: Point[][] = [];

  for (let r = 0; r < rows; r++) {
    // 纵向均匀分布，上下各留半行边距，避免线压在岸线上
    const fy = (r + 0.5) / rows;
    const y = minY + (maxY - minY) * fy;

    for (const [x0, x1] of scanlineSpans(ring, y)) {
      const widthDeg = x1 - x0;
      const widthM = widthDeg / LNG_PER_M;
      if (widthM < 2.5) continue; // 过窄的碎片跳过（如月牙尖端）

      // 两端各收进 2%，让波浪线端点贴近但不压岸线
      const a0 = x0 + widthDeg * 0.02;
      const a1 = x1 - widthDeg * 0.02;
      const spanDeg = a1 - a0;

      // 波数随宽度增加（约每 14 米一个波），振幅随宽度微增并限幅
      const cycles = Math.max(2, Math.round(widthM / 14));
      const ampM = Math.min(1.5, widthM * 0.022);
      const steps = Math.max(12, Math.min(64, Math.round(widthM / 1.5)));

      const line: Point[] = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const px = a0 + spanDeg * t;
        // 包络：两端起伏衰减为 0，保证端点贴合岸线
        const envelope = Math.sin(t * Math.PI);
        const wobble =
          Math.sin(t * Math.PI * 2 * cycles + r * 0.7) * ampM * envelope;
        line.push([px, y + wobble * LAT_PER_M]);
      }
      if (line.length >= 2) lines.push(line);
    }
  }
  return lines;
}

export function lakeDecorations(
  api: MapAPI,
  map: MapInstance,
  signal: AbortSignal,
) {
  const overlays: Overlay[] = [];
  const add = (overlay: Overlay) => {
    overlays.push(overlay);
    if (signal.aborted) overlay.setMap(null);
  };

  // —— 湖泊 / 池塘：完全透明（无填充、无描边）+ 贯穿湖面的水平波浪线（导览图风格）——
  for (const lake of waterBodies.lakes) {
    const ring = shapeRing(lake);
    // 透明轮廓：仅作为水域范围载体，不画填充也不画描边（湖形由水纹线自然勾勒）
    add(
      new api.Polygon({
        map,
        path: ring,
        fillColor: WATER_LINE,
        fillOpacity: 0,
        strokeColor: WATER_LINE,
        strokeWeight: 0,
        strokeOpacity: 0,
        strokeStyle: "solid",
        zIndex: 8,
        bubble: true,
        cursor: "default",
        extData: { decoration: "water-body", kind: "lake", id: lake.id },
      }),
    );

    // 水纹：贯穿整个湖面、两端被湖岸裁断的水平波浪线
    for (const ripple of lakeRipples(ring)) {
      add(
        new api.Polyline({
          map,
          path: ripple,
          strokeColor: WATER_LINE,
          strokeOpacity: WATER_LINE_OPACITY,
          strokeWeight: LAKE_RIPPLE_WEIGHT,
          lineCap: "round",
          lineJoin: "round",
          zIndex: 9,
          bubble: true,
          cursor: "default",
          extData: {
            decoration: "water-body",
            kind: "lake-ripple",
            id: lake.id,
          },
        }),
      );
    }
  }

  // —— 溪流 / 涧：多条密集平行波浪线（导览图风格，蓝青波浪束）——
  for (const stream of waterBodies.streams) {
    const raw = stream.path as Point[];
    // Chaikin 切角平滑，形成自然蜿蜒曲线（不外扩，贴合原折线）
    const smooth = smoothPath(raw);
    // 生成密集并排的波浪线束（4 条，间距 1.6 米）
    for (const wave of streamWaveLines(smooth, STREAM_WAVE_COUNT)) {
      add(
        new api.Polyline({
          map,
          path: wave,
          strokeColor: STREAM_COLOR,
          strokeOpacity: 0.9,
          strokeWeight: STREAM_WEIGHT,
          lineCap: "round",
          lineJoin: "round",
          zIndex: 10,
          bubble: true,
          cursor: "default",
          extData: { decoration: "water-body", kind: "stream", id: stream.id },
        }),
      );
    }
  }

  const remove = () => {
    for (const overlay of overlays) overlay.setMap(null);
    signal.removeEventListener("abort", remove);
  };
  signal.addEventListener("abort", remove, { once: true });
  return {
    remove,
    setVisible(visible: boolean) {
      for (const overlay of overlays) overlay.setMap(visible ? map : null);
    },
  };
}
