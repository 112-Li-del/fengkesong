import { scenicOverview } from "../../lib/scenic-view";
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
        .querySelector(".map-place-panel:not(.is-collapsed) .map-panel-body")
        ?.getBoundingClientRect();
      const bounds = {
        left: 32,
        top: 60,
        right: container.clientWidth - 40,
        bottom: container.clientHeight - 130,
      };
      let regions = [bounds];
      if (panel) {
        const covered = {
          left: Math.max(bounds.left, panel.left - origin.left - 32),
          top: Math.max(bounds.top, panel.top - origin.top - 32),
          right: Math.min(bounds.right, panel.right - origin.left + 32),
          bottom: Math.min(bounds.bottom, panel.bottom - origin.top + 32),
        };
        if (covered.left < covered.right && covered.top < covered.bottom) {
          regions = [
            { ...bounds, right: covered.left },
            { ...bounds, left: covered.right },
            { ...bounds, bottom: covered.top },
            { ...bounds, top: covered.bottom },
          ];
        }
      }
      regions = regions.filter(
        (rect) => rect.right - rect.left >= 48 && rect.bottom - rect.top >= 48,
      );
      const area = (rect: typeof bounds) =>
        (rect.right - rect.left) * (rect.bottom - rect.top);
      const target = regions.sort((a, b) => area(b) - area(a))[0];
      if (!target) return;
      const targetX = (target.left + target.right) / 2,
        targetY = (target.top + target.bottom) / 2;
      const currentZoom = map.getZoom(10);
      const zoom = Math.max(currentZoom, Math.min(17, overview.zoom + 0.5));
      const ratio = 2 ** (currentZoom - zoom);
      const center = map.containerToLngLat([
        pixel.x - (targetX - container.clientWidth / 2) * ratio,
        pixel.y - (targetY - container.clientHeight / 2) * ratio,
      ]);
      map.setZoomAndCenter(zoom, [center.lng, center.lat]);
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
