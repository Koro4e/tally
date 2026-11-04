/* ============================================================================
   B2-WORT: Nominalisierung, Funktionsverbgefüge, Modalpartikeln
   ----------------------------------------------------------------------------
   Три темы группы «wort». Общий принцип тот же, что у соседей: задания
   собираются из ЯВНО ХРАНИМЫХ кадров, ничего не сочиняется на лету.

   b2-nominalisierung. Трансформация Verbalstil ↔ Nominalstil — это не форма
   глагола, которую можно вывести, а перестройка всего предложения: придаточное
   с союзом схлопывается в группу «предлог + Nomen», время предшествования,
   которое было Plusquamperfekt, исчезает в существительном. Каждый неверный
   шаг даёт «nach er angekommen war» или «nach ankommen». Поэтому пары хранятся
   целиком, выверены глазами, генератор только выбирает направление.
   Связь с b1-wortbildung: там ученик строил сами номинализации (-ung, -er,
   das + Infinitiv), здесь — использует их в предложениях с предлогами.

   b2-funktionsverb. «eine Entscheidung treffen» ↔ «entscheiden» — словарная
   пара: глагол в конструкции фиксирован, вывести его нельзя, а дословный
   перевод с русского («machen eine Entscheidung») — самая частая ошибка.
   Поэтому каждая пара хранится с двумя ГОТОВЫМИ предложениями (FVG-версия
   и Vollverb-версия), и упражнение гоняет их в обе стороны.

   b2-modalpartikeln. Частицы в основном взаимозаменяемы, и упражнение
   «вставь частицу» честно только там, где контекст допускает ровно одну:
   W-вопрос → denn, возражение/ответ на отрицательный вопрос → doch,
   вежливая просьба → mal, смирение → halt. Где две частицы возможны
   («Du hast ja/doch recht») — обе лежат в answers, и why объясняет нюанс.
   Кадры отобраны по принципу «лучше 12 честных, чем 20 сомнительных».

   Инварианты (проверяются прогоном): {i} == gaps.length подряд; непустой
   ответ в каждой дырке; текст до первой дырки начинается с заглавной;
   нет двойных пробелов; task/why непустые.
   ========================================================================== */

import type { Theory } from "@/lib/de/theory";
import type { Item } from "@/lib/de/gen";

/* ============================================================================
   ТЕОРИЯ
   ========================================================================== */

