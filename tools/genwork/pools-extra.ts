/* ============================================================================
   РАСШИРЕНИЕ МАЛЫХ ПУЛОВ КАДРОВ — только НОВЫЕ кадры, ничего не удаляем.
   ----------------------------------------------------------------------------
   Проблема: в раунде из 6 упражнений маленький пул (4–9 кадров) даёт видимые
   повторы. Этот файл добавляет к каждому пулу новые кадры ТОГО ЖЕ типа и ТОГО
   ЖЕ качества: формат — точная копия типа из исходного файла.

   Что сюда входит (все новые кадры только ДОБАВЛЯЮТСЯ к существующим пулам):

     GEN_FRAMES_EXTRA      ← a2.ts GEN_FRAMES        (a2-genitiv),        +6
     KONN_FRAMES_EXTRA     ← a2.ts KONN_FRAMES       (a2-konnektoren),    +9
     FRAGE_FRAMES_EXTRA    ← b2praep.ts FRAGE_FRAMES (b2-praep.adverbien),+6
     OB_TRANS_EXTRA        ← a2.ts OB_TRANS          (a2-nebensatz-ob),   +7
     KONJ2V_TRANS_EXTRA    ← b2verb.ts KONJ2V_TRANS  (b2-konj2-verg.),    +6
     ES_HOLE_EXTRA         ← c1a.ts ES_HOLE          (c1-es-konstruktionen), +5

   Типы повторены локально там, где они не экспортированы из исходника
   (KonnFrame, GenFrame, ObTrans — a2.ts; FrageFrame — b2praep.ts; EsHole —
   c1a.ts). Konj2VTrans экспортирован из b2verb.ts — импортирован, чтобы при
   расхождении исходника компилятор закричал.

   Инварианты, проверенные прогоном (tools/deprobe-style):
     · каждый существительное из каждого пула GEN_FRAMES_EXTRA найдено в
       NOUNS (иначе nounOf() молча подставил бы NOUNS[0]);
     · каждая рамка GEN даёт грамматичную группу в Genitiv с тремя разными
       существительными пула (включая слабое склонение);
     · FRAGE_FRAMES_EXTRA: предлоги только из VERBEN_PRAEP, da(r)-правило
       (гласная → -r) соблюдено в каждом ответе;
     · KONJ2V_TRANS_EXTRA: вспомогательный в обеих частях выведен из verb.aux
       (verbs.ts), обе перестановки (wenn впереди/позади) в answers;
     · ES_HOLE_EXTRA: es не стоит первым словом текста — перед ним цитата
       источника («Im Brief stand: …»);
     · ни одного глагола, которого нет в verbs.ts (NEW-VERBS не появилось).
   ========================================================================== */

import type { Konj2VTrans } from "@/lib/de/b2verb";

/* ============================================================================
   ТИПЫ — структурные копии неэкспортированных типов исходников
   ========================================================================== */

/** копия KonnFrame из a2.ts (a2-konnektoren) */
type KonnFrame = { a: string; b: string; answers: string[]; why: string };

/** копия GenFrame из a2.ts (a2-genitiv) */
type GenFrame = { text: string; pool: string[] };

/** копия ObTrans из a2.ts (a2-nebensatz-ob) */
type ObTrans = { q: string; stem: string; answer: string };

/** копия FrageFrame из b2praep.ts (b2-praepositionaladverbien, форма b) */
type FrageFrame = { frage: string; text: string; answer: string; why: string };

/** копия EsHole из c1a.ts (c1-es-konstruktionen) */
type EsHole = { text: string; a: string; why: string };

/* ============================================================================
   1. a2-genitiv: +6 рамок
   ----------------------------------------------------------------------------
   Генератор берёт существительное из pool, ставит его в Genitiv через
   phrase(x, "gen") и подставляет в рамку: «des Vaters», «der Mutter»,
   «des Studenten» (слабое). Рамка обязана звучать с ЛЮБЫМ существительным
   пула — поэтому пулы однородные: либо люди, либо помещения.
   ========================================================================== */

