/* ============================================================================
   B2-PRAEP: Pronominaladverbien и verschachtelte Relativsätze
   ----------------------------------------------------------------------------
   Две темы. Общий принцип соседей соблюдён: задания собираются из ЯВНО
   ХРАНИМЫХ кадров, ничего не сочиняется на лету.

   b2-praepositionaladverbien. «darauf, womit, worüber» — две формы:

     (a) Замена: «Er freut sich auf den Urlaub. → Er freut sich darauf.»
         Трансформация, а не выбор — поэтому пара хранится целиком, как в
         UMZU: генератор ничего не выводит, только выбирает кадр. Управления
         (глагол + предлог) взяты из VERBEN_PRAEP в data.ts — они там уже
         проверены глазами; здесь меняется только форма, а не управление.
         Два кадра VERBEN_PRAEP в пары НЕ переведены сознательно:
           sich kümmern um unsere Großeltern,
           sich entschuldigen bei seiner Lehrerin —
         объект одушевлённый, а pronominal adverb работает только с
         предметами: на вопрос «Um wen kümmerst du?» отвечают «um sie»,
         не «darum». Упражнение, которое учило бы «darum» о бабушке,
         учило бы ошибке.

     (b) Дырка в ответе на wo(r)-вопрос:
         «Worauf freust du dich? — {0}, dass der Urlaub endlich beginnt.»
         Ответ «Darauf» здесь единственный: вопросительное слово Worauf
         уже зафиксировало предлог, ученик переводит вопрос в ответ.
         Форма «Ich freue mich {0} den Urlaub» намеренно НЕ используется:
         там ответ неоднозначен (на, über, für — всё звучит), а hole
         честность важнее объёма.

   b2-relativsatz-komplex. Кадры ниже (RELATIV_B2_KOMPLEX) идут В СУЩЕСТВУЮЩИЙ
   массив RELATIV в data.ts при интеграции — формат ТОЧНО RelativFrame
   ({ text с {0}, a — ответ, why про падеж }), и отдельного генератора теме
   не нужно: сработает существующий relativ() из gen.ts (makeItem проставит
   topic). Внутри — Genitiv-формы (dessen/deren, в том числе после предлога)
   и вложенные придаточные, где дырка — местоимение ВНУТРЕННЕГО придаточного,
   а внешнее местоимение уже стоит в тексте и подсказкой не служит.

   Инварианты (проверяются прогоном, как в tools/deprobe): {i} == gaps.length
   подряд от 0; непустые ответы; текст до первой дырки с заглавной; нет
   двойных пробелов; task/why непустые. Для кадров «в RELATIV»: одиночная
   дырка {0}, ответ непустой.
   ========================================================================== */

import type { Theory } from "@/lib/de/theory";
import type { Item } from "@/lib/de/gen";
import type { RelativFrame } from "@/lib/de/data";
import { FRAGE_FRAMES_EXTRA } from "@/lib/de/pools-extra";

/* ============================================================================
   ТЕОРИЯ
   ========================================================================== */

