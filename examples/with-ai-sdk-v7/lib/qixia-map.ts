import catalog from "./qixia-places.json";
import type { LngLat, Place } from "../components/map/amap-types";

export type ScenicPlace = Place & {
  providerName: string;
  art: string;
  tier?: number;
};

export const scenicPlaces: ScenicPlace[] = catalog;
export const unverifiedPlaces = [
  "霜红苑",
  "桃花涧",
  "桃花坞",
  "印心湖",
  "萌宠乐园",
];
export const scenicCenter: LngLat = { lng: 118.9628, lat: 32.1554 };
export const scenicViewport = [118.9505, 32.1465, 118.977, 32.1655] as const;

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
        .map((place) => [place.id, place]),
    ).values(),
  ];
}
