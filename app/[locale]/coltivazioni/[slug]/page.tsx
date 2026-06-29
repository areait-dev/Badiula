import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { PRODUCTS, getProduct } from '@/lib/data';
import Accordion from '@/components/Accordion';
import HarvestCalendar from '@/components/HarvestCalendar';
import ShopBanner from '@/components/ShopBanner';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: 'Coltivazione — Badiula' };
  return {
    title: `${product.name} — Badiula`,
    description: product.description,
  };
}

export default function ProductPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations('product');
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <main>
      <section className={styles.hero}>
        <h1>{product.name}</h1>
        <p className={styles.sub}>{product.subtitle}</p>
      </section>

      <p className={styles.intro}>{product.body}</p>

      {product.sections.map((s) => (
        <section
          key={s.heading}
          className={`${styles.alt} ${s.imageLeft ? styles.reverse : ''}`}
        >
          <div className={styles.altImg} />
          <div className={styles.altText}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </div>
        </section>
      ))}

      <section className={styles.block}>
        <h2>{t('calendarTitle')}</h2>
        <div className={styles.tableWrap}>
          <HarvestCalendar
            rows={[{ label: product.name, harvest: product.harvest }]}
          />
        </div>
      </section>

      <section className={styles.block}>
        <h2>{t('faqTitle')}</h2>
        <Accordion items={product.faqs} />
      </section>

      <section className={styles.block} style={{ textAlign: 'center' }}>
        <Link className={styles.backLink} href="/coltivazioni">
          {t('back')}
        </Link>
      </section>

      <ShopBanner />
      <Footer />
    </main>
  );
}
