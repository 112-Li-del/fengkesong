/** 把工具名换成游客看得懂的说法，用在工具调用的折叠标题上。 */
export function toolTopic(toolName: string): string {
  if (toolName === "recommend_qixia_trip") return "游览建议";
  if (toolName === "get_qixia_knowledge") return "景点资料";
  if (toolName === "get_current_weather") return "天气";
  if (toolName.startsWith("amap_")) return "地图信息";
  return "相关信息";
}

export function toolGroupLabel(
  toolNames: readonly string[],
  active: boolean,
): string {
  const topics = [...new Set(toolNames.map(toolTopic))].join("、");
  if (!topics) return active ? "正在查询…" : "已查询";
  return active ? `正在查询${topics}…` : `已查询${topics}`;
}
