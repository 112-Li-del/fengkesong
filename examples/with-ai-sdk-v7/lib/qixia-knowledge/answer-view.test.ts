import { describe, expect, it } from "vitest";
import {
  buildAnswerView,
  findAnswerView,
  listAnswerViews,
} from "./answer-view";
import { getQixiaKnowledgeByName } from "./catalog";

describe("buildAnswerView", () => {
  it("把舍利塔高度的两种说法收敛成一个定稿值", () => {
    const view = buildAnswerView(getQixiaKnowledgeByName("舍利塔")!);
    const heights = view.facts.filter((fact) => fact.label === "高度");
    expect(heights).toHaveLength(1);
    expect(heights[0]?.value).toBe("约 15 米");
    expect(view.facts.map((fact) => fact.value).join(" ")).not.toContain(
      "18.74",
    );
  });

  it("哼哈殿只给现殿年代，复建旧说归入未定稿且不带年份", () => {
    const view = buildAnswerView(getQixiaKnowledgeByName("哼哈殿")!);
    const text = [
      view.overview,
      ...view.facts.map((fact) => fact.value),
      ...view.timeline.map((item) => item.what),
    ].join(" ");
    expect(text).not.toContain("1919");
    expect(view.timeline).toEqual([{ date: "2001 年", what: "现殿建成" }]);
    expect(view.openIssues).toHaveLength(1);
    expect(view.openIssues[0]?.note).not.toContain("1919");
  });

  it("回答口径不带网址、可信度字母和开放时间", () => {
    for (const view of listAnswerViews()) {
      const text = [
        view.overview,
        ...view.facts.flatMap((fact) => [fact.label, fact.value]),
        ...view.timeline.map((item) => item.what),
      ].join(" ");
      expect(text, view.name).not.toMatch(/https?:\/\//);
      expect(text, view.name).not.toMatch(/credibility/i);
      expect(text, view.name).not.toMatch(/\d{1,2}:\d{2}/);
    }
  });

  it("没有资料的景点标成 none，留给高德补地点信息", () => {
    const view = buildAnswerView(getQixiaKnowledgeByName("太虚亭")!);
    expect(view.coverage).toBe("none");
    expect(view.facts).toHaveLength(0);
  });

  it("按别名也能找到定稿视图", () => {
    expect(findAnswerView("金刚殿")?.name).toBe("哼哈殿");
    expect(findAnswerView("舍利塔")?.code).toBe("B6");
    expect(findAnswerView("不存在的地方")).toBeNull();
  });

  it("知识库卡片名与自然提问也能对上", () => {
    expect(findAnswerView("栖霞寺")?.code).toBe("B5");
    expect(findAnswerView("千佛岩有多少尊佛像")?.code).toBe("B7");
    expect(findAnswerView("栖霞山有哪些景点")).toBeNull();
  });

  it("没定稿的字段只给一句话结论，不列候选值", () => {
    const view = buildAnswerView(getQixiaKnowledgeByName("明征君碑")!);
    expect(view.openIssues.map((issue) => issue.field)).toContain("高度");
    expect(view.facts.map((fact) => fact.label)).not.toContain("高度");
  });
});
