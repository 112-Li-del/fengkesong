export type ScreenRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
export type LabelPoint = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  priority: number;
  previous?: { dx: number; dy: number };
  art?: { width: number; height: number };
};
export type LabelPlacement = LabelPoint & {
  left: number;
  top: number;
  visible: boolean;
};

function overlaps(a: ScreenRect, b: ScreenRect, gap = 3) {
  return (
    a.left < b.right + gap &&
    a.right > b.left - gap &&
    a.top < b.bottom + gap &&
    a.bottom > b.top - gap
  );
}
export function layoutScenicMarkers(
  points: LabelPoint[],
  viewport: ScreenRect,
  obstacles: ScreenRect[] = [],
): LabelPlacement[] {
  const occupied = [
    ...obstacles,
    ...points.map((p) => ({
      left: p.x - 6,
      right: p.x + 6,
      top: p.y - 6,
      bottom: p.y + 6,
    })),
    ...points
      .filter((p) => p.art)
      .map((p) => ({
        left: p.x - p.art!.width / 2,
        right: p.x + p.art!.width / 2,
        top: p.y - p.art!.height - 5,
        bottom: p.y - 5,
      })),
  ];
  const output: LabelPlacement[] = [];
  for (const p of [...points].sort(
    (a, b) => a.priority - b.priority || a.id.localeCompare(b.id),
  )) {
    const candidates: { left: number; top: number }[] = [];
    if (p.previous)
      candidates.push({ left: p.x + p.previous.dx, top: p.y + p.previous.dy });
    for (const radius of [14, 32, 56, 86, 126, 178, 244]) {
      candidates.push(
        { left: p.x - p.width / 2, top: p.y + radius },
        { left: p.x + radius, top: p.y - p.height / 2 },
        { left: p.x - p.width - radius, top: p.y - p.height / 2 },
        { left: p.x - p.width / 2, top: p.y - p.height - radius },
        { left: p.x + radius, top: p.y - p.height - radius },
        { left: p.x - p.width - radius, top: p.y - p.height - radius },
        { left: p.x + radius, top: p.y + radius },
        { left: p.x - p.width - radius, top: p.y + radius },
      );
    }
    const grid: { left: number; top: number }[] = [];
    for (
      let top = viewport.top;
      top + p.height <= viewport.bottom;
      top += p.height + 6
    )
      for (
        let left = viewport.left;
        left + p.width <= viewport.right;
        left += p.width + 8
      )
        grid.push({ left, top });
    grid.sort(
      (a, b) =>
        (a.left + p.width / 2 - p.x) ** 2 +
        (a.top + p.height / 2 - p.y) ** 2 -
        ((b.left + p.width / 2 - p.x) ** 2 + (b.top + p.height / 2 - p.y) ** 2),
    );
    candidates.push(...grid);
    const location = candidates
      .map((c) => ({
        left: Math.max(
          viewport.left,
          Math.min(viewport.right - p.width, c.left),
        ),
        top: Math.max(
          viewport.top,
          Math.min(viewport.bottom - p.height, c.top),
        ),
      }))
      .find((c) => {
        const rect = {
          ...c,
          right: c.left + p.width,
          bottom: c.top + p.height,
        };
        return (
          rect.left >= viewport.left &&
          rect.top >= viewport.top &&
          rect.right <= viewport.right &&
          rect.bottom <= viewport.bottom &&
          !occupied.some((other) => overlaps(rect, other))
        );
      });
    if (location)
      occupied.push({
        ...location,
        right: location.left + p.width,
        bottom: location.top + p.height,
      });
    output.push({
      ...p,
      left: location?.left ?? p.x,
      top: location?.top ?? p.y,
      visible: !!location,
    });
  }
  return output;
}
