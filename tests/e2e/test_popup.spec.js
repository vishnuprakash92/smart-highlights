const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('popup renders analysis result', async ({ page }) => {
  const html = fs.readFileSync(path.join(__dirname, '../../src/popup/index.html'), 'utf8');
  // Inject popup.js via script tag before loading
  const scriptTag = '<script src="popup.js"></script>';
  const doc = html.replace('<!-- INJECT_SCRIPT -->', scriptTag + '\n');

  // Serve the popup assets by setting content and evaluating popup.js from file
  await page.setContent(doc);
  // Load popup.js content
  const popupJs = fs.readFileSync(path.join(__dirname, '../../src/popup/popup.js'), 'utf8');
  await page.addScriptTag({ content: popupJs });

  // Simulate analyze result via exposed hook
  await page.evaluate(() => {
    window.__renderAnalysis({ summary: 'S', explanation: 'E', translation: 'T' });
  });

  await expect(page.locator('#summary')).toHaveText('S');
  await expect(page.locator('#explanation')).toHaveText('E');
  await expect(page.locator('#translation')).toHaveText('T');
});
