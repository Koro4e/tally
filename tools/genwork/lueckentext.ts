/* ============================================================================
   LUECKENTEXT — раздел 4.1 экзамена (7 из 100 баллов)
   ----------------------------------------------------------------------------
   Формат по образцу из stem-exam/refs/deutsch.txt, раздел 4: связный текст
   с 7 пропусками, к каждому — три варианта a/b/c, ровно один верный.

   Принцип пропусков — как в образце: это ВОРДСАТЦ, а не падежная грамматика.
   Проверяется выбор слова по смыслу и сочетаемости:
     - близкие по теме глаголы движения (umziehen/ausziehen/einziehen);
     - фиксированные сочетания (den Mietvertrag unterschreiben);
     - выбор слова по роли/ситуации (Vermieter vs Nachbar vs Handwerker);
     - возвратные глаголы по смыслу (sich bedanken / entschuldigen / gewöhnen);
     - «ловушки-кальки» с русского (verbringen vs *bringen — «провести отпуск»).
   Неверные варианты — реальные слова той же части речи, которые «тянутся»
   по теме, но не сочетаются или меняют смысл; два пропуска в тексте B
   намеренно строятся на одном гнезде ver- (vergessen/verpassen/verlieren,
   verpassen/verlieren/vergangen) — это классическая пара ловушек.

   Инварианты (проверяются прогоном): в text ровно 7 плейсхолдеров {0}..{6}
   подряд; gaps.length == 7; correct ∈ {0,1,2}; у каждого why объяснение
   верного варианта и обоих неверных.
   ========================================================================== */

export type LueckGap = { options: [string, string, string]; correct: 0 | 1 | 2; why: string };
export type LueckText = { title: string; intro?: string; text: string; gaps: LueckGap[] };

