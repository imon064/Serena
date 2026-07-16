# Serena — AI Layer (contract for the team)

This part handles everything AI-related. The frontend/backend just call the 3 endpoints below. Full types live in [`types.ts`](./types.ts).

## Setup

1. Generate an API key: https://platform.openai.com/api-keys
2. Copy `.env.example` → `.env.local`, set `OPENAI_API_KEY=...` (each person their own key, **never commit it**).
3. `npm install`
4. `npm run seed` — populate demo journal data for `demo-user` (required so the journal↔chat loop is visible).
5. `npm run dev`

## Endpoints

### `POST /api/chat`
Send a message, get Serena's reply.

Request (`ChatRequest`):
```json
{ "userId": "demo-user", "message": "so tired today", "history": [] }
```
`history` is optional: `[{ "role": "user"|"model", "content": "..." }]`

The response has **two shapes** — check before rendering:
- **Normal:** `text/plain` streaming. Read it chunk by chunk (`ReadableStream`) and show it like a typing effect. Header `X-Serena-Mode: chat`.
- **Crisis:** if high risk (self-harm) is detected, the response is JSON (`CrisisResponse`): `{ "crisis": true, "message": "...", "resources": [...] }`. Show this as an emergency card with the hotline number, **not** a normal chat bubble. Detect via `Content-Type: application/json` or the `crisis` field.

### `POST /api/journal/analyze`
Analyze the mood of a single journal entry.

Request (`AnalyzeRequest`): `{ "userId": "demo-user", "text": "...", "save": true }`

Response: `{ "mood": MoodAnalysis, "entry": JournalEntry }`
`MoodAnalysis` = `{ valence: -1..1, arousal: 0..1, primaryEmotion, themes[], summary, confidence }`.
`valence`/`arousal` are continuous numbers → they plug straight into a mood chart.

### `POST /api/journal/draft`
Create a draft journal entry from a chat conversation (the "turn a vent into a journal" feature).

Request (`DraftRequest`): `{ "userId": "demo-user", "history": [...] }` (or `sessionId`).
Response: `{ "draft": "..." }` — it's a **draft**; the user must be able to edit it before saving.

## Database integration (important)

The AI layer persists data through the `Store` interface in [`store.ts`](./store.ts). By default it writes to a local JSON file (`.data/serena.json`) — enough for the demo. When merging with the real DB:

1. Write a class that implements `Store` (using Prisma/Supabase/etc.).
2. Call `setStore(new YourDbStore())` once at startup.

No AI logic needs to change. Methods to implement: `getProfile`, `saveProfile`, `getRecentJournals`, `getJournal`, `saveJournal`, `setJournalMood`.

## Product notes

- `UserProfile` = a **communication-style profile**, not a diagnosis/MBTI. Don't present it as a "personality type".
- Serena is not a substitute for a therapist — put a disclaimer in the UI.
- The crisis hotline in `safety.ts` currently points to Indonesia's Kemenkes line (119 ext. 8). Confirm or replace it for your users' region before shipping.
