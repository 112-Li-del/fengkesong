import { z } from "zod";
import { mapSearchCatalog } from "./map-search";
import { scenicRoutes } from "./scenic-display";
import type { LngLat, Place } from "../components/map/amap-types";
import type { WalkingRouteLeg } from "../components/map/flowing-route";

const point = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});
const place = z.object({ id: z.string(), location: point });
const planSchema = z.object({
  status: z.string(),
  segments: z
    .array(z.object({ from: z.object({ location: point }), place }))
    .optional(),
  returnTo: place.nullable().optional(),
  returnWalking: z.unknown().optional(),
  walking: z.unknown().optional(),
  walkingFrom: z.object({ location: point }).optional(),
  walkingTo: place.nullable().optional(),
});

export function recommendationRoute(
  result: unknown,
): { legs: WalkingRouteLeg[]; stops: Place[] } | null {
  const parsed = planSchema.safeParse(result);
  if (!parsed.success) return null;
  const plan = parsed.data;
  const segments =
    plan.status === "planned"
      ? (plan.segments ?? [])
      : plan.status === "service" &&
          plan.walking &&
          plan.walkingFrom &&
          plan.walkingTo
        ? [{ from: plan.walkingFrom, place: plan.walkingTo }]
        : [];
  if (
    plan.status === "planned" &&
    plan.returnWalking &&
    plan.returnTo &&
    segments.length
  ) {
    segments.push({
      from: { location: segments.at(-1)!.place.location },
      place: plan.returnTo,
    });
  }
  if (!segments.length) return null;
  return {
    legs: segments.map((s) => ({
      from: s.from.location,
      to: s.place.location,
    })),
    stops: segments.flatMap((s) => {
      const match = mapSearchCatalog.find((p) => p.id === s.place.id);
      return match ? [match] : [];
    }),
  };
}

export type TripGateId = "QXF010" | "QXF011";
const gateIds: TripGateId[] = ["QXF010", "QXF011"];
const gateDistance = (a: LngLat, b: LngLat) =>
  Math.hypot((a.lng - b.lng) * 94300, (a.lat - b.lat) * 111200);

export function selectTripGate(origin?: LngLat, entryGate?: TripGateId) {
  const gates = gateIds.map((id) => ({
    ...mapSearchCatalog.find((place) => place.id === id)!,
    id,
  }));
  if (entryGate) return gates.find((gate) => gate.id === entryGate)!;
  if (origin)
    gates.sort(
      (a, b) =>
        gateDistance(origin, a.location) - gateDistance(origin, b.location),
    );
  return gates[0]!;
}

export function presetRoute(
  id: string,
  origin?: LngLat,
  entryGate?: TripGateId,
) {
  const definition = scenicRoutes.find((route) => route.id === id);
  if (!definition) return null;
  const places = definition.stops.map((name) =>
    mapSearchCatalog.find((place) => place.name === name),
  );
  if (places.some((place) => !place)) return null;
  const gate = selectTripGate(origin, entryGate);
  const interior = (places as Place[]).filter(
    (place) => !gateIds.some((id) => id === place.id),
  );
  if (places[0]!.id !== gate.id) interior.reverse();
  const start: Place =
    origin && gateDistance(origin, gate.location) > 3
      ? { id: "visitor-start", name: "当前位置", location: origin }
      : gate;
  const stops = [start, ...interior, gate];
  return {
    stops,
    legs: stops.slice(1).map((to, index) => ({
      from: index === 0 && origin ? origin : stops[index]!.location,
      to: to.location,
    })),
  };
}
