import type { Prodotto } from '@/lib/mock/prodotti';
import ShopCard from './ShopCard';
import styles from './ShopGrid.module.css';

interface ShopGridProps {
  prodotti: Prodotto[];
  filter: string;
}

function filterProdotti(prodotti: Prodotto[], filter: string): Prodotto[] {
  if (filter === 'Coltivazioni') return prodotti.filter((p) => p.categoria === 'coltivazioni');
  if (filter === 'Luce di Terra') return prodotti.filter((p) => p.categoria === 'luce-di-terra');
  return prodotti;
}

export default function ShopGrid({ prodotti, filter }: ShopGridProps) {
  const filtered = filterProdotti(prodotti, filter);

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {filtered.map((prodotto) => (
          <ShopCard key={prodotto.id} prodotto={prodotto} />
        ))}
        {filtered.length === 0 && (
          <p className={styles.empty}>Nessun prodotto disponibile in questa categoria.</p>
        )}
      </div>
    </section>
  );
}
