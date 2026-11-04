/* ============================================================================
   MIX-ROUNDE — смешанная практика по всему, что уже умеешь
   ----------------------------------------------------------------------------
   Зачем отдельный режим. Rohrer & Taylor / Rohrer (2020, РКИ): смешанная
   практика бьёт блочную именно потому, что на экзамене задача приходит БЕЗ
   подписи темы — сначала надо выбрать стратегию, потом считать. Раунд темы
   говорит телу «сейчас будет дробь»; Mix этого не говорит.

   Почему только банк: Mix должен собираться мгновенно и работать офлайн,
   а его задачи уже прошли верификатор. Живой генерации здесь нет сознательно —
   она роняет темп и жжёт квоту. Мало задач в банке — честная просьба добрать.

   Мастерство считается ПО СВОЕМУ узлу для каждой задачи (смесь = интервальное
   повторение старых тем), калибровка тоже. Это не контрольная: здесь
   тренировка, поэтому XP обычный, а провал приседает вероятность узла.
   ========================================================================== */

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { PATH, current, pNow, statusOf, type M } from "@/lib/mastery";
import { SKILLS, type Skill } from "@/lib/skills";
import { isCorrect } from "@/lib/check";
import { loadC, observe, saveC } from "@/lib/calib";
import MathText from "@/MathText";
import type { GenTask } from "@/lib/ai";
import type { Snap } from "@/lib/motivation";

type BankTask = GenTask & { skill: string; solution?: string };

const N = 6;

const shuffle = <T,>(xs: T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** решённые bank-id — общий с Tutor пул «уже видел» */
const usedBankIds = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem("tally.bank.used") ?? "[]") as string[]);
  } catch {
    return new Set();
  }
};

