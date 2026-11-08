import { describe, it, expect } from "vitest";
import {
  patternIds,
  patternStyles,
  defaultPattern,
  createPatternCode,
  patternConfigSchema,
  patternDraftSchema,
  patternPalettes,
} from "../../shared/patterns";
import { codeSchema } from "../../shared/v2/contracts";
import { contrastRatio } from "../../shared/design";
import { exportCode } from "../../src/v2/sandbox";
describe("Original layout recipes and reviewable import boundary", () => {
  it("generates valid distinct code artifacts for all eight layouts and six styles", () => {
    const layouts = new Set<string>();
    for (const id of patternIds) {
      const base = defaultPattern(id);
      layouts.add(createPatternCode(base).html);
      for (const style of patternStyles) {
        const code = createPatternCode({ ...base, style });
        expect(codeSchema.safeParse(code).success).toBe(true);
        expect(exportCode(code, "Original")).not.toMatch(/https?:\/\//);
        expect(code.overrides).toEqual([]);
      }
    }
    expect(layouts.size).toBe(8);
  });
  it("retains incomplete drafts while refusing export and imported executable fields", () => {
    const d = { ...defaultPattern("mosaic"), heading: "" };
    expect(patternDraftSchema.safeParse(d).success).toBe(true);
    expect(patternConfigSchema.safeParse(d).success).toBe(false);
    expect(() => createPatternCode(d)).toThrow();
    expect(
      patternConfigSchema.safeParse({
        ...defaultPattern("mosaic"),
        script: "alert(1)",
      }).success,
    ).toBe(false);
    expect(
      patternConfigSchema.safeParse({
        ...defaultPattern("mosaic"),
        pattern: "../../host",
      }).success,
    ).toBe(false);
  });
  it("escapes user prose and keeps it out of executable script", () => {
    const heading = "<img src=x onerror=alert(1)>";
    const code = createPatternCode({
      ...defaultPattern("statement"),
      heading,
      brand: "</title><script>bad()</script>",
    });
    expect(code.html).toContain("&lt;img");
    expect(code.html).not.toContain("<img src=x");
    expect(code.js).not.toContain(heading);
    expect(code.html).not.toContain("<script>bad()");
  });
  it("keeps sample text and action contrast readable in every exported palette", () => {
    for (const p of Object.values(patternPalettes)) {
      expect(contrastRatio(p.text, p.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(p.muted, p.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(p.onAccent, p.accent)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
