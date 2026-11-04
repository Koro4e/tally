// Раздел 2 экзамена: Leseverstehen (20 из 100 баллов).
// Формат по образцу refs/deutsch.txt (текст «Die Feuerwehr» + 20 утверждений richtig/falsch).
// Правила:
//  - items идут В ПОРЯДКЕ появления фактов в тексте, распределены по всему тексту;
//  - ok=false только если утверждение ЯВНО противоречит тексту (цитата-опора в why);
//  - why по-русски, содержит точную цитату из текста в «кавычках-ёлочках»;
//  - факты только общеизвестные и проверяемые (году основания DB = 1994, ICE с 1991,
//    Deutschlandticket с мая 2023 сначала за 49 евро, ~300 000 сотрудников DB,
//    Grundschule 4 года / 6 лет в Берлине и Бранденбурге, Schulpflicht, ноты 1–6,
//    duale Ausbildung 3–3,5 года и т.д.).

export type LesenItem = { stmt: string; ok: boolean; why: string };
export type LesenText = { title: string; rubrik: string; text: string; items: LesenItem[] };

// ------------------------------------------------------------------
// ТЕКСТ A: Die Deutsche Bahn (~700 слов)
// ------------------------------------------------------------------
const textA = `Wer in Deutschland ohne Auto unterwegs ist, fährt meistens mit dem Zug: zur Arbeit, zum Einkaufen oder in den Urlaub. Der wichtigste Anbieter dafür ist die Deutsche Bahn. Sie ist eines der größten Verkehrsunternehmen der Welt – und fast jeder Deutsche hat schon eine Geschichte über die Bahn erzählt, meistens über eine Verspätung.

Es ist Montagabend, kurz nach 19 Uhr. Katharina Berger, 29 Jahre alt, steht mit einem Koffer auf dem Bahnsteig in Stuttgart. Sie ist Krankenschwester und arbeitet im Wechsel in Stuttgart und in Freiburg. Zweimal pro Woche fährt sie mit dem ICE zwischen den beiden Städten hin und her. „Früher bin ich immer mit dem Auto gefahren“, erzählt sie. „Aber im Zug kann ich lesen oder schlafen, und ich muss keinen Parkplatz suchen. Das ist mir sehr wertvoll.“ Heute läuft alles gut: Ihr Zug fährt pünktlich ab, und nach zweieinhalb Stunden kommt sie in Freiburg an. So soll es sein – aber es ist leider nicht immer so.

Die Deutsche Bahn AG ist ein junges Unternehmen mit einer langen Geschichte. Sie entstand im Jahr 1994, als die frühere Bundesbahn aus dem Westen mit der Reichsbahn aus dem Osten zusammengelegt wurde. Heute gehört der Konzern zum größten Teil dem Staat, und sein Sitz ist Berlin. Rund 300 000 Menschen arbeiten für die Bahn, und zwar nicht nur in Deutschland. Damit ist sie einer der größten Arbeitgeber des Landes. Die Bahngesellschaft hat auch viele Aufgaben: Sie betreut Bahnhöfe, verkauft Fahrkarten und repariert die Züge in großen Werkstätten.

Auf den Gleisen fahren verschiedene Zugarten. Die bekanntesten sind die ICE-Züge: weiße, schnelle Züge mit viel Komfort. Sie verkehren seit 1991 und erreichen auf den schnellen Strecken bis zu 300 Stundenkilometer. Damit gehören sie zu den schnellsten Zügen Europas. ICE-Züge verbinden große Städte wie Berlin, Hamburg, München und Frankfurt miteinander. An Bord gibt es ein Bistro, in dem man Kaffee, Snacks und kleine Mahlzeiten kaufen kann. Eine Sitzplatzreservierung ist nicht nötig, aber sie ist empfehlenswert. Für die Fahrt im Fernverkehr zahlt man mehr als im Regionalverkehr. Wer früh bucht, bekommt aber Rabatt, und mit der BahnCard fahren Kunden das ganze Jahr über günstiger.

Seit Mai 2023 gibt es außerdem das Deutschlandticket. Es gilt einen ganzen Monat lang in ganz Deutschland – aber nur in Bussen und Regionalzügen, nicht in den ICE-Zügen. Am Anfang kostete es 49 Euro pro Monat, inzwischen ist der Preis höher. In großen Städten kann man damit auch Bus, U-Bahn und S-Bahn beliebig oft benutzen. Besonders für Menschen in kleinen Orten ist das Ticket wichtig, weil Bus und Bahn dort oft die einzige Verbindung zur Stadt sind.

Das größte Problem der Bahn kennt jeder: die Verspätungen. Im Jahr 2023 kam rund ein Drittel der Fernzüge zu spät am Ziel an. Es gibt mehrere Gründe dafür: alte Gleise und alte Signale, zu viele Züge auf denselben Strecken, volle Bahnhöfe und viele Baustellen. Auch ein kleines Problem wie eine kaputte Tür kann einen ganzen Zug aufhalten. Die Bahn will das ändern: Sie stellt mehr Personal ein, erneuert Gleise und will die alten Signale durch digitale Technik ersetzen. Das dauert aber Jahre, und bis dahin bleiben Verspätungen ein Alltagsproblem.

Eine Besonderheit im Fernverkehr sind die sogenannten Flügelzüge. Am Anfang ist das ein einziger langer Zug, aber unterwegs wird er an einem Bahnhof geteilt: Der vordere Teil fährt dann nach Köln weiter, der hintere nach München. Die Fahrgäste müssen deshalb genau auf die Wagennummern achten, sonst sitzen sie am Ende im falschen Zugteil. Auch für Fahrräder gibt es eigene Regeln: In den ICE-Zügen dürfen sie nur mit Reservierung mitfahren, und der Platz kostet extra. Wer ruhig arbeiten oder lesen möchte, sucht sich am besten einen Platz im Ruhebereich – dort darf niemand laut telefonieren. Übrigens ist Rauchen in allen deutschen Zügen verboten.

Am Ende der Fahrt sitzt Katharina im ICE zurück nach Stuttgart. Der Zug hält in Offenburg, dann in Karlsruhe, und um 22 Uhr ist sie zu Hause. „Klar, die Bahn ist nicht perfekt“, sagt sie, „aber sie ist mein Alltag geworden. Und ein Leben ohne Auto ist auch gut für die Umwelt.“ Vielleicht ist das der Grund, warum viele Deutsche trotz aller Kritik bei der Bahn bleiben: Der Zug bringt sie ans Ziel – und manchmal auch mit einer neuen Geschichte über eine Verspätung.`;

