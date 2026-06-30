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
const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Accept':        'application/json',
  Authorization:  `Basic ${AUTH}`,
};

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

// ─── Import: Opzioni Globali (pagina nativa WP, slug: opzioni-globali) ───────

async function importOpzioniGlobali() {
  console.log('\n── Opzioni Globali ───────────────────────────');
  const existing = await findPost('pages', 'opzioni-globali');
  if (!existing) {
    console.error('❌ La pagina con slug "opzioni-globali" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }
  try {
    await wpFetch(`/pages/${existing.id}`, 'POST', {
      status: 'publish',
      acf: {
        footer_quote_it:      'Non produciamo\nsemplicemente agrumi,\ncoltiviamo un modo\ndiverso di vivere la terra',
        footer_quote_en:      '',
        footer_form_title_it: 'Inviaci un messaggio',
        footer_form_title_en: 'Send us a message',
        indirizzo:            'C.da Badiula San Leonardo\n96013 Carlentini (SR)',
        p_iva:                '01796500898',
        telefono:             '',
        email:                '',
        whatsapp:             '',
        instagram:            '',
        facebook:             '',
        linkedin:             '',
      },
    });
    console.log(`✅ Opzioni globali aggiornate (ID ${existing.id})`);
  } catch (err) {
    console.error('❌ Errore su pages/opzioni-globali:', err.message);
  }
}

// ─── Import: Homepage (pagina nativa WP, slug: home) ─────────────────────────

async function importSezioniHomepage() {
  console.log('\n── Sezioni Homepage ──────────────────────────');

  const p1it  = it.about?.p1      ?? {};
  const p1en  = en.about?.p1      ?? {};
  const p2it  = it.about?.p2      ?? {};
  const p2en  = en.about?.p2      ?? {};
  const p3it  = it.about?.p3      ?? {};
  const p3en  = en.about?.p3      ?? {};
  const prdit = it.productions    ?? {};
  const prden = en.productions    ?? {};
  const luceit = it.luce          ?? {};
  const luceen = en.luce          ?? {};
  const shopit = it.shop          ?? {};
  const shopen = en.shop          ?? {};

  const existing = await findPost('pages', 'home');
  if (!existing) {
    console.error('❌ La pagina con slug "home" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }
  const acfPayload = {
    hero_titolo_it:       it.hero?.title    ?? '',
    hero_titolo_en:       en.hero?.title    ?? '',
    hero_sottotitolo_it:  it.hero?.subtitle ?? '',
    hero_sottotitolo_en:  en.hero?.subtitle ?? '',
    hero_cta_it:          it.hero?.cta      ?? '',
    hero_cta_en:          en.hero?.cta      ?? '',
    hero_video:           '/videos/hero.mp4',

    about_p1_eyebrow_it:  p1it.eyebrow ?? '',
    about_p1_eyebrow_en:  p1en.eyebrow ?? '',
    about_p1_heading_it:  p1it.heading ?? '',
    about_p1_heading_en:  p1en.heading ?? '',
    about_p1_body_it:     p1it.body    ?? '',
    about_p1_body_en:     p1en.body    ?? '',
    about_p1_cta_it:      p1it.cta     ?? '',
    about_p1_cta_en:      p1en.cta     ?? '',

    about_p2_eyebrow_it:  p2it.eyebrow ?? '',
    about_p2_eyebrow_en:  p2en.eyebrow ?? '',
    about_p2_heading_it:  p2it.heading ?? '',
    about_p2_heading_en:  p2en.heading ?? '',
    about_p2_body_it:     p2it.body    ?? '',
    about_p2_body_en:     p2en.body    ?? '',
    about_p2_body2_it:    p2it.body2   ?? '',
    about_p2_body2_en:    p2en.body2   ?? '',

    about_p3_eyebrow_it:  p3it.eyebrow ?? '',
    about_p3_eyebrow_en:  p3en.eyebrow ?? '',
    about_p3_heading_it:  p3it.heading ?? '',
    about_p3_heading_en:  p3en.heading ?? '',
    about_p3_body_it:     p3it.body    ?? '',
    about_p3_body_en:     p3en.body    ?? '',

    produzioni_eyebrow_it:      prdit.eyebrow  ?? '',
    produzioni_eyebrow_en:      prden.eyebrow  ?? '',
    produzioni_titolo_it:       prdit.title    ?? '',
    produzioni_titolo_en:       prden.title    ?? '',
    produzioni_sottotitolo_it:  prdit.subtitle ?? '',
    produzioni_sottotitolo_en:  prden.subtitle ?? '',

    luce_titolo_it:       luceit.title    ?? '',
    luce_titolo_en:       luceen.title    ?? '',
    luce_sottotitolo_it:  luceit.subtitle ?? '',
    luce_sottotitolo_en:  luceen.subtitle ?? '',
    luce_body_it:         luceit.body     ?? '',
    luce_body_en:         luceen.body     ?? '',

    shop_banner_titolo_it:      shopit.title    ?? '',
    shop_banner_titolo_en:      shopen.title    ?? '',
    shop_banner_sottotitolo_it: shopit.subtitle ?? '',
    shop_banner_sottotitolo_en: shopen.subtitle ?? '',
  };

  try {
    // ── DEBUG: POST diretto senza passare per upsert ──────────────────────────
    const postPath = `/pages/${existing.id}`;
    const postBody = { status: 'publish', acf: acfPayload };
    console.log('\n[DEBUG] POST', `${WP_URL}/wp-json/wp/v2${postPath}`);
    console.log('[DEBUG] Body JSON inviato (primi 300 char):');
    console.log(JSON.stringify(postBody).slice(0, 300));

    const postRes = await wpFetch(postPath, 'POST', postBody);

    console.log('\n[DEBUG] Risposta POST completa:');
    console.log(JSON.stringify(postRes, null, 2));

    if (postRes.acf) {
      console.log('\n[DEBUG] Campo "acf" nella risposta POST: presente ✅');
    } else {
      console.warn('\n[DEBUG] Campo "acf" nella risposta POST: ASSENTE ⚠️  (ACF non esposto nella REST API?)');
    }

    // ── GET di verifica ───────────────────────────────────────────────────────
    const getRes = await wpFetch(`/pages/${existing.id}`);
    console.log('\n[DEBUG] GET di verifica — campo "acf":');
    console.log(JSON.stringify(getRes.acf ?? '(campo acf non presente nella risposta GET)', null, 2));

  } catch (err) {
    console.error('❌ Errore su pages/home:', err.message);
  }
}

// ─── Import: Pagina Coltivazioni (pagina nativa WP, slug: coltivazioni) ───────

async function importPaginaColtivazioni() {
  console.log('\n── Pagina Coltivazioni ───────────────────────');
  const existing = await findPost('pages', 'coltivazioni');
  if (!existing) {
    console.error('❌ La pagina con slug "coltivazioni" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }
  try {
    const postRes = await wpFetch(`/pages/${existing.id}`, 'POST', {
      status: 'publish',
      acf: {
        // ── IT ────────────────────────────────────────────────────────────────
        titolo_it:           'COLTIVAZIONI',
        sottotitolo_it:      'Cinque produzioni biologiche, una stagionalità naturale',
        intro_p1_it:         'Le nostre coltivazioni si sviluppano su oltre 120 ettari tra Carlentini e Lentini, in provincia di Siracusa, in un territorio unico per la produzione agrumicola siciliana. Il clima mediterraneo, la fertilità dei terreni e l\'influenza dell\'Etna creano le condizioni ideali per produrre agrumi biologici di alta qualità.',
        intro_p2_it:         'Coltiviamo cinque produzioni principali: arance rosse di Sicilia IGP, arance bionde, limoni, bergamotto e pompelmo. Ogni raccolta segue la naturale stagionalità del prodotto per preservarne freschezza, aroma e caratteristiche organolettiche.',
        grid_titolo_it:      'LE NOSTRE PRODUZIONI',
        calendario_titolo_it: 'CALENDARIO DI RACCOLTA',
        banner_heading_it:   'Agrumi siciliani\ndirettamente dal produttore',
        banner_sub_it:       'Box stagionali di agrumi biologici, olio extravergine Luce di Terra,\nmarmellate di agrumi. Spedizioni in Italia e in Unione Europea',
        // ── EN (da tradurre) ──────────────────────────────────────────────────
        titolo_en:           '',
        sottotitolo_en:      '',
        intro_p1_en:         '',
        intro_p2_en:         '',
        banner_heading_en:   '',
        banner_sub_en:       '',
      },
    });
    if (postRes.acf) {
      console.log(`✅ Pagina coltivazioni aggiornata (ID ${existing.id})`);
    } else {
      console.warn(`⚠️  Pagina coltivazioni aggiornata ma "acf" assente nella risposta (ID ${existing.id})`);
    }
  } catch (err) {
    console.error('❌ Errore su pages/coltivazioni:', err.message);
  }
}

// ─── Import: Pagina Luce di Terra (pagina nativa WP, slug: luce-di-terra) ─────

async function importPaginaLuceDiTerra() {
  console.log('\n── Pagina Luce di Terra ──────────────────────');
  const existing = await findPost('pages', 'luce-di-terra');
  if (!existing) {
    console.error('❌ La pagina con slug "luce-di-terra" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }
  try {
    const postRes = await wpFetch(`/pages/${existing.id}`, 'POST', {
      status: 'publish',
      acf: {
        // ── IT ────────────────────────────────────────────────────────────────
        titolo_it:           'LUCE DI TERRA',
        sottotitolo_it:      "La firma Badiula dedicata all'olio e ai sapori della terra",
        intro_p1_it:         "Accanto agli agrumi biologici nasce Luce di Terra, la collezione Badiula dedicata all'olio extravergine di oliva biologico e alle marmellate di agrumi siciliane. Una linea pensata per portare nel quotidiano i sapori autentici del nostro territorio, attraverso lavorazioni attente e materia prima coltivata direttamente nei nostri terreni della Sicilia orientale.",
        intro_p2_it:         "La filosofia è semplice: valorizzare la materia prima attraverso gesti lenti, rispetto della terra e processi produttivi rispettosi dell'origine. Luce di Terra rappresenta l'incontro tra tradizione agricola, sostenibilità e ricerca della qualità.",
        linee_titolo_it:     'LE DUE LINEE',
        olio_titolo_it:      'Olio Extravergine di Oliva',
        olio_desc_it:        'Estratto a freddo entro 24 ore dalla raccolta, dai nostri uliveti di Carlentini. Fruttato, erbaceo, identità siciliana in ogni goccia.',
        olio_prezzo:         'Da €12,00',
        marmellata_titolo_it: 'Marmellate di Agrumi',
        marmellata_desc_it:  'Solo frutta biologica, zucchero e cura artigianale. La stagionalità dei nostri agrumi trasformata in sapori intensi e naturali.',
        marmellata_prezzo:   'Da €6,50',
        filiera_titolo_it:   'Una filiera che parte dal campo',
        filiera_body_it:     'Tutto ciò che entra in Luce di Terra nasce nei nostri terreni di Carlentini e Lentini.\n\nOlive di varietà siciliane coltivate accanto agli agrumeti, agrumi biologici raccolti al giusto punto di maturazione e trasformati in marmellate.\n\nÈ il vantaggio di una filiera corta e integrata: dalla raccolta alla bottiglia o al vasetto, il prodotto percorre pochi chilometri e pochi giorni, preservando integrità e freschezza.',
        // ── EN (da tradurre) ──────────────────────────────────────────────────
        titolo_en:           '',
        sottotitolo_en:      '',
        intro_p1_en:         '',
        intro_p2_en:         '',
        olio_titolo_en:      '',
        olio_desc_en:        '',
        marmellata_titolo_en: '',
        marmellata_desc_en:  '',
        filiera_titolo_en:   '',
        filiera_body_en:     '',
      },
    });
    if (postRes.acf) {
      console.log(`✅ Pagina luce-di-terra aggiornata (ID ${existing.id})`);
    } else {
      console.warn(`⚠️  Pagina luce-di-terra aggiornata ma "acf" assente nella risposta (ID ${existing.id})`);
    }
  } catch (err) {
    console.error('❌ Errore su pages/luce-di-terra:', err.message);
  }
}

// ─── Import: Pagina Shop (pagina nativa WP, slug: shop) ──────────────────────

async function importPaginaShop() {
  console.log('\n── Pagina Shop ───────────────────────────────');
  const existing = await findPost('pages', 'shop');
  if (!existing) {
    console.error('❌ La pagina con slug "shop" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }
  try {
    const postRes = await wpFetch(`/pages/${existing.id}`, 'POST', {
      status: 'publish',
      acf: {
        // ── IT ────────────────────────────────────────────────────────────────
        hero_titolo_it:      'IL GUSTO AUTENTICO\nDELLA SICILIA',
        hero_sottotitolo_it: 'Direttamente dal produttore',
        // ── EN (da tradurre) ──────────────────────────────────────────────────
        hero_titolo_en:      '',
        hero_sottotitolo_en: '',
      },
    });
    if (postRes.acf) {
      console.log(`✅ Pagina shop aggiornata (ID ${existing.id})`);
    } else {
      console.warn(`⚠️  Pagina shop aggiornata ma "acf" assente nella risposta (ID ${existing.id})`);
    }
  } catch (err) {
    console.error('❌ Errore su pages/shop:', err.message);
  }
}

// ─── Import: Pagina Azienda (pagina nativa WP, slug: azienda) ────────────────

async function importPaginaAzienda() {
  console.log('\n── Pagina Azienda ────────────────────────────');

  const existing = await findPost('pages', 'azienda');
  if (!existing) {
    console.error('❌ La pagina con slug "azienda" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }

  const acfPayload = {
    // ── IT ──────────────────────────────────────────────────────────────────
    hero_label_it: 'Azienda',
    hero_titolo_it: 'Quattro generazioni,\nuna terra',
    hero_body_it:
      "Badiula è un'azienda agricola biologica situata a Carlentini, in provincia di Siracusa.\n\nSi estende su oltre 120 ettari nel cuore della Sicilia orientale, in una delle aree più vocate alla coltivazione agrumicola del Mediterraneo.\n\nIl percorso imprenditoriale della famiglia Di Giorgio prende forma negli anni '70, inizialmente dedicato alla coltivazione agrumicola tradizionale.",
    video_url: '',
    filosofia_body_it:
      "Nel tempo l'azienda è cresciuta ed evoluta, sviluppando una visione produttiva capace di integrare esperienza agricola, sostenibilità ambientale e innovazione tecnologica.\n\nOggi Badiula è una moderna azienda agricola biologica orientata alla qualità, alla tracciabilità e alla gestione responsabile delle risorse naturali, attraverso una filiera che unisce agricoltura di precisione, energie rinnovabili e monitoraggio avanzato delle coltivazioni.",
    quote_it: 'LA TERRA\nCI INSEGNA\nTEMPO',
    cultura_titolo_it:
      "Esistono luoghi in cui\nl'agricoltura non è\nsoltanto produzione,\nma cultura, memoria e\nidentità.",
    cultura_body_it:
      'Badiula nasce da una terra antica, nel cuore della Sicilia orientale, dove la luce attraversa gli agrumeti e ogni raccolto racconta il legame profondo tra uomo e natura.\n\nDa oltre quattro generazioni coltiviamo questa terra con rispetto, custodendo un sapere agricolo fatto di gesti lenti, osservazione ed equilibrio. Crediamo in una produzione che sappia evolversi senza perdere autenticità. Per questo la tecnologia, per noi, non sostituisce la terra: la accompagna.',
    manifesto_it:
      "Non inseguiamo l'eccesso. Cerchiamo l'equilibrio.\nNon produciamo semplicemente agrumi.\nColtiviamo un modo diverso di vivere la terra.",
    vision_label_it: 'Vision',
    vision_body_it:
      "Diventare un modello di sostenibilità e ospitalità verde in Sicilia, dimostrando che è possibile fare agricoltura nel pieno rispetto dell'ecosistema, creando un ponte perfetto tra benessere, turismo ecologico e tutela del paesaggio.",
    mission_label_it: 'Mission',
    mission_body_it:
      "Custodire la terra per le future generazioni, produrre eccellenze biologiche e offrire un'ospitalità che rigenera corpo e mente, valorizzando la cultura rurale siciliana attraverso experiences autentiche e trasparenti.",
    territorio_titolo_it: "Tra il mare e l'Etna",
    territorio_body_it:
      "Le nostre aziende agricole si estendono tra Carlentini e Lentini, in provincia di Siracusa, in un'area vocata da secoli alla coltivazione agrumicola. Qui il clima mediterraneo, la fertilità dei terreni e l'influenza dell'Etna creano le condizioni ideali per produrre agrumi di alta qualità.",

    // ── EN (da tradurre — lasciati vuoti) ───────────────────────────────────
    hero_label_en: '',
    hero_titolo_en: '',
    hero_body_en: '',
    filosofia_body_en: '',
    quote_en: '',
    cultura_titolo_en: '',
    cultura_body_en: '',
    manifesto_en: '',
    vision_label_en: '',
    vision_body_en: '',
    mission_label_en: '',
    mission_body_en: '',
    territorio_titolo_en: '',
    territorio_body_en: '',
  };

  try {
    const postRes = await wpFetch(`/pages/${existing.id}`, 'POST', {
      status: 'publish',
      acf: acfPayload,
    });
    if (postRes.acf) {
      console.log(`✅ Pagina azienda aggiornata (ID ${existing.id})`);
    } else {
      console.warn(`⚠️  Pagina azienda aggiornata ma il campo "acf" non è nella risposta (ID ${existing.id})`);
    }
  } catch (err) {
    console.error('❌ Errore su pages/azienda:', err.message);
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
  await importPaginaAzienda();
  await importPaginaColtivazioni();
  await importPaginaLuceDiTerra();
  await importPaginaShop();

  console.log('\n✔  Import completato.\n');
}

main();
