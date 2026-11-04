import { useEffect, useMemo, useRef, useState } from "react";
import Tutor, { type RoundResult } from "@/Tutor";
import { BRANCHES, SKILLS, type Branch, type Skill } from "@/lib/skills";
import {
  PATH,
  counts,
  covText,
  current,
  daysLeft,
  isCovered,
  load,
  PASS,
  pNow,
  progress,
  passPf,
  record,
  save,
  statusOf,
  type M,
  type Status,
} from "@/lib/mastery";
import { cn } from "@/utils/cn";
import { soundOn, setSound, toggleClick } from "@/lib/sfx";
import Exam, { lastExam } from "@/Exam";
import Deutsch from "@/Deutsch";
import SectionTest from "@/SectionTest";
import MixTest from "@/MixTest";
import Pruefung from "@/Pruefung";
import Vocab from "@/Vocab";
import TopicPruefung from "@/TopicPruefung";
import DeutschExam from "@/DeutschExam";
import { load as dayLoad } from "@/lib/plan";
import { form, plural } from "@/lib/de";
import { loadC, summary as calibSummary } from "@/lib/calib";

/* подставляется сборкой (см. define в vite.config.ts) */
declare const __BUILD__: string;
import { moodOf, petLine } from "@/Pet";
import Mascot from "@/mascot/Mascot";
import MascotPicker from "@/mascot/MascotPicker";
import { useMascot } from "@/mascot/store";
import { addXp, loadMv, paceOf, saveMv, snapOf, xpForDeRound, xpForRound, type Mv, type Snap } from "@/lib/motivation";

/* ============================================================================
   DER WEG
   ----------------------------------------------------------------------------
   Один экран — одно действие. Вертикальный путь: ровная колонка узлов,
   разделы по темам, снизу одна кнопка «Weiter: <следующая подтема>».
   Карта (Programm) — только посмотреть, учиться на ней нельзя.

   Состояния узла — ответ на вопрос «что делать сейчас»:
   пройден (золотой, галочка) · повторение (синий, просрочен) · открыт
   (белый с зелёной рамкой) · закрыт (серый, не нажимается) · без тренажёра
   (пунктир — честно показываем, что задачи пока нет).

   РАСКЛАДКА. На телефоне это одна колонка 430 px — как было, её не трогаем.
   На широком экране колонка перестаёт висеть в пустоте: слева путь, справа
   панель, которая отвечает на «что делать сейчас» — сколько дней осталось,
   какой узел следующий, что просрочено на повторение и что вообще значат
   цвета. Раньше легенды не было нигде, и «серый кружок» приходилось
   угадывать.
   ========================================================================== */

type Section = {
  key: string;
  title: string;
  gold: boolean;
  note?: string;
  nodes: Skill[];
};

const SECTIONS: Section[] = [
  ...BRANCHES.map((b) => ({
    key: b.id,
    title: b.de,
    gold: false,
    nodes: PATH.filter((s) => s.kind === "atom" && s.branch === b.id),
  })).filter((s) => s.nodes.length > 0),
  {
    key: "combos",
    title: "Kombinationen",
    gold: true,
    note: "Noch kein Trainer: die Aufgaben dazu kommen, wenn die Atome sitzen.",
    nodes: PATH.filter((s) => s.kind === "combo"),
  },
];

