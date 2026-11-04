/* ============================================================================
   ДАННЫЕ УПРАЖНЕНИЙ
   ----------------------------------------------------------------------------
   Здесь лежат НАСТОЯЩИЕ предложения, а не шаблоны вида «подставь глагол».
   Причина простая: шаблон, который работает для любого глагола, звучит как
   робот («Ich habe gestern die Katze gebaut»), а ученик, который готовится
   к экзамену, должен видеть нормальный немецкий. Поэтому на каждый глагол —
   своя фраза, и она проверена глазами.

   `{0}` и `{1}` — места для ввода. В Perfekt это всегда вспомогательный
   глагол и Partizip II, как в задании 3.1 образца.

   Лицо (0 ich · 1 du · 2 er/sie · 3 wir · 4 ihr · 5 sie) хранится в кадре,
   а не выводится: вспомогательный глагол зависит от лица, и если лицо
   случайное, фраза разваливается.
   ========================================================================== */

export type PerfektFrame = { v: string; p: number; text: string };

export const PERFEKT: PerfektFrame[] = [
  /* правильные */
  { v: "kochen", p: 0, text: "Ich {0} heute Mittag eine Suppe {1}." },
  { v: "machen", p: 2, text: "Er {0} seine Hausaufgaben schon {1}." },
  { v: "arbeiten", p: 3, text: "Wir {0} gestern bis acht Uhr {1}." },
  { v: "wohnen", p: 0, text: "Ich {0} drei Jahre in Kiel {1}." },
  { v: "lernen", p: 4, text: "Ihr {0} für die Prüfung viel {1}." },
  { v: "spielen", p: 5, text: "Die Kinder {0} den ganzen Nachmittag im Garten {1}." },
  { v: "kaufen", p: 1, text: "Du {0} ein neues Fahrrad {1}." },
  { v: "suchen", p: 2, text: "Sie {0} den Schlüssel überall {1}." },
  { v: "hören", p: 0, text: "Ich {0} die Nachrichten noch nicht {1}." },
  { v: "sagen", p: 2, text: "Er {0} mir die Wahrheit nicht {1}." },
  { v: "fragen", p: 1, text: "Du {0} den Lehrer nach dem Termin {1}." },
  { v: "antworten", p: 5, text: "Die Studenten {0} auf alle Fragen {1}." },
  { v: "brauchen", p: 3, text: "Wir {0} länger als geplant {1}." },
  { v: "öffnen", p: 2, text: "Der Lehrer {0} das Fenster {1}." },
  { v: "warten", p: 0, text: "Ich {0} eine halbe Stunde auf dich {1}." },
  { v: "putzen", p: 4, text: "Ihr {0} die Küche gründlich {1}." },
  { v: "renovieren", p: 3, text: "Wir {0} die Wohnung im Sommer {1}." },
  { v: "studieren", p: 2, text: "Er {0} in Darmstadt Maschinenbau {1}." },
  { v: "telefonieren", p: 0, text: "Ich {0} heute mit meiner Mutter {1}." },
  { v: "probieren", p: 1, text: "Du {0} den Kuchen noch nicht {1}." },
  { v: "reparieren", p: 2, text: "Der Nachbar {0} unser Fahrrad {1}." },
  { v: "klingeln", p: 2, text: "Es {0} an der Tür {1}." },
  { v: "lächeln", p: 5, text: "Die Kinder {0} freundlich {1}." },

  /* неотделяемые приставки — без ge- */
  { v: "besuchen", p: 0, text: "Ich {0} meine Tante in Hamburg {1}." },
  { v: "erklären", p: 2, text: "Der Lehrer {0} die Aufgabe zweimal {1}." },
  { v: "untersuchen", p: 2, text: "Die Ärztin {0} den Patienten gründlich {1}." },
  { v: "verstehen", p: 0, text: "Ich {0} die Frage nicht {1}." },
  { v: "verkaufen", p: 3, text: "Wir {0} das alte Auto {1}." },
  { v: "bezahlen", p: 1, text: "Du {0} die Rechnung schon {1}." },
  { v: "erzählen", p: 2, text: "Er {0} uns eine lustige Geschichte {1}." },
  { v: "bekommen", p: 4, text: "Ihr {0} eine Einladung {1}." },
  { v: "vergessen", p: 0, text: "Ich {0} den Termin völlig {1}." },
  { v: "verlieren", p: 2, text: "Sie {0} ihren Schlüssel {1}." },
  { v: "bestellen", p: 3, text: "Wir {0} zwei Kaffee {1}." },
  { v: "empfehlen", p: 2, text: "Der Arzt {0} mir mehr Bewegung {1}." },
  { v: "besichtigen", p: 5, text: "Die Gruppe {0} das Museum {1}." },

  /* отделяемые */
  { v: "abholen", p: 5, text: "Anna {0} das Paket bei der Post {1}." },
  { v: "aufräumen", p: 1, text: "Du {0} dein Zimmer endlich {1}." },
  { v: "abwaschen", p: 2, text: "Oma {0} das schmutzige Geschirr {1}." },
  { v: "anrufen", p: 4, text: "Ihr {0} eure Freunde am Abend {1}." },
  { v: "einkaufen", p: 0, text: "Ich {0} für das Wochenende {1}." },
  { v: "aufstehen", p: 2, text: "Er {0} heute sehr früh {1}." },
  { v: "einschlafen", p: 0, text: "Ich {0} gestern sofort {1}." },
  { v: "mitkommen", p: 1, text: "Du {0} zum Glück mit {1}." },
  { v: "aufmachen", p: 5, text: "Sie {0} alle Fenster {1}." },
  { v: "zumachen", p: 2, text: "Er {0} die Tür leise {1}." },
  { v: "fernsehen", p: 3, text: "Wir {0} gestern Abend {1}." },
  { v: "vorbereiten", p: 0, text: "Ich {0} das Abendessen {1}." },
  { v: "anfangen", p: 2, text: "Der Film {0} pünktlich {1}." },
  { v: "aufhören", p: 2, text: "Es {0} endlich {1} zu regnen." },
  { v: "mitbringen", p: 4, text: "Ihr {0} die Getränke {1}." },
  { v: "einladen", p: 2, text: "Er {0} alle Nachbarn {1}." },
  { v: "aussehen", p: 2, text: "Der Kuchen {0} köstlich {1}." },
  { v: "anziehen", p: 1, text: "Du {0} die Jacke {1}." },
  { v: "aufschreiben", p: 5, text: "Die Schüler {0} die Hausaufgaben {1}." },
  { v: "mitnehmen", p: 0, text: "Ich {0} den Regenschirm {1}." },
  { v: "zurückkommen", p: 3, text: "Wir {0} spät {1}." },
  { v: "stattfinden", p: 2, text: "Das Konzert {0} im Park {1}." },
  { v: "teilnehmen", p: 1, text: "Du {0} am Kurs {1}." },
  { v: "kennenlernen", p: 0, text: "Ich {0} ihn in Berlin {1}." },
  { v: "aufpassen", p: 4, text: "Ihr {0} im Unterricht gut {1}." },
  { v: "aussteigen", p: 2, text: "Er {0} am Hauptbahnhof {1}." },
  { v: "einsteigen", p: 5, text: "Die Fahrgäste {0} schnell {1}." },
  { v: "umziehen", p: 3, text: "Wir {0} letzten Monat {1}." },
  { v: "ankommen", p: 2, text: "Der Zug {0} mit Verspätung {1}." },
  { v: "abfahren", p: 2, text: "Der Bus {0} ohne uns {1}." },
  { v: "zuhören", p: 0, text: "Ich {0} dem Vortrag {1}." },

  /* сильные */
  { v: "essen", p: 1, text: "Was {0} du gerade {1}?" },
  { v: "trinken", p: 2, text: "Er {0} zu viel Kaffee {1}." },
  { v: "gehen", p: 0, text: "Ich {0} gestern früh ins Bett {1}." },
  { v: "kommen", p: 5, text: "Sie {0} zu spät zur Prüfung {1}." },
  { v: "fahren", p: 2, text: "Er {0} mit dem Fahrrad zur Arbeit {1}." },
  { v: "fliegen", p: 2, text: "Er {0} mit dem Flugzeug nach Wien {1}." },
  { v: "sehen", p: 0, text: "Ich {0} den Film schon {1}." },
  { v: "lesen", p: 1, text: "Du {0} das Buch in zwei Tagen {1}." },
  { v: "schreiben", p: 2, text: "Sie {0} mir eine lange E-Mail {1}." },
  { v: "sprechen", p: 3, text: "Wir {0} lange über das Problem {1}." },
  { v: "nehmen", p: 5, text: "Sie {0} den Zug um acht {1}." },
  { v: "geben", p: 2, text: "Er {0} mir den Schlüssel {1}." },
  { v: "helfen", p: 2, text: "Peter {0} dir bei den Hausaufgaben {1}." },
  { v: "treffen", p: 0, text: "Ich {0} ihn zufällig am Bahnhof {1}." },
  { v: "finden", p: 1, text: "Du {0} deine Brille wieder {1}." },
  { v: "bleiben", p: 5, text: "Sie {0} den ganzen Tag zu Hause {1}." },
  { v: "schlafen", p: 2, text: "Das Kind {0} tief {1}." },
  { v: "laufen", p: 3, text: "Wir {0} zehn Kilometer {1}." },
  { v: "singen", p: 5, text: "Die Kinder {0} ein Lied {1}." },
  { v: "bringen", p: 2, text: "Er {0} die Getränke {1}." },
  { v: "denken", p: 0, text: "Ich {0} lange über deine Frage {1}." },
  { v: "wissen", p: 2, text: "Er {0} die Antwort nicht {1}." },
  { v: "tun", p: 1, text: "Was {0} du gestern {1}?" },
  { v: "werden", p: 2, text: "Er {0} Lehrer {1}." },
  { v: "sein", p: 0, text: "Ich {0} noch nie in Berlin {1}." },
  { v: "haben", p: 4, text: "Ihr {0} viel Glück {1}." },
];

