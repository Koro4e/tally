/* Проверка чистых функций разбора ответов и выражений без браузера.
   Запуск: node tools/check.test.mjs  (или npm test)
   Node 24 сам срезает TS-типы, поэтому модули импортируются как есть.
   Это фиксация ТЕКУЩЕГО поведения: спорные места помечены комментарием
   «СПОРНО» — если поведение поменяют, тест честно упадёт. */

import { toNum, isCorrect, unifyText, mmss } from "../src/lib/check.ts";
import { parseMath, hasFraction, unwrap } from "../src/lib/math.ts";

let bad = 0;
let total = 0;
const eq = (name, got, want) => {
  total++;
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) bad++;
  console.log(`${ok ? "OK  " : "FAIL"}  ${name}${ok ? "" : `  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`}`);
};
const near = (name, got, want) => {
  total++;
  const ok = Math.abs(got - want) < 1e-9;
  if (!ok) bad++;
  console.log(`${ok ? "OK  " : "FAIL"}  ${name}${ok ? "" : `  got=${got} want=${want}`}`);
};

/* --- check.ts: toNum ---------------------------------------------------- */

eq("дробь 3/4 → 0.75", toNum("3/4"), 0.75);
eq("десятичная запятая 3,5 → 3.5", toNum("3,5"), 3.5);
eq("десятичная точка 3.5 → 3.5", toNum("3.5"), 3.5);
eq("отрицательное -5 → -5", toNum("-5"), -5);
near("типографский минус −5/12", toNum("−5/12"), -5 / 12);
eq("запятая в начале 0,08 → 0.08", toNum("0,08"), 0.08);
eq("ведущий плюс +7 → 7", toNum("+7"), 7);
eq("пробелы игнорируются", toNum(" 3 / 4 "), 0.75);
eq("деление на ноль → null", toNum("1/0"), null);
eq("несколько ответов — не дело toNum → null", toNum("3/4; 1/2"), null);
eq("буквы → null", toNum("abc"), null);
eq("пустая строка → null", toNum(""), null);
eq("скобки не поддерживаются → null (СПОРНО: (3) мог бы стать 3)", toNum("(3)"), null);
eq("три значения через ; → null", toNum("1;2;3"), null);

/* --- check.ts: isCorrect ------------------------------------------------ */

eq("дробь против десятичной: 3/4 = 0.75", isCorrect("3/4", ["0.75"]), true);
eq("порядок нескольких ответов не важен", isCorrect("1/2; 3/4", ["0.75", "0.5"]), true);
eq("запятая принимается", isCorrect("3,5", ["3.5"]), true);
eq("меньше корней, чем ждём", isCorrect("1;2", ["1"]), false);
eq("больше корней, чем ждём", isCorrect("1", ["1", "2"]), false);
eq("перестановка 2;1 против 1;2", isCorrect("2;1", ["1", "2"]), true);

// ФИКС (04.11): нечисловая ветка была мёртвым кодом — гвардия длины отсекала
// её раньше строкового сравнения. Теперь текстовые ответы сравниваются.
eq("текст 'x' против ['x'] → true", isCorrect("x", ["x"]), true);
eq("регистр текста не важен: 'X' против ['x'] → true", isCorrect("X", ["x"]), true);
// СПОРНО: хвостовая «;» даёт пустую часть, она молча отфильтровывается.
eq("хвостовая ';' не мешает (СПОРНО)", isCorrect("1/2;", ["0.5"]), true);
// СПОРНО: нечисловая часть молча отбрасывается, ответ засчитывается.
eq("текстовая часть 'x' молча отбрасывается (СПОРНО)", isCorrect("1/2;x", ["0.5"]), true);
eq("скобки вокруг числа не проходят", isCorrect("(3)", ["3"]), false);
eq("строковая ветка: '3;4' против ['3','abc'] → false", isCorrect("3;4", ["3", "abc"]), false);