export default function App() {
  const [m, setM] = useState<M>(() => load());
  const [view, setView] = useState<"weg" | "programm">("weg");
  const [active, setActive] = useState<Skill | null>(null);
  const [exam, setExam] = useState(false);
  const [mv, setMv] = useState<Mv>(() => loadMv());
  /* ДВА предмета, без смешивания: Mathe и Deutsch. У каждого своя
     под-навигация: математика — Weg/Prüfung, немецкий — Grammatik/Wörter/
     Prüfung. Сессии (Tutor/Exam/Mix/Kontrolle) полноэкранные, выход
     возвращает в свой предмет. */
  const [subject, setSubject] = useState<Subject>("mathe");
  const [matheView, setMatheView] = useState<"weg" | "pruefung">("weg");
  const [deView, setDeView] = useState<"grammatik" | "woerter" | "pruefung">("grammatik");
  /* промежуточная контрольная по разделу пути (см. SectionTest) */
  const [kontrolle, setKontrolle] = useState<Branch | null>(null);
  /* смешанная практика по всему пройденному (см. MixTest, Rohrer 2020) */
  const [mix, setMix] = useState(false);
  /* финальная проверка темы между темами (см. TopicPruefung) */
  const [tpf, setTpf] = useState<Skill | null>(null);

  /* Раунд закрывается здесь: сначала зачёт (p и покрытие форм), потом опыт и
     серия. Возвращаем снимок, чтобы экран итога показал «+N XP» и серию —
     сам он состояние не читает и не пишет. */
  const endRound = (id: string, r: RoundResult) => {
    setM((prev) => {
      const next = record(prev, id, r.p, r.cov);
      save(next);
      return next;
    });
    const { v, snap } = addXp(mv, xpForRound(r));
    saveMv(v);
    setMv(v);
    return snap;
  };

  if (mix) {
    return (
      <MixTest
        m={m}
        onExit={() => setMix(false)}
        onResult={(id, p, cov) =>
          setM((prev) => {
            const next = record(prev, id, p, cov);
            save(next);
            return next;
          })
        }
        onXp={(correct, total, xp): Snap => {
          const { v, snap } = addXp(mv, xp ?? Math.round((correct / Math.max(1, total)) * 30) + 10);
          saveMv(v);
          setMv(v);
          return snap;
        }}
      />
    );
  }

  if (kontrolle) {
    return (
      <SectionTest
        branch={kontrolle}
        branchTitle={BRANCHES.find((b) => b.id === kontrolle)?.de ?? ""}
        onExit={() => setKontrolle(null)}
        onXp={(correct, total, xp): Snap => {
          const { v, snap } = addXp(mv, xp ?? Math.round((correct / Math.max(1, total)) * 20) + 5);
          saveMv(v);
          setMv(v);
          return snap;
        }}
      />
    );
  }

  if (exam) {
    return (
      <Exam
        covOf={(id) => m[id]?.cov ?? []}
        onExit={() => setExam(false)}
        /* Экзамен не трогает мастерство: он измеряет, а не засчитывает.
           Но опыт за него даём — это единственная длинная сессия в приложении,
           и обнулять её в мотивации было бы странно. */
        onFinish={(r) => {
          const xp = Math.round((r.pts / Math.max(1, r.max)) * 40) + 10;
          const { v } = addXp(mv, xp);
          saveMv(v);
          setMv(v);
        }}
      />
    );
  }

  if (tpf) {
    return (
      <TopicPruefung
        skill={tpf}
        onExit={() => setTpf(null)}
        onPass={() =>
          setM((prev) => {
            const next = passPf(prev, tpf.id);
            save(next);
            return next;
          })
        }
        onXp={(correct, total, xp): Snap => {
          const { v, snap } = addXp(mv, xp ?? Math.round((correct / Math.max(1, total)) * 30) + 10);
          saveMv(v);
          setMv(v);
          return snap;
        }}
      />
    );
  }

  if (active) {
    return (
      <Tutor
        skill={active}
        p={pNow(m[active.id])}
        cov={m[active.id]?.cov}
        onExit={() => setActive(null)}
        onRound={endRound}
      />
    );
  }

  /* XP немецких веток — одна лямбда на три таба (раунды, словарь, экзамен) */
  const deXp = (correct: number, total: number, xp?: number): Snap => {
    const { v, snap } = addXp(mv, xp ?? xpForDeRound(correct, total));
    saveMv(v);
    setMv(v);
    return snap;
  };

  /* клик по узлу: тема пройдена по знанию и покрытию, но Themen-Prüfung
     не сдана — ведём в финальную проверку, а не в обычный раунд */
  const pickSkill = (s: Skill) => {
    const rec = m[s.id];
    if (rec && rec.p >= PASS && isCovered(s, rec) && !rec.pf) {
      setTpf(s);
      return;
    }
    setActive(s);
  };

  return (
    <div className="min-h-screen bg-bg pb-[84px] lg:pb-12">
      <ShellHeader subject={subject} onSubject={setSubject} view={view} onView={setView} m={m} />

      {subject === "mathe" ? (
        <div className="mx-auto flex w-full max-w-[880px] items-start gap-10 lg:px-6">
          <div className="min-w-0 flex-1 lg:w-[430px] lg:max-w-[430px] lg:shrink-0">
            <div className="px-4 lg:px-0">
              <SubBar
                items={[
                  { id: "weg", de: "Weg" },
                  { id: "pruefung", de: "Prüfung" },
                ]}
                active={matheView}
                onPick={(id) => setMatheView(id as "weg" | "pruefung")}
              />
            </div>
            {matheView === "weg" ? (
              view === "weg" ? (
                <Weg m={m} mv={mv} onPick={pickSkill} onKontrolle={setKontrolle} onMix={() => setMix(true)} />
              ) : (
                <Programm m={m} />
              )
            ) : (
              <Pruefung
                onExam={() => setExam(true)}
                onKontrolle={(b) => setKontrolle(b)}
                onMix={() => setMix(true)}
              />
            )}
          </div>
          {matheView === "weg" && (
            <Aside m={m} mv={mv} onPick={pickSkill} onExam={() => setExam(true)} onMix={() => setMix(true)} />
          )}
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[672px]">
          <div className="px-4">
            <SubBar
              items={[
                { id: "grammatik", de: "Grammatik" },
                { id: "woerter", de: "Wörter" },
                { id: "pruefung", de: "Prüfung" },
              ]}
              active={deView}
              onPick={(id) => setDeView(id as "grammatik" | "woerter" | "pruefung")}
            />
          </div>
          {deView === "grammatik" && <Deutsch onXp={deXp} />}
          {deView === "woerter" && <Vocab onXp={deXp} />}
          {deView === "pruefung" && <DeutschExam embedded onXp={deXp} onBack={() => {}} />}
        </div>
      )}

      <TabBar subject={subject} onSubject={setSubject} />
    </div>
  );
}

