import type {
  Product,
  ProductAcf,
  SezioneAzienda,
  HomepageData,
  GlobalOptions,
  PaginaAzienda,
  PaginaColtivazioni,
  PaginaLuceDiTerra,
  PaginaOlioEvo,
  PaginaMarmellate,
  PaginaShop,
  Sezione,
  Faq,
  VarietaMarmellata,
} from './types';

import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_BY_SLUG,
  GET_ALL_SEZIONI_AZIENDA,
} from './queries';

// ─── Client GraphQL (solo per CPT) ───────────────────────────────────────────

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL as string;

interface GQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60, tags: ['wordpress'] },
  });

  if (!res.ok) {
    console.error(`[WPGraphQL] HTTP ${res.status} – ${res.statusText}`);
    throw new Error(`WPGraphQL request failed: ${res.status}`);
  }

  const json: GQLResponse<T> = await res.json();

  if (json.errors?.length) {
    console.error('[WPGraphQL] Errors:', json.errors);
    throw new Error(json.errors.map((e) => e.message).join(' | '));
  }

  return json.data as T;
}

// ─── SEO da Yoast (yoast_head_json) ──────────────────────────────────────────

export interface SeoData {
  title: string;
  description: string;
  ogImage: string | null;
  canonical: string;
}

export async function getPageSeo(slug: string): Promise<SeoData | null> {
  try {
    const wpUrl     = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const publicUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agribadiula.it';
    const res = await fetch(
      `${wpUrl}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 60, tags: ['wordpress'] } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const yoast = data[0]?.yoast_head_json;
    if (!yoast) return null;

    let canonical = yoast.canonical ?? '';
    if (wpUrl && canonical.startsWith(wpUrl)) {
      canonical = canonical.replace(wpUrl, publicUrl);
    }

    return {
      title:       yoast.title       ?? '',
      description: yoast.description ?? yoast.og_description ?? '',
      ogImage:     yoast.og_image?.[0]?.url ?? null,
      canonical,
    };
  } catch (err) {
    console.error(`[getPageSeo] slug=${slug}`, err);
    return null;
  }
}

// ─── Client REST (per pagine native WP + ACF free) ───────────────────────────

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL as string;

async function getPageAcfBySlug(slug: string): Promise<Record<string, unknown>> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60, tags: ['wordpress'] },
    });
    if (!res.ok) throw new Error(`WP REST ${res.status}`);
    const data = await res.json();
    return (data[0]?.acf as Record<string, unknown>) ?? {};
  } catch (err) {
    console.error(`[getPageAcfBySlug] slug=${slug}`, err);
    return {};
  }
}

// ─── Helper: valori di fallback ───────────────────────────────────────────────

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const url = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

// Mapper per GraphQL (camelCase — usato dai CPT)
function mapSezione(s: Record<string, unknown>): Sezione {
  return {
    titoloSezione: str(s.titoloSezione),
    testoSezione: str(s.testoSezione),
    immagineSinistra: Boolean(s.immagineSinistra),
    immagineSezione: url(s.immagineSezione),
  };
}

// Mapper per REST API (snake_case — usato dalle pagine native)
function mapSezioneRest(s: Record<string, unknown>): Sezione {
  return {
    titoloSezione: str(s.titolo_sezione),
    testoSezione: str(s.testo_sezione),
    immagineSinistra: Boolean(s.immagine_sinistra),
    immagineSezione: url(s.immagine_sezione),
  };
}

function mapFaq(f: Record<string, unknown>): Faq {
  return {
    domanda: str(f.domanda),
    risposta: str(f.risposta),
  };
}

function mapProductAcf(raw: Record<string, unknown>): ProductAcf {
  return {
    nome: str(raw.nome),
    descrizione: str(raw.descrizione),
    sottotitolo: str(raw.sottotitolo),
    corpo: str(raw.corpo),
    nomeEn: str(raw.nomeEn),
    descrizioneEn: str(raw.descrizioneEn),
    sottotitoloEn: str(raw.sottotitoloEn),
    corpoEn: str(raw.corpoEn),
    coloreSfondo: str(raw.coloreSfondo),
    immagine: url(raw.immagine),
    mesiRaccolta: arr<string>(raw.mesiRaccolta),
    sezioni: arr<Record<string, unknown>>(raw.sezioni).map(mapSezione),
    faq: arr<Record<string, unknown>>(raw.faq).map(mapFaq),
  };
}

// ─── 1. Prodotti (CPT — GraphQL) ──────────────────────────────────────────────

interface RawProductNode {
  id: string;
  slug: string;
  title: string;
  acf: Record<string, unknown>;
}

interface AllProductsData {
  prodotti: { nodes: RawProductNode[] };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchGraphQL<AllProductsData>(GET_ALL_PRODUCTS);
    return (data.prodotti?.nodes ?? []).map((n) => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      acf: mapProductAcf(n.acf ?? {}),
    }));
  } catch (err) {
    console.error('[getProducts]', err);
    return [];
  }
}

interface SingleProductData {
  prodotto: RawProductNode | null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await fetchGraphQL<SingleProductData>(GET_PRODUCT_BY_SLUG, { slug });
    const n = data.prodotto;
    if (!n) return null;
    return { id: n.id, slug: n.slug, title: n.title, acf: mapProductAcf(n.acf ?? {}) };
  } catch (err) {
    console.error(`[getProductBySlug] slug=${slug}`, err);
    return null;
  }
}

// ─── 2. Sezioni Azienda (CPT — GraphQL) ──────────────────────────────────────

interface RawSezioneNode {
  id: string;
  slug: string;
  title: string;
  acf: Record<string, unknown>;
}

interface AllSezioniData {
  sezioniAzienda: { nodes: RawSezioneNode[] };
}

export async function getSezioniAzienda(): Promise<SezioneAzienda[]> {
  try {
    const data = await fetchGraphQL<AllSezioniData>(GET_ALL_SEZIONI_AZIENDA);
    return (data.sezioniAzienda?.nodes ?? []).map((n) => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      acf: {
        eyebrow: str(n.acf.eyebrow),
        titolo: str(n.acf.titolo),
        corpo: str(n.acf.corpo),
        eyebrowEn: str(n.acf.eyebrowEn),
        titoloEn: str(n.acf.titoloEn),
        corpoEn: str(n.acf.corpoEn),
      },
    }));
  } catch (err) {
    console.error('[getSezioniAzienda]', err);
    return [];
  }
}

// ─── 3. Homepage (pagina slug: home — REST) ───────────────────────────────────

const HOMEPAGE_FALLBACK: HomepageData = {
  heroVideo: '/videos/hero.mp4',
  heroTitoloIt: '', heroTitoloEn: '',
  heroSottotitoloIt: '', heroSottotitoloEn: '',
  heroCtaIt: '', heroCtaEn: '',
  aboutP1: { eyebrowIt: '', eyebrowEn: '', headingIt: '', headingEn: '', bodyIt: '', bodyEn: '', ctaIt: '', ctaEn: '', immagine: null },
  aboutP2: { eyebrowIt: '', eyebrowEn: '', headingIt: '', headingEn: '', bodyIt: '', bodyEn: '', body2It: '', body2En: '' },
  aboutP3: { eyebrowIt: '', eyebrowEn: '', headingIt: '', headingEn: '', bodyIt: '', bodyEn: '' },
  produzioniEyebrowIt: '', produzioniEyebrowEn: '',
  produzioniTitoloIt: '', produzioniTitoloEn: '',
  produzioniSottotitoloIt: '', produzioniSottotitoloEn: '',
  luceTitoloIt: '', luceTitoloEn: '',
  luceSottotitoloIt: '', luceSottotitoloEn: '',
  luceBodyIt: '', luceBodyEn: '',
  luceImmagine: null,
  shopBannerTitoloIt: '', shopBannerTitoloEn: '',
  shopBannerSottotitoloIt: '', shopBannerSottotitoloEn: '',
  shopBannerImmagine: null,
};

export async function getHomepage(): Promise<HomepageData> {
  try {
    const r = await getPageAcfBySlug('home');
    return {
      heroVideo: str(r.hero_video) || '/videos/hero.mp4',
      heroTitoloIt: str(r.hero_titolo_it),
      heroTitoloEn: str(r.hero_titolo_en),
      heroSottotitoloIt: str(r.hero_sottotitolo_it),
      heroSottotitoloEn: str(r.hero_sottotitolo_en),
      heroCtaIt: str(r.hero_cta_it),
      heroCtaEn: str(r.hero_cta_en),
      aboutP1: {
        eyebrowIt: str(r.about_p1_eyebrow_it),
        eyebrowEn: str(r.about_p1_eyebrow_en),
        headingIt: str(r.about_p1_heading_it),
        headingEn: str(r.about_p1_heading_en),
        bodyIt: str(r.about_p1_body_it),
        bodyEn: str(r.about_p1_body_en),
        ctaIt: str(r.about_p1_cta_it),
        ctaEn: str(r.about_p1_cta_en),
        immagine: url(r.about_p1_immagine),
      },
      aboutP2: {
        eyebrowIt: str(r.about_p2_eyebrow_it),
        eyebrowEn: str(r.about_p2_eyebrow_en),
        headingIt: str(r.about_p2_heading_it),
        headingEn: str(r.about_p2_heading_en),
        bodyIt: str(r.about_p2_body_it),
        bodyEn: str(r.about_p2_body_en),
        body2It: str(r.about_p2_body2_it),
        body2En: str(r.about_p2_body2_en),
      },
      aboutP3: {
        eyebrowIt: str(r.about_p3_eyebrow_it),
        eyebrowEn: str(r.about_p3_eyebrow_en),
        headingIt: str(r.about_p3_heading_it),
        headingEn: str(r.about_p3_heading_en),
        bodyIt: str(r.about_p3_body_it),
        bodyEn: str(r.about_p3_body_en),
      },
      produzioniEyebrowIt: str(r.produzioni_eyebrow_it),
      produzioniEyebrowEn: str(r.produzioni_eyebrow_en),
      produzioniTitoloIt: str(r.produzioni_titolo_it),
      produzioniTitoloEn: str(r.produzioni_titolo_en),
      produzioniSottotitoloIt: str(r.produzioni_sottotitolo_it),
      produzioniSottotitoloEn: str(r.produzioni_sottotitolo_en),
      luceTitoloIt: str(r.luce_titolo_it),
      luceTitoloEn: str(r.luce_titolo_en),
      luceSottotitoloIt: str(r.luce_sottotitolo_it),
      luceSottotitoloEn: str(r.luce_sottotitolo_en),
      luceBodyIt: str(r.luce_body_it),
      luceBodyEn: str(r.luce_body_en),
      luceImmagine: url(r.luce_immagine),
      shopBannerTitoloIt: str(r.shop_banner_titolo_it),
      shopBannerTitoloEn: str(r.shop_banner_titolo_en),
      shopBannerSottotitoloIt: str(r.shop_banner_sottotitolo_it),
      shopBannerSottotitoloEn: str(r.shop_banner_sottotitolo_en),
      shopBannerImmagine: url(r.shop_banner_immagine),
    };
  } catch (err) {
    console.error('[getHomepage]', err);
    return HOMEPAGE_FALLBACK;
  }
}

// ─── 4. Opzioni Globali (pagina slug: opzioni-globali — REST) ─────────────────

const GLOBAL_OPTIONS_FALLBACK: GlobalOptions = {
  telefono: '', email: '', whatsapp: '', indirizzo: '', pIva: '',
  instagram: '', facebook: '', linkedin: '',
  footerQuoteIt: '', footerQuoteEn: '',
  footerFormTitleIt: '', footerFormTitleEn: '',
  ogImage: null,
};

export async function getGlobalOptions(): Promise<GlobalOptions> {
  try {
    const r = await getPageAcfBySlug('opzioni-globali');
    return {
      telefono: str(r.telefono),
      email: str(r.email),
      whatsapp: str(r.whatsapp),
      indirizzo: str(r.indirizzo),
      pIva: str(r.p_iva),
      instagram: str(r.instagram),
      facebook: str(r.facebook),
      linkedin: str(r.linkedin),
      footerQuoteIt: str(r.footer_quote_it),
      footerQuoteEn: str(r.footer_quote_en),
      footerFormTitleIt: str(r.footer_form_title_it),
      footerFormTitleEn: str(r.footer_form_title_en),
      ogImage: url(r.og_image),
    };
  } catch (err) {
    console.error('[getGlobalOptions]', err);
    return GLOBAL_OPTIONS_FALLBACK;
  }
}

// ─── 5. Pagina Azienda (pagina slug: azienda — REST) ─────────────────────────

const PAGINA_AZIENDA_FALLBACK: PaginaAzienda = {
  heroLabelIt: '', heroTitoloIt: '', heroBodyIt: '', videoUrl: '',
  filosofiaBodyIt: '', filosofiaImmagine: null, quoteIt: '',
  culturaTitoloIt: '', culturaBodyIt: '', culturaImmagine: null, manifestoIt: '',
  visionLabelIt: '', visionBodyIt: '', missionLabelIt: '', missionBodyIt: '',
  territorioTitoloIt: '', territorioBodyIt: '', territorioImmagine: null,
  heroLabelEn: '', heroTitoloEn: '', heroBodyEn: '',
  filosofiaBodyEn: '', quoteEn: '',
  culturaTitoloEn: '', culturaBodyEn: '', manifestoEn: '',
  visionLabelEn: '', visionBodyEn: '', missionLabelEn: '', missionBodyEn: '',
  territorioTitoloEn: '', territorioBodyEn: '',
};

export async function getPaginaAzienda(): Promise<PaginaAzienda> {
  try {
    const r = await getPageAcfBySlug('azienda');
    return {
      heroLabelIt: str(r.hero_label_it),
      heroTitoloIt: str(r.hero_titolo_it),
      heroBodyIt: str(r.hero_body_it),
      videoUrl: str(r.video_url),
      filosofiaBodyIt: str(r.filosofia_body_it),
      filosofiaImmagine: url(r.filosofia_immagine),
      quoteIt: str(r.quote_it),
      culturaTitoloIt: str(r.cultura_titolo_it),
      culturaBodyIt: str(r.cultura_body_it),
      culturaImmagine: url(r.cultura_immagine),
      manifestoIt: str(r.manifesto_it),
      visionLabelIt: str(r.vision_label_it),
      visionBodyIt: str(r.vision_body_it),
      missionLabelIt: str(r.mission_label_it),
      missionBodyIt: str(r.mission_body_it),
      territorioTitoloIt: str(r.territorio_titolo_it),
      territorioBodyIt: str(r.territorio_body_it),
      territorioImmagine: url(r.territorio_immagine),
      heroLabelEn: str(r.hero_label_en),
      heroTitoloEn: str(r.hero_titolo_en),
      heroBodyEn: str(r.hero_body_en),
      filosofiaBodyEn: str(r.filosofia_body_en),
      quoteEn: str(r.quote_en),
      culturaTitoloEn: str(r.cultura_titolo_en),
      culturaBodyEn: str(r.cultura_body_en),
      manifestoEn: str(r.manifesto_en),
      visionLabelEn: str(r.vision_label_en),
      visionBodyEn: str(r.vision_body_en),
      missionLabelEn: str(r.mission_label_en),
      missionBodyEn: str(r.mission_body_en),
      territorioTitoloEn: str(r.territorio_titolo_en),
      territorioBodyEn: str(r.territorio_body_en),
    };
  } catch (err) {
    console.error('[getPaginaAzienda]', err);
    return PAGINA_AZIENDA_FALLBACK;
  }
}

// ─── 6. Pagina Coltivazioni (pagina slug: coltivazioni — REST) ────────────────

const PAGINA_COLTIVAZIONI_FALLBACK: PaginaColtivazioni = {
  titoloIt: '', titoloEn: '', sottotitoloIt: '', sottotitoloEn: '',
  introP1It: '', introP1En: '', introP2It: '', introP2En: '',
  gridTitoloIt: '', calendarioTitoloIt: '',
  bannerHeadingIt: '', bannerHeadingEn: '', bannerSubIt: '', bannerSubEn: '',
};

export async function getPaginaColtivazioni(): Promise<PaginaColtivazioni> {
  try {
    const r = await getPageAcfBySlug('coltivazioni');
    return {
      titoloIt: str(r.titolo_it),
      titoloEn: str(r.titolo_en),
      sottotitoloIt: str(r.sottotitolo_it),
      sottotitoloEn: str(r.sottotitolo_en),
      introP1It: str(r.intro_p1_it),
      introP1En: str(r.intro_p1_en),
      introP2It: str(r.intro_p2_it),
      introP2En: str(r.intro_p2_en),
      gridTitoloIt: str(r.grid_titolo_it),
      calendarioTitoloIt: str(r.calendario_titolo_it),
      bannerHeadingIt: str(r.banner_heading_it),
      bannerHeadingEn: str(r.banner_heading_en),
      bannerSubIt: str(r.banner_sub_it),
      bannerSubEn: str(r.banner_sub_en),
    };
  } catch (err) {
    console.error('[getPaginaColtivazioni]', err);
    return PAGINA_COLTIVAZIONI_FALLBACK;
  }
}

// ─── 7. Pagina Luce di Terra (pagina slug: luce-di-terra — REST) ──────────────

const PAGINA_LUCE_FALLBACK: PaginaLuceDiTerra = {
  titoloIt: '', sottotitoloIt: '', introP1It: '', introP2It: '', lineeTitoloIt: '',
  olioTitoloIt: '', olioDescIt: '', olioPrezzo: '', olioImmagine: null,
  marmellaTitoloIt: '', marmellaDescIt: '', marmellaPrezzo: '', marmellaImmagine: null,
  filieraTitoloIt: '', filieraBodyIt: '',
  titoloEn: '', sottotitoloEn: '', introP1En: '', introP2En: '',
  olioTitoloEn: '', olioDescEn: '', marmellaTitoloEn: '', marmellaDescEn: '',
  filieraTitoloEn: '', filieraBodyEn: '',
};

export async function getPaginaLuceDiTerra(): Promise<PaginaLuceDiTerra> {
  try {
    const r = await getPageAcfBySlug('luce-di-terra');
    return {
      titoloIt: str(r.titolo_it),
      sottotitoloIt: str(r.sottotitolo_it),
      introP1It: str(r.intro_p1_it),
      introP2It: str(r.intro_p2_it),
      lineeTitoloIt: str(r.linee_titolo_it),
      olioTitoloIt: str(r.olio_titolo_it),
      olioDescIt: str(r.olio_desc_it),
      olioPrezzo: str(r.olio_prezzo),
      olioImmagine: url(r.olio_immagine),
      marmellaTitoloIt: str(r.marmellata_titolo_it),
      marmellaDescIt: str(r.marmellata_desc_it),
      marmellaPrezzo: str(r.marmellata_prezzo),
      marmellaImmagine: url(r.marmellata_immagine),
      filieraTitoloIt: str(r.filiera_titolo_it),
      filieraBodyIt: str(r.filiera_body_it),
      titoloEn: str(r.titolo_en),
      sottotitoloEn: str(r.sottotitolo_en),
      introP1En: str(r.intro_p1_en),
      introP2En: str(r.intro_p2_en),
      olioTitoloEn: str(r.olio_titolo_en),
      olioDescEn: str(r.olio_desc_en),
      marmellaTitoloEn: str(r.marmellata_titolo_en),
      marmellaDescEn: str(r.marmellata_desc_en),
      filieraTitoloEn: str(r.filiera_titolo_en),
      filieraBodyEn: str(r.filiera_body_en),
    };
  } catch (err) {
    console.error('[getPaginaLuceDiTerra]', err);
    return PAGINA_LUCE_FALLBACK;
  }
}

// ─── 8. Pagina Olio EVO (pagina slug: olio-evo — REST) ───────────────────────

const PAGINA_OLIO_FALLBACK: PaginaOlioEvo = {
  titoloIt: '', sottotitoloIt: '', introIt: '', immaginePrincipale: null,
  profiloProfumoIt: '', profiloSaporeIt: '', profiloRaccoltaIt: '',
  sezioni: [], faq: [],
  titoloEn: '', sottotitoloEn: '', introEn: '',
  profiloProfumoEn: '', profiloSaporeEn: '', profiloRaccoltaEn: '',
};

export async function getPaginaOlioEvo(): Promise<PaginaOlioEvo> {
  try {
    const r = await getPageAcfBySlug('olio-evo');
    return {
      titoloIt: str(r.titolo_it),
      sottotitoloIt: str(r.sottotitolo_it),
      introIt: str(r.intro_it),
      immaginePrincipale: url(r.immagine_principale),
      profiloProfumoIt: str(r.profilo_profumo_it),
      profiloSaporeIt: str(r.profilo_sapore_it),
      profiloRaccoltaIt: str(r.profilo_raccolta_it),
      sezioni: arr<Record<string, unknown>>(r.sezioni).map(mapSezioneRest),
      faq: arr<Record<string, unknown>>(r.faq).map(mapFaq),
      titoloEn: str(r.titolo_en),
      sottotitoloEn: str(r.sottotitolo_en),
      introEn: str(r.intro_en),
      profiloProfumoEn: str(r.profilo_profumo_en),
      profiloSaporeEn: str(r.profilo_sapore_en),
      profiloRaccoltaEn: str(r.profilo_raccolta_en),
    };
  } catch (err) {
    console.error('[getPaginaOlioEvo]', err);
    return PAGINA_OLIO_FALLBACK;
  }
}

// ─── 9. Pagina Marmellate (pagina slug: marmellata-agrumi — REST) ─────────────

const PAGINA_MARMELLATE_FALLBACK: PaginaMarmellate = {
  titoloIt: '', sottotitoloIt: '', introIt: '',
  varieta: [], sezioni: [], faq: [],
  titoloEn: '', sottotitoloEn: '', introEn: '',
};

export async function getPaginaMarmellate(): Promise<PaginaMarmellate> {
  try {
    const r = await getPageAcfBySlug('marmellata-agrumi');
    return {
      titoloIt: str(r.titolo_it),
      sottotitoloIt: str(r.sottotitolo_it),
      introIt: str(r.intro_it),
      varieta: arr<Record<string, unknown>>(r.varieta).map((v): VarietaMarmellata => ({
        nomeIt: str(v.nome_it),
        nomeEn: str(v.nome_en),
        descIt: str(v.desc_it),
        descEn: str(v.desc_en),
        immagine: url(v.immagine),
      })),
      sezioni: arr<Record<string, unknown>>(r.sezioni).map(mapSezioneRest),
      faq: arr<Record<string, unknown>>(r.faq).map(mapFaq),
      titoloEn: str(r.titolo_en),
      sottotitoloEn: str(r.sottotitolo_en),
      introEn: str(r.intro_en),
    };
  } catch (err) {
    console.error('[getPaginaMarmellate]', err);
    return PAGINA_MARMELLATE_FALLBACK;
  }
}

// ─── 10. Pagina Shop (pagina slug: shop — REST) ───────────────────────────────

const PAGINA_SHOP_FALLBACK: PaginaShop = {
  heroTitoloIt: '', heroSottotitoloIt: '', heroImmagine: null,
  heroTitoloEn: '', heroSottotitoloEn: '',
};

export async function getPaginaShop(): Promise<PaginaShop> {
  try {
    const r = await getPageAcfBySlug('shop');
    return {
      heroTitoloIt: str(r.hero_titolo_it),
      heroSottotitoloIt: str(r.hero_sottotitolo_it),
      heroImmagine: url(r.hero_immagine),
      heroTitoloEn: str(r.hero_titolo_en),
      heroSottotitoloEn: str(r.hero_sottotitolo_en),
    };
  } catch (err) {
    console.error('[getPaginaShop]', err);
    return PAGINA_SHOP_FALLBACK;
  }
}
