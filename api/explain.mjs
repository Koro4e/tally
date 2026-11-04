import { callModel, readBody, sseHead, pipeStream } from "../server/core.mjs";

export default async function handler(req, res) {
  const { task, userAnswer } = await readBody(req);
  const user = `Aufgabe: ${task.prompt}
Richtige Antwort: ${task.answer.join(" oder ")}
Lösungsweg (verbindlich): ${task.solution}
Antwort des Schülers: ${userAnswer}`;
  sseHead(res);
  const up = await callModel({
    system: `Du bist Mathematiklehrer am Studienkolleg. Ein Schüler hat eine Aufgabe falsch gelöst.

Du erklärst den Lösungsweg, der oben als "verbindlich" steht. Rechne NICHT neu und erfinde keine anderen Zahlen — wenn du etwas nachrechnest, muss es zu diesem Weg passen. Die richtige Antwort ist oben genannt; sie ist geprüft.

Schreibe NUR die Erklärung. Verboten: Einleitung, Begrüßung, Analyse der Schülerantwort, Fragen an den Schüler, lautes Nachdenken, Wiederholung der Aufgabe, Emojis.

Format: maximal 4 Zeilen. Erste Zeile nennt den typischen Fehler in einem Satz. Danach die Schritte, die zum Ziel führen, je eine Zeile, mit "→".
Sprache: Deutsch.

KEIN LaTeX. Keine Backslashes, kein \( \), kein \cdot, kein \frac. Schreibe Formeln direkt: 2², log₂(9), √5, ·, −, ³.
Brüche im Exponenten immer in Klammern: x^(1/2), nicht x^1/2.`,
    user,
    stream: true,
    maxTokens: 500,
    temperature: 0.3,
    reasoningEffort: "low",
  });
  return pipeStream(res, up);
}
