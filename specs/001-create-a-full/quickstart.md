# Quickstart: Smart Highlights

This quickstart shows how to configure and use the Smart Highlights extension locally.

1. Install the extension in developer mode:
   - Load `manifest.json` in Chrome Extensions > Developer mode > Load unpacked.
2. Open the extension settings and configure a model backend (optional):
   - For local model: set endpoint to `http://localhost:PORT` and (optional) API key.
   - For remote API: set endpoint and provide API key.
3. Use the extension:
   - Select text on any page, click the extension icon, or use the context menu entry "Analyze selection".
4. Troubleshooting:
   - If local backend returns CORS error: ensure backend allows loopback origins or set up a local proxy.
   - If analysis times out: increase timeout in settings or use a smaller selection.
