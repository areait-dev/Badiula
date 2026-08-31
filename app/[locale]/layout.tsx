import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';
import SitoInCostruzioneGate from '@/components/SitoInCostruzioneGate';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';
import StructuredData from '@/components/StructuredData';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Badiula - Agrumi Biologici di Sicilia',
  description:
    'Azienda agricola biologica Badiula: quattro generazioni dedicate alla coltivazione di agrumi siciliani tra Carlentini e Siracusa.',
  keywords: ['agrumi biologici', 'arance rosse', 'Sicilia', 'Badiula', 'IGP'],
  openGraph: {
    title: 'Badiula - Agrumi Biologici di Sicilia',
    description: 'Quattro generazioni, una terra.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        {/* Typekit CSS response serves font-display:auto (verificato via curl),
            non swap — non modificabile lato client. Self-hosting completo non
            praticabile ora: public/font/ ha solo i pesi Bold/Italic di Mr Eaves
            Mod OT, manca il Regular usato da --font-body per quasi tutto il
            testo del sito. Preconnect anticipa la connessione TLS/DNS al CDN
            Adobe prima che il CSS venga richiesto, riducendo il ritardo. */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/hjz0oac.css" />
        <StructuredData />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <SitoInCostruzioneGate>
            {children}
          </SitoInCostruzioneGate>
          <ScrollToTop />
        </NextIntlClientProvider>
        <GoogleAnalytics />
        <CookieConsent />
      </body>
    </html>
  );
}
