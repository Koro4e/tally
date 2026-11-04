const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto("http://localhost:8787/", { waitUntil: "networkidle" });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  const t0 = Date.now();
  await p.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((x) =>
      /prüfung schreiben/i.test(x.textContent || ""),
    );
    btn && btn.click();
  });
  let last = -1;
  for (let i = 0; i < 120; i++) {
    await p.waitForTimeout(1000);
    const s = await p.evaluate(() => {
      const t = document.body.innerText;
      const m = t.match(/(\d+) \/ 7/);
      return { n: m ? +m[1] : -1, ready: /prüfung starten/i.test(t) };
    });
    if (s.n !== last) {
      console.log(`+${((Date.now() - t0) / 1000).toFixed(0)}s  ${s.n}/7`);
      last = s.n;
    }
    if (s.ready) {
      console.log(`READY in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      break;
    }
  }
  await p.screenshot({ path: "shots/35-exam-ready.png" });
  const info = await p.evaluate(() => {
    const t = document.body.innerText;
    return { start: /prüfung starten/i.test(t), fail: /zu wenige aufgaben/i.test(t) };
  });
  console.log("STATE:", JSON.stringify(info), "| errors:", errs.length ? errs : "none");
  await b.close();
})();