export const THEORY_B2_WORT: Record<string, Theory> = {
  "b2-nominalisierung": {
    regel:
      "Der Nominalstil verwandelt einen Nebensatz in eine Nomengruppe mit Präposition: " +
      "nachdem er angekommen war → nach seiner Ankunft, als er einkaufte → beim Einkauf, " +
      "weil der Zug Verspätung hatte → wegen der Verspätung. Das Verb wird zum Nomen " +
      "(oft mit -ung), der Nebensatz verschwindet. Der Verbalstil ist die gesprochene Form, " +
      "der Nominalstil steht in Zeitungen, Amtstexten und Wissenschaft.",
    ru:
      "Номинализация — превращение придаточного в группу «предлог + существительное». " +
      "Глагол становится Nomen (часто на -ung, которое вы учили в b1-wortbildung), " +
      "подлежащее прячется в притяжательное местоимение (seine Ankunft = «что он пришёл»), " +
      "а время предшествования, которое было Plusquamperfekt, выражается только самим предлогом nach. " +
      "Письменный немецкий любит Nominalstil, разговорный — Verbalstil; на экзамене спрашивают " +
      "умение перейти от одного к другому в обе стороны.",
    tabelle: {
      head: ["Verbalstil", "Präposition", "Nominalstil"],
      rows: [
        ["nachdem er angekommen war", "nach", "nach seiner Ankunft"],
        ["als/wenn sie einkauft", "bei", "beim Einkauf"],
        ["weil der Zug Verspätung hatte", "wegen", "wegen der Verspätung"],
        ["obwohl er eingeladen war", "trotz", "trotz der Einladung"],
        ["indem man täglich liest", "durch", "durch tägliches Lesen"],
        ["ohne dass man sich anmeldet", "ohne", "ohne Anmeldung"],
        ["während der Text übersetzt wird", "während", "während der Übersetzung"],
      ],
    },
    beispiele: [
      {
        de: "Nachdem er angekommen war, rief er uns an. ↔ Nach seiner Ankunft rief er uns an.",
        ru: "Одно и то же событие: придаточное с nachdem и группа nach + Nomen.",
      },
      {
        de: "Beim Einkaufen traf sie ihre Nachbarin. ↔ Als sie einkaufte, traf sie ihre Nachbarin.",
        ru: "bei + номинализированный инфинитив = «когда/в то время как».",
      },
      {
        de: "Ohne Anmeldung kann man nicht teilnehmen. ↔ Wenn man sich nicht anmeldet, kann man nicht teilnehmen.",
        ru: "Возвратное sich в Nomen не переходит: sich anmelden → die Anmeldung.",
      },
    ],
    fehler: [
      "Оставляют придаточное после предлога: «nach er angekommen war» — после предлога нужен Nomen, а не Satz.",
      "Забывают Genitiv после wegen/trotz/während: «wegen die Verspätung» вместо «wegen der Verspätung».",
      "Пишут инфинитив вместо Nomen: «nach ankommen», «beim einkaufen» — нужен die Ankunft, der Einkauf, с заглавной.",
      "Переносят возвратное местоимение к Nomen: «wegen die Anmeldung» — Genitiv: wegen der Anmeldung; sich исчезает: die Anmeldung.",
      "Смешивают стили в одном предложении: «wegen weil der Zug Verspätung hatte» — либо предлог + Nomen, либо союз + Satz.",
      "Держат Plusquamperfekt в Nominalstil-версии: «nachdem seiner Ankunft» — время уже спрятано в предлоге, ничего дописывать не надо.",
    ],
    merk:
      "У каждого «союза» есть предлог-двойник: nachdem → nach, als/bevor → bei/vor, weil → wegen, " +
      "obwohl → trotz, indem → durch, ohne dass → ohne, während → während. Внутри живёт Nomen от глагола — чаще всего на -ung.",
  },

  "b2-funktionsverb": {
    regel:
      "Ein Funktionsverbgefüge ist eine feste Verbindung Nomen + Verb, in der das Nomen die Bedeutung trägt " +
      "und das Verb nur Zeit und Person zeigt: eine Entscheidung treffen = entscheiden, eine Diskussion führen = diskutieren, " +
      "zum Ausdruck bringen = ausdrücken. Das Verb ist austauschbar wie ein Hilfsverb, das Nomen nicht: " +
      "es heisst eine Entscheidung TREFFEN, nicht machen.",
    ru:
      "Функциональная глагольная конструкция — это «существительное + глагол-пустышка»: смысл живёт " +
      "в существительном (Entscheidung = решение), а глагол только спрягается (treffen). По-русски мы " +
      "говорим «принять решение», и глагол здесь тоже нельзя заменить произвольно. Учить надо парами целиком: " +
      "Nomen + глагол + предлог, если он есть. Письменный немецкий предпочитает такие конструкции простому глаголу.",
    tabelle: {
      head: ["Funktionsverbgefüge", "Vollverb", "Bedeutung"],
      rows: [
        ["eine Entscheidung treffen", "entscheiden", "решать"],
        ["eine Diskussion führen", "diskutieren", "обсуждать"],
        ["Kritik üben an + Dat.", "kritisieren", "критиковать"],
        ["zum Ausdruck bringen", "ausdrücken", "выражать"],
        ["eine Frage stellen", "fragen", "спрашивать"],
        ["Hilfe leisten", "helfen", "помогать"],
        ["Abschied nehmen von + Dat.", "sich verabschieden", "прощаться"],
        ["in Frage kommen", "möglich sein", "быть возможным"],
        ["sich in Verbindung setzen mit", "kontaktieren", "связываться"],
        ["zum Stillstand kommen", "anhalten", "останавливаться"],
      ],
    },
    beispiele: [
      {
        de: "Der Vorstand hat eine Entscheidung getroffen. ↔ Der Vorstand hat entschieden.",
        ru: "В Perfekt Partizip II берёт Funktionsverb: getroffen, не «gemacht».",
      },
      {
        de: "Die Opposition übte Kritik an der Regierung. ↔ Die Opposition kritisierte die Regierung.",
        ru: "Предлог в конструкции — an + Dativ, у простого глагола его нет: kritisieren + Akkusativ.",
      },
      {
        de: "Wir nahmen Abschied von unseren Gastgebern. ↔ Wir verabschiedeten uns von unseren Gastgebern.",
        ru: "В Nomen-версии возвратного sich нет, в Vollverb-версии оно обязательно.",
      },
    ],
    fehler: [
      "Дословный перевод с русского: «eine Entscheidung machen» — глагол фиксирован: eine Entscheidung TREFFEN.",
      "Теряют предлог: «Kritik üben die Regierung» — Kritik üben AN + Dativ; «Abschied nehmen die Gäste» — von + Dativ.",
      "Спрягают смысловой глагол вместе с конструкцией: «hat eine Entscheidung getroffen entschieden» — либо Nomen + Funktionsverb, либо Vollverb, но не оба.",
      "Ошибаются в Partizip II Функцглагола: «hat eine Entscheidung getreffen» — treffen → getroffen.",
      "Путают возвратность: sich verabschieden, но Abschied nehmen — sich только у простого глагола.",
      "Ставят артикль как попало: «treffen Entscheidung» — конструкция живёт со своим артиклем: EINE Entscheidung, EINEN Antrag stellen.",
    ],
    merk:
      "Учить тройкой: Nomen + Funktionsverb + предлог («Kritik üben an», «Abschied nehmen von»). " +
      "В тексте узнавай Nomen и ищи его глагол: увидел «eine Entscheidung» — рядом будет treffen.",
  },

  "b2-modalpartikeln": {
    regel:
      "Modalpartikeln ändern die Wahrheit des Satzes nicht, aber die Stimmung. Fest gelernt werden nur die " +
      "eindeutigen Kontexte: denn steht nur in W-Fragen (Wie heißt du denn?), doch bei Widerspruch und in der Antwort " +
      "auf eine negative Frage (– Kommst du nicht mit? – Ich komme doch mit!), mal bei höflichen Aufforderungen " +
      "(Komm mal her!), halt bei resignierter Zustimmung (Es ist halt so.), ja beim gemeinsamen Wissen (Du hast ja recht!). " +
      "Die Partikel steht im Mittelfeld, gleich nach dem konjugierten Verb oder dem Subjekt.",
    ru:
      "Модальные частицы не меняют смысл, а передают отношение говорящего. Русские примерно-эквиваленты: " +
      "doch — «ведь / же», ja — «ведь», halt — «ну, так уж», denn — «же» (только в вопросах), mal — «-ка» (гляну-ка). " +
      "Многие из них взаимозаменяемы — разница в оттенке, а не в правде, поэтому честно учить только " +
      "однозначные контексты: вопрос с W-словом → denn, возражение → doch, вежливая просьба → mal, " +
      "смирение «ничего не поделаешь» → halt. Без частицы предложение тоже грамматически верно — " +
      "частица это краска, а не краска забора.",
    tabelle: {
      head: ["Partikel", "Kontext", "Beispiel", "по-русски"],
      rows: [
        ["denn", "только W-вопрос", "Wie heißt du denn?", "же / как же"],
        ["doch", "возражение, подтверждение", "Ich komme doch mit!", "ведь, же"],
        ["ja", "общий известный факт", "Du hast ja recht!", "ведь"],
        ["halt", "смирение, «так уж вышло»", "Es ist halt so.", "ну, так уж"],
        ["mal", "вежливая просьба", "Komm mal her!", "-ка, давай"],
      ],
    },
    beispiele: [
      { de: "Wie heißt du denn?", ru: "W-вопрос с интересом: denn смягчает, делает вопрос дружелюбным." },
      { de: "– Kommst du nicht mit? – Ich komme doch mit!", ru: "Ответ на отрицательный вопрос — возражение: doch." },
      { de: "Kannst du mir mal kurz helfen?", ru: "Вежливая просьба: mal делает её лёгкой, «на минутку»." },
      { de: "Der Bus ist weg. Dann müssen wir halt warten.", ru: "Смирение: ничего не поделаешь. То же значение у eben." },
    ],
    fehler: [
      "Ставят denn в утверждение: «Ich bin denn müde» — denn живёт ТОЛЬКО в вопросах с W-словом.",
      "Путают с союзом denn («потому что»): вопросительная частица denn не имеет с ним ничего общего.",
      "Выносят частицу на 1-е место или в конец: частицы стоят в середине, сразу после глагола или подлежащего.",
      "Используют ja в возражении: ja соглашается с собеседником, doch возражает.",
      "Переводят дословно: «да» = ja — здесь ja ничего не утверждает, это окраска.",
      "Думают, что частица обязательна: без неё предложение тоже верно, экзамен требует узнавания, а не вставки куда попало.",
    ],
    merk:
      "Если контекст допускает две частицы — верны обе, разница только в тоне. Правило для упражнений: " +
      "W-Frage → denn, Widerspruch → doch, Bitte → mal, Resignation → halt, gemeinsam Bekanntes → ja.",
  },
};

