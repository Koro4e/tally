import { useCallback, useEffect, useRef, useState } from "react";
import MathText, { MathTerm, splitPrompt } from "@/MathText";
import Graph from "@/Graph";
import { ask, explain, generateTask, judgeRoundSafe, type GenTask, type RoundLog } from "@/lib/ai";
import { isCorrect, mmss } from "@/lib/check";
import type { Snap } from "@/lib/motivation";
import { moodOfSnap } from "@/Pet";
import Mascot, { type MascotMood } from "@/mascot/Mascot";
import { useMascot } from "@/mascot/store";
import { byId, type Skill } from "@/lib/skills";
import { specOf, variantCount, type Variante } from "@/lib/specs";
import {
  difficulty,
  key as ckey,
  levelFor,
  loadC,
  observe,
  orderByDifficulty,
  parFor,
  saveC,
  type Calib,
} from "@/lib/calib";
import Lehr from "@/Lehr";
import { correct as sfxCorrect, wrong as sfxWrong, sparkle } from "@/lib/sfx";
import { cn } from "@/utils/cn";

/* ============================================================================
   РАУНД
   ----------------------------------------------------------------------------
   Шесть задач по одному узлу. Таймер идёт вверх, полоса заполняется до par:
   ты соревнуешься не с обратным отсчётом, а со временем, за которое это
   должен решать человек, сдавший экзамен.

   Состав раунда больше не случайный. У узла есть список форм задачи
   (`specs.ts`); раунд собирается так, чтобы за шесть задач пройти как можно
   больше РАЗНЫХ форм, начиная с ещё не сданных. Модель получает не «тему»,
   а конкретную форму с примером — поэтому она не уезжает в соседнюю тему.

   В конце — вердикт. Считает его сервер: BKT по всем шести ответам плюс
   модель, которая смотрит, что ты написал и сколько думал. Модель может
   только занизить оценку, поэтому «зелёный» здесь значит «арифметика и
   глаза сошлись», а не «повезло шесть раз». И узел закрывается только
   когда сданы все формы — иначе зелёный врал бы про «любую задачу».
   ========================================================================== */

const ROUND = 6;

export type RoundResult = {
  p: number;
  p_bkt: number;
  urteil: "verstanden" | "wackelt" | "nicht" | "unbekannt";
  grund: string;
  correct: number;
  total: number;
  sec: number;
  par: number;
  /** какие формы сданы в этом раунде */
  cov: string[];
  /** сколько всего форм у узла */
  covTotal: number;
};

type Msg = { role: "user" | "assistant"; content: string };

/**
 * Порядок форм на раунд: сначала те, что ещё не сданы, потом уже сданные
 * (повторение), и так по кругу, пока не наберётся ROUND задач.
 *
 * Внутри каждой группы — от простого к сложному по ЗАМЕРЕННОЙ сложности
 * (`calib.ts`). Раньше формы шли в случайном порядке: первая задача могла
 * оказаться самой трудной, и раунд начинался с провала. Небольшой шум
 * сохраняет прогрессию, но не даёт двум раундам подряд идти одинаково.
 */
function buildPlan(id: string, cov: string[], c: Calib): Variante[] {
  const all = specOf(id)?.varianten ?? [];
  if (!all.length) return [];
  const done = new Set(cov);
  const fresh = all
    .filter((v) => !done.has(v.id))
    .map((v) => ({ v, k: difficulty(c[ckey(id, v.id)]) + Math.random() * 0.06 }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.v);
  const seen = orderByDifficulty(id, all.filter((v) => done.has(v.id)), c);
  const out: Variante[] = [];
  while (out.length < ROUND) out.push(...fresh, ...seen);
  return out.slice(0, Math.max(ROUND, all.length));
}

/** решённые bank-id: повтор не гоняет одни и те же задачи из банка */
const usedBankIds = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem("tally.bank.used") ?? "[]") as string[]);
  } catch {
    return new Set();
  }
};

