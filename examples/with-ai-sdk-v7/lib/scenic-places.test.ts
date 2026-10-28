import { describe, expect, it } from "vitest";
import { collectScenicPlaces, referenceScenicPlaces } from "./scenic-places";
import type { Place } from "../components/map/amap-types";

const place = (id: string, name = id): Place => ({
  id,
  name,
  location: { lng: 118.963, lat: 32.155 },
});
describe("reference scenic places", () => {
  it("keeps the 24 verified reference entries when nearby search is unavailable", () => {
    const result = collectScenicPlaces([]);
    expect(result).toHaveLength(24);
    expect(new Set(result.map((p) => p.id)).size).toBe(24);
    for (const name of ["彩虹明镜", "栖霞古寺", "陆羽茶庄", "钟楼", "鼓楼"])
      expect(result.some((p) => p.referenceName === name)).toBe(true);
    for (const p of result) {
      expect(p.location.lng).toBeGreaterThan(118.95);
      expect(p.location.lng).toBeLessThan(118.98);
      expect(p.location.lat).toBeGreaterThan(32.14);
      expect(p.location.lat).toBeLessThan(32.17);
    }
  });
  it("does not truncate additional clickable scenic places to ten", () => {
    const nearby = Array.from({ length: 15 }, (_, i) => place("extra-" + i));
    const result = collectScenicPlaces(nearby);
    expect(result).toHaveLength(39);
    expect(result.some((p) => p.id === "extra-14")).toBe(true);
  });
  it("deduplicates by POI ID and prefers current coordinates without losing the reference label", () => {
    const first = referenceScenicPlaces[0]!;
    const fresh = {
      ...first,
      name: "updated AMap name",
      location: { lng: 118.9548, lat: 32.1508 },
    };
    const result = collectScenicPlaces([fresh, fresh]);
    expect(result.filter((p) => p.id === first.id)).toEqual([
      {
        ...fresh,
        referenceCode: first.referenceCode,
        referenceName: first.referenceName,
      },
    ]);
  });
  it("leaves all five deferred locations out even when returned by nearby search", () => {
    const nearby = ["霜红苑", "桃花涧", "桃花坞", "印心湖", "萌宠乐园"].map(
      (name, index) => place("deferred-" + index, "栖霞山名胜风景区-" + name),
    );
    expect(collectScenicPlaces(nearby)).toHaveLength(24);
  });
});
