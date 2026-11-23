'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { Link, useRouter } from '@/i18n/routing';
import { saveShopScroll, setShopTransition, takeShopScroll } from '@/lib/shopTransition';
import { readCatFromLocation, withCat } from './useCatParam';
import type { Prodotto } from '@/lib/mock/prodotti';
import { SHOP_FILTER_ALL, availableFilters, matchesFilter } from '@/lib/shopFilters';
import styles from './ShopProductGrid.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
}

interface ShopProductGridProps {
  prodotti: Prodotto[];
}

const BG_CLASS: Record<Prodotto['coloreSfondo'], 'bgTeal' | 'bgVanilla' | 'bgKhaki'> = {
  teal: 'bgTeal',
  vanilla: 'bgVanilla',
  khaki: 'bgKhaki',
};

const ALL = SHOP_FILTER_ALL;

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface ProductCardProps {
  p: Prodotto;
  priority: boolean;
  hidden: boolean;
  href: string;
  badge?: string;
  formatPrice: (v: number) => string;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => void;
}

function ProductCard({ p, priority, hidden, href, badge, formatPrice, onNavigate }: ProductCardProps) {
  const t = useTranslations('shopGrid');
  const [variantIdx, setVariantIdx] = useState(0);
  const selectId = useId();
  const available = p.stock > 0;
  const variant = p.varianti[variantIdx] ?? p.varianti[0];
  const hasChoice = p.varianti.length > 1;

  return (
    <li
      className={`${styles.card} ${hidden ? styles.isHidden : ''}`}
      data-card
      data-pending=""
    >
      <article className={styles.article}>
        {/* Link immagine: duplica il link sul nome, quindi fuori da tastiera e screen reader */}
        <Link
          href={href}
          className={styles.mediaLink}
          onClick={(e) => onNavigate(e, p.slug)}
          tabIndex={-1}
          aria-hidden="true"
        >
          <span data-media className={`${styles.media} ${styles[BG_CLASS[p.coloreSfondo]]}`}>
            <Image
              src={p.cutoutImage ?? p.immagine}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
              className={p.cutoutImage ? styles.imgContain : styles.imgCover}
            />
          </span>
        </Link>
        {(!available || badge) && (
          <span className={`body-2 ${styles.badge}`}>{available ? badge : t('soon')}</span>
        )}

        <div data-caption className={styles.caption}>
          <h3 className={`body-2 ${styles.name}`}>
            <Link href={href} className={styles.nameLink} onClick={(e) => onNavigate(e, p.slug)}>
              {p.nome}
            </Link>
          </h3>
          <p className={`body-2 ${styles.subtitle}`}>{p.sottotitolo}</p>

          {hasChoice ? (
            <div className={styles.selectWrap}>
              <label htmlFor={selectId} className={styles.srOnly}>
                {t('format')} · {p.nome}
              </label>
              <select
                id={selectId}
                className={`body-2 ${styles.select}`}
                value={variantIdx}
                onChange={(e) => setVariantIdx(Number(e.target.value))}
                disabled={!available}
              >
                {p.varianti.map((v, vi) => (
                  <option key={v.etichetta} value={vi}>
                    {v.etichetta}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className={`body-2 ${styles.format}`}>{variant.etichetta}</p>
          )}

          <p className={`${styles.price} ${available ? '' : styles.priceMuted}`}>
            {formatPrice(variant.prezzo)}
          </p>

          {/* Carrello non ancora implementato: il bottone resta disabilitato (CLAUDE.md §10.X) */}
          <button type="button" className={`btn btn-solid ${styles.cta}`} disabled>
            {available ? t('addToCart') : t('soon')}
          </button>
        </div>
      </article>
    </li>
  );
}

export default function ShopProductGrid({ prodotti }: ShopProductGridProps) {
  const t = useTranslations('shopGrid');
  const locale = useLocale();
  const router = useRouter();

  // Chip ricavati dai dati: compaiono solo i filtri che hanno almeno un prodotto
  const filtri = availableFilters(prodotti);

  const [cat, setCat] = useState<string>(ALL);

  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const motionRef = useRef(false);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const leavingRef = useRef(false);

  // Filtro iniziale da ?categoria= (anche al ritorno con il back del browser)
  useIsoLayoutEffect(() => {
    const fromUrl = readCatFromLocation();
    if (fromUrl && filtri.includes(fromUrl as (typeof filtri)[number])) {
      setCat(fromUrl);
      // le card nascoste non avevano dimensioni quando sono stati creati i trigger
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    // back del browser: torna alla stessa posizione di scroll
    const y = takeShopScroll();
    if (y !== null) {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, y);
        ScrollTrigger.refresh();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatPrice = useCallback(
    (v: number) => `€${v.toFixed(2).replace('.', locale === 'it' ? ',' : '.')}`,
    [locale]
  );

  const visibleCount = prodotti.filter((p) => matchesFilter(p, cat)).length;
  const labelFor = (c: string) => (c === ALL ? t('filterAll') : t(`filter_${c}` as never));

  // ── Entrata allo scroll (solo se il movimento è consentito) ──
  const { contextSafe } = useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        motionRef.current = true;
        const cards = gsap.utils.toArray<HTMLElement>('[data-card]', root);

        ScrollTrigger.batch(cards, {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => {
            const els = batch as HTMLElement[];
            const media = els.map((el) => el.querySelector('[data-media]'));
            const caps = els.map((el) => el.querySelector('[data-caption]'));
            // la card sale; l'immagine precede titolo e prezzo
            gsap.set([...media, ...caps], { opacity: 0 });
            els.forEach((el) => el.removeAttribute('data-pending'));
            gsap.fromTo(
              els,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.12,
                overwrite: 'auto',
                clearProps: 'transform,opacity',
              }
            );
            gsap.to(media, {
              opacity: 1,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.12,
              clearProps: 'opacity',
            });
            gsap.to(caps, {
              opacity: 1,
              duration: 0.7,
              delay: 0.2,
              ease: 'power3.out',
              stagger: 0.12,
              clearProps: 'opacity',
            });
          },
        });

        return () => {
          motionRef.current = false;
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  // ── Cambio filtro: Flip dal layout precedente a quello nuovo ──
  useGSAP(
    () => {
      const state = flipStateRef.current;
      flipStateRef.current = null;
      const grid = gridRef.current;
      if (!state || !grid) return;

      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', grid);
      // evita il salto di pagina mentre le card in uscita sono fuori dal flusso
      grid.style.minHeight = `${grid.offsetHeight}px`;

      Flip.from(state, {
        duration: 0.7,
        ease: 'power2.inOut',
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(
            (els as HTMLElement[]).filter((el) => !el.hasAttribute('data-pending')),
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 }
          ),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.35 }),
        onComplete: () => {
          gsap.set(cards, { clearProps: 'opacity,scale' });
          grid.style.minHeight = '';
          ScrollTrigger.refresh();
        },
      });
    },
    { dependencies: [cat], scope: rootRef }
  );

  const onFilter = (next: string) => {
    if (next === cat) return;
    const grid = gridRef.current;
    if (motionRef.current && grid) {
      flipStateRef.current = Flip.getState(grid.querySelectorAll('[data-card]'));
    } else {
      // senza animazioni: riallinea i trigger dopo il render
      window.setTimeout(() => ScrollTrigger.refresh(), 0);
    }
    setCat(next);
    const url = new URL(window.location.href);
    if (next === ALL) url.searchParams.delete('categoria');
    else url.searchParams.set('categoria', next);
    window.history.replaceState(window.history.state, '', url);
  };

  // Click su una card: la griglia sale e svanisce, la foto cliccata resta e passa alla pagina prodotto
  const onCardClick = contextSafe((e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (leavingRef.current) return;
    const href = withCat(`/shop/${slug}`, cat === ALL ? null : cat);
    saveShopScroll();
    const li = e.currentTarget.closest<HTMLElement>('[data-card]');
    const media = li?.querySelector<HTMLElement>('[data-media]');
    if (!motionRef.current || !li || !media) {
      router.push(href);
      return;
    }
    leavingRef.current = true;
    const r = media.getBoundingClientRect();
    setShopTransition(slug, { left: r.left, top: r.top, width: r.width, height: r.height });

    const others = gsap.utils
      .toArray<HTMLElement>('[data-card]', rootRef.current)
      .filter((c) => c !== li && c.offsetParent !== null);
    const caption = li.querySelector('[data-caption]');
    gsap.to([...others, rootRef.current?.querySelector('[data-toolbar]')], {
      y: -160,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.in',
      stagger: { amount: 0.2, from: 'start' },
    });
    gsap.to(caption, { opacity: 0, duration: 0.3 });
    gsap.delayedCall(0.7, () => {
      router.push(href);
      // se la navigazione non parte, la griglia non resta bloccata
      window.setTimeout(() => {
        leavingRef.current = false;
      }, 1500);
    });
  });

  return (
    <section ref={rootRef} className={styles.section}>
      <noscript>
        <style>{`[data-card]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <div className={styles.inner}>
        <div data-toolbar className={styles.toolbar}>
          <div className={styles.filters} role="group" aria-label={t('filtersLabel')}>
            {filtri.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.pill} ${cat === c ? styles.pillActive : ''}`}
                aria-pressed={cat === c}
                onClick={() => onFilter(c)}
              >
                {labelFor(c)}
              </button>
            ))}
          </div>
          <p className={`body-2 ${styles.count}`} aria-live="polite">
            {String(visibleCount).padStart(2, '0')} {t('available')}
          </p>
        </div>

        {visibleCount === 0 && (
          <p className={`body-1 ${styles.empty}`} role="status">
            {t('empty')}
          </p>
        )}

        <ul ref={gridRef} className={styles.grid}>
          {prodotti.map((p, i) => (
            <ProductCard
              key={p.id}
              p={p}
              priority={i < 4}
              hidden={!matchesFilter(p, cat)}
              href={withCat(`/shop/${p.slug}`, cat === ALL ? null : cat)}
              badge={p.categoria === 'luce-di-terra' ? t('luceDiTerra') : p.badge}
              formatPrice={formatPrice}
              onNavigate={onCardClick}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
