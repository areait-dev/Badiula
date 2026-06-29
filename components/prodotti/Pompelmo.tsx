import Footer from '@/components/Footer';
import ProdottoIntro from './shared/ProdottoIntro';
import ProdottoVarieta from './shared/ProdottoVarieta';
import CalendarioRaccolta from './shared/CalendarioRaccolta';
import ProdottoEditoriale from './shared/ProdottoEditoriale';
import ShopBannerProdotto from './shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from './shared/FaqProdotto';

const FAQS: FaqItem[] = [
  {
    q: 'Che differenza c\'è tra pompelmo e pomelo?',
    a: 'Sono due frutti distinti. Il pompelmo (Citrus paradisi) è un ibrido tra pomelo e arancia dolce, frutto di taglia media, molto diffuso. Il pomelo (Citrus maxima) è l\'antenato, più grande, con polpa meno succosa e buccia spessa. Noi coltiviamo il pompelmo biologico.',
  },
  {
    q: 'Il pompelmo Badiula è amaro?',
    a: 'I pompelmi biologici tendono ad avere un amaro più pronunciato rispetto alle varietà convenzionali, perché non subiscono trattamenti di deamarizzazione post-raccolta. L\'amaro è naturale e deriva dalla naringenina, un flavonoide con proprietà antiossidanti.',
  },
  {
    q: 'Quando matura il pompelmo?',
    a: 'Il pompelmo matura tra gennaio e aprile. È un agrume invernale-primaverile, con disponibilità più breve rispetto agli altri agrumi Badiula.',
  },
  {
    q: 'Come si usa il pompelmo in cucina?',
    a: 'Ottimo a colazione fresco o spremiuto. In cucina: la scorza in salse agrodolci e marinature per pesce, il succo nei cocktail (classico con gin o tequila), la polpa in insalate con finocchio e avocado.',
  },
];

export default function Pompelmo() {
  return (
    <main>
      <ProdottoIntro
        rows={[
          { text: 'POMPELMO' },
          { text: 'BIOLOGICO', indent: '1.5em' },
        ]}
        align="left"
        subtitle="Polpa rosa o gialla, sapore agrodolce intenso"
        body={[
          'Il pompelmo biologico Badiula è coltivato nella Sicilia orientale secondo metodo certificato biologico. Frutto di grandi dimensioni, con polpa che può variare dal giallo pallido al rosa intenso in funzione della varietà, caratterizzato da un sapore agrodolce con note amare naturali.',
          'È tra gli agrumi più nutrienti: ricco di vitamina C, flavonoidi (in particolare naringenina) e fibre. Disponibile da gennaio ad aprile, copre la parte finale della stagione degli agrumi siciliani.',
        ]}
      />

      <ProdottoVarieta
        name="CARATTERISTICHE"
        slogan="Agrume da colazione, ma non solo"
        image={{
          src: 'https://images.unsplash.com/photo-1534940519139-f860fb3c6e38?w=600&q=80&fit=crop',
          alt: 'Pompelmo biologico siciliano',
        }}
      >
        <p>Il pompelmo ha frutto di grandi dimensioni (calibro spesso superiore agli altri agrumi), buccia giallo-verdognola, polpa che varia da giallo chiaro a rosa corallo a seconda della varietà.</p>
        <ul>
          <li>Buccia spessa con abbondante olio essenziale</li>
          <li>Polpa succosa, con note dolci e amare ben bilanciate</li>
          <li>Basso contenuto calorico, elevato apporto di vitamina C</li>
          <li>Presenza di naringenina: flavonoide con attività antiossidante</li>
        </ul>
      </ProdottoVarieta>

      <ProdottoVarieta
        name="USI CONSIGLIATI"
        slogan="Dal succo al cocktail, dalla scorza alla marinatura"
        image={{
          src: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80&fit=crop',
          alt: 'Pompelmo a colazione',
        }}
        reverse
      >
        <ul>
          <li>Consumo fresco a metà, con cucchiaino (colazione classica)</li>
          <li>Succo fresco da bere o da usare in cocktail (Paloma, Greyhound)</li>
          <li>Polpa in insalate con rucola, finocchio, avocado o gamberi</li>
          <li>Scorza in salse agrodolci per pesce e carni bianche</li>
          <li>Marmellata di pompelmo — intensa e leggermente amara</li>
        </ul>
      </ProdottoVarieta>

      <CalendarioRaccolta activeMonths={[1, 2, 3, 4]} />

      <ProdottoEditoriale title="Pompelmo biologico: perché l'amaro fa bene">
        <p>Il sapore amaro del pompelmo biologico non è un difetto: è il segnale della naringenina, un flavonoide naturalmente presente nei pompelmi non trattati. Questo composto è oggetto di ricerca per le sue potenziali proprietà antiossidanti e antinfiammatorie.</p>
        <p>I pompelmi convenzionali vengono spesso sottoposti a trattamenti post-raccolta (cere, fungicidi di superficie, deamarizzatori) che ne riducono il sapore amaro ma anche il profilo nutrizionale. I nostri, non trattati, mantengono intatto il profilo di composti bioattivi che il frutto sviluppa naturalmente.</p>
      </ProdottoEditoriale>

      <ShopBannerProdotto />

      <FaqProdotto items={FAQS} />

      <Footer />
    </main>
  );
}
