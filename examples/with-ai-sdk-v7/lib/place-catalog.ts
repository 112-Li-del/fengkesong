import type { Place } from "../components/map/amap-types";

export const placeCategories = ["景点", "厕所", "餐饮", "休息"] as const;
export type PlaceCategory = (typeof placeCategories)[number];
export type PlaceFilter = "全部" | PlaceCategory;
export type PlaceGroups = Record<PlaceCategory, readonly Place[]>;
export type CatalogPlace = Place & {
  category: PlaceCategory | "其他";
  number: number;
};

export function buildPlaceCatalog(
  groups: PlaceGroups,
  extras: readonly Place[] = [],
): CatalogPlace[] {
  const result = new Map<
    string,
    Place & { category: CatalogPlace["category"] }
  >();
  for (const category of placeCategories) {
    for (const place of groups[category]) {
      const previous = result.get(place.id);
      if (!previous || !previous.referenceCode)
        result.set(place.id, { ...place, category });
    }
  }
  for (const place of extras) {
    const previous = result.get(place.id);
    result.set(
      place.id,
      previous
        ? {
            ...previous,
            ...place,
            ...(previous.referenceName
              ? { referenceName: previous.referenceName }
              : {}),
            ...(previous.referenceCode
              ? { referenceCode: previous.referenceCode }
              : {}),
          }
        : { ...place, category: "其他" },
    );
  }
  return [...result.values()].map((place, index) => ({
    ...place,
    number: index + 1,
  }));
}
export function filterPlaceCatalog(
  catalog: readonly CatalogPlace[],
  category: PlaceFilter,
  searchResults: readonly Place[] | null = null,
): CatalogPlace[] {
  if (searchResults !== null) {
    const matches = new Set(searchResults.map((place) => place.id));
    return catalog.filter((place) => matches.has(place.id));
  }
  return category === "全部"
    ? [...catalog]
    : catalog.filter((place) => place.category === category);
}
