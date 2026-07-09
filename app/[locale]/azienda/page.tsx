import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Footer from '@/components/Footer';
import AziendaHeroVideo from '@/components/azienda/AziendaHeroVideo';
import { getPaginaAzienda, getPageSeo } from '@/lib/wordpress';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('azienda');
  if (!seo) {
    return {
      title: 'Azienda - Badiula',
      description: "Badiula è un'azienda agricola biologica situata a Carlentini, in provincia di Siracusa.",
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

export default async function AziendaPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const it = params.locale === 'it';
  const d = await getPaginaAzienda();

  const heroLabel = it ? d.heroLabelIt : d.heroLabelEn;
  const heroTitle = it ? d.heroTitoloIt : d.heroTitoloEn;
  const heroBody = it ? d.heroBodyIt : d.heroBodyEn;
  const filosofiaBody = it ? d.filosofiaBodyIt : d.filosofiaBodyEn;
  const quote = (it ? d.quoteIt : d.quoteEn) || 'LA TERRA\nCI INSEGNA\nTEMPO';
  const culturaTitolo = it ? d.culturaTitoloIt : d.culturaTitoloEn;
  const culturaBody = it ? d.culturaBodyIt : d.culturaBodyEn;
  const manifesto = it ? d.manifestoIt : d.manifestoEn;
  const visionLabel = (it ? d.visionLabelIt : d.visionLabelEn) || 'Vision';
  const visionBody = it ? d.visionBodyIt : d.visionBodyEn;
  const missionLabel = (it ? d.missionLabelIt : d.missionLabelEn) || 'Mission';
  const missionBody = it ? d.missionBodyIt : d.missionBodyEn;
  const territorioTitolo = it ? d.territorioTitoloIt : d.territorioTitoloEn;
  const territorioBody = it ? d.territorioBodyIt : d.territorioBodyEn;

  return (
    <main className={styles.main}>

      {/* 0. Hero minimale */}
      <section className={styles.hero}>
        <h1 className={styles.heroLabel}>{heroLabel || 'Azienda'}</h1>
      </section>

      {/* 1. Quattro generazioni: video sx | testo dx */}
      <section className={styles.grid}>
        <div className={styles.imgWrap}>
          <AziendaHeroVideo />
        </div>
        <div className={styles.textBlock}>
          <h2 className={styles.heroTitle} style={{ whiteSpace: 'pre-line' }}>
            {heroTitle || 'Quattro generazioni,\nuna terra'}
          </h2>
          <p className={`${styles.body} ${styles.bodyHero}`} style={{ whiteSpace: 'pre-line' }}>{heroBody}</p>
        </div>
      </section>

      {/* 2. Filosofia: testo sx | immagine verticale dx */}
      <section className={`${styles.grid} ${styles.gridReverse}`}>
        <div className={styles.textBlock}>
          <p className={`${styles.body} ${styles.bodyHero}`} style={{ whiteSpace: 'pre-line' }}>{filosofiaBody}</p>
        </div>
        <div className={`${styles.imgWrap} ${styles.imgTall}`}>
          <Image
            src={d.filosofiaImmagine ?? '/DJI_0022.jpg'}
            alt="Veduta aerea Badiula - agrumeto"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* 3. Citazione */}
      <section className={styles.quoteSection} aria-label="Citazione">
        <div className={styles.quoteText}>
          {quote.split('\n').map((line, i) => (
            <span key={i} className={styles.quoteLine}>{line}</span>
          ))}
        </div>
      </section>

      {/* 4. Cultura: immagine sx | testo dx */}
      <section className={styles.grid}>
        <div className={styles.imgWrap}>
          <Image
            src={d.culturaImmagine ?? '/DSC_7761.jpg'}
            alt="Agrumeto Badiula"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={styles.textBlock}>
          <h3 className={styles.h3}>{culturaTitolo}</h3>
          <p className={`${styles.body} ${styles.bodyHero}`} style={{ whiteSpace: 'pre-line' }}>{culturaBody}</p>
        </div>
      </section>

      {/* 5. Manifesto */}
      <section className={styles.manifestoSection} aria-label="Manifesto">
        <p className={styles.manifesto} style={{ whiteSpace: 'pre-line' }}>
          {manifesto}
        </p>
      </section>

      {/* Immagine full-width dopo manifesto */}
      <div className={styles.fullImg}>
        <Image
          src="/images/azienda-drone.jpg"
          alt="Veduta aerea dei terreni Badiula, Carlentini"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          priority
        />
      </div>

      {/* 6. Vision & Mission */}
      <section className={styles.vmSection}>
        <article className={styles.vmBlock}>
          <h2 className={styles.vmLabel}>{visionLabel}</h2>
          <p className={styles.body}>{visionBody}</p>
        </article>
        <div className={styles.vmDivider} aria-hidden="true" />
        <article className={styles.vmBlock}>
          <h2 className={styles.vmLabel}>{missionLabel}</h2>
          <p className={styles.body}>{missionBody}</p>
        </article>
      </section>

      {/* Immagine full-width "Tra il mare e l'Etna" - spostata qui, sopra la mappa */}
      <div className={styles.fullImg}>
        <Image
          src={d.territorioImmagine ?? '/images/foto-copertina.png'}
          alt="Tra il mare e l'Etna - Badiula"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', filter: 'brightness(0.75)' }}
        />
      </div>

      {/* 7. Territorio: testo sx | Google Maps dx */}
      <section className={`${styles.grid} ${styles.gridLast}`}>
        <div className={styles.textBlock}>
          <h2 className={styles.h2}>{territorioTitolo}</h2>
          <p className={styles.body}>{territorioBody}</p>
        </div>
        <div className={`${styles.imgWrap} ${styles.imgDark}`}>
          <iframe
            title="Posizione Badiula - C.da Badiula San Leonardo, Carlentini (SR)"
            src="https://maps.google.com/maps?q=Badiula,+C.da+Badiula+San+Leonardo,+96013+Carlentini+SR&z=16&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block', position: 'absolute', inset: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
