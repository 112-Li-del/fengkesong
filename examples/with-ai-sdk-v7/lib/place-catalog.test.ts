import { describe, expect, it } from "vitest";
import {
  buildPlaceCatalog,
  filterPlaceCatalog,
  type PlaceGroups,
} from "./place-catalog";
const spot = (id: string) => ({
  id,
  name: id,
  location: { lng: 118.96, lat: 32.15 },
});
const groups: PlaceGroups = {
  景点: [
    { ...spot("temple"), referenceName: "栖霞古寺", referenceCode: "B5" },
    spot("cafe"),
  ],
  厕所: [spot("toilet")],
  餐饮: [spot("cafe")],
  休息: [spot("bench")],
};
describe("map category catalog", () => {
  it("shows every category by default with one marker per POI", () => {
    const all = filterPlaceCatalog(buildPlaceCatalog(groups), "全部");
    expect(all.map((p) => p.id)).toEqual(["temple", "cafe", "toilet", "bench"]);
    expect(all.find((p) => p.id === "cafe")?.category).toBe("餐饮");
  });
  it("keeps the same marker numbers when filtering and returning to all", () => {
    const all = buildPlaceCatalog(groups);
    expect(filterPlaceCatalog(all, "厕所")).toEqual([all[2]]);
    expect(filterPlaceCatalog(all, "全部")).toEqual(all);
  });
  it("keeps searched places in the catalog so closing search can reveal all without losing the selected point", () => {
    const custom = spot("new-place");
    const all = buildPlaceCatalog(groups, [custom]);
    expect(filterPlaceCatalog(all, "全部", [custom]).map((p) => p.id)).toEqual([
      "new-place",
    ]);
    expect(filterPlaceCatalog(all, "全部").map((p) => p.id)).toContain(
      "new-place",
    );
    expect(filterPlaceCatalog(all, "全部")).toHaveLength(5);
  });
  it("does not overwrite a reference landmark category or duplicate a search match", () => {
    const all = buildPlaceCatalog(
      { ...groups, 餐饮: [spot("temple"), spot("cafe")] },
      [spot("temple")],
    );
    expect(all.filter((p) => p.id === "temple")).toEqual([
      {
        ...spot("temple"),
        referenceName: "栖霞古寺",
        referenceCode: "B5",
        category: "景点",
        number: 1,
      },
    ]);
    expect(filterPlaceCatalog(all, "全部", [])).toEqual([]);
  });
});
