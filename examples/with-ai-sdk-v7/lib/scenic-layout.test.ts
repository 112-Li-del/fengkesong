import { describe, expect, it } from "vitest";
import {
  layoutScenicMarkers,
  type LabelPoint,
  type ScreenRect,
} from "./scenic-layout";
const viewport = { left: 8, top: 8, right: 382, bottom: 700 };
function point(id: string, x = 180, y = 350, priority = 1): LabelPoint {
  return { id, x, y, priority, width: 65, height: 26 };
}
function intersects(a: ScreenRect, b: ScreenRect) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}
describe("independent scenic labels", () => {
  it("retains all 24 close landmarks instead of merging any of them", () => {
    const points = Array.from({ length: 24 }, (_, i) =>
      point(String(i), 170 + i, 350),
    );
    const labels = layoutScenicMarkers(points, viewport);
    expect(labels).toHaveLength(24);
    expect(labels.filter((p) => p.visible)).toHaveLength(24);
    expect(new Set(labels.map((p) => p.id)).size).toBe(24);
    for (const p of points)
      expect(labels.find((l) => l.id === p.id)).toMatchObject({
        x: p.x,
        y: p.y,
      });
  });
  it("keeps names apart and away from controls and true coordinate dots", () => {
    const obstacle = { left: 8, top: 8, right: 220, bottom: 180 };
    const points = [
      point("temple", 110, 200),
      point("tower", 114, 202),
      point("cliff", 120, 206),
    ];
    const labels = layoutScenicMarkers(points, viewport, [obstacle]).filter(
      (l) => l.visible,
    );
    expect(labels).toHaveLength(3);
    const boxes = labels.map((l) => ({
      left: l.left,
      top: l.top,
      right: l.left + l.width,
      bottom: l.top + l.height,
    }));
    for (const [i, box] of boxes.entries()) {
      expect(intersects(box, obstacle)).toBe(false);
      for (const other of boxes.slice(i + 1))
        expect(intersects(box, other)).toBe(false);
      for (const p of points)
        expect(
          intersects(box, {
            left: p.x - 6,
            top: p.y - 6,
            right: p.x + 6,
            bottom: p.y + 6,
          }),
        ).toBe(false);
    }
  });
  it("preserves a valid label offset while the map moves", () => {
    const labels = layoutScenicMarkers(
      [{ ...point("lake"), previous: { dx: 20, dy: -30 } }],
      viewport,
    );
    expect(labels[0]).toMatchObject({ left: 200, top: 320, visible: true });
  });
  it("leaves the watercolor illustration unobscured", () => {
    const labels = layoutScenicMarkers(
      [{ ...point("pagoda"), art: { width: 48, height: 48 } }],
      viewport,
    );
    const label = labels[0]!;
    expect(label.visible).toBe(true);
    expect(
      intersects(
        {
          left: label.left,
          top: label.top,
          right: label.left + label.width,
          bottom: label.top + label.height,
        },
        { left: 156, right: 204, top: 297, bottom: 345 },
      ),
    ).toBe(false);
  });
  it("prioritizes the selected name when controls leave little room", () => {
    const labels = layoutScenicMarkers(
      [point("ordinary", 70, 30, 2), point("selected", 70, 30, -1)],
      { left: 0, top: 0, right: 80, bottom: 80 },
    );
    expect(labels.find((p) => p.id === "selected")?.visible).toBe(true);
    expect(labels).toHaveLength(2);
  });
});
