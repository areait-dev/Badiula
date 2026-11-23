// Passaggio di consegne tra la griglia dello shop e la pagina prodotto.
// Il modulo vive nel bundle client e sopravvive alle navigazioni SPA: la griglia
// registra il rettangolo della foto cliccata, la pagina prodotto lo legge al mount
// per animare la propria foto da lì (Flip). `rect: null` = entrata generica dal basso.

export interface ShopTransitionRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ShopTransition {
  slug: string;
  rect: ShopTransitionRect | null;
  ts: number;
}

const TTL_MS = 4000;

let pending: ShopTransition | null = null;

export function setShopTransition(slug: string, rect: ShopTransitionRect | null) {
  pending = { slug, rect, ts: Date.now() };
}

// Non consuma il valore (React StrictMode monta due volte in dev): scade da solo.
export function peekShopTransition(slug: string): ShopTransition | null {
  if (!pending || pending.slug !== slug || Date.now() - pending.ts > TTL_MS) return null;
  return pending;
}

export function clearShopTransition() {
  pending = null;
}

// ── Scroll della griglia ──
// L'App Router non ripristina lo scroll con il back del browser: lo salviamo noi
// all'uscita dalla griglia e lo ripristiniamo solo se l'arrivo è una traversata
// della cronologia (popstate), mai su una navigazione nuova.

const SCROLL_KEY = 'badiula:shopScroll';
let lastPopstate = 0;

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    lastPopstate = Date.now();
  });
}

export function saveShopScroll() {
  try {
    sessionStorage.setItem(
      SCROLL_KEY,
      JSON.stringify({ url: window.location.pathname + window.location.search, y: window.scrollY })
    );
  } catch {
    /* storage non disponibile: nessun ripristino */
  }
}

export function takeShopScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    sessionStorage.removeItem(SCROLL_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { url: string; y: number };
    const here = window.location.pathname + window.location.search;
    if (saved.url !== here || Date.now() - lastPopstate > 3000) return null;
    return saved.y;
  } catch {
    return null;
  }
}
