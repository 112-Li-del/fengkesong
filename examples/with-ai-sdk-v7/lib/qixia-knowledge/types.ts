// 由脚本从「栖霞知识库」(https://qixia.winnielyu.com) 导入生成。
// 数据日期：2026-10-28；知识库内容为机器整理草稿（status=draft），多为 C 级，仅作线索与讲解素材。
// 图片来自维基共享资源（Wikimedia Commons）开放许可，须按 license 署名；音频为喜马拉雅讲解链接。
// 回答规则：同字段多说法须并列展示，C 级按「一说」表述，附 source_url。

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

/** 定稿后的说法：对话只按这一层回答，不再并列多来源。 */
export type QixiaAnswerFact = {
  label: string;
  value: string;
  /** 定稿依据，只给维护者与测试看，不进入对话。 */
  basis?: string;
};

/** 知识库里还没有定论的字段，只说明「说法不一」，不给候选数字。 */
export type QixiaAnswerOpenIssue = {
  field: string;
  note: string;
};

export type QixiaAnswerView = {
  code: string;
  name: string;
  aliases: string[];
  overview: string;
  facts: QixiaAnswerFact[];
  timeline: { date: string; what: string }[];
  openIssues: QixiaAnswerOpenIssue[];
  /** 资料口径，一句话，例如「景区导览资料、景区小程序」。 */
  sourceNote: string;
  coverage: "full" | "summary" | "none";
};
