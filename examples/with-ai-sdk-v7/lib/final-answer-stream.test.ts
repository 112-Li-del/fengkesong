import { expect, it } from "vitest";
import { finalAnswerStream } from "./final-answer-stream";
it("工具轮次不显示查询预告，保留工具状态和最终完整答复", async () => {
  const chunks = [
    { type: "start-step" },
    { type: "text-start", id: "a" },
    { type: "text-delta", delta: "我先查一下" },
    { type: "text-end", id: "a" },
    { type: "tool-input-available" },
    { type: "finish-step" },
    { type: "start-step" },
    { type: "text-start", id: "b" },
    { type: "text-delta", delta: "推荐先到彩虹明镜。" },
    { type: "text-end", id: "b" },
    { type: "finish-step" },
    { type: "finish" },
  ];
  const source = new ReadableStream({
    start(c) {
      for (const chunk of chunks) c.enqueue(chunk);
      c.close();
    },
  });
  const reader = source.pipeThrough(finalAnswerStream()).getReader();
  const out = [];
  while (true) {
    const r = await reader.read();
    if (r.done) break;
    out.push(r.value);
  }
  expect(out.filter((c) => c.type === "text-delta")).toEqual([
    { type: "text-delta", delta: "推荐先到彩虹明镜。" },
  ]);
  expect(out.some((c) => c.type === "tool-input-available")).toBe(true);
});
it("最终推荐使用已核验正文，保留流协议且不泄露模型改写的数字", async () => {
  const chunks = [
    { type: "start-step" },
    { type: "text-start", id: "reply" },
    { type: "text-delta", id: "reply", delta: "全程平路，" },
    { type: "text-delta", id: "reply", delta: "共22分钟。" },
    { type: "text-end", id: "reply" },
    { type: "finish-step" },
    { type: "finish" },
  ];
  const source = new ReadableStream({
    start(c) {
      chunks.forEach((x) => c.enqueue(x));
      c.close();
    },
  });
  const output = [];
  const reader = source
    .pipeThrough(finalAnswerStream(() => "合计79分钟，台阶情况待现场确认。"))
    .getReader();
  for (;;) {
    const item = await reader.read();
    if (item.done) break;
    output.push(item.value);
  }
  expect(output.filter((x) => x.type === "text-delta")).toEqual([
    {
      type: "text-delta",
      id: "reply",
      delta: "合计79分钟，台阶情况待现场确认。",
    },
  ]);
  expect(output.filter((x) => x.type !== "text-delta")).toEqual(
    chunks.filter((x) => x.type !== "text-delta"),
  );
});