export const GEN_FRAMES_EXTRA: GenFrame[] = [
  {
    text: "Die Wohnung {0} ist im dritten Stock.",
    pool: [
      /* der Nachbar не берём: nomenForm даёт «des Nachbaren», а учебный
         стандарт — «des Nachbarn» (см. комментарий у пулов ниже) */
      "der Lehrer", "die Lehrerin", "der Kollege", "der Student", "der Sohn",
      "die Frau", "die Mutter", "der Vater", "die Schwester", "der Bruder",
    ],
  },
  {
    text: "Die Telefonnummer {0} habe ich sofort aufgeschrieben.",
    pool: [
      "der Lehrer", "die Lehrerin", "der Kollege", "der Sohn", "der Freund",
      "die Freundin", "die Schwester", "der Bruder", "die Mutter", "der Vater",
    ],
  },
  {
    text: "Die Mutter {0} arbeitet in der Schule.",
    pool: [
      "der Junge", "das Kind", "das Mädchen", "der Student", "der Sohn",
      "der Kollege",
    ],
  },
  {
    text: "Der Hund {0} bellt laut.",
    /* der Nachbar исключён сознательно: слабое склонение даёт в Genitiv
       «des Nachbaren» (так его строит nomenForm из nouns.ts), а учебный
       стандарт — «des Nachbarn». Пока форма в nouns.ts не поправлена,
       новые кадры её не тиражируют. Остальные слабые слова (Junge,
       Student, Kollege, Kunde) с -(e)n дают правильную форму. */
    pool: [
      "der Sohn", "der Lehrer", "der Kollege", "der Vater", "die Mutter",
      "die Frau", "der Freund", "die Schwester",
    ],
  },
  {
    text: "Die Tür {0} ist offen.",
    pool: [
      "das Zimmer", "das Haus", "die Küche", "das Büro", "die Schule",
      "das Kino", "das Theater", "die Wohnung", "das Krankenhaus",
      "die Bibliothek",
    ],
  },
  {
    text: "Der Beruf {0} interessiert mich.",
    pool: [
      "die Frau", "die Mutter", "der Vater", "der Lehrer", "die Lehrerin",
      "die Schwester", "der Bruder", "der Freund", "die Freundin", "der Kollege",
    ],
  },
];

/* ============================================================================
   2. a2-konnektoren: +9 кадров (und / aber / oder / denn / sondern / deshalb)
   ----------------------------------------------------------------------------
   Та же механика отсечения по порядку слов: после дырки инверсия («gehe ich»)
   → только наречия (deshalb/darum/deswegen); целый порядок («ich gehe») →
   только сочинительные (und/aber/oder/denn/sondern). Остальное добирает смысл:
   противопоставление → aber, замена после отрицания → sondern, причина при
   целом порядке → denn, выбор → oder.
   ========================================================================== */

