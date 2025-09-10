// Storage adapter for extension and node tests.
// Exposes get(keys), set(items), remove(keys), clear()
// - If running inside an extension with chrome.storage.local, uses that API
// - Otherwise falls back to an in-memory Map suitable for unit tests

const hasChromeStorage = typeof globalThis.chrome !== 'undefined' &&
  globalThis.chrome &&
  globalThis.chrome.storage &&
  globalThis.chrome.storage.local;

// In-memory store used as fallback
const _memoryStore = new Map();

function _normalizeKeys(keys) {
  if (keys === null || keys === undefined) return null;
  if (typeof keys === 'string') return [keys];
  if (Array.isArray(keys)) return keys;
  if (typeof keys === 'object') return Object.keys(keys);
  return [String(keys)];
}

const storage = {
  async get(keys) {
    if (hasChromeStorage) {
      return new Promise((resolve) => {
        try {
          globalThis.chrome.storage.local.get(keys, (items) => resolve(items || {}));
        } catch (err) {
          resolve({});
        }
      });
    }

    // memory fallback — mimic chrome.storage.local.get behavior
    if (keys === null || keys === undefined) {
      // return all
      const all = {};
      for (const [k, v] of _memoryStore.entries()) all[k] = v;
      return all;
    }

    if (typeof keys === 'string') {
      return { [keys]: _memoryStore.has(keys) ? _memoryStore.get(keys) : undefined };
    }

    if (Array.isArray(keys)) {
      const out = {};
      for (const k of keys) out[k] = _memoryStore.has(k) ? _memoryStore.get(k) : undefined;
      return out;
    }

    if (typeof keys === 'object') {
      // keys is default values object
      const out = {};
      for (const k of Object.keys(keys)) out[k] = _memoryStore.has(k) ? _memoryStore.get(k) : keys[k];
      return out;
    }

    return {};
  },

  async set(items) {
    if (hasChromeStorage) {
      return new Promise((resolve) => {
        try {
          globalThis.chrome.storage.local.set(items, () => resolve());
        } catch (err) {
          resolve();
        }
      });
    }

    for (const [k, v] of Object.entries(items)) _memoryStore.set(k, v);
  },

  async remove(keys) {
    if (hasChromeStorage) {
      return new Promise((resolve) => {
        try {
          globalThis.chrome.storage.local.remove(keys, () => resolve());
        } catch (err) {
          resolve();
        }
      });
    }

    const arr = _normalizeKeys(keys) || [];
    for (const k of arr) _memoryStore.delete(k);
  },

  async clear() {
    if (hasChromeStorage) {
      return new Promise((resolve) => {
        try {
          globalThis.chrome.storage.local.clear(() => resolve());
        } catch (err) {
          resolve();
        }
      });
    }

    _memoryStore.clear();
  },

  // helper for tests: expose internal memory map (read-only)
  _memory() {
    return _memoryStore;
  }
};

export { storage as default };