/* ============================================================================
   КАДРЫ: b2-nominalisierung
   ----------------------------------------------------------------------------
   Пара хранится целиком: предложение в Nominalstil и ВСЕ верные варианты
   в Verbalstil (включая оба порядка: придаточное позади и впереди).
   Формы не выводятся — только выбираются.
   ========================================================================== */

export type NomPair = { nom: string; verb: string[]; why: string };

export const NOM_PAIRS: NomPair[] = [
  {
    nom: "Nach seiner Ankunft rief er uns an.",
    verb: ["Nachdem er angekommen war, rief er uns an.", "Er rief uns an, nachdem er angekommen war."],
    why:
      "nach + Nomen → nachdem + Plusquamperfekt: Ankunft случилась РАНЬШЕ звонка, поэтому angekommen war. " +
      "Возвратного sich нет, но есть Possessiv: seine Ankunft = «то, что он пришёл».",
  },
  {
    nom: "Nach dem Essen gingen wir spazieren.",
    verb: ["Nachdem wir gegessen hatten, gingen wir spazieren.", "Wir gingen spazieren, nachdem wir gegessen hatten."],
    why:
      "das Essen — номинализированный инфинитив (средний род, с большой буквы). " +
      "Предшествование → nachdem + Plusquamperfekt: gegessen hatten, потом gingen.",
  },
  {
    nom: "Beim Einkaufen traf sie ihre Nachbarin.",
    verb: [
      "Als sie einkaufte, traf sie ihre Nachbarin.",
      "Während sie einkaufte, traf sie ihre Nachbarin.",
    ],
    why:
      "bei + Nominalisierung = «в то время как». Однократное событие в прошлом → als sie einkaufte; " +
      "возможен и während — процесс покупки длился, встреча случилась внутри него. Оба верны.",
  },
  {
    nom: "Beim Sprechen macht er viele Fehler.",
    verb: ["Wenn er spricht, macht er viele Fehler.", "Er macht viele Fehler, wenn er spricht."],
    why:
      "Речь идёт о повторяющейся ситуации («когда говорит — всегда с ошибками»), поэтому wenn, а не als. " +
      "Оба порядка предложения верны.",
  },
  {
    nom: "Ohne Anmeldung kann man an dem Kurs nicht teilnehmen.",
    verb: [
      "Wenn man sich nicht anmeldet, kann man an dem Kurs nicht teilnehmen.",
      "Ohne dass man sich anmeldet, kann man an dem Kurs nicht teilnehmen.",
      "Man kann an dem Kurs nicht teilnehmen, wenn man sich nicht anmeldet.",
      "Man kann an dem Kurs nicht teilnehmen, ohne dass man sich anmeldet.",
    ],
    why:
      "ohne + Nomen → отрицательное wenn (с nicht) или союз ohne dass. " +
      "sich anmelden — возвратный: sich исчезает в die Anmeldung.",
  },
  {
    nom: "Wegen der Verspätung des Zuges kamen wir zu spät.",
    verb: [
      "Da der Zug Verspätung hatte, kamen wir zu spät.",
      "Weil der Zug Verspätung hatte, kamen wir zu spät.",
      "Wir kamen zu spät, weil der Zug Verspätung hatte.",
      "Wir kamen zu spät, da der Zug Verspätung hatte.",
    ],
    why:
      "wegen + Genitiv → da/weil + Satz. da звучит чуть письменнее, weil нейтрально — оба верны. " +
      "Генитив «des Zuges» в Nominalstil — принадлежность, в Verbalstil он становится подлежащим.",
  },
  {
    nom: "Trotz der Einladung kam er nicht.",
    verb: ["Obwohl er eingeladen war, kam er nicht.", "Er kam nicht, obwohl er eingeladen war."],
    why:
      "trotz + Genitiv → obwohl. «Er war eingeladen» — состояние, поэтому PräteritumPassiv eingeladen war. " +
      "Смысл: приглашение было, а он всё равно не пришёл.",
  },
  {
    nom: "Durch tägliches Lesen verbessert man seinen Wortschatz.",
    verb: [
      "Man verbessert seinen Wortschatz, indem man täglich liest.",
      "Indem man täglich liest, verbessert man seinen Wortschatz.",
    ],
    why:
      "durch + Nomen → indem («тем что» — способ). Tägliches Lesen — номинализированный инфинитив " +
      "с сильным окончанием среднего рода -es. Оба порядка верны.",
  },
  {
    nom: "Nach der Erklärung des Lehrers verstand ich alles.",
    verb: ["Nachdem der Lehrer alles erklärt hatte, verstand ich alles.", "Ich verstand alles, nachdem der Lehrer alles erklärt hatte."],
    why:
      "Деятель из генитива «des Lehrers» становится подлежащим придаточного: nachdem der Lehrer …, " +
      "предшествование → Plusquamperfekt erklärt hatte.",
  },
  {
    nom: "Die Übersetzung des Textes dauerte zwei Stunden.",
    verb: [
      "Den Text zu übersetzen dauerte zwei Stunden.",
      "Es dauerte zwei Stunden, den Text zu übersetzen.",
    ],
    why:
      "Nomen-версия → инфинитивная группа mit zu: den Text zu übersetzen. " +
      "Обе структуры верны: инфинитивная группа в начале (с Akkusativ перед zu) или es в начале и группа в конце.",
  },
  {
    nom: "Die Anmeldung zum Kurs ist bis Freitag möglich.",
    verb: ["Man kann sich bis Freitag zum Kurs anmelden."],
    why:
      "die Anmeldung zum Kurs = «запись на курс»: предлог zu остаётся при Nomen. " +
      "В Verbalstil возвратное sich возвращается: man kann sich … anmelden.",
  },
  {
    nom: "Die Prüfung der Unterlagen dauert einen Tag.",
    verb: ["Die Unterlagen werden einen Tag geprüft."],
    why:
      "«Prüfung der Unterlagen» читается пассивно: документы не проверяют себя сами. " +
      "В Verbalstil появляется Passiv Präsens: werden geprüft. Nominalstil часто прячет пассив — это его типичный признак.",
  },
];

