// 景点知识库入口：catalog 是原始素材，answer-view 是对话用的定稿口径。
export {
  getQixiaKnowledgeByCode,
  getQixiaKnowledgeByName,
  qixiaKnowledge,
  searchQixiaKnowledge,
} from "./catalog";
export {
  buildAnswerView,
  findAnswerView,
  listAnswerViews,
} from "./answer-view";

// 重新导出类型，保持原有导入路径 `@/lib/qixia-knowledge` 的签名不变
export type {
  Credibility,
  VisitorGroup,
  QixiaGushu,
  QixiaGushuRecord,
  QixiaPerson,
  QixiaAnswerFact,
  QixiaAnswerOpenIssue,
  QixiaAnswerView,
  QixiaFact,
  QixiaTimelineItem,
  QixiaAudio,
  QixiaImage,
  QixiaPlaceKnowledge,
} from "./types";

export { qixiaPeople, searchQixiaPeople } from "./catalog";
