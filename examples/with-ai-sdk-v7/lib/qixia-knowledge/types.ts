import type { visitorInfo } from "./visitor-info";
// 由脚本从「栖霞知识库」(https://qixia.winnielyu.com) 导入生成。
// 数据日期：2026-10-28；知识库内容为机器整理草稿（status=draft），多为 C 级，仅作线索与讲解素材。
// 图片来自维基共享资源（Wikimedia Commons）开放许可，须按 license 署名；音频为喜马拉雅讲解链接。
// 这里是素材层：同字段的多来源说法原样保留。对话与卡片正文只用 editorial.ts 审核后的发布口径。

export type Credibility = "A" | "B" | "C";

// 游玩信息维度：用于把碎片化的史实归并为清晰的游客体验分组。
export type VisitorGroup =
  | "time"
  | "location"
  | "transport"
  | "route"
  | "view"
  | "service";

export type QixiaFact = {
  key: string;
  group?: VisitorGroup;
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

// 古籍（《摄山志》等）原文摘录，用于补充景点的历史记载与典故出处。
export type QixiaGushuRecord = {
  chapter: string;
  text: string;
};

export type QixiaGushu = {
  book: string;
  note?: string;
  records: QixiaGushuRecord[];
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
  gushu?: QixiaGushu;
  // 速览区亮点徽章（从「地位/称号/文物保护级别/始建年代」等重量级字段提取的短语）
  highlights?: string[];
};

// 人物条目：与栖霞山相关的人物（隐士、诗人、画家、科学家、艺人等）。
// 仅作知识库检索与保存，不单独出现在地图点位或景点卡片上。
export type QixiaPerson = {
  name: string;
  // 时代 / 朝代，如「唐代」「明代」「近代」
  dynasty?: string;
  // 字号、别称等
  aliases?: string[];
  // 与栖霞的关系（一句话概述）
  connection: string;
  // 补充线索（更详细的记载）
  details?: string;
  // 关联景点（referenceName 或地名）
  relatedPlaces?: string[];
  // 出处
  source: string;
  credibility: Credibility;
};

/** 发布口径里的一条说法：每项只有一个值，不带来源与可信度。 */
export type QixiaAnswerFact = {
  label: string;
  value: string;
};

/** 对话与卡片正文共用的发布口径，只由 editorial.ts 的审核结论和条目简介组成。 */
export type QixiaAnswerView = {
  visitorInfo?: typeof visitorInfo;
  code: string;
  name: string;
  aliases: string[];
  overview: string;
  facts: QixiaAnswerFact[];
  timeline: { date: string; what: string }[];
  /** 资料互相矛盾、还没拍板的项目名，不带候选值。 */
  unsettled: string[];
  coverage: "full" | "summary" | "none";
};
