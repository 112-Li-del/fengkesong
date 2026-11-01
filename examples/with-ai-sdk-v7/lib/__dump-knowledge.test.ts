// 把本地栖霞知识库的「定稿口径」导出为 JSON，用于同步到 Zion 智能体的知识表。
// 由 scripts/zion-sync-knowledge.mjs 调用；输出路径可用 FKS_KB_DUMP_PATH 覆盖。
import { writeFileSync } from "node:fs";
import { expect, it } from "vitest";
import { listAnswerViews } from "./qixia-knowledge";

it("dump answer views to JSON", () => {
  const views = listAnswerViews();
  const payload = views.map((v) => ({
    code: v.code,
    name: v.name,
    aliases: v.aliases ?? [],
    overview: v.overview,
    facts: v.facts.map((f) => ({ label: f.label, value: f.value })),
    timeline: v.timeline ?? [],
    // 知识库重构后 openIssues 改名为 unsettled；这里仍以 openIssues 键导出，
    // 保持 scripts/zion-sync-knowledge.mjs 与 Zion 表 open_issues 列的契约不变。
    openIssues: v.unsettled ?? [],
    coverage: v.coverage,
  }));
  writeFileSync(
    process.env.FKS_KB_DUMP_PATH ?? "F:/fks-gihub/.tmp/qixia-answer-views.json",
    JSON.stringify(payload, null, 2),
    "utf8",
  );
  // eslint-disable-next-line no-console
  console.log(
    `places=${payload.length} bytes=${JSON.stringify(payload).length}`,
  );
  expect(payload.length).toBeGreaterThan(0);
});
