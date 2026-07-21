---
name: Badiula
description: Azienda agricola biologica siciliana — agrumi IGP, olio EVO, marmellate, quattro generazioni di filiera trasparente.
colors:
  bordeaux: "#6C1224"
  eigengrau: "#16161D"
  white: "#FFFFFF"
  khaki: "#C4B59B"
  vanilla: "#EEE6B8"
  teal: "#889C82"
typography:
  display:
    fontFamily: "Gravesend Sans, sans-serif"
    fontSize: "110px"
    fontWeight: 700
    lineHeight: "122px"
    letterSpacing: "0"
  headline:
    fontFamily: "Mr Eaves Mod OT, sans-serif"
    fontSize: "80px"
    fontWeight: 700
    lineHeight: "89px"
    letterSpacing: "0"
  title:
    fontFamily: "Mr Eaves Mod OT, sans-serif"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: "66px"
    letterSpacing: "0"
  title-sm:
    fontFamily: "Mr Eaves Mod OT, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: "45px"
    letterSpacing: "0"
  body:
    fontFamily: "Mr Eaves Mod OT, sans-serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: "38px"
    letterSpacing: "0"
  label:
    fontFamily: "Mr Eaves Mod OT, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "32px"
    letterSpacing: "0"
rounded:
  btn: "999px"
  card: "0px"
  card-soft: "12px"
  field: "999px"
  modal: "16px"
  banner: "16px"
  calendar: "12px"
  badge: "999px"
  dot: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "80px"
  2xl: "120px"
components:
  button-primary:
    backgroundColor: "{colors.bordeaux}"
    textColor: "{colors.white}"
    rounded: "{rounded.btn}"
    padding: "0 28px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.khaki}"
    textColor: "{colors.bordeaux}"
    rounded: "{rounded.btn}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.bordeaux}"
    rounded: "{rounded.btn}"
    padding: "0 28px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.khaki}"
    textColor: "{colors.bordeaux}"
    rounded: "{rounded.btn}"
  card-product:
    backgroundColor: "{colors.khaki}"
    rounded: "{rounded.card}"
    padding: "24px"
  card-carousel:
    backgroundColor: "{colors.vanilla}"
    rounded: "{rounded.banner}"
    height: "620px"
    width: "560px"
  field-input:
    backgroundColor: "transparent"
    textColor: "{colors.eigengrau}"
    rounded: "{rounded.field}"
    padding: "12px 20px"
---

# Design System: Badiula

## 1. Overview

**Creative North Star: "La Terra Prima del Prodotto" (The Land Before the Product)**

Badiula's visual system reads like the Sicilian citrus landscape itself, translated into interface: bordeaux is the red flesh of the Tarocco orange and the iron-rich earth of Carlentini, khaki and vanilla are the summer fields and the light on ripe fruit, muted teal is the leaf canopy. Nothing in the palette is decorative — every color has a physical referent in the grove, and the system is disciplined about not reaching outside those six values. The typography is quiet and confident (Mr Eaves Mod OT carries almost the entire site; Gravesend Sans is reserved, deliberately rare, for the hero headline only), the card geometry is sharp-edged on product listings and softly rounded only where warmth is earned (carousels, banners, modals). This is a system built to slow a visitor down, not to sell fast.

The system explicitly rejects the visual grammar of generic organic-supermarket e-commerce — green "bio" badges, stock-photo nature imagery, countdown/urgency mechanics — and just as explicitly rejects tourist-folklore Sicily (majolica tiles, decorated carts, postcard clichés). Badiula is authentic and territorial, never a costume.

**Key Characteristics:**
- A strict six-color palette with a named physical referent for every value — no ad-hoc hex codes.
- One rare display font (Gravesend Sans) reserved for the hero H1 only; everything else is Mr Eaves Mod OT.
- Flat by default: hierarchy comes from color and spacing, not shadow.
- Sharp-edged (0 radius) product-listing cards vs. softly rounded (16px) carousel/banner cards — the radius itself signals context.
- Pill-shaped buttons and form fields throughout; no rectangular CTAs.

## 2. Colors

Six colors, each tied to something you'd actually see standing in the grove — not a palette generator's output.

