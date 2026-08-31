# COOKIE POLICY SITO WEB
Informativa sull'uso di cookie e strumenti similari ai sensi dell'art. 122 del D.Lgs. 196/2003 e del Regolamento (UE) 2016/679

| Documento | Cookie Policy sito web |
|---|---|
| Titolare | Agriturismi Badiula Soc. Cons. A.r.l |
| Sito web | https://agribadiula.it |
| Data aggiornamento | **DA COMPILARE** (data di pubblicazione) |
| Versione | Rev. 1 |

---

## SCHEDA DATI

| Campo | Valore |
|---|---|
| Denominazione / ragione sociale | Agriturismi Badiula Soc. Cons. A.r.l |
| Codice fiscale / Partita IVA | 01796500898 |
| Sede legale | C.da Badiula San Leonardo, 96013 Carlentini (SR) |
| Sito web / dominio | https://agribadiula.it |
| E-mail privacy | **DA COMPILARE** |
| PEC | **DA COMPILARE** |
| DPO/RPD, se nominato | Non nominato *(da confermare)* |
| Fornitore hosting | Vercel Inc. |
| CMP / piattaforma consenso | Banner custom sviluppato internamente (`components/CookieConsent.tsx`) — non un CMP di terze parti |
| Strumenti / servizi verificati | ☒ analytics (Google Analytics 4)  ☐ mappe  ☐ video  ☐ social embed  ☐ chat  ☐ marketing  ☐ newsletter |

---

## COOKIE POLICY

### 1. Cosa sono i cookie e gli strumenti similari

I cookie sono piccoli file che il sito può memorizzare o leggere sul dispositivo dell'utente, per riconoscerlo o ricordarne le preferenze durante la navigazione.

### 2. Categorie di strumenti utilizzati su questo sito

| Categoria | Presente su questo sito |
|---|---|
| Tecnici / strettamente necessari | Sì — cookie di funzionamento base del sito (nessun tracciamento) |
| Preferenze / funzionalità | Sì — cookie che memorizzano la scelta di consenso cookie stessa (`badiula_cookie_consent`, in `localStorage`, non un cookie tecnico ma equiparabile: nessun dato personale, solo la preferenza scelta) |
| Analytics | Sì — Google Analytics 4, **attivato solo dopo consenso esplicito** |
| Marketing / profilazione | No — nessuno strumento di marketing/profilazione presente |
| Terze parti / contenuti incorporati | No — nessuna mappa, video, social plugin o chat di terze parti rilevati nel codice del sito |

### 3. Elenco dei cookie e degli strumenti effettivamente utilizzati

> Basato sull'analisi del codice sorgente e su verifica tramite browser headless (Playwright) che conferma: **nessuna richiesta verso Google viene effettuata prima del consenso**. I nomi/durate dei cookie GA sono da documentazione ufficiale Google; si raccomanda comunque una scansione con strumenti dedicati (es. Cookiebot, browser DevTools) prima della pubblicazione definitiva, poiché Google può aggiornare la configurazione dei propri cookie.

| Nome / ID | Fornitore / dominio | Categoria | Finalità | Durata | Attivazione |
|---|---|---|---|---|---|
| `_ga` | Google LLC (google-analytics.com) | Analytics | Distingue gli utenti unici del sito | 2 anni | ☐ necessario ☒ **consenso** |
| `_ga_VPN683YKJG` | Google LLC (google-analytics.com) | Analytics | Persiste lo stato di sessione di Google Analytics 4 | 2 anni | ☐ necessario ☒ **consenso** |
| `badiula_cookie_consent` | Sito proprio (localStorage, non cookie HTTP) | Preferenze | Registra la scelta di consenso dell'utente (accettato/rifiutato) e la data, per non ripresentare il banner per ~6 mesi | ~6 mesi | ☒ **necessario** (richiesto per rispettare la scelta dell'utente) |

### 4. Gestione del consenso e configurazione del banner

Il sito implementa un banner di consenso proprietario con il seguente comportamento, verificato tecnicamente:

- Al primo accesso sono attivi **solo** gli strumenti tecnici; Google Analytics **non parte** finché l'utente non sceglie.
- Il banner offre due comandi di pari evidenza: **Rifiuta** e **Accetta**, oltre alla chiusura tramite **×**.
- La chiusura tramite **×** equivale a un rifiuto: non attiva alcun cookie non necessario.
- La scelta viene salvata (in `localStorage`, sul dispositivo dell'utente) e il banner non viene riproposto per circa 6 mesi, salvo revoca manuale.
- L'utente può modificare la scelta in qualsiasi momento tramite il link **"Gestisci preferenze cookie"** nel footer del sito.

**Testo del banner (implementato):**
«Questo sito utilizza cookie tecnici necessari. Con il tuo consenso può utilizzare anche cookie analytics (Google Analytics) per capire come viene usato il sito. Puoi accettare o rifiutare; la chiusura mantiene attivi solo gli strumenti necessari. [Cookie Policy]»
Pulsanti: **[Rifiuta]** **[Accetta]** **[× chiudi = equivale a rifiuta]**

### 5. Contenuti e servizi di terze parti

Il sito **non incorpora** al momento mappe, video, plugin social o chat di terze parti. Se in futuro venissero aggiunti (es. Google Maps, YouTube embed, chat), questa sezione e la tabella al punto 3 dovranno essere aggiornate **prima** dell'attivazione dello strumento, verificando se richiede consenso preventivo.

### 6. Gestione tramite browser e dispositivi

L'utente può inoltre gestire o cancellare i cookie tramite le impostazioni del proprio browser. La disattivazione dei cookie tecnici può compromettere alcune funzionalità del sito.

### 7. Aggiornamento della policy

| Campo | Valore |
|---|---|
| Data ultimo aggiornamento | **DA COMPILARE** |
| Versione | Rev. 1 |
| Responsabile della revisione | **DA COMPILARE** |
| Prossima verifica programmata | **DA COMPILARE** (consigliata entro 6-12 mesi o ad ogni modifica del sito/fornitori) |

---

## CAMPI ANCORA DA COMPILARE

1. E-mail privacy dedicata, PEC
2. Conferma "DPO non nominato"
3. Data di pubblicazione / prossima verifica
4. Scansione tecnica indipendente dei cookie (consigliata, per conferma finale prima della pubblicazione)

## NOTA TECNICA IMPORTANTE

A differenza del modello originale, in questo documento la sezione 4 (gestione del consenso) **descrive un banner realmente implementato e verificato**, non un requisito teorico: ho costruito e testato (`components/CookieConsent.tsx`, `components/GoogleAnalytics.tsx`) il meccanismo che blocca Google Analytics fino al consenso esplicito, prima inesistente sul sito (GA partiva automaticamente su ogni pagina). Il fix è stato verificato con un browser headless: 0 richieste a Google prima del consenso, GA attivo solo dopo "Accetta".
