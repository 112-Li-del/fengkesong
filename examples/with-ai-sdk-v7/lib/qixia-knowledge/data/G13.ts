import type { QixiaPlaceKnowledge } from "../types";

// 景区南门（南门售票处）
export const placeG13: QixiaPlaceKnowledge = {
  referenceCode: "G13",
  referenceName: "景区南门",
  name: "景区南门",
  kbCardId: null,
  kbTitle: null,
  aliases: ["南门", "南门售票处"],
  summary:
    "栖霞山风景区南门，位于栖霞大道北侧，为景区主要出入口之一，也是南门 7 公里、10 公里徒步线的起点。",
  history:
    "景区南门位于栖霞大道北侧，南门售票处以北约 35 米，是栖霞山风景区的主要出入口之一。[1] 栖霞山风景区为国家 AAAA 级旅游景区、国家级森林公园，位于南京城东北约 22 公里、栖霞区栖霞街 88 号。[2] 南门也是景区「南门 7 公里、10 公里徒步线」的第一站（起点）。[3] 游览路线通常由牌坊、游客中心、北门进入，或经南门入园，串联哼哈殿、钟鼓楼、放生池、山门、毗卢宝殿、舍利塔、千佛岩等景点。[4]",
  historySources: [
    "[1] 南门位置（B）：qixia-places-extra.json（据官方导览图配准）",
    "[2] 景区概况（B）：百度百科「南京栖霞山国家森林公园」",
    "[3] 南门徒步线起点（B）：半馆卡（C10）所载",
    "[4] 游览路线（C）：微信公众号《江苏游记之南京栖霞寺三论宗祖庭》",
  ],
  keyFacts: [
    {
      key: "位置",
      group: "location",
      values: [
        {
          value: "栖霞大道北侧，南门售票处以北约 35 米",
          source: "qixia-places-extra.json",
          credibility: "B",
        },
      ],
    },
    {
      key: "功能",
      values: [
        {
          value: "景区主要出入口之一",
          source: "qixia-places-extra.json",
          credibility: "B",
        },
      ],
    },
    {
      key: "徒步线",
      values: [
        {
          value: "南门 7 公里、10 公里徒步线的第一站",
          source: "半馆卡（C10）",
          credibility: "B",
        },
      ],
    },
  ],
  audio: [],
  images: [],
  credibility: "B",
  note: "景区南门为基础设施（出入口），非传统人文景点，本卡仅提供位置与入园信息。",
};
