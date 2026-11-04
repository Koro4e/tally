import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/utils/cn";
import type { Mv, Snap } from "@/lib/motivation";
import { startLife, type Aim, type LifeHandle } from "@/lib/life";
import { boing, chirp, doze as dozeSfx, grunt, purr, sigh } from "@/lib/sfx";

/* ============================================================================
   ЗВЕРЁК
   ----------------------------------------------------------------------------
   Настроение — не отдельная механика, а отражение того, что уже посчитано
   для серии и цели дня. Собственного таймера «смерти» нет: за 68 дней один
   пропущенный день — норма.

   ЖИВОСТЬ. Раньше здесь был один `@keyframes petbreathe` — синус 3.6 с,
   вечный и одинаковый, плюс редкие дискретные действия. Это читается как
   метроном: у живого тела нет одного ритма. Теперь непрерывное движение
   считает `lib/life.ts` — четыре несоизмеримых периода (3.2 / 4.7 / 7.3 /
   11.1 с), пружина внимания и сдвиг взгляда. Дискретные действия остались
   сверху и складываются с этим.

   Слои DOM (у каждого свой transform, иначе затирают друг друга):
     .pet-act   — дискретное действие, CSS-анимация
     .pet-look  — внимание (пружина к курсору)
     .pet-sway  — дыхание, покачивание, боб, дрожь
     .pet-body  — картинка, веки, частицы
   ========================================================================== */

export type Mood = "satt" | "ok" | "hungrig" | "traurig";

const SRC: Record<Mood, string> = {
  satt: "/pet/1-satt.webp",
  ok: "/pet/2-ok.webp",
  hungrig: "/pet/3-hungrig.webp",
  traurig: "/pet/4-traurig.webp",
};

/** Кадры с закрытыми глазами больше не нужны: четыре настроения — это один
    и тот же рендер с разным изгибом нитки рта, поэтому веки рисуются поверх
    картинки в CSS и совпадают с глазами до пикселя. */
const LID = "#c3dfc7";
const LID_EDGE = "#a3c3a9";

/** Где глаза в каждом кадре: доли ширины/высоты картинки и радиус.
    Числа не подобраны на глаз — это проекция центров бусин через камеру
    V36Cam (800×800), пересчитанная в кроп 626×800 и масштаб 320 px
    (`blender-out/work/make_moods.py` пишет их в `moods/eyes.json`). */
type Eye = { x: number; y: number; r: number; c: string };
const EYES: Partial<Record<Mood, { l: Eye; r: Eye }>> = {
  satt: {
    l: { x: 0.358, y: 0.3161, r: 0.0603, c: LID },
    r: { x: 0.6401, y: 0.3139, r: 0.0604, c: LID },
  },
  ok: {
    l: { x: 0.358, y: 0.3171, r: 0.0592, c: LID },
    r: { x: 0.6401, y: 0.3149, r: 0.0592, c: LID },
  },
  hungrig: {
    l: { x: 0.358, y: 0.3221, r: 0.0651, c: LID },
    r: { x: 0.6401, y: 0.3199, r: 0.0652, c: LID },
  },
  traurig: {
    l: { x: 0.358, y: 0.3251, r: 0.0627, c: LID },
    r: { x: 0.6401, y: 0.3229, r: 0.0628, c: LID },
  },
};

/* Собственные действия. `w` — вес в выборе, `ms` — длительность, `pt` —
   какие частицы вылетают, `sfx` — звук (играет не всегда, см. ниже: если
   питомец будет пищать каждый такт, его выключат через минуту). */
type ActDef = {
  k: string;
  ms: number;
  w: number;
  pt?: "zzz" | "sweat" | "bang" | "spark";
  sfx?: () => void;
};

const ACTS: ActDef[] = [
  { k: "tilt-l", ms: 900, w: 3 },
  { k: "tilt-r", ms: 900, w: 3 },
  { k: "hop", ms: 620, w: 2, sfx: boing },
  { k: "stretch", ms: 900, w: 2 },
  { k: "pace-l", ms: 1300, w: 2 },
  { k: "pace-r", ms: 1300, w: 2 },
  { k: "glance-l", ms: 1000, w: 3 },
  { k: "glance-r", ms: 1000, w: 3 },
  { k: "yawn", ms: 1400, w: 2, sfx: () => Math.random() < 0.5 && sigh() },
  { k: "scratch", ms: 900, w: 2 },
  { k: "sneeze", ms: 750, w: 1, pt: "sweat" },
  { k: "nod", ms: 700, w: 2 },
  { k: "doze", ms: 2800, w: 1, pt: "zzz", sfx: dozeSfx },
  { k: "roll", ms: 900, w: 1, pt: "spark" },
  { k: "dance", ms: 1500, w: 1, pt: "spark" },
];

