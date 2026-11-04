/* ============================================================================
   МАСТЕРСТВО
   ----------------------------------------------------------------------------
   У узла не «уровень 1–5», а вероятность знания p ∈ [0,1]. Порог 0.95 —
   стандарт Cognitive Tutor / BKT (Corbett & Anderson, 1995): там мастерство
   операционализируется как P(learned) ≥ 0.95, и 3–4 верных подряд как раз
   доводят оценку до порога.

   Саму вероятность считает сервер (арифметика + вердикт модели, см.
   /api/mastery). Здесь только хранение, забывание и вывод состояния узла.

   Забывание: у закрытого узла есть срок повторения (1 / 3 / 7 / 21 / 45 дней
   — растёт с каждым успешным раундом). Пока срок не вышел, p не меняется.
   После — 7 % в сутки. К январю это единственное, что не даст карте врать:
   зелёное пятно, которого не касались месяц, честно желтеет.

   ВТОРОЕ УСЛОВИЕ ЗАЧЁТА — покрытие форм. `p` отвечает на вопрос «насколько
   вероятно, что навык есть», но ничего не говорит о том, ЧТО именно ты
   решал. Шесть одинаковых примеров на «Vorzeichen» дают 0.9999 и при этом
   ноль умения решать остальные формы, которые будут на экзамене. Поэтому
   узел закрывается только когда сданы все `varianten` из `specs.ts`.
   Вместе это и есть операциональное «решит любую задачу по теме»:
   вероятность высокая И каждая форма встречена и решена.
   ========================================================================== */

import { SKILLS, type Skill } from "@/lib/skills";
import { variantCount, variantIds } from "@/lib/specs";

export type Rec = {
  /** вероятность знания на момент последнего раунда */
  p: number;
  /** когда узел надо повторить (ms) */
  due: number;
  /** когда его последний раз трогали (ms) */
  last: number;
  /** сколько раундов подряд узел закрывался — растягивает срок повторения */
  rounds: number;
  /**
   * какие формы задачи уже решены верно (id из `specs.ts`).
   * Узел не закрывается, пока не покрыты все формы: иначе можно закрыть
   * «Vorzeichen» на шести одинаковых примерах и ни разу не увидеть трудную.
   */
  cov?: string[];
  /** финальная проверка темы сдана (Themen-Prüfung). Только она открывает
      зависимые узлы — гейт хозяина от 04.11 */
  pf?: boolean;
};

export type M = Record<string, Rec>;

const KEY = "tally.mastery.v1";
const DAY = 86_400_000;

/** порог «освоено» — как в Cognitive Tutor */
export const PASS = 0.95;

/** доля, которая остаётся через сутки просрочки */
const DECAY = 0.93;

/** срок повторения после 1-го, 2-го, ... закрытого раунда */
const REVIEW_DAYS = [1, 3, 7, 21, 45];

export const EXAM = new Date("2027-01-09T09:00:00");

/* --------------------------------------------------------------- чтение --- */

export function load(): M {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as M;
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

export function save(m: M): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    /* приватный режим — живём без сохранения */
  }
}

export function reset(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* пусто */
  }
}

/* ------------------------------------------------------------ забывание --- */

/** вероятность знания прямо сейчас, с поправкой на просрочку */
export function pNow(rec?: Rec): number {
  if (!rec) return 0;
  const late = Math.max(0, (Date.now() - rec.due) / DAY);
  return rec.p * Math.pow(DECAY, late);
}

export const isPassed = (rec?: Rec): boolean => pNow(rec) >= PASS;

export const isOverdue = (rec?: Rec): boolean => !!rec && rec.p >= PASS && Date.now() > rec.due;

/* -------------------------------------------------------------- покрытие ---
   Второе условие зачёта, кроме вероятности: все формы задачи решены.
   Одна `p` этого не гарантирует — шесть одинаковых примеров дают 0.9999 и
   ноль умения решать остальные формы. */

export function covered(rec?: Rec): string[] {
  return rec?.cov ?? [];
}

export function isCovered(s: Skill, rec?: Rec): boolean {
  const total = variantCount(s.id);
  if (!total) return true;
  const got = new Set(covered(rec));
  return variantIds(s.id).every((id) => got.has(id));
}

