/* ============================================================================
   SPEZIFIKATIONEN
   ----------------------------------------------------------------------------
   Зачем это существует.

   Раньше сервер получал одну строку: «Thema: Vorzeichen». На этом модель
   один раз выдала квадратное неравенство, и поймать это было нечем: тема
   названа верно, задача — из соседней.

   Здесь у каждого узла лежит:
     was     — что именно входит в навык (и что нет);
     beispiel— один пример в стиле экзамена;
     nicht   — прямой запрет на соседние темы;
     varianten — РАЗНЫЕ ФОРМЫ задачи, которые на экзамене встречаются.

   `varianten` — главное. Раньше зачёт ставился за 6 задач подряд, но никто
   не гарантировал, что среди них были все формы. Можно было закрыть узел,
   ни разу не увидев трудную форму. Теперь узел закрывается, только когда
   каждая варианта решена хотя бы раз — это и есть операциональное
   определение «решит любую задачу по этой теме».

   Формат ответа. Экзамен в Aufgabe 4 требует целую Lösungsmenge, а наш
   верификатор детерминированно считает только число. Поэтому уравнения
   спрашивают не «дай множество», а число, которое без полного решения не
   получить: «größere Lösung», «Summe der Lösungen», «kleinere Grenze des
   Intervalls». Навык тот же, проверка остаётся честной. В `probe` это
   прописано явно — модель сама так и спрашивает.

   Источник форм: официальный образец 2025 (beispiel_aufnahmetest_2025_
   mathematik.pdf), Aufgabe 1–7, плюс список Prüfungsinhalte с первой
   страницы. Ничего не придумано «для красоты».
   ========================================================================== */

export type Variante = {
  /** короткий id — он же пишется в прогресс как «проба сдана» */
  id: string;
  /** что проверяет эта форма, по-немецки — уходит в промпт */
  de: string;
  /** пример в стиле экзамена: задаёт форму и требуемый вид ответа */
  probe: string;
};

export type Spec = {
  id: string;
  was: string;
  beispiel: string;
  nicht: string;
  varianten: Variante[];
  /**
   * Задача рисуется, а не пишется: модель отдаёт функцию и окно, клиент
   * строит график, сервер проверяет ответ подстановкой в эту же функцию.
   */
  plot?: boolean;
};

const v = (id: string, de: string, probe: string): Variante => ({ id, de, probe });

