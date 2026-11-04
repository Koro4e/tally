/* ============================================================================
   B2-SATZ: Partizipialkonstruktionen и «повышенные» Konnektoren
   ----------------------------------------------------------------------------
   Почему кадры именно такие.

   b2-partizipial. Рабочая форма темы — трансформация «причастный оборот ↔
   Relativsatz». Форму здесь НЕЛЬЗЯ вывести из таблиц, как Partizip II в A2:
   при развороте меняется структура всего предложения — деятель из von-группы
   становится подлежащим, спрягаемый глагол появляется заново (и его время
   зависит от смысла: одновременность → Präsens, предшествование → Perfekt),
   расширение оборота переезжает в придаточное. Один неверный шаг — и получается
   «das Buch, das hat er geschrieben». Поэтому каждая пара хранится явно и
   выверена глазами, обе формы лежат в кадре; генератор только выбирает
   направление. Ровно тот же принцип, что в UMZU: трансформация, а не выбор.

   b2-konnektoren-gehoben. sofern / falls / indem / sodass — придаточные союзы,
   механика та же, что в NEBENSATZ (глагол в конец, оба порядка верны), поэтому
   формат кадра повторяет NebensatzPair. Отличие: выбор союза здесь не задача
   (он в hint), задача — порядок слов и правильная перестройка главного
   предложения при выносе придаточного вперёд. indem хранится отдельно
   помеченным: это «каким образом», ученик обязан увидеть разницу с weil.

   Ответ — целое предложение, поэтому он занимает отдельную строку {0} после
   \n — как в nebensatz() из gen.ts.
   ========================================================================== */

import type { Theory } from "@/lib/de/theory";
import type { Item } from "@/lib/de/gen";

/* ============================================================================
   ТЕОРИЯ
   ========================================================================== */

