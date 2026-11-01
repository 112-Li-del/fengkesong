import { describe, expect, it } from "vitest";
import {
  createProximityState,
  resetProximityPending,
  updateProximity,
} from "./proximity";
const place = { id: "temple", location: { lng: 118, lat: 32 } };
const fix = (timestamp: number, lng = 118, accuracy = 8) => ({
  point: { lng, lat: 32 },
  accuracy,
  timestamp,
});
describe("nearby attraction trigger", () => {
  it("requires distinct fresh fixes and ten seconds of dwell before emitting one entry", () => {
    const state = createProximityState();
    expect(
      updateProximity(state, [place], fix(10000), 10000).placeId,
    ).toBeNull();
    expect(
      updateProximity(state, [place], fix(10000), 20000).placeId,
    ).toBeNull();
    expect(
      updateProximity(state, [place], fix(15000), 15000).placeId,
    ).toBeNull();
    expect(updateProximity(state, [place], fix(20000), 20000).placeId).toBe(
      "temple",
    );
    expect(
      updateProximity(state, [place], fix(30000), 30000).placeId,
    ).toBeNull();
  });
  it("does not reenter because of boundary jitter or after dismissal while still nearby", () => {
    const state = createProximityState();
    updateProximity(state, [place], fix(10000), 10000);
    updateProximity(state, [place], fix(20000), 20000);
    expect(
      updateProximity(state, [place], fix(30000, 118.0008), 30000).placeId,
    ).toBeNull();
    expect(
      updateProximity(state, [place], fix(40000), 40000).placeId,
    ).toBeNull();
    expect(
      updateProximity(state, [place], fix(700000), 700000).placeId,
    ).toBeNull();
  });
  it("requires a confirmed exit and a ten-minute cooldown before notifying on reentry", () => {
    const state = createProximityState();
    const update = (time: number, lng = 118) =>
      updateProximity(state, [place], fix(time, lng), time);
    update(0);
    expect(update(10000).placeId).toBe("temple");
    update(20000, 118.003);
    update(30000, 118.003);
    update(40000);
    expect(update(50000).placeId).toBeNull();
    update(60000, 118.003);
    update(70000, 118.003);
    update(620000);
    expect(update(630000).placeId).toBe("temple");
  });
  it("accepts coarse fixes but clears pending entry on stale or paused positioning", () => {
    const state = createProximityState();
    updateProximity(state, [place], fix(10000), 10000);
    expect(
      updateProximity(state, [place], fix(20000, 118, 100), 20000).reason,
    ).toBe("entered");
    const pending = createProximityState();
    updateProximity(pending, [place], fix(30000), 30000);
    expect(updateProximity(pending, [place], fix(30000), 70000).reason).toBe(
      "stale",
    );
    expect(
      updateProximity(pending, [place], fix(80000), 80000).placeId,
    ).toBeNull();
    resetProximityPending(pending);
    expect(
      updateProximity(pending, [place], fix(90000), 90000).placeId,
    ).toBeNull();
    expect(updateProximity(pending, [place], fix(100000), 100000).placeId).toBe(
      "temple",
    );
  });
  it("asks for selection only when attractions are at the same measured distance", () => {
    const state = createProximityState();
    const targets = [
      place,
      { id: "pavilion", location: { lng: 118.0001, lat: 32 } },
    ];
    expect(
      updateProximity(state, targets, fix(10000, 118.00005, 1000), 10000)
        .reason,
    ).toBe("ambiguous");
    expect(
      updateProximity(state, targets, fix(20000, 118.00005, 1000), 20000)
        .placeId,
    ).toBeNull();
  });
  it("uses measured distance regardless of accuracy and requires a confirmed exit", () => {
    const state = createProximityState();
    expect(
      updateProximity(state, [place], fix(10000, 118.0005, 10000), 10000)
        .reason,
    ).toBe("waiting");
    updateProximity(state, [place], fix(20000), 20000);
    updateProximity(state, [place], fix(30000), 30000);
    updateProximity(state, [place], fix(40000, 118.003), 40000);
    updateProximity(state, [place], fix(50000), 50000);
    expect(state.inside.has("temple")).toBe(true);
  });
});
