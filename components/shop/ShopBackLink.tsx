'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCatParam, withCat } from './useCatParam';
import styles from './ShopProductPage.module.css';

// "← Torna allo shop" che preserva il filtro attivo (?categoria=)
export default function ShopBackLink() {
  const t = useTranslations('shopGrid');
  const cat = useCatParam();
  return (
    <Link href={withCat('/shop', cat)} className={`body-2 ${styles.back}`}>
      {t('back')}
    </Link>
  );
}
