/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { getSelectionText, onSelection } from '../../src/content-script/selection.js';

describe('selection detection', () => {
  it('returns null when nothing selected', () => {
    document.body.innerHTML = '<div>no selection here</div>';
    const res = getSelectionText();
    expect(res).toBeNull();
  });

  it('detects selected text and triggers callback', async () => {
    document.body.innerHTML = '<div id="a">Hello <span>World</span></div>';
    const range = document.createRange();
    const start = document.querySelector('#a').firstChild; // text node "Hello "
    const end = document.querySelector('#a span').firstChild; // text node "World"
    range.setStart(start, 0);
    range.setEnd(end, end.textContent.length);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const info = getSelectionText();
    expect(info).toBeTruthy();
    expect(info.text).toContain('Hello');
    expect(info.text).toContain('World');

    let called = false;
    const remover = onSelection(() => {
      called = true;
    });

    // Simulate user event
    window.dispatchEvent(new MouseEvent('mouseup'));
    expect(called).toBe(true);
    remover();
  });
});
