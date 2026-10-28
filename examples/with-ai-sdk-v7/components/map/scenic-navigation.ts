import { clampScenicCenter, scenicOverview } from "@/lib/scenic-view";
import type { MapInstance, LngLat } from "./amap-types";

export function scenicNavigation(map: MapInstance, container: HTMLElement) {
  const measure = () =>
    scenicOverview(
      container.clientWidth,
      container.clientHeight,
      window.matchMedia("(max-width:720px), (max-height:500px)").matches,
    );
  let overview = measure();
  let adjusting = false;
  const restrict = () => {
    if (adjusting) return;
    const point = map.getCenter();
    const next = clampScenicCenter(point);
    if (
      Math.abs(point.lng - next.lng) < 1e-8 &&
      Math.abs(point.lat - next.lat) < 1e-8
    )
      return;
    adjusting = true;
    map.setCenter([next.lng, next.lat], true);
    adjusting = false;
  };
  map.clearLimitBounds();
  map.setZooms([overview.zoom, 19]);
  map.on("mapmove", restrict);
  map.on("moveend", restrict);
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
      const next = clampScenicCenter(center);
      map.setCenter([next.lng, next.lat]);
    },
    zoomBy(delta: number) {
      map.setZoom(Math.max(overview.zoom, Math.min(19, map.getZoom() + delta)));
    },
    resize() {
      const wasOverview = Math.abs(map.getZoom() - overview.zoom) < 0.15;
      overview = measure();
      map.resize();
      map.setZooms([overview.zoom, 19]);
      if (wasOverview) fitOverview(true);
      restrict();
    },
    remove() {
      map.off("mapmove", restrict);
      map.off("moveend", restrict);
    },
  };
}
