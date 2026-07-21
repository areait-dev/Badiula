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
    <LegalPage title="Privacy Policy" updated="21/07/2026">
      <div className={styles.section}>
        <h3 className={styles.h3}>1. Titolare del trattamento</h3>
        <p>
          Il Titolare del trattamento è <strong>Agriturismi Badiula Soc. Cons. A.r.l</strong>, P.IVA{' '}
          <strong>01796500898</strong>, con sede legale in C.da Badiula San Leonardo, 96013 Carlentini (SR).
        </p>
        <p>
          Recapiti: e-mail <span className={styles.todo}>[da compilare]</span>; PEC{' '}
          <span className={styles.todo}>[da compilare]</span>; sito web{' '}
          <a href="https://agribadiula.it">https://agribadiula.it</a>.
        </p>
        <p>Il Responsabile della Protezione dei Dati (DPO/RPD) non è stato nominato.</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>2. Ambito della presente informativa</h3>
        <p>
          La presente informativa descrive il trattamento dei dati personali effettuato attraverso il sito{' '}
          <a href="https://agribadiula.it">agribadiula.it</a>, tramite: consultazione del catalogo prodotti,
          modulo di contatto in footer, statistiche di navigazione tramite Google Analytics (attivo solo
          previo consenso) e monitoraggio dell&apos;indicizzazione tramite Google Search Console.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>3. Tipologie di dati trattati</h3>
        <ul>
          <li>Dati di navigazione e log tecnici (indirizzo IP, browser, data e ora di accesso), gestiti dal fornitore hosting Vercel.</li>
          <li>Dati forniti volontariamente tramite il modulo di contatto del footer (nome, e-mail, telefono, messaggio).</li>
          <li>Dati raccolti tramite cookie e strumenti di analytics, come descritto nella Cookie Policy.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>4. Finalità e basi giuridiche</h3>
        <table className={styles.table}>
          <thead>
            <tr><th>Finalità</th><th>Base giuridica</th></tr>
          </thead>
          <tbody>
            <tr><td>Navigazione e sicurezza del sito</td><td>Legittimo interesse alla sicurezza; art. 122 Codice Privacy per l&apos;accesso al terminale</td></tr>
            <tr><td>Gestione richieste dal modulo di contatto</td><td>Misure precontrattuali richieste dall&apos;interessato / legittimo interesse</td></tr>
            <tr><td>Statistiche di utilizzo (Google Analytics)</td><td>Consenso preventivo tramite banner cookie</td></tr>
            <tr><td>Obblighi di legge</td><td>Obbligo legale</td></tr>
            <tr><td>Tutela dei diritti del Titolare</td><td>Legittimo interesse</td></tr>
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>5. Modulo di contatto</h3>
        <p>
          Il conferimento dei dati nel modulo di contatto (footer) è necessario per ricevere una risposta.
          Campi obbligatori: nome, e-mail, messaggio, presa visione della presente informativa.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>6. Destinatari e responsabili del trattamento</h3>
        <ul>
          <li><strong>Vercel Inc.</strong> — fornitore hosting</li>
          <li><strong>WordPress</strong> (backend headless) — gestione contenuti del sito</li>
          <li><strong>Google LLC</strong> — Google Analytics e Google Search Console</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>7. Trasferimenti verso Paesi terzi</h3>
        <p>
          I dati possono essere trasferiti fuori dallo Spazio Economico Europeo tramite i servizi Google e
          Vercel, sulla base delle Clausole Contrattuali Standard adottate dai rispettivi fornitori.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>8. Tempi di conservazione</h3>
        <p>
          I dati sono conservati per il tempo necessario alle finalità indicate.{' '}
          <span className={styles.todo}>Periodi esatti in fase di definizione da parte del Titolare.</span>
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>9. Diritti dell&apos;interessato</h3>
        <p>
          L&apos;interessato può esercitare i diritti di accesso, rettifica, cancellazione, limitazione,
          opposizione, portabilità e revoca del consenso previsti dal GDPR, scrivendo a{' '}
          <span className={styles.todo}>[e-mail da compilare]</span>. Può inoltre proporre reclamo al
          Garante per la protezione dei dati personali — <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>.
        </p>
      </div>
    </LegalPage>
  );
}
