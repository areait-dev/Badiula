import Image from 'next/image';
import ImagePlaceholder from './ImagePlaceholder';
import styles from './SectionZigzag.module.css';

interface SectionZigzagProps {
  title: string;
  italicTitle?: boolean;
  children: React.ReactNode;
  reverse?: boolean;
  noImage?: boolean;
  imageAlt?: string;
  image?: { src: string; position?: string; scale?: number };
  visualContent?: React.ReactNode;
  pullUp?: number;
  tallImage?: boolean;
  imageHeight?: string;
  hideTitle?: boolean;
  noWrapTitle?: boolean;
}

export default function SectionZigzag({
  title,
  italicTitle = false,
  children,
  reverse = false,
  noImage = false,
  imageAlt,
  image,
  visualContent,
  pullUp,
  tallImage = false,
  imageHeight,
  hideTitle = false,
  noWrapTitle = false,
}: SectionZigzagProps) {
  return (
    <section
      className={`${styles.section} ${reverse ? styles.reverse : ''} ${noImage ? styles.noVisual : ''}`}
      style={pullUp ? { marginTop: -pullUp } : undefined}
    >
      <div className={styles.content}>
        {!hideTitle && (
          <h3 className={`${styles.title} ${italicTitle ? styles.titleItalic : ''} ${noWrapTitle ? styles.titleNoWrap : ''}`}>{title}</h3>
        )}
        <div className={styles.body}>{children}</div>
      </div>
      {!noImage && (
        <div className={styles.visual}>
          <div
            className={`${styles.imgWrap} ${tallImage ? styles.imgWrapTall : ''}`}
            style={imageHeight ? { height: imageHeight } : undefined}
          >
            {visualContent ? (
              visualContent
            ) : image ? (
              <Image
                src={image.src}
                alt={imageAlt ?? title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: image.position ?? 'center',
                  transform: image.scale ? `scale(${image.scale})` : undefined,
                  transformOrigin: image.position ?? 'center',
                }}
              />
            ) : (
              <ImagePlaceholder alt={imageAlt ?? title} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
