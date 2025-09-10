import { describe, it, expect } from 'vitest';

describe('context menu handler', () => {
  it('calls analyzeText and returns expected fields', async () => {
    const { handleContextMenuAction } = await import('../../src/service-worker/handler.js');
    const res = await handleContextMenuAction({ text: 'Test selection', pageUrl: 'http://example' });
    expect(res).toBeTruthy();
    expect(typeof res.summary).toBe('string');
    expect(typeof res.explanation === 'string' || res.explanation === null).toBeTruthy();
  });
});
