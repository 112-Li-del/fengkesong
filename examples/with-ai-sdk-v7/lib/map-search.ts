import { scenicPlaces, facilityPlaces } from "./qixia-map";
import type { CatalogPlace, PlaceCategory, PlaceFilter } from "./place-catalog";

const aliases: Record<string, readonly string[]> = {
  彩虹明镜: ["明镜湖"],
  栖霞古寺: ["栖霞寺", "栖霞禅寺"],
  定照庵碑刻: ["定照庵石刻"],
  玲峰池遗址: ["玲峰池", "玲珑池遗址"],
  "白莲池（月牙池）": ["白莲池", "月牙池"],
};

// 服务设施一级大类 → 搜索关键词（便于游客用口语词也能搜到）。
const facilityKeywords: Record<string, string> = {
  卫生间: "卫生间 洗手间 厕所 wc restroom toilet",
  停车交通: "停车场 停车 观光车 游览车 车站",
  门票入口: "售票 检票 入口 出口 游客中心 问询",
  购物补给: "购物 文创 商店 补给 能量",
  安全医疗: "医疗 医务 急救 消防 安全",
};

export const mapSearchCatalog: CatalogPlace[] = [
  // 景点：统一归为「景点」类（餐饮、休息等子类并入景点）。
  ...scenicPlaces.map((place) => ({
    ...place,
    category: "景点" as const,
  })),
  // 服务设施：按 category 一级大类归类（卫生间/停车交通/门票入口/购物补给/安全医疗）。
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
      category: (place.category ?? "其他") as PlaceCategory | "其他",
      address: nearest ? nearest.name + "附近" : "景区内服务设施",
    };
  }),
].map((place, index) => ({ ...place, number: index + 1 }));

export function searchMapPlaces(
  query: string,
  category: PlaceFilter,
): CatalogPlace[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
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
