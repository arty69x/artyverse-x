import { z } from "zod";
import { codeSchema, type CodeDocument } from "./v2/contracts";
export const patternIds = [
  "editorial",
  "mosaic",
  "focus",
  "chapters",
  "depth",
  "statement",
  "spatial",
  "catalog",
] as const;
export const patternStyles = [
  "editorial",
  "luxury",
  "fashion",
  "neon",
  "minimal",
  "modular",
] as const;
export const patternRecipes = [
  {
    id: "editorial",
    name: "The editorial reel",
    th: "เรื่องเล่าผ่านภาพ",
    category: "Editorial",
    sources: ["S04", "S06"],
    description:
      "Oversized type, quiet metadata and a horizontal collection of work.",
    route: "story",
  },
  {
    id: "mosaic",
    name: "A modular universe",
    th: "จักรวาลแบบโมดูล",
    category: "Layout",
    sources: ["S09", "S01"],
    description:
      "One lead story. Supporting tiles. A grid with a clear rhythm.",
    route: "create",
  },
  {
    id: "focus",
    name: "A focused beginning",
    th: "เริ่มอย่างชัดเจน",
    category: "Layout",
    sources: ["S08", "S03"],
    description:
      "A calm hero, useful categories and a searchable project grid.",
    route: "builder",
  },
  {
    id: "chapters",
    name: "Chapters in motion",
    th: "เรื่องราวทีละบท",
    category: "Motion",
    sources: ["S02", "S06"],
    description:
      "Native scrolling, a sticky chapter marker and accessible story panels.",
    route: "live",
  },
  {
    id: "depth",
    name: "A different dimension",
    th: "มิติใหม่ของผลงาน",
    category: "Motion",
    sources: ["S05", "S07"],
    description: "Perspective, scroll snap and keyboard controls. No autoplay.",
    route: "design",
  },
  {
    id: "statement",
    name: "Words with presence",
    th: "ข้อความที่มีพลัง",
    category: "Typography",
    sources: ["S10", "S01"],
    description:
      "Bold and thin type, stepped composition and one decisive accent.",
    route: "design-system",
  },
  {
    id: "spatial",
    name: "Room for what’s next",
    th: "พื้นที่สำหรับก้าวต่อไป",
    category: "Layout",
    sources: ["S11", "S01"],
    description:
      "Asymmetry, layered vectors and a spacious closing invitation.",
    route: "create",
  },
  {
    id: "catalog",
    name: "A working collection",
    th: "คอลเลกชันที่ใช้งานได้",
    category: "Collection",
    sources: ["S07", "S12"],
    description:
      "Search, filter and inspect a collection without losing your place.",
    route: "library",
  },
] as const;
export const patternDraftSchema = z
  .object({
    schemaVersion: z.literal(1),
    pattern: z.enum(patternIds),
    style: z.enum(patternStyles),
    brand: z.string().max(40),
    heading: z.string().max(140),
    description: z.string().max(600),
  })
  .strict();
export const patternConfigSchema = patternDraftSchema.extend({
  brand: z.string().trim().min(1).max(40),
  heading: z.string().trim().min(1).max(140),
});
export type PatternConfig = z.infer<typeof patternDraftSchema>;
export function defaultPattern(id: (typeof patternIds)[number]): PatternConfig {
  return {
    schemaVersion: 1,
    pattern: id,
    style:
      id === "mosaic"
        ? "modular"
        : id === "depth"
          ? "neon"
          : id === "statement"
            ? "fashion"
            : "editorial",
    brand: "ARTYVERSE",
    heading: patternRecipes.find((p) => p.id === id)!.name,
    description:
      "Original editable sample. Bring your ideas, work and stories into a new composition. / ตัวอย่างที่แก้ไขได้ เปลี่ยนเป็นเรื่องราวของคุณ",
  };
}
export const patternStyleRules: Record<(typeof patternStyles)[number], string> =
  {
    editorial:
      "h1,.statement h2{font-family:Georgia,serif;font-weight:400;letter-spacing:-.055em}.work{border-radius:3px}.work-meta{padding:28px}",
    luxury:
      "h1,.outro h2{font-family:Georgia,serif;font-weight:400}.top,.eyebrow{letter-spacing:.16em}.work,.focus-art{border-radius:2px}.work-meta{padding:28px}",
    fashion:
      "h1{font-weight:900;text-transform:uppercase;letter-spacing:-.07em}.work{border-radius:0}.work-meta>span{letter-spacing:.15em}.collection-grid{gap:10px}",
    neon: "h1,.eyebrow,.section-line{font-family:ui-monospace,monospace}h1{font-weight:750;letter-spacing:-.07em}.work{border-radius:18px}.work-meta{border-top:1px solid var(--line)}",
    minimal:
      "h1{font-weight:350}.work{border-radius:4px;border-color:transparent}.art{background:var(--surface)}.top{border-bottom:0}.intro{padding-block:100px 65px}",
    modular:
      "h1{font-weight:800}.work{border-radius:0}.mosaic,.collection-grid,.catalog-grid{gap:1px;background:var(--line);border:1px solid var(--line)}.section-line{font-family:ui-monospace,monospace}",
  };
