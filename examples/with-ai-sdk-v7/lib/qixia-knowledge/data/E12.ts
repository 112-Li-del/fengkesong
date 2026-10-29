import type { QixiaPlaceKnowledge } from "../types";

// 虎山瀑布（虎山附近小型瀑布）
export const placeE12: QixiaPlaceKnowledge = {
  referenceCode: "E12",
  referenceName: "虎山瀑布",
  name: "虎山瀑布",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary:
    "虎山（栖霞山西峰，状如伏虎）附近的一处小型瀑布，位于懒人线「虎山栈道—碧云亭—红叶谷—虎山瀑布—桃花湖」沿线，据称瀑布旁有天鹅栖息。",
  history:
    "虎山瀑布位于虎山（栖霞山西峰，山形西北状如伏虎）附近，是一处小型瀑布，处在懒人线「虎山栈道—碧云亭—红叶谷—虎山瀑布—桃花湖」的游览动线中。据网络资料，瀑布旁有天鹅栖息。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "虎山（西峰）附近",
          source: "网络游记/官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "游览动线",
      values: [
        {
          value: "懒人线：虎山栈道—碧云亭—红叶谷—虎山瀑布—桃花湖",
          source: "网络游记",
          credibility: "C",
        },
      ],
    },
    {
      key: "周边生态",
      values: [
        {
          value: "据称瀑布旁有天鹅栖息",
          source: "网络游记",
          credibility: "C",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
  note: "无独立知识卡片；虎山本体另有条目，此条仅记虎山瀑布，据网络资料整理。",
};
