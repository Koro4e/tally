/* ============================================================================
   A2: восемь генераторов + теория a2-nebensatz (единственная без теории)
   ----------------------------------------------------------------------------
   a2-praeteritum. У gen.ts уже есть praeteritum() для b1-praeteritum-erzaehlen,
   но он берёт кадры PRAETERITUM — только 1./3. лицо ед.ч., потому что формы
   du/ihr выводить из таблицы нельзя (klingelte ≠ *klinglte). Здесь другое
   ядро языка: sein, haben и модальные в Präteritum (war, hatte, konnte,
   musste, wollte, durfte, sollte) — они живут в речи постоянно. Их формы
   нерегулярны и НЕ выводятся: лежат локальной таблицей PRAET_A2, как MODAL
   в gen.ts. Лицо случайное, форма берётся по индексу лица — каждый кадр
   проверен глазами на всех шести лицах.

   a2-konnektoren. Два навыка в одном: выбрать союз по смыслу и не сломать
   порядок слов. Кадр устроен так, что порядок слов сам отсеивает половину
   вариантов: если после дырки идёт инверсия («gehe ich»), подходят только
   наречия (deshalb/darum/deswegen); если обычный порядок — только
   сочинительные. Остальное добирает смысл. Ответы там, где язык допускает
   синоним, хранятся списком.

   a2-nebensatz-ob. Два типа: трансформация прямой вопрос → косвенный
   (ответ — целое предложение, отдельной строкой {0}, как в nebensatz()),
   и различение ob/wenn одной дыркой. Лица в вопросах только 3-е: сдвиг
   du/Sie в косвенной речи зависит от перспективы говорящего — упражнение
   не имеет права этому учить (см. комментарий в b2-verb.ts).

   a2-reflexiv. Местоимение выводится из ЛИЦА подлежащего локальной таблицей
   REFL_AKK (mich/dich/sich/uns/euch/sich). Только Akkusativ: Dativ-форма
   (ich wasche MIR die Hände) — отдельный навык, он не входит в эту тему.
   Кадры явные, с подлежащим.

   a2-praepositionen. Предлог фиксирован в кадре, существительное случайно —
   но не из всех NOUNS: кадр «Nach {0} gehe ich schlafen» с «der Bus»
   грамматически верен и бессмысленен. Поэтому у каждого предлога свой
   пул совместимых существительных из NOUNS. Форма выводится: phrase()
   из nouns.ts (артикль по падежу + форма слова, включая n-Deklination).

   a2-wechselpraep. Пара wohin/wo на один и тот же предмет — единственный
   способ показать, что решает глагол, а не место. Кадры явные, артикль
   выводится из рода локальной таблицей ART_WD (der/die/das × akk/dat).

   a2-genitiv. Ответ — вся группа: phrase(x, "gen") выводит des Vaters,
   des Hauses, des Jungen (слабое), der Mutter (женский без окончания).
   Подсказка даёт номинатив — трансформировать его и есть задание.

   a2-futur. Дырка одна — werden по лицу, инфинитив уже стоит в кадре:
   так упражнение не учит ставить инфинитив не туда. prForms(werden) —
   из verbs.ts, выводить руками не нужно.

   Инварианты (проверяются probe.cjs на 40 сэмплах): {i} подряд от 0 и
   ровно gaps.length; каждый ответ непустой и проходит check(); текст до
   первой дырки с заглавной; ни одной строки с двойным пробелом
   (формат «  /  » из nebensatz() разрешён — probe его чистит перед
   проверкой); task/why непустые.
   ========================================================================== */

import type { Theory } from "@/lib/de/theory";
import type { Item } from "@/lib/de/gen";
import { NOUNS, bare, phrase, type N } from "@/lib/de/nouns";
import { GEN_FRAMES_EXTRA, KONN_FRAMES_EXTRA, OB_TRANS_EXTRA } from "@/lib/de/pools-extra";
import { prForms, verbByInf, type V } from "@/lib/de/verbs";

/* ============================================================================
   ТЕОРИЯ — только a2-nebensatz: в theory2.ts её нет, а это база задания 3.4
   ========================================================================== */

