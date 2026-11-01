import boundary from "../../lib/qixia-paper-boundary.json";
import roads from "../../lib/qixia-roads.json";
import type { MapAPI, MapInstance } from "./amap-types";

export function nativePaperLayer(api: MapAPI, map: MapInstance) {
  const foreground = map.getContainer();
  const host = document.createElement("div");
  host.className = "scenic-native-background";
  host.setAttribute("aria-hidden", "true");
  foreground.before(host);
  const center = map.getCenter();
  const background = new api.Map(host, {
    center: [center.lng, center.lat],
    zoom: map.getZoom(10),
    zooms: [2, 20],
    features: ["bg", "road", "building"],
    viewMode: "2D",
    rotateEnable: false,
    pitchEnable: false,
    dragEnable: false,
    // 高德同时用此开关控制程序缩放；鼠标事件由宿主的 pointer-events 禁用。
    zoomEnable: true,
    keyboardEnable: false,
    resizeEnable: true,
    showLabel: false,
  });
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("scenic-native-paper");
  const geometry = document.createElementNS(svg.namespaceURI, "g");
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("fill", "#f4f2af");
  path.setAttribute("fill-rule", "evenodd");
  const baseZoom = map.getZoom(10);
  const anchor = boundary.path[0]!;
  const baseAnchor = map.lngLatToContainer(anchor);
  const project = (rings: number[][][], close = false) =>
    rings
      .map(
        (ring) =>
          ring
            .map((point, index) => {
              const pixel = map.lngLatToContainer(point);
              return `${index ? "L" : "M"}${pixel.x},${pixel.y}`;
            })
            .join(" ") + (close ? "Z" : ""),
      )
      .join(" ");
  path.setAttribute("d", project([boundary.path, ...boundary.holes], true));
  geometry.append(path);
  const overview = document.createElementNS(svg.namespaceURI, "g");
  overview.classList.add("scenic-overview-roads");
  const roadPath = project(roads.paths);
  for (const [stroke, width] of [
    ["#b6a77b", "4"],
    ["#fff9e7", "2.5"],
  ]) {
    const line = document.createElementNS(svg.namespaceURI, "path");
    line.setAttribute("d", roadPath);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", stroke!);
    line.setAttribute("stroke-width", width!);
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    line.setAttribute("vector-effect", "non-scaling-stroke");
    overview.append(line);
  }
  geometry.append(overview);
  svg.append(geometry);
  host.append(svg);
  let visible = true;
  let frame = 0;
  let removed = false;
  let previous = { zoom: baseZoom, lng: center.lng, lat: center.lat };
  const sync = () => {
    frame = 0;
    if (removed || !visible) return;
    const center = map.getCenter();
    const zoom = map.getZoom(10);
    if (
      zoom !== previous.zoom ||
      center.lng !== previous.lng ||
      center.lat !== previous.lat
    ) {
      background.setZoomAndCenter(zoom, [center.lng, center.lat], true);
      previous = { zoom, lng: center.lng, lat: center.lat };
    }
    const scale = 2 ** (zoom - baseZoom);
    const pixel = map.lngLatToContainer(anchor);
    geometry.setAttribute(
      "transform",
      `matrix(${scale} 0 0 ${scale} ${pixel.x - baseAnchor.x * scale} ${pixel.y - baseAnchor.y * scale})`,
    );
    overview.setAttribute(
      "display",
      zoom >= 13 && zoom < 16 ? "inline" : "none",
    );
  };
  const schedule = () => {
    if (!visible || removed || frame) return;
    frame = requestAnimationFrame(sync);
  };
  const events = ["mapmove", "zoomchange", "resize", "complete"];
  events.forEach((event) => map.on(event, schedule));
  const resize = new ResizeObserver(() => {
    if (!visible) return;
    background.resize();
    schedule();
  });
  resize.observe(foreground);
  const setVisible = (next: boolean) => {
    visible = next;
    foreground.classList.toggle("has-native-paper", visible);
    host.hidden = !visible;
    map.setFeatures(
      visible ? ["road", "building"] : ["bg", "road", "building"],
    );
    if (visible) {
      background.resize();
      schedule();
    }
  };
  setVisible(true);
  sync();
  return {
    setVisible,
    remove() {
      removed = true;
      cancelAnimationFrame(frame);
      events.forEach((event) => map.off(event, schedule));
      resize.disconnect();
      foreground.classList.remove("has-native-paper");
      background.destroy();
      host.remove();
    },
  };
}