/* --- check.ts: mmss ----------------------------------------------------- */

eq("mmss(0)", mmss(0), "00:00");
eq("mmss(65)", mmss(65), "01:05");
eq("mmss(3600) — минуты не ограничены часом", mmss(3600), "60:00");
eq("mmss(3661)", mmss(3661), "61:01");

/* --- math.ts: parseMath ------------------------------------------------- */

/* маленький вычислитель дерева — чтобы проверять СМЫСЛ, а не только форму */
const evalTree = (n) => {
  switch (n.t) {
    case "num": return Number(n.v.replace(",", "."));
    case "neg": return -evalTree(n.x);
    case "par": return evalTree(n.x);
    case "fn": return evalTree(n.x);
    case "bin": {
      const [a, b] = [evalTree(n.l), evalTree(n.r)];
      return n.op === "+" ? a + b : n.op === "-" ? a - b : n.op === "*" ? a * b : n.op === "/" ? a / b : a ** b;
    }
    default: return NaN;
  }
};
const shape = (n) => {
  /* краткая сигнатура дерева: op-узлы с приоритетом, par и num */
  switch (n.t) {
    case "num": return `n(${n.v})`;
    case "id": return `id(${n.v})`;
    case "neg": return `neg(${shape(n.x)})`;
    case "par": return `(${shape(n.x)})`;
    case "fn": return `${n.name}(${shape(n.x)})`;
    case "bin": return `(${shape(n.l)}${n.op}${shape(n.r)})`;
  }
};

eq("2+2 — простое сложение", shape(parseMath("2+2")), "(n(2)+n(2))");
eq("приоритет: 2+3*4 — умножение внутри", shape(parseMath("2+3*4")), "(n(2)+(n(3)*n(4)))");
eq("скобки меняют порядок", shape(parseMath("(2+3)*4")), "(((n(2)+n(3)))*n(4))");

/* дроби-цепочки: 1/2/4 — лево-ассоц дерево, математически это 1/(2·4)=0.125 */
eq("цепочка 1/2/4 — лево-ассоциативно", shape(parseMath("1/2/4")), "((n(1)/n(2))/n(4))");
near("1/2/4 = 1/(2·4) = 0.125", evalTree(parseMath("1/2/4")), 0.125);
eq("1/2 - 3/4 — вычитание дробей, а не 1/(2-3/4)", shape(parseMath("1/2 - 3/4")), "((n(1)/n(2))-(n(3)/n(4)))");
near("1/2 - 3/4 = -0.25", evalTree(parseMath("1/2 - 3/4")), -0.25);

/* немецкое «:» — деление целых дробей, операнды оборачиваются в скобки */
eq("3/4 : 9/8 — двойная дробь со скобками", shape(parseMath("3/4 : 9/8")), "(((n(3)/n(4)))/((n(9)/n(8))))");
near("3/4 : 9/8 = 2/3", evalTree(parseMath("3/4 : 9/8")), 2 / 3);

/* степень право-ассоциативна, унарный минус слабее степени */
eq("2^3^2 — право-ассоциативно", shape(parseMath("2^3^2")), "(n(2)^(n(3)^n(2)))");
near("2^3^2 = 512", evalTree(parseMath("2^3^2")), 512);
eq("-2^2 — это -(2^2), а не (-2)^2", shape(parseMath("-2^2")), "neg((n(2)^n(2)))");
near("-2^2 = -4", evalTree(parseMath("-2^2")), -4);
eq("(-2)^3 — минус внутри скобок", shape(parseMath("(-2)^3")), "((neg(n(2)))^n(3))");
near("(-2)^3 = -8", evalTree(parseMath("(-2)^3")), -8);

/* неявное умножение */
eq("(−3)2 — неявное умножение", shape(parseMath("(−3)2")), "((neg(n(3)))*n(2))");
eq("2x — неявное умножение", shape(parseMath("2x")), "(n(2)*id(x))");
eq("3(x+1) — неявное умножение", shape(parseMath("3(x+1)")), "(n(3)*((id(x)+n(1))))");

