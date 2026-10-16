// api/simulate.js
const webpush = require('web-push');
const { setCorsHeaders, handleOptions, parseJsonBody, DEFAULT_VAPID } = require('./_utils');

function setVapid() {
  const publicKey = process.env.VAPID_PUBLIC || DEFAULT_VAPID.publicKey;
  const privateKey = process.env.VAPID_PRIVATE || DEFAULT_VAPID.privateKey;
  webpush.setVapidDetails('mailto:tu@correo', publicKey, privateKey);
}

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);

  if (req.method !== 'POST') return res.status(405).end();

  let body;
  try { body = await parseJsonBody(req); } catch (err) {
    console.error('Invalid JSON body', err);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const subscription = body && body.subscription;
  if (!subscription || !subscription.endpoint) {
    // No subscription provided: respond OK so frontend can operate without subscribe
    return res.json({ sent: false, note: 'No subscription provided; nothing to send. To test push, use /api/subscribe or provide a subscription in the request body.' });
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
