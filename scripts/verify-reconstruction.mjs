import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const results=[]; const errors=[];
const context=await browser.newContext(); const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
for(const theme of ['dark','light'])for(const width of [320,390,768,1440]){
 await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:5320/#/home');await page.waitForTimeout(1300);
 await page.evaluate(t=>{document.documentElement.dataset.theme=t},theme);await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>document.fonts.ready);
 const clipping=await page.locator(".recon-manifesto").evaluate(el=>[...el.children].some(c=>c.getBoundingClientRect().right>el.closest(".v3-hero").getBoundingClientRect().right-8)); const axe=await new AxeBuilder({page}).analyze();const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
 await page.screenshot({path:`tests/evidence/reconstruction/home-${theme}-${width}.png`,fullPage:true});results.push({screen:'home',theme,width,clipping,overflow:dims.scroll>dims.width,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});
}
await page.goto('http://127.0.0.1:5320/#/builder');await page.waitForTimeout(1600);await page.setViewportSize({width:390,height:1000});await page.screenshot({path:'tests/evidence/reconstruction/builder-390.png',fullPage:true});results.push({screen:'builder',width:390,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),violations:(await new AxeBuilder({page}).analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});
fs.writeFileSync('tests/evidence/reconstruction/visual-checks.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors}));await browser.close(); if(errors.length||results.some(r=>r.overflow||r.clipping||r.violations.length))process.exitCode=1;
