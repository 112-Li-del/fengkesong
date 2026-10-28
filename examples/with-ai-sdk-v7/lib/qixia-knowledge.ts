// 由脚本从「栖霞知识库」(https://qixia.winnielyu.com) 导入生成。
// 数据日期：2026-10-28；知识库内容为机器整理草稿（status=draft），多为 C 级，仅作线索与讲解素材。
// 图片来自维基共享资源（Wikimedia Commons）开放许可，须按 license 署名；音频为喜马拉雅讲解链接。
// 回答规则：同字段多说法须并列展示，C 级按「一说」表述，附 source_url。

export type Credibility = "A" | "B" | "C";

export type QixiaFact = {
  key: string;
  values: {
    value: string;
    unit?: string;
    source: string;
    credibility: Credibility;
    note?: string;
  }[];
};

export type QixiaTimelineItem = {
  date: string;
  what: string;
  source: string;
  credibility?: Credibility;
};

export type QixiaAudio = {
  title: string;
  url: string;
  platform: string;
  author?: string;
  kind?: string;
  minutes?: number;
  plays?: number;
};

export type QixiaImage = {
  url: string;
  title: string;
  desc?: string;
  author: string;
  license: string;
  licenseUrl?: string;
  source: string;
  historic?: boolean;
};

export type QixiaPlaceKnowledge = {
  referenceCode: string;
  referenceName: string;
  name: string;
  kbCardId: string | null;
  kbTitle?: string | null;
  aliases?: string[];
  summary?: string | null;
  history?: string | null;
  historySources?: string[];
  keyFacts?: QixiaFact[];
  timeline?: QixiaTimelineItem[];
  audio?: QixiaAudio[];
  images?: QixiaImage[];
  credibility?: Credibility | null;
  note?: string;
};

