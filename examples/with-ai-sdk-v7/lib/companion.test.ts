import { describe, expect, it } from "vitest";
import {
  addSuggestion,
  approachSuggestion,
  arrivalSuggestion,
  careSuggestion,
  dismissSuggestion,
  expiredSuggestions,
  facilitySuggestion,
  nearestSuggestionTarget,
  type Suggestion,
} from "./companion";

const place = {
  id: "QXS001",
  name: "千佛岩",
  location: { lng: 118.96, lat: 32.15 },
};
const other = {
  id: "QXS002",
  name: "栖霞古寺",
  location: { lng: 118.9606, lat: 32.1503 },
};

describe("suggestion copy", () => {
  it("arrival has no distance and invites a briefing", () => {
    const item = arrivalSuggestion(place, 1000);
    expect(item.id).toBe("arrive:QXS001");
    expect(item.title).toBe("已到达千佛岩");
    expect(item.body).toContain("介绍");
    expect(item.distance).toBe(0);
  });

  it("approach and care keep the distance and differ by kind", () => {
    expect(approachSuggestion(place, 180, 1).id).toBe("approach:QXS001");
    expect(approachSuggestion(place, 180, 1).body).toContain("180");
    expect(careSuggestion(place, 640, 2).id).toBe("care:QXS001");
    expect(careSuggestion(place, 640, 2).body).toContain("640");
  });

  it("facility suggestions locate on the map instead of opening knowledge", () => {
    const toilet = { ...place, id: "QXF020", name: "卫生间" };
    const item = facilitySuggestion(toilet, "卫生间", 45, 3);
    expect(item?.id).toBe("facility:QXF020");
    expect(item?.title).toBe("附近有卫生间");
    expect(item?.action).toBe("locate");
    expect(item?.body).toContain("以现场为准");
    expect(facilitySuggestion(toilet, "门票入口", 45, 3)).toBeNull();
  });
});

describe("board list", () => {
  const first = arrivalSuggestion(place, 1000);
  const second = approachSuggestion(other, 120, 2000);

  it("puts the newest suggestion first", () => {
    const items = addSuggestion(addSuggestion([], first), second);
    expect(items.map((item) => item.id)).toEqual([second.id, first.id]);
  });

  it("ignores a duplicate that is already on the board", () => {
    const items = addSuggestion([first], { ...first, at: 9999 });
    expect(items).toHaveLength(1);
    expect(items[0]).toBe(first);
  });

  it("caps the board so it never becomes a wall of text", () => {
    let items: Suggestion[] = [];
    for (let index = 0; index < 6; index++)
      items = addSuggestion(items, { ...first, id: `arrive:x${index}` });
    expect(items).toHaveLength(4);
    expect(items[0]!.id).toBe("arrive:x5");
  });

  it("dismiss only removes the requested card", () => {
    const items = addSuggestion(addSuggestion([], first), second);
    expect(dismissSuggestion(items, first.id).map((item) => item.id)).toEqual([
      second.id,
    ]);
  });

  it("drops cards older than the cooldown window", () => {
    const items = [first];
    expect(expiredSuggestions(items, 1000 + 60_000)).toHaveLength(1);
    expect(expiredSuggestions(items, 1000 + 11 * 60_000)).toHaveLength(0);
  });
});

describe("nearestSuggestionTarget", () => {
  const point = { lng: 118.96, lat: 32.15 };

  it("skips the place you already stand on", () => {
    expect(
      nearestSuggestionTarget([place, other], point, 60, 800)?.place.id,
    ).toBe("QXS002");
  });

  it("returns null outside the distance band", () => {
    expect(nearestSuggestionTarget([place], point, 60, 800)).toBeNull();
    expect(nearestSuggestionTarget([place], point, 10, 50)).toBeNull();
  });

  it("picks the closest candidate inside the band", () => {
    const far = {
      id: "QXS003",
      name: "凤翔峰",
      location: { lng: 118.9675, lat: 32.155 },
    };
    const hit = nearestSuggestionTarget([far, other], point, 60, 800);
    expect(hit?.place.id).toBe("QXS002");
    expect(hit!.distance).toBeGreaterThan(60);
  });
});
