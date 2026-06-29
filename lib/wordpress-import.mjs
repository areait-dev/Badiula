/**
 * Script di importazione dati → WordPress REST API.
 *
 * Legge i dati direttamente dai file sorgente del progetto:
 *   - lib/data.ts         → PRODUCTS, COMPANY_SECTIONS
 *   - messages/it.json    → testi homepage e opzioni globali (IT)
 *   - messages/en.json    → testi homepage e opzioni globali (EN)
 *
 * Uso:
 *   node lib/wordpress-import.mjs
 *   node lib/wordpress-import.mjs --dry-run
 *
 * Prerequisiti in .env.local:
 *   WP_USER=nomeutente
 *   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = join(__dir, '..');

// ─── Env ──────────────────────────────────────────────────────────────────────

function loadEnv() {
  try {
    const raw = readFileSync(join(root, '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      const val = t.slice(eq + 1).trim();
      process.env[key] ??= val;
    }
  } catch {
    console.warn('⚠️  .env.local non trovato');
  }
}

loadEnv();

console.log('DEBUG WP_USER:', process.env.WP_USER ? 'trovato' : 'NON trovato');
console.log('DEBUG WP_APP_PASSWORD:', process.env.WP_APP_PASSWORD ? 'trovato' : 'NON trovato');

const WP_URL        = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? 'https://wp.agribadiula.it';
const WP_USER       = process.env.WP_USER;
const WP_APP_PASS   = process.env.WP_APP_PASSWORD;
const DRY_RUN       = process.argv.includes('--dry-run');

if (!WP_USER || !WP_APP_PASS) {
  console.error('❌  Configura WP_USER e WP_APP_PASSWORD in .env.local');
  process.exit(1);
}

const AUTH    = Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');
const HEADERS = { 'Content-Type': 'application/json', Authorization: `Basic ${AUTH}` };

// ─── Lettura file sorgente ────────────────────────────────────────────────────

/**
 * Legge lib/data.ts, rimuove la sintassi TypeScript e valuta il modulo.
 * Restituisce { PRODUCTS, COMPANY_SECTIONS, STATS }.
 */
function loadDataTs() {
  const possiblePaths = [
    join(__dir, 'data.ts'),
    join(root, 'lib', 'data.ts'),
    join(root, 'data.ts'),
  ];

  let src = null;
  for (const p of possiblePaths) {
    try {
      src = readFileSync(p, 'utf8');
      console.log('✅ content.ts trovato in:', p);
      break;
    } catch {}
  }

  if (!src) throw new Error('content.ts non trovato! Percorsi cercati:\n' + possiblePaths.join('\n'));

  const js = src
    // 1. Rimuove commenti block/JSDoc
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // 2. Rimuove solo righe di commento standalone (// a inizio riga)
    //    Non tocca le URL https:// dentro le stringhe
    .replace(/^[ \t]*\/\/[^\n]*/gm, '')
    // 3. Rimuove blocchi `export interface Xxx { ... }` (senza braces annidate)
    .replace(/export\s+interface\s+\w+\s*\{[^}]*\}/gs, '')
    // 4. Rimuove annotazioni di tipo su uppercase: `: TypeName`, `: TypeName[]`
    //    Sicuro perché nei literal object i valori non iniziano mai con una lettera maiuscola
    .replace(/\s*:\s*[A-Z]\w*(?:\[\])?(?:\s*\|\s*[A-Za-z]\w*)*/g, '')
    // 5. Rimuove annotazioni su primitive (parametri funzione): `: string`, `: number`
    .replace(/:\s*(?:string|number|boolean|undefined|null)(?:\[\])?/g, '')
    // 6. Rimuove `?:` (optional) → `:`
    .replace(/\?:/g, ':')
    // 7. Rimuove `as const`
    .replace(/\s+as\s+const/g, '')
    // 8. Rimuove keyword `export`
    .replace(/\bexport\b\s*/g, '');

  // Valuta il codice JS ripulito e restituisce le costanti necessarie
  // eslint-disable-next-line no-new-func
  const factory = new Function(`
    ${js}
    return { PRODUCTS, COMPANY_SECTIONS, STATS };
  `);

  return factory();
}

/**
 * Legge un file JSON dal path assoluto.
 */
function readJson(absPath) {
  return JSON.parse(readFileSync(absPath, 'utf8'));
}

// ─── Caricamento dati ─────────────────────────────────────────────────────────

const { PRODUCTS, COMPANY_SECTIONS } = loadDataTs();
const it = readJson(join(root, 'messages', 'it.json'));
const en = readJson(join(root, 'messages', 'en.json'));

// ─── Utility REST ─────────────────────────────────────────────────────────────

