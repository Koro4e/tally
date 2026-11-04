"""Локальный запуск TripoSR: картинка -> меш с текстурой (GLB).

Отличия от штатного run.py:
  * rembg не нужен — фон вырезаем сами по насыщенности (у референса он белый);
  * текстура сразу упаковывается в GLB (trimesh), а не отдельным png.

Запуск: python run_local.py <вход.png> <выход.glb> [--res 256] [--tex 2048]
"""

import os
import sys
import types

import numpy as np
from PIL import Image, ImageFilter

# --- заглушка rembg: tsr.utils импортирует его на уровне модуля ------------
_stub = types.ModuleType("rembg")
_stub.new_session = lambda *a, **k: None
_stub.remove = lambda img, *a, **k: img
sys.modules["rembg"] = _stub

import torch  # noqa: E402
import trimesh  # noqa: E402
from tsr.system import TSR  # noqa: E402
from tsr.bake_texture import bake_texture  # noqa: E402


def cut_background(path):
    """Фон режем заливкой от рамки, а не порогом по всему кадру.

    Порог выбивал светлые блики на мехе — в меше появлялись дыры, и TripoSR
    собирал «картошку». Заливка удаляет только связный с рамкой фон, внутренние
    светлые пятна остаются.
    """
    from collections import deque

    img = Image.open(path).convert("RGB")
    a = np.array(img).astype(np.int16)
    h, w = a.shape[:2]
    mx = a.max(axis=2)
    mn = a.min(axis=2)
    sat = mx - mn
    # фон и мягкая тень: серое (низкая насыщенность) и не тёмное
    candidate = (sat < 26) & (mx > 140)

    bg = np.zeros((h, w), dtype=bool)
    dq = deque()
    for x in range(w):
        for y in (0, h - 1):
            if candidate[y, x] and not bg[y, x]:
                bg[y, x] = True
                dq.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if candidate[y, x] and not bg[y, x]:
                bg[y, x] = True
                dq.append((y, x))
    while dq:
        y, x = dq.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and candidate[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True
                dq.append((ny, nx))

    alpha = np.where(bg, 0, 255).astype(np.uint8)
    out = img.copy()
    out.putalpha(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.0)))
    print(f"[tsr] маска: фон {bg.mean()*100:.1f}% кадра")
    return out


def fit_foreground(img, ratio=0.85, size=512, bg=0.5):
    """Вписывает объект в кадр так же, как resize_foreground в TripoSR."""
    a = np.array(img)
    alpha = a[:, :, 3]
    ys, xs = np.nonzero(alpha > 8)
    if len(xs) == 0:
        return img.convert("RGB")
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    crop = img.crop((x0, y0, x1 + 1, y1 + 1))
    scale = (size * ratio) / max(crop.width, crop.height)
    crop = crop.resize((max(1, int(crop.width * scale)), max(1, int(crop.height * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (int(bg * 255),) * 3 + (255,))
    canvas.paste(crop, ((size - crop.width) // 2, (size - crop.height) // 2), crop)
    flat = Image.new("RGB", (size, size), (int(bg * 255),) * 3)
    flat.paste(canvas, (0, 0), canvas)
    return flat


def main():
    src, dst = sys.argv[1], sys.argv[2]
    res = 256
    tex = 2048
    if "--res" in sys.argv:
        res = int(sys.argv[sys.argv.index("--res") + 1])
    if "--tex" in sys.argv:
        tex = int(sys.argv[sys.argv.index("--tex") + 1])

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[tsr] device={device} res={res} tex={tex}")

    model = TSR.from_pretrained(
        "stabilityai/TripoSR", config_name="config.yaml", weight_name="model.ckpt"
    )
    model.renderer.set_chunk_size(16384)
    model.to(device)
    model.eval()
    print("[tsr] model loaded")

    img = fit_foreground(cut_background(src))
    img.save(os.path.splitext(dst)[0] + "-input.png")

    with torch.no_grad():
        codes = model([img], device=device)
    print("[tsr] scene codes", tuple(codes.shape))

    meshes = model.extract_mesh(codes, False, resolution=res)
    mesh = meshes[0]
    print(f"[tsr] mesh {len(mesh.vertices)} verts, {len(mesh.faces)} faces")

    baked = bake_texture(mesh, model, codes[0], tex)
    tex_img = Image.fromarray((baked["colors"] * 255.0).astype(np.uint8)).transpose(Image.FLIP_TOP_BOTTOM)
    tex_path = os.path.splitext(dst)[0] + "-texture.png"
    tex_img.save(tex_path)
    print("[tsr] texture", tex_img.size)

    out = trimesh.Trimesh(
        vertices=mesh.vertices[baked["vmapping"]],
        faces=baked["indices"],
        vertex_normals=mesh.vertex_normals[baked["vmapping"]],
        process=False,
    )
    out.visual = trimesh.visual.TextureVisuals(uv=baked["uvs"], image=tex_img)
    os.makedirs(os.path.dirname(dst) or ".", exist_ok=True)
    out.export(dst)
    print(f"[tsr] saved {dst} ({os.path.getsize(dst) // 1024} KB)")
    print("[tsr] bounds", np.round(out.bounds, 3).tolist())


main()
