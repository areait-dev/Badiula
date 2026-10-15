import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import ProdottoIntro from '@/components/prodotti/shared/ProdottoIntro';
import ShopBannerProdotto from '@/components/prodotti/shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from '@/components/prodotti/shared/FaqProdotto';
import SectionZigzag from './shared/SectionZigzag';
import { separaTitoli } from './shared/separaTitoli';
import type { PaginaInnovazione } from '@/lib/types';

const FAQS: FaqItem[] = [
  {
    q: "Cosa significa 'agricoltura 4.0'?",
    a: 'È un approccio che integra tecnologie digitali (sensori, IoT, intelligenza artificiale, blockchain) nei processi agricoli tradizionali per renderli più efficienti, sostenibili e tracciabili.',
  },
  {
    q: 'Come usa Badiula i dati raccolti in campo?',
    a: 'I dati di umidità del suolo, temperatura, fabbisogno idrico vengono analizzati per ottimizzare l\'irrigazione, prevedere stress climatici e ridurre gli interventi non necessari sul campo. È agricoltura di precisione applicata.',
  },
  {
    q: "Cos'è il 'Progetto Acqua' dell'Università di Catania?",
    a: "È un progetto di ricerca dedicato alla gestione consapevole dell'acqua in agricoltura, con applicazione di droni, WebGIS e sistemi di monitoraggio. Badiula è una delle aziende partecipanti.",
  },
];

const FALLBACK_SEZIONE_1_TESTO =
  '<p>I nostri agrumeti sono dotati di un sistema integrato di:</p>' +
  '<ul>' +
  '<li><strong>Sensori IoT</strong> per il monitoraggio di umidità del suolo, temperatura e radiazione solare</li>' +
  '<li><strong>Stazioni meteo aziendali</strong> che rilevano in continuo dati climatici locali</li>' +
  '<li><strong>Piattaforme digitali di raccolta dati</strong> che incrociano informazioni ambientali e agronomiche</li>' +
  '<li><strong>Sistemi predittivi</strong> per anticipare stress idrico, eventi climatici e necessità di intervento agronomico</li>' +
  '</ul>' +
  '<p>Questi strumenti ci permettono di prendere <strong>decisioni basate sui dati</strong>, riducendo l\'uso di acqua, energia e interventi inutili sul campo.</p>';

// Evidenzia in grassetto bordeaux i termini chiave anche quando il testo arriva da WordPress
const MONITORAGGIO_BOLD = [
  'Sensori IoT',
  'Stazioni meteo aziendali',
  'Piattaforme digitali di raccolta dati',
  'Sistemi predittivi',
  'decisioni basate sui dati',
  'decisioni basate su dati',
];

function boldMonitoraggio(html: string): string {
  return MONITORAGGIO_BOLD.reduce(
    (out, term) => out.replace(new RegExp(`(<strong[^>]*>\\s*)?${term}(\\s*</strong>)?`, 'i'), (m, open, close) =>
      open && close ? m : `<strong>${term}</strong>`,
    ),
    html,
  );
}

const PARTNER_TITLES = ['Università degli Studi di Catania', 'Distretto Produttivo Agrumi di Sicilia'];

const FALLBACK_SEZIONE_2_TESTO =
  '<p>La tecnologia blockchain applicata alla filiera garantisce tracciabilità completa e trasparenza lungo tutto il percorso produttivo, dalla coltivazione al confezionamento. Per il cliente finale e il buyer significa avere prove digitali immutabili dell\'origine e del percorso del prodotto.</p>' +
  '<p>L\'agricoltura 4.0, per noi, non è opposta alla tradizione: è il modo per proteggere e prolungare un sapere agricolo costruito in quattro generazioni. I sensori in campo permettono ai nostri agronomi di lavorare meglio, non di lavorare meno. La blockchain garantisce trasparenza al consumatore finale di un prodotto che resta artigianale nelle scelte agronomiche e nella raccolta.</p>';

const FALLBACK_SEZIONE_3_TESTO =
  '<p>L\'innovazione agricola Badiula non avviene in isolamento: collaboriamo attivamente con il mondo della ricerca attraverso partnership consolidate.</p>' +
  '<p><strong>Università degli Studi di Catania</strong></p>' +
  '<p>Collaborazione di ricerca su progetti dedicati alla gestione climatica e idrica delle coltivazioni agrumicole siciliane. Tra i progetti più recenti: Progetto Clima e Progetto Acqua, che hanno portato all\'introduzione di droni, WebGIS e sistemi predittivi nell\'azienda.</p>' +
  '<p><strong>Distretto Produttivo Agrumi di Sicilia</strong></p>' +
  '<p>Membro attivo del Distretto, partecipiamo a iniziative di ricerca e sviluppo per il comparto agrumicolo regionale.</p>';

interface InnovazioneProps {
  data: PaginaInnovazione;
}

export default function Innovazione({ data: d }: InnovazioneProps) {
  return (
    <main>
      <ProdottoIntro
        rows={[{ text: d.heroTitolo || 'INNOVAZIONE 4.0' }]}
        align="left"
        subtitle={d.heroSottotitolo || 'Sensori, blockchain, agricoltura di precisione:\ntecnologia al servizio della terra'}
        body={[
          d.heroTesto ||
            "L'agricoltura di precisione è uno dei pilastri del modello produttivo Badiula. Non concepiamo la tecnologia come sostituzione del lavoro agricolo tradizionale, ma come strumento per renderlo più efficiente, più rispettoso delle risorse e più tracciabile. Per noi la tecnologia non sostituisce la terra: la accompagna.",
        ]}
      />

      <Reveal>
        <SectionZigzag
          title={d.sezione1Titolo || 'Monitoraggio in campo'}
          reverse
          image={{ src: d.sezione1Immagine || '/images/azienda-campi.png' }}
          imageAlt="Monitoraggio in campo degli agrumeti Badiula"
        >
          <div dangerouslySetInnerHTML={{ __html: boldMonitoraggio(d.sezione1Testo || FALLBACK_SEZIONE_1_TESTO) }} />
        </SectionZigzag>
      </Reveal>

      <Reveal>
        <SectionZigzag
          title={d.sezione2Titolo || 'Blockchain di filiera'}
          image={{ src: d.sezione2Immagine || '/images/DSC_7739.jpg' }}
          imageAlt="Tracciabilità blockchain del prodotto Badiula, dal frutto al confezionamento"
        >
          <div dangerouslySetInnerHTML={{ __html: d.sezione2Testo || FALLBACK_SEZIONE_2_TESTO }} />
        </SectionZigzag>
      </Reveal>

      <Reveal>
        <SectionZigzag
          title={d.sezione3Titolo || 'Ricerca e collaborazioni'}
          reverse
          image={{ src: d.sezione3Immagine || '/images/DSC_7619.jpg' }}
          imageAlt="Ricerca agronomica e raccolta manuale nelle coltivazioni Badiula"
        >
          <div dangerouslySetInnerHTML={{ __html: separaTitoli(d.sezione3Testo || FALLBACK_SEZIONE_3_TESTO, PARTNER_TITLES) }} />
        </SectionZigzag>
      </Reveal>

      <FaqProdotto items={FAQS} />

      <ShopBannerProdotto />

      <Footer />
    </main>
  );
}
