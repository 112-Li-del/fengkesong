import type { QixiaPlaceKnowledge } from "../types";

// 珍珠泉（旧泉眼，无独立知识卡片，仅作保存）
export const placeD5: QixiaPlaceKnowledge = {
  referenceCode: "D5",
  referenceName: "珍珠泉",
  name: "珍珠泉",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary: "山中的旧泉眼，连着题字、桃花湖与后来的亭景。",
  history:
    "珍珠泉连着旧泉眼、题字、桃花湖与后来的亭景。水源和景物几经变化，名字仍保存着往日的记忆。",
  keyFacts: [
    {
      key: "组成",
      values: [
        {
          value: "旧泉眼、题字、桃花湖与后来的亭景",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "现状",
      values: [
        {
          value: "水源和景物几经变化，名字仍保存往日记忆",
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
