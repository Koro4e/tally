/* ============================================================================
   ФУНКЦИЯ → ЧИСЛА
   ----------------------------------------------------------------------------
   Модель отдаёт функцию строкой в машинной записи ("0.5*x^2 - 2*x - 1.5").
   Чтобы нарисовать график, её надо посчитать в каждой точке — здесь только
   это: разбор через parseMath (он уже умеет неявное умножение, поэтому
   "0.5x^2 - 2x - 1.5" тоже работает) и вычисление с подстановкой x.

   Отдельно от math.ts, потому что math.ts — про вид формулы, а здесь про
   значения: ошибки не бросаем, а отдаём NaN, чтобы плоттер просто разорвал
   линию (разрыв, деление на ноль, корень из отрицательного).
   ========================================================================== */

import { parseMath, type MathNode } from "@/lib/math";

const FN: Record<string, (v: number) => number> = {
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  ln: Math.log,
  lg: Math.log10,
  log: Math.log10,
  log2: Math.log2,
  log10: Math.log10,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  exp: Math.exp,
};

function num(s: string): number {
  return Number(s.replace(",", "."));
}

function ev(n: MathNode, x: number): number {
  switch (n.t) {
    case "num":
      return num(n.v);

    case "id": {
      const v = n.v.toLowerCase();
      if (v === "x") return x;
      if (v === "e") return Math.E;
      if (v === "pi") return Math.PI;
      return NaN;
    }

    case "neg":
      return -ev(n.x, x);

    case "par":
      return ev(n.x, x);

    case "bin": {
      const a = ev(n.l, x);
      const b = ev(n.r, x);
      switch (n.op) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return a / b;
        case "^":
          return Math.pow(a, b);
      }
      return NaN;
    }

    case "fn": {
      const f = FN[n.name.replace(/[0-9]+$/, "")];
      return f ? f(ev(n.x, x)) : NaN;
    }
  }
}

/** null — строку не удалось разобрать как функцию от x */
export function compile(fn: string): ((x: number) => number) | null {
  const ast = parseMath(fn.replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=/i, ""));
  if (!ast) return null;
  return (x: number) => {
    try {
      const v = ev(ast, x);
      return Number.isFinite(v) ? v : NaN;
    } catch {
      return NaN;
    }
  };
}

/** Число → строка для подписи на оси: 2, 0,5, −1 */
export function fmt(v: number): string {
  const r = Math.round(v * 100) / 100;
  return String(r).replace("-", "\u2212").replace(".", ",");
}
