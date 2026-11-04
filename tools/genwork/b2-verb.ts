/* ============================================================================
   B2-VERB: Passiv mit Modalverben, Konjunktiv II der Vergangenheit, Konjunktiv I
   ----------------------------------------------------------------------------
   Почему кадры именно такие.

   b2-passiv-modal. Два навыка. Первый — конструирование: модальный спрягается
   на 2-м месте, Partizip II и «werden» уходят в конец, причём «werden» — самое
   последнее слово, а в придаточном оно переезжает ещё раз. Форма здесь
   выводится из таблиц: Partizip — из verbs.ts, спряжение модального — по
   числу подлежащего (оно вшито в кадр, как в PASSIV для wird/werden: форма
   обязана согласоваться с НОВЫМ подлежащим — бывшим аккузативом, а не с «man»).
   Второй навык — трансформация «Man muss …» → пассив: подмена подлежащего
   меняет и число модального, поэтому каждая пара хранится явно и выверена
   глазами, ответ один.

   b2-konjunktiv2-vergangenheit. «hätte/wäre + Partizip II» в обеих частях.
   Ловушка ровно одна, и на ней ломаются все: выбор вспомогательного. Поэтому
   у каждой дырки-вспомогательного в кадре стоит verb.aux из verbs.ts, а в
   тексте всегда есть явный триггер (Wenn …, An deiner Stelle, Ohne …) — без
   него упражнение не отличило бы нереальное от реального. Трансформации
   «реальное прошлое → нереальное» хранятся парами, обе перестановки
   (wenn впереди / позади) принимаются, как в NEBENSATZ.

   b2-konjunktiv1. Спрягать KI целиком бессмысленно: живёт он только в
   косвенной речи, и там реально работают формы 3-го лица ед.ч. (komme, habe,
   sei, werde, könne, müsse) плюс KII-формы мн.ч. (kämen, hätten, wären,
   würden), которыми закрывают совпадение с индикативом. Поэтому кадры —
   только эти формы: прямая речь → косвенная (ответ и вариант с dass) и
   дырка на конкретную форму. Почему KI — а не «Er sagte, er kommt» —
   объясняет why; разговорная замена KII упомянута в каждом объяснении.

   Ответ — целое предложение (трансформации) занимает отдельную строку {0}
   после \n — как в nebensatz() из gen.ts. Между частями исходных пар один
   пробел: двойные пробелы в строке — нарушение инварианта.
   ========================================================================== */

import type { Theory } from "@/lib/de/theory";
import type { Item } from "@/lib/de/gen";
import { verbByInf, type V } from "@/lib/de/verbs";

/* ============================================================================
   NEW-VERBS
   ----------------------------------------------------------------------------
   Новых смысловых глаголов не нужно: всё, что встречается в кадрах, уже есть
   в verbs.ts (включая beenden, untersuchen, besichtigen, bekommen).
   Модальные (können, müssen, dürfen, sollen, wollen) НЕ добавляются в VERBS:
   gen.ts сам держит их локальной таблицей MODAL, и в пассиве/KI от них нужны
   только фиксированные формы — они лежат в локальной таблице MODALS ниже.
   Добавлять их в VERBS вредно: perfekt()/partizip() рассчитаны на смысловые
   глаголы, а «gekonnt» в Partizip II модального никто не спрашивает.
   ========================================================================== */

/* ============================================================================
   ТЕОРИЯ
   ========================================================================== */

