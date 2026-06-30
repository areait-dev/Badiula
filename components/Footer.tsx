import { getLocale } from 'next-intl/server';
import Logo from '@/components/Logo';
import BannerPNRR from '@/components/BannerPNRR';
import FooterForm from '@/components/FooterForm';
import { getGlobalOptions } from '@/lib/wordpress';
import styles from './Footer.module.css';

export default async function Footer() {
  const [locale, opts] = await Promise.all([getLocale(), getGlobalOptions()]);
  const it = locale === 'it';

  const quote = (it ? opts.footerQuoteIt : opts.footerQuoteEn) ||
    'Non produciamo\nsemplicemente agrumi,\ncoltiviamo un modo\ndiverso di vivere la terra';
  const formTitle = (it ? opts.footerFormTitleIt : opts.footerFormTitleEn) || 'Inviaci un messaggio';
  const indirizzo = opts.indirizzo || 'C.da Badiula San Leonardo\n96013 Carlentini (SR)';
  const pIva = opts.pIva || '01796500898';
  const facebook = opts.facebook || 'https://facebook.com/badiula';
  const linkedin = opts.linkedin || 'https://linkedin.com/company/badiula';
  const instagram = opts.instagram || 'https://instagram.com/badiula';
  const whatsapp = opts.whatsapp ? `https://wa.me/${opts.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/390950000000';

  return (
    <footer className={styles.footer} id="contatti">
      <div className={styles.grid}>
        <div className={styles.left}>
          <p className={styles.quote} style={{ whiteSpace: 'pre-line' }}>{quote}</p>
          <div className={styles.logo}><Logo size={44} light /></div>
          <p className={`body-2 ${styles.info}`}>
            Agriturismi Badiula Soc. Cons. A.r.l
            <br />
            Partita IVA: {pIva}
            <br />
            {indirizzo.split('\n').map((line, i) => (
              <span key={i}>{line}{i < indirizzo.split('\n').length - 1 && <br />}</span>
            ))}
          </p>
          <div className={styles.social}>
            <a href={facebook} aria-label="Seguici su Facebook" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" focusable="false" width={32} height={32}><use href="/social-icons.svg#icon-facebook" /></svg>
            </a>
            <a href={linkedin} aria-label="Seguici su LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" focusable="false" width={32} height={32}><use href="/social-icons.svg#icon-linkedin" /></svg>
            </a>
            <a href={instagram} aria-label="Seguici su Instagram" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" focusable="false" width={32} height={32}><use href="/social-icons.svg#icon-instagram" /></svg>
            </a>
            <a href={whatsapp} aria-label="Scrivici su WhatsApp" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" focusable="false" width={32} height={32}><use href="/social-icons.svg#icon-whatsapp" /></svg>
            </a>
          </div>
          <BannerPNRR />
        </div>

        <FooterForm formTitle={formTitle} />
      </div>
    </footer>
  );
}
