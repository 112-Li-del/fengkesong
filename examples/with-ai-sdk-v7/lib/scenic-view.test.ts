import { describe, expect, it } from "vitest";
import {
  clampOverviewCenter,
  clampScenicCenter,
  scenicOverview,
} from "./scenic-view";
import { scenicPlaces } from "./qixia-map";

describe("scenic navigation", () => {
  it("keeps the approved base frame when the landmark catalog grows", () => {
    const before = scenicOverview(1240, 939);
    const count = scenicPlaces.length;
    scenicPlaces.push({
      ...scenicPlaces[0]!,
      id: "future-landmark",
      location: { lng: 118.975, lat: 32.164 },
    });
    try {
      expect(scenicOverview(1240, 939)).toEqual(before);
    } finally {
      scenicPlaces.splice(count);
    }
  });
  it("locks the center at the base zoom and below", () => {
    const base = scenicOverview(1240, 939);
    for (const zoom of [base.zoom, base.zoom - 1])
      expect(
        clampOverviewCenter({ lng: 118.98, lat: 32.17 }, zoom, base, 1240, 939),
      ).toEqual(base.center);
  });
  it("allows panning after zooming without showing beyond the base frame", () => {
    const width = 1240,
      height = 939;
    const base = scenicOverview(width, height);
    const zoom = base.zoom + 1;
    const scale = 256 * 2 ** zoom;
    const baseScale = 256 * 2 ** base.zoom;
    const mercatorY = (lat: number) =>
      Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) / (2 * Math.PI);
    for (const target of [
      { lng: 118.98, lat: 32.18 },
      { lng: 118.94, lat: 32.13 },
    ]) {
      const next = clampOverviewCenter(target, zoom, base, width, height);
      expect(next).not.toEqual(base.center);
      expect(
        Math.abs(next.lng - base.center.lng) / 360 + width / (2 * scale),
      ).toBeCloseTo(width / (2 * baseScale), 10);
      expect(
        Math.abs(mercatorY(next.lat) - mercatorY(base.center.lat)) +
          height / (2 * scale),
      ).toBeCloseTo(height / (2 * baseScale), 10);
      expect(clampOverviewCenter(next, zoom, base, width, height)).toEqual(
        next,
      );
    }
  });
  it("stops at the closest boundary instead of snapping to the middle", () => {
    expect(clampScenicCenter({ lng: 118.95, lat: 32.1554 })).toEqual({
      lng: 118.9505,
      lat: 32.1554,
    });
    expect(clampScenicCenter({ lng: 118.96, lat: 32.18 })).toEqual({
      lng: 118.96,
      lat: 32.1655,
    });
    expect(clampScenicCenter({ lng: 118.964226, lat: 32.157522 })).toEqual({
      lng: 118.964226,
      lat: 32.157522,
    });
  });
  it.each([
    [1240, 939, 16.880349132129513],
    [390, 787, 15.365775959299755],
    [844, 330, 14.148260319693282],
    [2200, 1100, 17.227211661088106],
  ])(
    "centers the map one zoom level closer in a %sx%s map",
    (width, height, expectedZoom) => {
      const view = scenicOverview(width, height);
      expect(view.zoom).toBeCloseTo(expectedZoom, 8);
      const scale = 256 * 2 ** view.zoom;
      const mercatorY = (lat: number) =>
        Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
      const pixels: { x: number; y: number }[] = [];
      for (const place of scenicPlaces) {
        const x =
          width / 2 + ((place.location.lng - view.center.lng) / 360) * scale;
        const y =
          height / 2 -
          ((mercatorY(place.location.lat) - mercatorY(view.center.lat)) /
            (2 * Math.PI)) *
            scale;
        pixels.push({ x, y });
      }
      expect(
        (Math.min(...pixels.map((p) => p.x)) +
          Math.max(...pixels.map((p) => p.x))) /
          2,
      ).toBeCloseTo(width / 2, 5);
      expect(
        (Math.min(...pixels.map((p) => p.y)) +
          Math.max(...pixels.map((p) => p.y))) /
          2,
      ).toBeCloseTo(height / 2, 5);
    },
  );
});
