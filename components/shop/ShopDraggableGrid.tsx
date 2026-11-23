'use client';

import { useCallback, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { Link } from '@/i18n/routing';
import type { Prodotto } from '@/lib/mock/prodotti';
import styles from './ShopDraggableGrid.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable, InertiaPlugin, Flip, useGSAP);
}

interface ShopDraggableGridProps {
  prodotti: Prodotto[];
}

const COLS = 5;
const ROWS = 4;
const CELLS = COLS * ROWS;

const BG_CLASS: Record<Prodotto['coloreSfondo'], 'bgTeal' | 'bgVanilla' | 'bgKhaki'> = {
  teal: 'bgTeal',
  vanilla: 'bgVanilla',
  khaki: 'bgKhaki',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Media({
  p,
  sizes,
  mediaRef,
}: {
  p: Prodotto;
  sizes: string;
  mediaRef?: (el: HTMLSpanElement | null) => void;
}) {
  const cutout = Boolean(p.cutoutImage);
  return (
    <span ref={mediaRef} className={`${styles.media} ${styles[BG_CLASS[p.coloreSfondo]]}`}>
      <Image
        src={p.cutoutImage ?? p.immagine}
        alt=""
        fill
        sizes={sizes}
        draggable={false}
        className={cutout ? styles.imgContain : styles.imgCover}
      />
    </span>
  );
}

export default function ShopDraggableGrid({ prodotti }: ShopDraggableGridProps) {
  const t = useTranslations('shopGrid');
  const locale = useLocale();
  const titleId = useId();
  const n = prodotti.length;

  // active = indice di cella della card aperta (le celle oltre n sono copie visive)
  const [active, setActive] = useState<number | null>(null);
  const [variantIdx, setVariantIdx] = useState(0);

  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const detailMediaRef = useRef<HTMLSpanElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const draggableRef = useRef<Draggable | null>(null);
  const modeRef = useRef({ desktop: false, reduce: false });
  const activeRef = useRef<number | null>(null);
  const draggedRef = useRef(false);
  const closingRef = useRef(false);

  const formatPrice = useCallback(
    (v: number) => `€${v.toFixed(2).replace('.', locale === 'it' ? ',' : '.')}`,
    [locale]
  );

  // ── Setup: drag (desktop), intro, fallback mobile ───────────────────
  const { contextSafe } = useGSAP(
    () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas) return;

      const mm = gsap.matchMedia();

      mm.add(
        { desktop: '(min-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          modeRef.current = { desktop, reduce };

          const cards = gsap
            .utils.toArray<HTMLElement>('[data-card]', root)
            .filter((el) => el.offsetParent !== null);
          const fadeOnly = reduce || !desktop;

          // Intro: parte quando la sezione entra nel viewport
          gsap.set(cards, { opacity: 0, ...(fadeOnly ? {} : { y: 60, scale: 0.92 }) });
          const io = new IntersectionObserver(
            ([entry]) => {
              if (!entry.isIntersecting) return;
              io.disconnect();
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: fadeOnly ? 0.4 : 0.9,
                ease: 'power3.out',
                stagger: fadeOnly
                  ? 0.04
                  : { amount: 0.9, from: 'center', grid: [ROWS, COLS] },
              });
            },
            { rootMargin: '0px 0px -15% 0px' }
          );
          io.observe(root);

          if (!desktop) {
            return () => {
              io.disconnect();
              draggableRef.current = null;
            };
          }

          // Drag: canvas più grande della sezione, centrato all'avvio
          const limits = () => ({
            minX: Math.min(0, root.clientWidth - canvas.offsetWidth),
            minY: Math.min(0, root.clientHeight - canvas.offsetHeight),
          });
          const center = () => {
            const { minX, minY } = limits();
            gsap.set(canvas, { x: minX / 2, y: minY / 2 });
          };
          center();

          const [drag] = Draggable.create(canvas, {
            type: 'x,y',
            trigger: root,
            bounds: root,
            edgeResistance: 0.8,
            inertia: !reduce,
            dragClickables: true,
            minimumMovement: 4,
            allowContextMenu: true,
            onPress() {
              draggedRef.current = false;
            },
            onDragStart() {
              draggedRef.current = true;
              root.dataset.dragging = 'true';
            },
            onRelease() {
              delete root.dataset.dragging;
              window.setTimeout(() => {
                draggedRef.current = false;
              }, 0);
            },
            onClick() {
              const target = (this as unknown as { pointerEvent?: Event }).pointerEvent?.target;
              const li = (target as HTMLElement | null)?.closest<HTMLElement>('[data-cell]');
              if (li) openDetail(Number(li.dataset.cell));
            },
          });
          draggableRef.current = drag;

          const onResize = () => {
            drag.applyBounds(root);
            const { minX, minY } = limits();
            gsap.set(canvas, {
              x: gsap.utils.clamp(minX, 0, Number(gsap.getProperty(canvas, 'x'))),
              y: gsap.utils.clamp(minY, 0, Number(gsap.getProperty(canvas, 'y'))),
            });
            drag.update();
          };
          window.addEventListener('resize', onResize);

          return () => {
            window.removeEventListener('resize', onResize);
            io.disconnect();
            drag.kill();
            draggableRef.current = null;
          };
        }
      );

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  // ── Apertura ────────────────────────────────────────────────────────
  const openDetail = contextSafe((cell: number) => {
    if (activeRef.current !== null || closingRef.current) return;
    activeRef.current = cell;
    draggableRef.current?.disable();
    setVariantIdx(0);
    setActive(cell);
  });

  // Animazione di apertura: parte dopo che il dialog è montato
  useGSAP(
    () => {
      if (active === null) return;
      const dialog = dialogRef.current;
      const backdrop = backdropRef.current;
      const detailMedia = detailMediaRef.current;
      const card = mediaRefs.current[active];
      const canvas = canvasRef.current;
      if (!dialog || !backdrop || !detailMedia || !card || !canvas) return;

      canvas.setAttribute('inert', '');
      closeBtnRef.current?.focus({ preventScroll: true });

      const info = gsap.utils.toArray<HTMLElement>('[data-info]', dialog);
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

      if (modeRef.current.reduce) {
        gsap.fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        return;
      }

      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      Flip.fit(detailMedia, card, { scale: true });
      gsap.to(detailMedia, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.9,
        ease: 'expo.inOut',
      });
      gsap.from(info, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.07,
        delay: 0.45,
      });
      gsap.to(cards, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'power2.out',
        stagger: { amount: 0.35, from: active, grid: [ROWS, COLS] },
      });
    },
    { dependencies: [active], scope: rootRef }
  );

  // ── Chiusura ────────────────────────────────────────────────────────
  const closeDetail = contextSafe(() => {
    const cell = activeRef.current;
    if (cell === null || closingRef.current) return;
    closingRef.current = true;

    const dialog = dialogRef.current;
    const backdrop = backdropRef.current;
    const detailMedia = detailMediaRef.current;
    const card = mediaRefs.current[cell];
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

    const finish = () => {
      canvasRef.current?.removeAttribute('inert');
      draggableRef.current?.enable();
      activeRef.current = null;
      closingRef.current = false;
      setActive(null);
      btnRefs.current[cell]?.focus({ preventScroll: true });
    };

    if (!dialog || !backdrop || !detailMedia || !card) {
      finish();
      return;
    }

    const info = gsap.utils.toArray<HTMLElement>('[data-info]', dialog);
    gsap.killTweensOf([detailMedia, backdrop, ...info]);

    if (modeRef.current.reduce) {
      gsap.set(cards, { opacity: 1, scale: 1 });
      gsap.to(dialog, { opacity: 0, duration: 0.2, onComplete: finish });
      return;
    }

    // la card d'origine torna alla scala piena (ancora invisibile) per misurare il target del Flip
    gsap.set(cards, { scale: 1 });
    gsap.to(info, { opacity: 0, duration: 0.25, ease: 'power1.out' });
    gsap.to(backdrop, { opacity: 0, duration: 0.5, delay: 0.3, ease: 'power2.in' });
    gsap.to(cards, {
      opacity: 1,
      duration: 0.5,
      delay: 0.3,
      stagger: { amount: 0.25, from: cell, grid: [ROWS, COLS] },
    });
    Flip.fit(detailMedia, card, {
      scale: true,
      duration: 0.8,
      ease: 'expo.inOut',
      onComplete: finish,
    });
  });

  // ── Tastiera: Esc + focus trap ──────────────────────────────────────
  const onDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeDetail();
      return;
    }
    if (e.key !== 'Tab') return;
    const nodes = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
    ).filter((el) => el.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Esc anche se il focus è uscito dal dialog
  useGSAP(
    () => {
      if (active === null) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeDetail();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    },
    { dependencies: [active] }
  );

  // Navigando da tastiera tra le card, porta in vista quella a fuoco
  const revealCard = contextSafe((e: React.FocusEvent<HTMLButtonElement>, cell: number) => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const li = cardRefs.current[cell];
    if (!modeRef.current.desktop || !root || !canvas || !li) return;
    if (!e.currentTarget.matches(':focus-visible')) return;

    const s = root.getBoundingClientRect();
    const r = li.getBoundingClientRect();
    const pad = 48;
    let dx = 0;
    let dy = 0;
    if (r.left < s.left + pad) dx = s.left + pad - r.left;
    else if (r.right > s.right - pad) dx = s.right - pad - r.right;
    if (r.top < s.top + pad) dy = s.top + pad - r.top;
    else if (r.bottom > s.bottom - pad) dy = s.bottom - pad - r.bottom;
    if (!dx && !dy) return;

    const minX = Math.min(0, root.clientWidth - canvas.offsetWidth);
    const minY = Math.min(0, root.clientHeight - canvas.offsetHeight);
    gsap.to(canvas, {
      x: gsap.utils.clamp(minX, 0, Number(gsap.getProperty(canvas, 'x')) + dx),
      y: gsap.utils.clamp(minY, 0, Number(gsap.getProperty(canvas, 'y')) + dy),
      duration: modeRef.current.reduce ? 0 : 0.6,
      ease: 'power3.out',
      onComplete: () => {
        draggableRef.current?.update();
      },
    });
  });

  const cells = Array.from({ length: CELLS }, (_, i) => ({
    cell: i,
    p: prodotti[i % n],
    copy: i >= n,
  }));

  const sel = active !== null ? prodotti[active % n] : null;
  const selBadge = sel
    ? sel.categoria === 'luce-di-terra'
      ? t('luceDiTerra')
      : sel.badge
    : undefined;

  return (
    <section ref={rootRef} className={styles.section} aria-label={t('ariaGrid')}>
      <ul ref={canvasRef} className={styles.canvas}>
        {cells.map(({ cell, p, copy }) => {
          const badge = p.categoria === 'luce-di-terra' ? t('luceDiTerra') : p.badge;
          return (
            <li
              key={`${p.id}-${cell}`}
              ref={(el) => {
                cardRefs.current[cell] = el;
              }}
              className={`${styles.card} ${copy ? styles.copy : ''}`}
              data-card
              data-cell={cell}
              aria-hidden={copy || undefined}
            >
              <button
                type="button"
                ref={(el) => {
                  btnRefs.current[cell] = el;
                }}
                className={styles.cardBtn}
                tabIndex={copy ? -1 : undefined}
                aria-label={t('open', { name: p.nome })}
                aria-haspopup="dialog"
                onFocus={(e) => revealCard(e, cell)}
                onClick={() => {
                  if (draggedRef.current) return;
                  openDetail(cell);
                }}
              >
                <Media
                  p={p}
                  sizes="(max-width: 767px) 50vw, 22vw"
                  mediaRef={(el) => {
                    mediaRefs.current[cell] = el;
                  }}
                />
                {badge && <span className={`body-2 ${styles.badge}`}>{badge}</span>}
                <span className={`body-2 ${styles.caption}`}>
                  <span className={styles.name}>{p.nome}</span>
                  <span className={styles.from}>
                    {t('from', { price: formatPrice(Math.min(...p.varianti.map((v) => v.prezzo))) })}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {sel && (
        <div
          ref={dialogRef}
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onKeyDown={onDialogKeyDown}
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest('[data-keep]')) closeDetail();
          }}
        >
          <div ref={backdropRef} className={styles.backdrop} />
          <button
            type="button"
            ref={closeBtnRef}
            className={styles.close}
            aria-label={t('close')}
            onClick={closeDetail}
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className={styles.stage}>
            <div data-keep className={styles.detailMediaWrap}>
              <Media
                p={sel}
                sizes="(max-width: 767px) 100vw, 40vw"
                mediaRef={(el) => {
                  detailMediaRef.current = el;
                }}
              />
            </div>

            <div data-keep className={styles.info}>
              {selBadge && (
                <span data-info className={`body-2 ${styles.detailBadge}`}>
                  {selBadge}
                </span>
              )}
              <h2 data-info id={titleId} className={styles.title}>
                {sel.nome}
              </h2>
              <p data-info className={`body-2 ${styles.subtitle}`}>
                {sel.sottotitolo}
              </p>
              <p data-info className={`body-2 ${styles.desc}`}>
                {sel.descrizioneBreve}
              </p>

              <dl data-info className={styles.facts}>
                {(['origin', 'method', 'harvest'] as const).map((k) => (
                  <div key={k} className={styles.fact}>
                    <dt className={`body-2 ${styles.factLabel}`}>{t(k)}</dt>
                    <dd className={`body-2 ${styles.factValue}`}>{t(`${k}Value`)}</dd>
                  </div>
                ))}
              </dl>

              <select
                data-info
                className={`body-2 ${styles.select}`}
                value={variantIdx}
                onChange={(e) => setVariantIdx(Number(e.target.value))}
                aria-label={t('format')}
              >
                {sel.varianti.map((v, i) => (
                  <option key={v.etichetta} value={i}>
                    {v.etichetta}
                  </option>
                ))}
              </select>

              <p data-info className={styles.price}>
                {formatPrice(sel.varianti[variantIdx]?.prezzo ?? 0)}
              </p>

              <div data-info className={styles.ctas}>
                {/* Carrello non ancora implementato: bottone disabilitato (CLAUDE.md §10.X) */}
                <button type="button" className="btn btn-solid" disabled>
                  {sel.stock === 0 ? t('soldOut') : t('soon')}
                </button>
                <Link href={sel.slugPagina} className="btn btn-outline">
                  {t('discover')}&nbsp;&#9658;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
