'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './LuceDiTerra.module.css';

export default function LuceDiTerra() {
  const t = useTranslations('luce');
  return (
    <section className={styles.section}>
      <div className={styles.imgSide}>
        <Image
          src="/images/luce-di-terra.jpg"
          alt="Luce di Terra — olio EVO e marmellate Badiula"
          fill
          style={{ objectFit: 'cover' }}
          sizes="50vw"
        />
      </div>
      <div className={styles.textSide}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={`body-2 ${styles.sub}`}>{t('subtitle')}</p>
        <p className={styles.body}>{t('body')}</p>
        <Link className={styles.cta} href="/luce-di-terra">
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
