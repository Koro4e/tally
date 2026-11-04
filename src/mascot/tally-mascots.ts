/* ============================================================================
   МАСКОТЫ TALLY — риг (пружины) + части + 5 зверей.
   ----------------------------------------------------------------------------
   Порт проверенного vanilla-ригa (visualizations/tally-mascots.html, который в
   свою очередь портирован с эталонной совы). Код намеренно императивный: пружины
   мутируют в rAF-цикле, DOM трогается напрямую — React в кадре не участвует,
   поэтому 60 fps ничего не стоят. Компонент-обёртка — Mascot.tsx.

   Что внутри:
     Spring / Engine — пружинный движок поз (8 настроений, прыжки, моргание,
                       блуждание взгляда, дыхание, squash & stretch)
     Frame/Body/Eye/Brow/Cheek/Mouth/Fx — сборка SVG-частей
     CharPip…CharGloop — пять зверей на одном риге
     mount(svg, ch)    — собрать зверя и вернуть функцию кадра
   ========================================================================== */

export type RigMood =
  | "idle"
  | "happy"
  | "cheer"
  | "think"
  | "wow"
  | "sad"
  | "angry"
  | "sleep";

export const clamp = (v: number, a: number, b: number): number =>
  Math.max(a, Math.min(b, v));
export const rand = (a: number, b: number): number => a + Math.random() * (b - a);

const NS = "http://www.w3.org/2000/svg";

type Attrs = Record<string, string | number>;

function el(tag: string, attrs: Attrs | null, parent: Element): SVGElement {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  parent.appendChild(e);
  return e;
}

function tf(e: Element, s: string): void {
  e.setAttribute("transform", s);
}

/* ============================== ПОЗЫ ===================================== */

export const BASE = {
  open: 1,
  smile: 0.35,
  mouth: 0,
  tilt: 0,
  browUp: 0,
  armL: 8,
  armR: 8,
  cheek: 0.25,
  pupil: 1,
  look: 1,
  gx: 0,
  gy: 0,
  scale: 1,
  wave: 0,
  zzz: 0,
  spark: 0,
  think: 0,
};

export type PoseState = typeof BASE;
type PoseKey = keyof PoseState;

export const POSES: Record<RigMood, PoseState> = {
  idle: { ...BASE },
  happy: { ...BASE, smile: 1, mouth: 0.45, browUp: 0.6, armL: 30, armR: 30, cheek: 0.9, pupil: 1.12, scale: 1.02, wave: 0.35 },
  cheer: { ...BASE, smile: 1, mouth: 1, browUp: 1, armL: 155, armR: 155, cheek: 1, pupil: 1.2, look: 0.4, scale: 1.04, wave: 1, spark: 1 },
  sad: { ...BASE, open: 0.72, smile: -0.9, tilt: 0.9, browUp: -0.1, armL: 3, armR: 3, cheek: 0, pupil: 1.18, look: 0.12, gy: 0.75, scale: 0.97 },
  think: { ...BASE, smile: -0.05, tilt: -0.25, browUp: 0.9, armR: 88, look: 0, gx: 0.7, gy: -0.75, think: 1 },
  wow: { ...BASE, smile: -0.1, mouth: 1, browUp: 1, armL: 62, armR: 62, cheek: 0.3, pupil: 0.72, scale: 1.07 },
  angry: { ...BASE, open: 0.8, smile: -0.7, mouth: 0.2, tilt: -1, browUp: -0.4, armL: 22, armR: 22, cheek: 0, pupil: 0.8, look: 0.6 },
  sleep: { ...BASE, open: 0, smile: 0.3, armL: 3, armR: 3, cheek: 0.5, look: 0, gy: 0.3, scale: 0.98, zzz: 1 },
};

export type ActKind = "hop" | "tilt" | "look" | "blink" | "stretch";

export type RigState = {
  lx: number; ly: number; blink: number; smile: number; mouth: number;
  tilt: number; browUp: number; armL: number; armR: number; sx: number;
  sy: number; y: number; rot: number; sway: number; cheek: number;
  pupil: number; zzz: number; spark: number; think: number; t: number;
};

/* ============================ КУРСОР ===================================== */

const pointer = { x: 0, y: 0, last: -1e9, bound: false };

export function bindPointer(): void {
  if (pointer.bound) return;
  pointer.bound = true;
  const upd = (e: PointerEvent): void => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.last = performance.now();
  };
  window.addEventListener("pointermove", upd, { passive: true });
  window.addEventListener("pointerdown", upd, { passive: true });
}

/* ============================ ПРУЖИНЫ ==================================== */

export class Spring {
  x: number;
  v = 0;
  k: number;
  d: number;
  constructor(x: number, k = 170, d = 16) {
    this.x = x;
    this.k = k;
    this.d = d;
  }
  step(target: number, dt: number): void {
    const n = 2;
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = this.k * (target - this.x) - this.d * this.v;
      this.v += a * h;
      this.x += this.v * h;
    }
  }
}

export class Engine {
  t = 0;
  mood: RigMood = "idle";
  tempMood: RigMood | null = null;
  tempUntil = 0;
  springs: Record<PoseKey, Spring>;
  lx = new Spring(0, 200, 18);
  ly = new Spring(0, 200, 18);
  sq = new Spring(0, 230, 11);
  sway = new Spring(0, 90, 5);
  /* спонтанные действия (планировщик «живости») */
  private act: { kind: ActKind; until: number } | null = null;
  private nextAct = rand(1.5, 4);
  private actDir = 1;
  private actRot = new Spring(0, 130, 11);
  private actArm = new Spring(0, 120, 11);
  private actGazeUntil = 0;
  y = 0;
  vy = 0;
  jumpT = 0;
  nextBlink = rand(1.5, 3.5);
  blinkP = -1;
  doubleBlink = false;
  wanderT = 0;
  wx = 0;
  wy = 0;
  cheekBoost = 0;
  readonly out: RigState = {
    lx: 0, ly: 0, blink: 0, smile: 0.35, mouth: 0, tilt: 0, browUp: 0,
    armL: 8, armR: 8, sx: 1, sy: 1, y: 0, rot: 0, sway: 0, cheek: 0.25,
    pupil: 1, zzz: 0, spark: 0, think: 0, t: 0,
  };

