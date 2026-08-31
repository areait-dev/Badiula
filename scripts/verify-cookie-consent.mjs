import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const gaRequests = [];
  page.on('request', (req) => {
    if (req.url().includes('googletagmanager.com') || req.url().includes('google-analytics.com')) {
      gaRequests.push(req.url());
    }
  });

  await page.goto('http://localhost:3001/it', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  console.log('--- Prima del consenso ---');
  console.log('Richieste GA rilevate:', gaRequests.length, gaRequests);

  const bannerVisible = await page.evaluate(() => {
    const b = document.querySelector('[role="dialog"][aria-label="Preferenze cookie"]');
    return !!b;
  });
  console.log('Banner visibile:', bannerVisible);

  // Rifiuta
  await page.getByRole('button', { name: 'Rifiuta' }).click();
  await page.waitForTimeout(1000);
  console.log('--- Dopo "Rifiuta" ---');
  console.log('Richieste GA cumulative:', gaRequests.length);
  console.log('localStorage:', await page.evaluate(() => localStorage.getItem('badiula_cookie_consent')));

  // Reload: non deve ricomparire, GA deve restare spento
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const bannerAfterReload = await page.evaluate(() => !!document.querySelector('[role="dialog"][aria-label="Preferenze cookie"]'));
  console.log('--- Dopo reload (consenso: rifiutato) ---');
  console.log('Banner ricompare:', bannerAfterReload);
  console.log('Richieste GA cumulative:', gaRequests.length);

  // Riapri preferenze da footer e accetta
  await page.evaluate(() => document.getElementById('contatti')?.scrollIntoView());
  await page.getByRole('button', { name: 'Gestisci preferenze cookie' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Accetta' }).click();
  await page.waitForTimeout(1500);
  console.log('--- Dopo "Accetta" da Gestisci preferenze ---');
  console.log('Richieste GA cumulative:', gaRequests.length, gaRequests);
  console.log('localStorage:', await page.evaluate(() => localStorage.getItem('badiula_cookie_consent')));

  await browser.close();
})();
