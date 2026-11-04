/* Проверка мотивационной машины без браузера.
   Запуск: node tools/motiv.test.mjs
   Модуль трогает localStorage только в loadMv/saveMv, чистые функции
   импортируются как есть (Node 22.18+ срезает типы сам). */

import { addXp, empty, key, streakOf, weekOf, xpForRound, paceOf, MIN_DAY, GOAL } from "../src/lib/motivation.ts";

let bad = 0;
const eq = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) bad++;
  console.log(`${ok ? "OK  " : "FAIL"}  ${name}${ok ? "" : `  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`}`);
};

const D = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0);

/* --- серия ------------------------------------------------------------- */

{
  let v = empty();
  v = addXp(v, 30, D(2026, 11, 1)).v;
  v = addXp(v, 30, D(2026, 11, 2)).v;
  eq("два дня подряд → серия 2", streakOf(v, D(2026, 11, 2)), 2);
  eq("сегодня ещё не занимались, серия жива", streakOf(v, D(2026, 11, 3)), 2);
  eq("через день после последнего — серия 0", streakOf(v, D(2026, 11, 4)), 0);
}

{
  // пропущен один день: токен должен его закрыть
  let v = empty();
  v = addXp(v, 30, D(2026, 11, 1)).v;
  const before = v.freezes;
  const r = addXp(v, 30, D(2026, 11, 3));
  eq("один пропуск прощён: серия 3", streakOf(r.v, D(2026, 11, 3)), 3);
  eq("токен израсходован", r.v.freezes, before - 1);
}

{
  // два пропуска подряд: не прощаем
  let v = empty();
  v = addXp(v, 30, D(2026, 11, 1)).v;
  const r = addXp(v, 30, D(2026, 11, 4));
  eq("два пропуска: серия 1", streakOf(r.v, D(2026, 11, 4)), 1);
}

{
  // без токенов пропуск не прощается
  let v = { ...empty(), freezes: 0 };
  v = addXp(v, 30, D(2026, 11, 1)).v;
  const r = addXp(v, 30, D(2026, 11, 3));
  eq("токенов нет: серия 1", streakOf(r.v, D(2026, 11, 3)), 1);
}

/* --- порог дня --------------------------------------------------------- */

{
  let v = empty();
  const r = addXp(v, MIN_DAY - 1, D(2026, 11, 1));
  eq("меньше порога — день не засчитан", r.v.days.length, 0);
  eq("но XP записаны", r.snap.todayXp, MIN_DAY - 1);
  const r2 = addXp(v, MIN_DAY, D(2026, 11, 1));
  eq("ровно порог — засчитан", r2.v.days.length, 1);
}

{
  let v = empty();
  const r = addXp(v, GOAL, D(2026, 11, 1));
  eq("цель дня достигнута", r.snap.goalHit, true);
  const r2 = addXp(v, GOAL - 1, D(2026, 11, 1));
  eq("цель не достигнута", r2.snap.goalHit, false);
}

/* --- XP ---------------------------------------------------------------- */

eq("6/6 быстро → 85", xpForRound({ correct: 6, total: 6, sec: 100, par: 200 }), 85);
eq("6/6 медленно → 70", xpForRound({ correct: 6, total: 6, sec: 300, par: 200 }), 70);
eq("3/6 быстро → 45", xpForRound({ correct: 3, total: 6, sec: 100, par: 200 }), 45);
eq("0/6 → 0", xpForRound({ correct: 0, total: 6, sec: 100, par: 200 }), 0);

/* --- неделя ------------------------------------------------------------ */

{
  let v = empty();
  v = addXp(v, 30, D(2026, 11, 2)).v;
  const w = weekOf(v, D(2026, 11, 2));
  eq("неделя — 7 точек", w.length, 7);
  eq("последняя точка — сегодня", w[6].today, true);
  eq("сегодня отмечено", w[6].on, true);
  eq("ключ сегодняшней точки", w[6].key, key(D(2026, 11, 2)));
}

/* --- темп к экзамену --------------------------------------------------- */

{
  const p = paceOf(26, 68);
  eq("26 узлов за 68 дней → ~2.7 в неделю", Math.round(p.perWeek * 10) / 10, 2.7);
  eq("дней на узел", Math.round(p.daysPerNode * 10) / 10, 2.6);
  eq("цель достигнута → темпа нет", paceOf(0, 10).perWeek, 0);
}

console.log(bad === 0 ? "\nвсе проверки прошли" : `\nПРОВАЛОВ: ${bad}`);
process.exit(bad === 0 ? 0 : 1);
