'use client';

import styles from './ShopFilters.module.css';

const FILTERS = ['Tutti', 'Coltivazioni', 'Luce di Terra'];

interface ShopFiltersProps {
  active: string;
  onChange: (f: string) => void;
}

export default function ShopFilters({ active, onChange }: ShopFiltersProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.pill} ${active === f ? styles.pillActive : ''}`}
            onClick={() => onChange(f)}
            aria-pressed={active === f}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
