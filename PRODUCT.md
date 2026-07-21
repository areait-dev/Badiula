# Product

## Register

brand

Primary register for the site as a whole (Azienda, Coltivazioni, Filiera e Lavorazione, homepage). Shop and checkout are a deliberate exception: treat those surfaces as **product** register — optimized for clarity and task completion — while keeping the visual system (colors, type, components) defined in CLAUDE.md. When working on `/shop` or any checkout/cart flow, favor product-register judgment calls over brand-register ones.

## Platform

web

## Users

Two audiences, both real, not manufactured:

- **B2C consumers in Italy/EU** who seek out authentic Sicilian organic products — Arance Rosse IGP, olio EVO, marmellate — and care about provenance and quality enough to pay for the story behind the product, not just the product itself.
- **B2B / HORECA buyers** (restaurants, retailers) evaluating Badiula as a certified organic, IGP-traceable supplier to add to a menu or shelf. They arrive with a more functional job — checking certifications, seasonality, technical sheets, volumes — and skew toward wanting information fast over being told a story slowly.

## Product Purpose

Badiula sells citrus, olive oil, and marmalades from a four-generation organic family farm in Carlentini (Sicily). The site's job is to carry both audiences from "another organic citrus brand" to "this is a specific family, on specific land, with a traceable supply chain" — then convert that trust into a purchase (B2C) or a supplier inquiry (B2B/HORECA). Success is a visitor who can name what makes Badiula different after leaving the site, not just that it's "bio."

## Positioning

Four generations, transparent supply chain: Badiula isn't differentiated by an organic certification alone (everyone in the category has one) — it's differentiated by being able to show, concretely, whose land this is, how long they've worked it, and how the product gets from tree to package. Every page should reinforce traceability and family continuity, not just "biologico."

## Brand Personality

Autentico, lento, radicato — per CLAUDE.md §1: authentic, slow and deliberate, rooted. Never hyper-commercial; the land comes before the product. Emotionally, the site should build trust and calm confidence, not urgency. Sicilian but universal (CLAUDE.md §11): territorial without tipping into tourist folklore.

## Anti-references

- **Generic organic-supermarket e-commerce**: no green "bio" badges, no stock-photo nature imagery, no fast-e-commerce urgency tactics (countdown timers, discount pop-ups, "solo 3 rimasti").
- **Tourist-folklore Sicily** (explicit CLAUDE.md §11 rule): no Sicilian carts, majolica-tile decoration, or postcard-Sicily visual clichés. Authentic and territorial, not souvenir-shop.

## Design Principles

- The land comes before the product — visuals and copy root back to territory and family before they sell a SKU.
- Show provenance, don't just claim it — traceability and certifications are communicated concretely (calendars, varieties, process), not as decorative trust badges.
- Slow over loud — no urgency mechanics, no gratuitous motion; CLAUDE.md already bans complex animation/parallax not explicitly requested.
- One voice, two paces — institutional pages stay narrative and brand-led; Shop and checkout flex toward product-register clarity without breaking the shared visual system.
- Sicilian but universal — territorial authenticity without folklore.

## Accessibility & Inclusion

WCAG 2.1 AA baseline. Contrast checked against the CLAUDE.md palette (bordeaux/dark text on white/khaki/vanilla — never bordeaux on khaki, per CLAUDE.md §13). Visible keyboard focus states on all interactive elements (CLAUDE.md §10 already mandates this). `prefers-reduced-motion` alternatives required for every animation, including the GSAP scroll-driven sections on the homepage and shop pages.
