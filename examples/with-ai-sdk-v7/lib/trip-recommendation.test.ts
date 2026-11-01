import { afterEach, expect, it, vi } from "vitest";
import {
  fetchWalkingLeg,
  recommendTrip,
  tripRequestSchema,
} from "./trip-recommendation";
const context = () => ({
  position: {
    point: { lng: 118.957983, lat: 32.151807 },
    accuracy: 10,
    timestamp: Date.now(),
  },
  route: "B",
});
const walk = async () => ({
  distanceMeters: 100,
  minutes: 2,
  instructions: ["沿道路步行"],
});
it("定位缺失或过时不假装知道起点", async () => {
  expect(
    (await recommendTrip(tripRequestSchema.parse({}), {}, walk)).status,
  ).toBe("needs_location");
  const stale = context();
  stale.position.timestamp -= 60000;
  expect(
    (await recommendTrip(tripRequestSchema.parse({}), stale, walk)).status,
  ).toBe("needs_location");
});
it("亲子推车按短段与休息安排并保留返程预算", async () => {
  const result = await recommendTrip(
    tripRequestSchema.parse({
      minutes: 90,
      childAge: 3,
      stroller: true,
      stamina: "low",
      interests: ["culture"],
    }),
    context(),
    walk,
  );
  expect(result.status).toBe("planned");
  expect(result.segments!.length).toBeLessThanOrEqual(3);
  expect(result.plannedVisitMinutes).toBeLessThanOrEqual(90 - 17);
  expect(result.returnWalking).toEqual(await walk());
  expect(result.segments!.every((s) => s.suggestedStayMinutes === 20)).toBe(
    true,
  );
});
it("识别到台阶时不推荐给推车家庭，查询失败不编步行时间", async () => {
  const stairs = async () => ({
    distanceMeters: 100,
    minutes: 2,
    instructions: ["沿台阶向上"],
  });
  const a = await recommendTrip(
    tripRequestSchema.parse({ stroller: true }),
    context(),
    stairs,
  );
  expect(a.status).toBe("candidates_only");
  expect(a.segments).toEqual([]);
  const b = await recommendTrip(
    tripRequestSchema.parse({}),
    context(),
    async () => null,
  );
  expect(b.status).toBe("candidates_only");
  expect(b.returnWalking).toBeNull();
});
it("实用需求只推荐对应设施，估算厕所不冒充精确导航", async () => {
  const r = await recommendTrip(
    tripRequestSchema.parse({ need: "toilet" }),
    context(),
    walk,
  );
  expect(r.status).toBe("service");
  expect(r.choices!.every((p) => p.name === "卫生间")).toBe(true);
  expect(r.walking).toBeNull();
  const food = await recommendTrip(
    tripRequestSchema.parse({ need: "food" }),
    context(),
    walk,
  );
  expect(food.choices!.some((p) => p.name.includes("素菜馆"))).toBe(true);
});

it("返程不可用或含台阶时不发布推车路线，不能以起点返程冒充终点返程", async () => {
  const failBack: typeof fetchWalkingLeg = async (_from, to) =>
    Math.abs(to.lng - 118.954566) < 0.00001 &&
    Math.abs(to.lat - 32.150215) < 0.00001
      ? null
      : walk();
  const result = await recommendTrip(
    tripRequestSchema.parse({ stroller: true, returnName: "西门" }),
    context(),
    failBack,
  );
  expect(result.status).toBe("candidates_only");
  expect(result.segments).toEqual([]);
});
it("完整预算包含返程慢行与机动，分段同时提供休息和厕所", async () => {
  const result = await recommendTrip(
    tripRequestSchema.parse({ minutes: 45, stamina: "low" }),
    context(),
    walk,
  );
  expect(result.totalPlannedMinutes).toBeLessThanOrEqual(45);
  expect(result.plannedStayMinutes).toBe(12);
  expect(result.plannedOutboundWalkMinutes).toBe(3);
  expect(result.answerDraft).toContain("去程行走3 + 停留12 + 返程3 + 机动15");
  expect(result.totalPlannedMinutes).toBe(
    result.plannedVisitMinutes! + result.plannedReturnMinutes! + 15,
  );
  expect(result.segments![0]!.nearby.some((p) => p.name === "卫生间")).toBe(
    true,
  );
  expect(result.segments![0]!.nearby.some((p) => p.name !== "卫生间")).toBe(
    true,
  );
});
it("补给请求返回补给设施，不用餐馆替代", async () => {
  const result = await recommendTrip(
    tripRequestSchema.parse({ need: "supply" }),
    context(),
    walk,
  );
  expect(result.choices!.every((p) => p.name.includes("补给"))).toBe(true);
});

