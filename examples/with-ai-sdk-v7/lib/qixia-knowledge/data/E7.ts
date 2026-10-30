import type { QixiaPlaceKnowledge } from "../types";

// 望月桥（地图北部新标注；地图 OCR 曾作「复月桥」）
export const placeE7: QixiaPlaceKnowledge = {
  referenceCode: "E7",
  referenceName: "望月桥",
  name: "望月桥",
  kbCardId: null,
  kbTitle: null,
  aliases: ["复月桥"],
  summary: "栖霞山北部的一处景点。",
  history: "望月桥位于栖霞山北部。此名曾误作「复月桥」，实为「望月桥」。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "栖霞山北部",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "特别说明",
      values: [
        {
          value: "曾误作「复月桥」，实为「望月桥」",
          source: "人工勘误",
          credibility: "C",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
};
