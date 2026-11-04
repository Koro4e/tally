/* ============================================================================
   Hoerverstehen — раздел 1 экзамена (25 из 100 баллов)
   ----------------------------------------------------------------------------
   Контент по образцу stem-exam/refs/deutsch.txt (раздел 1), но не копия:
   та же структура, другие тексты.

   Состав (итого 25 P):
   · diktat  — связный текст ~196 слов (объявление в языковой школе), читается
     дважды; 13 пропусков {0}…{12} строго по порядку. Ответы — слова, которые
     ОДНОЗНАЧНО слышны в аудио (никакой вариативности: ни артиклей на выбор,
     ни перестановок; ответ либо слышен дословно, либо его нет).
   · mc      — объявление (intro) о проектной неделе в языковой школе; вопросы
     ПЕЧАТАЮТСЯ в листе, в аудио звучит только intro. 6 пунктов a/b/c,
     проверяют последовательность действий и детали (кто/что/когда/где).
   · dialogs — три бытовых диалога (бюро находок, запись на курс, покупка
     билетов), по 2 вопроса к каждому. Роли: A — Conrad (муж.), B — Amala
     (жен.). Вопросы на понимание: где/когда/что купить/сколько стоит.

   why-поля — по-русски, для режима разбора после проверки.

   Инварианты (проверяются в tools/audio-build.py перед генерацией аудио):
   ровно 13 пропусков в diktat.text, ровно 13 ответов, ровно 6 mc.items,
   ровно 3 диалога по 2 вопроса, в каждой строке диалога who ∈ {A, B}.
   Тексты уровнем B1/B2, не детские.

   ВАЖНО для tools/audio-build.py: строки ниже парсятся оттуда регуляркой,
   поэтому кавычки внутри строк только немецкие „…“, двойных ASCII-кавычек
   внутри строк нет, каждая строка — одной строкой кода.
   ========================================================================== */

export type Diktat = {
  title: string;
  full: string; // полный текст (с ответами) — именно его читает аудио дважды
  text: string; // текст с {0}…{12} — ровно 13 пропусков, для листа
  answers: string[]; // 13 слов/фраз по порядку
};

export type McItem = {
  q: string;
  options: [string, string, string];
  correct: 0 | 1 | 2;
  why: string;
};

export type McSet = {
  title: string;
  intro: string; // текст объявления — единственное, что звучит в аудио
  items: McItem[]; // ровно 6
};

export type Dialog = {
  title: string;
  lines: { who: "A" | "B"; text: string }[];
  q: { q: string; options: [string, string, string]; correct: 0 | 1 | 2; why: string }[]; // ровно 2
};

export type Hoer = {
  diktat: Diktat;
  mc: McSet;
  dialogs: Dialog[]; // ровно 3
};

