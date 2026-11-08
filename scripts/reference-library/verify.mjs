import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import{writeFileSync}from'node:fs';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),c=await b.newContext(),p=await c.newPage(),cases=[],errors=[];
p.on('pageerror',e=>errors.push(e.message));await p.emulateMedia({reducedMotion:'reduce'});
for(const theme of ['dark','light'])for(const width of [320,390,768,1440]){
 await p.setViewportSize({width,height:1000});await p.goto('http://localhost:5320/#/patterns');await p.locator('.pattern-grid').waitFor();await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);await p.evaluate(()=>document.fonts.ready);const a=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();cases.push({page:'patterns',width,theme,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),violations:a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});await p.screenshot({path:`tests/evidence/reference-library/gallery-${theme}-${width}.png`,fullPage:true});
}
for(const width of [320,1440]){
 await p.setViewportSize({width,height:1000});await p.goto('http://localhost:5320/#/patterns/depth');await p.getByRole('button',{name:/Run preview|เปิดตัวอย่าง/}).click();await p.frameLocator('iframe').locator('h1').waitFor();const a=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();cases.push({page:'depth detail',width,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),violations:a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});await p.screenshot({path:`tests/evidence/reference-library/detail-${width}.png`,fullPage:true});
}
for(const id of ['editorial','mosaic','focus','chapters','depth','statement','spatial','catalog']){
 await p.setViewportSize({width:1440,height:1000});await p.goto('http://localhost:5320/#/patterns/'+id);await p.getByRole('button',{name:/Run preview|เปิดตัวอย่าง/}).click();await p.frameLocator('iframe').locator('h1').waitFor();const f=p.frames().find(f=>f.parentFrame());const viewport=await f.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));cases.push({page:'generated '+id,viewport,overflow:viewport.scroll>viewport.width+1});await p.locator('iframe').screenshot({path:`tests/evidence/reference-library/layout-${id}.png`});
}
writeFileSync('tests/evidence/reference-library/checks.json',JSON.stringify({time:new Date().toISOString(),browser:b.version(),conditions:'Local server edition; native originals, deterministic reduced motion. Source snapshots are static, scripts/network disabled and assets unavailable; not motion fidelity evidence.',cases,errors},null,2));console.log(JSON.stringify({cases,errors}));await b.close();if(errors.length||cases.some(v=>v.overflow||v.violations?.length))process.exitCode=1;
