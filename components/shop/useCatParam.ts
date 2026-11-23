'use client';

import { useEffect, useState } from 'react';

// Legge ?cat= dopo il mount (niente useSearchParams: eviterebbe la generazione statica
// delle pagine senza un Suspense boundary). Restituisce null finché non è noto.
export function readCatFromLocation(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('cat');
}

export function useCatParam(): string | null {
  const [cat, setCat] = useState<string | null>(null);
  useEffect(() => {
    setCat(readCatFromLocation());
  }, []);
  return cat;
}

export function withCat(path: string, cat: string | null): string {
  return cat ? `${path}?cat=${encodeURIComponent(cat)}` : path;
}
