/* ============================================================================
   PROBEPRÜFUNG
   ----------------------------------------------------------------------------
   Настоящий экзамен: 60 минут, семь заданий, 20 баллов, без калькулятора.
   Не «ещё один режим тренировки», а измерительный прибор — единственное
   место в приложении, где задачи идут вперемешку и никто не подсказывает.

   Почему именно так, а не «10 случайных задач»:

   1. Структура взята из официального образца (Aufgabe 1–7): термины,
      дроби и степени, система 3×3, уравнения, прямые, график, текстовая.
      Случайная выборка проверяет случайные навыки; экзамен проверяет
      именно эти семь.

   2. Баллы взвешены (2·3·3·4·2·2·4 = 20). Равный вес сделал бы график
      и систему такими же дорогими, как «упростите выражение», — а на
      настоящем экзамене это не так.

   3. Во время экзамена НЕТ вердикта. Ни «richtig», ни разбора, ни звука.
      Иначе это не измерение, а тренировка с подсказками.

   4. Сборка идёт ДО старта и целиком. Экзамен, который зависает на
      четвёртой задаче из-за сети, хуже, чем 90 секунд ожидания на входе.

   Результат не трогает мастерство. Он его измеряет: если экзамен писался
   на угадывание, было бы враньём засчитывать это как «узел закрыт».
   Поэтому экзамен пишет свою историю и показывает, что именно просело.
   ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MathText, { MathTerm, splitPrompt } from "@/MathText";
import Graph from "@/Graph";
import { generateTask, type GenTask } from "@/lib/ai";
import { isCorrect, mmss } from "@/lib/check";
import { specOf } from "@/lib/specs";
import { byId } from "@/lib/skills";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ план --- */

type Block = { n: number; pts: number; skill: string; de: string };

/** Официальная структура образца. Сумма баллов = 20. */
const BLOCKS: Block[] = [
  { n: 1, pts: 2, skill: "rechenterm", de: "Terme vereinfachen" },
  { n: 2, pts: 3, skill: "bruchterme", de: "Bruchterme und Potenzen" },
  { n: 3, pts: 3, skill: "lgs3", de: "Gleichungssystem 3×3" },
  { n: 4, pts: 4, skill: "quad-gleichung", de: "Gleichungen lösen" },
  { n: 5, pts: 2, skill: "gerade", de: "Geraden" },
  { n: 6, pts: 2, skill: "graph-lesen", de: "Graph lesen" },
  { n: 7, pts: 4, skill: "prozent", de: "Sachaufgabe" },
];

const DURATION = 60 * 60;

export type Part = { n: number; de: string; pts: number; max: number; ok: boolean };
export type ExamResult = {
  at: number;
  pts: number;
  max: number;
  sec: number;
  parts: Part[];
};

const KEY = "tally.exams.v1";

export function lastExam(): ExamResult | null {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as ExamResult[]) : [];
    return Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null;
  } catch {
    return null;
  }
}

function pushExam(r: ExamResult): void {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as ExamResult[]) : [];
    const next = [...(Array.isArray(arr) ? arr : []), r].slice(-20);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* приватный режим */
  }
}

/* --------------------------------------------------------------- экран ---- */

