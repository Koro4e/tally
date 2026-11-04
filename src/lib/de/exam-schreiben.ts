/* Раздел 5 экзамена: Schreiben — Bildergeschichte (12 из 100 баллов).
   Точной проверки свободного письма не существует: если «проверять»
   сгенерированный текст, упражнение будет врать. Поэтому механика —
   карточки картинок + написание + ЧЕСТНЫЙ чек-лист самопроверки по
   критериям, которые реально проверяет экзаменатор. Тексты сцен —
   словами, потому что картинок в приложении нет и не планируется. */

export type SchreibenScene = { caption: string; ru: string };

export type SchreibenAufgabe = {
  title: string;
  /** что требует образец: рассказ от первого лица, прошедшее время */
  intro: string;
  scenes: SchreibenScene[]; // ровно 6, как в образце
  checklist: { de: string; ru: string }[];
};

export const SCHREIBEN: SchreibenAufgabe[] = [
  {
    title: "Der erste Arbeitstag",
    intro:
      "Erzähle die Geschichte im Präteritum oder Perfekt, von «ich». Alle sechs Bilder müssen vorkommen. Schreibe 90–120 Wörter.",
    scenes: [
      { caption: "Ein junger Mann steht vor einem großen Bürogebäude und schaut auf die Uhr.", ru: "Парень перед офисным зданием, смотрит на часы" },
      { caption: "Er ist zu früh: Es ist erst Viertel nach sieben.", ru: "Пришёл слишком рано — только 7:15" },
      { caption: "Er kauft einen Kaffee und setzt sich auf eine Bank vor dem Haus.", ru: "Покупает кофе, сидит на лавочке" },
      { caption: "Eine Frau fragt ihn nach dem Weg. Er hilft ihr — sie ist seine neue Chefin.", ru: "Женщина спрашивает дорогу — это новая начальница" },
      { caption: "Um acht öffnet sich die Tür, sie gehen zusammen hinein.", ru: "В восемь открывается дверь, входят вместе" },
      { caption: "Am Abend schreibt er seiner Mutter eine Nachricht: «Der erste Tag war super.»", ru: "Вечером пишет маме: «Первый день был супер»" },
    ],
    checklist: [
      { de: "Alle sechs Bilder kommen in der Geschichte vor.", ru: "Все шесть картинок упомянуты" },
      { de: "Die Geschichte steht im Präteritum oder im Perfekt — nicht im Präsens.", ru: "Прошедшее время (Präteritum/Perfekt), не Präsens" },
      { de: "Das Verb steht auf Position 2 — auch nach «deshalb», «dann», «um acht».", ru: "Глагол на 2-й позиции — и после deshalb/dann/um acht" },
      { de: "Mindestens zwei Konnektoren: dann, deshalb, trotzdem, weil, bevor, nachdem …", ru: "Минимум два союза из списка" },
      { de: "Jeder Satz hat ein Subjekt und ein konjugiertes Verb.", ru: "В каждом предложении есть подлежащее и спрягаемый глагол" },
      { de: "Groß- und Kleinschreibung: Nomen groß, sonst klein.", ru: "Заглавные буквы: существительные — с большой" },
    ],
  },
  {
    title: "Das Fahrrad",
    intro:
      "Erzähle die Geschichte im Präteritum oder Perfekt, von «ich» oder «Anna». Alle sechs Bilder müssen vorkommen. Schreibe 90–120 Wörter.",
    scenes: [
      { caption: "Anna findet ein altes Fahrrad auf dem Flohmarkt. Es kostet nur zwanzig Euro.", ru: "Аня находит старый велосипед на барахолке за 20 €" },
      { caption: "Zu Hause sieht sie: Die Bremse ist kaputt, das Licht fehlt.", ru: "Дома видит: тормоз сломан, нет фары" },
      { caption: "Sie bringt das Fahrrad in die Werkstatt. Der Mechaniker lacht: «Wieder ein Schnäppchen?»", ru: "Везёт в мастерскую, механик смеётся: «Опять выгодная покупка?»" },
      { caption: "Die Reparatur kostet achtzig Euro — mehr als das Fahrrad selbst.", ru: "Ремонт стоит 80 € — дороже самого велосипеда" },
      { caption: "Anna überlegt lange. Dann sagt sie: «Trotzdem — ich behalte es.»", ru: "Аня долго думает. «Всё равно — оставляю»" },
      { caption: "Am Sonntag fährt sie zum See. Das Fahrrad fährt sich wunderbar.", ru: "В воскресенье едет на озеро — велосипед идёт отлично" },
    ],
    checklist: [
      { de: "Alle sechs Bilder kommen in der Geschichte vor.", ru: "Все шесть картинок упомянуты" },
      { de: "Die Geschichte steht im Präteritum oder im Perfekt — nicht im Präsens.", ru: "Прошедшее время, не Präsens" },
      { de: "Das Verb steht auf Position 2 — auch nach «deshalb», «dann», «um acht».", ru: "Глагол на 2-й позиции" },
      { de: "Mindestens zwei Konnektoren: dann, deshalb, trotzdem, weil, bevor, nachdem …", ru: "Минимум два союза" },
      { de: "Satzbau der Nebensätze: das konjugierte Verb steht am Ende (weil … , bevor …).", ru: "В придаточных глагол в конце (weil…, bevor…)" },
      { de: "Du hast selbst laut vorgelesen und Fehler gehört? Verbessere sie, bevor du speicherst.", ru: "Прочитай вслух и исправь услышанные ошибки" },
    ],
  },
];