export const THEORY_A2_EXTRA: Record<string, Theory> = {
  "a2-nebensatz": {
    regel:
      "Nebensätze mit weil, dass und wenn sind eigene Satzeinheiten: die Konjunktion steht vorn, " +
      "das konjugierte Verb geht ans Ende des Nebensatzes. «Ich bleibe zu Hause, weil ich krank bin.» " +
      "Steht der Nebensatz vorn, beginnt der Hauptsatz mit dem Verb: «Weil ich krank bin, bleibe ich zu Hause.» " +
      "weil gibt den Grund, dass den Inhalt (nach sagen, denken, wissen, glauben, sich freuen), " +
      "wenn eine Zeit oder eine Bedingung.",
    ru:
      "Придаточное — второе предложение, в котором спрягаемый глагол стоит последним словом. " +
      "weil = потому что (причина), dass = что (содержание: я знаю, я думаю, я рад, что…), " +
      "wenn = когда/если (время или условие). Русская интуиция подводит в одном месте: " +
      "по-русски «потому что я болен» — глагол сразу после союза, по-немецки он уезжает в конец: " +
      "weil ich krank bin. Это задание 3.4 экзамена — 10 баллов за одно правило.",
    tabelle: {
      head: ["союз / позиция", "значение / структура", "пример"],
      rows: [
        ["weil", "причина", "Ich bleibe zu Hause, weil ich krank bin."],
        ["dass", "содержание", "Ich glaube, dass er morgen kommt."],
        ["wenn", "время / условие", "Wenn ich Zeit habe, komme ich."],
        ["придаточное позади", "…, + союз", "…, weil ich krank bin."],
        ["придаточное впереди", "союз … , глагол + …", "Weil ich krank bin, bleibe ich zu Hause."],
      ],
    },
    beispiele: [
      { de: "Ich weiß, dass er heute kommt.", ru: "Я знаю, что он сегодня придёт. dass после wissen/glauben/denken — содержание, глагол в конце." },
      { de: "Er fragt, weil er die Aufgabe nicht versteht.", ru: "Он спрашивает, потому что не понимает задание. weil — причина." },
      { de: "Wenn es regnet, bleiben wir zu Hause.", ru: "Если/когда идёт дождь, мы остаёмся дома. Главное начинается с глагола: bleiben." },
      { de: "Ich freue mich, dass du kommst.", ru: "Я рад, что ты придёшь. sich freuen + dass — тоже содержание." },
    ],
    fehler: [
      "«weil ich bin krank» — глагол остался на втором месте; в придаточном он уходит в конец: weil ich krank bin.",
      "«Ich glaube, dass er kommt morgen» — порядок внутри dass-придаточного тоже глагол в конце: dass er morgen kommt.",
      "«Weil ich krank bin, ich bleibe zu Hause» — после придаточного главное начинается с глагола: bleibe ich.",
      "Путают wenn и als: wenn — многократно или в будущем, als — один раз в прошлом («als ich klein war»).",
      "«das» вместо «dass» — союз пишется с двумя s; das — это артикль или местоимение.",
      "Ставят denn вместо weil: denn сочинительное (порядок цел), weil ведёт придаточное с глаголом в конце.",
    ],
    merk:
      "Союз первым, спрягаемый глагол — последнее слово придаточного. " +
      "Придаточное впереди → главное начинается с глагола.",
  },
};

/* ============================================================================
   КАДРЫ И ГЕНЕРАТОРЫ
   ========================================================================== */

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** существительное по номинативу из NOUNS; пулы ниже состоят только из них */
const nounOf = (nom: string): N => NOUNS.find((x) => x.nom === nom) ?? NOUNS[0];

/** глагол по инфинитиву; verbByInf — словарь, а не функция (см. verbs.ts) */
const verbOf = (inf: string): V => verbByInf[inf];

const PRONOUNS = ["ich", "du", "er", "wir", "ihr", "sie"];

/* люди из NOUNS — общие пулы für / mit / Genitiv */
const PEOPLE = [
  "der Lehrer", "der Freund", "der Vater", "der Bruder", "der Sohn",
  "der Kollege", "der Nachbar", "der Junge", "der Student", "der Polizist",
  "der Tourist", "der Kunde", "die Frau", "die Mutter", "die Schwester",
  "die Tochter", "die Freundin", "die Lehrerin", "das Kind", "das Mädchen",
];

