import Footer from '@/components/Footer';
import ProdottoIntro from '@/components/prodotti/shared/ProdottoIntro';
import ShopBannerProdotto from '@/components/prodotti/shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from '@/components/prodotti/shared/FaqProdotto';
import SectionZigzag from './shared/SectionZigzag';
import CentralTitle from './shared/CentralTitle';

const FAQS: FaqItem[] = [
  {
    q: "Cosa significa 'filiera tracciata blockchain'?",
    a: "Significa che ogni passaggio della produzione - dalla raccolta del lotto in campo al confezionamento - viene registrato in modo immutabile su una blockchain. Il cliente finale o il buyer possono verificare in qualsiasi momento l'origine e il percorso del prodotto.",
  },
  {
    q: 'Badiula confeziona gli agrumi internamente?',
    a: 'Sì, tutte le operazioni di selezione, calibratura, confezionamento e stoccaggio avvengono nel nostro centro di lavorazione di Carlentini, a pochi minuti dagli agrumeti.',
  },
  {
    q: 'Sono disponibili formati packaging personalizzati per buyer?',
    a: "Sì, possiamo gestire packaging personalizzato e private label per partner commerciali. Per dettagli contatta l'area B2B.",
  },
  {
    q: "Si può acquistare l'olio online?",
    a: 'Sì, il nostro olio è acquistabile online in formati misti, con spedizione in Italia e Unione Europea durante la stagione di raccolta.',
  },
];

export default function FilieraLavorazione() {
  return (
    <main>
      <ProdottoIntro
        rows={[{ text: 'FILIERA E' }, { text: 'LAVORAZIONE', indent: '1.5em' }]}
        align="left"
        subtitle="Una filiera corta, gestita internamente, certificata blockchain"
        subtitleNoWrap
        body={[
          'Gestiamo internamente ogni fase del processo produttivo Badiula, dalla raccolta in campo alla spedizione al cliente finale. Questa scelta ci permette di garantire la piena tracciabilità del prodotto lungo tutto il percorso, certificata attraverso tecnologia blockchain, e di mantenere standard qualitativi controllati in ogni passaggio.',
        ]}
      />

      <SectionZigzag
        title="Il centro di lavorazione di Carlentini"
        reverse
        tallImage
        image={{ src: '/images/capannone-aerial.png' }}
        imageAlt="Centro di lavorazione Badiula a Carlentini"
      >
        <p>Il nuovo centro di lavorazione Badiula, di circa 2000 metri quadrati, è situato all&apos;interno della nostra azienda agricola di Carlentini, a poche centinaia di metri dagli agrumeti. La vicinanza tra campo e magazzino permette una lavorazione immediata, preservando freschezza e caratteristiche organolettiche degli agrumi.</p>
        <p>Il centro è dedicato a quattro attività principali:</p>
        <ul>
          <li><strong>Selezione:</strong> controllo qualità manuale e ottico dei frutti raccolti</li>
          <li><strong>Calibratura:</strong> classificazione per dimensione e formato commerciale</li>
          <li><strong>Confezionamento:</strong> imballaggio in formati standard o personalizzati su richiesta del cliente</li>
          <li><strong>Stoccaggio:</strong> conservazione in condizioni controllate, nel rispetto delle normative vigenti</li>
        </ul>
      </SectionZigzag>

      <CentralTitle pullUp={170} displayFont>
        <span style={{ display: 'block', whiteSpace: 'nowrap', textAlign: 'center' }}>Dall&apos;albero al</span>
        <span style={{ display: 'block', whiteSpace: 'nowrap', textAlign: 'center' }}>confezionamento</span>
      </CentralTitle>

      <SectionZigzag
        title="Tracciabilità blockchain"
        pullUp={160}
        image={{ src: '/images/DSC_7769.jpg' }}
        imageAlt="Raccolta manuale degli agrumi Badiula, tracciata dal campo al confezionamento"
      >
        <p>La nostra filiera è certificata tramite tecnologia blockchain: ogni fase del processo produttivo è documentata in modo immutabile e verificabile, dalla raccolta del singolo lotto in campo fino al pack finale.</p>
        <p>Per il buyer e il consumatore finale significa avere prove digitali dell&apos;origine del prodotto, della varietà coltivata, della data di raccolta e del percorso di lavorazione. La blockchain di filiera è uno standard che si sta affermando nell&apos;agroalimentare di qualità come strumento di garanzia per export, retail specializzato e canali premium.</p>
      </SectionZigzag>

      <SectionZigzag
        title="Continuità di fornitura e capacità operativa"
        italicTitle
        reverse
        pullUp={160}
        image={{ src: '/images/DSC_7568.jpg', position: 'left' }}
        imageAlt="Logistica e capacità operativa del centro di lavorazione Badiula"
      >
        <p>Il centro di lavorazione è progettato per accogliere e gestire volumi significativi di prodotto, assicurando efficienza operativa, continuità nella fornitura e controllo diretto su ogni passaggio della filiera.</p>
        <p>Questo è particolarmente rilevante per i nostri partner B2B (retail specializzato, GDO, horeca, importatori), che possono contare su un calendario di disponibilità annua coerente con le finestre stagionali delle varietà coltivate.</p>
      </SectionZigzag>

      <FaqProdotto items={FAQS} />

      <ShopBannerProdotto />

      <Footer />
    </main>
  );
}
