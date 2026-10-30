import type { QixiaPlaceKnowledge } from "../types";

// 白莲池（月牙池、放生池）
export const placeG7: QixiaPlaceKnowledge = {
  referenceCode: "G7",
  referenceName: "白莲池",
  name: "白莲池（月牙池）",
  kbCardId: null,
  kbTitle: null,
  aliases: ["月牙池", "放生池", "万功池"],
  summary:
    "栖霞寺前明镜湖之东的一处半月形小池，因形似月牙名月牙池，又作放生池，现池为 1980 年修复。",
  history:
    "白莲池位于栖霞寺前，过明镜湖、钟鼓楼前行即至，因形似月牙，又名月牙池。[1][2] 又因专供善男信女放生之用，名放生池或万功池。[1] 古籍《摄山志》记「寺由栖霞街东行数百步，经白莲池，始达山门」，可见白莲池古已有之，为入寺必经之地。[2] 沿池有汉白玉栏杆，雕刻水禽花卉，栩栩如生；原池已毁，现池为 1980 年修复。[1]",
  historySources: [
    "[1] 位置与别名及修复（B）：微信公众号《图说栖霞古寺》",
    "[2] 古籍记载（B）：《摄山志》「经白莲池始达山门」",
  ],
  keyFacts: [
    {
      key: "位置",
      group: "location",
      values: [
        {
          value: "栖霞寺前，过明镜湖、钟鼓楼前行即至",
          source: "微信公众号《图说栖霞古寺》",
          credibility: "B",
        },
      ],
    },
    {
      key: "别名",
      values: [
        {
          value: "因形似月牙名月牙池，又作放生池、万功池",
          source: "微信公众号《图说栖霞古寺》",
          credibility: "B",
        },
      ],
    },
    {
      key: "形制",
      values: [
        {
          value: "半月形小池，沿池有汉白玉栏杆",
          source: "微信公众号《图说栖霞古寺》",
          credibility: "B",
        },
      ],
    },
    {
      key: "修复",
      values: [
        {
          value: "原池已毁，现池为 1980 年修复",
          source: "微信公众号《图说栖霞古寺》",
          credibility: "B",
        },
      ],
    },
  ],
  timeline: [
    {
      date: "清代",
      what: "《摄山志》记「经白莲池始达山门」，白莲池为入寺必经之地",
      source: "《摄山志》",
      credibility: "B",
    },
    {
      date: "1980 年",
      what: "修复白莲池",
      source: "微信公众号《图说栖霞古寺》",
      credibility: "B",
    },
  ],
  audio: [],
  images: [],
  credibility: "B",
};
