'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Hero.module.css';

export default function Hero() {
  const t = useTranslations('hero');
  const bgRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const onScroll = () => {
      const offset = window.scrollY;
      if (bgRef.current && offset < window.innerHeight) {
        bgRef.current.style.transform = `translateY(${offset * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mounted]);

  return (
    <section className={styles.hero}>
      <div ref={bgRef} className={styles.bg}>
        {mounted && (
          <video
            className={styles.video}
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </div>
      <div className={styles.scrollHint}>
        <span className={styles.mouse}>
          <span className={styles.wheel} />
        </span>
        <span className={styles.scrollLabel}>{t('scroll')}</span>
      </div>
    </section>
  );
}
