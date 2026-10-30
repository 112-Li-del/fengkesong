import type { QixiaPlaceKnowledge } from "../types";

// 凌虚室遗址（乾隆行宫建筑）
export const placeG4: QixiaPlaceKnowledge = {
  referenceCode: "G4",
  referenceName: "凌虚室遗址",
  name: "凌虚室遗址",
  kbCardId: null,
  kbTitle: null,
  aliases: ["凌虚室"],
  summary:
    "乾隆行宫建筑之一，古籍记为「凌虚室」，今仅存遗址，是栖霞山帝王文化遗迹的组成部分。",
  history:
    "凌虚室为清乾隆栖霞行宫建筑之一。明人游记《游摄山栖霞寺记》已记「凌虚室」之名，云「因导予至凌虚室，约五里而陟绝顶，下望江水，烟帆云舶忽在襟袖」。[1] 乾隆行宫毁于清咸丰五年（1855）战火，凌虚室随之湮没，今仅存遗址。[2] 据地图 OCR 校正，「凌虚室遗址」即古籍所记「凌虚室」的遗址，为栖霞山乾隆行宫建筑体系的一部分。[3]",
  historySources: [
    "[1] 凌虚室古籍记载（B）：明人《游摄山栖霞寺记》（见陆羽茶庄卡所引古籍）",
    "[2] 行宫毁于战火（B）：百度百科「乾隆行宫遗址」",
    "[3] 遗址定位（C）：栖霞山 58 景点联网检索报告（OCR 校正「凌烟空遗址＝凌虚室遗址」）",
  ],
  keyFacts: [
    {
      key: "性质",
      values: [
        {
          value: "乾隆行宫建筑之一，古籍作「凌虚室」",
          source: "明人《游摄山栖霞寺记》",
          credibility: "B",
        },
      ],
    },
    {
      key: "位置",
      group: "location",
      values: [
        {
          value: "栖霞山乾隆行宫范围内（中峰涧至龙山一带）",
          source: "百度百科「乾隆行宫遗址」",
          credibility: "B",
        },
      ],
    },
    {
      key: "现状",
      values: [
        {
          value: "仅存遗址",
          source: "百度百科「乾隆行宫遗址」",
          credibility: "B",
        },
      ],
    },
  ],
  timeline: [
    {
      date: "清乾隆年间",
      what: "凌虚室为栖霞行宫建筑之一",
      source: "明人《游摄山栖霞寺记》",
      credibility: "B",
    },
    {
      date: "清咸丰五年（1855）",
      what: "乾隆行宫毁于战火，凌虚室湮没",
      source: "百度百科「乾隆行宫遗址」",
      credibility: "B",
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
  note: "凌虚室古籍记载较简略，今仅存遗址，具体形制与沿革有待进一步考证。",
};
