# CLAUDE.md — Badiula Design System
> Azienda agricola biologica siciliana | E-commerce agrumi, olio EVO, marmellate
> Stack: Next.js (App Router) · TypeScript · Tailwind CSS · WordPress Headless (REST API) · ACF free · ISR

> ⚠️ REGOLE FISSE — leggere prima di ogni intervento:
> 1. Scala tipografica: solo i 7 livelli definiti in §3 — mai px fuori scala
> 2. Colori: solo token CSS da §2 — mai valori hardcoded
> 3. Il CLAUDE.md vince sempre sulle skill installate
> 4. Mai toccare il testo dei contenuti
> 5. Mostrare sempre il diff prima di modificare layout esistenti

---

## 1. IDENTITÀ DEL BRAND

**Badiula** è un'azienda agricola biologica di Carlentini (SR), quattro generazioni di storia.
Il tono è: **autentico, lento, radicato**. Mai iper-commerciale. La terra viene prima del prodotto.

### Linee di prodotto
- **Agrumi** → Arance Rosse IGP (Tarocco, Moro), Arance Bionde (Newhall, Lane Late), Limone Femminello Siracusano, Bergamotto Bio, Pompelmo Bio
- **Luce di Terra** → Olio EVO biologico, Marmellate di agrumi
- Spedizioni in Italia e UE. Box stagionali e formato regalo.

---

## 2. COLOR TOKENS

```css
:root {
  /* Primari */
  --color-bordeaux:     #6C1224; /* Night Bordeaux — colore dominante, CTA, titoli hero */
  --color-dark:         #16161D; /* Eigengrau — testi body, footer bg */
  --color-white:        #FFFFFF; /* Sfondi primari, testo su scuro */

  /* Secondari */
  --color-khaki:        #C4B59B; /* Khaki — accenti caldi, card background prodotti */
  --color-vanilla:      #EEE6B8; /* Vanilla Custard — sezioni alternate, banner */
  --color-teal:         #889C82; /* Muted Teal — card arance bionde, elementi neutri */

  /* Alias semantici */
  --color-primary:      var(--color-bordeaux);
  --color-surface:      var(--color-white);
  --color-surface-alt:  var(--color-vanilla);
  --color-text:         var(--color-dark);
  --color-text-inverse: var(--color-white);
  --color-accent:       var(--color-khaki);
  --color-muted:        var(--color-teal);
}
```

### Regole di utilizzo colori
- `--color-bordeaux` → titoli hero, CTA primari, icone, link attivi, bordi focus
- `--color-vanilla` → sfondi sezioni secondarie (es. "Le nostre produzioni"), footer CTA banner
- `--color-khaki` → card background arance rosse, hover button outline
- `--color-teal` → card background arance bionde / limoni, badge biologico
- `--color-dark` → body text, navbar su sfondo chiaro
- **Non usare mai** colori fuori dalla palette senza approvazione esplicita

---

## 3. TYPOGRAPHY

### Font families
```css
:root {
  --font-display: 'Gravesend Sans', sans-serif;  /* Solo Hero H1 — uso rarissimo */
  --font-primary: 'Mr Eaves Mod OT', sans-serif; /* Tutto il resto */
}
```

> ⚠️ Gravesend Sans è **esclusivamente** per l'Headline 1 Hero (uppercase, bold).
> Mr Eaves Mod OT copre tutti gli altri livelli tipografici.

### Scala tipografica
```css
:root {
  /* Headings */
  --text-h1-hero:   110px / 122px  Gravesend Sans Bold  /* Hero fullscreen */
  --text-h1:        110px / 122px  Mr Eaves Mod OT Bold
  --text-h2:         80px / 89px   Mr Eaves Mod OT Bold
  --text-h3:         60px / 66px   Mr Eaves Mod OT Bold /* italic nelle sottotitolazioni */
  --text-h4:         40px / 45px   Mr Eaves Mod OT Bold

  /* Body — valori web-standard */
  --text-body-1:     20px / 32px   Mr Eaves Mod OT Regular  /* testi principali */
  --text-body-2:     16px / 26px   Mr Eaves Mod OT Regular  /* testi secondari */
}
```

### Regole tipografiche
- Titoli di pagina → sempre **UPPERCASE** (es. `COLTIVAZIONI`, `AZIENDA`)
- Sottotitoli H3 → **italic**, sentence case (es. *Quattro generazioni, una terra*)
- H4 / sezioni interne → bold, sentence case
- Body text → Regular, mai bold nel body
- Letter spacing → sempre 0px (non modificare)
- Non usare font system come fallback visibile: caricare sempre i font custom

---

## 4. SPACING & LAYOUT

