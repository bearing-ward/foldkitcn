<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 062: Replace the starter app with a Foldkit CN docs shell

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- src/main.ts src/data.ts src/entry.ts src/styles.css src/story.test.ts src/scene.test.ts README.md package.json registry/index.json registry/docs docs/decisions/0002-foldkit-cn-documentation-site.md repos/foldkit/packages/website/src repos/foldkit/packages/website/public/logo.svg repos/foldkit/packages/website/public/logo-dark.svg`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/061-add-docs-artifact-schema-and-generator.md
- **Category**: docs
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

The current app is still the scaffolded dinosaur browser. It does not represent
Foldkit CN, the component registry, or the documentation product users need.
This plan replaces the starter screen with the first real docs shell: typed
routes, top nav, namespace-aware components index, Registry and Roadmap entry
points, dark-mode-ready styling, and enough test coverage to let later
component pages land safely.

## Current state

- `README.md` still says "My Foldkit App".
- `src/data.ts` contains dinosaur data.
- `src/main.ts` defines a `BrowseRoute` over dinosaur filters instead of docs
  routes.
- Package scripts already provide the verification lane for a Foldkit app.
- The vendored Foldkit website is the canonical reference for docs layout,
  route metadata, search, copy snippets, and prerender patterns.

Relevant excerpts:

```md
README.md:1-3
# My Foldkit App

A Foldkit application built with Effect.

src/data.ts:1-9
type Dinosaur = Readonly<{
  name: string
  period: string
  diet: string
  lengthMeters: number
  weightKg: number
}>

src/main.ts:120-129
export const BrowseRoute = r('Browse', {
  search: S.Option(S.String),
  sorting: Sorting,
  diet: S.Option(Diet),
  period: S.Option(Period),
})

package.json:6-18
"dev": "vite",
"build": "vite build",
"typecheck": "tsc --noEmit",
"test": "vitest run",
"check": "ultracite check --disable-nested-config",
"registry:build": "bun run scripts/build-registry.ts",
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Registry artifacts | `bun run registry:build` | exit 0; docs artifacts exist |
| Targeted app tests | `bun run test -- src/story.test.ts src/scene.test.ts` | all pass |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Build | `bun run build` | exit 0 |
| Whitespace | `git diff --check -- src README.md package.json plans` | exit 0 |

## Suggested executor toolkit

- Read `docs/decisions/0002-foldkit-cn-documentation-site.md` before changing
  routes or layout.
- Pattern-match against `repos/foldkit/packages/website/src/route.ts`,
  `repos/foldkit/packages/website/src/main.ts`, and
  `repos/foldkit/packages/website/src/view/docs.ts`, but do not copy unrelated
  playground/API complexity.

## Scope

**In scope**:

- `src/main.ts`
- `src/data.ts` (delete or replace only if no longer needed)
- `src/entry.ts` only if app boot metadata needs updating
- `src/styles.css`
- `src/story.test.ts`
- `src/scene.test.ts`
- new `src/docs/**`, `src/route.ts`, `src/componentDocs/**`, or similar local
  modules if splitting `main.ts` is clearer
- `README.md`
- `package.json` only for docs-app scripts that directly support this shell
- `plans/README.md` status row update

**Out of scope**:

- Do not implement generated component detail pages beyond a simple placeholder
  that can load docs artifacts.
- Do not implement live examples.
- Do not add Pagefind or prerender in this plan.
- Do not implement the installer CLI.
- Do not change registry schemas; that belongs to plan 061.

## Git workflow

- Branch: `codex/062-docs-shell`
- Commit once the shell, tests, and README pass verification.
- Do not push or open a PR unless the operator explicitly instructs it.

## Steps

### Step 1: Replace dinosaur routes with docs routes

Define typed Foldkit routes using `r()` for:

- `Home`
- `Docs`
- `ComponentsIndex`
- `ComponentsNamespace` with `namespace`
- `ComponentDetail` with `namespace` and `slug`
- `Registry`
- `RegistrySchema`
- `RegistryLifecycle`
- `Roadmap`
- `NotFound`

Keep URL paths namespace-explicit:

