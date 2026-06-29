import Footer from '@/components/Footer';
import ProdottoIntro from './shared/ProdottoIntro';
import ProdottoVarieta from './shared/ProdottoVarieta';
import CalendarioRaccolta from './shared/CalendarioRaccolta';
import ProdottoEditoriale from './shared/ProdottoEditoriale';
import ShopBannerProdotto from './shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from './shared/FaqProdotto';

const FAQS: FaqItem[] = [
  {
    q: 'Qual è la differenza tra Tarocco e Moro?',
    a: 'Le due varietà si distinguono per intensità del colore e profilo aromatico. La Tarocco ha polpa con pigmentazione variabile (rosso-rosa screziato) e sapore equilibrato. La Moro ha polpa di rosso profondo e sapore più intenso, leggermente acidulo. Entrambe sono prive o quasi di semi.',
  },
  {
    q: 'Quando maturano le arance rosse di Sicilia?',
    a: 'La maturazione naturale va da dicembre ad aprile, con la Moro che matura per prima (dicembre–marzo) e la Tarocco che chiude la stagione (gennaio–aprile). La pigmentazione rossa si sviluppa con le escursioni termiche notturne tipiche della Sicilia orientale.',
  },
  {
    q: 'Le arance rosse Badiula sono biologiche?',
    a: 'Sì, tutte le nostre arance rosse sono certificate biologiche secondo il regolamento europeo (UE) 2018/848, oltre che IGP. Aderiscono inoltre agli standard Bio Suisse e GlobalG.A.P.',
  },
  {
    q: 'Si possono acquistare le arance rosse online?',
    a: 'Sì, le nostre arance rosse sono disponibili nello shop in box stagionali e formati misti, con spedizione in Italia e Unione Europea durante la stagione di raccolta.',
  },
];

export default function AranciRosse() {
  return (
    <main>
      <ProdottoIntro
        rows={[
          { text: 'ARANCE' },
          { text: 'ROSSE DI', indent: '1.5em' },
          { text: 'SICILIA IGP' },
        ]}
        align="left"
        subtitle="Tarocco e Moro, le due varietà siciliane più rappresentative"
        body={[
          "Le nostre arance rosse di Sicilia sono certificate IGP (Indicazione Geografica Protetta) e prodotte secondo metodo biologico, coltivate nella zona di elezione delle rosse siciliane, tra Carlentini e Lentini in provincia di Siracusa. La pigmentazione rossa caratteristica deriva dall'alta concentrazione di antociani, sviluppata grazie alle marcate escursioni termiche tra giorno e notte tipiche del territorio.",
          "Coltiviamo le due varietà principali del Consorzio di Tutela: la Tarocco, dal sapore equilibrato e dalla polpa parzialmente pigmentata, e la Moro, la più intensa per colore e profumo.",
        ]}
      />

      <ProdottoVarieta
        name="TAROCCO"
        slogan="L'arancia rossa per eccellenza"
        image={{
          src: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=80&fit=crop',
          alt: 'Arance Tarocco — polpa rossa',
        }}
      >
        <p>La Tarocco è tra le arance rosse siciliane più diffuse e apprezzate: polpa rossa con pigmentazione variabile dal rosso intenso al rosa screziato, in funzione delle escursioni termiche stagionali.</p>
        <p>È priva o quasi di semi, facile da pelare, dal sapore equilibrato tra dolcezza e acidità.</p>
      </ProdottoVarieta>

      <ProdottoVarieta
        name="MORO"
        slogan="La più pigmentata delle arance rosse"
        image={{
          src: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&q=80&fit=crop',
          alt: 'Arance Moro — polpa rosso intenso',
        }}
        reverse
      >
        <p>La Moro è la varietà più intensa nel colore: polpa di un rosso profondo grazie all&apos;elevata concentrazione di antociani, frutti di forma ovoidale con sfumature rosse anche sulla buccia.</p>
        <p>Il sapore è ricco e leggermente acidulo, particolarmente apprezzato per il consumo fresco e la spremitura.</p>
      </ProdottoVarieta>

      <CalendarioRaccolta activeMonths={[1, 2, 3, 4, 12]} />

      <ProdottoEditoriale title="Cosa significa «Arancia Rossa di Sicilia IGP»">
        <p>L&apos;Indicazione Geografica Protetta tutela le arance rosse prodotte in una zona delimitata della Sicilia orientale che comprende le province di Catania, Siracusa ed Enna. Solo le varietà Tarocco, Moro e Sanguinello coltivate in questa area possono fregiarsi del marchio IGP, sotto il controllo del Consorzio di Tutela Arancia Rossa di Sicilia IGP, di cui Badiula è membro.</p>
        <p>L&apos;IGP garantisce origine territoriale, varietà ammesse e standard qualitativi: è una garanzia di autenticità tracciabile fino al singolo campo di coltivazione.</p>
      </ProdottoEditoriale>

      <ShopBannerProdotto />

      <FaqProdotto items={FAQS} />

      <Footer />
    </main>
  );
}