```css
:root {
  --space-xs:   8px;
  --space-sm:  16px;
  --space-md:  24px;
  --space-lg:  48px;
  --space-xl:  80px;
  --space-2xl: 120px;

  --radius-btn:      999px;   /* Bottoni — pill */
  --radius-card:       0px;  /* Card listing shop — bordi netti */
  --radius-card-soft:  12px; /* Card calendario, card FAQ */
  --radius-field:    999px;  /* Input form pill */
  --radius-modal:     16px;  /* Overlay search */
  --radius-banner:    16px;  /* Card carousel, box footer form, BannerPNRR */
  --radius-calendar:  12px;  /* Contenitore calendario raccolta */
  --radius-badge:    999px;  /* Badge categoria */
  --radius-dot:       50%;   /* Dot calendario attivo/inattivo */
}
```

### Grid
- Desktop: 12 colonne, gutter 24px, max-width 1440px
- Tablet: 8 colonne, gutter 16px
- Mobile: 4 colonne, gutter 16px, padding laterale 20px

### Sezioni alternanti
Il layout usa alternanza sinistra/destra per testo+immagine (pattern "zigzag"):
```
[IMMAGINE sx] [TESTO dx]
[TESTO sx]    [IMMAGINE dx]
```
Rispettare sempre questa alternanza nelle pagine di dettaglio prodotto.

---

## 5. COMPONENTI

### 5.1 Buttons

Tre varianti principali, tutte pill shape (`border-radius: 999px`):

#### DEFAULT (outline)
```
REST:     bordo bordeaux, testo bordeaux, bg trasparente
HOVER:    bg khaki (#C4B59B), bordo khaki, testo bordeaux
PRESS:    bg bordeaux (#6C1224), bordo bordeaux, testo bianco
DISABLE:  bordo grigio chiaro, testo grigio, bg trasparente, opacity 0.4
```

#### DEFAULT DARK (su sfondo scuro)
```
REST:     bordo bianco, testo bianco, bg trasparente
HOVER:    bg bianco, bordo bianco, testo bordeaux
PRESS:    bg bordeaux, bordo bordeaux, testo bianco
DISABLE:  bordo grigio, testo grigio, opacity 0.4
```

#### ICON (con freccia ►)
```
Stesse regole DEFAULT ma con icona freccia ► destra
Usato per: "Scopri di più ►"
```

#### FILLED PRIMARY (CTA principale e-commerce)
```
Usato per: "Aggiungi al Carrello", "Shop", "Invia"
REST:     bg bordeaux, testo bianco, icona carrello (se presente)
HOVER:    bg khaki, testo bordeaux
PRESS:    bg dark, testo bianco
DISABLE:  bg grigio, testo grigio chiaro
```

### Labels CTA standard
| Azione | Label |
|--------|-------|
| Esplora prodotto | `Scopri di più ►` |
| Scheda tecnica | `Scheda Tecnica` |
| Acquisto | `Aggiungi al Carrello` |
| Navigazione shop | `Shop` |
| Invio form | `Invia` |

---

### 5.2 Accordion

```
- Stile minimal: linea divisoria, nessun box/shadow
- Icona: + (chiuso) → - (aperto)
- Animazione: height transition 300ms ease
- Usato per: FAQ su tutte le pagine di prodotto
- Testo aperto: body-2 (20px/32px), colore dark
```

### 5.3 Search

```
- Overlay fullscreen su sfondo bianco
- Input con underline bordeaux (nessun border box)
- Icona lente bordeaux a sinistra
- Chiusura: × in alto a destra
- Placeholder: "Search for products or information"
- Nessun risultato mostrato a riposo (empty state pulito)
```

**Trigger:**
- Icona 🔍 già presente in `Header.tsx` / `Navbar.tsx`
- `onClick` → apre overlay fullscreen
- `onClose` → tasto × (top right) oppure tasto `Escape`
- Stato aperto/chiuso: `useState` in `Navbar.tsx`

### 5.4 Navigation

**Hamburger menu (full overlay):**
```
- Logo Badiula centrato
- × chiusura in alto a sinistra
- IT | EN in alto a destra
- Voci menu: H1 bold bordeaux, allineate a sinistra
- Voci con sottomenu: aggiungere ► a destra
- Metà destra: pannello immagine + CTA "Shop" fisso in basso
```

**Voci di navigazione principali:**
- AZIENDA
- COLTIVAZIONI ► (Arance Rosse IGP, Arance Bionde, Limone Femminello, Bergamotto, Pompelmo)
- LUCE DI TERRA ► (Olio EVO, Marmellate)
- FILIERA E LAVORAZIONE ► (Sostenibilità, Innovazione 4.0, Certificazioni)
- SHOP ► (Arance Rosse IGP, Arance Bionde, Limone Femminello, Bergamotto Bio, Pompelmo Bio)

**Header desktop:**
```
- Hamburger ≡ (sx) | Logo Badiula (centro) | 🔍 IT|EN (dx)
- Sticky, bg bianco, nessuna shadow
```

### 5.5 Form Fields