  constructor() {
    const s = {} as Record<PoseKey, Spring>;
    for (const k of Object.keys(BASE) as PoseKey[]) s[k] = new Spring(BASE[k]);
    s.open.k = 320;
    s.open.d = 24;
    this.springs = s;
  }

  setMood(m: RigMood): void {
    if (m === this.mood) return;
    this.mood = m;
    this.sq.v += m === "wow" ? 5 : m === "sad" ? -2 : 3.5;
    if (m === "wow" || m === "cheer") this.jump(m === "wow" ? 260 : 380);
    if (m === "angry") this.sq.v -= 3;
    this.jumpT = 0;
    /* после смены позы даём зверьку секунды две пожить в ней без самодеятельности */
    this.nextAct = this.t + rand(1.5, 3.5);
    this.act = null;
  }

  /** Спонтанное действие — то, что отличает «живое» от «зацикленного»:
      зверёк сам подпрыгивает, косит взгляд, наклоняет голову, потягивается,
      моргает дважды. Набор и веса зависят от настроения. */
  private startAct(eff: RigMood, t: number): void {
    this.nextAct = t + rand(2.5, 6.5);
    const pool: ActKind[] = [];
    const push = (k: ActKind, w: number): void => {
      for (let i = 0; i < w; i++) pool.push(k);
    };
    if (eff !== "sleep") {
      push("blink", 3);
      if (eff === "sad") {
        push("tilt", 3);
        push("look", 3);
      } else if (eff === "angry") {
        push("hop", 2);
        push("tilt", 2);
        push("blink", 1);
      } else {
        push("hop", 2);
        push("tilt", 3);
        push("look", 2);
        push("stretch", 2);
      }
    }
    if (pool.length === 0) return;
    const kind = pool[Math.floor(Math.random() * pool.length)];
    this.actDir = Math.random() < 0.5 ? -1 : 1;
    switch (kind) {
      case "hop":
        this.jump(rand(140, 240));
        this.act = { kind, until: t + 0.01 };
        break;
      case "tilt":
        this.actRot.v += this.actDir * rand(18, 30);
        this.act = { kind, until: t + rand(0.9, 1.6) };
        break;
      case "look":
        /* даже при живой мыши зверёк на секунду уходит «посмотреть по сторонам» */
        this.actGazeUntil = t + rand(0.8, 1.8);
        this.act = { kind, until: t + 0.01 };
        break;
      case "blink":
        this.blinkP = 0;
        this.doubleBlink = Math.random() < 0.55;
        this.act = { kind, until: t + 0.01 };
        break;
      case "stretch":
        this.actArm.v += rand(60, 90);
        this.act = { kind, until: t + rand(1, 1.8) };
        break;
    }
  }

  jump(v: number): void {
    if (this.y >= -0.5) this.vy = -v;
  }

  poke(): void {
    this.sq.v += -6;
    this.cheekBoost = 1;
    if (this.mood === "sleep") {
      this.tempMood = "wow";
      this.tempUntil = this.t + 1.3;
      this.jump(300);
    } else if (this.mood === "idle" || this.mood === "think") {
      this.tempMood = "happy";
      this.tempUntil = this.t + 1.1;
      this.jump(260);
    } else {
      this.jump(220);
    }
  }