/* ---------------------------------------- Perfekt с инверсией (формат B) --
   Реальный экзамен (со слов хозяина): грамматика простая, но предложения
   ДЛИННЫЕ и весь экзамен «на подьёбе». Три ловушки здесь:
     · инверсия — придаточное/обстоятельство впереди, aux на позиции 2,
       Partizip в конец (ученик ставит aux не туда);
     · отделяемые vs неотделяемые (angerufen с ge-, besichtigt без ge-);
     · sein-глаголы среди haben-ловушек (ankommen, laufen).
   Глаголы только из verbs.ts — форма выводится таблицей, не сочиняется. */

export const PERFEKT_INV: PerfektFrame[] = [
  { v: "vergessen", p: 2, text: "Weil er krank war, {0} er den Termin beim Zahnarzt {1}." },
  { v: "machen", p: 5, text: "Obwohl es schon spät war, {0} die Kinder ihre Hausaufgaben {1}." },
  { v: "aufräumen", p: 2, text: "Als ich nach Hause kam, {0} mein Bruder gerade sein Zimmer {1}." },
  { v: "besichtigen", p: 5, text: "Trotz des Regens {0} die Touristen das Schloss {1}." },
  { v: "anrufen", p: 0, text: "Bevor ich losfuhr, {0} ich schnell noch meine Mutter {1}." },
  { v: "ankommen", p: 2, text: "Weil sie den Bus verpasst hatte, {0} sie erst eine Stunde später {1}." },
  { v: "trinken", p: 3, text: "Nachdem die Gäste da waren, {0} wir zusammen Kaffee {1}." },
  { v: "bezahlen", p: 2, text: "Obwohl er müde war, {0} er die Rechnung sofort {1}." },
  { v: "laufen", p: 0, text: "Weil der Bus nicht kam, {0} ich zur Arbeit {1}." },
  { v: "aufschreiben", p: 3, text: "Nachdem der Lehrer die Regel erklärt hatte, {0} wir sie uns {1}." },
  { v: "essen", p: 2, text: "Obwohl das Essen lecker aussah, {0} er nichts {1}." },
  { v: "spielen", p: 3, text: "Weil das Wetter schön war, {0} wir noch im Park {1}." },
  { v: "erzählen", p: 2, text: "Als ich ihn endlich traf, {0} er mir die ganze Geschichte {1}." },
  { v: "kaufen", p: 3, text: "Bevor die Vorstellung anfing, {0} wir uns noch einen Kaffee {1}." },
  { v: "beginnen", p: 2, text: "Nachdem alle Gäste angekommen waren, {0} das Fest {1}." },
];

/* ------------------------------------------------- trennbar / untrennbar --
   Задание 3.2 образца. Всегда две дырки, как в экзамене: если глагол
   неотделяемый, вторая остаётся пустой — и это ровно то, что проверяется. */

export type TrennFrame = { v: string; p: number; text: string };

export const TRENNBAR: TrennFrame[] = [
  { v: "untersuchen", p: 2, text: "Lauras Mutter {0} jeden Tag Tiere in ihrer Praxis {1}." },
  { v: "erklären", p: 2, text: "Der Lehrer {0} ihr die Matheaufgabe {1}." },
  { v: "abwaschen", p: 2, text: "Lauras und Tims Oma {0} das schmutzige Geschirr {1}." },
  { v: "aufräumen", p: 1, text: "Du {0} das Zimmer deiner Freundin {1}." },
  { v: "anrufen", p: 4, text: "Ihr {0} eure Freunde am Nachmittag {1}." },
  { v: "besuchen", p: 0, text: "Ich {0} meine Großeltern jeden Sonntag {1}." },
  { v: "verstehen", p: 3, text: "Wir {0} die Aufgabe nicht {1}." },
  { v: "abholen", p: 2, text: "Mein Vater {0} mich vom Bahnhof {1}." },
  { v: "einkaufen", p: 5, text: "Meine Eltern {0} immer samstags {1}." },
  { v: "aufstehen", p: 0, text: "Ich {0} jeden Morgen um sechs {1}." },
  { v: "bezahlen", p: 1, text: "Du {0} die Rechnung am Freitag {1}." },
  { v: "aufmachen", p: 2, text: "Der Lehrer {0} das Fenster {1}." },
  { v: "erzählen", p: 2, text: "Opa {0} uns eine Geschichte {1}." },
  { v: "zumachen", p: 4, text: "Ihr {0} bitte die Tür {1}." },
  { v: "vergessen", p: 0, text: "Ich {0} den Termin leider {1}." },
  { v: "fernsehen", p: 3, text: "Wir {0} abends nur eine Stunde {1}." },
  { v: "verlieren", p: 5, text: "Die Kinder {0} ständig ihre Handschuhe {1}." },
  { v: "vorbereiten", p: 2, text: "Meine Mutter {0} das Abendessen {1}." },
  { v: "bekommen", p: 1, text: "Du {0} jede Woche neue Aufgaben {1}." },
  { v: "anfangen", p: 2, text: "Der Unterricht {0} pünktlich {1}." },
  { v: "bestellen", p: 0, text: "Ich {0} immer nur Wasser {1}." },
  { v: "aufhören", p: 3, text: "Wir {0} um fünf Uhr {1}." },
  { v: "mitbringen", p: 4, text: "Ihr {0} bitte die Bücher {1}." },
  { v: "einladen", p: 2, text: "Er {0} seine Freunde zum Geburtstag {1}." },
  { v: "besichtigen", p: 5, text: "Die Touristen {0} das Schloss {1}." },
  { v: "aussehen", p: 2, text: "Das Bild {0} sehr alt {1}." },
  { v: "anziehen", p: 0, text: "Ich {0} heute die blaue Jacke {1}." },
  { v: "aufschreiben", p: 1, text: "Du {0} die Vokabeln {1}." },
  { v: "mitnehmen", p: 2, text: "Er {0} seinen Regenschirm {1}." },
  { v: "teilnehmen", p: 3, text: "Wir {0} am Kurs {1}." },
  { v: "kennenlernen", p: 5, text: "Sie {0} die neuen Nachbarn {1}." },
  { v: "aufpassen", p: 4, text: "Ihr {0} im Unterricht {1}." },
  { v: "umziehen", p: 0, text: "Ich {0} im Mai nach Kiel {1}." },
  { v: "zuhören", p: 2, text: "Der Lehrer {0} geduldig {1}." },
  { v: "empfehlen", p: 2, text: "Der Arzt {0} mir mehr Sport {1}." },
  { v: "verkaufen", p: 3, text: "Wir {0} unser altes Auto {1}." },
  { v: "verstehen", p: 2, text: "Sie {0} den Dialekt nicht {1}." },
  { v: "abfahren", p: 2, text: "Der Zug {0} um acht {1}." },
  { v: "ankommen", p: 2, text: "Der Bus {0} in zehn Minuten {1}." },
  { v: "reparieren", p: 0, text: "Ich {0} das Fahrrad selbst {1}." },
];

/* ------------------------------------------------------- Relativpronomen --
   Задание 3.3. Ответ один и он определяется падежом внутри придаточного,
   поэтому `why` объясняет именно падеж, а не «так говорят». */

export type RelativFrame = { text: string; a: string; why: string };

