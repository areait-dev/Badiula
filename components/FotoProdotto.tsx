import Image, { type ImageProps } from 'next/image';
import styles from './FotoProdotto.module.css';

// Si mostrano solo le foto delle produzioni inviate dall'azienda, raccolte in
// questa cartella. Per le altre la zona immagine resta un riquadro tratteggiato.
const CARTELLA_CATALOGO = '/images/catalogo/';

/** Come next/image (con `fill`), ma mostra il segnaposto se la foto non è del catalogo. */
export default function FotoProdotto(props: ImageProps) {
  const delCatalogo = typeof props.src === 'string' && props.src.startsWith(CARTELLA_CATALOGO);
  if (!delCatalogo) return <div className={styles.placeholder} aria-hidden="true" />;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} />;
}
