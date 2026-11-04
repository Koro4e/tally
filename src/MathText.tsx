import { Fragment, type ReactNode } from "react";
import { hasFraction, parseMath, type MathNode } from "@/lib/math";
import { cn } from "@/utils/cn";

/* ============================================================================
   МАТЕМАТИЧЕСКИЙ ТЕКСТ
   ----------------------------------------------------------------------------
   Два режима:

   MathText — проза: объяснение, решение, вопрос. Внутри текста живут формулы,
   поэтому здесь только `^` → верхний индекс и чистка остатков LaTeX.

   MathTerm — один терм целиком. Строка разбирается в дерево (src/lib/math.ts)
   и рисуется как в учебнике: деление — дробью с чертой, умножение — точкой,
   степень — верхним индексом, корень — с чертой над подкоренным.
   Если строка не является одним выражением (там есть слова), MathTerm честно
   отдаёт её обычному MathText и ничего не ломает.
   ========================================================================== */

function stripLatex(s: string): string {
  return s
    .replace(/\\\((.*?)\\\)/g, "$1")
    .replace(/\\\[(.*?)\\\]/g, "$1")
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)")
    .replace(/\\sqrt/g, "√")
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, ":")
    .replace(/\\log_\{?2\}?/g, "log₂")
    .replace(/\\log_\{?10\}?/g, "lg")
    .replace(/\\ln/g, "ln")
    .replace(/\\left|\\right/g, "")
    .replace(/\\[a-zA-Z]+/g, "")
    // 2^{7/3} → 2^(7/3): скобки важнее, чем сами фигурные скобки
    .replace(/\^\{([^{}]*)\}/g, "^($1)")
    .replace(/_\{([^{}]*)\}/g, "_$1")
    .replace(/[{}]/g, "")
    .replace(/\*\*/g, "^")
    // в прозе (объяснение, решение) звёздочка — это всегда умножение,
    // а дефис между числами — это минус, а не перенос
    .replace(/\*/g, "·")
    .replace(/([\d)(])-([\d(])/g, "$1\u2212$2");
}

/** Разбивает строку на текст, верхние и нижние индексы. */
function parse(src: string): { text: string; kind: "n" | "sup" | "sub" }[] {
  const s = stripLatex(src);
  const out: { text: string; kind: "n" | "sup" | "sub" }[] = [];
  let buf = "";

  const flush = () => {
    if (buf) out.push({ text: buf, kind: "n" });
    buf = "";
  };

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c !== "^" && c !== "_") {
      buf += c;
      continue;
    }
    const kind = c === "^" ? "sup" : "sub";
    let j = i + 1;
    let body = "";
    if (s[j] === "(") {
      let depth = 0;
      for (; j < s.length; j++) {
        if (s[j] === "(") depth++;
        if (s[j] === ")") {
          depth--;
          if (depth === 0) {
            body = s.slice(i + 2, j);
            j++;
            break;
          }
        }
      }
    } else {
      let k = j;
      while (k < s.length && /[0-9a-zA-Z.]/.test(s[k])) k++;
      body = s.slice(j, k);
      j = k;
    }
    if (!body) {
      buf += c;
      continue;
    }
    flush();
    out.push({ text: body, kind });
    i = j - 1;
  }
  flush();
  return out;
}

