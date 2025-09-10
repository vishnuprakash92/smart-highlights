// analyzeText: attempts to call configured backend via requestAnalysis.
// Falls back to a local deterministic stub when backend is unreachable or
// when running in test environments where fetch may be stubbed.

import { requestAnalysis } from './request.js';

function _localStub(text) {
  const input = typeof text === 'string' ? text : String(text || '');
  let summary = input.split(/[\.\n]/, 1)[0] || '';
  if (!summary) summary = input.slice(0, 100);
  if (summary.length > 200) summary = summary.slice(0, 200) + '...';
  const explanation = `Analysis (local stub): ${summary}`;
  return { summary, explanation, translation: null };
}

async function analyzeText(text, options = {}) {
  // Try the remote backend first. requestAnalysis returns { ok, status, result, error, diag }
  try {
    const resp = await requestAnalysis(text, { timeout: options.timeout || 5000 });
    if (resp && resp.ok && resp.result) {
      // Normalize backend result into canonical shape
      return normalizeResult(resp.result, text);
    }
    // If backend indicates not ok, fall through to local stub
    return _localStub(text);
  } catch (err) {
    // Any unexpected error -> fallback to stub
    return _localStub(text);
  }
}

// Normalize various possible backend response shapes into { summary, explanation, translation }
function normalizeResult(result, originalText = '') {
  if (!result) return _localStub(originalText);

  // If result is a string, treat as summary
  if (typeof result === 'string') {
    return { summary: result, explanation: null, translation: null };
  }

  // Helper to safely pick first existing property from list
  const pick = (obj, keys) => {
    for (const k of keys) if (obj && Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null) return obj[k];
    return undefined;
  };

  // Try common locations
  const summary =
    pick(result, ['summary', 'summaryText', 'headline', 'title']) ||
    (result.data && pick(result.data, ['summary', 'summaryText'])) ||
    (result.attributes && pick(result.attributes, ['summary', 'title'])) ||
    (typeof result.text === 'string' ? result.text.slice(0, 200) : undefined) ||
    null;

  const explanation =
    pick(result, ['explanation', 'details', 'analysis', 'body', 'description']) ||
    (result.data && pick(result.data, ['explanation', 'details'])) ||
    null;

  const translation = pick(result, ['translation', 'translatedText', 'translate']) || null;

  // Fallback: if both summary and explanation missing, produce a minimal summary
  if (!summary && !explanation) return _localStub(originalText);

  return { summary: summary || '', explanation: explanation || null, translation };
}

// Export both ESM and CommonJS to be compatible with tests and other modules.
export { analyzeText };
// Support require() consumers
try {
  // @ts-ignore
  module.exports = { analyzeText };
} catch (e) {
  // ignore in ESM-only environments
}
