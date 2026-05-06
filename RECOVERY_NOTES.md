# Project Recovery Notes

## Startup Identity
- Startup name: SUNSETX
- Project folder: /Users/joshuadavis/startups/sunsetx
- Domain: sunsetx.vercel.app
- One-line description: Live sunset intelligence that tells people if tonight is worth it, when to go, and where to watch nearby.
- Category: Consumer location intelligence / weather decision product
- Stage: MVP recovery, production-ready build

## Product Vision
- Target user: People who want a fast, beautiful, location-aware decision about whether to go watch tonight's sunset and where to go.
- Core problem: Sunset decisions are time-sensitive and fragmented across weather, maps, traffic, local knowledge, and personal comfort.
- Core solution: A compact live dashboard with sunset score, peak window, leave-now guidance, and ranked spots with smell, parking, ease, panorama, distance, and drive time.
- Differentiation: SUNSETX scores the whole human sunset experience, not just weather or official sunset time.
- MVP goal: Keep the homepage useful without provider quota dependency, support browser geolocation, return complete fallback intelligence, and build cleanly for manual Vercel deploy.
- Long-term vision: A daily sunset companion with personalized alerts, enriched place data, share cards, and destination-quality sunset recommendations.

## Website/App Structure
- Main routes: `/`
- Key components: `LiveSunsetDashboard`, `SunsetReportWidget`, `ShareLiveCard`, `EnableNotifications`, `GlobalSunsetBoard`, `PerfectSunsetFramework`
- Data/content files: `src/lib/spots.ts`, `src/lib/report.ts`, `src/lib/geo.ts`, `src/lib/locations.ts`, `src/lib/leave-now.ts`
- API routes: `/api/live-score`, `/api/global-sunset-board`, `/api/perfect-sunset`, `/api/share`, `/api/preferences`, `/api/favorites`, push notification routes, cron daily report
- Auth/database needs: Supabase helpers exist, but homepage must not require auth or database availability.

## Design Direction
- Visual style: Apple-inspired iOS widget board, glossy translucent surfaces, compact dark luxury, cinematic accent gradients.
- Tone: Premium, direct, decision-first, calm.
- Layout principles: Dense top board, compact intelligence cards, no long static report, no admin dashboard, no homepage preferences panel.
- Brand notes: No emojis in UI. Do not expose provider errors, quotas, or Autobuilder internals publicly.

## What Was Preserved
- Core `src/` app architecture, API routes, report widgets, share route, notification route structure, Supabase helpers, pnpm lockfile, Vercel cron config, and public service worker.

## What Was Fixed
- Removed the root `app/` shadow tree so Vercel/Next builds the real `src/app` product.
- Replaced the starter homepage with the SUNSETX live dashboard.
- Made `LiveSunsetDashboard` self-contained and prop-free.
- Kept geolocation order as live GPS, saved localStorage location, then fallback coordinates.
- Ensured live score fetch uses `cache: "no-store"` and refetches when coordinates change.
- Made `/api/live-score` return complete fallback-safe JSON instead of raw errors.
- Aligned spot/report tiers to `close`, `mid`, and `destination`.
- Added required spot fields including `lat`, `lon`, `woodsyBias`, and `reasons`.
- Fixed report/widget shape mismatches and removed lingering `premium` tier dependency.
- Made notifications render only when safe public push config exists.
- Fixed lint issues in production source and ignored abandoned prototype files under `path/`.
- Updated image config from deprecated `images.domains` to `remotePatterns`.

## What Was Removed
- Root-level starter `app/` files that prevented `src/app` from building.
- Duplicate root `lib/supabase.ts`.
- Duplicate `next.config.ts`.
- Nested CSS `@import` warning.
- `premium` tier comparisons in report/widget display logic.

## Current Build Status
- `pnpm install`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- No `typecheck` script exists; Next build TypeScript check passed.

## Manual Deploy Command
```bash
cd /Users/joshuadavis/startups/sunsetx
pnpm install
pnpm build
vercel --prod
```

## Return-Later Commands
```bash
cd /Users/joshuadavis/startups/sunsetx
pnpm install
pnpm lint
pnpm build
```

## Next Best Tasks
- Stabilize live location engine with reverse geocoding and real timezone-aware sunset calculations.
- Improve real spot data with curated local places and map links.
- Add Google Maps or Places enrichment for drive time and place quality.
- Improve share card visual output.
- Add daily notifications safely behind validated VAPID/server config.
- Compact the global leaderboard so it feels like a supporting widget.
- Polish mobile spacing and text density.
- Remove fallback leakage by using more natural fallback labels.

## Autobuilder Guardrails
- Do not expose OpenAI, provider, quota, Supabase, Vercel, or Autobuilder errors in public UI.
- Do not require OpenAI or auth for the homepage to work.
- Do not reintroduce the homepage preferences panel.
- Do not deploy or push automatically.
- Use pnpm only.
