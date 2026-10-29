import type { QixiaPlaceKnowledge } from "../types";

// 双亭（枫林湖畔观景亭）
export const placeE10: QixiaPlaceKnowledge = {
  referenceCode: "E10",
  referenceName: "双亭",
  name: "双亭",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary:
    "枫林湖畔的双亭，据称从亭中可极目远眺层林尽染，是红叶谷周边的一处观景亭。",
  history:
    "双亭位于枫林湖畔，据网络游记与官方地图标注，从亭中可极目远眺、欣赏层林尽染的红叶景观。此景点在传统攻略中独立介绍较少。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "枫林湖畔",
          source: "网络游记/官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "功能",
      values: [
        {
          value: "观景亭，可极目远眺层林尽染",
          source: "网络游记",
          credibility: "C",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
  note: "无独立知识卡片；网上独立介绍较少，据网络游记与官方地图标注整理，仅作保存。",
};
