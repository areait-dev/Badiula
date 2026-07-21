'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@/i18n/routing';
import type { Prodotto } from '@/lib/mock/prodotti';
import styles from './ShopSlider.module.css';

gsap.registerPlugin(ScrollTrigger);

interface ShopSliderProps {
  prodotti: Prodotto[];
}

// Lower-third squares: fixed Badiula palette, rotated per product index (not tied to coloreSfondo)
const SQUARE_COLORS = ['var(--khaki)', 'var(--vanilla)', 'var(--teal)'];
// Contrast-safe text color per square background — vanilla/khaki are light, teal is dark
const SQUARE_TEXT_COLOR: Record<string, string> = {
  'var(--khaki)':   'var(--white)',
  'var(--vanilla)': 'var(--bordeaux)',
  'var(--teal)':    'var(--white)',
};

function formatPrice(n: number) {
  return `€${n.toFixed(2).replace('.', ',')}`;
}

// ── Mobile card ───────────────────────────────────────────────────

const BG_CLASS: Record<Prodotto['coloreSfondo'], 'bgTeal' | 'bgVanilla' | 'bgKhaki'> = {
  teal:    'bgTeal',
  vanilla: 'bgVanilla',
  khaki:   'bgKhaki',
};

function MobileCard({
  prodotto: p,
  index,
  total,
}: {
  prodotto: Prodotto;
  index: number;
  total: number;
}) {
  const [variantIdx, setVariantIdx] = useState(0);
  return (
    <article className={`${styles.mobileCard} ${styles[BG_CLASS[p.coloreSfondo]]}`}>
      <div className={styles.mobileImg}>
        <Image
          src={p.cutoutImage ?? p.immagine}
          alt={p.nome}
          fill
          sizes="100vw"
          style={{ objectFit: p.cutoutImage ? 'contain' : 'cover' }}
        />
      </div>
      <div className={styles.mobileBody}>
        {p.badge && <span className={styles.badge}>{p.badge}</span>}
        <p className={styles.counter}>
          {String(index + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
        </p>
        <h2 className={styles.prodTitle}>{p.nome}</h2>
        <h3 className={styles.prodSubtitle}>{p.sottotitolo}</h3>
        <p className={styles.prodDesc}>{p.descrizioneBreve}</p>
        <select
          className={styles.variantSelect}
          value={variantIdx}
          onChange={(e) => setVariantIdx(Number(e.target.value))}
          aria-label="Seleziona formato"
        >
          {p.varianti.map((v, i) => (
            <option key={i} value={i}>{v.etichetta}</option>
          ))}
        </select>
        <p className={styles.price}>{formatPrice(p.varianti[variantIdx]?.prezzo ?? 0)}</p>
        <div className={styles.ctaRow}>
          <button className={styles.btnSolid} disabled={p.stock === 0}>
            Acquista ora &#9658;
          </button>
          <Link href={p.slugPagina} className={styles.btnOutline}>
            Scopri di più &#9658;
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Desktop slider ────────────────────────────────────────────────

export default function ShopSlider({ prodotti }: ShopSliderProps) {
  const total = prodotti.length;

  const [current, setCurrent] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0);

  // Reset variant on product change
  useEffect(() => { setVariantIdx(0); }, [current]);

  // Refs
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const sectionRef      = useRef<HTMLElement>(null);
  const leftPanelsRef   = useRef<(HTMLDivElement | null)[]>([]);
  const rightPanelsRef  = useRef<(HTMLDivElement | null)[]>([]);
  const sliderLeftRef   = useRef<HTMLDivElement>(null);
  const cutoutRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const cutoutFloatRefs  = useRef<(HTMLDivElement | null)[]>([]); // continuous float + drop-shadow (GSAP)
  const cutoutRotateRefs = useRef<(HTMLDivElement | null)[]>([]); // mouse-parallax 3D tilt (GSAP)
  const titleRefs        = useRef<(HTMLHeadingElement | null)[]>([]); // per-word stagger reveal
  const badgeRef         = useRef<HTMLSpanElement>(null); // pulse on product change
  const priceRef        = useRef<HTMLParagraphElement>(null);
  const currentIdxRef   = useRef(0);
  const isAnimating     = useRef(false);
  const goToRef         = useRef<((to: number) => void) | null>(null);

  // Keep currentIdxRef in sync
  useEffect(() => { currentIdxRef.current = current; }, [current]);

  // Main GSAP setup
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    // Hide all panels except index 0
    prodotti.forEach((_, i) => {
      if (i === 0) return;
      const lp = leftPanelsRef.current[i];
      const rp = rightPanelsRef.current[i];
      const cu = cutoutRefs.current[i];
      if (lp) gsap.set(lp, { yPercent: 100 });
      if (rp) gsap.set(rp, { yPercent: 100 });
      if (cu) gsap.set(cu, { y: window.innerHeight, opacity: 0 });
    });

    const goTo = (to: number) => {
      const from = currentIdxRef.current;
      if (isAnimating.current || to === from || to < 0 || to >= total) return;

      isAnimating.current = true;
      currentIdxRef.current = to;

      const curL = leftPanelsRef.current[from];
      const curR = rightPanelsRef.current[from];
      const nxtL = leftPanelsRef.current[to];
      const nxtR = rightPanelsRef.current[to];
      const curCutout = cutoutRefs.current[from];
      const nxtCutout = cutoutRefs.current[to];

      if (!curL || !curR || !nxtL || !nxtR) {
        isAnimating.current = false;
        return;
      }

      const direction = to > from ? 1 : -1;

      // Panels + text: instant swap
      gsap.set(curL, { yPercent: -100 });
      gsap.set(curR, { yPercent: -100 });
      gsap.set(nxtL, { yPercent: 0 });
      gsap.set(nxtR, { yPercent: 0 });
      setCurrent(to);

      // Cutout: scale + full-viewport translate + fade.
      // NOTE: previously used GSAP Flip here with `absolute: true`. Flip writes
      // hardcoded inline position/left/top/width/height (computed in px at
      // transition time) onto the element, which permanently overrides the CSS
      // centering (left:50%; margin-left:-210px) on .cutoutWrap — that's why the
      // first product's image got stuck pinned at a stale pixel offset instead
      // of staying centered. Flip added no real value here anyway (the box never
      // changes position/size, only visibility), so back to plain tweens that
      // only ever touch transform/opacity.
      // cubic-bezier(0.77,0,0.175,1) requires GSAP's CustomEase plugin;
      // 'power4.inOut' is the closest built-in approximation of that quint curve.
      const vh = window.innerHeight;
      if (curCutout) {
        gsap.set(curCutout, { y: 0, scale: 1, opacity: 1 });
        gsap.to(curCutout, {
          y: direction * -vh,
          scale: 1.1,
          opacity: 0,
          duration: 0.8,
          ease: 'power4.inOut',
        });
      }
      if (nxtCutout) {
        gsap.set(nxtCutout, { y: direction * vh, scale: 1, opacity: 0 });
        gsap.to(nxtCutout, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power4.inOut',
        });
      }

      setTimeout(() => { isAnimating.current = false; }, 800);
    };

    // Expose goTo so React button handlers can call it
    goToRef.current = goTo;

    // Pin the section inside the tall wrapper via ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${(total - 1) * window.innerHeight}`,
      pin: section,
      pinSpacing: false,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Map scroll progress to product index
        const idx = Math.round(self.progress * (total - 1));
        const cur = currentIdxRef.current;
        if (idx !== cur && !isAnimating.current) {
          goTo(idx);
        }
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(section.querySelectorAll('*'));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  // Continuous float + dynamic drop-shadow on every cutout image (independent of scroll-jacking)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const floats = cutoutFloatRefs.current.filter(Boolean) as HTMLDivElement[];
    const tweens = floats.map((el) =>
      gsap.to(el, {
        keyframes: {
          y: [-20, 0, -20],
          filter: [
            'drop-shadow(0px 10px 8px rgba(108,18,36,0.15))',
            'drop-shadow(0px 30px 20px rgba(108,18,36,0.25))',
            'drop-shadow(0px 10px 8px rgba(108,18,36,0.15))',
          ],
        },
        duration: 3,
        repeat: -1,
        ease: 'sine.inOut',
      })
    );

    return () => { tweens.forEach((t) => t.kill()); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  // Mouse-parallax 3D tilt on the left panel — affects only the currently active cutout
  useEffect(() => {
    const panel = sliderLeftRef.current;
    if (!panel) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMove = (e: MouseEvent) => {
      const target = cutoutRotateRefs.current[currentIdxRef.current];
      if (!target) return;
      const rect = panel.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      gsap.to(target, {
        rotateX: mouseY * 0.02,
        rotateY: mouseX * 0.02,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      const target = cutoutRotateRefs.current[currentIdxRef.current];
      if (!target) return;
      gsap.to(target, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
    };

    panel.addEventListener('mousemove', handleMove);
    panel.addEventListener('mouseleave', handleLeave);
    return () => {
      panel.removeEventListener('mousemove', handleMove);
      panel.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // Title word-stagger reveal + price counter + badge pulse, fired whenever the
  // active product changes (mount included, since `current` starts at 0).
  useEffect(() => {
    const titleEl = titleRefs.current[current];
    if (titleEl) {
      const words = gsap.utils.toArray<HTMLElement>(titleEl.querySelectorAll(`.${styles.word}`));
      gsap.fromTo(
        words,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }

    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1 },
        {
          keyframes: {
            scale: [1, 1.18, 1],
            boxShadow: [
              '0 0 0px rgba(108,18,36,0)',
              '0 0 14px rgba(108,18,36,0.55)',
              '0 0 0px rgba(108,18,36,0)',
            ],
          },
          duration: 0.6,
          ease: 'power1.inOut',
          transformOrigin: 'center center',
        }
      );
    }

    // Reads variante[0] directly (not variantIdx state): the sibling effect that
    // resets variantIdx to 0 on product change hasn't necessarily committed yet.
    const target = prodotti[current]?.varianti[0]?.prezzo ?? 0;
    const counter = { value: 0 };
    const priceTween = gsap.to(counter, {
      value: target,
      duration: 0.8,
      ease: 'power1.out',
      onUpdate: () => {
        if (priceRef.current) priceRef.current.textContent = formatPrice(counter.value);
      },
    });

    return () => { priceTween.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Animated price swap on variant change
  const handleVariantChange = (newIdx: number) => {
    if (!priceRef.current) { setVariantIdx(newIdx); return; }
    gsap.to(priceRef.current, {
      opacity: 0, y: -8, duration: 0.15,
      onComplete: () => {
        setVariantIdx(newIdx);
        gsap.to(priceRef.current, { opacity: 1, y: 0, duration: 0.15 });
      },
    });
  };

  return (
    <>
      {/* ── Desktop ── */}
      <div ref={wrapperRef} className={styles.sliderWrapper} style={{ height: `${total * 100}vh` }}>
      <section
        ref={sectionRef}
        className={styles.slider}
        role="region"
        aria-label="Shop prodotti"
      >
        {/* Left column */}
        <div ref={sliderLeftRef} className={styles.sliderLeft}>
          {/* Background panels (slide with yPercent ±100) */}
          {prodotti.map((p, i) => {
            const squareColors = [0, 1, 2].map((c) => SQUARE_COLORS[(c + i) % 3]);
            return (
              <div
                key={p.id}
                ref={(el) => { leftPanelsRef.current[i] = el; }}
                className={styles.leftPanel}
              >
                {/* Upper 2/3 — white, hosts the cutout/hero image */}
                <div className={styles.leftTop}>
                  {/* Cover image fallback for products without a cutout PNG */}
                  {!p.cutoutImage && (
                    <div className={styles.heroImgWrap}>
                      <Image
                        src={p.immagine}
                        alt={p.nome}
                        fill
                        sizes="50vw"
                        style={{ objectFit: 'cover' }}
                        priority={i === 0}
                      />
                    </div>
                  )}
                </div>

                {/* Lower 1/3 — three Badiula-palette squares, rotating per product */}
                <div className={styles.leftBottom}>
                  {squareColors.map((color, colIdx) => (
                    <div
                      key={colIdx}
                      className={styles.colorSquare}
                      style={{ background: color }}
                    >
                      {colIdx === 1 && (
                        <span
                          className={styles.squareNumber}
                          style={{ color: SQUARE_TEXT_COLOR[color] }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Cutout images - siblings of panels, animate independently */}
          {prodotti.map((p, i) =>
            p.cutoutImage ? (
              <div
                key={`cutout-${p.id}`}
                ref={(el) => { cutoutRefs.current[i] = el; }}
                className={styles.cutoutWrap}
              >
                <div
                  ref={(el) => { cutoutFloatRefs.current[i] = el; }}
                  className={styles.cutoutFloat}
                >
                  <div
                    ref={(el) => { cutoutRotateRefs.current[i] = el; }}
                    className={styles.cutoutRotate}
                  >
                    <div className={styles.cutoutInner}>
                      <Image
                        src={p.cutoutImage}
                        alt={p.nome}
                        fill
                        sizes="420px"
                        style={{ objectFit: 'contain', objectPosition: 'center center' }}
                        priority={i === 0}
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>

        {/* Right column */}
        <div className={styles.sliderRight}>
          {prodotti.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => { rightPanelsRef.current[i] = el; }}
              className={styles.rightPanel}
            >
              <div className={styles.rightInner}>
                {/* Counter */}
                <p className={styles.counter}>
                  {String(i + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
                </p>

                {/* Badge */}
                {p.badge && (
                  <span
                    ref={i === current ? badgeRef : undefined}
                    className={styles.badge}
                  >
                    {p.badge}
                  </span>
                )}

                {/* Title - split into words for GSAP stagger reveal */}
                <h2
                  ref={(el) => { titleRefs.current[i] = el; }}
                  className={styles.prodTitle}
                >
                  {p.nome.split(' ').map((word, wi, words) => (
                    <span key={wi}>
                      <span className={styles.word}>{word}</span>
                      {wi < words.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </h2>

                {/* Subtitle */}
                <h3 className={styles.prodSubtitle}>{p.sottotitolo}</h3>

                {/* Description */}
                <p className={styles.prodDesc}>{p.descrizioneBreve}</p>

                {/* Details */}
                <div className={styles.details}>
                  {[
                    { label: 'Origine',  value: 'Sicilia, IT' },
                    { label: 'Metodo',   value: 'Biologico' },
                    { label: 'Raccolta', value: 'Stagionale' },
                  ].map((d) => (
                    <div key={d.label} className={styles.detailCol}>
                      <span className={styles.detailLabel}>{d.label}</span>
                      <span className={styles.detailValue}>{d.value}</span>
                    </div>
                  ))}
                </div>

                {/* Variant + price + CTAs - only active panel gets live state */}
                <select
                  className={styles.variantSelect}
                  value={i === current ? variantIdx : 0}
                  onChange={(e) => {
                    if (i === current) handleVariantChange(Number(e.target.value));
                  }}
                  aria-label="Seleziona formato"
                >
                  {p.varianti.map((v, vi) => (
                    <option key={vi} value={vi}>{v.etichetta}</option>
                  ))}
                </select>

                <div className={styles.priceCtaRow}>
                  <p
                    ref={i === current ? priceRef : undefined}
                    className={styles.price}
                  >
                    {formatPrice(p.varianti[i === current ? variantIdx : 0]?.prezzo ?? 0)}
                  </p>
                  <button className={styles.btnSolid} disabled={p.stock === 0}>
                    Aggiungi al carrello&nbsp;&#9658;
                  </button>
                </div>

                <Link href={p.slugPagina} className={styles.btnOutline}>
                  Scopri di più&nbsp;&#9658;
                </Link>

                {/* Next hint */}
                {i < total - 1 && (
                  <div className={styles.nextHint}>
                    <span className={styles.nextLine} />
                    <span className={styles.nextLabel}>
                      {prodotti[i + 1].nome.toUpperCase()}&nbsp;→
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress rail — replaces the old dot nav; arrows only reveal on hover */}
        <div className={styles.progressRail} aria-label="Naviga prodotti">
          <button
            className={styles.progressArrow}
            onClick={() => goToRef.current?.(current - 1)}
            disabled={current === 0}
            aria-label="Prodotto precedente"
          >
            ▲
          </button>

          <span className={styles.progressNum} aria-hidden="true">
            {String(current + 1).padStart(2, '0')}
          </span>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ height: `${100 / total}%`, top: `${(100 / total) * current}%` }}
            />
          </div>

          <span className={`${styles.progressNum} ${styles.progressNumTotal}`} aria-hidden="true">
            {String(total).padStart(2, '0')}
          </span>

          <button
            className={styles.progressArrow}
            onClick={() => goToRef.current?.(current + 1)}
            disabled={current === total - 1}
            aria-label="Prodotto successivo"
          >
            ▼
          </button>
        </div>
      </section>
      </div>

      {/* ── Mobile ── */}
      <section className={styles.mobileList} aria-label="Shop prodotti">
        {prodotti.map((p, i) => (
          <MobileCard key={p.id} prodotto={p} index={i} total={total} />
        ))}
      </section>
    </>
  );
}
