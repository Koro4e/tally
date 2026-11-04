import { json, MODEL, KIOSAPI_KEY } from "../server/core.mjs";

export default function handler(req, res) {
  return json(res, 200, { ok: true, model: MODEL, ocr: Boolean(KIOSAPI_KEY) });
}
