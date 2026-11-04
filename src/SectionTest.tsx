/* ============================================================================
   ZWISCHENTEST — промежуточная контрольная по разделу пути
   ----------------------------------------------------------------------------
   8 задач из банка (tools/bank-build.cjs → public/bank.json) по всем узлам
   раздела. Это измерение: мастерство узлов не трогаем, XP — от доли.

   Почему банк, а не генерация: контрольная должна собираться мгновенно и
   работать офлайн, а её задачи уже прошли верификатор. Граф-задачи в
   контрольную не берём — для них нужен свой рендер, и в bank.json их
   считанные единицы.

   Банк может быть пуст по какому-то узлу — контрольная тогда просто мельче;
   если задач меньше 4, честно отказываемся запускаться.
   ========================================================================== */

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { correct as sfxCorrect, wrong as sfxWrong } from "@/lib/sfx";
import { SKILLS, drillable, type Branch } from "@/lib/skills";
import { isCorrect } from "@/lib/check";
import MathText from "@/MathText";
import type { GenTask } from "@/lib/ai";
import type { Snap } from "@/lib/motivation";

type BankTask = GenTask & { skill: string; solution?: string };

const N = 8;

export default function SectionTest({
  branch,
  branchTitle,
  onExit,
  onXp,
}: {
  branch: Branch;
  branchTitle: string;
  onExit: () => void;
  onXp?: (correct: number, total: number, xp?: number) => Snap;
}) {
  const [bank, setBank] = useState<Record<string, BankTask[]> | null>(null);
  const [tasks, setTasks] = useState<BankTask[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [snap, setSnap] = useState<Snap | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [secs, setSecs] = useState(0);

  const skills = useMemo(() => SKILLS.filter((s) => s.branch === branch && drillable(s)), [branch]);

  useEffect(() => {
    let dead = false;
    fetch("/bank.json")
      .then((r) => r.json())
      .then((flat: BankTask[]) => {
        if (dead) return;
        const by: Record<string, BankTask[]> = {};
        for (const t of flat) (by[t.skill] ??= []).push(t);
        setBank(by);
      })
      .catch(() => setBank({}));
    return () => {
      dead = true;
    };
  }, []);

  /* сборка контрольной: по задаче из каждого узла по кругу, без дублей */
  useEffect(() => {
    if (!bank || tasks) return;
    const pool: BankTask[] = [];
    for (let round = 0; round < 12 && pool.length < N; round++) {
      for (const s of skills) {
        const list = bank[s.id];
        if (!list) continue;
        const cand = list[round % list.length];
        if (cand && !cand.plot && !pool.some((x) => x.id === cand.id)) pool.push(cand);
        if (pool.length >= N) break;
      }
    }
    setTasks(pool.length >= 4 ? pool : []);
  }, [bank, skills, tasks]);

  /* секундомер — контрольная всё-таки на время, как настоящий тест */
  useEffect(() => {
    if (!tasks || tasks.length === 0 || idx >= tasks.length) return;
    const t = setInterval(() => setSecs((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [tasks, idx]);

  const finish = !tasks || tasks.length === 0 || idx >= tasks.length;

  useEffect(() => {
    if (!finish || saved || !tasks) return;
    setSaved(true);
    const xp = Math.round((correct / Math.max(1, tasks.length)) * 20) + 5;
    setSnap(onXp ? onXp(correct, tasks.length, xp) : undefined);
  }, [finish, saved, correct, tasks, onXp]);

  if (tasks && tasks.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10">
        <div className="card3d rounded-card border border-line bg-card p-6 text-center">
          <p className="text-[13px] font-bold text-muted">
            В банке пока слишком мало задач по разделу «{branchTitle}» — контрольную
            собрать нельзя. Доберём следующим прогоном банка.
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
        <p className="text-[13px] font-bold text-muted">Kontrolle lädt …</p>
      </div>
    );
  }

  if (finish) {
    const pass = correct / Math.max(1, tasks.length) >= 0.75;
    return (
      <div className="mx-auto w-full max-w-[640px] px-4 py-10">
        <div className="card3d rounded-card border border-line bg-card p-6 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Kontrolle · {branchTitle}
          </p>
          <p className="tnum mt-2 text-[44px] leading-none font-extrabold">
            {correct}
            <span className="text-[22px] text-muted"> / {tasks.length}</span>
          </p>
          <p className={cn("mt-2 text-[13px] font-extrabold", pass ? "text-greend" : "text-red")}>
            {pass
              ? "Раздел держится."
              : "Раздел проседает — вернись к жёлтым узлам этого блока."}
          </p>
          <p className="mt-1 text-[11.5px] font-bold text-muted">время: {secs} с</p>
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
    good ? sfxCorrect() : sfxWrong();
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

      <div className="card3d rounded-card border border-line bg-card p-5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
          Kontrolle · Stufe {cur.level ?? "—"}
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
          inputMode="text"
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
