"""Сборка рига мишки Tally из референса front-bear.png.

Запуск (Blender 4.5, headless):
  "C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe" -b -P tools/build_pet_rig.py

Что делает по шагам:
  1. лепит единую оболочку метаболами: тело, голова, уши, лапы, ноги — без швов;
  2. чистит сетку (smooth + decimate) и добавляет плюшевый микрорельеф;
  3. режет кремовый живот эллипсом по граням, отдельным материалом;
  4. собирает морду отдельным объектом: глаза, блики, улыбка;
  5. ставит арматуру из 11 костей (root/hips/spine/chest/head/уши/лапы/ноги);
  6. вешает скиннинг: тело — automatic weights, морда — жёстко на head;
  7. пишет пять клипов: satt / ok / hungrig / traurig / essen;
  8. сохраняет .blend, экспортирует .glb, рендерит превью в shots/.

Пропорции сняты по пикселям референса (824 px высоты): голова r 0.305 от
центра z 0.655, живот — эллипс 0.150 x 0.146 в z 0.318, глаза r 0.040
на ±0.127 в z 0.687, уши r 0.080 на ±0.212 в z 0.892.
"""

import math
import os
import sys

import bpy
from mathutils.bvhtree import BVHTree

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_GLB = os.path.join(ROOT, "assets", "pet-rig.glb")
OUT_BLEND = os.path.join(ROOT, "assets", "pet-rig.blend")
SHOTS = os.path.join(ROOT, "shots")

# палитра из public/pet3d.html — чтобы 3D-мишка не расходился с макетом
MINT = 0xC6F0D4
CREAM = 0xF5EBD5
INK = 0x16241F
EYE = 0x0B1210

FPS = 24


# --------------------------------------------------------------------------- #
#  утилиты
# --------------------------------------------------------------------------- #
def srgb(hexcol):
    """sRGB -> linear: Blender ждёт линейные значения, иначе мишка светлее макета."""
    out = []
    for shift in (16, 8, 0):
        c = ((hexcol >> shift) & 0xFF) / 255.0
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (out[0], out[1], out[2], 1.0)


def link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def activate(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def apply_modifiers(obj):
    activate(obj)
    for mod in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=mod.name)


def bbox(obj):
    xs = [v.co.x for v in obj.data.vertices]
    ys = [v.co.y for v in obj.data.vertices]
    zs = [v.co.z for v in obj.data.vertices]
    return (min(xs), max(xs)), (min(ys), max(ys)), (min(zs), max(zs))


def principled(mat):
    return next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")


def set_input(node, name, value):
    """В 4.x часть сокетов переименована — не падаем, если сокета нет."""
    if name in node.inputs:
        node.inputs[name].default_value = value


