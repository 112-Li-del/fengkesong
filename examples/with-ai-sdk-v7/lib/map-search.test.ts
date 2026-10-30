import { describe, expect, it } from "vitest";
import { mapSearchCatalog, searchMapPlaces } from "./map-search";
import { scenicPlaces, facilityPlaces } from "./qixia-map";

describe("map node search", () => {
  it("includes every scenic and service node exactly once", () => {
    const ids = [...scenicPlaces, ...facilityPlaces].map((place) => place.id);
    expect(mapSearchCatalog.map((place) => place.id).sort()).toEqual(
      [...ids].sort(),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("searches minor nodes, corrected names and aliases without a network", () => {
    expect(
      searchMapPlaces("明镜湖", "全部").map((place) => place.name),
    ).toEqual(["彩虹明镜"]);
    expect(
      searchMapPlaces("月牙池", "全部").map((place) => place.name),
    ).toEqual(["白莲池（月牙池）"]);
    expect(
      searchMapPlaces("玲峰池", "全部").map((place) => place.name),
    ).toEqual(["玲峰池遗址"]);
    expect(searchMapPlaces("不存在的地点", "全部")).toEqual([]);
  });
  it("filters toilets using their node IDs and combines category with keywords", () => {
    const result = searchMapPlaces("", "厕所");
    expect(result.map((place) => place.id).sort()).toEqual(
      facilityPlaces
        .filter((place) => place.group === "toilet")
        .map((place) => place.id)
        .sort(),
    );
    expect(searchMapPlaces("卫生间", "厕所")).toEqual(result);
    expect(searchMapPlaces("哼哈殿", "厕所").map((place) => place.id)).toEqual([
      "QXF020",
    ]);
  });
  it("provides dining and rest categories using existing places", () => {
    expect(searchMapPlaces("", "餐饮").map((place) => place.name)).toContain(
      "千佛斋",
    );
    expect(searchMapPlaces("", "休息").map((place) => place.name)).toContain(
      "半馆",
    );
    expect(searchMapPlaces("", "景点").map((place) => place.name)).toContain(
      "哼哈殿",
    );
    expect(searchMapPlaces("", "全部")).toHaveLength(mapSearchCatalog.length);
  });
});
