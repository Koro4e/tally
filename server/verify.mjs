/* ============================================================================
   ВЕРИФИКАТОР
   ----------------------------------------------------------------------------
   ИИ генерирует задачу и ответ. ИИ иногда ошибается в арифметике.
   Поэтому каждая задача проверяется детерминированно: выражение `expr`
   считается численно и сравнивается с `answer`.

   Никакого eval(). Свой токенизатор и рекурсивный спуск.
   Поддержка: + − · × ÷ : / ^ ( ) √ ∛ ² ³ ⁴ ln lg log log2 sqrt cbrt abs pi e
   ========================================================================== */

const SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };

function normalize(src) {
  let s = String(src);
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => "^(" + [...m].map((c) => SUP[c]).join("") + ")");
  s = s.replace(/[−–—]/g, "-");
  s = s.replace(/[·×∙]/g, "*");
  s = s.replace(/÷/g, "/");
  s = s.replace(/∶/g, ":");
  s = s.replace(/√/g, "sqrt");
  s = s.replace(/∛/g, "cbrt");
  s = s.replace(/(\d),(\d)/g, "$1.$2");
  s = s.replace(/\s+/g, "");
  return s;
}

function tokenize(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\d|\./.test(c)) {
      let j = i;
      while (j < s.length && /[\d.]/.test(s[j])) j++;
      out.push({ t: "num", v: parseFloat(s.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
      let word = s.slice(i, j);
      // log2 / log10 — цифра только у log
      if (word === "log") {
        let k = j;
        while (k < s.length && /\d/.test(s[k])) k++;
        if (k > j) {
          word = "log" + s.slice(j, k);
          j = k;
        }
      }
      if (word === "pi") out.push({ t: "num", v: Math.PI });
      else if (word === "e") out.push({ t: "num", v: Math.E });
      else out.push({ t: "fn", v: word });
      i = j;
      continue;
    }
    if ("+-*/^():".includes(c)) {
      out.push({ t: "op", v: c === ":" ? "/" : c });
      i++;
      continue;
    }
    throw new Error("bad char: " + c);
  }
  return out;
}

const FN = {
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  ln: Math.log,
  lg: Math.log10,
  log: Math.log10,
  log10: Math.log10,
  log2: Math.log2,
  abs: Math.abs,
  /* те же имена, что понимает parseMath в src/lib/math.ts: иначе сервер
     проверяет функцию, которую клиент не может нарисовать */
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  exp: Math.exp,
};

export function evalExpr(src, vars = {}) {
  const tk = tokenize(normalize(src));
  let p = 0;

  const peek = () => tk[p];
  const eat = (v) => {
    const x = tk[p];
    if (!x || x.v !== v) throw new Error("expected " + v);
    p++;
    return x;
  };

  function expr() {
    let v = term();
    while (peek() && peek().t === "op" && (peek().v === "+" || peek().v === "-")) {
      const op = tk[p++].v;
      const r = term();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }

  function term() {
    let v = unary();
    for (;;) {
      const t = peek();
      if (t && t.t === "op" && (t.v === "*" || t.v === "/")) {
        const op = tk[p++].v;
        const r = unary();
        v = op === "*" ? v * r : v / r;
        continue;
      }
      /* неявное умножение: 2x, 0.5x^2, 3(x+1), 2 sqrt(9).
         Нужно, чтобы сервер считал ту же функцию, которую клиент рисует
         (parseMath в src/lib/math.ts это умеет). Иначе проверенный ответ и
         нарисованный график могли бы разойтись. */
      if (t && (t.t === "num" || t.t === "fn" || t.v === "(")) {
        v = v * unary();
        continue;
      }
      return v;
    }
  }

  function unary() {
    if (peek() && peek().t === "op" && (peek().v === "-" || peek().v === "+")) {
      const op = tk[p++].v;
      const v = unary();
      return op === "-" ? -v : v;
    }
    return power();
  }

  function power() {
    const base = primary();
    if (peek() && peek().t === "op" && peek().v === "^") {
      p++;
      const ex = unary();
      return Math.pow(base, ex);
    }
    return base;
  }

  function primary() {
    const x = peek();
    if (!x) throw new Error("unexpected end");
    if (x.t === "num") {
      p++;
      return x.v;
    }
    if (x.t === "fn") {
      const name = x.v;
      /* переменная: та же лексема, что и имя функции, но без скобки после.
         Так `0.5x^2 - 2x - 1.5` считается при подстановке x. */
      if (Object.prototype.hasOwnProperty.call(vars, name) && tk[p + 1]?.v !== "(") {
        p++;
        return vars[name];
      }
      p++;
      if (name === "sqrt" || name === "cbrt") {
        // √(…) или √12
        if (peek() && peek().v === "(") {
          eat("(");
          const v = expr();
          eat(")");
          return FN[name](v);
        }
        return FN[name](unary());
      }
      eat("(");
      const v = expr();
      eat(")");
      if (!FN[name]) throw new Error("unknown fn " + name);
      return FN[name](v);
    }
    if (x.v === "(") {
      eat("(");
      const v = expr();
      eat(")");
      return v;
    }
    throw new Error("unexpected token " + JSON.stringify(x));
  }

  const v = expr();
  if (p !== tk.length) throw new Error("trailing tokens");
  if (!Number.isFinite(v)) throw new Error("not finite");
  return v;
}

/** Число из ответа: "3", "-5/12", "0,08" */
function num(s) {
  try {
    return evalExpr(s);
  } catch {
    return null;
  }
}

/**
 * Проверяет задачу от модели.
 * @returns {{ok:boolean, reason?:string, got?:number, want?:number}}
 */
export function verifyTask(task) {
  if (!task || typeof task.expr !== "string" || !task.expr.trim())
    return { ok: false, reason: "no expr" };

  let got;
  try {
    got = evalExpr(task.expr);
  } catch (e) {
    return { ok: false, reason: "expr unparsable: " + e.message };
  }

  const answers = Array.isArray(task.answer) ? task.answer : [task.answer];
  const wants = answers.map(num);
  if (wants.some((w) => w === null)) return { ok: false, reason: "answer unparsable" };

  const hit = wants.some((w) => Math.abs(w - got) < 1e-6);
  if (!hit) return { ok: false, reason: "mismatch", got, want: wants[0] };

  /* Слабая проверка: если `expr` — это просто число, совпадающее с ответом,
     то никакой арифметики мы на самом деле не проверили. Модель иногда так
     делает (и даже пишет `(4+5)-4` вместо честного выражения). Такую задачу
     не отбрасываем — ответ обычно верный, — но и «geprüft» на карточке
     писать не имеем права. */
  const bare = /^[-+]?\d+([.,]\d+)?$/.test(task.expr.trim());
  if (bare) return { ok: true, got, weak: true };

  return { ok: true, got };
}

/* ------------------------------------------------------------- график ----- */

/**
 * Проверка задачи с графиком. Здесь нельзя сверить `expr` с `answer`:
 * ответ надо прочитать с картинки. Зато можно сделать лучше — подставить
 * ответ в ту самую функцию, которую клиент нарисовал. Если f(2) не равно
 * ответу, значит либо график, либо ответ врут, и ученик увидел бы задачу
 * без правильного решения.
 *
 * @returns {{ok:boolean, reason?:string, got?:number, want?:number}}
 */
export function verifyPlot(task) {
  const plot = task?.plot;
  if (!plot || typeof plot.fn !== "string" || !plot.fn.trim())
    return { ok: false, reason: "no fn" };

  const { xmin, xmax, ymin, ymax } = plot;
  if (![xmin, xmax, ymin, ymax].every((v) => Number.isFinite(Number(v))))
    return { ok: false, reason: "bad window" };
  if (!(xmax > xmin) || !(ymax > ymin)) return { ok: false, reason: "bad window" };

  const f = (x) => {
    try {
      return evalExpr(plot.fn, { x });
    } catch {
      return NaN;
    }
  };

  // график должен быть ВИДЕН в окне, иначе ученик смотрит на пустое поле
  let inside = 0;
  for (let i = 0; i <= 60; i++) {
    const y = f(xmin + ((xmax - xmin) * i) / 60);
    if (Number.isFinite(y) && y >= ymin && y <= ymax) inside++;
  }
  if (inside < 6) return { ok: false, reason: "Graph nicht im Fenster" };

  const answers = (Array.isArray(task.answer) ? task.answer : [task.answer]).map(num);
  if (!answers.length || answers.some((a) => a === null))
    return { ok: false, reason: "answer unparsable" };
  const want = answers[0];
  const near = (u, v) => Math.abs(u - v) < 1e-6;
  const kind = String(plot.kind ?? "wert");

  if (kind === "wert" || kind === "achse") {
    const at = kind === "achse" ? 0 : Number(plot.at);
    if (!Number.isFinite(at)) return { ok: false, reason: "no at" };
    const got = f(at);
    if (!Number.isFinite(got)) return { ok: false, reason: "fn an der Stelle nicht definiert" };
    if (!near(got, want)) return { ok: false, reason: "wert mismatch", got, want };
    return { ok: true, got };
  }

  if (kind === "nullstelle") {
    if (want < xmin || want > xmax) return { ok: false, reason: "Nullstelle außerhalb" };
    const got = f(want);
    if (!Number.isFinite(got) || Math.abs(got) > 1e-6)
      return { ok: false, reason: "keine Nullstelle", got };
    return { ok: true, got: 0 };
  }

  if (kind === "steigung") {
    const span = Array.isArray(plot.span) ? plot.span.map(Number) : [];
    if (span.length !== 2 || !span.every(Number.isFinite) || span[0] === span[1])
      return { ok: false, reason: "bad span" };
    const [u, v] = span;
    const fu = f(u);
    const fv = f(v);
    if (!Number.isFinite(fu) || !Number.isFinite(fv))
      return { ok: false, reason: "fn im Intervall nicht definiert" };
    const got = (fv - fu) / (v - u);
    if (!near(got, want)) return { ok: false, reason: "slope mismatch", got, want };
    return { ok: true, got };
  }

  return { ok: false, reason: "unknown kind " + kind };
}

/* --------------------------------------------------------------- самопроверка */
if (process.argv[1] && process.argv[1].endsWith("verify.mjs")) {
  const cases = [
    ["log10(8)+log10(125)", "3", true],
    ["1/3-3/4", "-5/12", true],
    ["sqrt(0.25)*sqrt(0.0256)", "0.08", true],
    ["2^3*2^4/2^5", "4", true],
    ["(-4)*(-6)", "24", true],
    ["(-2)^3-(-3)^2", "-17", true],
    ["120/((32+8)*(32-8))", "1/8", true],
    ["3/8/(9/16)", "2/3", true],
    ["√0,25·√0,0256", "0,08", true],
    ["2·ln(e^3)", "6", true],
    ["17^2", "289", true],
    ["lg(1000)", "3", true],
    ["1/3-3/4", "5/12", false],
    ["sqrt(-1)", "1", false],
  ];
  let pass = 0;
  for (const [expr, answer, want] of cases) {
    const r = verifyTask({ expr, answer });
    const ok = r.ok === want;
    if (ok) pass++;
    console.log(`${ok ? "OK  " : "FAIL"}  ${expr} = ${answer}  -> ${JSON.stringify(r)}`);
  }
  console.log(`\n${pass}/${cases.length} passed`);

  /* график: ответ подставляется в ту же функцию, что нарисована */
  const plots = [
    [{ fn: "0.5*x^2 - 2*x - 1.5", xmin: -3, xmax: 7, ymin: -6, ymax: 8, kind: "wert", at: 2 }, "-3.5", true],
    [{ fn: "0.5x^2 - 2x - 1.5", xmin: -3, xmax: 7, ymin: -6, ymax: 8, kind: "wert", at: 2 }, "-3.5", true],
    [{ fn: "0.5*x^2 - 2*x - 1.5", xmin: -3, xmax: 7, ymin: -6, ymax: 8, kind: "wert", at: 2 }, "3.5", false],
    [{ fn: "2*x + 1", xmin: -4, xmax: 4, ymin: -6, ymax: 8, kind: "steigung", span: [-2, 2] }, "2", true],
    [{ fn: "2*x + 1", xmin: -4, xmax: 4, ymin: -6, ymax: 8, kind: "steigung", span: [-2, 2] }, "1", false],
    [{ fn: "x^2 - 4", xmin: -4, xmax: 4, ymin: -6, ymax: 8, kind: "nullstelle" }, "2", true],
    [{ fn: "x^2 - 4", xmin: -4, xmax: 4, ymin: -6, ymax: 8, kind: "nullstelle" }, "3", false],
    [{ fn: "x^2 - 4", xmin: -4, xmax: 4, ymin: -6, ymax: 8, kind: "achse" }, "-4", true],
    [{ fn: "x^2 + 100", xmin: -3, xmax: 3, ymin: -6, ymax: 8, kind: "wert", at: 2 }, "104", false],
  ];
  let pp = 0;
  for (const [plot, answer, want] of plots) {
    const r = verifyPlot({ plot, answer });
    const ok = r.ok === want;
    if (ok) pp++;
    console.log(`${ok ? "OK  " : "FAIL"}  plot ${plot.kind} ${plot.fn} = ${answer} -> ${JSON.stringify(r)}`);
  }
  console.log(`${pp}/${plots.length} plot passed`);
}