```css
/* Input standard */
border: none;
border-bottom: 1px solid var(--color-bordeaux);
border-radius: 999px; /* solo per variante "pill" */
background: transparent;
padding: 12px 20px;
font: var(--text-body-2);
color: var(--color-dark);

/* Placeholder */
color: rgba(22, 22, 29, 0.4);

/* Focus */
outline: none;
border-bottom-color: var(--color-bordeaux);
```

Form di contatto standard: Nome, Email, Telefono, Messaggio (textarea), Checkbox privacy, CTA "Invia".

### 5.6 Card Prodotto

```
Struttura:
┌─────────────────┐
│   IMMAGINE      │  ← aspect ratio 4:3, nessun radius
│                 │
├─────────────────┤
│ [bg colore var] │
│ NOME PRODOTTO   │  ← H4 bold uppercase, bordeaux
│ Sottotitolo     │  ← body-2 italic
│ Descrizione     │  ← body-2 regular, 2-3 righe max
│ [Scopri di più►]│  ← button outline
└─────────────────┘

Colori card per prodotto:
- Arance Rosse IGP  → bg: #C4B59B (khaki)
- Arance Bionde     → bg: #889C82 (teal)
- Limone Femminello → bg: #EEE6B8 (vanilla)
- Bergamotto        → bg: #EEE6B8 (vanilla)
- Pompelmo          → bg: #EEE6B8 (vanilla)
- Olio EVO          → bg: #889C82 (teal) con testo bianco
- Marmellate        → bg: #EEE6B8 (vanilla)
```

### 5.7 Calendario di Raccolta

Tabella mesi (GEN→DIC) con dot `●` bordeaux per i mesi attivi.
Usato in tutte le pagine di prodotto. Bordi sottili, sfondo vanilla.

### 5.8 Banner CTA (footer sezioni)

```
Pattern fisso a fondo pagina:
[Immagine hero donna con arance — sfondo giallo]
[Overlay teal scuro in basso]
  "Agrumi siciliani direttamente dal produttore"  ← H4 bianco
  Sottotesto body-2 bianco
  [Shop] ← button outline bianco
```

### 5.9 Accordion FAQ

Presente in fondo a ogni pagina di prodotto e sezione. Voce bordeaux bold, risposta body-2 dark, divisore linea sottile bordeaux.

---

### 5.10 Card Prodotto — Carousel Homepage

Le card nel carousel "Le nostre produzioni" usano `--radius-banner: 16px`, **non** `--radius-card: 0px`.

> ⚠️ `--radius-card: 0px` si applica **solo** alle card nella griglia shop/listing. Le card carousel hanno angoli arrotondati.

```css
.card-prodotto {
  width: 560px;
  height: 900px;
  border-radius: var(--radius-banner); /* 16px — angoli arrotondati */
  overflow: hidden; /* l'immagine rispetta il radius */
}

.card-prodotto__image {
  width: 560px;
  height: 463px;
  object-fit: cover;
  border-radius: 0; /* eredita clip dal contenitore */
}

.card-prodotto__body {
  padding-top: 45px;
  padding-left: var(--space-md);
  padding-right: var(--space-md);
  border-radius: 0 0 var(--radius-banner) var(--radius-banner); /* 16px solo angoli inferiori */
}
```

---

### 5.11 Card Prodotto Carousel — misure esatte

```css
.card-prodotto {
  width: 560px;
  height: 900px;
  border-radius: var(--radius-banner); /* 16px */
  overflow: hidden;
}
.card-prodotto__image {
  width: 560px;
  height: 463px;
  object-fit: cover;
}
.card-prodotto__title  { font-size: 50px; height: 150px; }
.card-prodotto__desc   { font-size: 24px; height: 90px; margin-top: 25px; }
.card-prodotto__cta    { height: 36px; margin-top: 25px; margin-bottom: 25px; }
/* padding-top area contenuto: 45px */
/* Mobile: width 85vw, altezze proporzionali con clamp() */
```

---

### 5.12 Vision/Mission

Layout 50/50 con divisore verticale `2px solid var(--color-bordeaux)` al centro.
VISION colonna sinistra — MISSION colonna destra.

```
Titolo: H2 uppercase bordeaux
Body: body-1 dark
Mobile: stack verticale, divisore diventa linea orizzontale
```

---

### 5.13 Silhouette Sicilia

SVG inline, colore: `var(--color-bordeaux)`
Dot Siracusa: `var(--color-khaki)`, 16px diameter
Max-width: 480px desktop / 100% mobile
**Solo pagina Azienda — mai altrove.**

---

### 5.14 Search Overlay

```css
.search-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-white);
  z-index: 100;
  padding: var(--space-xl);
}
.search-overlay__input {
  border: none;
  border-bottom: 2px solid var(--color-bordeaux);
  border-radius: 0; /* NO pill */
  font-size: 26px;
  padding: var(--space-sm) 0;
}
/* Trigger: icona search già in Navbar.tsx */
/* Chiusura: × top-right o tasto Escape */
```

