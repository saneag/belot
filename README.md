# Belot

Belot is a scorekeeping app for Belot games. This repository is a PNPM
and Turborepo monorepo with web, mobile, API, end-to-end test, and shared
package workspaces.

## Workspace Structure

- `apps/web` - Vite, React, React Router, Tailwind CSS web app.
- `apps/mobile` - Expo and React Native mobile app.
- `apps/api` - Express API backed by MongoDB.
- `apps/e2e` - Playwright end-to-end tests for web, mobile-web, and API flows.
- `packages/api` - API client, React Query hooks, and API types.
- `packages/components` - shared UI and context components.
- `packages/constants` - shared game, theme, storage, and feature-toggle constants.
- `packages/hooks` - shared game, settings, feature-toggle, and form hooks.
- `packages/localizations` - i18next setup and translations.
- `packages/store` - Zustand game state store.
- `packages/types` - shared TypeScript domain types.
- `packages/utils` - shared score, player, points type, and devtools utilities.
- `packages/eslint-config` and `packages/vitest-config` - shared tooling config.

## Prerequisites

- Node.js `>=18`
- PNPM `11.9.0`
- MongoDB for running the API locally
- Android Studio, an emulator, or a physical device for mobile
  development
- Playwright browsers for end-to-end tests

## Setup

Install dependencies from the repository root:

```bash
pnpm install
```

Install Playwright's Chromium browser before running end-to-end tests:

```bash
pnpm test:e2e:setup
```

## Environment Variables

Create environment files only for the apps you run locally.

`apps/api/.env`:

```bash
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/belot
```

`apps/web/.env`:

```bash
VITE_API_URL=http://127.0.0.1:3001
```

`apps/mobile/.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:3001
```

When running the mobile app on a physical device, use an API URL that the device
can reach from the same network instead of `127.0.0.1`.

## Development

Run every workspace with a `dev` script:

```bash
pnpm dev
```

Run only the web and mobile UI apps:

```bash
pnpm dev:ui
```

Run a specific app:

```bash
pnpm --filter @belot/web dev
pnpm --filter @belot/mobile dev
pnpm --filter @belot/api dev
```

Useful app-specific commands:

```bash
pnpm --filter @belot/web preview
pnpm --filter @belot/mobile android
pnpm --filter @belot/mobile ios
pnpm --filter @belot/api start
```

For Android release build instructions, see
[`apps/mobile/README.md`](apps/mobile/README.md).

## Quality Checks

Run the main checks from the repository root:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm format:check
```

Format supported source and Markdown files:

```bash
pnpm format
```

Run end-to-end tests:

```bash
pnpm test:e2e:web
pnpm test:e2e:mobile
pnpm test:e2e:api
pnpm test:e2e
```

The e2e scripts start their required local targets automatically and default to:

- web: `http://127.0.0.1:5173`
- mobile web: `http://127.0.0.1:8081`
- API: `http://127.0.0.1:3001`

## Repository Maintenance

- `pnpm precommit` runs the staged-file format check and targeted lint/typecheck
  workflow used by Husky.
- `pnpm lockfile:sync` updates `pnpm-lock.yaml` after package manifest changes.
- `pnpm lockfile:check` verifies the lockfile with a frozen install.
- `pnpm nuke` removes nested `node_modules` directories inside the repository.
