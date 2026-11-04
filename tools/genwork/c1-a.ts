/* ============================================================================
   C1 (часть A): konjunktiv1-formen · es-konstruktionen · konnektoren
   ----------------------------------------------------------------------------
   Три темы C1 для переноса в src/lib/de (theory + кадры + генераторы).
   Ничего из src/ файл не трогает: это готовый материал для ревью.

   Ключевое решение по Konjunktiv I: просить «проспрягай KI» бессмысленно —
   у KI есть собственная форма ТОЛЬКО в 3. Person Singular (и у sein почти
   во всех лицах). Поэтому дырка ставится на живую форму: er sei, er habe,
   er könne, er werde. Там, где KI совпадает с Präsens (мн. число), в ответ
   перечислены ОБА варианта — KII (= Präteritum-форма) и сам KI — и в why
   честно объяснено, почему форма не одна.

   es-Konstruktionen: три типа кадров — дырка на коррелят (darauf/daran/…,
   ответ выводится из предлога глагола), дырка на безличное es и соединение
   «коррелят + dass» по детерминированным парам. Пары фиксированные: случайная
   комбинация «Das spricht dafür + es regnet» учит бессмыслице.

   Konnektoren (zumal/wobei/wenngleich): кадры как NEBENSATZ в data.ts —
   два реальных предложения и целое соединение в ответ. Для wenngleich
   приняты оба порядка (как у obwohl); для zumal и wobei — только постпозиция,
   потому что препозиция звучит искусственно, и упражнение не имеет права
   учить редкому варианту как равному.

   Честные ограничения:
   · du/ihr-формы KI (du kommest, ihr kommet) не дрилятся вообще — они
     архаичны даже в газетах; они есть только в таблице теории.
   · Ответ-соединение проверяется norm() как точная строка: синонимичные
     перестановки внутри клаузы не принимаются. Это осознанно — как в
     NEBENSATZ, где перечислены только те варианты, что реальны.
   · «планировать свободный текст с es» (например, «Ist es Ihnen klar, …»)
     не дриллится точной проверкой — оставлено теории.
   ========================================================================== */

import type { Theory } from "@/lib/de/theory";
import type { Item } from "@/lib/de/gen";

/* NEW-VERBS — глаголы, которых нет в verbs.ts, но формы которых нужны
   (в дырках или в спрягаемых местах кадров). Готовые строки v(...):
   v("können", "kann kannst kann können könnt können", "gekonnt", "h", undefined, "konnte")
   v("müssen", "muss musst muss müssen müsst müssen", "gemusst", "h", undefined, "musste")
   v("dürfen", "darf darfst darf dürfen dürft dürfen", "gedurft", "h", undefined, "durfte")
   v("sollen", "soll sollst soll sollen sollt sollen", "gesollt", "h", undefined, "sollte")
   v("wollen", "will willst will wollen wollt wollen", "gewollt", "h", undefined, "wollte")
   v("steigen", "steige steigst steigt steigen steigt steigen", "gestiegen", "s", undefined, "stieg")
   v("ausfallen", "falle fällst fällt fallen fallt fallen", "ausgefallen", "s", "aus", "fiel")
   v("interessieren", "interessiere interessierst interessiert interessieren interessiert interessieren", "interessiert")
   v("dauern", "dauere dauerst dauert dauern dauert dauern", "gedauert")
   Модальные при gap идут только в 3. Person Singular (könne, müsse, dürfe,
   solle, wolle) — других форм KI в живой косвенной речи нет. */

/* ============================================================================
   ТЕОРИЯ
   ========================================================================== */

