import storage from '../../src/lib/storage.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('storage adapter (in-memory fallback)', () => {
  beforeEach(async () => {
    await storage.clear();
  });

  it('sets and gets values', async () => {
    await storage.set({ a: 1, b: 'two' });
    const res = await storage.get(['a', 'b']);
    expect(res.a).toBe(1);
    expect(res.b).toBe('two');
  });

  it('returns default values when provided object', async () => {
    await storage.set({ a: 1 });
    const res = await storage.get({ a: 0, c: 'default' });
    expect(res.a).toBe(1);
    expect(res.c).toBe('default');
  });

  it('remove and clear', async () => {
    await storage.set({ x: 'y', z: 3 });
    await storage.remove('x');
    let res = await storage.get(['x', 'z']);
    expect(res.x).toBeUndefined();
    expect(res.z).toBe(3);

    await storage.clear();
    res = await storage.get(null);
    expect(Object.keys(res).length).toBe(0);
  });
});
