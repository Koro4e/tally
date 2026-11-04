/* ============================================================================
   LEHRGANG — «Regel» перед задачами
   ----------------------------------------------------------------------------
   Раньше раунд начинался сразу с шести задач. Для человека, который помнит
   математику на 20 %, это не тренировка, а угадывание: правило он должен
   вспомнить сам, а если не помнит — первые три задачи уходят на то, чтобы
   вывести его заново, и только четвёртая что-то проверяет.

   Здесь порядок как в нормальном объяснении: сначала правило словами, потом
   формула, потом ПОЧЕМУ оно работает, потом две типичные ошибки (чтобы не
   наступить), и только в конце пример, который открывается по шагам —
   человек сам решает шаг, потом сверяет.

   Карточка генерируется один раз на узел и лежит в localStorage: правило
   логарифмов не меняется от того, что ты открыл его во второй раз. Это и
   экономит токены, и убирает 15 секунд ожидания на каждом входе.

   Пример внутри карточки проверен сервером тем же верификатором, что и
   задачи. Поэтому «ergebnis» в карточке не может быть враньём.
   ========================================================================== */

import { useEffect, useState } from "react";
import MathText from "@/MathText";
import { lehr, type LehrCard } from "@/lib/ai";
import { specOf, variantIds } from "@/lib/specs";
import { levelFor } from "@/lib/calib";
import type { Skill } from "@/lib/skills";
import { cn } from "@/utils/cn";

const KEY = "tally.lehr.v1";

type Cache = Record<string, LehrCard>;

function readCache(): Cache {
  try {
    const raw = localStorage.getItem(KEY);
    const o = raw ? (JSON.parse(raw) as Cache) : {};
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

function writeCache(c: Cache): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* приватный режим — карточка просто не закешируется */
  }
}

