/* ============================================================================
   ГЕНЕРАТОРЫ УПРАЖНЕНИЙ — без ИИ
   ----------------------------------------------------------------------------
   Каждое упражнение собирается из таблиц выше. Это не компромисс, а выигрыш:

   · проверка точная. «hat abgeholt» либо есть, либо нет. Не нужно спрашивать
     модель «правильно ли», и нельзя получить «в целом верно» на ошибку;
   · ноль токенов и ноль задержки. Упражнение появляется мгновенно, работает
     в метро и не кончается, когда кончается квота;
   · ошибку в содержании можно найти глазами один раз и починить навсегда.
     У сгенерированного текста так не получится — он каждый раз новый.

   Единственное место, где нужна модель, — свободное письмо (Bildergeschichte)
   и объяснение ошибки словами. Это отдельный слой, его пока нет.

   Проверка ответа: `check()` ниже. Для грамматики она сравнивает
   нормализованные строки (регистр, пунктуация, ß/ss, умляуты) и принимает
   список вариантов. Для Nebensätze вариантов два: придаточное впереди
   и позади — оба верны, оба есть в образце.
   ========================================================================== */

import {
  ADJEKTIVE,
  DOPPELKONN,
  GEGENTEIL,
  INFINITIVZU,
  KONJ2,
  NEBENSATZ,
  OBWOHL,
  UMFORM,
  ZEITMIX,
  PASSIV,
  PERFEKT,
  PERFEKT_INV,
  PLUSQUAM,
  PRAETERITUM,
  RELATIV,
  TRENNBAR,
  UMZU,
  VERBEN_PRAEP,
  WORDBILD,
} from "@/lib/de/data";
import { NOUNS, bare, bestimmter, nomenForm, type Kasus, type N } from "@/lib/de/nouns";
import {
  konjunktiv1 as konjunktiv1B2,
  konjunktiv2Vergangenheit,
  passivModal,
} from "@/lib/de/b2verb";
import { konnektorenGehoben, partizipial } from "@/lib/de/b2satz";
import { funktionsverb, modalpartikeln, nominalisierung } from "@/lib/de/b2wort";
import { pronominaladverbien, RELATIV_B2_KOMPLEX } from "@/lib/de/b2praep";
import {
  esKonstruktionen,
  konjunktiv1 as konjunktiv1C1,
  konnektorenC1,
} from "@/lib/de/c1a";
import { modalitaet, nominalstil, partizipAttribut, wortstellung } from "@/lib/de/c1b";
import {
  artikelUnbest,
  fragen,
  imperativ,
  negation,
  possessiv,
  wortstellung as wortstellungA1,
} from "@/lib/de/a1";
import {
  futur,
  genitiv,
  konnektorenA2,
  nebensatzOb,
  praepositionenA2,
  praeteritumA2,
  reflexiv,
  wechselpraep,
} from "@/lib/de/a2";
import { VERBS, hilfsverb, praetAux, prForms, verbByInf, type V } from "@/lib/de/verbs";

export type Item = {
  /** тема, к которой относится упражнение */
  topic: string;
  /** что надо сделать — одна строка над предложением */
  task: string;
  /** предложение с {0}, {1}… */
  text: string;
  /** подсказка справа: (kochen) или «Akkusativ» */
  hint?: string;
  /** допустимые ответы для каждой дырки */
  gaps: string[][];
  /** объяснение после ответа */
  why: string;
  /** разбор ПРЕДСКАЗУЕМОГО неверного ответа: если ученик ввёл wrong,
      показываем note вместо сухого списка правильных форм. Заполняется из
      парадигм (спряжение, падежи) — там, где ошибка известна заранее. */
  traps?: { wrong: string; note: string }[];
  /** упражнение из истории ошибок — при верном ответе вычёркивается */
  retry?: boolean;
};

/* --------------------------------------------------------------- утилиты -- */

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/** первая буква заглавная: «er darf …» в начале предложения выглядит как ошибка */
const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** форма слова для сравнения: ß/ss, умляуты ↔ ae/oe/ue, пунктуация, пробелы.
    Регистр СОХРАНЯЕТСЯ: в немецком он смысловой (sie ≠ Sie, Haus ≠ haus).
    Умляуты толерантны, чтобы печатать без немецкой клавиатуры. */
