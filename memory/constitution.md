Smart Highlights Constitution
Core Principles
I. Chrome Extension (Manifest V3)

This project is a Chrome Extension built using Manifest V3. It must comply with Chrome Web Store policies and modern extension architecture (service workers instead of background pages).

II. Highlight-First Interaction

Primary interaction is text highlighting on any webpage. The extension must capture the selected text and make it available in the popup and context menu.

III. AI Analysis (NON-NEGOTIABLE)

Every highlighted text must be analyzable via AI. AI output is shown in the popup window. Analysis includes (at minimum): summarization, explanation, and translation.

IV. Privacy & Local Processing

No hidden data collection. No unnecessary remote calls. All API calls must be explicit and user-initiated. Support for local model backends (LM Studio / Ollama) is encouraged.

V. Simplicity & Usability

The UI must be lightweight, intuitive, and responsive. Core workflow: highlight → click → analyze result. Stretch features must not compromise simplicity.

Additional Constraints

Must use HTML/CSS/JS only for popup and content scripts.

No external servers required; AI APIs must be configurable via settings.

Extension icons and branding must be clear and professional.

Code should be modular: manifest, content script, popup, background separated.

Development Workflow

Specifications (/specify) must map directly to Chrome Extension features.

Plans (/plan) must decompose into actionable tasks: manifest, content scripts, popup, background, storage, settings.

Testing includes: highlight detection, popup functionality, context menu, API response handling.

All code changes must align with this Constitution.

Governance

This Constitution supersedes ad-hoc development practices.
Amendments require:

Documentation of proposed change.

Explicit approval in version control (PR review).

Migration strategy if compatibility is affected.

Version: 1.0.0 | Ratified: 2025-09-10 | Last Amended: 2025-09-10
