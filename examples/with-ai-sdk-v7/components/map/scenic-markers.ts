import { landmarkIcon } from "@/lib/landmark-icons";
import { layoutScenicPoints } from "@/lib/scenic-display";
import { scenicPlaces } from "@/lib/qixia-map";
import type { MapAPI, MapInstance, Place } from "./amap-types";

export function scenicMarkers(
  api: MapAPI,
  map: MapInstance,
  onSelect: (place: Place) => void,
) {
  let selectedId: string | null = null;
  let visibleIds: ReadonlySet<string> = new Set(scenicPlaces.map((p) => p.id));
  let routeIds: ReadonlyMap<string, number> = new Map();
  const entries = scenicPlaces.map((place) => {
    const root = document.createElement("div");
    root.className = "scenic-coordinate";
    const icon = landmarkIcon(place.name);
    let art: HTMLElement;
    if (icon) {
      const img = document.createElement("img");
      img.className = "scenic-site-art is-icon";
      img.src = icon;
      img.alt = "";
      img.draggable = false;
      img.decoding = "async";
      art = img;
    } else {
      const span = document.createElement("span");
      span.className = "scenic-site-art art-" + place.art;
      art = span;
    }
    art.setAttribute("aria-hidden", "true");
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "scenic-site-dot";
    dot.setAttribute("aria-label", "查看" + place.name + "的位置");
    dot.title = place.name;
    const label = document.createElement("button");
    label.type = "button";
    label.className = "scenic-site-label";
    label.textContent = place.name;
    label.setAttribute("aria-label", "查看" + place.name);
    const number = document.createElement("span");
    number.className = "scenic-route-number";
    dot.append(number);
    root.append(art, dot, label);
    const marker = new api.Marker({
      map,
      position: [place.location.lng, place.location.lat],
      content: root,
      anchor: "top-left",
      offset: new api.Pixel(0, 0),
      zIndex: 120,
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
    return { place, root, dot, marker, label, art, number };
  });
  const update = () => {
    const { clientWidth: width, clientHeight: height } = map.getContainer();
    const points = entries
      .filter((e) => visibleIds.has(e.place.id))
      .map((e) => ({
        id: e.place.id,
        name: e.place.name,
        ...map.lngLatToContainer([e.place.location.lng, e.place.location.lat]),
        width: Math.max(
          e.label.scrollWidth,
          e.label.textContent!.length * 13 + 18,
        ),
      }));
    const layout = layoutScenicPoints(
      points,
      map.getZoom(),
      width,
      height,
      selectedId,
      routeIds,
    );
    for (const e of entries) {
      const state = layout.get(e.place.id);
      e.marker.setMap(state ? map : null);
      e.root.classList.toggle("has-lod-label", !!state?.label);
      e.root.classList.toggle("has-lod-art", !!state?.art);
      if (state?.label) {
        e.label.style.left = state.label.x + "px";
        e.label.style.top = state.label.y + "px";
      }
      const order = routeIds.get(e.place.id);
      e.root.classList.toggle("is-route-stop", order !== undefined);
      e.number.textContent = order === undefined ? "" : String(order);
      e.dot.setAttribute(
        "aria-label",
        (order === undefined ? "" : "路线第" + order + "站，") +
          "查看" +
          e.place.name +
          "的位置",
      );
    }
  };
  update();
  for (const event of ["zoomend", "moveend", "resize"]) map.on(event, update);
  return {
    setVisibleIds(ids: ReadonlySet<string>) {
      visibleIds = ids;
      update();
    },
    setRoute(ids: ReadonlyMap<string, number>) {
      routeIds = ids;
      update();
    },
    setSelected(id: string | null, bounce = false) {
      selectedId = id;
      for (const entry of entries) {
        const selected = entry.place.id === id;
        entry.root.classList.toggle("is-selected", selected);
        if (
          selected &&
          bounce &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          for (const animation of entry.root.getAnimations())
            animation.cancel();
          entry.root.animate(
            [
              { transform: "translateY(0)" },
              { transform: "translateY(-6px)" },
              { transform: "translateY(0)" },
            ],
            { duration: 420, easing: "ease-out" },
          );
        }
        entry.label.classList.toggle("is-selected", selected);
        entry.label.setAttribute("aria-pressed", String(selected));
        entry.dot.setAttribute("aria-pressed", String(selected));
        entry.marker.setzIndex(selected ? 180 : 120);
      }
      update();
    },
    remove() {
      for (const event of ["zoomend", "moveend", "resize"])
        map.off(event, update);
      entries.forEach((entry) => entry.marker.setMap(null));
    },
  };
}
