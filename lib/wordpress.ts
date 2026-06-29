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
} from './types';

import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_BY_SLUG,
  GET_ALL_SEZIONI_AZIENDA,
  GET_HOMEPAGE,
  GET_GLOBAL_OPTIONS,
  GET_PAGINA_AZIENDA,
  GET_PAGINA_COLTIVAZIONI,
  GET_PAGINA_LUCE_DI_TERRA,
  GET_PAGINA_OLIO_EVO,
  GET_PAGINA_MARMELLATE,
  GET_PAGINA_SHOP,
} from './queries';

// ─── Client GraphQL ───────────────────────────────────────────────────────────

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL as string;
const REVALIDATE = 3600;

interface GQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = REVALIDATE,
): Promise<T> {
  const res = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
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

// ─── Helper: valori di fallback ───────────────────────────────────────────────

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const url = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function mapSezione(s: Record<string, unknown>): Sezione {
  return {
    titoloSezione: str(s.titoloSezione),
    testoSezione: str(s.testoSezione),
    immagineSinistra: Boolean(s.immagineSinistra),
    immagineSezione: url(s.immagineSezione),
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

// ─── 1. Prodotti ──────────────────────────────────────────────────────────────

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

// ─── 2. Sezioni Azienda ───────────────────────────────────────────────────────

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

// ─── 3. Homepage ──────────────────────────────────────────────────────────────

interface HomepageRaw {
  sezioniHomepage: Record<string, unknown>;
}

const HOMEPAGE_FALLBACK: HomepageData = {
  heroVideo: '/videos/hero.mp4',
  heroTitoloIt: '',
  heroTitoloEn: '',
  heroSottotitoloIt: '',
  heroSottotitoloEn: '',
  heroCtaIt: '',
  heroCtaEn: '',
  aboutP1: { eyebrowIt: '', eyebrowEn: '', headingIt: '', headingEn: '', bodyIt: '', bodyEn: '', ctaIt: '', ctaEn: '', immagine: null },
  aboutP2: { eyebrowIt: '', eyebrowEn: '', headingIt: '', headingEn: '', bodyIt: '', bodyEn: '', body2It: '', body2En: '' },
  aboutP3: { eyebrowIt: '', eyebrowEn: '', headingIt: '', headingEn: '', bodyIt: '', bodyEn: '' },
  produzioniEyebrowIt: '',
  produzioniEyebrowEn: '',
  produzioniTitoloIt: '',
  produzioniTitoloEn: '',
  produzioniSottotitoloIt: '',
  produzioniSottotitoloEn: '',
  luceTitoloIt: '',
  luceTitoloEn: '',
  luceSottotitoloIt: '',
  luceSottotitoloEn: '',
  luceBodyIt: '',
  luceBodyEn: '',
  luceImmagine: null,
  shopBannerTitoloIt: '',
  shopBannerTitoloEn: '',
  shopBannerSottotitoloIt: '',
  shopBannerSottotitoloEn: '',
  shopBannerImmagine: null,
};

export async function getHomepage(): Promise<HomepageData> {
  try {
    const data = await fetchGraphQL<HomepageRaw>(GET_HOMEPAGE);
    const r = data.sezioniHomepage ?? {};
    return {
      heroVideo: str(r.heroVideo) || '/videos/hero.mp4',
      heroTitoloIt: str(r.heroTitoloIt),
      heroTitoloEn: str(r.heroTitoloEn),
      heroSottotitoloIt: str(r.heroSottotitoloIt),
      heroSottotitoloEn: str(r.heroSottotitoloEn),
      heroCtaIt: str(r.heroCtaIt),
      heroCtaEn: str(r.heroCtaEn),
      aboutP1: {
        eyebrowIt: str(r.aboutP1EyebrowIt),
        eyebrowEn: str(r.aboutP1EyebrowEn),
        headingIt: str(r.aboutP1HeadingIt),
        headingEn: str(r.aboutP1HeadingEn),
        bodyIt: str(r.aboutP1BodyIt),
        bodyEn: str(r.aboutP1BodyEn),
        ctaIt: str(r.aboutP1CtaIt),
        ctaEn: str(r.aboutP1CtaEn),
        immagine: url(r.aboutP1Immagine),
      },
      aboutP2: {
        eyebrowIt: str(r.aboutP2EyebrowIt),
        eyebrowEn: str(r.aboutP2EyebrowEn),
        headingIt: str(r.aboutP2HeadingIt),
        headingEn: str(r.aboutP2HeadingEn),
        bodyIt: str(r.aboutP2BodyIt),
        bodyEn: str(r.aboutP2BodyEn),
        body2It: str(r.aboutP2Body2It),
        body2En: str(r.aboutP2Body2En),
      },
      aboutP3: {
        eyebrowIt: str(r.aboutP3EyebrowIt),
        eyebrowEn: str(r.aboutP3EyebrowEn),
        headingIt: str(r.aboutP3HeadingIt),
        headingEn: str(r.aboutP3HeadingEn),
        bodyIt: str(r.aboutP3BodyIt),
        bodyEn: str(r.aboutP3BodyEn),
      },
      produzioniEyebrowIt: str(r.produzioniEyebrowIt),
      produzioniEyebrowEn: str(r.produzioniEyebrowEn),
      produzioniTitoloIt: str(r.produzioniTitoloIt),
      produzioniTitoloEn: str(r.produzioniTitoloEn),
      produzioniSottotitoloIt: str(r.produzioniSottotitoloIt),
      produzioniSottotitoloEn: str(r.produzioniSottotitoloEn),
      luceTitoloIt: str(r.luceTitoloIt),
      luceTitoloEn: str(r.luceTitoloEn),
      luceSottotitoloIt: str(r.luceSottotitoloIt),
      luceSottotitoloEn: str(r.luceSottotitoloEn),
      luceBodyIt: str(r.luceBodyIt),
      luceBodyEn: str(r.luceBodyEn),
      luceImmagine: url(r.luceImmagine),
      shopBannerTitoloIt: str(r.shopBannerTitoloIt),
      shopBannerTitoloEn: str(r.shopBannerTitoloEn),
      shopBannerSottotitoloIt: str(r.shopBannerSottotitoloIt),
      shopBannerSottotitoloEn: str(r.shopBannerSottotitoloEn),
      shopBannerImmagine: url(r.shopBannerImmagine),
    };
  } catch (err) {
    console.error('[getHomepage]', err);
    return HOMEPAGE_FALLBACK;
  }
}

// ─── 4. Opzioni Globali ───────────────────────────────────────────────────────

interface GlobalOptionsRaw {
  opzioniGlobali: Record<string, unknown>;
}

const GLOBAL_OPTIONS_FALLBACK: GlobalOptions = {
  telefono: '', email: '', whatsapp: '', indirizzo: '', pIva: '',
  instagram: '', facebook: '', linkedin: '',
  footerQuoteIt: '', footerQuoteEn: '',
  footerFormTitleIt: '', footerFormTitleEn: '',
  ogImage: null,
};

export async function getGlobalOptions(): Promise<GlobalOptions> {
  try {
    const data = await fetchGraphQL<GlobalOptionsRaw>(GET_GLOBAL_OPTIONS);
    const r = data.opzioniGlobali ?? {};
    return {
      telefono: str(r.telefono),
      email: str(r.email),
      whatsapp: str(r.whatsapp),
      indirizzo: str(r.indirizzo),
      pIva: str(r.pIva),
      instagram: str(r.instagram),
      facebook: str(r.facebook),
      linkedin: str(r.linkedin),
      footerQuoteIt: str(r.footerQuoteIt),
      footerQuoteEn: str(r.footerQuoteEn),
      footerFormTitleIt: str(r.footerFormTitleIt),
      footerFormTitleEn: str(r.footerFormTitleEn),
      ogImage: url(r.ogImage),
    };
  } catch (err) {
    console.error('[getGlobalOptions]', err);
    return GLOBAL_OPTIONS_FALLBACK;
  }
}

// ─── 5. Pagina Azienda ────────────────────────────────────────────────────────

interface PaginaAziendaRaw {
  paginaAzienda: Record<string, unknown>;
}

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
    const data = await fetchGraphQL<PaginaAziendaRaw>(GET_PAGINA_AZIENDA);
    const r = data.paginaAzienda ?? {};
    return {
      heroLabelIt: str(r.heroLabelIt),
      heroTitoloIt: str(r.heroTitoloIt),
      heroBodyIt: str(r.heroBodyIt),
      videoUrl: str(r.videoUrl),
      filosofiaBodyIt: str(r.filosofiaBodyIt),
      filosofiaImmagine: url(r.filosofiaImmagine),
      quoteIt: str(r.quoteIt),
      culturaTitoloIt: str(r.culturaTitoloIt),
      culturaBodyIt: str(r.culturaBodyIt),
      culturaImmagine: url(r.culturaImmagine),
      manifestoIt: str(r.manifestoIt),
      visionLabelIt: str(r.visionLabelIt),
      visionBodyIt: str(r.visionBodyIt),
      missionLabelIt: str(r.missionLabelIt),
      missionBodyIt: str(r.missionBodyIt),
      territorioTitoloIt: str(r.territorioTitoloIt),
      territorioBodyIt: str(r.territorioBodyIt),
      territorioImmagine: url(r.territorioImmagine),
      heroLabelEn: str(r.heroLabelEn),
      heroTitoloEn: str(r.heroTitoloEn),
      heroBodyEn: str(r.heroBodyEn),
      filosofiaBodyEn: str(r.filosofiaBodyEn),
      quoteEn: str(r.quoteEn),
      culturaTitoloEn: str(r.culturaTitoloEn),
      culturaBodyEn: str(r.culturaBodyEn),
      manifestoEn: str(r.manifestoEn),
      visionLabelEn: str(r.visionLabelEn),
      visionBodyEn: str(r.visionBodyEn),
      missionLabelEn: str(r.missionLabelEn),
      missionBodyEn: str(r.missionBodyEn),
      territorioTitoloEn: str(r.territorioTitoloEn),
      territorioBodyEn: str(r.territorioBodyEn),
    };
  } catch (err) {
    console.error('[getPaginaAzienda]', err);
    return PAGINA_AZIENDA_FALLBACK;
  }
}

// ─── 6. Pagina Coltivazioni ───────────────────────────────────────────────────

interface PaginaColtivazioniRaw {
  paginaColtivazioni: Record<string, unknown>;
}

const PAGINA_COLTIVAZIONI_FALLBACK: PaginaColtivazioni = {
  titoloIt: '', titoloEn: '', sottotitoloIt: '', sottotitoloEn: '',
  introP1It: '', introP1En: '', introP2It: '', introP2En: '',
  gridTitoloIt: '', calendarioTitoloIt: '',
  bannerHeadingIt: '', bannerHeadingEn: '', bannerSubIt: '', bannerSubEn: '',
};

export async function getPaginaColtivazioni(): Promise<PaginaColtivazioni> {
  try {
    const data = await fetchGraphQL<PaginaColtivazioniRaw>(GET_PAGINA_COLTIVAZIONI);
    const r = data.paginaColtivazioni ?? {};
    return {
      titoloIt: str(r.titoloIt),
      titoloEn: str(r.titoloEn),
      sottotitoloIt: str(r.sottotitoloIt),
      sottotitoloEn: str(r.sottotitoloEn),
      introP1It: str(r.introP1It),
      introP1En: str(r.introP1En),
      introP2It: str(r.introP2It),
      introP2En: str(r.introP2En),
      gridTitoloIt: str(r.gridTitoloIt),
      calendarioTitoloIt: str(r.calendarioTitoloIt),
      bannerHeadingIt: str(r.bannerHeadingIt),
      bannerHeadingEn: str(r.bannerHeadingEn),
      bannerSubIt: str(r.bannerSubIt),
      bannerSubEn: str(r.bannerSubEn),
    };
  } catch (err) {
    console.error('[getPaginaColtivazioni]', err);
    return PAGINA_COLTIVAZIONI_FALLBACK;
  }
}

// ─── 7. Pagina Luce di Terra ──────────────────────────────────────────────────

interface PaginaLuceDiTerraRaw {
  paginaLuceDiTerra: Record<string, unknown>;
}

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
    const data = await fetchGraphQL<PaginaLuceDiTerraRaw>(GET_PAGINA_LUCE_DI_TERRA);
    const r = data.paginaLuceDiTerra ?? {};
    return {
      titoloIt: str(r.titoloIt),
      sottotitoloIt: str(r.sottotitoloIt),
      introP1It: str(r.introP1It),
      introP2It: str(r.introP2It),
      lineeTitoloIt: str(r.lineeTitoloIt),
      olioTitoloIt: str(r.olioTitoloIt),
      olioDescIt: str(r.olioDescIt),
      olioPrezzo: str(r.olioPrezzo),
      olioImmagine: url(r.olioImmagine),
      marmellaTitoloIt: str(r.marmellaTitoloIt),
      marmellaDescIt: str(r.marmellaDescIt),
      marmellaPrezzo: str(r.marmellaPrezzo),
      marmellaImmagine: url(r.marmellaImmagine),
      filieraTitoloIt: str(r.filieraTitoloIt),
      filieraBodyIt: str(r.filieraBodyIt),
      titoloEn: str(r.titoloEn),
      sottotitoloEn: str(r.sottotitoloEn),
      introP1En: str(r.introP1En),
      introP2En: str(r.introP2En),
      olioTitoloEn: str(r.olioTitoloEn),
      olioDescEn: str(r.olioDescEn),
      marmellaTitoloEn: str(r.marmellaTitoloEn),
      marmellaDescEn: str(r.marmellaDescEn),
      filieraTitoloEn: str(r.filieraTitoloEn),
      filieraBodyEn: str(r.filieraBodyEn),
    };
  } catch (err) {
    console.error('[getPaginaLuceDiTerra]', err);
    return PAGINA_LUCE_FALLBACK;
  }
}

