'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import styles from './LeDueLinee.module.css';

/* ── Tipi ───────────────────────────────── */
type Idx = 0 | 1;

interface Product {
  image: string;
  imageAlt: string;
  leftCategory: string;
  leftTitle: string;
  leftLight: boolean; // true → testo bianco su sfondo scuro
  tag: string;
  title: string;
  description: string;
  details: { label: string; value: string }[];
  href: string;
}

/* ── Dati ───────────────────────────────── */
const PRODUCTS: [Product, Product] = [
  {
    image: '/images/luce-di-terra.jpg',
    imageAlt: 'Olio extravergine di oliva biologico Luce di Terra',
    leftCategory: 'Biologico · Sicilia orientale',
    leftTitle: 'OLIO EXTRAVERGINE DI OLIVA',
    leftLight: true,
    tag: 'Biologico',
    title: 'OLIO EXTRAVERGINE DI OLIVA',
    description:
      "L'olio nasce tra i nostri agrumeti e oliveti della Sicilia orientale, dove le olive vengono raccolte e lavorate per preservarne profumi, freschezza e identità territoriale.",
    details: [
      { label: 'Profumo', value: 'Erbaceo, fruttato verde' },
      { label: 'Sapore',  value: 'Amaro e piccante equilibrati' },
      { label: 'Raccolta', value: 'Ottobre – Novembre' },
    ],
    href: '/luce-di-terra/olio-evo',
  },
  {
    image: '/images/luce-di-terra-promo.png',
    imageAlt: 'Marmellate di agrumi biologici Badiula',
    leftCategory: 'Naturale · Agrumi IGP',
    leftTitle: 'MARMELLATE DI AGRUMI',
    leftLight: false,
    tag: 'Naturale',
    title: 'MARMELLATE DI AGRUMI',
    description:
      'Trasformano la freschezza delle nostre produzioni biologiche in sapori intensi e naturali, espressione della stagionalità e della tradizione mediterranea.',
    details: [
      { label: 'Aroma',   value: 'Agrumato, fresco, naturale' },
      { label: 'Sapore',  value: 'Dolce con note agrumate' },
      { label: 'Stagione', value: 'Inverno – Primavera' },
    ],
    href: '/luce-di-terra/marmellata-agrumi',
  },
];

