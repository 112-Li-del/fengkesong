import { locationQuality } from "./location-quality";
export type ProximityPoint = {
  id: string;
  location: { lng: number; lat: number };
};
export type ProximityFix = {
  point: { lng: number; lat: number };
  accuracy: number;
  timestamp: number;
};
type Pending = { id: string; since: number; last: number; samples: number };
export function createProximityState() {
  return {
    inside: new Set<string>(),
    notified: new Map<string, number>(),
    leaving: new Map<string, Pending>(),
    candidate: null as Pending | null,
    lastFix: -Infinity,
  };
}
type ProximityState = ReturnType<typeof createProximityState>;
export function resetProximityPending(state: ProximityState) {
  state.candidate = null;
  state.leaving.clear();
}
export function distanceMeters(
  a: ProximityFix["point"],
  b: ProximityFix["point"],
) {
  const rad = Math.PI / 180;
  const term =
    Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 +
    Math.cos(a.lat * rad) *
      Math.cos(b.lat * rad) *
      Math.sin(((b.lng - a.lng) * rad) / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.min(1, Math.sqrt(term)));
}
export function updateProximity(
  state: ProximityState,
  targets: ProximityPoint[],
  fix: ProximityFix,
  now = Date.now(),
) {
  const quality = locationQuality(fix.accuracy, fix.timestamp, now);
  if (quality === "stale") {
    resetProximityPending(state);
    return {
      reason: "stale",
      placeId: null,
    };
  }
  if (fix.timestamp <= state.lastFix)
    return { reason: "waiting", placeId: null };
  state.lastFix = fix.timestamp;
  const ranked = targets
    .map((place) => ({
      id: place.id,
      distance: distanceMeters(fix.point, place.location),
    }))
    .sort((a, b) => a.distance - b.distance);
  for (const id of state.inside) {
    const match = ranked.find((item) => item.id === id);
    if (!match) {
      state.inside.delete(id);
      state.leaving.delete(id);
      continue;
    }
    if (match.distance <= 110) {
      state.leaving.delete(id);
      continue;
    }
    const old = state.leaving.get(id);
    if (!old || fix.timestamp - old.last > 30000)
      state.leaving.set(id, {
        id,
        since: fix.timestamp,
        last: fix.timestamp,
        samples: 1,
      });
    else {
      old.last = fix.timestamp;
      old.samples++;
      if (old.samples >= 2 && fix.timestamp - old.since >= 5000) {
        state.inside.delete(id);
        state.leaving.delete(id);
      }
    }
  }
  const nearest = ranked[0];
  if (!nearest || nearest.distance > 60) {
    state.candidate = null;
    return { reason: "none", placeId: null };
  }
  const second = ranked[1];
  if (second && second.distance - nearest.distance < 1) {
    state.candidate = null;
    return { reason: "ambiguous", placeId: null };
  }
  if (state.inside.has(nearest.id)) {
    state.candidate = null;
    return { reason: "inside", placeId: null };
  }
  if (
    !state.candidate ||
    state.candidate.id !== nearest.id ||
    fix.timestamp - state.candidate.last > 30000
  )
    state.candidate = {
      id: nearest.id,
      since: fix.timestamp,
      last: fix.timestamp,
      samples: 1,
    };
  else {
    state.candidate.last = fix.timestamp;
    state.candidate.samples++;
  }
  if (
    state.candidate.samples < 2 ||
    fix.timestamp - state.candidate.since < 10000
  )
    return { reason: "waiting", placeId: null };
  state.inside.add(nearest.id);
  state.candidate = null;
  const previous = state.notified.get(nearest.id);
  if (previous !== undefined && now - previous < 600000)
    return { reason: "cooldown", placeId: null };
  state.notified.set(nearest.id, now);
  return { reason: "entered", placeId: nearest.id, distance: nearest.distance };
}
