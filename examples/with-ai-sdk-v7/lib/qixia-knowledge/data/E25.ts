import type { QixiaPlaceKnowledge } from "../types";

// 青峰涧（地图标注；地图 OCR 曾作「青峰具」）
export const placeE25: QixiaPlaceKnowledge = {
  referenceCode: "E25",
  referenceName: "青峰涧",
  name: "青峰涧",
  kbCardId: null,
  kbTitle: null,
  aliases: ["青峰具"],
  summary: "栖霞山内的一处山涧。",
  history: "青峰涧位于栖霞山内。此名曾误作「青峰具」，实为「青峰涧」。",
  keyFacts: [
    {
      key: "特别说明",
      values: [
        {
          value: "曾误作「青峰具」，实为「青峰涧」",
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