/* ── Componente principale ──────────────── */
export default function LeDueLinee() {
  const [activeIdx, setActiveIdx] = useState<Idx>(0);

  // Refs per gli event handler (evitano stale closure)
  const activeRef      = useRef<Idx>(0);
  const isAnimatingRef = useRef(false);
  const ribbonLeftRef  = useRef<HTMLDivElement>(null);
  const ribbonRightRef = useRef<HTMLDivElement>(null);
  const sectionRef     = useRef<HTMLElement>(null);
  const touchStartY    = useRef(0);

  /* goTo: muove entrambi i nastri alla stessa posizione */
  const goTo = useCallback((idx: Idx) => {
    if (isAnimatingRef.current) return;
    if (activeRef.current === idx) return;

    isAnimatingRef.current = true;
    activeRef.current = idx;
    setActiveIdx(idx);

    const y = idx === 0 ? 'translateY(0%)' : 'translateY(-50%)';
    if (ribbonLeftRef.current)  ribbonLeftRef.current.style.transform  = y;
    if (ribbonRightRef.current) ribbonRightRef.current.style.transform = y;

    setTimeout(() => { isAnimatingRef.current = false; }, 600);
  }, []);

  /* Wheel event — desktop only */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onWheel = (e: WheelEvent) => {
      if (window.matchMedia('(max-width: 1023px)').matches) return;

      if (isAnimatingRef.current) { e.preventDefault(); return; }

      if (e.deltaY > 0 && activeRef.current === 0) {
        // Giù sull'olio → vai a marmellate
        e.preventDefault();
        goTo(1);
      } else if (e.deltaY < 0 && activeRef.current === 1) {
        // Su sulle marmellate → torna a olio
        e.preventDefault();
        goTo(0);
      }
      // Negli altri casi (giù su marmellate / su su olio) → scroll passa alla pagina
    };

    section.addEventListener('wheel', onWheel, { passive: false });
    return () => section.removeEventListener('wheel', onWheel);
  }, [goTo]);

  /* Touch events — mobile (swipe verticale) */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!window.matchMedia('(max-width: 1023px)').matches) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 40) return;
      if (deltaY > 0 && activeRef.current === 0) goTo(1);
      else if (deltaY < 0 && activeRef.current === 1) goTo(0);
    };

    section.addEventListener('touchstart', onTouchStart, { passive: true });
    section.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      section.removeEventListener('touchstart', onTouchStart);
      section.removeEventListener('touchend',   onTouchEnd);
    };
  }, [goTo]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Le due linee di prodotto Luce di Terra"
    >

      {/* ══════════ DESKTOP: layout a nastri ══════════ */}
      <div className={styles.desktopWrap} aria-hidden="false">

        {/* Colonna sinistra */}
        <div className={`${styles.col} ${styles.colLeft}`}>
          <div ref={ribbonLeftRef} className={styles.ribbon}>

            {/* Slide 0 — Olio */}
            <div className={`${styles.slide} ${styles.slideOlioLeft}`}>
              <div className={styles.imgWrap}>
                <Image
                  src={PRODUCTS[0].image}
                  alt={PRODUCTS[0].imageAlt}
                  fill
                  sizes="50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              <div className={`${styles.leftCaption} ${styles.captionLight}`}>
                <span className={styles.leftCategoryText}>{PRODUCTS[0].leftCategory}</span>
                <p className={styles.leftProductTitle}>{PRODUCTS[0].leftTitle}</p>
              </div>
            </div>

            {/* Slide 1 — Marmellate */}
            <div className={`${styles.slide} ${styles.slideMarmLeft}`}>
              <div className={styles.imgWrap}>
                <Image
                  src={PRODUCTS[1].image}
                  alt={PRODUCTS[1].imageAlt}
                  fill
                  sizes="50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={`${styles.leftCaption} ${styles.captionDark}`}>
                <span className={styles.leftCategoryText}>{PRODUCTS[1].leftCategory}</span>
                <p className={styles.leftProductTitle}>{PRODUCTS[1].leftTitle}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Colonna destra */}
        <div className={`${styles.col} ${styles.colRight}`}>
          <div ref={ribbonRightRef} className={styles.ribbon}>

            {/* Slide 0 — Olio */}
            <div className={`${styles.slide} ${styles.slideOlioRight}`}>
              <PanelContent p={PRODUCTS[0]} />
            </div>

            {/* Slide 1 — Marmellate */}
            <div className={`${styles.slide} ${styles.slideMarmRight}`}>
              <PanelContent p={PRODUCTS[1]} />
            </div>

          </div>
        </div>
      </div>

      {/* ══════════ MOBILE: stack verticale ══════════ */}
      <div className={styles.mobileWrap} aria-hidden="true">
        {PRODUCTS.map((p, i) => (
          <div key={i} className={styles.mobileProduct}>
            <div
              className={styles.mobileImgArea}
              style={{ background: i === 0 ? 'var(--teal)' : 'var(--vanilla)' } as React.CSSProperties}
            >
              <Image
                src={p.image}
                alt={p.imageAlt}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                priority={i === 0}
              />
              <div className={`${styles.leftCaption} ${p.leftLight ? styles.captionLight : styles.captionDark}`}>
                <span className={styles.leftCategoryText}>{p.leftCategory}</span>
                <p className={styles.leftProductTitle}>{p.leftTitle}</p>
              </div>
            </div>
            <div
              className={styles.mobileContent}
              style={{ background: i === 0 ? 'var(--color-surface)' : 'var(--color-surface-alt)' } as React.CSSProperties}
            >
              <PanelContent p={p} />
            </div>
          </div>
        ))}
      </div>

      {/* ══════════ DOT NAVIGATION ══════════ */}
      <div className={styles.dots} role="tablist" aria-label="Seleziona prodotto">
        {([0, 1] as Idx[]).map((i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activeIdx === i}
            aria-label={PRODUCTS[i].title}
            className={`${styles.dot} ${activeIdx === i ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

    </section>
  );
}

/* ── Contenuto pannello destro ──────────── */
function PanelContent({ p }: { p: Product }) {
  return (
    <div className={styles.panelInner}>

      {/* Tag categoria */}
      <span className={styles.tag}>{p.tag}</span>

      {/* Titolo H2 */}
      <h2 className={styles.title}>{p.title}</h2>

      {/* Descrizione in box bordato */}
      <div className={styles.descBox}>
        <p className={styles.desc}>{p.description}</p>
      </div>

      {/* Griglia dettagli 3 colonne */}
      <dl className={styles.detailGrid}>
        {p.details.map((d) => (
          <div key={d.label} className={styles.detailCell}>
            <dt className={styles.detailLabel}>{d.label}</dt>
            <dd className={styles.detailValue}>{d.value}</dd>
          </div>
        ))}
      </dl>

      {/* CTA outline icon ► */}
      <Link href={p.href} className={styles.cta}>
        <span className={styles.ctaInner}>Scopri di più</span>
        <span className={styles.ctaArrow} aria-hidden="true">►</span>
      </Link>

    </div>
  );
}
