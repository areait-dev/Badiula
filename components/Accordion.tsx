'use client';

import { useState } from 'react';
import type { Faq } from '@/lib/data';
import styles from './Accordion.module.css';

export default function Accordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={`${styles.item} ${isOpen ? styles.open : ''}`}
          >
            <button
              className={styles.trigger}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <span className={styles.icon} aria-hidden>
                +
              </span>
            </button>
            <div className={styles.panel}>
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