/* ---------------------------------------------------------------- шапка --- */

/* Сайт разделён на ДВА предмета: Mathe и Deutsch. Всё математическое —
   в Mathe, всё немецкое — в Deutsch, включая словарь и экзамен. На телефоне
   два больших таба внизу, на десктопе — в шапке. Внутри предмета одинаковая
   под-навигация: у математики Weg/Prüfung, у немецкого Grammatik/Wörter/Prüfung. */
type Subject = "mathe" | "deutsch";

const SUBJECTS: { id: Subject; de: string; ru: string; icon: React.ReactNode }[] = [
  {
    id: "mathe",
    de: "Mathe",
    ru: "математика",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="3" cy="13" r="1.6" fill="currentColor" />
        <circle cx="13" cy="3" r="1.6" fill="currentColor" />
        <path d="M4 12c3.5-1.5 4.5-6.5 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "deutsch",
    de: "Deutsch",
    ru: "немецкий",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M2.5 3.5h11v7.5H7L4 13.5v-2.5H2.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/** под-навигация внутри предмета: одинаковый паттерн в обоих разделах */
function SubBar({
  items,
  active,
  onPick,
}: {
  items: { id: string; de: string }[];
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="mb-3 flex gap-1.5">
      {items.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onPick(s.id)}
          aria-current={active === s.id}
          className={cn(
            "flex-1 rounded-xl border-2 py-2 text-[12px] font-extrabold transition",
            active === s.id
              ? "border-green bg-greenl text-greend"
              : "border-line bg-white text-muted hover:border-muted",
          )}
        >
          {s.de}
        </button>
      ))}
    </div>
  );
}

function ShellHeader({
  subject,
  onSubject,
  view,
  onView,
  m,
}: {
  subject: Subject;
  onSubject: (s: Subject) => void;
  view: "weg" | "programm";
  onView: (v: "weg" | "programm") => void;
  m: M;
}) {
  const c = counts(m);
  const [snd, setSnd] = useState(soundOn);
  return (
    <header className="sticky top-0 z-20 bg-bg">
      <div className="mx-auto flex max-w-[880px] items-center gap-3 px-4 pt-4 pb-1 lg:px-6">
        <span className="text-[19px] font-extrabold tracking-[-0.02em] text-green">TALLY</span>
        <span className="text-[9px] font-bold text-[#cfcfcf]">{__BUILD__}</span>
        <button
          type="button"
          aria-pressed={snd}
          aria-label={snd ? "Ton aus" : "Ton an"}
          title={snd ? "Ton aus" : "Ton an"}
          onClick={() => {
            const next = !snd;
            setSnd(next);
            setSound(next);
            if (next) toggleClick();
          }}
          className={cn(
            "ml-auto rounded-lg p-1.5 transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
            snd ? "text-green" : "text-[#d4d4d4]",
          )}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M2 6.2h2.4L8 3.2v9.6L4.4 9.8H2a.6.6 0 0 1-.6-.6V6.8A.6.6 0 0 1 2 6.2Z"
              fill="currentColor"
            />
            {snd ? (
              <>
                <path d="M10.4 6a2.8 2.8 0 0 1 0 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M12.3 4.2a5.4 5.4 0 0 1 0 7.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </>
            ) : (
              <path d="M10.6 6.1l3.2 3.2m0-3.2-3.2 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <div className="hidden items-center gap-1 lg:flex">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSubject(s.id)}
              aria-current={subject === s.id}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[13px] font-extrabold transition-colors",
                subject === s.id
                  ? "bg-greenl text-greend"
                  : "text-muted hover:bg-black/[0.04] hover:text-ink",
              )}
            >
              {s.de}
            </button>
          ))}
        </div>
        {subject === "mathe" && (
          <button
            type="button"
            onClick={() => onView(view === "weg" ? "programm" : "weg")}
            className="hidden rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-muted transition-colors hover:bg-black/[0.04] hover:text-ink lg:block"
          >
            {view === "weg" ? "Programm" : "← Weg"}
          </button>
        )}
      </div>
      {subject === "mathe" && (
        <>
          <div className="mx-auto flex max-w-[880px] items-center gap-2 px-4 pb-2 text-[11px] font-bold text-muted lg:hidden">
            <span className="tnum">{daysLeft()} Tage bis Prüfung</span>
            <span className="tnum ml-auto">
              {c.done} / {c.total} Knoten
            </span>
            <button
              type="button"
              onClick={() => onView(view === "weg" ? "programm" : "weg")}
              className="rounded border-2 border-line px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.06em] text-muted"
            >
              {view === "weg" ? "Programm" : "← Weg"}
            </button>
          </div>
          <div className="h-[6px] w-full bg-line lg:hidden">
            <div
              className="h-full bg-green transition-[width] duration-500"
              style={{ width: `${Math.round(progress(m) * 100)}%` }}
            />
          </div>
        </>
      )}
    </header>
  );
}

