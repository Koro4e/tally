/* ============================================================================
   HÖRVERSTEHEN — раздел 1 экзамена (25 из 100 баллов)
   ----------------------------------------------------------------------------
   1.1 Diktat (13 P): текст слушают ДВАЖДЫ (как на экзамене), 13 пропусков.
   1.2 MC (6 P): объявление слушают, вопросы печатаются в листе — так же и
       здесь: аудио только intro, вопросы глазами.
   1.3 Dialoge (6 P): три диалога, ролями Conrad/Amala, по 2 вопроса.

   Аудио — файлы public/audio/*.mp3, сгенерированные заранее
   (tools/audio-build.py через edge-tts). Никакого TTS в рантайме: файлы
   детерминированы, ошибка в контенте чинится один раз навсегда.
   Проверка ответов — тот же norm()-механизм, что и в грамматике.
   ========================================================================== */

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { check } from "@/lib/de/gen";
import { HOER, type Hoer } from "@/lib/de/exam-hoer";
import { HOER2 } from "@/lib/de/exam-hoer-v2";

/* ============================================================================
   Варианты тренировочного аудио: v1 — оригинал, v2 — второй набор (библиотека/
   Wanderverein/диалоги про тарифы, зубного, квартиру). Имена файлов v2 с суффик-
   сом -v2, чтобы не пересекаться со старыми (diktat-2.mp3 раньше был 2-м
   прочтением — имя больше не используем).
   ========================================================================== */
type HoerVariant = {
  label: string;
  hoer: Hoer;
  audio: { diktat: string; mc: string; dialog: (i: number) => string };
};

const HOER_SETS: HoerVariant[] = [
  {
    label: "Variante 1",
    hoer: HOER,
    audio: { diktat: "/audio/diktat-1.mp3", mc: "/audio/mc-intro.mp3", dialog: (i) => `/audio/dialog-${i}.mp3` },
  },
  {
    label: "Variante 2",
    hoer: HOER2,
    audio: { diktat: "/audio/diktat-v2.mp3", mc: "/audio/mc-v2.mp3", dialog: (i) => `/audio/dialog-v2-${i}.mp3` },
  },
];

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">{children}</p>
  );
}

/* Аудиоплеер: нативные controls — честно и без сюрпризов. Кнопка «ещё раз»
   не отдельная механика: rewind есть в самом контроле, а на экзамене Diktat
   читают ровно дважды, поэтому второй файл открывается только после первого. */
function Audio({ src, label }: { src: string; label: string }) {
  return (
    <div className="rounded-xl border-2 border-line bg-bg/60 p-3">
      <Kicker>{label}</Kicker>
      <audio controls preload="none" src={src} className="mt-1.5 w-full" />
    </div>
  );
}

/* ------------------------------------------------------------- diktat ---- */