### Primary
- **Bordeaux** (#6C1224): the dominant color. Hero titles, primary CTAs, active links, focus borders, icons. Reads as the red flesh of Arance Rosse IGP and the terracotta soil of Carlentini.

### Secondary
- **Khaki** (#C4B59B): warm accent, Arance Rosse product-card background, outline-button hover fill. The color of dry summer earth.
- **Vanilla** (#EEE6B8): secondary section backgrounds (calendar, footer CTA banners, most product-card backgrounds), the color of ripe citrus pulp and light.
- **Muted Teal** (#889C82): Arance Bionde / limone card backgrounds, biologico badge, olive-leaf green.

### Neutral
- **Eigengrau** (#16161D): body text, footer background, navbar text on light surfaces. Warmer and denser than pure black — ink, not charcoal.
- **White** (#FFFFFF): primary surface, text on dark/bordeaux backgrounds.

### Named Rules
**The Six-Color Rule.** No color enters the system without a named referent in the grove (fruit, earth, leaf, light). If a new value can't be described that way, it doesn't belong.

**The Bordeaux-on-Khaki Ban.** Bordeaux text is never placed on khaki background — contrast fails, and CLAUDE.md prohibits it explicitly (§13).

## 3. Typography

**Display Font:** Gravesend Sans (with sans-serif fallback) — hero H1 inside a hero section, and nowhere else.
**Body Font:** Mr Eaves Mod OT (with sans-serif fallback) — everything else in the system, including H1 when a page has no hero section (e.g. the homepage's in-flow H1).

**Character:** A single quiet workhorse (Mr Eaves Mod OT) carries almost the whole site, so the rare appearance of Gravesend Sans in a hero genuinely registers as a moment, not noise. Letter-spacing stays at 0 across every level — no tracked-out display type, no gimmicks.

### Hierarchy
- **Display** (700, 110px/122px, Gravesend Sans): hero H1 inside a hero section only. Always uppercase.
- **Headline** (700, 80px/89px): section-level H2. Always uppercase.
- **Title** (700, 60px/66px): H3, italic in subtitle usage (e.g. "Quattro generazioni, una terra"), sentence case.
- **Title-sm** (700, 40px/45px): H4 and product-card titles, bold, sentence case, uppercase on card headings.
- **Body** (400, 26px/38px, "body-1"): general paragraph text site-wide.
- **Label** (400, 20px/32px, "body-2"): product-card copy, FAQ accordion answers, compact UI text. Never bold.

### Named Rules
**The One Display Rule.** Gravesend Sans renders exactly once per page: the hero H1. Every other heading, on every page, is Mr Eaves Mod OT. Two explicit repo-documented exceptions exist (the `CentralTitle` on `/filiera-e-lavorazione`, and the 200px `.quoteLine` on `/azienda`) — both intentional, both singular, neither a precedent for a third.

**The Seven-Level Ceiling.** Only display / headline / title / title-sm / body / label plus the responsive step-downs defined per breakpoint exist. No arbitrary font-size (17px, 22px, 23px) ever ships.

## 4. Elevation

Flat by default, on doctrine, but with room to extend deliberately. Hierarchy is built with color and spacing, not drop shadows — card-product has zero radius and zero shadow; separation comes from the alternating background color, not a lifted surface. The two real exceptions are intentional and stay exceptions rather than becoming a pattern: a soft ambient shadow under the harvest-calendar table, and a frosted-glass treatment on the footer's PNRR funding banner. Future interactive surfaces (dropdowns, modals, hover states on cards) may introduce a light, targeted shadow when genuine separation from content below is needed — but the default for any new component is flat.

### Shadow Vocabulary
- **table-ambient** (`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06)`): under the harvest-calendar `.tableWrap` only.
- **glass-pnrr** (`backdrop-filter: blur(12px)`, `background: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.15)`): the PNRR funding banner in the footer only.

### Named Rules
**The Flat-First, Earned-Depth Rule.** Every new component starts flat. A shadow or blur is added only when it solves a real separation problem (content genuinely overlapping content below it) — never as decoration.

## 5. Components

Sober and self-assured: hard edges where the product is being listed, a firm pill everywhere something is clickable, measured 200ms transitions — never playful, never gadget-like.

### Buttons
- **Shape:** pill, `border-radius: 999px` ({rounded.btn}), always.
- **Primary (Filled):** bg bordeaux (#6C1224), text white, used for the single primary commercial action per section ("Aggiungi al Carrello", "Shop", "Invia").
- **Outline (Default):** transparent bg, bordeaux border + text — the default CTA ("Scopri di più ►").
- **Outline Dark:** same shape, white border/text, for use on bordeaux/dark backgrounds.
- **Hover / Press / Disable:** hover fills khaki (#C4B59B) with bordeaux text; press fills bordeaux (outline) or eigengrau (filled) with white text; disabled drops to 40% opacity with a neutral gray border/text. Transitions: 200ms ease hover, 150ms ease press.
- **Icon variant:** same rules, adds a trailing ► arrow (used almost exclusively for "Scopri di più ►").

### Cards / Containers
- **Product-listing card** (shop grid): `border-radius: 0` ({rounded.card}) — sharp edges, no exceptions, on purpose.
- **Carousel / banner card** (homepage "Le nostre produzioni", Luce di Terra): `border-radius: 16px` ({rounded.banner}) — the one place cards are allowed to soften.
- **Background by product:** khaki (Arance Rosse), teal (Arance Bionde, Olio EVO), vanilla (Limone, Bergamotto, Pompelmo, Marmellate). Text flips to white on the teal Olio EVO card only.
- **Shadow Strategy:** none by default (see Elevation).

### Inputs / Fields
- **Style:** underline-only (`border-bottom: 1px solid bordeaux`, no box) for search and most in-page forms; pill (`border-radius: 999px`, translucent white fill) specifically inside the dark footer form.
- **Focus:** outline none, `border-bottom-color` stays bordeaux — the affordance is the persistent bordeaux line, not a new outline appearing.
- **Placeholder:** eigengrau at 40% opacity.

### Navigation
- **Header:** sticky, white background, no shadow. Hamburger (left) / centered logo / search + language switcher (right) on desktop; hamburger + logo + search on mobile, language switcher moves into the fullscreen overlay.
- **Fullscreen overlay menu:** white background, centered logo, top-level items as bold bordeaux H1s, submenu items get a trailing ► arrow, right half of the overlay is a fixed image panel with a persistent "Shop" CTA.
- **Icons:** monochrome bordeaux set only (► ◄ ▼ ▲ 🛒 ♥ 🔍 ≡ ⊞ ⊟ ☰ □) — never mix in an unrelated icon family.

### Calendario di Raccolta (signature component)
A 12-month harvest calendar used on every product page: vanilla background, khaki borders, a solid bordeaux dot marking active harvest months. Collapses from a single 12-column row to a 6×2 grid under 768px. This is Badiula's clearest "show, don't tell" proof-of-provenance device and appears nowhere else on the web in this exact form — treat it as the brand's signature data component, not a generic table.

## 6. Do's and Don'ts

### Do:
- **Do** keep every color traceable to a physical referent in the grove (fruit, earth, leaf, light) — the Six-Color Rule.
- **Do** reserve Gravesend Sans for exactly one hero H1 per page — the One Display Rule.
- **Do** use 0-radius cards for product listings and 16px-radius cards for carousels/banners; the radius is the signal, don't blur the two.
- **Do** show provenance concretely (harvest calendar, varieties, certifications) rather than with a decorative trust badge.
- **Do** keep motion measured — 200ms ease hover, 150ms ease press, `prefers-reduced-motion` alternatives on every GSAP scroll sequence.

### Don't:
- **Don't** ship generic organic-supermarket e-commerce patterns: green "bio" badges, stock-photo nature imagery, countdown timers, discount pop-ups, "solo 3 rimasti" urgency copy.
- **Don't** reach for tourist-folklore Sicily: Sicilian carts, majolica-tile decoration, postcard-Sicily visual clichés.
- **Don't** place bordeaux text on khaki background — contrast fails (the Bordeaux-on-Khaki Ban).
- **Don't** add `border-radius` to product-listing cards, ever — CLAUDE.md §13 bans it explicitly.
- **Don't** introduce a shadow or blur as decoration; every one must solve a real separation problem (the Flat-First, Earned-Depth Rule).
- **Don't** use an icon outside the documented monochrome bordeaux set, or a font-size outside the seven defined levels (plus their documented responsive step-downs).
