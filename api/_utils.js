// api/_utils.js
// Small helper utilities for Vercel Node serverless functions

const DEFAULT_VAPID = {
  publicKey: 'BPH9nGkYf3x8wO6zQ1Y2sXv4e9rK0hTqJzL6p8nQvR7sUeYtWcXyZ1a2bC3dE4fGhI5J6K7L8M9N0O',
  privateKey: 'wZxYvUtSrQpOnMlKjIhGfEdCbA9876543210lkjhgfdsaqwezxcvbnm1234567890AB'
};

function setCorsHeaders(req, res) {
  const ALLOWED = process.env.FRONTEND_ORIGIN || 'https://astra-live-frontend.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', ALLOWED);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body) return resolve(req.body); // Vercel/Next may already parse
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      if (!data) return resolve(undefined);
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
    req.on('error', err => reject(err));
  });
}

module.exports = { setCorsHeaders, handleOptions, parseJsonBody, DEFAULT_VAPID };
