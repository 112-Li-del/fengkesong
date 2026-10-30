import type { QixiaPlaceKnowledge } from "../types";

// 乾隆御花园（乾隆御花园）
export const placeC3: QixiaPlaceKnowledge = {
  referenceCode: "C3",
  referenceName: "乾隆御花园",
  name: "乾隆御花园",
  kbCardId: "place-320113-yuhuayuan",
  kbTitle: "乾隆御花园",
  aliases: ["御花园"],
  summary: "御花园就系高宗花园的旧址。",
  history: null,
  historySources: [],
  keyFacts: [
    {
      key: "复建规模",
      values: [
        {
          value:
            "2006 年复建，占地 15000 平方米、建筑面积 1400 平方米，主建筑「峭倩」1000 平方米，钢筋混凝土框架、仿明清风格",
          source: "https://news.sina.com.cn/o/2008-10-29/072214646330s.shtml",
          credibility: "B",
        },
      ],
    },
    {
      key: "复建计划",
      values: [
        {
          value:
            "2002 年曾有中加合资按「修旧如旧」原则复建乾隆行宫的报道，后续未见落地信息",
          source: "https://news.sina.com.cn/s/2002-11-16/1255277s.html",
          credibility: "C",
        },
      ],
    },

    {
      key: "旧址性质",
      values: [
        {
          value: "高宗花园的旧址",
          source:
            "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
          credibility: "C",
        },
      ],
    },
    {
      key: "位置",
      group: "location",
      values: [
        {
          value: "乾隆行宫范围内，背靠主峰",
          source:
            "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
          credibility: "C",
        },
      ],
    },

    {
      key: "别名",
      values: [
        {
          value: "御花园",
          source: "https://m.nj.bendibao.com/tour/140483.shtm",
          credibility: "C",
        },
      ],
    },
    {
      key: "历史地位",
      values: [
        {
          value: "清时栖霞十景之一",
          source: "https://m.nj.bendibao.com/tour/140483.shtm",
          credibility: "C",
        },
      ],
    },
    {
      key: "景观特征",
      values: [
        {
          value: "林木覆盖",
          source: "https://m.nj.bendibao.com/tour/140483.shtm",
          credibility: "C",
        },
      ],
    },
  ],
  timeline: [
    {
      date: "2002-11",
      what: "媒体报道拟中加合资复建乾隆行宫",
      source: "https://news.sina.com.cn/s/2002-11-16/1255277s.html",
      credibility: "C",
    },
    {
      date: "2006",
      what: "御花园复建完成",
      source: "https://news.sina.com.cn/o/2008-10-29/072214646330s.shtml",
      credibility: "B",
    },

    {
      date: "清",
      what: "御花园为栖霞十景之一",
      source: "https://m.nj.bendibao.com/tour/140483.shtm",
    },
  ],
  audio: [],
  images: [],
  credibility: "C",
};
