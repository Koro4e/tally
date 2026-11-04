"""Пиксельные замеры референса: глаза, улыбка, живот, цвета.

Всё в долях высоты мишки, ось симметрии — по центру силуэта. Печатает готовые
числа для build_pet_rig.py, чтобы лицо не подбиралось на глаз.

Запуск: python tools/measure_ref.py <ref.png>
"""

import sys

import numpy as np
from PIL import Image

path = sys.argv[1]
a = np.asarray(Image.open(path).convert("RGB")).astype(int)
sat = a.max(axis=2) - a.min(axis=2)
sums = a.sum(axis=2)

bear = (sat > 20) | (sums < 300)
ys, xs = np.nonzero(bear)
y0, y1 = ys.min(), ys.max()
x0, x1 = xs.min(), xs.max()
H = y1 - y0 + 1
cx = (x0 + x1) / 2


def to_z(y):
    return (y1 - y) / H


def to_x(x):
    return (x - cx) / H


# --- связные компоненты тёмного (глаза, улыбка) -----------------------------
dark = sums < 320
seen = np.zeros_like(dark, dtype=bool)
comps = []
h, w = dark.shape
for yy, xx in zip(*np.nonzero(dark)):
    if seen[yy, xx]:
        continue
    stack = [(yy, xx)]
    seen[yy, xx] = True
    pix = []
    while stack:
        cy, cxp = stack.pop()
        pix.append((cy, cxp))
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                ny, nx = cy + dy, cxp + dx
                if 0 <= ny < h and 0 <= nx < w and dark[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    stack.append((ny, nx))
    if len(pix) > 120:
        comps.append(np.array(pix))

print(f"тёмных компонент: {len(comps)}")
for pix in sorted(comps, key=lambda p: -len(p)):
    yy, xx = pix[:, 0], pix[:, 1]
    cy, cxp = yy.mean(), xx.mean()
    area = len(pix)
    print(
        f"  центр x={to_x(cxp):+.4f} z={to_z(cy):.4f}  "
        f"ширина {(xx.max()-xx.min()+1)/H:.4f} высота {(yy.max()-yy.min()+1)/H:.4f}  "
        f"r_equiv {np.sqrt(area/np.pi)/H:.4f}"
    )

# --- кремовый живот ---------------------------------------------------------
r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
cream = (r > 195) & (g > 185) & (b > 150) & (r - b > 16) & (r >= g)
if cream.sum() > 500:
    yy, xx = np.nonzero(cream)
    print(
        f"живот: cx={to_x(xx.mean()):+.4f} cz={to_z(yy.mean()):.4f} "
        f"полуширина {(xx.max()-xx.min()+1)/2/H:.4f} полувысота {(yy.max()-yy.min()+1)/2/H:.4f} "
        f"z {to_z(yy.max()):.3f}…{to_z(yy.min()):.3f}"
    )

# --- цвета -----------------------------------------------------------------
mint = (g - r > 25) & (g - b > 12) & (g > 120)
fur_px = a[mint]
belly_px = a[cream]
print("мятный: медиана", np.median(fur_px, axis=0).round(0), " пикселей", len(fur_px))
print("кремовый: медиана", np.median(belly_px, axis=0).round(0) if len(belly_px) else "-")
# тень под мишкой и фон — для калибровки фона рендера
print("фон (угол):", a[8, 8], a[8, -8])
