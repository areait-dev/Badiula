// ─── Tipi primitivi condivisi ─────────────────────────────────────────────────

export interface WPImage {
  sourceUrl: string;
  altText?: string;
}

// ─── Sezione alternante (usata in prodotto, olio evo, marmellate) ─────────────

export interface Sezione {
  titoloSezione: string;
  testoSezione: string;
  immagineSinistra: boolean;
  immagineSezione: string | null; // url
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface Faq {
  domanda: string;
  risposta: string;
}

// ─── Prodotto (CPT prodotto) ──────────────────────────────────────────────────

export interface ProductAcf {
  // IT
  nome: string;
  descrizione: string;
  sottotitolo: string;
  corpo: string;
  // EN
  nomeEn: string;
  descrizioneEn: string;
  sottotitoloEn: string;
  corpoEn: string;
  // Comune
  coloreSfondo: string;
  immagine: string | null; // url
  mesiRaccolta: string[]; // ["1","3","12"]
  sezioni: Sezione[];
  faq: Faq[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  acf: ProductAcf;
}

// ─── Sezione Azienda (CPT sezione_azienda) ────────────────────────────────────

export interface SezioneAziendaAcf {
  eyebrow: string;
  titolo: string;
  corpo: string;
  eyebrowEn: string;
  titoloEn: string;
  corpoEn: string;
}

export interface SezioneAzienda {
  id: string;
  slug: string;
  title: string;
  acf: SezioneAziendaAcf;
}

// ─── Homepage (options page: badiula-sezioni-homepage) ────────────────────────

export interface HomepageAboutPanel {
  eyebrowIt: string;
  eyebrowEn: string;
  headingIt: string;
  headingEn: string;
  bodyIt: string;
  bodyEn: string;
  ctaIt?: string;
  ctaEn?: string;
  immagine?: string | null;
  body2It?: string;
  body2En?: string;
}

export interface HomepageData {
  // Hero
  heroVideo: string;
  heroTitoloIt: string;
  heroTitoloEn: string;
  heroSottotitoloIt: string;
  heroSottotitoloEn: string;
  heroCtaIt: string;
  heroCtaEn: string;
  // About panels
  aboutP1: HomepageAboutPanel;
  aboutP2: HomepageAboutPanel;
  aboutP3: HomepageAboutPanel;
  // Produzioni
  produzioniEyebrowIt: string;
  produzioniEyebrowEn: string;
  produzioniTitoloIt: string;
  produzioniTitoloEn: string;
  produzioniSottotitoloIt: string;
  produzioniSottotitoloEn: string;
  // Luce di Terra
  luceTitoloIt: string;
  luceTitoloEn: string;
  luceSottotitoloIt: string;
  luceSottotitoloEn: string;
  luceBodyIt: string;
  luceBodyEn: string;
  luceImmagine: string | null;
  // Shop banner
  shopBannerTitoloIt: string;
  shopBannerTitoloEn: string;
  shopBannerSottotitoloIt: string;
  shopBannerSottotitoloEn: string;
  shopBannerImmagine: string | null;
}

// ─── Opzioni Globali (options page: badiula-options) ─────────────────────────

export interface GlobalOptions {
  telefono: string;
  email: string;
  whatsapp: string;
  indirizzo: string;
  pIva: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  footerQuoteIt: string;
  footerQuoteEn: string;
  footerFormTitleIt: string;
  footerFormTitleEn: string;
  ogImage: string | null;
}

// ─── Pagina Azienda (options page: badiula-azienda) ──────────────────────────

export interface PaginaAzienda {
  // IT
  heroLabelIt: string;
  heroTitoloIt: string;
  heroBodyIt: string;
  videoUrl: string;
  filosofiaBodyIt: string;
  filosofiaImmagine: string | null;
  quoteIt: string;
  culturaTitoloIt: string;
  culturaBodyIt: string;
  culturaImmagine: string | null;
  manifestoIt: string;
  visionLabelIt: string;
  visionBodyIt: string;
  missionLabelIt: string;
  missionBodyIt: string;
  territorioTitoloIt: string;
  territorioBodyIt: string;
  territorioImmagine: string | null;
  // EN
  heroLabelEn: string;
  heroTitoloEn: string;
  heroBodyEn: string;
  filosofiaBodyEn: string;
  quoteEn: string;
  culturaTitoloEn: string;
  culturaBodyEn: string;
  manifestoEn: string;
  visionLabelEn: string;
  visionBodyEn: string;
  missionLabelEn: string;
  missionBodyEn: string;
  territorioTitoloEn: string;
  territorioBodyEn: string;
}

// ─── Pagina Coltivazioni (options page: badiula-coltivazioni) ─────────────────

export interface PaginaColtivazioni {
  titoloIt: string;
  titoloEn: string;
  sottotitoloIt: string;
  sottotitoloEn: string;
  introP1It: string;
  introP1En: string;
  introP2It: string;
  introP2En: string;
  gridTitoloIt: string;
  calendarioTitoloIt: string;
  bannerHeadingIt: string;
  bannerHeadingEn: string;
  bannerSubIt: string;
  bannerSubEn: string;
}

// ─── Pagina Luce di Terra (options page: badiula-luce-di-terra) ───────────────

export interface PaginaLuceDiTerra {
  // IT
  titoloIt: string;
  sottotitoloIt: string;
  introP1It: string;
  introP2It: string;
  lineeTitoloIt: string;
  olioTitoloIt: string;
  olioDescIt: string;
  olioPrezzo: string;
  olioImmagine: string | null;
  marmellaTitoloIt: string;
  marmellaDescIt: string;
  marmellaPrezzo: string;
  marmellaImmagine: string | null;
  filieraTitoloIt: string;
  filieraBodyIt: string;
  // EN
  titoloEn: string;
  sottotitoloEn: string;
  introP1En: string;
  introP2En: string;
  olioTitoloEn: string;
  olioDescEn: string;
  marmellaTitoloEn: string;
  marmellaDescEn: string;
  filieraTitoloEn: string;
  filieraBodyEn: string;
}

// ─── Pagina Olio EVO (options page: badiula-olio-evo) ─────────────────────────

export interface PaginaOlioEvo {
  // IT
  titoloIt: string;
  sottotitoloIt: string;
  introIt: string;
  immaginePrincipale: string | null;
  profiloProfumoIt: string;
  profiloSaporeIt: string;
  profiloRaccoltaIt: string;
  sezioni: Sezione[];
  faq: Faq[];
  // EN
  titoloEn: string;
  sottotitoloEn: string;
  introEn: string;
  profiloProfumoEn: string;
  profiloSaporeEn: string;
  profiloRaccoltaEn: string;
}

// ─── Pagina Marmellate (options page: badiula-marmellate) ─────────────────────

export interface VarietaMarmellata {
  nomeIt: string;
  nomeEn: string;
  descIt: string;
  descEn: string;
  immagine: string | null;
}

export interface PaginaMarmellate {
  titoloIt: string;
  sottotitoloIt: string;
  introIt: string;
  varieta: VarietaMarmellata[];
  sezioni: Sezione[];
  faq: Faq[];
  titoloEn: string;
  sottotitoloEn: string;
  introEn: string;
}

// ─── Pagina Shop (options page: badiula-shop) ─────────────────────────────────

export interface PaginaShop {
  heroTitoloIt: string;
  heroSottotitoloIt: string;
  heroImmagine: string | null;
  heroTitoloEn: string;
  heroSottotitoloEn: string;
}
