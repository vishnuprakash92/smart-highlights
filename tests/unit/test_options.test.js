/**
 * @vitest-environment jsdom
 */
import { describe, it, beforeEach, expect } from 'vitest';
import storage from '../../src/lib/storage.js';

describe('options page', () => {
  beforeEach(async () => {
    await storage.clear();
    document.body.innerHTML = `
      <input id="backendUrl" />
      <select id="mode"><option value="local">Local</option><option value="remote">Remote</option></select>
      <button id="save"></button>
      <span id="status"></span>
    `;
  });

  it('loads defaults when storage empty and saves new values', async () => {
    const { loadConfig, saveConfig } = await import('../../src/options/options.js');
    await loadConfig();
    expect(document.getElementById('backendUrl').value).toBe('http://localhost:8080/analyze');

    document.getElementById('backendUrl').value = 'http://example/ai';
    document.getElementById('mode').value = 'remote';

    await saveConfig();
    const stored = await storage.get(['backendUrl', 'mode']);
    expect(stored.backendUrl).toBe('http://example/ai');
    expect(stored.mode).toBe('remote');
  });
});
