/* ============================================================================
   PRÜFUNG — разделы немецкого экзамена, которые детерминированы
   ----------------------------------------------------------------------------
   Пока здесь два раздела: 2. Leseverstehen (20 P) и 4.1 Lückentext (7 P).
   Вместе с Grammatik (30 P) и Gegenteilen 4.2 (6 P) это 63 из 100 баллов,
   которые приложение закрывает БЕЗ единого аудиофайла. Hörverstehen и
   Schreiben отдельно — аудио хозяин просил генерировать отдельным шагом.

   Проверка точная и офлайн: утверждение либо противоречит тексту, либо нет.
   Формат повторяет Runde (по одному утверждению, разбор сразу), потому что
   он уже прижился, — но без таймера: смысл экзаменационного режима здесь
   «научиться читать правильно», а не «успеть».
   ========================================================================== */

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import PageHeader from "@/PageHeader";
import { LESEN, type LesenText } from "@/lib/de/exam-lesen";
import { LUECK, type LueckText } from "@/lib/de/exam-lueck";
import { SCHREIBEN, type SchreibenAufgabe } from "@/lib/de/exam-schreiben";
import DeutschHoer from "@/DeutschHoer";
import { check, judge, makeItem, makeRound, type Item, type Judge } from "@/lib/de/gen";
import { byLevel, drillable, type Level } from "@/lib/de/topics";
import { addCustomWord, guessArticle, lookupWord } from "@/lib/vocab/bank";
import type { Snap } from "@/lib/motivation";
import Mascot from "@/mascot/Mascot";
import { useMascot } from "@/mascot/store";

type Part = { id: string; num: string; de: string; ru: string; pts: number | string };

const PARTS: Part[] = [
  { id: "hoer", num: "1", de: "Hörverstehen", ru: "Diktat + MC + Dialoge · аудио", pts: 25 },
  { id: "lesen", num: "2", de: "Leseverstehen", ru: "Текст + 20 утверждений richtig/falsch", pts: 20 },
  { id: "lueck", num: "4.1", de: "Lückentext", ru: "Текст с 7 пропусками a/b/c", pts: 7 },
  { id: "schreiben", num: "5", de: "Schreiben", ru: "Bildergeschichte + чек-лист самопроверки", pts: 12 },
  { id: "grammatik", num: "3+", de: "Grammatik-Mix", ru: "разные времена и формы вперемешку", pts: "—" },
  { id: "stufe", num: "★", de: "Grammatik-Prüfung по уровню", ru: "A1–C1: 10 заданий вперемешку, 5 минут", pts: "—" },
];

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">{children}</p>
  );
}

/* ------------------------------------------------------------- lesen ----- */

