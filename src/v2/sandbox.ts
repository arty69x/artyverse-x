import type { CodeDocument } from "../../shared/v2/contracts";
export const starterCode: CodeDocument = {
  schemaVersion: 2,
  html: '<main class="scene">\n  <span class="eyebrow">ARTYVERSE / LIVE CODE</span>\n  <h1>Make room<br>for <em>wonder.</em></h1>\n  <p>Your ideas can take a different shape here.</p>\n  <button id="spark">A little spark ↗</button>\n  <div class="orb" aria-hidden="true"></div>\n</main>',
  css: "* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; background: #090b10; color: #f0f0f8; }\n.scene { min-height: 100vh; padding: 9vw; position: relative; overflow: hidden; }\n.eyebrow { font-size: 11px; letter-spacing: 3px; color: #a3a3b6; }\nh1 { font-size: clamp(40px, 8vw, 88px); font-weight: 400; line-height: 1.05; letter-spacing: -4px; position: relative; z-index: 1; }\nem { color: #d7e317; font-style: normal; }\np { color: #a3a3b6; line-height: 1.8; position: relative; z-index: 1; }\nbutton { margin-top: 20px; padding: 14px 22px; border: 0; border-radius: 8px; background: #d7e317; color: #10120a; cursor: pointer; position: relative; z-index: 1; }\n.orb { width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle at 30% 25%, #8a54c2, #242040 45%, #101224 75%); position: absolute; right: -80px; top: 120px; border: 1px solid #9b43ff; }",
  js: "document.getElementById('spark').addEventListener('click', () => {\n  document.querySelector('em').textContent = 'possibility.';\n  console.log('A real interaction, from your code.');\n});",
  overrides: [],
};
const scriptSafe = (s: string) => s.replace(/<\/script/gi, "<\\/script");
const styleSafe = (s: string) => s.replace(/<\/style/gi, "<\\/style");
export function overrideCSS(code: CodeDocument) {
  return code.overrides
    .map((o) => `${o.selector} { ${o.property}: ${o.value}; }`)
    .join("\n");
}
export function buildPreview(code: CodeDocument, nonce: string) {
  const bridge = `(()=>{const token=${JSON.stringify(nonce)};const send=(type,data)=>parent.postMessage({artyverse:true,token,type,...data},'*');window.addEventListener('error',e=>send('error',{message:String(e.message)}));window.addEventListener('unhandledrejection',e=>send('error',{message:String(e.reason)}));['log','warn','error'].forEach(k=>{const old=console[k];console[k]=(...a)=>{send('log',{message:a.map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' ').slice(0,3000)});old.apply(console,a)}});let inspect=false,selected=null;const selector=el=>{if(el.id&&/^[a-zA-Z][\\w-]*$/.test(el.id))return '#'+el.id;const path=[];for(let x=el;x&&x!==document.body;x=x.parentElement){let n=1;for(let p=x.previousElementSibling;p;p=p.previousElementSibling)if(p.tagName===x.tagName)n++;path.unshift(x.tagName.toLowerCase()+':nth-of-type('+n+')');}return 'body > '+path.join(' > ')};document.addEventListener('click',e=>{const el=e.target;if(inspect&&el instanceof HTMLElement){e.preventDefault();e.stopImmediatePropagation();if(selected)selected.style.outline='';selected=el;el.style.outline='2px solid #d4006a';const s=getComputedStyle(el);send('selection',{selector:selector(el),tag:el.tagName,text:el.innerText.slice(0,200),styles:{color:s.color,backgroundColor:s.backgroundColor,fontSize:s.fontSize,padding:s.padding,borderRadius:s.borderRadius,width:s.width,height:s.height}})}},true);window.addEventListener('message',e=>{if(e.source!==parent||!e.data||e.data.token!==token)return;if(e.data.type==='inspect')inspect=!!e.data.enabled;if(e.data.type==='style'&&selected&&['color','background-color','font-size','padding','border-radius','width','height'].includes(e.data.property))selected.style.setProperty(e.data.property,String(e.data.value))});send('ready',{});})();`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; worker-src 'none'"><style>${styleSafe(code.css)}\n${styleSafe(overrideCSS(code))}</style><script>${bridge}</script></head><body>${code.html}<script>${scriptSafe(code.js)}</script></body></html>`;
}
export function exportCode(code: CodeDocument, title: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title.replace(/[<>&"]/g, "")}</title><style>${styleSafe(code.css)}\n${styleSafe(overrideCSS(code))}</style></head><body>${code.html}<script>${scriptSafe(code.js)}</script></body></html>`;
}
export function localRepair(code: CodeDocument): {
  code: CodeDocument;
  changes: string[];
} {
  const next = structuredClone(code),
    changes: string[] = [];
  if (!/box-sizing\s*:\s*border-box/.test(next.css)) {
    next.css = "* { box-sizing: border-box; }\n" + next.css;
    changes.push("Add predictable border-box sizing");
  }
  if (!/body\s*\{[^}]*margin\s*:/.test(next.css)) {
    next.css = "body { margin: 0; }\n" + next.css;
    changes.push("Remove browser body margin");
  }
  if (!/:focus-visible/.test(next.css)) {
    next.css +=
      "\n:focus-visible { outline: 2px solid #d4006a; outline-offset: 4px; }";
    changes.push("Add a visible keyboard focus rule");
  }
  if (!/@media\s*\(prefers-reduced-motion/.test(next.css)) {
    next.css +=
      "\n@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; } }";
    changes.push("Add reduced-motion override");
  }
  return { code: next, changes };
}
