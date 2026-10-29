import { describe, expect, it } from "vitest";
import { landmarkIcon } from "./landmark-icons";
import {
  scenicPlaces,
  scenicSearchResults,
  withinScenicView,
} from "./qixia-map";

describe("Qixia scenic map search", () => {
  it("uses visitor priorities independently of POI source and legacy tiers", () => {
    for (const name of [
      "哼哈殿",
      "钟楼",
      "鼓楼",
      "半馆",
      "印心湖",
      "桃花涧",
      "桃花坞",
      "萌宠乐园",
      "景区南门",
    ])
      expect(scenicPlaces.find((place) => place.name === name)?.tier).toBe(1);
    for (const name of ["凤翔峰", "毗卢宝殿", "虎爪岩", "德云亭"])
      expect(scenicPlaces.find((place) => place.name === name)?.tier).toBe(2);
    expect(
      scenicPlaces.every((place) => place.tier === 1 || place.tier === 2),
    ).toBe(true);
  });
  it("keeps one provider-backed marker for each corrected duplicate", () => {
    for (const [name, id] of [
      ["毗卢宝殿", "B0FFFFAB2W"],
      ["定照庵碑刻", "B0MBFS3D1J"],
    ]) {
      const matches = scenicPlaces.filter((place) => place.name === name);
      expect(matches).toHaveLength(1);
      expect(matches[0]?.id).toBe(id);
    }
    for (const name of [
      "有凌云意",
      "小营盘遗址",
      "玲峰池",
      "青锋剑石",
      "白莲池",
      "白鹿泉",
    ])
      expect(scenicPlaces.some((place) => place.name === name)).toBe(true);
    for (const name of [
      "毘灵宝殿",
      "定照庵石刻",
      "有灵云意",
      "小营盘娱乐场",
      "玲珑池遗址",
      "青锋剑",
      "白莲池（用牙池）",
      "白鹿泉遗址",
    ])
      expect(scenicPlaces.some((place) => place.name === name)).toBe(false);
  });
  it("uses checked provider positions without conflating nearby or similarly named sites", () => {
    expect(scenicPlaces.find((place) => place.name === "德云亭")).toMatchObject(
      {
        id: "B0FFFEVMY2",
        location: { lng: 118.960474, lat: 32.155214 },
      },
    );
    expect(scenicPlaces.some((place) => place.id === "B0FFF0FKGJ")).toBe(false);
    expect(
      scenicSearchResults([
        {
          id: "B0FFF0FKGJ",
          name: "德云庵",
          location: { lng: 118.960538, lat: 32.153709 },
        },
      ]),
    ).toEqual([]);
    expect(scenicPlaces.find((place) => place.name === "紫峰阁")).toMatchObject(
      {
        id: "B0FFFFAF7Z",
        location: { lng: 118.96044, lat: 32.15126 },
      },
    );
    expect(
      scenicPlaces.find((place) => place.name === "有凌云意")?.location,
    ).toEqual({ lng: 118.957999, lat: 32.156411 });
    expect(scenicPlaces.find((place) => place.id === "B0FFFFKJRG")?.name).toBe(
      "弥勒圣境",
    );
    expect(scenicPlaces.find((place) => place.name === "双亭")?.id).toBe(
      "QXS015",
    );
  });
  it("keeps corrected search labels and existing artwork when provider names differ", () => {
    const fresh = {
      id: "B0MBFS3D1J",
      name: "栖霞山定照庵石刻",
      location: { lng: 118.971714, lat: 32.154234 },
    };
    expect(scenicSearchResults([fresh])[0]).toEqual({
      ...fresh,
      name: "定照庵碑刻",
    });
    expect(landmarkIcon("毗卢宝殿")).toBe("/landmarks/毘灵宝殿.png");
    expect(landmarkIcon("有凌云意")).toBe("/landmarks/有灵云意.png");
    expect(landmarkIcon("小营盘遗址")).toBe("/landmarks/小营盘娱乐场.png");
    expect(landmarkIcon("定照庵碑刻")).toBe("/landmarks/定照庵石刻.png");
    expect(landmarkIcon("弥勒圣境")).toBe("/landmarks/弥勒殿.png");
  });
  const temple = {
    id: "B00190D2L7",
    name: "栖霞山名胜风景区摄山栖霞寺",
    location: { lng: 118.957983, lat: 32.151807 },
  };
  const unrelated = {
    id: "B0LK5SSXY4",
    name: "萌宠乐园(万达茂店)",
    location: { lng: 118.990585, lat: 32.123194 },
  };

  it("keeps a real scenic POI and rejects the off-site same-name business", () => {
    expect(scenicSearchResults([unrelated, temple])).toEqual([temple]);
  });
  it("shows each provider POI only once and preserves result order", () => {
    const pagoda = {
      id: "B001909CRJ",
      name: "栖霞古寺舍利塔",
      location: { lng: 118.959868, lat: 32.151791 },
    };
    expect(scenicSearchResults([temple, pagoda, temple])).toEqual([
      temple,
      pagoda,
    ]);
  });
  it("does not recenter the park on an outside or invalid location fix", () => {
    expect(withinScenicView(temple.location)).toBe(true);
    expect(withinScenicView({ lng: 118.7969, lat: 32.0603 })).toBe(false);
    expect(withinScenicView({ lng: Number.NaN, lat: 32.1518 })).toBe(false);
  });
});
