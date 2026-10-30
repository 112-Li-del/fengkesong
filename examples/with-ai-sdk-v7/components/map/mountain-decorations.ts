import layout from "@/lib/qixia-mountain-decorations.json";
import type { MapAPI, MapInstance } from "./amap-types";

export function mountainDecorations(
  api: MapAPI,
  map: MapInstance,
  signal: AbortSignal,
) {
  const entries = signal.aborted
    ? []
    : layout.placements.map((placement) => {
        const root = document.createElement("div");
        root.className = "scenic-mountain-decoration";
        root.setAttribute("aria-hidden", "true");
        Object.assign(root.style, {
          width: "0",
          height: "0",
          pointerEvents: "none",
        });
        const image = new Image();
        image.src = placement.asset;
        image.alt = "";
        image.draggable = false;
        Object.assign(image.style, {
          position: "absolute",
          left: "0",
          top: "0",
          maxWidth: "none",
          pointerEvents: "none",
          transform: `translate(-50%, -50%) rotate(${placement.rotation}deg) scale(${placement.mirror ? -0.9 : 0.9}, 0.9)`,
        });
        root.append(image);
        const [west, south, east, north] = placement.bounds;
        const marker = new api.Marker({
          map,
          content: root,
          position: [(west! + east!) / 2, (south! + north!) / 2],
          anchor: "center",
          offset: new api.Pixel(0, 0),
          zIndex: 12,
          bubble: true,
        });
        return { root, image, marker, bounds: placement.bounds };
      });
  const resize = () => {
    for (const {
      image,
      bounds: [west, south, east, north],
    } of entries) {
      const top = map.lngLatToContainer([west!, north!]);
      const bottom = map.lngLatToContainer([east!, south!]);
      image.style.width = `${Math.abs(bottom.x - top.x)}px`;
      image.style.height = `${Math.abs(bottom.y - top.y)}px`;
    }
  };
  resize();
  map.on("zoomchange", resize);
  map.on("zoomend", resize);
  map.on("resize", resize);
  const remove = () => {
    map.off("zoomchange", resize);
    map.off("zoomend", resize);
    map.off("resize", resize);
    for (const { marker } of entries) marker.setMap(null);
    signal.removeEventListener("abort", remove);
  };
  signal.addEventListener("abort", remove, { once: true });
  return {
    remove,
    setVisible(next: boolean) {
      for (const { root } of entries) root.style.display = next ? "" : "none";
    },
  };
}
