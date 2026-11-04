"""Нарезка листа с питомцем на четыре кадра с прозрачным фоном.

Использование:
    python tools/cut-pet.py [лист] [папка-вывода]

Фон убирается заливкой от краёв (а не порогом по яркости): светлый живот
обведён контуром и с внешним фоном не связан, поэтому заливка его не съест.
Снизу кадр обрезается: у 3D-рендера там остаётся полоса фона, и без обрезки
нарезка по пустым столбцам склеивает все позы в один фрагмент.
"""

import os
import sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter

SRC = sys.argv[1] if len(sys.argv) > 1 else r"D:\AI-Workspace\projects\tally\assets\pet-sheet.jpg"
OUT = sys.argv[2] if len(sys.argv) > 2 else r"D:\AI-Workspace\projects\tally\public\pet"
BOTTOM = 0.93  # доля высоты, ниже которой кадр отрезается

NAMES = ["1-satt", "2-ok", "3-hungrig", "4-traurig"]

os.makedirs(OUT, exist_ok=True)
im = Image.open(SRC).convert("RGB")
W, H = im.size
im = im.crop((0, 0, W, int(H * BOTTOM)))
W, H = im.size
print("лист:", W, H)

# --- фон в магенту заливкой от краёв -------------------------------------------
for s in [(1, 1), (W - 2, 1), (1, H - 2), (W - 2, H - 2), (W // 2, 1), (W // 2, H - 2)]:
    try:
        ImageDraw.floodfill(im, s, (255, 0, 255), thresh=40)
    except Exception as e:
        print("seed", s, "пропущен:", e)

mag = Image.new("RGB", im.size, (255, 0, 255))
alpha = ImageChops.difference(im, mag).convert("L").point(lambda v: 0 if v < 16 else 255)
alpha = alpha.filter(ImageFilter.GaussianBlur(0.7)).point(lambda v: 0 if v < 60 else (255 if v > 190 else v))

rgba = im.convert("RGBA")
rgba.putalpha(alpha)

# --- границы кадров по пустым столбцам -----------------------------------------
vals = list(alpha.resize((W, 1), Image.BOX).get_flattened_data())
runs, start = [], None
for x, v in enumerate(vals):
    if v > 6 and start is None:
        start = x
    elif v <= 6 and start is not None:
        runs.append((start, x))
        start = None
if start is not None:
    runs.append((start, W))

runs = [r for r in runs if r[1] - r[0] > 40]
print("найдено фрагментов:", len(runs))
for r in runs:
    print("   ", r)
assert len(runs) == 4, "ожидалось 4 фигуры"

TARGET_H = 320

# Кадры обрезаются по содержимому, а не по всей высоте листа: иначе зверёк
# занимает меньше половины файла, и в интерфейсе при height:96 он рисуется
# размером с ноготь. Высота окна общая для всех четырёх — значит масштаб
# остаётся одинаковым и позы не «прыгают» по размеру.
boxes = []
for (x0, x1) in runs:
    bb = alpha.crop((x0, 0, x1, H)).getbbox()
    boxes.append((x0, x1, bb))

H0 = int(max(bb[3] - bb[1] for (_, _, bb) in boxes) * 1.12)
print("высота окна:", H0)

for (x0, x1, bb), name in zip(boxes, NAMES):
    # окно прижато к линии лап, а не центрировано по bbox: под лапами
    # в исходнике лежит мягкая тень рендера, и при центрировании она
    # попадает в кадр серой полосой на белой карточке
    bottom = bb[3] + 3
    top = max(0, bottom - H0)
    box = (max(0, x0 - 14), top, min(W, x1 + 14), top + H0)
    cell = rgba.crop(box)
    nw = max(1, round(cell.width * TARGET_H / H0))
    cell = cell.resize((nw, TARGET_H), Image.LANCZOS)
    p = os.path.join(OUT, name + ".webp")
    cell.save(p, "WEBP", quality=84, method=6)
    print("сохранено", name, cell.size, os.path.getsize(p) // 1024, "КБ")
