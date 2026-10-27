# AI SDK v7 Example

This example demonstrates how to use `@assistant-ui/ai-sdk` with the Vercel AI SDK v7.

## Quick Start

### Using CLI (Recommended)

```bash
npx assistant-ui@latest create my-app --example with-ai-sdk-v7
cd my-app
```

### Environment Variables

Copy `.env.example` to `.env.local` in this directory and configure an OpenAI-compatible Chat Completions service:

```sh
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=
```

All three values are required and must belong to the same service. Choose a model that supports streaming and tool calling. The service is not restricted to DeepSeek. Keep real credentials in the ignored .env.local file, never use a NEXT_PUBLIC_ prefix for keys, and restart the development server after changes. Legacy DEEPSEEK_* variables remain supported when OPENAI_API_KEY is absent.

### Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Key Features

- Uses the new AI SDK v7 with `@ai-sdk/openai`
- Integrates with `@assistant-ui/react` using the new `useChatRuntime` hook
- No RSC support (client-side only)
- Simplified integration with the `useChatRuntime` hook that wraps AI SDK v7's `useChat`
- Uses `AssistantChatTransport` to pass system messages and frontend tools to the backend

## Custom Transport Configuration

By default, `useChatRuntime` uses `AssistantChatTransport` which automatically forwards system messages and frontend tools to the backend.

### Custom API URL with Forwarding

When customizing the API URL, you must explicitly use `AssistantChatTransport` to keep system/tools forwarding:

```typescript
import { AssistantChatTransport } from "@assistant-ui/ai-sdk";

const runtime = useChatRuntime({
  transport: new AssistantChatTransport({
    api: "/my-custom-api/chat", // Custom URL with system/tools forwarding
  }),
});
```

### Disable System/Tools Forwarding

To use the standard AI SDK transport without forwarding:

```typescript
import { DefaultChatTransport } from "ai";

const runtime = useChatRuntime({
  transport: new DefaultChatTransport(), // No system/tools forwarding
});
```

## API Route

The API route at `/api/chat` uses AI SDK v7 `streamText`, forwards `system` and frontend `tools`, and merges them with a server-defined weather tool.

## Related Documentation

- [assistant-ui Documentation](https://www.assistant-ui.com/docs)
- [AI SDK Integration Guide](https://www.assistant-ui.com/docs/runtimes/ai-sdk)

## 天气查询

聊天接口的 `get_current_weather` 调用 Open-Meteo 地理编码及天气服务，无需额外天气 API Key（当前使用非商业公共接口）。支持城市或可检索景点的当前天气和当地今天起七天预报。

- 日期支持今天、明天、后天、未来七天及范围内的具体日期；相对日期按地点时区计算。
- 同名行政中心返回候选地点，要求用户确认；无法定位的地点不返回其他城市的天气。
- 回复须注明地点、日期、数据时间、单位及 [Open-Meteo](https://open-meteo.com/) 来源。当前天气是气象模型估算，不是现场观测。
- 请求超时、数据不完整或日期超出范围时明确返回失败；缺失数值保留为 null。
- 工具模块位于 `lib/weather.ts`。在仓库根目录运行 `pnpm exec vitest run examples/with-ai-sdk-v7/lib/weather.test.ts --environment node` 验证边界行为。

接口文档：[天气](https://open-meteo.com/en/docs)、[地点解析](https://open-meteo.com/en/docs/geocoding-api)。

### 中国区县地点补充

Open-Meteo 的 GeoNames 搜索可能缺少中文区县名称，且只支持国家或一级行政区限定。查询未匹配时，工具按完整区县名及省市归属匹配阿里云 DataV GeoAtlas 的公开行政区划索引，支持“南京栖霞区”“栖霞区, 南京, 江苏”等写法；同名区县仍需用户确认，不退回市中心坐标。索引缓存 24 小时。

该学习原型补充数据采用 areas_v3（2021-05，高德数据），不保证覆盖之后的行政区划变更。GCJ-02 代表坐标会近似转换为 WGS84 再查询天气；结果标注地点来源及区县代表位置的空间范围，不代表全区实测。数据来源：https://datav.aliyun.com/portal/school/atlas/atlas_aigc 。

### 栖霞山常驻天气卡片

首页通过独立的 GET /api/weather/qixia 获取栖霞山附近的数据，无需聊天或调用语言模型。页面可见时每五分钟刷新，恢复到前台或网络恢复时重新获取；按钮可以主动刷新。服务端缓存五分钟并合并同时发生的请求。更新失败保留上次数据并提示；超过45分钟的气象数据标注可能过时。

卡片参考用户提供的 MagicBento，采用本地 TypeScript 网格与指针光效，未增加组件依赖。展示温度、体感、相对湿度、风速、风向、当前时段降水估算及六个逐小时时点的预报。温度和天气对应标注时刻，降水概率对应此前一小时；全天最严重天气不会作为当前天气显示。降水时段按接口返回 interval 计算。所有数据注明数据时间与来源，缺失值显示破折号。

Open-Meteo 当前天气基于气象模型，不是景区气象站实测；五分钟轮询并不代表气象模型每五分钟更新。现场观测需要另接可用的气象站或传感器数据。聊天保留历史记录，默认收为右下角单行输入，可展开阅读。地图与定位现已接入，配置及验收见 [AMAP_SETUP.md](./AMAP_SETUP.md)。

## 高德地图与 MCP

首页已接入高德 JS API 地图，天气保留在右上角浮层。账号申请、配置项、功能范围与真机验收见 [AMAP_SETUP.md](./AMAP_SETUP.md)。地图和天气数据分离，后续接入和风天气不需要修改地图接口。
