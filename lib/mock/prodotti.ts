export interface Variante {
  etichetta: string;
  prezzo: number; // in euro, e.g. 12.50
}

export interface Prodotto {
  id: string;
  slug: string;
  nome: string;
  sottotitolo: string;
  descrizioneBreve: string;
  immagine: string;
  cutoutImage?: string;
  badge?: string;
  coloreSfondo: 'khaki' | 'teal' | 'vanilla';
  categoria: 'coltivazioni' | 'luce-di-terra';
  slugPagina: string;
  varianti: Variante[];
  stock: number; // 0 = esaurito
}

export const prodotti: Prodotto[] = [
  {
    id: 'arance-rosse-igp',
    slug: 'arance-rosse-igp',
    nome: 'Arance Rosse IGP',
    sottotitolo: 'Il frutto simbolo della nostra terra, baciato dal sole e dal vulcano',
    descrizioneBreve:
      'Polpa rosso intenso, ricca di antociani. Dolce e leggermente acidula, simbolo della Sicilia orientale.',
    immagine:
      'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80&fit=crop',
    cutoutImage: '/images/cutout/arancia-rossa.png',
    badge: 'IGP',
    coloreSfondo: 'khaki',
    categoria: 'coltivazioni',
    slugPagina: '/coltivazioni/arance-rosse-igp',
    varianti: [
      { etichetta: 'Box 5 kg', prezzo: 18.9 },
      { etichetta: 'Box 10 kg', prezzo: 32.5 },
      { etichetta: 'Box 15 kg', prezzo: 44.9 },
    ],
    stock: 50,
  },
  {
    id: 'arance-bionde',
    slug: 'arance-bionde',
    nome: 'Arance Bionde',
    sottotitolo: 'La dolcezza luminosa delle nostre arance da spremuta',
    descrizioneBreve:
      'Succose e profumate, perfette da spremere. Un classico della nostra raccolta invernale.',
    immagine:
      'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=800&q=80&fit=crop',
    cutoutImage: '/images/cutout/arancia-bionda.png',
    badge: 'Bio',
    coloreSfondo: 'teal',
    categoria: 'coltivazioni',
    slugPagina: '/coltivazioni/arance-bionde',
    varianti: [
      { etichetta: 'Box 5 kg', prezzo: 16.5 },
      { etichetta: 'Box 10 kg', prezzo: 29.9 },
      { etichetta: 'Box 15 kg', prezzo: 41.9 },
    ],
    stock: 80,
  },
  {
    id: 'limone-femminello',
    slug: 'limone-femminello',
    nome: 'Limone Femminello Siracusano',
    sottotitolo: "L'oro profumato della costa ionica",
    descrizioneBreve:
      'Aroma intenso e buccia ricca di oli essenziali. Eccellenza IGP del territorio siracusano.',
    immagine:
      'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&q=80&fit=crop',
    badge: 'IGP',
    coloreSfondo: 'vanilla',
    categoria: 'coltivazioni',
    slugPagina: '/coltivazioni/limone-femminello',
    varianti: [
      { etichetta: 'Box 5 kg', prezzo: 19.9 },
      { etichetta: 'Box 10 kg', prezzo: 35.9 },
      { etichetta: 'Box 15 kg', prezzo: 49.9 },
    ],
    stock: 60,
  },
  {
    id: 'bergamotto',
    slug: 'bergamotto',
    nome: 'Bergamotto Bio',
    sottotitolo: 'Un agrume raro dal profumo inconfondibile',
    descrizioneBreve:
      'Profumo agrumato e fresco, raro e prezioso. Ideale per uso alimentare e cosmetico.',
    immagine:
      'https://images.unsplash.com/photo-1609639643505-3c158a56de42?w=800&q=80&fit=crop',
    badge: 'Stagionale',
    coloreSfondo: 'vanilla',
    categoria: 'coltivazioni',
    slugPagina: '/coltivazioni/bergamotto',
    varianti: [
      { etichetta: 'Box 3 kg', prezzo: 22.9 },
      { etichetta: 'Box 5 kg', prezzo: 34.9 },
    ],
    stock: 25,
  },
  {
    id: 'pompelmo',
    slug: 'pompelmo',
    nome: 'Pompelmo Bio',
    sottotitolo: 'Freschezza dissetante dal cuore della Sicilia',
    descrizioneBreve:
      'Equilibrio tra dolce e amaro, succoso e dissetante. Coltivato senza pesticidi.',
    immagine:
      'https://images.unsplash.com/photo-1432457990754-c8b5f21448de?w=800&q=80&fit=crop',
    badge: 'Bio',
    coloreSfondo: 'vanilla',
    categoria: 'coltivazioni',
    slugPagina: '/coltivazioni/pompelmo',
    varianti: [
      { etichetta: 'Box 5 kg', prezzo: 20.9 },
      { etichetta: 'Box 10 kg', prezzo: 37.9 },
    ],
    stock: 0,
  },
  {
    id: 'olio-evo',
    slug: 'olio-evo',
    nome: 'Olio EVO Luce di Terra',
    sottotitolo: 'Olio extravergine di oliva biologico, estratto a freddo',
    descrizioneBreve:
      'Fruttato, erbaceo, identità siciliana in ogni goccia. Filiera corta, dalla pianta alla bottiglia.',
    immagine:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&fit=crop',
    badge: 'Estratto a freddo',
    coloreSfondo: 'teal',
    categoria: 'luce-di-terra',
    slugPagina: '/luce-di-terra/olio-evo',
    varianti: [
      { etichetta: 'Bottiglia 250 ml', prezzo: 12.9 },
      { etichetta: 'Bottiglia 500 ml', prezzo: 22.9 },
      { etichetta: 'Bottiglia 750 ml', prezzo: 31.9 },
    ],
    stock: 40,
  },
  {
    id: 'marmellata-arance-rosse',
    slug: 'marmellata-arance-rosse',
    nome: 'Marmellata Arance Rosse',
    sottotitolo: 'Confettura biologica preparata con le nostre arance rosse IGP',
    descrizioneBreve:
      'Preparata con frutta biologica coltivata nei nostri campi, senza conservanti.',
    immagine:
      'https://images.unsplash.com/photo-1597528380307-aa63f8f2b9c5?w=800&q=80&fit=crop',
    badge: 'Artigianale',
    coloreSfondo: 'vanilla',
    categoria: 'luce-di-terra',
    slugPagina: '/luce-di-terra/marmellate',
    varianti: [
      { etichetta: 'Vasetto 230 g', prezzo: 6.9 },
      { etichetta: 'Cofanetto 3 vasetti', prezzo: 18.9 },
    ],
    stock: 90,
  },
];