/* -------------------------------------------------------- таб-бар ---------
   Нижняя навигация телефона: 4 раздела всегда на месте. Это стандарт для
   приложений с 3–5 секциями (Duolingo живёт так же), а не украшение. */

function TabBar({ subject, onSubject }: { subject: Subject; onSubject: (s: Subject) => void }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-white lg:hidden"
      aria-label="Предметы"
    >
      <div className="mx-auto flex max-w-[520px] items-stretch">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSubject(s.id)}
            aria-current={subject === s.id}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.06em] transition-colors",
              subject === s.id ? "text-greend" : "text-muted",
            )}
          >
            {s.icon}
            {s.de}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------------- панель ---
   Только на широком экране. Это не второй интерфейс, а ответ на вопросы,
   которые на телефоне решает прокрутка: сколько осталось, куда идти, что
   просрочено. Кнопка здесь та же, что внизу на телефоне.
   -------------------------------------------------------------------------- */

function Aside({
  m,
  mv,
  onPick,
  onExam,
  onMix,
}: {
  m: M;
  mv: Mv;
  onPick: (s: Skill) => void;
  onExam: () => void;
  onMix: () => void;
}) {
  const cur = useMemo(() => current(m), [m]);
  const review = useMemo(() => PATH.filter((s) => statusOf(s, m) === "review"), [m]);
  const plan = useMemo(() => dayLoad(m), [m]);
  const cal = useMemo(() => calibSummary(loadC()), []);
  const exam = useMemo(() => lastExam(), []);

  return (
    <aside className="hidden lg:sticky lg:top-[70px] lg:block lg:w-[336px] lg:shrink-0">
      <Today mv={mv} m={m} />
      <MascotPicker className="mt-3" />

      {cur && (
        <div className="card3d mt-3 rounded-card border-2 border-green bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-green">
            Jetzt dran
          </p>
          <p className="mt-1 text-[15px] leading-tight font-extrabold">{cur.de}</p>
          <p className="text-[11.5px] font-semibold text-muted">{cur.ru}</p>
          {covText(cur, m[cur.id]) && (
            <p className="tnum mt-2 text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted">
              {covText(cur, m[cur.id])} Proben
            </p>
          )}
          <button
            type="button"
            onClick={() => onPick(cur)}
            className="btn3d btn3d-green mt-3 w-full rounded-xl px-3 py-3 text-[11.5px] font-extrabold tracking-[0.04em] uppercase"
          >
            <span className="block truncate">Weiter: {cur.de}</span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onMix}
        className="btn3d btn3d-white w-full rounded-xl px-3 py-2.5 text-[10.5px] font-extrabold tracking-[0.06em] uppercase"
      >
        Mix-Runde · повторение вперемешку
      </button>

      {/* ------------------------------------------------------- нагрузка ---
          Не «мотивационная цитата», а число: сколько новых узлов надо
          закрыть сегодня, чтобы успеть к 9 января. Число считается из
          календаря и остатка пути, поэтому само растёт по мере приближения
          экзамена — это и есть прогрессия нагрузки. */}
      <div className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Tagesplan
          </p>
          <span className="tnum text-[10.5px] font-extrabold text-muted">
            {plan.days} Tage
          </span>
        </div>
        <div className="mt-1.5 flex items-end gap-1.5">
          <span className="tnum text-[26px] leading-none font-extrabold">{plan.neu}</span>
          <span className="pb-0.5 text-[11px] font-extrabold text-muted">
            {form(plan.neu, "neuer Knoten", "neue Knoten")} ·{" "}
            {plural(plan.reviews, "Wiederholung", "Wiederholungen")}
          </span>
        </div>
        <p className="mt-1 text-[11px] font-semibold text-muted">
          {plan.remaining === 0
            ? "Alles offen ist geschlossen — jetzt halten."
            : plan.onTrack
              ? `Im Plan. Noch ${plan.remaining} Knoten bis Januar.`
              : `Rückstand: ${plan.remaining} Knoten bei ${plan.days} Tagen.`}
        </p>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: Math.min(plan.neu, 5) }).map((_, i) => (
            <span
              key={i}
              className={cn("h-1.5 flex-1 rounded-full", i < plan.today ? "bg-green" : "bg-line")}
            />
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------ экзамен ----- */}
      <div className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-gold">
            Probeprüfung
          </p>
          {exam && (
            <span className="tnum text-[10.5px] font-extrabold text-muted">
              {exam.pts} / {exam.max}
            </span>
          )}
        </div>
        <p className="mt-1 text-[11.5px] font-semibold text-muted">
          {exam
            ? "60 Minuten, 7 Aufgaben, 20 Punkte — wie am 9. Januar."
            : "Einmal unter echten Bedingungen: 60 Minuten, kein Taschenrechner."}
        </p>
        <button
          type="button"
          onClick={onExam}
          className="btn3d btn3d-white mt-2.5 w-full rounded-xl px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.06em]"
        >
          {exam ? "Nochmal schreiben" : "Prüfung schreiben"}
        </button>
      </div>

      {/* --------------------------------------------------- калибровка ----- */}
      {cal.n > 0 && (
        <p className="mt-3 px-1 text-[10px] leading-[1.5] font-bold text-muted">
          Kalibrierung: {plural(cal.forms, "Form", "Formen")},{" "}
          {plural(cal.n, "Antwort", "Antworten")} · Treffer{" "}
          {Math.round(cal.acc * 100)} % · Tempo {cal.pace.toFixed(2)}× Par
        </p>
      )}

      {review.length > 0 && (
        <div className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue">
              Wiederholen
            </p>
            <span className="tnum text-[10.5px] font-extrabold text-muted">{review.length}</span>
          </div>
          <div className="mt-1.5 space-y-0.5">
            {review.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onPick(s)}
                className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue"
              >
                <span className="w-3 shrink-0 text-center text-[13px] leading-none font-extrabold text-blue">
                  ↻
                </span>
                <span className="min-w-0 flex-1 truncate text-[12px] font-bold">{s.de}</span>
              </button>
            ))}
          </div>
          {review.length > 4 && (
            <p className="mt-1 text-[10.5px] font-bold text-muted">
              +{review.length - 4} weitere
            </p>
          )}
        </div>
      )}

      <div className="mt-4 px-1">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
          Legende
        </p>
        <ul className="space-y-1.5">
          <Legend cls="bg-gold" label="bestanden — alle Formen, Wiederholung geplant" />
          <Legend cls="bg-blue" label="Wiederholung fällig" />
          <Legend cls="border-2 border-green bg-white" label="offen — hier geht es weiter" />
          <Legend cls="bg-[#e5e5e5]" label="gesperrt — erst die Themen davor" />
          <Legend cls="border-2 border-line bg-transparent" label="noch kein Trainer" />
        </ul>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------- сегодня ---
   Главная карточка машины. Порядок чтения выбран по важности, а не по
   яркости: серия (привычка), цель дня (объём), неделя (регулярность), и
   последней строкой — темп к экзамену, который и есть настоящая цель.
   -------------------------------------------------------------------------- */

