/* ============================================================================
   A1: wortstellung, artikel-unbest, negation, fragen, imperativ, possessiv
   ----------------------------------------------------------------------------
   Шесть тем A1, для которых в gen.ts ещё нет генераторов. Принцип тот же, что
   во всём проекте: всё, что выводится правилом, выводится из таблиц; всё, что
   нерегулярно или двусмысленно, лежит в кадрах явно.

   Что выводится, а что явное:

   · a1-artikel-unbest — род берётся из NOUNS (nouns.ts), формы ein/eine/einen
     и kein/keine/keinen выводятся по роду и падежу кадра, руками не пишутся.
     Несчётаемые (Zeit, Geld, Hunger…) в NOUNS отсутствуют — для них маленький
     явный список с родом, из которого форма выводится тем же правилом.
   · a1-negation — выбор nicht/kein словарной логикой не выводится, поэтому
     кадры явные, по одному кадру на одну ситуацию из theory2.ts (глагол,
     прилагательное, притяжательное → nicht; существительное без артикля →
     kein-форма). Ответ в кадре единственный.
   · a1-imperativ — du/ihr/Sie выводятся из prForms (verbs.ts), но ТОЛЬКО для
     отобранного пула глаголов без приставок, у которых du-форма регулярно
     равна основе (нет -t/-d-основ, нет сильных с изменением основы: essen,
     lesen, sprechen…). Отделяемые глаголы — кадры явные целиком («Steh auf!»):
     du-форма здесь нерегулярна, выводить её рискованно.
   · a1-possessiv — основа по владельцу (кадр), окончание по роду из NOUNS:
     -e у женского, ничего у мужского/среднего; euer → eure — единственное
     выпадение, вшито в правило.
   · a1-wortstellung и a1-fragen — ответ это целое предложение, его нельзя
     собрать из дырок однозначно (любая перестановка «выглядит похоже»).
     Поэтому кадр хранит неверное предложение и готовый верный ответ целиком;
     проверка norm() принимает его точной строкой.

   Инварианты (проверяются машиной на 40 сэмплах): {i} подряд с 0 и по числу
   дырок, непустые ответы, текст до первой дырки с заглавной, без двойных
   пробелов, task/why непустые. why — по-русски, коротко (уровень A1).
   ========================================================================== */

import type { Item } from "@/lib/de/gen";
import { NOUNS, bare, type Genus, type N } from "@/lib/de/nouns";
import { prForms, verbByInf, type V } from "@/lib/de/verbs";

/* -------------------------------------------------------------- утилиты -- */

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

const GENUS_RU: Record<Genus, string> = {
  der: "мужского рода",
  die: "женского рода",
  das: "среднего рода",
};

/* ---------------------------------------------------- a1-wortstellung ---- */

export type WortstellungFrame = {
  /** предложение с нарушенным порядком слов */
  wrong: string;
  /** единственный верный порядок — хранится целиком */
  right: string;
  note?: string;
};

export const WORTSTELLUNG_FRAMES: WortstellungFrame[] = [
  { wrong: "Heute ich habe keine Zeit.", right: "Heute habe ich keine Zeit." },
  { wrong: "Morgen ich gehe ins Kino.", right: "Morgen gehe ich ins Kino." },
  { wrong: "Am Sonntag ich fahre nach Hamburg.", right: "Am Sonntag fahre ich nach Hamburg." },
  { wrong: "In Kiel ich wohne seit einem Jahr.", right: "In Kiel wohne ich seit einem Jahr." },
  { wrong: "Im Sommer wir fahren ans Meer.", right: "Im Sommer fahren wir ans Meer." },
  { wrong: "Leider er kommt heute zu spät.", right: "Leider kommt er heute zu spät." },
  { wrong: "Um acht Uhr der Unterricht beginnt.", right: "Um acht Uhr beginnt der Unterricht." },
  { wrong: "Danach wir essen Kuchen.", right: "Danach essen wir Kuchen." },
  { wrong: "Am Wochenende mein Bruder spielt Fußball.", right: "Am Wochenende spielt mein Bruder Fußball." },
  { wrong: "Mit dem Bus ich fahre zur Arbeit.", right: "Mit dem Bus fahre ich zur Arbeit." },
  { wrong: "Abends meine Mutter kocht Suppe.", right: "Abends kocht meine Mutter Suppe." },
  { wrong: "Jetzt ich habe Hunger.", right: "Jetzt habe ich Hunger." },
  { wrong: "Heute Abend ich gehe ins Kino.", right: "Heute Abend gehe ich ins Kino." },
  {
    wrong: "Um sieben ich stehe auf.",
    right: "Um sieben stehe ich auf.",
    note: "Глагол отделяемый: приставка auf- остаётся в самом конце.",
  },
  { wrong: "Im Winter wir fahren oft in die Berge.", right: "Im Winter fahren wir oft in die Berge." },
];

