// 把「素材型」知识条目整理成「回答型」口径：
// 同一字段只留一个说法，数字有冲突就不给数字（进 openIssues），来源换成游客看得懂的名字。
// 原始多来源数据保持不变，知识卡片仍完整展示，只有对话走这一层。

import {
  GENERIC_SUMMARY,
  LOW_VALUE_KEY,
  OPEN_ISSUE_KEY,
  TIME_SENSITIVE_KEY,
  editorial,
  sourceLabel,
  type EditorialEntry,
} from "./editorial";
import { qixiaKnowledge } from "./catalog";
import type {
  QixiaAnswerFact,
  QixiaAnswerOpenIssue,
  QixiaAnswerView,
  QixiaFact,
  QixiaPlaceKnowledge,
} from "./types";

const CREDIBILITY_RANK = { A: 3, B: 2, C: 1 } as const;

const MAX_FACTS = 12;
const MAX_OPEN_ISSUES = 3;
const MAX_TIMELINE = 4;

/** 常见字段的出场顺序，位置与年代优先。 */
const FACT_PRIORITY: readonly RegExp[] = [
  /^(位置|地址)$/,
  /年代|建成时间|始建/,
  /^(形制|结构|层数|高度|宽度|厚度|面积|规模)$/,
  /别名|名称|全名/,
  /文物保护级别|地位|称号/,
  /得名|创建|建造者|撰文|书写/,
  /看点|景观|特色|观赏|功能|展览/,
];

function priorityOf(label: string): number {
  const index = FACT_PRIORITY.findIndex((pattern) => pattern.test(label));
  return index === -1 ? FACT_PRIORITY.length : index;
}

const SKIP_KEYS = new Set(["名称", "别名"]);

/** 开放时间一类的具体钟点会过期，不进入回答。 */
const CLOCK_TIME = /\d{1,2}:\d{2}/;

function withUnit(value: string, unit?: string): string {
  if (!unit) return value;
  return value.endsWith(unit) ? value : `${value} ${unit}`;
}