export const THEORY_B2_SATZ: Record<string, Theory> = {
  "b2-partizipial": {
    regel:
      "Das Partizip I (Infinitiv + -d) ist aktiv und gleichzeitig: das singende Kind = das Kind, das singt. " +
      "Das Partizip II ist passiv oder zeitlich vorzeitig: das geschriebene Buch = das Buch, das geschrieben wurde. " +
      "Das erweiterte Attribut steht zwischen Artikel und Nomen; die Umkehrung ist ein Relativsatz mit dem Verb am Ende.",
    ru:
      "Причастный оборот — это сжатое придаточное. Partizip I (Infinitiv + -d) — актив и одновременность: " +
      "«поющий». Partizip II — пассив или завершённость: «написанный». Сам оборот стоит между артиклем и " +
      "существительным, как прилагательное, со всеми окончаниями прилагательного. " +
      "Разворот в Relativsatz — главный навык: причастие снова становится глаголом, и его время видно из смысла.",
    tabelle: {
      head: ["Form", "Attribut", "Relativsatz"],
      rows: [
        ["Partizip I", "das singende Kind", "das Kind, das singt"],
        ["Partizip I + Erweiterung", "der in Kiel wohnende Student", "der Student, der in Kiel wohnt"],
        ["Partizip II (Passiv)", "das geschriebene Buch", "das Buch, das geschrieben wurde"],
        ["Partizip II + von-Angabe", "das von ihm geschriebene Buch", "das Buch, das er geschrieben hat"],
      ],
    },
    beispiele: [
      {
        de: "Das von ihm geschriebene Buch ist ein Bestseller.",
        ru: "Написанная им книга — бестселлер. Оборот перед существительным, не после.",
      },
      {
        de: "Die auf den Bus wartende Frau ist meine Nachbarin.",
        ru: "Женщина, ждущая автобус, — моя соседка. wartend = «которая ждёт», Präsens.",
      },
      {
        de: "Das in Deutschland gekaufte Auto war teuer.",
        ru: "Купленная в Германии машина была дорогой. Деятель не назван → в Relativsatz пассив.",
      },
      {
        de: "Der Student, der in Kiel wohnt, spricht gut Deutsch.",
        ru: "Студент, который живёт в Киле, хорошо говорит по-немецки. Обратно: глагол уходит в причастие.",
      },
    ],
    fehler: [
      "Ставят оборот после существительного, как по-русски: «das Buch geschrieben von ihm» — атрибут стоит МЕЖДУ артиклем и существительным.",
      "Забывают окончание прилагательного у причастия: «das geschriebenes Buch», «der wohnend Student» — причастие склоняется как прилагательное.",
      "Путают Partizip I и II: «das geschlafene Kind» — Partizip II непереходных глаголов атрибутом не употребляется, нужно «das schlafende Kind».",
      "В Relativsatz ставят глагол на вторую позицию: «das Buch, das er hat geschrieben» — глагол уходит в конец: «das er geschrieben hat».",
      "Теряют приставку в Partizip II: aufmachen → «die gemachte Tür» вместо «die aufgemachte Tür».",
      "В Relayssatz после разворота забывают перестроить время: wartend — это Präsens (wartet), geschrieben — Perfekt/Passiv (hat geschrieben / wurde geschrieben), а не наоборот.",
    ],
    merk:
      "Partizip I = актив + одновременность («что делающий»). Partizip II = пассив или завершённость «что сделанный»). " +
      "Разворот: причастие → глагол в конце Relativsatz, расширение — перед глаголом.",
  },

  "b2-konnektoren-gehoben": {
    regel:
      "sofern und falls leiten einen Bedingungssatz ein (falls = für den Fall, sofern = unter der Bedingung). " +
      "indem gibt an, WIE etwas geschieht — das Mittel. sodass gibt die Folge an. " +
      "In allen vier Nebensätzen steht das konjugierte Verb am Ende; steht der Nebensatz vorn, beginnt der Hauptsatz mit dem Verb.",
    ru:
      "Четыре союза B2, механика та же, что у weil и wenn: глагол в конце, при переносе придаточного вперёд " +
      "главное начинается с глагола. Разница в значении: falls — «если, на случай если» (одно конкретное событие), " +
      "sofern — «при условии, что» (ограничение), indem — «тем что», отвечает на вопрос «каким образом?», " +
      "sodass — «так что», следствие. weil отвечает на «почему», поэтому вместо indem не годится.",
    tabelle: {
      head: ["Konnektor", "Bedeutung", "Frage", "Beispiel"],
      rows: [
        ["sofern", "при условии, что", "при каком условии?", "Wir fahren ans Meer, sofern das Wetter schön bleibt."],
        ["falls", "если (на случай)", "в каком случае?", "Falls es regnet, nehme ich den Schirm mit."],
        ["indem", "тем что (способ)", "каким образом?", "Er verbessert sein Deutsch, indem er Filme sieht."],
        ["sodass", "так что (следствие)", "с каким результатом?", "Es regnet, sodass wir zu Hause bleiben."],
      ],
    },
    beispiele: [
      {
        de: "Falls ich Hilfe brauche, rufe ich dich an.",
        ru: "Если мне понадобится помощь, я позвоню тебе. Придаточное впереди — главное начинается с глагола.",
      },
      {
        de: "Sie bleibt fit, indem sie jeden Morgen Sport macht.",
        ru: "Она остаётся в форме тем, что каждое утро занимается спортом. indem = каким образом.",
      },
      {
        de: "Er hat sehr fleißig gelernt, sodass er eine gute Note bekommt.",
        ru: "Он очень прилежно учился, так что получает хорошую оценку. sodass — результат.",
      },
      {
        de: "Sofern das Wetter schön bleibt, fahren wir ans Meer.",
        ru: "При условии, что погода будет хорошей, мы поедем на море. sofern мягче и ограниченнее, чем falls.",
      },
    ],
    fehler: [
      "Путают falls и wenn: falls — «на случай, если» (одно будущее событие), wenn — повторяющееся или общее условие.",
      "После sodass ставят глагол на вторую позицию: «sodass wir zu Hause bleiben» верно, «sodass bleiben wir zu Hause» — нет.",
      "Используют weil вместо indem: weil отвечает на «почему», indem — на «каким образом». «Er verbessert sein Deutsch, weil er Filme sieht» меняет смысл.",
      "Забывают, что при выносе придаточного вперёд главное начинается с глагола: «Falls es regnet, ich bleibe zu Hause» — неверно.",
      "Пишут «für sodass» — такого союза нет; следствие выражается только самим sodass.",
    ],
    merk:
      "Все четыре — союзы: спрягаемый глагол в конце придаточного. sofern/falls — условие, indem — способ (как?), sodass — следствие.",
  },
};

/* ============================================================================
   КАДРЫ: b2-partizipial
   ----------------------------------------------------------------------------
   attr — причастный оборот, rel — все верные Relativsätze (их может быть
   два: актив-перфект и пассив, потому что Partizip II само по себе времени
   не задаёт). Обе стороны пары хранятся явно: генератор ничего не строит,
   он только выбирает направление.
   ========================================================================== */

export type PartizipialFrame = {
  /** причастный оборот: «das von ihm geschriebene Buch» */
  attr: string;
  /** верные Relativsätze (обычно актив-перфект и/или пассив) */
  rel: string[];
  /** почему так — по-русски, точно */
  why: string;
};

