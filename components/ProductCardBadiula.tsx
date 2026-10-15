'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { splitTitle } from '@/lib/splitTitle';
import styles from './ProductCardBadiula.module.css';

export interface ProductCardBadiulaProps {
  themeColor: 'bordeaux' | 'green';
  category?: string; // non renderizzata nel layout, mantenuta per retrocompatibilità
  title: string;
  description: string;
  price?: string;
  image?: { src: string; alt: string };
  href: string;
}

export default function ProductCardBadiula({
  themeColor,
  title,
  description,
  price,
  image,
  href,
}: ProductCardBadiulaProps) {
  return (
    <article className={`${styles.card} ${styles[themeColor]}`}>

      {/* Spazio foto sempre riservato: senza immagine resta un riquadro vuoto */}
      <div className={styles.imgWrap}>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1220px) 50vw, 560px"
            className={styles.img}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.imgPlaceholder} aria-hidden="true" />
        )}
      </div>

      {/* Titolo - height 150px, margin-top 45px */}
      <div className={styles.titleBox}>
        <h2 className={styles.title}>
          {splitTitle(title).map((part, i) => (
            <span key={i} className={styles.titleLine}>{part}</span>
          ))}
        </h2>
      </div>

      {/* Descrizione - height 90px, margin-top 25px */}
      <div className={styles.descBox}>
        <p className={styles.description}>{description}</p>
      </div>

      {/* CTA - identico a Productions */}
      <Link href={href} className={styles.cta}>
        <span>Scopri di più</span>
        <span className={styles.ctaArrow} aria-hidden="true">►</span>
      </Link>

    </article>
  );
}
