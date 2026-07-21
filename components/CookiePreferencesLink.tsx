'use client';

import { openCookiePreferences } from '@/lib/cookieConsent';

export default function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openCookiePreferences}>
      Gestisci preferenze cookie
    </button>
  );
}