---

### 5.15 Footer completo

```css
.footer { border-radius: var(--radius-banner); background: var(--color-dark); }
.footer__inner { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); padding: var(--space-xl); }
.footer__quote { font-size: 40px; line-height: 45px; font-weight: bold; font-style: italic; color: var(--color-white); }

/* Citazione su 4 righe esatte: */
/* Non produciamo<br/> */
/* semplicemente agrumi,<br/> */
/* coltiviamo un modo<br/> */
/* diverso di vivere la terra */

/* Titolo form */
.footer__form-title { font-size: 40px; line-height: 45px; font-weight: normal; color: var(--color-white); margin-bottom: var(--space-md); }

/* Input pill */
.footer__input { border-radius: var(--radius-field); border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.15); color: white; padding: 14px 24px; }
.footer__textarea { border-radius: 16px; min-height: 180px; }
.footer__submit { border-radius: var(--radius-btn); border: 1px solid white; background: transparent; color: white; display: block; margin: 0 auto; }

/* Mobile: grid 1 colonna */
```

---

### 5.16 BannerPNRR

```css
/* Posizione: ultima sezione del footer */
.bannerPNRR {
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-banner); /* 16px */
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  padding: var(--space-lg);
  margin-top: var(--space-xl);
  text-align: center;
}
.loghi { display: flex; justify-content: center; align-items: center; gap: var(--space-xl); }
.loghi img { height: 48px; filter: brightness(0) invert(1); }
/* Testi: color: rgba(255,255,255,0.85) */
/* Loghi in: public/loghi-pnrr/ue.png | italiadomani.png | ministero.png | invitalia.png */
```

---

## 6. ICONE

Set custom monocromatico bordeaux. Usare **solo** queste icone:

| Icona | Uso |
|-------|-----|
| ► ◄ | Navigazione, CTA, accordion |
| ▼ ▲ | Dropdown, scroll |
| 🛒 | Carrello (solo nei button "Aggiungi al Carrello") |
| ♥ ♡ | Wishlist |
| 🔍 | Search trigger |
| ≡ | Hamburger menu |
| ⊞ ⊟ | Vista griglia/lista prodotti |
| ☰ | Menu alternativo |
| □ | Checkbox |
| f in © ℗ | Social: Facebook, LinkedIn, Instagram, WhatsApp |

Colore icone: sempre `var(--color-bordeaux)` su sfondo chiaro, `var(--color-white)` su sfondo scuro.

---

## 7. LOGO

Quattro varianti:
1. **Simbolo + wordmark verticale** → su sfondo bianco (uso principale)
2. **Simbolo + wordmark orizzontale** → header desktop
3. **Solo simbolo** → favicon, icona app
4. **Versione negativa** → su sfondo bordeaux

Non modificare proporzioni, colori o spaziatura del logo.
Zona di rispetto: almeno 1× larghezza del simbolo su tutti i lati.

---

## 8. ELEMENTO IDENTITARIO

La **silhouette della Sicilia** in bordeaux con punto khaki su Siracusa è un elemento decorativo brand.
Usarla solo su pagine istituzionali (Azienda, Chi siamo). Mai nei listing prodotti.

---

## 9. PATTERN PAGINE

### Homepage
```
1. Hero fullscreen con foto agrumeto + titolo H1-hero
2. Sezione intro "Quattro generazioni, una terra" — testo libero senza <br/> forzati
3. Sezione "Le nostre produzioni" — carousel card orizzontale (scroll-snap)
4. Sezione "Luce di Terra" — split layout immagine/testo
5. Sezione "Tra il mare e la terra" + "Filiera e Lavorazione" — testo libero
6. Banner CTA "Agrumi siciliani direttamente dal produttore"
```

### Pagina Prodotto (PDP)
```
1. Titolo H1 uppercase bordeaux + sottotitolo H3 italic
2. Descrizione body-1
3. Sezioni alternanti (immagine + testo) per varietà
4. Calendario di raccolta
5. Sezione uso consigliato
6. Banner CTA shop
7. FAQ accordion
```

### Pagina Listing Shop
```
1. Hero banner con CTA shop
2. Filtri: icone griglia/lista
3. Grid card prodotti 3 colonne desktop / 2 tablet / 1 mobile
4. CTA sticky "Aggiungi al Carrello" su mobile
```

### Footer

Il footer funge anche da sezione contatti. Layout 50/50: colonna sinistra (logo, info, social) | colonna destra (form contatto).

```
Sfondo: var(--color-dark) — Eigengrau
Citazione: H4 bold italic bianco
```

Gli input del form sono **pill**, NON underline:

