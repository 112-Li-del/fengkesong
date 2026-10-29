import type { QixiaPlaceKnowledge } from "../types";

// 春·赏花点（南门花海/赏花点）
export const placeE11: QixiaPlaceKnowledge = {
  referenceCode: "E11",
  referenceName: "春·赏花点",
  name: "春·赏花点",
  kbCardId: null,
  kbTitle: null,
  aliases: ["十色花海", "赏花点"],
  summary:
    "位于南门一带的花海/赏花点，春日有牡丹、二月兰等花卉，为春季赏花处。",
  history:
    "「春·赏花点」位于栖霞山南门一带，据网络资料为十色花海或赏花点，春日有牡丹、二月兰等花卉开放，是春季赏花的一处景点。此点在网上独立介绍较少。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "南门一带",
          source: "官方地图标注",
          credibility: "C",
        },
      ],
    },
    {
      key: "花卉",
      values: [
        {
          value: "春日牡丹、二月兰等",
          source: "网络游记",
          credibility: "C",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
  note: "无独立知识卡片；据官方地图标注与网络游记整理，仅作保存。",
};
