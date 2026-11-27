'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './Footer.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'invalid' | 'limit' | 'error';

export default function NewsletterForm() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const locked = status === 'sending' || status === 'sent';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus('sending');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, privacy: data.privacy === 'on', locale }),
      });
      if (res.ok) setStatus('sent');
      else if (res.status === 400) setStatus('invalid');
      else if (res.status === 429) setStatus('limit');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={styles.newsletter}>
      <p className={styles.newsletterTitle}>{t('newsletterTitle')}</p>
      <form className={styles.newsletterForm} onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder={t('email')} maxLength={200} required disabled={locked} />
        {/* Honeypot anti-spam: fuori schermo, escluso da tastiera e screen reader */}
        <div className={styles.honeypot} aria-hidden="true">
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <label className={styles.privacy}>
          <input name="privacy" type="checkbox" required disabled={locked} />
          {t.rich('newsletterPrivacy', {
            link: (chunks) => (
              <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                {chunks}
              </Link>
            ),
          })}
        </label>
        <button type="submit" className={`btn btn-outline-white ${styles.newsletterSubmit}`} disabled={locked}>
          {status === 'sent' ? t('sent') : t('newsletterSubmit')}
        </button>
        <p className={`body-2 ${styles.feedback}`} role="status">
          {status === 'sent' && t('newsletterSuccess')}
          {status === 'invalid' && t('errorInvalid')}
          {status === 'limit' && t('errorLimit')}
          {status === 'error' && t('error')}
        </p>
      </form>
    </div>
  );
}
