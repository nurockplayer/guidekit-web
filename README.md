# guidekit-web

Public Vite and TypeScript package for building region-aware guide sites. The repository ships with sample content, a demo app, and tests so downstream private sites can reuse the architecture without exposing their real content or operations.

## Development

```bash
pnpm install
pnpm dev
pnpm run typecheck
pnpm test
pnpm run build
pnpm run test:e2e
```

## Repository Boundary

- Public: rendering engine, types, content provider contract, sample content, demo tests.
- Private downstream repos: real content, scrapers, translation workflows, deployment operations, private source diagnostics.

## Consumption

Downstream apps can import the package directly:

```ts
import { createGuideApp, createStaticContentProvider } from "guidekit-web";
import "guidekit-web/styles";
```

Provide a `SiteContent` object through `createStaticContentProvider`.