/** нормализуем тапнутое слово: пунктуацию срезаем, дефисы оставляем */
function cleanToken(t: string): string {
  const m = /[A-Za-zÄÖÜäöüß]+(?:[-'’][A-Za-zÄÖÜäöüß]+)*/.exec(t);
  return m ? m[0] : "";
}

/** карточка слова: перевод из словарей, угаданный артикль, отправка в словарь.
    Фиксирована снизу, чтобы на телефоне попасть в неё большим пальцем. */
function WordPopup({ raw, onClose }: { raw: string; onClose: () => void }) {
  const bare = cleanToken(raw);
  const hit = lookupWord(bare);
  const de = hit?.word.de ?? bare;
  const ru = hit?.word.ru ?? "";
  const note = hit?.word.note;
  const guess = hit ? null : guessArticle(bare);
  const [added, setAdded] = useState(false);
  return (
    <div className="fixed inset-x-3 bottom-3 z-30 rounded-card border-2 border-blue bg-card p-4 shadow-lg">
      <div className="flex items-baseline gap-2">
        <p className="text-[18px] font-extrabold">{de || bare}</p>
        {note && <span className="text-[10.5px] font-bold text-muted">{note}</span>}
        <button
          type="button"
          onClick={onClose}
          aria-label="закрыть"
          className="ml-auto shrink-0 text-[14px] font-extrabold text-muted"
        >
          ✕
        </button>
      </div>
      {ru ? (
        <p className="mt-1 text-[15px] font-bold">{ru}</p>
      ) : (
        <p className="mt-1 text-[12px] font-semibold text-muted">
          {guess
            ? `перевода в словаре нет · артикль, вероятно «${guess}» — проверь`
            : "перевода в словаре пока нет — добавь слово и заполни перевод"}
        </p>
      )}
      <button
        type="button"
        disabled={added || !bare}
        onClick={() => {
          const word =
            hit?.word ??
            {
              de: guess && !/^(der|die|das) /i.test(bare) ? `${guess} ${bare}` : bare,
              ru: "",
              note: guess ? "артикль по окончанию — проверь" : undefined,
            };
          if (addCustomWord(word)) setAdded(true);
        }}
        className="btn3d btn3d-green mt-3 w-full rounded-xl py-2.5 text-[11px] font-extrabold uppercase tracking-[0.08em] disabled:opacity-60"
      >
        {added ? "В словаре ✓" : "Не знаю · в словарь"}
      </button>
    </div>
  );
}

function LesenRun({
  text,
  onFinish,
  onBack,
}: {
  text: LesenText;
  onFinish: (correct: number, total: number) => void;
  onBack: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [showText, setShowText] = useState(true);
  /* тапнутое слово из текста — карточка с переводом и «в словарь» */
  const [word, setWord] = useState<string | null>(null);

  const cur = text.items[idx];
  const done = idx >= text.items.length;

  useEffect(() => {
    if (done) onFinish(correct, text.items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const answer = (v: boolean) => {
    if (picked !== null) return;
    setPicked(v);
    if (v === cur.ok) setCorrect((c) => c + 1);
  };

  if (done) {
    return (
      <div className="card3d rounded-card border border-line bg-card p-6 text-center">
        <p className="tnum text-[44px] leading-none font-extrabold">
          {correct}
          <span className="text-[22px] text-muted"> / {text.items.length}</span>
        </p>
        <button
          type="button"
          onClick={onBack}
          className="btn3d btn3d-green mt-5 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
        >
          Zur Übersicht
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
        >
          ← Prüfung
        </button>
        <span className="ml-auto tnum text-[11px] font-extrabold text-muted">
          {idx + 1} / {text.items.length} · {correct} richtig
        </span>
      </div>

      <div className="card3d rounded-card border border-line bg-card p-4 lg:p-6">
        <Kicker>{text.title} · {text.rubrik}</Kicker>
        <button
          type="button"
          onClick={() => setShowText((s) => !s)}
          className="mt-1 text-[11px] font-extrabold text-blue"
        >
          {showText ? "Text verbergen" : "Text zeigen"}
        </button>
        {showText && (
          <div className="mt-2 max-h-[38vh] overflow-y-auto pr-1">
            {text.text.split("\n\n").map((p, i) => (
              <p key={i} className="mb-2 text-[13.5px] leading-[1.65] font-semibold text-ink/90">
                {p.split(/(\s+)/).map((tok, j) =>
                  /^\s+$/.test(tok) ? (
                    <span key={j}>{tok}</span>
                  ) : (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setWord(tok)}
                      className="rounded px-0.5 text-left transition-colors hover:bg-blue/15 active:bg-blue/25"
                    >
                      {tok}
                    </button>
                  ),
                )}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="card3d rounded-card border border-line bg-card p-5">
        <p className="text-[16px] leading-[1.6] font-bold">{cur.stmt}</p>
        {picked === null ? (
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => answer(true)} className="btn3d btn3d-green flex-1 rounded-xl py-3 text-[12px] font-extrabold uppercase tracking-[0.1em]">
              Richtig
            </button>
            <button type="button" onClick={() => answer(false)} className="btn3d btn3d-white flex-1 rounded-xl py-3 text-[12px] font-extrabold uppercase tracking-[0.1em]">
              Falsch
            </button>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "mt-4 rounded-xl border-2 p-3",
                picked === cur.ok ? "border-green bg-greenl" : "border-red bg-redl",
              )}
            >
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em]">
                {picked === cur.ok ? "Richtig" : "Noch nicht"}
              </p>
              <p className="mt-1 text-[12.5px] leading-[1.55] font-semibold text-ink/80">{cur.why}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPicked(null);
                setIdx((i) => i + 1);
              }}
              className="btn3d btn3d-green mt-3 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
            >
              {idx + 1 >= text.items.length ? "Fertig" : "Weiter"}
            </button>
          </>
        )}
      </div>

      {word && <WordPopup raw={word} onClose={() => setWord(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------- lück ------ */

function LueckRun({
  text,
  onFinish,
  onBack,
}: {
  text: LueckText;
  onFinish: (correct: number, total: number) => void;
  onBack: () => void;
}) {
  const [picked, setPicked] = useState<(0 | 1 | 2)[]>(() => text.gaps.map(() => 0));
  const [checked, setChecked] = useState(false);

  const correct = useMemo(
    () => text.gaps.filter((g, i) => picked[i] === g.correct).length,
    [picked, text],
  );

  const parts = text.text.split(/(\{\d+\})/g);
  const done = checked;

  useEffect(() => {
    if (done) onFinish(correct, text.gaps.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
        >
          ← Prüfung
        </button>
        <span className="ml-auto text-[11px] font-extrabold text-muted">{text.title}</span>
      </div>

      <div className="card3d rounded-card border border-line bg-card p-5">
        <Kicker>Lückentext · Wähle a, b oder c</Kicker>
        <p className="mt-3 text-[15px] leading-[2.1] font-bold">
          {parts.map((p, k) => {
            const m = /^\{(\d+)\}$/.exec(p);
            if (!m) return <span key={k}>{p}</span>;
            const i = Number(m[1]);
            const g = text.gaps[i];
            const good = picked[i] === g.correct;
            return (
              <span key={k} className="mx-1 inline-flex flex-col gap-0.5 align-baseline">
                <select
                  value={picked[i]}
                  disabled={checked}
                  onChange={(e) =>
                    setPicked((prev) => prev.map((x, j) => (j === i ? (Number(e.target.value) as 0 | 1 | 2) : x)))
                  }
                  className={cn(
                    "rounded-lg border-2 bg-card px-1 py-0.5 text-[13px] font-extrabold outline-none",
                    checked
                      ? good
                        ? "border-green text-greend"
                        : "border-red text-red"
                      : "border-blue/60 focus:border-blue",
                  )}
                >
                  {g.options.map((o, oi) => (
                    <option key={oi} value={oi}>
                      {String.fromCharCode(97 + oi)}) {o}
                    </option>
                  ))}
                </select>
              </span>
            );
          })}
        </p>

        {!checked ? (
          <button
            type="button"
            onClick={() => setChecked(true)}
            className="btn3d btn3d-green mt-4 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
          >
            Prüfen
          </button>
        ) : (
          <>
            <div className="mt-4 space-y-2">
              {text.gaps.map((g, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl border-2 p-2.5",
                    picked[i] === g.correct ? "border-green bg-greenl" : "border-red bg-redl",
                  )}
                >
                  <p className="text-[12px] font-extrabold">
                    {i + 1}. {String.fromCharCode(97 + g.correct)}) {g.options[g.correct]}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-[1.5] font-semibold text-ink/80">{g.why}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onBack}
              className="btn3d btn3d-green mt-3 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
            >
              Zur Übersicht
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- schreiben ---- */

function SchreibenRun({
  aufgabe,
  onFinish,
  onBack,
}: {
  aufgabe: SchreibenAufgabe;
  onFinish: () => void;
  onBack: () => void;
}) {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState<boolean[]>(() => aufgabe.checklist.map(() => false));
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const allChecked = checked.every(Boolean);
  const key = "tally.schreiben." + aufgabe.title;

  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify({ date: new Date().toISOString(), text, checked }));
    } catch {
      /* приватный режим — черновик не сохранится, это не блокер */
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
        >
          ← Prüfung
        </button>
        <span className="ml-auto text-[11px] font-extrabold text-muted">{aufgabe.title}</span>
      </div>

      <div className="card3d rounded-card border border-line bg-card p-4 lg:p-6">
        <Kicker>Bildergeschichte · 6 Bilder</Kicker>
        <p className="mt-2 text-[12px] leading-[1.55] font-semibold text-muted">{aufgabe.intro}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {aufgabe.scenes.map((sc, i) => (
            <div key={i} className="rounded-xl border border-line bg-bg/60 p-2.5">
              <p className="tnum text-[10px] font-extrabold text-muted">Bild {i + 1}</p>
              <p className="mt-1 text-[12px] leading-[1.45] font-bold">{sc.caption}</p>
              <p className="mt-1 text-[10.5px] leading-[1.4] font-semibold text-muted">{sc.ru}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card3d rounded-card border border-line bg-card p-4 lg:p-6">
        <Kicker>Deine Geschichte · {words} Wörter</Kicker>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={9}
          spellCheck={false}
          placeholder="Im Frühjahr habe ich …"
          className="mt-2 w-full rounded-xl border border-line bg-card p-3 text-[14px] font-semibold leading-[1.6] outline-none placeholder:text-[12px] placeholder:text-muted focus:border-blue"
        />
      </div>

      <div className="card3d rounded-card border border-line bg-card p-4 lg:p-6">
        <Kicker>Selbstkontrolle — честно: экзаменатор проверяет именно это</Kicker>
        <div className="mt-2 space-y-1.5">
          {aufgabe.checklist.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setChecked((prev) => prev.map((x, j) => (j === i ? !x : x)))}
              className={cn(
                "flex w-full items-start gap-2 rounded-xl border-2 px-3 py-2 text-left transition",
                checked[i] ? "border-green bg-greenl" : "border-line hover:border-muted",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-extrabold",
                  checked[i] ? "bg-green text-white" : "border border-line bg-card text-transparent",
                )}
              >
                ✓
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-extrabold">{c.de}</span>
                <span className="block text-[11px] font-semibold text-muted">{c.ru}</span>
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={words < 60 || !allChecked}
          onClick={() => {
            save();
            onFinish();
          }}
          className="btn3d btn3d-green mt-3 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em] disabled:opacity-50"
        >
          {words < 60
            ? "Минимум 60 слов · сейчас " + words
            : allChecked
              ? "Speichern"
              : "Пройди чек-лист честно"}
        </button>
        <p className="mt-2 text-[10.5px] leading-[1.5] font-semibold text-muted">
          Свободный текст машина точно не проверит — поэтому здесь проверяешь
          себя ты, по критериям экзаменатора. Черновик сохраняется в браузере.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- grammatik-mix -- */

function GrammRun({
  items,
  onBack,
}: {
  items: Item[];
  onBack: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [values, setValues] = useState<string[]>(() => (items[0]?.gaps ?? []).map(() => ""));
  const [checked, setChecked] = useState(false);
  const [okList, setOkList] = useState<boolean[]>([]);
  const [correct, setCorrect] = useState(0);

  const cur = items[Math.min(idx, items.length - 1)];
  const done = idx >= items.length;

  const res = useMemo(
    () => (cur ? cur.gaps.map((g, i) => check(values[i] ?? "", g)) : []),
    [cur, values],
  );

  const submit = () => {
    if (checked || !cur) return;
    setOkList(res);
    setChecked(true);
    if (res.every(Boolean)) setCorrect((c) => c + 1);
  };

  if (done) {
    return (
      <div className="card3d rounded-card border border-line bg-card p-6 text-center">
        <p className="tnum text-[44px] leading-none font-extrabold">
          {correct}
          <span className="text-[22px] text-muted"> / {items.length}</span>
        </p>
        <button type="button" onClick={onBack} className="btn3d btn3d-green mt-5 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]">
          Zur Übersicht
        </button>
      </div>
    );
  }

  const wide = cur.gaps.some((g) => (g[0] ?? "").includes(" "));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink">
          ← Prüfung
        </button>
        <span className="ml-auto tnum text-[11px] font-extrabold text-muted">
          {idx + 1} / {items.length} · {correct} richtig
        </span>
      </div>
      <div className="card3d rounded-card border border-line bg-card p-5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">{cur.task}</p>
        {cur.hint && <p className="mt-1 text-[12px] font-extrabold text-blue">{cur.hint}</p>}
        <p className={cn("mt-3 font-bold", wide ? "text-[15px] leading-[1.9]" : "text-[16px] leading-[2.2]")}>
          {cur.text.split(/(\{\d+\})/g).map((part, k) => {
            const m = /^\{(\d+)\}$/.exec(part);
            if (!m) return <span key={k}>{part}</span>;
            const i = Number(m[1]);
            const st = checked ? (okList[i] ? "ok" : "bad") : "idle";
            return wide ? (
              <input
                key={k}
                value={values[i] ?? ""}
                disabled={checked}
                onChange={(e) => setValues((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder="ganzer Satz …"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                className={cn(
                  "my-1 block w-full rounded-lg border-b-2 bg-transparent px-1 text-left text-[14px] font-extrabold outline-none placeholder:text-[11px] placeholder:uppercase placeholder:tracking-[0.1em] placeholder:text-muted",
                  st === "ok" ? "border-green text-greend" : st === "bad" ? "border-red text-red" : "border-blue/60 focus:border-blue",
                )}
              />
            ) : (
              <input
                key={k}
                value={values[i] ?? ""}
                disabled={checked}
                onChange={(e) => setValues((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                className={cn(
                  "mx-1 inline-block w-[16ch] rounded-lg border-b-2 bg-transparent px-1 text-center text-[14px] font-extrabold outline-none",
                  st === "ok" ? "border-green text-greend" : st === "bad" ? "border-red text-red" : "border-blue/60 focus:border-blue",
                )}
              />
            );
          })}
        </p>
        {!checked ? (
          <button type="button" onClick={submit} className="btn3d btn3d-green mt-3 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]">
            Prüfen
          </button>
        ) : (
          <>
            <div className={cn("mt-3 rounded-xl border-2 p-3", okList.every(Boolean) ? "border-green bg-greenl" : "border-red bg-redl")}>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em]">
                {okList.every(Boolean) ? "Richtig" : "Noch nicht"}
              </p>
              {!okList.every(Boolean) && (
                <p className="mt-1 text-[13px] font-extrabold">
                  {cur.gaps.map((g, i) => (okList[i] ? null : g[0])).filter(Boolean).join("  ·  ")}
                </p>
              )}
              <p className="mt-1.5 text-[12.5px] leading-[1.55] font-semibold text-ink/80">{cur.why}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setChecked(false);
                setOkList([]);
                setValues(items[Math.min(idx + 1, items.length - 1)]?.gaps.map(() => "") ?? []);
                setIdx((i) => i + 1);
              }}
              className="btn3d btn3d-green mt-3 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
            >
              {idx + 1 >= items.length ? "Fertig" : "Weiter"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ экран ------ */

/* Итог раздела экзамена: маскот празднует + строка XP. Разделы длинные,
   итог одинаковый после lesen/schreiben/lück/stufe — один компонент. */
function SnapLine({ snap }: { snap: Snap }) {
  const mascot = useMascot();
  return (
    <div className="mt-3 flex items-center justify-center gap-2">
      <Mascot
        char={mascot}
        mood={snap.xp > 0 ? "cheer" : "sad"}
        className="h-[40px] w-auto shrink-0"
      />
      <p className="text-[12px] font-extrabold text-muted">
        +{snap.xp} XP · сегодня {snap.todayXp}/{snap.goal} · серия {snap.streak}
      </p>
    </div>
  );
}

export default function DeutschExam({
  onXp,
  onBack,
  embedded = false,
}: {
  onXp: (correct: number, total: number, xp?: number) => Snap;
  onBack: () => void;
  /** встроен в хаб Prüfung — своя «← Weg» не нужна */
  embedded?: boolean;
}) {
  const [part, setPart] = useState<Part | null>(null);
  const [lesenIdx, setLesenIdx] = useState(0);
  const [lueckIdx, setLueckIdx] = useState(0);
  const [schreibenIdx, setSchreibenIdx] = useState(0);
  const [grammSeed, setGrammSeed] = useState(0);
  const grammItems = useMemo(() => makeRound("grammatik-mix", ["grammatikMix"], 6), [grammSeed]);
  const [snap, setSnap] = useState<Snap | null>(null);

  const finish = (total: number, correct: number) => {
    /* экзаменационный раздел длиннее раунда, поэтому XP считаем от доли:
       30 XP максимум — дневную цель одним Leseverstehen не закрыть,
       но серию день удержит */
    setSnap(onXp(correct, total, Math.round((correct / Math.max(1, total)) * 30)));
  };

  if (part?.id === "lesen") {
    const t = LESEN[lesenIdx % LESEN.length];
    return (
      <div className="mx-auto w-full max-w-[680px] px-4 py-6">
        <LesenRun
          key={`lesen-${lesenIdx}`}
          text={t}
          onFinish={(c, n) => finish(n, c)}
          onBack={() => {
            setPart(null);
            setSnap(null);
          }}
        />
        {snap && <SnapLine snap={snap} />}
      </div>
    );
  }

  if (part?.id === "grammatik") {
    return (
      <div className="mx-auto w-full max-w-[680px] px-4 py-6">
        <GrammRun
          key={"gramm-" + grammSeed}
          items={grammItems}
          onBack={() => setPart(null)}
        />
      </div>
    );
  }

  if (part?.id === "stufe") {
    return (
      <div className="mx-auto w-full max-w-[680px] px-4 py-6">
        <StufeRun onBack={() => setPart(null)} onXp={onXp} />
      </div>
    );
  }

  if (part?.id === "hoer") {
    return (
      <div className="mx-auto w-full max-w-[680px] px-4 py-6">
        <DeutschHoer onXp={onXp} onBack={() => setPart(null)} />
      </div>
    );
  }

  if (part?.id === "schreiben") {
    const t = SCHREIBEN[schreibenIdx % SCHREIBEN.length];
    return (
      <div className="mx-auto w-full max-w-[680px] px-4 py-6">
        <SchreibenRun
          key={"schreiben-" + schreibenIdx}
          aufgabe={t}
          onFinish={() => setSnap(onXp(1, 1, 20))}
          onBack={() => {
            setPart(null);
            setSnap(null);
          }}
        />
        {snap && <SnapLine snap={snap} />}
      </div>
    );
  }

  if (part?.id === "lueck") {
    const t = LUECK[lueckIdx % LUECK.length];
    return (
      <div className="mx-auto w-full max-w-[680px] px-4 py-6">
        <LueckRun
          key={`lueck-${lueckIdx}`}
          text={t}
          onFinish={(c, n) => finish(n, c)}
          onBack={() => {
            setPart(null);
            setSnap(null);
          }}
        />
        {snap && <SnapLine snap={snap} />}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-6">
      {!embedded && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
          >
            ← Weg
          </button>
        </div>
      )}
      <PageHeader
        kicker="Deutsch"
        title={embedded ? "Deutsch-Prüfung" : "Prüfung"}
        sub="Все 100 баллов немецкого экзамена закрыты в приложении"
      />

      <div className="mt-8 space-y-1.5">
        {PARTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              if (p.id === "grammatik") setGrammSeed((x) => x + 1);
              setPart(p);
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5 text-left transition hover:border-muted"
          >
            <span className="shrink-0 rounded bg-gold/25 px-1.5 py-0.5 text-[10px] font-extrabold text-ink">
              {p.num}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-extrabold">{p.de}</span>
              <span className="block truncate text-[11px] font-semibold text-muted">{p.ru}</span>
            </span>
            <span className="tnum shrink-0 text-[10px] font-extrabold text-muted">{p.pts} P</span>
          </button>
        ))}
      </div>

      {part === null && (
        <div className="mt-4">
          <Kicker>Text wählen</Kicker>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {LESEN.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setLesenIdx(i);
                  setPart(PARTS[0]);
                }}
                className="flex-1 rounded-xl border border-line bg-card px-2 py-2.5 text-left hover:border-muted"
              >
                <span className="block truncate text-[12px] font-extrabold">{t.title}</span>
                <span className="block text-[10px] font-semibold text-muted">{t.rubrik}</span>
              </button>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            {SCHREIBEN.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSchreibenIdx(i);
                  setPart(PARTS[2]);
                }}
                className="flex-1 rounded-xl border border-line bg-card px-2 py-2.5 text-left hover:border-muted"
              >
                <span className="block truncate text-[12px] font-extrabold">{t.title}</span>
                <span className="block text-[10px] font-semibold text-muted">5 · Schreiben</span>
              </button>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            {LUECK.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setLueckIdx(i);
                  setPart(PARTS[1]);
                }}
                className="flex-1 rounded-xl border border-line bg-card px-2 py-2.5 text-left hover:border-muted"
              >
                <span className="block truncate text-[12px] font-extrabold">{t.title}</span>
                <span className="block text-[10px] font-semibold text-muted">4.1 · Lückentext</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   GRAMMATIK-PRÜFUNG ПО УРОВНЮ
   ----------------------------------------------------------------------------
   Отличие от раунда темы: микс ВСЕХ генераторов уровня, таймер и вердикт по
   порогу. Это измерение, а не обучение, поэтому XP считается от доли (как у
   разделов экзамена), а ошибки уходят в историю ошибок темы.

   Почему 10 заданий и 5 минут: на реальном экзамене 30 баллов грамматики за
   ~20 минут, то есть ~40 с на задание. Здесь формат короткий, но темп тот же.
   История — последние 10 попыток на уровень, в localStorage.
   ========================================================================== */

const STUFEN_KEY = "tally.de.stufen-pruefung.v1";
const STUFE_N = 10;
const STUFE_SEC = 300;

type StufenRes = { date: number; score: number; total: number };
type StufenHist = Partial<Record<Level, StufenRes[]>>;

const loadStufen = (): StufenHist => {
  try {
    const raw = localStorage.getItem(STUFEN_KEY);
    const o = raw ? (JSON.parse(raw) as StufenHist) : {};
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
};

const saveStufen = (h: StufenHist): void => {
  try {
    localStorage.setItem(STUFEN_KEY, JSON.stringify(h));
  } catch {
    /* приватный режим */
  }
};

/** 10 заданий из генераторов уровня; повтор текста перекатывается */
function stufeItems(level: Level): Item[] {
  const topics = byLevel(level).filter((t) => drillable(t) && t.gen.length > 0);
  const out: Item[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < STUFE_N && guard < 160 && topics.length > 0) {
    guard++;
    const t = topics[out.length % topics.length];
    const it = makeItem(t.id, t.gen);
    if (!it || seen.has(it.text)) continue;
    seen.add(it.text);
    out.push(it);
  }
  return out;
}

const mmss = (s: number): string =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function StufeRun({
  onBack,
  onXp,
}: {
  onBack: () => void;
  onXp: (correct: number, total: number, xp?: number) => Snap;
}) {
  const [level, setLevel] = useState<Level | null>(null);
  const [seed, setSeed] = useState(0);
  const [hist, setHist] = useState<StufenHist>(() => loadStufen());

  if (!level) {
    return (
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
        >
          ← Prüfung
        </button>
        <h1 className="mt-3 text-[24px] leading-none font-extrabold tracking-[-0.01em]">
          Grammatik-Prüfung
        </h1>
        <p className="mt-1 text-[12px] font-semibold text-muted">
          {STUFE_N} заданий из генераторов уровня · {mmss(STUFE_SEC)} · зачёт от 80 %
        </p>
        <div className="mt-8 space-y-1.5">
          {(["A1", "A2", "B1", "B2", "C1"] as Level[]).map((lv) => {
            const last = hist[lv]?.[0];
            const ready = byLevel(lv).filter((t) => drillable(t) && t.gen.length > 0).length;
            return (
              <button
                key={lv}
                type="button"
                disabled={!ready}
                onClick={() => {
                  setLevel(lv);
                  setSeed((x) => x + 1);
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5 text-left transition hover:border-muted disabled:opacity-40"
              >
                <span className="shrink-0 rounded bg-gold/25 px-1.5 py-0.5 text-[10px] font-extrabold text-ink">
                  {lv}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-extrabold">
                    Prüfung {lv} starten
                  </span>
                  <span className="block truncate text-[11px] font-semibold text-muted">
                    {ready} тем с заданиями
                    {last
                      ? ` · последняя: ${last.score}/${last.total}`
                      : " · попыток ещё не было"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 px-1 text-[10px] leading-[1.5] font-bold text-muted">
          A1 и A2 — разминка: они не встречаются на экзамене, но именно там живут
          ошибки, которые ломают B1. C1 — запас на будущее.
        </p>
      </div>
    );
  }

  return (
    <StufeAttempt
      key={`${level}-${seed}`}
      level={level}
      onBack={() => {
        setHist(loadStufen());
        setLevel(null);
      }}
      onXp={onXp}
      onAgain={() => setSeed((x) => x + 1)}
    />
  );
}

function StufeAttempt({
  level,
  onBack,
  onAgain,
  onXp,
}: {
  level: Level;
  onBack: () => void;
  onAgain: () => void;
  onXp: (correct: number, total: number, xp?: number) => Snap;
}) {
  const items = useMemo(() => stufeItems(level), [level]);
  const [idx, setIdx] = useState(0);
  const [values, setValues] = useState<string[]>(() => (items[0]?.gaps ?? []).map(() => ""));
  const [checked, setChecked] = useState(false);
  const [res, setRes] = useState<Judge[]>([]);
  const [correct, setCorrect] = useState(0);
  const [left, setLeft] = useState(STUFE_SEC);
  const [saved, setSaved] = useState(false);
  const [snap, setSnap] = useState<Snap | undefined>(undefined);

  const done = idx >= items.length || left <= 0;
  const cur = items[Math.min(idx, items.length - 1)];

  /* таймер останавливается, когда попытка закончилась */
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, [done]);

  /* запись результата — ровно один раз, даже если время вышло посреди задания */
  useEffect(() => {
    if (!done || saved) return;
    setSaved(true);
    const h = loadStufen();
    const list = h[level] ?? [];
    h[level] = [{ date: Date.now(), score: correct, total: items.length }, ...list].slice(0, 10);
    saveStufen(h);
    setSnap(onXp(correct, items.length, Math.round((correct / Math.max(1, items.length)) * 30)));
  }, [done, saved, level, correct, items.length, onXp]);

  const submit = () => {
    if (checked || !cur || done) return;
    const r = cur.gaps.map((g, i) => judge(values[i] ?? "", g));
    setRes(r);
    setChecked(true);
    if (r.every((x) => x === "ok")) setCorrect((c) => c + 1);
  };

  const advance = () => {
    if (!checked) return;
    const next = idx + 1;
    setIdx(next);
    setValues((items[next]?.gaps ?? []).map(() => ""));
    setChecked(false);
    setRes([]);
  };

  if (!cur) {
    return (
      <div className="card3d rounded-card border border-line bg-card p-6 text-center">
        <p className="text-[13px] font-bold text-muted">Задания не собрались.</p>
        <button type="button" onClick={onBack} className="mt-3 text-[12px] font-extrabold text-blue">
          ← назад
        </button>
      </div>
    );
  }

  if (done) {
    const pass = correct / Math.max(1, items.length) >= 0.8;
    return (
      <div className="card3d rounded-card border border-line bg-card p-6 text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
          Grammatik-Prüfung · {level}
        </p>
        <p className="tnum mt-2 text-[44px] leading-none font-extrabold">
          {correct}
          <span className="text-[22px] text-muted"> / {items.length}</span>
        </p>
        <p className={cn("mt-2 text-[13px] font-extrabold", pass ? "text-greend" : "text-red")}>
          {pass ? "Зачёт: уровень держится." : "Пока не зачёт — нужно 8 из 10."}
        </p>
        {left <= 0 && <p className="mt-1 text-[11.5px] font-bold text-muted">Время вышло.</p>}
        {snap && <SnapLine snap={snap} />}
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
            К уровням
          </button>
        </div>
      </div>
    );
  }

  const states: ("idle" | "ok" | "case" | "bad")[] = checked
    ? cur.gaps.map((_, i) => res[i] ?? "bad")
    : cur.gaps.map(() => "idle");
  const caseOnly =
    checked && res.length > 0 && res.every((x) => x !== "bad") && res.some((x) => x === "case");
  const wide = cur.gaps.some((g) => (g[0] ?? "").includes(" "));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
        >
          ← Prüfung
        </button>
        <span
          className={cn(
            "ml-auto tnum text-[12px] font-extrabold",
            left < 60 ? "text-red" : "text-muted",
          )}
        >
          {mmss(left)} · {idx + 1} / {items.length}
        </span>
      </div>

      <div className="card3d rounded-card border border-line bg-card p-5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
          {cur.task}
        </p>
        {cur.hint && <p className="mt-1 text-[12px] font-extrabold text-blue">{cur.hint}</p>}

        <div className={cn("mt-3 font-bold", wide ? "text-[15px] leading-[1.9]" : "text-[16px] leading-[2.2]")}>
          {cur.text.split(/(\{\d+\})/g).map((part, k) => {
            const m = /^\{(\d+)\}$/.exec(part);
            if (!m) return <span key={k}>{part}</span>;
            const i = Number(m[1]);
            const st = states[i] ?? "idle";
            return (
              <input
                key={k}
                value={values[i] ?? ""}
                disabled={checked}
                autoFocus={i === 0}
                onChange={(e) => setValues((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  if (checked) advance();
                  else if (values.some((v) => v.trim())) submit();
                }}
                placeholder={wide ? "ganzer Satz …" : ""}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                className={cn(
                  "border-b-2 bg-transparent font-extrabold outline-none",
                  wide
                    ? "my-1 block w-full rounded-lg px-1 text-left text-[14px] placeholder:text-[11px] placeholder:uppercase placeholder:tracking-[0.1em] placeholder:text-muted"
                    : "mx-1 inline-block w-[11ch] rounded-lg px-1 text-center text-[15px]",
                  st === "ok"
                    ? "border-green text-greend"
                    : st === "case"
                      ? "border-gold text-ink"
                      : st === "bad"
                        ? "border-red text-red"
                        : "border-blue/60 text-ink focus:border-blue",
                )}
              />
            );
          })}
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
              <p className="mt-1 text-[12.5px] font-extrabold">
                {cur.gaps
                  .map((g, i) => {
                    if (res[i] !== "case") return null;
                    const typed = (values[i] ?? "").trim();
                    const right = g.filter(Boolean)[0] ?? "";
                    return `«${typed || "…"}» → пишется «${right}».`;
                  })
                  .filter(Boolean)
                  .join(" ")}
              </p>
            )}
            {!res.every((x) => x === "ok") && !caseOnly && (
              <p className="mt-1 text-[13px] font-extrabold">
                {cur.gaps
                  .map((g, i) => (res[i] === "ok" ? null : g.filter(Boolean)[0] ?? "(leer)"))
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>
            )}
            <p className="mt-1.5 text-[12.5px] leading-[1.55] font-semibold text-ink/80">{cur.why}</p>
          </div>
        )}

        <div className="mt-4">
          {checked ? (
            <button
              type="button"
              onClick={advance}
              className="btn3d btn3d-green w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
            >
              {idx + 1 >= items.length ? "Fertig" : "Weiter"}
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={values.every((v) => !v.trim())}
              className="btn3d btn3d-green w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
            >
              Prüfen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
