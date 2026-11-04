"""Ставит референс и рендер рядом в одном масштабе и считает профиль ширины.

Запуск: python tools/make_compare.py <ref.png> <render.png> <out.png>
"""

import sys

import numpy as np
from PIL import Image

REF, REN, OUT = sys.argv[1], sys.argv[2], sys.argv[3]


def mask(a, mint_only=False):
    # мишка — насыщенный цвет или очень тёмное (глаза); мягкая тень серая,
    # у неё насыщенность почти нулевая — поэтому она в кадр не попадает
    ai = a.astype(int)
    sat = ai.max(axis=2) - ai.min(axis=2)
    return (sat > 22) | (ai.sum(axis=2) < 260)


def crop_box(a):
    m = mask(a)
    ys, xs = np.nonzero(m)
    return xs.min(), ys.min(), xs.max(), ys.max()


imgs = []
for path in (REF, REN):
    a = np.asarray(Image.open(path).convert("RGB"))
    x0, y0, x1, y1 = crop_box(a)
    imgs.append((a, (x0, y0, x1, y1)))

# высота мишки -> общая, чтобы сравнивать форму, а не масштаб кадра
H = 760
panels = []
for a, (x0, y0, x1, y1) in imgs:
    cut = Image.fromarray(a[y0:y1 + 1, x0:x1 + 1])
    w = int(round(cut.width * H / cut.height))
    panels.append(cut.resize((w, H), Image.LANCZOS))

pad = 24
total = sum(p.width for p in panels) + pad * (len(panels) + 1)
canvas = Image.new("RGB", (total, H + pad * 2), (255, 255, 255))
x = pad
for p in panels:
    canvas.paste(p, (x, pad))
    x += p.width + pad
canvas.save(OUT)

print("сохранено:", OUT, canvas.size)
for name, p in zip(("ref", "render"), panels):
    print(f"{name}: ширина/высота = {p.width / p.height:.3f}")

# профиль ширины по десяти уровням
for name, (a, (x0, y0, x1, y1)) in zip(("ref", "render"), imgs):
    m = mask(a)[y0:y1 + 1, x0:x1 + 1]
    h = m.shape[0]
    row = []
    for frac in (0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15, 0.05):
        y = min(h - 1, int(round((1 - frac) * (h - 1))))
        xs = np.nonzero(m[y])[0]
        row.append((frac, round((xs.max() - xs.min() + 1) / h, 3) if len(xs) else 0.0))
    print(name, row)