// ─── 8. Pagina Olio EVO ───────────────────────────────────────────────────────

interface PaginaOlioEvoRaw {
  paginaOlioEvo: Record<string, unknown>;
}

const PAGINA_OLIO_FALLBACK: PaginaOlioEvo = {
  titoloIt: '', sottotitoloIt: '', introIt: '', immaginePrincipale: null,
  profiloProfumoIt: '', profiloSaporeIt: '', profiloRaccoltaIt: '',
  sezioni: [], faq: [],
  titoloEn: '', sottotitoloEn: '', introEn: '',
  profiloProfumoEn: '', profiloSaporeEn: '', profiloRaccoltaEn: '',
};

export async function getPaginaOlioEvo(): Promise<PaginaOlioEvo> {
  try {
    const data = await fetchGraphQL<PaginaOlioEvoRaw>(GET_PAGINA_OLIO_EVO);
    const r = data.paginaOlioEvo ?? {};
    return {
      titoloIt: str(r.titoloIt),
      sottotitoloIt: str(r.sottotitoloIt),
      introIt: str(r.introIt),
      immaginePrincipale: url(r.immaginePrincipale),
      profiloProfumoIt: str(r.profiloProfumoIt),
      profiloSaporeIt: str(r.profiloSaporeIt),
      profiloRaccoltaIt: str(r.profiloRaccoltaIt),
      sezioni: arr<Record<string, unknown>>(r.sezioni).map(mapSezione),
      faq: arr<Record<string, unknown>>(r.faq).map(mapFaq),
      titoloEn: str(r.titoloEn),
      sottotitoloEn: str(r.sottotitoloEn),
      introEn: str(r.introEn),
      profiloProfumoEn: str(r.profiloProfumoEn),
      profiloSaporeEn: str(r.profiloSaporeEn),
      profiloRaccoltaEn: str(r.profiloRaccoltaEn),
    };
  } catch (err) {
    console.error('[getPaginaOlioEvo]', err);
    return PAGINA_OLIO_FALLBACK;
  }
}

