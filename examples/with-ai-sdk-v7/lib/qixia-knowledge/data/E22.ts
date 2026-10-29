import type { QixiaPlaceKnowledge } from "../types";

// 虚云亭（狮子岭上观景亭）
export const placeE22: QixiaPlaceKnowledge = {
  referenceCode: "E22",
  referenceName: "虚云亭",
  name: "虚云亭",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary:
    "位于狮子岭上的一处亭，据称可从太虚亭观景台远眺东麓狮子岭上的虚云亭，网上独立介绍较少。",
  history:
    "虚云亭位于栖霞山狮子岭上。据网络资料，从太虚亭观景台可远眺东麓狮子岭上的虚云亭。此亭在网上独立介绍较少。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "狮子岭上",
          source: "网络游记/官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "观景",
      values: [
        {
          value: "可从太虚亭观景台远眺",
          source: "网络游记",
          credibility: "C",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
  note: "无独立知识卡片；据网络游记与官方地图标注整理，仅作保存。",
};
