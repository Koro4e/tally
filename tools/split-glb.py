"""Разбор GLB от сервиса реконструкции.

Сервис получил лист из четырёх видов и разложил их в ряд: в файле одна сетка
из четырёх несвязанных фигурок. Здесь мы режем её по компонентам связности,
показываем габариты каждой и вытаскиваем лучшую как отдельную модель.

Запуск: python tools/split-glb.py <вход.glb> <папка-вывода>
"""

import os
import sys
import numpy as np
import trimesh

SRC = sys.argv[1] if len(sys.argv) > 1 else r"D:\AI-Workspace\projects\tally\assets\pet-model.glb"
OUT = sys.argv[2] if len(sys.argv) > 2 else r"D:\AI-Workspace\projects\tally\assets\pet-single.glb"

scene = trimesh.load(SRC, force="scene")
print("объектов в сцене:", len(scene.geometry))

parts = []
for name, m in scene.geometry.items():
    print(f"\nсетка «{name}»: {len(m.vertices)} вершин, {len(m.faces)} граней")
    comps = m.split(only_watertight=False)
    print("  компонент связности:", len(comps))

    # объединяем всё, что меньше 200 граней, в «мусор»
    body = [c for c in comps if len(c.faces) > 200]
    print("  из них заметных:", len(body))
    for c in sorted(body, key=lambda x: -x.centroid[0]):
        ext = c.extents
        print(
            f"    центр x={c.centroid[0]:+.2f}  габариты "
            f"{ext[0]:.2f} × {ext[1]:.2f} × {ext[2]:.2f}  граней {len(c.faces)}"
        )
    parts.extend(body)

if not parts:
    print("не нашёл ни одной заметной части")
    sys.exit(1)

# самая крупная по числу граней часть — обычно фронт (лучше всего виден камере)
best = max(parts, key=lambda c: len(c.faces))
ext = best.extents
print(f"\nвыбрана часть: габариты {ext[0]:.2f} × {ext[1]:.2f} × {ext[2]:.2f}, граней {len(best.faces)}")

# ставим в ноль и экспортируем вместе с материалом
best.apply_translation(-best.centroid)
best.metadata = {}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
best.export(OUT)
print("сохранено:", OUT, os.path.getsize(OUT) // 1024, "КБ")
