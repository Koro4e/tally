/* ============================================================================
   СЛОВАРЬ — интервальное повторение слов
   ----------------------------------------------------------------------------
   Экран отвечает на один вопрос: «что повторить сегодня». Два захода:

   Словарь дня      — просроченные повторения (до 20) + до 12 новых слов.
                      Новое слово сначала карточкой, потом сразу упражнение —
                      первое знакомство без проверки наугад.
   Быстрый повтор   — 10 просроченных, только выбор из вариантов: на 2 минуты,
                      чтобы закрыть долги без большого захода.

   Упражнения: de→ru и ru→de выбором; с 3-й коробки (интервал 9 дней) —
   половина заданий на ввод: узнавание проверено, пора проверять припоминание.
   Ввод регистрозависим, как и в грамматике: существительное без артикля
   или с маленькой буквы — ошибка.

   XP за сессию идёт в общую мотивацию: слова — такой же ежедневный труд,
   как раунды грамматики, и серия должна это видеть.
   ========================================================================== */

import { useState } from "react";
import { cn } from "@/utils/cn";
import { judge, norm } from "@/lib/de/gen";
import type { Snap } from "@/lib/motivation";
import {
  BANK,
  BOX_DAYS,
  NEW_PER_DAY,
  QUICK_REVIEWS,
  addCustomWord,
  boxOf,
  customCount,
  customDue,
  customFresh,
  dueWords,
  freshWords,
  guessArticle,
  isKnown,
  keyOf,
  loadCustom,
  loadV,
  lookupWord,
  recordV,
  removeCustomWord,
  saveV,
  statsV,
  updateCustomWord,
  type VLevel,
  type VState,
  type Word,
} from "@/lib/vocab/bank";

/* вкладка «Meine» — свои слова из Lesen «не знаю» и ручного ввода */
type Tab = VLevel | "MEINE";
const TABS: Tab[] = ["A1", "A2", "B1", "B2", "MEINE"];