/* ============================================================================
   КАДРЫ: b2-funktionsverb
   ----------------------------------------------------------------------------
   fvg     — конструкция (Nomen + Funktionsverb + предлог)
   verb    — простой глагол (для hint и why)
   fvgSent — готовое предложение с конструкцией
   verbSents — все верные Vollverb-варианты этого предложения
   ========================================================================== */

export type FvgPair = { fvg: string; verb: string; fvgSent: string; verbSents: string[]; why: string };

export const FVG_PAIRS: FvgPair[] = [
  {
    fvg: "eine Entscheidung treffen",
    verb: "entscheiden",
    fvgSent: "Der Vorstand hat eine Entscheidung getroffen.",
    verbSents: ["Der Vorstand hat entschieden."],
    why:
      "eine Entscheidung TREFFEN (не machen!) = entscheiden. В Perfekt Partizip II Функцглагола: getroffen. " +
      "В Vollverb-варианте всё предложение сжимается в один глагол.",
  },
  {
    fvg: "zur Schule gehen",
    verb: "die Schule besuchen",
    fvgSent: "Ich bin acht Jahre zur Schule gegangen.",
    verbSents: ["Ich habe acht Jahre die Schule besucht."],
    why:
      "zur Schule gehen = die Schule besuchen — «ходить в школу». " +
      "Обратите внимание: gehen требует sein (bin gegangen), besuchen — haben (habe besucht).",
  },
  {
    fvg: "eine Diskussion führen",
    verb: "diskutieren",
    fvgSent: "Wir haben eine lange Diskussion geführt.",
    verbSents: ["Wir haben lange diskutiert."],
    why:
      "eine Diskussion FÜHREN = diskutieren. Прилагательное (lange) в Vollverb-варианте становится наречием.",
  },
  {
    fvg: "Kritik üben an + Dat.",
    verb: "kritisieren",
    fvgSent: "Die Opposition übte Kritik an der Regierung.",
    verbSents: ["Die Opposition kritisierte die Regierung."],
    why:
      "Kritik üben AN + Dativ, а kritisieren берёт прямой Akkusativ: an der Regierung → die Regierung. " +
      "Предлог живёт в конструкции, у простого глагола его нет.",
  },
  {
    fvg: "zum Ausdruck bringen",
    verb: "ausdrücken",
    fvgSent: "In seinem Brief brachte er seinen Dank zum Ausdruck.",
    verbSents: ["In seinem Brief drückte er seinen Dank aus."],
    why:
      "zum Ausdruck bringen = ausdrücken. ausdrücken отделяемый: приставка уходит в конец — drückte … aus. " +
      "В конструкции Akkusativ-дополнение остаётся тем же (seinen Dank).",
  },
  {
    fvg: "in Frage kommen",
    verb: "möglich sein",
    fvgSent: "Eine Gehaltserhöhung kommt für mich nicht in Frage.",
    verbSents: ["Eine Gehaltserhöhung ist für mich nicht möglich."],
    why:
      "in Frage kommen = «стоять вопросом / быть возможным», с nicht — «исключено». " +
      "В Vollverb-варианте смысл несёт sein: ist nicht möglich.",
  },
  {
    fvg: "eine Frage stellen",
    verb: "fragen",
    fvgSent: "Ich möchte Ihnen eine Frage stellen.",
    verbSents: ["Ich möchte Sie etwas fragen."],
    why:
      "eine Frage STELLEN = fragen. Падежи меняются: Frage stellen + Dativ (Ihnen), " +
      "fragen + Akkusativ (Sie) + что именно (etwas).",
  },
  {
    fvg: "Hilfe leisten",
    verb: "helfen",
    fvgSent: "Die Nachbarn leisteten uns sofort Hilfe.",
    verbSents: ["Die Nachbarn halfen uns sofort."],
    why:
      "Hilfe LEISTEN = helfen. Датив сохраняется в обеих версиях: uns. " +
      "Präteritum: у Vollverb — halfen (Die Nachbarn halfen uns sofort), в конструкции — leisteten (Funktionsverb спрягается, а не helfen).",
  },
  {
    fvg: "Abschied nehmen von + Dat.",
    verb: "sich verabschieden",
    fvgSent: "Wir nahmen Abschied von unseren Gastgebern.",
    verbSents: ["Wir verabschiedeten uns von unseren Gastgebern."],
    why:
      "Abschied nehmen VON = sich von … verabschieden. Возвратное местоимение есть только " +
      "у простого глагола: в конструкции sich исчезает, von остаётся.",
  },
  {
    fvg: "einen Vorschlag machen",
    verb: "vorschlagen",
    fvgSent: "Der Lehrer hat uns einen Vorschlag gemacht.",
    verbSents: ["Der Lehrer hat uns etwas vorgeschlagen."],
    why:
      "einen Vorschlag MACHEN — здесь уже machen (исключение из «всегда treffen»), = vorschlagen. " +
      "Что именно предложено, в Vollverb-варианте становится etwas.",
  },
  {
    fvg: "einen Antrag stellen",
    verb: "beantragen",
    fvgSent: "Sie hat beim Amt einen Antrag auf Kindergeld gestellt.",
    verbSents: ["Sie hat beim Amt Kindergeld beantragt."],
    why:
      "einen Antrag STELLEN = beantragen. Предложная группа «Antrag AUF + Akk» в Vollverb-варианте " +
      "сжимается: Kindergeld beantragen.",
  },
  {
    fvg: "in Kauf nehmen",
    verb: "akzeptieren",
    fvgSent: "Wir mussten eine Verspätung von einer Stunde in Kauf nehmen.",
    verbSents: ["Wir mussten eine Verspätung von einer Stunde akzeptieren."],
    why:
      "in Kauf nehmen = «смириться, принять как неизбежное» = akzeptieren (обычно о неприятном). " +
      "Дополнение остаётся Akkusativ в обеих версиях.",
  },
  {
    fvg: "sich in Verbindung setzen mit + Dat.",
    verb: "kontaktieren",
    fvgSent: "Setzen Sie sich bitte mit unserem Kundenservice in Verbindung.",
    verbSents: ["Kontaktieren Sie bitte unseren Kundenservice."],
    why:
      "sich mit … in Verbindung SETZEN = kontaktieren. Здесь sich ОБЯЗАТЕЛЬНО (в отличие от Abschied nehmen). " +
      "mit + Dativ → прямой Akkusativ у kontaktieren.",
  },
  {
    fvg: "zur Verfügung stehen",
    verb: "verfügbar sein",
    fvgSent: "Der Firmenwagen steht Ihnen nur dienstags zur Verfügung.",
    verbSents: ["Der Firmenwagen ist nur dienstags verfügbar."],
    why:
      "zur Verfügung STEHEN = «быть в распоряжении» = verfügbar sein. Датив адресата (Ihnen) " +
      "в Vollverb-версии исчезает — он уже вшит в значение verfügbar.",
  },
  {
    fvg: "zur Verfügung stellen",
    verb: "bereitstellen",
    fvgSent: "Die Firma stellt ihren Mitarbeitern ein Fahrrad zur Verfügung.",
    verbSents: ["Die Firma stellt ihren Mitarbeitern ein Fahrrad bereit."],
    why:
      "zur Verfügung STELLEN = bereitstellen — «предоставить». Отличай от zur Verfügung stehen: " +
      "тот, кто даёт, ставит (stellen), тот, кто пользуется, — стоит (stehen).",
  },
  {
    fvg: "zum Stillstand kommen",
    verb: "anhalten",
    fvgSent: "Der Zug kam kurz vor dem Bahnhof zum Stillstand.",
    verbSents: ["Der Zug hielt kurz vor dem Bahnhof an."],
    why:
      "zum Stillstand KOMMEN = anhalten. kommen здесь пустой — смысл в Stillstand. " +
      "anhalten отделяемый: сильное Präteritum hielt … an.",
  },
  {
    fvg: "in Betrieb nehmen",
    verb: "eröffnen",
    fvgSent: "Nächste Woche wird die neue Bahnlinie in Betrieb genommen.",
    verbSents: ["Nächste Woche wird die neue Bahnlinie eröffnet."],
    why:
      "in Betrieb NEHMEN = eröffnen — «вводить в эксплуатацию». Обе версии здесь в Passiv: " +
      "wird genommen / wird eröffnet — линия не может сделать это сама.",
  },
];

