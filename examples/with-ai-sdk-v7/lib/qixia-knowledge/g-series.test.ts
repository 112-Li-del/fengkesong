import { describe, it, expect } from "vitest";
import { getQixiaKnowledgeByName } from "./catalog";

describe("新增 13 个点位卡片检索", () => {
  const cases: [string, string][] = [
    ["禹王碑", "G1"],
    ["了凡问道", "G2"],
    ["桃花扇亭", "G3"],
    ["凌虚室遗址", "G4"],
    ["「太古」摩崖石刻", "G5"],
    ["栖霞飞天", "G6"],
    ["白莲池（月牙池）", "G7"],
    ["毗卢宝殿", "G8"],
    ["中峰涧", "G9"],
    ["紫峰阁", "G10"],
    ["寂然法师像", "G11"],
    ["龙山", "G12"],
    ["景区南门", "G13"],
  ];
  for (const [name, code] of cases) {
    it(`${name} 能检索到`, () => {
      const p = getQixiaKnowledgeByName(name);
      expect(p).toBeTruthy();
      expect(p!.referenceCode).toBe(code);
    });
  }
});
