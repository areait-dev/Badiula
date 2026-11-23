import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import styles from './ShopAlsoSection.module.css';

export interface AlsoItem {
  slug: string;
  nome: string;
  badge?: string;
  image: string;
  contain: boolean;
  bg: 'khaki' | 'teal' | 'vanilla';
  from: string;
}

const BG_CLASS = { teal: 'bgTeal', vanilla: 'bgVanilla', khaki: 'bgKhaki' } as const;

// "Scopri anche": prodotti correlati, stessa card della griglia dello shop.
export default async function ShopAlsoSection({ items }: { items: AlsoItem[] }) {
  const t = await getTranslations('shopGrid');
  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="also-title">
      <div className={styles.inner}>
        <h2 id="also-title" className={styles.title}>
          {t('also')}
        </h2>
        <ul className={styles.grid}>
          {items.map((it) => (
            <li key={it.slug}>
              <Link
                href={`/shop/${it.slug}`}
                className={styles.card}
                aria-label={t('view', { name: it.nome })}
              >
                <span className={`${styles.media} ${styles[BG_CLASS[it.bg]]}`}>
                  <Image
                    src={it.image}
                    alt=""
                    fill
                    sizes="(max-width: 1023px) 50vw, 25vw"
                    className={it.contain ? styles.imgContain : styles.imgCover}
                  />
                  {it.badge && <span className={`body-2 ${styles.badge}`}>{it.badge}</span>}
                </span>
                <span className={`body-2 ${styles.caption}`}>
                  <span className={styles.name}>{it.nome}</span>
                  <span className={styles.from}>{t('from', { price: it.from })}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
