import type { QixiaPlaceKnowledge } from "../types";

// 读枫文化美食园（读枫阁区域美食园区）
export const placeE15: QixiaPlaceKnowledge = {
  referenceCode: "E15",
  referenceName: "读枫文化美食园",
  name: "读枫文化美食园",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary:
    "官方地图标注的一处美食园区，位于天开岩、卧云亭附近，疑为读枫阁区域的美食园区，网上暂无独立文字介绍。",
  history:
    "读枫文化美食园见于官方「一票逛三园」地图标注，位于天开岩、卧云亭附近，据推测为读枫阁区域的美食园区。目前网上尚无关于此园区的独立文字介绍。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "天开岩、卧云亭附近（一说读枫阁区域）",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "功能",
      values: [
        {
          value: "美食园区（据名称与地图标注推测）",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
  note: "无独立知识卡片；仅见官方地图标注，暂无公开文字介绍，仅作点位保存。",
};
