import type { QixiaPlaceKnowledge } from "../types";

// 葆贞庵（《桃花扇》文学空间，无独立知识卡片，仅作保存）
export const placeD10: QixiaPlaceKnowledge = {
  referenceCode: "D10",
  referenceName: "葆贞庵",
  name: "葆贞庵",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary: "《桃花扇》相关的文学空间，与桃花涧、桃花扇亭相连。",
  history:
    "桃花扇亭的名字与孔尚任《桃花扇》相连。李香君、侯方域的文学故事，与桃花涧、葆贞庵等地方空间相接。亭的形态与窗洞中，也能看到扇形和桃花花瓣的意象。",
  keyFacts: [
    {
      key: "文学关联",
      values: [
        {
          value: "孔尚任《桃花扇》",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "人物",
      values: [
        {
          value: "李香君、侯方域",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "相关地点",
      values: [
        {
          value: "桃花涧、桃花扇亭",
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
