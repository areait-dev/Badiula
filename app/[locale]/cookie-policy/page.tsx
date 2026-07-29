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
    <LegalPage title="Cookie Policy" updated="29/07/2026">
      <div className={styles.section}>
        <h3 className={styles.h3}>1. Cosa sono i cookie</h3>
        <p>
          I cookie sono piccoli file che il sito può memorizzare o leggere sul dispositivo dell&apos;utente,
          per riconoscerlo o ricordarne le preferenze durante la navigazione.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>2. Categorie utilizzate su questo sito</h3>
        <ul>
          <li>Tecnici / strettamente necessari — funzionamento base del sito, sempre attivi.</li>
          <li>Preferenze — memorizza la scelta di consenso cookie stessa.</li>
          <li>Analytics — Google Analytics, attivato solo dopo consenso esplicito.</li>
        </ul>
        <p>Il sito non utilizza cookie di marketing/profilazione né contenuti di terze parti (mappe, video, social embed, chat).</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>3. Gestione del consenso</h3>
        <p>
          Al primo accesso sono attivi solo gli strumenti tecnici. Google Analytics non viene caricato finché
          l&apos;utente non sceglie &laquo;Accetta&raquo; nel banner. La chiusura del banner tramite la ×
          equivale a un rifiuto. La scelta viene salvata e non viene richiesta nuovamente per circa 6 mesi.
          Puoi modificarla in qualsiasi momento tramite il link &laquo;Gestisci preferenze cookie&raquo; nel
          footer del sito.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.h3}>4. Gestione tramite browser</h3>
        <p>
          Puoi inoltre gestire o cancellare i cookie tramite le impostazioni del tuo browser. La
          disattivazione dei cookie tecnici può compromettere alcune funzionalità del sito. Vedi anche la{' '}
          <a href="/privacy-policy">Privacy Policy</a>.
        </p>
      </div>
    </LegalPage>
  );
}
