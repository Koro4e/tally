/* Фото→OCR: kiosapi vision (nemotron-vl). Cloudflare блокирует не-браузерные
   UA (1010) — браузерный UA обязателен. reasoning-модель может съесть
   max_tokens мыслями → content пуст → 1500 токенов + автоповтор. */
import { json, readBody, KIOSAPI_KEY, KIOSAPI_BASE, VISION_MODEL } from "../server/core.mjs";

export default async function handler(req, res) {
  if (!KIOSAPI_KEY) {
    return json(res, 501, { error: "KIOSAPI_KEY не задан — фото-режим отключён" });
  }
  const { image } = await readBody(req);
  if (!image || !image.startsWith("data:image/")) {
    return json(res, 400, { error: "нет изображения" });
  }
  const t0 = Date.now();
  const ocrOnce = async () => {
    const r = await fetch(`${KIOSAPI_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KIOSAPI_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Transcribe the mathematical content of this image exactly as written. One line per line. Keep unicode: − √ ² ³ · π ≥ ≤ ∈. Keep the decimal comma. No commentary, no LaTeX.",
              },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        max_tokens: 1500,
        temperature: 0,
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`kiosapi ${r.status}: ${t.slice(0, 160)}`);
    }
    const out = await r.json();
    return (out.choices?.[0]?.message?.content || "").trim();
  };
  let text = "";
  try {
    text = await ocrOnce();
    if (!text) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      text = await ocrOnce();
    }
  } catch (e) {
    return json(res, 502, { error: e instanceof Error ? e.message : "OCR не удался" });
  }
  console.log(`[ocr] ${Date.now() - t0}ms, ${text.length} симв.`);
  return json(res, 200, { text });
}
