/* ============================================================================
   TALLY SERVER
   ----------------------------------------------------------------------------
   Один процесс, без зависимостей. Держит ключ, генерирует задачи через IFM,
   проверяет их детерминированно и стримит объяснения.

   Запуск: node server/index.mjs
   ========================================================================== */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyTask, verifyPlot } from "./verify.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------------ env --- */
const env = {};
try {
  const raw = await readFile(join(ROOT, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* .env.local не обязателен, если переменные заданы снаружи */
}

const API_KEY = process.env.IFM_API_KEY || env.IFM_API_KEY;
const BASE = process.env.IFM_BASE_URL || env.IFM_BASE_URL || "https://api.ifm.ai/v1";
const MODEL = process.env.IFM_MODEL || env.IFM_MODEL || "IFM/K2-Horizon-375B-A23B";
const PORT = Number(process.env.PORT || env.PORT || 8787);
/* хост: локально 127.0.0.1; на хостинге (HF/Render/Vercel-контейнер) HOST=0.0.0.0 */
const HOST = process.env.HOST || env.HOST || "127.0.0.1";

/* ------------------------------------------------------------- провайдеры --
   Замер на настоящем промпте (не «привет»), три темы, один и тот же запрос:

     IFM K2-Horizon    13–21 с   верно
     Groq gpt-oss-120b  2,3–2,7 с верно   ← в 6–8 раз быстрее
     Zen (любая модель) 402 Insufficient funds — аккаунт пустой

   Поэтому Groq первый, IFM — резерв. У Groq на бесплатном тарифе жёсткий
   rate limit: третий запрос подряд уже 429. Без резерва это выглядело бы
   как «приложение сломалось через минуту». С резервом — как «иногда чуть
   медленнее». Ровно то, что нужно: скорость, когда она есть, и надёжность
   всегда.

   Пауза после 429 (20 с) нужна, чтобы не тратить по лишнему round-trip на
   каждый запрос, пока лимит ещё не отпустил.
   -------------------------------------------------------------------------- */

const GROQ_BASE = process.env.GROQ_BASE_URL || env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
/* Kiosapi — только «глаза» для фото→OCR (nemotron-3.5-super-vl: распознал
   печатный/наклонённый/зашумлённый пример символ в символ за 3–4 с).
   Текстовые модели kiosapi тест не прошли (мат-ошибка в задаче, 2 req/min) —
   генерация остаётся на Groq/IFM. Cloudflare режет клиенты без браузерного
   User-Agent (код 1010) — поэтому UA в заголовках обязателен. */
const KIOSAPI_KEY = process.env.KIOSAPI_KEY || env.KIOSAPI_KEY;
const KIOSAPI_BASE = process.env.KIOSAPI_BASE || env.KIOSAPI_BASE || "https://kiosapi.com/v1";
const VISION_MODEL = process.env.KIOSAPI_VISION_MODEL || env.KIOSAPI_VISION_MODEL || "nemotron-3.5-super-vl";
/* Несколько ключей — только если они из РАЗНЫХ аккаунтов. Лимит Groq считается
   на организацию, поэтому три ключа одного аккаунта делят один счётчик и не
   дают ничего. Разные аккаунты × разные модели = независимые счётчики. */
const GROQ_KEYS = (
  process.env.GROQ_KEYS ||
  env.GROQ_KEYS ||
  process.env.GROQ_API_KEY ||
  env.GROQ_API_KEY ||
  ""
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const GROQ_MODELS = (
  process.env.GROQ_MODELS ||
  env.GROQ_MODELS ||
  "openai/gpt-oss-120b,qwen/qwen3.8-27b"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const PROVIDERS = [
  /* ключ × модель: каждая пара — отдельный счётчик и отдельный cooldown */
  ...GROQ_KEYS.flatMap((key, ki) =>
    GROQ_MODELS.map((m) => ({
      name: `groq:${ki}:${m}`,
      base: GROQ_BASE,
      key,
      model: m,
      json: true,
      /* Бюджет Groq = запрошенный maxTokens минус запас, а не плоский
         потолок. Прежний cap 3000 резал поздние попытки (8000/10000):
         дорогой узел трижды жёг квоту Groq на обрезанных запросах, прежде
         чем упасть на IFM. Первая попытка (6000) по-прежнему дешёвая —
         в удачных прогонах ответу хватает ~1800 токенов. */
      capFor: (mt) => Math.max(2000, mt - 3000),
    })),
  ),
  { name: "ifm", base: BASE, key: API_KEY, model: MODEL, json: true, reason: true },
];

/** до какого времени провайдер молчит после 429 */
const downUntil = new Map();

/* "" = thinking выключен. По умолчанию выключен: генерация задачи не требует
   рассуждений на 60 секунд, а ученик ждёт. Качество держит верификатор. */
/* ВАЖНО, замерено на этой модели. `reasoning_effort` управляет не «сколько
   думать», а КУДА деваются рассуждения:
   - параметр не отправлен → рассуждения идут в скрытый канал
     (`reasoning_tokens`), а `content` содержит чистый JSON;
   - `"low"` → рассуждения утекают в `content` английским текстом
     («We need answer JSON only…»), JSON либо обрывается, либо не появляется;
   - `"none"` / `"minimal"` → 400.
   Поэтому по умолчанию параметр НЕ отправляется. `TALLY_REASON=low`
   остаётся как аварийный рычаг, если понадобится обратное. */
const REASON = (process.env.TALLY_REASON ?? env.TALLY_REASON ?? "").trim() || undefined;

/* IFM — резерв после Groq, а не фундамент: если ключа нет или он протух,
   сервер обязан стартовать на Groq. Без Groq И без IFM работать нечем. */
if (!API_KEY && PROVIDERS.filter((p) => p.name.startsWith("groq:")).length === 0) {
  console.error("нет ни IFM_API_KEY, ни GROQ_KEYS — положи их в .env.local");
  process.exit(1);
}
if (!API_KEY) console.warn("[warn] IFM_API_KEY отсутствует — работаю только на Groq");

/* -------------------------------------------------------------- промпты --- */

const SYSTEM_MATHE = `Du bist Prüfer für den Aufnahmetest Mathematik am Studienkolleg Schleswig-Holstein (HAW Kiel).
Der Test dauert 60 Minuten, hat ca. 20 Punkte, und es ist KEIN Taschenrechner erlaubt.

Du erzeugst GENAU EINE Aufgabe zum vorgegebenen Thema.

HARTE REGELN
1. Das Ergebnis ist IMMER eine Zahl. Kein Term, keine Variable im Ergebnis.
2. Ohne Taschenrechner lösbar: kleine ganze Zahlen, glatte Brüche, glatte Wurzeln, glatte Logarithmen.
   Das Ergebnis ist EXAKT, nicht gerundet. Eine Aufgabe, deren Lösung nur als
   Dezimalzahl wie 3,2920… existiert, ist ungeeignet — solche Aufgaben werden
   vom Prüfer abgelehnt.
3. Niveau: Aufnahmetest, nicht Universität. Aber ruhig zwei Gesetze in einer Aufgabe kombinieren.
4. Alles auf Deutsch. Keine Emojis, keine Floskeln, keine Einleitung.
5. "expr" ist dieselbe Rechnung in Maschinensyntax — nur Ziffern und:
   + - * / ^ ( ) sqrt() cbrt() ln() lg() log2()
   "expr" MUSS exakt denselben Wert haben wie "answer".
6. "solution": 2 bis 4 Zeilen, deutsch, nur die entscheidenden Schritte.
7. "par": realistische Zeit in Sekunden für einen geübten Schüler.
8. Die Aufgabe prüft GENAU das genannte Thema. Keine Aufgaben aus Nachbarthemen:
   bei "Vorzeichen" geht es um Vorzeichenregeln (+/−, Produkt zweier negativer
   Zahlen), nicht um Ungleichungen oder Gleichungen.
9. "prompt" besteht aus genau ZWEI Zeilen, getrennt durch \n:
   Zeile 1 = kurze Anweisung auf Deutsch, OHNE die Rechnung selbst. Bei
   Gleichungen und Ungleichungen steht dort nur, was gefragt ist.
   Zeile 2 = NUR das mathematische Objekt, vollständig: Term, Gleichung oder
   Ungleichung. Bei Gleichungen MIT "= 0", bei Ungleichungen MIT "<" oder ">".
   Das Objekt darf NICHT zusätzlich in Zeile 1 stehen. Kein Punkt am Ende,
   keine Anführungszeichen.
   Beispiel Term: {"prompt":"Berechne den Wert des Terms:\n((-2)^3 * (-3) - 6 * (-4)) / ((-2)^2 + (-7))"}
   Beispiel Gleichung: {"prompt":"Löse die Gleichung. Gib die größere Lösung an:\nx^2 - 12x + 35 = 0"}
   Beispiel Ungleichung: {"prompt":"Löse die Ungleichung. Gib die kleinere Grenze an:\n-3x^2 + 9x < 2x - 6"}
10. Die Beispiele im Auftrag zeigen die FORM. Übernimm die Form, aber erfinde
   andere Zahlen. Eine Aufgabe, die einen Beispielterm wörtlich wiederholt,
   ist ungültig.
11. Verlangt das Formbeispiel eine bestimmte Antwortform ("Gib die größere
   Lösung an", "Gib die Summe der Lösungen an", "Gib die Anzahl an"), dann
   frage genauso. Die Antwort bleibt trotzdem eine Zahl.
12. Wenn in der Aufgabe eine Variable vorkommt, gib im Prompt feste Werte für
   sie an (z. B. "für x = 3"), damit das Ergebnis eine Zahl ist.

Antworte NUR mit JSON, ohne Markdown:
{"prompt":"...","expr":"...","answer":"...","solution":"...","par":45}`;

const SYSTEM_DEUTSCH = `Du bist Prüfer für den Aufnahmetest Deutsch am Studienkolleg Schleswig-Holstein (HAW Kiel).
Du erzeugst GENAU EINE Aufgabe zum vorgegebenen Thema.

HARTE REGELN
1. Alles auf Deutsch, Niveau B1/B2.
2. Eine eindeutige, kurze richtige Antwort.
3. "expr" ist immer null.
4. "solution": 2 bis 4 Zeilen, deutsch, nur die Begründung.
5. "par": realistische Zeit in Sekunden.

Antworte NUR mit JSON, ohne Markdown:
{"prompt":"...","expr":null,"answer":"...","solution":"...","par":30}`;

/* Задача с графиком — отдельный системный промпт, а не «SYSTEM_MATHE плюс
   добавка». Причина: правило 9 требует «prompt aus genau ZWEI Zeilen»,
   а PLOT_HINT — «EINE Zeile, keine Gleichung». Модель видит противоречие,
   начинает его разрешать вслух («Per rule 9 ... but for plot tasks ...»),
   потом зацикливается на «Need final.» и упирается в max_tokens. В логе это
   выглядело как «нет JSON (finish=length)» на 5–8 КБ текста.
   Здесь правило про две строки просто не существует, поэтому и спорить не с
   чем. Формулировки те же, что в SYSTEM_MATHE, — чтобы качество не поехало. */
const SYSTEM_MATHE_PLOT = `Du bist Prüfer für den Aufnahmetest Mathematik am Studienkolleg Schleswig-Holstein (HAW Kiel).
Der Test dauert 60 Minuten, ca. 20 Punkte, KEIN Taschenrechner.
Du erzeugst GENAU EINE Aufgabe, in der der Schüler einen GRAPHEN abliest.

REGELN
1. Das Ergebnis ist IMMER eine Zahl. Kein Term, keine Variable.
2. Ohne Taschenrechner lösbar: kleine ganze Zahlen, glatte Brüche, glatte Wurzeln.
3. Niveau: Aufnahmetest, nicht Universität.
4. Alles auf Deutsch. Keine Emojis, keine Einleitung.
5. "prompt" ist GENAU EINE Zeile: nur die Frage. Keine Gleichung, kein Term,
   keine zweite Zeile. Beispiel: "Lies den y-Achsenabschnitt ab."
6. "answer" ist die Zahl, die man aus dem Graphen abliest. Sie MUSS zu "fn"
   passen — der Prüfer setzt deine Antwort in deine Funktion ein.
7. "solution": 2 bis 3 Zeilen, deutsch, höchstens 200 Zeichen.
8. "par": realistische Zeit in Sekunden für einen geübten Schüler.
9. Kein "expr".

Antworte direkt mit dem JSON. Keine Erklärung davor oder danach, keine
Wiederholung.

Antworte NUR mit JSON, ohne Markdown:
{"prompt":"Lies den Funktionswert an der Stelle x = 1 ab.","plot":{"fn":"x^2 - 4*x + 1","xmin":-1,"xmax":5,"ymin":-4,"ymax":6,"kind":"wert","at":1},"answer":"-2","solution":"...","par":40}`;

/* ------------------------------------------------------------------ IFM --- */

/** счётчик для равномерного распределения по моделям Groq */
let rr = 0;

/* ------------------------------------------------------------------ очередь --
   Замер: 6 параллельных задач проходят за 3,7 с, а 15 за минуту — упираются
   в лимит и получают 429 от всех провайдеров сразу. Причина не в лимите,
   а в том, что мы бьём в него залпом.

   Очередь на 3 одновременных запроса: 3 ключа × 2 модели — это 6 счётчиков,
   и три потока их не выбивают. Задачи всё равно приходят за секунды, потому
   что сама модель отвечает за 0,5–2 с.
   -------------------------------------------------------------------------- */

const LIMIT = 3;
const sem = { active: 0, q: [] };

const acquire = () =>
  new Promise((res) => {
    if (sem.active < LIMIT) {
      sem.active++;
      res();
    } else {
      sem.q.push(res);
    }
  });

const release = () => {
  const next = sem.q.shift();
  if (next) next(); // слот переходит следующему, active не меняется
  else sem.active--;
};

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function callModel(opts) {
  await acquire();
  try {
    return await chain(opts, 0);
  } finally {
    release();
  }
}

async function chain(
  { system, user, maxTokens = 2600, stream = false, temperature = 0.75, reasoningEffort, prefer },
  depth,
) {
  let lastErr = null;

  /* Порядок: сначала Groq, начиная с другой модели на каждом вызове (чтобы
     не выбивать лимит одной и той же), потом IFM. Ротация на единицу, а не
     случайность: при параллельной сборке экзамена воркеры должны разойтись
     по разным счётчикам, а не столкнуться на одной модели.

     Исключение — задачи с графиком (`prefer: "ifm"`). Замер: Groq три
     попытки подряд отдал не ту форму графика ("achse statt wert") и задачу
     пришлось выбросить, а K2 такие задачи делал стабильно. Там, где важна
     структура ответа, а не скорость, первым идёт IFM. */
  const groqs = PROVIDERS.filter((p) => p.name.startsWith("groq:"));
  const rest = PROVIDERS.filter((p) => !p.name.startsWith("groq:"));
  const k = groqs.length ? rr++ % groqs.length : 0;
  const groqOrder = [...groqs.slice(k), ...groqs.slice(0, k)];
  const order = prefer === "ifm" ? [...rest, ...groqOrder] : [...groqOrder, ...rest];

  for (const p of order) {
    if ((downUntil.get(p.name) ?? 0) > Date.now()) continue;

    try {
      const r = await fetch(`${p.base}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${p.key}`,
          "Content-Type": "application/json",
        },
        /* Таймаут обязателен. Без него запрос, на который провайдер принял
           соединение и не ответил (типично для 429 на уровне шлюза), висит
           бесконечно и ДЕРЖИТ СЛОТ ОЧЕРЕДИ. Три таких — и весь сервер встал:
           в логе после этого просто ничего нет, а клиент показывает «3/7».
           Ровно это и наблюдалось. */
        signal: AbortSignal.timeout(stream ? 120_000 : 40_000),
        body: JSON.stringify({
          model: p.model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature,
          max_tokens: p.capFor ? Math.min(maxTokens, p.capFor(maxTokens)) : maxTokens,
          stream,
          /* reasoning_effort — параметр IFM, и его семантика там вывернута
             (см. комментарий у REASON). Groq про него ничего не знает,
             поэтому отправляем только тому, кто его понимает. */
          ...(p.reason && reasoningEffort ? { reasoning_effort: reasoningEffort } : {}),
          ...(stream ? {} : { response_format: { type: "json_object" } }),
        }),
      });

      if (r.status === 429 || r.status >= 500) {
        const t = await r.text();
        lastErr = new Error(`${p.name} ${r.status}: ${t.slice(0, 160)}`);
        downUntil.set(p.name, Date.now() + 20_000);
        console.warn(`[model] ${p.name} отказал (${r.status}), переключаюсь`);
        continue;
      }

      if (!r.ok) {
        const t = await r.text();
        throw new Error(`${p.name} ${r.status}: ${t.slice(0, 300)}`);
      }

      /* какой провайдер ответил — в лог и в задачу: без этого «стало
         медленнее» невозможно объяснить */
      r.provider = p.name;
      return r;
    } catch (e) {
      lastErr = e;
      downUntil.set(p.name, Date.now() + 20_000);
    }
  }

  /* Все в кулдауне — это не повод отдавать 500. Ждём, пока освободится
     самый ранний, и пробуем ещё раз: лимит у Groq поминутный, 2 секунды
     ожидания возвращают половину бюджета. */
  const times = [...downUntil.values()].filter((t) => t > Date.now());
  if (depth < 2 && times.length) {
    await sleep(Math.min(2500, Math.max(400, Math.min(...times) - Date.now())));
    return chain({ system, user, maxTokens, stream, temperature, reasoningEffort, prefer }, depth + 1);
  }

  throw lastErr ?? new Error("нет доступного провайдера");
}

function parseJsonLoose(text) {
  if (!text) return null;
  const s = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(s);
  } catch {
    /* модель иногда болтает до/после JSON или повторяет объект дважды */
  }

  // первый СБАЛАНСИРОВАННЫЙ объект, а не от первой скобки до последней:
  // иначе два подряд JSON-объекта склеиваются в один невалидный
  const start = s.indexOf("{");
  if (start < 0) return null;

  let depth = 0;
  let inStr = false;
  let esc = false;

  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(s.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

/* --------------------------------------------------------------- график --- */

/* Модель отдаёт функцию и окно; клиент рисует (src/Graph.tsx), сервер потом
   проверяет ответ подстановкой в ЭТУ ЖЕ функцию. Поэтому числа приводим к
   числу, а не к строке — иначе "xmax": "7" тихо превратит окно в пустое. */
function normalizePlot(p) {
  const n = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const out = {
    fn: String(p?.fn ?? "").trim(),
    xmin: n(p?.xmin, -5),
    xmax: n(p?.xmax, 5),
    ymin: n(p?.ymin, -5),
    ymax: n(p?.ymax, 5),
    kind: ["wert", "achse", "nullstelle", "steigung"].includes(p?.kind) ? p.kind : "wert",
  };
  if (p?.at != null) out.at = n(p.at, 0);
  if (Array.isArray(p?.span)) out.span = p.span.slice(0, 2).map(Number);
  if (Array.isArray(p?.marks)) {
    out.marks = p.marks
      .filter((a) => Array.isArray(a) && a.length === 2)
      .map(([x, y]) => [Number(x), Number(y)]);
  }
  return out;
}

/* Только то, чего нет в системном промпте: семантика "kind" и схема "plot".
   Дублировать правила больше нельзя — дубль и был источником противоречия. */
const PLOT_HINT = `
DIESE AUFGABE IST EINE GRAPH-AUFGABE.
Der Schüler sieht NUR den gezeichneten Graphen — die Funktionsgleichung steht
NICHT im Text. Antworte mit "plot" statt "expr".

"kind" sagt, was abgelesen wird:
  "wert"       — Funktionswert an der Stelle "at"
  "achse"      — y-Achsenabschnitt
  "nullstelle" — eine Nullstelle
  "steigung"   — Steigung einer GERADEN, Intervall "span": [a, b]

Regeln für "plot":
- "fn": die Funktion, Variable x. Nur + - * / ^ ( ) sqrt() ln() lg() exp().
  Multiplikation IMMER mit "*" schreiben: 0.5*x^2, nicht 0.5x^2.
- "xmin" < "xmax", "ymin" < "ymax": Fenster, in dem der Graph deutlich sichtbar
  ist — nicht am Rand, nicht angeschnitten.

Beispiel:
{"prompt":"Lies den Funktionswert an der Stelle x = 2 ab.","plot":{"fn":"0.5*x^2 - 2*x - 1.5","xmin":-3,"xmax":7,"ymin":-6,"ymax":8,"kind":"wert","at":2},"answer":"-3.5","solution":"...","par":40}`;

/* --------------------------------------------------------------- ступени --
   «Stufe 3 von 5» модель понимала как вежливую просьбу: замер показал, что
   Stufe 1 и Stufe 5 дают почти одинаковую задачу (x²−11x+28 и x²−19x+84 —
   это одна и та же форма с другими числами). Уровень должен менять не тон,
   а ЧИСЛА И ЧИСЛО ШАГОВ, иначе прогрессии нет.

   Поэтому уровень — это не прилагательное, а ограничения:
   диапазон коэффициентов, знак корней, является ли дискриминант квадратом,
   сколько преобразований нужно сделать до ответа.
   -------------------------------------------------------------------------- */
const STUFE = {
  1: `Stufe 1 — GRUNDLAGE. Nur ganze Zahlen von 1 bis 12. Leitkoeffizient 1. Die Diskriminante ist ein Quadrat, beide Lösungen sind positiv und ganzzahlig. Höchstens ZWEI Rechenschritte bis zur Antwort.`,
  2: `Stufe 2 — EINFACH. Ganze Zahlen bis 20. Lösungen dürfen negativ sein. Diskriminante ist ein Quadrat. Höchstens DREI Rechenschritte.`,
  3: `Stufe 3 — PRÜFUNGSNIVEAU. Leitkoeffizient darf ungleich 1 sein. Lösungen ganzzahlig oder einfache Brüche. Diskriminante ist ein Quadrat. Genau so sieht die Prüfung aus.`,
  4: `Stufe 4 — SICHER. Größere Koeffizienten, negative und gebrochene Lösungen, ein Zwischenschritt mehr (Umformen, Ausklammern, Vieta). Antwort bleibt exakt.`,
  5: `Stufe 5 — SICHER PLUS. Kombination mit einem Nachbarthema, ein Parameter, oder eine Frage, die erst nach dem Lösen beantwortbar ist (Summe/Produkt der Lösungen, Anzahl der Lösungen, Vorzeichen). Zahlen bleiben exakt — kein Taschenrechner.`,
};

async function generateTask({ label, deps = [], level = 3, subject = "mathe", spec, variante, plot = false }) {
  const isMathe = subject !== "deutsch";
  /* Требование «скомбинируй две темы» конфликтует с «prüft GENAU diese Form».
     Модель пытается примирить несовместимое, уходит в рассуждения на
     английском («Must combine at least two...») и упирается в max_tokens —
     в логе это «нет JSON (finish=length)» на 8 КБ.

     Для задачи с графиком комбинировать нечего: ученик видит картинку.
     Для задачи с вариантом комбинировать не нужно: столкновение тем уже
     описано в спецификации и в самой форме (у комбинаций вида k-* форма
     и есть столкновение). Подсказка остаётся только для старых задач без
     спецификации, где варианта нет и тема задана одной строкой. */
  const depHint =
    isMathe && deps.length && !plot && !variante
      ? `Die Aufgabe MUSS mindestens zwei dieser Themen wirklich kombinieren: ${deps.join(", ")}.`
      : "";

  /* Без спецификации модель получала одну строку «Thema: Vorzeichen» и один
     раз выдала на это квадратное неравенство. Теперь в запросе лежит: что
     входит в тему, чего в ней быть не должно, пример формы — и конкретная
     форма, которую надо проверить именно в этой задаче. */
  const specBlock = spec
    ? [
        `Was dazugehört: ${spec.was}`,
        `NICHT: ${spec.nicht}`,
        `Beispiel für diese Form: ${spec.beispiel}`,
      ].join("\n")
    : "";

  const variBlock = variante
    ? `\nDiese Aufgabe prüft GENAU diese Form: ${variante.de}\nFormbeispiel: ${variante.probe}\nÜbernimm die FORM, aber wähle ANDERE Zahlen als in den Beispielen — die Beispiele sind nicht die Aufgabe.`
    : "";

  const user = [
    `Thema: ${label}.`,
    specBlock,
    variBlock,
    depHint,
    isMathe ? (STUFE[Math.min(5, Math.max(1, Math.round(level)))] ?? STUFE[3]) : `Stufe ${level} von 5.`,
    isMathe ? "Ergebnis ist eine Zahl." : "",
    plot ? PLOT_HINT : "",
  ]
    .filter(Boolean)
    .join("\n");

  /* Повтор с обратной связью. Раньше 2-я и 3-я попытки отправляли ТОТ ЖЕ
     текст с другой температурой — модель не знала, что её отвергли, и
     повторяла ту же ошибку (пример: три раза подряд округляла 3,2920 до
     3,29, хотя экзамен без калькулятора и ответ должен быть точным).
     Теперь причина отказа уходит в запрос. Для «no json» причина
     бессмысленна — там нужна не математика, а формат. */
  const retryNote = (reason) =>
    reason === "no json"
      ? "\n\nDeine letzte Antwort enthielt kein JSON. Antworte diesmal mit GENAU EINEM JSON-Objekt, ohne Text davor oder danach."
      : `\n\nDeine letzte Aufgabe wurde vom Prüfer abgelehnt: ${reason}. Erzeuge eine ANDERE Aufgabe, die diesen Fehler nicht hat.`;

  let lastReason = "unknown";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await callModel({
      system: !isMathe ? SYSTEM_DEUTSCH : plot ? SYSTEM_MATHE_PLOT : SYSTEM_MATHE,
      user: attempt === 1 ? user : user + retryNote(lastReason),
      temperature: attempt === 1 ? 0.75 : 0.95,
      /* max_tokens считает и рассуждения, а не только JSON. Замерено
         `think=4000` при max_tokens=4000 — модель ещё думала, когда её
         обрезали. На трудных узлах (дробно-квадратичные уравнения) она
         ПРОЕКТИРУЕТ задачу: подбирает уравнение с посторонним корнем и
         проверяет его подстановкой, это 4–5 тысяч токенов.
         Поэтому бюджет растёт от попытки к попытке: 2600 → 4000 → 5400.
         В удачных прогонах расход 1,4–1,8 тыс., так что обычная задача
         платит как раньше, а дорогой лимит достаётся только той, которая
         уже не влезла. */
      maxTokens: 6000 + (attempt - 1) * 2000,
      /* thinking у задачи можно отключить: 71 с на одну задачу — это не
         «медленно», это «я закрыл вкладку». Проверяется через TALLY_REASON.
         Отправляем ВСЕГДА, в том числе для графиков: без параметра модель
         думает по умолчанию и обрезает JSON (см. комментарий у REASON). */
      reasoningEffort: REASON,
      /* график — на IFM первым: Groq стабильно путает форму ("achse" вместо
         "wert"), и задача уходит в мусор после трёх попыток */
      prefer: plot ? "ifm" : undefined,
    });
    const data = await r.json();
    const msg = data.choices?.[0]?.message ?? {};
    const obj = parseJsonLoose(msg.content);
    if (!obj || !obj.prompt || !obj.answer) {
      lastReason = "no json";
      // длина и finish_reason показывают, обрезалось ли по max_tokens.
      // think = сколько токенов ушло на рассуждения: если > 0, бюджет
      // max_tokens утекает не в JSON, и лечится это reasoning_effort, а не
      // увеличением лимита.
      console.warn(
        `[task] нет JSON (len=${String(msg.content ?? "").length}, finish=${data.choices?.[0]?.finish_reason}, think=${data.usage?.completion_tokens_details?.reasoning_tokens ?? "?"})`,
      );
      console.warn(`[task] начало: ${String(msg.content ?? "").slice(0, 260).replace(/\n/g, "⏎")}`);
      /* 260 символов хватает, чтобы увидеть «модель ушла в рассуждения», но
         не чтобы понять, ИЗ-ЗА ЧЕГО. Полный текст — только по требованию:
         иначе лог на 8 КБ на каждый сбой. TALLY_DEBUG=1 node server/index.mjs */
      if (process.env.TALLY_DEBUG || env.TALLY_DEBUG) {
        console.warn(`[task] целиком:\n${String(msg.content ?? "")}`);
      }
      continue;
    }

    const task = {
      prompt: String(obj.prompt).trim(),
      expr: obj.expr == null ? null : String(obj.expr).trim(),
      answer: Array.isArray(obj.answer) ? obj.answer.map(String) : [String(obj.answer).trim()],
      solution: String(obj.solution ?? "").trim(),
      par: Number(obj.par) > 0 ? Math.round(Number(obj.par)) : 45,
      skill: label,
      subject,
      variante: variante?.id ?? null,
      plot: plot && obj.plot ? normalizePlot(obj.plot) : null,
      verified: false,
      attempts: attempt,
      via: r.provider ?? "?",
      tokens: data.usage?.total_tokens ?? null,
    };

    if (!isMathe) {
      task.verified = true;
      return task;
    }

    if (plot) {
      if (!task.plot) {
        lastReason = "kein plot-Objekt";
        console.warn(`[task] попытка ${attempt} отклонена: ${lastReason}`);
        continue;
      }
      /* Форма должна совпасть с той, которую просил планировщик. Иначе
         покрытие не наберётся никогда: план требует «nullstelle», модель
         рисует «steigung», и узел честно висит открытым. */
      const want = variante?.id;
      const KINDS = ["wert", "achse", "nullstelle", "steigung"];
      if (want && KINDS.includes(want) && task.plot.kind !== want) {
        lastReason = `falsche Form: ${task.plot.kind} statt ${want}`;
        console.warn(`[task] попытка ${attempt} отклонена: ${lastReason}`);
        continue;
      }
      const vp = verifyPlot(task);
      if (vp.ok) {
        task.verified = true;
        return task;
      }
      /* причина уходит обратно в запрос (retryNote), поэтому она по-немецки:
         русское слово в промпте сбивает модель с немецкого */
      lastReason = `plot: ${vp.reason}${vp.got != null ? ` (berechnet ${vp.got}${vp.want != null ? `, Antwort ${vp.want}` : ""})` : ""}`;
      console.warn(`[task] попытка ${attempt} отклонена: ${lastReason}`);
      continue;
    }

    /* Структурная проверка условия. Модель иногда отдаёт задачу, где вторая
       строка пустая: «Entscheide, ob der Anteil grösser als 1/2 ist:» и всё,
       а дробь 89/176 так и не появилась. `expr` при этом сходится с ответом,
       поэтому числовая проверка такое пропускает — а решать нечего.
       Требуем две строки и цифру во второй. */
    const lines = task.prompt
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const objLine = lines[lines.length - 1] ?? "";
    if (lines.length < 2 || !/\d/.test(objLine)) {
      lastReason = `prompt ohne Rechnung (${lines.length} Zeilen)`;
      console.warn(`[task] попытка ${attempt} отклонена: ${lastReason}`);
      continue;
    }

    const v = verifyTask(task);
    if (v.ok) {
      task.verified = !v.weak;
      task.weak = !!v.weak;
      return task;
    }
    lastReason = `${v.reason}${v.got != null ? ` (berechnet ${v.got}, Antwort ${v.want})` : ""}`;
    console.warn(`[task] попытка ${attempt} отклонена: ${lastReason}`);
  }
  throw new Error("не удалось получить проверяемую задачу: " + lastReason);
}

/* ---------------------------------------------------------------- теория --
   Карточка «Regel» — то, чего не было вообще: раньше человек попадал сразу
   в шесть задач и должен был помнить правило сам. При 20 % по математике
   это не тренировка, а лотерея.

   Пример внутри карточки ПРОВЕРЯЕТСЯ тем же верификатором, что и задача.
   Иначе модель объясняет правило и тут же врёт в собственном примере —
   и это худший вид вранья, потому что ему доверяют.
   -------------------------------------------------------------------------- */

const SYSTEM_LEHR = `Du bist Mathematiklehrer am Studienkolleg Schleswig-Holstein (HAW Kiel).
Der Schüler hat große Lücken und bereitet sich auf den Aufnahmetest vor.

Du erklärst GENAU EIN Thema so, dass er es danach selbst rechnen kann.

Antworte NUR mit JSON, ohne Markdown:
{
  "regel": "3–4 Sätze: was man tut und in welcher Reihenfolge. Deutsch, sachlich, ohne Anrede.",
  "formel": "die zentrale Regel als EINE Zeile in Unicode, z. B. a^n · a^m = a^(n+m)",
  "warum": "1–2 Sätze, warum die Regel gilt. Nicht 'weil die Formel es sagt', sondern die Idee dahinter.",
  "fehler": ["typischer Fehler 1", "typischer Fehler 2"],
  "beispiel": {
    "aufgabe": "eine konkrete Aufgabe, andere Zahlen als im Formbeispiel",
    "schritte": ["Schritt 1 mit Rechnung", "Schritt 2 mit Rechnung", "Schritt 3"],
    "ergebnis": "nur die Zahl",
    "expr": "dieselbe Aufgabe maschinenlesbar, z. B. 2^3*2^4"
  }
}

Regeln:
- "formel": EINE Merkregel in Schulnotation, höchstens zwei Buchstaben je Seite.
  KEINE erfundenen Funktionen — kein sign(), kein max(), keine Betragsstriche
  als Ersatz für eine Fallunterscheidung. Wenn es zwei Fälle gibt, nimm den
  wichtigeren: "a + (−b) = a − b" ist besser als "sign(a−b)·(|a|−|b|)".
- Negative Zahlen und negative Faktoren stehen IMMER in Klammern:
  "(−a)·(−b) = a·b", nicht "−a · −b = a·b". Ohne Klammern ist die Zeile
  mehrdeutig, und genau daran scheitert der Schüler.
- "fehler": genau 2 Einträge, konkret, keine Floskeln wie "Rechenfehler".
- "schritte": 2 bis 5 Schritte, jeder mit sichtbarer Rechnung.
- "ergebnis": NUR die Zahl (oder zwei Zahlen mit ";" getrennt), keine Einheit.
- "expr": nur + - * / ^ ( ) sqrt() ln() lg() exp(), Multiplikation mit "*".
  "expr" muss genau "ergebnis" ergeben — es wird maschinell geprüft.
- KEIN LaTeX, keine Backslashes. Formeln direkt: 2², log₂(9), √5, ·, −.
- Brüche im Exponenten in Klammern: x^(1/2), nicht x^1/2.`;

async function lehrCard({ label, was, beispiel, nicht, level = 1, varianten = [] }) {
  const user = [
    `Thema: ${label}.`,
    was ? `Was dazugehört: ${was}` : "",
    nicht ? `NICHT: ${nicht}` : "",
    beispiel ? `Formbeispiel aus der Prüfung: ${beispiel}` : "",
    varianten.length ? `Formen, die in der Prüfung vorkommen: ${varianten.join(" | ")}` : "",
    `Stufe ${level} von 5 (1 = Grundlage, 5 = sicher). Erkläre auf Stufe ${level}.`,
  ]
    .filter(Boolean)
    .join("\n");

  let last = "unknown";
  for (let attempt = 1; attempt <= 2; attempt++) {
    const r = await callModel({
      system: SYSTEM_LEHR,
      user:
        attempt === 1
          ? user
          : `${user}\n\nDeine letzte Antwort wurde abgelehnt: ${last}. Liefere diesmal gültiges JSON.`,
      temperature: attempt === 1 ? 0.5 : 0.8,
      maxTokens: 4000,
    });
    const data = await r.json();
    const obj = parseJsonLoose(data.choices?.[0]?.message?.content);
    if (!obj) {
      last = "kein JSON";
      continue;
    }

    const regel = String(obj.regel ?? "").trim();
    const formel = String(obj.formel ?? "").trim();
    const bsp = obj.beispiel ?? {};
    const schritte = Array.isArray(bsp.schritte) ? bsp.schritte.map((s) => String(s).trim()) : [];
    const ergebnis = String(bsp.ergebnis ?? "").trim();

    if (regel.length < 40) {
      last = "Regel zu kurz";
      continue;
    }
    if (schritte.length < 2) {
      last = "zu wenige Schritte";
      continue;
    }
    if (!ergebnis) {
      last = "kein Ergebnis";
      continue;
    }

    /* Пример обязан сходиться. `weak` (expr — просто число) тоже отказ:
       карточка, где «проверка» ничего не проверяет, хуже отсутствия карточки. */
    const v = verifyTask({
      prompt: String(bsp.aufgabe ?? ""),
      expr: bsp.expr == null ? null : String(bsp.expr),
      answer: [ergebnis],
    });
    if (!v.ok || v.weak) {
      last = `Beispiel falsch: ${v.reason ?? "schwacher Ausdruck"}`;
      console.warn(`[lehr] ${label}: ${last}`);
      continue;
    }

    return {
      regel,
      formel,
      warum: String(obj.warum ?? "").trim(),
      fehler: (Array.isArray(obj.fehler) ? obj.fehler : []).slice(0, 3).map((f) => String(f).trim()),
      beispiel: {
        aufgabe: String(bsp.aufgabe ?? "").trim(),
        schritte,
        ergebnis,
      },
      verified: true,
      attempts: attempt,
      via: r.provider ?? "?",
      tokens: data.usage?.total_tokens ?? null,
    };
  }
  throw new Error(`Theorie nicht erzeugt: ${last}`);
}

/* ------------------------------------------------------------- мастерство -- */

/* BKT по Corbett & Anderson (1995); параметры — дефолт Cognitive Tutor.
   Смысл: система допускает, что ученик мог угадать (P(G)) или ошибиться
   по невнимательности (P(S)), поэтому один верный ответ ничего не доказывает.
   Три-четыре верных подряд выводят оценку на 0.95. */
const BKT = { L0: 0.1, T: 0.2, G: 0.15, S: 0.1 };

function bktFold(p0, log) {
  let p = Math.min(0.9, Math.max(0.05, Number(p0) || BKT.L0));
  for (const it of log) {
    const ok = !!it.ok;
    // верно, но вдвое дольше par — это не автоматизм, засчитываем наполовину
    const credit = ok ? (Number(it.sec) > 2 * Number(it.par) ? 0.6 : 1) : 0;
    const post = ok
      ? (p * (1 - BKT.S)) / (p * (1 - BKT.S) + (1 - p) * BKT.G)
      : (p * BKT.S) / (p * BKT.S + (1 - p) * (1 - BKT.G));
    const next = post + (1 - post) * BKT.T;
    p = p + credit * (next - p);
  }
  return p;
}

const SYSTEM_MASTERY = `Du bist Prüfer am Studienkolleg Schleswig-Holstein und entscheidest, ob ein Schüler ein Thema WIRKLICH verstanden hat — nicht, ob zufällig richtige Zahlen rauskamen.

Du bekommst eine Runde von sechs Aufgaben zum selben Thema: Aufgabe, Antwort des Schülers, richtig/falsch, gebrauchte Zeit und Par-Zeit.

Unterscheide Verständnis von Zufallstreffern:
- Alle sechs richtig und im Par-Bereich → "verstanden".
- Ein Fehler, danach sicher und zügig weiter → "verstanden".
- Richtige Antworten, aber deutlich über Par (langsam, unsicher) → "wackelt".
- Rechenfehler, aber der Ansatz stimmt → "wackelt".
- Falsche Antwort, die auf ein falsches Konzept hindeutet (falsches Gesetz, falsche Umformung) → "nicht".
- Mehr als zwei falsche → "nicht".

Antworte NUR mit JSON, ohne Markdown:
{"urteil":"verstanden"|"wackelt"|"nicht","grund":"ein Satz, höchstens 20 Wörter, deutsch, konkret, ohne Lob"}`;

/* Модель ставит потолок, а не значение: она не умеет выдавать калиброванную
   вероятность, зато умеет заметить «правильно, но наугад». Поэтому итог —
   min(арифметика, потолок). Завысить модель не может, занизить — да.
   "unbekannt" (модель не ответила) тоже держит узел открытым: без вердикта
   узел не закрывается, иначе весь смысл теряется. */
const CAP = { verstanden: 1, wackelt: 0.9, nicht: 0.6, unbekannt: 0.9 };

async function judgeRound({ skill, p, log }) {
  const pBkt = bktFold(p, log);

  const lines = log.map((it, i) => {
    const verdict = it.ok ? "richtig" : "falsch";
    const asked = it.asked ? ", Rückfrage gestellt" : "";
    return `${i + 1}) ${verdict} · ${Math.round(Number(it.sec))} s / Par ${Math.round(Number(it.par))} s${asked}
   Aufgabe: ${it.prompt}
   Antwort: ${it.given || "—"}`;
  });

  let urteil = "unbekannt";
  let grund = "";

  for (let attempt = 1; attempt <= 2 && urteil === "unbekannt"; attempt++) {
    try {
      const r = await callModel({
        system: SYSTEM_MASTERY,
        user: `Thema: ${skill}\n\n${lines.join("\n\n")}`,
        temperature: 0.2,
        maxTokens: 700,
        reasoningEffort: "low",
      });
      const data = await r.json();
      const content = String(data.choices?.[0]?.message?.content ?? "");
      const obj = parseJsonLoose(content);

      // сначала строгое поле, и только если JSON не собрался — регулярка по тексту.
      // Искать по всему ответу нельзя: в объяснении встречается слово "nicht".
      const quoted = /"urteil"\s*:\s*"([^"]+)"/i.exec(content)?.[1];
      const raw = String(obj?.urteil ?? quoted ?? "").toLowerCase();

      if (/nicht/.test(raw)) urteil = "nicht";
      else if (/wackel/.test(raw)) urteil = "wackelt";
      else if (/verstanden/.test(raw)) urteil = "verstanden";

      if (urteil === "unbekannt") {
        console.warn(`[mastery] не разобрал: ${content.slice(0, 200)}`);
      } else {
        const g = String(obj?.grund ?? "").trim();
        grund =
          g.length > 220 ? `${g.slice(0, g.lastIndexOf(" ") > 0 ? g.lastIndexOf(" ") : 220)}…` : g;
      }
    } catch (e) {
      console.warn(`[mastery] попытка ${attempt}: ${e.message}`);
      if (attempt === 1) await new Promise((ok) => setTimeout(ok, 1500));
    }
  }

  const cap = CAP[urteil] ?? CAP.unbekannt;
  return { p: Math.min(pBkt, cap), p_bkt: pBkt, urteil, grund };
}