function DiktatRun({ set, onBack, onFinish }: { set: HoerVariant; onBack: () => void; onFinish: (c: number, n: number) => void }) {
  const d = set.hoer.diktat;
  const [values, setValues] = useState<string[]>(() => d.answers.map(() => ""));
  const [checked, setChecked] = useState(false);

  /* Формат по официальному образцу: текст читают ОДИН раз, первое короткое
     слово дано как ПЕЧАТНЫЙ ПРИМЕР («ist» в образце) — на экзамене таких
     13 позиций, пример засчитан, вписываешь остальные. */
  const exampleIdx = d.answers.findIndex((a) => a.trim().split(" ").length === 1);

  const res = useMemo(
    () => d.answers.map((a, i) => (i === exampleIdx ? true : check(values[i] ?? "", [a]))),
    [values, d.answers, exampleIdx],
  );
  const correct = res.filter(Boolean).length;

  useEffect(() => {
    if (checked) onFinish(correct, d.answers.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const parts = d.text.split(/(\{\d+\})/g);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink">
          ← Hörverstehen
        </button>
        <span className="ml-auto text-[11px] font-extrabold text-muted">{d.title}</span>
      </div>

      <p className="rounded-xl bg-gold/15 px-3 py-2 text-[11.5px] leading-[1.5] font-bold text-ink">
        Hören Sie den Text <span className="underline">einmal</span> und ergänzen Sie die fehlenden
        Wörter! Так на экзамене: читают один раз, быстро — цифры проговаривай сразу цифрами.
      </p>
      <Audio src={set.audio.diktat} label="Einmal hören — слушай и пиши сразу" />

      <div className="card3d rounded-card border-2 border-line bg-white p-4">
        <Kicker>({checked ? correct : "—"} / {d.answers.length})</Kicker>
        <p className="mt-2 text-[14px] leading-[2.2] font-bold">
          {parts.map((p, k) => {
            const m = /^\{(\d+)\}$/.exec(p);
            if (!m) return <span key={k}>{p}</span>;
            const i = Number(m[1]);
            /* печатный пример — как в образце: слово уже стоит в тексте */
            if (i === exampleIdx)
              return (
                <span key={k} className="mx-0.5 rounded bg-bg px-1 font-extrabold text-muted underline">
                  {d.answers[i]}
                </span>
              );
            return (
              <input
                key={k}
                value={values[i] ?? ""}
                disabled={checked}
                autoFocus={i === (exampleIdx === 0 ? 1 : 0)}
                onChange={(e) => setValues((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                className={cn(
                  "mx-0.5 inline-block w-[12ch] rounded-lg border-b-2 bg-transparent px-1 text-center text-[13px] font-extrabold outline-none",
                  checked
                    ? res[i]
                      ? "border-green text-greend"
                      : "border-red text-red"
                    : "border-blue/60 focus:border-blue",
                )}
              />
            );
          })}
        </p>
        {!checked ? (
          <button type="button" onClick={() => setChecked(true)} className="btn3d btn3d-green mt-3 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]">
            Prüfen
          </button>
        ) : (
          <div className="mt-3 rounded-xl border-2 border-line bg-bg/60 p-3">
            <p className="tnum text-[13px] font-extrabold">{correct} / {d.answers.length}</p>
            <p className="mt-1 text-[12px] font-bold">
              Пропущено: {d.answers.filter((_, i) => !res[i] && i !== exampleIdx).join(" · ") || "—"}
            </p>
            <button type="button" onClick={onBack} className="btn3d btn3d-green mt-3 w-full rounded-xl py-3 text-[12px] font-extrabold uppercase tracking-[0.1em]">
              Zur Übersicht
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- mc ---- */

function McRun({ set, onBack, onFinish }: { set: HoerVariant; onBack: () => void; onFinish: (c: number, n: number) => void }) {
  const mc = set.hoer.mc;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const done = idx >= mc.items.length;
  const cur = mc.items[Math.min(idx, mc.items.length - 1)];

  useEffect(() => {
    if (done) onFinish(correct, mc.items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const answer = (v: number) => {
    if (picked !== null) return;
    setPicked(v);
    if (v === cur.correct) setCorrect((c) => c + 1);
  };

  if (done) {
    return (
      <div className="card3d rounded-card border-2 border-line bg-white p-6 text-center">
        <p className="tnum text-[44px] leading-none font-extrabold">
          {correct}
          <span className="text-[22px] text-muted"> / {mc.items.length}</span>
        </p>
        <button type="button" onClick={onBack} className="btn3d btn3d-green mt-5 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]">
          Zur Übersicht
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink">
          ← Hörverstehen
        </button>
        <span className="ml-auto tnum text-[11px] font-extrabold text-muted">
          {idx + 1} / {mc.items.length} · {correct} richtig
        </span>
      </div>
      <Audio src={set.audio.mc} label={mc.title} />
      <div className="card3d rounded-card border-2 border-line bg-white p-5">
        <p className="text-[15px] leading-[1.55] font-bold">{cur.q}</p>
        <div className="mt-3 space-y-1.5">
          {cur.options.map((o, oi) => (
            <button
              key={oi}
              type="button"
              disabled={picked !== null}
              onClick={() => answer(oi)}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-[13px] font-bold transition",
                picked === null
                  ? "border-line hover:border-blue"
                  : oi === cur.correct
                    ? "border-green bg-greenl"
                    : oi === picked
                      ? "border-red bg-redl"
                      : "border-line opacity-60",
              )}
            >
              <span className="shrink-0 font-extrabold text-muted">{String.fromCharCode(97 + oi)})</span>
              {o}
            </button>
          ))}
        </div>
        {picked !== null && (
          <>
            <div className={cn("mt-3 rounded-xl border-2 p-3", picked === cur.correct ? "border-green bg-greenl" : "border-red bg-redl")}>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em]">
                {picked === cur.correct ? "Richtig" : "Noch nicht"}
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
              {idx + 1 >= mc.items.length ? "Fertig" : "Weiter"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- dialoge --- */

function DialogRun({ set, onBack, onFinish }: { set: HoerVariant; onBack: () => void; onFinish: (c: number, n: number) => void }) {
  const [di, setDi] = useState(0);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const dlg = set.hoer.dialogs[Math.min(di, set.hoer.dialogs.length - 1)];
  const allDone = di >= set.hoer.dialogs.length;
  const cur = dlg?.q[Math.min(qi, 1)];

  useEffect(() => {
    if (allDone) onFinish(correct, set.hoer.dialogs.length * 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  const answer = (v: number) => {
    if (picked !== null) return;
    setPicked(v);
    if (cur && v === cur.correct) setCorrect((c) => c + 1);
  };

  if (allDone) {
    return (
      <div className="card3d rounded-card border-2 border-line bg-white p-6 text-center">
        <p className="tnum text-[44px] leading-none font-extrabold">
          {correct}
          <span className="text-[22px] text-muted"> / {set.hoer.dialogs.length * 2}</span>
        </p>
        <button type="button" onClick={onBack} className="btn3d btn3d-green mt-5 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]">
          Zur Übersicht
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink">
          ← Hörverstehen
        </button>
        <span className="ml-auto tnum text-[11px] font-extrabold text-muted">
          Dialog {di + 1} / {set.hoer.dialogs.length} · Frage {qi + 1}
        </span>
      </div>
      <Audio src={set.audio.dialog(di + 1)} label={dlg.title} />
      <div className="card3d rounded-card border-2 border-line bg-white p-5">
        <p className="text-[15px] leading-[1.55] font-bold">{cur.q}</p>
        <div className="mt-3 space-y-1.5">
          {cur.options.map((o, oi) => (
            <button
              key={oi}
              type="button"
              disabled={picked !== null}
              onClick={() => answer(oi)}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-[13px] font-bold transition",
                picked === null
                  ? "border-line hover:border-blue"
                  : oi === cur.correct
                    ? "border-green bg-greenl"
                    : oi === picked
                      ? "border-red bg-redl"
                      : "border-line opacity-60",
              )}
            >
              <span className="shrink-0 font-extrabold text-muted">{String.fromCharCode(97 + oi)})</span>
              {o}
            </button>
          ))}
        </div>
        {picked !== null && (
          <>
            <div className={cn("mt-3 rounded-xl border-2 p-3", picked === cur.correct ? "border-green bg-greenl" : "border-red bg-redl")}>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em]">
                {picked === cur.correct ? "Richtig" : "Noch nicht"}
              </p>
              <p className="mt-1 text-[12.5px] leading-[1.55] font-semibold text-ink/80">{cur.why}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPicked(null);
                if (qi + 1 >= 2) {
                  setDi((d) => d + 1);
                  setQi(0);
                } else {
                  setQi((q) => q + 1);
                }
              }}
              className="btn3d btn3d-green mt-3 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
            >
              {di + 1 >= set.hoer.dialogs.length && qi + 1 >= 2 ? "Fertig" : "Weiter"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ экран ------ */

export type HoerSection = "diktat" | "mc" | "dialogs";

export default function DeutschHoer({
  onXp,
  onBack,
}: {
  onXp: (correct: number, total: number, xp?: number) => void;
  onBack: () => void;
}) {
  const [section, setSection] = useState<HoerSection | null>(null);
  const [snap, setSnap] = useState<string | null>(null);
  const [variant, setVariant] = useState(0);

  const finish = (c: number, n: number) => {
    onXp(c, n, Math.round((c / Math.max(1, n)) * 30));
    setSnap(`${c} / ${n}`);
  };

  if (section === "diktat") return <div className="mx-auto w-full max-w-[640px] px-4 py-5"><DiktatRun set={HOER_SETS[variant]} onBack={() => setSection(null)} onFinish={finish} />{snap && <p className="mt-3 text-center text-[12px] font-extrabold text-muted">Ergebnis: {snap}</p>}</div>;
  if (section === "mc") return <div className="mx-auto w-full max-w-[640px] px-4 py-5"><McRun set={HOER_SETS[variant]} onBack={() => setSection(null)} onFinish={finish} />{snap && <p className="mt-3 text-center text-[12px] font-extrabold text-muted">Ergebnis: {snap}</p>}</div>;
  if (section === "dialogs") return <div className="mx-auto w-full max-w-[640px] px-4 py-5"><DialogRun set={HOER_SETS[variant]} onBack={() => setSection(null)} onFinish={finish} />{snap && <p className="mt-3 text-center text-[12px] font-extrabold text-muted">Ergebnis: {snap}</p>}</div>;

  const cards: { id: HoerSection; de: string; ru: string; pts: string }[] = [
    { id: "diktat", de: "1.1 Diktat", ru: "Два прочтения, 13 пропусков", pts: "13 P" },
    { id: "mc", de: "1.2 Multiple Choice", ru: "Объявление + 6 вопросов", pts: "6 P" },
    { id: "dialogs", de: "1.3 Dialoge", ru: "3 диалога по 2 вопроса", pts: "6 P" },
  ];
  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink">
          ← Prüfung
        </button>
      </div>
      <h1 className="mt-3 text-[26px] leading-none font-extrabold tracking-[-0.01em]">Hörverstehen</h1>
      <p className="mt-1 text-[12px] font-semibold text-muted">25 из 100 баллов · два тренировочных набора · интернет не нужен</p>
      <div className="mt-3 flex gap-2">
        {HOER_SETS.map((v, i) => (
          <button
            key={v.label}
            type="button"
            onClick={() => setVariant(i)}
            className={cn(
              "btn3d rounded-xl border-2 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em]",
              variant === i ? "border-green bg-greenl text-greend [--btn-shadow:var(--color-greend)]" : "border-line bg-white text-muted [--btn-shadow:var(--color-line)]",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-1.5">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSection(c.id)}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-line bg-white px-3 py-2.5 text-left transition hover:border-muted"
          >
            <span className="shrink-0 rounded bg-gold/25 px-1.5 py-0.5 text-[10px] font-extrabold text-ink">{c.pts}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-extrabold">{c.de}</span>
              <span className="block truncate text-[11px] font-semibold text-muted">{c.ru}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
