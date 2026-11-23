import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { prodotti } from '@/lib/mock/prodotti';
import { luceDiTerraProdotti } from '@/lib/mock/luceDiTerraProdotti';
import ShopHero from '@/components/shop/ShopHero';
import ShopFeatured from '@/components/shop/ShopFeatured';
import ShopProductGrid from '@/components/shop/ShopProductGrid';
import Footer from '@/components/Footer';
import { getPaginaShop, getPageSeo } from '@/lib/wordpress';

// Banner "In evidenza" sopra la griglia: false per nasconderlo
const SHOW_FEATURED = true;
const FEATURED_SLUG = 'arance-rosse-igp';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('shop');
  if (!seo) {
    return {
      title: 'Shop - Badiula',
      description: 'Acquista online agrumi biologici siciliani, olio extravergine Luce di Terra e marmellate di agrumi. Spedizioni in Italia e UE.',
    };
  }
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default async function ShopPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const it = params.locale === 'it';
  const d = await getPaginaShop();
  const tutti = [...prodotti, ...luceDiTerraProdotti];
  const featured = SHOW_FEATURED ? tutti.find((p) => p.slug === FEATURED_SLUG) : undefined;

  return (
    <main>
      <ShopHero
        heroTitolo={it ? d.heroTitoloIt : d.heroTitoloEn}
        heroSottotitolo={it ? d.heroSottotitoloIt : d.heroSottotitoloEn}
      />
      {featured && <ShopFeatured prodotto={featured} />}
      <ShopProductGrid prodotti={tutti} />
      <Footer />
    </main>
  );
}
