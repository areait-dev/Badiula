// Query WPGraphQL — nomi campi in camelCase (WPGraphQL converte snake_case → camelCase)

// ─── Frammenti riutilizzabili ─────────────────────────────────────────────────

const SEZIONE_FIELDS = /* GraphQL */ `
  titoloSezione
  testoSezione
  immagineSinistra
  immagineSezione
`;

const FAQ_FIELDS = /* GraphQL */ `
  domanda
  risposta
`;

// ─── 1. Prodotti (CPT: prodotto) ──────────────────────────────────────────────

export const GET_ALL_PRODUCTS = /* GraphQL */ `
  query GetAllProducts {
    prodotti(first: 50) {
      nodes {
        id
        slug
        title
        acf {
          nome
          descrizione
          sottotitolo
          corpo
          nomeEn
          descrizioneEn
          sottotitoloEn
          corpoEn
          coloreSfondo
          immagine
          mesiRaccolta
          sezioni {
            ${SEZIONE_FIELDS}
          }
          faq {
            ${FAQ_FIELDS}
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = /* GraphQL */ `
  query GetProductBySlug($slug: ID!) {
    prodotto(id: $slug, idType: SLUG) {
      id
      slug
      title
      acf {
        nome
        descrizione
        sottotitolo
        corpo
        nomeEn
        descrizioneEn
        sottotitoloEn
        corpoEn
        coloreSfondo
        immagine
        mesiRaccolta
        sezioni {
          ${SEZIONE_FIELDS}
        }
        faq {
          ${FAQ_FIELDS}
        }
      }
    }
  }
`;

// ─── 2. Sezioni Azienda (CPT: sezione_azienda) ───────────────────────────────

export const GET_ALL_SEZIONI_AZIENDA = /* GraphQL */ `
  query GetAllSezioniAzienda {
    sezioniAzienda(first: 20) {
      nodes {
        id
        slug
        title
        acf {
          eyebrow
          titolo
          corpo
          eyebrowEn
          titoloEn
          corpoEn
        }
      }
    }
  }
`;

// ─── 3. Homepage (options page: badiula-sezioni-homepage) ─────────────────────

export const GET_HOMEPAGE = /* GraphQL */ `
  query GetHomepage {
    sezioniHomepage {
      heroVideo
      heroTitoloIt
      heroTitoloEn
      heroSottotitoloIt
      heroSottotitoloEn
      heroCtaIt
      heroCtaEn
      aboutP1EyebrowIt
      aboutP1EyebrowEn
      aboutP1HeadingIt
      aboutP1HeadingEn
      aboutP1BodyIt
      aboutP1BodyEn
      aboutP1CtaIt
      aboutP1CtaEn
      aboutP1Immagine
      aboutP2EyebrowIt
      aboutP2EyebrowEn
      aboutP2HeadingIt
      aboutP2HeadingEn
      aboutP2BodyIt
      aboutP2BodyEn
      aboutP2Body2It
      aboutP2Body2En
      aboutP3EyebrowIt
      aboutP3EyebrowEn
      aboutP3HeadingIt
      aboutP3HeadingEn
      aboutP3BodyIt
      aboutP3BodyEn
      produzioniEyebrowIt
      produzioniEyebrowEn
      produzioniTitoloIt
      produzioniTitoloEn
      produzioniSottotitoloIt
      produzioniSottotitoloEn
      luceTitoloIt
      luceTitoloEn
      luceSottotitoloIt
      luceSottotitoloEn
      luceBodyIt
      luceBodyEn
      luceImmagine
      shopBannerTitoloIt
      shopBannerTitoloEn
      shopBannerSottotitoloIt
      shopBannerSottotitoloEn
      shopBannerImmagine
    }
  }
`;

// ─── 4. Opzioni Globali (options page: badiula-options) ───────────────────────

export const GET_GLOBAL_OPTIONS = /* GraphQL */ `
  query GetGlobalOptions {
    opzioniGlobali {
      telefono
      email
      whatsapp
      indirizzo
      pIva
      instagram
      facebook
      linkedin
      footerQuoteIt
      footerQuoteEn
      footerFormTitleIt
      footerFormTitleEn
      ogImage
    }
  }
