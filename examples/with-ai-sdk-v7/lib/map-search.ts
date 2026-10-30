import { scenicPlaces, facilityPlaces } from "./qixia-map";
import type { CatalogPlace, PlaceFilter } from "./place-catalog";

const restNames = new Set([
  "卧云亭",
  "太虚亭",
  "半馆",
  "五松阁",
  "夕佳亭",
  "环翠亭",
  "秋枫亭",
  "凝霜亭",
  "得趣亭",
  "虚云亭",
  "德云亭",
  "畅观亭",
  "试茶亭",
  "话山亭",
  "读枫阁",
  "碧云亭",
]);
const diningNames = new Set(["千佛斋", "陆羽茶庄", "徐十郎茶肆"]);
const aliases: Record<string, readonly string[]> = {
  彩虹明镜: ["明镜湖"],
  栖霞古寺: ["栖霞寺", "栖霞禅寺"],
  定照庵碑刻: ["定照庵石刻"],
  玲峰池遗址: ["玲峰池", "玲珑池遗址"],
  "白莲池（月牙池）": ["白莲池", "月牙池"],
};
export const mapSearchCatalog: CatalogPlace[] = [
  ...scenicPlaces.map((place) => ({
    ...place,
    category: diningNames.has(place.name)
      ? ("餐饮" as const)
      : restNames.has(place.name)
        ? ("休息" as const)
        : ("景点" as const),
  })),
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
      category:
        place.group === "toilet" ? ("厕所" as const) : ("其他" as const),
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
      place.category === "厕所" ? "卫生间 洗手间 wc restroom toilet" : "",
    ]
      .join(" ")
      .toLowerCase();
    return words.every((word) => text.includes(word));
  });
}
