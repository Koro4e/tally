# PROMPT 01 — «Der Weg» (arena / Sonnet / Argon)

> Скопировать всё ниже разделителя. Отправлять одним сообщением.
> Проект уже существует: Vite 7 + React 19 + TS 5.9 + Tailwind 4, сборка в один файл.

---

You are a senior product designer and front-end engineer. You build interfaces that feel like precision instruments, not like SaaS landing pages.

## Context

I am building a training app for the **Mathematik entrance exam** for Studienkolleg Schleswig-Holstein (HAW Kiel, 09.01.2027). 60 minutes, ~20 points, **no calculator**. The user is a 19-year-old who is lazy and needs to be pulled into 60-second sessions — the app must feel like a training tool that rewards speed, not like an exam form.

The current design failed because it looks like an exam registration sheet: seven rows, a grade, a countdown. It communicates *"you are being measured"*. I need it to communicate *"there is exactly one thing to do next, and it takes 60 seconds."*

## The one law

**One action per screen.** The home screen must have exactly one primary action. No navigation bars, no menus, no tabs, no settings, no sidebars with filters. If the user has to choose between two things, the design is wrong.

## The data (use verbatim — do NOT invent skills)

38 nodes. `kind: "atom"` = one skill, `kind: "combo"` = two skills fused (this is what the real exam does and what breaks people). `trainer: false` means no task generator exists yet — render it as locked/unavailable, never as a working button.

```ts
export const NODES = [
  // id, label (German), deps, kind, trainer
  ["vorzeichen",            "Vorzeichen",                  [],                                              "atom",  true],
  ["quadratzahlen",         "Quadratzahlen 1–25",          [],                                              "atom",  true],
  ["klammern",              "Klammerrechnung",             ["vorzeichen"],                                  "atom",  true],
  ["bruch-add",             "Brüche addieren",             ["vorzeichen"],                                  "atom",  true],
  ["bruch-mul",             "Brüche multiplizieren",       ["bruch-add"],                                   "atom",  true],
  ["binomisch",             "Binomische Formeln",          ["klammern"],                                    "atom",  true],
  ["potenzgesetze",         "Potenzgesetze",               ["klammern"],                                    "atom",  true],
  ["wurzelgesetze",         "Wurzelgesetze",               ["quadratzahlen"],                               "atom",  true],
  ["logarithmus",           "Logarithmusgesetze",          ["potenzgesetze"],                               "atom",  true],
  ["rechenterm",            "Rechenterme gemischt",        ["bruch-mul","potenzgesetze"],                   "atom",  true],
  ["polynomdivision",       "Polynomdivision",             ["binomisch"],                                   "atom",  true],
  ["faktorisieren",         "Faktorisieren",               ["binomisch"],                                   "atom",  true],
  ["bruchterme",            "Bruchterme kürzen",           ["faktorisieren","bruch-mul"],                   "atom",  true],
  ["parameter-exponent",    "Parameter im Exponenten",     ["potenzgesetze","wurzelgesetze"],               "atom",  true],
  ["quad-gleichung",        "Quadratische Gleichungen",    ["binomisch","quadratzahlen"],                   "atom",  true],
  ["bruchgleichung",        "Bruchgleichungen",            ["bruchterme","quad-gleichung"],                 "atom",  true],
  ["wurzelgleichung",       "Wurzelgleichungen",           ["wurzelgesetze","quad-gleichung"],              "atom",  true],
  ["betragsgleichung",      "Betragsgleichungen",          ["quad-gleichung"],                              "atom",  true],
  ["exponentialgleichung",  "Exponentialgleichungen",      ["logarithmus"],                                 "atom",  true],
  ["parameter-gleichung",   "Gleichungen mit Parameter",   ["quad-gleichung"],                              "atom",  true],
  ["quad-ungleichung",      "Quadratische Ungleichungen",  ["quad-gleichung"],                              "atom",  false],
  ["log-gleichung",         "Logarithmusgleichungen",      ["logarithmus","quad-gleichung"],                "atom",  false],
  ["lgs3",                  "Gleichungssystem 3×3",        ["vorzeichen","klammern"],                       "atom",  true],
  ["gerade",                "Gerade durch zwei Punkte",    ["bruch-add"],                                   "atom",  true],
  ["lage",                  "Lage zweier Geraden",         ["gerade"],                                      "atom",  true],
  ["parabel",               "Parabeln",                    ["quad-gleichung"],                              "atom",  false],
  ["graph-lesen",           "Graph lesen",                 ["gerade"],                                      "atom",  false],
  ["prozent",               "Prozentrechnung",             ["bruch-mul"],                                   "atom",  true],
  ["proportion",            "Proportionen",                ["bruch-mul"],                                   "atom",  true],
  ["zahlenraetsel",         "Zahlenrätsel",                ["klammern"],                                    "atom",  true],
  ["kombinatorik",          "Kombinatorik",                ["quadratzahlen"],                               "atom",  true],

  // COMBOS — the real exam fuses topics. Render these as "boss" nodes.
  ["k-bruch-wurzel",        "Bruch × Wurzel",              ["bruch-mul","wurzelgesetze"],                   "combo", false],
  ["k-log-potenz",          "Logarithmus × Potenz",        ["logarithmus","potenzgesetze"],                 "combo", false],
  ["k-binom-bruch",         "Binomisch × Bruchterm",       ["binomisch","bruchterme","bruch-mul"],          "combo", false],
  ["k-potenz-wurzel-param", "Potenz × Wurzel × Parameter", ["potenzgesetze","wurzelgesetze","parameter-exponent"], "combo", false],
  ["k-binom-kubisch",       "Kubische Binome",             ["binomisch","klammern"],                        "combo", false],
  ["k-exponential-subst",   "Exponential × Quadratisch",   ["exponentialgleichung","quad-gleichung"],       "combo", false],
  ["k-bruch-quadratisch",   "Bruchgleichung → quadratisch",["bruchgleichung","quad-gleichung"],             "combo", false],
] as const;
```

