/* ============================================================================
   C1 (часть B): nominalstil · partizip-attribut · wortstellung · modalitaet · stil
   ----------------------------------------------------------------------------
   Четыре темы C1 + теория пятой, для переноса в src/lib/de. Ничего из src/
   файл не трогает: это готовый материал для ревью.

   Принцип тот же, что во всём проекте: задания собираются из кадров, а не
   придумываются моделью. Трансформация либо однозначна, либо ВСЕ верные
   варианты перечислены в answers — проверка остаётся точной (norm()).

   Ключевое решение по каждой теме:

   · c1-nominalstil — пары «предлог ↔ союз» заданы в кадре: nach→nachdem,
     trotz→obwohl, durch→indem, ohne→ohne dass, zu→um…zu. Время в придаточном
     выведено из главного и объяснено в why. Оба направления (Nominal → Verbal
     и обратно), ответ — целое предложение, одна дырка под заданием.

   · c1-partizip-attribut — пары «атрибут ↔ Relativsatz». Время в Partizip II
     нейтрально, поэтому при переходе в Relativsatz приняты оба времени
     (wurde geprüft / worden ist) — честно перечислены в answers. Partizip I
     (актив) идёт отдельными кадрами, чтобы тема не свелась к одному пассиву.

   · c1-wortstellung — Ausklammerung в обе стороны: группа на позицию 1
     (глагол сразу за ней) и в Nachfeld (инфинитивные и dass-группы при
     абстрактных Nomen). Для сравнений/препозиционных групп — прямой и
     обратный ход; для inf/dass-групп — только Mittelfeld ↔ Nachfeld,
     препозиция инфинитива там меняет смысл и не даётся.

   · c1-modalitaet — шкала уверенности: muss/müsste → dürfte → kann →
     kann nicht. Кадры устроены так, что контекст либо задаёт ступень
     однозначно, либо ступени честно две — тогда в answers перечислены ОБА
     варианта, а why объясняет разницу (muss ≈ уверен, dürfte ≈ вероятно).
     Выдумывать «единственный» ответ там, где его нет, кадр не имеет права.

   · c1-stil — НЕ дриллится: перефразирование «по вкусу» нельзя проверить
     точной строкой, а сомнительные кадры хуже, чем их отсутствие. Остаётся
     только теория (regel/ru/tabelle/beispiele/fehler/merk) — она собирает
     выбор регистра из уже отработанных трансформаций. В topics.ts для неё
     остаётся пустой gen.

   Честные ограничения:
   · Ответ-трансформация проверяется norm() как точная строка: допустимые
     перестановки внутри Mittelfeld не перечислены, если они заметно менее
     естественны. Это осознанно — как в NEBENSATZ и OBWOHL.
   · Ich/du-варианты Umformung (например, Nominalstil с «wir» вместо пассива)
     принимаются только там, где они реально одинаково идиоматичны — иначе
     кадр приучал бы к дословности вместо смысла.
   ========================================================================== */

import type { Theory } from "@/lib/de/theory";
import type { Item } from "@/lib/de/gen";

/* NEW-VERBS — глаголы, которых нет в verbs.ts, но формы которых нужны
   (в дырках, в ответах-трансформациях или в спрягаемых местах кадров).
   Готовые строки v(...):
   v("prüfen", "prüfe prüfst prüft prüfen prüft prüfen", "geprüft", "h", undefined, "prüfte")
   v("verschieben", "verschiebe verschiebst verschiebt verschieben verschiebt verschieben", "verschoben", "h", undefined, "verschob")
   v("bewerben", "bewirbe bewirbst bewirbt bewerben bewerbt bewerben", "beworben", "h", undefined, "bewarb")  // sich bewerben
   v("eröffnen", "eröffne eröffnest eröffnet eröffnen eröffnet eröffnen", "eröffnet", "h", undefined, "eröffnete")
   v("nutzen", "nutze nutzt nutzt nutzen nutzt nutzen", "genutzt", "h", undefined, "nutzte")
   v("lösen", "löse löst löst lösen löst lösen", "gelöst", "h", undefined, "löste")
   v("auffallen", "falle fällst fällt fallen fallt fallen", "aufgefallen", "h", "auf", "fiel")
   v("erhöhen", "erhöhe erhöhst erhöht erhöhen erhöht erhöhen", "erhöht", "h", undefined, "erhöhte")
   v("einführen", "führe führst führt führen führt führen", "eingeführt", "h", "ein", "führte")
   v("steigen", "steige steigst steigt steigen steigt steigen", "gestiegen", "s", undefined, "stieg")
   v("verbreiten", "verbreite verbreitest verbreitet verbreiten verbreitet verbreiten", "verbreitet", "h", undefined, "verbreitete")  // sich verbreiten
   v("planen", "plane planst plant planen plant planen", "geplant", "h", undefined, "plante")
   v("erreichen", "erreiche erreichst erreicht erreichen erreicht erreichen", "erreicht", "h", undefined, "erreichte")
   v("senken", "senke senkst senkt senken senkt senken", "gesenkt", "h", undefined, "senkte")
   v("scheitern", "scheitere scheiterst scheitert scheitern scheitert scheitern", "gescheitert", "s", undefined, "scheiterte")
   v("ausfallen", "falle fällst fällt fallen fallt fallen", "ausgefallen", "s", "aus", "fiel")
   v("überraschen", "überrasche überraschst überrascht überraschen überrascht überraschen", "überrascht", "h", undefined, "überraschte")
   v("unterschreiben", "unterschreibe unterschreibst unterschreibt unterschreiben unterschreibt unterschreiben", "unterschrieben", "h", undefined, "unterschrieb")
   v("stehen", "stehe stehst steht stehen steht stehen", "gestanden", "h", undefined, "stand")
   МОДАЛЬНЫЕ В VERBS НЕ ПЕРЕНОСИТЬ: в дырках они идут только конечной формой
   (muss, müsste, dürfte, kann, kann nicht), а в общий VERBS их добавлять вредно —
   perfekt()/partizip() рассчитаны на смысловые глаголы, и «gekonnt» там никому
   не нужно (у модальных с инфинитивом работает Ersatzinfinitiv: hat kommen können).
   v("können", …) / v("müssen", …) / v("dürfen", …) — справочно, не для переноса. */

