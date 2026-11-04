import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
const build = new Date();
const stamp =
  String(build.getDate()).padStart(2, "0") +
  "." +
  String(build.getMonth() + 1).padStart(2, "0") +
  " " +
  String(build.getHours()).padStart(2, "0") +
  ":" +
  String(build.getMinutes()).padStart(2, "0");

export default defineConfig({
  /* Метка сборки. Нужна ровно для одного: отличить «я смотрю старую
     страницу» от «я смотрю новую, но правки невидимы». Печатается в шапке. */
  define: { __BUILD__: JSON.stringify(stamp) },
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // ключ живёт только на сервере, в браузер не попадает
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
