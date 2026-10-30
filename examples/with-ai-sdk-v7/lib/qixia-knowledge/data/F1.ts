import type { QixiaPlaceKnowledge } from "../types";

// 凤翔峰（三茅峰，栖霞山主峰）
export const placeF1: QixiaPlaceKnowledge = {
  referenceCode: "F1",
  referenceName: "凤翔峰",
  name: "凤翔峰",
  kbCardId: null,
  kbTitle: null,
  aliases: ["三茅峰", "最高峰"],
  summary:
    "栖霞山主峰，又名三茅峰、最高峰，海拔约 284.7 米，孤峰独峙、卓立天外，为全山最高处，登顶可俯瞰长江。",
  history:
    "凤翔峰即栖霞山主峰。据《栖霞新志》载：「凤翔峰，一名最高峰，因峰上有三茅宫」，故又称三茅峰。峰呈圆锥形，海拔约 284.7 米，孤峰独峙、卓立天外。栖霞寺即坐落在凤翔峰西麓，坐东朝西，南有龙山、北有虎山。乾隆皇帝三次登临凤翔峰，赋诗数首；袁枚与蒋士铨亦曾共攀凤翔峰，各赋《登最高峰》，传为佳话。",
  keyFacts: [
    {
      key: "地位",
      values: [
        {
          value: "栖霞山主峰（最高峰）",
          source: "《栖霞山志》（摄山志古籍资料）",
          credibility: "B",
        },
      ],
    },
    {
      key: "别名",
      values: [
        {
          value: "三茅峰（因峰上有三茅宫）、最高峰",
          source: "《栖霞山志》（摄山志古籍资料）",
          credibility: "B",
        },
      ],
    },
    {
      key: "海拔",
      values: [
        {
          value: "284.7",
          unit: "米",
          source: "《栖霞山志》（摄山志古籍资料）",
          credibility: "B",
        },
        {
          value: "286",
          unit: "米",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
          note: "一说 286 米，与 284.7 米并存，以现场实测为准",
        },
      ],
    },
    {
      key: "位置",
      values: [
        {
          value: "栖霞山主峰，栖霞寺位于其西麓，南有龙山、北有虎山",
          source: "《栖霞山志》（摄山志古籍资料）",
          credibility: "B",
        },
      ],
    },
    {
      key: "名人",
      values: [
        {
          value: "乾隆三次登临赋诗；袁枚、蒋士铨共攀并各赋《登最高峰》",
          source: "《栖霞山志》（摄山志古籍资料）",
          credibility: "B",
        },
      ],
    },
  ],
  timeline: [
    {
      date: "清乾隆年间",
      what: "乾隆三次登临凤翔峰赋诗",
      source: "《栖霞山志》（摄山志古籍资料）",
      credibility: "B",
    },
  ],
  audio: [],
  images: [],
  credibility: "B",
  note: "海拔 284.7 米与 286 米两说并存。",
};