export const THEORY_B2_PRAEP: Record<string, Theory> = {
  "b2-praepositionaladverbien": {
    regel:
      "Pronominaladverbien verbinden eine Präposition mit da- oder wo-: darauf, daran, darüber, womit, worüber. " +
      "Beginnt die Präposition mit einem Vokal, steht ein -r dazwischen: da-r-auf, wo-r-über. " +
      "Sie ersetzen «Präposition + Sache»: Ich warte auf den Bus → Ich warte darauf. " +
      "In der Frage fragt man mit wo(r)+Präposition: Worauf wartest du? – Darauf, dass der Bus kommt. " +
      "Bei Personen sind Pronominaladverbien unmöglich: Auf wen wartest du? – Auf ihn, nicht «darauf».",
    ru:
      "Местоимённое наречие = предлог + da(r)-, слитые в одно слово: darauf «на это», daran «о том», " +
      "darüber «об этом», damit «этим». Оно заменяет сочетание «предлог + предмет»: " +
      "Ich warte auf den Bus → Ich warte darauf. Вопрос задаётся через wo(r)-: Worauf wartest du? — " +
      "и ответ начинается с da(r)-: Darauf. Если предлог начинается с гласной, вставляется -r: " +
      "darauf, darüber, worüber; если с согласной — без r: damit, davon, danach, womit. " +
      "Главная граница: это работает только с ПРЕДМЕТАМИ. О людях — предлог + местоимение: " +
      "Auf wen wartest du? – Auf meine Schwester. Предлог сам по себе словарный — тот, что требует глагол " +
      "(warten AUF, sich freuen AUF/ÜBER), он уже выучен в b1-verben-praep; здесь к нему добавляется только форма.",
    tabelle: {
      head: ["Präposition", "Frage", "Antwort", "Beispiel"],
      rows: [
        ["auf", "Worauf?", "darauf", "Ich freue mich darauf, dass …"],
        ["über", "Worüber?", "darüber", "Er ärgert sich darüber."],
        ["an", "Woran?", "daran", "Ich denke oft daran."],
        ["für", "Wofür?", "dafür", "Wir interessieren uns dafür."],
        ["um", "Worum?", "darum", "Sie bewirbt sich darum."],
        ["vor", "Wovor?", "davor", "Ich habe Angst davor."],
        ["von", "Wovon?", "davon", "Das hängt davon ab."],
        ["mit", "Womit?", "damit", "Womit kann ich helfen?"],
        ["nach", "Wonach?", "danach", "Sie fragt danach."],
      ],
    },
    beispiele: [
      {
        de: "Worauf freust du dich? – Darauf, dass der Urlaub endlich beginnt.",
        ru: "Вопрос через Worauf фиксирует предлог auf → ответ начинается с Darauf.",
      },
      {
        de: "Ich warte auf den Bus. → Ich warte darauf.",
        ru: "«предлог + предмет» схлопывается в одно слово; на вопрос Worauf? тоже отвечают darauf.",
      },
      {
        de: "Auf wen wartest du? – Auf meine Schwester.",
        ru: "Лицо: местоимённое наречие запрещено — только предлог + wen/wem-форма.",
      },
    ],
    fehler: [
      "Ставят pronominal adverb о человеке: «Ich warte darauf, meinen Freund» — о людях только предлог + местоимение: auf ihn.",
      "Забывают -r перед гласной: «dauf», «wouber» — правильно darauf, worüber, daraus.",
      "Дублируют предлог: «darauf auf den Bus» — наречие уже содержит предлог, второй не нужен.",
      "Разрывают слово: «Wo denkst du an?» — оно цельное: Woran denkst du?",
      "Берут предлог не от глагола: warten AUF → darauf, но sich freuen über etwas СЛУЧИВШЕЕСЯ → darüber. Управление смотрят в словаре, не на вкус.",
      "Пишут маленькую букву в начале ответа-предложения: «— darauf, dass …» — с заглавной: Darauf.",
    ],
    merk:
      "da(r)/wo(r) + предлог = одно слово, предлог тот, что требует глагол. Люди — исключение: " +
      "для них pronominal adverb не существует, только wen/wem.",
  },

  "b2-relativsatz-komplex": {
    regel:
      "Bei verschachtelten Relativsätzen hat jede Ebene ihr eigenes Relativpronomen: Genus und Numerus kommen " +
      "vom Bezugswort DIESER Ebene, der Kasus von der Funktion im eigenen Nebensatz. " +
      "Für Zugehörigkeit (wessen?) steht das Relativpronomen im Genitiv: der Student, dessen Professor ich kenne. " +
      "Genitivformen: dessen (maskulin/neutrum), deren (feminin/Plural). Der Genitiv kann auch hinter einer " +
      "Präposition stehen: der Autor, in dessen Romanen Berlin vorkommt.",
    ru:
      "Во вложенном предложении у каждого придаточного СВОЁ местоимение: род и число — от определяемого слова " +
      "именно этого уровня, падеж — от роли в СВОЁМ придаточном, а не в главном. «Чей?» — всегда Genitiv: " +
      "dessen (мужской и средний род), deren (женский и множественное). После Genitiv-местоимения обязательно " +
      "стоит существительное: dessen Professor, deren Artikel — это цельная группа, которая сама может быть " +
      "подлежащим или дополнением следующего придаточного. Предлог встаёт перед Genitiv: in dessen Romanen, " +
      "mit deren Hilfe. Алгоритм для каждой дырки: (1) к какому слову относи́тся? (2) что это слово делает " +
      "в СВОЁМ придаточном? (3) это принадлежность? — тогда Genitiv.",
    tabelle: {
      head: ["Bezug", "Form", "Beispiel"],
      rows: [
        ["Genitiv maskulin/neutrum", "dessen", "der Student, dessen Professor ich kenne"],
        ["Genitiv feminin/Plural", "deren", "die Journalistin, deren Artikel erscheinen"],
        ["Präposition + Genitiv", "in dessen / mit deren", "der Autor, in dessen Romanen …"],
        ["innerer Relativsatz", "Kasus der inneren Ebene", "das Museum, das eröffnet wird"],
      ],
    },
    beispiele: [
      {
        de: "Der Student, dessen Professor ich gut kenne, hat ein Stipendium bekommen.",
        ru: "dessen = «чьего профессора»: принадлежность → Genitiv, хотя вся группа «dessen Professor» — дополнение (kennen + Akk).",
      },
      {
        de: "Die Frau, die das Auto, das sie zwanzig Jahre gefahren hat, verkauft, zieht um.",
        ru: "Внешнее die — подлежащее (Frau) в первом придаточном; внутреннее das — Akkusativ к Auto во втором.",
      },
      {
        de: "Der Autor, in dessen Romanen Berlin immer wieder vorkommt, liest morgen.",
        ru: "Предлог + Genitiv: в его романах — in dessen Romanen; падеж местоимения не меняется от предлога, он остаётся Genitiv.",
      },
    ],
    fehler: [
      "Берут падеж от главного предложения: местоимение отвечает за роль в СВОЁМ придаточном, главный не участвует.",
      "Ставят dessen для женского рода и множественного: только der/das → dessen; die (ж. р. и Plural) → deren.",
      "Оставляют dessen/deren без существительного: после них обязательно Nomen (dessen Professor); одно слово вместо группы — это личное местоимение (sein/ihr), другая конструкция.",
      "Теряют предлог: «Der Autor, dessen Romanen Berlin vorkommt» — vorkommen IN → in dessen Romanen.",
      "Забывают глагол в конце внутреннего придаточного: каждая вложенная клауза держит свой спрягаемый глагол на конце.",
      "Ставят второй запятой лишний уровень: каждая вложенная клауза закрывается своей запятой — считайте уровни.",
    ],
    merk:
      "На каждую дырку два вопроса: к какому слову? и какая роль в СВОЁМ придаточном? Принадлежность — всегда Genitiv: dessen / deren (+ Nomen).",
  },
};

