import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { Prodotto } from '@/lib/mock/prodotti';
import styles from './ShopFeatured.module.css';

const BG_CLASS = { teal: 'bgTeal', vanilla: 'bgVanilla', khaki: 'bgKhaki' } as const;

// Banner opzionale sopra la griglia: il prodotto di stagione (attivabile da page.tsx)
export default async function ShopFeatured({ prodotto: p }: { prodotto: Prodotto }) {
  const t = await getTranslations('shopGrid');
  return (
    <section className={styles.section} aria-labelledby="shop-featured-title">
      <div className={styles.inner}>
        <div className={`${styles.media} ${styles[BG_CLASS[p.coloreSfondo]]}`}>
          <Image
            src={p.cutoutImage ?? p.immagine}
            alt={p.nome}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className={p.cutoutImage ? styles.imgContain : styles.imgCover}
          />
        </div>
        <div className={styles.text}>
          <p className={`body-2 ${styles.eyebrow}`}>{t('featured')}</p>
          <h2 id="shop-featured-title" className={styles.title}>
            {p.nome}
          </h2>
          <p className={`body-1 ${styles.subtitle}`}>{p.sottotitolo}</p>
          <Link href={`/shop/${p.slug}`} className="btn btn-outline">
            {t('discover')}&nbsp;&#9658;
          </Link>
        </div>
      </div>
    </section>
  );
}
