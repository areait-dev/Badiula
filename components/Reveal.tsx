'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  /** Stagger between direct children, in seconds */
  stagger?: number;
  className?: string;
}

/**
 * Wraps a block of content and reveals its direct children with a
 * fadeIn + slideUp stagger when scrolled into view. Respects
 * prefers-reduced-motion (renders content statically in that case).
 */
export default function Reveal({
  children,
  stagger = 0.15,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const targets = Array.from(el.children) as HTMLElement[];

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
