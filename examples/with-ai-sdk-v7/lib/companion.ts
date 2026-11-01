import { distanceMeters } from "./proximity";

type Point = { lng: number; lat: number };
type SuggestablePlace = { id: string; name: string; location: Point };

export type SuggestionKind = "arrive" | "approach" | "care";

export type Suggestion = {
  id: string;
  kind: SuggestionKind;
  placeId: string;
  placeName: string;
  distance: number;
  title: string;
  body: string;
  at: number;
};

export const SUGGESTION_LIMIT = 4;
export const SUGGESTION_COOLDOWN_MS = 10 * 60 * 1000;
export const APPROACH_MAX_DISTANCE = 400;
export const CARE_MAX_DISTANCE = 800;
export const CARE_INTERVAL_MS = 120000;

export function arrivalSuggestion(
  place: SuggestablePlace,
  at: number,
): Suggestion {
  return {
    id: `arrive:${place.id}`,
    kind: "arrive",
    placeId: place.id,
    placeName: place.name,
    distance: 0,
    title: `已到达${place.name}`,
    body: "需要我介绍一下吗？",
    at,
  };
}

export function approachSuggestion(
  place: SuggestablePlace,
  distance: number,
  at: number,
): Suggestion {
  return {
    id: `approach:${place.id}`,
    kind: "approach",
    placeId: place.id,
    placeName: place.name,
    distance,
    title: `快到${place.name}了`,
    body: `直线约${Math.round(distance)}米，顺路看看吗？`,
    at,
  };
}

export function careSuggestion(
  place: SuggestablePlace,
  distance: number,
  at: number,
): Suggestion {
  return {
    id: `care:${place.id}`,
    kind: "care",
    placeId: place.id,
    placeName: place.name,
    distance,
    title: `附近还有${place.name}`,
    body: `直线约${Math.round(distance)}米，要我排进路线吗？`,
    at,
  };
}

export function addSuggestion(
  items: Suggestion[],
  next: Suggestion,
  limit = SUGGESTION_LIMIT,
): Suggestion[] {
  if (items.some((item) => item.id === next.id)) return items;
  return [next, ...items].slice(0, limit);
}

export function dismissSuggestion(
  items: Suggestion[],
  id: string,
): Suggestion[] {
  return items.filter((item) => item.id !== id);
}

export function expiredSuggestions(
  items: Suggestion[],
  now: number,
  ttlMs = SUGGESTION_COOLDOWN_MS,
): Suggestion[] {
  return items.filter((item) => now - item.at <= ttlMs);
}

export function nearestSuggestionTarget<T extends SuggestablePlace>(
  places: T[],
  point: Point,
  min: number,
  max: number,
): { place: T; distance: number } | null {
  let best: { place: T; distance: number } | null = null;
  for (const place of places) {
    const distance = distanceMeters(point, place.location);
    if (distance < min || distance > max) continue;
    if (!best || distance < best.distance) best = { place, distance };
  }
  return best;
}