export const THEORY_C1_A: Record<string, Theory> = {
  "c1-konjunktiv1-formen": {
    regel:
      "Der Konjunktiv I hat eine eigene Form nur in der 3. Person Singular " +
      "(er komme, er habe, er sei, er werde, er könne) und fast überall bei «sein» " +
      "(ich sei, wir seien, sie seien). In allen anderen Personen fällt er mit dem " +
      "Präsens zusammen (wir haben, sie haben) oder klingt archaisch (du kommest, " +
      "ihr kommet). Deshalb lebt er in der indirekten Rede: Er sagte, er sei krank.",
    ru:
      "Konjunktiv I — время косвенной речи: газеты, протоколы, передача чужих слов. " +
      "Собственная форма есть только в 3-м лице ед. числа (и у sein почти везде). " +
      "Честная картина по множественному числу: у всех глаголов КРОМЕ sein форма KI во мн. числе ничем не отличается " +
      "от Präsens (wir haben, sie haben) — она ничего не помечает, поэтому в этих " +
      "лицах косвенная речь уходит в KII, форма которого совпадает с Präteritum " +
      "(hätten, wären, könnten, stiegen). Отсюда ощущение, что «KI живёт только в 3sg» — " +
      "это почти буквально: er komme, er habe, er sei, er werde, er könne.",
    tabelle: {
      head: ["Person", "sein", "haben", "können", "werden"],
      rows: [
        ["ich", "sei", "habe", "könne", "werde"],
        ["du", "seist", "habest", "könnest", "werdest"],
        ["er / sie / es", "sei", "habe", "könne", "werde"],
        ["wir", "seien", "haben", "können", "werden"],
        ["ihr", "seiet", "habet", "könnet", "werdet"],
        ["sie / Sie", "seien", "haben", "können", "werden"],
      ],
    },
    beispiele: [
      { de: "Er sagte, er sei krank.", ru: "3. Person Singular — единственная «живая» форма KI: sei." },
      { de: "Die Zeugen sagten, sie hätten nichts gesehen.", ru: "Мн. число: KI (haben) совпал бы с Präsens, поэтому KII — hätten, форма совпадает с Präteritum." },
      { de: "Sie berichtete, die Preise stiegen.", ru: "Сильный глагол во мн. ч.: KI (steigen) = Präsens, в отчёте живёт stiegen (KII = Präteritum)." },
    ],
    fehler: [
      "«Er sagte, er ist krank» — Indikativ вместо KI: в 3-м лице ед. ч. косвенная речь требует sei.",
      "Путают KI и KII: er komme — это KI (основа Präsens + -e), er käme — KII (от Präteritumstamm).",
      "Ожидают изменения гласной: в KI её НЕТ. er gebe, er fahre, er komme — основа Präsens + -e, не gäbe/führe.",
      "Учат только er-форму и ломаются на plural sein: sie seien (KI), а не «sie sind» и не «sie waren».",
      "«Er würde krank sein» — не ошибка, но там, где есть короткая форма KI (sei, habe, könne), стандарт — она.",
    ],
    merk:
      "KI живёт в 3-м лице ед. числа: er komme, er habe, er sei, er werde, er könne. " +
      "Плюс sein: wir seien, sie seien. Где форма совпадает с Präsens — берут KII (hätten, wären, stiegen).",
  },

  "c1-es-konstruktionen": {
    regel:
      "Feste Konstruktionen mit unpersönlichem «es»: es gilt, es heißt, es besteht die Gefahr, " +
      "es handelt sich um, es kommt darauf an, es besteht kein Zweifel. Wird der Nachsatz mit " +
      "dass/ob eingeleitet, steht oft ein Korrelat (Pronominaladverb): darauf, dass … / daran, " +
      "dass … / darum, dass …. Das Korrelat bildet man aus der Präposition des Verbs.",
    ru:
      "Конструкции с es — устойчивые безличные рамки: «считается», «как говорится», " +
      "«существует опасность», «речь идёт о». Когда содержание оформлено придаточным " +
      "с dass/ob, впереди оставляют коррелят — местоимённое наречие. Коррелят = предлог " +
      "глагола + da-: auf → darauf, an → daran, um → darum, mit → damit, von → davon, " +
      "für → dafür. Никакой новой памяти — только предлог, который уже знает.",
    tabelle: {
      head: ["Konstruktion", "Значение", "Beispiel"],
      rows: [
        ["es handelt sich um", "речь идёт о", "Es handelt sich um einen Irrtum."],
        ["es gilt (als)", "считается / действует", "Es gilt als erwiesen, dass …"],
        ["es heißt", "как говорится / это значит", "Es heißt: Übung macht den Meister."],
        ["es besteht die Gefahr", "существует опасность", "Es besteht die Gefahr, dass der Zug ausfällt."],
        ["es kommt darauf an", "решает / главное —", "Es kommt darauf an, dass alle pünktlich sind."],
        ["es besteht kein Zweifel", "нет сомнений", "Es besteht kein Zweifel, dass er recht hat."],
      ],
    },
    beispiele: [
      { de: "Der Arzt achtet darauf, dass der Patient die Medikamente nimmt.", ru: "achten auf → коррелят darauf, dass." },
      { de: "Es hängt davon ab, ob der Chef morgen kommt.", ru: "abhängen von → davon ab; ob — открытый вопрос «да/нет»." },
      { de: "Sie sorgt dafür, dass die Kinder genug schlafen.", ru: "sorgen für → dafür, dass." },
    ],
    fehler: [
      "«Es handelt sich einen Fehler» — потерян um: es handelt sich UM einen Fehler.",
      "«Ich verlasse mich auf das, dass du kommst» — громоздко; коррелят короче: darauf, dass.",
      "«Es kommt daran an» — перепутан предлог: ankommen AUF → darauf, dass.",
      "Теряют es в начале: «Gilt als erwiesen, dass …» — без es конструкция разваливается.",
      "Пишут dass там, где открытый вопрос: «Es hängt davon ab, dass er kommt» vs «…, ob er kommt».",
    ],
    merk: "Коррелят = предлог глагола + da-. Подставь свой предлог — не угадывай: auf → darauf, an → daran, um → darum, mit → damit, von → davon, für → dafür.",
  },

  "c1-konnektoren": {
    regel:
      "zumal (= besonders weil, «тем более что») begründet und steht NACH dem Hauptsatz: " +
      "Der Plan ist riskant, zumal die Zeit knapp ist. wobei kommentiert den ganzen " +
      "Hauptsatz («при этом») und steht ebenfalls nach: Die Wohnung ist günstig, wobei " +
      "die Lage nicht ideal ist. wenngleich ≈ obwohl (Zugeständnis): Er hilft gern, " +
      "wenngleich er wenig Zeit hat — auch vor dem Hauptsatz möglich.",
    ru:
      "Три союза, которых нет ниже C1. zumal — усиливающая причина «тем более что», " +
      "ставится только после главного. wobei — «при этом»: комментарий и оговорка ко всему " +
      "главному, тоже только после него. wenngleich ≈ obwohl — уступка «хотя», глагол " +
      "в придаточном уходит в конец, придаточное может стоять и первым (тогда главное " +
      "начинается с глагола).",
    tabelle: {
      head: ["Konnektor", "Значение", "Позиция"],
      rows: [
        ["zumal", "тем более что (усиливающая причина)", "только после главного"],
        ["wobei", "при этом / однако (оговорка)", "только после главного"],
        ["wenngleich", "хотя (уступка, ≈ obwohl)", "до или после главного"],
      ],
    },
    beispiele: [
      { de: "Er kam spät, zumal der Zug Verspätung hatte.", ru: "Причина усиливает: опоздал — тем более что поезд и так опаздывал." },
      { de: "Der Aufenthalt hat mir gefallen, wobei das Hotel etwas laut war.", ru: "wobei добавляет оговорку ко всему высказыванию." },
      { de: "Wenngleich die Wohnung klein ist, gefällt sie mir.", ru: "Перед главным: главное начинается с глагола (gefällt)." },
    ],
    fehler: [
      "«Zumal der Zug Verspätung hatte, kam er spät» — формально возможно, но звучит искусственно: zumal живёт после главного.",
      "«…, wenngleich er hat wenig Zeit» — wenngleich ведёт придаточное: глагол в конец (wenngleich er wenig Zeit hat).",
      "Путают wobei и während: während — время («пока»), wobei — комментарий («при этом»).",
      "Считают zumal наречием: это союз, после него придаточное, глагол в конце (zumal die Zeit knapp IST).",
    ],
    merk: "zumal и wobei — только после главного предложения. wenngleich = obwohl: после главного или первым (главное тогда начинается с глагола).",
  },
};