const shuffle = <T,>(xs: T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

type Task =
  | { kind: "card"; w: Word }
  | { kind: "ex"; w: Word; dir: "de-ru" | "ru-de"; typing: boolean; options: string[] };

type Session = {
  queue: Task[];
  i: number;
  correct: number;
  answered: number;
  value: string;
  checked: boolean;
  ok: boolean;
  verdict: "ok" | "case" | "bad";
  fresh: number;
  reviewed: number;
  combo: number;
  best: number;
  xpDone: boolean;
};

const pickOptions = (lv: Tab, w: Word, dir: "de-ru" | "ru-de"): string[] => {
  const raw = lv === "MEINE" ? loadCustom() : BANK[lv as VLevel];
  const pool = shuffle(raw.filter((x) => x.de !== w.de && x.ru?.trim()));
  /* у своих слов мало вариантов — добираем отвлекайки из банка, чтобы
     выбор из четырёх не превратился в угадайку из двух */
  for (const x of shuffle(BANK.B1.concat(BANK.A2))) {
    if (pool.length >= 3) break;
    if (x.de !== w.de && !pool.includes(x) && x.ru?.trim()) pool.push(x);
  }
  const wrong: string[] = [];
  for (const o of pool) {
    const cand = dir === "de-ru" ? o.ru : o.de;
    if (!wrong.includes(cand)) wrong.push(cand);
    if (wrong.length === 3) break;
  }
  const right = dir === "de-ru" ? w.ru : w.de;
  return shuffle([right, ...wrong]);
};

function buildSession(lv: Tab, s: VState, quick: boolean): Session | null {
  const due =
    lv === "MEINE"
      ? customDue(s, quick ? QUICK_REVIEWS : 20)
      : dueWords(lv as VLevel, s, quick ? QUICK_REVIEWS : 20);
  const fresh = quick || lv === "MEINE" ? [] : freshWords(lv as VLevel, s, NEW_PER_DAY);
  const freshList = lv === "MEINE" ? customFresh(s, NEW_PER_DAY) : fresh;
  if (!due.length && !fresh.length) return null;
  const queue: Task[] = [];
  for (const w of due) {
    const dir = Math.random() < 0.5 ? "de-ru" : "ru-de";
    const typing = boxOf(s, w) >= 2 && Math.random() < 0.5;
    queue.push({
      kind: "ex",
      w,
      dir,
      typing,
      options: typing ? [] : pickOptions(lv, w, dir),
    });
  }
  for (const w of freshList) {
    queue.push({ kind: "card", w });
    queue.push({ kind: "ex", w, dir: "ru-de", typing: false, options: pickOptions(lv, w, "ru-de") });
  }
  return { queue, i: 0, correct: 0, answered: 0, value: "", checked: false, ok: false, verdict: "bad", fresh: 0, reviewed: 0, combo: 0, best: 0, xpDone: false };
}

/* ------------------------------------------------------------- экран ------ */

export default function Vocab({
  onBack,
  onXp,
}: {
  onBack?: () => void;
  /** XP в общую мотивацию; xp переопределяет формулу — как у экзаменационных разделов */
  onXp?: (correct: number, total: number, xp?: number) => Snap;
}) {
  const [level, setLevel] = useState<Tab>("B1");
  const [st, setSt] = useState<VState>(() => loadV());
  const [ses, setSes] = useState<Session | null>(null);
  const [snap, setSnap] = useState<Snap | undefined>(undefined);
  /* свои слова: локальный счётчик перерисовки списка после правок */
  const [cv, setCv] = useState(0);
  const [deIn, setDeIn] = useState("");
  const [addMsg, setAddMsg] = useState("");
  /* ИИ-перевод: ключ живёт только в этом браузере, в код и на сервер не идёт */
  const [aiKey, setAiKey] = useState(() => localStorage.getItem("tally.ai.key.v1") ?? "");
  const [aiModel, setAiModel] = useState(() => localStorage.getItem("tally.ai.model.v1") ?? "llama-3.3-70b-versatile");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMsg, setAiMsg] = useState("");

  const stat =
    level === "MEINE"
      ? (() => {
          const list = loadCustom();
          const now = Date.now();
          let known = 0;
          let learning = 0;
          let due = 0;
          let fresh = 0;
          for (const w of list) {
            const r = st[keyOf(w)];
            if (!r) {
              fresh++;
              continue;
            }
            if (isKnown(r)) known++;
            else learning++;
            if (r.due <= now) due++;
          }
          return { known, learning, total: list.length, due, fresh };
        })()
      : statsV(level as VLevel, st);

  const start = (quick: boolean) => {
    const s = buildSession(level, st, quick);
    if (s) setSes(s);
  };

  /* ручное добавление: артикль из ввода или по окончанию, перевод из словарей */
  const doAdd = () => {
    const raw = deIn.trim();
    if (!raw) return;
    const m1 = /^(der|die|das)\s+(.+)$/i.exec(raw);
    let art = m1 ? (m1[1].toLowerCase() as "der" | "die" | "das") : null;
    const rest = m1 ? m1[2].trim() : raw;
    let guessed = false;
    if (!art) {
      const g = guessArticle(rest);
      if (g) {
        art = g;
        guessed = true;
      }
    }
    const de = art && !m1 ? `${art} ${rest}` : raw;
    const hit = lookupWord(rest);
    const added = addCustomWord({
      de,
      ru: hit?.word.ru ?? "",
      note: guessed ? "артикль по окончанию — проверь" : hit?.word.note,
    });
    setAddMsg(
      added
        ? hit
          ? `Добавлено: ${de} — ${hit.word.ru || "перевод заполни в списке"}`
          : `Добавлено: ${de}${guessed ? " · артикль угадан — проверь" : ""}`
        : "Такое слово уже в списке.",
    );
    setDeIn("");
    setCv((x) => x + 1);
  };

  /* ИИ-перевод напрямую из браузера: ключ не покидает localStorage.
     Ошибка сети/CORS не роняет сессию — слова можно заполнить руками. */
  const translateMissing = async () => {
    setAiBusy(true);
    setAiMsg("");
    const words = loadCustom()
      .filter((w) => !w.ru?.trim())
      .slice(0, 10);
    let okN = 0;
    for (const w of words) {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${aiKey.trim()}` },
          body: JSON.stringify({
            model: aiModel.trim() || "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content:
                  'Ты переводчик немецких слов для русскоязычного ученика. Ответ — ровно один JSON без markdown: {"ru":"перевод (1-3 слова)","note":"артикль/Plural или форма"}.',
              },
              { role: "user", content: w.de },
            ],
            temperature: 0.1,
          }),
        });
        const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
        const txt = j.choices?.[0]?.message?.content ?? "";
        const m = /\{[\s\S]*\}/.exec(txt);
        if (m) {
          const parsed = JSON.parse(m[0]) as { ru?: string; note?: string };
          if (parsed.ru) {
            updateCustomWord(w.de, parsed.ru, parsed.note ?? w.note);
            okN++;
          }
        }
      } catch {
        setAiMsg("Сеть/CORS/ключ не пропустили — слово можно заполнить руками.");
        break;
      }
    }
    if (okN > 0) setAiMsg(`Переведено: ${okN}${words.length > okN ? ` из ${words.length}` : ""}.`);
    setAiBusy(false);
    setCv((x) => x + 1);
  };

  /* --- ход сессии --- */

  if (ses) {
    const cur: Task | undefined = ses.queue[ses.i];
    const done = !cur;

    const finish = (s: Session): Session => {
      if (!s.xpDone) {
        const xp = s.correct * 8 + (s.answered > 0 && s.correct === s.answered ? 15 : 0);
        setSnap(onXp ? onXp(s.correct, s.answered, xp) : undefined);
        return { ...s, xpDone: true };
      }
      return s;
    };

    const check = () => {
      if (!ses || !cur || cur.kind !== "ex" || ses.checked) return;
      const answer = cur.dir === "ru-de" ? cur.w.de : cur.w.ru;
      const verdict = judge(ses.value, [answer]);
      const ok = verdict === "ok";
      const nextSt = recordV(st, cur.w, ok);
      setSt(nextSt);
      saveV(nextSt);
      setSes({
        ...ses,
        checked: true,
        ok,
        verdict,
        correct: ses.correct + (ok ? 1 : 0),
        answered: ses.answered + 1,
        combo: ok ? ses.combo + 1 : 0,
        best: Math.max(ses.best, ok ? ses.combo + 1 : ses.combo),
      });
    };

    const advance = () => {
      if (!ses || !cur) return;
      if (cur.kind === "card") {
        setSes({ ...ses, i: ses.i + 1, value: "", checked: false, fresh: ses.fresh + 1 });
        return;
      }
      if (!ses.checked) return;
      const next: Session = {
        ...ses,
        i: ses.i + 1,
        value: "",
        checked: false,
        reviewed: ses.reviewed + 1,
      };
      setSes(next.i >= next.queue.length ? finish(next) : next);
    };

    if (done) {
      return (
        <div className="mx-auto w-full max-w-[640px] px-4 py-10">
          <div className="card3d rounded-card border-2 border-line bg-white p-6 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
              Wortschatz · {level}
            </p>
            <p className="tnum mt-2 text-[44px] leading-none font-extrabold">
              {ses.correct}
              <span className="text-[22px] text-muted"> / {ses.answered}</span>
            </p>
            <p className="mt-2 text-[13px] font-extrabold text-greend">
              Новых слов: {ses.fresh} · повторено: {ses.reviewed} · лучшая серия: {ses.best}
            </p>
            {snap && (
              <p className="mt-3 text-[12px] font-extrabold text-muted">
                +{snap.xp} XP · сегодня {snap.todayXp}/{snap.goal} · серия {snap.streak}
              </p>
            )}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const s = buildSession(level, loadV(), false);
                  setSes(s);
                }}
                className="btn3d btn3d-white flex-1 rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
              >
                Ещё
              </button>
              <button
                type="button"
                onClick={onBack}
                className="btn3d btn3d-green flex-1 rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      );
    }

    const isCard = cur.kind === "card";
    const ex = cur.kind === "ex" ? cur : null;
    const answer = ex ? (ex.dir === "ru-de" ? ex.w.de : ex.w.ru) : "";

    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-5">
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            /* выход посреди сессии: разобранное уже записано (recordV на каждый ответ) */
            onClick={() => {
              setSes(null);
              onBack?.();
            }}
            className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
          >
            ← Wortschatz
          </button>
          <span className="ml-auto text-[11px] font-extrabold text-muted">
            {ses.i + 1} / {ses.queue.length}
          </span>
        </div>

        <div className="mb-3 flex gap-1">
          {ses.queue.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i < ses.i ? "bg-green" : i === ses.i ? "bg-green/40" : "bg-line",
              )}
            />
          ))}
        </div>

        {ses.combo >= 2 && !isCard && (
          <p className="mb-2 text-center text-[11px] font-extrabold text-greend">
            🔥 серия {ses.combo}
          </p>
        )}

        <div className="card3d rounded-card border-2 border-line bg-white p-5">
          {isCard ? (
            <>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-blue">
                Новое слово
              </p>
              <p className="mt-2 text-[30px] leading-tight font-extrabold">{cur.w.de}</p>
              {cur.w.note && <p className="mt-1 text-[12px] font-bold text-muted">{cur.w.note}</p>}
              <p className="mt-3 text-[17px] font-bold">{cur.w.ru}</p>
              <button
                type="button"
                onClick={advance}
                className="btn3d btn3d-green mt-5 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
              >
                Понятно
              </button>
            </>
          ) : ex && (
            <>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
                {ex.dir === "de-ru" ? "Как переводится?" : "Переведи на немецкий"}
                {ex.typing ? " · ввод" : ""}
              </p>
              <p className="mt-2 text-[26px] leading-tight font-extrabold">
                {ex.dir === "de-ru" ? ex.w.de : ex.w.ru}
              </p>
              {ex.w.note && <p className="mt-1 text-[11.5px] font-bold text-muted">{ex.w.note}</p>}

              {ex.typing ? (
                <>
                  <input
                    key={ses.i}
                    value={ses.value}
                    disabled={ses.checked}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    onChange={(e) => setSes((p) => (p ? { ...p, value: e.target.value } : p))}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      if (ses.checked) advance();
                      else if (ses.value.trim()) check();
                    }}
                    placeholder={/^(der|die|das) /.test(answer) ? "с артиклем …" : ""}
                    className={cn(
                      "mt-4 w-full rounded-lg border-b-2 bg-transparent px-1 py-1 text-[18px] font-extrabold outline-none placeholder:text-[12px] placeholder:font-bold placeholder:text-muted",
                      ses.checked
                        ? ses.verdict === "ok"
                          ? "border-green text-greend"
                          : ses.verdict === "case"
                            ? "border-gold text-ink"
                            : "border-red text-red"
                        : "border-blue/60 text-ink focus:border-blue",
                      ses.checked && "opacity-80",
                    )}
                  />
                  {ses.checked && ses.verdict === "case" && (
                    <p className="mt-2 text-[12.5px] font-extrabold text-ink">
                      Только заглавная буква: пишется «{answer}».
                    </p>
                  )}
                </>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {ex.options.map((o) => {
                    const picked = ses.value === o;
                    const isRight = norm(o) === norm(answer);
                    return (
                      <button
                        key={o}
                        type="button"
                        disabled={ses.checked}
                        onClick={() => setSes((p) => (p ? { ...p, value: o } : p))}
                        className={cn(
                          "rounded-xl border-2 px-3 py-3 text-[14px] font-extrabold transition",
                          ses.checked
                            ? isRight
                              ? "border-green bg-greenl text-greend"
                              : picked
                                ? "border-red bg-redl text-red"
                                : "border-line bg-white text-muted"
                            : picked
                              ? "border-blue bg-blue/10 text-blue"
                              : "border-line bg-white text-ink hover:border-muted",
                        )}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              )}

              {ses.checked && (
                <div
                  className={cn(
                    "mt-4 rounded-xl border-2 p-3",
                    ses.verdict === "ok"
                      ? "border-green bg-greenl"
                      : ses.verdict === "case"
                        ? "border-gold bg-gold/10"
                        : "border-red bg-redl",
                  )}
                >
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.1em]">
                    {ses.verdict === "ok" ? "Richtig" : ses.verdict === "case" ? "Fast — только большая буква" : "Noch nicht"}
                  </p>
                  {ses.verdict !== "ok" && (
                    <p className="mt-1 text-[13px] font-extrabold">
                      {ex.w.de} — {ex.w.ru}
                    </p>
                  )}
                  {ex.w.note && ses.verdict !== "ok" && (
                    <p className="mt-0.5 text-[11.5px] font-bold text-muted">{ex.w.note}</p>
                  )}
                </div>
              )}

              <div className="mt-4">
                {ses.checked ? (
                  <button
                    type="button"
                    onClick={advance}
                    className="btn3d btn3d-green w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
                  >
                    {ses.i + 1 >= ses.queue.length ? "Fertig" : "Weiter"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={check}
                    disabled={ex.typing ? !ses.value.trim() : !ses.value}
                    className="btn3d btn3d-green w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
                  >
                    Prüfen
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* --- главный экран словаря --- */

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-5">
      <h1 className="text-[26px] leading-none font-extrabold tracking-[-0.01em]">Wortschatz</h1>
      <p className="mt-1 text-[12px] font-semibold text-muted">
        Словарь с повторениями · каждый заход — до {NEW_PER_DAY} новых слов, ошибка возвращает слово в начало
      </p>

      <div className="mt-4 flex gap-1.5">
        {TABS.map((lv) => (
          <button
            key={lv}
            type="button"
            onClick={() => setLevel(lv)}
            className={cn(
              "flex-1 rounded-xl border-2 py-2 text-[12px] font-extrabold transition",
              lv === level
                ? "border-green bg-greenl text-greend"
                : "border-line bg-white text-muted hover:border-muted",
            )}
          >
            {lv === "MEINE" ? `Meine·${customCount()}` : lv}
          </button>
        ))}
      </div>

      <div className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-extrabold">
            Закреплено {stat.known} из {stat.total}
          </p>
          <span className="tnum text-[11px] font-extrabold text-muted">
            {Math.round((stat.known / Math.max(stat.total, 1)) * 100)}%
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-green transition-all"
            style={{ width: `${(stat.known / Math.max(stat.total, 1)) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[11.5px] font-semibold text-muted">
          учится: {stat.learning} · новых не тронуто: {stat.fresh} · интервалы: {BOX_DAYS.join(" / ")} дней
        </p>
      </div>

      {level === "MEINE" && (
        <div key={cv} className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Свои слова · из Lesen «не знаю» и ручного ввода
          </p>
          <div className="mt-2 flex gap-1.5">
            <input
              value={deIn}
              onChange={(e) => setDeIn(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") doAdd();
              }}
              placeholder="немецкое слово или фраза…"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              className="min-w-0 flex-1 rounded-lg border-b-2 border-blue/60 bg-transparent px-1 py-1 text-[14px] font-extrabold outline-none placeholder:text-[11px] placeholder:font-bold placeholder:text-muted focus:border-blue"
            />
            <button
              type="button"
              onClick={doAdd}
              className="btn3d btn3d-green shrink-0 rounded-xl px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.06em]"
            >
              Добавить
            </button>
          </div>
          {addMsg && <p className="mt-1.5 text-[11.5px] font-bold text-muted">{addMsg}</p>}

          <div className="mt-3 max-h-[300px] space-y-1 overflow-y-auto pr-1">
            {loadCustom().map((w) => (
              <div
                key={w.de}
                className="flex items-center gap-2 rounded-lg border border-line px-2 py-1.5"
              >
                <span className="shrink-0 text-[13px] font-extrabold">{w.de}</span>
                {w.note && (
                  <span className="shrink-0 text-[10px] font-bold text-muted">{w.note}</span>
                )}
                {w.ru ? (
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-muted">
                    {w.ru}
                  </span>
                ) : (
                  <input
                    defaultValue=""
                    placeholder="перевод…"
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v) {
                        updateCustomWord(w.de, v, w.note);
                        setCv((x) => x + 1);
                      }
                    }}
                    className="min-w-0 flex-1 rounded border-b border-line bg-transparent px-1 text-[12px] font-semibold outline-none placeholder:text-muted"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    removeCustomWord(w.de);
                    setCv((x) => x + 1);
                  }}
                  aria-label="удалить"
                  className="shrink-0 text-[12px] font-extrabold text-red"
                >
                  ✕
                </button>
              </div>
            ))}
            {customCount() === 0 && (
              <p className="px-1 py-2 text-[11.5px] font-semibold text-muted">
                Пока пусто. В Lesen тапни по незнакомому слову — появится карточка с
                переводом и кнопкой «В словарь». Или добавь слово строкой выше:
                артикль подставится по окончанию.
              </p>
            )}
          </div>

          <details className="mt-3 border-t border-line pt-2">
            <summary className="cursor-pointer text-[11px] font-extrabold text-blue">
              ИИ-перевод незаполненных (свой ключ)
            </summary>
            <div className="mt-2 space-y-1.5">
              <input
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                onBlur={() => localStorage.setItem("tally.ai.key.v1", aiKey.trim())}
                type="password"
                placeholder="API-ключ (хранится только в этом браузере)"
                className="w-full rounded-lg border-b-2 border-line bg-transparent px-1 py-1 text-[12px] font-semibold outline-none focus:border-blue"
              />
              <input
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                onBlur={() => localStorage.setItem("tally.ai.model.v1", aiModel.trim())}
                placeholder="модель, напр. llama-3.3-70b-versatile"
                className="w-full rounded-lg border-b-2 border-line bg-transparent px-1 py-1 text-[12px] font-semibold outline-none focus:border-blue"
              />
              <button
                type="button"
                disabled={aiBusy || !aiKey.trim()}
                onClick={translateMissing}
                className="btn3d btn3d-white w-full rounded-xl py-2.5 text-[11px] font-extrabold uppercase tracking-[0.06em] disabled:opacity-50"
              >
                {aiBusy ? "Перевожу…" : "Перевести незаполненные"}
              </button>
              {aiMsg && <p className="text-[11px] font-bold text-muted">{aiMsg}</p>}
            </div>
          </details>
        </div>
      )}

      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={() => start(false)}
          disabled={
            stat.due === 0 &&
            (level === "MEINE"
              ? customFresh(st, NEW_PER_DAY).length === 0
              : freshWords(level as VLevel, st, NEW_PER_DAY).length === 0)
          }
          className="btn3d btn3d-green w-full rounded-xl py-3.5 text-left text-[12px] font-extrabold uppercase tracking-[0.1em] disabled:opacity-50"
        >
          <span className="block px-1">
            Словарь дня · повторить {stat.due} + новые до {NEW_PER_DAY}
          </span>
        </button>
        <button
          type="button"
          onClick={() => start(true)}
          disabled={stat.due === 0}
          className="btn3d btn3d-white w-full rounded-xl py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.1em] disabled:opacity-50"
        >
          <span className="block px-1">Быстрый повтор · {Math.min(stat.due, QUICK_REVIEWS)} слов, без новых</span>
        </button>
      </div>

      <p className="mt-4 px-1 text-[10px] leading-[1.5] font-bold text-muted">
        «Закреплено» — слово дошло до интервала 9 дней и не забыто. Ввод с 3-й коробки:
        сначала узнавание, потом припоминание. Прогресс живёт в этом браузере.
      </p>
    </div>
  );
}