export const THEORY_B2_VERB: Record<string, Theory> = {
  "b2-passiv-modal": {
    regel:
      "Passiv mit Modalverben: Modalverb (konjugiert) + Partizip II + werden am Satzende. " +
      "Der Wagen muss repariert werden. Im Nebensatz geht «werden» ans allerletzte Ende: " +
      "…, weil der Wagen repariert werden muss. Das Subjekt ist der Akkusativ des Aktivsatzes.",
    ru:
      "Модальный + причастие II + werden в самом конце. Аккузатив-объект активного предложения " +
      "становится подлежащим, «man» исчезает, а модальный спрягается по НОВОМУ подлежащему: " +
      "man muss die Hausaufgaben → die Hausaufgaben müssen … werden. В придаточном «werden» " +
      "уезжает за причастие в самый конец.",
    tabelle: {
      head: ["Konstruktion", "Beispiel"],
      rows: [
        ["Aussage", "Der Wagen muss repariert werden."],
        ["Präteritum", "Der Wagen konnte nicht repariert werden."],
        ["Plural", "Die Wagen müssen repariert werden."],
        ["Nebensatz", "…, weil der Wagen repariert werden muss."],
      ],
    },
    beispiele: [
      {
        de: "Die Rechnung kann online bezahlt werden.",
        ru: "Счёт можно оплатить онлайн. kann — ед. число (Rechnung).",
      },
      {
        de: "Die Gäste sollen zum Fest eingeladen werden.",
        ru: "Гостей должны пригласить на праздник. sollen — мн. число (Gäste).",
      },
      {
        de: "Der Termin darf nicht vergessen werden.",
        ru: "О встрече нельзя забыть. dürfen в отрицании = «нельзя».",
      },
      {
        de: "…, weil das Zimmer noch aufgeräumt werden muss.",
        ru: "В придаточном модальный и «werden» меняются местами: причастие, werden, muss.",
      },
    ],
    fehler: [
      "Ставят «werden» перед причастием: «muss werden repariert» — werden всегда ПОСЛЕ Partizip II, самое последнее слово.",
      "Согласуют модальный со старым подлежащим: «Die Hausaufgaben muss gemacht werden» — подлежащее теперь мн.ч.: müssen.",
      "В придаточном не переезжают в конец: «weil repariert werden muss» — верно «weil … repariert werden muss», причастие перед werden.",
      "Ставят инфинитив вместо Partizip II: «muss reparieren werden» — только третья форма глагола.",
      "Оставляют «man» в пассиве: «Man muss das Auto repariert werden» — man исчезает вместе с активной конструкцией.",
    ],
    merk: "Порядок: Modalverb → Partizip II → werden. В придаточном werden — самое последнее слово, за причастием.",
  },

  "b2-konjunktiv2-vergangenheit": {
    regel:
      "Irreal in der Vergangenheit: hätte oder wäre + Partizip II in BEIDEN Teilen des Satzes. " +
      "Wenn ich das gewusst hätte, wäre ich gekommen. haben-Verben → hätte, Verben der Bewegung " +
      "und Zustandsänderung (gehen, fahren, kommen, bleiben, sein, werden) → wäre. " +
      "Steht «wenn» vorn oder fehlt ganz (An deiner Stelle…, Ohne…), beginnt der Hauptsatz mit dem Verb.",
    ru:
      "«Сделал бы» в прошлом — про то, чего НЕ было: hätte/wäre + причастие II, причём в обеих частях — " +
      "и в условии, и в главном. haben-глаголы → hätte, движение и смена состояния → wäre. " +
      "Русское «если бы я знал, я бы пришёл» переводится только этой формой: Präsens-KII (hätte) " +
      "относится к настоящему и о прошлом не говорит ничего.",
    tabelle: {
      head: ["Person", "haben-Verb", "sein-Verb"],
      rows: [
        ["ich", "hätte gemacht", "wäre gegangen"],
        ["du", "hättest gemacht", "wärest gegangen"],
        ["er / sie / es", "hätte gemacht", "wäre gegangen"],
        ["wir", "hätten gemacht", "wären gegangen"],
        ["ihr", "hättet gemacht", "wärt gegangen"],
        ["sie / Sie", "hätten gemacht", "wären gegangen"],
      ],
    },
    beispiele: [
      {
        de: "Wenn ich das gewusst hätte, wäre ich gekommen.",
        ru: "Если бы я это знал, я бы пришёл (но не знал). Обе части — нереальные.",
      },
      {
        de: "Hätte ich das gewusst, hätte ich anders gehandelt.",
        ru: "«Wenn» можно выбросить: вспомогательный встаёт на первое место, как при вопросе.",
      },
      {
        de: "An deiner Stelle wäre ich zu Hause geblieben.",
        ru: "«An deiner Stelle» — типовой триггер нереального условия без wenn.",
      },
      {
        de: "Ohne deine Hilfe hätte ich alles verloren.",
        ru: "«Ohne …» — условие в свёрнутом виде: KII Vergangenheit, wenn не нужен.",
      },
    ],
    fehler: [
      "Ставят Perfekt вместо KII: «Wenn ich das gewusst habe, …» — это РЕАЛЬНОЕ условие; нереальное — «gewusst hätte».",
      "Перепутали вспомогательный: «er hätte gekommen» вместо «wäre gekommen» — движение идёт с wäre.",
      "KII только в условии, а главное — в индикативе: «Wenn ich Zeit gehabt hätte, bin ich gekommen» — нереальны ОБЕ части.",
      "Оставили KII настоящего: «Wenn ich Zeit hätte» — это про сейчас; про прошлое нужен Partizip II: «gehabt hätte».",
      "В главном предложении забывают перестроить порядок: «Wenn … , ich wäre gekommen» — после wenn-частицы глагол на 2-м месте.",
    ],
    merk: "hätte/wäre + Partizip II в ОБОИХ частях. В wenn-частице вспомогательный в конце, в главном — на втором месте.",
  },

  "b2-konjunktiv1": {
    regel:
      "Die indirekte Rede steht im Konjunktiv I: er komme, er habe, er sei, er werde, er könne, er müsse. " +
      "In der 3. Person Singular ist die Form eindeutig (Endung -e statt -t). Im Plural und in der " +
        "Umgangssprache ersetzt man den Konjunktiv I durch Konjunktiv II (kämen, hätten, wären, würden), " +
      "weil die KI-Formen mit dem Indikativ zusammenfallen.",
    ru:
      "Косвенная речь передаёт чужие слова без ответственности за их правду: er sagte, er komme — " +
      "«он сказал, что (мол) придёт». Форма KI = инфинитив без -en + -e. Самое важное и самое " +
      "отчётливое лицо — 3-е ед.ч.: komme, habe, sei, werde. Во мн.ч. KI совпадает с индикативом " +
      "(sie kommen = индикатив), поэтому там берут KII: kämen, hätten, wären, würden. " +
      "В разговорной речи KI почти всегда вытеснен KII — но на письме и на экзамене ждут KI.",
    tabelle: {
      head: ["Verb", "KI (er/sie/es)", "KI-Perfekt", "Plural (KII statt KI)"],
      rows: [
        ["kommen", "er komme", "er sei gekommen", "sie kämen"],
        ["haben", "er habe", "er habe verkauft", "sie hätten"],
        ["sein", "er sei", "er sei gewesen", "sie seien / wären"],
        ["werden", "er werde", "—", "sie würden"],
        ["können", "er könne", "—", "sie könnten"],
      ],
    },
    beispiele: [
      {
        de: "Er sagte, er komme morgen.",
        ru: "Он сказал, что придёт завтра. KI Präsens: komme — а не «kommt».",
      },
      {
        de: "Sie sagte, sie habe das Auto verkauft.",
        ru: "KI Perfekt с haben: habe + Partizip II.",
      },
      {
        de: "Er sagte, er sei nach Berlin gefahren.",
        ru: "KI Perfekt с sein у глаголов движения: sei + gefahren.",
      },
      {
        de: "Sie sagten, sie hätten keine Zeit.",
        ru: "Мн.ч.: KI «haben» = индикатив, поэтому KII — hätten.",
      },
    ],
    fehler: [
      "Индикатив вместо KI: «Er sagte, er kommt morgen» — так передают чужие слова по-русски; немецкая косвенная речь требует komme.",
      "Пытаются спрягать KI как Präsens: «er kommt», «er hat» — у 3-го лица ед.ч. окончание -e: komme, habe, gehe.",
      "«er hätte gekommen» вместо «er sei gekommen» — в KI-Perfekt глаголы движения идут с sei.",
      "Во мн.ч. оставляют форму, совпадающую с индикативом: «Sie sagten, sie haben keine Zeit» — двусмысленно; говорят «hätten».",
      "Думают, что «er käme» в разговорной речи — ошибка: это норма, KII замещает KI там, где формы совпадают.",
    ],
    merk:
      "3-е лицо ед.ч. = чистый KI: er komme, er habe, er sei, er werde, er könne, er müsse. " +
      "Plural → KII (kämen, hätten, wären, würden). Разговорная речь: KII вместо KI.",
  },
};

