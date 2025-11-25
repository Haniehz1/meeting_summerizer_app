
# Action Items AI

Simple Next.js 14 (App Router) app that turns meeting transcripts into actionable tasks using OpenAI (gpt-4o-mini). The UI mirrors the Action Items AI Figma concept.

## Prerequisites
- Node.js 18+
- OpenAI API key with access to `gpt-4o-mini`

Create `.env.local` (or set env vars in Vercel):
```bash
OPENAI_API_KEY=your-openai-api-key
```

## Quick start
```bash
npm install
npm run dev          # start locally (defaults to port 3000)
# or choose a port: npm run dev -- --port 3003
```

## Build & run
```bash
npm run build        # production build
npm start            # run the built app
```

## API
`POST /api/generate`
```json
{
  "transcript": "meeting text here"
}
```
Response:
```json
{
  "success": true,
  "actionItems": [
    { "task": "Prepare Q1 dashboard", "owner": "Lisa", "deadline": "Friday" }
  ]
}
```
Errors return `{ success: false, error: "message" }`.

## Frontend flow
- `app/page.tsx` uses `useActionItemsGenerator` (lib/useActionItemsGenerator.ts) to:
  - handle text/file input
  - post to `/api/generate`
  - render results and copy/export state
- UI components live in `src/components`.

## Notes
- No database or auth; all processing is request/response.
- Keep your real `OPENAI_API_KEY` out of git—use `.env.local` or Vercel env settings.
