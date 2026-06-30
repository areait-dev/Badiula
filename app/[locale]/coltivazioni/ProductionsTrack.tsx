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

export default function ProductionsTrack({ moreLabel }: { moreLabel: string }) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isNarrow = window.matchMedia('(max-width: 1023px)').matches;
    const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isNarrow) {
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
      const sidePad = parseFloat(getComputedStyle(wrapper).paddingRight) || 0;
      const distance = () => track.scrollWidth - wrapper.clientWidth + sidePad * 2;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
      });

      ScrollTrigger.create({
        trigger: wrapper,
        start: 'bottom bottom',
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

    const tid = setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      clearTimeout(tid);
      try { ctx.revert(); } catch (_) {}
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.griglia}>
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
      <div ref={progressRef} className={styles.progress} />
    </div>
  );
}
