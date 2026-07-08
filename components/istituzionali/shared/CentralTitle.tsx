import styles from './CentralTitle.module.css';

interface CentralTitleProps {
  children: React.ReactNode;
  pullUp?: number;
  size?: 'h1' | 'h3' | 'h3sm';
  align?: 'center' | 'left';
  displayFont?: boolean;
}

export default function CentralTitle({ children, pullUp, size = 'h1', align = 'center', displayFont = false }: CentralTitleProps) {
  const Tag = size === 'h1' ? 'h2' : 'h3';
  const sizeClass =
    size === 'h3' ? styles.titleH3 : size === 'h3sm' ? styles.titleH3Sm : '';
  return (
    <section
      className={`${styles.section} ${align === 'left' ? styles.sectionLeft : ''}`}
      style={pullUp ? ({ '--pull-up': `${pullUp}px` } as React.CSSProperties) : undefined}
    >
      <Tag className={`${styles.title} ${sizeClass} ${displayFont ? styles.titleDisplay : ''}`}>{children}</Tag>
    </section>
  );
}
