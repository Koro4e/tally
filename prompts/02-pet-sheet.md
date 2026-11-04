# Промпт для арены — зверёк (turnaround + эмоции)

Куда: LMArena → Image Arena → **Direct** (не Battle — в battle нельзя вложить референс).
Модели по лидерборду на сейчас: **GPT-Image-2** (№1), **Nano Banana 2 / Gemini image** (№2), **Qwen-Image-3.0-Pro**. Прогнать промпт через 2–3 модели и выбрать глазами.

## Какие файлы вкладывать

НЕ все. Только картинки, максимум 2–3:

- `assets/ref-plush-green.png` — **главный референс**, «вот такого зверька»
- `public/pet/2-ok.webp` — как зверёк выглядит в приложении (стиль/цвет в реальном размере)

Что НЕ вкладывать: `pet-rig.glb`, `.blend`, рендеры из `blender-out/` — текстовая модель их не читает, а image-модель они только сбивают («нарисуй похожее на этот кривой рендер»). Лист `pet-sheet-3d.jpg` тоже не надо — модель начнёт копировать компоновку листа, а не персонажа.

## Зачем это всё

3D-путь падал по двум причинам: (1) реконструктор (Hunyuan) получил на вход мягкий рендер с мехом и вернул 1487 кусков не-watertight; (2) свой Blender-риг не бьётся 1:1 с референсом. Топовая image-модель закрывает **вход** пайплайна: чистый turnaround на белом фоне — лучший вход для image-to-3D, и одновременно готовые спрайты лучше текущих. Промпт ниже именно это и просит.

---

## ПРОМПТ 1 — Turnaround sheet (главный, для 3D-пайплайна)

Скопировать целиком, английским — image-модели слушаются его лучше:

```
Use the attached image as the ONE and ONLY character reference. Do not invent a new
creature, do not restyle it, do not change its colors, proportions or face. The output
must read as the EXACT same character, just photographed from different angles.

TASK: Generate a single production-quality CHARACTER TURNAROUND SHEET of this character,
intended as input for image-to-3D reconstruction.

SHEET LAYOUT:
- Exactly 4 full-body views in one horizontal row, in this order:
  1) FRONT view (facing camera)
  2) THREE-QUARTER view (turned 45° to its left)
  3) SIDE view (full profile)
  4) BACK view (rear, showing the back of the head, ears and body)
- All four figures at IDENTICAL scale: same pixel height, same head size, feet aligned
  on one invisible shared baseline. No figure may be larger or smaller than another.
- Generous spacing between figures so their silhouettes never touch or overlap.

CHARACTER BIBLE (must match the reference exactly, do not deviate):
- A small plush toy creature, stitched-fabric toy aesthetic, NOT a real animal.
- Fur color: soft mint green (approx #A8C8B0 to #C6F0D4), short matte plush fabric,
  visible but subtle fabric/felt texture.
- Belly: large cream oval patch (approx #F5EBD5), slightly lighter felt.
- Proportions: oversized round head taking roughly 45-50% of total height; chubby
  pear-shaped body; very short stubby arms and legs; no neck; no tail; no clothes.
- Ears: two small round flat ears on top, wide-set.
- Face: two small black bead eyes (simple shiny spheres), tiny stitched smile,
  small rounded muzzle in lighter cream plush. No nose beyond the muzzle shape,
  no eyebrows, no blush, no extra details.
- Pose: neutral A-pose, arms slightly away from body, legs straight, standing
  upright, fully visible head-to-toe with margin above the head and below the feet.

RENDER STYLE:
- Clean 3D render of a plush toy: soft even studio lighting from the front-top,
  gentle ambient occlusion only, matte materials, NO glossy highlights, NO subsurface
  glow, NO long fur strands or fur cards — short velvety fabric surface only.
- Background: flat pure white #FFFFFF, absolutely uniform, no gradient, no vignette.
- NO ground, NO floor plane, NO cast shadow, NO reflections, NO props, NO bowl,
  NO text, NO labels, NO watermarks, NO panel borders, NO grid lines.

STRICTLY AVOID:
- changing eye size, ear size, head-to-body ratio or colors between panels
- different poses per panel (all four are the same neutral standing pose)
- perspective distortion (camera at character's chest height, mild telephoto look)
- fluffy long fur, particle hair, backlit rim light, colored lighting
- cropped limbs, cut-off ears, figures touching the image edge
```

## ПРОМПТ 2 — Лист эмоций (спрайты для приложения)

Отправить **в том же чате следующим сообщением** (модель уже держит персонажа в контексте):

```
Same exact character as before, unchanged. Now generate a MOOD SHEET:
a clean grid of 5 full-body panels (2 rows: 3 on top, 2 below), one mood each,
all at identical scale, feet on a shared baseline, flat pure white #FFFFFF
background, no shadows, no props, no text, no borders.

Panel 1 — "satt" (well-fed): sitting upright and content, eyes closed as two
happy curved lines, subtle smile, relaxed posture, tiny round belly pushed forward.
Panel 2 — "ok" (neutral): standing, open black bead eyes, small smile, calm pose.
Panel 3 — "hungrig" (hungry): standing with slightly drooping posture, ears tilted
down a little, eyes looking up with small pleading pupils, mouth a tiny flat line,
arms hanging in front of the belly.
Panel 4 — "traurig" (sad): sitting slumped, ears drooping down clearly, eyes half
closed, single small teardrop under one eye, mouth curved down.
Panel 5 — "essen" (eating): sitting, holding a tiny simple cream-colored bowl with
both front paws close to the mouth, happy closed eyes, crumb-free, bowl is plain
with no pattern.

Same render style and character bible as the previous sheet: matte mint plush,
cream belly, oversized head, no long fur, even soft light, no background elements.
All five must be recognizably the SAME toy: identical colors, head size and face
design across panels.
```

## ПРОМПТ 3 — Один чистый фас (если 3D-сервис ест только одиночные картинки)

```
Generate ONE single full-body FRONT view of the exact character from the attached
reference: standing neutral A-pose, centered, occupying 85% of image height, flat
pure white #FFFFFF background, no shadow, no ground, no props, no text. Matte mint
plush fabric, cream belly patch, oversized round head, black bead eyes, tiny smile.
Mild telephoto look, no perspective distortion. This will be fed to image-to-3D
reconstruction, so the silhouette must be complete and unambiguous: all four limbs
fully visible and separated from the body outline where possible.
```

---

## Что делать с результатом

1. **Выбор модели.** Прогнать промпт 1 через GPT-Image-2 и Nano Banana 2 (Direct), сравнить по четырём панелям: одинаковый ли масштаб, не поплыл ли цвет, не торчат ли лапы. Обычно у одного из двух консистентность лучше — его и брать для промптов 2–3.
2. **Спрайты.** Нарезать панель нужного настроения через `tools/cut-pet.py` (он уже умеет обрезать по содержимому и прижимать окно к лапам), конвертнуть в WebP q84 — текущий пайплайн, файлы весят 22–23 КБ.
3. **3D, если всё ещё хочется.** Взять панель FRONT (или вывод промпта 3) → Tripo / Meshy / Hunyuan 3D 2.x image-to-3D. Причина прошлых 1487 кусков — мех и мягкий рендер на входе; «short velvety fabric, no fur cards» в промпте это лечит. Если сетка снова развалится — на white-background plush это означает, что сервис плохой, а не картинка: пробовать другой сервис, не перегенерировать картинку.
4. **Не удалять** текущие webp и `Pet.tsx` до полной замены: новые кадры подставляются тем же скриптом нарезки, старый вариант возвращается из `assets/pet-sheet-3d.jpg` одной командой.
