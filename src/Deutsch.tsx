/* ============================================================================
   DEUTSCH — грамматика A1…C1 + формат экзамена
   ----------------------------------------------------------------------------
   Три экрана, и каждый отвечает на один вопрос:

   Weg      — «что учить дальше». Список тем уровня с состоянием: закрыто,
              просрочено, открыто, закрыто зависимостями, «в работе».
   Theorie  — «почему так». Правило, таблица, примеры, типичные ошибки.
   Runde    — «проверь себя». Шесть упражнений, проверка точная, разбор
              после каждого ответа.

   Чего здесь СОЗНАТЕЛЬНО нет: таймера и процента правильности на экране
   во время раунда. В математике они есть, потому что там par задаёт темп
   экзамена. Здесь задача другая — довести конструкцию до автоматизма,
   и давление времени на этом этапе только мешает.

   Экзаменационные темы помечены номером задания (3.1 … 3.4) — чтобы было
   видно, что именно приносит баллы, а что просто «полезно знать».
   ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import PageHeader from "@/PageHeader";
import Tabs from "@/ui/Tabs";
import {
  EXAM_CORE,
  LEVELS,
  byLevel,
  deById,
  drillable,
  type DeTopic,
  type Level,
} from "@/lib/de/topics";
import {
  dropFehler,
  hasGen,
  judge,
  makeRound,
  norm,
  peekFehler,
  saveFehler,
  type Item,
  type Judge,
} from "@/lib/de/gen";
import type { Snap } from "@/lib/motivation";
import Mascot, { type MascotMood } from "@/mascot/Mascot";
import { useMascot } from "@/mascot/store";
import DeutschExam from "@/DeutschExam";
import Vocab from "@/Vocab";
import { hasTheory, THEORY } from "@/lib/de/theory";
import {
  DE_PASS,
  countsDe,
  currentDe,
  depsHint,
  loadDe,
  pNowDe,
  recordDe,
  saveDe,
  statusDe,
  type DeM,
} from "@/lib/de/progress";

const ROUND = 6;

/* ------------------------------------------------------- режимы подачи ---
   Три способа ответить, чтобы задания не решались «на автомате»:
   input  — печать (по умолчанию);
   choice — выбор из вариантов, собранных из ловушек-парадигм: перепутать
            падеж/лицо здесь нельзя «логикой», надо знать форму;
   order  — собрать предложение из плашек: тренировка порядка слов без
            печати на телефоне.
   Режим выбирается из самого задания (устойчивый хеш текста), без состояния. */

type Mode = "input" | "choice" | "order";

/** устойчивый хеш: одно и то же задание всегда получает один режим и один порядок */
const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/** детерминированное перемешивание (Fisher–Yates с линейным ГПСЧ) */
function seededShuffle<T>(xs: T[], seed: number): T[] {
  const a = [...xs];
  let s = (seed || 1) & 0x7fffffff;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------- разметка --- */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
      {children}
    </p>
  );
}

/** предложение с дырками: {0}, {1}… */
function Sentence({
  text,
  values,
  onChange,
  states,
  disabled,
  wide,
  onEnter,
}: {
  text: string;
  values: string[];
  onChange: (i: number, v: string) => void;
  /** состояние каждой дырки после проверки */
  states: ("idle" | "ok" | "case" | "bad")[];
  disabled: boolean;
  wide: boolean;
  /** Enter — отправить/дальше, чтобы не тянуться к кнопке */
  onEnter: () => void;
}) {
  const parts = text.split(/(\{\d+\})/g);
  return (
    <p
      className={cn(
        "text-[clamp(17px,2.2vw,21px)] font-bold",
        wide ? "leading-[1.7]" : "leading-[1.9]",
      )}
    >
      {parts.map((p, k) => {
        const m = /^\{(\d+)\}$/.exec(p);
        if (!m) return <span key={k}>{p}</span>;
        const i = Number(m[1]);
        const st = states[i] ?? "idle";
        return (
          <input
            key={k}
            value={values[i] ?? ""}
            disabled={disabled}
            autoFocus={i === 0}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onEnter();
              }
            }}
            placeholder={wide ? "ganzer Satz …" : ""}
            className={cn(
              "rounded-lg border-b-2 bg-transparent px-1 font-extrabold outline-none",
              wide
                ? "my-1 block w-full text-left text-[15px] placeholder:text-[11px] placeholder:font-bold placeholder:uppercase placeholder:tracking-[0.1em] placeholder:text-muted"
                : "mx-1 inline-block w-[9ch] text-center",
              st === "ok"
                ? "border-green text-greend"
                : st === "case"
                  ? "border-gold text-ink"
                  : st === "bad"
                    ? "border-red text-red"
                    : "border-blue/60 text-ink focus:border-blue",
              disabled && "opacity-70",
            )}
          />
        );
      })}
    </p>
  );
}