export default function MathText({ children }: { children: string }) {
  const parts = parse(children);
  return (
    <>
      {parts.map((p, i) =>
        p.kind === "sup" ? (
          <sup key={i} className="text-[0.62em] align-super">
            {p.text}
          </sup>
        ) : p.kind === "sub" ? (
          <sub key={i} className="text-[0.66em] align-sub">
            {p.text}
          </sub>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </>
  );
}

/* --------------------------------------------------------------- терм ---- */

/**
 * Верхний уровень суммы — список слагаемых со своими знаками. Нужен, чтобы
 * длинное выражение переносилось по слагаемым, а не рвалось посреди дроби.
 */
type Part = { sign: "" | "+" | "\u2212"; node: MathNode };

function addChain(n: MathNode): Part[] {
  if (n.t === "bin" && (n.op === "+" || n.op === "-")) {
    return [
      ...addChain(n.l),
      { sign: n.op === "+" ? "+" : "\u2212", node: n.r },
    ];
  }
  return [{ sign: "", node: n }];
}

/**
 * Тело терма. Если в сумме есть дробь — раскладываем слагаемые в строку с
 * переносом: высокая дробь тогда стоит отдельным блоком, а не распирает
 * строку текста. Иначе рисуем как обычный инлайн-терм.
 */
function TermBody({ n }: { n: MathNode }) {
  const parts = addChain(n);
  if (parts.length > 1 && parts.some((p) => hasFraction(p.node))) {
    return (
      <span className="inline-flex max-w-full flex-wrap items-center gap-x-[0.34em] gap-y-[0.2em]">
        {parts.map((p, i) => (
          <span key={i} className="inline-flex items-center">
            {p.sign && <span className="mr-[0.34em]">{p.sign}</span>}
            {render(p.node)}
          </span>
        ))}
      </span>
    );
  }
  return <>{render(n)}</>;
}


const SUB_DIGITS: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
};

function Ident({ v }: { v: string }) {
  // log₂(9) → log с настоящим нижним индексом
  const m = /^([a-zA-Z]+)([0-9₀-₉]+)$/.exec(v);
  if (!m) return <>{v}</>;
  const sub = [...m[2]].map((c) => SUB_DIGITS[c] ?? c).join("");
  return (
    <>
      {m[1]}
      <sub className="text-[0.62em] align-sub">{sub}</sub>
    </>
  );
}

/**
 * `a / b / c` — это одна дробь с числителем a и знаменателем b·c, а не три
 * этажа. Заодно раздаиваем умножение: `5/8 * 4/15` при равном приоритете
 * разбирается как `((5/8)·4)/15`, и без раздачи получается дробь внутри
 * дроби. Раздача даёт `(5·4)/(8·15)` — то же число, но читаемо.
 * Без этого выражение вида `(3³)·(−4)/2/5` вырастает в три этажа и рвёт
 * строку (баг из shots/36).
 */
function ratio(n: MathNode): { num: MathNode[]; den: MathNode[] } {
  const num: MathNode[] = [];
  const den: MathNode[] = [];
  /* Скобки вокруг целого числителя лишние: черта дроби уже группирует.
     Но скобки вокруг отрицательного числа — часть записи: `· (−4)`, а не
     `· −4`. Поэтому `neg` не разворачиваем. */
  const bare = (x: MathNode): MathNode =>
    x.t === "par" && x.x.t !== "neg" ? x.x : x;
  const walk = (x: MathNode) => {
    if (x.t === "bin" && (x.op === "*" || x.op === "/")) {
      walk(x.l);
      if (x.op === "/") den.push(bare(x.r));
      else num.push(bare(x.r));
      return;
    }
    num.push(bare(x));
  };
  walk(n);
  return { num, den };
}

function product(list: MathNode[]): MathNode {
  return list.reduce((l, r) => ({ t: "bin", op: "*", l, r }));
}

function render(n: MathNode): ReactNode {
  switch (n.t) {
    case "num":
      return n.v.replace(".", ",");

    case "id":
      return <Ident v={n.v} />;

    case "neg":
      return (
        <>
          {"\u2212"}
          {render(n.x)}
        </>
      );

    case "par": {
      const big = hasFraction(n.x);
      const size = big ? "2.15em" : "1.08em";
      return (
        <span className="inline-flex items-center">
          <span style={{ fontSize: size, lineHeight: 1 }}>(</span>
          <span className="px-[1px]">{render(n.x)}</span>
          <span style={{ fontSize: size, lineHeight: 1 }}>)</span>
        </span>
      );
    }

    case "fn": {
      if (n.name === "sqrt") {
        return (
          <span className="inline-flex items-start">
            <span className="pr-[1px]">√</span>
            {/* leading-none обязателен: с обычным line-height над цифрами
                остаётся полоса пустоты, и черта корня висит в воздухе. */}
            <span className="border-t border-current pt-[1px] leading-none">
              {render(n.x)}
            </span>
          </span>
        );
      }
      if (n.name === "abs") {
        return (
          <span className="inline-flex items-center">
            <span className="px-[1px]">|</span>
            {render(n.x)}
            <span className="px-[1px]">|</span>
          </span>
        );
      }
      return (
        <span className="inline-flex items-baseline">
          <Ident v={n.name} />
          <span className="px-[1px]">(</span>
          {render(n.x)}
          <span className="px-[1px]">)</span>
        </span>
      );
    }

    case "bin": {
      if (n.op === "/") {
        const { num, den } = ratio(n);
        const oben = num.length === 1 ? num[0] : product(num);
        const unten = den.length === 1 ? den[0] : product(den);
        /* Двойная дробь: главная черта должна быть заметно длиннее и толще
           внутренних, иначе 3/4 : 9/8 читается как четыре этажа подряд. */
        const dop = hasFraction(oben) || hasFraction(unten);
        return (
          <span className="mx-[3px] inline-flex flex-col items-center self-center">
            <span
              className={cn(
                "leading-[1.2] whitespace-nowrap",
                dop ? "px-2" : "px-1",
              )}
            >
              {render(oben)}
            </span>
            <span
              className={cn(
                "my-[2px] w-full bg-current",
                dop ? "h-[2.5px] min-w-[1.6em]" : "h-[1.5px] min-w-[1.1em]",
              )}
            />
            <span
              className={cn(
                "leading-[1.2] whitespace-nowrap",
                dop ? "px-2" : "px-1",
              )}
            >
              {render(unten)}
            </span>
          </span>
        );
      }
      if (n.op === "^") {
        return (
          <>
            {render(n.l)}
            <sup className="text-[0.6em] align-super">{render(n.r)}</sup>
          </>
        );
      }
      /* Слагаемые и множители рядом с дробью нельзя ставить на общую базовую
         линию: у высокой дроби базовая линия уезжает вниз, и `(20/5) − 2`
         читается как «−2 приклеено к низу скобки». Поэтому такие пары — это
         строка с выравниванием по центру, а не инлайн-текст. */
      const sep = n.op === "*" ? "·" : n.op === "+" ? "+" : "\u2212";
      if (hasFraction(n.l) || hasFraction(n.r)) {
        return (
          <span className="inline-flex items-center gap-x-[0.3em]">
            <span className="inline-flex items-center">{render(n.l)}</span>
            <span>{sep}</span>
            <span className="inline-flex items-center">{render(n.r)}</span>
          </span>
        );
      }
      return (
        <>
          {render(n.l)}
          {` ${sep} `}
          {render(n.r)}
        </>
      );
    }
  }
}

/**
 * Уравнение или неравенство — это два терма и знак отношения между ними.
 * Половина экзамена (Aufgabe 4) выглядит именно так, поэтому `x^2 - 12x + 35 = 0`
 * должно рисоваться термом слева и термом справа, а не падать в обычный текст.
 * Ищем первый знак отношения на нулевой глубине скобок.
 */
function splitRelation(s: string): [string, string, string] | null {
  const norm = s
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥")
    .replace(/!=/g, "≠")
    .replace(/\\le(q)?\b/g, "≤")
    .replace(/\\ge(q)?\b/g, "≥");

  let depth = 0;
  for (let i = 0; i < norm.length; i++) {
    const c = norm[i];
    if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) depth--;
    else if (depth === 0 && "=<>≤≥≠".includes(c)) {
      return [norm.slice(0, i), c, norm.slice(i + 1)];
    }
  }
  return null;
}

/** Один терм: настоящая дробь, точка вместо звёздочки, нормальные скобки. */
export function MathTerm({ children }: { children: string }) {
  const rel = splitRelation(children);
  if (rel) {
    const [l, op, r] = rel;
    const la = parseMath(l);
    const ra = parseMath(r);
    if (la && ra) {
      return (
        <span className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-[0.2em]">
          <span className="min-w-0">
            <TermBody n={la} />
          </span>
          <span>{op}</span>
          <span className="min-w-0">
            <TermBody n={ra} />
          </span>
        </span>
      );
    }
  }
  const ast = parseMath(children);
  if (!ast) return <MathText>{children}</MathText>;
  return <TermBody n={ast} />;
}

/**
 * Условие делится на инструкцию и терм. Модель по промпту пишет их двумя
 * строками; если всё же прислала одной — режем по последнему двоеточию,
 * но только когда справа действительно разбирается выражение.
 */
export function splitPrompt(src: string): { head: string[]; term: string } {
  const lines = src
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return { head: lines.slice(0, -1), term: lines[lines.length - 1] };
  }

  const one = lines[0] ?? "";
  /* Режем по двоеточию, которое стоит после слова: «Berechne: …». Двоеточие
     между числами — это знак деления, его трогать нельзя. */
  let i = -1;
  for (let k = one.length - 1; k > 0; k--) {
    if (one[k] === ":" && /[a-zA-ZäöüÄÖÜß]/.test(one[k - 1])) {
      i = k;
      break;
    }
  }
  if (i > 0 && i < one.length - 1) {
    const t = one.slice(i + 1).trim();
    if (parseMath(t) && /[()^*/+\-\u2212:]/.test(t)) {
      return { head: [one.slice(0, i + 1)], term: t };
    }
  }

  return { head: [], term: one };
}
