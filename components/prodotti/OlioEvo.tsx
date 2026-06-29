import Footer from '@/components/Footer';
import ProdottoIntro from './shared/ProdottoIntro';
import ProdottoVarieta from './shared/ProdottoVarieta';
import CalendarioRaccolta from './shared/CalendarioRaccolta';
import ShopBannerProdotto from './shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from './shared/FaqProdotto';
import styles from './OlioEvo.module.css';

const FAQS: FaqItem[] = [
  {
    q: "Da dove vengono le olive per l'olio Luce di Terra?",
    a: "Le olive provengono interamente dai nostri uliveti di Carlentini e Lentini, in provincia di Siracusa. Filiera corta, dalla pianta alla bottiglia, gestita internamente in azienda.",
  },
  {
    q: "L'olio Badiula è biologico?",
    a: 'Sì, certificato biologico secondo il regolamento (UE) 2018/848. Nessun trattamento chimico di sintesi in campo.',
  },
  {
    q: "Cosa significa estratto a freddo?",
    a: "L'estrazione a freddo garantisce che la temperatura durante la molitura non superi i 27 °C, preservando integralmente gli aromi, i polifenoli e le qualità nutrizionali dell'olio.",
  },
  {
    q: 'Come si conserva al meglio?',
    a: "In luogo fresco, asciutto e al riparo dalla luce diretta. Le proprietà organolettiche si esprimono al meglio entro 12-18 mesi dalla data di imbottigliamento indicata in etichetta.",
  },
  {
    q: "Si può acquistare online?",
    a: 'Sì, disponibile nello shop online in più formati con spedizione in Italia e Unione Europea. Durante la stagione di raccolta è possibile acquistare anche in edizione limitata.',
  },
];

export default function OlioEvo() {
  return (
    <main className={styles.main}>

      {/* 1. Intro — titolo H1, sottotitolo H3 italic, corpo body-1 */}
      <ProdottoIntro
        rows={[
          { text: 'OLIO EVO' },
          { text: 'LUCE DI', indent: '1.5em' },
          { text: 'TERRA' },
        ]}
        align="left"
        subtitle="Olio extravergine di oliva biologico, dai nostri uliveti della Sicilia orientale"
        body={[
          "Il nostro olio extravergine di oliva biologico nasce tra gli agrumeti e gli uliveti di Badiula, in provincia di Siracusa. Olive coltivate biologicamente, raccolte al giusto grado di maturazione e lavorate per preservarne profumi, freschezza e identità territoriale.",
          "L'olio Luce di Terra racconta la stessa terra che produce i nostri agrumi: un profilo organolettico equilibrato, una filiera corta interamente gestita in azienda, dall'oliveto alla bottiglia.",
        ]}
      />

      {/* 2. Varietà — sezione caratteristiche dell'olio (immagine sx, testo dx) */}
      <ProdottoVarieta
        name="CARATTERISTICHE DELL'OLIO"
        slogan="Fruttato, erbaceo, identità siciliana in ogni goccia"
        image={{
          src: '/images/olio-caratteristiche.jpg',
          alt: 'Olio extravergine di oliva biologico Badiula Luce di Terra',
        }}
      >
        <dl>
          <dt>Cultivar</dt>
          <dd>Blend di varietà siciliane autoctone</dd>

          <dt>Categoria</dt>
          <dd>Olio extravergine di oliva biologico</dd>

          <dt>Zona di produzione</dt>
          <dd>Carlentini e Lentini, provincia di Siracusa</dd>

          <dt>Raccolta</dt>
          <dd>Ottobre – Novembre, brucatura manuale e meccanica</dd>

          <dt>Estrazione</dt>
          <dd>A freddo entro 24 ore dalla raccolta</dd>

          <dt>Profilo organolettico</dt>
          <dd>Note erbacee, fruttato verde, amaro e piccante equilibrati</dd>

          <dt>Formati disponibili</dt>
          <dd>250 ml · 500 ml · 750 ml</dd>
        </dl>
      </ProdottoVarieta>

      {/* 3. Varietà — usi consigliati (immagine dx, testo sx — reverse) */}
      <ProdottoVarieta
        name="USI CONSIGLIATI"
        slogan="Crudo per esaltare ogni preparazione"
        noBorder
        reverse
        image={{
          src: '/images/olio-usi-consigliati.jpg',
          alt: 'Usi consigliati olio extravergine Luce di Terra',
          position: 'left center',
        }}
      >
        <p>L&apos;olio extravergine di oliva biologico Luce di Terra è ideale per:</p>
        <ul>
          <li><strong>A crudo</strong>: condimento di insalate, bruschette, verdure cotte</li>
          <li><strong>Pesce e carpacci</strong>: per esaltare la freschezza della materia prima</li>
          <li><strong>Pasta e zuppe</strong>: filo d&apos;olio finale per arricchire i piatti</li>
          <li><strong>Pasticceria salata e dolce</strong>: dove la qualità dell&apos;olio fa la differenza</li>
          <li><strong>Degustazione</strong>: assaggio a cucchiaio per apprezzare il profilo aromatico</li>
        </ul>
      </ProdottoVarieta>

      {/* 4. Calendario raccolta — ottobre e novembre */}
      <CalendarioRaccolta activeMonths={[10, 11]} />

      {/* 5. Banner CTA shop */}
      <ShopBannerProdotto />

      {/* 7. FAQ */}
      <FaqProdotto items={FAQS} />

      <Footer />
    </main>
  );
}
