/* ============================================================================
   check-hoer-v2 — самопроверка второго варианта Hörverstehen (HOER2)
   Читает ОБА файла как ТЕКСТ (без импорта TS) и проверяет регулярками:
   - diktat.text: ровно 13 пропусков {0}…{12} строго по порядку;
   - diktat.answers: ровно 13 ответов, каждый дословно слышен в diktat.full
     (сравнение по нижнему регистру);
   - diktat.full: 190–205 слов (3 абзаца через " + ");
   - mc: intro 60–90 слов, ровно 6 items, у каждого 3 опции и correct 0|1|2;
   - dialogs: ровно 3 диалога, в каждом 6–10 реплик (who ∈ {A,B}) и ровно 2
     вопроса с 3 опциями и correct 0|1|2;
   - внутри строковых литералов нет ASCII-двойных кавычек и символов < >;
   - у обоих файлов одинаковое число вхождений who: и ПОБАЙТОВО одинаковый
     объект HOER2 (всё после "export const HOER2").
   Запуск: node tools/genwork/check-hoer-v2.mjs   (из корня проекта)
   ========================================================================== */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const files = [
  path.join(root, "tools", "genwork", "horverstehen-v2.ts"),
  path.join(root, "src", "lib", "de", "exam-hoer-v2.ts"),
];

const errors = [];
const fail = (msg) => errors.push(msg);

/* -- утилиты ------------------------------------------------------------- */