  step(dt: number, rect: DOMRect | null, reduced: boolean): RigState {
    this.t += dt;
    const t = this.t;
    const eff: RigMood =
      this.tempMood && t < this.tempUntil ? this.tempMood : this.mood;
    const P = POSES[eff];
    for (const k of Object.keys(P) as PoseKey[]) this.springs[k].step(P[k], dt);
    const p = (k: PoseKey): number => this.springs[k].x;

    /* планировщик действий */
    if (!reduced && t > this.nextAct) {
      if (!this.tempMood || t >= this.tempUntil) this.startAct(eff, t);
      else this.nextAct = t + 1;
    }
    if (this.act && t >= this.act.until) this.act = null;

    let cx = 0;
    let cy = 0;
    const seen = performance.now() - pointer.last < 4500;
    if (rect && seen && t >= this.actGazeUntil) {
      const dx = (pointer.x - (rect.left + rect.width / 2)) / Math.max(rect.width * 1.1, 220);
      const dy = (pointer.y - (rect.top + rect.height * 0.45)) / Math.max(rect.height * 1.1, 220);
      const len = Math.hypot(dx, dy);
      const n = len > 1 ? 1 / len : 1;
      cx = dx * n;
      cy = dy * n;
    } else {
      if (t > this.wanderT) {
        this.wx = rand(-0.85, 0.85);
        this.wy = rand(-0.5, 0.45);
        this.wanderT = t + rand(1.2, 3.4);
      }
      cx = this.wx;
      cy = this.wy;
    }
    const look = clamp(p("look"), 0, 1);
    this.lx.step(look * cx + (1 - look) * p("gx"), dt);
    this.ly.step(look * cy + (1 - look) * p("gy"), dt);

    this.nextBlink -= dt;
    if (this.nextBlink <= 0 && this.blinkP < 0) {
      this.blinkP = 0;
      this.doubleBlink = Math.random() < 0.2;
    }
    let blink = 0;
    if (this.blinkP >= 0) {
      this.blinkP += dt / 0.17;
      blink = Math.sin(Math.min(1, this.blinkP) * Math.PI);
      if (this.blinkP >= 1) {
        this.blinkP = -1;
        this.nextBlink = this.doubleBlink ? 0.12 : rand(2.2, 5);
        this.doubleBlink = false;
      }
    }
    const closed = clamp(Math.max(blink, 1 - p("open")), 0, 1);

    const G = 1900;
    if (this.y < 0 || this.vy < 0) {
      this.vy += G * dt;
      this.y += this.vy * dt;
      if (this.y >= 0) {
        if (this.vy > 120) this.sq.v -= Math.min(7, this.vy * 0.012);
        this.y = 0;
        this.vy = 0;
      }
    }
    if (!reduced) {
      this.jumpT += dt;
      if (eff === "cheer" && this.jumpT > 0.82) {
        this.jumpT = 0;
        this.jump(380);
      } else if (eff === "happy" && this.jumpT > 3.2) {
        this.jumpT = 0;
        this.jump(230);
      }
    }

    this.sq.step(0, dt);
    const sq = clamp(this.sq.x, -0.32, 0.32);
    const stretch = clamp(-this.vy / 1800, -0.12, 0.18);
    const breathSpeed = eff === "sleep" ? 1.6 : eff === "sad" ? 1.5 : 2.6;
    const breathAmp = eff === "sleep" ? 0.028 : 0.014;
    const br = Math.sin(t * breathSpeed) * breathAmp;
    const sc = p("scale");
    this.sway.step(clamp(this.lx.x * 7 - this.vy * 0.018, -14, 14), dt);

    let rot = this.lx.x * 2.2;
    if (eff === "angry") rot += Math.sin(t * 42) * 1.4;
    if (eff === "sleep") rot += Math.sin(t * 1.1) * 2.5;
    if (eff === "sad") rot += Math.sin(t * 1.5) * 0.8;
    if (eff === "think") rot += -2.5;

    const w = p("wave");
    const idle = eff === "idle";
    let armL = p("armL") + Math.sin(t * 13) * 16 * w + (idle ? Math.sin(t * 2.6) * 2 : 0);
    let armR = p("armR") + Math.sin(t * 13 + 1.7) * 16 * w + (idle ? Math.sin(t * 2.6 + 1) * 2 : 0);
    this.actRot.step(0, dt);
    this.actArm.step(0, dt);
    rot += this.actRot.x;
    armL += this.actArm.x;
    armR += this.actArm.x;

    this.cheekBoost = Math.max(0, this.cheekBoost - dt * 0.7);

    const o = this.out;
    o.lx = this.lx.x;
    o.ly = this.ly.x;
    o.blink = closed;
    o.smile = clamp(p("smile"), -1.1, 1.1);
    o.mouth = clamp(p("mouth"), 0, 1.1);
    o.tilt = p("tilt");
    o.browUp = p("browUp");
    o.armL = armL;
    o.armR = armR;
    o.sx = sc * (1 - sq * 0.62 - stretch * 0.5 - br * 0.5);
    o.sy = sc * (1 + sq + stretch + br);
    o.y = this.y;
    o.rot = rot;
    o.sway = this.sway.x;
    o.cheek = clamp(p("cheek") + this.cheekBoost * 0.7, 0, 1);
    o.pupil = p("pupil");
    o.zzz = p("zzz");
    o.spark = p("spark");
    o.think = p("think");
    o.t = t;
    return o;
  }
}

/* ============================= ЧАСТИ ===================================== */

export function Frame(
  svg: SVGElement,
  shadowW: number,
): { g: SVGElement; upd(s: RigState): void; fx: SVGElement } {
  const sh = el("ellipse", { cx: 150, cy: 274, rx: shadowW, ry: 9, fill: "#000", opacity: 0.1 }, svg);
  const g = el("g", null, svg);
  const fx = el("g", { "pointer-events": "none" }, svg);
  const upd = (s: RigState): void => {
    const k = clamp(1 + s.y / 220, 0.55, 1.1);
    sh.setAttribute("rx", String(shadowW * k));
    sh.setAttribute("ry", String(9 * k));
    sh.setAttribute("opacity", String(0.1 * k));
    tf(g, "translate(0 " + s.y.toFixed(2) + ") translate(150 270) rotate(" + s.rot.toFixed(2) + ") scale(" + s.sx.toFixed(4) + " " + s.sy.toFixed(4) + ") translate(-150 -270)");
  };
  return { g, upd, fx };
}

export function Body(
  parent: SVGElement,
  d: string,
  baseC: string,
  darkC: string,
  lift = 8,
): void {
  const id = "bg" + (++uid);
  const defs = el("defs", null, parent);
  const rg = el("radialGradient", { id, cx: 0.3, cy: 0.2, r: 0.85 }, defs);
  el("stop", { offset: 0, "stop-color": "#fff", "stop-opacity": 0.38 }, rg);
  el("stop", { offset: 0.5, "stop-color": "#fff", "stop-opacity": 0 }, rg);
  el("stop", { offset: 1, "stop-color": "#000", "stop-opacity": 0.12 }, rg);
  el("path", { d, fill: darkC }, parent);
  const lifted = el("g", { transform: "translate(0 " + -lift + ")" }, parent);
  el("path", { d, fill: baseC }, lifted);
  el("path", { d, fill: "url(#" + id + ")" }, lifted);
}

export type EyeOpts = { sclera?: string; ink?: string; pupilR?: number };

