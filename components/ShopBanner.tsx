'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import styles from './ShopBanner.module.css';

export default function ShopBanner() {
  const t = useTranslations('shop');
  return (
    <section className={styles.banner}>
      <div className={styles.yellowArea}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/luce-di-terra-promo.png"
          alt="Luce di Terra – olio e agrumi siciliani"
          className={styles.promoImg}
        />
      </div>
      <div className={styles.overlay}>
        <div className={styles.text}>
          <h2 style={{ whiteSpace: 'pre-line' }}>{t('title')}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{t('subtitle')}</p>
        </div>
        <button className="btn btn-outline-white">{t('cta')}</button>
      </div>
    </section>
  );
}
