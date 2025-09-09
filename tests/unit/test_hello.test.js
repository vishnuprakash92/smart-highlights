import { describe, it, expect } from 'vitest';
import { hello } from '../../src/lib/hello.js';

describe('hello', () => {
  it('greets by name', () => {
    expect(hello('world')).toBe('hello world');
  });
});