def make_material(name, hexcol, rough=0.85, sheen=0.0, coat=0.0, bump=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = principled(mat)
    set_input(bsdf, "Base Color", srgb(hexcol))
    set_input(bsdf, "Roughness", rough)
    set_input(bsdf, "Metallic", 0.0)
    if sheen:
        set_input(bsdf, "Sheen Weight", sheen)
        set_input(bsdf, "Sheen Tint", srgb(0xEFFBF4))
        set_input(bsdf, "Sheen Roughness", 0.4)
    if coat:
        set_input(bsdf, "Coat Weight", coat)
        set_input(bsdf, "Coat Roughness", 0.06)

    if bump:
        # микрорельеф ворса: только для рендера, в glTF не уезжает
        nodes = mat.node_tree.nodes
        tex = nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = 260.0
        tex.inputs["Detail"].default_value = 3.0
        noise_bump = nodes.new("ShaderNodeBump")
        noise_bump.inputs["Strength"].default_value = bump
        noise_bump.inputs["Distance"].default_value = 0.004
        mat.node_tree.links.new(tex.outputs["Fac"], noise_bump.inputs["Height"])
        mat.node_tree.links.new(noise_bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


# --------------------------------------------------------------------------- #
#  тело
# --------------------------------------------------------------------------- #
def body_from_glb(path, target_faces=60000):
    """Импорт готового меша (image-to-3D) вместо процедурного тела."""
    bpy.ops.import_scene.gltf(filepath=path)
    meshes = [o for o in bpy.context.selected_objects if o.type == "MESH"]
    if not meshes:
        meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    body = max(meshes, key=lambda o: len(o.data.vertices))
    for other in meshes:
        if other is not body:
            bpy.data.objects.remove(other, do_unlink=True)
    activate(body)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    print(f"[glb] импорт: {len(body.data.vertices)} вершин, {len(body.data.polygons)} граней")

    faces = len(body.data.polygons)
    if faces > target_faces:
        dec = body.modifiers.new("Decimate", "DECIMATE")
        dec.ratio = target_faces / faces
        apply_modifiers(body)
    # Сглаживание: реконструкция приняла мех за рельеф и наделала бугров.
    # Лаплас с сохранением объёма убирает их, не схлопывая уши и лапы.
    lap = body.modifiers.new("Relax", "LAPLACIANSMOOTH")
    lap.iterations = 14
    lap.lambda_factor = 1.1
    lap.use_volume_preserve = True
    apply_modifiers(body)
    print(f"[glb] после сглаживания: {len(body.data.vertices)} вершин")
    print(f"[glb] после decimate+smooth: {len(body.data.vertices)} вершин, {len(body.data.polygons)} граней")

    # реконструкция не видит пух: мех на фото даёт объём, а меш получился
    # худее. Возвращаем его расширением по X/Y, высоту не трогаем.
    for v in body.data.vertices:
        v.co.x *= 1.075
        v.co.y *= 1.055
    print("[glb] объём возвращён: +7.5% по X, +5.5% по Y")

    # нормировка: высота 1.0, ноги на нуле, центр по X/Y
    (xmin, xmax), (ymin, ymax), (zmin, zmax) = bbox(body)
    sc = 1.0 / max(zmax - zmin, 1e-6)
    cx = (xmin + xmax) / 2
    cy = (ymin + ymax) / 2
    for v in body.data.vertices:
        v.co = ((v.co.x - cx) * sc, (v.co.y - cy) * sc, (v.co.z - zmin) * sc)
    bpy.ops.object.shade_smooth()
    print(f"[glb] нормировано: bbox {bbox(body)}")
    body.data.materials.append(make_fur_material())
    return body


def build_body():
    """Тело собирается как union точных эллипсоидов, а не метаболами.

    Метаболы не слили уши и лапы: их поле не дотягивалось до головы, и на
    рендере висели отдельные шары. Voxel-remesh сшивает пересекающиеся
    эллипсоиды в одну водонепроницаемую оболочку предсказуемо, а сглаживание
    потом убирает шов на стыке — как у плюша.
    """
    parts = []

    def blob(name, loc, radius, scale):
        # икосфера, а не UV-сфера: у UV-сферы полюса всех шаров сходятся на
        # одной вертикали, и после union по центру остаётся шов в шейдинге
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4, radius=radius, location=loc)
        obj = bpy.context.object
        obj.name = name
        obj.scale = scale
        # локация и масштаб в меш: иначе origin останется в центре первого шара
        # и нормировка по v.co сдвинет всё тело (уже наступали: морда уехала на 0.3)
        bpy.ops.object.transform_apply(location=True, rotation=False, scale=True)
        parts.append(obj)

    # размеры сняты по профилю ширины референса (доли высоты мишки):
    # голова 0.66 ширины при высоте 0.50, тело грушей, лапы 0.23…0.45,
    # ноги 0.42 в ширину
    blob("body", (0.0, 0.0, 0.395), 0.263, (1.00, 0.92, 0.950))
    blob("hip", (0.0, 0.005, 0.285), 0.250, (1.00, 0.92, 0.940))
    blob("head", (0.0, -0.005, 0.646), 0.303, (1.00, 0.94, 1.069))
    for s in (-1, 1):
        blob("ear", (s * 0.197, 0.010, 0.899), 0.099, (1.00, 0.55, 1.010))
        # плечо: без него силуэт на z=0.45 проваливается — у референса там
        # ещё видна округлая часть лапы
        blob("shoulder", (s * 0.225, 0.000, 0.455), 0.085, (1.00, 0.85, 0.55))
        blob("arm", (s * 0.300, 0.000, 0.330), 0.075, (1.00, 0.86, 1.493))
        blob("leg", (s * 0.107, 0.000, 0.092), 0.093, (1.00, 0.95, 0.989))

    activate(parts[0])
    for p in parts[1:]:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    body = bpy.context.view_layer.objects.active
    body.name = "TallyBody"
    print(f"[body] union: {len(body.data.vertices)} verts")

    rem = body.modifiers.new("Remesh", "REMESH")
    rem.mode = "VOXEL"
    rem.voxel_size = 0.007
    rem.adaptivity = 0.0
    rem.use_smooth_shade = True
    apply_modifiers(body)
    print(f"[body] remeshed: {len(body.data.vertices)} verts, {len(body.data.polygons)} faces")

    # сглаживание убирает жёсткий стык шаров, но должно быть мягким: при 12
    # проходах уши и лапы заплывают в тело и силуэт теряет референс
    sm = body.modifiers.new("Smooth", "SMOOTH")
    sm.factor = 0.35
    sm.iterations = 3
    apply_modifiers(body)

    faces = len(body.data.polygons)
    dec = body.modifiers.new("Decimate", "DECIMATE")
    dec.ratio = min(1.0, 26000.0 / max(faces, 1))
    apply_modifiers(body)
    print(f"[body] smoothed+decimated: {len(body.data.vertices)} verts, {len(body.data.polygons)} faces")

    # плюшевый микрорельеф: силуэт перестаёт быть математически гладким
    tex = bpy.data.textures.new("Plush", "CLOUDS")
    tex.noise_scale = 0.020
    tex.noise_depth = 3
    disp = body.modifiers.new("Plush", "DISPLACE")
    disp.texture = tex
    disp.strength = 0.0015
    disp.mid_level = 0.5
    disp.texture_coords = "GLOBAL"
    apply_modifiers(body)

    # сглаживание после смещения: иначе воксельные бугры читаются как грани
    relax = body.modifiers.new("Relax", "SMOOTH")
    relax.factor = 0.5
    relax.iterations = 2
    apply_modifiers(body)

    # нормировка: ровно 1.0 в высоту, ноги на нуле — иначе масштаб в three.js
    # придётся подбирать на глаз
    (_, _), (_, _), (zmin, zmax) = bbox(body)
    s = 1.0 / (zmax - zmin)
    for v in body.data.vertices:
        v.co = (v.co.x * s, v.co.y * s, (v.co.z - zmin) * s)
    print(f"[body] scale {s:.4f}, bbox {bbox(body)}")

    bpy.ops.object.shade_smooth()
    paint_colors(body)
    body.data.materials.append(make_fur_material())
    return body


def smoothstep(edge0, edge1, x):
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)


