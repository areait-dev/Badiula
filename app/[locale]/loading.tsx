import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.wrap} role="status" aria-label="Caricamento">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
}
