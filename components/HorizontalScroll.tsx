'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Territorio from '@/components/Territorio';
import styles from './HorizontalScroll.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll() {
  const t           = useTranslations('about');
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || reduce) return;

    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      // offsetWidth è più affidabile di scrollWidth dentro overflow:hidden
      // sottrae il 50% vuoto dell'ultimo panel così lo scroll finisce sul video
      const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
      });

      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      });
    }, wrapper);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(t2);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={trackRef} className={styles.track}>

        {/* Panel 1 — Chi siamo */}
        <section className={`${styles.panel} ${styles.p1}`}>
          <div className={styles.half}>
            <p className={styles.eyebrow}>{t('p1.eyebrow')}</p>
            <h2 className={styles.heading}>{t('p1.heading')}</h2>
            <p className={styles.body}>
              Badiula è un&apos;azienda agricola biologica situata a Carlentini, in provincia di Siracusa, e si estende su oltre 120 ettari nel cuore della Sicilia orientale.
            </p>
            <a href="/" className={`btn btn-outline ${styles.cta}`}>{t('p1.cta')}</a>
          </div>
          <div className={styles.imgHalf}>
            <Image
              src="/images/DSC_7619.jpg"
              alt="Quattro generazioni, una terra — Badiula"
              fill
              className={styles.greenImg}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </section>

        {/* Panel 2 — Territorio + Filiera */}
        <section className={`${styles.panel} ${styles.territoryPanel}`}>
          <Territorio />
        </section>

        {/* Panel 3 — Immagine aerea capannone */}
        <section className={`${styles.panel} ${styles.greenPanel}`}>
          <div className={styles.imgHalf}>
            <Image
              src="/images/sostenibilita.jpg"
              alt="Sostenibilità Badiula"
              fill
              className={styles.greenImg}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </section>

      </div>
      <div ref={progressRef} className={styles.progress} />
    </div>
  );
}
