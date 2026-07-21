import Footer from '@/components/Footer';
import styles from './LegalPage.module.css';

interface LegalPageProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main>
      <div className={styles.page}>
        <p className={styles.notice}>
          Documento in fase di completamento: alcuni dati di contatto (email privacy, PEC) sono ancora
          in attesa di conferma da parte del Titolare. Verranno aggiornati non appena disponibili.
        </p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>Ultimo aggiornamento: {updated}</p>
        <div className={styles.body}>{children}</div>
      </div>
      <Footer />
    </main>
  );
}