const itemsA: LesenItem[] = [
  {
    stmt: 'Die Deutsche Bahn ist ein kleines Verkehrsunternehmen, das nur innerhalb Deutschlands arbeitet.',
    ok: false,
    why: 'Опровергается фразой: «Sie ist eines der größten Verkehrsunternehmen der Welt». Кроме того, в тексте сказано, что сотрудники работают не только в Германии: «Rund 300 000 Menschen arbeiten für die Bahn, und zwar nicht nur in Deutschland».'
  },
  {
    stmt: 'Katharina arbeitet abwechselnd in zwei Städten und fährt deshalb regelmäßig mit dem ICE.',
    ok: true,
    why: 'Подтверждается фразой: «Sie ist Krankenschwester und arbeitet im Wechsel in Stuttgart und in Freiburg. Zweimal pro Woche fährt sie mit dem ICE zwischen den beiden Städten hin und her».'
  },
  {
    stmt: 'Katharina findet die Zugfahrten anstrengend, weil sie im Zug nicht entspannen kann.',
    ok: false,
    why: 'Опровергается фразой: «Aber im Zug kann ich lesen oder schlafen» — в поезде она как раз отдыхает, а не напрягается.'
  },
  {
    stmt: 'Die Deutsche Bahn entstand 1994 durch die Zusammenlegung von zwei alten Bahnen.',
    ok: true,
    why: 'Подтверждается фразой: «Sie entstand im Jahr 1994, als die frühere Bundesbahn aus dem Westen mit der Reichsbahn aus dem Osten zusammengelegt wurde».'
  },
  {
    stmt: 'Der Bahnkonzern ist privat und hat seinen Sitz in Hamburg.',
    ok: false,
    why: 'Опровергается фразой: «Heute gehört der Konzern zum größten Teil dem Staat, und sein Sitz ist Berlin».'
  },
  {
    stmt: 'Die Bahn gehört zu den größten Arbeitgebern Deutschlands.',
    ok: true,
    why: 'Подтверждается фразой: «Rund 300 000 Menschen arbeiten für die Bahn» и далее: «Damit ist sie einer der größten Arbeitgeber des Landes».'
  },
  {
    stmt: 'Die ICE-Züge gehören zu den schnellsten Zügen Europas.',
    ok: true,
    why: 'Подтверждается фразой: «Sie verkehren seit 1991 und erreichen auf den schnellen Strecken bis zu 300 Stundenkilometer. Damit gehören sie zu den schnellsten Zügen Europas».'
  },
  {
    stmt: 'Die Fahrt mit dem Fernzug kostet genauso viel wie die Fahrt mit dem Regionalzug.',
    ok: false,
    why: 'Опровергается фразой: «Für die Fahrt im Fernverkehr zahlt man mehr als im Regionalverkehr».'
  },
  {
    stmt: 'Wer eine BahnCard hat, fährt das ganze Jahr über günstiger.',
    ok: true,
    why: 'Подтверждается фразой: «mit der BahnCard fahren Kunden das ganze Jahr über günstiger».'
  },
  {
    stmt: 'Das Deutschlandticket gilt auch für Busse.',
    ok: true,
    why: 'Подтверждается фразой: «Es gilt einen ganzen Monat lang in ganz Deutschland – aber nur in Bussen und Regionalzügen».'
  },
  {
    stmt: 'Mit dem Deutschlandticket kann man auch ICE-Züge benutzen.',
    ok: false,
    why: 'Опровергается фразой: «aber nur in Bussen und Regionalzügen, nicht in den ICE-Zügen».'
  },
  {
    stmt: 'Der Preis für das Deutschlandticket hat sich seit 2023 nicht verändert.',
    ok: false,
    why: 'Опровергается фразой: «Am Anfang kostete es 49 Euro pro Monat, inzwischen ist der Preis höher».'
  },
  {
    stmt: 'Für Menschen in kleinen Orten ist das Deutschlandticket besonders wichtig.',
    ok: true,
    why: 'Подтверждается фразой: «Besonders für Menschen in kleinen Orten ist das Ticket wichtig, weil Bus und Bahn dort oft die einzige Verbindung zur Stadt sind».'
  },
  {
    stmt: 'Im Jahr 2023 war ungefähr ein Drittel der Fernzüge verspätet.',
    ok: true,
    why: 'Подтверждается фразой: «Im Jahr 2023 kam rund ein Drittel der Fernzüge zu spät am Ziel an».'
  },
  {
    stmt: 'Schon ein kleines technisches Problem kann die Fahrt eines ganzen Zuges verzögern.',
    ok: true,
    why: 'Подтверждается фразой: «Auch ein kleines Problem wie eine kaputte Tür kann einen ganzen Zug aufhalten».'
  },
  {
    stmt: 'Die Bahn glaubt nicht, dass sie das Problem mit den Verspätungen verbessern kann.',
    ok: false,
    why: 'Опровергается фразой: «Die Bahn will das ändern: Sie stellt mehr Personal ein, erneuert Gleise und will die alten Signale durch digitale Technik ersetzen».'
  },
  {
    stmt: 'Bei einem Flügelzug kann man am Ende im falschen Zugteil sitzen.',
    ok: true,
    why: 'Подтверждается фразой: «Die Fahrgäste müssen deshalb genau auf die Wagennummern achten, sonst sitzen sie am Ende im falschen Zugteil».'
  },
  {
    stmt: 'Fahrräder dürfen in den ICE-Zügen ohne Reservierung und kostenlos mitgenommen werden.',
    ok: false,
    why: 'Опровергается фразой: «In den ICE-Zügen dürfen sie nur mit Reservierung mitfahren, und der Platz kostet extra».'
  },
  {
    stmt: 'Im Ruhebereich der ICE-Züge dürfen die Fahrgäste so laut telefonieren, wie sie wollen.',
    ok: false,
    why: 'Опровергается фразой: «Wer ruhig arbeiten oder lesen möchte, sucht sich am besten einen Platz im Ruhebereich – dort darf niemand laut telefonieren».'
  },
  {
    stmt: 'Wegen der Verspätungen will Katharina bald wieder mit dem Auto fahren.',
    ok: false,
    why: 'Опровергается фразой: «Klar, die Bahn ist nicht perfekt» и далее: «aber sie ist mein Alltag geworden» — она по-прежнему ездит на поезде: «Zweimal pro Woche fährt sie mit dem ICE».'
  }
];

