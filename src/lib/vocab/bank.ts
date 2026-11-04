/* ============================================================================
   СЛОВАРЬ — банк слов и расписание повторений
   ----------------------------------------------------------------------------
   Отдельно от грамматики: слова — это «узнал / не узнал», им нужна своя
   механика (узнавание → припоминание), а не раунд из шести упражнений.

   Расписание — Лейтнер: 6 коробок, интервалы 1/2/4/9/21/45 дней. Верный ответ
   двигает слово вверх, ошибка возвращает в первую коробку. Это не SM-2:
   индивидуальные коэффициенты на ~1600 слов не окупаются, а фиксированные
   интервалы предсказуемы и не требуют настроек.

   Дубли между уровнями вырезаются при загрузке: слово живёт на самом низком
   уровне, где встретилось, иначе повторение одного слова задавалось бы дважды.
   ========================================================================== */

import { WORDS_A1 } from "@/lib/vocab/words-a1";
import { WORDS_A2 } from "@/lib/vocab/words-a2";
import { WORDS_B1 } from "@/lib/vocab/words-b1";
import { WORDS_B2 } from "@/lib/vocab/words-b2";

export type Word = { de: string; ru: string; note?: string };
export type VLevel = "A1" | "A2" | "B1" | "B2";

const RAW: Record<VLevel, Word[]> = {
  A1: WORDS_A1,
  A2: WORDS_A2,
  B1: WORDS_B1,
  B2: WORDS_B2,
};

const seen = new Set<string>();
export const BANK: Record<VLevel, Word[]> = { A1: [], A2: [], B1: [], B2: [] };
for (const lv of ["A1", "A2", "B1", "B2"] as VLevel[]) {
  for (const w of RAW[lv]) {
    const k = w.de.trim().toLowerCase();
    if (!w.de || !w.ru || seen.has(k)) continue;
    seen.add(k);
    BANK[lv].push(w);
  }
}

/** ключ слова в хранилище */
export const keyOf = (w: Word): string => w.de.trim().toLowerCase();

/* ---- хранилище ---- */

export type VRec = { box: number; due: number; seen: number; ok: number };
export type VState = Record<string, VRec>;

const KEY = "tally.vocab.v1";
const DAY = 86_400_000;
/** интервалы коробок; ошибка всегда возвращает в коробку 0 (завтра) */
export const BOX_DAYS = [1, 2, 4, 9, 21, 45];
/** новых слов за один заход «Словаря дня» */
export const NEW_PER_DAY = 12;
/** размер быстрого повтора */
export const QUICK_REVIEWS = 10;

export function loadV(): VState {
  try {
    const raw = localStorage.getItem(KEY);
    const o = raw ? (JSON.parse(raw) as VState) : {};
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

export function saveV(s: VState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* приватный режим — словарь просто не сохраняется */
  }
}

/** закреплено: дошло до коробки с интервалом 9+ дней и не забыто */
export const isKnown = (r?: VRec): boolean => !!r && r.box >= 3;

export function boxOf(s: VState, w: Word): number {
  return s[keyOf(w)]?.box ?? -1;
}

export function statsV(lv: VLevel, s: VState): {
  known: number;
  learning: number;
  total: number;
  due: number;
  fresh: number;
} {
  let known = 0;
  let learning = 0;
  let due = 0;
  let fresh = 0;
  const now = Date.now();
  for (const w of BANK[lv]) {
    const r = s[keyOf(w)];
    if (!r) {
      fresh++;
      continue;
    }
    if (isKnown(r)) known++;
    else learning++;
    if (r.due <= now) due++;
  }
  return { known, learning, total: BANK[lv].length, due, fresh };
}

/** слова, которые пора повторять — старые просрочки первыми */
export function dueWords(lv: VLevel, s: VState, max = Infinity): Word[] {
  const now = Date.now();
  return BANK[lv]
    .filter((w) => {
      const r = s[keyOf(w)];
      return r && r.due <= now;
    })
    .sort((a, b) => (s[keyOf(a)]?.due ?? 0) - (s[keyOf(b)]?.due ?? 0))
    .slice(0, max);
}

/** новые слова — в порядке банка, сколько ещё не брали */
export function freshWords(lv: VLevel, s: VState, max: number): Word[] {
  return BANK[lv].filter((w) => !s[keyOf(w)]).slice(0, max);
}

/** итог упражнения: верно — коробка вверх, неверно — в первую */
export function recordV(s: VState, w: Word, ok: boolean): VState {
  const k = keyOf(w);
  const prev = s[k];
  const box = ok ? Math.min((prev?.box ?? -1) + 1, BOX_DAYS.length - 1) : 0;
  return {
    ...s,
    [k]: {
      box,
      due: Date.now() + BOX_DAYS[box] * DAY,
      seen: (prev?.seen ?? 0) + 1,
      ok: (prev?.ok ?? 0) + (ok ? 1 : 0),
    },
  };
}


/* ============================================================================
   СВОИ СЛОВА — из «не знаю» в Lesen и ручного ввода
   ----------------------------------------------------------------------------
   Отдельный список, не смешивается с банком уровней: у своих слов нет уровня,
   есть источник и время добавления. Расписание то же (tally.vocab.v1), вкладка
   «Meine» в словаре. Дубль внутри списка — по записи слова, как в банке.

   Перевод оффлайн-первый: сначала свои слова, потом банк всех уровней. Если
   нигде нет — слово добавляется с пустым переводом и пометкой «заполни»;
   перевод дописывается руками или через ИИ (ключ хранится только в браузере).
   ========================================================================== */

export type CustomWord = Word & { added: number };

const CUSTOM_KEY = "tally.vocab.custom.v1";
const CUSTOM_MAX = 500;

export function loadCustom(): CustomWord[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    const o = raw ? JSON.parse(raw) : [];
    return Array.isArray(o) ? o : [];
  } catch {
    return [];
  }
}

