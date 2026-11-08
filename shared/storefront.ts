import { conceptPalette } from "./concept";
import { z } from "zod";
import type { CodeDocument } from "./v2/contracts";
export const storefrontSchema = z.object({
  schemaVersion: z.literal(1),
  brand: z.string().trim().min(1).max(32),
  headline: z.string().trim().min(1).max(70),
  highlight: z.string().trim().min(1).max(32),
  description: z.string().max(240),
  banner: z.string().max(90),
  accent: z.enum(["lime", "pink"]),
  showBanner: z.boolean(),
});
export const storefrontDraftSchema = storefrontSchema.extend({
  brand: z.string().max(32),
  headline: z.string().max(70),
  highlight: z.string().max(32),
});
export type StorefrontConfig = z.infer<typeof storefrontSchema>;
export const storefrontPresets: Record<string, StorefrontConfig> = {
  editorial: {
    schemaVersion: 1,
    brand: "OBJECT / STUDIO",
    headline: "Objects for",
    highlight: "a different everyday.",
    description:
      "ของใช้ที่มีเรื่องราว งานดีไซน์ที่มีความหมาย คัดสรรสำหรับพื้นที่และชีวิตในแบบคุณ",
    banner: "THE NEW COLLECTION / 2026 — A storefront design sample",
    accent: "lime",
    showBanner: true,
  },
  neon: {
    schemaVersion: 1,
    brand: "AFTERHOURS / EDIT",
    headline: "Make space for",
    highlight: "the unexpected.",
    description:
      "รูปทรงที่กล้าต่าง วัสดุที่น่าสัมผัส และไอเดียที่จะเปลี่ยนมุมเดิมของคุณ",
    banner: "LIMITED EDITION / DESIGN STUDY — Not a live store",
    accent: "pink",
    showBanner: true,
  },
};
export const storefrontColors = {
  paper: "#F5F4F0",
  surface: "#FFFFFF",
  ink: "#18201C",
  muted: "#5C635D",
  line: "#D5D9D1",
  lime: conceptPalette.lime,
  pink: conceptPalette.pink,
  pinkText: conceptPalette.pinkText,
  sage: "#DDE5D4",
  lilac: "#DDD6EB",
  sand: "#E9DFCD",
  blue: "#DDE7EC",
} as const;
export const productCategories = [
  "ทั้งหมด",
  "บ้านและไลฟ์สไตล์",
  "แฟชั่น",
  "งานศิลปะ",
  "ดิจิทัล",
] as const;
export const sampleProducts = [
  {
    id: "sample-orbit-lamp",
    name: "Orbit desk lamp",
    category: "บ้านและไลฟ์สไตล์",
    price: 2490,
    art: "lamp",
    color: "sage",
    caption: "แสงนุ่ม รูปทรงเรียบ สำหรับมุมที่คุณชอบ",
  },
  {
    id: "sample-form-tote",
    name: "Everyday form tote",
    category: "แฟชั่น",
    price: 890,
    art: "tote",
    color: "lilac",
    caption: "กระเป๋าทรงเรียบสำหรับสิ่งจำเป็นในทุกวัน",
  },
  {
    id: "sample-field-notes",
    name: "Field notes / edition 01",
    category: "งานศิลปะ",
    price: 490,
    art: "book",
    color: "sand",
    caption: "พื้นที่สำหรับความคิดที่ยังไม่ต้องสมบูรณ์แบบ",
  },
  {
    id: "sample-arc-stool",
    name: "Arc studio stool",
    category: "บ้านและไลฟ์สไตล์",
    price: 3290,
    art: "stool",
    color: "blue",
    caption: "เส้นโค้งและพื้นที่ว่างที่ออกแบบให้ลงตัว",
  },
  {
    id: "sample-studio-system",
    name: "Studio identity kit",
    category: "ดิจิทัล",
    price: 1290,
    art: "kit",
    color: "sage",
    caption: "ตัวอย่างชุดอัตลักษณ์สำหรับงานสร้างสรรค์",
  },
  {
    id: "sample-graphic-print",
    name: "Balance / art print",
    category: "งานศิลปะ",
    price: 690,
    art: "print",
    color: "lilac",
    caption: "บทสนทนาระหว่างสี เส้น และรูปทรง",
  },
] as const;
export type SampleProduct = (typeof sampleProducts)[number];
export function productShapes(art: SampleProduct["art"]) {
  switch (art) {
    case "lamp":
      return '<ellipse cx="150" cy="259" rx="82" ry="10" fill="currentColor" opacity=".12"/><path d="M142 137h16v105h-16z" fill="var(--sf-ink)"/><ellipse cx="150" cy="244" rx="62" ry="13" fill="var(--sf-ink)"/><path d="M65 132a85 85 0 0 1 170 0z" fill="var(--sf-lime)" stroke="var(--sf-ink)" stroke-width="2"/><ellipse cx="150" cy="132" rx="85" ry="12" fill="var(--sf-ink)"/><ellipse cx="150" cy="133" rx="64" ry="6" fill="var(--sf-surface)" opacity=".6"/>';
    case "tote":
      return '<ellipse cx="150" cy="265" rx="79" ry="9" fill="currentColor" opacity=".1"/><path d="M78 114h144l-12 140H91z" fill="var(--sf-surface)" stroke="var(--sf-ink)" stroke-width="2"/><path d="M118 127V87a32 32 0 0 1 64 0v40" fill="none" stroke="var(--sf-ink)" stroke-width="11"/><path d="m112 199 36-61 40 61z" fill="var(--sf-pink)"/><circle cx="177" cy="155" r="16" fill="var(--sf-ink)"/>';
    case "book":
      return '<ellipse cx="150" cy="265" rx="75" ry="8" fill="currentColor" opacity=".12"/><path d="m74 70 132-20 22 190-132 20z" fill="var(--sf-ink)"/><path d="m85 78 112-17 19 168-112 17z" fill="var(--sf-lime)"/><path d="m115 112 64-10m-61 29 64-10" stroke="var(--sf-ink)" stroke-width="6"/><circle cx="158" cy="186" r="30" fill="var(--sf-ink)"/>';
    case "stool":
      return '<ellipse cx="150" cy="267" rx="88" ry="9" fill="currentColor" opacity=".1"/><path d="m101 140-18 118h17l29-118m47 0 22 118h17l-14-118" fill="var(--sf-ink)"/><path d="M72 124q78-45 156 0v20q-78 44-156 0z" fill="var(--sf-surface)" stroke="var(--sf-ink)" stroke-width="2"/><ellipse cx="150" cy="124" rx="78" ry="29" fill="var(--sf-pink)" stroke="var(--sf-ink)" stroke-width="2"/>';
    case "kit":
      return '<rect x="62" y="71" width="153" height="168" rx="5" transform="rotate(-8 140 150)" fill="var(--sf-ink)"/><rect x="90" y="104" width="142" height="142" rx="4" transform="rotate(8 160 170)" fill="var(--sf-surface)" stroke="var(--sf-ink)"/><path d="m122 201 44-74 44 74z" fill="var(--sf-lime)"/><circle cx="126" cy="141" r="22" fill="var(--sf-pink)"/>';
    default:
      return '<rect x="69" y="48" width="164" height="212" fill="var(--sf-ink)"/><rect x="77" y="56" width="148" height="196" fill="var(--sf-surface)"/><circle cx="149" cy="124" r="47" fill="var(--sf-pink)"/><path d="m94 216 59-96 51 96z" fill="var(--sf-lime)"/><path d="M93 223h112" stroke="var(--sf-ink)" stroke-width="3"/>';
  }
}
export const storefrontCSS = `
.sf-store{--sf-paper:${storefrontColors.paper};--sf-surface:${storefrontColors.surface};--sf-ink:${storefrontColors.ink};--sf-muted:${storefrontColors.muted};--sf-line:${storefrontColors.line};--sf-lime:${storefrontColors.lime};--sf-pink:${storefrontColors.pink};--sf-pinkText:${storefrontColors.pinkText};--sf-sage:${storefrontColors.sage};--sf-lilac:${storefrontColors.lilac};--sf-sand:${storefrontColors.sand};--sf-blue:${storefrontColors.blue};--sf-accent:var(--sf-lime);background:var(--sf-paper);color:var(--sf-ink);font:14px/1.65 system-ui,sans-serif;min-width:0;container-type:inline-size;container-name:storefront}
.sf-store[data-accent=pink]{--sf-accent:var(--sf-pink)}.sf-store *{box-sizing:border-box}.sf-store h1,.sf-store h2,.sf-store h3,.sf-store p{margin:0}.sf-store a{color:inherit}.sf-store :focus-visible{outline:2px solid var(--sf-ink);outline-offset:4px}.sf-store button,.cp-root .sf-store button{color:var(--sf-ink);font:inherit;cursor:pointer;border:0;min-height:44px}.sf-store small,.cp-root .sf-store small{font-size:12px;color:var(--sf-muted)}.sf-store button:disabled{cursor:not-allowed;opacity:.5}.sf-announcement{background:var(--sf-ink);color:var(--sf-surface);padding:9px 20px;text-align:center;font-size:12px;font-weight:600}.sf-shop-header{display:flex;justify-content:space-between;gap:14px;align-items:center;border-bottom:1px solid var(--sf-line);padding:18px 28px;background:var(--sf-surface)}.sf-shop-header>strong{font-size:16px;letter-spacing:-.8px;font-weight:900}.sf-shop-header>span{color:var(--sf-muted);font-size:12px}.sf-shop-header>button{background:var(--sf-paper);border:1px solid var(--sf-line)!important;padding:7px 13px;border-radius:8px;font-size:12px!important;white-space:nowrap}.sf-hero{display:grid;grid-template-columns:1.2fr 1fr;min-height:330px;overflow:hidden;border-bottom:1px solid var(--sf-line);background:var(--sf-paper)}.sf-hero-copy{padding:38px 30px;min-width:0}.sf-overline{font-size:12px;font-weight:700;letter-spacing:1.5px;color:var(--sf-muted);display:flex;align-items:center;gap:8px}.sf-overline:before{content:'';width:6px;height:6px;border-radius:50%;background:var(--sf-pink)}.sf-store .sf-headline,.cp-root .sf-store .sf-headline{font-family:inherit;font-size:clamp(28px,5.3cqw,52px);line-height:1.12;letter-spacing:-2px;font-weight:850;margin:23px 0 20px;overflow-wrap:anywhere}.sf-headline>span{display:block}.sf-headline>em{display:inline;font-style:italic;font-weight:400;text-decoration-line:underline;text-decoration-color:var(--sf-accent);text-decoration-thickness:.15em;text-underline-offset:.12em;text-decoration-skip-ink:auto}.sf-hero-copy>p{font-size:13px;color:var(--sf-muted);line-height:1.9;max-width:360px}.sf-store .sf-shop-now,.cp-root .sf-store .sf-shop-now{display:inline-flex;align-items:center;gap:18px;font-weight:800;background:var(--sf-ink);color:var(--sf-surface);padding:12px 19px;border-radius:6px;margin-top:23px;font-size:12px}.sf-shop-now>span{color:var(--sf-accent)}.sf-hero-art{position:relative;display:grid;place-items:center;min-width:0;background:var(--sf-sage)}.sf-hero-art>svg{position:relative;width:100%;max-width:285px;z-index:1;transform:rotate(-8deg)}.sf-hero-art:before{content:'';position:absolute;width:75%;aspect-ratio:1;border:1px solid var(--sf-surface);border-radius:50%}.sf-hero-art>span{position:absolute;bottom:18px;right:20px;font:12px/1.5 monospace;color:var(--sf-ink);text-align:right}.sf-collection{padding:27px 28px 30px}.sf-collection-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.sf-store .sf-collection-heading h2,.cp-root .sf-store .sf-collection-heading h2{font-family:inherit;font-size:20px;letter-spacing:-.7px;font-weight:800;color:var(--sf-ink)}.sf-collection-heading>span{font-size:12px;color:var(--sf-muted)}.sf-categories{display:flex;gap:8px;overflow-x:auto;margin:17px 0 23px;padding-bottom:5px}.sf-categories>button,.cp-root .sf-categories>button{background:transparent;border:1px solid var(--sf-line);border-radius:7px;padding:8px 13px;font-size:12px;white-space:nowrap}.sf-categories>button[aria-pressed=true],.cp-root .sf-categories>button[aria-pressed=true]{background:var(--sf-ink);color:var(--sf-surface);border-color:var(--sf-ink);font-weight:700}.sf-product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px 14px}.sf-product,.cp-root .sf-product{display:block;text-align:left;background:transparent;min-width:0;padding:0!important}.sf-product-art{position:relative;overflow:hidden;border-radius:8px;background:var(--sf-sage);aspect-ratio:1}.sf-product-art>svg{display:block;width:100%;height:100%;transition:transform .3s}.sf-product:hover .sf-product-art>svg{transform:translateY(-4px) rotate(-2deg)}.sf-product-art>.sf-product-number{position:absolute;top:11px;left:12px;color:var(--sf-ink);font:12px monospace}.sf-product-meta{display:flex;justify-content:space-between;align-items:start;gap:7px;margin-top:11px}.sf-product-meta strong{font-size:12px;font-weight:800;line-height:1.6}.sf-product-meta>span{font-size:15px}.sf-product>small{display:block;margin-top:3px}.sf-sample-disclosure{font-size:12px;color:var(--sf-muted);line-height:1.8;border-top:1px solid var(--sf-line);padding:17px 28px;background:var(--sf-surface)}.sf-store dialog{background:var(--sf-surface);color:var(--sf-ink);border:1px solid var(--sf-line);border-radius:14px;max-width:430px;padding:25px;width:calc(100% - 32px)}.sf-store dialog::backdrop{background:color-mix(in srgb,var(--sf-ink),transparent 40%)}.sf-store dialog button{padding:10px 15px;border:1px solid var(--sf-line);border-radius:6px;background:var(--sf-paper);margin-top:10px}.sf-store dialog p{margin:10px 0}.sf-store [hidden]{display:none!important}
@container storefront (max-width:620px){.sf-shop-header{padding:16px 20px}.sf-shop-header>span{display:none}.sf-hero{grid-template-columns:1.1fr 1fr;min-height:290px}.sf-hero-copy{padding:26px 20px}.sf-hero-copy>p{font-size:12px}.sf-hero-art>span{right:12px;font-size:12px}.sf-collection{padding:23px 20px}.sf-product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.sf-sample-disclosure{padding:16px 20px}.sf-headline{letter-spacing:-1.3px!important}.sf-collection-heading{align-items:start;flex-direction:column;gap:4px}}
@container storefront (max-width:440px){.sf-hero{grid-template-columns:1fr}.sf-hero-copy{padding:29px 23px}.sf-headline{font-size:37px!important;letter-spacing:-1.8px!important}.sf-hero-art{min-height:190px}.sf-hero-art>svg{height:220px;max-width:240px}.sf-shop-header>strong{font-size:14px}.sf-product-grid{gap:18px 12px}.sf-product-meta{gap:3px}.sf-product-meta strong{font-size:12px}.sf-product>small{font-size:12px}.sf-announcement{padding:10px 16px}.sf-collection{padding:23px 16px}.sf-categories{margin-bottom:19px}.sf-categories>button{padding:8px 11px}.sf-store .sf-headline,.cp-root .sf-store .sf-headline{font-size:clamp(28px,10cqw,38px)!important}}
@media(prefers-reduced-motion:reduce){.sf-store *{transition:none!important;animation:none!important}.sf-product:hover .sf-product-art>svg{transform:none}}
`;
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function createStorefrontCode(value: StorefrontConfig): CodeDocument {
  const c = storefrontSchema.parse(value);
  const cards = sampleProducts
    .map(
      (p, i) =>
        `<button class="sf-product" data-category="${p.category}" data-title="${escape(p.name)}" data-description="${escape(p.caption)}" data-price="${p.price}"><div class="sf-product-art" style="background:var(--sf-${p.color})"><span class="sf-product-number">${String(i + 1).padStart(2, "0")}</span><svg viewBox="0 0 300 300" aria-hidden="true">${productShapes(p.art)}</svg></div><div class="sf-product-meta"><strong>${escape(p.name)}</strong><span><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></span></div><small>ราคาตัวอย่าง ฿${p.price.toLocaleString("th-TH")}</small></button>`,
    )
    .join("");
  return {
    schemaVersion: 2,
    html: `<main class="sf-store" data-accent="${c.accent}">${c.showBanner ? `<div class="sf-announcement">${escape(c.banner)}</div>` : ""}<header class="sf-shop-header"><strong>${escape(c.brand)}</strong><span>Objects. Stories. A different perspective.</span><button id="sample-bag" type="button">Sample bag · <span id="bag-count">0</span></button></header><section class="sf-hero"><div class="sf-hero-copy"><span class="sf-overline">THE CONSIDERED COLLECTION</span><h1 class="sf-headline"><span>${escape(c.headline)}</span><em>${escape(c.highlight)}</em></h1><p>${escape(c.description)}</p><button class="sf-shop-now" type="button">สำรวจคอลเลกชัน <span><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></span></button></div><div class="sf-hero-art"><svg viewBox="0 0 300 300" aria-hidden="true">${productShapes("lamp")}</svg><span>01 / ORBIT SERIES<br>DESIGN STUDY</span></div></section><section class="sf-collection" id="collection"><div class="sf-collection-heading"><h2>Everyday, reimagined.</h2><span>6 objects · sample collection</span></div><div class="sf-categories" aria-label="Product categories">${productCategories.map((cat, i) => `<button type="button" data-filter="${cat}" aria-pressed="${i === 0}">${cat}</button>`).join("")}</div><div class="sf-product-grid">${cards}</div></section><footer class="sf-sample-disclosure">ตัวอย่างหน้าร้าน · สินค้าและราคาเป็นข้อมูลสาธิต ไม่มีการชำระเงินหรือส่งคำสั่งซื้อ</footer><dialog id="product-detail"><h2></h2><p></p><button id="sample-add" type="button">เพิ่มในถุงตัวอย่าง</button><button id="close-detail" type="button">ปิด</button></dialog></main>`,
    css: "body{margin:0;}" + storefrontCSS,
    js: `const detail=document.getElementById('product-detail');let bag=0;document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('.sf-product').forEach(p=>p.hidden=b.dataset.filter!=='ทั้งหมด'&&p.dataset.category!==b.dataset.filter)}));document.querySelector('.sf-shop-now').addEventListener('click',()=>document.getElementById('collection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'}));document.querySelectorAll('.sf-product').forEach(b=>b.addEventListener('click',()=>{detail.querySelector('h2').textContent=b.dataset.title;detail.querySelector('p').textContent=b.dataset.description+' / ราคาตัวอย่าง ฿'+b.dataset.price;document.getElementById('sample-add').hidden=false;detail.showModal()}));document.getElementById('close-detail').onclick=()=>detail.close();document.getElementById('sample-add').onclick=()=>{document.getElementById('bag-count').textContent=String(++bag);detail.close()};document.getElementById('sample-bag').onclick=()=>{detail.querySelector('h2').textContent='Sample bag: '+bag;detail.querySelector('p').textContent='การเลือกเพื่อทดลองเท่านั้น ไม่มีคำสั่งซื้อหรือระบบชำระเงิน';document.getElementById('sample-add').hidden=true;detail.showModal()};console.log('Local storefront ready — sample data, no checkout');`,
    overrides: [],
  };
}
