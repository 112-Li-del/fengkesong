import { describe, expect, it } from "vitest";
import { locationQuality } from "./location-quality";
describe("location quality", () => {
  it("accepts only fresh positions with a usable accuracy radius", () => {
    expect(locationQuality(12, 100000, 105000)).toBe("usable");
    expect(locationQuality(120, 100000, 105000)).toBe("approximate");
    expect(locationQuality(0, 100000, 105000)).toBe("approximate");
    expect(locationQuality(Number.NaN, 100000, 105000)).toBe("approximate");
  });
  it("rejects old and future-dated fixes even when accuracy appears high", () => {
    expect(locationQuality(5, 100000, 131000)).toBe("stale");
    expect(locationQuality(5, 150000, 100000)).toBe("stale");
  });
});
