// api/vapidPublicKey.js
module.exports = (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  const key = process.env.VAPID_PUBLIC || '';
  if (!key) return res.status(500).json({ error: 'VAPID_PUBLIC not set' });
  res.json({ key });
};
