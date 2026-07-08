import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Innovazione } from '@/components/istituzionali';
import { getPageSeo } from '@/lib/wordpress';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('innovazione');
  if (!seo) {
    return {
      title: 'Innovazione 4.0 - Badiula',
      description: 'Sensori, blockchain, agricoltura di precisione: tecnologia al servizio della terra.',
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

export default function InnovazionePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <Innovazione />;
}
