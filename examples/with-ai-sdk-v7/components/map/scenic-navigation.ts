import { scenicOverview } from "@/lib/scenic-view";
import type { MapInstance, LngLat } from "./amap-types";

export function scenicNavigation(map: MapInstance, container: HTMLElement) {
  const measure = () =>
    scenicOverview(
      container.clientWidth,
      container.clientHeight,
      window.matchMedia("(max-width:720px), (max-height:500px)").matches,
    );
  let overview = measure();
  map.clearLimitBounds();
  map.setZooms([2, 20]);
  map.setStatus({ dragEnable: true });
  const fitOverview = (immediately = false) =>
    map.setZoomAndCenter(
      overview.zoom,
      [overview.center.lng, overview.center.lat],
      immediately,
    );
  fitOverview(true);
  return {
    fitOverview,
    reveal(point: LngLat) {
      const pixel = map.lngLatToContainer([point.lng, point.lat]);
      const origin = container.getBoundingClientRect();
      const panel = document
        .querySelector(".map-place-panel")
        ?.getBoundingClientRect();
      const compact = window.matchMedia("(max-width:720px)").matches;
      const left = compact
        ? 32
        : Math.min(
            container.clientWidth - 100,
            (panel?.right ?? origin.left) - origin.left + 32,
          );
      const top = compact
        ? Math.min(
            container.clientHeight - 170,
            (panel?.bottom ?? origin.top) - origin.top + 32,
          )
        : 60;
      const right = container.clientWidth - 40,
        bottom = container.clientHeight - 130;
      if (
        pixel.x >= left &&
        pixel.x <= right &&
        pixel.y >= top &&
        pixel.y <= bottom
      )
        return;
      const targetX = (left + right) / 2,
        targetY = (top + bottom) / 2;
      const center = map.containerToLngLat([
        container.clientWidth / 2 + pixel.x - targetX,
        container.clientHeight / 2 + pixel.y - targetY,
      ]);
      map.setCenter([center.lng, center.lat]);
    },
    zoomBy(delta: number) {
      map.setZoom(Math.max(2, Math.min(20, map.getZoom(10) + delta)));
    },
    resize() {
      overview = measure();
      map.resize();
    },
  };
}
