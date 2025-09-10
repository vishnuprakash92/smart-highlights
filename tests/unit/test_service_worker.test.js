import { describe, it, expect, vi } from 'vitest';

// module-scoped mock so vi.mock factory (hoisted) can reference it
const mockRequestAnalysis = vi.fn().mockResolvedValue({ ok: true, result: { summary: 's' } });
vi.mock('../../src/lib/request.js', () => ({ requestAnalysis: mockRequestAnalysis }));

describe('service worker routing', () => {
  it('routes analyze message to requestAnalysis', async () => {
    const { onMessage } = await import('../../src/service-worker/index.js');
    const res = await onMessage({ data: { type: 'analyze', text: 'hi' } });
    expect(mockRequestAnalysis).toHaveBeenCalled();
    expect(res.ok).toBe(true);
  });
});
