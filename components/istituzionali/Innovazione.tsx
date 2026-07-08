import Footer from '@/components/Footer';
import ProdottoIntro from '@/components/prodotti/shared/ProdottoIntro';
import ShopBannerProdotto from '@/components/prodotti/shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from '@/components/prodotti/shared/FaqProdotto';
import SectionZigzag from './shared/SectionZigzag';

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

export default function Innovazione() {
  return (
    <main>
      <ProdottoIntro
        rows={[{ text: 'INNOVAZIONE 4.0' }]}
        align="left"
        subtitle={'Sensori, blockchain, agricoltura di precisione:\ntecnologia al servizio della terra'}
        body={[
          "L'agricoltura di precisione è uno dei pilastri del modello produttivo Badiula. Non concepiamo la tecnologia come sostituzione del lavoro agricolo tradizionale, ma come strumento per renderlo più efficiente, più rispettoso delle risorse e più tracciabile. Per noi la tecnologia non sostituisce la terra: la accompagna.",
        ]}
      />

      <SectionZigzag
        title="Monitoraggio in campo"
        reverse
        image={{ src: '/images/azienda-campi.png' }}
        imageAlt="Monitoraggio in campo degli agrumeti Badiula"
      >
        <p>I nostri agrumeti sono dotati di un sistema integrato di:</p>
        <ul>
          <li>Sensori IoT per il monitoraggio di umidità del suolo, temperatura e radiazione solare</li>
          <li>Stazioni meteo aziendali che rilevano in continuo dati climatici locali</li>
          <li>Piattaforme digitali di raccolta dati che incrociano informazioni ambientali e agronomiche</li>
          <li>Sistemi predittivi per anticipare stress idrico, eventi climatici e necessità di intervento agronomico</li>
        </ul>
        <p>Questi strumenti ci permettono di prendere decisioni basate sui dati, riducendo l&apos;uso di acqua, energia e interventi inutili sul campo.</p>
      </SectionZigzag>

      <SectionZigzag
        title="Blockchain di filiera"
        image={{ src: '/images/DSC_7739.jpg' }}
        imageAlt="Tracciabilità blockchain del prodotto Badiula, dal frutto al confezionamento"
      >
        <p>La tecnologia blockchain applicata alla filiera garantisce tracciabilità completa e trasparenza lungo tutto il percorso produttivo, dalla coltivazione al confezionamento. Per il cliente finale e il buyer significa avere prove digitali immutabili dell&apos;origine e del percorso del prodotto.</p>
        <p>L&apos;agricoltura 4.0, per noi, non è opposta alla tradizione: è il modo per proteggere e prolungare un sapere agricolo costruito in quattro generazioni. I sensori in campo permettono ai nostri agronomi di lavorare meglio, non di lavorare meno. La blockchain garantisce trasparenza al consumatore finale di un prodotto che resta artigianale nelle scelte agronomiche e nella raccolta.</p>
      </SectionZigzag>

      <SectionZigzag
        title="Ricerca e collaborazioni"
        reverse
        image={{ src: '/images/DSC_7619.jpg' }}
        imageAlt="Ricerca agronomica e raccolta manuale nelle coltivazioni Badiula"
      >
        <p>L&apos;innovazione agricola Badiula non avviene in isolamento: collaboriamo attivamente con il mondo della ricerca attraverso partnership consolidate.</p>
        <p><strong>Università degli Studi di Catania</strong></p>
        <p>Collaborazione di ricerca su progetti dedicati alla gestione climatica e idrica delle coltivazioni agrumicole siciliane. Tra i progetti più recenti: Progetto Clima e Progetto Acqua, che hanno portato all&apos;introduzione di droni, WebGIS e sistemi predittivi nell&apos;azienda.</p>
        <p><strong>Distretto Produttivo Agrumi di Sicilia</strong></p>
        <p>Membro attivo del Distretto, partecipiamo a iniziative di ricerca e sviluppo per il comparto agrumicolo regionale.</p>
      </SectionZigzag>

      <FaqProdotto items={FAQS} />

      <ShopBannerProdotto />

      <Footer />
    </main>
  );
}
