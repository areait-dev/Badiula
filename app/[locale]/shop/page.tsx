import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { prodotti } from '@/lib/mock/prodotti';
import ShopHero from '@/components/shop/ShopHero';
import ShopSlider from '@/components/shop/ShopSlider';
import Footer from '@/components/Footer';
import { getPaginaShop, getPageSeo } from '@/lib/wordpress';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('shop');
  if (!seo) {
    return {
      title: 'Shop — Badiula',
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

  return (
    <main>
      <ShopHero
        total={prodotti.length}
        heroTitolo={it ? d.heroTitoloIt : d.heroTitoloEn}
        heroSottotitolo={it ? d.heroSottotitoloIt : d.heroSottotitoloEn}
      />
      <ShopSlider prodotti={prodotti} />
      <Footer />
    </main>
  );
}
