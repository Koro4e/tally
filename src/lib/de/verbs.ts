/* ============================================================================
   ГЛАГОЛЫ
   ----------------------------------------------------------------------------
   Почему таблица, а не модель. `abholen → hat abgeholt` — это не творческая
   задача, это словарная форма. Модель, которую просят «проспрягай abholen»,
   ошибается примерно в 3 случаях из 10 (и на `wäschst`, `lädst`, `vergisst`
   ошибается почти всегда), а таблица — никогда. Плюс ноль токенов и ноль
   задержки: упражнение появляется мгновенно и его можно делать в метро.

   Поля:
     inf   инфинитив
     pr    Präsens БЕЗ отделяемой приставки, шесть форм через пробел:
           ich · du · er/sie/es · wir · ihr · sie/Sie
     part  Partizip II (у отделяемых — уже вместе с приставкой: abgeholt)
     aux   "h" = haben, "s" = sein
     pre   отделяемая приставка (ab-, auf-, ein-…); нет поля — не отделяется
     praet Präteritum, 3-е лицо ед. ч. (без приставки)

   Приставки: be-, ge-, er-, ver-, zer-, ent-, emp-, miss- НЕ отделяются и
   не получают ge- в Partizip II (besucht, nicht *gebessucht). Это ровно то,
   на чём стоит задание 3.2 экзамена, поэтому такие глаголы в таблице есть.
   ========================================================================== */

export type V = {
  inf: string;
  pr: string;
  part: string;
  aux: "h" | "s";
  pre?: string;
  praet?: string;
};

const v = (
  inf: string,
  pr: string,
  part: string,
  aux: "h" | "s" = "h",
  pre?: string,
  praet?: string,
): V => ({ inf, pr, part, aux, pre, praet });