/* ============================================================================
   КАДРЫ
   ========================================================================== */

/* ---------------------------------------------------- Passiv mit Modalverb --
   Заполнение дырок: число подлежащего вшито (plural), по нему берётся форма
   модального из MODALS. Кадры проверены глазами на естественность:
   «Der Termin darf nicht vergessen werden» звучит по-немецки, «Der Termin
   muss … vergessen» — нет, поэтому модальный тоже часть кадра. */

export type PassivModalGap = {
  text: string;
  v: string;
  modal: string;
  plural: boolean;
};

export const PASSIV_MODAL_GAPS: PassivModalGap[] = [
  { text: "Die Wohnung {0} jeden Freitag {1} {2}.", v: "putzen", modal: "müssen", plural: false },
  { text: "Die E-Mails {0} erst morgen {1} {2}.", v: "schreiben", modal: "können", plural: true },
  { text: "Die Rechnung {0} per Karte {1} {2}.", v: "bezahlen", modal: "können", plural: false },
  { text: "Die Gäste {0} zum Fest {1} {2}.", v: "einladen", modal: "sollen", plural: true },
  { text: "Der Termin {0} nicht {1} {2}.", v: "vergessen", modal: "dürfen", plural: false },
  { text: "Die Hausaufgaben {0} bis morgen {1} {2}.", v: "machen", modal: "müssen", plural: true },
  { text: "Die Arbeit {0} bis Freitag {1} {2}.", v: "beenden", modal: "müssen", plural: false },
  { text: "Die Patienten {0} gründlich {1} {2}.", v: "untersuchen", modal: "müssen", plural: true },
  { text: "Das Zimmer {0} noch heute {1} {2}.", v: "aufräumen", modal: "müssen", plural: false },
  { text: "Der Roman {0} an einem Abend {1} {2}.", v: "lesen", modal: "können", plural: false },
  { text: "Die Getränke {0} für das Fest {1} {2}.", v: "mitbringen", modal: "sollen", plural: true },
  { text: "Das Museum {0} nur mit Führung {1} {2}.", v: "besichtigen", modal: "dürfen", plural: false },
];