/* ============================================================================
   ТЕОРИЯ
   ========================================================================== */

export const THEORY_C1_B: Record<string, Theory> = {
  "c1-nominalstil": {
    regel:
      "Der Nominalstil verpackt Verben in Substantive: prüfen → die Prüfung, verschieben → " +
      "die Verschiebung. Er lebt in Verwaltung, Wissenschaft und Presse. Der Verbalstil sagt " +
      "dasselbe mit einem Nebensatz. Die Umwandlung folgt festen Paaren: nach → nachdem, " +
      "wegen → weil, trotz → obwohl, durch → indem, ohne → ohne dass, vor → bevor, " +
      "bei → als/wenn, seit → seit, zur Lösung → um … zu.",
    ru:
      "Именной стиль превращает действие в существительное: не «после того как проверили», " +
      "а «после проверки». Канцелярит, наука, газета так и говорят. Глагольный стиль — это рассказ " +
      "и обычная речь. Пары «предлог ↔ союз» надо выучить как таблицу: за каждым предлогом стоит " +
      "свой союз. Время в придаточном берётся из главного: nach/nachdem в прошлом — предшествование, " +
      "поэтому Plusquamperfekt; у bei/als момент одновременный — достаточно Präteritum.",
    tabelle: {
      head: ["Nominalstil", "Konjunktion", "Verbalstil"],
      rows: [
        ["nach der Prüfung", "nachdem", "Nachdem man geprüft hatte, …"],
        ["wegen der Verschiebung", "weil", "Weil der Termin verschoben wurde, …"],
        ["trotz der Erhöhung", "obwohl", "Obwohl die Preise erhöht wurden, …"],
        ["durch die Nutzung", "indem", "Indem man die App nutzt, …"],
        ["ohne die Einladung", "ohne dass", "Ohne dass der Chef einlädt, …"],
        ["vor der Eröffnung", "bevor", "Bevor der Laden eröffnete, …"],
        ["bei der Ankunft", "als", "Als die Delegation ankam, …"],
        ["zur Lösung", "um … zu", "Um das Problem zu lösen, …"],
      ],
    },
    beispiele: [
      { de: "Nach der Prüfung der Dokumente war der Fall klar.", ru: "Именной стиль: действие спрятано в «die Prüfung»." },
      { de: "Nachdem man die Dokumente geprüft hatte, war der Fall klar.", ru: "То же самое глагольно: nachdem + Plusquamperfekt." },
      { de: "Trotz der Erhöhung der Preise blieb das Angebot gleich.", ru: "trotz + Nomen: уступка без союза." },
    ],
    fehler: [
      "«Nachdem man die Dokumente geprüft hat» — главное в прошлом, значит придаточное в Plusquamperfekt (hatte geprüft), не в Perfekt.",
      "«Nachdem geprüft hatte» — потеряли подлежащее: у имени деятеля нет, в придаточном нужен man или пассив.",
      "«Ohne der Chef einlädt» — nach/trotz/ohne с придаточным не работают: либо Nominalgruppe (ohne die Einladung), либо союз (ohne dass der Chef einlädt).",
      "«Ohne zu kommen» при разных подлежащих — «ohne … zu» годится, только если подлежащее одно; при разных — ohne dass.",
      "Путают пары: trotz → weil вместо obwohl; смысл переворачивается.",
    ],
    merk:
      "Каждому предлогу — свой союз: nach→nachdem, wegen→weil, trotz→obwohl, durch→indem, " +
      "ohne→ohne dass (или ohne … zu, если подлежащее одно), vor→bevor, bei→als, seit→seit, zu … → um … zu.",
  },

  "c1-partizip-attribut": {
    regel:
      "Ein erweitertes Partizipialattribut schiebt das Partizip und alles, was dazu gehört, " +
      "VOR das Nomen: der Antrag, der von der Kommission geprüft wurde → der von der Kommission " +
      "geprüfte Antrag. Partizip I auf -d ist aktiv und gleichzeitig (die steigenden Preise), " +
      "Partizip II ist passiv oder abgeschlossen (der geprüfte Antrag). Nach dem bestimmten " +
      "Artikel bekommt das Partizip die schwache Adjektivendung (-e / -en).",
    ru:
      "Распространённое определение — причастие со всеми своими словами, вынесенное ПЕРЕД существительным: " +
      "«заявка, проверенная комиссией» → «комиссией проверенная заявка». Определяемое слово всегда в конце группы, " +
      "артикль — в начале, запятых внутри нет. Partizip I = «делающий» (актив, одновременно), " +
      "Partizip II = «уже сделанный» или пассив. Время в Partizip II нейтрально: при обратном переходе " +
      "можно и «wurde geprüft», и «worden ist» — оба верны.",
    tabelle: {
      head: ["Form", "Bedeutung", "Relativsatz"],
      rows: [
        ["die steigenden Preise", "актив, одновременно", "die Preise, die steigen"],
        ["die gestiegenen Preise", "уже выросли", "die Preise, die gestiegen sind"],
        ["der geprüfte Antrag", "пассив", "der Antrag, der geprüft wurde"],
        ["der vom Chef geprüfte Antrag", "пассив + агенс", "der Antrag, der vom Chef geprüft wurde"],
        ["die sich verbreitende Nachricht", "возвратный актив", "die Nachricht, die sich verbreitet"],
      ],
    },
    beispiele: [
      { de: "Der von der Kommission geprüfte Antrag wurde angenommen.", ru: "Вся группа перед Nomen, артикль первым словом, запятых нет." },
      { de: "die vom Arzt untersuchten Patienten", ru: "Мн. число, слабое склонение: untersuchten." },
      { de: "die sich schnell verbreitende Nachricht", ru: "Partizip I с sich: sich сохраняется внутри атрибута." },
    ],
    fehler: [
      "«der geprüfte von der Kommission Antrag» — вся группа обязана стоять ПЕРЕД существительным: der von der Kommission geprüfte Antrag.",
      "«der von der Kommission geprüft Antrag» — забыли окончание: после артикля слабое склонение → geprüfte.",
      "Путают голос: die steigenden Preise (сами растут) и die gestiegenen Preise (уже выросли) — это разные смыслы.",
      "При обратном переходе теряют агенс: der vom Chef unterschriebene Brief → «der Brief, der unterschrieben wurde» — vom Chef обязано остаться.",
      "Ставят запятые внутри атрибута, как в Relativsatz: в Partizipialattribut запятых нет.",
    ],
    merk:
      "Partizip I = актив («делающий»), Partizip II = пассив или «уже сделанный». Всё, что относится " +
      "к причастию, уезжает перед существительным; само существительное — в самом конце группы.",
  },

  "c1-wortstellung": {
    regel:
      "Im Nachfeld steht, was aus dem Satz »ausgeklammert« wurde: Vergleiche mit als " +
      "(Ein besseres Angebot als dieses hat er nie bekommen), erweiterte Präpositionalgruppen " +
      "(Einen Brief an seine Familie schreibt er jeden Abend), Infinitivgruppen und dass-Sätze " +
      "bei abstrakten Nomen (Der Plan ist unrealistisch, im Ausland zu studieren). Die Gruppe kann " +
      "auch an Position 1 — dann folgt das Verb direkt: Ein besseres Angebot als dieses hat er nie bekommen.",
    ru:
      "Ausklammerung — вынесение тяжёлой группы за рамку предложения. Два направления: группа на первое " +
      "место (тогда глагол обязан встать сразу за ней — глагол на 2-й позиции), или группа в Nachfeld — " +
      "за спрягаемым глаголом и даже за партиципом. В Nachfeld живут: сравнения с als, длинные предложные " +
      "группы, инфинитивные группы и dass-придаточные при абстрактных существительных (der Plan, die Hoffnung, " +
      "die Nachricht). Перед Nachfeld-группой запятая обязательна.",
    tabelle: {
      head: ["Gruppe", "Position 1 / Nachfeld", "Mittelfeld (normal)"],
      rows: [
        ["Vergleich mit als", "Ein besseres Angebot als dieses hat er nie bekommen.", "Er hat nie ein besseres Angebot als dieses bekommen."],
        ["Präpositionalgruppe", "Einen Brief an seine Familie schreibt er jeden Abend.", "Er schreibt jeden Abend einen Brief an seine Familie."],
        ["Infinitivgruppe", "Der Plan ist unrealistisch, im Ausland zu studieren.", "Der Plan, im Ausland zu studieren, ist unrealistisch."],
        ["dass-Satz", "Die Nachricht hat uns überrascht, dass der Zug ausfällt.", "Die Nachricht, dass der Zug ausfällt, hat uns überrascht."],
      ],
    },
    beispiele: [
      { de: "Ein günstigeres Angebot als dieses hat uns niemand gemacht.", ru: "Сравнение вынесено на позицию 1, глагол hat сразу за ним." },
      { de: "Die Hoffnung war verloren, den Zug noch zu erreichen.", ru: "Инфинитивная группа в Nachfeld, перед ней запятая." },
      { de: "Weitere Informationen zu dem Kurs bekommen Sie am Semesterende.", ru: "Тяжёлая предложная группа в начале — письменный регистр." },
    ],
    fehler: [
      "«Ein besseres Angebot als dieses er hat nie bekommen» — после вынесенной группы глагол обязан быть на 2-й позиции.",
      "«Der Plan ist unrealistisch im Ausland zu studieren» — перед Nachfeld-группой нужна запятая.",
      "Теряют артикль при переносе: «Brief an seine Familie schreibt er jeden Abend» — артикль остаётся: einen Brief.",
      "Разрывают группу: «Weitere Informationen bekommen Sie zu dem Kurs» — в этой трансформации группа уезжает целиком.",
      "Ставят отделяемую приставку в конец при выносе группы: «Einen Brief … schreibt er jeden Abend an» — ан-приставка тут ни при чём, глагол schreibt без приставки.",
    ],
    merk:
      "Тяжёлая группа уезжает на позицию 1 (глагол сразу за ней) или в Nachfeld (за спрягаемым глаголом, перед ней запятая). Всё, что выносится, — целиком.",
  },

  "c1-modalitaet": {
    regel:
      "Subjektive Modalität drückt aus, WIE sicher der Sprecher ist — nicht, was er muss oder darf: " +
      "muss / müsste ≈ sicher, dürfte ≈ wahrscheinlich, kann ≈ möglich, kann nicht ≈ unmöglich. " +
      "Über die Vergangenheit: Modalverb + Partizip II + Infinitiv von haben/sein (Er muss den Zug verpasst haben).",
    ru:
      "Субъективная модальность — шкала уверенности говорящего, а не обязанность. muss — вывод из факта " +
      "(«должно быть»), müsste — то же чуть мягче, dürfte — «вероятно», kann — «возможно», kann nicht — " +
      "«не может быть». Для прошлого: модальный + Partizip II + haben/sein в инфинитиве: Er muss den Zug " +
      "verpasst haben. Это та зона, где русский «должно быть / вероятно / возможно» дословно не переводится — " +
      "ступень выбирается по силе аргумента в контексте.",
    tabelle: {
      head: ["Form", "Sicherheit", "Beispiel"],
      rows: [
        ["muss", "почти уверен (~90–100 %)", "Er muss hungrig sein."],
        ["müsste", "уверенно, чуть мягче muss", "Sie müsste längst zu Hause sein."],
        ["dürfte", "вероятно (~70–80 %)", "Er dürfte im Stau stehen."],
        ["kann", "возможно (~50 %)", "Er kann den Zug verpasst haben."],
        ["kann nicht", "исключено", "Er kann nicht nach Hause gegangen sein."],
      ],
    },
    beispiele: [
      { de: "Er hat den ganzen Tag nichts gegessen. Er muss jetzt hungrig sein.", ru: "Логический вывод из факта → muss." },
      { de: "Sie war den ganzen Morgen im Büro. Sie muss die E-Mail gesehen haben.", ru: "Предположение о прошлом: muss + «gesehen haben»." },
      { de: "Das Licht brennt. Sie dürfte zu Hause sein.", ru: "Правдоподобный, но не принудительный вывод → dürfte." },
    ],
    fehler: [
      "Путают «kann nicht» (не может быть — исключено) и «muss nicht» (не обязан — отсутствие необходимости). Это разные значения.",
      "«Er muss hat den Zug verpasst» — второй глагол идёт в конец в инфинитиве: verpasst haben.",
      "dürfen вместо dürfte: dürfen = разрешение; предположение — только dürfte (Konjunktiv II).",
      "Ставят «wahrscheinlich» рядом с muss: muss уже содержит уверенность, наречие дублирует ступень.",
      "«müßte» вместо müsste — после долгой гласной пишется ß.",
    ],
    merk:
      "Шкала: muss/müsste → dürfte → kann. Отрицание: kann nicht (исключено) ≠ muss nicht (не обязан). " +
      "Прошлое: модальный + Partizip II + haben/sein.",
  },

  "c1-stil": {
    regel:
      "Stilistische Variation heißt: dieselbe Idee in mehreren registertreuen Varianten ausdrücken " +
      "und die passende wählen — Nominalstil für Verwaltung und Wissenschaft, Verbalstil für Erzählung " +
      "und Alltag, Partizipialattribute für kompakte Beschreibungen, Nachfeld für das geschriebene " +
      "Deutsch. Es geht nicht um Synonym-Würfel, sondern um Funktion: Wer nur eine Struktur beherrscht, " +
      "klingt monoton; wer sie falsch kombiniert, klingt falsch.",
    ru:
      "Стилистическая вариация — не «замена слов синонимами», а выбор конструкции под задачу: именной стиль " +
      "для канцелярита и науки, глагольный для рассказа, причастные обороты для сжатых определений, вынесение " +
      "в Nachfeld для письменного языка. Это надстройка над c1-nominalstil и c1-partizip-attribut: там " +
      "отрабатываются конкретные трансформации, здесь — умение видеть жанр и выбирать. Именно поэтому тема " +
      "не дриллится: у перефразирования нет единственного верного ответа, а точная проверка не должна " +
      "наказывать за вкусовые варианты.",
    tabelle: {
      head: ["Структура", "Регистр", "Wofür"],
      rows: [
        ["Nominalstil", "Verwaltung, Presse", "Nach Eingang Ihrer Zahlung …"],
        ["Verbalstil", "Erzählung, Alltag", "Als wir das Geld bekamen, …"],
        ["Partizipialattribut", "geschriebenes Deutsch", "die von der Stadt geplante Straße"],
        ["Nachfeld", "gehobenes Schriftdt.", "Der Versuch ist gescheitert, die Kosten zu senken."],
      ],
    },
    beispiele: [
      { de: "Nach der Prüfung der Unterlagen erhielt er die Zusage.", ru: "Канцелярит: именной стиль уместен в документе." },
      { de: "Nachdem man seine Unterlagen geprüft hatte, bekam er die Zusage.", ru: "Тот же смысл в рассказе: Verbalstil." },
      { de: "Eine bessere Antwort hat er nie bekommen.", ru: "Ausklammerung делает фразу письменной." },
    ],
    fehler: [
      "Пишут всё Verbalstil даже там, где жанр требует Nominalstil (заявление, аннотация), — и наоборот в рассказе.",
      "Натаскивают причастные обороты в устный текст: звучит неестественно, так не говорят.",
      "Смешивают регистры внутри одной фразы: «Nach Eingang Ihrer Zahlung schicken wir dir das Zeug sofort raus.»",
      "Считают, что длиннее = лучше: тяжёлая Nachfeld-конструкция в простой разговорной реплике.",
    ],
    merk:
      "Вариация — это выбор: Nominalstil для документа, Verbalstil для истории, Partizipialattribut для " +
      "компактного описания. Сначала жанр, потом структура.",
  },
};