/* ------------------------------------------------ a2-praeteritum: кадры -- */

/* Формы НЕ выводятся: Präteritum модальных и aux нерегулярно во 2-м лице
   (du konntest, ihr musstet) и в du/ihr вообще ломается при любой попытке
   вывести окончание из Praesens. Локальная таблица, как MODAL в gen.ts. */
const PRAET_A2: Record<string, string[]> = {
  war: ["war", "warst", "war", "waren", "wart", "waren"],
  hatte: ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"],
  konnte: ["konnte", "konntest", "konnte", "konnten", "konntet", "konnten"],
  musste: ["musste", "musstest", "musste", "mussten", "musstet", "mussten"],
  wollte: ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"],
  durfte: ["durfte", "durftest", "durfte", "durften", "durftet", "durften"],
  sollte: ["sollte", "solltest", "sollte", "sollten", "solltet", "sollten"],
};

const PRAET_A2_LABEL: Record<string, string> = {
  war: "sein",
  hatte: "haben",
  konnte: "können",
  musste: "müssen",
  wollte: "wollen",
  durfte: "dürfen",
  sollte: "sollen",
};

/* Хвосты подобраны так, чтобы звучать при любом лице: «Ihr konntet gestern
   nicht kommen» так же естественно, как «Ich konnte gestern nicht kommen». */
const PRAET_A2_FRAMES: { text: string; verb: string }[] = [
  { text: "{Pron} {0} gestern den ganzen Tag zu Hause.", verb: "war" },
  { text: "{Pron} {0} letzte Woche krank.", verb: "war" },
  { text: "{Pron} {0} als Kind oft im Garten.", verb: "war" },
  { text: "{Pron} {0} gestern keine Zeit.", verb: "hatte" },
  { text: "{Pron} {0} als Kind ein altes Fahrrad.", verb: "hatte" },
  { text: "{Pron} {0} gestern nicht kommen.", verb: "konnte" },
  { text: "{Pron} {0} als Kind schon sehr gut schwimmen.", verb: "konnte" },
  { text: "{Pron} {0} gestern bis spät in die Nacht arbeiten.", verb: "musste" },
  { text: "{Pron} {0} heute früher nach Hause gehen.", verb: "musste" },
  { text: "{Pron} {0} als Kind immer Fußballspieler werden.", verb: "wollte" },
  { text: "{Pron} {0} am Wochenende länger schlafen.", verb: "wollte" },
  { text: "{Pron} {0} als Kind nicht ins Kino.", verb: "durfte" },
  { text: "{Pron} {0} das Auto nicht nehmen.", verb: "durfte" },
  { text: "{Pron} {0} für die Prüfung mehr üben.", verb: "sollte" },
  { text: "{Pron} {0} gestern früher kommen.", verb: "sollte" },
];

function praeteritumA2(): Item {
  const f = pick(PRAET_A2_FRAMES);
  const p = Math.floor(Math.random() * 6);
  const form = PRAET_A2[f.verb][p];
  const label = PRAET_A2_LABEL[f.verb];
  const row = PRAET_A2[f.verb];
  return {
    topic: "a2-praeteritum",
    task: "Präteritum: поставь глагол в прошедшее время (sein / haben / Modalverb).",
    text: cap(f.text.replace("{Pron}", PRONOUNS[p])),
    hint: `(${label})`,
    gaps: [[form]],
    why:
      `${label} в Präteritum — формы наизусть: ich ${row[0]}, du ${row[1]}, er ${row[2]}, ` +
      `wir ${row[3]}, ihr ${row[4]}, sie ${row[5]}. Здесь ${PRONOUNS[p]} → ${form}. ` +
      `sein, haben и модальные живут в Präteritum и в устной речи: «ich war müde», «ich musste arbeiten» — ` +
      `Perfekt («ich bin gewesen», «ich habe gemusst») так почти не говорят.`,
  };
}

/* ------------------------------------------------ a2-konnektoren: кадры -- */

type KonnFrame = { a: string; b: string; answers: string[]; why: string };

