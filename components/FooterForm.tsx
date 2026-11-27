'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'invalid' | 'error';

export default function FooterForm({ formTitle }: { formTitle: string }) {
  const t = useTranslations('footer');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, privacy: data.privacy === 'on' }),
      });
      if (!res.ok) {
        setStatus(res.status === 400 ? 'invalid' : 'error');
        return;
      }
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={styles.right}>
      <h3 className={styles.formTitle}>{formTitle || 'Inviaci un messaggio'}</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="name"  type="text"  placeholder={t('name')}  maxLength={100} required />
        <input name="email" type="email" placeholder={t('email')} maxLength={200} required />
        <input name="phone" type="tel"   placeholder={t('phone')} maxLength={40} />
        <textarea name="message" placeholder={t('message')} maxLength={5000} required />
        {/* Honeypot anti-spam: fuori schermo, escluso da tastiera e screen reader */}
        <div className={styles.honeypot} aria-hidden="true">
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <label className={styles.privacy}>
          <input name="privacy" type="checkbox" required />
          {t('privacy')}
        </label>
        <button
          type="submit"
          className={`btn btn-outline-white ${styles.submit}`}
          disabled={status === 'sending' || status === 'sent'}
        >
          {status === 'sent' ? t('sent') : t('send')}
        </button>
        <p className={`body-2 ${styles.feedback}`} role="status">
          {status === 'sent' && t('success')}
          {status === 'invalid' && t('errorInvalid')}
          {status === 'error' && t('error')}
        </p>
      </form>
    </div>
  );
}
