import Footer from '@/components/Footer';
import ProdottoIntro from './shared/ProdottoIntro';
import ProdottoVarieta from './shared/ProdottoVarieta';
import CalendarioRaccolta from './shared/CalendarioRaccolta';
import ProdottoEditoriale from './shared/ProdottoEditoriale';
import ShopBannerProdotto from './shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from './shared/FaqProdotto';

const FAQS: FaqItem[] = [
  {
    q: 'Qual è la differenza tra Navel e Lane Late?',
    a: 'La Navel (Newhall) matura prima, tra novembre e gennaio, ed è caratterizzata da un ombelico pronunciato e polpa dolce e succosa. La Lane Late è una Navel tardiva che matura da febbraio a giugno, con una stagione più lunga e una dolcezza intensa che si sviluppa lentamente.',
  },
  {
    q: 'Le arance bionde Badiula sono biologiche?',
    a: 'Sì, le nostre arance bionde sono certificate biologiche secondo il regolamento europeo (UE) 2018/848. Aderiscono inoltre agli standard Bio Suisse e GlobalG.A.P.',
  },
  {
    q: 'Quando è disponibile la stagione delle arance bionde?',
    a: 'Le arance bionde sono disponibili da novembre a giugno: la Newhall da novembre a gennaio, la Lane Late da febbraio fino a giugno. In questo modo possiamo offrire arance biologiche fresche per quasi sette mesi.',
  },
  {
    q: 'Si possono acquistare le arance bionde online?',
    a: 'Sì, sono disponibili nello shop Badiula in box stagionali con spedizione in Italia e in Unione Europea. I box sono composti da frutto selezionato e spediti entro 24 ore dalla raccolta.',
  },
];

export default function AranceBionde() {
  return (
    <main>
      <ProdottoIntro
        rows={[
          { text: 'ARANCE' },
          { text: 'BIONDE', indent: '1.5em' },
        ]}
        align="right"
        subtitle="Newhall e Lane Late, due Navel per coprire tutta la stagione"
        body={[
          'Le nostre arance bionde sono prodotte con metodo biologico certificato nella Piana di Catania e nell\'area siracusana. Appartengono alla famiglia Navel — caratterizzate dall\'ombelico alla base e dall\'assenza di semi — nelle varietà Newhall (precoce) e Lane Late (tardiva), che insieme coprono una stagione di sette mesi.',
          'Il profilo organolettico è dolce e succoso, con buccia facile da pelare e polpa compatta. Sono ideali per il consumo fresco e per la spremitura a freddo.',
        ]}
      />

      <ProdottoVarieta
        name="NEWHALL"
        slogan="La Navel della prima stagione"
        image={{
          src: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&q=80&fit=crop',
          alt: 'Arance Newhall — Navel precoce',
        }}
      >
        <p>La Newhall è una varietà Navel precoce che matura tra novembre e gennaio. Frutto di pezzatura media, con buccia liscia di colore giallo-arancio, polpa arancione intensa e sapore dolce, poco acido.</p>
        <p>Priva di semi, con l'ombelico tipico della famiglia Navel, è perfetta per il consumo fresco e per la spremitura.</p>
      </ProdottoVarieta>

      <ProdottoVarieta
        name="LANE LATE"
        slogan="La Navel che prolunga la stagione fino a giugno"
        image={{
          src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
          alt: 'Arance Lane Late — Navel tardiva',
        }}
        reverse
      >
        <p>La Lane Late è una Navel tardiva che rimane sull&apos;albero da febbraio fino a giugno, sviluppando nel tempo una dolcezza ancora più pronunciata. La polpa è tenera, succosa, senza semi.</p>
        <p>È una delle poche arance biologiche disponibili in primavera e inizio estate: una rarità per il mercato biologico europeo.</p>
      </ProdottoVarieta>

      <CalendarioRaccolta activeMonths={[1, 2, 3, 4, 5, 6, 11]} />

      <ProdottoEditoriale title="La famiglia Navel: un'arancia senza semi">
        <p>Il nome «Navel» (ombelico in inglese) deriva dalla protuberanza che si forma alla base del frutto — un secondo frutto rudimentale che non si sviluppa. Proprio questa caratteristica strutturale rende le Navel completamente prive di semi, caratteristica selezionata e mantenuta nel tempo attraverso la riproduzione per innesto.</p>
        <p>Le Navel di Sicilia beneficiano del clima mediterraneo e delle temperature elevate, che permettono una maturazione lenta e uniforme del frutto, con un accumulo di zuccheri superiore rispetto alle varietà prodotte in zone più fredde.</p>
      </ProdottoEditoriale>

      <ShopBannerProdotto />

      <FaqProdotto items={FAQS} />

      <Footer />
    </main>
  );
}