def paint_colors(body):
    """Живот делается вертексным цветом, а не вторым материалом.

    Материал по граням давал рваный край эллипса: грани крупные, ступеньки
    видны. Цвет на вершинах интерполируется, и край получается мягким,
    как у плюша, плюс весь мишка остаётся одним материалом в glTF.
    """
    mint = srgb(MINT)
    cream = srgb(CREAM)
    layer = body.data.color_attributes.new(name="Col", type="FLOAT_COLOR", domain="POINT")
    for i, v in enumerate(body.data.vertices):
        p = v.co
        d = math.sqrt((p.x / 0.148) ** 2 + ((p.z - 0.321) / 0.139) ** 2)
        t = 1.0 - smoothstep(0.90, 1.0, d)
        t *= smoothstep(-0.02, -0.10, p.y)   # только спереди, иначе пятно на спине
        layer.data[i].color = (
            mint[0] + (cream[0] - mint[0]) * t,
            mint[1] + (cream[1] - mint[1]) * t,
            mint[2] + (cream[2] - mint[2]) * t,
            1.0,
        )
    # для меша из реконструкции морда не отдельным объектом, а цветом:
    # тёмные диски на месте глаз и дуга рта, только на передних нормалях
    if os.environ.get("PET_GLB", "").strip():
        normals = body.data.vertex_normals
        dark = srgb(0x101614)
        for i, v in enumerate(body.data.vertices):
            n = normals[i].vector
            front = smoothstep(0.05, -0.35, n.y)
            if front <= 0.01:
                continue
            p = v.co
            hit = 0.0
            for ex in (-0.123, 0.123):
                d = math.sqrt(((p.x - ex) / 0.046) ** 2 + ((p.z - 0.689) / 0.048) ** 2)
                hit = max(hit, 1.0 - smoothstep(0.85, 1.0, d))
            # улыбка: тонкая дуга с провисом в центре
            arc_z = 0.632 - 0.014 * (p.x / 0.046) ** 2 if abs(p.x) < 0.05 else -1.0
            if arc_z > 0:
                dz = abs(p.z - arc_z)
                hit = max(hit, (1.0 - smoothstep(0.004, 0.009, dz)) * (1.0 - smoothstep(0.038, 0.050, abs(p.x))))
            if hit <= 0.0:
                continue
            t = hit * front
            c = layer.data[i].color
            layer.data[i].color = (
                c[0] + (dark[0] - c[0]) * t,
                c[1] + (dark[1] - c[1]) * t,
                c[2] + (dark[2] - c[2]) * t,
                1.0,
            )
        print("[face] глаза и рот нарисованы цветом вершин")

    body.data.color_attributes.active_color = layer
    print("[belly] vertex colors painted")


def make_fur_material():
    """Один материал: цвет берётся из вертексного слоя, мех — из sheen и шума."""
    mat = bpy.data.materials.new("TallyFur")
    mat.use_nodes = True
    bsdf = principled(mat)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    set_input(bsdf, "Roughness", 0.94)
    set_input(bsdf, "Metallic", 0.0)
    set_input(bsdf, "Sheen Weight", 0.9)
    set_input(bsdf, "Sheen Tint", srgb(0xF4FFF9))
    set_input(bsdf, "Sheen Roughness", 0.5)
    set_input(bsdf, "Specular IOR Level", 0.18)
    set_input(bsdf, "Subsurface Weight", 0.08)
    set_input(bsdf, "Subsurface Radius", (0.35, 0.9, 0.5))
    set_input(bsdf, "Subsurface Scale", 0.02)

    vcol = nodes.new("ShaderNodeVertexColor")
    vcol.layer_name = "Col"
    links.new(vcol.outputs["Color"], bsdf.inputs["Base Color"])

    tex = nodes.new("ShaderNodeTexNoise")
    tex.inputs["Scale"].default_value = 300.0
    tex.inputs["Detail"].default_value = 3.0
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.45
    bump.inputs["Distance"].default_value = 0.004
    links.new(tex.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def paint_belly(body):
    """Оставлено для совместимости с ранними сборками: теперь живот в цвете вершин."""
    return


# --------------------------------------------------------------------------- #
#  морда
# --------------------------------------------------------------------------- #
def surface_y(tree, x, z):
    hit = tree.ray_cast((x, -1.2, z), (0.0, 1.0, 0.0), 3.0)
    if hit[0] is None:
        return -0.24
    return hit[0].y


def build_face(body):
    """Глаза, блики и улыбка — отдельным объектом, чтобы кожа вокруг глаз
    не тянулась вместе с веком и глаза не «плавали» на морде."""
    deps = bpy.context.evaluated_depsgraph_get()
    tree = BVHTree.FromObject(body, deps)

    eye_r = 0.048
    parts = []
    for s in (-1, 1):
        x = s * 0.123
        z = 0.689
        y = surface_y(tree, x, z) + 0.014   # утопить на треть — иначе шар «наклеен»
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=eye_r, location=(x, y, z))
        eye = bpy.context.object
        eye.name = f"eye_{'L' if s < 0 else 'R'}"
        eye.scale = (1.0, 0.86, 1.0)
        eye.data.materials.append(make_material("TallyEye", 0x050706, rough=0.12, coat=0.6))
        parts.append(eye)

        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.016,
                                            location=(x - 0.015, y - 0.034, z + 0.017))
        glint = bpy.context.object
        glint.name = f"glint_{'L' if s < 0 else 'R'}"
        glint.data.materials.append(make_material("TallyGlint", 0xFFFFFF, rough=0.30, coat=1.0))
        parts.append(glint)

    # улыбка: дуга кривой, чуть заглублённая в морду
    mouth_z = 0.632
    my = surface_y(tree, 0.0, mouth_z) + 0.004
    curve = bpy.data.curves.new("Smile", "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = 0.0055
    curve.bevel_resolution = 3
    curve.resolution_u = 10
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(2)
    # глубину берём для каждой точки отдельно: у концов улыбка выше по морде,
    # и общий y загонял их внутрь — рот читался точкой
    pts = [(-0.040, 0.640), (0.0, 0.624), (0.040, 0.640)]
    for bp, (x, z) in zip(spline.bezier_points, pts):
        bp.co = (x, surface_y(tree, x, z) - 0.002, z)
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"
    smile = link(bpy.data.objects.new("smile", curve))
    smile.data.materials.append(make_material("TallyMouth", INK, rough=0.35))
    activate(smile)
    bpy.ops.object.convert(target="MESH")
    smile = bpy.context.view_layer.objects.active
    parts.append(smile)

    activate(parts[0])
    for p in parts[1:]:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    face = bpy.context.view_layer.objects.active
    face.name = "TallyFace"
    bpy.ops.object.shade_smooth()
    # apply: после join объект наследует масштаб глаза (0.86 по y), и вся
    # морда съезжает по глубине
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    # валидируем: конвертация кривой в меш оставляет вырожденные грани, и
    # экспортёр glTF ругается «Mesh is not valid»
    activate(face)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=1e-5)
    bpy.ops.mesh.fill_holes(sides=0)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    face.data.validate(verbose=False)
    print(f"[face] {len(face.data.vertices)} verts, {len(face.data.polygons)} faces")
    return face


