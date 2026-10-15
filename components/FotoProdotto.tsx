import Image, { type ImageProps } from 'next/image';
import styles from './FotoProdotto.module.css';

// Finché le foto delle coltivazioni arrivano da stock, la zona immagine resta un riquadro tratteggiato.
// Portare a true quando l'azienda invia foto coerenti delle proprie produzioni.
export const FOTO_COERENTI = false;

/** Come next/image (con `fill`), ma mostra il segnaposto finché FOTO_COERENTI è false. */
export default function FotoProdotto(props: ImageProps) {
  if (!FOTO_COERENTI) return <div className={styles.placeholder} aria-hidden="true" />;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} />;
}
