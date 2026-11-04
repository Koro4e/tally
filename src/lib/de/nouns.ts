/* ============================================================================
   СУЩЕСТВИТЕЛЬНЫЕ И ПАДЕЖИ
   ----------------------------------------------------------------------------
   Род, падеж и артикль — то, из-за чего проваливается задание 3.3
   (Relativpronomen). Человек, который не чувствует, что «der Parkplatz»
   в придаточном становится «der», а «den Anzug» — «den», не выучит
   относительные местоимения никаким количеством правил. Поэтому падежи
   живут отдельным узлом ниже по дереву, и упражнения идут на реальных
   словах, а не на «стол-ручка-окно».

   Формы артикля НЕ хранятся: они выводятся из рода и числа правилом.
   Хранить 4 падежа × 3 рода × 2 числа руками — гарантированные опечатки.
   ========================================================================== */

export type Genus = "der" | "die" | "das";

export type N = {
  /** именительный с артиклем: der Tisch */
  nom: string;
  genus: Genus;
  /** множественное число без артикля: Tische */
  pl: string;
  /** слабое склонение (der Junge → den Jungen) */
  weak?: boolean;
};

const n = (nom: string, pl: string, weak = false): N => ({
  nom,
  genus: nom.split(" ")[0] as Genus,
  pl,
  weak,
});

export const NOUNS: N[] = [
  /* ------------------------------------------------------------- der ---- */
  n("der Tisch", "Tische"),
  n("der Stuhl", "Stühle"),
  n("der Schrank", "Schränke"),
  n("der Apfel", "Äpfel"),
  n("der Hund", "Hunde"),
  n("der Baum", "Bäume"),
  n("der Garten", "Gärten"),
  n("der Lehrer", "Lehrer"),
  n("der Freund", "Freunde"),
  n("der Vater", "Väter"),
  n("der Bruder", "Brüder"),
  n("der Sohn", "Söhne"),
  n("der Wagen", "Wagen"),
  n("der Schlüssel", "Schlüssel"),
  n("der Bahnhof", "Bahnhöfe"),
  n("der Zug", "Züge"),
  n("der Bus", "Busse"),
  n("der Kuchen", "Kuchen"),
  n("der Saft", "Säfte"),
  n("der Fisch", "Fische"),
  n("der Salat", "Salate"),
  n("der Computer", "Computer"),
  n("der Roman", "Romane"),
  n("der Vertrag", "Verträge"),
  n("der Beruf", "Berufe"),
  n("der Platz", "Plätze"),
  n("der Park", "Parks"),
  n("der Abend", "Abende"),
  n("der Monat", "Monate"),
  n("der Winter", "Winter"),
  n("der Sommer", "Sommer"),
  n("der Regenschirm", "Regenschirme"),
  n("der Bleistift", "Bleistifte"),
  n("der Mantel", "Mäntel"),
  n("der Rock", "Röcke"),
  n("der Hut", "Hüte"),
  n("der Fuß", "Füße"),
  n("der Kopf", "Köpfe"),
  n("der Arm", "Arme"),
  n("der Tag", "Tage"),
  n("der Fehler", "Fehler"),
  n("der Preis", "Preise"),
  n("der Weg", "Wege"),
  n("der Film", "Filme"),
  n("der Koffer", "Koffer"),
  n("der Kühlschrank", "Kühlschränke"),
  n("der Drucker", "Drucker"),
  n("der Löffel", "Löffel"),
  n("der Teller", "Teller"),
  n("der Becher", "Becher"),

  /* ------------------------------------------------------------- die ---- */
  n("die Frau", "Frauen"),
  n("die Mutter", "Mütter"),
  n("die Schwester", "Schwestern"),
  n("die Tochter", "Töchter"),
  n("die Freundin", "Freundinnen"),
  n("die Lehrerin", "Lehrerinnen"),
  n("die Straße", "Straßen"),
  n("die Stadt", "Städte"),
  n("die Schule", "Schulen"),
  n("die Universität", "Universitäten"),
  n("die Wohnung", "Wohnungen"),
  n("die Küche", "Küchen"),
  n("die Tür", "Türen"),
  n("die Wand", "Wände"),
  n("die Tasche", "Taschen"),
  n("die Flasche", "Flaschen"),
  n("die Tasse", "Tassen"),
  n("die Zeitung", "Zeitungen"),
  n("die Zeitschrift", "Zeitschriften"),
  n("die Karte", "Karten"),
  n("die Lampe", "Lampen"),
  n("die Blume", "Blumen"),
  n("die Pflanze", "Pflanzen"),
  n("die Katze", "Katzen"),
  n("die Maus", "Mäuse"),
  n("die Suppe", "Suppen"),
  n("die Kartoffel", "Kartoffeln"),
  n("die Tomate", "Tomaten"),
  n("die Zwiebel", "Zwiebeln"),
  n("die Sprache", "Sprachen"),
  n("die Frage", "Fragen"),
  n("die Antwort", "Antworten"),
  n("die Arbeit", "Arbeiten"),
  n("die Aufgabe", "Aufgaben"),
  n("die Prüfung", "Prüfungen"),
  n("die Rechnung", "Rechnungen"),
  n("die Idee", "Ideen"),
  n("die Geschichte", "Geschichten"),
  n("die Bibliothek", "Bibliotheken"),
  n("die Fabrik", "Fabriken"),
  n("die Maschine", "Maschinen"),
  n("die Brille", "Brillen"),
  n("die Hose", "Hosen"),
  n("die Jacke", "Jacken"),
  n("die Hand", "Hände"),
  n("die Nase", "Nasen"),

  /* ------------------------------------------------------------- das ---- */
  n("das Haus", "Häuser"),
  n("das Zimmer", "Zimmer"),
  n("das Fenster", "Fenster"),
  n("das Bett", "Betten"),
  n("das Buch", "Bücher"),
  n("das Heft", "Hefte"),
  n("das Auto", "Autos"),
  n("das Fahrrad", "Fahrräder"),
  n("das Kind", "Kinder"),
  n("das Mädchen", "Mädchen"),
  n("das Brot", "Brote"),
  n("das Bier", "Biere"),
  n("das Ei", "Eier"),
  n("das Bild", "Bilder"),
  n("das Foto", "Fotos"),
  n("das Telefon", "Telefone"),
  n("das Handy", "Handys"),
  n("das Radio", "Radios"),
  n("das Regal", "Regale"),
  n("das Sofa", "Sofas"),
  n("das Messer", "Messer"),
  n("das Glas", "Gläser"),
  n("das Kleid", "Kleider"),
  n("das Hemd", "Hemden"),
  n("das Restaurant", "Restaurants"),
  n("das Hotel", "Hotels"),
  n("das Büro", "Büros"),
  n("das Krankenhaus", "Krankenhäuser"),
  n("das Theater", "Theater"),
  n("das Kino", "Kinos"),
  n("das Museum", "Museen"),
  n("das Meer", "Meere"),
  n("das Jahr", "Jahre"),
  n("das Wochenende", "Wochenenden"),
  n("das Frühstück", "Frühstücke"),
  n("das Geschenk", "Geschenke"),
  n("das Problem", "Probleme"),
  n("das Ergebnis", "Ergebnisse"),
  n("das Beispiel", "Beispiele"),

  /* --------------------------------------------- слабое склонение (n-Dekl) */
  n("der Junge", "Jungen", true),
  n("der Student", "Studenten", true),
  n("der Mensch", "Menschen", true),
  n("der Nachbar", "Nachbarn", true),
  n("der Kollege", "Kollegen", true),
  n("der Kunde", "Kunden", true),
  n("der Polizist", "Polizisten", true),
  n("der Tourist", "Touristen", true),
];