async function wpFetch(path, method = 'GET', body) {
  const url  = `${WP_URL}/wp-json/wp/v2${path}`;
  const opts = { method, headers: HEADERS };
  if (body) opts.body = JSON.stringify(body);

  const res  = await fetch(url, opts);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(`WP REST ${method} ${path} → ${res.status}: ${json?.message ?? JSON.stringify(json)}`);
  }
  return json;
}

async function findPost(cpt, slug) {
  const results = await wpFetch(`/${cpt}?slug=${encodeURIComponent(slug)}`);
  return results[0] ?? null;
}

async function upsert(cpt, slug, payload) {
  const existing = await findPost(cpt, slug);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] ${existing ? 'UPDATE' : 'CREATE'} ${cpt}/${slug}`);
    return;
  }

  if (existing) {
    await wpFetch(`/${cpt}/${existing.id}`, 'POST', payload);
    console.log(`✅ Aggiornato: ${cpt}/${slug} (ID ${existing.id})`);
  } else {
    const created = await wpFetch(`/${cpt}`, 'POST', payload);
    console.log(`✅ Creato: ${cpt}/${slug} (ID ${created.id})`);
  }
}

// ─── Builder ACF prodotto ─────────────────────────────────────────────────────

const MONTH_KEYS = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];

function buildProductAcf(p) {
  const acf = {
    nome:        p.name,
    sottotitolo: p.subtitle,
    descrizione: p.description,
    corpo:       p.body,
    colore_sfondo: p.bg,
  };

  // Mesi raccolta: converti array di indici 1-12 → campi bool gen_raccolta…dic_raccolta
  MONTH_KEYS.forEach((m, i) => {
    acf[`${m}_raccolta`] = p.harvest.includes(i + 1);
  });

  // Sezioni alternanti (repeater ACF)
  (p.sections ?? []).forEach((s, i) => {
    acf[`sezioni_${i}_titolo_sezione`] = s.heading;
    acf[`sezioni_${i}_testo_sezione`]  = s.body;
    acf[`sezioni_${i}_immagine_sinistra`] = s.imageLeft ?? false;
  });
  acf.sezioni = (p.sections ?? []).length;

  // FAQ (repeater ACF)
  (p.faqs ?? []).forEach((f, i) => {
    acf[`faq_${i}_domanda`]  = f.q;
    acf[`faq_${i}_risposta`] = f.a;
  });
  acf.faq = (p.faqs ?? []).length;

  return acf;
}

// ─── Import: Prodotti ─────────────────────────────────────────────────────────

async function importProducts() {
  console.log('\n── Prodotti ──────────────────────────────────');
  for (const p of PRODUCTS) {
    try {
      await upsert('prodotto', p.slug, {
        title:   p.name,
        slug:    p.slug,
        status:  'publish',
        excerpt: p.description,
        acf:     buildProductAcf(p),
      });
    } catch (err) {
      console.error(`❌ Errore su prodotto/${p.slug}:`, err.message);
    }
  }
}

// ─── Import: Sezioni Azienda ──────────────────────────────────────────────────

async function importSezioniAzienda() {
  console.log('\n── Sezioni Azienda ───────────────────────────');
  for (const s of COMPANY_SECTIONS) {
    const slug = s.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    try {
      await upsert('sezione_azienda', slug, {
        title:  s.heading,
        slug,
        status: 'publish',
        acf: {
          eyebrow: s.eyebrow,
          titolo:  s.heading,
          corpo:   s.body,
          // EN: da aggiungere manualmente in WP o aggiornare questo script
          // quando le traduzione EN saranno disponibili nel progetto
        },
      });
    } catch (err) {
      console.error(`❌ Errore su sezione_azienda/${slug}:`, err.message);
    }
  }
}

// ─── Import: Opzioni Globali (options page) ───────────────────────────────────

async function importOpzioniGlobali() {
  console.log('\n── Opzioni Globali ───────────────────────────');

  const payload = {
    footer_quote_it:       it.footer?.quote ?? '',
    footer_quote_en:       en.footer?.quote ?? '',
    footer_form_title_it:  'Inviaci un messaggio',
    footer_form_title_en:  'Send us a message',
    // Contatti: da compilare manualmente in WP (dati sensibili)
    // telefono, email, whatsapp, indirizzo, p_iva, social
  };

  console.log('');
  console.log('⚠️  Le options pages vanno compilate manualmente in wp-admin.');
  console.log('    Vai su: ' + WP_URL + '/wp-admin/admin.php?page=badiula-options');
  console.log('    I dati da inserire sono:');
  console.log('');
  for (const [key, val] of Object.entries(payload)) {
    console.log(`    ${key}: ${val}`);
  }
}

// ─── Import: Sezioni Homepage (options page) ──────────────────────────────────

async function importSezioniHomepage() {
  console.log('\n── Sezioni Homepage ──────────────────────────');

  const p1it = it.about?.p1 ?? {};
  const p1en = en.about?.p1 ?? {};
  const p2it = it.about?.p2 ?? {};
  const p2en = en.about?.p2 ?? {};
  const p3it = it.about?.p3 ?? {};
  const p3en = en.about?.p3 ?? {};
  const prdit = it.productions ?? {};
  const prden = en.productions ?? {};
  const luceit = it.luce ?? {};
  const luceen = en.luce ?? {};
  const shopit = it.shop ?? {};
  const shopen = en.shop ?? {};

  const payload = {
    hero_titolo_it:       it.hero?.title ?? '',
    hero_titolo_en:       en.hero?.title ?? '',
    hero_sottotitolo_it:  it.hero?.subtitle ?? '',
    hero_sottotitolo_en:  en.hero?.subtitle ?? '',
    hero_cta_it:          it.hero?.cta ?? '',
    hero_cta_en:          en.hero?.cta ?? '',
    hero_video:           '/videos/hero.mp4',

    about_p1_eyebrow_it:  p1it.eyebrow ?? '',
    about_p1_eyebrow_en:  p1en.eyebrow ?? '',
    about_p1_heading_it:  p1it.heading ?? '',
    about_p1_heading_en:  p1en.heading ?? '',
    about_p1_body_it:     p1it.body ?? '',
    about_p1_body_en:     p1en.body ?? '',
    about_p1_cta_it:      p1it.cta ?? '',
    about_p1_cta_en:      p1en.cta ?? '',

    about_p2_eyebrow_it:  p2it.eyebrow ?? '',
    about_p2_eyebrow_en:  p2en.eyebrow ?? '',
    about_p2_heading_it:  p2it.heading ?? '',
    about_p2_heading_en:  p2en.heading ?? '',
    about_p2_body_it:     p2it.body ?? '',
    about_p2_body_en:     p2en.body ?? '',
    about_p2_body2_it:    p2it.body2 ?? '',
    about_p2_body2_en:    p2en.body2 ?? '',

    about_p3_eyebrow_it:  p3it.eyebrow ?? '',
    about_p3_eyebrow_en:  p3en.eyebrow ?? '',
    about_p3_heading_it:  p3it.heading ?? '',
    about_p3_heading_en:  p3en.heading ?? '',
    about_p3_body_it:     p3it.body ?? '',
    about_p3_body_en:     p3en.body ?? '',

    produzioni_eyebrow_it:      prdit.eyebrow ?? '',
    produzioni_eyebrow_en:      prden.eyebrow ?? '',
    produzioni_titolo_it:       prdit.title ?? '',
    produzioni_titolo_en:       prden.title ?? '',
    produzioni_sottotitolo_it:  prdit.subtitle ?? '',
    produzioni_sottotitolo_en:  prden.subtitle ?? '',

    luce_titolo_it:       luceit.title ?? '',
    luce_titolo_en:       luceen.title ?? '',
    luce_sottotitolo_it:  luceit.subtitle ?? '',
    luce_sottotitolo_en:  luceen.subtitle ?? '',
    luce_body_it:         luceit.body ?? '',
    luce_body_en:         luceen.body ?? '',

    shop_banner_titolo_it:      shopit.title ?? '',
    shop_banner_titolo_en:      shopen.title ?? '',
    shop_banner_sottotitolo_it: shopit.subtitle ?? '',
    shop_banner_sottotitolo_en: shopen.subtitle ?? '',
  };

  console.log('');
  console.log('⚠️  Le options pages vanno compilate manualmente in wp-admin.');
  console.log('    Vai su: ' + WP_URL + '/wp-admin/admin.php?page=badiula-sezioni-homepage');
  console.log('    I dati da inserire sono:');
  console.log('');
  for (const [key, val] of Object.entries(payload)) {
    console.log(`    ${key}: ${val}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌱 Badiula — Import WordPress${DRY_RUN ? ' [DRY RUN]' : ''}`);
  console.log(`   Endpoint: ${WP_URL}/wp-json/wp/v2`);
  console.log(`   Prodotti caricati da lib/data.ts: ${PRODUCTS.length}`);
  console.log(`   Sezioni azienda: ${COMPANY_SECTIONS.length}`);

  await importProducts();
  await importSezioniAzienda();
  await importOpzioniGlobali();
  await importSezioniHomepage();

  console.log('\n✔  Import completato.\n');
}

main();