/* ============================================================================
   КАДРЫ: NOMINALSTIL
   ----------------------------------------------------------------------------
   Пара «предлог ↔ союз» задана в кадре, время выведено из главного.
   verbals — ВСЕ одинаково идиоматичные verbal-варианты (man-версия и/или
   пассив), принимаются оба направления: Nominal → Verbal и обратно.
   ========================================================================== */

type NomPair = {
  /** предложение в Nominalstil */
  nom: string;
  /** принятые версии в Verbalstil */
  verbals: string[];
  /** предлог для обратного задания */
  prep: string;
  /** союз для прямого задания */
  konj: string;
  /** имя-номинализация: die Prüfung */
  nomen: string;
  /** исходный глагол: prüfen */
  verb: string;
  why: string;
};

export const NOM_STIL: NomPair[] = [
  {
    nom: "Nach der Prüfung der Dokumente war der Fall klar.",
    verbals: [
      "Nachdem man die Dokumente geprüft hatte, war der Fall klar.",
      "Nachdem die Dokumente geprüft worden waren, war der Fall klar.",
    ],
    prep: "nach",
    konj: "nachdem",
    nomen: "die Prüfung",
    verb: "prüfen",
    why:
      "Nominalisierung: die Prüfung ← prüfen. «nach + Nomen» ↔ «nachdem»: действие произошло раньше главного, " +
      "поэтому в придаточном Plusquamperfekt (hatte geprüft), главное — Präteritum (war). Деятеля в номине нет, " +
      "поэтому verbal: man или пассив (worden waren).",
  },
  {
    nom: "Wegen der Verschiebung des Termins rufen wir alle Kunden an.",
    verbals: [
      "Weil der Termin verschoben wurde, rufen wir alle Kunden an.",
      "Weil wir den Termin verschoben haben, rufen wir alle Kunden an.",
    ],
    prep: "wegen",
    konj: "weil",
    nomen: "die Verschiebung",
    verb: "verschieben",
    why:
      "die Verschiebung ← verschieben. wegen ↔ weil: причина. Пассив (wurde verschoben) и актив (haben " +
      "verschoben) одинаково идиоматичны — принимаются оба.",
  },
  {
    nom: "Trotz der Bewerbung von zwanzig Kandidaten blieb die Stelle frei.",
    verbals: ["Obwohl sich zwanzig Kandidaten beworben hatten, blieb die Stelle frei."],
    prep: "trotz",
    konj: "obwohl",
    nomen: "die Bewerbung",
    verb: "sich bewerben",
    why:
      "die Bewerbung ← sich bewerben. trotz ↔ obwohl: уступка. Главное в Präteritum (blieb), предшествующее " +
      "действие — в Plusquamperfekt (sich beworben hatten). sich остаётся при подлежащем.",
  },
  {
    nom: "Vor der Eröffnung des neuen Ladens gab es einen kleinen Empfang.",
    verbals: [
      "Bevor man den neuen Laden eröffnete, gab es einen kleinen Empfang.",
      "Bevor der neue Laden eröffnet wurde, gab es einen kleinen Empfang.",
    ],
    prep: "vor",
    konj: "bevor",
    nomen: "die Eröffnung",
    verb: "eröffnen",
    why:
      "die Eröffnung ← eröffnen. vor ↔ bevor: предшествование. Оба действия в прошлом, но одновременная " +
      "последовательность — достаточно Präteritum (eröffnete) или пассив (eröffnet wurde).",
  },
  {
    nom: "Bei der Ankunft der Delegation war alles vorbereitet.",
    verbals: ["Als die Delegation ankam, war alles vorbereitet."],
    prep: "bei",
    konj: "als",
    nomen: "die Ankunft",
    verb: "ankommen",
    why:
      "die Ankunft ← ankommen — нерегулярная номинализация, её надо помнить (не «die Ankommung»). " +
      "bei + Nomen ↔ als: момент одновременный, поэтому Präteritum (ankam), не Plusquamperfekt.",
  },
  {
    nom: "Durch die Nutzung der App lernt man viel schneller.",
    verbals: ["Indem man die App nutzt, lernt man viel schneller."],
    prep: "durch",
    konj: "indem",
    nomen: "die Nutzung",
    verb: "nutzen",
    why:
      "die Nutzung ← nutzen. durch ↔ indem: способ достижения. Оба предложения в Präsens — правило " +
      "последовательности времён на C1 здесь не работает, время берётся из смысла.",
  },
  {
    nom: "Ohne die Einladung des Chefs kommt er nicht zur Party.",
    verbals: ["Ohne dass der Chef ihn einlädt, kommt er nicht zur Party."],
    prep: "ohne",
    konj: "ohne dass",
    nomen: "die Einladung",
    verb: "einladen",
    why:
      "die Einladung ← einladen. У Chef и er разные подлежащие, поэтому только «ohne dass», а не " +
      "«ohne … zu» — инфинитивный оборот работает при одном подлежащем.",
  },
  {
    nom: "Trotz der Erhöhung der Preise blieb das Angebot gleich.",
    verbals: ["Obwohl die Preise erhöht wurden, blieb das Angebot gleich."],
    prep: "trotz",
    konj: "obwohl",
    nomen: "die Erhöhung",
    verb: "erhöhen",
    why:
      "die Erhöhung ← erhöhen. trotz ↔ obwohl; без деятеля пассив очевиднее: wurden erhöht. Главное — " +
      "Präteritum (blieb).",
  },
  {
    nom: "Zur Lösung des Problems brauchen wir mehr Zeit.",
    verbals: ["Um das Problem zu lösen, brauchen wir mehr Zeit."],
    prep: "zu",
    konj: "um … zu",
    nomen: "die Lösung",
    verb: "lösen",
    why:
      "zur Lösung ← lösen. «zu + Nominalisierung» ↔ «um … zu»: одна и та же цель. Подлежащее одно (wir), " +
      "поэтому инфинитивный оборот, а не damit.",
  },
  {
    nom: "Beim Lesen des Berichts fiel mir ein Fehler auf.",
    verbals: ["Als ich den Bericht las, fiel mir ein Fehler auf."],
    prep: "bei",
    konj: "als",
    nomen: "das Lesen",
    verb: "lesen",
    why:
      "das Lesen ← lesen (имя на -en от инфинитива). bei + Nomen ↔ придаточное времени: «в процессе чтения» " +
      "→ Als ich den Bericht las. auffallen отделяемое: fiel … auf.",
  },
  {
    nom: "Nach der Beendigung der Arbeit ging er nach Hause.",
    verbals: [
      "Nachdem er die Arbeit beendet hatte, ging er nach Hause.",
      "Nachdem man die Arbeit beendet hatte, ging er nach Hause.",
    ],
    prep: "nach",
    konj: "nachdem",
    nomen: "die Beendigung",
    verb: "beenden",
    why:
      "die Beendigung ← beenden — типично канцелярское имя, лицо Nominalstil. nach ↔ nachdem: " +
      "Plusquamperfekt (hatte beendet) + Präteritum (ging). Деятель восстановлен как er или man.",
  },
  {
    nom: "Seit der Einführung der neuen Regel sind die Zahlen gestiegen.",
    verbals: ["Seit man die neue Regel eingeführt hat, sind die Zahlen gestiegen."],
    prep: "seit",
    konj: "seit",
    nomen: "die Einführung",
    verb: "einführen",
    why:
      "die Einführung ← einführen. seit ↔ seit: после seit в придаточном Perfekt (eingeführt hat), главное — " +
      "Präsens/Perfekt (sind gestiegen). Plusquamperfekt после seit не ставится.",
  },
];

