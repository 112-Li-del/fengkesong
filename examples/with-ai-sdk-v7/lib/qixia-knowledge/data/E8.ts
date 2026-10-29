import type { QixiaPlaceKnowledge } from "../types";

// 印心湖（地图北部景点，暂无公开文字介绍）
export const placeE8: QixiaPlaceKnowledge = {
  referenceCode: "E8",
  referenceName: "印心湖",
  name: "印心湖",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary: "地图北部标注的一处景点，目前网上暂无独立文字介绍。",
  history:
    "印心湖见于官方「一票逛三园」地图的北部标注。需注意：栖霞寺山门曾有茗山法师题联「仰祖印心属二伽」，「印心」为佛教用语，与此湖为两个不同所指。目前网上暂无关于此湖的独立文字介绍。",
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
  ],
  audio: [],
  images: [],
  credibility: "C",
  note: "仅见官方地图标注，暂无公开文字介绍，仅作点位占位保存，不编造史实。",
};
