'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './Territorio.module.css';

export default function Territorio() {
  const t = useTranslations('about');

  return (
    <div className={styles.panelInner}>
      <div className={styles.grid}>
        {/* Left column — Tra il mare e la terra */}
        <div className={styles.col}>
          <p className={`body-2 ${styles.eyebrow}`}>{t('p2.eyebrow')}</p>
          <h2 className={styles.heading}>{t('p2.heading')}</h2>
          <p className={styles.body}>{t('p2.body')}</p>
          <p className={styles.body}>{t('p2.body2')}</p>
        </div>

        {/* Center column — Sicily map */}
        <div className={styles.mapCol}>
          <Image
            src="/images/sicilia.png"
            alt="Sicilia"
            width={360}
            height={360}
            className={styles.map}
            style={{ height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Right column — Filiera e lavorazione */}
        <div className={styles.col}>
          <p className={`body-2 ${styles.eyebrow}`}>{t('p3.eyebrow')}</p>
          <h2 className={styles.heading}>{t('p3.heading')}</h2>
          <p className={styles.body}>{t('p3.body')}</p>
          <button className={`btn btn-outline ${styles.cta}`}>{t('cta')}</button>
        </div>
      </div>
    </div>
  );
}
