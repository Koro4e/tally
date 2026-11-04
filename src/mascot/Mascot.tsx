import { useEffect, useRef } from "react";
import { bindPointer, characterOf, Engine, mount, THUMB_POSES, type MascotChar, type RigMood, type RigState } from "./tally-mascots";

/* ============================================================================
   МАСКОТ — React-обёртка над пружинным ригом (tally-mascots.ts).
   ----------------------------------------------------------------------------
   Замена/сосед Pet.tsx: тот же контракт по размеру (className="h-[96px] w-auto")
   и по настроениям — принимает и настроения Pet (satt/ok/hungrig/traurig), и
   полные восемь настроений рига. celebrate включает «Ура!» (прыжки, искры).

   Отображение настроений Pet → риг (меняется в одной строке PET_TO_RIG):
     satt    → happy   (цель дня взята)
     ok      → happy   (уже что-то сделано — доволен)
     hungrig → idle    (серия жива, сегодня ещё не занимался — спокойно ждёт,
                        смотрит на курсор; раньше был think — «вечно думал»)
     traurig → sad     (серия потеряна)

   ПРОИЗВОДИТЕЛЬНОСТЬ. Живой рендер — только у главных маскотов (шапка, тютор).
   Все экземпляры крутятся в ОДНОМ общем rAF-цикле:
     · прямоугольники кэшируются и обновляются по scroll/resize/ResizeObserver
       или раз в 500 мс — никакого getBoundingClientRect на каждый кадр
       (раньше 6–7 инстансов делали по принудительному reflow за кадр — отсюда
       просадки ниже 60 fps);
     · фазы чтения и записи разведены: сначала все rect, потом все отрисовки;
     · мелкие чипы (58 px) обновляются через кадр (30 fps) с накоплением dt,
       чтобы пружины не замедлялись;
     · rAF-цикл живёт, пока смонтирован хоть один маскот.

   «ЖИВОСТЬ». Кроме слежения за курсором и моргания движок сам планирует
   спонтанные действия (см. Engine.startAct): подпрыгнуть, наклонить голову,
   осмотреться даже при живой мыши, потянуться, моргнуть дважды. Набор зависит
   от настроения; в reduce-motion всё это выключено.
   ========================================================================== */

export type MascotMood = RigMood | "satt" | "ok" | "hungrig" | "traurig";

const PET_TO_RIG: Record<"satt" | "ok" | "hungrig" | "traurig", RigMood> = {
  satt: "happy",
  ok: "happy",
  hungrig: "idle",
  traurig: "sad",
};

function rigMood(m: MascotMood): RigMood {
  return m in PET_TO_RIG ? PET_TO_RIG[m as keyof typeof PET_TO_RIG] : (m as RigMood);
}

/* ============================ ОБЩИЙ ЦИКЛ ================================= */

type Inst = {
  box: HTMLSpanElement;
  eng: Engine;
  upd: (s: RigState) => void;
  rect: DOMRect | null;
  rectAt: number;
  rectDirty: boolean;
  small: boolean;
  frame: number;
  acc: number;
  visible: boolean;
  reduced: boolean;
};

const instances = new Set<Inst>();
let loopRaf = 0;
let lastT = 0;

function tick(now: number): void {
  loopRaf = requestAnimationFrame(tick);
  if (document.hidden) {
    lastT = now;
    return;
  }
  /* таймстамп rAF-кадра может быть МЕНЬШЕ performance.now(), снятого раньше —
     без clamp(…, 0) первый dt уходит в минус и время движка течёт назад */
  const dt = Math.min(0.033, Math.max(0, (now - lastT) / 1000));
  lastT = now;

  /* фаза чтения: rect только когда помечен/устарел; видимость — из уже
     снятого rect: дешевле IntersectionObserver и самовосстанавливается */
  for (const it of instances) {
    if (it.rectDirty || now - it.rectAt > 500) {
      it.rect = it.box.getBoundingClientRect();
      it.rectAt = now;
      it.rectDirty = false;
      it.small = it.rect.width < 90;
      it.visible =
        it.rect.width > 0 &&
        it.rect.bottom > -60 &&
        it.rect.top < (window.innerHeight || 800) + 60;
    }
  }

  /* фаза записи */
  for (const it of instances) {
    if (!it.visible) {
      it.acc = 0;
      continue;
    }
    it.acc += dt;
    it.frame++;
    if (it.small && it.frame % 2) continue;
    const d = Math.min(0.05, it.acc);
    if (d <= 0) continue;
    it.acc = 0;
    it.upd(it.eng.step(d, it.rect, it.reduced));
  }
}

