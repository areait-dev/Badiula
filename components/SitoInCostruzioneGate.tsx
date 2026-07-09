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

  const isBloccataInDev = /^\/(it|en)\/(coltivazioni|shop)(\/|$)/.test(pathname);

  // Gate disattivato in locale, tranne per /coltivazioni e /shop: restano bloccate anche in dev.
  if (process.env.NODE_ENV !== 'production' && !isBloccataInDev) {
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