/* функции */
eq("sqrt(16)", shape(parseMath("sqrt(16)")), "sqrt(n(16))");
eq("ln(e)", shape(parseMath("ln(e)")), "ln(id(e))");
eq("log(100)", shape(parseMath("log(100)")), "log(n(100))");
eq("log2(8) — основание в имени", shape(parseMath("log2(8)")), "log2(n(8))");
eq("√(9) со скобками — функция", shape(parseMath("√(9)")), "sqrt(n(9))");
// СПОРНО: √ без скобок парсится как неявное умножение sqrt·9, а не sqrt(9)
eq("√9 без скобок → sqrt*9 (СПОРНО)", shape(parseMath("√9")), "(id(sqrt)*n(9))");
eq("sin(x)", shape(parseMath("sin(x)")), "sin(id(x))");
eq("abs(-3)", shape(parseMath("abs(-3)")), "abs(neg(n(3)))");

/* прочее */
eq("десятичная запятая внутри выражения", shape(parseMath("1,5 + 2")), "(n(1,5)+n(2))");
eq("π нормализуется в pi", shape(parseMath("π")), "id(pi)");
eq("«Berechne: 5» — текст отсечён", parseMath("Berechne: 5"), null);
eq("просто число 5", shape(parseMath("5")), "n(5)");
eq("неоднокоренное слово → null", parseMath(" Hallo welt "), null);
eq("висячая операция → null", parseMath("2^"), null);
// СПОРНО: имя функции не проверяется по белому списку — foo(3) проходит
eq("неизвестная функция foo(3) проходит (СПОРНО)", shape(parseMath("foo(3)")), "foo(n(3))");
eq("· без левого операнда → null", parseMath("·5"), null);

/* --- math.ts: hasFraction / unwrap -------------------------------------- */

eq("hasFraction: 1/2 — есть дробь", hasFraction(parseMath("1/2")), true);
eq("hasFraction: 2+2 — дроби нет", hasFraction(parseMath("2+2")), false);
eq("hasFraction: дробь внутри скобок видна", hasFraction(parseMath("(1/2)+1")), true);
eq("unwrap снимает outer-скобки", shape(unwrap(parseMath("(1/2)"))), "(n(1)/n(2))");
eq("unwrap не трогает не-скобки", shape(unwrap(parseMath("1/2"))), "(n(1)/n(2))");

/* --- check.ts: нечисловые ответы (интервалы, «x = …») -------------------- */
/* хардкор-ответы с листа: мелочи записи не должны валить верное решение */

eq("unifyText: снимает «x = »", unifyText("x = 3,5"), "3.5");
eq("unifyText: снимает «L ∈ »", unifyText("L ∈ [2; 5)"), "[2;5)");
eq("unifyText: запятая → точка только в числах", unifyText("2,5; 3,5"), "2.5;3.5");
eq("unifyText: ≥ и ≤ в ASCII", unifyText("x ≥ 1,5"), "x>=1.5");
eq("isCorrect: интервал с пробелами и L=", isCorrect("L = [2; 5)", ["[2;5)"]), true);
eq("isCorrect: «x = 3,5» = числу 3.5 — префикс не мешает", isCorrect("x = 3,5", ["3.5"]), true);
eq("isCorrect: нечисловое — дословно с нормой", isCorrect("x ≥ 3,5", ["x≥3.5"]), true);
eq("isCorrect: разные скобки интервала — НЕ равны", isCorrect("(2;5)", ["[2;5)"]), false);

/* --- итог ---------------------------------------------------------------- */

console.log(total === 0 ? "\nнет проверок?!" : `\nпроверок: ${total}${bad === 0 ? ", все прошли" : `, ПРОВАЛОВ: ${bad}`}`);
process.exit(bad === 0 ? 0 : 1);
