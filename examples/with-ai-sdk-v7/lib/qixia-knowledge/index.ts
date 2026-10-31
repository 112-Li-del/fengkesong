// 景点知识库入口：catalog 是原始素材，answer-view 是对话与卡片正文共用的发布口径。
export {
  getQixiaKnowledgeByCode,
  getQixiaKnowledgeByName,
  qixiaKnowledge,
  searchQixiaKnowledge,
} from "./catalog";
export {
  buildAnswerView,
  displayAliases,
  findAnswerView,
  listAnswerViews,
  listFeaturedPlaces,
  lookupQixiaKnowledge,
  type QixiaLookup,
} from "./answer-view";
export { sourceLabel } from "./editorial";

// 重新导出类型，保持原有导入路径 `@/lib/qixia-knowledge` 的签名不变
export type {
  Credibility,
  VisitorGroup,
  QixiaGushu,
  QixiaGushuRecord,
  QixiaPerson,
  QixiaAnswerFact,
  QixiaAnswerView,
  QixiaFact,
  QixiaTimelineItem,
  QixiaAudio,
  QixiaImage,
  QixiaPlaceKnowledge,
} from "./types";

export { qixiaPeople, searchQixiaPeople } from "./catalog";
