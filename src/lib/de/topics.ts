/* ============================================================================
   ГРАММАТИКА НЕМЕЦКОГО — ДЕРЕВО A1…C1
   ----------------------------------------------------------------------------
   Источник структуры: официальный образец Aufnahmetest Deutsch (Studienkolleg
   Kiel) + Übungsgrammatik für die Grundstufe (A1–B1) и Mittelstufe (C1),
   которые лежат у тебя в `Desktop/Aufnahme`.

   Что важно понимать про этот экзамен. Раздел «Grammatik» — это 30 из 100
   баллов, и он весь укладывается в B1:
     3.1 Perfekt (10 P) · 3.2 Präsens, trennbar/untrennbar (5 P)
     3.3 Relativpronomen (5 P) · 3.4 Nebensätze mit Konjunktion (10 P)
   Ничего выше B1 там нет. Поэтому B1 — не «тоже полезно», а единственное,
   что реально приносит баллы.

   Зачем тогда A1–C1? Затем, что 3.3 и 3.4 невозможно делать, если не
   держится A1: род, падеж, порядок слов. Провал на «Relativpronomen» — это
   почти всегда не про относительные местоимения, а про то, что человек не
   чувствует, какой падеж нужен. Поэтому дерево идёт снизу вверх и снизу же
   разблокируется.

   C1 в экзамене не встречается. Он здесь для другого: чтобы можно было
   вернуться и добить то, что «вроде знаю, но не уверен», и чтобы приложение
   не закончилось через месяц.

   `gen` — имя генератора в `gen.ts`. Пустой список = теории ещё нет,
   узел честно показывает «в работе», а не кнопку, которая ничего не делает.
   ========================================================================== */

export type Level = "A1" | "A2" | "B1" | "B2" | "C1";

export type DeGroup = "verb" | "kasus" | "satz" | "wort" | "stil";

export type DeTopic = {
  id: string;
  /** немецкое название темы — так, как она называется в учебнике */
  de: string;
  /** русская подпись: по ней ищут, когда не помнят термин */
  ru: string;
  level: Level;
  group: DeGroup;
  /** что должно держаться до этого */
  deps: string[];
  /** генераторы задач; пусто = заданий ещё нет */
  gen: string[];
  /** место в образце экзамена, если оно есть */
  exam?: string;
};

export const GROUPS: { id: DeGroup; de: string; ru: string }[] = [
  { id: "verb", de: "Verb", ru: "Глагол" },
  { id: "kasus", de: "Kasus & Artikel", ru: "Падежи" },
  { id: "satz", de: "Satzbau", ru: "Структура" },
  { id: "wort", de: "Wortschatz & Wortbildung", ru: "Слова" },
  { id: "stil", de: "Stil", ru: "Стиль" },
];

export const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

const t = (
  id: string,
  de: string,
  ru: string,
  level: Level,
  group: DeGroup,
  deps: string[],
  gen: string[] = [],
  exam?: string,
): DeTopic => ({ id, de, ru, level, group, deps, gen, exam });