function Today({ mv, m, onMix }: { mv: Mv; m: M; onMix?: () => void }) {
  const s = snapOf(mv);
  const c = counts(m);
  const pace = paceOf(Math.max(0, c.total - c.done), daysLeft());
  const pct = Math.min(100, Math.round((s.todayXp / s.goal) * 100));
  const mood = moodOf(s, mv);
  const mascot = useMascot();

  return (
    <div className="card3d rounded-card border-2 border-line bg-white p-4">
      {/* зверёк и одна фраза: это единственная часть карточки, которую
          читают не глазами, а настроением */}
      <div className="flex items-end gap-2">
        {/* Rive-ветка (PetLive) убрана из рендера: /pet.riv не существует,
            поэтому каждый вход в приложение давал 404 в консоль, а картинка
            всё равно бралась из Pet. Файл PetLive.tsx оставлен — если .riv
            когда-нибудь появится, вернуть будет одна строка. */}
        <Mascot char={mascot} mood={mood} className="h-[96px] w-auto shrink-0" />
        <div className="min-w-0 flex-1 pb-1.5">
          <p className="text-[12.5px] leading-snug font-extrabold">{petLine(mood, s)}</p>
          <p className="mt-1 text-[9.5px] font-extrabold tracking-[0.1em] text-muted uppercase">
            {s.streak > 0
              ? s.streak + (s.streak === 1 ? " Tag" : " Tage") + " in Folge"
              : "noch keine Serie"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between text-[9.5px] font-extrabold tracking-[0.1em] text-muted uppercase">
        <span>Heute</span>
        <span className="tnum text-[11.5px] text-ink">
          {s.todayXp} <span className="text-muted">/ {s.goal} XP</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            s.goalHit ? "bg-green" : "bg-gold",
          )}
          style={{ width: pct + "%" }}
        />
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {s.week.map((d) => (
          <span
            key={d.key}
            title={d.key}
            className={cn(
              "h-2 flex-1 rounded-full",
              d.on ? "bg-green" : "bg-line",
              d.today && "h-2.5",
            )}
          />
        ))}
      </div>

      {onMix && (
        <button
          type="button"
          onClick={onMix}
          className="btn3d btn3d-white mt-3 w-full rounded-xl py-2.5 text-[10.5px] font-extrabold uppercase tracking-[0.08em]"
        >
          Mix-Runde · всё вперемешку
        </button>
      )}

      <div className="mt-3 flex items-baseline gap-2 border-t-2 border-line pt-2.5">
        <span className="tnum text-[15px] font-extrabold">{pace.left}</span>
        <span className="text-[10px] font-bold text-muted">Knoten · {pace.days} Tage</span>
        <span className="tnum ml-auto shrink-0 text-[10px] font-extrabold text-ink/70">
          {pace.left > 0 ? "≈ " + pace.perWeek.toFixed(1) + " / Woche" : "alles zu"}
        </span>
      </div>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className={cn("mt-[3px] h-3 w-3 shrink-0 rounded-full", cls)} />
      <span className="text-[11px] leading-snug font-semibold text-[#8a8a8a]">{label}</span>
    </li>
  );
}