export const PARTIZIPIAL: PartizipialFrame[] = [
  /* --------------------------- Partizip II: деятель назван (von-Angabe) -- */
  {
    attr: "das von ihm geschriebene Buch",
    rel: ["das Buch, das er geschrieben hat", "das Buch, das von ihm geschrieben wurde"],
    why:
      "Partizip II с пассивным значением: „von ihm geschrieben“ = «написанная им». В Relativsatz деятель " +
      "становится подлежащим: von ihm → er, глагол — в Perfekt aktiv: «das er geschrieben hat». " +
      "Возможен и пассив: «das von ihm geschrieben wurde». Оба верны.",
  },
  {
    attr: "die vom Vater reparierten Fahrräder",
    rel: ["die Fahrräder, die der Vater repariert hat", "die Fahrräder, die vom Vater repariert wurden"],
    why:
      "vom Vater = von dem Vater — деятель назван. В активе он становится подлежащим (der Vater repariert hat), " +
      "в пассиве остаётся von-группой. Оба варианта грамматически верны.",
  },
  {
    attr: "die von ihr eingeladenen Gäste",
    rel: ["die Gäste, die sie eingeladen hat", "die Gäste, die von ihr eingeladen wurden"],
    why:
      "von ihr → sie: деятель становится подлежащим, einladen — отделяемый глагол, Partizip II eingeladen " +
      "остаётся в конце Perfekt: «die sie eingeladen hat». Пассив: «die von ihr eingeladen wurden».",
  },
  {
    attr: "die von ihm aufgemachte Tür",
    rel: ["die Tür, die er aufgemacht hat"],
    why:
      "aufmachen — отделяемый: Partizip II aufgemacht, в Perfekt приставка уходит в конец: «die er aufgemacht hat». " +
      "von ihm → er — деятель становится подлежащим.",
  },
  /* ----------------------- Partizip II: деятель НЕ назван → пассив ------ */
  {
    attr: "das in Deutschland gekaufte Auto",
    rel: ["das Auto, das in Deutschland gekauft wurde", "das Auto, das man in Deutschland gekauft hat"],
    why:
      "Деятель в обороте не назван, поэтому в Relativsatz пассив: «gekauft wurde». Актив возможен только " +
      "с неопределённо-личным man: «das man in Deutschland gekauft hat». Оба верны.",
  },
  {
    attr: "das im Sommer verkaufte Haus",
    rel: ["das Haus, das im Sommer verkauft wurde", "das Haus, das man im Sommer verkauft hat"],
    why:
      "Продать дом сам себя не может — это пассивное значение: «verkauft wurde» или «das man … verkauft hat». " +
      "Актив с конкретным подлежащим здесь невозможен: деятель неизвестен.",
  },
  {
    attr: "das gestern bestellte Essen",
    rel: ["das Essen, das gestern bestellt wurde"],
    why:
      "Деятель не назван → пассив в Relativsatz: «bestellt wurde». Лучше заказать еду само не может, " +
      "а кто заказал — из оборота не видно; придумывать подлежащее нельзя, ответ один.",
  },
  {
    attr: "die gerade renovierte Wohnung",
    rel: ["die Wohnung, die gerade renoviert wird"],
    why:
      "„gerade“ показывает процесс прямо сейчас → Präsens Passiv: «renoviert wird». Perfekt не подходит: " +
      "ремонт ещё не завершён. Время причастия определяет контекст, а не таблица.",
  },
  /* --------------- Partizip I: актив и одновременность → Präsens aktiv -- */
  {
    attr: "das laute singende Kind",
    rel: ["das Kind, das laut singt"],
    why:
      "Partizip I = актив + одновременность: singend = «которое поёт», Präsens. Расширение laut переезжает " +
      "в придаточное и стоит перед глаголом: «das laut singt».",
  },
  {
    attr: "der in Kiel wohnende Student",
    rel: ["der Student, der in Kiel wohnt"],
    why:
      "wohnend = «который живёт». Partizip I всегда одновременность, поэтому в Relativsatz Präsens aktiv, " +
      "глагол в конце: «der in Kiel wohnt».",
  },
  {
    attr: "die auf den Bus wartende Frau",
    rel: ["die Frau, die auf den Bus wartet"],
    why:
      "warten auf + Akkusativ: расширение auf den Bus целиком уходит в придаточное, причастие wartend " +
      "становится глаголом wartet — Präsens, глагол в конце.",
  },
  {
    attr: "der schlafende Hund",
    rel: ["der Hund, der schläft"],
    why:
      "schlafend = «который спит». schlafen — непереходный глагол, пассива здесь быть не может: " +
      "только Partizip I и Präsens в Relativsatz.",
  },
  {
    attr: "die gut Deutsch sprechende Touristin",
    rel: ["die Touristin, die gut Deutsch spricht"],
    why:
      "sprechend = «которая говорит». Расширение gut Deutsch стоит в придаточном перед глаголом: " +
      "«die gut Deutsch spricht». Окончание -e у причастия — женский род, Nominativ.",
  },
  {
    attr: "das viel lesende Mädchen",
    rel: ["das Mädchen, das viel liest"],
    why:
      "lesend = «которое читает». viel — расширение, в придаточном перед глаголом. Читает оно " +
      "одновременно с действием главного предложения → Präsens, не Perfekt.",
  },
];

