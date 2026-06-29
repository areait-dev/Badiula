'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const MONTHS = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
const HARVEST = [1, 2, 3, 4, 5, 6, 10, 11, 12];

export default function LimoneFemminelloPage() {
  return (
    <main className={styles.main}>

      {/* ── INTRO ── */}
      <section className={styles.intro}>
        <div className={styles.introHero}>
          <h1 className={styles.h1}>
            <span className={styles.h1Row}>LIMONE</span>
            <span className={styles.h1RowMid}>FEMMINELLO</span>
            <span className={styles.h1Row}>SIRACUSANO</span>
          </h1>
          <h2 className={styles.h2}>
            La varietà storica della Sicilia orientale, dalle aree di elezione del limone siciliano
          </h2>
        </div>
        <div className={styles.introBody}>
          <p>
            Il Femminello Siracusano è la varietà di limone più rappresentativa del territorio
            siracusano: una selezione storica, riconosciuta per l&apos;intensità aromatica della
            buccia e per la generosa produzione di succo. La polpa è chiara, ricca e profumata;
            la scorza, di colore giallo brillante, è particolarmente apprezzata per la qualità
            degli oli essenziali, utilizzata in pasticceria, mixology e cosmesi naturale.
          </p>
          <p style={{ marginTop: '2em' }}>
            Coltiviamo Femminello Siracusano in regime biologico tra Carlentini e Lentini, nella
            zona di elezione del limone siciliano. La fioritura prolungata permette più raccolte
            durante l&apos;anno, garantendo continuità produttiva e freschezza costante da ottobre
            a giugno.
          </p>
        </div>
      </section>

      {/* ── CARATTERISTICHE: testo sx · cerchio dx ── */}
      <section className={styles.blockA}>
        <div className={styles.blockAContent}>
          <h3 className={styles.blockTitle}>Caratteristiche</h3>
          <p className={styles.blockLead}>Il Femminello Siracusano è caratterizzato da:</p>
          <ul className={styles.blockList}>
            <li><strong>Buccia gialla brillante</strong> ricca di oli essenziali pregiati</li>
            <li><strong>Polpa chiara e abbondante</strong>, con elevata resa in succo</li>
            <li><strong>Sapore intenso</strong> e profilo aromatico complesso</li>
            <li><strong>Fioritura rifiorente</strong>, con più raccolte annuali</li>
            <li><strong>Versatilità d&apos;uso</strong>: consumo fresco, spremitura, scorza per pasticceria, oli essenziali</li>
          </ul>
        </div>
        <div className={styles.blockAVisual}>
          <div className={styles.imgWrapCircle}>
            <Image
              src="https://images.unsplash.com/photo-1432457990754-c8b5f21448de?w=600&q=80&fit=crop"
              alt="Limone Femminello Siracusano"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ── TRE RACCOLTI: riquadro sx · testo dx ── */}
      <section className={styles.blockB}>
        <div className={styles.blockBVisual}>
          <div className={styles.imgWrapRect}>
            <Image
              src="https://images.unsplash.com/photo-1605185189315-fc269c231e41?w=600&q=80&fit=crop"
              alt="Raccolta limoni Femminello"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className={styles.blockBContent}>
          <h3 className={styles.blockTitle}>
            Tre raccolti,<br />una stagionalità prolungata
          </h3>
          <p className={styles.blockLead}>La fioritura rifiorente del Femminello permette tre raccolte distinte durante l&apos;anno:</p>
          <ul className={`${styles.blockList} ${styles.blockListDesc}`}>
            <li><strong>Primofiore</strong> <em>(ottobre – gennaio)</em>: il primo raccolto, frutti più piccoli e profumati</li>
            <li><strong>Limoni invernali</strong> <em>(gennaio – marzo)</em>: la raccolta principale, frutti maturi e succosi</li>
            <li><strong>Verdelli</strong> <em>(maggio – giugno)</em>: la raccolta tardiva, frutti dalla buccia ancora verdognola, molto apprezzati in cucina</li>
          </ul>
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

      {/* ── USI CONSIGLIATI: 100px sx · testo · riquadro (bordo dx) ── */}
      <section className={styles.blockB}>
        <div className={styles.blockBContent}>
          <h3 className={styles.blockTitle}>Usi consigliati</h3>
          <p className={styles.blockLead}>I limoni Femminello sono ideali per:</p>
          <ul className={styles.blockList}>
            <li><strong>Spremitura</strong>: alta resa di succo limpido e aromatico</li>
            <li><strong>Pasticceria e dolci</strong>: scorza grattugiata per torte, biscotti, granite</li>
            <li><strong>Mixology</strong>: cocktail e long drinks che richiedono note aromatiche complesse</li>
            <li><strong>Cucina mediterranea</strong>: condimento di pesce, insalate, marinate</li>
            <li><strong>Conserve</strong>: marmellate di limone, limoncello, limoni sotto sale</li>
          </ul>
        </div>
        <div className={styles.blockBVisual}>
          <div className={styles.imgWrapRect}>
            <Image
              src="https://images.unsplash.com/photo-1717439062391-1c2932e1c051?w=600&q=80&fit=crop"
              alt="Usi del limone Femminello in cucina"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
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

      <Footer />
    </main>
  );
}
