/* Проверка немецкой ветки: путь → теория → раунд → разбор → итог. */
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:8787";

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  p.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text().slice(0, 140)));

  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(400);

  const opened = await p.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").trim() === "Deutsch");
    btn && btn.click();
    return !!btn;
  });
  await p.waitForTimeout(500);
  console.log("OPEN DEUTSCH:", opened);
  await p.screenshot({ path: "shots/50-de-weg.png" });

  const home = await p.evaluate(() => {
    const t = document.body.innerText;
    return {
      title: /Deutsch/.test(t),
      levels: ["A1", "A2", "B1", "B2", "C1"].filter((l) => t.includes(l)).length,
      hasNow: /JETZT DRAN/i.test(t),
      topics: [...document.querySelectorAll("button")].filter((x) => /·/.test(x.innerText || "")).length,
    };
  });
  console.log("DE HOME:", JSON.stringify(home));

  // A1 → Personalpronomen: корень дерева, открыт без гейта (04.11 гейты
  // между темами: запертые темы проверяются отдельной пробой, не здесь)
  await p.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").trim() === "A1");
    b && b.click();
  });
  await p.waitForTimeout(300);
  const clicked = await p.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((x) => /Personalpronomen/.test(x.innerText || ""));
    btn && btn.click();
    return !!btn;
  });
  await p.waitForTimeout(400);
  console.log("CLICK RELATIV:", clicked);

  const theory = await p.evaluate(() => {
    const t = document.body.innerText;
    return {
      hasRegel: /Nominativ/.test(t) && /Akkusativ/.test(t),
      hasTable: document.querySelectorAll("table").length,
      hasBeispiele: /Beispiele/i.test(t),
      hasFehler: /Typische Fehler/i.test(t),
      hasMerk: /Merken:/i.test(t),
      hasStart: /Jetzt üben/i.test(t),
    };
  });
  console.log("THEORY:", JSON.stringify(theory));
  await p.screenshot({ path: "shots/51-de-theorie.png" });

  // в раунд
  await p.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((x) => /Jetzt üben/i.test(x.textContent || ""));
    btn && btn.click();
  });
  await p.waitForTimeout(400);
  const drill = await p.evaluate(() => ({
    inputs: document.querySelectorAll("input").length,
    task: (document.querySelector(".card3d") || {}).innerText?.slice(0, 110) ?? null,
  }));
  console.log("DRILL:", JSON.stringify(drill));
  await p.screenshot({ path: "shots/52-de-runde.png" });

  // заведомо неверный ответ → должен показать разбор
  await p.evaluate(() => {
    document.querySelectorAll("input").forEach((i) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(i, "zzz");
      i.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });
  await p.waitForTimeout(150);
  await p.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((x) => /Prüfen/i.test(x.textContent || ""));
    btn && btn.click();
  });
  await p.waitForTimeout(300);
  const fb = await p.evaluate(() => {
    const t = document.body.innerText;
    return { bad: /Noch nicht/i.test(t), why: (t.match(/Noch nicht[\s\S]{0,140}/) || [""])[0].replace(/\s+/g, " ") };
  });
  console.log("FEEDBACK:", JSON.stringify(fb));
  await p.screenshot({ path: "shots/53-de-feedback.png" });

  // пройти весь раунд
  for (let k = 0; k < 6; k++) {
    const done = await p.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((x) => /^(Weiter|Fertig|Prüfen)$/i.test((x.textContent || "").trim()));
      if (!btn) return "none";
      btn.click();
      return btn.textContent.trim();
    });
    if (done === "none") break;
    await p.waitForTimeout(200);
    if (done === "Prüfen") {
      await p.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((x) => /^(Weiter|Fertig)$/i.test((x.textContent || "").trim()));
        btn && btn.click();
      });
      await p.waitForTimeout(200);
    }
    if (/Fertig/i.test(done)) {
      await p.waitForTimeout(300);
      break;
    }
  }
  await p.waitForTimeout(300);
  const fin = await p.evaluate(() => {
    const t = document.body.innerText;
    return { done: /\/\s*6/.test(t) || /Ещё раз/i.test(t), text: t.replace(/\s+/g, " ").slice(0, 120) };
  });
  console.log("FINAL:", JSON.stringify(fin));
  await p.screenshot({ path: "shots/54-de-fertig.png" });

  console.log("ERRORS:", errors.length ? JSON.stringify(errors.slice(0, 5)) : "none");
  await b.close();
})();