export const RELATIV: RelativFrame[] = [
  { text: "Er möchte einen Parkplatz, {0} vor seiner Haustür ist.", a: "der", why: "Parkplatz — мужской род, в придаточном он подлежащее → Nominativ: der." },
  { text: "Ich suche den Anzug, {0} ich im Katalog gesehen habe.", a: "den", why: "Anzug — мужской род, sehen требует Akkusativ → den." },
  { text: "Otto kauft die Schuhe, {0} er gerade anprobiert hat.", a: "die", why: "Schuhe — множественное число, anprobieren требует Akkusativ → die." },
  { text: "Das Kleid, {0} du gekauft hast, hängt im Schrank.", a: "das", why: "Kleid — средний род, kaufen требует Akkusativ → das (совпадает с Nominativ)." },
  { text: "Familie Klein sucht eine Lampe, {0} hell leuchtet.", a: "die", why: "Lampe — женский род, в придаточном подлежащее → Nominativ: die." },
  { text: "Der Mann, {0} dort steht, ist mein Nachbar.", a: "der", why: "Mann — мужской род, подлежащее → Nominativ: der." },
  { text: "Die Frau, {0} ich gestern getroffen habe, wohnt nebenan.", a: "die", why: "Frau — женский род, treffen требует Akkusativ, а форма женского рода в Akkusativ совпадает с Nominativ: die." },
  { text: "Das Kind, {0} im Garten spielt, ist meine Nichte.", a: "das", why: "Kind — средний род, подлежащее → Nominativ: das." },
  { text: "Der Lehrer, {0} ich gefragt habe, war sehr freundlich.", a: "den", why: "Lehrer — мужской род, fragen требует Akkusativ → den." },
  { text: "Die Nachbarn, {0} wir geholfen haben, sind umgezogen.", a: "denen", why: "helfen требует Dativ; множественное число в Dativ → denen." },
  { text: "Der Kollege, {0} ich das Buch gegeben habe, liest es gerade.", a: "dem", why: "geben + Dativ (кому?), мужской род в Dativ → dem." },
  { text: "Das Restaurant, {0} wir gestern waren, war sehr gut.", a: "in dem", why: "Место (в ресторане) требует предлога in + Dativ; средний род → in dem (разговорно: im)." },
  { text: "Die Stadt, {0} ich geboren bin, liegt am Meer.", a: "in der", why: "Место рождения: in + Dativ, женский род → in der." },
  { text: "Der Film, {0} wir gesehen haben, war langweilig.", a: "den", why: "Film — мужской род, sehen требует Akkusativ → den." },
  { text: "Das Buch, {0} ich dir empfohlen habe, ist endlich da.", a: "das", why: "Buch — средний род, empfehlen требует Akkusativ → das." },
  { text: "Die Prüfung, {0} ich mich vorbereite, ist am Montag.", a: "auf die", why: "sich vorbereiten auf + Akkusativ; женский род → auf die." },
  { text: "Der Zug, {0} wir gewartet haben, kommt zu spät.", a: "auf den", why: "warten auf + Akkusativ; мужской род → auf den." },
  { text: "Die Freunde, {0} ich mich freue, kommen morgen.", a: "auf die", why: "sich freuen auf + Akkusativ; множественное число → auf die." },
  { text: "Das Thema, {0} wir diskutiert haben, ist kompliziert.", a: "das", why: "Thema — средний род, diskutieren требует Akkusativ → das." },
  { text: "Der Junge, {0} Fahrrad gestohlen wurde, ist sehr traurig.", a: "dem", why: "Passiv с Dativ-объектом: «кому украли» → dem." },
  { text: "Die Kollegin, {0} ich das Paket gegeben habe, ist krank.", a: "der", why: "geben + Dativ, женский род в Dativ → der." },
  { text: "Das Haus, {0} Dach kaputt ist, wird renoviert.", a: "dessen", why: "Притяжательное отношение (чей?): Genitiv среднего рода → dessen." },
  { text: "Der Autor, {0} Bücher weltberühmt sind, lebt in Wien.", a: "dessen", why: "Genitiv мужского рода (чей?) → dessen." },
  { text: "Die Stadt, {0} Einwohner protestieren, ist bekannt.", a: "deren", why: "Genitiv женского рода (чей?) → deren." },
  { text: "Alles, {0} er gesagt hat, war richtig.", a: "was", why: "После alles, nichts, etwas, viel используется was, а не das." },
  { text: "Das ist das Beste, {0} ich je gesehen habe.", a: "was", why: "После превосходной степени (das Beste) → was." },
  { text: "Das Haus, {0} wir wohnen, ist sehr alt.", a: "in dem", why: "wohnen in + Dativ; средний род → in dem." },
  { text: "Der Ort, {0} wir uns getroffen haben, ist ein Café.", a: "wo", why: "Для места можно заменить «in dem» на wo — так короче и естественнее." },
  { text: "Die Universität, {0} ich studiere, ist in Darmstadt.", a: "an der", why: "studieren an + Dativ; женский род → an der." },
  { text: "Der Beruf, {0} er gelernt hat, gefällt ihm nicht.", a: "den", why: "Beruf — мужской род, lernen требует Akkusativ → den." },
  { text: "Die Frage, {0} du gestellt hast, ist berechtigt.", a: "die", why: "Frage — женский род, stellen требует Akkusativ → die." },
  { text: "Das Problem, {0} wir sprechen, muss gelöst werden.", a: "über das", why: "sprechen über + Akkusativ; средний род → über das." },
  { text: "Der Nachbar, {0} Hund bellt, ist verreist.", a: "dessen", why: "Genitiv мужского рода (чей пёс?) → dessen." },
  { text: "Die Eltern, {0} Kinder in der Schule sind, warten draußen.", a: "deren", why: "Genitiv множественного числа (чьи дети?) → deren." },
  { text: "Das Zimmer, {0} Fenster offen ist, ist kalt.", a: "dessen", why: "Genitiv среднего рода (чьё окно?) → dessen." },
];

/* ------------------------------------------------------------- Nebensätze --
   Задание 3.4. Обе перестановки (придаточное впереди / позади) считаются
   верными — в образце засчитывают любую, если порядок слов правильный. */

export type NebensatzPair = { a: string; b: string; konj: string; answers: string[] };

export const NEBENSATZ: NebensatzPair[] = [
  {
    a: "Man kann überall fernsehen.",
    b: "Es gibt Internet.",
    konj: "seitdem",
    answers: [
      "Man kann überall fernsehen, seitdem es Internet gibt.",
      "Seitdem es Internet gibt, kann man überall fernsehen.",
    ],
  },
  {
    a: "Er hat sein Italienisch verbessert.",
    b: "Er arbeitet im Kindergarten.",
    konj: "seitdem",
    answers: [
      "Er hat sein Italienisch verbessert, seitdem er im Kindergarten arbeitet.",
      "Seitdem er im Kindergarten arbeitet, hat er sein Italienisch verbessert.",
    ],
  },
  {
    a: "Ich bereite das Abendessen vor.",
    b: "Das Spiel fängt an.",
    konj: "bevor",
    answers: [
      "Ich bereite das Abendessen vor, bevor das Spiel anfängt.",
      "Bevor das Spiel anfängt, bereite ich das Abendessen vor.",
    ],
  },
  {
    a: "Ich besuche dich.",
    b: "Ich bin in Köln.",
    konj: "wenn",
    answers: [
      "Ich besuche dich, wenn ich in Köln bin.",
      "Wenn ich in Köln bin, besuche ich dich.",
    ],
  },
  {
    a: "Er kennt den Wald sehr gut.",
    b: "Er ist Förster von Beruf.",
    konj: "weil",
    answers: [
      "Er kennt den Wald sehr gut, weil er Förster von Beruf ist.",
      "Weil er Förster von Beruf ist, kennt er den Wald sehr gut.",
    ],
  },
  {
    a: "Ich höre Musik.",
    b: "Ich lerne Vokabeln.",
    konj: "während",
    answers: [
      "Ich höre Musik, während ich Vokabeln lerne.",
      "Während ich Vokabeln lerne, höre ich Musik.",
    ],
  },
  {
    a: "Wir gehen spazieren.",
    b: "Es regnet nicht mehr.",
    konj: "weil",
    answers: [
      "Wir gehen spazieren, weil es nicht mehr regnet.",
      "Weil es nicht mehr regnet, gehen wir spazieren.",
    ],
  },
  {
    a: "Der Zug hat Verspätung.",
    b: "Es hat geschneit.",
    konj: "weil",
    answers: [
      "Der Zug hat Verspätung, weil es geschneit hat.",
      "Weil es geschneit hat, hat der Zug Verspätung.",
    ],
  },
  {
    a: "Ich rufe dich an.",
    b: "Ich komme in Berlin an.",
    konj: "sobald",
    answers: [
      "Ich rufe dich an, sobald ich in Berlin ankomme.",
      "Sobald ich in Berlin ankomme, rufe ich dich an.",
    ],
  },
  {
    a: "Sie macht die Hausaufgaben.",
    b: "Sie isst zu Abend.",
    konj: "bevor",
    answers: [
      "Sie macht die Hausaufgaben, bevor sie zu Abend isst.",
      "Bevor sie zu Abend isst, macht sie die Hausaufgaben.",
    ],
  },
  {
    a: "Er ist sehr müde.",
    b: "Er geht noch ins Fitnessstudio.",
    konj: "obwohl",
    answers: [
      "Er ist sehr müde, obwohl er noch ins Fitnessstudio geht.",
      "Obwohl er sehr müde ist, geht er noch ins Fitnessstudio.",
    ],
  },
  {
    a: "Ich habe den Termin vergessen.",
    b: "Mein Handy war aus.",
    konj: "weil",
    answers: [
      "Ich habe den Termin vergessen, weil mein Handy aus war.",
      "Weil mein Handy aus war, habe ich den Termin vergessen.",
    ],
  },
  {
    a: "Wir warten hier.",
    b: "Der Bus kommt.",
    konj: "bis",
    answers: [
      "Wir warten hier, bis der Bus kommt.",
      "Bis der Bus kommt, warten wir hier.",
    ],
  },
  {
    a: "Du sollst dich ausruhen.",
    b: "Du bist krank.",
    konj: "weil",
    answers: [
      "Du sollst dich ausruhen, weil du krank bist.",
      "Weil du krank bist, sollst du dich ausruhen.",
    ],
  },
  {
    a: "Ich lerne Deutsch.",
    b: "Ich möchte studieren.",
    konj: "damit",
    answers: [
      "Ich lerne Deutsch, damit ich studieren kann.",
      "Damit ich studieren kann, lerne ich Deutsch.",
    ],
  },
  {
    a: "Der Unterricht beginnt.",
    b: "Alle Studenten sind da.",
    konj: "sobald",
    answers: [
      "Der Unterricht beginnt, sobald alle Studenten da sind.",
      "Sobald alle Studenten da sind, beginnt der Unterricht.",
    ],
  },
  {
    a: "Sie hat das Studium abgeschlossen.",
    b: "Sie hat ein Praktikum gemacht.",
    konj: "nachdem",
    answers: [
      "Sie hat ein Praktikum gemacht, nachdem sie das Studium abgeschlossen hat.",
      "Nachdem sie das Studium abgeschlossen hat, hat sie ein Praktikum gemacht.",
    ],
  },
  {
    a: "Ich koche Kaffee.",
    b: "Die Gäste kommen.",
    konj: "bevor",
    answers: [
      "Ich koche Kaffee, bevor die Gäste kommen.",
      "Bevor die Gäste kommen, koche ich Kaffee.",
    ],
  },
  {
    a: "Er spricht sehr gut Deutsch.",
    b: "Er lernt erst seit einem Jahr.",
    konj: "obwohl",
    answers: [
      "Er spricht sehr gut Deutsch, obwohl er erst seit einem Jahr lernt.",
      "Obwohl er erst seit einem Jahr lernt, spricht er sehr gut Deutsch.",
    ],
  },
  {
    a: "Wir müssen sparen.",
    b: "Wir wollen eine Reise machen.",
    konj: "weil",
    answers: [
      "Wir müssen sparen, weil wir eine Reise machen wollen.",
      "Weil wir eine Reise machen wollen, müssen wir sparen.",
    ],
  },
];

