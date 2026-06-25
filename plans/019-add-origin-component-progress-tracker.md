# Plan 019: Add origin component progress tracking to add-registry-component

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat 3c196e89..HEAD -- .agents/skills/add-registry-component/SKILL.md package.json scripts src/registry tests/parity plans/README.md docs/decisions/0001-foldkit-registry-architecture.md registry-src`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `3c196e89`, 2026-06-25

## Why this matters

Component intake currently has the right raw material but no live, authoritative
checklist. Plan 004 and Plan 007 generated useful queue snapshots, but those
snapshots are now stale because later work imported `base-ui/meter`,
`shadcn/alert`, and `shadcn/native-select`. The registry needs a source-derived
progress view that compares the pinned Base UI and shadcn origin surfaces with
the actual local registry source, parity slots, dossiers, and blockers each
time it runs.

This plan adds that progress layer and teaches the `add-registry-component`
skill two new modes:

- `status`: show current origin-vs-imported counts and checklist state.
- `next [count]`: select the next implementation-ready origin rows, defaulting
  to one row, with exact URLs and dependency/blocker context.

The output must stay aligned with ADR 0001: lifecycle is multi-dimensional, so
do not collapse imported, parity, dossier, drift, availability, and blocker
state into one overloaded enum.

## Current state

Relevant files and roles:

- `.agents/skills/add-registry-component/SKILL.md` - the user-facing planning
  skill contract. It currently accepts origin URLs only and lists no `status` or
  `next` mode.
- `scripts/origin-common.ts` - resolves pinned Base UI and shadcn evidence from
  local origin repos, including held docs/example-only shadcn rows.
- `scripts/draft-registry-component-plan.ts` - writes dossier previews from one
  or more origin URLs.
- `scripts/registry-common.ts` - loads and validates `registry-src/**/item.json`
  and builds/checks `registry/index.json`.
- `tests/parity/slots.ts` - source of truth for current parity slots.
- `plans/artifacts/004-foundational-component-backlog/component-backlog.md` -
  historical first-wave queue and priority guidance.
- `plans/artifacts/007-remaining-component-queue/component-queue.md` -
  historical remaining queue and useful derivation commands.
- `docs/decisions/0001-foldkit-registry-architecture.md` - accepted architecture
  decision for registry lifecycle and origin evidence.

Current skill contract excerpt:

```md
.agents/skills/add-registry-component/SKILL.md

## Contract

- Accept an origin docs or registry URL.
- Resolve origin evidence from pinned local repositories first with `bun run origin:resolve -- <url>`.
- Treat live docs pages as discovery inputs, not parity oracles.
- Write an improve-compatible dossier and plan preview, not implementation code.
```

Current origin resolver surface:

```ts
scripts/origin-common.ts

export const resolveOriginUrl = (docsUrl: string) => {
  if (docsUrl.startsWith('https://base-ui.com/react/components/')) {
    const maybeSlug = parseBaseUiComponentSlug(docsUrl)

    if (maybeSlug !== undefined) {
      return baseUiResolution(docsUrl, maybeSlug)
    }
  }

  if (
    docsUrl.startsWith('https://ui.shadcn.com/docs/components/') ||
    docsUrl.includes('.json')
  ) {
    const maybeSlug = parseShadcnComponentSlug(docsUrl)

    if (maybeSlug !== undefined) {
      return shadcnResolution(docsUrl, maybeSlug)
    }
  }

  throw new Error(`Unsupported origin URL: ${docsUrl}`)
}
```

Current held-row support already exists in `scripts/origin-common.ts`:

```ts
export interface HeldShadcnRow {
  readonly itemId: string
  readonly status: 'blocked'
  readonly docsUrl: string
  readonly localRepoPath: 'repos/ui'
  readonly resolutionStatus: OriginResolutionType['resolutionStatus']
  readonly missingPrimarySourcePath?: string
  readonly blockers: ReadonlyArray<string>
  readonly unresolvedQuestions: ReadonlyArray<string>
  readonly pinnedRef: string
}
```

Current registry loading helper:

```ts
scripts/registry-common.ts