export function Eye(
  parent: SVGElement,
  cx: number,
  cy: number,
  r: number,
  opts: EyeOpts = {},
): { upd(s: RigState): void } {
  const sclera = opts.sclera || "#fff";
  const ink = opts.ink || "#3c3c3c";
  const g = el("g", { transform: "translate(" + cx + " " + cy + ")" }, parent);
  const inner = el("g", null, g);
  el("ellipse", { rx: r, ry: r * 1.08, fill: sclera }, inner);
  const pupil = el("circle", { r: r * 0.5, fill: ink }, inner);
  const hl1 = el("circle", { r: r * 0.15, fill: "#fff" }, inner);
  const hl2 = el("circle", { r: r * 0.07, fill: "#fff", opacity: 0.8 }, inner);
  const lid = el(
    "path",
    { d: "M " + -r + " 0 Q 0 " + r * 0.55 + " " + r + " 0", stroke: ink, "stroke-width": 5, fill: "none", "stroke-linecap": "round", opacity: 0 },
    g,
  );
  const upd = (s: RigState): void => {
    const closed = s.blink;
    const px = s.lx * r * 0.4;
    const py = s.ly * r * 0.4;
    const pr = (opts.pupilR != null ? opts.pupilR : r * 0.5) * s.pupil;
    tf(inner, "scale(1 " + Math.max(0.05, 1 - closed).toFixed(3) + ")");
    /* полностью закрытый глаз: сплющенный белок выглядит белой полоской-огрызком
       рядом с дугой века — на sleep прячем его целиком, остаётся чистая дуга */
    inner.setAttribute("opacity", closed > 0.96 ? "0" : "1");
    pupil.setAttribute("cx", String(px));
    pupil.setAttribute("cy", String(py));
    pupil.setAttribute("r", String(pr));
    hl1.setAttribute("cx", String(px + pr * 0.36));
    hl1.setAttribute("cy", String(py - pr * 0.4));
    hl1.setAttribute("r", String(pr * 0.3));
    hl2.setAttribute("cx", String(px - pr * 0.3));
    hl2.setAttribute("cy", String(py + pr * 0.35));
    hl2.setAttribute("r", String(pr * 0.14));
    lid.setAttribute("opacity", String(clamp((closed - 0.8) / 0.2, 0, 1)));
  };
  return { upd };
}

export function Brow(
  parent: SVGElement,
  x: number,
  y: number,
  side: number,
  color: string,
  w = 28,
): { upd(s: RigState): void } {
  const g = el("g", null, parent);
  el("line", { x1: -w / 2, x2: w / 2, y1: 0, y2: 0, stroke: color, "stroke-width": 6, "stroke-linecap": "round" }, g);
  const upd = (s: RigState): void => {
    const vis = clamp(Math.abs(s.tilt) * 2 + Math.abs(s.browUp) * 1.4, 0, 1);
    tf(g, "translate(" + x + " " + (y - s.browUp * 9) + ") rotate(" + (side * s.tilt * 22).toFixed(2) + ")");
    g.setAttribute("opacity", String(vis));
  };
  return { upd };
}

export function Cheek(
  parent: SVGElement,
  cx: number,
  cy: number,
  color = "#ff7fa0",
): { upd(s: RigState): void } {
  const c = el("ellipse", { cx, cy, rx: 13, ry: 8, fill: color, opacity: 0 }, parent);
  const upd = (s: RigState): void => {
    c.setAttribute("opacity", String(s.cheek * 0.55));
  };
  return { upd };
}

export type MouthOpts = { ink?: string; tongue?: string };

export function Mouth(
  parent: SVGElement,
  cx: number,
  cy: number,
  w: number,
  opts: MouthOpts = {},
): { upd(s: RigState): void } {
  const ink = opts.ink || "#3c3c3c";
  const tongue = opts.tongue || "#ff6b8a";
  const id = "mc" + ++uid;
  const g = el("g", { transform: "translate(" + cx + " " + cy + ")" }, parent);
  const defs = el("defs", null, g);
  const clip = el("clipPath", { id }, defs);
  const clipPath = el("path", null, clip);
  const path = el("path", { fill: ink, stroke: ink, "stroke-width": 5, "stroke-linejoin": "round" }, g);
  const tg = el("g", { "clip-path": "url(#" + id + ")", opacity: 0 }, g);
  const tEl = el("ellipse", { ry: 9, fill: tongue }, tg);
  const upd = (s: RigState): void => {
    const sm = s.smile;
    const o = clamp(s.mouth, 0, 1.1);
    const ww = w * (1 - o * 0.35 * (1 - clamp(sm, 0, 1)));
    const top = sm * 12;
    const bot = top + o * (34 + (1 - clamp(sm, 0, 1)) * 20);
    const d = "M " + -ww + " 0 Q 0 " + top.toFixed(2) + " " + ww + " 0 Q 0 " + bot.toFixed(2) + " " + -ww + " 0 Z";
    path.setAttribute("d", d);
    clipPath.setAttribute("d", d);
    tg.setAttribute("opacity", String(clamp((o - 0.35) * 3, 0, 1)));
    tEl.setAttribute("cx", "0");
    tEl.setAttribute("cy", String(bot / 2 + 2));
    tEl.setAttribute("rx", String(ww * 0.55));
  };
  return { upd };
}