function pick(not?: string): ActDef {
  const total = ACTS.reduce((a, b) => a + b.w, 0);
  for (let tries = 0; tries < 4; tries++) {
    let r = Math.random() * total;
    for (const a of ACTS) {
      r -= a.w;
      if (r <= 0) {
        if (a.k === not) break; // не повторяем подряд — иначе выглядит зацикленным
        return a;
      }
    }
  }
  return ACTS[0];
}

export function moodOf(s: Snap, mv: Mv): Mood {
  if (s.goalHit) return "satt";
  if (s.todayXp > 0) return "ok";
  if (s.streak > 0) return "hungrig";
  return mv.days.length > 0 ? "traurig" : "hungrig";
}

export function moodOfSnap(s: Snap): Mood {
  if (s.goalHit) return "satt";
  if (s.todayXp > 0) return "ok";
  return s.streak > 0 ? "hungrig" : "traurig";
}

export function petLine(m: Mood, s: Snap): string {
  switch (m) {
    case "satt":
      return "Satt. Genau so soll ein Tag aussehen.";
    case "ok":
      return `Noch ${Math.max(0, s.goal - s.todayXp)} XP, dann bin ich satt.`;
    case "hungrig":
      return "Ich habe Hunger. Eine Runde reicht.";
    case "traurig":
      return "Ich habe gewartet. Fangen wir wieder an?";
  }
}

/* ----------------------------------------------------------------- частицы --- */

type Burst = { id: number; kind: "heart" | "spark" | "zzz" | "sweat" | "bang"; n: number };

const GLYPH: Record<Burst["kind"], string> = {
  heart: "♥",
  spark: "✦",
  zzz: "z",
  sweat: "•",
  bang: "!",
};