export const loadRawManifestEntries = (): ReadonlyArray<RawManifestEntry> =>
  walkManifestPaths(registrySourceRoot)
    .toSorted((left, right) => left.localeCompare(right))
    .map(manifestPath => ({
      manifestPath,
      rawManifest: readJson(manifestPath),
    }))
```

Current parity slots are explicit and imported from one array:

```ts
tests/parity/slots.ts

export interface ParitySlot {
  readonly itemId: string
  readonly status: 'planned' | 'ready'
  readonly originFixtureEntrypoint: string
  readonly foldkitFixtureEntrypoint: string
  readonly comparisons: ReadonlyArray<ComparisonKind>
}

export const paritySlots: ReadonlyArray<ParitySlot> = [
  {
    itemId: 'base-ui/button',
    status: 'ready',
    ...
  },
]
```

ADR 0001 constraints to preserve:

```md
docs/decisions/0001-foldkit-registry-architecture.md

Lifecycle is multi-dimensional: implementation status, parity status, drift
status, and availability are tracked independently. They must not collapse into
one overloaded enum.

Upstream drift is visible but non-blocking by default because pinned components
remain reproducible until an explicit upgrade plan accepts new evidence.
```

Current live counts from the pinned local origins and `registry-src`:

- Base UI origin docs surface: 38 items.
- Base UI imported registry items: 4 items:
  `base-ui/button`, `base-ui/meter`, `base-ui/progress`,
  `base-ui/separator`.
- shadcn docs surface: 59 items.
- shadcn `base-nova` source-file surface: 55 items.
- shadcn imported registry items: 8 items:
  `shadcn/alert`, `shadcn/badge`, `shadcn/button`, `shadcn/kbd`,
  `shadcn/native-select`, `shadcn/progress`, `shadcn/separator`,
  `shadcn/skeleton`.
- shadcn docs/example-only rows without `base-nova` source files:
  `shadcn/data-table`, `shadcn/date-picker`, `shadcn/toast`,
  `shadcn/typography`.
- `shadcn/chart` has a `base-nova` source file but is
  `foundation-gated`.

Current stale queue risk:

- `plans/artifacts/007-remaining-component-queue/component-queue.md` says it
  was generated on 2026-06-24 and lists `base-ui/meter`, `shadcn/alert`, and
  `shadcn/native-select` in the queue.
- Those three items now have checked-in `registry-src/**/item.json` manifests.
- Therefore historical queues can be priority hints, but they cannot be the
  source of truth for progress.

Repo conventions that apply:

- Use Bun scripts. `package.json` defines `registry:check`, `origin:resolve`,
  `parity:check`, `test`, `typecheck`, `check`, and `build`.
- Use Effect Schema for boundary data. `src/registry/schema.ts` already defines
  registry lifecycle, provenance, dependency, parity, and index schemas.
- Generated registry output belongs under `registry/`; human-authored registry
  source belongs under `registry-src/`.
- The add-registry-component workflow must not create `registry-src/<id>`
  folders during planning.
- React and upstream Base UI or Radix packages are fixture evidence only, never
  installable Foldkit runtime dependencies.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Registry validation | `bun run registry:check` | exit 0; prints `Validated 14 source manifest(s).` and `Verified registry/index.json is current.` |
| Origin resolver focused check | `bun run origin:resolve -- https://ui.shadcn.com/docs/components/typography` | exit 0; JSON includes `"resolutionStatus": "docs-example-only"` |
| Parity dry-run | `bun run parity:check -- --dry-run` | exit 0; lists planned parity work without browser failures |
| Unit tests | `bun run test` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Build | `bun run build` | exit 0 |

## Scope

