'use client';

import { useEffect, useState } from 'react';
import styles from './CookieConsent.module.css';
import { OPEN_PREFERENCES_EVENT, getConsent, setConsent } from '@/lib/cookieConsent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [hadStoredConsent, setHadStoredConsent] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    setHadStoredConsent(existing !== null);
    if (existing === null) setVisible(true);

    const onOpenPreferences = () => setVisible(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpenPreferences);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpenPreferences);
  }, []);

  if (!visible) return null;

  const choose = (status: 'accepted' | 'rejected') => {
    setConsent(status);
    setHadStoredConsent(true);
    setVisible(false);
  };

  const close = () => {
    // Chiusura con X: per impostazione predefinita non attiva strumenti non necessari,
    // salvo che l'utente abbia gia' una scelta salvata (riapertura da "Gestisci preferenze").
    if (!hadStoredConsent) setConsent('rejected');
    setVisible(false);
  };

  return (
    <div className={styles.banner} role="dialog" aria-label="Preferenze cookie">
      <button className={styles.close} onClick={close} aria-label="Chiudi">
        &times;
      </button>
      <p className={styles.text}>
        Questo sito utilizza cookie tecnici necessari. Con il tuo consenso può utilizzare anche cookie
        analytics (Google Analytics) per capire come viene usato il sito. Puoi accettare o rifiutare;
        la chiusura mantiene attivi solo gli strumenti necessari.{' '}
        <a className={styles.link} href="/cookie-policy">Cookie Policy</a>
      </p>
      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.reject}`} onClick={() => choose('rejected')}>
          Rifiuta
        </button>
        <button className={`${styles.btn} ${styles.accept}`} onClick={() => choose('accepted')}>
          Accetta
        </button>
      </div>
    </div>
  );
}
