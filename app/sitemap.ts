import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { prodotti } from '@/lib/mock/prodotti';
import { luceDiTerraProdotti } from '@/lib/mock/luceDiTerraProdotti';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agribadiula.it';

// Percorsi statici del sito. Se aggiungi una nuova pagina, aggiungila qui.
const STATIC_PATHS = [
  '',
  '/azienda',
  '/certificazioni',
  '/coltivazioni',
  '/coltivazioni/arance-rosse-igp',
  '/coltivazioni/arance-bionde',
  '/coltivazioni/limone-femminello',
  '/coltivazioni/bergamotto',
  '/coltivazioni/pompelmo',
  '/cookie-policy',
  '/filiera-e-lavorazione',
  '/innovazione',
  '/luce-di-terra',
  '/luce-di-terra/olio-evo',
  '/luce-di-terra/marmellata-agrumi',
  '/privacy-policy',
  '/shop',
  ...[...prodotti, ...luceDiTerraProdotti].map((p) => `/shop/${p.slug}`),
  '/sostenibilita',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
          ),
        },
      });
    }
  }

  return entries;
}