export const qixiaKnowledge: QixiaPlaceKnowledge[] = [
  {
    referenceCode: "A1",
    referenceName: "牌坊",
    name: "栖霞禅寺牌坊",
    kbCardId: null,
    kbTitle: null,
    note: "知识库无独立卡片；仅见「栖霞古镇故事馆」打卡路线提及。",
  },
  {
    referenceCode: "A2",
    referenceName: "哼哈殿",
    name: "哼哈殿",
    kbCardId: "place-320113-henghadian",
    kbTitle: "哼哈殿",
    aliases: ["金刚殿"],
    summary: "哼哈殿是栖霞山风景名胜区线路A和线路B的景点之一，位于游览路线中。",
    history: null,
    historySources: [],
    keyFacts: [
      {
        key: "别名",
        values: [
          {
            value: "哼哈殿、金刚殿",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "金刚殿",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "B",
          },
          {
            value: "金刚殿",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "位置",
        values: [
          {
            value: "栖霞寺的主入口",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "三扇门",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "重建年代",
        values: [
          {
            value: "1919年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "建成时间",
        values: [
          {
            value: "2001年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "匾额",
        values: [
          {
            value: "乾隆御笔",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "题名",
        values: [
          {
            value: "沈鹏先生",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "1919年",
        what: "复建哼哈殿",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "2001年",
        what: "建成时间",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
    ],
    audio: [],
    images: [
      {
        url: "https://qixia.winnielyu.com/img/commons/c93181c97c4.jpg",
        title: "Gate of Qixia Temple nanjing",
        desc: "Gate of Qixia Temple,Nanjing, China",
        author: "Farm",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:Gate_of_Qixia_Temple_nanjing.jpg",
        historic: false,
      },
    ],
    credibility: "C",
  },
  {
    referenceCode: "A4",
    referenceName: "彩虹明镜",
    name: "彩虹明镜",
    kbCardId: "place-320113-mingjinghu",
    kbTitle: "明镜湖",
    aliases: ["彩虹明镜"],
    summary: "明镜湖是栖霞山景点中的自然奇观之一。",
    history:
      "明镜湖一说于1757年由两江总督尹继善开凿而成，用以迎接乾隆皇帝第三次南巡。[13][18][22][25] 据导游讲，此湖是进入栖霞寺的第一景，为栖霞十景之一。[12][14][24][25] 其名一说因四周树木倒映湖中如镜而得名，一说为乾隆皇帝赐名。[11][20][24]",
    historySources: [
      "[5] 湖中景观（C）：https://m.maigoo.com/citiao/113006.html",
      "[6] 湖心建筑（C）：https://m.maigoo.com/citiao/113006.html",
      "[7] 桥梁形制（C）：https://m.maigoo.com/citiao/113006.html",
      "[8] 水质（C）：https://m.maigoo.com/citiao/113006.html",
      "[9] 景观（C）：https://m.maigoo.com/citiao/113006.html",
      "[11] 得名由来（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[12] 位置（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[13] 开凿者（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[14] 景区地位（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[15] 湖中景观（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[16] 放生动物（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[17] 饲养动物（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[18] 建成年代（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[20] 得名由来（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[22] 大事记 乾隆第三次下江南（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[24] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[25] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[26] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
    ],
    keyFacts: [
      {
        key: "类型",
        values: [
          {
            value: "自然奇观",
            source: "https://zh.wikipedia.org/zh-cn/栖霞山",
            credibility: "C",
          },
        ],
      },
      {
        key: "别名",
        values: [
          {
            value: "彩虹明镜",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "B",
          },
          {
            value: "彩虹明镜",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "B",
          },
          {
            value: "彩虹明镜",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "B",
          },
          {
            value: "彩虹明镜",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
          {
            value: "彩虹明镜",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "B",
          },
          {
            value: "彩虹明镜",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "B",
          },
        ],
      },
      {
        key: "形成",
        values: [
          {
            value: "古时浑然天成",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "水源",
        values: [
          {
            value: "桃花涧、中峰涧",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "湖中景观",
        values: [
          {
            value: "石质观音菩萨",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "滴水观音像",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "湖心建筑",
        values: [
          {
            value: "彩虹亭",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "桥梁形制",
        values: [
          {
            value: "彩虹般的曲桥",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "水质",
        values: [
          {
            value: "澄澈",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "景观",
        values: [
          {
            value: "四周红叶倒映于内",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "得名由来",
        values: [
          {
            value: "周边的树倒映在湖中，如镜子一般",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "乾隆皇帝赐名",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
          {
            value: "清高宗赐名曰明镜",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "位置",
        values: [
          {
            value: "进入栖霞寺的第一景",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "寺门右",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "中峰北麓，西峰南麓两水之水",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "栖霞寺前虎山和龙山之间",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "寺前虎山和龙山之间",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
          {
            value: "栖霞寺大门西面",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "开凿者",
        values: [
          {
            value: "两江总督尹继善",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "景区地位",
        values: [
          {
            value: "栖霞十景之一",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "放生动物",
        values: [
          {
            value: "乌龟啊、金鱼",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "饲养动物",
        values: [
          {
            value: "黑天鹅",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "建成年代",
        values: [
          {
            value: "1757年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "占地面积",
        values: [
          {
            value: "3000",
            unit: "平米",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "题名",
        values: [
          {
            value: "茗山法师题名",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "面积",
        values: [
          {
            value: "20",
            unit: "亩",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "3000",
            unit: "平方米",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
          {
            value: "3000",
            unit: "平方米",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "湖水澄澈，光鉴照人",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "湖心建有六角亭，九曲桥状若彩虹",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "湖中有湖心亭，并有九曲桥与岸相连",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "始建年代",
        values: [
          {
            value: "清乾隆二十二年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "清乾隆年间",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "观赏效果",
        values: [
          {
            value: "最佳",
            source: "https://news.qq.com/rain/a/20251127A074O900",
            credibility: "C",
          },
        ],
      },
      {
        key: "观赏区域",
        values: [
          {
            value: "彩虹明镜",
            source: "https://news.qq.com/rain/a/20251127A074O900",
            credibility: "C",
          },
        ],
      },
      {
        key: "打卡线路",
        values: [
          {
            value: "精华打卡线",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
          {
            value: "进阶挑战线",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
          {
            value: "沉浸式徒步线",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
        ],
      },
      {
        key: "花灯",
        values: [
          {
            value: "主题灯组从古镇外御龙桥一直布置到明镜湖",
            source:
              "https://www.xiaohongshu.com/explore/699147c1000000000a03ca93",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "乾隆第三次下江南",
        what: "两江总督尹继善开凿成湖迎接乾隆",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "1757年",
        what: "建成年代",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
      {
        date: "清高宗",
        what: "赐湖名曰明镜",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
      },
      {
        date: "清乾隆二十二年",
        what: "乾隆皇帝南巡驻跸期间兴建",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "太平天国时",
        what: "原桥被毁",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "民国10年",
        what: "由栖霞寺住持若舜重建",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "1981年6月",
        what: "突然地层塌陷桥断水枯",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "1990年",
        what: "经南京市人民政府批准复建，于当年9月竣工",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "1964年",
        what: "改建桥亭",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "1979年",
        what: "改建桥亭",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "清乾隆年间",
        what: "明镜湖兴建",
        source: "https://m.nj.bendibao.com/tour/140483.shtm",
      },
    ],
    audio: [
      {
        title: "2026年3月8日栖霞山风景区明镜湖天女散花",
        url: "https://www.bilibili.com/video/BV1jGNgzXEkp",
        platform: "B站",
        author: "昵称小陆",
        kind: "video",
        minutes: 5,
        plays: 31,
      },
    ],
    images: [
      {
        url: "https://qixia.winnielyu.com/img/commons/c3237525640.jpg",
        title: "Lake at Qixia Mountain",
        desc: "​栖霞山风景区里的湖，大致坐标位于OSM地图32.15400,118.95153处（毘卢宝殿西侧的湖）。",
        author: "Leiem；底图 © OpenStreetMap 贡献者",
        license: "CC0",
        licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        source:
          "https://commons.wikimedia.org/wiki/File:Lake_at_Qixia_Mountain.jpg",
        historic: false,
      },
    ],
    credibility: "C",
  },
  {
    referenceCode: "A7",
    referenceName: "桃花湖",
    name: "桃花湖",
    kbCardId: "place-320113-taohuahu",
    kbTitle: "桃花湖",
    aliases: ["桃花涧"],
    summary:
      "桃花湖景区在桃花涧中游建成，为纪念李香君，同时为景区扩容、改善山林小气候；桃花涧自明代以来逢春桃花争妍，久负盛名。",
    history:
      "桃花湖一说开凿于明朝，一说于2004年被发现。[7][13][14] 一说其建设目的是为了景区扩容和改善山林小气候。[3]",
    historySources: [
      "[1] 位置（C）：https://m.maigoo.com/citiao/113006.html",
      "[3] 建设目的（C）：https://m.maigoo.com/citiao/113006.html",
      "[4] 景观特色（C）：https://m.maigoo.com/citiao/113006.html",
      "[5] 评价（C）：https://m.maigoo.com/citiao/113006.html",
      "[6] 所属景区（C）：https://m.maigoo.com/citiao/113006.html",
      "[7] 发现时间（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[13] 大事记 2004年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[14] 大事记 明朝（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
    ],
    keyFacts: [
      {
        key: "位置",
        values: [
          {
            value: "桃花涧中游",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "桃花涧中",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "纪念人物",
        values: [
          {
            value: "李香君",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "建设目的",
        values: [
          {
            value: "景区扩容，改善山林小气候",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "景观特色",
        values: [
          {
            value: "逢春桃花争妍",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "评价",
        values: [
          {
            value: "游览观光的绝妙之处",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "所属景区",
        values: [
          {
            value: "栖霞山风景区",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "发现时间",
        values: [
          {
            value: "2004年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "著名景点",
        values: [
          {
            value: "金陵二十四泉",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "开凿年代",
        values: [
          {
            value: "明朝",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "题诗",
        values: [
          {
            value: "提珍珠泉诗",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "相对位置",
        values: [
          {
            value: "李香君墓",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "明代以来",
        what: "桃花涧逢春桃花争妍，久负盛名",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "明末清初",
        what: "李香君在此隐居，死后葬于桃花涧畔丛林",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "2004年",
        what: "桃花湖被发现",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
      {
        date: "明朝",
        what: "桃花湖开凿",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
    ],
    audio: [],
    images: [],
    credibility: "C",
  },
  {
    referenceCode: "A8",
    referenceName: "卧云亭",
    name: "卧云亭",
    kbCardId: "place-320113-woyunting",
    kbTitle: "卧云亭",
    aliases: [],
    summary:
      "栖霞山风景区管理处为再现明代“卧云”景观，在卧云景区建山道、广植名贵花草树木，恢复了该景点——卧云亭。",
    history:
      "卧云亭位于栖霞山的卧云景区。[1] 一说其景观来源于明代的'卧云'景观。[3] 据称通过建山道和广植名贵花草树木等措施恢复。[2]",
    historySources: [
      "[1] 位置（C）：https://m.maigoo.com/citiao/113006.html",
      "[2] 恢复措施（C）：https://m.maigoo.com/citiao/113006.html",
      "[3] 景观来源（C）：https://m.maigoo.com/citiao/113006.html",
    ],
    keyFacts: [
      {
        key: "位置",
        values: [
          {
            value: "卧云景区",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "恢复措施",
        values: [
          {
            value: "建山道，广植名贵花草树木",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "景观来源",
        values: [
          {
            value: "明代“卧云”景观",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
    ],
    timeline: [],
    audio: [],
    images: [],
    credibility: "C",
  },
  {
    referenceCode: "B2",
    referenceName: "钟楼",
    name: "钟楼",
    kbCardId: "place-320113-zhonggulou",
    kbTitle: "钟鼓楼",
    aliases: ["钟楼", "鼓楼"],
    summary: "南京鼓楼位于南京栖霞山。",
    history:
      "钟鼓楼建成于2000年前后。[1][5] 据导游讲，2000年前后是钟鼓楼建成的重要时间节点。[5]",
    historySources: [
      "[1] 建成年代（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[5] 大事记 2000年前后（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
    ],
    keyFacts: [
      {
        key: "建成年代",
        values: [
          {
            value: "2000年前后",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "游玩时长",
        values: [
          {
            value: "0.5",
            unit: "小时",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "大鼓重量",
        values: [
          {
            value: "400",
            unit: "公斤",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "叩钟次数",
        values: [
          {
            value: "一百零八响",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "2000年前后",
        what: "钟鼓楼建成",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
    ],
    audio: [],
    images: [],
    credibility: "C",
  },
  {
    referenceCode: "B3",
    referenceName: "鼓楼",
    name: "鼓楼",
    kbCardId: "place-320113-zhonggulou",
    kbTitle: "钟鼓楼",
    aliases: ["钟楼", "鼓楼"],
    summary: "南京鼓楼位于南京栖霞山。",
    history:
      "钟鼓楼建成于2000年前后。[1][5] 据导游讲，2000年前后是钟鼓楼建成的重要时间节点。[5]",
    historySources: [
      "[1] 建成年代（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[5] 大事记 2000年前后（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
    ],
    keyFacts: [
      {
        key: "建成年代",
        values: [
          {
            value: "2000年前后",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "游玩时长",
        values: [
          {
            value: "0.5",
            unit: "小时",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "大鼓重量",
        values: [
          {
            value: "400",
            unit: "公斤",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "叩钟次数",
        values: [
          {
            value: "一百零八响",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "2000年前后",
        what: "钟鼓楼建成",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
    ],
    audio: [],
    images: [],
    credibility: "C",
  },
  {
    referenceCode: "B4",
    referenceName: "明征君碑",
    name: "明征君碑",
    kbCardId: "place-320113-mingzhengjunbei",
    kbTitle: "明征君碑",
    aliases: ["征君碑"],
    summary: "明征君碑于2001年被列为第五批全国重点文物保护单位。",
    history:
      "此碑为纪念南齐隐士明僧绍舍宅建寺而立，立碑对象是明僧绍。[14][27][29] 碑文由唐高宗李治撰文，高正臣书写。[12][13][19][38] 一说碑始建或立于唐朝上元三年（676年），一说建于唐代。[8][9][20][28][33][36][39][44]",
    historySources: [
      "[5] 位置（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[6] 位置（C）：https://zh.wikipedia.org/zh-cn/明征君碑",
      "[8] 始建年代（B）：https://zh.wikipedia.org/zh-cn/明征君碑",
      "[9] 始建年代（C）：https://m.maigoo.com/citiao/113006.html",
      "[12] 碑文起草者（C）：https://zh.wikipedia.org/zh-cn/明征君碑",
      "[13] 书写者（C）：https://zh.wikipedia.org/zh-cn/明征君碑",
      "[14] 建立缘由（C）：https://m.maigoo.com/citiao/113006.html",
      "[15] 高度（C）：https://m.maigoo.com/citiao/113006.html",
      "[16] 宽度（C）：https://m.maigoo.com/citiao/113006.html",
      "[17] 厚度（C）：https://m.maigoo.com/citiao/113006.html",
      "[18] 形制（C）：https://m.maigoo.com/citiao/113006.html",
      "[19] 撰文（C）：https://m.maigoo.com/citiao/113006.html",
      "[20] 始建年代（B）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[21] 材质（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[22] 形制（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[25] 碑额文字（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[27] 立碑对象（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[28] 建成年代（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[29] 纪念人物（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[33] 大事记 唐朝上元三年（676年）（C）：https://zh.wikipedia.org/zh-cn/明征君碑",
      "[36] 大事记 公元676年（C）：https://m.maigoo.com/citiao/113006.html",
      "[38] 大事记 唐（C）：https://m.maigoo.com/citiao/113006.html",
      "[39] 大事记 唐上元三年（676）（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[40] 大事记 唐（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[44] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[45] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[46] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
    ],
    keyFacts: [
      {
        key: "文物保护级别",
        values: [
          {
            value: "全国重点文物保护单位",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "B",
          },
          {
            value: "全国重点文物保护单位",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "B",
          },
          {
            value: "国家级文物保护单位",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "B",
          },
          {
            value: "国家文物保护单位，国宝级文物",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "国家级文物保护单位",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "批次",
        values: [
          {
            value: "第五批",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
        ],
      },
      {
        key: "位置",
        values: [
          {
            value: "寺旁",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "江苏省南京市栖霞寺山门前西侧的碑亭内",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
          {
            value: "栖霞寺",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "弥勒殿的右侧一碑亭内",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "弥勒殿右侧",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "栖霞寺前右侧御碑亭内",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "寺前右侧御碑亭内",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "全名",
        values: [
          {
            value: "摄山栖霞寺明征君之碑",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
        ],
      },
      {
        key: "始建年代",
        values: [
          {
            value: "唐朝上元三年（676年）",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "B",
          },
          {
            value: "676",
            unit: "年",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "唐上元三年（676）",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "B",
          },
          {
            value: "上元三年岁在丙子立",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "唐上元三年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "唐代",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "分类",
        values: [
          {
            value: "石窟寺及石刻",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
        ],
      },
      {
        key: "编号",
        values: [
          {
            value: "5-447",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
        ],
      },
      {
        key: "碑文起草者",
        values: [
          {
            value: "高宗",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
        ],
      },
      {
        key: "书写者",
        values: [
          {
            value: "高正臣",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
        ],
      },
      {
        key: "建立缘由",
        values: [
          {
            value: "纪念南齐隐士明僧绍舍宅建寺",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "高度",
        values: [
          {
            value: "2.73",
            unit: "米",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "丈余",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "2.74",
            unit: "米",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
        ],
      },
      {
        key: "宽度",
        values: [
          {
            value: "1.25",
            unit: "米",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "1.31",
            unit: "米",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
        ],
      },
      {
        key: "厚度",
        values: [
          {
            value: "0.36",
            unit: "米",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "六龙拱额，丹凤朝阳图案",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "碑下是赑屃，碑额是负屃",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "碑阴有栖霞二大字",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "系梅花石",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "撰文",
        values: [
          {
            value: "唐高宗李治",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "材质",
        values: [
          {
            value: "栖霞灰岩",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "化石年代",
        values: [
          {
            value: "2.8",
            unit: "亿年前",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "碑额文字",
        values: [
          {
            value: "明征君碑",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "碑文内容",
        values: [
          {
            value: "明僧绍他舍宅为寺",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "立碑对象",
        values: [
          {
            value: "明僧绍",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "建成年代",
        values: [
          {
            value: "唐代",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "纪念人物",
        values: [
          {
            value: "明僧绍",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "文字数量",
        values: [
          {
            value: "2374",
            unit: "个",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "海百合数量",
        values: [
          {
            value: "22000",
            unit: "个",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "作者",
        values: [
          {
            value: "唐高宗御制",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "书法",
        values: [
          {
            value: "唐高正臣行书",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "篆额",
        values: [
          {
            value: "王知敬篆",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "别名",
        values: [
          {
            value: "梅花石",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "碑石质地",
        values: [
          {
            value: "致密坚硬",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "碑石特性",
        values: [
          {
            value: "不易风化剥蚀",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "斑纹特征",
        values: [
          {
            value: "上有许多豆粒状白色斑纹",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "斑纹外观",
        values: [
          {
            value: "酷似含苞待放的梅花",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "碑石材质",
        values: [
          {
            value: "栖霞灰岩",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "采石地点",
        values: [
          {
            value: "采自栖霞山上",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "碑文字数",
        values: [
          {
            value: "2376",
            unit: "字",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "行数",
        values: [
          {
            value: "33",
            unit: "行",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "每行字数",
        values: [
          {
            value: "74",
            unit: "字",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "书体",
        values: [
          {
            value: "行书",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "化石数量",
        values: [
          {
            value: "22000",
            unit: "个",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "2001",
        what: "被列为第五批全国重点文物保护单位",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "唐朝上元三年（676年）",
        what: "明征君碑建立",
        source: "https://zh.wikipedia.org/zh-cn/明征君碑",
      },
      {
        date: "1982年",
        what: "列为江苏省文物保护单位",
        source: "https://zh.wikipedia.org/zh-cn/明征君碑",
      },
      {
        date: "2001年",
        what: "与栖霞寺千佛崖石窟一并列为全国重点文物保护单位",
        source: "https://zh.wikipedia.org/zh-cn/明征君碑",
      },
      {
        date: "公元676年",
        what: "明征君碑建立",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "南齐",
        what: "明僧绍舍宅建寺",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "唐",
        what: "唐高宗李治撰文，高正臣书丹",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "唐上元三年（676）",
        what: "明征君碑立",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "唐",
        what: "唐高宗题碑阴“栖霞”二字",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "二零零一年",
        what: "晋升为国家文物保护单位",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "唐圣龙元年",
        what: "建此碑为明僧绍立碑",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "上元三年",
        what: "明征君碑立",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
      },
      {
        date: "唐高宗",
        what: "制明征君碑",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "上元三年",
        what: "建明征君碑",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "唐高宗",
        what: "御制明征君碑",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
      },
      {
        date: "唐上元三年",
        what: "明征君碑建立",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "1982年",
        what: "被列为江苏省级文物保护单位",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "2001年",
        what: "升格为国家级文物保护单位",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "唐高宗上元三年",
        what: "明征君碑建立",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "唐高宗上元三年",
        what: "明征君碑建立",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
    ],
    audio: [],
    images: [
      {
        url: "https://qixia.winnielyu.com/img/commons/c0f0fb273cd.jpg",
        title: "MingZhengJun Monument",
        desc: "MingzhengJun monument, Tang Dynasty",
        author: "Farm",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:MingZhengJun_Monument.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c891442fa90.jpg",
        title: "明征君碑文保碑20230219",
        desc: "​全国重点文物保护单位明征君碑文保碑",
        author: "西安兵马俑",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%98%8E%E5%BE%81%E5%90%9B%E7%A2%91%E6%96%87%E4%BF%9D%E7%A2%9120230219.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c1cab8bc2cc.jpg",
        title: "栖霞山明征君碑, 2025-10-25 01",
        desc: "​栖霞山明征君碑",
        author: "Siyuwj",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%B1%B1%E6%98%8E%E5%BE%81%E5%90%9B%E7%A2%91,_2025-10-25_01.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/ce18d3e37f9.jpg",
        title: "栖霞山明征君碑, 2025-10-25 02",
        desc: "​栖霞山明征君碑",
        author: "Siyuwj",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%B1%B1%E6%98%8E%E5%BE%81%E5%90%9B%E7%A2%91,_2025-10-25_02.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/ce740df58d6.jpg",
        title: "栖霞山明征君碑, 2025-10-25 03",
        desc: "​栖霞山明征君碑",
        author: "Siyuwj",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%B1%B1%E6%98%8E%E5%BE%81%E5%90%9B%E7%A2%91,_2025-10-25_03.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c188698c247.jpg",
        title: "栖霞山明征君碑, 2025-10-25 04",
        desc: "​栖霞山明征君碑",
        author: "Siyuwj",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%B1%B1%E6%98%8E%E5%BE%81%E5%90%9B%E7%A2%91,_2025-10-25_04.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/ce73e7be4f3.jpg",
        title: "栖霞山明征君碑, 2025-10-25 05",
        desc: "​栖霞山明征君碑",
        author: "Siyuwj",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%B1%B1%E6%98%8E%E5%BE%81%E5%90%9B%E7%A2%91,_2025-10-25_05.jpg",
        historic: false,
      },
    ],
    credibility: "C",
  },
  {
    referenceCode: "B5",
    referenceName: "栖霞古寺",
    name: "栖霞古寺",
    kbCardId: "place-320113-qixiasi",
    kbTitle: "栖霞寺",
    aliases: ["栖霞精舍", "栖霞古寺"],
    summary: "原文将栖霞寺列为栖霞山景点之一。",
    history:
      "栖霞寺始建于南北朝齐永明七年（489年），一说始建年代为498年。[7][8][27][43] 据导游讲，南朝隐士明僧绍（号栖霞居士）舍家宅为寺，法度禅师以其号命名为栖霞精舍。[6][13][14][36][37][47] 历史上多次重建，包括明洪武二十五年（1392年）和1919年宗仰复建。[9][20][32][34][42]",
    historySources: [
      "[6] 得名由来（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[7] 始建年代（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[8] 始建年代（C）：https://m.maigoo.com/citiao/113006.html",
      "[9] 重建年代（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[13] 创建者（C）：https://zh.wikipedia.org/zh-cn/明征君碑",
      "[14] 创建方式（C）：https://zh.wikipedia.org/zh-cn/明征君碑",
      "[15] 明征君碑位置（C）：https://zh.wikipedia.org/zh-cn/明征君碑",
      "[20] 重建年代（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[23] 匾额题写者（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[27] 始建年代（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[30] 石刻碑刻数量（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[32] 大事记 明洪武二十五年（1392）（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[34] 大事记 民国八年（1919）（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[36] 大事记 南朝（C）：https://zh.wikipedia.org/zh-cn/明征君碑",
      "[37] 大事记 489年（C）：https://m.maigoo.com/citiao/113006.html",
      "[42] 大事记 1919年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[43] 大事记 498年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[44] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[47] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[50] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
    ],
    keyFacts: [
      {
        key: "位置",
        values: [
          {
            value: "中国江苏省南京市栖霞区栖霞山西麓",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "南京市栖霞山",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
          {
            value: "栖霞山主峰——凤翔峰的西麓",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "摄山之南",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "南京栖霞山",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "B",
          },
          {
            value: "南京栖霞山",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "B",
          },
          {
            value: "栖霞山中峰西麓",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "别名",
        values: [
          {
            value: "栖霞精舍",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "B",
          },
          {
            value: "栖霞精舍",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "B",
          },
          {
            value: "栖霞精舍",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "B",
          },
          {
            value: "栖霞精舍",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "B",
          },
          {
            value: "栖霞古寺",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
          {
            value: "栖霞精舍",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "得名由来",
        values: [
          {
            value: "依明僧绍表字“栖霞”",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "因栖霞寺名山",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "栖霞寺以山得名",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "明僧绍号栖霞",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "以明僧绍之号命名",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "始建年代",
        values: [
          {
            value: "南北朝齐永明七年",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "489",
            unit: "年",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "498",
            unit: "年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "齐永明七年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "公元四八四年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "齐武帝永明元年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "齐武帝永明七年（489，一说元年）",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "南齐永明七年（489年）",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
        ],
      },
      {
        key: "重建年代",
        values: [
          {
            value: "明洪武二十五年",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "1919",
            unit: "年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "光绪年间",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "文物保护级别",
        values: [
          {
            value: "江苏省文物保护单位",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "省级文物保护单位",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "国家和省级重点文物保护单位",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "面积",
        values: [
          {
            value: "120",
            unit: "亩",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
        ],
      },
      {
        key: "创建者",
        values: [
          {
            value: "明僧绍",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
        ],
      },
      {
        key: "创建方式",
        values: [
          {
            value: "舍家宅",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
        ],
      },
      {
        key: "明征君碑位置",
        values: [
          {
            value: "栖霞寺山门前西侧",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
        ],
      },
      {
        key: "历史",
        values: [
          {
            value: "1500",
            unit: "年",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "地位",
        values: [
          {
            value: "中国四大名刹之一",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "宗派地位",
        values: [
          {
            value: "三论宗祖庭",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "并称",
        values: [
          {
            value: "四大丛林",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "历史长度",
        values: [
          {
            value: "1500",
            unit: "多年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "宗派",
        values: [
          {
            value: "三论宗",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "匾额题写者",
        values: [
          {
            value: "乾隆",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "驻跸次数",
        values: [
          {
            value: "5",
            unit: "次",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "被毁次数",
        values: [
          {
            value: "3",
            unit: "次",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "3",
            unit: "扇门",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "三面环山",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "占地面积",
        values: [
          {
            value: "40多",
            unit: "亩",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "殿宇数量",
        values: [
          {
            value: "49",
            unit: "所",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "石刻碑刻数量",
        values: [
          {
            value: "100多",
            unit: "处",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "增建殿宇数量",
        values: [
          {
            value: "49",
            unit: "所",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "宗派发源地",
        values: [
          {
            value: "佛教“三论宗”的发源地",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "公交线路",
        values: [
          {
            value: "138路、194路、195路、196路、197路、326路、327路、332路",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
        ],
      },
      {
        key: "公交站点",
        values: [
          {
            value: "栖霞寺站",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
        ],
      },
      {
        key: "途经路线",
        values: [
          {
            value: "精华打卡线",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
        ],
      },
      {
        key: "入园时间",
        values: [
          {
            value: "古寺 16:00 停止入园，宜上午前往",
            source:
              "https://www.xiaohongshu.com/explore/6ab3a5e0000000001b01f18a",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "供应时间",
        values: [
          {
            value: "上午8点到下午3点半",
            source:
              "https://www.xiaohongshu.com/explore/692a9c8b000000001f00b916",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "开门时间",
        values: [
          {
            value: "8点开始",
            source:
              "https://www.xiaohongshu.com/explore/692a9c8b000000001f00b916",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "营业时间",
        values: [
          {
            value: "8:00-15:00",
            source:
              "https://www.xiaohongshu.com/explore/69521eb4000000001e0031d4",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "餐饮",
        values: [
          {
            value: "素菜馆",
            source:
              "https://www.xiaohongshu.com/explore/69f31f65000000001e00ec2c",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "枫叶",
        values: [
          {
            value: "11月底山上枫叶不红，栖霞寺前较红",
            source:
              "https://www.xiaohongshu.com/explore/69227629000000000d03a671",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "佛光时间",
        values: [
          {
            value: "每年11月22-25日15:15-15:45，持续约半小时",
            source:
              "https://www.xiaohongshu.com/explore/6921bc61000000001e02ae25",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "地点",
        values: [
          {
            value: "栖霞寺三圣殿内",
            source:
              "https://www.xiaohongshu.com/explore/6921bc61000000001e02ae25",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "光斑路径",
        values: [
          {
            value: "光斑由佛像右颊移动至眉心",
            source:
              "https://www.xiaohongshu.com/explore/6921bc61000000001e02ae25",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "地址",
        values: [
          {
            value: "南京市栖霞区栖霞街88号",
            source:
              "https://www.xiaohongshu.com/explore/6895b6d000000000220205c3",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "南北朝齐永明七年（489年）",
        what: "始建，原为明僧绍私宅",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "明洪武二十五年（1392）",
        what: "明太祖重建栖霞寺",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "咸丰三年七月初二日（1853年8月6日）",
        what: "太平军纵火焚毁栖霞寺",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "民国八年（1919）",
        what: "宗仰复建栖霞寺",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "1983年",
        what: "确定为汉族地区全国重点寺院",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "南朝",
        what: "明僧绍舍家宅创建栖霞寺",
        source: "https://zh.wikipedia.org/zh-cn/明征君碑",
      },
      {
        date: "489年",
        what: "明僧绍舍宅为寺，始称栖霞精舍",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "唐朝会昌年间",
        what: "发生法难",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "乾隆时期",
        what: "六下江南，五次住这里",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "太平军时期",
        what: "与清军发生战火",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "文化大革命",
        what: "寺院遭到破坏",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "1919年",
        what: "复建仿古建筑",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "498年",
        what: "始建",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
      {
        date: "唐高祖",
        what: "改栖霞寺为功德寺",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "哲宗元祐八年",
        what: "改赐为严因崇报禅院",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "明太祖洪武二十五年",
        what: "赐额栖霞寺",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "唐高祖",
        what: "敕改栖霞寺为功德寺",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
      },
      {
        date: "唐朝",
        what: "高祖改栖霞寺为功德寺",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
      },
      {
        date: "1930年",
        what: "栖霞寺进行整修",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
      },
      {
        date: "隋代",
        what: "舍利塔最早起于隋代",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
      },
      {
        date: "齐武帝永明元年",
        what: "明僧绍舍宅为寺",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "唐高宗上元三年",
        what: "建明征君碑",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "唐天宝十年",
        what: "鉴真大师逗留休整",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "齐武帝永明七年（489，一说元年）",
        what: "明僧绍舍宅为寺，建栖霞寺",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "南朝陈祯明元年（587）",
        what: "陈后主游栖霞寺，君臣唱和",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "南齐永明七年（489年）",
        what: "栖霞寺始建",
        source: "https://m.nj.bendibao.com/tour/140483.shtm",
      },
    ],
    audio: [
      {
        title: "南京-栖霞山 · 栖霞寺",
        url: "https://www.ximalaya.com/sound/22366065",
        platform: "喜马拉雅",
        author: "恋景旅行APP",
        kind: "audio-guide",
        minutes: 2.9,
        plays: 4614,
      },
      {
        title: "栖霞寺史话（专辑，2 集）",
        url: "https://www.ximalaya.com/album/20606421",
        platform: "喜马拉雅",
        author: "金陵锦瑟",
        kind: "lecture",
        plays: 891,
      },
      {
        title: "从栖霞山讲南京的半部历史 · 10 隐士舍宅为寺",
        url: "https://www.ximalaya.com/sound/440526501",
        platform: "喜马拉雅",
        author: "熹园稿谈",
        kind: "podcast",
        minutes: 15.2,
        plays: 117,
      },
      {
        title:
          "拒绝废话6分钟带你游南京栖霞寺，镇寺三宝#栖霞寺 #南京旅游 #寂然法师",
        url: "https://www.bilibili.com/video/BV1th4y157L5",
        platform: "B站",
        author: "南京张小品",
        kind: "video",
        minutes: 6.7,
        plays: 97204,
      },
      {
        title:
          "林叶脱红影，漫步栖霞寺 | 南京 栖霞山 栖霞寺 | 云散步 云旅行 步行POV | 漫游中国 4K60",
        url: "https://www.bilibili.com/video/BV1Bi4y1k77S",
        platform: "B站",
        author: "楚狂-漫游中国",
        kind: "video",
        minutes: 71.8,
        plays: 13813,
      },
      {
        title:
          "【糖叔】真实事件：被世人遗忘的高僧，不惜舍命、破戒，在南京鬼子手里救下了24000多人《栖霞寺1937》",
        url: "https://www.bilibili.com/video/BV1jd4y1y72J",
        platform: "B站",
        author: "糖叔不说剧",
        kind: "video",
        minutes: 11.2,
        plays: 1474432,
      },
      {
        title: "栖霞寺冬季佛光观赏时间",
        url: "https://www.xiaohongshu.com/explore/6921bc61000000001e02ae25",
        platform: "小红书",
        kind: "video",
      },
    ],
    images: [
      {
        url: "https://qixia.winnielyu.com/img/commons/cbbf2d77d0b.jpg",
        title: "20120302南京栖霞寺毗卢宝殿前院 - panoramio",
        desc: "20120302南京栖霞寺毗卢宝殿前院",
        author: "fish4fish",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:20120302%E5%8D%97%E4%BA%AC%E6%A0%96%E9%9C%9E%E5%AF%BA%E6%AF%97%E5%8D%A2%E5%AE%9D%E6%AE%BF%E5%89%8D%E9%99%A2_-_panoramio.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c03e1a7bdf3.jpg",
        title: "FangZhang Qixia Temple",
        desc: "Fangzhang of Qixia Temple, Nanjing, China",
        author: "Farm",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:FangZhang_Qixia_Temple.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c6e7b93fb0e.jpg",
        title: "Pilu Hall",
        desc: "The main hall of the Qixia Temple in Nanjing, China.",
        author: "Bt4wang",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source: "https://commons.wikimedia.org/wiki/File:Pilu_Hall.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c4175afe19e.jpg",
        title: "Pilu Hall Qixia Temple 2018",
        desc: "Pilu Hall of Qixia Temple, Nanjing",
        author: "ScareCriterion12",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:Pilu_Hall_Qixia_Temple_2018.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c583cd28d37.jpg",
        title: "Qixia Mountain Autumn",
        desc: "Autumn maple leaves in Qixia Mountain Temple in Nanjing, C…",
        author: "Haha169",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:Qixia_Mountain_Autumn.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c2036b1a314.jpg",
        title: "Qixia Temple",
        desc: "Qixia Temple",
        author: "我乃野云鹤",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source: "https://commons.wikimedia.org/wiki/File:Qixia_Temple.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/cf26e8a189b.jpg",
        title: "Qixiachansi",
        desc: "​棲霞禅寺。",
        author: "Leiem；底图 © OpenStreetMap 贡献者",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source: "https://commons.wikimedia.org/wiki/File:Qixiachansi.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c8886998b38.jpg",
        title: "Qixiasi00",
        desc: "栖霞寺 2004年5月29日撮影 撮影者:権作",
        author: "Px820",
        license: "CC BY-SA 3.0",
        licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
        source: "https://commons.wikimedia.org/wiki/File:Qixiasi00.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c1ac656e8e6.jpg",
        title: "南京栖霞寺-谢阁兰-1917 01",
        desc: "​南京栖霞寺",
        author: "Victor Segalen",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:%E5%8D%97%E4%BA%AC%E6%A0%96%E9%9C%9E%E5%AF%BA-%E8%B0%A2%E9%98%81%E5%85%B0-1917_01.jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c52f7219909.jpg",
        title: "南京栖霞寺-谢阁兰-1917 02",
        desc: "​南京栖霞寺",
        author: "Victor Segalen",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:%E5%8D%97%E4%BA%AC%E6%A0%96%E9%9C%9E%E5%AF%BA-%E8%B0%A2%E9%98%81%E5%85%B0-1917_02.jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/cb10ab7852e.jpg",
        title: "南京栖霞寺-谢阁兰-1917 03",
        desc: "​南京栖霞寺",
        author: "Victor Segalen",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:%E5%8D%97%E4%BA%AC%E6%A0%96%E9%9C%9E%E5%AF%BA-%E8%B0%A2%E9%98%81%E5%85%B0-1917_03.jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c5d47a14e87.jpg",
        title: "南京栖霞寺-谢阁兰-1917 04",
        desc: "​南京栖霞寺",
        author: "Victor Segalen",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:%E5%8D%97%E4%BA%AC%E6%A0%96%E9%9C%9E%E5%AF%BA-%E8%B0%A2%E9%98%81%E5%85%B0-1917_04.jpg",
        historic: true,
      },
    ],
    credibility: "C",
  },
  {
    referenceCode: "B6",
    referenceName: "舍利塔",
    name: "舍利塔",
    kbCardId: "place-320113-shelita",
    kbTitle: "栖霞寺舍利塔",
    aliases: ["舍利塔", "隋塔"],
    summary: "栖霞山景点包括栖霞寺、千佛岩、舍利塔等。",
    history:
      "栖霞寺舍利塔一说始建于隋代隋文帝时期，具体年代有仁寿元年（601年）或仁寿二年（602年）等说法。[1][2][3][20][31][34][36][37][42][44][45][49][51] 据传隋文帝曾下令在全国八十三州建舍利塔，并以蒋州栖霞寺为首。[17][36][51] 现存石塔一说重建于五代南唐年间（937年），由高樾、林仁肇等人主持。[12][13][21][28][38][43][46][50][52]",
    historySources: [
      "[1] 始建年代（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[2] 始建年代（C）：https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      "[3] 始建年代（C）：https://m.maigoo.com/citiao/113006.html",
      "[4] 形制（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[5] 形制（C）：https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      "[6] 形制（C）：https://m.maigoo.com/citiao/113006.html",
      "[12] 重建年代（C）：https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      "[13] 重建年代（C）：https://m.maigoo.com/citiao/113006.html",
      "[14] 高度（C）：https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      "[15] 高度（C）：https://m.maigoo.com/citiao/113006.html",
      "[16] 层数（C）：https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      "[17] 隋文帝下令建塔数（C）：https://m.maigoo.com/citiao/113006.html",
      "[20] 始建年代（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[21] 重建年代（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[22] 层数（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[23] 形制（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[28] 重建年代（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[30] 内雕佛像数量（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[31] 始建年代（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[32] 高度（C）：https://www.yzwb.net/news/wy/202603/t20260311_330342.html",
      "[33] 层数（C）：https://www.yzwb.net/news/wy/202603/t20260311_330342.html",
      "[34] 大事记 隋代隋文帝时期（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[36] 大事记 隋文帝时期（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[37] 大事记 隋代仁寿二年（602年）（C）：https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      "[38] 大事记 五代南唐年间（C）：https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      "[42] 大事记 隋仁寿元年（601年）（C）：https://m.maigoo.com/citiao/113006.html",
      "[43] 大事记 南唐（C）：https://m.maigoo.com/citiao/113006.html",
      "[44] 大事记 隋（C）：https://m.maigoo.com/citiao/113006.html",
      "[45] 大事记 601年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[46] 大事记 937年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[49] 大事记 公元601年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[50] 大事记 937年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[51] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[52] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[53] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
    ],
    keyFacts: [
      {
        key: "始建年代",
        values: [
          {
            value: "隋代隋文帝时期",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "隋代仁寿二年（602年）",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "隋仁寿元年（601年）",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "601",
            unit: "年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "公元601年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "仁寿元年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "隋仁寿元年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "八角五层石塔",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "八角五层的密檐式舍利塔",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
            credibility: "C",
          },
          {
            value: "八面五级密檐式",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "B",
          },
          {
            value: "石灰岩",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "八面",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "覆钵式",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "八角形，上为密檐式五层",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
          {
            value: "八面五级密檐式",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
          {
            value: "佛教石塔",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "文物保护级别",
        values: [
          {
            value: "全国重点文物保护单位",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "B",
          },
          {
            value: "全国重点文物保护单位",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
            credibility: "B",
          },
          {
            value: "国家级文物保护单位",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "全国重点文物保护单位",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "B",
          },
          {
            value: "全国重点文物保护单位",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
          {
            value: "全国重点文物保护单位",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "位置",
        values: [
          {
            value: "寺内",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "江苏省南京市栖霞区栖霞街道的栖霞寺内",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
            credibility: "C",
          },
          {
            value: "蒋州栖霞寺",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "栖霞寺藏经楼之南",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "栖霞寺藏经楼南侧",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
          {
            value: "栖霞寺藏经楼南侧",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "B",
          },
          {
            value: "栖霞寺东",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "重建年代",
        values: [
          {
            value: "五代南唐年间",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
            credibility: "C",
          },
          {
            value: "南唐",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "937",
            unit: "年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "937年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
          {
            value: "南唐时",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "高度",
        values: [
          {
            value: "15",
            unit: "米",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "18.74",
            unit: "米",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "15",
            unit: "米",
            source: "https://www.yzwb.net/news/wy/202603/t20260311_330342.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "五丈余",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "18.04",
            unit: "米",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
        ],
      },
      {
        key: "层数",
        values: [
          {
            value: "5",
            unit: "层",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "7",
            unit: "层",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "5",
            unit: "层",
            source: "https://www.yzwb.net/news/wy/202603/t20260311_330342.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "7",
            unit: "级",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
        ],
      },
      {
        key: "隋文帝下令建塔数",
        values: [
          {
            value: "83",
            unit: "座",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "塔基",
        values: [
          {
            value: "八角须弥座式",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "别名",
        values: [
          {
            value: "隋舍利塔",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "舍利塔",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "B",
          },
          {
            value: "舍利塔",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "地位",
        values: [
          {
            value: "最早、最大",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "保护设施",
        values: [
          {
            value: "避雷针、围栏",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "结构",
        values: [
          {
            value: "木制",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "C",
            note: "小程序原文只有「木制 结构」四个字；现存塔是南唐石塔，这里可能指隋代最早的木塔，待核。",
          },
        ],
      },
      {
        key: "内雕佛像数量",
        values: [
          {
            value: "64尊",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "建造者",
        values: [
          {
            value: "隋文帝",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "材质",
        values: [
          {
            value: "石灰岩",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
            credibility: "C",
          },
          {
            value: "石灰岩和大理石",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "朝代",
        values: [
          {
            value: "五代时期",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "重建情况",
        values: [
          {
            value: "重建",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "建造年代",
        values: [
          {
            value: "梁思成考证为五代吴越王朝物",
            source:
              "https://www.xiaohongshu.com/explore/692aa939000000001b031e5f",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "隋代隋文帝时期",
        what: "建栖霞寺舍利塔，为八角五层石塔",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "1988年",
        what: "列入第三批全国重点文物保护单位",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "隋文帝时期",
        what: "于八十三州造舍利塔，立舍利塔诏以蒋州栖霞寺为首",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "隋代仁寿二年（602年）",
        what: "相传建塔",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      },
      {
        date: "五代南唐年间",
        what: "高樾、林仁肇重建该塔",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      },
      {
        date: "1929年",
        what: "重修并大致恢复原貌",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      },
      {
        date: "1988年",
        what: "列为全国重点文物保护单位",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      },
      {
        date: "1993年",
        what: "国家文物局拨款维修",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺舍利塔",
      },
      {
        date: "隋仁寿元年（601年）",
        what: "首建舍利塔",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "南唐",
        what: "改建为现今石塔",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "隋",
        what: "隋文帝遇神尼得舍利数百颗",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "601年",
        what: "始建舍利塔，原为木塔",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "937年",
        what: "现存石塔建成，共七层",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "民国时期",
        what: "为维护舍利塔加做钢筋",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "文革时期",
        what: "舍利塔遭人为砸坏",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "公元601年",
        what: "舍利塔始建于",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
      {
        date: "937年",
        what: "舍利塔重建",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
      {
        date: "仁寿元年",
        what: "隋文帝建舍利塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "南唐",
        what: "高越林仁肇修葺舍利塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "明万历十七年",
        what: "蜀西邑贾春守题名",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "民国",
        what: "何晓生修葺舍利塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
      },
      {
        date: "隋代",
        what: "最早起于隋代",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
      },
      {
        date: "唐朝武宗皇帝时",
        what: "毁坏了舍利塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
      },
      {
        date: "南唐",
        what: "重新修建了舍利塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
      },
      {
        date: "1903年至1931年",
        what: "维修舍利塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
      },
      {
        date: "1993年",
        what: "维修舍利塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiawenshi-2000.md",
      },
      {
        date: "隋仁寿元年",
        what: "建成木构舍利塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "唐会昌年间",
        what: "木塔毁坏",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "南唐时",
        what: "改建石塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "1988年",
        what: "列为全国重点文物保护单位",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "唐会昌年间",
        what: "木塔毁坏",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "光启三年",
        what: "改建为石质舍利塔",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "五代时期",
        what: "佛教石塔，是重建的",
        source: "https://m.nj.bendibao.com/tour/140483.shtm",
      },
    ],
    audio: [
      {
        title: "南京-栖霞山 · 舍利塔",
        url: "https://www.ximalaya.com/sound/22366064",
        platform: "喜马拉雅",
        author: "恋景旅行APP",
        kind: "audio-guide",
        minutes: 3.2,
        plays: 4005,
      },
      {
        title: "从栖霞山讲南京的半部历史 · 14 隋文帝的舍利塔",
        url: "https://www.ximalaya.com/sound/441109389",
        platform: "喜马拉雅",
        author: "熹园稿谈",
        kind: "podcast",
        minutes: 12.7,
        plays: 161,
      },
      {
        title: "南京栖霞山舍利塔",
        url: "https://www.bilibili.com/video/BV1f5jtzeELQ",
        platform: "B站",
        author: "云烟销夏墨无痕",
        kind: "video",
        minutes: 15.1,
        plays: 191,
      },
      {
        title:
          "【建筑学宋民国】孝堂山石祠、赵州桥、嵩岳寺塔、四门塔、栖霞寺舍利塔｜图解建筑史（20230303）",
        url: "https://www.bilibili.com/video/BV1js4y157i7",
        platform: "B站",
        author: "建筑学宋民国",
        kind: "lecture",
        minutes: 81.7,
        plays: 380,
      },
      {
        title:
          "栖霞山（2）：江南地区保存最为完好的一座隋代的舍利塔，更有六朝的千佛崖石窟！",
        url: "https://www.bilibili.com/video/BV1bQ4y1k79E",
        platform: "B站",
        author: "访古金陵汤益明",
        kind: "video",
        minutes: 11.9,
        plays: 2517,
      },
    ],
    images: [
      {
        url: "https://qixia.winnielyu.com/img/commons/c0ef4b0b834.jpg",
        title: "栖霞寺舍利塔20230219 01",
        desc: "​栖霞寺舍利塔",
        author: "西安兵马俑",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%AF%BA%E8%88%8D%E5%88%A9%E5%A1%9420230219_01.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c908e5b0d99.jpg",
        title: "栖霞寺舍利塔20230219 02",
        desc: "​栖霞寺舍利塔",
        author: "西安兵马俑",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%AF%BA%E8%88%8D%E5%88%A9%E5%A1%9420230219_02.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c3fceb258b3.jpg",
        title: "栖霞寺舍利塔20230219 03",
        desc: "​栖霞寺舍利塔",
        author: "西安兵马俑",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%AF%BA%E8%88%8D%E5%88%A9%E5%A1%9420230219_03.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/cb7ddc7c4b9.jpg",
        title: "栖霞寺舍利塔20230219 04",
        desc: "​栖霞寺舍利塔",
        author: "西安兵马俑",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%AF%BA%E8%88%8D%E5%88%A9%E5%A1%9420230219_04.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/ca74e2c3aa1.jpg",
        title: "栖霞寺舍利塔20230219 05",
        desc: "​栖霞寺舍利塔",
        author: "西安兵马俑",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%AF%BA%E8%88%8D%E5%88%A9%E5%A1%9420230219_05.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c0ef044080b.jpg",
        title: "舍利塔文保碑20230219",
        desc: "​全国重点文物保护单位舍利塔文保碑",
        author: "西安兵马俑",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E8%88%8D%E5%88%A9%E5%A1%94%E6%96%87%E4%BF%9D%E7%A2%9120230219.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/cb31ae80608.jpg",
        title: "Base of pagoda at Qixia Temple",
        desc: "base of the pagoda at Qixia Temple, Nanjing, China",
        author: "Farm",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:Base_of_pagoda_at_Qixia_Temple.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c9a2d5d4c27.jpg",
        title: "Figure1 of pagoda at Qixia Temple",
        desc: "pagoda at Qixia Temple, Nanjing, China",
        author: "Farm",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:Figure1_of_pagoda_at_Qixia_Temple.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c906cb34559.jpg",
        title: "Figure2 of pagoda at Qixia Temple",
        desc: "Pagoda at Qixia Temple, Nanjing, China",
        author: "Farm",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:Figure2_of_pagoda_at_Qixia_Temple.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/ce3ea852076.jpg",
        title: "SDIM1455",
        desc: "Pagoda at Qixia Temple, Nanjing, China",
        author: "Farm",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source: "https://commons.wikimedia.org/wiki/File:SDIM1455.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c247ea56718.jpg",
        title: '亜細亜大観 03 015 "舍利塔 （棲霞寺）"',
        desc: "舍利塔，日文旧画册图版",
        author: "Black Dragon Society",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:%E4%BA%9C%E7%B4%B0%E4%BA%9C%E5%A4%A7%E8%A6%B3_03_015_%22%E8%88%8D%E5%88%A9%E5%A1%94_%EF%BC%88%E6%A3%B2%E9%9C%9E%E5%AF%BA%EF%BC%89%22.jpg",
        historic: true,
      },
    ],
    credibility: "C",
  },
  {
    referenceCode: "B7",
    referenceName: "千佛岩",
    name: "千佛岩",
    kbCardId: "place-320113-qianfoyan",
    kbTitle: "千佛岩",
    aliases: ["千佛崖", "千佛岭", "千佛岩造像"],
    summary: "千佛岩是栖霞山的景点之一。",
    history:
      "千佛岩一说始凿于南齐永明七年（公元489年），一说始建年代为489-511年或南齐永明二年（公元484年）。[2][3][26][27] 据导游讲，其来历是明僧绍和法度禅师在崖壁下读《无量寿经》时见佛光后决定凿佛龛，后由明仲璋与法度禅师续建，齐梁王公贵族亦参与开凿。[36] 建造一说历时22年，完成于511年。[10][31]",
    historySources: [
      "[2] 始建年代（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[3] 始建年代（C）：https://m.maigoo.com/citiao/113006.html",
      "[4] 造像数量（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[10] 历时（C）：https://m.maigoo.com/citiao/113006.html",
      "[11] 石窟数量（C）：https://m.maigoo.com/citiao/113006.html",
      "[12] 造像数量（C）：https://m.maigoo.com/citiao/113006.html",
      "[13] 题刻数量（C）：https://m.maigoo.com/citiao/113006.html",
      "[14] 最早题刻年代（C）：https://m.maigoo.com/citiao/113006.html",
      "[15] 形制（C）：https://m.maigoo.com/citiao/113006.html",
      "[17] 石窟数量（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[18] 造像数量（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[22] 附近卫生间（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[23] 石窟数量（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[24] 造像数量（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[26] 始建年代（C）：https://www.yzwb.net/news/jiangsu/nanjing/202603/t20260315_331790.html",
      "[27] 大事记 南齐永明七年（公元489年）（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[31] 大事记 489-511（C）：https://m.maigoo.com/citiao/113006.html",
      "[32] 大事记 中大通二年（C）：https://m.maigoo.com/citiao/113006.html",
      "[33] 大事记 北宋（C）：https://m.maigoo.com/citiao/113006.html",
      "[36] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[37] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[38] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[39] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[40] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
    ],
    keyFacts: [
      {
        key: "名称",
        values: [
          {
            value: "千佛岩",
            source: "https://zh.wikipedia.org/zh-cn/栖霞山",
            credibility: "C",
          },
        ],
      },
      {
        key: "始建年代",
        values: [
          {
            value: "南齐永明七年（公元489年）",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "489-511",
            unit: "年",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "南齐永明二年（公元484年）",
            source:
              "https://www.yzwb.net/news/jiangsu/nanjing/202603/t20260315_331790.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "南北朝时期",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "造像数量",
        values: [
          {
            value: "515",
            unit: "尊",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "520",
            unit: "尊",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "551",
            unit: "尊",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "532",
            unit: "尊",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "515",
            unit: "尊",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "515",
            unit: "尊",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "520",
            unit: "尊",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "现存佛像515尊、佛龛294个",
            source:
              "https://www.xiaohongshu.com/explore/6895b6d000000000220205c3",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "位置",
        values: [
          {
            value: "寺后",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "中峰",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "自栖霞寺藏经楼之左侧起，至纱帽峰之东止",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "栖霞寺东北纱帽峰的山崖上",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
          {
            value: "栖霞寺东北纱帽峰的山崖上",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "B",
          },
          {
            value: "凤翔峰西南麓，栖霞寺旁边",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "文物保护级别",
        values: [
          {
            value: "第五批全国重点文物保护单位",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "全国重点文物保护单位",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
          {
            value: "江苏省文物保护单位",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "国家级文物保护单位",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "壁画发现时间",
        values: [
          {
            value: "2000",
            unit: "年",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
        ],
      },
      {
        key: "别名",
        values: [
          {
            value: "千佛崖石窟",
            source: "https://zh.wikipedia.org/zh-cn/明征君碑",
            credibility: "C",
          },
          {
            value: "江南云冈",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "千佛岭",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "B",
          },
          {
            value: "千佛崖",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "B",
          },
          {
            value: "万佛崖",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "千佛岭",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "B",
          },
          {
            value: "千佛岭",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "B",
          },
          {
            value: "千佛崖",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "历时",
        values: [
          {
            value: "22",
            unit: "年",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "石窟数量",
        values: [
          {
            value: "250",
            unit: "个",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "252",
            unit: "窟",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "254",
            unit: "个",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "294",
            unit: "座",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "294",
            unit: "座",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
          {
            value: "250",
            unit: "个",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
            note: "来源数字不一致，见同名条目",
          },
        ],
      },
      {
        key: "题刻数量",
        values: [
          {
            value: "数十",
            unit: "款",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "最早题刻年代",
        values: [
          {
            value: "中大通二年",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "有立有坐，大小各异",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "齐时随石势凿成千佛",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "三圣殿（又名无量殿）",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "石窟佛龛平面多马蹄形，单室无前壁，穹窿顶",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
          {
            value: "洞顶的两组飞天为橙色，线条清晰可辨",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
          {
            value: "中间佛像头顶的火焰隐约可见",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "称号",
        values: [
          {
            value: "江南云岗",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "中国所发现的最东部的 “敦煌遗迹”",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "比龙门石窟早",
        values: [
          {
            value: "17",
            unit: "年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "比云冈石窟晚",
        values: [
          {
            value: "31",
            unit: "年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "附近卫生间",
        values: [
          {
            value: "千佛崖卫生间（9:00-17:00）",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "窟区全长",
        values: [
          {
            value: "约200",
            unit: "米",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "环境",
        values: [
          {
            value: "下临峻绝，松桧交荫",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "龛号",
        values: [
          {
            value: "102",
            unit: "号",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "102 号龛佛像数量",
        values: [
          {
            value: "5",
            unit: "座",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "看点",
        values: [
          {
            value: "六朝时期开凿的千佛岩石窟",
            source: "https://www.bilibili.com/video/BV1bQ4y1k79E",
            credibility: "C",
            note: "来自B站，游客个人经验",
          },
          {
            value: "千佛崖石窟内藏有一对飞天壁画",
            source: "https://www.bilibili.com/video/BV1WME76iExM",
            credibility: "C",
            note: "来自B站，游客个人经验",
          },
        ],
      },
      {
        key: "别称",
        values: [
          {
            value: "千佛崖石窟有“江南小云冈”之称",
            source: "https://www.bilibili.com/video/BV1WME76iExM",
            credibility: "C",
            note: "来自B站，游客个人经验",
          },
        ],
      },
      {
        key: "修缮",
        values: [
          {
            value: "千佛崖正在修缮，可绕行至后方纱帽峰看石窟",
            source:
              "https://www.xiaohongshu.com/explore/6a3f5a10000000001003d945",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "造像现状",
        values: [
          {
            value: "部分佛像头部为后补���佛身仍为原物",
            source:
              "https://www.xiaohongshu.com/explore/6a3f5a10000000001003d945",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "开凿年代",
        values: [
          {
            value: "南朝齐永明二年始凿",
            source:
              "https://www.xiaohongshu.com/explore/6895b6d000000000220205c3",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "历史地位",
        values: [
          {
            value: "比龙门石窟早17年，被誉为“江南云冈”",
            source:
              "https://www.xiaohongshu.com/explore/6895b6d000000000220205c3",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "南齐永明七年（公元489年）",
        what: "千佛崖石窟始凿",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "2001年",
        what: "千佛崖石窟及明征君碑被列为第五批全国重点文物保护单位",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "2000年",
        what: "栖霞飞天壁画被发现",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "2001年",
        what: "千佛崖石窟与明征君碑一并列为全国重点文物保护单位",
        source: "https://zh.wikipedia.org/zh-cn/明征君碑",
      },
      {
        date: "489-511",
        what: "千佛岩建造，历时22年",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "中大通二年",
        what: "出现最早名人题刻",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "北宋",
        what: "题刻最多",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "隋代",
        what: "有壁画栖霞飞天",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
      {
        date: "齐",
        what: "随石势凿成千佛",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
      },
      {
        date: "梁武帝大同二年",
        what: "齐文惠太子和诸王等凿千佛岩",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "神宗万历二十七年",
        what: "僧定和明通谋庄严千佛岭",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "明嘉靖中",
        what: "海盐郑晓重装无量寿佛及左右二菩萨",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "隆庆以后",
        what: "补造佛龛佛像者纷起",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "梁天监十年",
        what: "千佛岩历时二十八载完成",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
      },
      {
        date: "1956年",
        what: "被列为江苏省文物保护单位",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "文化大革命期间",
        what: "受到严重摧残，无一尊完整佛像",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "2001年",
        what: "被列为国家级文物保护单位",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "南朝齐永明二年",
        what: "明仲璋出资鸠工开凿佛龛镌刻佛像",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "1956年",
        what: "被列为江苏省文物保护单位",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "文化大革命期间",
        what: "千佛崖佛像遭到严重破坏",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "2001年",
        what: "被列为国家级文物保护单位",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "2026",
        what: "国庆假日上演千佛岩石窟壁画飞天舞表演",
        source: "https://wlj.nanjing.gov.cn/whyw/202610/t20261019_6020967.html",
      },
    ],
    audio: [
      {
        title: "南京-栖霞山 · 千佛岩",
        url: "https://www.ximalaya.com/sound/22366063",
        platform: "喜马拉雅",
        author: "恋景旅行APP",
        kind: "audio-guide",
        minutes: 2.5,
        plays: 4475,
      },
      {
        title:
          "栖霞山（2）：江南地区保存最为完好的一座隋代的舍利塔，更有六朝的千佛崖石窟！",
        url: "https://www.bilibili.com/video/BV1bQ4y1k79E",
        platform: "B站",
        author: "访古金陵汤益明",
        kind: "video",
        minutes: 11.9,
        plays: 2517,
      },
      {
        title:
          "我打赌这是很多南京本地人都不知道的宝藏石窟！反季节游南京栖霞山，探访千佛崖石窟，寻找栖霞飞天",
        url: "https://www.bilibili.com/video/BV1WME76iExM",
        platform: "B站",
        author: "䴙䴘Pt观游记",
        kind: "video",
        minutes: 6.4,
        plays: 277,
      },
      {
        title: "镜头带你看栖霞山千佛岩",
        url: "https://www.bilibili.com/video/BV1rF4m1w7s2",
        platform: "B站",
        kind: "video",
        minutes: 53.2,
        plays: 281,
      },
    ],
    images: [
      {
        url: "https://qixia.winnielyu.com/img/commons/ce2f24c371a.jpg",
        title: "千佛崖石窟文保碑20230219",
        desc: "​全国重点文物保护单位千佛崖石窟文保碑",
        author: "西安兵马俑",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
        source:
          "https://commons.wikimedia.org/wiki/File:%E5%8D%83%E4%BD%9B%E5%B4%96%E7%9F%B3%E7%AA%9F%E6%96%87%E4%BF%9D%E7%A2%9120230219.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/cc38bd253e8.jpg",
        title: "Mural Painting in Qixia Temple",
        desc: "Mural Painting in Qixia Temple",
        author: "Bt4wang",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:Mural_Painting_in_Qixia_Temple.JPG",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c98ba440665.jpg",
        title: "Qixiasi09",
        desc: "栖霞寺 千佛岩 2004年5月29日撮影 撮影者:権作",
        author: "Px820",
        license: "CC BY-SA 3.0",
        licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
        source: "https://commons.wikimedia.org/wiki/File:Qixiasi09.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c67f5c2c9ec.jpg",
        title: "Statue1 of Qianfoya Nanjing",
        desc: "statue of Qianfoyan, Nanjing, China",
        author: "Farm",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:Statue1_of_Qianfoya_Nanjing.jpg",
        historic: false,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/caeab56b080.jpg",
        title:
          "Recueil. Mission archéologique, Chine, 1917. K'i-hia sseu (Qixiasi) - lot de photographies - Victor Segalen - btv1b10527565p (09 of 30)",
        desc: "千佛岩佛龛浮雕，谢阁兰考察照片",
        author: "Victor Segalen（1917 年摄）",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:Recueil._Mission_arch%C3%A9ologique,_Chine,_1917._K%27i-hia_sseu_(Qixiasi)_-_lot_de_photographies_-_Victor_Segalen_-_btv1b10527565p_(09_of_30).jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c078260f67a.jpg",
        title:
          "Recueil. Mission archéologique, Chine, 1917. K'i-hia sseu (Qixiasi) - lot de photographies - Victor Segalen - btv1b10527565p (17 of 30)",
        desc: "千佛岩佛龛浮雕，谢阁兰考察照片",
        author: "Victor Segalen（1917 年摄）",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:Recueil._Mission_arch%C3%A9ologique,_Chine,_1917._K%27i-hia_sseu_(Qixiasi)_-_lot_de_photographies_-_Victor_Segalen_-_btv1b10527565p_(17_of_30).jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c5a1e7528ea.jpg",
        title:
          "Recueil. Mission archéologique, Chine, 1917. K'i-hia sseu (Qixiasi) - lot de photographies - Victor Segalen - btv1b10527565p (22 of 30)",
        desc: "千佛岩佛龛浮雕，谢阁兰考察照片",
        author: "Victor Segalen（1917 年摄）",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:Recueil._Mission_arch%C3%A9ologique,_Chine,_1917._K%27i-hia_sseu_(Qixiasi)_-_lot_de_photographies_-_Victor_Segalen_-_btv1b10527565p_(22_of_30).jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c5204dcb6c7.jpg",
        title:
          "Recueil. Mission archéologique, Chine, 1917. K'i-hia sseu (Qixiasi) - lot de photographies - Victor Segalen - btv1b10527565p (01 of 30)",
        desc: "千佛岩佛龛浮雕，谢阁兰考察照片",
        author: "Victor Segalen（1917 年摄）",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:Recueil._Mission_arch%C3%A9ologique,_Chine,_1917._K%27i-hia_sseu_(Qixiasi)_-_lot_de_photographies_-_Victor_Segalen_-_btv1b10527565p_(01_of_30).jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/ccaea8efd2a.jpg",
        title:
          "Recueil. Mission archéologique, Chine, 1917. K'i-hia sseu (Qixiasi) - lot de photographies - Victor Segalen - btv1b10527565p (02 of 30)",
        desc: "千佛岩佛龛浮雕，谢阁兰考察照片",
        author: "Victor Segalen（1917 年摄）",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:Recueil._Mission_arch%C3%A9ologique,_Chine,_1917._K%27i-hia_sseu_(Qixiasi)_-_lot_de_photographies_-_Victor_Segalen_-_btv1b10527565p_(02_of_30).jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/cf625f93473.jpg",
        title:
          "Recueil. Mission archéologique, Chine, 1917. K'i-hia sseu (Qixiasi) - lot de photographies - Victor Segalen - btv1b10527565p (03 of 30)",
        desc: "千佛岩佛龛浮雕，谢阁兰考察照片",
        author: "Victor Segalen（1917 年摄）",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:Recueil._Mission_arch%C3%A9ologique,_Chine,_1917._K%27i-hia_sseu_(Qixiasi)_-_lot_de_photographies_-_Victor_Segalen_-_btv1b10527565p_(03_of_30).jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/c1f802fb505.jpg",
        title:
          "Recueil. Mission archéologique, Chine, 1917. K'i-hia sseu (Qixiasi) - lot de photographies - Victor Segalen - btv1b10527565p (04 of 30)",
        desc: "千佛岩佛龛浮雕，谢阁兰考察照片",
        author: "Victor Segalen（1917 年摄）",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:Recueil._Mission_arch%C3%A9ologique,_Chine,_1917._K%27i-hia_sseu_(Qixiasi)_-_lot_de_photographies_-_Victor_Segalen_-_btv1b10527565p_(04_of_30).jpg",
        historic: true,
      },
      {
        url: "https://qixia.winnielyu.com/img/commons/cf6317a58ff.jpg",
        title:
          "Recueil. Mission archéologique, Chine, 1917. K'i-hia sseu (Qixiasi) - lot de photographies - Victor Segalen - btv1b10527565p (05 of 30)",
        desc: "千佛岩佛龛浮雕，谢阁兰考察照片",
        author: "Victor Segalen（1917 年摄）",
        license: "Public domain",
        licenseUrl: "",
        source:
          "https://commons.wikimedia.org/wiki/File:Recueil._Mission_arch%C3%A9ologique,_Chine,_1917._K%27i-hia_sseu_(Qixiasi)_-_lot_de_photographies_-_Victor_Segalen_-_btv1b10527565p_(05_of_30).jpg",
        historic: true,
      },
    ],
    credibility: "C",
  },
  {
    referenceCode: "B8",
    referenceName: "纱帽峰",
    name: "纱帽峰",
    kbCardId: "place-320113-shamaofeng",
    kbTitle: "纱帽峰",
    aliases: ["玉冠峰"],
    summary:
      "纱帽峰处千佛岩之巅，被众佛龛环抱，乾隆南巡时赐名“玉冠峰”，今人仍习惯称纱帽峰。",
    history: "乾隆皇帝南巡时曾到此地，据传嫌其名俗，赐别名玉冠峰。[2][3][9]",
    historySources: [
      "[2] 别名（C）：https://m.maigoo.com/citiao/113006.html",
      "[3] 名称由来（C）：https://m.maigoo.com/citiao/113006.html",
      "[6] 御碑失窃时长（C）：https://m.maigoo.com/citiao/113006.html",
      "[7] 御碑发现地点（C）：https://m.maigoo.com/citiao/113006.html",
      "[9] 大事记 乾隆南巡（C）：https://m.maigoo.com/citiao/113006.html",
      "[11] 大事记 2000年（C）：https://m.maigoo.com/citiao/113006.html",
    ],
    keyFacts: [
      {
        key: "位置",
        values: [
          {
            value: "千佛岩之巅",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "栖霞山",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "千佛岩的前面",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "千佛岩前",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "栖霞寺东北千佛崖的山崖上",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "别名",
        values: [
          {
            value: "玉冠峰",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "B",
          },
          {
            value: "玉冠峰",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "B",
          },
          {
            value: "玉冠峰",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "B",
          },
          {
            value: "听松岭",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "B",
          },
          {
            value: "听松岭",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "B",
          },
          {
            value: "玉冠峰",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "B",
          },
          {
            value: "玉冠峰",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "名称由来",
        values: [
          {
            value: "嫌其名俗",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "碑槽形制",
        values: [
          {
            value: "空穴碑槽",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "御碑内容",
        values: [
          {
            value: "《登栖霞山》",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "御碑失窃时长",
        values: [
          {
            value: "200",
            unit: "余年",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "御碑发现地点",
        values: [
          {
            value: "栖霞寺佛学院墙体",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "得名由来",
        values: [
          {
            value: "形状像过去这个官员戴的那个乌纱帽",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "嫌其近俚适和沈德潜诗得句云久闻摄山名秀如玉而冠即以易之",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "从下向上看和纱帽一样所以叫做纱帽峰",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "仰视若古冠，因名纱帽峰",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "状如纱帽",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "峰顶作方龛的形状龛上有小洞洞内凿有佛像",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "峰顶形如方龛，上有数小洞，洞内镌石佛像",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "一方形巨石",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "造像材质",
        values: [
          {
            value: "该佛像实物很小，目测为树脂类工艺品",
            source:
              "https://www.xiaohongshu.com/explore/6a3f5a10000000001003d945",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "乾隆南巡",
        what: "到纱帽峰，嫌名俗，赐名玉冠峰",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "乾隆第一次南巡",
        what: "留下《登栖霞山》第一块御碑",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "2000年",
        what: "御碑在栖霞寺佛学院墙体被发现",
        source: "https://m.maigoo.com/citiao/113006.html",
      },
      {
        date: "乾隆",
        what: "诗中写到纱帽峰等山中景点",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "清乾隆年间",
        what: "乾隆皇帝赐名玉冠峰",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
      },
      {
        date: "清高宗",
        what: "改名纱帽峰为玉冠峰",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "明",
        what: "殷迈立默坐轩",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
      },
      {
        date: "清高宗南巡",
        what: "改名玉冠峰",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
      },
      {
        date: "清乾隆年间",
        what: "乾隆皇帝嫌纱帽峰名称鄙俚，改名为玉冠峰",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
    ],
    audio: [],
    images: [],
    credibility: "C",
  },
  {
    referenceCode: "B9",
    referenceName: "乾隆行宫遗址",
    name: "乾隆行宫遗址",
    kbCardId: "place-320113-qianlongxinggong",
    kbTitle: "乾隆行宫遗址",
    aliases: ["乾隆行宫", "行宫"],
    summary: "清代两江总督尹继善在栖霞山为乾隆建行宫，乾隆行宫后毁于咸丰时期。",
    history:
      "乾隆行宫由尹继善建造，一说建成于1757年。[2][3][16] 据导游讲，乾隆六下江南，五次住在栖霞山。[6][7][24] 行宫规模宏大，有春雨山房、太古堂等多处建筑。[9][10][11]",
    historySources: [
      "[2] 建造者（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[3] 相关人物（C）：https://zh.wikipedia.org/zh-cn/栖霞寺",
      "[6] 数量（C）：https://m.maigoo.com/citiao/113006.html",
      "[7] 数量（C）：https://m.maigoo.com/citiao/113006.html",
      "[9] 形制（C）：https://m.maigoo.com/citiao/113006.html",
      "[10] 形制（C）：https://m.maigoo.com/citiao/113006.html",
      "[11] 形制（C）：https://m.maigoo.com/citiao/113006.html",
      "[16] 建成时间（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[24] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[25] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
    ],
    keyFacts: [
      {
        key: "位置",
        values: [
          {
            value: "栖霞山",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
          {
            value: "古寺的后面",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
          {
            value: "中峰之左，与东峰相连",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "中峰的左面",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "建造者",
        values: [
          {
            value: "尹继善",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
        ],
      },
      {
        key: "相关人物",
        values: [
          {
            value: "乾隆",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "C",
          },
        ],
      },
      {
        key: "别名",
        values: [
          {
            value: "乾隆行宫",
            source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
            credibility: "B",
          },
          {
            value: "乾隆行宫",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "B",
          },
          {
            value: "行宫",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "乾隆行宫",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "数量",
        values: [
          {
            value: "六",
            unit: "次",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "五",
            unit: "次",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "四十五",
            unit: "天",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "规模宏大",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "建筑鳞次节比",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value:
              "有春雨山房、太古堂、武夷一曲精庐、话山亭、有凌云意、寝殿、白下卷阿、夕佳楼、石梁精舍等",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "规模",
        values: [
          {
            value: "最大",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "现状",
        values: [
          {
            value: "只留下了乾隆行宫遗址",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "毁因",
        values: [
          {
            value: "辛亥革命间的战火",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "建成时间",
        values: [
          {
            value: "1757年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "驻跸时长",
        values: [
          {
            value: "45",
            unit: "天",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "建筑面积",
        values: [
          {
            value: "4",
            unit: "万平方米",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "殿堂馆舍数量",
        values: [
          {
            value: "2000",
            unit: "间",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "B",
          },
          {
            value: "2000",
            unit: "间",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "始建年代",
        values: [
          {
            value: "乾隆二十二年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "B",
          },
          {
            value: "乾隆二十二年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "B",
          },
          {
            value: "乾隆二十四年",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "南巡驻跸次数",
        values: [
          {
            value: "5",
            unit: "次",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "面积",
        values: [
          {
            value: "400",
            unit: "亩",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "清代",
        what: "为乾隆在栖霞山建行宫",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "咸丰三年",
        what: "乾隆行宫被毁",
        source: "https://zh.wikipedia.org/zh-cn/栖霞寺",
      },
      {
        date: "辛亥革命",
        what: "行宫毁于战火，现仅存遗址",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "1757年",
        what: "建成时间",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
      {
        date: "乾隆二十二年",
        what: "大吏恭建行宫以驻清跸",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
      },
      {
        date: "淸乾隆三十二年",
        what: "高宗重幸大吏建行宫",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "洪杨之乱",
        what: "行宫付之一炬",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "乾隆二十二年",
        what: "行宫建成",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "清咸丰八年",
        what: "行宫遭战火毁坏",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "乾隆二十四年",
        what: "行宫建成",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "乾隆十六年",
        what: "乾隆敕建栖霞行宫",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
    ],
    audio: [],
    images: [
      {
        url: "https://qixia.winnielyu.com/img/commons/ccfef4cc64a.png",
        title: "栖霞山乾隆行宫遗址",
        desc: "Qianlong Palace Ruins in Qixia Mountain, built in 1757, on…",
        author: "Remixia",
        license: "CC0",
        licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        source:
          "https://commons.wikimedia.org/wiki/File:%E6%A0%96%E9%9C%9E%E5%B1%B1%E4%B9%BE%E9%9A%86%E8%A1%8C%E5%AE%AB%E9%81%97%E5%9D%80.png",
        historic: false,
      },
    ],
    credibility: "C",
  },
  {
    referenceCode: "C1",
    referenceName: "话山亭",
    name: "话山亭",
    kbCardId: null,
    kbTitle: null,
    note: "知识库无独立卡片；见「乾隆行宫遗址」形制（话山亭为其庭院建筑之一），并出现在红叶谷—太虚亭—天开岩游览线路上。",
  },
  {
    referenceCode: "C2",
    referenceName: "天开岩",
    name: "天开岩",
    kbCardId: "place-320113-tiankaiyan",
    kbTitle: "天开岩",
    aliases: ["污西凹"],
    summary: "天开岩是栖霞山的自然奇观之一",
    history: "天开岩一说位于栖霞山。[1]",
    historySources: ["[1] 位置（C）：https://zh.wikipedia.org/zh-cn/栖霞山"],
    keyFacts: [
      {
        key: "位置",
        values: [
          {
            value: "栖霞山",
            source: "https://zh.wikipedia.org/zh-cn/栖霞山",
            credibility: "C",
          },
          {
            value: "中峰之右",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "西峰之侧",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "B",
          },
          {
            value: "西峰之侧",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "B",
          },
          {
            value: "栖霞山西峰之侧",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
          {
            value: "了凡问道→天开岩→桃花湖",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
          {
            value: "小营盘→天开岩→乾隆御花园",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
        ],
      },
      {
        key: "类别",
        values: [
          {
            value: "自然奇观",
            source: "https://zh.wikipedia.org/zh-cn/栖霞山",
            credibility: "C",
          },
        ],
      },
      {
        key: "别名",
        values: [
          {
            value: "污西凹",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
          {
            value: "唐公岩",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "B",
          },
          {
            value: "唐公岩",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "B",
          },
        ],
      },
      {
        key: "题名",
        values: [
          {
            value: "迎贤石",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "数量",
        values: [
          {
            value: "约30处",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "石壁奇峭如截，中通一线，仄境森沈，若天开然",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
          {
            value: "两岩削立其直如截阔可三尺",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
          {
            value: "矗石凌空，两岩削立，其直如截",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
            credibility: "C",
          },
          {
            value: "峭壁如截，势若天开",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "石刻",
        values: [
          {
            value: "下有大石，刻六朝人所书醒石二字",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "碑高",
        values: [
          {
            value: "五尺余",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "禹王碑残块数量",
        values: [
          {
            value: "26",
            unit: "方",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "题刻数量",
        values: [
          {
            value: "20余",
            unit: "处",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "六朝",
        what: "刻有醒石二字",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/shanshanzhi-1790.md",
      },
      {
        date: "明",
        what: "杨时乔重刻禹王碑于天开岩",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "皇祐三",
        what: "苏松在天门岩题名",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "治平四年",
        what: "张稚珪在天开岩题名",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "宣和元年",
        what: "张耘老在唐公嵓题名",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaxinzhi-1934.md",
      },
      {
        date: "宋",
        what: "张瓌在此读书修道",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiashanzhi-1962.md",
      },
      {
        date: "1999年4月10日",
        what: "栖霞山园林管理处在天开岩景区施工时挖掘出禹王碑残碑和碎片",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "清乾隆十六年",
        what: "天开岩在乾隆行宫范围内",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
      },
      {
        date: "清乾隆二十二年",
        what: "乾隆御封天开岩为十大景观之一",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "1998年",
        what: "禹王碑在天开岩附近移拓立碑",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
      {
        date: "1999年4月10日",
        what: "在天开岩景区挖掘出禹王碑残片",
        source:
          "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
      },
    ],
    audio: [],
    images: [],
    credibility: "C",
  },
  {
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
        values: [
          {
            value: "在乾隆行宫的范围内",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiaquzhi-1999.md",
            credibility: "C",
          },
          {
            value: "乾隆行宫范围内",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "风景区核心地带",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
          {
            value: "背靠主峰，前有桃花湖，南有天开岩",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
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
        date: "清",
        what: "御花园为栖霞十景之一",
        source: "https://m.nj.bendibao.com/tour/140483.shtm",
      },
    ],
    audio: [],
    images: [],
    credibility: "C",
  },
  {
    referenceCode: "C4",
    referenceName: "红叶谷",
    name: "红叶谷",
    kbCardId: "place-320113-hongyegu",
    kbTitle: "红叶谷",
    aliases: [],
    summary:
      "红叶谷是成片的枫叶形成的山谷，偶尔夹杂银杏树，空气清新；线路从景区入口一直往北到达，观看长江的视线较好。",
    history:
      "红叶谷据说是由成片的枫叶形成的山谷。[1] 一说景区入口一直往北可到达红叶谷。[4]",
    historySources: [
      "[1] 形制（C）：https://m.maigoo.com/citiao/113006.html",
      "[2] 景观特征（C）：https://m.maigoo.com/citiao/113006.html",
      "[4] 位置（C）：https://m.maigoo.com/citiao/113006.html",
      "[5] 观江视线（C）：https://m.maigoo.com/citiao/113006.html",
    ],
    keyFacts: [
      {
        key: "形制",
        values: [
          {
            value: "成片的枫叶形成的山谷",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "集山、石、水、林、亭为一体新的红叶观赏区",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "景观特征",
        values: [
          {
            value: "中间夹杂着几棵点缀的银杏树",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "环境",
        values: [
          {
            value: "空气也非常的清新",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "位置",
        values: [
          {
            value: "景区入口一直往北到达红叶谷",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "御花园和凤翔峰西南山腰的交界处",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "观江视线",
        values: [
          {
            value: "较好",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "途经路线",
        values: [
          {
            value: "原霜红苑——桃花湖——红叶谷——枫林湖——太虚亭——了凡问道——天开岩",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "特点",
        values: [
          {
            value: "奇石、红叶",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "所在线路",
        values: [
          {
            value: "精华打卡线",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
          {
            value: "进阶挑战线",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
        ],
      },
      {
        key: "线路顺序",
        values: [
          {
            value: "桃花湖→红叶谷→枫林湖",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
          {
            value: "虎山→红叶谷→枫林湖",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
        ],
      },
    ],
    timeline: [],
    audio: [
      {
        title: "中国最美赏枫圣地～栖霞山。栖霞山最美赏枫点非红叶谷莫属。",
        url: "https://www.bilibili.com/video/BV1h5411G7jw",
        platform: "B站",
        author: "笨鹅旅行记",
        kind: "video",
        minutes: 1.4,
        plays: 539,
      },
    ],
    images: [],
    credibility: "C",
  },
  {
    referenceCode: "C5",
    referenceName: "枫林湖",
    name: "枫林湖",
    kbCardId: null,
    kbTitle: null,
    note: "知识库无独立卡片；见「红叶谷」途经路线（桃花湖—红叶谷—枫林湖—太虚亭）。",
  },
  {
    referenceCode: "C7",
    referenceName: "始皇临江处",
    name: "始皇临江处",
    kbCardId: "place-320113-shihuanglinjiang",
    kbTitle: "始皇临江处",
    aliases: ["始皇临江"],
    summary:
      "始皇临江处是栖霞山游玩线路B中的景点，观光车行程包括碧云亭到始皇临江、始皇临江下山。",
    history:
      "公元前210年，秦始皇曾登临此处，一说为始皇登临。[7][11] 2006年，该景点建成，一说为建成时间。[8][12]",
    historySources: [
      "[4] 相邻景点（C）：https://m.maigoo.com/citiao/113006.html",
      "[5] 相邻景点（C）：https://m.maigoo.com/citiao/113006.html",
      "[6] 附近卫生间（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[7] 登临时间（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[8] 建成时间（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[11] 大事记 公元前210年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[12] 大事记 2006年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
    ],
    keyFacts: [
      {
        key: "游览线路",
        values: [
          {
            value: "线路B",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "观光车行程",
        values: [
          {
            value: "碧云亭到始皇临江",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "始皇临江下山",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "相邻景点",
        values: [
          {
            value: "红叶谷",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "太虚亭",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "附近卫生间",
        values: [
          {
            value: "始皇临江卫生间（9:00-17:00）",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "登临时间",
        values: [
          {
            value: "公元前210年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "建成时间",
        values: [
          {
            value: "2006年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "江乘古邑",
        values: [
          {
            value: "建江乘县",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "描述",
        values: [
          {
            value: "横绝六合混一宇内",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "位置",
        values: [
          {
            value: "栖霞山凤翔峰",
            source:
              "https://qixia.winnielyu.com/internal/shared/gazetteers/text/qixiajianzhi-1999.md",
            credibility: "C",
          },
          {
            value: "中峰半腰北侧",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "观赏区域",
        values: [
          {
            value: "始皇临江处",
            source: "https://news.qq.com/rain/a/20251127A074O900",
            credibility: "C",
          },
        ],
      },
      {
        key: "始建年代",
        values: [
          {
            value: "2006年春",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "仿古建筑",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "组成部分",
        values: [
          {
            value: "重檐亭、廊、轩以及观景平台",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "景观特色",
        values: [
          {
            value: "阅江揽胜之绝佳之地",
            source: "https://m.nj.bendibao.com/tour/140483.shtm",
            credibility: "C",
          },
        ],
      },
      {
        key: "路线节点",
        values: [
          {
            value: "始皇临江处",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
          {
            value: "始皇临江",
            source: "https://news.qq.com/rain/a/20251127A06UPY00",
            credibility: "C",
          },
        ],
      },
      {
        key: "看江位置",
        values: [
          {
            value: "始皇临江处",
            source:
              "https://www.xiaohongshu.com/explore/6adeaa040000000015004e6b",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
      {
        key: "步行",
        values: [
          {
            value: "40",
            source:
              "https://www.xiaohongshu.com/explore/692a5dff000000001e0348ad",
            credibility: "C",
            note: "来自小红书，游客个人经验",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "公元前210年",
        what: "始皇登临",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
      {
        date: "2006年",
        what: "建成",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
      {
        date: "2006年春",
        what: "修建始皇临江处",
        source: "https://m.nj.bendibao.com/tour/140483.shtm",
      },
    ],
    audio: [
      {
        title:
          "栖霞山之旅，从西大门进入，经过明镜湖，桃花湖，始皇临江，最高点凤翔峰，太虚亭，青锋剑，纱帽峰，又回到大门。边走边拍照，总历时约两个半小时。",
        url: "https://www.bilibili.com/video/BV17N4y1k7LT",
        platform: "B站",
        author: "lovethewayme",
        kind: "video",
        minutes: 7.7,
        plays: 871,
      },
      {
        title: "栖霞山爬山进行中，顺时针路线，打卡了最著名的始皇临江景点。",
        url: "https://www.bilibili.com/video/BV1iw411z7pc",
        platform: "B站",
        author: "lovethewayme",
        kind: "video",
        minutes: 7.5,
        plays: 560,
      },
    ],
    images: [
      {
        url: "https://qixia.winnielyu.com/img/commons/c36e7be8e4a.jpg",
        title: "20120302南京栖霞山始皇临江处望长江 - panoramio",
        desc: "20120302南京栖霞山始皇临江处望长江",
        author: "fish4fish",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
        source:
          "https://commons.wikimedia.org/wiki/File:20120302%E5%8D%97%E4%BA%AC%E6%A0%96%E9%9C%9E%E5%B1%B1%E5%A7%8B%E7%9A%87%E4%B8%B4%E6%B1%9F%E5%A4%84%E6%9C%9B%E9%95%BF%E6%B1%9F_-_panoramio.jpg",
        historic: false,
      },
    ],
    credibility: "C",
  },
  {
    referenceCode: "C8",
    referenceName: "太虚亭",
    name: "太虚亭",
    kbCardId: null,
    kbTitle: null,
    note: "知识库无独立卡片；见「红叶谷」路线、「了凡问道」位置及卫生间/餐饮汇总提及。",
  },
  {
    referenceCode: "C10",
    referenceName: "半馆",
    name: "半馆",
    kbCardId: null,
    kbTitle: null,
    note: "知识库无任何记录。",
  },
  {
    referenceCode: "C11",
    referenceName: "百草园",
    name: "百草园",
    kbCardId: null,
    kbTitle: null,
    note: "知识库无任何记录。",
  },
  {
    referenceCode: "C12",
    referenceName: "饮马池",
    name: "饮马池",
    kbCardId: null,
    kbTitle: null,
    note: "知识库无任何记录。",
  },
  {
    referenceCode: "C13",
    referenceName: "陆羽茶庄",
    name: "陆羽茶庄",
    kbCardId: "place-320113-luyuchazhuang",
    kbTitle: "陆羽茶庄",
    aliases: [],
    summary:
      "位于栖霞山风景区内龙山之巅，可于茶庄小憩、与陆羽对饮，品尝口味独特的农家菜着。",
    history:
      "茶庄一说始建于2001年，一说唐大历年间建造。[3][11][15][17] 据导游讲，唐代茶圣陆羽曾在栖霞山居住一年多。[8][16][18]",
    historySources: [
      "[1] 位置（C）：https://m.maigoo.com/citiao/113006.html",
      "[2] 游玩体验（C）：https://m.maigoo.com/citiao/113006.html",
      "[3] 始建年代（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[4] 位置（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[5] 形制（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[6] 功能（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[7] 展览内容（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[8] 居住时长（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[11] 建造年代（A）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[15] 大事记 2001年（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[16] 大事记 唐朝（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[17] 大事记 唐大历年间（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
      "[18] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      "[20] 导游讲解（C）：https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
    ],
    keyFacts: [
      {
        key: "位置",
        values: [
          {
            value: "栖霞山风景区内龙山之巅",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
          {
            value: "龙山顶",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "游玩体验",
        values: [
          {
            value: "茶庄小憩，与陆羽对饮，品尝口味独特的农家菜着",
            source: "https://m.maigoo.com/citiao/113006.html",
            credibility: "C",
          },
        ],
      },
      {
        key: "始建年代",
        values: [
          {
            value: "2001",
            unit: "年",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "形制",
        values: [
          {
            value: "复式的仿唐建筑",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "功能",
        values: [
          {
            value: "小型的茶文化展览馆",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "展览内容",
        values: [
          {
            value: "从唐朝啊到宋代到明清不同时期的茶文化展览",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "居住时长",
        values: [
          {
            value: "一年多",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "相关著作",
        values: [
          {
            value: "《茶经》部分初稿",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "文化地位",
        values: [
          {
            value: "成就陆羽茶圣地位的一个重要地点",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
            credibility: "C",
          },
        ],
      },
      {
        key: "建造年代",
        values: [
          {
            value: "唐大历年间",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "占地面积",
        values: [
          {
            value: "约800",
            unit: "平方米",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "典籍",
        values: [
          {
            value: "茶经",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "得名由来",
        values: [
          {
            value: "陆羽 茶圣",
            source:
              "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
            credibility: "A",
          },
        ],
      },
      {
        key: "枫叶最佳观赏区域",
        values: [
          {
            value: "陆羽茶庄",
            source: "https://news.qq.com/rain/a/20251127A074O900",
            credibility: "C",
          },
        ],
      },
    ],
    timeline: [
      {
        date: "2001年",
        what: "始建陆羽茶庄",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "唐朝",
        what: "陆羽在此居住一年多",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-guided-tour-2026-10.md",
      },
      {
        date: "唐大历年间",
        what: "建造年代",
        source:
          "https://github.com/Dalaoyuan2020/wenlv-kb/blob/main/sources/field/qixia-miniprogram-2026-10-27.md",
        credibility: "A",
      },
    ],
    audio: [
      {
        title: "从栖霞山讲南京的半部历史 · 16 陆羽的茶",
        url: "https://www.ximalaya.com/sound/442501010",
        platform: "喜马拉雅",
        author: "熹园稿谈",
        kind: "podcast",
        minutes: 22.6,
        plays: 102,
      },
    ],
    images: [],
    credibility: "C",
  },
];

const byCode = new Map(qixiaKnowledge.map((p) => [p.referenceCode, p]));
const byName = new Map(qixiaKnowledge.map((p) => [p.name, p]));

export function getQixiaKnowledgeByCode(code?: string) {
  return code ? (byCode.get(code) ?? null) : null;
}

export function getQixiaKnowledgeByName(name?: string) {
  if (!name) return null;
  const hit = byName.get(name);
  if (hit) return hit;
  return (
    qixiaKnowledge.find(
      (p) =>
        p.name.includes(name) ||
        name.includes(p.name) ||
        (p.aliases ?? []).some((a) => name.includes(a) || a.includes(name)),
    ) ?? null
  );
}

export function searchQixiaKnowledge(query: string) {
  const q = query.trim();
  if (!q) return [];
  return qixiaKnowledge.filter((p) => {
    const text = [
      p.referenceName,
      p.name,
      p.kbTitle,
      p.summary,
      p.history,
      ...(p.aliases ?? []),
      ...(p.keyFacts ?? []).map((f) => f.key),
      ...(p.timeline ?? []).map((t) => t.date + t.what),
    ]
      .filter(Boolean)
      .join(" ");
    return text.includes(q) || (p.referenceName ?? "").includes(q);
  });
}