it("亲子关键信息缺失时不默认无推车", async () => {
  expect(
    (
      await recommendTrip(
        tripRequestSchema.parse({ interests: ["family"] }),
        context(),
        walk,
      )
    ).status,
  ).toBe("needs_profile");
  expect(
    (
      await recommendTrip(
        tripRequestSchema.parse({ childAge: 3 }),
        context(),
        walk,
      )
    ).status,
  ).toBe("needs_profile");
});
it("新位置重新排序附近设施，已到访景点不重复推荐", async () => {
  const west = context();
  west.position.point = { lng: 118.954436, lat: 32.150464 };
  const r = await recommendTrip(
    tripRequestSchema.parse({ need: "rest" }),
    west,
    walk,
  );
  expect(r.choices![0]!.name).toBe("邮局咖啡(栖霞山店)");
  const plan = await recommendTrip(
    tripRequestSchema.parse({ visited: ["彩虹明镜", "明征君碑", "钟楼"] }),
    context(),
    walk,
  );
  expect(
    plan.segments!.some((s) =>
      ["彩虹明镜", "明征君碑", "钟楼"].includes(s.place.name),
    ),
  ).toBe(false);
});

it("一个候选路段失败后仍能规划后续可达景点", async () => {
  const failed = new Set<string>();
  const result = await recommendTrip(
    tripRequestSchema.parse({ minutes: 120 }),
    context(),
    async (_from, to) => {
      if (!failed.size) {
        failed.add(JSON.stringify(to));
        return null;
      }
      return walk();
    },
  );
  expect(result.status).toBe("planned");
  expect(result.segments!.length).toBeGreaterThan(1);
  expect(
    result.segments!.every(
      (s) => !failed.has(JSON.stringify(s.place.location)),
    ),
  ).toBe(true);
});

it("GPS优先于旧起点描述，返程及附近距离保留实际起终点", async () => {
  const result = await recommendTrip(
    tripRequestSchema.parse({ startName: "西门", minutes: 90 }),
    context(),
    walk,
  );
  expect(result.segments![0]!.from.name).toBe("当前位置");
  expect(result.segments![0]!.from.location).toEqual(context().position.point);
  expect(result.returnFrom!.name).toBe(result.segments!.at(-1)!.place.name);
  expect(
    result.segments!.every((s) =>
      s.nearby.every((p) => p.distanceFrom === s.place.name),
    ),
  ).toBe(true);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it("高德QPS限流后重试，并复用成功的步行结果", async () => {
  vi.useFakeTimers();
  vi.stubEnv("AMAP_WEB_SERVICE_KEY", "test-key");
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({ status: "0", info: "CUQPS_HAS_EXCEEDED_THE_LIMIT" }),
    )
    .mockResolvedValueOnce(
      Response.json({
        status: "1",
        route: {
          paths: [
            {
              distance: "284",
              duration: "227",
              steps: [{ instruction: "沿道路步行" }],
            },
          ],
        },
      }),
    );
  vi.stubGlobal("fetch", fetcher);
  const from = { lng: 118.954566, lat: 32.150215 },
    to = { lng: 118.9561, lat: 32.1511 };
  const pending = fetchWalkingLeg(from, to);
  await vi.runAllTimersAsync();
  expect(await pending).toEqual({
    distanceMeters: 284,
    minutes: 4,
    instructions: ["沿道路步行"],
  });
  expect(await fetchWalkingLeg(from, to)).toEqual(await pending);
  expect(fetcher).toHaveBeenCalledTimes(2);
});

it("未成功的查询不缓存，HTTP限流即使没有JSON也会重试", async () => {
  vi.useFakeTimers();
  vi.stubEnv("AMAP_WEB_SERVICE_KEY", "test-key");
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({ status: "0", info: "UNKNOWN_ERROR" }),
    )
    .mockResolvedValueOnce(new Response("Too many requests", { status: 429 }))
    .mockResolvedValueOnce(
      Response.json({
        status: "1",
        route: { paths: [{ distance: "100", duration: "120", steps: [] }] },
      }),
    );
  vi.stubGlobal("fetch", fetcher);
  const from = { lng: 118.958, lat: 32.152 },
    to = { lng: 118.959, lat: 32.153 };
  const first = fetchWalkingLeg(from, to);
  await vi.runAllTimersAsync();
  expect(await first).toBeNull();
  const retry = fetchWalkingLeg(from, to);
  await vi.runAllTimersAsync();
  expect(await retry).toEqual({
    distanceMeters: 100,
    minutes: 2,
    instructions: [],
  });
  expect(fetcher).toHaveBeenCalledTimes(3);
});