/* ============================================================================
   КАДРЫ: PARTIZIPIALATTRIBUTE
   ----------------------------------------------------------------------------
   kind: "PII" — пассив (Partizip II), "PI" — актив (Partizip I).
   Время в PII нейтрально → в Relativsatz приняты wurde … / worden ist …,
   оба перечислены в rels. PI — однозначный актив в Präsens.
   ========================================================================== */

type PartPair = {
  /** именная группа с атрибутом (эта форма — ответ при обратном задании) */
  attr: string;
  /** принятые версии с Relativsatz */
  rels: string[];
  kind: "PI" | "PII";
  why: string;
};

export const PARTIZIP_ATTR: PartPair[] = [
  {
    attr: "der von der Kommission geprüfte Antrag",
    rels: [
      "der Antrag, der von der Kommission geprüft wurde",
      "der Antrag, der von der Kommission geprüft worden ist",
    ],
    kind: "PII",
    why:
      "Partizip II → пассив: der von der Kommission geprüfte Antrag ↔ der Antrag, der von der Kommission " +
      "geprüft wurde. Время в атрибуте нейтрально, поэтому и «worden ist» верно. Агенс von сохраняется.",
  },
  {
    attr: "die vom Arzt untersuchten Patienten",
    rels: [
      "die Patienten, die vom Arzt untersucht wurden",
      "die Patienten, die vom Arzt untersucht worden sind",
    ],
    kind: "PII",
    why:
      "Мн. число: die vom Arzt untersuchten Patienten ↔ die Patienten, die vom Arzt untersucht wurden. " +
      "Окончание атрибута после определённого артикля — слабое: -en.",
  },
  {
    attr: "das in diesem Jahr renovierte Haus",
    rels: [
      "das Haus, das in diesem Jahr renoviert wurde",
      "das Haus, das in diesem Jahr renoviert worden ist",
    ],
    kind: "PII",
    why:
      "Обстоятельство (in diesem Jahr) уезжает внутрь атрибута: das in diesem Jahr renovierte Haus. " +
      "При обратном переходе оно остаётся в придаточном.",
  },
  {
    attr: "das von allen Schülern gelesene Buch",
    rels: [
      "das Buch, das von allen Schülern gelesen wurde",
      "das Buch, das von allen Schülern gelesen worden ist",
    ],
    kind: "PII",
    why:
      "Агенс с von стоит сразу после артикля: das von allen Schülern gelesene Buch. Порядок внутри группы " +
      "не свободен: артикль → агенс → причастие с окончанием → Nomen.",
  },
  {
    attr: "die schon bezahlte Rechnung",
    rels: ["die Rechnung, die schon bezahlt wurde", "die Rechnung, die schon bezahlt ist"],
    kind: "PII",
    why:
      "die schon bezahlte Rechnung ↔ die Rechnung, die schon bezahlt wurde. Без агенса возможен и " +
      "Zustandspassiv (bezahlt ist) — состояние «оплачена».",
  },
  {
    attr: "der gerade reparierte Wagen",
    rels: ["der Wagen, der gerade repariert wird"],
    kind: "PII",
    why:
      "gerade указывает на идущий процесс: только Vorgangspassiv Präsens — der Wagen, der gerade repariert " +
      "wird. «Worden ist» здесь не подходит: процесс, не результат.",
  },
  {
    attr: "das von ihr gekochte Essen",
    rels: [
      "das Essen, das von ihr gekocht wurde",
      "das Essen, das von ihr gekocht worden ist",
    ],
    kind: "PII",
    why:
      "das von ihr gekochte Essen ↔ das Essen, das von ihr gekocht wurde. Род и падеж видны по артиклю das; " +
      "причастие получает окончание -e (Nominativ Neutrum).",
  },
  {
    attr: "den vom Team vorbereiteten Vortrag",
    rels: [
      "den Vortrag, der vom Team vorbereitet wurde",
      "den Vortrag, der vom Team vorbereitet worden ist",
    ],
    kind: "PII",
    why:
      "Akkusativ: den vom Team vorbereiteten Vortrag ↔ den Vortrag, der vom Team vorbereitet wurde. " +
      "В атрибуте падеж виден только по артиклю den — он и определяет форму группы.",
  },
  {
    attr: "die schnell steigenden Preise",
    rels: ["die Preise, die schnell steigen"],
    kind: "PI",
    why:
      "Partizip I = актив и одновременность: die Preise, die schnell steigen. Partizip II (die gestiegenen " +
      "Preise) изменил бы смысл: «уже выросли», а не «растущие».",
  },
  {
    attr: "der an der Ecke wartende Bus",
    rels: ["der Bus, der an der Ecke wartet"],
    kind: "PI",
    why:
      "der an der Ecke wartende Bus ↔ der Bus, der an der Ecke wartet: актив, процесс сейчас. Наречие места " +
      "входит в атрибут и уезжает вместе с ним.",
  },
  {
    attr: "die sich schnell verbreitende Nachricht",
    rels: ["die Nachricht, die sich schnell verbreitet"],
    kind: "PI",
    why:
      "Возвратный PI: sich сохраняется внутри атрибута — die sich verbreitende Nachricht. Ставить sich после " +
      "существительного в атрибуте нельзя.",
  },
  {
    attr: "das laut spielende Kind",
    rels: ["das Kind, das laut spielt"],
    kind: "PI",
    why:
      "das laut spielende Kind ↔ das Kind, das laut spielt. Наречие (laut) стоит перед причастием, причастие — " +
      "перед существительным.",
  },
  {
    attr: "die früh aufstehenden Schüler",
    rels: ["die Schüler, die früh aufstehen"],
    kind: "PI",
    why:
      "Отделяемая приставка в Partizip I не разрывается: aufstehend (как и в Partizip II — aufgestanden). " +
      "die früh aufstehenden Schüler ↔ die Schüler, die früh aufstehen.",
  },
];

