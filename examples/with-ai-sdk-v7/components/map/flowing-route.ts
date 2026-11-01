import type { LngLat, MapAPI, MapInstance } from "./amap-types";

export type WalkingRouteLeg = { from: LngLat; to: LngLat };
const cache = new Map<string, { until: number; path: LngLat[] }>();

export function flowingRoute(map: MapInstance) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("scenic-flow-route");
  svg.setAttribute("aria-hidden", "true");
  const group = document.createElementNS(svg.namespaceURI, "g");
  svg.append(group);
  map.getContainer().append(svg);
  let anchor: LngLat | undefined;
  let baseAnchor = { x: 0, y: 0 };
  let baseZoom = map.getZoom(10);
  let frame = 0;
  let removed = false;
  const sync = () => {
    frame = 0;
    if (removed || !anchor) return;
    const pixel = map.lngLatToContainer([anchor.lng, anchor.lat]);
    const scale = 2 ** (map.getZoom(10) - baseZoom);
    group.setAttribute(
      "transform",
      `matrix(${scale} 0 0 ${scale} ${pixel.x - baseAnchor.x * scale} ${pixel.y - baseAnchor.y * scale})`,
    );
  };
  const schedule = () => {
    if (!removed && !frame) frame = requestAnimationFrame(sync);
  };
  const events = ["mapmove", "zoomchange", "resize"];
  events.forEach((event) => map.on(event, schedule));
  return {
    setPaths(paths: LngLat[][]) {
      if (removed) return;
      anchor = paths[0]?.[0];
      baseZoom = map.getZoom(10);
      if (anchor) baseAnchor = map.lngLatToContainer([anchor.lng, anchor.lat]);
      const geometry = paths
        .map((path) =>
          path
            .map((point, i) => {
              const p = map.lngLatToContainer([point.lng, point.lat]);
              return `${i ? "L" : "M"}${p.x},${p.y}`;
            })
            .join(" "),
        )
        .join(" ");
      group.replaceChildren();
      for (const className of [
        "scenic-route-outline",
        "scenic-route-core",
        "scenic-route-flow",
      ]) {
        const line = document.createElementNS(svg.namespaceURI, "path");
        line.setAttribute("class", className);
        line.setAttribute("d", geometry);
        line.setAttribute("fill", "none");
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("stroke-linejoin", "round");
        line.setAttribute("vector-effect", "non-scaling-stroke");
        group.append(line);
      }
      sync();
    },
    remove() {
      removed = true;
      cancelAnimationFrame(frame);
      events.forEach((event) => map.off(event, schedule));
      svg.remove();
    },
  };
}

export function traceWalkingRoute(
  api: MapAPI,
  legs: WalkingRouteLeg[],
  onPaths: (
    paths: LngLat[][],
    progress: { completed: number; total: number; failed?: boolean },
  ) => void,
) {
  const paths: LngLat[][] = [];
  let removed = false;
  let index = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let planner: InstanceType<MapAPI["Walking"]> | undefined;
  const next = () => {
    if (removed || index >= legs.length) return;
    const leg = legs[index]!;
    const key = `${leg.from.lng},${leg.from.lat}:${leg.to.lng},${leg.to.lat}`;
    const found = cache.get(key);
    if (found && found.until > Date.now()) {
      finish(found.path);
      return;
    }
    let settled = false;
    const complete = (path?: LngLat[]) => {
      if (removed || settled) return;
      settled = true;
      clearTimeout(timeout);
      planner?.clear();
      if (path) {
        if (cache.size >= 128) cache.delete(cache.keys().next().value!);
        cache.set(key, { until: Date.now() + 600000, path });
      }
      finish(path);
    };
    planner = new api.Walking({ hideMarkers: true });
    timeout = setTimeout(() => complete(), 12000);
    try {
      planner.search(
        [leg.from.lng, leg.from.lat],
        [leg.to.lng, leg.to.lat],
        (status, result) => {
          const path =
            result.routes?.[0]?.steps?.flatMap((step) => step.path) ?? [];
          complete(
            status === "complete" &&
              path.length >= 2 &&
              path.every(
                (p) => Number.isFinite(p.lng) && Number.isFinite(p.lat),
              )
              ? path.map((p) => ({ lng: p.lng, lat: p.lat }))
              : undefined,
          );
        },
      );
    } catch {
      complete();
    }
  };
  const finish = (path?: LngLat[]) => {
    if (removed) return;
    if (path) paths.push(path);
    index++;
    onPaths([...paths], {
      completed: index,
      total: legs.length,
      ...(!path ? { failed: true } : {}),
    });
    if (path && index < legs.length) timer = setTimeout(next, 250);
  };
  if (legs.length) next();
  else onPaths([], { completed: 0, total: 0 });
  return () => {
    removed = true;
    clearTimeout(timer);
    clearTimeout(timeout);
    planner?.clear();
  };
}
