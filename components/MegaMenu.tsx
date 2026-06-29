'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './MegaMenu.module.css';

interface MegaMenuProps {
  onClose: () => void;
  onBack:  () => void;
}

const NAV_ITEMS = [
  { label: 'SCOPRI LA LINEA',     href: '/luce-di-terra'                      },
  { label: 'OLIO EXTRA DI OLIVA', href: '/luce-di-terra/olio-evo'   },
  { label: 'MARMELLATA DI AGRUMI',href: '/luce-di-terra/marmellata-agrumi'    },
] as const;

export default function MegaMenu({ onClose, onBack }: MegaMenuProps) {
  const t = useTranslations('nav');

  return (
    <div className={styles.body}>

      {/* ── Colonna sinistra ── */}
      <nav className={styles.left} aria-label="Luce di Terra">
        <button className={styles.backBtn} onClick={onBack} aria-label="Torna al menu principale">
          <BackArrow />
          <span>{t('back')}</span>
        </button>

        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.href} className={i === 0 ? styles.firstItem : ''}>
              <Link href={item.href} className={styles.navLink} onClick={onClose}>
                <span className={styles.inner}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Colonna destra ── */}
      <aside className={styles.right} aria-label="Promozione Luce di Terra">
        <div className={styles.imgArea}>
          <Image
            src="/images/luce-di-terra-promo.png"
            alt="Luce di Terra – olio e agrumi siciliani"
            fill
            sizes="(max-width: 900px) 100vw, 48vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
        <div className={styles.banner}>
          <div className={styles.bannerText}>
            <p className={styles.bannerTitle}>{t('promo')}</p>
            <p className={styles.bannerSub}>{t('promoSub')}</p>
          </div>
          <Link href="/" className={styles.shopBtn} onClick={onClose}>
            {t('shop')}
          </Link>
        </div>
      </aside>

    </div>
  );
}

function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14"
      fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="13" y1="7" x2="1" y2="7" />
      <polyline points="6,2 1,7 6,12" />
    </svg>
  );
}
