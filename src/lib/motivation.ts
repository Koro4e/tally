/* ============================================================================
   МОТИВАЦИОННАЯ МАШИНА
   ----------------------------------------------------------------------------
   Зачем. До экзамена 68 дней, а заниматься надо каждый день. Само по себе
   «надо» не работает: у приложения нет ни одного повода вернуться завтра.

   На чём построено (и почему именно так).
   1. СЕРИЯ ДНЕЙ. Duolingo публиковал, что дошедшие до 7 дней подряд в 3,6
      раза чаще доходят до конца курса. Это корреляция, не причинность, но
      механика дешёвая и проверенная на миллионах людей.
   2. ПРОЩЕНИЕ. Главная причина, по которой серии бросают, — не лень, а один
      пропущенный день: «всё равно уже сломалось». Поэтому есть два «Schutz»:
      один пропуск съедает токен, серия живёт. Токены восстанавливаются.
   3. МАЛЕНЬКАЯ ЦЕЛЬ. Goal gradient: усилие растёт, когда до цели близко.
      Цель дня — 60 XP, это примерно одна-две короткие сессии, а не «час
      математики». День в серию засчитывается с 20 XP: серия — про привычку,
      цель — про объём, это разные пороги и путать их нельзя.
   4. ГЛАВНОЕ — ЭКЗАМЕН. Систематический обзор геймификации (Ratinho et al.,
      2023, 40 исследований) говорит, что эффект очков и значков со временем
      падает, а внешние награды могут подорвать внутреннюю мотивацию. Поэтому
      центральная цифра — не XP, а «сколько узлов в неделю осталось», то есть
      приближение к настоящей цели. XP — только топливо для серии.

   Всё состояние — в localStorage, без сервера. Чистые функции, чтобы это можно
   было проверять без браузера.
   ========================================================================== */

const KEY = "tally.motiv.v1";
const DAY = 86_400_000;

/** Сколько XP нужно, чтобы день попал в серию (одна короткая сессия). */
export const MIN_DAY = 20;
/** Дневная цель. Достигается за одну-две сессии. */
export const GOAL = 60;
/** Больше двух прощений не копим: иначе серия перестаёт что-то значить. */
const MAX_FREEZE = 2;

export type Day = string; // YYYY-MM-DD по местному времени

export type Mv = {
  /** дни, когда набрано ≥ MIN_DAY, по возрастанию */
  days: Day[];
  /** пропущенные дни, прощённые токеном — для серии они как рабочие */
  frozen: Day[];
  xpByDay: Record<Day, number>;
  best: number;
  freezes: number;
};

export type WeekDot = { key: Day; on: boolean; today: boolean };

export type Snap = {
  /** сколько XP дала только что законченная сессия */
  xp: number;
  todayXp: number;
  goal: number;
  goalHit: boolean;
  streak: number;
  best: number;
  freezes: number;
  week: WeekDot[];
};

export const empty = (): Mv => ({ days: [], frozen: [], xpByDay: {}, best: 0, freezes: MAX_FREEZE });

const pad = (n: number) => String(n).padStart(2, "0");
export const key = (d: Date): Day => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const parse = (k: Day): Date => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const shift = (d: Date, n: number): Date => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/* ------------------------------------------------------------- хранение --- */

export function loadMv(): Mv {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const o = JSON.parse(raw) as Partial<Mv>;
    return {
      days: Array.isArray(o.days) ? o.days : [],
      frozen: Array.isArray(o.frozen) ? o.frozen : [],
      xpByDay: o.xpByDay && typeof o.xpByDay === "object" ? o.xpByDay : {},
      best: Number(o.best) || 0,
      freezes: Number.isFinite(o.freezes) ? Number(o.freezes) : MAX_FREEZE,
    };
  } catch {
    return empty();
  }
}

export function saveMv(v: Mv): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* приватный режим — живём без сохранения */
  }
}

/* ---------------------------------------------------------------- серия --- */

/**
 * Длина серии. Если сегодня ещё не занимались, серия не обнуляется до
 * полуночи — она считается от вчера. Иначе цифра пугала бы каждое утро.
 */
export function streakOf(v: Mv, now = new Date()): number {
  const on = new Set<Day>([...v.days, ...v.frozen]);
  let d = new Date(now);
  if (!on.has(key(d))) d = shift(d, -1);
  let n = 0;
  while (on.has(key(d))) {
    n++;
    d = shift(d, -1);
  }
  return n;
}

/** Последние семь дней для полоски: он/off и где сегодня. */
export function weekOf(v: Mv, now = new Date()): WeekDot[] {
  const on = new Set<Day>([...v.days, ...v.frozen]);
  const today = key(now);
  return Array.from({ length: 7 }, (_, i) => {
    const k = key(shift(now, i - 6));
    return { key: k, on: on.has(k), today: k === today };
  });
}

