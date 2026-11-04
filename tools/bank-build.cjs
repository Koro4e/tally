/* ============================================================================
   ГЕНЕРАЦИЯ ОФЛАЙН-БАНКА ЗАДАЧ (tools/bank-build.cjs)
   ----------------------------------------------------------------------------
   Зачем: математика сейчас целиком зависит от живого LLM. Если 09.01.2027
   провайдеры лягут или протухнут ключи — Probeprüfung не соберётся вообще.
   Банк — единственная офлайн-страховка. Немецкая ветка уже офлайн (57
   детерминированных генераторов), математика должна стать такой же.

   Как работает:
     1. esbuild собирает specs.ts+skills.ts в JSON (спецификации и формы).
     2. Для каждой формы каждого узла скрипт просит у живого /api/task N
        задач (сервер сам генерирует и верифицирует — в банк попадают
        только прошедшие проверку).
     3. bank.json пишется ИНКРЕМЕНТАЛЬНО и запускается повторно без потерь:
        уже собранные формы (по числу задач в банке) пропускаются.

   Запуск: node tools/bank-build.cjs [--per 8] [--server http://127.0.0.1:8787]
   Файл кладётся в public/bank.json — vite копирует его в dist, в бандл
   он НЕ попадает (fetch при монтировании Tutor).
   ========================================================================== */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TMP = path.join(__dirname, "bank-tmp");
fs.mkdirSync(TMP, { recursive: true });

const ARG = (name, def) => {
  const i = process.argv.indexOf("--" + name);
  return i > -1 ? process.argv[i + 1] : def;
};
const PER = Math.max(1, Number(ARG("per", 8)));
const SERVER = ARG("server", "http://127.0.0.1:8787");

/* --------------------------------------------------- 1. спецификации ---- */

const entry = path.join(TMP, "specs-entry.ts");
fs.writeFileSync(
  entry,
  `import { SPECS } from "@/lib/specs";
const out: Record<string, unknown> = {};
for (const [id, s] of Object.entries(SPECS)) {
  out[id] = { id, de: s.de ?? id, was: s.was, nicht: s.nicht, beispiel: s.beispiel, varianten: s.varianten, plot: s.plot ?? false };
}
console.log(JSON.stringify(out));`,
);

/* de берём из skills.ts — там немецкое название узла; в specs его нет */
const entry2 = path.join(TMP, "skills-entry.ts");
fs.writeFileSync(
  entry2,
  `import { SKILLS } from "@/lib/skills";
const out: Record<string, { de: string; deps: string[] }> = {};
for (const s of SKILLS) out[s.id] = { de: s.de, deps: s.deps ?? [] };
console.log(JSON.stringify(out));`,
);

const esbuildJs = path.join(ROOT, "node_modules", "esbuild");
require(esbuildJs).buildSync({
  entryPoints: [entry, entry2],
  bundle: true,
  format: "cjs",
  platform: "node",
  outdir: TMP,
  alias: { "@": path.join(ROOT, "src") },
  logLevel: "silent",
});

const specs = JSON.parse(require("child_process").execSync(`node "${path.join(TMP, "specs-entry.js")}"`).toString());
const skills = JSON.parse(require("child_process").execSync(`node "${path.join(TMP, "skills-entry.js")}"`).toString());

/* ------------------------------------------------------- 2. банк-стейт -- */

const OUT = path.join(ROOT, "public", "bank.json");
const bank = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : [];
const have = new Map(); // "skill|variante" -> count
for (const t of bank) {
  const k = `${t.skill}|${t.variante ?? ""}`;
  have.set(k, (have.get(k) ?? 0) + 1);
}

const save = () => fs.writeFileSync(OUT, JSON.stringify(bank));

