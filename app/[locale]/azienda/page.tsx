import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Footer from '@/components/Footer';
import AziendaHeroVideo from '@/components/azienda/AziendaHeroVideo';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Azienda — Badiula",
    description: "Badiula è un'azienda agricola biologica situata a Carlentini, in provincia di Siracusa.",
  };
}

const COPY = {
  eyebrow: "Azienda",
  heroTitle: "Quattro generazioni,\nuna terra",
  heroBody:
    "Badiula è un'azienda agricola biologica situata a Carlentini, in provincia di Siracusa.\n\nSi estende su oltre 120 ettari nel cuore della Sicilia orientale, in una delle aree più vocate alla coltivazione agrumicola del Mediterraneo.\n\nIl percorso imprenditoriale della famiglia Di Giorgio prende forma negli anni '70, inizialmente dedicato alla coltivazione agrumicola tradizionale.",

  filosofiaBody:
    "Nel tempo l'azienda è cresciuta ed evoluta, sviluppando una visione produttiva capace di integrare esperienza agricola, sostenibilità ambientale e innovazione tecnologica.\n\nOggi Badiula è una moderna azienda agricola biologica orientata alla qualità, alla tracciabilità e alla gestione responsabile delle risorse naturali, attraverso una filiera che unisce agricoltura di precisione, energie rinnovabili e monitoraggio avanzato delle coltivazioni.",

  quote: "LA TERRA\nCI INSEGNA\nTEMPO",

  culturaTitle: "Esistono luoghi in cui\nl'agricoltura non è\nsoltanto produzione,\nma cultura, memoria e\nidentità.",
  culturaBody:
    "Badiula nasce da una terra antica, nel cuore della Sicilia orientale, dove la luce attraversa gli agrumeti e ogni raccolto racconta il legame profondo tra uomo e natura.\n\nDa oltre quattro generazioni coltiviamo questa terra con rispetto, custodendo un sapere agricolo fatto di gesti lenti, osservazione ed equilibrio. Crediamo in una produzione che sappia evolversi senza perdere autenticità. Per questo la tecnologia, per noi, non sostituisce la terra: la accompagna.",

  manifesto:
    "Non inseguiamo l'eccesso. Cerchiamo l'equilibrio.\nNon produciamo semplicemente agrumi.\nColtiviamo un modo diverso di vivere la terra.",

  visionLabel: "Vision",
  visionBody:
    "Diventare un modello di sostenibilità e ospitalità verde in Sicilia, dimostrando che è possibile fare agricoltura nel pieno rispetto dell'ecosistema, creando un ponte perfetto tra benessere, turismo ecologico e tutela del paesaggio.",

  missionLabel: "Mission",
  missionBody:
    "Custodire la terra per le future generazioni, produrre eccellenze biologiche e offrire un'ospitalità che rigenera corpo e mente, valorizzando la cultura rurale siciliana attraverso experiences autentiche e trasparenti.",

  territorioTitle: "Tra il mare e l'Etna",
  territorioBody:
    "Le nostre aziende agricole si estendono tra Carlentini e Lentini, in provincia di Siracusa, in un'area vocata da secoli alla coltivazione agrumicola. Qui il clima mediterraneo, la fertilità dei terreni e l'influenza dell'Etna creano le condizioni ideali per produrre agrumi di alta qualità.",
} as const;

const IMG = {
  hero:       { src: "/DJI_0001.jpg", alt: "Agrumeto biologico Badiula — veduta aerea" },
  filosofia:  { src: "/DJI_0022.jpg", alt: "Veduta aerea Badiula — agrumeto" },
  cultura:    { src: "/DSC_7761.jpg", alt: "Agrumeto Badiula" },
  territorio: { src: "/images/foto-copertina.png", alt: "Tra il mare e l'Etna — Badiula" },
} as const;

export default function AziendaPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <main className={styles.main}>

      {/* 0. Hero minimale */}
      <section className={styles.hero}>
        <h1 className={styles.heroLabel}>Azienda</h1>
      </section>

      {/* 1. Quattro generazioni: video sx | testo dx */}
      <section className={styles.grid}>
        <div className={styles.imgWrap}>
          <AziendaHeroVideo />
        </div>
        <div className={styles.textBlock}>
          <h2 className={styles.heroTitle} style={{ whiteSpace: "pre-line" }}>
            {COPY.heroTitle}
          </h2>
          <p className={`${styles.body} ${styles.bodyHero}`} style={{ whiteSpace: "pre-line" }}>{COPY.heroBody}</p>
        </div>
      </section>

      {/* 2. Filosofia: testo sx | immagine verticale dx */}
      <section className={`${styles.grid} ${styles.gridReverse}`}>
        <div className={styles.textBlock}>
          <p className={`${styles.body} ${styles.bodyHero}`} style={{ whiteSpace: "pre-line" }}>{COPY.filosofiaBody}</p>
        </div>
        <div className={`${styles.imgWrap} ${styles.imgTall}`}>
          <Image src={IMG.filosofia.src} alt={IMG.filosofia.alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
      </section>

      {/* 3. Citazione sovrapposta all'immagine della sezione sopra */}
      <section className={styles.quoteSection} aria-label="Citazione">
        <div className={styles.quoteText}>
          <span className={styles.quoteLine}>LA TERRA</span>
          <span className={styles.quoteLine}>CI INSEGNA</span>
          <span className={styles.quoteLine}>TEMPO</span>
        </div>
      </section>

      {/* 4. Cultura: immagine sx | testo dx */}
      <section className={styles.grid}>
        <div className={styles.imgWrap}>
          <Image src={IMG.cultura.src} alt={IMG.cultura.alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div className={styles.textBlock}>
          <h3 className={styles.h3} style={{ whiteSpace: 'pre-line' }}>{COPY.culturaTitle}</h3>
          <p className={`${styles.body} ${styles.bodyHero}`} style={{ whiteSpace: "pre-line" }}>{COPY.culturaBody}</p>
        </div>
      </section>

      {/* 5. Manifesto */}
      <section className={styles.manifestoSection} aria-label="Manifesto">
        <p className={styles.manifesto} style={{ whiteSpace: "pre-line" }}>
          {COPY.manifesto}
        </p>
      </section>

      {/* Immagine full-width dopo manifesto */}
      <div className={styles.fullImg}>
        <Image
          src="/images/azienda-drone.jpg"
          alt="Veduta aerea dei terreni Badiula, Carlentini"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
          priority
        />
      </div>

      {/* 6. Vision & Mission */}
      <section className={styles.vmSection}>
        <article className={styles.vmBlock}>
          <h2 className={styles.vmLabel}>{COPY.visionLabel}</h2>
          <p className={styles.body}>{COPY.visionBody}</p>
        </article>
        <div className={styles.vmDivider} aria-hidden="true" />
        <article className={styles.vmBlock}>
          <h2 className={styles.vmLabel}>{COPY.missionLabel}</h2>
          <p className={styles.body}>{COPY.missionBody}</p>
        </article>
      </section>

      {/* Immagine full-width dopo Vision & Mission */}
      <div className={styles.fullImg}>
        <Image
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
          alt="Campi agricoli Badiula"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* 7. Territorio: testo sx | immagine dx */}
      <section className={`${styles.grid} ${styles.gridLast}`}>
        <div className={styles.textBlock}>
          <h2 className={styles.h2}>{COPY.territorioTitle}</h2>
          <p className={styles.body}>{COPY.territorioBody}</p>
        </div>
        <div className={`${styles.imgWrap} ${styles.imgDark}`}>
          <Image src={IMG.territorio.src} alt={IMG.territorio.alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", filter: "brightness(0.75)" }} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