/* ============================================================================
   КАДРЫ: KONJUNKTIV I
   ----------------------------------------------------------------------------
   Рабочая форма — дырка на живую форму KI в косвенной речи. Мн. число:
   там, где KI совпадает с Präsens, в ответе ДВА варианта (KII/Präteritum
   и сам KI) — и честный why, а не выдуманная «уникальная форма».
   ========================================================================== */

type K1Frame = { text: string; a: string[]; hint: string; why: string };

export const K1_FRAMES: K1Frame[] = [
  /* --- 3. Person Singular: собственная форма, ответ один ------------------- */
  {
    text: "Er sagte, er {0} krank.",
    a: ["sei"],
    hint: "(sein)",
    why: "Konjunktiv I von sein, 3. Person Singular: er sei. Косвенная речь — главная работа KI.",
  },
  {
    text: "Sie berichtete, der Zug {0} Verspätung.",
    a: ["habe"],
    hint: "(haben)",
    why: "Konjunktiv I: er habe. Вспомогательный глагол Perfekt в косвенной речи тоже идёт в KI: er habe Verspätung gehabt.",
  },
  {
    text: "Der Patient sagte, er {0} seit Tagen nicht schlafen.",
    a: ["könne"],
    hint: "(können)",
    why: "können → könne. Indikativ «kann» сообщал бы просто факт; KI помечает слова как чужие.",
  },
  {
    text: "Sie schrieb, sie {0} das Paket morgen schicken.",
    a: ["werde"],
    hint: "(werden)",
    why: "werden → werde. Будущее в косвенной речи: er werde morgen schicken.",
  },
  {
    text: "Er behauptete, er {0} die Antwort nicht.",
    a: ["wisse"],
    hint: "(wissen)",
    why: "wissen → wisse. KI не меняет корневую гласную: основа Präsens + -e.",
  },
  {
    text: "Die Mutter sagte, der Junge {0} nicht allein schwimmen gehen.",
    a: ["dürfe"],
    hint: "(dürfen)",
    why: "dürfen → dürfe. Модальные глаголы имеют собственную форму KI именно в 3. Person Singular.",
  },
  {
    text: "Er sagte, er {0} am Montag noch einmal anrufen.",
    a: ["müsse"],
    hint: "(müssen)",
    why: "müssen → müsse. Форма = инфинитивный стем müss- + -e (как kann → könne), а не основа Indikativ.",
  },
  {
    text: "Sie versicherte, sie {0} alle Unterlagen gelesen.",
    a: ["habe"],
    hint: "(haben)",
    why: "Perfekt в косвенной речи: habe + Partizip II. KI спрягается, Partizip остаётся в конце.",
  },
  {
    text: "Der Minister versicherte, die Lage {0} unter Kontrolle.",
    a: ["sei"],
    hint: "(sein)",
    why: "er sei — классическая формула официальных сообщений: «Die Lage sei unter Kontrolle».",
  },
  {
    text: "Die Journalistin schrieb, die Firma {0} neue Mitarbeiter.",
    a: ["suche"],
    hint: "(suchen)",
    why: "Даже слабый глагол в 3. Person Singular отличается: suche (Präsens: sucht). Газетный стиль: die Firma suche …",
  },
  {
    text: "Er erklärte, das Thema {0} ihn nicht.",
    a: ["interessiere"],
    hint: "(interessieren)",
    why: "interessieren → interessiere: основа + -e. Ещё одна газетная формула косвенной речи.",
  },
  /* --- Мн. число: честная двусмысленность, оба варианта в ответе ----------- */
  {
    text: "Die Zeugen sagten, sie {0} nichts gesehen.",
    a: ["hätten", "haben"],
    hint: "(haben, Plural)",
    why:
      "В 3-м лице мн. ч. KI (haben) совпадает с Präsens и ничего не помечает. " +
      "Поэтому живёт KII: hätten — его форма совпадает с Präteritum. Стандарт — hätten.",
  },
  {
    text: "Die Nachbarn sagten, sie {0} mit dem Lärm unzufrieden.",
    a: ["seien", "wären"],
    hint: "(sein, Plural)",
    why:
      "sein — единственный глагол, у которого KI и во мн. ч. свой: sie seien. " +
      "wären (KII) тоже верно; форма seien короче и стандартнее.",
  },
  {
    text: "Sie sagten, die Preise {0} stark.",
    a: ["stiegen", "steigen"],
    hint: "(steigen, Plural)",
    why:
      "steigen — сильный глагол: KI во мн. ч. (steigen) совпадает с Präsens, поэтому в отчёте " +
      "живёт stiegen — форма KII, совпадающая с Präteritum. Отсюда и впечатление, что " +
      "«KI Plural = Präteritum»: для сильных глаголов во мн. ч. это так. Засчитываются оба.",
  },
];

