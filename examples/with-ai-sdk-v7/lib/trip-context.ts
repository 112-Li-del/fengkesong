import { z } from "zod";
import { locationQuality } from "./location-quality";
export const tripContextSchema = z.object({
  route: z.enum(["A", "B", "C"]).optional(),
  entryGate: z.enum(["QXF010", "QXF011"]).optional(),
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
    entryGate: context.entryGate,
    position: quality !== "stale" ? context.position : undefined,
    locationStatus: quality,
  };
}

type TripPosition = NonNullable<TripContext["position"]>;
let locate: (() => Promise<TripPosition | null>) | undefined;
export function registerTripLocator(
  handler: () => Promise<TripPosition | null>,
) {
  locate = handler;
  return () => {
    if (locate === handler) locate = undefined;
  };
}
export async function tripContextForMessage(
  text: string,
): Promise<TripContext> {
  const needsPosition =
    /路线|线路|游线|行程|推荐|规划|安排|怎么走|怎么玩|哪里好玩|哪儿好玩|带路|带我去|我想去|出发|导航|游览|游玩|逛|亲子|推车|体力|轻松|省力|老人|带娃|孩子|\d+岁|厕所|返程|回去|休息|餐饮|吃饭|咖啡|补给|入口|出口|小时|分钟/.test(
      text,
    );
  if (!needsPosition) return getTripContext();
  let position: TripPosition | null | undefined;
  try {
    position = await locate?.();
  } catch {
    position = null;
  }
  const { position: _previous, ...context } = getTripContext();
  return { ...context, ...(position ? { position } : {}) };
}
