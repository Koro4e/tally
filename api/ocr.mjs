/* Фото→OCR: kiosapi vision (nemotron-vl). Логика — в core.mjs (единый
   источник с локальным сервером), здесь только лимит и обвязка. */
import { json, readBody, ocrText, clientIp, rateLimit, json429, KIOSAPI_KEY } from "../server/core.mjs";

export default async function handler(req, res) {
  if (!KIOSAPI_KEY) {
    return json(res, 501, { error: "KIOSAPI_KEY не задан — фото-режим отключён" });
  }
  const rl = rateLimit(`ocr:${clientIp(req)}`, 6, 60_000);
  if (!rl.ok) return json429(res, rl.retryAfter);
  if (req.method !== "POST") return json(res, 405, { error: "POST only" });

  let image;
  try {
    ({ image } = await readBody(req, { maxBytes: 6_000_000 }));
  } catch (e) {
    return json(res, e.message === "payload too large" ? 413 : 400, {
      error: e.message === "payload too large" ? "фото слишком большое (макс 6 МБ)" : "нет изображения",
    });
  }
  if (!image || !image.startsWith("data:image/")) {
    return json(res, 400, { error: "нет изображения" });
  }
  const t0 = Date.now();
  try {
    const text = await ocrText(image);
    console.log(`[ocr] ${Date.now() - t0}ms, ${text.length} симв.`);
    return json(res, 200, { text });
  } catch (e) {
    return json(res, 502, { error: e instanceof Error ? e.message : "OCR не удался" });
  }
}
