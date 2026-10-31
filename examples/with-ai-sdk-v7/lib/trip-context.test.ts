import { expect, it } from "vitest";
import { readTripContext } from "./trip-context";
it("仅新鲜准确的坐标可作为当前位置，保留所选路线", () => {
  const data = {
    route: "B",
    position: {
      point: { lng: 118.96, lat: 32.15 },
      accuracy: 10,
      timestamp: 100000,
    },
  };
  expect(readTripContext(data, 110000).position).toEqual(data.position);
  expect(readTripContext(data, 140000).position).toBeUndefined();
  expect(
    readTripContext(
      { ...data, position: { ...data.position, accuracy: 200 } },
      110000,
    ).locationStatus,
  ).toBe("approximate");
  expect(readTripContext(data, 140000).route).toBe("B");
  expect(
    readTripContext({ position: { point: { lng: 999, lat: 32 } } }).position,
  ).toBeUndefined();
});
