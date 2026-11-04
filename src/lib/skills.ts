/* ============================================================================
   ДЕРЕВО НАВЫКОВ — Mathematik, Aufnahmetest Studienkolleg Kiel
   ----------------------------------------------------------------------------
   Источник: официальный PDF «Informationen zum Aufnahmetest Mathematik»
   (Voraussetzungen + Prüfungsinhalte). В PDF прямо сказано:
   «Die Aufgaben 1) bis 7) stellen nur eine Auswahl möglicher
   Aufgabenstellungen dar!» — то есть образцы НЕ программа.

   Поэтому единица обучения здесь — не «блок экзамена», а АТОМ: один
   конкретный навык, который можно прокачать за 60–90 секунд и у которого
   есть измеримый уровень. Комбинации (combo) — узлы, где два атома
   встречаются; именно там экзамен и убивает людей.

   `gen` — генераторы из проверенного движка (stem-exam/app/engine.js).
   Атом без `gen` честно показывается как «нет тренажёра» — мы не рисуем
   кнопку, которая ничего не делает.
   ========================================================================== */

export type SkillKind = "atom" | "combo";

export type Skill = {
  id: string;
  /** немецкое название — то, что будет на экзамене */
  de: string;
  /** короткая русская подпись для интерфейса */
  ru: string;
  /** что должно быть прокачано раньше */
  deps: string[];
  kind: SkillKind;
  /** генераторы задач в движке; пусто = тренажёра ещё нет */
  gen: string[];
  /** где это в официальном образце */
  exam?: string;
  /** группа для карты */
  branch: Branch;
};

export type Branch = "basis" | "terme" | "gleichungen" | "funktionen" | "sach";

export const BRANCHES: { id: Branch; de: string; ru: string }[] = [
  { id: "basis", de: "Grundrechnen", ru: "База" },
  { id: "terme", de: "Terme", ru: "Термы" },
  { id: "gleichungen", de: "Gleichungen", ru: "Уравнения" },
  { id: "funktionen", de: "Funktionen", ru: "Функции" },
  { id: "sach", de: "Sachaufgaben", ru: "Текстовые" },
];

const a = (
  id: string,
  de: string,
  ru: string,
  deps: string[],
  branch: Branch,
  gen: string[] = [],
  exam?: string,
): Skill => ({ id, de, ru, deps, branch, gen, exam, kind: "atom" });

/* У комбинаций раньше был пустой `gen`, то есть на пути это были золотые
   пунктирные ромбы без тренера. Теперь задачи к ним есть: их описывает не
   движок, а спецификация (`src/lib/specs.ts`) — у комбинации там лежат
   варианты столкновения двух тем. Поэтому `gen` = ["spec"]. */
const c = (
  id: string,
  de: string,
  ru: string,
  deps: string[],
  exam: string,
): Skill => ({
  id,
  de,
  ru,
  deps,
  branch: "terme",
  gen: ["spec"],
  exam,
  kind: "combo",
});