// ------------------------------------------------------------------
// ТЕКСТ B: Das deutsche Schulsystem (~700 слов)
// ------------------------------------------------------------------
const textB = `Für Kinder in Deutschland beginnt ein wichtiger Abschnitt des Lebens mit etwa sechs Jahren: dann kommen sie in die Schule. Aber der Weg durch das deutsche Schulsystem ist länger und komplizierter, als viele denken – und in jedem Bundesland sieht er ein bisschen anders aus.

Es ist ein Samstagmorgen im August. In einer kleinen Stadt in Bayern wartet die zehnjährige Lena nervös vor dem Klassenzimmer. Heute bekommt sie ihr Zeugnis der vierten Klasse – und damit eine wichtige Empfehlung: Auf welchen Schultyp soll sie nach der Grundschule wechseln? Ihre Eltern sitzen im Publikum. Die Lehrerin hat vorher mit ihnen gesprochen, denn die Leistungen in der vierten Klasse spielen bei dieser Entscheidung eine große Rolle. Lena möchte gern aufs Gymnasium gehen. Als sie ihren Namen hört und das Zeugnis in den Händen hält, strahlt sie: Sie hat die Gymnasialempfehlung bekommen. Viele Eltern und Großeltern kommen an diesem Tag mit. Danach gibt es für die Familien zu Hause Kaffee und Kuchen, denn ein solcher Tag ist wie ein kleines Fest.

Die Grundschule ist der erste Schritt für alle Kinder: Sie dauert in den meisten Bundesländern vier Jahre. Es gibt aber Ausnahmen – in Berlin und Brandenburg gehen die Kinder sechs Jahre lang zur Grundschule. Dort lernen die Kinder Lesen, Schreiben und Rechnen, aber auch Sachfächer wie Naturkunde. Vor der Schule besuchen die meisten Kinder einen Kindergarten, aber der gehört nicht zum Schulsystem. Am ersten Schultag ist übrigens vieles besonders: Die neuen Schüler tragen eine bunte Schultüte, die mit Süßigkeiten und kleinen Geschenken gefüllt ist. Diese Tradition gibt es in Deutschland schon seit dem 19. Jahrhundert.

Nach der Grundschule trennen sich die Wege. Je nach Noten und Empfehlung wechseln die Schüler auf eine Hauptschule, eine Realschule oder ein Gymnasium. Es gibt außerdem Gesamtschulen, an denen diese Wege unter einem Dach zusammenbleiben. Die Hauptschule bereitet vor allem auf eine Berufsausbildung vor: Nach der neunten Klasse macht man dort einen einfachen Abschluss. Die Realschule geht meistens bis zur zehnten Klasse und liegt so dazwischen. Das Gymnasium endet nach der zwölften oder dreizehnten Klasse mit dem Abitur. Wer das Abitur hat, darf an jeder Universität in Deutschland studieren.

Wichtig zu wissen: Die Schulen sind in Deutschland Sache der 16 Bundesländer, nicht des Staates insgesamt. Deshalb gibt es keine deutsche Schule mit überall gleichen Regeln, sondern 16 kleine Systeme. Auch die Ferien machen das deutlich: Damit nicht alle Familien gleichzeitig auf Reisen sind, beginnen die Sommerferien in den einzelnen Bundesländern nacheinander. Sogar beim Abitur gibt es Unterschiede: In manchen Bundesländern macht man es nach zwölf Schuljahren, in anderen erst nach dreizehn. Ein Schüler, der von Hamburg nach Bayern zieht, muss deshalb oft vieles Neue lernen.

In ganz Deutschland gilt trotzdem eine gemeinsame Regel: die Schulpflicht. Sie beginnt mit der Grundschule und endet meistens erst nach neun oder zehn Schuljahren. Eltern müssen ihre Kinder zur Schule schicken; Unterricht zu Hause ist nicht erlaubt. Auch die Notenskala ist überall gleich: Es gibt Noten von 1 bis 6, wobei die 1 die beste Note ist und die 6 die schlechteste. Und etwas hat sich in den letzten Jahren verändert: Immer mehr Schulen sind heute Ganztagsschulen. Dann bleiben die Kinder auch am Nachmittag in der Schule, essen dort zu Mittag und machen Sport oder Hausaufgaben.

Auch nach der Schule hört das Lernen für viele nicht auf. Wer keine weiterführende Schule besucht, beginnt oft eine duale Ausbildung: Die jungen Leute arbeiten drei bis dreieinhalb Jahre in einem Betrieb und gehen daneben einen oder zwei Tage pro Woche in die Berufsschule. Theorie und Praxis gehören bei dieser Art zu lernen von Anfang an zusammen. Am Ende der Ausbildungszeit machen die jungen Leute eine Prüfung und bekommen einen anerkannten Berufsabschluss.

Lena erzählt das alles ihrem Cousin Jonas, der in Berlin wohnt. Bei ihm ist die Schule anders organisiert: Er geht noch zwei Jahre in die Grundschule, bevor er auf eine weiterführende Schule wechselt. Am Telefon vergleichen die beiden oft ihre Stundenpläne – und staunen, wie unterschiedlich die Schule in verschiedenen Regionen Deutschlands sein kann. Für Lena beginnt im September ein neuer Lebensabschnitt: das Gymnasium. In neun Jahren, so hofft sie, hält sie dann das Abiturzeugnis in den Händen – so wie einst ihre Mutter.`;

