"""Подгонка формы мишки под силуэт референса.

Профиль ширины объединения эллипсоидов считается аналитически: на строке z
каждый эллипсоид даёт отрезок [cx - rx*k, cx + rx*k], где k = sqrt(1 - ((z-cz)/rz)^2).
Ширина силуэта — длина объединения отрезков. Поэтому fitting идёт без Blender
и без рендера: тысячи вариантов за секунды.

Запуск: python tools/fit_silhouette.py <ref.png>
"""

import sys

import numpy as np
from PIL import Image

REF = sys.argv[1]


# --------------------------------------------------------------------------- #
#  силуэт референса
# --------------------------------------------------------------------------- #
def reference_profile(path, rows=160):
    a = np.asarray(Image.open(path).convert("RGB")).astype(int)
    sat = a.max(axis=2) - a.min(axis=2)
    m = (sat > 20) | (a.sum(axis=2) < 300)
    ys, xs = np.nonzero(m)
    y0, y1 = ys.min(), ys.max()
    x0, x1 = xs.min(), xs.max()
    H = y1 - y0 + 1
    # ось симметрии — по центру силуэта, а не по кадру
    cx = (x0 + x1) / 2

    zs, ws = [], []
    for i in range(rows):
        y = y0 + int(round(i * (H - 1) / (rows - 1)))
        row = np.nonzero(m[y])[0]
        if len(row) < 2:
            continue
        zs.append((y1 - y) / H)
        ws.append((row.max() - row.min() + 1) / H)
    return np.array(zs), np.array(ws), (x0, x1, y0, y1, cx)


# --------------------------------------------------------------------------- #
#  модель
# --------------------------------------------------------------------------- #
# имя: (cx, cz, rx, rz)
NAMES = ["body", "hip", "head", "ear", "arm", "leg"]
INIT = {
    "body": [0.0, 0.345, 0.288, 0.202],
    "hip": [0.0, 0.230, 0.295, 0.130],
    "head": [0.0, 0.630, 0.330, 0.251],
    "ear": [0.212, 0.900, 0.098, 0.090],
    "arm": [0.292, 0.298, 0.068, 0.153],
    "leg": [0.100, 0.085, 0.112, 0.092],
}
# что крутим: у симметричных пар только x-смещение положительное
FREE = {
    "body": [1, 2, 3],
    "hip": [1, 2, 3],
    "head": [1, 2, 3],
    "ear": [0, 1, 2, 3],
    "arm": [0, 1, 2, 3],
    "leg": [0, 1, 2, 3],
}


def parts_of(params):
    """Список эллипсоидов: одиночные по центру + пары."""
    out = []
    for name, p in params.items():
        cx, cz, rx, rz = p
        if cx == 0.0:
            out.append((0.0, cz, rx, rz))
        else:
            out.append((+cx, cz, rx, rz))
            out.append((-cx, cz, rx, rz))
    return out


def width_profile(params, zs):
    parts = parts_of(params)
    out = np.zeros_like(zs)
    for i, z in enumerate(zs):
        lo, hi = 0.0, 0.0
        for cx, cz, rx, rz in parts:
            t = (z - cz) / rz
            if abs(t) >= 1.0:
                continue
            d = rx * np.sqrt(1.0 - t * t)
            lo = min(lo, cx - d)
            hi = max(hi, cx + d)
        out[i] = hi - lo
    return out


def error(params, zs, ws, fur):
    # ворс добавляет ~fur с каждой стороны силуэта
    model = width_profile(params, zs) + 2 * fur
    # ближе к верху и низу референс шумит из-за меха — вес поменьше
    w = np.where((zs > 0.03) & (zs < 0.97), 1.0, 0.35)
    return float(np.sum(w * (model - ws) ** 2) / np.sum(w))


def fit(zs, ws, fur=0.012):
    params = {k: list(v) for k, v in INIT.items()}
    best = error(params, zs, ws, fur)
    print(f"старт: err={best:.6f}")
    for step in (0.020, 0.010, 0.005, 0.002, 0.001):
        for p in range(12):
            improved = False
            for name in NAMES:
                for idx in FREE[name]:
                    base = params[name][idx]
                    for delta in (+step, -step):
                        params[name][idx] = base + delta
                        if params[name][idx] <= 0.004:
                            params[name][idx] = base
                            continue
                        e = error(params, zs, ws, fur)
                        if e < best - 1e-12:
                            best = e
                            improved = True
                            base = params[name][idx]
                        else:
                            params[name][idx] = base
            if not improved:
                break
        print(f"шаг {step:.3f}: err={best:.6f}")
    return params, best


if __name__ == "__main__":
    zs, ws, box = reference_profile(REF)
    print(f"референс: bbox={box[:4]}, ось x={box[4]:.1f}, точек профиля {len(zs)}")
    print(f"макс ширина {ws.max():.3f} на z={zs[np.argmax(ws)]:.2f}")

    params, err = fit(zs, ws)
    print("\nитог (x, z, rx, rz):")
    for name in NAMES:
        cx, cz, rx, rz = params[name]
        print(f"  {name:5s} cx={cx:+.3f} cz={cz:.3f} rx={rx:.3f} rz={rz:.3f}")
    print(f"ошибка профиля: {err:.6f} (RMS {np.sqrt(err):.4f} ширины)")

    model = width_profile(params, zs) + 2 * 0.012
    for z in (0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15, 0.05):
        i = int(np.argmin(np.abs(zs - z)))
        print(f"  z={zs[i]:.2f}  референс {ws[i]:.3f}  модель {model[i]:.3f}")
