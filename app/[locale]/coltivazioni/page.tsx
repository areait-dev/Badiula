import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { PRODUCTS } from '@/lib/data';
import HarvestCalendar from '@/components/HarvestCalendar';
import Footer from '@/components/Footer';
import ProductionsTrack from './ProductionsTrack';
import { getPaginaColtivazioni } from '@/lib/wordpress';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'coltivazioni' });
  return {
    title: 'COLTIVAZIONI — Badiula',
    description: t('heroText'),
  };
}

export default async function ColtivazioniPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const it = params.locale === 'it';
  const [t, d] = await Promise.all([
    getTranslations('coltivazioni'),
    getPaginaColtivazioni(),
  ]);

  const titolo = (it ? d.titoloIt : d.titoloEn) || 'COLTIVAZIONI';
  const sottotitolo = (it ? d.sottotitoloIt : d.sottotitoloEn) || 'Cinque produzioni biologiche, una stagionalità naturale';
  const introP1 = it ? d.introP1It : d.introP1En;
  const introP2 = it ? d.introP2It : d.introP2En;
  const gridTitolo = d.gridTitoloIt || 'LE NOSTRE PRODUZIONI';
  const calendarioTitolo = d.calendarioTitoloIt || 'CALENDARIO DI RACCOLTA';
  const bannerHeading = (it ? d.bannerHeadingIt : d.bannerHeadingEn) || 'Agrumi siciliani\ndirettamente dal produttore';
  const bannerSub = (it ? d.bannerSubIt : d.bannerSubEn) || 'Box stagionali di agrumi biologici, olio extravergine Luce di Terra,\nmarmellate di agrumi. Spedizioni in Italia e in Unione Europea';

  return (
    <main className={styles.main}>

      {/* ── SEZIONE 1: TITOLO ── */}
      <section className={styles.heroTitle}>
        <h1 className={styles.introTitle}>{titolo}</h1>
      </section>

      {/* ── SEZIONE 2: INTRODUZIONE ── */}
      <section className={styles.sezioneIntroduzione}>
        <h2 className={styles.sottotitoloItalic}>{sottotitolo}</h2>
        {introP1 && <p className={styles.paragrafoDescrizione}>{introP1}</p>}
        {introP2 && <p className={styles.paragrafoDescrizione}>{introP2}</p>}
      </section>

      {/* ── SEZIONE 2: GRIGLIA PRODUZIONI ── */}
      <section className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <h2 className={styles.gridTitle}>{gridTitolo}</h2>
        </div>
        <ProductionsTrack moreLabel={t('more')} />
      </section>

      {/* ── SEZIONE 3a: CALENDARIO DI RACCOLTA ── */}
      <section className={styles.calendarSection}>
        <h2 className={styles.calendarTitle}>{calendarioTitolo}</h2>
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
            <p className={styles.bannerHeading} style={{ whiteSpace: 'pre-line' }}>{bannerHeading}</p>
            <p className={styles.bannerSub} style={{ whiteSpace: 'pre-line' }}>{bannerSub}</p>
          </div>
          <Link href="/" className={styles.bannerShopBtn}>Shop</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