export const SPECS: Record<string, Spec> = {
  /* ======================================================== GRUNDRECHNEN == */

  vorzeichen: {
    id: "vorzeichen",
    was: "Vorzeichenregeln: plus mal minus, minus mal minus ergibt plus, Subtraktion einer negativen Zahl, Vorzeichen bei Potenzen, Vorzeichen im Bruch",
    beispiel: "(−7)·(−8) = 56",
    nicht: "keine Gleichungen, keine Ungleichungen, keine Variablen, keine Wurzeln oder Logarithmen",
    varianten: [
      v("prod2", "Produkt zweier negativer Zahlen", "Berechne: (−7)·(−8)"),
      v("subneg", "Subtraktion einer negativen Zahl", "Berechne: 14 − (−9)"),
      v("paritaet", "Vorzeichen bei drei oder vier Faktoren", "Berechne: (−2)·(−3)·(−4)"),
      v("potenz", "negative Basis mit geradem und ungeradem Exponenten", "Berechne: (−3)² − (−2)³"),
      v("bruch", "negativer Zähler und negativer Nenner im Bruch", "Berechne: (−36) : (−4)"),
      v("doppel", "Doppelminus in Klammern", "Berechne: −(−5) + (−3) − (−8)"),
      /* −a² ≠ (−a)²: ровно эта ловушка стоит в официальном ключе Kiel 2025, Aufgabe 6d (k = −2²·0,5·(−3); ключ: 6). */
      v("falle-minus-quadrat", "минус не под степенью: −a² = −(a·a)", "Berechnen Sie: −2² · 0,5 · (−3)"),
    ],
  },

  quadratzahlen: {
    id: "quadratzahlen",
    was: "Quadratzahlen von 1 bis 25 auswendig, Wurzel einer Quadratzahl, Differenz zweier Quadrate",
    beispiel: "17² = 289",
    nicht: "keine Variablen, keine binomischen Formeln mit Buchstaben, keine Wurzeln aus Nicht-Quadratzahlen",
    varianten: [
      v("direkt", "Quadratzahl direkt abrufen", "Berechne: 17²"),
      v("diff", "Differenz zweier Quadratzahlen", "Berechne: 24² − 23²"),
      v("wurzel", "Wurzel aus einer Quadratzahl", "Berechne: √441"),
      v("summe", "Summe zweier Quadratzahlen", "Berechne: 16² + 12²"),
      v("klammer", "Quadratzahl in einem Klammerausdruck", "Berechne: (25² − 7²) : 24"),
    ],
  },

  klammern: {
    id: "klammern",
    was: "Klammerrechnung und Reihenfolge: Punkt vor Strich, verschachtelte Klammern, Minus vor der Klammer, Distributivgesetz",
    beispiel: "120 : [(32 + 8)·(32 − 8)] = 1/8",
    nicht: "keine Gleichungen, keine Variablen, keine binomischen Formeln",
    varianten: [
      v("punkt", "Punkt vor Strich mit einer Klammer", "Berechne: 120 : [(32 + 8)·(32 − 8)]"),
      v("nest", "verschachtelte Klammern", "Berechne: 2·[3 + (4 − 6)·2] − 5"),
      v("minus", "Minus vor der Klammer auflösen", "Berechne: 40 − (12 − 25) − 8"),
      v("distributiv", "Distributivgesetz rückwärts, gemeinsamer Faktor", "Berechne: 7·13 + 7·7 − 7·6"),
      v("bruchstrich", "Bruchstrich als Klammer", "Berechne: (18 − 4·3) : (7 − 5)"),
    ],
  },

  "bruch-add": {
    id: "bruch-add",
    was: "Brüche addieren und subtrahieren: gleicher Nenner, ungleicher Nenner über das kgV, ganze Zahl plus Bruch, negatives Ergebnis",
    beispiel: "3/4 − 5/6 = −1/12",
    nicht: "keine Multiplikation oder Division von Brüchen, keine Variablen, keine Gleichungen",
    varianten: [
      v("gleich", "gleicher Nenner", "Berechne: 7/9 − 4/9"),
      v("ungleich", "ungleicher Nenner über das kgV", "Berechne: 3/4 − 5/6"),
      v("ganz", "ganze Zahl plus Bruch", "Berechne: 1 + 1/25 − 2/5"),
      v("drei", "drei Brüche mit verschiedenen Nennern", "Berechne: 1/2 + 1/3 − 1/6"),
      v("negativ", "Ergebnis ist negativ", "Berechne: 5/8 − 7/6"),
    ],
  },

  "bruch-mul": {
    id: "bruch-mul",
    was: "Brüche multiplizieren und dividieren: Zähler mal Zähler, Division als Kehrwert, Kürzen über Kreuz, Doppelbruch",
    beispiel: "(6/7) : (5/9) = 54/35",
    nicht: "keine Addition von Brüchen, keine Variablen, keine Gleichungen",
    varianten: [
      v("mul", "Multiplikation zweier Brüche, kürzen", "Berechne: (8/15)·(25/12)"),
      v("div", "Division zweier Brüche als Kehrwert", "Berechne: (6/7) : (5/9)"),
      v("ganzzahl", "Bruch geteilt durch eine ganze Zahl", "Berechne: (3/4) : 6"),
      v("doppel", "Doppelbruch", "Berechne: (2/3) / (4/5)"),
      v("gemischt", "gemischte Zahl mal Bruch", "Berechne: 2 1/2 · 4/5"),
    ],
  },

  binomisch: {
    id: "binomisch",
    was: "Binomische Formeln: (a+b)², (a−b)², (a+b)(a−b); ausmultiplizieren und rückwärts erkennen",
    beispiel: "(x + 3)² = x² + 6x + 9",
    nicht: "keine Polynomdivision, keine Bruchterme, keine Gleichungen",
    varianten: [
      v("plus", "erste binomische Formel ausmultiplizieren", "Berechne den Term (x + 3)² für x = 7"),
      v("minus", "zweite binomische Formel ausmultiplizieren", "Berechne den Term (2x − 5)² für x = 4"),
      v("diff", "dritte binomische Formel, Differenz zweier Quadrate", "Berechne den Term (3x + 2)(3x − 2) für x = 5"),
      v("rueck", "binomische Formel rückwärts erkennen", "Berechne den Term x² − 12x + 36 für x = 9"),
      v("kubisch", "kubisches Binom, z. B. a³ − 3a²b + 3ab² − b³", "Berechne den Term (a − b)³ für a = 5 und b = 2"),
    ],
  },

  /* ================================================================ TERME == */

  potenzgesetze: {
    id: "potenzgesetze",
    was: "Potenzgesetze: gleiche Basis multiplizieren und dividieren, Potenz einer Potenz, negativer Exponent, Exponent 0, Wurzel als Bruchexponent",
    beispiel: "2³·2⁴ : 2⁵ = 4",
    nicht: "keine Logarithmen, keine Gleichungen, keine Parameter im Exponenten",
    varianten: [
      v("multdiv", "gleiche Basis multiplizieren und dividieren", "Berechne: 2³·2⁴ : 2⁵"),
      v("potpot", "Potenz einer Potenz", "Berechne: (2³)² : 2⁴"),
      v("negativ", "negativer Exponent", "Berechne: 3²·64·(3·4)^(−1)"),
      v("null", "Exponent 0 und negative Basis", "Berechne: (−5)⁰ + (−2)³·(−2)²"),
      v("wurzelexp", "Wurzel als Bruchexponent", "Berechne: 8^(1/3)·4^(1/2)"),
    ],
  },

  wurzelgesetze: {
    id: "wurzelgesetze",
    was: "Wurzelgesetze: Wurzel aus Produkt und Quotient, Kubikwurzel, Wurzel aus Dezimalbrüchen, teilweises Wurzelziehen",
    beispiel: "√0,25 · √0,0256 = 0,08",
    nicht: "keine Logarithmen, keine Wurzelgleichungen, keine Variablen unter der Wurzel",
    varianten: [
      v("dezimal", "Wurzel aus einem Dezimalbruch", "Berechne: √0,25 · √0,0256"),
      v("kubik", "Kubikwurzel", "Berechne: ∛(125/1000) · ∛8"),
      v("produkt", "Wurzel aus Produkt oder Quotient", "Berechne: √50 : √2"),
      v("teilweise", "teilweises Wurzelziehen", "Berechne: √72 : √2"),
      v("verschachtelt", "Wurzel aus Wurzel bzw. Wurzel im Nenner", "Berechne: √(√16 · 81)"),
    ],
  },

  logarithmus: {
    id: "logarithmus",
    was: "Logarithmusgesetze: Produktregel, Quotientenregel, Potenzregel, Koeffizient als Exponent, ln und lg",
    beispiel: "lg 8 + lg 125 = 3",
    nicht: "keine Logarithmusgleichungen, keine Exponentialgleichungen, keine Ableitungen",
    varianten: [
      v("direkt", "Logarithmus direkt berechnen", "Berechne: lg 1000 − lg 10"),
      v("produkt", "Produktregel", "Berechne: lg 8 + lg 125"),
      v("potenz", "Potenzregel mit Koeffizient", "Berechne: 2·ln(e³) − ln(e²)"),
      v("quotient", "Quotientenregel", "Berechne: ln(24) − ln(3)"),
      v("gemischt", "mehrere Gesetze in einem Term mit x und y", "Berechne für x = 2 und y = 3: 2·ln(x·y) + ln(3/x²) − 0,5·ln(y⁴)"),
    ],
  },

  rechenterm: {
    id: "rechenterm",
    was: "Rechenterme gemischt: alles aus Aufgabe 1 des Aufnahmetests — Klammern, Brüche, Potenzen, Wurzeln, Logarithmen in einer Aufgabe",
    beispiel: "3/2 · 64 · (3·4)^(−1) + (−2⁶ : 8) = 40",
    nicht: "keine Gleichungen, keine Variablen im Ergebnis, keine Textaufgaben",
    varianten: [
      v("klammerbruch", "Klammer, Punkt vor Strich und Bruch", "Berechne: 120 : [(32 + 8)·(32 − 8)]"),
      v("wurzelbruch", "Wurzel und Bruch mit Dezimalzahlen", "Berechne: √0,25/0,0256 · ∛(125/1000)"),
      v("potenzneg", "Potenzen mit negativem Exponenten und Klammer", "Berechne: 3/2 · 64 · (3·4)^(−1) + (−2⁶ : 8)"),
      v("logterm", "Logarithmen mit Koeffizienten", "Berechne für x = 2, y = 3: 2·ln(x·y) + ln(3/x²) − 0,5·ln(y⁴)"),
      v("alles", "vier Rechenarten und zwei Gesetze in einer Aufgabe", "Berechne: (2/3 + 5/6)·12 − 3²·(√16 − 5)"),
    ],
  },

  polynomdivision: {
    id: "polynomdivision",
    was: "Polynomdivision: Polynom durch Linearfaktor teilen, Grad abbauen, Probe",
    beispiel: "(x³ − 3x² + 4) : (x + 1) = x² − 4x + 4",
    nicht: "keine Gleichungen, keine Bruchterme, keine Ableitungen",
    varianten: [
      v("kubisch", "kubisches Polynom durch (x + a)", "Dividiere (x³ − 3x² + 4) : (x + 1) und berechne den Wert des Ergebnisses für x = 3"),
      v("quadratisch", "quadratisches Polynom durch (x − a)", "Dividiere (x² − 5x + 6) : (x − 2) und berechne den Wert des Ergebnisses für x = 4"),
      v("mitrest", "Division mit Rest, Rest angeben", "Dividiere (x³ + 2x² − 5) : (x − 1) und gib den Rest an"),
      v("faktor", "fehlende Potenz, Koeffizient 0 ergänzen", "Dividiere (x³ + 8) : (x + 2) und berechne den Wert des Ergebnisses für x = 1"),
    ],
  },

  faktorisieren: {
    id: "faktorisieren",
    was: "Faktorisieren: gemeinsamen Faktor ausklammern, Differenz zweier Quadrate, binomische Formel rückwärts, Produktform eines quadratischen Terms",
    beispiel: "x² − 9 = (x − 3)(x + 3)",
    nicht: "keine Polynomdivision, keine Gleichungen, keine Bruchterme",
    varianten: [
      v("ausklammern", "gemeinsamen Faktor ausklammern", "Klammere aus und berechne den Wert für x = 5: 6x² − 9x"),
      v("diffquadrat", "Differenz zweier Quadrate", "Faktorisiere 4x² − 25 und berechne den Wert für x = 3"),
      v("binom", "binomische Formel rückwärts", "Faktorisiere x² + 10x + 25 und berechne den Wert für x = 2"),
      v("produktform", "Produktform aus den Nullstellen", "Faktorisiere x² − 7x + 12 und berechne den Wert für x = 5"),
    ],
  },

  bruchterme: {
    id: "bruchterme",
    was: "Bruchterme kürzen und vereinfachen: Kürzen mit Monomen, Kürzen mit binomischen Formeln, Multiplikation und Division von Bruchtermen",
    beispiel: "(4a² − 9) : (2a + 3) = 2a − 3",
    nicht: "keine Bruchgleichungen, keine Definitionsmenge, keine Gleichungen",
    varianten: [
      v("monom", "Kürzen mit einem Monom", "Kürze (12x³y) : (18xy²) und berechne den Wert für x = 3, y = 2"),
      v("binom", "Kürzen mit binomischer Formel", "Kürze (4a² − 9) : (2a + 3) und berechne den Wert für a = 4"),
      v("multdiv", "Multiplikation und Division von Bruchtermen", "Vereinfache ((4a² − 9)/(49b² − 1)) : ((2a + 3)/(7b − 1)) · (7b + 1) und berechne den Wert für a = 2, b = 1"),
      v("doppel", "Doppelbruch mit Buchstaben", "Vereinfache (1/x + 1/y) : (1/x − 1/y) und berechne den Wert für x = 3, y = 2"),
    ],
  },

  "parameter-exponent": {
    id: "parameter-exponent",
    was: "Parameter im Exponenten: Exponenten mit Termen wie m+1 oder −2/n zusammenfassen, Wurzel als Bruchexponent, Potenz einer Potenz",
    beispiel: "√(x^(m+1)) · x^(−2/n) : √(x^(4m−2)) = x^((n−m)/n)",
    nicht: "keine Exponentialgleichungen, keine Logarithmen, keine Zahlen im Exponenten ohne Parameter",
    varianten: [
      v("summe", "Exponenten mit Summe addieren", "Vereinfache x^(m+1) · x^(m−1) : x^(2m) und berechne den Wert für x = 3, m = 2"),
      v("wurzel", "Wurzel als Bruchexponent mit Parameter", "Vereinfache √(x^(4m−2)) : x^(2m−1) und berechne den Wert für x = 4, m = 1"),
      v("potpot", "Potenz einer Potenz mit Parameter", "(x^(m/n))^(2n) vereinfachen und den Wert für x = 2, m = 3, n = 1 berechnen"),
      v("quotient", "Division mit Parametern im Exponenten", "Vereinfache x^(2m+3) : x^(m+1) und berechne den Wert für x = 2, m = 2"),
    ],
  },

  schaetzen: {
    id: "schaetzen",
    was: "Größenvergleich ohne Taschenrechner: einschätzen, ob ein Term kleiner oder größer als 1 ist; Wurzeln, Logarithmen, Brüche und Potenzen der Größe nach vergleichen",
    beispiel: "√1,6 > 1, ln 2 < 1, 0,0001/0,000001 = 100",
    nicht: "keine Gleichungen, kein exaktes Ausrechnen verlangt, keine Textaufgaben",
    varianten: [
      v("kleiner1", "zwei Terme mit 1 vergleichen, Anzahl zählen", "Wie viele der beiden Werte sind kleiner als 1? a = √1,6, b = ln 2. Gib die Anzahl an"),
      v("vergleich", "zwei Terme vergleichen, Differenz angeben", "Welcher Term ist größer? Gib die Differenz (größer minus kleiner) auf eine Dezimalstelle an: √3,61 und 19/10"),
      v("ordnung", "drei Terme der Größe nach ordnen, mittleren angeben", "Ordne der Größe nach. Gib den mittleren Wert an: √50, 7,05 und √51"),
      v("prozent", "Bruch gegen Dezimalzahl abschätzen, Differenz angeben", "Ist 5/8 größer oder kleiner als 0,6? Gib die Differenz (größer minus kleiner) als Dezimalzahl an"),
    ],
  },

  /* ============================================================ GLEICHUNGEN == */

  "quad-gleichung": {
    id: "quad-gleichung",
    was: "Quadratische Gleichungen: Normalform, p-q-Formel oder Mitternachtsformel, Diskriminante, doppelte Lösung, keine reelle Lösung, Faktorisieren",
    beispiel: "x² − 5x + 6 = 0 → L = {2; 3}",
    nicht: "keine Ungleichungen, keine Bruchgleichungen, keine Wurzeln, kein Parameter",
    varianten: [
      v("zwei", "zwei verschiedene Lösungen, größere Lösung angeben", "Löse 1/2·x² − 4,5x − 11 = 0. Gib die größere Lösung an"),
      v("doppelt", "doppelte Lösung", "Löse x² − 8x + 16 = 0. Gib die Lösung an"),
      v("keine", "keine reelle Lösung, Diskriminante negativ", "Löse x² + 2x + 5 = 0. Gib die Diskriminante an"),
      v("ohneconst", "x ausklammern statt Formel", "Löse x² − 7x = 0. Gib die größere Lösung an"),
      v("summe", "Summe der Lösungen angeben", "Löse 2x² − 10x + 8 = 0. Gib die Summe der Lösungen an"),
    ],
  },

  bruchgleichung: {
    id: "bruchgleichung",
    was: "Bruchgleichungen: Definitionsmenge bestimmen, mit dem Hauptnenner multiplizieren, Scheinlösungen ausschließen",
    beispiel: "2/x − 2/(x−2) = 3 → D = ℝ\\{0; 2}",
    nicht: "keine Bruchterme ohne Gleichung, keine Ungleichungen, keine Wurzeln",
    varianten: [
      v("zwei", "zwei Brüche gleichgesetzt", "Löse 2/x − 2/(x−2) = 3. Gib die Lösung an"),
      v("schein", "Scheinlösung ausschließen", "Löse x/(x−3) = 3/(x−3). Gib die Anzahl der Lösungen an"),
      v("zahl", "Bruch gleich einer Zahl", "Löse 5/(x+1) = 2. Gib die Lösung an"),
      v("defmenge", "Definitionsmenge bestimmen", "Gib die Definitionsmenge von 1/(x²−9) + x/(x+3) an. Gib die Anzahl der ausgeschlossenen Werte an"),
    ],
  },

  wurzelgleichung: {
    id: "wurzelgleichung",
    was: "Wurzelgleichungen: Definitionsmenge, Quadrieren, Scheinlösungen durch das Quadrieren erkennen",
    beispiel: "√(3x − 1) = √(1 + x) → L = {1}",
    nicht: "keine Wurzelgesetze ohne Gleichung, keine Ungleichungen, keine Logarithmen",
    varianten: [
      v("zweiwurzeln", "zwei Wurzeln gleichgesetzt", "Löse √(3x − 1) = √(1 + x). Gib die Lösung an"),
      v("wurzelzahl", "Wurzel gleich einer Zahl", "Löse √(2x + 7) = 5. Gib die Lösung an"),
      v("schein", "Scheinlösung nach dem Quadrieren", "Löse √(x + 6) = x. Gib die Lösung an"),
      v("defmenge", "Definitionsmenge der Wurzelgleichung", "Gib die Definitionsmenge von √(2x − 8) + √(12 − x) an. Gib die Anzahl der ganzen Zahlen in D an"),
    ],
  },

  betragsgleichung: {
    id: "betragsgleichung",
    was: "Betragsgleichungen: Fallunterscheidung, zwei Lösungen, keine Lösung bei negativer rechter Seite, Betrag gleich einem quadratischen Term",
    beispiel: "|3x + 3| = −(x² − 2x − 3) → L = {−1; 0}",
    nicht: "keine Betragsungleichungen, keine Wurzeln, keine Parameter",
    varianten: [
      v("zwei", "Betrag gleich einer positiven Zahl", "Löse |2x − 6| = 4. Gib die Summe der Lösungen an"),
      v("quadratisch", "Betrag gleich einem quadratischen Term", "Löse |3x + 3| = −(x² − 2x − 3). Gib die größere Lösung an"),
      v("keine", "keine Lösung, rechte Seite negativ", "Löse |x + 5| = −3. Gib die Anzahl der Lösungen an"),
      v("null", "Betrag gleich null", "Löse |4x − 12| = 0. Gib die Lösung an"),
    ],
  },

  exponentialgleichung: {
    id: "exponentialgleichung",
    was: "Exponentialgleichungen: gleiche Basis herstellen, logarithmieren, Substitution bei e^x + a·e^(−x), zwei Lösungen",
    beispiel: "e^x + 2e^(−x) = 3 → L = {0; ln 2}",
    nicht: "keine Logarithmusgleichungen, keine Potenzgesetze ohne Gleichung, keine Parameter",
    varianten: [
      v("gleichebasis", "gleiche Basis herstellen", "Löse 3^(2x) = 27. Gib die Lösung an"),
      v("logarithmieren", "logarithmieren", "Löse 2^x = 20. Gib den gerundeten Wert auf zwei Dezimalstellen an"),
      v("substitution", "Substitution e^x = u, zwei Lösungen", "Löse e^x + 2e^(−x) = 3. Gib die Summe der Lösungen an"),
      v("produkt", "Produkt zweier Potenzen", "Löse 2^x · 2^(x+1) = 32. Gib die Lösung an"),
    ],
  },

  "parameter-gleichung": {
    id: "parameter-gleichung",
    was: "Gleichungen mit Parameter: Diskriminante in Abhängigkeit von t, für welche t gibt es keine, eine oder zwei Lösungen",
    beispiel: "x² − tx + t + 3 = 0 hat keine Lösung für −2 < t < 6",
    nicht: "keine Ungleichungen ohne Parameter, keine Bruchgleichungen mit Parameter, keine Funktionenscharen",
    varianten: [
      v("keine", "für welche t gibt es keine Lösung", "Für welche Werte von t hat x² − tx + t + 3 = 0 keine Lösung? Gib die größte ganze Zahl t an, für die es keine Lösung gibt"),
      v("eine", "für welche t gibt es genau eine Lösung", "Für welche Werte von t hat x² − 4x + t = 0 genau eine Lösung? Gib t an"),
      v("zwei", "für welche t gibt es zwei Lösungen", "Für welche Werte von t hat x² + tx + 1 = 0 zwei Lösungen? Gib die kleinste ganze Zahl t an, für die das gilt"),
    ],
  },

  "quad-ungleichung": {
    id: "quad-ungleichung",
    was: "Quadratische Ungleichungen: Nullstellen bestimmen, Vorzeichen der Parabel, Lösungsintervall oder Vereinigung zweier Intervalle",
    beispiel: "−4x² + 5x < x − 3 → x < −1/2 oder x > 3/2",
    nicht: "keine quadratischen Gleichungen mit =, keine Bruchungleichungen, keine Betragsungleichungen",
    varianten: [
      v("intervall", "Lösung ist ein Intervall", "Löse x² − 4 < 0. Gib die obere Grenze des Lösungsintervalls an"),
      v("aussen", "Lösung sind zwei äußere Intervalle", "Löse −4x² + 5x < x − 3. Gib die kleinere Grenze an"),
      v("produkt", "Produktform mit Vorzeichenwechsel", "Löse (x − 2)(x + 5) > 0. Gib die kleinere Grenze an"),
      v("ganzzahlen", "Anzahl der ganzen Zahlen in der Lösungsmenge", "Löse x² − 6x + 5 ≤ 0. Gib die Anzahl der ganzen Zahlen in der Lösungsmenge an"),
    ],
  },

  "log-gleichung": {
    id: "log-gleichung",
    was: "Logarithmusgleichungen: Definitionsmenge, Logarithmusgesetze anwenden, entlogarithmieren, Scheinlösungen ausschließen",
    beispiel: "lg(x) + lg(x − 3) = 1 → x = 5",
    nicht: "keine Exponentialgleichungen, keine Logarithmusgesetze ohne Gleichung",
    varianten: [
      v("summe", "Summe zweier Logarithmen", "Löse lg(x) + lg(x − 3) = 1. Gib die Lösung an"),
      v("faktor", "Koeffizient vor dem Logarithmus", "Löse 2·lg(x) = lg(9). Gib die Lösung an"),
      v("schein", "Scheinlösung außerhalb der Definitionsmenge", "Löse lg(x) + lg(x + 3) = 1. Gib die Lösung an"),
      v("defmenge", "Definitionsmenge bestimmen", "Gib die Definitionsmenge von lg(x − 2) + lg(6 − x) an. Gib die Anzahl der ganzen Zahlen in D an"),
    ],
  },

  lgs3: {
    id: "lgs3",
    was: "Lineares Gleichungssystem mit drei Unbekannten: Einsetzen, Gleichsetzen oder Additionsverfahren, Lösungsmenge als Tripel",
    beispiel: "2x + 3y + z = −4; −3x + 4y + 2z = −16; −x − y = 1 → L = {(2; −3; 1)}",
    nicht: "keine quadratischen Gleichungen, keine Ungleichungssysteme, keine Matrizen",
    varianten: [
      v("drei", "drei Gleichungen, drei Unbekannte, eindeutig", "Löse 2x + 3y + z = −4, −3x + 4y + 2z = −16, −x − y = 1. Gib den Wert von z an"),
      v("fehlend", "eine Variable fehlt in einer Gleichung", "Löse x + y + z = 6, x − y = 1, 2x + z = 7. Gib den Wert von x an"),
      v("summe", "Summe der Lösungen angeben", "Löse 3x + y − z = 2, x − y + 2z = 5, 2x + 2y + z = 9. Gib x + y + z an"),
      v("zweidrei", "zwei Gleichungen, drei Unbekannte, Parameter frei wählbar", "Löse x + y + z = 5, x − y + z = 1. Gib den Wert von x + z an"),
    ],
  },

  /* ============================================================= FUNKTIONEN == */

  gerade: {
    id: "gerade",
    was: "Gerade durch zwei Punkte: Steigung aus zwei Punkten, Achsenabschnitt, Geradengleichung aufstellen, Nullstelle",
    beispiel: "A(−2; −5), B(4; 4) → y = 3/2·x − 2",
    nicht: "keine quadratischen Funktionen, keine Lage zweier Geraden, keine Ableitungen",
    varianten: [
      v("steigung", "Steigung aus zwei Punkten", "Eine Gerade geht durch A(−2; −5) und B(4; 4). Gib die Steigung an"),
      v("gleichung", "Geradengleichung aus zwei Punkten", "Eine Gerade geht durch A(1; 5) und B(3; 11). Gib den y-Achsenabschnitt an"),
      v("punktsteigung", "Achsenabschnitt aus Punkt und Steigung", "Eine Gerade hat die Steigung m = −2 und geht durch P(3; 1). Gib den y-Achsenabschnitt an"),
      v("nullstelle", "Nullstelle einer Geraden", "Gegeben ist y = 3/2·x − 2. Gib die Nullstelle an"),
    ],
  },

  lage: {
    id: "lage",
    was: "Lage zweier Geraden: parallel, senkrecht, Schnittpunkt, identisch; Geradengleichung aus Parallelität oder Orthogonalität",
    beispiel: "g: y = 3/2x − 2, h parallel durch P(−2; −7) → h: y = 2x − 3",
    nicht: "keine Parabeln, keine Gerade durch zwei Punkte ohne Bezugsgerade",
    varianten: [
      v("parallel", "Parallele durch einen Punkt", "Die Gerade h verläuft durch P(−2; −7) und ist parallel zu y = 2x + 4. Gib den y-Achsenabschnitt von h an"),
      v("schnitt", "Schnittpunkt zweier Geraden", "Berechne den Schnittpunkt von y = 3/2·x − 2 und y = 2x − 3. Gib die x-Koordinate an"),
      v("senkrecht", "senkrechte Gerade durch einen Punkt", "Die Gerade h steht senkrecht auf y = 2x + 1 und geht durch P(4; 3). Gib die Steigung von h an"),
      v("identisch", "identische oder parallele Geraden unterscheiden", "Sind y = 2x + 3 und 4x − 2y = −6 identisch? Gib 1 für ja und 0 für nein an"),
    ],
  },

  parabel: {
    id: "parabel",
    was: "Parabeln: Scheitelpunkt, Scheitelform, Nullstellen, Öffnungsrichtung, y-Achsenabschnitt",
    beispiel: "y = x² − 6x + 5 → Scheitel (3; −4)",
    nicht: "keine Geraden, keine Graphen lesen, keine Ableitungen. Die Funktionsgleichung steht IMMER als y = … da, niemals als y = … = 0",
    varianten: [
      v("scheitel", "Scheitelpunkt aus der Normalform", "Gegeben ist y = x² − 6x + 5. Gib die x-Koordinate des Scheitels an"),
      v("scheitelform", "Scheitelform ergänzen, e ablesen", "Forme y = x² + 4x + 1 in die Form y = (x + d)² + e um. Gib e an"),
      v("nullstellen", "Nullstellen einer Parabel", "Gegeben ist die Parabel y = x² − 6x + 5. Gib die größere Nullstelle an"),
      v("oeffnung", "Öffnungsrichtung und y-Achsenabschnitt", "Gegeben ist y = −2x² + 4x + 6. Gib den y-Achsenabschnitt an"),
    ],
  },

  "graph-lesen": {
    id: "graph-lesen",
    was: "An einem gezeichneten Graphen ablesen: Funktionswert an einer Stelle, Nullstelle, Steigung, y-Achsenabschnitt. Mal eine Gerade, mal eine Parabel — nicht immer dieselbe Form",
    beispiel: "Graph von f(x) = 0,5x² − 2x − 1,5 → f(2) = −3,5",
    nicht: "keine Rechnung, keine Funktionsgleichung im Text (der Graph IST die Angabe), keine Ableitungen",
    plot: true,
    varianten: [
      v("wert", "Funktionswert an einer Stelle ablesen", "Lies den Funktionswert an der Stelle x = 2 ab."),
      v("nullstelle", "Nullstelle ablesen", "Lies die größere Nullstelle ab."),
      v("steigung", "Steigung eines linearen Graphen ablesen", "Lies die Steigung der abgebildeten Geraden ab."),
      v("achse", "y-Achsenabschnitt ablesen", "Lies den y-Achsenabschnitt ab."),
    ],
  },

  /* ============================================================ SACHaufgaben == */

  prozent: {
    id: "prozent",
    was: "Prozentrechnung: prozentuale Erhöhung, prozentuale Senkung mit wechselnder Bezugsbasis, Grundwert, Prozentwert, Rabatt",
    beispiel: "Miete steigt von 200 € auf 225 € → 12,5 % teurer, aber 11,1 % billiger",
    nicht: "keine Zinsrechnung, keine Proportionalität, keine Gleichungen",
    varianten: [
      v("erhoehung", "prozentuale Erhöhung", "Die Miete steigt von 200 € auf 225 €. Um wie viel Prozent ist sie teurer geworden?"),
      v("senkung", "prozentuale Senkung, andere Bezugsbasis", "Die Miete steigt von 200 € auf 225 €. Um wie viel Prozent war sie vorher billiger?"),
      v("grundwert", "Grundwert gesucht", "Nach 20 % Rabatt kostet ein Gerät 96 €. Wie viel hat es vorher gekostet?"),
      v("mehrwert", "Mehrwertsteuer auf- oder abrechnen", "Ein Preis von 119 € enthält 19 % Mehrwertsteuer. Gib den Nettopreis an"),
      /* ловушка смены базиса: интуиция отвечает 0 %, честный счёт даёт 4 %.
         Форма из духа Aufgabe 7a, где один и тот же процент считают туда и
         обратно от РАЗНЫХ базисов. */
      v("falle-auf-ab", "проценты подряд: базис меняется после каждого шага", "Ein Preis steigt um 20 % und fällt danach um 20 %. Um wie viel Prozent liegt der neue Preis unter dem ursprünglichen?"),
    ],
  },

  proportion: {
    id: "proportion",
    was: "Proportionen: Dreisatz proportional und antiproportional, Maßstab, Mischungsverhältnis",
    beispiel: "30 l Benzin kosten 51 € → 50 l kosten 85 €",
    nicht: "keine Prozentrechnung, keine Gleichungen, keine Kombinatorik",
    varianten: [
      v("direkt", "Dreisatz proportional", "30 l Benzin kosten 51 €. Wie viel kosten 50 l?"),
      v("anti", "Dreisatz antiproportional", "3 Arbeiter brauchen 8 Tage. Wie viele Tage brauchen 4 Arbeiter?"),
      v("massstab", "Maßstab", "Eine Strecke von 4,5 cm auf einer Karte im Maßstab 1:20000 entspricht wie vielen Metern in der Wirklichkeit?"),
      v("mischung", "Mischungsverhältnis", "Es sollen 12 l einer Mischung im Verhältnis 3:1 entstehen. Wie viel Liter der ersten Komponente werden gebraucht?"),
      /* классические ловушки на чтение условия: интуиция отвечает мгновенно
         и мимо. Все считаются детерминированно, верификатор проверяет. */
      v("falle-maschinen", "машины-детали: оба фактора кратны — время не меняется", "5 Maschinen stellen in 5 Minuten 5 Maschinenteile her. Wie viele Minuten brauchen 100 Maschinen für 100 Maschinenteile?"),
      v("falle-sagen", "распил: разрезов на один меньше, чем частей", "Ein 2 m langes Brett wird in 4 gleich lange Teile gesägt. Jeder Sägeschnitt dauert 2 Minuten. Wie viele Minuten dauert das Sägen insgesamt?"),
      v("falle-schnecke", "шаг-процесс: в последний день сползания нет", "Eine Schnecke klettert tagsüber 3 m hoch und rutscht in der Nacht 2 m zurück. Der Brunnen ist 10 m tief. An welchem Tag kommt sie oben heraus?"),
      v("falle-durchschnitt", "средняя скорость по участкам: НЕ среднее арифметическое", "Die Hinfahrt geht mit 60 km/h, die Rückfahrt mit 40 km/h. Wie groß ist die Durchschnittsgeschwindigkeit der ganzen Fahrt?"),
    ],
  },

  zahlenraetsel: {
    id: "zahlenraetsel",
    was: "Zahlenrätsel: zwei Zahlen aus Summe, Differenz und Produkt bestimmen, Ziffern einer Zahl, Aufstellen eines Gleichungssystems aus Text",
    beispiel: "Produkt 256, Differenz 24 → (32; 8) oder (−8; −32)",
    nicht: "keine Prozentrechnung, keine Proportionen, keine Kombinatorik",
    varianten: [
      v("produktdiff", "Produkt und Differenz gegeben", "Das Produkt zweier Zahlen ist 256, ihre Differenz 24. Gib die größere der positiven Zahlen an"),
      v("summediff", "Summe und Differenz gegeben", "Die Summe zweier Zahlen ist 47, ihre Differenz 13. Gib die größere Zahl an"),
      v("summeprodukt", "Summe und Produkt gegeben", "Die Summe zweier Zahlen ist 12, ihr Produkt 35. Gib die größere Zahl an"),
      v("ziffern", "Ziffern einer zweistelligen Zahl", "Eine zweistellige Zahl ist viermal so groß wie ihre Quersumme und hat die Zifferndifferenz 3. Gib die Zahl an"),
      /* сумма и разница, где интуиция отвечает «10» — та самая задача из
         Cognitive Reflection Test; в рамках темы это честная форма
         «две числа из суммы и разницы» с коварными числами. */
      v("falle-schlaeger", "сумма и разница: числа подобраны под интуитивную ошибку", "Ein Schläger und ein Ball kosten zusammen 1,10 €. Der Schläger kostet 1 € mehr als der Ball. Wie viel Euro kostet der Ball?"),
      v("falle-seerose", "обратный счёт удвоений: половина срока минус один день", "Die Fläche eines Seerosenteppichs verdoppelt sich jeden Tag. Nach 48 Tagen ist der See ganz bedeckt. Nach wie vielen Tagen war er halb bedeckt?"),
    ],
  },

  kombinatorik: {
    id: "kombinatorik",
    was: "Kombinatorik: Permutation n!, Variation und Kombination ohne Wiederholung, Produktregel",
    beispiel: "5 verschiedene Autos auf 5 Parkplätze → 5! = 120",
    nicht: "keine Wahrscheinlichkeitsrechnung, keine Prozentrechnung, keine Gleichungen",
    varianten: [
      v("permutation", "Permutation, alle unterscheidbar", "Auf wie viele Arten lassen sich 5 verschiedene Autos auf 5 Parkplätze verteilen?"),
      v("variation", "Auswahl mit Reihenfolge", "Aus 8 Läufern werden Gold und Silber vergeben. Wie viele Möglichkeiten gibt es?"),
      v("kombination", "Auswahl ohne Reihenfolge", "Aus 6 Personen wird ein 2er-Team gebildet. Wie viele Möglichkeiten gibt es?"),
      v("produktregel", "Produktregel, mehrere unabhängige Entscheidungen", "Ein Menü besteht aus 3 Vorspeisen, 4 Hauptgerichten und 2 Nachspeisen. Wie viele verschiedene Menüs gibt es?"),
      /* принцип Дирихле: «минимальная гарантия», а не «вероятность» —
         большинство отвечает про вероятность и ошибается. */
      v("falle-schublade", "принцип Дирихле: минимальная гарантия", "In einer Schublade liegen 6 schwarze und 6 weiße Socken durcheinander. Wie viele Socken musst du mindestens herausnehmen, um sicher ein Paar gleicher Farbe zu haben?"),
    ],
  },

  /* ============================================================= KOMMINATIONEN ==
     Комбинации — то, из-за чего образцы бесполезны: на экзамене два закона
     встречаются в одной задаче. Здесь varianten описывают не тему, а СПОСОБ
     столкновения. */

  "k-bruch-wurzel": {
    id: "k-bruch-wurzel",
    was: "Bruch und Wurzel in einer Aufgabe: Wurzel aus einem Bruch, Bruch unter der Wurzel, Kürzen mit Wurzeln",
    beispiel: "√0,25/0,0256 · ∛(125/1000) = 25/16",
    nicht: "keine Logarithmen, keine Gleichungen",
    varianten: [
      v("wurzelbruch", "Wurzel aus einem Bruch", "Berechne: √(0,25/0,0256)"),
      v("kubik", "Bruch mal Kubikwurzel", "Berechne: √0,25 · ∛(125/1000)"),
      v("kuerzen", "Wurzel im Zähler und Nenner kürzen", "Berechne: (√50 · √8) : √2"),
    ],
  },

  "k-log-potenz": {
    id: "k-log-potenz",
    was: "Logarithmus und Potenz in einer Aufgabe: Potenzregel des Logarithmus mit Koeffizienten, ln und lg gemischt",
    beispiel: "2·ln(e³) − 0,5·ln(e⁴) = 4",
    nicht: "keine Logarithmusgleichungen, keine Exponentialgleichungen",
    varianten: [
      v("koeffizient", "Koeffizient vor dem Logarithmus als Exponent", "Berechne: 2·ln(e³) − 0,5·ln(e⁴)"),
      v("basis", "Wechsel zwischen lg und ln mit Potenzen", "Berechne: lg(10⁴) + ln(e²) : lg(100)"),
      v("gemischt", "Produkt-, Quotienten- und Potenzregel zusammen", "Berechne: lg 8 + lg 125 − 2·lg 10"),
    ],
  },

  "k-binom-bruch": {
    id: "k-binom-bruch",
    was: "Binomische Formel trifft Bruchterm: Differenz zweier Quadrate kürzen, Multiplikation zweier Bruchterme",
    beispiel: "((4a² − 9)/(49b² − 1)) : ((2a + 3)/(7b − 1)) · (7b + 1) = 2a − 3",
    nicht: "keine Bruchgleichungen, keine Polynomdivision",
    varianten: [
      v("diffquadrat", "Differenz zweier Quadrate kürzen", "Vereinfache (a² − 16) : (a + 4) und berechne den Wert für a = 6"),
      v("doppelbruch", "zwei Bruchterme dividieren", "Vereinfache ((4a² − 9)/(49b² − 1)) : ((2a + 3)/(7b − 1)) und berechne den Wert für a = 2, b = 1"),
      v("erweitern", "erweitern, dann kürzen", "Vereinfache ((x² − 9)/(x + 3)) · ((x + 3)/(x − 3)) und berechne den Wert für x = 5"),
    ],
  },

  "k-potenz-wurzel-param": {
    id: "k-potenz-wurzel-param",
    was: "Potenzgesetz, Wurzelgesetz und Parameter im Exponenten gleichzeitig",
    beispiel: "√(x^(m+1)) · x^(−2/n) : √(x^(4m−2)) = x^((n−m)/n)",
    nicht: "keine Gleichungen, keine Logarithmen",
    varianten: [
      v("wurzelparam", "Wurzel und Parameter im Exponenten", "Vereinfache √(x^(4m−2)) : x^(2m−1) und berechne den Wert für x = 4, m = 1"),
      v("negativparam", "negativer Parameter im Exponenten", "Vereinfache x^(−2/n) · x^(2/n) und berechne den Wert für x = 5, n = 3"),
      v("potpotparam", "Potenz einer Potenz mit Parameter", "(x^(m/n))^(2n) vereinfachen und den Wert für x = 2, m = 3, n = 1 berechnen"),
    ],
  },

  "k-binom-kubisch": {
    id: "k-binom-kubisch",
    was: "Kubische Binome und Klammerrechnung: (a − b)³, a³ − 3a²b + 3ab² − b³, Minus vor Klammer mit Binom",
    beispiel: "(a³ − 3a²b + 3ab² − b³) + (a − b)[(b − a) − (a − b)²] = −(a − b)²",
    nicht: "keine Polynomdivision, keine Bruchterme",
    varianten: [
      v("kubisch", "kubisches Binom ausmultiplizieren", "Berechne (a − b)³ für a = 5 und b = 2"),
      v("summe", "Summe aus kubischem Binom und Klammerterm", "Berechne (a³ − 3a²b + 3ab² − b³) + (a − b)[(b − a) − (a − b)²] für a = 4, b = 1"),
      v("minus", "Minus vor der Klammer mit Binom", "Berechne −(a − b)² + (a + b)² für a = 3, b = 2"),
    ],
  },

  "k-exponential-subst": {
    id: "k-exponential-subst",
    was: "Exponentialgleichung, die auf eine quadratische Gleichung führt: Substitution u = e^x oder u = 2^x",
    beispiel: "e^x + 2e^(−x) = 3 → u² − 3u + 2 = 0 → x = 0 oder x = ln 2",
    nicht: "keine reinen Potenzgesetze, keine Logarithmusgleichungen",
    varianten: [
      v("ex", "Substitution u = e^x", "Löse e^x + 2e^(−x) = 3. Gib die Summe der Lösungen an"),
      v("zweix", "Substitution u = 2^x", "Löse 4^x − 5·2^x + 4 = 0. Gib die Summe der Lösungen an"),
      v("quadrat", "Exponentialgleichung mit quadratischem Term", "Löse e^(2x) − 3e^x + 2 = 0. Gib die größere Lösung an"),
    ],
  },

  "k-bruch-quadratisch": {
    id: "k-bruch-quadratisch",
    was: "Bruchgleichung, die auf eine quadratische Gleichung führt: Hauptnenner, Definitionsmenge, Scheinlösungen",
    beispiel: "(x² − 3)/(−(x² − 1)) + (x + 1)/(x − 1) = 4/(x + 1) → L = {4}",
    nicht: "keine einfachen Bruchgleichungen ohne quadratischen Term",
    varianten: [
      v("hauptnenner", "Hauptnenner führt auf quadratisch", "Löse (x² − 3)/(−(x² − 1)) + (x + 1)/(x − 1) = 4/(x + 1). Gib die Summe der Lösungen an"),
      v("schein", "Scheinlösung ausschließen", "Löse x/(x − 2) = 4/(x − 2) + 2. Gib das Produkt der Lösungen an"),
      v("defmenge", "Definitionsmenge vor dem Lösen", "Löse 3/(x² − 4) = 1/(x − 2). Gib die Lösung an"),
    ],
  },
};

export const specOf = (id: string): Spec | undefined => SPECS[id];

/** сколько форм у узла — знаменатель для «проб» */
export const variantCount = (id: string): number => SPECS[id]?.varianten.length ?? 0;

/** id всех форм узла — по ним считается покрытие */
export const variantIds = (id: string): string[] => (SPECS[id]?.varianten ?? []).map((x) => x.id);