/* ============================================================================
   КАДРЫ: b2-praepositionaladverbien
   ----------------------------------------------------------------------------
   Форма (a): пара «полное предложение → предложение с pronominal adverb».
   Управление (глагол + предлог) взято из VERBEN_PRAEP в data.ts; объект в
   каждой паре — неодушевлённый, иначе замена невозможна (см. шапку файла).
   Ответ всегда один: это трансформация, а не выбор.
   ========================================================================== */

type PraepAdvPair = { full: string; answer: string; why: string };

export const ERSETZ_PAARE: PraepAdvPair[] = [
  /* warten auf + Akk (VERBEN_PRAEP) */
  {
    full: "Ich warte auf den Bus.",
    answer: "Ich warte darauf.",
    why: "warten auf + Akkusativ → worauf/darauf. «Den Bus» — предмет, «предлог + предмет» заменяется одним словом: darauf.",
  },
  /* sich freuen auf + Akk */
  {
    full: "Er freut sich auf den Urlaub.",
    answer: "Er freut sich darauf.",
    why: "sich freuen auf — предвкушение (отпуск ещё не был). На вопрос Worauf? отвечают darauf.",
  },
  /* sich freuen über + Akk */
  {
    full: "Sie freut sich über das Geschenk.",
    answer: "Sie freut sich darüber.",
    why: "sich freuen über — радость уже случившемуся (подарок получен) → darüber. Предлог берётся от глагола, не от вкуса.",
  },
  /* sich interessieren für + Akk */
  {
    full: "Wir interessieren uns für die Geschichte Deutschlands.",
    answer: "Wir interessieren uns dafür.",
    why: "sich interessieren für + Akkusativ → wofür/dafür.",
  },
  /* sich ärgern über + Akk */
  {
    full: "Er ärgert sich über den Lärm.",
    answer: "Er ärgert sich darüber.",
    why: "sich ärgern über + Akkusativ → darüber.",
  },
  /* denken an + Akk */
  {
    full: "Ich denke oft an meine Kindheit.",
    answer: "Ich denke oft daran.",
    why: "denken an + Akkusativ → woran/daran.",
  },
  /* sich erinnern an + Akk */
  {
    full: "Ich erinnere mich an den Namen.",
    answer: "Ich erinnere mich daran.",
    why: "sich erinnern an + Akkusativ → daran.",
  },
  /* teilnehmen an + Dat, отделяемая приставка остаётся в конце */
  {
    full: "Sie nimmt an dem Kurs teil.",
    answer: "Sie nimmt daran teil.",
    why: "teilnehmen an + Dativ → daran. Отделяемая приставка «teil» остаётся в конце: nimmt daran teil.",
  },
  /* sich gewöhnen an + Akk */
  {
    full: "Ich gewöhne mich an das kalte Wetter.",
    answer: "Ich gewöhne mich daran.",
    why: "sich gewöhnen an + Akkusativ → daran.",
  },
  /* sich unterhalten über + Akk */
  {
    full: "Wir unterhalten uns über den Urlaub.",
    answer: "Wir unterhalten uns darüber.",
    why: "sich unterhalten über + Akkusativ → darüber.",
  },
  /* sich bewerben um + Akk */
  {
    full: "Sie bewirbt sich um eine Stelle als Lehrerin.",
    answer: "Sie bewirbt sich darum.",
    why: "sich bewerben um + Akkusativ → worum/darum.",
  },
  /* Angst haben vor + Dat */
  {
    full: "Ich habe Angst vor Hunden.",
    answer: "Ich habe Angst davor.",
    why: "Angst haben vor + Dativ → wovor/davor. Собаки здесь «предмет» страха — замена возможна.",
  },
  /* abhängen von + Dat, отделяемая приставка остаётся в конце */
  {
    full: "Das hängt von der Tagesform ab.",
    answer: "Das hängt davon ab.",
    why: "abhängen von + Dativ → davon. «ab» отделяемая и остаётся в конце: hängt davon ab.",
  },
  /* fragen nach + Dat */
  {
    full: "Sie fragt nach dem Weg.",
    answer: "Sie fragt danach.",
    why: "fragen nach + Dativ → wonach/danach.",
  },
  /* es handelt sich um + Akk */
  {
    full: "Es handelt sich um ein wichtiges Problem.",
    answer: "Es handelt sich darum.",
    why: "es handelt sich um + Akkusativ → darum.",
  },
  /* sich verlassen auf + Akk */
  {
    full: "Ich verlasse mich auf deinen Plan.",
    answer: "Ich verlasse mich darauf.",
    why: "sich verlassen auf + Akkusativ → darauf. Объект — план (предмет), замена возможна.",
  },
  /* НЕ переведены из VERBEN_PRAEP: sich kümmern um unsere Großeltern и
     sich entschuldigen bei seiner Lehrerin — объект одушевлённый, pronominal
     adverb на людей не работает (см. шапку файла). */
];

