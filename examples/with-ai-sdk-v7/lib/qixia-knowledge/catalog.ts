import { placeD17 } from "./data/D17";
import { placeD16 } from "./data/D16";
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
// 栖霞山整体条目（无对应地图 POI，仅作知识库检索）
import { placeS0 } from "./data/S0";
// 故事资料补充的无条目地点（仅作保存与检索，不出现在地图上）
import { placeD1 } from "./data/D1";
import { placeD2 } from "./data/D2";
import { placeD3 } from "./data/D3";
import { placeD4 } from "./data/D4";
import { placeD5 } from "./data/D5";
import { placeD6 } from "./data/D6";
import { placeD7 } from "./data/D7";
import { placeD8 } from "./data/D8";
import { placeD9 } from "./data/D9";
import { placeD10 } from "./data/D10";
import { placeD11 } from "./data/D11";
import { placeD12 } from "./data/D12";
import { placeD13 } from "./data/D13";
import { placeD14 } from "./data/D14";
import { placeD15 } from "./data/D15";
// 地图新增景点（E 系列，联网检索后写入，仅作保存与检索，不出现在地图点位）
import { placeE1 } from "./data/E1";
import { placeE2 } from "./data/E2";
import { placeE3 } from "./data/E3";
import { placeE4 } from "./data/E4";
import { placeE5 } from "./data/E5";
import { placeE6 } from "./data/E6";
import { placeE7 } from "./data/E7";
import { placeE8 } from "./data/E8";
import { placeE9 } from "./data/E9";
import { placeE10 } from "./data/E10";
import { placeE11 } from "./data/E11";
import { placeE12 } from "./data/E12";
import { placeE13 } from "./data/E13";
import { placeE14 } from "./data/E14";
import { placeE15 } from "./data/E15";
import { placeE16 } from "./data/E16";
import { placeE17 } from "./data/E17";
import { placeE18 } from "./data/E18";
import { placeE19 } from "./data/E19";
import { placeE20 } from "./data/E20";
import { placeE21 } from "./data/E21";
import { placeE22 } from "./data/E22";
import { placeE23 } from "./data/E23";
import { placeE24 } from "./data/E24";
import { placeE25 } from "./data/E25";
import { placeE26 } from "./data/E26";
import { placeE27 } from "./data/E27";
import { placeE28 } from "./data/E28";
import { placeE29 } from "./data/E29";
import { placeE30 } from "./data/E30";
import { placeE31 } from "./data/E31";
import { placeE32 } from "./data/E32";
import { placeE33 } from "./data/E33";
import { placeE34 } from "./data/E34";
import { placeE35 } from "./data/E35";
// 地图旧点位补充条目（F 系列，仅作保存与检索）
import { placeF1 } from "./data/F1";
import { placeF2 } from "./data/F2";
import { placeF3 } from "./data/F3";
import { placeF4 } from "./data/F4";
import { placeF5 } from "./data/F5";
import { placeF6 } from "./data/F6";
import { placeF7 } from "./data/F7";
import { placeF8 } from "./data/F8";
import { placeF9 } from "./data/F9";
import { placeF10 } from "./data/F10";
import { placeF11 } from "./data/F11";
import { placeF12 } from "./data/F12";
import { placeF13 } from "./data/F13";
import { placeF14 } from "./data/F14";
import { placeF15 } from "./data/F15";
import { placeF16 } from "./data/F16";
// 补齐点位（G 系列：辅助点位中缺失卡片的景点及设施，仅作保存与检索）
import { placeG1 } from "./data/G1";
import { placeG2 } from "./data/G2";
import { placeG3 } from "./data/G3";
import { placeG4 } from "./data/G4";
import { placeG5 } from "./data/G5";
import { placeG6 } from "./data/G6";
import { placeG7 } from "./data/G7";
import { placeG8 } from "./data/G8";
import { placeG9 } from "./data/G9";
import { placeG10 } from "./data/G10";
import { placeG11 } from "./data/G11";
import { placeG12 } from "./data/G12";
import { placeG13 } from "./data/G13";
import { placeG14 } from "./data/G14";
import { placeG15 } from "./data/G15";
// 人物资料库（仅作保存与检索）
import { qixiaPeople } from "./data/people";

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
  placeS0,
  placeD1,
  placeD2,
  placeD3,
  placeD4,
  placeD5,
  placeD6,
  placeD7,
  placeD8,
  placeD9,
  placeD10,
  placeD11,
  placeD12,
  placeD13,
  placeD14,
  placeD15,
  placeD16,
  placeD17,
  placeE1,
  placeE2,
  placeE3,
  placeE4,
  placeE5,
  placeE6,
  placeE7,
  placeE8,
  placeE9,
  placeE10,
  placeE11,
  placeE12,
  placeE13,
  placeE14,
  placeE15,
  placeE16,
  placeE17,
  placeE18,
  placeE19,
  placeE20,
  placeE21,
  placeE22,
  placeE23,
  placeE24,
  placeE25,
  placeE26,
  placeE27,
  placeE28,
  placeE29,
  placeE30,
  placeE31,
  placeE32,
  placeE33,
  placeE34,
  placeE35,
  placeF1,
  placeF2,
  placeF3,
  placeF4,
  placeF5,
  placeF6,
  placeF7,
  placeF8,
  placeF9,
  placeF10,
  placeF11,
  placeF12,
  placeF13,
  placeF14,
  placeF15,
  placeF16,
  placeG1,
  placeG2,
  placeG3,
  placeG4,
  placeG5,
  placeG6,
  placeG7,
  placeG8,
  placeG9,
  placeG10,
  placeG11,
  placeG12,
  placeG13,
  placeG14,
  placeG15,
];

// 人物资料库（与栖霞山相关的人物），仅供检索，不参与地图点位。
export { qixiaPeople };

// 重新导出类型，保持原有导入路径 `@/lib/qixia-knowledge` 的签名不变
export type {
  Credibility,
  VisitorGroup,
  QixiaFact,
  QixiaTimelineItem,
  QixiaAudio,
  QixiaImage,
  QixiaGushu,
  QixiaGushuRecord,
  QixiaPlaceKnowledge,
  QixiaPerson,
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
      ...(p.gushu?.records ?? []).map((r) => r.chapter + r.text),
      p.gushu?.note,
    ]
      .filter(Boolean)
      .join(" ");
    return text.includes(q) || (p.referenceName ?? "").includes(q);
  });
}

// 检索与栖霞山相关的人物。
export function searchQixiaPeople(query: string) {
  const q = query.trim();
  if (!q) return [];
  return qixiaPeople.filter((person) => {
    const text = [
      person.name,
      person.dynasty,
      ...(person.aliases ?? []),
      person.connection,
      person.details,
      ...(person.relatedPlaces ?? []),
    ]
      .filter(Boolean)
      .join(" ");
    return text.includes(q) || person.name.includes(q);
  });
}
