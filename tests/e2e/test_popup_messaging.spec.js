const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('popup sends message and renders service-worker response', async ({ page }) => {
  const html = fs.readFileSync(path.join(__dirname, '../../src/popup/index.html'), 'utf8');
  const scriptTag = '<script src="popup.js"></script>';
  const doc = html.replace('<!-- INJECT_SCRIPT -->', scriptTag + '\n');

  await page.setContent(doc);
  const popupJs = fs.readFileSync(path.join(__dirname, '../../src/popup/popup.js'), 'utf8');
  await page.addScriptTag({ content: popupJs });

  // Attach an in-page responder that listens to postMessage and replies
  await page.evaluate(() => {
    window.addEventListener('message', (ev) => {
      const d = ev.data || {};
      if (d && d.source === 'smart-highlights-popup' && d.type === 'analyze') {
        // reply with expected structure
        window.postMessage({ source: 'smart-highlights-sw', id: d.id, result: { summary: 'SvcS', explanation: 'SvcE', translation: 'SvcT' } }, '*');
      }
    });
  });

  // call the request helper in page context
  await page.evaluate(() => window.__requestAnalysis('Hello from test'));

  await expect(page.locator('#summary')).toHaveText('SvcS');
  await expect(page.locator('#explanation')).toHaveText('SvcE');
  await expect(page.locator('#translation')).toHaveText('SvcT');
});
