import { json, readBody, generateTask } from "../server/core.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "POST only" });
  const body = await readBody(req);
  const t0 = Date.now();
  const task = await generateTask(body);
  console.log(`[task] ${task.skill} за ${Date.now() - t0}ms, ${task.tokens} ток., via ${task.via}`);
  return json(res, 200, task);
}