const KONN_FRAMES: KonnFrame[] = [
  {
    a: "Es ist spät,",
    b: " gehe ich ins Bett.",
    answers: ["deshalb", "darum", "deswegen"],
    why: "После дырки идёт инверсия («gehe ich») — значит, это наречие, а не союз: deshalb/darum/deswegen. Союзы (und, aber, denn) порядок слов не меняют.",
  },
  {
    a: "Es regnet,",
    b: " bleiben wir zu Hause.",
    answers: ["deshalb", "darum", "deswegen"],
    why: "Следствие из причины + инверсия после дырки → deshalb. «Es regnet, deshalb bleiben wir zu Hause»: deshalb занимает позицию 1, глагол встаёт на 2-ю.",
  },
  {
    a: "Ich habe keine Zeit,",
    b: " ich muss bis acht arbeiten.",
    answers: ["denn"],
    why: "Дальше — обычный порядок слов и причина → denn. weil нельзя: у weil глагол уходит в конец («weil ich bis acht arbeiten muss»); deshalb нельзя — после него была бы инверсия.",
  },
  {
    a: "Ich komme nicht mit,",
    b: " ich muss arbeiten.",
    answers: ["denn"],
    why: "Причина при целом порядке слов → denn. Смысл «потому что», а «но» здесь не подходит: нет противопоставления.",
  },
  {
    a: "Das Essen riecht gut,",
    b: " es schmeckt nicht.",
    answers: ["aber"],
    why: "Противопоставление («пахнет хорошо, но на вкус нет») → aber. und означает «и», и он соединял бы согласующиеся факты.",
  },
  {
    a: "Fährst du mit dem Bus,",
    b: " nimmst du den Zug?",
    answers: ["oder"],
    why: "Выбор между двумя вариантами → oder. Вопрос-альтернатива: «на автобусе или на поезде?».",
  },
  {
    a: "Kommst du heute,",
    b: " kommst du morgen?",
    answers: ["oder"],
    why: "Две взаимоисключающие возможности → oder. und здесь невозможен: выбрать можно только одно.",
  },
  {
    a: "Er spricht Deutsch",
    b: " Englisch, beide Sprachen sehr gut.",
    answers: ["und"],
    why: "Однородные дополнения и уточнение «beide» → und. oder противоречил бы слову «оба», aber и sondern требуют противопоставления/отрицания.",
  },
  {
    a: "Ich trinke keinen Kaffee,",
    b: " ich trinke viel Tee.",
    answers: ["sondern"],
    why: "После отрицания «nicht/kein», когда вторая часть что-то ЗАМЕНЯЕТ, стоит sondern: «не кофе, а чай». Это его единственное место в языке.",
  },
];

function konnektorenA2(): Item {
  const f = pick(KONN_FRAMES);
  return {
    topic: "a2-konnektoren",
    task: "Setze die passende Konjunktion ein: und, aber, oder, denn, sondern, deshalb.",
    text: `${f.a} {0}${f.b}`,
    hint: "(und / aber / oder / denn / sondern / deshalb)",
    gaps: [f.answers],
    why: f.why,
  };
}

/* --------------------------------------------------- a2-nebensatz-ob ---- */

type ObTrans = { q: string; stem: string; answer: string };

/* stem без {0}: плейсхолдер один, на отдельной строке — как в nebensatz() */
const OB_TRANS: ObTrans[] = [
  { q: "Kommt er?", stem: "Ich weiß nicht, …", answer: "ob er kommt" },
  { q: "Hat sie Zeit?", stem: "Sie fragt, …", answer: "ob sie Zeit hat" },
  { q: "Wohnt Anna in Kiel?", stem: "Ich weiß nicht, …", answer: "ob Anna in Kiel wohnt" },
  { q: "Bleibt das Wetter schön?", stem: "Wir wollen wissen, …", answer: "ob das Wetter schön bleibt" },
  { q: "Ist der Zug schon weg?", stem: "Ich weiß nicht, …", answer: "ob der Zug schon weg ist" },
  { q: "Kann er heute kommen?", stem: "Sie fragt, …", answer: "ob er heute kommen kann" },
  { q: "War sie gestern im Büro?", stem: "Er fragt, …", answer: "ob sie gestern im Büro war" },
];

