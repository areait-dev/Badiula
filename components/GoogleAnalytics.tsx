'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { CONSENT_CHANGE_EVENT, getConsent } from '@/lib/cookieConsent';

const GA_ID = 'G-VPN683YKJG';

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(getConsent()?.status === 'accepted');

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ status: string }>).detail;
      setEnabled(detail?.status === 'accepted');
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
