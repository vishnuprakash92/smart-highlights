import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('analyzeText normalization', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('normalizes object with summary and explanation', async () => {
    // mock requestAnalysis to return various shapes
    const mock = vi.fn().mockResolvedValue({ ok: true, result: { summary: 'S', explanation: 'E' } });
    vi.doMock('../../src/lib/request.js', () => ({ requestAnalysis: mock }));
    const mod = await import('../../src/lib/analyze.js');
    const res = await mod.analyzeText('hello');
    expect(res.summary).toBe('S');
    expect(res.explanation).toBe('E');
  });

  it('normalizes string result', async () => {
    const mock = vi.fn().mockResolvedValue({ ok: true, result: 'just a summary' });
    vi.doMock('../../src/lib/request.js', () => ({ requestAnalysis: mock }));
    const mod = await import('../../src/lib/analyze.js');
    const res = await mod.analyzeText('hello');
    expect(res.summary).toBe('just a summary');
  });

  it('falls back to stub when result missing fields', async () => {
    const mock = vi.fn().mockResolvedValue({ ok: true, result: { unknown: 'x' } });
    vi.doMock('../../src/lib/request.js', () => ({ requestAnalysis: mock }));
    const mod = await import('../../src/lib/analyze.js');
    const res = await mod.analyzeText('The quick brown fox');
    expect(res.summary).toBeTruthy();
    expect(res.explanation).toBeTruthy();
  });

  it('falls back to stub on network error', async () => {
    const mock = vi.fn().mockRejectedValue(new Error('fail'));
    vi.doMock('../../src/lib/request.js', () => ({ requestAnalysis: mock }));
    const mod = await import('../../src/lib/analyze.js');
    const res = await mod.analyzeText('Sample');
    expect(res.summary).toContain('Sample');
  });
});
