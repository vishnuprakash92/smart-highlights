import storage from '../lib/storage.js';

const DEFAULT_CONFIG = {
  backendUrl: 'http://localhost:8080/analyze',
  mode: 'local',
};

async function loadConfig() {
  const res = await storage.get(DEFAULT_CONFIG);
  document.getElementById('backendUrl').value = res.backendUrl || DEFAULT_CONFIG.backendUrl;
  document.getElementById('mode').value = res.mode || DEFAULT_CONFIG.mode;
}

async function saveConfig() {
  const backendUrl = document.getElementById('backendUrl').value;
  const mode = document.getElementById('mode').value;
  await storage.set({ backendUrl, mode });
  const s = document.getElementById('status');
  s.textContent = 'Saved';
  setTimeout(() => (s.textContent = ''), 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  document.getElementById('save').addEventListener('click', saveConfig);
});

export { loadConfig, saveConfig };
