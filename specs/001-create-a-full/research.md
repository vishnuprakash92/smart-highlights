# Research: Smart Highlights (Phase 0)

## Objective

Resolve outstanding clarifications from the spec and document key decisions and trade-offs for implementing a Manifest V3 Chrome extension that performs AI analysis on highlighted text with privacy-first defaults and support for local backends.

## Questions to resolve

- Data retention policy for saved analysis/history
- Maximum selection length and truncation strategy
- Local model integration patterns (how to call local services securely from extension)
- Expected performance targets for analysis latency

## Findings & Decisions

1. Data retention

   - Decision: Opt-in history. Default: do not persist analysis results. If user opts in, store locally in extension storage (chrome.storage.local) with configurable retention (default 30 days).
   - Rationale: Privacy-first default aligns with Constitution; 30 days gives utility without long-term storage.
   - Alternatives: Always persist locally (not chosen due to privacy concerns).

2. Selection length

   - Decision: Soft limit of 10,000 characters; prompt user for confirmation beyond that. For local models, allow larger payloads but warn about latency.
   - Rationale: Prevent costly and slow analysis by default; aligns with UI simplicity.

3. Local backend integration

   - Decision: Support configurable local endpoints (http://localhost:port) with CORS and optional API key. Extension sends requests from service worker; keep full text in request body only when user consents.
   - Rationale: Keeps extension stateless and simple; avoids shadow servers.
   - Security note: Recommend user run local backend on loopback only; document how to secure endpoints.

4. Performance targets
   - Decision: Aim for <5s median response for remote APIs; <3s for local models when on same machine/network. Provide graceful timeout at 15s with user message.

## Actionable outcomes

- FR-011 resolved: default no persistence; opt-in storage with 30-day retention (configurable).
- FR-012 resolved: soft limit 10k chars with confirmation for larger selections.
- Document local backend configuration in quickstart and settings UI.

## Sources / References

- Chrome Extension Manifest V3 docs
- Best practices for local model serving (LM Studio/Ollama docs)