/** существительное без артикля: der Tisch → Tisch */
export const bare = (x: N): string => x.nom.split(" ").slice(1).join(" ");

/* ------------------------------------------------------------- падежи ---- */

export type Kasus = "nom" | "akk" | "dat" | "gen";

export const KASUS: { id: Kasus; de: string; ru: string; frage: string }[] = [
  { id: "nom", de: "Nominativ", ru: "именительный", frage: "wer? was?" },
  { id: "akk", de: "Akkusativ", ru: "винительный", frage: "wen? was?" },
  { id: "dat", de: "Dativ", ru: "дательный", frage: "wem?" },
  { id: "gen", de: "Genitiv", ru: "родительный", frage: "wessen?" },
];

const BEST: Record<Genus, Record<Kasus, string>> = {
  der: { nom: "der", akk: "den", dat: "dem", gen: "des" },
  die: { nom: "die", akk: "die", dat: "der", gen: "der" },
  das: { nom: "das", akk: "das", dat: "dem", gen: "des" },
};

/** определённый артикль в падеже; для множественного числа — отдельно */
export function bestimmter(x: N, k: Kasus, plural = false): string {
  if (plural) return k === "dat" ? "den" : k === "gen" ? "der" : "die";
  return BEST[x.genus][k];
}

/**
 * Существительное в падеже.
 * Genitiv: -(e)s у мужского и среднего (des Tisches, des Autos).
 * Dativ plural: +n, если слово не кончается на -n или -s (den Tischen).
 * n-Deklination: во всех падежах кроме Nominativ — +en.
 */
export function nomenForm(x: N, k: Kasus, plural = false): string {
  const base = bare(x);
  if (plural) {
    const p = x.pl;
    if (k === "dat") return /[ns]$/.test(p) ? p : p + "n";
    return p;
  }
  if (x.weak && k !== "nom") {
    return base.endsWith("e") ? base + "n" : base + "en";
  }
  if (k === "gen" && (x.genus === "der" || x.genus === "das")) {
    if (/(s|ß|z|x|ch)$/.test(base)) return base + "es";
    return base + "s";
  }
  return base;
}

/** полная группа: «den Tisch», «den Tischen» */
export function phrase(x: N, k: Kasus, plural = false): string {
  return `${bestimmter(x, k, plural)} ${nomenForm(x, k, plural)}`;
}