**In scope**:

- `.agents/skills/add-registry-component/SKILL.md`
- `package.json`
- `scripts/origin-common.ts`
- `scripts/registry-component-progress.ts` (create)
- `scripts/registry-component-progress-common.ts` (create)
- `scripts/registry-component-progress-common.test.ts` (create)
- `scripts/check-registry.ts`
- `scripts/registry-common.ts` if needed to reuse manifest loading cleanly
- `src/registry/schema.ts`
- `src/registry/schema.test.ts`
- `tests/parity/slots.ts` only if a type export or import shape must be
  adjusted
- `docs/component-conversion-checklist.md` (generated output, create)
- `docs/component-conversion-checklist.json` (generated output, create)
- `plans/README.md`

**Out of scope**:

- Do not implement any new component.
- Do not create or modify `registry-src/<namespace>/<item>/` folders except
  for tests that use temporary fixtures.
- Do not change origin repos under `repos/base-ui`, `repos/ui`, or
  `repos/foldkit`.
- Do not change parity fixture behavior except to read slot metadata.
- Do not fetch live upstream docs or update submodules.
- Do not rewrite historical plan artifacts. They are useful historical
  evidence; the new tracker should filter them or supersede them.

## Git workflow

- Branch: `codex/019-origin-component-progress-tracker`.
- Commit message style: conventional commits are already used, for example
  `feat: verify registry index freshness`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Add schema-backed progress data shapes

Extend `src/registry/schema.ts` with Effect Schema definitions for the progress
ledger. Keep these as boundary shapes that scripts can decode and tests can
assert.

Add schemas similar to:

- `OriginComponentProgressNamespace`: `base-ui | shadcn`.
- `OriginComponentProgressReadiness`: `imported | ready-for-dossier |
  dossier-ready | blocked`.
- `OriginComponentProgressRow`:
  - `itemId`
  - `namespace`
  - `docsUrl`
  - `originResolutionStatus`
  - `hasOriginDocs`
  - `hasOriginSource`
  - `hasRegistryItem`
  - `hasDossier`
  - `dossierPaths`
  - `paritySlotStatus` as `not-started | planned | ready`
  - `implementationStatus`
  - `parityStatus`
  - `driftStatus`
  - `availability`
  - `blockers`
  - `unresolvedQuestions`
  - `recommendedUrls`
  - `priorityHint`
  - `readiness`
- `OriginComponentProgressSummary`:
  - total/imported/remaining counts for Base UI and shadcn docs surface
  - shadcn source-file count
  - docs/example-only count
  - blocked count
  - ready-for-dossier count
  - dossier-ready count
  - generated-at source refs for `repos/base-ui` and `repos/ui`
- `OriginComponentProgressReport`:
  - `schemaVersion`
  - `generatedAt`
  - `summary`
  - `rows`

Use existing `ImplementationStatus`, `ParityStatus`, `DriftStatus`,
`Availability`, and `OriginResolutionStatus` schemas where possible instead of
duplicating them.

Do not make `readiness` the only lifecycle state. It is a convenience for
operator queues; the row must still expose the separate lifecycle dimensions.

**Verify**: `bun run typecheck` -> exit 0.

### Step 2: Create the source-derived progress helper

Create `scripts/registry-component-progress-common.ts`.

The helper should derive rows from live sources each time it runs:

1. Enumerate Base UI origin item IDs from
   `repos/base-ui/docs/src/app/(docs)/react/components/*` directories.
2. Enumerate shadcn docs item IDs from
   `repos/ui/apps/v4/content/docs/components/base/*.mdx`.
3. Enumerate shadcn source-backed item IDs from
   `repos/ui/apps/v4/styles/base-nova/ui/*.tsx`.
4. Load imported registry item IDs from `registry-src/**/item.json`, preferably
   by reusing `checkRegistry()` or `loadRawManifestEntries()`.