export const HOER: Hoer = {
  /* ------------------------------------------------------------ 1.1 Diktat */
  diktat: {
    title: "1.1 Diktat: Ankündigung im Deutschkurs",
    full:
      "Liebe Teilnehmerinnen und Teilnehmer, herzlich willkommen zu unserem Deutsch-Intensivkurs! Wir treffen uns zweimal pro Woche im Raum 204, immer um halb neun Uhr morgens. Bitte bringen Sie Ihr Lehrbuch und ein Wörterbuch mit. Am Montag schreiben wir einen kleinen Einstufungstest, damit wir wissen, in welche Gruppe Sie passen. Wenn Sie Fragen haben, wenden Sie sich bitte an das Sekretariat. Es ist jeden Tag von neun bis zwölf Uhr geöffnet. " +
      "Am Ende des Kurses machen wir eine Exkursion nach Heidelberg. Die Fahrt dauert mit dem Bus etwa zwei Stunden. Wir besichtigen das berühmte Schloss und machen danach einen Spaziergang durch die Altstadt. Mittags essen wir zusammen in einem Restaurant in der Nähe des Marktes. Die Fahrt kostet fünfundzwanzig Euro. Bitte melden Sie sich bis Freitag im Sekretariat an, denn die Plätze sind begrenzt. " +
      "Noch etwas Wichtiges: Im Kurs sprechen wir nur Deutsch. Auch wenn Sie ein Wort nicht kennen, versuchen Sie es bitte auf Deutsch zu erklären. Das ist am Anfang vielleicht schwierig, aber Sie werden schnell Fortschritte machen. Zu Hause wiederholen Sie am besten jeden Tag eine halbe Stunde die Vokabeln. So bleibt das Gelernte im Kopf. Wir wünschen Ihnen viel Spaß und Erfolg beim Lernen!",
    text:
      "Liebe Teilnehmerinnen und Teilnehmer, herzlich willkommen zu unserem Deutsch-Intensivkurs! Wir treffen uns {0} im Raum 204, immer um halb neun Uhr morgens. Bitte bringen Sie Ihr Lehrbuch und ein Wörterbuch {1}. Am Montag schreiben wir einen kleinen Einstufungstest, damit wir {2}, in welche Gruppe Sie passen. Wenn Sie Fragen {3}, wenden Sie sich bitte an das Sekretariat. Es ist jeden Tag von neun bis zwölf Uhr {4}. " +
      "Am Ende des Kurses machen wir eine Exkursion nach {5}. Die Fahrt dauert mit dem Bus etwa zwei Stunden. Wir besichtigen das berühmte Schloss und machen danach einen Spaziergang durch die {6}. Mittags essen wir zusammen in einem Restaurant in der Nähe des Marktes. Die Fahrt kostet {7} Euro. Bitte melden Sie sich bis Freitag im {8} an, denn die Plätze sind begrenzt. " +
      "Noch etwas Wichtiges: Im Kurs sprechen wir nur Deutsch. Auch wenn Sie ein Wort nicht kennen, {9} Sie es bitte auf Deutsch zu erklären. Das ist am Anfang vielleicht schwierig, aber Sie werden schnell {10} machen. Zu Hause wiederholen Sie am besten jeden Tag eine halbe Stunde die {11}. So bleibt das Gelernte im Kopf. Wir wünschen Ihnen viel Spaß und {12} beim Lernen!",
    answers: [
      "zweimal pro Woche", // «дважды в неделю» — звучит медленно и однозначно
      "mit", // bringen Sie … mit — слышна приставка
      "wissen", // damit wir wissen, in welche Gruppe …
      "haben", // Wenn Sie Fragen haben — фиксированная связка
      "geöffnet", // von neun bis zwölf Uhr geöffnet — единственно возможное слово
      "Heidelberg", // город назван прямо
      "Altstadt", // Spaziergang durch die Altstadt
      "fünfundzwanzig", // цена прописью — на слух однозначна
      "Sekretariat", // im Sekretariat an — как и в начале текста
      "versuchen", // versuchen Sie es … zu erklären
      "Fortschritte", // Fortschritte machen — фиксированная коллокация
      "Vokabeln", // die Vokabeln wiederholen
      "Erfolg", // viel Spaß und Erfolg — финальная формула
    ],
  },

  /* --------------------------------------- 1.2 MC: объявление + 6 вопросов */
  mc: {
    title: "1.2 Projektwoche an der Sprachschule",
    intro:
      "Sehr geehrte Damen und Herren, liebe Teilnehmer! Hier spricht das Sekretariat der Sprachschule International. In der nächsten Woche findet unsere internationale Projektwoche statt. Am Montag um neun Uhr treffen sich alle Gruppen in der Aula. Herr Baumann, der Leiter der Schule, eröffnet die Woche mit einer kurzen Rede. Danach stellen sich die Gruppen vor: Die Gruppe aus Spanien zeigt Fotos von ihrer Heimatstadt, die Gruppe aus der Türkei bringt selbstgemachte Speisen mit, und die Gruppe aus Polen hat ein kleines Theaterstück einstudiert. Am Dienstag besuchen wir gemeinsam das Stadtmuseum. Frau Keller, unsere Sekretärin, hat die Eintrittskarten schon gekauft; sie liegen am Empfang bereit. Am Mittwoch schreiben die Teilnehmer im Workshop kurze Texte und lesen sie anschließend laut vor. Am Donnerstag ist der letzte Tag zur Anmeldung: Wer noch mitmachen möchte, muss sich bis zwölf Uhr im Sekretariat melden. Die Projektwoche endet am Freitagabend mit einem Fest im Garten der Schule. Bei Regen findet das Fest im Foyer statt. Wir freuen uns auf Sie!",
    items: [
      {
        q: "Was macht Herr Baumann am Montag als Erstes?",
        options: [
          "Er eröffnet die Woche mit einer kurzen Rede.",
          "Er zeigt Fotos von seiner Heimatstadt.",
          "Er verkauft die Eintrittskarten am Empfang.",
        ],
        correct: 0,
        why: "В объявлении прямо сказано: Herr Baumann eröffnet die Woche mit einer kurzen Rede. Фото показывают испанцы, а билеты уже купила фрау Келлер.",
      },
      {
        q: "Was macht die Gruppe aus der Türkei?",
        options: [
          "Sie führt ein Theaterstück auf.",
          "Sie bringt selbstgemachte Speisen mit.",
          "Sie zeigt Bilder von Istanbul.",
        ],
        correct: 1,
        why: "Турки приносят домашнюю еду (bringt selbstgemachte Speisen mit); театральную сценку готовят поляки, фото показывают испанцы.",
      },
      {
        q: "Was hat Frau Keller für den Dienstag schon erledigt?",
        options: [
          "Sie hat die Eintrittskarten für das Museum gekauft.",
          "Sie hat das Museumsgebäude geputzt.",
          "Sie hat den Bus für die Fahrt gemietet.",
        ],
        correct: 0,
        why: "Frau Keller hat die Eintrittskarten schon gekauft — они лежат на ресепшене. Про уборку и автобус в объявлении ничего нет.",
      },
      {
        q: "Was tun die Teilnehmer am Mittwoch im Workshop?",
        options: [
          "Sie schreiben kurze Texte und lesen sie laut vor.",
          "Sie hören einen Vortrag über Museen.",
          "Sie proben ein Theaterstück im Foyer.",
        ],
        correct: 0,
        why: "Am Mittwoch schreiben die Teilnehmer im Workshop kurze Texte und lesen sie anschließend laut vor.",
      },
      {
        q: "Bis wann muss man sich für die Projektwoche anmelden?",
        options: ["bis Freitagabend", "bis Mittwoch um neun Uhr", "bis Donnerstag um zwölf Uhr"],
        correct: 2,
        why: "Am Donnerstag ist der letzte Tag zur Anmeldung — bis zwölf Uhr im Sekretariat. В пятницу только заключительный праздник.",
      },
      {
        q: "Wo findet das Abschlussfest statt, wenn es regnet?",
        options: ["im Garten der Schule", "im Foyer", "in der Aula"],
        correct: 1,
        why: "Обычно праздник в саду школы, но Bei Regen findet das Fest im Foyer statt.",
      },
    ],
  },

  /* --------------------------------------------------- 1.3 три диалога x 2 */
  dialogs: [
    {
      title: "Dialog 1: Im Fundbüro",
      lines: [
        { who: "A", text: "Guten Tag, ich habe heute Morgen meinen Rucksack in der Straßenbahn vergessen. Ich weiß nur nicht mehr, in welcher Linie." },
        { who: "B", text: "Kein Problem. Schildern Sie mir bitte, wie der Rucksack aussieht." },
        { who: "A", text: "Er ist grün, aus Stoff. In der Vordertasche steckt ein Notizbuch, im Hauptfach sind meine Unterlagen und ein Regenschirm." },
        { who: "B", text: "Moment, ich schaue kurz nach … Ja, hier ist ein grüner Stoffrucksack, heute Morgen in der Linie 14 gefunden. Steht Ihr Name auf dem Etikett?" },
        { who: "A", text: "Nein, leider nicht. Wo kann ich ihn abholen?" },
        { who: "B", text: "Im Fundbüro am Rathausplatz, Zimmer drei. Wir sind montags bis freitags von neun bis sechzehn Uhr geöffnet. Bringen Sie bitte einen Ausweis mit, damit wir prüfen können, dass der Rucksack wirklich Ihnen gehört." },
        { who: "A", text: "Und wenn ich erst am Samstag komme?" },
        { who: "B", text: "Am Samstag ist das Büro geschlossen. Dann kommen Sie am Montag oder schicken Sie einen Bekannten mit einer schriftlichen Vollmacht." },
        { who: "A", text: "Gut, dann komme ich heute nach der Arbeit vorbei. Vielen Dank!" },
        { who: "B", text: "Gern. Denken Sie an den Ausweis!" },
      ],
      q: [
        {
          q: "Wo hat der Mann seinen Rucksack vergessen?",
          options: ["in der Straßenbahn", "im Bus zum Rathausplatz", "im Zimmer drei des Fundbüros"],
          correct: 0,
          why: "Он сам говорит: meinen Rucksack in der Straßenbahn vergessen — и сумка нашлась в 14-м трамвае.",
        },
        {
          q: "Was muss der Mann mitbringen, wenn er den Rucksack abholt?",
          options: ["eine Fahrkarte für die Linie 14", "einen Ausweis", "eine Vollmacht von einem Bekannten"],
          correct: 1,
          why: "Сотрудница просит принести Ausweis, чтобы проверить, что рюкзак его. Доверенность нужна только если за ним придёт знакомый.",
        },
      ],
    },
    {
      title: "Dialog 2: Anmeldung beim Fotografiekurs",
      lines: [
        { who: "A", text: "Guten Tag, ich möchte mich für den Fotografiekurs an der Volkshochschule anmelden." },
        { who: "B", text: "Guten Tag, gern. Der Anfängerkurs beginnt am vierten März und läuft sechs Wochen, immer dienstags abends von halb sieben bis neun Uhr." },
        { who: "A", text: "Das passt bei mir gut. Und was muss ich selbst mitbringen?" },
        { who: "B", text: "Nur Ihre eigene Kamera, am besten eine Spiegelreflexkamera. Das Studio stellt alle anderen Geräte, auch Stativ und Beleuchtung." },
        { who: "A", text: "Sehr gut. Was kostet der Kurs?" },
        { who: "B", text: "Achtundvierzig Euro für alle sechs Termine, das Material ist darin enthalten. Bezahlt wird erst beim ersten Termin." },
        { who: "A", text: "Gibt es noch freie Plätze?" },
        { who: "B", text: "Ja, aber nur noch drei. Der Kurs ist fast voll, weil der Lehrer sehr beliebt ist." },
        { who: "A", text: "Dann melde ich mich am besten heute noch an. Geht das online?" },
        { who: "B", text: "Ja, füllen Sie einfach das Formular auf unserer Website aus. Sie bekommen dann eine Bestätigung per E-Mail mit allen Informationen." },
      ],
      q: [
        {
          q: "Wann findet der Kurs statt?",
          options: ["sechs Wochen, immer dienstags am Abend", "sechs Wochen, immer am Wochenende", "drei Monate, immer freitags am Abend"],
          correct: 0,
          why: "Der Kurs läuft sechs Wochen, immer dienstags abends von halb sieben bis neun.",
        },
        {
          q: "Was muss der Mann selbst mitbringen?",
          options: ["ein Stativ und Beleuchtung", "das Geld für den ersten Termin", "eine eigene Kamera"],
          correct: 2,
          why: "Mitbringen нужно только собственную камеру; штатив и освещение даёт студия, а оплата — не «принести с собой», а просто при первом занятии.",
        },
      ],
    },
    {
      title: "Dialog 3: Karten für das Konzert",
      lines: [
        { who: "A", text: "Guten Tag, ich möchte zwei Karten für das Konzert am Samstagabend kaufen." },
        { who: "B", text: "Guten Tag. Das Konzert ist leider fast ausverkauft. Für Samstag habe ich nur noch Plätze auf der hinteren Galerie." },
        { who: "A", text: "Was kosten die Karten dort?" },
        { who: "B", text: "Zweiunddreißig Euro pro Karte. Die Plätze weiter vorn gibt es nur noch für den Sonntag." },
        { who: "A", text: "Nein, am Sonntag kann ich nicht. Dann nehme ich die beiden Galerieplätze. Kann ich mit Karte zahlen?" },
        { who: "B", text: "Ja, selbstverständlich. Möchten Sie auch ein Programmheft dafür? Das kostet zwei fünfzig." },
        { who: "A", text: "Nein danke. Muss ich die Karten heute noch abholen?" },
        { who: "B", text: "Nein, Sie können sie am Samstag eine Stunde vor dem Konzert an der Abendkasse abholen, gegen Vorlage Ihrer Buchungsnummer." },
        { who: "A", text: "Alles klar. Und wann beginnt das Konzert?" },
        { who: "B", text: "Um zwanzig Uhr, der Einlass ist eine halbe Stunde vorher." },
      ],
      q: [
        {
          q: "Warum nimmt der Mann die Plätze auf der Galerie?",
          options: ["weil sie billiger sind", "weil er am Sonntag keine Zeit hat", "weil er gern weit oben sitzt"],
          correct: 1,
          why: "Он отказывается от мест ближе к сцене, потому что они только на воскресенье, а am Sonntag kann ich nicht. Цена здесь ни при чём.",
        },
        {
          q: "Wo bekommt der Mann seine Karten?",
          options: ["gleich am Schalter", "an der Abendkasse am Samstag", "per Post nach Hause"],
          correct: 1,
          why: "Abholen можно в субботу за час до концерта на Abendkasse по номеру бронирования.",
        },
      ],
    },
  ],
};

