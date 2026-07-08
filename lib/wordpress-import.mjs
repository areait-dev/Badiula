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

// ─── Import: Pagina Certificazioni (pagina nativa WP, slug: certificazioni) ──

async function importPaginaCertificazioni() {
  console.log('\n── Pagina Certificazioni ─────────────────────');
  const existing = await findPost('pages', 'certificazioni');
  if (!existing) {
    console.error('❌ La pagina con slug "certificazioni" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }
  try {
    const postRes = await wpFetch(`/pages/${existing.id}`, 'POST', {
      status: 'publish',
      acf: {
        hero_titolo:      'CERTIFICAZIONI',
        hero_sottotitolo: 'Qualità certificata, filiera trasparente',
        hero_testo:
          'Le nostre coltivazioni e la nostra filiera sono coperte da un sistema completo di certificazioni internazionali che garantiscono biologicità, sicurezza alimentare, sostenibilità delle pratiche agricole e responsabilità sociale. Ogni certificazione è il risultato di audit periodici condotti da enti terzi indipendenti.',

        biologiche_titolo:       'Biologiche',
        biologiche_card1_titolo: 'Biologico UE',
        biologiche_card1_testo:  'Tutte le nostre coltivazioni sono certificate biologiche secondo il regolamento europeo (UE) 2018/848, che disciplina la produzione biologica in tutti gli Stati membri.',
        biologiche_card2_titolo: 'Bio Suisse',
        biologiche_card2_testo:  'Standard biologico svizzero, tra i più rigorosi al mondo, che impone requisiti aggiuntivi rispetto al regolamento UE in termini di biodiversità, gestione del suolo, benessere animale e sostenibilità complessiva.',

        qualita_sicurezza_titolo: 'QUALITÀ E SICUREZZA ALIMENTARE',
        qualita_sicurezza_testo:
          '<p><strong>GlobalG.A.P. (Good Agricultural Practice)</strong></p>' +
          '<p>Standard internazionale per le buone pratiche agricole, riconosciuto dai principali player del retail e dell\'export agroalimentare.</p>' +
          '<p>Badiula aderisce con due add-on aggiuntivi:</p>' +
          '<ul>' +
          '<li><strong>SPRING</strong> - Sustainable Programme for Irrigation and Groundwater use: modulo dedicato alla gestione responsabile dell\'acqua e delle falde acquifere</li>' +
          '<li><strong>GRASP</strong> - GlobalG.A.P. Risk Assessment on Social Practice: modulo dedicato alla responsabilità sociale, condizioni di lavoro e diritti dei lavoratori agricoli</li>' +
          '</ul>' +
          '<p><strong>ISO 22000</strong></p>' +
          '<p>Certificazione internazionale per i sistemi di gestione della sicurezza alimentare, applicata a tutto il processo produttivo dal campo al confezionamento.</p>',

        tutela_origine_titolo:       'Tutela di origine',
        tutela_origine_card1_titolo: 'Arancia Rossa di Sicilia IGP',
        tutela_origine_card1_testo:  'Badiula è membro del Consorzio di Tutela Arancia Rossa di Sicilia IGP, riconoscimento europeo che protegge le varietà Tarocco, Moro e Sanguinello coltivate nell\'area di elezione delle arance rosse siciliane (province di Catania, Siracusa ed Enna).',
        tutela_origine_card2_titolo: 'Distretto Agrumi di Sicilia',
        tutela_origine_card2_testo:  'Membro attivo del Distretto Produttivo Agrumi di Sicilia, che riunisce le aziende agricole siciliane di qualità e promuove progetti di ricerca, innovazione e valorizzazione del comparto.',

        riconoscimenti_titolo:  'Riconoscimenti aggiuntivi',
        riconoscimenti_testo:
          '<p><strong>Azienda Didattica accreditata</strong></p>' +
          '<p>Dal 2009 Badiula è Azienda Didattica accreditata secondo la normativa regionale siciliana, accogliendo classi, gruppi e visitatori per persone educative dedicati all\'agricoltura biologica, alla sostenibilità ambientale e alla cultura agrumicola del territorio.</p>',
      },
    });
    if (postRes.acf) {
      console.log(`✅ Pagina certificazioni aggiornata (ID ${existing.id})`);
    } else {
      console.warn(`⚠️  Pagina certificazioni aggiornata ma "acf" assente nella risposta (ID ${existing.id})`);
    }
  } catch (err) {
    console.error('❌ Errore su pages/certificazioni:', err.message);
  }
}

// ─── Import: Pagina Sostenibilità (pagina nativa WP, slug: sostenibilita) ────

async function importPaginaSostenibilita() {
  console.log('\n── Pagina Sostenibilità ──────────────────────');
  const existing = await findPost('pages', 'sostenibilita');
  if (!existing) {
    console.error('❌ La pagina con slug "sostenibilita" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }
  try {
    const postRes = await wpFetch(`/pages/${existing.id}`, 'POST', {
      status: 'publish',
      acf: {
        hero_titolo:      'SOSTENIBILITÀ',
        hero_sottotitolo: 'Energie rinnovabili, gestione idrica intelligente, emissioni zero',
        hero_testo:
          'La sostenibilità ambientale è parte integrante del modello produttivo Badiula. Operiamo secondo principi di agricoltura responsabile che integrano energie rinnovabili, gestione efficiente delle risorse idriche e riduzione costante dell\'impatto ambientale lungo tutta la filiera.\n' +
          'Non è un programma di "compensazione" delle emissioni: è una scelta strutturale che parte dalla progettazione del centro di lavorazione e arriva alla gestione quotidiana delle coltivazioni.',

        sezione_1_titolo: 'Magazzino a emissioni zero',
        sezione_1_testo:
          '<p>Il nostro centro di lavorazione di Carlentini è progettato per operare a emissioni zero. Tutte le attività di movimentazione interna vengono tramite mezzi elettrici, così come il trasporto aziendale tra campi e magazzino, effettuato con camion elettrici.</p>' +
          '<p><strong>Impianto fotovoltaico e sistema di accumulo</strong></p>' +
          '<p>Il sistema energetico è alimentato da:</p>' +
          '<ul>' +
          '<li>Impianto fotovoltaico da 200 kW installato sulle coperture del centro di lavorazione</li>' +
          '<li>Sistema di accumulo da 400 kW che permette di immagazzinare l\'energia prodotta durante il giorno e utilizzarla nelle fasi di picco operativo</li>' +
          '</ul>' +
          '<p>Questa configurazione rende il nostro centro energeticamente autosufficiente e a basso impatto ambientale, riducendo drasticamente la dipendenza da fonti energetiche fossili.</p>',

        sezione_2_titolo: 'Gestione delle risorse idriche',
        sezione_2_testo:
          '<p>La gestione dell\'acqua è uno dei temi più critici dell\'agricoltura mediterranea, ancora più rilevante alla luce dei cambiamenti climatici in corso. Badiula adotta tre soluzioni integrate:</p>' +
          '<ul>' +
          '<li>Due laghetti aziendali per la raccolta e l\'accumulo delle acque</li>' +
          '<li>Irrigazione a goccia su tutti i 120 ettari coltivati per ottimizzare il consumo idrico</li>' +
          '<li>Sistemi intelligenti di monitoraggio climatico con sensori in campo e stazioni meteo</li>' +
          '</ul>' +
          '<p>Le soluzioni di gestione idrica sono state sviluppate anche grazie alla collaborazione con il Distretto Produttivo Agrumi di Sicilia e con l\'Università degli Studi di Catania.</p>' +
          '<p><strong>Filiera a basso impatto</strong></p>' +
          '<p>Tutta la filiera Badiula è progettata per minimizzare l\'impatto ambientale: filiera corta (dalla raccolta alla lavorazione pochi chilometri), packaging ottimizzato, trasporto su gomma elettrico per i tratti interni.</p>',
      },
    });
    if (postRes.acf) {
      console.log(`✅ Pagina sostenibilita aggiornata (ID ${existing.id})`);
    } else {
      console.warn(`⚠️  Pagina sostenibilita aggiornata ma "acf" assente nella risposta (ID ${existing.id})`);
    }
  } catch (err) {
    console.error('❌ Errore su pages/sostenibilita:', err.message);
  }
}

// ─── Import: Pagina Innovazione (pagina nativa WP, slug: innovazione) ────────

async function importPaginaInnovazione() {
  console.log('\n── Pagina Innovazione ────────────────────────');
  const existing = await findPost('pages', 'innovazione');
  if (!existing) {
    console.error('❌ La pagina con slug "innovazione" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }
  try {
    const postRes = await wpFetch(`/pages/${existing.id}`, 'POST', {
      status: 'publish',
      acf: {
        hero_titolo:      'INNOVAZIONE 4.0',
        hero_sottotitolo: 'Sensori, blockchain, agricoltura di precisione:\ntecnologia al servizio della terra',
        hero_testo:
          'L\'agricoltura di precisione è uno dei pilastri del modello produttivo Badiula. Non concepiamo la tecnologia come sostituzione del lavoro agricolo tradizionale, ma come strumento per renderlo più efficiente, più rispettoso delle risorse e più tracciabile. Per noi la tecnologia non sostituisce la terra: la accompagna.',

        sezione_1_titolo: 'Monitoraggio in campo',
        sezione_1_testo:
          '<p>I nostri agrumeti sono dotati di un sistema integrato di:</p>' +
          '<ul>' +
          '<li>Sensori IoT per il monitoraggio di umidità del suolo, temperatura e radiazione solare</li>' +
          '<li>Stazioni meteo aziendali che rilevano in continuo dati climatici locali</li>' +
          '<li>Piattaforme digitali di raccolta dati che incrociano informazioni ambientali e agronomiche</li>' +
          '<li>Sistemi predittivi per anticipare stress idrico, eventi climatici e necessità di intervento agronomico</li>' +
          '</ul>' +
          '<p>Questi strumenti ci permettono di prendere decisioni basate sui dati, riducendo l\'uso di acqua, energia e interventi inutili sul campo.</p>',

        sezione_2_titolo: 'Blockchain di filiera',
        sezione_2_testo:
          '<p>La tecnologia blockchain applicata alla filiera garantisce tracciabilità completa e trasparenza lungo tutto il percorso produttivo, dalla coltivazione al confezionamento. Per il cliente finale e il buyer significa avere prove digitali immutabili dell\'origine e del percorso del prodotto.</p>' +
          '<p>L\'agricoltura 4.0, per noi, non è opposta alla tradizione: è il modo per proteggere e prolungare un sapere agricolo costruito in quattro generazioni. I sensori in campo permettono ai nostri agronomi di lavorare meglio, non di lavorare meno. La blockchain garantisce trasparenza al consumatore finale di un prodotto che resta artigianale nelle scelte agronomiche e nella raccolta.</p>',

        sezione_3_titolo: 'Ricerca e collaborazioni',
        sezione_3_testo:
          '<p>L\'innovazione agricola Badiula non avviene in isolamento: collaboriamo attivamente con il mondo della ricerca attraverso partnership consolidate.</p>' +
          '<p><strong>Università degli Studi di Catania</strong></p>' +
          '<p>Collaborazione di ricerca su progetti dedicati alla gestione climatica e idrica delle coltivazioni agrumicole siciliane. Tra i progetti più recenti: Progetto Clima e Progetto Acqua, che hanno portato all\'introduzione di droni, WebGIS e sistemi predittivi nell\'azienda.</p>' +
          '<p><strong>Distretto Produttivo Agrumi di Sicilia</strong></p>' +
          '<p>Membro attivo del Distretto, partecipiamo a iniziative di ricerca e sviluppo per il comparto agrumicolo regionale.</p>',
      },
    });
    if (postRes.acf) {
      console.log(`✅ Pagina innovazione aggiornata (ID ${existing.id})`);
    } else {
      console.warn(`⚠️  Pagina innovazione aggiornata ma "acf" assente nella risposta (ID ${existing.id})`);
    }
  } catch (err) {
    console.error('❌ Errore su pages/innovazione:', err.message);
  }
}

// ─── Import: Pagina Filiera e Lavorazione (slug: filiera-e-lavorazione) ──────

async function importPaginaFilieraLavorazione() {
  console.log('\n── Pagina Filiera e Lavorazione ──────────────');
  const existing = await findPost('pages', 'filiera-e-lavorazione');
  if (!existing) {
    console.error('❌ La pagina con slug "filiera-e-lavorazione" non esiste in WordPress.\n   Creala prima manualmente in wp-admin con questo slug esatto.');
    return;
  }
  try {
    const postRes = await wpFetch(`/pages/${existing.id}`, 'POST', {
      status: 'publish',
      acf: {
        hero_titolo_1:    'FILIERA E',
        hero_titolo_2:    'LAVORAZIONE',
        hero_sottotitolo: 'Una filiera corta, gestita internamente, certificata blockchain',
        hero_testo:
          'Gestiamo internamente ogni fase del processo produttivo Badiula, dalla raccolta in campo alla spedizione al cliente finale. Questa scelta ci permette di garantire la piena tracciabilità del prodotto lungo tutto il percorso, certificata attraverso tecnologia blockchain, e di mantenere standard qualitativi controllati in ogni passaggio.',

        sezione_1_titolo: 'Il centro di lavorazione di Carlentini',
        sezione_1_testo:
          '<p>Il nuovo centro di lavorazione Badiula, di circa 2000 metri quadrati, è situato all\'interno della nostra azienda agricola di Carlentini, a poche centinaia di metri dagli agrumeti. La vicinanza tra campo e magazzino permette una lavorazione immediata, preservando freschezza e caratteristiche organolettiche degli agrumi.</p>' +
          '<p>Il centro è dedicato a quattro attività principali:</p>' +
          '<ul>' +
          '<li><strong>Selezione:</strong> controllo qualità manuale e ottico dei frutti raccolti</li>' +
          '<li><strong>Calibratura:</strong> classificazione per dimensione e formato commerciale</li>' +
          '<li><strong>Confezionamento:</strong> imballaggio in formati standard o personalizzati su richiesta del cliente</li>' +
          '<li><strong>Stoccaggio:</strong> conservazione in condizioni controllate, nel rispetto delle normative vigenti</li>' +
          '</ul>',

        central_title_1: 'Dall\'albero al',
        central_title_2: 'confezionamento',

        sezione_2_titolo: 'Tracciabilità blockchain',
        sezione_2_testo:
          '<p>La nostra filiera è certificata tramite tecnologia blockchain: ogni fase del processo produttivo è documentata in modo immutabile e verificabile, dalla raccolta del singolo lotto in campo fino al pack finale.</p>' +
          '<p>Per il buyer e il consumatore finale significa avere prove digitali dell\'origine del prodotto, della varietà coltivata, della data di raccolta e del percorso di lavorazione. La blockchain di filiera è uno standard che si sta affermando nell\'agroalimentare di qualità come strumento di garanzia per export, retail specializzato e canali premium.</p>',

        sezione_3_titolo: 'Continuità di fornitura e capacità operativa',
        sezione_3_testo:
          '<p>Il centro di lavorazione è progettato per accogliere e gestire volumi significativi di prodotto, assicurando efficienza operativa, continuità nella fornitura e controllo diretto su ogni passaggio della filiera.</p>' +
          '<p>Questo è particolarmente rilevante per i nostri partner B2B (retail specializzato, GDO, horeca, importatori), che possono contare su un calendario di disponibilità annua coerente con le finestre stagionali delle varietà coltivate.</p>',
      },
    });
    if (postRes.acf) {
      console.log(`✅ Pagina filiera-e-lavorazione aggiornata (ID ${existing.id})`);
    } else {
      console.warn(`⚠️  Pagina filiera-e-lavorazione aggiornata ma "acf" assente nella risposta (ID ${existing.id})`);
    }
  } catch (err) {
    console.error('❌ Errore su pages/filiera-e-lavorazione:', err.message);
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
  await importPaginaCertificazioni();
  await importPaginaSostenibilita();
  await importPaginaInnovazione();
  await importPaginaFilieraLavorazione();

  console.log('\n✔  Import completato.\n');
}

main();