/* Карточка на форму: «слово → {0}», как в генераторе Partizip.
   Собственная форма KI всегда = основа Präsens + -e, единственный
   исключительный глагол — sein. У сильных гласная НЕ меняется. */

type K1Card = { inf: string; pr3: string; form: string; why: string };

export const K1_CARDS: K1Card[] = [
  { inf: "sein", pr3: "ist", form: "sei", why: "sein — единственный глагол с собственным KI почти во всех лицах: ich sei, er sei, wir seien, sie seien." },
  { inf: "haben", pr3: "hat", form: "habe", why: "haben → er habe. Основа + -e." },
  { inf: "können", pr3: "kann", form: "könne", why: "können → er könne. У модальных форма KI есть только здесь." },
  { inf: "müssen", pr3: "muss", form: "müsse", why: "müssen → er müsse." },
  { inf: "dürfen", pr3: "darf", form: "dürfe", why: "dürfen → er dürfe." },
  { inf: "sollen", pr3: "soll", form: "solle", why: "sollen → er solle." },
  { inf: "wollen", pr3: "will", form: "wolle", why: "wollen → er wolle. Не «will» — Indikativ совпадать не должен." },
  { inf: "werden", pr3: "wird", form: "werde", why: "werden → er werde." },
  { inf: "wissen", pr3: "weiß", form: "wisse", why: "wissen → er wisse. Гласная не меняется: не «wüsste» (это KII)." },
  { inf: "kommen", pr3: "kommt", form: "komme", why: "kommen → er komme. KI не меняет гласную: не «käme» (это KII)." },
  { inf: "geben", pr3: "gibt", form: "gebe", why: "geben → er gebe. Снова без умлаута: gäbe — это KII." },
  { inf: "gehen", pr3: "geht", form: "gehe", why: "gehen → er gehe." },
  { inf: "fahren", pr3: "fährt", form: "fahre", why: "fahren → er fahre. Умлаут Indikativ (fährt) исчезает." },
  { inf: "nehmen", pr3: "nimmt", form: "nehme", why: "nehmen → er nehme, не «nimm»." },
  { inf: "bleiben", pr3: "bleibt", form: "bleibe", why: "bleiben → er bleibe." },
  { inf: "lesen", pr3: "liest", form: "lese", why: "lesen → er lese." },
  { inf: "trinken", pr3: "trinkt", form: "trinke", why: "trinken → er trinke." },
  { inf: "machen", pr3: "macht", form: "mache", why: "machen → er mache. У слабых глаголов KI тоже есть — но живёт только в 3sg." },
  { inf: "arbeiten", pr3: "arbeitet", form: "arbeite", why: "arbeiten → er arbeite. Основа на -t: -e- вставка, как в Präsens." },
];

