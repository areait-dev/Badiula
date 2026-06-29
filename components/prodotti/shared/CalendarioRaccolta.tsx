import styles from './CalendarioRaccolta.module.css';

const LABELS = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];

interface CalendarioRaccoltaProps {
  /** Mesi attivi espressi come indici 1–12 */
  activeMonths: number[];
}

export default function CalendarioRaccolta({ activeMonths }: CalendarioRaccoltaProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h3 className={styles.title}>CALENDARIO DI RACCOLTA</h3>

        <div className={styles.bar} role="list">
          {LABELS.map((label, i) => {
            const active = activeMonths.includes(i + 1);
            return (
              <div key={label} className={styles.col} role="listitem">
                <span className={styles.label}>{label}</span>
                <span
                  className={`${styles.dot} ${active ? '' : styles.dotOff}`}
                  aria-label={active ? 'In raccolta' : 'Riposo'}
                />
              </div>
            );
          })}
        </div>

        <div className={styles.legend} aria-label="Legenda calendario">
          <span>
            <span className={styles.dot} aria-hidden="true" />
            In raccolta
          </span>
          <span>
            <span className={`${styles.dot} ${styles.dotOff}`} aria-hidden="true" />
            Riposo
          </span>
        </div>
      </div>
    </section>
  );
}
