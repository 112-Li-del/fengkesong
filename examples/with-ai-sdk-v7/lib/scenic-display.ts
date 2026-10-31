export const scenicRoutes = [
  {
    id: "A",
    name: "红叶景观线",
    stops: [
      "牌坊",
      "哼哈殿",
      "彩虹明镜",
      "桃花涧",
      "桃花坞",
      "桃花湖",
      "卧云亭",
    ],
  },
  {
    id: "B",
    name: "古寺人文线",
    stops: [
      "彩虹明镜",
      "钟楼",
      "鼓楼",
      "明征君碑",
      "栖霞古寺",
      "舍利塔",
      "千佛岩",
      "纱帽峰",
      "乾隆行宫遗址",
    ],
  },
  {
    id: "C",
    name: "登高远眺线",
    stops: [
      "话山亭",
      "天开岩",
      "乾隆御花园",
      "红叶谷",
      "枫林湖",
      "印心湖",
      "始皇临江处",
      "太虚亭",
      "萌宠乐园",
      "半馆",
      "百草园",
      "饮马池",
      "陆羽茶庄",
    ],
  },
] as const;
const core = [
  "彩虹明镜",
  "栖霞古寺",
  "红叶谷",
  "千佛岩",
  "舍利塔",
  "始皇临江处",
  "凤翔峰",
  "牌坊",
];
const popular = [
  "桃花湖",
  "枫林湖",
  "虎山",
  "碧云亭",
  "天开岩",
  "栖霞古镇",
  "陆羽茶庄",
  "纱帽峰",
  "读枫阁",
  "桃花涧",
];
const culture = [
  "李香君墓",
  "千佛斋",
  "哼哈殿",
  "太虚亭",
  "红枫林",
  "毗卢宝殿",
  "钟楼",
  "鼓楼",
  "印心湖",
  "天街",
  "龙山",
  "秋枫亭",
  "夕佳亭",
  "环翠亭",
  "卧云亭",
  "明征君碑",
  "乾隆行宫遗址",
  "定照庵碑刻",
];
export function scenicLevel(name: string) {
  if (core.includes(name)) return 1;
  if (popular.includes(name)) return 2;
  if (
    culture.includes(name) ||
    scenicRoutes.some((route) => route.stops.some((stop) => stop === name))
  )
    return 3;
  return 4;
}
type Point = { id: string; name: string; x: number; y: number; width: number };
type Rect = { x: number; y: number; width: number; height: number };
const intersects = (a: Rect, b: Rect) =>
  a.x < b.x + b.width + 5 &&
  a.x + a.width + 5 > b.x &&
  a.y < b.y + b.height + 5 &&
  a.y + a.height + 5 > b.y;
export function layoutScenicPoints(
  points: Point[],
  zoom: number,
  width: number,
  height: number,
  selected: string | null,
  route: ReadonlyMap<string, number> = new Map(),
) {
  const level = zoom < 16 ? 1 : zoom < 17 ? 2 : zoom < 18 ? 3 : 4;
  const budget = Math.min(
    zoom < 16 ? 8 : zoom < 17 ? 12 : zoom < 18 ? 16 : 20,
    width < 720 ? 10 : 20,
  );
  const occupied: Rect[] = [];
  const result = new Map<
    string,
    { label: { x: number; y: number } | null; art: boolean }
  >();
  const score = (p: Point) =>
    (p.id === selected ? 10000 : 0) +
    (route.has(p.id) ? 1000 : 0) +
    (5 - scenicLevel(p.name)) * 100 -
    Math.hypot(p.x - width / 2, p.y - height / 2) / 10000;
  let labels = 0;
  for (const p of [...points].sort(
    (a, b) => score(b) - score(a) || a.id.localeCompare(b.id),
  )) {
    const chosen = p.id === selected;
    if (p.x < 0 || p.y < 0 || p.x > width || p.y > height) continue;
    if (!chosen && !route.has(p.id) && scenicLevel(p.name) > level) {
      result.set(p.id, { label: null, art: false });
      continue;
    }
    const candidates = [
      { x: 14, y: -14 },
      { x: -p.width - 14, y: -14 },
      { x: -p.width / 2, y: 16 },
      { x: -p.width / 2, y: -44 },
    ];
    const artBox = { x: p.x - 34, y: p.y - 84, width: 68, height: 64 };
    let label: { x: number; y: number } | null = null;
    if (labels < budget || chosen) {
      label =
        candidates.find((pos) => {
          const box = {
            x: p.x + pos.x,
            y: p.y + pos.y,
            width: p.width,
            height: 28,
          };
          return (
            box.x >= 0 &&
            box.y >= 0 &&
            box.x + box.width <= width &&
            box.y + box.height <= height &&
            !intersects(box, artBox) &&
            !occupied.some(
              (other) => intersects(box, other) || intersects(artBox, other),
            )
          );
        }) ?? null;
      if (!label && chosen) label = candidates[0]!;
      if (label) {
        occupied.push({
          x: p.x + label.x,
          y: p.y + label.y,
          width: p.width,
          height: 28,
        });
        labels++;
      }
    }
    const art = !!label;
    if (art) occupied.push(artBox);
    result.set(p.id, { label, art });
  }
  return result;
}