export default function Exam({
  covOf,
  onExit,
  onFinish,
}: {
  /** какие формы узла уже сданы — чтобы экзамен не повторял вчерашние */
  covOf: (skill: string) => string[];
  onExit: () => void;
  onFinish: (r: ExamResult) => void;
}) {
  const [phase, setPhase] = useState<"build" | "run" | "done">("build");
  /** по индексу блока: undefined — ещё нет, null — не удалось */
  const [built, setBuilt] = useState<(GenTask | null | undefined)[]>([]);
  const [filled, setFilled] = useState(0);
  const [done, setDone] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [left, setLeft] = useState(DURATION);
  const [result, setResult] = useState<ExamResult | null>(null);
  /* «Vorzeitig abgeben» необратим: первый клик только спрашивает,
     второй (в течение 4 с) — сдаёт. Без этого один промах по кнопке
     уничтожал прогон. */
  const [confirmAbort, setConfirmAbort] = useState(false);

  const startAt = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------- сборка ---
     Семь задач последовательно — это 2–6 минут ожидания (замерено: одна
     задача 7–56 с). Поэтому три параллельных потока.

     Второй проход. Один блок может не собраться: модель трижды отдала не ту
     форму, или все провайдеры разом упёрлись в лимит. Раньше такой блок
     просто выпадал — экзамен из шести задач с другими баллами, и результат
     уже не сравнить с прошлым. Теперь после первого прохода неудавшиеся
     блоки пробуются ещё раз, с паузой: лимит за это время отпускает. */
  useEffect(() => {
    let alive = true;
    const out: (GenTask | null | undefined)[] = new Array(BLOCKS.length).fill(undefined);
    let cursor = 0;
    let done = 0;

    const one = async (b: Block): Promise<GenTask | null> => {
      const skill = byId[b.skill];
      const spec = specOf(b.skill);
      if (!skill || !spec) return null;
      const seen = new Set(covOf(b.skill));
      const v = spec.varianten.find((x) => !seen.has(x.id)) ?? spec.varianten[0];
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await generateTask({
            label: skill.de,
            deps: skill.deps.map((d) => byId[d]?.de ?? d),
            level: 4,
            subject: "mathe",
            spec: { was: spec.was, beispiel: spec.beispiel, nicht: spec.nicht },
            variante: v ? { id: v.id, de: v.de, probe: v.probe } : undefined,
            plot: spec.plot === true,
          });
        } catch {
          if (attempt === 1) return null;
          await new Promise((ok) => setTimeout(ok, 900));
        }
      }
      return null;
    };

    const worker = async () => {
      for (;;) {
        const i = cursor++;
        if (i >= BLOCKS.length) return;
        out[i] = await one(BLOCKS[i]);
        done++;
        if (alive) {
          setBuilt([...out]);
          setFilled(done);
        }
      }
    };

    (async () => {
      await Promise.all([worker(), worker(), worker()]);

      /* второй проход только по пустым местам */
      for (let i = 0; i < out.length; i++) {
        if (out[i] != null) continue;
        await new Promise((ok) => setTimeout(ok, 2500));
        out[i] = await one(BLOCKS[i]);
        if (alive) setBuilt([...out]);
      }
      if (alive) setDone(true);
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Задачи и их блоки держим ВМЕСТЕ. Раньше баллы брались по индексу в
     отфильтрованном массиве — и если выпадал средний блок, все следующие
     получали чужие баллы и чужие названия. */
  const items = useMemo(
    () =>
      built
        .map((t, i) => ({ t, b: BLOCKS[i] }))
        .filter((x): x is { t: GenTask; b: Block } => x.t != null),
    [built],
  );
  const tasks = useMemo(() => items.map((x) => x.t), [items]);
  const usable = tasks.length >= 5;

  /* -------------------------------------------------------------- таймер -- */
  const submit = useCallback(() => {
    setConfirmAbort(false);
    setPhase((p) => (p === "run" ? "done" : p));
  }, []);

  useEffect(() => {
    if (!confirmAbort) return;
    const id = window.setTimeout(() => setConfirmAbort(false), 4000);
    return () => window.clearTimeout(id);
  }, [confirmAbort]);

  useEffect(() => {
    if (phase !== "run") return;
    const id = window.setInterval(() => {
      const l = DURATION - Math.floor((Date.now() - startAt.current) / 1000);
      setLeft(Math.max(0, l));
      if (l <= 0) submit();
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, submit]);

  /* --------------------------------------------------------------- итог --- */
  useEffect(() => {
    if (phase !== "done" || result) return;
    const parts: Part[] = items.map(({ t, b }, i) => ({
      n: i + 1,
      de: b.de,
      pts: b.pts,
      max: b.pts,
      ok: isCorrect(answers[i] ?? "", t.answer),
    }));
    const pts = parts.reduce((a, p) => a + (p.ok ? p.pts : 0), 0);
    const r: ExamResult = {
      at: Date.now(),
      pts,
      max: parts.reduce((a, p) => a + p.max, 0),
      sec: Math.min(DURATION, Math.floor((Date.now() - startAt.current) / 1000)),
      parts,
    };
    setResult(r);
    pushExam(r);
    onFinish(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const cur = tasks[idx];

  const next = () => {
    setAnswers((a) => {
      const n = [...a];
      n[idx] = input;
      return n;
    });
    setInput("");
    if (idx + 1 >= tasks.length) {
      submit();
      return;
    }
    setIdx(idx + 1);
    window.setTimeout(() => inputRef.current?.focus(), 40);
  };

  /* ----------------------------------------------------------- сборка UI -- */
  if (phase === "build") {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col px-4 py-5">
        <header className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            className="rounded-lg px-2 py-1.5 text-[13px] font-bold text-muted transition-colors hover:bg-black/[0.04] hover:text-ink"
          >
            ← Weg
          </button>
        </header>

        <h1 className="mt-3 text-[22px] font-extrabold">Probeprüfung</h1>
        <p className="mt-1 text-[12.5px] font-semibold text-muted">
          60 Minuten · 7 Aufgaben · 20 Punkte · kein Taschenrechner
        </p>

        <div className="card3d mt-4 rounded-card border-2 border-line bg-white p-2">
          {BLOCKS.map((b, i) => {
            const t = built[i];
            const state = t === null ? "fail" : t ? "ok" : "wait";
            return (
              <div
                key={b.n}
                className="flex items-center gap-2.5 border-b border-line/70 px-2 py-2 last:border-0"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold",
                    state === "ok" && "bg-green text-white",
                    state === "wait" && "bg-black/[0.06] text-muted",
                    state === "fail" && "bg-redl text-red",
                  )}
                >
                  {state === "ok" ? (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path
                        d="M1.6 5.2l2.2 2.2 4.6-4.8"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    b.n
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-[12px] font-bold">
                  Aufgabe {b.n} · {b.de}
                </span>
                <span className="tnum shrink-0 text-[10px] font-extrabold text-muted">
                  {b.pts} P
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          {!done && (
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
              Aufgaben werden erstellt · {filled} / {BLOCKS.length}
            </p>
          )}
          {done && (
            <button
              type="button"
              disabled={!usable}
              onClick={() => {
                startAt.current = Date.now();
                setLeft(DURATION);
                setPhase("run");
              }}
              className="btn3d btn3d-green w-full rounded-xl px-4 py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.08em]"
            >
              {usable ? "Prüfung starten" : "Zu wenige Aufgaben — nochmal"}
            </button>
          )}
          {done && !usable && (
            <p className="mt-2 text-[11.5px] font-semibold text-red">
              Nur {tasks.length} von 7 Aufgaben erzeugt. Starte neu, sonst ist das Ergebnis
              nicht vergleichbar.
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------- результат -- */
  if (phase === "done" && result) {
    const pct = Math.round((result.pts / Math.max(1, result.max)) * 100);
    const passed = pct >= 50;
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col px-4 py-5">
        <div
          className={cn(
            "card3d rounded-card border-2 p-5",
            passed ? "border-green bg-greenl" : "border-red bg-redl",
          )}
        >
          <p
            className={cn(
              "text-[10px] font-extrabold uppercase tracking-[0.14em]",
              passed ? "text-[#2f6b00]" : "text-red",
            )}
          >
            {passed ? "Bestanden" : "Nicht bestanden"}
          </p>
          <div className="mt-1 flex items-end gap-2">
            <span
              className={cn(
                "tnum text-[42px] leading-none font-extrabold",
                passed ? "text-[#2f6b00]" : "text-red",
              )}
            >
              {result.pts}
            </span>
            <span className="tnum pb-1 text-[16px] font-extrabold text-muted">
              / {result.max} Punkte
            </span>
          </div>
          <p className="mt-1 text-[12px] font-bold text-muted">
            {pct} % · {mmss(result.sec)} gebraucht
          </p>
        </div>

        <div className="card3d mt-3 rounded-card border-2 border-line bg-white p-2">
          {result.parts.map((p) => (
            <div
              key={p.n}
              className="flex items-center gap-2.5 border-b border-line/70 px-2 py-2 last:border-0"
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold",
                  p.ok ? "bg-green text-white" : "bg-redl text-red",
                )}
              >
                {p.ok ? (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path
                      d="M1.6 5.2l2.2 2.2 4.6-4.8"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path
                      d="M2 2l6 6M8 2l-6 6"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12px] font-bold">
                {p.n} · {p.de}
              </span>
              <span className="tnum shrink-0 text-[10.5px] font-extrabold text-muted">
                {p.ok ? p.pts : 0} / {p.max}
              </span>
            </div>
          ))}
        </div>

        {/* что именно просело — единственное, ради чего стоит смотреть итог */}
        {result.parts.some((p) => !p.ok) && (
          <div className="mt-3 rounded-card border-2 border-line bg-white p-3.5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-red">
              Das kostet Punkte
            </p>
            <p className="mt-1 text-[12.5px] leading-[1.55] font-semibold text-ink">
              {result.parts
                .filter((p) => !p.ok)
                .map((p) => p.de)
                .join(" · ")}
            </p>
            <p className="mt-1.5 text-[11.5px] font-semibold text-muted">
              Diese Themen stehen im Weg — sie sind auf dem Weg mit rotem Punkt markiert.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onExit}
          className="btn3d btn3d-green mt-4 w-full rounded-xl px-4 py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.08em]"
        >
          Zurück zum Weg
        </button>
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setBuilt([]);
            setFilled(0);
            setDone(false);
            setIdx(0);
            setAnswers([]);
            setInput("");
            setPhase("build");
          }}
          className="mt-2 w-full rounded-xl px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted hover:text-ink"
        >
          Neue Prüfung
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------------------- раунд -- */
  if (!cur) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col items-center justify-center px-4">
        <p className="text-[13px] font-bold text-muted">Aufgabe wird geladen…</p>
      </div>
    );
  }

  const { head, term } = splitPrompt(cur.prompt);
  const urgent = left <= 300;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-10 border-b-2 border-line bg-white">
        <div className="mx-auto flex max-w-[560px] items-center gap-3 px-4 pt-3 pb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
            Prüfung
          </span>
          <span className="ml-auto text-[11px] font-extrabold text-muted">
            Aufgabe {idx + 1} / {tasks.length}
          </span>
          <span
            className={cn(
              "tnum rounded-lg px-2 py-0.5 text-[13px] font-extrabold",
              urgent ? "bg-redl text-red" : "text-ink",
            )}
          >
            {mmss(left)}
          </span>
        </div>
        <div className="mx-auto flex max-w-[560px] gap-1 px-4 pb-2">
          {tasks.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i < idx ? "bg-blue" : i === idx ? "bg-blue/40" : "bg-line",
              )}
            />
          ))}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 py-5">
        <div className="card3d rounded-card border-2 border-line bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
            {items[idx]?.b.de ?? ""} · {items[idx]?.b.pts ?? 1} Punkte
          </p>

          <div className="mt-2.5">
            {cur.plot ? (
              <Graph plot={cur.plot} />
            ) : (
              <>
                {head.map((l, i) => (
                  <p
                    key={i}
                    className="text-[13px] leading-[1.6] font-semibold text-muted"
                  >
                    <MathText>{l}</MathText>
                  </p>
                ))}
                {term && (
                  <p className="tnum mt-1 text-[clamp(20px,5vw,27px)] leading-[1.5] font-extrabold break-words">
                    <MathTerm>{term}</MathTerm>
                  </p>
                )}
                {!term && head.length === 0 && (
                  <p className="tnum text-[clamp(18px,4.4vw,23px)] leading-[1.55] font-extrabold break-words">
                    <MathText>{cur.prompt}</MathText>
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              ref={inputRef}
              id="exam-answer"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  next();
                }
              }}
              placeholder="Antwort"
              autoComplete="off"
              spellCheck={false}
              className="tnum min-w-0 flex-1 rounded-xl border-2 border-line bg-white px-3.5 py-3 text-[19px] font-extrabold outline-none placeholder:text-[11px] placeholder:font-extrabold placeholder:uppercase placeholder:tracking-[0.12em] placeholder:text-muted focus:border-blue"
            />
          </div>
          <p className="mt-2 text-[10px] font-bold text-muted">
            Bruch 3/4 · Dezimal 3,5 · zwei Werte mit ; — kein Taschenrechner
          </p>
        </div>

        <button
          type="button"
          onClick={next}
          className="btn3d btn3d-green mt-4 w-full rounded-xl px-4 py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.08em]"
        >
          {idx + 1 >= tasks.length ? "Abgeben" : "Weiter"}
        </button>
        <button
          type="button"
          onClick={() => (confirmAbort ? submit() : setConfirmAbort(true))}
          className={cn(
            "mt-2 w-full rounded-xl px-4 py-2 text-[10.5px] font-extrabold uppercase tracking-[0.08em] hover:text-ink",
            confirmAbort ? "bg-redl text-red" : "text-muted",
          )}
        >
          {confirmAbort ? "Wirklich abgeben? Ещё раз — сдать навсегда" : "Vorzeitig abgeben"}
        </button>
      </main>
    </div>
  );
}