export function wortstellung(): Item {
  const f = pick(WORTSTELLUNG_FRAMES);
  return {
    topic: "a1-wortstellung",
    task: "Der Satz ist falsch. Поставь глагол на вторую позицию и введи исправленное предложение целиком.",
    text: `${f.wrong}\n{0}`,
    gaps: [[f.right]],
    why:
      `Каркас: позиция 1 — что угодно, позиция 2 — всегда глагол. ` +
      `Первое место занято не подлежащим, значит подлежащее переезжает сразу за глагол: «${f.right}». ` +
      (f.note ?? "Глагол нельзя ставить третьим — предложение рассыпается."),
  };
}

/* -------------------------------------------------- a1-artikel-unbest ---- */

/* Формы ein/kein по роду и падежу — выводятся, не хранятся:
   Nominativ: ein/eine/ein, Akkusativ: einen/eine/ein (только мужской меняется). */
const EIN: Record<Genus, [string, string]> = {
  der: ["ein", "einen"],
  die: ["eine", "eine"],
  das: ["ein", "ein"],
};

const KEIN: Record<Genus, [string, string]> = {
  der: ["kein", "keinen"],
  die: ["keine", "keine"],
  das: ["kein", "kein"],
};

/* Несчётаемые: в NOUNS их нет, а «Ich habe keine Zeit» — канонический кадр
   темы. Род явный, форма выводится тем же правилом KEIN. */
export type UnbestUncount = { word: string; genus: Genus; text: string };

export const UNCOUNT: UnbestUncount[] = [
  { word: "Zeit", genus: "die", text: "Ich habe {0} Zeit." },
  { word: "Lust", genus: "die", text: "Ich habe {0} Lust." },
  { word: "Angst", genus: "die", text: "Ich habe {0} Angst." },
  { word: "Arbeit", genus: "die", text: "Ich habe {0} Arbeit." },
  { word: "Geld", genus: "das", text: "Ich habe {0} Geld." },
  { word: "Hunger", genus: "der", text: "Ich habe {0} Hunger." },
  { word: "Durst", genus: "der", text: "Ich habe {0} Durst." },
  { word: "Urlaub", genus: "der", text: "Ich habe {0} Urlaub." },
  { word: "Unterricht", genus: "der", text: "Wir haben heute {0} Unterricht." },
];

/* Конкретные предметы: с ними «haben/kaufen/brauchen/suchen» звучит
   естественно, и никакое существительное не ломает рамку. */
const KAUF = new Set([
  "Tisch", "Stuhl", "Schrank", "Apfel", "Hund", "Wagen", "Schlüssel", "Kuchen",
  "Saft", "Fisch", "Salat", "Computer", "Roman", "Regenschirm", "Bleistift",
  "Mantel", "Rock", "Hut", "Tasche", "Flasche", "Tasse", "Zeitung",
  "Zeitschrift", "Karte", "Lampe", "Blume", "Pflanze", "Hose", "Jacke", "Buch",
  "Heft", "Auto", "Fahrrad", "Brot", "Bier", "Ei", "Bild", "Foto", "Telefon",
  "Handy", "Radio", "Regal", "Sofa", "Messer", "Glas", "Kleid", "Hemd",
  "Kühlschrank", "Drucker", "Löffel", "Teller", "Becher", "Brille", "Geschenk",
]);

