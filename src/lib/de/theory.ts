/* ============================================================================
   ТЕОРИЯ
   ----------------------------------------------------------------------------
   Написана руками, не сгенерирована. Причина: правило, которое переписывается
   заново при каждом открытии темы, не может быть проверено, а ошибка в
   объяснении дороже ошибки в задаче — её человек запомнит.

   Формат двойной, и это не украшение:
     `regel` — по-немецки, потому что на экзамене формулировки немецкие
               («Ergänzen Sie das Verb im Perfekt») и термин надо узнавать;
     `ru`    — по-русски, потому что объяснять падежи немецким ученику
               с A2 — это учить язык через язык, которого ещё нет.

   `fehler` — не «будьте внимательны», а конкретные ошибки, которые делают
   русскоязычные: забыть ge-, поставить приставку не туда, перепутать
   Akkusativ и Dativ после helfen.
   ========================================================================== */

export type Theory = {
  regel: string;
  ru: string;
  tabelle?: { head: string[]; rows: string[][] };
  beispiele: { de: string; ru: string }[];
  fehler: string[];
  merk?: string;
};

import { THEORY_A1, THEORY_A2, THEORY_B1 } from "@/lib/de/theory2";
import { THEORY_B2C1 } from "@/lib/de/theory3";

/* Темы, на которых стоит экзамен, — они в этом файле.
   Остальное дерево разложено по theory2.ts (A1–B1) и theory3.ts (B2–C1),
   чтобы файл не превратился в тысячу строк, в которых ничего не найти. */