const itemsB: LesenItem[] = [
  {
    stmt: 'Deutsche Kinder kommen mit ungefähr sechs Jahren in die Schule.',
    ok: true,
    why: 'Подтверждается фразой: «beginnt ein wichtiger Abschnitt des Lebens mit etwa sechs Jahren: dann kommen sie in die Schule».'
  },
  {
    stmt: 'Das Schulsystem ist in allen Bundesländern genau gleich organisiert.',
    ok: false,
    why: 'Опровергается фразой: «in jedem Bundesland sieht er ein bisschen anders aus».'
  },
  {
    stmt: 'An diesem Tag erfährt Lena, auf welche Schule sie nach der Grundschule wechseln soll.',
    ok: true,
    why: 'Подтверждается фразой: «Heute bekommt sie ihr Zeugnis der vierten Klasse – und damit eine wichtige Empfehlung: Auf welchen Schultyp soll sie nach der Grundschule wechseln?» и далее: «Sie hat die Gymnasialempfehlung bekommen».'
  },
  {
    stmt: 'Die Lehrerin hat vor der Zeugnisübergabe kein Gespräch mit den Eltern geführt.',
    ok: false,
    why: 'Опровергается фразой: «Die Lehrerin hat vorher mit ihnen gesprochen».'
  },
  {
    stmt: 'In den meisten Bundesländern dauert die Grundschule vier Jahre.',
    ok: true,
    why: 'Подтверждается фразой: «Sie dauert in den meisten Bundesländern vier Jahre».'
  },
  {
    stmt: 'In Berlin dauert die Grundschule genauso lange wie in den meisten anderen Bundesländern.',
    ok: false,
    why: 'Опровергается фразой: «in Berlin und Brandenburg gehen die Kinder sechs Jahre lang zur Grundschule» — то есть дольше, чем четыре года.'
  },
  {
    stmt: 'Der Kindergarten gehört in Deutschland nicht zum Schulsystem.',
    ok: true,
    why: 'Подтверждается фразой: «Vor der Schule besuchen die meisten Kinder einen Kindergarten, aber der gehört nicht zum Schulsystem».'
  },
  {
    stmt: 'Noten und die Empfehlung der Schule spielen eine Rolle beim Wechsel auf die weiterführende Schule.',
    ok: true,
    why: 'Подтверждается фразой: «Je nach Noten und Empfehlung wechseln die Schüler auf eine Hauptschule, eine Realschule oder ein Gymnasium».'
  },
  {
    stmt: 'An der Gesamtschule müssen die Kinder direkt nach der Grundschule zwischen drei verschiedenen Schultypen wählen.',
    ok: false,
    why: 'Опровергается фразой: «Es gibt außerdem Gesamtschulen, an denen diese Wege unter einem Dach zusammenbleiben».'
  },
  {
    stmt: 'Wer das Abitur hat, darf an jeder Universität in Deutschland studieren.',
    ok: true,
    why: 'Подтверждается фразой: «Wer das Abitur hat, darf an jeder Universität in Deutschland studieren».'
  },
  {
    stmt: 'Der deutsche Staat legt die Regeln für alle Schulen in den 16 Bundesländern fest.',
    ok: false,
    why: 'Опровергается фразой: «Die Schulen sind in Deutschland Sache der 16 Bundesländer, nicht des Staates insgesamt».'
  },
  {
    stmt: 'Die Sommerferien beginnen in allen Bundesländern am gleichen Tag.',
    ok: false,
    why: 'Опровергается фразой: «beginnen die Sommerferien in den einzelnen Bundesländern nacheinander».'
  },
  {
    stmt: 'Beim Abitur gibt es Unterschiede zwischen den Bundesländern.',
    ok: true,
    why: 'Подтверждается фразой: «In manchen Bundesländern macht man es nach zwölf Schuljahren, in anderen erst nach dreizehn».'
  },
  {
    stmt: 'Eltern dürfen ihre Kinder in Deutschland zu Hause selbst unterrichten.',
    ok: false,
    why: 'Опровергается фразой: «Eltern müssen ihre Kinder zur Schule schicken; Unterricht zu Hause ist nicht erlaubt».'
  },
  {
    stmt: 'In deutschen Schulen ist die 6 die beste Note.',
    ok: false,
    why: 'Опровергается фразой: «Es gibt Noten von 1 bis 6, wobei die 1 die beste Note ist und die 6 die schlechteste».'
  },
  {
    stmt: 'In einer dualen Ausbildung lernt man im Betrieb und geht gleichzeitig zur Berufsschule.',
    ok: true,
    why: 'Подтверждается фразой: «Die jungen Leute arbeiten drei bis dreieinhalb Jahre in einem Betrieb und gehen daneben einen oder zwei Tage pro Woche in die Berufsschule».'
  },
  {
    stmt: 'Eine duale Ausbildung dauert in der Regel nur wenige Monate.',
    ok: false,
    why: 'Опровергается фразой: «arbeiten drei bis dreieinhalb Jahre in einem Betrieb».'
  },
  {
    stmt: 'Jonas wechselt genau wie Lena direkt nach der vierten Klasse auf eine weiterführende Schule.',
    ok: false,
    why: 'Опровергается фразой: «Er geht noch zwei Jahre in die Grundschule, bevor er auf eine weiterführende Schule wechselt».'
  },
  {
    stmt: 'Lena und Jonas staunen darüber, wie unterschiedlich die Schulen in verschiedenen Regionen organisiert sind.',
    ok: true,
    why: 'Подтверждается фразой: «Am Telefon vergleichen die beiden oft ihre Stundenpläne – und staunen, wie unterschiedlich die Schule in verschiedenen Regionen Deutschlands sein kann».'
  },
  {
    stmt: 'Lena hofft, in ungefähr neun Jahren das Abiturzeugnis in den Händen zu halten.',
    ok: true,
    why: 'Подтверждается фразой: «In neun Jahren, so hofft sie, hält sie dann das Abiturzeugnis in den Händen».'
  }
];

export const LESEN: LesenText[] = [
  { title: 'Die Deutsche Bahn', rubrik: 'Mobilität und Alltag', text: textA, items: itemsA },
  { title: 'Das deutsche Schulsystem', rubrik: 'Schule und Bildung', text: textB, items: itemsB }
];
