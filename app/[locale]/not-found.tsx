import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './not-found.module.css';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className={styles.wrap}>
      <p className={styles.eyebrow}>404</p>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={`body-1 ${styles.body}`}>{t('body')}</p>
      <Link className="btn btn-outline" href="/">
        {t('cta')}
      </Link>
    </main>
  );
}
