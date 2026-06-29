import Image from 'next/image';
import { Link } from '@/i18n/routing';
import styles from './ShopBannerProdotto.module.css';

export default function ShopBannerProdotto() {
  return (
    <section className={styles.banner}>
      <div className={styles.imgArea}>
        <Image
          src="/images/luce-di-terra-promo.png"
          alt="Agrumi siciliani Badiula"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>
      <div className={styles.bar}>
        <div className={styles.text}>
          <p className={styles.heading}>{'Agrumi siciliani\ndirettamente dal produttore'}</p>
          <p className={`body-2 ${styles.sub}`}>
            {'Box stagionali di agrumi biologici, olio extravergine Luce di Terra,\nmarmellate di agrumi. Spedizioni in Italia e in Unione Europea.'}
          </p>
        </div>
        <Link href="/coltivazioni" className="btn btn-outline-white">
          Shop
        </Link>
      </div>
    </section>
  );
}