5. Load parity slot status from `tests/parity/slots.ts`.
6. Load dossier coverage from `plans/artifacts/**/dossier.json`. Treat any
   `batch` entry or `rows[].itemId` entry as dossier coverage, but only after
   checking that the item is not already imported.
7. Resolve each origin row with `resolveOriginUrl()` where useful for
   `originResolutionStatus`, blockers, unresolved questions, dependency hints,
   and docs/source existence. For known held rows, rely on the existing
   `heldShadcnRowForSlug` behavior instead of duplicating blocker text.
8. Parse historical queue order from Plan 004 and Plan 007 only as a
   `priorityHint`. If parsing fails, fall back to deterministic namespace and
   item ID sorting.

Classification rules:

- `imported`: row has a `registry-src` manifest.
- `blocked`: row has `originResolutionStatus` of `docs-example-only` or
  `foundation-gated`, or resolver blockers are non-empty, unless it is already
  imported.
- `dossier-ready`: row has dossier coverage and is not imported or blocked.
- `ready-for-dossier`: row has origin docs, has acceptable source-backed
  evidence, is not imported, is not blocked, and has no dossier coverage.

Recommended URL rules:

- Base UI: `https://base-ui.com/react/components/<slug>`.
- shadcn: `https://ui.shadcn.com/docs/components/<slug>`.
- For mapped pairs that historical queues already pair, expose both URLs in one
  `recommendedUrls` array and one `next` row, but do not include imported items
  in that pair. For example, after `base-ui/progress` and `shadcn/progress` are
  imported, neither should be emitted by `next`.
- Keep one row to at most two URLs. This preserves the user's high-bar
  preference for one or two components at a time.

Export at least:

- `deriveOriginComponentProgress(): OriginComponentProgressReport`
- `selectNextOriginComponentRows(report, count): ReadonlyArray<OriginComponentProgressRow>`
- `renderOriginComponentProgressMarkdown(report): string`
- `formatOriginComponentStatus(report): string`
- `formatNextOriginComponentRows(rows): string`

**Verify**: `bun run test -- scripts/registry-component-progress-common.test.ts`
-> the new test file passes.

### Step 3: Add tests for counts, stale queues, blockers, and next selection

Create `scripts/registry-component-progress-common.test.ts`.

Test cases:

- Summary counts match the current pinned origin and registry surfaces:
  - Base UI: 38 total, 4 imported, 34 remaining.
  - shadcn docs surface: 59 total, 8 imported, 51 remaining.
  - shadcn source-file surface: 55.
  - shadcn docs/example-only rows: 4.
- Imported items include:
  - `base-ui/button`
  - `base-ui/meter`
  - `base-ui/progress`
  - `base-ui/separator`
  - `shadcn/alert`
  - `shadcn/badge`
  - `shadcn/button`
  - `shadcn/kbd`
  - `shadcn/native-select`
  - `shadcn/progress`
  - `shadcn/separator`
  - `shadcn/skeleton`
- Historical queue rows that are now imported do not appear in `next` output.
  At minimum assert that `base-ui/meter`, `shadcn/alert`, and
  `shadcn/native-select` are not returned by `selectNextOriginComponentRows`.
- Held rows stay blocked and visible:
  - `shadcn/data-table`
  - `shadcn/date-picker`
  - `shadcn/toast`
  - `shadcn/typography`
  - `shadcn/chart`
- `next 1` returns a deterministic implementation-ready row with
  `recommendedUrls`.
- `next 4` returns no imported rows, no blocked rows, and no more than four
  rows.
- Every returned row has separate lifecycle fields, not only `readiness`.

Use existing script tests as patterns:

- `scripts/origin-common.test.ts`
- `scripts/registry-common.test.ts`
- `tests/parity/parity-dry-run.test.ts`

**Verify**: `bun run test -- scripts/registry-component-progress-common.test.ts`
-> all new tests pass.