export function Fx(fxg: SVGElement): { upd(s: RigState): void } {
  const zzz: SVGTextElement[] = [];
  const spark: SVGPathElement[] = [];
  const think: SVGCircleElement[] = [];
  const zcol = "#8ea0b0";
  const spcol = ["#ffc800", "#1cb0f6", "#ff4b4b", "#58cc02", "#ce82ff"];
  for (let i = 0; i < 3; i++) zzz.push(el("text", { "font-size": 16, "font-weight": 900, fill: zcol, opacity: 0 }, fxg) as SVGTextElement);
  for (let i = 0; i < 5; i++) spark.push(el("path", { fill: spcol[i], opacity: 0 }, fxg) as SVGPathElement);
  for (let i = 0; i < 3; i++) think.push(el("circle", { fill: "#b8c2cc", opacity: 0 }, fxg) as SVGCircleElement);
  const upd = (s: RigState): void => {
    const t = s.t;
    if (s.zzz > 0.05) {
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.35 + i / 3) % 1;
        const x = 212 + ph * 34;
        const y = 92 - ph * 56;
        const e = zzz[i];
        e.setAttribute("x", String(x));
        e.setAttribute("y", String(y));
        e.setAttribute("font-size", String(16 + ph * 14));
        e.setAttribute("opacity", String(Math.sin(ph * Math.PI) * s.zzz));
        tf(e, "rotate(" + (-8 + ph * 16).toFixed(1) + " " + x.toFixed(1) + " " + y.toFixed(1) + ")");
        e.textContent = "Z";
      }
    } else for (const e of zzz) e.setAttribute("opacity", "0");
    if (s.spark > 0.05) {
      for (let i = 0; i < 5; i++) {
        const ph = (t * 0.9 + i * 0.2) % 1;
        const ang = (i / 5) * Math.PI * 2 + 0.4;
        const rr = 120 + ph * 28;
        const sx = 150 + Math.cos(ang) * rr;
        const sy = 150 + Math.sin(ang) * rr * 0.8;
        const sz = 7 + (i % 2) * 4;
        const e = spark[i];
        if (!e.getAttribute("d")) {
          e.setAttribute("d", "M0 " + -sz + " L" + sz * 0.3 + " " + -sz * 0.3 + " L" + sz + " 0 L" + sz * 0.3 + " " + sz * 0.3 + " L0 " + sz + " L" + -sz * 0.3 + " " + sz * 0.3 + " L" + -sz + " 0 L" + -sz * 0.3 + " " + -sz * 0.3 + " Z");
        }
        tf(e, "translate(" + sx.toFixed(1) + " " + sy.toFixed(1) + ") rotate(" + (ph * 90).toFixed(1) + ") scale(" + Math.sin(ph * Math.PI).toFixed(3) + ")");
        e.setAttribute("opacity", String(s.spark));
      }
    } else for (const e of spark) e.setAttribute("opacity", "0");
    if (s.think > 0.05) {
      for (let i = 0; i < 3; i++) {
        const pulse = 0.55 + 0.45 * Math.max(0, Math.sin(t * 3 - i * 0.9));
        const e = think[i];
        e.setAttribute("cx", String(216 + i * 18));
        e.setAttribute("cy", String(70 - i * 10));
        e.setAttribute("r", ((4 + i * 2.2) * pulse).toFixed(2));
        e.setAttribute("opacity", String(s.think));
      }
    } else for (const e of think) e.setAttribute("opacity", "0");
  };
  return { upd };
}

export function face(s: RigState): string {
  return "translate(" + (s.lx * 8).toFixed(2) + " " + (s.ly * 5).toFixed(2) + ")";
}

export function updFace(g: SVGElement, s: RigState): void {
  tf(g, face(s));
}

let uid = 0;

/* ============================ ЗВЕРИ ====================================== */

export type MascotChar = "pip" | "hoot" | "mochi" | "bolt" | "gloop";

type CharUpdater = (s: RigState) => void;
type CharBuilder = (g: SVGElement) => CharUpdater;

export type CharacterDef = {
  id: MascotChar;
  name: string;
  tag: string;
  color: string;
  build: CharBuilder;
  sw: number;
};

const PIP_BODY = "M150 74 C86 74 52 124 52 184 C52 238 92 268 150 268 C208 268 248 238 248 184 C248 124 214 74 150 74 Z";
const HOOT_BODY = "M150 62 C80 62 50 116 50 180 C50 238 92 268 150 268 C208 268 250 238 250 180 C250 116 220 62 150 62 Z";
const MOCHI_BODY = "M150 92 C82 92 48 136 48 188 C48 238 90 268 150 268 C210 268 252 238 252 188 C252 136 218 92 150 92 Z";
const BOLT_BODY = "M116 72 H184 A56 56 0 0 1 240 128 V212 A56 56 0 0 1 184 268 H116 A56 56 0 0 1 60 212 V128 A56 56 0 0 1 116 72 Z";

const CharPip: CharBuilder = (g) => {
  const upds: { upd(s: RigState): void }[] = [];
  const armL = el("g", { transform: "translate(66 176)" }, g);
  el("ellipse", { cx: -6, cy: 28, rx: 15, ry: 32, fill: "#46a302" }, armL);
  const armR = el("g", { transform: "translate(234 176)" }, g);
  el("ellipse", { cx: 6, cy: 28, rx: 15, ry: 32, fill: "#46a302" }, armR);
  el("ellipse", { cx: 116, cy: 266, rx: 24, ry: 9, fill: "#e0a800" }, g);
  el("ellipse", { cx: 184, cy: 266, rx: 24, ry: 9, fill: "#e0a800" }, g);
  const leaf = el("g", { transform: "translate(150 78)" }, g);
  el("path", { d: "M0 0 C-4 -18 -2 -32 -20 -42 C-34 -26 -22 -6 0 0Z", fill: "#7ee03a" }, leaf);
  el("path", { d: "M0 0 C4 -22 10 -34 30 -38 C34 -18 20 -4 0 0Z", fill: "#58cc02" }, leaf);
  Body(g, PIP_BODY, "#58cc02", "#46a302");
  el("ellipse", { cx: 150, cy: 210, rx: 62, ry: 46, fill: "#b4f27c", opacity: 0.85 }, g);
  const f = el("g", null, g);
  upds.push(Cheek(f, 92, 170), Cheek(f, 208, 170));
  upds.push(Eye(f, 116, 138, 25), Eye(f, 184, 138, 25));
  upds.push(Brow(f, 116, 102, -1, "#2f6b00"), Brow(f, 184, 102, 1, "#2f6b00"));
  upds.push(Mouth(f, 150, 178, 19));
  return (s) => {
    tf(armL, "translate(66 176) rotate(" + s.armL.toFixed(1) + ")");
    tf(armR, "translate(234 176) rotate(" + (-s.armR).toFixed(1) + ")");
    tf(leaf, "translate(150 78) rotate(" + (s.sway * 1.6 + Math.sin(s.t * 2) * 3).toFixed(1) + ")");
    updFace(f, s);
    for (const u of upds) u.upd(s);
  };
};

