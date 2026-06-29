import styles from './ProdottoEditoriale.module.css';

interface ProdottoEditorialeProps {
  title: string;
  children: React.ReactNode;
}

export default function ProdottoEditoriale({ title, children }: ProdottoEditorialeProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
