import { afterEach, expect, it, vi } from "vitest";
import {
  readTripContext,
  setTripContext,
  registerTripLocator,
  tripContextForMessage,
} from "./trip-context";
it("新鲜定位不受精度限制，过时或无效坐标不能冒充当前位置", () => {
  const data = {
    route: "B",
    entryGate: "QXF010",
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
  expect(readTripContext(data, 140000).entryGate).toBe("QXF010");
  expect(
    readTripContext({ position: { point: { lng: 999, lat: 32 } } }).position,
  ).toBeUndefined();
});

it("粗略定位仍传递给推荐服务", () => {
  const position = {
    point: { lng: 118.8, lat: 32.1 },
    accuracy: 10000,
    timestamp: 100000,
  };
  expect(readTripContext({ position }, 110000).position).toEqual(position);
});

let unregister: (() => void) | undefined;
afterEach(() => {
  unregister?.();
  unregister = undefined;
  setTripContext({});
});

const previous = {
  point: { lng: 118.95, lat: 32.15 },
  accuracy: 10,
  timestamp: 100000,
};
const fresh = {
  point: { lng: 118.96, lat: 32.16 },
  accuracy: 20,
  timestamp: 200000,
};
it("路线消息等待定位完成，使用本次坐标并保留目标路线", async () => {
  setTripContext({ route: "B", entryGate: "QXF010", position: previous });
  let resolve!: (fix: typeof fresh) => void;
  unregister = registerTripLocator(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const complete = vi.fn();
  const request = tripContextForMessage("带孩子推荐一条路线").then(complete);
  await Promise.resolve();
  expect(complete).not.toHaveBeenCalled();
  resolve(fresh);
  await request;
  expect(complete).toHaveBeenCalledWith({
    route: "B",
    entryGate: "QXF010",
    position: fresh,
  });
});

it.each(["failed", "rejected", "missing"])(
  "定位 %s 时不把旧坐标冒充本次位置",
  async (mode) => {
    setTripContext({ route: "A", position: previous });
    if (mode !== "missing")
      unregister = registerTripLocator(() =>
        mode === "rejected"
          ? Promise.reject(new Error("permission denied"))
          : Promise.resolve(null),
      );
    expect(await tripContextForMessage("规划两小时游览路线")).toEqual({
      route: "A",
    });
  },
);

it("普通知识问答不主动要求定位", async () => {
  const locate = vi.fn(async () => fresh);
  unregister = registerTripLocator(locate);
  setTripContext({ route: "C" });
  expect(await tripContextForMessage("舍利塔高多少米？")).toEqual({
    route: "C",
  });
  expect(locate).not.toHaveBeenCalled();
});

it.each(["帮我设计一条游览线路", "行程轻松一点", "带我去千佛岩"])(
  "识别位置相关的自然表达：%s",
  async (text) => {
    unregister = registerTripLocator(async () => fresh);
    expect(await tripContextForMessage(text)).toEqual({ position: fresh });
  },
);