// строковые литералы в срезе текста (сегменты конкатенации " + ")
function segs(slice) {
  return [...slice.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
}
function join(slice) {
  return segs(slice).join("");
}
// все массивы "options: [ ... ]" в срезе: у каждого ровно 3 строки
function checkOptions(slice, label) {
  const re = /options:\s*\[/g;
  let m;
  let n = 0;
  while ((m = re.exec(slice)) !== null) {
    n += 1;
    const end = slice.indexOf("]", m.index);
    const inner = m.index === -1 ? "" : slice.slice(m.index, end);
    const opts = segs(inner);
    if (opts.length !== 3) fail(`${label}: options #${n} — должно быть 3 варианта, найдено ${opts.length}`);
  }
  return n;
}
// срез "correct: N" в диапазоне
function corrects(slice) {
  return [...slice.matchAll(/correct:\s*([012])(?![0-9])/g)].map((m) => Number(m[1]));
}
function words(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

/* -- проверки каждого файла ---------------------------------------------- */

const perFile = {};

for (const file of files) {
  const label = path.relative(root, file);
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch (e) {
    fail(`${label}: файл не читается (${e.message})`);
    continue;
  }
  // всё, что ниже "export const HOER2" — сам объект (блок типов и комментарии
  // выше могут содержать те же метки "full:", "text:", "answers:", "who:")
  const base = src.indexOf("export const HOER2");
  if (base < 0) {
    fail(`${label}: не найден export const HOER2`);
    continue;
  }
  const body = src.slice(base);
  const all = segs(body);

  // ASCII-кавычки внутри строк (экранированные) и символы < >
  if (src.includes('\\"')) fail(`${label}: внутри строки есть экранированная ASCII-кавычка`);
  const badChars = all.filter((s) => /[<>]/.test(s));
  if (badChars.length) fail(`${label}: в ${badChars.length} строковых литералах есть символы < или >`);
  const innerQuote = all.filter((s) => s.includes('"'));
  if (innerQuote.length) fail(`${label}: в ${innerQuote.length} строковых литералах есть ASCII-кавычка`);

  // ---- diktat
  const iFull = body.indexOf("full:");
  const iText = body.indexOf("text:", iFull);
  const iAnswers = body.indexOf("answers:", iText);
  if (iFull < 0 || iText < 0 || iAnswers < 0) {
    fail(`${label}: не найдены секции diktat (full/text/answers)`);
    continue;
  }
  const fullText = join(body.slice(iFull, iText));
  const textSeg = join(body.slice(iText, iAnswers));
  const answersSlice = body.slice(iAnswers, body.indexOf("],", iAnswers));
  const answers = segs(answersSlice);

  const gaps = [...textSeg.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));
  if (gaps.length !== 13) fail(`${label}: diktat.text — пропусков ${gaps.length}, нужно ровно 13`);
  if (!gaps.every((n, i) => n === i)) fail(`${label}: diktat.text — пропуски не по порядку {0}…{12}: ${gaps.join(",")}`);

  if (answers.length !== 13) fail(`${label}: diktat.answers — ответов ${answers.length}, нужно ровно 13`);
  const fullLow = fullText.toLowerCase();
  answers.forEach((a, i) => {
    if (!fullLow.includes(a.toLowerCase())) fail(`${label}: ответ #${i} («${a}») дословно не встречается в diktat.full`);
  });

  const wFull = words(fullText);
  if (wFull < 190 || wFull > 205) fail(`${label}: diktat.full — ${wFull} слов, нужно ~190–205`);
  const paragraphMarks = (body.slice(iFull, iText).match(/"\s*\+\s*"/g) ?? []).length;
  if (paragraphMarks !== 2) fail(`${label}: diktat.full — сегментов-абзацев через " + " должно быть 3 (2 стыка), найдено ${paragraphMarks + 1}`);

  // ---- mc
  const iIntro = body.indexOf("intro:");
  const iItems = body.indexOf("items:", iIntro);
  const iDialogs = body.indexOf("dialogs: [", iItems);
  if (iIntro < 0 || iItems < 0 || iDialogs < 0) {
    fail(`${label}: не найдены секции mc (intro/items) или dialogs`);
    continue;
  }
  const intro = join(body.slice(iIntro, iItems));
  const wIntro = words(intro);
  if (wIntro < 60 || wIntro > 90) fail(`${label}: mc.intro — ${wIntro} слов, нужно 60–90`);

  const itemsSlice = body.slice(iItems, iDialogs);
  const qCount = (itemsSlice.match(/\bq:\s*"/g) ?? []).length;
  if (qCount !== 6) fail(`${label}: mc.items — вопросов ${qCount}, нужно ровно 6`);
  checkOptions(itemsSlice, `${label} mc`);
  const mcCorrect = corrects(itemsSlice);
  if (mcCorrect.length !== 6) fail(`${label}: mc — полей correct ${mcCorrect.length}, нужно 6`);
  if (mcCorrect.some((c) => c !== 0 && c !== 1 && c !== 2)) fail(`${label}: mc — correct вне 0|1|2`);

  // ---- dialogs
  const dialogsSlice = body.slice(iDialogs);
  const titleMatches = [...dialogsSlice.matchAll(/title:\s*"Dialog/g)];
  if (titleMatches.length !== 3) fail(`${label}: dialogs — диалогов ${titleMatches.length}, нужно ровно 3`);
  const whoAll = [...body.matchAll(/who:\s*"([AB])"/g)].map((m) => m[1]);
  const whoBad = [...body.matchAll(/who:\s*"(?![AB]")[^"]*"/g)];
  if (whoBad.length) fail(`${label}: есть реплики с who вне {A,B}`);

  const chunks = dialogsSlice.split(/(?=title:\s*"Dialog)/).filter((c) => /title:\s*"Dialog/.test(c));
  chunks.forEach((c, i) => {
    const dq = (c.match(/\bq:\s*"/g) ?? []).length;
    if (dq !== 2) fail(`${label}: Dialog ${i + 1} — вопросов ${dq}, нужно ровно 2`);
    const lines = (c.match(/who:\s*"[AB]"/g) ?? []).length;
    if (lines < 6 || lines > 10) fail(`${label}: Dialog ${i + 1} — реплик ${lines}, нужно 6–10`);
    const speakers = new Set([...c.matchAll(/who:\s*"([AB])"/g)].map((m) => m[1]));
    if (speakers.size !== 2) fail(`${label}: Dialog ${i + 1} — должны говорить и A, и B`);
    const dc = corrects(c);
    if (dc.length !== 2 || dc.some((x) => x !== 0 && x !== 1 && x !== 2)) fail(`${label}: Dialog ${i + 1} — некорректные поля correct`);
    checkOptions(c, `${label} Dialog ${i + 1}`);
  });

  perFile[label] = { src, whoCount: whoAll.length, tail: src.slice(src.indexOf("export const HOER2")), wFull, wIntro };
}

/* -- кросс-проверки пары файлов ------------------------------------------ */

const labels = Object.keys(perFile);
if (labels.length === 2) {
  const [a, b] = labels;
  if (perFile[a].whoCount !== perFile[b].whoCount) {
    fail(`число вхождений who: различается: ${a}=${perFile[a].whoCount}, ${b}=${perFile[b].whoCount}`);
  }
  if (perFile[a].tail !== perFile[b].tail) {
    fail(`объект HOER2 (+валидация) различается между файлами`);
  }
  if (perFile[a].src.length !== perFile[b].src.length) {
    // длина может отличаться только из-за блока типов; хвост совпадает — ок,
    // но сообщим длины для сведения
    console.log(`info: длины файлов различаются (${a}: ${perFile[a].src.length}, ${b}: ${perFile[b].src.length}) — ожидаемо, у src-версии типы импортированы`);
  }
  // несколько контрольных подстрок в обоих файлах
  for (const probe of ["Stadtbücherei", "Tagesausflug des Wandervereins", "Zahnarztpraxis", "Mietwohnung", "neunhundertfünfzig"]) {
    if (!perFile[a].src.includes(probe) || !perFile[b].src.includes(probe)) fail(`контрольная подстрока «${probe}» отсутствует в одном из файлов`);
  }
}

/* -- отчёт --------------------------------------------------------------- */

for (const [label, info] of Object.entries(perFile)) {
  console.log(`${label}: diktat.full = ${info.wFull} слов, mc.intro = ${info.wIntro} слов, реплик who: = ${info.whoCount}`);
}
if (errors.length) {
  console.error(`\nПРОВАЛЕНO (${errors.length}):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log("\nALL OK");
