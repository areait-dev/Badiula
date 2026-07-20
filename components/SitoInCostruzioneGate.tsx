'use client';

import { usePathname } from 'next/navigation';
import SitoInCostruzione from './SitoInCostruzione';

// Unica sezione ancora bloccata in produzione: lo shop (e-commerce non ancora pronto).
// Tutto il resto del sito è pubblico.
const PREFISSI_BLOCCATI = ['/it/shop', '/en/shop'];

export default function SitoInCostruzioneGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Gate disattivato in locale: in dev tutte le pagine, shop incluso, sono raggiungibili.
  if (process.env.NODE_ENV !== 'production') {
    return <>{children}</>;
  }

  const bloccata = PREFISSI_BLOCCATI.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (bloccata) {
    return <SitoInCostruzione />;
  }

  return <>{children}</>;
}
