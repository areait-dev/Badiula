import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3001/it/filiera-e-lavorazione', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const html = await page.evaluate(() => {
    const bodyDiv = document.querySelector('[class*="SectionZigzag_body__"]');
    return bodyDiv ? bodyDiv.outerHTML : 'NOT FOUND';
  });

  console.log(html);
  await browser.close();
})();