/* ============================================================================
   КАДРЫ: WORTSTELLUNG (Ausklammerung / Nachfeld)
   ----------------------------------------------------------------------------
   normal — обычный порядок; other — вынесение. Для kind "als"/"praep" other
   стоит на позиции 1 (глагол сразу за ним); для kind "inf"/"dass" other —
   Nachfeld-версия. Оба направления генерируются, ответ-предложение один.
   ========================================================================== */

type WortFrame = {
  normal: string;
  other: string;
  kind: "als" | "praep" | "inf" | "dass";
  why: string;
};

export const WORTSTELLUNG_C1: WortFrame[] = [
  {
    normal: "Er hat nie ein besseres Angebot als dieses bekommen.",
    other: "Ein besseres Angebot als dieses hat er nie bekommen.",
    kind: "als",
    why:
      "Vergleich mit als выносится на позицию 1 — глагол hat сразу за ним. В обычном порядке группа стоит " +
      "в Mittelfeld после nie. Оба порядка верны, второй — письменный регистр.",
  },
  {
    normal: "Niemand hat uns ein günstigeres Angebot als dieses gemacht.",
    other: "Ein günstigeres Angebot als dieses hat uns niemand gemacht.",
    kind: "als",
    why:
      "Группа с als целиком на первое место, глагол hat — на вторую позицию. Разрывать сравнение нельзя: " +
      "als dieses всегда стоит сразу после прилагательного.",
  },
  {
    normal: "Du hast nirgendwo einen billigeren Vertrag als diesen gefunden.",
    other: "Einen billigeren Vertrag als diesen hast du nirgendwo gefunden.",
    kind: "als",
    why:
      "nirgendwo остаётся в Mittelfeld, Akk-группа с als уезжает на позицию 1. Глагол hast стоит сразу после " +
      "вынесенной группы.",
  },
  {
    normal: "Sie bekommen am Ende des Semesters weitere Informationen zu dem Kurs.",
    other: "Weitere Informationen zu dem Kurs bekommen Sie am Ende des Semesters.",
    kind: "praep",
    why:
      "Тяжёлая предложная группа на первом месте звучит как официальное объявление; в обычном порядке она " +
      "стоит в конце Mittelfeld. Группа переезжает целиком, вместе с zu dem Kurs.",
  },
  {
    normal: "Er schreibt jeden Abend einen Brief an seine Familie.",
    other: "Einen Brief an seine Familie schreibt er jeden Abend.",
    kind: "praep",
    why:
      "Akk-объект с предложным дополнением вынесен на позицию 1; глагол schreibt обязан следовать сразу. " +
      "Артикль einen не теряется при переносе.",
  },
  {
    normal: "Er hat mir eine Antwort auf meine Frage gegeben.",
    other: "Eine Antwort auf meine Frage hat er mir gegeben.",
    kind: "praep",
    why:
      "Длинный Akk-объект выносится на первое место; в обычном порядке он стоит после mir. Партицип gegeben " +
      "остаётся в конце — Nachfeld при Perfekt занят им.",
  },
  {
    normal: "Der Plan, im Ausland zu studieren, ist unrealistisch.",
    other: "Der Plan ist unrealistisch, im Ausland zu studieren.",
    kind: "inf",
    why:
      "Infinitivgruppe при абстрактном Nomen может уйти в Nachfeld — за спрягаемый глагол. Перед группой " +
      "запятая. Обратный порядок — группа сразу после Nomen между запятыми.",
  },
  {
    normal: "Die Hoffnung, den Zug noch zu erreichen, war verloren.",
    other: "Die Hoffnung war verloren, den Zug noch zu erreichen.",
    kind: "inf",
    why:
      "Nachfeld-инфинитив: Die Hoffnung war verloren, den Zug noch zu erreichen. В обычном порядке группа " +
      "стоит сразу после die Hoffnung и обрамляется запятыми.",
  },
  {
    normal: "Der Versuch, die Kosten zu senken, ist gescheitert.",
    other: "Der Versuch ist gescheitert, die Kosten zu senken.",
    kind: "inf",
    why:
      "gescheitert — sein-Perfekt (движение/состояние). Infinitivgruppe уходит в Nachfeld за ist gescheitert; " +
      "запятая перед группой обязательна.",
  },
  {
    normal: "Die Nachricht, dass der Zug ausfällt, hat uns alle überrascht.",
    other: "Die Nachricht hat uns alle überrascht, dass der Zug ausfällt.",
    kind: "dass",
    why:
      "dass-Satz при абстрактном Nomen тоже уходит в Nachfeld. ausfällt — отделяемая приставка: в придаточном " +
      "приставка встаёт в конец.",
  },
];