/* -------------------------------------------------------- 3. генерация -- */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Экзамен — не школьная контрольная. Хозяин прямо потребовал: детских задач
   в банке не должно быть. Поэтому два барьера:
   1. уровень генерации 4–5 (STUFE на сервере даёт многошаговые конструкции);
   2. фильтр примитивности: expr с единственной операцией («(-12)*(-9)»)
      в банк не попадает — такие навыки на экзамене живут внутри больших
      термов, и банка из одних одношаговых примеров не тренирует ничего. */
const MIN_LEVEL = 4;

const isTooSimple = (expr) => {
  if (!expr) return false; // графовые задачи expr не имеют — фильтр не трогаем
  const ops = (String(expr).match(/[+\-*/^]/g) ?? []).length;
  return ops < 2;
};

async function askOne(skillId, spec, variante, level) {
  for (let tryN = 0; tryN < 2; tryN++) {
    try {
      const r = await fetch(`${SERVER}/api/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: skills[skillId]?.de ?? skillId,
          deps: skills[skillId]?.deps ?? [],
          spec: { was: spec.was, beispiel: spec.beispiel, nicht: spec.nicht },
          variante,
          level,
          subject: "mathe",
          plot: spec.plot,
        }),
      });
      if (!r.ok) throw new Error(`http ${r.status}`);
      const t = await r.json();
      /* weak («ungeprüft») в банк не берём: смысл банка в том, что его
         содержимое верифицировано, а не «почти верифицировано». */
      if (t.weak) throw new Error("weak (expr без вычисления)");
      if (isTooSimple(t.expr)) throw new Error("too simple (одна операция)");
      return t;
    } catch (e) {
      if (tryN === 1) return null;
      await sleep(1500);
    }
  }
  return null;
}

/* Три воркера параллельно — ровно по ёмкости семафора сервера. Очередь
   общая, воркеры забирают формы по одному, банк дописывается по ходу. */
const queue = [];
for (const [id, spec] of Object.entries(specs)) {
  for (const v of spec.varianten ?? []) {
    const key = `${id}|${v.id}`;
    const missing = PER - (have.get(key) ?? 0);
    for (let i = 0; i < missing; i++) queue.push({ id, spec, variante: v, n: i });
  }
}

let done = 0;
let failed = 0;
const t0 = Date.now();
console.log(`форм в очереди: ${queue.length} (${PER} на форму, сервер ${SERVER})`);

async function worker(wid) {
  while (queue.length) {
    const job = queue.shift();
    if (!job) break;
    const level = MIN_LEVEL + (job.n % 2); // 4..5: экзаменационный уровень
    const t = await askOne(job.id, job.spec, job.variante, level);
    if (t) {
      const norm = String(t.prompt).replace(/\s+/g, " ").toLowerCase();
      if (bank.some((x) => String(x.prompt).replace(/\s+/g, " ").toLowerCase() === norm)) {
        process.stdout.write(`[=] ${job.id}/${job.variante.id} дубль промпта — мимо
`);
        continue;
      }
      bank.push({
        id: `${job.id}.${job.variante.id}.${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        skill: job.id,
        variante: job.variante.id,
        level,
        prompt: t.prompt,
        expr: t.expr ?? null,
        answer: t.answer,
        solution: t.solution,
        par: t.par,
        plot: t.plot ?? null,
      });
      save();
      done++;
      process.stdout.write(`[+] ${job.id}/${job.variante.id} (${done}, ${Math.round((Date.now() - t0) / 1000)}s)\n`);
    } else {
      failed++;
      process.stdout.write(`[-] ${job.id}/${job.variante.id} отказ (${failed})\n`);
      /* отказ формы возвращаем в конец очереди один раз — чтобы временный
         429 не съедал её навсегда; повторные отказы считаем окончательными */
      if (!job.retried) {
        job.retried = true;
        queue.push(job);
      }
    }
    await sleep(300);
  }
}

(async () => {
  await Promise.all([worker(1), worker(2), worker(3)]);
  save();
  console.log(`\nГОТОВО: ${done} добавлено, ${failed} отказов, всего в банке ${bank.length} → ${path.relative(ROOT, OUT)}`);
})();
