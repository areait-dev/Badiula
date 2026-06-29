'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Prodotto } from '@/lib/mock/prodotti';
import styles from './ShopCard.module.css';

interface ShopCardProps {
  prodotto: Prodotto;
}

const BG_CLASS: Record<Prodotto['coloreSfondo'], string> = {
  khaki:   styles.bgKhaki,
  teal:    styles.bgTeal,
  vanilla: styles.bgVanilla,
};

export default function ShopCard({ prodotto }: ShopCardProps) {
  const isOutOfStock = prodotto.stock === 0;

  return (
    <article className={styles.card}>
      {/* Immagine 4:3 */}
      <div className={styles.imgWrap}>
        <Image
          src={prodotto.immagine}
          alt={prodotto.nome}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover', opacity: isOutOfStock ? 0.5 : 1 }}
        />
        {isOutOfStock && (
          <div className={styles.esaurito} aria-label="Prodotto esaurito">
            <span className={styles.esauritoLabel}>Esaurito</span>
          </div>
        )}
      </div>

      {/* Contenuto */}
      <div className={`${styles.body} ${BG_CLASS[prodotto.coloreSfondo]}`}>
        {prodotto.badge && (
          <span className={styles.badge}>{prodotto.badge}</span>
        )}
        <h4 className={styles.title}>{prodotto.nome}</h4>
        <p className={`body-2 ${styles.subtitle}`}>{prodotto.sottotitolo}</p>
        <p className={`body-2 ${styles.desc}`}>{prodotto.descrizioneBreve}</p>
        <Link href={prodotto.slugPagina} className={styles.cta}>
          Scopri di più&nbsp;&#9658;
        </Link>
      </div>
    </article>
  );
}
