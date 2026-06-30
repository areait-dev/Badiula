'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export default function FooterForm({ formTitle }: { formTitle: string }) {
  const t = useTranslations('footer');
  const [sent, setSent] = useState(false);

  return (
    <div className={styles.right}>
      <h3 className={styles.formTitle}>{formTitle || 'Inviaci un messaggio'}</h3>
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
  );
}
