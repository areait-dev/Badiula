'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Territorio from '@/components/Territorio';
import { Link } from '@/i18n/routing';
import styles from './HorizontalScroll.module.css';

gsap.registerPlugin(ScrollTrigger);

// Su iPad Safari mostrare/nascondere la barra degli indirizzi durante lo swipe
// scatena un resize che ScrollTrigger interpreta come cambio di layout, ricalcola
// il pin a metà gesto e lo lascia "agganciato": lo scroll verticale non riprende
// dopo la prima sezione orizzontale. ignoreMobileResize evita quel ricalcolo.
ScrollTrigger.config({ ignoreMobileResize: true });

interface HorizontalScrollProps {
  p1Eyebrow?: string;
  p1Heading?: string;
  p1Body?: string;
  p1Cta?: string;
  p1Image?: string | null;
  p2Eyebrow?: string;
  p2Heading?: string;
  p2Body?: string;
  p2Body2?: string;
  p3Eyebrow?: string;
  p3Heading?: string;
  p3Body?: string;
}

export default function HorizontalScroll({
  p1Eyebrow = '',
  p1Heading = '',
  p1Body = '',
  p1Cta = '',
  p1Image = null,
  p2Eyebrow = '',
  p2Heading = '',
  p2Body = '',
  p2Body2 = '',
  p3Eyebrow = '',
  p3Heading = '',
  p3Body = '',
}: HorizontalScrollProps) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sotto 768px, oppure su qualunque dispositivo a input touch primario
    // (iPad e simili, anche in landscape ≥1024px): niente scroll orizzontale
    // pinnato, resta il flusso verticale a stack — stesso criterio usato per
    // lo shop (hover/pointer, non solo la larghezza: iPadOS non è rilevabile
    // in modo affidabile via user-agent).
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouchPrimary = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || isTouchPrimary || reduce) return;

    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      // offsetWidth è più affidabile di scrollWidth dentro overflow:hidden
      // sottrae il 50% vuoto dell'ultimo panel così lo scroll finisce sul video
      const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);

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

        {/* Panel 1 - Chi siamo */}
        <section className={`${styles.panel} ${styles.p1}`}>
          <div className={styles.half}>
            <p className={styles.eyebrow}>{p1Eyebrow}</p>
            <h1 className={styles.heading}>{p1Heading}</h1>
            <p className={styles.body}>{p1Body}</p>
            <Link href="/azienda" className={`btn btn-outline ${styles.cta}`}>{p1Cta}</Link>
          </div>
          <div className={styles.imgHalf}>
            {p1Image ? (
              <Image
                src={p1Image}
                alt={p1Heading}
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <video
                src="/videos/dsc_7756_web.mp4"
                autoPlay
                muted
                loop
                playsInline
                className={styles.greenImg}
              />
            )}
          </div>
        </section>

{/* Panel 2 - Territorio + Filiera */}
<section className={`${styles.panel} ${styles.territoryPanel}`}>
  <Territorio
    p2Eyebrow={p2Eyebrow}
    p2Heading={p2Heading}
    p2Body={p2Body}
    p2Body2={p2Body2}
    p3Eyebrow={p3Eyebrow}
    p3Heading={p3Heading}
    p3Body={p3Body}
    // Aggiungi qui le nuove props per il bottone
    p2CtaUrl="/filiera-e-lavorazione" 
    p2CtaText="Scopri la filiera"
  />
</section>

        {/* Panel 3 - Immagine aerea capannone */}
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