/* ---------------------------------------------------------------- obwohl --
   Уступка двумя способами: «obwohl» — придаточное (глагол в конец),
   «trotzdem» — наречие в главном (после него глагол на 2-й позиции,
   но допустима и середина: «er geht trotzdem joggen»). Хранятся все
   ЧЕТЫРЕ перестановки: проверка точная, и она обязана принимать каждую
   структуру, которую на экзамене засчитают как верную. */

export type ObwohlFrame = { a: string; b: string; answers: string[] };

export const OBWOHL: ObwohlFrame[] = [
  {
    a: "Er geht joggen.",
    b: "Es regnet.",
    answers: [
      "Er geht joggen, obwohl es regnet.",
      "Obwohl es regnet, geht er joggen.",
      "Es regnet, trotzdem geht er joggen.",
      "Es regnet, er geht trotzdem joggen.",
    ],
  },
  {
    a: "Sie lernt weiter.",
    b: "Sie ist müde.",
    answers: [
      "Sie lernt weiter, obwohl sie müde ist.",
      "Obwohl sie müde ist, lernt sie weiter.",
      "Sie ist müde, trotzdem lernt sie weiter.",
      "Sie ist müde, sie lernt trotzdem weiter.",
    ],
  },
  {
    a: "Wir gehen schwimmen.",
    b: "Das Wasser ist kalt.",
    answers: [
      "Wir gehen schwimmen, obwohl das Wasser kalt ist.",
      "Obwohl das Wasser kalt ist, gehen wir schwimmen.",
      "Das Wasser ist kalt, trotzdem gehen wir schwimmen.",
      "Das Wasser ist kalt, wir gehen trotzdem schwimmen.",
    ],
  },
  {
    a: "Er kauft sich ein neues Auto.",
    b: "Er hat wenig Geld.",
    answers: [
      "Er kauft sich ein neues Auto, obwohl er wenig Geld hat.",
      "Obwohl er wenig Geld hat, kauft er sich ein neues Auto.",
      "Er hat wenig Geld, trotzdem kauft er sich ein neues Auto.",
      "Er hat wenig Geld, er kauft sich trotzdem ein neues Auto.",
    ],
  },
  {
    a: "Alle haben die Prüfung bestanden.",
    b: "Die Prüfung war schwer.",
    answers: [
      "Alle haben die Prüfung bestanden, obwohl sie schwer war.",
      "Obwohl die Prüfung schwer war, haben alle bestanden.",
      "Die Prüfung war schwer, trotzdem haben alle bestanden.",
      "Die Prüfung war schwer, alle haben trotzdem bestanden.",
    ],
  },
  {
    a: "Ich bin zur Arbeit gegangen.",
    b: "Ich war krank.",
    answers: [
      "Ich bin zur Arbeit gegangen, obwohl ich krank war.",
      "Obwohl ich krank war, bin ich zur Arbeit gegangen.",
      "Ich war krank, trotzdem bin ich zur Arbeit gegangen.",
      "Ich war krank, ich bin trotzdem zur Arbeit gegangen.",
    ],
  },
  {
    a: "Das Hotel ist immer ausgebucht.",
    b: "Das Hotel ist teuer.",
    answers: [
      "Das Hotel ist immer ausgebucht, obwohl es teuer ist.",
      "Obwohl es teuer ist, ist das Hotel immer ausgebucht.",
      "Das Hotel ist teuer, trotzdem ist es immer ausgebucht.",
      "Das Hotel ist teuer, es ist trotzdem immer ausgebucht.",
    ],
  },
  {
    a: "Sie spricht sehr gut Deutsch.",
    b: "Sie hat nie in Deutschland gelebt.",
    answers: [
      "Sie spricht sehr gut Deutsch, obwohl sie nie in Deutschland gelebt hat.",
      "Obwohl sie nie in Deutschland gelebt hat, spricht sie sehr gut Deutsch.",
      "Sie hat nie in Deutschland gelebt, trotzdem spricht sie sehr gut Deutsch.",
      "Sie hat nie in Deutschland gelebt, sie spricht trotzdem sehr gut Deutsch.",
    ],
  },
  {
    a: "Wir haben den Film zu Ende gesehen.",
    b: "Der Film war lang.",
    answers: [
      "Wir haben den Film zu Ende gesehen, obwohl er lang war.",
      "Obwohl der Film lang war, haben wir ihn zu Ende gesehen.",
      "Der Film war lang, trotzdem haben wir ihn zu Ende gesehen.",
      "Der Film war lang, wir haben ihn trotzdem zu Ende gesehen.",
    ],
  },
  {
    a: "Sie fuhr mit dem Fahrrad zur Arbeit.",
    b: "Es war Winter.",
    answers: [
      "Sie fuhr mit dem Fahrrad zur Arbeit, obwohl es Winter war.",
      "Obwohl es Winter war, fuhr sie mit dem Fahrrad zur Arbeit.",
      "Es war Winter, trotzdem fuhr sie mit dem Fahrrad zur Arbeit.",
      "Es war Winter, sie fuhr trotzdem mit dem Fahrrad zur Arbeit.",
    ],
  },
  {
    a: "Er isst noch ein Stück Kuchen.",
    b: "Er ist satt.",
    answers: [
      "Er isst noch ein Stück Kuchen, obwohl er satt ist.",
      "Obwohl er satt ist, isst er noch ein Stück Kuchen.",
      "Er ist satt, trotzdem isst er noch ein Stück Kuchen.",
      "Er ist satt, er isst trotzdem noch ein Stück Kuchen.",
    ],
  },
  {
    a: "Die Kinder spielen im Garten.",
    b: "Das Wetter ist schlecht.",
    answers: [
      "Die Kinder spielen im Garten, obwohl das Wetter schlecht ist.",
      "Obwohl das Wetter schlecht ist, spielen die Kinder im Garten.",
      "Das Wetter ist schlecht, trotzdem spielen die Kinder im Garten.",
      "Das Wetter ist schlecht, die Kinder spielen trotzdem im Garten.",
    ],
  },
];

/* ------------------------------------------------------- damit ↔ um … zu --
   «um … zu» возможно ТОЛЬКО когда подлежащее в обеих частях одно и то же;
   иначе остаётся «damit». Поэтому направление преобразования хранится в
   кадре, а не выбирается случайно: подмена направления делает упражнение
   грамматически нерешаемым. Ответ один — это трансформация, а не выбор. */

export type UmZuFrame = { text: string; answers: string[]; why: string };

