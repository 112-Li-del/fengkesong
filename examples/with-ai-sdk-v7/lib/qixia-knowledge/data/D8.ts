import type { QixiaPlaceKnowledge } from "../types";

// 栖霞老街（栖霞街，山前古镇，无独立知识卡片，仅作保存）
export const placeD8: QixiaPlaceKnowledge = {
  referenceCode: "D8",
  referenceName: "栖霞老街",
  name: "栖霞老街",
  kbCardId: null,
  kbTitle: null,
  aliases: ["栖霞街", "栖霞市"],
  summary: "山前古镇街，宋元称「栖霞市」，明清为栖霞街，是进山游览的一段路。",
  history:
    "宋元时期，山前已有「栖霞市」的记载。到了明清，栖霞街又出现在游记中，成为人们进山游览的一段路。桥、街与进山的路径相连。九乡河、栖霞桥、栖霞街，以及乾隆相关的御龙桥记忆，共同构成了山前的历史空间。",
  keyFacts: [
    {
      key: "历史沿革",
      values: [
        {
          value: "宋元时期已有「栖霞市」记载，明清为栖霞街",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "关联",
      values: [
        {
          value: "九乡河、栖霞桥、栖霞街及乾隆相关的御龙桥记忆",
          source: "《栖霞山文化故事资料》（枫客松参赛阅读）",
          credibility: "C",
        },
      ],
    },
    {
      key: "居民",
      values: [
        {
          value: "有从山东、苏北迁来、以錾石为业者，也有来自江北、从事农业者",
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
