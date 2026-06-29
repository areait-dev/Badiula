'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import Image from 'next/image';
import Logo from '@/components/Logo';
import MegaMenu from '@/components/MegaMenu';
import styles from './Navbar.module.css';

/* ── Struttura dati del menu ── */
type SubItem = { label: string; href: string };
type NavItem =
  | { label: string; href: string; arrow: false }
  | { label: string; arrow: true; submenuKey: string };

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen]           = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  /* blocca lo scroll del body quando il menu o la search è aperta */
  useEffect(() => {
    document.body.style.overflow = (open || searchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open, searchOpen]);

  /* chiudi search con Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* resetta il sottomenu quando il menu si chiude */
  useEffect(() => {
    if (!open) setActiveKey(null);
  }, [open]);

  const closeAll = () => {
    setOpen(false);
    setActiveKey(null);
  };

  const switchLocale = (next: 'it' | 'en') => {
    if (next !== locale) router.replace(pathname, { locale: next });
  };

  /* voci di primo livello */
  const primaryLinks: NavItem[] = [
    { label: t('azienda'),    href: '/azienda',   arrow: false },
    { label: t('coltivazioni'), arrow: true, submenuKey: 'coltivazioni' },
    { label: t('luceDiTerra'),  arrow: true, submenuKey: 'luceDiTerra'  },
    { label: t('filiera'),      arrow: true, submenuKey: 'filiera'      },
    { label: t('shop'),         href: '/shop',      arrow: false },
  ];

  /* sottomenu indicizzati per chiave */
  const submenus: Record<string, SubItem[]> = {
    coltivazioni: [
      { label: t('tutteLeColtivazioni'), href: '/coltivazioni' },
      { label: t('aranciRosse'),  href: '/coltivazioni/arance-rosse-igp' },
      { label: t('aranceBionde'), href: '/coltivazioni/arance-bionde' },
      { label: t('limone'),       href: '/coltivazioni/limone-femminello' },
      { label: t('bergamotto'),   href: '/coltivazioni/bergamotto' },
      { label: t('pompelmo'),     href: '/coltivazioni/pompelmo' },
    ],
    luceDiTerra: [
      { label: t('luceDiTerra'),    href: '/luce-di-terra' },
      { label: t('olioEvo'),        href: '/luce-di-terra/olio-evo' },
      { label: t('marmellata'),     href: '/luce-di-terra/marmellata-agrumi' },
    ],
    filiera: [
      { label: t('filiera'), href: '/' },
    ],
  };

  const isSubOpen = activeKey !== null;

  return (
    <>
      {/* ── Barra di navigazione ── */}
      <nav className={styles.navbar} aria-label="Navigazione principale">
        <div className={styles.side}>
          <button
            className={`${styles.hamburger} ${open ? styles.open : ''}`}
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={open}
            aria-controls="fullscreen-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>

        <div className={styles.center}>
          <Link href="/" aria-label="Badiula – Home">
            <Logo size={79} showText />
          </Link>
        </div>

        <div className={`${styles.side} ${styles.right}`}>
          <button className={styles.search} aria-label="Cerca" onClick={() => setSearchOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </button>
          <LangSwitcher locale={locale} active={styles.active} onSwitch={switchLocale} className={styles.lang} />
        </div>
      </nav>

      {/* ── Overlay a tutto schermo ── */}
      <div
        id="fullscreen-menu"
        className={`${styles.overlay} ${open ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
        aria-hidden={!open}
      >
        {/* Header */}
        <header className={styles.overlayHeader}>
          <button className={styles.close} aria-label="Chiudi menu" onClick={closeAll}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <line x1="2" y1="2" x2="18" y2="18" />
              <line x1="18" y1="2" x2="2" y2="18" />
            </svg>
          </button>

          <Link href="/" className={styles.overlayLogo} onClick={closeAll} aria-label="Badiula – Home">
            <Logo size={72} showText />
          </Link>

          <LangSwitcher locale={locale} active={styles.active} onSwitch={switchLocale} className={styles.overlayLang} />
        </header>

        {/* Corpo 2 colonne */}
        <div className={styles.overlayBody}>

          {/* ── MegaMenu Luce di Terra ── */}
          {activeKey === 'luceDiTerra' ? (
            <MegaMenu onClose={closeAll} onBack={() => setActiveKey(null)} />
          ) : (
            <>
              {/* ── Colonna sinistra con pannelli scorrevoli ── */}
              <nav className={styles.overlayLeft} aria-label="Menu principale">
                <div className={`${styles.panels} ${isSubOpen ? styles.panelsShifted : ''}`}>

                  {/* Pannello 0 – menu principale */}
                  <div
                    className={styles.panel}
                    aria-hidden={isSubOpen}
                    role="group"
                    aria-label="Voci principali"
                  >
                    <ul className={styles.navList} role="list">
                      {primaryLinks.map((item) =>
                        item.arrow ? (
                          <li key={item.submenuKey}>
                            <button
                              className={styles.navLink}
                              onClick={() => setActiveKey(item.submenuKey)}
                              aria-expanded={activeKey === item.submenuKey}
                              aria-haspopup="true"
                            >
                              <span className={styles.navLinkInner}>
                                {item.label}
                                <ArrowRight className={styles.navArrow} />
                              </span>
                              <span className={styles.navLinkLine} aria-hidden="true" />
                            </button>
                          </li>
                        ) : (
                          <li key={item.href}>
                            <Link href={item.href} className={styles.navLink} onClick={closeAll}>
                              <span className={styles.navLinkInner}>{item.label}</span>
                              <span className={styles.navLinkLine} aria-hidden="true" />
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Pannello 1 – sottomenu attivo (filiera + altri) */}
                  <div
                    className={styles.panel}
                    aria-hidden={!isSubOpen}
                    role="group"
                    aria-label={activeKey ? t(activeKey as any) : undefined}
                  >
                    <button
                      className={styles.backBtn}
                      onClick={() => setActiveKey(null)}
                      aria-label="Torna al menu principale"
                    >
                      <ArrowLeft className={styles.backArrow} />
                      <span>{t('back')}</span>
                    </button>

                    <ul className={styles.navList} role="list">
                      {(activeKey ? submenus[activeKey] ?? [] : []).map((item) => (
                        <li key={item.href + item.label}>
                          <Link href={item.href} className={`${styles.navLink} ${styles.navLinkSub}`} onClick={closeAll}>
                            <span className={styles.navLinkInner}>
                              {item.label}
                              <ArrowRight className={styles.navArrow} />
                            </span>
                            <span className={styles.navLinkLine} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </nav>

              {/* ── Colonna destra – box promozionale ── */}
              <aside className={styles.overlayRight} aria-label="Promozione">
                <div className={styles.promoTop}>
                  <div className={styles.promoImgWrap}>
                    <Image
                      src="/images/luce-di-terra-promo.png"
                      alt="Luce di Terra – olio e agrumi siciliani"
                      fill
                      sizes="(max-width: 900px) 100vw, 48vw"
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    />
                  </div>
                </div>

                <div className={styles.promoBottom}>
                  <div className={styles.promoContent}>
                    <p className={styles.promoTitle}>{t('promo')}</p>
                    <p className={styles.promoSub}>{t('promoSub')}</p>
                  </div>
                  <Link href="/" className={styles.shopBtn} onClick={closeAll}>
                    {t('shop')}
                  </Link>
                </div>
              </aside>
            </>
          )}

        </div>
      </div>

      {open && (
        <div className={styles.backdrop} aria-hidden="true" onClick={closeAll} />
      )}

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div className={styles.searchOverlay} role="dialog" aria-modal="true" aria-label="Cerca"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <button
            className={styles.searchClose}
            aria-label="Chiudi ricerca"
            onClick={() => setSearchOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <line x1="2" y1="2" x2="18" y2="18" />
              <line x1="18" y1="2" x2="2" y2="18" />
            </svg>
          </button>
          <div className={styles.searchInner}>
            <svg className={styles.searchIcon} width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search for products or information"
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
}

/* ── Componenti interni riutilizzabili ── */

function LangSwitcher({
  locale, active, onSwitch, className,
}: {
  locale: string;
  active: string;
  onSwitch: (l: 'it' | 'en') => void;
  className: string;
}) {
  return (
    <div className={className} role="group" aria-label="Lingua">
      <button className={locale === 'it' ? active : ''} onClick={() => onSwitch('it')} aria-pressed={locale === 'it'}>IT</button>
      <span aria-hidden="true">|</span>
      <button className={locale === 'en' ? active : ''} onClick={() => onSwitch('en')} aria-pressed={locale === 'en'}>EN</button>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14"
      fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="1" y1="7" x2="13" y2="7" />
      <polyline points="8,2 13,7 8,12" />
    </svg>
  );
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14"
      fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="13" y1="7" x2="1" y2="7" />
      <polyline points="6,2 1,7 6,12" />
    </svg>
  );
}
