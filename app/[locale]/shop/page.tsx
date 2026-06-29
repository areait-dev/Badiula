import { setRequestLocale } from 'next-intl/server';
import { prodotti } from '@/lib/mock/prodotti';
import ShopHero from '@/components/shop/ShopHero';
import ShopSlider from '@/components/shop/ShopSlider';
import Footer from '@/components/Footer';

export default function ShopPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return (
    <main>
      <ShopHero total={prodotti.length} />
      <ShopSlider prodotti={prodotti} />
      <Footer />
    </main>
  );
}
