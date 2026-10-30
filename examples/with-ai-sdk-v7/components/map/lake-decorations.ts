import layout from "@/lib/qixia-lake-decorations.json";
import type { MapAPI, MapInstance, Overlay } from "./amap-types";

type Point = [number, number];
const shores: Point[][] = [
  [
    [8, 44],
    [18, 20],
    [46, 12],
    [72, 19],
    [91, 39],
    [83, 65],
    [59, 85],
    [29, 80],
    [11, 64],
  ],
  [
    [13, 26],
    [35, 10],
    [62, 16],
    [84, 37],
    [90, 62],
    [74, 86],
    [47, 89],
    [30, 72],
    [12, 62],
    [7, 43],
  ],
  [
    [7, 51],
    [22, 20],
    [48, 14],
    [69, 24],
    [86, 29],
    [93, 52],
    [76, 69],
    [59, 88],
    [34, 79],
    [15, 73],
  ],
  [
    [9, 27],
    [35, 12],
    [60, 18],
    [67, 39],
    [87, 53],
    [92, 76],
    [71, 89],
    [40, 82],
    [19, 61],
  ],
  [
    [17, 18],
    [48, 10],
    [78, 22],
    [90, 47],
    [81, 72],
    [56, 88],
    [28, 84],
    [12, 62],
    [21, 43],
  ],
  [
    [8, 41],
    [25, 20],
    [51, 17],
    [75, 10],
    [91, 34],
    [81, 58],
    [90, 74],
    [64, 89],
    [35, 77],
    [15, 72],
  ],
  [
    [22, 11],
    [53, 16],
    [80, 29],
    [88, 51],
    [74, 68],
    [68, 89],
    [39, 90],
    [15, 73],
    [9, 46],
  ],
  [
    [10, 32],
    [29, 12],
    [58, 11],
    [83, 27],
    [88, 49],
    [75, 58],
    [84, 79],
    [55, 90],
    [26, 81],
    [12, 58],
  ],
];

function smooth(points: Point[]): Point[] {
  return points.flatMap((current, index) => {
    const previous = points[(index + points.length - 1) % points.length]!;
    const next = points[(index + 1) % points.length]!;
    const start = [
      (previous[0] + current[0]) / 2,
      (previous[1] + current[1]) / 2,
    ];
    const end = [(next[0] + current[0]) / 2, (next[1] + current[1]) / 2];
    return Array.from({ length: 6 }, (_, step): Point => {
      const t = step / 6,
        u = 1 - t;
      return [
        u * u * start[0]! + 2 * u * t * current[0] + t * t * end[0]!,
        u * u * start[1]! + 2 * u * t * current[1] + t * t * end[1]!,
      ];
    });
  });
}

function inside([x, y]: Point, ring: Point[]) {
  let result = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]!,
      b = ring[j]!;
    if (
      a[1] > y !== b[1] > y &&
      x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]
    )
      result = !result;
  }
  return result;
}

export function lakeDecorations(
  api: MapAPI,
  map: MapInstance,
  signal: AbortSignal,
) {
  const overlays: Overlay[] = [];
  if (!signal.aborted)
    for (const placement of layout.placements) {
      const ring = smooth(shores[placement.shape]!).map(([x, y]): Point => [
        placement.mirror ? 100 - x : x,
        y,
      ]);
      const [west, south, east, north] = placement.bounds;
      const project = ([x, y]: Point) => [
        west! + ((east! - west!) * x) / 100,
        north! - ((north! - south!) * y) / 100,
      ];
      for (let row = 1; row <= placement.ripples; row++) {
        const y = 10 + (80 * row) / (placement.ripples + 1);
        let segment: Point[] = [];
        const flush = () => {
          if (segment.length > 1)
            overlays.push(
              new api.Polyline({
                map,
                path: segment.map(project),
                strokeColor: "#169fcf",
                strokeOpacity: 1,
                strokeWeight: 1.15,
                lineCap: "round",
                lineJoin: "round",
                zIndex: 10,
                bubble: true,
                extData: { decoration: "lake-ripple", id: placement.id },
              }),
            );
          segment = [];
        };
        for (let x = 8; x <= 92; x += 2) {
          const point: Point = [
            x,
            y + Math.sin(x / 5.5 + row * 0.08 + placement.shape * 0.6) * 3.8,
          ];
          if (inside(point, ring)) segment.push(point);
          else flush();
        }
        flush();
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
