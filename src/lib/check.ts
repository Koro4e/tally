/* ============================================================================
   ПРОВЕРКА ОТВЕТА (клиент)
   ----------------------------------------------------------------------------
   Сравнение числовое: дроби, десятичные с запятой, несколько корней через «;».
   Никакого eval — свой разбор.
   ========================================================================== */

const clean = (s: string) =>
  s
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/\s+/g, "")
    .replace(/^\+/, "");

/** "3", "−5/12", "0,08", "1.5" → число */
export function toNum(raw: string): number | null {
  const s = clean(raw).replace(",", ".");
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  const f = /^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/.exec(s);
  if (f) {
    const d = Number(f[2]);
    if (d === 0) return null;
    return Number(f[1]) / d;
  }
  return null;
}

/** Ответ верен, если множества чисел совпадают (порядок не важен). */
export function isCorrect(given: string, expected: string[]): boolean {
  /* нормализация ДО разбора: «x = 3,5» и «L ∈ [2; 5)» перестают быть
     «километровыми» — префикс переменной снимается, запятая становится
     точкой, ≥/≤ уходят в ASCII. Раньше нечисловая ветка была мёртвым
     кодом: гвардия длины отсекала её до сравнения текста. */
  const g = unifyText(given);
  const want = expected.map(toNum);
  if (want.some((w) => w === null)) {
    // нечисловой ожидаемый ответ (интервал, слово) — сравниваем текстом;
    // многочастный ожидаемый («a;b») тоже принимаем — как раньше
    return (
      expected.some((e) => unifyText(e) === g) ||
      unifyText(expected.join(";")) === g
    );
  }

  const parts = g
    .split(";")
    .map(toNum)
    .filter((n): n is number => n !== null);
  if (parts.length !== expected.length) return false;

  const a = [...parts].sort((x, y) => x - y);
  const b = (want as number[]).sort((x, y) => x - y);
  return a.every((v, i) => Math.abs(v - b[i]) < 1e-6);
}

/** Нечисловые ответы: «L = [2; 5)», «x ≥ 3,5» → «[2;5)», «x>=3.5»-норма. */
export function unifyText(raw: string): string {
  return clean(raw)
    .replace(/^[a-zA-Zа-яА-ЯёЁ]\s*(∈|=|:)\s*/, "")
    .replace(/,(\d)/g, ".$1")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .toLowerCase();
}

export const mmss = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
