import Image from 'next/image';
import styles from './CertificazioneCard.module.css';

export interface CertificazioneCardProps {
  title: string;
  description: string;
  image: { src: string; alt: string };
}

export default function CertificazioneCard({ title, description, image }: CertificazioneCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.logoPlate}>
        <Image
          src={image.src}
          alt={image.alt}
          width={120}
          height={120}
          style={{ width: 'auto', height: 'auto', maxWidth: '120px', maxHeight: '120px' }}
        />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
