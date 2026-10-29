import type { QixiaPlaceKnowledge } from "../types";

// 德云桥（德云亭/叠浪岩附近）
export const placeE17: QixiaPlaceKnowledge = {
  referenceCode: "E17",
  referenceName: "德云桥",
  name: "德云桥",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary:
    "位于德云亭、叠浪岩附近的一座桥，与德云庵、德云亭相关，网上暂无独立文字介绍。",
  history:
    "德云桥见于官方地图标注，位于德云亭、叠浪岩附近，名称与德云庵、德云亭相关。此桥目前网上暂无独立文字介绍。",
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
  note: "无独立知识卡片；仅见官方地图标注，暂无公开文字介绍，仅作点位保存。",
};