# --------------------------------------------------------------------------- #
#  скелет
# --------------------------------------------------------------------------- #
BONES = [
    # имя, родитель, голова, хвост, deform
    ("root", None, (0, 0, 0.00), (0, 0, 0.10), False),
    ("hips", "root", (0, 0, 0.10), (0, 0, 0.24), True),
    ("spine", "hips", (0, 0, 0.24), (0, 0, 0.36), True),
    ("chest", "spine", (0, 0, 0.36), (0, 0, 0.45), True),
    ("head", "chest", (0, 0, 0.45), (0, 0, 0.88), True),
    ("ear.L", "head", (0.090, 0, 0.880), (0.222, 0, 0.930), True),
    ("ear.R", "head", (-0.090, 0, 0.880), (-0.222, 0, 0.930), True),
    ("arm.L", "chest", (0.185, 0, 0.420), (0.310, 0, 0.310), True),
    ("arm.R", "chest", (-0.185, 0, 0.420), (-0.310, 0, 0.310), True),
    ("leg.L", "hips", (0.115, 0, 0.170), (0.120, 0, 0.015), True),
    ("leg.R", "hips", (-0.115, 0, 0.170), (-0.120, 0, 0.015), True),
]


def build_rig():
    data = bpy.data.armatures.new("TallyRig")
    arm = link(bpy.data.objects.new("TallyRig", data))
    data.display_type = "OCTAHEDRAL"
    activate(arm)
    bpy.ops.object.mode_set(mode="EDIT")
    for name, parent, head, tail, deform in BONES:
        b = data.edit_bones.new(name)
        b.head = head
        b.tail = tail
        b.use_deform = deform
        if parent:
            b.parent = data.edit_bones[parent]
        b.use_connect = False
    bpy.ops.object.mode_set(mode="OBJECT")
    print(f"[rig] {len(data.bones)} bones")
    return arm


def fallback_weights(body, arm):
    """Запасной скиннинг, если bone heat не сошёлся.

    Вес = 1/d^3 до отрезка кости, три ближайшие кости, нормализация и
    лапласово сглаживание по рёбрам — на блобе этого хватает.
    """
    deform = [b for b in arm.data.bones if b.use_deform]
    segs = [(b.name, b.head_local.copy(), b.tail_local.copy()) for b in deform]
    for name, _, _ in segs:
        if name not in body.vertex_groups:
            body.vertex_groups.new(name=name)

    verts = body.data.vertices
    weights = []
    for v in verts:
        p = v.co
        row = []
        for name, a, b in segs:
            ab = b - a
            t = max(0.0, min(1.0, (p - a).dot(ab) / max(ab.length_squared, 1e-9)))
            d = (p - (a + ab * t)).length
            row.append((name, 1.0 / max(d, 1e-3) ** 3))
        row.sort(key=lambda kv: -kv[1])
        row = row[:3]
        total = sum(w for _, w in row)
        weights.append({n: w / total for n, w in row})

    # сглаживание по соседям, 3 прохода
    adj = [[] for _ in verts]
    for e in body.data.edges:
        a, b = e.vertices
        adj[a].append(b)
        adj[b].append(a)
    for _ in range(3):
        nxt = []
        for i, w in enumerate(weights):
            acc = {k: v * 0.5 for k, v in w.items()}
            nb = adj[i]
            if nb:
                share = 0.5 / len(nb)
                for j in nb:
                    for k, v in weights[j].items():
                        acc[k] = acc.get(k, 0.0) + v * share
            total = sum(acc.values())
            nxt.append({k: v / total for k, v in acc.items()})
        weights = nxt

    for i, w in enumerate(weights):
        for name, val in w.items():
            if val > 1e-4:
                body.vertex_groups[name].add([i], val, "REPLACE")
    print("[skin] fallback weights applied")


