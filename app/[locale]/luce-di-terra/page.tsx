import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Footer';
import ProductCardBadiula from '@/components/ProductCardBadiula';
import styles from './page.module.css';

export default function LuceDiTerraPage() {
  return (
    <main className={styles.main}>

      {/* ── INTRO ── */}
      <section className={styles.intro}>
        <div className={styles.introHero}>
          <h1 className={styles.h1}>LUCE DI TERRA</h1>
          <h2 className={styles.h2}>
            La firma Badiula dedicata all&apos;olio e ai sapori della terra
          </h2>
        </div>
        <div className={styles.introBody}>
          <p>
            Accanto agli agrumi biologici nasce Luce di Terra, la collezione Badiula
            dedicata all&apos;olio extravergine di oliva biologico e alle marmellate di
            agrumi siciliane. Una linea pensata per portare nel quotidiano i sapori
            autentici del nostro territorio, attraverso lavorazioni attente e materia
            prima coltivata direttamente nei nostri terreni della Sicilia orientale.
          </p>
          <p style={{ marginTop: '2em' }}>
            La filosofia è semplice: valorizzare la materia prima attraverso gesti lenti,
            rispetto della terra e processi produttivi rispettosi dell&apos;origine. Luce
            di Terra rappresenta l&apos;incontro tra tradizione agricola, sostenibilità e
            ricerca della qualità.
          </p>
        </div>
      </section>

      {/* ── LE DUE LINEE ── */}
      <section className={styles.linee}>
        <div className={styles.lineeContainer}>
          <h3 className={styles.lineeTitle}>LE DUE LINEE</h3>
          <div className={styles.cardGrid}>

            <ProductCardBadiula
              themeColor="bordeaux"
              category="Biologico · Sicilia orientale"
              title="Olio Extravergine di Oliva"
              description="Estratto a freddo entro 24 ore dalla raccolta, dai nostri uliveti di Carlentini. Fruttato, erbaceo, identità siciliana in ogni goccia."
              price="Da €12,00"
              image={{
                src: '/images/luce-di-terra.jpg',
                alt: 'Olio extravergine di oliva biologico Luce di Terra',
              }}
              href="/luce-di-terra/olio-evo"
            />

            <ProductCardBadiula
              themeColor="green"
              category="Naturale · Agrumi IGP"
              title="Marmellate di Agrumi"
              description="Solo frutta biologica, zucchero e cura artigianale. La stagionalità dei nostri agrumi trasformata in sapori intensi e naturali."
              price="Da €6,50"
              image={{
                src: '/images/luce-di-terra-promo.png',
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
          <h3 className={styles.filieraTitle}>Una filiera che parte dal campo</h3>
          <p className={`body-2 ${styles.filieraBody}`}>
            Tutto ciò che entra in Luce di Terra nasce nei nostri terreni di Carlentini
            e Lentini.
          </p>
          <p className={`body-2 ${styles.filieraBody}`}>
            Olive di varietà siciliane coltivate accanto agli agrumeti, agrumi biologici
            raccolti al giusto punto di maturazione e trasformati in marmellate.
          </p>
          <p className={`body-2 ${styles.filieraBody}`}>
            È il vantaggio di una filiera corta e integrata: dalla raccolta alla bottiglia
            o al vasetto, il prodotto percorre pochi chilometri e pochi giorni, preservando
            integrità e freschezza.
          </p>
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