export const KONN_FRAMES_EXTRA: KonnFrame[] = [
  {
    a: "Ich bin sehr müde,",
    b: " gehe ich früh ins Bett.",
    answers: ["deshalb", "darum", "deswegen"],
    why: "После дырки инверсия («gehe ich») — значит, наречие: deshalb/darum/deswegen. Союзы (und, aber, denn) порядок слов не меняют.",
  },
  {
    a: "Der Laden hat schon geschlossen,",
    b: " kaufe ich im nächsten Dorf ein.",
    answers: ["deshalb", "darum", "deswegen"],
    why: "Следствие + инверсия после дырки («kaufe ich») → deshalb. Наречие занимает позицию 1, глагол встаёт на 2-ю; einkaufen — отделяемая приставка, «ein» уходит в конец.",
  },
  {
    a: "Ich bleibe heute zu Hause,",
    b: " ich bin erkältet.",
    answers: ["denn"],
    why: "Причина при целом порядке слов → denn. deshalb нельзя: после него нужна инверсия («deshalb bin ich…»); у weil глагол уехал бы в конец.",
  },
  {
    a: "Wir nehmen den Wagen,",
    b: " wir haben viele Koffer.",
    answers: ["denn"],
    why: "Вторая часть объясняет ПРИЧИНУ → denn. und соединял бы два независимых факта, aber требует противопоставления — его здесь нет.",
  },
  {
    a: "Das Zimmer ist klein,",
    b: " es ist sehr teuer.",
    answers: ["aber"],
    why: "Противопоставление («маленькое, зато очень дорогое») → aber. und означал бы простое перечисление, aber здесь именно «но».",
  },
  {
    a: "Die Jacke gefällt mir,",
    b: " sie ist zu teuer.",
    answers: ["aber"],
    why: "Два факта противоречат друг другу (нравится / дорогая) → aber. und невозможен: «нравится И дорогая» не звучит, denn дал бы ложную причину.",
  },
  {
    a: "Nimmst du den Bus,",
    b: " fährst du mit dem Wagen?",
    answers: ["oder"],
    why: "Выбор между двумя вариантами (вопрос-альтернатива) → oder. «на автобусе или на машине?» — выбирают только одно.",
  },
  {
    a: "Am Vormittag habe ich geputzt,",
    b: " am Nachmittag habe ich gekocht.",
    answers: ["und"],
    why: "Перечисление двух действий по очереди → und. Наречие (deshalb) грамматически невозможно: после «am Nachmittag» глагол встал бы на 3-е место, а не на 2-е.",
  },
  {
    a: "Wir fahren nicht nach Berlin,",
    b: " wir fahren nach Kiel.",
    answers: ["sondern"],
    why: "После отрицания «nicht», когда вторая часть ЗАМЕНЯЕТ первую, стоит sondern: «не в Берлин, а в Киль». Это единственная работа sondern в языке.",
  },
];

/* ============================================================================
   3. b2-praepositionaladverbien, форма (b): +6 кадров
   ----------------------------------------------------------------------------
   Вопрос с wo(r)+Präposition фиксирует предлог, ответ — da(r)+тот же предлог.
   Предлоги только из VERBEN_PRAEP (data.ts): von, nach, auf, über, an, um.
   da(r)-правило: предлог с гласной → -r (darauf, darüber, daran, darum);
   с согласной — без r (davon, danach). Управления — только те, что уже
   проверены в VERBEN_PRAEP / ERSETZ_PAARE.
   ========================================================================== */

export const FRAGE_FRAMES_EXTRA: FrageFrame[] = [
  {
    frage: "Wovon hängt es ab?",
    text: "— {0}, ob der Chef den Termin verschiebt.",
    answer: "Davon",
    why: "abhängen VON → wovon/davon. Предлог с согласной — без -r: davon. Ответ эллиптичен: (Das hängt) davon ab, ob … — об открытой альтернативе спрашивает ob, не dass.",
  },
  {
    frage: "Wonach hast du gefragt?",
    text: "— {0}, ob der Zug schon da ist.",
    answer: "Danach",
    why: "fragen NACH → wonach/danach. Предлог с согласной — без -r: danach. Содержание вопроса — предметное (состояние поезда), поэтому pronominal adverb честен.",
  },
  {
    frage: "Worauf kannst du dich verlassen?",
    text: "— {0}, dass meine Familie immer für mich da ist.",
    answer: "Darauf",
    why: "sich verlassen AUF → worauf/darauf. Предлог с гласной → -r: darauf. Факт (семья помогает) — предметный, замена возможна.",
  },
  {
    frage: "Worüber hast du dich gefreut?",
    text: "— {0}, dass das Hotelzimmer größer ist als auf dem Foto.",
    answer: "Darüber",
    why: "sich freuen ÜBER — радость уже случившемуся (комната увидена) → darüber. Предлог с гласной → -r.",
  },
  {
    frage: "Woran hast du dich gewöhnt?",
    text: "— {0}, dass es hier jeden Tag regnet.",
    answer: "Daran",
    why: "sich gewöhnen AN → woran/daran. Предлог с гласной → -r: daran. Привыкание к факту, не к человеку — иначе было бы «An wen?».",
  },
  {
    frage: "Worum handelt es sich in dem Brief?",
    text: "— {0}, dass ein Formular falsch ausgefüllt wurde.",
    answer: "Darum",
    why: "es handelt sich UM → worum/darum. Предлог с гласной → -r: darum. Речь о факте (заполненная форма) — предмет, поэтому pronominal adverb возможен.",
  },
];