/* ============================================================================
   КАДРЫ: b2-modalpartikeln
   ----------------------------------------------------------------------------
   Только однозначные контексты: W-вопрос → denn, возражение → doch,
   вежливая просьба → mal, смирение → halt. Если две частицы честно возможны —
   обе в answers. ctx — ситуация на немецком, она стоит первой строкой.
   ========================================================================== */

export type PartikelFrame = { ctx: string; text: string; answers: string[]; why: string };

export const MODAL_PARTIKELN: PartikelFrame[] = [
  /* --------------------------------------------------------------- denn -- */
  {
    ctx: "Du siehst deinen Nachbarn nach langer Zeit.",
    text: "Hallo, wie geht es dir {0}?",
    answers: ["denn"],
    why:
      "W-вопрос + интерес → denn. В W-Fragen из набора {doch, ja, halt, denn, mal} только denn " +
      "делает вопрос живым и дружелюбным. В утверждении denn невозможен.",
  },
  {
    ctx: "Dein Freund kommt eine Stunde zu spät.",
    text: "Wo warst du {0}?",
    answers: ["denn"],
    why:
      "W-вопрос → denn: «ну и где же ты был?». denn в вопросах выражает интерес, а не упрёк — " +
      "упрёк создают остальные слова.",
  },
  {
    ctx: "Ein Kind fragt seine Mutter im Supermarkt.",
    text: "Mama, was kostet das {0}?",
    answers: ["denn"],
    why:
      "W-вопрос → denn. Ребёнок интересуется ценой: «а сколько же это стоит?». " +
      "Другие частицы из набора в W-вопросах не живут.",
  },
  {
    ctx: "Du triffst eine Kollegin am Bahnhof mit einem Koffer.",
    text: "Wohin fährst du {0}?",
    answers: ["denn"],
    why:
      "W-вопрос → denn: «а куда же ты едешь?». Обратите внимание на место: частица стоит в середине, " +
      "сразу после вопросительного слова и подлежащего.",
  },
  /* --------------------------------------------------------------- doch -- */
  {
    ctx: "Frage von der Freundin: «Kommst du morgen nicht mit ins Kino?»",
    text: "Doch! Ich komme {0} mit!",
    answers: ["doch"],
    why:
      "Ответ на ОТРИЦАТЕЛЬНЫЙ вопрос — это возражение («нет, приду!»), и здесь однозначно doch. " +
      "ja соглашалось бы с собеседником, а вы спорите.",
  },
  {
    ctx: "Dein Bruder behauptet, du hast sein Ladekabel genommen.",
    text: "Nein, ich habe {0} mein eigenes Kabel dabei!",
    answers: ["doch"],
    why:
      "Возражение: собеседник утверждает одно, вы говорите противоположное → doch. " +
      "«же / ведь»: «я же взял своё!».",
  },
  {
    ctx: "Du willst sichergehen, dass deine Freundin morgen kommt.",
    text: "Du kommst {0} morgen zur Party, oder?",
    answers: ["doch"],
    why:
      "Утверждение с ожиданием подтверждения (в конце oder?) → doch. Говорящий уверен, " +
      "но хочет услышать «да». ja здесь звучало бы как констатация без вопроса.",
  },
  /* ---------------------------------------------------------------- mal -- */
  {
    ctx: "Beim Essen: die Flasche steht auf der anderen Seite des Tisches.",
    text: "Reich mir {0} bitte die Flasche.",
    answers: ["mal", "doch"],
    why:
      "Вежливая просьба → mal: «передай-ка мне, пожалуйста». mal снимает категоричность. " +
      "doch здесь тоже возможен — добавляет лёгкое нетерпение («да передай же»). Засчитываются обе.",
  },
  {
    ctx: "Dein Handy klingelt in der Jackentasche.",
    text: "Moment, wartet {0} kurz, ich muss rangehen.",
    answers: ["mal", "doch"],
    why:
      "Вежливая просьба → mal: «подождите-ка». Частица стоит сразу после глагола-императива. " +
      "kurz усиливает «на минутку».",
  },
  /* --------------------------------------------------------------- halt -- */
  {
    ctx: "Der Bus ist weg, der nächste fährt erst in dreißig Minuten.",
    text: "Dann müssen wir {0} warten.",
    answers: ["halt"],
    why:
      "Смирение, «ничего не поделаешь» → halt: «ну, придётся уж подождать». " +
      "То же значение у eben — оба верны по духу, в наборе экзамена спрашивают halt.",
  },
  {
    ctx: "Für viele Jobs in Deutschland braucht man Deutsch.",
    text: "Man muss {0} damit leben, dass alles auf Deutsch ist.",
    answers: ["halt"],
    why:
      "halt — констатация факта, который нельзя изменить: «ну, придётся уж с этим жить». " +
      "Формулировка «damit leben» закреплена за смирением, поэтому здесь halt однозначен; " +
      "ja выразил бы возражение, doch — спор, halt — «так уж устроено».",
  },
  /* ---------------------------------------------------------------- ja --- */
  {
    ctx: "Dein Freund erklärt die Regel noch einmal, und jetzt verstehst du sie.",
    text: "Du hast {0} recht, so ist es viel einfacher!",
    answers: ["ja", "doch"],
    why:
      "Здесь честно возможны обе: ja — «действительно, как я теперь вижу» (признание общего факта), " +
      "doch — «а ведь ты прав» (отказ от собственного прежнего мнения). Разница в тоне, не в смысле — " +
      "поэтому принимаются обе частицы.",
  },
];

