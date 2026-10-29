import type { QixiaPlaceKnowledge } from "../types";

// 青峰涧（地图标注；地图 OCR 曾作「青峰具」）
export const placeE25: QixiaPlaceKnowledge = {
  referenceCode: "E25",
  referenceName: "青峰涧",
  name: "青峰涧",
  kbCardId: null,
  kbTitle: null,
  aliases: ["青峰具"],
  summary: "地图标注的一处景点，目前网上暂无独立文字介绍。",
  history:
    "青峰涧见于官方「一票逛三园」地图标注。地图 OCR 中此名曾被识作「青峰具」，实为「青峰涧」。目前网上暂无关于此涧的独立文字介绍。",
  keyFacts: [
    {
      key: "勘误说明",
      values: [
        {
          value: "地图 OCR 曾误作「青峰具」，实为「青峰涧」",
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