export default function MixTest({
  m,
  onExit,
  onResult,
  onXp,
}: {
  m: M;
  onExit: () => void;
  /** результат задачи — в СВОЙ узел: смесь кормит интервальное повторение */
  onResult: (id: string, p: number, cov: string[]) => void;
  onXp?: (correct: number, total: number, xp?: number) => Snap;
}) {
  /* срез прогресса фиксируется на входе: сессия не должна меняться от того,
     что по ходу решения узлы закрываются */
  const m0 = useRef(m).current;
  const bankRef = useRef<Record<string, BankTask[]>>({});
  const usedRef = useRef<Set<string>>(usedBankIds());
  const [tasks, setTasks] = useState<BankTask[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [snap, setSnap] = useState<Snap | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  /* состав Mix: просроченное повторение (2) → текущий узел (1) → открытые (2)
     → закрытые (3). Без повторов узлов. */
  const picks = useMemo<Skill[]>(() => {
    const picks: Skill[] = [];
    const push = (s?: Skill | null) => {
      if (s && s.gen.length > 0 && !picks.some((x) => x.id === s.id)) picks.push(s);
    };
    for (const s of shuffle(PATH.filter((x) => statusOf(x, m0) === "review")).slice(0, 2)) push(s);
    push(current(m0));
    for (const s of shuffle(PATH.filter((x) => statusOf(x, m0) === "open")).slice(0, 2)) push(s);
    for (const s of shuffle(PATH.filter((x) => statusOf(x, m0) === "mastered")).slice(0, 3)) push(s);
    for (const s of shuffle(SKILLS.filter((x) => x.gen.length > 0))) push(s);
    return picks;
  }, [m0]);

  useEffect(() => {
    let dead = false;
    fetch("/bank.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((flat: BankTask[]) => {
        if (dead) return;
        const by: Record<string, BankTask[]> = {};
        for (const t of flat) if (t.skill && t.id && !t.plot) (by[t.skill] ??= []).push(t);
        bankRef.current = by;
        /* по задаче из каждого выбранного узла, без дублей и без уже виденного */
        const out: BankTask[] = [];
        for (const s of picks) {
          const list = shuffle(by[s.id] ?? []);
          const cand = list.find((t) => t.id && !usedRef.current.has(t.id));
          if (cand) {
            out.push(cand);
            usedRef.current.add(cand.id!);
            if (out.length >= N) break;
          }
        }
        setTasks(out);
      })
      .catch(() => setTasks([]));
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = !!tasks && idx >= tasks.length;

  useEffect(() => {
    if (!done || saved || !tasks) return;
    setSaved(true);
    const xp = correct * 8 + (tasks.length > 0 && correct === tasks.length ? 15 : 0);
    setSnap(onXp ? onXp(correct, tasks.length, xp) : undefined);
  }, [done, saved, correct, tasks, onXp]);

  /* пометить использованные bank-id — как в Tutor */
  useEffect(() => {
    if (tasks) {
      try {
        localStorage.setItem("tally.bank.used", JSON.stringify([...usedRef.current].slice(-2000)));
      } catch {
        /* приватный режим */
      }
    }
  }, [tasks]);

  if (tasks && tasks.length < 4) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10">
        <div className="card3d rounded-card border-2 border-line bg-white p-6 text-center">
          <p className="text-[13px] font-bold text-muted">
            В банке пока мало задач под твою смесь узлов — Mix собирать не из чего.
            Банк добирается фоном, загляни позже.
          </p>
          <button
            type="button"
            onClick={onExit}
            className="btn3d btn3d-green mt-4 w-full rounded-xl py-3 text-[12px] font-extrabold uppercase tracking-[0.1em]"
          >
            Zurück
          </button>
        </div>
      </div>
    );
  }

  if (!tasks) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10">
        <p className="text-[13px] font-bold text-muted">Mix wird gemischt …</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10">
        <div className="card3d rounded-card border-2 border-line bg-white p-6 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Mix-Runde · всё вперемешку
          </p>
          <p className="tnum mt-2 text-[44px] leading-none font-extrabold">
            {correct}
            <span className="text-[22px] text-muted"> / {tasks.length}</span>
          </p>
          <p className="mt-2 text-[12px] font-extrabold text-muted">
            каждая задача ушла в свой узел — просроченное повторение обновлено
          </p>
          {snap && (
            <p className="mt-3 text-[12px] font-extrabold text-muted">
              +{snap.xp} XP · сегодня {snap.todayXp}/{snap.goal} · серия {snap.streak}
            </p>
          )}
          <button
            type="button"
            onClick={onExit}
            className="btn3d btn3d-green mt-5 w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
          >
            Zum Weg
          </button>
        </div>
      </div>
    );
  }

  const cur = tasks[idx];
  const skill = SKILLS.find((s) => s.id === cur.skill);

  const submit = () => {
    if (checked) return;
    const good = isCorrect(value, cur.answer);
    setOk(good);
    setChecked(true);
    if (good) setCorrect((c) => c + 1);
    /* запись в свой узел: один верный ответ приседает вероятность вверх,
       провал — вниз (закрытый узел уезжает в «пора повторить») */
    const pPrev = pNow(m0[cur.skill]);
    const pNew = pPrev * 0.85 + (good ? 1 : 0) * 0.15;
    onResult(cur.skill, pNew, cur.variante ? [cur.variante] : []);
    saveC(observe(loadC(), cur.skill, cur.variante, good, 0, cur.par ?? 30));
  };

  const advance = () => {
    if (!checked) return;
    setIdx((i) => i + 1);
    setValue("");
    setChecked(false);
  };

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-5">
      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
        >
          ← Weg
        </button>
        <span className="ml-auto tnum text-[11px] font-extrabold text-muted">
          {idx + 1} / {tasks.length} · {correct} richtig
        </span>
      </div>

      <div className="card3d rounded-card border-2 border-blue/40 bg-white p-5">
        <div className="flex items-baseline gap-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue">Mix</p>
          <span className="ml-auto rounded bg-bg px-1.5 py-0.5 text-[10px] font-extrabold text-muted">
            {checked ? skill?.de ?? "—" : "какая это тема?"}
          </span>
        </div>
        <div className="mt-2 text-[clamp(17px,2.2vw,21px)] font-bold">
          <MathText>{cur.prompt}</MathText>
        </div>

        <input
          value={value}
          disabled={checked}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            if (checked) advance();
            else if (value.trim()) submit();
          }}
          placeholder="Antwort …"
          className={cn(
            "mt-4 w-full rounded-lg border-b-2 bg-transparent px-1 py-1 text-[18px] font-extrabold outline-none placeholder:text-[12px] placeholder:font-bold placeholder:text-muted",
            checked
              ? ok
                ? "border-green text-greend"
                : "border-red text-red"
              : "border-blue/60 text-ink focus:border-blue",
          )}
        />

        {checked && (
          <div
            className={cn(
              "mt-4 rounded-xl border-2 p-3",
              ok ? "border-green bg-greenl" : "border-red bg-redl",
            )}
          >
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em]">
              {ok ? "Richtig" : "Noch nicht"} ·{" "}
              <span className="text-ink">{skill?.de ?? ""}</span>
            </p>
            {!ok && (
              <p className="mt-1 text-[13px] font-extrabold">
                richtig: {cur.answer.join("  oder  ")}
              </p>
            )}
            {cur.solution && (
              <div className="mt-1.5 text-[12.5px] font-semibold text-ink/80">
                <MathText>{cur.solution}</MathText>
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          {checked ? (
            <button
              type="button"
              onClick={advance}
              className="btn3d btn3d-green w-full rounded-xl py-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em]"
            >
              {idx + 1 >= tasks.length ? "Fertig" : "Weiter"}
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!value.trim()}
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
