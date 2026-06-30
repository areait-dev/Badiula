'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './Territorio.module.css';

interface TerritorioProps {
  p2Eyebrow?: string;
  p2Heading?: string;
  p2Body?: string;
  p2Body2?: string;
  p3Eyebrow?: string;
  p3Heading?: string;
  p3Body?: string;
}

export default function Territorio({
  p2Eyebrow = '',
  p2Heading = '',
  p2Body = '',
  p2Body2 = '',
  p3Eyebrow = '',
  p3Heading = '',
  p3Body = '',
}: TerritorioProps) {
  const t = useTranslations('about');

  return (
    <div className={styles.panelInner}>
      <div className={styles.grid}>
        {/* Left column — Tra il mare e la terra */}
        <div className={styles.col}>
          <p className={`body-2 ${styles.eyebrow}`}>{p2Eyebrow}</p>
          <h2 className={styles.heading}>{p2Heading}</h2>
          <p className={styles.body}>{p2Body}</p>
          <p className={styles.body}>{p2Body2}</p>
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
          <p className={`body-2 ${styles.eyebrow}`}>{p3Eyebrow}</p>
          <h2 className={styles.heading}>{p3Heading}</h2>
          <p className={styles.body}>{p3Body}</p>
          <button className={`btn btn-outline ${styles.cta}`}>{t('cta')}</button>
        </div>
      </div>
    </div>
  );
}