const CharHoot: CharBuilder = (g) => {
  const upds: { upd(s: RigState): void }[] = [];
  const wingL = el("g", { transform: "translate(58 172)" }, g);
  el("path", { d: "M0 0 C-26 10 -32 52 -8 74 C6 82 18 62 16 38 C14 14 8 4 0 0Z", fill: "#1899d6" }, wingL);
  const wingR = el("g", { transform: "translate(242 172)" }, g);
  el("path", { d: "M0 0 C26 10 32 52 8 74 C-6 82 -18 62 -16 38 C-14 14 -8 4 0 0Z", fill: "#1899d6" }, wingR);
  el("ellipse", { cx: 120, cy: 268, rx: 20, ry: 8, fill: "#e0a800" }, g);
  el("ellipse", { cx: 180, cy: 268, rx: 20, ry: 8, fill: "#e0a800" }, g);
  const earL = el("g", null, g);
  el("path", { d: "M78 92 L68 36 L124 70Z", fill: "#1899d6" }, earL);
  el("path", { d: "M82 86 L76 52 L112 72Z", fill: "#1cb0f6" }, earL);
  const earR = el("g", null, g);
  el("path", { d: "M222 92 L232 36 L176 70Z", fill: "#1899d6" }, earR);
  el("path", { d: "M218 86 L224 52 L188 72Z", fill: "#1cb0f6" }, earR);
  Body(g, HOOT_BODY, "#1cb0f6", "#1899d6");
  const belly = el("g", { transform: "translate(0 -8)", fill: "none", stroke: "#9fdcfa", "stroke-width": 5, "stroke-linecap": "round" }, g);
  el("ellipse", { cx: 150, cy: 212, rx: 58, ry: 44, fill: "#d8f2fd", stroke: "none" }, belly);
  el("path", { d: "M118 200 q10 10 20 0 M142 200 q10 10 20 0 M166 200 q10 10 20 0" }, belly);
  el("path", { d: "M130 226 q10 10 20 0 M150 226 q10 10 20 0" }, belly);
  const f = el("g", null, g);
  el("circle", { cx: 108, cy: 134, r: 40, fill: "#e8f8ff" }, f);
  el("circle", { cx: 192, cy: 134, r: 40, fill: "#e8f8ff" }, f);
  upds.push(Cheek(f, 80, 180), Cheek(f, 220, 180));
  upds.push(Eye(f, 108, 134, 26), Eye(f, 192, 134, 26));
  upds.push(Brow(f, 106, 84, -1, "#0f6e9b", 32), Brow(f, 194, 84, 1, "#0f6e9b", 32));
  const jaw = el("g", null, f);
  el("path", { d: "M138 178 L162 178 L150 194Z", fill: "#e0a800" }, jaw);
  el("path", { d: "M136 164 L164 164 L150 190Z", fill: "#ffc800" }, f);
  el("path", { d: "M136 164 L164 164 L160 172 L140 172Z", fill: "#ffd84d" }, f);
  return (s) => {
    tf(wingL, "translate(58 172) rotate(" + s.armL.toFixed(1) + ")");
    tf(wingR, "translate(242 172) rotate(" + (-s.armR).toFixed(1) + ")");
    const ear = s.sway * 1.2;
    tf(earL, "rotate(" + (-ear).toFixed(1) + " 96 76)");
    tf(earR, "rotate(" + ear.toFixed(1) + " 204 76)");
    tf(jaw, "translate(0 " + (s.mouth * 10 + Math.max(0, s.smile) * 1.5).toFixed(2) + ")");
    updFace(f, s);
    for (const u of upds) u.upd(s);
  };
};

const CharMochi: CharBuilder = (g) => {
  const upds: { upd(s: RigState): void }[] = [];
  const tail = el("g", { transform: "translate(224 244)" }, g);
  el("path", { d: "M0 0 C46 -4 66 -40 50 -84", stroke: "#e08600", "stroke-width": 20, "stroke-linecap": "round", fill: "none" }, tail);
  el("circle", { cx: 50, cy: -84, r: 10, fill: "#fff3e0" }, tail);
  const armL = el("g", { transform: "translate(70 204)" }, g);
  el("ellipse", { cx: -4, cy: 24, rx: 14, ry: 28, fill: "#e08600" }, armL);
  const armR = el("g", { transform: "translate(230 204)" }, g);
  el("ellipse", { cx: 4, cy: 24, rx: 14, ry: 28, fill: "#e08600" }, armR);
  const earL = el("g", null, g);
  el("path", { d: "M60 130 L56 52 L122 98Z", fill: "#e08600" }, earL);
  el("path", { d: "M70 120 L68 70 L108 100Z", fill: "#ffb3c1" }, earL);
  const earR = el("g", null, g);
  el("path", { d: "M240 130 L244 52 L178 98Z", fill: "#e08600" }, earR);
  el("path", { d: "M230 120 L232 70 L192 100Z", fill: "#ffb3c1" }, earR);
  el("ellipse", { cx: 116, cy: 267, rx: 24, ry: 9, fill: "#fff3e0" }, g);
  el("ellipse", { cx: 184, cy: 267, rx: 24, ry: 9, fill: "#fff3e0" }, g);
  Body(g, MOCHI_BODY, "#ff9600", "#e08600");
  el("ellipse", { cx: 150, cy: 214, rx: 56, ry: 38, fill: "#fff3e0", opacity: 0.95 }, g);
  const f = el("g", null, g);
  const stripes = el("g", { stroke: "#e08600", "stroke-width": 6, "stroke-linecap": "round" }, f);
  el("line", { x1: 150, y1: 102, x2: 150, y2: 122 }, stripes);
  el("line", { x1: 130, y1: 106, x2: 134, y2: 122 }, stripes);
  el("line", { x1: 170, y1: 106, x2: 166, y2: 122 }, stripes);
  upds.push(Cheek(f, 84, 186, "#ff6f91"), Cheek(f, 216, 186, "#ff6f91"));
  upds.push(Eye(f, 112, 158, 19), Eye(f, 188, 158, 19));
  upds.push(Brow(f, 112, 126, -1, "#8a4a00", 26), Brow(f, 188, 126, 1, "#8a4a00", 26));
  const whg = el("g", { stroke: "#8a4a00", "stroke-width": 3, "stroke-linecap": "round", opacity: 0.55 }, f);
  const wh = [
    el("line", { x1: 92, y1: 190, x2: 54, y2: 182 }, whg),
    el("line", { x1: 92, y1: 198, x2: 56, y2: 204 }, whg),
    el("line", { x1: 208, y1: 190, x2: 246, y2: 182 }, whg),
    el("line", { x1: 208, y1: 198, x2: 244, y2: 204 }, whg),
  ];
  el("path", { d: "M141 186 L159 186 L150 196Z", fill: "#ff6b8a", "stroke-linejoin": "round", stroke: "#ff6b8a", "stroke-width": 3 }, f);
  upds.push(Mouth(f, 150, 204, 14));
  return (s) => {
    tf(tail, "translate(224 244) rotate(" + (Math.sin(s.t * (s.smile > 0.7 ? 5 : 2.2)) * 12 + s.sway * 1.5).toFixed(1) + ")");
    tf(armL, "translate(70 204) rotate(" + s.armL.toFixed(1) + ")");
    tf(armR, "translate(230 204) rotate(" + (-s.armR).toFixed(1) + ")");
    const ear = s.sway * 1.4;
    tf(earL, "rotate(" + (-ear - 2).toFixed(1) + " 92 104)");
    tf(earR, "rotate(" + (ear + 2).toFixed(1) + " 208 104)");
    const w = s.lx * 3;
    wh[0].setAttribute("y2", String(182 + w));
    wh[1].setAttribute("y2", String(204 - w));
    wh[2].setAttribute("y2", String(182 - w));
    wh[3].setAttribute("y2", String(204 + w));
    updFace(f, s);
    for (const u of upds) u.upd(s);
  };
};

