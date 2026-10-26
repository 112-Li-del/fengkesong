# assistant-ui 本地启动说明

## 0. 当前状态（重要，先读这段）

| 项目 | 状态 |
|---|---|
| 代码 | ✅ 已克隆到 `E:\github\枫客松\assistant-ui` |
| Node.js | ✅ v24.22.1 已装（项目要求 ≥24.11，你原来的 v22 不够） |
| 依赖包文件 | ✅ 已下载完成（约 3000 个包，在 `node_modules\.pnpm` 里） |
| **能否启动** | ❌ **暂时不能**，卡在下面这个系统权限问题上 |

### 卡点：你的 Windows 不允许创建符号链接

pnpm 装完包之后，要在 `node_modules` 里建立"链接"把每个包串起来。这台电脑建符号链接**需要管理员权限**（开发者模式没开），pnpm 建失败就静默跳过——结果是：包都下载了，但 `node_modules/next`、`node_modules/@assistant-ui/react` 这些链接不存在，所以 `pnpm dev` 一执行就报 `Cannot find module`。

验证过：手动建符号链接提示"此操作需要管理员权限"。

### 根治办法（推荐，一步到位）

打开 **设置 → 隐私和安全性 → 开发者选项 → 开发人员模式**，开关打开（可能需要确认一次）。开完之后告诉我，我重跑一次安装就能全部就位（依赖已缓存，几分钟）。

永久方案也可以是：以后涉及这类项目都用**管理员身份的终端**跑安装命令。

### 不想动系统设置的替代路子

不折腾 monorepo，用官方 CLI 新建一个独立小项目，用 **npm** 装依赖（npm 是平铺安装，不用符号链接），几分钟就能在浏览器里看到界面：

```bash
npx assistant-ui@latest create my-app --example with-ai-sdk-v7
```

## 1. 每次新开终端，先切 Node 24

**Git Bash：**

```bash
export PATH="/c/Users/asus/.workbuddy/binaries/node/versions/24.22.1:$PATH"
node -v   # 必须显示 v24.22.1
```

**PowerShell：**

```powershell
$env:PATH = "C:\Users\asus\.workbuddy\binaries\node\versions\24.22.1;$env:PATH"
node -v
```

嫌麻烦就装 [nvm-windows](https://github.com/coreybutler/nvm-windows)，之后 `nvm use 24.22.1`。

## 2. 依赖修好之后的启动方式

```bash
export PATH="/c/Users/asus/.workbuddy/binaries/node/versions/24.22.1:$PATH"
cd "E:/github/枫客松/assistant-ui"

pnpm install          # 只在修好权限后需要再跑一次
pnpm turbo build      # 首次必做：内部包要编译出 dist

cd examples/with-ai-sdk-v7
pnpm dev
```

浏览器打开 <http://localhost:3000>

其他示例：`ls examples`（有 40 多个，with-langgraph、with-generative-ui、with-cloud 等）
文档站（不需要 API Key）：`cd apps/docs && pnpm dev`

## 3. 关于 API Key（决定能不能真的聊天）

没配 key 时：界面能打开、能打字、能看到流式动画，但发消息返回 **401**。

要真聊起来两条路：

**A. OpenAI（要花钱）**

```bash
cd examples/with-ai-sdk-v7
cp .env.example .env.local
# 编辑 .env.local：OPENAI_API_KEY=sk-你的密钥
```

**B. 本地开源模型（免费，推荐你试）**

1. 装 [Ollama](https://ollama.com)，`ollama pull qwen2.5:7b`
2. `pnpm add ollama-ai-provider`
3. 改 `app/api/chat/route.ts` 里的 model，指向 `http://localhost:11434`

## 4. 我为了绕过权限问题做过的改动（修好权限后建议撤销）

仓库根目录多了个 `.npmrc`：

```
node-linker=hoisted
verify-deps-before-run=false
```

作用是让 pnpm 少用链接、并且别在每次 `pnpm dev` 前偷偷重装一遍。同时我把 `.npmrc` 加进了 `.git/info/exclude`，所以它不会污染 git 提交。

**开启开发者模式之后**，建议删掉这个 `.npmrc`，回到项目官方默认的链接方式，然后重跑 `pnpm install`。

## 5. 常见坑

| 现象 | 原因 / 解决 |
|---|---|
| `Cannot find module 'xxx'` | 符号链接没建成，回到第 0 节 |
| `Unsupported engine` | Node 版本不对，回到第 1 节 |
| 3000 端口被占用 | `pnpm dev -- -p 3001` |
| 看不到提交历史 | 当初是浅克隆，`git fetch --unshallow` 补全 |
| 改了 `packages/` 下源码没反应 | 必须重新 `pnpm turbo build` |
