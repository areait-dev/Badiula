'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <dl className={styles.faqList}>
      {items.map((item, i) => (
        <div key={i} className={styles.faqItem}>
          <dt className={styles.faqQuestion}>
            <button
              className={styles.faqBtn}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
            >
              <span>{item.q}</span>
              <span className={styles.faqIcon} aria-hidden="true">
                {openFaq === i ? '−' : '+'}
              </span>
            </button>
          </dt>
          {openFaq === i && (
            <dd className={styles.faqAnswer}>{item.a}</dd>
          )}
        </div>
      ))}
    </dl>
  );
}