export const VERBS: V[] = [
  /* ------------------------------------------------------ правильные ---- */
  v("machen", "mache machst macht machen macht machen", "gemacht"),
  v("kochen", "koche kochst kocht kochen kocht kochen", "gekocht"),
  v("arbeiten", "arbeite arbeitest arbeitet arbeiten arbeitet arbeiten", "gearbeitet"),
  v("wohnen", "wohne wohnst wohnt wohnen wohnt wohnen", "gewohnt"),
  v("lernen", "lerne lernst lernt lernen lernt lernen", "gelernt"),
  v("spielen", "spiele spielst spielt spielen spielt spielen", "gespielt"),
  v("kaufen", "kaufe kaufst kauft kaufen kauft kaufen", "gekauft"),
  v("suchen", "suche suchst sucht suchen sucht suchen", "gesucht"),
  v("hören", "höre hörst hört hören hört hören", "gehört"),
  v("sagen", "sage sagst sagt sagen sagt sagen", "gesagt"),
  v("fragen", "frage fragst fragt fragen fragt fragen", "gefragt"),
  v("antworten", "antworte antwortest antwortet antworten antwortet antworten", "geantwortet"),
  v("brauchen", "brauche brauchst braucht brauchen braucht brauchen", "gebraucht"),
  v("öffnen", "öffne öffnest öffnet öffnen öffnet öffnen", "geöffnet"),
  v("warten", "warte wartest wartet warten wartet warten", "gewartet"),
  v("putzen", "putze putzt putzt putzen putzt putzen", "geputzt"),
  v("renovieren", "renoviere renovierst renoviert renovieren renoviert renovieren", "renoviert"),
  v("studieren", "studiere studierst studiert studieren studiert studieren", "studiert"),
  v("telefonieren", "telefoniere telefonierst telefoniert telefonieren telefoniert telefonieren", "telefoniert"),
  v("probieren", "probiere probierst probiert probieren probiert probieren", "probiert"),
  v("reparieren", "repariere reparierst repariert reparieren repariert reparieren", "repariert"),
  v("klingeln", "klingle klingelst klingelt klingeln klingelt klingeln", "geklingelt"),
  v("lächeln", "lächle lächelst lächelt lächeln lächelt lächeln", "gelächelt"),

  /* ------------------------------------------- неотделяемые приставки ---- */
  v("besuchen", "besuche besuchst besucht besuchen besucht besuchen", "besucht"),
  v("beenden", "beende beendest beendet beenden beendet beenden", "beendet", "h", undefined, "beendete"),
  v("erklären", "erkläre erklärst erklärt erklären erklärt erklären", "erklärt"),
  v("untersuchen", "untersuche untersuchst untersucht untersuchen untersucht untersuchen", "untersucht"),
  v("verstehen", "verstehe verstehst versteht verstehen versteht verstehen", "verstanden", "h", undefined, "verstand"),
  v("verkaufen", "verkaufe verkaufst verkauft verkaufen verkauft verkaufen", "verkauft"),
  v("bezahlen", "bezahle bezahlst bezahlt bezahlen bezahlt bezahlen", "bezahlt"),
  v("erzählen", "erzähle erzählst erzählt erzählen erzählt erzählen", "erzählt"),
  v("bekommen", "bekomme bekommst bekommt bekommen bekommt bekommen", "bekommen"),
  v("beginnen", "beginne beginnst beginnt beginnen beginnt beginnen", "begonnen"),
  v("verlieren", "verliere verlierst verliert verlieren verliert verlieren", "verloren"),
  v("vergessen", "vergesse vergisst vergisst vergessen vergesst vergessen", "vergessen"),
  v("besichtigen", "besichtige besichtigst besichtigt besichtigen besichtigt besichtigen", "besichtigt"),
  v("bestellen", "bestelle bestellst bestellt bestellen bestellt bestellen", "bestellt"),
  v("empfehlen", "empfehle empfiehlst empfiehlt empfehlen empfehlt empfehlen", "empfohlen"),

  /* ------------------------------------------------ отделяемые (trennbar) */
  v("abholen", "hole holst holt holen holt holen", "abgeholt", "h", "ab", "holte"),
  v("aufräumen", "räume räumst räumt räumen räumt räumen", "aufgeräumt", "h", "auf", "räumte"),
  v("abwaschen", "wasche wäschst wäscht waschen wascht waschen", "abgewaschen", "h", "ab", "wusch"),
  v("anrufen", "rufe rufst ruft rufen ruft rufen", "angerufen", "h", "an", "rief"),
  v("einkaufen", "kaufe kaufst kauft kaufen kauft kaufen", "eingekauft", "h", "ein", "kaufte"),
  v("aufstehen", "stehe stehst steht stehen steht stehen", "aufgestanden", "s", "auf", "stand"),
  v("einschlafen", "schlafe schläfst schläft schlafen schlaft schlafen", "eingeschlafen", "s", "ein", "schlief"),
  v("mitkommen", "komme kommst kommt kommen kommt kommen", "mitgekommen", "s", "mit", "kam"),
  v("aufmachen", "mache machst macht machen macht machen", "aufgemacht", "h", "auf", "machte"),
  v("zumachen", "mache machst macht machen macht machen", "zugemacht", "h", "zu", "machte"),
  v("fernsehen", "sehe siehst sieht sehen seht sehen", "ferngesehen", "h", "fern", "sah"),
  v("vorbereiten", "bereite bereitest bereitet bereiten bereitet bereiten", "vorbereitet", "h", "vor", "bereitete"),
  v("anfangen", "fange fängst fängt fangen fangt fangen", "angefangen", "h", "an", "fing"),
  v("aufhören", "höre hörst hört hören hört hören", "aufgehört", "h", "auf", "hörte"),
  v("mitbringen", "bringe bringst bringt bringen bringt bringen", "mitgebracht", "h", "mit", "brachte"),
  v("einladen", "lade lädst lädt laden ladet laden", "eingeladen", "h", "ein", "lud"),
  v("aussehen", "sehe siehst sieht sehen seht sehen", "ausgesehen", "h", "aus", "sah"),
  v("anziehen", "ziehe ziehst zieht ziehen zieht ziehen", "angezogen", "h", "an", "zog"),
  v("aufschreiben", "schreibe schreibst schreibt schreiben schreibt schreiben", "aufgeschrieben", "h", "auf", "schrieb"),
  v("mitnehmen", "nehme nimmst nimmt nehmen nehmt nehmen", "mitgenommen", "h", "mit", "nahm"),
  v("zurückkommen", "komme kommst kommt kommen kommt kommen", "zurückgekommen", "s", "zurück", "kam"),
  v("stattfinden", "finde findest findet finden findet finden", "stattgefunden", "h", "statt", "fand"),
  v("teilnehmen", "nehme nimmst nimmt nehmen nehmt nehmen", "teilgenommen", "h", "teil", "nahm"),
  v("kennenlernen", "lerne lernst lernt lernen lernt lernen", "kennengelernt", "h", "kennen", "lernte"),
  v("aufpassen", "passe passt passt passen passt passen", "aufgepasst", "h", "auf", "passte"),
  v("aussteigen", "steige steigst steigt steigen steigt steigen", "ausgestiegen", "s", "aus", "stieg"),
  v("einsteigen", "steige steigst steigt steigen steigt steigen", "eingestiegen", "s", "ein", "stieg"),
  v("umziehen", "ziehe ziehst zieht ziehen zieht ziehen", "umgezogen", "s", "um", "zog"),
  v("ankommen", "komme kommst kommt kommen kommt kommen", "angekommen", "s", "an", "kam"),
  v("abfahren", "fahre fährst fährt fahren fahrt fahren", "abgefahren", "s", "ab", "fuhr"),
  v("zuhören", "höre hörst hört hören hört hören", "zugehört", "h", "zu", "hörte"),

  /* ---------------------------------------------------- сильные глаголы -- */
  v("essen", "esse isst isst essen esst essen", "gegessen", "h", undefined, "aß"),
  v("trinken", "trinke trinkst trinkt trinken trinkt trinken", "getrunken", "h", undefined, "trank"),
  v("gehen", "gehe gehst geht gehen geht gehen", "gegangen", "s", undefined, "ging"),
  v("kommen", "komme kommst kommt kommen kommt kommen", "gekommen", "s", undefined, "kam"),
  v("fahren", "fahre fährst fährt fahren fahrt fahren", "gefahren", "s", undefined, "fuhr"),
  v("fliegen", "fliege fliegst fliegt fliegen fliegt fliegen", "geflogen", "s", undefined, "flog"),
  v("sehen", "sehe siehst sieht sehen seht sehen", "gesehen", "h", undefined, "sah"),
  v("lesen", "lese liest liest lesen lest lesen", "gelesen", "h", undefined, "las"),
  v("schreiben", "schreibe schreibst schreibt schreiben schreibt schreiben", "geschrieben", "h", undefined, "schrieb"),
  v("sprechen", "spreche sprichst spricht sprechen sprecht sprechen", "gesprochen", "h", undefined, "sprach"),
  v("nehmen", "nehme nimmst nimmt nehmen nehmt nehmen", "genommen", "h", undefined, "nahm"),
  v("geben", "gebe gibst gibt geben gebt geben", "gegeben", "h", undefined, "gab"),
  v("helfen", "helfe hilfst hilft helfen helft helfen", "geholfen", "h", undefined, "half"),
  v("treffen", "treffe triffst trifft treffen trefft treffen", "getroffen", "h", undefined, "traf"),
  v("finden", "finde findest findet finden findet finden", "gefunden", "h", undefined, "fand"),
  v("bleiben", "bleibe bleibst bleibt bleiben bleibt bleiben", "geblieben", "s", undefined, "blieb"),
  v("schlafen", "schlafe schläfst schläft schlafen schlaft schlafen", "geschlafen", "h", undefined, "schlief"),
  v("laufen", "laufe läufst läuft laufen lauft laufen", "gelaufen", "s", undefined, "lief"),
  v("singen", "singe singst singt singen singt singen", "gesungen", "h", undefined, "sang"),
  v("bringen", "bringe bringst bringt bringen bringt bringen", "gebracht", "h", undefined, "brachte"),
  v("denken", "denke denkst denkt denken denkt denken", "gedacht", "h", undefined, "dachte"),
  v("wissen", "weiß weißt weiß wissen wisst wissen", "gewusst", "h", undefined, "wusste"),
  v("tun", "tue tust tut tun tut tun", "getan", "h", undefined, "tat"),
  v("werden", "werde wirst wird werden werdet werden", "geworden", "s", undefined, "wurde"),
  v("sein", "bin bist ist sind seid sind", "gewesen", "s", undefined, "war"),
  v("haben", "habe hast hat haben habt haben", "gehabt", "h", undefined, "hatte"),
  v("mögen", "mag magst mag mögen mögt mögen", "gemocht", "h", undefined, "mochte"),
];

