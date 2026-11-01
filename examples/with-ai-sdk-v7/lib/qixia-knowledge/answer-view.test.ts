import { describe, expect, it } from "vitest";
import places from "../qixia-places.json";
import extraPlaces from "../qixia-places-extra.json";
import {
  buildAnswerView,
  displayAliases,
  listAnswerViews,
  lookupQixiaKnowledge,
} from "./answer-view";
import { getQixiaKnowledgeByCode } from "./catalog";
import { editorial } from "./editorial";
import type { QixiaPlaceKnowledge } from "./types";

const source = "https://example.invalid/source";

function fixture(overrides: Partial<QixiaPlaceKnowledge>): QixiaPlaceKnowledge {
  return {
    referenceCode: "Z9",
    referenceName: "测试点",
    name: "测试点",
    kbCardId: null,
    summary: null,
    history: null,
    keyFacts: [],
    timeline: [],
    ...overrides,
  };
}

function lookedUpCode(query: string) {
  const found = lookupQixiaKnowledge(query);
  return found.kind === "place" ? found.view.code : found.kind;
}

describe("buildAnswerView", () => {
  it("素材里互相矛盾的字段和大事记不会被自动挑进回答", () => {
    const view = buildAnswerView(
      fixture({
        history: "据传建于秦代。尚无确证。",
        keyFacts: [
          {
            key: "高度",
            values: [
              { value: "15", unit: "米", source, credibility: "B" },
              { value: "115", unit: "米", source, credibility: "B" },
            ],
          },
          {
            key: "始建年代",
            values: [
              { value: "489年", source, credibility: "C" },
              { value: "498年", source, credibility: "A" },
            ],
          },
        ],
        timeline: [{ date: "489年", what: "始建", source }],
      }),
    );
    expect(view).toMatchObject({
      overview: "",
      facts: [],
      timeline: [],
      coverage: "none",
    });
  });

  it("带推测或勘误口吻的简介不当作介绍，干净的简介照用", () => {
    expect(
      buildAnswerView(
        fixture({
          summary: "一处现代主题景点（名含「侏罗纪」，或与恐龙主题相关）",
        }),
      ).overview,
    ).toBe("");
    expect(
      buildAnswerView(fixture({ summary: "栖霞山内一处观景亭" })),
    ).toMatchObject({ overview: "栖霞山内一处观景亭。", coverage: "summary" });
  });

  it("用户确认的高度、年代和石窟统计范围进入发布口径", () => {
    const tower = JSON.stringify(
      buildAnswerView(getQixiaKnowledgeByCode("B6")!),
    );
    expect(tower).toContain("18.04");
    expect(tower).toContain("五丈余");
    expect(tower).not.toContain("18.74");
    const gate = JSON.stringify(
      buildAnswerView(getQixiaKnowledgeByCode("A2")!),
    );
    expect(gate).toContain("2001 年 9 月 15 日");
    expect(gate).not.toContain("1919");
    const caves = JSON.stringify(
      buildAnswerView(getQixiaKnowledgeByCode("B7")!),
    );
    expect(caves).toContain("252");
    expect(caves).toContain("551");
    expect(caves).toContain("全域");
    expect(caves).not.toContain("1040");
    expect(caves).not.toContain("1020");
    const palace = JSON.stringify(
      buildAnswerView(getQixiaKnowledgeByCode("B9")!),
    );
    expect(palace).toContain("乾隆二十二年");
    expect(palace).not.toContain("乾隆十七年");
  });
  it("待确认内容即使写入发布文件也不会泄露到答案", () => {
    editorial.Z9 = {
      facts: [{ key: "测试尺寸", value: "999 米", status: "pending" }],
      timeline: [{ date: "9876 年", what: "待核实事项", status: "pending" }],
    };
    try {
      const view = buildAnswerView(fixture({}));
      expect(view.facts).toEqual([]);
      expect(view.timeline).toEqual([]);
      expect(view.unsettled).toContain("测试尺寸");
      expect(JSON.stringify(view)).not.toMatch(/999|9876/);
    } finally {
      delete editorial.Z9;
    }
  });

  it("发布口径不带网址、可信度、钟点和价格", () => {
    for (const view of listAnswerViews()) {
      const { visitorInfo: _visitorInfo, ...historicalView } = view;
      const text = JSON.stringify(historicalView);
      expect(text, view.name).not.toMatch(/https?:\/\//);
      expect(text, view.name).not.toMatch(/credibility|参赛阅读/i);
      expect(text, view.name).not.toMatch(/\d{1,2}:\d{2}|\d+\s*元/);
    }
  });

  it("「又名」不展示误写和相邻景点名", () => {
    expect(displayAliases(getQixiaKnowledgeByCode("E7")!)).not.toContain(
      "复月桥",
    );
    expect(displayAliases(getQixiaKnowledgeByCode("A7")!)).not.toContain(
      "桃花涧",
    );
    expect(displayAliases(getQixiaKnowledgeByCode("E19")!)).toEqual([
      "玲峰池遗址",
    ]);
    expect(displayAliases(getQixiaKnowledgeByCode("A2")!)).toEqual(["金刚殿"]);
  });
});

describe("lookupQixiaKnowledge", () => {
  it("景点名前带「栖霞山」或高德全称时仍查到具体景点", () => {
    expect(lookedUpCode("栖霞山舍利塔")).toBe("B6");
    expect(lookedUpCode("栖霞山千佛岩")).toBe("B7");
    expect(lookedUpCode("栖霞山红叶谷")).toBe("C4");
    expect(lookedUpCode("栖霞山的明征君碑")).toBe("B4");
    expect(lookedUpCode("栖霞山风景名胜区-千佛岩")).toBe("B7");
    expect(lookedUpCode("栖霞山名胜风景区摄山栖霞寺")).toBe("B5");
    expect(lookedUpCode("千佛岩有多少尊佛像")).toBe("B7");
  });

  it("本名优先于别名，编号直接对上卡片", () => {
    expect(lookedUpCode("桃花涧")).toBe("E34");
    expect(lookedUpCode("鼓楼")).toBe("B3");
    expect(lookedUpCode("金刚殿")).toBe("A2");
    expect(lookedUpCode("明镜湖")).toBe("A4");
    expect(lookedUpCode("d2")).toBe("D2");
  });

  it("人名只出现在景点名里时按景点回答，单独提到人物时按人物回答", () => {
    expect(lookedUpCode("高奇峰墓园")).toBe("D2");
    expect(lookedUpCode("介绍一下徐十郎茶肆")).toBe("D3");
    const person = lookupQixiaKnowledge("李白和栖霞山有什么关系");
    expect(person.kind).toBe("people");
    expect(
      person.kind === "people" && person.people.map((item) => item.name),
    ).toEqual(["李白"]);
    expect(lookedUpCode("陆羽茶庄里的高奇峰画")).toBe("C13");
  });

  it("不会把独立建筑误查成相邻建筑", () => {
    expect(lookedUpCode("万松山房")).toBe("D16");
    expect(lookedUpCode("五松阁")).toBe("F8");
    expect(lookedUpCode("一念堂")).toBe("D17");
    expect(lookedUpCode("福康堂")).toBe("E29");
    expect(lookedUpCode("葆真庵")).toBe("D10");
  });
  it("票务问题与寺院卡片共用带日期的参考规则", () => {
    const found = lookupQixiaKnowledge("季卡学生优惠");
    if (found.kind !== "place") throw new Error("未找到票务规则");
    const info = found.view.visitorInfo;
    expect(info?.validThrough).toBe("2026-12-31");
    expect(
      info?.items.find((item) => item.label === "景区售票与入园")?.value,
    ).toContain("17:00后仍然可以进山");
    expect(info?.items.find((item) => item.label === "栖霞寺")?.value).toBe(
      "08:00—16:30，与景区大门时段分开。",
    );
    expect(
      info?.items.find((item) => item.label === "季卡学生优惠")?.value,
    ).toContain("可享季卡优惠");
    expect(
      info?.items.find((item) => item.label === "儿童免票与半价")?.value,
    ).toContain("1.5米以上即使未成年也不免票");
    expect(buildAnswerView(getQixiaKnowledgeByCode("B5")!).visitorInfo).toEqual(
      info,
    );
    expect(
      buildAnswerView(getQixiaKnowledgeByCode("B6")!).visitorInfo,
    ).toBeUndefined();
  });
  it("只问整座山时回到总条目，查无此名时返回 none", () => {
    expect(lookedUpCode("栖霞山有哪些景点")).toBe("S0");
    expect(lookedUpCode("不存在的地方")).toBe("none");
  });

  it("地图上每个有卡片的点按名字都能查到自己的卡片", () => {
    const linked = [...places, ...extraPlaces].filter(
      (place): place is typeof place & { referenceCode: string } =>
        typeof place.referenceCode === "string",
    );
    expect(linked.length).toBeGreaterThan(80);
    for (const place of linked)
      expect(lookedUpCode(place.name), place.name).toBe(place.referenceCode);
  });

  it("只说了景点名的一截也能落到对应条目，而不是退回整体介绍", () => {
    expect(lookedUpCode("陆羽茶事")).toBe("C13");
    expect(lookedUpCode("栖霞山陆羽茶事或遗迹")).toBe("C13");
  });

  it("整座山的问法仍回到总条目", () => {
    expect(lookedUpCode("栖霞山有哪些景点")).toBe("S0");
    expect(lookedUpCode("栖霞山")).toBe("S0");
  });
});