export const UMZU: UmZuFrame[] = [
  {
    text: "Ich spare Geld, damit ich ein Auto kaufen kann.",
    answers: ["Ich spare Geld, um ein Auto zu kaufen."],
    why: "Подлежащее одно (ich) → «um … zu». Модальный «kann» исчезает: um + Infinitiv Präsens.",
  },
  {
    text: "Er lernt Deutsch, damit er in Kiel studieren kann.",
    answers: ["Er lernt Deutsch, um in Kiel zu studieren."],
    why: "um + zu + Infinitiv. «damit» нужен был бы, только если бы в придаточном было другое подлежащее.",
  },
  {
    text: "Sie macht Sport, damit sie abnehmen kann.",
    answers: ["Sie macht Sport, um abzunehmen."],
    why: "abnehmen — отделяемое: zu стоит внутри, между приставкой и корнем → «abzunehmen».",
  },
  {
    text: "Wir fahren mit dem Fahrrad, damit wir Sport machen.",
    answers: ["Wir fahren mit dem Fahrrad, um Sport zu machen."],
    why: "В «um … zu»-обороте не бывает своего подлежащего и не бывает спрягаемого глагола — только zu + Infinitiv.",
  },
  {
    text: "Ich gehe früh ins Bett, damit ich morgen fit bin.",
    answers: ["Ich gehe früh ins Bett, um morgen fit zu sein."],
    why: "Даже sein в um…zu-обороте стоит в инфинитиве: um … fit zu sein.",
  },
  {
    text: "Sie bleibt zu Hause, damit sie sich ausruhen kann.",
    answers: ["Sie bleibt zu Hause, um sich auszuruhen."],
    why: "Возвратное sich остаётся в обороте: um sich auszuruhen. Приставка aus- → aus…zu.",
  },
  {
    text: "Ich nehme den Bus, um pünktlich zu sein.",
    answers: ["Ich nehme den Bus, damit ich pünktlich bin."],
    why: "Обратно: um…zu → damit. В придаточном появляется спрягаемый глагол (bin) в конце.",
  },
  {
    text: "Er geht zur Sprachschule, um besser Deutsch zu sprechen.",
    answers: ["Er geht zur Sprachschule, damit er besser Deutsch spricht."],
    why: "um…zu → damit: подлежащее er получает глагол в Präsens, который уходит в конец придаточного.",
  },
  {
    text: "Wir öffnen das Fenster, um frische Luft zu bekommen.",
    answers: ["Wir öffnen das Fenster, damit wir frische Luft bekommen."],
    why: "bekommen спрягается: damit wir … bekommen. Подлежащее мы обязаны назвать — в придаточном с damit оно есть.",
  },
  {
    text: "Sie übt jeden Tag, um die Prüfung zu bestehen.",
    answers: ["Sie übt jeden Tag, damit sie die Prüfung besteht."],
    why: "bestehen — сильный глагол (besteht). Um…zu превратился в придаточное с тем же смыслом цели.",
  },
];

/* ------------------------------------------------------ Infinitiv mit zu --
   Форма zu + Infinitiv полностью регулярна и выводится из таблицы глаголов:
   отделяемая приставка → приставка + zu + корень (fernzusehen),
   неотделяемая → zu перед глаголом (zu besuchen). Ничего не «сочиняем».

   Кадр: предложение с дыркой {0} и глагол в инфинитиве — он идёт в hint. */

export type InfZuFrame = { text: string; v: string };

export const INFINITIVZU: InfZuFrame[] = [
  { text: "Ich habe heute keine Zeit, {0}.", v: "einkaufen" },
  { text: "Versprich mir, {0}!", v: "anrufen" },
  { text: "Er vergisst oft, {0}.", v: "aufräumen" },
  { text: "Wir haben vor, {0}.", v: "umziehen" },
  { text: "Es ist wichtig, jeden Tag {0}.", v: "lernen" },
  { text: "Sie hat Angst, {0}.", v: "fliegen" },
  { text: "Ich versuche, weniger {0}.", v: "fernsehen" },
  { text: "Hast du Lust, {0}?", v: "mitkommen" },
  { text: "Er hat keine Lust, {0}.", v: "abwaschen" },
  { text: "Es macht Spaß, alte Autos {0}.", v: "reparieren" },
  { text: "Es ist schön, am Wochenende lange {0}.", v: "schlafen" },
  { text: "Er freut sich, dich wieder {0}.", v: "sehen" },
  { text: "Vergiss nicht, die Gäste {0}!", v: "einladen" },
  { text: "Es ist schwer, früh {0}.", v: "aufstehen" },
  { text: "Ich habe vor, am Samstag {0}.", v: "aufräumen" },
  { text: "Wir haben vor, nach Kiel {0}.", v: "umziehen" },
];

/* --------------------------------------------- nachdem + Plusquamperfekt --
   Порядок: сначала ЧТО было сделано (объект, Partizip II, вспомогательный),
   потом — главное предложение в Präteritum. Вспомогательный зависит от
   глагола (haben/sein) и лица, поэтому ответ выводится из таблицы, а лицо
   фиксировано в кадре: фраза «Nachdem wir …» с «hatte» — ошибка, которую
   упражнение не имеет права показывать.

   Кадр: text c тремя дырками {0} объект {1} Partizip {2} вспомогательный,
   лицо, глагол, объект для hint. */

export type PlusquamFrame = { text: string; v: string; obj: string; p: number; hint: string };

export const PLUSQUAM: PlusquamFrame[] = [
  { text: "Nachdem ich {0} {1} {2}, ging ich ins Bett.", v: "kochen", obj: "das Abendessen", p: 0, hint: "das Abendessen, kochen" },
  { text: "Nachdem er {0} {1} {2}, fuhr er nach Hause.", v: "beenden", obj: "die Arbeit", p: 2, hint: "die Arbeit, beenden" },
  { text: "Nachdem wir {0} {1} {2}, gingen wir spazieren.", v: "essen", obj: "zu Abend", p: 3, hint: "zu Abend essen" },
  { text: "Nachdem der Zug {0} {1}, standen wir auf.", v: "ankommen", obj: "", p: 2, hint: "ankommen" },
  { text: "Nachdem sie {0} {1} {2}, ging sie zum Arzt.", v: "haben", obj: "Fieber", p: 2, hint: "Fieber, haben" },
  { text: "Nachdem ich {0} {1} {2}, ging ich einkaufen.", v: "machen", obj: "die Hausaufgaben", p: 0, hint: "die Hausaufgaben, machen" },
  { text: "Nachdem ihr {0} {1}, konntet ihr gehen.", v: "aufstehen", obj: "", p: 4, hint: "aufstehen" },
  { text: "Nachdem wir alle Vorbereitungen {0} {1}, begann der Unterricht.", v: "treffen", obj: "", p: 3, hint: "treffen" },
  { text: "Nachdem der Film {0} {1}, gingen wir nach Hause.", v: "sein", obj: "zu Ende", p: 2, hint: "zu Ende sein" },
  { text: "Nachdem ich {0} {1} {2}, schrieb ich ihr eine E-Mail.", v: "finden", obj: "ihre Adresse", p: 0, hint: "ihre Adresse, finden" },
  { text: "Nachdem du {0} {1} {2}, konntest du fernsehen.", v: "lernen", obj: "die Vokabeln", p: 1, hint: "die Vokabeln, lernen" },
  { text: "Nachdem wir {0} {1} {2}, machten wir einen Spaziergang.", v: "kochen", obj: "das Mittagessen", p: 3, hint: "das Mittagessen, kochen" },
  { text: "Nachdem sie {0} {1} {2}, ging sie schlafen.", v: "putzen", obj: "die Zähne", p: 2, hint: "die Zähne, putzen" },
];

/* ------------------------------------------------------------------ Passiv --
   Passiv Präsens = wird/werden + Partizip II. Аккузатив-объект становится
   подлежащим, поэтому число (ед./мн.) задано в кадре — форма werden обязана
   согласоваться с НОВЫМ подлежащим, а не с деятелем. */

export type PassivFrame = { text: string; v: string; plural: boolean };

export const PASSIV: PassivFrame[] = [
  { text: "Die Wohnung {0} jeden Freitag {1}.", v: "putzen", plural: false },
  { text: "Das Auto {0} schon {1}.", v: "reparieren", plural: false },
  { text: "Die Hausaufgaben {0} im Klassenzimmer {1}.", v: "machen", plural: true },
  { text: "Das Brot {0} jeden Morgen {1}.", v: "kaufen", plural: false },
  { text: "Die Gäste {0} zum Fest {1}.", v: "einladen", plural: true },
  { text: "Das Zimmer {0} gerade {1}.", v: "aufräumen", plural: false },
  { text: "Die E-Mails {0} jeden Tag {1}.", v: "schreiben", plural: true },
  { text: "Die Rechnung {0} per Karte {1}.", v: "bezahlen", plural: false },
  { text: "Die Frage {0} nicht {1}.", v: "verstehen", plural: false },
  { text: "Die Fenster {0} im Sommer {1}.", v: "öffnen", plural: true },
  { text: "Das Museum {0} von Touristen {1}.", v: "besichtigen", plural: false },
  { text: "Die Suppe {0} langsam {1}.", v: "kochen", plural: false },
  { text: "Die Getränke {0} schon {1}.", v: "mitbringen", plural: true },
  { text: "Der Termin {0} leider {1}.", v: "vergessen", plural: false },
  { text: "Die Schlüssel {0} zum Glück {1}.", v: "finden", plural: true },
];

