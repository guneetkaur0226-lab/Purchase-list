// GET  /api/data  -> returns all suppliers (public)
// POST /api/data  -> saves all suppliers (needs x-password header)
const seed = require('./_seed.json');
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'supplier-prices';

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL_ || !TOKEN) return res.status(500).json({ error: 'Database not connected' });
  try {
    if (req.method === 'GET') {
      const raw = await redis(['GET', KEY]);
      return res.status(200).json(raw ? JSON.parse(raw) : seed);
    }
    if (req.method === 'POST') {
      if (!process.env.EDIT_PASSWORD || req.headers['x-password'] !== process.env.EDIT_PASSWORD)
        return res.status(401).json({ error: 'Wrong password' });
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body && body.check) return res.status(200).json({ ok: true });
      if (!body || !Array.isArray(body.suppliers)) return res.status(400).json({ error: 'Bad data' });
      await redis(['SET', KEY, JSON.stringify({ suppliers: body.suppliers })]);
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
