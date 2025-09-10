export class AnalysisResult {
  constructor({ id, highlightId = null, summary = '', explanation = null, translation = null, modelUsed = null, latencyMs = null, errorState = null, createdAt = null } = {}) {
    this.id = id || null;
    this.highlightId = highlightId;
    this.summary = summary;
    this.explanation = explanation;
    this.translation = translation;
    this.modelUsed = modelUsed;
    this.latencyMs = latencyMs;
    this.errorState = errorState;
    this.createdAt = createdAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      highlightId: this.highlightId,
      summary: this.summary,
      explanation: this.explanation,
      translation: this.translation,
      modelUsed: this.modelUsed,
      latencyMs: this.latencyMs,
      errorState: this.errorState,
      createdAt: this.createdAt
    };
  }

  static fromJSON(obj) {
    return new AnalysisResult(obj);
  }
}