/* ---------------------------------------------------------------------------
   Форма (b): вопрос с wo(r)+Präposition — ответ начинается с da(r)+Präposition.
   Вопросительное слово уже зафиксировало предлог, поэтому ответ единственный.
   Ответ хранится с заглавной: он начинает предложение-ответ.
   --------------------------------------------------------------------------- */

type FrageFrame = { frage: string; text: string; answer: string; why: string };

export const FRAGE_FRAMES: FrageFrame[] = [
  {
    frage: "Worauf freust du dich?",
    text: "— {0}, dass der Urlaub endlich beginnt.",
    answer: "Darauf",
    why: "Вопрос с Worauf зафиксировал предлог auf → ответ Darauf. Предмет (начало отпуска) неодушевлённый, поэтому pronominal adverb возможен.",
  },
  {
    frage: "Worüber ärgerst du dich?",
    text: "— {0}, dass der Bus schon wieder zu spät kam.",
    answer: "Darüber",
    why: "Worüber → darüber: sich ärgern über. Вопросительное слово уже содержит предлог, в ответе меняется только wo- на da-.",
  },
  {
    frage: "Woran denkst du gerade?",
    text: "— {0}, dass ich morgen meine Eltern besuche.",
    answer: "Daran",
    why: "Woran → daran: denken an. О людях так ответить нельзя («An wen denkst du? – An meinen Vater»), здесь мысль о событии — предметном.",
  },
  {
    frage: "Wofür interessierst du dich?",
    text: "— {0}, dass mehr Menschen mit dem Rad fahren.",
    answer: "Dafür",
    why: "Wofür → dafür: sich interessieren für. Содержание интереса — факт (что больше людей ездят на велосипеде), не человек.",
  },
  {
    frage: "Wovor hast du am meisten Angst?",
    text: "— {0}, dass ich die Prüfung nicht bestehe.",
    answer: "Davor",
    why: "Wovor → davor: Angst haben vor. Страх перед событием (не сдам экзамен) — предметный, замена честная.",
  },
  {
    frage: "Worum bewirbst du dich?",
    text: "— {0}, dass ich im Kinderheim arbeiten kann.",
    answer: "Darum",
    why: "Worum → darum: sich bewerben um. Речь о месте (предмет), поэтому pronominal adverb возможен; о человеке было бы «Um wen?» — и тогда только предлог + местоимение.",
  },
];

