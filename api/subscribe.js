// api/subscribe.js
const webpush = require('web-push');

const setVapid = () => {
  if (!process.env.VAPID_PUBLIC || !process.env.VAPID_PRIVATE) {
    throw new Error('VAPID env vars missing');
  }
  webpush.setVapidDetails('mailto:tu@correo', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });

  try {
    setVapid();
    // Send a test push immediately (no storage)
    const payload = JSON.stringify({ title: 'Astra Live', body: 'Suscripción recibida — prueba enviada' });
    await webpush.sendNotification(subscription, payload);
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('sendNotification error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
};