const BASE: Record<string, Theory> = {
  /* ------------------------------------------------------------- A1 ----- */
  "a1-sein-haben": {
    regel:
      "sein und haben sind die zwei wichtigsten Verben. Sie sind unregelmäßig und bilden auch das Perfekt. " +
      "sein steht bei Bewegung und Zustand, haben bei Besitz und bei den meisten Verben im Perfekt.",
    ru:
      "sein и haben — фундамент. Без них не строится ни Perfekt, ни Passiv, ни модальные конструкции. " +
      "Учить наизусть целиком, все шесть форм, до автоматизма.",
    tabelle: {
      head: ["Person", "sein", "haben"],
      rows: [
        ["ich", "bin", "habe"],
        ["du", "bist", "hast"],
        ["er / sie / es", "ist", "hat"],
        ["wir", "sind", "haben"],
        ["ihr", "seid", "habt"],
        ["sie / Sie", "sind", "haben"],
      ],
    },
    beispiele: [
      { de: "Ich bin müde.", ru: "Я устал. (состояние → sein)" },
      { de: "Ich habe einen Bruder.", ru: "У меня есть брат. (обладание → haben)" },
      { de: "Sie ist nach Berlin gefahren.", ru: "Она уехала в Берлин. (движение → sein в Perfekt)" },
    ],
    fehler: [
      "«Ich habe 20 Jahre» вместо «Ich bin 20 Jahre alt» — возраст через sein.",
      "«Ich bin Hunger» вместо «Ich habe Hunger» — голод это обладание.",
      "Забывают, что ihr → seid, а не «sind».",
    ],
    merk: "Возраст, профессия, состояние, происхождение → sein. Всё остальное → haben.",
  },

  "a1-praesens": {
    regel:
      "Regelmäßige Verben bekommen im Präsens die Endungen -e, -st, -t, -en, -t, -en. " +
      "Der Stamm bleibt gleich. Bei Verben mit Stamm auf -t oder -d kommt ein -e- dazu (du arbeitest).",
    ru:
      "Правильные глаголы: к основе прибавляется окончание по лицу. Если основа кончается на -t/-d, " +
      "между основой и окончанием появляется -e- (du arbeitest, er arbeitet) — иначе не выговорить.",
    tabelle: {
      head: ["Person", "machen", "arbeiten"],
      rows: [
        ["ich", "mache", "arbeite"],
        ["du", "machst", "arbeitest"],
        ["er / sie / es", "macht", "arbeitet"],
        ["wir", "machen", "arbeiten"],
        ["ihr", "macht", "arbeitet"],
        ["sie / Sie", "machen", "arbeiten"],
      ],
    },
    beispiele: [
      { de: "Ich lerne jeden Tag Deutsch.", ru: "Я учу немецкий каждый день." },
      { de: "Du arbeitest zu viel.", ru: "Ты слишком много работаешь. (основа arbeit- + -est)" },
      { de: "Sie wohnen in Kiel.", ru: "Они живут в Киле." },
    ],
    fehler: [
      "«du machst» → «du macht» — теряют -s во 2-м лице.",
      "«er arbeitet» → «er arbeit» — забывают -e- перед окончанием.",
      "ich и er/sie/es в 1-м спряжении совпадают только у сильных глаголов, у слабых различаются (mache / macht).",
    ],
    merk: "wir и sie всегда совпадают с инфинитивом. Это спасает, когда не помнишь форму.",
  },

  "a1-personalpronomen": {
    regel:
      "Personalpronomen haben drei Kasus: Nominativ (wer?), Akkusativ (wen?), Dativ (wem?). " +
      "Nach den meisten Verben steht der Akkusativ, nach helfen, danken, gehören, gefallen der Dativ.",
    ru:
      "Местоимения меняются по падежам. Akkusativ — «кого?», Dativ — «кому?». " +
      "Главная ловушка: helfen, danken, gehören, gefallen, passen требуют Dativ, хотя по-русски там винительный.",
    tabelle: {
      head: ["Nominativ", "Akkusativ", "Dativ"],
      rows: [
        ["ich", "mich", "mir"],
        ["du", "dich", "dir"],
        ["er", "ihn", "ihm"],
        ["sie", "sie", "ihr"],
        ["es", "es", "ihm"],
        ["wir", "uns", "uns"],
        ["ihr", "euch", "euch"],
        ["sie / Sie", "sie / Sie", "ihnen / Ihnen"],
      ],
    },
    beispiele: [
      { de: "Ich sehe ihn.", ru: "Я вижу его. (sehen + Akkusativ)" },
      { de: "Ich helfe ihm.", ru: "Я помогаю ему. (helfen + Dativ)" },
      { de: "Das Buch gehört ihr.", ru: "Книга принадлежит ей. (gehören + Dativ)" },
    ],
    fehler: [
      "«Ich helfe ihn» вместо «Ich helfe ihm» — helfen всегда Dativ.",
      "«mit mich» вместо «mit mir» — предлоги с Dativ требуют Dativ-форму.",
      "Путают sie (она) и sie (они) — различаются только глаголом.",
    ],
  },

  "a1-artikel-best": {
    regel:
      "Der bestimmte Artikel hat drei Genera: der, die, das, und einen Plural für alle: die. " +
      "Der Artikel ändert sich mit dem Kasus: der → den → dem → des.",
    ru:
      "Определённый артикль выражает род, число и падеж одновременно. Род надо учить вместе со словом: " +
      "не «Tisch», а «der Tisch». Без рода не будет ни артикля, ни местоимения, ни прилагательного.",
    tabelle: {
      head: ["Kasus", "maskulin", "feminin", "neutrum", "Plural"],
      rows: [
        ["Nominativ", "der", "die", "das", "die"],
        ["Akkusativ", "den", "die", "das", "die"],
        ["Dativ", "dem", "der", "dem", "den (+n)"],
        ["Genitiv", "des (+s)", "der", "des (+s)", "der"],
      ],
    },
    beispiele: [
      { de: "Der Tisch ist neu.", ru: "Стол новый. (Nominativ)" },
      { de: "Ich suche den Tisch.", ru: "Я ищу стол. (Akkusativ, мужской род меняется)" },
      { de: "Ich helfe dem Tisch nicht.", ru: "Здесь видно: в Dativ меняется всё, кроме женского и среднего в Nominativ." },
    ],
    fehler: [
      "Меняют артикль там, где не надо: в Akkusativ меняется ТОЛЬКО мужской род.",
      "Учат слово без артикля и потом угадывают род по русскому — совпадает примерно в половине случаев.",
      "Забывают +n в Dativ Plural: den Tischen, а не «den Tische».",
    ],
    merk: "В Akkusativ двигается только мужской род: der → den. Остальные три не меняются.",
  },

  "a1-akkusativ": {
    regel:
      "Den Akkusativ benutzt man nach den meisten Verben (sehen, suchen, kaufen, brauchen) " +
      "und nach den Präpositionen durch, für, gegen, ohne, um, bis, entlang.",
    ru:
      "Akkusativ — падеж прямого объекта. Меняется только мужской род: der → den, ein → einen. " +
      "Женский, средний и множественное число выглядят как в Nominativ — поэтому ошибку видно не всегда.",
    beispiele: [
      { de: "Ich kaufe einen Apfel.", ru: "Я покупаю яблоко. (der Apfel → einen Apfel)" },
      { de: "Wir brauchen eine Lampe.", ru: "Нам нужна лампа. (die Lampe → eine Lampe, не изменилось)" },
      { de: "Er sieht das Kind.", ru: "Он видит ребёнка. (das Kind → das Kind, не изменилось)" },
    ],
    fehler: [
      "Ставят den после sein: «Ich bin den Lehrer» — sein требует Nominativ.",
      "Забывают, что für всегда Akkusativ: «für der Vater» вместо «für den Vater».",
      "Путают с Dativ после предлогов вроде mit — mit всегда Dativ.",
    ],
    merk: "Видишь изменение артикля — значит мужской род. Не видишь — проверь по смыслу, а не по форме.",
  },

  "a1-dativ": {
    regel:
      "Den Dativ benutzt man nach den Verben helfen, danken, gehören, gefallen, passen, antworten, " +
      "nach den Präpositionen aus, bei, mit, nach, seit, von, zu und nach Wechselpräpositionen mit Ortsangabe.",
    ru:
      "Dativ — «кому?». Ключевые глаголы надо выучить списком, потому что логики нет: помогать и благодарить " +
      "по-русски требуют винительного, а по-немецки — дательного.",
    tabelle: {
      head: ["Genus", "Nominativ", "Dativ"],
      rows: [
        ["maskulin", "der / ein", "dem / einem"],
        ["feminin", "die / eine", "der / einer"],
        ["neutrum", "das / ein", "dem / einem"],
        ["Plural", "die", "den (+n)"],
      ],
    },
    beispiele: [
      { de: "Ich danke dem Lehrer.", ru: "Я благодарю учителя. (danken + Dativ)" },
      { de: "Sie hilft der Frau.", ru: "Она помогает женщине. (der = Dativ женского рода)" },
      { de: "Wir fahren mit dem Bus.", ru: "Мы едем на автобусе. (mit + Dativ)" },
    ],
    fehler: [
      "«Ich helfe den Lehrer» вместо «dem Lehrer» — самая частая ошибка русскоязычных.",
      "«mit der Bus» вместо «mit dem Bus» — mit всегда Dativ, род не меняется.",
      "Забывают +n в Dativ Plural: mit den Kindern, а не «mit den Kinder».",
    ],
    merk: "Список Dativ-глаголов: helfen, danken, gehören, gefallen, passen, antworten, folgen, gratulieren.",
  },

  "a1-modalverben": {
    regel:
      "Modalverben stehen auf Position 2, das Vollverb geht im Infinitiv ans Satzende. " +
      "In der 1. und 3. Person Singular gibt es keine Endung: ich kann, er kann.",
    ru:
      "Модальный глагол спрягается, смысловой уходит в конец в инфинитиве. " +
      "В 1-м и 3-м лице ед. числа модальный глагол не получает окончания — это его главная примета.",
    tabelle: {
      head: ["Person", "können", "müssen", "dürfen"],
      rows: [
        ["ich", "kann", "muss", "darf"],
        ["du", "kannst", "musst", "darfst"],
        ["er / sie / es", "kann", "muss", "darf"],
        ["wir", "können", "müssen", "dürfen"],
        ["ihr", "könnt", "müsst", "dürft"],
        ["sie / Sie", "können", "müssen", "dürfen"],
      ],
    },
    beispiele: [
      { de: "Ich kann heute nicht kommen.", ru: "Я не могу прийти сегодня. (kommen в конце)" },
      { de: "Du musst mehr lernen.", ru: "Ты должен больше учиться." },
      { de: "Darf ich hier rauchen?", ru: "Можно здесь курить? (dürfen = разрешение)" },
    ],
    fehler: [
      "«Ich kann komme» вместо «Ich kann kommen» — после модального только инфинитив.",
      "Ставят инфинитив на второе место: «Ich kann kommen heute» — нет, в конец.",
      "«ich könne» / «er kannt» — формы надо помнить, они не по правилу.",
    ],
    merk: "können — умею, müssen — должен по необходимости, dürfen — разрешено, sollen — велено, wollen — хочу.",
  },

  "a1-trennbare": {
    regel:
      "Trennbare Verben haben eine betonte Vorsilbe (ab-, an-, auf-, aus-, ein-, mit-, vor-, zu-, zurück-). " +
      "Im Präsens und Präteritum geht die Vorsilbe ans Satzende. Im Partizip II steht ge- zwischen Vorsilbe und Stamm.",
    ru:
      "Отделяемая приставка уходит в конец предложения, а в Perfekt — внутрь причастия: abholen → holt … ab, hat … abgeholt. " +
      "Неотделяемые (be-, ge-, er-, ver-, zer-, ent-, emp-, miss-) остаются на месте и не получают ge-.",
    tabelle: {
      head: ["Infinitiv", "Präsens (er)", "Perfekt"],
      rows: [
        ["abholen", "holt … ab", "hat … abgeholt"],
        ["aufräumen", "räumt … auf", "hat … aufgeräumt"],
        ["anrufen", "ruft … an", "hat … angerufen"],
        ["besuchen", "besucht", "hat … besucht"],
        ["verstehen", "versteht", "hat … verstanden"],
        ["erklären", "erklärt", "hat … erklärt"],
      ],
    },
    beispiele: [
      { de: "Ich hole dich um acht ab.", ru: "Я заберу тебя в восемь. (ab в конце)" },
      { de: "Ich habe dich um acht abgeholt.", ru: "Perfekt: ab + ge + holt." },
      { de: "Der Lehrer erklärt die Aufgabe.", ru: "erklären неотделяемый — ничего не уходит в конец." },
    ],
    fehler: [
      "«Ich abhole dich» — приставка не может стоять в начале.",
      "«Ich habe dich abgeholt» → «Ich habe dich geabholt» — ge- идёт ПОСЛЕ приставки.",
      "«Ich habe ihn besucht» → «Ich habe ihn gebesucht» — неотделяемые не получают ge-.",
    ],
    merk: "Проверка: если приставка несёт ударение (ÁBholen) — отделяется. Если нет (besÚchen) — нет.",
  },

  /* ------------------------------------------------------------- A2 ----- */
  "a2-partizip": {
    regel:
      "Das Partizip II schwacher Verben: ge- + Stamm + -t (machen → gemacht). " +
      "Starker Verben: ge- + oft veränderter Stamm + -en (sprechen → gesprochen). " +
      "Verben mit be-, ge-, er-, ver-, zer-, ent-, emp-, miss- bekommen kein ge-.",
    ru:
      "Причастие прошедшего времени — третья форма глагола, по ней строится Perfekt. " +
      "Слабые: ge…t. Сильные: ge…en, и гласная часто меняется. Неотделяемые приставки съедают ge-.",
    tabelle: {
      head: ["Typ", "Infinitiv", "Partizip II"],
      rows: [
        ["schwach", "machen", "gemacht"],
        ["schwach (Stamm auf -t)", "arbeiten", "gearbeitet"],
        ["stark", "sprechen", "gesprochen"],
        ["stark", "gehen", "gegangen"],
        ["untrennbar", "besuchen", "besucht"],
        ["trennbar", "abholen", "abgeholt"],
        ["auf -ieren", "studieren", "studiert"],
      ],
    },
    beispiele: [
      { de: "Ich habe gearbeitet.", ru: "arbeiten → gearbeitet (основа на -t, добавляется -e-)." },
      { de: "Wir haben gesprochen.", ru: "sprechen → gesprochen (сильный, меняется гласная)." },
      { de: "Sie hat studiert.", ru: "Глаголы на -ieren НЕ получают ge-." },
    ],
    fehler: [
      "«gestudiert» вместо «studiert» — на -ieren всегда без ge-.",
      "«gebessucht» вместо «besucht» — неотделяемая приставка не терпит ge-.",
      "«geabholt» вместо «abgeholt» — у отделяемых ge- внутри.",
    ],
    merk: "Нет ge- в трёх случаях: неотделяемая приставка, -ieren, и отделяемая приставка (там ge- внутри).",
  },

  "a2-perfekt": {
    regel:
      "Das Perfekt bildet man mit haben oder sein im Präsens + Partizip II am Satzende. " +
      "sein steht bei Verben der Bewegung von A nach B und bei Zustandsänderungen (gehen, kommen, fahren, aufstehen, werden, bleiben). " +
      "Alle anderen nehmen haben.",
    ru:
      "Perfekt — прошедшее время для речи. Вспомогательный глагол на втором месте, причастие в конце. " +
      "sein берут глаголы движения и смены состояния, haben — все остальные, включая все переходные.",
    tabelle: {
      head: ["Verb", "Hilfsverb", "Perfekt (er)"],
      rows: [
        ["kochen", "haben", "hat gekocht"],
        ["machen", "haben", "hat gemacht"],
        ["gehen", "sein", "ist gegangen"],
        ["fahren", "sein", "ist gefahren"],
        ["aufstehen", "sein", "ist aufgestanden"],
        ["bleiben", "sein", "ist geblieben"],
        ["passieren", "sein", "ist passiert"],
      ],
    },
    beispiele: [
      { de: "Ich habe keinen Kaffee gekocht.", ru: "Я не варил кофе. (haben + gekocht)" },
      { de: "Er ist mit dem Flugzeug geflogen.", ru: "Он летал самолётом. (движение → sein)" },
      { de: "Was hast du gerade gegessen?", ru: "Что ты только что съел?" },
    ],
    fehler: [
      "«Ich bin Kaffee gekocht» — kochen не движение, нужен haben.",
      "«Ich habe nach Berlin gefahren» — fahren von A nach B требует sein.",
      "Ставят причастие на второе место: «Ich habe gekocht den Kaffee» — причастие всегда в конце.",
    ],
    merk: "Движение А→Б и смена состояния → sein. Всё остальное → haben. bleiben и passieren — тоже sein, хотя не движение.",
  },

  "a2-komparativ": {
    regel:
      "Der Komparativ endet auf -er, der Superlativ auf -sten (am schnellsten). " +
      "Kurze Adjektive mit a, o, u bekommen einen Umlaut: alt → älter, groß → größer, jung → jünger.",
    ru:
      "Сравнительная степень: -er, превосходная: am …-sten. У коротких прилагательных с a/o/u появляется умлаут. " +
      "Сравнение оформляется через als (чем): schneller als.",
    tabelle: {
      head: ["Positiv", "Komparativ", "Superlativ"],
      rows: [
        ["schnell", "schneller", "am schnellsten"],
        ["alt", "älter", "am ältesten"],
        ["groß", "größer", "am größten"],
        ["gut", "besser", "am besten"],
        ["viel", "mehr", "am meisten"],
        ["gern", "lieber", "am liebsten"],
        ["hoch", "höher", "am höchsten"],
      ],
    },
    beispiele: [
      { de: "Der Zug ist schneller als der Bus.", ru: "Поезд быстрее автобуса. (als = чем)" },
      { de: "Sie ist die beste Studentin.", ru: "Она лучшая студентка. (перед существительным — с артиклем)" },
      { de: "Ich trinke lieber Tee.", ru: "Я предпочитаю чай. (gern → lieber)" },
    ],
    fehler: [
      "«besser wie» вместо «besser als» — сравнение только через als.",
      "«am meistens» вместо «am meisten».",
      "Двойное сравнение: «mehr schneller» — нельзя, -er уже есть.",
    ],
    merk: "gut / viel / gern — три неправильных, их спрашивают чаще всего.",
  },

  "a2-adjektiv-best": {
    regel:
      "Nach dem bestimmten Artikel hat das Adjektiv die schwache Endung: -e im Nominativ Singular " +
      "und im Akkusativ feminin/neutrum, sonst -en.",
    ru:
      "После определённого артикля прилагательное почти всегда получает -en. Исключение — пять форм с -e. " +
      "Логика: артикль уже несёт информацию о роде и падеже, прилагательному остаётся только «согласоваться».",
    tabelle: {
      head: ["Kasus", "maskulin", "feminin", "neutrum", "Plural"],
      rows: [
        ["Nominativ", "der gute", "die gute", "das gute", "die guten"],
        ["Akkusativ", "den guten", "die gute", "das gute", "die guten"],
        ["Dativ", "dem guten", "der guten", "dem guten", "den guten"],
        ["Genitiv", "des guten", "der guten", "des guten", "der guten"],
      ],
    },
    beispiele: [
      { de: "Der neue Tisch ist teuer.", ru: "Nominativ мужской → -e." },
      { de: "Ich kaufe den neuen Tisch.", ru: "Akkusativ мужской → -en." },
      { de: "Ich fahre mit dem neuen Auto.", ru: "Dativ → -en." },
    ],
    fehler: [
      "«der neue Tisch» верно, но «den neue Tisch» — в Akkusativ мужской всегда -en.",
      "«mit dem neue Auto» вместо «neuen» — в Dativ всегда -en.",
      "Забывают -n в Plural Dativ: «mit den neue Autos» → «mit den neuen Autos».",
    ],
    merk: "После der/die/das: -e только в пяти случаях (Nom. Sg. все три рода, Akk. Sg. ж. и ср.). Всё остальное -en.",
  },

  "a2-adjektiv-null": {
    regel:
      "Ohne Artikel trägt das Adjektiv die starke Endung und übernimmt die Funktion des Artikels: " +
      "guter Wein, gute Suppe, gutes Brot, gute Weine.",
    ru:
      "Если артикля нет, прилагательное само показывает род и падеж — окончание совпадает с формой " +
      "определённого артикля (der → -er, die → -e, das → -es).",
    tabelle: {
      head: ["Kasus", "maskulin", "feminin", "neutrum", "Plural"],
      rows: [
        ["Nominativ", "guter", "gute", "gutes", "gute"],
        ["Akkusativ", "guten", "gute", "gutes", "gute"],
        ["Dativ", "gutem", "guter", "gutem", "guten"],
        ["Genitiv", "guten", "guter", "guten", "guter"],
      ],
    },
    beispiele: [
      { de: "Ich trinke kalten Tee.", ru: "Akkusativ мужской без артикля → -en." },
      { de: "Das ist frisches Brot.", ru: "Nominativ средний → -es." },
      { de: "Mit heißem Wasser.", ru: "Dativ средний → -em." },
    ],
    fehler: [
      "«Ich trinke kalte Tee» — в Akkusativ мужской нужно -en, иначе не видно падежа.",
      "Смешивают со слабым склонением: без артикля окончания ДРУГИЕ.",
      "Ставят -e везде, потому что «так короче».",
    ],
    merk: "Без артикля прилагательное работает как артикль: -er / -e / -es в Nominativ.",
  },

  /* ------------------------------------------------------------- B1 ----- */
  "b1-relativsatz": {
    regel:
      "Das Relativpronomen richtet sich in Genus und Numerus nach dem Bezugswort, " +
      "aber im Kasus nach seiner Funktion im Relativsatz. Das konjugierte Verb steht am Ende.",
    ru:
      "Ключевое правило: род и число — от определяемого слова, падеж — от роли в придаточном. " +
      "Именно поэтому «der Parkplatz, der …» (подлежащее), но «den Anzug, den ich gesehen habe» (дополнение).",
    tabelle: {
      head: ["Kasus", "maskulin", "feminin", "neutrum", "Plural"],
      rows: [
        ["Nominativ", "der", "die", "das", "die"],
        ["Akkusativ", "den", "die", "das", "die"],
        ["Dativ", "dem", "der", "dem", "denen"],
        ["Genitiv", "dessen", "deren", "dessen", "deren"],
      ],
    },
    beispiele: [
      { de: "Er möchte einen Parkplatz, der vor seiner Haustür ist.", ru: "Parkplatz — подлежащее в придаточном → Nominativ der." },
      { de: "Ich suche den Anzug, den ich im Katalog gesehen habe.", ru: "Anzug — дополнение (sehen + Akk) → den." },
      { de: "Die Nachbarn, denen wir geholfen haben, sind umgezogen.", ru: "helfen + Dativ, Plural → denen." },
    ],
    fehler: [
      "Берут падеж от главного предложения: «den Anzug, der ich gesehen habe» — неверно.",
      "Путают deren и denen: denen — Dativ, deren — Genitiv (чей).",
      "Забывают, что глагол в придаточном уходит в конец.",
    ],
    merk: "Два вопроса по порядку: (1) какого рода слово? (2) какую роль оно играет В ПРИДАТОЧНОМ?",
  },

  "b1-konj-wenn-bevor": {
    regel:
      "In Nebensätzen mit wenn, bevor, seitdem, während, weil, obwohl, dass steht das konjugierte Verb am Ende. " +
      "Steht der Nebensatz vorn, beginnt der Hauptsatz mit dem Verb.",
    ru:
      "Придаточное с союзом — глагол в конце. Если придаточное стоит первым, главное начинается с глагола " +
      "(потому что придаточное занимает первое место). Это задание 3.4 экзамена — 10 баллов.",
    beispiele: [
      { de: "Man kann überall fernsehen, seitdem es Internet gibt.", ru: "Придаточное после главного: gibt в конце." },
      { de: "Seitdem es Internet gibt, kann man überall fernsehen.", ru: "Придаточное впереди: главное начинается с kann." },
      { de: "Ich bereite das Abendessen vor, bevor das Spiel anfängt.", ru: "bevor = до того как; глагол в конце." },
    ],
    fehler: [
      "«…, seitdem es gibt Internet» — глагол обязан быть в конце.",
      "«Seitdem es Internet gibt, man kann …» — после придаточного главное начинается с глагола.",
      "Путают wenn (каждый раз / если) и als (один раз в прошлом).",
    ],
    merk: "Союз → глагол в конец. Придаточное первым → главное начинается с глагола. Запятая между ними всегда.",
  },

  "a2-gegenteil": {
    regel:
      "Das Gegenteil eines Adjektivs ist oft ein anderes Adjektiv, nicht eine Negation: " +
      "gut → schlecht, schnell → langsam, hell → dunkel. «Nicht gut» und «ungut» sind keine Antwort.",
    ru:
      "В задании 4.2 нельзя писать «nicht ruhig» или «unruhig» — нужен самостоятельный антоним. " +
      "Это проверка словарного запаса, а не логики.",
    beispiele: [
      { de: "ruhig → laut", ru: "не «unruhig» и не «nicht ruhig»." },
      { de: "fleißig → faul", ru: "пара, которую надо знать наизусть." },
      { de: "hoch → tief / niedrig", ru: "оба варианта верны, зависит от контекста." },
    ],
    fehler: [
      "Пишут «un-» + слово — в образце это прямо запрещено.",
      "Пишут «nicht …» — тоже запрещено.",
      "Дают существительное вместо прилагательного.",
    ],
    merk: "Спрашивают прилагательное → отвечай прилагательным, без un- и без nicht.",
  },
};

export const THEORY: Record<string, Theory> = {
  ...BASE,
  ...THEORY_A1,
  ...THEORY_A2,
  ...THEORY_B1,
  ...THEORY_B2C1,
};

export const hasTheory = (id: string): boolean => id in THEORY;
