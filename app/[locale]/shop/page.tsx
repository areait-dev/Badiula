import { setRequestLocale } from 'next-intl/server';
import { prodotti } from '@/lib/mock/prodotti';
import ShopHero from '@/components/shop/ShopHero';
import ShopSlider from '@/components/shop/ShopSlider';
import Footer from '@/components/Footer';
import { getPaginaShop } from '@/lib/wordpress';

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
