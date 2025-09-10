export class Highlight {
  constructor({ id, text, pageUrl, pageTitle, selectionContext = null, timestamp = null } = {}) {
    if (!text) throw new Error('Highlight.text is required');
    this.id = id || null;
    this.text = String(text);
    this.pageUrl = pageUrl || null;
    this.pageTitle = pageTitle || null;
    this.selectionContext = selectionContext || null;
    this.timestamp = timestamp || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      pageUrl: this.pageUrl,
      pageTitle: this.pageTitle,
      selectionContext: this.selectionContext,
      timestamp: this.timestamp
    };
  }

  static fromJSON(obj) {
    return new Highlight(obj);
  }
}
