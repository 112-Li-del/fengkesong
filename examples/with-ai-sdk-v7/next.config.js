import { withAui } from "@assistant-ui/next";

// The OpenAI SDK creates its default provider during import and rejects blank URLs.
if (
  process.env.OPENAI_BASE_URL !== undefined &&
  !process.env.OPENAI_BASE_URL.trim()
)
  delete process.env.OPENAI_BASE_URL;

// 部署到 Zion 静态站时打开：没有 Node 服务端，产出纯静态产物。
// 本地开发不受影响，只有 FKS_STATIC_EXPORT=1 时才启用。
const staticExport = process.env.FKS_STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@assistant-ui/react", "@assistant-ui/ai-sdk"],
  ...(staticExport
    ? {
        output: "export",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default withAui(nextConfig);
