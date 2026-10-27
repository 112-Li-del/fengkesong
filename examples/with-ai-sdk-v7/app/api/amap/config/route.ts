export async function GET() {
  const key = process.env.AMAP_JS_API_KEY?.trim();
  const secure = !!process.env.AMAP_JS_SECURITY_CODE?.trim();
  return Response.json(
    {
      configured: !!key && secure,
      key: key && secure ? key : null,
      mcpConfigured: !!process.env.AMAP_WEB_SERVICE_KEY?.trim(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
