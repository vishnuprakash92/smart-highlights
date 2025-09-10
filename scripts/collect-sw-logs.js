const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const extPath = path.resolve(__dirname, '..');
  console.log('Extension path:', extPath);

  const userDataDir = path.join('/tmp', 'sh-playwright-profile-' + Date.now());
  try {
    // Ensure profile dir
    fs.mkdirSync(userDataDir, { recursive: true });
  } catch (e) {}

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false, // show browser so SW can register
    args: [
      `--disable-extensions-except=${extPath}`,
      `--load-extension=${extPath}`,
      '--no-sandbox',
    ],
  });

  console.log('Browser launched. Waiting for service workers...');

  // Poll for service workers
  let sws = context.serviceWorkers();
  const start = Date.now();
  while (sws.length === 0 && Date.now() - start < 15000) {
    await new Promise((r) => setTimeout(r, 200));
    sws = context.serviceWorkers();
  }

  if (sws.length === 0) {
    console.error('No service workers found.');
  } else {
    console.log('Found service workers:', sws.length);
    sws.forEach((worker, idx) => {
      console.log('Service worker url:', worker.url());
      worker.on('console', (msg) => {
        try {
          console.log(`[SW-${idx}] console.${msg.type()}:`, msg.text());
        } catch (e) {
          console.log(`[SW-${idx}] console: (error reading message)`);
        }
      });
      worker.on('close', () => console.log(`[SW-${idx}] closed`));
    });
    // Enable devMode in the SW so the handler returns mock responses for the browser test
    try {
      const w = sws[0];
      // set storage.devMode = true inside service worker
      await w.evaluate(() => {
        try {
          chrome && chrome.storage && chrome.storage.local && chrome.storage.local.set({ devMode: true });
        } catch (e) {
          // ignore
        }
      });
      console.log('Requested SW to enable devMode via chrome.storage');
    } catch (e) {
      console.log('Could not set devMode in SW:', e && e.message ? e.message : e);
    }
  }

  // Also listen to background pages and their console
  const backgroundPages = context.backgroundPages();
  backgroundPages.forEach((page, idx) => {
    console.log('Background page:', page.url());
    page.on('console', (msg) => console.log(`[BG-${idx}] console.${msg.type()}:`, msg.text()));
  });

  // Open a test page and inject postMessage test to probe the content-script bridge
  const page = await context.newPage();
  page.on('console', (msg) => console.log('[PAGE] console.' + msg.type() + ':', msg.text()));
  // serve the local static test page so content scripts run (simple built-in server)
  const staticPath = path.join(extPath, 'scripts', '_static', 'test-page.html');
  const http = require('http');
  const server = http.createServer((req, res) => {
    // only serve the test page
    fs.readFile(staticPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  });
  await new Promise((res, rej) => server.listen(0, '127.0.0.1', (err) => (err ? rej(err) : res())));
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/test-page.html`;
  console.log('Opening test page at', url);
  await page.goto(url);
  // close server after page is loaded and test completes later
  // keep server reference so we can close at the end
  var localServer = server;

  console.log('Waiting 12s for logs...');
  await new Promise((r) => setTimeout(r, 12000));

  console.log('Closing browser context.');
  await context.close();
  process.exit(0);
})().catch((err) => {
  console.error('Script error:', err);
  process.exit(2);
});