/* ---------------------------------------------------------- Konjunktiv II --
   Нерегулярные формы (wäre, hätte, könnte, müsste, dürfte) берутся из
   Präteritumstamm — они в кадрах явно, потому что «würde + Infinitiv»
   работает не для всех глаголов и студенту нужно видеть именно сильные. */

export type Konj2Frame = { text: string; answers: string[]; hint: string; why: string };

export const KONJ2: Konj2Frame[] = [
  {
    text: "Wenn ich mehr Zeit {0}, würde ich jeden Tag Sport machen.",
    answers: ["hätte"],
    hint: "(haben)",
    why: "haben в Konjunktiv II — hätte (не «würde haben»). Это форма из Präteritumstamm + e.",
  },
  {
    text: "Wenn er reich {0}, würde er nicht mehr arbeiten.",
    answers: ["wäre"],
    hint: "(sein)",
    why: "sein в Konjunktiv II — wäre. Не «würde sein».",
  },
  {
    text: "An deiner Stelle {0} ich sofort {1}.",
    answers: ["würde", "gehen"],
    hint: "(gehen)",
    why: "Обычный глагол: würde на 2-й позиции + Infinitiv в конце. «An deiner Stelle» — типовой триггер Konjunktiv II. Форма ginge существует, но в живой речи почти вытеснена — стандарт сегодня: würde … gehen.",
  },
  {
    text: "Wenn ich das Geld {0}, würde ich eine Reise machen.",
    answers: ["hätte"],
    hint: "(haben)",
    why: "Условие нереально → Konjunktiv II: hätte.",
  },
  {
    text: "Ich {0} gern besser Deutsch sprechen.",
    answers: ["könnte"],
    hint: "(können)",
    why: "können → könnte. Модальные глаголы в KII имеют свою форму: könnte, müsste, dürfte, sollte.",
  },
  {
    text: "Was {0} du an meiner Stelle machen?",
    answers: ["würdest"],
    hint: "(tun → würde)",
    why: "würde спрягается: ich würde, du würdest, er würde, wir würden.",
  },
  {
    text: "Es {0} schön, dich zu sehen.",
    answers: ["wäre"],
    hint: "(sein)",
    why: "Es wäre schön … — вежливая и ирреальная формулировка через wäre.",
  },
  {
    text: "Wenn wir ein Auto {0}, könnten wir Ausflüge machen.",
    answers: ["hätten"],
    hint: "(haben)",
    why: "wir → hätten. Оба предложения стоят в Konjunktiv II.",
  },
  {
    text: "Wenn du mich fragst, {0} du das Angebot annehmen.",
    answers: ["solltest"],
    hint: "(sollen)",
    why: "sollen → solltest. Модальный глагол остаётся спрягаемым, Infinitiv уходит в конец.",
  },
  {
    text: "Ohne Brille {0} ich nichts sehen.",
    answers: ["könnte"],
    hint: "(können)",
    why: "«Ohne …» = нереальное условие без wenn → KII: könnte.",
  },
  {
    text: "Wenn er nicht so viel rauchen {0}, wäre er fitter.",
    answers: ["würde"],
    hint: "(rauchen)",
    why: "rauchen — обычный глагол, поэтому würde + Infinitiv, а не отдельная форма.",
  },
  {
    text: "Wenn ich an deiner Stelle {0}, würde ich um Hilfe bitten.",
    answers: ["wäre"],
    hint: "(sein)",
    why: "«an deiner Stelle wäre ich …» — ирреальное сравнение: wäre, не würde sein.",
  },
];

/* ------------------------------------------------ Verben mit Präpositionen --
   Предлог у глагола словарный, менять нельзя: warten AUF, но fragen NACH.
   Контекст в кадре обязателен там, где глагол допускает два предлога с
   разным смыслом (sich freuen auf — будущее, über — уже случившееся). */

export type VerbPraepFrame = { text: string; prep: string; hint: string; why: string };

export const VERBEN_PRAEP: VerbPraepFrame[] = [
  { text: "Ich warte {0} den Bus.", prep: "auf", hint: "(warten)", why: "warten auf + Akkusativ — всегда auf, независимо от того, жду я человека или автобус." },
  { text: "Er freut sich {0} den Urlaub.", prep: "auf", hint: "(sich freuen)", why: "sich freuen auf + Akk — предвкушение (отпуск ещё не был). Отпразднованное — über." },
  { text: "Sie freut sich {0} das Geschenk.", prep: "über", hint: "(sich freuen)", why: "sich freuen über + Akk — радость уже случившемуся (подарок получен)." },
  { text: "Wir interessieren uns {0} die Geschichte Deutschlands.", prep: "für", hint: "(sich interessieren)", why: "sich interessieren für + Akkusativ." },
  { text: "Er ärgert sich {0} den Lärm.", prep: "über", hint: "(sich ärgern)", why: "sich ärgern über + Akkusativ — сердиться на что-то." },
  { text: "Ich denke oft {0} meine Kindheit.", prep: "an", hint: "(denken)", why: "denken an + Akkusativ." },
  { text: "Ich erinnere mich {0} den Namen.", prep: "an", hint: "(sich erinnern)", why: "sich erinnern an + Akkusativ." },
  { text: "Sie nimmt {0} dem Kurs teil.", prep: "an", hint: "(teilnehmen)", why: "teilnehmen an + Dativ. «teil» отделяется в конце: nimmt teil." },
  { text: "Ich gewöhne mich {0} das Wetter.", prep: "an", hint: "(sich gewöhnen)", why: "sich gewöhnen an + Akkusativ — привыкать к чему-то." },
  { text: "Wir unterhalten uns {0} den Urlaub.", prep: "über", hint: "(sich unterhalten)", why: "sich unterhalten über + Akkusativ — разговаривать о чём-то." },
  { text: "Sie bewirbt sich {0} eine Stelle als Lehrerin.", prep: "um", hint: "(sich bewerben)", why: "sich bewerben um + Akkusativ — претендовать на что-то." },
  { text: "Ich habe Angst {0} Hunden.", prep: "vor", hint: "(Angst haben)", why: "Angst haben vor + Dativ." },
  { text: "Das hängt {0} der Tagesform ab.", prep: "von", hint: "(abhängen)", why: "abhängen von + Dativ. «ab» отделяется в конец." },
  { text: "Er entschuldigt sich {0} seiner Lehrerin.", prep: "bei", hint: "(sich entschuldigen)", why: "sich entschuldigen bei + Dativ — у кого извиняюсь. За что — für." },
  { text: "Wir kümmern uns {0} unsere Großeltern.", prep: "um", hint: "(sich kümmern)", why: "sich kümmern um + Akkusativ — заботиться о ком-то." },
  { text: "Es handelt sich {0} ein wichtiges Problem.", prep: "um", hint: "(es handelt sich)", why: "es handelt sich um + Akkusativ — речь идёт о чём-то." },
  { text: "Sie fragt {0} dem Weg.", prep: "nach", hint: "(fragen)", why: "fragen nach + Dativ — спрашивать о чём-то. Человека — wen fragen." },
  { text: "Ich verlasse mich {0} dich.", prep: "auf", hint: "(sich verlassen)", why: "sich verlassen auf + Akkusativ — полагаться на кого-то." },
];

/* ----------------------------------------------------- Doppelkonnektoren --
   Пары стоят по обе стороны от запятой или в одной клаузе; оба слова —
   две дырки. Порядок слов после второй части (desto → сразу глагол)
   вшит в текст кадра, чтобы он не собирался заново. */

export type DoppelkonnFrame = { text: string; first: string; second: string; why: string };

