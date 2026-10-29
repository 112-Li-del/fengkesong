import type { QixiaPlaceKnowledge } from "../types";

// 小营盘遗址（行宫守卫遗址，无独立知识卡片，仅作保存）
export const placeD12: QixiaPlaceKnowledge = {
  referenceCode: "D12",
  referenceName: "小营盘遗址",
  name: "小营盘遗址",
  kbCardId: null,
  kbTitle: null,
  aliases: ["小营盘"],
  summary: "行宫守卫相关遗址，地势较高，可俯瞰行宫及周边。",
  history:
    "小营盘遗址与行宫的守卫有关。这里发现过围墙、道路和房址等遗迹，地势较高，可以俯瞰行宫及周边区域。它让人看见宫殿之外的生活：驻军、道路，以及人在山地中的活动。附近还有半馆与饮马池。",
  keyFacts: [
    {
      key: "功能",
      values: [
        {
          value: "与行宫的守卫有关",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "遗迹",
      values: [
        {
          value: "围墙、道路、房址等遗迹",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "位置",
      values: [
        {
          value: "地势较高，可俯瞰行宫及周边区域",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "关联",
      values: [
        {
          value: "附近有半馆与饮马池",
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
