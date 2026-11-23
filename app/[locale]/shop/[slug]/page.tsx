import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, routing } from '@/i18n/routing';
import { prodotti } from '@/lib/mock/prodotti';
import { luceDiTerraProdotti } from '@/lib/mock/luceDiTerraProdotti';
import Footer from '@/components/Footer';
import ShopBackLink from '@/components/shop/ShopBackLink';
import ShopProductEntrance from '@/components/shop/ShopProductEntrance';
import ShopAlsoSection from '@/components/shop/ShopAlsoSection';
import styles from '@/components/shop/ShopProductPage.module.css';

const tutti = [...prodotti, ...luceDiTerraProdotti];

const BG_CLASS = {
  teal: 'bgTeal',
  vanilla: 'bgVanilla',
  khaki: 'bgKhaki',
} as const;

// Solo gli slug presenti nei dati: gli altri rispondono 404 vero
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => tutti.map((p) => ({ locale, slug: p.slug })));
}

function formatPrice(n: number, locale: string) {
  return `€${n.toFixed(2).replace('.', locale === 'it' ? ',' : '.')}`;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const p = tutti.find((x) => x.slug === params.slug);
  if (!p) return {};
  const image = p.cutoutImage ?? p.immagine;
  return {
    title: `${p.nome} - Badiula`,
    description: p.descrizioneBreve,
    openGraph: {
      title: `${p.nome} - Badiula`,
      description: p.descrizioneBreve,
      images: [image],
    },
  };
}

export default async function ShopProductPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const index = tutti.findIndex((x) => x.slug === params.slug);
  if (index === -1) notFound();

  const p = tutti[index];
  const t = await getTranslations('shopGrid');
  const badge = p.categoria === 'luce-di-terra' ? t('luceDiTerra') : p.badge;
  const minPrice = Math.min(...p.varianti.map((v) => v.prezzo));

  // "Scopri anche": correlati, prima della stessa categoria (nell'ordine dei dati), poi gli altri
  const altri = tutti.filter((x) => x.slug !== p.slug);
  const also = [
    ...altri.filter((x) => x.categoria === p.categoria),
    ...altri.filter((x) => x.categoria !== p.categoria),
  ]
    .slice(0, 4)
    .map((o) => ({
      slug: o.slug,
      nome: o.nome,
      badge: o.categoria === 'luce-di-terra' ? t('luceDiTerra') : o.badge,
      image: o.cutoutImage ?? o.immagine,
      contain: Boolean(o.cutoutImage),
      bg: o.coloreSfondo,
      from: formatPrice(Math.min(...o.varianti.map((v) => v.prezzo)), params.locale),
    }));

  return (
    <main>
      <ShopProductEntrance slug={p.slug}>
        <section className={styles.hero}>
          <div className={styles.inner}>
            <div data-hero-item>
              <ShopBackLink />
            </div>
            <div className={styles.grid}>
              <div
                data-hero-media
                className={`${styles.media} ${styles[BG_CLASS[p.coloreSfondo]]}`}
              >
                <Image
                  src={p.cutoutImage ?? p.immagine}
                  alt={p.nome}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className={p.cutoutImage ? styles.imgContain : styles.imgCover}
                />
              </div>

              <div className={styles.info}>
                {badge && (
                  <span data-hero-item className={`body-2 ${styles.badge}`}>
                    {badge}
                  </span>
                )}
                <h1 data-hero-item className={styles.title}>
                  {p.nome}
                </h1>
                <p data-hero-item className={styles.subtitle}>
                  {p.sottotitolo}
                </p>
                <p data-hero-item className={styles.price}>
                  {t('from', { price: formatPrice(minPrice, params.locale) })}
                </p>
                <p data-hero-item className={styles.desc}>
                  {p.descrizioneBreve}
                </p>

                <dl data-hero-item className={styles.details}>
                  {(['origin', 'method', 'harvest'] as const).map((k) => (
                    <div key={k} className={styles.detailCol}>
                      <dt className={`body-2 ${styles.detailLabel}`}>{t(k)}</dt>
                      <dd className={`body-2 ${styles.detailValue}`}>{t(`${k}Value`)}</dd>
                    </div>
                  ))}
                </dl>

                {p.varianti.length > 0 && (
                  <div data-hero-item className={styles.formats}>
                    <h2 className={`body-2 ${styles.formatsTitle}`}>{t('formats')}</h2>
                    <ul className={styles.formatList}>
                      {p.varianti.map((v) => (
                        <li key={v.etichetta} className={`body-2 ${styles.format}`}>
                          <span>{v.etichetta}</span>
                          <span>{formatPrice(v.prezzo, params.locale)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div data-hero-item className={styles.ctas}>
                  {/* Carrello non ancora implementato: bottone disabilitato (CLAUDE.md §10.X) */}
                  <button type="button" className="btn btn-solid" disabled>
                    {p.stock > 0 ? t('addToCart') : t('soon')}
                  </button>
                  <Link href={p.slugPagina} className="btn btn-outline">
                    {t('moreAbout')}&nbsp;&#9658;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ShopProductEntrance>

      <ShopAlsoSection items={also} />
      <Footer />
    </main>
  );
}
