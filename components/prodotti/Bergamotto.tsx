import Footer from '@/components/Footer';
import ProdottoIntro from './shared/ProdottoIntro';
import ProdottoVarieta from './shared/ProdottoVarieta';
import CalendarioRaccolta from './shared/CalendarioRaccolta';
import ProdottoEditoriale from './shared/ProdottoEditoriale';
import ShopBannerProdotto from './shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from './shared/FaqProdotto';

const FAQS: FaqItem[] = [
  {
    q: 'Cos\'è il bergamotto e perché è raro?',
    a: 'Il bergamotto è un agrume ibrido (probabilmente incrocio tra limone e arancia amara) coltivato quasi esclusivamente in una fascia ristretta della costa calabrese tra Reggio Calabria e Locri. La nostra produzione siciliana è sperimentale e di nicchia. Il suo olio essenziale è uno degli ingredienti principali del profumo Eau de Cologne classico.',
  },
  {
    q: 'Come si usa il bergamotto in cucina?',
    a: 'La scorza è la parte più utilizzata: grattugiata conferisce un aroma floreale e agrumato unico a dolci, risotti, salse e marinature. Il succo — molto acido — può essere usato come il limone, ma con un profilo aromatico molto più complesso.',
  },
  {
    q: 'Quando matura il bergamotto?',
    a: 'Il bergamotto matura tra novembre e febbraio. La nostra stagione di raccolta copre novembre, dicembre, gennaio e febbraio.',
  },
  {
    q: 'Il bergamotto Badiula è biologico?',
    a: 'Sì, è certificato biologico secondo il regolamento (UE) 2018/848 e rispetta i protocolli Bio Suisse e GlobalG.A.P.',
  },
];

export default function Bergamotto() {
  return (
    <main>
      <ProdottoIntro
        rows={[
          { text: 'BERGAMOTTO' },
          { text: 'BIOLOGICO', indent: '1.5em' },
          { text: 'SICILIANO' },
        ]}
        align="left"
        subtitle="Un agrume raro, dall'aroma inconfondibile"
        body={[
          'Il bergamotto è tra gli agrumi più rari e pregiati al mondo. Il suo olio essenziale è estratto dalla scorza e costituisce la base aromatica di molti profumi e del tè Earl Grey. Noi lo coltiviamo secondo metodo biologico certificato, in una delle rare produzioni siciliane di questo frutto.',
          'Il frutto è di dimensioni medie, dalla buccia giallo-verde con superficie leggermente rugosa. Il succo è molto acido, la scorza straordinariamente profumata: è nella buccia che risiede la maggior parte dei composti aromatici.',
        ]}
      />

      <ProdottoVarieta
        name="CARATTERISTICHE"
        slogan="Profumo unico, scorza preziosa"
        image={{
          src: 'https://images.unsplash.com/photo-1556909114-44e3e9699e2b?w=600&q=80&fit=crop',
          alt: 'Bergamotto siciliano biologico',
        }}
      >
        <p>Il bergamotto si riconosce per la sua buccia giallo-verde profumata, con un aroma floreale e agrumato che non ha equivalenti nel mondo degli agrumi. Il frutto fresco è disponibile solo in stagione invernale.</p>
        <ul>
          <li>Frutto di pezzatura media, forma tondeggiante-oblunga</li>
          <li>Buccia liscia o leggermente granulosa, giallo-verde a maturità</li>
          <li>Polpa molto acida, povera di succo rispetto ad altri agrumi</li>
          <li>Scorza altamente profumata, ricca di olio essenziale</li>
        </ul>
      </ProdottoVarieta>

      <ProdottoVarieta
        name="USI CONSIGLIATI"
        slogan="In cucina, nei drink, nelle preparazioni artigianali"
        image={{
          src: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&q=80&fit=crop',
          alt: 'Bergamotto in cucina',
        }}
        reverse
      >
        <ul>
          <li>Scorza grattugiata su dolci, panna cotta, crostate</li>
          <li>Scorza candita in cioccolato fondente</li>
          <li>Marmellata di bergamotto (intensa, amarognola, aromatica)</li>
          <li>Succo nel cocktail negroni o nei centrifugati invernali</li>
          <li>Infuso di scorza per profumare tè e tisane</li>
        </ul>
      </ProdottoVarieta>

      <CalendarioRaccolta activeMonths={[1, 2, 11, 12]} />

      <ProdottoEditoriale title="Un agrume di nicchia: perché coltivarlo in Sicilia">
        <p>Tradizionalmente il bergamotto è sinonimo di Calabria — in particolare della Piana di Reggio Calabria, dove sono concentrate oltre il 90% delle produzioni mondiali. La Sicilia orientale, con il suo microclima simile e le temperature miti in inverno, si presta tuttavia alla coltivazione di questo agrume con risultati di qualità elevata.</p>
        <p>La nostra produzione è di piccola scala e sperimentale: ogni anno selezioniamo i frutti migliori per offrire un bergamotto fresco biologico, disponibile direttamente a chi lo usa in cucina, in pasticceria o nella preparazione artigianale di cosmetici e profumi.</p>
      </ProdottoEditoriale>

      <ShopBannerProdotto />

      <FaqProdotto items={FAQS} />

      <Footer />
    </main>
  );
}
