import { z } from "zod";
import { locationQuality } from "./location-quality";
export const tripContextSchema = z.object({
  route: z.enum(["A", "B", "C"]).optional(),
  position: z
    .object({
      point: z.object({
        lng: z.number().min(-180).max(180),
        lat: z.number().min(-90).max(90),
      }),
      accuracy: z.number().positive(),
      timestamp: z.number(),
    })
    .optional(),
});
export type TripContext = z.infer<typeof tripContextSchema>;
let current: TripContext = {};
export function setTripContext(value: TripContext) {
  current = value;
}
export function getTripContext() {
  return current;
}
export function readTripContext(value: unknown, now = Date.now()) {
  const parsed = tripContextSchema.safeParse(value);
  const context = parsed.success ? parsed.data : {};
  const quality = context.position
    ? locationQuality(
        context.position.accuracy,
        context.position.timestamp,
        now,
      )
    : "missing";
  return {
    route: context.route,
    position: quality === "usable" ? context.position : undefined,
    locationStatus: quality,
  };
}