/* ----------------------------------------------------------------- http --- */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".woff2": "font/woff2",
};

const readBody = (req, { maxBytes = 1_000_000 } = {}) =>
  new Promise((resolve, reject) => {
    let b = "";
    let size = 0;
    let dead = false;
    req.on("data", (c) => {
      if (dead) return; // хвост потока сливаем, не накапливая
      size += c.length;
      if (size > maxBytes) {
        dead = true;
        b = "";
        /* ВАЖНО: не destroy() — он убивает сокет раньше, чем обработчик
           успевает отправить 413, и клиент видит «connection reset» вместо
           внятного ответа. Просто перестаём копить и отдаём ошибку. */
        reject(new Error("payload too large"));
        return;
      }
      b += c;
    });
    req.on("end", () => {
      try {
        resolve(b ? JSON.parse(b) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });

const json = (res, code, obj) => {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
};

/* ------------------------------------------------------- защита квоты ---
   Прод открыт всему интернету, а каждый /api/task стоит токенов. Лимиты на IP
   щедрые для ученика (раунд = 6 задач, объяснение после каждой) и жёсткие
   для бота. Счётчик в памяти инстанса: на Vercel это не глобальный потолок,
   но тёплый инстанс обычно обслуживает весь трафик, поэтому квоту это
   спасает. ---------------------------------------------------------------- */
const clientIp = (req) => {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  if (typeof req.headers["x-real-ip"] === "string") return req.headers["x-real-ip"];
  return req.socket?.remoteAddress || "static";
};

const RATE = new Map();

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const arr = (RATE.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    RATE.set(key, arr);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - arr[0])) / 1000) };
  }
  arr.push(now);
  RATE.set(key, arr);
  /* карта не должна расти бесконечно: выметаем давно молчащие ключи */
  if (RATE.size > 5000) {
    for (const [k, v] of RATE) {
      if (!v.some((t) => now - t < windowMs)) RATE.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}

const json429 = (res, retryAfter) => {
  res.writeHead(429, {
    "Content-Type": "application/json; charset=utf-8",
    "Retry-After": String(Math.max(1, retryAfter)),
  });
  res.end(JSON.stringify({ error: "слишком часто — подожди немного" }));
};

/* --- OCR фото→текст: единый источник для локального сервера и api/ocr.mjs.
   Раньше логика жила в двух копиях и расходилась. Таймаут обязателен: без
   него зависший kiosapi держал соединение (и слот) вечно. ---------------- */
async function ocrText(image) {
  const ocrOnce = async () => {
    const r = await fetch(`${KIOSAPI_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KIOSAPI_KEY}`,
        "Content-Type": "application/json",
        /* Cloudflare режет клиентов без браузерного UA (код 1010) */
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Transcribe the mathematical content of this image exactly as written. One line per line. Keep unicode: − √ ² ³ · π ≥ ≤ ∈. Keep the decimal comma. No commentary, no LaTeX.",
              },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        /* reasoning-модель: при малом max_tokens «мысли» съедают лимит и
           content приходит пустым. 1500 + один автоповтор (у kiosapi
           2 req/min, второй заход укладывается). */
        max_tokens: 1500,
        temperature: 0,
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`kiosapi ${r.status}: ${t.slice(0, 160)}`);
    }
    const out = await r.json();
    return (out.choices?.[0]?.message?.content || "").trim();
  };
  let text = await ocrOnce();
  if (!text) {
    await sleep(1200);
    text = await ocrOnce();
  }
  return text;
}

