const { test, expect } = require('@playwright/test');

test('load simple page', async ({ page }) => {
  await page.setContent('<html><body><h1>Smart Highlights</h1></body></html>');
  await expect(page.locator('h1')).toHaveText('Smart Highlights');
});
