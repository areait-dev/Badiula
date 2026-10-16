'use client';

import { usePathname } from 'next/navigation';
import SitoInCostruzione from './SitoInCostruzione';

// Sezioni ancora bloccate in produzione. Shop, Coltivazioni e Luce di Terra
// sono state riattivate: al momento tutto il sito è pubblico.
// Per bloccare di nuovo una sezione aggiungere il prefisso, es. '/it/shop'.
const PREFISSI_BLOCCATI: string[] = [];

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
