"""Сравнение силуэта мишки на рендере с референсом.

Меряет одни и те же ориентиры на обоих изображениях: рамку мишки, центры
глаз, кремовый живот, ширину по строкам. Печатает доли высоты мишки — так
видно, где 3D разъехался с картинкой, не прикладывая две картинки рядом.

Запуск: python tools/compare_silhouette.py путь1.png путь2.png
"""

import sys

import numpy as np
from PIL import Image


def load(path):
    return np.asarray(Image.open(path).convert("RGB")).astype(int)


def mask_mint(a):
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    green = (g - r > 4) & (g - b > 4) & (g > 110)
    bg = np.abs(r - g) + np.abs(g - b) + np.abs(r - b)
    return green & (bg > 8)


def mask_cream(a):
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    return (r > 195) & (g > 180) & (b > 150) & (r - b > 16) & (r >= g)


def mask_dark(a):
    return a.sum(2) < 170


def report(path):
    a = load(path)
    h, w = a.shape[:2]
    mint = mask_mint(a)
    cream = mask_cream(a)
    dark = mask_dark(a)

    # мишка = зелёный силуэт; если рендер потерял цвет — добавим кремовый и тёмный
    body = mint | cream
    if body.sum() < 500:
        print(f"{path}: силуэт не найден")
        return

    ys, xs = np.nonzero(body)
    y0, y1 = ys.min(), ys.max()
    x0, x1 = xs.min(), xs.max()
    H = y1 - y0 + 1
    W = x1 - x0 + 1

    def nz(v):
        return (y1 - v) / H  # высота от ног, в долях H

    out = {
        "size": (w, h),
        "bear_px": (W, H),
        "aspect_w_over_h": round(W / H, 3),
    }

    # глаза: две тёмные кляксы в верхней половине, разнесённые по x
    dys, dxs = np.nonzero(dark)
    if len(dxs):
        keep = dys < y0 + H * 0.75
        dys, dxs = dys[keep], dxs[keep]
        mid = (x0 + x1) / 2
        for name, sel in (("eye_l", dxs < mid), ("eye_r", dxs >= mid)):
            if sel.sum() < 30:
                continue
            out[name] = {
                "x": round((dxs[sel].mean() - mid) / H, 3),
                "z": round(float(np.mean([nz(v) for v in dys[sel]])), 3),
                "r": round(float(np.sqrt(sel.sum() / np.pi) / H), 3),
            }

    if cream.sum() > 200:
        cys, cxs = np.nonzero(cream)
        out["belly"] = {
            "z_top": round(float(nz(cys.min())), 3),
            "z_bot": round(float(nz(cys.max())), 3),
            "half_w": round(float((cxs.max() - cxs.min() + 1) / 2 / H), 3),
            "cx": round(float((cxs.mean() - (x0 + x1) / 2) / H), 3),
        }

    # профиль ширины: где самое узкое место между головой и телом
    rows = []
    for y in range(y0, y1 + 1, max(1, H // 60)):
        row = np.nonzero(body[y])[0]
        if len(row) < 3:
            continue
        rows.append((round(float(nz(y)), 3), round(float((row.max() - row.min() + 1) / H), 3)))
    out["width_profile"] = rows
    print(f"--- {path}")
    for k, v in out.items():
        if k == "width_profile":
            print("  width_profile (z, w/H):")
            for z, wd in v:
                print(f"    {z:+.2f}  {wd:.3f}  {'#' * int(wd * 60)}")
        else:
            print(f"  {k}: {v}")


for p in sys.argv[1:]:
    report(p)