/* ============================================================================
   КАДРЫ: b2-konnektoren-gehoben
   ----------------------------------------------------------------------------
   Тот же формат, что NebensatzPair в data.ts: два простых предложения,
   союз и оба порядка в answers (придаточное позади / впереди).
   ========================================================================== */

export type KonjGehobenPair = { a: string; b: string; konj: string; answers: string[] };

export const KONJ_GEHOBEN: KonjGehobenPair[] = [
  /* --------------------------------------------------------------- sofern -- */
  {
    a: "Wir fahren ans Meer.",
    b: "Das Wetter bleibt schön.",
    konj: "sofern",
    answers: [
      "Wir fahren ans Meer, sofern das Wetter schön bleibt.",
      "Sofern das Wetter schön bleibt, fahren wir ans Meer.",
    ],
  },
  {
    a: "Ich komme zur Party.",
    b: "Ich habe Zeit.",
    konj: "sofern",
    answers: [
      "Ich komme zur Party, sofern ich Zeit habe.",
      "Sofern ich Zeit habe, komme ich zur Party.",
    ],
  },
  {
    a: "Ich gehe spazieren.",
    b: "Es regnet nicht.",
    konj: "sofern",
    answers: [
      "Ich gehe spazieren, sofern es nicht regnet.",
      "Sofern es nicht regnet, gehe ich spazieren.",
    ],
  },
  /* ---------------------------------------------------------------- falls -- */
  {
    a: "Ich rufe dich an.",
    b: "Ich brauche deine Hilfe.",
    konj: "falls",
    answers: [
      "Ich rufe dich an, falls ich deine Hilfe brauche.",
      "Falls ich deine Hilfe brauche, rufe ich dich an.",
    ],
  },
  {
    a: "Ich nehme den Regenschirm mit.",
    b: "Es regnet.",
    konj: "falls",
    answers: [
      "Ich nehme den Regenschirm mit, falls es regnet.",
      "Falls es regnet, nehme ich den Regenschirm mit.",
    ],
  },
  {
    a: "Du kannst mich jederzeit besuchen.",
    b: "Du bist in Berlin.",
    konj: "falls",
    answers: [
      "Du kannst mich jederzeit besuchen, falls du in Berlin bist.",
      "Falls du in Berlin bist, kannst du mich jederzeit besuchen.",
    ],
  },
  {
    a: "Wir essen drinnen.",
    b: "Es ist kalt draußen.",
    konj: "falls",
    answers: [
      "Wir essen drinnen, falls es draußen kalt ist.",
      "Falls es draußen kalt ist, essen wir drinnen.",
    ],
  },
  /* ---------------------------------------------------------------- indem --
     «каким образом»: второе предложение — СРЕДСТВО, а не причина. */
  {
    a: "Er verbessert sein Deutsch.",
    b: "Er sieht jeden Abend deutsche Filme.",
    konj: "indem",
    answers: [
      "Er verbessert sein Deutsch, indem er jeden Abend deutsche Filme sieht.",
      "Indem er jeden Abend deutsche Filme sieht, verbessert er sein Deutsch.",
    ],
  },
  {
    a: "Sie bleibt fit.",
    b: "Sie macht jeden Morgen Sport.",
    konj: "indem",
    answers: [
      "Sie bleibt fit, indem sie jeden Morgen Sport macht.",
      "Indem sie jeden Morgen Sport macht, bleibt sie fit.",
    ],
  },
  {
    a: "Du hilfst der Umwelt.",
    b: "Du fährst öfter mit dem Fahrrad.",
    konj: "indem",
    answers: [
      "Du hilfst der Umwelt, indem du öfter mit dem Fahrrad fährst.",
      "Indem du öfter mit dem Fahrrad fährst, hilfst du der Umwelt.",
    ],
  },
  {
    a: "Ich verbessere meinen Wortschatz.",
    b: "Ich lese deutsche Zeitungen.",
    konj: "indem",
    answers: [
      "Ich verbessere meinen Wortschatz, indem ich deutsche Zeitungen lese.",
      "Indem ich deutsche Zeitungen lese, verbessere ich meinen Wortschatz.",
    ],
  },
  /* --------------------------------------------------------------- sodass --
     Следствие. Вынос придаточного с sodass вперёд грамматически верен,
     но стилистически редок — поэтому он в answers (проверка принимает),
     а в why стоит честная пометка. */
  {
    a: "Es regnet stark.",
    b: "Wir bleiben zu Hause.",
    konj: "sodass",
    answers: [
      "Es regnet stark, sodass wir zu Hause bleiben.",
      "Sodass wir zu Hause bleiben, regnet es stark.",
    ],
  },
  {
    a: "Er hat sehr fleißig gelernt.",
    b: "Er bekommt eine gute Note.",
    konj: "sodass",
    answers: [
      "Er hat sehr fleißig gelernt, sodass er eine gute Note bekommt.",
      "Sodass er eine gute Note bekommt, hat er sehr fleißig gelernt.",
    ],
  },
  {
    a: "Wir nehmen ein Taxi.",
    b: "Wir kommen pünktlich.",
    konj: "sodass",
    answers: [
      "Wir nehmen ein Taxi, sodass wir pünktlich kommen.",
      "Sodass wir pünktlich kommen, nehmen wir ein Taxi.",
    ],
  },
];