Task data comes ONLY from `getTasks(skillId)` — never write a math task yourself, never hardcode an answer. If a node has `trainer: false`, there are no tasks and the node cannot be opened.

```ts
type Task = {
  id: string; skill: string;
  prompt: string;          // e.g. "1/3 − 3/4 ="
  hint?: string;
  answer: string[];        // e.g. ["-5/12"] or ["-2","11"]
  solution: string;
  par: number;             // target seconds for this task
};
```

## Screens

### 1. Der Weg (home)

A single vertical path, narrow column (max 520px) centered. Nodes alternate left/right offset to make a winding trail. Connector lines are real geometry (SVG or pseudo-elements), not a background image.

- Node states: **locked** (dim outline, nothing inside), **open** (bright ring), **current** (open + slow breathing pulse, 2.4s), **mastered** (filled, with 1–5 small level pips).
- **Combo nodes are visibly different**: larger, and the two parent branches visibly **converge into them**. This is the core idea of the product — the exam fuses topics, and you must see it. Make the convergence legible.
- Top bar: streak in days + today's plan ("3 Knoten"). Nothing else.
- Bottom: one sticky primary button — `Weiter: Logarithmusgesetze` — jumping to the current node.
- On load, scroll the current node into view.
- Background: a faint technical grid (canvas or CSS). Keep it under 8% opacity behind text.

### 2. Drill (session)

Full screen. **No back button, no menu, no logo, no exit.** This is a 60-second room.

- Top: 6 pips (progress), the skill name, and a **running timer** in mono, counting UP.
- Timer is a thin horizontal rule that fills toward `par`; the segment past `par` is a different colour. You are racing the par time, not a countdown.
- Chain counter: consecutive correct answers multiply the score (×1 → ×2 → ×3). Resets on error. This is the tension.
- Center: the task, huge (clamp 34–60px), mono, letter-spacing tight. Nothing else on screen competes.
- Bottom: input + `Prüfen`. Enter submits. After submit, Enter continues.
- Verdict appears in **reserved space** — the task and input must not move a single pixel when feedback appears.
- No animation while a task is on screen. The only moving thing is the timer.

