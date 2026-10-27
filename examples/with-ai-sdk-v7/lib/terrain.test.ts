import { describe, expect, it } from "vitest";
import {
  sampleElevation,
  surfaceHeight,
  terrainSchema,
  terrainToGcj,
} from "./terrain";
const grid = {
  version: 1 as const,
  bounds: [118, 32, 119, 33] as [number, number, number, number],
  size: 2,
  heights: [100, 200, 300, 400],
  source: "fixture",
};
describe("terrain sampling", () => {
  it("matches AMap GPS conversion at three public Qixia control points", () => {
    const controls = [
      [118.945, 32.143, 118.950083, 32.140804],
      [118.96479, 32.16043, 118.969929, 32.158275],
      [118.984, 32.179, 118.989205, 32.176895],
    ];
    for (const [lng, lat, expectedLng, expectedLat] of controls) {
      const actual = terrainToGcj(lng!, lat!);
      expect(Math.abs(actual[0] - expectedLng!)).toBeLessThan(0.000002);
      expect(Math.abs(actual[1] - expectedLat!)).toBeLessThan(0.000002);
    }
  });

  it("samples north-first rows, interpolates heights and excludes outside points", () => {
    expect(sampleElevation(grid, 118, 33)).toBe(100);
    expect(sampleElevation(grid, 119, 32)).toBe(400);
    expect(sampleElevation(grid, 118.5, 32.5)).toBe(250);
    expect(sampleElevation(grid, 117.9, 32.5)).toBeNull();
  });
  it("blends the display boundary into the unchanged flat basemap", () => {
    expect(surfaceHeight(grid, 118, 32.5, 1.5)).toBe(0);
    expect(surfaceHeight(grid, 118.5, 32.5, 1.5)).toBe(375);
    expect(surfaceHeight(grid, 117, 32.5, 1.5)).toBe(0);
  });
  it("rejects incomplete grids before constructing a GPU mesh", () => {
    expect(terrainSchema.safeParse({ ...grid, heights: [10] }).success).toBe(
      false,
    );
  });
  it("uses a mainland GCJ transform consistent with a known Beijing control point", () => {
    const result = terrainToGcj(116.404, 39.915);
    expect(result[0]).toBeCloseTo(116.4102445, 6);
    expect(result[1]).toBeCloseTo(39.9164043, 6);
  });
});
