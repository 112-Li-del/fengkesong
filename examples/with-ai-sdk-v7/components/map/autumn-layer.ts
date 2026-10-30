import roads from "@/lib/qixia-roads.json";
import type { MapAPI, MapInstance, Place, Overlay } from "./amap-types";
import { facilityMarkers } from "./facility-markers";
import { scenicMarkers } from "./scenic-markers";

export function addAutumnLayer(
  api: MapAPI,
  map: MapInstance,
  onSelect: (place: Place) => void,
  signal: AbortSignal,
) {
  const overlays: Overlay[] = [];
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  for (const outline of [true, false])
    for (const path of roads.paths)
      overlays.push(
        new api.Polyline({
          map,
          path,
          strokeColor: outline ? "#a18b6c" : "#ffffff",
          strokeWeight: outline ? 7 : 5,
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
      markers.remove();
      facilities.remove();
      overlays.forEach((layer) => layer.setMap(null));
    },
    setSelected: markers.setSelected,
    setFacilities: facilities.setVisible,
    setFacilityCategories: facilities.setCategories,
  };
}
