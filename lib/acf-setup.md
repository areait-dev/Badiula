# Configurazione WordPress — Badiula Headless

Questa guida descrive **esattamente** come configurare WordPress su `https://wp.agribadiula.it`
affinché il frontend Next.js possa consumare i dati tramite WPGraphQL.

---

## 1. Plugin da installare

| Plugin | Versione | Funzione |
|--------|----------|----------|
| **WPGraphQL** | ≥ 1.20 | Endpoint GraphQL `/graphql` |
| **WPGraphQL for ACF** | ≥ 0.6 | Espone i campi ACF su GraphQL |
| **Advanced Custom Fields** | FREE (≥ 6.x) | Field groups |
| **Custom Post Type UI** | ≥ 1.16 | Registra i CPT |
| **Polylang** *(opzionale)* | ≥ 3.x | Traduzioni IT/EN |

> ⚠️ Usa **ACF FREE** — nessun Repeater nativo. Le sezioni e le FAQ usano
> campi numerati (`sezioni_0_titolo_sezione`, `sezioni_1_titolo_sezione`, ecc.)
> gestiti dallo script di import.

---

## 2. Custom Post Types (CPTUI o mu-plugin)

Registra i seguenti CPT. **Obbligatorio**: `show_in_graphql: true` e
`graphql_single_name` / `graphql_plural_name`.

### 2.1 `prodotti`

| Impostazione | Valore |
|---|---|
| Slug | `prodotti` |
| Singolare | `Prodotto` |
| Plurale | `Prodotti` |
| `show_in_rest` | ✅ |
| `show_in_graphql` | ✅ |
| `graphql_single_name` | `prodotto` |
| `graphql_plural_name` | `prodotti` |
| Supports | title, editor, thumbnail, excerpt, page-attributes |

### 2.2 `sezioni_azienda`

| Impostazione | Valore |
|---|---|
| Slug | `sezioni-azienda` |
| Singolare | `Sezione Azienda` |
| Plurale | `Sezioni Azienda` |
| `show_in_graphql` | ✅ |
| `graphql_single_name` | `sezioneAzienda` |
| `graphql_plural_name` | `sezioniAzienda` |

### 2.3 `faq`

| Impostazione | Valore |
|---|---|
| Slug | `faq` |
| Singolare | `FAQ` |
| Plurale | `FAQ` |
| `show_in_graphql` | ✅ |
| `graphql_single_name` | `faq` |
| `graphql_plural_name` | `faqs` |

---

## 3. Tassonomia `categoria_prodotto`

- Collegata a: `prodotti`
- `show_in_rest: true` | `show_in_graphql: true`
- `graphql_single_name: categoriaP` | `graphql_plural_name: categorieP`

**Slug esatti dei termini:**

| Termine | Slug |
|---|---|
| Arance Rosse IGP | `arance-rosse-igp` |
| Arance Bionde | `arance-bionde` |
| Limone Femminello | `limone-femminello` |
| Bergamotto | `bergamotto` |
| Pompelmo | `pompelmo` |
| Olio EVO | `olio-evo` |
| Marmellate | `marmellate` |

---

## 4. Field Groups ACF

### 4.1 `Prodotto — Dati`
Agganciato a: **CPT → prodotti**

