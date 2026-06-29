'use client';

import { usePathname } from 'next/navigation';
import SitoInCostruzione from './SitoInCostruzione';

const PAGINE_VISIBILI = ['/', '/it', '/en', '/it/azienda', '/en/azienda'];

export default function SitoInCostruzioneGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const visibile = PAGINE_VISIBILI.some(
    (p) => pathname === p || pathname === p + '/'
  );

  if (!visibile) {
    return <SitoInCostruzione />;
  }

  return <>{children}</>;
}