/* Трансформация «Man muss …» → пассив. Ответ один: подлежащее новое,
   модальный согласуется с ним — в кадрах с мн.ч. это и есть главная ловушка
   («man muss» → «die Hausaufgaben müssen»). Прошедшее время модального
   (konnte, musste) тоже вшито: оно переезжает без изменений. */

export type PassivModalTrans = {
  aktiv: string;
  answers: string[];
  plural: boolean;
  why: string;
};

export const PASSIV_MODAL_TRANS: PassivModalTrans[] = [
  {
    aktiv: "Man muss das Auto reparieren.",
    answers: ["Das Auto muss repariert werden."],
    plural: false,
    why: "Auto — единственное число → muss. Причастие repariert, «werden» в самом конце.",
  },
  {
    aktiv: "Man kann die Rechnung online bezahlen.",
    answers: ["Die Rechnung kann online bezahlt werden."],
    plural: false,
    why: "Rechnung — единственное число → kann. bezahlen → bezahlt (слабый глагол).",
  },
  {
    aktiv: "Man darf das Museum sonntags besichtigen.",
    answers: ["Das Museum darf sonntags besichtigt werden."],
    plural: false,
    why: "Museum — единственное число → darf. besichtigen — неотделяемая приставка, без ge-: besichtigt.",
  },
  {
    aktiv: "Man soll die Gäste um acht einladen.",
    answers: ["Die Gäste sollen um acht eingeladen werden."],
    plural: true,
    why: "Гости — множественное число → sollen (не «soll»!). einladen → eingeladen, ge- внутри: приставка ein-.",
  },
  {
    aktiv: "Man muss die Hausaufgaben bis Freitag machen.",
    answers: ["Die Hausaufgaben müssen bis Freitag gemacht werden."],
    plural: true,
    why: "Hausaufgaben — множественное число → müssen. Главный подвох трансформации: было «man muss», стало «müssen».",
  },
  {
    aktiv: "Man kann die Getränke selbst mitbringen.",
    answers: ["Die Getränke können selbst mitgebracht werden."],
    plural: true,
    why: "Getränke — множественное число → können. mitbringen → mitgebracht: приставка mit- отделяемая.",
  },
  {
    aktiv: "Man konnte den Schlüssel nicht finden.",
    answers: ["Der Schlüssel konnte nicht gefunden werden."],
    plural: false,
    why: "Прошедшее время модального (konnte) переезжает без изменений. finden — сильный глагол: gefunden.",
  },
  {
    aktiv: "Man musste die Wohnung schnell putzen.",
    answers: ["Die Wohnung musste schnell geputzt werden."],
    plural: false,
    why: "musste остаётся musste. putzen → geputzt.",
  },
];

/* ------------------------------------ Konjunktiv II der Vergangenheit: дырки --
   В каждой кадре явный триггер нереальности (Wenn / An deiner Stelle / Ohne)
   и оба вспомогательных из verbs.ts (aux): haben → hätte, sein → wäre.
   Дырки: Partizip II → вспомогательный wenn-частицы → вспомогательный главного
   (порядок вшит в текст, переиграть его нельзя). */

export type Konj2VGap = {
  text: string;
  gaps: string[][];
  hint: string;
  why: string;
};

