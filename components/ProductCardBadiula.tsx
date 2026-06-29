'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import styles from './ProductCardBadiula.module.css';

export interface ProductCardBadiulaProps {
  themeColor: 'bordeaux' | 'green';
  category?: string; // non renderizzata nel layout, mantenuta per retrocompatibilità
  title: string;
  description: string;
  price?: string;
  image: { src: string; alt: string };
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

      {/* Immagine — flex: 0 0 463px, uguale alla card homepage */}
      <div className={styles.imgWrap}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1220px) 50vw, 560px"
          className={styles.img}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Titolo — height 150px, margin-top 45px */}
      <div className={styles.titleBox}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {/* Descrizione — height 90px, margin-top 25px */}
      <div className={styles.descBox}>
        <p className={styles.description}>{description}</p>
      </div>

      {/* CTA — identico a Productions */}
      <Link href={href} className={styles.cta}>
        <span>Scopri di più</span>
        <span className={styles.ctaArrow} aria-hidden="true">►</span>
      </Link>

    </article>
  );
}