/* Для «Das ist ein …» время и отвлечённое не подходит: «Das ist ein Monat»
   по-немецки так не говорят. */
const NOM_AUS = new Set([
  "der Abend", "der Monat", "der Winter", "der Sommer", "der Tag", "das Jahr",
  "das Wochenende", "der Preis", "der Beruf", "der Vertrag",
]);

const EIN_AKK_FRAMES = [
  "Ich habe {0} {1}.",
  "Ich kaufe {0} {1}.",
  "Ich suche {0} {1}.",
  "Ich brauche {0} {1}.",
];

const KEIN_AKK_FRAMES = [
  "Ich habe {0} {1}.",
  "Ich kaufe {0} {1}.",
  "Ich brauche {0} {1}.",
];

export function artikelUnbest(): Item {
  const kasusNote = (kasus: "nom" | "akk", genus: Genus): string =>
    kasus === "nom"
      ? "Nominativ: форма зависит только от рода."
      : genus === "der"
        ? "Akkusativ: только мужской род получает -en."
        : "Akkusativ: у женского и среднего рода форма совпадает с Nominativ.";

  /* --- kein: половина кадров — несчётаемые, половина — предметы из NOUNS --- */
  if (Math.random() < 0.5) {
    const u = pick(UNCOUNT);
    const form = KEIN[u.genus][1];
    return {
      topic: "a1-artikel-unbest",
      task: "Verneine mit «kein». Введи форму kein- с окончанием.",
      text: u.text,
      gaps: [[form]],
      why:
        `«${u.word}» стоит без артикля — отрицаем через kein, kein склоняется как ein. ` +
        `Здесь ${GENUS_RU[u.genus]} → ${form}.`,
    };
  }
  if (Math.random() < 0.5) {
    const x = pick(NOUNS.filter((z) => KAUF.has(bare(z))));
    const form = KEIN[x.genus][1];
    const frame = pick(KEIN_AKK_FRAMES);
    return {
      topic: "a1-artikel-unbest",
      task: "Verneine mit «kein». Введи форму kein- с окончанием.",
      text: frame.replace("{1}", bare(x)),
      gaps: [[form]],
      why:
        `«${bare(x)}» — ${GENUS_RU[x.genus]}, Akkusativ. ` +
        `kein получает те же окончания, что ein → ${form} ${bare(x)}. ${kasusNote("akk", x.genus)}`,
    };
  }
  /* --- ein: Nominativ («Das ist …») или Akkusativ --- */
  const nom = Math.random() < 0.5;
  const x = nom
    ? pick(NOUNS.filter((z) => !NOM_AUS.has(z.nom)))
    : pick(NOUNS.filter((z) => KAUF.has(bare(z))));
  const form = EIN[x.genus][nom ? 0 : 1];
  const frame = nom ? "Das ist {0} {1}." : pick(EIN_AKK_FRAMES);
  return {
    topic: "a1-artikel-unbest",
    task: "Setze «ein» in der richtigen Form ein. Форма зависит от рода (и падежа).",
    text: frame.replace("{1}", bare(x)),
    gaps: [[form]],
    why:
      `«${bare(x)}» — ${GENUS_RU[x.genus]}. ` +
      (nom ? "Nominativ: " : "Akkusativ: ") +
      `${form} ${bare(x)}. ${kasusNote(nom ? "nom" : "akk", x.genus)}`,
  };
}

/* -------------------------------------------------------- a1-negation ---- */

export type NegationFrame = { text: string; answer: string; why: string };