export function saveCustom(list: CustomWord[]): void {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(list.slice(0, CUSTOM_MAX)));
  } catch {
    /* приватный режим */
  }
}

export const customCount = (): number => loadCustom().length;

/** true — добавлено, false — уже было или пусто */
export function addCustomWord(w: Word): boolean {
  const k = w.de.trim().toLowerCase();
  if (!k) return false;
  const list = loadCustom();
  if (list.some((x) => x.de.trim().toLowerCase() === k)) return false;
  list.unshift({ de: w.de.trim(), ru: (w.ru ?? "").trim(), note: w.note, added: Date.now() });
  saveCustom(list);
  return true;
}

export function removeCustomWord(de: string): void {
  const k = de.trim().toLowerCase();
  saveCustom(loadCustom().filter((x) => x.de.trim().toLowerCase() !== k));
}

export function updateCustomWord(de: string, ru: string, note?: string): void {
  const k = de.trim().toLowerCase();
  saveCustom(
    loadCustom().map((x) =>
      x.de.trim().toLowerCase() === k ? { ...x, ru: ru.trim(), note: note ?? x.note } : x,
    ),
  );
}

/** поиск слова: свои → банк уровней снизу вверх */
export function lookupWord(raw: string): { word: Word; custom: boolean } | null {
  const k = raw.trim().toLowerCase();
  if (!k) return null;
  const c = loadCustom().find((x) => x.de.trim().toLowerCase() === k);
  if (c) return { word: c, custom: true };
  for (const lv of ["A1", "A2", "B1", "B2"] as VLevel[]) {
    const hit = BANK[lv].find((x) => x.de.trim().toLowerCase() === k);
    if (hit) return { word: hit, custom: false };
  }
  return null;
}

/**
 * Угадать артикль: словари → окончания (ung/heit/keit/schaft → die,
 * chen/lein/ment → das, ling/or/ismus → der). Это эвристика: она закрывает
 * большинство частотных существительных, но не претендует на истину —
 * в интерфейсе помечается «проверь».
 */
export function guessArticle(word: string): "der" | "die" | "das" | null {
  const w = word.trim().toLowerCase().replace(/^(der|die|das)\s+/, "");
  if (!w) return null;
  const own = lookupWord(w);
  if (own) {
    const m = /^(der|die|das)\s+/i.exec(own.word.de);
    if (m) return m[1].toLowerCase() as "der" | "die" | "das";
  }
  const rules: [RegExp, "der" | "die" | "das"][] = [
    [/ung$|heit$|keit$|schaft$|tion$|tät$|sion$|enz$|anz$|ei$|ik$/, "die"],
    [/chen$|lein$|ment$|um$|ma$/, "das"],
    [/ling$|or$|ismus$/, "der"],
  ];
  for (const [re, g] of rules) if (re.test(w)) return g;
  return null;
}

/** просроченные свои слова — старые первыми (без перевода в сессию не брать) */
export function customDue(s: VState, max = Infinity): Word[] {
  const now = Date.now();
  return loadCustom()
    .filter((w) => {
      const r = s[keyOf(w)];
      return w.ru?.trim() && r && r.due <= now;
    })
    .sort((a, b) => (s[keyOf(a)]?.due ?? 0) - (s[keyOf(b)]?.due ?? 0))
    .slice(0, max);
}

/** новые свои слова с переводом — для сессии */
export function customFresh(s: VState, max: number): Word[] {
  return loadCustom()
    .filter((w) => w.ru?.trim() && !s[keyOf(w)])
    .slice(0, max);
}