def taper_side_weights(body, near=0.006, far=0.110):
    """Плавно убирает arm/leg/ear у плоскости симметрии.

    Без этого на x=0 соседние вершины тянутся разными костями, и на наклоне
    корпуса поверхность заламывается в тонкую тёмную линию.
    """
    side = {"arm.L", "arm.R", "leg.L", "leg.R", "ear.L", "ear.R"}
    names = {g.index: g.name for g in body.vertex_groups}
    for v in body.data.vertices:
        k = smoothstep(near, far, abs(v.co.x))
        if k >= 0.999:
            continue
        for g in v.groups:
            if names.get(g.group) in side:
                g.weight *= k
    activate(body)
    bpy.ops.object.vertex_group_limit_total(limit=4)
    bpy.ops.object.vertex_group_normalize_all(lock_active=False)
    print("[skin] side weights tapered at the symmetry plane")


def rigidify_head(body, low=0.40, high=0.64):
    """Верх головы — жёстко на кость head.

    Морда (глаза, улыбка) привязана к head намертво. Если при этом сам череп
    тянется ещё и chest, на резком наклоне глаза и рот съезжают в залом —
    видно на кадре прыжка. Плавно передаём всю вершину головы одной кости.
    """
    names = {g.index: g.name for g in body.vertex_groups}
    vg = body.vertex_groups
    head_idx = vg["head"].index
    for v in body.data.vertices:
        k = smoothstep(low, high, v.co.z)
        if k <= 0.001:
            continue
        w = {g.group: g.weight for g in v.groups}
        wh = w.get(head_idx, 0.0)
        new = {gi: val * (1.0 - k) for gi, val in w.items() if gi != head_idx}
        new[head_idx] = wh + (1.0 - wh) * k
        total = sum(new.values()) or 1.0
        for gi, val in new.items():
            vg[gi].add([v.index], val / total, "REPLACE")
    activate(body)
    bpy.ops.object.vertex_group_limit_total(limit=4)
    bpy.ops.object.vertex_group_normalize_all(lock_active=False)
    print("[skin] head fixed to head bone above z=0.40")


def skin(body, face, arm):
    activate(body)
    arm.select_set(True)
    bpy.context.view_layer.objects.active = arm
    ok = True
    try:
        bpy.ops.object.parent_set(type="ARMATURE_AUTO")
    except RuntimeError as exc:
        print(f"[skin] bone heat failed: {exc}")
        ok = False

    if ok:
        # проверяем, что каждый узел получил вес: bone heat умеет «забыть» уши
        empty = 0
        for v in body.data.vertices:
            if sum(g.weight for g in v.groups) < 0.2:
                empty += 1
        print(f"[skin] automatic weights, unweighted verts: {empty} / {len(body.data.vertices)}")
        if empty > len(body.data.vertices) * 0.02:
            ok = False

    if not ok:
        body.vertex_groups.clear()
        bpy.ops.object.select_all(action="DESELECT")
        body.select_set(True)
        face.select_set(True)
        arm.select_set(True)
        bpy.context.view_layer.objects.active = arm
        bpy.ops.object.parent_set(type="ARMATURE_NAME")
        fallback_weights(body, arm)

    # Сглаживание весов и гашение боковых костей у центра.
    # bone heat на плоскости симметрии даёт разное влияние слева и справа
    # (arm.L против arm.R) — при наклоне корпуса по центру морды вылезает
    # залом, который читается как трещина. Гасим боковые группы плавно.
    activate(body)
    bpy.ops.object.mode_set(mode="WEIGHT_PAINT")
    bpy.ops.object.vertex_group_smooth(group_select_mode="ALL", factor=0.5, repeat=6, expand=0.0)
    bpy.ops.object.mode_set(mode="OBJECT")
    taper_side_weights(body)
    rigidify_head(body)

    # glTF держит максимум 4 влияния на вершину: чистим явно, иначе экспортёр
    # молча отбрасывает лишнее и веса плывут
    activate(body)
    bpy.ops.object.vertex_group_limit_total(limit=4)
    bpy.ops.object.vertex_group_normalize_all(lock_active=False)

    if face is None:  # морда нарисована в цвете вершин
        return

    # морда едет строго на голове: глаза не должны ползти по щеке
    activate(face)
    arm.select_set(True)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.parent_set(type="ARMATURE_NAME")
    vg = face.vertex_groups.get("head") or face.vertex_groups.new(name="head")
    vg.add([v.index for v in face.data.vertices], 1.0, "REPLACE")
    print("[skin] face bound to head")


# --------------------------------------------------------------------------- #
#  клипы
# --------------------------------------------------------------------------- #
def deg(v):
    return math.radians(v)


def pose_bone(arm, name):
    pb = arm.pose.bones[name]
    pb.rotation_mode = "XYZ"
    return pb


def new_action(arm, name):
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    arm.animation_data.action = act
    # Blender 4.4+: действие живёт в слоте, без него клип не вычисляется
    try:
        slot = act.slots.new(id_type="OBJECT", name=arm.name)
        arm.animation_data.action_slot = slot
    except Exception as exc:  # noqa: BLE001 — слоты есть только с 4.4
        print(f"[anim] slot skipped: {exc}")
    return act


