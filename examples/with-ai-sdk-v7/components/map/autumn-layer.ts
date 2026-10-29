import { terrainToGcj, terrainSchema } from "@/lib/terrain";
import roads from "@/lib/qixia-roads.json";
import type { MapAPI, MapInstance, Place, Overlay } from "./amap-types";
import { scenicMarkers } from "./scenic-markers";

export async function addAutumnLayer(
  api: MapAPI,
  map: MapInstance,
  onSelect: (place: Place) => void,
  signal: AbortSignal,
) {
  const overlays: Overlay[] = [];
  const response = await fetch("/terrain/qixia.json", { signal });
  if (!response.ok) throw new Error("Terrain unavailable");
  const terrain = terrainSchema.parse(await response.json());
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const [w, s, e, n] = terrain.bounds;
  const wash = new api.ImageLayer({
    url: "/maps/qixia-terrain-wash.png",
    bounds: new api.Bounds(terrainToGcj(w, s), terrainToGcj(e, n)),
    opacity: 0.72,
    zIndex: 8,
    zooms: [12, 19],
  });
  wash.setMap(map);
  overlays.push(wash);
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
  return {
    remove() {
      markers.remove();
      overlays.forEach((layer) => layer.setMap(null));
    },
    setIllustrated(value: boolean) {
      value ? wash.show() : wash.hide();
    },
    setSelected: markers.setSelected,
  };
}
