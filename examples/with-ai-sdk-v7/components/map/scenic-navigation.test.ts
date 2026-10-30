import { afterEach, describe, expect, it, vi } from "vitest";
import { scenicNavigation } from "./scenic-navigation";
import type { MapInstance } from "./amap-types";

afterEach(() => vi.unstubAllGlobals());

function setup(
  width = 1368,
  height = 908,
  open = true,
  body = { left: 1007, right: 1323, top: 57, bottom: 866 },
) {
  const origin = { left: 260, top: 61 };
  const panel = {
    getBoundingClientRect: () => ({
      left: 1007,
      right: 1145,
      top: 11,
      bottom: 49,
    }),
  };
  const dropdown = { getBoundingClientRect: () => body };
  vi.stubGlobal("window", { matchMedia: () => ({ matches: width <= 720 }) });
  vi.stubGlobal("document", {
    querySelector: (selector: string) =>
      selector === ".map-place-panel" ? panel : open ? dropdown : null,
  });
  const container = {
    clientWidth: width,
    clientHeight: height,
    getBoundingClientRect: () => origin,
  } as HTMLElement;
  let center = { lng: 118.96, lat: 32.155 };
  let zoom = 16;
  const scale = () => 10000 * 2 ** (zoom - 16);
  const map = {
    clearLimitBounds: vi.fn(),
    setZooms: vi.fn(),
    setStatus: vi.fn(),
    getZoom: () => zoom,
    setZoomAndCenter: vi.fn((nextZoom: number, [lng, lat]: number[]) => {
      zoom = nextZoom;
      center = { lng: lng!, lat: lat! };
    }),
    setCenter: vi.fn(([lng, lat]: number[]) => {
      center = { lng: lng!, lat: lat! };
    }),
    lngLatToContainer: ([lng, lat]: number[]) => ({
      x: width / 2 + (lng! - center.lng) * scale(),
      y: height / 2 - (lat! - center.lat) * scale(),
    }),
    containerToLngLat: ([x, y]: number[]) => ({
      lng: center.lng + (x! - width / 2) / scale(),
      lat: center.lat - (y! - height / 2) / scale(),
    }),
  };
  const navigation = scenicNavigation(map as unknown as MapInstance, container);
  const point = (x: number, y: number) => map.containerToLngLat([x, y]);
  return { map, navigation, point };
}

describe("reveal a place selected from the search list", () => {
  it("preserves an already closer zoom", () => {
    const { map, navigation, point } = setup();
    map.setZoomAndCenter(19, [118.96, 32.155]);
    navigation.reveal(point(900, 300));
    expect(map.getZoom()).toBe(19);
  });
  it("centers a visible landmark in the free area with a modest zoom", () => {
    const { map, navigation, point } = setup();
    const selected = point(419, 543);
    const before = map.getZoom();
    navigation.reveal(selected);
    const pixel = map.lngLatToContainer([selected.lng, selected.lat]);
    expect(pixel.x).toBeCloseTo(373.5);
    expect(pixel.y).toBeCloseTo(419);
    expect(map.getZoom()).toBeCloseTo(before + 0.5);
    navigation.reveal(selected);
    expect(map.getZoom()).toBeCloseTo(before + 0.5);
  });
  it("centers a covered landmark in the free area", () => {
    const { map, navigation, point } = setup();
    const selected = point(900, 300);
    navigation.reveal(selected);
    const pixel = map.lngLatToContainer([selected.lng, selected.lat]);
    expect(map.setCenter).not.toHaveBeenCalled();
    expect(pixel.x).toBeGreaterThanOrEqual(32);
    expect(pixel.x).toBeLessThan(715);
    expect(pixel.y).toBeGreaterThan(60);
    expect(pixel.y).toBeLessThan(778);
    expect(map.setZoomAndCenter).toHaveBeenCalledTimes(2);
  });
  it("ignores a collapsed dropdown when revealing an off-screen place", () => {
    const { map, navigation, point } = setup(1368, 908, false);
    const selected = point(-200, 300);
    navigation.reveal(selected);
    const pixel = map.lngLatToContainer([selected.lng, selected.lat]);
    expect(pixel.x).toBeCloseTo(680);
    expect(pixel.y).toBeCloseTo(419);
  });
  it("uses the space below an open mobile dropdown", () => {
    const { map, navigation, point } = setup(390, 787, true, {
      left: 280,
      right: 630,
      top: 61,
      bottom: 301,
    });
    const selected = point(150, 100);
    navigation.reveal(selected);
    const pixel = map.lngLatToContainer([selected.lng, selected.lat]);
    expect(pixel.x).toBeGreaterThan(32);
    expect(pixel.x).toBeLessThan(350);
    expect(pixel.y).toBeGreaterThan(272);
    expect(pixel.y).toBeLessThan(657);
  });
});
