import { chromium } from 'playwright';

const baseUrl = process.argv[2] || 'http://localhost:3001';
const path = process.argv[3] || '/it/filiera-e-lavorazione';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(baseUrl + path, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const report = await page.evaluate(() => {
    const CONTAINER_FRAGMENTS = ['_body__', '_editorial__', '_content__', '_title__', '_subheading', '_heading', '_trigger__', '_answer__', '_leadInBold'];
    const els = Array.from(document.querySelectorAll('main *')).filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const hasOwnText = Array.from(el.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0
      );
      return hasOwnText;
    });

    return els.map((el) => {
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        class: el.className,
        text: el.textContent.trim().slice(0, 50),
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
      };
    });
  });

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})();
