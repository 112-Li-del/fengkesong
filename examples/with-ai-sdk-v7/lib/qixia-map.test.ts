import { describe, expect, it } from "vitest";
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
  it("keeps the confirmed canonical names and collapses provider aliases", () => {
    for (const name of [
      "毘灵宝殿",
      "定照庵石刻",
      "玲珑池遗址",
      "白莲池（用牙池）",
    ])
      expect(scenicPlaces.some((place) => place.name === name)).toBe(false);
    for (const name of [
      "毗卢宝殿",
      "定照庵碑刻",
      "玲峰池遗址",
      "白莲池（月牙池）",
    ])
      expect(scenicPlaces.filter((place) => place.name === name)).toHaveLength(
        1,
      );
    const mirror = scenicPlaces.find((place) => place.name === "彩虹明镜")!;
    expect(
      scenicSearchResults([
        mirror,
        { ...mirror, id: "provider-mirror", name: "栖霞禅寺-明镜湖" },
      ]),
    ).toEqual([mirror]);
    const stone = scenicPlaces.find((place) => place.name === "定照庵碑刻")!;
    expect(
      scenicSearchResults([
        { ...stone, id: "old-stone", name: "栖霞山定照庵石刻" },
        stone,
      ]),
    ).toEqual([stone]);
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