export const NEGATION_FRAMES: NegationFrame[] = [
  {
    text: "Ich habe {0} Zeit.",
    answer: "keine",
    why: "Zeit — существительное без артикля → отрицаем через kein; женский род → keine.",
  },
  {
    text: "Er kommt heute {0}.",
    answer: "nicht",
    why: "Отрицается глагол (kommt) → nicht, и nicht стоит в самом конце.",
  },
  {
    text: "Das Auto ist {0} neu.",
    answer: "nicht",
    why: "Отрицается прилагательное (neu) → nicht. kein перед прилагательным невозможен.",
  },
  {
    text: "Ich trinke {0} Kaffee.",
    answer: "keinen",
    why: "Отрицается существительное (der Kaffee) → kein; Akkusativ мужского рода → keinen.",
  },
  {
    text: "Das ist {0} mein Buch.",
    answer: "nicht",
    why: "Перед притяжательным местоимением (mein) стоит nicht, не kein.",
  },
  {
    text: "Wir haben heute {0} Unterricht.",
    answer: "keinen",
    why: "Unterricht — существительное без артикля, мужской род → keinen.",
  },
  {
    text: "Ich habe {0} Hunger.",
    answer: "keinen",
    why: "Hunger — существительное без артикля, мужской род → keinen.",
  },
  {
    text: "Ich habe {0} Geld.",
    answer: "kein",
    why: "Geld — существительное без артикля, средний род → kein (окончания нет).",
  },
  {
    text: "Ich wohne {0} in Kiel.",
    answer: "nicht",
    why: "Отрицается глагол (wohne) → nicht.",
  },
  {
    text: "Ich habe {0} Fragen.",
    answer: "keine",
    why: "Fragen — множественное число без артикля → keine (во мн. ч. kein всегда с -e).",
  },
  {
    text: "Ich bin {0} müde.",
    answer: "nicht",
    why: "Отрицается прилагательное (müde) → nicht.",
  },
  {
    text: "Ich habe {0} Lust.",
    answer: "keine",
    why: "Lust — существительное без артикля, женский род → keine.",
  },
  {
    text: "Ich verstehe die Aufgabe {0}.",
    answer: "nicht",
    why: "Есть определённый артикль (die) → nicht; nicht идёт в конец предложения.",
  },
  {
    text: "Ich habe {0} Auto.",
    answer: "kein",
    why: "Auto — существительное без артикля, средний род → kein.",
  },
  {
    text: "Ich möchte {0} Kuchen.",
    answer: "keinen",
    why: "Отрицается существительное (der Kuchen), Akkusativ мужского рода → keinen.",
  },
];

export function negation(): Item {
  const f = pick(NEGATION_FRAMES);
  return {
    topic: "a1-negation",
    task: "nicht oder kein? Ergänze den Satz. Есть существительное без артикля → kein-форма, всё остальное → nicht.",
    text: f.text,
    gaps: [[f.answer]],
    why: f.why,
  };
}

/* ---------------------------------------------------------- a1-fragen ---- */

export type FrageJaNein = { stmt: string; answers: string[]; note?: string };

export const FRAGEN_JANEIN: FrageJaNein[] = [
  { stmt: "Du kommst morgen.", answers: ["Kommst du morgen?"] },
  { stmt: "Du wohnst in Kiel.", answers: ["Wohnst du in Kiel?"] },
  { stmt: "Du sprichst gut Deutsch.", answers: ["Sprichst du gut Deutsch?"] },
  { stmt: "Ihr seid müde.", answers: ["Seid ihr müde?"], note: "sein особый: ihr seid → Seid ihr?" },
  { stmt: "Du hast heute Zeit.", answers: ["Hast du heute Zeit?"], note: "haben: du hast → Hast du?" },
  { stmt: "Ihr kommt um acht.", answers: ["Kommt ihr um acht?"] },
  { stmt: "Du arbeitest am Samstag.", answers: ["Arbeitest du am Samstag?"] },
  { stmt: "Ihr lernt Deutsch.", answers: ["Lernt ihr Deutsch?"] },
  { stmt: "Du hast eine Schwester.", answers: ["Hast du eine Schwester?"] },
  { stmt: "Ihr wohnt in Hamburg.", answers: ["Wohnt ihr in Hamburg?"] },
];

export type FrageW = { stmt: string; q: string; answer: string; why: string };