def key(arm, frame, bone, rot=None, loc=None):
    pb = pose_bone(arm, bone)
    if rot is not None:
        pb.rotation_euler = (deg(rot[0]), deg(rot[1]), deg(rot[2]))
        pb.keyframe_insert("rotation_euler", frame=frame)
    if loc is not None:
        pb.location = loc
        pb.keyframe_insert("location", frame=frame)


def zero(arm, frame, bones=None):
    for b in bones or [x[0] for x in BONES]:
        pb = pose_bone(arm, b)
        pb.rotation_euler = (0, 0, 0)
        pb.location = (0, 0, 0)
        pb.keyframe_insert("rotation_euler", frame=frame)
        pb.keyframe_insert("location", frame=frame)


def build_clips(arm):
    """Пять клипов под состояния из src/Pet.tsx: satt / ok / hungrig / traurig
    плюс essen — разовая реакция на кормление."""
    arm.animation_data_create()

    # --- satt: ровное дыхание, уши живые -------------------------------
    new_action(arm, "satt")
    zero(arm, 1)
    for f, dz, hx in ((13, 0.010, -1.6), (25, 0.0, 0.0), (37, 0.010, -1.6), (49, 0.0, 0.0)):
        key(arm, f, "hips", loc=(0, dz, 0))
        key(arm, f, "chest", rot=(hx * 0.4, 0, 0))
        key(arm, f, "head", rot=(hx, 0, hx * 0.3))
    key(arm, 1, "ear.L", rot=(0, 0, 0))
    key(arm, 1, "ear.R", rot=(0, 0, 0))
    key(arm, 9, "ear.L", rot=(0, 0, -5))
    key(arm, 9, "ear.R", rot=(0, 0, 5))
    key(arm, 21, "ear.L", rot=(0, 0, 2))
    key(arm, 21, "ear.R", rot=(0, 0, -2))
    key(arm, 33, "ear.L", rot=(0, 0, -5))
    key(arm, 33, "ear.R", rot=(0, 0, 5))
    key(arm, 49, "ear.L", rot=(0, 0, 0))
    key(arm, 49, "ear.R", rot=(0, 0, 0))
    key(arm, 1, "arm.L", rot=(0, 0, 0))
    key(arm, 25, "arm.L", rot=(0, 0, -3))
    key(arm, 49, "arm.L", rot=(0, 0, 0))
    key(arm, 1, "arm.R", rot=(0, 0, 0))
    key(arm, 25, "arm.R", rot=(0, 0, 3))
    key(arm, 49, "arm.R", rot=(0, 0, 0))

    # --- ok: вялое дыхание, голова чуть вниз ---------------------------
    new_action(arm, "ok")
    zero(arm, 1)
    for f, dz in ((1, 0.0), (31, 0.008), (61, 0.0), (91, 0.008)):
        key(arm, f, "hips", loc=(0, dz, 0))
    for f, hx in ((1, 2.0), (31, 1.0), (61, 2.0), (91, 1.0)):
        key(arm, f, "head", rot=(hx, 0, 0))
        key(arm, f, "chest", rot=(hx * 0.5, 0, 0))
    key(arm, 1, "arm.L", rot=(0, 0, 4))
    key(arm, 1, "arm.R", rot=(0, 0, -4))
    key(arm, 91, "arm.L", rot=(0, 0, 4))
    key(arm, 91, "arm.R", rot=(0, 0, -4))

    # --- hungrig: тянется вперёд, качает головой, машет лапами ---------
    new_action(arm, "hungrig")
    zero(arm, 1)
    for f, lean, hx, arm_l in (
        (1, 8, 5, -16), (9, 12, -4, -38), (17, 8, 8, -16),
        (25, 12, -4, -38), (33, 8, 8, -16), (41, 12, -4, -38), (49, 8, 5, -16),
    ):
        key(arm, f, "chest", rot=(lean, 0, 0))
        key(arm, f, "head", rot=(hx, 0, 0))
        key(arm, f, "arm.L", rot=(0, 0, arm_l))
        key(arm, f, "arm.R", rot=(0, 0, -arm_l))
    for f, dz in ((1, 0.0), (9, 0.006), (17, 0.0), (25, 0.006), (33, 0.0), (41, 0.006), (49, 0.0)):
        key(arm, f, "hips", loc=(0, dz, 0))
    for f, ez in ((1, 0), (9, -9), (17, 0), (25, -9), (33, 0), (41, -9), (49, 0)):
        key(arm, f, "ear.L", rot=(0, 0, ez))
        key(arm, f, "ear.R", rot=(0, 0, -ez))

    # --- traurig: голова вниз, уши обвисли, медленный выдох -------------
    new_action(arm, "traurig")
    zero(arm, 1)
    for f, dz, hx in ((1, 0.0, 13), (37, -0.010, 15), (73, 0.0, 13), (97, -0.010, 15)):
        key(arm, f, "hips", loc=(0, dz, 0))
        key(arm, f, "chest", rot=(7, 0, 0))
        key(arm, f, "head", rot=(hx, 0, 0))
    for f, ez in ((1, 18), (37, 21), (73, 18), (97, 21)):
        key(arm, f, "ear.L", rot=(0, 0, ez))
        key(arm, f, "ear.R", rot=(0, 0, -ez))
    key(arm, 1, "arm.L", rot=(0, 0, 8))
    key(arm, 1, "arm.R", rot=(0, 0, -8))
    key(arm, 97, "arm.L", rot=(0, 0, 8))
    key(arm, 97, "arm.R", rot=(0, 0, -8))

    # --- essen: присед, прыжок, приземление — разово --------------------
    new_action(arm, "essen")
    zero(arm, 1)
    key(arm, 4, "hips", loc=(0, -0.028, 0))
    key(arm, 4, "chest", rot=(7, 0, 0))
    key(arm, 4, "head", rot=(6, 0, 0))
    key(arm, 4, "arm.L", rot=(0, 0, 16))
    key(arm, 4, "arm.R", rot=(0, 0, -16))
    key(arm, 12, "hips", loc=(0, 0.075, 0))
    key(arm, 12, "chest", rot=(0, 0, 0))
    key(arm, 12, "head", rot=(0, 0, 0))
    key(arm, 12, "arm.L", rot=(0, 0, -46))
    key(arm, 12, "arm.R", rot=(0, 0, 46))
    key(arm, 12, "ear.L", rot=(0, 0, -14))
    key(arm, 12, "ear.R", rot=(0, 0, 14))
    key(arm, 18, "hips", loc=(0, 0.052, 0))
    key(arm, 24, "hips", loc=(0, -0.032, 0))
    key(arm, 24, "chest", rot=(7, 0, 0))
    key(arm, 24, "head", rot=(4, 0, 0))
    key(arm, 24, "arm.L", rot=(0, 0, 10))
    key(arm, 24, "arm.R", rot=(0, 0, -10))
    key(arm, 24, "ear.L", rot=(0, 0, 8))
    key(arm, 24, "ear.R", rot=(0, 0, -8))
    key(arm, 30, "hips", loc=(0, 0.006, 0))
    key(arm, 30, "chest", rot=(0, 0, 0))
    key(arm, 30, "head", rot=(0, 0, 0))
    key(arm, 36, "hips", loc=(0, 0, 0))
    key(arm, 36, "arm.L", rot=(0, 0, 0))
    key(arm, 36, "arm.R", rot=(0, 0, 0))
    key(arm, 36, "ear.L", rot=(0, 0, 0))
    key(arm, 36, "ear.R", rot=(0, 0, 0))

    names = [a.name for a in bpy.data.actions]
    print(f"[anim] actions: {names}")
    for act in bpy.data.actions:
        print(f"[anim] {act.name}: fcurves={len(act.fcurves)}, slots={len(act.slots)}")
    return names


