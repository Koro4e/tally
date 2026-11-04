/* Проверка живого приложения: путь, Lehrgang, раунд, экзамен.
   Один скрипт вместо пачки одноразовых — его же гоняю после правок.
   Запуск: NODE_PATH=<...>/node_modules node verify.cjs */
const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:8787";
const SHOTS = "shots";

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text().slice(0, 160));
  });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  const home = await page.evaluate(() => {
    const t = document.body.innerText;
    return {
      hasPlan: /tagesplan/i.test(t),
      hasExam: /probepr/i.test(t),
      neu: (t.match(/tagesplan[\s\S]{0,70}/i) || [""])[0].replace(/\s+/g, " ").slice(0, 70),
      nodes: document.querySelectorAll("button[aria-label]").length,
    };
  });
  console.log("HOME:", JSON.stringify(home));
  await page.screenshot({ path: `${SHOTS}/30-weg.png` });

  /* --- открыть первый новый узел: должен появиться Lehrgang --- */
  const opened = await page.evaluate(() => {
    const b = document.querySelector('button[aria-label^="Vorzeichen"]');
    if (!b) return false;
    b.click();
    return true;
  });
  console.log("clicked Vorzeichen:", opened);

  let lehr = { shown: false };
  try {
    await page.waitForFunction(() => /warum das gilt/i.test(document.body.innerText), { timeout: 150000 });
    lehr = await page.evaluate(() => {
      const t = document.body.innerText;
      return {
        shown: true,
        hasFormel: /warum das gilt/i.test(t),
        hasFehler: /typische fehler/i.test(t),
        hasBeispiel: /beispiel/i.test(t),
        hasStart: /jetzt üben/i.test(t),
      };
    });
  } catch {
    lehr = { shown: false, text: (await page.evaluate(() => document.body.innerText)).slice(0, 200) };
  }
  console.log("LEHR:", JSON.stringify(lehr));
  await page.screenshot({ path: `${SHOTS}/31-lehr.png` });

  /* раскрыть все шаги примера */
  for (let i = 0; i < 6; i++) {
    const ok = await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) =>
        /schritt \d+ von \d+/i.test(x.textContent || ""),
      );
      if (b) {
        b.click();
        return true;
      }
      return false;
    });
    if (!ok) break;
    await page.waitForTimeout(120);
  }
  await page.screenshot({ path: `${SHOTS}/32-lehr-steps.png` });

  /* --- в раунд --- */
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) =>
      /jetzt üben/i.test(x.textContent || ""),
    );
    b && b.click();
  });
  await page.waitForSelector("#q-text", { timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(600);
  const drill = await page.evaluate(() => ({
    task: (document.getElementById("q-text") || {}).textContent?.slice(0, 90) ?? null,
    hasInput: !!document.getElementById("answer"),
  }));
  console.log("DRILL:", JSON.stringify(drill));
  await page.screenshot({ path: `${SHOTS}/33-drill.png` });

  /* --- экзамен: сборка --- */
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) =>
      /prüfung schreiben|nochmal schreiben/i.test(x.textContent || ""),
    );
    b && b.click();
  });
  await page.waitForTimeout(1500);
  const build0 = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 120));
  console.log("EXAM BUILD START:", JSON.stringify(build0));
  await page.screenshot({ path: `${SHOTS}/34-exam-build.png` });

  /* Второй аргумент waitForFunction — это arg для самой функции, а не опции.
     Раньше сюда передавался {timeout}, он молча уходил в page-функцию,
     действовал дефолтный таймаут 30 с — и проверка рапортовала «не собралось»
     на экзамене, который на самом деле ещё собирался (второй проход по
     graph-lesen). Отсюда и фантомный «progress 6». */
  const built = await page
    .waitForFunction(
      () => /prüfung starten|zu wenige aufgaben/i.test(document.body.innerText),
      null,
      { timeout: 300000 },
    )
    .then(() => true)
    .catch(() => false);
  const examInfo = await page.evaluate(() => {
    const t = document.body.innerText;
    const m = t.match(/(\d+) \/ 7/);
    return { start: /prüfung starten/i.test(t), progress: m ? m[1] : null };
  });
  console.log("EXAM BUILT:", JSON.stringify({ ...examInfo, built }));
  await page.screenshot({ path: `${SHOTS}/35-exam-ready.png` });

  if (examInfo.start) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) =>
        /prüfung starten/i.test(x.textContent || ""),
      );
      b && b.click();
    });
    await page.waitForSelector("#exam-answer", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(600);
    const run = await page.evaluate(() => ({
      timer: (document.body.innerText.match(/\b\d{2}:\d{2}\b/) || [])[0] ?? null,
      hasInput: !!document.getElementById("exam-answer"),
      verdictShown: /richtig|falsch/i.test(document.body.innerText),
    }));
    console.log("EXAM RUN:", JSON.stringify(run));
    await page.screenshot({ path: `${SHOTS}/36-exam-run.png` });
  }

  console.log("ERRORS:", errors.length ? JSON.stringify(errors.slice(0, 6), null, 1) : "none");
  await browser.close();
})();