export const FRAGEN_W: FrageW[] = [
  {
    stmt: "Ich komme um acht Uhr.",
    q: "{0} kommst du?",
    answer: "Wann",
    why: "Спрашивают о времени (um acht) → wann. W-слово на первом месте, глагол на втором.",
  },
  {
    stmt: "Ich wohne in Kiel.",
    q: "{0} wohnst du?",
    answer: "Wo",
    why: "Спрашивают о месте (in Kiel) → wo.",
  },
  {
    stmt: "Ich komme aus Russland.",
    q: "{0} kommst du?",
    answer: "Woher",
    why: "О происхождении (aus Russland) → woher. woher = откуда, wohin = куда — не путать.",
  },
  {
    stmt: "Das Buch kostet zwölf Euro.",
    q: "{0} kostet das Buch?",
    answer: "Wie viel",
    why: "Спрашивают о цене → wie viel.",
  },
  {
    stmt: "Ich lerne Deutsch für die Arbeit.",
    q: "{0} lernst du Deutsch?",
    answer: "Warum",
    why: "Спрашивают о причине (für die Arbeit) → warum.",
  },
  {
    stmt: "Mein Bruder heißt Felix.",
    q: "{0} heißt dein Bruder?",
    answer: "Wie",
    why: "Об имени спрашивают «wie heißt …?».",
  },
  {
    stmt: "Anna wohnt in Berlin.",
    q: "{0} wohnt in Berlin?",
    answer: "Wer",
    why: "Спрашивают о лице-подлежащем → wer; глагол остаётся на втором месте.",
  },
];

export function fragen(): Item {
  if (Math.random() < 0.5) {
    const f = pick(FRAGEN_JANEIN);
    return {
      topic: "a1-fragen",
      task: "Bilde die Ja/Nein-Frage. Глагол — на первое место, подлежащее сразу за ним.",
      text: `${f.stmt}\n{0}`,
      gaps: [f.answers],
      why:
        f.note ??
        `Да/нет-вопрос: спрягаемый глагол встаёт на первое место, подлежащее за ним: «${f.answers[0]}».`,
    };
  }
  const f = pick(FRAGEN_W);
  return {
    topic: "a1-fragen",
    task: "Ergänze das Fragewort. W-слово — на первое место, глагол остаётся вторым.",
    text: `${f.stmt}\nFrage: ${f.q}`,
    hint: "(wann / wo / woher / wie / warum / wer / wie viel)",
    gaps: [[f.answer]],
    why: f.why,
  };
}

/* -------------------------------------------------------- a1-imperativ -- */

/* Пул для ВЫВОДА форм: без приставок, без -t/-d-основ (нужно -e: Arbeite!),
   без сильных с изменением основы в du (essen → Iss!, lesen → Lies!).
   du-форма = 1-е лицо Präsens без -e (у сильных с умлаутом умлаут исчезает,
   потому что берётся основа ich-формы: du fährst, но Fahr!). */
export const IMP_VERBS = [
  "machen", "kochen", "wohnen", "lernen", "spielen", "kaufen", "suchen",
  "hören", "sagen", "fragen", "brauchen", "putzen", "telefonieren",
  "probieren", "kommen", "gehen", "bleiben", "singen", "bringen", "denken",
  "trinken", "finden", "fahren", "schlafen", "laufen",
];

/* verbByInf всегда находит кадровые глаголы; fallback нужен TypeScript,
   чтобы тип был не undefined (тот же приём, что в b2-verb.ts). */
const VERB_FALLBACK: V = {
  inf: "machen",
  pr: "mache machst macht machen macht machen",
  part: "gemacht",
  aux: "h",
};

const verb = (inf: string): V => verbByInf[inf] ?? VERB_FALLBACK;

/* Отделяемые — ЯВНО: du-форма здесь нерегулярна, выводить рискованно. */
export type ImperativTrennbar = {
  person: "du" | "ihr" | "Sie";
  de: string;
  answers: string[];
  why: string;
};

