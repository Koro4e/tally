/* ============================================================================
   НЕПРЕРЫВНАЯ ЖИЗНЬ ЗВЕРЬКА
   ----------------------------------------------------------------------------
   Почему отдельный файл, а не CSS-анимация. У живого тела нет одного ритма:
   дыхание, покачивание, боб и дрейф идут с разными периодами, накладываются
   друг на друга, и рисунок не повторяется. Одна `@keyframes` с синусом 3.6 с
   читается как метроном — именно поэтому зверёк «неживой», хотя формально
   шевелится.

   Здесь один rAF на весь зверёк. Он пишет CSS-переменные прямо в DOM, минуя
   React: 60 ре-рендеров в секунду на карточку — это лишние сотни миллисекунд
   работы сборщика мусора, а нам нужны только transform'ы.

   Периоды 3.2 / 4.7 / 7.3 / 11.1 взаимно простые — общий цикл ≈ 55 минут,
   то есть за сессию петля не находится.

   Слои, снизу вверх:
     1. стук    — дыхание + покачивание + боб + дрейф + микродрожь (всегда)
     2. внимание — пружина к курсору или к «точке интереса» (см. Pet.tsx)
     3. взгляд  — сдвиг картинки внутри окна, ±2 px, читается как поворот
   Дискретные действия (подскок, наклон) остаются CSS-анимациями на внешнем
   контейнере и просто складываются с этим.
   ========================================================================== */

const TAU = Math.PI * 2;

/** Гладкий псевдошум: сумма синусов с иррациональными отношениями частот.
    Нужен, чтобы движение не было идеально периодическим — глаз цепляется
    именно за повтор. */
function wobble(t: number, seed: number): number {
  return (
    Math.sin(t * 0.731 + seed) * 0.55 +
    Math.sin(t * 1.913 + seed * 2.13) * 0.30 +
    Math.sin(t * 3.377 + seed * 3.71) * 0.15
  );
}

export type Aim = { x: number; y: number } | null;

export type LifeHandle = {
  /** выключить (размонтирование, скрытая вкладка) */
  stop: () => void;
  /** спокойный режим: амплитуда вдвое — для дремоты */
  setCalm: (v: boolean) => void;
  /** короткий толчок после действия: тело «догоняет» */
  impulse: (dx: number, dy: number) => void;
};

const reduceMotion = (): boolean => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

export function startLife(root: HTMLElement, getAim: () => Aim): LifeHandle {
  if (reduceMotion()) {
    // уважаем системную настройку: оставляем статичную картинку
    return { stop: () => {}, setCalm: () => {}, impulse: () => {} };
  }

  let alive = true;
  let raf = 0;
  let last = performance.now();
  const t0 = last;

  let calm = 0; // 0 — обычный, 1 — дремота (плавно)
  let calmTarget = 0;

  // пружина внимания: положение и скорость в пикселях
  let ax = 0;
  let ay = 0;
  let avx = 0;
  let avy = 0;

  let gx = 0; // взгляд

  const K = 42; // жёсткость
  const C = 2 * Math.sqrt(K) * 0.92; // чуть меньше критического — живой доводчик

  const write = (name: string, v: number, unit = ""): void => {
    root.style.setProperty(name, v.toFixed(3) + unit);
  };

  const frame = (now: number): void => {
    if (!alive) return;
    raf = requestAnimationFrame(frame);

    // в скрытой вкладке не считаем вообще; при возврате не будет скачка
    if (document.hidden) {
      last = now;
      return;
    }

    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    const t = (now - t0) / 1000;

    calm += (calmTarget - calm) * Math.min(1, dt * 2.5);
    const amp = 1 - 0.55 * calm;

    /* --- слой 1: стук -------------------------------------------------- */
    const b = Math.sin((t / 3.2) * TAU); // дыхание
    const sy = 1 + 0.011 * b * amp;
    const sx = 1 - 0.006 * b * amp; // объём примерно сохраняется

    const brot =
      (Math.sin((t / 7.3) * TAU) * 0.50 + Math.sin((t / 2.9) * TAU) * 0.11) * amp;

    const by =
      (Math.sin((t / 4.7) * TAU) * 0.55 + wobble(t, 1.7) * 0.30) * amp;
    const bx =
      (Math.sin((t / 11.1) * TAU) * 0.70 + wobble(t, 4.3) * 0.32) * amp;

    /* --- слой 2: внимание --------------------------------------------- */
    const aim = getAim();
    const tx = aim ? aim.x : 0;
    const ty = aim ? aim.y : 0;

    avx += ((tx - ax) * K - avx * C) * dt;
    avy += ((ty - ay) * K - avy * C) * dt;
    ax += avx * dt;
    ay += avy * dt;

    // наклон корпуса следует за вниманием, но с отставанием — так тело
    // «тянется» за взглядом, а не поворачивается мгновенно
    const arot = Math.max(-1.6, Math.min(1.6, ax * 0.22));

    /* --- слой 3: взгляд ------------------------------------------------ */
    const gTarget = Math.max(-1.9, Math.min(1.9, ax * 0.30));
    gx += (gTarget - gx) * Math.min(1, dt * 7);

    /* --- запись -------------------------------------------------------- */
    write("--sx", sx);
    write("--sy", sy);
    write("--bx", bx, "px");
    write("--by", by, "px");
    write("--brot", brot, "deg");
    write("--ax", ax, "px");
    write("--ay", ay, "px");
    write("--arot", arot, "deg");
    write("--gx", gx, "px");
  };

  raf = requestAnimationFrame(frame);

  return {
    stop() {
      alive = false;
      cancelAnimationFrame(raf);
    },
    setCalm(v: boolean) {
      calmTarget = v ? 1 : 0;
    },
    impulse(dx: number, dy: number) {
      // толчок скорости: пружина потом сама вернёт в ноль с перерегулированием
      avx += dx;
      avy += dy;
    },
  };
}
