import type { Place } from "../components/map/amap-types";

export const scenicPlacesVerifiedAt = "2026-10-28";
export const deferredScenicPlaces = [
  "霜红苑",
  "桃花涧",
  "桃花坞",
  "印心湖",
  "萌宠乐园",
] as const;

export const referenceScenicPlaces: readonly (Place & {
  referenceName: string;
  referenceCode: string;
})[] = [
  {
    id: "B0L1KKTEQQ",
    name: "栖霞禅寺牌坊",
    address: "栖霞街与20县道交叉口北260米",
    location: {
      lng: 118.954729,
      lat: 32.150758,
    },
    referenceCode: "A1",
    referenceName: "牌坊",
  },
  {
    id: "B0FFHNMDN6",
    name: "哼哈殿",
    address: "近郊栖霞街88号(近栖霞大道)栖霞山风景名胜区内(西侧)",
    location: {
      lng: 118.956292,
      lat: 32.150991,
    },
    referenceCode: "A2",
    referenceName: "哼哈殿",
  },
  {
    id: "B0FFIZWTKW",
    name: "彩虹明镜",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内(西侧)",
    location: {
      lng: 118.956416,
      lat: 32.151627,
    },
    referenceCode: "A4",
    referenceName: "彩虹明镜",
  },
  {
    id: "B00190AK1Z",
    name: "南京栖霞山风景名胜区-桃花湖",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内(西侧)",
    location: {
      lng: 118.962395,
      lat: 32.15523,
    },
    referenceCode: "A7",
    referenceName: "桃花湖",
  },
  {
    id: "B001912JAL",
    name: "卧云亭",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内",
    location: {
      lng: 118.963243,
      lat: 32.155048,
    },
    referenceCode: "A8",
    referenceName: "卧云亭",
  },
  {
    id: "B001912JBJ",
    name: "栖霞山风景名胜区-钟楼",
    address: "栖霞山名胜风景区摄山栖霞寺内(西侧)",
    location: {
      lng: 118.957481,
      lat: 32.151692,
    },
    referenceCode: "B2",
    referenceName: "钟楼",
  },
  {
    id: "B001912JC3",
    name: "栖霞山名胜风景区-鼓楼",
    address: "栖霞街88号栖霞山风景名胜区内(西侧)",
    location: {
      lng: 118.957131,
      lat: 32.151691,
    },
    referenceCode: "B3",
    referenceName: "鼓楼",
  },
  {
    id: "B001912HOX",
    name: "栖霞山名胜风景区-明征君碑",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内西侧",
    location: {
      lng: 118.958533,
      lat: 32.152333,
    },
    referenceCode: "B4",
    referenceName: "明征君碑",
  },
  {
    id: "B00190D2L7",
    name: "栖霞山名胜风景区摄山栖霞寺",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内(西侧)",
    location: {
      lng: 118.957983,
      lat: 32.151807,
    },
    referenceCode: "B5",
    referenceName: "栖霞古寺",
  },
  {
    id: "B001909CRJ",
    name: "栖霞古寺舍利塔",
    address: "栖霞街84号栖霞山名胜风景区",
    location: {
      lng: 118.959868,
      lat: 32.151791,
    },
    referenceCode: "B6",
    referenceName: "舍利塔",
  },
  {
    id: "B001912JE8",
    name: "栖霞山名胜风景区-千佛岩",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区栖霞古寺内",
    location: {
      lng: 118.960159,
      lat: 32.151673,
    },
    referenceCode: "B7",
    referenceName: "千佛岩",
  },
  {
    id: "B0FFFFLDXQ",
    name: "栖霞山风景名胜区-纱帽峰",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内(西南角)",
    location: {
      lng: 118.961202,
      lat: 32.151957,
    },
    referenceCode: "B8",
    referenceName: "纱帽峰",
  },
  {
    id: "B0FFFFA5A4",
    name: "栖霞山风景名胜区-乾隆行宫遗址",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内(西南角)",
    location: {
      lng: 118.961952,
      lat: 32.151514,
    },
    referenceCode: "B9",
    referenceName: "乾隆行宫遗址",
  },
  {
    id: "B00190CQK0",
    name: "栖霞山名胜风景区-话山亭",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内",
    location: {
      lng: 118.96445,
      lat: 32.15501,
    },
    referenceCode: "C1",
    referenceName: "话山亭",
  },
  {
    id: "B001912IQ4",
    name: "栖霞山名胜风景区-天开岩",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区天开岩",
    location: {
      lng: 118.964308,
      lat: 32.155238,
    },
    referenceCode: "C2",
    referenceName: "天开岩",
  },
  {
    id: "B00190AJZJ",
    name: "栖霞山名胜风景区-乾隆御花园",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内",
    location: {
      lng: 118.964293,
      lat: 32.156408,
    },
    referenceCode: "C3",
    referenceName: "乾隆御花园",
  },
  {
    id: "B001909CRH",
    name: "栖霞山名胜风景区-红叶谷",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内(西北角)",
    location: {
      lng: 118.964226,
      lat: 32.157522,
    },
    referenceCode: "C4",
    referenceName: "红叶谷",
  },
  {
    id: "B0FFFFA5IH",
    name: "枫林湖",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内",
    location: {
      lng: 118.966646,
      lat: 32.156922,
    },
    referenceCode: "C5",
    referenceName: "枫林湖",
  },
  {
    id: "B001912IAZ",
    name: "栖霞山名胜风景区-始皇临江",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内",
    location: {
      lng: 118.968394,
      lat: 32.159612,
    },
    referenceCode: "C7",
    referenceName: "始皇临江处",
  },
  {
    id: "B00190AJZI",
    name: "栖霞山风景名胜区-太虚亭",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内",
    location: {
      lng: 118.969327,
      lat: 32.156058,
    },
    referenceCode: "C8",
    referenceName: "太虚亭",
  },
  {
    id: "B00191552W",
    name: "栖霞山名胜风景区-半馆",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内",
    location: {
      lng: 118.967547,
      lat: 32.152673,
    },
    referenceCode: "C10",
    referenceName: "半馆",
  },
  {
    id: "B0FFHLQ4T0",
    name: "栖霞山风景名胜区-百草园",
    address: "栖霞街道近郊栖霞街88号(近栖霞大道)栖霞山风景名胜区内",
    location: {
      lng: 118.967564,
      lat: 32.152374,
    },
    referenceCode: "C11",
    referenceName: "百草园",
  },
  {
    id: "B0FFF05UMW",
    name: "栖霞山名胜风景区-饮马池",
    address: "栖霞街88号(近栖霞大道)栖霞山风景名胜区内",
    location: {
      lng: 118.966308,
      lat: 32.151199,
    },
    referenceCode: "C12",
    referenceName: "饮马池",
  },
  {
    id: "B00190AK1Y",
    name: "陆羽茶庄",
    address: "栖霞大道栖霞山风景区内(近栖霞街)",
    location: {
      lng: 118.964477,
      lat: 32.149745,
    },
    referenceCode: "C13",
    referenceName: "陆羽茶庄",
  },
];

export function collectScenicPlaces(nearby: readonly Place[]): Place[] {
  const liveById = new Map(nearby.map((place) => [place.id, place]));
  const result = new Map<string, Place>();
  for (const reference of referenceScenicPlaces) {
    result.set(reference.id, {
      ...reference,
      ...liveById.get(reference.id),
      referenceCode: reference.referenceCode,
      referenceName: reference.referenceName,
    });
  }
  for (const place of nearby) {
    if (
      !result.has(place.id) &&
      !deferredScenicPlaces.some((name) => place.name.includes(name))
    )
      result.set(place.id, place);
  }
  return [...result.values()];
}
