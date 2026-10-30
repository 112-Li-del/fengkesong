import type { UIMessage } from "ai";
import { describe, expect, it } from "vitest";
import { injectPlaceContext, readSelectedPlace } from "./place-context";

const place = {
  name: "哼哈殿",
  referenceCode: "A2",
  referenceName: "哼哈殿",
  address: "近郊栖霞街88号(近栖霞大道)栖霞山风景名胜区内(西侧)",
  lng: 118.956292,
  lat: 32.150991,
};

function userMessage(text: string, metadata?: unknown): UIMessage {
  return {
    id: "user-1",
    role: "user",
    parts: [{ type: "text", text }],
    ...(metadata ? { metadata } : {}),
  } as UIMessage;
}

describe("injectPlaceContext", () => {
  it("把选点信息补成模型可见、界面上不显示的上下文", () => {
    const [message] = injectPlaceContext([
      userMessage("介绍一下哼哈殿", { custom: { qixiaPlace: place } }),
    ]);
    const [context, visible] = message!.parts as {
      type: string;
      text: string;
    }[];
    expect(context?.text).toContain("[地图选中]");
    expect(context?.text).toContain("哼哈殿");
    expect(context?.text).toContain("118.956292,32.150991");
    expect(context?.text).toContain("不是用户的当前位置");
    expect(visible?.text).toBe("介绍一下哼哈殿");
  });

  it("重复调用不会叠加上下文", () => {
    const once = injectPlaceContext([
      userMessage("介绍一下哼哈殿", { custom: { qixiaPlace: place } }),
    ]);
    const twice = injectPlaceContext(once);
    expect(twice[0]?.parts).toHaveLength(2);
  });

  it("没有选点、坐标无效或不是用户消息时保持原样", () => {
    const plain = userMessage("介绍一下哼哈殿");
    expect(injectPlaceContext([plain])[0]).toBe(plain);
    const broken = userMessage("介绍一下哼哈殿", {
      custom: { qixiaPlace: { ...place, lng: Number.NaN } },
    });
    expect(injectPlaceContext([broken])[0]).toBe(broken);
    const assistant = {
      id: "a1",
      role: "assistant",
      parts: [{ type: "text", text: "好的" }],
      metadata: { custom: { qixiaPlace: place } },
    } as UIMessage;
    expect(injectPlaceContext([assistant])[0]).toBe(assistant);
  });
});

describe("readSelectedPlace", () => {
  it("字段不全时宁可返回 null", () => {
    expect(readSelectedPlace(undefined)).toBeNull();
    expect(readSelectedPlace({ custom: {} })).toBeNull();
    expect(
      readSelectedPlace({ custom: { qixiaPlace: { lng: 1, lat: 2 } } }),
    ).toBeNull();
    expect(readSelectedPlace({ custom: { qixiaPlace: place } })).toMatchObject({
      name: "哼哈殿",
      referenceCode: "A2",
    });
  });
});