export const DOPPELKONN: DoppelkonnFrame[] = [
  { text: "Er ist {0} müde {1} hungrig.", first: "weder", second: "noch", why: "weder … noch — двойное отрицание: «ни … ни». Соединяет члены предложения, поэтому запятой нет (Duden)." },
  { text: "{0} gehe ich ins Kino, {1} bleibe ich zu Hause.", first: "entweder", second: "oder", why: "entweder … oder — «или … или». После oder в новой клаузе глагол на 2-й позиции." },
  { text: "Sie spricht {0} Deutsch {1} Englisch.", first: "sowohl", second: "als auch", why: "sowohl … als auch — «и … и», оба элемента верны. Соединяет члены предложения — запятой нет (Duden)." },
  { text: "Er ist {0} intelligent, {1} fleißig.", first: "nicht nur", second: "sondern auch", why: "nicht nur … sondern auch — «не только … но и»." },
  { text: "{0} mehr du übst, {1} besser sprichst du.", first: "je", second: "desto", why: "je … desto + Komparativ. После desto глагол идёт сразу: desto besser sprichst du." },
  { text: "{0} regnet es, {1} scheint die Sonne.", first: "bald", second: "bald", why: "bald … bald — «то … то». В начале клаузы слово получает заглавную букву." },
  { text: "Ich habe {0} Zeit {1} Lust.", first: "weder", second: "noch", why: "weder … noch — оба отрицания нужны: ни времени, ни желания." },
  { text: "{0} du kommst jetzt, {1} du wartest bis morgen.", first: "entweder", second: "oder", why: "entweder … oder — два взаимоисключающих варианта. Глагол сразу после oder." },
  { text: "Das Buch ist {0} spannend {1} lustig.", first: "sowohl", second: "als auch", why: "sowohl … als auch соединяет прилагательные без повторов, запятой нет (Duden)." },
  { text: "Sie ist {0} Lehrerin, {1} Mutter.", first: "nicht nur", second: "sondern auch", why: "nicht nur … sondern auch — здесь без артиклей: обе роли." },
  { text: "{0} mehr er isst, {1} dicker wird er.", first: "je", second: "desto", why: "je … desto — обе части содержат Komparativ; после desto сразу спрягаемый глагол." },
  { text: "{0} telefoniert er, {1} schreibt er E-Mails.", first: "bald", second: "bald", why: "bald … bald — действия чередуются." },
];

/* ------------------------------------------------- Präteritum im Erzählen --
   В кадрах только 1-е и 3-е лицо ед. числа: у них форма Präteritum совпадает
   с той, что хранится в таблице (praet). Для du/ihr/wir она выводится иначе
   (fandest, fuhren), и автоматика на этом уже ломалась — не повторяем.
   Отделяемые: praet остаётся на 2-й позиции, приставка уходит в конец. */

export type PraetFrame = { text: string; v: string; twoGaps: boolean; hint: string };

export const PRAETERITUM: PraetFrame[] = [
  { text: "Gestern {0} ich um sechs {1}.", v: "aufstehen", twoGaps: true, hint: "(aufstehen)" },
  { text: "Der Zug {0} zehn Minuten {1}.", v: "abfahren", twoGaps: true, hint: "(abfahren)" },
  { text: "Sie {0} ihre Mutter gestern Abend {1}.", v: "anrufen", twoGaps: true, hint: "(anrufen)" },
  { text: "Er {0} gestern bis Mittag.", v: "schlafen", twoGaps: false, hint: "(schlafen)" },
  { text: "Ich {0} ihm den Schlüssel.", v: "geben", twoGaps: false, hint: "(geben)" },
  { text: "Der Bus {0} zehn Minuten später {1}.", v: "ankommen", twoGaps: true, hint: "(ankommen)" },
  { text: "Er {0} alle Freunde zum Geburtstag {1}.", v: "einladen", twoGaps: true, hint: "(einladen)" },
  { text: "Ich {0} gestern nichts {1}.", v: "mitbringen", twoGaps: true, hint: "(mitbringen)" },
  { text: "Ich {0} die Frage nicht.", v: "verstehen", twoGaps: false, hint: "(verstehen)" },
  { text: "Der Film {0} erst um neun {1}.", v: "anfangen", twoGaps: true, hint: "(anfangen)" },
  { text: "Sie {0} den Roman in zwei Tagen.", v: "lesen", twoGaps: false, hint: "(lesen)" },
  { text: "Ich {0} am Hauptbahnhof {1}.", v: "aussteigen", twoGaps: true, hint: "(aussteigen)" },
  { text: "Das Kind {0} ein Lied.", v: "singen", twoGaps: false, hint: "(singen)" },
  { text: "Sie {0} sehr schnell.", v: "sprechen", twoGaps: false, hint: "(sprechen)" },
  { text: "Ich {0} zum Glück {1}.", v: "mitkommen", twoGaps: true, hint: "(mitkommen)" },
  { text: "Das Konzert {0} im Park {1}.", v: "stattfinden", twoGaps: true, hint: "(stattfinden)" },
  { text: "Ich {0} ihn zufällig am Bahnhof.", v: "treffen", twoGaps: false, hint: "(treffen)" },
  { text: "Sie {0} den ganzen Tag zu Hause.", v: "bleiben", twoGaps: false, hint: "(bleiben)" },
  { text: "Er {0} die Getränke.", v: "bringen", twoGaps: false, hint: "(bringen)" },
  { text: "Ich {0} lange an meine Kindheit.", v: "denken", twoGaps: false, hint: "(denken)" },
];

/* ---------------------------------------------------- Wortbildung: Nomen --
   Три словарных шаблона, каждый со своим родом: -ung → die (всегда),
   -er → der (человек/прибор), номинализированный инфинитив → das.
   Род здесь не «правило по звучанию», а часть слова — поэтому шаблон
   хранится вместе со словом, а не выводится. */

export type WortbildFrame = { inf: string; nomen: string; why: string };

export const WORDBILD: WortbildFrame[] = [
  { inf: "wohnen", nomen: "die Wohnung", why: "Глагол → -ung: die Wohnung. Все слова на -ung — женского рода." },
  { inf: "einladen", nomen: "die Einladung", why: "einladen → die Einladung. Отделяемая приставка остаётся внутри слова: ein + lad + ung." },
  { inf: "prüfen", nomen: "die Prüfung", why: "prüfen → die Prüfung (с умлаутом — он уже в слове)." },
  { inf: "übersetzen", nomen: "die Übersetzung", why: "übersetzen → die Übersetzung. Неотделяемая приставка über- сохраняется." },
  { inf: "sich anmelden", nomen: "die Anmeldung", why: "sich anmelden → die Anmeldung. Возвратное местоимение в существительное не переходит." },
  { inf: "meinen", nomen: "die Meinung", why: "meinen → die Meinung. -ung всегда die, даже когда основа на -n." },
  { inf: "hoffnen", nomen: "die Hoffnung", why: "hoffnen → die Hoffnung, f." },
  { inf: "üben", nomen: "die Übung", why: "üben → die Übung." },
  { inf: "bewegen", nomen: "die Bewegung", why: "bewegen → die Bewegung, f." },
  { inf: "erklären", nomen: "die Erklärung", why: "erklären → die Erklärung. Неотделяемая er- приставка." },
  { inf: "entscheiden", nomen: "die Entscheidung", why: "entscheiden → die Entscheidung, f." },
  { inf: "rechnen", nomen: "die Rechnung", why: "rechnen → die Rechnung, f (счёт)." },
  { inf: "sich bewerben", nomen: "die Bewerbung", why: "sich bewerben → die Bewerbung, f (заявка)." },
  { inf: "arbeiten", nomen: "der Arbeiter", why: "Глагол → -er = человек: der Arbeiter. Все на -er (лицо) — der." },
  { inf: "lehren", nomen: "der Lehrer", why: "lehren → der Lehrer, der." },
  { inf: "verkaufen", nomen: "der Verkäufer", why: "verkaufen → der Verkäufer. Неотделяемая ver- + -er." },
  { inf: "fahren", nomen: "der Fahrer", why: "fahren → der Fahrer, der (водитель)." },
  { inf: "essen", nomen: "das Essen", why: "Инфинитив как существительное: das Essen — с большой буквы, средний род, без изменений." },
  { inf: "rauchen", nomen: "das Rauchen", why: "das Rauchen — номинализированный инфинитив, das." },
  { inf: "schwimmen", nomen: "das Schwimmen", why: "das Schwimmen — номинализированный инфинитив, das." },
  { inf: "sprechen", nomen: "das Sprechen", why: "das Sprechen — номинализированный инфинитив, das." },
];

/* --------------------------------------------------- Grammatik-Mix ------
   Реальный экзамен (со слов хозяина): есть задания, где В ОДНОМ наборе
   надо ставить глаголы в РАЗНЫЕ времена и формы (Präteritum, Perfekt,
   Passiv, Futur, Konjunktiv II — вперемешку), и «5 предложений — поставь
   каждое в указанную форму». Отсюда два кадра:

   ZEITMIX: дырка одна, в скобке — инфинитив и ЦЕЛЕВАЯ ФОРМА. Форма
   однозначна, проверка остаётся точной.
   UMFORM: дано предложение, задача — перестроить в указанную форму.
   Ответ — целое предложение, все грамматичные варианты в answers. */

export type ZeitmixFrame = { text: string; inf: string; form: string; answers: string[]; why: string };