const OB_WENN: { text: string; answer: "ob" | "wenn"; why: string }[] = [
  {
    text: "Ich weiß nicht, {0} er Zeit hat.",
    answer: "ob",
    why: "Это пересказ да/нет-вопроса «Hat er Zeit?» → косвенный вопрос с ob (= «ли»). wenn означал бы «когда» и смысла не даёт.",
  },
  {
    text: "Ich weiß nicht, {0} das stimmt.",
    answer: "ob",
    why: "«не знаю, правда ли это» → ob. Обрати внимание: в конце предложения нет вопросительного знака — косвенный вопрос его не берёт.",
  },
  {
    text: "Sie fragt, {0} ich mitkomme.",
    answer: "ob",
    why: "«спрашивает, иду ли я» → ob. Внутри придаточного глагол в конце: …, ob ich mitkomme.",
  },
  {
    text: "Er fragt, {0} der Zug Verspätung hat.",
    answer: "ob",
    why: "Косвенный да/нет-вопрос → ob. Глагол hat стоит в конце придаточного.",
  },
  {
    text: "{0} ich Zeit habe, komme ich dich besuchen.",
    answer: "wenn",
    why: "«когда/если у меня будет время» — время/условие → wenn. ob нельзя: здесь нет пересказа вопроса.",
  },
  {
    text: "{0} es regnet, bleiben wir zu Hause.",
    answer: "wenn",
    why: "Условие («если пойдёт дождь») → wenn. Главное начинается с глагола: bleiben wir.",
  },
  {
    text: "Wir gehen spazieren, {0} das Wetter schön ist.",
    answer: "wenn",
    why: "«когда погода хорошая» — время → wenn. ob дал бы бессмыслицу («гуляём, хорошая ли погода» — не о том речь).",
  },
  {
    text: "{0} ich nach Kiel kam, besuchte ich immer den Zoo.",
    answer: "wenn",
    why: "Многократное действие в прошлом («каждый раз, когда приезжал») → wenn. Один раз в прошлом было бы als, но здесь стоит immer — это wenn.",
  },
];

function nebensatzOb(): Item {
  if (Math.random() < 0.5) {
    const f = pick(OB_TRANS);
    return {
      topic: "a2-nebensatz-ob",
      task: "Verwandle die Ja/Nein-Frage in einen indirekten Fragesatz mit «ob». Глагол — в конец, знак вопроса не нужен.",
      text: `${f.q}  /  ${f.stem}\n{0}`,
      hint: "(ob)",
      gaps: [[f.answer]],
      why:
        `Прямой вопрос без вопросительного слова → косвенный с ob (= «ли»): «${f.answer}». ` +
        `Глагол уходит в конец придаточного, инверсия и вопросительный знак исчезают. ` +
        `С W-вопросами ob не нужен: остаётся вопросительное слово (wo er wohnt).`,
    };
  }
  const f = pick(OB_WENN);
  return {
    topic: "a2-nebensatz-ob",
    task: "Setze «ob» oder «wenn» ein.",
    text: f.text,
    hint: "(ob / wenn)",
    gaps: [[f.answer]],
    why: f.why,
  };
}

/* ------------------------------------------------------- a2-reflexiv ---- */

const REFL_AKK = ["mich", "dich", "sich", "uns", "euch", "sich"];

/* Лицо вшито в кадр вместе с подлежащим — форма выводится из REFL_AKK[p] */
const REFL_FRAMES: { text: string; p: number; subj?: string }[] = [
  { text: "Ich wasche {0} vor dem Abendessen.", p: 0 },
  { text: "Ich konzentriere {0} auf die Prüfung.", p: 0 },
  { text: "Du siehst {0} im Spiegel.", p: 1 },
  { text: "Du ärgerst {0} über den Fehler.", p: 1 },
  { text: "Er interessiert {0} für Musik.", p: 2 },
  { text: "Sie freut {0} auf das Wochenende.", p: 2 },
  { text: "Wir treffen {0} um acht vor dem Kino.", p: 3 },
  { text: "Wir bereiten {0} auf die Prüfung vor.", p: 3 },
  { text: "Ihr setzt {0} ans Fenster.", p: 4 },
  { text: "Ihr freut {0} auf die Ferien.", p: 4 },
  { text: "Die Kinder beeilen {0} zum Frühstück.", p: 5, subj: "Die Kinder" },
  { text: "Sie interessieren {0} für Kunst.", p: 5 },
];

