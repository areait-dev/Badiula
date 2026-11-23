---
name: scontorna-frutti
description: Ritaglia un frutto (agrume) da una foto e produce un PNG con sfondo trasparente, pronto per le card prodotto (object-fit contain). Usare quando l'utente fornisce foto di arance, limoni, bergamotto, pompelmo ecc. su pianta o su sfondo e chiede di "scontornare", "ritagliare", "estrarre il frutto" o di creare i cutout in public/images/cutout.
---

# Scontorna frutti

Script: `.claude/skills/scontorna-frutti/scontorna.py` (Python, nessun commit automatico: salvare i file dove richiesto dall'utente).

## Setup (una volta)

```bash
python -m venv <cartella-temporanea>/venv
<venv>/Scripts/python -m pip install "rembg[cpu]" opencv-python-headless scipy numpy pillow
```

- **Modello rembg**: se il download da Python fallisce con `SSLCertVerificationError`, scaricarlo con curl:
  `mkdir -p ~/.u2net && curl -L -o ~/.u2net/isnet-general-use.onnx https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx`
- Il venv va tenuto fuori dal repo (cartella scratchpad/temporanea).
- Non usare il Python di sistema per riscrivere lo script con caratteri accentati: salvare sempre in UTF-8.

## Scegliere la modalità

Guardare prima la foto (Read) e decidere:

| Foto | Modalità |
|---|---|
| Un frutto solo, a fuoco, ben visibile, con poche foglie davanti | **auto** (rembg) |
| Grappolo: più frutti vicini, sovrapposti o tagliati dal bordo | **punto** (GrabCut con ellisse) |

```bash
# auto
python scontorna.py foto.jpg out.png --preview

# punto: --fruit CX CY RX RY, frazioni 0-1 di larghezza/altezza (centro e raggi dell'ellisse)
python scontorna.py foto.jpg out.png --fruit 0.36 0.41 0.19 0.15 --preview
```

Per le coordinate dell'ellisse: aprire la foto, stimare centro e raggi del frutto scelto e dividerli per larghezza/altezza dell'immagine mostrata. Scegliere il frutto più libero (non coperto da foglie, non tagliato dal bordo).

## Pulizia applicata (sempre)

1. `cv2.morphologyEx(MORPH_OPEN)` con kernel ellittico proporzionale alla foto (`--open`, default 0.035): taglia foglie e rami sottili attaccati.
2. Si tiene solo la componente connessa del frutto e si riempiono i buchi.
3. Erosione dell'alpha di 2 px (`--erode`) + sfocatura gaussiana (`--blur`, default 1.6): elimina l'alone sui bordi.
4. Decontaminazione colore del bordo: i pixel di bordo prendono il colore del frutto subito all'interno (niente frange verdi o bianche).
5. Ritaglio sul bounding box con margine trasparente del 4 % (`--margin`).

`--preview` salva anche `<output>_preview.jpg` su fondo vanilla (#EEE6B8) per controllare i bordi.

## Verifica obbligatoria

Dopo ogni ritaglio guardare il `_preview.jpg` (Read) e controllare: alone sui bordi, residui di foglie, schegge di frutti vicini, colore realistico. Mettere più frutti affiancati in un foglio di anteprime per confrontarli.

## Limiti noti (non nascondere all'utente)

- **Schegge di frutti vicini**: se il frutto tocca un altro frutto dello stesso colore, restano pezzi del vicino sul bordo. `--open` più alto (es. 0.09) arrotonda ma non li elimina, perché sono spessi come il frutto. Soluzioni: foto con un frutto isolato, o ritocco manuale.
- **Foto controluce**: frutti in ombra con macchie di sole non si correggono in modo credibile; le correzioni automatiche (schiarire, saturare, cancellare le macchie) danno un risultato finto. Meglio chiedere un'altra foto con luce diffusa.
- Foto molto grandi vengono ridotte a 2400 px sul lato lungo: sufficiente per le card (che mostrano il frutto a poche centinaia di px).

## Output nel progetto

I cutout esistenti sono in `public/images/cutout/` (`arancia-rossa.png`, `arancia-bionda.png`, `bergamotto.png`, `limone-femminello.png`, `pompelmo.png`). Collegarli ai prodotti cambiando `cutoutImage` in `lib/mock/prodotti.ts`. Non sovrascrivere né collegare nulla senza conferma dell'utente.