export const SKILLS: Skill[] = [
  /* ---------------------------------------------------------------- база --
     Voraussetzungen из PDF: Klammerrechnung, Binomische Formeln,
     Bruchrechnung, Potenz-/Logarithmengesetze, Quadratzahlen 1–25. */
  a("vorzeichen", "Vorzeichen", "Знаки", [], "basis", ["gSign"]),
  a("quadratzahlen", "Quadratzahlen 1–25", "Квадраты до 25", [], "basis", ["gSquare"]),
  a("klammern", "Klammerrechnung", "Скобки и порядок", ["vorzeichen"], "basis", ["gOrder"]),
  a("bruch-add", "Brüche addieren", "Дроби: + и −", ["vorzeichen"], "basis", ["gFracAdd"], "A1b"),
  a("bruch-mul", "Brüche multiplizieren", "Дроби: · и :", ["bruch-add"], "basis", ["gFracMul"], "A1b"),
  a("binomisch", "Binomische Formeln", "Формулы сокращ. умножения", ["klammern"], "basis", ["gBinom"], "A2c"),

  /* --------------------------------------------------------------- терми -- */
  a("potenzgesetze", "Potenzgesetze", "Степени", ["klammern"], "terme", ["g1d"], "A1d"),
  a("wurzelgesetze", "Wurzelgesetze", "Корни", ["quadratzahlen"], "terme", ["g1c"], "A1c"),
  a("logarithmus", "Logarithmusgesetze", "Логарифмы", ["potenzgesetze"], "terme", ["g1e"], "A1e"),
  a("rechenterm", "Rechenterme gemischt", "Выражения вперемешку", ["bruch-mul", "potenzgesetze"], "terme", ["g1a", "g1b"], "A1a"),
  a("polynomdivision", "Polynomdivision", "Деление многочленов", ["binomisch"], "terme", ["g2a"], "A2a"),
  a("faktorisieren", "Faktorisieren", "Разложение на множители", ["binomisch"], "terme", ["g2c"], "A2c"),
  a("bruchterme", "Bruchterme kürzen", "Сокращение дробей с буквами", ["faktorisieren", "bruch-mul"], "terme", ["g2d"], "A2d"),
  a("parameter-exponent", "Parameter im Exponenten", "Параметр в степени", ["potenzgesetze", "wurzelgesetze"], "terme", ["g2b"], "A2b"),
  /* Aufgabe 7d образца 2025: «Welche der folgenden Zahlen sind kleiner als 1?»
     — отдельный навык, и без калькулятора он решает больше, чем кажется.
     В дереве его не было, хотя это ровно 1 балл на экзамене. */
  a("schaetzen", "Größenvergleich", "Сравнение величин", ["wurzelgesetze", "logarithmus"], "terme", ["spec"], "A7d"),

  /* ---------------------------------------------------------- уравнения -- */
  a("quad-gleichung", "Quadratische Gleichungen", "Квадратные уравнения", ["binomisch", "quadratzahlen"], "gleichungen", ["g4a"], "A4a"),
  a("bruchgleichung", "Bruchgleichungen", "Дробные уравнения", ["bruchterme", "quad-gleichung"], "gleichungen", ["g4e"], "A4b"),
  a("wurzelgleichung", "Wurzelgleichungen", "Уравнения с корнем", ["wurzelgesetze", "quad-gleichung"], "gleichungen", ["g4f"], "A4c"),
  a("betragsgleichung", "Betragsgleichungen", "Уравнения с модулем", ["quad-gleichung"], "gleichungen", ["g4d"], "A4d"),
  a("exponentialgleichung", "Exponentialgleichungen", "Показательные уравнения", ["logarithmus"], "gleichungen", ["g4b", "g4c"], "A4e"),
  a("parameter-gleichung", "Gleichungen mit Parameter", "Уравнения с параметром", ["quad-gleichung"], "gleichungen", ["g4g"], "A4g"),
  a("quad-ungleichung", "Quadratische Ungleichungen", "Квадратные неравенства", ["quad-gleichung"], "gleichungen", ["spec"], "A4"),
  a("log-gleichung", "Logarithmusgleichungen", "Логарифмические уравнения", ["logarithmus", "quad-gleichung"], "gleichungen", ["spec"], "A4"),
  a("lgs3", "Gleichungssystem 3×3", "Система 3×3", ["vorzeichen", "klammern"], "gleichungen", ["g3"], "A3"),

  /* ----------------------------------------------------------- функции -- */
  a("gerade", "Gerade durch zwei Punkte", "Прямая по двум точкам", ["bruch-add"], "funktionen", ["g5a"], "A5"),
  a("lage", "Lage zweier Geraden", "Параллельность, пересечение", ["gerade"], "funktionen", ["g5b", "g5c"], "A5"),
  a("parabel", "Parabeln", "Параболы: вершина, нули", ["quad-gleichung"], "funktionen", ["spec"], "A5"),
  /* Aufgabe 6 — это КАРТИНКА графика. Текстом её не сгенерировать, поэтому
     задача возвращает функцию и окно, клиент рисует (src/Graph.tsx), а сервер
     проверяет ответ подстановкой в эту же функцию. */
  a("graph-lesen", "Graph lesen", "Чтение графика", ["gerade"], "funktionen", ["spec"], "A6"),

  /* --------------------------------------------------------- текстовые -- */
  a("prozent", "Prozentrechnung", "Проценты", ["bruch-mul"], "sach", ["g7a"], "A7"),
  a("proportion", "Proportionen", "Пропорции, тройное правило", ["bruch-mul"], "sach", ["g7b"], "A7"),
  a("zahlenraetsel", "Zahlenrätsel", "Задачи про числа", ["klammern"], "sach", ["g7c", "g7d"], "A7"),
  a("kombinatorik", "Kombinatorik", "Комбинаторика", ["quadratzahlen"], "sach", ["g7e"], "A7"),

  /* ======================================================================
     КОМБИНАЦИИ — то, из-за чего образцы бесполезны.
     Каждая взята из официального PDF, а не придумана.
     ====================================================================== */
  c("k-bruch-wurzel", "Bruch × Wurzel", "Дробь × корень", ["bruch-mul", "wurzelgesetze"], "A1c"),
  c("k-log-potenz", "Logarithmus × Potenz", "Логарифм × степень", ["logarithmus", "potenzgesetze"], "A1e"),
  c("k-binom-bruch", "Binomisch × Bruchterm", "Формулы × дробь", ["binomisch", "bruchterme", "bruch-mul"], "A2d"),
  c("k-potenz-wurzel-param", "Potenz × Wurzel × Parameter", "Степень × корень × параметр", ["potenzgesetze", "wurzelgesetze", "parameter-exponent"], "A2b"),
  c("k-binom-kubisch", "Kubische Binome", "Кубы и разности", ["binomisch", "klammern"], "A2c"),
  c("k-exponential-subst", "Exponential × Quadratisch", "Показательное → квадратное", ["exponentialgleichung", "quad-gleichung"], "A4e"),
  c("k-bruch-quadratisch", "Bruchgleichung → quadratisch", "Дробное → квадратное", ["bruchgleichung", "quad-gleichung"], "A4b"),
];