function reflexiv(): Item {
  const f = pick(REFL_FRAMES);
  const form = REFL_AKK[f.p];
  /* «Die Kinder …» — split(" ")[0] даёт «Die», и why учил бы «Die → sich».
     Поэтому подлежащее можно задать в кадре явно. */
  const subj = f.subj ?? f.text.split(" ")[0];
  return {
    topic: "a2-reflexiv",
    task: "Setze das Reflexivpronomen ein.",
    text: f.text,
    hint: "(Akkusativ)",
    gaps: [[form]],
    why:
      `Возвратное местоимение повторяет подлежащее: ${subj} → ${form}.` +
      (!/^(wir|ich|du|ihr)$/i.test(subj)
        ? " В 3-м лице (и у Sie) возвратное всегда sich."
        : ""),
  };
}

/* ------------------------------------------------ a2-praepositionen ---- */

type PraepFrame = { prep: string; kasus: "akk" | "dat"; text: string; pool: string[] };

const PRAEP_FRAMES: PraepFrame[] = [
  { prep: "für", kasus: "akk", text: "Das Geschenk ist für {0}.", pool: PEOPLE },
  {
    prep: "ohne",
    kasus: "akk",
    text: "Ich gehe nie ohne {0} aus dem Haus.",
    pool: [
      "der Schlüssel", "der Regenschirm", "der Koffer", "der Mantel", "der Hut",
      "der Computer", "der Drucker", "die Brille", "die Tasche", "die Jacke",
      "die Hose", "das Handy", "das Telefon", "das Fahrrad", "das Auto",
      "das Radio", "das Buch",
    ],
  },
  {
    prep: "gegen",
    kasus: "akk",
    text: "Ich habe nichts gegen {0}.",
    pool: [
      "der Vertrag", "der Roman", "der Film", "der Beruf", "der Preis",
      "die Idee", "die Antwort", "die Prüfung", "die Wohnung", "die Frage",
      "die Geschichte", "das Problem", "das Ergebnis",
    ],
  },
  {
    prep: "um",
    kasus: "akk",
    text: "Ein Zaun steht um {0}.",
    pool: [
      "das Haus", "der Garten", "der Park", "die Schule", "das Kino",
      "das Theater", "das Museum", "die Bibliothek", "das Krankenhaus",
      "das Hotel", "das Restaurant", "der Bahnhof", "die Fabrik", "die Universität",
    ],
  },
  {
    prep: "mit",
    kasus: "dat",
    text: "Ich fahre mit {0} zur Arbeit.",
    pool: ["der Bus", "der Zug", "der Wagen", "das Auto", "das Fahrrad"],
  },
  { prep: "mit", kasus: "dat", text: "Ich gehe mit {0} ins Kino.", pool: PEOPLE },
  {
    prep: "aus",
    kasus: "dat",
    text: "Sie kommt gerade aus {0}.",
    pool: [
      "die Stadt", "das Haus", "der Garten", "das Büro", "die Küche",
      "das Kino", "das Theater", "die Bibliothek", "das Museum",
      "das Restaurant", "das Hotel", "der Bahnhof", "das Krankenhaus",
      "die Schule", "die Fabrik", "die Universität", "der Park",
    ],
  },
  {
    prep: "nach",
    kasus: "dat",
    text: "Nach {0} gehe ich gleich ins Bett.",
    pool: ["die Arbeit", "die Schule", "die Prüfung", "das Frühstück"],
  },
  {
    prep: "seit",
    kasus: "dat",
    text: "Wir wohnen hier seit {0}.",
    pool: ["der Winter", "der Sommer", "das Wochenende"],
  },
];

function praepositionenA2(): Item {
  const f = pick(PRAEP_FRAMES);
  const x = nounOf(pick(f.pool));
  const form = phrase(x, f.kasus);
  const kasusDe = f.kasus === "akk" ? "Akkusativ" : "Dativ";
  return {
    topic: "a2-praepositionen",
    task: `Setze das Nomen mit Artikel im ${kasusDe} ein.`,
    text: f.text,
    hint: `(${x.nom})`,
    gaps: [[form]],
    why:
      `«${f.prep}» всегда требует ${kasusDe} ` +
      `(Akkusativ: durch-für-gegen-ohne-um; Dativ: aus-bei-mit-nach-seit-von-zu). ` +
      `${x.nom} → ${form}. Форма выводится: артикль по падежу, у слабых существительных добавляется -(e)n.`,
  };
}

