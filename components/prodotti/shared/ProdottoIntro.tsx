import styles from './ProdottoIntro.module.css';

export interface TitleRow {
  text: string;
  indent?: string;
}

interface ProdottoIntroProps {
  rows: TitleRow[];
  align?: 'left' | 'center' | 'right';
  subtitle: string;
  subtitleNoWrap?: boolean;
  body: string[];
  /** Interlinea del titolo più stretta su mobile/tablet (solo dove richiesto). */
  tightLineHeight?: boolean;
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
  subtitleNoWrap = false,
  body,
  tightLineHeight = false,
}: ProdottoIntroProps) {
  return (
    <section className={styles.intro}>
      <div className={styles.hero}>
        <h2
          className={`${styles.h1} ${tightLineHeight ? styles.h1Tight : ''}`}
          style={{ alignItems: alignMap[align] }}
        >
          {rows.map((row, i) => (
            <span
              key={i}
              className={styles.h1Row}
              style={row.indent ? { paddingLeft: row.indent } : undefined}
            >
              {row.text}
            </span>
          ))}
        </h2>
        <h3 className={`${styles.h2} ${subtitleNoWrap ? styles.h2NoWrap : ''}`}>
          {subtitle.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h3>
      </div>
      <div className={styles.body}>
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
