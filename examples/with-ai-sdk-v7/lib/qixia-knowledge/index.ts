import type { QixiaPlaceKnowledge } from "./types";
import { placeA1 } from "./data/A1";
import { placeA2 } from "./data/A2";
import { placeA4 } from "./data/A4";
import { placeA7 } from "./data/A7";
import { placeA8 } from "./data/A8";
import { placeB2 } from "./data/B2";
import { placeB3 } from "./data/B3";
import { placeB4 } from "./data/B4";
import { placeB5 } from "./data/B5";
import { placeB6 } from "./data/B6";
import { placeB7 } from "./data/B7";
import { placeB8 } from "./data/B8";
import { placeB9 } from "./data/B9";
import { placeC1 } from "./data/C1";
import { placeC2 } from "./data/C2";
import { placeC3 } from "./data/C3";
import { placeC4 } from "./data/C4";
import { placeC5 } from "./data/C5";
import { placeC7 } from "./data/C7";
import { placeC8 } from "./data/C8";
import { placeC10 } from "./data/C10";
import { placeC11 } from "./data/C11";
import { placeC12 } from "./data/C12";
import { placeC13 } from "./data/C13";

// 所有景点知识数据。后续扩充：在 data/ 下新增 <code>.ts，导出 place<code> 常量，并在此登记即可。
export const qixiaKnowledge: QixiaPlaceKnowledge[] = [
  placeA1,
  placeA2,
  placeA4,
  placeA7,
  placeA8,
  placeB2,
  placeB3,
  placeB4,
  placeB5,
  placeB6,
  placeB7,
  placeB8,
  placeB9,
  placeC1,
  placeC2,
  placeC3,
  placeC4,
  placeC5,
  placeC7,
  placeC8,
  placeC10,
  placeC11,
  placeC12,
  placeC13,
];

// 重新导出类型，保持原有导入路径 `@/lib/qixia-knowledge` 的签名不变
export type {
  Credibility,
  QixiaFact,
  QixiaTimelineItem,
  QixiaAudio,
  QixiaImage,
  QixiaPlaceKnowledge,
} from "./types";

const byCode = new Map(qixiaKnowledge.map((p) => [p.referenceCode, p]));
const byName = new Map(qixiaKnowledge.map((p) => [p.name, p]));

export function getQixiaKnowledgeByCode(code?: string) {
  return code ? (byCode.get(code) ?? null) : null;
}

export function getQixiaKnowledgeByName(name?: string) {
  if (!name) return null;
  const hit = byName.get(name);
  if (hit) return hit;
  return (
    qixiaKnowledge.find(
      (p) =>
        p.name.includes(name) ||
        name.includes(p.name) ||
        (p.aliases ?? []).some((a) => name.includes(a) || a.includes(name)),
    ) ?? null
  );
}

export function searchQixiaKnowledge(query: string) {
  const q = query.trim();
  if (!q) return [];
  return qixiaKnowledge.filter((p) => {
    const text = [
      p.referenceName,
      p.name,
      p.kbTitle,
      p.summary,
      p.history,
      ...(p.aliases ?? []),
      ...(p.keyFacts ?? []).map((f) => f.key),
      ...(p.timeline ?? []).map((t) => t.date + t.what),
    ]
      .filter(Boolean)
      .join(" ");
    return text.includes(q) || (p.referenceName ?? "").includes(q);
  });
}