```css
.footer__input {
  border-radius: var(--radius-field); /* 999px — pill */
  border: 1px solid rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.15);
  color: var(--color-white);
  padding: 14px 24px;
  width: 100%;
}

.footer__textarea {
  border-radius: 16px; /* non pill — troppo alto */
  min-height: 180px;
  padding: 14px 24px;
}

.footer__submit {
  border-radius: var(--radius-btn); /* 999px */
  border: 1px solid var(--color-white);
  background: transparent;
  color: var(--color-white);
  display: block;
  margin: 0 auto; /* centrato */
}
```

> ⚠️ `--radius-field: 999px` si applica a **tutti** gli input del footer, desktop e mobile. La textarea usa `16px` per proporzioni visive.

---

## 10. REGOLE UX/UI

### Gerarchia visiva
1. Titolo H1 → sempre primo elemento visibile in viewport
2. Un solo CTA primario per sezione
3. Massimo 2 bottoni affiancati (primario + secondario)

### Stati interattivi
- Sempre definire: `rest`, `hover`, `press/active`, `disabled`, `focus`
- Focus: outline bordeaux 2px, offset 2px (accessibilità keyboard)
- Transizioni: `200ms ease` per hover, `150ms ease` per press

### Stati vuoti e feedback
- Carrello vuoto: icona carrello + "Nessun prodotto aggiunto" + CTA "Scopri lo shop"
- Ricerca senza risultati: "Nessun risultato per '[query]'" + suggerimento prodotti popolari
- Form inviato: messaggio inline bordeaux "Messaggio inviato. Ti risponderemo presto."
- Errore form: testo rosso sotto il campo, mai popup

### Loading
- Skeleton loader per card prodotti (no spinner generico)
- Colore skeleton: `#EEE6B8` (vanilla) con shimmer animation

### Responsive
- Breakpoints: 375px (xs) / 768px (md) / 1024px (lg) / 1440px (xl)
- Mobile-first sempre
- Touch target minimo: 44×44px
- Menu: hamburger sotto 1024px

---

## 11. COPY & TOV

### Tone of Voice
- **Autentico** → "coltiviamo", "la nostra terra", "quattro generazioni"
- **Lento e deliberato** → frasi brevi, niente iperboli commerciali
- **Tecnico ma accessibile** → IGP, biologico, blockchain spiegati semplicemente
- **Siciliano ma universale** → riferimenti al territorio, mai folkloristici

### Regole copy UI
- CTA: verbi all'imperativo diretti (`Scopri`, `Aggiungi`, `Invia`, `Shop`)
- Label = azione, non descrizione (`Aggiungi al Carrello` non `Carrello`)
- Errori: spiegano cosa fare, non cosa è andato storto (`Inserisci un indirizzo email valido`)
- Placeholder: informativi, non spariscono prima che l'utente scriva
- Sentence case per sottotitoli, UPPERCASE per titoli di pagina

### Lingue
Sito bilingue IT | EN. Sempre mostrare il selettore lingua in alto a destra.

---

## 12. CSS — NAMING CONVENTION

```css
/* BEM-like con prefisso componente */
.btn {}
.btn--primary {}
.btn--outline {}
.btn--icon {}
.btn:disabled {}

.card-product {}
.card-product__image {}
.card-product__body {}
.card-product__title {}
.card-product__cta {}

.nav-header {}
.nav-overlay {}
.nav-overlay__list {}

.accordion {}
.accordion__item {}
.accordion__trigger {}
.accordion__content {}

.field {}
.field--pill {}
.field__label {}
.field__error {}
```

---

## 13. COSE DA NON FARE MAI

- ❌ Aggiungere colori fuori dalla palette ufficiale
- ❌ Usare Gravesend Sans per elementi che non siano l'Hero H1
- ❌ Aggiungere `border-radius` alle card prodotto
- ❌ Usare animazioni complesse o parallax non richiesti
- ❌ Mostrare più di un CTA primario filled per sezione
- ❌ Testo bordeaux su sfondo khaki (contrasto insufficiente)
- ❌ Modificare il logo o usare varianti non previste
- ❌ Usare icone diverse da quelle del set brand
- ❌ Usare popup/modal per errori form
- ❌ Font bold nel body text
- ❌ Usare `<br/>` forzati in contenitori fluidi (50vw) — il testo scorre libero
- ❌ `font-size` fuori dalla scala (es. 17px, 22px, 23px) — solo i 7 livelli definiti in §3
- ❌ `filter: brightness(0) invert(1)` su loghi colorati ufficiali (solo su sfondo scuro)

---

## 14. ARCHITETTURA HEADLESS — WordPress + Next.js

Stesso pattern usato su PromoSan. WordPress come CMS headless su sottodominio separato;
Next.js consuma i contenuti via REST API con ISR.

### Configurazione env

```bash
# .env.local
NEXT_PUBLIC_WORDPRESS_URL=https://wp.badiula.it
NEXT_PUBLIC_WP_API_URL=https://wp.badiula.it/wp-json/wp/v2
```

