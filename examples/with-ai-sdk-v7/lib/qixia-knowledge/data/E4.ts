import type { QixiaPlaceKnowledge } from "../types";

// 半月池（地图北部新标注景点）
export const placeE4: QixiaPlaceKnowledge = {
  referenceCode: "E4",
  referenceName: "半月池",
  name: "半月池",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary: "栖霞山北部、寻仙崖瀑布旁的一处水池。",
  history:
    "半月池位于栖霞山北部、寻仙崖瀑布旁，与栖霞寺门前呈半月形的「月牙池」（又名白莲池、放生池）并非同一处。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "栖霞山北部，寻仙崖瀑布旁",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "特别说明",
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
};
