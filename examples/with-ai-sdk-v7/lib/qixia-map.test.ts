import { describe, expect, it } from "vitest";
import {
  scenicPlaces,
  scenicSearchResults,
  withinScenicView,
} from "./qixia-map";

describe("Qixia scenic map search", () => {
  it("keeps the confirmed canonical names and collapses provider aliases", () => {
    for (const name of [
      "毘灵宝殿",
      "栖霞山大桥",
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
  it("links expanded knowledge cards without substituting a nearby landmark", () => {
    expect(scenicPlaces.find((p) => p.name === "受降井")?.referenceCode).toBe(
      "D1",
    );
    expect(
      scenicPlaces.find((p) => p.name === "定照庵碑刻")?.referenceCode,
    ).toBe("E20");
    expect(
      scenicPlaces.find((p) => p.name === "玲峰池遗址")?.referenceCode,
    ).toBe("E19");
    expect(
      scenicPlaces.find((p) => p.name === "白莲池（月牙池）")?.referenceCode,
    ).toBeUndefined();
    expect(
      scenicPlaces.find((p) => p.name === "紫峰阁")?.referenceCode,
    ).toBeUndefined();
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
