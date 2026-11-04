import { json, readBody, lehrCard, clientIp, rateLimit, json429 } from "../server/core.mjs";

export default async function handler(req, res) {
  const rl = rateLimit(`lehr:${clientIp(req)}`, 10, 60_000);
  if (!rl.ok) return json429(res, rl.retryAfter);
  const body = await readBody(req);
  const t0 = Date.now();
  const card = await lehrCard(body);
  console.log(`[lehr] ${body.label} за ${Date.now() - t0}ms, ${card.tokens} ток., via ${card.via}`);
  return json(res, 200, card);
}