### Step 4: Add CLI commands for status, next, and generated checklist output

Create `scripts/registry-component-progress.ts`.

Supported commands:

- `status`: print a concise human-readable summary:
  - Base UI imported/total/remaining.
  - shadcn imported/docs-total/remaining.
  - shadcn source-backed count.
  - blocked count.
  - ready-for-dossier count.
  - dossier-ready count.
  - path to generated checklist if it is current.
- `next [count]`: print the next `count` rows, default `1`.
  - Include item ID, readiness, blockers if any, recommended origin URLs, and
    the exact `add-registry-component` invocation to generate dossier evidence.
  - If no ready rows exist, exit 0 and print a clear "No ready rows" message
    plus the first blocked rows.
- `write`: write both:
  - `docs/component-conversion-checklist.json`
  - `docs/component-conversion-checklist.md`
- `check`: recompute the report and fail if the generated JSON or Markdown is
  missing or stale.

Add package scripts:

```json
"origin:components:status": "bun run scripts/registry-component-progress.ts status",
"origin:components:next": "bun run scripts/registry-component-progress.ts next",
"origin:components:write": "bun run scripts/registry-component-progress.ts write",
"origin:components:check": "bun run scripts/registry-component-progress.ts check"
```

Keep `status` and `next` read-only. Only `write` should mutate generated docs.

**Verify**:

- `bun run origin:components:status` -> exit 0 and prints `Base UI: 4/38`.
- `bun run origin:components:next -- 3` -> exit 0 and prints three or fewer
  non-imported, non-blocked rows with URLs.
- `bun run origin:components:write` -> exit 0 and writes both checklist files.
- `bun run origin:components:check` -> exit 0 immediately after `write`.

### Step 5: Wire freshness checking into registry validation

Update `scripts/check-registry.ts` so `bun run registry:check` also verifies the
component conversion checklist is current.

Expected final output should add one line after the registry index line, for
example:

```txt
Validated 14 source manifest(s).
Verified registry/index.json is current.
Verified docs/component-conversion-checklist.md is current.
```

Use the progress helper's `check` function instead of shelling out to a child
process. Keep `check-registry.ts` deterministic and read-only.

**Verify**: `bun run registry:check` -> exit 0 and prints the new checklist
freshness line.

### Step 6: Update the add-registry-component skill contract

Update `.agents/skills/add-registry-component/SKILL.md`.

Add an "Invocation Modes" section:

- `status`
  - Run `bun run origin:components:status`.
  - Report the summary and point at `docs/component-conversion-checklist.md`.
  - Do not create dossier artifacts.
- `next [count]`
  - Run `bun run origin:components:next -- <count>`.
  - Use the returned rows as the next candidate batch.
  - For a normal planning invocation, generate dossier previews for those rows
    with `scripts/draft-registry-component-plan.ts`.
  - Keep each generated batch to one row and at most two origin URLs.
  - Do not include blocked rows unless the user explicitly asks for blocked
    planning evidence.
- `<origin URL> [...origin URL]`
  - Preserve the existing behavior.

Add useful commands:

```bash
bun run origin:components:status
bun run origin:components:next -- 4
bun run origin:components:write
bun run origin:components:check
```

Clarify that historical queues are priority hints only; the live progress
tracker is authoritative because it derives from pinned origins plus
`registry-src`.

**Verify**: `rg -n "Invocation Modes|origin:components:status|next \\[count\\]" .agents/skills/add-registry-component/SKILL.md`
-> finds the new sections.

### Step 7: Generate and inspect the checklist

Run:

```bash
bun run origin:components:write
```

Inspect the generated Markdown. It should include:

- A summary table with Base UI and shadcn counts.
- Imported items.
- Ready-for-dossier rows.
- Dossier-ready rows.
- Blocked rows with blocker summaries.
- Parity coverage indicators.
- A "Next candidates" section that mirrors `origin:components:next`.

