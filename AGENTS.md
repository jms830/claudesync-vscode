# Repository Guidelines

## Project Structure & Module Organization
- Root: VS Code extension (TypeScript) built with esbuild to `dist/`.
- Source: `src/` (entry: `src/extension.ts`, API client: `src/claude/client.ts`, utilities and managers under `src/*Manager.ts`).
- Assets: `assets/` (icons), `resources/` (command icons), debug config in `.vscode/`.
- No dedicated test directory yet. Build artifacts live in `dist/` (ignored).

## Build, Test, and Development Commands
- `yarn dev`: Watch build via `esbuild.js`; use VS Code `F5` to launch Extension Development Host.
- `yarn build`: Type-check then production build to `dist/extension.js`.
- `yarn check-types`: Run `tsc --noEmit` (strict TS settings).
- `yarn lint` / `yarn format`: Apply Biome linting/formatting; `:check` variants run read-only.
- `yarn publish`: Publish with `vsce` (requires auth); prepublish runs type, lint, build.

## Coding Style & Naming Conventions
- Language: TypeScript (ES2022, Node16 modules, strict mode).
- Formatting/Linting: Biome is source of truth.
  - 2-space indent, LF endings, single quotes, semicolons, trailing commas.
- Structure: use `camelCase` for vars/functions, `PascalCase` for classes, `kebab-case` file names where practical.
- Keep VS Code APIs in `extension.ts`; isolate network calls in `src/claude/`.

## Testing Guidelines
- Current: No formal test suite. Required: `yarn check-types` and `yarn lint:check` must pass.
- Manual: Run in Extension Host (`F5`), verify commands (e.g., “ClaudeSync: Sync Workspace”).
- If adding tests later, co-locate near code or in `tests/`, name `*.test.ts`.

## Commit & Pull Request Guidelines
- Commits: Follow Conventional Commits (e.g., `feat:`, `fix:`, `chore:`) as used in history.
- PRs: Include a concise description, linked issues (`fixes #123`), screenshots or logs when UI/UX changes, and manual test steps.
- Keep changes focused; update README if user-facing behavior or settings change.

## Security & Configuration Tips
- Never commit secrets. The Claude `sessionToken` is user-provided and must not be logged or stored in git.
- `claudesync.json` is auto-added to `.gitignore` (configurable); keep project-specific `.projectinstructions` in repo if appropriate.
