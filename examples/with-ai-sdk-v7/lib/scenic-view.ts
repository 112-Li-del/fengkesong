import type { LngLat } from "../components/map/amap-types";
import { scenicViewport } from "./qixia-map";

const worldSize = 256;
const baseFrame = {
  west: 118.953996,
  south: 32.146498,
  east: 118.971714,
  north: 32.159612,
} as const;
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
export function clampOverviewCenter(
  point: LngLat,
  zoom: number,
  overview: { center: LngLat; zoom: number },
  width: number,
  height: number,
): LngLat {
  if (zoom <= overview.zoom + 1e-5) return overview.center;
  const base = project(overview.center);
  const next = project(point);
  const baseScale = worldSize * 2 ** overview.zoom;
  const scale = worldSize * 2 ** zoom;
  const dx = (width / baseScale - width / scale) / 2;
  const dy = (height / baseScale - height / scale) / 2;
  return unproject(
    Math.max(base.x - dx, Math.min(base.x + dx, next.x)),
    Math.max(base.y - dy, Math.min(base.y + dy, next.y)),
  );
}
export function scenicOverview(
  width: number,
  height: number,
  compact = width <= 720,
) {
  const padding = compact
    ? { left: 62, right: 62, top: 155, bottom: 175 }
    : { left: 400, right: 80, top: 120, bottom: 135 };
  const northwest = project({ lng: baseFrame.west, lat: baseFrame.north });
  const southeast = project({ lng: baseFrame.east, lat: baseFrame.south });
  const west = northwest.x,
    east = southeast.x;
  const north = northwest.y,
    south = southeast.y;
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
  const center = unproject((west + east) / 2, (north + south) / 2);
  return { zoom, center };
}
