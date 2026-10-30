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
  卫生间: [spot("toilet")],
  停车交通: [spot("parking")],
  门票入口: [spot("gate")],
  购物补给: [spot("shop")],
  安全医疗: [spot("clinic")],
};
describe("map category catalog", () => {
  it("shows every category by default with one marker per POI", () => {
    const all = filterPlaceCatalog(buildPlaceCatalog(groups), "全部");
    expect(all.map((p) => p.id)).toEqual([
      "temple",
      "cafe",
      "toilet",
      "parking",
      "gate",
      "shop",
      "clinic",
    ]);
    expect(all.find((p) => p.id === "cafe")?.category).toBe("景点");
  });
  it("keeps the same marker numbers when filtering and returning to all", () => {
    const all = buildPlaceCatalog(groups);
    expect(filterPlaceCatalog(all, "卫生间")).toEqual([all[2]]);
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
    expect(filterPlaceCatalog(all, "全部")).toHaveLength(8);
  });
  it("does not overwrite a reference landmark category or duplicate a search match", () => {
    const all = buildPlaceCatalog(
      { ...groups, 停车交通: [spot("temple"), spot("cafe")] },
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