export const LUECK: LueckText[] = [
  /* ==========================================================================
     ТЕКСТ A — Тема: переезд в другой город (повседневность).
     ~192 слова (плейсхолдер считается за слово). 7 пропусков.
     Распределение correct по позициям (a/b/c → 0/1/2): 1, 2, 1, 0, 2, 2, 0.
     ========================================================================== */
  {
    title: "Der Umzug nach Hamburg",
    intro:
      "Lesen Sie den Text und schließen Sie die Lücken 1–7! Markieren Sie, welche Lösung (a, b oder c) jeweils richtig ist.",
    text:
      "Als ich im Frühjahr eine neue Stelle in Hamburg bekommen habe, musste ich {0} – meine alte Wohnung in München lag 700 Kilometer entfernt, und täglich pendeln war unmöglich. Zuerst habe ich wochenlang im Internet nach Wohnungen gesucht, was mühsam war, weil es für jede gute Wohnung Dutzende Bewerber gibt. Nach drei Wochen hatte ich endlich Glück, habe eine helle Zweizimmerwohnung bekommen und den Mietvertrag noch am selben Tag {1}. In den nächsten Tagen habe ich in einem Baumarkt mehrere stabile {2} gekauft und Bücher, Kleidung und Geschirr eingepackt. Am Umzugstag kamen früh am Morgen vier Freunde mit einem gemieteten Transporter. Die schweren Möbel haben wir zusammen in den dritten Stock {3}, zweimal mussten wir kurz Pause machen, weil die Treppe so eng war. Erst am späten Nachmittag stand alles in der neuen Wohnung. Danach habe ich die alte Wohnung noch geputzt und die Schlüssel persönlich beim {4} abgegeben. Am Abend habe ich mich dann bei meinen Freunden herzlich für ihre Hilfe {5}. In der ersten Woche habe ich mich langsam an die neuen Nachbarn und die Geräusche der Straße {6} – heute fühle ich mich in Hamburg schon wie zu Hause.",
    gaps: [
      {
        // Гнездо: глаголы смены жилья. Смысл — переезд целиком, со сменой города.
        options: ["ausziehen", "umziehen", "einziehen"],
        correct: 1,
        why: "Верный umziehen — «переезжать» в целом, когда меняешь место жительства (здесь — целый город). Ausziehen не подходит: это только «выехать из квартиры», без новой; einziehen — наоборот, только «въехать в новую», без старой. В тексте речь именно о полном переезде, поэтому ein-/ausziehen каждый по отдельности передают лишь половину ситуации.",
      },
      {
        // Гнездо: фиксированное сочетание den Mietvertrag unterschreiben.
        options: ["gemacht", "geschrieben", "unterschrieben"],
        correct: 2,
        why: "Верный unterschrieben — den Mietvertrag unterschreiben — фиксированное сочетание «подписать договор», стандартный шаг при съёме квартиры. Geschrieben не подходит: договор пишет не жилец, он выдаётся готовым, вы его только подписываете. Gemacht — неверная сочетаемость: den Vertrag machen в этой ситуации по-немецки не говорят.",
      },
      {
        // Гнездо: тара для переезда, три реальных слова одного поля.
        options: ["Koffer", "Kartons", "Pakete"],
        correct: 1,
        why: "Верный Kartons — для переезда покупают картонные коробки, в них упаковывают книги, посуду и одежду. Koffer не подходит: чемоданы берут в поездку/отпуск, мебельный скарб ими не упаковывают. Pakete — посылки, которые отправляют почтой или службой доставки, а не везут сам при переезде.",
      },
      {
        // Гнездо: глагол перемещения мебели наверх.
        options: ["getragen", "geschoben", "gestellt"],
        correct: 0,
        why: "Верный getragen — die Möbel tragen = «нести»; in den Stock tragen — обычное выражение при переезде, подъём по лестнице на руках. Geschoben не подходит: «толкать» — по скользкой лестнице мебель не толкают, это другой способ перемещения. Gestellt — «поставить»: ставят уже на месте, сам подъём на этаж этим словом не описывается.",
      },
      {
        // Гнездо: выбор по роли — кто принимает ключи при выезде.
        options: ["Nachbarn", "Handwerker", "Vermieter"],
        correct: 2,
        why: "Верный Vermieter — при выезде ключи сдают арендодателю, он сторона договора и хозяин квартиры. Nachbarn не подходит: соседям ключи не сдают, они к договору отношения не имеют. Handwerker — мастер, который что-то ремонтирует, сдачу квартиры он не принимает.",
      },
      {
        // Гнездо: возвратные глаголы sich bedanken / entschuldigen / interessieren.
        options: ["entschuldigt", "interessiert", "bedankt"],
        correct: 2,
        why: "Верный bedankt — sich (bei jemandem) für etwas bedanken = «благодарить за что-то»; за помощь благодарят. Entschuldigt не подходит: sich entschuldigen = «извиняться» за вину или опоздание, помощь не повод для извинений. Interessiert — sich interessieren für = «интересоваться чем-то», за помощь «не интересуются», смысл другой.",
      },
      {
        // Гнездо: sich gewöhnen an vs sich erinnern an vs sich interessieren für.
        options: ["gewöhnt", "erinnert", "interessiert"],
        correct: 0,
        why: "Верный gewöhnt — sich an etwas gewöhnen = «привыкать к чему-то новому»; в тексте первые недели на новом месте — классический контекст привыкания. Erinnert не подходит: sich erinnern an = «вспоминать о прошлом», а соседи и звуки улицы — настоящее, о них не вспоминают. Interessiert требует für и значит «интересоваться», к адаптации отношения не имеет.",
      },
    ],
  },

  /* ==========================================================================
     ТЕКСТ B — Тема: поездка на море, неделя отпуска (повседневность).
     ~173 слова (плейсхолдер считается за слово). 7 пропусков.
     Распределение correct по позициям (a/b/c → 0/1/2): 1, 2, 0, 0, 2, 1, 2.
     ========================================================================== */
  {
    title: "Eine Woche an der Ostsee",
    intro:
      "Lesen Sie den Text und schließen Sie die Lücken 1–7! Markieren Sie, welche Lösung (a, b oder c) jeweils richtig ist.",
    text:
      "Im August habe ich mit zwei Freunden eine Woche Urlaub an der Ostsee {0}. Ich hatte das Auto schon am Vorabend vollgepackt, damit wir unterwegs nichts {1}, und bin am Freitag um sechs Uhr morgens losgefahren, weil um diese Zeit auf der Autobahn noch kaum Verkehr ist. Unterwegs mussten wir einmal halten, weil die Tankanzeige auf rot gesprungen war – die nächste {2} lag zum Glück nur wenige Kilometer entfernt. Am frühen Nachmittag sind wir in unserem kleinen Ferienhaus direkt am Strand angekommen. Der erste Tag war leider nass: Es hat fast ununterbrochen {3}, so dass wir im Haus geblieben sind und Karten gespielt haben. Ab Dienstag hat die Sonne geschienen, und wir waren jeden Tag am Strand. Dort haben wir uns einen Sonnenschirm und zwei Liegen {4}, weil eigene nicht in den Koffer gepasst hatten. Abends sind wir oft in den Hafen gegangen und haben in einer Fischbude geräucherten Fisch {5} – der war hervorragend. Die Woche ist viel zu schnell {6}; auf dem Rückweg haben wir schon vereinbart, im nächsten Jahr wiederzufahren.",
    gaps: [
      {
        // Гнездо: ловушка-калька с русского «провести отпуск» → *bringen.
        options: ["gebracht", "verbracht", "verpasst"],
        correct: 1,
        why: "Верный verbracht — den Urlaub verbringen = «провести отпуск», фиксированное сочетание. Gebracht не подходит: это калька с русского «провести»; bringen по-немецки значит «приносить/отвозить», с Urlaub так не говорят. Verpasst — «пропустить»: тогда выходило бы, что отпуск не состоялся, а в тексте он подробно описан.",
      },
      {
        // Гнездо: гнездо ver-: vergessen vs verlieren vs verpassen (сборы).
        options: ["verpasst", "verlieren", "vergessen"],
        correct: 2,
        why: "Верный vergessen — при упаковке машины заранее боишься что-то забыть; «nichts vergessen» — стандартная фраза перед дорогой. Verlieren не подходит: теряют уже в дороге, а не во время сборов. Verpassen — «опоздать на / пропустить» (поезд, срок, событие), с вещами не сочетается.",
      },
      {
        // Гнездо: выбор по ситуации — загорелась лампа уровня топлива.
        options: ["Tankstelle", "Werkstatt", "Haltestelle"],
        correct: 0,
        why: "Верный Tankstelle — датчик топлива загорелся, значит нужна заправка, чтобы долить бензин. Werkstatt не подходит: это автосервис для ремонта, бензин там не продают — машина исправна, чинить нечего. Haltestelle — остановка автобуса/трамвая, для машины на трассе бессмысленна.",
      },
      {
        // Гнездо: осадки в августе, «мокрый день».
        options: ["geregnet", "geschneit", "gefahren"],
        correct: 0,
        why: "Верный geregnet — день описан как «nass» (мокрый), дело происходит в августе: «es hat geregnet» — дождь, естественное продолжение. Geschneit не подходит: снег в августе на Балтике невозможен, это ловушка по сезону. Gefahren не подходит: «es hat gefahren» бессмысленно — безличное es с этим глаголом так не употребляют, и дождь это не описывает.",
      },
      {
        // Гнездо: напрокат на пляже vs купить vs построить.
        options: ["gekauft", "gebaut", "gemietet"],
        correct: 2,
        why: "Верный gemietet — зонт и лежаки на пляже берут напрокат на день; контекст «свои не влезли в чемодан» прямо указывает на аренду. Gekauft не подходит: покупать зонт ради одной недели нелогично, и «взяли на пляже» подразумевает прокат, а не покупку. Gebaut — «построить»: лежаки никто сам на пляже не строит.",
      },
      {
        // Гнездо: глаголы еды: попробовать vs приготовить vs продать.
        options: ["gekocht", "probiert", "verkauft"],
        correct: 1,
        why: "Верный probiert — frischen Fisch probieren = «попробовать рыбу», естественный глагол для еды в уличной закусочной; дальше оценка «der war hervorragend» подтверждает дегустацию. Gekocht не подходит: готовили не мы, а Fischbude, мы только ели. Verkauft — «продали»: смысл противоположный, гости ничего не продают.",
      },
      {
        // Гнездо: гнездо ver-: vergangen vs verpasst vs verloren (время).
        options: ["verpasst", "verloren", "vergangen"],
        correct: 2,
        why: "Верный vergangen — die Woche ist vergangen = «неделя прошла»; обычное выражение о быстро пролетевшем времени (с sein: ist vergangen). Verpasst не подходит: «пропускают» поезд, срок или событие, а неделя — не мероприятие, которое можно пропустить. Verloren — «потерять»: неделю нельзя потерять, как вещь; и «ist verloren» меняет смысл на абсурдный.",
      },
    ],
  },
];
