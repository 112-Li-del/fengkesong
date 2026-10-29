import type { QixiaPlaceKnowledge } from "../types";

// 春雨桥（跨中峰涧，行宫外墙边界，无独立知识卡片，仅作保存）
export const placeD13: QixiaPlaceKnowledge = {
  referenceCode: "D13",
  referenceName: "春雨桥",
  name: "春雨桥",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary: "跨中峰涧的古桥，与行宫外墙边界和内外通道相连。",
  history:
    "春雨桥跨越中峰涧，与行宫的外墙边界和内外通道相连。桥、石墙、道路与林木，组成了今天的遗址面貌。中峰涧流经春雨桥一带。",
  keyFacts: [
    {
      key: "关联",
      values: [
        {
          value: "与行宫外墙边界和内外通道相连",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "跨越",
      values: [
        {
          value: "中峰涧",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
  ],
  timeline: [],
  audio: [],
  images: [],
  credibility: "C",
  note: "无独立知识卡片；据《栖霞山文化故事资料》整理，仅作保存与检索，未经交叉核实。",
};
