import type { Prodotto } from '@/lib/mock/prodotti';

// Filtri dello shop, ricavati dai dati: categoria, tipo prodotto, disponibilità.
export const SHOP_FILTER_ALL = 'tutti';
export const SHOP_FILTERS = ['agrumi', 'olio', 'disponibili'] as const;
export type ShopFilter = typeof SHOP_FILTER_ALL | (typeof SHOP_FILTERS)[number];

export function matchesFilter(p: Prodotto, filter: string): boolean {
  switch (filter) {
    case 'agrumi':
      return p.categoria === 'coltivazioni';
    case 'olio':
      return p.id.startsWith('olio');
    case 'disponibili':
      return p.stock > 0;
    default:
      return true;
  }
}

// Mostra solo i chip che hanno almeno un prodotto
export function availableFilters(prodotti: Prodotto[]): ShopFilter[] {
  return [
    SHOP_FILTER_ALL,
    ...SHOP_FILTERS.filter((f) => prodotti.some((p) => matchesFilter(p, f))),
  ];
}