export function shape(s: string): string {
  return s
    .replace(/ß/g, "ss")
    .replace(/[äöü]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue" })[c] ?? c)
    .replace(/[.,!?;:„“"'’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** прежняя нормализация без регистра — только чтобы отличить
    «ошибся в буквах» от «ошибся только заглавной» */
export function norm(s: string): string {
  return shape(s).toLowerCase();
}

export type Judge = "ok" | "case" | "bad";

/** Итог проверки одного ответа.
    ok   — совпало с учётом регистра;
    case — совпало бы без учёта регистра: не та заглавная буква. Это НЕ зачёт,
           потому что регистр в немецком решает (Nomen, вежливое Sie);
    bad  — не совпало. */
export function judge(given: string, accept: string[]): Judge {
  const g = shape(given);
  if (!g) return "bad";
  if (accept.some((a) => shape(a) === g)) return "ok";
  const gl = g.toLowerCase();
  if (accept.some((a) => shape(a).toLowerCase() === gl)) return "case";
  return "bad";
}

/** верно ли, что ответ ученика совпал хотя бы с одним вариантом (регистр учитывается) */
export function check(given: string, accept: string[]): boolean {
  return judge(given, accept) === "ok";
}

const verb = (inf: string): V => verbByInf[inf] ?? VERBS[0];

/** короткая запись ловушки для Item.traps */
const trap = (wrong: string, note: string): { wrong: string; note: string } => ({ wrong, note });

/** подписи лиц для разборов ошибок */
const PR6 = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];

/* --------------------------------------------------------------- Perfekt -- */

function perfekt(): Item {
  /* Три формата, как на реальном экзамене (со слов хозяина):
     A — короткая фраза, две дырки (база);
     B — длинное предложение с инверсией: придаточное впереди → aux на
         позиции 2, Partizip в конец. Главный «подьёб» экзамена;
     C — лёгкий: aux уже напечатан, одна дырка (только Partizip II).
     Б распределяет ловушки: отделяемые/неотделяемые и sein-глаголы
     стоят среди обычных — угадывать шаблон нельзя. */
  const mode = pick(["A", "A", "B", "B", "C"] as const);
  if (mode === "C") {
    const f = pick(PERFEKT.filter((x) => !verb(x.v).pre));
    const v = verb(f.v);
    const aux = hilfsverb(v, f.p);
    /* aux занимает место {0}, дырка {1} становится единственной — {0} */
    const text = f.text.replace("{0}", aux).replace("{1}", "{0}");
    return {
      topic: "a2-perfekt",
      task: "Ergänze nur das Partizip II — вспомогательный уже стоит.",
      text,
      hint: `(${v.inf})`,
      gaps: [[v.part]],
      why:
        `Вспомогательный уже на месте (${aux}), поэтому проверяется только Partizip II: ${v.inf} → ${v.part}.` +
        (v.pre
          ? ` Приставка «${v.pre}» отделяемая, ge- стоит внутри: ${v.pre}ge….`
          : /^(be|ge|er|ver|zer|ent|emp|miss)/.test(v.inf)
            ? " Неотделяемая приставка — ge- не добавляется."
            : ""),
    };
  }
  const f = mode === "B" ? pick(PERFEKT_INV) : pick(PERFEKT);
  const v = verb(f.v);
  const aux = hilfsverb(v, f.p);
  return {
    topic: "a2-perfekt",
    task:
      mode === "B"
        ? "Ergänze das Perfekt. Внимание: предложение начинается не с подлежащего — глагол должен встать на позицию 2."
        : "Ergänze das Verb im Perfekt.",
    text: f.text,
    hint: `(${v.inf})`,
    gaps: [[aux], [v.part]],
    why:
      (mode === "B"
        ? "Ловушка инверсии: перед главным предложением стоит придаточное/обстоятельство, поэтому спрягаемый глагол — на позиции 2 сразу после него, а Partizip II — в самом конце. " +
          ""
        : `Perfekt = ${v.aux === "s" ? "sein" : "haben"} на втором месте + Partizip II в конце. `) +
      `«${v.inf}» → ${aux} … ${v.part}.` +
      (v.aux === "s"
        ? " Здесь sein, потому что глагол означает движение или смену состояния."
        : "") +
      (v.pre
        ? ` Приставка «${v.pre}» отделяемая: в Partizip II ge- стоит внутри — ${v.pre}ge…`
        : /^(be|ge|er|ver|zer|ent|emp|miss)/.test(v.inf)
          ? " Приставка be-/ver-/er-/ent- не отделяется, поэтому ge- не добавляется — классический подьёб."
          : ""),
  };
}

/* ------------------------------------------------------ trennbar / nicht -- */

function trennbar(): Item {
  const f = pick(TRENNBAR);
  const v = verb(f.v);
  const form = prForms(v)[f.p] ?? prForms(v)[2];
  const sep = !!v.pre;
  return {
    topic: "a1-trennbare",
    task: sep
      ? "Ergänze das Verb im Präsens. Приставка отделяется — она идёт в конец."
      : "Ergänze das Verb im Präsens. Глагол неотделяемый — второе поле оставь пустым.",
    text: f.text,
    hint: `(${v.inf})`,
    gaps: [[form], sep ? [v.pre!] : [""]],
    why: sep
      ? `«${v.inf}» отделяемый: приставка «${v.pre}» уходит в конец предложения → ${form} … ${v.pre}.`
      : `«${v.inf}» неотделяемый: приставка ${v.inf.slice(0, 3)}- срослась с глаголом, в конце ничего не появляется → просто ${form}.`,
  };
}

/* ---------------------------------------------------- Relativpronomen ----- */

function relativ(topicId?: string): Item {
  /* B2-кадры (вложенные, Genitiv) не смешиваются с B1: раунд по
     «Verschachtelte Relativsätze» берёт только их, раунды B1 — только базу.
     Иначе ученик B1 ловил бы конструкции, которых его тема не объясняла. */
  const f = topicId === "b2-relativsatz-komplex" ? pick(RELATIV_B2_KOMPLEX) : pick(RELATIV);
  return {
    topic: topicId ?? "b1-relativsatz",
    task: "Setze das passende Relativpronomen ein.",
    text: f.text,
    gaps: [[f.a]],
    why: f.why,
  };
}

/* ---------------------------------------------------------- Nebensätze ---- */

function nebensatz(): Item {
  const f = pick(NEBENSATZ);
  return {
    topic: "b1-konj-wenn-bevor",
    task: `Verbinde die beiden Sätze mit «${f.konj}». Порядок слов в придаточном: глагол в конце.`,
    /* {0} — отдельной строкой: ответ это целое предложение, а не слово,
       поэтому ему нужна своя широкая строка под заданием. */
    text: `${f.a}  /  ${f.b}\n{0}`,
    hint: `(${f.konj})`,
    gaps: [f.answers],
    why:
      `В придаточном с «${f.konj}» спрягаемый глагол уходит в конец. ` +
      `Придаточное может стоять и перед главным — тогда главное начинается с глагола: ` +
      `«${f.answers[1] ?? f.answers[0]}». Оба варианта верны.`,
  };
}

/* --------------------------------------------------------------- Artikel -- */

const ART: Record<Kasus, [string, string, string, string]> = {
  nom: ["der", "die", "das", "die"],
  akk: ["den", "die", "das", "die"],
  dat: ["dem", "der", "dem", "den"],
  gen: ["des", "der", "des", "der"],
};

const KAS_NAME: Record<"nom" | "akk" | "dat", string> = {
  nom: "Nominativ",
  akk: "Akkusativ",
  dat: "Dativ",
};

const GIDX = { der: 0, die: 1, das: 2 } as const;

/** существительные-лица: только с ними датив звучит по-немецки */
const PERSON = new Set([
  "der Junge", "der Student", "der Mensch", "der Nachbar", "der Kollege",
  "der Kunde", "der Polizist", "der Tourist", "die Frau", "die Mutter",
  "die Schwester", "die Tochter", "die Freundin", "die Lehrerin", "das Kind",
  "das Mädchen", "der Lehrer", "der Freund", "der Vater", "der Bruder",
  "der Sohn",
]);

const ART_FRAME: Record<"nom" | "akk" | "dat", string[]> = {
  nom: [
    "{0} {1} ist heute geschlossen.",
    "{0} {1} steht schon lange hier.",
    "{0} {1} ist neu.",
    "{0} {1} gefällt mir gut.",
    "{0} {1} kostet zu viel.",
  ],
  akk: [
    "Ich suche {0} {1}.",
    "Wir kaufen {0} {1}.",
    "Er braucht {0} {1}.",
    "Ich vergesse {0} {1} nie.",
    "Sie hat {0} {1} gestern gesehen.",
  ],
  dat: [
    "Ich helfe {0} {1}.",
    "Der Lehrer dankt {0} {1}.",
    "Das Buch gehört {0} {1}.",
    "Ich schreibe {0} {1} eine Nachricht.",
    "Er zeigt {0} {1} das Foto.",
  ],
};

function artikelWith(kasus: "nom" | "akk" | "dat"): Item {
  const pool = kasus === "dat" ? NOUNS.filter((x) => PERSON.has(x.nom)) : NOUNS;
  const x = pick(pool);
  const art = ART[kasus][GIDX[x.genus]];
  const frame = pick(ART_FRAME[kasus]);
  return {
    topic: kasus === "akk" ? "a1-akkusativ" : kasus === "dat" ? "a1-dativ" : "a1-artikel-best",
    task: `Setze den bestimmten Artikel im ${kasus === "nom" ? "Nominativ" : kasus === "akk" ? "Akkusativ" : "Dativ"} ein.`,
    // {1} — существительное уже в нужной форме, {0} остаётся дыркой
    text: frame.replace("{1}", nomenForm(x, kasus)),
    /* В Nominativ подсказка «der …» выдала бы ответ: там артикль и есть род.
       В Akkusativ и Dativ подсказываем род — спрашивается другое. */
    hint:
      kasus === "nom"
        ? undefined
        : x.genus === "der"
          ? "maskulin"
          : x.genus === "die"
            ? "feminin"
            : "neutrum",
    gaps: [[art]],
    /* перепутать падеж — главная ошибка на артикле, поэтому каждый неверный
       падеж того же рода разбирается сам */
    traps: (["nom", "akk", "dat"] as const)
      .filter((k) => k !== kasus)
      .map((k) =>
        trap(
          ART[k][GIDX[x.genus]],
          `«${ART[k][GIDX[x.genus]]}» — это ${KAS_NAME[k]}; здесь ${KAS_NAME[kasus]} → ${art}.`,
        ),
      )
      .filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why:
      `«${bare(x)}» — ${x.genus === "der" ? "мужского" : x.genus === "die" ? "женского" : "среднего"} рода. ` +
      `В ${kasus === "nom" ? "Nominativ" : kasus === "akk" ? "Akkusativ" : "Dativ"} артикль → ${art}.`,
  };
}

const artikel = () => artikelWith(pick(["nom", "akk", "dat"] as const));

/* --------------------------------------------------- Adjektivdeklination -- */

type G4 = 0 | 1 | 2 | 3;

const WEAK: Record<Kasus, string[]> = {
  nom: ["e", "e", "e", "en"],
  akk: ["en", "e", "e", "en"],
  dat: ["en", "en", "en", "en"],
  gen: ["en", "en", "en", "en"],
};

const STRONG: Record<Kasus, string[]> = {
  nom: ["er", "e", "es", "e"],
  akk: ["en", "e", "es", "e"],
  dat: ["em", "er", "em", "en"],
  gen: ["en", "er", "en", "er"],
};

/* Основа прилагательного перед окончанием.
   hoch → hohen (не «hochen»), teuer → teure, dunkel → dunkle.
   И отдельно: прилагательные на -e теряют эту -e перед окончанием —
   leise → leiser, а не «leiseer». Без этой таблицы упражнение учит
   неправильной форме, и ученик запоминает именно её. */
const STEM: Record<string, string> = {
  hoch: "hoh",
  teuer: "teur",
  dunkel: "dunkl",
  sauer: "saur",
};

const stemOf = (b: string): string => {
  if (STEM[b]) return STEM[b];
  if (b.length > 3 && b.endsWith("e")) return b.slice(0, -1);
  return b;
};

function adjektiv(topicId?: string): Item {
  const kasus = pick(["nom", "akk", "dat"] as const);
  /* В Dativ берём только людей: «Ich helfe dem kleinen Preis» грамматически
     верно и бессмысленно. Упражнение не должно учить бессмыслице. */
  const x = kasus === "dat" ? pick(NOUNS.filter((z) => PERSON.has(z.nom))) : pick(NOUNS);
  const adj = pick(ADJEKTIVE.filter((a) => !["gut", "viel", "gern", "nah"].includes(a.base)));
  const g = GIDX[x.genus] as G4;
  /* темы задают вариант: «nach Artikel» — только слабое склонение,
     «ohne Artikel» — только сильное. Случайный withArt выдавал в теме
     «nach Artikel» упражнения без артикля — тема учила не тому. */
  const withArt =
    topicId === "a2-adjektiv-null"
      ? false
      : topicId === "a2-adjektiv-best"
        ? true
        : Math.random() < 0.6;
  const art = ART[kasus][g];
  const end = (withArt ? WEAK : STRONG)[kasus][g];
  const adjForm = stemOf(adj.base) + end;
  const nounForm = nomenForm(x, kasus);

  /* Артикль есть → две дырки (артикль + прилагательное). Артикля нет →
     дырка одна: пустое поле артикля проверять бессмысленно, оно ничего
     не спрашивает. */
  const text = withArt
    ? kasus === "nom"
      ? `{0} {1} ${nounForm} ist neu.`
      : kasus === "akk"
        ? `Ich sehe {0} {1} ${nounForm}.`
        : `Ich helfe {0} {1} ${nounForm}.`
    : kasus === "nom"
      ? `{0} ${nounForm} ist neu.`
      : kasus === "akk"
        ? `Ich sehe {0} ${nounForm}.`
        : `Ich helfe {0} ${nounForm}.`;



  return {
    topic: withArt ? "a2-adjektiv-best" : "a2-adjektiv-null",
    task: withArt
      ? "Setze Artikel und Adjektiv in der richtigen Form ein."
      : "Ohne Artikel: введи только прилагательное, оно само показывает род и падеж.",
    text,
    hint: `(${adj.base})`,
    gaps: withArt ? [[art], [adjForm]] : [[adjForm]],
    why:
      `После ${withArt ? "определённого артикля — слабое склонение" : "отсутствия артикля — сильное склонение"}: ` +
      `${kasus}, ${x.genus === "der" ? "мужской род" : x.genus === "die" ? "женский род" : "средний род"} → окончание -${end}. ` +
      `Получается «${withArt ? art + " " : ""}${adjForm} ${nounForm}».`,
  };
}

/* --------------------------------------------------------------- Präsens -- */

function praesens(): Item {
  // только неотделяемые: иначе приставка меняет место в предложении
  const pool = PERFEKT.filter((f) => !verb(f.v).pre);
  const f = pick(pool);
  const v = verb(f.v);
  const form = prForms(v)[f.p] ?? prForms(v)[2];
  const text = f.text.replace(" {1}", "").replace("{1}", "").replace(/\s+\./g, ".");
  return {
    topic: "a1-praesens",
    task: "Setze das Verb im Präsens ein.",
    text,
    hint: `(${v.inf})`,
    gaps: [[form]],
    /* спряжение известно заранее: любая другая форма этого же глагола —
       узнаваемая ловушка, разбирается с указанием лица */
    traps: prForms(v)
      .map((x, i) => ({ x, i }))
      .filter(({ x, i }) => x && i !== f.p && x !== form)
      .map(({ x, i }) => trap(x, `«${x}» — это ${PR6[i]}; здесь ${PR6[f.p]} → ${form}.`))
      .filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why:
      `${v.inf}: ${PR6[f.p]} → ${form}. ` +
      `Ряд: du ${prForms(v)[1]}, er ${prForms(v)[2]}, wir ${prForms(v)[3]}, ihr ${prForms(v)[4]}.`,
  };
}

/* -------------------------------------------------------- Modalverben ----- */

const MODAL: Record<string, { pr: string[]; ru: string }> = {
  können: { pr: ["kann", "kannst", "kann", "können", "könnt", "können"], ru: "мочь" },
  müssen: { pr: ["muss", "musst", "muss", "müssen", "müsst", "müssen"], ru: "быть должным" },
  dürfen: { pr: ["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"], ru: "иметь разрешение" },
  sollen: { pr: ["soll", "sollst", "soll", "sollen", "sollt", "sollen"], ru: "следует" },
  wollen: { pr: ["will", "willst", "will", "wollen", "wollt", "wollen"], ru: "хотеть" },
  möchten: { pr: ["möchte", "möchtest", "möchte", "möchten", "möchtet", "möchten"], ru: "хотеть (вежливо)" },
};

/* Каждая фраза привязана к модальным глаголам, с которыми она звучит.
   Иначе получается «Wir müssen einen Kaffee, bitte» — грамматически верно,
   по-немецки невозможно. */
const MODAL_FRAMES: { text: string; verbs: string[] }[] = [
  { text: "{Pron} {0} gut Deutsch sprechen.", verbs: ["können"] },
  { text: "{Pron} {0} heute leider nicht kommen.", verbs: ["können", "müssen"] },
  { text: "{Pron} {0} hier rauchen?", verbs: ["dürfen"] },
  { text: "{Pron} {0} mehr für die Prüfung lernen.", verbs: ["müssen", "sollen", "wollen"] },
  { text: "{Pron} {0} am Wochenende nach Hause fahren.", verbs: ["wollen", "dürfen", "müssen"] },
  { text: "{Pron} {0} einen Kaffee, bitte.", verbs: ["möchten"] },
  { text: "{Pron} {0} das Formular ausfüllen.", verbs: ["müssen", "sollen", "können"] },
  { text: "{Pron} {0} noch etwas warten.", verbs: ["müssen", "sollen", "können"] },
  { text: "{Pron} {0} am Sonntag nicht arbeiten.", verbs: ["dürfen", "können", "sollen"] },
  { text: "{Pron} {0} langsam sprechen, bitte.", verbs: ["können", "sollen", "möchten"] },
  { text: "{Pron} {0} heute früher nach Hause.", verbs: ["müssen", "wollen"] },
];

function modal(): Item {
  const frame = pick(MODAL_FRAMES);
  const name = pick(frame.verbs);
  const m = MODAL[name];
  const p = Math.floor(Math.random() * 6);
  const pron = ["ich", "du", "er", "wir", "ihr", "sie"][p];
  return {
    topic: "a1-modalverben",
    task: "Setze das Modalverb in der richtigen Person ein.",
    text: cap(frame.text.replace("{Pron}", pron)),
    hint: `(${name} — ${m.ru})`,
    gaps: [[m.pr[p]]],
    traps: m.pr
      .map((x, i) => ({ x, i }))
      .filter(({ x, i }) => x && i !== p && x !== m.pr[p])
      .map(({ x, i }) => trap(x, `«${x}» — это ${PR6[i]}; здесь ${PR6[p]} → ${m.pr[p]}.`))
      .filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why:
      `${name}: ${PR6[p]} → ${m.pr[p]}. ` +
      `У модальных ich и er окончания не получают (ich kann, er kann); второй глагол — в конце, в инфинитиве.`,
  };
}

/* ----------------------------------------------------------- Komparativ -- */

function komparativ(): Item {
  const a = pick(ADJEKTIVE);
  const mode = pick(["komp", "sup"] as const);
  return mode === "komp"
    ? {
        topic: "a2-komparativ",
        task: "Bilde den Komparativ.",
        text: `{0} (${a.base})`,
        hint: "сравнительная степень",
        gaps: [[a.komp]],
        why: `«${a.base}» → ${a.komp}. ${a.komp !== a.base + "er" ? "Умлаут и/или irregular форма — это надо помнить." : "Обычное окончание -er."}`,
      }
    : {
        topic: "a2-komparativ",
        task: "Bilde den Superlativ.",
        text: `{0} (${a.base})`,
        hint: "превосходная степень",
        gaps: [[a.sup]],
        why: `«${a.base}» → ${a.sup}. ${a.sup !== "am " + a.base + "sten" ? "Форма особенная — запомнить." : "Обычное -sten."}`,
      };
}

/* ------------------------------------------------------------- Partizip -- */

function partizip(): Item {
  const v = pick(VERBS.filter((x) => x.inf !== "sein" && x.inf !== "haben"));
  return {
    topic: "a2-partizip",
    task: "Bilde das Partizip II.",
    text: `${v.inf} → {0}`,
    gaps: [[v.part]],
    why:
      `Partizip II: ${v.part}.` +
      (v.pre ? ` Приставка «${v.pre}» отделяемая, поэтому ge- стоит после неё.` : "") +
      (/^(be|ge|er|ver|zer|ent|emp|miss)/.test(v.inf) ? " Неотделяемая приставка — без ge-." : ""),
  };
}

/* ------------------------------------------------------------ Gegenteil -- */

function gegenteil(): Item {
  const g = pick(GEGENTEIL);
  return {
    topic: "a2-gegenteil",
    task: "Wie heißt das Gegenteil? Ein eigenes Adjektiv, nicht «nicht …» und nicht mit un-.",
    text: `${g.a} → {0}`,
    gaps: [g.answers],
    why: `Противоположность к «${g.a}»: ${g.answers.join(" / ")}.`,
  };
}

/* ----------------------------------------------------- Personalpronomen -- */

/* ряд: Nominativ → Akkusativ → Dativ + русский глянец. «sie» и «Sie»
   различаются СМЫСЛОМ, а не только формой, поэтому глянец идёт в подсказку —
   иначе задание нечестное: одна подсказка (sie), а правильных ответа два. */
const PRON: { forms: [string, string, string]; gloss: string }[] = [
  { forms: ["ich", "mich", "mir"], gloss: "я" },
  { forms: ["du", "dich", "dir"], gloss: "ты" },
  { forms: ["er", "ihn", "ihm"], gloss: "он" },
  { forms: ["sie", "sie", "ihr"], gloss: "она" },
  { forms: ["es", "es", "ihm"], gloss: "оно" },
  { forms: ["wir", "uns", "uns"], gloss: "мы" },
  { forms: ["ihr", "euch", "euch"], gloss: "вы (мн.)" },
  { forms: ["sie", "sie", "ihnen"], gloss: "они" },
  { forms: ["Sie", "Sie", "Ihnen"], gloss: "вежл. Вы" },
];

const PRON_FRAMES: { text: string; k: 1 | 2; task: string }[] = [
  { text: "Ich sehe {0} jeden Tag.", k: 1, task: "Akkusativ" },
  { text: "Ich helfe {0} gern.", k: 2, task: "Dativ" },
  { text: "Er besucht {0} morgen.", k: 1, task: "Akkusativ" },
  { text: "Das Buch gehört {0}.", k: 2, task: "Dativ" },
  { text: "Wir danken {0} für die Hilfe.", k: 2, task: "Dativ" },
  { text: "Sie ruft {0} heute an.", k: 1, task: "Akkusativ" },
  { text: "Ich rufe {0} morgen an.", k: 1, task: "Akkusativ" },
  { text: "Ich gebe {0} das Buch.", k: 2, task: "Dativ" },
  { text: "Ich frage {0} nach dem Weg.", k: 1, task: "Akkusativ" },
  { text: "Ich schenke {0} eine Blume.", k: 2, task: "Dativ" },
  { text: "Ich treffe {0} im Park.", k: 1, task: "Akkusativ" },
  { text: "Ich zeige {0} die Stadt.", k: 2, task: "Dativ" },
  { text: "Ich verstehe {0} nicht.", k: 1, task: "Akkusativ" },
  { text: "Ich schreibe {0} eine Nachricht.", k: 2, task: "Dativ" },
];

function pron(): Item {
  const f = pick(PRON_FRAMES);
  const p = pick(PRON);
  const form = p.forms[f.k];
  /* близнецы — ряды с той же записью в Nominativ, но другим смыслом:
     ровно то место, где раньше приходилось угадывать */
  const twins = PRON
    .filter((x) => x !== p && x.forms[0] === p.forms[0])
    .map((x) => `${x.forms[0]} (${x.gloss}) → ${x.forms[f.k]}`);
  return {
    topic: "a1-personalpronomen",
    task: `Setze das Personalpronomen im ${f.task} ein.`,
    text: f.text,
    hint: `(${p.forms[0]} — ${p.gloss})`,
    gaps: [[form]],
    /* любая другая форма того же падежа — узнаваемая ловушка: разбирается
       с указанием, чья она (euch = вы, ihnen = они, Ihnen = вежл. Вы…) */
    traps: PRON.filter((x) => x !== p && x.forms[f.k] !== form)
      .map((x) =>
        trap(
          x.forms[f.k],
          `«${x.forms[f.k]}» — это ${x.gloss} (${x.forms[0]}); в скобке «${p.forms[0]}» (${p.gloss}) → ${form}.`,
        ),
      )
      .filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why:
      `В скобке «${p.forms[0]}» — ${p.gloss}. ${f.task}: ${p.forms[0]} → ${form}.` +
      (twins.length ? ` Не путать: ${twins.join("; ")}.` : ""),
  };
}

/* --------------------------------------------------------- sein / haben -- */

function seinhaben(): Item {
  const which = pick(["sein", "haben"] as const);
  const v = verb(which);
  const p = Math.floor(Math.random() * 6);
  const pron = ["ich", "du", "er", "wir", "ihr", "sie"][p];
  const form = prForms(v)[p];
  const tail = which === "sein"
    ? ["müde.", "aus Russland.", "schon fertig.", "zu Hause.", "sehr froh.", "nicht da."][p]
    : ["einen Bruder.", "viel Zeit.", "eine Frage.", "einen Hund.", "Hunger.", "keine Lust."][p];
  return {
    topic: "a1-sein-haben",
    task: `Setze «${which}» in der richtigen Person ein.`,
    text: `${cap(pron)} {0} ${tail}`,
    hint: `(${which})`,
    gaps: [[form]],
    traps: prForms(v)
      .map((x, i) => ({ x, i }))
      .filter(({ x, i }) => x && i !== p && x !== form)
      .map(({ x, i }) => trap(x, `«${x}» — это ${PR6[i]}; здесь «${pron}» → ${form}.`))
      .filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why: `Здесь «${pron}» → ${form}.`,
  };
}

/* --------------------------------------------------------------- obwohl --
   Уступка двумя структурами. Ответ — целое предложение, и в gaps лежат все
   ЧЕТЫРЕ корректных перестановки: придаточное позади/впереди и «trotzdem»
   с глаголом на 2-й позиции или в середине. Проверка по norm() не отличает
   их и не должна. */

function obwohl(): Item {
  const f = pick(OBWOHL);
  return {
    topic: "b1-obwohl-trotzdem",
    task: "Verbinde die Sätze mit «obwohl» oder «trotzdem». Принимаются обе структуры.",
    text: `${f.a}  /  ${f.b}\n{0}`,
    gaps: [f.answers],
    why:
      "«obwohl» — придаточное: глагол уходит в конец (…, obwohl es regnet / Obwohl es regnet, geht er joggen). " +
      "«trotzdem» — наречие в главном предложении: после него глагол на 2-й позиции (Es regnet, trotzdem geht er joggen). " +
      "Смысл один — уступка, отличается только структура.",
  };
}

/* ------------------------------------------------------ damit ↔ um…zu ---- */

function umzu(): Item {
  const f = pick(UMZU);
  const forward = f.text.includes("damit");
  return {
    topic: "b1-damit-umzu",
    task: forward
      ? "Ersetze «damit» durch «um … zu». Подлежащее в обеих частях одно и то же."
      : "Ersetze «um … zu» durch «damit».",
    text: `${f.text}\n{0}`,
    gaps: [f.answers],
    why: f.why,
  };
}

/* ------------------------------------------------------ Infinitiv mit zu --
   Форма выводится из таблицы, а не придумывается: у отделяемых zu встаёт
   между приставкой и корнем (fernsehen → fernzusehen), у остальных — просто
   перед инфинитивом. Исключений в этой форме нет, поэтому генератор здесь
   может быть регулярным — в отличие от Präteritum. */

function infinitivzu(): Item {
  const f = pick(INFINITIVZU);
  const v = verb(f.v);
  const form = v.pre ? v.pre + "zu" + v.inf.slice(v.pre.length) : "zu" + v.inf;
  return {
    topic: "b1-infinitiv-zu",
    task: "Infinitiv mit zu: допиши глагол в конце предложения.",
    text: f.text,
    hint: `(${v.inf})`,
    gaps: [[form]],
    why: v.pre
      ? `«${v.inf}» отделяемый: zu встаёт между приставкой и корнем → ${form}.`
      : `zu стоит перед инфинитивом: ${v.inf} → ${form}.` +
        (/^(be|ge|er|ver|zer|ent|emp|miss)/.test(v.inf)
          ? " Неотделяемая приставка ничего не меняет."
          : ""),
  };
}

/* ------------------------------------------------------ Plusquamperfekt --
   nachdem + Plusquamperfekt в придаточном, Präteritum в главном.
   Вспомогательный берётся из hilfsverb() по ЛИЦУ из кадра — иначе рамка
   «Nachdem wir … hatte …» учила бы неправильному согласованию. */

function plusquamperfekt(): Item {
  const f = pick(PLUSQUAM);
  const v = verb(f.v);
  // именно Präteritum-aux: hilfsverb() отдаёт Präsens (habe/hast/hat…) —
  // с ним получилось бы Perfekt, а не Plusquamperfekt
  const aux = praetAux(v, f.p);
  /* sein не имеет Partizip II в этой конструкции: «zu Ende war», а не
     «zu Ende gewesen war» — поэтому для него дырки всего две. */
  const gaps = f.obj
    ? v.inf === "sein"
      ? [[f.obj], [aux]]
      : [[f.obj], [v.part], [aux]]
    : [[v.part], [aux]];
  return {
    topic: "b1-plusquamperfekt",
    task: "Nachdem + Plusquamperfekt: допиши придаточное. В главном предложении время уже стоит.",
    text: f.text,
    hint: `(${f.hint})`,
    gaps,
    why:
      `nachdem — предшествование: что случилось РАНЬШЕ, идёт в Plusquamperfekt, главное действие — в Präteritum. ` +
      `Здесь: ${v.aux === "s" ? "sein (движение/состояние) → war/waren" : "haben → hatte/hatten"} + Partizip II.` +
      (v.inf === "sein" ? " При sein в значении «быть» достаточно Präteritum: zu Ende war." : ""),
  };
}

/* --------------------------------------------------------------- Passiv --
   Passiv Präsens = wird/werden + Partizip II. Число вспомогательного
   согласуется с НОВЫМ подлежащим (бывшим аккузативом), поэтому оно
   фиксировано в кадре, а не выводится. */

function passiv(): Item {
  const f = pick(PASSIV);
  const v = verb(f.v);
  const aux = f.plural ? "werden" : "wird";
  return {
    topic: "b1-passiv",
    task: "Bildung des Passivs Präsens: вспомогательный глагол + Partizip II.",
    text: f.text,
    hint: `(${v.inf})`,
    gaps: [[aux], [v.part]],
    why:
      `Passiv Präsens = ${aux} + Partizip II. ` +
      (f.plural ? "Подлежащее во множественном числе → werden." : "Подлежащее в единственном → wird.") +
      " Аккузатив-объект стал подлежащим.",
  };
}

/* -------------------------------------------------------- Konjunktiv II --
   Сильные формы (wäre, hätte, könnte, müsste, dürfte, sollte) обязаны
   быть в ответе именно ими: «würde haben» на экзамене считается ошибкой
   стиля, а здесь проверка точная. */

function konjunktiv2(): Item {
  const f = pick(KONJ2);
  return {
    topic: "b1-konjunktiv2",
    task: "Konjunktiv II: поставь глагол в сослагательное наклонение («бы»).",
    text: f.text,
    hint: f.hint,
    gaps: f.answers.map((a) => [a]),
    why: f.why,
  };
}

/* ---------------------------------------------- Verben mit Präpositionen --
   Предлог словарный, поэтому кадр содержит контекст, снимающий
   двусмысленность (sich freuen auf — ещё не было, über — уже случилось). */

function verbenPraep(): Item {
  const f = pick(VERBEN_PRAEP);
  return {
    topic: "b1-verben-praep",
    task: "Setze die richtige Präposition ein.",
    text: f.text,
    hint: f.hint,
    gaps: [[f.prep]],
    why: f.why,
  };
}

/* ---------------------------------------------------------- n-Deklination --
   Только слабые существительные из nouns.ts (weak: true): во всех падежах
   кроме Nominativ +-(e)n. Форма берётся из nomenForm(), артикль — из
   bestimmter(): правило уже проверено, генератор ничего не выдумывает. */

const WEAK_FRAMES: { text: string; k: Kasus }[] = [
  { text: "Ich grüße {0} {1} jeden Morgen.", k: "akk" },
  { text: "Ich besuche {0} {1} am Wochenende.", k: "akk" },
  { text: "Der Lehrer fragt {0} {1}.", k: "akk" },
  { text: "Wir laden {0} {1} zum Fest ein.", k: "akk" },
  { text: "Kennst du {0} {1}?", k: "akk" },
  { text: "Ich helfe {0} {1} gern.", k: "dat" },
  { text: "Wir danken {0} {1} für die Hilfe.", k: "dat" },
  { text: "Das Buch gehört {0} {1}.", k: "dat" },
  { text: "Ich antworte {0} {1} sofort.", k: "dat" },
  { text: "Ich gratuliere {0} {1} zum Geburtstag.", k: "dat" },
  { text: "Ich gebe {0} {1} die Unterlagen.", k: "dat" },
];

function ndeklination(): Item {
  const f = pick(WEAK_FRAMES);
  const x = pick(NOUNS.filter((z) => z.weak));
  return {
    topic: "b1-ndeklination",
    task: `Setze das Nomen mit Artikel im ${f.k === "akk" ? "Akkusativ" : "Dativ"} ein. Слабое склонение.`,
    text: f.text,
    hint: `(${x.nom})`,
    gaps: [[bestimmter(x, f.k)], [nomenForm(x, f.k)]],
    why:
      `«${bare(x)}» — n-Deklination: во всех падежах кроме Nominativ добавляется -(e)n. ` +
      `${f.k === "akk" ? "Akkusativ" : "Dativ"}: ${bestimmter(x, f.k)} ${nomenForm(x, f.k)}.`,
  };
}

/* ---------------------------------------------------- Doppelkonnektoren --
   Оба слова — две дырки, порядок слов внутри клаузы уже вшит в кадр:
   после «desto» глагол идёт сразу, и переиграть это ученик не может. */

function doppelkonnektor(): Item {
  const f = pick(DOPPELKONN);
  return {
    topic: "b1-konnektoren-doppel",
    task: "Ergänze: entweder … oder, weder … noch, sowohl … als auch, nicht nur … sondern auch, je … desto, bald … bald.",
    text: f.text,
    gaps: [[f.first], [f.second]],
    why: f.why,
  };
}

/* ------------------------------------------------ Präteritum im Erzählen --
   Только 1-е/3-е лицо ед. числа (см. комментарий у PRAETERITUM): форма
   совпадает с praet из таблицы, выводить окончания du/ihr/wir не нужно —
   на таком регулярном выводе уже ломались формы (klingelte ≠ *klinglte). */

function praeteritum(): Item {
  const f = pick(PRAETERITUM);
  const v = verb(f.v);
  const praet = v.praet ?? prForms(v)[2];
  const gaps: string[][] = f.twoGaps ? [[praet], [v.pre!]] : [[praet]];
  return {
    topic: "b1-praeteritum-erzaehlen",
    task: "Präteritum: поставь глагол в прошедшее время рассказа.",
    text: f.text,
    hint: f.hint,
    gaps,
    why:
      `«${v.inf}» в Präteritum — ${praet}` +
      (v.pre ? `, отделяемая приставка «${v.pre}» уходит в конец` : "") +
      ".",
  };
}

/* -------------------------------------------------------- Wortbildung ---- */

function wortbildung(): Item {
  const f = pick(WORDBILD);
  return {
    topic: "b1-wortbildung",
    task: "Bilde das Nomen zum Verb. Пиши с артиклем.",
    text: `${f.inf} → {0}`,
    gaps: [[f.nomen]],
    why: f.why,
  };
}

/* ----------------------------------------------------- Grammatik-Mix --
   Задания «как на экзамене, но вразнобой»: половина — дырка на форму
   (время указано в скобке), половина — перестройка предложения в
   заданную форму. Используется в разделе Prüfung, не в раундах тем. */

function grammatikMix(): Item {
  if (Math.random() < 0.5) {
    const f = pick(ZEITMIX);
    return {
      topic: "grammatik-mix",
      task: "Setze das Verb in der angegebenen Form ein:",
      text: f.text,
      hint: `(${f.inf} · ${f.form})`,
      gaps: [f.answers],
      why: f.why,
    };
  }
  const f = pick(UMFORM);
  return {
    topic: "grammatik-mix",
    task: `Forme ins ${f.form} um:`,
    text: `${f.given}\n{0}`,
    gaps: [f.answers],
    why: f.why,
  };
}

/* ------------------------------------------------------------ реестр ----- */

/* Генераторы принимают id темы: relativ() делит кадры по уровню (B1/B2),
   остальным идентификатор нужен только чтобы попасть в Item.topic. */
export const GEN: Record<string, (topicId?: string) => Item> = {
  perfekt,
  trennbar,
  relativ,
  nebensatz,
  artikel,
  artikelNom: () => artikelWith("nom"),
  artikelAkk: () => artikelWith("akk"),
  artikelDat: () => artikelWith("dat"),
  adjektiv,
  praesens,
  modal,
  komparativ,
  partizip,
  gegenteil,
  pron,
  seinhaben,
  obwohl,
  umzu,
  infinitivzu,
  plusquamperfekt,
  passiv,
  konjunktiv2,
  verbenPraep,
  ndeklination,
  doppelkonnektor,
  praeteritum,
  wortbildung,
  /* ---- B2 (фрагменты b2verb/b2satz/b2wort/b2praep) ---- */
  passivModal,
  konjunktiv2Vergangenheit,
  konjunktiv1: konjunktiv1B2,
  partizipial,
  konnektorenGehoben,
  nominalisierung,
  funktionsverb,
  modalpartikeln,
  pronominaladverbien,
  /* ---- C1 (фрагменты c1a/c1b) ---- */
  konjunktiv1Formen: konjunktiv1C1,
  esKonstruktionen,
  konnektorenC1,
  nominalstil,
  partizipAttribut,
  wortstellungC1: wortstellung,
  modalitaet,
  /* ---- A1 (фрагмент a1) ---- */
  wortstellung: wortstellungA1,
  artikelUnbest,
  negation,
  fragen,
  imperativ,
  possessiv,
  /* ---- A2 (фрагмент a2) ---- */
  praeteritumA2,
  konnektorenA2,
  nebensatzOb,
  reflexiv,
  praepositionenA2,
  wechselpraep,
  genitiv,
  futur,
  /* ---- экзамен-микс (раздел Prüfung) ---- */
  grammatikMix,
};

export const hasGen = (name: string): boolean => name in GEN;

/** собрать упражнение по теме; null — генератора ещё нет */
export function makeItem(topicId: string, genNames: string[]): Item | null {
  const name = genNames.find(hasGen);
  if (!name) return null;
  const it = GEN[name](topicId);
  return { ...it, topic: topicId };
}

/** один раунд: n упражнений. При маленьком пуле кадров makeItem может
    выдать то же упражнение дважды — перекатываем до 5 попыток, повтор
    текста в одном раунде это мусор. */
export function makeRound(topicId: string, genNames: string[], n = 6): Item[] {
  const out: Item[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < n; i++) {
    let it = makeItem(topicId, genNames);
    if (!it) break;
    for (let k = 0; k < 5 && seen.has(it.text); k++) {
      const alt = makeItem(topicId, genNames);
      if (!alt) break;
      it = alt;
    }
    seen.add(it.text);
    out.push(it);
  }
  return out;
}

/* ------------------------------------------------- история ошибок --------
   Раунд из случайных упражнений никогда не возвращает ученика к тому,
   что он ЗАВАЛИЛ: recordDe хранит только агрегат. Поэтому заваленные
   упражнения копятся здесь и инжектируются в начало следующего раунда
   темы (до 2 штук), пока не будут решены верно. Хранилище — localStorage,
   потому что это поведение UI, а не модель mastery. */

export type ItemSnap = Pick<Item, "task" | "text" | "hint" | "gaps" | "why" | "traps">;

const FEHLER_KEY = "tally.de.fehler.v1";

const loadFehler = (): Record<string, ItemSnap[]> => {
  try {
    return JSON.parse(localStorage.getItem(FEHLER_KEY) ?? "{}") as Record<string, ItemSnap[]>;
  } catch {
    return {};
  }
};

/** запомнить заваленное упражнение (без дублей по тексту, максимум 8 на тему) */
export function saveFehler(topicId: string, it: ItemSnap): void {
  try {
    const all = loadFehler();
    const list = all[topicId] ?? [];
    if (list.some((x) => x.text === it.text)) return;
    all[topicId] = [{ ...it }, ...list].slice(0, 8);
    localStorage.setItem(FEHLER_KEY, JSON.stringify(all));
  } catch {
    /* приватный режим — история просто не пишется */
  }
}

/** упражнение из истории решено верно — вычёркиваем */
export function dropFehler(topicId: string, text: string): void {
  try {
    const all = loadFehler();
    all[topicId] = (all[topicId] ?? []).filter((x) => x.text !== text);
    localStorage.setItem(FEHLER_KEY, JSON.stringify(all));
  } catch {
    /* как выше */
  }
}

/** подсмотреть до k заваленных упражнений темы (не удаляя) */
export function peekFehler(topicId: string, k = 2): ItemSnap[] {
  return (loadFehler()[topicId] ?? []).slice(0, k);
}

export type { N };
