import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3001/it/filiera-e-lavorazione', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const result = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('main *'));
    const hits = [];
    for (const el of all) {
      const cs = getComputedStyle(el);
      if (cs.fontSize === '16px') {
        hits.push({
          tag: el.tagName.toLowerCase(),
          class: el.className,
          outerHTMLSnippet: el.outerHTML.slice(0, 300),
          parentClass: el.parentElement ? el.parentElement.className : null,
          parentTag: el.parentElement ? el.parentElement.tagName : null,
        });
      }
    }
    return hits;
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
