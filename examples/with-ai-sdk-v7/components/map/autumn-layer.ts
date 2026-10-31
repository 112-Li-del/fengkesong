import roads from "@/lib/qixia-roads.json";
import paperBoundary from "@/lib/qixia-paper-boundary.json";
import type { MapAPI, MapInstance, Place, Overlay } from "./amap-types";
import { facilityMarkers } from "./facility-markers";
import { scenicMarkers } from "./scenic-markers";
import { mountainDecorations } from "./mountain-decorations";
import { roadOutlineWidth } from "./lake-road-mask";

export function addAutumnLayer(
  api: MapAPI,
  map: MapInstance,
  onSelect: (place: Place) => void,
  signal: AbortSignal,
) {
  const overlays: Overlay[] = [];
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const paper = new api.Polygon({
    map,
    path: [paperBoundary.path, ...paperBoundary.holes],
    fillColor: "#f4f2af",
    fillOpacity: 1,
    strokeWeight: 0,
    strokeOpacity: 0,
    zIndex: 6,
    bubble: true,
    cursor: "grab",
  });
  const mountains = mountainDecorations(api, map, signal);
  for (const outline of [true, false])
    for (const path of roads.paths)
      overlays.push(
        new api.Polyline({
          map,
          path,
          strokeColor: outline ? "#a18b6c" : "#ffffff",
          strokeWeight: outline ? roadOutlineWidth : 5,
          strokeOpacity: 1,
          lineJoin: "round",
          lineCap: "round",
          zIndex: outline ? 30 : 31,
          bubble: true,
        }),
      );
  const markers = scenicMarkers(api, map, onSelect);
  const facilities = facilityMarkers(api, map, onSelect);
  return {
    remove() {
      mountains.remove();
      paper.setMap(null);
      markers.remove();
      facilities.remove();
      overlays.forEach((layer) => layer.setMap(null));
    },
    setSelected(id: string | null) {
      markers.setSelected(id);
      facilities.setSelected(id);
    },
    setFilter(ids: ReadonlySet<string>) {
      markers.setVisibleIds(ids);
      facilities.setVisibleIds(ids);
    },
    setPaperVisible(visible: boolean) {
      paper.setMap(visible ? map : null);
      mountains.setVisible(visible);
    },
  };
}
