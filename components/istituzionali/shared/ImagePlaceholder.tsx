import styles from './ImagePlaceholder.module.css';

interface ImagePlaceholderProps {
  alt: string;
}

export default function ImagePlaceholder({ alt }: ImagePlaceholderProps) {
  return <div className={styles.placeholder} role="img" aria-label={alt} />;
}
