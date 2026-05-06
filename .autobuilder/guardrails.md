# SUNSETX Autobuilder Guardrails

## Product Truth
SUNSETX is a live sunset intelligence product. It helps a user decide if tonight's sunset is worth it, when the peak window happens, when to leave, and where nearby they should go.

The core homepage must answer:
- Is tonight worth it?
- When is official sunset?
- When is peak color?
- When is afterglow?
- Should I leave now?
- Which nearby spot is best?
- Which upgraded and destination options are worth considering?

## Public Positioning
Position SUNSETX as premium, fast, location-aware sunset intelligence. It should feel like a beautiful iOS widget board, not a weather report, admin dashboard, or generic SaaS page.

## Do Not Expose
- OpenAI errors, quota errors, model errors, or provider stack traces
- Supabase or database errors
- Vercel internals
- Autobuilder internals
- raw API exception strings
- blank states caused by failed live data

## Do Not Delete
- `src/`
- `public/`
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `next.config.js`
- `postcss.config.mjs`
- `vercel.json`
- `.env.local`
- `.gitignore`
- `RECOVERY_NOTES.md`
- `AUTOBUILDER_FOUNDATION.json`
- `.autobuilder/`

## Do Not Drift Toward
- homepage preferences panel
- long report page
- admin dashboard
- generic SaaS landing page
- emoji-heavy weather app
- OpenAI-required homepage
- raw fallback or provider error language

## Safe Improvements
- More accurate solar calculations
- Reverse geocoding for city and region labels
- Real weather provider integration with deterministic fallback
- Real curated sunset spots
- Google Maps or Places enrichment
- Better share card visuals
- Safe notification setup
- Mobile spacing and first-viewport polish

## Risky Improvements
- Client-side provider keys
- Provider calls that can blank the homepage
- Tier changes without updating all unions
- Long static copy blocks
- New auth/database requirements on the homepage
- Large dependencies for small visual changes

## Build Rules
- Use pnpm only.
- Required validation before deploy: `pnpm install`, `pnpm lint`, `pnpm build`.
- Do not run `vercel --prod` unless explicitly asked.
- Do not push unless explicitly asked.
- `/api/live-score` must always return valid JSON and never expose raw errors.
