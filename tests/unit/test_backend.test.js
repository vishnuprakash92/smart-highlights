/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkBackend, isLocalBackend } from '../../src/lib/backend.js';

describe('backend diagnostics', () => {
  beforeEach(() => {
    // reset global fetch mock
    global.fetch = undefined;
    vi.useRealTimers();
  });

  it('reports ok on 200 response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, statusText: 'OK' });
    const res = await checkBackend('http://localhost:3000/analyze');
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
  });

  it('reports non-ok on 500 response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' });
    const res = await checkBackend('http://localhost:3000/analyze');
    expect(res.ok).toBe(false);
    expect(res.status).toBe(500);
  });

  it('times out when fetch does not resolve', async () => {
    vi.useFakeTimers();
    // mock fetch that listens to AbortController.signal and rejects on abort
    global.fetch = vi.fn((url, opts = {}) => {
      return new Promise((resolve, reject) => {
        const signal = opts.signal;
        if (signal) {
          const onAbort = () => {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          };
          signal.addEventListener('abort', onAbort, { once: true });
        }
        // otherwise never resolve
      });
    });

    const promise = checkBackend('http://localhost:3000/analyze', { timeout: 50 });
    // advance timers to trigger abort
    vi.advanceTimersByTime(60);
    const res = await promise;
    expect(res.ok).toBe(false);
    expect(res.timedOut).toBe(true);
  });

  it('handles network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network failure'));
    const res = await checkBackend('http://localhost:3000/analyze');
    expect(res.ok).toBe(false);
    expect(res.error).toContain('network failure');
  });

  it('isLocalBackend recognizes localhost and 127.0.0.1', () => {
    expect(isLocalBackend('http://localhost:3000')).toBe(true);
    expect(isLocalBackend('http://127.0.0.1:5000')).toBe(true);
    expect(isLocalBackend('https://api.example.com')).toBe(false);
  });
});