export const verbByInf = Object.fromEntries(VERBS.map((x) => [x.inf, x]));

/* ------------------------------------------------------------ склонение -- */

export const PERSONEN = [
  { de: "ich", ru: "я" },
  { de: "du", ru: "ты" },
  { de: "er", ru: "он" },
  { de: "wir", ru: "мы" },
  { de: "ihr", ru: "вы (мн.)" },
  { de: "sie", ru: "они" },
];

/** шесть форм Präsens */
export const prForms = (x: V): string[] => x.pr.split(" ");

/** Präsens нужной персональной формы; приставка при необходимости отходит в конец */
export function praesens(x: V, person: number, trennbar = true): { verb: string; pre: string } {
  const form = prForms(x)[person] ?? prForms(x)[2];
  return {
    verb: form,
    pre: trennbar && x.pre ? x.pre : "",
  };
}

const HABEN = ["habe", "hast", "hat", "haben", "habt", "haben"];
const SEIN = ["bin", "bist", "ist", "sind", "seid", "sind"];

/** вспомогательный глагол для Perfekt в нужном лице */
export const hilfsverb = (x: V, person: number): string =>
  x.aux === "s" ? SEIN[person] : HABEN[person];

const HATTEN = ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"];
const WAREN = ["war", "warst", "war", "waren", "wart", "waren"];

/** вспомогательный в Präteritum — для Plusquamperfekt. Отдельно от
    hilfsverb(), потому что тот отдаёт Präsens (habe/hast/hat…): подставив
    его после nachdem, упражнение учило бы «gekocht habe» вместо «gekocht
    hatte» — ровно та ошибка, ради которой тема существует. */
export const praetAux = (x: V, person: number): string =>
  x.aux === "s" ? WAREN[person] : HATTEN[person];

/** Partizip II в составе Perfekt: abholen → abgeholt */
export const partizip = (x: V): string => x.part;
