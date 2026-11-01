import type { MapAPI, MapInstance, Place } from "./amap-types";
import { facilityMarkers } from "./facility-markers";
import { scenicMarkers } from "./scenic-markers";
import { mountainDecorations } from "./mountain-decorations";
import { nativePaperLayer } from "./native-paper-layer";

export function addAutumnLayer(
  api: MapAPI,
  map: MapInstance,
  onSelect: (place: Place) => void,
  signal: AbortSignal,
) {
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const paper = nativePaperLayer(api, map);
  const mountains = mountainDecorations(api, map, signal);
  const markers = scenicMarkers(api, map, onSelect);
  const facilities = facilityMarkers(api, map, onSelect);
  return {
    remove() {
      mountains.remove();
      paper.remove();
      markers.remove();
      facilities.remove();
    },
    setSelected(id: string | null, bounce = false) {
      markers.setSelected(id, bounce);
      facilities.setSelected(id, bounce);
    },
    setRoute(ids: ReadonlyMap<string, number>) {
      markers.setRoute(ids);
    },
    setFilter(ids: ReadonlySet<string>) {
      markers.setVisibleIds(ids);
      facilities.setVisibleIds(ids);
    },
    setPaperVisible(visible: boolean) {
      paper.setVisible(visible);
      mountains.setVisible(visible);
    },
  };
}