/* ============================================================================
   КАДРЫ «в RELATIV»: b2-relativsatz-komplex
   ----------------------------------------------------------------------------
   Формат ТОЧНО RelativFrame из data.ts: text с одной дыркой {0}, a — ответ,
   why объясняет падеж. При интеграции массив дописывается в RELATIV
   (data.ts) — отдельного генератора теме не нужно, сработает существующий
   relativ() из gen.ts, а makeItem проставит теме topic. Ответы единственные;
   внешнее местоимение вложенной конструкции всегда стоит в тексте явным
   словом, чтобы дырка читалась однозначно.
   ========================================================================== */

export const RELATIV_B2_KOMPLEX: RelativFrame[] = [
  /* Genitiv: «чей профессор» — притяжание + объект следующей клаузы */
  {
    text: "Der Student, {0} Professor ich gut kenne, hat ein Stipendium bekommen.",
    a: "dessen",
    why: "«Чей профессор?» — принадлежность → Genitiv; студент — мужской род → dessen. Вся группа «dessen Professor» — дополнение (kennen + Akkusativ), но форму местоимения задаёт принадлежность, а не эта роль.",
  },
  /* Genitiv: женский род */
  {
    text: "Die Journalistin, {0} Artikel in vielen Zeitungen erscheinen, arbeitet freiberuflich.",
    a: "deren",
    why: "«Чьи статьи?» — Genitiv женского рода → deren; Artikel (Plural) — подлежащее придаточного (erscheinen).",
  },
  /* Genitiv после предлога */
  {
    text: "Der Autor, {0} Romanen die Stadt Berlin immer wieder vorkommt, liest morgen in der Stadtbücherei.",
    a: "in dessen",
    why: "vorkommen требует in, но местоимение при принадлежности стоит в Genitiv: in dessen Romanen («в его романах»). Автор — мужской род → dessen; предлог живёт внутри дырки, как и в остальных кадрах RELATIV.",
  },
  /* вложенное: внутреннее местоимение — Akkusativ среднего рода */
  {
    text: "Die Frau, die das Auto, {0} sie zwanzig Jahre gefahren hat, verkauft, zieht nach Hamburg.",
    a: "das",
    why: "Дырка — местоимение к «das Auto» во ВНУТРЕННЕМ придаточном: sie hat das Auto gefahren → Akkusativ, средний род → das. Внешнее «die» (к Frau) уже стоит в тексте и на ответ не влияет.",
  },
  /* вложенное: внутреннее — Nominativ среднего рода в Passiv */
  {
    text: "Der Architekt, der das Museum, {0} nächstes Jahr eröffnet wird, geplant hat, bekommt einen Preis.",
    a: "das",
    why: "Внутреннее придаточное — Passiv: «das Museum wird eröffnet» → Museum остаётся подлежащим → Nominativ среднего рода das. Внешнее «der» относится к Architekt.",
  },
  /* вложенное: внутреннее — Dativ мужского рода в Passiv */
  {
    text: "Die Nachbarin, die dem Mädchen, {0} der Ball weggenommen wurde, geholfen hat, ruft die Polizei.",
    a: "dem",
    why: "Внутреннее придаточное — Passiv с Dativ-объектом: «кому отняли мяч?» → Dativ среднего рода dem. Это местоимение принадлежит внутреннему придаточному, помогать (helfen + Dativ) здесь уже «die Nachbarin».",
  },
  /* вложенное: внутреннее — um + Akkusativ среднего рода */
  {
    text: "Die Studentin, die das Stipendium, um {0} sie sich beworben hatte, endlich bekommen hat, studiert jetzt in Tübingen.",
    a: "das",
    why: "Внутренний оборот: sich bewerben um + Akkusativ; Stipendium — средний род → um das. Plusquamperfekt (hatte) показывает: заявка была раньше, чем стипендию получили.",
  },
  /* вложенное: внутреннее — Akkusativ женского рода */
  {
    text: "Die Kollegin, die die Präsentation, {0} der Chef morgen braucht, schon vorbereitet hat, bleibt heute länger im Büro.",
    a: "die",
    why: "Внутреннее придаточное: brauchen + Akkusativ; Präsentation — женский род, а в Akkusativ женский род совпадает с Nominativ → die. Внешнее «die» уже занято Kollegin.",
  },
];

