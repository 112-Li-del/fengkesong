import type { QixiaPlaceKnowledge } from "../types";

// 财神殿（栖霞古寺内）
export const placeE29: QixiaPlaceKnowledge = {
  referenceCode: "E29",
  referenceName: "财神殿",
  name: "财神殿",
  kbCardId: null,
  kbTitle: null,
  aliases: ["一念堂"],
  summary:
    "栖霞古寺内的一处殿宇（一念堂、财神殿），福康堂（原财神殿）旁为景区交通车上车点。",
  history:
    "财神殿位于栖霞古寺内，与一念堂并列。据网络资料，福康堂（原财神殿）旁是景区交通车的上车点。此殿在公开资料中独立介绍较少。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "栖霞古寺内",
          source: "网络游记/官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "关联",
      values: [
        {
          value: "一念堂、福康堂（原财神殿）",
          source: "网络游记",
          credibility: "C",
        },
      ],
    },
    {
      key: "交通",
      values: [
        {
          value: "福康堂（原财神殿）旁为景区交通车上车点",
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
