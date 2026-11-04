/* ============================================================================
   ВЫРАЖЕНИЕ → ДЕРЕВО
   ----------------------------------------------------------------------------
   Модель отдаёт терм машинной записью: ((-2)^3 * (-3) - 6 * (-4)) / ((-2)^2 + (-7)).
   Показывать это человеку нельзя: звёздочка и слэш читаются как код.

   Здесь свой разбор без зависимостей. Приоритеты настоящие, поэтому
   1/2 - 3/4 — это (1/2) - (3/4), а не 1/(2-3/4): деление связывает крепче
   сложения. Неявное умножение тоже понимается: (−3)2 — это (−3)·2.

   Рисует не этот файл, а MathTerm в MathText.tsx — здесь только дерево.
   ========================================================================== */

export type MathNode =
  | { t: "num"; v: string }
  | { t: "id"; v: string }
  | { t: "bin"; op: "+" | "-" | "*" | "/" | "^"; l: MathNode; r: MathNode }
  | { t: "neg"; x: MathNode }
  | { t: "par"; x: MathNode }
  | { t: "fn"; name: string; x: MathNode };

const SUP: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁻": "-",
};

function normalize(src: string): string {
  return src
    .replace(/[−–—]/g, "-")
    .replace(/[·×]/g, "*")
    .replace(/÷/g, "/")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => `^${[...m].map((c) => SUP[c] ?? "").join("")}`)
    .replace(/√/g, " sqrt ")
    .replace(/π/g, " pi ")
    .replace(/\s+/g, " ")
    .trim();
}

type Tok = { k: "num" | "id" | "op" | "lp" | "rp"; v: string };

function lex(s: string): Tok[] | null {
  const out: Tok[] = [];
  let i = 0;

  while (i < s.length) {
    const c = s[i];

    if (c === " ") {
      i++;
      continue;
    }

    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9]/.test(s[j])) j++;
      // десятичная точка: 0.5 — модель пишет функции машинной записью
      if (s[j] === "." && /[0-9]/.test(s[j + 1] ?? "")) {
        j++;
        while (j < s.length && /[0-9]/.test(s[j])) j++;
      }
      // немецкая десятичная запятая: 1,5
      if (s[j] === "," && /[0-9]/.test(s[j + 1] ?? "")) {
        j++;
        while (j < s.length && /[0-9]/.test(s[j])) j++;
      }
      out.push({ k: "num", v: s.slice(i, j) });
      i = j;
      continue;
    }

    if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
      // log2 / log₁₀
      if (j < s.length && /[0-9₀-₉]/.test(s[j])) {
        while (j < s.length && /[0-9₀-₉]/.test(s[j])) j++;
      }
      out.push({ k: "id", v: s.slice(i, j) });
      i = j;
      continue;
    }

    if ("+-*/^:".includes(c)) {
      out.push({ k: "op", v: c });
      i++;
      continue;
    }

    if (c === "(") {
      out.push({ k: "lp", v: c });
      i++;
      continue;
    }

    if (c === ")") {
      out.push({ k: "rp", v: c });
      i++;
      continue;
    }

    return null;
  }

  return out;
}