/* ============================================================================
   ГЕНЕРАТОР
   ----------------------------------------------------------------------------
   pronominaladverbien — единственный генератор темы b2-praepositionaladverbien:
   случайно выбирает между формой (a) замены и формой (b) вопроса-ответа,
   чтобы обе отрабатывались в одном раунде. Для b2-relativsatz-komplex
   генератора здесь нет — кадры уходят в общий RELATIV (см. шапку).
   ========================================================================== */

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/* ------------------------------------------------- (a) замена парой ------------------------------------------------ */

function praepadvErsetzen(): Item {
  const f = pick(ERSETZ_PAARE);
  return {
    topic: "b2-praepositionaladverbien",
    task: "Ersetze «Präposition + Nomen» durch ein Pronominaladverb (da(r) + Präposition).",
    text: `${f.full}\n{0}`,
    gaps: [[f.answer]],
    why: f.why,
  };
}

/* ------------------------------------- (b) wo(r)-вопрос → da(r)-ответ ---------------------------------------------- */

function praepadvFrage(): Item {
  const f = pick(FRAGE_FRAMES);
  return {
    topic: "b2-praepositionaladverbien",
    task: "Antworte mit dem Pronominaladverb (da(r) + Präposition).",
    text: `${f.frage}\n${f.text}`,
    gaps: [[f.answer]],
    why: f.why,
  };
}

FRAGE_FRAMES.push(...FRAGE_FRAMES_EXTRA);

export function pronominaladverbien(): Item {
  return Math.random() < 0.5 ? praepadvErsetzen() : praepadvFrage();
}
