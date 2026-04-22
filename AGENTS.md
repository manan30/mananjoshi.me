# AGENTS.md

Guidance for coding agents operating in this repository.

## Project Overview

- This repo powers `mananjoshi.me`, a personal portfolio + blog-style site built with Astro, React islands, TypeScript, and Tailwind.
- Primary purpose: present professional profile info, career journey, technical writing, and selected projects in a lightweight static site.
- Content is CMS-driven via Contentful (`profile`, `blogPost`, `project`, `journey`) through `src/services/contentful/*`.
- Main routes: home (`/`), articles index + article detail (`/articles`, `/articles/[slug]`), and journey timeline (`/journey`).
- Articles are statically generated from slugs and rendered from Markdown; journey duties are rendered from Contentful rich text.
- Navigation and metadata are centralized in shared layout/components, with resume and social/profile links for recruiter/peer-facing discovery.

## Repository Structure

- App code lives in `src/`.
- Routes/pages are in `src/pages/` (`.astro` files, dynamic route in `articles/[slug].astro`).
- Shared layout is in `src/layouts/BaseLayout.astro`.
- UI components are in `src/components/`.
- Contentful service access is in `src/services/contentful/`.
- Constants/helpers are in `src/utils/`.

## Install and Run

- Install deps: `bun install`
- Start dev server: `bun run dev`
- Alternate dev alias: `bun run start`
- Production build: `bun run build`
- Preview production build: `bun run preview`

## Lint and Format

- Check formatting + lint rules: `bun run tooling:check`
- Auto-fix formatting + safe lint fixes: `bun run tooling:fix`
- Biome is configured to organize imports automatically.

## Test Commands

- Current status: no dedicated test runner is configured in `package.json`.
- There are currently no `*.test.*` or `*.spec.*` files in the repo.
- Do not assume `bun run test` exists unless you add and document it.

### Single-Test Guidance (Important)

- Since no test framework is configured, there is no current single-test command.
- If you introduce Vitest, standardize these scripts:
  - `"test": "vitest run"`
  - `"test:watch": "vitest"`
- Then run one file: `bunx vitest run src/path/to/file.test.ts`
- Then run one test by name: `bunx vitest run -t "test name"`
- If you add a test runner, update this `AGENTS.md` in the same change.

## Required Pre-PR Validation

- Run `bun run tooling:check`.
- Run `bun run build` for integration-level validation.
- If tests are added in your change, run the narrowest relevant test command plus full test run.

## Cursor and Copilot Rules

- Checked for `.cursorrules`: not present.
- Checked for `.cursor/rules/`: not present.
- Checked for `.github/copilot-instructions.md`: not present.
- Therefore, this file is currently the primary agent instruction source in-repo.

## Code Style: Source of Truth

- Primary source: `biome.jsonc`.
- Follow existing file conventions over personal preferences.
- Keep diffs minimal; avoid broad refactors unless requested.

## Formatting Conventions

- Use Biome formatting; do not hand-tune spacing.
- Existing codebase style uses tabs for indentation.
- Prefer double quotes in TS/TSX (as already used throughout `src/`).
- Keep semicolons consistent with existing style (present in TS/TSX).
- Let Biome organize imports instead of manual sorting wars.

## Import Conventions

- Group imports logically:
  1. external packages,
  2. internal modules,
  3. styles/assets when relevant.
- Use `import type` for type-only imports (already used in services).
- Prefer relative imports consistent with nearby files.
- Re-export public service APIs via local index files where pattern exists (see `src/services/contentful/index.ts`).

## TypeScript Conventions

- `strict` TypeScript baseline is enabled via Astro config.
- Avoid `any`; Biome warns on explicit `any`.
- Prefer narrow explicit object types for Contentful fields.
- Use `readonly` env typing in `ImportMetaEnv` when extending env contracts.
- Model optional external data with `?` and handle undefined paths safely in UI code.
- Avoid non-null assertions (`!`) unless unavoidable; Biome warns on them.

## Naming Conventions

- Components: PascalCase (`Menu.tsx`, `BaseLayout.astro`).
- Variables/functions: camelCase.
- Constants: camelCase unless true global constants require UPPER_SNAKE_CASE.
- Enum members: UPPER_SNAKE_CASE style is currently used (`JourneyType`).
- File names:
  - Astro/React components: PascalCase files.
  - Service/helper modules: camelCase files.

## Astro + React Patterns

- Keep page-level data loading in Astro frontmatter when practical.
- Keep presentational concerns in components.
- In React islands/components, keep state local unless shared state is necessary.
- Preserve existing Tailwind utility style; avoid introducing a second styling paradigm.
- Reuse existing section/card/header component patterns before creating new abstractions.

## Contentful/Data Access Patterns

- Use the shared client in `src/services/contentful/client.ts`.
- Keep query helpers in service modules (`articlesData.ts`, `projectsData.ts`, etc.).
- Return normalized shapes when useful, but follow existing call-site expectations.
- Keep content type IDs and query params explicit and close to the query.
- Avoid embedding Contentful access logic directly in page/component markup.

## Error Handling and Resilience

- Prefer fail-fast behavior for truly required data on critical pages.
- For optional UI content, degrade gracefully (render fallback/empty state).
- Do not swallow errors silently; either:
  - let them propagate, or
  - catch and rethrow with contextual message.
- Add targeted guards around possibly missing CMS fields before deep property access.
- Keep error handling consistent within a module; avoid mixed patterns.

## Environment Variables

- Required env vars are declared in `src/env.d.ts`:
  - `CONTENTFUL_SPACE_ID`
  - `CONTENTFUL_ACCESS_TOKEN`
  - `CONTENTFUL_PREVIEW_ACCESS_TOKEN`
- Respect `import.meta.env.PROD` behavior in the Contentful client.
- Never hardcode secrets or tokens.

## Agent Change Discipline

- Make focused edits only for requested scope.
- Do not rename/move files unless needed for the task.
- Avoid adding dependencies unless necessary; justify in PR notes.
- When adding scripts or conventions, reflect them in this file.
- If you discover conflicting conventions, follow existing local patterns and document rationale.

## Quick Checklist Before Finishing

- Code compiles/builds: `bun run build`.
- Lint/format passes: `bun run tooling:check`.
- Imports are organized and types are clean.
- No unused variables/types introduced.
- Any new operational command is documented here.
