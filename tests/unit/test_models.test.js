import { describe, it, expect } from 'vitest';
import { Highlight } from '../../src/models/highlight.js';
import { AnalysisResult } from '../../src/models/analysisResult.js';

describe('Models', () => {
  it('creates and serializes Highlight', () => {
    const h = new Highlight({ text: 'sample', pageUrl: 'http://example' });
    const json = h.toJSON();
    expect(json.text).toBe('sample');
    expect(json.pageUrl).toBe('http://example');
    const h2 = Highlight.fromJSON(json);
    expect(h2.text).toBe(h.text);
  });

  it('creates and serializes AnalysisResult', () => {
    const r = new AnalysisResult({ summary: 's', explanation: 'e' });
    const json = r.toJSON();
    expect(json.summary).toBe('s');
    const r2 = AnalysisResult.fromJSON(json);
    expect(r2.summary).toBe(r.summary);
  });
});