/* ============================================================================
   КАДРЫ: SUBJEKTIVE MODALITÄT
   ----------------------------------------------------------------------------
   Контекст либо задаёт ступень однозначно, либо ступени честно две — тогда
   в a перечислены ОБА варианта, а why объясняет разницу (muss ≈ уверен,
   dürfte ≈ вероятно). «nicht» в кадре стоит там, где его место в слове
   («kann … nicht geleitet haben»), или входит в ответ (kann nicht).
   ========================================================================== */

type ModalFrame = { text: string; a: string[]; why: string };

export const MODALITAET_C1: ModalFrame[] = [
  {
    text: "Er hat den ganzen Tag nichts gegessen. Er {0} jetzt hungrig sein.",
    a: ["muss"],
    why: "Факт (целый день не ел) → логический вывод: muss = «должно быть, голоден». Ступень почти уверен.",
  },
  {
    text: "Sie war den ganzen Morgen im Büro. Sie {0} die E-Mail gesehen haben.",
    a: ["muss"],
    why:
      "Предположение о прошлом: muss + Partizip II + haben в инфинитиве (gesehen haben). " +
      "«Sie muss hat …» — не немецкий: второй глагол уходит в конец.",
  },
  {
    text: "Er hat den Vertrag gestern selbst unterschrieben. Er {0} also genau wissen, was drinsteht.",
    a: ["muss"],
    why: "also указывает на вывод из факта → muss. Сам подписал — сомнений почти нет.",
  },
  {
    text: "Ihr Auto steht im Hof. Sie {0} zu Hause sein.",
    a: ["muss", "dürfte"],
    why:
      "Машина во дворе — сильный, но не абсолютный аргумент: muss (уверенный вывод) и dürfte (вероятно) " +
      "оба корректны. muss звучит категоричнее, dürfte оставляет место сомнению.",
  },
  {
    text: "Es ist schon nach Mitternacht. Sie {0} längst zu Hause sein.",
    a: ["müsste", "dürfte"],
    why:
      "müsste (Konjunktiv II) — типичная форма уверенного предположения, чуть мягче muss; dürfte — «вероятно». " +
      "Обе ступени подходят: поздний час — сильный, но не принудительный аргумент.",
  },
  {
    text: "Er liest täglich deutsche Zeitungen. Er {0} also schon einiges verstehen.",
    a: ["dürfte", "kann"],
    why:
      "Ежедневное чтение делает вывод вероятным, но не принудительным: dürfte. kann (возможно) тоже допустимо — " +
      "разница в том, что dürfte опирается на аргумент, kann только допускает.",
  },
  {
    text: "Wo ist mein Schlüssel? Du {0} ihn auf den Tisch gelegt haben.",
    a: ["kann", "muss"],
    why:
      "kann — допущение без уверенности («может быть»); muss — вывод из опыта («вечно кладёшь на стол»). " +
      "Оба корректны: kann нейтральнее, muss увереннее. Для прошлого: модальный + gelegt haben.",
  },
  {
    text: "Er war gestern den ganzen Tag in Berlin. Er {0} die Besprechung nicht geleitet haben.",
    a: ["kann"],
    why:
      "Исключение (он был в Берлине) → kann … nicht. «nicht» уже стоит в кадре, дырка — только kann. " +
      "Не путать с muss nicht: то означало бы «не обязан».",
  },
  {
    text: "Seine Jacke hängt noch am Haken. Er {0} nach Hause gegangen sein.",
    a: ["kann nicht"],
    why:
      "Куртка на месте → «не мог уйти домой»: kann nicht. Здесь nicht — часть ответа: это исключение, " +
      "а не отсутствие обязанности (muss nicht значило бы «не обязательно уходил»).",
  },
  {
    text: "Der Strand ist sauber, aber Vorsicht: Hier {0} trotzdem Glas im Sand sein.",
    a: ["kann"],
    why:
      "kann — принципиальная возможность без оценки вероятности: «здесь может быть стекло». " +
      "muss нельзя: чистый пляж — аргумент против; dürfte тоже: ожидание не сформулировано.",
  },
];

