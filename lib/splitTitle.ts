const CONNECTORS = /^(di|del|della|dei|degli|delle|e|a|in|da|su|per|tra|fra)$/i;

/**
 * Titolo sempre su due righe: punto di taglio che bilancia la lunghezza delle righe,
 * senza lasciare una preposizione/congiunzione a fine riga.
 */
export function splitTitle(name: string): string[] {
  const words = name.split(' ');
  if (words.length < 2) return [name];
  let best: string[] = [name];
  let bestLen = Infinity;
  for (let i = 1; i < words.length; i++) {
    if (CONNECTORS.test(words[i - 1])) continue;
    const first = words.slice(0, i).join(' ');
    const second = words.slice(i).join(' ');
    const len = Math.max(first.length, second.length);
    if (len < bestLen) {
      bestLen = len;
      best = [first, second];
    }
  }
  return best;
}
