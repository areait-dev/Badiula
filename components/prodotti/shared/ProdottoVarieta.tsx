import Image from 'next/image';
import styles from './ProdottoVarieta.module.css';

interface ProdottoVarietaProps {
  name: string;
  slogan?: string;
  children: React.ReactNode;
  image: { src: string; alt: string; position?: string };
  reverse?: boolean;
  noBorder?: boolean;
  className?: string;
  /** Su mobile/touch tiene la foto prima del testo (invece del default
   * testo-poi-foto): usarlo sulla sezione che precede subito lo
   * ShopBannerProdotto, per evitare due foto ravvicinate una sotto l'altra
   * (la foto di questa sezione seguita dalla foto del banner). */
  imageFirstOnStack?: boolean;
}

export default function ProdottoVarieta({
  name,
  slogan,
  children,
  image,
  reverse = false,
  noBorder = false,
  className = '',
  imageFirstOnStack = false,
}: ProdottoVarietaProps) {
  return (
    <section className={`${styles.section} ${reverse ? styles.reverse : ''} ${noBorder ? styles.noBorder : ''} ${imageFirstOnStack ? styles.imageFirstOnStack : ''} ${className}`}>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        {slogan && <p className={styles.slogan}>{slogan}</p>}
        <div className={styles.body}>{children}</div>
      </div>
      <div className={styles.visual}>
        <div className={styles.imgWrap}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            style={{ objectFit: 'cover', objectPosition: image.position ?? 'center' }}
          />
        </div>
      </div>
    </section>
  );
}
