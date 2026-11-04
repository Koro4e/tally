/* ============================================================================
   Hoerverstehen VARIANTE 2 — второй вариант раздела 1 (25 из 100 баллов)
   ----------------------------------------------------------------------------
   Дубль контента HOER2: файл-образец — src/lib/de/exam-hoer.ts (структура и
   уровень). Темы другие: объявление из Stadtbücherei (Diktat), Tagesausflug
   des Wandervereins (MC), три диалога (Verkehrstarif, Zahnarzt, Mietwohnung).

   Состав (итого 25 P):
   · diktat  — связный текст ~193 слова (объявление в городской библиотеке),
     читается дважды; 13 пропусков {0}…{12} строго по порядку. Ответы — слова,
     которые ОДНОЗНАЧНО слышны в аудио (вырезаны из текста дословно: ни
     артиклей на выбор, ни перестановок). Числа, цены, даты и время — прописью.
   · mc      — объявление (intro) о Tagesausflug des Wandervereins; вопросы
     ПЕЧАТАЮТСЯ в листе, в аудио звучит только intro. 6 пунктов a/b/c,
     проверяют последовательность действий и детали (кто/что/когда/где/сколько).
   · dialogs — три бытовых диалога (тариф у перевозчика, запись к стоматологу,
     осмотр съёмной квартиры), по 2 вопроса к каждому. Роли: A — Conrad (муж.,
     консультант/собеседник), B — Amala (жен.).

   why-поля — по-русски, для режима разбора после проверки.

   Инварианты: ровно 13 пропусков в diktat.text, ровно 13 ответов, ровно
   6 mc.items, ровно 3 диалога по 2 вопроса, в каждой реплике who ∈ {A, B}.
   Уровень B1/B2, не детский.
   Проверка: node tools/genwork/check-hoer-v2.mjs

   ВАЖНО для парсера аудио (tools/genwork/* парсится регуляркой): кавычки
   внутри строк только немецкие „…“, ASCII-двойных кавычек внутри строк нет,
   каждая строка кода — одна строка, длинные тексты через " + " конкатенацию
   сегментов, реплики диалогов — одной строкой кода без " + " внутри текста,
   символов < и > в строках нет.
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

export const HOER2: Hoer = {
  /* ------------------------------------------------------------ 2.1 Diktat */
  diktat: {
    title: "2.1 Diktat: Neue Infos aus der Stadtbücherei",
    full:
      "Liebe Besucherinnen und Besucher, herzlich willkommen in der Stadtbücherei! Wir möchten Sie über unsere neuen Öffnungszeiten informieren. Von Montag bis Freitag sind wir von neun bis neunzehn Uhr für Sie da, samstags schließen wir schon um dreizehn Uhr. Sonntags bleibt die Bücherei geschlossen. Die Jahresgebühr für Erwachsene beträgt dreißig Euro, für Schüler und Studenten zahlen Sie nur achtzehn Euro. Kinder unter zehn Jahren lesen kostenlos. " +
      "Sie können gleichzeitig zwanzig Medien ausleihen, zum Beispiel Bücher, Zeitschriften, CDs oder DVDs. Die Leihfrist beträgt vier Wochen und kann zweimal verlängert werden, auch telefonisch. Bitte beachten Sie: Bei überschrittenen Fristen fallen Gebühren an. Am fünfzehnten Februar veranstalten wir wieder eine Lesenacht für Jugendliche; die Plätze sind begrenzt, melden Sie sich also früh an. Außerdem bietet unser Medienraum jeden Mittwoch um achtzehn Uhr einen kostenlosen Deutsch-Workshop an. " +
      "Noch ein Hinweis: Das gesamte Angebot finden Sie auch online. Dort können Sie jederzeit nach Medien suchen, sie reservieren und Ihre Leihfrist selbst verlängern. Für die Nutzung brauchen Sie nur Ihre Benutzernummer und ein Passwort, das Sie am Empfang erhalten. Bei Fragen hilft Ihnen unser Team gern weiter, natürlich auch per E-Mail. Wir wünschen Ihnen viel Freude beim Lesen und Stöbern!",
    text:
      "Liebe Besucherinnen und Besucher, herzlich willkommen in der Stadtbücherei! Wir möchten Sie über unsere neuen Öffnungszeiten informieren. Von Montag bis Freitag sind wir von neun bis {0} Uhr für Sie da, samstags schließen wir schon um {1} Uhr. Sonntags bleibt die Bücherei geschlossen. Die Jahresgebühr für Erwachsene beträgt {2} Euro, für Schüler und Studenten zahlen Sie nur {3} Euro. Kinder unter zehn Jahren lesen kostenlos. " +
      "Sie können gleichzeitig {4} Medien ausleihen, zum Beispiel Bücher, Zeitschriften, CDs oder DVDs. Die Leihfrist beträgt {5} und kann {6} verlängert werden, auch telefonisch. Bitte beachten Sie: Bei überschrittenen Fristen fallen {7} an. Am {8} Februar veranstalten wir wieder eine Lesenacht für {9}; die Plätze sind begrenzt, melden Sie sich also früh an. Außerdem bietet unser Medienraum jeden {10} um achtzehn Uhr einen kostenlosen Deutsch-Workshop an. " +
      "Noch ein Hinweis: Das gesamte Angebot finden Sie auch online. Dort können Sie jederzeit nach Medien suchen, sie reservieren und Ihre Leihfrist selbst verlängern. Für die Nutzung brauchen Sie nur Ihre {11} und ein Passwort, das Sie am {12} erhalten. Bei Fragen hilft Ihnen unser Team gern weiter, natürlich auch per E-Mail. Wir wünschen Ihnen viel Freude beim Lesen und Stöbern!",
    answers: [
      "neunzehn", // von neun bis neunzehn Uhr — время названо прямо
      "dreizehn", // samstags schließen wir schon um dreizehn Uhr
      "dreißig", // Jahresgebühr für Erwachsene — цена прописью
      "achtzehn", // Studenten zahlen nur achtzehn Euro — тоже цена
      "zwanzig", // gleichzeitig zwanzig Medien ausleihen
      "vier Wochen", // Die Leihfrist beträgt vier Wochen
      "zweimal", // kann zweimal verlängert werden
      "Gebühren", // fallen Gebühren an — фиксированная связка
      "fünfzehnten", // Am fünfzehnten Februar — дата прописью
      "Jugendliche", // eine Lesenacht für Jugendliche
      "Mittwoch", // jeden Mittwoch um achtzehn Uhr — день недели
      "Benutzernummer", // Ihre Benutzernummer und ein Passwort
      "Empfang", // das Sie am Empfang erhalten
    ],
  },

  /* --------------------------------------- 2.2 MC: объявление + 6 вопросов */
  mc: {
    title: "2.2 Tagesausflug des Wandervereins",
    intro:
      "Liebe Vereinsmitglieder, wir laden Sie zu unserem Tagesausflug am zwanzigsten Mai ein. Der Bus fährt um acht Uhr vom Parkplatz am Sportplatz ab; bitte seien Sie eine Viertelstunde vorher da. Zuerst besichtigen wir die Burg in Steinbach, die Führung dauert etwa eine Stunde. " +
      "Danach wandern wir zum Gipfel und machen eine Pause; jeder bringt sein eigenes Essen mit, Getränke stellt der Verein. Die Rückfahrt ist gegen achtzehn Uhr geplant. Die Fahrt kostet zwölf Euro, Kinder zahlen die Hälfte. Melden Sie sich bis zum fünfzehnten Mai bei Frau Dengler an.",
    items: [
      {
        q: "Wann und wo startet der Bus?",
        options: [
          "um halb acht am Bahnhof",
          "um acht Uhr vom Parkplatz am Sportplatz",
          "um neun Uhr am Rathausplatz",
        ],
        correct: 1,
        why: "В объявлении прямо сказано: Der Bus fährt um acht Uhr vom Parkplatz am Sportplatz ab. Вокзал и ратуша не упоминаются.",
      },
      {
        q: "Was wird von den Teilnehmern vor der Abfahrt erwartet?",
        options: [
          "Sie sind schon eine Viertelstunde vorher am Parkplatz.",
          "Sie zahlen die Fahrt schon beim Einsteigen.",
          "Sie rufen vorher noch einmal bei Frau Dengler an.",
        ],
        correct: 0,
        why: "Bitte seien Sie eine Viertelstunde vorher da — то есть приехать заранее на парковку у спортплощадки.",
      },
      {
        q: "Was steht als Erstes auf dem Programm?",
        options: [
          "Eine Wanderung zum Gipfel",
          "Eine Führung durch die Burg in Steinbach",
          "Ein Picknick am See",
        ],
        correct: 1,
        why: "Zuerst besichtigen wir die Burg in Steinbach; прогулка на вершину и пикник идут уже после экскурсии.",
      },
      {
        q: "Was bringt jeder Teilnehmer selbst mit?",
        options: [
          "Getränke für die Pause",
          "Feste Schuhe für die Wanderung",
          "Das Picknick-Essen",
        ],
        correct: 2,
        why: "Jeder bringt sein eigenes Essen mit; напитки предоставляет клуб, обувь в объявлении не названа.",
      },
      {
        q: "Was kostet die Fahrt für ein Kind?",
        options: ["sechs Euro", "zwölf Euro", "nichts"],
        correct: 0,
        why: "Kinder zahlen die Hälfte, то есть половину от двенадцати евро — шесть евро.",
      },
      {
        q: "Bis wann und bei wem meldet man sich an?",
        options: [
          "bis zum zwanzigsten Mai beim Busfahrer",
          "bis Ende Mai im Vereinsheim",
          "bis zum fünfzehnten Mai bei Frau Dengler",
        ],
        correct: 2,
        why: "Melden Sie sich bis zum fünfzehnten Mai bei Frau Dengler an; двадцатое мая — это уже день самой поездки.",
      },
    ],
  },

  /* --------------------------------------------------- 2.3 три диалога x 2 */
  dialogs: [
    {
      title: "Dialog 1: Auskunft beim Verkehrsunternehmen",
      lines: [
        { who: "A", text: "Guten Tag, Kundenzentrum der Stadtwerke, mein Name ist Berger. Was kann ich für Sie tun?" },
        { who: "B", text: "Guten Tag. Ich fahre jeden Tag zur Arbeit und überlege, ob ich eine Monatskarte nehme. Was kostet sie?" },
        { who: "A", text: "Die Monatskarte für alle Zonen kostet vierundsechzig Euro. Wenn Sie nur zwei Zonen brauchen, zahlen Sie zweiundvierzig Euro." },
        { who: "B", text: "Ich fahre vom Hauptbahnhof zur Hochschule, das sind zwei Zonen. Gibt es auch eine Wochenkarte?" },
        { who: "A", text: "Ja, die Wochenkarte für zwei Zonen kostet achtzehn Euro. Sie gilt von Montag bis Sonntag." },
        { who: "B", text: "Und wo kann ich die Karten kaufen?" },
        { who: "A", text: "Hier am Schalter, am Automaten oder ganz einfach in der App. Dort ist die Karte direkt auf Ihr Handy geladen." },
        { who: "B", text: "Sehr praktisch. Dann möchte ich die Monatskarte für zwei Zonen. Kann ich hier mit Karte bezahlen?" },
        { who: "A", text: "Natürlich. Die Monatskarte ist personalisiert, zeigen Sie mir bitte kurz Ihren Ausweis." },
        { who: "B", text: "Kein Problem, ich habe ihn dabei. Vielen Dank für die Auskunft!" },
      ],
      q: [
        {
          q: "Was kostet die Monatskarte für zwei Zonen?",
          options: ["vierundsechzig Euro", "zweiundvierzig Euro", "achtzehn Euro"],
          correct: 1,
          why: "Monatskarte на все зоны — 64 евро, на две зоны — 42 евро; 18 евро стоит недельная карта.",
        },
        {
          q: "Wie lange gilt die Wochenkarte?",
          options: ["von Montag bis Freitag", "einen ganzen Monat", "von Montag bis Sonntag"],
          correct: 2,
          why: "Die Wochenkarte gilt von Montag bis Sonntag, то есть все семь дней, а не только рабочие.",
        },
      ],
    },
    {
      title: "Dialog 2: Termin in der Zahnarztpraxis",
      lines: [
        { who: "A", text: "Guten Tag, Zahnarztpraxis Dr. Hartmann, was kann ich für Sie tun?" },
        { who: "B", text: "Guten Tag. Ich habe seit gestern starke Schmerzen mit dem Weisheitszahn. Könnte ich heute noch einen Termin bekommen?" },
        { who: "A", text: "Moment, ich sehe nach … Heute ist der Terminplan leider voll. Nur um siebzehn Uhr ist noch ein Notfalltermin frei." },
        { who: "B", text: "Das würde mir gut passen. Muss ich für den Notfalltermin extra bezahlen?" },
        { who: "A", text: "Nein, er kostet dasselbe wie ein normaler Termin. Bringen Sie nur Ihre Versichertenkarte mit." },
        { who: "B", text: "Die habe ich immer dabei. Soll ich ein Röntgenbild von meinem Zahn mitbringen?" },
        { who: "A", text: "Nicht nötig, wir machen das Röntgen gleich hier in der Praxis. Kommen Sie bitte zehn Minuten früher, Sie müssen noch ein Formular ausfüllen." },
        { who: "B", text: "Alles klar, dann also um sechzehn Uhr fünfzig. Darf ich vorher noch eine Schmerztablette nehmen?" },
        { who: "A", text: "Ja, das ist kein Problem. Und kauen Sie heute bitte auf der anderen Seite." },
        { who: "B", text: "Mache ich. Vielen Dank, bis später!" },
      ],
      q: [
        {
          q: "Wann muss die Frau in der Praxis sein?",
          options: ["um siebzehn Uhr", "um sechzehn Uhr fünfzig", "um fünfzehn Uhr"],
          correct: 1,
          why: "Термин на 17:00, но просят прийти на десять минут раньше — в 16:50, чтобы заполнить анкету.",
        },
        {
          q: "Was soll die Frau mitbringen?",
          options: ["ein Röntgenbild", "ein Formular von zu Hause", "ihre Versichertenkarte"],
          correct: 2,
          why: "Рентген сделают прямо в клинике, форму дадут на месте; с собой нужна только Versichertenkarte.",
        },
      ],
    },
    {
      title: "Dialog 3: Besichtigung einer Mietwohnung",
      lines: [
        { who: "A", text: "Guten Tag, schön, dass Sie da sind. Ich bin Herr Vogel, der Vermieter. Kommen Sie, ich zeige Ihnen die Wohnung." },
        { who: "B", text: "Danke. Sie ist aber hell! In welchem Stock liegt sie?" },
        { who: "A", text: "Im dritten Stock, es gibt einen Aufzug. Die Wohnung hat siebzig Quadratmeter: zwei Zimmer, Küche, Bad und ein Balkon." },
        { who: "B", text: "Sehr schön. Und was kostet die Miete monatlich?" },
        { who: "A", text: "Die Kaltmiete beträgt achthundert Euro, zu den Nebenkosten kommen noch hundertfünfzig Euro. Insgesamt zahlen Sie also neunhundertfünfzig Euro." },
        { who: "B", text: "Verstehe. Muss ich eine Kaution hinterlegen?" },
        { who: "A", text: "Ja, üblich sind drei Kaltmieten, also zweitausendvierhundert Euro. Sie bekommen das Geld zurück, wenn Sie ausziehen und alles in Ordnung ist." },
        { who: "B", text: "Gut. Ab wann wäre der Einzug möglich?" },
        { who: "A", text: "Ab dem ersten September. Der Vormieter zieht Ende August aus, danach renovieren wir kurz." },
        { who: "B", text: "Das passt perfekt, meine neue Stelle fängt genau dann an. Dann nehme ich die Wohnung gern." },
      ],
      q: [
        {
          q: "Wie viel muss die Frau monatlich insgesamt zahlen?",
          options: ["neunhundertfünfzig Euro", "achthundert Euro", "zweitausendvierhundert Euro"],
          correct: 0,
          why: "800 холодная + 150 коммунальные = 950 евро в месяц; 2400 — это Kaution, разовая сумма.",
        },
        {
          q: "Ab wann kann die Frau einziehen?",
          options: ["ab dem ersten Oktober", "sofort", "ab dem ersten September"],
          correct: 2,
          why: "Der Vormieter zieht Ende August aus, поэтому сдать квартиру можно ab dem ersten September.",
        },
      ],
    },
  ],
};