/* ============================================================================
   КАДРЫ: ES-KONSTRUKTIONEN
   ----------------------------------------------------------------------------
   Три типа: дырка на коррелят (ответ выводится из предлога глагола),
   дырка на безличное es, соединение по детерминированной паре.
   ========================================================================== */

/* Дырка на коррелят: hint называет связку, why выводит ответ из предлога. */

type EsCorr = { text: string; a: string; prep: string; why: string };

export const ES_CORR: EsCorr[] = [
  { text: "Ich verlasse mich {0}, dass du pünktlich kommst.", a: "darauf", prep: "sich verlassen auf", why: "sich verlassen AUF → коррелят darauf, dass. Коррелят = предлог глагола + da-." },
  { text: "Der Lehrer achtet sehr {0}, dass alle Formulare korrekt ausgefüllt werden.", a: "darauf", prep: "achten auf", why: "achten AUF → darauf, dass." },
  { text: "Es handelt sich {0}, dass ein Formular falsch ausgefüllt wurde.", a: "darum", prep: "handeln um", why: "handeln UM → darum, dass. «Речь идёт о том, что …»." },
  { text: "Das hängt {0} ab, ob das Wetter am Samstag mitspielt.", a: "davon", prep: "abhängen von", why: "abhängen VON → davon ab. ob — потому что содержание открытый вопрос «да/нет»." },
  { text: "Du musst {0} rechnen, dass der Termin verschoben wird.", a: "damit", prep: "rechnen mit", why: "rechnen MIT → damit, dass. «Считать с тем, что …»." },
  { text: "Das spricht {0}, dass die neue Methode wirkt.", a: "dafür", prep: "sprechen für", why: "sprechen FÜR → dafür, dass. «Говорить в пользу того, что …»." },
  { text: "Es kommt {0} an, dass alle sich an die Regeln halten.", a: "darauf", prep: "ankommen auf", why: "ankommen AUF → darauf an. Типичная ошибка — «daran an»: предлог AUF." },
  { text: "Wir haben uns {0} gewöhnt, dass es hier so laut ist.", a: "daran", prep: "sich gewöhnen an", why: "sich gewöhnen AN → daran, dass. «Привыкнуть к тому, что …»." },
  { text: "Der Bericht stützt sich {0}, dass die Zahlen korrekt sind.", a: "darauf", prep: "sich stützen auf", why: "sich stützen AUF → darauf, dass." },
  { text: "Sie bemüht sich {0}, dass ihr Sohn einen Studienplatz bekommt.", a: "darum", prep: "sich bemühen um", why: "sich bemühen UM → darum, dass." },
  { text: "Der Chef drängt {0}, dass wir schneller liefern.", a: "darauf", prep: "drängen auf", why: "drängen AUF → darauf, dass. «Настаивать на том, чтобы …»." },
  { text: "Er hält {0} fest, dass die Schule auch nachmittags offen bleibt.", a: "daran", prep: "festhalten an", why: "festhalten AN → daran fest. «Держаться за то, что …»." },
  { text: "Wir sind uns {0} einig, dass der Plan zu teuer ist.", a: "darüber", prep: "sich einig sein über", why: "sich einig sein ÜBER → darüber, dass." },
  { text: "Die Eltern sorgen sich {0}, dass der Sohn den Anschluss verpasst.", a: "darum", prep: "sich sorgen um", why: "sich sorgen UM → darum, dass." },
];

