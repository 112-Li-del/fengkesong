import { selectTripGate } from "./trip-route";
import { z } from "zod";
import { scenicPlaces, facilityPlaces } from "./qixia-map";
import { scenicRoutes, scenicLevel } from "./scenic-display";
import { lookupQixiaKnowledge } from "./qixia-knowledge";
import { readTripContext } from "./trip-context";
import type { LngLat, Place } from "../components/map/amap-types";
export const tripRequestSchema = z.object({
  date: z
    .string()
    .regex(/^(today|tomorrow|day_after_tomorrow|\d{4}-\d{2}-\d{2})$/)
    .default("today")
    .describe("游览日期：today、tomorrow、day_after_tomorrow 或 YYYY-MM-DD"),
  minutes: z.number().int().min(15).max(480).default(120),
  stamina: z.enum(["low", "normal", "high"]).default("normal"),
  childAge: z.number().min(0).max(17).optional(),
  stroller: z
    .boolean()
    .optional()
    .describe("仅在游客说明带或不带推车时填写；未说明则省略"),
  interests: z
    .array(z.enum(["culture", "autumn", "family", "rest"]))
    .max(4)
    .default([]),
  mustVisit: z
    .array(z.string().max(60))
    .max(4)
    .default([])
    .describe(
      "游客点名要去的具体景点，例如桃花湖、千佛岩。必须尽量排进路线；不能静默漏掉，排不进去要说明原因。",
    ),
  startName: z
    .string()
    .max(60)
    .optional()
    .describe(
      "游客明确提到的入园门或起点，例如西门；即使已有定位也保留入园门，实际行走仍从当前位置开始",
    ),
  returnName: z
    .string()
    .max(60)
    .optional()
    .describe(
      "仅填写游客明确指定的具体返程地点；回入园门、原入口时省略，由工具沿用本次入园门",
    ),
  visited: z.array(z.string().max(60)).max(120).default([]),
  need: z
    .enum(["tour", "toilet", "rest", "food", "supply", "return"])
    .default("tour"),
});
export type TripRequest = z.infer<typeof tripRequestSchema>;
const distance = (a: LngLat, b: LngLat) =>
  Math.round(Math.hypot((a.lng - b.lng) * 94300, (a.lat - b.lat) * 111200));
const culture = new Set([
  "栖霞古寺",
  "彩虹明镜",
  "舍利塔",
  "千佛岩",
  "哼哈殿",
  "明征君碑",
  "忆君禅画展览",
  "云谷艺术馆",
]);
const autumn = new Set(["红叶谷", "桃花湖", "枫林湖", "读枫阁", "天开岩"]);
const hills = new Set([
  "凤翔峰",
  "虎山",
  "龙山",
  "山崖",
  "一线天",
  "读枫阁",
  "始皇临江处",
  "天开岩",
  "纱帽峰",
  "飞越丛林",
]);
export type WalkingLeg = {
  distanceMeters: number;
  minutes: number;
  instructions: string[];
};
const PLACE_ALIASES: Record<string, string> = {
  栖霞寺: "栖霞古寺",
  栖霞禅寺: "栖霞古寺",
  明镜湖: "彩虹明镜",
  西门: "西门售票处",
  南门: "南门售票处",
  栖霞山西门: "西门售票处",
  栖霞山南门: "南门售票处",
};

/** 从游客原话里认出点名的景点，模型没填 mustVisit 时兜底。 */
export function namedPlacesIn(text: string, existing: string[] = []) {
  const names = new Set(existing);
  const scenicNames = new Set(scenicPlaces.map((place) => place.name));
  for (const place of scenicPlaces)
    if (place.name.length >= 2 && text.includes(place.name))
      names.add(place.name);
  // 别名只认落到景点上的那些；「西门」「南门」是入口，不是要去的景点。
  for (const [alias, name] of Object.entries(PLACE_ALIASES))
    if (text.includes(alias) && scenicNames.has(name)) names.add(name);
  return [...names].slice(0, 4);
}
const walkingCache = new Map<string, { expires: number; value: WalkingLeg }>();
let walkingQueue: Promise<void> = Promise.resolve();
let nextWalkingAt = 0;
const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

