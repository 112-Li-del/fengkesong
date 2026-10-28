import { scenicPlaces } from "@/lib/qixia-map";
import {
  sampleElevation,
  terrainToGcj,
  terrainToWgs,
  terrainSchema,
} from "@/lib/terrain";
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
  const markers = scenicMarkers(api, map, onSelect);
  const forest: Overlay[] = [];
  for (let y = 0; y < 6; y++)
    for (let x = 0; x < 7; x++) {
      const lng =
          118.955 +
          x * 0.0025 +
          (y % 2) * 0.0009 +
          Math.sin(x * 7 + y * 11) * 0.0006,
        lat = 32.149 + y * 0.0021 + Math.cos(x * 13 + y * 5) * 0.0005;
      const height = sampleElevation(terrain, ...terrainToWgs(lng, lat));
      if (
        height === null ||
        height < 65 ||
        scenicPlaces.some(
          (p) =>
            Math.hypot(p.location.lng - lng, p.location.lat - lat) < 0.0011,
        )
      )
        continue;
      const tree = document.createElement("span");
      tree.className = "autumn-forest art-maple";
      tree.setAttribute("aria-hidden", "true");
      forest.push(
        new api.Marker({
          map,
          position: [lng, lat],
          content: tree,
          anchor: "center",
          zooms: [14, 17],
          zIndex: 20,
          bubble: true,
        }),
      );
    }
  overlays.push(...forest);
  return {
    remove() {
      markers.remove();
      overlays.forEach((layer) => layer.setMap(null));
    },
    setIllustrated(value: boolean) {
      value ? wash.show() : wash.hide();
      forest.forEach((layer) => layer.setMap(value ? map : null));
      markers.setIllustrated(value);
    },
    setSelected: markers.setSelected,
  };
}