`;

// ─── 5. Pagina Azienda (options page: badiula-azienda) ───────────────────────

export const GET_PAGINA_AZIENDA = /* GraphQL */ `
  query GetPaginaAzienda {
    paginaAzienda {
      heroLabelIt
      heroTitoloIt
      heroBodyIt
      videoUrl
      filosofiaBodyIt
      filosofiaImmagine
      quoteIt
      culturaTitoloIt
      culturaBodyIt
      culturaImmagine
      manifestoIt
      visionLabelIt
      visionBodyIt
      missionLabelIt
      missionBodyIt
      territorioTitoloIt
      territorioBodyIt
      territorioImmagine
      heroLabelEn
      heroTitoloEn
      heroBodyEn
      filosofiaBodyEn
      quoteEn
      culturaTitoloEn
      culturaBodyEn
      manifestoEn
      visionLabelEn
      visionBodyEn
      missionLabelEn
      missionBodyEn
      territorioTitoloEn
      territorioBodyEn
    }
  }
`;

// ─── 6. Pagina Coltivazioni (options page: badiula-coltivazioni) ──────────────

export const GET_PAGINA_COLTIVAZIONI = /* GraphQL */ `
  query GetPaginaColtivazioni {
    paginaColtivazioni {
      titoloIt
      titoloEn
      sottotitoloIt
      sottotitoloEn
      introP1It
      introP1En
      introP2It
      introP2En
      gridTitoloIt
      calendarioTitoloIt
      bannerHeadingIt
      bannerHeadingEn
      bannerSubIt
      bannerSubEn
    }
  }
`;

// ─── 7. Pagina Luce di Terra (options page: badiula-luce-di-terra) ────────────

export const GET_PAGINA_LUCE_DI_TERRA = /* GraphQL */ `
  query GetPaginaLuceDiTerra {
    paginaLuceDiTerra {
      titoloIt
      titoloEn
      sottotitoloIt
      sottotitoloEn
      introP1It
      introP1En
      introP2It
      introP2En
      lineeTitoloIt
      olioTitoloIt
      olioTitoloEn
      olioDescIt
      olioDescEn
      olioPrezzo
      olioImmagine
      marmellaTitoloIt
      marmellaTitoloEn
      marmellaDescIt
      marmellaDescEn
      marmellaPrezzo
      marmellaImmagine
      filieraTitoloIt
      filieraTitoloEn
      filieraBodyIt
      filieraBodyEn
    }
  }
`;

// ─── 8. Pagina Olio EVO (options page: badiula-olio-evo) ─────────────────────

export const GET_PAGINA_OLIO_EVO = /* GraphQL */ `
  query GetPaginaOlioEvo {
    paginaOlioEvo {
      titoloIt
      titoloEn
      sottotitoloIt
      sottotitoloEn
      introIt
      introEn
      immaginePrincipale
      profiloProfumoIt
      profiloProfumoEn
      profiloSaporeIt
      profiloSaporeEn
      profiloRaccoltaIt
      profiloRaccoltaEn
      sezioni {
        ${SEZIONE_FIELDS}
      }
      faq {
        ${FAQ_FIELDS}
      }
    }
  }
`;

// ─── 9. Pagina Marmellate (options page: badiula-marmellate) ─────────────────

export const GET_PAGINA_MARMELLATE = /* GraphQL */ `
  query GetPaginaMarmellate {
    paginaMarmellate {
      titoloIt
      titoloEn
      sottotitoloIt
      sottotitoloEn
      introIt
      introEn
      varieta {
        nomeIt
        nomeEn
        descIt
        descEn
        immagine
      }
      sezioni {
        ${SEZIONE_FIELDS}
      }
      faq {
        ${FAQ_FIELDS}
      }
    }
  }
`;

// ─── 10. Pagina Shop (options page: badiula-shop) ─────────────────────────────

export const GET_PAGINA_SHOP = /* GraphQL */ `
  query GetPaginaShop {
    paginaShop {
      heroTitoloIt
      heroTitoloEn
      heroSottotitoloIt
      heroSottotitoloEn
      heroImmagine
    }
  }
`;
