import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Footer';
import styles from './construction.module.css';

export const metadata: Metadata = {
  title: 'Coltivazioni - Badiula',
  description: 'Sezione in aggiornamento.',
};

const COPY = {
  it: {
    eyebrow: 'COLTIVAZIONI',
    title: 'Pagina in costruzione',
    body: 'Stiamo aggiornando questa sezione. Torna presto per scoprire le nostre coltivazioni.',
    cta: 'Torna alla home',
  },
  en: {
    eyebrow: 'CULTIVATIONS',
    title: 'Page under construction',
    body: "We're updating this section. Check back soon to discover our cultivations.",
    cta: 'Back to home',
  },
};

export default function ColtivazioniLayout({
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const c = params.locale === 'en' ? COPY.en : COPY.it;

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{c.eyebrow}</p>
        <h1 className={styles.title}>{c.title}</h1>
        <p className={styles.body}>{c.body}</p>
        <Link href="/" className={styles.cta}>
          {c.cta}
        </Link>
      </section>
      <Footer />
    </main>
  );
}
