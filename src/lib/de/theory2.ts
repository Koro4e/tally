/* ============================================================================
   ТЕОРИЯ — ВТОРАЯ ЧАСТЬ: A1, A2, B1
   ----------------------------------------------------------------------------
   Дополнение к `theory.ts`. Разделено по файлам не ради красоты: первый файл
   — это те темы, на которых стоит экзамен, и его читают чаще. Здесь лежит
   остальное дерево до B1 включительно.

   Правило написания то же: сначала немецкая формулировка (её надо узнавать на
   экзамене), потом русское объяснение (на нём думает ученик), потом таблица,
   примеры и конкретные ошибки русскоязычных.
   ========================================================================== */

import type { Theory } from "@/lib/de/theory";

export const THEORY_A1: Record<string, Theory> = {
  /* ------------------------------------------------------------- A1 ----- */
  "a1-wortstellung": {
    regel:
      "Im Aussagesatz steht das konjugierte Verb auf Position 2. Position 1 kann ein Subjekt, " +
      "eine Zeitangabe oder ein Ort sein — das Verb bleibt trotzdem an zweiter Stelle. " +
      "Wenn Position 1 nicht das Subjekt ist, rutscht das Subjekt hinter das Verb (Inversion).",
    ru:
      "Немецкое предложение держится на одном правиле: спрягаемый глагол всегда второй. " +
      "Первым может быть что угодно — время, место, объект. Если первым стоит не подлежащее, " +
      "подлежащее переезжает сразу за глагол. Это не стиль, это каркас: сбился — предложение рассыпалось.",
    tabelle: {
      head: ["1", "2 (Verb)", "3", "4"],
      rows: [
        ["Ich", "fahre", "morgen", "nach Kiel."],
        ["Morgen", "fahre", "ich", "nach Kiel."],
        ["Nach Kiel", "fahre", "ich", "morgen."],
        ["Mein Bruder", "arbeitet", "seit Mai", "in Hamburg."],
      ],
    },
    beispiele: [
      { de: "Heute habe ich keine Zeit.", ru: "Сегодня у меня нет времени. (heute на 1 → habe на 2 → ich на 3)" },
      { de: "Um acht Uhr beginnt der Unterricht.", ru: "В восемь начинается занятие." },
      { de: "In Kiel wohnt meine Schwester.", ru: "В Киле живёт моя сестра." },
    ],
    fehler: [
      "«Heute ich habe keine Zeit» — подлежащее осталось сразу за временем, глагол уехал на третье место.",
      "Ставят в конец второй глагол в спрягаемой форме: «Ich muss heute arbeiten gehen» верно, «Ich muss heute gehen arbeiten» — нет.",
      "Забывают инверсию после weil-придаточного: «Weil es regnet, ich bleibe zu Hause» → «…, bleibe ich zu Hause».",
    ],
    merk: "Позиция 1 — любая. Позиция 2 — всегда глагол. Всё остальное подстраивается.",
  },

  "a1-artikel-unbest": {
    regel:
      "Der unbestimmte Artikel heißt ein (maskulin/neutrum) und eine (feminin). " +
      "Die Negation davon ist kein/keine — sie wird genauso dekliniert wie ein/eine. " +
      "Im Plural gibt es keinen unbestimmten Artikel: «Ich habe Bücher».",
    ru:
      "ein/eine — «один, какой-то», про который слушатель ещё не знает. Отрицание — kein/keine, " +
      "и оно склоняется ровно как ein: в Akkusativ мужской род даёт keinen, средний и женский не меняются. " +
      "Во множественном числе kein имеет формы keine (Nom/Akk) и keinen (Dativ).",
    tabelle: {
      head: ["", "maskulin", "feminin", "neutrum", "Plural"],
      rows: [
        ["Nominativ", "ein", "eine", "ein", "—"],
        ["Akkusativ", "einen", "eine", "ein", "—"],
        ["Dativ", "einem", "einer", "einem", "—"],
        ["Negation Akk.", "keinen", "keine", "kein", "keine"],
      ],
    },
    beispiele: [
      { de: "Das ist ein Tisch.", ru: "Это стол. (первое упоминание)" },
      { de: "Der Tisch ist alt.", ru: "Стол старый. (уже знаем, о каком речь → der)" },
      { de: "Ich habe keinen Hund.", ru: "У меня нет собаки. (Akkusativ, мужской род → keinen)" },
    ],
    fehler: [
      "«Ich habe nicht Hund» вместо «Ich habe keinen Hund» — существительное отрицается через kein.",
      "«ein Auto» в Dativ пишут «ein Auto» вместо «einem Auto».",
      "Ставят ein во множественном числе: «Ich habe ein Bücher».",
    ],
    merk: "ein → kein. Одна таблица на оба слова, окончания совпадают полностью.",
  },

  "a1-negation": {
    regel:
      "nicht negiert den ganzen Satz, ein Verb, ein Adjektiv oder einen bestimmten Artikel. " +
      "kein/keine negiert ein Substantiv mit unbestimmtem Artikel oder ohne Artikel. " +
      "nicht steht möglichst weit hinten, aber vor Infinitiv, Partizip und präpositionaler Ergänzung.",
    ru:
      "Выбор между nicht и kein — не вкус, а арифметика. Есть ein или нет артикля вообще → kein. " +
      "Есть der/die/das, притяжательное или имя → nicht. Глагол, прилагательное, наречие → всегда nicht.",
    beispiele: [
      { de: "Ich habe keine Zeit.", ru: "У меня нет времени. (Zeit без артикля → kein)" },
      { de: "Ich habe die Zeit nicht.", ru: "У меня нет (этого) времени. (die → nicht)" },
      { de: "Er kommt heute nicht.", ru: "Он сегодня не придёт. (глагол → nicht)" },
      { de: "Das ist nicht mein Buch.", ru: "Это не моя книга. (притяжательное → nicht)" },
    ],
    fehler: [
      "«Ich verstehe nicht das Wort» — по-немецки естественнее «Ich verstehe das Wort nicht»: nicht идёт в конец.",
      "«nicht Zeit» вместо «keine Zeit».",
      "Двойное отрицание: «Ich habe nicht keine Zeit» — в немецком, в отличие от русского, его нет.",
    ],
    merk: "Спорь с собой: «есть ли ein?» Есть → kein. Нет, но есть der/mein/имя → nicht.",
  },

  "a1-fragen": {
    regel:
      "Ja/Nein-Frage: das Verb steht auf Position 1, das Subjekt folgt. " +
      "W-Frage: das Fragewort steht auf Position 1, das Verb auf Position 2. " +
      "Fragewörter: wer, was, wo, wann, warum, wie, woher, wohin, wie viel, welcher.",
    ru:
      "Два разных механизма. Да/нет-вопрос — глагол вперёд, на первое место: «Kommst du?». " +
      "Вопрос со словом — слово первое, глагол второй: «Wann kommst du?». Ошибка почти всегда одна: " +
      "ставят глагол первым и после вопросительного слова («Wann kommst du?» vs «Wann du kommst?»).",
    tabelle: {
      head: ["Тип", "1", "2", "3"],
      rows: [
        ["Ja/Nein", "Kommst", "du", "morgen?"],
        ["W-Frage", "Wann", "kommst", "du?"],
        ["W-Frage", "Woher", "kommst", "du?"],
        ["mit Modalverb", "Kannst", "du", "kommen?"],
      ],
    },
    beispiele: [
      { de: "Wohnst du in Kiel?", ru: "Ты живёшь в Киле?" },
      { de: "Wo wohnst du?", ru: "Где ты живёшь?" },
      { de: "Wie heißt du?", ru: "Как тебя зовут?" },
    ],
    fehler: [
      "«Wo du wohnst?» — это уже придаточное, а не вопрос. В прямом вопросе глагол второй.",
      "«Was du machst?» вместо «Was machst du?».",
      "Путают woher (откуда) и wohin (куда): «Woher gehst du?» — неверно, если речь о направлении.",
    ],
    merk: "Вопрос без вопросительного слова = глагол на первом месте. С ним = глагол на втором.",
  },

  "a1-imperativ": {
    regel:
      "Imperativ du: Verbstamm ohne -st (Mach!), bei Stamm auf -t/-d mit -e (Arbeite!). " +
      "Imperativ ihr: die ihr-Form ohne Pronomen (Macht!). Imperativ Sie: Infinitiv + Sie (Machen Sie!). " +
      "Trennbare Verben trennen auch im Imperativ: Steh auf!",
    ru:
      "Три формы, и все три нужны. На «ты» глагол теряет -st и остаётся голой основой; " +
      "у сильных глаголов с умлаутом умлаут уходит (fahren → Fahr!, но essen → Iss!). " +
      "На «вы» (мн. ч.) — форма ihr без местоимения. На «Вы» — инфинитив + Sie, и Sie обязательно.",
    tabelle: {
      head: ["", "machen", "fahren", "sein", "aufstehen"],
      rows: [
        ["du", "Mach!", "Fahr!", "Sei!", "Steh auf!"],
        ["ihr", "Macht!", "Fahrt!", "Seid!", "Steht auf!"],
        ["Sie", "Machen Sie!", "Fahren Sie!", "Seien Sie!", "Stehen Sie auf!"],
      ],
    },
    beispiele: [
      { de: "Mach die Tür zu!", ru: "Закрой дверь!" },
      { de: "Seid bitte pünktlich!", ru: "Будьте, пожалуйста, пунктуальны!" },
      { de: "Nehmen Sie Platz!", ru: "Присаживайтесь!" },
    ],
    fehler: [
      "«Fahrst!» — окончание -st в императиве на du не остаётся.",
      "«Machen!» вместо «Machen Sie!» — без Sie форма не читается как вежливая.",
      "«Sein Sie» вместо «Seien Sie» — sein в императиве особый.",
    ],
    merk: "du: без -st. ihr: без местоимения. Sie: инфинитив + Sie, и Sie не забыть.",
  },

  "a1-possessiv": {
    regel:
      "Possessivartikel: mein, dein, sein, ihr, unser, euer, ihr/Ihr. " +
      "Sie bekommen im Singular dieselben Endungen wie ein/eine: mein Vater, meine Mutter, mein Kind; " +
      "im Akkusativ maskulin meinen. Im Plural wie keine: meine, deine …",
    ru:
      "Притяжательные — это ein с добавленной основой. Род и падеж показывает окончание, " +
      "а не основа. Засада одна: euer теряет -e- перед окончанием (euer Vater → eure Mutter, euren Vater). " +
      "И вторая: sein = его, ihr = её, Ihr = Ваш. Три разных человека, одно окончание.",
    tabelle: {
      head: ["кто", "maskulin", "feminin", "neutrum", "Plural"],
      rows: [
        ["ich", "mein", "meine", "mein", "meine"],
        ["du", "dein", "deine", "dein", "deine"],
        ["er/es", "sein", "seine", "sein", "seine"],
        ["sie", "ihr", "ihre", "ihr", "ihre"],
        ["wir", "unser", "unsere", "unser", "unsere"],
        ["ihr", "euer", "eure", "euer", "eure"],
      ],
    },
    beispiele: [
      { de: "Das ist mein Bruder.", ru: "Это мой брат." },
      { de: "Ich suche meinen Schlüssel.", ru: "Я ищу свой ключ. (Akkusativ, мужской род)" },
      { de: "Wie heißt eure Lehrerin?", ru: "Как зовут вашу учительницу? (euer → eure)" },
    ],
    fehler: [
      "«euer Lehrerin» вместо «eure Lehrerin» — -e- выпадает.",
      "«Ich liebe mein Mutter» вместо «meine Mutter».",
      "Путают ihr (её) и ihr (их) и Ihr (Ваш) — смысл меняется полностью, форма нет.",
    ],
    merk: "Основа показывает владельца, окончание — род и падеж. euer — единственное с выпадением.",
  },
};

