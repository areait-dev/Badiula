'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './Footer.module.css';

export default function NewsletterForm() {
  const t = useTranslations('footer');
  const [sent, setSent] = useState(false);

  return (
    <div className={styles.newsletter}>
      <p className={styles.newsletterTitle}>{t('newsletterTitle')}</p>
      <form
        className={styles.newsletterForm}
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      >
        <input type="email" placeholder={t('email')} required disabled={sent} />
        <label className={styles.privacy}>
          <input type="checkbox" required disabled={sent} />
          {t.rich('newsletterPrivacy', {
            link: (chunks) => (
              <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                {chunks}
              </Link>
            ),
          })}
        </label>
        <button type="submit" className={`btn btn-outline-white ${styles.newsletterSubmit}`} disabled={sent}>
          {sent ? t('sent') : t('newsletterSubmit')}
        </button>
      </form>
    </div>
  );
}
