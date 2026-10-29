import type { LngLat } from "../components/map/amap-types";
import { scenicPlaces, scenicViewport } from "./qixia-map";

const worldSize = 256;
function project(point: LngLat) {
  const sine = Math.sin((point.lat * Math.PI) / 180);
  return {
    x: (point.lng + 180) / 360,
    y: 0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI),
  };
}
function unproject(x: number, y: number): LngLat {
  return {
    lng: x * 360 - 180,
    lat: (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI,
  };
}
export function clampScenicCenter(point: LngLat): LngLat {
  return {
    lng: Math.max(scenicViewport[0], Math.min(scenicViewport[2], point.lng)),
    lat: Math.max(scenicViewport[1], Math.min(scenicViewport[3], point.lat)),
  };
}
export function scenicOverview(
  width: number,
  height: number,
  compact = width <= 720,
) {
  const padding = compact
    ? { left: 62, right: 62, top: 155, bottom: 175 }
    : { left: 400, right: 80, top: 120, bottom: 135 };
  const points = scenicPlaces.map((place) => project(place.location));
  const west = Math.min(...points.map((p) => p.x)),
    east = Math.max(...points.map((p) => p.x));
  const north = Math.min(...points.map((p) => p.y)),
    south = Math.max(...points.map((p) => p.y));
  const availableWidth = Math.max(120, width - padding.left - padding.right);
  const availableHeight = Math.max(100, height - padding.top - padding.bottom);
  const zoom = Math.max(
    12,
    Math.min(
      17,
      Math.log2(
        Math.min(
          availableWidth / (east - west),
          availableHeight / (south - north),
        ) / worldSize,
      ),
    ),
  );
  const scale = worldSize * 2 ** zoom;
  const center = clampScenicCenter(
    unproject(
      (west + east) / 2 - (padding.left - padding.right) / (2 * scale),
      (north + south) / 2 - (padding.top - padding.bottom) / (2 * scale),
    ),
  );
  return { zoom, center };
}
