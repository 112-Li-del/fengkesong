import { landmarkIcon } from "@/lib/landmark-icons";
import { scenicPlaces } from "@/lib/qixia-map";
import type { MapAPI, MapInstance, Place } from "./amap-types";

export function scenicMarkers(
  api: MapAPI,
  map: MapInstance,
  onSelect: (place: Place) => void,
) {
  // 导览图配准得来的细部点位（id 以 QXS 开头）：远景只留圆点，放大后才展开插画与名称，
  // 否则 100 多个标签会在山门一带糊成一片。
  const minorRoots: HTMLElement[] = [];
  const entries = scenicPlaces.map((place) => {
    const root = document.createElement("div");
    root.className = "scenic-coordinate";
    const minor = place.id.startsWith("QXS");
    if (minor) {
      root.classList.add("is-minor");
      minorRoots.push(root);
    }
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
    dot.setAttribute("aria-label", "查看" + place.name + "的真实位置");
    dot.title = place.name;
    const label = document.createElement("button");
    label.type = "button";
    label.className = "scenic-site-label";
    label.textContent = place.name;
    label.setAttribute("aria-label", "查看" + place.name);
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
    return { place, root, dot, marker, label };
  });
  const MINOR_REVEAL_ZOOM = 16.6;
  const revealMinor = () => {
    const reveal = map.getZoom() >= MINOR_REVEAL_ZOOM;
    for (const root of minorRoots) root.classList.toggle("is-revealed", reveal);
  };
  revealMinor();
  map.on("zoomend", revealMinor);
  return {
    setVisibleIds(ids: ReadonlySet<string>) {
      for (const entry of entries)
        entry.marker.setMap(ids.has(entry.place.id) ? map : null);
    },
    setSelected(id: string | null) {
      for (const entry of entries) {
        const selected = entry.place.id === id;
        entry.root.classList.toggle("is-selected", selected);
        entry.label.classList.toggle("is-selected", selected);
        entry.label.setAttribute("aria-pressed", String(selected));
        entry.dot.setAttribute("aria-pressed", String(selected));
        entry.marker.setzIndex(selected ? 180 : 120);
      }
    },
    remove() {
      map.off("zoomend", revealMinor);
      entries.forEach((entry) => entry.marker.setMap(null));
    },
  };
}
