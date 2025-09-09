# Tasks: Smart Highlights (TDD-first)

Feature: Smart Highlights — implement highlight-first AI analysis popup and context menu (branch: `001-create-a-full`)

Rules applied: TDD-first, tests before implementation, parallel [P] where independent, file paths are absolute.

T001 — Setup repository and dev tooling
- Summary: Initialize linting, test runner, and E2E harness for extension development.
- Files/targets: `/package.json` (create if absent), `/src/` (project source), `/tests/` (test harness)
- Notes: Ensure Playwright/Puppeteer and Jest/Vitest dependencies are added. This runs before other tasks.

T002 [P] — Create contract test for /analyze endpoint
- Summary: Create a failing contract test that validates requests to `/analyze` follow `contracts/analysis-openapi.yaml`.
- Files: `/specs/001-create-a-full/contracts/analysis-openapi.yaml`, `/tests/contract/test_analyze_contract.test.js`
- Command (agent): generate test that sends sample payload and asserts response schema; test must fail until implementation exists.

T003 [P] — Create model tests and model scaffolding for Highlight and AnalysisResult
- Summary: Add failing unit tests for entity serialization/persistence and create minimal model files.
- Files: `/src/models/highlight.js`, `/src/models/analysisResult.js`, `/tests/unit/test_models.test.js`

T004 — Implement storage adapter (chrome.storage.local) shim & tests
- Summary: Implement a small storage wrapper to use in tests and extension; include a node-compatible shim for unit tests.
- Files: `/src/lib/storage.js`, `/tests/unit/test_storage.test.js`

T005 [P] — Implement content script selection detection tests and stub
- Summary: Add E2E/unit tests verifying selection detection logic; create `content-script` stub.
- Files: `/src/content-script/selection.js`, `/tests/integration/test_selection.spec.js`

T006 — Create context menu contract test (UI flow) and stub
- Summary: Test that context menu action triggers analysis flow; add stub handler in service worker.
- Files: `/src/service-worker/handler.js`, `/tests/integration/test_context_menu.spec.js`

T007 — Implement popup UI contract test and stub
- Summary: Add failing E2E tests for popup UI rendering analysis results; scaffold popup HTML/CSS/JS.
- Files: `/src/popup/index.html`, `/src/popup/popup.js`, `/tests/e2e/test_popup.spec.js`

T008 — Implement ModelConfig UI & persistence tests
- Summary: Tests & UI for backend configuration (local/remote endpoints), storage, and validation.
- Files: `/src/options/options.html`, `/src/options/options.js`, `/tests/unit/test_options.test.js`

T009 — Implement local backend diagnostics & error handling
- Summary: Add functions and tests for checking local backend reachability and proper error messages/timeouts.
- Files: `/src/lib/backend.js`, `/tests/unit/test_backend.test.js`

T010 — Implement analysis request routing (service worker)
- Summary: Implement service worker logic to accept analysis requests, route to configured backend, and return results to popup.
- Files: `/src/service-worker/index.js`, `/src/lib/request.js`

T011 — Implement analysis result rendering in popup
- Summary: Wire popup to display AnalysisResult fields (summary, explanation, translation), loading and error states.
- Files: `/src/popup/popup.js`, `/src/popup/popup.css`

T012 — Implement opt-in history storage and retention cleanup
- Summary: Add history storage when user opts in; implement retention policy (30 days default) and tests.
- Files: `/src/lib/history.js`, `/tests/unit/test_history.test.js`

T013 [P] — Add E2E test: highlight -> analyze -> result
- Summary: Full integration test: select text on a page, trigger analysis (context menu or popup), assert result appears.
- Files: `/tests/e2e/test_highlight_flow.spec.js`

T014 — Add packaging and extension manifest checks
- Summary: Validate `manifest.json` (Manifest V3), icons, permissions minimal; add packaging script.
- Files: `/manifest.json`, `/scripts/package-extension.sh`

T015 — Polish: unit tests, docs, quickstart completion [P]
- Summary: Add unit tests for remaining modules, finalize quickstart.md, and write README instructions.
- Files: `/README.md`, `/specs/001-create-a-full/quickstart.md`

Parallel groups examples
- Group A [P]: T002, T003, T004, T005 — contract and model tests can be developed in parallel.
- Group B [P]: T008, T009, T012 — options, backend diagnostics, and history storage (mostly independent).

How to execute
- Each task includes file targets and expected test to create; the agent should create failing tests first, then implement minimal code to pass them.
