import type { recommendTrip } from "./trip-recommendation";
import type { getTripWeather } from "./qixia-weather";

type Plan = Awaited<ReturnType<typeof recommendTrip>>;
type Weather = Awaited<ReturnType<typeof getTripWeather>>;

export function formatTripAnswer(
  plan: Plan,
  weather?: Weather,
): string | undefined {
  if (!plan.answerDraft) return undefined;
  const paragraphs = [plan.answerDraft];
  if (plan.status === "service") return paragraphs.join("\n\n");
  const segments = plan.segments ?? [];
  const rest = [
    ...new Set(
      segments.flatMap((s) =>
        s.nearby.filter((p) => p.name !== "卫生间").map((p) => p.name),
      ),
    ),
  ];
  if (rest.length)
    paragraphs.push(
      "途中想歇一歇，可以就近考虑" +
        rest.join("、") +
        "；营业和座位请现场确认。",
    );
  const toilets = segments.flatMap((s) =>
    s.nearby
      .filter((p) => p.name === "卫生间")
      .map(
        (p) =>
          s.place.name +
          "附近（直线约" +
          p.straightLineMeters +
          "米，" +
          (p.coordinateSource === "amap-verified"
            ? "高德点位"
            : "导览图估算，位置待现场确认") +
          "）",
      ),
  );
  if (toilets.length) paragraphs.push("沿途厕所：" + toilets.join("；") + "。");
  if (plan.preferences?.interests.includes("culture")) {
    const notes = segments
      .filter((s) => s.culturalNote)
      .slice(0, 2)
      .map((s) => s.place.name + "：" + s.culturalNote!.overview);
    if (notes.length)
      paragraphs.push(
        notes.join("\n") + "\n资料：栖霞知识库；原文可在景点卡片查看。",
      );
  }
  if (weather?.status === "success") {
    const day = weather.daily.find((d) => d.date === weather.requestedDate);
    if (day) {
      const chance = day.maxPrecipitationProbability;
      paragraphs.push(
        day.date +
          "栖霞山预报：" +
          day.condition +
          (chance == null ? "" : "，最高降水概率" + chance + "%") +
          "。" +
          "来源：[" +
          weather.source.name +
          "](" +
          weather.source.url +
          ")，获取于" +
          new Intl.DateTimeFormat("zh-CN", {
            timeZone: "Asia/Shanghai",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(weather.retrievedAt)) +
          "；山顶代表点，不是全景区实测。" +
          ("stale" in weather && weather.stale
            ? "当前为上次缓存数据，请留意更新时间。"
            : "") +
          ("notices" in weather ? (weather.notices ?? []) : []).join(""),
      );
    }
  } else if (weather)
    paragraphs.push("所选游览日天气暂未取得，请出发前查看最新预报。");
  const first = segments[0];
  if (first && plan.returnTo) {
    paragraphs.push(
      "下雨或走累了，就缩短到" +
        first.place.name +
        "：从这里回" +
        plan.returnTo.name +
        "，高德步行约" +
        first.returnWalking.distanceMeters +
        "米、" +
        first.returnWalking.minutes +
        "分钟；带孩子或慢行请多留时间。雨大先向工作人员确认就近可避雨处，不必把行程走满。",
    );
  }
  paragraphs.push(
    "路线与点位来自高德及景区导览图；停留与慢行时间是建议安排，出入口开放情况以现场为准。",
  );
  return paragraphs.join("\n\n");
}
