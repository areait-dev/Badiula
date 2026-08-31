'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './not-found.module.css';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  return (
    <main className={styles.wrap}>
      <p className={styles.eyebrow}>!</p>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={`body-1 ${styles.body}`}>{t('body')}</p>
      <div className={styles.actions}>
        <button className="btn btn-outline" onClick={() => reset()}>
          {t('retry')}
        </button>
        <Link className="btn btn-solid" href="/">
          {t('cta')}
        </Link>
      </div>
    </main>
  );
}
