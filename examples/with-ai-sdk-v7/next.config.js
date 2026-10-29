import { withAui } from "@assistant-ui/next";

// The OpenAI SDK creates its default provider during import and rejects blank URLs.
if (
  process.env.OPENAI_BASE_URL !== undefined &&
  !process.env.OPENAI_BASE_URL.trim()
)
  delete process.env.OPENAI_BASE_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@assistant-ui/react", "@assistant-ui/ai-sdk"],
};

export default withAui(nextConfig);
