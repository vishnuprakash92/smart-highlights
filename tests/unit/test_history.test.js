/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import storage from '../../src/lib/storage.js';
import {
  setOptIn,
  getOptIn,
  addHistoryEntry,
  getHistory,
  cleanupHistory,
} from '../../src/lib/history.js';

describe('history storage', () => {
  beforeEach(async () => {
    await storage.clear();
  });

  it('does not add entries when not opted-in', async () => {
    await setOptIn(false);
    const e = await addHistoryEntry({ text: 'x' });
    expect(e).toBeNull();
    const all = await getHistory();
    expect(all.length).toBe(0);
  });

  it('adds and retrieves entries when opted-in', async () => {
    await setOptIn(true);
    const e = await addHistoryEntry({ text: 'hello' });
    expect(e).toBeTruthy();
    const all = await getHistory();
    expect(all.length).toBe(1);
    expect(all[0].text).toBe('hello');
  });

  it('cleanup removes old entries', async () => {
    await setOptIn(true);
    const now = Date.now();
    // add one very old and one recent
    await storage.set({ history: [{ id: 'old', timestamp: now - 1000 * 60 * 60 * 24 * 40, text: 'old' }, { id: 'new', timestamp: now, text: 'new' }] });
    const kept = await cleanupHistory(30);
    expect(kept.find((i) => i.id === 'old')).toBeUndefined();
    expect(kept.find((i) => i.id === 'new')).toBeTruthy();
  });
});
