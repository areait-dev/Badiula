'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Status = 'idle' | 'sending' | 'done' | 'invalid' | 'error';

export default function ConfirmNewsletter() {
  const t = useTranslations('newsletterConfirm');
  const [status, setStatus] = useState<Status>('idle');

  async function confirm() {
    // Il token si legge al clic: la pagina resta statica.
    const token = new URLSearchParams(window.location.search).get('token');
    setStatus('sending');

    try {
      const res = await fetch('/api/newsletter/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      setStatus(res.ok ? 'done' : res.status === 400 ? 'invalid' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      {status !== 'done' && status !== 'invalid' && (
        <>
          <p>{t('text')}</p>
          <button
            type="button"
            className="btn btn-solid"
            onClick={confirm}
            disabled={status === 'sending'}
          >
            {t('button')}
          </button>
        </>
      )}
      <p role="status">
        {status === 'done' && t('done')}
        {status === 'invalid' && t('invalid')}
        {status === 'error' && t('error')}
      </p>
    </>
  );
}
