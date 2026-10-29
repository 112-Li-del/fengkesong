import type { QixiaPlaceKnowledge } from "../types";

// 叠浪岩（层理记录自然变化，无独立知识卡片，仅作保存）
export const placeD15: QixiaPlaceKnowledge = {
  referenceCode: "D15",
  referenceName: "叠浪岩",
  name: "叠浪岩",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary: "层理记录自然变化的岩石，是认识古海洋与地质时间的观察点。",
  history:
    "叠浪岩的层理记录着自然的变化。明征君碑的石材又将文物与化石联系起来，其中可见海百合茎等化石。海百合是海洋动物，因外观近似植物而得名。同一件实物由此有了两种时间：碑文属于人的历史，石材中的生命痕迹则来自更早的自然过程。",
  keyFacts: [
    {
      key: "地质",
      values: [
        {
          value: "层理记录着自然的变化",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "关联化石",
      values: [
        {
          value: "可见海百合茎等化石（海百合为海洋动物，因外观近似植物得名）",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "关联文物",
      values: [
        {
          value:
            "与明征君碑石材相关，碑文属人的历史，石材生命痕迹来自更早自然过程",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
  ],
  timeline: [],
  audio: [],
  images: [],
  credibility: "C",
  note: "无独立知识卡片；据《栖霞山文化故事资料》整理，仅作保存与检索，未经交叉核实。",
};
