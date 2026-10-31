import { visitorInfo } from "./visitor-info";
// 对话与卡片共用发布口径；要点与大事记采用已确认内容，未补充条目按用户要求暂沿用现有简介。
// data/ 的多来源字段不再自动挑一个值进入回答；没有审核条目的景点只用它自己那句简介，
// 简介带推测或勘误口吻时也不用。原始说法留在卡片的「资料原文」里。

import { UNPUBLISHED_SUMMARY, editorial } from "./editorial";
import {
  getQixiaKnowledgeByCode,
  qixiaKnowledge,
  qixiaPeople,
} from "./catalog";
import type {
  QixiaAnswerView,
  QixiaPerson,
  QixiaPlaceKnowledge,
} from "./types";

/** 整座山的总条目：问到具体景点时让位，只在问不到具体景点时兜底。 */
const UMBRELLA_CODE = "S0";

const CITATION = /[[【]\s*\d+(?:\s*[、,，\-–]\s*\d+)*\s*[\]】]/g;

function ensurePeriod(text: string): string {
  return /[。！？]$/.test(text) ? text : `${text}。`;
}

function overviewOf(place: QixiaPlaceKnowledge): string {
  const intro = editorial[place.referenceCode]?.intro;
  if (intro) return ensurePeriod(intro);
  const summary = (place.summary ?? "").replace(CITATION, "").trim();
  return summary && !UNPUBLISHED_SUMMARY.test(summary)
    ? ensurePeriod(summary)
    : "";
}

/** 「又名」：去掉本名、误写和只为检索保留的名称。 */
export function displayAliases(place: QixiaPlaceKnowledge): string[] {
  const hidden = new Set([
    place.name,
    ...(editorial[place.referenceCode]?.searchOnly ?? []),
  ]);
  return [
    ...new Set(editorial[place.referenceCode]?.aliases ?? place.aliases ?? []),
  ].filter((alias) => !hidden.has(alias));
}

export function buildAnswerView(place: QixiaPlaceKnowledge): QixiaAnswerView {
  const entry = editorial[place.referenceCode] ?? {};
  const facts = (entry.facts ?? [])
    .filter((fact) => fact.status !== "pending")
    .map(({ key, value }) => ({
      label: key,
      value,
    }));
  const timeline = (entry.timeline ?? [])
    .filter((item) => item.status !== "pending")
    .map(({ date, what }) => ({
      date,
      what,
    }));
  const overview = overviewOf(place);
  return {
    ...(["S0", "A1", "A2", "B5"].includes(place.referenceCode)
      ? { visitorInfo }
      : {}),
    code: place.referenceCode,
    name: place.name,
    aliases: displayAliases(place),
    overview,
    facts,
    timeline,
    unsettled: [
      ...new Set([
        ...(entry.open ?? []),
        ...(entry.facts ?? [])
          .filter((fact) => fact.status === "pending")
          .map((fact) => fact.key),
      ]),
    ],
    coverage:
      facts.length || timeline.length ? "full" : overview ? "summary" : "none",
  };
}

function namesOf(place: QixiaPlaceKnowledge): string[] {
  return [
    place.name,
    place.referenceName,
    place.kbTitle ?? "",
    ...(place.aliases ?? []),
    ...(editorial[place.referenceCode]?.aliases ?? []),
  ].filter((name) => name.length >= 2);
}

function exactPlace(text: string): QixiaPlaceKnowledge | null {
  const code = text.toUpperCase();
  const own = qixiaKnowledge.find(
    (place) =>
      place.referenceCode === code ||
      place.name === text ||
      place.referenceName === text ||
      place.kbTitle === text,
  );
  if (own) return own;
  // 本名优先于别名：「桃花涧」是独立条目，不能落到把它列为别名的桃花湖上。
  const byAlias = qixiaKnowledge.filter((place) =>
    [
      ...(place.aliases ?? []),
      ...(editorial[place.referenceCode]?.aliases ?? []),
    ].includes(text),
  );
  return byAlias.length === 1 ? byAlias[0]! : null;
}

