import { scenicPlaces, facilityPlaces, facilityCategories } from "./qixia-map";
import pinyinIndex from "./qixia-pinyin.json";
import type { Place } from "../components/map/amap-types";

export const mapSearchCategories = ["景点", ...facilityCategories] as const;
export type MapSearchFilter = "全部" | (typeof mapSearchCategories)[number];
export type MapSearchPlace = Place & {
  category: (typeof mapSearchCategories)[number];
  number: number;
};

const aliases: Record<string, readonly string[]> = {
  彩虹明镜: ["明镜湖"],
  栖霞古寺: ["栖霞寺", "栖霞禅寺"],
  定照庵碑刻: ["定照庵石刻"],
  玲峰池遗址: ["玲峰池", "玲珑池遗址"],
  "白莲池（月牙池）": ["白莲池", "月牙池"],
};
const facilityKeywords: Record<string, string> = {
  休息: "休息 歇脚 咖啡 餐饮 餐馆 吃饭 cafe coffee restaurant",
  卫生间: "卫生间 洗手间 厕所 wc restroom toilet",
  停车交通: "停车场 停车 观光车 游览车 车站",
  门票入口: "售票 检票 入口 出口 游客中心 问询",
  购物补给: "购物 文创 商店 补给 能量",
  安全医疗: "医疗 医务 急救 消防 安全",
};

export const mapSearchCatalog: MapSearchPlace[] = [
  ...scenicPlaces.map((place) => ({ ...place, category: "景点" as const })),
  ...facilityPlaces.map((place) => {
    const nearest = [...scenicPlaces].sort(
      (a, b) =>
        Math.hypot(
          a.location.lng - place.location.lng,
          a.location.lat - place.location.lat,
        ) -
        Math.hypot(
          b.location.lng - place.location.lng,
          b.location.lat - place.location.lat,
        ),
    )[0];
    return {
      ...place,
      category: place.category,
      address:
        place.address || (nearest ? nearest.name + "附近" : "景区内服务设施"),
    };
  }),
].map((place, index) => ({ ...place, number: index + 1 }));

/**
 * 拼音索引，由 .workbuddy/scripts/build-pinyin.mjs 生成：
 * p = 全拼，i = 首字母，a = 别名（全拼 + 首字母）
 */
type PinyinEntry = { p: string; i: string; a?: string[] };
const PINYIN = pinyinIndex as Record<string, PinyinEntry>;

const CJK = /[\u3400-\u9fff]/;

/** 归一化输入法组字阶段的拼音串（去掉分隔符、选字数字等） */
export function normalizeLatinQuery(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * 是否走拼音检索。
 * 含汉字时不进这条路径（中文 includes 已经能命中名称和别名），
 * 只有纯字母（"qianfoyan" / "qfy"）才当拼音处理。
 */
export function isPinyinQuery(raw: string): boolean {
  if (!raw || CJK.test(raw)) return false;
  const query = normalizeLatinQuery(raw);
  return query.length > 0 && /[a-z]/.test(query);
}

export type MapSearchSuggestion = {
  place: MapSearchPlace;
  /** 越大越靠前；中文查询恒为 0 */
  score: number;
  /** 命中的拼音形式，非拼音查询为 null */
  form: string | null;
};

function pinyinHit(
  name: string,
  query: string,
): { score: number; form: string } | null {
  const entry = PINYIN[name];
  if (!entry) return null;
  if (entry.p.startsWith(query)) {
    // 整词全拼命中优先于前缀命中
    return { score: entry.p === query ? 100 : 82, form: entry.p };
  }
  if (entry.i.startsWith(query)) return { score: 60, form: entry.i };
  for (const form of entry.a ?? []) {
    if (form.startsWith(query))
      return { score: form.length > 3 ? 44 : 40, form };
  }
  return null;
}

function rankByPinyin(
  raw: string,
  category: MapSearchFilter,
): MapSearchSuggestion[] {
  const query = normalizeLatinQuery(raw);
  const hits: MapSearchSuggestion[] = [];
  for (const place of mapSearchCatalog) {
    if (category !== "全部" && place.category !== category) continue;
    const hit = pinyinHit(place.name, query);
    if (hit) hits.push({ place, score: hit.score, form: hit.form });
  }
  return hits.sort(
    (a, b) => b.score - a.score || a.place.number - b.place.number,
  );
}

function matchByText(raw: string, category: MapSearchFilter): MapSearchPlace[] {
  const words = raw.toLowerCase().split(/\s+/).filter(Boolean);
  return mapSearchCatalog.filter((place) => {
    if (category !== "全部" && place.category !== category) return false;
    const text = [
      place.name,
      place.address,
      place.referenceName,
      place.category,
      ...(aliases[place.name] ?? []),
      facilityKeywords[place.category] ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return words.every((word) => text.includes(word));
  });
}

/**
 * 有关键词时一律全局搜索（跨类别），类别只在空关键词的「分类浏览」里生效。
 * 搜索框里只要有一个字符，就不该再被上面的类别按钮挡住。
 */
export function resolveSearchScope(
  query: string,
  category: MapSearchFilter,
): MapSearchFilter {
  return query.trim() ? "全部" : category;
}

export function searchMapPlaces(
  query: string,
  category: MapSearchFilter,
): MapSearchPlace[] {
  const raw = query.trim();
  // 空关键词时按类别列出全部，保持面板「分类浏览」的原有行为
  if (!raw) {
    return mapSearchCatalog.filter(
      (place) => category === "全部" || place.category === category,
    );
  }
  const scope = resolveSearchScope(raw, category);
  if (isPinyinQuery(raw)) {
    return rankByPinyin(raw, scope).map((hit) => hit.place);
  }
  return matchByText(raw, scope);
}

/** 候选浮层用：返回带匹配分数的前 limit 条（恒为全局搜索） */
export function suggestMapPlaces(
  query: string,
  category: MapSearchFilter,
  limit = 8,
): MapSearchSuggestion[] {
  const raw = query.trim();
  if (!raw) return [];
  const scope = resolveSearchScope(raw, category);
  if (isPinyinQuery(raw)) return rankByPinyin(raw, scope).slice(0, limit);
  return matchByText(raw, scope)
    .slice(0, limit)
    .map((place) => ({ place, score: 0, form: null }));
}