export const KONJ2V_GAPS: Konj2VGap[] = [
  {
    text: "Wenn ich das {0} {1}, {2} ich gekommen.",
    gaps: [["gewusst"], ["hätte"], ["wäre"]],
    hint: "(wissen / kommen)",
    why: "wissen — haben-глагол: gewusst hätte. kommen — движение, sein-глагол: wäre gekommen. Нереальны обе части, не только условие.",
  },
  {
    text: "Wenn du mich {0} {1}, {2} ich dir {3}.",
    gaps: [["angerufen"], ["hättest"], ["hätte"], ["geholfen"]],
    hint: "(anrufen / helfen)",
    why: "du → hättest, ich → hätte. Оба глагола haben-глаголы: angerufen hättest, geholfen hätte.",
  },
  {
    text: "Wenn wir mehr Geld {0} {1}, {2} wir ein größeres Auto {3}.",
    gaps: [["gehabt"], ["hätten"], ["hätten"], ["gekauft"]],
    hint: "(haben / kaufen)",
    why: "haben → hätten gehabt, kaufen → hätten gekauft. wir → hätten. Условие и следствие оба нереальные.",
  },
  {
    text: "Wenn es gestern nicht so kalt {0} {1}, {2} wir länger spazieren {3}.",
    gaps: [["gewesen"], ["wäre"], ["wären"], ["gegangen"]],
    hint: "(sein / gehen)",
    why: "sein → gewesen wäre, gehen — движение → wären gegangen. Про вчера — значит обе части в прошлом (Partizip II обязателен).",
  },
  {
    text: "An deiner Stelle {0} ich zu Hause {1}.",
    gaps: [["wäre"], ["geblieben"]],
    hint: "(bleiben)",
    why: "«An deiner Stelle» = если бы я был на твоём месте — нереальное условие без wenn. bleiben — sein-глагол: wäre geblieben.",
  },
  {
    text: "Ohne deine Hilfe {0} ich das Fahrrad nicht {1}.",
    gaps: [["hätte"], ["repariert"]],
    hint: "(reparieren)",
    why: "«Ohne …» — условие в свёрнутом виде; нереально в прошлом → hätte + Partizip II. reparieren — haben-глагол.",
  },
  {
    text: "Sie {0} gern mitgekommen, aber sie {1} krank.",
    gaps: [["wäre"], ["war", "ist"]],
    hint: "(sein)",
    why: "«wäre gern … mitgekommen» — несбывшееся желание о прошлом (mitkommen → sein-глагол: wäre). Реальная причина остаётся в индикативе: sie war krank (или ist krank, если она всё ещё больна).",
  },
  {
    text: "Wenn ihr früher {0} {1}, {2} ihr den Bus noch {3}.",
    gaps: [["aufgestanden"], ["wärt"], ["hättet"], ["bekommen"]],
    hint: "(aufstehen / bekommen)",
    why: "ihr-формы: aufstehen — sein-глагол → wärt aufgestanden; bekommen — haben-глагол → hättet bekommen.",
  },
];

/* --------------------------- Konjunktiv II der Vergangenheit: трансформации --
   Реальное прошлое → нереальное условие. Ответ хранится целиком в обеих
   перестановках: «Wenn …» впереди и позади — оба варианта верны, как в
   NEBENSATZ. Полярность меняется только там, где это естественно
   (nicht убирается), больше ничего в предложении не перестраивается. */

export type Konj2VTrans = { a: string; answers: string[]; why: string };

export const KONJ2V_TRANS: Konj2VTrans[] = [
  {
    a: "Ich habe nicht genug Geld gehabt. Deshalb habe ich die Jacke nicht gekauft.",
    answers: [
      "Wenn ich genug Geld gehabt hätte, hätte ich die Jacke gekauft.",
      "Ich hätte die Jacke gekauft, wenn ich genug Geld gehabt hätte.",
    ],
    why: "haben → hätte gehabt, kaufen → hätte gekauft. «nicht» уходит: реальность была «денег не было», нереальность — «если бы БЫЛИ».",
  },
  {
    a: "Der Vater hat das Auto nicht repariert. Deshalb sind wir nicht nach Kiel gefahren.",
    answers: [
      "Wenn der Vater das Auto repariert hätte, wären wir nach Kiel gefahren.",
      "Wir wären nach Kiel gefahren, wenn der Vater das Auto repariert hätte.",
    ],
    why: "reparieren — haben-глагол: repariert hätte. fahren — движение: wären gefahren. Главное предложение после wenn-частицы начинается с глагола.",
  },
  {
    a: "Das Wetter war nicht schön. Deshalb sind wir nicht schwimmen gegangen.",
    answers: [
      "Wenn das Wetter schön gewesen wäre, wären wir schwimmen gegangen.",
      "Wir wären schwimmen gegangen, wenn das Wetter schön gewesen wäre.",
    ],
    why: "sein → gewesen wäre, gehen → wären gegangen. Оба sein-глагола, потому что движение и состояние.",
  },
  {
    a: "Er hat die Wahrheit nicht gesagt. Deshalb hat man ihm nicht geholfen.",
    answers: [
      "Wenn er die Wahrheit gesagt hätte, hätte man ihm geholfen.",
      "Man hätte ihm geholfen, wenn er die Wahrheit gesagt hätte.",
    ],
    why: "sagen → gesagt hätte, helfen → hätte geholfen. «man» в KII остаётся: man hätte … geholfen.",
  },
  {
    a: "Du hast mir nicht geholfen. Deshalb habe ich alles allein gemacht.",
    answers: [
      "Wenn du mir geholfen hättest, hätte ich nicht alles allein gemacht.",
      "Ich hätte nicht alles allein gemacht, wenn du mir geholfen hättest.",
    ],
    why: "du → hättest, ich → hätte. helfen и machen — haben-глаголы.",
  },
  {
    a: "Wir haben die Hausaufgaben nicht gemacht. Deshalb haben wir Probleme bekommen.",
    answers: [
      "Wenn wir die Hausaufgaben gemacht hätten, hätten wir keine Probleme bekommen.",
      "Wir hätten keine Probleme bekommen, wenn wir die Hausaufgaben gemacht hätten.",
    ],
    why: "machen → gemacht hätten, bekommen → hätten bekommen. Отрицание переезжает: «keine Probleme».",
  },
];

