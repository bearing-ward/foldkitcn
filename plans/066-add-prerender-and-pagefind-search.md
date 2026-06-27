<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 066: Add static prerender and Pagefind search

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- package.json vite.config.ts src scripts registry/docs repos/foldkit/packages/website/scripts/prerender.ts repos/foldkit/packages/website/pagefind.yml repos/foldkit/packages/website/src/search`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/065-add-component-nav-roadmap-and-local-search.md
- **Category**: docs
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

Component docs should be shareable, indexable, and searchable without a server.
Foldkit's own website already proves the architecture: build the Vite app,
prerender route HTML with a browser runtime, then run Pagefind against rendered
HTML. This plan adapts that pattern to Foldkit CN's registry-derived routes.

## Current state

- Foldkit CN currently has `dev`, `build`, and `preview` scripts, but no
  prerender or Pagefind scripts.
- The Foldkit website has local examples for `pagefind.yml`, `prerender`, and a
  search submodel.

Relevant excerpts:

```json
package.json:6-10
"dev": "vite",
"build": "vite build",
"preview": "vite preview",
"typecheck": "tsc --noEmit",

repos/foldkit/packages/website/package.json:19-21
"prerender": "tsx scripts/prerender.ts",
"postprerender": "pagefind",
"preview:search": "pnpm build && pnpm prerender && vite preview"

repos/foldkit/packages/website/pagefind.yml:1-4
site: dist
exclude_selectors:
  - pre
  - '[data-pagefind-ignore]'
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Registry/docs build | `bun run registry:build` | exit 0 |
| App build | `bun run build` | exit 0 |
| Prerender | `bun run docs:prerender` | exit 0; route HTML files are produced under `dist` |
| Pagefind | `bun run docs:search` or postprerender script | exit 0; `dist/pagefind` exists |
| E2E smoke | `bunx playwright test` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Whitespace | `git diff --check -- package.json scripts src vite.config.ts pagefind.yml plans` | exit 0 |

## Suggested executor toolkit

- Adapt concepts from `repos/foldkit/packages/website/scripts/prerender.ts`, but
  keep Foldkit CN's implementation smaller and registry-route-focused.
- If adding a new CLI script, follow ADR 0003: Effect-native program,
  `effect/unstable/cli`, Schema-derived boundaries.

## Scope

**In scope**:

- `package.json`
- `pagefind.yml` (create)
- `scripts/prerender.ts` or similarly named docs prerender script (create)
- `src/**` only for route inventory/metadata/search wiring needed by prerender
- `vite.config.ts` only if required for static asset handling
- Playwright e2e test files if absent or needing docs smoke
- `plans/README.md` status row update

**Out of scope**:

- Do not add a server-rendered architecture.
- Do not implement live examples.
- Do not change component docs content.
- Do not replace the local metadata search from plan 065; Pagefind adds
  full-text body search.

## Git workflow

- Branch: `codex/066-prerender-pagefind`
- Commit after prerender, Pagefind, e2e, and verification pass.
- Do not push or open a PR unless the operator explicitly instructs it.

## Steps

### Step 1: Add route inventory and metadata

Create or extend route metadata helpers so every public route can be listed for
prerender:

- Home
- Docs
- Components index and namespace pages
- every installable/preview component detail page
- Registry pages
- Roadmap

Metadata should include title, description, and section. It should derive
component route metadata from generated docs artifacts.

**Verify**: `bun run test -- src/story.test.ts` -> tests cover route inventory
contains `/components/shadcn/button` and `/registry/lifecycle`.

### Step 2: Add prerender script

Add a script that builds static HTML for every route in the inventory using the
built Vite app and Playwright/headless browser, following the Foldkit website's
pattern. Keep the implementation focused; do not copy playground/API special
cases from the Foldkit website.

If the script takes flags, use `effect/unstable/cli`. If it has no flags, it can
still be an Effect program that reads route inventory and writes files.

**Verify**: `bun run build && bun run docs:prerender` -> exit 0 and files exist
for `/components/shadcn/button`, `/registry`, and `/roadmap`.

### Step 3: Add Pagefind

Add `pagefind` as a dev dependency if not present. Add `pagefind.yml` and a
script that runs Pagefind after prerender. Exclude code blocks and elements with
`data-pagefind-ignore`.

**Verify**: `bun run docs:search && test -d dist/pagefind` -> exit 0.

### Step 4: Wire full-text search UI

Add a Pagefind-backed search path modeled after the Foldkit website search
submodel. It should be optional/fallback-safe when Pagefind assets are absent in
dev. Local component metadata search from plan 065 should still work.

**Verify**: `bun run test -- src/story.test.ts src/scene.test.ts` -> search state
tests pass without requiring Pagefind network assets.

### Step 5: Add e2e smoke

Add Playwright smoke that:

- opens the built/previewed docs app.
- visits `/components/shadcn/button`.
- opens search and finds Button.
- verifies no major responsive overlap at a mobile and desktop viewport.

**Verify**: `bunx playwright test` -> exit 0.

### Step 6: Update the plan index

Mark plan 066 as DONE in `plans/README.md` when complete, unless a reviewer owns
the index.

**Verify**: `rg -n "\\| 066 \\| Add static prerender and Pagefind search \\| P2 \\| L \\| 065 \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- Story tests for route inventory and metadata.
- Scene tests for search fallback and search UI.
- Playwright e2e for static route, search, and responsive smoke.
- Script-level tests for route inventory if helpers are pure.

## Done criteria

- [ ] `bun run docs:prerender` produces static route HTML.
- [ ] Pagefind index is generated under `dist/pagefind`.
- [ ] Full-text search can find Button after prerender.
- [ ] Route metadata exists for generated component routes.
- [ ] `bun run test`, `bun run typecheck`, `bun run check`, `bun run build`,
  `bun run docs:prerender`, Pagefind script, Playwright e2e, and
  `git diff --check -- package.json scripts src vite.config.ts pagefind.yml plans` exit 0.

## STOP conditions

Stop and report back if:

- Prerender requires a server architecture or SSR rewrite.
- Pagefind cannot index generated routes without large structural changes.
- The route inventory cannot be generated from docs artifacts.
- The script cannot satisfy ADR 0003 when adding CLI flags.

## Maintenance notes

Static prerender is the point where docs become publishable. Reviewers should
check route coverage, metadata correctness, and whether generated docs routes
are missed when new components become installable or preview.

<!-- prettier-ignore-end -->
