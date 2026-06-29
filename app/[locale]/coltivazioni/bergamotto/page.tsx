'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const MONTHS = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
const HARVEST = [1, 2, 11, 12];

const FAQS = [
  {
    q: 'Il bergamotto si coltiva in Sicilia?',
    a: 'Sì. Sebbene la Calabria sia la zona storica di produzione (con la DOP «Bergamotto di Reggio Calabria»), la Sicilia orientale offre condizioni climatiche e pedologiche adatte alla coltivazione di questo agrume. Badiula lo produce in regime biologico tra Carlentini e Lentini.',
  },
  {
    q: 'A cosa serve il bergamotto fresco?',
    a: 'Il bergamotto fresco è ricercato in alta gastronomia, pasticceria e mixology per il suo profilo aromatico unico. Si usano sia la scorza (per aromatizzazione e oli essenziali) sia il succo (per acidulare e profumare preparazioni).',
  },
  {
    q: 'Si può mangiare il bergamotto come frutto fresco?',
    a: 'La polpa del bergamotto è troppo acida e amara per il consumo come frutto da tavola tradizionale. Si utilizza in cucina, in pasticceria e per spremitura aromatizzante. Marmellate e canditi sono i modi più diffusi per consumarlo come prodotto trasformato.',
  },
  {
    q: 'Si possono acquistare i bergamotti online?',
    a: 'Sì, i nostri bergamotti sono disponibili nello shop in box stagionali e formati misti, con spedizione in Italia e Unione Europea durante la stagione di raccolta.',
  },
];

export default function BergamottoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className={styles.main}>

      {/* ── INTRO ── */}
      <section className={styles.intro}>
        <div className={styles.introHero}>
          <h1 className={styles.h1}>
            <span className={styles.h1Row}>BERGAMOTTO</span>
            <span className={styles.h1RowMid}>BIOLOGICO</span>
            <span className={styles.h1Row}>SICILIANO</span>
          </h1>
          <h2 className={styles.h2}>
            L&apos;agrume più aromatico del Mediterraneo, in versione siciliana
          </h2>
        </div>
        <div className={styles.introBody}>
          <p>
            Il bergamotto è uno degli agrumi più ricercati al mondo per la complessità
            aromatica della scorza, ricca di oli essenziali pregiati utilizzati in profumeria,
            alta gastronomia, mixology e cosmesi naturale. Storicamente associato alla costa
            ionica calabrese, in Sicilia trova una zona di coltivazione vocata grazie al clima
            mediterraneo e alle caratteristiche dei terreni della provincia di Siracusa.
          </p>
          <p style={{ marginTop: '2em' }}>
            Coltiviamo bergamotto in regime biologico tra Carlentini e Lentini, valorizzando
            un agrume di nicchia destinato a chef, mixologist, laboratori cosmetici e
            consumatori finali alla ricerca di un prodotto raro e di alta qualità.
          </p>
        </div>
      </section>

      {/* ── CARATTERISTICHE: testo sx · cerchio dx ── */}
      <section className={styles.blockA}>
        <div className={styles.blockAContent}>
          <h3 className={styles.blockTitle}>Caratteristiche</h3>
          <p className={styles.blockLead}>Il bergamotto Badiula presenta:</p>
          <ul className={styles.blockList}>
            <li><strong>Forma sferica</strong> o leggermente piriforme</li>
            <li><strong>Buccia giallo intenso</strong> con sfumature verdognole, ricchissima di oli essenziali</li>
            <li><strong>Polpa acidula</strong> dal profumo inconfondibile</li>
            <li><strong>Aroma complesso</strong> con note floreali, agrumate e amaricate</li>
            <li><strong>Coltivazione biologica certificata</strong>, senza trattamenti post-raccolta</li>
          </ul>
        </div>
        <div className={styles.blockAVisual}>
          <div className={styles.imgWrapCircle}>
            <Image
              src="https://images.unsplash.com/photo-1432457990754-c8b5f21448de?w=600&q=80&fit=crop"
              alt="Bergamotto biologico siciliano"
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
      <section className={styles.blockB}>
        <div className={styles.blockBVisual}>
          <div className={styles.imgWrapRect}>
            <Image
              src="https://images.unsplash.com/photo-1717439062391-1c2932e1c051?w=600&q=80&fit=crop"
              alt="Usi del bergamotto in cucina"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className={styles.blockBContent}>
          <h3 className={styles.blockTitle}>Usi consigliati</h3>
          <p className={styles.blockLead}>Il bergamotto fresco è apprezzato per:</p>
          <ul className={`${styles.blockList} ${styles.blockListDesc}`}>
            <li><strong>Alta gastronomia</strong>: aromatizzazione di pesce crudo, carpacci, dessert</li>
            <li><strong>Pasticceria</strong>: torte, creme, gelati, ganache al bergamotto</li>
            <li><strong>Mixology</strong>: cocktail di alta gamma, twist aromatici, infusi</li>
            <li><strong>Marmellate artigianali</strong>: la nostra marmellata di bergamotto Luce di Terra è un esempio</li>
            <li><strong>Aromatizzazione di olio EVO</strong>: per condimenti gourmet</li>
            <li><strong>Bevande calde</strong>: tè aromatizzato, tisane</li>
          </ul>
        </div>
      </section>

      {/* ── PRODUZIONE DI NICCHIA ── */}
      <section className={styles.nicchia}>
        <div className={styles.container}>
          <h3 className={styles.nicchiaTitle}>Bergamotto siciliano: una produzione di nicchia</h3>
          <p className={styles.nicchiaBody}>
            Il bergamotto è storicamente associato alla Calabria, dove gode di DOP
            (Denominazione di Origine Protetta). La produzione siciliana è meno conosciuta
            ma altrettanto valida sul piano qualitativo, e in coltivazione biologica resta
            una nicchia ricercata da operatori del settore food professionale e canale gourmet.
          </p>
          <p className={styles.nicchiaBody}>
            Badiula ha scelto di valorizzare il bergamotto come parte integrante della
            propria gamma agrumicola biologica, contribuendo alla diversificazione varietale
            del territorio siracusano.
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
