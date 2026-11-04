import { json, readBody, judgeRound, clientIp, rateLimit, json429 } from "../server/core.mjs";

export default async function handler(req, res) {
  const rl = rateLimit(`mastery:${clientIp(req)}`, 40, 60_000);
  if (!rl.ok) return json429(res, rl.retryAfter);
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
