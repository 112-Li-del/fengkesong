import { expect, it } from "vitest";
import sharp from "sharp";
import { lakeRoadMask } from "./lake-road-mask";

it.each([100, 20])(
  "keeps the road clear when the lake occupies %i screen pixels",
  async (size) => {
    const mask = lakeRoadMask(
      size,
      size,
      { x: 350, y: 200 },
      [
        [
          { x: 250, y: 200 },
          { x: 450, y: 200 },
        ],
      ],
      0,
      false,
    );
    const svg = decodeURIComponent(
      mask.slice('url("data:image/svg+xml,'.length, -2),
    );
    const { data, info } = await sharp(Buffer.from(svg))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const alpha = (x: number, y: number) =>
      data[(y * info.width + x) * info.channels + 3];

    for (let offset = -3; offset <= 3; offset++) {
      expect(alpha(size / 2, size / 2 + offset)).toBe(0);
    }
    expect(alpha(size / 2, size / 2 - 7)).toBe(255);
    expect(alpha(size / 2, size / 2 + 7)).toBe(255);
  },
);