/* ============================================================================
   4. a2-nebensatz-ob: +7 трансформаций (прямой вопрос → косвенный с ob)
   ----------------------------------------------------------------------------
   Только 3-е лицо (er/sie/es, der Bus, das Wetter): сдвиг du/Sie в косвенном
   вопросе зависит от перспективы говорящего, упражнение не имеет права этому
   учить. Глаголы — только из verbs.ts (bleiben, haben, arbeiten, fahren,
   dürfen, zurückkommen, werden).
   Замечание про позиции: у существующего генератора stem жёстко фиксирует
   форму «отчёт, …» — придаточное может стоять только ПОСЛЕ, обе позиции
   здесь невозможны по устройству типа (answer — одна строка), как и во всех
   кадрах существующего пула OB_TRANS. Ответ — вся клауза с ob, которая
   превращает stem в целое предложение.
   ========================================================================== */

export const OB_TRANS_EXTRA: ObTrans[] = [
  { q: "Bleibt er heute zu Hause?", stem: "Sie fragt, …", answer: "ob er heute zu Hause bleibt" },
  { q: "Hat der Bus Verspätung?", stem: "Wir wollen wissen, …", answer: "ob der Bus Verspätung hat" },
  { q: "Arbeitet sie am Samstag?", stem: "Ich weiß nicht, …", answer: "ob sie am Samstag arbeitet" },
  { q: "Fährt der Zug nach Kiel?", stem: "Er fragt, …", answer: "ob der Zug nach Kiel fährt" },
  { q: "Darf der Junge alleine bleiben?", stem: "Wir wissen nicht, …", answer: "ob der Junge alleine bleiben darf" },
  { q: "Kommt der Chef morgen zurück?", stem: "Sie fragt, …", answer: "ob der Chef morgen zurückkommt" },
  { q: "Wird das Wetter morgen besser?", stem: "Ich weiß nicht, …", answer: "ob das Wetter morgen besser wird" },
];

/* ============================================================================
   5. b2-konjunktiv2-vergangenheit: +6 трансформаций (реальное → нереальное)
   ----------------------------------------------------------------------------
   Реальное прошлое (Perfekt/Präteritum) → нереальное условие: hätte/wäre +
   Partizip II в ОБОИХ частях. Вспомогательный в каждой части выведен из
   verb.aux (verbs.ts): haben → hätte-ряд, sein → wäre-ряд. В answers обе
   перестановки — wenn-часть впереди и позади, как в NEBENSATZ. Полярность
   меняется только там, где это естественно: «nicht» убирается (реальность —
   «не было», нереальность — «если бы БЫЛО»).
   ========================================================================== */

