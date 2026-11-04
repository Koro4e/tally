"use strict";

// src/lib/de/data.ts
var PERFEKT = [
  /* правильные */
  { v: "kochen", p: 0, text: "Ich {0} heute Mittag eine Suppe {1}." },
  { v: "machen", p: 2, text: "Er {0} seine Hausaufgaben schon {1}." },
  { v: "arbeiten", p: 3, text: "Wir {0} gestern bis acht Uhr {1}." },
  { v: "wohnen", p: 0, text: "Ich {0} drei Jahre in Kiel {1}." },
  { v: "lernen", p: 4, text: "Ihr {0} f\xFCr die Pr\xFCfung viel {1}." },
  { v: "spielen", p: 5, text: "Die Kinder {0} den ganzen Nachmittag im Garten {1}." },
  { v: "kaufen", p: 1, text: "Du {0} ein neues Fahrrad {1}." },
  { v: "suchen", p: 2, text: "Sie {0} den Schl\xFCssel \xFCberall {1}." },
  { v: "h\xF6ren", p: 0, text: "Ich {0} die Nachrichten noch nicht {1}." },
  { v: "sagen", p: 2, text: "Er {0} mir die Wahrheit nicht {1}." },
  { v: "fragen", p: 1, text: "Du {0} den Lehrer nach dem Termin {1}." },
  { v: "antworten", p: 5, text: "Die Studenten {0} auf alle Fragen {1}." },
  { v: "brauchen", p: 3, text: "Wir {0} l\xE4nger als geplant {1}." },
  { v: "\xF6ffnen", p: 2, text: "Der Lehrer {0} das Fenster {1}." },
  { v: "warten", p: 0, text: "Ich {0} eine halbe Stunde auf dich {1}." },
  { v: "putzen", p: 4, text: "Ihr {0} die K\xFCche gr\xFCndlich {1}." },
  { v: "renovieren", p: 3, text: "Wir {0} die Wohnung im Sommer {1}." },
  { v: "studieren", p: 2, text: "Er {0} in Darmstadt Maschinenbau {1}." },
  { v: "telefonieren", p: 0, text: "Ich {0} heute mit meiner Mutter {1}." },
  { v: "probieren", p: 1, text: "Du {0} den Kuchen noch nicht {1}." },
  { v: "reparieren", p: 2, text: "Der Nachbar {0} unser Fahrrad {1}." },
  { v: "klingeln", p: 2, text: "Es {0} an der T\xFCr {1}." },
  { v: "l\xE4cheln", p: 5, text: "Die Kinder {0} freundlich {1}." },
  /* неотделяемые приставки — без ge- */
  { v: "besuchen", p: 0, text: "Ich {0} meine Tante in Hamburg {1}." },
  { v: "erkl\xE4ren", p: 2, text: "Der Lehrer {0} die Aufgabe zweimal {1}." },
  { v: "untersuchen", p: 2, text: "Die \xC4rztin {0} den Patienten gr\xFCndlich {1}." },
  { v: "verstehen", p: 0, text: "Ich {0} die Frage nicht {1}." },
  { v: "verkaufen", p: 3, text: "Wir {0} das alte Auto {1}." },
  { v: "bezahlen", p: 1, text: "Du {0} die Rechnung schon {1}." },
  { v: "erz\xE4hlen", p: 2, text: "Er {0} uns eine lustige Geschichte {1}." },
  { v: "bekommen", p: 4, text: "Ihr {0} eine Einladung {1}." },
  { v: "vergessen", p: 0, text: "Ich {0} den Termin v\xF6llig {1}." },
  { v: "verlieren", p: 2, text: "Sie {0} ihren Schl\xFCssel {1}." },
  { v: "bestellen", p: 3, text: "Wir {0} zwei Kaffee {1}." },
  { v: "empfehlen", p: 2, text: "Der Arzt {0} mir mehr Bewegung {1}." },
  { v: "besichtigen", p: 5, text: "Die Gruppe {0} das Museum {1}." },
  /* отделяемые */
  { v: "abholen", p: 5, text: "Anna {0} das Paket bei der Post {1}." },
  { v: "aufr\xE4umen", p: 1, text: "Du {0} dein Zimmer endlich {1}." },
  { v: "abwaschen", p: 2, text: "Oma {0} das schmutzige Geschirr {1}." },
  { v: "anrufen", p: 4, text: "Ihr {0} eure Freunde am Abend {1}." },
  { v: "einkaufen", p: 0, text: "Ich {0} f\xFCr das Wochenende {1}." },
  { v: "aufstehen", p: 2, text: "Er {0} heute sehr fr\xFCh {1}." },
  { v: "einschlafen", p: 0, text: "Ich {0} gestern sofort {1}." },
  { v: "mitkommen", p: 1, text: "Du {0} zum Gl\xFCck mit {1}." },
  { v: "aufmachen", p: 5, text: "Sie {0} alle Fenster {1}." },
  { v: "zumachen", p: 2, text: "Er {0} die T\xFCr leise {1}." },
  { v: "fernsehen", p: 3, text: "Wir {0} gestern Abend {1}." },
  { v: "vorbereiten", p: 0, text: "Ich {0} das Abendessen {1}." },
  { v: "anfangen", p: 2, text: "Der Film {0} p\xFCnktlich {1}." },
  { v: "aufh\xF6ren", p: 2, text: "Es {0} endlich {1} zu regnen." },
  { v: "mitbringen", p: 4, text: "Ihr {0} die Getr\xE4nke {1}." },
  { v: "einladen", p: 2, text: "Er {0} alle Nachbarn {1}." },
  { v: "aussehen", p: 2, text: "Der Kuchen {0} k\xF6stlich {1}." },
  { v: "anziehen", p: 1, text: "Du {0} die Jacke {1}." },
  { v: "aufschreiben", p: 5, text: "Die Sch\xFCler {0} die Hausaufgaben {1}." },
  { v: "mitnehmen", p: 0, text: "Ich {0} den Regenschirm {1}." },
  { v: "zur\xFCckkommen", p: 3, text: "Wir {0} sp\xE4t {1}." },
  { v: "stattfinden", p: 2, text: "Das Konzert {0} im Park {1}." },
  { v: "teilnehmen", p: 1, text: "Du {0} am Kurs {1}." },
  { v: "kennenlernen", p: 0, text: "Ich {0} ihn in Berlin {1}." },
  { v: "aufpassen", p: 4, text: "Ihr {0} im Unterricht gut {1}." },
  { v: "aussteigen", p: 2, text: "Er {0} am Hauptbahnhof {1}." },
  { v: "einsteigen", p: 5, text: "Die Fahrg\xE4ste {0} schnell {1}." },
  { v: "umziehen", p: 3, text: "Wir {0} letzten Monat {1}." },
  { v: "ankommen", p: 2, text: "Der Zug {0} mit Versp\xE4tung {1}." },
  { v: "abfahren", p: 2, text: "Der Bus {0} ohne uns {1}." },
  { v: "zuh\xF6ren", p: 0, text: "Ich {0} dem Vortrag {1}." },
  /* сильные */
  { v: "essen", p: 1, text: "Was {0} du gerade {1}?" },
  { v: "trinken", p: 2, text: "Er {0} zu viel Kaffee {1}." },
  { v: "gehen", p: 0, text: "Ich {0} gestern fr\xFCh ins Bett {1}." },
  { v: "kommen", p: 5, text: "Sie {0} zu sp\xE4t zur Pr\xFCfung {1}." },
  { v: "fahren", p: 2, text: "Er {0} mit dem Fahrrad zur Arbeit {1}." },
  { v: "fliegen", p: 2, text: "Er {0} mit dem Flugzeug nach Wien {1}." },
  { v: "sehen", p: 0, text: "Ich {0} den Film schon {1}." },
  { v: "lesen", p: 1, text: "Du {0} das Buch in zwei Tagen {1}." },
  { v: "schreiben", p: 2, text: "Sie {0} mir eine lange E-Mail {1}." },
  { v: "sprechen", p: 3, text: "Wir {0} lange \xFCber das Problem {1}." },
  { v: "nehmen", p: 5, text: "Sie {0} den Zug um acht {1}." },
  { v: "geben", p: 2, text: "Er {0} mir den Schl\xFCssel {1}." },
  { v: "helfen", p: 2, text: "Peter {0} dir bei den Hausaufgaben {1}." },
  { v: "treffen", p: 0, text: "Ich {0} ihn zuf\xE4llig am Bahnhof {1}." },
  { v: "finden", p: 1, text: "Du {0} deine Brille wieder {1}." },
  { v: "bleiben", p: 5, text: "Sie {0} den ganzen Tag zu Hause {1}." },
  { v: "schlafen", p: 2, text: "Das Kind {0} tief {1}." },
  { v: "laufen", p: 3, text: "Wir {0} zehn Kilometer {1}." },
  { v: "singen", p: 5, text: "Die Kinder {0} ein Lied {1}." },
  { v: "bringen", p: 2, text: "Er {0} die Getr\xE4nke {1}." },
  { v: "denken", p: 0, text: "Ich {0} lange \xFCber deine Frage {1}." },
  { v: "wissen", p: 2, text: "Er {0} die Antwort nicht {1}." },
  { v: "tun", p: 1, text: "Was {0} du gestern {1}?" },
  { v: "werden", p: 2, text: "Er {0} Lehrer {1}." },
  { v: "sein", p: 0, text: "Ich {0} noch nie in Berlin {1}." },
  { v: "haben", p: 4, text: "Ihr {0} viel Gl\xFCck {1}." }
];
var PERFEKT_INV = [
  { v: "vergessen", p: 2, text: "Weil er krank war, {0} er den Termin beim Zahnarzt {1}." },
  { v: "machen", p: 5, text: "Obwohl es schon sp\xE4t war, {0} die Kinder ihre Hausaufgaben {1}." },
  { v: "aufr\xE4umen", p: 2, text: "Als ich nach Hause kam, {0} mein Bruder gerade sein Zimmer {1}." },
  { v: "besichtigen", p: 5, text: "Trotz des Regens {0} die Touristen das Schloss {1}." },
  { v: "anrufen", p: 0, text: "Bevor ich losfuhr, {0} ich schnell noch meine Mutter {1}." },
  { v: "ankommen", p: 2, text: "Weil sie den Bus verpasst hatte, {0} sie erst eine Stunde sp\xE4ter {1}." },
  { v: "trinken", p: 3, text: "Nachdem die G\xE4ste da waren, {0} wir zusammen Kaffee {1}." },
  { v: "bezahlen", p: 2, text: "Obwohl er m\xFCde war, {0} er die Rechnung sofort {1}." },
  { v: "laufen", p: 0, text: "Weil der Bus nicht kam, {0} ich zur Arbeit {1}." },
  { v: "aufschreiben", p: 3, text: "Nachdem der Lehrer die Regel erkl\xE4rt hatte, {0} wir sie uns {1}." },
  { v: "essen", p: 2, text: "Obwohl das Essen lecker aussah, {0} er nichts {1}." },
  { v: "spielen", p: 3, text: "Weil das Wetter sch\xF6n war, {0} wir noch im Park {1}." },
  { v: "erz\xE4hlen", p: 2, text: "Als ich ihn endlich traf, {0} er mir die ganze Geschichte {1}." },
  { v: "kaufen", p: 3, text: "Bevor die Vorstellung anfing, {0} wir uns noch einen Kaffee {1}." },
  { v: "beginnen", p: 2, text: "Nachdem alle G\xE4ste angekommen waren, {0} das Fest {1}." }
];
var TRENNBAR = [
  { v: "untersuchen", p: 2, text: "Lauras Mutter {0} jeden Tag Tiere in ihrer Praxis {1}." },
  { v: "erkl\xE4ren", p: 2, text: "Der Lehrer {0} ihr die Matheaufgabe {1}." },
  { v: "abwaschen", p: 2, text: "Lauras und Tims Oma {0} das schmutzige Geschirr {1}." },
  { v: "aufr\xE4umen", p: 1, text: "Du {0} das Zimmer deiner Freundin {1}." },
  { v: "anrufen", p: 4, text: "Ihr {0} eure Freunde am Nachmittag {1}." },
  { v: "besuchen", p: 0, text: "Ich {0} meine Gro\xDFeltern jeden Sonntag {1}." },
  { v: "verstehen", p: 3, text: "Wir {0} die Aufgabe nicht {1}." },
  { v: "abholen", p: 2, text: "Mein Vater {0} mich vom Bahnhof {1}." },
  { v: "einkaufen", p: 5, text: "Meine Eltern {0} immer samstags {1}." },
  { v: "aufstehen", p: 0, text: "Ich {0} jeden Morgen um sechs {1}." },
  { v: "bezahlen", p: 1, text: "Du {0} die Rechnung am Freitag {1}." },
  { v: "aufmachen", p: 2, text: "Der Lehrer {0} das Fenster {1}." },
  { v: "erz\xE4hlen", p: 2, text: "Opa {0} uns eine Geschichte {1}." },
  { v: "zumachen", p: 4, text: "Ihr {0} bitte die T\xFCr {1}." },
  { v: "vergessen", p: 0, text: "Ich {0} den Termin leider {1}." },
  { v: "fernsehen", p: 3, text: "Wir {0} abends nur eine Stunde {1}." },
  { v: "verlieren", p: 5, text: "Die Kinder {0} st\xE4ndig ihre Handschuhe {1}." },
  { v: "vorbereiten", p: 2, text: "Meine Mutter {0} das Abendessen {1}." },
  { v: "bekommen", p: 1, text: "Du {0} jede Woche neue Aufgaben {1}." },
  { v: "anfangen", p: 2, text: "Der Unterricht {0} p\xFCnktlich {1}." },
  { v: "bestellen", p: 0, text: "Ich {0} immer nur Wasser {1}." },
  { v: "aufh\xF6ren", p: 3, text: "Wir {0} um f\xFCnf Uhr {1}." },
  { v: "mitbringen", p: 4, text: "Ihr {0} bitte die B\xFCcher {1}." },
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
  { v: "zuh\xF6ren", p: 2, text: "Der Lehrer {0} geduldig {1}." },
  { v: "empfehlen", p: 2, text: "Der Arzt {0} mir mehr Sport {1}." },
  { v: "verkaufen", p: 3, text: "Wir {0} unser altes Auto {1}." },
  { v: "verstehen", p: 2, text: "Sie {0} den Dialekt nicht {1}." },
  { v: "abfahren", p: 2, text: "Der Zug {0} um acht {1}." },
  { v: "ankommen", p: 2, text: "Der Bus {0} in zehn Minuten {1}." },
  { v: "reparieren", p: 0, text: "Ich {0} das Fahrrad selbst {1}." }
];
var RELATIV = [
  { text: "Er m\xF6chte einen Parkplatz, {0} vor seiner Haust\xFCr ist.", a: "der", why: "Parkplatz \u2014 \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434, \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u043E\u043D \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u2192 Nominativ: der." },
  { text: "Ich suche den Anzug, {0} ich im Katalog gesehen habe.", a: "den", why: "Anzug \u2014 \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434, sehen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ \u2192 den." },
  { text: "Otto kauft die Schuhe, {0} er gerade anprobiert hat.", a: "die", why: "Schuhe \u2014 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E, anprobieren \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ \u2192 die." },
  { text: "Das Kleid, {0} du gekauft hast, h\xE4ngt im Schrank.", a: "das", why: "Kleid \u2014 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434, kaufen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ \u2192 das (\u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 Nominativ)." },
  { text: "Familie Klein sucht eine Lampe, {0} hell leuchtet.", a: "die", why: "Lampe \u2014 \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434, \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u2192 Nominativ: die." },
  { text: "Der Mann, {0} dort steht, ist mein Nachbar.", a: "der", why: "Mann \u2014 \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434, \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u2192 Nominativ: der." },
  { text: "Die Frau, {0} ich gestern getroffen habe, wohnt nebenan.", a: "die", why: "Frau \u2014 \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434, treffen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ, \u0430 \u0444\u043E\u0440\u043C\u0430 \u0436\u0435\u043D\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430 \u0432 Akkusativ \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 Nominativ: die." },
  { text: "Das Kind, {0} im Garten spielt, ist meine Nichte.", a: "das", why: "Kind \u2014 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434, \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u2192 Nominativ: das." },
  { text: "Der Lehrer, {0} ich gefragt habe, war sehr freundlich.", a: "den", why: "Lehrer \u2014 \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434, fragen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ \u2192 den." },
  { text: "Die Nachbarn, {0} wir geholfen haben, sind umgezogen.", a: "denen", why: "helfen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Dativ; \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u0432 Dativ \u2192 denen." },
  { text: "Der Kollege, {0} ich das Buch gegeben habe, liest es gerade.", a: "dem", why: "geben + Dativ (\u043A\u043E\u043C\u0443?), \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434 \u0432 Dativ \u2192 dem." },
  { text: "Das Restaurant, {0} wir gestern waren, war sehr gut.", a: "in dem", why: "\u041C\u0435\u0441\u0442\u043E (\u0432 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0435) \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043F\u0440\u0435\u0434\u043B\u043E\u0433\u0430 in + Dativ; \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434 \u2192 in dem (\u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u043D\u043E: im)." },
  { text: "Die Stadt, {0} ich geboren bin, liegt am Meer.", a: "in der", why: "\u041C\u0435\u0441\u0442\u043E \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F: in + Dativ, \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434 \u2192 in der." },
  { text: "Der Film, {0} wir gesehen haben, war langweilig.", a: "den", why: "Film \u2014 \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434, sehen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ \u2192 den." },
  { text: "Das Buch, {0} ich dir empfohlen habe, ist endlich da.", a: "das", why: "Buch \u2014 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434, empfehlen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ \u2192 das." },
  { text: "Die Pr\xFCfung, {0} ich mich vorbereite, ist am Montag.", a: "auf die", why: "sich vorbereiten auf + Akkusativ; \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434 \u2192 auf die." },
  { text: "Der Zug, {0} wir gewartet haben, kommt zu sp\xE4t.", a: "auf den", why: "warten auf + Akkusativ; \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434 \u2192 auf den." },
  { text: "Die Freunde, {0} ich mich freue, kommen morgen.", a: "auf die", why: "sich freuen auf + Akkusativ; \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u2192 auf die." },
  { text: "Das Thema, {0} wir diskutiert haben, ist kompliziert.", a: "das", why: "Thema \u2014 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434, diskutieren \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ \u2192 das." },
  { text: "Der Junge, {0} Fahrrad gestohlen wurde, ist sehr traurig.", a: "dem", why: "Passiv \u0441 Dativ-\u043E\u0431\u044A\u0435\u043A\u0442\u043E\u043C: \xAB\u043A\u043E\u043C\u0443 \u0443\u043A\u0440\u0430\u043B\u0438\xBB \u2192 dem." },
  { text: "Die Kollegin, {0} ich das Paket gegeben habe, ist krank.", a: "der", why: "geben + Dativ, \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434 \u0432 Dativ \u2192 der." },
  { text: "Das Haus, {0} Dach kaputt ist, wird renoviert.", a: "dessen", why: "\u041F\u0440\u0438\u0442\u044F\u0436\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u0435 (\u0447\u0435\u0439?): Genitiv \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0440\u043E\u0434\u0430 \u2192 dessen." },
  { text: "Der Autor, {0} B\xFCcher weltber\xFChmt sind, lebt in Wien.", a: "dessen", why: "Genitiv \u043C\u0443\u0436\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430 (\u0447\u0435\u0439?) \u2192 dessen." },
  { text: "Die Stadt, {0} Einwohner protestieren, ist bekannt.", a: "deren", why: "Genitiv \u0436\u0435\u043D\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430 (\u0447\u0435\u0439?) \u2192 deren." },
  { text: "Alles, {0} er gesagt hat, war richtig.", a: "was", why: "\u041F\u043E\u0441\u043B\u0435 alles, nichts, etwas, viel \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F was, \u0430 \u043D\u0435 das." },
  { text: "Das ist das Beste, {0} ich je gesehen habe.", a: "was", why: "\u041F\u043E\u0441\u043B\u0435 \u043F\u0440\u0435\u0432\u043E\u0441\u0445\u043E\u0434\u043D\u043E\u0439 \u0441\u0442\u0435\u043F\u0435\u043D\u0438 (das Beste) \u2192 was." },
  { text: "Das Haus, {0} wir wohnen, ist sehr alt.", a: "in dem", why: "wohnen in + Dativ; \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434 \u2192 in dem." },
  { text: "Der Ort, {0} wir uns getroffen haben, ist ein Caf\xE9.", a: "wo", why: "\u0414\u043B\u044F \u043C\u0435\u0441\u0442\u0430 \u043C\u043E\u0436\u043D\u043E \u0437\u0430\u043C\u0435\u043D\u0438\u0442\u044C \xABin dem\xBB \u043D\u0430 wo \u2014 \u0442\u0430\u043A \u043A\u043E\u0440\u043E\u0447\u0435 \u0438 \u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u0435\u0435." },
  { text: "Die Universit\xE4t, {0} ich studiere, ist in Darmstadt.", a: "an der", why: "studieren an + Dativ; \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434 \u2192 an der." },
  { text: "Der Beruf, {0} er gelernt hat, gef\xE4llt ihm nicht.", a: "den", why: "Beruf \u2014 \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434, lernen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ \u2192 den." },
  { text: "Die Frage, {0} du gestellt hast, ist berechtigt.", a: "die", why: "Frage \u2014 \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434, stellen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 Akkusativ \u2192 die." },
  { text: "Das Problem, {0} wir sprechen, muss gel\xF6st werden.", a: "\xFCber das", why: "sprechen \xFCber + Akkusativ; \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434 \u2192 \xFCber das." },
  { text: "Der Nachbar, {0} Hund bellt, ist verreist.", a: "dessen", why: "Genitiv \u043C\u0443\u0436\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430 (\u0447\u0435\u0439 \u043F\u0451\u0441?) \u2192 dessen." },
  { text: "Die Eltern, {0} Kinder in der Schule sind, warten drau\xDFen.", a: "deren", why: "Genitiv \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u0447\u0438\u0441\u043B\u0430 (\u0447\u044C\u0438 \u0434\u0435\u0442\u0438?) \u2192 deren." },
  { text: "Das Zimmer, {0} Fenster offen ist, ist kalt.", a: "dessen", why: "Genitiv \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0440\u043E\u0434\u0430 (\u0447\u044C\u0451 \u043E\u043A\u043D\u043E?) \u2192 dessen." }
];
var NEBENSATZ = [
  {
    a: "Man kann \xFCberall fernsehen.",
    b: "Es gibt Internet.",
    konj: "seitdem",
    answers: [
      "Man kann \xFCberall fernsehen, seitdem es Internet gibt.",
      "Seitdem es Internet gibt, kann man \xFCberall fernsehen."
    ]
  },
  {
    a: "Er hat sein Italienisch verbessert.",
    b: "Er arbeitet im Kindergarten.",
    konj: "seitdem",
    answers: [
      "Er hat sein Italienisch verbessert, seitdem er im Kindergarten arbeitet.",
      "Seitdem er im Kindergarten arbeitet, hat er sein Italienisch verbessert."
    ]
  },
  {
    a: "Ich bereite das Abendessen vor.",
    b: "Das Spiel f\xE4ngt an.",
    konj: "bevor",
    answers: [
      "Ich bereite das Abendessen vor, bevor das Spiel anf\xE4ngt.",
      "Bevor das Spiel anf\xE4ngt, bereite ich das Abendessen vor."
    ]
  },
  {
    a: "Ich besuche dich.",
    b: "Ich bin in K\xF6ln.",
    konj: "wenn",
    answers: [
      "Ich besuche dich, wenn ich in K\xF6ln bin.",
      "Wenn ich in K\xF6ln bin, besuche ich dich."
    ]
  },
  {
    a: "Er kennt den Wald sehr gut.",
    b: "Er ist F\xF6rster von Beruf.",
    konj: "weil",
    answers: [
      "Er kennt den Wald sehr gut, weil er F\xF6rster von Beruf ist.",
      "Weil er F\xF6rster von Beruf ist, kennt er den Wald sehr gut."
    ]
  },
  {
    a: "Ich h\xF6re Musik.",
    b: "Ich lerne Vokabeln.",
    konj: "w\xE4hrend",
    answers: [
      "Ich h\xF6re Musik, w\xE4hrend ich Vokabeln lerne.",
      "W\xE4hrend ich Vokabeln lerne, h\xF6re ich Musik."
    ]
  },
  {
    a: "Wir gehen spazieren.",
    b: "Es regnet nicht mehr.",
    konj: "weil",
    answers: [
      "Wir gehen spazieren, weil es nicht mehr regnet.",
      "Weil es nicht mehr regnet, gehen wir spazieren."
    ]
  },
  {
    a: "Der Zug hat Versp\xE4tung.",
    b: "Es hat geschneit.",
    konj: "weil",
    answers: [
      "Der Zug hat Versp\xE4tung, weil es geschneit hat.",
      "Weil es geschneit hat, hat der Zug Versp\xE4tung."
    ]
  },
  {
    a: "Ich rufe dich an.",
    b: "Ich komme in Berlin an.",
    konj: "sobald",
    answers: [
      "Ich rufe dich an, sobald ich in Berlin ankomme.",
      "Sobald ich in Berlin ankomme, rufe ich dich an."
    ]
  },
  {
    a: "Sie macht die Hausaufgaben.",
    b: "Sie isst zu Abend.",
    konj: "bevor",
    answers: [
      "Sie macht die Hausaufgaben, bevor sie zu Abend isst.",
      "Bevor sie zu Abend isst, macht sie die Hausaufgaben."
    ]
  },
  {
    a: "Er ist sehr m\xFCde.",
    b: "Er geht noch ins Fitnessstudio.",
    konj: "obwohl",
    answers: [
      "Er ist sehr m\xFCde, obwohl er noch ins Fitnessstudio geht.",
      "Obwohl er sehr m\xFCde ist, geht er noch ins Fitnessstudio."
    ]
  },
  {
    a: "Ich habe den Termin vergessen.",
    b: "Mein Handy war aus.",
    konj: "weil",
    answers: [
      "Ich habe den Termin vergessen, weil mein Handy aus war.",
      "Weil mein Handy aus war, habe ich den Termin vergessen."
    ]
  },
  {
    a: "Wir warten hier.",
    b: "Der Bus kommt.",
    konj: "bis",
    answers: [
      "Wir warten hier, bis der Bus kommt.",
      "Bis der Bus kommt, warten wir hier."
    ]
  },
  {
    a: "Du sollst dich ausruhen.",
    b: "Du bist krank.",
    konj: "weil",
    answers: [
      "Du sollst dich ausruhen, weil du krank bist.",
      "Weil du krank bist, sollst du dich ausruhen."
    ]
  },
  {
    a: "Ich lerne Deutsch.",
    b: "Ich m\xF6chte studieren.",
    konj: "damit",
    answers: [
      "Ich lerne Deutsch, damit ich studieren kann.",
      "Damit ich studieren kann, lerne ich Deutsch."
    ]
  },
  {
    a: "Der Unterricht beginnt.",
    b: "Alle Studenten sind da.",
    konj: "sobald",
    answers: [
      "Der Unterricht beginnt, sobald alle Studenten da sind.",
      "Sobald alle Studenten da sind, beginnt der Unterricht."
    ]
  },
  {
    a: "Sie hat das Studium abgeschlossen.",
    b: "Sie hat ein Praktikum gemacht.",
    konj: "nachdem",
    answers: [
      "Sie hat ein Praktikum gemacht, nachdem sie das Studium abgeschlossen hat.",
      "Nachdem sie das Studium abgeschlossen hat, hat sie ein Praktikum gemacht."
    ]
  },
  {
    a: "Ich koche Kaffee.",
    b: "Die G\xE4ste kommen.",
    konj: "bevor",
    answers: [
      "Ich koche Kaffee, bevor die G\xE4ste kommen.",
      "Bevor die G\xE4ste kommen, koche ich Kaffee."
    ]
  },
  {
    a: "Er spricht sehr gut Deutsch.",
    b: "Er lernt erst seit einem Jahr.",
    konj: "obwohl",
    answers: [
      "Er spricht sehr gut Deutsch, obwohl er erst seit einem Jahr lernt.",
      "Obwohl er erst seit einem Jahr lernt, spricht er sehr gut Deutsch."
    ]
  },
  {
    a: "Wir m\xFCssen sparen.",
    b: "Wir wollen eine Reise machen.",
    konj: "weil",
    answers: [
      "Wir m\xFCssen sparen, weil wir eine Reise machen wollen.",
      "Weil wir eine Reise machen wollen, m\xFCssen wir sparen."
    ]
  }
];
var OBWOHL = [
  {
    a: "Er geht joggen.",
    b: "Es regnet.",
    answers: [
      "Er geht joggen, obwohl es regnet.",
      "Obwohl es regnet, geht er joggen.",
      "Es regnet, trotzdem geht er joggen.",
      "Es regnet, er geht trotzdem joggen."
    ]
  },
  {
    a: "Sie lernt weiter.",
    b: "Sie ist m\xFCde.",
    answers: [
      "Sie lernt weiter, obwohl sie m\xFCde ist.",
      "Obwohl sie m\xFCde ist, lernt sie weiter.",
      "Sie ist m\xFCde, trotzdem lernt sie weiter.",
      "Sie ist m\xFCde, sie lernt trotzdem weiter."
    ]
  },
  {
    a: "Wir gehen schwimmen.",
    b: "Das Wasser ist kalt.",
    answers: [
      "Wir gehen schwimmen, obwohl das Wasser kalt ist.",
      "Obwohl das Wasser kalt ist, gehen wir schwimmen.",
      "Das Wasser ist kalt, trotzdem gehen wir schwimmen.",
      "Das Wasser ist kalt, wir gehen trotzdem schwimmen."
    ]
  },
  {
    a: "Er kauft sich ein neues Auto.",
    b: "Er hat wenig Geld.",
    answers: [
      "Er kauft sich ein neues Auto, obwohl er wenig Geld hat.",
      "Obwohl er wenig Geld hat, kauft er sich ein neues Auto.",
      "Er hat wenig Geld, trotzdem kauft er sich ein neues Auto.",
      "Er hat wenig Geld, er kauft sich trotzdem ein neues Auto."
    ]
  },
  {
    a: "Alle haben die Pr\xFCfung bestanden.",
    b: "Die Pr\xFCfung war schwer.",
    answers: [
      "Alle haben die Pr\xFCfung bestanden, obwohl sie schwer war.",
      "Obwohl die Pr\xFCfung schwer war, haben alle bestanden.",
      "Die Pr\xFCfung war schwer, trotzdem haben alle bestanden.",
      "Die Pr\xFCfung war schwer, alle haben trotzdem bestanden."
    ]
  },
  {
    a: "Ich bin zur Arbeit gegangen.",
    b: "Ich war krank.",
    answers: [
      "Ich bin zur Arbeit gegangen, obwohl ich krank war.",
      "Obwohl ich krank war, bin ich zur Arbeit gegangen.",
      "Ich war krank, trotzdem bin ich zur Arbeit gegangen.",
      "Ich war krank, ich bin trotzdem zur Arbeit gegangen."
    ]
  },
  {
    a: "Das Hotel ist immer ausgebucht.",
    b: "Das Hotel ist teuer.",
    answers: [
      "Das Hotel ist immer ausgebucht, obwohl es teuer ist.",
      "Obwohl es teuer ist, ist das Hotel immer ausgebucht.",
      "Das Hotel ist teuer, trotzdem ist es immer ausgebucht.",
      "Das Hotel ist teuer, es ist trotzdem immer ausgebucht."
    ]
  },
  {
    a: "Sie spricht sehr gut Deutsch.",
    b: "Sie hat nie in Deutschland gelebt.",
    answers: [
      "Sie spricht sehr gut Deutsch, obwohl sie nie in Deutschland gelebt hat.",
      "Obwohl sie nie in Deutschland gelebt hat, spricht sie sehr gut Deutsch.",
      "Sie hat nie in Deutschland gelebt, trotzdem spricht sie sehr gut Deutsch.",
      "Sie hat nie in Deutschland gelebt, sie spricht trotzdem sehr gut Deutsch."
    ]
  },
  {
    a: "Wir haben den Film zu Ende gesehen.",
    b: "Der Film war lang.",
    answers: [
      "Wir haben den Film zu Ende gesehen, obwohl er lang war.",
      "Obwohl der Film lang war, haben wir ihn zu Ende gesehen.",
      "Der Film war lang, trotzdem haben wir ihn zu Ende gesehen.",
      "Der Film war lang, wir haben ihn trotzdem zu Ende gesehen."
    ]
  },
  {
    a: "Sie fuhr mit dem Fahrrad zur Arbeit.",
    b: "Es war Winter.",
    answers: [
      "Sie fuhr mit dem Fahrrad zur Arbeit, obwohl es Winter war.",
      "Obwohl es Winter war, fuhr sie mit dem Fahrrad zur Arbeit.",
      "Es war Winter, trotzdem fuhr sie mit dem Fahrrad zur Arbeit.",
      "Es war Winter, sie fuhr trotzdem mit dem Fahrrad zur Arbeit."
    ]
  },
  {
    a: "Er isst noch ein St\xFCck Kuchen.",
    b: "Er ist satt.",
    answers: [
      "Er isst noch ein St\xFCck Kuchen, obwohl er satt ist.",
      "Obwohl er satt ist, isst er noch ein St\xFCck Kuchen.",
      "Er ist satt, trotzdem isst er noch ein St\xFCck Kuchen.",
      "Er ist satt, er isst trotzdem noch ein St\xFCck Kuchen."
    ]
  },
  {
    a: "Die Kinder spielen im Garten.",
    b: "Das Wetter ist schlecht.",
    answers: [
      "Die Kinder spielen im Garten, obwohl das Wetter schlecht ist.",
      "Obwohl das Wetter schlecht ist, spielen die Kinder im Garten.",
      "Das Wetter ist schlecht, trotzdem spielen die Kinder im Garten.",
      "Das Wetter ist schlecht, die Kinder spielen trotzdem im Garten."
    ]
  }
];
var UMZU = [
  {
    text: "Ich spare Geld, damit ich ein Auto kaufen kann.",
    answers: ["Ich spare Geld, um ein Auto zu kaufen."],
    why: "\u041F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u043E\u0434\u043D\u043E (ich) \u2192 \xABum \u2026 zu\xBB. \u041C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0439 \xABkann\xBB \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442: um + Infinitiv Pr\xE4sens."
  },
  {
    text: "Er lernt Deutsch, damit er in Kiel studieren kann.",
    answers: ["Er lernt Deutsch, um in Kiel zu studieren."],
    why: "um + zu + Infinitiv. \xABdamit\xBB \u043D\u0443\u0436\u0435\u043D \u0431\u044B\u043B \u0431\u044B, \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0431\u044B \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u0431\u044B\u043B\u043E \u0434\u0440\u0443\u0433\u043E\u0435 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435."
  },
  {
    text: "Sie macht Sport, damit sie abnehmen kann.",
    answers: ["Sie macht Sport, um abzunehmen."],
    why: "abnehmen \u2014 \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u043E\u0435: zu \u0441\u0442\u043E\u0438\u0442 \u0432\u043D\u0443\u0442\u0440\u0438, \u043C\u0435\u0436\u0434\u0443 \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u043E\u0439 \u0438 \u043A\u043E\u0440\u043D\u0435\u043C \u2192 \xABabzunehmen\xBB."
  },
  {
    text: "Wir fahren mit dem Fahrrad, damit wir Sport machen.",
    answers: ["Wir fahren mit dem Fahrrad, um Sport zu machen."],
    why: "\u0412 \xABum \u2026 zu\xBB-\u043E\u0431\u043E\u0440\u043E\u0442\u0435 \u043D\u0435 \u0431\u044B\u0432\u0430\u0435\u0442 \u0441\u0432\u043E\u0435\u0433\u043E \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0433\u043E \u0438 \u043D\u0435 \u0431\u044B\u0432\u0430\u0435\u0442 \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u043E\u0433\u043E \u0433\u043B\u0430\u0433\u043E\u043B\u0430 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E zu + Infinitiv."
  },
  {
    text: "Ich gehe fr\xFCh ins Bett, damit ich morgen fit bin.",
    answers: ["Ich gehe fr\xFCh ins Bett, um morgen fit zu sein."],
    why: "\u0414\u0430\u0436\u0435 sein \u0432 um\u2026zu-\u043E\u0431\u043E\u0440\u043E\u0442\u0435 \u0441\u0442\u043E\u0438\u0442 \u0432 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u0435: um \u2026 fit zu sein."
  },
  {
    text: "Sie bleibt zu Hause, damit sie sich ausruhen kann.",
    answers: ["Sie bleibt zu Hause, um sich auszuruhen."],
    why: "\u0412\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u043E\u0435 sich \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u043E\u0431\u043E\u0440\u043E\u0442\u0435: um sich auszuruhen. \u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 aus- \u2192 aus\u2026zu."
  },
  {
    text: "Ich nehme den Bus, um p\xFCnktlich zu sein.",
    answers: ["Ich nehme den Bus, damit ich p\xFCnktlich bin."],
    why: "\u041E\u0431\u0440\u0430\u0442\u043D\u043E: um\u2026zu \u2192 damit. \u0412 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B (bin) \u0432 \u043A\u043E\u043D\u0446\u0435."
  },
  {
    text: "Er geht zur Sprachschule, um besser Deutsch zu sprechen.",
    answers: ["Er geht zur Sprachschule, damit er besser Deutsch spricht."],
    why: "um\u2026zu \u2192 damit: \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 er \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u0433\u043B\u0430\u0433\u043E\u043B \u0432 Pr\xE4sens, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E."
  },
  {
    text: "Wir \xF6ffnen das Fenster, um frische Luft zu bekommen.",
    answers: ["Wir \xF6ffnen das Fenster, damit wir frische Luft bekommen."],
    why: "bekommen \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u0442\u0441\u044F: damit wir \u2026 bekommen. \u041F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u043C\u044B \u043E\u0431\u044F\u0437\u0430\u043D\u044B \u043D\u0430\u0437\u0432\u0430\u0442\u044C \u2014 \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u0441 damit \u043E\u043D\u043E \u0435\u0441\u0442\u044C."
  },
  {
    text: "Sie \xFCbt jeden Tag, um die Pr\xFCfung zu bestehen.",
    answers: ["Sie \xFCbt jeden Tag, damit sie die Pr\xFCfung besteht."],
    why: "bestehen \u2014 \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B (besteht). Um\u2026zu \u043F\u0440\u0435\u0432\u0440\u0430\u0442\u0438\u043B\u0441\u044F \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u0441 \u0442\u0435\u043C \u0436\u0435 \u0441\u043C\u044B\u0441\u043B\u043E\u043C \u0446\u0435\u043B\u0438."
  }
];
var INFINITIVZU = [
  { text: "Ich habe heute keine Zeit, {0}.", v: "einkaufen" },
  { text: "Versprich mir, {0}!", v: "anrufen" },
  { text: "Er vergisst oft, {0}.", v: "aufr\xE4umen" },
  { text: "Wir haben vor, {0}.", v: "umziehen" },
  { text: "Es ist wichtig, jeden Tag {0}.", v: "lernen" },
  { text: "Sie hat Angst, {0}.", v: "fliegen" },
  { text: "Ich versuche, weniger {0}.", v: "fernsehen" },
  { text: "Hast du Lust, {0}?", v: "mitkommen" },
  { text: "Er hat keine Lust, {0}.", v: "abwaschen" },
  { text: "Es macht Spa\xDF, alte Autos {0}.", v: "reparieren" },
  { text: "Es ist sch\xF6n, am Wochenende lange {0}.", v: "schlafen" },
  { text: "Er freut sich, dich wieder {0}.", v: "sehen" },
  { text: "Vergiss nicht, die G\xE4ste {0}!", v: "einladen" },
  { text: "Es ist schwer, fr\xFCh {0}.", v: "aufstehen" },
  { text: "Ich habe vor, am Samstag {0}.", v: "aufr\xE4umen" },
  { text: "Wir haben vor, nach Kiel {0}.", v: "umziehen" }
];
var PLUSQUAM = [
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
  { text: "Nachdem sie {0} {1} {2}, ging sie schlafen.", v: "putzen", obj: "die Z\xE4hne", p: 2, hint: "die Z\xE4hne, putzen" }
];
var PASSIV = [
  { text: "Die Wohnung {0} jeden Freitag {1}.", v: "putzen", plural: false },
  { text: "Das Auto {0} schon {1}.", v: "reparieren", plural: false },
  { text: "Die Hausaufgaben {0} im Klassenzimmer {1}.", v: "machen", plural: true },
  { text: "Das Brot {0} jeden Morgen {1}.", v: "kaufen", plural: false },
  { text: "Die G\xE4ste {0} zum Fest {1}.", v: "einladen", plural: true },
  { text: "Das Zimmer {0} gerade {1}.", v: "aufr\xE4umen", plural: false },
  { text: "Die E-Mails {0} jeden Tag {1}.", v: "schreiben", plural: true },
  { text: "Die Rechnung {0} per Karte {1}.", v: "bezahlen", plural: false },
  { text: "Die Frage {0} nicht {1}.", v: "verstehen", plural: false },
  { text: "Die Fenster {0} im Sommer {1}.", v: "\xF6ffnen", plural: true },
  { text: "Das Museum {0} von Touristen {1}.", v: "besichtigen", plural: false },
  { text: "Die Suppe {0} langsam {1}.", v: "kochen", plural: false },
  { text: "Die Getr\xE4nke {0} schon {1}.", v: "mitbringen", plural: true },
  { text: "Der Termin {0} leider {1}.", v: "vergessen", plural: false },
  { text: "Die Schl\xFCssel {0} zum Gl\xFCck {1}.", v: "finden", plural: true }
];
var KONJ2 = [
  {
    text: "Wenn ich mehr Zeit {0}, w\xFCrde ich jeden Tag Sport machen.",
    answers: ["h\xE4tte"],
    hint: "(haben)",
    why: "haben \u0432 Konjunktiv II \u2014 h\xE4tte (\u043D\u0435 \xABw\xFCrde haben\xBB). \u042D\u0442\u043E \u0444\u043E\u0440\u043C\u0430 \u0438\u0437 Pr\xE4teritumstamm + e."
  },
  {
    text: "Wenn er reich {0}, w\xFCrde er nicht mehr arbeiten.",
    answers: ["w\xE4re"],
    hint: "(sein)",
    why: "sein \u0432 Konjunktiv II \u2014 w\xE4re. \u041D\u0435 \xABw\xFCrde sein\xBB."
  },
  {
    text: "An deiner Stelle {0} ich sofort {1}.",
    answers: ["w\xFCrde", "gehen"],
    hint: "(gehen)",
    why: "\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B: w\xFCrde \u043D\u0430 2-\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 + Infinitiv \u0432 \u043A\u043E\u043D\u0446\u0435. \xABAn deiner Stelle\xBB \u2014 \u0442\u0438\u043F\u043E\u0432\u043E\u0439 \u0442\u0440\u0438\u0433\u0433\u0435\u0440 Konjunktiv II. \u0424\u043E\u0440\u043C\u0430 ginge \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442, \u043D\u043E \u0432 \u0436\u0438\u0432\u043E\u0439 \u0440\u0435\u0447\u0438 \u043F\u043E\u0447\u0442\u0438 \u0432\u044B\u0442\u0435\u0441\u043D\u0435\u043D\u0430 \u2014 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442 \u0441\u0435\u0433\u043E\u0434\u043D\u044F: w\xFCrde \u2026 gehen."
  },
  {
    text: "Wenn ich das Geld {0}, w\xFCrde ich eine Reise machen.",
    answers: ["h\xE4tte"],
    hint: "(haben)",
    why: "\u0423\u0441\u043B\u043E\u0432\u0438\u0435 \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u043E \u2192 Konjunktiv II: h\xE4tte."
  },
  {
    text: "Ich {0} gern besser Deutsch sprechen.",
    answers: ["k\xF6nnte"],
    hint: "(k\xF6nnen)",
    why: "k\xF6nnen \u2192 k\xF6nnte. \u041C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0435 \u0433\u043B\u0430\u0433\u043E\u043B\u044B \u0432 KII \u0438\u043C\u0435\u044E\u0442 \u0441\u0432\u043E\u044E \u0444\u043E\u0440\u043C\u0443: k\xF6nnte, m\xFCsste, d\xFCrfte, sollte."
  },
  {
    text: "Was {0} du an meiner Stelle machen?",
    answers: ["w\xFCrdest"],
    hint: "(tun \u2192 w\xFCrde)",
    why: "w\xFCrde \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u0442\u0441\u044F: ich w\xFCrde, du w\xFCrdest, er w\xFCrde, wir w\xFCrden."
  },
  {
    text: "Es {0} sch\xF6n, dich zu sehen.",
    answers: ["w\xE4re"],
    hint: "(sein)",
    why: "Es w\xE4re sch\xF6n \u2026 \u2014 \u0432\u0435\u0436\u043B\u0438\u0432\u0430\u044F \u0438 \u0438\u0440\u0440\u0435\u0430\u043B\u044C\u043D\u0430\u044F \u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u043E\u0432\u043A\u0430 \u0447\u0435\u0440\u0435\u0437 w\xE4re."
  },
  {
    text: "Wenn wir ein Auto {0}, k\xF6nnten wir Ausfl\xFCge machen.",
    answers: ["h\xE4tten"],
    hint: "(haben)",
    why: "wir \u2192 h\xE4tten. \u041E\u0431\u0430 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0441\u0442\u043E\u044F\u0442 \u0432 Konjunktiv II."
  },
  {
    text: "Wenn du mich fragst, {0} du das Angebot annehmen.",
    answers: ["solltest"],
    hint: "(sollen)",
    why: "sollen \u2192 solltest. \u041C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u044B\u043C, Infinitiv \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446."
  },
  {
    text: "Ohne Brille {0} ich nichts sehen.",
    answers: ["k\xF6nnte"],
    hint: "(k\xF6nnen)",
    why: "\xABOhne \u2026\xBB = \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u0435 \u0431\u0435\u0437 wenn \u2192 KII: k\xF6nnte."
  },
  {
    text: "Wenn er nicht so viel rauchen {0}, w\xE4re er fitter.",
    answers: ["w\xFCrde"],
    hint: "(rauchen)",
    why: "rauchen \u2014 \u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 w\xFCrde + Infinitiv, \u0430 \u043D\u0435 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u0430\u044F \u0444\u043E\u0440\u043C\u0430."
  },
  {
    text: "Wenn ich an deiner Stelle {0}, w\xFCrde ich um Hilfe bitten.",
    answers: ["w\xE4re"],
    hint: "(sein)",
    why: "\xABan deiner Stelle w\xE4re ich \u2026\xBB \u2014 \u0438\u0440\u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435: w\xE4re, \u043D\u0435 w\xFCrde sein."
  }
];
var VERBEN_PRAEP = [
  { text: "Ich warte {0} den Bus.", prep: "auf", hint: "(warten)", why: "warten auf + Akkusativ \u2014 \u0432\u0441\u0435\u0433\u0434\u0430 auf, \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0442\u043E\u0433\u043E, \u0436\u0434\u0443 \u044F \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430 \u0438\u043B\u0438 \u0430\u0432\u0442\u043E\u0431\u0443\u0441." },
  { text: "Er freut sich {0} den Urlaub.", prep: "auf", hint: "(sich freuen)", why: "sich freuen auf + Akk \u2014 \u043F\u0440\u0435\u0434\u0432\u043A\u0443\u0448\u0435\u043D\u0438\u0435 (\u043E\u0442\u043F\u0443\u0441\u043A \u0435\u0449\u0451 \u043D\u0435 \u0431\u044B\u043B). \u041E\u0442\u043F\u0440\u0430\u0437\u0434\u043D\u043E\u0432\u0430\u043D\u043D\u043E\u0435 \u2014 \xFCber." },
  { text: "Sie freut sich {0} das Geschenk.", prep: "\xFCber", hint: "(sich freuen)", why: "sich freuen \xFCber + Akk \u2014 \u0440\u0430\u0434\u043E\u0441\u0442\u044C \u0443\u0436\u0435 \u0441\u043B\u0443\u0447\u0438\u0432\u0448\u0435\u043C\u0443\u0441\u044F (\u043F\u043E\u0434\u0430\u0440\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0435\u043D)." },
  { text: "Wir interessieren uns {0} die Geschichte Deutschlands.", prep: "f\xFCr", hint: "(sich interessieren)", why: "sich interessieren f\xFCr + Akkusativ." },
  { text: "Er \xE4rgert sich {0} den L\xE4rm.", prep: "\xFCber", hint: "(sich \xE4rgern)", why: "sich \xE4rgern \xFCber + Akkusativ \u2014 \u0441\u0435\u0440\u0434\u0438\u0442\u044C\u0441\u044F \u043D\u0430 \u0447\u0442\u043E-\u0442\u043E." },
  { text: "Ich denke oft {0} meine Kindheit.", prep: "an", hint: "(denken)", why: "denken an + Akkusativ." },
  { text: "Ich erinnere mich {0} den Namen.", prep: "an", hint: "(sich erinnern)", why: "sich erinnern an + Akkusativ." },
  { text: "Sie nimmt {0} dem Kurs teil.", prep: "an", hint: "(teilnehmen)", why: "teilnehmen an + Dativ. \xABteil\xBB \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u0442\u0441\u044F \u0432 \u043A\u043E\u043D\u0446\u0435: nimmt teil." },
  { text: "Ich gew\xF6hne mich {0} das Wetter.", prep: "an", hint: "(sich gew\xF6hnen)", why: "sich gew\xF6hnen an + Akkusativ \u2014 \u043F\u0440\u0438\u0432\u044B\u043A\u0430\u0442\u044C \u043A \u0447\u0435\u043C\u0443-\u0442\u043E." },
  { text: "Wir unterhalten uns {0} den Urlaub.", prep: "\xFCber", hint: "(sich unterhalten)", why: "sich unterhalten \xFCber + Akkusativ \u2014 \u0440\u0430\u0437\u0433\u043E\u0432\u0430\u0440\u0438\u0432\u0430\u0442\u044C \u043E \u0447\u0451\u043C-\u0442\u043E." },
  { text: "Sie bewirbt sich {0} eine Stelle als Lehrerin.", prep: "um", hint: "(sich bewerben)", why: "sich bewerben um + Akkusativ \u2014 \u043F\u0440\u0435\u0442\u0435\u043D\u0434\u043E\u0432\u0430\u0442\u044C \u043D\u0430 \u0447\u0442\u043E-\u0442\u043E." },
  { text: "Ich habe Angst {0} Hunden.", prep: "vor", hint: "(Angst haben)", why: "Angst haben vor + Dativ." },
  { text: "Das h\xE4ngt {0} der Tagesform ab.", prep: "von", hint: "(abh\xE4ngen)", why: "abh\xE4ngen von + Dativ. \xABab\xBB \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u0442\u0441\u044F \u0432 \u043A\u043E\u043D\u0435\u0446." },
  { text: "Er entschuldigt sich {0} seiner Lehrerin.", prep: "bei", hint: "(sich entschuldigen)", why: "sich entschuldigen bei + Dativ \u2014 \u0443 \u043A\u043E\u0433\u043E \u0438\u0437\u0432\u0438\u043D\u044F\u044E\u0441\u044C. \u0417\u0430 \u0447\u0442\u043E \u2014 f\xFCr." },
  { text: "Wir k\xFCmmern uns {0} unsere Gro\xDFeltern.", prep: "um", hint: "(sich k\xFCmmern)", why: "sich k\xFCmmern um + Akkusativ \u2014 \u0437\u0430\u0431\u043E\u0442\u0438\u0442\u044C\u0441\u044F \u043E \u043A\u043E\u043C-\u0442\u043E." },
  { text: "Es handelt sich {0} ein wichtiges Problem.", prep: "um", hint: "(es handelt sich)", why: "es handelt sich um + Akkusativ \u2014 \u0440\u0435\u0447\u044C \u0438\u0434\u0451\u0442 \u043E \u0447\u0451\u043C-\u0442\u043E." },
  { text: "Sie fragt {0} dem Weg.", prep: "nach", hint: "(fragen)", why: "fragen nach + Dativ \u2014 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0442\u044C \u043E \u0447\u0451\u043C-\u0442\u043E. \u0427\u0435\u043B\u043E\u0432\u0435\u043A\u0430 \u2014 wen fragen." },
  { text: "Ich verlasse mich {0} dich.", prep: "auf", hint: "(sich verlassen)", why: "sich verlassen auf + Akkusativ \u2014 \u043F\u043E\u043B\u0430\u0433\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043A\u043E\u0433\u043E-\u0442\u043E." }
];
var DOPPELKONN = [
  { text: "Er ist {0} m\xFCde {1} hungrig.", first: "weder", second: "noch", why: "weder \u2026 noch \u2014 \u0434\u0432\u043E\u0439\u043D\u043E\u0435 \u043E\u0442\u0440\u0438\u0446\u0430\u043D\u0438\u0435: \xAB\u043D\u0438 \u2026 \u043D\u0438\xBB. \u0421\u043E\u0435\u0434\u0438\u043D\u044F\u0435\u0442 \u0447\u043B\u0435\u043D\u044B \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0437\u0430\u043F\u044F\u0442\u043E\u0439 \u043D\u0435\u0442 (Duden)." },
  { text: "{0} gehe ich ins Kino, {1} bleibe ich zu Hause.", first: "entweder", second: "oder", why: "entweder \u2026 oder \u2014 \xAB\u0438\u043B\u0438 \u2026 \u0438\u043B\u0438\xBB. \u041F\u043E\u0441\u043B\u0435 oder \u0432 \u043D\u043E\u0432\u043E\u0439 \u043A\u043B\u0430\u0443\u0437\u0435 \u0433\u043B\u0430\u0433\u043E\u043B \u043D\u0430 2-\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u0438." },
  { text: "Sie spricht {0} Deutsch {1} Englisch.", first: "sowohl", second: "als auch", why: "sowohl \u2026 als auch \u2014 \xAB\u0438 \u2026 \u0438\xBB, \u043E\u0431\u0430 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0432\u0435\u0440\u043D\u044B. \u0421\u043E\u0435\u0434\u0438\u043D\u044F\u0435\u0442 \u0447\u043B\u0435\u043D\u044B \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u2014 \u0437\u0430\u043F\u044F\u0442\u043E\u0439 \u043D\u0435\u0442 (Duden)." },
  { text: "Er ist {0} intelligent, {1} flei\xDFig.", first: "nicht nur", second: "sondern auch", why: "nicht nur \u2026 sondern auch \u2014 \xAB\u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u2026 \u043D\u043E \u0438\xBB." },
  { text: "{0} mehr du \xFCbst, {1} besser sprichst du.", first: "je", second: "desto", why: "je \u2026 desto + Komparativ. \u041F\u043E\u0441\u043B\u0435 desto \u0433\u043B\u0430\u0433\u043E\u043B \u0438\u0434\u0451\u0442 \u0441\u0440\u0430\u0437\u0443: desto besser sprichst du." },
  { text: "{0} regnet es, {1} scheint die Sonne.", first: "bald", second: "bald", why: "bald \u2026 bald \u2014 \xAB\u0442\u043E \u2026 \u0442\u043E\xBB. \u0412 \u043D\u0430\u0447\u0430\u043B\u0435 \u043A\u043B\u0430\u0443\u0437\u044B \u0441\u043B\u043E\u0432\u043E \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u0443\u044E \u0431\u0443\u043A\u0432\u0443." },
  { text: "Ich habe {0} Zeit {1} Lust.", first: "weder", second: "noch", why: "weder \u2026 noch \u2014 \u043E\u0431\u0430 \u043E\u0442\u0440\u0438\u0446\u0430\u043D\u0438\u044F \u043D\u0443\u0436\u043D\u044B: \u043D\u0438 \u0432\u0440\u0435\u043C\u0435\u043D\u0438, \u043D\u0438 \u0436\u0435\u043B\u0430\u043D\u0438\u044F." },
  { text: "{0} du kommst jetzt, {1} du wartest bis morgen.", first: "entweder", second: "oder", why: "entweder \u2026 oder \u2014 \u0434\u0432\u0430 \u0432\u0437\u0430\u0438\u043C\u043E\u0438\u0441\u043A\u043B\u044E\u0447\u0430\u044E\u0449\u0438\u0445 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430. \u0413\u043B\u0430\u0433\u043E\u043B \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 oder." },
  { text: "Das Buch ist {0} spannend {1} lustig.", first: "sowohl", second: "als auch", why: "sowohl \u2026 als auch \u0441\u043E\u0435\u0434\u0438\u043D\u044F\u0435\u0442 \u043F\u0440\u0438\u043B\u0430\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0431\u0435\u0437 \u043F\u043E\u0432\u0442\u043E\u0440\u043E\u0432, \u0437\u0430\u043F\u044F\u0442\u043E\u0439 \u043D\u0435\u0442 (Duden)." },
  { text: "Sie ist {0} Lehrerin, {1} Mutter.", first: "nicht nur", second: "sondern auch", why: "nicht nur \u2026 sondern auch \u2014 \u0437\u0434\u0435\u0441\u044C \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u0435\u0439: \u043E\u0431\u0435 \u0440\u043E\u043B\u0438." },
  { text: "{0} mehr er isst, {1} dicker wird er.", first: "je", second: "desto", why: "je \u2026 desto \u2014 \u043E\u0431\u0435 \u0447\u0430\u0441\u0442\u0438 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442 Komparativ; \u043F\u043E\u0441\u043B\u0435 desto \u0441\u0440\u0430\u0437\u0443 \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B." },
  { text: "{0} telefoniert er, {1} schreibt er E-Mails.", first: "bald", second: "bald", why: "bald \u2026 bald \u2014 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0447\u0435\u0440\u0435\u0434\u0443\u044E\u0442\u0441\u044F." }
];
var PRAETERITUM = [
  { text: "Gestern {0} ich um sechs {1}.", v: "aufstehen", twoGaps: true, hint: "(aufstehen)" },
  { text: "Der Zug {0} zehn Minuten {1}.", v: "abfahren", twoGaps: true, hint: "(abfahren)" },
  { text: "Sie {0} ihre Mutter gestern Abend {1}.", v: "anrufen", twoGaps: true, hint: "(anrufen)" },
  { text: "Er {0} gestern bis Mittag.", v: "schlafen", twoGaps: false, hint: "(schlafen)" },
  { text: "Ich {0} ihm den Schl\xFCssel.", v: "geben", twoGaps: false, hint: "(geben)" },
  { text: "Der Bus {0} zehn Minuten sp\xE4ter {1}.", v: "ankommen", twoGaps: true, hint: "(ankommen)" },
  { text: "Er {0} alle Freunde zum Geburtstag {1}.", v: "einladen", twoGaps: true, hint: "(einladen)" },
  { text: "Ich {0} gestern nichts {1}.", v: "mitbringen", twoGaps: true, hint: "(mitbringen)" },
  { text: "Ich {0} die Frage nicht.", v: "verstehen", twoGaps: false, hint: "(verstehen)" },
  { text: "Der Film {0} erst um neun {1}.", v: "anfangen", twoGaps: true, hint: "(anfangen)" },
  { text: "Sie {0} den Roman in zwei Tagen.", v: "lesen", twoGaps: false, hint: "(lesen)" },
  { text: "Ich {0} am Hauptbahnhof {1}.", v: "aussteigen", twoGaps: true, hint: "(aussteigen)" },
  { text: "Das Kind {0} ein Lied.", v: "singen", twoGaps: false, hint: "(singen)" },
  { text: "Sie {0} sehr schnell.", v: "sprechen", twoGaps: false, hint: "(sprechen)" },
  { text: "Ich {0} zum Gl\xFCck {1}.", v: "mitkommen", twoGaps: true, hint: "(mitkommen)" },
  { text: "Das Konzert {0} im Park {1}.", v: "stattfinden", twoGaps: true, hint: "(stattfinden)" },
  { text: "Ich {0} ihn zuf\xE4llig am Bahnhof.", v: "treffen", twoGaps: false, hint: "(treffen)" },
  { text: "Sie {0} den ganzen Tag zu Hause.", v: "bleiben", twoGaps: false, hint: "(bleiben)" },
  { text: "Er {0} die Getr\xE4nke.", v: "bringen", twoGaps: false, hint: "(bringen)" },
  { text: "Ich {0} lange an meine Kindheit.", v: "denken", twoGaps: false, hint: "(denken)" }
];
var WORDBILD = [
  { inf: "wohnen", nomen: "die Wohnung", why: "\u0413\u043B\u0430\u0433\u043E\u043B \u2192 -ung: die Wohnung. \u0412\u0441\u0435 \u0441\u043B\u043E\u0432\u0430 \u043D\u0430 -ung \u2014 \u0436\u0435\u043D\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430." },
  { inf: "einladen", nomen: "die Einladung", why: "einladen \u2192 die Einladung. \u041E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432\u043D\u0443\u0442\u0440\u0438 \u0441\u043B\u043E\u0432\u0430: ein + lad + ung." },
  { inf: "pr\xFCfen", nomen: "die Pr\xFCfung", why: "pr\xFCfen \u2192 die Pr\xFCfung (\u0441 \u0443\u043C\u043B\u0430\u0443\u0442\u043E\u043C \u2014 \u043E\u043D \u0443\u0436\u0435 \u0432 \u0441\u043B\u043E\u0432\u0435)." },
  { inf: "\xFCbersetzen", nomen: "die \xDCbersetzung", why: "\xFCbersetzen \u2192 die \xDCbersetzung. \u041D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \xFCber- \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F." },
  { inf: "sich anmelden", nomen: "die Anmeldung", why: "sich anmelden \u2192 die Anmeldung. \u0412\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u0435 \u0432 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043D\u0435 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0438\u0442." },
  { inf: "meinen", nomen: "die Meinung", why: "meinen \u2192 die Meinung. -ung \u0432\u0441\u0435\u0433\u0434\u0430 die, \u0434\u0430\u0436\u0435 \u043A\u043E\u0433\u0434\u0430 \u043E\u0441\u043D\u043E\u0432\u0430 \u043D\u0430 -n." },
  { inf: "hoffnen", nomen: "die Hoffnung", why: "hoffnen \u2192 die Hoffnung, f." },
  { inf: "\xFCben", nomen: "die \xDCbung", why: "\xFCben \u2192 die \xDCbung." },
  { inf: "bewegen", nomen: "die Bewegung", why: "bewegen \u2192 die Bewegung, f." },
  { inf: "erkl\xE4ren", nomen: "die Erkl\xE4rung", why: "erkl\xE4ren \u2192 die Erkl\xE4rung. \u041D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F er- \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430." },
  { inf: "entscheiden", nomen: "die Entscheidung", why: "entscheiden \u2192 die Entscheidung, f." },
  { inf: "rechnen", nomen: "die Rechnung", why: "rechnen \u2192 die Rechnung, f (\u0441\u0447\u0451\u0442)." },
  { inf: "sich bewerben", nomen: "die Bewerbung", why: "sich bewerben \u2192 die Bewerbung, f (\u0437\u0430\u044F\u0432\u043A\u0430)." },
  { inf: "arbeiten", nomen: "der Arbeiter", why: "\u0413\u043B\u0430\u0433\u043E\u043B \u2192 -er = \u0447\u0435\u043B\u043E\u0432\u0435\u043A: der Arbeiter. \u0412\u0441\u0435 \u043D\u0430 -er (\u043B\u0438\u0446\u043E) \u2014 der." },
  { inf: "lehren", nomen: "der Lehrer", why: "lehren \u2192 der Lehrer, der." },
  { inf: "verkaufen", nomen: "der Verk\xE4ufer", why: "verkaufen \u2192 der Verk\xE4ufer. \u041D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F ver- + -er." },
  { inf: "fahren", nomen: "der Fahrer", why: "fahren \u2192 der Fahrer, der (\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C)." },
  { inf: "essen", nomen: "das Essen", why: "\u0418\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 \u043A\u0430\u043A \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435: das Essen \u2014 \u0441 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0432\u044B, \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434, \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439." },
  { inf: "rauchen", nomen: "das Rauchen", why: "das Rauchen \u2014 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432, das." },
  { inf: "schwimmen", nomen: "das Schwimmen", why: "das Schwimmen \u2014 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432, das." },
  { inf: "sprechen", nomen: "das Sprechen", why: "das Sprechen \u2014 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432, das." }
];
var ZEITMIX = [
  { text: "Gestern {0} ich, dass die Pr\xFCfung schwer war.", inf: "wissen", form: "Pr\xE4teritum", answers: ["wusste"], why: "wissen \u2192 wusste: \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B, \u0433\u043B\u0430\u0441\u043D\u0430\u044F \u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F." },
  { text: "Ich {0} diesen Film schon zweimal.", inf: "sehen", form: "Perfekt", answers: ["habe gesehen"], why: "Perfekt = haben (sehen \u2014 haben) + Partizip II gesehen." },
  { text: "Das Auto {0} gerade.", inf: "reparieren", form: "Passiv Pr\xE4sens", answers: ["wird repariert"], why: "Passiv Pr\xE4sens = wird + Partizip II; \u0434\u0435\u044F\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0437\u0432\u0430\u043D." },
  { text: "Morgen {0} wir nach Hamburg.", inf: "fahren", form: "Futur I", answers: ["werden fahren"], why: "Futur I = werden (\u043F\u043E\u0437\u0438\u0446\u0438\u044F 2) + Infinitiv \u0432 \u043A\u043E\u043D\u0446\u0435." },
  { text: "Er {0} um sechs Uhr.", inf: "aufstehen", form: "Pr\xE4teritum", answers: ["stand auf"], why: "aufstehen \u2192 stand auf: \u0441\u0438\u043B\u044C\u043D\u044B\u0439 Pr\xE4teritum + \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432 \u043A\u043E\u043D\u0435\u0446." },
  { text: "Die Briefe {0} gestern.", inf: "schreiben", form: "Passiv Pr\xE4teritum", answers: ["wurden geschrieben"], why: "Passiv Pr\xE4teritum = wurden + Partizip II." },
  { text: "Ich {0} mehr Zeit.", inf: "haben", form: "Konjunktiv II", answers: ["h\xE4tte"], why: "haben \u0432 KII \u2014 h\xE4tte, \u043D\u0435 \xABw\xFCrde haben\xBB." },
  { text: "Wir {0} das Buch schon.", inf: "lesen", form: "Perfekt", answers: ["haben gelesen"], why: "lesen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B: haben gelesen." },
  { text: "Die Stra\xDFe {0} letztes Jahr.", inf: "bauen", form: "Passiv Pr\xE4teritum", answers: ["wurde gebaut"], why: "Passiv Pr\xE4teritum: wurde + gebaut." },
  { text: "Ohne Auto {0} ich jeden Tag zur Arbeit.", inf: "gehen", form: "Pr\xE4teritum", answers: ["ging"], why: "gehen \u2192 ging." },
  { text: "Der Termin {0} leider.", inf: "vergessen", form: "Passiv Pr\xE4sens", answers: ["wird vergessen"], why: "vergessen \u2014 \u043D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430, Partizip II \u0431\u0435\u0437 ge-: vergessen." },
  { text: "Er {0} gestern bis Mittag.", inf: "schlafen", form: "Perfekt", answers: ["hat geschlafen"], why: "schlafen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B: hat geschlafen." }
];
var UMFORM = [
  { form: "Pr\xE4teritum", given: "Er geht ins Kino.", answers: ["Er ging ins Kino."], why: "gehen \u2192 ging: \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B, 1/3 \u043B\u0438\u0446\u043E \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442." },
  { form: "Perfekt", given: "Sie kauft ein Auto.", answers: ["Sie hat ein Auto gekauft."], why: "kaufen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B: hat \u2026 gekauft." },
  { form: "Passiv Pr\xE4sens", given: "Man repariert das Auto.", answers: ["Das Auto wird repariert."], why: "\u0410\u043A\u043A\u0443\u0437\u0430\u0442\u0438\u0432-\u043E\u0431\u044A\u0435\u043A\u0442 \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C; man \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442: wird + repariert." },
  { form: "Passiv Pr\xE4teritum", given: "Man baute die Br\xFCcke 1935.", answers: ["Die Br\xFCcke wurde 1935 gebaut."], why: "Passiv Pr\xE4teritum: wurde + Partizip II; \u043E\u0431\u0441\u0442\u043E\u044F\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F." },
  { form: "Futur I", given: "Ich komme morgen.", answers: ["Ich werde morgen kommen."], why: "werden \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 2 + Infinitiv \u0432 \u043A\u043E\u043D\u0435\u0446." },
  { form: "Konjunktiv II", given: "Ich habe keine Zeit.", answers: ["Ich h\xE4tte keine Zeit."], why: "haben \u2192 h\xE4tte: \u0444\u043E\u0440\u043C\u0430 \u0438\u0437 Pr\xE4teritumstamm, \u043D\u0435 w\xFCrde haben." },
  { form: "Pr\xE4teritum", given: "Sie schreibt einen Brief.", answers: ["Sie schrieb einen Brief."], why: "schreiben \u2192 schrieb." },
  { form: "Perfekt", given: "Er steht um sechs auf.", answers: ["Er ist um sechs aufgestanden."], why: "aufstehen \u2014 sein-\u0433\u043B\u0430\u0433\u043E\u043B (\u0441\u043C\u0435\u043D\u0430 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F): ist \u2026 aufgestanden, \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432\u043D\u0443\u0442\u0440\u0438 Partizip." },
  { form: "Passiv mit Modalverb", given: "Man muss die Regeln beachten.", answers: ["Die Regeln m\xFCssen beachtet werden."], why: "\u041F\u0430\u0441\u0441\u0438\u0432 \u0441 \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u043C: m\xFCssen + Partizip II + werden \u0412 \u0421\u0410\u041C\u041E\u041C \u041A\u041E\u041D\u0426\u0415." },
  { form: "Perfekt", given: "Wir fuhren nach Berlin.", answers: ["Wir sind nach Berlin gefahren."], why: "Pr\xE4teritum \u2192 Perfekt: fahren \u2014 sein-\u0433\u043B\u0430\u0433\u043E\u043B: sind \u2026 gefahren." },
  { form: "Konjunktiv II", given: "Du musst mehr lernen.", answers: ["Du m\xFCsstest mehr lernen."], why: "m\xFCssen \u2192 m\xFCsste: \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u043C\u0435\u044E\u0442 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u0443\u044E \u0444\u043E\u0440\u043C\u0443 KII." },
  { form: "Passiv Perfekt", given: "Man hat das Fenster ge\xF6ffnet.", answers: ["Das Fenster ist ge\xF6ffnet worden."], why: "Passiv Perfekt = ist + Partizip II + worden. \u041D\u0435 \xABist geworden\xBB!" }
];
var ADJEKTIVE = [
  { base: "schnell", komp: "schneller", sup: "am schnellsten" },
  { base: "langsam", komp: "langsamer", sup: "am langsamsten" },
  { base: "sch\xF6n", komp: "sch\xF6ner", sup: "am sch\xF6nsten" },
  { base: "ruhig", komp: "ruhiger", sup: "am ruhigsten" },
  { base: "laut", komp: "lauter", sup: "am lautesten" },
  { base: "flei\xDFig", komp: "flei\xDFiger", sup: "am flei\xDFigsten" },
  { base: "faul", komp: "fauler", sup: "am faulsten" },
  { base: "sauber", komp: "sauberer", sup: "am saubersten" },
  { base: "billig", komp: "billiger", sup: "am billigsten" },
  { base: "teuer", komp: "teurer", sup: "am teuersten" },
  { base: "alt", komp: "\xE4lter", sup: "am \xE4ltesten" },
  { base: "jung", komp: "j\xFCnger", sup: "am j\xFCngsten" },
  { base: "gro\xDF", komp: "gr\xF6\xDFer", sup: "am gr\xF6\xDFten" },
  { base: "klein", komp: "kleiner", sup: "am kleinsten" },
  { base: "lang", komp: "l\xE4nger", sup: "am l\xE4ngsten" },
  { base: "kurz", komp: "k\xFCrzer", sup: "am k\xFCrzesten" },
  { base: "hoch", komp: "h\xF6her", sup: "am h\xF6chsten" },
  { base: "tief", komp: "tiefer", sup: "am tiefsten" },
  { base: "warm", komp: "w\xE4rmer", sup: "am w\xE4rmsten" },
  { base: "kalt", komp: "k\xE4lter", sup: "am k\xE4ltesten" },
  { base: "stark", komp: "st\xE4rker", sup: "am st\xE4rksten" },
  { base: "schwach", komp: "schw\xE4cher", sup: "am schw\xE4chsten" },
  { base: "gut", komp: "besser", sup: "am besten" },
  { base: "viel", komp: "mehr", sup: "am meisten" },
  { base: "gern", komp: "lieber", sup: "am liebsten" },
  { base: "nah", komp: "n\xE4her", sup: "am n\xE4chsten" },
  { base: "dunkel", komp: "dunkler", sup: "am dunkelsten" },
  { base: "leise", komp: "leiser", sup: "am leisesten" },
  { base: "freundlich", komp: "freundlicher", sup: "am freundlichsten" },
  { base: "modern", komp: "moderner", sup: "am modernsten" }
];
var GEGENTEIL = [
  { a: "ruhig", answers: ["laut", "wild"] },
  { a: "gut", answers: ["schlecht", "b\xF6se"] },
  { a: "sch\xF6n", answers: ["h\xE4sslich", "gr\xE4sslich"] },
  { a: "schnell", answers: ["langsam"] },
  { a: "flei\xDFig", answers: ["faul"] },
  { a: "hoch", answers: ["tief", "niedrig", "flach"] },
  { a: "alt", answers: ["jung", "neu"] },
  { a: "gro\xDF", answers: ["klein"] },
  { a: "warm", answers: ["kalt"] },
  { a: "hell", answers: ["dunkel"] },
  { a: "teuer", answers: ["billig", "g\xFCnstig"] },
  { a: "schwer", answers: ["leicht", "einfach"] },
  { a: "fr\xFCh", answers: ["sp\xE4t"] },
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
  { a: "kalt", answers: ["warm", "hei\xDF"] },
  { a: "klein", answers: ["gro\xDF"] },
  { a: "jung", answers: ["alt"] },
  { a: "sp\xE4t", answers: ["fr\xFCh"] },
  { a: "lang", answers: ["kurz"] },
  { a: "dick", answers: ["d\xFCnn"] },
  { a: "eng", answers: ["weit", "breit"] },
  { a: "trocken", answers: ["nass"] },
  { a: "leer", answers: ["voll"] },
  { a: "laut", answers: ["leise"] },
  { a: "schwach", answers: ["stark"] },
  { a: "billig", answers: ["teuer", "g\xFCnstig"] },
  { a: "leicht", answers: ["schwer", "schwierig"] },
  { a: "neu", answers: ["alt"] },
  { a: "reich", answers: ["arm"] }
];

// src/lib/de/nouns.ts
var n = (nom, pl, weak = false) => ({
  nom,
  genus: nom.split(" ")[0],
  pl,
  weak
});
var NOUNS = [
  /* ------------------------------------------------------------- der ---- */
  n("der Tisch", "Tische"),
  n("der Stuhl", "St\xFChle"),
  n("der Schrank", "Schr\xE4nke"),
  n("der Apfel", "\xC4pfel"),
  n("der Hund", "Hunde"),
  n("der Baum", "B\xE4ume"),
  n("der Garten", "G\xE4rten"),
  n("der Lehrer", "Lehrer"),
  n("der Freund", "Freunde"),
  n("der Vater", "V\xE4ter"),
  n("der Bruder", "Br\xFCder"),
  n("der Sohn", "S\xF6hne"),
  n("der Wagen", "Wagen"),
  n("der Schl\xFCssel", "Schl\xFCssel"),
  n("der Bahnhof", "Bahnh\xF6fe"),
  n("der Zug", "Z\xFCge"),
  n("der Bus", "Busse"),
  n("der Kuchen", "Kuchen"),
  n("der Saft", "S\xE4fte"),
  n("der Fisch", "Fische"),
  n("der Salat", "Salate"),
  n("der Computer", "Computer"),
  n("der Roman", "Romane"),
  n("der Vertrag", "Vertr\xE4ge"),
  n("der Beruf", "Berufe"),
  n("der Platz", "Pl\xE4tze"),
  n("der Park", "Parks"),
  n("der Abend", "Abende"),
  n("der Monat", "Monate"),
  n("der Winter", "Winter"),
  n("der Sommer", "Sommer"),
  n("der Regenschirm", "Regenschirme"),
  n("der Bleistift", "Bleistifte"),
  n("der Mantel", "M\xE4ntel"),
  n("der Rock", "R\xF6cke"),
  n("der Hut", "H\xFCte"),
  n("der Fu\xDF", "F\xFC\xDFe"),
  n("der Kopf", "K\xF6pfe"),
  n("der Arm", "Arme"),
  n("der Tag", "Tage"),
  n("der Fehler", "Fehler"),
  n("der Preis", "Preise"),
  n("der Weg", "Wege"),
  n("der Film", "Filme"),
  n("der Koffer", "Koffer"),
  n("der K\xFChlschrank", "K\xFChlschr\xE4nke"),
  n("der Drucker", "Drucker"),
  n("der L\xF6ffel", "L\xF6ffel"),
  n("der Teller", "Teller"),
  n("der Becher", "Becher"),
  /* ------------------------------------------------------------- die ---- */
  n("die Frau", "Frauen"),
  n("die Mutter", "M\xFCtter"),
  n("die Schwester", "Schwestern"),
  n("die Tochter", "T\xF6chter"),
  n("die Freundin", "Freundinnen"),
  n("die Lehrerin", "Lehrerinnen"),
  n("die Stra\xDFe", "Stra\xDFen"),
  n("die Stadt", "St\xE4dte"),
  n("die Schule", "Schulen"),
  n("die Universit\xE4t", "Universit\xE4ten"),
  n("die Wohnung", "Wohnungen"),
  n("die K\xFCche", "K\xFCchen"),
  n("die T\xFCr", "T\xFCren"),
  n("die Wand", "W\xE4nde"),
  n("die Tasche", "Taschen"),
  n("die Flasche", "Flaschen"),
  n("die Tasse", "Tassen"),
  n("die Zeitung", "Zeitungen"),
  n("die Zeitschrift", "Zeitschriften"),
  n("die Karte", "Karten"),
  n("die Lampe", "Lampen"),
  n("die Blume", "Blumen"),
  n("die Pflanze", "Pflanzen"),
  n("die Katze", "Katzen"),
  n("die Maus", "M\xE4use"),
  n("die Suppe", "Suppen"),
  n("die Kartoffel", "Kartoffeln"),
  n("die Tomate", "Tomaten"),
  n("die Zwiebel", "Zwiebeln"),
  n("die Sprache", "Sprachen"),
  n("die Frage", "Fragen"),
  n("die Antwort", "Antworten"),
  n("die Arbeit", "Arbeiten"),
  n("die Aufgabe", "Aufgaben"),
  n("die Pr\xFCfung", "Pr\xFCfungen"),
  n("die Rechnung", "Rechnungen"),
  n("die Idee", "Ideen"),
  n("die Geschichte", "Geschichten"),
  n("die Bibliothek", "Bibliotheken"),
  n("die Fabrik", "Fabriken"),
  n("die Maschine", "Maschinen"),
  n("die Brille", "Brillen"),
  n("die Hose", "Hosen"),
  n("die Jacke", "Jacken"),
  n("die Hand", "H\xE4nde"),
  n("die Nase", "Nasen"),
  /* ------------------------------------------------------------- das ---- */
  n("das Haus", "H\xE4user"),
  n("das Zimmer", "Zimmer"),
  n("das Fenster", "Fenster"),
  n("das Bett", "Betten"),
  n("das Buch", "B\xFCcher"),
  n("das Heft", "Hefte"),
  n("das Auto", "Autos"),
  n("das Fahrrad", "Fahrr\xE4der"),
  n("das Kind", "Kinder"),
  n("das M\xE4dchen", "M\xE4dchen"),
  n("das Brot", "Brote"),
  n("das Bier", "Biere"),
  n("das Ei", "Eier"),
  n("das Bild", "Bilder"),
  n("das Foto", "Fotos"),
  n("das Telefon", "Telefone"),
  n("das Handy", "Handys"),
  n("das Radio", "Radios"),
  n("das Regal", "Regale"),
  n("das Sofa", "Sofas"),
  n("das Messer", "Messer"),
  n("das Glas", "Gl\xE4ser"),
  n("das Kleid", "Kleider"),
  n("das Hemd", "Hemden"),
  n("das Restaurant", "Restaurants"),
  n("das Hotel", "Hotels"),
  n("das B\xFCro", "B\xFCros"),
  n("das Krankenhaus", "Krankenh\xE4user"),
  n("das Theater", "Theater"),
  n("das Kino", "Kinos"),
  n("das Museum", "Museen"),
  n("das Meer", "Meere"),
  n("das Jahr", "Jahre"),
  n("das Wochenende", "Wochenenden"),
  n("das Fr\xFChst\xFCck", "Fr\xFChst\xFCcke"),
  n("das Geschenk", "Geschenke"),
  n("das Problem", "Probleme"),
  n("das Ergebnis", "Ergebnisse"),
  n("das Beispiel", "Beispiele"),
  /* --------------------------------------------- слабое склонение (n-Dekl) */
  n("der Junge", "Jungen", true),
  n("der Student", "Studenten", true),
  n("der Mensch", "Menschen", true),
  n("der Nachbar", "Nachbarn", true),
  n("der Kollege", "Kollegen", true),
  n("der Kunde", "Kunden", true),
  n("der Polizist", "Polizisten", true),
  n("der Tourist", "Touristen", true)
];
var bare = (x) => x.nom.split(" ").slice(1).join(" ");
var BEST = {
  der: { nom: "der", akk: "den", dat: "dem", gen: "des" },
  die: { nom: "die", akk: "die", dat: "der", gen: "der" },
  das: { nom: "das", akk: "das", dat: "dem", gen: "des" }
};
function bestimmter(x, k, plural = false) {
  if (plural) return k === "dat" ? "den" : k === "gen" ? "der" : "die";
  return BEST[x.genus][k];
}
function nomenForm(x, k, plural = false) {
  const base = bare(x);
  if (plural) {
    const p = x.pl;
    if (k === "dat") return /[ns]$/.test(p) ? p : p + "n";
    return p;
  }
  if (x.weak && k !== "nom") {
    return base.endsWith("e") ? base + "n" : base + "en";
  }
  if (k === "gen" && (x.genus === "der" || x.genus === "das")) {
    if (/(s|ß|z|x|ch)$/.test(base)) return base + "es";
    return base + "s";
  }
  return base;
}
function phrase(x, k, plural = false) {
  return `${bestimmter(x, k, plural)} ${nomenForm(x, k, plural)}`;
}

// src/lib/de/verbs.ts
var v = (inf, pr, part, aux = "h", pre, praet) => ({ inf, pr, part, aux, pre, praet });
var VERBS = [
  /* ------------------------------------------------------ правильные ---- */
  v("machen", "mache machst macht machen macht machen", "gemacht"),
  v("kochen", "koche kochst kocht kochen kocht kochen", "gekocht"),
  v("arbeiten", "arbeite arbeitest arbeitet arbeiten arbeitet arbeiten", "gearbeitet"),
  v("wohnen", "wohne wohnst wohnt wohnen wohnt wohnen", "gewohnt"),
  v("lernen", "lerne lernst lernt lernen lernt lernen", "gelernt"),
  v("spielen", "spiele spielst spielt spielen spielt spielen", "gespielt"),
  v("kaufen", "kaufe kaufst kauft kaufen kauft kaufen", "gekauft"),
  v("suchen", "suche suchst sucht suchen sucht suchen", "gesucht"),
  v("h\xF6ren", "h\xF6re h\xF6rst h\xF6rt h\xF6ren h\xF6rt h\xF6ren", "geh\xF6rt"),
  v("sagen", "sage sagst sagt sagen sagt sagen", "gesagt"),
  v("fragen", "frage fragst fragt fragen fragt fragen", "gefragt"),
  v("antworten", "antworte antwortest antwortet antworten antwortet antworten", "geantwortet"),
  v("brauchen", "brauche brauchst braucht brauchen braucht brauchen", "gebraucht"),
  v("\xF6ffnen", "\xF6ffne \xF6ffnest \xF6ffnet \xF6ffnen \xF6ffnet \xF6ffnen", "ge\xF6ffnet"),
  v("warten", "warte wartest wartet warten wartet warten", "gewartet"),
  v("putzen", "putze putzt putzt putzen putzt putzen", "geputzt"),
  v("renovieren", "renoviere renovierst renoviert renovieren renoviert renovieren", "renoviert"),
  v("studieren", "studiere studierst studiert studieren studiert studieren", "studiert"),
  v("telefonieren", "telefoniere telefonierst telefoniert telefonieren telefoniert telefonieren", "telefoniert"),
  v("probieren", "probiere probierst probiert probieren probiert probieren", "probiert"),
  v("reparieren", "repariere reparierst repariert reparieren repariert reparieren", "repariert"),
  v("klingeln", "klingle klingelst klingelt klingeln klingelt klingeln", "geklingelt"),
  v("l\xE4cheln", "l\xE4chle l\xE4chelst l\xE4chelt l\xE4cheln l\xE4chelt l\xE4cheln", "gel\xE4chelt"),
  /* ------------------------------------------- неотделяемые приставки ---- */
  v("besuchen", "besuche besuchst besucht besuchen besucht besuchen", "besucht"),
  v("beenden", "beende beendest beendet beenden beendet beenden", "beendet", "h", void 0, "beendete"),
  v("erkl\xE4ren", "erkl\xE4re erkl\xE4rst erkl\xE4rt erkl\xE4ren erkl\xE4rt erkl\xE4ren", "erkl\xE4rt"),
  v("untersuchen", "untersuche untersuchst untersucht untersuchen untersucht untersuchen", "untersucht"),
  v("verstehen", "verstehe verstehst versteht verstehen versteht verstehen", "verstanden", "h", void 0, "verstand"),
  v("verkaufen", "verkaufe verkaufst verkauft verkaufen verkauft verkaufen", "verkauft"),
  v("bezahlen", "bezahle bezahlst bezahlt bezahlen bezahlt bezahlen", "bezahlt"),
  v("erz\xE4hlen", "erz\xE4hle erz\xE4hlst erz\xE4hlt erz\xE4hlen erz\xE4hlt erz\xE4hlen", "erz\xE4hlt"),
  v("bekommen", "bekomme bekommst bekommt bekommen bekommt bekommen", "bekommen"),
  v("beginnen", "beginne beginnst beginnt beginnen beginnt beginnen", "begonnen"),
  v("verlieren", "verliere verlierst verliert verlieren verliert verlieren", "verloren"),
  v("vergessen", "vergesse vergisst vergisst vergessen vergesst vergessen", "vergessen"),
  v("besichtigen", "besichtige besichtigst besichtigt besichtigen besichtigt besichtigen", "besichtigt"),
  v("bestellen", "bestelle bestellst bestellt bestellen bestellt bestellen", "bestellt"),
  v("empfehlen", "empfehle empfiehlst empfiehlt empfehlen empfehlt empfehlen", "empfohlen"),
  /* ------------------------------------------------ отделяемые (trennbar) */
  v("abholen", "hole holst holt holen holt holen", "abgeholt", "h", "ab", "holte"),
  v("aufr\xE4umen", "r\xE4ume r\xE4umst r\xE4umt r\xE4umen r\xE4umt r\xE4umen", "aufger\xE4umt", "h", "auf", "r\xE4umte"),
  v("abwaschen", "wasche w\xE4schst w\xE4scht waschen wascht waschen", "abgewaschen", "h", "ab", "wusch"),
  v("anrufen", "rufe rufst ruft rufen ruft rufen", "angerufen", "h", "an", "rief"),
  v("einkaufen", "kaufe kaufst kauft kaufen kauft kaufen", "eingekauft", "h", "ein", "kaufte"),
  v("aufstehen", "stehe stehst steht stehen steht stehen", "aufgestanden", "s", "auf", "stand"),
  v("einschlafen", "schlafe schl\xE4fst schl\xE4ft schlafen schlaft schlafen", "eingeschlafen", "s", "ein", "schlief"),
  v("mitkommen", "komme kommst kommt kommen kommt kommen", "mitgekommen", "s", "mit", "kam"),
  v("aufmachen", "mache machst macht machen macht machen", "aufgemacht", "h", "auf", "machte"),
  v("zumachen", "mache machst macht machen macht machen", "zugemacht", "h", "zu", "machte"),
  v("fernsehen", "sehe siehst sieht sehen seht sehen", "ferngesehen", "h", "fern", "sah"),
  v("vorbereiten", "bereite bereitest bereitet bereiten bereitet bereiten", "vorbereitet", "h", "vor", "bereitete"),
  v("anfangen", "fange f\xE4ngst f\xE4ngt fangen fangt fangen", "angefangen", "h", "an", "fing"),
  v("aufh\xF6ren", "h\xF6re h\xF6rst h\xF6rt h\xF6ren h\xF6rt h\xF6ren", "aufgeh\xF6rt", "h", "auf", "h\xF6rte"),
  v("mitbringen", "bringe bringst bringt bringen bringt bringen", "mitgebracht", "h", "mit", "brachte"),
  v("einladen", "lade l\xE4dst l\xE4dt laden ladet laden", "eingeladen", "h", "ein", "lud"),
  v("aussehen", "sehe siehst sieht sehen seht sehen", "ausgesehen", "h", "aus", "sah"),
  v("anziehen", "ziehe ziehst zieht ziehen zieht ziehen", "angezogen", "h", "an", "zog"),
  v("aufschreiben", "schreibe schreibst schreibt schreiben schreibt schreiben", "aufgeschrieben", "h", "auf", "schrieb"),
  v("mitnehmen", "nehme nimmst nimmt nehmen nehmt nehmen", "mitgenommen", "h", "mit", "nahm"),
  v("zur\xFCckkommen", "komme kommst kommt kommen kommt kommen", "zur\xFCckgekommen", "s", "zur\xFCck", "kam"),
  v("stattfinden", "finde findest findet finden findet finden", "stattgefunden", "h", "statt", "fand"),
  v("teilnehmen", "nehme nimmst nimmt nehmen nehmt nehmen", "teilgenommen", "h", "teil", "nahm"),
  v("kennenlernen", "lerne lernst lernt lernen lernt lernen", "kennengelernt", "h", "kennen", "lernte"),
  v("aufpassen", "passe passt passt passen passt passen", "aufgepasst", "h", "auf", "passte"),
  v("aussteigen", "steige steigst steigt steigen steigt steigen", "ausgestiegen", "s", "aus", "stieg"),
  v("einsteigen", "steige steigst steigt steigen steigt steigen", "eingestiegen", "s", "ein", "stieg"),
  v("umziehen", "ziehe ziehst zieht ziehen zieht ziehen", "umgezogen", "s", "um", "zog"),
  v("ankommen", "komme kommst kommt kommen kommt kommen", "angekommen", "s", "an", "kam"),
  v("abfahren", "fahre f\xE4hrst f\xE4hrt fahren fahrt fahren", "abgefahren", "s", "ab", "fuhr"),
  v("zuh\xF6ren", "h\xF6re h\xF6rst h\xF6rt h\xF6ren h\xF6rt h\xF6ren", "zugeh\xF6rt", "h", "zu", "h\xF6rte"),
  /* ---------------------------------------------------- сильные глаголы -- */
  v("essen", "esse isst isst essen esst essen", "gegessen", "h", void 0, "a\xDF"),
  v("trinken", "trinke trinkst trinkt trinken trinkt trinken", "getrunken", "h", void 0, "trank"),
  v("gehen", "gehe gehst geht gehen geht gehen", "gegangen", "s", void 0, "ging"),
  v("kommen", "komme kommst kommt kommen kommt kommen", "gekommen", "s", void 0, "kam"),
  v("fahren", "fahre f\xE4hrst f\xE4hrt fahren fahrt fahren", "gefahren", "s", void 0, "fuhr"),
  v("fliegen", "fliege fliegst fliegt fliegen fliegt fliegen", "geflogen", "s", void 0, "flog"),
  v("sehen", "sehe siehst sieht sehen seht sehen", "gesehen", "h", void 0, "sah"),
  v("lesen", "lese liest liest lesen lest lesen", "gelesen", "h", void 0, "las"),
  v("schreiben", "schreibe schreibst schreibt schreiben schreibt schreiben", "geschrieben", "h", void 0, "schrieb"),
  v("sprechen", "spreche sprichst spricht sprechen sprecht sprechen", "gesprochen", "h", void 0, "sprach"),
  v("nehmen", "nehme nimmst nimmt nehmen nehmt nehmen", "genommen", "h", void 0, "nahm"),
  v("geben", "gebe gibst gibt geben gebt geben", "gegeben", "h", void 0, "gab"),
  v("helfen", "helfe hilfst hilft helfen helft helfen", "geholfen", "h", void 0, "half"),
  v("treffen", "treffe triffst trifft treffen trefft treffen", "getroffen", "h", void 0, "traf"),
  v("finden", "finde findest findet finden findet finden", "gefunden", "h", void 0, "fand"),
  v("bleiben", "bleibe bleibst bleibt bleiben bleibt bleiben", "geblieben", "s", void 0, "blieb"),
  v("schlafen", "schlafe schl\xE4fst schl\xE4ft schlafen schlaft schlafen", "geschlafen", "h", void 0, "schlief"),
  v("laufen", "laufe l\xE4ufst l\xE4uft laufen lauft laufen", "gelaufen", "s", void 0, "lief"),
  v("singen", "singe singst singt singen singt singen", "gesungen", "h", void 0, "sang"),
  v("bringen", "bringe bringst bringt bringen bringt bringen", "gebracht", "h", void 0, "brachte"),
  v("denken", "denke denkst denkt denken denkt denken", "gedacht", "h", void 0, "dachte"),
  v("wissen", "wei\xDF wei\xDFt wei\xDF wissen wisst wissen", "gewusst", "h", void 0, "wusste"),
  v("tun", "tue tust tut tun tut tun", "getan", "h", void 0, "tat"),
  v("werden", "werde wirst wird werden werdet werden", "geworden", "s", void 0, "wurde"),
  v("sein", "bin bist ist sind seid sind", "gewesen", "s", void 0, "war"),
  v("haben", "habe hast hat haben habt haben", "gehabt", "h", void 0, "hatte"),
  v("m\xF6gen", "mag magst mag m\xF6gen m\xF6gt m\xF6gen", "gemocht", "h", void 0, "mochte")
];
var verbByInf = Object.fromEntries(VERBS.map((x) => [x.inf, x]));
var prForms = (x) => x.pr.split(" ");
var HABEN = ["habe", "hast", "hat", "haben", "habt", "haben"];
var SEIN = ["bin", "bist", "ist", "sind", "seid", "sind"];
var hilfsverb = (x, person) => x.aux === "s" ? SEIN[person] : HABEN[person];
var HATTEN = ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"];
var WAREN = ["war", "warst", "war", "waren", "wart", "waren"];
var praetAux = (x, person) => x.aux === "s" ? WAREN[person] : HATTEN[person];

// src/lib/de/pools-extra.ts
var GEN_FRAMES_EXTRA = [
  {
    text: "Die Wohnung {0} ist im dritten Stock.",
    pool: [
      /* der Nachbar не берём: nomenForm даёт «des Nachbaren», а учебный
         стандарт — «des Nachbarn» (см. комментарий у пулов ниже) */
      "der Lehrer",
      "die Lehrerin",
      "der Kollege",
      "der Student",
      "der Sohn",
      "die Frau",
      "die Mutter",
      "der Vater",
      "die Schwester",
      "der Bruder"
    ]
  },
  {
    text: "Die Telefonnummer {0} habe ich sofort aufgeschrieben.",
    pool: [
      "der Lehrer",
      "die Lehrerin",
      "der Kollege",
      "der Sohn",
      "der Freund",
      "die Freundin",
      "die Schwester",
      "der Bruder",
      "die Mutter",
      "der Vater"
    ]
  },
  {
    text: "Die Mutter {0} arbeitet in der Schule.",
    pool: [
      "der Junge",
      "das Kind",
      "das M\xE4dchen",
      "der Student",
      "der Sohn",
      "der Kollege"
    ]
  },
  {
    text: "Der Hund {0} bellt laut.",
    /* der Nachbar исключён сознательно: слабое склонение даёт в Genitiv
       «des Nachbaren» (так его строит nomenForm из nouns.ts), а учебный
       стандарт — «des Nachbarn». Пока форма в nouns.ts не поправлена,
       новые кадры её не тиражируют. Остальные слабые слова (Junge,
       Student, Kollege, Kunde) с -(e)n дают правильную форму. */
    pool: [
      "der Sohn",
      "der Lehrer",
      "der Kollege",
      "der Vater",
      "die Mutter",
      "die Frau",
      "der Freund",
      "die Schwester"
    ]
  },
  {
    text: "Die T\xFCr {0} ist offen.",
    pool: [
      "das Zimmer",
      "das Haus",
      "die K\xFCche",
      "das B\xFCro",
      "die Schule",
      "das Kino",
      "das Theater",
      "die Wohnung",
      "das Krankenhaus",
      "die Bibliothek"
    ]
  },
  {
    text: "Der Beruf {0} interessiert mich.",
    pool: [
      "die Frau",
      "die Mutter",
      "der Vater",
      "der Lehrer",
      "die Lehrerin",
      "die Schwester",
      "der Bruder",
      "der Freund",
      "die Freundin",
      "der Kollege"
    ]
  }
];
var KONN_FRAMES_EXTRA = [
  {
    a: "Ich bin sehr m\xFCde,",
    b: " gehe ich fr\xFCh ins Bett.",
    answers: ["deshalb", "darum", "deswegen"],
    why: "\u041F\u043E\u0441\u043B\u0435 \u0434\u044B\u0440\u043A\u0438 \u0438\u043D\u0432\u0435\u0440\u0441\u0438\u044F (\xABgehe ich\xBB) \u2014 \u0437\u043D\u0430\u0447\u0438\u0442, \u043D\u0430\u0440\u0435\u0447\u0438\u0435: deshalb/darum/deswegen. \u0421\u043E\u044E\u0437\u044B (und, aber, denn) \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0441\u043B\u043E\u0432 \u043D\u0435 \u043C\u0435\u043D\u044F\u044E\u0442."
  },
  {
    a: "Der Laden hat schon geschlossen,",
    b: " kaufe ich im n\xE4chsten Dorf ein.",
    answers: ["deshalb", "darum", "deswegen"],
    why: "\u0421\u043B\u0435\u0434\u0441\u0442\u0432\u0438\u0435 + \u0438\u043D\u0432\u0435\u0440\u0441\u0438\u044F \u043F\u043E\u0441\u043B\u0435 \u0434\u044B\u0440\u043A\u0438 (\xABkaufe ich\xBB) \u2192 deshalb. \u041D\u0430\u0440\u0435\u0447\u0438\u0435 \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u043F\u043E\u0437\u0438\u0446\u0438\u044E 1, \u0433\u043B\u0430\u0433\u043E\u043B \u0432\u0441\u0442\u0430\u0451\u0442 \u043D\u0430 2-\u044E; einkaufen \u2014 \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430, \xABein\xBB \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446."
  },
  {
    a: "Ich bleibe heute zu Hause,",
    b: " ich bin erk\xE4ltet.",
    answers: ["denn"],
    why: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043F\u0440\u0438 \u0446\u0435\u043B\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u0441\u043B\u043E\u0432 \u2192 denn. deshalb \u043D\u0435\u043B\u044C\u0437\u044F: \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0433\u043E \u043D\u0443\u0436\u043D\u0430 \u0438\u043D\u0432\u0435\u0440\u0441\u0438\u044F (\xABdeshalb bin ich\u2026\xBB); \u0443 weil \u0433\u043B\u0430\u0433\u043E\u043B \u0443\u0435\u0445\u0430\u043B \u0431\u044B \u0432 \u043A\u043E\u043D\u0435\u0446."
  },
  {
    a: "Wir nehmen den Wagen,",
    b: " wir haben viele Koffer.",
    answers: ["denn"],
    why: "\u0412\u0442\u043E\u0440\u0430\u044F \u0447\u0430\u0441\u0442\u044C \u043E\u0431\u044A\u044F\u0441\u043D\u044F\u0435\u0442 \u041F\u0420\u0418\u0427\u0418\u041D\u0423 \u2192 denn. und \u0441\u043E\u0435\u0434\u0438\u043D\u044F\u043B \u0431\u044B \u0434\u0432\u0430 \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u044B\u0445 \u0444\u0430\u043A\u0442\u0430, aber \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u2014 \u0435\u0433\u043E \u0437\u0434\u0435\u0441\u044C \u043D\u0435\u0442."
  },
  {
    a: "Das Zimmer ist klein,",
    b: " es ist sehr teuer.",
    answers: ["aber"],
    why: "\u041F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u0435 (\xAB\u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435, \u0437\u0430\u0442\u043E \u043E\u0447\u0435\u043D\u044C \u0434\u043E\u0440\u043E\u0433\u043E\u0435\xBB) \u2192 aber. und \u043E\u0437\u043D\u0430\u0447\u0430\u043B \u0431\u044B \u043F\u0440\u043E\u0441\u0442\u043E\u0435 \u043F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u0435, aber \u0437\u0434\u0435\u0441\u044C \u0438\u043C\u0435\u043D\u043D\u043E \xAB\u043D\u043E\xBB."
  },
  {
    a: "Die Jacke gef\xE4llt mir,",
    b: " sie ist zu teuer.",
    answers: ["aber"],
    why: "\u0414\u0432\u0430 \u0444\u0430\u043A\u0442\u0430 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0440\u0435\u0447\u0430\u0442 \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0443 (\u043D\u0440\u0430\u0432\u0438\u0442\u0441\u044F / \u0434\u043E\u0440\u043E\u0433\u0430\u044F) \u2192 aber. und \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D: \xAB\u043D\u0440\u0430\u0432\u0438\u0442\u0441\u044F \u0418 \u0434\u043E\u0440\u043E\u0433\u0430\u044F\xBB \u043D\u0435 \u0437\u0432\u0443\u0447\u0438\u0442, denn \u0434\u0430\u043B \u0431\u044B \u043B\u043E\u0436\u043D\u0443\u044E \u043F\u0440\u0438\u0447\u0438\u043D\u0443."
  },
  {
    a: "Nimmst du den Bus,",
    b: " f\xE4hrst du mit dem Wagen?",
    answers: ["oder"],
    why: "\u0412\u044B\u0431\u043E\u0440 \u043C\u0435\u0436\u0434\u0443 \u0434\u0432\u0443\u043C\u044F \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430\u043C\u0438 (\u0432\u043E\u043F\u0440\u043E\u0441-\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u0430) \u2192 oder. \xAB\u043D\u0430 \u0430\u0432\u0442\u043E\u0431\u0443\u0441\u0435 \u0438\u043B\u0438 \u043D\u0430 \u043C\u0430\u0448\u0438\u043D\u0435?\xBB \u2014 \u0432\u044B\u0431\u0438\u0440\u0430\u044E\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u0434\u043D\u043E."
  },
  {
    a: "Am Vormittag habe ich geputzt,",
    b: " am Nachmittag habe ich gekocht.",
    answers: ["und"],
    why: "\u041F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u0435 \u0434\u0432\u0443\u0445 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u043F\u043E \u043E\u0447\u0435\u0440\u0435\u0434\u0438 \u2192 und. \u041D\u0430\u0440\u0435\u0447\u0438\u0435 (deshalb) \u0433\u0440\u0430\u043C\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E: \u043F\u043E\u0441\u043B\u0435 \xABam Nachmittag\xBB \u0433\u043B\u0430\u0433\u043E\u043B \u0432\u0441\u0442\u0430\u043B \u0431\u044B \u043D\u0430 3-\u0435 \u043C\u0435\u0441\u0442\u043E, \u0430 \u043D\u0435 \u043D\u0430 2-\u0435."
  },
  {
    a: "Wir fahren nicht nach Berlin,",
    b: " wir fahren nach Kiel.",
    answers: ["sondern"],
    why: "\u041F\u043E\u0441\u043B\u0435 \u043E\u0442\u0440\u0438\u0446\u0430\u043D\u0438\u044F \xABnicht\xBB, \u043A\u043E\u0433\u0434\u0430 \u0432\u0442\u043E\u0440\u0430\u044F \u0447\u0430\u0441\u0442\u044C \u0417\u0410\u041C\u0415\u041D\u042F\u0415\u0422 \u043F\u0435\u0440\u0432\u0443\u044E, \u0441\u0442\u043E\u0438\u0442 sondern: \xAB\u043D\u0435 \u0432 \u0411\u0435\u0440\u043B\u0438\u043D, \u0430 \u0432 \u041A\u0438\u043B\u044C\xBB. \u042D\u0442\u043E \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430 sondern \u0432 \u044F\u0437\u044B\u043A\u0435."
  }
];
var FRAGE_FRAMES_EXTRA = [
  {
    frage: "Wovon h\xE4ngt es ab?",
    text: "\u2014 {0}, ob der Chef den Termin verschiebt.",
    answer: "Davon",
    why: "abh\xE4ngen VON \u2192 wovon/davon. \u041F\u0440\u0435\u0434\u043B\u043E\u0433 \u0441 \u0441\u043E\u0433\u043B\u0430\u0441\u043D\u043E\u0439 \u2014 \u0431\u0435\u0437 -r: davon. \u041E\u0442\u0432\u0435\u0442 \u044D\u043B\u043B\u0438\u043F\u0442\u0438\u0447\u0435\u043D: (Das h\xE4ngt) davon ab, ob \u2026 \u2014 \u043E\u0431 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0439 \u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u0435 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u0442 ob, \u043D\u0435 dass."
  },
  {
    frage: "Wonach hast du gefragt?",
    text: "\u2014 {0}, ob der Zug schon da ist.",
    answer: "Danach",
    why: "fragen NACH \u2192 wonach/danach. \u041F\u0440\u0435\u0434\u043B\u043E\u0433 \u0441 \u0441\u043E\u0433\u043B\u0430\u0441\u043D\u043E\u0439 \u2014 \u0431\u0435\u0437 -r: danach. \u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u0430 \u2014 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043D\u043E\u0435 (\u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043F\u043E\u0435\u0437\u0434\u0430), \u043F\u043E\u044D\u0442\u043E\u043C\u0443 pronominal adverb \u0447\u0435\u0441\u0442\u0435\u043D."
  },
  {
    frage: "Worauf kannst du dich verlassen?",
    text: "\u2014 {0}, dass meine Familie immer f\xFCr mich da ist.",
    answer: "Darauf",
    why: "sich verlassen AUF \u2192 worauf/darauf. \u041F\u0440\u0435\u0434\u043B\u043E\u0433 \u0441 \u0433\u043B\u0430\u0441\u043D\u043E\u0439 \u2192 -r: darauf. \u0424\u0430\u043A\u0442 (\u0441\u0435\u043C\u044C\u044F \u043F\u043E\u043C\u043E\u0433\u0430\u0435\u0442) \u2014 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043D\u044B\u0439, \u0437\u0430\u043C\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430."
  },
  {
    frage: "Wor\xFCber hast du dich gefreut?",
    text: "\u2014 {0}, dass das Hotelzimmer gr\xF6\xDFer ist als auf dem Foto.",
    answer: "Dar\xFCber",
    why: "sich freuen \xDCBER \u2014 \u0440\u0430\u0434\u043E\u0441\u0442\u044C \u0443\u0436\u0435 \u0441\u043B\u0443\u0447\u0438\u0432\u0448\u0435\u043C\u0443\u0441\u044F (\u043A\u043E\u043C\u043D\u0430\u0442\u0430 \u0443\u0432\u0438\u0434\u0435\u043D\u0430) \u2192 dar\xFCber. \u041F\u0440\u0435\u0434\u043B\u043E\u0433 \u0441 \u0433\u043B\u0430\u0441\u043D\u043E\u0439 \u2192 -r."
  },
  {
    frage: "Woran hast du dich gew\xF6hnt?",
    text: "\u2014 {0}, dass es hier jeden Tag regnet.",
    answer: "Daran",
    why: "sich gew\xF6hnen AN \u2192 woran/daran. \u041F\u0440\u0435\u0434\u043B\u043E\u0433 \u0441 \u0433\u043B\u0430\u0441\u043D\u043E\u0439 \u2192 -r: daran. \u041F\u0440\u0438\u0432\u044B\u043A\u0430\u043D\u0438\u0435 \u043A \u0444\u0430\u043A\u0442\u0443, \u043D\u0435 \u043A \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0443 \u2014 \u0438\u043D\u0430\u0447\u0435 \u0431\u044B\u043B\u043E \u0431\u044B \xABAn wen?\xBB."
  },
  {
    frage: "Worum handelt es sich in dem Brief?",
    text: "\u2014 {0}, dass ein Formular falsch ausgef\xFCllt wurde.",
    answer: "Darum",
    why: "es handelt sich UM \u2192 worum/darum. \u041F\u0440\u0435\u0434\u043B\u043E\u0433 \u0441 \u0433\u043B\u0430\u0441\u043D\u043E\u0439 \u2192 -r: darum. \u0420\u0435\u0447\u044C \u043E \u0444\u0430\u043A\u0442\u0435 (\u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u0430\u044F \u0444\u043E\u0440\u043C\u0430) \u2014 \u043F\u0440\u0435\u0434\u043C\u0435\u0442, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 pronominal adverb \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D."
  }
];
var OB_TRANS_EXTRA = [
  { q: "Bleibt er heute zu Hause?", stem: "Sie fragt, \u2026", answer: "ob er heute zu Hause bleibt" },
  { q: "Hat der Bus Versp\xE4tung?", stem: "Wir wollen wissen, \u2026", answer: "ob der Bus Versp\xE4tung hat" },
  { q: "Arbeitet sie am Samstag?", stem: "Ich wei\xDF nicht, \u2026", answer: "ob sie am Samstag arbeitet" },
  { q: "F\xE4hrt der Zug nach Kiel?", stem: "Er fragt, \u2026", answer: "ob der Zug nach Kiel f\xE4hrt" },
  { q: "Darf der Junge alleine bleiben?", stem: "Wir wissen nicht, \u2026", answer: "ob der Junge alleine bleiben darf" },
  { q: "Kommt der Chef morgen zur\xFCck?", stem: "Sie fragt, \u2026", answer: "ob der Chef morgen zur\xFCckkommt" },
  { q: "Wird das Wetter morgen besser?", stem: "Ich wei\xDF nicht, \u2026", answer: "ob das Wetter morgen besser wird" }
];
var KONJ2V_TRANS_EXTRA = [
  {
    a: "Ich bin gestern zu Hause geblieben. Deshalb habe ich den Film im Kino nicht gesehen.",
    answers: [
      "Wenn ich nicht zu Hause geblieben w\xE4re, h\xE4tte ich den Film im Kino gesehen.",
      "Ich h\xE4tte den Film im Kino gesehen, wenn ich nicht zu Hause geblieben w\xE4re."
    ],
    why: "bleiben \u2014 sein-\u0433\u043B\u0430\u0433\u043E\u043B: geblieben w\xE4re; sehen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B: h\xE4tte gesehen. \xABnicht\xBB \u0443\u0445\u043E\u0434\u0438\u0442 \u0438\u0437 \u043E\u0431\u0435\u0438\u0445 \u0447\u0430\u0441\u0442\u0435\u0439: \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u2014 \xAB\u043E\u0441\u0442\u0430\u043B\u0441\u044F \u0438 \u043D\u0435 \u0441\u043C\u043E\u0442\u0440\u0435\u043B\xBB, \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u2014 \xAB\u0435\u0441\u043B\u0438 \u0431\u044B \u041D\u0415 \u043E\u0441\u0442\u0430\u043B\u0441\u044F, \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u043B \u0411\u042B\xBB."
  },
  {
    a: "Wir haben die Karte nicht gekauft. Deshalb haben wir das Konzert nicht gesehen.",
    answers: [
      "Wenn wir die Karte gekauft h\xE4tten, h\xE4tten wir das Konzert gesehen.",
      "Wir h\xE4tten das Konzert gesehen, wenn wir die Karte gekauft h\xE4tten."
    ],
    why: "kaufen \u0438 sehen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B\u044B: gekauft h\xE4tten, h\xE4tten gesehen. \u041E\u0431\u0430 \xABnicht\xBB \u0443\u0445\u043E\u0434\u044F\u0442: \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u0430\u044F \u0446\u0435\u043F\u043E\u0447\u043A\u0430 \u2014 \xAB\u0435\u0441\u043B\u0438 \u0431\u044B \u043A\u0443\u043F\u0438\u043B\u0438, \u0442\u043E \u0443\u0432\u0438\u0434\u0435\u043B\u0438 \u0431\u044B\xBB."
  },
  {
    a: "Der Zug hat Versp\xE4tung gehabt. Deshalb sind wir zu sp\xE4t angekommen.",
    answers: [
      "Wenn der Zug keine Versp\xE4tung gehabt h\xE4tte, w\xE4ren wir p\xFCnktlich angekommen.",
      "Wir w\xE4ren p\xFCnktlich angekommen, wenn der Zug keine Versp\xE4tung gehabt h\xE4tte."
    ],
    why: "haben \u2192 gehabt h\xE4tte, ankommen \u2014 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435, sein-\u0433\u043B\u0430\u0433\u043E\u043B \u2192 w\xE4ren angekommen. \u041E\u0442\u0440\u0438\u0446\u0430\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u0435\u0437\u0436\u0430\u0435\u0442: \xABkeine Versp\xE4tung\xBB, \xABp\xFCnktlich\xBB."
  },
  {
    a: "Du hast mich nicht angerufen. Deshalb bin ich nicht mitgekommen.",
    answers: [
      "Wenn du mich angerufen h\xE4ttest, w\xE4re ich mitgekommen.",
      "Ich w\xE4re mitgekommen, wenn du mich angerufen h\xE4ttest."
    ],
    why: "du \u2192 h\xE4ttest, ich \u2192 w\xE4re. anrufen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B (angerufen h\xE4ttest), mitkommen \u2014 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435, sein-\u0433\u043B\u0430\u0433\u043E\u043B (w\xE4re mitgekommen)."
  },
  {
    a: "Wir haben nicht genug Zeit gehabt. Deshalb haben wir das Museum nicht besucht.",
    answers: [
      "Wenn wir mehr Zeit gehabt h\xE4tten, h\xE4tten wir das Museum besucht.",
      "Wir h\xE4tten das Museum besucht, wenn wir mehr Zeit gehabt h\xE4tten."
    ],
    why: "haben \u0438 besuchen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B\u044B: gehabt h\xE4tten, h\xE4tten besucht. \xABnicht genug Zeit\xBB \u2192 \xABmehr Zeit\xBB: \u0432 \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u043E\u043C \u043C\u0438\u0440\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0431\u044B\u043B\u043E \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E."
  },
  {
    a: "Die Jacke war zu teuer. Deshalb habe ich sie nicht gekauft.",
    answers: [
      "Wenn die Jacke billiger gewesen w\xE4re, h\xE4tte ich sie gekauft.",
      "Ich h\xE4tte sie gekauft, wenn die Jacke billiger gewesen w\xE4re."
    ],
    why: "sein \u2192 gewesen w\xE4re (\u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435), kaufen \u2192 h\xE4tte gekauft. \xABzu teuer\xBB \u2192 \xABbilliger\xBB: \u0432 \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u043E\u043C \u043C\u0438\u0440\u0435 \u0446\u0435\u043D\u0430 \u0434\u0440\u0443\u0433\u0430\u044F, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 Komparativ."
  }
];
var ES_HOLE_EXTRA = [
  {
    text: "Im Brief stand: {0} besteht die M\xF6glichkeit, dass der Kurs schon im Mai beginnt.",
    a: "Es",
    why: "es besteht die M\xF6glichkeit, dass \u2026 \u2014 \xAB\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C, \u0447\u0442\u043E \u2026\xBB. \u041F\u043E\u0441\u043B\u0435 \u0434\u0432\u043E\u0435\u0442\u043E\u0447\u0438\u044F es \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 1, \u0441\u0440\u0430\u0437\u0443 \u0437\u0430 \u043D\u0438\u043C \u0433\u043B\u0430\u0433\u043E\u043B besteht."
  },
  {
    text: "Der Direktor hat den Eltern versichert: {0} geht um die Sicherheit der Kinder.",
    a: "Es",
    why: "es geht um + Akkusativ \u2014 \xAB\u0440\u0435\u0447\u044C \u0438\u0434\u0451\u0442 \u043E\xBB. \u0411\u0435\u0437 es \u0444\u0440\u0430\u0437\u0430 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430: geht \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0431\u0435\u0437\u043B\u0438\u0447\u043D\u043E\u0433\u043E \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0433\u043E."
  },
  {
    text: "Der Chef hat die Sitzung er\xF6ffnet: {0} gibt es heute drei Punkte auf der Agenda.",
    a: "Es",
    why: "es gibt + Akkusativ \u2014 \xAB\u0435\u0441\u0442\u044C, \u0438\u043C\u0435\u0435\u0442\u0441\u044F\xBB. \u0417\u0434\u0435\u0441\u044C es \u2014 \u0444\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435, gibt \u0441\u0440\u0430\u0437\u0443 \u0437\u0430 \u043D\u0438\u043C; \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u0435 \u0441 \xABdrei Punkte\xBB \u043D\u0435 \u043D\u0443\u0436\u043D\u043E, es \u043D\u0435\u0438\u0437\u043C\u0435\u043D\u043D\u043E."
  },
  {
    text: "Im Jahresbericht las man: {0} h\xE4ngt alles davon ab, ob der Bau im Mai fertig wird.",
    a: "Es",
    why: "es h\xE4ngt (alles) davon ab, ob \u2026 \u2014 \xAB\u0432\u0441\u0451 \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0442\u043E\u0433\u043E, \u2026\xBB. es \u2014 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435, \u0430 daneben \u0441\u0442\u043E\u0438\u0442 \u043A\u043E\u0440\u0440\u0435\u043B\u044F\u0442 davon (abh\xE4ngen VON); ob \u2014 \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0439 \u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u044B."
  },
  {
    text: "Sie hat uns geschrieben: {0} freut uns sehr, dass ihr auch kommen k\xF6nnt.",
    a: "Es",
    why: "es freut uns, dass \u2026 \u2014 \xAB\u043D\u0430\u0441 \u0440\u0430\u0434\u0443\u0435\u0442 \u0442\u043E, \u0447\u0442\u043E \u2026\xBB. es \u2014 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435, uns \u2014 Akkusativ, dass-\u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u0440\u0430\u0441\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u0440\u0430\u0434\u043E\u0441\u0442\u0438."
  }
];

// src/lib/de/b2verb.ts
var PASSIV_MODAL_GAPS = [
  { text: "Die Wohnung {0} am Freitag gr\xFCndlich {1} {2}.", v: "putzen", modal: "m\xFCssen", plural: false },
  { text: "Die E-Mails {0} erst morgen {1} {2}.", v: "schreiben", modal: "k\xF6nnen", plural: true },
  { text: "Die Rechnung {0} online {1} {2}.", v: "bezahlen", modal: "k\xF6nnen", plural: false },
  { text: "Die G\xE4ste {0} rechtzeitig {1} {2}.", v: "einladen", modal: "sollen", plural: true },
  { text: "Der Termin {0} nicht {1} {2}.", v: "vergessen", modal: "d\xFCrfen", plural: false },
  { text: "Die Hausaufgaben {0} bis morgen {1} {2}.", v: "machen", modal: "m\xFCssen", plural: true },
  { text: "Die Arbeit {0} bis Freitag {1} {2}.", v: "beenden", modal: "m\xFCssen", plural: false },
  { text: "Die Patienten {0} gr\xFCndlich {1} {2}.", v: "untersuchen", modal: "m\xFCssen", plural: true },
  { text: "Das Zimmer {0} noch heute {1} {2}.", v: "aufr\xE4umen", modal: "m\xFCssen", plural: false },
  { text: "Der Roman {0} an einem Abend {1} {2}.", v: "lesen", modal: "k\xF6nnen", plural: false },
  { text: "Die Getr\xE4nke {0} f\xFCr das Fest {1} {2}.", v: "mitbringen", modal: "sollen", plural: true },
  { text: "Das Museum {0} nur mit F\xFChrung {1} {2}.", v: "besichtigen", modal: "d\xFCrfen", plural: false }
];
var PASSIV_MODAL_TRANS = [
  {
    aktiv: "Man muss das Auto reparieren.",
    answers: ["Das Auto muss repariert werden."],
    plural: false,
    why: "Auto \u2014 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u2192 muss. \u041F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435 repariert, \xABwerden\xBB \u0432 \u0441\u0430\u043C\u043E\u043C \u043A\u043E\u043D\u0446\u0435."
  },
  {
    aktiv: "Man kann die Rechnung online bezahlen.",
    answers: ["Die Rechnung kann online bezahlt werden."],
    plural: false,
    why: "Rechnung \u2014 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u2192 kann. bezahlen \u2192 bezahlt (\u0441\u043B\u0430\u0431\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B)."
  },
  {
    aktiv: "Man darf das Museum sonntags besichtigen.",
    answers: ["Das Museum darf sonntags besichtigt werden."],
    plural: false,
    why: "Museum \u2014 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u2192 darf. besichtigen \u2014 \u043D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430, \u0431\u0435\u0437 ge-: besichtigt."
  },
  {
    aktiv: "Man soll die G\xE4ste um acht einladen.",
    answers: ["Die G\xE4ste sollen um acht eingeladen werden."],
    plural: true,
    why: "\u0413\u043E\u0441\u0442\u0438 \u2014 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u2192 sollen (\u043D\u0435 \xABsoll\xBB!). einladen \u2192 eingeladen, ge- \u0432\u043D\u0443\u0442\u0440\u0438: \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 ein-."
  },
  {
    aktiv: "Man muss die Hausaufgaben bis Freitag machen.",
    answers: ["Die Hausaufgaben m\xFCssen bis Freitag gemacht werden."],
    plural: true,
    why: "Hausaufgaben \u2014 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u2192 m\xFCssen. \u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u043F\u043E\u0434\u0432\u043E\u0445 \u0442\u0440\u0430\u043D\u0441\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438: \u0431\u044B\u043B\u043E \xABman muss\xBB, \u0441\u0442\u0430\u043B\u043E \xABm\xFCssen\xBB."
  },
  {
    aktiv: "Man kann die Getr\xE4nke selbst mitbringen.",
    answers: ["Die Getr\xE4nke k\xF6nnen selbst mitgebracht werden."],
    plural: true,
    why: "Getr\xE4nke \u2014 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u2192 k\xF6nnen. mitbringen \u2192 mitgebracht: \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 mit- \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F."
  },
  {
    aktiv: "Man konnte den Schl\xFCssel nicht finden.",
    answers: ["Der Schl\xFCssel konnte nicht gefunden werden."],
    plural: false,
    why: "\u041F\u0440\u043E\u0448\u0435\u0434\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0433\u043E (konnte) \u043F\u0435\u0440\u0435\u0435\u0437\u0436\u0430\u0435\u0442 \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439. finden \u2014 \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B: gefunden."
  },
  {
    aktiv: "Man musste die Wohnung schnell putzen.",
    answers: ["Die Wohnung musste schnell geputzt werden."],
    plural: false,
    why: "musste \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F musste. putzen \u2192 geputzt."
  }
];
var KONJ2V_GAPS = [
  {
    text: "Wenn ich das {0} {1}, {2} ich gekommen.",
    gaps: [["gewusst"], ["h\xE4tte"], ["w\xE4re"]],
    hint: "(wissen / kommen)",
    why: "wissen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B: gewusst h\xE4tte. kommen \u2014 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435, sein-\u0433\u043B\u0430\u0433\u043E\u043B: w\xE4re gekommen. \u041D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u044B \u043E\u0431\u0435 \u0447\u0430\u0441\u0442\u0438, \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0443\u0441\u043B\u043E\u0432\u0438\u0435."
  },
  {
    text: "Wenn du mich {0} {1}, {2} ich dir {3}.",
    gaps: [["angerufen"], ["h\xE4ttest"], ["h\xE4tte"], ["geholfen"]],
    hint: "(anrufen / helfen)",
    why: "du \u2192 h\xE4ttest, ich \u2192 h\xE4tte. \u041E\u0431\u0430 \u0433\u043B\u0430\u0433\u043E\u043B\u0430 haben-\u0433\u043B\u0430\u0433\u043E\u043B\u044B: angerufen h\xE4ttest, geholfen h\xE4tte."
  },
  {
    text: "Wenn wir mehr Geld {0} {1}, {2} wir ein gr\xF6\xDFeres Auto {3}.",
    gaps: [["gehabt"], ["h\xE4tten"], ["h\xE4tten"], ["gekauft"]],
    hint: "(haben / kaufen)",
    why: "haben \u2192 h\xE4tten gehabt, kaufen \u2192 h\xE4tten gekauft. wir \u2192 h\xE4tten. \u0423\u0441\u043B\u043E\u0432\u0438\u0435 \u0438 \u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0438\u0435 \u043E\u0431\u0430 \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0435."
  },
  {
    text: "Wenn es gestern nicht so kalt {0} {1}, {2} wir l\xE4nger spazieren {3}.",
    gaps: [["gewesen"], ["w\xE4re"], ["w\xE4ren"], ["gegangen"]],
    hint: "(sein / gehen)",
    why: "sein \u2192 gewesen w\xE4re, gehen \u2014 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u2192 w\xE4ren gegangen. \u041F\u0440\u043E \u0432\u0447\u0435\u0440\u0430 \u2014 \u0437\u043D\u0430\u0447\u0438\u0442 \u043E\u0431\u0435 \u0447\u0430\u0441\u0442\u0438 \u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C (Partizip II \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D)."
  },
  {
    text: "An deiner Stelle {0} ich zu Hause {1}.",
    gaps: [["w\xE4re"], ["geblieben"]],
    hint: "(bleiben)",
    why: "\xABAn deiner Stelle\xBB = \u0435\u0441\u043B\u0438 \u0431\u044B \u044F \u0431\u044B\u043B \u043D\u0430 \u0442\u0432\u043E\u0451\u043C \u043C\u0435\u0441\u0442\u0435 \u2014 \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u0435 \u0431\u0435\u0437 wenn. bleiben \u2014 sein-\u0433\u043B\u0430\u0433\u043E\u043B: w\xE4re geblieben."
  },
  {
    text: "Ohne deine Hilfe {0} ich das Fahrrad nicht {1}.",
    gaps: [["h\xE4tte"], ["repariert"]],
    hint: "(reparieren)",
    why: "\xABOhne \u2026\xBB \u2014 \u0443\u0441\u043B\u043E\u0432\u0438\u0435 \u0432 \u0441\u0432\u0451\u0440\u043D\u0443\u0442\u043E\u043C \u0432\u0438\u0434\u0435; \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u043E \u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C \u2192 h\xE4tte + Partizip II. reparieren \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B."
  },
  {
    text: "Sie {0} gern mitgekommen, aber sie {1} krank.",
    gaps: [["w\xE4re"], ["war", "ist"]],
    hint: "(sein)",
    why: "\xABw\xE4re gern \u2026 mitgekommen\xBB \u2014 \u043D\u0435\u0441\u0431\u044B\u0432\u0448\u0435\u0435\u0441\u044F \u0436\u0435\u043B\u0430\u043D\u0438\u0435 \u043E \u043F\u0440\u043E\u0448\u043B\u043E\u043C (mitkommen \u2192 sein-\u0433\u043B\u0430\u0433\u043E\u043B: w\xE4re). \u0420\u0435\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u0438\u043D\u0434\u0438\u043A\u0430\u0442\u0438\u0432\u0435: sie war krank (\u0438\u043B\u0438 ist krank, \u0435\u0441\u043B\u0438 \u043E\u043D\u0430 \u0432\u0441\u0451 \u0435\u0449\u0451 \u0431\u043E\u043B\u044C\u043D\u0430)."
  },
  {
    text: "Wenn ihr fr\xFCher {0} {1}, {2} ihr den Bus noch {3}.",
    gaps: [["aufgestanden"], ["w\xE4rt"], ["h\xE4ttet"], ["bekommen"]],
    hint: "(aufstehen / bekommen)",
    why: "ihr-\u0444\u043E\u0440\u043C\u044B: aufstehen \u2014 sein-\u0433\u043B\u0430\u0433\u043E\u043B \u2192 w\xE4rt aufgestanden; bekommen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B \u2192 h\xE4ttet bekommen."
  }
];
var KONJ2V_TRANS = [
  {
    a: "Ich habe nicht genug Geld gehabt. Deshalb habe ich die Jacke nicht gekauft.",
    answers: [
      "Wenn ich genug Geld gehabt h\xE4tte, h\xE4tte ich die Jacke gekauft.",
      "Ich h\xE4tte die Jacke gekauft, wenn ich genug Geld gehabt h\xE4tte."
    ],
    why: "haben \u2192 h\xE4tte gehabt, kaufen \u2192 h\xE4tte gekauft. \xABnicht\xBB \u0443\u0445\u043E\u0434\u0438\u0442: \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0431\u044B\u043B\u0430 \xAB\u0434\u0435\u043D\u0435\u0433 \u043D\u0435 \u0431\u044B\u043B\u043E\xBB, \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u2014 \xAB\u0435\u0441\u043B\u0438 \u0431\u044B \u0411\u042B\u041B\u0418\xBB."
  },
  {
    a: "Der Vater hat das Auto nicht repariert. Deshalb sind wir nicht nach Kiel gefahren.",
    answers: [
      "Wenn der Vater das Auto repariert h\xE4tte, w\xE4ren wir nach Kiel gefahren.",
      "Wir w\xE4ren nach Kiel gefahren, wenn der Vater das Auto repariert h\xE4tte."
    ],
    why: "reparieren \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B: repariert h\xE4tte. fahren \u2014 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435: w\xE4ren gefahren. \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043F\u043E\u0441\u043B\u0435 wenn-\u0447\u0430\u0441\u0442\u0438\u0446\u044B \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u0441 \u0433\u043B\u0430\u0433\u043E\u043B\u0430."
  },
  {
    a: "Das Wetter war nicht sch\xF6n. Deshalb sind wir nicht schwimmen gegangen.",
    answers: [
      "Wenn das Wetter sch\xF6n gewesen w\xE4re, w\xE4ren wir schwimmen gegangen.",
      "Wir w\xE4ren schwimmen gegangen, wenn das Wetter sch\xF6n gewesen w\xE4re."
    ],
    why: "sein \u2192 gewesen w\xE4re, gehen \u2192 w\xE4ren gegangen. \u041E\u0431\u0430 sein-\u0433\u043B\u0430\u0433\u043E\u043B\u0430, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435."
  },
  {
    a: "Er hat die Wahrheit nicht gesagt. Deshalb hat man ihm nicht geholfen.",
    answers: [
      "Wenn er die Wahrheit gesagt h\xE4tte, h\xE4tte man ihm geholfen.",
      "Man h\xE4tte ihm geholfen, wenn er die Wahrheit gesagt h\xE4tte."
    ],
    why: "sagen \u2192 gesagt h\xE4tte, helfen \u2192 h\xE4tte geholfen. \xABman\xBB \u0432 KII \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F: man h\xE4tte \u2026 geholfen."
  },
  {
    a: "Du hast mir nicht geholfen. Deshalb habe ich alles allein gemacht.",
    answers: [
      "Wenn du mir geholfen h\xE4ttest, h\xE4tte ich nicht alles allein gemacht.",
      "Ich h\xE4tte nicht alles allein gemacht, wenn du mir geholfen h\xE4ttest."
    ],
    why: "du \u2192 h\xE4ttest, ich \u2192 h\xE4tte. helfen \u0438 machen \u2014 haben-\u0433\u043B\u0430\u0433\u043E\u043B\u044B."
  },
  {
    a: "Wir haben die Hausaufgaben nicht gemacht. Deshalb haben wir Probleme bekommen.",
    answers: [
      "Wenn wir die Hausaufgaben gemacht h\xE4tten, h\xE4tten wir keine Probleme bekommen.",
      "Wir h\xE4tten keine Probleme bekommen, wenn wir die Hausaufgaben gemacht h\xE4tten."
    ],
    why: "machen \u2192 gemacht h\xE4tten, bekommen \u2192 h\xE4tten bekommen. \u041E\u0442\u0440\u0438\u0446\u0430\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u0435\u0437\u0436\u0430\u0435\u0442: \xABkeine Probleme\xBB."
  }
];
var KONJ1_TRANS = [
  {
    rep: "Er sagte",
    q: "Ich komme morgen.",
    answers: ["Er sagte, er komme morgen.", "Er sagte, dass er morgen komme."],
    note: "kommen \u2192 KI er komme. \u0424\u043E\u0440\u043C\u0430 = \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 \u0431\u0435\u0437 -en + -e."
  },
  {
    rep: "Er sagte",
    q: "Ich bin krank.",
    answers: ["Er sagte, er sei krank.", "Er sagte, dass er krank sei."],
    note: "sein \u0432 KI \u2014 er sei. \u0421\u0430\u043C\u0430\u044F \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u0444\u043E\u0440\u043C\u0430 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u043E\u0439 \u0440\u0435\u0447\u0438, \u043D\u0435 \xABist\xBB \u0438 \u043D\u0435 \xABw\xE4re\xBB."
  },
  {
    rep: "Er sagte",
    q: "Ich habe keine Zeit.",
    answers: ["Er sagte, er habe keine Zeit.", "Er sagte, dass er keine Zeit habe."],
    note: "haben \u0432 KI \u2014 er habe, \u043D\u0435 \xABhat\xBB."
  },
  {
    rep: "Er sagte",
    q: "Ich kann nicht kommen.",
    answers: ["Er sagte, er k\xF6nne nicht kommen.", "Er sagte, dass er nicht kommen k\xF6nne."],
    note: "\u043C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0439 \u0432 KI: k\xF6nnen \u2192 er k\xF6nne. \u0418\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u043A\u043E\u043D\u0446\u0435 (\u0432 dass-\u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u2014 \u0437\u0430 k\xF6nne)."
  },
  {
    rep: "Er sagte",
    q: "Ich muss arbeiten.",
    answers: ["Er sagte, er m\xFCsse arbeiten.", "Er sagte, dass er arbeiten m\xFCsse."],
    note: "m\xFCssen \u2192 er m\xFCsse."
  },
  {
    rep: "Er sagte",
    q: "Ich werde morgen anrufen.",
    answers: ["Er sagte, er werde morgen anrufen.", "Er sagte, er rufe morgen an."],
    note: "werden \u2192 er werde + Infinitiv. \u0422\u043E\u0442 \u0436\u0435 \u0441\u043C\u044B\u0441\u043B \u043F\u0435\u0440\u0435\u0434\u0430\u0451\u0442 \u0438 KI Pr\xE4sens: er rufe morgen an \u2014 \u043E\u0431\u0430 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430 \u0432\u0435\u0440\u043D\u044B."
  },
  {
    rep: "Er sagte",
    q: "Ich habe das Auto verkauft.",
    answers: ["Er sagte, er habe das Auto verkauft.", "Er sagte, dass er das Auto verkauft habe."],
    note: "KI Perfekt \u0441 haben: er habe + verkauft."
  },
  {
    rep: "Er sagte",
    q: "Ich bin nach Berlin gefahren.",
    answers: ["Er sagte, er sei nach Berlin gefahren.", "Er sagte, dass er nach Berlin gefahren sei."],
    note: "KI Perfekt \u0441 sein: \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u2192 er sei gefahren, \u043D\u0435 \xABh\xE4tte gefahren\xBB."
  },
  {
    rep: "Er sagte",
    q: "Ich wei\xDF die Antwort.",
    answers: ["Er sagte, er wisse die Antwort.", "Er sagte, dass er die Antwort wisse."],
    note: "wissen \u2014 \u043D\u0435\u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0439: er wisse (\u043D\u0435 \xABwei\xDFe\xBB, \u043D\u0435 \xABw\xFCsste\xBB \u2014 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0443\u0436\u0435 KII)."
  },
  {
    rep: "Sie sagten",
    q: "Wir haben schon gegessen.",
    answers: ["Sie sagten, sie h\xE4tten schon gegessen.", "Sie sagten, dass sie schon gegessen h\xE4tten."],
    note: "\u0412\u043E \u043C\u043D.\u0447. KI (sie haben) \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 \u0438\u043D\u0434\u0438\u043A\u0430\u0442\u0438\u0432\u043E\u043C, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 KII: sie h\xE4tten. \u0422\u0430\u043A \u0434\u0435\u043B\u0430\u044E\u0442 \u0438 \u0432 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u043D\u043E\u0439 \u0440\u0435\u0447\u0438."
  },
  {
    rep: "Sie sagten",
    q: "Wir sind zu Hause geblieben.",
    answers: ["Sie sagten, sie w\xE4ren zu Hause geblieben.", "Sie sagten, dass sie zu Hause geblieben w\xE4ren."],
    note: "KI \xABsie sind\xBB = \u0438\u043D\u0434\u0438\u043A\u0430\u0442\u0438\u0432 \u2192 KII: sie w\xE4ren. bleiben \u2014 sein-\u0433\u043B\u0430\u0433\u043E\u043B."
  },
  {
    rep: "Sie sagten",
    q: "Wir kommen morgen.",
    answers: ["Sie sagten, sie k\xE4men morgen.", "Sie sagten, dass sie morgen k\xE4men."],
    note: "KI \xABsie kommen\xBB = \u0438\u043D\u0434\u0438\u043A\u0430\u0442\u0438\u0432 \u2192 KII: sie k\xE4men."
  },
  {
    rep: "Sie sagten",
    q: "Wir werden sp\xE4ter kommen.",
    answers: ["Sie sagten, sie w\xFCrden sp\xE4ter kommen.", "Sie sagten, dass sie sp\xE4ter kommen w\xFCrden."],
    note: "werden \u0432\u043E \u043C\u043D.\u0447. \u2192 KII: sie w\xFCrden."
  }
];
var KONJ1_GAPS = [
  {
    text: "Der Arzt sagte, der Patient {0} jeden Tag Tabletten.",
    gaps: [["nehme"]],
    hint: "(nehmen)",
    why: "KI Pr\xE4sens: nehmen \u2192 er nehme. \u0412 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u043E\u0439 \u0440\u0435\u0447\u0438 KI \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D, \u0434\u0430\u0436\u0435 \u0435\u0441\u043B\u0438 \u0444\u043E\u0440\u043C\u0430 \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442 \u043D\u0435\u043F\u0440\u0438\u0432\u044B\u0447\u043D\u043E."
  },
  {
    text: "Sie sagte, sie {0} am Wochenende nach Kiel {1}.",
    gaps: [["sei"], ["gefahren"]],
    hint: "(fahren)",
    why: "KI Perfekt \u0441 sein: er/sie sei + gefahren. fahren \u2014 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435, \u0432\u0441\u043F\u043E\u043C\u043E\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 sei, \u043D\u0435 \xABhabe\xBB."
  },
  {
    text: "Er sagte, er {0} den Film schon {1}.",
    gaps: [["habe"], ["gesehen"]],
    hint: "(sehen)",
    why: "KI Perfekt \u0441 haben: er habe + gesehen. sehen \u2014 \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B: gesehen."
  },
  {
    text: "Der Lehrer sagte, die Sch\xFCler {0} heute sehr flei\xDFig.",
    gaps: [["seien"]],
    hint: "(sein)",
    why: "\u041C\u043D. \u0447\u0438\u0441\u043B\u043E: KI sein \u2192 sie seien. \u0424\u043E\u0440\u043C\u0430 \u043E\u0434\u043D\u043E\u0437\u043D\u0430\u0447\u043D\u0430, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0435\u0451 \u043C\u043E\u0436\u043D\u043E \u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0432 KI."
  },
  {
    text: "Er sagte, er {0} jeden Morgen um sechs {1}.",
    gaps: [["stehe"], ["auf"]],
    hint: "(aufstehen)",
    why: "KI \u043E\u0442 \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u043E\u0433\u043E \u0433\u043B\u0430\u0433\u043E\u043B\u0430: er stehe \u2026 auf. \u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446, \u043A\u0430\u043A \u0432 \u043E\u0431\u044B\u0447\u043D\u043E\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0438."
  },
  {
    text: "Sie sagte, sie {0} den Bericht sp\xE4ter {1}.",
    gaps: [["werde"], ["schreiben"]],
    hint: "(werden / schreiben)",
    why: "KI Futur: er/sie werde + Infinitiv. \u0412 dass-\u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0442\u043E\u0442 \u0436\u0435: \u2026 sie den Bericht sp\xE4ter schreiben werde."
  },
  {
    text: "Sie sagten, sie {0} keine Zeit {1}.",
    gaps: [["h\xE4tten"], ["gehabt"]],
    hint: "(haben)",
    why: "\u041C\u043D. \u0447\u0438\u0441\u043B\u043E + Perfekt: KI \xABhaben\xBB = \u0438\u043D\u0434\u0438\u043A\u0430\u0442\u0438\u0432, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 KII \u2014 h\xE4tten + gehabt."
  },
  {
    text: "Die Chefin sagte, er {0} fr\xFCher gehen.",
    gaps: [["d\xFCrfe"]],
    hint: "(d\xFCrfen)",
    why: "KI \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0433\u043E: d\xFCrfen \u2192 er d\xFCrfe. \u0420\u044F\u0434 \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0445 KI: k\xF6nne, m\xFCsse, d\xFCrfe, solle, wolle."
  }
];
var pick = (xs) => xs[Math.floor(Math.random() * xs.length)];
var MODALS = {
  m\u00FCssen: ["muss", "musst", "muss", "m\xFCssen", "m\xFCsst", "m\xFCssen"],
  k\u00F6nnen: ["kann", "kannst", "kann", "k\xF6nnen", "k\xF6nnt", "k\xF6nnen"],
  d\u00FCrfen: ["darf", "darfst", "darf", "d\xFCrfen", "d\xFCrft", "d\xFCrfen"],
  sollen: ["soll", "sollst", "soll", "sollen", "sollt", "sollen"],
  wollen: ["will", "willst", "will", "wollen", "wollt", "wollen"]
};
var verb = (inf) => verbByInf[inf] ?? VERBS_FALLBACK;
var VERBS_FALLBACK = {
  inf: "machen",
  pr: "mache macht macht machen macht machen",
  part: "gemacht",
  aux: "h"
};
function passivModal() {
  if (Math.random() < 0.5) {
    const f2 = pick(PASSIV_MODAL_GAPS);
    const v2 = verb(f2.v);
    const form = f2.plural ? MODALS[f2.modal][3] : MODALS[f2.modal][2];
    return {
      topic: "b2-passiv-modal",
      task: "Passiv mit Modalverb: Modalverb + Partizip II + \xABwerden\xBB \u0432 \u0441\u0430\u043C\u043E\u043C \u043A\u043E\u043D\u0446\u0435.",
      text: f2.text,
      hint: `(${f2.modal} / ${v2.inf})`,
      gaps: [[form], [v2.part], ["werden"]],
      why: `Passiv mit Modalverb = Modalverb + Partizip II + werden. ` + (f2.plural ? `\u041F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u0432\u043E \u043C\u043D. \u0447\u0438\u0441\u043B\u0435 \u2192 ${f2.modal} \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u0442\u0441\u044F \u043A\u0430\u043A \xABwir/sie\xBB: ${MODALS[f2.modal][3]}.` : `\u041F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u0432 \u0435\u0434. \u0447\u0438\u0441\u043B\u0435 \u2192 ${f2.modal} \u0431\u0435\u0437 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F: ${MODALS[f2.modal][2]}.`) + ` \xAB${v2.inf}\xBB \u2192 ${v2.part}, \xABwerden\xBB \u2014 \u0441\u0430\u043C\u043E\u0435 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0441\u043B\u043E\u0432\u043E: \xAB${f2.text.replace("{0}", form).replace("{1}", v2.part).replace("{2}", "werden").replace(/\.$/, "")}\xBB.`
    };
  }
  const f = pick(PASSIV_MODAL_TRANS);
  return {
    topic: "b2-passiv-modal",
    task: "Verwandle den Satz mit \xABman\xBB ins Passiv mit Modalverb. Akkusativ-Objekt \u2192 Subjekt.",
    text: `${f.aktiv}
{0}`,
    gaps: [f.answers],
    why: `\u0410\u043A\u043A\u0443\u0437\u0430\u0442\u0438\u0432-\u043E\u0431\u044A\u0435\u043A\u0442 \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C, \xABman\xBB \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442. \u041C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u043E\u0433\u043B\u0430\u0441\u0443\u0435\u0442\u0441\u044F \u0441 \u041D\u041E\u0412\u042B\u041C \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C \u2014 ${f.plural ? "\u0437\u0434\u0435\u0441\u044C \u043C\u043D. \u0447\u0438\u0441\u043B\u043E" : "\u0437\u0434\u0435\u0441\u044C \u0435\u0434. \u0447\u0438\u0441\u043B\u043E"} \u2014 \u0430 \u043D\u0435 \u0441 \xABman\xBB: \xAB${f.answers[0].replace(/\.$/, "")}\xBB. \u0421\u043C\u044B\u0441\u043B\u043E\u0432\u043E\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u2014 Partizip II, \xABwerden\xBB \u2014 \u0432 \u0441\u0430\u043C\u043E\u043C \u043A\u043E\u043D\u0446\u0435.`
  };
}
function konjunktiv2Vergangenheit() {
  if (Math.random() < 0.5) {
    const f2 = pick(KONJ2V_GAPS);
    return {
      topic: "b2-konjunktiv2-vergangenheit",
      task: "Konjunktiv II der Vergangenheit: h\xE4tte/w\xE4re + Partizip II \u0432 \u043E\u0431\u0435\u0438\u0445 \u0447\u0430\u0441\u0442\u044F\u0445.",
      text: f2.text,
      hint: f2.hint,
      gaps: f2.gaps,
      why: f2.why
    };
  }
  const f = pick(KONJ2V_TRANS);
  return {
    topic: "b2-konjunktiv2-vergangenheit",
    task: "Forme die realen S\xE4tze in den irrealen Bedingungssatz der Vergangenheit um. \u041E\u0431\u0430 \u043F\u043E\u0440\u044F\u0434\u043A\u0430 \u0432\u0435\u0440\u043D\u044B.",
    text: `${f.a}
{0}`,
    gaps: [f.answers],
    why: `\u0420\u0435\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u043E\u0448\u043B\u043E\u0435 \u043F\u0435\u0440\u0435\u0441\u043A\u0430\u0437\u0430\u043D\u043E \u043A\u0430\u043A \u043D\u0435\u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0435: \u043E\u0431\u0435 \u0447\u0430\u0441\u0442\u0438 \u2014 Konjunktiv II Vergangenheit (h\xE4tte/w\xE4re + Partizip II). \u0412 wenn-\u0447\u0430\u0441\u0442\u0438\u0446\u0435 \u0432\u0441\u043F\u043E\u043C\u043E\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0432 \u043A\u043E\u043D\u0446\u0435, \u0432 \u0433\u043B\u0430\u0432\u043D\u043E\u043C \u2014 \u043D\u0430 \u0432\u0442\u043E\u0440\u043E\u043C \u043C\u0435\u0441\u0442\u0435. \u0417\u0434\u0435\u0441\u044C: \xAB${f.answers[0].replace(/\.$/, "")}\xBB.`
  };
}
function konjunktiv1() {
  if (Math.random() < 0.55) {
    const f2 = pick(KONJ1_TRANS);
    return {
      topic: "b2-konjunktiv1",
      task: "Setze in die indirekte Rede (Konjunktiv I). Beide Varianten gelten: mit und ohne \xABdass\xBB.",
      text: `${f2.rep}: \u201E${f2.q}\u201C
{0}`,
      hint: "(Konjunktiv I)",
      gaps: [f2.answers],
      why: `${f2.note} \u0412 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u043D\u043E\u0439 \u0440\u0435\u0447\u0438 KI \u0447\u0430\u0441\u0442\u043E \u0437\u0430\u043C\u0435\u043D\u044F\u044E\u0442 \u043D\u0430 KII (er k\xE4me / er h\xE4tte \u2026 gekauft) \u0438\u043B\u0438 w\xFCrde + Infinitiv \u2014 \u043D\u043E \u0432 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u043E\u0439 \u0440\u0435\u0447\u0438 \u043D\u0430 \u043F\u0438\u0441\u044C\u043C\u0435 \u0436\u0434\u0443\u0442 Konjunktiv I.`
    };
  }
  const f = pick(KONJ1_GAPS);
  return {
    topic: "b2-konjunktiv1",
    task: "Setze das Verb im Konjunktiv I ein.",
    text: f.text,
    hint: f.hint,
    gaps: f.gaps,
    why: `${f.why} \u0412 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u043D\u043E\u0439 \u0440\u0435\u0447\u0438 \u0432\u043C\u0435\u0441\u0442\u043E KI \u0441\u0442\u043E\u044F\u043B \u0431\u044B KII (k\xE4men / h\xE4tten / w\xE4ren / w\xFCrden) \u2014 \u044D\u0442\u043E \u043D\u043E\u0440\u043C\u0430, \u043D\u043E \u0437\u0434\u0435\u0441\u044C \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u0442\u0441\u044F KI.`
  };
}
KONJ2V_TRANS.push(...KONJ2V_TRANS_EXTRA);

// src/lib/de/b2satz.ts
var PARTIZIPIAL = [
  /* --------------------------- Partizip II: деятель назван (von-Angabe) -- */
  {
    attr: "das von ihm geschriebene Buch",
    rel: ["das Buch, das er geschrieben hat", "das Buch, das von ihm geschrieben wurde"],
    why: "Partizip II \u0441 \u043F\u0430\u0441\u0441\u0438\u0432\u043D\u044B\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435\u043C: \u201Evon ihm geschrieben\u201C = \xAB\u043D\u0430\u043F\u0438\u0441\u0430\u043D\u043D\u0430\u044F \u0438\u043C\xBB. \u0412 Relativsatz \u0434\u0435\u044F\u0442\u0435\u043B\u044C \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C: von ihm \u2192 er, \u0433\u043B\u0430\u0433\u043E\u043B \u2014 \u0432 Perfekt aktiv: \xABdas er geschrieben hat\xBB. \u0412\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u0438 \u043F\u0430\u0441\u0441\u0438\u0432: \xABdas von ihm geschrieben wurde\xBB. \u041E\u0431\u0430 \u0432\u0435\u0440\u043D\u044B."
  },
  {
    attr: "die vom Vater reparierten Fahrr\xE4der",
    rel: ["die Fahrr\xE4der, die der Vater repariert hat", "die Fahrr\xE4der, die vom Vater repariert wurden"],
    why: "vom Vater = von dem Vater \u2014 \u0434\u0435\u044F\u0442\u0435\u043B\u044C \u043D\u0430\u0437\u0432\u0430\u043D. \u0412 \u0430\u043A\u0442\u0438\u0432\u0435 \u043E\u043D \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C (der Vater repariert hat), \u0432 \u043F\u0430\u0441\u0441\u0438\u0432\u0435 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F von-\u0433\u0440\u0443\u043F\u043F\u043E\u0439. \u041E\u0431\u0430 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430 \u0433\u0440\u0430\u043C\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0432\u0435\u0440\u043D\u044B."
  },
  {
    attr: "die von ihr eingeladenen G\xE4ste",
    rel: ["die G\xE4ste, die sie eingeladen hat", "die G\xE4ste, die von ihr eingeladen wurden"],
    why: "von ihr \u2192 sie: \u0434\u0435\u044F\u0442\u0435\u043B\u044C \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C, einladen \u2014 \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B, Partizip II eingeladen \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u043A\u043E\u043D\u0446\u0435 Perfekt: \xABdie sie eingeladen hat\xBB. \u041F\u0430\u0441\u0441\u0438\u0432: \xABdie von ihr eingeladen wurden\xBB."
  },
  {
    attr: "die von ihm aufgemachte T\xFCr",
    rel: ["die T\xFCr, die er aufgemacht hat", "die T\xFCr, die von ihm aufgemacht wurde"],
    why: "aufmachen \u2014 \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439: Partizip II aufgemacht, \u0432 Perfekt \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446: \xABdie er aufgemacht hat\xBB. von ihm \u2192 er \u2014 \u0434\u0435\u044F\u0442\u0435\u043B\u044C \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C."
  },
  /* ----------------------- Partizip II: деятель НЕ назван → пассив ------ */
  {
    attr: "das in Deutschland gekaufte Auto",
    rel: ["das Auto, das in Deutschland gekauft wurde", "das Auto, das man in Deutschland gekauft hat"],
    why: "\u0414\u0435\u044F\u0442\u0435\u043B\u044C \u0432 \u043E\u0431\u043E\u0440\u043E\u0442\u0435 \u043D\u0435 \u043D\u0430\u0437\u0432\u0430\u043D, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0432 Relativsatz \u043F\u0430\u0441\u0441\u0438\u0432: \xABgekauft wurde\xBB. \u0410\u043A\u0442\u0438\u0432 \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043D\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u043E-\u043B\u0438\u0447\u043D\u044B\u043C man: \xABdas man in Deutschland gekauft hat\xBB. \u041E\u0431\u0430 \u0432\u0435\u0440\u043D\u044B."
  },
  {
    attr: "das im Sommer verkaufte Haus",
    rel: ["das Haus, das im Sommer verkauft wurde", "das Haus, das man im Sommer verkauft hat"],
    why: "\u0414\u043E\u043C \u0441\u0430\u043C \u0441\u0435\u0431\u044F \u043D\u0435 \u043F\u0440\u043E\u0434\u0430\u0441\u0442 \u2014 \u044D\u0442\u043E \u043F\u0430\u0441\u0441\u0438\u0432\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \xABverkauft wurde\xBB \u0438\u043B\u0438 \xABdas man \u2026 verkauft hat\xBB. \u0410\u043A\u0442\u0438\u0432 \u0441 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u044B\u043C \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C \u0437\u0434\u0435\u0441\u044C \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D: \u0434\u0435\u044F\u0442\u0435\u043B\u044C \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u0435\u043D."
  },
  {
    attr: "das gestern bestellte Essen",
    rel: ["das Essen, das gestern bestellt wurde", "das Essen, das man gestern bestellt hat"],
    why: "\u0414\u0435\u044F\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0437\u0432\u0430\u043D \u2192 \u043F\u0430\u0441\u0441\u0438\u0432 \u0432 Relativsatz: \xABbestellt wurde\xBB. \u0410\u043A\u0442\u0438\u0432 \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u0441 man: \xABdas man gestern bestellt hat\xBB. \u041E\u0431\u0430 \u0432\u0435\u0440\u043D\u044B."
  },
  {
    attr: "die gerade renovierte Wohnung",
    rel: ["die Wohnung, die gerade renoviert wird", "die Wohnung, die man gerade renoviert"],
    why: "\u201Egerade\u201C \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u0440\u043E\u0446\u0435\u0441\u0441 \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441 \u2192 Pr\xE4sens Passiv: \xABrenoviert wird\xBB. Perfekt \u043D\u0435 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442: \u0440\u0435\u043C\u043E\u043D\u0442 \u0435\u0449\u0451 \u043D\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D. \u0412\u0440\u0435\u043C\u044F \u043F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u044F \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0442 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442, \u0430 \u043D\u0435 \u0442\u0430\u0431\u043B\u0438\u0446\u0430."
  },
  /* --------------- Partizip I: актив и одновременность → Präsens aktiv -- */
  {
    attr: "das laute singende Kind",
    rel: ["das Kind, das laut singt"],
    why: "Partizip I = \u0430\u043A\u0442\u0438\u0432 + \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0441\u0442\u044C: singend = \xAB\u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u043F\u043E\u0451\u0442\xBB, Pr\xE4sens. \u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 laut \u043F\u0435\u0440\u0435\u0435\u0437\u0436\u0430\u0435\u0442 \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u0438 \u0441\u0442\u043E\u0438\u0442 \u043F\u0435\u0440\u0435\u0434 \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u043C: \xABdas laut singt\xBB."
  },
  {
    attr: "der in Kiel wohnende Student",
    rel: ["der Student, der in Kiel wohnt"],
    why: "wohnend = \xAB\u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0436\u0438\u0432\u0451\u0442\xBB. Partizip I \u0432\u0441\u0435\u0433\u0434\u0430 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0441\u0442\u044C, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0432 Relativsatz Pr\xE4sens aktiv, \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u043A\u043E\u043D\u0446\u0435: \xABder in Kiel wohnt\xBB."
  },
  {
    attr: "die auf den Bus wartende Frau",
    rel: ["die Frau, die auf den Bus wartet"],
    why: "warten auf + Akkusativ: \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 auf den Bus \u0446\u0435\u043B\u0438\u043A\u043E\u043C \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435, \u043F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435 wartend \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u043C wartet \u2014 Pr\xE4sens, \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u043A\u043E\u043D\u0446\u0435."
  },
  {
    attr: "der schlafende Hund",
    rel: ["der Hund, der schl\xE4ft"],
    why: "schlafend = \xAB\u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0441\u043F\u0438\u0442\xBB. schlafen \u2014 \u043D\u0435\u043F\u0435\u0440\u0435\u0445\u043E\u0434\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B, \u043F\u0430\u0441\u0441\u0438\u0432\u0430 \u0437\u0434\u0435\u0441\u044C \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u043E\u0436\u0435\u0442: \u0442\u043E\u043B\u044C\u043A\u043E Partizip I \u0438 Pr\xE4sens \u0432 Relativsatz."
  },
  {
    attr: "die gut Deutsch sprechende Touristin",
    rel: ["die Touristin, die gut Deutsch spricht"],
    why: "sprechend = \xAB\u043A\u043E\u0442\u043E\u0440\u0430\u044F \u0433\u043E\u0432\u043E\u0440\u0438\u0442\xBB. \u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 gut Deutsch \u0441\u0442\u043E\u0438\u0442 \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u043F\u0435\u0440\u0435\u0434 \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u043C: \xABdie gut Deutsch spricht\xBB. \u041E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 -e \u0443 \u043F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u044F \u2014 \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434, Nominativ."
  },
  {
    attr: "das viel lesende M\xE4dchen",
    rel: ["das M\xE4dchen, das viel liest"],
    why: "lesend = \xAB\u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u0447\u0438\u0442\u0430\u0435\u0442\xBB. viel \u2014 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435, \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u043F\u0435\u0440\u0435\u0434 \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u043C. \u0427\u0438\u0442\u0430\u0435\u0442 \u043E\u043D\u043E \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u0441 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435\u043C \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u2192 Pr\xE4sens, \u043D\u0435 Perfekt."
  }
];
var KONJ_GEHOBEN = [
  /* --------------------------------------------------------------- sofern -- */
  {
    a: "Wir fahren ans Meer.",
    b: "Das Wetter bleibt sch\xF6n.",
    konj: "sofern",
    answers: [
      "Wir fahren ans Meer, sofern das Wetter sch\xF6n bleibt.",
      "Sofern das Wetter sch\xF6n bleibt, fahren wir ans Meer."
    ]
  },
  {
    a: "Ich komme zur Party.",
    b: "Ich habe Zeit.",
    konj: "sofern",
    answers: [
      "Ich komme zur Party, sofern ich Zeit habe.",
      "Sofern ich Zeit habe, komme ich zur Party."
    ]
  },
  {
    a: "Ich gehe spazieren.",
    b: "Es regnet nicht.",
    konj: "sofern",
    answers: [
      "Ich gehe spazieren, sofern es nicht regnet.",
      "Sofern es nicht regnet, gehe ich spazieren."
    ]
  },
  /* ---------------------------------------------------------------- falls -- */
  {
    a: "Ich rufe dich an.",
    b: "Ich brauche deine Hilfe.",
    konj: "falls",
    answers: [
      "Ich rufe dich an, falls ich deine Hilfe brauche.",
      "Falls ich deine Hilfe brauche, rufe ich dich an."
    ]
  },
  {
    a: "Ich nehme den Regenschirm mit.",
    b: "Es regnet.",
    konj: "falls",
    answers: [
      "Ich nehme den Regenschirm mit, falls es regnet.",
      "Falls es regnet, nehme ich den Regenschirm mit."
    ]
  },
  {
    a: "Du kannst mich jederzeit besuchen.",
    b: "Du bist in Berlin.",
    konj: "falls",
    answers: [
      "Du kannst mich jederzeit besuchen, falls du in Berlin bist.",
      "Falls du in Berlin bist, kannst du mich jederzeit besuchen."
    ]
  },
  {
    a: "Wir essen drinnen.",
    b: "Es ist kalt drau\xDFen.",
    konj: "falls",
    answers: [
      "Wir essen drinnen, falls es drau\xDFen kalt ist.",
      "Falls es drau\xDFen kalt ist, essen wir drinnen."
    ]
  },
  /* ---------------------------------------------------------------- indem --
     «каким образом»: второе предложение — СРЕДСТВО, а не причина. */
  {
    a: "Er verbessert sein Deutsch.",
    b: "Er sieht jeden Abend deutsche Filme.",
    konj: "indem",
    answers: [
      "Er verbessert sein Deutsch, indem er jeden Abend deutsche Filme sieht.",
      "Indem er jeden Abend deutsche Filme sieht, verbessert er sein Deutsch."
    ]
  },
  {
    a: "Sie bleibt fit.",
    b: "Sie macht jeden Morgen Sport.",
    konj: "indem",
    answers: [
      "Sie bleibt fit, indem sie jeden Morgen Sport macht.",
      "Indem sie jeden Morgen Sport macht, bleibt sie fit."
    ]
  },
  {
    a: "Du hilfst der Umwelt.",
    b: "Du f\xE4hrst \xF6fter mit dem Fahrrad.",
    konj: "indem",
    answers: [
      "Du hilfst der Umwelt, indem du \xF6fter mit dem Fahrrad f\xE4hrst.",
      "Indem du \xF6fter mit dem Fahrrad f\xE4hrst, hilfst du der Umwelt."
    ]
  },
  {
    a: "Ich verbessere meinen Wortschatz.",
    b: "Ich lese deutsche Zeitungen.",
    konj: "indem",
    answers: [
      "Ich verbessere meinen Wortschatz, indem ich deutsche Zeitungen lese.",
      "Indem ich deutsche Zeitungen lese, verbessere ich meinen Wortschatz."
    ]
  },
  /* --------------------------------------------------------------- sodass --
     Следствие. Вынос придаточного с sodass вперёд грамматически верен,
     но стилистически редок — поэтому он в answers (проверка принимает),
     а в why стоит честная пометка. */
  {
    a: "Es regnet stark.",
    b: "Wir bleiben zu Hause.",
    konj: "sodass",
    answers: [
      "Es regnet stark, sodass wir zu Hause bleiben.",
      "Sodass wir zu Hause bleiben, regnet es stark."
    ]
  },
  {
    a: "Er hat sehr flei\xDFig gelernt.",
    b: "Er bekommt eine gute Note.",
    konj: "sodass",
    answers: [
      "Er hat sehr flei\xDFig gelernt, sodass er eine gute Note bekommt.",
      "Sodass er eine gute Note bekommt, hat er sehr flei\xDFig gelernt."
    ]
  },
  {
    a: "Wir nehmen ein Taxi.",
    b: "Wir kommen p\xFCnktlich.",
    konj: "sodass",
    answers: [
      "Wir nehmen ein Taxi, sodass wir p\xFCnktlich kommen.",
      "Sodass wir p\xFCnktlich kommen, nehmen wir ein Taxi."
    ]
  }
];
var pick2 = (xs) => xs[Math.floor(Math.random() * xs.length)];
function partizipial() {
  const f = pick2(PARTIZIPIAL);
  const toRel = Math.random() < 0.55;
  return toRel ? {
    topic: "b2-partizipial",
    task: "Forme das Partizipialattribut in einen Relativsatz um. \u041F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435 \u0441\u043D\u043E\u0432\u0430 \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u043C \u2014 \u0432 \u043A\u043E\u043D\u0446\u0435 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E.",
    /* карточка «оборот → {0}»: текст — именная группа, не предложение */
    text: `${f.attr} \u2192 {0}`,
    gaps: [f.rel],
    why: f.why
  } : {
    topic: "b2-partizipial",
    task: "Forme den Relativsatz in ein Partizipialattribut um. \u041F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435 \u0441\u0442\u043E\u0438\u0442 \u043C\u0435\u0436\u0434\u0443 \u0430\u0440\u0442\u0438\u043A\u043B\u0435\u043C \u0438 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u043C, \u0433\u043B\u0430\u0433\u043E\u043B \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442.",
    text: `${f.rel[0]} \u2192 {0}`,
    hint: "(Partizip I oder Partizip II)",
    gaps: [[f.attr]],
    why: f.why + " \u041E\u0431\u0440\u0430\u0442\u043D\u043E: \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435 (Partizip I \u043F\u0440\u0438 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0441\u0442\u0438, Partizip II \u043F\u0440\u0438 \u043F\u0430\u0441\u0441\u0438\u0432\u0435), \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F \u0441\u0442\u0430\u0432\u044F\u0442\u0441\u044F \u043F\u0435\u0440\u0435\u0434 \u043F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435\u043C, \u0438 \u0432\u0441\u0451 \u0432\u043C\u0435\u0441\u0442\u0435 \u0432\u0441\u0442\u0430\u0451\u0442 \u043C\u0435\u0436\u0434\u0443 \u0430\u0440\u0442\u0438\u043A\u043B\u0435\u043C \u0438 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u043C."
  };
}
var BEDEUTUNG = {
  sofern: "\xAB\u043F\u0440\u0438 \u0443\u0441\u043B\u043E\u0432\u0438\u0438, \u0447\u0442\u043E\xBB \u2014 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u0435",
  falls: "\xAB\u0435\u0441\u043B\u0438, \u043D\u0430 \u0441\u043B\u0443\u0447\u0430\u0439 \u0435\u0441\u043B\u0438\xBB \u2014 \u043E\u0434\u043D\u043E \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u0435",
  indem: "\xAB\u0442\u0435\u043C \u0447\u0442\u043E\xBB \u2014 \u043A\u0430\u043A\u0438\u043C \u043E\u0431\u0440\u0430\u0437\u043E\u043C \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435, \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u043E",
  sodass: "\xAB\u0442\u0430\u043A \u0447\u0442\u043E\xBB \u2014 \u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0438\u0435 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F"
};
function konnektorenGehoben() {
  const f = pick2(KONJ_GEHOBEN);
  return {
    topic: "b2-konnektoren-gehoben",
    task: `Verbinde die beiden S\xE4tze mit \xAB${f.konj}\xBB. \u0413\u043B\u0430\u0433\u043E\u043B \u2014 \u0432 \u043A\u043E\u043D\u0446\u0435 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E.`,
    text: `${f.a} / ${f.b}
{0}`,
    hint: `(${f.konj} \u2014 ${BEDEUTUNG[f.konj]})`,
    gaps: [f.answers],
    why: `\xAB${f.konj}\xBB \u2014 ${BEDEUTUNG[f.konj]}. \u0412 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446. \u041E\u0431\u0430 \u043F\u043E\u0440\u044F\u0434\u043A\u0430 \u0432\u0435\u0440\u043D\u044B: \xAB${f.answers[0]}\xBB \u0438 \xAB${f.answers[1]}\xBB.` + (f.konj === "sodass" ? " \u0422\u0430\u043A \u043A\u0430\u043A sodass \u2014 \u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0438\u0435, \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u043E\u0431\u044B\u0447\u043D\u043E \u0441\u0442\u043E\u0438\u0442 \u043F\u043E\u0441\u043B\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E; \u0432\u044B\u043D\u043E\u0441 \u0432\u043F\u0435\u0440\u0451\u0434 \u0433\u0440\u0430\u043C\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0432\u0435\u0440\u0435\u043D, \u043D\u043E \u0440\u0435\u0434\u043E\u043A." : f.konj === "indem" ? " \u041D\u0435 \u043F\u0443\u0442\u0430\u0439 \u0441 weil: weil \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u043D\u0430 \xAB\u043F\u043E\u0447\u0435\u043C\u0443\xBB, indem \u2014 \u043D\u0430 \xAB\u043A\u0430\u043A\u0438\u043C \u043E\u0431\u0440\u0430\u0437\u043E\u043C\xBB." : f.konj === "falls" ? " falls \u2014 \xAB\u043D\u0430 \u0441\u043B\u0443\u0447\u0430\u0439 \u0435\u0441\u043B\u0438\xBB (\u043E\u0434\u043D\u043E \u0431\u0443\u0434\u0443\u0449\u0435\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u0435); \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0435\u0435\u0441\u044F \u0443\u0441\u043B\u043E\u0432\u0438\u0435 \u2014 wenn." : "")
  };
}

// src/lib/de/b2wort.ts
var NOM_PAIRS = [
  {
    nom: "Nach seiner Ankunft rief er uns an.",
    verb: ["Nachdem er angekommen war, rief er uns an.", "Er rief uns an, nachdem er angekommen war."],
    why: "nach + Nomen \u2192 nachdem + Plusquamperfekt: Ankunft \u0441\u043B\u0443\u0447\u0438\u043B\u0430\u0441\u044C \u0420\u0410\u041D\u042C\u0428\u0415 \u0437\u0432\u043E\u043D\u043A\u0430, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 angekommen war. \u0412\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u043E\u0433\u043E sich \u043D\u0435\u0442, \u043D\u043E \u0435\u0441\u0442\u044C Possessiv: seine Ankunft = \xAB\u0442\u043E, \u0447\u0442\u043E \u043E\u043D \u043F\u0440\u0438\u0448\u0451\u043B\xBB."
  },
  {
    nom: "Nach dem Essen gingen wir spazieren.",
    verb: ["Nachdem wir gegessen hatten, gingen wir spazieren.", "Wir gingen spazieren, nachdem wir gegessen hatten."],
    why: "das Essen \u2014 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 (\u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434, \u0441 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0432\u044B). \u041F\u0440\u0435\u0434\u0448\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043D\u0438\u0435 \u2192 nachdem + Plusquamperfekt: gegessen hatten, \u043F\u043E\u0442\u043E\u043C gingen."
  },
  {
    nom: "Beim Einkaufen traf sie ihre Nachbarin.",
    verb: [
      "Als sie einkaufte, traf sie ihre Nachbarin.",
      "W\xE4hrend sie einkaufte, traf sie ihre Nachbarin."
    ],
    why: "bei + Nominalisierung = \xAB\u0432 \u0442\u043E \u0432\u0440\u0435\u043C\u044F \u043A\u0430\u043A\xBB. \u041E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u0435 \u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C \u2192 als sie einkaufte; \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u0438 w\xE4hrend \u2014 \u043F\u0440\u043E\u0446\u0435\u0441\u0441 \u043F\u043E\u043A\u0443\u043F\u043A\u0438 \u0434\u043B\u0438\u043B\u0441\u044F, \u0432\u0441\u0442\u0440\u0435\u0447\u0430 \u0441\u043B\u0443\u0447\u0438\u043B\u0430\u0441\u044C \u0432\u043D\u0443\u0442\u0440\u0438 \u043D\u0435\u0433\u043E. \u041E\u0431\u0430 \u0432\u0435\u0440\u043D\u044B."
  },
  {
    nom: "Beim Sprechen macht er viele Fehler.",
    verb: ["Wenn er spricht, macht er viele Fehler.", "Er macht viele Fehler, wenn er spricht."],
    why: "\u0420\u0435\u0447\u044C \u0438\u0434\u0451\u0442 \u043E \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0435\u0439\u0441\u044F \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438 (\xAB\u043A\u043E\u0433\u0434\u0430 \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u2014 \u0432\u0441\u0435\u0433\u0434\u0430 \u0441 \u043E\u0448\u0438\u0431\u043A\u0430\u043C\u0438\xBB), \u043F\u043E\u044D\u0442\u043E\u043C\u0443 wenn, \u0430 \u043D\u0435 als. \u041E\u0431\u0430 \u043F\u043E\u0440\u044F\u0434\u043A\u0430 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0432\u0435\u0440\u043D\u044B."
  },
  {
    nom: "Ohne Anmeldung kann man an dem Kurs nicht teilnehmen.",
    verb: [
      "Wenn man sich nicht anmeldet, kann man an dem Kurs nicht teilnehmen.",
      "Ohne dass man sich anmeldet, kann man an dem Kurs nicht teilnehmen.",
      "Man kann an dem Kurs nicht teilnehmen, wenn man sich nicht anmeldet.",
      "Man kann an dem Kurs nicht teilnehmen, ohne dass man sich anmeldet."
    ],
    why: "ohne + Nomen \u2192 \u043E\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 wenn (\u0441 nicht) \u0438\u043B\u0438 \u0441\u043E\u044E\u0437 ohne dass. sich anmelden \u2014 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u044B\u0439: sich \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442 \u0432 die Anmeldung."
  },
  {
    nom: "Wegen der Versp\xE4tung des Zuges kamen wir zu sp\xE4t.",
    verb: [
      "Da der Zug Versp\xE4tung hatte, kamen wir zu sp\xE4t.",
      "Weil der Zug Versp\xE4tung hatte, kamen wir zu sp\xE4t.",
      "Wir kamen zu sp\xE4t, weil der Zug Versp\xE4tung hatte.",
      "Wir kamen zu sp\xE4t, da der Zug Versp\xE4tung hatte."
    ],
    why: "wegen + Genitiv \u2192 da/weil + Satz. da \u0437\u0432\u0443\u0447\u0438\u0442 \u0447\u0443\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u0435\u043D\u043D\u0435\u0435, weil \u043D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u043E \u2014 \u043E\u0431\u0430 \u0432\u0435\u0440\u043D\u044B. \u0413\u0435\u043D\u0438\u0442\u0438\u0432 \xABdes Zuges\xBB \u0432 Nominalstil \u2014 \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u043D\u043E\u0441\u0442\u044C, \u0432 Verbalstil \u043E\u043D \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C."
  },
  {
    nom: "Trotz der Einladung kam er nicht.",
    verb: ["Obwohl er eingeladen war, kam er nicht.", "Er kam nicht, obwohl er eingeladen war."],
    why: "trotz + Genitiv \u2192 obwohl. \xABEr war eingeladen\xBB \u2014 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 Pr\xE4teritumPassiv eingeladen war. \u0421\u043C\u044B\u0441\u043B: \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u0431\u044B\u043B\u043E, \u0430 \u043E\u043D \u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043D\u0435 \u043F\u0440\u0438\u0448\u0451\u043B."
  },
  {
    nom: "Durch t\xE4gliches Lesen verbessert man seinen Wortschatz.",
    verb: [
      "Man verbessert seinen Wortschatz, indem man t\xE4glich liest.",
      "Indem man t\xE4glich liest, verbessert man seinen Wortschatz."
    ],
    why: "durch + Nomen \u2192 indem (\xAB\u0442\u0435\u043C \u0447\u0442\u043E\xBB \u2014 \u0441\u043F\u043E\u0441\u043E\u0431). T\xE4gliches Lesen \u2014 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 \u0441 \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435\u043C \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0440\u043E\u0434\u0430 -es. \u041E\u0431\u0430 \u043F\u043E\u0440\u044F\u0434\u043A\u0430 \u0432\u0435\u0440\u043D\u044B."
  },
  {
    nom: "Nach der Erkl\xE4rung des Lehrers verstand ich alles.",
    verb: ["Nachdem der Lehrer alles erkl\xE4rt hatte, verstand ich alles.", "Ich verstand alles, nachdem der Lehrer alles erkl\xE4rt hatte."],
    why: "\u0414\u0435\u044F\u0442\u0435\u043B\u044C \u0438\u0437 \u0433\u0435\u043D\u0438\u0442\u0438\u0432\u0430 \xABdes Lehrers\xBB \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E: nachdem der Lehrer \u2026, \u043F\u0440\u0435\u0434\u0448\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043D\u0438\u0435 \u2192 Plusquamperfekt erkl\xE4rt hatte."
  },
  {
    nom: "Die \xDCbersetzung des Textes dauerte zwei Stunden.",
    verb: [
      "Den Text zu \xFCbersetzen dauerte zwei Stunden.",
      "Es dauerte zwei Stunden, den Text zu \xFCbersetzen."
    ],
    why: "Nomen-\u0432\u0435\u0440\u0441\u0438\u044F \u2192 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u043D\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430 mit zu: den Text zu \xFCbersetzen. \u041E\u0431\u0435 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B \u0432\u0435\u0440\u043D\u044B: \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u043D\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430 \u0432 \u043D\u0430\u0447\u0430\u043B\u0435 (\u0441 Akkusativ \u043F\u0435\u0440\u0435\u0434 zu) \u0438\u043B\u0438 es \u0432 \u043D\u0430\u0447\u0430\u043B\u0435 \u0438 \u0433\u0440\u0443\u043F\u043F\u0430 \u0432 \u043A\u043E\u043D\u0446\u0435."
  },
  {
    nom: "Die Anmeldung zum Kurs ist bis Freitag m\xF6glich.",
    verb: ["Man kann sich bis Freitag zum Kurs anmelden."],
    why: "die Anmeldung zum Kurs = \xAB\u0437\u0430\u043F\u0438\u0441\u044C \u043D\u0430 \u043A\u0443\u0440\u0441\xBB: \u043F\u0440\u0435\u0434\u043B\u043E\u0433 zu \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043F\u0440\u0438 Nomen. \u0412 Verbalstil \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u043E\u0435 sich \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F: man kann sich \u2026 anmelden."
  },
  {
    nom: "Die Pr\xFCfung der Unterlagen dauert einen Tag.",
    verb: ["Die Unterlagen werden einen Tag gepr\xFCft."],
    why: "\xABPr\xFCfung der Unterlagen\xBB \u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043F\u0430\u0441\u0441\u0438\u0432\u043D\u043E: \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u043D\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u044E\u0442 \u0441\u0435\u0431\u044F \u0441\u0430\u043C\u0438. \u0412 Verbalstil \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F Passiv Pr\xE4sens: werden gepr\xFCft. Nominalstil \u0447\u0430\u0441\u0442\u043E \u043F\u0440\u044F\u0447\u0435\u0442 \u043F\u0430\u0441\u0441\u0438\u0432 \u2014 \u044D\u0442\u043E \u0435\u0433\u043E \u0442\u0438\u043F\u0438\u0447\u043D\u044B\u0439 \u043F\u0440\u0438\u0437\u043D\u0430\u043A."
  }
];
var FVG_PAIRS = [
  {
    fvg: "eine Entscheidung treffen",
    verb: "entscheiden",
    fvgSent: "Der Vorstand hat eine Entscheidung getroffen.",
    verbSents: ["Der Vorstand hat entschieden."],
    why: "eine Entscheidung TREFFEN (\u043D\u0435 machen!) = entscheiden. \u0412 Perfekt Partizip II \u0424\u0443\u043D\u043A\u0446\u0433\u043B\u0430\u0433\u043E\u043B\u0430: getroffen. \u0412 Vollverb-\u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0435 \u0432\u0441\u0451 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u0436\u0438\u043C\u0430\u0435\u0442\u0441\u044F \u0432 \u043E\u0434\u0438\u043D \u0433\u043B\u0430\u0433\u043E\u043B."
  },
  {
    fvg: "zur Schule gehen",
    verb: "die Schule besuchen",
    fvgSent: "Ich bin acht Jahre zur Schule gegangen.",
    verbSents: ["Ich habe acht Jahre die Schule besucht."],
    why: "zur Schule gehen = die Schule besuchen \u2014 \xAB\u0445\u043E\u0434\u0438\u0442\u044C \u0432 \u0448\u043A\u043E\u043B\u0443\xBB. \u041E\u0431\u0440\u0430\u0442\u0438\u0442\u0435 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435: gehen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 sein (bin gegangen), besuchen \u2014 haben (habe besucht)."
  },
  {
    fvg: "eine Diskussion f\xFChren",
    verb: "diskutieren",
    fvgSent: "Wir haben eine lange Diskussion gef\xFChrt.",
    verbSents: ["Wir haben lange diskutiert."],
    why: "eine Diskussion F\xDCHREN = diskutieren. \u041F\u0440\u0438\u043B\u0430\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 (lange) \u0432 Vollverb-\u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0435 \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043D\u0430\u0440\u0435\u0447\u0438\u0435\u043C."
  },
  {
    fvg: "Kritik \xFCben an + Dat.",
    verb: "kritisieren",
    fvgSent: "Die Opposition \xFCbte Kritik an der Regierung.",
    verbSents: ["Die Opposition kritisierte die Regierung."],
    why: "Kritik \xFCben AN + Dativ, \u0430 kritisieren \u0431\u0435\u0440\u0451\u0442 \u043F\u0440\u044F\u043C\u043E\u0439 Akkusativ: an der Regierung \u2192 die Regierung. \u041F\u0440\u0435\u0434\u043B\u043E\u0433 \u0436\u0438\u0432\u0451\u0442 \u0432 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438, \u0443 \u043F\u0440\u043E\u0441\u0442\u043E\u0433\u043E \u0433\u043B\u0430\u0433\u043E\u043B\u0430 \u0435\u0433\u043E \u043D\u0435\u0442."
  },
  {
    fvg: "zum Ausdruck bringen",
    verb: "ausdr\xFCcken",
    fvgSent: "In seinem Brief brachte er seinen Dank zum Ausdruck.",
    verbSents: ["In seinem Brief dr\xFCckte er seinen Dank aus."],
    why: "zum Ausdruck bringen = ausdr\xFCcken. ausdr\xFCcken \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439: \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 \u2014 dr\xFCckte \u2026 aus. \u0412 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438 Akkusativ-\u0434\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0442\u0435\u043C \u0436\u0435 (seinen Dank)."
  },
  {
    fvg: "in Frage kommen",
    verb: "m\xF6glich sein",
    fvgSent: "Eine Gehaltserh\xF6hung kommt f\xFCr mich nicht in Frage.",
    verbSents: ["Eine Gehaltserh\xF6hung ist f\xFCr mich nicht m\xF6glich."],
    why: "in Frage kommen = \xAB\u0441\u0442\u043E\u044F\u0442\u044C \u0432\u043E\u043F\u0440\u043E\u0441\u043E\u043C / \u0431\u044B\u0442\u044C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u043C\xBB, \u0441 nicht \u2014 \xAB\u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u043E\xBB. \u0412 Vollverb-\u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0435 \u0441\u043C\u044B\u0441\u043B \u043D\u0435\u0441\u0451\u0442 sein: ist nicht m\xF6glich."
  },
  {
    fvg: "eine Frage stellen",
    verb: "fragen",
    fvgSent: "Ich m\xF6chte Ihnen eine Frage stellen.",
    verbSents: ["Ich m\xF6chte Sie etwas fragen."],
    why: "eine Frage STELLEN = fragen. \u041F\u0430\u0434\u0435\u0436\u0438 \u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F: Frage stellen + Dativ (Ihnen), fragen + Akkusativ (Sie) + \u0447\u0442\u043E \u0438\u043C\u0435\u043D\u043D\u043E (etwas)."
  },
  {
    fvg: "Hilfe leisten",
    verb: "helfen",
    fvgSent: "Die Nachbarn leisteten uns sofort Hilfe.",
    verbSents: ["Die Nachbarn halfen uns sofort."],
    why: "Hilfe LEISTEN = helfen. \u0414\u0430\u0442\u0438\u0432 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u0432 \u043E\u0431\u0435\u0438\u0445 \u0432\u0435\u0440\u0441\u0438\u044F\u0445: uns. Pr\xE4teritum: \u0443 Vollverb \u2014 halfen (Die Nachbarn halfen uns sofort), \u0432 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438 \u2014 leisteten (Funktionsverb \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u0442\u0441\u044F, \u0430 \u043D\u0435 helfen)."
  },
  {
    fvg: "Abschied nehmen von + Dat.",
    verb: "sich verabschieden",
    fvgSent: "Wir nahmen Abschied von unseren Gastgebern.",
    verbSents: ["Wir verabschiedeten uns von unseren Gastgebern."],
    why: "Abschied nehmen VON = sich von \u2026 verabschieden. \u0412\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u0435 \u0435\u0441\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0443 \u043F\u0440\u043E\u0441\u0442\u043E\u0433\u043E \u0433\u043B\u0430\u0433\u043E\u043B\u0430: \u0432 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438 sich \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442, von \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F."
  },
  {
    fvg: "einen Vorschlag machen",
    verb: "vorschlagen",
    fvgSent: "Der Lehrer hat uns einen Vorschlag gemacht.",
    verbSents: ["Der Lehrer hat uns etwas vorgeschlagen."],
    why: "einen Vorschlag MACHEN \u2014 \u0437\u0434\u0435\u0441\u044C \u0443\u0436\u0435 machen (\u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0438\u0437 \xAB\u0432\u0441\u0435\u0433\u0434\u0430 treffen\xBB), = vorschlagen. \u0427\u0442\u043E \u0438\u043C\u0435\u043D\u043D\u043E \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u043E, \u0432 Vollverb-\u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0435 \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F etwas."
  },
  {
    fvg: "einen Antrag stellen",
    verb: "beantragen",
    fvgSent: "Sie hat beim Amt einen Antrag auf Kindergeld gestellt.",
    verbSents: ["Sie hat beim Amt Kindergeld beantragt."],
    why: "einen Antrag STELLEN = beantragen. \u041F\u0440\u0435\u0434\u043B\u043E\u0436\u043D\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430 \xABAntrag AUF + Akk\xBB \u0432 Vollverb-\u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0435 \u0441\u0436\u0438\u043C\u0430\u0435\u0442\u0441\u044F: Kindergeld beantragen."
  },
  {
    fvg: "in Kauf nehmen",
    verb: "akzeptieren",
    fvgSent: "Wir mussten eine Versp\xE4tung von einer Stunde in Kauf nehmen.",
    verbSents: ["Wir mussten eine Versp\xE4tung von einer Stunde akzeptieren."],
    why: "in Kauf nehmen = \xAB\u0441\u043C\u0438\u0440\u0438\u0442\u044C\u0441\u044F, \u043F\u0440\u0438\u043D\u044F\u0442\u044C \u043A\u0430\u043A \u043D\u0435\u0438\u0437\u0431\u0435\u0436\u043D\u043E\u0435\xBB = akzeptieren (\u043E\u0431\u044B\u0447\u043D\u043E \u043E \u043D\u0435\u043F\u0440\u0438\u044F\u0442\u043D\u043E\u043C). \u0414\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F Akkusativ \u0432 \u043E\u0431\u0435\u0438\u0445 \u0432\u0435\u0440\u0441\u0438\u044F\u0445."
  },
  {
    fvg: "sich in Verbindung setzen mit + Dat.",
    verb: "kontaktieren",
    fvgSent: "Setzen Sie sich bitte mit unserem Kundenservice in Verbindung.",
    verbSents: ["Kontaktieren Sie bitte unseren Kundenservice."],
    why: "sich mit \u2026 in Verbindung SETZEN = kontaktieren. \u0417\u0434\u0435\u0441\u044C sich \u041E\u0411\u042F\u0417\u0410\u0422\u0415\u041B\u042C\u041D\u041E (\u0432 \u043E\u0442\u043B\u0438\u0447\u0438\u0435 \u043E\u0442 Abschied nehmen). mit + Dativ \u2192 \u043F\u0440\u044F\u043C\u043E\u0439 Akkusativ \u0443 kontaktieren."
  },
  {
    fvg: "zur Verf\xFCgung stehen",
    verb: "verf\xFCgbar sein",
    fvgSent: "Der Firmenwagen steht Ihnen nur dienstags zur Verf\xFCgung.",
    verbSents: ["Der Firmenwagen ist nur dienstags verf\xFCgbar."],
    why: "zur Verf\xFCgung STEHEN = \xAB\u0431\u044B\u0442\u044C \u0432 \u0440\u0430\u0441\u043F\u043E\u0440\u044F\u0436\u0435\u043D\u0438\u0438\xBB = verf\xFCgbar sein. \u0414\u0430\u0442\u0438\u0432 \u0430\u0434\u0440\u0435\u0441\u0430\u0442\u0430 (Ihnen) \u0432 Vollverb-\u0432\u0435\u0440\u0441\u0438\u0438 \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442 \u2014 \u043E\u043D \u0443\u0436\u0435 \u0432\u0448\u0438\u0442 \u0432 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 verf\xFCgbar."
  },
  {
    fvg: "zur Verf\xFCgung stellen",
    verb: "bereitstellen",
    fvgSent: "Die Firma stellt ihren Mitarbeitern ein Fahrrad zur Verf\xFCgung.",
    verbSents: ["Die Firma stellt ihren Mitarbeitern ein Fahrrad bereit."],
    why: "zur Verf\xFCgung STELLEN = bereitstellen \u2014 \xAB\u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C\xBB. \u041E\u0442\u043B\u0438\u0447\u0430\u0439 \u043E\u0442 zur Verf\xFCgung stehen: \u0442\u043E\u0442, \u043A\u0442\u043E \u0434\u0430\u0451\u0442, \u0441\u0442\u0430\u0432\u0438\u0442 (stellen), \u0442\u043E\u0442, \u043A\u0442\u043E \u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F, \u2014 \u0441\u0442\u043E\u0438\u0442 (stehen)."
  },
  {
    fvg: "zum Stillstand kommen",
    verb: "anhalten",
    fvgSent: "Der Zug kam kurz vor dem Bahnhof zum Stillstand.",
    verbSents: ["Der Zug hielt kurz vor dem Bahnhof an."],
    why: "zum Stillstand KOMMEN = anhalten. kommen \u0437\u0434\u0435\u0441\u044C \u043F\u0443\u0441\u0442\u043E\u0439 \u2014 \u0441\u043C\u044B\u0441\u043B \u0432 Stillstand. anhalten \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439: \u0441\u0438\u043B\u044C\u043D\u043E\u0435 Pr\xE4teritum hielt \u2026 an."
  },
  {
    fvg: "in Betrieb nehmen",
    verb: "er\xF6ffnen",
    fvgSent: "N\xE4chste Woche wird die neue Bahnlinie in Betrieb genommen.",
    verbSents: ["N\xE4chste Woche wird die neue Bahnlinie er\xF6ffnet."],
    why: "in Betrieb NEHMEN = er\xF6ffnen \u2014 \xAB\u0432\u0432\u043E\u0434\u0438\u0442\u044C \u0432 \u044D\u043A\u0441\u043F\u043B\u0443\u0430\u0442\u0430\u0446\u0438\u044E\xBB. \u041E\u0431\u0435 \u0432\u0435\u0440\u0441\u0438\u0438 \u0437\u0434\u0435\u0441\u044C \u0432 Passiv: wird genommen / wird er\xF6ffnet \u2014 \u043B\u0438\u043D\u0438\u044F \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u044D\u0442\u043E \u0441\u0430\u043C\u0430."
  }
];
var MODAL_PARTIKELN = [
  /* --------------------------------------------------------------- denn -- */
  {
    ctx: "Du siehst deinen Nachbarn nach langer Zeit.",
    text: "Hallo, wie geht es dir {0}?",
    answers: ["denn"],
    why: "W-\u0432\u043E\u043F\u0440\u043E\u0441 + \u0438\u043D\u0442\u0435\u0440\u0435\u0441 \u2192 denn. \u0412 W-Fragen \u0438\u0437 \u043D\u0430\u0431\u043E\u0440\u0430 {doch, ja, halt, denn, mal} \u0442\u043E\u043B\u044C\u043A\u043E denn \u0434\u0435\u043B\u0430\u0435\u0442 \u0432\u043E\u043F\u0440\u043E\u0441 \u0436\u0438\u0432\u044B\u043C \u0438 \u0434\u0440\u0443\u0436\u0435\u043B\u044E\u0431\u043D\u044B\u043C. \u0412 \u0443\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0438 denn \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D."
  },
  {
    ctx: "Dein Freund kommt eine Stunde zu sp\xE4t.",
    text: "Wo warst du {0}?",
    answers: ["denn"],
    why: "W-\u0432\u043E\u043F\u0440\u043E\u0441 \u2192 denn: \xAB\u043D\u0443 \u0438 \u0433\u0434\u0435 \u0436\u0435 \u0442\u044B \u0431\u044B\u043B?\xBB. denn \u0432 \u0432\u043E\u043F\u0440\u043E\u0441\u0430\u0445 \u0432\u044B\u0440\u0430\u0436\u0430\u0435\u0442 \u0438\u043D\u0442\u0435\u0440\u0435\u0441, \u0430 \u043D\u0435 \u0443\u043F\u0440\u0451\u043A \u2014 \u0443\u043F\u0440\u0451\u043A \u0441\u043E\u0437\u0434\u0430\u044E\u0442 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u043B\u043E\u0432\u0430."
  },
  {
    ctx: "Ein Kind fragt seine Mutter im Supermarkt.",
    text: "Mama, was kostet das {0}?",
    answers: ["denn"],
    why: "W-\u0432\u043E\u043F\u0440\u043E\u0441 \u2192 denn. \u0420\u0435\u0431\u0451\u043D\u043E\u043A \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u0443\u0435\u0442\u0441\u044F \u0446\u0435\u043D\u043E\u0439: \xAB\u0430 \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0436\u0435 \u044D\u0442\u043E \u0441\u0442\u043E\u0438\u0442?\xBB. \u0414\u0440\u0443\u0433\u0438\u0435 \u0447\u0430\u0441\u0442\u0438\u0446\u044B \u0438\u0437 \u043D\u0430\u0431\u043E\u0440\u0430 \u0432 W-\u0432\u043E\u043F\u0440\u043E\u0441\u0430\u0445 \u043D\u0435 \u0436\u0438\u0432\u0443\u0442."
  },
  {
    ctx: "Du triffst eine Kollegin am Bahnhof mit einem Koffer.",
    text: "Wohin f\xE4hrst du {0}?",
    answers: ["denn"],
    why: "W-\u0432\u043E\u043F\u0440\u043E\u0441 \u2192 denn: \xAB\u0430 \u043A\u0443\u0434\u0430 \u0436\u0435 \u0442\u044B \u0435\u0434\u0435\u0448\u044C?\xBB. \u041E\u0431\u0440\u0430\u0442\u0438\u0442\u0435 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435 \u043D\u0430 \u043C\u0435\u0441\u0442\u043E: \u0447\u0430\u0441\u0442\u0438\u0446\u0430 \u0441\u0442\u043E\u0438\u0442 \u0432 \u0441\u0435\u0440\u0435\u0434\u0438\u043D\u0435, \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u043B\u043E\u0432\u0430 \u0438 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0433\u043E."
  },
  /* --------------------------------------------------------------- doch -- */
  {
    ctx: "Frage von der Freundin: \xABKommst du morgen nicht mit ins Kino?\xBB",
    text: "Doch! Ich komme {0} mit!",
    answers: ["doch"],
    why: "\u041E\u0442\u0432\u0435\u0442 \u043D\u0430 \u041E\u0422\u0420\u0418\u0426\u0410\u0422\u0415\u041B\u042C\u041D\u042B\u0419 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u044D\u0442\u043E \u0432\u043E\u0437\u0440\u0430\u0436\u0435\u043D\u0438\u0435 (\xAB\u043D\u0435\u0442, \u043F\u0440\u0438\u0434\u0443!\xBB), \u0438 \u0437\u0434\u0435\u0441\u044C \u043E\u0434\u043D\u043E\u0437\u043D\u0430\u0447\u043D\u043E doch. ja \u0441\u043E\u0433\u043B\u0430\u0448\u0430\u043B\u043E\u0441\u044C \u0431\u044B \u0441 \u0441\u043E\u0431\u0435\u0441\u0435\u0434\u043D\u0438\u043A\u043E\u043C, \u0430 \u0432\u044B \u0441\u043F\u043E\u0440\u0438\u0442\u0435."
  },
  {
    ctx: "Dein Bruder behauptet, du hast sein Ladekabel genommen.",
    text: "Nein, ich habe {0} mein eigenes Kabel dabei!",
    answers: ["doch"],
    why: "\u0412\u043E\u0437\u0440\u0430\u0436\u0435\u043D\u0438\u0435: \u0441\u043E\u0431\u0435\u0441\u0435\u0434\u043D\u0438\u043A \u0443\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u0442 \u043E\u0434\u043D\u043E, \u0432\u044B \u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0435 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u043B\u043E\u0436\u043D\u043E\u0435 \u2192 doch. \xAB\u0436\u0435 / \u0432\u0435\u0434\u044C\xBB: \xAB\u044F \u0436\u0435 \u0432\u0437\u044F\u043B \u0441\u0432\u043E\u0451!\xBB."
  },
  {
    ctx: "Du willst sichergehen, dass deine Freundin morgen kommt.",
    text: "Du kommst {0} morgen zur Party, oder?",
    answers: ["doch"],
    why: "\u0423\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u0441 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435\u043C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F (\u0432 \u043A\u043E\u043D\u0446\u0435 oder?) \u2192 doch. \u0413\u043E\u0432\u043E\u0440\u044F\u0449\u0438\u0439 \u0443\u0432\u0435\u0440\u0435\u043D, \u043D\u043E \u0445\u043E\u0447\u0435\u0442 \u0443\u0441\u043B\u044B\u0448\u0430\u0442\u044C \xAB\u0434\u0430\xBB. ja \u0437\u0434\u0435\u0441\u044C \u0437\u0432\u0443\u0447\u0430\u043B\u043E \u0431\u044B \u043A\u0430\u043A \u043A\u043E\u043D\u0441\u0442\u0430\u0442\u0430\u0446\u0438\u044F \u0431\u0435\u0437 \u0432\u043E\u043F\u0440\u043E\u0441\u0430."
  },
  /* ---------------------------------------------------------------- mal -- */
  {
    ctx: "Beim Essen: die Flasche steht auf der anderen Seite des Tisches.",
    text: "Reich mir {0} bitte die Flasche.",
    answers: ["mal", "doch"],
    why: "\u0412\u0435\u0436\u043B\u0438\u0432\u0430\u044F \u043F\u0440\u043E\u0441\u044C\u0431\u0430 \u2192 mal: \xAB\u043F\u0435\u0440\u0435\u0434\u0430\u0439-\u043A\u0430 \u043C\u043D\u0435, \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430\xBB. mal \u0441\u043D\u0438\u043C\u0430\u0435\u0442 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0447\u043D\u043E\u0441\u0442\u044C. doch \u0437\u0434\u0435\u0441\u044C \u0442\u043E\u0436\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u2014 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u043B\u0451\u0433\u043A\u043E\u0435 \u043D\u0435\u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435 (\xAB\u0434\u0430 \u043F\u0435\u0440\u0435\u0434\u0430\u0439 \u0436\u0435\xBB). \u0417\u0430\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u043E\u0431\u0435."
  },
  {
    ctx: "Dein Handy klingelt in der Jackentasche.",
    text: "Moment, wartet {0} kurz, ich muss rangehen.",
    answers: ["mal", "doch"],
    why: "\u0412\u0435\u0436\u043B\u0438\u0432\u0430\u044F \u043F\u0440\u043E\u0441\u044C\u0431\u0430 \u2192 mal: \xAB\u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435-\u043A\u0430\xBB. \u0427\u0430\u0441\u0442\u0438\u0446\u0430 \u0441\u0442\u043E\u0438\u0442 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0433\u043B\u0430\u0433\u043E\u043B\u0430-\u0438\u043C\u043F\u0435\u0440\u0430\u0442\u0438\u0432\u0430. kurz \u0443\u0441\u0438\u043B\u0438\u0432\u0430\u0435\u0442 \xAB\u043D\u0430 \u043C\u0438\u043D\u0443\u0442\u043A\u0443\xBB."
  },
  /* --------------------------------------------------------------- halt -- */
  {
    ctx: "Der Bus ist weg, der n\xE4chste f\xE4hrt erst in drei\xDFig Minuten.",
    text: "Dann m\xFCssen wir {0} warten.",
    answers: ["halt"],
    why: "\u0421\u043C\u0438\u0440\u0435\u043D\u0438\u0435, \xAB\u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u043E\u0434\u0435\u043B\u0430\u0435\u0448\u044C\xBB \u2192 halt: \xAB\u043D\u0443, \u043F\u0440\u0438\u0434\u0451\u0442\u0441\u044F \u0443\u0436 \u043F\u043E\u0434\u043E\u0436\u0434\u0430\u0442\u044C\xBB. \u0422\u043E \u0436\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0443 eben \u2014 \u043E\u0431\u0430 \u0432\u0435\u0440\u043D\u044B \u043F\u043E \u0434\u0443\u0445\u0443, \u0432 \u043D\u0430\u0431\u043E\u0440\u0435 \u044D\u043A\u0437\u0430\u043C\u0435\u043D\u0430 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u044E\u0442 halt."
  },
  {
    ctx: "F\xFCr viele Jobs in Deutschland braucht man Deutsch.",
    text: "Man muss {0} damit leben, dass alles auf Deutsch ist.",
    answers: ["halt"],
    why: "halt \u2014 \u043A\u043E\u043D\u0441\u0442\u0430\u0442\u0430\u0446\u0438\u044F \u0444\u0430\u043A\u0442\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043D\u0435\u043B\u044C\u0437\u044F \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C: \xAB\u043D\u0443, \u043F\u0440\u0438\u0434\u0451\u0442\u0441\u044F \u0443\u0436 \u0441 \u044D\u0442\u0438\u043C \u0436\u0438\u0442\u044C\xBB. \u0424\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u043E\u0432\u043A\u0430 \xABdamit leben\xBB \u0437\u0430\u043A\u0440\u0435\u043F\u043B\u0435\u043D\u0430 \u0437\u0430 \u0441\u043C\u0438\u0440\u0435\u043D\u0438\u0435\u043C, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0437\u0434\u0435\u0441\u044C halt \u043E\u0434\u043D\u043E\u0437\u043D\u0430\u0447\u0435\u043D; ja \u0432\u044B\u0440\u0430\u0437\u0438\u043B \u0431\u044B \u0432\u043E\u0437\u0440\u0430\u0436\u0435\u043D\u0438\u0435, doch \u2014 \u0441\u043F\u043E\u0440, halt \u2014 \xAB\u0442\u0430\u043A \u0443\u0436 \u0443\u0441\u0442\u0440\u043E\u0435\u043D\u043E\xBB."
  },
  /* ---------------------------------------------------------------- ja --- */
  {
    ctx: "Dein Freund erkl\xE4rt die Regel noch einmal, und jetzt verstehst du sie.",
    text: "Du hast {0} recht, so ist es viel einfacher!",
    answers: ["ja", "doch"],
    why: "\u0417\u0434\u0435\u0441\u044C \u0447\u0435\u0441\u0442\u043D\u043E \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B \u043E\u0431\u0435: ja \u2014 \xAB\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E, \u043A\u0430\u043A \u044F \u0442\u0435\u043F\u0435\u0440\u044C \u0432\u0438\u0436\u0443\xBB (\u043F\u0440\u0438\u0437\u043D\u0430\u043D\u0438\u0435 \u043E\u0431\u0449\u0435\u0433\u043E \u0444\u0430\u043A\u0442\u0430), doch \u2014 \xAB\u0430 \u0432\u0435\u0434\u044C \u0442\u044B \u043F\u0440\u0430\u0432\xBB (\u043E\u0442\u043A\u0430\u0437 \u043E\u0442 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u043F\u0440\u0435\u0436\u043D\u0435\u0433\u043E \u043C\u043D\u0435\u043D\u0438\u044F). \u0420\u0430\u0437\u043D\u0438\u0446\u0430 \u0432 \u0442\u043E\u043D\u0435, \u043D\u0435 \u0432 \u0441\u043C\u044B\u0441\u043B\u0435 \u2014 \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u044E\u0442\u0441\u044F \u043E\u0431\u0435 \u0447\u0430\u0441\u0442\u0438\u0446\u044B."
  }
];
var pick3 = (xs) => xs[Math.floor(Math.random() * xs.length)];
function nominalisierung() {
  const f = pick3(NOM_PAIRS);
  const toVerb = Math.random() < 0.5;
  return toVerb ? {
    topic: "b2-nominalisierung",
    task: "Forme den Satz in den Verbalstil um. Nominalstil \u2192 Verbalstil: \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u0432\u043C\u0435\u0441\u0442\u043E \xAB\u043F\u0440\u0435\u0434\u043B\u043E\u0433 + Nomen\xBB.",
    text: `${f.nom}
{0}`,
    gaps: [f.verb],
    why: f.why
  } : {
    topic: "b2-nominalisierung",
    task: "Forme den Satz in den Nominalstil um. Verbalstil \u2192 Nominalstil: \xAB\u043F\u0440\u0435\u0434\u043B\u043E\u0433 + Nomen\xBB \u0432\u043C\u0435\u0441\u0442\u043E \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E.",
    text: `${f.verb[0]}
{0}`,
    gaps: [[f.nom]],
    why: f.why + " Nominalstil \u043B\u044E\u0431\u0438\u0442 \u043F\u0438\u0441\u044C\u043C\u0435\u043D\u043D\u044B\u0439 \u043D\u0435\u043C\u0435\u0446\u043A\u0438\u0439: \u0433\u0430\u0437\u0435\u0442\u0430, \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E, \u043D\u0430\u0443\u0447\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442."
  };
}
function funktionsverb() {
  const f = pick3(FVG_PAIRS);
  const toVollverb = Math.random() < 0.5;
  return toVollverb ? {
    topic: "b2-funktionsverb",
    task: `Ersetze das Funktionsverbgef\xFCge durch das Vollverb \xAB${f.verb}\xBB. \u0421\u043C\u044B\u0441\u043B \u2014 \u0432 Nomen, \u0433\u043B\u0430\u0433\u043E\u043B-\u043F\u0443\u0441\u0442\u044B\u0448\u043A\u0430 \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442.`,
    text: `${f.fvgSent}
{0}`,
    hint: `(${f.verb})`,
    gaps: [f.verbSents],
    why: f.why
  } : {
    topic: "b2-funktionsverb",
    task: `Ersetze das Vollverb \xAB${f.verb}\xBB durch das Funktionsverbgef\xFCge. Nomen + \u0433\u043B\u0430\u0433\u043E\u043B-\u043F\u0443\u0441\u0442\u044B\u0448\u043A\u0430 (+ \u043F\u0440\u0435\u0434\u043B\u043E\u0433).`,
    text: `${f.verbSents[0]}
{0}`,
    hint: `(${f.fvg})`,
    gaps: [[f.fvgSent]],
    why: f.why + " \u041E\u0431\u0440\u0430\u0442\u043D\u043E: \u0441\u043C\u044B\u0441\u043B\u043E\u0432\u043E\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u0440\u0430\u0437\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0432 Nomen, \u0440\u044F\u0434\u043E\u043C \u0432\u0441\u0442\u0430\u0451\u0442 \u0435\u0433\u043E Funktionsverb."
  };
}
function modalpartikeln() {
  const f = pick3(MODAL_PARTIKELN);
  return {
    topic: "b2-modalpartikeln",
    task: "Setze die passende Modalpartikel ein: doch, ja, halt, denn oder mal.",
    text: `${f.ctx}
${f.text}`,
    gaps: [f.answers],
    why: f.why
  };
}

// src/lib/de/b2praep.ts
var ERSETZ_PAARE = [
  /* warten auf + Akk (VERBEN_PRAEP) */
  {
    full: "Ich warte auf den Bus.",
    answer: "Ich warte darauf.",
    why: "warten auf + Akkusativ \u2192 worauf/darauf. \xABDen Bus\xBB \u2014 \u043F\u0440\u0435\u0434\u043C\u0435\u0442, \xAB\u043F\u0440\u0435\u0434\u043B\u043E\u0433 + \u043F\u0440\u0435\u0434\u043C\u0435\u0442\xBB \u0437\u0430\u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u043E\u0434\u043D\u0438\u043C \u0441\u043B\u043E\u0432\u043E\u043C: darauf."
  },
  /* sich freuen auf + Akk */
  {
    full: "Er freut sich auf den Urlaub.",
    answer: "Er freut sich darauf.",
    why: "sich freuen auf \u2014 \u043F\u0440\u0435\u0434\u0432\u043A\u0443\u0448\u0435\u043D\u0438\u0435 (\u043E\u0442\u043F\u0443\u0441\u043A \u0435\u0449\u0451 \u043D\u0435 \u0431\u044B\u043B). \u041D\u0430 \u0432\u043E\u043F\u0440\u043E\u0441 Worauf? \u043E\u0442\u0432\u0435\u0447\u0430\u044E\u0442 darauf."
  },
  /* sich freuen über + Akk */
  {
    full: "Sie freut sich \xFCber das Geschenk.",
    answer: "Sie freut sich dar\xFCber.",
    why: "sich freuen \xFCber \u2014 \u0440\u0430\u0434\u043E\u0441\u0442\u044C \u0443\u0436\u0435 \u0441\u043B\u0443\u0447\u0438\u0432\u0448\u0435\u043C\u0443\u0441\u044F (\u043F\u043E\u0434\u0430\u0440\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0435\u043D) \u2192 dar\xFCber. \u041F\u0440\u0435\u0434\u043B\u043E\u0433 \u0431\u0435\u0440\u0451\u0442\u0441\u044F \u043E\u0442 \u0433\u043B\u0430\u0433\u043E\u043B\u0430, \u043D\u0435 \u043E\u0442 \u0432\u043A\u0443\u0441\u0430."
  },
  /* sich interessieren für + Akk */
  {
    full: "Wir interessieren uns f\xFCr die Geschichte Deutschlands.",
    answer: "Wir interessieren uns daf\xFCr.",
    why: "sich interessieren f\xFCr + Akkusativ \u2192 wof\xFCr/daf\xFCr."
  },
  /* sich ärgern über + Akk */
  {
    full: "Er \xE4rgert sich \xFCber den L\xE4rm.",
    answer: "Er \xE4rgert sich dar\xFCber.",
    why: "sich \xE4rgern \xFCber + Akkusativ \u2192 dar\xFCber."
  },
  /* denken an + Akk */
  {
    full: "Ich denke oft an meine Kindheit.",
    answer: "Ich denke oft daran.",
    why: "denken an + Akkusativ \u2192 woran/daran."
  },
  /* sich erinnern an + Akk */
  {
    full: "Ich erinnere mich an den Namen.",
    answer: "Ich erinnere mich daran.",
    why: "sich erinnern an + Akkusativ \u2192 daran."
  },
  /* teilnehmen an + Dat, отделяемая приставка остаётся в конце */
  {
    full: "Sie nimmt an dem Kurs teil.",
    answer: "Sie nimmt daran teil.",
    why: "teilnehmen an + Dativ \u2192 daran. \u041E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \xABteil\xBB \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u043A\u043E\u043D\u0446\u0435: nimmt daran teil."
  },
  /* sich gewöhnen an + Akk */
  {
    full: "Ich gew\xF6hne mich an das kalte Wetter.",
    answer: "Ich gew\xF6hne mich daran.",
    why: "sich gew\xF6hnen an + Akkusativ \u2192 daran."
  },
  /* sich unterhalten über + Akk */
  {
    full: "Wir unterhalten uns \xFCber den Urlaub.",
    answer: "Wir unterhalten uns dar\xFCber.",
    why: "sich unterhalten \xFCber + Akkusativ \u2192 dar\xFCber."
  },
  /* sich bewerben um + Akk */
  {
    full: "Sie bewirbt sich um eine Stelle als Lehrerin.",
    answer: "Sie bewirbt sich darum.",
    why: "sich bewerben um + Akkusativ \u2192 worum/darum."
  },
  /* Angst haben vor + Dat */
  {
    full: "Ich habe Angst vor Hunden.",
    answer: "Ich habe Angst davor.",
    why: "Angst haben vor + Dativ \u2192 wovor/davor. \u0421\u043E\u0431\u0430\u043A\u0438 \u0437\u0434\u0435\u0441\u044C \xAB\u043F\u0440\u0435\u0434\u043C\u0435\u0442\xBB \u0441\u0442\u0440\u0430\u0445\u0430 \u2014 \u0437\u0430\u043C\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430."
  },
  /* abhängen von + Dat, отделяемая приставка остаётся в конце */
  {
    full: "Das h\xE4ngt von der Tagesform ab.",
    answer: "Das h\xE4ngt davon ab.",
    why: "abh\xE4ngen von + Dativ \u2192 davon. \xABab\xBB \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u0438 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u043A\u043E\u043D\u0446\u0435: h\xE4ngt davon ab."
  },
  /* fragen nach + Dat */
  {
    full: "Sie fragt nach dem Weg.",
    answer: "Sie fragt danach.",
    why: "fragen nach + Dativ \u2192 wonach/danach."
  },
  /* es handelt sich um + Akk */
  {
    full: "Es handelt sich um ein wichtiges Problem.",
    answer: "Es handelt sich darum.",
    why: "es handelt sich um + Akkusativ \u2192 darum."
  },
  /* sich verlassen auf + Akk */
  {
    full: "Ich verlasse mich auf deinen Plan.",
    answer: "Ich verlasse mich darauf.",
    why: "sich verlassen auf + Akkusativ \u2192 darauf. \u041E\u0431\u044A\u0435\u043A\u0442 \u2014 \u043F\u043B\u0430\u043D (\u043F\u0440\u0435\u0434\u043C\u0435\u0442), \u0437\u0430\u043C\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430."
  }
  /* НЕ переведены из VERBEN_PRAEP: sich kümmern um unsere Großeltern и
     sich entschuldigen bei seiner Lehrerin — объект одушевлённый, pronominal
     adverb на людей не работает (см. шапку файла). */
];
var FRAGE_FRAMES = [
  {
    frage: "Worauf freust du dich?",
    text: "\u2014 {0}, dass der Urlaub endlich beginnt.",
    answer: "Darauf",
    why: "\u0412\u043E\u043F\u0440\u043E\u0441 \u0441 Worauf \u0437\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043B \u043F\u0440\u0435\u0434\u043B\u043E\u0433 auf \u2192 \u043E\u0442\u0432\u0435\u0442 Darauf. \u041F\u0440\u0435\u0434\u043C\u0435\u0442 (\u043D\u0430\u0447\u0430\u043B\u043E \u043E\u0442\u043F\u0443\u0441\u043A\u0430) \u043D\u0435\u043E\u0434\u0443\u0448\u0435\u0432\u043B\u0451\u043D\u043D\u044B\u0439, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 pronominal adverb \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D."
  },
  {
    frage: "Wor\xFCber \xE4rgerst du dich?",
    text: "\u2014 {0}, dass der Bus schon wieder zu sp\xE4t kam.",
    answer: "Dar\xFCber",
    why: "Wor\xFCber \u2192 dar\xFCber: sich \xE4rgern \xFCber. \u0412\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0441\u043B\u043E\u0432\u043E \u0443\u0436\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u043F\u0440\u0435\u0434\u043B\u043E\u0433, \u0432 \u043E\u0442\u0432\u0435\u0442\u0435 \u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E wo- \u043D\u0430 da-."
  },
  {
    frage: "Woran denkst du gerade?",
    text: "\u2014 {0}, dass ich morgen meine Eltern besuche.",
    answer: "Daran",
    why: "Woran \u2192 daran: denken an. \u041E \u043B\u044E\u0434\u044F\u0445 \u0442\u0430\u043A \u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u043D\u0435\u043B\u044C\u0437\u044F (\xABAn wen denkst du? \u2013 An meinen Vater\xBB), \u0437\u0434\u0435\u0441\u044C \u043C\u044B\u0441\u043B\u044C \u043E \u0441\u043E\u0431\u044B\u0442\u0438\u0438 \u2014 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043D\u043E\u043C."
  },
  {
    frage: "Wof\xFCr interessierst du dich?",
    text: "\u2014 {0}, dass mehr Menschen mit dem Rad fahren.",
    answer: "Daf\xFCr",
    why: "Wof\xFCr \u2192 daf\xFCr: sich interessieren f\xFCr. \u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u0430 \u2014 \u0444\u0430\u043A\u0442 (\u0447\u0442\u043E \u0431\u043E\u043B\u044C\u0448\u0435 \u043B\u044E\u0434\u0435\u0439 \u0435\u0437\u0434\u044F\u0442 \u043D\u0430 \u0432\u0435\u043B\u043E\u0441\u0438\u043F\u0435\u0434\u0435), \u043D\u0435 \u0447\u0435\u043B\u043E\u0432\u0435\u043A."
  },
  {
    frage: "Wovor hast du am meisten Angst?",
    text: "\u2014 {0}, dass ich die Pr\xFCfung nicht bestehe.",
    answer: "Davor",
    why: "Wovor \u2192 davor: Angst haben vor. \u0421\u0442\u0440\u0430\u0445 \u043F\u0435\u0440\u0435\u0434 \u0441\u043E\u0431\u044B\u0442\u0438\u0435\u043C (\u043D\u0435 \u0441\u0434\u0430\u043C \u044D\u043A\u0437\u0430\u043C\u0435\u043D) \u2014 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043D\u044B\u0439, \u0437\u0430\u043C\u0435\u043D\u0430 \u0447\u0435\u0441\u0442\u043D\u0430\u044F."
  },
  {
    frage: "Worum bewirbst du dich?",
    text: "\u2014 {0}, dass ich im Kinderheim arbeiten kann.",
    answer: "Darum",
    why: "Worum \u2192 darum: sich bewerben um. \u0420\u0435\u0447\u044C \u043E \u043C\u0435\u0441\u0442\u0435 (\u043F\u0440\u0435\u0434\u043C\u0435\u0442), \u043F\u043E\u044D\u0442\u043E\u043C\u0443 pronominal adverb \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D; \u043E \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0435 \u0431\u044B\u043B\u043E \u0431\u044B \xABUm wen?\xBB \u2014 \u0438 \u0442\u043E\u0433\u0434\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u0435\u0434\u043B\u043E\u0433 + \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u0435."
  }
];
var RELATIV_B2_KOMPLEX = [
  /* Genitiv: «чей профессор» — притяжание + объект следующей клаузы */
  {
    text: "Der Student, {0} Professor ich gut kenne, hat ein Stipendium bekommen.",
    a: "dessen",
    why: "\xAB\u0427\u0435\u0439 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u043E\u0440?\xBB \u2014 \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u043D\u043E\u0441\u0442\u044C \u2192 Genitiv; \u0441\u0442\u0443\u0434\u0435\u043D\u0442 \u2014 \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434 \u2192 dessen. \u0412\u0441\u044F \u0433\u0440\u0443\u043F\u043F\u0430 \xABdessen Professor\xBB \u2014 \u0434\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 (kennen + Akkusativ), \u043D\u043E \u0444\u043E\u0440\u043C\u0443 \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u0451\u0442 \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u043D\u043E\u0441\u0442\u044C, \u0430 \u043D\u0435 \u044D\u0442\u0430 \u0440\u043E\u043B\u044C."
  },
  /* Genitiv: женский род */
  {
    text: "Die Journalistin, {0} Artikel in vielen Zeitungen erscheinen, arbeitet freiberuflich.",
    a: "deren",
    why: "\xAB\u0427\u044C\u0438 \u0441\u0442\u0430\u0442\u044C\u0438?\xBB \u2014 Genitiv \u0436\u0435\u043D\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430 \u2192 deren; Artikel (Plural) \u2014 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E (erscheinen)."
  },
  /* Genitiv после предлога */
  {
    text: "Der Autor, {0} Romanen die Stadt Berlin immer wieder vorkommt, liest morgen in der Stadtb\xFCcherei.",
    a: "in dessen",
    why: "vorkommen \u0442\u0440\u0435\u0431\u0443\u0435\u0442 in, \u043D\u043E \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u0435 \u043F\u0440\u0438 \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u043D\u043E\u0441\u0442\u0438 \u0441\u0442\u043E\u0438\u0442 \u0432 Genitiv: in dessen Romanen (\xAB\u0432 \u0435\u0433\u043E \u0440\u043E\u043C\u0430\u043D\u0430\u0445\xBB). \u0410\u0432\u0442\u043E\u0440 \u2014 \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434 \u2192 dessen; \u043F\u0440\u0435\u0434\u043B\u043E\u0433 \u0436\u0438\u0432\u0451\u0442 \u0432\u043D\u0443\u0442\u0440\u0438 \u0434\u044B\u0440\u043A\u0438, \u043A\u0430\u043A \u0438 \u0432 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445 \u043A\u0430\u0434\u0440\u0430\u0445 RELATIV."
  },
  /* вложенное: внутреннее местоимение — Akkusativ среднего рода */
  {
    text: "Die Frau, die das Auto, {0} sie zwanzig Jahre gefahren hat, verkauft, zieht nach Hamburg.",
    a: "das",
    why: "\u0414\u044B\u0440\u043A\u0430 \u2014 \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u0435 \u043A \xABdas Auto\xBB \u0432\u043E \u0412\u041D\u0423\u0422\u0420\u0415\u041D\u041D\u0415\u041C \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C: sie hat das Auto gefahren \u2192 Akkusativ, \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434 \u2192 das. \u0412\u043D\u0435\u0448\u043D\u0435\u0435 \xABdie\xBB (\u043A Frau) \u0443\u0436\u0435 \u0441\u0442\u043E\u0438\u0442 \u0432 \u0442\u0435\u043A\u0441\u0442\u0435 \u0438 \u043D\u0430 \u043E\u0442\u0432\u0435\u0442 \u043D\u0435 \u0432\u043B\u0438\u044F\u0435\u0442."
  },
  /* вложенное: внутреннее — Nominativ среднего рода в Passiv */
  {
    text: "Der Architekt, der das Museum, {0} n\xE4chstes Jahr er\xF6ffnet wird, geplant hat, bekommt einen Preis.",
    a: "das",
    why: "\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0435\u0435 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u2014 Passiv: \xABdas Museum wird er\xF6ffnet\xBB \u2192 Museum \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C \u2192 Nominativ \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0440\u043E\u0434\u0430 das. \u0412\u043D\u0435\u0448\u043D\u0435\u0435 \xABder\xBB \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043A Architekt."
  },
  /* вложенное: внутреннее — Dativ мужского рода в Passiv */
  {
    text: "Die Nachbarin, die dem M\xE4dchen, {0} der Ball weggenommen wurde, geholfen hat, ruft die Polizei.",
    a: "dem",
    why: "\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0435\u0435 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u2014 Passiv \u0441 Dativ-\u043E\u0431\u044A\u0435\u043A\u0442\u043E\u043C: \xAB\u043A\u043E\u043C\u0443 \u043E\u0442\u043D\u044F\u043B\u0438 \u043C\u044F\u0447?\xBB \u2192 Dativ \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0440\u043E\u0434\u0430 dem. \u042D\u0442\u043E \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u0438\u0442 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0435\u043C\u0443 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C\u0443, \u043F\u043E\u043C\u043E\u0433\u0430\u0442\u044C (helfen + Dativ) \u0437\u0434\u0435\u0441\u044C \u0443\u0436\u0435 \xABdie Nachbarin\xBB."
  },
  /* вложенное: внутреннее — um + Akkusativ среднего рода */
  {
    text: "Die Studentin, die das Stipendium, um {0} sie sich beworben hatte, endlich bekommen hat, studiert jetzt in T\xFCbingen.",
    a: "das",
    why: "\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0439 \u043E\u0431\u043E\u0440\u043E\u0442: sich bewerben um + Akkusativ; Stipendium \u2014 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434 \u2192 um das. Plusquamperfekt (hatte) \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442: \u0437\u0430\u044F\u0432\u043A\u0430 \u0431\u044B\u043B\u0430 \u0440\u0430\u043D\u044C\u0448\u0435, \u0447\u0435\u043C \u0441\u0442\u0438\u043F\u0435\u043D\u0434\u0438\u044E \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u0438."
  },
  /* вложенное: внутреннее — Akkusativ женского рода */
  {
    text: "Die Kollegin, die die Pr\xE4sentation, {0} der Chef morgen braucht, schon vorbereitet hat, bleibt heute l\xE4nger im B\xFCro.",
    a: "die",
    why: "\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0435\u0435 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435: brauchen + Akkusativ; Pr\xE4sentation \u2014 \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434, \u0430 \u0432 Akkusativ \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 Nominativ \u2192 die. \u0412\u043D\u0435\u0448\u043D\u0435\u0435 \xABdie\xBB \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442\u043E Kollegin."
  }
];
var pick4 = (xs) => xs[Math.floor(Math.random() * xs.length)];
function praepadvErsetzen() {
  const f = pick4(ERSETZ_PAARE);
  return {
    topic: "b2-praepositionaladverbien",
    task: "Ersetze \xABPr\xE4position + Nomen\xBB durch ein Pronominaladverb (da(r) + Pr\xE4position).",
    text: `${f.full}
{0}`,
    gaps: [[f.answer]],
    why: f.why
  };
}
function praepadvFrage() {
  const f = pick4(FRAGE_FRAMES);
  return {
    topic: "b2-praepositionaladverbien",
    task: "Antworte mit dem Pronominaladverb (da(r) + Pr\xE4position).",
    text: `${f.frage}
${f.text}`,
    gaps: [[f.answer]],
    why: f.why
  };
}
FRAGE_FRAMES.push(...FRAGE_FRAMES_EXTRA);
function pronominaladverbien() {
  return Math.random() < 0.5 ? praepadvErsetzen() : praepadvFrage();
}

// src/lib/de/c1a.ts
var K1_FRAMES = [
  /* --- 3. Person Singular: собственная форма, ответ один ------------------- */
  {
    text: "Er sagte, er {0} krank.",
    a: ["sei"],
    hint: "(sein)",
    why: "Konjunktiv I von sein, 3. Person Singular: er sei. \u041A\u043E\u0441\u0432\u0435\u043D\u043D\u0430\u044F \u0440\u0435\u0447\u044C \u2014 \u0433\u043B\u0430\u0432\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430 KI."
  },
  {
    text: "Sie berichtete, der Zug {0} Versp\xE4tung.",
    a: ["habe"],
    hint: "(haben)",
    why: "Konjunktiv I: er habe. \u0412\u0441\u043F\u043E\u043C\u043E\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B Perfekt \u0432 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u043E\u0439 \u0440\u0435\u0447\u0438 \u0442\u043E\u0436\u0435 \u0438\u0434\u0451\u0442 \u0432 KI: er habe Versp\xE4tung gehabt."
  },
  {
    text: "Der Patient sagte, er {0} seit Tagen nicht schlafen.",
    a: ["k\xF6nne"],
    hint: "(k\xF6nnen)",
    why: "k\xF6nnen \u2192 k\xF6nne. Indikativ \xABkann\xBB \u0441\u043E\u043E\u0431\u0449\u0430\u043B \u0431\u044B \u043F\u0440\u043E\u0441\u0442\u043E \u0444\u0430\u043A\u0442; KI \u043F\u043E\u043C\u0435\u0447\u0430\u0435\u0442 \u0441\u043B\u043E\u0432\u0430 \u043A\u0430\u043A \u0447\u0443\u0436\u0438\u0435."
  },
  {
    text: "Sie schrieb, sie {0} das Paket morgen schicken.",
    a: ["werde"],
    hint: "(werden)",
    why: "werden \u2192 werde. \u0411\u0443\u0434\u0443\u0449\u0435\u0435 \u0432 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u043E\u0439 \u0440\u0435\u0447\u0438: er werde morgen schicken."
  },
  {
    text: "Er behauptete, er {0} die Antwort nicht.",
    a: ["wisse"],
    hint: "(wissen)",
    why: "wissen \u2192 wisse. KI \u043D\u0435 \u043C\u0435\u043D\u044F\u0435\u0442 \u043A\u043E\u0440\u043D\u0435\u0432\u0443\u044E \u0433\u043B\u0430\u0441\u043D\u0443\u044E: \u043E\u0441\u043D\u043E\u0432\u0430 Pr\xE4sens + -e."
  },
  {
    text: "Die Mutter sagte, der Junge {0} nicht allein schwimmen gehen.",
    a: ["d\xFCrfe"],
    hint: "(d\xFCrfen)",
    why: "d\xFCrfen \u2192 d\xFCrfe. \u041C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0435 \u0433\u043B\u0430\u0433\u043E\u043B\u044B \u0438\u043C\u0435\u044E\u0442 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u0443\u044E \u0444\u043E\u0440\u043C\u0443 KI \u0438\u043C\u0435\u043D\u043D\u043E \u0432 3. Person Singular."
  },
  {
    text: "Er sagte, er {0} am Montag noch einmal anrufen.",
    a: ["m\xFCsse"],
    hint: "(m\xFCssen)",
    why: "m\xFCssen \u2192 m\xFCsse. \u0424\u043E\u0440\u043C\u0430 = \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u043D\u044B\u0439 \u0441\u0442\u0435\u043C m\xFCss- + -e (\u043A\u0430\u043A kann \u2192 k\xF6nne), \u0430 \u043D\u0435 \u043E\u0441\u043D\u043E\u0432\u0430 Indikativ."
  },
  {
    text: "Sie versicherte, sie {0} alle Unterlagen gelesen.",
    a: ["habe"],
    hint: "(haben)",
    why: "Perfekt \u0432 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u043E\u0439 \u0440\u0435\u0447\u0438: habe + Partizip II. KI \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u0442\u0441\u044F, Partizip \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u043A\u043E\u043D\u0446\u0435."
  },
  {
    text: "Der Minister versicherte, die Lage {0} unter Kontrolle.",
    a: ["sei"],
    hint: "(sein)",
    why: "er sei \u2014 \u043A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0444\u043E\u0440\u043C\u0443\u043B\u0430 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439: \xABDie Lage sei unter Kontrolle\xBB."
  },
  {
    text: "Die Journalistin schrieb, die Firma {0} neue Mitarbeiter.",
    a: ["suche"],
    hint: "(suchen)",
    why: "\u0414\u0430\u0436\u0435 \u0441\u043B\u0430\u0431\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u0432 3. Person Singular \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F: suche (Pr\xE4sens: sucht). \u0413\u0430\u0437\u0435\u0442\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C: die Firma suche \u2026"
  },
  {
    text: "Er erkl\xE4rte, das Thema {0} ihn nicht.",
    a: ["interessiere"],
    hint: "(interessieren)",
    why: "interessieren \u2192 interessiere: \u043E\u0441\u043D\u043E\u0432\u0430 + -e. \u0415\u0449\u0451 \u043E\u0434\u043D\u0430 \u0433\u0430\u0437\u0435\u0442\u043D\u0430\u044F \u0444\u043E\u0440\u043C\u0443\u043B\u0430 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u043E\u0439 \u0440\u0435\u0447\u0438."
  },
  /* --- Мн. число: честная двусмысленность, оба варианта в ответе ----------- */
  {
    text: "Die Zeugen sagten, sie {0} nichts gesehen.",
    a: ["h\xE4tten", "haben"],
    hint: "(haben, Plural)",
    why: "\u0412 3-\u043C \u043B\u0438\u0446\u0435 \u043C\u043D. \u0447. KI (haben) \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 Pr\xE4sens \u0438 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u043E\u043C\u0435\u0447\u0430\u0435\u0442. \u041F\u043E\u044D\u0442\u043E\u043C\u0443 \u0436\u0438\u0432\u0451\u0442 KII: h\xE4tten \u2014 \u0435\u0433\u043E \u0444\u043E\u0440\u043C\u0430 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 Pr\xE4teritum. \u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442 \u2014 h\xE4tten."
  },
  {
    text: "Die Nachbarn sagten, sie {0} mit dem L\xE4rm unzufrieden.",
    a: ["seien", "w\xE4ren"],
    hint: "(sein, Plural)",
    why: "sein \u2014 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B, \u0443 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E KI \u0438 \u0432\u043E \u043C\u043D. \u0447. \u0441\u0432\u043E\u0439: sie seien. w\xE4ren (KII) \u0442\u043E\u0436\u0435 \u0432\u0435\u0440\u043D\u043E; \u0444\u043E\u0440\u043C\u0430 seien \u043A\u043E\u0440\u043E\u0447\u0435 \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u0435\u0435."
  },
  {
    text: "Sie sagten, die Preise {0} stark.",
    a: ["stiegen", "steigen"],
    hint: "(steigen, Plural)",
    why: "steigen \u2014 \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B: KI \u0432\u043E \u043C\u043D. \u0447. (steigen) \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 Pr\xE4sens, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0432 \u043E\u0442\u0447\u0451\u0442\u0435 \u0436\u0438\u0432\u0451\u0442 stiegen \u2014 \u0444\u043E\u0440\u043C\u0430 KII, \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0449\u0430\u044F \u0441 Pr\xE4teritum. \u041E\u0442\u0441\u044E\u0434\u0430 \u0438 \u0432\u043F\u0435\u0447\u0430\u0442\u043B\u0435\u043D\u0438\u0435, \u0447\u0442\u043E \xABKI Plural = Pr\xE4teritum\xBB: \u0434\u043B\u044F \u0441\u0438\u043B\u044C\u043D\u044B\u0445 \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u0432 \u0432\u043E \u043C\u043D. \u0447. \u044D\u0442\u043E \u0442\u0430\u043A. \u0417\u0430\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u043E\u0431\u0430."
  }
];
var K1_CARDS = [
  { inf: "sein", pr3: "ist", form: "sei", why: "sein \u2014 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u0441 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u043C KI \u043F\u043E\u0447\u0442\u0438 \u0432\u043E \u0432\u0441\u0435\u0445 \u043B\u0438\u0446\u0430\u0445: ich sei, er sei, wir seien, sie seien." },
  { inf: "haben", pr3: "hat", form: "habe", why: "haben \u2192 er habe. \u041E\u0441\u043D\u043E\u0432\u0430 + -e." },
  { inf: "k\xF6nnen", pr3: "kann", form: "k\xF6nne", why: "k\xF6nnen \u2192 er k\xF6nne. \u0423 \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0445 \u0444\u043E\u0440\u043C\u0430 KI \u0435\u0441\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0437\u0434\u0435\u0441\u044C." },
  { inf: "m\xFCssen", pr3: "muss", form: "m\xFCsse", why: "m\xFCssen \u2192 er m\xFCsse." },
  { inf: "d\xFCrfen", pr3: "darf", form: "d\xFCrfe", why: "d\xFCrfen \u2192 er d\xFCrfe." },
  { inf: "sollen", pr3: "soll", form: "solle", why: "sollen \u2192 er solle." },
  { inf: "wollen", pr3: "will", form: "wolle", why: "wollen \u2192 er wolle. \u041D\u0435 \xABwill\xBB \u2014 Indikativ \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0442\u044C \u043D\u0435 \u0434\u043E\u043B\u0436\u0435\u043D." },
  { inf: "werden", pr3: "wird", form: "werde", why: "werden \u2192 er werde." },
  { inf: "wissen", pr3: "wei\xDF", form: "wisse", why: "wissen \u2192 er wisse. \u0413\u043B\u0430\u0441\u043D\u0430\u044F \u043D\u0435 \u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F: \u043D\u0435 \xABw\xFCsste\xBB (\u044D\u0442\u043E KII)." },
  { inf: "kommen", pr3: "kommt", form: "komme", why: "kommen \u2192 er komme. KI \u043D\u0435 \u043C\u0435\u043D\u044F\u0435\u0442 \u0433\u043B\u0430\u0441\u043D\u0443\u044E: \u043D\u0435 \xABk\xE4me\xBB (\u044D\u0442\u043E KII)." },
  { inf: "geben", pr3: "gibt", form: "gebe", why: "geben \u2192 er gebe. \u0421\u043D\u043E\u0432\u0430 \u0431\u0435\u0437 \u0443\u043C\u043B\u0430\u0443\u0442\u0430: g\xE4be \u2014 \u044D\u0442\u043E KII." },
  { inf: "gehen", pr3: "geht", form: "gehe", why: "gehen \u2192 er gehe." },
  { inf: "fahren", pr3: "f\xE4hrt", form: "fahre", why: "fahren \u2192 er fahre. \u0423\u043C\u043B\u0430\u0443\u0442 Indikativ (f\xE4hrt) \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442." },
  { inf: "nehmen", pr3: "nimmt", form: "nehme", why: "nehmen \u2192 er nehme, \u043D\u0435 \xABnimm\xBB." },
  { inf: "bleiben", pr3: "bleibt", form: "bleibe", why: "bleiben \u2192 er bleibe." },
  { inf: "lesen", pr3: "liest", form: "lese", why: "lesen \u2192 er lese." },
  { inf: "trinken", pr3: "trinkt", form: "trinke", why: "trinken \u2192 er trinke." },
  { inf: "machen", pr3: "macht", form: "mache", why: "machen \u2192 er mache. \u0423 \u0441\u043B\u0430\u0431\u044B\u0445 \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u0432 KI \u0442\u043E\u0436\u0435 \u0435\u0441\u0442\u044C \u2014 \u043D\u043E \u0436\u0438\u0432\u0451\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0432 3sg." },
  { inf: "arbeiten", pr3: "arbeitet", form: "arbeite", why: "arbeiten \u2192 er arbeite. \u041E\u0441\u043D\u043E\u0432\u0430 \u043D\u0430 -t: -e- \u0432\u0441\u0442\u0430\u0432\u043A\u0430, \u043A\u0430\u043A \u0432 Pr\xE4sens." }
];
var ES_CORR = [
  { text: "Ich verlasse mich {0}, dass du p\xFCnktlich kommst.", a: "darauf", prep: "sich verlassen auf", why: "sich verlassen AUF \u2192 \u043A\u043E\u0440\u0440\u0435\u043B\u044F\u0442 darauf, dass. \u041A\u043E\u0440\u0440\u0435\u043B\u044F\u0442 = \u043F\u0440\u0435\u0434\u043B\u043E\u0433 \u0433\u043B\u0430\u0433\u043E\u043B\u0430 + da-." },
  { text: "Der Lehrer achtet sehr {0}, dass alle Formulare korrekt ausgef\xFCllt werden.", a: "darauf", prep: "achten auf", why: "achten AUF \u2192 darauf, dass." },
  { text: "Es handelt sich {0}, dass ein Formular falsch ausgef\xFCllt wurde.", a: "darum", prep: "handeln um", why: "handeln UM \u2192 darum, dass. \xAB\u0420\u0435\u0447\u044C \u0438\u0434\u0451\u0442 \u043E \u0442\u043E\u043C, \u0447\u0442\u043E \u2026\xBB." },
  { text: "Das h\xE4ngt {0} ab, ob das Wetter am Samstag mitspielt.", a: "davon", prep: "abh\xE4ngen von", why: "abh\xE4ngen VON \u2192 davon ab. ob \u2014 \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \xAB\u0434\u0430/\u043D\u0435\u0442\xBB." },
  { text: "Du musst {0} rechnen, dass der Termin verschoben wird.", a: "damit", prep: "rechnen mit", why: "rechnen MIT \u2192 damit, dass. \xAB\u0421\u0447\u0438\u0442\u0430\u0442\u044C \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u2026\xBB." },
  { text: "Das spricht {0}, dass die neue Methode wirkt.", a: "daf\xFCr", prep: "sprechen f\xFCr", why: "sprechen F\xDCR \u2192 daf\xFCr, dass. \xAB\u0413\u043E\u0432\u043E\u0440\u0438\u0442\u044C \u0432 \u043F\u043E\u043B\u044C\u0437\u0443 \u0442\u043E\u0433\u043E, \u0447\u0442\u043E \u2026\xBB." },
  { text: "Es kommt {0} an, dass alle sich an die Regeln halten.", a: "darauf", prep: "ankommen auf", why: "ankommen AUF \u2192 darauf an. \u0422\u0438\u043F\u0438\u0447\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u2014 \xABdaran an\xBB: \u043F\u0440\u0435\u0434\u043B\u043E\u0433 AUF." },
  { text: "Wir haben uns {0} gew\xF6hnt, dass es hier so laut ist.", a: "daran", prep: "sich gew\xF6hnen an", why: "sich gew\xF6hnen AN \u2192 daran, dass. \xAB\u041F\u0440\u0438\u0432\u044B\u043A\u043D\u0443\u0442\u044C \u043A \u0442\u043E\u043C\u0443, \u0447\u0442\u043E \u2026\xBB." },
  { text: "Der Bericht st\xFCtzt sich {0}, dass die Zahlen korrekt sind.", a: "darauf", prep: "sich st\xFCtzen auf", why: "sich st\xFCtzen AUF \u2192 darauf, dass." },
  { text: "Sie bem\xFCht sich {0}, dass ihr Sohn einen Studienplatz bekommt.", a: "darum", prep: "sich bem\xFChen um", why: "sich bem\xFChen UM \u2192 darum, dass." },
  { text: "Der Chef dr\xE4ngt {0}, dass wir schneller liefern.", a: "darauf", prep: "dr\xE4ngen auf", why: "dr\xE4ngen AUF \u2192 darauf, dass. \xAB\u041D\u0430\u0441\u0442\u0430\u0438\u0432\u0430\u0442\u044C \u043D\u0430 \u0442\u043E\u043C, \u0447\u0442\u043E\u0431\u044B \u2026\xBB." },
  { text: "Er h\xE4lt {0} fest, dass die Schule auch nachmittags offen bleibt.", a: "daran", prep: "festhalten an", why: "festhalten AN \u2192 daran fest. \xAB\u0414\u0435\u0440\u0436\u0430\u0442\u044C\u0441\u044F \u0437\u0430 \u0442\u043E, \u0447\u0442\u043E \u2026\xBB." },
  { text: "Wir sind uns {0} einig, dass der Plan zu teuer ist.", a: "dar\xFCber", prep: "sich einig sein \xFCber", why: "sich einig sein \xDCBER \u2192 dar\xFCber, dass." },
  { text: "Die Eltern sorgen sich {0}, dass der Sohn den Anschluss verpasst.", a: "darum", prep: "sich sorgen um", why: "sich sorgen UM \u2192 darum, dass." }
];
var ES_HOLE = [
  { text: "Der Sprecher betonte: {0} besteht kein Zweifel, dass die Kosten steigen.", a: "Es", why: "Unpers\xF6nliches es: es besteht kein Zweifel, dass \u2026 \u041D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 1 \u0441\u0442\u043E\u0438\u0442 es, \u0441\u0440\u0430\u0437\u0443 \u0437\u0430 \u043D\u0438\u043C \u0433\u043B\u0430\u0433\u043E\u043B." },
  { text: "Im Bericht stand: {0} besteht die Gefahr, dass der Zug ausf\xE4llt.", a: "Es", why: "es besteht die Gefahr, dass \u2026 \u2014 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u0430\u044F \u0440\u0430\u043C\u043A\u0430 \xAB\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442 \u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C, \u0447\u0442\u043E \u2026\xBB." },
  { text: "Der Arzt beruhigte uns: {0} handelt sich um eine einfache Erk\xE4ltung.", a: "Es", why: "es handelt sich um + Akkusativ \u2014 \xAB\u0440\u0435\u0447\u044C \u0438\u0434\u0451\u0442 \u043E\xBB. \u0411\u0435\u0437 um \u0438 \u0431\u0435\u0437 es \u0444\u0440\u0430\u0437\u0430 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430." },
  { text: "In der Studie las ich: {0} gilt als erwiesen, dass Rauchen schadet.", a: "Es", why: "es gilt als \u2026, dass \u2026 \u2014 \xAB\u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u0434\u043E\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u043C, \u0447\u0442\u043E \u2026\xBB." },
  { text: "Am Ende war klar: {0} kommt darauf an, dass alle mitziehen.", a: "Es", why: "es kommt darauf an, dass \u2026 \u2014 \xAB\u0440\u0435\u0448\u0430\u0435\u0442 \u0442\u043E, \u0447\u0442\u043E \u2026 / \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u2014 \u0447\u0442\u043E\u0431\u044B \u2026\xBB." }
];
var ES_PAIR = [
  {
    a: "Das spricht daf\xFCr.",
    b: "Er kommt.",
    answers: ["Das spricht daf\xFCr, dass er kommt."],
    why: "sprechen f\xFCr \u2192 daf\xFCr + dass. \u041A\u043E\u0440\u0440\u0435\u043B\u044F\u0442 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u0433\u043B\u0430\u0432\u043D\u043E\u043C, \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u0441 dass \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446: \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u0441\u0430\u043C\u043E\u043C \u043A\u043E\u043D\u0446\u0435."
  },
  {
    a: "Der Arzt achtet darauf.",
    b: "Der Patient nimmt die Medikamente.",
    answers: ["Der Arzt achtet darauf, dass der Patient die Medikamente nimmt."],
    why: "achten auf \u2192 darauf, dass. \u0412 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u0433\u043B\u0430\u0433\u043E\u043B nimmt \u2014 \u0432 \u043A\u043E\u043D\u0446\u0435."
  },
  {
    a: "Es geht darum.",
    b: "Alle sparen Energie.",
    answers: ["Es geht darum, dass alle Energie sparen."],
    why: "gehen um \u2192 darum, dass. \xAB\u0420\u0435\u0447\u044C \u043E \u0442\u043E\u043C, \u0447\u0442\u043E \u2026\xBB."
  },
  {
    a: "Wir hoffen darauf.",
    b: "Der Bau beginnt im Mai.",
    answers: ["Wir hoffen darauf, dass der Bau im Mai beginnt."],
    why: "hoffen auf \u2192 darauf, dass. \u0413\u043B\u0430\u0433\u043E\u043B beginnt \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E."
  },
  {
    a: "Sie sorgt daf\xFCr.",
    b: "Die Kinder schlafen genug.",
    answers: ["Sie sorgt daf\xFCr, dass die Kinder genug schlafen."],
    why: "sorgen f\xFCr \u2192 daf\xFCr, dass. \u041A\u043B\u0430\u0441\u0441\u0438\u043A\u0430 \u043A\u043E\u0440\u0440\u0435\u043B\u044F\u0442\u0430: \xAB\u043F\u043E\u0437\u0430\u0431\u043E\u0442\u0438\u0442\u044C\u0441\u044F \u043E \u0442\u043E\u043C, \u0447\u0442\u043E\u0431\u044B \u2026\xBB."
  },
  {
    a: "Es besteht die Gefahr.",
    b: "Der Zug f\xE4llt aus.",
    answers: ["Es besteht die Gefahr, dass der Zug ausf\xE4llt."],
    why: "ausfallen \u2014 \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430: \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432\u0441\u0442\u0430\u0451\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 \u2192 ausf\xE4llt."
  },
  {
    a: "Es h\xE4ngt davon ab.",
    b: "Der Chef kommt morgen.",
    answers: ["Es h\xE4ngt davon ab, ob der Chef morgen kommt."],
    why: "\u0417\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u041E\u0422\u041A\u0420\u042B\u0422\u041E\u0413\u041E \u0432\u043E\u043F\u0440\u043E\u0441\u0430 \u2192 ob, \u043D\u0435 dass: \xABh\xE4ngt davon ab, ob er kommt\xBB. dass \u0441\u0442\u0430\u0432\u0438\u043B\u0438 \u0431\u044B \u0434\u043B\u044F \u0444\u0430\u043A\u0442\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0443\u0436\u0435 \u0440\u0435\u0448\u0451\u043D."
  },
  {
    a: "Du musst damit rechnen.",
    b: "Es regnet am Samstag.",
    answers: ["Du musst damit rechnen, dass es am Samstag regnet."],
    why: "rechnen mit \u2192 damit, dass. \xAB\u0421\u0447\u0438\u0442\u0430\u0442\u044C\u0441\u044F \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u2026\xBB."
  }
];
var KONN_FRAMES = [
  /* --- zumal: усиливающая причина, только после главного ------------------- */
  {
    a: "Er kam sp\xE4t.",
    b: "Der Zug hatte Versp\xE4tung.",
    konn: "zumal",
    answers: ["Er kam sp\xE4t, zumal der Zug Versp\xE4tung hatte."],
    why: "zumal = \xAB\u0442\u0435\u043C \u0431\u043E\u043B\u0435\u0435 \u0447\u0442\u043E\xBB: \u0443\u0441\u0438\u043B\u0438\u0432\u0430\u044E\u0449\u0430\u044F \u043F\u0440\u0438\u0447\u0438\u043D\u0430. \u0421\u0442\u0430\u0432\u0438\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F."
  },
  {
    a: "Wir machen das Wochenende frei.",
    b: "Das Wetter soll gut werden.",
    konn: "zumal",
    answers: ["Wir machen das Wochenende frei, zumal das Wetter gut werden soll."],
    why: "zumal \u2014 \u0441\u043E\u044E\u0437: \u0433\u043B\u0430\u0433\u043E\u043B soll \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E."
  },
  {
    a: "Sie bleibt noch im B\xFCro.",
    b: "Es ist noch viel Arbeit da.",
    konn: "zumal",
    answers: ["Sie bleibt noch im B\xFCro, zumal noch viel Arbeit da ist."],
    why: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u0443\u0441\u0438\u043B\u0438\u0432\u0430\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u0435: \xAB\u0442\u0435\u043C \u0431\u043E\u043B\u0435\u0435 \u0447\u0442\u043E \u0440\u0430\u0431\u043E\u0442\u044B \u0435\u0449\u0451 \u043C\u043D\u043E\u0433\u043E\xBB."
  },
  {
    a: "Der Plan ist riskant.",
    b: "Die Zeit ist knapp.",
    konn: "zumal",
    answers: ["Der Plan ist riskant, zumal die Zeit knapp ist."],
    why: "zumal \u043F\u043E\u0441\u043B\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E; \u0433\u043B\u0430\u0433\u043E\u043B ist \u0432 \u043A\u043E\u043D\u0446\u0435 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E."
  },
  {
    a: "Ich fr\xFChst\xFCcke lieber zu Hause.",
    b: "Das Caf\xE9 in der N\xE4he ist teuer.",
    konn: "zumal",
    answers: ["Ich fr\xFChst\xFCcke lieber zu Hause, zumal das Caf\xE9 in der N\xE4he teuer ist."],
    why: "zumal \u043E\u0431\u044A\u044F\u0441\u043D\u044F\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \xAB\u0442\u0435\u043C \u0431\u043E\u043B\u0435\u0435 \u0447\u0442\u043E\xBB."
  },
  /* --- wobei: комментарий ко всему главному -------------------------------- */
  {
    a: "Der Aufenthalt hat mir gefallen.",
    b: "Das Hotel war etwas laut.",
    konn: "wobei",
    answers: ["Der Aufenthalt hat mir gefallen, wobei das Hotel etwas laut war."],
    why: "wobei \u2014 \xAB\u043F\u0440\u0438 \u044D\u0442\u043E\u043C\xBB: \u043E\u0433\u043E\u0432\u043E\u0440\u043A\u0430 \u043A\u043E \u0412\u0421\u0415\u041C\u0423 \u0433\u043B\u0430\u0432\u043D\u043E\u043C\u0443, \u0430 \u043D\u0435 \u043A \u043E\u0434\u043D\u043E\u043C\u0443 \u0441\u043B\u043E\u0432\u0443. \u0422\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E."
  },
  {
    a: "Das Projekt war ein Erfolg.",
    b: "Die Kosten sind gestiegen.",
    konn: "wobei",
    answers: ["Das Projekt war ein Erfolg, wobei die Kosten gestiegen sind."],
    why: "wobei \u0441\u043C\u044F\u0433\u0447\u0430\u0435\u0442: \u0443\u0441\u043F\u0435\u0445 \u2014 \u0434\u0430, \u043F\u0440\u0438 \u044D\u0442\u043E\u043C \u0440\u0430\u0441\u0445\u043E\u0434\u044B \u0432\u044B\u0440\u043E\u0441\u043B\u0438."
  },
  {
    a: "Er ist ein guter Lehrer.",
    b: "Er ist manchmal sehr streng.",
    konn: "wobei",
    answers: ["Er ist ein guter Lehrer, wobei er manchmal sehr streng ist."],
    why: "wobei \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u043E\u0433\u043E\u0432\u043E\u0440\u043A\u0443, \u043D\u0435 \u043E\u0442\u043C\u0435\u043D\u044F\u044F \u0433\u043B\u0430\u0432\u043D\u043E\u0435."
  },
  {
    a: "Die Wohnung ist g\xFCnstig.",
    b: "Die Lage ist nicht ideal.",
    konn: "wobei",
    answers: ["Die Wohnung ist g\xFCnstig, wobei die Lage nicht ideal ist."],
    why: "wobei \u2014 \u0442\u0438\u043F\u043E\u0432\u0430\u044F \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F: \u043F\u043B\u044E\u0441, \xAB\u043F\u0440\u0438 \u044D\u0442\u043E\u043C\xBB \u043C\u0438\u043D\u0443\u0441."
  },
  {
    a: "Das Essen war ausgezeichnet.",
    b: "Beim Service musste man lange warten.",
    konn: "wobei",
    answers: ["Das Essen war ausgezeichnet, wobei man lange auf das Essen warten musste."],
    why: "wobei \u0441\u043E\u0435\u0434\u0438\u043D\u044F\u0435\u0442 \u043E\u0446\u0435\u043D\u043A\u0443 \u0438 \u043E\u0433\u043E\u0432\u043E\u0440\u043A\u0443. \u0412 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u043A\u043E\u043D\u0446\u0435: warten musste. (\u0414\u043E\u0441\u043B\u043E\u0432\u043D\u043E\u0435 \xABder Service hat lange gedauert\xBB \u043F\u043E-\u043D\u0435\u043C\u0435\u0446\u043A\u0438 \u043D\u0435 \u0433\u043E\u0432\u043E\u0440\u044F\u0442 \u2014 \u0434\u043B\u0438\u0442\u0441\u044F \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435, \u0430 \u043D\u0435 \u0441\u0435\u0440\u0432\u0438\u0441.)"
  },
  /* --- wenngleich: уступка, оба порядка ------------------------------------ */
  {
    a: "Sie hat die Stelle bekommen.",
    b: "Erfahrung fehlt ihr.",
    konn: "wenngleich",
    answers: [
      "Sie hat die Stelle bekommen, wenngleich ihr Erfahrung fehlt.",
      "Wenngleich ihr Erfahrung fehlt, hat sie die Stelle bekommen."
    ],
    why: "wenngleich \u2248 obwohl. \u041E\u0431\u0430 \u043F\u043E\u0440\u044F\u0434\u043A\u0430 \u0432\u0435\u0440\u043D\u044B: \u043F\u043E\u0441\u043B\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0438\u043B\u0438 \u0432\u043F\u0435\u0440\u0435\u0434\u0438 \u2014 \u0442\u043E\u0433\u0434\u0430 \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u0441 \u0433\u043B\u0430\u0433\u043E\u043B\u0430 (hat)."
  },
  {
    a: "Wir sind fr\xFCh losgefahren.",
    b: "Wir haben den Zug verpasst.",
    konn: "wenngleich",
    answers: [
      "Wir sind fr\xFCh losgefahren, wenngleich wir den Zug verpasst haben.",
      "Wenngleich wir den Zug verpasst haben, sind wir fr\xFCh losgefahren."
    ],
    why: "\u0423\u0441\u0442\u0443\u043F\u043A\u0430: \u0432\u044B\u0435\u0445\u0430\u043B\u0438 \u0440\u0430\u043D\u043E, \u0425\u041E\u0422\u042F \u043F\u043E\u0435\u0437\u0434 \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u043B\u0438. wenngleich \u0432\u0435\u0434\u0451\u0442 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u2014 \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u043A\u043E\u043D\u0435\u0446."
  },
  {
    a: "Die Wohnung ist klein.",
    b: "Sie gef\xE4llt mir.",
    konn: "wenngleich",
    answers: [
      "Die Wohnung ist klein, wenngleich sie mir gef\xE4llt.",
      "Wenngleich die Wohnung klein ist, gef\xE4llt sie mir."
    ],
    why: "\u0412\u043E \u0432\u0442\u043E\u0440\u043E\u043C \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u0441 \u0433\u043B\u0430\u0433\u043E\u043B\u0430 gef\xE4llt \u2014 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u0437\u0430\u043D\u044F\u043B\u043E \u043F\u0435\u0440\u0432\u043E\u0435 \u043C\u0435\u0441\u0442\u043E."
  },
  {
    a: "Er hilft gern.",
    b: "Er hat wenig Zeit.",
    konn: "wenngleich",
    answers: [
      "Er hilft gern, wenngleich er wenig Zeit hat.",
      "Wenngleich er wenig Zeit hat, hilft er gern."
    ],
    why: "wenngleich = obwohl: \u0441\u043C\u044B\u0441\u043B \u0442\u043E\u0442 \u0436\u0435, \u0440\u0435\u0433\u0438\u0441\u0442\u0440 \u0447\u0443\u0442\u044C \u043A\u043D\u0438\u0436\u043D\u0435\u0435."
  },
  {
    a: "Die Reise war teuer.",
    b: "Sie hat sich gelohnt.",
    konn: "wenngleich",
    answers: [
      "Die Reise war teuer, wenngleich sie sich gelohnt hat.",
      "Wenngleich die Reise teuer war, hat sie sich gelohnt."
    ],
    why: "sich lohnen \u2014 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B: sich \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043F\u0440\u0438 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u043C sie."
  }
];
var pick5 = (xs) => xs[Math.floor(Math.random() * xs.length)];
ES_HOLE.push(...ES_HOLE_EXTRA);
function konjunktiv12() {
  if (Math.random() < 0.5) {
    const f = pick5(K1_FRAMES);
    return {
      topic: "c1-konjunktiv1-formen",
      task: "Indirekte Rede: \u043F\u043E\u0441\u0442\u0430\u0432\u044C \u0433\u043B\u0430\u0433\u043E\u043B \u0432 Konjunktiv I.",
      text: f.text,
      hint: f.hint,
      gaps: [f.a],
      why: f.why
    };
  }
  const c = pick5(K1_CARDS);
  const prefix = `${c.inf} \u2192 er ${c.form}`;
  const extra = c.why.startsWith(prefix) ? c.why.slice(prefix.length).replace(/^[.\s]+/, "") : c.why;
  return {
    topic: "c1-konjunktiv1-formen",
    task: "Konjunktiv I, 3. Person Singular: \xABEr sagte, er \u2026\xBB.",
    text: `${c.inf} \u2192 {0}`,
    hint: `(Indikativ: er ${c.pr3})`,
    gaps: [[c.form]],
    why: `Konjunktiv I: ${prefix}.` + (extra ? ` ${extra}` : "")
  };
}
function esKonstruktionen() {
  const r = Math.random();
  if (r < 0.45) {
    const f2 = pick5(ES_CORR);
    return {
      topic: "c1-es-konstruktionen",
      task: "Setze das Korrelat ein (darauf, daran, darum \u2026).",
      text: f2.text,
      hint: `(${f2.prep})`,
      gaps: [[f2.a]],
      why: f2.why
    };
  }
  if (r < 0.7) {
    const f2 = pick5(ES_HOLE);
    return {
      topic: "c1-es-konstruktionen",
      task: "Setze das unpers\xF6nliche \xABes\xBB ein.",
      text: f2.text,
      gaps: [[f2.a]],
      why: f2.why
    };
  }
  const f = pick5(ES_PAIR);
  return {
    topic: "c1-es-konstruktionen",
    task: "Verbinde die S\xE4tze: Korrelat + dass/ob. \u041E\u0442\u0432\u0435\u0442 \u2014 \u0446\u0435\u043B\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435.",
    text: `${f.a} / ${f.b}
{0}`,
    gaps: [f.answers],
    why: f.why
  };
}
function konnektorenC1() {
  const f = pick5(KONN_FRAMES);
  const aufgabe = f.konn === "zumal" ? "Verbinde mit \xABzumal\xBB (= \xAB\u0442\u0435\u043C \u0431\u043E\u043B\u0435\u0435 \u0447\u0442\u043E\xBB). \u041F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E." : f.konn === "wobei" ? "Verbinde mit \xABwobei\xBB (= \xAB\u043F\u0440\u0438 \u044D\u0442\u043E\u043C\xBB). \u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043A\u043E \u0432\u0441\u0435\u043C\u0443 \u0433\u043B\u0430\u0432\u043D\u043E\u043C\u0443." : "Verbinde mit \xABwenngleich\xBB (\u2248 obwohl). \u041F\u0440\u0438\u043D\u0438\u043C\u0430\u044E\u0442\u0441\u044F \u043E\u0431\u0430 \u043F\u043E\u0440\u044F\u0434\u043A\u0430.";
  return {
    topic: "c1-konnektoren",
    task: aufgabe,
    text: `${f.a} / ${f.b}
{0}`,
    hint: `(${f.konn})`,
    gaps: [f.answers],
    why: f.why
  };
}

// src/lib/de/c1b.ts
var NOM_STIL = [
  {
    nom: "Nach der Pr\xFCfung der Dokumente war der Fall klar.",
    verbals: [
      "Nachdem man die Dokumente gepr\xFCft hatte, war der Fall klar.",
      "Nachdem die Dokumente gepr\xFCft worden waren, war der Fall klar."
    ],
    prep: "nach",
    konj: "nachdem",
    nomen: "die Pr\xFCfung",
    verb: "pr\xFCfen",
    why: "Nominalisierung: die Pr\xFCfung \u2190 pr\xFCfen. \xABnach + Nomen\xBB \u2194 \xABnachdem\xBB: \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u043E \u0440\u0430\u043D\u044C\u0448\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C Plusquamperfekt (hatte gepr\xFCft), \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u2014 Pr\xE4teritum (war). \u0414\u0435\u044F\u0442\u0435\u043B\u044F \u0432 \u043D\u043E\u043C\u0438\u043D\u0435 \u043D\u0435\u0442, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 verbal: man \u0438\u043B\u0438 \u043F\u0430\u0441\u0441\u0438\u0432 (worden waren)."
  },
  {
    nom: "Wegen der Verschiebung des Termins rufen wir alle Kunden an.",
    verbals: [
      "Weil der Termin verschoben wurde, rufen wir alle Kunden an.",
      "Weil wir den Termin verschoben haben, rufen wir alle Kunden an."
    ],
    prep: "wegen",
    konj: "weil",
    nomen: "die Verschiebung",
    verb: "verschieben",
    why: "die Verschiebung \u2190 verschieben. wegen \u2194 weil: \u043F\u0440\u0438\u0447\u0438\u043D\u0430. \u041F\u0430\u0441\u0441\u0438\u0432 (wurde verschoben) \u0438 \u0430\u043A\u0442\u0438\u0432 (haben verschoben) \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u043E \u0438\u0434\u0438\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u044B \u2014 \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u044E\u0442\u0441\u044F \u043E\u0431\u0430."
  },
  {
    nom: "Trotz der Bewerbung von zwanzig Kandidaten blieb die Stelle frei.",
    verbals: ["Obwohl sich zwanzig Kandidaten beworben hatten, blieb die Stelle frei."],
    prep: "trotz",
    konj: "obwohl",
    nomen: "die Bewerbung",
    verb: "sich bewerben",
    why: "die Bewerbung \u2190 sich bewerben. trotz \u2194 obwohl: \u0443\u0441\u0442\u0443\u043F\u043A\u0430. \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u0432 Pr\xE4teritum (blieb), \u043F\u0440\u0435\u0434\u0448\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u2014 \u0432 Plusquamperfekt (sich beworben hatten). sich \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043F\u0440\u0438 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u043C."
  },
  {
    nom: "Vor der Er\xF6ffnung des neuen Ladens gab es einen kleinen Empfang.",
    verbals: [
      "Bevor man den neuen Laden er\xF6ffnete, gab es einen kleinen Empfang.",
      "Bevor der neue Laden er\xF6ffnet wurde, gab es einen kleinen Empfang."
    ],
    prep: "vor",
    konj: "bevor",
    nomen: "die Er\xF6ffnung",
    verb: "er\xF6ffnen",
    why: "die Er\xF6ffnung \u2190 er\xF6ffnen. vor \u2194 bevor: \u043F\u0440\u0435\u0434\u0448\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043D\u0438\u0435. \u041E\u0431\u0430 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C, \u043D\u043E \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u2014 \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E Pr\xE4teritum (er\xF6ffnete) \u0438\u043B\u0438 \u043F\u0430\u0441\u0441\u0438\u0432 (er\xF6ffnet wurde)."
  },
  {
    nom: "Bei der Ankunft der Delegation war alles vorbereitet.",
    verbals: ["Als die Delegation ankam, war alles vorbereitet."],
    prep: "bei",
    konj: "als",
    nomen: "die Ankunft",
    verb: "ankommen",
    why: "die Ankunft \u2190 ankommen \u2014 \u043D\u0435\u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0430\u044F \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F, \u0435\u0451 \u043D\u0430\u0434\u043E \u043F\u043E\u043C\u043D\u0438\u0442\u044C (\u043D\u0435 \xABdie Ankommung\xBB). bei + Nomen \u2194 als: \u043C\u043E\u043C\u0435\u043D\u0442 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 Pr\xE4teritum (ankam), \u043D\u0435 Plusquamperfekt."
  },
  {
    nom: "Durch die Nutzung der App lernt man viel schneller.",
    verbals: ["Indem man die App nutzt, lernt man viel schneller."],
    prep: "durch",
    konj: "indem",
    nomen: "die Nutzung",
    verb: "nutzen",
    why: "die Nutzung \u2190 nutzen. durch \u2194 indem: \u0441\u043F\u043E\u0441\u043E\u0431 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F. \u041E\u0431\u0430 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0432 Pr\xE4sens \u2014 \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0432\u0440\u0435\u043C\u0451\u043D \u043D\u0430 C1 \u0437\u0434\u0435\u0441\u044C \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442, \u0432\u0440\u0435\u043C\u044F \u0431\u0435\u0440\u0451\u0442\u0441\u044F \u0438\u0437 \u0441\u043C\u044B\u0441\u043B\u0430."
  },
  {
    nom: "Ohne die Einladung des Chefs kommt er nicht zur Party.",
    verbals: ["Ohne dass der Chef ihn einl\xE4dt, kommt er nicht zur Party."],
    prep: "ohne",
    konj: "ohne dass",
    nomen: "die Einladung",
    verb: "einladen",
    why: "die Einladung \u2190 einladen. \u0423 Chef \u0438 er \u0440\u0430\u0437\u043D\u044B\u0435 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u0435, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0442\u043E\u043B\u044C\u043A\u043E \xABohne dass\xBB, \u0430 \u043D\u0435 \xABohne \u2026 zu\xBB \u2014 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u043D\u044B\u0439 \u043E\u0431\u043E\u0440\u043E\u0442 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043F\u0440\u0438 \u043E\u0434\u043D\u043E\u043C \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u043C."
  },
  {
    nom: "Trotz der Erh\xF6hung der Preise blieb das Angebot gleich.",
    verbals: ["Obwohl die Preise erh\xF6ht wurden, blieb das Angebot gleich."],
    prep: "trotz",
    konj: "obwohl",
    nomen: "die Erh\xF6hung",
    verb: "erh\xF6hen",
    why: "die Erh\xF6hung \u2190 erh\xF6hen. trotz \u2194 obwohl; \u0431\u0435\u0437 \u0434\u0435\u044F\u0442\u0435\u043B\u044F \u043F\u0430\u0441\u0441\u0438\u0432 \u043E\u0447\u0435\u0432\u0438\u0434\u043D\u0435\u0435: wurden erh\xF6ht. \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u2014 Pr\xE4teritum (blieb)."
  },
  {
    nom: "Zur L\xF6sung des Problems brauchen wir mehr Zeit.",
    verbals: ["Um das Problem zu l\xF6sen, brauchen wir mehr Zeit."],
    prep: "zu",
    konj: "um \u2026 zu",
    nomen: "die L\xF6sung",
    verb: "l\xF6sen",
    why: "zur L\xF6sung \u2190 l\xF6sen. \xABzu + Nominalisierung\xBB \u2194 \xABum \u2026 zu\xBB: \u043E\u0434\u043D\u0430 \u0438 \u0442\u0430 \u0436\u0435 \u0446\u0435\u043B\u044C. \u041F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u043E\u0434\u043D\u043E (wir), \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u043D\u044B\u0439 \u043E\u0431\u043E\u0440\u043E\u0442, \u0430 \u043D\u0435 damit."
  },
  {
    nom: "Beim Lesen des Berichts fiel mir ein Fehler auf.",
    verbals: ["Als ich den Bericht las, fiel mir ein Fehler auf."],
    prep: "bei",
    konj: "als",
    nomen: "das Lesen",
    verb: "lesen",
    why: "das Lesen \u2190 lesen (\u0438\u043C\u044F \u043D\u0430 -en \u043E\u0442 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u0430). bei + Nomen \u2194 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0438: \xAB\u0432 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435 \u0447\u0442\u0435\u043D\u0438\u044F\xBB \u2192 Als ich den Bericht las. auffallen \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u043E\u0435: fiel \u2026 auf."
  },
  {
    nom: "Nach der Beendigung der Arbeit ging er nach Hause.",
    verbals: [
      "Nachdem er die Arbeit beendet hatte, ging er nach Hause.",
      "Nachdem man die Arbeit beendet hatte, ging er nach Hause."
    ],
    prep: "nach",
    konj: "nachdem",
    nomen: "die Beendigung",
    verb: "beenden",
    why: "die Beendigung \u2190 beenden \u2014 \u0442\u0438\u043F\u0438\u0447\u043D\u043E \u043A\u0430\u043D\u0446\u0435\u043B\u044F\u0440\u0441\u043A\u043E\u0435 \u0438\u043C\u044F, \u043B\u0438\u0446\u043E Nominalstil. nach \u2194 nachdem: Plusquamperfekt (hatte beendet) + Pr\xE4teritum (ging). \u0414\u0435\u044F\u0442\u0435\u043B\u044C \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D \u043A\u0430\u043A er \u0438\u043B\u0438 man."
  },
  {
    nom: "Seit der Einf\xFChrung der neuen Regel sind die Zahlen gestiegen.",
    verbals: ["Seit man die neue Regel eingef\xFChrt hat, sind die Zahlen gestiegen."],
    prep: "seit",
    konj: "seit",
    nomen: "die Einf\xFChrung",
    verb: "einf\xFChren",
    why: "die Einf\xFChrung \u2190 einf\xFChren. seit \u2194 seit: \u043F\u043E\u0441\u043B\u0435 seit \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C Perfekt (eingef\xFChrt hat), \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u2014 Pr\xE4sens/Perfekt (sind gestiegen). Plusquamperfekt \u043F\u043E\u0441\u043B\u0435 seit \u043D\u0435 \u0441\u0442\u0430\u0432\u0438\u0442\u0441\u044F."
  }
];
var PARTIZIP_ATTR = [
  {
    attr: "der von der Kommission gepr\xFCfte Antrag",
    rels: [
      "der Antrag, der von der Kommission gepr\xFCft wurde",
      "der Antrag, der von der Kommission gepr\xFCft worden ist"
    ],
    kind: "PII",
    why: "Partizip II \u2192 \u043F\u0430\u0441\u0441\u0438\u0432: der von der Kommission gepr\xFCfte Antrag \u2194 der Antrag, der von der Kommission gepr\xFCft wurde. \u0412\u0440\u0435\u043C\u044F \u0432 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0435 \u043D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u043E, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0438 \xABworden ist\xBB \u0432\u0435\u0440\u043D\u043E. \u0410\u0433\u0435\u043D\u0441 von \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F."
  },
  {
    attr: "die vom Arzt untersuchten Patienten",
    rels: [
      "die Patienten, die vom Arzt untersucht wurden",
      "die Patienten, die vom Arzt untersucht worden sind"
    ],
    kind: "PII",
    why: "\u041C\u043D. \u0447\u0438\u0441\u043B\u043E: die vom Arzt untersuchten Patienten \u2194 die Patienten, die vom Arzt untersucht wurden. \u041E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430 \u043F\u043E\u0441\u043B\u0435 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u043E\u0433\u043E \u0430\u0440\u0442\u0438\u043A\u043B\u044F \u2014 \u0441\u043B\u0430\u0431\u043E\u0435: -en."
  },
  {
    attr: "das in diesem Jahr renovierte Haus",
    rels: [
      "das Haus, das in diesem Jahr renoviert wurde",
      "das Haus, das in diesem Jahr renoviert worden ist"
    ],
    kind: "PII",
    why: "\u041E\u0431\u0441\u0442\u043E\u044F\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E (in diesem Jahr) \u0443\u0435\u0437\u0436\u0430\u0435\u0442 \u0432\u043D\u0443\u0442\u0440\u044C \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430: das in diesem Jahr renovierte Haus. \u041F\u0440\u0438 \u043E\u0431\u0440\u0430\u0442\u043D\u043E\u043C \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0435 \u043E\u043D\u043E \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C."
  },
  {
    attr: "das von allen Sch\xFClern gelesene Buch",
    rels: [
      "das Buch, das von allen Sch\xFClern gelesen wurde",
      "das Buch, das von allen Sch\xFClern gelesen worden ist"
    ],
    kind: "PII",
    why: "\u0410\u0433\u0435\u043D\u0441 \u0441 von \u0441\u0442\u043E\u0438\u0442 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0430\u0440\u0442\u0438\u043A\u043B\u044F: das von allen Sch\xFClern gelesene Buch. \u041F\u043E\u0440\u044F\u0434\u043E\u043A \u0432\u043D\u0443\u0442\u0440\u0438 \u0433\u0440\u0443\u043F\u043F\u044B \u043D\u0435 \u0441\u0432\u043E\u0431\u043E\u0434\u0435\u043D: \u0430\u0440\u0442\u0438\u043A\u043B\u044C \u2192 \u0430\u0433\u0435\u043D\u0441 \u2192 \u043F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435 \u0441 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435\u043C \u2192 Nomen."
  },
  {
    attr: "die schon bezahlte Rechnung",
    rels: ["die Rechnung, die schon bezahlt wurde", "die Rechnung, die schon bezahlt ist"],
    kind: "PII",
    why: "die schon bezahlte Rechnung \u2194 die Rechnung, die schon bezahlt wurde. \u0411\u0435\u0437 \u0430\u0433\u0435\u043D\u0441\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u0438 Zustandspassiv (bezahlt ist) \u2014 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \xAB\u043E\u043F\u043B\u0430\u0447\u0435\u043D\u0430\xBB."
  },
  {
    attr: "der gerade reparierte Wagen",
    rels: ["der Wagen, der gerade repariert wird"],
    kind: "PII",
    why: "gerade \u0443\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043D\u0430 \u0438\u0434\u0443\u0449\u0438\u0439 \u043F\u0440\u043E\u0446\u0435\u0441\u0441: \u0442\u043E\u043B\u044C\u043A\u043E Vorgangspassiv Pr\xE4sens \u2014 der Wagen, der gerade repariert wird. \xABWorden ist\xBB \u0437\u0434\u0435\u0441\u044C \u043D\u0435 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442: \u043F\u0440\u043E\u0446\u0435\u0441\u0441, \u043D\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442."
  },
  {
    attr: "das von ihr gekochte Essen",
    rels: [
      "das Essen, das von ihr gekocht wurde",
      "das Essen, das von ihr gekocht worden ist"
    ],
    kind: "PII",
    why: "das von ihr gekochte Essen \u2194 das Essen, das von ihr gekocht wurde. \u0420\u043E\u0434 \u0438 \u043F\u0430\u0434\u0435\u0436 \u0432\u0438\u0434\u043D\u044B \u043F\u043E \u0430\u0440\u0442\u0438\u043A\u043B\u044E das; \u043F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 -e (Nominativ Neutrum)."
  },
  {
    attr: "den vom Team vorbereiteten Vortrag",
    rels: [
      "den Vortrag, der vom Team vorbereitet wurde",
      "den Vortrag, der vom Team vorbereitet worden ist"
    ],
    kind: "PII",
    why: "Akkusativ: den vom Team vorbereiteten Vortrag \u2194 den Vortrag, der vom Team vorbereitet wurde. \u0412 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0435 \u043F\u0430\u0434\u0435\u0436 \u0432\u0438\u0434\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u0430\u0440\u0442\u0438\u043A\u043B\u044E den \u2014 \u043E\u043D \u0438 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0442 \u0444\u043E\u0440\u043C\u0443 \u0433\u0440\u0443\u043F\u043F\u044B."
  },
  {
    attr: "die schnell steigenden Preise",
    rels: ["die Preise, die schnell steigen"],
    kind: "PI",
    why: "Partizip I = \u0430\u043A\u0442\u0438\u0432 \u0438 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0441\u0442\u044C: die Preise, die schnell steigen. Partizip II (die gestiegenen Preise) \u0438\u0437\u043C\u0435\u043D\u0438\u043B \u0431\u044B \u0441\u043C\u044B\u0441\u043B: \xAB\u0443\u0436\u0435 \u0432\u044B\u0440\u043E\u0441\u043B\u0438\xBB, \u0430 \u043D\u0435 \xAB\u0440\u0430\u0441\u0442\u0443\u0449\u0438\u0435\xBB."
  },
  {
    attr: "der an der Ecke wartende Bus",
    rels: ["der Bus, der an der Ecke wartet"],
    kind: "PI",
    why: "der an der Ecke wartende Bus \u2194 der Bus, der an der Ecke wartet: \u0430\u043A\u0442\u0438\u0432, \u043F\u0440\u043E\u0446\u0435\u0441\u0441 \u0441\u0435\u0439\u0447\u0430\u0441. \u041D\u0430\u0440\u0435\u0447\u0438\u0435 \u043C\u0435\u0441\u0442\u0430 \u0432\u0445\u043E\u0434\u0438\u0442 \u0432 \u0430\u0442\u0440\u0438\u0431\u0443\u0442 \u0438 \u0443\u0435\u0437\u0436\u0430\u0435\u0442 \u0432\u043C\u0435\u0441\u0442\u0435 \u0441 \u043D\u0438\u043C."
  },
  {
    attr: "die sich schnell verbreitende Nachricht",
    rels: ["die Nachricht, die sich schnell verbreitet"],
    kind: "PI",
    why: "\u0412\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u044B\u0439 PI: sich \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u0432\u043D\u0443\u0442\u0440\u0438 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430 \u2014 die sich verbreitende Nachricht. \u0421\u0442\u0430\u0432\u0438\u0442\u044C sich \u043F\u043E\u0441\u043B\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0432 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0435 \u043D\u0435\u043B\u044C\u0437\u044F."
  },
  {
    attr: "das laut spielende Kind",
    rels: ["das Kind, das laut spielt"],
    kind: "PI",
    why: "das laut spielende Kind \u2194 das Kind, das laut spielt. \u041D\u0430\u0440\u0435\u0447\u0438\u0435 (laut) \u0441\u0442\u043E\u0438\u0442 \u043F\u0435\u0440\u0435\u0434 \u043F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435\u043C, \u043F\u0440\u0438\u0447\u0430\u0441\u0442\u0438\u0435 \u2014 \u043F\u0435\u0440\u0435\u0434 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u043C."
  },
  {
    attr: "die fr\xFCh aufstehenden Sch\xFCler",
    rels: ["die Sch\xFCler, die fr\xFCh aufstehen"],
    kind: "PI",
    why: "\u041E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432 Partizip I \u043D\u0435 \u0440\u0430\u0437\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F: aufstehend (\u043A\u0430\u043A \u0438 \u0432 Partizip II \u2014 aufgestanden). die fr\xFCh aufstehenden Sch\xFCler \u2194 die Sch\xFCler, die fr\xFCh aufstehen."
  }
];
var WORTSTELLUNG_C1 = [
  {
    normal: "Er hat nie ein besseres Angebot als dieses bekommen.",
    other: "Ein besseres Angebot als dieses hat er nie bekommen.",
    kind: "als",
    why: "Vergleich mit als \u0432\u044B\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u044E 1 \u2014 \u0433\u043B\u0430\u0433\u043E\u043B hat \u0441\u0440\u0430\u0437\u0443 \u0437\u0430 \u043D\u0438\u043C. \u0412 \u043E\u0431\u044B\u0447\u043D\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u0433\u0440\u0443\u043F\u043F\u0430 \u0441\u0442\u043E\u0438\u0442 \u0432 Mittelfeld \u043F\u043E\u0441\u043B\u0435 nie. \u041E\u0431\u0430 \u043F\u043E\u0440\u044F\u0434\u043A\u0430 \u0432\u0435\u0440\u043D\u044B, \u0432\u0442\u043E\u0440\u043E\u0439 \u2014 \u043F\u0438\u0441\u044C\u043C\u0435\u043D\u043D\u044B\u0439 \u0440\u0435\u0433\u0438\u0441\u0442\u0440."
  },
  {
    normal: "Niemand hat uns ein g\xFCnstigeres Angebot als dieses gemacht.",
    other: "Ein g\xFCnstigeres Angebot als dieses hat uns niemand gemacht.",
    kind: "als",
    why: "\u0413\u0440\u0443\u043F\u043F\u0430 \u0441 als \u0446\u0435\u043B\u0438\u043A\u043E\u043C \u043D\u0430 \u043F\u0435\u0440\u0432\u043E\u0435 \u043C\u0435\u0441\u0442\u043E, \u0433\u043B\u0430\u0433\u043E\u043B hat \u2014 \u043D\u0430 \u0432\u0442\u043E\u0440\u0443\u044E \u043F\u043E\u0437\u0438\u0446\u0438\u044E. \u0420\u0430\u0437\u0440\u044B\u0432\u0430\u0442\u044C \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F: als dieses \u0432\u0441\u0435\u0433\u0434\u0430 \u0441\u0442\u043E\u0438\u0442 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u0438\u043B\u0430\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E."
  },
  {
    normal: "Du hast nirgendwo einen billigeren Vertrag als diesen gefunden.",
    other: "Einen billigeren Vertrag als diesen hast du nirgendwo gefunden.",
    kind: "als",
    why: "nirgendwo \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 Mittelfeld, Akk-\u0433\u0440\u0443\u043F\u043F\u0430 \u0441 als \u0443\u0435\u0437\u0436\u0430\u0435\u0442 \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u044E 1. \u0413\u043B\u0430\u0433\u043E\u043B hast \u0441\u0442\u043E\u0438\u0442 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0432\u044B\u043D\u0435\u0441\u0435\u043D\u043D\u043E\u0439 \u0433\u0440\u0443\u043F\u043F\u044B."
  },
  {
    normal: "Sie bekommen am Ende des Semesters weitere Informationen zu dem Kurs.",
    other: "Weitere Informationen zu dem Kurs bekommen Sie am Ende des Semesters.",
    kind: "praep",
    why: "\u0422\u044F\u0436\u0451\u043B\u0430\u044F \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u043D\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430 \u043D\u0430 \u043F\u0435\u0440\u0432\u043E\u043C \u043C\u0435\u0441\u0442\u0435 \u0437\u0432\u0443\u0447\u0438\u0442 \u043A\u0430\u043A \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435; \u0432 \u043E\u0431\u044B\u0447\u043D\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u043E\u043D\u0430 \u0441\u0442\u043E\u0438\u0442 \u0432 \u043A\u043E\u043D\u0446\u0435 Mittelfeld. \u0413\u0440\u0443\u043F\u043F\u0430 \u043F\u0435\u0440\u0435\u0435\u0437\u0436\u0430\u0435\u0442 \u0446\u0435\u043B\u0438\u043A\u043E\u043C, \u0432\u043C\u0435\u0441\u0442\u0435 \u0441 zu dem Kurs."
  },
  {
    normal: "Er schreibt jeden Abend einen Brief an seine Familie.",
    other: "Einen Brief an seine Familie schreibt er jeden Abend.",
    kind: "praep",
    why: "Akk-\u043E\u0431\u044A\u0435\u043A\u0442 \u0441 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u043D\u044B\u043C \u0434\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435\u043C \u0432\u044B\u043D\u0435\u0441\u0435\u043D \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u044E 1; \u0433\u043B\u0430\u0433\u043E\u043B schreibt \u043E\u0431\u044F\u0437\u0430\u043D \u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C \u0441\u0440\u0430\u0437\u0443. \u0410\u0440\u0442\u0438\u043A\u043B\u044C einen \u043D\u0435 \u0442\u0435\u0440\u044F\u0435\u0442\u0441\u044F \u043F\u0440\u0438 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0435."
  },
  {
    normal: "Er hat mir eine Antwort auf meine Frage gegeben.",
    other: "Eine Antwort auf meine Frage hat er mir gegeben.",
    kind: "praep",
    why: "\u0414\u043B\u0438\u043D\u043D\u044B\u0439 Akk-\u043E\u0431\u044A\u0435\u043A\u0442 \u0432\u044B\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043D\u0430 \u043F\u0435\u0440\u0432\u043E\u0435 \u043C\u0435\u0441\u0442\u043E; \u0432 \u043E\u0431\u044B\u0447\u043D\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u043E\u043D \u0441\u0442\u043E\u0438\u0442 \u043F\u043E\u0441\u043B\u0435 mir. \u041F\u0430\u0440\u0442\u0438\u0446\u0438\u043F gegeben \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u043A\u043E\u043D\u0446\u0435 \u2014 Nachfeld \u043F\u0440\u0438 Perfekt \u0437\u0430\u043D\u044F\u0442 \u0438\u043C."
  },
  {
    normal: "Der Plan, im Ausland zu studieren, ist unrealistisch.",
    other: "Der Plan ist unrealistisch, im Ausland zu studieren.",
    kind: "inf",
    why: "Infinitivgruppe \u043F\u0440\u0438 \u0430\u0431\u0441\u0442\u0440\u0430\u043A\u0442\u043D\u043E\u043C Nomen \u043C\u043E\u0436\u0435\u0442 \u0443\u0439\u0442\u0438 \u0432 Nachfeld \u2014 \u0437\u0430 \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B. \u041F\u0435\u0440\u0435\u0434 \u0433\u0440\u0443\u043F\u043F\u043E\u0439 \u0437\u0430\u043F\u044F\u0442\u0430\u044F. \u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0439 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u2014 \u0433\u0440\u0443\u043F\u043F\u0430 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 Nomen \u043C\u0435\u0436\u0434\u0443 \u0437\u0430\u043F\u044F\u0442\u044B\u043C\u0438."
  },
  {
    normal: "Die Hoffnung, den Zug noch zu erreichen, war verloren.",
    other: "Die Hoffnung war verloren, den Zug noch zu erreichen.",
    kind: "inf",
    why: "Nachfeld-\u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432: Die Hoffnung war verloren, den Zug noch zu erreichen. \u0412 \u043E\u0431\u044B\u0447\u043D\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u0433\u0440\u0443\u043F\u043F\u0430 \u0441\u0442\u043E\u0438\u0442 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 die Hoffnung \u0438 \u043E\u0431\u0440\u0430\u043C\u043B\u044F\u0435\u0442\u0441\u044F \u0437\u0430\u043F\u044F\u0442\u044B\u043C\u0438."
  },
  {
    normal: "Der Versuch, die Kosten zu senken, ist gescheitert.",
    other: "Der Versuch ist gescheitert, die Kosten zu senken.",
    kind: "inf",
    why: "gescheitert \u2014 sein-Perfekt (\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435/\u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435). Infinitivgruppe \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 Nachfeld \u0437\u0430 ist gescheitert; \u0437\u0430\u043F\u044F\u0442\u0430\u044F \u043F\u0435\u0440\u0435\u0434 \u0433\u0440\u0443\u043F\u043F\u043E\u0439 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u0430."
  },
  {
    normal: "Die Nachricht, dass der Zug ausf\xE4llt, hat uns alle \xFCberrascht.",
    other: "Die Nachricht hat uns alle \xFCberrascht, dass der Zug ausf\xE4llt.",
    kind: "dass",
    why: "dass-Satz \u043F\u0440\u0438 \u0430\u0431\u0441\u0442\u0440\u0430\u043A\u0442\u043D\u043E\u043C Nomen \u0442\u043E\u0436\u0435 \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 Nachfeld. ausf\xE4llt \u2014 \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430: \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432\u0441\u0442\u0430\u0451\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446."
  }
];
var MODALITAET_C1 = [
  {
    text: "Er hat den ganzen Tag nichts gegessen. Er {0} jetzt hungrig sein.",
    a: ["muss"],
    why: "\u0424\u0430\u043A\u0442 (\u0446\u0435\u043B\u044B\u0439 \u0434\u0435\u043D\u044C \u043D\u0435 \u0435\u043B) \u2192 \u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0432\u044B\u0432\u043E\u0434: muss = \xAB\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C, \u0433\u043E\u043B\u043E\u0434\u0435\u043D\xBB. \u0421\u0442\u0443\u043F\u0435\u043D\u044C \u043F\u043E\u0447\u0442\u0438 \u0443\u0432\u0435\u0440\u0435\u043D."
  },
  {
    text: "Sie war den ganzen Morgen im B\xFCro. Sie {0} die E-Mail gesehen haben.",
    a: ["muss"],
    why: "\u041F\u0440\u0435\u0434\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043E \u043F\u0440\u043E\u0448\u043B\u043E\u043C: muss + Partizip II + haben \u0432 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u0435 (gesehen haben). \xABSie muss hat \u2026\xBB \u2014 \u043D\u0435 \u043D\u0435\u043C\u0435\u0446\u043A\u0438\u0439: \u0432\u0442\u043E\u0440\u043E\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446."
  },
  {
    text: "Er hat den Vertrag gestern selbst unterschrieben. Er {0} also genau wissen, was drinsteht.",
    a: ["muss"],
    why: "also \u0443\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043D\u0430 \u0432\u044B\u0432\u043E\u0434 \u0438\u0437 \u0444\u0430\u043A\u0442\u0430 \u2192 muss. \u0421\u0430\u043C \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043B \u2014 \u0441\u043E\u043C\u043D\u0435\u043D\u0438\u0439 \u043F\u043E\u0447\u0442\u0438 \u043D\u0435\u0442."
  },
  {
    text: "Ihr Auto steht im Hof. Sie {0} zu Hause sein.",
    a: ["muss", "d\xFCrfte"],
    why: "\u041C\u0430\u0448\u0438\u043D\u0430 \u0432\u043E \u0434\u0432\u043E\u0440\u0435 \u2014 \u0441\u0438\u043B\u044C\u043D\u044B\u0439, \u043D\u043E \u043D\u0435 \u0430\u0431\u0441\u043E\u043B\u044E\u0442\u043D\u044B\u0439 \u0430\u0440\u0433\u0443\u043C\u0435\u043D\u0442: muss (\u0443\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0439 \u0432\u044B\u0432\u043E\u0434) \u0438 d\xFCrfte (\u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E) \u043E\u0431\u0430 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B. muss \u0437\u0432\u0443\u0447\u0438\u0442 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0447\u043D\u0435\u0435, d\xFCrfte \u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u043C\u0435\u0441\u0442\u043E \u0441\u043E\u043C\u043D\u0435\u043D\u0438\u044E."
  },
  {
    text: "Es ist schon nach Mitternacht. Sie {0} l\xE4ngst zu Hause sein.",
    a: ["m\xFCsste", "d\xFCrfte"],
    why: "m\xFCsste (Konjunktiv II) \u2014 \u0442\u0438\u043F\u0438\u0447\u043D\u0430\u044F \u0444\u043E\u0440\u043C\u0430 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0433\u043E \u043F\u0440\u0435\u0434\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u044F, \u0447\u0443\u0442\u044C \u043C\u044F\u0433\u0447\u0435 muss; d\xFCrfte \u2014 \xAB\u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E\xBB. \u041E\u0431\u0435 \u0441\u0442\u0443\u043F\u0435\u043D\u0438 \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0442: \u043F\u043E\u0437\u0434\u043D\u0438\u0439 \u0447\u0430\u0441 \u2014 \u0441\u0438\u043B\u044C\u043D\u044B\u0439, \u043D\u043E \u043D\u0435 \u043F\u0440\u0438\u043D\u0443\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0430\u0440\u0433\u0443\u043C\u0435\u043D\u0442."
  },
  {
    text: "Er liest t\xE4glich deutsche Zeitungen. Er {0} also schon einiges verstehen.",
    a: ["d\xFCrfte", "kann"],
    why: "\u0415\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u043E\u0435 \u0447\u0442\u0435\u043D\u0438\u0435 \u0434\u0435\u043B\u0430\u0435\u0442 \u0432\u044B\u0432\u043E\u0434 \u0432\u0435\u0440\u043E\u044F\u0442\u043D\u044B\u043C, \u043D\u043E \u043D\u0435 \u043F\u0440\u0438\u043D\u0443\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u043C: d\xFCrfte. kann (\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E) \u0442\u043E\u0436\u0435 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E \u2014 \u0440\u0430\u0437\u043D\u0438\u0446\u0430 \u0432 \u0442\u043E\u043C, \u0447\u0442\u043E d\xFCrfte \u043E\u043F\u0438\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u0430\u0440\u0433\u0443\u043C\u0435\u043D\u0442, kann \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043E\u043F\u0443\u0441\u043A\u0430\u0435\u0442."
  },
  {
    text: "Wo ist mein Schl\xFCssel? Du {0} ihn auf den Tisch gelegt haben.",
    a: ["kann", "muss"],
    why: "kann \u2014 \u0434\u043E\u043F\u0443\u0449\u0435\u043D\u0438\u0435 \u0431\u0435\u0437 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u0438 (\xAB\u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C\xBB); muss \u2014 \u0432\u044B\u0432\u043E\u0434 \u0438\u0437 \u043E\u043F\u044B\u0442\u0430 (\xAB\u0432\u0435\u0447\u043D\u043E \u043A\u043B\u0430\u0434\u0451\u0448\u044C \u043D\u0430 \u0441\u0442\u043E\u043B\xBB). \u041E\u0431\u0430 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B: kann \u043D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u0435\u0435, muss \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u0435\u0435. \u0414\u043B\u044F \u043F\u0440\u043E\u0448\u043B\u043E\u0433\u043E: \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0439 + gelegt haben."
  },
  {
    text: "Er war gestern den ganzen Tag in Berlin. Er {0} die Besprechung nicht geleitet haben.",
    a: ["kann"],
    why: "\u0418\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 (\u043E\u043D \u0431\u044B\u043B \u0432 \u0411\u0435\u0440\u043B\u0438\u043D\u0435) \u2192 kann \u2026 nicht. \xABnicht\xBB \u0443\u0436\u0435 \u0441\u0442\u043E\u0438\u0442 \u0432 \u043A\u0430\u0434\u0440\u0435, \u0434\u044B\u0440\u043A\u0430 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E kann. \u041D\u0435 \u043F\u0443\u0442\u0430\u0442\u044C \u0441 muss nicht: \u0442\u043E \u043E\u0437\u043D\u0430\u0447\u0430\u043B\u043E \u0431\u044B \xAB\u043D\u0435 \u043E\u0431\u044F\u0437\u0430\u043D\xBB."
  },
  {
    text: "Seine Jacke h\xE4ngt noch am Haken. Er {0} nach Hause gegangen sein.",
    a: ["kann nicht"],
    why: "\u041A\u0443\u0440\u0442\u043A\u0430 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435 \u2192 \xAB\u043D\u0435 \u043C\u043E\u0433 \u0443\u0439\u0442\u0438 \u0434\u043E\u043C\u043E\u0439\xBB: kann nicht. \u0417\u0434\u0435\u0441\u044C nicht \u2014 \u0447\u0430\u0441\u0442\u044C \u043E\u0442\u0432\u0435\u0442\u0430: \u044D\u0442\u043E \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435, \u0430 \u043D\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435 \u043E\u0431\u044F\u0437\u0430\u043D\u043D\u043E\u0441\u0442\u0438 (muss nicht \u0437\u043D\u0430\u0447\u0438\u043B\u043E \u0431\u044B \xAB\u043D\u0435 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0443\u0445\u043E\u0434\u0438\u043B\xBB)."
  },
  {
    text: "Der Strand ist sauber, aber Vorsicht: Hier {0} trotzdem Glas im Sand sein.",
    a: ["kann"],
    why: "kann \u2014 \u043F\u0440\u0438\u043D\u0446\u0438\u043F\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0431\u0435\u0437 \u043E\u0446\u0435\u043D\u043A\u0438 \u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u0438: \xAB\u0437\u0434\u0435\u0441\u044C \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0441\u0442\u0435\u043A\u043B\u043E\xBB. muss \u043D\u0435\u043B\u044C\u0437\u044F: \u0447\u0438\u0441\u0442\u044B\u0439 \u043F\u043B\u044F\u0436 \u2014 \u0430\u0440\u0433\u0443\u043C\u0435\u043D\u0442 \u043F\u0440\u043E\u0442\u0438\u0432; d\xFCrfte \u0442\u043E\u0436\u0435: \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u043D\u0435 \u0441\u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u043E."
  }
];
var pick6 = (xs) => xs[Math.floor(Math.random() * xs.length)];
var cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
function nominalstil() {
  const p = pick6(NOM_STIL);
  if (Math.random() < 0.5) {
    return {
      topic: "c1-nominalstil",
      task: `Verbalstil: Forme die Nominalgruppe in einen Nebensatz mit \xAB${p.konj}\xBB um.`,
      text: `${p.nom}
{0}`,
      hint: `(${p.konj})`,
      gaps: [p.verbals],
      why: p.why
    };
  }
  return {
    topic: "c1-nominalstil",
    task: `Nominalstil: Forme den Nebensatz in eine Nominalgruppe mit \xAB${p.prep}\xBB um.`,
    text: `${p.verbals[0]}
{0}`,
    hint: `(${p.verb} \u2192 ${p.nomen})`,
    gaps: [[p.nom]],
    why: p.why
  };
}
function partizipAttribut() {
  const p = pick6(PARTIZIP_ATTR);
  if (Math.random() < 0.5) {
    return {
      topic: "c1-partizip-attribut",
      task: "Forme das Partizipialattribut in einen Relativsatz um.",
      text: `${cap(p.attr)}
{0}`,
      hint: p.kind === "PII" ? "(Partizip II \u2192 Passiv)" : "(Partizip I \u2192 aktiv)",
      gaps: [p.rels],
      why: p.why
    };
  }
  return {
    topic: "c1-partizip-attribut",
    task: "Forme den Relativsatz in ein Partizipialattribut um.",
    text: `${cap(p.rels[0])}
{0}`,
    hint: p.kind === "PII" ? "(Passiv \u2192 Partizip II)" : "(aktiv \u2192 Partizip I)",
    gaps: [[p.attr]],
    why: p.why
  };
}
function wortstellung() {
  const f = pick6(WORTSTELLUNG_C1);
  const vorne = f.kind === "als" || f.kind === "praep";
  if (Math.random() < 0.5) {
    return {
      topic: "c1-wortstellung",
      task: vorne ? "Klammere die schwere Gruppe aus: stelle sie an den Satzanfang (Position 1). \u0413\u043B\u0430\u0433\u043E\u043B \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043D\u0430 2-\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u0438." : "Stelle die Gruppe ins Nachfeld \u2014 hinter das Verb. \u041F\u0435\u0440\u0435\u0434 \u0433\u0440\u0443\u043F\u043F\u043E\u0439 \u043D\u0443\u0436\u043D\u0430 \u0437\u0430\u043F\u044F\u0442\u0430\u044F.",
      text: `${f.normal}
{0}`,
      gaps: [[f.other]],
      why: f.why
    };
  }
  return {
    topic: "c1-wortstellung",
    task: vorne ? "Forme in die normale Wortstellung um: die Gruppe zur\xFCck ins Mittelfeld." : "Stelle die Gruppe direkt hinter das Bezugsnomen.",
    text: `${f.other}
{0}`,
    gaps: [[f.normal]],
    why: f.why
  };
}
function modalitaet() {
  const f = pick6(MODALITAET_C1);
  return {
    topic: "c1-modalitaet",
    task: "Subjektive Modalit\xE4t: setze das Modalverb der Vermutung ein (muss, m\xFCsste, d\xFCrfte, kann, kann nicht).",
    text: f.text,
    gaps: [f.a],
    why: f.why
  };
}

// src/lib/de/a1.ts
var pick7 = (xs) => xs[Math.floor(Math.random() * xs.length)];
var cap2 = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
var GENUS_RU = {
  der: "\u043C\u0443\u0436\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430",
  die: "\u0436\u0435\u043D\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430",
  das: "\u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0440\u043E\u0434\u0430"
};
var WORTSTELLUNG_FRAMES = [
  { wrong: "Heute ich habe keine Zeit.", right: "Heute habe ich keine Zeit." },
  { wrong: "Morgen ich gehe ins Kino.", right: "Morgen gehe ich ins Kino." },
  { wrong: "Am Sonntag ich fahre nach Hamburg.", right: "Am Sonntag fahre ich nach Hamburg." },
  { wrong: "In Kiel ich wohne seit einem Jahr.", right: "In Kiel wohne ich seit einem Jahr." },
  { wrong: "Im Sommer wir fahren ans Meer.", right: "Im Sommer fahren wir ans Meer." },
  { wrong: "Leider er kommt heute zu sp\xE4t.", right: "Leider kommt er heute zu sp\xE4t." },
  { wrong: "Um acht Uhr der Unterricht beginnt.", right: "Um acht Uhr beginnt der Unterricht." },
  { wrong: "Danach wir essen Kuchen.", right: "Danach essen wir Kuchen." },
  { wrong: "Am Wochenende mein Bruder spielt Fu\xDFball.", right: "Am Wochenende spielt mein Bruder Fu\xDFball." },
  { wrong: "Mit dem Bus ich fahre zur Arbeit.", right: "Mit dem Bus fahre ich zur Arbeit." },
  { wrong: "Abends meine Mutter kocht Suppe.", right: "Abends kocht meine Mutter Suppe." },
  { wrong: "Jetzt ich habe Hunger.", right: "Jetzt habe ich Hunger." },
  { wrong: "Heute Abend ich gehe ins Kino.", right: "Heute Abend gehe ich ins Kino." },
  {
    wrong: "Um sieben ich stehe auf.",
    right: "Um sieben stehe ich auf.",
    note: "\u0413\u043B\u0430\u0433\u043E\u043B \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439: \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 auf- \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u0441\u0430\u043C\u043E\u043C \u043A\u043E\u043D\u0446\u0435."
  },
  { wrong: "Im Winter wir fahren oft in die Berge.", right: "Im Winter fahren wir oft in die Berge." }
];
function wortstellung2() {
  const f = pick7(WORTSTELLUNG_FRAMES);
  return {
    topic: "a1-wortstellung",
    task: "Der Satz ist falsch. \u041F\u043E\u0441\u0442\u0430\u0432\u044C \u0433\u043B\u0430\u0433\u043E\u043B \u043D\u0430 \u0432\u0442\u043E\u0440\u0443\u044E \u043F\u043E\u0437\u0438\u0446\u0438\u044E \u0438 \u0432\u0432\u0435\u0434\u0438 \u0438\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0446\u0435\u043B\u0438\u043A\u043E\u043C.",
    text: `${f.wrong}
{0}`,
    gaps: [[f.right]],
    why: `\u041A\u0430\u0440\u043A\u0430\u0441: \u043F\u043E\u0437\u0438\u0446\u0438\u044F 1 \u2014 \u0447\u0442\u043E \u0443\u0433\u043E\u0434\u043D\u043E, \u043F\u043E\u0437\u0438\u0446\u0438\u044F 2 \u2014 \u0432\u0441\u0435\u0433\u0434\u0430 \u0433\u043B\u0430\u0433\u043E\u043B. \u041F\u0435\u0440\u0432\u043E\u0435 \u043C\u0435\u0441\u0442\u043E \u0437\u0430\u043D\u044F\u0442\u043E \u043D\u0435 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C, \u0437\u043D\u0430\u0447\u0438\u0442 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u043F\u0435\u0440\u0435\u0435\u0437\u0436\u0430\u0435\u0442 \u0441\u0440\u0430\u0437\u0443 \u0437\u0430 \u0433\u043B\u0430\u0433\u043E\u043B: \xAB${f.right}\xBB. ` + (f.note ?? "\u0413\u043B\u0430\u0433\u043E\u043B \u043D\u0435\u043B\u044C\u0437\u044F \u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0442\u0440\u0435\u0442\u044C\u0438\u043C \u2014 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0440\u0430\u0441\u0441\u044B\u043F\u0430\u0435\u0442\u0441\u044F.")
  };
}
var EIN = {
  der: ["ein", "einen"],
  die: ["eine", "eine"],
  das: ["ein", "ein"]
};
var KEIN = {
  der: ["kein", "keinen"],
  die: ["keine", "keine"],
  das: ["kein", "kein"]
};
var UNCOUNT = [
  { word: "Zeit", genus: "die", text: "Ich habe {0} Zeit." },
  { word: "Lust", genus: "die", text: "Ich habe {0} Lust." },
  { word: "Angst", genus: "die", text: "Ich habe {0} Angst." },
  { word: "Arbeit", genus: "die", text: "Ich habe {0} Arbeit." },
  { word: "Geld", genus: "das", text: "Ich habe {0} Geld." },
  { word: "Hunger", genus: "der", text: "Ich habe {0} Hunger." },
  { word: "Durst", genus: "der", text: "Ich habe {0} Durst." },
  { word: "Urlaub", genus: "der", text: "Ich habe {0} Urlaub." },
  { word: "Unterricht", genus: "der", text: "Wir haben heute {0} Unterricht." }
];
var KAUF = /* @__PURE__ */ new Set([
  "Tisch",
  "Stuhl",
  "Schrank",
  "Apfel",
  "Hund",
  "Wagen",
  "Schl\xFCssel",
  "Kuchen",
  "Saft",
  "Fisch",
  "Salat",
  "Computer",
  "Roman",
  "Regenschirm",
  "Bleistift",
  "Mantel",
  "Rock",
  "Hut",
  "Tasche",
  "Flasche",
  "Tasse",
  "Zeitung",
  "Zeitschrift",
  "Karte",
  "Lampe",
  "Blume",
  "Pflanze",
  "Hose",
  "Jacke",
  "Buch",
  "Heft",
  "Auto",
  "Fahrrad",
  "Brot",
  "Bier",
  "Ei",
  "Bild",
  "Foto",
  "Telefon",
  "Handy",
  "Radio",
  "Regal",
  "Sofa",
  "Messer",
  "Glas",
  "Kleid",
  "Hemd",
  "K\xFChlschrank",
  "Drucker",
  "L\xF6ffel",
  "Teller",
  "Becher",
  "Brille",
  "Geschenk"
]);
var NOM_AUS = /* @__PURE__ */ new Set([
  "der Abend",
  "der Monat",
  "der Winter",
  "der Sommer",
  "der Tag",
  "das Jahr",
  "das Wochenende",
  "der Preis",
  "der Beruf",
  "der Vertrag"
]);
var EIN_AKK_FRAMES = [
  "Ich habe {0} {1}.",
  "Ich kaufe {0} {1}.",
  "Ich suche {0} {1}.",
  "Ich brauche {0} {1}."
];
var KEIN_AKK_FRAMES = [
  "Ich habe {0} {1}.",
  "Ich kaufe {0} {1}.",
  "Ich brauche {0} {1}."
];
function artikelUnbest() {
  const kasusNote = (kasus, genus) => kasus === "nom" ? "Nominativ: \u0444\u043E\u0440\u043C\u0430 \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u0442 \u0440\u043E\u0434\u0430." : genus === "der" ? "Akkusativ: \u0442\u043E\u043B\u044C\u043A\u043E \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 -en." : "Akkusativ: \u0443 \u0436\u0435\u043D\u0441\u043A\u043E\u0433\u043E \u0438 \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0440\u043E\u0434\u0430 \u0444\u043E\u0440\u043C\u0430 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 Nominativ.";
  if (Math.random() < 0.5) {
    const u = pick7(UNCOUNT);
    const form2 = KEIN[u.genus][1];
    return {
      topic: "a1-artikel-unbest",
      task: "Verneine mit \xABkein\xBB. \u0412\u0432\u0435\u0434\u0438 \u0444\u043E\u0440\u043C\u0443 kein- \u0441 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435\u043C.",
      text: u.text,
      gaps: [[form2]],
      why: `\xAB${u.word}\xBB \u0441\u0442\u043E\u0438\u0442 \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u044F \u2014 \u043E\u0442\u0440\u0438\u0446\u0430\u0435\u043C \u0447\u0435\u0440\u0435\u0437 kein, kein \u0441\u043A\u043B\u043E\u043D\u044F\u0435\u0442\u0441\u044F \u043A\u0430\u043A ein. \u0417\u0434\u0435\u0441\u044C ${GENUS_RU[u.genus]} \u2192 ${form2}.`
    };
  }
  if (Math.random() < 0.5) {
    const x2 = pick7(NOUNS.filter((z) => KAUF.has(bare(z))));
    const form2 = KEIN[x2.genus][1];
    const frame2 = pick7(KEIN_AKK_FRAMES);
    return {
      topic: "a1-artikel-unbest",
      task: "Verneine mit \xABkein\xBB. \u0412\u0432\u0435\u0434\u0438 \u0444\u043E\u0440\u043C\u0443 kein- \u0441 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435\u043C.",
      text: frame2.replace("{1}", bare(x2)),
      gaps: [[form2]],
      why: `\xAB${bare(x2)}\xBB \u2014 ${GENUS_RU[x2.genus]}, Akkusativ. kein \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u0442\u0435 \u0436\u0435 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F, \u0447\u0442\u043E ein \u2192 ${form2} ${bare(x2)}. ${kasusNote("akk", x2.genus)}`
    };
  }
  const nom = Math.random() < 0.5;
  const x = nom ? pick7(NOUNS.filter((z) => !NOM_AUS.has(z.nom))) : pick7(NOUNS.filter((z) => KAUF.has(bare(z))));
  const form = EIN[x.genus][nom ? 0 : 1];
  const frame = nom ? "Das ist {0} {1}." : pick7(EIN_AKK_FRAMES);
  return {
    topic: "a1-artikel-unbest",
    task: "Setze \xABein\xBB in der richtigen Form ein. \u0424\u043E\u0440\u043C\u0430 \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0440\u043E\u0434\u0430 (\u0438 \u043F\u0430\u0434\u0435\u0436\u0430).",
    text: frame.replace("{1}", bare(x)),
    gaps: [[form]],
    why: `\xAB${bare(x)}\xBB \u2014 ${GENUS_RU[x.genus]}. ` + (nom ? "Nominativ: " : "Akkusativ: ") + `${form} ${bare(x)}. ${kasusNote(nom ? "nom" : "akk", x.genus)}`
  };
}
var NEGATION_FRAMES = [
  {
    text: "Ich habe {0} Zeit.",
    answer: "keine",
    why: "Zeit \u2014 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u044F \u2192 \u043E\u0442\u0440\u0438\u0446\u0430\u0435\u043C \u0447\u0435\u0440\u0435\u0437 kein; \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434 \u2192 keine."
  },
  {
    text: "Er kommt heute {0}.",
    answer: "nicht",
    why: "\u041E\u0442\u0440\u0438\u0446\u0430\u0435\u0442\u0441\u044F \u0433\u043B\u0430\u0433\u043E\u043B (kommt) \u2192 nicht, \u0438 nicht \u0441\u0442\u043E\u0438\u0442 \u0432 \u0441\u0430\u043C\u043E\u043C \u043A\u043E\u043D\u0446\u0435."
  },
  {
    text: "Das Auto ist {0} neu.",
    answer: "nicht",
    why: "\u041E\u0442\u0440\u0438\u0446\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043B\u0430\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 (neu) \u2192 nicht. kein \u043F\u0435\u0440\u0435\u0434 \u043F\u0440\u0438\u043B\u0430\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u043C \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D."
  },
  {
    text: "Ich trinke {0} Kaffee.",
    answer: "keinen",
    why: "\u041E\u0442\u0440\u0438\u0446\u0430\u0435\u0442\u0441\u044F \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 (der Kaffee) \u2192 kein; Akkusativ \u043C\u0443\u0436\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430 \u2192 keinen."
  },
  {
    text: "Das ist {0} mein Buch.",
    answer: "nicht",
    why: "\u041F\u0435\u0440\u0435\u0434 \u043F\u0440\u0438\u0442\u044F\u0436\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u043C \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u0435\u043C (mein) \u0441\u0442\u043E\u0438\u0442 nicht, \u043D\u0435 kein."
  },
  {
    text: "Wir haben heute {0} Unterricht.",
    answer: "keinen",
    why: "Unterricht \u2014 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u044F, \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434 \u2192 keinen."
  },
  {
    text: "Ich habe {0} Hunger.",
    answer: "keinen",
    why: "Hunger \u2014 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u044F, \u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434 \u2192 keinen."
  },
  {
    text: "Ich habe {0} Geld.",
    answer: "kein",
    why: "Geld \u2014 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u044F, \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434 \u2192 kein (\u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F \u043D\u0435\u0442)."
  },
  {
    text: "Ich wohne {0} in Kiel.",
    answer: "nicht",
    why: "\u041E\u0442\u0440\u0438\u0446\u0430\u0435\u0442\u0441\u044F \u0433\u043B\u0430\u0433\u043E\u043B (wohne) \u2192 nicht."
  },
  {
    text: "Ich habe {0} Fragen.",
    answer: "keine",
    why: "Fragen \u2014 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u044F \u2192 keine (\u0432\u043E \u043C\u043D. \u0447. kein \u0432\u0441\u0435\u0433\u0434\u0430 \u0441 -e)."
  },
  {
    text: "Ich bin {0} m\xFCde.",
    answer: "nicht",
    why: "\u041E\u0442\u0440\u0438\u0446\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043B\u0430\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 (m\xFCde) \u2192 nicht."
  },
  {
    text: "Ich habe {0} Lust.",
    answer: "keine",
    why: "Lust \u2014 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u044F, \u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434 \u2192 keine."
  },
  {
    text: "Ich verstehe die Aufgabe {0}.",
    answer: "nicht",
    why: "\u0415\u0441\u0442\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u044B\u0439 \u0430\u0440\u0442\u0438\u043A\u043B\u044C (die) \u2192 nicht; nicht \u0438\u0434\u0451\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F."
  },
  {
    text: "Ich habe {0} Auto.",
    answer: "kein",
    why: "Auto \u2014 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u044F, \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434 \u2192 kein."
  },
  {
    text: "Ich m\xF6chte {0} Kuchen.",
    answer: "keinen",
    why: "\u041E\u0442\u0440\u0438\u0446\u0430\u0435\u0442\u0441\u044F \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 (der Kuchen), Akkusativ \u043C\u0443\u0436\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430 \u2192 keinen."
  }
];
function negation() {
  const f = pick7(NEGATION_FRAMES);
  return {
    topic: "a1-negation",
    task: "nicht oder kein? Erg\xE4nze den Satz. \u0415\u0441\u0442\u044C \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0431\u0435\u0437 \u0430\u0440\u0442\u0438\u043A\u043B\u044F \u2192 kein-\u0444\u043E\u0440\u043C\u0430, \u0432\u0441\u0451 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0435 \u2192 nicht.",
    text: f.text,
    gaps: [[f.answer]],
    why: f.why
  };
}
var FRAGEN_JANEIN = [
  { stmt: "Du kommst morgen.", answers: ["Kommst du morgen?"] },
  { stmt: "Du wohnst in Kiel.", answers: ["Wohnst du in Kiel?"] },
  { stmt: "Du sprichst gut Deutsch.", answers: ["Sprichst du gut Deutsch?"] },
  { stmt: "Ihr seid m\xFCde.", answers: ["Seid ihr m\xFCde?"], note: "sein \u043E\u0441\u043E\u0431\u044B\u0439: ihr seid \u2192 Seid ihr?" },
  { stmt: "Du hast heute Zeit.", answers: ["Hast du heute Zeit?"], note: "haben: du hast \u2192 Hast du?" },
  { stmt: "Ihr kommt um acht.", answers: ["Kommt ihr um acht?"] },
  { stmt: "Du arbeitest am Samstag.", answers: ["Arbeitest du am Samstag?"] },
  { stmt: "Ihr lernt Deutsch.", answers: ["Lernt ihr Deutsch?"] },
  { stmt: "Du hast eine Schwester.", answers: ["Hast du eine Schwester?"] },
  { stmt: "Ihr wohnt in Hamburg.", answers: ["Wohnt ihr in Hamburg?"] }
];
var FRAGEN_W = [
  {
    stmt: "Ich komme um acht Uhr.",
    q: "{0} kommst du?",
    answer: "Wann",
    why: "\u0421\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u044E\u0442 \u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438 (um acht) \u2192 wann. W-\u0441\u043B\u043E\u0432\u043E \u043D\u0430 \u043F\u0435\u0440\u0432\u043E\u043C \u043C\u0435\u0441\u0442\u0435, \u0433\u043B\u0430\u0433\u043E\u043B \u043D\u0430 \u0432\u0442\u043E\u0440\u043E\u043C."
  },
  {
    stmt: "Ich wohne in Kiel.",
    q: "{0} wohnst du?",
    answer: "Wo",
    why: "\u0421\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u044E\u0442 \u043E \u043C\u0435\u0441\u0442\u0435 (in Kiel) \u2192 wo."
  },
  {
    stmt: "Ich komme aus Russland.",
    q: "{0} kommst du?",
    answer: "Woher",
    why: "\u041E \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0438 (aus Russland) \u2192 woher. woher = \u043E\u0442\u043A\u0443\u0434\u0430, wohin = \u043A\u0443\u0434\u0430 \u2014 \u043D\u0435 \u043F\u0443\u0442\u0430\u0442\u044C."
  },
  {
    stmt: "Das Buch kostet zw\xF6lf Euro.",
    q: "{0} kostet das Buch?",
    answer: "Wie viel",
    why: "\u0421\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u044E\u0442 \u043E \u0446\u0435\u043D\u0435 \u2192 wie viel."
  },
  {
    stmt: "Ich lerne Deutsch f\xFCr die Arbeit.",
    q: "{0} lernst du Deutsch?",
    answer: "Warum",
    why: "\u0421\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u044E\u0442 \u043E \u043F\u0440\u0438\u0447\u0438\u043D\u0435 (f\xFCr die Arbeit) \u2192 warum."
  },
  {
    stmt: "Mein Bruder hei\xDFt Felix.",
    q: "{0} hei\xDFt dein Bruder?",
    answer: "Wie",
    why: "\u041E\u0431 \u0438\u043C\u0435\u043D\u0438 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u044E\u0442 \xABwie hei\xDFt \u2026?\xBB."
  },
  {
    stmt: "Anna wohnt in Berlin.",
    q: "{0} wohnt in Berlin?",
    answer: "Wer",
    why: "\u0421\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u044E\u0442 \u043E \u043B\u0438\u0446\u0435-\u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u043C \u2192 wer; \u0433\u043B\u0430\u0433\u043E\u043B \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043D\u0430 \u0432\u0442\u043E\u0440\u043E\u043C \u043C\u0435\u0441\u0442\u0435."
  }
];
function fragen() {
  if (Math.random() < 0.5) {
    const f2 = pick7(FRAGEN_JANEIN);
    return {
      topic: "a1-fragen",
      task: "Bilde die Ja/Nein-Frage. \u0413\u043B\u0430\u0433\u043E\u043B \u2014 \u043D\u0430 \u043F\u0435\u0440\u0432\u043E\u0435 \u043C\u0435\u0441\u0442\u043E, \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u0441\u0440\u0430\u0437\u0443 \u0437\u0430 \u043D\u0438\u043C.",
      text: `${f2.stmt}
{0}`,
      gaps: [f2.answers],
      why: f2.note ?? `\u0414\u0430/\u043D\u0435\u0442-\u0432\u043E\u043F\u0440\u043E\u0441: \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u0432\u0441\u0442\u0430\u0451\u0442 \u043D\u0430 \u043F\u0435\u0440\u0432\u043E\u0435 \u043C\u0435\u0441\u0442\u043E, \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u0437\u0430 \u043D\u0438\u043C: \xAB${f2.answers[0]}\xBB.`
    };
  }
  const f = pick7(FRAGEN_W);
  return {
    topic: "a1-fragen",
    task: "Erg\xE4nze das Fragewort. W-\u0441\u043B\u043E\u0432\u043E \u2014 \u043D\u0430 \u043F\u0435\u0440\u0432\u043E\u0435 \u043C\u0435\u0441\u0442\u043E, \u0433\u043B\u0430\u0433\u043E\u043B \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432\u0442\u043E\u0440\u044B\u043C.",
    text: `${f.stmt}
Frage: ${f.q}`,
    hint: "(wann / wo / woher / wie / warum / wer / wie viel)",
    gaps: [[f.answer]],
    why: f.why
  };
}
var IMP_VERBS = [
  "machen",
  "kochen",
  "wohnen",
  "lernen",
  "spielen",
  "kaufen",
  "suchen",
  "h\xF6ren",
  "sagen",
  "fragen",
  "brauchen",
  "putzen",
  "telefonieren",
  "probieren",
  "kommen",
  "gehen",
  "bleiben",
  "singen",
  "bringen",
  "denken",
  "trinken",
  "finden",
  "fahren",
  "schlafen",
  "laufen"
];
var VERB_FALLBACK = {
  inf: "machen",
  pr: "mache machst macht machen macht machen",
  part: "gemacht",
  aux: "h"
};
var verb2 = (inf) => verbByInf[inf] ?? VERB_FALLBACK;
var IMP_TRENNBAR = [
  {
    person: "du",
    de: "aufstehen",
    answers: ["Steh auf!", "Stehe auf!"],
    why: "\u041E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B: \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 auf- \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446, \u043E\u0441\u043D\u043E\u0432\u0430 \u0431\u0435\u0437 -st: Steh auf! \u0424\u043E\u0440\u043C\u0430 Stehe auf! \u0442\u043E\u0436\u0435 \u0432\u0435\u0440\u043D\u0430."
  },
  {
    person: "ihr",
    de: "aufstehen",
    answers: ["Steht auf!"],
    why: "ihr-\u0444\u043E\u0440\u043C\u0430 steht + \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432 \u043A\u043E\u043D\u0435\u0446: Steht auf!"
  },
  {
    person: "Sie",
    de: "aufstehen",
    answers: ["Stehen Sie auf!"],
    why: "\u0418\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 + Sie, \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432 \u0441\u0430\u043C\u044B\u0439 \u043A\u043E\u043D\u0435\u0446: Stehen Sie auf!"
  },
  {
    person: "du",
    de: "zumachen",
    answers: ["Mach zu!", "Mache zu!"],
    why: "\u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 zu- \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446: Mach zu! (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: Mach die T\xFCr zu!)"
  },
  {
    person: "Sie",
    de: "zumachen",
    answers: ["Machen Sie zu!"],
    why: "\u0418\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 + Sie, \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432 \u0441\u0430\u043C\u044B\u0439 \u043A\u043E\u043D\u0435\u0446: Machen Sie zu!"
  },
  {
    person: "du",
    de: "anrufen",
    answers: ["Ruf an!", "Rufe an!"],
    why: "\u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 an- \u0432 \u043A\u043E\u043D\u0435\u0446, \u043E\u0441\u043D\u043E\u0432\u0430 \u0431\u0435\u0437 -st: Ruf an!"
  },
  {
    person: "Sie",
    de: "anrufen",
    answers: ["Rufen Sie an!"],
    why: "\u0418\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 + Sie: Rufen Sie an!"
  },
  {
    person: "du",
    de: "aufh\xF6ren",
    answers: ["H\xF6r auf!", "H\xF6re auf!"],
    why: "\u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 auf- \u0432 \u043A\u043E\u043D\u0435\u0446: H\xF6r auf! \u0424\u043E\u0440\u043C\u0430 H\xF6re auf! \u0442\u043E\u0436\u0435 \u0432\u0435\u0440\u043D\u0430."
  },
  {
    person: "du",
    de: "aufr\xE4umen",
    answers: ["R\xE4um auf!", "R\xE4ume auf!"],
    why: "\u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 auf- \u0432 \u043A\u043E\u043D\u0435\u0446: R\xE4um auf!"
  },
  {
    person: "ihr",
    de: "aufr\xE4umen",
    answers: ["R\xE4umt auf!"],
    why: "ihr-\u0444\u043E\u0440\u043C\u0430 r\xE4umt + \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432 \u043A\u043E\u043D\u0435\u0446: R\xE4umt auf!"
  },
  {
    person: "Sie",
    de: "mitkommen",
    answers: ["Kommen Sie mit!"],
    why: "\u0418\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 + Sie, mit- \u0432 \u043A\u043E\u043D\u0435\u0446: Kommen Sie mit!"
  },
  {
    person: "du",
    de: "mitkommen",
    answers: ["Komm mit!"],
    why: "\u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 mit- \u0432 \u043A\u043E\u043D\u0435\u0446: Komm mit!"
  },
  {
    person: "ihr",
    de: "mitbringen",
    answers: ["Bringt mit!"],
    why: "ihr-\u0444\u043E\u0440\u043C\u0430 bringt + \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0432 \u043A\u043E\u043D\u0435\u0446: Bringt mit!"
  },
  {
    person: "du",
    de: "fernsehen",
    answers: ["Sieh fern!"],
    why: "sehen \u2192 du siehst: \u0441\u0438\u043B\u044C\u043D\u0430\u044F \u043E\u0441\u043D\u043E\u0432\u0430 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F, \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 fern- \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446: Sieh fern!"
  }
];
function imperativ() {
  if (Math.random() < 0.6) {
    const v2 = verb2(pick7(IMP_VERBS));
    const pr = prForms(v2);
    const du = cap2(pr[0].slice(0, -1)) + "!";
    const duE = cap2(pr[0]) + "!";
    const ihr = cap2(pr[4]) + "!";
    const sie = cap2(pr[3]) + " Sie!";
    const umlaut = /[äöü]/.test(pr[1]) && !/[äöü]/.test(pr[0]) ? ` \u0423\u043C\u043B\u0430\u0443\u0442 \u0432 \u0438\u043C\u043F\u0435\u0440\u0430\u0442\u0438\u0432\u0435 \u0438\u0441\u0447\u0435\u0437\u0430\u0435\u0442 (du ${pr[1]} \u2192 ${du}).` : "";
    const person = pick7(["du", "ihr", "Sie"]);
    return {
      topic: "a1-imperativ",
      task: "Bilde den Imperativ. \u041D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C \u0432\u043E\u0441\u043A\u043B\u0438\u0446\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0437\u043D\u0430\u043A.",
      text: `Imperativ (${person}): ${v2.inf} \u2192 {0}`,
      gaps: [person === "du" ? [du, duE] : person === "ihr" ? [ihr] : [sie]],
      why: person === "du" ? `du-Imperativ = \u043E\u0441\u043D\u043E\u0432\u0430 \u0431\u0435\u0437 -st: ${v2.inf} \u2192 ${du}. \u0412\u0430\u0440\u0438\u0430\u043D\u0442 \u0441 -e (${duE}) \u0442\u043E\u0436\u0435 \u0432\u0435\u0440\u0435\u043D.${umlaut}` : person === "ihr" ? `ihr-Imperativ = ihr-\u0444\u043E\u0440\u043C\u0430 Pr\xE4sens \u0431\u0435\u0437 \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u044F: ihr ${pr[4]} \u2192 ${ihr}.` : `Sie-Imperativ = \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 + Sie: ${sie}. \u0411\u0435\u0437 \xABSie\xBB \u0444\u043E\u0440\u043C\u0430 \u043D\u0435 \u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u0432\u0435\u0436\u043B\u0438\u0432\u0430\u044F.`
    };
  }
  const f = pick7(IMP_TRENNBAR);
  return {
    topic: "a1-imperativ",
    task: "Bilde den Imperativ. \u041E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446.",
    text: `Imperativ (${f.person}): ${f.de} \u2192 {0}`,
    gaps: [f.answers],
    why: f.why
  };
}
var POSS_OWNERS = [
  { label: "ich", base: "mein", ru: "\u044F" },
  { label: "du", base: "dein", ru: "\u0442\u044B" },
  { label: "er", base: "sein", ru: "\u043E\u043D (\u0435\u0433\u043E)" },
  { label: "sie", base: "ihr", ru: "\u043E\u043D\u0430 (\u0435\u0451)" },
  { label: "wir", base: "unser", ru: "\u043C\u044B (\u043D\u0430\u0448)" },
  { label: "ihr", base: "euer", ru: "\u0432\u044B, \u043C\u043D. (\u0432\u0430\u0448)" },
  { label: "Sie", base: "Ihr", ru: "\u0412\u044B, \u0432\u0435\u0436\u043B\u0438\u0432\u043E (\u0412\u0430\u0448)" }
];
var possForm = (base, genus) => {
  if (genus !== "die") return base;
  return base === "euer" ? "eure" : base + "e";
};
var POSS_AUS = /* @__PURE__ */ new Set([
  "der Junge",
  "der Student",
  "der Mensch",
  "der Nachbar",
  "der Kollege",
  "der Kunde",
  "der Polizist",
  "der Tourist",
  "der Abend",
  "der Monat",
  "der Winter",
  "der Sommer",
  "der Tag",
  "das Jahr",
  "das Wochenende"
]);
var POSS_PERSONS = /* @__PURE__ */ new Set([
  "der Lehrer",
  "der Freund",
  "der Vater",
  "der Bruder",
  "der Sohn",
  "die Frau",
  "die Mutter",
  "die Schwester",
  "die Tochter",
  "die Freundin",
  "die Lehrerin",
  "das Kind",
  "das M\xE4dchen",
  "der Hund"
]);
function possessiv() {
  const o = pick7(POSS_OWNERS);
  const personFrame = Math.random() < 0.35;
  const pool = personFrame ? NOUNS.filter((z) => POSS_PERSONS.has(z.nom)) : NOUNS.filter((z) => !POSS_AUS.has(z.nom));
  const x = pick7(pool);
  const form = possForm(o.base, x.genus);
  const frame = personFrame ? "Morgen kommt {0} {1}." : "Das ist {0} {1}.";
  return {
    topic: "a1-possessiv",
    task: "Setze den Possessivartikel ein. \u0422\u043E\u043B\u044C\u043A\u043E Nominativ: \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0440\u043E\u0434\u0430 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E.",
    text: frame.replace("{1}", bare(x)),
    hint: `(${o.label} = ${o.ru})`,
    gaps: [[form]],
    why: `\u0412\u043B\u0430\u0434\u0435\u043B\u0435\u0446 ${o.label} (${o.ru}) \u2192 \u043E\u0441\u043D\u043E\u0432\u0430 \xAB${o.base}\xBB. \xAB${bare(x)}\xBB \u2014 ${GENUS_RU[x.genus]}, Nominativ \u2192 ${form} ${bare(x)}. ` + (o.base === "euer" && x.genus === "die" ? "euer \u0442\u0435\u0440\u044F\u0435\u0442 -e- \u043F\u0435\u0440\u0435\u0434 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435\u043C: euer \u2192 eure." : o.base === "euer" ? "\u041E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E: \u0443 \u0436\u0435\u043D\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430 euer \u0442\u0435\u0440\u044F\u0435\u0442 -e- \u2192 eure." : "\u041E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0440\u043E\u0434, \u0430 \u043D\u0435 \u043E\u0441\u043D\u043E\u0432\u0430: \u0443 \u0436\u0435\u043D\u0441\u043A\u043E\u0433\u043E \u0440\u043E\u0434\u0430 \u0431\u044B\u043B\u043E \u0431\u044B \u0441 -e.") + (o.base === "ihr" || o.base === "Ihr" ? " ihr = \u0435\u0451, Ihr = \u0412\u0430\u0448, sein = \u0435\u0433\u043E \u2014 \u043E\u0441\u043D\u043E\u0432\u0430 \u043F\u0440\u043E \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0430, \u043D\u0435 \u043F\u0440\u043E \u0440\u043E\u0434." : "")
  };
}

// src/lib/de/a2.ts
var pick8 = (xs) => xs[Math.floor(Math.random() * xs.length)];
var cap3 = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
var nounOf = (nom) => NOUNS.find((x) => x.nom === nom) ?? NOUNS[0];
var verbOf = (inf) => verbByInf[inf];
var PRONOUNS = ["ich", "du", "er", "wir", "ihr", "sie"];
var PEOPLE = [
  "der Lehrer",
  "der Freund",
  "der Vater",
  "der Bruder",
  "der Sohn",
  "der Kollege",
  "der Nachbar",
  "der Junge",
  "der Student",
  "der Polizist",
  "der Tourist",
  "der Kunde",
  "die Frau",
  "die Mutter",
  "die Schwester",
  "die Tochter",
  "die Freundin",
  "die Lehrerin",
  "das Kind",
  "das M\xE4dchen"
];
var PRAET_A2 = {
  war: ["war", "warst", "war", "waren", "wart", "waren"],
  hatte: ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"],
  konnte: ["konnte", "konntest", "konnte", "konnten", "konntet", "konnten"],
  musste: ["musste", "musstest", "musste", "mussten", "musstet", "mussten"],
  wollte: ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"],
  durfte: ["durfte", "durftest", "durfte", "durften", "durftet", "durften"],
  sollte: ["sollte", "solltest", "sollte", "sollten", "solltet", "sollten"]
};
var PRAET_A2_LABEL = {
  war: "sein",
  hatte: "haben",
  konnte: "k\xF6nnen",
  musste: "m\xFCssen",
  wollte: "wollen",
  durfte: "d\xFCrfen",
  sollte: "sollen"
};
var PRAET_A2_FRAMES = [
  { text: "{Pron} {0} gestern den ganzen Tag zu Hause.", verb: "war" },
  { text: "{Pron} {0} letzte Woche krank.", verb: "war" },
  { text: "{Pron} {0} als Kind oft im Garten.", verb: "war" },
  { text: "{Pron} {0} gestern keine Zeit.", verb: "hatte" },
  { text: "{Pron} {0} als Kind ein altes Fahrrad.", verb: "hatte" },
  { text: "{Pron} {0} gestern nicht kommen.", verb: "konnte" },
  { text: "{Pron} {0} als Kind schon sehr gut schwimmen.", verb: "konnte" },
  { text: "{Pron} {0} gestern bis sp\xE4t in die Nacht arbeiten.", verb: "musste" },
  { text: "{Pron} {0} heute fr\xFCher nach Hause gehen.", verb: "musste" },
  { text: "{Pron} {0} als Kind immer Fu\xDFballspieler werden.", verb: "wollte" },
  { text: "{Pron} {0} am Wochenende l\xE4nger schlafen.", verb: "wollte" },
  { text: "{Pron} {0} als Kind nicht ins Kino.", verb: "durfte" },
  { text: "{Pron} {0} das Auto nicht nehmen.", verb: "durfte" },
  { text: "{Pron} {0} f\xFCr die Pr\xFCfung mehr \xFCben.", verb: "sollte" },
  { text: "{Pron} {0} gestern fr\xFCher kommen.", verb: "sollte" }
];
function praeteritumA2() {
  const f = pick8(PRAET_A2_FRAMES);
  const p = Math.floor(Math.random() * 6);
  const form = PRAET_A2[f.verb][p];
  const label = PRAET_A2_LABEL[f.verb];
  const row = PRAET_A2[f.verb];
  return {
    topic: "a2-praeteritum",
    task: "Pr\xE4teritum: \u043F\u043E\u0441\u0442\u0430\u0432\u044C \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u043F\u0440\u043E\u0448\u0435\u0434\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F (sein / haben / Modalverb).",
    text: cap3(f.text.replace("{Pron}", PRONOUNS[p])),
    hint: `(${label})`,
    gaps: [[form]],
    why: `${label} \u0432 Pr\xE4teritum \u2014 \u0444\u043E\u0440\u043C\u044B \u043D\u0430\u0438\u0437\u0443\u0441\u0442\u044C: ich ${row[0]}, du ${row[1]}, er ${row[2]}, wir ${row[3]}, ihr ${row[4]}, sie ${row[5]}. \u0417\u0434\u0435\u0441\u044C ${PRONOUNS[p]} \u2192 ${form}. sein, haben \u0438 \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0435 \u0436\u0438\u0432\u0443\u0442 \u0432 Pr\xE4teritum \u0438 \u0432 \u0443\u0441\u0442\u043D\u043E\u0439 \u0440\u0435\u0447\u0438: \xABich war m\xFCde\xBB, \xABich musste arbeiten\xBB \u2014 Perfekt (\xABich bin gewesen\xBB, \xABich habe gemusst\xBB) \u0442\u0430\u043A \u043F\u043E\u0447\u0442\u0438 \u043D\u0435 \u0433\u043E\u0432\u043E\u0440\u044F\u0442.`
  };
}
var KONN_FRAMES2 = [
  {
    a: "Es ist sp\xE4t,",
    b: " gehe ich ins Bett.",
    answers: ["deshalb", "darum", "deswegen"],
    why: "\u041F\u043E\u0441\u043B\u0435 \u0434\u044B\u0440\u043A\u0438 \u0438\u0434\u0451\u0442 \u0438\u043D\u0432\u0435\u0440\u0441\u0438\u044F (\xABgehe ich\xBB) \u2014 \u0437\u043D\u0430\u0447\u0438\u0442, \u044D\u0442\u043E \u043D\u0430\u0440\u0435\u0447\u0438\u0435, \u0430 \u043D\u0435 \u0441\u043E\u044E\u0437: deshalb/darum/deswegen. \u0421\u043E\u044E\u0437\u044B (und, aber, denn) \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0441\u043B\u043E\u0432 \u043D\u0435 \u043C\u0435\u043D\u044F\u044E\u0442."
  },
  {
    a: "Es regnet,",
    b: " bleiben wir zu Hause.",
    answers: ["deshalb", "darum", "deswegen"],
    why: "\u0421\u043B\u0435\u0434\u0441\u0442\u0432\u0438\u0435 \u0438\u0437 \u043F\u0440\u0438\u0447\u0438\u043D\u044B + \u0438\u043D\u0432\u0435\u0440\u0441\u0438\u044F \u043F\u043E\u0441\u043B\u0435 \u0434\u044B\u0440\u043A\u0438 \u2192 deshalb. \xABEs regnet, deshalb bleiben wir zu Hause\xBB: deshalb \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u043F\u043E\u0437\u0438\u0446\u0438\u044E 1, \u0433\u043B\u0430\u0433\u043E\u043B \u0432\u0441\u0442\u0430\u0451\u0442 \u043D\u0430 2-\u044E."
  },
  {
    a: "Ich habe keine Zeit,",
    b: " ich muss bis acht arbeiten.",
    answers: ["denn"],
    why: "\u0414\u0430\u043B\u044C\u0448\u0435 \u2014 \u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0441\u043B\u043E\u0432 \u0438 \u043F\u0440\u0438\u0447\u0438\u043D\u0430 \u2192 denn. weil \u043D\u0435\u043B\u044C\u0437\u044F: \u0443 weil \u0433\u043B\u0430\u0433\u043E\u043B \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 (\xABweil ich bis acht arbeiten muss\xBB); deshalb \u043D\u0435\u043B\u044C\u0437\u044F \u2014 \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0433\u043E \u0431\u044B\u043B\u0430 \u0431\u044B \u0438\u043D\u0432\u0435\u0440\u0441\u0438\u044F."
  },
  {
    a: "Ich komme nicht mit,",
    b: " ich muss arbeiten.",
    answers: ["denn"],
    why: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043F\u0440\u0438 \u0446\u0435\u043B\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u0441\u043B\u043E\u0432 \u2192 denn. \u0421\u043C\u044B\u0441\u043B \xAB\u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E\xBB, \u0430 \xAB\u043D\u043E\xBB \u0437\u0434\u0435\u0441\u044C \u043D\u0435 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442: \u043D\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F."
  },
  {
    a: "Das Essen riecht gut,",
    b: " es schmeckt nicht.",
    answers: ["aber"],
    why: "\u041F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u0435 (\xAB\u043F\u0430\u0445\u043D\u0435\u0442 \u0445\u043E\u0440\u043E\u0448\u043E, \u043D\u043E \u043D\u0430 \u0432\u043A\u0443\u0441 \u043D\u0435\u0442\xBB) \u2192 aber. und \u043E\u0437\u043D\u0430\u0447\u0430\u0435\u0442 \xAB\u0438\xBB, \u0438 \u043E\u043D \u0441\u043E\u0435\u0434\u0438\u043D\u044F\u043B \u0431\u044B \u0441\u043E\u0433\u043B\u0430\u0441\u0443\u044E\u0449\u0438\u0435\u0441\u044F \u0444\u0430\u043A\u0442\u044B."
  },
  {
    a: "F\xE4hrst du mit dem Bus,",
    b: " nimmst du den Zug?",
    answers: ["oder"],
    why: "\u0412\u044B\u0431\u043E\u0440 \u043C\u0435\u0436\u0434\u0443 \u0434\u0432\u0443\u043C\u044F \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430\u043C\u0438 \u2192 oder. \u0412\u043E\u043F\u0440\u043E\u0441-\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u0430: \xAB\u043D\u0430 \u0430\u0432\u0442\u043E\u0431\u0443\u0441\u0435 \u0438\u043B\u0438 \u043D\u0430 \u043F\u043E\u0435\u0437\u0434\u0435?\xBB."
  },
  {
    a: "Kommst du heute,",
    b: " kommst du morgen?",
    answers: ["oder"],
    why: "\u0414\u0432\u0435 \u0432\u0437\u0430\u0438\u043C\u043E\u0438\u0441\u043A\u043B\u044E\u0447\u0430\u044E\u0449\u0438\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u2192 oder. und \u0437\u0434\u0435\u0441\u044C \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D: \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u043C\u043E\u0436\u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u0434\u043D\u043E."
  },
  {
    a: "Er spricht Deutsch",
    b: " Englisch, beide Sprachen sehr gut.",
    answers: ["und"],
    why: "\u041E\u0434\u043D\u043E\u0440\u043E\u0434\u043D\u044B\u0435 \u0434\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0438 \u0443\u0442\u043E\u0447\u043D\u0435\u043D\u0438\u0435 \xABbeide\xBB \u2192 und. oder \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0440\u0435\u0447\u0438\u043B \u0431\u044B \u0441\u043B\u043E\u0432\u0443 \xAB\u043E\u0431\u0430\xBB, aber \u0438 sondern \u0442\u0440\u0435\u0431\u0443\u044E\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u044F/\u043E\u0442\u0440\u0438\u0446\u0430\u043D\u0438\u044F."
  },
  {
    a: "Ich trinke keinen Kaffee,",
    b: " ich trinke viel Tee.",
    answers: ["sondern"],
    why: "\u041F\u043E\u0441\u043B\u0435 \u043E\u0442\u0440\u0438\u0446\u0430\u043D\u0438\u044F \xABnicht/kein\xBB, \u043A\u043E\u0433\u0434\u0430 \u0432\u0442\u043E\u0440\u0430\u044F \u0447\u0430\u0441\u0442\u044C \u0447\u0442\u043E-\u0442\u043E \u0417\u0410\u041C\u0415\u041D\u042F\u0415\u0422, \u0441\u0442\u043E\u0438\u0442 sondern: \xAB\u043D\u0435 \u043A\u043E\u0444\u0435, \u0430 \u0447\u0430\u0439\xBB. \u042D\u0442\u043E \u0435\u0433\u043E \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E \u0432 \u044F\u0437\u044B\u043A\u0435."
  }
];
function konnektorenA2() {
  const f = pick8(KONN_FRAMES2);
  return {
    topic: "a2-konnektoren",
    task: "Setze die passende Konjunktion ein: und, aber, oder, denn, sondern, deshalb.",
    text: `${f.a} {0}${f.b}`,
    hint: "(und / aber / oder / denn / sondern / deshalb)",
    gaps: [f.answers],
    why: f.why
  };
}
var OB_TRANS = [
  { q: "Kommt er?", stem: "Ich wei\xDF nicht, \u2026", answer: "ob er kommt" },
  { q: "Hat sie Zeit?", stem: "Sie fragt, \u2026", answer: "ob sie Zeit hat" },
  { q: "Wohnt Anna in Kiel?", stem: "Ich wei\xDF nicht, \u2026", answer: "ob Anna in Kiel wohnt" },
  { q: "Bleibt das Wetter sch\xF6n?", stem: "Wir wollen wissen, \u2026", answer: "ob das Wetter sch\xF6n bleibt" },
  { q: "Ist der Zug schon weg?", stem: "Ich wei\xDF nicht, \u2026", answer: "ob der Zug schon weg ist" },
  { q: "Kann er heute kommen?", stem: "Sie fragt, \u2026", answer: "ob er heute kommen kann" },
  { q: "War sie gestern im B\xFCro?", stem: "Er fragt, \u2026", answer: "ob sie gestern im B\xFCro war" }
];
var OB_WENN = [
  {
    text: "Ich wei\xDF nicht, {0} er Zeit hat.",
    answer: "ob",
    why: "\u042D\u0442\u043E \u043F\u0435\u0440\u0435\u0441\u043A\u0430\u0437 \u0434\u0430/\u043D\u0435\u0442-\u0432\u043E\u043F\u0440\u043E\u0441\u0430 \xABHat er Zeit?\xBB \u2192 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u044B\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u0441 ob (= \xAB\u043B\u0438\xBB). wenn \u043E\u0437\u043D\u0430\u0447\u0430\u043B \u0431\u044B \xAB\u043A\u043E\u0433\u0434\u0430\xBB \u0438 \u0441\u043C\u044B\u0441\u043B\u0430 \u043D\u0435 \u0434\u0430\u0451\u0442."
  },
  {
    text: "Ich wei\xDF nicht, {0} das stimmt.",
    answer: "ob",
    why: "\xAB\u043D\u0435 \u0437\u043D\u0430\u044E, \u043F\u0440\u0430\u0432\u0434\u0430 \u043B\u0438 \u044D\u0442\u043E\xBB \u2192 ob. \u041E\u0431\u0440\u0430\u0442\u0438 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435: \u0432 \u043A\u043E\u043D\u0446\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u043D\u0435\u0442 \u0432\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0437\u043D\u0430\u043A\u0430 \u2014 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u044B\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u0435\u0433\u043E \u043D\u0435 \u0431\u0435\u0440\u0451\u0442."
  },
  {
    text: "Sie fragt, {0} ich mitkomme.",
    answer: "ob",
    why: "\xAB\u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u0442, \u0438\u0434\u0443 \u043B\u0438 \u044F\xBB \u2192 ob. \u0412\u043D\u0443\u0442\u0440\u0438 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u043A\u043E\u043D\u0446\u0435: \u2026, ob ich mitkomme."
  },
  {
    text: "Er fragt, {0} der Zug Versp\xE4tung hat.",
    answer: "ob",
    why: "\u041A\u043E\u0441\u0432\u0435\u043D\u043D\u044B\u0439 \u0434\u0430/\u043D\u0435\u0442-\u0432\u043E\u043F\u0440\u043E\u0441 \u2192 ob. \u0413\u043B\u0430\u0433\u043E\u043B hat \u0441\u0442\u043E\u0438\u0442 \u0432 \u043A\u043E\u043D\u0446\u0435 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E."
  },
  {
    text: "{0} ich Zeit habe, komme ich dich besuchen.",
    answer: "wenn",
    why: "\xAB\u043A\u043E\u0433\u0434\u0430/\u0435\u0441\u043B\u0438 \u0443 \u043C\u0435\u043D\u044F \u0431\u0443\u0434\u0435\u0442 \u0432\u0440\u0435\u043C\u044F\xBB \u2014 \u0432\u0440\u0435\u043C\u044F/\u0443\u0441\u043B\u043E\u0432\u0438\u0435 \u2192 wenn. ob \u043D\u0435\u043B\u044C\u0437\u044F: \u0437\u0434\u0435\u0441\u044C \u043D\u0435\u0442 \u043F\u0435\u0440\u0435\u0441\u043A\u0430\u0437\u0430 \u0432\u043E\u043F\u0440\u043E\u0441\u0430."
  },
  {
    text: "{0} es regnet, bleiben wir zu Hause.",
    answer: "wenn",
    why: "\u0423\u0441\u043B\u043E\u0432\u0438\u0435 (\xAB\u0435\u0441\u043B\u0438 \u043F\u043E\u0439\u0434\u0451\u0442 \u0434\u043E\u0436\u0434\u044C\xBB) \u2192 wenn. \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u0441 \u0433\u043B\u0430\u0433\u043E\u043B\u0430: bleiben wir."
  },
  {
    text: "Wir gehen spazieren, {0} das Wetter sch\xF6n ist.",
    answer: "wenn",
    why: "\xAB\u043A\u043E\u0433\u0434\u0430 \u043F\u043E\u0433\u043E\u0434\u0430 \u0445\u043E\u0440\u043E\u0448\u0430\u044F\xBB \u2014 \u0432\u0440\u0435\u043C\u044F \u2192 wenn. ob \u0434\u0430\u043B \u0431\u044B \u0431\u0435\u0441\u0441\u043C\u044B\u0441\u043B\u0438\u0446\u0443 (\xAB\u0433\u0443\u043B\u044F\u0451\u043C, \u0445\u043E\u0440\u043E\u0448\u0430\u044F \u043B\u0438 \u043F\u043E\u0433\u043E\u0434\u0430\xBB \u2014 \u043D\u0435 \u043E \u0442\u043E\u043C \u0440\u0435\u0447\u044C)."
  },
  {
    text: "{0} ich nach Kiel kam, besuchte ich immer den Zoo.",
    answer: "wenn",
    why: "\u041C\u043D\u043E\u0433\u043E\u043A\u0440\u0430\u0442\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C (\xAB\u043A\u0430\u0436\u0434\u044B\u0439 \u0440\u0430\u0437, \u043A\u043E\u0433\u0434\u0430 \u043F\u0440\u0438\u0435\u0437\u0436\u0430\u043B\xBB) \u2192 wenn. \u041E\u0434\u0438\u043D \u0440\u0430\u0437 \u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C \u0431\u044B\u043B\u043E \u0431\u044B als, \u043D\u043E \u0437\u0434\u0435\u0441\u044C \u0441\u0442\u043E\u0438\u0442 immer \u2014 \u044D\u0442\u043E wenn."
  }
];
function nebensatzOb() {
  if (Math.random() < 0.5) {
    const f2 = pick8(OB_TRANS);
    return {
      topic: "a2-nebensatz-ob",
      task: "Verwandle die Ja/Nein-Frage in einen indirekten Fragesatz mit \xABob\xBB. \u0413\u043B\u0430\u0433\u043E\u043B \u2014 \u0432 \u043A\u043E\u043D\u0435\u0446, \u0437\u043D\u0430\u043A \u0432\u043E\u043F\u0440\u043E\u0441\u0430 \u043D\u0435 \u043D\u0443\u0436\u0435\u043D.",
      text: `${f2.q}  /  ${f2.stem}
{0}`,
      hint: "(ob)",
      gaps: [[f2.answer]],
      why: `\u041F\u0440\u044F\u043C\u043E\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u0431\u0435\u0437 \u0432\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u043B\u043E\u0432\u0430 \u2192 \u043A\u043E\u0441\u0432\u0435\u043D\u043D\u044B\u0439 \u0441 ob (= \xAB\u043B\u0438\xBB): \xAB${f2.answer}\xBB. \u0413\u043B\u0430\u0433\u043E\u043B \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0433\u043E, \u0438\u043D\u0432\u0435\u0440\u0441\u0438\u044F \u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0437\u043D\u0430\u043A \u0438\u0441\u0447\u0435\u0437\u0430\u044E\u0442. \u0421 W-\u0432\u043E\u043F\u0440\u043E\u0441\u0430\u043C\u0438 ob \u043D\u0435 \u043D\u0443\u0436\u0435\u043D: \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432\u043E\u043F\u0440\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0441\u043B\u043E\u0432\u043E (wo er wohnt).`
    };
  }
  const f = pick8(OB_WENN);
  return {
    topic: "a2-nebensatz-ob",
    task: "Setze \xABob\xBB oder \xABwenn\xBB ein.",
    text: f.text,
    hint: "(ob / wenn)",
    gaps: [[f.answer]],
    why: f.why
  };
}
var REFL_AKK = ["mich", "dich", "sich", "uns", "euch", "sich"];
var REFL_FRAMES = [
  { text: "Ich wasche {0} vor dem Abendessen.", p: 0 },
  { text: "Ich konzentriere {0} auf die Pr\xFCfung.", p: 0 },
  { text: "Du siehst {0} im Spiegel.", p: 1 },
  { text: "Du \xE4rgerst {0} \xFCber den Fehler.", p: 1 },
  { text: "Er interessiert {0} f\xFCr Musik.", p: 2 },
  { text: "Sie freut {0} auf das Wochenende.", p: 2 },
  { text: "Wir treffen {0} um acht vor dem Kino.", p: 3 },
  { text: "Wir bereiten {0} auf die Pr\xFCfung vor.", p: 3 },
  { text: "Ihr setzt {0} ans Fenster.", p: 4 },
  { text: "Ihr freut {0} auf die Ferien.", p: 4 },
  { text: "Die Kinder beeilen {0} zum Fr\xFChst\xFCck.", p: 5, subj: "Die Kinder" },
  { text: "Sie interessieren {0} f\xFCr Kunst.", p: 5 }
];
function reflexiv() {
  const f = pick8(REFL_FRAMES);
  const form = REFL_AKK[f.p];
  const subj = f.subj ?? f.text.split(" ")[0];
  return {
    topic: "a2-reflexiv",
    task: "Setze das Reflexivpronomen ein.",
    text: f.text,
    hint: "(Akkusativ)",
    gaps: [[form]],
    why: `\u0412\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E\u0438\u043C\u0435\u043D\u0438\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0442 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435: ${subj} \u2192 ${form}.` + (!/^(wir|ich|du|ihr)$/i.test(subj) ? " \u0412 3-\u043C \u043B\u0438\u0446\u0435 (\u0438 \u0443 Sie) \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u043D\u043E\u0435 \u0432\u0441\u0435\u0433\u0434\u0430 sich." : "")
  };
}
var PRAEP_FRAMES = [
  { prep: "f\xFCr", kasus: "akk", text: "Das Geschenk ist f\xFCr {0}.", pool: PEOPLE },
  {
    prep: "ohne",
    kasus: "akk",
    text: "Ich gehe nie ohne {0} aus dem Haus.",
    pool: [
      "der Schl\xFCssel",
      "der Regenschirm",
      "der Koffer",
      "der Mantel",
      "der Hut",
      "der Computer",
      "der Drucker",
      "die Brille",
      "die Tasche",
      "die Jacke",
      "die Hose",
      "das Handy",
      "das Telefon",
      "das Fahrrad",
      "das Auto",
      "das Radio",
      "das Buch"
    ]
  },
  {
    prep: "gegen",
    kasus: "akk",
    text: "Ich habe nichts gegen {0}.",
    pool: [
      "der Vertrag",
      "der Roman",
      "der Film",
      "der Beruf",
      "der Preis",
      "die Idee",
      "die Antwort",
      "die Pr\xFCfung",
      "die Wohnung",
      "die Frage",
      "die Geschichte",
      "das Problem",
      "das Ergebnis"
    ]
  },
  {
    prep: "um",
    kasus: "akk",
    text: "Ein Zaun steht um {0}.",
    pool: [
      "das Haus",
      "der Garten",
      "der Park",
      "die Schule",
      "das Kino",
      "das Theater",
      "das Museum",
      "die Bibliothek",
      "das Krankenhaus",
      "das Hotel",
      "das Restaurant",
      "der Bahnhof",
      "die Fabrik",
      "die Universit\xE4t"
    ]
  },
  {
    prep: "mit",
    kasus: "dat",
    text: "Ich fahre mit {0} zur Arbeit.",
    pool: ["der Bus", "der Zug", "der Wagen", "das Auto", "das Fahrrad"]
  },
  { prep: "mit", kasus: "dat", text: "Ich gehe mit {0} ins Kino.", pool: PEOPLE },
  {
    prep: "aus",
    kasus: "dat",
    text: "Sie kommt gerade aus {0}.",
    pool: [
      "die Stadt",
      "das Haus",
      "der Garten",
      "das B\xFCro",
      "die K\xFCche",
      "das Kino",
      "das Theater",
      "die Bibliothek",
      "das Museum",
      "das Restaurant",
      "das Hotel",
      "der Bahnhof",
      "das Krankenhaus",
      "die Schule",
      "die Fabrik",
      "die Universit\xE4t",
      "der Park"
    ]
  },
  {
    prep: "nach",
    kasus: "dat",
    text: "Nach {0} gehe ich gleich ins Bett.",
    pool: ["die Arbeit", "die Schule", "die Pr\xFCfung", "das Fr\xFChst\xFCck"]
  },
  {
    prep: "seit",
    kasus: "dat",
    text: "Wir wohnen hier seit {0}.",
    pool: ["der Winter", "der Sommer", "das Wochenende"]
  }
];
function praepositionenA2() {
  const f = pick8(PRAEP_FRAMES);
  const x = nounOf(pick8(f.pool));
  const form = phrase(x, f.kasus);
  const kasusDe = f.kasus === "akk" ? "Akkusativ" : "Dativ";
  return {
    topic: "a2-praepositionen",
    task: `Setze das Nomen mit Artikel im ${kasusDe} ein.`,
    text: f.text,
    hint: `(${x.nom})`,
    gaps: [[form]],
    why: `\xAB${f.prep}\xBB \u0432\u0441\u0435\u0433\u0434\u0430 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 ${kasusDe} (Akkusativ: durch-f\xFCr-gegen-ohne-um; Dativ: aus-bei-mit-nach-seit-von-zu). ${x.nom} \u2192 ${form}. \u0424\u043E\u0440\u043C\u0430 \u0432\u044B\u0432\u043E\u0434\u0438\u0442\u0441\u044F: \u0430\u0440\u0442\u0438\u043A\u043B\u044C \u043F\u043E \u043F\u0430\u0434\u0435\u0436\u0443, \u0443 \u0441\u043B\u0430\u0431\u044B\u0445 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F -(e)n.`
  };
}
var ART_WD = {
  der: { akk: "den", dat: "dem" },
  die: { akk: "die", dat: "der" },
  das: { akk: "das", dat: "dem" }
};
var WD_FRAMES = [
  { prep: "in", wo: "wohin", genus: "die", text: "Ich gehe {0} K\xFCche." },
  { prep: "in", wo: "wo", genus: "die", text: "Ich bin {0} K\xFCche." },
  { prep: "in", wo: "wohin", genus: "das", text: "Er stellt das Handy {0} Regal." },
  { prep: "in", wo: "wo", genus: "das", text: "Das Handy liegt {0} Regal." },
  { prep: "auf", wo: "wohin", genus: "der", text: "Ich lege das Buch {0} Tisch." },
  { prep: "auf", wo: "wo", genus: "der", text: "Das Buch liegt {0} Tisch." },
  { prep: "auf", wo: "wohin", genus: "der", text: "Die Kinder klettern {0} Baum." },
  { prep: "auf", wo: "wo", genus: "die", text: "Wir spielen nicht {0} Stra\xDFe." },
  { prep: "an", wo: "wohin", genus: "die", text: "Ich h\xE4nge das Bild {0} Wand." },
  { prep: "an", wo: "wo", genus: "die", text: "Das Bild h\xE4ngt {0} Wand." },
  { prep: "an", wo: "wohin", genus: "das", text: "Er stellt das Fahrrad {0} Haus." },
  { prep: "an", wo: "wo", genus: "das", text: "Das Fahrrad steht {0} Haus." }
];
var CONTR = {
  "in das": "ins",
  "in dem": "im",
  "an das": "ans",
  "an dem": "am"
};
function wechselpraep() {
  const f = pick8(WD_FRAMES);
  const kasus = f.wo === "wohin" ? "akk" : "dat";
  const form = `${f.prep} ${ART_WD[f.genus][kasus]}`;
  const answers = CONTR[form] ? [form, CONTR[form]] : [form];
  const other = `${f.prep} ${ART_WD[f.genus][f.wo === "wohin" ? "dat" : "akk"]}`;
  const noun = f.text.split(" ").slice(-1)[0];
  return {
    topic: "a2-wechselpraep",
    task: "Setze Pr\xE4position und Artikel ein. Frage: wohin? oder wo?",
    text: f.text,
    hint: f.wo === "wohin" ? "wohin? \u2192 Akkusativ" : "wo? \u2192 Dativ",
    gaps: [answers],
    why: f.wo === "wohin" ? `\u0412\u043E\u043F\u0440\u043E\u0441 wohin? \u2192 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0441 \u0446\u0435\u043B\u044C\u044E \u2192 Akkusativ: ${form} ${noun}. \u041F\u0440\u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u0435 wo? \u0441\u0442\u043E\u044F\u043B\u043E \u0431\u044B ${other} (Dativ).` : `\u0412\u043E\u043F\u0440\u043E\u0441 wo? \u2192 \u043D\u0430\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435 \u2192 Dativ: ${form} ${noun}. \u041F\u0440\u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u0435 wohin? \u0441\u0442\u043E\u044F\u043B\u043E \u0431\u044B ${other} (Akkusativ). \u041F\u0430\u0434\u0435\u0436 \u0440\u0435\u0448\u0430\u0435\u0442 \u0433\u043B\u0430\u0433\u043E\u043B (\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435), \u0430 \u043D\u0435 \u0441\u0430\u043C \u043F\u0440\u0435\u0434\u043C\u0435\u0442.`
  };
}
var GEN_FRAMES = [
  {
    text: "Das ist das Auto {0}.",
    pool: [
      "der Vater",
      "die Mutter",
      "der Lehrer",
      "der Freund",
      "der Kollege",
      "der Nachbar",
      "die Frau",
      "die Lehrerin",
      "der Bruder",
      "die Schwester",
      "das Kind",
      "der Junge",
      "der Student",
      "der Sohn",
      "die Tochter",
      "der Mensch"
    ]
  },
  {
    text: "Die Farbe {0} gef\xE4llt mir.",
    pool: [
      "das Auto",
      "das Zimmer",
      "das Haus",
      "die Wand",
      "das Sofa",
      "die T\xFCr",
      "das Regal",
      "das Fahrrad",
      "der Tisch",
      "der Stuhl",
      "das Bett",
      "die K\xFCche",
      "das Kleid",
      "das Buch"
    ]
  },
  {
    text: "Ich kenne die Eltern {0} gut.",
    pool: [
      "der Junge",
      "der Student",
      "der Kollege",
      "der Kunde",
      "der Nachbar",
      "das Kind",
      "das M\xE4dchen",
      "die Tochter",
      "der Sohn"
    ]
  },
  {
    text: "Der Wagen {0} steht vor der T\xFCr.",
    pool: [
      "der Vater",
      "die Mutter",
      "der Nachbar",
      "die Schwester",
      "die Frau",
      "der Lehrer",
      "der Kollege",
      "der Sohn",
      "die Tochter",
      "das Kind"
    ]
  }
];
function genitiv() {
  const f = pick8(GEN_FRAMES);
  const x = nounOf(pick8(f.pool));
  const form = phrase(x, "gen");
  const answers = !x.weak && (/(?:d|t)$/.test(bare(x)) || ["Sohn", "Stuhl"].includes(bare(x))) ? [form, `${form.slice(0, -1)}es`] : [form];
  const shown = answers[0];
  const alt = answers.length > 1 ? ` \u041F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0442\u0441\u044F \u0438 \u0444\u043E\u0440\u043C\u0430 \xAB${answers[1]}\xBB.` : "";
  const note = x.weak ? `\u0421\u043B\u0430\u0431\u043E\u0435 \u0441\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435: der Junge-\u0441\u043B\u043E\u0432\u0430 \u043F\u043E\u043B\u0443\u0447\u0430\u044E\u0442 -(e)n \u0432\u043E \u0432\u0441\u0435\u0445 \u043F\u0430\u0434\u0435\u0436\u0430\u0445, \u043A\u0440\u043E\u043C\u0435 Nominativ \u2014 -s \u043D\u0435 \u043D\u0443\u0436\u0435\u043D.` : x.genus === "die" ? `\u0416\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434 \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F \u2014 \u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0430\u0440\u0442\u0438\u043A\u043B\u044C.` : `\u041C\u0443\u0436\u0441\u043A\u043E\u0439 \u0438 \u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434: \u0430\u0440\u0442\u0438\u043A\u043B\u044C des + -(e)s \u043D\u0430 \u0441\u0430\u043C\u043E\u043C \u0441\u043B\u043E\u0432\u0435 (\u043F\u043E\u0441\u043B\u0435 s/\xDF/z/ch \u2014 es: des Hauses).`;
  return {
    topic: "a2-genitiv",
    task: "Genitiv (wessen?): \u043F\u043E\u0441\u0442\u0430\u0432\u044C \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u0441 \u0430\u0440\u0442\u0438\u043A\u043B\u0435\u043C \u0432 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0434\u0435\u0436.",
    text: f.text,
    hint: `(${x.nom})`,
    gaps: [answers],
    why: `Genitiv \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u043D\u0430 \xABwessen?\xBB: ${x.nom} \u2192 ${shown}.${alt} ${note}`
  };
}
var WERDEN = prForms(verbOf("werden"));
var FUTUR_TAILS = [
  "morgen nach Berlin ziehen.",
  "morgen nach Kiel fahren.",
  "am Wochenende kommen.",
  "n\xE4chste Woche anfangen.",
  "ihm morgen helfen.",
  "in Kiel bleiben.",
  "die Pr\xFCfung im Mai machen."
];
function futur() {
  const p = Math.floor(Math.random() * 6);
  const tail = pick8(FUTUR_TAILS);
  const form = WERDEN[p];
  return {
    topic: "a2-futur",
    task: "Futur I: \u043F\u043E\u0441\u0442\u0430\u0432\u044C \xABwerden\xBB \u0432 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0439 \u0444\u043E\u0440\u043C\u0435. \u0418\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432 \u0443\u0436\u0435 \u0441\u0442\u043E\u0438\u0442 \u0432 \u043A\u043E\u043D\u0446\u0435.",
    text: cap3(`${PRONOUNS[p]} {0} ${tail}`),
    hint: "(werden)",
    gaps: [[form]],
    why: `Futur I = werden (\u043F\u043E\u0437\u0438\u0446\u0438\u044F 2) + Infinitiv am Ende. \u0417\u0434\u0435\u0441\u044C ${PRONOUNS[p]} \u2192 ${form}.`
  };
}
GEN_FRAMES.push(...GEN_FRAMES_EXTRA);
KONN_FRAMES2.push(...KONN_FRAMES_EXTRA);
OB_TRANS.push(...OB_TRANS_EXTRA);

// src/lib/de/gen.ts
var pick9 = (xs) => xs[Math.floor(Math.random() * xs.length)];
var cap4 = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
function shape(s) {
  return s.replace(/ß/g, "ss").replace(/[äöü]/g, (c) => ({ \u00E4: "ae", \u00F6: "oe", \u00FC: "ue" })[c] ?? c).replace(/[.,!?;:„“"'’]/g, "").replace(/\s+/g, " ").trim();
}
function judge(given, accept) {
  const g = shape(given);
  if (!g) return "bad";
  if (accept.some((a) => shape(a) === g)) return "ok";
  const gl = g.toLowerCase();
  if (accept.some((a) => shape(a).toLowerCase() === gl)) return "case";
  return "bad";
}
function check(given, accept) {
  return judge(given, accept) === "ok";
}
var verb3 = (inf) => verbByInf[inf] ?? VERBS[0];
var trap = (wrong, note) => ({ wrong, note });
var PR6 = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
function perfekt() {
  const mode = pick9(["A", "A", "B", "B", "C"]);
  if (mode === "C") {
    const f2 = pick9(PERFEKT.filter((x) => !verb3(x.v).pre));
    const v3 = verb3(f2.v);
    const aux2 = hilfsverb(v3, f2.p);
    const text = f2.text.replace("{0}", aux2).replace("{1}", "{0}");
    return {
      topic: "a2-perfekt",
      task: "Erg\xE4nze nur das Partizip II \u2014 \u0432\u0441\u043F\u043E\u043C\u043E\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0443\u0436\u0435 \u0441\u0442\u043E\u0438\u0442.",
      text,
      hint: `(${v3.inf})`,
      gaps: [[v3.part]],
      why: `\u0412\u0441\u043F\u043E\u043C\u043E\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0443\u0436\u0435 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435 (${aux2}), \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E Partizip II: ${v3.inf} \u2192 ${v3.part}.` + (v3.pre ? ` \u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \xAB${v3.pre}\xBB \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F, ge- \u0441\u0442\u043E\u0438\u0442 \u0432\u043D\u0443\u0442\u0440\u0438: ${v3.pre}ge\u2026.` : /^(be|ge|er|ver|zer|ent|emp|miss)/.test(v3.inf) ? " \u041D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u2014 ge- \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F." : "")
    };
  }
  const f = mode === "B" ? pick9(PERFEKT_INV) : pick9(PERFEKT);
  const v2 = verb3(f.v);
  const aux = hilfsverb(v2, f.p);
  return {
    topic: "a2-perfekt",
    task: mode === "B" ? "Erg\xE4nze das Perfekt. \u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435: \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u043D\u0435 \u0441 \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0433\u043E \u2014 \u0433\u043B\u0430\u0433\u043E\u043B \u0434\u043E\u043B\u0436\u0435\u043D \u0432\u0441\u0442\u0430\u0442\u044C \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u044E 2." : "Erg\xE4nze das Verb im Perfekt.",
    text: f.text,
    hint: `(${v2.inf})`,
    gaps: [[aux], [v2.part]],
    why: (mode === "B" ? "\u041B\u043E\u0432\u0443\u0448\u043A\u0430 \u0438\u043D\u0432\u0435\u0440\u0441\u0438\u0438: \u043F\u0435\u0440\u0435\u0434 \u0433\u043B\u0430\u0432\u043D\u044B\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C \u0441\u0442\u043E\u0438\u0442 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435/\u043E\u0431\u0441\u0442\u043E\u044F\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u2014 \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 2 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0433\u043E, \u0430 Partizip II \u2014 \u0432 \u0441\u0430\u043C\u043E\u043C \u043A\u043E\u043D\u0446\u0435. " : `Perfekt = ${v2.aux === "s" ? "sein" : "haben"} \u043D\u0430 \u0432\u0442\u043E\u0440\u043E\u043C \u043C\u0435\u0441\u0442\u0435 + Partizip II \u0432 \u043A\u043E\u043D\u0446\u0435. `) + `\xAB${v2.inf}\xBB \u2192 ${aux} \u2026 ${v2.part}.` + (v2.aux === "s" ? " \u0417\u0434\u0435\u0441\u044C sein, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u0433\u043B\u0430\u0433\u043E\u043B \u043E\u0437\u043D\u0430\u0447\u0430\u0435\u0442 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u0441\u043C\u0435\u043D\u0443 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F." : "") + (v2.pre ? ` \u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \xAB${v2.pre}\xBB \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F: \u0432 Partizip II ge- \u0441\u0442\u043E\u0438\u0442 \u0432\u043D\u0443\u0442\u0440\u0438 \u2014 ${v2.pre}ge\u2026` : /^(be|ge|er|ver|zer|ent|emp|miss)/.test(v2.inf) ? " \u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 be-/ver-/er-/ent- \u043D\u0435 \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u0442\u0441\u044F, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 ge- \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u2014 \u043A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043F\u043E\u0434\u044C\u0451\u0431." : "")
  };
}
function trennbar() {
  const f = pick9(TRENNBAR);
  const v2 = verb3(f.v);
  const form = prForms(v2)[f.p] ?? prForms(v2)[2];
  const sep = !!v2.pre;
  return {
    topic: "a1-trennbare",
    task: sep ? "Erg\xE4nze das Verb im Pr\xE4sens. \u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u0442\u0441\u044F \u2014 \u043E\u043D\u0430 \u0438\u0434\u0451\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446." : "Erg\xE4nze das Verb im Pr\xE4sens. \u0413\u043B\u0430\u0433\u043E\u043B \u043D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439 \u2014 \u0432\u0442\u043E\u0440\u043E\u0435 \u043F\u043E\u043B\u0435 \u043E\u0441\u0442\u0430\u0432\u044C \u043F\u0443\u0441\u0442\u044B\u043C.",
    text: f.text,
    hint: `(${v2.inf})`,
    gaps: [[form], sep ? [v2.pre] : [""]],
    why: sep ? `\xAB${v2.inf}\xBB \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439: \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \xAB${v2.pre}\xBB \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u2192 ${form} \u2026 ${v2.pre}.` : `\xAB${v2.inf}\xBB \u043D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439: \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 ${v2.inf.slice(0, 3)}- \u0441\u0440\u043E\u0441\u043B\u0430\u0441\u044C \u0441 \u0433\u043B\u0430\u0433\u043E\u043B\u043E\u043C, \u0432 \u043A\u043E\u043D\u0446\u0435 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u2192 \u043F\u0440\u043E\u0441\u0442\u043E ${form}.`
  };
}
function relativ(topicId) {
  const f = topicId === "b2-relativsatz-komplex" ? pick9(RELATIV_B2_KOMPLEX) : pick9(RELATIV);
  return {
    topic: topicId ?? "b1-relativsatz",
    task: "Setze das passende Relativpronomen ein.",
    text: f.text,
    gaps: [[f.a]],
    why: f.why
  };
}
function nebensatz() {
  const f = pick9(NEBENSATZ);
  return {
    topic: "b1-konj-wenn-bevor",
    task: `Verbinde die beiden S\xE4tze mit \xAB${f.konj}\xBB. \u041F\u043E\u0440\u044F\u0434\u043E\u043A \u0441\u043B\u043E\u0432 \u0432 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C: \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u043A\u043E\u043D\u0446\u0435.`,
    /* {0} — отдельной строкой: ответ это целое предложение, а не слово,
       поэтому ему нужна своя широкая строка под заданием. */
    text: `${f.a}  /  ${f.b}
{0}`,
    hint: `(${f.konj})`,
    gaps: [f.answers],
    why: `\u0412 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u043C \u0441 \xAB${f.konj}\xBB \u0441\u043F\u0440\u044F\u0433\u0430\u0435\u043C\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446. \u041F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435 \u043C\u043E\u0436\u0435\u0442 \u0441\u0442\u043E\u044F\u0442\u044C \u0438 \u043F\u0435\u0440\u0435\u0434 \u0433\u043B\u0430\u0432\u043D\u044B\u043C \u2014 \u0442\u043E\u0433\u0434\u0430 \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u0441 \u0433\u043B\u0430\u0433\u043E\u043B\u0430: \xAB${f.answers[1] ?? f.answers[0]}\xBB. \u041E\u0431\u0430 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430 \u0432\u0435\u0440\u043D\u044B.`
  };
}
var ART = {
  nom: ["der", "die", "das", "die"],
  akk: ["den", "die", "das", "die"],
  dat: ["dem", "der", "dem", "den"],
  gen: ["des", "der", "des", "der"]
};
var KAS_NAME = {
  nom: "Nominativ",
  akk: "Akkusativ",
  dat: "Dativ"
};
var GIDX = { der: 0, die: 1, das: 2 };
var PERSON = /* @__PURE__ */ new Set([
  "der Junge",
  "der Student",
  "der Mensch",
  "der Nachbar",
  "der Kollege",
  "der Kunde",
  "der Polizist",
  "der Tourist",
  "die Frau",
  "die Mutter",
  "die Schwester",
  "die Tochter",
  "die Freundin",
  "die Lehrerin",
  "das Kind",
  "das M\xE4dchen",
  "der Lehrer",
  "der Freund",
  "der Vater",
  "der Bruder",
  "der Sohn"
]);
var ART_FRAME = {
  nom: [
    "{0} {1} ist heute geschlossen.",
    "{0} {1} steht schon lange hier.",
    "{0} {1} ist neu.",
    "{0} {1} gef\xE4llt mir gut.",
    "{0} {1} kostet zu viel."
  ],
  akk: [
    "Ich suche {0} {1}.",
    "Wir kaufen {0} {1}.",
    "Er braucht {0} {1}.",
    "Ich vergesse {0} {1} nie.",
    "Sie hat {0} {1} gestern gesehen."
  ],
  dat: [
    "Ich helfe {0} {1}.",
    "Der Lehrer dankt {0} {1}.",
    "Das Buch geh\xF6rt {0} {1}.",
    "Ich schreibe {0} {1} eine Nachricht.",
    "Er zeigt {0} {1} das Foto."
  ]
};
function artikelWith(kasus) {
  const pool = kasus === "dat" ? NOUNS.filter((x2) => PERSON.has(x2.nom)) : NOUNS;
  const x = pick9(pool);
  const art = ART[kasus][GIDX[x.genus]];
  const frame = pick9(ART_FRAME[kasus]);
  return {
    topic: kasus === "akk" ? "a1-akkusativ" : kasus === "dat" ? "a1-dativ" : "a1-artikel-best",
    task: `Setze den bestimmten Artikel im ${kasus === "nom" ? "Nominativ" : kasus === "akk" ? "Akkusativ" : "Dativ"} ein.`,
    // {1} — существительное уже в нужной форме, {0} остаётся дыркой
    text: frame.replace("{1}", nomenForm(x, kasus)),
    /* В Nominativ подсказка «der …» выдала бы ответ: там артикль и есть род.
       В Akkusativ и Dativ подсказываем род — спрашивается другое. */
    hint: kasus === "nom" ? void 0 : x.genus === "der" ? "maskulin" : x.genus === "die" ? "feminin" : "neutrum",
    gaps: [[art]],
    /* перепутать падеж — главная ошибка на артикле, поэтому каждый неверный
       падеж того же рода разбирается сам */
    traps: ["nom", "akk", "dat"].filter((k) => k !== kasus).map(
      (k) => trap(
        ART[k][GIDX[x.genus]],
        `\xAB${ART[k][GIDX[x.genus]]}\xBB \u2014 \u044D\u0442\u043E ${KAS_NAME[k]}; \u0437\u0434\u0435\u0441\u044C ${KAS_NAME[kasus]} \u2192 ${art}.`
      )
    ).filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why: `\xAB${bare(x)}\xBB \u2014 ${x.genus === "der" ? "\u043C\u0443\u0436\u0441\u043A\u043E\u0433\u043E" : x.genus === "die" ? "\u0436\u0435\u043D\u0441\u043A\u043E\u0433\u043E" : "\u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E"} \u0440\u043E\u0434\u0430. \u0412 ${kasus === "nom" ? "Nominativ" : kasus === "akk" ? "Akkusativ" : "Dativ"} \u0430\u0440\u0442\u0438\u043A\u043B\u044C \u2192 ${art}.`
  };
}
var artikel = () => artikelWith(pick9(["nom", "akk", "dat"]));
var WEAK = {
  nom: ["e", "e", "e", "en"],
  akk: ["en", "e", "e", "en"],
  dat: ["en", "en", "en", "en"],
  gen: ["en", "en", "en", "en"]
};
var STRONG = {
  nom: ["er", "e", "es", "e"],
  akk: ["en", "e", "es", "e"],
  dat: ["em", "er", "em", "en"],
  gen: ["en", "er", "en", "er"]
};
var STEM = {
  hoch: "hoh",
  teuer: "teur",
  dunkel: "dunkl",
  sauer: "saur"
};
var stemOf = (b) => {
  if (STEM[b]) return STEM[b];
  if (b.length > 3 && b.endsWith("e")) return b.slice(0, -1);
  return b;
};
function adjektiv(topicId) {
  const kasus = pick9(["nom", "akk", "dat"]);
  const x = kasus === "dat" ? pick9(NOUNS.filter((z) => PERSON.has(z.nom))) : pick9(NOUNS);
  const adj = pick9(ADJEKTIVE.filter((a) => !["gut", "viel", "gern", "nah"].includes(a.base)));
  const g = GIDX[x.genus];
  const withArt = topicId === "a2-adjektiv-null" ? false : topicId === "a2-adjektiv-best" ? true : Math.random() < 0.6;
  const art = ART[kasus][g];
  const end = (withArt ? WEAK : STRONG)[kasus][g];
  const adjForm = stemOf(adj.base) + end;
  const nounForm = nomenForm(x, kasus);
  const text = withArt ? kasus === "nom" ? `{0} {1} ${nounForm} ist neu.` : kasus === "akk" ? `Ich sehe {0} {1} ${nounForm}.` : `Ich helfe {0} {1} ${nounForm}.` : kasus === "nom" ? `{0} ${nounForm} ist neu.` : kasus === "akk" ? `Ich sehe {0} ${nounForm}.` : `Ich helfe {0} ${nounForm}.`;
  return {
    topic: withArt ? "a2-adjektiv-best" : "a2-adjektiv-null",
    task: withArt ? "Setze Artikel und Adjektiv in der richtigen Form ein." : "Ohne Artikel: \u0432\u0432\u0435\u0434\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u0438\u043B\u0430\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435, \u043E\u043D\u043E \u0441\u0430\u043C\u043E \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0440\u043E\u0434 \u0438 \u043F\u0430\u0434\u0435\u0436.",
    text,
    hint: `(${adj.base})`,
    gaps: withArt ? [[art], [adjForm]] : [[adjForm]],
    why: `\u041F\u043E\u0441\u043B\u0435 ${withArt ? "\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u043E\u0433\u043E \u0430\u0440\u0442\u0438\u043A\u043B\u044F \u2014 \u0441\u043B\u0430\u0431\u043E\u0435 \u0441\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435" : "\u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044F \u0430\u0440\u0442\u0438\u043A\u043B\u044F \u2014 \u0441\u0438\u043B\u044C\u043D\u043E\u0435 \u0441\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435"}: ${kasus}, ${x.genus === "der" ? "\u043C\u0443\u0436\u0441\u043A\u043E\u0439 \u0440\u043E\u0434" : x.genus === "die" ? "\u0436\u0435\u043D\u0441\u043A\u0438\u0439 \u0440\u043E\u0434" : "\u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u043E\u0434"} \u2192 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 -${end}. \u041F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0441\u044F \xAB${withArt ? art + " " : ""}${adjForm} ${nounForm}\xBB.`
  };
}
function praesens() {
  const pool = PERFEKT.filter((f2) => !verb3(f2.v).pre);
  const f = pick9(pool);
  const v2 = verb3(f.v);
  const form = prForms(v2)[f.p] ?? prForms(v2)[2];
  const text = f.text.replace(" {1}", "").replace("{1}", "").replace(/\s+\./g, ".");
  return {
    topic: "a1-praesens",
    task: "Setze das Verb im Pr\xE4sens ein.",
    text,
    hint: `(${v2.inf})`,
    gaps: [[form]],
    /* спряжение известно заранее: любая другая форма этого же глагола —
       узнаваемая ловушка, разбирается с указанием лица */
    traps: prForms(v2).map((x, i) => ({ x, i })).filter(({ x, i }) => x && i !== f.p && x !== form).map(({ x, i }) => trap(x, `\xAB${x}\xBB \u2014 \u044D\u0442\u043E ${PR6[i]}; \u0437\u0434\u0435\u0441\u044C ${PR6[f.p]} \u2192 ${form}.`)).filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why: `${v2.inf}: ${PR6[f.p]} \u2192 ${form}. \u0420\u044F\u0434: du ${prForms(v2)[1]}, er ${prForms(v2)[2]}, wir ${prForms(v2)[3]}, ihr ${prForms(v2)[4]}.`
  };
}
var MODAL = {
  k\u00F6nnen: { pr: ["kann", "kannst", "kann", "k\xF6nnen", "k\xF6nnt", "k\xF6nnen"], ru: "\u043C\u043E\u0447\u044C" },
  m\u00FCssen: { pr: ["muss", "musst", "muss", "m\xFCssen", "m\xFCsst", "m\xFCssen"], ru: "\u0431\u044B\u0442\u044C \u0434\u043E\u043B\u0436\u043D\u044B\u043C" },
  d\u00FCrfen: { pr: ["darf", "darfst", "darf", "d\xFCrfen", "d\xFCrft", "d\xFCrfen"], ru: "\u0438\u043C\u0435\u0442\u044C \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435" },
  sollen: { pr: ["soll", "sollst", "soll", "sollen", "sollt", "sollen"], ru: "\u0441\u043B\u0435\u0434\u0443\u0435\u0442" },
  wollen: { pr: ["will", "willst", "will", "wollen", "wollt", "wollen"], ru: "\u0445\u043E\u0442\u0435\u0442\u044C" },
  m\u00F6chten: { pr: ["m\xF6chte", "m\xF6chtest", "m\xF6chte", "m\xF6chten", "m\xF6chtet", "m\xF6chten"], ru: "\u0445\u043E\u0442\u0435\u0442\u044C (\u0432\u0435\u0436\u043B\u0438\u0432\u043E)" }
};
var MODAL_FRAMES = [
  { text: "{Pron} {0} gut Deutsch sprechen.", verbs: ["k\xF6nnen"] },
  { text: "{Pron} {0} heute leider nicht kommen.", verbs: ["k\xF6nnen", "m\xFCssen"] },
  { text: "{Pron} {0} hier rauchen?", verbs: ["d\xFCrfen"] },
  { text: "{Pron} {0} mehr f\xFCr die Pr\xFCfung lernen.", verbs: ["m\xFCssen", "sollen", "wollen"] },
  { text: "{Pron} {0} am Wochenende nach Hause fahren.", verbs: ["wollen", "d\xFCrfen", "m\xFCssen"] },
  { text: "{Pron} {0} einen Kaffee, bitte.", verbs: ["m\xF6chten"] },
  { text: "{Pron} {0} das Formular ausf\xFCllen.", verbs: ["m\xFCssen", "sollen", "k\xF6nnen"] },
  { text: "{Pron} {0} noch etwas warten.", verbs: ["m\xFCssen", "sollen", "k\xF6nnen"] },
  { text: "{Pron} {0} am Sonntag nicht arbeiten.", verbs: ["d\xFCrfen", "k\xF6nnen", "sollen"] },
  { text: "{Pron} {0} langsam sprechen, bitte.", verbs: ["k\xF6nnen", "sollen", "m\xF6chten"] },
  { text: "{Pron} {0} heute fr\xFCher nach Hause.", verbs: ["m\xFCssen", "wollen"] }
];
function modal() {
  const frame = pick9(MODAL_FRAMES);
  const name = pick9(frame.verbs);
  const m = MODAL[name];
  const p = Math.floor(Math.random() * 6);
  const pron2 = ["ich", "du", "er", "wir", "ihr", "sie"][p];
  return {
    topic: "a1-modalverben",
    task: "Setze das Modalverb in der richtigen Person ein.",
    text: cap4(frame.text.replace("{Pron}", pron2)),
    hint: `(${name} \u2014 ${m.ru})`,
    gaps: [[m.pr[p]]],
    traps: m.pr.map((x, i) => ({ x, i })).filter(({ x, i }) => x && i !== p && x !== m.pr[p]).map(({ x, i }) => trap(x, `\xAB${x}\xBB \u2014 \u044D\u0442\u043E ${PR6[i]}; \u0437\u0434\u0435\u0441\u044C ${PR6[p]} \u2192 ${m.pr[p]}.`)).filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why: `${name}: ${PR6[p]} \u2192 ${m.pr[p]}. \u0423 \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u044B\u0445 ich \u0438 er \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u044E\u0442 (ich kann, er kann); \u0432\u0442\u043E\u0440\u043E\u0439 \u0433\u043B\u0430\u0433\u043E\u043B \u2014 \u0432 \u043A\u043E\u043D\u0446\u0435, \u0432 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u0435.`
  };
}
function komparativ() {
  const a = pick9(ADJEKTIVE);
  const mode = pick9(["komp", "sup"]);
  return mode === "komp" ? {
    topic: "a2-komparativ",
    task: "Bilde den Komparativ.",
    text: `{0} (${a.base})`,
    hint: "\u0441\u0440\u0430\u0432\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0435\u043F\u0435\u043D\u044C",
    gaps: [[a.komp]],
    why: `\xAB${a.base}\xBB \u2192 ${a.komp}. ${a.komp !== a.base + "er" ? "\u0423\u043C\u043B\u0430\u0443\u0442 \u0438/\u0438\u043B\u0438 irregular \u0444\u043E\u0440\u043C\u0430 \u2014 \u044D\u0442\u043E \u043D\u0430\u0434\u043E \u043F\u043E\u043C\u043D\u0438\u0442\u044C." : "\u041E\u0431\u044B\u0447\u043D\u043E\u0435 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 -er."}`
  } : {
    topic: "a2-komparativ",
    task: "Bilde den Superlativ.",
    text: `{0} (${a.base})`,
    hint: "\u043F\u0440\u0435\u0432\u043E\u0441\u0445\u043E\u0434\u043D\u0430\u044F \u0441\u0442\u0435\u043F\u0435\u043D\u044C",
    gaps: [[a.sup]],
    why: `\xAB${a.base}\xBB \u2192 ${a.sup}. ${a.sup !== "am " + a.base + "sten" ? "\u0424\u043E\u0440\u043C\u0430 \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u0430\u044F \u2014 \u0437\u0430\u043F\u043E\u043C\u043D\u0438\u0442\u044C." : "\u041E\u0431\u044B\u0447\u043D\u043E\u0435 -sten."}`
  };
}
function partizip() {
  const v2 = pick9(VERBS.filter((x) => x.inf !== "sein" && x.inf !== "haben"));
  return {
    topic: "a2-partizip",
    task: "Bilde das Partizip II.",
    text: `${v2.inf} \u2192 {0}`,
    gaps: [[v2.part]],
    why: `Partizip II: ${v2.part}.` + (v2.pre ? ` \u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \xAB${v2.pre}\xBB \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 ge- \u0441\u0442\u043E\u0438\u0442 \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0451.` : "") + (/^(be|ge|er|ver|zer|ent|emp|miss)/.test(v2.inf) ? " \u041D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u2014 \u0431\u0435\u0437 ge-." : "")
  };
}
function gegenteil() {
  const g = pick9(GEGENTEIL);
  return {
    topic: "a2-gegenteil",
    task: "Wie hei\xDFt das Gegenteil? Ein eigenes Adjektiv, nicht \xABnicht \u2026\xBB und nicht mit un-.",
    text: `${g.a} \u2192 {0}`,
    gaps: [g.answers],
    why: `\u041F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043A \xAB${g.a}\xBB: ${g.answers.join(" / ")}.`
  };
}
var PRON = [
  { forms: ["ich", "mich", "mir"], gloss: "\u044F" },
  { forms: ["du", "dich", "dir"], gloss: "\u0442\u044B" },
  { forms: ["er", "ihn", "ihm"], gloss: "\u043E\u043D" },
  { forms: ["sie", "sie", "ihr"], gloss: "\u043E\u043D\u0430" },
  { forms: ["es", "es", "ihm"], gloss: "\u043E\u043D\u043E" },
  { forms: ["wir", "uns", "uns"], gloss: "\u043C\u044B" },
  { forms: ["ihr", "euch", "euch"], gloss: "\u0432\u044B (\u043C\u043D.)" },
  { forms: ["sie", "sie", "ihnen"], gloss: "\u043E\u043D\u0438" },
  { forms: ["Sie", "Sie", "Ihnen"], gloss: "\u0432\u0435\u0436\u043B. \u0412\u044B" }
];
var PRON_FRAMES = [
  { text: "Ich sehe {0} jeden Tag.", k: 1, task: "Akkusativ" },
  { text: "Ich helfe {0} gern.", k: 2, task: "Dativ" },
  { text: "Er besucht {0} morgen.", k: 1, task: "Akkusativ" },
  { text: "Das Buch geh\xF6rt {0}.", k: 2, task: "Dativ" },
  { text: "Wir danken {0} f\xFCr die Hilfe.", k: 2, task: "Dativ" },
  { text: "Sie ruft {0} heute an.", k: 1, task: "Akkusativ" },
  { text: "Ich rufe {0} morgen an.", k: 1, task: "Akkusativ" },
  { text: "Ich gebe {0} das Buch.", k: 2, task: "Dativ" },
  { text: "Ich frage {0} nach dem Weg.", k: 1, task: "Akkusativ" },
  { text: "Ich schenke {0} eine Blume.", k: 2, task: "Dativ" },
  { text: "Ich treffe {0} im Park.", k: 1, task: "Akkusativ" },
  { text: "Ich zeige {0} die Stadt.", k: 2, task: "Dativ" },
  { text: "Ich verstehe {0} nicht.", k: 1, task: "Akkusativ" },
  { text: "Ich schreibe {0} eine Nachricht.", k: 2, task: "Dativ" }
];
function pron() {
  const f = pick9(PRON_FRAMES);
  const p = pick9(PRON);
  const form = p.forms[f.k];
  const twins = PRON.filter((x) => x !== p && x.forms[0] === p.forms[0]).map((x) => `${x.forms[0]} (${x.gloss}) \u2192 ${x.forms[f.k]}`);
  return {
    topic: "a1-personalpronomen",
    task: `Setze das Personalpronomen im ${f.task} ein.`,
    text: f.text,
    hint: `(${p.forms[0]} \u2014 ${p.gloss})`,
    gaps: [[form]],
    /* любая другая форма того же падежа — узнаваемая ловушка: разбирается
       с указанием, чья она (euch = вы, ihnen = они, Ihnen = вежл. Вы…) */
    traps: PRON.filter((x) => x !== p && x.forms[f.k] !== form).map(
      (x) => trap(
        x.forms[f.k],
        `\xAB${x.forms[f.k]}\xBB \u2014 \u044D\u0442\u043E ${x.gloss} (${x.forms[0]}); \u0432 \u0441\u043A\u043E\u0431\u043A\u0435 \xAB${p.forms[0]}\xBB (${p.gloss}) \u2192 ${form}.`
      )
    ).filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why: `\u0412 \u0441\u043A\u043E\u0431\u043A\u0435 \xAB${p.forms[0]}\xBB \u2014 ${p.gloss}. ${f.task}: ${p.forms[0]} \u2192 ${form}.` + (twins.length ? ` \u041D\u0435 \u043F\u0443\u0442\u0430\u0442\u044C: ${twins.join("; ")}.` : "")
  };
}
function seinhaben() {
  const which = pick9(["sein", "haben"]);
  const v2 = verb3(which);
  const p = Math.floor(Math.random() * 6);
  const pron2 = ["ich", "du", "er", "wir", "ihr", "sie"][p];
  const form = prForms(v2)[p];
  const tail = which === "sein" ? ["m\xFCde.", "aus Russland.", "schon fertig.", "zu Hause.", "sehr froh.", "nicht da."][p] : ["einen Bruder.", "viel Zeit.", "eine Frage.", "einen Hund.", "Hunger.", "keine Lust."][p];
  return {
    topic: "a1-sein-haben",
    task: `Setze \xAB${which}\xBB in der richtigen Person ein.`,
    text: `${cap4(pron2)} {0} ${tail}`,
    hint: `(${which})`,
    gaps: [[form]],
    traps: prForms(v2).map((x, i) => ({ x, i })).filter(({ x, i }) => x && i !== p && x !== form).map(({ x, i }) => trap(x, `\xAB${x}\xBB \u2014 \u044D\u0442\u043E ${PR6[i]}; \u0437\u0434\u0435\u0441\u044C \xAB${pron2}\xBB \u2192 ${form}.`)).filter((t, i, xs) => xs.findIndex((y) => y.wrong === t.wrong) === i),
    why: `\u0417\u0434\u0435\u0441\u044C \xAB${pron2}\xBB \u2192 ${form}.`
  };
}
function obwohl() {
  const f = pick9(OBWOHL);
  return {
    topic: "b1-obwohl-trotzdem",
    task: "Verbinde die S\xE4tze mit \xABobwohl\xBB oder \xABtrotzdem\xBB. \u041F\u0440\u0438\u043D\u0438\u043C\u0430\u044E\u0442\u0441\u044F \u043E\u0431\u0435 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B.",
    text: `${f.a}  /  ${f.b}
{0}`,
    gaps: [f.answers],
    why: "\xABobwohl\xBB \u2014 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435: \u0433\u043B\u0430\u0433\u043E\u043B \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446 (\u2026, obwohl es regnet / Obwohl es regnet, geht er joggen). \xABtrotzdem\xBB \u2014 \u043D\u0430\u0440\u0435\u0447\u0438\u0435 \u0432 \u0433\u043B\u0430\u0432\u043D\u043E\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0438: \u043F\u043E\u0441\u043B\u0435 \u043D\u0435\u0433\u043E \u0433\u043B\u0430\u0433\u043E\u043B \u043D\u0430 2-\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 (Es regnet, trotzdem geht er joggen). \u0421\u043C\u044B\u0441\u043B \u043E\u0434\u0438\u043D \u2014 \u0443\u0441\u0442\u0443\u043F\u043A\u0430, \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430."
  };
}
function umzu() {
  const f = pick9(UMZU);
  const forward = f.text.includes("damit");
  return {
    topic: "b1-damit-umzu",
    task: forward ? "Ersetze \xABdamit\xBB durch \xABum \u2026 zu\xBB. \u041F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u0432 \u043E\u0431\u0435\u0438\u0445 \u0447\u0430\u0441\u0442\u044F\u0445 \u043E\u0434\u043D\u043E \u0438 \u0442\u043E \u0436\u0435." : "Ersetze \xABum \u2026 zu\xBB durch \xABdamit\xBB.",
    text: `${f.text}
{0}`,
    gaps: [f.answers],
    why: f.why
  };
}
function infinitivzu() {
  const f = pick9(INFINITIVZU);
  const v2 = verb3(f.v);
  const form = v2.pre ? v2.pre + "zu" + v2.inf.slice(v2.pre.length) : "zu" + v2.inf;
  return {
    topic: "b1-infinitiv-zu",
    task: "Infinitiv mit zu: \u0434\u043E\u043F\u0438\u0448\u0438 \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u043A\u043E\u043D\u0446\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F.",
    text: f.text,
    hint: `(${v2.inf})`,
    gaps: [[form]],
    why: v2.pre ? `\xAB${v2.inf}\xBB \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u044B\u0439: zu \u0432\u0441\u0442\u0430\u0451\u0442 \u043C\u0435\u0436\u0434\u0443 \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u043E\u0439 \u0438 \u043A\u043E\u0440\u043D\u0435\u043C \u2192 ${form}.` : `zu \u0441\u0442\u043E\u0438\u0442 \u043F\u0435\u0440\u0435\u0434 \u0438\u043D\u0444\u0438\u043D\u0438\u0442\u0438\u0432\u043E\u043C: ${v2.inf} \u2192 ${form}.` + (/^(be|ge|er|ver|zer|ent|emp|miss)/.test(v2.inf) ? " \u041D\u0435\u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043C\u0435\u043D\u044F\u0435\u0442." : "")
  };
}
function plusquamperfekt() {
  const f = pick9(PLUSQUAM);
  const v2 = verb3(f.v);
  const aux = praetAux(v2, f.p);
  const gaps = f.obj ? v2.inf === "sein" ? [[f.obj], [aux]] : [[f.obj], [v2.part], [aux]] : [[v2.part], [aux]];
  return {
    topic: "b1-plusquamperfekt",
    task: "Nachdem + Plusquamperfekt: \u0434\u043E\u043F\u0438\u0448\u0438 \u043F\u0440\u0438\u0434\u0430\u0442\u043E\u0447\u043D\u043E\u0435. \u0412 \u0433\u043B\u0430\u0432\u043D\u043E\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0438 \u0432\u0440\u0435\u043C\u044F \u0443\u0436\u0435 \u0441\u0442\u043E\u0438\u0442.",
    text: f.text,
    hint: `(${f.hint})`,
    gaps,
    why: `nachdem \u2014 \u043F\u0440\u0435\u0434\u0448\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043D\u0438\u0435: \u0447\u0442\u043E \u0441\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C \u0420\u0410\u041D\u042C\u0428\u0415, \u0438\u0434\u0451\u0442 \u0432 Plusquamperfekt, \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u2014 \u0432 Pr\xE4teritum. \u0417\u0434\u0435\u0441\u044C: ${v2.aux === "s" ? "sein (\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435/\u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435) \u2192 war/waren" : "haben \u2192 hatte/hatten"} + Partizip II.` + (v2.inf === "sein" ? " \u041F\u0440\u0438 sein \u0432 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0438 \xAB\u0431\u044B\u0442\u044C\xBB \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E Pr\xE4teritum: zu Ende war." : "")
  };
}
function passiv() {
  const f = pick9(PASSIV);
  const v2 = verb3(f.v);
  const aux = f.plural ? "werden" : "wird";
  return {
    topic: "b1-passiv",
    task: "Bildung des Passivs Pr\xE4sens: \u0432\u0441\u043F\u043E\u043C\u043E\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0433\u043B\u0430\u0433\u043E\u043B + Partizip II.",
    text: f.text,
    hint: `(${v2.inf})`,
    gaps: [[aux], [v2.part]],
    why: `Passiv Pr\xE4sens = ${aux} + Partizip II. ` + (f.plural ? "\u041F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u0432\u043E \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u043C \u0447\u0438\u0441\u043B\u0435 \u2192 werden." : "\u041F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0435\u0435 \u0432 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u043C \u2192 wird.") + " \u0410\u043A\u043A\u0443\u0437\u0430\u0442\u0438\u0432-\u043E\u0431\u044A\u0435\u043A\u0442 \u0441\u0442\u0430\u043B \u043F\u043E\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u043C."
  };
}
function konjunktiv2() {
  const f = pick9(KONJ2);
  return {
    topic: "b1-konjunktiv2",
    task: "Konjunktiv II: \u043F\u043E\u0441\u0442\u0430\u0432\u044C \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u0441\u043E\u0441\u043B\u0430\u0433\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043D\u0430\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 (\xAB\u0431\u044B\xBB).",
    text: f.text,
    hint: f.hint,
    gaps: f.answers.map((a) => [a]),
    why: f.why
  };
}
function verbenPraep() {
  const f = pick9(VERBEN_PRAEP);
  return {
    topic: "b1-verben-praep",
    task: "Setze die richtige Pr\xE4position ein.",
    text: f.text,
    hint: f.hint,
    gaps: [[f.prep]],
    why: f.why
  };
}
var WEAK_FRAMES = [
  { text: "Ich gr\xFC\xDFe {0} {1} jeden Morgen.", k: "akk" },
  { text: "Ich besuche {0} {1} am Wochenende.", k: "akk" },
  { text: "Der Lehrer fragt {0} {1}.", k: "akk" },
  { text: "Wir laden {0} {1} zum Fest ein.", k: "akk" },
  { text: "Kennst du {0} {1}?", k: "akk" },
  { text: "Ich helfe {0} {1} gern.", k: "dat" },
  { text: "Wir danken {0} {1} f\xFCr die Hilfe.", k: "dat" },
  { text: "Das Buch geh\xF6rt {0} {1}.", k: "dat" },
  { text: "Ich antworte {0} {1} sofort.", k: "dat" },
  { text: "Ich gratuliere {0} {1} zum Geburtstag.", k: "dat" },
  { text: "Ich gebe {0} {1} die Unterlagen.", k: "dat" }
];
function ndeklination() {
  const f = pick9(WEAK_FRAMES);
  const x = pick9(NOUNS.filter((z) => z.weak));
  return {
    topic: "b1-ndeklination",
    task: `Setze das Nomen mit Artikel im ${f.k === "akk" ? "Akkusativ" : "Dativ"} ein. \u0421\u043B\u0430\u0431\u043E\u0435 \u0441\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435.`,
    text: f.text,
    hint: `(${x.nom})`,
    gaps: [[bestimmter(x, f.k)], [nomenForm(x, f.k)]],
    why: `\xAB${bare(x)}\xBB \u2014 n-Deklination: \u0432\u043E \u0432\u0441\u0435\u0445 \u043F\u0430\u0434\u0435\u0436\u0430\u0445 \u043A\u0440\u043E\u043C\u0435 Nominativ \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F -(e)n. ${f.k === "akk" ? "Akkusativ" : "Dativ"}: ${bestimmter(x, f.k)} ${nomenForm(x, f.k)}.`
  };
}
function doppelkonnektor() {
  const f = pick9(DOPPELKONN);
  return {
    topic: "b1-konnektoren-doppel",
    task: "Erg\xE4nze: entweder \u2026 oder, weder \u2026 noch, sowohl \u2026 als auch, nicht nur \u2026 sondern auch, je \u2026 desto, bald \u2026 bald.",
    text: f.text,
    gaps: [[f.first], [f.second]],
    why: f.why
  };
}
function praeteritum() {
  const f = pick9(PRAETERITUM);
  const v2 = verb3(f.v);
  const praet = v2.praet ?? prForms(v2)[2];
  const gaps = f.twoGaps ? [[praet], [v2.pre]] : [[praet]];
  return {
    topic: "b1-praeteritum-erzaehlen",
    task: "Pr\xE4teritum: \u043F\u043E\u0441\u0442\u0430\u0432\u044C \u0433\u043B\u0430\u0433\u043E\u043B \u0432 \u043F\u0440\u043E\u0448\u0435\u0434\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u0430.",
    text: f.text,
    hint: f.hint,
    gaps,
    why: `\xAB${v2.inf}\xBB \u0432 Pr\xE4teritum \u2014 ${praet}` + (v2.pre ? `, \u043E\u0442\u0434\u0435\u043B\u044F\u0435\u043C\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \xAB${v2.pre}\xBB \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u043A\u043E\u043D\u0435\u0446` : "") + "."
  };
}
function wortbildung() {
  const f = pick9(WORDBILD);
  return {
    topic: "b1-wortbildung",
    task: "Bilde das Nomen zum Verb. \u041F\u0438\u0448\u0438 \u0441 \u0430\u0440\u0442\u0438\u043A\u043B\u0435\u043C.",
    text: `${f.inf} \u2192 {0}`,
    gaps: [[f.nomen]],
    why: f.why
  };
}
function grammatikMix() {
  if (Math.random() < 0.5) {
    const f2 = pick9(ZEITMIX);
    return {
      topic: "grammatik-mix",
      task: "Setze das Verb in der angegebenen Form ein:",
      text: f2.text,
      hint: `(${f2.inf} \xB7 ${f2.form})`,
      gaps: [f2.answers],
      why: f2.why
    };
  }
  const f = pick9(UMFORM);
  return {
    topic: "grammatik-mix",
    task: `Forme ins ${f.form} um:`,
    text: `${f.given}
{0}`,
    gaps: [f.answers],
    why: f.why
  };
}
var GEN = {
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
  konjunktiv1,
  partizipial,
  konnektorenGehoben,
  nominalisierung,
  funktionsverb,
  modalpartikeln,
  pronominaladverbien,
  /* ---- C1 (фрагменты c1a/c1b) ---- */
  konjunktiv1Formen: konjunktiv12,
  esKonstruktionen,
  konnektorenC1,
  nominalstil,
  partizipAttribut,
  wortstellungC1: wortstellung,
  modalitaet,
  /* ---- A1 (фрагмент a1) ---- */
  wortstellung: wortstellung2,
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
  grammatikMix
};
var hasGen = (name) => name in GEN;
function makeItem(topicId, genNames2) {
  const name = genNames2.find(hasGen);
  if (!name) return null;
  const it = GEN[name](topicId);
  return { ...it, topic: topicId };
}
function makeRound(topicId, genNames2, n2 = 6) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (let i = 0; i < n2; i++) {
    let it = makeItem(topicId, genNames2);
    if (!it) break;
    for (let k = 0; k < 5 && seen.has(it.text); k++) {
      const alt = makeItem(topicId, genNames2);
      if (!alt) break;
      it = alt;
    }
    seen.add(it.text);
    out.push(it);
  }
  return out;
}

// tools/deprobe/probe-entry.ts
var N_SAMPLES = 40;
var ROUND_N = 6;
var errs = [];
var fail = (gen, n2, it, invariant, detail) => {
  errs.push({ gen, n: n2, invariant, detail, sample: it });
};
var phIndices = (text) => [...text.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));
function probeItem(gen, n2, it) {
  const idx = phIndices(it.text);
  const seen = /* @__PURE__ */ new Set();
  let seqOk = idx.length === it.gaps.length;
  idx.forEach((v2, i) => {
    if (v2 !== i) seqOk = false;
    if (seen.has(v2)) seqOk = false;
    seen.add(v2);
  });
  if (!seqOk)
    fail(
      gen,
      n2,
      it,
      "placeholders",
      `\u043F\u043B\u0435\u0439\u0441\u0445\u043E\u043B\u0434\u0435\u0440\u044B [${idx.join(", ")}], gaps.length=${it.gaps.length} \u2014 \u043E\u0436\u0438\u0434\u0430\u043B\u0438\u0441\u044C 0..${it.gaps.length - 1} \u0431\u0435\u0437 \u0434\u0443\u0431\u043B\u0435\u0439`
    );
  const bare2 = it.text.replace(/\{\d+\}/g, "");
  if (/[{}]/.test(bare2))
    fail(gen, n2, it, "braces", `\u043B\u0438\u0448\u043D\u0438\u0435 { } \u0432 text \u0432\u043D\u0435 \u043F\u043B\u0435\u0439\u0441\u0445\u043E\u043B\u0434\u0435\u0440\u043E\u0432: ${JSON.stringify(bare2)}`);
  const firstPh = it.text.search(/\{\d+\}/);
  if (firstPh > 0) {
    const card = /^[a-zäöüß].* → \{0\}$/.test(it.text);
    const c = it.text[0];
    if (!card && !/[A-ZÄÖÜ0-9]/.test(c))
      fail(gen, n2, it, "text-start", `\u043F\u0435\u0440\u0432\u044B\u0439 \u0441\u0438\u043C\u0432\u043E\u043B ${JSON.stringify(c)} \u2014 \u043D\u0435 \u0437\u0430\u0433\u043B\u0430\u0432\u043D\u0430\u044F \u0431\u0443\u043A\u0432\u0430 \u0438 \u043D\u0435 \u0446\u0438\u0444\u0440\u0430`);
  }
  it.gaps.forEach((gap, i) => {
    const legalEmpty = gen === "trennbar" && gap.length === 1 && gap[0] === "";
    if (!legalEmpty && !gap.some((a) => a.trim() !== ""))
      fail(
        gen,
        n2,
        it,
        "gap-nonempty",
        `gaps[${i}] = ${JSON.stringify(gap)} \u2014 \u043D\u0435\u0442 \u043D\u0438 \u043E\u0434\u043D\u043E\u0433\u043E \u043D\u0435\u043F\u0443\u0441\u0442\u043E\u0433\u043E \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0433\u043E \u043E\u0442\u0432\u0435\u0442\u0430`
      );
    for (const a of gap) {
      if (a.trim() === "") {
        if (!legalEmpty)
          fail(
            gen,
            n2,
            it,
            "gap-trim",
            `gaps[${i}] = ${JSON.stringify(gap)} \u2014 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 \u043F\u0443\u0441\u0442 \u043F\u043E\u0441\u043B\u0435 trim`
          );
        continue;
      }
      if (!check(a, gap))
        fail(
          gen,
          n2,
          it,
          "check",
          `check(${JSON.stringify(a)}, gaps[${i}]) = false, gaps[${i}] = ${JSON.stringify(gap)}`
        );
    }
  });
  if (!it.task || it.task.trim() === "")
    fail(gen, n2, it, "task", `task \u043F\u0443\u0441\u0442: ${JSON.stringify(it.task ?? null)}`);
  if (!it.why || it.why.trim() === "")
    fail(gen, n2, it, "why", `why \u043F\u0443\u0441\u0442: ${JSON.stringify(it.why ?? null)}`);
  it.text.split("\n").forEach((line, li) => {
    if (/^\s*\{\d+\}\s*$/.test(line)) return;
    const cleaned = line.replace(/ {2,}\/ {2,}/g, " / ");
    const m = cleaned.match(/ {2,}/);
    if (m && m.index !== void 0) {
      const ctx = cleaned.slice(Math.max(0, m.index - 20), m.index + 22);
      fail(gen, n2, it, "double-space", `\u0441\u0442\u0440\u043E\u043A\u0430 ${li}: \u0434\u0432\u0430 \u043F\u0440\u043E\u0431\u0435\u043B\u0430 \u043F\u043E\u0434\u0440\u044F\u0434, \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442 ${JSON.stringify(ctx)}`);
    }
  });
}
var genNames = Object.keys(GEN);
for (const name of genNames) {
  const gen = GEN[name];
  for (let n2 = 0; n2 < N_SAMPLES; n2++) {
    try {
      probeItem(name, n2, gen());
    } catch (e) {
      fail(
        name,
        n2,
        { task: "", text: "", hint: void 0, gaps: [] },
        "throw",
        `\u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440 \u0431\u0440\u043E\u0441\u0438\u043B \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435: ${e instanceof Error ? e.stack : String(e)}`
      );
    }
  }
  const topicId = `probe:${name}`;
  let round = [];
  try {
    round = makeRound(topicId, [name], ROUND_N);
  } catch (e) {
    fail(
      name,
      -1,
      { task: "", text: "", hint: void 0, gaps: [] },
      "makeRound",
      `makeRound \u0431\u0440\u043E\u0441\u0438\u043B \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435: ${e instanceof Error ? e.message : String(e)}`
    );
  }
  if (round.length !== ROUND_N)
    fail(
      name,
      -1,
      { task: "", text: "", hint: void 0, gaps: [] },
      "makeRound",
      `makeRound \u0432\u0435\u0440\u043D\u0443\u043B ${round.length} \u0438\u0437 ${ROUND_N} \u0443\u043F\u0440\u0430\u0436\u043D\u0435\u043D\u0438\u0439 (null \u0432 makeItem \u043F\u0440\u0435\u0440\u044B\u0432\u0430\u0435\u0442 \u0440\u0430\u0443\u043D\u0434)`
    );
  round.forEach((it, i) => {
    if (!it || typeof it.topic !== "string" || it.topic !== topicId)
      fail(
        name,
        -1,
        { task: it?.task ?? "", text: it?.text ?? "", hint: it?.hint, gaps: it?.gaps ?? [] },
        "makeRound-topic",
        `round[${i}].topic = ${JSON.stringify(it?.topic ?? null)}, \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${JSON.stringify(topicId)}`
      );
  });
}
var byGen = /* @__PURE__ */ new Map();
for (const e of errs) {
  const list = byGen.get(e.gen) ?? [];
  list.push(e);
  byGen.set(e.gen, list);
}
console.log("=== \u041F\u0420\u041E\u0411\u041D\u0418\u041A \u0413\u0415\u041D\u0415\u0420\u0410\u0422\u041E\u0420\u041E\u0412 DE ===");
console.log(`\u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u043E\u0432: ${genNames.length}, \u0441\u044D\u043C\u043F\u043B\u043E\u0432 \u043D\u0430 \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440: ${N_SAMPLES}, \u0440\u0430\u0443\u043D\u0434 makeRound: ${ROUND_N}`);
console.log("");
for (const name of genNames) {
  const list = byGen.get(name) ?? [];
  if (list.length === 0) {
    console.log(`[ok] ${name}: ${N_SAMPLES} \u0441\u044D\u043C\u043F\u043B\u043E\u0432, \u043E\u0448\u0438\u0431\u043E\u043A \u043D\u0435\u0442`);
    continue;
  }
  console.log(`[!!] ${name}: \u043E\u0448\u0438\u0431\u043E\u043A ${list.length}`);
  for (const e of list) {
    console.log(`  \u0441\u044D\u043C\u043F\u043B #${e.n} [${e.invariant}] ${e.detail}`);
    console.log(`    task=${JSON.stringify(e.sample.task)} text=${JSON.stringify(e.sample.text)} hint=${JSON.stringify(e.sample.hint ?? null)} gaps=${JSON.stringify(e.sample.gaps)}`);
  }
  console.log("");
}
console.log(`PROBE-ERRORS: ${errs.length}`);
console.log(`GEN-COUNT: ${genNames.length}`);
process.exitCode = errs.length ? 1 : 0;
