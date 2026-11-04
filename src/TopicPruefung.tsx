/* ============================================================================
   THEMEN-PRÜFUNG — финальная проверка темы перед открытием следующей
   ----------------------------------------------------------------------------
   Требование хозяина (04.11): «прюфунги между темами — финальная проверка,
   чтобы открылась следующая». Узел, пройденный по знанию и покрытию форм,
   сам по себе больше НЕ открывает зависимые: нужна сдача этой проверки.

   Формат: до 6 задач из банка по теме (все уровни и формы, что есть), порог
   83 % (5 из 6). Банк — единственный источник: проверка должна собираться
   мгновенно и работать офлайн, как всё остальное. Мало задач — честный отказ.

   Сдача ставит `pf: true` в записи узла (mastery) и снимает гейт со следующих.
   ========================================================================== */

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import type { Skill } from "@/lib/skills";
import { isCorrect } from "@/lib/check";
import MathText from "@/MathText";
import type { GenTask } from "@/lib/ai";
import type { Snap } from "@/lib/motivation";
import Mascot from "@/mascot/Mascot";
import { useMascot } from "@/mascot/store";

type BankTask = GenTask & { skill: string; solution?: string };

const MAX_N = 6;
const PASS_RATIO = 5 / 6;

const shuffle = <T,>(xs: T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function TopicPruefung({
  skill,
  onExit,
  onPass,
  onXp,
}: {
  skill: Skill;
  onExit: () => void;
  /** сдано — снять гейт со следующей темы (App пишет pf в mastery) */
  onPass: () => void;
  onXp?: (correct: number, total: number, xp?: number) => Snap;
}) {
  const [tasks, setTasks] = useState<BankTask[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [snap, setSnap] = useState<Snap | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  /* маскот на итоге: празднует сдачу (cheer = прыжки + искры), грустит на провале */
  const mascot = useMascot();

  useEffect(() => {
    let dead = false;
    fetch("/bank.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((flat: BankTask[]) => {
        if (dead) return;
        const mine = shuffle(flat.filter((t) => t.skill === skill.id && t.id && !t.plot));
        setTasks(mine.slice(0, MAX_N));
      })
      .catch(() => setTasks([]));
    return () => {
      dead = true;
    };
  }, [skill.id]);

  const done = !!tasks && idx >= tasks.length;
  const passed = !!tasks && tasks.length > 0 && correct / tasks.length >= PASS_RATIO;

  useEffect(() => {
    if (!done || saved || !tasks) return;
    setSaved(true);
    if (passed) onPass();
    const xp = correct * 8 + (passed ? 25 : 0);
    setSnap(onXp ? onXp(correct, tasks.length, xp) : undefined);
  }, [done, saved, passed, correct, tasks, onPass, onXp]);

  if (tasks && tasks.length < 3) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10">
        <div className="card3d rounded-card border border-line bg-card p-6 text-center">
          <p className="text-[13px] font-bold text-muted">
            В банке пока мало задач по теме «{skill.de}» — финальную проверку
            собрать не из чего. Банк добирается фоном, попробуй позже.
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
        <p className="text-[13px] font-bold text-muted">Prüfung lädt …</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10">
        <div className="card3d rounded-card border border-line bg-card p-6 text-center">
          <Mascot
            char={mascot}
            mood={passed ? "cheer" : "sad"}
            className="mx-auto h-[110px] w-auto shrink-0"
          />
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Themen-Prüfung · {skill.de}
          </p>
          <p className="tnum mt-2 text-[44px] leading-none font-extrabold">
            {correct}
            <span className="text-[22px] text-muted"> / {tasks.length}</span>
          </p>
          <p className={cn("mt-2 text-[13px] font-extrabold", passed ? "text-greend" : "text-red")}>
            {passed
              ? "Проверка сдана — следующая тема открыта."
              : "Порог 5 из 6. Повтори тему и попробуй снова."}
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

  const submit = () => {
    if (checked) return;
    const good = isCorrect(value, cur.answer);
    setOk(good);
    setChecked(true);
    if (good) setCorrect((c) => c + 1);
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

      <div className="card3d rounded-card border-2 border-ink/20 bg-card p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
          Themen-Prüfung · {skill.de} · зачёт 5 из 6
        </p>
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
              {ok ? "Richtig" : "Noch nicht"}
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
