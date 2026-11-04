/* ============================================================================
   ПРОБНИК ГЕНЕРАТОРОВ (одноразовый инструмент, tools/deprobe)
   ----------------------------------------------------------------------------
   Рабочий приём проекта: «проверяй генераторы пробой, а не глазами».
   Скрипт сэмплирует КАЖДЫЙ генератор из реестра GEN по N_SAMPLES раз,
   проверяет инварианты Item и печатает отчёт в stdout. Ошибки группируются
   по генератору. В конце — итоговые строки:

     PROBE-ERRORS: <число ошибок>
     GEN-COUNT: <число генераторов>

   Инварианты каждого сэмпла:
     1. число плейсхолдеров {i} в text равно gaps.length, индексы идут
        подряд от 0 без дублей;
     2. после удаления плейсхолдеров в text нет "{" и "}";
     3. текст до первого плейсхолдера начинается с заглавной буквы или цифры
        (если text начинается сразу с плейсхолдера — проверять нечего);
     4. каждая дырка имеет хотя бы один непустой допустимый ответ
        ("" в списке разрешён, но не как единственный вариант);
     5. ни один допустимый ответ не пуст после trim (см. исключение ниже);
     6. check(ответ, gaps[i]) === true для каждого непустого ответа дырки;
     7. task и why непустые;
     8. в text нет двух пробелов подряд — проверяем только вне переносов
        строк (построчно). Строка, состоящая из одного плейсхолдера
        («\n{0}» в nebensatz), пропускается целиком; разделитель «  /  »
        между двумя предложениями в том же nebensatz — норма макета.
     9. makeRound: раунд из ROUND_N упражнений по [имя генератора] возвращает
        все ROUND_N штук, topic каждого равен переданному идентификатору
        (null в результате появиться не должен).

   Легальное исключение (не ошибка): у trennbar неотделяемые глаголы дают
   вторую дырку [""] — поле, которое ученик обязан оставить пустым.
   ========================================================================== */

import { GEN, check, makeRound } from "@/lib/de/gen";
import type { Item } from "@/lib/de/gen";

/** сколько сэмплов берём с каждого генератора */
const N_SAMPLES = 40;
/** сколько упражнений просим у makeRound */
const ROUND_N = 6;

type Err = {
  gen: string;
  n: number; // номер сэмпла
  invariant: string;
  detail: string;
  sample: Pick<Item, "task" | "text" | "hint" | "gaps">;
};

const errs: Err[] = [];

const fail = (
  gen: string,
  n: number,
  it: Pick<Item, "task" | "text" | "hint" | "gaps">,
  invariant: string,
  detail: string,
): void => {
  errs.push({ gen, n, invariant, detail, sample: it });
};

/** индексы плейсхолдеров {0}, {1}… в порядке появления в тексте */
const phIndices = (text: string): number[] =>
  [...text.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));

/** проверка одного сэмпла по всем инвариантам */
function probeItem(gen: string, n: number, it: Item): void {
  const idx = phIndices(it.text);

  /* 1. плейсхолдеры: столько же, сколько дырок; подряд от 0; без дублей */
  const seen = new Set<number>();
  let seqOk = idx.length === it.gaps.length;
  idx.forEach((v, i) => {
    if (v !== i) seqOk = false; // не подряд (или дубли — они же не по индексу)
    if (seen.has(v)) seqOk = false;
    seen.add(v);
  });
  if (!seqOk)
    fail(gen, n, it, "placeholders",
      `плейсхолдеры [${idx.join(", ")}], gaps.length=${it.gaps.length} — ожидались 0..${it.gaps.length - 1} без дублей`);

  /* 2. после удаления плейсхолдеров не осталось фигурных скобок */
  const bare = it.text.replace(/\{\d+\}/g, "");
  if (/[{}]/.test(bare))
    fail(gen, n, it, "braces", `лишние { } в text вне плейсхолдеров: ${JSON.stringify(bare)}`);

  /* 3. первый символ до первого плейсхолдера — заглавная или цифра.
        Исключение — карточный формат «слова → {0}» (partizip, gegenteil,
        wortbildung, komparativ): text намеренно начинается со строчного
        инфинитива/слова, это не предложение. */
  const firstPh = it.text.search(/\{\d+\}/);
  if (firstPh > 0) {
    const card = /^[a-zäöüß].* → \{0\}$/.test(it.text);
    const c = it.text[0];
    if (!card && !/[A-ZÄÖÜ0-9]/.test(c))
      fail(gen, n, it, "text-start", `первый символ ${JSON.stringify(c)} — не заглавная буква и не цифра`);
  }

  /* 4–6. дырки: непустой ответ есть, пустоты после trim нет, check проходит */
  it.gaps.forEach((gap, i) => {
    /* легальный случай: trennbar, неотделяемые глаголы, вторая дырка [""] */
    const legalEmpty = gen === "trennbar" && gap.length === 1 && gap[0] === "";
    if (!legalEmpty && !gap.some((a) => a.trim() !== ""))
      fail(gen, n, it, "gap-nonempty",
        `gaps[${i}] = ${JSON.stringify(gap)} — нет ни одного непустого допустимого ответа`);
    for (const a of gap) {
      if (a.trim() === "") {
        if (!legalEmpty)
          fail(gen, n, it, "gap-trim",
            `gaps[${i}] = ${JSON.stringify(gap)} — допустимый ответ пуст после trim`);
        continue;
      }
      if (!check(a, gap))
        fail(gen, n, it, "check",
          `check(${JSON.stringify(a)}, gaps[${i}]) = false, gaps[${i}] = ${JSON.stringify(gap)}`);
    }
  });

  /* 7. task и why непустые */
  if (!it.task || it.task.trim() === "")
    fail(gen, n, it, "task", `task пуст: ${JSON.stringify(it.task ?? null)}`);
  if (!it.why || it.why.trim() === "")
    fail(gen, n, it, "why", `why пуст: ${JSON.stringify(it.why ?? null)}`);

  /* 8. двойные пробелы — только вне переносов строк (разбираем построчно) */
  it.text.split("\n").forEach((line, li) => {
    /* строка-плейсхолдер («\n{0}») — норма макета, пропускаем целиком */
    if (/^\s*\{\d+\}\s*$/.test(line)) return;
    /* разделитель «  /  » между двумя предложениями (nebensatz) — норма */
    const cleaned = line.replace(/ {2,}\/ {2,}/g, " / ");
    const m = cleaned.match(/ {2,}/);
    if (m && m.index !== undefined) {
      const ctx = cleaned.slice(Math.max(0, m.index - 20), m.index + 22);
      fail(gen, n, it, "double-space", `строка ${li}: два пробела подряд, контекст ${JSON.stringify(ctx)}`);
    }
  });
}

