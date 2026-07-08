import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Certificazioni } from '@/components/istituzionali';
import { getPageSeo, getPaginaCertificazioni } from '@/lib/wordpress';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('certificazioni');
  if (!seo) {
    return {
      title: 'Certificazioni - Badiula',
      description: 'Qualità certificata, filiera trasparente.',
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

export default async function CertificazioniPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const data = await getPaginaCertificazioni();
  return <Certificazioni data={data} />;
}
