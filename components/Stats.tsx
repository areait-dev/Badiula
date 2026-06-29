'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATS } from '@/lib/data';
import styles from './Stats.module.css';

gsap.registerPlugin(ScrollTrigger);

const LABEL_KEYS = ['hectares', 'generations', 'organic'] as const;

export default function Stats() {
  const t = useTranslations('stats');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const valueEls = Array.from(
      root.querySelectorAll<HTMLElement>('[data-value]'),
    );

    if (reduce) {
      valueEls.forEach((el) => {
        const target = Number(el.dataset.value);
        el.textContent = `${target}${el.dataset.suffix ?? ''}`;
      });
      return;
    }

    const ctx = gsap.context(() => {
      valueEls.forEach((el) => {
        const target = Number(el.dataset.value);
        const suffix = el.dataset.suffix ?? '';
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.v)}${suffix}`;
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section}>
      <div ref={ref} className={styles.grid}>
        {STATS.map((s, i) => (
          <div key={s.label} className={styles.item}>
            <div
              className={styles.value}
              data-value={s.value}
              data-suffix={s.suffix}
            >
              0{s.suffix}
            </div>
            <div className={styles.label}>{t(LABEL_KEYS[i])}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
