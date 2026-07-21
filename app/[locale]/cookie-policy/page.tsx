import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import LegalPage from '@/components/legal/LegalPage';
import styles from '@/components/legal/LegalPage.module.css';

export const metadata: Metadata = {
  title: 'Cookie Policy - Badiula',
  description: 'Informativa sull\'uso di cookie e strumenti similari sul sito Badiula.',
};

export default function CookiePolicyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <LegalPage title="Cookie Policy" updated="21/07/2026">
      <div className={styles.section}>
        <h3 className={styles.h3}>1. Cosa sono i cookie</h3>
        <p>
          I cookie sono piccoli file che il sito può memorizzare o leggere sul dispositivo dell&apos;utente,
          per riconoscerlo o ricordarne le preferenze durante la navigazione.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>2. Categorie di strumenti utilizzati su questo sito</h3>
        <ul>
          <li>Tecnici / strettamente necessari — funzionamento base del sito.</li>
          <li>Preferenze — memorizza la scelta di consenso cookie stessa.</li>
          <li>Analytics — Google Analytics 4, attivato solo dopo consenso esplicito.</li>
        </ul>
        <p>Il sito non utilizza cookie di marketing/profilazione né contenuti di terze parti (mappe, video, social embed, chat).</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>3. Elenco dei cookie utilizzati</h3>
        <table className={styles.table}>
          <thead>
            <tr><th>Nome</th><th>Fornitore</th><th>Categoria</th><th>Finalità</th><th>Durata</th><th>Attivazione</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>_ga</td>
              <td>Google LLC</td>
              <td>Analytics</td>
              <td>Distingue gli utenti unici</td>
              <td>2 anni</td>
              <td>Consenso</td>
            </tr>
            <tr>
              <td>_ga_VPN683YKJG</td>
              <td>Google LLC</td>
              <td>Analytics</td>
              <td>Persiste lo stato di sessione GA4</td>
              <td>2 anni</td>
              <td>Consenso</td>
            </tr>
            <tr>
              <td>badiula_cookie_consent</td>
              <td>Sito proprio (localStorage)</td>
              <td>Preferenze</td>
              <td>Registra la scelta di consenso dell&apos;utente</td>
              <td>~6 mesi</td>
              <td>Necessario</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>4. Gestione del consenso</h3>
        <p>
          Al primo accesso sono attivi solo gli strumenti tecnici. Google Analytics non viene caricato finché
          l&apos;utente non sceglie &laquo;Accetta&raquo; nel banner. La chiusura del banner tramite la ×
          equivale a un rifiuto. La scelta viene salvata e non viene richiesta nuovamente per circa 6 mesi.
        </p>
        <p>
          Puoi modificare la tua scelta in qualsiasi momento tramite il link &laquo;Gestisci preferenze
          cookie&raquo; nel footer del sito.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>5. Gestione tramite browser</h3>
        <p>
          Puoi inoltre gestire o cancellare i cookie tramite le impostazioni del tuo browser. La
          disattivazione dei cookie tecnici può compromettere alcune funzionalità del sito.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>6. Contatti</h3>
        <p>
          Per domande su questa Cookie Policy: <span className={styles.todo}>[e-mail da compilare]</span>.
          Vedi anche la <a href="/privacy-policy">Privacy Policy</a>.
        </p>
      </div>
    </LegalPage>
  );
}