/* --------------------------------------------------------------- прогон -- */

const genNames = Object.keys(GEN);

for (const name of genNames) {
  const gen = GEN[name];

  for (let n = 0; n < N_SAMPLES; n++) {
    try {
      probeItem(name, n, gen());
    } catch (e) {
      /* сам генератор упал — это тоже ошибка пробы */
      fail(name, n, { task: "", text: "", hint: undefined, gaps: [] },
        "throw", `генератор бросил исключение: ${e instanceof Error ? e.stack : String(e)}`);
    }
  }

  /* 9. makeRound: topic-идентификатор не должен быть null / потерян */
  const topicId = `probe:${name}`;
  let round: Item[] = [];
  try {
    round = makeRound(topicId, [name], ROUND_N);
  } catch (e) {
    fail(name, -1, { task: "", text: "", hint: undefined, gaps: [] },
      "makeRound", `makeRound бросил исключение: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (round.length !== ROUND_N)
    fail(name, -1, { task: "", text: "", hint: undefined, gaps: [] },
      "makeRound", `makeRound вернул ${round.length} из ${ROUND_N} упражнений (null в makeItem прерывает раунд)`);
  round.forEach((it, i) => {
    if (!it || typeof it.topic !== "string" || it.topic !== topicId)
      fail(name, -1, { task: it?.task ?? "", text: it?.text ?? "", hint: it?.hint, gaps: it?.gaps ?? [] },
        "makeRound-topic", `round[${i}].topic = ${JSON.stringify(it?.topic ?? null)}, ожидалось ${JSON.stringify(topicId)}`);
  });
}

/* --------------------------------------------------------------- отчёт -- */

const byGen = new Map<string, Err[]>();
for (const e of errs) {
  const list = byGen.get(e.gen) ?? [];
  list.push(e);
  byGen.set(e.gen, list);
}

console.log("=== ПРОБНИК ГЕНЕРАТОРОВ DE ===");
console.log(`генераторов: ${genNames.length}, сэмплов на генератор: ${N_SAMPLES}, раунд makeRound: ${ROUND_N}`);
console.log("");
for (const name of genNames) {
  const list = byGen.get(name) ?? [];
  if (list.length === 0) {
    console.log(`[ok] ${name}: ${N_SAMPLES} сэмплов, ошибок нет`);
    continue;
  }
  console.log(`[!!] ${name}: ошибок ${list.length}`);
  for (const e of list) {
    console.log(`  сэмпл #${e.n} [${e.invariant}] ${e.detail}`);
    console.log(`    task=${JSON.stringify(e.sample.task)} text=${JSON.stringify(e.sample.text)} hint=${JSON.stringify(e.sample.hint ?? null)} gaps=${JSON.stringify(e.sample.gaps)}`);
  }
  console.log("");
}
console.log(`PROBE-ERRORS: ${errs.length}`);
console.log(`GEN-COUNT: ${genNames.length}`);

/* ненулевой код выхода, если проба нашла ошибки */
process.exitCode = errs.length ? 1 : 0;