const CharBolt: CharBuilder = (g) => {
  const upds: { upd(s: RigState): void }[] = [];
  const armL = el("g", { transform: "translate(58 206)" }, g);
  el("rect", { x: -7, y: 0, width: 14, height: 40, rx: 7, fill: "#a568cc" }, armL);
  el("circle", { cx: 0, cy: 46, r: 13, fill: "#ce82ff", stroke: "#a568cc", "stroke-width": 4 }, armL);
  const armR = el("g", { transform: "translate(242 206)" }, g);
  el("rect", { x: -7, y: 0, width: 14, height: 40, rx: 7, fill: "#a568cc" }, armR);
  el("circle", { cx: 0, cy: 46, r: 13, fill: "#ce82ff", stroke: "#a568cc", "stroke-width": 4 }, armR);
  el("rect", { x: 100, y: 260, width: 40, height: 13, rx: 6, fill: "#7b8794" }, g);
  el("rect", { x: 160, y: 260, width: 40, height: 13, rx: 6, fill: "#7b8794" }, g);
  const ant = el("g", null, g);
  el("line", { x1: 150, y1: 76, x2: 150, y2: 42, stroke: "#7b8794", "stroke-width": 6, "stroke-linecap": "round" }, ant);
  const glow = el("circle", { cx: 150, cy: 34, r: 15, opacity: 0 }, ant);
  const bulb = el("circle", { cx: 150, cy: 34, r: 9 }, ant);
  el("circle", { cx: 147, cy: 31, r: 3, fill: "#fff", opacity: 0.7 }, ant);
  el("rect", { x: 44, y: 146, width: 20, height: 44, rx: 8, fill: "#a568cc" }, g);
  el("rect", { x: 236, y: 146, width: 20, height: 44, rx: 8, fill: "#a568cc" }, g);
  Body(g, BOLT_BODY, "#ce82ff", "#a568cc");
  const panel = el("g", { transform: "translate(0 -8)" }, g);
  const leds = [0, 1, 2].map((i) => el("circle", { cx: 120 + i * 30, cy: 238, r: 7, fill: ["#58cc02", "#ffc800", "#1cb0f6"][i] }, panel));
  const screen = el("g", { transform: "translate(0 -8)" }, g);
  el("rect", { x: 80, y: 100, width: 140, height: 108, rx: 38, fill: "#2b2b3a" }, screen);
  el("rect", { x: 80, y: 100, width: 140, height: 108, rx: 38, fill: "none", stroke: "#1c1c28", "stroke-width": 4 }, screen);
  const f = el("g", null, g);
  const chL = el("ellipse", { cx: 100, cy: 178, rx: 12, ry: 7, fill: "#ff7aa8", opacity: 0 }, f);
  const chR = el("ellipse", { cx: 200, cy: 178, rx: 12, ry: 7, fill: "#ff7aa8", opacity: 0 }, f);
  upds.push(Eye(f, 120, 150, 18, { sclera: "#9af7ff", ink: "#0b2f3a" }));
  upds.push(Eye(f, 180, 150, 18, { sclera: "#9af7ff", ink: "#0b2f3a" }));
  upds.push(Brow(f, 120, 118, -1, "#9af7ff", 26), Brow(f, 180, 118, 1, "#9af7ff", 26));
  upds.push(Mouth(f, 150, 184, 17, { ink: "#9af7ff", tongue: "#ff7aa8" }));
  return (s) => {
    tf(armL, "translate(58 206) rotate(" + s.armL.toFixed(1) + ")");
    tf(armR, "translate(242 206) rotate(" + (-s.armR).toFixed(1) + ")");
    tf(ant, "rotate(" + (s.sway * 1.8).toFixed(1) + " 150 74)");
    const moodColor = s.smile > 0.6 ? "#58cc02" : s.smile < -0.4 || s.tilt < -0.5 ? "#ff4b4b" : "#ffc800";
    const gl = 0.55 + 0.45 * Math.sin(s.t * 5);
    bulb.setAttribute("fill", moodColor);
    glow.setAttribute("fill", moodColor);
    glow.setAttribute("opacity", String(0.25 * gl));
    for (let i = 0; i < 3; i++) leds[i].setAttribute("opacity", String(0.6 + 0.4 * Math.sin(s.t * 3 + i * 1.6)));
    chL.setAttribute("opacity", String(s.cheek * 0.5));
    chR.setAttribute("opacity", String(s.cheek * 0.5));
    tf(f, "translate(0 -8) " + face(s));
    for (const u of upds) u.upd(s);
  };
};

