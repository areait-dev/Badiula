// Centralised, typed content for the Badiula site.
// All components read from here instead of hardcoding strings.

export const MONTHS_IT = [
  'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
  'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic',
] as const;

export interface AltSection {
  /** Heading for the alternating image/text block */
  heading: string;
  body: string;
  /** Whether the placeholder image sits on the left (default right) */
  imageLeft?: boolean;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Product {
  slug: string;
  name: string;
  /** CSS background for the card */
  bg: string;
  /** Stock photo URL for the card image */
  image: string;
  /** Short description used in cards and listing */
  description: string;
  /** Italic subtitle on the product page */
  subtitle: string;
  /** Long body text on the product page */
  body: string;
  /** Active harvest months as 1-12 indices */
  harvest: number[];
  sections: AltSection[];
  faqs: Faq[];
}

export const PRODUCTS: Product[] = [
  {
    slug: 'arance-rosse-igp',
    name: 'Arance Rosse di Sicilia IGP',
    bg: 'var(--vanilla)',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80&fit=crop',
    description:
      'Varietà Tarocco e Moro, certificate IGP, coltivate nella zona di elezione delle arance rosse siciliane. Raccolta da dicembre ad aprile.',
    subtitle:
      'Il frutto simbolo della nostra terra, baciato dal sole e dal vulcano',
    body: 'Le Arance Rosse di Sicilia IGP nascono dall’incontro tra il terreno vulcanico dell’Etna e gli sbalzi termici tra giorno e notte, che ne accendono la polpa di un rosso profondo. Coltivate secondo metodo biologico, racchiudono un equilibrio unico di dolcezza, acidità e profumo.',
    harvest: [12, 1, 2, 3, 4],
    sections: [
      {
        heading: 'Il colore del vulcano',
        body: 'Gli antociani, pigmenti che colorano la polpa, si sviluppano grazie alle escursioni termiche tipiche delle pendici etnee. Ogni frutto è diverso, segno di una coltivazione autentica e non forzata.',
      },
      {
        heading: 'Raccolta a maturazione',
        body: 'Raccogliamo le arance solo al giusto grado di maturazione, a mano, per garantire dolcezza e integrità. Dalla pianta alla spedizione passano poche ore.',
        imageLeft: true,
      },
    ],
    faqs: [
      {
        q: 'Qual è il periodo di raccolta?',
        a: 'Le Arance Rosse si raccolgono da dicembre ad aprile, con il picco di colore tra gennaio e marzo.',
      },
      {
        q: 'Sono certificate biologiche?',
        a: 'Sì, tutte le nostre coltivazioni sono certificate biologiche e a marchio IGP.',
      },
      {
        q: 'Come vengono spedite?',
        a: 'Spediamo in cassette fresche entro 24-48 ore dalla raccolta, in tutta Italia.',
      },
    ],
  },
  {
    slug: 'arance-bionde',
    name: 'Arance Bionde',
    bg: 'var(--teal)',
    image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=800&q=80&fit=crop',
    description:
      'Varietà Newhall (Navel precoce) e Lane Late (Navel tardiva), per una continuità di offerta da novembre a giugno.',
    subtitle: 'La dolcezza luminosa delle nostre arance da spremuta',
    body: 'Le Arance Bionde Badiula sono varietà a polpa chiara, succose e ricche di vitamina C. Perfette per spremute fresche, sono il frutto quotidiano della tradizione siciliana.',
    harvest: [11, 12, 1, 2, 3, 4, 5],
    sections: [
      {
        heading: 'Succo e freschezza',
        body: 'Resa elevata in succo e profumo agrumato deciso. Ideali per la colazione di ogni giorno.',
      },
      {
        heading: 'Una lunga stagione',
        body: 'Grazie alle diverse varietà coltivate, le arance bionde accompagnano una stagione lunga, da novembre a maggio.',
        imageLeft: true,
      },
    ],
    faqs: [
      {
        q: 'Sono adatte alla spremuta?',
        a: 'Assolutamente sì: hanno un’alta resa in succo e un sapore equilibrato.',
      },
      {
        q: 'Contengono semi?',
        a: 'Le nostre varietà principali sono quasi prive di semi.',
      },
    ],
  },
  {
    slug: 'limone-femminello',
    name: 'Limone Femminello Siracusano',
    bg: 'var(--white)',
    image: '/images/limoni.jpg',
    description:
      'Varietà storica del territorio siracusano, ricca di oli essenziali e con produzione prolungata durante l\'anno.',
    subtitle: 'L’oro profumato della costa ionica',
    body: 'Il Limone Femminello Siracusano IGP è celebre per l’intensità del suo aroma e la ricchezza di oli essenziali nella buccia. Una varietà rifiorente che dona frutti più volte l’anno.',
    harvest: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    sections: [
      {
        heading: 'Rifiorente tutto l’anno',
        body: 'Il Femminello produce diverse fioriture, regalando limoni freschi in quasi ogni stagione, con caratteristiche aromatiche differenti.',
      },
      {
        heading: 'Buccia preziosa',
        body: 'La scorza, ricca di oli essenziali, è ideale in cucina e per la preparazione di liquori e conserve.',
        imageLeft: true,
      },
    ],
    faqs: [
      {
        q: 'La buccia è trattata?',
        a: 'No, essendo biologica la buccia è edibile e perfetta per scorze e canditi.',
      },
      {
        q: 'Quante raccolte ci sono?',
        a: 'Essendo rifiorente, il Femminello offre più raccolte distribuite durante l’anno.',
      },
    ],
  },
  {
    slug: 'bergamotto',
    name: 'Bergamotto Biologico Siciliano',
    bg: '#D9CE8E',
    image: 'https://images.unsplash.com/photo-1609639643505-3c158a56de42?w=800&q=80&fit=crop',
    description:
      'Coltivazione biologica di uno degli agrumi più aromatici del Mediterraneo, raccolto da novembre a febbraio.',
    subtitle: 'Un agrume raro dal profumo inconfondibile',
    body: 'Il Bergamotto biologico è un agrume prezioso, apprezzato per il suo profumo unico e i suoi oli essenziali. Trova impiego in cucina, in profumeria e nella preparazione di infusi.',
    harvest: [11, 12, 1, 2],
    sections: [
      {
        heading: 'Aroma e profumo',
        body: 'L’olio essenziale di bergamotto è ricercato in profumeria; la scorza profuma dolci, tè e liquori.',
      },
      {
        heading: 'Coltivazione attenta',
        body: 'Coltivato senza pesticidi, il nostro bergamotto rispetta i ritmi naturali della pianta.',
        imageLeft: true,
      },
    ],
    faqs: [
      {
        q: 'Si può mangiare fresco?',
        a: 'È molto aspro: si usa soprattutto per scorza, succo aromatico e trasformati.',
      },
    ],
  },
  {
    slug: 'pompelmo',
    name: 'Pompelmo Biologico',
    bg: '#A6B7A0',
    image: '/images/pompelmo.jpg',
    description:
      'Pompelmo biologico siciliano, raccolto da gennaio ad aprile, apprezzato per il consumo fresco e nella ristorazione di qualità.',
    subtitle: 'Freschezza dissetante dal cuore della Sicilia',
    body: 'Il nostro Pompelmo biologico unisce note dolci e amare in un frutto succoso e ricco di proprietà. Perfetto a colazione, in spremuta o nelle insalate.',
    harvest: [12, 1, 2, 3, 4, 5],
    sections: [
      {
        heading: 'Dolce e amaro',
        body: 'Un equilibrio aromatico che lo rende dissetante e versatile, dal dolce al salato.',
      },
      {
        heading: 'Biologico al 100%',
        body: 'Nessun trattamento chimico: solo sole, terra e acqua siciliana.',
        imageLeft: true,
      },
    ],
    faqs: [
      {
        q: 'Quando è in stagione?',
        a: 'Il pompelmo si raccoglie da dicembre a maggio.',
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export interface CompanySection {
  eyebrow: string;
  heading: string;
  body: string;
}

export const COMPANY_SECTIONS: CompanySection[] = [
  {
    eyebrow: 'Chi siamo',
    heading: 'QUATTRO GENERAZIONI, UNA TERRA',
    body: 'La nostra storia nasce nelle campagne di Carlentini, dove da oltre un secolo la famiglia coltiva agrumi con passione e rispetto per i cicli naturali. Ogni albero racconta il lavoro di chi ci ha preceduto.',
  },
  {
    eyebrow: 'Il territorio',
    heading: 'TRA IL MARE E LA TERRA',
    body: 'Tra la brezza del mare Ionio e la fertilità dei terreni vulcanici, le nostre coltivazioni trovano l’equilibrio perfetto. Un microclima unico che dona agli agrumi profumo, dolcezza e carattere.',
  },
  {
    eyebrow: 'Il processo',
    heading: 'FILIERA E LAVORAZIONE',
    body: 'Dal campo al confezionamento, controlliamo ogni fase della filiera. Il nostro centro di lavorazione garantisce freschezza e tracciabilità, portando in tavola agrumi autentici.',
  },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: 120, suffix: ' ha', label: 'Ettari coltivati' },
  { value: 4, suffix: '', label: 'Generazioni' },
  { value: 100, suffix: '%', label: 'Biologico certificato' },
];
