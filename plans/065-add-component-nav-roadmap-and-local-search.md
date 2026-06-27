<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 065: Add component navigation, roadmap, and local search

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- src scripts/registry-component-progress.ts scripts/registry-component-progress-common.ts docs/component-conversion-checklist.md docs/component-conversion-checklist.json registry/index.json registry/docs plans/README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/062-replace-starter-app-with-docs-shell.md, plans/064-add-install-panel-and-copy-affordances.md
- **Category**: docs
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

The docs shell needs to become useful for browsing, not just direct links.
Users should be able to scan available components by namespace, search by name
or id, and see a product-polished roadmap without reading raw plan files. This
plan keeps search simple and local; full Pagefind search comes after prerender.

## Current state

- `docs/component-conversion-checklist.md` is a generated human-readable report
  with imported counts and blockers.
- `src/registry/schema.ts` already defines progress rows with readiness,
  lifecycle, blockers, recommended URLs, and docs URL.
- The docs shell from plan 062 should already have placeholder Components and
  Roadmap routes.

Relevant excerpts:

```md
docs/component-conversion-checklist.md:7-18
| Surface      | Imported | Total | Remaining |
| Base UI docs |       24 |    38 |        14 |
| shadcn docs  |       27 |    64 |        37 |

src/registry/schema.ts:200-220
export const OriginComponentProgressRow = S.Struct({
  itemId: S.String,
  namespace: OriginComponentProgressNamespace,
  docsUrl: S.String,
  originResolutionStatus: OriginResolutionStatus,
  hasOriginDocs: S.Boolean,
  hasOriginSource: S.Boolean,
  hasRegistryItem: S.Boolean,
  hasDossier: S.Boolean,
  ...
  readiness: OriginComponentProgressReadiness,
})
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Progress generation | `bun run origin:components:write` | exit 0; updates progress/checklist artifacts if designed to do so |
| Registry/docs build | `bun run registry:build` | exit 0 |
| Targeted tests | `bun run test -- src/story.test.ts src/scene.test.ts scripts/registry-component-progress-common.test.ts` | all pass |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Build | `bun run build` | exit 0 |
| Whitespace | `git diff --check -- src scripts docs registry plans` | exit 0 |

## Suggested executor toolkit

- Use generated structured progress data, not the Markdown checklist, as the
  Roadmap source. The Markdown can remain a report generated from the same data.
- If touching `scripts/registry-component-progress*.ts`, apply ADR 0003:
  Effect program style and Schema-derived boundary data for new surfaces.

## Scope

**In scope**:

- docs site Model/Message/update/view files under `src/**`
- local search module under `src/search/**` or similar
- Roadmap/progress data adapter under `src/**`
- progress artifact generation under `scripts/registry-component-progress*.ts`
  only if needed to emit structured docs-consumable JSON
- `docs/component-conversion-checklist.json` if it is the generated structured
  progress artifact
- `src/story.test.ts`
- `src/scene.test.ts`
- `plans/README.md` status row update

**Out of scope**:

- Do not add Pagefind.
- Do not add prerender.
- Do not implement fuzzy command-palette behavior.
- Do not show private components in the public component nav.
- Do not convert roadmap into a raw maintainer dump.

## Git workflow

- Branch: `codex/065-nav-roadmap-search`
- Commit after nav, roadmap, search, and tests pass.
- Do not push or open a PR unless the operator explicitly instructs it.

## Steps

### Step 1: Build namespace-aware component navigation

Render public component navigation from generated registry/docs artifacts:

- show `installable` and `preview` registry items.
- group by namespace: Base UI and shadcn.
- sort by component name within each namespace.
- mark preview items with a badge.
- hide private items from normal nav.

Do not flatten `base-ui/button` and `shadcn/button` into one ambiguous Button
entry.

**Verify**: `bun run test -- src/scene.test.ts` -> tests assert Base UI and
shadcn groups exist and Button routes are namespace-specific.

### Step 2: Add local search

Add a simple local search UI that filters over generated registry/docs index
records. It should match:

- item name
- item id
- namespace
- description
- lifecycle/availability badges

Use Foldkit messages for input updates, not imperative DOM listeners. This is
not Pagefind and does not search body Markdown yet.

**Verify**: `bun run test -- src/story.test.ts src/scene.test.ts` -> tests cover
typing "button", showing `shadcn/button`, and clearing the query.

### Step 3: Add Roadmap from structured progress data

Render the Roadmap page from structured progress data, not from
`docs/component-conversion-checklist.md`.

The page should show product-polished sections:

- available now counts.
- next candidates.
- blocked groups/categories.
- what is next.

Put maintainer details such as pinned refs, dossier paths, unresolved questions,
and raw blockers behind details or omit them from the first pass.

**Verify**: `bun run test -- src/scene.test.ts` -> tests assert Roadmap shows
counts, next candidates, and blocked rows without raw dossier-path noise.

### Step 4: Add active nav and responsive assertions

Make sidebar/top-nav active state follow the typed route. Add Scene tests for
active state and, if Playwright exists after plan 062, add one browser smoke for
mobile/desktop no-overlap behavior.

**Verify**: `bun run test -- src/scene.test.ts` -> active state tests pass.

### Step 5: Update the plan index

Mark plan 065 as DONE in `plans/README.md` when complete, unless a reviewer owns
the index.

**Verify**: `rg -n "\\| 065 \\| Add component navigation, roadmap, and local search \\| P1 \\| M \\| 062, 064 \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- Story tests for search query updates and clearing.
- Scene tests for component nav grouping, route active state, search results,
  Roadmap counts, and Roadmap blocked sections.
- Optional Playwright smoke for responsive nav if e2e infrastructure is present.

## Done criteria

- [ ] Component nav groups Base UI and shadcn separately.
- [ ] Public nav includes installable/preview items and excludes private items.
- [ ] Local search filters generated index records.
- [ ] Roadmap renders from structured progress data.
- [ ] Active nav state follows route.
- [ ] `bun run registry:build`, `bun run test`, `bun run typecheck`,
  `bun run check`, `bun run build`, and `git diff --check -- src scripts docs registry plans` exit 0.

## STOP conditions

Stop and report back if:

- There is no structured progress artifact to consume and adding one would
  require a broad rewrite of progress scripts.
- Search begins to require full Markdown indexing or Pagefind.
- The roadmap cannot distinguish public product data from maintainer-only data.

## Maintenance notes

This plan makes browsing useful before full-text search exists. Later Pagefind
work should complement, not replace, the local component search because component
metadata search is instant and registry-aware.

<!-- prettier-ignore-end -->