/* Валидация инвариантов при импорте модуля (упадёт с понятной ошибкой). */
{
  const D: Diktat = HOER2.diktat;
  const M: McSet = HOER2.mc;
  const DL: Dialog[] = HOER2.dialogs;
  const gaps = D.text.match(/\{\d+\}/g) ?? [];
  const seq = gaps.map((g) => Number(g.slice(1, -1)));
  const okSeq = seq.length === 13 && seq.every((n, i) => n === i);
  if (!okSeq) throw new Error("diktat.text: нужно ровно 13 пропусков {0}…{12} по порядку");
  if (D.answers.length !== 13) throw new Error("diktat.answers: нужно ровно 13 ответов");
  for (const a of D.answers) {
    if (!D.full.toLowerCase().includes(a.toLowerCase())) throw new Error(`diktat: ответ не слышен в тексте: ${a}`);
  }
  if (M.items.length !== 6) throw new Error("mc.items: нужно ровно 6 вопросов");
  for (const it of M.items) {
    if (it.options.length !== 3) throw new Error("mc: у каждого вопроса 3 варианта");
  }
  if (DL.length !== 3) throw new Error("dialogs: нужно ровно 3 диалога");
  for (const d of DL) {
    if (d.q.length !== 2) throw new Error(`${d.title}: нужно ровно 2 вопроса`);
    if (d.lines.length < 6 || d.lines.length > 10) throw new Error(`${d.title}: 6–10 реплик`);
    for (const l of d.lines) {
      if (l.who !== "A" && l.who !== "B") throw new Error(`${d.title}: who должен быть A или B`);
    }
  }
}
