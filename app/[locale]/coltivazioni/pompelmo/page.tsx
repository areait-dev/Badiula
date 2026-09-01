import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Footer';
import FaqAccordion from './FaqAccordion';
import styles from './page.module.css';

const MONTHS = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
const HARVEST = [1, 2, 3, 4];

const FAQS = [
  {
    q: 'Quando è in stagione il pompelmo siciliano?',
    a: 'La nostra raccolta va da gennaio ad aprile.',
  },
  {
    q: 'Il pompelmo Badiula è rosa o giallo?',
    a: 'La nostra varietà ha polpa dal giallo chiaro al rosato, con variazione annuale legata alle condizioni climatiche. Non è la varietà «Pink» americana ma una selezione mediterranea dal carattere equilibrato.',
  },
  {
    q: 'Si può consumare la buccia del pompelmo?',
    a: 'La nostra coltivazione biologica non prevede trattamenti post-raccolta, quindi la buccia è utilizzabile per aromatizzazioni, canditi e preparazioni in cucina, come per tutti i nostri agrumi.',
  },
  {
    q: 'Si possono acquistare i pompelmi online?',
    a: 'Sì, i nostri pompelmi sono disponibili nello shop in box stagionali e formati misti, con spedizione in Italia e Unione Europea durante la stagione di raccolta.',
  },
];

export default function PompelmoPage() {
  return (
    <main className={styles.main}>

      {/* ── INTRO ── */}
      <section className={styles.intro}>
        <div className={styles.introHero}>
          <h1 className={styles.h1}>
            <span className={styles.h1Row}>POMPELMO</span>
            <span className={styles.h1RowMid}>BIOLOGICO</span>
          </h1>
          <h2 className={styles.h2}>
            Freschezza e carattere mediterraneo, dalla provincia di Siracusa
          </h2>
        </div>
        <div className={styles.introBody}>
          <p>
            Il nostro pompelmo biologico nasce in un territorio particolarmente vocato a
            questa coltivazione: le condizioni climatiche della Sicilia orientale, unite
            alla fertilità dei terreni tra Carlentini e Lentini, permettono lo sviluppo di
            frutti di buon calibro, polpa succosa e profilo aromatico equilibrato tra
            dolcezza e nota amaricante.
          </p>
          <p style={{ marginTop: '2em' }}>
            Il pompelmo è un agrume sempre più richiesto sia nel canale retail specializzato
            sia nell&apos;horeca, apprezzato per la versatilità d&apos;uso (consumo fresco,
            spremitura, mixology, cucina internazionale) e per le sue caratteristiche
            nutrizionali.
          </p>
        </div>
      </section>

      {/* ── CARATTERISTICHE: testo sx · cerchio dx ── */}
      <section className={styles.blockA}>
        <div className={styles.blockAContent}>
          <h3 className={styles.blockTitle}>Caratteristiche</h3>
          <p className={styles.blockLead}>Il pompelmo biologico presenta:</p>
          <ul className={styles.blockList}>
            <li><strong>Forma sferica regolare</strong>, calibri medio-grandi</li>
            <li><strong>Buccia giallo dorato</strong>, sottile per la varietà</li>
            <li><strong>Polpa succosa dal colore variabile</strong> (da giallo chiaro a rosato a seconda dell&apos;annata)</li>
            <li><strong>Sapore equilibrato</strong> tra dolce e amaricante</li>
            <li><strong>Coltivazione biologica certificata</strong>, senza trattamenti post-raccolta</li>
          </ul>
        </div>
        <div className={styles.blockAVisual}>
          <div className={styles.imgWrapCircle}>
            <Image
              src="/images/pompelmo.jpg"
              alt="Pompelmo biologico siciliano"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ── CALENDARIO DI RACCOLTA ── */}
      <section className={styles.calendar}>
        <div className={styles.container}>
          <h3 className={styles.calendarTitle}>CALENDARIO DI RACCOLTA</h3>
          <div className={styles.calendarBar} role="list">
            {MONTHS.map((m, i) => {
              const active = HARVEST.includes(i + 1);
              return (
                <div key={m} className={styles.calCol} role="listitem">
                  <span className={styles.calLabel}>{m}</span>
                  <span className={`${styles.calDot} ${active ? '' : styles.calDotOff}`} />
                </div>
              );
            })}
          </div>
          <div className={styles.calLegend}>
            <span><span className={styles.calDot} aria-hidden="true" /> In raccolta</span>
            <span><span className={`${styles.calDot} ${styles.calDotOff}`} aria-hidden="true" /> Riposo</span>
          </div>
        </div>
      </section>

      {/* ── USI CONSIGLIATI: riquadro sx · testo dx ── */}
      {/* Subito prima del banner shop (foto della ragazza con arance): niente
          sezione di testo in mezzo, quindi qui la foto resta prima del testo
          nello stack mobile/touch, per non avere due foto ravvicinate. */}
      <section className={`${styles.blockB} ${styles.beforeBanner}`}>
        <div className={styles.blockBVisual}>
          <div className={styles.imgWrapRect}>
            <Image
              src="/images/Screenshot%202026-07-20%20163605.png"
              alt="Pompelmo tagliato con succo fresco"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className={styles.blockBContent}>
          <h3 className={styles.blockTitle}>Usi consigliati</h3>
          <p className={styles.blockLead}>Il pompelmo biologico è apprezzato per:</p>
          <ul className={`${styles.blockList} ${styles.blockListDesc}`}>
            <li><strong>Consumo fresco</strong>: a spicchi o a metà, classico per la prima colazione</li>
            <li><strong>Spremitura</strong>: succhi di pompelmo freschi, anche misti con arancia</li>
            <li><strong>Mixology</strong>: cocktail come Greyhound, Paloma, Sea Breeze</li>
            <li><strong>Cucina internazionale</strong>: insalate con pesce, marinate, ceviche</li>
            <li><strong>Pasticceria</strong>: dessert agrumati, gelatine, sorbetti</li>
          </ul>
        </div>
      </section>

      {/* ── BANNER SHOP ── */}
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
          <Link href="/shop" className={styles.bannerShopBtn}>Shop</Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.faqHeading}>FAQ</h2>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