const CharGloop: CharBuilder = (g) => {
  const upds: { upd(s: RigState): void }[] = [];
  const armL = el("g", { transform: "translate(54 216)" }, g);
  el("ellipse", { cx: -8, cy: 20, rx: 14, ry: 24, fill: "#e0628f" }, armL);
  const armR = el("g", { transform: "translate(246 216)" }, g);
  el("ellipse", { cx: 8, cy: 20, rx: 14, ry: 24, fill: "#e0628f" }, armR);
  const bodyLight = el("g", { transform: "translate(0 -8)" }, g);
  const bodyDark = el("path", { fill: "#e0628f" }, g);
  const bodyBase = el("path", { fill: "#ff86b4" }, bodyLight);
  const bubbles = el("g", { fill: "#fff", opacity: 0.28 }, g);
  const bub = [0, 1, 2].map(() => el("circle", { r: 6 }, bubbles));
  el("ellipse", { cx: 96, cy: 118, rx: 18, ry: 9, fill: "#fff", opacity: 0.55, transform: "rotate(-38 96 118)" }, g);
  el("circle", { cx: 122, cy: 96, r: 4.5, fill: "#fff", opacity: 0.55 }, g);
  const f = el("g", null, g);
  upds.push(Cheek(f, 88, 196, "#ff4b7d"), Cheek(f, 212, 196, "#ff4b7d"));
  upds.push(Eye(f, 114, 160, 21), Eye(f, 186, 160, 21));
  upds.push(Brow(f, 114, 126, -1, "#8a2a52"), Brow(f, 186, 126, 1, "#8a2a52"));
  upds.push(Mouth(f, 150, 202, 18));
  return (s) => {
    tf(armL, "translate(54 216) rotate(" + s.armL.toFixed(1) + ")");
    tf(armR, "translate(246 216) rotate(" + (-s.armR).toFixed(1) + ")");
    const tx = s.sway * 2 + s.lx * 8;
    const bw = Math.sin(s.t * 3) * 3 + s.sway * 0.8;
    const d = "M70 268 C40 268 38 " + (232 + bw) + " 46 " + (196 - bw) + " C52 150 " + (96 + tx * 0.4).toFixed(1) + " 76 " + (150 + tx).toFixed(1) + " 76 C" + (204 + tx * 0.4).toFixed(1) + " 76 248 150 254 " + (196 + bw) + " C262 " + (232 - bw) + " 260 268 230 268 Z";
    bodyDark.setAttribute("d", d);
    bodyBase.setAttribute("d", d);
    for (let i = 0; i < 3; i++) {
      const ph = (s.t * 0.25 + i / 3) % 1;
      bub[i].setAttribute("cx", String(96 + i * 54 + Math.sin(s.t + i) * 4));
      bub[i].setAttribute("cy", String(252 - ph * 120));
      bub[i].setAttribute("r", String(6 + i * 2));
      bub[i].setAttribute("opacity", String(Math.sin(ph * Math.PI)));
    }
    updFace(f, s);
    for (const u of upds) u.upd(s);
  };
};

export const CHARACTERS: CharacterDef[] = [
  { id: "pip", name: "Pip", tag: "птенец", color: "#58cc02", build: CharPip, sw: 84 },
  { id: "hoot", name: "Hoot", tag: "сова", color: "#1cb0f6", build: CharHoot, sw: 84 },
  { id: "mochi", name: "Mochi", tag: "котик", color: "#ff9600", build: CharMochi, sw: 84 },
  { id: "bolt", name: "Bolt", tag: "робот", color: "#ce82ff", build: CharBolt, sw: 78 },
  { id: "gloop", name: "Gloop", tag: "слайм", color: "#ff86b4", build: CharGloop, sw: 96 },
];

export function characterOf(id: MascotChar): CharacterDef {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[1];
}

export function mount(svg: SVGElement, ch: CharacterDef): CharUpdater {
  const fr = Frame(svg, ch.sw);
  const charUpd = ch.build(fr.g);
  const fx = Fx(fr.fx);
  return (s: RigState): void => {
    fr.upd(s);
    charUpd(s);
    fx.upd(s);
  };
}

/** Статичные позы для миниатюр: один вызов upd, без движка и rAF.
    happy — выбранный зверёк в пикере, calm — остальные. */
export const THUMB_POSES = {
  happy: {
    lx: 0, ly: 0.1, blink: 0, smile: 1, mouth: 0.45, tilt: 0, browUp: 0.5,
    armL: 30, armR: 30, sx: 1, sy: 1, y: 0, rot: 0, sway: 2, cheek: 0.85,
    pupil: 1.1, zzz: 0, spark: 0, think: 0, t: 1.4,
  } as RigState,
  calm: {
    lx: 0, ly: 0, blink: 0, smile: 0.35, mouth: 0, tilt: 0, browUp: 0,
    armL: 8, armR: 8, sx: 1, sy: 1, y: 0, rot: 0, sway: 0, cheek: 0.25,
    pupil: 1, zzz: 0, spark: 0, think: 0, t: 0.8,
  } as RigState,
};