/* ------------------------------------------------- a2-wechselpraep ---- */

type WdFrame = { prep: string; wo: "wohin" | "wo"; genus: "der" | "die" | "das"; text: string };

const ART_WD: Record<"der" | "die" | "das", { akk: string; dat: string }> = {
  der: { akk: "den", dat: "dem" },
  die: { akk: "die", dat: "der" },
  das: { akk: "das", dat: "dem" },
};

/* Каждая пара wohin/wo на одном предмете: решает глагол, не место */
const WD_FRAMES: WdFrame[] = [
  { prep: "in", wo: "wohin", genus: "die", text: "Ich gehe {0} Küche." },
  { prep: "in", wo: "wo", genus: "die", text: "Ich bin {0} Küche." },
  { prep: "in", wo: "wohin", genus: "das", text: "Er stellt das Handy {0} Regal." },
  { prep: "in", wo: "wo", genus: "das", text: "Das Handy liegt {0} Regal." },
  { prep: "auf", wo: "wohin", genus: "der", text: "Ich lege das Buch {0} Tisch." },
  { prep: "auf", wo: "wo", genus: "der", text: "Das Buch liegt {0} Tisch." },
  { prep: "auf", wo: "wohin", genus: "der", text: "Die Kinder klettern {0} Baum." },
  { prep: "auf", wo: "wo", genus: "die", text: "Wir spielen nicht {0} Straße." },
  { prep: "an", wo: "wohin", genus: "die", text: "Ich hänge das Bild {0} Wand." },
  { prep: "an", wo: "wo", genus: "die", text: "Das Bild hängt {0} Wand." },
  { prep: "an", wo: "wohin", genus: "das", text: "Er stellt das Fahrrad {0} Haus." },
  { prep: "an", wo: "wo", genus: "das", text: "Das Fahrrad steht {0} Haus." },
];

/* Стяжения предлога с артиклем — первое, что напишет ученик. norm() их
   не отождествит с раздельной формой, поэтому засчитываем обе. */
const CONTR: Record<string, string> = {
  "in das": "ins",
  "in dem": "im",
  "an das": "ans",
  "an dem": "am",
};

function wechselpraep(): Item {
  const f = pick(WD_FRAMES);
  const kasus = f.wo === "wohin" ? "akk" : "dat";
  const form = `${f.prep} ${ART_WD[f.genus][kasus]}`;
  const answers = CONTR[form] ? [form, CONTR[form]] : [form];
  const other = `${f.prep} ${ART_WD[f.genus][f.wo === "wohin" ? "dat" : "akk"]}`;
  const noun = f.text.split(" ").slice(-1)[0];
  return {
    topic: "a2-wechselpraep",
    task: "Setze Präposition und Artikel ein. Frage: wohin? oder wo?",
    text: f.text,
    hint: f.wo === "wohin" ? "wohin? → Akkusativ" : "wo? → Dativ",
    gaps: [answers],
    why:
      f.wo === "wohin"
        ? `Вопрос wohin? → движение с целью → Akkusativ: ${form} ${noun}. При вопросе wo? стояло бы ${other} (Dativ).`
        : `Вопрос wo? → нахождение → Dativ: ${form} ${noun}. При вопросе wohin? стояло бы ${other} (Akkusativ).` +
          ` Падеж решает глагол (движение или положение), а не сам предмет.`,
  };
}

/* --------------------------------------------------------- a2-genitiv -- */

type GenFrame = { text: string; pool: string[] };

const GEN_FRAMES: GenFrame[] = [
  {
    text: "Das ist das Auto {0}.",
    pool: [
      "der Vater", "die Mutter", "der Lehrer", "der Freund", "der Kollege",
      "der Nachbar", "die Frau", "die Lehrerin", "der Bruder", "die Schwester",
      "das Kind", "der Junge", "der Student", "der Sohn", "die Tochter", "der Mensch",
    ],
  },
  {
    text: "Die Farbe {0} gefällt mir.",
    pool: [
      "das Auto", "das Zimmer", "das Haus", "die Wand", "das Sofa", "die Tür",
      "das Regal", "das Fahrrad", "der Tisch", "der Stuhl", "das Bett",
      "die Küche", "das Kleid", "das Buch",
    ],
  },
  {
    text: "Ich kenne die Eltern {0} gut.",
    pool: [
      "der Junge", "der Student", "der Kollege", "der Kunde", "der Nachbar",
      "das Kind", "das Mädchen", "die Tochter", "der Sohn",
    ],
  },
  {
    text: "Der Wagen {0} steht vor der Tür.",
    pool: [
      "der Vater", "die Mutter", "der Nachbar", "die Schwester", "die Frau",
      "der Lehrer", "der Kollege", "der Sohn", "die Tochter", "das Kind",
    ],
  },
];

