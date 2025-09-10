import storage from './storage.js';

const HISTORY_KEY = 'history';
const OPT_IN_KEY = 'historyOptIn';

async function setOptIn(value) {
  await storage.set({ [OPT_IN_KEY]: !!value });
}

async function getOptIn() {
  const res = await storage.get({ [OPT_IN_KEY]: false });
  return !!res[OPT_IN_KEY];
}

async function addHistoryEntry(entry = {}) {
  const optIn = await getOptIn();
  if (!optIn) return null;

  const now = Date.now();
  const e = {
    id: entry.id || `${now}-${Math.random().toString(36).slice(2, 8)}`,
    text: entry.text || '',
    summary: entry.summary || null,
    pageUrl: entry.pageUrl || null,
    timestamp: entry.timestamp || now,
  };

  const current = await storage.get({ [HISTORY_KEY]: [] });
  const arr = Array.isArray(current[HISTORY_KEY]) ? current[HISTORY_KEY] : [];
  arr.unshift(e); // newest first
  await storage.set({ [HISTORY_KEY]: arr });
  return e;
}

async function getHistory() {
  const res = await storage.get({ [HISTORY_KEY]: [] });
  return Array.isArray(res[HISTORY_KEY]) ? res[HISTORY_KEY] : [];
}

async function cleanupHistory(retentionDays = 30) {
  const res = await storage.get({ [HISTORY_KEY]: [] });
  const arr = Array.isArray(res[HISTORY_KEY]) ? res[HISTORY_KEY] : [];
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  const kept = arr.filter((it) => (it && typeof it.timestamp === 'number' ? it.timestamp >= cutoff : true));
  await storage.set({ [HISTORY_KEY]: kept });
  return kept;
}

export { setOptIn, getOptIn, addHistoryEntry, getHistory, cleanupHistory };
