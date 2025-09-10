const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('highlight -> analyze -> result flow', async ({ page }) => {
  // Build an HTML page that contains selectable text and the popup UI
  const popupHtml = fs.readFileSync(path.join(__dirname, '../../src/popup/index.html'), 'utf8');
  const content = `
    <html><body>
      <article id="article">This is a sample paragraph. Select this sentence for analysis.</article>
      <div id="popup-root">${popupHtml}</div>
    </body></html>
  `;

  await page.setContent(content);

  // Inject selection and popup scripts
  const selectionJs = fs.readFileSync(path.join(__dirname, '../../src/content-script/selection.js'), 'utf8');
  const popupJs = fs.readFileSync(path.join(__dirname, '../../src/popup/popup.js'), 'utf8');
  await page.addScriptTag({ content: selectionJs });
  await page.addScriptTag({ content: popupJs });

  // Install responder that mimics service worker analyzing and replying
  await page.evaluate(() => {
    window.addEventListener('message', (ev) => {
      const d = ev.data || {};
      if (d && d.source === 'smart-highlights-popup' && d.type === 'analyze') {
        // reply with a fake analysis result, using selected text for variety
        const text = d.text || '';
        window.postMessage({ source: 'smart-highlights-sw', id: d.id, result: { summary: 'Summary: ' + (text.slice(0, 20) || 'n/a'), explanation: 'Explained: ' + (text.slice(0, 40) || ''), translation: null } }, '*');
      }
    });
  });

  // Simulate a user selection in the article
  await page.evaluate(() => {
    const article = document.getElementById('article');
    const range = document.createRange();
    const start = article.firstChild; // text node
    range.setStart(start, 10);
    range.setEnd(start, 44);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });

  // Read selection via the injected content-script helper and trigger popup analysis
  await page.evaluate(async () => {
    const info = window.getSelection ? window.getSelection().toString() : '';
    // Use popup's request helper which posts a message
    await window.__requestAnalysis(info);
  });

  // Assert popup rendered the analysis
  await expect(page.locator('#summary')).toContainText('Summary:');
  await expect(page.locator('#explanation')).toContainText('Explained:');
});