export const THEORY_A2: Record<string, Theory> = {
  /* ------------------------------------------------------------- A2 ----- */
  "a2-praeteritum": {
    regel:
      "Das Präteritum ist die Erzählzeit der Schrift. Schwache Verben: Stamm + -te (machte, arbeitete). " +
      "Starke Verben ändern den Stamm und bekommen keine Endung in der 1./3. Person (ging, sah, kam). " +
      "sein, haben und die Modalverben stehen auch in der gesprochenen Sprache im Präteritum.",
    ru:
      "Претерит — время письменного рассказа. В речи им почти не пользуются, но в текстах " +
      "(и в Leseverstehen экзамена) он везде. Слабые глаголы: основа + te. Сильные меняют гласную " +
      "и в 1-м и 3-м лице ед. числа не имеют окончания вообще: ich ging, er ging.",
    tabelle: {
      head: ["", "machen", "arbeiten", "gehen", "sein", "haben"],
      rows: [
        ["ich", "machte", "arbeitete", "ging", "war", "hatte"],
        ["du", "machtest", "arbeitetest", "gingst", "warst", "hattest"],
        ["er / sie / es", "machte", "arbeitete", "ging", "war", "hatte"],
        ["wir", "machten", "arbeiteten", "gingen", "waren", "hatten"],
        ["ihr", "machtet", "arbeitetet", "gingt", "wart", "hattet"],
        ["sie / Sie", "machten", "arbeiteten", "gingen", "waren", "hatten"],
      ],
    },
    beispiele: [
      { de: "Gestern ging ich früh ins Bett.", ru: "Вчера я рано лёг спать." },
      { de: "Er hatte keine Zeit.", ru: "У него не было времени." },
      { de: "Wir machten die Aufgabe zusammen.", ru: "Мы делали задание вместе." },
    ],
    fehler: [
      "«Er gehte» вместо «Er ging» — сильный глагол не получает -te.",
      "«Ich bin war» — смешивают Perfekt и Präteritum в одной форме.",
      "Забывают -e- у глаголов на -t/-d: «ich arbaitte» вместо «ich arbeitete».",
    ],
    merk: "Слабый: +te. Сильный: другая гласная, без окончания в 1./3. лице. sein/haben — наизусть.",
  },

  "a2-konnektoren": {
    regel:
      "und, aber, oder, denn, sondern verbinden zwei Hauptsätze und ändern die Wortstellung nicht: " +
      "Position 2 bleibt Position 2. deshalb, darum, trotzdem sind Adverbien — nach ihnen kommt das Verb " +
      "sofort, also Inversion.",
    ru:
      "Две группы, и их постоянно путают. und/aber/oder/denn/sondern — сочинительные союзы, " +
      "позиция 0: после них порядок слов как был. deshalb/darum/trotzdem — наречия, они занимают первое место " +
      "и выбивают подлежащее на третье.",
    tabelle: {
      head: ["союз", "тип", "порядок слов", "пример"],
      rows: [
        ["und", "сочинит.", "без изменений", "Ich lerne und er arbeitet."],
        ["aber", "сочинит.", "без изменений", "Ich komme, aber ich bin spät."],
        ["denn", "сочинит.", "без изменений", "Ich bleibe, denn es regnet."],
        ["deshalb", "наречие", "инверсия", "Es regnet, deshalb bleibe ich."],
        ["trotzdem", "наречие", "инверсия", "Es regnet, trotzdem gehe ich."],
      ],
    },
    beispiele: [
      { de: "Ich habe keine Zeit, denn ich arbeite heute.", ru: "У меня нет времени, потому что я сегодня работаю." },
      { de: "Ich arbeite heute, deshalb habe ich keine Zeit.", ru: "Я сегодня работаю, поэтому у меня нет времени." },
    ],
    fehler: [
      "«deshalb ich habe keine Zeit» — после deshalb глагол должен идти сразу.",
      "«denn» ставят как придаточное и уводят глагол в конец: «denn ich heute arbeite» — неверно.",
      "sondern вместо aber: sondern только после отрицания («nicht …, sondern …»).",
    ],
    merk: "denn — союз (порядок цел). deshalb/trotzdem — наречия (глагол вперёд).",
  },

  "a2-nebensatz-ob": {
    regel:
      "ob leitet einen indirekten Ja/Nein-Frage ein. Das Verb steht am Ende. " +
      "Bei W-Fragen bleibt das Fragewort: «Ich weiß nicht, wo er wohnt». " +
      "Bei Fragen ohne Fragewort wird daraus ob: «Ich weiß nicht, ob er kommt».",
    ru:
      "Косвенный вопрос — это пересказ вопроса, а не сам вопрос. Поэтому в нём нет ни инверсии, " +
      "ни вопросительного знака: глагол уходит в конец, как в любом придаточном. " +
      "Если в прямом вопросе не было вопросительного слова, в косвенном появляется ob.",
    tabelle: {
      head: ["прямой вопрос", "косвенный"],
      rows: [
        ["Kommt er?", "Ich weiß nicht, ob er kommt."],
        ["Wo wohnt er?", "Ich weiß nicht, wo er wohnt."],
        ["Hat sie Zeit?", "Sie fragt, ob ich Zeit habe."],
      ],
    },
    beispiele: [
      { de: "Ich weiß nicht, ob das stimmt.", ru: "Я не знаю, правда ли это." },
      { de: "Er fragt, ob ich mitkomme.", ru: "Он спрашивает, иду ли я с ним." },
    ],
    fehler: [
      "«Ich weiß nicht, ob kommt er» — глагол остался вторым.",
      "Ставят «wenn» вместо «ob»: wenn — это «когда/если», ob — «ли».",
      "Ставят вопросительный знак в конце косвенного вопроса.",
    ],
    merk: "ob = «ли». Глагол в конец. Знак вопроса не ставится.",
  },

  "a2-reflexiv": {
    regel:
      "Reflexive Verben bekommen ein Reflexivpronomen: mich, dich, sich, uns, euch, sich (Akkusativ) " +
      "oder mir, dir, sich, uns, euch, sich (Dativ). Dativ steht, wenn schon ein Akkusativobjekt da ist: " +
      "«Ich wasche mir die Hände».",
    ru:
      "Возвратный глагол тащит за собой местоимение, которое повторяет подлежащее. " +
      "Аккузатив — по умолчанию. Датив — когда в предложении уже есть прямое дополнение, " +
      "иначе два аккузатива не уживаются.",
    tabelle: {
      head: ["Person", "Akkusativ", "Dativ"],
      rows: [
        ["ich", "mich", "mir"],
        ["du", "dich", "dir"],
        ["er/sie/es", "sich", "sich"],
        ["wir", "uns", "uns"],
        ["ihr", "euch", "euch"],
        ["sie/Sie", "sich", "sich"],
      ],
    },
    beispiele: [
      { de: "Ich freue mich auf das Wochenende.", ru: "Я радуюсь выходным." },
      { de: "Er interessiert sich für Physik.", ru: "Он интересуется физикой." },
      { de: "Ich putze mir die Zähne.", ru: "Я чищу себе зубы. (Dativ: die Zähne уже Akkusativ)" },
    ],
    fehler: [
      "«Ich freue mich auf» без предлога в конце — глагол требует auf + Akkusativ.",
      "«Ich wasche mich die Hände» — два аккузатива, нужно mir.",
      "Забывают, что sich в 3-м лице не меняется: «er freut ihm» — неверно.",
    ],
    merk: "Есть Akkusativ-объект → возвратное в Dativ. Нет → в Akkusativ.",
  },

  "a2-praepositionen": {
    regel:
      "Feste Präpositionen regieren einen festen Kasus: aus, bei, mit, nach, seit, von, zu → Dativ; " +
      "durch, für, gegen, ohne, um → Akkusativ. Diese Liste muss man auswendig können, " +
      "sie ändert sich nie.",
    ru:
      "Предлоги делятся на три лагеря: только Dativ, только Akkusativ и те, что меняются (о них отдельная тема). " +
      "Первые два лагеря — чистое запоминание, и это самый выгодный список в языке: " +
      "выучил одиннадцать слов — перестал ошибаться в половине предложений.",
    tabelle: {
      head: ["Dativ", "Akkusativ"],
      rows: [
        ["aus, bei, mit, nach, seit, von, zu", "durch, für, gegen, ohne, um"],
        ["mit dem Bus", "für den Vater"],
        ["nach der Arbeit", "ohne einen Plan"],
        ["seit einem Jahr", "gegen die Wand"],
      ],
    },
    beispiele: [
      { de: "Ich fahre mit dem Bus.", ru: "Я еду на автобусе. (mit → Dativ)" },
      { de: "Das Geschenk ist für meinen Bruder.", ru: "Подарок для моего брата. (für → Akkusativ)" },
      { de: "Seit einem Monat lerne ich Deutsch.", ru: "Месяц как я учу немецкий." },
    ],
    fehler: [
      "«für meinem Bruder» — für требует Akkusativ.",
      "«mit der Bus» — mit требует Dativ, а Bus мужской: mit dem Bus.",
      "«ohne mein Handy» вместо «ohne mein Handy» (средний род не меняется) — но «ohne meinen Vater» в мужском.",
    ],
    merk: "Dativ: aus-bei-mit-nach-seit-von-zu. Akkusativ: durch-für-gegen-ohne-um.",
  },

  "a2-wechselpraep": {
    regel:
      "Wechselpräpositionen: an, auf, hinter, in, neben, über, unter, vor, zwischen. " +
      "Wohin? → Akkusativ (Bewegung mit Ziel). Wo? → Dativ (Position). " +
      "Das Verb entscheidet, nicht der Ort: «Ich gehe in die Küche» (wohin), «Ich bin in der Küche» (wo).",
    ru:
      "Девять предлогов, которые меняют падеж в зависимости от вопроса. Ключ не в предлоге, " +
      "а в глаголе: движение с целью → Akkusativ, нахождение → Dativ. " +
      "Исключение, которое все путают: «Ich gehe ins Kino» — движение, Akkusativ, хотя «в кино» звучит как место.",
    tabelle: {
      head: ["предлог", "Wohin? (Akk.)", "Wo? (Dat.)"],
      rows: [
        ["in", "in die Schule", "in der Schule"],
        ["auf", "auf den Tisch", "auf dem Tisch"],
        ["an", "an die Wand", "an der Wand"],
        ["über", "über das Sofa", "über dem Sofa"],
        ["zwischen", "zwischen die Stühle", "zwischen den Stühlen"],
      ],
    },
    beispiele: [
      { de: "Ich hänge das Bild an die Wand.", ru: "Я вешаю картину на стену. (wohin → Akkusativ)" },
      { de: "Das Bild hängt an der Wand.", ru: "Картина висит на стене. (wo → Dativ)" },
      { de: "Wir treffen uns vor dem Kino.", ru: "Мы встречаемся перед кинотеатром." },
    ],
    fehler: [
      "«Ich gehe in der Schule» — движение требует Akkusativ: in die Schule.",
      "«Das Buch liegt auf den Tisch» — лежание требует Dativ: auf dem Tisch.",
      "Забывают, что an/auf в Dativ мужского рода дают dem, а не den.",
    ],
    merk: "Wohin → Akkusativ. Wo → Dativ. Спрашивай глагол, а не место.",
  },

  "a2-genitiv": {
    regel:
      "Der Genitiv antwortet auf «wessen?». Maskulin und Neutrum: des + -(e)s am Substantiv " +
      "(des Vaters, des Autos). Feminin und Plural: der, ohne Endung am Substantiv (der Mutter, der Eltern). " +
      "Umgangssprachlich ersetzt man ihn oft durch von + Dativ.",
    ru:
      "Генитив — «чей». Мужской и средний род получают ещё и -s/-es на самом существительном, " +
      "и это забывают чаще всего: не «des Vater», а «des Vaters». Женский род и множественное число " +
      "не меняются вообще, меняется только артикль.",
    tabelle: {
      head: ["", "maskulin", "feminin", "neutrum", "Plural"],
      rows: [
        ["Nominativ", "der Vater", "die Mutter", "das Auto", "die Eltern"],
        ["Genitiv", "des Vaters", "der Mutter", "des Autos", "der Eltern"],
        ["Dativ", "dem Vater", "der Mutter", "dem Auto", "den Eltern"],
      ],
    },
    beispiele: [
      { de: "Das ist das Auto meines Vaters.", ru: "Это машина моего отца." },
      { de: "Die Farbe der Wand gefällt mir.", ru: "Мне нравится цвет стены." },
      { de: "Wegen des Regens bleiben wir hier.", ru: "Из-за дождя мы остаёмся здесь." },
    ],
    fehler: [
      "«des Vater» без -s — самая частая ошибка в генитиве.",
      "«der Wand» превращают в «der Wande» — женский род не получает окончания.",
      "Ставят -s у слов на -s/-ß: правильно «des Hauses», а не «des Haus». Но «des Autos», а не «des Autoes».",
    ],
    merk: "Мужской и средний → +s (или +es после s/ß/z). Женский и мн. ч. → ничего.",
  },

  "a2-futur": {
    regel:
      "Futur I = werden (Position 2) + Infinitiv (Ende). werden wird nach Person konjugiert: " +
      "werde, wirst, wird, werden, werdet, werden. Futur I drückt Zukunft, Versprechen, Vermutung " +
      "und Absicht aus. Für die reine Zukunft reicht oft auch das Präsens mit Zeitangabe.",
    ru:
      "Будущее в немецком почти всегда выражают презенсом плюс обстоятельство времени: " +
      "«Morgen fahre ich nach Kiel». Futur I нужен там, где есть обещание, предположение или " +
      "подчёркнутое намерение. Форма: werden спрягается, смысловой глагол уходит в конец в инфинитиве.",
    tabelle: {
      head: ["Person", "werden"],
      rows: [
        ["ich", "werde"],
        ["du", "wirst"],
        ["er / sie / es", "wird"],
        ["wir", "werden"],
        ["ihr", "werdet"],
        ["sie / Sie", "werden"],
      ],
    },
    beispiele: [
      { de: "Ich werde dir helfen.", ru: "Я тебе помогу. (обещание)" },
      { de: "Es wird wohl regnen.", ru: "Похоже, будет дождь. (предположение)" },
      { de: "Morgen fahre ich nach Kiel.", ru: "Завтра я еду в Киль. (презенс вместо футурума — норма)" },
    ],
    fehler: [
      "«Ich werde fahren nach Kiel» — инфинитив должен стоять в конце.",
      "«Ich werde bin» — werden не заменяется на sein, это отдельный глагол.",
      "«du werdet» вместо «du wirst».",
    ],
    merk: "werden + инфинитив в конце. Но для «завтра» чаще хватает презенса.",
  },
};

