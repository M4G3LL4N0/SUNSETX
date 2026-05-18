# Local Review — SUNSETX

**Date:** 2026-05-16  
**Deploy:** Not run (`vercel --prod` forbidden for this pass)

## Start

```bash
cd /Users/joshuadavis/startups/sunsetx
pnpm install   # if node_modules missing
pnpm build
pnpm dev
```

Open: http://localhost:3000

## Route checklist

- [ ] `/` loads without console errors

## Acceptance criteria

- [ ] `pnpm build` completes with exit code 0
- [ ] Mobile width (~390px): navigation usable, no horizontal scroll on main pages
- [ ] Primary CTA reaches a page with input → output (not a dead end)
- [ ] Demo/sample data is labeled or described (no fake “live revenue” implication)
- [ ] Trust disclaimer visible on mobile menu or page banner where applicable

## Evidence to capture (optional)

- Screenshot of primary workflow result
- Note any env vars required (`.env.local` — never commit)

## Known limitations

- Weather scores are planning estimates

## After review

- Update `startupjourney.md` §13 with findings
- Git: stage only intentional files; avoid monorepo `cloudcastle` remote mistakes
