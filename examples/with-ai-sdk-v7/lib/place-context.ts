// 地图选点的隐藏上下文：界面上只显示一句自然的话，坐标、POI 与「不代表当前位置」
// 这类机器信息放在消息的 metadata.custom 里，由服务端注入给模型，不进入对话气泡。
// 与 @assistant-ui/ai-sdk 的 injectQuoteContext 同一套做法。

import type { UIMessage } from "ai";
import { formatPlaceContext } from "./qixia-chat-prompt";

export type SelectedPlaceContext = {
  name: string;
  referenceCode?: string;
  referenceName?: string;
  address?: string;
  lng: number;
  lat: number;
  poiId?: string;
};

export const PLACE_CONTEXT_KEY = "qixiaPlace";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function text(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

/** 从消息 metadata 里读出地图选点；字段不全时返回 null，宁可不注入。 */
export function readSelectedPlace(
  metadata: unknown,
): SelectedPlaceContext | null {
  const custom = asRecord(asRecord(metadata)?.custom);
  const place = asRecord(custom?.[PLACE_CONTEXT_KEY]);
  if (!place) return null;
  const name = text(place.name, 60);
  const lng = place.lng;
  const lat = place.lat;
  if (!name || typeof lng !== "number" || typeof lat !== "number") return null;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  const code = text(place.referenceCode, 12)?.toUpperCase();
  const referenceCode = code && /^[A-Z]\d{1,3}$/.test(code) ? code : undefined;
  const referenceName = text(place.referenceName, 60);
  const address = text(place.address, 120);
  const poiId = text(place.poiId, 40);
  return {
    name,
    lng,
    lat,
    ...(referenceCode ? { referenceCode } : {}),
    ...(referenceName ? { referenceName } : {}),
    ...(address ? { address } : {}),
    ...(poiId ? { poiId } : {}),
  };
}

/**
 * 在 convertToModelMessages 之前调用：给带选点信息的用户消息前面补一段
 * 模型可见、用户看不到的上下文。重复调用不会叠加。
 */
export function injectPlaceContext(messages: UIMessage[]): UIMessage[] {
  return messages.map((message) => {
    if (message.role !== "user") return message;
    const place = readSelectedPlace(message.metadata);
    if (!place) return message;
    const text = `${formatPlaceContext(place)}\n\n`;
    const alreadyInjected =
      message.parts?.[0]?.type === "text" && message.parts[0].text === text;
    if (alreadyInjected) return message;
    return {
      ...message,
      parts: [{ type: "text" as const, text }, ...(message.parts ?? [])],
    };
  });
}
