import { describe, expect, it } from "vitest";
import { clampScenicCenter, scenicOverview } from "./scenic-view";
import { scenicPlaces } from "./qixia-map";

describe("scenic navigation", () => {
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
    [1240, 939],
    [390, 787],
    [844, 330],
    [2200, 1100],
  ])(
    "fits the real landmarks in a %sx%s map, leaving room for controls",
    (width, height) => {
      const view = scenicOverview(width, height);
      const scale = 256 * 2 ** view.zoom;
      const mercatorY = (lat: number) =>
        Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
      for (const place of scenicPlaces) {
        const x =
          width / 2 + ((place.location.lng - view.center.lng) / 360) * scale;
        const y =
          height / 2 -
          ((mercatorY(place.location.lat) - mercatorY(view.center.lat)) /
            (2 * Math.PI)) *
            scale;
        expect(x).toBeGreaterThan(30);
        expect(x).toBeLessThan(width - 30);
        expect(y).toBeGreaterThan(35);
        expect(y).toBeLessThan(height - 35);
      }
    },
  );
});
