'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './LuceDiTerra.module.css';

interface LuceDiTerraProps {
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string | null;
}

export default function LuceDiTerra({
  title = '',
  subtitle = '',
  body = '',
  image = null,
}: LuceDiTerraProps) {
  const t = useTranslations('luce');

  return (
    <section className={styles.section}>
      <div className={styles.imgSide}>
        <Image
          src={image ?? '/images/luce-di-terra.jpg'}
          alt="Luce di Terra — olio EVO e marmellate Badiula"
          fill
          style={{ objectFit: 'cover' }}
          sizes="50vw"
        />
      </div>
      <div className={styles.textSide}>
        <h2 className={styles.title}>{title}</h2>
        <p className={`body-2 ${styles.sub}`}>{subtitle}</p>
        <p className={styles.body}>{body}</p>
        <Link className={styles.cta} href="/luce-di-terra">
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