def add_fuzz(body, arm, step=2, length=0.020, width=0.0048):
    """Ворсинки геометрией: по треугольнику на каждую step-ю грань тела.

    Частицы Blender в этом пайплайне выдали прядь 0.8 при hair_length 0.018 —
    длина не держалась ни одним параметром. Геометрия предсказуема: её видно
    в рендере, она уезжает в glTF и тянется скином вместе с телом.
    """
    import random
    from mathutils import Vector
    from mathutils.kdtree import KDTree

    random.seed(7)
    verts = body.data.vertices
    kd = KDTree(len(verts))
    for i, v in enumerate(verts):
        kd.insert(v.co, i)
    kd.balance()

    layer = body.data.color_attributes["Col"]
    group_names = {g.index: g.name for g in body.vertex_groups}

    coords, faces, weights, colors = [], [], [], []
    up = Vector((0.0, 0.0, 1.0))
    for pi, poly in enumerate(body.data.polygons):
        if pi % step:
            continue
        n = poly.normal
        if n.length < 0.5:
            continue
        n = n.normalized()
        c = poly.center
        # ворс не растёт вокруг глаз и рта по отдельности: одна большая
        # гладкая зона на всю морду читается залысиной
        if c.y < -0.10:
            if any(((c.x - ex) / 0.058) ** 2 + ((c.z - 0.689) / 0.060) ** 2 < 1.0
                   for ex in (-0.123, 0.123)):
                continue
            if ((c.x / 0.052) ** 2 + ((c.z - 0.632) / 0.028) ** 2) < 1.0:
                continue
        t = n.cross(up)
        if t.length < 1e-4:
            t = n.cross(Vector((0.0, 1.0, 0.0)))
        t.normalize()

        # ворс топорщится: направление чуть уводим в сторону
        jitter = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1)))
        direction = (n * 0.78 + Vector((0.0, 0.0, -1.0)) * 0.22 + jitter * 0.16).normalized()
        ln = length * random.uniform(0.55, 1.55)
        w = width * random.uniform(0.7, 1.3)

        base = len(coords)
        coords.append(c + t * (w * 0.5))
        coords.append(c - t * (w * 0.5))
        coords.append(c + direction * ln)
        faces.append((base, base + 1, base + 2))

        _, idx, _ = kd.find(c)
        src = verts[idx]
        wmap = {group_names[g.group]: g.weight for g in src.groups if g.weight > 1e-4}
        col = tuple(layer.data[idx].color)
        for _ in range(3):
            weights.append(wmap)
            colors.append(col)

    me = bpy.data.meshes.new("TallyFuzz")
    me.from_pydata([tuple(v) for v in coords], [], faces)
    me.update()
    fuzz = link(bpy.data.objects.new("TallyFuzz", me))
    fuzz.data.materials.append(bpy.data.materials["TallyFur"])

    ca = me.color_attributes.new(name="Col", type="FLOAT_COLOR", domain="POINT")
    for i, col in enumerate(colors):
        ca.data[i].color = col
    me.color_attributes.active_color = ca

    for name in {n for wmap in weights for n in wmap}:
        fuzz.vertex_groups.new(name=name)
    for i, wmap in enumerate(weights):
        for name, wt in wmap.items():
            fuzz.vertex_groups[name].add([i], wt, "REPLACE")

    fuzz.parent = arm
    mod = fuzz.modifiers.new("Armature", "ARMATURE")
    mod.object = arm
    print(f"[fuzz] {len(faces)} strands, {len(coords)} verts")
    return fuzz


