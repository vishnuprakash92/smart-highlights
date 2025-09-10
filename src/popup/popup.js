// Popup logic: render analysis result object {summary, explanation, translation}
function renderAnalysis(result) {
  const loading = document.getElementById('loading');
  const resultEl = document.getElementById('result');
  const summary = document.getElementById('summary');
  const explanation = document.getElementById('explanation');
  const translation = document.getElementById('translation');

  loading.style.display = 'none';
  resultEl.style.display = 'block';
  summary.textContent = result.summary || '';
  explanation.textContent = result.explanation || '';
  translation.textContent = result.translation || '';
}

// Expose a test hook to simulate an analysis result
window.__renderAnalysis = renderAnalysis;

// Send analysis request via service worker / runtime messaging.
// Falls back to window.postMessage based protocol when chrome.runtime is unavailable.
function sendAnalyzeRequest(text, { timeout = 5000 } = {}) {
  // prefer chrome.runtime.sendMessage when available
  if (typeof globalThis.chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.sendMessage === 'function') {
    // wait for service worker readiness flag (short poll). If not set within waitFor ms, continue anyway.
    const waitFor = 750; // ms
    const pollInterval = 75;
    const start = Date.now();
    const waitForSwReady = () =>
      new Promise((resolve) => {
        const check = () => {
          try {
            if (chrome && chrome.storage && chrome.storage.local) {
              chrome.storage.local.get(['swReady'], (items) => {
                if (items && items.swReady) return resolve(true);
                if (Date.now() - start > waitFor) return resolve(false);
                setTimeout(check, pollInterval);
              });
            } else {
              resolve(false);
            }
          } catch (e) {
            resolve(false);
          }
        };
        check();
      });

    return waitForSwReady().then(() => {
      // proceed with sendMessage with retries/backoff
      const maxRetries = 5;
      const baseDelay = 150; // ms

      return new Promise((resolve, reject) => {
        let attempts = 0;
        let finished = false;
        const overallTimer = setTimeout(() => {
          finished = true;
          reject(new Error('timeout'));
        }, timeout);

        const trySend = () => {
          if (finished) return;
          attempts += 1;
          try {
            chrome.runtime.sendMessage({ type: 'analyze', text }, (res) => {
              if (finished) return;
              if (chrome.runtime.lastError) {
                const msg = String(chrome.runtime.lastError.message || 'unknown');
                // If receiving end doesn't exist, retry a few times to allow SW to start
                if (/receiving end does not exist/i.test(msg) && attempts < maxRetries) {
                  const delay = baseDelay * Math.pow(2, attempts - 1);
                  setTimeout(trySend, delay);
                  return;
                }
                clearTimeout(overallTimer);
                finished = true;
                return reject(new Error(msg));
              }
              clearTimeout(overallTimer);
              finished = true;
              resolve(res);
            });
          } catch (e) {
            if (attempts < maxRetries) {
              const delay = baseDelay * Math.pow(2, attempts - 1);
              setTimeout(trySend, delay);
              return;
            }
            clearTimeout(overallTimer);
            finished = true;
            reject(e);
          }
        };

        trySend();
      });
    });
  }

  // fallback: use window.postMessage with a correlation id
  return new Promise((resolve, reject) => {
    const id = `sh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const onMessage = (ev) => {
      try {
        const d = ev.data || {};
        if (d && d.source === 'smart-highlights-sw' && d.id === id) {
          window.removeEventListener('message', onMessage);
          clearTimeout(to);
          resolve(d.result);
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('message', onMessage);
    window.postMessage({ source: 'smart-highlights-popup', id, type: 'analyze', text }, '*');

    const to = setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('timeout'));
    }, timeout);
    // clear the timeout on resolution is handled in onMessage via resolve
  });
}

// Wire request -> render: expose helper for tests and normal popup flow
window.__requestAnalysis = async function (text) {
  try {
    const res = await sendAnalyzeRequest(text);
    // If res contains result or is the result directly, normalize
    const result = res && res.result ? res.result : res;
    renderAnalysis(result || { summary: '', explanation: '', translation: null });
    return result;
  } catch (err) {
    renderAnalysis({ summary: '', explanation: String(err.message || err), translation: null });
    return null;
  }
};

// Also export for module consumers (if imported as module)
try {
  // eslint-disable-next-line no-undef
  if (typeof module !== 'undefined' && module.exports) module.exports.renderAnalysis = renderAnalysis;
} catch (e) {
  // ignore in browser
}
