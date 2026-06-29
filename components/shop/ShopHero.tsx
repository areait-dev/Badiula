import styles from './ShopHero.module.css';

interface ShopHeroProps {
  total: number;
}

export default function ShopHero({ total }: ShopHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.col}>
          <h1 className={styles.h1}>
            IL GUSTO AUTENTICO<br />DELLA SICILIA
          </h1>
          <h3 className={styles.h3}>Direttamente dal produttore</h3>
          <p className={styles.body}>
            Lo shop online Badiula nasce dalla volontà di creare un rapporto diretto tra
            azienda agricola e consumatore finale.
          </p>
        </div>

        {/* Vertical divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Right column */}
        <div className={styles.col}>
          <h2 className={styles.h2}>LUCE DI TERRA</h2>
          <p className={styles.body}>
            La collezione firmata Badiula dedicata all&rsquo;olio extra vergine di oliva e alle
            produzioni che custodiscono l&rsquo;essenza più autentica della nostra terra.
          </p>
        </div>
      </div>

      {/* Footer row */}
      <div className={styles.footer}>
        <p className={`body-2 ${styles.count}`}>
          {String(total).padStart(2, '0')} prodotti disponibili
        </p>
      </div>
    </section>
  );
}
