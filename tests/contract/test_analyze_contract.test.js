import { describe, it, expect } from 'vitest';

describe('Contract: /analyze', () => {
  it('should implement analyzeText(text, options) and return {summary, explanation, translation}', async () => {
    // TDD: analyzeText does not exist yet. This test should fail until implementation is added.
    const mod = await import('../../src/lib/analyze.js');
    expect(mod).toBeDefined();
    expect(typeof mod.analyzeText).toBe('function');

    // Call with sample input and assert response shape (may fail if not implemented)
    const res = await mod.analyzeText('The quick brown fox', { mode: 'summary' });
    expect(res).toBeTruthy();
    expect(typeof res.summary).toBe('string');
    expect(typeof res.explanation === 'string' || res.explanation === null).toBeTruthy();
    // translation is optional depending on mode; if present must be string
    if (res.translation !== undefined && res.translation !== null) {
      expect(typeof res.translation).toBe('string');
    }
  });
});