it("景区外的粗略定位也能查询步行服务，起点保持真实坐标", async () => {
  const outside = context();
  outside.position = {
    ...outside.position,
    point: { lng: 118.9, lat: 32.1 },
    accuracy: 1000,
  };
  const service = vi.fn<typeof fetchWalkingLeg>(walk);
  const result = await recommendTrip(
    tripRequestSchema.parse({ need: "food" }),
    outside,
    service,
  );
  expect(result.status).toBe("service");
  expect(service.mock.calls[0]?.[0]).toEqual(outside.position.point);
});

it("指定西门入园后，即使当前位置更靠南门也回到西门", async () => {
  const south = context();
  south.position.point = { lng: 118.965153, lat: 32.145722 };
  const result = await recommendTrip(
    tripRequestSchema.parse({ startName: "西门" }),
    south,
    walk,
  );
  expect(result.segments![0]!.from.location).toEqual(south.position.point);
  expect(result.returnTo?.id).toBe("QXF010");
});

it("调整游线时沿用本次入园门，明确指定返程地点时允许改门", async () => {
  const south = context();
  south.position.point = { lng: 118.965153, lat: 32.145722 };
  const trip = { ...south, entryGate: "QXF010" };
  const result = await recommendTrip(tripRequestSchema.parse({}), trip, walk);
  expect(result.returnTo?.id).toBe("QXF010");
  const changed = await recommendTrip(
    tripRequestSchema.parse({ returnName: "南门" }),
    trip,
    walk,
  );
  expect(changed.returnTo?.id).toBe("QXF011");
});

it.each([
  [{ lng: 118.954566, lat: 32.150215 }, "QXF010"],
  [{ lng: 118.965153, lat: 32.145722 }, "QXF011"],
] as const)("首次推荐按起始位置 %o 选取同门返程", async (point, gate) => {
  const trip = context();
  trip.position.point = point;
  const result = await recommendTrip(tripRequestSchema.parse({}), trip, walk);
  expect(result.returnTo?.id).toBe(gate);
});

it("回入园的门沿用明确说过的西门，不重复确认返程点", async () => {
  const south = context();
  south.position.point = { lng: 118.965153, lat: 32.145722 };
  const result = await recommendTrip(
    tripRequestSchema.parse({ startName: "西门", returnName: "入园的门" }),
    south,
    walk,
  );
  expect(result.status).toBe("planned");
  expect(result.returnTo?.id).toBe("QXF010");
  expect(result.segments![0]!.from.location).toEqual(south.position.point);
});

it("回原入口沿用已记住的南门，不按园内的新位置换门", async () => {
  const result = await recommendTrip(
    tripRequestSchema.parse({ returnName: "原入口" }),
    { ...context(), entryGate: "QXF011" },
    walk,
  );
  expect(result.status).toBe("planned");
  expect(result.returnTo?.id).toBe("QXF011");
});

it("指定未知的具体返程地点仍需确认，不擅自换成入园门", async () => {
  const result = await recommendTrip(
    tripRequestSchema.parse({ returnName: "北门" }),
    { ...context(), entryGate: "QXF010" },
    walk,
  );
  expect(result.status).toBe("needs_return_point");
});
