import type { QixiaPlaceKnowledge } from "../types";

// 揽秋湖（桃花涧一带湖泊）
export const placeE3: QixiaPlaceKnowledge = {
  referenceCode: "E3",
  referenceName: "揽秋湖",
  name: "揽秋湖",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary:
    "桃花涧一带的湖泊，游览动线大致经高奇峰碑→桃花扇亭→桃花湖→揽秋湖，以秋日湖景为特色。",
  history:
    "揽秋湖位于栖霞山桃花涧一带，据官方游览动线，可经高奇峰碑、桃花扇亭、桃花湖抵达揽秋湖。秋日湖景是其特色，网上关于此湖的独立文字介绍较少。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "桃花涧一带",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "游览动线",
      values: [
        {
          value: "高奇峰碑→桃花扇亭→桃花湖→揽秋湖",
          source: "官方地图标注/网络游记",
          credibility: "C",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
  note: "无独立知识卡片；网上独立介绍较少，据官方地图标注整理，仅作保存。",
};