function genitiv(): Item {
  const f = pick(GEN_FRAMES);
  const x = nounOf(pick(f.pool));
  const form = phrase(x, "gen");
  /* nomenForm даёт -s: des Kinds, des Kleids, des Betts. Форма верная, но
     учебник ждёт и -es (des Kindes) — принимаем оба варианта. У слабых
     (n-Deklination) варианта нет: только des Studenten, des Jungen. */
  /* односложные основы (Sohn, Stuhl): учебный стандарт — -es (des Sohnes) */
  const answers =
    !x.weak && (/(?:d|t)$/.test(bare(x)) || ["Sohn", "Stuhl"].includes(bare(x)))
      ? [form, `${form.slice(0, -1)}es`]
      : [form];
  const shown = answers[0];
  const alt = answers.length > 1 ? ` Принимается и форма «${answers[1]}».` : "";
  const note = x.weak
    ? `Слабое склонение: der Junge-слова получают -(e)n во всех падежах, кроме Nominativ — -s не нужен.`
    : x.genus === "die"
      ? `Женский род не получает окончания — меняется только артикль.`
      : `Мужской и средний род: артикль des + -(e)s на самом слове (после s/ß/z/ch — es: des Hauses).`;
  return {
    topic: "a2-genitiv",
    task: "Genitiv (wessen?): поставь существительное с артиклем в родительный падеж.",
    text: f.text,
    hint: `(${x.nom})`,
    gaps: [answers],
    why: `Genitiv отвечает на «wessen?»: ${x.nom} → ${shown}.${alt} ${note}`,
  };
}

/* ---------------------------------------------------------- a2-futur -- */

const WERDEN = prForms(verbOf("werden"));

/* Хвосты живы при любом лице: «Ihr werdet morgen nach Berlin ziehen»
   звучит так же естественно, как «Ich werde …» */
const FUTUR_TAILS = [
  "morgen nach Berlin ziehen.",
  "morgen nach Kiel fahren.",
  "am Wochenende kommen.",
  "nächste Woche anfangen.",
  "ihm morgen helfen.",
  "in Kiel bleiben.",
  "die Prüfung im Mai machen.",
];

function futur(): Item {
  const p = Math.floor(Math.random() * 6);
  const tail = pick(FUTUR_TAILS);
  const form = WERDEN[p];
  return {
    topic: "a2-futur",
    task: "Futur I: поставь «werden» в правильной форме. Инфинитив уже стоит в конце.",
    text: cap(`${PRONOUNS[p]} {0} ${tail}`),
    hint: "(werden)",
    gaps: [[form]],
    why:
      `Futur I = werden (позиция 2) + Infinitiv am Ende. Здесь ${PRONOUNS[p]} → ${form}.`,
  };
}

/* ------------------------------------------------------------- экспорт --

   Имена — под реестр GEN в gen.ts: их потом добавят в gen[] тем в topics.ts
   (a2-praeteritum → praeteritumA2 и т.д.). Сигнатура совпадает с GEN:
   (topicId?: string) => Item. */

/* Расширение малых пулов (tools/genwork/pools-extra.ts): раунд из 6 при
   пуле из 4-9 кадров показывал повторы в каждом раунде. */
GEN_FRAMES.push(...GEN_FRAMES_EXTRA);
KONN_FRAMES.push(...KONN_FRAMES_EXTRA);
OB_TRANS.push(...OB_TRANS_EXTRA);

export {
  praeteritumA2,
  konnektorenA2,
  nebensatzOb,
  reflexiv,
  praepositionenA2,
  wechselpraep,
  genitiv,
  futur,
};
