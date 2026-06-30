import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import Footer from '@/components/Footer';
import ProductCardBadiula from '@/components/ProductCardBadiula';
import { getPaginaLuceDiTerra, getPageSeo } from '@/lib/wordpress';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('luce-di-terra');
  if (!seo) {
    return {
      title: 'Luce di Terra — Badiula',
      description: "La linea Badiula dedicata all'olio extravergine di oliva biologico e alle marmellate di agrumi siciliani.",
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

export default async function LuceDiTerraPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const it = params.locale === 'it';
  const d = await getPaginaLuceDiTerra();

  const titolo = (it ? d.titoloIt : d.titoloEn) || 'LUCE DI TERRA';
  const sottotitolo = (it ? d.sottotitoloIt : d.sottotitoloEn) || 'La firma Badiula dedicata all\'olio e ai sapori della terra';
  const introP1 = it ? d.introP1It : d.introP1En;
  const introP2 = it ? d.introP2It : d.introP2En;
  const lineeTitolo = d.lineeTitoloIt || 'LE DUE LINEE';
  const olioTitolo = (it ? d.olioTitoloIt : d.olioTitoloEn) || 'Olio Extravergine di Oliva';
  const olioDesc = (it ? d.olioDescIt : d.olioDescEn) || 'Estratto a freddo entro 24 ore dalla raccolta, dai nostri uliveti di Carlentini. Fruttato, erbaceo, identità siciliana in ogni goccia.';
  const marmellaTitolo = (it ? d.marmellaTitoloIt : d.marmellaTitoloEn) || 'Marmellate di Agrumi';
  const marmellaDesc = (it ? d.marmellaDescIt : d.marmellaDescEn) || 'Solo frutta biologica, zucchero e cura artigianale. La stagionalità dei nostri agrumi trasformata in sapori intensi e naturali.';
  const filieraTitolo = (it ? d.filieraTitoloIt : d.filieraTitoloEn) || 'Una filiera che parte dal campo';
  const filieraBody = it ? d.filieraBodyIt : d.filieraBodyEn;

  return (
    <main className={styles.main}>

      {/* ── INTRO ── */}
      <section className={styles.intro}>
        <div className={styles.introHero}>
          <h1 className={styles.h1}>{titolo}</h1>
          <h2 className={styles.h2}>{sottotitolo}</h2>
        </div>
        <div className={styles.introBody}>
          {introP1 && <p>{introP1}</p>}
          {introP2 && <p style={{ marginTop: '2em' }}>{introP2}</p>}
        </div>
      </section>

      {/* ── LE DUE LINEE ── */}
      <section className={styles.linee}>
        <div className={styles.lineeContainer}>
          <h3 className={styles.lineeTitle}>{lineeTitolo}</h3>
          <div className={styles.cardGrid}>

            <ProductCardBadiula
              themeColor="bordeaux"
              category="Biologico · Sicilia orientale"
              title={olioTitolo}
              description={olioDesc}
              price={d.olioPrezzo || 'Da €12,00'}
              image={{
                src: d.olioImmagine ?? '/images/luce-di-terra.jpg',
                alt: 'Olio extravergine di oliva biologico Luce di Terra',
              }}
              href="/luce-di-terra/olio-evo"
            />

            <ProductCardBadiula
              themeColor="green"
              category="Naturale · Agrumi IGP"
              title={marmellaTitolo}
              description={marmellaDesc}
              price={d.marmellaPrezzo || 'Da €6,50'}
              image={{
                src: d.marmellaImmagine ?? '/images/luce-di-terra-promo.png',
                alt: 'Marmellate di agrumi biologici Badiula',
              }}
              href="/luce-di-terra/marmellata-agrumi"
            />

          </div>
        </div>
      </section>

      {/* ── UNA FILIERA ── */}
      <section className={styles.filiera}>
        <div className={styles.container}>
          <h3 className={styles.filieraTitle}>{filieraTitolo}</h3>
          {filieraBody
            ? filieraBody.split('\n\n').map((para, i) => (
                <p key={i} className={`body-2 ${styles.filieraBody}`}>{para}</p>
              ))
            : (
              <>
                <p className={`body-2 ${styles.filieraBody}`}>
                  Tutto ciò che entra in Luce di Terra nasce nei nostri terreni di Carlentini e Lentini.
                </p>
                <p className={`body-2 ${styles.filieraBody}`}>
                  Olive di varietà siciliane coltivate accanto agli agrumeti, agrumi biologici raccolti al giusto punto di maturazione e trasformati in marmellate.
                </p>
                <p className={`body-2 ${styles.filieraBody}`}>
                  È il vantaggio di una filiera corta e integrata: dalla raccolta alla bottiglia o al vasetto, il prodotto percorre pochi chilometri e pochi giorni, preservando integrità e freschezza.
                </p>
              </>
            )
          }
        </div>
      </section>

      {/* ── BANNER FINALE ── */}
      <section className={styles.banner}>
        <div className={styles.bannerImgWrap}>
          <Image
            src="/images/luce-di-terra-promo.png"
            alt="Luce di Terra — olio e marmellate Badiula"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
        <div className={styles.bannerStrip}>
          <div className={styles.bannerText}>
            <p className={styles.bannerHeading}>Acquista la linea Luce di Terra</p>
            <p className={`body-2 ${styles.bannerSub}`}>
              Olio EVO e marmellate di agrumi sono disponibili nello shop online,
              con spedizione in Italia e Unione Europea. Anche in formato box regalo.
            </p>
          </div>
          <Link href="/" className={styles.bannerBtn}>Shop</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