async function walkingSlot(signal?: AbortSignal) {
  const slot = walkingQueue.then(async () => {
    if (signal?.aborted) throw signal.reason;
    await wait(Math.max(0, nextWalkingAt - Date.now()));
    if (signal?.aborted) throw signal.reason;
    nextWalkingAt = Date.now() + 420;
  });
  walkingQueue = slot.catch(() => {});
  await slot;
}

export async function fetchWalkingLeg(
  from: LngLat,
  to: LngLat,
  signal?: AbortSignal,
): Promise<WalkingLeg | null> {
  const key = process.env.AMAP_WEB_SERVICE_KEY?.trim();
  if (!key) return null;
  if (signal?.aborted) return null;
  if (distance(from, to) < 3)
    return { distanceMeters: 0, minutes: 0, instructions: [] };
  const coordinates = [from.lng, from.lat, to.lng, to.lat].map((n) =>
    n.toFixed(6),
  );
  const cacheKey = coordinates.join(",");
  const cached = walkingCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.value;
  const request = async (): Promise<WalkingLeg | null> => {
    const url = new URL("https://restapi.amap.com/v3/direction/walking");
    url.searchParams.set("key", key);
    url.searchParams.set("origin", coordinates.slice(0, 2).join(","));
    url.searchParams.set("destination", coordinates.slice(2).join(","));
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        await walkingSlot(signal);
        const response = await fetch(url, {
          signal: signal
            ? AbortSignal.any([signal, AbortSignal.timeout(6000)])
            : AbortSignal.timeout(6000),
        });
        if (response.status === 429) {
          if (attempt === 0) await wait(1100);
          continue;
        }
        if (!response.ok) return null;
        const data = await response.json();
        if (/QPS|TOO_FREQUENT/.test(data.info ?? "")) {
          if (attempt === 0) await wait(1100);
          continue;
        }
        const path = data.status === "1" ? data.route?.paths?.[0] : null;
        const meters = Number(path?.distance),
          seconds = Number(path?.duration);
        if (
          !path ||
          !Number.isFinite(meters) ||
          !Number.isFinite(seconds) ||
          meters < 0 ||
          seconds < 0
        )
          return null;
        return {
          distanceMeters: meters,
          minutes: Math.ceil(seconds / 60),
          instructions: (path.steps ?? [])
            .map((step: { instruction?: string }) => step.instruction ?? "")
            .filter(Boolean),
        };
      }
    } catch {
      return null;
    }
    return null;
  };
  if (walkingCache.size >= 512)
    walkingCache.delete(walkingCache.keys().next().value!);
  const result = await request();
  if (result)
    walkingCache.set(cacheKey, { expires: Date.now() + 600000, value: result });
  return result;
}

