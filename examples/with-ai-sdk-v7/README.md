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

聊天接口的 `get_current_weather` 查询栖霞山时与山间天气栏目共用 `lib/qixia-weather.ts` 的快照：配置和风天气后优先使用融合实况，未配置或服务失败时使用 Open-Meteo 模型预报。其他城市和区县继续使用 Open-Meteo 地理编码及天气服务（当前使用非商业公共接口）。

- 日期支持今天、明天、后天、未来七天及范围内的具体日期；相对日期按地点时区计算。
- 同名行政中心返回候选地点，要求用户确认；无法定位的地点不返回其他城市的天气。
- 回复须注明地点、日期、时间口径、单位及实际来源链接。和风提供多源融合实况，Open-Meteo 提供模型估算，两者均非景区气象站实测。
- 请求超时、数据不完整或日期超出范围时明确返回失败；缺失数值保留为 null。
- 工具模块位于 `lib/weather.ts`。在仓库根目录运行 `pnpm exec vitest run examples/with-ai-sdk-v7/lib/weather.test.ts --environment node` 验证边界行为。

接口文档：[天气](https://open-meteo.com/en/docs)、[地点解析](https://open-meteo.com/en/docs/geocoding-api)。

### 中国区县地点补充

Open-Meteo 的 GeoNames 搜索可能缺少中文区县名称，且只支持国家或一级行政区限定。查询未匹配时，工具按完整区县名及省市归属匹配阿里云 DataV GeoAtlas 的公开行政区划索引，支持“南京栖霞区”“栖霞区, 南京, 江苏”等写法；同名区县仍需用户确认，不退回市中心坐标。索引缓存 24 小时。

该学习原型补充数据采用 areas_v3（2021-05，高德数据），不保证覆盖之后的行政区划变更。GCJ-02 代表坐标会近似转换为 WGS84 再查询天气；结果标注地点来源及区县代表位置的空间范围，不代表全区实测。数据来源：https://datav.aliyun.com/portal/school/atlas/atlas_aigc 。

### 栖霞山常驻天气卡片

首页通过独立的 GET /api/weather/qixia 获取数据，无需调用语言模型。固定查询 WGS84 `32.16043,118.96479`（凤翔峰附近山顶代表点），不经过地理编码、不判断名称是否完全一致，不代表山门或所有山路的天气。页面可见时每60秒检查更新，返回前台或网络恢复时重新获取；刷新按钮也遵守服务端60秒缓存，避免多用户重复计费。并发请求合并。主源失败时使用 Open-Meteo；两源均失败时仅在30分钟内保留上次快照，并标注 stale，之后返回503。前端更新失败会保留当前页面已加载的值并显示警告和原时间。

卡片沿用 MagicBento 网格与指针光效，新增阵风、能见度、海平面气压、露点、云量、紫外线、穿衣建议、旅游指数、日出日落，以及未来两小时降水柱状图。缺失值显示破折号或明确的不可用状态。天气指数为服务商预报，不自行推算或伪造。日出日落从日预报自带的 astro 获取，减少独立调用；日落不是闭园时间。

和风 v1 湿度、云量和降水概率的0–1比例转换为百分数，m/s转换为km/h，能见度米转换为公里。当前降水量为过去一小时累计量；分钟预报每格是五分钟累计毫米数，不是概率或mm/h。分钟预报超过20分钟未更新时，前端不再展示降雨结论；聊天须核对 updatedAt。v1 实况目前未在正文中提供时间字段，若HTTP响应包含有效 Last-Modified 则标数据时间，否则明确标获取时间，不伪称观测时间。各接口的 attribution 与 license 均在页面展示。

Open-Meteo 当前温湿风雨来自 current；能见度、露点、紫外线取 current 时刻所在整点的 hourly 模型值，日最高紫外线仅在缺少当前值时显示且另标“今日最高”。自动检查频率不等于气象源更新频率。现场观测需要另接气象站或传感器。聊天保留历史记录，默认收为右下角单行输入，可展开阅读。地图与定位现已接入，配置及验收见 [AMAP_SETUP.md](./AMAP_SETUP.md)。

### 申请与配置和风天气

1. 在[和风开发者控制台](https://console.qweather.com/)注册账号，按照平台要求完成验证并创建项目。
2. 在控制台的“设置”中复制账号专属的 [API Host](https://dev.qweather.com/docs/configuration/api-host/)，例如 `abcxyz.xy.qweatherapi.com`。支持单级和多级子域名，不要填写通用官网或旧版免费域名。
3. 在该项目的凭据区域创建 API KEY，填写以下本地配置；也可根据[身份认证文档](https://dev.qweather.com/docs/configuration/authentication/)生成 JWT 并改用 `QWEATHER_JWT`。代码会优先选 JWT，且不同时发送两种认证。

```dotenv
QWEATHER_API_HOST=从控制台设置复制的完整API域名
QWEATHER_API_KEY=你的API_KEY
QWEATHER_JWT=
```

填写位置是本目录 `.env.local`（已忽略，不要提交密钥），然后重启开发服务。无需改前端代码。未申请时保持空白即可；普通天气和日出日落可通过备用源显示，分钟级降水与生活指数明确显示不可用。没有凭据时只能验证降级链路，和风实网联调需填写真实凭据后进行。密钥不会进入客户端或接口响应。

启用的和风接口及独立服务端缓存：

| 接口 | 用途 | 缓存 |
| --- | --- | --- |
| `/weather/v1/current/{lat}/{lon}` | 融合实况和扩展指标 | 60秒 |
| `/weather/v1/hourly/{lat}/{lon}` | 小时预报 | 30分钟 |
| `/weather/v1/daily/{lat}/{lon}` | 七天预报、日出日落、最高UV | 3小时 |
| `/v7/minutely/5m` | 两小时、五分钟间隔的降水 | 5分钟 |
| `/v7/indices/1d?type=3,6,5` | 穿衣、旅游、紫外线指数 | 3小时 |

v1使用路径顺序“纬度/经度”，v7按官方要求使用“经度,纬度”并保留两位小数；坐标取整后覆盖位置存在差异。某个附加接口无权限、超时或格式错误时只影响对应卡片。费用与额度请以[控制台和当前定价](https://dev.qweather.com/docs/finance/pricing/)为准：多种接口分别计次，不能将所有功能按单一接口的调用量估算。本地缓存是进程内缓存，多实例部署应改为共享缓存。

栏目提供中国天气网景区预报的原站链接作为官方参照，没有解析或缓存其HTML。彩云交叉校验与现场传感器属于文档中的可选后续能力，本次未接入。

验证：仓库根目录执行 `node_modules/.bin/vitest run examples/with-ai-sdk-v7/lib/weather.test.ts examples/with-ai-sdk-v7/lib/qweather.test.ts examples/with-ai-sdk-v7/app/api/weather/qixia/route.test.ts --environment node`，以及 `node_modules/.bin/tsc --noEmit -p examples/with-ai-sdk-v7/tsconfig.json`。测试覆盖实际转换、鉴权、分接口缓存、分钟预报失败隔离、固定坐标降级、保留旧快照和聊天共用数据。

## 高德地图与 MCP

首页已接入高德 JS API 地图，天气保留在右上角浮层。账号申请、配置项、功能范围与真机验收见 [AMAP_SETUP.md](./AMAP_SETUP.md)。地图和天气数据分离，和风天气接入不需要修改地图接口。