export const THEORY_B1: Record<string, Theory> = {
  /* ------------------------------------------------------------- B1 ----- */
  "b1-relativ-wo-was": {
    regel:
      "wo ersetzt eine Ortsangabe: «die Stadt, wo ich wohne». was steht nach alles, nichts, etwas, viel " +
      "und nach einem ganzen Satz: «Das ist alles, was ich weiß». deren/dessen ist Genitiv: " +
      "«der Mann, dessen Auto kaputt ist».",
    ru:
      "Три случая, где обычное der/die/das не подходит. wo — когда антецедент место, а не предмет. " +
      "was — когда антецедент это «всё/ничего/что-то» или целое предложение. " +
      "deren/dessen — генитив: чей. dessen для мужского и среднего, deren для женского и множественного.",
    tabelle: {
      head: ["антецедент", "местоимение", "пример"],
      rows: [
        ["Ort", "wo", "die Stadt, wo ich wohne"],
        ["alles / nichts / etwas", "was", "alles, was ich weiß"],
        ["ganzer Satz", "was", "Er kam zu spät, was mich ärgerte."],
        ["maskulin/neutrum, Genitiv", "dessen", "der Mann, dessen Auto neu ist"],
        ["feminin/Plural, Genitiv", "deren", "die Frau, deren Sohn krank ist"],
      ],
    },
    beispiele: [
      { de: "Das ist das Haus, wo ich geboren bin.", ru: "Это дом, где я родился." },
      { de: "Das ist alles, was ich dazu sagen kann.", ru: "Это всё, что я могу сказать." },
      { de: "Die Studentin, deren Arbeit ausgezeichnet wurde, ist meine Schwester.", ru: "Студентка, чья работа получила награду, — моя сестра." },
    ],
    fehler: [
      "«das Haus, in dem ich geboren bin» тоже верно, но «wo» короче и в разговорной речи чаще.",
      "«alles, das ich weiß» вместо «alles, was ich weiß».",
      "Путают dessen и deren: смотри на род антецедента, не на того, кому принадлежит.",
    ],
    merk: "Ort → wo. «Всё/ничего» → was. Чей → dessen (он/оно) или deren (она/они).",
  },

  "b1-obwohl-trotzdem": {
    regel:
      "obwohl leitet einen Nebensatz ein (Verb am Ende). trotzdem ist ein Adverb und steht im Hauptsatz " +
      "auf Position 1, danach kommt das Verb. Beide drücken einen Gegensatz aus: " +
      "«Obwohl es regnet, gehe ich spazieren» = «Es regnet, trotzdem gehe ich spazieren».",
    ru:
      "Одно и то же «хотя/несмотря на это» двумя разными механизмами. obwohl — придаточное, глагол в конец. " +
      "trotzdem — наречие, занимает первое место и выбивает подлежащее. Смешать их в одном предложении нельзя: " +
      "либо obwohl, либо trotzdem, но не «obwohl …, trotzdem …».",
    tabelle: {
      head: ["", "порядок", "пример"],
      rows: [
        ["obwohl", "придаточное, глагол в конце", "Obwohl es regnet, gehe ich spazieren."],
        ["trotzdem", "наречие, глагол сразу после", "Es regnet, trotzdem gehe ich spazieren."],
        ["dennoch", "как trotzdem, книжнее", "Es regnet, dennoch gehe ich."],
      ],
    },
    beispiele: [
      { de: "Obwohl ich müde war, habe ich weitergearbeitet.", ru: "Хотя я устал, я продолжал работать." },
      { de: "Ich war müde, trotzdem habe ich weitergearbeitet.", ru: "Я устал, но всё равно продолжал работать." },
    ],
    fehler: [
      "«Obwohl es regnet, trotzdem gehe ich» — двойное выражение уступки, по-немецки так нельзя.",
      "«obwohl es regnet, ich gehe» — после придаточного главное начинается с глагола.",
      "«trotzdem ich müde bin» — trotzdem не вводит придаточное.",
    ],
    merk: "obwohl → глагол в конец. trotzdem → глагол сразу после него. Одно из двух.",
  },

  "b1-damit-umzu": {
    regel:
      "damit + Nebensatz, wenn die Subjekte verschieden sind: «Ich spreche langsam, damit du mich verstehst». " +
      "um … zu + Infinitiv, wenn das Subjekt dasselbe ist: «Ich spreche langsam, um verstanden zu werden». " +
      "Bei trennbaren Verben steht zu zwischen Präfix und Verb: «aufzustehen».",
    ru:
      "Правило одного субъекта. Один и тот же человек делает и главное, и цель → um … zu. " +
      "Разные люди → damit плюс полноценное придаточное. Это не стилистика: " +
      "«Ich lerne, damit ich die Prüfung bestehe» формально возможно, но естественнее «um die Prüfung zu bestehen».",
    tabelle: {
      head: ["кто действует", "конструкция", "пример"],
      rows: [
        ["один субъект", "um … zu + Inf.", "Ich lerne, um die Prüfung zu bestehen."],
        ["разные субъекты", "damit + Nebensatz", "Ich spreche langsam, damit du mich verstehst."],
        ["отделяемая приставка", "zu внутри", "Ich stehe früh auf, um den Bus zu bekommen."],
      ],
    },
    beispiele: [
      { de: "Ich lerne jeden Tag, um die Prüfung zu bestehen.", ru: "Я учусь каждый день, чтобы сдать экзамен." },
      { de: "Er erklärt es noch einmal, damit alle es verstehen.", ru: "Он объясняет ещё раз, чтобы все поняли." },
      { de: "Sie steht früh auf, um pünktlich zu sein.", ru: "Она встаёт рано, чтобы быть вовремя." },
    ],
    fehler: [
      "«um die Prüfung bestehen» — без zu не бывает.",
      "«damit ich die Prüfung bestehe» при одном субъекте — грамматически верно, но звучит тяжело.",
      "«um aufzurableiten» вместо «aufzuräumen» — zu вставляется между приставкой и глаголом, приставка не отделяется.",
    ],
    merk: "Один субъект → um … zu. Два → damit. zu всегда есть.",
  },

  "b1-infinitiv-zu": {
    regel:
      "Nach vielen Verben und Ausdrücken steht zu + Infinitiv: anfangen, aufhören, versuchen, vergessen, " +
      "hoffen, vorhaben, Lust haben, Zeit haben. Bei trennbaren Verben steht zu zwischen Präfix und Stamm: " +
      "«Ich habe vergessen, die Tür zuzumachen».",
    ru:
      "Это не отдельная конструкция, а список глаголов, после которых инфинитив идёт с zu. " +
      "Модальные глаголы zu не берут (ich muss gehen), а вот anfangen, versuchen, vergessen — берут всегда. " +
      "У отделяемых глаголов zu влезает внутрь: aufzumachen, nicht «zu aufmachen».",
    tabelle: {
      head: ["без zu", "с zu"],
      rows: [
        ["müssen, können, wollen, sollen, dürfen, möchten", "versuchen, anfangen, aufhören"],
        ["Ich muss gehen.", "Ich versuche zu gehen."],
        ["Ich will lernen.", "Ich habe vor zu lernen."],
      ],
    },
    beispiele: [
      { de: "Ich versuche, mehr zu lesen.", ru: "Я пытаюсь больше читать." },
      { de: "Er hat vergessen, mich anzurufen.", ru: "Он забыл мне позвонить." },
      { de: "Es ist wichtig, jeden Tag zu üben.", ru: "Важно заниматься каждый день." },
    ],
    fehler: [
      "«Ich muss zu gehen» — модальные без zu.",
      "«zu anrufen» вместо «anzurufen».",
      "Забывают запятую перед инфинитивной группой, если она длинная.",
    ],
    merk: "Модальные — без zu. Все остальные смысловые — с zu. Отделяемая приставка: zu внутрь.",
  },

  "b1-plusquamperfekt": {
    regel:
      "Plusquamperfekt = hatte/war + Partizip II. Es bezeichnet das Vorvergangene: was schon passiert war, " +
      "bevor etwas anderes passierte. Typisch mit nachdem: «Nachdem ich gegessen hatte, ging ich los».",
    ru:
      "Предпрошедшее. Нужно ровно в одном случае: когда надо показать, что одно действие было раньше другого. " +
      "С nachdem это почти обязательно: придаточное в Plusquamperfekt, главное в Präteritum. " +
      "Вспомогательный выбирается по тому же правилу, что и в Perfekt — haben или sein.",
    tabelle: {
      head: ["", "haben", "sein"],
      rows: [
        ["ich", "hatte gemacht", "war gegangen"],
        ["du", "hattest gemacht", "warst gegangen"],
        ["er / sie / es", "hatte gemacht", "war gegangen"],
        ["wir", "hatten gemacht", "waren gegangen"],
      ],
    },
    beispiele: [
      { de: "Nachdem ich gegessen hatte, ging ich spazieren.", ru: "После того как я поел, я пошёл гулять." },
      { de: "Er war schon weggegangen, als ich ankam.", ru: "Он уже ушёл, когда я пришёл." },
      { de: "Wir hatten den Film schon gesehen.", ru: "Мы уже видели этот фильм." },
    ],
    fehler: [
      "«Nachdem ich gegessen habe, ging ich» — в nachdem-придаточном нужен Plusquamperfekt.",
      "«Ich hatte gegangen» — движение требует sein: war gegangen.",
      "Путают порядок: Plusquamperfekt в придаточном, Präteritum в главном, а не наоборот.",
    ],
    merk: "nachdem → hatte/war + Partizip II. Главное — Präteritum. Раньше = Plusquamperfekt.",
  },

  "b1-passiv": {
    regel:
      "Passiv = werden + Partizip II. Das Objekt des Aktivsatzes wird zum Subjekt. " +
      "Der Täter kann mit von (Person) oder durch (Mittel) genannt werden, muss aber nicht. " +
      "Präsens: das Haus wird gebaut. Präteritum: das Haus wurde gebaut.",
    ru:
      "Пассив меняет точку зрения: не «кто делает», а «что происходит с объектом». " +
      "werden спрягается, Partizip II в конце. Тот, кто делает, вообще не нужен — " +
      "именно поэтому пассив любят в инструкциях и научных текстах.",
    tabelle: {
      head: ["время", "форма", "пример"],
      rows: [
        ["Präsens", "wird + Partizip II", "Das Haus wird gebaut."],
        ["Präteritum", "wurde + Partizip II", "Das Haus wurde gebaut."],
        ["Perfekt", "ist + Partizip II + worden", "Das Haus ist gebaut worden."],
        ["mit Täter", "von + Dativ", "Das Haus wird von den Arbeitern gebaut."],
      ],
    },
    beispiele: [
      { de: "Die Prüfung wird am Montag geschrieben.", ru: "Экзамен пишут в понедельник." },
      { de: "Das Problem wurde schnell gelöst.", ru: "Проблема была быстро решена." },
      { de: "Hier wird nicht geraucht.", ru: "Здесь не курят." },
    ],
    fehler: [
      "«Das Haus ist gebaut» — это Zustandspassiv (состояние), а не процесс. Процесс: wird gebaut.",
      "В Perfekt пишут «ist gebaut geworden» вместо «ist gebaut worden» — в пассиве worden без ge-.",
      "«von dem Arbeiter» верно, но «durch dem Arbeiter» — durch требует Akkusativ.",
    ],
    merk: "werden + Partizip II. Perfekt: worden, не geworden. Тäter: von + Dativ.",
  },

  "b1-konjunktiv2": {
    regel:
      "Konjunktiv II drückt Irrealität, Wunsch und höfliche Bitte aus. Schwache Verben: würde + Infinitiv. " +
      "Starke Verben haben eigene Formen: wäre, hätte, könnte, müsste, würde, ginge, käme. " +
      "Für höfliche Bitten nimmt man oft könnte, würde, hätte.",
    ru:
      "Сослагательное наклонение: «сделал бы», «был бы», «если бы». У слабых глаголов форма совпала бы " +
      "с претеритом, поэтому их выручает würde + инфинитив. У сильных и модальных формы свои, " +
      "и их надо знать: wäre, hätte, könnte, müsste, dürfte, sollte, wollte.",
    tabelle: {
      head: ["Infinitiv", "Konjunktiv II"],
      rows: [
        ["sein", "wäre"],
        ["haben", "hätte"],
        ["werden", "würde"],
        ["können", "könnte"],
        ["müssen", "müsste"],
        ["gehen", "ginge / würde gehen"],
        ["machen", "würde machen"],
      ],
    },
    beispiele: [
      { de: "Wenn ich Zeit hätte, würde ich mehr lesen.", ru: "Если бы у меня было время, я бы больше читал." },
      { de: "Könnten Sie mir bitte helfen?", ru: "Не могли бы вы мне помочь?" },
      { de: "An deiner Stelle wäre ich vorsichtig.", ru: "На твоём месте я был бы осторожен." },
    ],
    fehler: [
      "«Wenn ich Zeit hätte, würde ich mehr lesen würde» — würde дважды.",
      "«Ich würde sein» вместо «ich wäre» — у sein своя форма.",
      "«Wenn ich Zeit habe» вместо «hätte» — с wenn в ирреальном условии нужен Konjunktiv II.",
    ],
    merk: "wäre, hätte, könnte, müsste — наизусть. Остальное — würde + инфинитив.",
  },

  "b1-verben-praep": {
    regel:
      "Viele Verben verlangen eine feste Präposition mit festem Kasus: warten auf + Akk, sich freuen auf/über, " +
      "sich interessieren für + Akk, denken an + Akk, teilnehmen an + Dat, sich beschäftigen mit + Dat. " +
      "Die Präposition gehört zum Verb und lässt sich nicht austauschen.",
    ru:
      "Немецкий глагол тащит за собой предлог, и этот предлог не переводится на русский логикой. " +
      "«warten auf» — ждать (не «für»), «sich interessieren für» — интересоваться (не «an»). " +
      "Учить надо парой: глагол + предлог + падеж, иначе предложение рассыпается.",
    tabelle: {
      head: ["Verb", "Präposition", "Kasus"],
      rows: [
        ["warten", "auf", "Akkusativ"],
        ["sich interessieren", "für", "Akkusativ"],
        ["denken", "an", "Akkusativ"],
        ["teilnehmen", "an", "Dativ"],
        ["sich beschäftigen", "mit", "Dativ"],
        ["abhängen", "von", "Dativ"],
        ["sich freuen", "über / auf", "Akkusativ"],
      ],
    },
    beispiele: [
      { de: "Ich warte auf den Bus.", ru: "Я жду автобус." },
      { de: "Er interessiert sich für Geschichte.", ru: "Он интересуется историей." },
      { de: "Wir nehmen an dem Kurs teil.", ru: "Мы участвуем в курсе." },
    ],
    fehler: [
      "«Ich warte für den Bus» — калька с русского, по-немецки только auf.",
      "«Ich denke über dich» вместо «an dich» — über значит «размышляю о», an — «думаю о тебе».",
      "«teilnehmen in dem Kurs» — an + Dativ, не in.",
    ],
    merk: "Предлог — часть глагола. Учи слово целиком: warten auf, nicht warten.",
  },

  "b1-ndeklination": {
    regel:
      "Eine kleine Gruppe maskuliner Nomen bekommt im Akkusativ, Dativ und Genitiv die Endung -en (oder -n): " +
      "der Junge → den Jungen, dem Jungen, des Jungen. Dazu gehören Nomen auf -e (Junge, Kollege, Kunde), " +
      "Personen (Mensch, Nachbar, Polizist, Tourist, Student) und einige Fremdwörter.",
    ru:
      "Слабое склонение: во всех падежах кроме именительного слово получает -en. " +
      "Это почти всегда люди и почти всегда мужской род. Признак — окончание -e в именительном " +
      "или значение «человек». Запомнить список проще, чем выводить правило.",
    tabelle: {
      head: ["", "der Junge", "der Mensch", "der Student"],
      rows: [
        ["Nominativ", "der Junge", "der Mensch", "der Student"],
        ["Akkusativ", "den Jungen", "den Menschen", "den Studenten"],
        ["Dativ", "dem Jungen", "dem Menschen", "dem Studenten"],
        ["Genitiv", "des Jungen", "des Menschen", "des Studenten"],
      ],
    },
    beispiele: [
      { de: "Ich kenne den Jungen gut.", ru: "Я хорошо знаю этого парня. (Akkusativ → Jungen)" },
      { de: "Ich helfe dem Studenten.", ru: "Я помогаю студенту. (Dativ → Studenten)" },
      { de: "Die Tasche des Kunden steht dort.", ru: "Сумка клиента стоит там." },
    ],
    fehler: [
      "«Ich kenne den Junge» — в аккузативе нужен -n.",
      "Распространяют правило на Frauen: «der Frau» не получает -en, слабое склонение — только мужской род.",
      "Забывают, что в Nominativ форма остаётся чистой: «der Studenten kommt» — неверно.",
    ],
    merk: "Человек мужского рода на -e или по значению → -en везде, кроме Nominativ.",
  },

  "b1-konnektoren-doppel": {
    regel:
      "entweder … oder, weder … noch, sowohl … als auch, nicht nur … sondern auch, je … desto/umso. " +
      "Bei je … desto: je + Komparativ am Anfang des Nebensatzes (Verb am Ende), desto + Komparativ " +
      "am Anfang des Hauptsatzes (Verb direkt danach): «Je mehr ich lerne, desto besser verstehe ich».",
    ru:
      "Двойные союзы работают парами, и вторая половина обязательна. je … desto — единственный, " +
      "который меняет порядок слов в обеих частях: je + сравнительная степень, глагол в конец; " +
      "desto + сравнительная степень, глагол сразу. «Je mehr, desto besser» — без глаголов это лозунг, не предложение.",
    tabelle: {
      head: ["союз", "значение", "пример"],
      rows: [
        ["entweder … oder", "или … или", "Entweder du kommst oder du bleibst."],
        ["weder … noch", "ни … ни", "Ich habe weder Zeit noch Lust."],
        ["sowohl … als auch", "и … и", "Er spricht sowohl Deutsch als auch Englisch."],
        ["nicht nur … sondern auch", "не только … но и", "Sie ist nicht nur klug, sondern auch fleißig."],
        ["je … desto", "чем … тем", "Je mehr ich übe, desto sicherer werde ich."],
      ],
    },
    beispiele: [
      { de: "Je länger ich warte, desto ungeduldiger werde ich.", ru: "Чем дольше я жду, тем нетерпеливее становлюсь." },
      { de: "Weder der Lehrer noch die Schüler waren da.", ru: "Ни учителя, ни учеников не было." },
    ],
    fehler: [
      "«Je mehr ich lerne, desto besser ich verstehe» — после desto глагол сразу.",
      "«weder … oder» — пара только weder … noch.",
      "«je … desto» ставят без сравнительной степени: «je viel, desto gut».",
    ],
    merk: "je + Komparativ, Verb ans Ende. desto + Komparativ, Verb sofort danach.",
  },

  "b1-praeteritum-erzaehlen": {
    regel:
      "In Erzählungen steht das Präteritum, nicht das Perfekt. Für Hintergrund und Zustand benutzt man " +
      "oft hatte/war (Plusquamperfekt), für die Haupthandlung Präteritum. " +
      "Häufige Erzählverben: ging, kam, sah, sagte, dachte, stand, lag, begann.",
    ru:
      "Если пишешь историю — время претерит. Перфект в рассказе выглядит как устная речь, " +
      "записанная на бумагу. Правило простое: главная линия — претерит, фон и предыстория — плюсквамперфект. " +
      "Для Bildergeschichte на экзамене это ровно то, что нужно.",
    tabelle: {
      head: ["функция", "время", "пример"],
      rows: [
        ["фон, предыстория", "Plusquamperfekt", "Er hatte lange gewartet."],
        ["главная линия", "Präteritum", "Dann ging er nach Hause."],
        ["оценка, вывод", "Präsens", "Das ist typisch für ihn."],
      ],
    },
    beispiele: [
      { de: "Es war schon dunkel, als er nach Hause kam.", ru: "Было уже темно, когда он пришёл домой." },
      { de: "Sie öffnete die Tür und sah den Brief.", ru: "Она открыла дверь и увидела письмо." },
    ],
    fehler: [
      "Мешают перфект и претерит в одном абзаце: «Er ist gekommen und dann ging er».",
      "Начинают рассказ с Perfekt, потому что так говорят.",
      "Забывают, что в придаточном времени с als тоже претерит: «als er kam», не «als er gekommen ist».",
    ],
    merk: "Рассказ → Präteritum. Фон → Plusquamperfekt. Речь → Perfekt.",
  },

  "b1-wortbildung": {
    regel:
      "Nomen aus Verben: Infinitiv als Nomen (das Lesen), Stamm + -ung (die Wohnung), Stamm + -e (die Frage). " +
      "Adjektive mit un- (unfreundlich), -los (arbeitslos), -bar (machbar), -ig (fleißig). " +
      "Alle nominalisierten Infinitive sind neutrum: das Essen, das Lernen.",
    ru:
      "Словообразование в немецком механическое, и это подарок: зная корень, можно собрать слово, " +
      "которого никогда не видел. Инфинитив, ставший существительным, всегда среднего рода. " +
      "-ung всегда женского. -heit и -keit тоже женского. -er (деятель) — мужского.",
    tabelle: {
      head: ["суффикс", "род", "пример"],
      rows: [
        ["Infinitiv", "das", "das Lesen, das Essen"],
        ["-ung", "die", "die Wohnung, die Zeitung"],
        ["-heit / -keit", "die", "die Freiheit, die Möglichkeit"],
        ["-er (Person)", "der", "der Lehrer, der Fahrer"],
        ["-chen / -lein", "das", "das Mädchen, das Büchlein"],
      ],
    },
    beispiele: [
      { de: "Das Lesen macht mir Spaß.", ru: "Чтение доставляет мне удовольствие." },
      { de: "Die Entscheidung war schwer.", ru: "Решение было трудным." },
      { de: "Diese Aufgabe ist unlösbar.", ru: "Эта задача нерешаема." },
    ],
    fehler: [
      "«die Lesen» вместо «das Lesen» — номинализированный инфинитив среднего рода.",
      "«die Wohnhaft» вместо «die Wohnung» — суффикс не тот.",
      "Забывают умлаут при образовании: «der Tag → die Tagung» есть, но «die Macht → mächtig» с умлаутом.",
    ],
    merk: "-ung/-heit/-keit → die. Инфинитив → das. Деятель на -er → der.",
  },
};
