import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { PRODUCTS } from '@/lib/data';
import HarvestCalendar from '@/components/HarvestCalendar';
import Footer from '@/components/Footer';
import ProductionsTrack from './ProductionsTrack';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'coltivazioni' });
  return {
    title: `COLTIVAZIONI — Badiula`,
    description: t('heroText'),
  };
}

export default function ColtivazioniPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('coltivazioni');

  return (
    <main className={styles.main}>

      {/* ── SEZIONE 1: TITOLO ── */}
      <section className={styles.heroTitle}>
        <h1 className={styles.introTitle}>COLTIVAZIONI</h1>
      </section>

      {/* ── SEZIONE 2: INTRODUZIONE ── */}
      <section className={styles.sezioneIntroduzione}>
        <h2 className={styles.sottotitoloItalic}>
          Cinque produzioni biologiche, una stagionalità naturale
        </h2>
        <p className={styles.paragrafoDescrizione}>
          Le nostre coltivazioni si sviluppano su oltre 120 ettari tra Carlentini e Lentini, in provincia di Siracusa, in un territorio unico per la produzione agrumicola siciliana. Il clima mediterraneo, la fertilità dei terreni e l&apos;influenza dell&apos;Etna creano le condizioni ideali per produrre agrumi biologici di alta qualità.
        </p>
        <p className={styles.paragrafoDescrizione}>
          Coltiviamo cinque produzioni principali: arance rosse di Sicilia IGP, arance bionde, limoni, bergamotto e pompelmo. Ogni raccolta segue la naturale stagionalità del prodotto per preservarne freschezza, aroma e caratteristiche organolettiche.
        </p>
      </section>

      {/* ── SEZIONE 2: GRIGLIA PRODUZIONI ── */}
      <section className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <h2 className={styles.gridTitle}>LE NOSTRE PRODUZIONI</h2>
        </div>
        <ProductionsTrack moreLabel={t('more')} />
      </section>

      {/* ── SEZIONE 3a: CALENDARIO DI RACCOLTA ── */}
      <section className={styles.calendarSection}>
        <h2 className={styles.calendarTitle}>CALENDARIO DI RACCOLTA</h2>
        <div className={styles.tableWrap}>
          <HarvestCalendar
            rows={PRODUCTS.map((p) => ({ label: p.name, harvest: p.harvest }))}
          />
        </div>
      </section>

      {/* ── SEZIONE 3b: BANNER SHOP ── */}
      <section className={styles.banner}>
        <div className={styles.bannerYellow}>
          <div className={styles.bannerImgWrap}>
            <Image
              src="/images/luce-di-terra-promo.png"
              alt="Agrumi siciliani Badiula"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
        </div>
        <div className={styles.bannerGreen}>
          <div className={styles.bannerText}>
            <p className={styles.bannerHeading}>Agrumi siciliani{'\n'}direttamente dal produttore</p>
            <p className={styles.bannerSub}>Box stagionali di agrumi biologici, olio extravergine Luce di Terra,{'\n'}marmellate di agrumi. Spedizioni in Italia e in Unione Europea</p>
          </div>
          <Link href="/" className={styles.bannerShopBtn}>Shop</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