/* ============================================================================
   ГЕНЕРАТОРЫ
   ========================================================================== */

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/* ------------------------------------------------------ b2-nominalisierung ---
   Направление выбирается случайно. Оба ответа хранятся в кадре целиком:
   ни одна форма не выводится — только перестановка направления. */

export function nominalisierung(): Item {
  const f = pick(NOM_PAIRS);
  const toVerb = Math.random() < 0.5;
  return toVerb
    ? {
        topic: "b2-nominalisierung",
        task:
          "Forme den Satz in den Verbalstil um. Nominalstil → Verbalstil: придаточное вместо «предлог + Nomen».",
        text: `${f.nom}\n{0}`,
        gaps: [f.verb],
        why: f.why,
      }
    : {
        topic: "b2-nominalisierung",
        task:
          "Forme den Satz in den Nominalstil um. Verbalstil → Nominalstil: «предлог + Nomen» вместо придаточного.",
        text: `${f.verb[0]}\n{0}`,
        gaps: [[f.nom]],
        why:
          f.why +
          " Nominalstil любит письменный немецкий: газета, официальное письмо, научный текст.",
      };
}

/* ------------------------------------------------------- b2-funktionsverb ---
   Оба направления: конструкция → простой глагол и обратно. Подсказка даёт
   простой глагол, потому что спрашивается именно конструкция, а не словарь. */