export const ZEITMIX: ZeitmixFrame[] = [
  { text: "Gestern {0} ich, dass die Prüfung schwer war.", inf: "wissen", form: "Präteritum", answers: ["wusste"], why: "wissen → wusste: сильный глагол, гласная меняется." },
  { text: "Ich {0} diesen Film schon zweimal.", inf: "sehen", form: "Perfekt", answers: ["habe gesehen"], why: "Perfekt = haben (sehen — haben) + Partizip II gesehen." },
  { text: "Das Auto {0} gerade.", inf: "reparieren", form: "Passiv Präsens", answers: ["wird repariert"], why: "Passiv Präsens = wird + Partizip II; деятель не назван." },
  { text: "Morgen {0} wir nach Hamburg.", inf: "fahren", form: "Futur I", answers: ["werden fahren"], why: "Futur I = werden (позиция 2) + Infinitiv в конце." },
  { text: "Er {0} um sechs Uhr.", inf: "aufstehen", form: "Präteritum", answers: ["stand auf"], why: "aufstehen → stand auf: сильный Präteritum + приставка в конец." },
  { text: "Die Briefe {0} gestern.", inf: "schreiben", form: "Passiv Präteritum", answers: ["wurden geschrieben"], why: "Passiv Präteritum = wurden + Partizip II." },
  { text: "Ich {0} mehr Zeit.", inf: "haben", form: "Konjunktiv II", answers: ["hätte"], why: "haben в KII — hätte, не «würde haben»." },
  { text: "Wir {0} das Buch schon.", inf: "lesen", form: "Perfekt", answers: ["haben gelesen"], why: "lesen — haben-глагол: haben gelesen." },
  { text: "Die Straße {0} letztes Jahr.", inf: "bauen", form: "Passiv Präteritum", answers: ["wurde gebaut"], why: "Passiv Präteritum: wurde + gebaut." },
  { text: "Ohne Auto {0} ich jeden Tag zur Arbeit.", inf: "gehen", form: "Präteritum", answers: ["ging"], why: "gehen → ging." },
  { text: "Der Termin {0} leider.", inf: "vergessen", form: "Passiv Präsens", answers: ["wird vergessen"], why: "vergessen — неотделяемая приставка, Partizip II без ge-: vergessen." },
  { text: "Er {0} gestern bis Mittag.", inf: "schlafen", form: "Perfekt", answers: ["hat geschlafen"], why: "schlafen — haben-глагол: hat geschlafen." },
];

export type UmformFrame = { form: string; given: string; answers: string[]; why: string };

export const UMFORM: UmformFrame[] = [
  { form: "Präteritum", given: "Er geht ins Kino.", answers: ["Er ging ins Kino."], why: "gehen → ging: сильный глагол, 1/3 лицо совпадают." },
  { form: "Perfekt", given: "Sie kauft ein Auto.", answers: ["Sie hat ein Auto gekauft."], why: "kaufen — haben-глагол: hat … gekauft." },
  { form: "Passiv Präsens", given: "Man repariert das Auto.", answers: ["Das Auto wird repariert."], why: "Аккузатив-объект становится подлежащим; man исчезает: wird + repariert." },
  { form: "Passiv Präteritum", given: "Man baute die Brücke 1935.", answers: ["Die Brücke wurde 1935 gebaut."], why: "Passiv Präteritum: wurde + Partizip II; обстоятельство остаётся." },
  { form: "Futur I", given: "Ich komme morgen.", answers: ["Ich werde morgen kommen."], why: "werden на позиции 2 + Infinitiv в конец." },
  { form: "Konjunktiv II", given: "Ich habe keine Zeit.", answers: ["Ich hätte keine Zeit."], why: "haben → hätte: форма из Präteritumstamm, не würde haben." },
  { form: "Präteritum", given: "Sie schreibt einen Brief.", answers: ["Sie schrieb einen Brief."], why: "schreiben → schrieb." },
  { form: "Perfekt", given: "Er steht um sechs auf.", answers: ["Er ist um sechs aufgestanden."], why: "aufstehen — sein-глагол (смена состояния): ist … aufgestanden, приставка внутри Partizip." },
  { form: "Passiv mit Modalverb", given: "Man muss die Regeln beachten.", answers: ["Die Regeln müssen beachtet werden."], why: "Пассив с модальным: müssen + Partizip II + werden В САМОМ КОНЦЕ." },
  { form: "Perfekt", given: "Wir fuhren nach Berlin.", answers: ["Wir sind nach Berlin gefahren."], why: "Präteritum → Perfekt: fahren — sein-глагол: sind … gefahren." },
  { form: "Konjunktiv II", given: "Du musst mehr lernen.", answers: ["Du müsstest mehr lernen."], why: "müssen → müsste: модальные имеют собственную форму KII." },
  { form: "Passiv Perfekt", given: "Man hat das Fenster geöffnet.", answers: ["Das Fenster ist geöffnet worden."], why: "Passiv Perfekt = ist + Partizip II + worden. Не «ist geworden»!" },
];

/* ----------------------------------------------------------- прилагательные */

export type Adj = { base: string; komp: string; sup: string; umlaut?: boolean };

export const ADJEKTIVE: Adj[] = [
  { base: "schnell", komp: "schneller", sup: "am schnellsten" },
  { base: "langsam", komp: "langsamer", sup: "am langsamsten" },
  { base: "schön", komp: "schöner", sup: "am schönsten" },
  { base: "ruhig", komp: "ruhiger", sup: "am ruhigsten" },
  { base: "laut", komp: "lauter", sup: "am lautesten" },
  { base: "fleißig", komp: "fleißiger", sup: "am fleißigsten" },
  { base: "faul", komp: "fauler", sup: "am faulsten" },
  { base: "sauber", komp: "sauberer", sup: "am saubersten" },
  { base: "billig", komp: "billiger", sup: "am billigsten" },
  { base: "teuer", komp: "teurer", sup: "am teuersten" },
  { base: "alt", komp: "älter", sup: "am ältesten" },
  { base: "jung", komp: "jünger", sup: "am jüngsten" },
  { base: "groß", komp: "größer", sup: "am größten" },
  { base: "klein", komp: "kleiner", sup: "am kleinsten" },
  { base: "lang", komp: "länger", sup: "am längsten" },
  { base: "kurz", komp: "kürzer", sup: "am kürzesten" },
  { base: "hoch", komp: "höher", sup: "am höchsten" },
  { base: "tief", komp: "tiefer", sup: "am tiefsten" },
  { base: "warm", komp: "wärmer", sup: "am wärmsten" },
  { base: "kalt", komp: "kälter", sup: "am kältesten" },
  { base: "stark", komp: "stärker", sup: "am stärksten" },
  { base: "schwach", komp: "schwächer", sup: "am schwächsten" },
  { base: "gut", komp: "besser", sup: "am besten" },
  { base: "viel", komp: "mehr", sup: "am meisten" },
  { base: "gern", komp: "lieber", sup: "am liebsten" },
  { base: "nah", komp: "näher", sup: "am nächsten" },
  { base: "dunkel", komp: "dunkler", sup: "am dunkelsten" },
  { base: "leise", komp: "leiser", sup: "am leisesten" },
  { base: "freundlich", komp: "freundlicher", sup: "am freundlichsten" },
  { base: "modern", komp: "moderner", sup: "am modernsten" },
];

/** антонимы для 4.2 — с проверкой, что это не отрицание.
    В образце прямо запрещено писать «nicht ruhig» или «unruhig»: нужен
    самостоятельный антоним, иначе упражнение ничему не учит. */
export const GEGENTEIL: { a: string; answers: string[] }[] = [
  { a: "ruhig", answers: ["laut", "wild"] },
  { a: "gut", answers: ["schlecht", "böse"] },
  { a: "schön", answers: ["hässlich", "grässlich"] },
  { a: "schnell", answers: ["langsam"] },
  { a: "fleißig", answers: ["faul"] },
  { a: "hoch", answers: ["tief", "niedrig", "flach"] },
  { a: "alt", answers: ["jung", "neu"] },
  { a: "groß", answers: ["klein"] },
  { a: "warm", answers: ["kalt"] },
  { a: "hell", answers: ["dunkel"] },
  { a: "teuer", answers: ["billig", "günstig"] },
  { a: "schwer", answers: ["leicht", "einfach"] },
  { a: "früh", answers: ["spät"] },
  { a: "offen", answers: ["geschlossen", "zu"] },
  { a: "sauber", answers: ["schmutzig", "dreckig"] },
  { a: "stark", answers: ["schwach"] },
  { a: "breit", answers: ["schmal", "eng"] },
  { a: "leise", answers: ["laut"] },
  { a: "nass", answers: ["trocken"] },
  { a: "voll", answers: ["leer"] },
  /* расширение: 20 пар выучивались за 3-4 раунда — пул должен пережить
     неделю ежедневных повторений перед 4.2 */
  { a: "dunkel", answers: ["hell"] },
  { a: "kalt", answers: ["warm", "heiß"] },
  { a: "klein", answers: ["groß"] },
  { a: "jung", answers: ["alt"] },
  { a: "spät", answers: ["früh"] },
  { a: "lang", answers: ["kurz"] },
  { a: "dick", answers: ["dünn"] },
  { a: "eng", answers: ["weit", "breit"] },
  { a: "trocken", answers: ["nass"] },
  { a: "leer", answers: ["voll"] },
  { a: "laut", answers: ["leise"] },
  { a: "schwach", answers: ["stark"] },
  { a: "billig", answers: ["teuer", "günstig"] },
  { a: "leicht", answers: ["schwer", "schwierig"] },
  { a: "neu", answers: ["alt"] },
  { a: "reich", answers: ["arm"] },
];
