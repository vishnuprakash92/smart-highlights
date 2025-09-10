// Lightweight selection detection utilities for the content script.
// Exports:
// - getSelectionText(): { text, isCollapsed, range, anchorNode, focusNode }
// - onSelection(callback): attaches listeners and returns a remover function

function _getRawSelection() {
  try {
    const sel = typeof window.getSelection === 'function' ? window.getSelection() : null;
    return sel || null;
  } catch (err) {
    return null;
  }
}

function getSelectionText({ maxLength = 10000 } = {}) {
  const sel = _getRawSelection();
  if (!sel) return null;
  const text = sel.toString();
  if (!text) return null;

  const trimmed = text.length > maxLength ? text.slice(0, maxLength) : text;
  return {
    text: trimmed,
    fullText: text,
    isCollapsed: sel.isCollapsed,
    range: sel.rangeCount > 0 ? sel.getRangeAt(0) : null,
    anchorNode: sel.anchorNode || null,
    focusNode: sel.focusNode || null,
  };
}

function onSelection(callback, { events = ['mouseup', 'keyup', 'selectionchange'] } = {}) {
  if (typeof callback !== 'function') throw new TypeError('callback must be a function');

  const handler = () => {
    const info = getSelectionText();
    if (info) callback(info);
  };

  for (const ev of events) window.addEventListener(ev, handler);

  return () => {
    for (const ev of events) window.removeEventListener(ev, handler);
  };
}

export { getSelectionText, onSelection };