/** 问句里出现的最长景点名胜出，如「栖霞山舍利塔」取舍利塔；一样长又分属两处时不猜。 */
function containedPlace(text: string): QixiaPlaceKnowledge | null {
  let best: QixiaPlaceKnowledge | null = null;
  let bestLength = 0;
  let tie = false;
  for (const place of qixiaKnowledge) {
    if (place.referenceCode === UMBRELLA_CODE) continue;
    for (const name of namesOf(place)) {
      if (!text.includes(name) || name.length < bestLength) continue;
      if (name.length > bestLength) {
        best = place;
        bestLength = name.length;
        tie = false;
      } else if (best !== place) {
        tie = true;
      }
    }
  }
  return tie ? null : best;
}

/** 只写了名字的一部分，如「明镜」，能唯一对上一处时才用。 */
function partialPlace(text: string): QixiaPlaceKnowledge | null {
  if (text.length < 2) return null;
  const hits = qixiaKnowledge.filter(
    (place) =>
      place.referenceCode !== UMBRELLA_CODE &&
      namesOf(place).some((name) => name.includes(text)),
  );
  return hits.length === 1 ? hits[0]! : null;
}

function umbrellaPlace(text: string): QixiaPlaceKnowledge | null {
  const umbrella = getQixiaKnowledgeByCode(UMBRELLA_CODE);
  return umbrella && namesOf(umbrella).some((name) => text.includes(name))
    ? umbrella
    : null;
}

/** 问句里提到的人物；人名只出现在景点名里（如「高奇峰墓园」）时不算。 */
function mentionedPeople(text: string): QixiaPerson[] {
  const placeNames = qixiaKnowledge
    .flatMap(namesOf)
    .sort((a, b) => b.length - a.length);
  let rest = text;
  for (const name of placeNames) rest = rest.split(name).join("｜");
  return qixiaPeople.filter((person) =>
    [person.name, ...(person.aliases ?? [])].some((name) =>
      rest.includes(name),
    ),
  );
}

export type QixiaLookup =
  | { kind: "place"; view: QixiaAnswerView }
  | { kind: "people"; people: QixiaPerson[] }
  | { kind: "none" };

/** 对话工具的查询入口：具体景点 → 人物 → 名字片段 → 整座山。 */
export function lookupQixiaKnowledge(query: string): QixiaLookup {
  const text = query.trim();
  if (!text) return { kind: "none" };
  const place = exactPlace(text) ?? containedPlace(text);
  if (place) return { kind: "place", view: buildAnswerView(place) };
  const people = mentionedPeople(text);
  if (people.length) return { kind: "people", people };
  const fallback =
    partialPlace(text) ??
    umbrellaPlace(text) ??
    (/门票|票价|季卡|晨练|免费入园|开放时间|几点关门|几点开门|学生优惠/.test(
      text,
    )
      ? getQixiaKnowledgeByCode(UMBRELLA_CODE)
      : null);
  return fallback
    ? { kind: "place", view: buildAnswerView(fallback) }
    : { kind: "none" };
}

/** 只查景点；查不到时返回 null，由调用方决定转高德还是说明无资料。 */
export function findAnswerView(query: string): QixiaAnswerView | null {
  const text = query.trim();
  if (!text) return null;
  const place =
    exactPlace(text) ??
    containedPlace(text) ??
    partialPlace(text) ??
    umbrellaPlace(text);
  return place ? buildAnswerView(place) : null;
}

export function listAnswerViews(): QixiaAnswerView[] {
  return qixiaKnowledge.map(buildAnswerView);
}

/** 有审核条目的景点名，供「景区有什么」这类问题挑选。 */
export function listFeaturedPlaces(): string[] {
  return Object.entries(editorial)
    .filter(([code, entry]) => code !== UMBRELLA_CODE && entry.intro)
    .map(([code]) => getQixiaKnowledgeByCode(code)?.name)
    .filter((name): name is string => Boolean(name));
}
