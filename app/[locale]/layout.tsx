import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';
import SitoInCostruzioneGate from '@/components/SitoInCostruzioneGate';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Badiula — Agrumi Biologici di Sicilia',
  description:
    'Azienda agricola biologica Badiula: quattro generazioni dedicate alla coltivazione di agrumi siciliani tra Carlentini e Siracusa.',
  keywords: ['agrumi biologici', 'arance rosse', 'Sicilia', 'Badiula', 'IGP'],
  openGraph: {
    title: 'Badiula — Agrumi Biologici di Sicilia',
    description: 'Quattro generazioni, una terra.',
    type: 'website',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as 'it' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/hjz0oac.css" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <SitoInCostruzioneGate>
            {children}
          </SitoInCostruzioneGate>
          <ScrollToTop />
        </NextIntlClientProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VPN683YKJG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VPN683YKJG');
          `}
        </Script>
      </body>
    </html>
  );
}
