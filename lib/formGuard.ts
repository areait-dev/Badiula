// Controlli condivisi dalle route dei form (contatto e newsletter). Solo server.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Restituisce il campo ripulito, oppure '' se non è una stringa. */
export const field = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

/** IP del visitatore, dagli header impostati da Vercel. */
export const clientIp = (headers: Headers) =>
  headers.get('x-real-ip') ?? headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

/**
 * Limite di richieste a finestra mobile: true se `key` ha superato `max`
 * richieste negli ultimi `windowMs` millisecondi.
 *
 * Il conteggio vive in memoria: su Vercel ogni istanza ha il proprio e si
 * azzera ai riavvii. Frena le raffiche, non è un limite globale garantito.
 */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= max) return true;

  // Tetto alla memoria: si scarta la chiave inserita per prima.
  if (!hits.has(key) && hits.size >= MAX_KEYS) hits.delete(hits.keys().next().value as string);
  hits.set(key, [...recent, now]);
  return false;
}
