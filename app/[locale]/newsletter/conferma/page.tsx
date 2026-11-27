import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Footer from '@/components/Footer';
import styles from '@/components/legal/LegalPage.module.css';
import ConfirmNewsletter from './ConfirmNewsletter';

export const metadata: Metadata = {
  title: 'Newsletter - Badiula',
  robots: { index: false, follow: false },
};

export default async function ConfermaNewsletterPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('newsletterConfirm');

  return (
    <main>
      <div className={styles.page}>
        <h1 className={styles.title}>{t('title')}</h1>
        <div className={styles.body}>
          <ConfirmNewsletter />
        </div>
      </div>
      <Footer />
    </main>
  );
}