/* ============================================================================
   ГЕНЕРАТОРЫ
   ========================================================================== */

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/** первая буква заглавная: именная группа в кадре стоит с маленькой,
    но показана в начале строки — как начало предложения */
const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

/* --- Nominalstil ↔ Verbalstil: оба направления ------------------------------ */

export function nominalstil(): Item {
  const p = pick(NOM_STIL);
  if (Math.random() < 0.5) {
    return {
      topic: "c1-nominalstil",
      task: `Verbalstil: Forme die Nominalgruppe in einen Nebensatz mit «${p.konj}» um.`,
      text: `${p.nom}\n{0}`,
      hint: `(${p.konj})`,
      gaps: [p.verbals],
      why: p.why,
    };
  }
  return {
    topic: "c1-nominalstil",
    task: `Nominalstil: Forme den Nebensatz in eine Nominalgruppe mit «${p.prep}» um.`,
    text: `${p.verbals[0]}\n{0}`,
    hint: `(${p.verb} → ${p.nomen})`,
    gaps: [[p.nom]],
    why: p.why,
  };
}

/* --- Partizipialattribut ↔ Relativsatz: оба направления --------------------- */

export function partizipAttribut(): Item {
  const p = pick(PARTIZIP_ATTR);
  if (Math.random() < 0.5) {
    return {
      topic: "c1-partizip-attribut",
      task: "Forme das Partizipialattribut in einen Relativsatz um.",
      text: `${cap(p.attr)}\n{0}`,
      hint: p.kind === "PII" ? "(Partizip II → Passiv)" : "(Partizip I → aktiv)",
      gaps: [p.rels],
      why: p.why,
    };
  }
  return {
    topic: "c1-partizip-attribut",
      task: "Forme den Relativsatz in ein Partizipialattribut um.",
      text: `${cap(p.rels[0])}\n{0}`,
    hint: p.kind === "PII" ? "(Passiv → Partizip II)" : "(aktiv → Partizip I)",
    gaps: [[p.attr]],
    why: p.why,
  };
}

