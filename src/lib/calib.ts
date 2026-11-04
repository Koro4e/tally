/* ============================================================================
   КАЛИБРОВКА
   ----------------------------------------------------------------------------
   Зачем это существует.

   Раньше сервер получал `level: 3` — константу. Все задачи за всё время были
   одной сложности: и первая в жизни задача по логарифмам, и двадцатая.
   Это не прогрессия, это отсутствие прогрессии, замаскированное числом.

   Здесь накапливается замер по каждой ФОРМЕ задачи (`specs.ts`): сколько раз
   решал, сколько верно, сколько секунд ушло. Из замера считается сложность,
   из сложности и вероятности знания — уровень 1..5, который уходит в промпт.

   Три вещи, которые тут важны:

   1. Сглаживание. Одна верная задача — это не «100 %», это «неизвестно».
      Точность считается по Лапласу: (ok+1)/(n+2). Первая верная даёт 0.67,
      первая неверная — 0.33. Только после 4–5 замеров оценка начинает
      отражать реальность.

   2. Время не заменяет точность, а уточняет её. Медленно и верно — это
      «знает, но не автоматизировано», и на экзамене без калькулятора это
      стоит баллов. Поэтому темп входит в сложность с весом 0.4.

   3. Уровень не растёт от «прошёл раунд». Он растёт от вероятности знания,
      которую считает сервер. Если p упала после забывания — уровень тоже
      упадёт, и это правильно: возвращаться надо с более простых форм.
   ========================================================================== */

export type Obs = {
  /** сколько раз эта форма встречалась */
  n: number;
  /** сколько из них верно */
  ok: number;
  /** сглаженное время верного ответа, секунды */
  sec: number;
  /** сглаженный par, который давала модель — нужен для диагностики */
  par: number;
};

export type Calib = Record<string, Obs>;

const KEY = "tally.calib.v1";

/** ключ замера: форма уникальна внутри узла, но не глобально */
export const key = (skill: string, variant: string) => `${skill}/${variant}`;

export function loadC(): Calib {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as Calib;
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

export function saveC(c: Calib): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* приватный режим — живём без калибровки */
  }
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const clamp01 = (v: number) => clamp(v, 0, 1);

/**
 * Один ответ — одно наблюдение. Время и par сглаживаются EWMA: одна задача,
 * на которой человек залип на телефоне, не должна сдвинуть всю оценку формы.
 * Счётчики n и ok — обычная сумма, их сглаживать нельзя, они и есть выборка.
 */
export function observe(
  c: Calib,
  skill: string,
  variant: string | undefined,
  ok: boolean,
  sec: number,
  par: number,
): Calib {
  if (!variant) return c;
  const k = key(skill, variant);
  const prev = c[k];
  return {
    ...c,
    [k]: {
      n: (prev?.n ?? 0) + 1,
      ok: (prev?.ok ?? 0) + (ok ? 1 : 0),
      sec: prev ? prev.sec + (sec - prev.sec) * 0.35 : sec,
      par: prev ? prev.par + (par - prev.par) * 0.25 : par,
    },
  };
}

/** точность по Лапласу: 1 из 1 — это 0.67, а не 1.00 */
export const accuracy = (o?: Obs): number => ((o?.ok ?? 0) + 1) / ((o?.n ?? 0) + 2);

/** темп: 1.0 — ровно в par, 1.5 — в полтора раза медленнее */
export const pace = (o?: Obs): number => (o && o.par > 0 ? clamp(o.sec / o.par, 0.3, 3) : 1);

/**
 * Сложность формы, 0..1. Меньше двух замеров — 0.45 (чуть ниже середины):
 * «не знаю» не должно выглядеть как «легко» и как «трудно».
 */
export function difficulty(o?: Obs): number {
  if (!o || o.n < 2) return 0.45;
  const d = 0.6 * (1 - accuracy(o)) + 0.4 * clamp01((pace(o) - 0.5) / 1.5);
  return clamp01(d);
}

/**
 * Уровень для промпта, 1..5. База — вероятность знания: p=0 → 1, p=0.95 → 4.2.
 * Сложность формы двигает его на ±0.7, чтобы внутри одного раунда задачи
 * всё-таки различались, а не были все «Stufe 3».
 */
export function levelFor(p: number, d: number): number {
  const base = 1 + 3.2 * clamp01(p / 0.95);
  return clamp(Math.round(base + (d - 0.45) * 1.6), 1, 5);
}

/**
 * Порядок форм в раунде: от простого к сложному. Прогрессия нагрузки должна
 * быть видна внутри раунда, а не только между раундами — иначе первая задача
 * бьёт по лицу и человек закрывает вкладку.
 *
 * Формы без замеров идут в порядке спецификации (там они уже от простого
 * к сложному — так их писал человек по образцу экзамена).
 */
export function orderByDifficulty<T extends { id: string }>(
  skill: string,
  list: T[],
  c: Calib,
): T[] {
  const idx = new Map(list.map((v, i) => [v.id, i]));
  return [...list].sort((a, b) => {
    const da = difficulty(c[key(skill, a.id)]);
    const db = difficulty(c[key(skill, b.id)]);
    if (Math.abs(da - db) > 0.02) return da - db;
    return (idx.get(a.id) ?? 0) - (idx.get(b.id) ?? 0);
  });
}

/** сводка для панели: сколько измерено, насколько точно, насколько быстро */
export function summary(c: Calib): { forms: number; n: number; acc: number; pace: number } {
  const all = Object.values(c);
  const n = all.reduce((a, o) => a + o.n, 0);
  const ok = all.reduce((a, o) => a + o.ok, 0);
  const withTime = all.filter((o) => o.n > 0 && o.par > 0);
  const pc = withTime.length
    ? withTime.reduce((a, o) => a + o.sec / o.par, 0) / withTime.length
    : 1;
  return {
    forms: all.filter((o) => o.n > 0).length,
    n,
    acc: n ? ok / n : 0,
    pace: pc,
  };
}

/**
 * par, который уходит в раунд. Модель оценивает его на глаз и иногда врёт
 * втрое, поэтому: держим в коридоре 15..180 с и, если по форме уже есть
 * замеры, не даём par уехать дальше чем в 1.6× от реального времени —
 * иначе «в темпе» перестаёт что-либо значить.
 */
export function parFor(modelPar: number, o?: Obs): number {
  let p = clamp(Number.isFinite(modelPar) && modelPar > 0 ? modelPar : 45, 15, 180);
  if (o && o.n >= 2 && o.sec > 0) p = clamp(p, o.sec / 1.6, o.sec * 1.6);
  return Math.round(p);
}