/* ============================================================================
   ГЕНЕРАТОРЫ
   ========================================================================== */

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/* ------------------------------------------------------ b2-partizipial ---
   Направление выбирается случайно: оборот → Relativsatz и обратно.
   В обоих случаях ответ детерминирован, потому что вся пара лежит в кадре. */

function partizipial(): Item {
  const f = pick(PARTIZIPIAL);
  const toRel = Math.random() < 0.55;
  return toRel
    ? {
        topic: "b2-partizipial",
        task:
          "Forme das Partizipialattribut in einen Relativsatz um. Причастие снова становится глаголом — в конце придаточного.",
        /* карточка «оборот → {0}»: текст — именная группа, не предложение */
        text: `${f.attr} → {0}`,
        gaps: [f.rel],
        why: f.why,
      }
    : {
        topic: "b2-partizipial",
        task:
          "Forme den Relativsatz in ein Partizipialattribut um. Причастие стоит между артиклем и существительным, глагол исчезает.",
        text: `${f.rel[0]} → {0}`,
        hint: "(Partizip I oder Partizip II)",
        gaps: [[f.attr]],
        why:
          f.why +
          " Обратно: спрягаемый глагол уходит в причастие (Partizip I при одновременности, Partizip II при пассиве), " +
          "расширения ставятся перед причастием, и всё вместе встаёт между артиклем и существительным.",
      };
}

/* ---------------------------------------------- b2-konnektoren-gehoben ---
   Союз показан в hint — упражнение про порядок слов и смысл союза,
   не про угадывание. Оба порядка лежат в кадре и принимаются. */

const BEDEUTUNG: Record<string, string> = {
  sofern: "«при условии, что» — ограничительное условие",
  falls: "«если, на случай если» — одно конкретное событие",
  indem: "«тем что» — каким образом выполняется действие, средство",
  sodass: "«так что» — следствие первого предложения",
};

function konnektorenGehoben(): Item {
  const f = pick(KONJ_GEHOBEN);
  const erstVorn = Math.random() < 0.5;
  return {
    topic: "b2-konnektoren-gehoben",
    task: `Verbinde die beiden Sätze mit «${f.konj}». Глагол — в конце придаточного.`,
    text: `${f.a} / ${f.b}\n{0}`,
    hint: `(${f.konj} — ${BEDEUTUNG[f.konj]})`,
    gaps: [f.answers],
    why:
      `«${f.konj}» — ${BEDEUTUNG[f.konj]}. В придаточном спрягаемый глагол уходит в конец. ` +
      `Оба порядка верны: «${f.answers[0]}» и «${f.answers[1]}».` +
      (f.konj === "sodass"
        ? " Так как sodass — следствие, придаточное обычно стоит после главного; вынос вперёд грамматически верен, но редок."
        : f.konj === "indem"
          ? " Не путай с weil: weil отвечает на «почему», indem — на «каким образом»."
          : f.konj === "falls"
            ? " falls — «на случай если» (одно будущее событие); повторяющееся условие — wenn."
            : ""),
  };
}

export { partizipial, konnektorenGehoben };
