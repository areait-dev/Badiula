import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Sostenibilita } from '@/components/istituzionali';
import { getPageSeo, getPaginaSostenibilita } from '@/lib/wordpress';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('sostenibilita');
  if (!seo) {
    return {
      title: 'Sostenibilità - Badiula',
      description: 'Energie rinnovabili, gestione idrica intelligente, emissioni zero.',
    };
  }
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default async function SostenibilitaPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const data = await getPaginaSostenibilita();
  return <Sostenibilita data={data} />;
}
