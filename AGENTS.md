# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm 11/Turborepo TypeScript monorepo. Applications live in `apps/`: `web` is the Vite React app, `mobile` is the Expo Router React Native app, `api` is the Express/Mongoose service, and `e2e` contains Playwright suites. Shared packages live in `packages/`, including `api`, `components`, `constants`, `hooks`, `localizations`, `store`, `types`, `utils`, plus shared `eslint-config` and `vitest-config` workspaces. Unit tests are colocated under each workspace's `tests/`; public/static assets are under `apps/web/public` and `apps/mobile/assets`.

## Build, Test, and Development Commands

- `pnpm install` installs all workspace dependencies using the pinned pnpm version from `packageManager`.
- `pnpm dev` runs every workspace with a `dev` script through Turbo.
- `pnpm dev:ui` runs only the web and mobile UI apps.
- `pnpm --filter @belot/web dev`, `pnpm --filter @belot/mobile dev`, or `pnpm --filter @belot/api dev` starts one app.
- `pnpm build`, `pnpm lint`, and `pnpm typecheck` run the corresponding Turbo tasks.
- `pnpm test` runs Vitest across workspaces; `pnpm test:coverage` runs coverage.
- `pnpm test:e2e` runs the full Playwright suite through Turbo.
- `pnpm test:e2e:setup` installs Playwright Chromium; `pnpm test:e2e:web`, `pnpm test:e2e:mobile`, and `pnpm test:e2e:api` run targeted e2e suites.
- `pnpm lockfile:sync` refreshes `pnpm-lock.yaml`; `pnpm lockfile:check` verifies it with `--frozen-lockfile`.
- `pnpm precommit` runs the staged-file checks used by Husky: lockfile sync for changed package manifests, staged formatting checks, then targeted lint/typecheck.
- Mobile Android artifacts are built from `apps/mobile` with scripts such as `pnpm --filter @belot/mobile android:apk:debug`, `android:apk:release`, and `android:aab:release`.

## Coding Style & Naming Conventions

Use TypeScript and existing workspace patterns. Prettier is authoritative: 2-space indentation, semicolons, double quotes, trailing commas, 100-character print width, sorted imports, and Tailwind class sorting. Root formatting currently covers `js`, `jsx`, `ts`, `tsx`, and `md`; for other file types, rely on the precommit check or run Prettier directly. Prefer `camelCase` for variables/functions, `PascalCase` for React components and providers, and descriptive hook names beginning with `use`.

## Testing Guidelines

Vitest is the unit/integration test runner; Playwright is used for e2e coverage. Name tests `*.test.ts`, `*.test.tsx`, or `*.spec.ts` to match existing files. Add or update tests near the workspace being changed, especially for score calculation, store, hooks, feature toggles, API validators/routes, and user-facing flows. Use `pnpm --filter <workspace> test` for fast local checks, `pnpm --filter <workspace> test:coverage` when coverage-sensitive code changes, then run root checks before PRs.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit-style subjects such as `fix: resolve round undo issue...`, `fix: remove unnecessary checks...`, and scoped forms like `chore(mobile): bump version...`. Keep subjects imperative and scoped when useful. Before opening a PR, run `pnpm precommit` or the relevant `lint`, `typecheck`, and `test` commands. PRs should describe the change, note validation performed, link issues when applicable, and include screenshots for visible web or mobile UI changes.

## Security & Configuration Tips

Keep app secrets in local `.env` files only. Common local variables are `MONGODB_URI` for `apps/api`, `VITE_API_URL` for `apps/web`, and `EXPO_PUBLIC_API_BASE_URL` for `apps/mobile`. The API builds to `apps/api/dist/index.js` for Node hosting and exposes `/health` for service health checks. Do not commit generated credentials, local database data, Playwright reports, or Android release signing artifacts.
