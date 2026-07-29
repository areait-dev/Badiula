import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import LegalPage from '@/components/legal/LegalPage';
import styles from '@/components/legal/LegalPage.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy - Badiula',
  description: 'Informativa sul trattamento dei dati personali del sito Badiula.',
};

export default function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <LegalPage title="Privacy Policy" updated="29/07/2026">
      <div className={styles.section}>
        <h3 className={styles.h3}>1. Titolare del trattamento</h3>
        <p>
          Il Titolare del trattamento è <strong>Agriturismi Badiula Soc. Cons. A.r.l</strong>, P.IVA{' '}
          <strong>01796500898</strong>, con sede legale in C.da Badiula San Leonardo, 96013 Carlentini (SR).
          Puoi contattarci tramite il modulo presente in fondo al sito.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>2. Dati trattati e finalità</h3>
        <ul>
          <li>Dati di navigazione e log tecnici, gestiti dal fornitore hosting Vercel — sicurezza del sito.</li>
          <li>Dati forniti tramite il modulo di contatto (nome, e-mail, telefono, messaggio) — per rispondere alla richiesta.</li>
          <li>Dati di navigazione tramite Google Analytics, attivo solo previo consenso — vedi Cookie Policy.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>3. Destinatari e trasferimenti</h3>
        <p>
          I dati possono essere trattati da Vercel Inc. (hosting), WordPress (gestione contenuti) e Google LLC
          (Analytics, Search Console), anche fuori dallo Spazio Economico Europeo, sulla base delle Clausole
          Contrattuali Standard adottate dai rispettivi fornitori.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>4. Conservazione</h3>
        <p>I dati sono conservati per il tempo necessario alle finalità indicate e nel rispetto degli obblighi di legge.</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>5. Diritti dell&apos;interessato</h3>
        <p>
          Puoi esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione, limitazione,
          opposizione, portabilità e revoca del consenso previsti dal GDPR, tramite il modulo di contatto del
          sito. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali —{' '}
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>.
        </p>
      </div>
    </LegalPage>
  );
}
