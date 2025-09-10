// Bridge content script: listens for window.postMessage from page and forwards to extension runtime
(function () {
  try {
    window.addEventListener('message', (ev) => {
      const d = ev.data || {};
      if (!d || d.source !== 'smart-highlights-popup') return;
      const id = d.id;
      const payload = { type: d.type, text: d.text };
      try {
        chrome.runtime.sendMessage(payload, (res) => {
          try {
            window.postMessage({ source: 'smart-highlights-sw', id, result: res }, '*');
          } catch (e) {
            // ignore
          }
        });
      } catch (e) {
        try {
          window.postMessage({ source: 'smart-highlights-sw', id, result: { ok: false, error: String(e) } }, '*');
        } catch (err) {}
      }
    });
  } catch (e) {
    // ignore
  }
})();
