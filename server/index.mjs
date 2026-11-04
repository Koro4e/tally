/* ============================================================================
   ЛОКАЛЬНЫЙ СЕРВЕР — только маршруты. Вся логика в server/core.mjs: тот же
   файл обслуживает api/*.mjs на Vercel, чтобы локально и в облаке вёл себя
   одинаково. Запуск: npm run server (порт 8787).
   ========================================================================== */
import { createServer } from "node:http";
import { existsSync, statSync, createReadStream } from "node:fs";
import { join, extname } from "node:path";
import {
  callModel, lehrCard, generateTask,
  json, readBody, sseHead, pipeStream,
  MODEL, KIOSAPI_KEY, KIOSAPI_BASE, VISION_MODEL,
  PORT, HOST, ROOT,
} from "./core.mjs";

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  /* CORS не выдаём сознательно: и прод (тот же origin :8787), и dev
     (vite-прокси) ходят same-origin. Открытый «*» разрешал бы любому
     сайту в браузере дёргать /api — то есть жечь квоту LLM от чужого
     имени. Сервер вдобавок слушает только 127.0.0.1 (см. listen ниже). */
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  try {
    /* Статика dist/ (на HF Space этот же сервер служит и фронтом; локально
       dist обычно нужен только для быстрой проверки прод-сборки).
       SPA-фолбэк: неизвестные пути → index.html. */
    if (
      req.method === "GET" &&
      !path.startsWith("/api/") &&
      existsSync(join(ROOT, "dist"))
    ) {
      let p = decodeURIComponent(path);
      if (p === "/") p = "/index.html";
      const dist = join(ROOT, "dist");
      const file = join(dist, p);
      if (
        file.startsWith(dist) &&
        existsSync(file) &&
        statSync(file).isFile()
      ) {
        const MIME = {
          ".html": "text/html; charset=utf-8", ".js": "text/javascript",
          ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
          ".json": "application/json", ".mp3": "audio/mpeg",
          ".ico": "image/x-icon", ".txt": "text/plain",
        };
        res.writeHead(200, {
          "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
          "Cache-Control": p.startsWith("/audio/") ? "public, max-age=604800" : "no-cache",
        });
        return createReadStream(file).pipe(res);
      }
      if (p !== "/index.html") {
        const idx = join(dist, "index.html");
        if (existsSync(idx)) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
          return createReadStream(idx).pipe(res);
        }
      }
    }

    if (path === "/api/health") {
      return json(res, 200, { ok: true, model: MODEL, ocr: Boolean(KIOSAPI_KEY) });
    }

    /* Фото→OCR: рукописное решение с листа → текст в поле ответа.
       Дальше обычная проверка isCorrect — подтверждение человеком уже
       внутри: распознанное попадает в РЕДАКТИРУЕМОЕ поле, не сразу в verdict. */
    if (path === "/api/ocr" && req.method === "POST") {
      if (!KIOSAPI_KEY) {
        return json(res, 501, { error: "KIOSAPI_KEY не задан — фото-режим отключён" });
      }
      const { image } = await readBody(req);
      if (!image || !image.startsWith("data:image/")) {
        return json(res, 400, { error: "нет изображения" });
      }
      const t0 = Date.now();
      /* nemotron-vl — reasoning-модель: при малом max_tokens «мысли» съедают
         весь лимит и content приходит пустым. 1500 токенов + один автоповтор
         (лимит kiosapi — 2 запроса/мин, второй заход укладывается). */
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

    if (path === "/api/task" && req.method === "POST") {
      const body = await readBody(req);
      const t0 = Date.now();
      const task = await generateTask(body);
      console.log(
        `[task] ${task.skill} за ${Date.now() - t0}ms, ${task.tokens} ток., via ${task.via}`,
      );
      return json(res, 200, task);
    }

    if (path === "/api/explain" && req.method === "POST") {
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

    if (path === "/api/chat" && req.method === "POST") {
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

    if (path === "/api/lehr" && req.method === "POST") {
      const body = await readBody(req);
      const t0 = Date.now();
      const card = await lehrCard(body);
      console.log(`[lehr] ${body.label} за ${Date.now() - t0}ms, ${card.tokens} ток., via ${card.via}`);
      return json(res, 200, card);
    }

    if (path === "/api/mastery" && req.method === "POST") {
      const body = await readBody(req);
      const log = Array.isArray(body.log) ? body.log.slice(0, 12) : [];
      const t0 = Date.now();
      const out = await judgeRound({
        skill: String(body.skill ?? ""),
        p: Number(body.p) || 0,
        log,
      });
      console.log(
        `[mastery] ${body.skill} p=${out.p.toFixed(2)} (bkt ${out.p_bkt.toFixed(2)}, ${out.urteil}) за ${Date.now() - t0}ms`,
      );
      return json(res, 200, out);
    }

    /* ------------------------------------------------------------ статика -- */
    if (req.method === "GET") {
      const dist = join(ROOT, "dist");
      const file = path === "/" ? join(dist, "index.html") : join(dist, path);
      if (existsSync(file)) {
        const data = await readFile(file);
        /* Без Cache-Control браузер применяет эвристическое кеширование и
           держит старый index.html сутками: приложение — один инлайн-файл,
           поэтому человек видит прошлую версию и не понимает, почему его
           правки не появились. Для локального приложения кеш не нужен. */
        res.writeHead(200, {
          "Content-Type": MIME[extname(file)] ?? "application/octet-stream",
          "Cache-Control": "no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        });
        return res.end(data);
      }
    }

    json(res, 404, { error: "not found" });
  } catch (e) {
    console.error("[err]", e.stack || e.message);
    if (!res.headersSent) json(res, 500, { error: e.message });
    else res.end();
  }
});

/* Локально — только 127.0.0.1: /api расходует квоту LLM, наружу слушать
   нельзя (проверка: `netstat -an | findstr 8787`). На хостинге (Render и т.п.)
   нужен 0.0.0.0 — там включаем явным HOST=0.0.0.0 в env, локально по
   умолчанию ничего не меняется. */
server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(`порт ${PORT} занят — либо уже запущен TALLY (это нормально), либо его держит другой процесс.`);
    process.exit(0);
  }
  throw err;
});
server.listen(PORT, HOST, () => {
  console.log(`TALLY API  http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}${HOST === "0.0.0.0" ? " (внешний хостинг, 0.0.0.0)" : " (только localhost)"}`);
  console.log(`model: ${MODEL}`);
});