/* --- Ausklammerung: позиция 1 / Nachfeld ↔ Mittelfeld ----------------------- */

export function wortstellung(): Item {
  const f = pick(WORTSTELLUNG_C1);
  const vorne = f.kind === "als" || f.kind === "praep";
  if (Math.random() < 0.5) {
    // из обычного порядка в вынесение
    return {
      topic: "c1-wortstellung",
      task: vorne
        ? "Klammere die schwere Gruppe aus: stelle sie an den Satzanfang (Position 1). Глагол остаётся на 2-й позиции."
        : "Stelle die Gruppe ins Nachfeld — hinter das Verb. Перед группой нужна запятая.",
      text: `${f.normal}\n{0}`,
      gaps: [[f.other]],
      why: f.why,
    };
  }
  // из вынесения в обычный порядок
  return {
    topic: "c1-wortstellung",
    task: vorne
      ? "Forme in die normale Wortstellung um: die Gruppe zurück ins Mittelfeld."
      : "Stelle die Gruppe direkt hinter das Bezugsnomen.",
    text: `${f.other}\n{0}`,
    gaps: [[f.normal]],
    why: f.why,
  };
}

/* --- Subjektive Modalität: ступень по силе аргумента ------------------------ */

export function modalitaet(): Item {
  const f = pick(MODALITAET_C1);
  return {
    topic: "c1-modalitaet",
    task: "Subjektive Modalität: setze das Modalverb der Vermutung ein (muss, müsste, dürfte, kann, kann nicht).",
    text: f.text,
    gaps: [f.a],
    why: f.why,
  };
}
