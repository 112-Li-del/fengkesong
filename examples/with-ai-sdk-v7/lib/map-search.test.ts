import { describe, expect, it } from "vitest";
import {
  getMapPlaceKnowledge,
  isPinyinQuery,
  mapSearchCatalog,
  normalizeLatinQuery,
  searchMapPlaces,
  suggestMapPlaces,
} from "./map-search";
import { scenicPlaces, facilityPlaces } from "./qixia-map";

describe("map node search", () => {
  it("includes every scenic and service node exactly once", () => {
    const ids = [...scenicPlaces, ...facilityPlaces].map((place) => place.id);
    expect(mapSearchCatalog.map((place) => place.id).sort()).toEqual(
      [...ids].sort(),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("searches minor nodes, corrected names and aliases without a network", () => {
    expect(
      searchMapPlaces("明镜湖", "全部").map((place) => place.name),
    ).toEqual(["彩虹明镜"]);
    expect(
      searchMapPlaces("月牙池", "全部").map((place) => place.name),
    ).toEqual(["白莲池（月牙池）"]);
    expect(
      searchMapPlaces("玲峰池", "全部").map((place) => place.name),
    ).toEqual(["玲峰池遗址"]);
    expect(searchMapPlaces("不存在的地点", "全部")).toEqual([]);
  });
  it("filters toilets using their node IDs and combines category with keywords", () => {
    const result = searchMapPlaces("", "卫生间");
    expect(result.map((place) => place.id).sort()).toEqual(
      facilityPlaces
        .filter((place) => place.group === "toilet")
        .map((place) => place.id)
        .sort(),
    );
    expect(searchMapPlaces("卫生间", "卫生间")).toEqual(result);
    expect(searchMapPlaces("洗手间", "卫生间")).toEqual(result);
  });
  it("provides service categories using facility category fields", () => {
    expect(
      searchMapPlaces("", "停车交通").map((place) => place.name),
    ).toContain("停车场");
    expect(
      searchMapPlaces("", "门票入口").map((place) => place.name),
    ).toContain("游客中心");
    expect(searchMapPlaces("", "景点").map((place) => place.name)).toContain(
      "哼哈殿",
    );
    expect(searchMapPlaces("", "全部")).toHaveLength(mapSearchCatalog.length);
  });
  it("有关键词时忽略类别，一律全局搜索", () => {
    // 类别停在「卫生间」，搜「哼哈殿」也要能搜到景点本体和它附近的厕所
    const names = searchMapPlaces("哼哈殿", "卫生间").map(
      (place) => place.name,
    );
    expect(names).toContain("哼哈殿");
    expect(names).toContain("卫生间");
    // 类别停在「景点」，搜「卫生间」也要出厕所
    expect(
      searchMapPlaces("卫生间", "景点").every(
        (place) => place.category === "卫生间",
      ),
    ).toBe(true);
    // 空关键词不受影响，仍按类别浏览
    expect(searchMapPlaces("", "卫生间")).toHaveLength(
      facilityPlaces.filter((place) => place.group === "toilet").length,
    );
  });
  it("keeps all scenic nodes in the scenic category, regardless of their use", () => {
    expect(
      searchMapPlaces("", "景点")
        .map((place) => place.id)
        .sort(),
    ).toEqual(scenicPlaces.map((place) => place.id).sort());
    for (const name of ["千佛斋", "陆羽茶庄", "半馆", "卧云亭"])
      expect(
        searchMapPlaces(name, "景点").some((place) => place.name === name),
      ).toBe(true);
  });
  it("partitions every service node into the documented groups", () => {
    const expected = {
      卫生间: ["toilet"],
      停车交通: ["parking", "bus"],
      门票入口: ["gate", "out", "center", "info", "check", "ticket"],
      购物补给: ["shop", "supply"],
      安全医疗: ["medical", "fire", "squad", "phone", "security"],
      休息: ["cafe", "food", "rest"],
    } as const;
    const assigned: string[] = [];
    for (const category of [
      "休息",
      "卫生间",
      "停车交通",
      "门票入口",
      "购物补给",
      "安全医疗",
    ] as const) {
      const result = searchMapPlaces("", category);
      const groups: readonly string[] = expected[category];
      expect(result.map((place) => place.id).sort()).toEqual(
        facilityPlaces
          .filter((place) => groups.includes(place.group))
          .map((place) => place.id)
          .sort(),
      );
      expect(result.every((place) => place.category === category)).toBe(true);
      assigned.push(...result.map((place) => place.id));
    }
    expect(new Set(assigned).size).toBe(facilityPlaces.length);
    expect(assigned.length).toBe(facilityPlaces.length);
    expect(searchMapPlaces("", "全部")).toHaveLength(mapSearchCatalog.length);
  });
});

describe("拼音检索（输入法组字阶段）", () => {
  const names = (query: string) =>
    suggestMapPlaces(query, "全部", 8).map((hit) => hit.place.name);

  it("只把纯字母当拼音，含汉字时仍走原逻辑", () => {
    expect(isPinyinQuery("qianfoyan")).toBe(true);
    expect(isPinyinQuery("qfy")).toBe(true);
    expect(isPinyinQuery("qian fo")).toBe(true);
    expect(isPinyinQuery("千佛")).toBe(false);
    expect(isPinyinQuery("千佛yan")).toBe(false);
    expect(isPinyinQuery("")).toBe(false);
  });

  it("归一化掉分隔符与后置数字", () => {
    expect(normalizeLatinQuery("qian'fo yan")).toBe("qianfoyan");
    expect(normalizeLatinQuery("QFY")).toBe("qfy");
  });

  it("全拼与首字母都能命中", () => {
    expect(names("qianfoyan")[0]).toBe("千佛岩");
    expect(names("qianfo")[0]).toBe("千佛岩");
    expect(names("shelita")[0]).toBe("舍利塔");
    expect(names("qfy")).toContain("千佛岩");
    expect(names("slt")).toContain("舍利塔");
  });

  it("多音字按地名读音", () => {
    expect(names("bore")[0]).toBe("般若台遗址");
    expect(names("shoujiang")).toContain("受降井");
    expect(names("qixia")[0]).toBe("栖霞古寺");
  });

  it("别名拼音也能命中", () => {
    expect(names("mingjinghu")[0]).toBe("彩虹明镜");
    expect(names("mjh")).toContain("彩虹明镜");
    expect(names("qixiasi")).toContain("栖霞古寺");
  });

  it("整词全拼命中排在长前缀之前", () => {
    const top = suggestMapPlaces("shelita", "全部", 8)[0];
    expect(top?.score).toBe(100);
    expect(top?.form).toBe("shelita");
  });

  it("拼音候选恒为全局，不受当前类别限制", () => {
    // 类别停在「卫生间」时打「qianfoyan」，仍应给出景点「千佛岩」
    expect(
      suggestMapPlaces("qianfoyan", "卫生间", 5).map((hit) => hit.place.name),
    ).toContain("千佛岩");
    // 类别停在「景点」时打「weishengjian」，也照样出厕所
    expect(
      suggestMapPlaces("weishengjian", "景点", 5).some(
        (hit) => hit.place.category === "卫生间",
      ),
    ).toBe(true);
  });

  it("候选数量受 limit 约束", () => {
    expect(suggestMapPlaces("q", "全部", 8)).toHaveLength(8);
    expect(suggestMapPlaces("q", "全部", 3)).toHaveLength(3);
  });
});

it("凉亭只归入景点，保留已复核的高德坐标", () => {
  const id = "B0FFHLOUBF";
  expect(
    searchMapPlaces("", "景点").find((p) => p.id === id)?.location,
  ).toEqual({ lng: 118.965351, lat: 32.153623 });
  expect(searchMapPlaces("", "休息").some((p) => p.id === id)).toBe(false);
  expect(mapSearchCatalog.filter((p) => p.id === id)).toHaveLength(1);
});

it.each([
  "摄山栖霞寺售票处",
  "邮局咖啡(栖霞山店)",
  "栖霞古寺素菜馆",
  "枫雅小馆(五松阁休闲驿站)",
  "千佛斋素菜馆",
  "如意甜品(栖霞山店)",
  "星巴克(南京栖霞古镇店)",
  "J CAFE(栖霞古镇店)",
  "肯德基(栖霞古镇店)",
])("地图服务点不展示景区知识卡片：%s", (name) => {
  const place = mapSearchCatalog.find((p) => p.name === name)!;
  expect(place).toBeDefined();
  expect(getMapPlaceKnowledge(place)?.name ?? null).toBeNull();
});

it("服务点即使有古迹引用也不借用知识，景点本体仍能打开自己的卡片", () => {
  const ticket = facilityPlaces.find((p) => p.name === "西门售票处")!;
  expect(
    getMapPlaceKnowledge({
      ...ticket,
      referenceCode: "S0",
      referenceName: "栖霞山",
    })?.name ?? null,
  ).toBeNull();
  for (const name of ["栖霞古寺", "彩虹明镜", "千佛岩"]) {
    const place = scenicPlaces.find((p) => p.name === name)!;
    expect(getMapPlaceKnowledge(place)?.name).toBe(name);
  }
});
