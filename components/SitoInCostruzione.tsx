import Image from 'next/image';
import styles from './SitoInCostruzione.module.css';

export default function SitoInCostruzione() {
  return (
    <div className={styles.page}>
      <h1 className={styles.titolo}>SITO IN COSTRUZIONE</h1>

      <div className={styles.banner}>
        <div className={styles.loghi}>
          <Image src="/loghi-pnrr/ue.png" alt="Finanziato dall'Unione europea NextGenerationEU" width={160} height={64} quality={100} style={{ width: 'auto', height: '44px', objectFit: 'contain' }} />
          <Image src="/loghi-pnrr/italiadomani.png" alt="Italiadomani" width={160} height={64} quality={100} style={{ width: 'auto', height: '44px', objectFit: 'contain' }} />
          <Image src="/loghi-pnrr/ministero.png" alt="Ministero dell'Agricoltura della Sovranità Alimentare e delle Foreste" width={160} height={64} quality={100} style={{ width: 'auto', height: '44px', objectFit: 'contain' }} />
          <Image src="/loghi-pnrr/invitalia.png" alt="Invitalia" width={160} height={64} quality={100} style={{ width: 'auto', height: '44px', objectFit: 'contain' }} />
        </div>

        <p className={`body-2 ${styles.testo}`}>
          Contratti per la logistica nei settori agroalimentare, pesca e acquacoltura, silvicoltura, floricoltura e vivaismo
          <br />D.M. 13 giugno 2022
        </p>

        <p className={`body-2 ${styles.testoUpper}`}>
          PROGETTO FINANZIATO CON FONDI PNRR- MISSIONE 2 – COMPONENTE 1 – INVESTIMENTO 2.1
          <br />Sviluppo logistica per i settori agroalimentare, pesca e acquacoltura, silvicoltura, floricoltura e vivaismo
        </p>

        <p className={`body-2 ${styles.testoProponente}`}>
          SOGGETTO PROPONENTE: Agriturismi Badiula SCARL
          <br />CUP: C15H24004140008
          <br />COR: 2238573
        </p>
      </div>
    </div>
  );
}
