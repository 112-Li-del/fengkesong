import catalog from "./qixia-places.json";
import extraCatalog from "./qixia-places-extra.json";
import facilityCatalog from "./qixia-facilities.json";
import type { LngLat, Place } from "../components/map/amap-types";

export type ScenicPlace = Place & {
  providerName: string;
  art: string;
  tier: number;
};

export type FacilityPlace = Place & {
  en: string;
  group: string;
};

// 前 46 条来自高德 POI（坐标已核验）；其余来自官方导览图配准，误差约 ±20–40 m。
export const scenicPlaces: ScenicPlace[] = [...catalog, ...extraCatalog];

// 导览图上的服务设施（卫生间、停车场、观光车站等），默认隐藏，可在地图面板开关。
export const facilityPlaces: FacilityPlace[] = facilityCatalog;
export const unverifiedPlaces = [
  "霜红苑",
  "桃花涧",
  "桃花坞",
  "印心湖",
  "萌宠乐园",
];
export const scenicCenter: LngLat = { lng: 118.9628, lat: 32.1554 };
export const scenicViewport = [118.9505, 32.1454, 118.977, 32.1655] as const;

export function withinScenicView(point: LngLat) {
  return (
    Number.isFinite(point.lng) &&
    Number.isFinite(point.lat) &&
    point.lng >= scenicViewport[0] &&
    point.lng <= scenicViewport[2] &&
    point.lat >= scenicViewport[1] &&
    point.lat <= scenicViewport[3]
  );
}

export function scenicSearchResults(places: Place[]) {
  return [
    ...new Map(
      places
        .filter((place) => withinScenicView(place.location))
        .map((place) => {
          const aliases: Record<string, string> = {
            明镜湖: "彩虹明镜",
            定照庵石刻: "定照庵碑刻",
            毘灵宝殿: "毗卢宝殿",
            毗卢宝殿: "毗卢宝殿",
          };
          const name = Object.keys(aliases).find((alias) =>
            place.name.endsWith(alias),
          );
          const canonical = name
            ? scenicPlaces.find((item) => item.name === aliases[name])
            : undefined;
          const result = canonical ?? place;
          return [result.id, result];
        }),
    ).values(),
  ];
}
