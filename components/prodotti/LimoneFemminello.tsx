import Footer from '@/components/Footer';
import ProdottoIntro from './shared/ProdottoIntro';
import ProdottoVarieta from './shared/ProdottoVarieta';
import CalendarioRaccolta from './shared/CalendarioRaccolta';
import ProdottoEditoriale from './shared/ProdottoEditoriale';
import ShopBannerProdotto from './shared/ShopBannerProdotto';

export default function LimoneFemminello() {
  return (
    <main>
      <ProdottoIntro
        rows={[
          { text: 'LIMONE' },
          { text: 'FEMMINELLO', indent: '1.5em' },
          { text: 'SIRACUSANO' },
        ]}
        align="left"
        subtitle="La varietà autoctona siciliana con tre raccolti l'anno"
        body={[
          'Il Limone Femminello Siracusano IGP è una delle cultivar di limone più antiche e rappresentative della Sicilia orientale. Il nome «femminello» deriva dalla sua elevata produttività: la pianta può produrre fino a tre raccolti all\'anno, chiamati Primofiore (autunno), Bianchetto (primavera) e Verdello (estate).',
          'Coltivato in biologico nella zona IGP di Siracusa, il Femminello si distingue per il succo abbondante, l\'acidità elevata e la scorza ricca di olio essenziale. È apprezzato sia per il consumo fresco che per l\'uso in pasticceria e preparazioni artigianali.',
        ]}
      />

      <ProdottoVarieta
        name="CARATTERISTICHE"
        slogan="Tre raccolti, un profumo inconfondibile"
        image={{
          src: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&q=80&fit=crop',
          alt: 'Limone Femminello Siracusano IGP',
        }}
      >
        <p>Il Femminello ha frutto di pezzatura media, forma ellittica con mamelone apicale pronunciato. La buccia è sottile e ricca di ghiandole oleifere, il succo è abbondante e con elevata acidità.</p>
        <ul>
          <li>Buccia giallo brillante a maturità piena, sottile e profumata</li>
          <li>Succo abbondante e acido, con basso contenuto di semi</li>
          <li>Scorza ricca di olio essenziale di alta qualità</li>
          <li>Tre raccolti naturali nell&apos;arco dell&apos;anno (Primofiore, Bianchetto, Verdello)</li>
        </ul>
      </ProdottoVarieta>

      <ProdottoVarieta
        name="TRE RACCOLTI"
        slogan="Primofiore, Bianchetto, Verdello"
        image={{
          src: 'https://images.unsplash.com/photo-1592420114272-8e29c41a8c6a?w=600&q=80&fit=crop',
          alt: 'Limoni in diverse fasi di maturazione',
        }}
        reverse
      >
        <p><strong>Primofiore</strong> (ottobre–febbraio): il raccolto principale. Frutto con buccia gialla, di qualità superiore, con il maggior contenuto di succo e il profilo aromatico più equilibrato.</p>
        <p><strong>Bianchetto</strong> (marzo–giugno): frutto leggermente più piccolo, buccia verde-gialla. Succo molto acido, ideale per uso culinario e conserve.</p>
        <p><strong>Verdello</strong> (luglio–settembre): frutto estivo, buccia verde anche a maturità. Profumato, con meno succo rispetto agli altri due raccolti.</p>
      </ProdottoVarieta>

      <ProdottoVarieta
        name="USI CONSIGLIATI"
        slogan="In cucina, pasticceria e non solo"
        image={{
          src: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&fit=crop',
          alt: 'Limone in cucina',
        }}
      >
        <ul>
          <li>Succo fresco per condire, marinare e preparare bevande</li>
          <li>Scorza grattugiata in dolci, pasta fresca, risotti</li>
          <li>Marmellata di limone (molto acida e profumata)</li>
          <li>Limoncello artigianale con la scorza del Verdello</li>
          <li>Conserve sotto sale con i Bianchetti</li>
        </ul>
      </ProdottoVarieta>

      <CalendarioRaccolta activeMonths={[1, 2, 3, 4, 5, 6, 10, 11, 12]} />

      <ProdottoEditoriale title="Limone Femminello Siracusano IGP: cosa garantisce la certificazione">
        <p>Il marchio IGP (Indicazione Geografica Protetta) tutela i limoni prodotti nella zona di Siracusa con la varietà Femminello. Il disciplinare impone requisiti precisi su varietà, zona di coltivazione, calibro e qualità del succo — con un tenore minimo di acido citrico del 5,5%.</p>
        <p>La certificazione IGP garantisce che ogni limone sia coltivato, raccolto e condizionato nella zona delimitata, tracciabile dal campo alla confezione. La nostra produzione biologica aggiunge un livello ulteriore di garanzia: nessun pesticida, nessun concime di sintesi.</p>
      </ProdottoEditoriale>

      <ShopBannerProdotto />

      <Footer />
    </main>
  );
}
