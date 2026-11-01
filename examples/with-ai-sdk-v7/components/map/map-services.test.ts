import { afterEach, describe, expect, it, vi } from "vitest";
import { watchAmapLocation } from "./load-amap";
import { scenicMarkers } from "./scenic-markers";
import { scenicPlaces } from "../../lib/qixia-map";
import { nativePaperLayer } from "./native-paper-layer";
import type { GeoResult, MapAPI, MapInstance } from "./amap-types";

afterEach(() => vi.unstubAllGlobals());

function locationSDK() {
  let receive: (status: string, result: GeoResult) => void;
  const start = vi.fn();
  const stop = vi.fn();
  const convert = vi.fn();
  const api = {
    Geolocation: class {
      constructor(_options: Record<string, unknown>) {}
      watchPosition(callback: typeof receive) {
        receive = callback;
        return 1;
      }
      getCurrentPosition = start;
      clearWatch = stop;
    },
    convertFrom: convert,
  } as unknown as MapAPI;
  const position = vi.fn(),
    error = vi.fn();
  const dispose = watchAmapLocation(api, position, error);
  return {
    position,
    error,
    dispose,
    start,
    stop,
    convert,
    emit: (status: string, result: GeoResult) => receive(status, result),
  };
}

describe("AMap location lifecycle", () => {
  it("requests the first fix immediately and keeps GCJ-02 positions unchanged", () => {
    const geo = locationSDK();
    expect(geo.start).toHaveBeenCalledOnce();
    const point = { lng: 118.957903, lat: 32.151618 };
    geo.emit("complete", {
      position: point,
      accuracy: 10,
      isConverted: true,
      location_type: "h5",
    });
    expect(geo.position).toHaveBeenCalledWith({
      point,
      accuracy: 10,
      timestamp: expect.any(Number),
    });
    expect(geo.convert).not.toHaveBeenCalled();
  });
  it("does not convert a successful HTML5 plugin result twice even when its flag is false", () => {
    const geo = locationSDK();
    const point = { lng: 118.957903, lat: 32.151618 };
    geo.emit("complete", {
      position: point,
      accuracy: 10,
      isConverted: false,
      location_type: "html5",
      message: "Get geolocation success.Convert Success.",
    });
    expect(geo.convert).not.toHaveBeenCalled();
    expect(geo.position.mock.calls[0]![0].point).toEqual(point);
  });
  it("preserves honest accuracy metadata for city-level and unknown-accuracy fixes", () => {
    const geo = locationSDK();
    const point = { lng: 118.96, lat: 32.15 };
    geo.emit("complete", { position: point, location_type: "ip", accuracy: 5 });
    geo.emit("complete", { position: point });
    expect(geo.position.mock.calls.map(([fix]) => fix.accuracy)).toEqual([
      10000, 10000,
    ]);
  });
  it("reports a temporary failure, accepts recovery, and ignores callbacks after stopping", () => {
    const geo = locationSDK();
    geo.emit("error", { message: "Get geolocation timeout." });
    expect(geo.error).toHaveBeenCalledWith(3);
    const fix = { position: { lng: 118.96, lat: 32.15 }, accuracy: 12 };
    geo.emit("complete", fix);
    expect(geo.position).toHaveBeenCalledOnce();
    geo.dispose();
    geo.emit("complete", fix);
    geo.emit("error", { message: "permission denied" });
    expect(geo.position).toHaveBeenCalledOnce();
    expect(geo.error).toHaveBeenCalledOnce();
    expect(geo.stop).toHaveBeenCalledOnce();
  });
  it("does not allow an older GPS conversion to overwrite a newer position", () => {
    const geo = locationSDK();
    geo.emit("complete", {
      position: { lng: 118.95, lat: 32.15 },
      accuracy: 8,
      isConverted: false,
    });
    expect(geo.convert).toHaveBeenCalledWith(
      [118.95, 32.15],
      "gps",
      expect.any(Function),
    );
    const current = { lng: 118.96, lat: 32.16 };
    geo.emit("complete", { position: current, accuracy: 9, isConverted: true });
    geo.convert.mock.calls[0]![2]("complete", {
      locations: [{ lng: 118.955, lat: 32.148 }],
    });
    expect(geo.position).toHaveBeenCalledOnce();
    expect(geo.position.mock.calls[0]![0].point).toEqual(current);
  });
});

