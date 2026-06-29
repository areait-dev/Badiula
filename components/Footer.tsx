'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Logo from '@/components/Logo';
import BannerPNRR from '@/components/BannerPNRR';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const [sent, setSent] = useState(false);

  return (
    <footer className={styles.footer} id="contatti">
      <div className={styles.grid}>
        <div className={styles.left}>
          <p className={styles.quote}>
            Non produciamo<br/>
            semplicemente agrumi,<br/>
            coltiviamo un modo<br/>
            diverso di vivere la terra
          </p>
          <div className={styles.logo}><Logo size={44} light /></div>
          <p className={`body-2 ${styles.info}`}>
            Agriturismi Badiula Soc. Cons. A.r.l
            <br />
            Partita IVA: 01796500898
            <br />
            C.da Badiula San Leonardo
            <br />
            96013 Carlentini (SR)
          </p>
          <div className={styles.social}>
            <a href="https://facebook.com/badiula" aria-label="Seguici su Facebook" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" focusable="false" width={32} height={32}><use href="/social-icons.svg#icon-facebook" /></svg>
            </a>
            <a href="https://linkedin.com/company/badiula" aria-label="Seguici su LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" focusable="false" width={32} height={32}><use href="/social-icons.svg#icon-linkedin" /></svg>
            </a>
            <a href="https://instagram.com/badiula" aria-label="Seguici su Instagram" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" focusable="false" width={32} height={32}><use href="/social-icons.svg#icon-instagram" /></svg>
            </a>
            <a href="https://wa.me/390950000000" aria-label="Seguici su WhatsApp" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" focusable="false" width={32} height={32}><use href="/social-icons.svg#icon-whatsapp" /></svg>
            </a>
          </div>
          <BannerPNRR />
        </div>

        <div className={styles.right}>
          <h3 className={styles.formTitle}>Inviaci un messaggio</h3>
          <form
            className={styles.form}
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            <input type="text"  placeholder={t('name')}  required />
            <input type="email" placeholder={t('email')} required />
            <input type="tel"   placeholder={t('phone')} />
            <textarea placeholder={t('message')} required />
            <label className={styles.privacy}>
              <input type="checkbox" required />
              {t('privacy')}
            </label>
            <button type="submit" className={`btn btn-outline-white ${styles.submit}`}>
              {sent ? t('sent') : t('send')}
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
