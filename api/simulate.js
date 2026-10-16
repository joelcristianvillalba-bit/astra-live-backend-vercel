// api/simulate.js
const webpush = require('web-push');

const setVapid = () => {
  if (!process.env.VAPID_PUBLIC || !process.env.VAPID_PRIVATE) {
    throw new Error('VAPID env vars missing');
  }
  webpush.setVapidDetails('mailto:tu@correo', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { subscription } = req.body || {};

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Provide subscription in body to simulate (for easy setup)' });
  }

  try {
    setVapid();
    const payload = JSON.stringify({ title: 'Astra Live — Simulación', body: 'Notificación de prueba' });
    await webpush.sendNotification(subscription, payload);
    return res.json({ sent: true });
  } catch (err) {
    console.error('simulate error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
};