export const IMP_TRENNBAR: ImperativTrennbar[] = [
  {
    person: "du",
    de: "aufstehen",
    answers: ["Steh auf!"],
    why: "Отделяемый глагол: приставка auf- уходит в конец, основа без -st: Steh auf!",
  },
  {
    person: "ihr",
    de: "aufstehen",
    answers: ["Steht auf!"],
    why: "ihr-форма steht + приставка в конец: Steht auf!",
  },
  {
    person: "Sie",
    de: "aufstehen",
    answers: ["Stehen Sie auf!"],
    why: "Инфинитив + Sie, приставка в самый конец: Stehen Sie auf!",
  },
  {
    person: "du",
    de: "zumachen",
    answers: ["Mach zu!"],
    why: "Приставка zu- уходит в конец: Mach zu! (например: Mach die Tür zu!)",
  },
  {
    person: "Sie",
    de: "zumachen",
    answers: ["Machen Sie zu!"],
    why: "Инфинитив + Sie, приставка в самый конец: Machen Sie zu!",
  },
  {
    person: "du",
    de: "anrufen",
    answers: ["Ruf an!"],
    why: "Приставка an- в конец, основа без -st: Ruf an!",
  },
  {
    person: "Sie",
    de: "anrufen",
    answers: ["Rufen Sie an!"],
    why: "Инфинитив + Sie: Rufen Sie an!",
  },
  {
    person: "du",
    de: "aufhören",
    answers: ["Hör auf!", "Höre auf!"],
    why: "Приставка auf- в конец: Hör auf! Форма Höre auf! тоже верна.",
  },
  {
    person: "du",
    de: "aufräumen",
    answers: ["Räum auf!"],
    why: "Приставка auf- в конец: Räum auf!",
  },
  {
    person: "ihr",
    de: "aufräumen",
    answers: ["Räumt auf!"],
    why: "ihr-форма räumt + приставка в конец: Räumt auf!",
  },
  {
    person: "Sie",
    de: "mitkommen",
    answers: ["Kommen Sie mit!"],
    why: "Инфинитив + Sie, mit- в конец: Kommen Sie mit!",
  },
  {
    person: "du",
    de: "mitkommen",
    answers: ["Komm mit!"],
    why: "Приставка mit- в конец: Komm mit!",
  },
  {
    person: "ihr",
    de: "mitbringen",
    answers: ["Bringt mit!"],
    why: "ihr-форма bringt + приставка в конец: Bringt mit!",
  },
  {
    person: "du",
    de: "fernsehen",
    answers: ["Sieh fern!"],
    why: "sehen → du siehst: сильная основа остаётся, приставка fern- уходит в конец: Sieh fern!",
  },
];

export function imperativ(): Item {
  /* 60% — регулярные глаголы (формы выводятся из prForms), 40% — отделяемые
     (ответ лежит в кадре целиком). */
  if (Math.random() < 0.6) {
    const v = verb(pick(IMP_VERBS));
    const pr = prForms(v);
    const du = cap(pr[0].slice(0, -1)) + "!";
    const duE = cap(pr[0]) + "!";
    const ihr = cap(pr[4]) + "!";
    const sie = cap(pr[3]) + " Sie!";
    /* Умлаут исчезает только там, где он есть в du-форме, но его нет в
       ich-форме (du fährst → Fahr!). У hören умлаут остаётся (Hör!):
       сравниваются обе формы, а не только pr[1]. */
    const umlaut = /[äöü]/.test(pr[1]) && !/[äöü]/.test(pr[0])
      ? ` Умлаут в императиве исчезает (du ${pr[1]} → ${du}).`
      : "";
    const person = pick(["du", "ihr", "Sie"] as const);
    return {
      topic: "a1-imperativ",
      task: "Bilde den Imperativ. Не забудь восклицательный знак.",
      text: `Imperativ (${person}): ${v.inf} → {0}`,
      gaps: [person === "du" ? [du, duE] : person === "ihr" ? [ihr] : [sie]],
      why:
        person === "du"
          ? `du-Imperativ = основа без -st: ${v.inf} → ${du}. Вариант с -e (${duE}) тоже верен.${umlaut}`
          : person === "ihr"
            ? `ihr-Imperativ = ihr-форма Präsens без местоимения: ihr ${pr[4]} → ${ihr}.`
            : `Sie-Imperativ = инфинитив + Sie: ${sie}. Без «Sie» форма не читается как вежливая.`,
    };
  }
  const f = pick(IMP_TRENNBAR);
  return {
    topic: "a1-imperativ",
    task: "Bilde den Imperativ. Отделяемая приставка уходит в конец.",
    text: `Imperativ (${f.person}): ${f.de} → {0}`,
    gaps: [f.answers],
    why: f.why,
  };
}

