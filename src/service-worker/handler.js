// Minimal service-worker handler stub for context menu actions.
// Exports:
// - handleContextMenuAction({ text, pageUrl, selectionInfo }) -> returns analysis result
// - registerContextMenu(): placeholder for actual chrome.contextMenus registration

async function handleContextMenuAction({ text, pageUrl, selectionInfo } = {}) {
  // Lazy import analyze to keep test-time behavior simple
  const mod = await import('../lib/analyze.js');
  const analyze = mod.analyzeText || (mod.default && mod.default.analyzeText) || mod.default || mod;

  // Ensure we call analyzeText function
  if (!analyze || typeof analyze !== 'function') {
    // If module exported an object, try property
    if (mod && typeof mod.analyzeText === 'function') {
      return mod.analyzeText(text, { pageUrl, selectionInfo });
    }
    throw new Error('analyzeText function not available');
  }

  // Call analyzeText and return the raw result
  const res = await analyze(text, { pageUrl, selectionInfo });
  return res;
}

function registerContextMenu() {
  // Placeholder. In a real extension you'd call chrome.contextMenus.create here.
  return { registered: true };
}

export { handleContextMenuAction, registerContextMenu };