/* ------------------------------------------------------------- выборки --- */

export const byId = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

export const drillable = (s: Skill) => s.gen.length > 0;

export const ATOM_COUNT = SKILLS.filter((s) => s.kind === "atom").length;
export const COMBO_COUNT = SKILLS.filter((s) => s.kind === "combo").length;
export const DRILLABLE_COUNT = SKILLS.filter(drillable).length;

/** Все предки узла (транзитивно) — для правила разблокировки. */
export function ancestors(id: string): string[] {
  const out = new Set<string>();
  const walk = (x: string) => {
    for (const d of byId[x]?.deps ?? []) {
      if (!out.has(d)) {
        out.add(d);
        walk(d);
      }
    }
  };
  walk(id);
  return [...out];
}

/**
 * Что доступно прямо сейчас.
 * Правило: узел открыт, если все его deps прокачаны до `minLevel`.
 * Комбинация требует более высокого уровня — она и есть экзамен.
 */
export function available(mastery: Record<string, number>, minLevel = 3): Skill[] {
  return SKILLS.filter((s) => {
    if (!drillable(s)) return false;
    const need = s.kind === "combo" ? minLevel + 1 : minLevel;
    return s.deps.every((d) => (mastery[d] ?? 0) >= need);
  });
}

/** Следующий узел: самый дешёвый из доступных, комбинации — в конце. */
export function nextSkill(mastery: Record<string, number>): Skill | null {
  const pool = available(mastery).filter((s) => (mastery[s.id] ?? 0) < 5);
  if (!pool.length) return null;
  return pool.sort((x, y) => {
    if (x.kind !== y.kind) return x.kind === "atom" ? -1 : 1;
    return x.deps.length - y.deps.length;
  })[0];
}
