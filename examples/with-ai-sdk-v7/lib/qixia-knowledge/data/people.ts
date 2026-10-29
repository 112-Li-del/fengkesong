import type { QixiaPerson } from "../types";

// 栖霞山相关人物资料库。
// 数据来源：《栖霞山文化故事资料》（枫客松参赛阅读，01_栖霞山文化故事资料(1).docx）。
// 说明：以下人物为知识库原有景点条目中缺失的人物，仅作保存与检索，不单独出现在地图上；
// 所有条目为单一来源、未经与其他史料交叉核实，可信度标 C。
const SRC = "《栖霞山文化故事资料》（枫客松参赛阅读）";

export const qixiaPeople: QixiaPerson[] = [
  {
    name: "李白",
    dynasty: "唐代",
    aliases: ["李太白", "青莲居士"],
    connection: "寓居栖霞、品茶赋诗的相关故事，让山中的茶与诗相伴。",
    details:
      "据资料，李白寓居栖霞、品茶赋诗的相关线索，使栖霞山的茶文化与唐诗相连。",
    relatedPlaces: ["陆羽茶庄", "栖霞山"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "李时珍",
    dynasty: "明代",
    aliases: ["李东璧"],
    connection: "到金陵及栖霞山采药，与《本草纲目》相关活动相联系。",
    details:
      "李时珍到金陵及栖霞山采药的记载，与《本草纲目》的相关活动相联系，提到了太子参、何首乌、党参等植物。",
    relatedPlaces: ["半馆", "栖霞山"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "文伯仁",
    dynasty: "明代",
    aliases: ["摄山老农"],
    connection: "曾以「摄山老农」为号，留下《摄山白鹿泉庵图》等作品。",
    details:
      "文伯仁以「摄山老农」为号，留下《摄山白鹿泉庵图》等作品，与白鹿泉一带相关。",
    relatedPlaces: ["白鹿泉"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "张宏",
    dynasty: "明代",
    connection: "有《栖霞山图》，画中的栖霞山水呈现画家笔下的面貌。",
    details: "张宏有《栖霞山图》，栖霞的山水在不同画家的笔下有着不同的面貌。",
    relatedPlaces: ["栖霞山"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "钱维城",
    dynasty: "清代",
    connection: "有《栖霞全图》，记录栖霞山水全貌。",
    details: "钱维城有《栖霞全图》，与文伯仁、张宏的作品共同构成画里的栖霞。",
    relatedPlaces: ["栖霞山"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "焦竑",
    dynasty: "明代",
    connection: "游栖霞诗文及相关碑刻，留下不同年代的声音。",
    details:
      "焦竑与江总、李白、孔尚任、袁枚、乾隆等人，各自与栖霞山发生过联系。",
    relatedPlaces: ["栖霞山"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "孔尚任",
    dynasty: "清代",
    connection:
      "《桃花扇》作者，写下「放目苍崖万丈，拂头红树千枝」描摹栖霞秋景。",
    details:
      "孔尚任写下「放目苍崖万丈，拂头红树千枝」，描摹栖霞的秋景；其《桃花扇》与桃花扇亭、葆贞庵等地方空间相连。",
    relatedPlaces: ["桃花扇亭", "葆贞庵", "红叶谷"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "侯方域",
    dynasty: "明末清初",
    connection: "《桃花扇》中的人物，与李香君的文学故事相连。",
    details:
      "侯方域与李香君的文学故事，与桃花涧、葆贞庵等地方空间相接，是《桃花扇》文学记忆的一部分。",
    relatedPlaces: ["葆贞庵", "桃花扇亭"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "高奇峰",
    dynasty: "近代",
    connection:
      "岭南画派重要画家，山中的墓园、牌坊、雕像和题词保存着对他的纪念。",
    details:
      "高奇峰是岭南画派的重要画家。山中的墓园、牌坊、雕像和题词，保存着人们对他的纪念，将栖霞与近代绘画联系起来。",
    relatedPlaces: ["高奇峰墓园"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "徐悲鸿",
    dynasty: "近代",
    connection: "留下纪念高奇峰的相关文字。",
    details:
      "徐悲鸿、蔡元培等人的相关文字，将艺术家本人、同道的评价与后来的纪念联系起来。",
    relatedPlaces: ["高奇峰墓园"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "蔡元培",
    dynasty: "近代",
    connection: "留下纪念高奇峰的相关文字。",
    details:
      "蔡元培与徐悲鸿等人的相关文字，将艺术家本人、同道的评价与后来的纪念联系起来。",
    relatedPlaces: ["高奇峰墓园"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "孙中山",
    dynasty: "近代",
    connection: "支持栖霞寺修复，留下近代保护的一段历史。",
    details:
      "孙中山支持寺院修复，艺术界人士关心石塔保护，为栖霞留下了另一段历史。",
    relatedPlaces: ["栖霞古寺"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "李四光",
    dynasty: "近代",
    connection: "1932 年与同仁在栖霞山开展地质调查，并绘制相关地质图。",
    details:
      "1932 年，李四光等人在栖霞山开展地质调查，并绘制相关地质图，图中记录地层、断层、走向与化石信息。",
    relatedPlaces: ["栖霞山"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "郑和",
    dynasty: "明代",
    connection: "与江乘、水陆通行等历史线索相连。",
    details:
      "江乘、郑和、水陆通行等历史线索，连接着栖霞与长江。江水带来物资与人的往来。",
    relatedPlaces: ["始皇临江处", "栖霞山"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "葛玄、葛洪、陶弘景",
    dynasty: "魏晋",
    aliases: ["葛玄", "葛洪", "陶弘景"],
    connection: "山中药草、摄生记忆与这些人物相连。",
    details:
      "「摄山」旧名因「山中多药草可以摄生」而来；葛玄、葛洪、陶弘景、李时珍等人物的地方记忆，与山中的药草相连。",
    relatedPlaces: ["栖霞山", "半馆"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "徐十郎",
    dynasty: "宋代",
    connection: "山下茶肆，与山前的饮茶生活相连。",
    details:
      "徐十郎茶肆与山前的饮茶生活相连。山中采茶、泉边试茶、街上饮茶，呈现地方生活的不同侧面。",
    relatedPlaces: ["徐十郎茶肆"],
    source: SRC,
    credibility: "C",
  },
  {
    name: "李祯祥",
    dynasty: "近现代",
    connection: "黄炎培 1914 年来访时的向导。",
    details:
      "李祯祥曾在黄炎培 1914 年来访时担任向导。地方手艺、游览和人与人的往来，使老街的历史有了具体的生活面貌。",
    relatedPlaces: ["栖霞老街"],
    source: SRC,
    credibility: "C",
  },
];