/* ---------------------------------------------- Konjunktiv I: трансформации --
   Прямая речь → косвенная. Ответ и вариант с «dass» оба верны. Во мн.ч. —
   KII-формы (kämen, hätten, wären, würden): KI совпадает с индикативом,
   и каждый учебник это подменяет. Личные местоимения 2-го лица в цитатах
   не используются: их сдвиг зависит от перспективы говорящего, и упражнение
   не имеет права этому учить. */

export type Konj1Trans = { rep: string; q: string; answers: string[]; note: string };

export const KONJ1_TRANS: Konj1Trans[] = [
  {
    rep: "Er sagte",
    q: "Ich komme morgen.",
    answers: ["Er sagte, er komme morgen.", "Er sagte, dass er morgen komme."],
    note: "kommen → KI er komme. Форма = инфинитив без -en + -e.",
  },
  {
    rep: "Er sagte",
    q: "Ich bin krank.",
    answers: ["Er sagte, er sei krank.", "Er sagte, dass er krank sei."],
    note: "sein в KI — er sei. Самая известная форма косвенной речи, не «ist» и не «wäre».",
  },
  {
    rep: "Er sagte",
    q: "Ich habe keine Zeit.",
    answers: ["Er sagte, er habe keine Zeit.", "Er sagte, dass er keine Zeit habe."],
    note: "haben в KI — er habe, не «hat».",
  },
  {
    rep: "Er sagte",
    q: "Ich kann nicht kommen.",
    answers: ["Er sagte, er könne nicht kommen.", "Er sagte, dass er nicht kommen könne."],
    note: "модальный в KI: können → er könne. Инфинитив остаётся в конце (в dass-придаточном — за könne).",
  },
  {
    rep: "Er sagte",
    q: "Ich muss arbeiten.",
    answers: ["Er sagte, er müsse arbeiten.", "Er sagte, dass er arbeiten müsse."],
    note: "müssen → er müsse.",
  },
  {
    rep: "Er sagte",
    q: "Ich werde morgen anrufen.",
    answers: ["Er sagte, er werde morgen anrufen.", "Er sagte, er rufe morgen an."],
    note: "werden → er werde + Infinitiv. Тот же смысл передаёт и KI Präsens: er rufe morgen an — оба варианта верны.",
  },
  {
    rep: "Er sagte",
    q: "Ich habe das Auto verkauft.",
    answers: ["Er sagte, er habe das Auto verkauft.", "Er sagte, dass er das Auto verkauft habe."],
    note: "KI Perfekt с haben: er habe + verkauft.",
  },
  {
    rep: "Er sagte",
    q: "Ich bin nach Berlin gefahren.",
    answers: ["Er sagte, er sei nach Berlin gefahren.", "Er sagte, dass er nach Berlin gefahren sei."],
    note: "KI Perfekt с sein: движение → er sei gefahren, не «hätte gefahren».",
  },
  {
    rep: "Er sagte",
    q: "Ich weiß die Antwort.",
    answers: ["Er sagte, er wisse die Antwort.", "Er sagte, dass er die Antwort wisse."],
    note: "wissen — нерегулярный: er wisse (не «weiße», не «wüsste» — последнее уже KII).",
  },
  {
    rep: "Sie sagten",
    q: "Wir haben schon gegessen.",
    answers: ["Sie sagten, sie hätten schon gegessen.", "Sie sagten, dass sie schon gegessen hätten."],
    note: "Во мн.ч. KI (sie haben) совпадает с индикативом, поэтому KII: sie hätten. Так делают и в разговорной речи.",
  },
  {
    rep: "Sie sagten",
    q: "Wir sind zu Hause geblieben.",
    answers: ["Sie sagten, sie wären zu Hause geblieben.", "Sie sagten, dass sie zu Hause geblieben wären."],
    note: "KI «sie sind» = индикатив → KII: sie wären. bleiben — sein-глагол.",
  },
  {
    rep: "Sie sagten",
    q: "Wir kommen morgen.",
    answers: ["Sie sagten, sie kämen morgen.", "Sie sagten, dass sie morgen kämen."],
    note: "KI «sie kommen» = индикатив → KII: sie kämen.",
  },
  {
    rep: "Sie sagten",
    q: "Wir werden später kommen.",
    answers: ["Sie sagten, sie würden später kommen.", "Sie sagten, dass sie später kommen würden."],
    note: "werden во мн.ч. → KII: sie würden.",
  },
];

