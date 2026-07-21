import type { Prodotto } from './prodotti';

// I 5 barattoli Luce di Terra (pesti, confetture, marmellata) per LuceDiTerraShop.
// coloreSfondo è richiesto dal tipo Prodotto (usato solo dalla card mobile) ma non
// pilota più i colori dei pannelli desktop, fissi per l'intero componente.
export const luceDiTerraProdotti: Prodotto[] = [
  {
    id: 'olio-evo',
    slug: 'olio-evo',
    nome: 'Olio EVO Luce di Terra',
    sottotitolo: 'Olio extravergine di oliva biologico, estratto a freddo',
    descrizioneBreve:
      'Fruttato, erbaceo, identità siciliana in ogni goccia. Filiera corta, dalla pianta alla bottiglia.',
    immagine:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&fit=crop',
    cutoutImage: '/images/luce-di-terra/olio-evo-cutout.png',
    badge: 'Luce di Terra',
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
    id: 'pesto-carciofi-siciliano',
    slug: 'pesto-carciofi-siciliano',
    nome: 'Pesto ai Carciofi Siciliano',
    sottotitolo: 'Il gusto intenso dei carciofi della nostra terra',
    descrizioneBreve:
      'Carciofi siciliani lavorati artigianalmente, senza conservanti. Perfetto su crostini o pasta.',
    immagine: '/images/luce-di-terra/olio-evo-cutout.png',
    cutoutImage: '/images/luce-di-terra/olio-evo-cutout.png',
    badge: 'Luce di Terra',
    coloreSfondo: 'vanilla',
    categoria: 'luce-di-terra',
    slugPagina: '/luce-di-terra',
    varianti: [
      { etichetta: 'Vasetto 190 g', prezzo: 7.9 },
      { etichetta: 'Cofanetto 3 vasetti', prezzo: 20.9 },
    ],
    stock: 45,
  },
  {
    id: 'pesto-pomodori-secchi',
    slug: 'pesto-pomodori-secchi',
    nome: 'Pesto di Pomodori Secchi',
    sottotitolo: 'Sapore mediterraneo concentrato al sole',
    descrizioneBreve:
      'Pomodori essiccati e lavorati secondo tradizione, per un condimento ricco e saporito.',
    immagine: '/images/luce-di-terra/olio-evo-cutout.png',
    cutoutImage: '/images/luce-di-terra/olio-evo-cutout.png',
    badge: 'Luce di Terra',
    coloreSfondo: 'vanilla',
    categoria: 'luce-di-terra',
    slugPagina: '/luce-di-terra',
    varianti: [
      { etichetta: 'Vasetto 190 g', prezzo: 7.9 },
      { etichetta: 'Cofanetto 3 vasetti', prezzo: 20.9 },
    ],
    stock: 45,
  },
  {
    id: 'confettura-peperoncini',
    slug: 'confettura-peperoncini',
    nome: 'Confettura di Peperoncini',
    sottotitolo: 'Un tocco piccante per la tua tavola',
    descrizioneBreve:
      'Confettura extra dal carattere deciso, ideale per formaggi stagionati e carni.',
    immagine: '/images/luce-di-terra/olio-evo-cutout.png',
    cutoutImage: '/images/luce-di-terra/olio-evo-cutout.png',
    badge: 'Luce di Terra',
    coloreSfondo: 'vanilla',
    categoria: 'luce-di-terra',
    slugPagina: '/luce-di-terra',
    varianti: [
      { etichetta: 'Vasetto 230 g', prezzo: 6.9 },
      { etichetta: 'Cofanetto 3 vasetti', prezzo: 18.9 },
    ],
    stock: 60,
  },
  {
    id: 'confettura-fichi-dindia',
    slug: 'confettura-fichi-dindia',
    nome: "Confettura di Fichi d'India",
    sottotitolo: 'La dolcezza esotica del fico d\'India siciliano',
    descrizioneBreve:
      'Preparata con fichi d\'India raccolti a piena maturazione, dolce e naturale.',
    immagine: '/images/luce-di-terra/olio-evo-cutout.png',
    cutoutImage: '/images/luce-di-terra/olio-evo-cutout.png',
    badge: 'Luce di Terra',
    coloreSfondo: 'vanilla',
    categoria: 'luce-di-terra',
    slugPagina: '/luce-di-terra',
    varianti: [
      { etichetta: 'Vasetto 230 g', prezzo: 6.9 },
      { etichetta: 'Cofanetto 3 vasetti', prezzo: 18.9 },
    ],
    stock: 60,
  },
  {
    id: 'marmellata-limoni-verdelli',
    slug: 'marmellata-limoni-verdelli',
    nome: 'Marmellata di Limoni Verdelli',
    sottotitolo: "L'agrume raro dal sapore intenso",
    descrizioneBreve:
      'Limoni Verdelli siciliani trasformati in marmellata artigianale, aromatica e vivace.',
    immagine: '/images/luce-di-terra/olio-evo-cutout.png',
    cutoutImage: '/images/luce-di-terra/olio-evo-cutout.png',
    badge: 'Luce di Terra',
    coloreSfondo: 'vanilla',
    categoria: 'luce-di-terra',
    slugPagina: '/luce-di-terra',
    varianti: [
      { etichetta: 'Vasetto 230 g', prezzo: 6.9 },
      { etichetta: 'Cofanetto 3 vasetti', prezzo: 18.9 },
    ],
    stock: 60,
  },
];
