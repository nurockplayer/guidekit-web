# Guidekit Web Agent Notes

This repository is public. Treat it as a reusable, region-aware web template for multi-location guide sites.

## Public Boundary

- Keep this repo free of real customer, source, scraper, credential, and operations data.
- Use only sample content under `src/sample-content`.
- Do not add real source URLs, private contact handles, private image maps, generated customer content, or scraper diagnostics.
- Keep private implementations in downstream private repositories.

## Architecture

- `src/guidekit` is the reusable package surface.
- `src/sample-content` is buildable sample data for public tests and demos.
- `src/main.ts` wires the package to the sample content for the demo app.
- `tools/check-site.ts` is the fast structural and leakage check.
- `tests/e2e` verifies the demo app with sample data.

## Package Manager

- Use pnpm.
- Do not add npm, yarn, or bun lockfiles.
- Do not add lifecycle scripts such as `preinstall`, `install`, `postinstall`, or `prepare`.

## Verification

Run these before committing:

```bash
pnpm run typecheck
pnpm test
pnpm run build
pnpm run test:e2e
```

If content schemas change, update `tools/check-site.ts` and the sample content together.