| Nome campo (key) | Tipo | Note |
|---|---|---|
| `nome` | Text | Nome commerciale |
| `sottotitolo` | Text | H3 italic nella PDP |
| `descrizione` | Textarea | Usata nelle card e nell'excerpt |
| `corpo` | Textarea | Testo lungo nella PDP |
| `colore_sfondo` | Color Picker | Colore card (#HEX) |
| `immagine` | Image | Return: Array |
| `gen_raccolta` | True/False | Mese attivo: Gennaio |
| `feb_raccolta` | True/False | Mese attivo: Febbraio |
| `mar_raccolta` | True/False | Mese attivo: Marzo |
| `apr_raccolta` | True/False | Mese attivo: Aprile |
| `mag_raccolta` | True/False | Mese attivo: Maggio |
| `giu_raccolta` | True/False | Mese attivo: Giugno |
| `lug_raccolta` | True/False | Mese attivo: Luglio |
| `ago_raccolta` | True/False | Mese attivo: Agosto |
| `set_raccolta` | True/False | Mese attivo: Settembre |
| `ott_raccolta` | True/False | Mese attivo: Ottobre |
| `nov_raccolta` | True/False | Mese attivo: Novembre |
| `dic_raccolta` | True/False | Mese attivo: Dicembre |
| `sezioni` | Number | Numero di sezioni alternanti |
| `sezioni_0_titolo_sezione` | Text | Titolo sezione 0 |
| `sezioni_0_testo_sezione` | Textarea | Testo sezione 0 |
| `sezioni_0_immagine_sinistra` | True/False | Immagine a sinistra? |
| `sezioni_0_immagine_sezione` | Image | Immagine sezione 0 |
| `sezioni_1_*` | … | Stessi campi per sezione 1 |
| `faq` | Number | Numero di FAQ |
| `faq_0_domanda` | Text | Domanda FAQ 0 |
| `faq_0_risposta` | Textarea | Risposta FAQ 0 |
| `faq_1_*` | … | Stessi campi per FAQ 1 |

> Se hai ACF PRO puoi usare i Repeater nativi (`sezioni`, `faq`) e semplificare la struttura.

### 4.2 `Sezione Azienda — Dati`
Agganciato a: **CPT → sezioni_azienda**

| Nome campo (key) | Tipo |
|---|---|
| `eyebrow` | Text |
| `titolo` | Text |
| `corpo` | Textarea |

### 4.3 `News — Dati`
Agganciato a: **Post standard**

| Nome campo (key) | Tipo |
|---|---|
| `tempo_lettura` | Number |
| `categoria` | Text |

### 4.4 `Opzioni Globali`
Agganciato a: **Pagina con slug `opzioni-globali`**

| Nome campo (key) | Tipo |
|---|---|
| `telefono` | Text |
| `email` | Email |
| `whatsapp` | Text |
| `instagram` | URL |
| `facebook` | URL |
| `linkedin` | URL |
| `p_iva` | Text |

### 4.5 `Statistiche`
Agganciato a: **Pagina con slug `statistiche`**

| Nome campo (key) | Tipo |
|---|---|
| `statistiche` | Number (conta le righe) |
| `statistiche_0_valore` | Number |
| `statistiche_0_suffisso` | Text |
| `statistiche_0_etichetta` | Text |

---

## 5. Pagine WordPress da creare

| Titolo | Slug | Scopo |
|---|---|---|
| Opzioni Globali | `opzioni-globali` | Contatti, social, P.IVA |
| Statistiche | `statistiche` | Valori numerici per la homepage |

---

## 6. WPGraphQL — Verifica

Dopo l'installazione apri:
```
https://wp.agribadiula.it/graphql
```

e testa questa query nell'IDE integrato:

```graphql
{
  prodotti(first: 5) {
    nodes {
      id
      slug
      title
      acf {
        nome
        sottotitolo
      }
    }
  }
}
```

Se il tipo `acf` non appare: vai su **WPGraphQL → Settings** e abilita
"Enable Public Introspection" durante lo sviluppo.

---

## 7. Polylang (opzionale — traduzioni IT/EN)

1. Installa **Polylang** + **Polylang for WPGraphQL** (community plugin).
2. Vai in Lingue → aggiungi IT (predefinita) e EN.
3. Per ogni prodotto, crea la traduzione EN collegata alla versione IT.
4. Le query GraphQL accetteranno un argomento `language: EN` per filtrare.

In alternativa: usa campi ACF duplicati suffissati `_en`
(es. `nome_en`, `corpo_en`) e selezionali nel frontend in base a `locale`.

---

## 8. Immagini

Le immagini caricate su WordPress vengono servite da `wp.agribadiula.it`.
Il dominio è già autorizzato in `next.config.mjs`:

```js
{ protocol: 'https', hostname: 'wp.agribadiula.it' }
```

Usa sempre il campo `sourceUrl` restituito da WPGraphQL con `<Image>` di Next.js.

---

## 9. Revalidazione ISR on-demand

In `functions.php` (o mu-plugin), aggiungi un hook `save_post` che chiama:

```php
add_action('save_post', function ($post_id) {
  $path = match (get_post_type($post_id)) {
    'prodotti' => '/',
    'post'     => '/news',
    default    => '/',
  };

  wp_remote_post(
    add_query_arg('secret', REVALIDATE_SECRET, 'https://badiula.it/api/revalidate'),
    ['body' => json_encode(['path' => $path]), 'headers' => ['Content-Type' => 'application/json']],
  );
});
```

Definisci `REVALIDATE_SECRET` in `wp-config.php` con lo stesso valore di `.env.local`.
