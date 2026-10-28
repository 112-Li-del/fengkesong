import { describe, expect, it } from "vitest";
import { scenicSearchResults, withinScenicView } from "./qixia-map";

describe("Qixia scenic map search", () => {
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
