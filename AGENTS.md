# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm/Turborepo TypeScript monorepo. Applications live in `apps/`: `web` is the Vite React app, `mobile` is the Expo React Native app, `api` is the Express/MongoDB service, and `e2e` contains Playwright tests. Shared code lives in `packages/`, including `api`, `components`, `constants`, `hooks`, `localizations`, `store`, `types`, and `utils`. Unit tests are colocated in each workspace under `tests/`; public/static assets are under `apps/web/public` and `apps/mobile/assets`.

## Build, Test, and Development Commands

- `pnpm install` installs all workspace dependencies.
- `pnpm dev` runs every workspace with a `dev` script through Turbo.
- `pnpm dev:ui` runs only the web and mobile UI apps.
- `pnpm --filter @belot/web dev`, `pnpm --filter @belot/mobile dev`, or `pnpm --filter @belot/api dev` starts one app.
- `pnpm build`, `pnpm lint`, and `pnpm typecheck` run the corresponding Turbo tasks.
- `pnpm test` runs Vitest across workspaces; `pnpm test:coverage` runs coverage.
- `pnpm test:e2e:setup` installs Playwright Chromium; `pnpm test:e2e:web`, `pnpm test:e2e:mobile`, and `pnpm test:e2e:api` run targeted e2e suites.

## Coding Style & Naming Conventions

Use TypeScript and existing workspace patterns. Prettier is authoritative: 2-space indentation, semicolons, double quotes, trailing commas, 100-character print width, sorted imports, and Tailwind class sorting. Run `pnpm format` or `pnpm format:check` before submitting broad edits. Prefer `camelCase` for variables/functions, `PascalCase` for React components and providers, and descriptive hook names beginning with `use`.

## Testing Guidelines

Vitest is the unit/integration test runner; Playwright is used for e2e coverage. Name tests `*.test.ts`, `*.test.tsx`, or `*.spec.ts` to match existing files. Add or update tests near the workspace being changed, especially for score calculation, store, hooks, API validators, and user-facing flows. Use `pnpm --filter <workspace> test` for fast local checks, then run root checks before PRs.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit-style subjects such as `ci: update action versions...`, `docs: add README...`, and scoped forms like `chore(mobile): bump version...`. Keep subjects imperative and scoped when useful. Before opening a PR, run `pnpm precommit` or the relevant `lint`, `typecheck`, and `test` commands. PRs should describe the change, note validation performed, link issues when applicable, and include screenshots for visible web or mobile UI changes.

## Security & Configuration Tips

Keep app secrets in local `.env` files only. Common local variables are `MONGODB_URI` for `apps/api`, `VITE_API_URL` for `apps/web`, and `EXPO_PUBLIC_API_BASE_URL` for `apps/mobile`. Do not commit generated credentials, local database data, or release signing artifacts.
