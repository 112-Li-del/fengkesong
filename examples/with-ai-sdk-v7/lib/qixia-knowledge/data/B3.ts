import type { QixiaPlaceKnowledge } from "../types";

// 鼓楼（鼓楼，太平鼓）
export const placeB3: QixiaPlaceKnowledge = {
  referenceCode: "B3",
  referenceName: "鼓楼",
  name: "鼓楼",
  kbCardId: "place-320113-zhonggulou",
  kbTitle: "钟鼓楼",
  aliases: ["太平鼓", "大鼓楼"],
  summary:
    "鼓楼是栖霞寺前「晨钟暮鼓」格局中的鼓楼，2003 年建成，内悬太平鼓，大鼓重约 400 公斤，与南侧钟楼形成「南钟北鼓」对称格局。",
  history:
    "鼓楼位于栖霞寺前，与钟楼沿中轴线南北对称（南钟北鼓），2003 年建成，建筑结构、尺寸、材料、色调、外形与钟楼保持一致。[1][2] 楼内置一面大鼓，鼓腰直径 2.5 米、鼓面直径 2.1 米、厚 1.8 米，重约 400 公斤。[1][2] 一楼供奉菩萨像，一说为文殊菩萨，一说为大功德天（财富女神）。[1][3] 寺院早晚敲鼓，与钟声相互应和——早上先敲钟后接鼓，晚上先敲鼓后接钟，即「晨钟暮鼓」。[1]",
  historySources: [
    "[1] 鼓楼沿革与鼓制（B）：微信公众号「南京栖霞寺导游词」",
    "[2] 鼓楼沿革（B）：凯风网《金陵第一明秀山 栖霞山探幽》",
    "[3] 一楼供奉（B）：微信公众号「栖霞山风景区导游词 A 线」",
  ],
  keyFacts: [
    {
      key: "建成年代",
      values: [
        {
          value: "2003 年建成",
          source: "微信公众号「南京栖霞寺导游词」",
          credibility: "B",
        },
      ],
    },
    {
      key: "大鼓尺寸",
      values: [
        {
          value: "鼓腰直径 2.5 米、鼓面直径 2.1 米、厚 1.8 米",
          source: "微信公众号「南京栖霞寺导游词」",
          credibility: "B",
        },
      ],
    },
    {
      key: "大鼓重量",
      values: [
        {
          value: "约 400 公斤",
          source: "微信公众号「南京栖霞寺导游词」",
          credibility: "B",
        },
      ],
    },
    {
      key: "楼内供奉",
      values: [
        {
          value: "一楼供奉文殊菩萨",
          source: "微信公众号「南京栖霞寺导游词」",
          credibility: "B",
        },
        {
          value: "一楼供奉大功德天（财富女神），佛像采用玉石彩雕镶嵌",
          source: "微信公众号「栖霞山风景区导游词 A 线」",
          credibility: "B",
          note: "两说并存，待核。",
        },
      ],
    },
    {
      key: "晨钟暮鼓",
      values: [
        {
          value: "寺院早晚敲鼓，与钟声应和，早上先敲钟后接鼓、晚上先敲鼓后接钟",
          source: "微信公众号「南京栖霞寺导游词」",
          credibility: "B",
        },
      ],
    },
    {
      key: "钟鼓对称",
      values: [
        {
          value:
            "钟、鼓楼沿古寺中轴线南北对称，结构、尺寸、材料、色调、外形完全一致，南有千禧钟、北有太平鼓",
          source:
            "https://www.mingyanjiaju.org/fanwen/daoyouci/jiangsudaoyouci/10941720.html",
          credibility: "C",
        },
      ],
    },
  ],
  timeline: [
    {
      date: "2003 年",
      what: "鼓楼建成，与钟楼形成「南钟北鼓」对称格局",
      source: "微信公众号「南京栖霞寺导游词」",
      credibility: "B",
    },
  ],
  audio: [],
  images: [],
  credibility: "B",
  note: "鼓楼一楼供奉有两说：文殊菩萨（导游词）与大功德天（A 线导游词），已并列保留待核。",
  gushu: {
    book: "摄山志（清·陈毅辑，乾隆五十五年刊）",
    note: "古籍只记「钟楼」未单列「鼓楼」，钟鼓并称，引钟楼同段。",
    records: [
      {
        chapter: "卷二/建置",
        text: "后为佛殿，三楹，两翼为钟楼，为碑亭，为伽蓝殿，为库。",
      },
    ],
  },
};