export default function Lehr({
  skill,
  p,
  onStart,
  onSkip,
}: {
  skill: Skill;
  /** вероятность знания: от неё зависит, насколько подробно объяснять */
  p: number;
  onStart: () => void;
  onSkip: () => void;
}) {
  const [card, setCard] = useState<LehrCard | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [steps, setSteps] = useState(0);

  const level = levelFor(p, 0.45);

  useEffect(() => {
    let alive = true;
    const cached = readCache()[skill.id];
    if (cached) {
      setCard(cached);
      return;
    }
    const spec = specOf(skill.id);
    lehr({
      label: skill.de,
      was: spec?.was,
      beispiel: spec?.beispiel,
      nicht: spec?.nicht,
      level,
      varianten: spec?.varianten.map((v) => v.de),
    })
      .then((c) => {
        if (!alive) return;
        setCard(c);
        const all = readCache();
        writeCache({ ...all, [skill.id]: c });
      })
      .catch((e) => {
        if (alive) setErr(e instanceof Error ? e.message : "Theorie konnte nicht erzeugt werden");
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill.id]);

  const total = card?.beispiel.schritte.length ?? 0;
  const done = steps >= total;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[680px] flex-col px-4 py-5">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSkip}
          className="rounded-lg px-2 py-1.5 text-[13px] font-bold text-muted transition-colors hover:bg-black/[0.04] hover:text-ink"
        >
          ← Weg
        </button>
        <span className="ml-auto rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
          Stufe {level} / 5
        </span>
      </header>

      {/* кикер отдельной строкой: при items-baseline русская подпись
          выравнивалась по «REGEL», а не по названию, и висела сверху */}
      <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-green">Regel</p>
      <div className="mt-0.5 flex items-baseline justify-between gap-3">
        <h1 className="min-w-0 truncate text-[22px] leading-tight font-extrabold">{skill.de}</h1>
        <span className="shrink-0 text-[11.5px] font-bold text-muted">{skill.ru}</span>
      </div>

      {err && (
        <div className="mt-4 rounded-card border-2 border-red bg-redl p-4">
          <p className="text-[12px] font-bold text-red">{err}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onSkip}
              className="btn3d btn3d-white rounded-xl px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.06em]"
            >
              Trotzdem üben
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn3d btn3d-white rounded-xl px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.06em]"
            >
              Neu laden
            </button>
          </div>
        </div>
      )}

      {!card && !err && <Skeleton />}

      {card && (
        <>
          {/* формула — главное на экране, крупно и по центру */}
          <div className="card3d mt-4 rounded-card border-2 border-green bg-greenl px-4 py-4 text-center">
            <p className="tnum text-[clamp(19px,4.6vw,26px)] leading-[1.35] font-extrabold break-words text-greend">
              <MathText>{card.formel}</MathText>
            </p>
          </div>

          <p className="mt-4 text-[14px] leading-[1.65] font-semibold text-ink">
            <MathText>{card.regel}</MathText>
          </p>

          {card.warum && (
            <div className="mt-3 border-l-[3px] border-blue pl-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue">
                Warum das gilt
              </p>
              <p className="mt-1 text-[13px] leading-[1.6] font-medium text-muted">
                <MathText>{card.warum}</MathText>
              </p>
            </div>
          )}

          {card.fehler.length > 0 && (
            <div className="mt-4 rounded-card border border-line bg-card p-3.5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-red">
                Typische Fehler
              </p>
              <ul className="mt-1.5 space-y-1.5">
                {card.fehler.map((f, i) => (
                  <li key={i} className="flex gap-2 text-[12.5px] leading-[1.5] font-semibold">
                    <span className="mt-[3px] shrink-0 text-red" aria-hidden>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 2.5l7 7m0-7l-7 7"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <MathText>{f}</MathText>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* пример по шагам: шаг открывается кнопкой, а не вываливается сразу */}
          <div className="card3d mt-4 rounded-card border border-line bg-card p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
              Beispiel
            </p>
            <p className="tnum mt-1.5 text-[16px] leading-[1.5] font-extrabold break-words">
              <MathText>{card.beispiel.aufgabe}</MathText>
            </p>

            <ol className="mt-3 space-y-2">
              {card.beispiel.schritte.slice(0, steps).map((s, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 rounded-lg bg-bg px-2.5 py-2 text-[13px] leading-[1.5] font-semibold"
                >
                  <span className="tnum mt-[1px] shrink-0 text-[10px] font-extrabold text-muted">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <MathText>{s}</MathText>
                  </span>
                </li>
              ))}
            </ol>

            {!done && (
              <button
                type="button"
                onClick={() => setSteps((n) => n + 1)}
                className="btn3d btn3d-white mt-3 w-full rounded-xl px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.08em]"
              >
                {steps === 0 ? "Schritt zeigen" : `Schritt ${steps + 1} von ${total}`}
              </button>
            )}

            {done && (
              <div className="mt-3 flex items-center justify-between rounded-lg border-2 border-green bg-greenl px-3 py-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-greend">
                  Ergebnis
                </span>
                <span className="tnum text-[17px] font-extrabold text-greend">
                  <MathText>{card.beispiel.ergebnis}</MathText>
                </span>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-bg via-bg to-transparent pt-3 pb-2">
            <button
              type="button"
              onClick={onStart}
              className="btn3d btn3d-green w-full rounded-xl px-4 py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.08em]"
            >
              Jetzt üben · {variantIds(skill.id).length || 6} Proben
            </button>
            <button
              type="button"
              onClick={onSkip}
              className={cn(
                "mt-2 w-full rounded-xl px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em]",
                "text-muted transition-colors hover:text-ink",
              )}
            >
              Später · zurück zum Weg
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mt-4 animate-pulse space-y-3">
      <div className="h-[74px] rounded-card bg-black/[0.05]" />
      <div className="h-4 w-11/12 rounded bg-black/[0.05]" />
      <div className="h-4 w-9/12 rounded bg-black/[0.05]" />
      <div className="h-4 w-10/12 rounded bg-black/[0.05]" />
      <p className="pt-2 text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
        Regel wird zusammengestellt…
      </p>
    </div>
  );
}