`next.config.ts` deve:
- Autorizzare le immagini dal dominio WordPress (`images.remotePatterns`)
- Definire le env vars
- Aggiungere un rewrite `/wp-api/*` per evitare CORS in dev

---

### Plugin WordPress richiesti

- **Advanced Custom Fields** (versione **FREE** — no Pro)
  - Solo campi semplici: `text`, `textarea`, `url`, `email`, `select`, `image`, `true_false`
  - ❌ Niente Repeater, niente Options Page Pro
- **Custom Post Type UI** (o registrazione CPT via codice in mu-plugin)
- **WP REST Cache** *(opzionale, performance)*

---

### Custom Post Types da registrare

```php
// mu-plugins/badiula-cpt.php
add_action('init', function () {
  $common = [
    'public'       => true,
    'show_in_rest' => true,  // ← OBBLIGATORIO per REST API
    'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'page-attributes'],
  ];

  register_post_type('prodotti', $common + [
    'label'     => 'Prodotti',
    'menu_icon' => 'dashicons-cart',
    'rewrite'   => ['slug' => 'prodotti'],
  ]);

  register_post_type('ricette', $common + [
    'label'     => 'Ricette',
    'menu_icon' => 'dashicons-food',
    'rewrite'   => ['slug' => 'ricette'],
  ]);

  register_post_type('news', $common + [
    'label'     => 'News',
    'menu_icon' => 'dashicons-megaphone',
    'rewrite'   => ['slug' => 'news'],
  ]);

  register_post_type('faq', $common + [
    'label'     => 'FAQ',
    'menu_icon' => 'dashicons-editor-help',
  ]);

  // Tassonomia categorie prodotto
  register_taxonomy('categoria_prodotto', 'prodotti', [
    'label'        => 'Categorie Prodotto',
    'public'       => true,
    'show_in_rest' => true,
    'hierarchical' => true,
  ]);

  // Slug tassonomia esatti (usati dal frontend):
  // arance-rosse-igp | arance-bionde | limone-femminello
  // bergamotto | pompelmo | olio-evo | marmellate
});
```

> ⚠️ `show_in_rest => true` su **ogni** CPT e tassonomia, altrimenti non compaiono nell'API.

---

### ACF Field Groups

Sincronizzazione automatica via `/acf-json/` nel repo (copiare nella cartella del tema attivo).

**Gruppi da creare:**

| Field Group | Agganciato a | Campi principali |
|-------------|-------------|-----------------|
| `Opzioni Globali Badiula` | Pagina slug `opzioni-globali` | telefono, email, whatsapp, social (instagram, facebook, linkedin), p_iva |
| `Prodotto - Dati` | CPT `prodotti` | varietà (textarea, una per riga), stagione_inizio, stagione_fine, certificazioni (textarea), usi_consigliati (textarea), calendario_raccolta (true_false ×12 mesi) |
| `News - Dati` | CPT `news` | tempo_lettura, categoria |
| `FAQ - Dati` | CPT `faq` | categoria (select: prodotti/sostenibilità/ordini/spedizioni) |
| `Contenuti Pagina` | Tipo post = Pagina | hero_titolo, hero_sottotitolo, hero_cta_label, hero_cta_url, intro_testo |

---

### Opzioni Globali (senza ACF Pro)

Niente `acf_add_options_page`. Usare una **Pagina WordPress normale**:

1. Crea Pagina con slug esatto `opzioni-globali`
2. Aggancia il field group `Opzioni Globali Badiula`
3. Compila contatti, social, P.IVA, ecc.

Endpoint:
```
GET https://wp.badiula.it/wp-json/wp/v2/pages?slug=opzioni-globali
```
Risposta: `data[0].acf.telefono`, `data[0].acf.email`, ecc.

---

### `lib/wordpress.ts` — Funzioni di fetch tipizzate

```typescript
const WP_API = process.env.NEXT_PUBLIC_WP_API_URL;

// Prodotti
export async function getProdotti(): Promise<Prodotto[]> {
  const res = await fetch(`${WP_API}/prodotti?_embed&per_page=20`, {
    next: { revalidate: 300 },
  });
  return res.json();
}

export async function getProdottoBySlug(slug: string): Promise<Prodotto> {
  const res = await fetch(`${WP_API}/prodotti?slug=${slug}&_embed`, {
    next: { revalidate: 300 },
  });
  const data = await res.json();
  return data[0];
}

export async function getProdottiByCategoria(cat: string): Promise<Prodotto[]> {
  const res = await fetch(
    `${WP_API}/prodotti?categoria_prodotto=${cat}&_embed&per_page=20`,
    { next: { revalidate: 300 } }
  );
  return res.json();
}

// News
export async function getNews(perPage = 12): Promise<News[]> {
  const res = await fetch(`${WP_API}/news?_embed&per_page=${perPage}`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export async function getNewsBySlug(slug: string): Promise<News> {
  const res = await fetch(`${WP_API}/news?slug=${slug}&_embed`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  return data[0];
}

// FAQ
export async function getFaq(): Promise<Faq[]> {
  const res = await fetch(`${WP_API}/faq?per_page=50`, {
    next: { revalidate: 300 },
  });
  return res.json();
}

// Opzioni Globali
export async function getGlobalOptions(): Promise<GlobalOptions> {
  const res = await fetch(
    `${WP_API}/pages?slug=opzioni-globali`,
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  return data[0]?.acf ?? {};
}

// Contenuti pagina generica
export async function getPageFields(slug: string): Promise<PageFields> {
  const res = await fetch(`${WP_API}/pages?slug=${slug}`, {
    next: { revalidate: 300 },
  });
  const data = await res.json();
  return data[0]?.acf ?? {};
}
```

