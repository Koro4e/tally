/* ============================================================================
   ПРОГРЕСС ПО НЕМЕЦКОМУ
   ----------------------------------------------------------------------------
   Отдельное хранилище от математики (`tally.de.mastery.v1`). Не общее, потому
   что правила разные: в математике узел закрывается по вероятности И покрытию
   форм, здесь — по точности раунда. Смешивать их в одном файле значило бы
   каждый раз помнить, к какому предмету относится запись.

   Порог 0,8, а не 0,95. Раунд — это шесть упражнений; 5 из 6 дают 0,83.
   Требовать 0,95 значило бы «шесть из шести каждый раз», а это про усидчивость,
   не про знание. 0,8 при этом отсекает 4 из 6 — то есть человека, который
   ещё путает Perfekt с Präteritum.

   Забывание то же, что в математике: 7 % в сутки после срока повторения.
   Язык забывается быстрее математики, но интервалы 1/3/7/21/45 уже это
   учитывают, и менять их без причины не стоит.
   ========================================================================== */

import { deById, drillable, type DeTopic } from "@/lib/de/topics";

export type DeRec = {
  /** точность, сглаженная по раундам */
  p: number;
  due: number;
  last: number;
  rounds: number;
  /** сколько раундов всего пройдено — для честной статистики */
  seen: number;
  /** финальная проверка темы сдана (раунд 5/6+) — гейт хозяина 04.11.
      Без неё следующая тема не открывается */
  pf?: boolean;
};

export type DeM = Record<string, DeRec>;

const KEY = "tally.de.mastery.v1";
const DAY = 86_400_000;

export const DE_PASS = 0.8;
const DECAY = 0.93;
const REVIEW_DAYS = [1, 3, 7, 21, 45];

export function loadDe(): DeM {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as DeM;
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

export function saveDe(m: DeM): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    /* приватный режим */
  }
}

export function pNowDe(rec?: DeRec): number {
  if (!rec) return 0;
  const late = Math.max(0, (Date.now() - rec.due) / DAY);
  return rec.p * Math.pow(DECAY, late);
}

export const isPassedDe = (rec?: DeRec): boolean => pNowDe(rec) >= DE_PASS;

/**
 * Итог раунда. Точность сглаживается: один слабый раунд не обнуляет
 * предыдущие, но и не даёт закрыть тему случайно.
 */
export function recordDe(m: DeM, id: string, correct: number, total: number): DeM {
  const prev = m[id];
  const acc = total > 0 ? correct / total : 0;
  const p = prev ? prev.p * 0.55 + acc * 0.45 : acc;
  const closed = p >= DE_PASS;
  const rounds = closed ? (prev?.rounds ?? 0) + 1 : 0;
  const days = closed ? REVIEW_DAYS[Math.min(rounds - 1, REVIEW_DAYS.length - 1)] : 1;
  return {
    ...m,
    [id]: { p, due: Date.now() + days * DAY, last: Date.now(), rounds, seen: (prev?.seen ?? 0) + 1 },
  };
}

export type DeStatus = "mastered" | "review" | "open" | "locked" | "soon";

/**
 * Состояние темы. Зависимости НЕ блокируют.
 *
 * В математике узел закрыт, пока не пройдены предыдущие: там навыки реально
 * строятся друг на друге, и корень без степеней не имеет смысла. В грамматике
 * наоборот — человек, который говорит на B1, не должен пройти спряжение
 * «sein» заново, чтобы открыть Relativsätze. Это не обучение с нуля,
 * это повторение, и точка входа у каждого своя.
 *
 * Поэтому `deps` здесь — только рекомендация порядка: `depsHint()` говорит,
 * что стоит освежить до этого, но кнопка остаётся нажимаемой.
 */
export function statusDe(t: DeTopic, m: DeM): DeStatus {
  if (!drillable(t)) return "soon";
  const rec = m[t.id];
  if (rec && rec.p >= DE_PASS) return isPassedDe(rec) ? "mastered" : "review";
  /* Themen-Prüfung (решение хозяина 04.11): тема открыта для раундов, только
     если у всех её зависимостей сдана финальная проверка. Теория читается
     всегда — блокируется только практика. */
  const gated = t.deps.some((d) => {
    const dd = deById[d];
    return !!dd && drillable(dd) && !m[d]?.pf;
  });
  return gated ? "locked" : "open";
}

/** первая непройденная зависимость — мягкая подсказка «сначала это» */
export function depsHint(t: DeTopic, m: DeM): string | null {
  for (const d of t.deps) {
    const dd = deById[d];
    if (!dd || !drillable(dd)) continue;
    if (!isPassedDe(m[d])) return dd.de;
  }
  return null;
}

/** куда идти сейчас: сначала просроченные повторения, потом новое */
export function currentDe(m: DeM, level: string): DeTopic | null {
  const pool = Object.values(deById).filter(
    (t) => t.level === level && drillable(t) && statusDe(t, m) !== "locked",
  );
  const due = pool
    .filter((t) => statusDe(t, m) === "review")
    .sort((a, b) => (m[a.id]?.due ?? 0) - (m[b.id]?.due ?? 0));
  if (due.length) return due[0];
  return pool.find((t) => statusDe(t, m) === "open") ?? null;
}

export function countsDe(m: DeM): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const t of Object.values(deById)) {
    if (!drillable(t)) continue;
    total++;
    /* «пройдено» — по сглаженной точности БЕЗ затухания: тема, которую пора
       повторить, всё равно была пройдена, жёлтая точка отдельно напомнит о
       повторении. Счётчик по затуханию падал сам собой и выглядел как
       «прогресс слетел», хотя тема была закрыта. */
    const r = m[t.id];
    if (r && r.p >= DE_PASS) done++;
  }
  return { done, total };
}
