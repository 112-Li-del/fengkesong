import boundary from "@/lib/qixia-paper-boundary.json";
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
    zoom: map.getZoom(),
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
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("fill", "#f4f2af");
  path.setAttribute("fill-rule", "evenodd");
  svg.append(path);
  host.append(svg);
  let visible = true;
  let frame = 0;
  let removed = false;
  const sync = () => {
    if (removed) return;
    const center = map.getCenter();
    background.setZoomAndCenter(map.getZoom(), [center.lng, center.lat], true);
    path.setAttribute(
      "d",
      [boundary.path, ...boundary.holes]
        .map(
          (ring) =>
            ring
              .map((point, index) => {
                const pixel = map.lngLatToContainer(point);
                return `${index ? "L" : "M"}${pixel.x},${pixel.y}`;
              })
              .join(" ") + "Z",
        )
        .join(" "),
    );
  };
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(sync);
  };
  const events = ["mapmove", "zoomchange", "resize", "complete"];
  events.forEach((event) => map.on(event, schedule));
  const resize = new ResizeObserver(() => {
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
    if (visible) schedule();
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
