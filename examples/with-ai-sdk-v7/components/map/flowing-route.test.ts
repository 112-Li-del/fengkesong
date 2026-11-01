import { afterEach, expect, it, vi } from "vitest";
import { traceWalkingRoute } from "./flowing-route";
import type { LngLat, MapAPI } from "./amap-types";

afterEach(() => vi.useRealTimers());
function sdk() {
  const requests: {
    from: unknown;
    to: unknown;
    reply: (status: string, result: unknown) => void;
    clear: ReturnType<typeof vi.fn>;
  }[] = [];
  const api = {
    Walking: class {
      clear = vi.fn();
      search(
        from: unknown,
        to: unknown,
        reply: (status: string, result: unknown) => void,
      ) {
        requests.push({ from, to, reply, clear: this.clear });
      }
    },
  } as unknown as MapAPI;
  return { api, requests };
}
const result = (path: LngLat[]) => ({ routes: [{ steps: [{ path }] }] });

it("沿高德实际拐弯的步行路径逐段绘制，失败路段不补直线", async () => {
  vi.useFakeTimers();
  const { api, requests } = sdk(),
    updates = vi.fn();
  const a = { lng: 118.96101, lat: 32.151 },
    b = { lng: 118.962, lat: 32.152 },
    c = { lng: 118.963, lat: 32.153 };
  const cancel = traceWalkingRoute(
    api,
    [
      { from: a, to: b },
      { from: b, to: c },
    ],
    updates,
  );
  expect(requests[0]!.from).toEqual([a.lng, a.lat]);
  expect(requests[0]!.to).toEqual([b.lng, b.lat]);
  const path = [a, { lng: 118.9615, lat: 32.1518 }, b];
  requests[0]!.reply("complete", result(path));
  expect(updates).toHaveBeenLastCalledWith([path], { completed: 1, total: 2 });
  await vi.advanceTimersByTimeAsync(250);
  requests[1]!.reply("error", {});
  expect(updates).toHaveBeenLastCalledWith([path], {
    completed: 2,
    total: 2,
    failed: true,
  });
  cancel();
});
it("切换或关闭后忽略旧路线的晚到结果，不再发出后续请求", async () => {
  vi.useFakeTimers();
  const { api, requests } = sdk(),
    old = vi.fn(),
    current = vi.fn();
  const a = { lng: 118.96401, lat: 32.151 },
    b = { lng: 118.965, lat: 32.152 },
    c = { lng: 118.966, lat: 32.153 };
  const stop = traceWalkingRoute(
    api,
    [
      { from: a, to: b },
      { from: b, to: c },
    ],
    old,
  );
  stop();
  const cancel = traceWalkingRoute(api, [{ from: b, to: c }], current);
  requests[1]!.reply("complete", result([b, c]));
  requests[0]!.reply("complete", result([a, b]));
  await vi.runAllTimersAsync();
  expect(old).not.toHaveBeenCalled();
  expect(current).toHaveBeenLastCalledWith([[b, c]], {
    completed: 1,
    total: 1,
  });
  expect(requests).toHaveLength(2);
  expect(requests[0]!.clear).toHaveBeenCalled();
  cancel();
});
it("起点超时后停止，迟到回调不会亮起脱节路线", async () => {
  vi.useFakeTimers();
  const { api, requests } = sdk(),
    updates = vi.fn();
  const a = { lng: 118.96701, lat: 32.151 },
    b = { lng: 118.968, lat: 32.152 },
    c = { lng: 118.969, lat: 32.153 };
  const cancel = traceWalkingRoute(
    api,
    [
      { from: a, to: b },
      { from: b, to: c },
    ],
    updates,
  );
  await vi.advanceTimersByTimeAsync(12250);
  requests[0]!.reply("complete", result([a, b]));
  expect(requests).toHaveLength(1);
  expect(updates).toHaveBeenLastCalledWith([], {
    completed: 1,
    total: 2,
    failed: true,
  });
  expect(updates).toHaveBeenCalledTimes(1);
  cancel();
});
it("成功道路被复用，失败结果不缓存", async () => {
  vi.useFakeTimers();
  const { api, requests } = sdk(),
    updates = vi.fn();
  const a = { lng: 118.97001, lat: 32.151 },
    b = { lng: 118.971, lat: 32.152 };
  const legs = [{ from: a, to: b }];
  const failed = traceWalkingRoute(api, legs, vi.fn());
  requests[0]!.reply("error", {});
  failed();
  const retry = traceWalkingRoute(api, legs, vi.fn());
  requests[1]!.reply("complete", result([a, b]));
  retry();
  const cancel = traceWalkingRoute(api, legs, updates);
  expect(requests).toHaveLength(2);
  expect(updates).toHaveBeenLastCalledWith([[a, b]], {
    completed: 1,
    total: 1,
  });
  cancel();
});

it("没有有效路段时结束加载且不请求道路", () => {
  const { api, requests } = sdk();
  const updates = vi.fn();
  const cancel = traceWalkingRoute(api, [], updates);
  expect(updates).toHaveBeenCalledWith([], { completed: 0, total: 0 });
  expect(requests).toHaveLength(0);
  cancel();
});

it("起点路段失败后停止，不亮起无法从起点接入的中途路线", async () => {
  vi.useFakeTimers();
  const { api, requests } = sdk(),
    updates = vi.fn();
  const a = { lng: 118.9801, lat: 32.151 },
    b = { lng: 118.9802, lat: 32.152 },
    c = { lng: 118.9803, lat: 32.153 };
  const cancel = traceWalkingRoute(
    api,
    [
      { from: a, to: b },
      { from: b, to: c },
    ],
    updates,
  );
  requests[0]!.reply("error", {});
  await vi.runAllTimersAsync();
  expect(requests).toHaveLength(1);
  expect(updates.mock.lastCall?.[0]).toEqual([]);
  cancel();
});