export function snapOf(v: Mv, xp = 0, now = new Date()): Snap {
  const todayXp = v.xpByDay[key(now)] ?? 0;
  return {
    xp,
    todayXp,
    goal: GOAL,
    goalHit: todayXp >= GOAL,
    streak: streakOf(v, now),
    best: Math.max(v.best, streakOf(v, now)),
    freezes: v.freezes,
    week: weekOf(v, now),
  };
}

/* ----------------------------------------------------------------- опыт --- */

/**
 * XP за раунд. Считается из того, что уже есть в RoundResult, поэтому
 * машина не требует ни одного нового запроса к серверу.
 *
 * 10 за верную задачу, 15 за скорость (уложился в par), 10 за чистый раунд.
 * Шесть верных и быстро — 85 XP, то есть дневная цель с одного раунда.
 * Три из шести — 30 XP, цель не закрыта, но день в серию уже попал.
 */
export function xpForRound(r: { correct: number; total: number; sec: number; par: number }): number {
  const base = Math.max(0, r.correct) * 10;
  /* скорость имеет смысл только если хоть что-то решено: 0 верных подряд
     не должно приносить бонус «за быстроту» */
  const speed = r.correct > 0 && r.par > 0 && r.sec <= r.par ? 15 : 0;
  const clean = r.total > 0 && r.correct === r.total ? 10 : 0;
  return base + speed + clean;
}

/**
 * XP за немецкий раунд. Немецкий раунд не имеет par (в Deutsch время
 * сознательно не давит), поэтому формула проще математики: 8 за верное
 * упражнение + 15 за чистый раунд. 6/6 = 63 XP — дневная цель с одного
 * раунда, 3/6 = 39 — день в серии уже попал. Без этого немецкая ветка,
 * где пользователь проводит больше всего времени при 86 %, была бы
 * невидима для серии, цели и зверька.
 */
export function xpForDeRound(correct: number, total: number): number {
  const base = Math.max(0, correct) * 8;
  const clean = total > 0 && correct === total ? 15 : 0;
  return base + clean;
}

/**
 * Начислить XP и обновить серию. Возвращает новое состояние и снимок для UI.
 *
 * Прощение пропусков делается здесь, а не при чтении: иначе «серия жива»
 * зависело бы от того, когда её посмотрели.
 */
export function addXp(v: Mv, xp: number, now = new Date()): { v: Mv; snap: Snap } {
  const next: Mv = {
    days: [...v.days],
    frozen: [...v.frozen],
    xpByDay: { ...v.xpByDay },
    best: v.best,
    freezes: v.freezes,
  };

  const t = key(now);
  next.xpByDay[t] = (next.xpByDay[t] ?? 0) + xp;

  if (next.xpByDay[t] >= MIN_DAY && !next.days.includes(t)) {
    /* Один пропущенный день подряд прощаем токеном: именно после него
       серию обычно и бросают. Два и больше — не прощаем, это уже не сбой. */
    const last = next.days.length ? next.days[next.days.length - 1] : null;
    if (last) {
      /* разница в календарных днях, а не в часах: переход на летнее время
         сдвигает сутки на час, и цикл по датам считал бы лишний день */
      const gap = Math.round((parse(t).getTime() - parse(last).getTime()) / DAY);
      /* gap = 2 значит пропущен ровно один день: 1-е → 3-е */
      if (gap === 2 && next.freezes > 0) {
        next.frozen.push(key(shift(parse(last), 1)));
        next.freezes -= 1;
      }
    }
    next.days.push(t);
    // каждые семь активных дней возвращаем один токен
    if (next.days.length % 7 === 0 && next.freezes < MAX_FREEZE) next.freezes += 1;
  }

  next.best = Math.max(next.best, streakOf(next, now));
  return { v: next, snap: snapOf(next, xp, now) };
}

/* ------------------------------------------------------------- прогресс ---
   Главная цифра машины: не очки, а приближение к экзамену.
   -------------------------------------------------------------------------- */

export type Pace = {
  /** сколько узлов ещё не закрыто */
  left: number;
  days: number;
  /** узлов в неделю, чтобы успеть ровно к экзамену */
  perWeek: number;
  /** дней на один узел при таком темпе */
  daysPerNode: number;
};

export function paceOf(left: number, days: number): Pace {
  const perWeek = days > 0 ? (left / days) * 7 : 0;
  return { left, days, perWeek, daysPerNode: left > 0 ? days / left : 0 };
}

/* ------------------------------------------------------------ проверка --- */

/** Быстрая проверка логики без браузера: node src/lib/motivation.ts нельзя
    (там localStorage), поэтому тест живёт в tools/motiv.test.mjs. */
export const __test = { MAX_FREEZE, DAY };
