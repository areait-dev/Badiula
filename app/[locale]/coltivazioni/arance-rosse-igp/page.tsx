'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const MONTHS = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
const HARVEST = [1, 2, 3, 4, 12]; // mesi attivi (1-based)

const FAQS = [
  {
    q: 'Qual è la differenza tra Tarocco e Moro?',
    a: 'Le due varietà si distinguono per intensità del colore e profilo aromatico. La Tarocco ha polpa con pigmentazione variabile (rosso-rosa screziato) e sapore equilibrato. La Moro ha polpa di rosso profondo e sapore più intenso, leggermente acidulo. Entrambe sono prive o quasi di semi.',
  },
  {
    q: 'Quando maturano le arance rosse di Sicilia?',
    a: 'La maturazione naturale va da dicembre ad aprile, con la Moro che matura per prima (dicembre–marzo) e la Tarocco che chiude la stagione (gennaio–aprile). La pigmentazione rossa si sviluppa con le escursioni termiche notturne tipiche della Sicilia orientale.',
  },
  {
    q: 'Le arance rosse Badiula sono biologiche?',
    a: 'Sì, tutte le nostre arance rosse sono certificate biologiche secondo il regolamento europeo (UE) 2018/848, oltre che IGP. Aderiscono inoltre agli standard Bio Suisse e GlobalG.A.P.',
  },
  {
    q: 'Si possono acquistare le arance rosse online?',
    a: 'Sì, le nostre arance rosse sono disponibili nello shop in box stagionali e formati misti, con spedizione in Italia e Unione Europea durante la stagione di raccolta.',
  },
];

export default function AranceRossePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className={styles.main}>

      {/* ── INTRO ── */}
      <section className={styles.intro}>
        <div className={styles.introHero}>
          <h1 className={styles.h1}>
            <span className={styles.h1Row1}>ARANCE</span>
            <span className={styles.h1Row2}>ROSSE DI</span>
            <span className={styles.h1Row3}>SICILIA IGP</span>
          </h1>
          <h2 className={styles.h2}>
            Tarocco e Moro, le due varietà siciliane più rappresentative
          </h2>
        </div>
        <div className={styles.introBody}>
          <p>
            Le nostre arance rosse di Sicilia sono certificate IGP (Indicazione Geografica
            Protetta) e prodotte secondo metodo biologico, coltivate nella zona di elezione
            delle rosse siciliane, tra Carlentini e Lentini in provincia di Siracusa.
            La pigmentazione rossa caratteristica deriva dall'alta concentrazione di antociani,
            sviluppata grazie alle marcate escursioni termiche tra giorno e notte tipiche
            del territorio.
          </p>
          <p>
            Coltiviamo le due varietà principali del Consorzio di Tutela: la Tarocco, dal
            sapore equilibrato e dalla polpa parzialmente pigmentata, e la Moro, la più
            intensa per colore e profumo.
          </p>
        </div>
      </section>

      {/* ── VARIETÀ TAROCCO (testo sx · foto dx) ── */}
      <section className={styles.variety}>
        <div className={styles.varietyContent}>
          <h3 className={styles.varietyName}>TAROCCO</h3>
          <p className={styles.varietySlogan}>L'arancia rossa per eccellenza</p>
          <p className={styles.varietyDesc}>
            La Tarocco è tra le arance rosse siciliane più diffuse e apprezzate: polpa rossa
            con pigmentazione variabile dal rosso intenso al rosa screziato, in funzione delle
            escursioni termiche stagionali.
          </p>
          <p className={styles.varietyDesc} style={{ marginTop: '2em' }}>
            È priva o quasi di semi, facile da pelare, dal sapore equilibrato tra dolcezza e acidità.
          </p>
        </div>
        <div className={styles.varietyVisual}>
          <div className={styles.varietyImgWrap}>
            <Image
              src="https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=80&fit=crop"
              alt="Arance Tarocco — polpa rossa"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ── VARIETÀ MORO (foto sx · testo dx) ── */}
      <section className={`${styles.variety} ${styles.varietyReverse}`}>
        <div className={styles.varietyVisual}>
          <div className={styles.varietyImgWrap}>
            <Image
              src="https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&q=80&fit=crop"
              alt="Arance Moro — polpa rosso intenso"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className={styles.varietyContent}>
          <h3 className={styles.varietyName}>MORO</h3>
          <p className={styles.varietySlogan}>La più pigmentata delle arance rosse</p>
          <p className={styles.varietyDesc}>
            La Moro è la varietà più intensa nel colore: polpa di un rosso profondo grazie
            all'elevata concentrazione di antociani, frutti di forma ovoidale con sfumature
            rosse anche sulla buccia.
          </p>
          <p className={styles.varietyDesc} style={{ marginTop: '2em' }}>
            Il sapore è ricco e leggermente acidulo, particolarmente apprezzato per il consumo fresco e la spremitura.
          </p>
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
                <div key={m} className={`${styles.calCol} ${active ? styles.calActive : ''}`} role="listitem">
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

      {/* ── COSA SIGNIFICA IGP ── */}
      <section className={styles.igp}>
        <div className={styles.container}>
          <h3 className={styles.igpTitle}>Cosa significa «Arancia Rossa di Sicilia IGP»</h3>
          <p className={styles.igpBody}>
            L'Indicazione Geografica Protetta tutela le arance rosse prodotte in una zona
            delimitata della Sicilia orientale che comprende le province di Catania, Siracusa
            ed Enna. Solo le varietà Tarocco, Moro e Sanguinello coltivate in questa area
            possono fregiarsi del marchio IGP, sotto il controllo del Consorzio di Tutela
            Arancia Rossa di Sicilia IGP, di cui Badiula è membro.
          </p>
          <p className={styles.igpBody}>
            L'IGP garantisce origine territoriale, varietà ammesse e standard qualitativi:
            è una garanzia di autenticità tracciabile fino al singolo campo di coltivazione.
          </p>
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
          <Link href="/" className={styles.bannerShopBtn}>Shop</Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.faqHeading}>FAQ</h2>
          <dl className={styles.faqList}>
            {FAQS.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <dt className={styles.faqQuestion}>
                  <button
                    className={styles.faqBtn}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{item.q}</span>
                    <span className={styles.faqIcon} aria-hidden="true">
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </button>
                </dt>
                {openFaq === i && (
                  <dd className={styles.faqAnswer}>{item.a}</dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Footer />
    </main>
  );
}