/* Дырка на само безличное es: кадр подставляет конструкцию после
   «двоеточия источника», чтобы es не стояло самым первым словом —
   и чтобы кадр звучал как цитата, а не как схема. */

type EsHole = { text: string; a: string; why: string };

export const ES_HOLE: EsHole[] = [
  { text: "Der Sprecher betonte: {0} besteht kein Zweifel, dass die Kosten steigen.", a: "Es", why: "Unpersönliches es: es besteht kein Zweifel, dass … На позиции 1 стоит es, сразу за ним глагол." },
  { text: "Im Bericht stand: {0} besteht die Gefahr, dass der Zug ausfällt.", a: "Es", why: "es besteht die Gefahr, dass … — устойчивая рамка «существует опасность, что …»." },
  { text: "Der Arzt beruhigte uns: {0} handelt sich um eine einfache Erkältung.", a: "Es", why: "es handelt sich um + Akkusativ — «речь идёт о». Без um и без es фраза невозможна." },
  { text: "In der Studie las ich: {0} gilt als erwiesen, dass Rauchen schadet.", a: "Es", why: "es gilt als …, dass … — «считается доказанным, что …»." },
  { text: "Am Ende war klar: {0} kommt darauf an, dass alle mitziehen.", a: "Es", why: "es kommt darauf an, dass … — «решает то, что … / главное — чтобы …»." },
];

/* Соединение по детерминированной паре: ответ — целое предложение,
   вариант один (для пары с ob — тоже один: dass тут не отвечает смыслу). */

type EsPair = { a: string; b: string; answers: string[]; why: string };

export const ES_PAIR: EsPair[] = [
  {
    a: "Das spricht dafür.",
    b: "Er kommt.",
    answers: ["Das spricht dafür, dass er kommt."],
    why: "sprechen für → dafür + dass. Коррелят остаётся в главном, придаточное с dass уходит в конец: глагол в самом конце.",
  },
  {
    a: "Der Arzt achtet darauf.",
    b: "Der Patient nimmt die Medikamente.",
    answers: ["Der Arzt achtet darauf, dass der Patient die Medikamente nimmt."],
    why: "achten auf → darauf, dass. В придаточном глагол nimmt — в конце.",
  },
  {
    a: "Es geht darum.",
    b: "Alle sparen Energie.",
    answers: ["Es geht darum, dass alle Energie sparen."],
    why: "gehen um → darum, dass. «Речь о том, что …».",
  },
  {
    a: "Wir hoffen darauf.",
    b: "Der Bau beginnt im Mai.",
    answers: ["Wir hoffen darauf, dass der Bau im Mai beginnt."],
    why: "hoffen auf → darauf, dass. Глагол beginnt уходит в конец придаточного.",
  },
  {
    a: "Sie sorgt dafür.",
    b: "Die Kinder schlafen genug.",
    answers: ["Sie sorgt dafür, dass die Kinder genug schlafen."],
    why: "sorgen für → dafür, dass. Классика коррелята: «позаботиться о том, чтобы …».",
  },
  {
    a: "Es besteht die Gefahr.",
    b: "Der Zug fällt aus.",
    answers: ["Es besteht die Gefahr, dass der Zug ausfällt."],
    why: "ausfallen — отделяемая приставка: в придаточном приставка встаёт в конец → ausfällt.",
  },
  {
    a: "Es hängt davon ab.",
    b: "Der Chef kommt morgen.",
    answers: ["Es hängt davon ab, ob der Chef morgen kommt."],
    why: "Зависит от ОТКРЫТОГО вопроса → ob, не dass: «hängt davon ab, ob er kommt». dass ставили бы для факта, который уже решён.",
  },
  {
    a: "Du musst damit rechnen.",
    b: "Es regnet am Samstag.",
    answers: ["Du musst damit rechnen, dass es am Samstag regnet."],
    why: "rechnen mit → damit, dass. «Считаться с тем, что …».",
  },
];