export async function recommendTrip(
  input: TripRequest,
  rawContext: unknown,
  walk: typeof fetchWalkingLeg = fetchWalkingLeg,
) {
  if (
    input.need === "tour" &&
    ((input.interests.includes("family") && input.childAge === undefined) ||
      (input.childAge !== undefined &&
        input.childAge <= 6 &&
        input.stroller === undefined))
  )
    return {
      status: "needs_profile",
      message:
        input.childAge === undefined
          ? "孩子几岁、这次带推车吗？"
          : "这次带推车吗？这会影响路线安排。",
    };
  const context = readTripContext(rawContext);
  const all: Place[] = [...scenicPlaces, ...facilityPlaces];
  const aliases = PLACE_ALIASES;
  const resolve = (name?: string) =>
    all.find((p) => p.name === (name ? (aliases[name] ?? name) : undefined));
  const returnToEntry =
    /^(?:(?:本次)?入园(?:的)?(?:门|入口)|原(?:来(?:的)?)?(?:门|入口)|进来(?:时)?的门|出发的门)$/.test(
      input.returnName?.trim() ?? "",
    );
  const namedReturn = resolve(input.returnName);
  if (input.returnName && !returnToEntry && !namedReturn)
    return {
      status: "needs_return_point",
      message: "请确认返程地点名称，例如西门或南门；暂不替你更换目的地。",
    };
  const namedStart = resolve(input.startName);
  // 用户明确说了入园门、而人还在园外时，从该门起算；否则会把通勤距离当成分段路线。
  const position = context.position?.point;
  const startFromGate =
    namedStart !== undefined &&
    (position === undefined || distance(position, namedStart.location) > 1500);
  const origin = startFromGate
    ? namedStart.location
    : (position ?? namedStart?.location);
  if (!origin)
    return {
      status: "needs_location",
      locationStatus: context.locationStatus,
      message: "请开启定位，或告诉我现在所在的景点/入口。",
      questions: ["预计还有多久游览？", "同行孩子年龄、体力和是否带推车？"],
    };
  const gentle =
    input.stamina === "low" ||
    input.stroller ||
    (input.childAge !== undefined && input.childAge <= 6);
  const originName = !startFromGate && position ? "当前位置" : namedStart!.name;
  const describe = (p: Place) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    distanceFrom: originName,
    location: p.location,
    coordinateSource: p.coordinateSource,
    straightLineMeters: distance(origin, p.location),
    accessNote: /栖霞古镇|栖霞街道栖霞街/.test(p.name + (p.address ?? ""))
      ? "位于古镇或周边，可能需要出园；出入园规则请现场确认。"
      : undefined,
    source:
      p.coordinateSource === "amap-verified"
        ? "高德POI（不是实时营业状态）"
        : "景区导览图估算点位，位置待现场确认",
  });
  const nearby = (group: string) =>
    facilityPlaces
      .filter((p) =>
        group === "rest" ? p.category === "休息" : p.group === group,
      )
      .sort(
        (a, b) => distance(origin, a.location) - distance(origin, b.location),
      )
      .slice(0, 3)
      .map(describe);
  const services = {
    toilets: nearby("toilet"),
    rest: nearby("rest"),
    food: nearby("food"),
    supplies: nearby("supply"),
  };
  const namedGate =
    namedStart?.id === "QXF010" || namedStart?.id === "QXF011"
      ? namedStart.id
      : undefined;
  const entryGate = selectTripGate(origin, namedGate ?? context.entryGate);
  const exit = namedReturn ?? entryGate;
  const route = scenicRoutes.find((r) => r.id === context.route);
  const pool = scenicPlaces.filter(
    (p) =>
      p.coordinateSource === "amap-verified" &&
      !input.visited.some((name) => (aliases[name] ?? name) === p.name) &&
      distance(origin, p.location) > 35 &&
      (!gentle || !hills.has(p.name)),
  );
  const ranked = pool.sort((a, b) => {
    const score = (p: typeof a) =>
      (route?.stops.some((n) => n === p.name) ? 120 : 0) +
      (input.interests.includes("culture") && culture.has(p.name) ? 80 : 0) +
      (input.interests.includes("autumn") && autumn.has(p.name) ? 80 : 0) +
      (5 - scenicLevel(p.name)) * 12 -
      distance(origin, p.location) / 15;
    return score(b) - score(a);
  });
  const mustVisit = input.mustVisit
    .map((name) => scenicPlaces.find((p) => p.name === (aliases[name] ?? name)))
    .filter((place) => place !== undefined);
  const mustIds = new Set(mustVisit.map((place) => place.id));
  const mustVisitNotes: { name: string; reason: string }[] = [];
  const wantedMustVisit = mustVisit;
  // 游客点名要去的地方不因“登高点”直接排除，只提示风险，由回答说明。
  for (const place of mustVisit)
    if (gentle && hills.has(place.name))
      mustVisitNotes.push({
        name: place.name,
        reason: "登高点，台阶与坡度未核验；带老人孩子需现场确认能否前往",
      });
  const limit = gentle ? 3 : 4;
  const picked = [
    ...wantedMustVisit,
    ...ranked.filter((place) => !mustIds.has(place.id)),
  ].slice(0, Math.max(limit, wantedMustVisit.length));
  const ordered: typeof picked = [];
  let cursor = origin;
  while (picked.length) {
    picked.sort(
      (a, b) => distance(cursor, a.location) - distance(cursor, b.location),
    );
    const next = picked.shift()!;
    ordered.push(next);
    cursor = next.location;
  }

  if (input.need !== "tour") {
    const choices =
      input.need === "return"
        ? exit
          ? [describe(exit)]
          : []
        : input.need === "toilet"
          ? services.toilets
          : input.need === "food"
            ? services.food
            : input.need === "supply"
              ? services.supplies
              : services.rest;
    const first = choices[0];
    const from = { name: originName, location: origin };
    const leg =
      first?.coordinateSource === "amap-verified"
        ? await walk(origin, first.location)
        : null;
    const back =
      first &&
      exit?.coordinateSource === "amap-verified" &&
      first.coordinateSource === "amap-verified"
        ? await walk(first.location, exit.location)
        : null;
    const answerDraft = first
      ? [
          leg
            ? "可以先去" +
              first.name +
              "：从" +
              originName +
              "出发，高德步行约" +
              leg.distanceMeters +
              "米、" +
              leg.minutes +
              "分钟。"
            : "附近候选是" +
              first.name +
              "（距" +
              originName +
              "直线约" +
              first.straightLineMeters +
              "米），暂未取得可靠步行路线。",
          input.need !== "return" && back && exit
            ? "从" +
              first.name +
              "回" +
              exit.name +
              "，高德步行约" +
              back.distanceMeters +
              "米、" +
              back.minutes +
              "分钟。"
            : "",
          first.accessNote ?? "",
          "点位来自高德POI或景区导览图；营业、座位及通行情况需现场确认。",
        ]
          .filter(Boolean)
          .join("\n")
      : "当前目录中未找到这类服务点，请向现场工作人员确认。";
    return {
      answerDraft,
      status: "service",
      need: input.need,
      choices,
      walking: leg,
      walkingFrom: from,
      walkingTo: first ?? null,
      returnFrom: first ?? null,
      returnTo: exit ? describe(exit) : null,
      returnWalking: back,
      sourceNote: "点位：高德POI及景区导览图；直线距离不等于步行距离。",
      limits: [
        "营业、价格、厕位及道路是否开放需现场确认。",
        "估算点位不输出精确步行导航。",
      ],
    };
  }
  const segments: {
    culturalNote: {
      overview: string;
      facts: { label: string; value: string }[];
      sourceNote: string;
    } | null;
    from: { location: LngLat; name: string };
    place: ReturnType<typeof describe>;
    walking: WalkingLeg;
    plannedWalkMinutes: number;
    suggestedStayMinutes: number;
    nearby: ReturnType<typeof describe>[];
    returnWalking: WalkingLeg;
  }[] = [];
  const pace = gentle ? 1.5 : 1;
  const hasSteps = (leg: WalkingLeg) =>
    leg.instructions.some((s) => /台阶|楼梯|登山/.test(s));
  cursor = origin;
  let elapsed = 0;
  const droppedMustVisit: { name: string; reason: string }[] = [];
  const mustRecord = (place: Place, reason: string) => {
    if (mustIds.has(place.id))
      droppedMustVisit.push({ name: place.name, reason });
  };
  // 湖心、林中等地物本身可能无法作为步行终点，试几个邻近可达点兜底。
  const snapOffsets = [
    { lng: 0.0003, lat: 0 },
    { lng: -0.0003, lat: 0 },
    { lng: 0, lat: 0.0003 },
    { lng: 0, lat: -0.0003 },
    { lng: 0.0005, lat: 0.0005 },
    { lng: -0.0005, lat: -0.0005 },
  ];
  async function walkFlexible(
    from: { lng: number; lat: number },
    to: { lng: number; lat: number },
    flexible: boolean,
  ) {
    const direct = await walk(from, to);
    if (direct) return { leg: direct, snapped: false };
    if (!flexible) return { leg: null, snapped: false };
    for (const offset of snapOffsets) {
      const retry = await walk(from, {
        lng: to.lng + offset.lng,
        lat: to.lat + offset.lat,
      });
      if (retry) return { leg: retry, snapped: true };
    }
    return { leg: null, snapped: false };
  }
  for (const place of ordered) {
    const isMust = mustIds.has(place.id);
    const forward = await walkFlexible(cursor, place.location, isMust);
    const leg = forward.leg;
    if (!leg) {
      mustRecord(place, "从上一站到这里的步行路段暂未查到");
      continue;
    }
    if (forward.snapped)
      mustVisitNotes.push({
        name: place.name,
        reason: "步行只能到该点附近最近的可达位置，终点与点位约有几十米偏差",
      });
    if (gentle && hasSteps(leg)) {
      mustRecord(place, "该段步行有台阶");
      continue;
    }
    const back =
      exit?.coordinateSource === "amap-verified"
        ? await walk(place.location, exit.location)
        : null;
    if (!back || (gentle && hasSteps(back))) {
      mustRecord(place, "返回入园门的步行路段暂未查到或含台阶");
      continue;
    }
    const dwell = input.minutes <= 60 ? (gentle ? 12 : 8) : gentle ? 20 : 15;
    const paced = Math.ceil(leg.minutes * (gentle ? 1.5 : 1));
    const reserve = Math.ceil(back.minutes * pace) + 15;
    if (elapsed + paced + dwell + reserve > input.minutes) {
      mustRecord(place, "按当前时间安排放不下，需要缩短其他停留");
      continue;
    }
    const nearestServices = ["休息", "卫生间"]
      .flatMap((category) =>
        facilityPlaces
          .filter((p) => p.category === category)
          .sort(
            (a, b) =>
              distance(place.location, a.location) -
              distance(place.location, b.location),
          )
          .slice(0, 1),
      )
      .map((p) => ({
        ...describe(p),
        straightLineMeters: distance(place.location, p.location),
        distanceFrom: place.name,
      }));
    const knowledge = lookupQixiaKnowledge(place.name);
    const culturalNote =
      knowledge.kind === "place" && knowledge.view.coverage !== "none"
        ? {
            overview: knowledge.view.overview,
            facts: knowledge.view.facts.slice(0, 3),
            sourceNote: "栖霞知识库发布口径；可在景点卡片查看资料原文。",
          }
        : null;
    segments.push({
      culturalNote,
      from: {
        location: cursor,
        name: segments.at(-1)?.place.name ?? originName,
      },
      place: describe(place),
      walking: leg,
      plannedWalkMinutes: paced,
      suggestedStayMinutes: dwell,
      nearby: nearestServices,
      returnWalking: back,
    });
    elapsed += paced + dwell;
    cursor = place.location;
  }
  const returnLeg =
    !segments.length && exit?.coordinateSource === "amap-verified"
      ? await walk(origin, exit.location)
      : null;
  const returnMinutes = segments.length
    ? Math.ceil(segments.at(-1)!.returnWalking.minutes * pace)
    : null;
  const walkingMinutes = segments.reduce(
    (sum, segment) => sum + segment.plannedWalkMinutes,
    0,
  );
  const stayMinutes = segments.reduce(
    (sum, segment) => sum + segment.suggestedStayMinutes,
    0,
  );
  const answerDraft = segments.length
    ? [
        "可以这样走：" +
          [originName, ...segments.map((s) => s.place.name), exit!.name].join(
            " → ",
          ) +
          "。",
        "",
        ...segments.map(
          (s) =>
            "- " +
            s.from.name +
            "到" +
            s.place.name +
            "：高德步行约" +
            s.walking.distanceMeters +
            "米、" +
            s.walking.minutes +
            "分钟" +
            (gentle ? "，慢行按" + s.plannedWalkMinutes + "分钟安排" : "") +
            "，停留约" +
            s.suggestedStayMinutes +
            "分钟。",
        ),
        "- " +
          segments.at(-1)!.place.name +
          "回" +
          exit!.name +
          "：高德步行约" +
          segments.at(-1)!.returnWalking.distanceMeters +
          "米、" +
          segments.at(-1)!.returnWalking.minutes +
          "分钟" +
          (gentle ? "，慢行预留" + returnMinutes + "分钟" : "") +
          "。",
        "",
        ...(gentle
          ? [
              "这次把节奏放慢，多留些停留时间。坡度和台阶资料不完整，带推车请先向现场工作人员确认通行。",
            ]
          : []),
        "总计约" +
          (elapsed + returnMinutes! + 15) +
          "分钟（去程行走" +
          walkingMinutes +
          " + 停留" +
          stayMinutes +
          " + 返程" +
          returnMinutes +
          " + 机动15）。",
      ].join("\n")
    : undefined;
  return {
    answerDraft,
    entryGate: entryGate.id,
    plannedStayMinutes: stayMinutes,
    plannedOutboundWalkMinutes: walkingMinutes,
    status: segments.length ? "planned" : "candidates_only",
    originSource: startFromGate ? "用户指定起点" : "当前定位",
    route: route?.name,
    preferences: input,
    mustVisit: mustVisit
      .filter((place) =>
        segments.some((segment) => segment.place.id === place.id),
      )
      .map((place) => place.name),
    mustVisitExcluded: [...mustVisitNotes, ...droppedMustVisit].map(
      (item) => item.name,
    ),
    mustVisitNotes: [...mustVisitNotes, ...droppedMustVisit],
    segments,
    candidates: segments.length ? [] : ranked.slice(0, 3).map(describe),
    services,
    returnFrom: segments.at(-1)?.place ?? {
      name: originName,
      location: origin,
    },
    returnTo: exit ? describe(exit) : null,
    returnWalking: segments.length ? segments.at(-1)!.returnWalking : returnLeg,
    plannedReturnMinutes: segments.length
      ? Math.ceil(segments.at(-1)!.returnWalking.minutes * pace)
      : returnLeg
        ? Math.ceil(returnLeg.minutes * pace)
        : null,
    bufferMinutes: 15,
    totalPlannedMinutes: segments.length
      ? elapsed + Math.ceil(segments.at(-1)!.returnWalking.minutes * pace) + 15
      : null,
    plannedVisitMinutes: elapsed,
    sourceNote:
      "点位：高德POI与景区导览图；步行：高德路径规划；停留及慢行时间为建议安排。",
    limits: [
      "未掌握完整台阶、坡度和无障碍信息；即使未提示台阶，也不能保证推车可通行。",
      "尚未规划出的路段不能编造距离或时间。",
      "出入口开放及返程末班时间请核实，至少预留15分钟机动时间。",
      "天气需另查get_current_weather；有雨或体力下降时缩短路线、优先核实近处室内休息点，不保证场馆或店铺营业。",
    ],
    guidance: gentle
      ? "每段安排休息，避免上山候选；推车先确认通行条件，不能承诺无台阶。"
      : "按兴趣讲重点，时间不足先删减末端站点，保留返程时间。",
  };
}
