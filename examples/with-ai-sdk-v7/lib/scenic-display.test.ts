import { describe, expect, it } from "vitest";
import {
  layoutScenicPoints,
  scenicLevel,
  scenicRoutes,
} from "./scenic-display";
const points = [
  { id: "core", name: "红叶谷", x: 100, y: 150, width: 80 },
  { id: "popular", name: "虎山", x: 300, y: 150, width: 60 },
  { id: "culture", name: "哼哈殿", x: 500, y: 150, width: 80 },
  { id: "detail", name: "虎爪岩", x: 700, y: 150, width: 80 },
];
describe("景点分级", () => {
  it("所有级别的名称都带贴图，拥挤时收起贴图名称但保留点", () => {
    const shown = layoutScenicPoints(points, 18, 1000, 600, null);
    expect(shown.size).toBe(4);
    for (const point of shown.values()) {
      expect(point.label).not.toBeNull();
      expect(point.art).toBe(true);
    }
    const dense = points.map((p) => ({ ...p, x: 300, y: 300 }));
    const crowded = layoutScenicPoints(dense, 18, 1000, 600, null);
    expect(crowded.size).toBe(4);
    expect([...crowded.values()].filter((p) => p.art).length).toBe(1);
    const selected = layoutScenicPoints(dense, 18, 1000, 600, "detail");
    expect(selected.get("detail")?.art).toBe(true);
  });
  it("全景到细节逐层展开，缩小重新收起", () => {
    for (const [zoom, count] of [
      [15, 1],
      [16, 2],
      [17, 3],
      [18, 4],
      [15, 1],
    ]) {
      const layout = layoutScenicPoints(points, zoom!, 1000, 600, null);
      expect(layout.size).toBe(4);
      expect([...layout.values()].filter((p) => p.label).length).toBe(count);
      for (const state of layout.values())
        expect(state.art).toBe(state.label !== null);
    }
  });
  it("选中和路线站点不受层级限制，取消后恢复", () => {
    expect(
      layoutScenicPoints(points, 15, 1000, 600, "detail").get("detail")?.label,
    ).not.toBeNull();
    expect(
      layoutScenicPoints(
        points,
        15,
        1000,
        600,
        null,
        new Map([["culture", 2]]),
      ).get("culture")?.art,
    ).toBe(true);
    expect(
      layoutScenicPoints(points, 15, 1000, 600, null).get("culture"),
    ).toEqual({ label: null, art: false });
  });
  it("密集路线保留所有点，名称不会无限堆叠，选中优先", () => {
    const dense = Array.from({ length: 30 }, (_, i) => ({
      id: String(i),
      name: "哼哈殿",
      x: 300,
      y: 300,
      width: 80,
    }));
    const layout = layoutScenicPoints(
      dense,
      18,
      600,
      600,
      "29",
      new Map(dense.map((p, i) => [p.id, i + 1])),
    );
    expect(layout.size).toBe(30);
    expect(layout.get("29")?.label).not.toBeNull();
    expect(
      [...layout.values()].filter((p) => p.label).length,
    ).toBeLessThanOrEqual(4);
  });
  it("平移后视窗外不占标签预算", () => {
    expect(
      layoutScenicPoints([{ ...points[0]!, x: -50 }], 18, 1000, 600, null).size,
    ).toBe(0);
  });
  it("路线成员不全设为一级，编号按采用的路线顺序排列", () => {
    expect(scenicLevel("乾隆御花园")).toBe(3);
    expect(scenicRoutes[0].stops[2]).toBe("彩虹明镜");
  });
});
