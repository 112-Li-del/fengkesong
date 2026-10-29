import type { QixiaPlaceKnowledge } from "../types";

// 千佛斋（栖霞寺素菜馆）
export const placeE24: QixiaPlaceKnowledge = {
  referenceCode: "E24",
  referenceName: "千佛斋",
  name: "千佛斋",
  kbCardId: null,
  kbTitle: null,
  aliases: ["千佛斋素菜馆"],
  summary:
    "栖霞寺的素菜馆，位于寺院西北侧（栖霞古寺旁），以素面等素斋见长，曾在素食比赛中获奖，是游客在寺内用餐的一处去处。",
  history:
    "千佛斋是栖霞寺的素菜馆（千佛斋素菜馆），位于寺院西北侧、栖霞古寺旁，供应素面等素斋，曾在全国性素食比赛中获奖。据游客评价，其素面价格约为 20 元一碗（价格可能随经营调整，以现场为准）。",
  keyFacts: [
    {
      key: "位置",
      values: [
        {
          value: "寺院西北侧，栖霞古寺旁",
          source: "微信公众号「南京栖霞山」/大众点评",
          credibility: "B",
        },
      ],
    },
    {
      key: "特色",
      values: [
        {
          value: "素面等素斋，曾在素食比赛中获奖",
          source: "微信公众号「南京栖霞山」/大众点评",
          credibility: "B",
        },
      ],
    },
    {
      key: "参考价格",
      values: [
        {
          value: "素面约 20 元一碗",
          source: "大众点评",
          credibility: "C",
          note: "价格随经营调整，以现场为准",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "B",
  note: "无独立知识卡片；据官方公众号及大众点评等公开资料整理。",
};
