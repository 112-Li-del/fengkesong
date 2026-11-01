// 把本地栖霞知识库同步到 Zion 项目「枫向标」的知识表 qixia_knowledge。
//
//   pnpm sync:zion-knowledge              # 导出 → 对比 → 增量写入，并给出需要处理的部分
//   pnpm sync:zion-knowledge --dry-run    # 只对比，不写库
//
// 为什么「更新改删除」需要额外一步：
//   Zion 建表时给 Anonymous 角色的是 select + insert，没有 update / delete，
//   所以匿名 GraphQL 只能新增行。改动行与需要删除的行，脚本会把「现成可直接执行
//   的 GraphQL 变更」写到 .tmp/qixia-change-plan.json，交给有凭证的一侧执行：
//     · 在 Zion 编辑器 / GraphQL 面板里粘贴执行，或
//     · 让 WorkBuddy 用 Zion 插件的 runtime_graphql 帮你执行。
//   也可以在 Zion 权限配置里给 Anonymous 放开 update / delete，脚本即可全自动，
//   代价是任何人都可能改动这张公开数据表。

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = resolve(root, "../../.tmp");
mkdirSync(tmp, { recursive: true });

const GRAPHQL =
  process.env.FKS_ZION_GRAPHQL ??
  "https://zion-app.functorz.com/zero/EQvM7ze9MBN/api/graphql-v2";
const TABLE = process.env.FKS_ZION_KB_TABLE ?? "qixia_knowledge";
const dumpPath = resolve(tmp, "qixia-answer-views.json");
const dryRun = process.argv.includes("--dry-run");

async function gql(query, variables) {
  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`GraphQL 返回非 JSON：${text.slice(0, 300)}`);
  }
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 600));
  return json.data;
}

/** 与 dump 顺序无关的规范化：字段名对齐 Zion 的列名，值做 JSON 稳定比较。 */
function toRow(r) {
  return {
    code: r.code ?? null,
    name: r.name ?? "",
    aliases: r.aliases ?? [],
    overview: r.overview ?? "",
    facts: r.facts ?? [],
    timeline: r.timeline ?? [],
    open_issues: r.openIssues ?? [],
    visitor_info: r.visitorInfo ?? null,
    coverage: r.coverage ?? "none",
  };
}

// Postgres 的 jsonb 会重新排序对象键（且可能与本地不一致），所以比较必须
// 递归规范化键序，否则每次运行都会把所有含对象的行误判为「已变更」。
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.keys(value)
      .sort()
      .map((k) => [k, canonical(value[k])]);
  return value ?? null;
}

const stable = (v) => JSON.stringify(canonical(v));

console.log("== 1/4 导出本地知识库 ==");
const dump = spawnSync(
  "npx",
  ["vitest", "run", "lib/__dump-knowledge.test.ts", "--no-coverage"],
  {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, FKS_KB_DUMP_PATH: dumpPath },
  },
);
if (dump.status !== 0) {
  console.error("导出失败，请修复后再同步。");
  process.exit(1);
}

const local = JSON.parse(readFileSync(dumpPath, "utf8"));
console.log(`本地 ${local.length} 条。`);

console.log("== 2/4 读取 Zion 现状 ==");
const remote = await gql(
  `{ ${TABLE}(limit: 1000) { id code name aliases overview facts timeline open_issues visitor_info coverage } }`,
);
const remoteRows = remote[TABLE] ?? [];
console.log(`线上 ${remoteRows.length} 条。`);

console.log("== 3/4 对比差异 ==");
const remoteByCode = new Map(remoteRows.map((r) => [r.code, r]));
const localCodes = new Set(local.map((r) => r.code));

const toInsert = [];
const toUpdate = [];
for (const r of local) {
  const want = toRow(r);
  const have = remoteByCode.get(r.code);
  if (!have) {
    toInsert.push(want);
    continue;
  }
  // 注意：source_note 已从发布口径移除（改为聊天侧固定署名），不参与对比也不再写入，
  // 否则线上残留的旧值会让每一行都被误判成「已变更」。
  const same = [
    "name",
    "overview",
    "coverage",
    "aliases",
    "facts",
    "timeline",
    "open_issues",
    "visitor_info",
  ].every((k) => stable(want[k]) === stable(have[k] ?? null));
  if (!same) toUpdate.push({ id: have.id, ...want });
}
const toDelete = remoteRows.filter((r) => !localCodes.has(r.code));

console.log(
  `新增 ${toInsert.length} 条 / 变更 ${toUpdate.length} 条 / 需删除 ${toDelete.length} 条。`,
);

const planPath = resolve(tmp, "qixia-change-plan.json");
const plan = {
  generatedAt: new Date().toISOString(),
  graphql: GRAPHQL,
  table: TABLE,
  appliedInserts: 0,
  pending: {},
};

if (dryRun) {
  console.log("--dry-run：不写库。");
} else {
  if (toInsert.length) {
    const data = await gql(
      `mutation($o:[${TABLE}_insert_input!]!){ insert_${TABLE}(objects:$o){ affected_rows } }`,
      { o: toInsert },
    );
    const result = data[`insert_${TABLE}`];
    plan.appliedInserts = Array.isArray(result)
      ? (result[0]?.affected_rows ?? 0)
      : (result?.affected_rows ?? 0);
    console.log(`已插入 ${plan.appliedInserts} 条。`);
  }
  if (toUpdate.length) plan.pending.update = toUpdate;
  if (toDelete.length)
    plan.pending.deleteCodes = toDelete.map((r) => ({
      id: r.id,
      code: r.code,
    }));
}

writeFileSync(planPath, JSON.stringify(plan, null, 2), "utf8");

console.log("== 4/4 结果 ==");
console.log(`变更清单：${planPath}`);
if (plan.pending.update?.length || plan.pending.deleteCodes?.length) {
  console.log(
    [
      "",
      "⚠️ 匿名角色没有 update / delete 权限，以下改动尚未生效：",
      ...(plan.pending.update?.length
        ? [
            `  · 需更新 ${plan.pending.update.length} 行（见 change-plan.json 的 update 数组）`,
          ]
        : []),
      ...(plan.pending.deleteCodes?.length
        ? [
            `  · 需删除 ${plan.pending.deleteCodes.length} 行：${plan.pending.deleteCodes.map((d) => d.code).join("、")}`,
          ]
        : []),
      "",
      "处理方式二选一：",
      "  1) 让 WorkBuddy 用 Zion 插件的 runtime_graphql 执行这些变更；",
      "  2) 在 Zion 权限配置里给 Anonymous 放开 update/delete，脚本即可全自动。",
      "",
    ].join("\n"),
  );
} else {
  console.log("知识库已与本地完全一致。");
}