// ─── 9. Pagina Marmellate ─────────────────────────────────────────────────────

interface PaginaMarmellateRaw {
  paginaMarmellate: Record<string, unknown>;
}

const PAGINA_MARMELLATE_FALLBACK: PaginaMarmellate = {
  titoloIt: '', sottotitoloIt: '', introIt: '',
  varieta: [], sezioni: [], faq: [],
  titoloEn: '', sottotitoloEn: '', introEn: '',
};

export async function getPaginaMarmellate(): Promise<PaginaMarmellate> {
  try {
    const data = await fetchGraphQL<PaginaMarmellateRaw>(GET_PAGINA_MARMELLATE);
    const r = data.paginaMarmellate ?? {};
    return {
      titoloIt: str(r.titoloIt),
      sottotitoloIt: str(r.sottotitoloIt),
      introIt: str(r.introIt),
      varieta: arr<Record<string, unknown>>(r.varieta).map((v) => ({
        nomeIt: str(v.nomeIt),
        nomeEn: str(v.nomeEn),
        descIt: str(v.descIt),
        descEn: str(v.descEn),
        immagine: url(v.immagine),
      })),
      sezioni: arr<Record<string, unknown>>(r.sezioni).map(mapSezione),
      faq: arr<Record<string, unknown>>(r.faq).map(mapFaq),
      titoloEn: str(r.titoloEn),
      sottotitoloEn: str(r.sottotitoloEn),
      introEn: str(r.introEn),
    };
  } catch (err) {
    console.error('[getPaginaMarmellate]', err);
    return PAGINA_MARMELLATE_FALLBACK;
  }
}

// ─── 10. Pagina Shop ──────────────────────────────────────────────────────────

interface PaginaShopRaw {
  paginaShop: Record<string, unknown>;
}

const PAGINA_SHOP_FALLBACK: PaginaShop = {
  heroTitoloIt: '', heroSottotitoloIt: '', heroImmagine: null,
  heroTitoloEn: '', heroSottotitoloEn: '',
};

export async function getPaginaShop(): Promise<PaginaShop> {
  try {
    const data = await fetchGraphQL<PaginaShopRaw>(GET_PAGINA_SHOP);
    const r = data.paginaShop ?? {};
    return {
      heroTitoloIt: str(r.heroTitoloIt),
      heroSottotitoloIt: str(r.heroSottotitoloIt),
      heroImmagine: url(r.heroImmagine),
      heroTitoloEn: str(r.heroTitoloEn),
      heroSottotitoloEn: str(r.heroSottotitoloEn),
    };
  } catch (err) {
    console.error('[getPaginaShop]', err);
    return PAGINA_SHOP_FALLBACK;
  }
}