function Particles({ burst }: { burst: Burst }) {
  /* Позиции и разлёт считаются один раз на всплеск: если пересчитывать на
     каждом рендере, частицы дёргались бы при любом обновлении состояния. */
  const items = useRef<{ x: number; y: number; dx: number; dy: number; r: number; dur: number; delay: number }[]>([]);
  const seen = useRef(0);
  if (seen.current !== burst.id) {
    seen.current = burst.id;
    items.current = Array.from({ length: burst.n }, () => ({
      x: 30 + Math.random() * 40,
      y: 16 + Math.random() * 26,
      dx: (Math.random() * 2 - 1) * 16,
      dy: -(16 + Math.random() * 18),
      r: (Math.random() * 2 - 1) * 26,
      dur: 0.9 + Math.random() * 0.5,
      delay: Math.random() * 180,
    }));
  }

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {items.current.map((p, i) => (
        <span
          key={`${burst.id}-${i}`}
          className={cn("pt", `pt-${burst.kind}`)}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            ["--pdx" as string]: `${p.dx.toFixed(1)}px`,
            ["--pdy" as string]: `${p.dy.toFixed(1)}px`,
            ["--pr" as string]: `${p.r.toFixed(0)}deg`,
            ["--pdur" as string]: `${p.dur.toFixed(2)}s`,
            animationDelay: `${p.delay.toFixed(0)}ms`,
            fontSize: burst.kind === "zzz" ? "9px" : undefined,
          }}
        >
          {GLYPH[burst.kind]}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------- зверёк --- */

export default function Pet({
  mood,
  className,
  celebrate,
  quiet,
}: {
  mood: Mood;
  className?: string;
  /** итог раунда: зверёк только что появился, его покормили — сердечки и «прур» */
  celebrate?: boolean;
  /** в комнате движениями управляет Zimmer — свои действия там только мешают */
  quiet?: boolean;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const life = useRef<LifeHandle | null>(null);

  const [blink, setBlink] = useState(false);
  const [act, setAct] = useState<{ k: string; amp: number; dur: number } | null>(null);
  const [burst, setBurst] = useState<Burst | null>(null);
  const prev = useRef<Mood | null>(null);
  const lastAct = useRef<string>("");
  /** общий счётчик всплесков частиц: он же ключ перезапуска анимации */
  const pid = useRef(0);
  /** тычки по зверьку: 3-й — ворчание, 5-й — «хватит» */
  const pokes = useRef({ n: 0, until: 0 });
  const pokeClear = useRef(0);

  /* --- внимание ------------------------------------------------------------
     Цель пружины в life.ts. Приоритет: форсированный взгляд (действие
     «glance-*») → курсор, если он двигался последние 2.6 с → «точка
     интереса», которая сама меняется раз в 6–14 с. Без третьего пункта
     зверёк, оставленный без мыши, смотрел бы строго в центр и снова
     превращался в картинку. */
  const aim = useRef({ x: 0, y: 0 });
  const pointerAt = useRef(0);
  const idle = useRef({ x: 0, y: 0 });
  const idleUntil = useRef(0);
  const forced = useRef<{ x: number; y: number; until: number } | null>(null);

  const getAim = useCallback((): Aim => {
    const now = Date.now();
    const f = forced.current;
    if (f && now < f.until) return { x: f.x, y: f.y };
    if (now - pointerAt.current < 2600) return aim.current;
    if (now > idleUntil.current) {
      idle.current = { x: (Math.random() * 2 - 1) * 2.3, y: (Math.random() * 2 - 1) * 1.1 };
      idleUntil.current = now + 6000 + Math.random() * 8000;
    }
    return idle.current;
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const h = startLife(el, getAim);
    life.current = h;
    return () => {
      h.stop();
      life.current = null;
    };
  }, [getAim]);

  /* Дремота гасит амплитуду вдвое — тело должно замедляться, а не замирать. */
  useEffect(() => {
    life.current?.setCalm(act?.k === "doze");
  }, [act]);

  /* Кадры маленькие, но появляются по одному: без предзагрузки смена
     настроения на долю секунды показывала бы пустое место. */
  useEffect(() => {
    for (const u of Object.values(SRC)) {
      if (!u) continue;
      const img = new Image();
      img.src = u;
    }
  }, []);

  /* Моргание: пауза 2.8–6.6 с, иногда двойное. Веки есть у всех четырёх
     настроений — кадров с закрытыми глазами больше нет. */
  const eyes = EYES[mood];

  useEffect(() => {
    if (!eyes) return;
    let t = 0;
    let alive = true;
    const loop = () => {
      t = window.setTimeout(() => {
        if (!alive) return;
        setBlink(true);
        window.setTimeout(() => alive && setBlink(false), 170);
        if (Math.random() < 0.22) {
          window.setTimeout(() => {
            if (!alive) return;
            setBlink(true);
            window.setTimeout(() => alive && setBlink(false), 110);
          }, 260);
        }
        loop();
      }, 2800 + Math.random() * 3800);
    };
    loop();
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [eyes]);

  /* Собственная жизнь. Работает всегда, независимо от мышки: именно это
     отличает существо от картинки, которая реагирует на наведение.
     Амплитуда и длительность рандомизируются: два подскока подряд не
     должны быть близнецами. */
  useEffect(() => {
    if (quiet) return;
    let alive = true;
    let t = 0;
    let clear = 0;
    const loop = () => {
      t = window.setTimeout(
        () => {
          if (!alive) return;
          const a = pick(lastAct.current);
          lastAct.current = a.k;

          if (a.k.startsWith("glance")) {
            // взгляд отрабатывает пружина, CSS тут не нужен
            forced.current = {
              x: a.k === "glance-l" ? -2.4 : 2.4,
              y: (Math.random() * 2 - 1) * 0.8,
              until: Date.now() + a.ms,
            };
            setAct({ k: a.k, amp: 1, dur: a.ms });
          } else {
            setAct({
              k: a.k,
              amp: 0.82 + Math.random() * 0.36,
              dur: a.ms * (0.9 + Math.random() * 0.2),
            });
          }

          // тело «догоняет» действие — толчок в пружину внимания
          if (a.k === "hop") life.current?.impulse(0, -26);
          else if (a.k === "sneeze") life.current?.impulse(0, 20);
          else if (a.k === "pace-l") life.current?.impulse(-10, 0);
          else if (a.k === "pace-r") life.current?.impulse(10, 0);

          if (a.sfx && Math.random() < 0.55) a.sfx();
          if (a.pt) setBurst({ id: ++pid.current, kind: a.pt, n: a.pt === "zzz" ? 3 : 4 });

          /* Предыдущий таймер снятия надо погасить: дремота длится 2.8 с, а
             следующее действие может начаться через 1.7 — иначе старое
             `setAct(null)` обрывало бы новое действие на середине. */
          window.clearTimeout(clear);
          clear = window.setTimeout(() => alive && setAct(null), a.ms);
          loop();
        },
        1700 + Math.random() * 2600,
      );
    };
    loop();
    return () => {
      alive = false;
      window.clearTimeout(t);
      window.clearTimeout(clear);
    };
  }, [quiet]);

  /* Реакция на смену настроения: покормили — урчание и сердечки, стало
     грустно — вздох. На первом рендере молчим, иначе звук без действия. */
  useEffect(() => {
    const was = prev.current;
    prev.current = mood;
    if (was === null) return;
    if (mood === "satt" && was !== "satt") {
      purr();
      setBurst({ id: Date.now(), kind: "heart", n: 3 });
    } else if (mood === "traurig" && was !== "traurig") {
      sigh();
    }
  }, [mood]);

  /* Праздник на экране итога: здесь зверёк монтируется заново, поэтому
     переход настроения поймать нельзя — срабатываем по флагу. */
  useEffect(() => {
    if (!celebrate) return;
    setBurst({ id: Date.now(), kind: "heart", n: 4 });
    purr();
    /* `act-cheer` до этого не использовался нигде: единственный момент, когда
       зверёк имеет право на полноценный подскок с выбросом рук, — итог раунда */
    setAct({ k: "cheer", amp: 1, dur: 850 });
    life.current?.impulse(0, -30);
    const t = window.setTimeout(() => setAct(null), 850);
    return () => window.clearTimeout(t);
  }, [celebrate]);

  /* Курсор больше не двигает зверька напрямую — он задаёт цель пружине.
     Прямая запись в transform давала рывки на каждом событии мыши. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.62;
      const dx = (e.clientX - cx) / Math.max(1, window.innerWidth / 2);
      const dy = (e.clientY - cy) / Math.max(1, window.innerHeight / 2);
      pointerAt.current = Date.now();
      aim.current = {
        x: Math.max(-2.6, Math.min(2.6, dx * 3.4)),
        y: Math.max(-1.8, Math.min(1.8, dy * 2.6)),
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const dozing = act?.k === "doze";
  const showClosed = blink || dozing;

  /* ---------------------------------------------------------------- тычок ---
     Тыкать зверька — первое, что делает человек. Поэтому у этого есть ответ
     по счёту, а не одинаковый писк: первые два раза он отзывается, на
     третьем ворчит, на пятом обижается и отшатывается. Счётчик гаснет
     через 4 секунды — «пять раз подряд» должно значить именно подряд. */
  const poke = () => {
    const now = Date.now();
    const p = pokes.current;
    if (now > p.until) p.n = 0;
    p.n += 1;
    p.until = now + 4000;

    if (p.n >= 5) {
      p.n = 0;
      grunt();
      setAct({ k: "flinch", amp: 1, dur: 700 });
      setBurst({ id: ++pid.current, kind: "bang", n: 2 });
      life.current?.impulse(0, 16);
      window.clearTimeout(pokeClear.current);
      pokeClear.current = window.setTimeout(() => setAct(null), 700);
      return;
    }
    if (p.n === 3) {
      grunt();
      return;
    }
    chirp();
  };

  return (
    <span
      ref={root}
      className={cn(
        "pet-act relative inline-block shrink-0 select-none",
        act && `act-${act.k}`,
        className,
      )}
      style={
        act
          ? ({
              ["--amp" as string]: act.amp,
              animationDuration: `${Math.round(act.dur)}ms`,
            } as CSSProperties)
          : undefined
      }
      onClick={poke}
    >
      <span className="pet-look block h-full">
        <span className="pet-sway block h-full">
          <span className="pet-body relative block h-full">
            <img src={SRC[mood]} alt="" draggable={false} className="block h-full w-auto" />
            {eyes &&
              (["l", "r"] as const).map((k) => {
                const e = eyes[k];
                return (
                  <span
                    key={k}
                    aria-hidden
                    className="absolute rounded-full transition-transform duration-100 ease-out"
                    style={{
                      left: `${e.x * 100}%`,
                      top: `${e.y * 100}%`,
                      width: `${e.r * 200}%`,
                      aspectRatio: "1 / 1",
                      /* не плоский круг: сверху светлее, снизу тень — иначе
                         веко на секунду вспышки выглядит наклейкой */
                      background: `radial-gradient(circle at 50% 30%, ${e.c} 0%, ${e.c} 42%, ${LID_EDGE} 100%)`,
                      transform: `translate(-50%, -50%) scaleY(${showClosed ? 1 : 0})`,
                      transformOrigin: "center top",
                    }}
                  />
                );
              })}
          </span>
        </span>
      </span>

      {burst && <Particles burst={burst} />}
    </span>
  );
}
