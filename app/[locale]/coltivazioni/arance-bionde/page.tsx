'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const MONTHS = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
const HARVEST = [1, 2, 3, 4, 5, 6, 11]; // 1-based

const FAQS = [
  {
    q: 'Qual è la differenza tra arance rosse e bionde?',
    a: 'Le arance bionde hanno polpa arancio chiaro e sapore più dolce e neutro, mentre le rosse sviluppano una pigmentazione che va dal rosa al rosso intenso grazie agli antociani, con sapore più acidulo. Le bionde sono apprezzate per il consumo fresco e la spremitura, le rosse per il loro profilo aromatico distintivo.',
  },
  {
    q: 'Quando sono in stagione le arance bionde siciliane?',
    a: 'La stagione complessiva va da novembre a giugno, grazie alla coltivazione di due varietà complementari: Newhall (precoce, nov–gen) e Lane Late (tardiva, mar–giu).',
  },
  {
    q: 'Le arance Newhall e Lane Late sono adatte alla spremuta?',
    a: 'Sì, entrambe sono ottime per la spremitura, con la Lane Late particolarmente ricca di succo. La polpa croccante le rende ideali anche per il consumo fresco a spicchi.',
  },
  {
    q: 'Si possono acquistare le arance bionde online?',
    a: 'Sì, le nostre arance bionde sono disponibili nello shop in box stagionali e formati misti, con spedizione in Italia e Unione Europea durante la stagione di raccolta.',
  },
];

export default function AranceBiondePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className={styles.main}>

      {/* ── INTRO ── */}
      <section className={styles.intro}>
        <div className={styles.introHero}>
          <h1 className={styles.h1}>
            <span className={styles.h1Row1}>ARANCE</span>
            <span className={styles.h1Row2}>BIONDE</span>
          </h1>
          <h2 className={styles.h2}>
            Newhall e Lane Late
            <br /><br />
            due selezioni navel per una stagione lunga
          </h2>
        </div>
        <div className={styles.introBody}>
          <p>
            Le nostre arance bionde sono coltivate biologicamente nella stessa area vocata delle
            rosse, ma con due varietà del gruppo navel selezionate per coprire l&apos;intero arco
            stagionale: la Newhall apre la stagione delle bionde a novembre, la Lane Late la
            chiude in primavera inoltrata.
          </p>
          <p style={{ marginTop: '2em' }}>
            Entrambe sono prive di semi e dalla polpa croccante, ideali sia per il consumo
            fresco sia per la spremitura.
          </p>
        </div>
      </section>

      {/* ── NEWHALL: testo sx · cerchio dx ── */}
      <section className={styles.variety}>
        <div className={styles.varietyContent}>
          <h3 className={styles.varietyName}>NEWHALL</h3>
          <p className={styles.varietySlogan}>La navel precoce</p>
          <p className={styles.varietyDesc}>
            La Newhall è una selezione navel precoce, prima arancia bionda della stagione
            siciliana. Polpa dolce, croccante e priva di semi, buccia di colore arancio acceso,
            sottile e profumata.
          </p>
          <p className={styles.varietyDesc} style={{ marginTop: '2em' }}>
            Facile da pelare grazie alla tipica caratteristica delle navel (un piccolo
            &ldquo;ombelico&rdquo; alla base del frutto).
          </p>
        </div>
        <div className={styles.varietyVisual}>
          <div className={styles.varietyImgWrap}>
            <Image
              src="https://images.unsplash.com/photo-1661882002589-d93b357a2ffc?w=600&q=80&fit=crop"
              alt="Arance Newhall — navel siciliane"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ── LANE LATE: cerchio sx · testo dx ── */}
      <section className={`${styles.variety} ${styles.varietyReverse}`}>
        <div className={styles.varietyVisual}>
          <div className={styles.varietyImgWrap}>
            <Image
              src="https://images.unsplash.com/photo-1697250273200-df893313eb72?w=600&q=80&fit=crop"
              alt="Arance Lane Late — navel tardive"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className={styles.varietyContent}>
          <h3 className={styles.varietyName}>LANE LATE</h3>
          <p className={styles.varietySlogan}>La navel tardiva</p>
          <p className={styles.varietyDesc}>
            Selezione tardiva del gruppo navel, la Lane Late chiude la stagione delle arance
            bionde con frutti dalla polpa succosa, dolce e priva di semi. La maturazione lenta
            consente di prolungare l&apos;offerta di arance fresche fino a giugno.
          </p>
          <p className={styles.varietyDesc} style={{ marginTop: '2em' }}>
            Apprezzata sui mercati internazionali per la lunga shelf life e l&apos;aspetto
            regolare del frutto.
          </p>
        </div>
      </section>

      {/* ── CALENDARIO ── */}
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

      {/* ── COSA SIGNIFICA NAVEL ── */}
      <section className={styles.navel}>
        <div className={styles.container}>
          <h3 className={styles.navelTitle}>Cosa significa &laquo;Arancia Navel&raquo;</h3>
          <p className={styles.navelBody}>
            Le arance navel sono un gruppo di varietà caratterizzate da un piccolo frutto
            secondario alla base, simile a un ombelico (navel in inglese). Sono apprezzate per
            la facilità di pelatura, l&apos;assenza di semi e la polpa croccante.
          </p>
          <p className={styles.navelBody}>
            Newhall e Lane Late sono entrambe selezioni navel: la prima precoce, la seconda tardiva.
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
          <div className={styles.faqList}>
            {FAQS.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqBtn}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className={styles.faqQ}>{item.q}</span>
                  <span className={styles.faqIcon} aria-hidden="true">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <p className={styles.faqAnswer}>{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