/* Валидация инвариантов при импорте модуля (упадёт с понятной ошибкой). */
{
  const D = HOER.diktat;
  const gaps = D.text.match(/\{\d+\}/g) ?? [];
  const seq = gaps.map((g) => Number(g.slice(1, -1)));
  const okSeq = seq.length === 13 && seq.every((n, i) => n === i);
  if (!okSeq) throw new Error("diktat.text: нужно ровно 13 пропусков {0}…{12} по порядку");
  if (D.answers.length !== 13) throw new Error("diktat.answers: нужно ровно 13 ответов");
  if (HOER.mc.items.length !== 6) throw new Error("mc.items: нужно ровно 6 вопросов");
  for (const it of HOER.mc.items) {
    if (it.options.length !== 3) throw new Error("mc: у каждого вопроса 3 варианта");
  }
  if (HOER.dialogs.length !== 3) throw new Error("dialogs: нужно ровно 3 диалога");
  for (const d of HOER.dialogs) {
    if (d.q.length !== 2) throw new Error(`${d.title}: нужно ровно 2 вопроса`);
    if (d.lines.length === 0) throw new Error(`${d.title}: нет реплик`);
    for (const l of d.lines) {
      if (l.who !== "A" && l.who !== "B") throw new Error(`${d.title}: who должен быть A или B`);
    }
  }
}