**Tempi ISR:**
- News → `revalidate: 60` (aggiornamento frequente)
- Prodotti, FAQ, Pagine → `revalidate: 300`
- Opzioni globali → `revalidate: 300`

---

### Pattern Server Component → Client Component

```tsx
// app/prodotti/page.tsx  (Server Component)
import { getProdotti } from '@/lib/wordpress';
import ProdottiGrid from '@/components/ProdottiGrid';

export default async function ProdottiPage() {
  const prodotti = await getProdotti();
  return <ProdottiGrid prodotti={prodotti} />;
}

// components/ProdottiGrid.tsx  (Client Component se ha filtri/interattività)
'use client';
export default function ProdottiGrid({ prodotti }: { prodotti: Prodotto[] }) {
  // filtri, stato, ecc.
}
```

Regola: **fetch sempre nel Server Component** → props al Client Component.
I componenti senza interattività (Footer, Header) restano Server Component.

---

### Mappa contenuti WordPress ↔ Pagine Badiula

| Contenuto | CPT / Endpoint WP | Pagina Next.js |
|-----------|-------------------|----------------|
| Prodotti agrumi | `CPT prodotti` | `/coltivazioni/[slug]` |
| Olio EVO, Marmellate | `CPT prodotti` (cat: luce-di-terra) | `/luce-di-terra/[slug]` |
| News / Blog | `CPT news` | `/news`, `/news/[slug]` |
| FAQ | `CPT faq` | Tutte le pagine prodotto |
| Hero/Intro pagine | `pages?slug=...` + ACF | Tutte le pagine |
| Contatti, Social, P.IVA | `pages?slug=opzioni-globali` | Footer, `/contatti` |
| Certificazioni | Campo ACF su Pagina `certificazioni` | `/filiera/certificazioni` |

---

### Webhook revalidation (ISR on-demand)

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const { path } = await req.json();
  revalidatePath(path ?? '/');
  return NextResponse.json({ revalidated: true });
}
```

In `functions.php` WordPress, su `save_post` chiamare questo endpoint con il secret.

---

## 15. ARCHITETTURA COMPONENTI PRODOTTO

### Struttura directory

```
components/prodotti/
├── index.ts                  ← barrel export di tutti e 5 gli assembler
│
├── AranciRosse.tsx           ← assembler Arance Rosse IGP
├── AranceBionde.tsx          ← assembler Arance Bionde
├── Bergamotto.tsx            ← assembler Bergamotto Bio
├── LimoneFemminello.tsx      ← assembler Limone Femminello Siracusano
├── Pompelmo.tsx              ← assembler Pompelmo Bio
│
└── shared/
    ├── ProdottoIntro.tsx         + .module.css
    ├── ProdottoVarieta.tsx       + .module.css
    ├── CalendarioRaccolta.tsx    + .module.css
    ├── ProdottoEditoriale.tsx    + .module.css
    ├── ShopBannerProdotto.tsx    + .module.css
    └── FaqProdotto.tsx           + .module.css