export const KONJ2V_TRANS_EXTRA: Konj2VTrans[] = [
  {
    a: "Ich bin gestern zu Hause geblieben. Deshalb habe ich den Film im Kino nicht gesehen.",
    answers: [
      "Wenn ich nicht zu Hause geblieben wäre, hätte ich den Film im Kino gesehen.",
      "Ich hätte den Film im Kino gesehen, wenn ich nicht zu Hause geblieben wäre.",
    ],
    why: "bleiben — sein-глагол: geblieben wäre; sehen — haben-глагол: hätte gesehen. «nicht» уходит из обеих частей: реальность — «остался и не смотрел», нереальность — «если бы НЕ остался, посмотрел БЫ».",
  },
  {
    a: "Wir haben die Karte nicht gekauft. Deshalb haben wir das Konzert nicht gesehen.",
    answers: [
      "Wenn wir die Karte gekauft hätten, hätten wir das Konzert gesehen.",
      "Wir hätten das Konzert gesehen, wenn wir die Karte gekauft hätten.",
    ],
    why: "kaufen и sehen — haben-глаголы: gekauft hätten, hätten gesehen. Оба «nicht» уходят: нереальная цепочка — «если бы купили, то увидели бы».",
  },
  {
    a: "Der Zug hat Verspätung gehabt. Deshalb sind wir zu spät angekommen.",
    answers: [
      "Wenn der Zug keine Verspätung gehabt hätte, wären wir pünktlich angekommen.",
      "Wir wären pünktlich angekommen, wenn der Zug keine Verspätung gehabt hätte.",
    ],
    why: "haben → gehabt hätte, ankommen — движение, sein-глагол → wären angekommen. Отрицание переезжает: «keine Verspätung», «pünktlich».",
  },
  {
    a: "Du hast mich nicht angerufen. Deshalb bin ich nicht mitgekommen.",
    answers: [
      "Wenn du mich angerufen hättest, wäre ich mitgekommen.",
      "Ich wäre mitgekommen, wenn du mich angerufen hättest.",
    ],
    why: "du → hättest, ich → wäre. anrufen — haben-глагол (angerufen hättest), mitkommen — движение, sein-глагол (wäre mitgekommen).",
  },
  {
    a: "Wir haben nicht genug Zeit gehabt. Deshalb haben wir das Museum nicht besucht.",
    answers: [
      "Wenn wir mehr Zeit gehabt hätten, hätten wir das Museum besucht.",
      "Wir hätten das Museum besucht, wenn wir mehr Zeit gehabt hätten.",
    ],
    why: "haben и besuchen — haben-глаголы: gehabt hätten, hätten besucht. «nicht genug Zeit» → «mehr Zeit»: в нереальном мире времени было достаточно.",
  },
  {
    a: "Die Jacke war zu teuer. Deshalb habe ich sie nicht gekauft.",
    answers: [
      "Wenn die Jacke billiger gewesen wäre, hätte ich sie gekauft.",
      "Ich hätte sie gekauft, wenn die Jacke billiger gewesen wäre.",
    ],
    why: "sein → gewesen wäre (состояние), kaufen → hätte gekauft. «zu teuer» → «billiger»: в нереальном мире цена другая, поэтому Komparativ.",
  },
];

/* ============================================================================
   6. c1-es-konstruktionen: +5 дырок на безличное es
   ----------------------------------------------------------------------------
   Кадр подставляет конструкцию после «цитаты источника» (Im Brief stand:, …),
   чтобы es не стояло самым первым словом текста и кадр звучал как цитата.
   Все конструкции — уже живущие в этом проекте рамки: es besteht die
   Möglichkeit, es geht um, es gibt, es hängt davon ab, es freut uns.
   ========================================================================== */

export const ES_HOLE_EXTRA: EsHole[] = [
  {
    text: "Im Brief stand: {0} besteht die Möglichkeit, dass der Kurs schon im Mai beginnt.",
    a: "Es",
    why: "es besteht die Möglichkeit, dass … — «существует возможность, что …». После двоеточия es на позиции 1, сразу за ним глагол besteht.",
  },
  {
    text: "Der Direktor hat den Eltern versichert: {0} geht um die Sicherheit der Kinder.",
    a: "Es",
    why: "es geht um + Akkusativ — «речь идёт о». Без es фраза невозможна: geht требует безличного подлежащего.",
  },
  {
    text: "Der Chef hat die Sitzung eröffnet: {0} gibt es heute drei Punkte auf der Agenda.",
    a: "Es",
    why: "es gibt + Akkusativ — «есть, имеется». Здесь es — формальное подлежащее, gibt сразу за ним; согласование с «drei Punkte» не нужно, es неизменно.",
  },
  {
    text: "Im Jahresbericht las man: {0} hängt alles davon ab, ob der Bau im Mai fertig wird.",
    a: "Es",
    why: "es hängt (alles) davon ab, ob … — «всё зависит от того, …». es — подлежащее, а daneben стоит коррелят davon (abhängen VON); ob — потому что содержание открытой альтернативы.",
  },
  {
    text: "Sie hat uns geschrieben: {0} freut uns sehr, dass ihr auch kommen könnt.",
    a: "Es",
    why: "es freut uns, dass … — «нас радует то, что …». es — подлежащее, uns — Akkusativ, dass-придаточное раскрывает содержание радости.",
  },
];
