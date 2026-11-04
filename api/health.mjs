import { json, MODEL, KIOSAPI_KEY, PROVIDERS, bankSize } from "../server/core.mjs";

export default async function handler(req, res) {
  return json(res, 200, {
    ok: true,
    model: MODEL,
    ocr: Boolean(KIOSAPI_KEY),
    providers: PROVIDERS.length,
    bank: await bankSize(),
  });
}