export const TOPICS: DeTopic[] = [
  /* ============================================================== A1 ===== */
  t("a1-personalpronomen", "Personalpronomen", "Личные местоимения", "A1", "kasus", [], ["pron"]),
  t("a1-sein-haben", "sein und haben", "sein и haben", "A1", "verb", [], ["seinhaben"]),
  t("a1-praesens", "Präsens: regelmäßige Verben", "Настоящее время", "A1", "verb", ["a1-personalpronomen"], ["praesens"]),
  t("a1-wortstellung", "Satzstellung: Verb auf Position 2", "Порядок слов, глагол вторым", "A1", "satz", ["a1-praesens"], ["wortstellung"]),
  t("a1-artikel-best", "Bestimmter Artikel", "Определённый артикль", "A1", "kasus", ["a1-personalpronomen"], ["artikelNom"]),
  t("a1-artikel-unbest", "Unbestimmter Artikel, kein/keine", "Неопределённый артикль", "A1", "kasus", ["a1-artikel-best"], ["artikelUnbest"]),
  t("a1-akkusativ", "Akkusativ", "Аккузатив (кого? что?)", "A1", "kasus", ["a1-artikel-best"], ["artikelAkk"]),
  t("a1-dativ", "Dativ", "Датив (кому?)", "A1", "kasus", ["a1-akkusativ"], ["artikelDat"]),
  t("a1-negation", "nicht oder kein", "Отрицание", "A1", "satz", ["a1-artikel-unbest"], ["negation"]),
  t("a1-fragen", "W-Fragen und Ja/Nein-Fragen", "Вопросы", "A1", "satz", ["a1-wortstellung"], ["fragen"]),
  t("a1-modalverben", "Modalverben", "Модальные глаголы", "A1", "verb", ["a1-praesens"], ["modal"]),
  t("a1-trennbare", "Trennbare Verben", "Отделяемые приставки", "A1", "verb", ["a1-wortstellung"], ["trennbar"], "3.2"),
  t("a1-imperativ", "Imperativ", "Повелительное наклонение", "A1", "verb", ["a1-praesens"], ["imperativ"]),
  t("a1-possessiv", "Possessivartikel", "Притяжательные (mein, dein…)", "A1", "kasus", ["a1-artikel-unbest"], ["possessiv"]),

  /* ============================================================== A2 ===== */
  t("a2-partizip", "Partizip II", "Причастие прошедшего времени", "A2", "verb", ["a1-praesens"], ["partizip"]),
  t("a2-perfekt", "Perfekt", "Перфект (прошедшее в речи)", "A2", "verb", ["a2-partizip", "a1-sein-haben"], ["perfekt"], "3.1"),
  t("a2-praeteritum", "Präteritum", "Претерит (прошедшее в тексте)", "A2", "verb", ["a2-perfekt"], ["praeteritumA2"]),
  t("a2-konnektoren", "und, aber, oder, denn, deshalb", "Союзы A2", "A2", "satz", ["a1-wortstellung"], ["konnektorenA2"]),
  t("a2-nebensatz", "Nebensatz mit weil, dass, wenn", "Придаточное: weil/dass/wenn", "A2", "satz", ["a2-konnektoren"], ["nebensatz"]),
  t("a2-nebensatz-ob", "Nebensatz mit ob", "Косвенный вопрос с ob", "A2", "satz", ["a2-nebensatz"], ["nebensatzOb"]),
  t("a2-reflexiv", "Reflexive Verben", "Возвратные глаголы", "A2", "verb", ["a1-akkusativ", "a1-dativ"], ["reflexiv"]),
  t("a2-praepositionen", "Präpositionen mit Akkusativ/Dativ", "Предлоги с падежом", "A2", "kasus", ["a1-dativ"], ["praepositionenA2"]),
  t("a2-wechselpraep", "Wechselpräpositionen", "Предлоги места (в/на)", "A2", "kasus", ["a2-praepositionen"], ["wechselpraep"]),
  t("a2-komparativ", "Komparativ und Superlativ", "Степени сравнения", "A2", "wort", [], ["komparativ"]),
  t("a2-adjektiv-best", "Adjektivdeklination nach Artikel", "Склонение прилагательных", "A2", "kasus", ["a1-artikel-best"], ["adjektiv"]),
  t("a2-adjektiv-null", "Adjektivdeklination ohne Artikel", "Прилагательное без артикля", "A2", "kasus", ["a2-adjektiv-best"], ["adjektiv"]),
  t("a2-genitiv", "Genitiv", "Генитив (чей?)", "A2", "kasus", ["a1-dativ"], ["genitiv"]),
  t("a2-gegenteil", "Gegenteile (Wortschatz)", "Антонимы прилагательных", "A2", "wort", [], ["gegenteil"], "4.2"),
  t("a2-futur", "Futur I", "Будущее время", "A2", "verb", ["a1-modalverben"], ["futur"]),

  /* ============================================================== B1 ===== */
  t("b1-relativsatz", "Relativsätze", "Относительные придаточные", "B1", "satz", ["a2-nebensatz", "a1-akkusativ"], ["relativ"], "3.3"),
  t("b1-relativ-wo-was", "Relativpronomen wo, was, deren", "wo / was / deren", "B1", "satz", ["b1-relativsatz"], ["relativ"]),
  t("b1-konj-wenn-bevor", "wenn, bevor, seitdem, während", "Союзы времени", "B1", "satz", ["a2-nebensatz"], ["nebensatz"], "3.4"),
  t("b1-obwohl-trotzdem", "obwohl, trotzdem, dennoch", "Уступка", "B1", "satz", ["a2-nebensatz"], ["obwohl"]),
  t("b1-damit-umzu", "damit und um … zu", "Цель", "B1", "satz", ["a2-nebensatz"], ["umzu"]),
  t("b1-infinitiv-zu", "Infinitiv mit zu", "Инфинитив с zu", "B1", "verb", ["a2-nebensatz"], ["infinitivzu"]),
  t("b1-plusquamperfekt", "Plusquamperfekt und nachdem", "Предпрошедшее", "B1", "verb", ["a2-praeteritum"], ["plusquamperfekt"]),
  t("b1-passiv", "Passiv", "Пассив", "B1", "verb", ["a2-perfekt"], ["passiv"]),
  t("b1-konjunktiv2", "Konjunktiv II", "Сослагательное (бы)", "B1", "verb", ["a2-praeteritum"], ["konjunktiv2"]),
  t("b1-verben-praep", "Verben mit Präpositionen", "Глаголы с предлогами", "B1", "wort", ["a2-praepositionen"], ["verbenPraep"]),
  t("b1-ndeklination", "n-Deklination", "Слабое склонение", "B1", "kasus", ["a1-akkusativ"], ["ndeklination"]),
  t("b1-konnektoren-doppel", "entweder … oder, je … desto", "Двойные союзы", "B1", "satz", ["a2-konnektoren"], ["doppelkonnektor"]),
  t("b1-praeteritum-erzaehlen", "Präteritum im Erzählen", "Претерит в рассказе", "B1", "verb", ["a2-praeteritum"], ["praeteritum"]),
  t("b1-wortbildung", "Wortbildung: Nomen aus Verben", "Словообразование", "B1", "wort", [], ["wortbildung"]),

  /* ============================================================== B2 ===== */
  t("b2-passiv-modal", "Passiv mit Modalverben", "Пассив с модальными", "B2", "verb", ["b1-passiv", "a1-modalverben"], ["passivModal"]),
  t("b2-konjunktiv2-vergangenheit", "Konjunktiv II der Vergangenheit", "«сделал бы» в прошлом", "B2", "verb", ["b1-konjunktiv2"], ["konjunktiv2Vergangenheit"]),
  t("b2-konjunktiv1", "Konjunktiv I: indirekte Rede", "Косвенная речь", "B2", "verb", ["b1-konjunktiv2"], ["konjunktiv1"]),
  t("b2-partizipial", "Partizipialkonstruktionen", "Причастные обороты", "B2", "satz", ["b1-passiv"], ["partizipial"]),
  t("b2-nominalisierung", "Nominalisierung", "Номинализация", "B2", "wort", ["b1-wortbildung"], ["nominalisierung"]),
  t("b2-konnektoren-gehoben", "sofern, falls, indem, sodass", "Союзы B2", "B2", "satz", ["b1-konnektoren-doppel"], ["konnektorenGehoben"]),
  t("b2-praepositionaladverbien", "darauf, womit, worüber", "Местоимённые наречия", "B2", "wort", ["b1-verben-praep"], ["pronominaladverbien"]),
  t("b2-modalpartikeln", "Modalpartikeln: doch, ja, halt", "Частицы", "B2", "wort", [], ["modalpartikeln"]),
  t("b2-funktionsverb", "Funktionsverbgefüge", "Устойчивые глагольные конструкции", "B2", "wort", ["b2-nominalisierung"], ["funktionsverb"]),
  t("b2-relativsatz-komplex", "Verschachtelte Relativsätze", "Вложенные относительные", "B2", "satz", ["b1-relativsatz"], ["relativ"]),

  /* ============================================================== C1 ===== */
  t("c1-konjunktiv1-formen", "Konjunktiv I: alle Formen", "Konjunktiv I полностью", "C1", "verb", ["b2-konjunktiv1"], ["konjunktiv1Formen"]),
  t("c1-nominalstil", "Nominalstil und Verbalstil", "Именной ↔ глагольный стиль", "C1", "stil", ["b2-nominalisierung"], ["nominalstil"]),
  t("c1-partizip-attribut", "Erweiterte Partizipialattribute", "Распространённые определения", "C1", "satz", ["b2-partizipial"], ["partizipAttribut"]),
  t("c1-es-konstruktionen", "es-Konstruktionen und Korrelate", "Конструкции с es", "C1", "satz", ["b2-konnektoren-gehoben"], ["esKonstruktionen"]),
  t("c1-konnektoren", "zumal, wobei, wenngleich", "Союзы C1", "C1", "satz", ["b2-konnektoren-gehoben"], ["konnektorenC1"]),
  t("c1-wortstellung", "Ausklammerung und Nachfeld", "Вынесение в конец", "C1", "satz", ["b2-relativsatz-komplex"], ["wortstellungC1"]),
  t("c1-modalitaet", "Subjektive Modalität", "Модальность предположения", "C1", "stil", ["b2-konjunktiv2-vergangenheit"], ["modalitaet"]),
  t("c1-stil", "Stilistische Variation", "Стилистическая вариация", "C1", "stil", ["c1-nominalstil"]),
];

export const deById = Object.fromEntries(TOPICS.map((x) => [x.id, x]));

export const drillable = (x: DeTopic): boolean => x.gen.length > 0;

/** темы уровня, в порядке дерева */
export const byLevel = (lv: Level): DeTopic[] => TOPICS.filter((x) => x.level === lv);

export const TOPIC_COUNT = TOPICS.length;

/** сколько тем уровня уже с заданиями — для честной подписи «B1: 12 из 14» */
export function readyIn(lv: Level): { ready: number; total: number } {
  const list = byLevel(lv);
  return { ready: list.filter(drillable).length, total: list.length };
}

/**
 * Экзаменационное ядро: ровно то, что спрашивают в разделе 3 (30 баллов).
 * Это не «рекомендация», это четыре пункта официального образца.
 */
export const EXAM_CORE = [
  "a2-perfekt",
  "a1-trennbare",
  "b1-relativsatz",
  "b1-konj-wenn-bevor",
] as const;
