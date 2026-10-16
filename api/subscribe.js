// api/subscribe.js
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

  let subscription;
  try {
    const body = await parseJsonBody(req);
    subscription = body || req.body;
  } catch (err) {
    console.error('Invalid JSON body', err);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });

  try {
    setVapid();
    const payload = JSON.stringify({ title: 'Astra Live', body: 'Suscripción recibida — prueba enviada' });
    await webpush.sendNotification(subscription, payload);
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('sendNotification error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
};
