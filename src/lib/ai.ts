/* ============================================================================
   КЛИЕНТ ИИ
   ----------------------------------------------------------------------------
   Задачи генерирует модель на сервере, ответ проверяется там же
   детерминированно. Здесь только транспорт и стриминг.
   ========================================================================== */

export type Plot = {
  /** функция в машинной записи: "0.5*x^2 - 2*x - 1.5" */
  fn: string;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  /** что именно спрашивается — по этому сервер проверяет ответ */
  kind?: "wert" | "nullstelle" | "steigung";
  /** для kind="wert": в какой точке сверять */
  at?: number;
  /** для kind="steigung": на каком отрезке */
  span?: [number, number];
  /** точки, которые надо подсветить (например, отмеченные на графике) */
  marks?: [number, number][];
};

export type GenTask = {
  /** id в банке (tools/bank-build.cjs); у живой генерации его нет */
  id?: string;
  /** Stufe, на которой задача сгенерирована (только в банке) */
  level?: number;
  prompt: string;
  expr: string | null;
  answer: string[];
  solution: string;
  par: number;
  skill: string;
  subject: string;
  verified: boolean;
  attempts: number;
  tokens: number | null;
  /** какая форма задачи проверена — по ней считается покрытие узла */
  variante?: string;
  /** задача с графиком: вместо терма рисуем функцию */
  plot?: Plot | null;
};

export type TaskRequest = {
  label: string;
  deps?: string[];
  level?: number;
  subject?: "mathe" | "deutsch";
  /** что входит в тему и чего в ней быть не должно */
  spec?: { was: string; beispiel: string; nicht: string };
  /** конкретная форма, которую надо проверить именно в этой задаче */
  variante?: { id: string; de: string; probe: string };
  /** задача должна вернуть график, а не терм */
  plot?: boolean;
};

export async function generateTask(req: TaskRequest): Promise<GenTask> {
  const r = await fetch("/api/task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`generation failed (${r.status}): ${t.slice(0, 200)}`);
  }
  return (await r.json()) as GenTask;
}

async function readSSE(
  url: string,
  body: unknown,
  onChunk: (t: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!r.ok || !r.body) throw new Error(`stream failed (${r.status})`);

  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const blocks = buf.split("\n\n");
    buf = blocks.pop() ?? "";
    for (const b of blocks) {
      const line = b.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const j = JSON.parse(payload) as { t?: string };
        if (j.t) onChunk(j.t);
      } catch {
        /* пропускаем битый чанк */
      }
    }
  }
}

/** Разбор ошибки: 3–5 строк, стримом. */
export function explain(
  task: GenTask,
  userAnswer: string,
  onChunk: (t: string) => void,
  signal?: AbortSignal,
) {
  return readSSE("/api/explain", { task, userAnswer }, onChunk, signal);
}

/** Свободный вопрос по задаче. */
export function ask(
  messages: { role: "user" | "assistant"; content: string }[],
  onChunk: (t: string) => void,
  signal?: AbortSignal,
) {
  return readSSE("/api/chat", { messages }, onChunk, signal);
}

/* ----------------------------------------------------------------- теория -- */

export type LehrCard = {
  regel: string;
  formel: string;
  warum: string;
  fehler: string[];
  beispiel: { aufgabe: string; schritte: string[]; ergebnis: string };
  verified: boolean;
  attempts: number;
  tokens: number | null;
};

export type LehrRequest = {
  label: string;
  was?: string;
  beispiel?: string;
  nicht?: string;
  level?: number;
  varianten?: string[];
};

/** Карточка «Regel» — один раз на узел, дальше лежит в localStorage. */
export async function lehr(req: LehrRequest): Promise<LehrCard> {
  const r = await fetch("/api/lehr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Theorie fehlgeschlagen (${r.status}): ${t.slice(0, 200)}`);
  }
  return (await r.json()) as LehrCard;
}

/* ------------------------------------------------------------- мастерство -- */

export type RoundLog = {
  prompt: string;
  answer: string[];
  given: string;
  ok: boolean;
  sec: number;
  par: number;
  asked: boolean;
  /** форма задачи — нужна, чтобы засчитать покрытие, а не только счёт */
  variante?: string;
};

export type Judge = {
  /** итоговая вероятность знания: min(арифметика, потолок модели) */
  p: number;
  /** что насчитал BKT без модели */
  p_bkt: number;
  urteil: "verstanden" | "wackelt" | "nicht" | "unbekannt";
  grund: string;
};

/**
 * Итог раунда. Сервер сам считает BKT и спрашивает модель, понял ли ты тему;
 * модель может только занизить оценку.
 */
export async function judgeRound(skill: string, p: number, log: RoundLog[]): Promise<Judge> {
  const r = await fetch("/api/mastery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skill, p, log }),
  });
  if (!r.ok) throw new Error(`Auswertung fehlgeschlagen (${r.status})`);
  return (await r.json()) as Judge;
}

/* Локальный BKT-фолд — точная копия bktFold из server/index.mjs (параметры
   те же). Нужен только для офлайн-фоллбека ниже; сервер остаётся источником
   правды, когда он доступен. */
function bktFoldLocal(p0: number, log: RoundLog[]): number {
  const BKT = { L0: 0.1, T: 0.2, G: 0.15, S: 0.1 };
  let p = Math.min(0.9, Math.max(0.05, Number(p0) || BKT.L0));
  for (const it of log) {
    const ok = !!it.ok;
    // верно, но вдвое дольше par — не автоматизм, засчитываем наполовину
    const credit = ok ? (Number(it.sec) > 2 * Number(it.par) ? 0.6 : 1) : 0;
    const post = ok
      ? (p * (1 - BKT.S)) / (p * (1 - BKT.S) + (1 - p) * BKT.G)
      : (p * BKT.S) / (p * BKT.S + (1 - p) * (1 - BKT.G));
    const next = post + (1 - post) * BKT.T;
    p = p + credit * (next - p);
  }
  return p;
}

/**
 * Раунд не должен сгорать из-за сети: человек решил 6 задач за 5 минут —
 * и «Auswertung fehlgeschlagen» обнуляла всё. При недоступности сервера
 * вердикт считается локально: идеальный раунд (всё верно, BKT ≥ 0.95)
 * закрывает узел и без модели — там арифметика и есть вердикт. Всё
 * остальное честно получает «unbekannt» (потолок 0.9, узел остаётся
 * открытым, модель дотянется позже), но результат, покрытие и XP
 * засчитываются.
 */
export async function judgeRoundSafe(skill: string, p: number, log: RoundLog[]): Promise<Judge> {
  try {
    return await judgeRound(skill, p, log);
  } catch {
    const pBkt = bktFoldLocal(p, log);
    const perfect = log.length > 0 && log.every((x) => x.ok) && pBkt >= 0.95;
    const urteil = perfect ? "verstanden" : "unbekannt";
    return {
      p: Math.min(pBkt, urteil === "verstanden" ? 1 : 0.9),
      p_bkt: pBkt,
      urteil,
      grund: "Offline-Auswertung: nur BKT, ohne Modell.",
    };
  }
}
