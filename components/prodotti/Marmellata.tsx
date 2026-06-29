import Footer from '@/components/Footer';
import ProdottoIntro from './shared/ProdottoIntro';
import ProdottoVarieta from './shared/ProdottoVarieta';
import CalendarioRaccolta from './shared/CalendarioRaccolta';
import ProdottoEditoriale from './shared/ProdottoEditoriale';
import ShopBannerProdotto from './shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from './shared/FaqProdotto';

const FAQS: FaqItem[] = [
  {
    q: "Cosa distingue una marmellata da una confettura?",
    a: "Secondo la normativa europea (Direttiva 2001/113/CE), il termine 'marmellata' è riservato esclusivamente ai prodotti a base di agrumi. Per tutti gli altri frutti la denominazione corretta è 'confettura'. Le nostre marmellate Luce di Terra rispettano questa definizione: sono realizzate unicamente con agrumi biologici coltivati nei nostri terreni.",
  },
  {
    q: "Quali agrumi utilizzate per le marmellate?",
    a: "Utilizziamo gli agrumi delle nostre coltivazioni biologiche: Arance Rosse IGP (Tarocco e Moro), Arance Bionde, Limone Femminello Siracusano, Bergamotto e Pompelmo. Ogni varietà dà vita a una marmellata con un profilo aromatico distinto, fedele alla stagionalità del frutto.",
  },
  {
    q: "Sono presenti additivi o conservanti?",
    a: "No. Gli unici ingredienti sono frutta biologica, zucchero di canna e succo di limone. Nessun additivo, nessun conservante, nessun colorante. La lunga conservazione è garantita dalla cottura tradizionale e dalla pastorizzazione del vasetto.",
  },
  {
    q: "Come si conservano le marmellate?",
    a: "In luogo fresco e asciutto, al riparo dalla luce diretta. Una volta aperto il vasetto, conservare in frigorifero e consumare entro 2-3 settimane. La data di scadenza è indicata sul fondo del vasetto.",
  },
  {
    q: "Le marmellate sono acquistabili online?",
    a: "Sì, disponibili nello shop online in formati singoli e in box misti con abbinamenti stagionali. Spedizione in Italia e Unione Europea, con packaging pensato per proteggere i vasetti durante il trasporto.",
  },
];

export default function Marmellata() {
  return (
    <main>

      {/* 1. Intro */}
      <ProdottoIntro
        rows={[
          { text: 'MARMELLATE' },
          { text: 'DI AGRUMI', indent: '1.2em' },
          { text: 'LUCE DI TERRA', indent: '0.4em' },
        ]}
        align="left"
        subtitle="Agrumi biologici trasformati artigianalmente, espressione autentica della stagionalità siciliana"
        body={[
          "Le nostre marmellate di agrumi sono parte della collezione Luce di Terra: trasformano la freschezza delle produzioni biologiche Badiula in sapori intensi e naturali, espressione della stagionalità e della tradizione mediterranea.",
          "Sono prodotte con frutta coltivata nei nostri terreni di Carlentini e Lentini, raccolta al giusto grado di maturazione e lavorata artigianalmente. Gli unici ingredienti sono frutta biologica, zucchero di canna e succo di limone: nient'altro.",
        ]}
      />

      {/* 2. Varietà — le marmellate (immagine sx, testo dx) */}
      <ProdottoVarieta
        name="LE NOSTRE MARMELLATE"
        slogan="Ogni agrume, una marmellata diversa"
        image={{
          src: '/images/luce-di-terra-promo.png',
          alt: 'Marmellate di agrumi biologici Luce di Terra Badiula',
        }}
      >
        <dl>
          <dt>Arancia Rossa IGP</dt>
          <dd>Tarocco e Moro: colore intenso, sapore dolce con note vinose</dd>

          <dt>Arancia Bionda</dt>
          <dd>Newhall e Lane Late: agrumata, fresca, dal sapore delicato</dd>

          <dt>Limone Femminello</dt>
          <dd>Acidità vivace e profumo intenso, ideale per abbinamenti salati</dd>

          <dt>Bergamotto Bio</dt>
          <dd>Aromatico e raffinato, rarissimo fuori dalla Calabria e dalla Sicilia</dd>

          <dt>Pompelmo Bio</dt>
          <dd>Note amare e fresche, perfetto con formaggi stagionati</dd>

          <dt>Formati disponibili</dt>
          <dd>220 g · 350 g · box misto stagionale</dd>
        </dl>
      </ProdottoVarieta>

      {/* 3. Varietà — produzione artigianale (immagine dx, testo sx) */}
      <ProdottoVarieta
        name="PRODUZIONE ARTIGIANALE"
        slogan="Cottura lenta, rispetto della materia prima"
        image={{
          src: '/images/luce-di-terra.jpg',
          alt: 'Lavorazione artigianale delle marmellate Badiula',
        }}
        reverse
      >
        <p>
          La lavorazione avviene nel rispetto dei ritmi tradizionali: cottura lenta a bassa
          temperatura per preservare i profumi naturali del frutto, senza accelerare i tempi
          con addensanti artificiali.
        </p>
        <p>
          Ogni lotto è prodotto in piccole quantità, legato alla disponibilità stagionale
          della frutta. Questo significa che ogni vasetto è diverso dall'altro: il colore,
          la consistenza e il profilo aromatico cambiano con la stagione e con la varietà
          dell'agrume utilizzato.
        </p>
      </ProdottoVarieta>

      {/* 4. Calendario raccolta agrumi — inverno/primavera */}
      <CalendarioRaccolta activeMonths={[1, 2, 3, 4, 12]} />

      {/* 5. Editoriale */}
      <ProdottoEditoriale title="Marmellata, non confettura">
        <p>
          Non è una questione di marketing: secondo la normativa europea (Direttiva
          2001/113/CE), il termine &ldquo;marmellata&rdquo; è riservato esclusivamente ai
          prodotti realizzati con agrumi. Per tutti gli altri frutti la denominazione
          corretta è &ldquo;confettura&rdquo;.
        </p>
        <p>
          Le nostre marmellate Luce di Terra rispettano questa definizione nella lettera e
          nello spirito: sono fatte con agrumi biologici coltivati da noi, in Sicilia
          orientale, seguendo la stessa filosofia che guida tutte le produzioni Badiula.
          La terra viene prima del prodotto — e si sente.
        </p>
      </ProdottoEditoriale>

      {/* 6. Banner CTA shop */}
      <ShopBannerProdotto />

      {/* 7. FAQ */}
      <FaqProdotto items={FAQS} />

      <Footer />
    </main>
  );
}
