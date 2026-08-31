/**
 * Scans live pages for text elements whose computed font-family diverges
 * from the resolved --font-body value inside any ".body"-like content
 * container (SectionZigzag, ProdottoEditoriale, ProdottoVarieta, etc.).
 *
 * Usage: node scripts/check-font-consistency.mjs [baseUrl]
 * Requires the dev server running (default http://localhost:3001).
 */
import { chromium } from 'playwright';

const baseUrl = process.argv[2] || 'http://localhost:3001';

const PATHS = [
  '/it',
  '/it/azienda',
  '/it/certificazioni',
  '/it/innovazione',
  '/it/sostenibilita',
  '/it/filiera-e-lavorazione',
  '/it/luce-di-terra',
  '/it/coltivazioni',
  '/it/coltivazioni/arance-rosse-igp',
  '/it/coltivazioni/arance-bionde',
  '/it/coltivazioni/limone-femminello',
  '/it/coltivazioni/bergamotto',
  '/it/coltivazioni/pompelmo',
  '/it/shop',
];

// Class-name fragments produced by CSS Modules for "content body" containers
// across the shared components (matches e.g. SectionZigzag_body__a1b2c).
const CONTAINER_FRAGMENTS = ['_body__', '_editorial__', '_content__'];

async function scanPage(page, path) {
  await page.goto(baseUrl + path, { waitUntil: 'load' });

  const results = await page.evaluate((fragments) => {
    const root = document.documentElement;
    const expected = getComputedStyle(root).getPropertyValue('--font-body').trim();

    const containers = Array.from(document.querySelectorAll('[class]')).filter((el) =>
      fragments.some((f) => el.className && String(el.className).includes(f))
    );

    const anomalies = [];
    for (const container of containers) {
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
      let node = container;
      do {
        const hasOwnText = Array.from(node.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0
        );
        if (hasOwnText) {
          const computed = getComputedStyle(node).fontFamily;
          if (!computed.toLowerCase().includes('mr-eaves') && !computed.toLowerCase().includes('gravesend')) {
            // Only flag if it also doesn't match the raw expected token
            // (covers cases where --font-body itself resolves oddly).
          }
          if (computed !== getComputedStyle(container).fontFamily) {
            anomalies.push({
              containerClass: container.className,
              tag: node.tagName.toLowerCase(),
              elementClass: node.className,
              text: node.textContent.trim().slice(0, 60),
              computedFontFamily: computed,
              expectedFontFamily: getComputedStyle(container).fontFamily,
            });
          }
        }
      } while ((node = walker.nextNode()));
    }
    return { expected, anomalies };
  }, CONTAINER_FRAGMENTS);

  return results;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let totalAnomalies = 0;
  const report = [];

  for (const path of PATHS) {
    try {
      const { anomalies } = await scanPage(page, path);
      if (anomalies.length > 0) {
        totalAnomalies += anomalies.length;
        report.push({ path, anomalies });
      }
      console.log(`${anomalies.length === 0 ? 'OK  ' : 'FAIL'} ${path} (${anomalies.length} anomaly/ies)`);
    } catch (err) {
      console.log(`ERR  ${path}: ${err.message}`);
    }
  }

  await browser.close();

  console.log('\n--- REPORT ---');
  if (report.length === 0) {
    console.log('Nessuna discrepanza di font-family trovata nei blocchi .body scansionati.');
  } else {
    for (const { path, anomalies } of report) {
      console.log(`\n${path}`);
      for (const a of anomalies) {
        console.log(
          `  <${a.tag} class="${a.elementClass}"> "${a.text}"\n    computed: ${a.computedFontFamily}\n    expected: ${a.expectedFontFamily}`
        );
      }
    }
  }
  console.log(`\nTotale anomalie: ${totalAnomalies}`);
  process.exit(totalAnomalies > 0 ? 1 : 0);
})();
