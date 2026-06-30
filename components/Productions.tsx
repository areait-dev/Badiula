'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS } from '@/lib/data';
import styles from './Productions.module.css';

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

interface ProductionsProps {
  title?: string;
  subtitle?: string;
}

export default function Productions({ title = '', subtitle = '' }: ProductionsProps) {
  const t          = useTranslations('productions');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || reduce) return;

    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

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
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 560px"
                  style={{ objectFit: 'cover' }}
                  draggable={false}
                />
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
