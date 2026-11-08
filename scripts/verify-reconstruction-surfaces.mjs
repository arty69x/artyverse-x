import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {writeFileSync} from 'node:fs';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),c=await b.newContext(),p=await c.newPage(),cases=[],errors=[];
p.on('pageerror',e=>errors.push(e.message));await p.emulateMedia({reducedMotion:'reduce'});
for(const [route,width,height,theme] of [['home',1280,720,'dark'],['builder',1440,900,'dark'],['builder',1440,900,'light'],['design-system',390,900,'dark'],['design-system',1440,900,'light'],['code',390,900,'dark']]){
 await p.setViewportSize({width,height});await p.goto('http://127.0.0.1:5320/#/'+route);await p.waitForTimeout(900);await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);await p.evaluate(()=>document.fonts.ready);
 cases.push({route,width,height,theme,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),violations:(await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});await p.screenshot({path:`tests/evidence/reconstruction/${route}-${theme}-${width}-surface.png`,fullPage:true});
}
writeFileSync('tests/evidence/reconstruction/surface-checks.json',JSON.stringify({timestamp:new Date().toISOString(),browser:b.version(),cases,errors},null,2));console.log({cases,errors});await b.close();if(errors.length||cases.some(x=>x.overflow||x.violations.length))process.exitCode=1;
