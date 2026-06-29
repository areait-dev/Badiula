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

const BG_MAP: Record<Prodotto['coloreSfondo'], string> = {
  teal:    'var(--teal)',
  vanilla: 'var(--vanilla)',
  khaki:   'var(--khaki)',
};

const NUM_COLOR: Record<Prodotto['coloreSfondo'], string> = {
  teal:    'var(--white)',
  vanilla: 'var(--bordeaux)',
  khaki:   'var(--white)',
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
  const cutoutRefs      = useRef<(HTMLDivElement | null)[]>([]);
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
      if (cu) gsap.set(cu, { yPercent: 100 });
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

      // Cutout only: animate visibly
      if (curCutout) {
        gsap.set(curCutout, { yPercent: 0 });
        gsap.to(curCutout, { yPercent: direction * -120, duration: 0.6, ease: 'power2.in' });
      }
      if (nxtCutout) {
        gsap.set(nxtCutout, { yPercent: direction * 120 });
        gsap.to(nxtCutout, { yPercent: 0, duration: 0.6, ease: 'power2.out' });
      }

      setTimeout(() => { isAnimating.current = false; }, 650);
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
        <div className={styles.sliderLeft}>
          {/* Background panels (slide with yPercent ±100) */}
          {prodotti.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => { leftPanelsRef.current[i] = el; }}
              className={styles.leftPanel}
              style={{ background: BG_MAP[p.coloreSfondo] }}
            >
              <span
                className={styles.leftNum}
                style={{ color: NUM_COLOR[p.coloreSfondo] }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Cover image for products without cutout */}
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
          ))}

          {/* Cutout images — siblings of panels, animate independently */}
          {prodotti.map((p, i) =>
            p.cutoutImage ? (
              <div
                key={`cutout-${p.id}`}
                ref={(el) => { cutoutRefs.current[i] = el; }}
                className={styles.cutoutWrap}
              >
                <Image
                  src={p.cutoutImage}
                  alt={p.nome}
                  fill
                  sizes="40vw"
                  style={{ objectFit: 'contain' }}
                  priority={i === 0}
                  draggable={false}
                />
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
                {p.badge && <span className={styles.badge}>{p.badge}</span>}

                {/* Title */}
                <h2 className={styles.prodTitle}>{p.nome}</h2>

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

                {/* Variant + price + CTAs — only active panel gets live state */}
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

                {/* Nav arrows + next hint */}
                <div className={styles.navRow}>
                  <div className={styles.navArrows}>
                    <button
                      className={styles.navArrow}
                      onClick={() => goToRef.current?.(i - 1)}
                      disabled={i === 0}
                      aria-label="Prodotto precedente"
                    >
                      ▲
                    </button>
                    <button
                      className={styles.navArrow}
                      onClick={() => goToRef.current?.(i + 1)}
                      disabled={i === total - 1}
                      aria-label="Prodotto successivo"
                    >
                      ▼
                    </button>
                  </div>

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
            </div>
          ))}
        </div>

        {/* Dot navigation */}
        <nav className={styles.dots} aria-label="Naviga prodotti">
          {prodotti.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot}${i === current ? ` ${styles.dotActive}` : ''}`}
              onClick={() => goToRef.current?.(i)}
              aria-label={`Prodotto ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
            />
          ))}
        </nav>
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
