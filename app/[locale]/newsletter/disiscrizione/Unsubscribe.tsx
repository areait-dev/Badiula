'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Status = 'idle' | 'sending' | 'done' | 'invalid' | 'error';

export default function Unsubscribe() {
  const t = useTranslations('newsletterUnsubscribe');
  const [status, setStatus] = useState<Status>('idle');

  async function unsubscribe() {
    // Il token si legge al clic: la pagina resta statica.
    const token = new URLSearchParams(window.location.search).get('token') ?? '';
    setStatus('sending');

    try {
      const res = await fetch(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, {
        method: 'POST',
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
            onClick={unsubscribe}
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