/** «3/5» — сколько форм уже сдано */
export function covText(s: Skill, rec?: Rec): string {
  const total = variantCount(s.id);
  if (!total) return "";
  const got = new Set(covered(rec));
  return `${variantIds(s.id).filter((x) => got.has(x)).length}/${total}`;
}

export function covRatio(s: Skill, rec?: Rec): number {
  const total = variantCount(s.id);
  if (!total) return 1;
  const got = new Set(covered(rec));
  return variantIds(s.id).filter((x) => got.has(x)).length / total;
}

/* ------------------------------------------------------------- запись ----- */

/**
 * Итог раунда. Закрытым узел считается, только если сошлись ОБА условия:
 * `p >= 0.95` и покрыты все формы задачи. Если узел закрыт — срок повторения
 * растягивается. Если нет — возвращаемся завтра и счётчик раундов обнуляется:
 * проваленный повтор не должен удлинять интервал.
 *
 * `cov` копится, а не перезаписывается: сданная форма остаётся сданной,
 * даже если потом просядет `p`. Иначе после каждого забывания пришлось бы
 * заново проходить все формы, и узел никогда бы не закрылся.
 */
export function record(m: M, id: string, p: number, cov: string[] = []): M {
  const prev = m[id];
  const merged = [...new Set([...(prev?.cov ?? []), ...cov])];
  const ids = variantIds(id);
  const full = ids.length === 0 || ids.every((x) => merged.includes(x));
  const closed = p >= PASS && full;
  const rounds = closed ? (prev?.rounds ?? 0) + 1 : 0;
  const days = closed ? REVIEW_DAYS[Math.min(rounds - 1, REVIEW_DAYS.length - 1)] : 1;
  return {
    ...m,
    [id]: { p, due: Date.now() + days * DAY, last: Date.now(), rounds, cov: merged },
  };
}

/** Themen-Prüfung сдана: узел открывает зависимые темы */
export function passPf(m: M, id: string): M {
  const prev = m[id];
  if (!prev) return m;
  return { ...m, [id]: { ...prev, pf: true } };
}

/* -------------------------------------------------------------- статусы --- */

export type Status = "mastered" | "review" | "open" | "locked" | "notrainer";

export function statusOf(s: Skill, m: M): Status {
  if (!s.gen.length) return "notrainer";
  const rec = m[s.id];
  if (rec && rec.p >= PASS) {
    // вероятность высокая, но формы покрыты не все — узел ещё открыт.
    // Это главное отличие от прежней версии: «зелёный» больше не значит
    // «шесть раз повезло на одной и той же форме».
    if (!isCovered(s, rec)) return "open";
    return isPassed(rec) ? "mastered" : "review";
  }
  /* Themen-Prüfung: зависимость открывает узел только после сдачи её
     финальной проверки (pf). «Пройдено по знанию и покрытию» больше не
     открывает следующую тему само по себе. */
  const unlocked = s.deps.every((d) => {
    const r = m[d];
    return !!r && r.p >= PASS && r.pf;
  });
  return unlocked ? "open" : "locked";
}

/** порядок на пути: сначала атомы, потом комбинации («экзамен») */
export const PATH: Skill[] = [
  ...SKILLS.filter((s) => s.kind === "atom"),
  ...SKILLS.filter((s) => s.kind === "combo"),
];

/**
 * Куда идти сейчас. Просроченные повторения важнее нового материала —
 * иначе к январю весь пройденный путь окажется забытым.
 */
export function current(m: M): Skill | null {
  const due = PATH.filter((s) => statusOf(s, m) === "review").sort(
    (a, b) => (m[a.id]?.due ?? 0) - (m[b.id]?.due ?? 0),
  );
  if (due.length) return due[0];
  return PATH.find((s) => statusOf(s, m) === "open") ?? null;
}

export function counts(m: M): { done: number; total: number; open: number } {
  let done = 0;
  let open = 0;
  let total = 0;
  for (const s of PATH) {
    if (!s.gen.length) continue;
    total++;
    const st = statusOf(s, m);
    if (st === "mastered") done++;
    else if (st !== "locked") open++;
  }
  return { done, total, open };
}

/** сколько дней до экзамена */
export function daysLeft(): number {
  return Math.max(0, Math.ceil((EXAM.getTime() - Date.now()) / DAY));
}

/** 0..1 — прогресс пути */
export function progress(m: M): number {
  const { done, total } = counts(m);
  return total ? done / total : 0;
}
