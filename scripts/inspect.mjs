import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://localhost:5173");
await page.waitForTimeout(1500);
await page.screenshot({
  path: "tests/evidence/home-desktop.png",
  fullPage: true,
});
console.log(await page.locator("h1").allTextContents());
console.log(
  "overflow",
  await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    width: innerWidth,
  })),
);
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
await page.screenshot({
  path: "tests/evidence/home-mobile.png",
  fullPage: true,
});
await browser.close();