```

### Componenti shared — descrizione e props

#### `ProdottoIntro`
Sezione hero della pagina prodotto: titolo H1 multi-riga con indent opzionale, sottotitolo H3 italic, corpo testo.

```tsx
interface TitleRow { text: string; indent?: string; } // indent = CSS padding-left, es. '1.5em'
interface ProdottoIntroProps {
  rows:     TitleRow[];            // righe del titolo H1 (uppercase, 110px)
  align?:   'left' | 'center' | 'right'; // allineamento del blocco H1
  subtitle: string;                // H3 italic bordeaux, centrato
  body:     string[];              // paragrafi body-1 (26px/38px)
}
```

#### `ProdottoVarieta`
Sezione zigzag immagine + testo per una singola varietà. Alterna sx/dx tramite `reverse`.

```tsx
interface ProdottoVarietaProps {
  name:      string;               // H4 uppercase bordeaux (40px/45px)
  slogan?:   string;               // bold bordeaux 24px
  image:     { src: string; alt: string };
  reverse?:  boolean;              // true → immagine a destra (default: false = immagine a sinistra)
  children:  React.ReactNode;      // <p> e <ul>/<li> — stile applicato via CSS module
}
```

Usare `reverse` alternato per rispettare il pattern zigzag del CLAUDE.md §4.

#### `CalendarioRaccolta`
Griglia 12 mesi (GEN→DIC) con dot bordeaux per i mesi attivi.

```tsx
interface CalendarioRaccoltaProps {
  activeMonths: number[]; // indici 1-based, es. [1, 2, 3, 4, 12] per Gen–Apr + Dic
}
```

Sfondo vanilla, bordi khaki, dot attivo bordeaux. Mobile: griglia a 6 colonne.

#### `ProdottoEditoriale`
Sezione testo approfondimento (IGP, storia, curiosità). Titolo H3 bordeaux, body-2, max-width 760px.

```tsx
interface ProdottoEditorialeProps {
  title:    string;
  children: React.ReactNode; // solo <p>
}
```

#### `ShopBannerProdotto`
Banner fisso "Agrumi siciliani direttamente dal produttore" — nessuna prop. Immagine area vanilla,
barra teal, CTA `btn btn-outline-white` che punta a `/coltivazioni`. Usato in fondo a ogni PDP.

#### `FaqProdotto`
Accordion FAQ accessibile (`aria-expanded`). Client Component (usa `useState`).

```tsx
export interface FaqItem { q: string; a: string; }
interface FaqProdottoProps { items: FaqItem[]; }
```

Heading "FAQ" a clamp(60px, 8vw, 100px), trigger bordeaux bold, risposta body-2 dark.

---

### Pattern assembler

Ogni file assembler (es. `AranciRosse.tsx`) è un **Server Component** che:
1. Importa i componenti shared da `./shared/`
2. Definisce inline i dati statici (`FAQS: FaqItem[]`)
3. Renderizza la sequenza fissa: `Intro → Varietà(×n) → Calendario → Editoriale → ShopBanner → Faq → Footer`
4. Non ha `'use client'` (l'unico client component è `FaqProdotto`, che lo dichiara autonomamente)

```tsx
// Struttura tipo di ogni assembler
import Footer from '@/components/Footer';
import ProdottoIntro from './shared/ProdottoIntro';
import ProdottoVarieta from './shared/ProdottoVarieta';
import CalendarioRaccolta from './shared/CalendarioRaccolta';
import ProdottoEditoriale from './shared/ProdottoEditoriale';
import ShopBannerProdotto from './shared/ShopBannerProdotto';
import FaqProdotto, { type FaqItem } from './shared/FaqProdotto';

const FAQS: FaqItem[] = [ /* domande specifiche del prodotto */ ];

export default function NomeProdotto() {
  return (
    <main>
      <ProdottoIntro rows={[...]} align="left" subtitle="..." body={[...]} />
      <ProdottoVarieta name="VARIETÀ A" image={...}>{/* <p> */}</ProdottoVarieta>
      <ProdottoVarieta name="VARIETÀ B" image={...} reverse>{/* <p> */}</ProdottoVarieta>
      <CalendarioRaccolta activeMonths={[...]} />
      <ProdottoEditoriale title="...">{/* <p> */}</ProdottoEditoriale>
      <ShopBannerProdotto />
      <FaqProdotto items={FAQS} />
      <Footer />
    </main>
  );
}
```

### Page.tsx — thin wrapper

Le pagine `app/[locale]/coltivazioni/[prodotto]/page.tsx` sono wrapper minimi:

```tsx
import { AranciRosse } from '@/components/prodotti';

export default function AranceRossePage() {
  return <AranciRosse />;
}
```

Non contengono logica, stili o dati. Tutta la responsabilità è nell'assembler.

### Aggiungere un nuovo prodotto

1. Crea `components/prodotti/NuovoProdotto.tsx` seguendo il pattern assembler
2. Esportalo da `components/prodotti/index.ts`
3. Crea `app/[locale]/coltivazioni/nuovo-prodotto/page.tsx` come thin wrapper
4. Se serve un componente shared non ancora esistente → crearlo in `shared/` e verificare la checklist §16

---

## 16. CHECKLIST NUOVO COMPONENTE

Prima di creare un nuovo componente:

- [ ] Usa solo token colore da `:root`?
- [ ] Tipografia da scala ufficiale?
- [ ] Border-radius corretto per il tipo (pill btn, 0 card, pill field)?
- [ ] Tutti e 4 gli stati interattivi definiti?
- [ ] Focus visibile per keyboard nav?
- [ ] Responsive testato a 375px, 768px, 1440px?
- [ ] Copy segue TOV Badiula?
- [ ] Nessun colore hardcoded?
- [ ] Icone solo dal set brand?