/* ============================================================================
   КАДРЫ: KONNEKTOREN (zumal · wobei · wenngleich)
   ----------------------------------------------------------------------------
   Как NEBENSATZ в data.ts: два реальных предложения и целое соединение
   в ответ. zumal/wobei — только постпозиция (препозиция искусственна,
   и кадр не учит редкому как равному); wenngleich — оба порядка,
   как у obwohl в OBWOHL.
   ========================================================================== */

type KonnFrame = { a: string; b: string; konn: "zumal" | "wobei" | "wenngleich"; answers: string[]; why: string };

export const KONN_FRAMES: KonnFrame[] = [
  /* --- zumal: усиливающая причина, только после главного ------------------- */
  {
    a: "Er kam spät.",
    b: "Der Zug hatte Verspätung.",
    konn: "zumal",
    answers: ["Er kam spät, zumal der Zug Verspätung hatte."],
    why: "zumal = «тем более что»: усиливающая причина. Ставится только после главного предложения.",
  },
  {
    a: "Wir machen das Wochenende frei.",
    b: "Das Wetter soll gut werden.",
    konn: "zumal",
    answers: ["Wir machen das Wochenende frei, zumal das Wetter gut werden soll."],
    why: "zumal — союз: глагол soll уходит в конец придаточного.",
  },
  {
    a: "Sie bleibt noch im Büro.",
    b: "Es ist noch viel Arbeit da.",
    konn: "zumal",
    answers: ["Sie bleibt noch im Büro, zumal noch viel Arbeit da ist."],
    why: "Причина усиливает решение: «тем более что работы ещё много».",
  },
  {
    a: "Der Plan ist riskant.",
    b: "Die Zeit ist knapp.",
    konn: "zumal",
    answers: ["Der Plan ist riskant, zumal die Zeit knapp ist."],
    why: "zumal после главного; глагол ist в конце придаточного.",
  },
  {
    a: "Ich frühstücke lieber zu Hause.",
    b: "Das Café in der Nähe ist teuer.",
    konn: "zumal",
    answers: ["Ich frühstücke lieber zu Hause, zumal das Café in der Nähe teuer ist."],
    why: "zumal объясняет решение и добавляет «тем более что».",
  },
  /* --- wobei: комментарий ко всему главному -------------------------------- */
  {
    a: "Der Aufenthalt hat mir gefallen.",
    b: "Das Hotel war etwas laut.",
    konn: "wobei",
    answers: ["Der Aufenthalt hat mir gefallen, wobei das Hotel etwas laut war."],
    why: "wobei — «при этом»: оговорка ко ВСЕМУ главному, а не к одному слову. Только после главного.",
  },
  {
    a: "Das Projekt war ein Erfolg.",
    b: "Die Kosten sind gestiegen.",
    konn: "wobei",
    answers: ["Das Projekt war ein Erfolg, wobei die Kosten gestiegen sind."],
    why: "wobei смягчает: успех — да, при этом расходы выросли.",
  },
  {
    a: "Er ist ein guter Lehrer.",
    b: "Er ist manchmal sehr streng.",
    konn: "wobei",
    answers: ["Er ist ein guter Lehrer, wobei er manchmal sehr streng ist."],
    why: "wobei добавляет оговорку, не отменяя главное.",
  },
  {
    a: "Die Wohnung ist günstig.",
    b: "Die Lage ist nicht ideal.",
    konn: "wobei",
    answers: ["Die Wohnung ist günstig, wobei die Lage nicht ideal ist."],
    why: "wobei — типовая конструкция объявления: плюс, «при этом» минус.",
  },
  {
    a: "Das Essen war ausgezeichnet.",
    b: "Beim Service musste man lange warten.",
    konn: "wobei",
    answers: ["Das Essen war ausgezeichnet, wobei man lange auf das Essen warten musste."],
    why: "wobei соединяет оценку и оговорку. В придаточном глагол в конце: warten musste. (Дословное «der Service hat lange gedauert» по-немецки не говорят — длится ожидание, а не сервис.)",
  },
  /* --- wenngleich: уступка, оба порядка ------------------------------------ */
  {
    a: "Sie hat die Stelle bekommen.",
    b: "Erfahrung fehlt ihr.",
    konn: "wenngleich",
    answers: [
      "Sie hat die Stelle bekommen, wenngleich ihr Erfahrung fehlt.",
      "Wenngleich ihr Erfahrung fehlt, hat sie die Stelle bekommen.",
    ],
    why: "wenngleich ≈ obwohl. Оба порядка верны: после главного или впереди — тогда главное начинается с глагола (hat).",
  },
  {
    a: "Wir sind früh losgefahren.",
    b: "Wir haben den Zug verpasst.",
    konn: "wenngleich",
    answers: [
      "Wir sind früh losgefahren, wenngleich wir den Zug verpasst haben.",
      "Wenngleich wir den Zug verpasst haben, sind wir früh losgefahren.",
    ],
    why: "Уступка: выехали рано, ХОТЯ поезд пропустили. wenngleich ведёт придаточное — глагол в конец.",
  },
  {
    a: "Die Wohnung ist klein.",
    b: "Sie gefällt mir.",
    konn: "wenngleich",
    answers: [
      "Die Wohnung ist klein, wenngleich sie mir gefällt.",
      "Wenngleich die Wohnung klein ist, gefällt sie mir.",
    ],
    why: "Во втором варианте главное начинается с глагола gefällt — придаточное заняло первое место.",
  },
  {
    a: "Er hilft gern.",
    b: "Er hat wenig Zeit.",
    konn: "wenngleich",
    answers: [
      "Er hilft gern, wenngleich er wenig Zeit hat.",
      "Wenngleich er wenig Zeit hat, hilft er gern.",
    ],
    why: "wenngleich = obwohl: смысл тот же, регистр чуть книжнее.",
  },
  {
    a: "Die Reise war teuer.",
    b: "Sie hat sich gelohnt.",
    konn: "wenngleich",
    answers: [
      "Die Reise war teuer, wenngleich sie sich gelohnt hat.",
      "Wenngleich die Reise teuer war, hat sie sich gelohnt.",
    ],
    why: "sich lohnen — возвратный глагол: sich остаётся при подлежащем sie.",
  },
];

