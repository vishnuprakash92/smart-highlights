# Data Model

## Entities

- Highlight
  - id: string (uuid)
  - text: string
  - pageUrl: string
  - pageTitle: string
  - selectionContext: string (optional snippet)
  - timestamp: ISO8601

- AnalysisResult
  - id: string (uuid)
  - highlightId: string (uuid)
  - summary: string
  - explanation: string
  - translation: string (optional)
  - modelUsed: string
  - latencyMs: integer
  - errorState: string (nullable)
  - createdAt: ISO8601

- ModelConfig
  - id: string
  - type: enum [local, remote]
  - endpoint: string
  - name: string
  - authToken: string (optional)
  - preferences: map

- UserSettings
  - defaultAnalysisMode: enum [summary, explanation, translation]
  - preferredModelId: string (nullable)
  - telemetryOptIn: boolean
  - historyOptIn: boolean
  - historyRetentionDays: integer

## Notes
- All persisted data is stored via `chrome.storage.local` (or equivalent) with minimal fields to avoid PII. History is opt-in.
