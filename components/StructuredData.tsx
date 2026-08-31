import { getGlobalOptions } from '@/lib/wordpress';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agribadiula.it';

// Stessi fallback usati da components/Footer.tsx quando i campi ACF su WP
// non sono ancora compilati, per restare coerenti con quanto mostrato nel
// footer del sito.
export default async function StructuredData() {
  const opts = await getGlobalOptions();

  const indirizzo =
    opts.indirizzo || 'C.da Badiula San Leonardo\n96013 Carlentini (SR)';
  const [streetAddress, localityLine] = indirizzo.split('\n');
  const cap = localityLine?.match(/\b\d{5}\b/)?.[0] || '96013';
  const locality = localityLine?.replace(/\b\d{5}\b/, '').trim() || 'Carlentini (SR)';

  const facebook = opts.facebook || 'https://facebook.com/badiula';
  const linkedin = opts.linkedin || 'https://linkedin.com/company/badiula';
  const instagram = opts.instagram || 'https://instagram.com/badiula';

  const structuredData = {
    // Schema.org non ha un tipo "FarmingBusiness" (verificato: non esiste
    // nella gerarchia di LocalBusiness) — si usa il generico LocalBusiness.
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Badiula',
    alternateName: 'Azienda Agricola Badiula',
    description:
      'Azienda agricola biologica Badiula: quattro generazioni dedicate alla coltivazione di agrumi siciliani tra Carlentini e Siracusa.',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-badiula.png`,
    image: `${SITE_URL}/images/logo-badiula.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress || 'C.da Badiula San Leonardo',
      addressLocality: locality,
      postalCode: cap,
      addressRegion: 'SR',
      addressCountry: 'IT',
    },
    sameAs: [facebook, linkedin, instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