# --------------------------------------------------------------------------- #
#  свет, камера, рендер
# --------------------------------------------------------------------------- #
def setup_scene():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 620
    scene.render.resolution_y = 760
    scene.render.film_transparent = False
    scene.render.fps = FPS
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.0

    world = bpy.data.worlds.new("Studio")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = srgb(0xF7F7F5)
    bg.inputs[1].default_value = 0.30
    scene.world = world

    # пол: без него непонятно, стоит мишка или висит
    bpy.ops.mesh.primitive_plane_add(size=14, location=(0, 0, 0))
    floor = bpy.context.object
    floor.name = "Floor"
    floor.data.materials.append(make_material("FloorMat", 0xF2F2EE, rough=0.95))

    cam_data = bpy.data.cameras.new("Cam")
    cam_data.lens = 85
    cam = link(bpy.data.objects.new("Cam", cam_data))
    cam.location = (0.0, -4.2, 0.55)
    cam.rotation_euler = (math.radians(90.0), 0.0, 0.0)
    scene.camera = cam

    # свет светит в мишку, а не в камеру: с TRACK_TO на камеру тени исчезали
    target = link(bpy.data.objects.new("LookAt", None))
    target.location = (0.0, 0.0, 0.50)

    def area(name, loc, energy, size, color=(1, 1, 1)):
        d = bpy.data.lights.new(name, "AREA")
        d.energy = energy
        d.size = size
        d.color = color
        obj = link(bpy.data.objects.new(name, d))
        obj.location = loc
        track = obj.constraints.new("TRACK_TO")
        track.target = target
        return obj

    area("Key", (-2.2, -2.6, 2.6), 95, 1.1, (1.0, 0.98, 0.95))
    area("Fill", (2.4, -1.8, 0.6), 22, 2.0, (0.94, 0.98, 1.0))
    area("Rim", (0.2, 2.4, 2.0), 55, 1.2, (0.96, 1.0, 0.98))
    return cam


def aim(cam, loc, look_z=0.50):
    cam.location = loc
    dz = look_z - loc[2]
    cam.rotation_euler = (math.radians(90.0 - math.degrees(math.atan2(dz, abs(loc[1])))), 0.0, 0.0)


def render_to(path, arm, action, frame, cam_loc, look_z=0.50):
    scene = bpy.context.scene
    cam = scene.camera
    if action:
        arm.animation_data.action = bpy.data.actions[action]
    scene.frame_set(frame)
    aim(cam, cam_loc, look_z)
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print(f"[render] {os.path.basename(path)}")


# --------------------------------------------------------------------------- #
def main():
    os.makedirs(SHOTS, exist_ok=True)
    os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)

    glb = os.environ.get("PET_GLB", "").strip()
    if glb:
        body = body_from_glb(glb)
        face = None
    else:
        body = build_body()
        paint_belly(body)
        face = build_face(body)
    arm = build_rig()
    skin(body, face, arm)
    build_clips(arm)
    fuzz = None if os.environ.get("PET_GLB", "").strip() else add_fuzz(body, arm)

    # на экспорт: idle-клип как активный, чтобы вьюер не открывался в T-позе
    arm.animation_data.action = bpy.data.actions["satt"]

    # .blend сохраняем после света и шерсти: файл должен открываться готовой
    # сценой, а не голым мешем
    bpy.ops.object.select_all(action="DESELECT")
    for o in [o for o in (body, face, fuzz, arm) if o is not None]:
        o.select_set(True)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.export_scene.gltf(
        filepath=OUT_GLB,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_skins=True,
        export_animations=True,
        export_animation_mode="ACTIONS",
        export_bake_animation=False,
        export_optimize_animation_size=False,
        export_anim_single_armature=True,
    )
    print(f"[export] {OUT_GLB} ({os.path.getsize(OUT_GLB) // 1024} KB)")

    setup_scene()
    bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
    print(f"[save] {OUT_BLEND}")
    quick = bool(os.environ.get("PET_QUICK"))
    shots = [
        ("pet-rig-front.png", "satt", 25, (0.0, -4.2, 0.55)),
        ("pet-rig-q34.png", "satt", 25, (-2.4, -3.35, 1.05)),
        ("pet-rig-side.png", "satt", 25, (3.6, -1.9, 0.7)),
        ("pet-rig-hungrig.png", "hungrig", 9, (0.0, -4.2, 0.55)),
        ("pet-rig-traurig.png", "traurig", 60, (0.0, -4.2, 0.55)),
        ("pet-rig-essen.png", "essen", 12, (0.0, -4.2, 0.55)),
    ]
    for name, action, frame, loc in (shots[:1] if quick else shots):
        render_to(os.path.join(SHOTS, name), arm, action, frame, loc)
    print("[done]")


main()
