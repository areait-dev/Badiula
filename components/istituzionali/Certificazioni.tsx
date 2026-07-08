import Footer from '@/components/Footer';
import ProdottoIntro from '@/components/prodotti/shared/ProdottoIntro';
import ShopBannerProdotto from '@/components/prodotti/shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from '@/components/prodotti/shared/FaqProdotto';
import SectionZigzag from './shared/SectionZigzag';
import ImageBanner from './shared/ImageBanner';
import CentralTitle from './shared/CentralTitle';
import CertificazioneCard from './shared/CertificazioneCard';
import styles from './shared/SectionZigzag.module.css';
import cardStyles from './shared/CertificazioneCard.module.css';
import type { PaginaCertificazioni } from '@/lib/types';

const FAQS: FaqItem[] = [
  {
    q: 'Cosa garantisce la certificazione biologica UE?',
    a: 'Garantisce che la produzione avvenga senza uso di pesticidi e fertilizzanti chimici di sintesi, OGM, e secondo pratiche agricole rispettose della biodiversità e del suolo, controllate da enti terzi accreditati.',
  },
  {
    q: 'Cosa si richiede IGP per le arance rosse di Sicilia?',
    a: "L'Indicazione Geografica Protetta tutela le arance rosse Tarocco, Moro e Sanguinello prodotte in un'area delimitata della Sicilia orientale. Garantisce origine territoriale, varietà ammesse e standard qualitativi.",
  },
  {
    q: "Cosa significa l'add-on GRASP di GlobalG.A.P.?",
    a: 'GRASP (GlobalG.A.P. Risk Assessment on Social Practice) è un modulo aggiuntivo che valuta le pratiche sociali dell\'azienda agricola: condizioni di lavoro, diritti dei lavoratori, salute e sicurezza in campo. È sempre su richiesta del buyer internazionali nei capitolati di acquisto.',
  },
  {
    q: 'Le certificazioni Badiula sono verificate da enti terzi?',
    a: 'Sì, tutte le certificazioni vengono rilasciate e periodicamente verificate da enti di certificazione indipendenti accreditati a livello internazionale.',
  },
];

const FALLBACK_QUALITA_TESTO =
  '<p><strong class="' + styles.subheadingLg + '">GlobalG.A.P. (Good Agricultural Practice)</strong></p>' +
  '<p>Standard internazionale per le buone pratiche agricole, riconosciuto dai principali player del retail e dell\'export agroalimentare.</p>' +
  '<p>Badiula aderisce con due add-on aggiuntivi:</p>' +
  '<ul>' +
  '<li><strong>SPRING</strong> - Sustainable Programme for Irrigation and Groundwater use: modulo dedicato alla gestione responsabile dell\'acqua e delle falde acquifere</li>' +
  '<li><strong>GRASP</strong> - GlobalG.A.P. Risk Assessment on Social Practice: modulo dedicato alla responsabilità sociale, condizioni di lavoro e diritti dei lavoratori agricoli</li>' +
  '</ul>' +
  '<p style="margin-top:1.5em"><strong class="' + styles.subheadingLg + '">ISO 22000</strong></p>' +
  '<p>Certificazione internazionale per i sistemi di gestione della sicurezza alimentare, applicata a tutto il processo produttivo dal campo al confezionamento.</p>';

const FALLBACK_RICONOSCIMENTI_TESTO =
  '<p><strong class="' + styles.subheadingLg + '">Azienda Didattica accreditata</strong></p>' +
  '<p>Dal 2009 Badiula è Azienda Didattica accreditata secondo la normativa regionale siciliana, accogliendo classi, gruppi e visitatori per persone educative dedicati all\'agricoltura biologica, alla sostenibilità ambientale e alla cultura agrumicola del territorio.</p>';

interface CertificazioniProps {
  data: PaginaCertificazioni;
}

