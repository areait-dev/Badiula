import { setRequestLocale } from 'next-intl/server';
import { getHomepage } from '@/lib/wordpress';
import Hero from '@/components/Hero';
import HorizontalScroll from '@/components/HorizontalScroll';
import Productions from '@/components/Productions';
import LuceDiTerra from '@/components/LuceDiTerra';
import ShopBanner from '@/components/ShopBanner';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const locale = params.locale as 'it' | 'en';
  const hp = await getHomepage();

  const it = locale === 'it';

  return (
    <main>
      <Hero
        titolo={it ? hp.heroTitoloIt : hp.heroTitoloEn}
        sottotitolo={it ? hp.heroSottotitoloIt : hp.heroSottotitoloEn}
        cta={it ? hp.heroCtaIt : hp.heroCtaEn}
        video={hp.heroVideo}
      />
      <HorizontalScroll
        p1Eyebrow={it ? hp.aboutP1.eyebrowIt : hp.aboutP1.eyebrowEn}
        p1Heading={it ? hp.aboutP1.headingIt : hp.aboutP1.headingEn}
        p1Body={it ? hp.aboutP1.bodyIt : hp.aboutP1.bodyEn}
        p1Cta={it ? hp.aboutP1.ctaIt : hp.aboutP1.ctaEn}
        p1Image={hp.aboutP1.immagine}
        p2Eyebrow={it ? hp.aboutP2.eyebrowIt : hp.aboutP2.eyebrowEn}
        p2Heading={it ? hp.aboutP2.headingIt : hp.aboutP2.headingEn}
        p2Body={it ? hp.aboutP2.bodyIt : hp.aboutP2.bodyEn}
        p2Body2={it ? hp.aboutP2.body2It : hp.aboutP2.body2En}
        p3Eyebrow={it ? hp.aboutP3.eyebrowIt : hp.aboutP3.eyebrowEn}
        p3Heading={it ? hp.aboutP3.headingIt : hp.aboutP3.headingEn}
        p3Body={it ? hp.aboutP3.bodyIt : hp.aboutP3.bodyEn}
      />
      <Productions
        title={it ? hp.produzioniTitoloIt : hp.produzioniTitoloEn}
        subtitle={it ? hp.produzioniSottotitoloIt : hp.produzioniSottotitoloEn}
      />
      <Reveal>
        <LuceDiTerra
          title={it ? hp.luceTitoloIt : hp.luceTitoloEn}
          subtitle={it ? hp.luceSottotitoloIt : hp.luceSottotitoloEn}
          body={it ? hp.luceBodyIt : hp.luceBodyEn}
          image={hp.luceImmagine}
        />
        <ShopBanner
          title={it ? hp.shopBannerTitoloIt : hp.shopBannerTitoloEn}
          subtitle={it ? hp.shopBannerSottotitoloIt : hp.shopBannerSottotitoloEn}
          image={hp.shopBannerImmagine}
        />
      </Reveal>
      <Footer />
    </main>
  );
}