- `/components`
- `/components/base-ui`
- `/components/shadcn`
- `/components/base-ui/button`
- `/components/shadcn/button`
- `/registry`
- `/registry/schema`
- `/registry/lifecycle`
- `/roadmap`

Use keyed route branches in the view when rendering structurally different
pages, following the local AGENTS.md instruction.

**Verify**: `bun run test -- src/story.test.ts` -> route parsing/building tests pass.

### Step 2: Load generated registry and docs index data

Create a small data module that imports or reads the generated registry and docs
index artifacts produced by plan 061. The runtime app should consume
`registry/index.json` and `registry/docs/index.json`; it must not scan
`registry-src/**`.

Represent missing artifacts as a typed error or fallback model state, not as
`null` or unchecked exceptions.

**Verify**: `bun run typecheck` -> exit 0 and no unchecked JSON typing errors.

### Step 3: Build the docs shell layout

Implement a first-pass docs shell with:

- top navigation: Home, Docs, Components, Registry, Roadmap.
- Foldkit logo plus "CN" text treatment using existing logo assets or simple
  text if asset import needs more setup.
- left/sidebar component navigation grouped by namespace.
- main content area.
- right-side or in-page table-of-contents placeholder.
- mobile-friendly nav state.
- dark-mode-ready CSS variables/classes based on the Foldkit website palette.

Do not create nested cards for page sections. Keep docs pages as unframed
content bands or constrained layouts.

**Verify**: `bun run test -- src/scene.test.ts` -> Scene tests can locate nav
landmarks, Components, Registry, Roadmap, and a component namespace group.

### Step 4: Add placeholder pages

Add minimal but real pages for:

- Home: Foldkit CN component registry intro.
- Docs: short overview and links.
- Components: generated component index with installable and preview items only.
- Registry: source/generated split and registry artifact overview.
- Registry Schema: placeholder that will later summarize Schema-backed artifacts.
- Registry Lifecycle: lifecycle axes including docs readiness.
- Roadmap: placeholder driven by generated progress data later.

Avoid marketing filler. Each page should be useful as a navigation target even
before detailed content lands.

**Verify**: `bun run test -- src/scene.test.ts` -> tests assert each route renders
an `h1` with the expected accessible name.

### Step 5: Update README.md

Replace the starter README with a short project front door:

- what Foldkit CN is.
- how to run dev/build/typecheck/test/check.
- where implementation plans live.
- where registry source and generated docs artifacts live.
- note that the docs site is generated from registry artifacts.

**Verify**: `rg -n "Foldkit CN|registry-src|registry/docs|bun run dev|plans/README.md" README.md` -> exit 0.

### Step 6: Update the plan index

Mark plan 062 as DONE in `plans/README.md` when complete, unless a reviewer owns
the index.

**Verify**: `rg -n "\\| 062 \\| Replace the starter app with a Foldkit CN docs shell \\| P1 \\| L \\| 061 \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- Story tests for route parsing/building and route-change model updates.
- Scene tests for top nav, sidebar namespace groups, route headings, Not Found,
  and generated component index filtering.
- Build smoke through `bun run build`.

## Done criteria

- [ ] Dinosaur data and browse UI are gone from the runtime app.
- [ ] Docs routes are Schema-backed Foldkit routes.
- [ ] The shell renders Home, Docs, Components, Registry, Registry Schema,
  Registry Lifecycle, Roadmap, and Not Found pages.
- [ ] The component nav groups Base UI and shadcn separately.
- [ ] CSS has light/dark-ready docs shell tokens based on Foldkit identity.
- [ ] README is no longer starter content.
- [ ] `bun run registry:build`, `bun run test`, `bun run typecheck`,
  `bun run check`, `bun run build`, and `git diff --check -- src README.md package.json plans` exit 0.

## STOP conditions

Stop and report back if:

- Plan 061 did not produce `registry/docs/index.json`.
- Importing generated JSON requires a build-system change larger than this plan.
- The docs shell starts requiring live examples or Pagefind.
- The design starts copying shadcn.com visuals instead of using Foldkit identity.

## Maintenance notes

Later plans should add content and behavior to this shell rather than replacing
it. Reviewers should scrutinize route keying, generated data boundaries, mobile
layout, and whether the shell accidentally reads from `registry-src/**` at
runtime.

<!-- prettier-ignore-end -->
