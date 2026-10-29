import type { QixiaPlaceKnowledge } from "../types";

// 望月桥（地图北部新标注；地图 OCR 曾作「复月桥」）
export const placeE7: QixiaPlaceKnowledge = {
  referenceCode: "E7",
  referenceName: "望月桥",
  name: "望月桥",
  kbCardId: null,
  kbTitle: null,
  aliases: ["复月桥"],
  summary:
    "地图北部新标注的一处景点，仅见于官方「一票逛三园」地图，目前网上暂无独立文字介绍。",
  history:
    "望月桥仅见于官方「一票逛三园」地图的北部标注。地图 OCR 中此名曾被识作「复月桥」，实为「望月桥」。目前网上暂无关于此桥的独立文字介绍。",
  keyFacts: [
    {
      key: "位置线索",
      values: [
        {
          value: "地图北部",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "勘误说明",
      values: [
        {
          value: "地图 OCR 曾误作「复月桥」，实为「望月桥」",
          source: "人工勘误",
          credibility: "C",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
  note: "仅见官方地图标注，暂无公开文字介绍，仅作点位占位保存，不编造史实。",
};