/* ----------------------------------------------------- Konjunktiv I: дырки --
   Только формы, которые реально живут в косвенной речи. Отделяемый глагол
   (aufstehen → er stehe … auf) показан двумя дырками, как в trennbar(). */

export type Konj1Gap = { text: string; gaps: string[][]; hint: string; why: string };

export const KONJ1_GAPS: Konj1Gap[] = [
  {
    text: "Der Arzt sagte, der Patient {0} jeden Tag Tabletten.",
    gaps: [["nehme"]],
    hint: "(nehmen)",
    why: "KI Präsens: nehmen → er nehme. В косвенной речи KI обязателен, даже если форма выглядит непривычно.",
  },
  {
    text: "Sie sagte, sie {0} am Wochenende nach Kiel {1}.",
    gaps: [["sei"], ["gefahren"]],
    hint: "(fahren)",
    why: "KI Perfekt с sein: er/sie sei + gefahren. fahren — движение, вспомогательный sei, не «habe».",
  },
  {
    text: "Er sagte, er {0} den Film schon {1}.",
    gaps: [["habe"], ["gesehen"]],
    hint: "(sehen)",
    why: "KI Perfekt с haben: er habe + gesehen. sehen — сильный глагол: gesehen.",
  },
  {
    text: "Der Lehrer sagte, die Schüler {0} heute sehr fleißig.",
    gaps: [["seien"]],
    hint: "(sein)",
    why: "Мн. число: KI sein → sie seien. Форма однозначна, поэтому её можно оставить в KI.",
  },
  {
    text: "Er sagte, er {0} jeden Morgen um sechs {1}.",
    gaps: [["stehe"], ["auf"]],
    hint: "(aufstehen)",
    why: "KI от отделяемого глагола: er stehe … auf. Приставка уходит в конец, как в обычном предложении.",
  },
  {
    text: "Sie sagte, sie {0} den Bericht später {1}.",
    gaps: [["werde"], ["schreiben"]],
    hint: "(werden / schreiben)",
    why: "KI Futur: er/sie werde + Infinitiv. В dass-придаточном порядок тот же: … sie den Bericht später schreiben werde.",
  },
  {
    text: "Sie sagten, sie {0} keine Zeit {1}.",
    gaps: [["hätten"], ["gehabt"]],
    hint: "(haben)",
    why: "Мн. число + Perfekt: KI «haben» = индикатив, поэтому KII — hätten + gehabt.",
  },
  {
    text: "Die Chefin sagte, er {0} früher gehen.",
    gaps: [["dürfe"]],
    hint: "(dürfen)",
    why: "KI модального: dürfen → er dürfe. Ряд модальных KI: könne, müsse, dürfe, solle, wolle.",
  },
];

/* ============================================================================
   ГЕНЕРАТОРЫ
   ========================================================================== */

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/* Спряжение модальных — локально, по образцу MODAL в gen.ts: VERBS хранит
   смысловые глаголы, модальные в пассиве нужны только в форме ед./мн.ч. */
const MODALS: Record<string, string[]> = {
  müssen: ["muss", "musst", "muss", "müssen", "müsst", "müssen"],
  können: ["kann", "kannst", "kann", "können", "könnt", "können"],
  dürfen: ["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"],
  sollen: ["soll", "sollst", "soll", "sollen", "sollt", "sollen"],
  wollen: ["will", "willst", "will", "wollen", "wollt", "wollen"],
};

const verb = (inf: string): V => verbByInf[inf] ?? VERBS_FALLBACK;

/* verbByInf всегда находит кадровые глаголы (проверено тестом на кадрах),
   fallback нужен только TypeScript, чтобы тип был не undefined. */
const VERBS_FALLBACK: V = {
  inf: "machen",
  pr: "mache macht macht machen macht machen",
  part: "gemacht",
  aux: "h",
};

/* ------------------------------------------------------ b2-passiv-modal ---
   Половина карточек — сборка формы по трём дыркам, половина — трансформация
   «man» → пассив. В обоих случаях ответ детерминирован. */