function ensureLoop(): void {
  if (loopRaf) return;
  lastT = performance.now();
  loopRaf = requestAnimationFrame(tick);
}

function maybeStopLoop(): void {
  if (instances.size === 0 && loopRaf) {
    cancelAnimationFrame(loopRaf);
    loopRaf = 0;
  }
}

/* ============================== КОМПОНЕНТ ================================ */

/** Статичная миниатюра: рисуется один раз, без движка и rAF — для пикера.
    pose: "happy" (довольный, для выбранного) | "calm" (спокойный). */
export function MascotThumb({
  char,
  pose = "calm",
  className,
}: {
  char: MascotChar;
  pose?: "happy" | "calm";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    box.textContent = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 300 300");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";
    svg.style.overflow = "visible";
    box.appendChild(svg);
    mount(svg, characterOf(char))(THUMB_POSES[pose]);
  }, [char, pose]);
  return <span ref={ref} aria-hidden className={className} style={{ display: "block", height: "100%", aspectRatio: "1 / 1" }} />;
}

export default function Mascot({
  char = "hoot",
  mood = "ok",
  celebrate = false,
  className,
  onPoke,
}: {
  /** кто: pip | hoot | mochi | bolt | gloop */
  char?: MascotChar;
  /** настроение Pet (satt/ok/hungrig/traurig) или рига (idle…sleep) */
  mood?: MascotMood;
  /** «Ура!» — как celebrate у Pet: прыжки и искры, пока true */
  celebrate?: boolean;
  className?: string;
  /** тычок по зверьку (в дополнение к встроенной реакции) */
  onPoke?: () => void;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const engRef = useRef<Engine | null>(null);
  const instRef = useRef<Inst | null>(null);

  /* сборка SVG и регистрация в общем цикле — пересборка только при смене символа */
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    bindPointer();
    box.textContent = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 300 300");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";
    svg.style.overflow = "visible";
    box.appendChild(svg);
    const eng = new Engine();
    engRef.current = eng;

    const inst: Inst = {
      box,
      eng,
      upd: mount(svg, characterOf(char)),
      rect: null,
      rectAt: 0,
      rectDirty: true,
      small: false,
      frame: 0,
      acc: 0,
      visible: true,
      reduced: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    };
    instRef.current = inst;

    const markDirty = (): void => {
      inst.rectDirty = true;
    };
    /* capture ловит скролл любых внутренних контейнеров, не только окна */
    window.addEventListener("scroll", markDirty, { passive: true, capture: true });
    window.addEventListener("resize", markDirty, { passive: true });
    const ro = "ResizeObserver" in window ? new ResizeObserver(markDirty) : null;
    ro?.observe(box);

    instances.add(inst);
    ensureLoop();

    return () => {
      instances.delete(inst);
      ro?.disconnect();
      window.removeEventListener("scroll", markDirty, true);
      window.removeEventListener("resize", markDirty);
      maybeStopLoop();
      if (instRef.current === inst) {
        instRef.current = null;
        engRef.current = null;
      }
    };
  }, [char]);

  /* настроение и celebrate — поверх собранного символа.
     char в зависимостях: после пересборки движок стартует с idle,
     здесь сразу ставится актуальное настроение. */
  useEffect(() => {
    engRef.current?.setMood(celebrate ? "cheer" : rigMood(mood));
  }, [char, mood, celebrate]);

  return (
    <span
      className={className}
      role="img"
      aria-label={"Maskot " + characterOf(char).name}
      onPointerDown={() => {
        engRef.current?.poke();
        onPoke?.();
      }}
      style={{ display: "inline-block", cursor: "pointer", touchAction: "manipulation", userSelect: "none" }}
    >
      {/* квадрат по высоте родителя: при w-auto даёт ширину = высоте */}
      <span ref={boxRef} style={{ display: "block", height: "100%", aspectRatio: "1 / 1" }} />
    </span>
  );
}