/** предложение для режима «выбери вариант»: выбранное слово вставлено в дырку */
function ChoiceSentence({
  text,
  value,
  checked,
  correct,
}: {
  text: string;
  value: string;
  checked: boolean;
  correct: string;
}) {
  const parts = text.split(/(\{\d+\})/g);
  return (
    <p className="text-[clamp(17px,2.2vw,21px)] font-bold leading-[1.9]">
      {parts.map((p, k) => {
        if (!/^\{(\d+)\}$/.exec(p)) return <span key={k}>{p}</span>;
        if (!checked)
          return value ? (
            <span key={k} className="mx-1 inline-block border-b-2 border-blue px-1 text-blue">
              {value}
            </span>
          ) : (
            <span key={k} className="mx-1 inline-block border-b border-line px-3 text-muted">
              …
            </span>
          );
        const ok = norm(value) === norm(correct);
        return (
          <span
            key={k}
            className={cn(
              "mx-1 inline-block border-b-2 px-1",
              ok ? "border-green text-greend" : "border-red text-red",
            )}
          >
            {value || "…"}
          </span>
        );
      })}
    </p>
  );
}

/** сборка предложения из плашек: тап по слову — взять, тап по взятому — вернуть */
function ChipOrder({
  chips,
  used,
  disabled,
  onTake,
  onBack,
}: {
  chips: string[];
  used: number[];
  disabled: boolean;
  onTake: (i: number) => void;
  onBack: (pos: number) => void;
}) {
  return (
    <div className="mt-3">
      <div className="min-h-[64px] rounded-xl border-2 border-dashed border-line bg-bg p-2">
        <div className="flex flex-wrap gap-1.5">
          {used.length === 0 && (
            <span className="px-1 py-1 text-[12px] font-bold text-muted">
              нажимай слова по порядку — клик по слову возвращает его
            </span>
          )}
          {used.map((ci, pos) => (
            <button
              key={`${ci}-${pos}`}
              type="button"
              disabled={disabled}
              onClick={() => onBack(pos)}
              className="rounded-lg border border-line bg-card px-2.5 py-1.5 text-[14px] font-extrabold text-ink"
            >
              {chips[ci]}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((w, i) =>
          used.includes(i) ? null : (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onTake(i)}
              className="rounded-lg border border-line bg-card px-2.5 py-1.5 text-[14px] font-extrabold text-ink hover:border-blue"
            >
              {w}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ теория ------ */

function Theorie({
  topic,
  gatedDep,
  onStart,
  onBack,
}: {
  topic: DeTopic;
  /** заголовок темы, чья Themen-Prüfung ещё не сдана (блокирует практику) */
  gatedDep?: string | null;
  onStart: () => void;
  onBack: () => void;
}) {
  const t = hasTheory(topic.id) ? THEORY[topic.id] : null;
  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
      >
        ← Weg
      </button>

      <div className="card3d rounded-card border border-line bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Kicker>
              {topic.level} · Regel{topic.exam ? ` · Aufgabe ${topic.exam}` : ""}
            </Kicker>
            <h1 className="mt-1 text-[22px] leading-tight font-extrabold">{topic.de}</h1>
          </div>
          <span className="shrink-0 rounded-full bg-bg px-2 py-0.5 text-[10px] font-extrabold text-muted">
            {topic.ru}
          </span>
        </div>

        {!t ? (
          <p className="mt-4 rounded-xl bg-bg p-3 text-[13px] font-semibold text-muted">
            Теория к этой теме ещё не написана. Задания уже есть — можно
            попробовать сразу, но без правила будет тяжело.
          </p>
        ) : (
          <>
            <div className="mt-4 rounded-xl border-2 border-green bg-greenl p-3">
              <Kicker>Regel</Kicker>
              <p className="mt-1.5 text-[14px] leading-[1.7] font-bold text-ink">{t.regel}</p>
            </div>

            {/* немецкое правило и русский разбор — разные блоки с ярлыками,
                а не стена текста вперемешку */}
            <div className="mt-3 rounded-xl bg-bg p-3">
              <Kicker>По-русски</Kicker>
              <p className="mt-1.5 text-[13.5px] leading-[1.7] font-semibold text-ink/85">
                {t.ru}
              </p>
            </div>

            {t.tabelle && (
              <div className="mt-4">
                <Kicker>Tabelle</Kicker>
                <div className="mt-1.5 overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr>
                      {t.tabelle.head.map((h) => (
                        <th
                          key={h}
                          className="border-b border-line px-2 py-1.5 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.tabelle.rows.map((r, i) => (
                      <tr key={i} className={i % 2 ? "bg-bg/60" : ""}>
                        {r.map((c, j) => (
                          <td
                            key={j}
                            className={cn(
                              "border-b border-line/60 px-2 py-1.5 font-bold",
                              j === 0 ? "text-muted" : "text-ink",
                            )}
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}

            <div className="mt-5">
              <Kicker>Beispiele</Kicker>
              <ul className="mt-1.5 space-y-1.5">
                {t.beispiele.map((b, i) => (
                  <li key={i} className="border-l-2 border-blue pl-3">
                    <p className="text-[14px] font-extrabold">{b.de}</p>
                    <p className="text-[11.5px] font-semibold text-muted">{b.ru}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <Kicker>Typische Fehler</Kicker>
              <ul className="mt-1.5 space-y-1.5">
                {t.fehler.map((f, i) => (
                  <li key={i} className="flex gap-2 text-[12.5px] leading-[1.55] font-semibold">
                    <span className="mt-[2px] shrink-0 font-extrabold text-red">✕</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {t.merk && (
              <p className="mt-4 rounded-xl bg-gold/15 px-3 py-2 text-[12.5px] leading-[1.55] font-bold text-ink">
                Merken: {t.merk}
              </p>
            )}
          </>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onStart}
            disabled={!drillable(topic) || !!gatedDep}
            className="btn3d btn3d-green flex-1 rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em] disabled:opacity-60"
          >
            {gatedDep
              ? `Сначала Prüfung: «${gatedDep}»`
              : drillable(topic)
                ? `Jetzt üben · ${ROUND} Aufgaben`
                : "Aufgaben folgen"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- раунд ----- */

function Runde({
  topic,
  onDone,
  onQuit,
  onBack,
}: {
  topic: DeTopic;
  onDone: (correct: number, total: number) => void;
  /** выход посреди раунда: (верно, решено) — решённое не пропадает */
  onQuit: (correct: number, solved: number) => void;
  onBack: () => void;
}) {
  /* Раунд начинается с заваленных упражнений этой темы (до 2 штук) —
     иначе история ошибок никогда не возвращается к ученику. */
  const [items] = useState<Item[]>(() => {
    const fresh = makeRound(topic.id, topic.gen, ROUND);
    const errs = peekFehler(topic.id, 2).map((x) => ({ ...x, topic: topic.id, retry: true }));
    return [...errs, ...fresh].slice(0, ROUND);
  });
  const [idx, setIdx] = useState(0);
  const [values, setValues] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [res, setRes] = useState<Judge[]>([]);
  const [correct, setCorrect] = useState(0);
  /** какие плашки взяты в ответ (порядок = порядок в ответе) */
  const [used, setUsed] = useState<number[]>([]);
  /* маскот в шапке раунда: радуется верному ответу, расстраивается за промах */
  const mascot = useMascot();
  const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
  const mascotTimer = useRef<number | undefined>(undefined);

  const cur = items[idx];

  useEffect(() => {
    setValues((cur?.gaps ?? []).map(() => ""));
    setChecked(false);
    setUsed([]);
    window.clearTimeout(mascotTimer.current);
    setMascotMood("idle");
  }, [idx, cur]);

  useEffect(
    () => () => {
      window.clearTimeout(mascotTimer.current);
    },
    [],
  );

  /* режим подачи и его материал (см. комментарий у Mode) */
  const mode: Mode = useMemo(() => {
    if (!cur || cur.gaps.length !== 1) return "input";
    const answer = cur.gaps[0][0] ?? "";
    const words = answer.trim().split(/\s+/).length;
    if (answer.includes(" ") && words >= 4 && hash(cur.text) % 2 === 0) return "order";
    if ((cur.traps?.length ?? 0) >= 2 && hash(cur.text) % 5 < 3) return "choice";
    return "input";
  }, [cur]);

  const options = useMemo(() => {
    if (mode !== "choice" || !cur) return [];
    const right = cur.gaps[0].filter(Boolean)[0] ?? "";
    const wrongs = (cur.traps ?? [])
      .map((t) => t.wrong)
      .filter((w) => norm(w) !== norm(right));
    return seededShuffle([right, ...wrongs], hash(cur.text)).slice(0, 4);
  }, [cur, mode]);

  const chips = useMemo(
    () =>
      mode === "order" && cur
        ? seededShuffle((cur.gaps[0][0] ?? "").trim().split(/\s+/), hash(cur.text))
        : [],
    [cur, mode],
  );

  /* мало различимых вариантов — честнее печать */
  const effMode: Mode = mode === "choice" && options.length < 3 ? "input" : mode;

  const takeChip = (i: number) => {
    if (checked) return;
    const nextUsed = [...used, i];
    setUsed(nextUsed);
    setValues(nextUsed.map((k) => chips[k]));
  };

  const backChip = (pos: number) => {
    if (checked) return;
    const nextUsed = used.filter((_, k) => k !== pos);
    setUsed(nextUsed);
    setValues(nextUsed.map((k) => chips[k]));
  };

  const submit = useCallback(() => {
    if (!cur || checked) return;
    const r = cur.gaps.map((g, i) => judge(values[i] ?? "", g));
    setRes(r);
    setChecked(true);
    window.clearTimeout(mascotTimer.current);
    setMascotMood(r.every((x) => x === "ok") ? "cheer" : "sad");
    mascotTimer.current = window.setTimeout(() => setMascotMood("idle"), 1600);
    /* «case» — отличие только заглавной буквой — это НЕ зачёт: регистр в
       немецком смысловой (sie ≠ Sie, Haus ≠ haus). */
    if (r.every((x) => x === "ok")) {
      setCorrect((c) => c + 1);
      /* из истории ошибок решено верно — вычёркиваем */
      if (cur.retry) dropFehler(topic.id, cur.text);
    } else {
      saveFehler(topic.id, cur);
    }
  }, [cur, checked, values, topic.id]);

  const next = useCallback(() => {
    if (idx + 1 >= items.length) {
      onDone(correct, items.length);
      return;
    }
    setIdx((i) => i + 1);
  }, [idx, items.length, correct, onDone]);

  if (!cur) {
    return (
      <div className="mx-auto w-full max-w-[680px] px-4 py-10">
        <p className="text-[13px] font-bold text-muted">Задания не собрались.</p>
        <button type="button" onClick={onBack} className="mt-3 text-[12px] font-extrabold text-blue">
          ← назад
        </button>
      </div>
    );
  }

  const states: ("idle" | "ok" | "case" | "bad")[] = checked
    ? cur.gaps.map((_, i) => res[i] ?? "bad")
    : cur.gaps.map(() => "idle");
  /* жёлтый вердикт: всё совпало бы, кроме заглавных букв */
  const caseOnly =
    checked && res.length > 0 && res.every((x) => x !== "bad") && res.some((x) => x === "case");

  /* разбор именно введённого неверного ответа, если он в ловушках задания */
  const trapNote = (i: number): string | null => {
    if (!cur?.traps) return null;
    const typed = (values[i] ?? "").trim();
    if (!typed) return null;
    const hit = cur.traps.find((t) => norm(typed) === norm(t.wrong));
    return hit ? hit.note : null;
  };

  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-6">
      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          /* выход посреди раунда: решённое засчитывается, а не пропадает */
          onClick={() => (idx > 0 ? onQuit(correct, idx) : onBack())}
          className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
        >
          ← Weg
        </button>
        <Mascot char={mascot} mood={mascotMood} className="ml-auto h-[44px] w-auto shrink-0" />
        <span className="text-[11px] font-extrabold text-muted">
          {idx + 1} / {items.length}
        </span>
      </div>

      <div className="mb-3 flex gap-1">
        {items.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i < idx ? "bg-green" : i === idx ? "bg-green/40" : "bg-line",
            )}
          />
        ))}
      </div>

      <div className="card3d rounded-card border border-line bg-card p-5">
        <div className="flex items-baseline justify-between gap-3">
          <Kicker>{cur.task}</Kicker>
          {cur.hint && (
            <span className="shrink-0 text-[11px] font-extrabold text-blue">{cur.hint}</span>
          )}
        </div>

        <div className="mt-3">
          {effMode === "choice" ? (
            <>
              <ChoiceSentence
                text={cur.text}
                value={values[0] ?? ""}
                checked={checked}
                correct={cur.gaps[0].filter(Boolean)[0] ?? ""}
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {options.map((o) => {
                  const picked = (values[0] ?? "") === o;
                  const isRight = norm(o) === norm(cur.gaps[0].filter(Boolean)[0] ?? "");
                  return (
                    <button
                      key={o}
                      type="button"
                      disabled={checked}
                      onClick={() => setValues([o])}
                      className={cn(
                        "rounded-xl border-2 px-3 py-3 text-[15px] font-extrabold transition",
                        checked
                          ? isRight
                            ? "border-green bg-greenl text-greend"
                            : picked
                              ? "border-red bg-redl text-red"
                              : "border-line bg-card text-muted"
                          : picked
                            ? "border-blue bg-blue/10 text-blue"
                            : "border-line bg-card text-ink hover:border-muted",
                      )}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </>
          ) : effMode === "order" ? (
            <>
              <p className="text-[clamp(17px,2.2vw,21px)] font-bold leading-[1.9]">
                {cur.text.split(/\{\d+\}/)[0].replace(/\n/g, "  ")}
              </p>
              <ChipOrder chips={chips} used={used} disabled={checked} onTake={takeChip} onBack={backChip} />
            </>
          ) : (
            <Sentence
              key={idx}
              text={cur.text}
              values={values}
              onChange={(i, v) => setValues((p) => p.map((x, k) => (k === i ? v : x)))}
              states={states}
              disabled={checked}
              wide={cur.gaps.some((g) => (g[0] ?? "").includes(" "))}
              onEnter={() => {
                if (!checked && values.every((v) => !v.trim())) return;
                if (checked) next();
                else submit();
              }}
            />
          )}
        </div>

        {checked && (
          <div
            className={cn(
              "mt-4 rounded-xl border-2 p-3",
              res.every((x) => x === "ok")
                ? "border-green bg-greenl"
                : caseOnly
                  ? "border-gold bg-gold/10"
                  : "border-red bg-redl",
            )}
          >
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em]">
              {res.every((x) => x === "ok")
                ? "Richtig"
                : caseOnly
                  ? "Fast — только большая буква"
                  : "Noch nicht"}
            </p>
            {caseOnly && (
              <p className="mt-1 text-[13px] font-extrabold">
                {cur.gaps
                  .map((g, i) => {
                    if (res[i] !== "case") return null;
                    const typed = (values[i] ?? "").trim();
                    const right = g.filter(Boolean)[0] ?? "";
                    const big = !!right && right[0] === right[0].toUpperCase();
                    return `«${typed || "…"}» → пишется «${right}» (${big ? "с большой буквы" : "с маленькой"}).`;
                  })
                  .filter(Boolean)
                  .join(" ")}
                {" В немецком регистр меняет слово: sie ≠ Sie, Haus ≠ haus."}
              </p>
            )}
            {!res.every((x) => x === "ok") && !caseOnly && (
              <>
                {cur.gaps
                  .map((_, i) => trapNote(i))
                  .filter(Boolean)
                  .map((n, k) => (
                    <p key={k} className="mt-1 text-[13px] leading-[1.5] font-extrabold">
                      {n}
                    </p>
                  ))}
                <p className="mt-1 text-[13px] font-extrabold">
                  {cur.gaps
                    .map((g, i) => (res[i] === "ok" ? null : g.filter(Boolean)[0] ?? "(leer)"))
                    .filter(Boolean)
                    .join("  ·  ")}
                </p>
              </>
            )}
            <p className="mt-1.5 text-[12.5px] leading-[1.55] font-semibold text-ink/80">
              {cur.why}
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {checked ? (
            <button
              type="button"
              onClick={next}
              className="btn3d btn3d-green flex-1 rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
            >
              {idx + 1 >= items.length ? "Fertig" : "Weiter"}
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={
                effMode === "choice"
                  ? !(values[0] ?? "").trim()
                  : effMode === "order"
                    ? used.length !== chips.length
                    : values.every((v) => !v.trim())
              }
              className="btn3d btn3d-green flex-1 rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
            >
              Prüfen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- итог ----- */

function Fertig({
  topic,
  correct,
  total,
  snap,
  onAgain,
  onBack,
}: {
  topic: DeTopic;
  correct: number;
  total: number;
  /** снимок мотивации после начисления XP — как в математическом итоге */
  snap?: Snap;
  onAgain: () => void;
  onBack: () => void;
}) {
  const acc = total ? correct / total : 0;
  const pass = acc >= DE_PASS;
  /* маскот празднует зачёт и грустит на незачёте — паритет с финалом тютора */
  const mascot = useMascot();
  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-10">
      <div className="card3d rounded-card border border-line bg-card p-6 text-center">
        <Mascot
          char={mascot}
          mood={pass ? "cheer" : "sad"}
          className="mx-auto h-[110px] w-auto shrink-0"
        />
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
          {topic.de}
        </p>
        <p className="tnum mt-2 text-[44px] leading-none font-extrabold">
          {correct}
          <span className="text-[22px] text-muted"> / {total}</span>
        </p>
        <p className={cn("mt-2 text-[13px] font-extrabold", pass ? "text-greend" : "text-red")}>
          {pass
            ? "Тема засчитана. Вернёшься на повторение — по расписанию."
            : `Нужно ${Math.round(DE_PASS * 100)} % — пока рано закрывать.`}
        </p>
        {snap && (
          <p className="mt-3 text-[12px] font-extrabold text-muted">
            +{snap.xp} XP · сегодня {snap.todayXp}/{snap.goal} · серия {snap.streak}
          </p>
        )}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onAgain}
            className="btn3d btn3d-white flex-1 rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
          >
            Ещё раз
          </button>
          <button
            type="button"
            onClick={onBack}
            className="btn3d btn3d-green flex-1 rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
          >
            Zum Weg
          </button>
        </div>
      </div>
    </div>
  );
}

/** первая не-сданная зависимость темы — кого пройти, чтобы открыть практику */
function gatedDepFor(t: DeTopic, m: DeM): string | null {
  if (statusDe(t, m) !== "locked") return null;
  for (const d of t.deps) {
    const dd = deById[d];
    if (dd && drillable(dd) && !m[d]?.pf) return dd.de;
  }
  return null;
}

/* ------------------------------------------------------------- экран ----- */

const STATUS_DOT: Record<string, string> = {
  mastered: "bg-green",
  review: "bg-gold",
  open: "bg-blue",
  locked: "bg-line/40",
  soon: "bg-line",
};

const STATUS_RU: Record<string, string> = {
  mastered: "закрыто",
  review: "пора повторить",
  open: "можно сейчас",
  locked: "нужна Prüfung предыдущей темы",
  soon: "задания в работе",
};

export default function Deutsch({
  onXp,
  initialPhase = "weg",
}: {
  /** начисление XP/серии за раунд — машина живёт в App (addXp), сюда приходит снимок.
      xp переопределяет формулу: экзаменационные разделы (DeutschExam) считают от доли. */
  onXp?: (correct: number, total: number, xp?: number) => Snap;
  /** стартовый экран (оставлен для совместимости вызовов) */
  initialPhase?: "weg" | "vocab";
}) {
  const [level, setLevel] = useState<Level>("B1");
  const [m, setM] = useState<DeM>(() => loadDe());
  const [topic, setTopic] = useState<DeTopic | null>(null);
  const [phase, setPhase] = useState<"weg" | "theorie" | "runde" | "fertig" | "examen" | "vocab">(
    initialPhase,
  );
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [snap, setSnap] = useState<Snap | undefined>(undefined);

  const list = useMemo(() => byLevel(level), [level]);
  const counts = useMemo(() => countsDe(m), [m]);
  const cur = useMemo(() => currentDe(m, level), [m, level]);
  /* по уровню: темы с генераторами, где сглаженная точность уже проходит
     порог — без затухания, «пора повторить» остаётся пройденной темой */
  const levelStats = useMemo(() => {
    const drill = list.filter((t) => drillable(t) && t.gen.length > 0 && hasGen(t.gen[0]));
    return {
      done: drill.filter((t) => {
        const r = m[t.id];
        return r && r.p >= DE_PASS;
      }).length,
      total: drill.length,
    };
  }, [list, m]);

  const open = (t: DeTopic) => {
    setTopic(t);
    setPhase("theorie");
  };

  const finish = (correct: number, total: number) => {
    if (topic) {
      let next = recordDe(m, topic.id, correct, total);
      /* Themen-Prüfung: раунд 5 из 6 и лучше — финальная проверка темы
         сдана, следующая тема открывается (гейт хозяина 04.11) */
      if (total > 0 && correct / total >= 5 / 6) {
        next = { ...next, [topic.id]: { ...next[topic.id], pf: true } };
      }
      setM(next);
      saveDe(next);
    }
    setScore({ correct, total });
    setSnap(onXp ? onXp(correct, total) : undefined);
    setPhase("fertig");
  };

  if (phase === "examen") {
    return (
      <DeutschExam
        onXp={onXp ?? (() => ({}) as Snap)}
        onBack={() => setPhase("weg")}
      />
    );
  }

  if (phase === "vocab") {
    return <Vocab onBack={() => setPhase("weg")} onXp={onXp} />;
  }

  if (topic && phase === "theorie") {
    return (
      <Theorie
        topic={topic}
        gatedDep={gatedDepFor(topic, m)}
        onBack={() => setPhase("weg")}
        onStart={() => setPhase("runde")}
      />
    );
  }

  if (topic && phase === "runde") {
    return (
      <Runde
        topic={topic}
        onDone={finish}
        /* выход посреди раунда — решённое идёт в прогресс (без XP) */
        onQuit={(c, s) => {
          if (s > 0) {
            const next = recordDe(m, topic.id, c, s);
            setM(next);
            saveDe(next);
          }
          setPhase("weg");
        }}
        onBack={() => setPhase("weg")}
      />
    );
  }

  if (topic && phase === "fertig") {
    return (
      <Fertig
        topic={topic}
        correct={score.correct}
        total={score.total}
        snap={snap}
        onAgain={() => setPhase("runde")}
        onBack={() => setPhase("weg")}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-6">
      <PageHeader
        kicker="Deutsch"
        title="Grammatik"
        sub="A1–C1 · экзамен 09.01.2027 · задания 3.1–3.4 дают 30 из 100 баллов"
      />

      <Tabs
        className="mt-8"
        items={LEVELS.map((lv) => ({ id: lv, label: lv }))}
        value={level}
        onChange={(lv) => setLevel(lv as typeof LEVELS[number])}
      />
      <p className="tnum mt-2 text-right text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted">
        {level}: пройдено {levelStats.done} из {levelStats.total} · всего {counts.done}/{counts.total}
      </p>

      {cur && (
        <div className="jd mt-6 rounded-card p-5">
          <div className="flex items-baseline justify-between">
            <Kicker>Jetzt dran</Kicker>
            <span className="text-[10px] font-extrabold">
              {statusDe(cur, m) === "review" ? "Wiederholung" : "neu"}
            </span>
          </div>
          <p className="mt-1 font-display text-[18px] leading-tight">{cur.de}</p>
          <p className="text-[12px] font-semibold">{cur.ru}</p>
          <button
            type="button"
            onClick={() => open(cur)}
            className="btn3d mt-3 w-full rounded-xl bg-card py-3 text-[12px] font-extrabold uppercase tracking-[0.1em] text-ink [--btn-shadow:#0000004d]"
          >
            Weiter · {cur.de}
          </button>
        </div>
      )}

      <div className="mt-4 space-y-1.5">
        {list.map((t) => {
          const st = statusDe(t, m);
          const rec = m[t.id];
          const exam = (EXAM_CORE as readonly string[]).includes(t.id);
          const ready = drillable(t) && t.gen.length > 0 && hasGen(t.gen[0]);
          const hint = depsHint(t, m);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => open(t)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border-2 bg-card px-3 py-2.5 text-left transition",
                "border-line hover:border-muted",
                st === "mastered" && "border-green/40",
              )}
            >
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", STATUS_DOT[st])} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="truncate text-[13.5px] font-extrabold">{t.de}</span>
                  {exam && (
                    <span className="shrink-0 rounded bg-gold/25 px-1 text-[9px] font-extrabold text-ink">
                      {t.exam ?? "Examen"}
                    </span>
                  )}
                </span>
                <span className="block truncate text-[11px] font-semibold text-muted">
                  {t.ru}
                  {/* Три состояния, а не два. «теория есть, заданий нет» на теме,
                      где нет ни того, ни другого, — это враньё, из-за которого
                      кажется, что приложение сломано. */}
                  {ready
                    ? ` · ${STATUS_RU[st]}`
                    : hasTheory(t.id)
                      ? " · теория есть, заданий нет"
                      : " · в работе"}
                  {hint && ready && ` · сначала: ${hint}`}
                </span>
              </span>
              {rec && rec.p > 0 && (
                <span className="tnum shrink-0 text-[10px] font-extrabold text-muted">
                  {Math.round(pNowDe(rec) * 100)}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-5 px-1 text-[10px] leading-[1.5] font-bold text-muted">
        Уровни выше B1 в экзамене не встречаются. Они здесь, чтобы можно было
        вернуться и добить то, в чём не уверен, — а не потому, что это спросят.
      </p>
    </div>
  );
}
