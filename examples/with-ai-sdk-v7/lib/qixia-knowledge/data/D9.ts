import type { QixiaPlaceKnowledge } from "../types";

// 九乡河（山前河流，无独立知识卡片，仅作保存）
export const placeD9: QixiaPlaceKnowledge = {
  referenceCode: "D9",
  referenceName: "九乡河",
  name: "九乡河",
  kbCardId: null,
  kbTitle: null,
  aliases: [],
  summary: "山前河流，与桥、街、进山路径相连。",
  history:
    "九乡河是山前的河流。桥、街与进山的路径相连，九乡河、栖霞桥、栖霞街，以及乾隆相关的御龙桥记忆，共同构成了山前的历史空间。",
  keyFacts: [
    {
      key: "关联",
      values: [
        {
          value: "栖霞桥、栖霞街、御龙桥",
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
