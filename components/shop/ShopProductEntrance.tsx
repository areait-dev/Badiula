'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { peekShopTransition, clearShopTransition } from '@/lib/shopTransition';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip, useGSAP);
}

// Wrapper client della pagina prodotto: se si arriva dalla griglia (o da "Scopri anche")
// la foto grande parte dal rettangolo della card cliccata (Flip) e il resto sale dal basso.
// Nel caricamento diretto della pagina non anima nulla: nessun flash né CLS.
export default function ShopProductEntrance({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const transition = peekShopTransition(slug);
      if (!root || !transition) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const media = root.querySelector<HTMLElement>('[data-hero-media]');
        const items = gsap.utils.toArray<HTMLElement>('[data-hero-item]', root);

        if (media && transition.rect) {
          const r = transition.rect;
          const proxy = document.createElement('div');
          Object.assign(proxy.style, {
            position: 'fixed',
            left: `${r.left}px`,
            top: `${r.top}px`,
            width: `${r.width}px`,
            height: `${r.height}px`,
            visibility: 'hidden',
            pointerEvents: 'none',
          });
          document.body.appendChild(proxy);
          Flip.fit(media, proxy, { scale: true });
          proxy.remove();
          gsap.to(media, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.9,
            ease: 'expo.inOut',
            clearProps: 'transform',
          });
        } else if (media) {
          gsap.from(media, { y: 80, opacity: 0, duration: 0.9, ease: 'power3.out' });
        }

        gsap.from(items, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.35,
          clearProps: 'transform,opacity',
        });
      });

      // la registrazione resta valida per StrictMode (doppio mount in dev) e scade da sola
      const timer = window.setTimeout(clearShopTransition, 2500);
      return () => {
        window.clearTimeout(timer);
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [slug] }
  );

  return <div ref={rootRef}>{children}</div>;
}
