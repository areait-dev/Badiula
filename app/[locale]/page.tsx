import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/Hero';
import HorizontalScroll from '@/components/HorizontalScroll';
import Productions from '@/components/Productions';
import LuceDiTerra from '@/components/LuceDiTerra';
import ShopBanner from '@/components/ShopBanner';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return (
    <main>
      <Hero />
      <HorizontalScroll />
      <Productions />
      <Reveal>
        <LuceDiTerra />
        <ShopBanner />
      </Reveal>
      <Footer />
    </main>
  );
}
