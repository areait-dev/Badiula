'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS } from '@/lib/data';
import { splitTitle } from '@/lib/splitTitle';
import styles from './Productions.module.css';

gsap.registerPlugin(ScrollTrigger);

// Finché non ci sono foto coerenti per tutte le card, la zona immagine resta un riquadro tratteggiato.
// Portare a true quando le foto in lib/data.ts sono pronte.
const FOTO_COERENTI = false;

interface ProductionsProps {
  title?: string;
  subtitle?: string;
}

export default function Productions({ title = '', subtitle = '' }: ProductionsProps) {
  const t          = useTranslations('productions');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Anche su touch primario (iPad e simili, incluso landscape ≥1024px) va
    // usata la griglia fluida invece dello scroll-jacking orizzontale — non
    // solo sotto 1023px di larghezza.
    const isNarrow       = window.matchMedia('(max-width: 1023px)').matches;
    const isTouchPrimary = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reduce         = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isNarrow || isTouchPrimary) {
      if (reduce) return;
      const cards = wrapperRef.current?.querySelectorAll<HTMLElement>(`.${styles.card}`);
      if (!cards) return;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add(styles.fadeIn); io.unobserve(e.target); } }),
        { threshold: 0.1 },
      );
      cards.forEach((c, i) => {
        c.classList.add(styles.fadeReady);
        (c as HTMLElement).style.transitionDelay = `${i * 0.07}s`;
        io.observe(c);
      });
      return () => io.disconnect();
    }

    if (reduce) return;

    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      // Pausa di lettura a inizio/fine: il primo e l'ultimo 12% dello scroll
      // verticale non muovono il track, solo la fascia centrale interpola.
      const PAUSE_START = 0.12;
      const PAUSE_END   = 0.88;
      const remapProgress = (p: number) => {
        if (p <= PAUSE_START) return 0;
        if (p >= PAUSE_END) return 1;
        return (p - PAUSE_START) / (PAUSE_END - PAUSE_START);
      };

      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track, { x: -distance() * remapProgress(self.progress) });
        },
      });
    }, wrapper);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(timer);
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === wrapper)
        .forEach((st) => st.kill());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.trackWrap}>
        <div ref={trackRef} className={styles.track}>
          {PRODUCTS.map((p, i) => (
            <article key={p.slug} className={styles.card} data-index={i}>
              <div className={styles.img}>
                {FOTO_COERENTI ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 560px"
                    style={{ objectFit: 'cover' }}
                    draggable={false}
                  />
                ) : (
                  <div className={styles.imgPlaceholder} aria-hidden="true" />
                )}
              </div>
              <div className={styles.titleBox}>
                <h3>
                  {splitTitle(p.name).map((part, j) => (
                    <span key={j}>{part}<br /></span>
                  ))}
                </h3>
              </div>
              <div className={styles.descBox}>
                <p>{p.description}</p>
              </div>
              <Link className={styles.cta} href={`/coltivazioni/${p.slug}`}>
                <span>{t('more')}</span>
                <span className={styles.ctaArrow} aria-hidden>►</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
