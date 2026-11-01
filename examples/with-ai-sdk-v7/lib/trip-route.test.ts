import { expect, it } from "vitest";
import { recommendationRoute, presetRoute } from "./trip-route";
import { scenicPlaces, facilityPlaces } from "./qixia-map";

it("助手游览路线按返回的起点和景点顺序显示，而不是按名称连直线", () => {
  const a = scenicPlaces[0]!,
    b = scenicPlaces[1]!;
  const origin = { lng: 118.9, lat: 32.1 };
  const result = recommendationRoute({
    status: "planned",
    segments: [
      { from: { location: origin }, place: a },
      { from: { location: a.location }, place: b },
    ],
  });
  expect(result?.legs).toEqual([
    { from: origin, to: a.location },
    { from: a.location, to: b.location },
  ]);
  expect(result?.stops.map((p) => p.id)).toEqual([a.id, b.id]);
});
it("只有查到步行路线的服务推荐会亮起，没有路线的候选和无效坐标不画线", () => {
  const destination = scenicPlaces[0]!;
  const service = {
    status: "service",
    walkingFrom: { location: { lng: 118.9, lat: 32.1 } },
    walkingTo: destination,
    walking: { distanceMeters: 100 },
  };
  expect(recommendationRoute(service)?.legs).toHaveLength(1);
  expect(recommendationRoute({ ...service, walking: null })).toBeNull();
  expect(
    recommendationRoute({ status: "candidates_only", segments: [] }),
  ).toBeNull();
  expect(
    recommendationRoute({
      ...service,
      walkingFrom: { location: { lng: 999, lat: 32 } },
    }),
  ).toBeNull();
});

it("助手路线包含最后一站到出口的返程道路", () => {
  const a = scenicPlaces[0]!,
    b = scenicPlaces[1]!;
  const origin = { lng: 118.95, lat: 32.15 };
  const exit = { id: "QXF011", location: { lng: 118.965153, lat: 32.145722 } };
  const route = recommendationRoute({
    status: "planned",
    segments: [
      { from: { location: origin }, place: a },
      { from: { location: a.location }, place: b },
    ],
    returnFrom: b,
    returnTo: exit,
    returnWalking: { distanceMeters: 100 },
  });
  expect(route?.legs).toEqual([
    { from: origin, to: a.location },
    { from: a.location, to: b.location },
    { from: b.location, to: exit.location },
  ]);
});

it.each(["A", "B", "C"])(
  "预设路线 %s 依据西门或南门起点形成连续往返游线",
  (id) => {
    for (const gateId of ["QXF010", "QXF011"]) {
      const gate = facilityPlaces.find((place) => place.id === gateId)!;
      const route = presetRoute(id, gate.location)!;
      expect(route.stops[0]?.id).toBe(gateId);
      expect(route.stops.at(-1)?.id).toBe(gateId);
      expect(route.stops[0]?.coordinateSource).toBe("amap-verified");
      expect(route.stops.length).toBeGreaterThan(4);
      expect(
        route.stops
          .slice(1, -1)
          .every((p) => p.id !== "QXF010" && p.id !== "QXF011"),
      ).toBe(true);
      expect(route.legs[0]?.from).toEqual(gate.location);
      expect(route.legs.at(-1)?.to).toEqual(gate.location);
      for (let index = 1; index < route.legs.length; index++) {
        expect(route.legs[index]?.from).toEqual(route.legs[index - 1]?.to);
      }
    }
  },
);

it("园内起点保留当前位置的首段，默认无定位展示西门往返", () => {
  const origin = { lng: 118.958, lat: 32.152 };
  const route = presetRoute("B", origin)!;
  expect(route.legs[0]?.from).toEqual(origin);
  expect(route.stops[0]?.name).toBe("当前位置");
  expect(route.stops.at(-1)?.id).toBe("QXF010");
  const adjusted = presetRoute(
    "B",
    { lng: 118.965153, lat: 32.145722 },
    "QXF010",
  )!;
  expect(adjusted.stops.at(-1)?.id).toBe("QXF010");
  expect(presetRoute("C")?.stops[0]?.id).toBe("QXF010");
  expect(presetRoute("C")?.stops.at(-1)?.id).toBe("QXF010");
});

it("未知路线不生成，缺少返程查询结果时不伪造到出口的路线", () => {
  expect(presetRoute("unknown")).toBeNull();
  const destination = scenicPlaces[0]!;
  const segment = {
    from: { location: { lng: 118.95, lat: 32.15 } },
    place: destination,
  };
  expect(
    recommendationRoute({
      status: "planned",
      segments: [segment],
      returnTo: destination,
      returnWalking: null,
    })?.legs,
  ).toHaveLength(1);
});
