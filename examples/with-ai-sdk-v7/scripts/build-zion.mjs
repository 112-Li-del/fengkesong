// 构建可直接上传到 Zion 静态站的产物（out/，含 index.html）。
// 用法：pnpm build:zion
//
// 与本地开发的区别：
// - 打开静态导出（output: export），不产出任何服务端路由；
// - 从 .env.local 里取出高德 Web 端 JS Key 与安全密钥，作为 NEXT_PUBLIC_* 内联进产物。
//   这两项本来就是给浏览器用的公开值，真正的服务端密钥不进前端。
// - Zion 的 Runtime 端点与 AI 智能体 ID 使用下面的默认值，可用环境变量覆盖。
//
// 注意：静态导出不允许存在服务端路由。这些路由平时供本地 dev 使用，构建期间临时
// 改名成 Next 私有文件夹（下划线前缀，构建时自动忽略），构建结束后一律还原。
// 改名用 PowerShell Move-Item：本机 bash/Node 的 rename 对 app/ 内的目录会 EPERM，
// 但 PowerShell 原生移动可以正常执行。

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const DEFAULTS = {
  NEXT_PUBLIC_ZION_GRAPHQL:
    "https://zion-app.functorz.com/zero/EQvM7ze9MBN/api/graphql-v2",
  NEXT_PUBLIC_ZION_WS:
    "wss://zion-app.functorz.com/zero/EQvM7ze9MBN/api/graphql-subscription",
  NEXT_PUBLIC_ZION_ZAI_CONFIG_ID: "uoarxe9gj",
};

/** 从 .env.local 取高德 Web 端公开配置，转成构建期内联的 NEXT_PUBLIC_*。 */
function amapFromEnvLocal() {
  let raw = "";
  try {
    raw = readFileSync(resolve(root, ".env.local"), "utf8");
  } catch {
    return {};
  }
  const found = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const [, key, value] = match;
    const clean = value.replace(/^["']|["']$/g, "").trim();
    if (key === "AMAP_JS_API_KEY") found.NEXT_PUBLIC_AMAP_JS_API_KEY = clean;
    if (key === "AMAP_JS_SECURITY_CODE")
      found.NEXT_PUBLIC_AMAP_JS_SECURITY_CODE = clean;
  }
  return found;
}

const env = {
  ...process.env,
  FKS_STATIC_EXPORT: "1",
  NEXT_PUBLIC_FKS_STATIC: "1",
  ...DEFAULTS,
  ...amapFromEnvLocal(),
};

if (!env.NEXT_PUBLIC_AMAP_JS_API_KEY)
  console.warn("[build:zion] 未取到 AMAP_JS_API_KEY，地图将显示为未配置。");

// 清掉上一次产物，避免 Turbopack 清理旧文件时被误判为批量删除。
spawnSync(
  "powershell",
  [
    "-NoProfile",
    "-Command",
    `Remove-Item -Recurse -Force '${resolve(root, ".next")}'; Remove-Item -Recurse -Force '${resolve(root, "out")}'`,
  ],
  { stdio: "inherit" },
);

// 需要临时改名的服务端路由目录：改名成下划线前缀的私有文件夹，Next 自动忽略。
const serverRoutes = [
  ["app/api", "app/_api_off"],
  ["app/%5FAMapService", "app/_amap_off"],
];

function psMove(from, to) {
  const fromPath = resolve(root, from).replace(/'/g, "''");
  const toPath = resolve(root, to).replace(/'/g, "''");
  const result = spawnSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `Move-Item -Path '${fromPath}' -Destination '${toPath}' -Force`,
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0)
    throw new Error(`[build:zion] 移动失败：${from} -> ${to}`);
}

const moved = [];
for (const [from, to] of serverRoutes) {
  // 若上次异常残留，先清掉目标。
  spawnSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `Remove-Item -Recurse -Force '${resolve(root, to).replace(/'/g, "''")}'`,
    ],
    { stdio: "ignore" },
  );
  try {
    psMove(from, to);
    moved.push([from, to]);
  } catch (error) {
    // 还原已移动的部分后抛出。
    for (const [f, t] of moved) {
      try {
        psMove(t, f);
      } catch {
        /* ignore */
      }
    }
    throw error;
  }
}

let status = 1;
try {
  const build = spawnSync("npx", ["next", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env,
  });
  status = build.status ?? 1;
} finally {
  // 还原顺序与移动相反。
  for (const [from, to] of [...moved].reverse()) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        psMove(to, from);
        break;
      } catch {
        spawnSync("cmd", ["/c", "timeout", "/t", "1"], { stdio: "ignore" });
      }
    }
  }
}

process.exit(status);