export const patternPalettes = {
  editorial: {
    bg: "#F5F2EB",
    surface: "#FFFFFF",
    text: "#171816",
    muted: "#575B55",
    line: "#CFD1C8",
    accent: "#CCFF00",
    onAccent: "#111700",
  },
  luxury: {
    bg: "#11110F",
    surface: "#1C1D19",
    text: "#F4F1E8",
    muted: "#BBB9AA",
    line: "#565447",
    accent: "#E1CD98",
    onAccent: "#25200E",
  },
  fashion: {
    bg: "#F2EDEB",
    surface: "#FFFFFF",
    text: "#181419",
    muted: "#675668",
    line: "#CBBFCB",
    accent: "#D4006A",
    onAccent: "#FFFFFF",
  },
  neon: {
    bg: "#0A0B15",
    surface: "#171827",
    text: "#F1F0FB",
    muted: "#B2B3C8",
    line: "#484A6D",
    accent: "#CCFF00",
    onAccent: "#101600",
  },
  minimal: {
    bg: "#FFFFFF",
    surface: "#F5F5F1",
    text: "#111111",
    muted: "#555953",
    line: "#CDCFCA",
    accent: "#151813",
    onAccent: "#FFFFFF",
  },
  modular: {
    bg: "#EFF2F5",
    surface: "#FFFFFF",
    text: "#142033",
    muted: "#4D5F73",
    line: "#C0CBD5",
    accent: "#315DDB",
    onAccent: "#FFFFFF",
  },
} as const;
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
function art(i: number) {
  return `<svg viewBox="0 0 320 240" aria-hidden="true" class="art art-${i % 3}"><defs><linearGradient id="g${i}" x2="1" y2="1"><stop stop-color="var(--a)"/><stop offset="1" stop-color="var(--text)"/></linearGradient></defs>${i % 3 === 0 ? `<circle cx="160" cy="120" r="75" fill="url(#g${i})"/><ellipse cx="160" cy="120" rx="130" ry="45" transform="rotate(-25 160 120)" fill="none" stroke="var(--text)"/>` : i % 3 === 1 ? `<path d="m80 90 80-45 80 45v90l-80 45-80-45Z" fill="url(#g${i})"/><path d="m80 90 80 45 80-45M160 135v90" fill="none" stroke="var(--bg)"/>` : `<path d="M40 180Q80-30 160 120T280 60" fill="none" stroke="url(#g${i})" stroke-width="45" stroke-linecap="round"/>`}</svg>`;
}
const projectTitles = [
  "A new perspective",
  "The shape of sound",
  "Ideas in orbit",
  "Light, in layers",
  "A world in motion",
  "Make room for wonder",
];
const projectTypes = [
  "Design",
  "Motion",
  "Design",
  "Motion",
  "Design",
  "Motion",
];
const projectCards = () =>
  projectTitles
    .map(
      (title, i) =>
        `<article class="work" data-category="${projectTypes[i]}" data-title="${title.toLowerCase()}" id="work-${i}">${art(i)}<div class="work-meta"><span>0${i + 1} / ${projectTypes[i]}</span><h2>${title}</h2><button type="button" data-open="${i}">View study <span aria-hidden="true">↗</span></button></div></article>`,
    )
    .join("");
