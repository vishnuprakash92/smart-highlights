import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('requestAnalysis', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('sends request to configured backend and returns JSON result', async () => {
    const storage = await import('../../src/lib/storage.js');
    await storage.default.clear();
    await storage.default.set({ backendUrl: 'http://example/analyze' });

    // mock fetch
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ summary: 'ok' }) });

    const { requestAnalysis } = await import('../../src/lib/request.js');
    const res = await requestAnalysis('hello');
    expect(res.ok).toBe(true);
    expect(res.result.summary).toBe('ok');
  });

  it('returns diag on network error', async () => {
    const storage = await import('../../src/lib/storage.js');
    await storage.default.clear();
    await storage.default.set({ backendUrl: 'http://example/analyze' });

    global.fetch = vi.fn().mockRejectedValue(new Error('network fail'));
    const { requestAnalysis } = await import('../../src/lib/request.js');
    const res = await requestAnalysis('x', { timeout: 10 });
    expect(res.ok).toBe(false);
    expect(res.diag).toBeTruthy();
  });
});
