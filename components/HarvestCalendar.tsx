import { useTranslations } from 'next-intl';
import styles from './HarvestCalendar.module.css';

interface Row {
  label: string;
  harvest: number[];
}

export default function HarvestCalendar({ rows }: { rows: Row[] }) {
  const t = useTranslations('calendar');
  const months = t.raw('months') as string[];

  return (
    <>
      <table className={styles.calendar}>
        <thead>
          <tr>
            <th className={styles.rowLabel}></th>
            {months.map((m) => (
              <th key={m}>{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className={styles.rowLabel}>{row.label}</td>
              {months.map((_, i) => {
                const active = row.harvest.includes(i + 1);
                return (
                  <td key={i}>
                    <span
                      className={`${styles.dot} ${active ? styles.active : ''}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.legend}>
        <span>
          <span className={`${styles.dot} ${styles.active}`} /> {t('inHarvest')}
        </span>
        <span>
          <span className={styles.dot} /> {t('rest')}
        </span>
      </div>
    </>
  );
}