const filters = `<div class="filters" aria-label="Sample categories"><button data-filter="All" aria-pressed="true">All</button><button data-filter="Design" aria-pressed="false">Design</button><button data-filter="Motion" aria-pressed="false">Motion</button><label class="search">Search studies<input type="search" id="search" placeholder="Find a study…" /></label></div>`;
export function createPatternCode(input: unknown): CodeDocument {
  const c = patternConfigSchema.parse(input),
    p = patternPalettes[c.style],
    h = esc(c.heading),
    brand = esc(c.brand),
    desc = esc(c.description);
  const intro = `<header class="intro"><span class="eyebrow">${brand} / ORIGINAL EDITABLE SAMPLE</span><h1>${h}</h1><p>${desc}</p></header>`;
  let body = "";
  if (c.pattern === "editorial")
    body = `${intro}<div class="section-line"><span>01 / SELECTED STUDIES</span><a href="#collection">Explore the collection ↓</a></div><section id="collection" class="reel" aria-label="Selected sample studies" tabindex="0">${projectCards()}</section><p class="hint">Scroll sideways or use your keyboard. All artwork and projects here are labeled samples.</p>`;
  if (c.pattern === "mosaic")
    body = `${intro}<div class="section-line"><span>01 / A CONNECTED COLLECTION</span><span>DESIGN × MOTION</span></div><section class="mosaic">${projectCards()}</section>`;
  if (c.pattern === "focus")
    body = `<section class="focus-hero">${intro}<div class="focus-art">${art(0)}<span>YOUR NEXT CHAPTER / 01</span></div></section><section id="collection">${filters}<div class="collection-grid">${projectCards()}</div><p id="empty" hidden>No matching studies. Clear your search or choose another category.</p></section>`;
  if (c.pattern === "chapters")
    body = `${intro}<a class="skip" href="#closing">Skip story ↓</a><section class="chapter-layout"><nav class="chapter-nav" aria-label="Story chapters"><span class="eyebrow">THE CREATIVE PROCESS</span>${["Extract", "Compose", "Ship"].map((s, i) => `<a href="#chapter-${i}" data-chapter-link="${i}"><span>0${i + 1}</span>${s}</a>`).join("")}</nav><div class="chapters">${["Extract", "Compose", "Ship"].map((s, i) => `<section id="chapter-${i}" class="chapter" data-chapter="${i}"><span class="chapter-number" aria-hidden="true">0${i + 1}</span><div>${art(i)}<span class="eyebrow">CHAPTER / 0${i + 1}</span><h2>${s}</h2><p>${["Collect ideas and evidence. Give the story a place to begin.", "Arrange your material. Make the relationships clear.", "Export, share, and return to make it better."][i]}</p></div></section>`).join("")}</div></section>`;
  if (c.pattern === "depth")
    body = `${intro}<section class="depth-stage" aria-label="Depth collection"><div class="depth-controls"><button id="previous" aria-label="Previous study">←</button><output id="deck-index" aria-live="polite">1 / 6</output><button id="next" aria-label="Next study">→</button></div><div class="depth-rail" tabindex="0" aria-label="Scrollable studies; arrow keys, Home and End supported">${projectCards()}</div></section><p class="hint">Drag or scroll naturally. Keyboard arrows, Home and End change the selected study.</p>`;
  if (c.pattern === "statement")
    body = `${intro}<section class="statement"><span>ARTIST × MULTIVERSE / 01</span><h2><span>Think</span><em>without limits.</em><strong>Create with</strong><mark>intention.</mark></h2><p>One clear idea. Every detail working together.</p><a href="#collection">See the studies ↗</a></section><section id="collection" class="statement-work">${projectCards().slice(0)}</section>`;
  if (c.pattern === "spatial")
    body = `<section class="spatial-hero">${intro}<div class="spatial-art" aria-hidden="true"><div>${art(0)}</div><div>${art(1)}</div><div>${art(2)}</div></div></section><section class="outro"><span class="eyebrow">THE NEXT CHAPTER</span><h2>Make space<br>for <em>possibility.</em></h2><p>Start a collection. Find a different point of view.</p><a href="#collection">Explore studies ↗</a></section><section id="collection" class="collection-grid">${projectCards()}</section>`;
  if (c.pattern === "catalog")
    body = `${intro}${filters}<div class="section-line"><span>01 / THE COLLECTION</span><span id="count">6 STUDIES</span></div><section class="catalog-grid">${projectCards()}</section><p id="empty" hidden>No matching studies. Clear your search or choose another category.</p>`;
  const html = `<a href="#main" class="skip-link">Skip to content</a><nav class="top"><a href="#main" class="wordmark">${brand}<b> / </b></a><span>DESIGN STUDY / ${c.pattern.toUpperCase()}</span><a href="#closing">About this sample ↗</a></nav><main id="main" tabindex="-1" class="pattern-${c.pattern}">${body}<footer id="closing"><strong>${brand}</strong><p>Original ARTYVERSE sample layout. Replace the sample text and studies with your own work. No external services or third-party assets.</p><a href="#main">Back to top ↑</a></footer></main><dialog id="study"><form method="dialog"><button aria-label="Close study">Close ×</button></form><span class="eyebrow">ORIGINAL SAMPLE STUDY</span><h2 id="study-title"></h2><p>This is a labeled sample. Edit the HTML and CSS in your Studio to replace the content.</p></dialog>`;
  const css = `:root{--bg:${p.bg};--surface:${p.surface};--text:${p.text};--muted:${p.muted};--line:${p.line};--a:${p.accent};--on-a:${p.onAccent}}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:25px}body{margin:0;background:var(--bg);color:var(--text);font:400 16px/1.65 system-ui,sans-serif}button,input,a{font:inherit}a{color:inherit;text-underline-offset:.25em}button{cursor:pointer;color:inherit;background:var(--surface);border:1px solid var(--line);border-radius:99px;padding:10px 18px;min-height:44px}a:focus-visible,button:focus-visible,input:focus-visible,[tabindex]:focus-visible{outline:3px solid var(--text);outline-offset:4px}button:focus-visible{outline-color:var(--text)}.top{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:24px 5vw;border-bottom:1px solid var(--line);font-size:12px}.top .wordmark{overflow-wrap:anywhere;max-width:100%;font-size:20px;font-weight:800;letter-spacing:-.05em;text-decoration:none}.wordmark b{color:var(--muted)}main{max-width:1500px;margin:auto;padding:0 5vw}.intro{max-width:1000px;padding:80px 0 50px}.eyebrow,.section-line,.hint,.top>span{font-size:12px;letter-spacing:.08em}.eyebrow,.hint{overflow-wrap:anywhere;color:var(--muted)}h1{font-size:clamp(42px,7.5vw,108px);letter-spacing:-.065em;line-height:1.02;font-weight:750;overflow-wrap:anywhere;margin:24px 0}h2{letter-spacing:-.035em;line-height:1.15;font-size:clamp(24px,3.5vw,44px);margin:12px 0}p{overflow-wrap:anywhere;max-width:58ch;color:var(--muted)}.intro p{font-size:18px;line-height:1.8}.section-line{display:flex;justify-content:space-between;gap:15px;padding:20px 0;border-top:1px solid var(--line);flex-wrap:wrap}.work{min-width:0;position:relative;background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden}.art{display:block;width:100%;height:auto;background:color-mix(in srgb,var(--a) 9%,var(--bg))}.art-1{background:color-mix(in srgb,var(--text) 8%,var(--bg))}.work-meta{padding:22px}.work-meta>span{font:12px monospace;color:var(--muted)}.work h2{font-size:clamp(23px,2.8vw,36px)}.work button{font-size:13px}.work[hidden]{display:none!important}.collection-grid,.catalog-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin:25px 0}.reel{display:flex;gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;padding:10px 0 25px}.reel .work{flex:0 0 47%;scroll-snap-align:start}.reel .art{aspect-ratio:1.5;object-fit:cover}.mosaic{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.mosaic .work:first-child{grid-column:span 2;grid-row:span 2;display:flex;flex-direction:column}.mosaic .work:first-child .art{flex:1;min-height:300px}.mosaic .work:nth-child(4){grid-column:span 2}.focus-hero{display:grid;grid-template-columns:1.2fr 1fr;gap:4vw;align-items:center}.focus-art{background:var(--surface);border:1px solid var(--line);border-radius:24px;padding:25px}.focus-art span{display:block;font-size:11px;letter-spacing:.12em}.filters{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-block:1px solid var(--line);padding:18px 0}.filters [aria-pressed=true]{background:var(--a);color:var(--on-a);border-color:var(--a)}.search{display:flex;flex-direction:column;gap:4px;margin-left:auto;font-size:12px}.search input{min-height:44px;padding:8px 12px;border:1px solid var(--line);background:var(--surface);color:var(--text);border-radius:8px;min-width:0;max-width:100%}.chapter-layout{display:grid;grid-template-columns:1fr 2fr;gap:4vw}.chapter-nav{position:sticky;top:30px;align-self:start;display:flex;flex-direction:column;gap:15px;padding:30px 0}.chapter-nav a{font-size:22px;text-decoration:none;display:flex;gap:20px;align-items:center;padding:12px;border:1px solid transparent}.chapter-nav a[aria-current=true]{border-color:var(--line);background:var(--a);color:var(--on-a)}.chapter-nav a span{font-size:12px}.chapter{position:relative;min-height:85vh;border-top:1px solid var(--line);padding:50px 0;display:flex;align-items:center;gap:25px}.chapter:nth-child(1){background:var(--a);color:var(--on-a);border-radius:18px;padding-inline:30px}.chapter:nth-child(1) p,.chapter:nth-child(1) .eyebrow{color:inherit}.chapter:nth-child(2){background:var(--surface);padding-inline:30px;border-radius:18px}.chapter-number{position:absolute;top:20px;right:0;font-size:clamp(90px,16vw,200px);line-height:1;opacity:.12;font-weight:800}.chapter>div{position:relative;width:100%}.chapter .art{max-width:450px;max-height:300px}.chapter h2{font-size:64px}.skip{display:inline-block;min-height:44px;margin-bottom:20px}.depth-controls{display:flex;justify-content:space-between;align-items:center;gap:20px}.depth-rail{display:flex;gap:24px;padding:35px 12% 45px;scroll-snap-type:x mandatory;overflow-x:auto;perspective:1100px;scrollbar-width:thin}.depth-rail .work{flex:0 0 70%;scroll-snap-align:center;transform:rotateY(-9deg) scale(.92);transition:transform .35s,opacity .35s;opacity:.8}.depth-rail .work[aria-current=true]{transform:rotateY(0) scale(1);opacity:1}.depth-rail .work:nth-child(even){transform:rotateY(9deg) scale(.92)}.depth-rail .work[aria-current=true]{transform:none}.statement{padding:40px 0 70px;border-top:1px solid var(--line)}.statement h2{display:flex;flex-direction:column;align-items:start;font-size:clamp(40px,8vw,120px);line-height:1.15}.statement h2>span{font-weight:250}.statement em{font-weight:250;font-style:normal;margin-left:8vw}.statement strong{font-weight:800}.statement mark{padding:0 .15em;background:var(--a);color:var(--on-a);margin-left:4vw;max-width:100%;overflow-wrap:anywhere}.statement-work{display:grid;grid-template-columns:1fr 1fr;gap:25px}.statement-work .work:nth-child(even){margin-top:70px}.spatial-hero{display:grid;grid-template-columns:1fr 1fr;gap:25px;align-items:center;min-height:75vh}.spatial-art{position:relative;height:380px;perspective:900px}.spatial-art>div{position:absolute;width:72%;left:10%;top:5%;border:1px solid var(--line);transform:rotateY(-20deg) rotateZ(-10deg);box-shadow:0 20px 40px #0002;border-radius:18px;overflow:hidden}.spatial-art>div:nth-child(2){left:20%;top:22%;transform:rotateY(15deg) rotateZ(8deg)}.spatial-art>div:nth-child(3){left:5%;top:43%;transform:rotateY(-10deg) rotateZ(-3deg)}.outro{padding:90px 0;border-top:1px solid var(--line)}.outro h2{font-size:clamp(40px,7vw,100px);font-weight:350}.outro em{font-style:normal;font-weight:800}footer{display:flex;gap:30px;flex-wrap:wrap;justify-content:space-between;align-items:start;margin-top:70px;padding:35px 0;border-top:1px solid var(--line)}footer strong{overflow-wrap:anywhere;max-width:100%;font-size:22px}footer p{font-size:13px;max-width:50ch;margin:0}footer a{font-size:13px;min-height:44px}dialog{background:var(--surface);color:var(--text);border:1px solid var(--line);border-radius:18px;max-width:min(560px,90vw);padding:30px}dialog::backdrop{background:#0009}dialog form{text-align:right}.skip-link{position:fixed;top:10px;left:10px;padding:15px;background:var(--a);color:var(--on-a);z-index:10;transform:translateY(-150%)}.skip-link:focus{transform:none}.catalog-grid .art{aspect-ratio:1.6;object-fit:cover}.catalog-grid h2{font-size:24px}@media(max-width:700px){.top{padding:18px 5vw;flex-wrap:wrap}.top>span{display:none}.intro{padding:50px 0 35px}.intro p{font-size:16px}.reel .work{flex-basis:85%}.mosaic{grid-template-columns:1fr 1fr}.mosaic .work:first-child{grid-column:1/-1;grid-row:auto}.mosaic .work:nth-child(4){grid-column:auto}.mosaic .work-meta{padding:15px}.mosaic h2{font-size:21px}.mosaic .work:first-child .art{min-height:0}.collection-grid,.catalog-grid{grid-template-columns:1fr}.focus-hero,.spatial-hero{grid-template-columns:1fr}.focus-art{margin-bottom:35px}.search{margin:10px 0 0;width:100%}.chapter-layout{grid-template-columns:1fr}.chapter-nav{position:relative;top:0;flex-direction:row;flex-wrap:wrap;gap:5px}.chapter-nav .eyebrow{width:100%}.chapter-nav a{font-size:16px;gap:8px;padding:8px}.chapter{min-height:70vh}.chapter h2{font-size:clamp(28px,9vw,48px);overflow-wrap:anywhere}.depth-rail{padding-inline:7%;gap:14px}.depth-rail .work{flex-basis:94%;transform:none!important;opacity:1}.statement-work{grid-template-columns:1fr}.statement-work .work:nth-child(even){margin:0}.statement h2{font-size:clamp(36px,10vw,65px)}.spatial-art{height:320px}.outro{padding:60px 0}.top .wordmark{overflow-wrap:anywhere;max-width:100%;font-size:17px}footer{gap:18px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.depth-rail .work{transition:none;transform:none!important;opacity:1}.spatial-art>div{transform:none!important}}`;
  const js = `(()=>{document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.getElementById(a.getAttribute('href').slice(1));if(target){e.preventDefault();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});if(target.id==='main')target.focus({preventScroll:true})}}));const cards=[...document.querySelectorAll('.work')];let category='All';const input=document.querySelector('#search');const apply=()=>{let count=0;cards.forEach(c=>{const visible=(category==='All'||c.dataset.category===category)&&(!input||c.dataset.title.includes(input.value.toLowerCase()));c.hidden=!visible;if(visible)count++});const empty=document.querySelector('#empty');if(empty)empty.hidden=count!==0;const label=document.querySelector('#count');if(label)label.textContent=count+' STUDIES'};document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(v=>v.setAttribute('aria-pressed',String(v===b)));apply()}));input?.addEventListener('input',apply);const dialog=document.querySelector('#study');document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#study-title').textContent=b.closest('.work').querySelector('h2').textContent;dialog.showModal()}));const rail=document.querySelector('.depth-rail');if(rail){let index=0,frame=0;const set=i=>{index=Math.max(0,Math.min(cards.length-1,i));cards.forEach((c,n)=>c.setAttribute('aria-current',String(n===index)));document.querySelector('#deck-index').textContent=(index+1)+' / '+cards.length;document.querySelector('#previous').disabled=index===0;document.querySelector('#next').disabled=index===cards.length-1};const select=i=>{set(i);rail.scrollTo({left:cards[index].offsetLeft-rail.offsetLeft-(rail.clientWidth-cards[index].clientWidth)/2,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})};document.querySelector('#previous').onclick=()=>select(index-1);document.querySelector('#next').onclick=()=>select(index+1);rail.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();select(e.key==='Home'?0:e.key==='End'?cards.length-1:index+(e.key==='ArrowLeft'?-1:1))});rail.addEventListener('scroll',()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const center=rail.getBoundingClientRect().left+rail.clientWidth/2;set(cards.reduce((best,c,n)=>Math.abs(c.getBoundingClientRect().left+c.clientWidth/2-center)<Math.abs(cards[best].getBoundingClientRect().left+cards[best].clientWidth/2-center)?n:best,0))})},{passive:true});window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});set(0)}const chapters=[...document.querySelectorAll('[data-chapter]')];if(chapters.length&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(active)document.querySelectorAll('[data-chapter-link]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.chapterLink===active.target.dataset.chapter)))},{threshold:[.2,.5,.8]});chapters.forEach(c=>observer.observe(c));window.addEventListener('pagehide',()=>observer.disconnect(),{once:true})}})();`;
  return codeSchema.parse({
    schemaVersion: 2,
    html,
    css: css + patternStyleRules[c.style],
    js,
    overrides: [],
  });
}
