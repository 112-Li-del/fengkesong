// 临时：把本地栖霞知识库的「定稿口径」导出为 JSON，用于同步到 Zion 智能体。
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
    openIssues: v.openIssues ?? [],
    sourceNote: v.sourceNote,
    coverage: v.coverage,
  }));
  writeFileSync(
    "F:/fks-gihub/.tmp/qixia-answer-views.json",
    JSON.stringify(payload, null, 2),
    "utf8",
  );
  // eslint-disable-next-line no-console
  console.log(
    `places=${payload.length} bytes=${JSON.stringify(payload).length}`,
  );
  expect(payload.length).toBeGreaterThan(0);
});
