import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import ProdottoIntro from '@/components/prodotti/shared/ProdottoIntro';
import ShopBannerProdotto from '@/components/prodotti/shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from '@/components/prodotti/shared/FaqProdotto';
import SectionZigzag from './shared/SectionZigzag';
import styles from './shared/SectionZigzag.module.css';
import type { PaginaSostenibilita } from '@/lib/types';

const FAQS: FaqItem[] = [
  {
    q: "Cosa significa 'magazzino a emissioni zero'?",
    a: 'Significa che le attività di lavorazione e movimentazione interne non producono emissioni dirette di CO₂, grazie all\'utilizzo di energia rinnovabile autoprodotta (fotovoltaico + accumulo) e di mezzi di trasporto elettrici per le operazioni aziendali.',
  },
  {
    q: "Quanto produce l'impianto fotovoltaico Badiula?",
    a: "L'impianto ha una potenza nominale di 200 kW, supportato da un sistema di accumulo da 400 kW che permette di utilizzare l'energia accumulata nelle fasi di picco produttivo.",
  },
  {
    q: "Come gestite l'acqua per l'irrigazione?",
    a: "Utilizziamo due laghetti aziendali per la raccolta delle acque, irrigazione a goccia su tutti i 120 ettari, e sensori di umidità del suolo che regolano l'irrigazione in funzione del reale fabbisogno delle piante.",
  },
];

const FALLBACK_SEZIONE_1_TESTO =
  '<p>Il nostro centro di lavorazione di Carlentini è progettato per operare a emissioni zero. Tutte le attività di movimentazione interna vengono tramite mezzi elettrici, così come il trasporto aziendale tra campi e magazzino, effettuato con camion elettrici.</p>' +
  '<p><strong>Impianto fotovoltaico e sistema di accumulo</strong></p>' +
  '<p>Il sistema energetico è alimentato da:</p>' +
  '<ul>' +
  '<li>Impianto fotovoltaico da 200 kW installato sulle coperture del centro di lavorazione</li>' +
  '<li>Sistema di accumulo da 400 kW che permette di immagazzinare l\'energia prodotta durante il giorno e utilizzarla nelle fasi di picco operativo</li>' +
  '</ul>' +
  '<p>Questa configurazione rende il nostro centro energeticamente autosufficiente e a basso impatto ambientale, riducendo drasticamente la dipendenza da fonti energetiche fossili.</p>';

const FALLBACK_SEZIONE_2_TESTO =
  '<p>La gestione dell\'acqua è uno dei temi più critici dell\'agricoltura mediterranea, ancora più rilevante alla luce dei cambiamenti climatici in corso. Badiula adotta tre soluzioni integrate:</p>' +
  '<ul>' +
  '<li>Due laghetti aziendali per la raccolta e l\'accumulo delle acque</li>' +
  '<li>Irrigazione a goccia su tutti i 120 ettari coltivati per ottimizzare il consumo idrico</li>' +
  '<li>Sistemi intelligenti di monitoraggio climatico con sensori in campo e stazioni meteo</li>' +
  '</ul>' +
  '<p>Le soluzioni di gestione idrica sono state sviluppate anche grazie alla collaborazione con il Distretto Produttivo Agrumi di Sicilia e con l\'Università degli Studi di Catania.</p>' +
  '<p><strong class="' + styles.subheading + '">Filiera a basso impatto</strong></p>' +
  '<p>Tutta la filiera Badiula è progettata per minimizzare l\'impatto ambientale: filiera corta (dalla raccolta alla lavorazione pochi chilometri), packaging ottimizzato, trasporto su gomma elettrico per i tratti interni.</p>';

interface SostenibilitaProps {
  data: PaginaSostenibilita;
}

export default function Sostenibilita({ data: d }: SostenibilitaProps) {
  return (
    <main>
      <ProdottoIntro
        rows={[{ text: d.heroTitolo || 'SOSTENIBILITÀ' }]}
        align="left"
        subtitle={d.heroSottotitolo || 'Energie rinnovabili, gestione idrica intelligente, emissioni zero'}
        subtitleNoWrap
        body={
          d.heroTesto
            ? d.heroTesto.split('\n')
            : [
                "La sostenibilità ambientale è parte integrante del modello produttivo Badiula. Operiamo secondo principi di agricoltura responsabile che integrano energie rinnovabili, gestione efficiente delle risorse idriche e riduzione costante dell'impatto ambientale lungo tutta la filiera.",
                "Non è un programma di 'compensazione' delle emissioni: è una scelta strutturale che parte dalla progettazione del centro di lavorazione e arriva alla gestione quotidiana delle coltivazioni.",
              ]
        }
      />

      <Reveal>
        <SectionZigzag
          title={d.sezione1Titolo || 'Magazzino a emissioni zero'}
          image={{ src: d.sezione1Immagine || '/images/sostenibilita.jpg' }}
          imageAlt="Impianto fotovoltaico sul centro di lavorazione Badiula"
          imageHeight="110vh"
        >
          <div dangerouslySetInnerHTML={{ __html: d.sezione1Testo || FALLBACK_SEZIONE_1_TESTO }} />
        </SectionZigzag>
      </Reveal>

      <Reveal>
        <SectionZigzag
          title={d.sezione2Titolo || 'Gestione delle risorse idriche'}
          reverse
          pullUp={80}
          image={{ src: d.sezione2Immagine || '/images/DJI_0010.jpg' }}
          imageAlt="Irrigazione a goccia e gestione idrica negli agrumeti Badiula"
          imageHeight="110vh"
        >
          <div dangerouslySetInnerHTML={{ __html: d.sezione2Testo || FALLBACK_SEZIONE_2_TESTO }} />
        </SectionZigzag>
      </Reveal>

      <FaqProdotto items={FAQS} />

      <ShopBannerProdotto />

      <Footer />
    </main>
  );
}
