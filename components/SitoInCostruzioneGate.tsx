'use client';

import { usePathname } from 'next/navigation';
import SitoInCostruzione from './SitoInCostruzione';

const PAGINE_VISIBILI = [
  '/', '/it', '/en',
  '/it/azienda', '/en/azienda',
  '/it/filiera-e-lavorazione', '/en/filiera-e-lavorazione',
  '/it/sostenibilita', '/en/sostenibilita',
  '/it/innovazione', '/en/innovazione',
  '/it/certificazioni', '/en/certificazioni',
];

export default function SitoInCostruzioneGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Gate disattivato in locale (coltivazioni incluso).
  // Lo shop invece è attivo solo in locale (dev): resta bloccato in produzione.
  if (process.env.NODE_ENV !== 'production') {
    return <>{children}</>;
  }

  const visibile = PAGINE_VISIBILI.some(
    (p) => pathname === p || pathname === p + '/'
  );

  if (!visibile) {
    return <SitoInCostruzione />;
  }

  return <>{children}</>;
}
