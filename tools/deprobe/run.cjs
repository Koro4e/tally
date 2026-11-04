/* ============================================================================
   Сборка и запуск пробника генераторов (tools/deprobe).
   ----------------------------------------------------------------------------
   Бандлим probe-entry.ts через esbuild (он уже в node_modules как
   зависимость vite — новых зависимостей не ставим), затем require'им
   собранный файл: пробник сам печатает отчёт в stdout.

   Запуск из корня проекта:
     node tools/deprobe/run.cjs
   ========================================================================== */

const path = require("path");
const esbuild = require("esbuild");

const entry = path.join(__dirname, "probe-entry.ts");
const outfile = path.join(__dirname, "probe.cjs");

try {
  esbuild.buildSync({
    entryPoints: [entry],
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node18",
    outfile,
    /* алиас @ → src, чтобы сработали импорты вида "@/lib/de/gen" внутри gen.ts */
    alias: { "@": path.join(__dirname, "..", "..", "src") },
    logLevel: "silent",
  });
} catch (e) {
  console.error("ESBUILD FAILED:");
  console.error(e && e.errors ? JSON.stringify(e.errors, null, 2) : e);
  process.exit(1);
}

/* собранный пробник печатает отчёт и выставляет exitCode */
require(outfile);
