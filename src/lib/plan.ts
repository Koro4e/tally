/* ============================================================================
   ДНЕВНАЯ НАГРУЗКА
   ----------------------------------------------------------------------------
   «Прогрессия нагрузки» — это не «сложность задач растёт». Это ещё и ответ
   на вопрос «сколько мне сегодня делать», который меняется сам по мере того,
   как тает календарь.

   Считается так: до экзамена N дней, последние 5 — только повторение, без
   нового материала (перед экзаменом учить новое вредно, надо закреплять).
   Остаток узлов делится на оставшиеся учебные дни — это и есть дневная норма.

   Потолок 3 новых узла в день. Не потому что больше нельзя, а потому что
   раунд — это 6 задач с разбором, то есть 5–7 минут, и три раунда плюс
   повторения уже упираются в час. Норма, которую невозможно выполнить,
   хуже отсутствия нормы: она превращает день в долг.
   ========================================================================== */

import { PATH, counts, daysLeft, statusOf, type M } from "@/lib/mastery";

const DAY = 86_400_000;

export type Load = {
  /** дней до экзамена */
  days: number;
  /** сколько узлов ещё не закрыто */
  remaining: number;
  /** сколько узлов просрочено на повторение */
  reviews: number;
  /** сколько НОВЫХ узлов надо закрыть сегодня */
  neu: number;
  /** сколько узлов закрыто сегодня */
  today: number;
  /** сколько раундов всего на сегодня (новые + повторения) */
  rounds: number;
  /** успеваем ли при текущем темпе */
  onTrack: boolean;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* Отсечка «интенсивной фазы» в днях до экзамена: план стартует ~90 дней
   до экзамена (конец октября 2026). Прежнее магическое 200 обещало
   «график с запасом», на котором onTrack почти всегда был зелёным и
   ничего не измерял. */
const PLAN_SPAN_DAYS = 90;

const startOfDay = (): number => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function load(m: M): Load {
  const days = daysLeft();
  const { done, total } = counts(m);
  const remaining = Math.max(0, total - done);

  const reviews = PATH.filter((s) => statusOf(s, m) === "review").length;

  /* комментарий обещал «последние 5 дней — только повторение», а код
     studyDays = max(1, days-5) на экзаменационной неделе давал 2–3 НОВЫХ
     узла в день. Теперь буквально: days <= 5 — neu=0, только повтор. */
  const finishWeek = days <= 5;
  const studyDays = Math.max(1, days - 5);
  const raw = Math.ceil(remaining / studyDays);

  /* повторения съедают время первыми. Прежний `6 - reviews` при reviews>6
     уходил в минус, а clamp(...,1,3) всё равно выдавал neu=1 — план
     требовал 7+ раундов в день. Нижняя граница теперь 0: если день
     завален повторами, нового не будет — и это честно. */
  const neu =
    remaining === 0 || finishWeek
      ? 0
      : clamp(Math.min(raw, Math.max(0, 6 - reviews)), 0, 3);

  const today = Object.entries(m).filter(
    ([, r]) => r.p >= 0.95 && r.last >= startOfDay(),
  ).length;

  /* «успеваю» — сравнение фактического прогресса с линейным графиком:
     к сегодняшнему дню должно быть закрыто (прошло / всего) доля пути */
  const passed = clamp(days / PLAN_SPAN_DAYS, 0, 1);
  const onTrack = remaining === 0 || done / Math.max(1, total) >= passed * 0.85;

  return { days, remaining, reviews, neu, today, rounds: neu + reviews, onTrack };
}

/** сколько узлов в день нужно, чтобы дойти до нуля к концу учебной фазы
    (последние 5 дней — только повтор, в них узлы не закрываются) */
export const neededPerDay = (l: Load): number =>
  l.remaining === 0 ? 0 : Math.ceil(l.remaining / Math.max(1, l.days - 5));

/** «сегодня» в человеческом виде: 2 из 3 */
export const todayText = (l: Load): string => `${Math.min(l.today, l.neu)} / ${l.neu}`;

export { DAY };
