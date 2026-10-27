import { z } from "zod";

const districtIndexSchema = z.array(
  z.object({
    adcode: z.number().int(),
    name: z.string(),
    level: z.string(),
    parent: z.number().int().nullable(),
    lng: z.number().min(-180).max(180),
    lat: z.number().min(-90).max(90),
  }),
);
type DistrictIndex = z.infer<typeof districtIndexSchema>;
let cached: { value: DistrictIndex; expiresAt: number } | undefined;
let pending: Promise<DistrictIndex> | undefined;

async function loadDistrictIndex() {
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  if (pending) return pending;
  pending = (async () => {
    const response = await fetch(
      "https://geo.datav.aliyun.com/areas_v3/bound/all.json",
      { signal: AbortSignal.timeout(7000), cache: "no-store" },
    );
    if (!response.ok)
      throw new Error("Administrative location index unavailable");
    const value = districtIndexSchema.parse(await response.json());
    if (value.length) cached = { value, expiresAt: Date.now() + 86400000 };
    return value;
  })();
  try {
    return await pending;
  } finally {
    pending = undefined;
  }
}

function shortName(name: string) {
  return name.replace(
    /(?:壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区|省|市)$/,
    "",
  );
}
function wgs84(longitude: number, latitude: number) {
  // DataV coordinates are GCJ-02; Open-Meteo expects WGS84 coordinates.
  const x = longitude - 105,
    y = latitude - 35,
    pi = Math.PI;
  const common =
    ((20 * Math.sin(6 * x * pi) + 20 * Math.sin(2 * x * pi)) * 2) / 3;
  let latDelta =
    -100 +
    2 * x +
    3 * y +
    0.2 * y * y +
    0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x)) +
    common;
  latDelta +=
    ((20 * Math.sin(y * pi) + 40 * Math.sin((y / 3) * pi)) * 2) / 3 +
    ((160 * Math.sin((y / 12) * pi) + 320 * Math.sin((y / 30) * pi)) * 2) / 3;
  let lonDelta =
    300 +
    x +
    2 * y +
    0.1 * x * x +
    0.1 * x * y +
    0.1 * Math.sqrt(Math.abs(x)) +
    common;
  lonDelta +=
    ((20 * Math.sin(x * pi) + 40 * Math.sin((x / 3) * pi)) * 2) / 3 +
    ((150 * Math.sin((x / 12) * pi) + 300 * Math.sin((x / 30) * pi)) * 2) / 3;
  const radians = (latitude / 180) * pi;
  const eccentricity = 0.006693421622965943;
  const magic = 1 - eccentricity * Math.sin(radians) ** 2;
  const root = Math.sqrt(magic);
  latDelta =
    (latDelta * 180) / (((6378245 * (1 - eccentricity)) / (magic * root)) * pi);
  lonDelta = (lonDelta * 180) / ((6378245 / root) * Math.cos(radians) * pi);
  return {
    latitude: Number((latitude - latDelta).toFixed(6)),
    longitude: Number((longitude - lonDelta).toFixed(6)),
  };
}

export async function findChineseDistricts(
  query: string,
  countryCode?: string,
  signal?: AbortSignal,
) {
  if ((countryCode && countryCode !== "CN") || !/[区县]/.test(query)) return [];
  signal?.throwIfAborted();
  const areas = await loadDistrictIndex();
  signal?.throwIfAborted();
  const compact = query.replace(/[\s,，·]/g, "");
  const byCode = new Map(areas.map((area) => [area.adcode, area]));
  const scopes = areas.filter(
    (area) =>
      (area.level === "province" || area.level === "city") &&
      shortName(area.name).length >= 2 &&
      (compact.includes(area.name) || compact.includes(shortName(area.name))),
  );
  return areas
    .filter((area) => {
      if (area.level !== "district" || !compact.includes(area.name))
        return false;
      const ancestry = new Set<number>();
      let parent = area.parent === null ? undefined : byCode.get(area.parent);
      while (parent && !ancestry.has(parent.adcode)) {
        ancestry.add(parent.adcode);
        parent = parent.parent === null ? undefined : byCode.get(parent.parent);
      }
      return scopes.every((scope) => ancestry.has(scope.adcode));
    })
    .map((area) => {
      const parent = area.parent === null ? undefined : byCode.get(area.parent);
      const province =
        parent?.level === "province"
          ? parent
          : parent
            ? parent.parent === null
              ? undefined
              : byCode.get(parent.parent)
            : undefined;
      return {
        id: area.adcode,
        name: area.name,
        country: "中国",
        ...(province ? { admin1: province.name } : {}),
        ...(parent?.level === "city" ? { admin2: parent.name } : {}),
        ...wgs84(area.lng, area.lat),
        feature_code: "ADM3",
        locationSource: {
          name: "阿里云 DataV GeoAtlas（高德行政区划数据）",
          url: "https://datav.aliyun.com/portal/school/atlas/atlas_aigc",
          note: "areas_v3 数据版本为 2021-05，仅用于学习原型。使用该区县代表位置，GCJ-02 已近似转换为 WGS84；天气是该位置的气象模型估算，不是全区实测。",
        },
      };
    });
}
