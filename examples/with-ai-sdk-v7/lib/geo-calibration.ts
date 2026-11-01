import type { LngLat } from "../components/map/amap-types";
export type CoordinateAnchor = { from: LngLat; to: LngLat };
export function correctGuidePoint(
  point: LngLat,
  anchors: readonly CoordinateAnchor[],
): LngLat {
  let total = 0,
    east = 0,
    north = 0;
  for (const anchor of anchors) {
    const distance = Math.hypot(
      (anchor.from.lng - point.lng) * 94300,
      (anchor.from.lat - point.lat) * 111200,
    );
    const dx = anchor.to.lng - anchor.from.lng,
      dy = anchor.to.lat - anchor.from.lat;
    if (Math.hypot(dx * 94300, dy * 111200) > 30 || distance >= 120) continue;
    if (distance < 0.01) return { ...anchor.to };
    const weight = ((1 - distance / 120) / (distance + 8)) ** 2;
    total += weight;
    east += weight * dx;
    north += weight * dy;
  }
  if (!total) return { ...point };
  return {
    lng: point.lng + east / (total + 1 / 14400),
    lat: point.lat + north / (total + 1 / 14400),
  };
}