export function funktionsverb(): Item {
  const f = pick(FVG_PAIRS);
  const toVollverb = Math.random() < 0.5;
  return toVollverb
    ? {
        topic: "b2-funktionsverb",
        task: `Ersetze das Funktionsverbgefüge durch das Vollverb «${f.verb}». Смысл — в Nomen, глагол-пустышка исчезает.`,
        text: `${f.fvgSent}\n{0}`,
        hint: `(${f.verb})`,
        gaps: [f.verbSents],
        why: f.why,
      }
    : {
        topic: "b2-funktionsverb",
        task: `Ersetze das Vollverb «${f.verb}» durch das Funktionsverbgefüge. Nomen + глагол-пустышка (+ предлог).`,
        text: `${f.verbSents[0]}\n{0}`,
        hint: `(${f.fvg})`,
        gaps: [[f.fvgSent]],
        why:
          f.why +
          " Обратно: смысловой глагол разворачивается в Nomen, рядом встаёт его Funktionsverb.",
      };
}

/* ----------------------------------------------------- b2-modalpartikeln ---
   Ситуация задана первой строкой — без неё вопрос «вставь частицу» был бы
   угадыванием. Все допустимые частицы лежат в answers. */

export function modalpartikeln(): Item {
  const f = pick(MODAL_PARTIKELN);
  return {
    topic: "b2-modalpartikeln",
    task: "Setze die passende Modalpartikel ein: doch, ja, halt, denn oder mal.",
    text: `${f.ctx}\n${f.text}`,
    gaps: [f.answers],
    why: f.why,
  };
}
