// Backend diagnostics utilities
// Exports: checkBackend(url, options)
// Returns: { ok, status, statusText, latency, error, timedOut }

async function checkBackend(url, { timeout = 2000, method = 'POST', body = null, headers = {} } = {}) {
  const start = Date.now();
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  let timedOut = false;

  const timer = controller
    ? setTimeout(() => {
        timedOut = true;
        try {
          controller.abort();
        } catch (e) {
          // ignore
        }
      }, timeout)
    : null;

  try {
    const res = await fetch(url, {
      method,
      body,
      headers,
      signal: controller ? controller.signal : undefined,
    });

    const latency = Date.now() - start;
    if (timer) clearTimeout(timer);

    return {
      ok: res && res.ok === true,
      status: res && typeof res.status === 'number' ? res.status : null,
      statusText: res && res.statusText ? res.statusText : null,
      latency,
      error: null,
      timedOut: timedOut === true,
    };
  } catch (err) {
    if (timer) clearTimeout(timer);
    const latency = Date.now() - start;
    const isAbort = timedOut || (err && err.name === 'AbortError');
    return {
      ok: false,
      status: null,
      statusText: null,
      latency,
      error: err ? String(err.message || err) : 'unknown',
      timedOut: !!isAbort,
    };
  }
}

function isLocalBackend(url) {
  try {
    const u = new URL(url);
    const hostname = u.hostname;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.endsWith('.local')
    );
  } catch (e) {
    return false;
  }
}

export { checkBackend, isLocalBackend };
