import type { QixiaPlaceKnowledge } from "../types";

// 德云桥（德云亭/叠浪岩附近）
export const placeE17: QixiaPlaceKnowledge = {
  referenceCode: "E17",
  referenceName: "德云桥",
  name: "德云桥",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary: "位于德云亭、叠浪岩附近的一座桥，与德云庵、德云亭相关。",
  history: "德云桥位于德云亭、叠浪岩附近，名称与德云庵、德云亭相关。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "德云亭、叠浪岩附近",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "关联景点",
      values: [
        {
          value: "德云庵、德云亭",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
};
