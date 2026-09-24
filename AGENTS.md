# Moro AI — Base44 Dev Environment

## Stack
- Pure frontend: Vite 8 + React 19 + TypeScript + Tailwind CSS v4
- No backend/database. Data persists via `LocalStorageAdapter` in the browser.
- AI providers are stubbed: `MockProviderAdapter` is fully functional; `GeminiProviderAdapter` is a Phase-2 stub that reads `import.meta.env.VITE_GEMINI_API_KEY` but does not call the API yet. No credentials are required to boot or use the preview.

## Running
- `docker compose -f docker-compose.base44.yml up -d`
- Web entry point on host port 3000 (Vite dev server, `--host=0.0.0.0`).
- `npm install --legacy-peer-deps` is required — the repo's pinned `esbuild@^0.25.0` conflicts with Vite 8's peer range. Do not change to `--force`; legacy-peer-deps resolves cleanly.

## Verifying
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → 200
- `/src/main.tsx` must serve as an unhashed module (confirms live source, not a prebuilt bundle).
- Healthcheck in compose polls `http://localhost:3000/`.

## Notes
- Vite config uses `import.meta.dirname` for the `@` path alias (portable across Node 20.11+/22).