/* ============================================================================
   ГЕНЕРАТОРЫ
   ========================================================================== */

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/* --- Konjunktiv I: живая форма или карточка «слово → {0}» ------------------- */

export function konjunktiv1(): Item {
  if (Math.random() < 0.5) {
    const f = pick(K1_FRAMES);
    return {
      topic: "c1-konjunktiv1-formen",
      task: "Indirekte Rede: поставь глагол в Konjunktiv I.",
      text: f.text,
      hint: f.hint,
      gaps: [f.a],
      why: f.why,
    };
  }
  const c = pick(K1_CARDS);
  return {
    topic: "c1-konjunktiv1-formen",
    task: "Konjunktiv I, 3. Person Singular: «Er sagte, er …».",
    text: `${c.inf} → {0}`,
    hint: `(Indikativ: er ${c.pr3})`,
    gaps: [[c.form]],
    why: `Konjunktiv I: ${c.inf} → er ${c.form}. ${c.why}`,
  };
}

/* --- es-Konstruktionen: коррелят / es / соединение -------------------------- */

export function esKonstruktionen(): Item {
  const r = Math.random();
  if (r < 0.45) {
    const f = pick(ES_CORR);
    return {
      topic: "c1-es-konstruktionen",
      task: "Setze das Korrelat ein (darauf, daran, darum …).",
      text: f.text,
      hint: `(${f.prep})`,
      gaps: [[f.a]],
      why: f.why,
    };
  }
  if (r < 0.7) {
    const f = pick(ES_HOLE);
    return {
      topic: "c1-es-konstruktionen",
      task: "Setze das unpersönliche «es» ein.",
      text: f.text,
      gaps: [[f.a]],
      why: f.why,
    };
  }
  const f = pick(ES_PAIR);
  return {
    topic: "c1-es-konstruktionen",
    task: "Verbinde die Sätze: Korrelat + dass/ob. Ответ — целое предложение.",
    text: `${f.a} / ${f.b}\n{0}`,
    gaps: [f.answers],
    why: f.why,
  };
}

/* --- Konnektoren C1: соединение двух предложений ---------------------------- */

export function konnektorenC1(): Item {
  const f = pick(KONN_FRAMES);
  const aufgabe =
    f.konn === "zumal"
      ? "Verbinde mit «zumal» (= «тем более что»). Придаточное — только после главного."
      : f.konn === "wobei"
        ? "Verbinde mit «wobei» (= «при этом»). Комментарий ко всему главному."
        : "Verbinde mit «wenngleich» (≈ obwohl). Принимаются оба порядка.";
  return {
    topic: "c1-konnektoren",
    task: aufgabe,
    text: `${f.a} / ${f.b}\n{0}`,
    hint: `(${f.konn})`,
    gaps: [f.answers],
    why: f.why,
  };
}