/* ------------------------------------------------------- a1-possessiv ---- */

export type PossOwner = { label: string; base: string; ru: string };

export const POSS_OWNERS: PossOwner[] = [
  { label: "ich", base: "mein", ru: "я" },
  { label: "du", base: "dein", ru: "ты" },
  { label: "er", base: "sein", ru: "он (его)" },
  { label: "sie", base: "ihr", ru: "она (её)" },
  { label: "wir", base: "unser", ru: "мы (наш)" },
  { label: "ihr", base: "euer", ru: "вы, мн. (ваш)" },
  { label: "Sie", base: "Ihr", ru: "Вы, вежливо (Ваш)" },
];

/* Окончание выводится по роду (Nominativ): -e только у женского.
   euer — единственное с выпадением -e-: euer → eure. */
const possForm = (base: string, genus: Genus): string => {
  if (genus !== "die") return base;
  return base === "euer" ? "eure" : base + "e";
};

/* Для «Das ist mein …» время и слабое склонение не подходят:
   «Das ist mein Montag», «mein Student» так не говорят. */
const POSS_AUS = new Set([
  "der Junge", "der Student", "der Mensch", "der Nachbar", "der Kollege",
  "der Kunde", "der Polizist", "der Tourist", "der Abend", "der Monat",
  "der Winter", "der Sommer", "der Tag", "das Jahr", "das Wochenende",
]);

/* Лица и близкие: с ними «Morgen kommt …» звучит естественно. */
const POSS_PERSONS = new Set([
  "der Lehrer", "der Freund", "der Vater", "der Bruder", "der Sohn",
  "die Frau", "die Mutter", "die Schwester", "die Tochter", "die Freundin",
  "die Lehrerin", "das Kind", "das Mädchen", "der Hund",
]);

export function possessiv(): Item {
  const o = pick(POSS_OWNERS);
  const personFrame = Math.random() < 0.35;
  const pool: N[] = personFrame
    ? NOUNS.filter((z) => POSS_PERSONS.has(z.nom))
    : NOUNS.filter((z) => !POSS_AUS.has(z.nom));
  const x = pick(pool);
  const form = possForm(o.base, x.genus);
  const frame = personFrame ? "Morgen kommt {0} {1}." : "Das ist {0} {1}.";
  return {
    topic: "a1-possessiv",
    task: "Setze den Possessivartikel ein. Только Nominativ: окончание зависит от рода существительного.",
    text: frame.replace("{1}", bare(x)),
    hint: `(${o.label} = ${o.ru})`,
    gaps: [[form]],
    why:
      `Владелец ${o.label} (${o.ru}) → основа «${o.base}». ` +
      `«${bare(x)}» — ${GENUS_RU[x.genus]}, Nominativ → ${form} ${bare(x)}. ` +
      (o.base === "euer" && x.genus === "die"
        ? "euer теряет -e- перед окончанием: euer → eure."
        : o.base === "euer"
          ? "Осторожно: у женского рода euer теряет -e- → eure."
          : "Окончание показывает род, а не основа: у женского рода было бы с -e.") +
      (o.base === "ihr" || o.base === "Ihr"
        ? " ihr = её, Ihr = Ваш, sein = его — основа про владельца, не про род."
        : ""),
  };
}
