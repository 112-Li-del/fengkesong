import type { QixiaPlaceKnowledge } from "../types";

// 半月池（地图北部新标注，暂无公开文字介绍）
export const placeE4: QixiaPlaceKnowledge = {
  referenceCode: "E4",
  referenceName: "半月池",
  name: "半月池",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary:
    "地图北部（寻仙崖瀑布旁）新标注的一处景点，目前网上暂无独立文字介绍。",
  history:
    "半月池见于官方「一票逛三园」地图北部（寻仙崖瀑布旁）标注。需要注意：它与栖霞寺门前呈半月形的「月牙池」（又名白莲池、放生池）不是同一处。目前网上暂无关于此半月池的独立文字介绍。",
  keyFacts: [
    {
      key: "位置线索",
      values: [
        {
          value: "地图北部，寻仙崖瀑布旁",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "勘误说明",
      values: [
        {
          value: "与寺门前「月牙池/白莲池」是两处不同景点",
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