/* --- размер банка для /api/health: читаем с TTL, файл меняется только
   сборкой, но после неё счётчик должен обновиться сам -------------------- */
let bankCountAt = 0;
let bankCount = 0;
async function bankSize() {
  if (Date.now() - bankCountAt < 300_000) return bankCount;
  try {
    const raw = await readFile(join(ROOT, "public", "bank.json"), "utf8");
    bankCount = JSON.parse(raw).length;
    bankCountAt = Date.now();
  } catch {
    bankCount = 0;
  }
  return bankCount;
}

function sseHead(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
}

async function pipeStream(res, upstream) {
  const reader = upstream.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") continue;
      try {
        const j = JSON.parse(payload);
        const d = j.choices?.[0]?.delta?.content;
        if (d) res.write(`data: ${JSON.stringify({ t: d })}\n\n`);
      } catch {
        /* игнорируем битые чанки */
      }
    }
  }
  res.write("data: [DONE]\n\n");
  res.end();
}


/* экспорт для server/index.mjs (локальный) и api/*.mjs (Vercel Functions) */
export {
  ROOT, MODEL, PORT, HOST, PROVIDERS,
  KIOSAPI_KEY, KIOSAPI_BASE, VISION_MODEL,
  GROQ_KEYS, GROQ_MODELS,
  callModel, generateTask, lehrCard, judgeRound,
  json, readBody, sseHead, pipeStream,
  clientIp, rateLimit, json429, ocrText, bankSize,
};