/** null — строка не является одним выражением (значит это текст, не трогаем) */
export function parseMath(src: string): MathNode | null {
  const toks = lex(normalize(src));
  if (!toks || !toks.length) return null;

  let i = 0;
  let depth = 0;

  const peek = () => toks[i];

  function expr(): MathNode | null {
    let l = quot();
    if (!l) return null;
    for (;;) {
      const t = peek();
      if (t?.k === "op" && (t.v === "+" || t.v === "-")) {
        i++;
        const r = quot();
        if (!r) return null;
        l = { t: "bin", op: t.v as "+" | "-", l, r };
      } else return l;
    }
  }

  /* Двоеточие — это деление целых дробей, а не слэш: `3/4 : 9/8` означает
     (3/4) : (9/8), то есть двойную дробь, а не ((3/4)/9)/8. Поэтому у него
     свой уровень — ниже умножения, выше сложения. Операнды оборачиваются в
     скобки, чтобы MathText не склеил двойную дробь в одну длинную. */
  function quot(): MathNode | null {
    let l = term();
    if (!l) return null;
    for (;;) {
      const t = peek();
      if (t?.k === "op" && t.v === ":") {
        i++;
        const r = term();
        if (!r) return null;
        l = { t: "bin", op: "/", l: { t: "par", x: l }, r: { t: "par", x: r } };
      } else return l;
    }
  }

  function term(): MathNode | null {
    let l = unary();
    if (!l) return null;
    for (;;) {
      const t = peek();
      if (t?.k === "op" && (t.v === "*" || t.v === "/")) {
        i++;
        const r = unary();
        if (!r) return null;
        l = { t: "bin", op: t.v as "*" | "/", l, r };
      } else if (t && (t.k === "num" || t.k === "id" || t.k === "lp")) {
        // неявное умножение: (−3)2, 2x, 3(x+1)
        const r = unary();
        if (!r) return null;
        l = { t: "bin", op: "*", l, r };
      } else return l;
    }
  }

  function unary(): MathNode | null {
    const t = peek();
    if (t?.k === "op" && (t.v === "-" || t.v === "+")) {
      i++;
      const x = unary();
      if (!x) return null;
      return t.v === "-" ? { t: "neg", x } : x;
    }
    return power();
  }

  function power(): MathNode | null {
    const b = atom();
    if (!b) return null;
    const t = peek();
    if (t?.k === "op" && t.v === "^") {
      i++;
      const e = unary();
      if (!e) return null;
      return { t: "bin", op: "^", l: b, r: e };
    }
    return b;
  }

  function atom(): MathNode | null {
    if (++depth > 60) return null;
    const t = peek();
    if (!t) return null;

    if (t.k === "num") {
      i++;
      depth--;
      return { t: "num", v: t.v };
    }

    if (t.k === "lp") {
      i++;
      const x = expr();
      if (!x) return null;
      if (peek()?.k !== "rp") return null;
      i++;
      depth--;
      return { t: "par", x };
    }

    if (t.k === "id") {
      i++;
      const name = t.v.toLowerCase();
      if (peek()?.k === "lp") {
        i++;
        const x = expr();
        if (!x) return null;
        if (peek()?.k !== "rp") return null;
        i++;
        depth--;
        return { t: "fn", name, x };
      }
      depth--;
      return { t: "id", v: t.v };
    }

    return null;
  }

  const node = expr();
  if (!node || i !== toks.length) return null;
  // "Berechne: 5" разобралось бы как деление слова на число — отсекаем
  return onlyMathIdents(node) ? node : null;
}

/* Тот же набор имён, что понимает серверный verify.mjs. Если списки
   расходятся, задача проходит проверку на сервере, а график в браузере
   остаётся пустым: parseMath возвращает null и рисовать нечего. */
const FUNCS = new Set([
  "sqrt", "cbrt", "abs", "ln", "lg", "log", "log2", "log10",
  "pi", "e", "sin", "cos", "tan", "exp",
]);

function onlyMathIdents(n: MathNode): boolean {
  switch (n.t) {
    case "id": {
      if (n.v.length === 1) return true;
      const base = n.v.replace(/[0-9₀-₉]+$/, "").toLowerCase();
      return FUNCS.has(base);
    }
    case "num":
      return true;
    case "neg":
    case "par":
      return onlyMathIdents(n.x);
    case "fn":
      return onlyMathIdents(n.x);
    case "bin":
      return onlyMathIdents(n.l) && onlyMathIdents(n.r);
  }
}

/** есть ли в поддереве дробь — от этого зависит размер скобок */
export function hasFraction(n: MathNode): boolean {
  switch (n.t) {
    case "bin":
      return n.op === "/" || hasFraction(n.l) || hasFraction(n.r);
    case "neg":
      return hasFraction(n.x);
    case "par":
      return hasFraction(n.x);
    case "fn":
      return hasFraction(n.x);
    default:
      return false;
  }
}

/** скобки вокруг числителя/знаменателя дроби лишние */
export function unwrap(n: MathNode): MathNode {
  return n.t === "par" ? n.x : n;
}
