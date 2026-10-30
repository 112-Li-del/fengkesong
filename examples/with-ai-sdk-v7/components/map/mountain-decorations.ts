import layout from "@/lib/qixia-mountain-decorations.json";
import title from "@/lib/qixia-title-decoration.json";
import lake from "@/lib/qixia-lake-decoration.json";
import roadsideLake from "@/lib/qixia-roadside-lake-decoration.json";
import centralLake from "@/lib/qixia-central-lake-decoration.json";
import lakeGroup from "@/lib/qixia-lake-group-decoration.json";
import westLake from "@/lib/qixia-west-lake-decoration.json";
import westInnerLake from "@/lib/qixia-west-inner-lake-decoration.json";
import northwestLake from "@/lib/qixia-northwest-lake-decoration.json";
import northInnerLake from "@/lib/qixia-north-inner-lake-decoration.json";
import midwestLake from "@/lib/qixia-midwest-lake-decoration.json";
import eastLakeGroup from "@/lib/qixia-east-lake-group-decoration.json";
import northLakeGroup from "@/lib/qixia-north-lake-group-decoration.json";
import summitLake from "@/lib/qixia-summit-lake-decoration.json";
import northeastLake from "@/lib/qixia-northeast-lake-decoration.json";
import summitBendLake from "@/lib/qixia-summit-bend-lake-decoration.json";
import upperEastLake from "@/lib/qixia-upper-east-lake-decoration.json";
import phoenixLake from "@/lib/qixia-phoenix-lake-decoration.json";
import southSmallLake from "@/lib/qixia-south-small-lake-decoration.json";
import type { MapAPI, MapInstance } from "./amap-types";

export function mountainDecorations(
  api: MapAPI,
  map: MapInstance,
  signal: AbortSignal,
) {
  const entries = signal.aborted
    ? []
    : [
        ...layout.placements,
        title,
        lake,
        roadsideLake,
        centralLake,
        lakeGroup,
        westLake,
        westInnerLake,
        northwestLake,
        northInnerLake,
        midwestLake,
        eastLakeGroup,
        northLakeGroup,
        summitLake,
        northeastLake,
        summitBendLake,
        upperEastLake,
        phoenixLake,
        southSmallLake,
      ].map((placement) => {
        const isTitle = placement.id === "qixia-title";
        const isLake =
          placement.id === lake.id ||
          placement.id === roadsideLake.id ||
          placement.id === centralLake.id ||
          placement.id === lakeGroup.id ||
          placement.id === westLake.id ||
          placement.id === westInnerLake.id ||
          placement.id === northwestLake.id ||
          placement.id === northInnerLake.id ||
          placement.id === midwestLake.id ||
          placement.id === eastLakeGroup.id ||
          placement.id === northLakeGroup.id ||
          placement.id === summitLake.id ||
          placement.id === northeastLake.id ||
          placement.id === summitBendLake.id ||
          placement.id === upperEastLake.id ||
          placement.id === phoenixLake.id ||
          placement.id === southSmallLake.id;
        const scale = isTitle || isLake ? 1 : 0.9;
        const root = document.createElement("div");
        root.className = isTitle
          ? "scenic-map-title"
          : isLake
            ? "scenic-lake-decoration"
            : "scenic-mountain-decoration";
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
          objectFit: isTitle || isLake ? "contain" : "fill",
          pointerEvents: "none",
          transform: `translate(-50%, -50%) rotate(${placement.rotation}deg) scale(${placement.mirror ? -scale : scale}, ${scale})`,
        });
        root.append(image);
        const [west, south, east, north] = placement.bounds;
        const marker = new api.Marker({
          map,
          content: root,
          position: [(west! + east!) / 2, (south! + north!) / 2],
          anchor: "center",
          offset: new api.Pixel(0, 0),
          zIndex: isLake ? 10 : 12,
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
