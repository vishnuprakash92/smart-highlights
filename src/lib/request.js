import storage from './storage.js';
import { checkBackend } from './backend.js';

// Send analysis request to configured backend and return JSON result or diagnostics
async function requestAnalysis(text, { timeout = 5000, headers = {}, ...opts } = {}) {
  const cfg = await storage.get({ backendUrl: 'http://localhost:8080/analyze', mode: 'local' });
  const url = cfg.backendUrl;

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeout) : null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify({ text, options: opts }),
      signal: controller ? controller.signal : undefined,
    });
    if (timer) clearTimeout(timer);
    const json = await res.json();
    return { ok: res.ok === true, status: res.status || null, result: json };
  } catch (err) {
    if (timer) clearTimeout(timer);
    const diag = await checkBackend(url, { timeout });
    return { ok: false, error: err ? String(err.message || err) : 'unknown', diag };
  }
}

export { requestAnalysis };
