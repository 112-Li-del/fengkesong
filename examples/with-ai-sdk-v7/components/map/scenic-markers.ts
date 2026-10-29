import { scenicPlaces } from "@/lib/qixia-map";
import { layoutScenicMarkers, type ScreenRect } from "@/lib/scenic-layout";
import type { MapAPI, MapInstance, Place } from "./amap-types";

export function scenicMarkers(
  api: MapAPI,
  map: MapInstance,
  onSelect: (place: Place) => void,
) {
  let selectedId: string | null = null,
    illustrated = true,
    frame = 0,
    disposed = false;
  const container = map.getContainer();
  const pane = document.createElement("div");
  pane.className = "scenic-label-layer";
  pane.setAttribute("aria-label", "栖霞山景点名称");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("scenic-label-lines");
  svg.setAttribute("aria-hidden", "true");
  pane.append(svg);
  container.append(pane);
  const pinnedOffsets = new Map<string, { dx: number; dy: number }>();
  let layoutSize = "";
  const entries = scenicPlaces.map((place) => {
    const root = document.createElement("div");
    root.className = "scenic-coordinate";
    const art = document.createElement("span");
    art.className = "scenic-site-art art-" + place.art;
    art.setAttribute("aria-hidden", "true");
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "scenic-site-dot";
    dot.setAttribute("aria-label", "查看" + place.name + "的真实位置");
    dot.title = place.name;
    root.append(art, dot);
    const marker = new api.Marker({
      map,
      position: [place.location.lng, place.location.lat],
      content: root,
      anchor: "top-left",
      offset: new api.Pixel(0, 0),
      zIndex: 120,
      zooms: [12, 20],
    });
    const activate = () => onSelect(place);
    marker.on("click", activate);
    dot.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      activate();
    });
    dot.addEventListener("click", (event) => {
      if (event.detail === 0) {
        event.stopPropagation();
        activate();
      }
    });
    const label = document.createElement("button");
    label.type = "button";
    label.className = "scenic-site-label";
    label.textContent = place.name;
    label.setAttribute("aria-label", "查看" + place.name);
    label.addEventListener("click", (event) => {
      event.stopPropagation();
      activate();
    });
    label.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      activate();
    });
    for (const name of ["pointerdown", "mousedown", "touchstart", "dblclick"])
      label.addEventListener(name, (event) => event.stopPropagation());
    pane.append(label);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.classList.add("scenic-label-line");
    svg.append(line);
    return { place, root, art, dot, marker, label, line };
  });
  function obstacles(): ScreenRect[] {
    const origin = container.getBoundingClientRect();
    return [
      ...document.querySelectorAll(
        ".map-place-panel,.autumn-map-tools,.weather-chat-dock,.autumn-map-caption,.map-nearby-card",
      ),
    ]
      .filter((e) => e.getClientRects().length > 0)
      .map((e) => {
        const r = e.getBoundingClientRect();
        return {
          left: r.left - origin.left - 5,
          top: r.top - origin.top - 5,
          right: r.right - origin.left + 5,
          bottom: r.bottom - origin.top + 5,
        };
      });
  }
  function render() {
    frame = 0;
    if (disposed) return;
    const zoom = map.getZoom(),
      width = container.clientWidth,
      height = container.clientHeight;
    const size = width + "x" + height;
    if (size !== layoutSize) {
      pinnedOffsets.clear();
      layoutSize = size;
    }
    for (const entry of entries) {
      const selected = entry.place.id === selectedId;
      entry.root.classList.toggle("is-selected", selected);
      entry.art.hidden =
        !illustrated ||
        !(
          entry.place.tier === 1 ||
          (zoom >= 17.5 && entry.place.tier === 2) ||
          selected
        );
      entry.label.classList.toggle("is-selected", selected);
      entry.label.setAttribute("aria-pressed", String(selected));
      entry.dot.setAttribute("aria-pressed", String(selected));
      entry.marker.setzIndex(selected ? 180 : 120);
    }
    const points = entries.map((entry) => {
      const point = map.lngLatToContainer([
        entry.place.location.lng,
        entry.place.location.lat,
      ]);
      return {
        id: entry.place.id,
        x: point.x,
        y: point.y,
        width: entry.label.offsetWidth,
        height: entry.label.offsetHeight,
        priority: entry.place.id === selectedId ? -1 : entry.place.tier,
        ...(!entry.art.hidden
          ? {
              art: {
                width: entry.art.offsetWidth,
                height: entry.art.offsetHeight,
              },
            }
          : {}),
      };
    });
    if (pinnedOffsets.size === 0) {
      const placements = layoutScenicMarkers(
        points,
        { left: 8, top: 8, right: width - 8, bottom: height - 8 },
        obstacles(),
      );
      for (const p of placements)
        pinnedOffsets.set(
          p.id,
          p.visible
            ? { dx: p.left - p.x, dy: p.top - p.y }
            : { dx: -p.width / 2, dy: 14 },
        );
    }
    const byId = new Map(points.map((p) => [p.id, p]));
    for (const entry of entries) {
      const p = byId.get(entry.place.id)!;
      const offset = pinnedOffsets.get(entry.place.id)!;
      const left = p.x + offset.dx,
        top = p.y + offset.dy;
      const visible =
        left + p.width >= 0 &&
        left <= width &&
        top + p.height >= 0 &&
        top <= height;
      entry.label.style.visibility = visible ? "visible" : "hidden";
      entry.label.tabIndex = visible ? 0 : -1;
      entry.label.setAttribute("aria-hidden", String(!visible));
      entry.line.style.display = visible ? "" : "none";
      entry.label.style.left = left + "px";
      entry.label.style.top = top + "px";
      if (!visible) continue;
      const endX = Math.max(left, Math.min(left + p.width, p.x)),
        endY = Math.max(top, Math.min(top + p.height, p.y));
      entry.line.setAttribute(
        "d",
        "M " + p.x + " " + p.y + " L " + endX + " " + endY,
      );
      entry.line.classList.toggle("is-selected", entry.place.id === selectedId);
    }
  }
  function schedule() {
    if (!disposed && !frame) frame = requestAnimationFrame(render);
  }
  const resetOffsets = () => {
    pinnedOffsets.clear();
    schedule();
  };
  map.on("mapmove", schedule);
  map.on("zoomchange", schedule);
  map.on("resize", schedule);
  void document.fonts.ready.then(resetOffsets);
  schedule();
  return {
    setSelected(id: string | null) {
      selectedId = id;
      schedule();
    },
    setIllustrated(value: boolean) {
      illustrated = value;
      schedule();
    },
    remove() {
      disposed = true;
      cancelAnimationFrame(frame);
      map.off("mapmove", schedule);
      map.off("zoomchange", schedule);
      map.off("resize", schedule);
      entries.forEach((entry) => entry.marker.setMap(null));
      pane.remove();
    },
  };
}