function passivModal(): Item {
  if (Math.random() < 0.5) {
    const f = pick(PASSIV_MODAL_GAPS);
    const v = verb(f.v);
    const form = f.plural ? MODALS[f.modal][3] : MODALS[f.modal][2];
    return {
      topic: "b2-passiv-modal",
      task: "Passiv mit Modalverb: Modalverb + Partizip II + «werden» в самом конце.",
      text: f.text,
      hint: `(${f.modal} / ${v.inf})`,
      gaps: [[form], [v.part], ["werden"]],
      why:
        `Passiv mit Modalverb = Modalverb + Partizip II + werden. ` +
        (f.plural
          ? `Подлежащее во мн. числе → ${f.modal} спрягается как «wir/sie»: ${MODALS[f.modal][3]}.`
          : `Подлежащее в ед. числе → ${f.modal} без окончания: ${MODALS[f.modal][2]}.`) +
        ` «${v.inf}» → ${v.part}, «werden» — самое последнее слово: «${
          f.text.replace("{0}", form).replace("{1}", v.part).replace("{2}", "werden").replace(/\.$/, "")
        }».`,
    };
  }
  const f = pick(PASSIV_MODAL_TRANS);
  return {
    topic: "b2-passiv-modal",
    task: "Verwandle den Satz mit «man» ins Passiv mit Modalverb. Akkusativ-Objekt → Subjekt.",
    text: `${f.aktiv}\n{0}`,
    gaps: [f.answers],
    why:
      `Аккузатив-объект становится подлежащим, «man» исчезает. ` +
      `Модальный согласуется с НОВЫМ подлежащим — ${f.plural ? "здесь мн. число" : "здесь ед. число"} — ` +
      `а не с «man»: «${f.answers[0].replace(/\.$/, "")}». Смысловой глагол — Partizip II, «werden» — в самом конце.`,
  };
}

/* --------------------------------- b2-konjunktiv2-vergangenheit ------------
   Сборка по дыркам (вспомогательные из verb.aux — haben→hätte, sein→wäre)
   и трансформация реального прошлого в нереальное, оба порядка верны. */

function konjunktiv2Vergangenheit(): Item {
  if (Math.random() < 0.5) {
    const f = pick(KONJ2V_GAPS);
    return {
      topic: "b2-konjunktiv2-vergangenheit",
      task: "Konjunktiv II der Vergangenheit: hätte/wäre + Partizip II в обеих частях.",
      text: f.text,
      hint: f.hint,
      gaps: f.gaps,
      why: f.why,
    };
  }
  const f = pick(KONJ2V_TRANS);
  return {
    topic: "b2-konjunktiv2-vergangenheit",
    task: "Forme die realen Sätze in den irrealen Bedingungssatz der Vergangenheit um. Оба порядка верны.",
    text: `${f.a}\n{0}`,
    gaps: [f.answers],
    why:
      "Реальное прошлое пересказано как нереальное: обе части — Konjunktiv II Vergangenheit " +
      "(hätte/wäre + Partizip II). В wenn-частице вспомогательный в конце, в главном — на втором месте. " +
      `Здесь: «${f.answers[0].replace(/\.$/, "")}».`,
  };
}

/* ------------------------------------------------------ b2-konjunktiv1 ----
   Прямая речь → косвенная (ответ и dass-вариант) и дырка на живую KI-форму.
   В каждом why — разговорная замена KII, чтобы форма не выучилась как
   отдельная экзотика. */

function konjunktiv1(): Item {
  if (Math.random() < 0.55) {
    const f = pick(KONJ1_TRANS);
    return {
      topic: "b2-konjunktiv1",
      task: "Setze in die indirekte Rede (Konjunktiv I). Beide Varianten gelten: mit und ohne «dass».",
      text: `${f.rep}: „${f.q}“\n{0}`,
      hint: "(Konjunktiv I)",
      gaps: [f.answers],
      why:
        `${f.note} В разговорной речи KI часто заменяют на KII (er käme / er hätte … gekauft) ` +
        `или würde + Infinitiv — но в косвенной речи на письме ждут Konjunktiv I.`,
    };
  }
  const f = pick(KONJ1_GAPS);
  return {
    topic: "b2-konjunktiv1",
    task: "Setze das Verb im Konjunktiv I ein.",
    text: f.text,
    hint: f.hint,
    gaps: f.gaps,
    why: `${f.why} В разговорной речи вместо KI стоял бы KII (kämen / hätten / wären / würden) — это норма, но здесь спрашивается KI.`,
  };
}

export { passivModal, konjunktiv2Vergangenheit, konjunktiv1 };
