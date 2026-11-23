'use client';

import { usePathname } from 'next/navigation';
import SitoInCostruzione from './SitoInCostruzione';

// Sezioni ancora bloccate in produzione: shop (e-commerce non ancora pronto).
// Coltivazioni e Luce di Terra sono state riattivate. Tutto il resto del
// sito è pubblico.
const PREFISSI_BLOCCATI = [
  '/it/shop', '/en/shop',
];

export default function SitoInCostruzioneGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const bloccata = PREFISSI_BLOCCATI.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  // In locale tutto il sito è raggiungibile tranne lo shop, bloccato come in produzione
  // finché l'e-commerce non è pronto.
  if (process.env.NODE_ENV !== 'production' && !bloccata) {
    return <>{children}</>;
  }

  if (bloccata) {
    return <SitoInCostruzione />;
  }

  return <>{children}</>;
}