export default function Tutor({
  skill,
  p,
  cov = [],
  onExit,
  onRound,
}: {
  skill: Skill;
  p: number;
  /** какие формы этого узла уже сданы раньше */
  cov?: string[];
  onExit: () => void;
  /** возвращает снимок машины: опыт, серия, цель дня */
  onRound: (id: string, r: RoundResult) => Snap;
}) {
  const [task, setTask] = useState<GenTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<null | boolean>(null);
  const [lastSec, setLastSec] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [chat, setChat] = useState<Msg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [log, setLog] = useState<RoundLog[]>([]);
  /* живой маскот в шапке раунда: короткая реакция на каждый ответ */
  const mascot = useMascot();
  const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
  const mascotTimer = useRef<number | undefined>(undefined);
  const flashMascot = useCallback((m: MascotMood) => {
    window.clearTimeout(mascotTimer.current);
    setMascotMood(m);
    mascotTimer.current = window.setTimeout(() => setMascotMood("idle"), 1600);
  }, []);
  useEffect(() => () => window.clearTimeout(mascotTimer.current), []);

  /* фото→OCR: листок с решением → текст. Несколько строк транскрипции —
     это несколько корней, склеиваем через «;» (формат multi-root ответа). */
  const onFoto = async (file: File): Promise<void> => {
    setOcrErr(null);
    setOcrBusy(true);
    try {
      const uri = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const max = 1400;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          resolve(c.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("это не картинка"));
        };
        img.src = url;
      });
      const r = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uri }),
      });
      const out = await r.json();
      if (!r.ok) throw new Error(out.error || `сервер ${r.status}`);
      const text = String(out.text || "")
        .split(/\n+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .join("; ");
      if (!text) throw new Error("распозналось пусто — сфотографируй ближе");
      setInput((prev) => (prev.trim() ? prev + "; " + text : text));
      inputRef.current?.focus();
    } catch (e) {
      setOcrErr(e instanceof Error ? e.message : "OCR не удался");
    } finally {
      setOcrBusy(false);
    }
  };
  /* Новый узел начинается с правила, а не с задачи. Уже тронутый — сразу
     с раунда: повторять теорию человеку, который её видел, — это трата
     его единственного ресурса. */
  const isNew = p <= 0 && cov.length === 0;
  const [phase, setPhase] = useState<"lehr" | "drill" | "judge" | "done">(
    isNew ? "lehr" : "drill",
  );
  const [result, setResult] = useState<RoundResult | null>(null);
  const [mvSnap, setMvSnap] = useState<Snap | null>(null);
  const [calib, setCalib] = useState<Calib>(loadC);
  const calibRef = useRef(calib);
  calibRef.current = calib;

  const inputRef = useRef<HTMLInputElement>(null);
  /* фото→OCR: решение с листа камерой → текст в поле ответа. Распознанное
     попадает в РЕДАКТИРУЕМОЕ поле — человек подтверждает его «Prüfen»-ом,
     это и есть защита от ошибок OCR. Работает только при запущенном сервере
     (нужен KIOSAPI_KEY); оффлайн-фолбэк — панель символов. */
  const fotoRef = useRef<HTMLInputElement>(null);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrErr, setOcrErr] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const taskStart = useRef(Date.now());
  const abort = useRef<AbortController | null>(null);
  const asked = useRef(false);
  /** серия верных подряд внутри раунда: чем длиннее, тем выше тон «ок» */
  const combo = useRef(0);
  /** p на входе в раунд: App обновит проп сразу после вердикта, а показывать надо исходный */
  const p0 = useRef(p).current;

  const req = useCallback(
    () => ({
      label: skill.de,
      deps: skill.deps.map((d) => byId[d]?.de ?? d),
      subject: "mathe" as const,
      spec: (() => {
        const s = specOf(skill.id);
        return s ? { was: s.was, beispiel: s.beispiel, nicht: s.nicht } : undefined;
      })(),
      plot: specOf(skill.id)?.plot === true,
    }),
    [skill.de, skill.deps, skill.id],
  );

  /* ---------------------------------------------------------- банк -------
     Офлайн-страховка: задачи, сгенерированные и верифицированные заранее
     (tools/bank-build.cjs → public/bank.json). Банк отдаёт задачу
     мгновенно — латентность 1–47 с и упор в квоту LLM исчезают из
     повседневного раунда. Фоллбек — живая генерация, поэтому банк может
     быть пустым/неполным, ничего не ломается. Решённые bank-id пишутся в
     localStorage, чтобы повтор не гонял одни и те же задачи. */
  const bank = useRef<Record<string, GenTask[]>>({});
  const usedBank = useRef<Set<string>>(usedBankIds()).current;
  useEffect(() => {
    fetch("/bank.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: GenTask[] | null) => {
        /* bank.json — плоский массив; в памяти индексируем по узлу, чтобы
           takeFromBank смотрел только пул своего навыка */
        if (Array.isArray(j)) {
          const by: Record<string, GenTask[]> = {};
          for (const t of j) if (t.skill && t.id) (by[t.skill] ??= []).push(t);
          bank.current = by;
        }
      })
      .catch(() => {
        /* банка нет — раунд работает как раньше, через живую генерацию */
      });
  }, []);

  const takeFromBank = useCallback(
    (variante?: Variante, level = 3): GenTask | null => {
      const list = bank.current[skill.id];
      if (!list?.length) return null;
      /* из неиспользованных задач формы берём ближайшую по уровню:
         банк сгенерирован на Stufe 4–5, и лёгкому узлу не надо отдавать
         самое тяжёлое первым */
      const cand = list
        .filter((t) => t.id && (!variante || t.variante === variante.id) && !usedBank.has(t.id))
        .sort((a, b) => Math.abs((a.level ?? 4) - level) - Math.abs((b.level ?? 4) - level))[0];
      if (!cand?.id) return null;
      usedBank.add(cand.id);
      try {
        localStorage.setItem("tally.bank.used", JSON.stringify([...usedBank].slice(-2000)));
      } catch {
        /* приватный режим — просто не запоминаем */
      }
      return { ...cand, verified: true, attempts: 0 };
    },
    [skill.id, usedBank],
  );

  /* ------------------------------------------------------------- план -----
     Очередь форм на раунд. Заполняется один раз на узел, дальше enqueue
     просто берёт следующую — поэтому предзагрузка на 2 задачи вперёд не
     ломает покрытие: формы идут в том порядке, в котором их выбрал plan. */
  const plan = useRef<Variante[]>([]);
  const covRef = useRef(cov);
  covRef.current = cov;

  const nextVariant = useCallback((): Variante | undefined => {
    if (!plan.current.length)
      plan.current = buildPlan(skill.id, covRef.current, calibRef.current);
    return plan.current.shift();
  }, [skill.id]);

  /* ---------------------------------------------------------- генерация ---
     Пул промисов, а не массив готовых задач: латентность 1–23 с, и если
     хранить только готовое, «Weiter» успевает нажать раньше, чем приедет
     следующая. Запросы идут строго по одному — параллельная предзагрузка
     упирается в rate limit модели и роняет вердикт в конце раунда. */
  const pool = useRef<Promise<GenTask>[]>([]);
  const tail = useRef<Promise<unknown>>(Promise.resolve());

  const enqueue = useCallback(() => {
    const variante = nextVariant();
    /* Уровень считается НА КАЖДУЮ ЗАДАЧУ, а не на раунд: у форм разная
       замеренная сложность, и требовать «Stufe 4» от формы, на которой
       человек ещё ни разу не был, — значит гарантировать провал. */
    const d = variante ? difficulty(calibRef.current[ckey(skill.id, variante.id)]) : 0.45;
    const level = levelFor(p0, d);
    const next = () => {
      const fromBank = takeFromBank(variante, level);
      return fromBank ? Promise.resolve(fromBank) : generateTask({ ...req(), level, variante });
    };
    const pr = tail.current.then(next, next);
    /* Если генерация сорвалась, форма возвращается в начало плана. Иначе
       сбой съедал форму: автоповтор брал следующую задачу, а эта не
       появлялась уже никогда — и покрытие не набиралось. */
    const guarded = pr.catch((e) => {
      if (variante) plan.current.unshift(variante);
      throw e;
    });
    tail.current = guarded.catch(() => undefined);
    return guarded;
  }, [req, nextVariant, skill.id, p0]);

  const fill = useCallback(
    (n: number) => {
      for (let i = 0; i < n; i++) {
        const pr = enqueue();
        pr.catch(() => {
          /* ошибку покажет take() */
        });
        pool.current.push(pr);
      }
      setBuffered(pool.current.length);
    },
    [enqueue],
  );

  const take = useCallback(() => {
    const pr = pool.current.shift() ?? enqueue();
    setBuffered(pool.current.length);
    return pr;
  }, [enqueue]);

  useEffect(() => {
    plan.current = [];
    pool.current = [];
    tail.current = Promise.resolve();
    startedAt.current = Date.now();
    // первая задача грузится тем же путём, что и остальные: с автоповтором.
    // Раньше здесь был отдельный take() без ретраев, и один сбой генерации
    // на входе оставлял человека с красным баннером.
    loadNext();
    return () => {
      abort.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill.id]);

  /* ------------------------------------------------------------- таймер --- */
  const running = phase === "drill" && task !== null && !loading;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed((Date.now() - startedAt.current) / 1000), 200);
    return () => window.clearInterval(id);
  }, [running]);

  /* curSec/par убраны вместе с полосой скорости; par остался в данных
     задачи и калибровке — считается в log при отправке ответа. */

  /* ------------------------------------------------------------ отправка --- */
  const submit = async () => {
    if (!task || verdict !== null || !input.trim()) return;
    const ok = isCorrect(input, task.answer);
    const sec = (Date.now() - taskStart.current) / 1000;

    setLastSec(sec);
    setLog((l) => [
      ...l,
      {
        prompt: task.prompt,
        answer: task.answer,
        given: input,
        ok,
        sec,
        par: task.par,
        asked: asked.current,
        variante: task.variante ?? undefined,
      },
    ]);
    setVerdict(ok);
    flashMascot(ok ? "cheer" : "sad");

    /* Замер. Без него «прогрессия нагрузки» — это константа: система не
       знает, какая форма даётся тяжело, и не может поднять или опустить
       уровень. Пишем сразу, до сети: разбор может не приехать, а факт
       ответа и время уже случились. */
    setCalib((c) => {
      const next = observe(c, skill.id, task.variante ?? undefined, ok, sec, task.par);
      saveC(next);
      return next;
    });

    /* звук — сразу, до сети: ответ должен отзываться в тот же кадр, а не
       после того, как приедет разбор. Комбо считаем здесь же. */
    if (ok) {
      combo.current += 1;
      sfxCorrect(combo.current);
    } else {
      combo.current = 0;
      sfxWrong();
    }

    if (ok) return;

    setStreaming(true);
    setExplanation("");
    abort.current = new AbortController();
    try {
      await explain(task, input, (t) => setExplanation((prev) => prev + t), abort.current.signal);
    } catch {
      setExplanation("");
    } finally {
      setStreaming(false);
    }
  };

  const finish = async () => {
    setPhase("judge");
    combo.current = 0;
    try {
      /* Safe-версия: при недоступности сервера раунд не сгорает —
         локальный BKT (см. ai.ts), идеальный раунд закрывает узел и офлайн. */
      const r = await judgeRoundSafe(skill.de, p0, log);
      // покрытие: только верно решённые формы, вместе с тем, что было сдано раньше
      const now = log.filter((x) => x.ok && x.variante).map((x) => x.variante as string);
      const res: RoundResult = {
        ...r,
        correct: log.filter((x) => x.ok).length,
        total: log.length,
        sec: (Date.now() - startedAt.current) / 1000,
        par: log.reduce((a, b) => a + b.par, 0),
        cov: [...new Set([...cov, ...now])],
        covTotal: variantCount(skill.id),
      };
      setResult(res);
      setPhase("done");
      /* вердикт сдан — единственный момент, когда звук уместно торжественный */
      if (r.urteil === "verstanden") sparkle();
      setMvSnap(onRound(skill.id, res));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Auswertung fehlgeschlagen");
      setPhase("drill");
    }
  };

  /* Загрузка следующей задачи в слот. Отдельная функция, потому что её
     вызывают двое: «Weiter» и кнопка «erneut» в баннере ошибки. Раньше
     «erneut» только пополняла пул и ничего не показывала — человек упирался
     в красный баннер и не мог продолжить раунд.

     Плюс автоповтор: генерация иногда срывается (модель не отдала JSON),
     и из-за одной неудачи раунд не должен умирать. Две попытки молча,
     и только потом баннер. */
  const loadNext = useCallback(
    (tries = 0) => {
      setLoading(true);
      setTask(null);
      take()
        .then((t) => {
          /* par калибруется: у модели он «на глаз» и иногда врёт втрое.
             Для формы, по которой уже есть замеры, par не уезжает дальше
             1.6× от реального времени — иначе «в темпе» ничего не значит. */
          const o = t.variante ? calibRef.current[ckey(skill.id, t.variante)] : undefined;
          setTask({ ...t, par: parFor(t.par, o) });
          setLoading(false);
          taskStart.current = Date.now();
          if (pool.current.length < 2) fill(2);
          inputRef.current?.focus();
        })
        .catch((e) => {
          if (tries < 2) {
            window.setTimeout(() => loadNext(tries + 1), 700);
            return;
          }
          setLoading(false);
          setTask(null);
          setErr(e instanceof Error ? e.message : "Aufgabe konnte nicht erzeugt werden");
        });
    },
    [take, fill],
  );

  const advance = () => {
    if (log.length >= ROUND) {
      void finish();
      return;
    }
    setVerdict(null);
    setExplanation("");
    setChat([]);
    setInput("");
    asked.current = false;
    loadNext();
  };

  const sendChat = async () => {
    const q = chatInput.trim();
    if (!q || streaming || !task) return;
    asked.current = true;
    const msgs: Msg[] = [...chat, { role: "user", content: q }];
    setChat([...msgs, { role: "assistant", content: "" }]);
    setChatInput("");
    setStreaming(true);
    abort.current = new AbortController();
    try {
      await ask(
        [{ role: "user", content: `Aufgabe: ${task.prompt}\nLösung: ${task.solution}\n\n${q}` }],
        (t) =>
          setChat((c) => {
            const copy = [...c];
            copy[copy.length - 1] = {
              role: "assistant",
              content: copy[copy.length - 1].content + t,
            };
            return copy;
          }),
        abort.current.signal,
      );
    } catch {
      /* прервали — оставляем как есть */
    } finally {
      setStreaming(false);
    }
  };

  // в dev-сборке отдаём задачу наружу: так тест может ввести верный ответ
  useEffect(() => {
    if (import.meta.env.DEV && task) (window as unknown as { __task?: GenTask }).__task = task;
  }, [task]);

  /* условие: инструкция — мелким текстом, терм — отдельной строкой и крупно.
     Терм рисуется парсером (MathTerm), поэтому дробь выглядит дробью. */
  const { head: body, term } = splitPrompt(task?.prompt ?? "");

  /* ------------------------------------------------------------ правило --- */
  /* Пока человек читает правило, задачи уже генерируются в фоне (эффект
     стартует на монтировании). Поэтому переход «Jetzt üben» обычно не ждёт
     сеть вообще — 15 секунд ожидания съедены чтением. */
  if (phase === "lehr") {
    return (
      <Lehr
        skill={skill}
        p={p0}
        onStart={() => {
          taskStart.current = Date.now();
          startedAt.current = Date.now();
          setPhase("drill");
        }}
        onSkip={onExit}
      />
    );
  }

  /* ------------------------------------------------------------- итог ----- */
  if (phase === "done" && result) {
    return <Summary skill={skill} p={p0} r={result} log={log} mv={mvSnap} onExit={onExit} />;
  }

  /* ------------------------------------------------------------- раунд ---- */
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-10 border-b-2 border-line bg-white">
        <div className="mx-auto flex max-w-[560px] items-center gap-3 px-4 pt-3 pb-2">
          <button
            type="button"
            onClick={onExit}
            className="rounded-lg px-2 py-1 text-[12px] font-bold text-muted transition-colors hover:bg-black/[0.04] hover:text-ink"
          >
            ← Weg
          </button>
          <span className="min-w-0 truncate text-[13px] font-extrabold">{skill.de}</span>
          <Mascot char={mascot} mood={mascotMood} className="ml-auto h-[44px] w-auto shrink-0" />
          <span className="tnum shrink-0 text-[13px] font-extrabold">{mmss(elapsed)}</span>
        </div>

        <div className="mx-auto flex max-w-[560px] items-center gap-3 px-4 pb-2">
          <div className="flex flex-1 gap-1">
            {Array.from({ length: ROUND }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < log.length ? "bg-green" : i === log.length ? "bg-green/30" : "bg-line",
                )}
              />
            ))}
          </div>
          <span className="tnum shrink-0 text-[10px] font-extrabold text-muted">
            {Math.min(log.length + 1, ROUND)}/{ROUND}
          </span>
        </div>

        {/* полоса par убрана по решению хозяина: гонка с таймером давит и
           сбивает с мысли. par по-прежнему меряется фоном и попадает в
           калибровку сложности — просто больше не показывается. */}
      </header>

      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 pt-7 pb-5 lg:justify-center">
        {err && (
          <div className="mb-4 rounded-card border-2 border-red bg-redl px-4 py-3 text-[12px] font-semibold text-ink">
            {err}
            <button
              type="button"
              onClick={() => {
                setErr(null);
                loadNext();
              }}
              className="ml-2 font-extrabold text-red underline underline-offset-2"
            >
              erneut
            </button>
          </div>
        )}

        {!task && !err && (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="h-2 w-40 overflow-hidden rounded-full bg-line">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-green" />
            </div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">
              Aufgabe wird erzeugt
            </p>
          </div>
        )}

        {task && (
          <>
            <div className="card3d rounded-card border-2 border-line bg-white p-5">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
                <span
                  className={cn("h-2 w-2 rounded-full", task.verified ? "bg-green" : "bg-gold")}
                />
                {task.verified ? "geprüft" : "ungeprüft"}
                <span className="text-line">·</span>
                <span className="tnum">Par {task.par} s</span>
              </div>

              {/* Задача с графиком: вместо терма — картинка. Вопрос обычным
                  размером, потому что это фраза, а не формула. Уравнение
                  функции НЕ показываем: иначе читать с графика нечего. */}
              {task.plot ? (
                <>
                  <p
                    id="q-text"
                    className="mt-3 text-[17px] leading-[1.45] font-extrabold tracking-[-0.01em]"
                  >
                    <MathText>{task.prompt}</MathText>
                  </p>
                  <div className="mt-3">
                    <Graph plot={task.plot} />
                  </div>
                </>
              ) : (
                <p
                  id="q-text"
                  className="mt-3 text-[clamp(22px,2.6vw,28px)] leading-[1.4] font-extrabold tracking-[-0.01em]"
                >
                  {body.map((l, i) => (
                    <span key={i} className="mb-1 block text-[0.7em] font-bold text-muted">
                      {l}
                    </span>
                  ))}
                  <span className="block text-[1.15em]">
                    <MathTerm>{term}</MathTerm>
                  </span>
                </p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                ref={inputRef}
                id="answer"
                value={input}
                disabled={verdict !== null}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  if (verdict === null) void submit();
                  else advance();
                }}
                placeholder="Antwort"
                autoComplete="off"
                spellCheck={false}
                className="tnum min-w-0 flex-1 rounded-xl border-2 border-line bg-white px-4 py-3.5 text-[21px] font-extrabold outline-none placeholder:text-[11px] placeholder:font-extrabold placeholder:uppercase placeholder:tracking-[0.12em] placeholder:text-muted focus:border-blue disabled:bg-[#fafafa]"
              />
              <button
                type="button"
                id="check"
                onClick={() => (verdict === null ? void submit() : advance())}
                disabled={streaming && verdict === null}
                className="btn3d btn3d-green shrink-0 rounded-xl px-5 text-[11px] font-extrabold uppercase tracking-[0.1em]"
              >
                {verdict === null ? "Prüfen" : log.length >= ROUND ? "Auswerten" : "Weiter"}
              </button>
            </div>

            {/* хардкор-ввод: километровые ответы (интервалы, корни, степени)
                собираются одной клавишей — на телефоне их иначе не набрать.
                Вставка в позицию курсора, минус — ASCII (check его нормализует). */}
            {verdict === null && (
              <div className="mt-2 flex flex-wrap gap-1">
                <input
                  ref={fotoRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onFoto(f);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  disabled={ocrBusy}
                  onClick={() => fotoRef.current?.click()}
                  className="btn3d btn3d-white rounded-lg px-2.5 py-1 text-[12px] font-extrabold"
                >
                  {ocrBusy ? "…" : "📷 Foto"}
                </button>
                {["-", "/", "√", "²", "³", "π", ";", "(", ")", "[", "]", "≥", "≤", "∈"].map(
                  (sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => {
                        const el = inputRef.current;
                        if (!el) {
                          setInput((x) => x + sym);
                          return;
                        }
                        const s = el.selectionStart ?? input.length;
                        const e = el.selectionEnd ?? s;
                        setInput(input.slice(0, s) + sym + input.slice(e));
                        requestAnimationFrame(() => {
                          el.focus();
                          el.setSelectionRange(s + sym.length, s + sym.length);
                        });
                      }}
                      className="btn3d btn3d-white rounded-lg px-2.5 py-1 text-[14px] font-extrabold"
                    >
                      {sym}
                    </button>
                  ),
                )}
              </div>
            )}

            {ocrErr && (
              <p className="mt-1.5 text-[11px] font-bold text-red" role="alert">
                📷 {ocrErr}
              </p>
            )}

            {/* вердикт — высота фиксирована: при появлении панели карточка
                с задачей не сдвигается ни на пиксель */}
            <div className="mt-4 h-[300px] overflow-y-auto" aria-live="polite">
              {verdict === null && (
                <p className="pt-1 text-[11px] font-bold text-[#c2c2c2]">
                  Enter prüft die Antwort. Zahl oder Bruch, z. B. −5/12.
                </p>
              )}
              {verdict !== null && (
                <div
                  className={cn(
                    "rounded-card border-2 p-3.5",
                    verdict ? "border-green bg-greenl" : "border-red bg-redl",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[11px] font-extrabold uppercase tracking-[0.12em]",
                        verdict ? "text-greend" : "text-red",
                      )}
                    >
                      {verdict ? "Richtig" : "Falsch"}
                    </span>
                    <span className="tnum ml-auto text-[10.5px] font-bold text-muted">
                      {lastSec.toFixed(1)} s · Par {task.par} s
                    </span>
                  </div>

                  {!verdict && (
                    <div className="tnum mt-2 text-[18px] font-extrabold">
                      {task.answer.join(" ; ").replace(/-/g, "\u2212")}
                    </div>
                  )}

                  <div className="mt-2 text-[13px] leading-[1.65] font-semibold whitespace-pre-wrap text-ink/80">
                    {verdict ? (
                      <MathText>{task.solution}</MathText>
                    ) : explanation ? (
                      <MathText>{explanation}</MathText>
                    ) : streaming ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
                        erklärt…
                      </span>
                    ) : (
                      <MathText>{task.solution}</MathText>
                    )}
                    {streaming && (
                      <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-red align-middle" />
                    )}
                  </div>
                </div>
              )}

              {verdict === false && (
                <div className="mt-3 border-t-2 border-line pt-3">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
                  <span className="h-2 w-2 rounded-full bg-blue" />
                  Rückfrage
                </div>

                {chat.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {chat.map((m, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-xl px-3 py-2 text-[13px] leading-[1.6] font-semibold whitespace-pre-wrap",
                          m.role === "user" ? "bg-black/[0.04] text-muted" : "bg-white text-ink",
                        )}
                      >
                        {m.role === "user" ? `› ${m.content}` : <MathText>{m.content}</MathText>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2 flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      void sendChat();
                    }}
                    placeholder="Warum dieser Schritt?"
                    className="min-w-0 flex-1 rounded-xl border-2 border-line bg-white px-3 py-2 text-[13px] font-semibold outline-none placeholder:text-muted focus:border-blue"
                  />
                  <button
                    type="button"
                    onClick={() => void sendChat()}
                    disabled={streaming || !chatInput.trim()}
                    className="btn3d btn3d-white shrink-0 rounded-xl px-4 text-[10px] font-extrabold uppercase tracking-[0.1em]"
                  >
                    Fragen
                  </button>
                </div>
              </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="flex items-center gap-2 border-t-2 border-line px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
        <span
          className={cn("h-1.5 w-1.5 rounded-full", loading || buffered === 0 ? "bg-gold" : "bg-green")}
        />
        {loading
          ? "Aufgabe wird erzeugt"
          : buffered === 0
            ? "nächste Aufgabe wird erzeugt"
            : `bereit · ${buffered} im Puffer`}
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ итог -- */

const URTEIL: Record<RoundResult["urteil"], { de: string; cls: string }> = {
  verstanden: { de: "verstanden", cls: "bg-greenl text-greend border-green" },
  wackelt: { de: "wackelt", cls: "bg-[#fff8e1] text-[#8a6a00] border-gold" },
  nicht: { de: "nicht verstanden", cls: "bg-redl text-red border-red" },
  unbekannt: { de: "ohne Urteil", cls: "bg-black/[0.03] text-muted border-line" },
};

function Summary({
  skill,
  p,
  r,
  log,
  mv,
  onExit,
}: {
  skill: Skill;
  p: number;
  r: RoundResult;
  /** шесть задач раунда — чтобы итог показывал, ЧТО не сошлось */
  log: RoundLog[];
  /** опыт и серия за эту сессию */
  mv: Snap | null;
  onExit: () => void;
}) {
  const covDone = r.covTotal ? r.cov.length >= r.covTotal : true;
  const mascot = useMascot();
  const closed = r.p >= 0.95 && covDone;
  const faster = r.par - r.sec;
  const u = URTEIL[r.urteil];

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b-2 border-line bg-white px-4 py-3">
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <span className="text-[13px] font-extrabold">{skill.de}</span>
          <span className="ml-auto text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Runde beendet
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 py-6 lg:justify-center">
        <div className="flex items-end gap-3">
          <span className="tnum text-[46px] leading-none font-extrabold">
            {r.correct}
            <span className="text-[26px] text-muted">/{r.total}</span>
          </span>
          <span className="tnum mb-1 text-[12px] font-bold text-muted">
            {mmss(r.sec)} · Par {mmss(r.par)}
          </span>
        </div>

        <p className="mt-1 text-[12px] font-bold text-muted">
          {faster >= 0 ? `${Math.round(faster)} s unter Par` : `${Math.round(-faster)} s über Par`}
        </p>

        <div className={cn("mt-5 rounded-card border-2 p-4", u.cls)}>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em]">{u.de}</p>
          {r.grund && (
            <p className="mt-1.5 text-[13px] leading-[1.6] font-semibold text-ink/85">{r.grund}</p>
          )}
        </div>

        {mv && (
          <div className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
            <div className="flex items-end gap-3">
              <Mascot char={mascot} mood={moodOfSnap(mv)} celebrate className="h-[58px] w-auto shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="tnum text-[28px] leading-none font-extrabold">+{mv.xp}</span>
                  <span className="text-[10px] font-extrabold tracking-[0.1em] text-muted uppercase">
                    XP
                  </span>
                  <span className="tnum ml-auto text-[11px] font-bold text-muted">
                    {mv.todayXp} / {mv.goal} heute
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-500",
                      mv.goalHit ? "bg-green" : "bg-gold",
                    )}
                    style={{ width: Math.min(100, Math.round((mv.todayXp / mv.goal) * 100)) + "%" }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 text-[11px] font-bold">
              <span className={cn("h-2 w-2 rounded-full", mv.streak > 0 ? "bg-gold" : "bg-line")} />
              <span className="text-muted">
                {mv.streak > 1
                  ? "Serie: " + mv.streak + " Tage in Folge"
                  : mv.streak === 1
                    ? "Serie: 1 Tag — morgen zählt"
                    : "Serie startet heute"}
              </span>
              <span className="tnum ml-auto text-muted">
                {mv.goalHit ? "Tagesziel erreicht" : "Noch " + (mv.goal - mv.todayXp) + " XP"}
              </span>
            </div>
          </div>
        )}

        <div className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
          <div className="flex items-baseline justify-between text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
            <span>Knoten</span>
            <span className="tnum text-[13px] text-ink">
              {p.toFixed(2)} <span className="text-muted">→</span>{" "}
              <span className={closed ? "text-greend" : "text-ink"}>{r.p.toFixed(2)}</span>
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line">
            <div
              className={cn("h-full rounded-full", closed ? "bg-green" : "bg-gold")}
              style={{ width: `${Math.round(r.p * 100)}%` }}
            />
          </div>

          {r.covTotal > 0 && (
            <>
              <div className="mt-3 flex items-baseline justify-between text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
                <span>Proben</span>
                <span className={cn("tnum text-[13px]", covDone ? "text-greend" : "text-ink")}>
                  {r.cov.length}/{r.covTotal}
                </span>
              </div>
              <div className="mt-1.5 flex gap-1">
                {Array.from({ length: r.covTotal }).map((_, i) => (
                  <span
                    key={i}
                    className={cn("h-1.5 flex-1 rounded-full", i < r.cov.length ? "bg-green" : "bg-line")}
                  />
                ))}
              </div>
            </>
          )}

          <p className="mt-2 text-[11.5px] leading-snug font-bold text-muted">
            {closed
              ? "Geschlossen. Wiederholung in ein paar Tagen — sonst ist es im Januar weg."
              : !covDone
                ? `Noch ${r.covTotal - r.cov.length} Form${r.covTotal - r.cov.length === 1 ? "" : "en"} nicht bestanden. Erst wenn alle sitzen, ist der Knoten zu — sonst wäre „grün“ eine Lüge über „jede Aufgabe“.`
                : r.urteil === "unbekannt"
                  ? "Das Urteil ist nicht angekommen, deshalb zählt die Runde nicht als bestanden. Nochmal."
                  : `Noch nicht bei 0.95.${r.urteil === "wackelt" ? " Es fehlt Sicherheit, nicht Wissen." : ""} Nächster Versuch bringt dich näher.`}
          </p>
        </div>

        {log.length > 0 && (
          <div className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
            <div className="flex items-baseline justify-between text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
              <span>Aufgaben</span>
              <span className="tnum">
                {log.filter((x) => x.ok).length} / {log.length}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              {log.map((x, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    aria-label={x.ok ? "richtig" : "falsch"}
                    className={cn(
                      "w-3 shrink-0 text-center text-[11px] font-extrabold",
                      x.ok ? "text-greend" : "text-red",
                    )}
                  >
                    {x.ok ? "\u2713" : "\u2717"}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-ink/75">
                    <MathText>{lastLine(x.prompt)}</MathText>
                  </span>
                  <span className="tnum shrink-0 text-[10.5px] font-bold text-muted">
                    {x.sec.toFixed(0)} s
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onExit}
          className="btn3d btn3d-green mt-5 w-full rounded-card py-3.5 text-[13px] font-extrabold uppercase tracking-[0.04em]"
        >
          Zum Weg
        </button>
      </main>
    </div>
  );
}

/** В итоге показываем сам объект задачи, а не инструкцию «Berechne:». */
function lastLine(prompt: string): string {
  const lines = prompt.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length > 1 ? lines[lines.length - 1] : lines[0] ?? prompt;
}