class Element {
  children: Element[] = [];
  style: Record<string, string> = {};
  textContent = "";
  clientWidth = 1200;
  clientHeight = 800;
  addEventListener = vi.fn();
  attributes = new Map<string, string>();
  hidden = false;
  namespaceURI = "http://www.w3.org/2000/svg";
  classList = { add: vi.fn(), toggle: vi.fn(), remove: vi.fn() };
  append(...children: Element[]) {
    this.children.push(...children);
  }
  before = vi.fn();
  remove = vi.fn();
  setAttribute(key: string, value: string) {
    this.attributes.set(key, value);
  }
}
function paperSDK() {
  const nodes: Element[] = [];
  vi.stubGlobal("document", {
    createElement: () => {
      const e = new Element();
      nodes.push(e);
      return e;
    },
    createElementNS: () => {
      const e = new Element();
      nodes.push(e);
      return e;
    },
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  let frame: FrameRequestCallback | undefined;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frame = callback;
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {
    frame = undefined;
  });
  const flush = () => {
    const pending = frame;
    frame = undefined;
    pending?.(0);
  };
  let zoom = 15;
  let center = { lng: 118.96, lat: 32.155 };
  const listeners = new Map<string, () => void>();
  const foreground = new Element();
  const project = vi.fn((point: number[]) => ({
    x: 600 + (point[0]! - center.lng) * 2 ** zoom,
    y: 400 - (point[1]! - center.lat) * 2 ** zoom,
  }));
  const map = {
    getContainer: () => foreground,
    getZoom: () => zoom,
    getCenter: () => center,
    lngLatToContainer: project,
    on: (event: string, fn: () => void) => listeners.set(event, fn),
    off: (event: string) => listeners.delete(event),
    setFeatures: vi.fn(),
  } as unknown as MapInstance;
  const move = vi.fn(),
    destroy = vi.fn();
  const api = {
    Map: class {
      setZoomAndCenter = move;
      resize() {}
      destroy = destroy;
    },
  } as unknown as MapAPI;
  const layer = nativePaperLayer(api, map);
  flush();
  const change = (nextZoom: number, lng = center.lng) => {
    zoom = nextZoom;
    center = { ...center, lng };
    listeners.get("mapmove")?.();
    listeners.get("zoomchange")?.();
    flush();
  };
  return { map, nodes, project, layer, change, move, destroy, listeners };
}

describe("scenic paper and overview roads", () => {
  it("keeps roads visible in the park overview and hands over to native detail when zoomed in", () => {
    const sdk = paperSDK();
    const overview = sdk.nodes.find((e) => e.attributes.has("display"))!;
    expect(overview.attributes.get("display")).toBe("inline");
    expect(overview.children[0]!.attributes.get("d")).toMatch(/^M.+L/);
    sdk.change(16);
    expect(overview.attributes.get("display")).toBe("none");
    sdk.change(14);
    expect(overview.attributes.get("display")).toBe("inline");
    sdk.change(12);
    expect(overview.attributes.get("display")).toBe("none");
  });
  it("reuses projected geometry and does not synchronize a hidden background map", () => {
    const sdk = paperSDK();
    const before = sdk.project.mock.calls.length;
    for (let i = 0; i < 40; i++) sdk.change(15 + i / 100, 118.96 + i / 100000);
    expect(sdk.project.mock.calls.length - before).toBeLessThanOrEqual(40);
    const moves = sdk.move.mock.calls.length;
    sdk.layer.setVisible(false);
    sdk.change(17, 118.965);
    expect(sdk.move).toHaveBeenCalledTimes(moves);
    sdk.layer.setVisible(true);
    sdk.change(17, 118.965);
    expect(sdk.move).toHaveBeenLastCalledWith(17, [118.965, 32.155], true);
    sdk.layer.remove();
    expect(sdk.listeners.size).toBe(0);
    expect(sdk.destroy).toHaveBeenCalledOnce();
  });
});

describe("scenic marker movement", () => {
  it("only adds or removes markers when their visibility changes", () => {
    const sdk = paperSDK();
    const markers: { setMap: ReturnType<typeof vi.fn> }[] = [];
    const api = {
      Pixel: class {},
      Marker: class {
        setMap = vi.fn();
        on() {}
        setzIndex() {}
        constructor() {
          markers.push(this);
        }
      },
    } as unknown as MapAPI;
    const layer = scenicMarkers(api, sdk.map, vi.fn());
    const count = () =>
      markers.reduce((n, marker) => n + marker.setMap.mock.calls.length, 0);
    const initial = count();
    sdk.listeners.get("moveend")!();
    sdk.listeners.get("zoomend")!();
    expect(count()).toBe(initial);
    layer.setVisibleIds(new Set());
    const hidden = count();
    expect(hidden).toBeGreaterThan(initial);
    layer.setVisibleIds(new Set());
    expect(count()).toBe(hidden);
    layer.setVisibleIds(new Set(scenicPlaces.map((p) => p.id)));
    expect(count()).toBeGreaterThan(hidden);
    layer.remove();
    sdk.layer.remove();
  });
});
