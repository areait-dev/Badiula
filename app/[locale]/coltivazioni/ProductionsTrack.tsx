'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS } from '@/lib/data';
import styles from './page.module.css';

gsap.registerPlugin(ScrollTrigger);

const CONNECTORS = /^(di|del|della|dei|degli|delle|e|a|in|da|su|per|tra|fra)$/i;

function splitTitle(name: string): string[] {
  const words = name.split(' ');
  const parts: string[] = [];
  let i = 0;
  while (i < words.length) {
    if (CONNECTORS.test(words[i]) && i + 1 < words.length) {
      let chunk = words[i] + ' ' + words[i + 1];
      i += 2;
      while (i < words.length && /^[A-Z]+$/.test(words[i])) {
        chunk += ' ' + words[i];
        i++;
      }
      parts.push(chunk);
    } else {
      parts.push(words[i]);
      i++;
    }
  }
  return parts;
}

export default function ProductionsTrack({ title, moreLabel }: { title: string; moreLabel: string }) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);

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
      const sidePad = parseFloat(getComputedStyle(track).paddingRight) || 0;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + sidePad);

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

    const tid = setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      clearTimeout(tid);
      try { ctx.revert(); } catch (_) {}
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.griglia}>
      <div className={styles.gridHeader}>
        <h2 className={styles.gridTitle}>{title}</h2>
      </div>
      <div className={styles.trackWrap}>
        <div ref={trackRef} className={styles.track}>
          {PRODUCTS.map((p) => (
            <article key={p.slug} className={styles.card}>
              <div className={styles.img}>
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className={styles.titleBox}>
                <h3>
                  {splitTitle(p.name).map((part, i) => (
                    <span key={i}>{part}<br /></span>
                  ))}
                </h3>
              </div>

              <div className={styles.descBox}>
                <p>{p.description}</p>
              </div>

              <Link href={`/coltivazioni/${p.slug}`} className={styles.cta}>
                {moreLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
