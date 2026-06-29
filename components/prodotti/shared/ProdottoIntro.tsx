import styles from './ProdottoIntro.module.css';

export interface TitleRow {
  text: string;
  indent?: string;
}

interface ProdottoIntroProps {
  rows: TitleRow[];
  align?: 'left' | 'center' | 'right';
  subtitle: string;
  body: string[];
}

const alignMap = {
  left:   'flex-start',
  center: 'center',
  right:  'flex-end',
} as const;

export default function ProdottoIntro({
  rows,
  align = 'left',
  subtitle,
  body,
}: ProdottoIntroProps) {
  return (
    <section className={styles.intro}>
      <div className={styles.hero}>
        <h1 className={styles.h1} style={{ alignItems: alignMap[align] }}>
          {rows.map((row, i) => (
            <span
              key={i}
              className={styles.h1Row}
              style={row.indent ? { paddingLeft: row.indent } : undefined}
            >
              {row.text}
            </span>
          ))}
        </h1>
        <h2 className={styles.h2}>{subtitle}</h2>
      </div>
      <div className={styles.body}>
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
