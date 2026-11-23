#!/usr/bin/env python3
"""Scontorna un frutto da una foto e salva un PNG con sfondo trasparente.

Due modalita':
  auto   frutto unico e ben visibile: segmentazione con rembg (isnet-general-use)
  punto  grappolo di frutti: si indica il frutto con --fruit cx cy rx ry (frazioni 0-1
         di larghezza/altezza: centro e raggi dell'ellisse) e si usa GrabCut (OpenCV)

Pulizia finale (sempre):
  1. cv2.morphologyEx MORPH_OPEN con kernel ellittico: taglia foglie/rami sottili attaccati
  2. si tiene solo la componente connessa del frutto, si riempiono i buchi
  3. erosione 1-2 px + sfocatura gaussiana sul canale alpha: via l'alone dei bordi
  4. decontaminazione colore del bordo: i pixel di bordo prendono il colore del frutto interno

Uso:
  python scontorna.py foto.jpg out.png                      # auto
  python scontorna.py foto.jpg out.png --fruit 0.36 0.41 0.19 0.15
"""
import argparse
import os

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

MAX_SIDE = 2400


def segment_auto(im: Image.Image) -> np.ndarray:
    from rembg import new_session, remove

    cut = remove(im, session=new_session('isnet-general-use'))
    return (np.array(cut.getchannel('A')) > 160).astype(np.uint8)


def segment_point(im: Image.Image, cx, cy, rx, ry):
    W, H = im.size
    bgr = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    yy, xx = np.mgrid[0:H, 0:W]
    d = ((xx - cx * W) / (rx * W)) ** 2 + ((yy - cy * H) / (ry * H)) ** 2
    mask = np.full((H, W), cv2.GC_BGD, np.uint8)
    mask[d < 1.9 ** 2] = cv2.GC_PR_BGD
    mask[d < 1.15 ** 2] = cv2.GC_PR_FGD
    mask[d < 0.65 ** 2] = cv2.GC_FGD
    cv2.grabCut(bgr, mask, None, np.zeros((1, 65)), np.zeros((1, 65)), 8, cv2.GC_INIT_WITH_MASK)
    fg = ((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)).astype(np.uint8)
    fg &= (d < 1.08 ** 2).astype(np.uint8)  # i frutti sono tondi: niente vicini attaccati
    return fg, (int(cy * H), int(cx * W))


def clean(fg: np.ndarray, seed=None, open_frac=0.035, erode_px=2, blur_px=1.6) -> np.ndarray:
    """Pulizia morfologica + alpha morbido. Restituisce alpha uint8 0-255."""
    h, w = fg.shape
    k = max(5, int(max(h, w) * open_frac) | 1)  # kernel dispari, proporzionale alla foto
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, kernel)  # taglia sporgenze sottili (foglie, rami)
    lab, n = ndi.label(fg)
    if n:
        comp = lab[seed] if seed is not None and lab[seed] else 1 + int(np.argmax(ndi.sum(fg, lab, range(1, n + 1))))
        fg = lab == comp
    fg = ndi.binary_fill_holes(fg)
    fg = ndi.binary_erosion(fg, iterations=erode_px)  # toglie l'alone sul bordo
    a = cv2.GaussianBlur((fg * 255).astype(np.uint8), (0, 0), blur_px)
    return a


def decontaminate(rgb: np.ndarray, alpha: np.ndarray, width_px=6) -> np.ndarray:
    """Sostituisce il colore dei pixel di bordo con quello del frutto subito all'interno."""
    inner = ndi.binary_erosion(alpha > 250, iterations=width_px)
    if not inner.any():
        return rgb
    w = inner.astype(np.float32)
    sig = max(3, width_px)
    out = rgb.astype(np.float32)
    fill = np.stack([cv2.GaussianBlur(out[..., c] * w, (0, 0), sig) /
                     np.maximum(cv2.GaussianBlur(w, (0, 0), sig), 1e-4) for c in range(3)], -1)
    edge = ((alpha > 0) & ~inner)[..., None]
    return np.where(edge, fill, out).clip(0, 255).astype(np.uint8)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('input')
    ap.add_argument('output')
    ap.add_argument('--fruit', nargs=4, type=float, metavar=('CX', 'CY', 'RX', 'RY'),
                    help='modalita punto: centro e raggi del frutto (frazioni 0-1)')
    ap.add_argument('--open', type=float, default=0.035, help='kernel MORPH_OPEN (frazione del lato, default 0.035)')
    ap.add_argument('--erode', type=int, default=2, help='erosione alpha in px (default 2)')
    ap.add_argument('--blur', type=float, default=1.6, help='sigma sfocatura alpha (default 1.6)')
    ap.add_argument('--margin', type=float, default=0.04, help='margine trasparente attorno (default 4%%)')
    ap.add_argument('--preview', action='store_true', help='salva anche <output>_preview.jpg su fondo vanilla')
    a = ap.parse_args()

    im = Image.open(a.input).convert('RGB')
    im.thumbnail((MAX_SIDE, MAX_SIDE))
    if a.fruit:
        fg, seed = segment_point(im, *a.fruit)
    else:
        fg, seed = segment_auto(im), None

    alpha = clean(fg, seed, a.open, a.erode, a.blur)
    rgb = decontaminate(np.array(im), alpha)
    res = Image.fromarray(np.dstack([rgb, alpha]), 'RGBA')

    bbox = Image.fromarray(alpha).point(lambda v: 255 if v > 20 else 0).getbbox()
    res = res.crop(bbox)
    m = int(max(res.size) * a.margin)
    canvas = Image.new('RGBA', (res.width + 2 * m, res.height + 2 * m), (0, 0, 0, 0))
    canvas.paste(res, (m, m))
    canvas.save(a.output)
    if a.preview:
        bg = Image.new('RGBA', canvas.size, (238, 230, 184, 255))
        bg.alpha_composite(canvas)
        bg.convert('RGB').save(os.path.splitext(a.output)[0] + '_preview.jpg', quality=90)
    print(a.output, canvas.size)


if __name__ == '__main__':
    main()