export default function Certificazioni({ data: d }: CertificazioniProps) {
  return (
    <main>
      <ProdottoIntro
        rows={[{ text: d.heroTitolo || 'CERTIFICAZIONI' }]}
        align="left"
        subtitle={d.heroSottotitolo || 'Qualità certificata, filiera trasparente'}
        subtitleNoWrap
        body={[
          d.heroTesto ||
            'Le nostre coltivazioni e la nostra filiera sono coperte da un sistema completo di certificazioni internazionali che garantiscono biologicità, sicurezza alimentare, sostenibilità delle pratiche agricole e responsabilità sociale. Ogni certificazione è il risultato di audit periodici condotti da enti terzi indipendenti.',
        ]}
      />

      <CentralTitle pullUp={60} size="h3sm">{d.biologicheTitolo || 'Biologiche'}</CentralTitle>
      <div className={cardStyles.row}>
        <CertificazioneCard
          title={d.biologicheCard1Titolo || 'Biologico UE'}
          description={
            d.biologicheCard1Testo ||
            'Tutte le nostre coltivazioni sono certificate biologiche secondo il regolamento europeo (UE) 2018/848, che disciplina la produzione biologica in tutti gli Stati membri.'
          }
          image={{ src: '/certificazioni/Biologico UE.jpg', alt: 'Biologico UE - Regolamento (UE) 2018/848' }}
        />
        <CertificazioneCard
          title={d.biologicheCard2Titolo || 'Bio Suisse'}
          description={
            d.biologicheCard2Testo ||
            'Standard biologico svizzero, tra i più rigorosi al mondo, che impone requisiti aggiuntivi rispetto al regolamento UE in termini di biodiversità, gestione del suolo, benessere animale e sostenibilità complessiva.'
          }
          image={{ src: '/certificazioni/logo_bio_suisse_organic_pos.jpg', alt: 'Bio Suisse' }}
        />
      </div>

      <ImageBanner
        src="/images/limoni.jpg"
        video="/videos/certificazioni-limoni.mp4"
        alt="Agrumi Badiula selezionati secondo gli standard di qualità e sicurezza alimentare"
        pullUp={60}
      />

      <SectionZigzag title={d.qualitaSicurezzaTitolo || 'QUALITÀ E SICUREZZA ALIMENTARE'} noImage>
        <div dangerouslySetInnerHTML={{ __html: d.qualitaSicurezzaTesto || FALLBACK_QUALITA_TESTO }} />
      </SectionZigzag>

      <CentralTitle pullUp={60} size="h3sm">{d.tutelaOrigineTitolo || 'Tutela di origine'}</CentralTitle>
      <div className={cardStyles.row}>
        <CertificazioneCard
          title={d.tutelaOrigineCard1Titolo || 'Arancia Rossa di Sicilia IGP'}
          description={
            d.tutelaOrigineCard1Testo ||
            "Badiula è membro del Consorzio di Tutela Arancia Rossa di Sicilia IGP, riconoscimento europeo che protegge le varietà Tarocco, Moro e Sanguinello coltivate nell'area di elezione delle arance rosse siciliane (province di Catania, Siracusa ed Enna)."
          }
          image={{ src: '/certificazioni/logo_ConsorzioTutela_AranciaRossaDiSIciliai.png', alt: 'Consorzio di Tutela Arancia Rossa di Sicilia IGP' }}
        />
        <CertificazioneCard
          title={d.tutelaOrigineCard2Titolo || 'Distretto Agrumi di Sicilia'}
          description={
            d.tutelaOrigineCard2Testo ||
            'Membro attivo del Distretto Produttivo Agrumi di Sicilia, che riunisce le aziende agrumicole siciliane di qualità e promuove progetti di ricerca, innovazione e valorizzazione del comparto.'
          }
          image={{ src: '/certificazioni/logo-DistrettoAgrumiSicilia.png', alt: 'Distretto Produttivo Agrumi di Sicilia' }}
        />
      </div>

      <CentralTitle pullUp={100} size="h3">{d.riconoscimentiTitolo || 'Riconoscimenti aggiuntivi'}</CentralTitle>

      <SectionZigzag
        title={d.riconoscimentiTitolo || 'Riconoscimenti aggiuntivi'}
        hideTitle
        pullUp={160}
        imageHeight="50vh"
        image={{ src: d.riconoscimentiImmagine || '/images/DSC_7723.jpg' }}
        imageAlt="Bovino nell'Azienda Didattica accreditata Badiula"
      >
        <div dangerouslySetInnerHTML={{ __html: d.riconoscimentiTesto || FALLBACK_RICONOSCIMENTI_TESTO }} />
      </SectionZigzag>

      <FaqProdotto items={FAQS} />

      <ShopBannerProdotto />

      <Footer />
    </main>
  );
}
