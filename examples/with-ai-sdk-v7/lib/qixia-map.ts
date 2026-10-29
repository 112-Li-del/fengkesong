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

const primaryPlaces = new Set([
  "牌坊",
  "哼哈殿",
  "霜红苑",
  "彩虹明镜",
  "桃花涧",
  "桃花坞",
  "桃花湖",
  "卧云亭",
  "钟鼓楼",
  "钟楼",
  "鼓楼",
  "明征君碑",
  "栖霞古寺",
  "舍利塔",
  "千佛岩",
  "纱帽峰",
  "乾隆行宫遗址",
  "话山亭",
  "天开岩",
  "乾隆御花园",
  "红叶谷",
  "枫林湖",
  "印心湖",
  "始皇临江处",
  "太虚亭",
  "萌宠乐园",
  "半馆",
  "百草园",
  "饮马池",
  "陆羽茶庄",
  "景区南门",
]);

export const scenicPlaces: ScenicPlace[] = [...catalog, ...extraCatalog].map(
  (place) => ({ ...place, tier: primaryPlaces.has(place.name) ? 1 : 2 }),
);

const correctedProviderIds = new Set([
  "B0FFFFAB2W",
  "B0MBFS3D1J",
  "B0JDSRSXG7",
  "B001912HP8",
  "B0FFFFKJRG",
]);

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
        .filter(
          (place) =>
            place.id !== "B0FFF0FKGJ" && withinScenicView(place.location),
        )
        .map((place) => [
          place.id,
          {
            ...place,
            name: correctedProviderIds.has(place.id)
              ? (scenicPlaces.find((scenic) => scenic.id === place.id)?.name ??
                place.name)
              : place.name,
          },
        ]),
    ).values(),
  ];
}
