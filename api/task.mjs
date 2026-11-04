/* Генерация одной задачи: самую дорогую квоту защищаем лимитом на IP. */
import { json, readBody, generateTask, clientIp, rateLimit, json429 } from "../server/core.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "POST only" });
  /* 40/мин: раунд = 6 задач + перегенерации, обычному ученику хватает */
  const rl = rateLimit(`task:${clientIp(req)}`, 40, 60_000);
  if (!rl.ok) return json429(res, rl.retryAfter);
  const body = await readBody(req);
  const t0 = Date.now();
  const task = await generateTask(body);
  console.log(`[task] ${task.skill} за ${Date.now() - t0}ms, ${task.tokens} ток., via ${task.via}`);
  return json(res, 200, task);
}
