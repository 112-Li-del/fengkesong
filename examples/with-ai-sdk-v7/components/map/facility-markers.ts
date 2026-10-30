import { facilityPlaces, type FacilityPlace } from "@/lib/qixia-map";
import type { MapAPI, MapInstance, Place } from "./amap-types";

const GLYPH: Readonly<Record<string, string>> = {
  center: "i",
  info: "?",
  ticket: "票",
  shop: "购",
  gate: "门",
  out: "出",
  supply: "水",
  toilet: "厕",
  bus: "车",
  parking: "P",
  fire: "消",
  medical: "医",
  check: "检",
  squad: "防",
};

/** 低于这个缩放级别时，距离过近的设施会合并成一个簇，避免入口一带十几个点叠成一团。 */
const CLUSTER_ZOOM = 16.2;
const CLUSTER_RADIUS = 24;

const TONE: Readonly<Record<string, string>> = {
  toilet: "#3f6d92",
  parking: "#35674c",
  bus: "#5d4a90",
  fire: "#a33b30",
  supply: "#8a6d3b",
  gate: "#7d2f22",
  out: "#7d2f22",
  center: "#1f5b74",
  check: "#6a5334",
  ticket: "#8a5a26",
  medical: "#a33b30",
  squad: "#6d3b1f",
  shop: "#6e402b",
  info: "#6e402b",
};

/** 簇的代表字取优先级最高的那一类，让「门」「厕」这类一眼能认出来。 */
const PRIORITY: readonly string[] = [
  "gate",
  "out",
  "center",
  "ticket",
  "check",
  "medical",
  "toilet",
  "parking",
  "bus",
  "supply",
  "fire",
  "squad",
  "shop",
  "info",
];

export function facilityMarkers(
  api: MapAPI,
  map: MapInstance,
  onSelect: (place: Place) => void,
) {
  const entries = facilityPlaces.map((facility: FacilityPlace) => {
    const root = document.createElement("button");
    root.type = "button";
    root.className = "facility-pin group-" + facility.group;
    root.title = facility.name + " · " + facility.en;
    root.setAttribute("aria-label", facility.name + "（" + facility.en + "）");
    const glyph = document.createElement("span");
    glyph.textContent = GLYPH[facility.group] ?? "·";
    root.append(glyph);
    const marker = new api.Marker({
      map: null,
      position: [facility.location.lng, facility.location.lat],
      content: root,
      anchor: "center",
      offset: new api.Pixel(0, 0),
      zIndex: 210,
    });
    root.addEventListener("click", (event) => {
      event.stopPropagation();
      onSelect(facility);
    });
    for (const name of ["pointerdown", "mousedown", "touchstart", "dblclick"])
      root.addEventListener(name, (event) => event.stopPropagation());
    return { facility, root, marker };
  });

  let visible = false;
  // 可见的大类集合；为空则全部显示。用于按分类开关设施。
  let visibleCategories: Set<string> | null = null;
  let clusters: { marker: { setMap(map: MapInstance | null): void } }[] = [];

  const clearClusters = () => {
    for (const cluster of clusters) cluster.marker.setMap(null);
    clusters = [];
  };

  const active = (facility: FacilityPlace) =>
    visibleCategories === null || visibleCategories.has(facility.category);

  const layout = () => {
    clearClusters();
    const clustered = map.getZoom() < CLUSTER_ZOOM;
    for (const entry of entries)
      entry.marker.setMap(
        visible && !clustered && active(entry.facility) ? map : null,
      );
    if (!visible || !clustered) return;

    const points = entries
      .filter((entry) => active(entry.facility))
      .map((entry) => {
        const { lng, lat } = entry.facility.location;
        const pixel = map.lngLatToContainer([lng, lat]);
        return { entry, x: pixel.x, y: pixel.y };
      });
    const used = new Set<number>();
    for (let i = 0; i < points.length; i += 1) {
      if (used.has(i)) continue;
      const pivot = points[i];
      if (!pivot) continue;
      used.add(i);
      const group = [pivot];
      let centerX = pivot.x;
      let centerY = pivot.y;
      for (let j = i + 1; j < points.length; j += 1) {
        if (used.has(j)) continue;
        const other = points[j];
        if (!other) continue;
        if (Math.hypot(other.x - centerX, other.y - centerY) > CLUSTER_RADIUS)
          continue;
        used.add(j);
        group.push(other);
        centerX = (centerX * (group.length - 1) + other.x) / group.length;
        centerY = (centerY * (group.length - 1) + other.y) / group.length;
      }
      const head = group[0];
      if (!head) continue;
      const first = head.entry.facility;
      const size = group.length;
      let sumLng = 0;
      let sumLat = 0;
      const names: string[] = [];
      for (const node of group) {
        sumLng += node.entry.facility.location.lng;
        sumLat += node.entry.facility.location.lat;
        names.push(node.entry.facility.name);
      }
      const lng = sumLng / size;
      const lat = sumLat / size;
      const root = document.createElement("button");
      root.type = "button";
      root.className = "facility-cluster";
      let lead = first;
      for (const key of PRIORITY) {
        const hit = group.find((node) => node.entry.facility.group === key);
        if (hit) {
          lead = hit.entry.facility;
          break;
        }
      }
      root.textContent = GLYPH[lead.group] ?? "·";
      const tone = TONE[lead.group];
      if (tone) {
        root.style.color = tone;
        root.style.borderColor = tone;
      }
      root.title = size > 1 ? names.join("、") : first.name + " · " + first.en;
      root.setAttribute(
        "aria-label",
        size > 1 ? size + " 个设施，点击放大" : first.name,
      );
      root.addEventListener("click", (event) => {
        event.stopPropagation();
        if (size === 1) {
          onSelect(first);
          return;
        }
        map.setZoomAndCenter(map.getZoom() + 2, [lng, lat], false);
      });
      for (const name of ["pointerdown", "mousedown", "touchstart", "dblclick"])
        root.addEventListener(name, (event) => event.stopPropagation());
      const marker = new api.Marker({
        map,
        position: [lng, lat],
        content: root,
        anchor: "center",
        offset: new api.Pixel(0, 0),
        zIndex: size > 1 ? 220 : 210,
      });
      clusters.push({ marker });
    }
  };

  map.on("zoomend", layout);
  map.on("moveend", layout);

  return {
    get visible() {
      return visible;
    },
    setVisible(next: boolean) {
      visible = next;
      layout();
      return next;
    },
    setCategories(categories: string[] | null) {
      visibleCategories = categories === null ? null : new Set(categories);
      layout();
    },
    remove() {
      map.off("zoomend", layout);
      map.off("moveend", layout);
      clearClusters();
      for (const entry of entries) entry.marker.setMap(null);
    },
  };
}
