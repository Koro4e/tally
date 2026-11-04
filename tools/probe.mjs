/* ============================================================================
   ПРОБА КАЛИБРОВКИ
   ----------------------------------------------------------------------------
   node probe.mjs                 — все узлы по одной задаче (долго)
   node probe.mjs vorzeichen      — один узел, все его формы
   node probe.mjs vorzeichen potenz — одна форма

   Зачем: после каждой правки спецификаций надо глазами убедиться, что модель
   выдаёт ИМЕННО эту форму и не уезжает в соседнюю тему. Проверять вручную
   через браузер — 20 секунд на задачу и легко пропустить дрейф.

   Скрипт последовательный: параллельные запросы ловят 429.
   ========================================================================== */

const BASE = process.env.TALLY || "http://127.0.0.1:8787";

/* Node 22.18+ срезает типы сам, поэтому .ts читается напрямую — спецификации
   остаются в одном месте, без сборки и без копии. */
const { SPECS } = await import("../src/lib/specs.ts");

async function one(spec, variante) {
  const t0 = Date.now();
  const r = await fetch(`${BASE}/api/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      label: spec.id,
      level: 3,
      subject: "mathe",
      spec: { was: spec.was, beispiel: spec.beispiel, nicht: spec.nicht },
      variante,
      plot: spec.plot === true,
    }),
  });
  const ms = Date.now() - t0;
  if (!r.ok) {
    console.log(`  FAIL ${r.status} ${(await r.text()).slice(0, 120)}`);
    return null;
  }
  const t = await r.json();
  console.log(`  [${variante.id}] ${ms} ms · par ${t.par} s · versuche ${t.attempts}`);
  console.log(`    ${t.prompt.replace(/\n/g, " ⏎ ")}`);
  if (t.plot) {
    const p = t.plot;
    console.log(
      `    plot ${p.kind}: f(x) = ${p.fn}  окно [${p.xmin};${p.xmax}]×[${p.ymin};${p.ymax}]` +
        (p.at != null ? ` at=${p.at}` : "") +
        (p.span ? ` span=${p.span.join("..")}` : ""),
    );
  }
  console.log(`    = ${t.answer.join(" oder ")}   (expr: ${t.expr})`);
  return t;
}

const [, , onlyId, onlyVar] = process.argv;
const ids = onlyId ? [onlyId] : Object.keys(SPECS);

for (const id of ids) {
  const spec = SPECS[id];
  if (!spec) {
    console.error(`нет спецификации для ${id}`);
    continue;
  }
  console.log(`\n=== ${id} · ${spec.varianten.length} форм`);
  for (const v of spec.varianten) {
    if (onlyVar && v.id !== onlyVar) continue;
    await one(spec, v);
  }
}
