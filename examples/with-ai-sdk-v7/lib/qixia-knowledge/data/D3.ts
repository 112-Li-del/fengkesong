import type { QixiaPlaceKnowledge } from "../types";

// 徐十郎茶肆（山前历史茶肆，无独立知识卡片，仅作保存）
export const placeD3: QixiaPlaceKnowledge = {
  referenceCode: "D3",
  referenceName: "徐十郎茶肆",
  name: "徐十郎茶肆",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary: "山前的一处历史茶肆，与饮茶生活、市井往来相关。",
  history:
    "徐十郎茶肆与山前的饮茶生活相连。山中采茶、泉边试茶、街上饮茶，呈现着地方生活的不同侧面。山中的茶事、山前的茶肆，与今天的古镇生活相互映照。",
  keyFacts: [
    {
      key: "主题",
      values: [
        {
          value: "山前饮茶生活、市井往来",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "人物",
      values: [
        {
          value: "徐十郎（宋代）",
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
