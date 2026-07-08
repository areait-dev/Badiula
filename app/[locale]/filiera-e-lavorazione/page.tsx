import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { FilieraLavorazione } from '@/components/istituzionali';
import { getPageSeo } from '@/lib/wordpress';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('filiera-e-lavorazione');
  if (!seo) {
    return {
      title: 'Filiera e Lavorazione - Badiula',
      description: 'Una filiera corta, gestita internamente, certificata blockchain.',
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

export default function FilieraLavorazionePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <FilieraLavorazione />;
}