Inspect the generated JSON. It should decode against
`OriginComponentProgressReport`.

Do not hand-edit the generated files.

**Verify**:

- `bun run origin:components:check` -> exit 0.
- `git diff -- docs/component-conversion-checklist.md docs/component-conversion-checklist.json`
  -> shows generated checklist content only.

### Step 8: Run full verification

Run the final command set:

```bash
bun run registry:check
bun run origin:components:status
bun run origin:components:next -- 4
bun run parity:check -- --dry-run
bun run test
bun run typecheck
bun run check
bun run build
git diff --check -- .agents/skills/add-registry-component/SKILL.md package.json scripts src/registry tests/parity docs plans
```

Expected result:

- All commands exit 0.
- `registry:check` verifies both the registry index and component conversion
  checklist freshness.
- `status` reports current imported counts.
- `next -- 4` excludes imported and blocked rows.

## Test plan

Add `scripts/registry-component-progress-common.test.ts` with the cases listed
in Step 3. Extend `src/registry/schema.test.ts` if it already tests schema
decode behavior; otherwise add focused decode tests in the new script test file
for `OriginComponentProgressReport`.

Do not add browser or parity snapshot tests for this plan. This is progress
tracking and CLI output, not component rendering.

Verification:

- `bun run test -- scripts/registry-component-progress-common.test.ts`
- `bun run test`

## Done criteria

All must hold:

- [ ] `bun run origin:components:status` exits 0 and reports Base UI `4/38`
      and shadcn `8/59` for the current checkout.
- [ ] `bun run origin:components:next -- 4` exits 0 and returns no imported
      rows and no blocked rows.
- [ ] `docs/component-conversion-checklist.md` and
      `docs/component-conversion-checklist.json` exist and are generated by
      `bun run origin:components:write`.
- [ ] `bun run origin:components:check` exits 0 after generation.
- [ ] `bun run registry:check` exits 0 and verifies checklist freshness.
- [ ] `.agents/skills/add-registry-component/SKILL.md` documents `status`,
      `next [count]`, and URL modes.
- [ ] New tests cover counts, imported exclusions, held blockers, and next
      selection.
- [ ] `bun run parity:check -- --dry-run`, `bun run test`,
      `bun run typecheck`, `bun run check`, and `bun run build` exit 0.
- [ ] No `registry-src/<namespace>/<item>/` component folders are added by this
      plan.
- [ ] `plans/README.md` status row for Plan 019 is updated.

## STOP conditions

Stop and report back if:

- The pinned Base UI origin no longer has 38 component docs directories or the
  pinned shadcn docs surface no longer has 59 component docs pages. This means
  the plan's current-state counts drifted and the tests need updated expected
  values with evidence.
- `resolveOriginUrl()` cannot resolve known held rows such as
  `shadcn/typography`; do not duplicate held-row blocker data by hand.
- Reading parity slots from `tests/parity/slots.ts` introduces a circular import
  or test/runtime side effect. In that case, extract shared slot metadata to a
  neutral module and report the scope change before continuing.
- The checklist freshness check requires writing files during
  `registry:check`. `registry:check` must remain read-only.
- The implementation appears to require fetching live upstream docs or updating
  submodules.
- A verification command fails twice after a reasonable fix attempt.

## Maintenance notes

- Future component imports should require regenerating the checklist with
  `bun run origin:components:write`, the same way registry imports already
  require `bun run registry:build`.
- Reviewers should check that `next` selection is source-derived and filters
  imported rows, not just copied from Plan 004 or Plan 007.
- Reviewers should check that blocked rows remain visible. Hiding blocked rows
  makes the progress numbers look cleaner but loses the information needed to
  plan local foundations for table, date picker, toast, typography, and charts.
- The generated checklist is allowed to depend on historical queues for
  priority hints only. If those files are removed later, the progress tracker
  must still produce deterministic status and next output.