/* ----------------------------------------------------------------- путь --- */

/* змейка-смещение убрано: с линией тропы оно читалось как «кружки стоят мимо
   пути», а не как тропа. Теперь путь держит линия, а не сдвиг. */
const POS = new Map(PATH.map((s, i) => [s.id, i]));

function Weg({
  m,
  mv,
  onPick,
  onKontrolle,
  onMix,
}: {
  m: M;
  mv: Mv;
  onPick: (s: Skill) => void;
  onKontrolle: (b: Branch) => void;
  onMix: () => void;
}) {
  const cur = useMemo(() => current(m), [m]);
  const curRef = useRef<HTMLDivElement>(null);
  const [jump, setJump] = useState(false);

  // при входе путь подкручивается к тому узлу, где ты стоишь
  useEffect(() => {
    curRef.current?.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // стрелка «вернуться к текущему» появляется, только когда узел ушёл из вида
  useEffect(() => {
    const el = curRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setJump(!e.isIntersecting), {
      rootMargin: "-90px 0px -90px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <main className="mx-auto flex max-w-[430px] flex-col px-4 pt-4 lg:px-0">
      {/* на телефоне это единственное место, где видно серию и цель дня */}
      <div className="mb-4 lg:hidden">
        <Today mv={mv} m={m} onMix={onMix} />
        <MascotPicker className="mt-3" />
      </div>
      {SECTIONS.map((sec) => {
        const done = sec.nodes.filter((s) => statusOf(s, m) === "mastered").length;
        return (
          <section key={sec.key} className="mb-4">
            <div
              className={cn(
                "card3d mb-5 rounded-card border-2 bg-white px-4 py-2.5",
                sec.gold ? "border-gold/50" : "border-line",
              )}
            >
              <div className="flex items-baseline gap-2">
                <h2 className="text-[13.5px] font-extrabold">{sec.title}</h2>
                <span className="tnum ml-auto shrink-0 text-[11px] font-bold text-muted">
                  {done}/{sec.nodes.length}
                </span>
                <button
                  type="button"
                  onClick={() => onKontrolle(sec.key as Branch)}
                  title="Промежуточная контрольная по разделу"
                  className="shrink-0 rounded-lg border-2 border-line px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.06em] text-muted transition hover:border-gold hover:text-ink"
                >
                  Kontrolle
                </button>
              </div>
              {sec.note && (
                <p className="mt-0.5 text-[11px] leading-snug font-semibold text-muted">{sec.note}</p>
              )}
            </div>

            {/* mt, а не pt: отступ снаружи — тогда absolute-тропа начинается
                ровно от первого кружка, а не торчит обрубком над «START» */}
            <div className="relative mt-6 flex flex-col items-center gap-3">
              {/* тропа: без неё узлы читаются как отдельные кружки, а не как путь */}
              <Trail nodes={sec.nodes} curId={cur?.id} />
              {sec.nodes.map((s) => {
                const st = statusOf(s, m);
                const isCur = cur?.id === s.id;
                /* финальная проверка между темами: пройдена, но pf нет —
                   на узле висит «Prüfung», клик идёт в неё */
                const needsPf = (st === "mastered" || st === "review") && !m[s.id]?.pf;
                return (
                  <div
                    key={s.id}
                    ref={isCur ? curRef : undefined}
                    className="relative z-10 scroll-mt-28"
                  >
                    <Node
                      s={s}
                      st={st}
                      cur={isCur}
                      cov={covText(s, m[s.id])}
                      needsPf={needsPf}
                      onPick={onPick}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <p className="mb-6 text-center text-[11px] leading-snug font-bold text-[#c2c2c2]">
        {(() => {
          const noTrainer = SKILLS.filter((s) => !s.gen.length).length;
          return noTrainer > 0
            ? `${noTrainer} Knoten ohne Trainer stehen auf der Karte, aber es gibt noch keine Aufgaben dazu.`
            : "Jeder Knoten hat einen Trainer. Gold heißt: alle Formen der Aufgabe bestanden.";
        })()}
      </p>

      {jump && cur && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 lg:hidden">
          <div className="mx-auto flex max-w-[430px] justify-end px-3">
            <button
              type="button"
              onClick={() => curRef.current?.scrollIntoView({ block: "center", behavior: "smooth" })}
              aria-label="Zum aktuellen Knoten"
              className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border-2 border-line bg-white shadow-[0_4px_0_#e5e5e5] transition-transform active:translate-y-[3px] active:shadow-none"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#58cc02" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/**
 * Тропа между узлами. Рисуется как отдельный слой под кружками: сплошная
 * линия по центру колонки, пройденная часть — зелёная. Кружки непрозрачные,
 * поэтому линия сама «прячется» под ними и читается как станции на пути.
 * Подписи под кружками перекрывают линию фоном — иначе текст лежал бы на ней.
 */
function Trail({ nodes, curId }: { nodes: Skill[]; curId?: string }) {
  /* Где стоим — в координатах всего пути, а не раздела: иначе пройденные
     разделы оставались бы серыми, хотя они уже за спиной. */
  const curPos = curId ? POS.get(curId) ?? -1 : -1;
  const firstPos = POS.get(nodes[0].id) ?? 0;
  const lastPos = POS.get(nodes[nodes.length - 1].id) ?? 0;
  const frac =
    curPos < 0 || curPos < firstPos
      ? 0
      : curPos >= lastPos
        ? 1
        : (curPos - firstPos + 0.5) / nodes.length;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-7 inset-x-0 z-0">
      <div className="absolute top-0 bottom-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-line/70" />
      {frac > 0 && (
        <div
          className="absolute top-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-green/45"
          style={{ height: `${frac * 100}%` }}
        />
      )}
    </div>
  );
}

function Node({
  s,
  st,
  cur,
  cov,
  needsPf,
  onPick,
}: {
  s: Skill;
  st: Status;
  cur: boolean;
  /** «3/5» — сколько форм задачи уже сдано */
  cov: string;
  /** тема пройдена, но Themen-Prüfung не сдана */
  needsPf?: boolean;
  onPick: (s: Skill) => void;
}) {
  const combo = s.kind === "combo";
  const size = combo ? 66 : 56;
  const dead = st === "locked" || st === "notrainer";
  // «0/6 Proben» под каждым из 39 узлов — шум. Показываем, только когда
  // человек уже что-то сдал по этому узлу, или когда это текущий узел.
  const showCov =
    !!cov && (cur || !cov.startsWith("0/")) && st !== "mastered" && !dead;

  return (
    <div className="relative flex flex-col items-center">
      {cur && (
        <span className="mb-1 rounded-lg border-2 border-line bg-white px-[7px] py-[1px] text-[10px] font-extrabold tracking-[0.06em] text-green">
          START
        </span>
      )}
      {needsPf && (
        <span className="mb-1 rounded-lg border-2 border-gold bg-white px-[7px] py-[1px] text-[10px] font-extrabold tracking-[0.06em] text-ink">
          Prüfung
        </span>
      )}

      <button
        type="button"
        disabled={dead}
        onClick={() => onPick(s)}
        aria-label={`${s.de} — ${st}`}
        style={{ width: size, height: size }}
        className={cn(
          "relative grid shrink-0 place-items-center transition-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue",
          combo ? "rotate-45 rounded-[18px]" : "rounded-full",
          cur && "bg-green text-white shadow-[0_4px_0_#46a302]",
          !cur && st === "mastered" && "bg-gold text-white shadow-[0_4px_0_#e0a800]",
          !cur && st === "review" && "bg-blue text-white shadow-[0_4px_0_#1899d6]",
          !cur && st === "open" && "border-2 border-green bg-white text-green shadow-[0_4px_0_#e5e5e5]",
          st === "locked" && "border-2 border-[#dcdcdc] bg-[#ececec] shadow-[0_4px_0_#dfdfdf]",
          st === "notrainer" &&
            (combo
              ? "border-2 border-dashed border-gold bg-transparent"
              : "border-2 border-dashed border-line bg-transparent"),
          !dead && "active:translate-y-[3px] active:shadow-none",
        )}
      >
        {/* пульсация отдельным слоем: box-shadow кнопки должен остаться */}
        {cur && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 animate-[halo_2.4s_ease-in-out_infinite]",
              combo ? "rounded-[18px]" : "rounded-full",
            )}
          />
        )}

        <span className={cn("grid place-items-center", combo && "-rotate-45")}>
          {cur ? (
            <span className="ml-[3px] h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-white" />
          ) : st === "mastered" ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.2l2.9 6.2 6.7.9-4.9 4.6 1.2 6.6L12 17.4 6.1 20.5l1.2-6.6L2.4 9.3l6.7-.9z" />
            </svg>
          ) : st === "review" ? (
            <span className="text-[20px] leading-none font-extrabold">↻</span>
          ) : st === "open" ? (
            <span className="h-2.5 w-2.5 rounded-full bg-green" />
          ) : st === "locked" ? (
            /* замок: серый кружок без значка не читался как «заперто» */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a9a9a9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
              <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
            </svg>
          ) : null}
        </span>
      </button>

      <span
        className={cn(
          "mt-1 w-[128px] rounded bg-bg px-1 text-center text-[10.5px] leading-[1.2] font-bold",
          combo && "mt-[10px]",
          cur
            ? "text-ink"
            : st === "notrainer" || st === "locked"
              ? "text-[#a3a3a3]"
              : "text-[#8a8a8a]",
        )}
      >
        {s.de}
      </span>

      {showCov && (
        <span
          className={cn(
            "tnum mt-0.5 rounded bg-bg px-1 text-[9px] font-extrabold tracking-[0.04em]",
            cur ? "text-greend" : "text-[#b5b5b5]",
          )}
        >
          {cov} Proben
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- Programm --- */

function Programm({ m }: { m: M }) {
  const combos = SKILLS.filter((s) => s.kind === "combo");

  return (
    <main className="mx-auto max-w-[430px] px-4 pt-4 lg:px-0">
      <p className="text-[12px] leading-relaxed font-semibold text-muted">
        Nur zum Nachsehen. Gelernt wird auf dem Weg — hier kann man nichts anklicken.
      </p>

      {BRANCHES.map((b) => {
        const items = SKILLS.filter((s) => s.branch === b.id && s.kind === "atom");
        if (!items.length) return null;
        return (
          <section key={b.id} className="mt-5">
            <h2 className="mb-2 flex items-baseline gap-2 text-[13px] font-extrabold">
              {b.de}
              <span className="text-[11px] font-bold text-muted">{b.ru}</span>
            </h2>
            <div className="card3d overflow-hidden rounded-card border-2 border-line bg-white">
              {items.map((s, i) => (
                <Row key={s.id} s={s} m={m} first={i === 0} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-5">
        <h2 className="mb-2 flex items-baseline gap-2 text-[13px] font-extrabold">
          Kombinationen
          <span className="text-[11px] font-bold text-gold">{combos.length}</span>
        </h2>
        <div className="card3d overflow-hidden rounded-card border-2 border-line bg-white">
          {combos.map((s, i) => (
            <Row key={s.id} s={s} m={m} first={i === 0} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Row({ s, m, first }: { s: Skill; m: M; first: boolean }) {
  const st = statusOf(s, m);
  const p = pNow(m[s.id]);

  return (
    <div className={cn("flex items-center gap-3 px-3 py-2.5", !first && "border-t border-line")}>
      <span
        className={cn(
          "h-2.5 w-2.5 shrink-0 rounded-full",
          st === "mastered" && "bg-green",
          st === "review" && "bg-gold",
          st === "open" && "bg-blue",
          st === "locked" && "bg-line",
          st === "notrainer" && "border border-dashed border-muted",
        )}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-bold">{s.de}</span>
        <span className="block truncate text-[11px] font-semibold text-muted">{s.ru}</span>
      </span>
      <span className="w-12 shrink-0">
        <span className="block h-1.5 w-full overflow-hidden rounded-full bg-line">
          <span
            className="block h-full rounded-full bg-green"
            style={{ width: `${Math.round(p * 100)}%` }}
          />
        </span>
      </span>
      <span className="tnum w-8 shrink-0 text-right text-[11px] font-bold text-muted">
        {p > 0 ? p.toFixed(2) : "—"}
      </span>
    </div>
  );
}

/* --------------------------------------------------------------- низ ----- */