### 3. Ergebnis (summary)

- Score: `5/6`, total time, and the delta against the sum of `par`.
- One row per task: skill, your seconds, par, ✓/✕. Failures sorted to the top.
- If total time beat the previous best: one line, `Rekord — 14 s schneller`. No confetti, no stars, no trophy emoji.
- What unlocked: `Logarithmusgesetze → Stufe 3` and, if applicable, `Neuer Knoten: Exponentialgleichungen`.
- Two actions maximum: `Nochmal`, `Zum Weg`.

## Visual direction

**Precision instrument.** Think: a measuring device, a flight computer, a lab readout. Not a course platform, not a game for children, not a SaaS dashboard.

Palette (fixed — do not substitute):
```
--bg:      #0B0B0C
--surface: #121214
--line:    #242427
--text:    #EDE7DA
--dim:     #8A8578
--accent:  #E8402A   (signal red — used sparingly, max 2 places per screen)
--ok:      #4ADE80
```

- **No webfonts, no CDN.** System stack only: `system-ui, "Segoe UI", Arial` and `ui-monospace, "Cascadia Mono", Consolas` for all numbers and labels. It must look correct on a plain Windows machine.
- Numbers are always tabular (`font-variant-numeric: tabular-nums`).
- Borders: 1px hairlines. **No shadows at all. No border-radius above 4px.**
- Hierarchy comes from scale and weight, not from colour or decoration.

## Forbidden

- Gradients, gradient meshes, purple/violet/blue accents, neon glow
- Glassmorphism, `backdrop-blur`, translucent floating cards
- Emoji, mascots, confetti, stars, trophies, badges with icons
- Icon libraries (lucide, heroicons, etc.) — use typography and CSS shapes only
- `Lorem ipsum`, "Coming soon", disabled fake buttons, placeholder charts
- Any skill name that is not in the list above
- Any math task or answer you invented yourself
- Layout shift when feedback appears
- Horizontal scroll at 390px width
- `transition: all`

## Motion

Use `motion` (framer-motion v12) — add it to dependencies.

- **The one transition that matters:** the node you tap on the path **becomes** the header of the drill screen. Shared element, continuous. If that works, everything else can be plain.
- Durations: 120–180ms (micro), 200–280ms (state), 420–560ms (screen).
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Animate `transform` and `opacity` only. Never width/height/top/left.
- Respect `prefers-reduced-motion`: all durations → 0, no pulse.

## Output contract

Return **complete file contents**, no diffs, no truncation, no `// ... rest of the file`. Every file must be paste-ready.

```
src/App.tsx                 — screen state machine only
src/components/Path.tsx     — the trail, nodes, converging combo edges
src/components/Drill.tsx    — the 60-second room
src/components/Result.tsx   — summary
src/lib/types.ts            — Task, Node, Mastery types
src/index.css               — @import "tailwindcss" + @theme tokens + base
package.json                — add "motion"
```

Hard rules:
- **Do not modify `src/lib/skills.ts` or `src/lib/tasks.ts`.** They are the source of truth and already exist.
- Import them as `@/lib/skills` and `@/lib/tasks`. The `@` alias is configured.
- Keep the existing `src/Plot.tsx` and `src/utils/cn.ts` — use `cn()` for all conditional classes.
- TypeScript strict must pass with zero errors.
- Use `useState`/`useMemo` only; no external state library, no router.

## Self-check before you answer

1. Does the home screen have exactly one primary action?
2. Are the combo nodes visibly different, with two branches converging into them?
3. Does anything move on the drill screen while a task is displayed, other than the timer?
4. Does the layout shift when feedback appears? (It must not.)
5. Is every displayed skill name from the list, and every task from `getTasks()`?
6. Does it work at 390px with no horizontal scroll?
7. Are there zero shadows, zero gradients, zero border-radius above 4px?
8. Would this look correct with Segoe UI and Consolas only?

If any answer is no, fix it before answering.
