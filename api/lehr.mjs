import { json, readBody, lehrCard } from "../server/core.mjs";

export default async function handler(req, res) {
  const body = await readBody(req);
  const t0 = Date.now();
  const card = await lehrCard(body);
  console.log(`[lehr] ${body.label} за ${Date.now() - t0}ms, ${card.tokens} ток., via ${card.via}`);
  return json(res, 200, card);
}
