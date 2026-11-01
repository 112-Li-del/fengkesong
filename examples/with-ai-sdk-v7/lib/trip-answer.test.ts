import { expect, it } from "vitest";
import { recommendTrip, tripRequestSchema } from "./trip-recommendation";
import { formatTripAnswer } from "./trip-answer";

it("已核验慢游正文包含分段预算、设施来源与短程返程，不把天气失败写成晴天", async () => {
  const plan = await recommendTrip(
    tripRequestSchema.parse({
      startName: "栖霞古寺",
      returnName: "西门",
      minutes: 45,
      stamina: "low",
    }),
    {},
    async () => ({
      distanceMeters: 100,
      minutes: 2,
      instructions: ["沿道路步行"],
    }),
  );
  const reply = formatTripAnswer(plan, {
    status: "unavailable",
    message: "服务不可用",
  });
  expect(reply).toContain("总计约33分钟");
  expect(reply).toContain("去程行走3 + 停留12 + 返程3 + 机动15");
  expect(reply).toContain("直线约");
  expect(reply).toContain("导览图估算");
  expect(reply).toContain("回西门售票处，高德步行约100米、2分钟");
  expect(reply).toContain("游览日天气暂未取得");
  expect(reply).not.toContain("平路");
  expect(reply).not.toContain("晴天");
});
it("缺少定位不生成路线正文，保留模型澄清流程", async () => {
  const plan = await recommendTrip(tripRequestSchema.parse({}), {});
  expect(formatTripAnswer(plan)).toBeUndefined();
});
