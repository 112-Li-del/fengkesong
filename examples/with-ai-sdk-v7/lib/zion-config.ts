// Zion 托管环境下的运行时配置。
// 这些值全部是「可以出现在前端」的公开信息：接口地址、ZAI 代理 ID、高德 Web 端 JS Key。
// 真正的服务端密钥（LLM Key、和风 Key、高德 Web 服务 Key）不进前端，留在 Zion 后端。

export const ZION_GRAPHQL = process.env.NEXT_PUBLIC_ZION_GRAPHQL ?? "";
export const ZION_WS = process.env.NEXT_PUBLIC_ZION_WS ?? "";
export const ZION_ZAI_CONFIG_ID =
  process.env.NEXT_PUBLIC_ZION_ZAI_CONFIG_ID ?? "";

export const AMAP_JS_KEY = process.env.NEXT_PUBLIC_AMAP_JS_API_KEY ?? "";
export const AMAP_JS_SECURITY_CODE =
  process.env.NEXT_PUBLIC_AMAP_JS_SECURITY_CODE ?? "";

/** 静态导出构建：没有本地 Next 服务端，所有能力改走 Zion。 */
export const FKS_STATIC = process.env.NEXT_PUBLIC_FKS_STATIC === "1";

export function zionChatConfigured(): boolean {
  return Boolean(ZION_GRAPHQL && ZION_WS && ZION_ZAI_CONFIG_ID);
}

export function amapConfigured(): boolean {
  return Boolean(AMAP_JS_KEY);
}
