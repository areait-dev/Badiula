'use client';

import { useState } from 'react';
import styles from './FaqProdotto.module.css';

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqProdottoProps {
  items: FaqItem[];
}

export default function FaqProdotto({ items }: FaqProdottoProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>FAQ</h2>
        <dl className={styles.list}>
          {items.map((item, i) => (
            <div key={i} className={styles.item}>
              <dt>
                <button
                  className={styles.trigger}
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span>{item.q}</span>
                  <span className={styles.icon} aria-hidden="true">
                    {open === i ? '−' : '+'}
                  </span>
                </button>
              </dt>
              {open === i && (
                <dd className={styles.answer}>{item.a}</dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
