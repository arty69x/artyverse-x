import { describe, it, expect } from "vitest";
import {
  storefrontSchema,
  storefrontDraftSchema,
  storefrontPresets,
  createStorefrontCode,
} from "../../shared/storefront";
import { itemInput } from "../../shared/schema";
import { exportCode } from "../../src/v2/sandbox";
describe("Storefront artifact and safe drafting boundary", () => {
  it("retains an incomplete editable draft but blocks invalid artifact creation", () => {
    const draft = { ...storefrontPresets.editorial, brand: "" };
    expect(storefrontDraftSchema.safeParse(draft).success).toBe(true);
    expect(() => createStorefrontCode(draft)).toThrow();
    expect(
      storefrontSchema.safeParse({
        ...draft,
        brand: "Valid",
        accent: "unsupported",
      }).success,
    ).toBe(false);
  });
  it("escapes user headline content and strips executable fields from imported configuration", () => {
    const value = {
      ...storefrontPresets.editorial,
      headline: "<script>window.ATTACK=1</script>",
      highlight: "<b>my text</b>",
      js: 'fetch("https://attacker.invalid")',
    };
    const code = createStorefrontCode(value);
    expect(code.html).toContain("&lt;script&gt;");
    expect(code.html).not.toContain("<script>window.ATTACK");
    expect(code.html).toContain("&lt;b&gt;my text&lt;/b&gt;");
    expect(code.js).not.toContain("attacker.invalid");
  });
  it("both original templates produce documents accepted by the existing editor API contract", () => {
    for (const preset of Object.values(storefrontPresets)) {
      const artifact = createStorefrontCode(preset);
      const result = itemInput.safeParse({
        kind: "code",
        title: "Exported storefront",
        data: artifact,
      });
      expect(result.success).toBe(true);
      expect(artifact.html).toContain(preset.brand);
      expect(artifact.css).toContain("@container storefront");
      expect(artifact.overrides).toEqual([]);
    }
  });
  it("exports an independent, explicitly labeled sample storefront without network dependencies", () => {
    const code = createStorefrontCode(storefrontPresets.editorial),
      html = exportCode(code, "Storefront");
    expect(html).toContain("ไม่มีการชำระเงิน");
    expect(html).toContain("<svg");
    expect(html).not.toMatch(/<script\s+src|<link\s+[^>]*href=|fetch\(/);
    expect(code.js).toContain("showModal()");
    expect(html).toContain('data-filter="แฟชั่น"');
  });
});
