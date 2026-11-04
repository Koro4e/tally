# Промпт для Kimi (coder) — зверёк TALLY

Куда: текстовая арена → Kimi K2 / K2-Horizon (или любая топовая кодинговая модель).
Вкладывать **ничего не надо** — промпт самодостаточный, все данные внутри.
Промпт на английском — кодинговые модели работают на нём точнее. Отправлять целиком.

---

```
You are a senior front-end developer. You are working on a real production app and
must deliver COMPLETE, paste-ready files. You cannot run anything: the user will copy
your code into his project as-is, so every file you output must be final — no
placeholders, no "// add logic here", no pseudo-code, no references to files you have
not fully included.

# 1. PROJECT

TALLY — a personal trainer for a German math entrance exam. Vite 7.3.2 + React
19.2.6 + TypeScript 5.9.3 (strict) + Tailwind CSS 4.1.17 + vite-plugin-singlefile
2.3.0. Path alias "@" -> "src". Existing dependencies you may use:
clsx 2.1.1, tailwind-merge 3.4.0, @rive-app/react-canvas 4.38.0.
IMPORTANT: the production build is a SINGLE HTML FILE (vite-plugin-singlefile), so
everything is inlined. Any binary asset (png/webp/glb/riv) is painful. Code-generated
graphics are strongly preferred. Do not add new npm dependencies unless you truly
must; if you do, keep it tiny and justify it.

# 2. THE PROBLEM

The app has a motivational mascot creature ("зверёк") — a mint-green plush bear-like
toy. It reflects the user's daily progress through 4 moods and must feel alive.

The current implementation is the user's 3rd attempt and he hates it:

- Attempt 1 (dead): AI-generated raster frames. 5 static webp images (one per mood),
  faked liveness with CSS: breathing scale, eye-patch overlays for blinking, a
  transform-based action planner. Problems: frames came from an image model, so
  proportions drift between moods, mood changes visibly "jump" between different
  poses, only one mood has a true closed-eyes frame, eyelid patches look cheap.

- Attempt 2 (dead): image-to-3D. The reference image was fed to Hunyuan 3D-style
  reconstruction — it returned ~1487 non-watertight fragments (source was a soft
  rendered plush with fur; reconstruction pipelines choke on that).

- Attempt 3 (dead-ish): procedural Blender rig. A python script built the creature
  from fitted ellipsoids: silhouette RMS error 2.4% of height, 11-bone skeleton,
  5 animation clips, 17 481 geometry fur strands, exported to a skinned GLB and
  played in three.js. It technically works, but it looks wrong next to the
  reference: single smoothed shell instead of distinct stitched head+body, ears too
  small and too round, legs too short, fur uniform instead of clumped. The user
  gave up on this path — do NOT propose another image-to-3D or Blender pipeline.

- Also dead: Rive. No free .riv mascots without an account; the one CDN file is
  format 6.3 while the runtime wants 7.0. LottieFiles assets are PRO-only.

Your job: INVENT A BETTER REPLACEMENT and fully implement it. You choose the
technique. Candidate directions (you may pick one or mix, but justify in ~10 lines):

a) A parametric SVG creature drawn in code: body parts as path/ellipse groups,
   a "character bible" of coordinates, mood as a parameter set that smoothly
   interpolates (ears angle, eye shape, mouth curve, posture, body squash), plush
   feel via SVG filters (feTurbulence for fabric grain, feGaussianBlur shading,
   stitch seams as dashed strokes). Animation with CSS transforms + Web Animations
   API. Zero dependencies, perfectly crisp at 58px and 96px.
b) Canvas 2D procedural drawing (more freedom, but harder to keep crisp and
   stateless with React 19).
c) Procedural three.js (geometry built in code, no GLB) — heavy for a mascot this
   small; bundle size in a single-file build is a real cost.
d) Hand-written Lottie JSON — no.

The strongest expected answer is (a): one React component, all vector, all code.
But you decide — the user explicitly wants you to design it, not just obey.

# 3. CHARACTER BIBLE (measured from the real reference image — keep these)

Look: a small plush toy creature, stitched-fabric aesthetic, NOT a realistic animal.
- Fur: soft mint green. Reference median RGB(164, 202, 174); render-calibrated
  base colors that hit that median: body MINT #C6F0D4, shading toward #A8C8B0.
- Belly: large cream oval patch, CREAM #F5EBD5.
- Proportions: oversized round head ≈ 45–50% of total height; chubby pear-shaped
  body; very short stubby arms and legs; no neck; no tail; no clothes.
- Ears: two small round flat ears on top, wide-set.
- Face: two small black bead eyes (glossy), tiny stitched smile, small rounded
  muzzle in lighter cream. No nose, no eyebrows, no blush.
- Overall silhouette aspect ratio (width/height) ≈ 0.76.
- Face anchor points measured on the current frames (fractions of image width /
  height) — use as calibration for your own layout, right eye mirrored:
  ok mood:      left eye x 0.3377, y 0.3949, r 0.0607
  hungrig mood: left eye x 0.3345, y 0.4111, r 0.0581
  traurig mood: left eye x 0.1901, y 0.4291, r 0.0535 (head tilted, body slumped)

# 4. BEHAVIORAL CONTRACT (must be preserved exactly)

The mascot is driven from outside; your component is a drop-in replacement.

Exported API of the current module `src/Pet.tsx` (keep identical names and types):

```ts
export type Mood = "satt" | "ok" | "hungrig" | "traurig";
export function moodOf(s: Snap, mv: Mv): Mood;
export function moodOfSnap(s: Snap): Mood;
export function petLine(m: Mood, s: Snap): string;
export default function Pet(props: {
  mood: Mood;
  className?: string;
  /** round result screen: creature was just fed — hearts + purr */
  celebrate?: boolean;
  /** in the "room" an outer system drives motion; suppress own actions */
  quiet?: boolean;
}): JSX.Element;
```

`moodOf` / `moodOfSnap` / `petLine` already exist and work — reimplement them
exactly as specified below so the file stays self-contained (do not import them
from elsewhere; `Snap`/`Mv` types come from "@/lib/motivation" and are opaque to
you: `moodOf` currently reads `s.goalHit`, `s.todayXp`, `s.streak`, `mv.days.length`).

Mood semantics:
- satt    = daily goal reached → content, eyes closed happy, subtle smile
- ok      = has XP today, goal not reached → neutral-calm, open bead eyes
- hungrig = streak alive, nothing done today → pleading, slight droop, begging eyes
- traurig = nothing at all → sad, slumped, drooping ears, teardrop allowed
`petLine` returns German lines, keep exactly:
  satt: "Satt. Genau so soll ein Tag aussehen."
  ok:   `Noch ${Math.max(0, s.goal - s.todayXp)} XP, dann bin ich satt.`
  hungrig: "Ich habe Hunger. Eine Runde reicht."
  traurig: "Ich habe gewartet. Fangen wir wieder an?"

Liveness — 4 layers, none of which may depend on the mouse pointer, because the
creature must feel alive while the user is just solving problems:

1. Breathing: continuous, subtle scale/vertical movement, always on.
2. Blinking: every 2800–6200 ms, eyelids close ~170 ms; ~22% chance of a quick
   double blink (second close 260 ms later, 110 ms). During blink or "doze" the
   eyes are closed. satt has closed happy eyes by design.
3. Own actions: every 1700–4300 ms the creature picks one action by weighted
   random choice and holds it for its duration, but ONLY if the user has not
   moved the pointer in the last 1500 ms:
     tilt-l 900 ms w3, tilt-r 900 ms w3, hop 620 ms w2, stretch 900 ms w2,
     pace-l 1300 ms w2, pace-r 1300 ms w2, doze 2800 ms w1.
   Rendered today via CSS classes `act-tilt-l` etc. on a wrapper with
   `transform-origin` at the bottom. Keep CSS-keyframe-driven actions.
4. Sound is handled elsewhere — import { chirp, purr, sigh } from "@/lib/sfx".
   On mood transition to "satt" (from anything else): purr() + increment hearts
   (3 hearts float up, CSS animation "heart", staggered 120 ms, around 38–62%
   left, top ~10%). Transition to "traurig": sigh(). Click on the creature:
   chirp(). No sound on first render. If prop `celebrate` is true on mount:
   hearts + purr().

Cursor interaction (nice-to-have, keep it): on pointermove write CSS vars to an
inner wrapper directly (no re-render): --tx (±1.6px), --ty (±1.2px), --rot
(±1.6deg) proportional to cursor offset from viewport center, inverted. Record
last-move time for the action planner skip rule. When a mood changes, preload
all mood visuals synchronously on mount so there is never an empty flash — with
code-generated graphics this becomes trivial, which is one more argument for it.

Rendering constraints:
- Usages: `<Pet mood={mood} className="h-[96px] w-auto shrink-0" />` (sidebar) and
  `<Pet mood={moodOfSnap(mv)} celebrate className="h-[58px] w-auto shrink-0" />`
  (result screen). The component fills its container height; width follows the
  creature's fixed aspect ratio (~0.76). No layout shift on mood change: same
  outer box for all moods, only inner shapes move.
- Keep the wrapper class names used by existing CSS: outer span gets
  `pet-act` + `act-${action}` when acting + `pet-happy` when mood is satt;
  inner span `pet-box relative block h-full`. (Existing index.css has keyframes
  for these classes; keep the contract, and ADD whatever new CSS your design
  needs in a clearly-marked block that can be appended to index.css.)
- TypeScript strict, React 19, no forwardRef needed, no external state libs.
- Must degrade gracefully: if anything in your drawing code throws, the app
  should not crash — wrap the render body in a simple error boundary returning
  a plain colored ellipse fallback.

# 5. WHAT TO OUTPUT

1. ~10 lines: chosen technique and why (compare against alternatives honestly).
2. The full new `src/Pet.tsx` (complete file, drop-in).
3. The CSS block to append to `src/index.css` (marked with a comment header).
4. Integration notes: anything to delete (e.g. the old webp files in public/pet
   become unused; the PetLive component can stay untouched since it uses Pet
   only as fallback — confirm your file keeps that working).
5. A short checklist "what to verify by eye" (5–7 items: proportions vs the
   numbers above, mood interpolation smoothness, blink timing, no layout shift,
   crispness at 58px).

Quality bar: this mascot is the emotional core of the app for a 19-year-old
grinding math daily for 68 days. It must be cute, feel handcrafted (stitch seams,
fabric grain), and clearly better than the AI-generated frames it replaces —
while being pure code, dependency-free, and buttery smooth.
```
