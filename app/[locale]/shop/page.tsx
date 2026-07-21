import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { prodotti } from '@/lib/mock/prodotti';
import { luceDiTerraProdotti } from '@/lib/mock/luceDiTerraProdotti';
import ShopHero from '@/components/shop/ShopHero';
import ShopSlider from '@/components/shop/ShopSlider';
import LuceDiTerraShop from '@/components/shop/LuceDiTerraShop';
import Footer from '@/components/Footer';
import { getPaginaShop, getPageSeo } from '@/lib/wordpress';
import styles from './page.module.css';

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

  return (
    <main>
      <ShopHero
        total={prodotti.length}
        heroTitolo={it ? d.heroTitoloIt : d.heroTitoloEn}
        heroSottotitolo={it ? d.heroSottotitoloIt : d.heroSottotitoloEn}
      />
      <ShopSlider prodotti={prodotti} />

      {/* Title separating the two shop sections */}
      <div className={styles.sectionDivider}>
        <h2 className={styles.sectionTitle}>Luce di Terra</h2>
      </div>

      <LuceDiTerraShop prodotti={luceDiTerraProdotti} />
      <Footer />
    </main>
  );
}
