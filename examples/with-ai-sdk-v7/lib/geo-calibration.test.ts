import { describe, it, expect } from "vitest";
import { correctGuidePoint } from "./geo-calibration";
const center = { lng: 118.96, lat: 32.15 };
describe("guide point local calibration", () => {
  it("fixes control points exactly and leaves distant points unchanged", () => {
    const anchors = [{ from: center, to: { lng: 118.9601, lat: 32.15 } }];
    expect(correctGuidePoint(center, anchors)).toEqual(anchors[0]!.to);
    const far = { lng: 118.97, lat: 32.16 };
    expect(correctGuidePoint(far, anchors)).toEqual(far);
  });
  it("rejects large ambiguous shifts rather than dragging a whole area", () => {
    expect(
      correctGuidePoint(center, [
        { from: center, to: { lng: 118.962, lat: 32.15 } },
      ]),
    ).toEqual(center);
  });
  it("keeps nearby estimated points in order and retains their spacing", () => {
    const anchors = [{ from: center, to: { lng: 118.96005, lat: 32.15 } }];
    const a = { lng: 118.96001, lat: 32.15001 },
      b = { lng: 118.96002, lat: 32.15001 };
    const ca = correctGuidePoint(a, anchors),
      cb = correctGuidePoint(b, anchors);
    expect(cb.lng).toBeGreaterThan(ca.lng);
    expect(Math.abs(cb.lng - ca.lng - (b.lng - a.lng)) * 94300).toBeLessThan(
      0.1,
    );
  });
});
