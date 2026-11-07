import { describe, it, expect } from "vitest";
import {
  defaultNodes,
  nodeSchema,
  runWorkflow,
  validateWorkflow,
} from "../../shared/schema";
import { point } from "../../src/core/geometry";
describe("data boundaries", () => {
  it("validates actual editor defaults and rejects unbounded imported dimensions", () => {
    expect(defaultNodes().every((n) => nodeSchema.safeParse(n).success)).toBe(
      true,
    );
    expect(
      nodeSchema.safeParse({ ...defaultNodes()[0], w: Infinity }).success,
    ).toBe(false);
  });
  it("refuses incomplete workflows and segments Thai text", () => {
    expect(validateWorkflow({ source: "", action: "external" })).toHaveLength(
      2,
    );
    expect(() => runWorkflow({ source: "", action: "outline" })).toThrow();
    expect(runWorkflow({ source: "หนึ่ง\nสอง", action: "outline" })).toBe(
      "1. หนึ่ง\n2. สอง",
    );
    expect(
      runWorkflow({ source: "สวัสดีครับ", action: "word-count" }),
    ).toContain("graphemes");
  });
  it("keeps all 16 geometries finite and geometrically distinct", () => {
    const samples = Array.from({ length: 16 }, (_, p) =>
      Array.from({ length: 50 }, (_, i) => point(p, i / 50, 0.3)),
    );
    expect(samples.flat(2).every(Number.isFinite)).toBe(true);
    expect(new Set(samples.map((p) => JSON.stringify(p))).size).toBe(16);
  });
});
