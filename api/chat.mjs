import { callModel, readBody, sseHead, pipeStream, clientIp, rateLimit, json429 } from "../server/core.mjs";

export default async function handler(req, res) {
  /* стрим на 1600 токенов — самый «дорогой» маршрут после task */
  const rl = rateLimit(`chat:${clientIp(req)}`, 10, 60_000);
  if (!rl.ok) return json429(res, rl.retryAfter);
  const { messages } = await readBody(req);
  sseHead(res);
  const up = await callModel({
    system:
      "Du bist ein Mathematiklehrer am Studienkolleg Schleswig-Holstein. Antworte auf Deutsch, knapp, mit konkreten Schritten. Keine Emojis. Wenn der Schüler auf Russisch fragt, antworte auf Russisch. KEIN LaTeX, keine Backslashes: schreibe Formeln direkt mit Unicode (2², log₂(x), √5, ·, −).",
    user: messages.map((m) => `${m.role}: ${m.content}`).join("\n\n"),
    stream: true,
    maxTokens: 1600,
    temperature: 0.5,
    reasoningEffort: "low",
  });
  return pipeStream(res, up);
}
