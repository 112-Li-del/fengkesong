import { z } from "zod";

export const terrainSchema = z
  .object({
    version: z.literal(1),
    bounds: z.tuple([z.number(), z.number(), z.number(), z.number()]),
    size: z.number().int().min(2).max(257),
    heights: z.array(z.number().min(-500).max(9000)),
    source: z.string(),
  })
  .superRefine((data, ctx) => {
    const [w, s, e, n] = data.bounds;
    if (data.heights.length !== data.size ** 2 || w >= e || s >= n)
      ctx.addIssue({ code: "custom", message: "Invalid terrain grid" });
  });
export type TerrainData = z.infer<typeof terrainSchema>;
export type Coordinate = [number, number];

// Terrain is sampled in WGS84; AMap renders mainland China in GCJ-02.
export function terrainToGcj(lng: number, lat: number): Coordinate {
  const x = lng - 105,
    y = lat - 35,
    pi = Math.PI;
  const common =
    ((20 * Math.sin(6 * x * pi) + 20 * Math.sin(2 * x * pi)) * 2) / 3;
  let dy =
    -100 +
    2 * x +
    3 * y +
    0.2 * y * y +
    0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x)) +
    common;
  dy += ((20 * Math.sin(y * pi) + 40 * Math.sin((y * pi) / 3)) * 2) / 3;
  dy +=
    ((160 * Math.sin((y * pi) / 12) + 320 * Math.sin((y * pi) / 30)) * 2) / 3;
  let dx =
    300 +
    x +
    2 * y +
    0.1 * x * x +
    0.1 * x * y +
    0.1 * Math.sqrt(Math.abs(x)) +
    common;
  dx += ((20 * Math.sin(x * pi) + 40 * Math.sin((x * pi) / 3)) * 2) / 3;
  dx +=
    ((150 * Math.sin((x * pi) / 12) + 300 * Math.sin((x * pi) / 30)) * 2) / 3;
  const rad = (lat * pi) / 180,
    ee = 0.006693421622965943;
  const magic = 1 - ee * Math.sin(rad) ** 2,
    root = Math.sqrt(magic);
  return [
    lng + (dx * 180) / ((6378245 / root) * Math.cos(rad) * pi),
    lat + (dy * 180) / (((6378245 * (1 - ee)) / (magic * root)) * pi),
  ];
}
export function terrainToWgs(lng: number, lat: number): Coordinate {
  let x = lng,
    y = lat;
  for (let i = 0; i < 4; i++) {
    const [a, b] = terrainToGcj(x, y);
    x -= a - lng;
    y -= b - lat;
  }
  return [x, y];
}
export function sampleElevation(
  data: TerrainData,
  lng: number,
  lat: number,
): number | null {
  const [w, s, e, n] = data.bounds;
  if (lng < w || lng > e || lat < s || lat > n) return null;
  const x = ((lng - w) / (e - w)) * (data.size - 1),
    y = ((n - lat) / (n - s)) * (data.size - 1);
  const ix = Math.min(data.size - 2, Math.floor(x)),
    iy = Math.min(data.size - 2, Math.floor(y));
  const fx = x - ix,
    fy = y - iy,
    at = (xx: number, yy: number) => data.heights[yy * data.size + xx]!;
  return (
    (at(ix, iy) * (1 - fx) + at(ix + 1, iy) * fx) * (1 - fy) +
    (at(ix, iy + 1) * (1 - fx) + at(ix + 1, iy + 1) * fx) * fy
  );
}
export function surfaceHeight(
  data: TerrainData,
  lng: number,
  lat: number,
  exaggeration: number,
): number {
  const [w, s, e, n] = data.bounds;
  const value = sampleElevation(data, lng, lat);
  if (value === null) return 0;
  const edge = Math.min(
    (lng - w) / (e - w),
    (e - lng) / (e - w),
    (lat - s) / (n - s),
    (n - lat) / (n - s),
  );
  const blend = Math.min(1, Math.max(0, edge / 0.08));
  return Math.max(0, value) * exaggeration * blend;
}