function normalize(value: string): string {
  return value
    .replace(/[\s、，。；：·．「」"'’（）()]/g, "")
    .replace(/^约/, "")
    .toLowerCase();
}

type Candidate = {
  display: string;
  sources: Set<string>;
  rank: number;
  key: string;
};

function groupValues(values: QixiaFact["values"]): Candidate[] {
  const candidates: Candidate[] = [];
  for (const item of values) {
    const display = withUnit(item.value.trim(), item.unit);
    if (!display) continue;
    const key = normalize(display);
    const existing = candidates.find(
      (candidate) =>
        candidate.key === key ||
        (Math.min(candidate.key.length, key.length) >= 3 &&
          (candidate.key.includes(key) || key.includes(candidate.key))),
    );
    if (existing) {
      existing.sources.add(item.source);
      existing.rank = Math.max(
        existing.rank,
        CREDIBILITY_RANK[item.credibility],
      );
      if (key.length > existing.key.length) {
        existing.key = key;
        existing.display = display;
      }
      continue;
    }
    candidates.push({
      key,
      display,
      sources: new Set([item.source]),
      rank: CREDIBILITY_RANK[item.credibility],
    });
  }
  return candidates;
}

function score(candidate: Candidate): number {
  return candidate.rank * 10 + Math.min(candidate.sources.size, 3) * 2;
}

function describe(candidate: Candidate): string {
  const labels = [...new Set([...candidate.sources].map(sourceLabel))];
  return candidate.sources.size > 1
    ? `多个来源一致：${labels.join("、")}`
    : `单一来源：${labels.join("、")}`;
}

type Resolved =
  | { value: string; basis: string; sources: string[] }
  | { conflict: true; sources: string[] };

function resolveValues(values: QixiaFact["values"]): Resolved {
  const candidates = groupValues(values).sort((a, b) => score(b) - score(a));
  const sources = [...new Set(values.map((value) => value.source))];
  if (!candidates.length) return { conflict: true, sources };
  const [best, second] = candidates;
  if (!best) return { conflict: true, sources };
  if (!second || score(best) > score(second)) {
    return { value: best.display, basis: describe(best), sources };
  }
  return { conflict: true, sources };
}

const CITATION = /\[\d+\]/g;
const LEAD_IN = /^(据导游讲|据传|据称|据说)[，,]?/;

function cleanProse(text: string): string {
  return text
    .replace(CITATION, "")
    .replace(LEAD_IN, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(text: string): string {
  const match = text.match(/^[^。！？]+[。！？]?/);
  return match ? match[0].trim() : "";
}

function ensurePeriod(text: string): string {
  return /[。！？]$/.test(text) ? text : `${text}。`;
}

function overviewOf(place: QixiaPlaceKnowledge, entry: EditorialEntry): string {
  if (entry.intro) return ensurePeriod(entry.intro);
  const summary = place.summary?.trim() ?? "";
  if (summary && !GENERIC_SUMMARY.test(summary)) return ensurePeriod(summary);
  if (place.history) {
    const sentence = firstSentence(cleanProse(place.history));
    if (sentence && sentence.length <= 80 && !/一说|据传|据称/.test(sentence)) {
      return ensurePeriod(sentence);
    }
  }
  return "";
}

function collectSources(place: QixiaPlaceKnowledge): string[] {
  const sources = new Set<string>();
  for (const fact of place.keyFacts ?? []) {
    for (const value of fact.values) sources.add(value.source);
  }
  for (const item of place.timeline ?? []) sources.add(item.source);
  for (const source of place.historySources ?? []) sources.add(source);
  return [...sources];
}

function sourceNoteOf(place: QixiaPlaceKnowledge): string {
  return [...new Set(collectSources(place).map(sourceLabel))]
    .slice(0, 3)
    .join("、");
}

function buildFacts(
  place: QixiaPlaceKnowledge,
  entry: EditorialEntry,
): { facts: QixiaAnswerFact[]; openIssues: QixiaAnswerOpenIssue[] } {
  const hidden = new Set(entry.hide ?? []);
  const curated = entry.facts ?? [];
  const curatedKeys = new Set(curated.map((fact) => fact.key));
  const facts: QixiaAnswerFact[] = curated.map((fact) => ({
    label: fact.key,
    value: fact.value,
    ...(fact.basis ? { basis: fact.basis } : {}),
  }));
  const openIssues: QixiaAnswerOpenIssue[] = [...(entry.open ?? [])];
  const seen = new Set(facts.map((fact) => fact.value));

  const auto: { fact: QixiaAnswerFact; order: number }[] = [];
  for (const fact of place.keyFacts ?? []) {
    if (
      SKIP_KEYS.has(fact.key) ||
      hidden.has(fact.key) ||
      curatedKeys.has(fact.key) ||
      LOW_VALUE_KEY.test(fact.key)
    ) {
      continue;
    }
    if (TIME_SENSITIVE_KEY.test(fact.key)) continue;
    const resolved = resolveValues(fact.values);
    if ("conflict" in resolved) {
      if (
        OPEN_ISSUE_KEY.test(fact.key) &&
        !openIssues.some((issue) => issue.field === fact.key)
      ) {
        openIssues.push({
          field: fact.key,
          note: "不同资料说法不一，知识库未定稿",
        });
      }
      continue;
    }
    if (seen.has(resolved.value) || CLOCK_TIME.test(resolved.value)) continue;
    seen.add(resolved.value);
    auto.push({
      fact: { label: fact.key, value: resolved.value, basis: resolved.basis },
      order: priorityOf(fact.key),
    });
  }
  auto
    .sort((a, b) => a.order - b.order)
    .slice(0, Math.max(0, MAX_FACTS - facts.length))
    .forEach((item) => facts.push(item.fact));

  return { facts, openIssues: openIssues.slice(0, MAX_OPEN_ISSUES) };
}

function timelineOf(place: QixiaPlaceKnowledge, entry: EditorialEntry) {
  if (entry.timeline) return entry.timeline.map((item) => ({ ...item }));
  const seenYears = new Set<string>();
  const items: { date: string; what: string; order: number }[] = [];
  for (const item of place.timeline ?? []) {
    const date = cleanProse(item.date);
    const what = cleanProse(item.what);
    if (!date || !what) continue;
    const year = date.match(/\d{3,4}/)?.[0] ?? date;
    if (seenYears.has(year)) continue;
    seenYears.add(year);
    const numeric = Number(year);
    items.push({
      date,
      what,
      order: Number.isFinite(numeric) ? numeric : 9999,
    });
  }
  return items
    .sort((a, b) => a.order - b.order)
    .slice(0, MAX_TIMELINE)
    .map(({ date, what }) => ({ date, what }));
}

export function buildAnswerView(place: QixiaPlaceKnowledge): QixiaAnswerView {
  const entry = editorial[place.referenceCode] ?? {};
  const { facts, openIssues } = buildFacts(place, entry);
  const overview = overviewOf(place, entry);
  const coverage =
    facts.length >= 3
      ? "full"
      : facts.length > 0 || overview
        ? "summary"
        : "none";
  return {
    code: place.referenceCode,
    name: place.name,
    aliases: (place.aliases ?? []).filter((alias) => alias !== place.name),
    overview,
    facts,
    timeline: timelineOf(place, entry),
    openIssues,
    sourceNote: sourceNoteOf(place),
    coverage,
  };
}

/** 对话回答的默认视图；查不到时返回 null，由调用方决定转高德还是说明无资料。 */
export function findAnswerView(query: string): QixiaAnswerView | null {
  const name = query.trim();
  if (!name) return null;
  const exact = qixiaKnowledge.find((place) => {
    const aliases = place.aliases ?? [];
    return (
      place.name === name ||
      place.referenceName === name ||
      place.referenceCode === name.toUpperCase() ||
      place.kbTitle === name ||
      aliases.includes(name)
    );
  });
  if (exact) return buildAnswerView(exact);
  const partial = qixiaKnowledge.filter((place) => {
    const aliases = place.aliases ?? [];
    return (
      place.name.includes(name) ||
      name.includes(place.name) ||
      aliases.some((alias) => alias.includes(name) || name.includes(alias))
    );
  });
  return partial.length === 1 ? buildAnswerView(partial[0]!) : null;
}

export function listAnswerViews(): QixiaAnswerView[] {
  return qixiaKnowledge.map(buildAnswerView);
}
