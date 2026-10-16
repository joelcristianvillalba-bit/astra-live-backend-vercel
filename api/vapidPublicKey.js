// api/vapidPublicKey.js
const { setCorsHeaders, handleOptions, DEFAULT_VAPID } = require('./_utils');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);

  if (req.method !== 'GET') return res.status(405).end();
  const key = process.env.VAPID_PUBLIC || DEFAULT_VAPID.publicKey;
  if (!key) return res.status(500).json({ error: 'VAPID_PUBLIC not set' });
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ key }));
};
