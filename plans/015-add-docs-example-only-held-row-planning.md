# Plan 015: Add docs/example-only held-row planning support

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 2a905b7c..HEAD -- plans/README.md plans/008-plan-outstanding-held-components.md plans/artifacts/007-remaining-component-dossiers/hold-rows.md plans/artifacts/008-outstanding-held-component-dossiers scripts/origin-common.ts scripts/origin-common.test.ts scripts/draft-registry-component-plan.ts scripts/resolve-origin-url.ts src/registry/schema.ts src/registry/validation.ts src/registry/validation.test.ts docs/decisions/0001-foldkit-registry-architecture.md package.json`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/008-plan-outstanding-held-components.md`
- **Category**: dx
- **Planned at**: commit `2a905b7c`, 2026-06-25

## Why this matters

Plan 008 made the final held shadcn rows visible, but four rows still cannot go
through the normal resolver because shadcn has docs, examples, or public
registry JSON for them without a primary
`styles/base-nova/ui/<slug>.tsx` component source file. That is the right
reason to block implementation, but the wrong reason for intake tooling to fail.

This plan adds explicit docs/example-only resolver and dossier support for
`shadcn/data-table`, `shadcn/date-picker`, `shadcn/toast`, and
`shadcn/typography`. It also classifies `shadcn/typography` as docs/examples
plus local style primitives for now, not as installable behavior source. The
goal is better planning evidence, not registry source.

## Current state

- `plans/artifacts/007-remaining-component-dossiers/hold-rows.md:5-10` lists
  four shadcn rows held because docs/examples exist but no primary
  `styles/base-nova/ui/<slug>.tsx` source exists:
  - `shadcn/data-table`
  - `shadcn/date-picker`
  - `shadcn/toast`
  - `shadcn/typography`
- The same file lists `shadcn/chart` separately at
  `plans/artifacts/007-remaining-component-dossiers/hold-rows.md:11` because
  ADR 0001 gates charts on a native chart foundation.
- `docs/decisions/0001-foldkit-registry-architecture.md:15-17` says public
  APIs must use Foldkit architecture and boundary data must be Effect Schema
  backed.
- `docs/decisions/0001-foldkit-registry-architecture.md:35-42` says block
  requirements must be met locally, charts need a native chart foundation, and
  React is allowed only in origin fixture infrastructure.
- `src/registry/schema.ts:78-101` defines `OriginResolution` with Effect Schema.
  It already allows `sourcePaths: S.Array(S.String)`, which can represent an
  empty source list, but it does not currently expose a resolution mode, missing
  primary source path, public registry JSON paths, or blockers.
- `src/registry/validation.ts:22-30` allows runtime dependencies only for
  `@foldkit/ui`, `clsx`, `effect`, `foldkit`, and `tailwind-merge`.
- `src/registry/validation.ts:66-84` classifies registry-local ids,
  `react`/`react-dom` as `dev-or-fixture-only`, Radix/Base UI React packages as
  `replace-with-foldkit`, and all other unknown runtime libraries as
  `reject-or-defer`.

The shadcn resolver currently requires a primary source path before it can
return any result:

```ts
// scripts/origin-common.ts:297-305
const shadcnResolution = (docsUrl: string, slug: string) => {
  const localRepoPath = 'repos/ui'
  const pinnedRef = ensurePinnedRepo(localRepoPath)
  const primarySourcePath = `repos/ui/apps/v4/styles/base-nova/ui/${slug}.tsx`
  const sourcePaths = requirePaths([primarySourcePath])
  const docsPaths = shadcnDocsPaths(slug)
  const demoPaths = shadcnExamplePaths(slug)
  const specifiers = importedSpecifiers([...sourcePaths, ...demoPaths])
```

That produces the current failure for typography:

```text
$ bun run origin:resolve -- https://ui.shadcn.com/docs/components/typography
error: Origin evidence path is missing: repos/ui/apps/v4/styles/base-nova/ui/typography.tsx
```

Chart is different because the source-backed resolver already finds a primary
file:

```text
$ bun run origin:resolve -- https://ui.shadcn.com/docs/components/chart
"sourcePaths": [
  "repos/ui/apps/v4/styles/base-nova/ui/chart.tsx"
]
```

`scripts/draft-registry-component-plan.ts` already has hard-coded held-row
metadata, but it is local to that script instead of reusable resolver output:

```ts
// scripts/draft-registry-component-plan.ts:50-68
interface HeldShadcnRow {
  readonly itemId: string
  readonly status: 'blocked'
  readonly docsUrl: string
  readonly localRepoPath: 'repos/ui'
  readonly pinnedRef: string
  readonly resolverStatus:
    | 'fails-missing-primary-source'
    | 'resolves-but-chart-foundation-gated'
  readonly missingPrimarySourcePath?: string
  readonly sourcePaths?: ReadonlyArray<string>
  readonly docsPaths: ReadonlyArray<string>
  readonly examplePaths: ReadonlyArray<string>
  readonly styleVariantPaths?: ReadonlyArray<string>
  readonly publicRegistryPaths: ReadonlyArray<string>
  readonly registryDependencyHints: ReadonlyArray<string>
  readonly runtimeDependencyHints: ReadonlyArray<string>
  readonly blockers: ReadonlyArray<string>
}
```

The existing held dossier writer keeps these rows non-installable:

```ts
// scripts/draft-registry-component-plan.ts:685-689
const dossier = {
  batch: heldRows.map(row => row.itemId),
  generatedKind: 'blocked-outstanding-preview',
  createsRegistryItemFolders: false,
```

The existing dependency policy already points in the right direction:

```ts
// scripts/draft-registry-component-plan.ts:477-486
const heldDependencyPolicy = {
  react: 'dev-or-fixture-only',
  recharts: 'reject-or-defer',
  '@tanstack/react-table': 'reject-or-defer',
  '@dnd-kit/*': 'reject-or-defer',
  sonner: 'reject-or-defer',
  'react-day-picker': 'reject-or-defer',
  'date-fns': 'reject-or-defer',
  'chrono-node': 'reject-or-defer',
}
```

`scripts/origin-common.test.ts:53-84` already tests normal source-backed shadcn
resolution for `separator`. Extend that file rather than creating a separate
test harness unless the change naturally needs a new module test.

## Commands you will need

| Purpose                   | Command                                                                                                                                                                                                                                                                                                            | Expected on success                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Targeted resolver tests   | `bun run test -- scripts/origin-common.test.ts src/registry/validation.test.ts`                                                                                                                                                                                                                                    | exit 0                                                                            |
| Typography resolver smoke | `bun run origin:resolve -- https://ui.shadcn.com/docs/components/typography`                                                                                                                                                                                                                                       | exit 0; JSON marks docs/example-only, non-installable planning evidence           |
| Held batch dossier smoke  | `bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/015-held-row-docs-example-only-preview https://ui.shadcn.com/docs/components/data-table https://ui.shadcn.com/docs/components/date-picker https://ui.shadcn.com/docs/components/toast https://ui.shadcn.com/docs/components/typography` | exit 0; writes `dossier.json` and `plan-preview.md` without registry item folders |
| Registry validation       | `bun run registry:check`                                                                                                                                                                                                                                                                                           | exit 0                                                                            |
| Typecheck                 | `bun run typecheck`                                                                                                                                                                                                                                                                                                | exit 0                                                                            |
| Full tests                | `bun run test`                                                                                                                                                                                                                                                                                                     | exit 0                                                                            |
| Lint/check                | `bun run check`                                                                                                                                                                                                                                                                                                    | exit 0                                                                            |
| Build                     | `bun run build`                                                                                                                                                                                                                                                                                                    | exit 0                                                                            |
| Whitespace                | `git diff --check -- plans scripts src docs`                                                                                                                                                                                                                                                                       | exit 0                                                                            |

## Scope

**In scope**:

- `scripts/origin-common.ts`
- `scripts/origin-common.test.ts`
- `scripts/draft-registry-component-plan.ts`
- `scripts/resolve-origin-url.ts` only if CLI output formatting needs to stay
  schema-valid after the resolver shape changes
- `src/registry/schema.ts` only for Effect Schema-backed resolver evidence fields
- `src/registry/validation.ts`
- `src/registry/validation.test.ts`
- `plans/artifacts/015-held-row-docs-example-only-preview/**`
- `plans/README.md`

**Out of scope**:

- Do not create `registry-src/shadcn/data-table/`,
  `registry-src/shadcn/date-picker/`, `registry-src/shadcn/toast/`,
  `registry-src/shadcn/typography/`, or `registry-src/shadcn/chart/`.
- Do not create installable runtime source for any held row.
- Do not import React, React DOM, Recharts, TanStack Table, dnd-kit, Sonner,
  `date-fns`, `chrono-node`, React Day Picker, or origin repo paths into
  installable Foldkit source.
- Do not make `shadcn/chart` installable or implement chart foundation work.
- Do not implement table/query, date/calendar, notification/toast, chart, or
  block showcase foundations in this plan.
- Do not edit origin repositories under `repos/`.

## Git workflow

- Branch: `codex/015-docs-example-held-rows`.
- Commit per logical unit if useful; otherwise one commit is fine.
- Follow the existing message style from recent history, for example
  `feat: add shadcn alert and native select registry items` and
  `docs: mark shadcn alert native select plan done`.
- Do not push unless the operator explicitly asks.

## Steps

### Step 1: Preserve or clear the current plan-only reconcile note

Run:

```bash
git status --short --branch
git diff -- plans/README.md
```

At the time this plan was written, `plans/README.md` had an uncommitted
reconciliation log entry only. If that is still true, preserve it and include it
in the eventual plan/docs commit. If unrelated source files are dirty, stop and
ask the operator whether to continue around them.

**Verify**: `git diff -- plans/README.md` shows only plan index, dependency
notes, or reconciliation-log content. No source files should be dirty before
implementation starts unless the operator explicitly allows it.

### Step 2: Move held shadcn row facts into reusable resolver data

Create a small reusable held-row data shape in either `scripts/origin-common.ts`
or a new script-local module such as `scripts/shadcn-held-rows.ts`. Prefer a new
module if keeping the existing resolver readable would otherwise become noisy.

Requirements:

- Keep the data Effect Schema-compatible. If new boundary fields are returned
  from `resolveOriginUrl`, add them to `OriginResolution` in
  `src/registry/schema.ts` and derive TypeScript types from the schema.
- Preserve the existing five rows from plan 008:
  - `data-table`
  - `date-picker`
  - `toast`
  - `typography`
  - `chart`
- For the four docs/example-only rows, include:
  - `resolutionStatus` or equivalent value: `docs-example-only`
  - `missingPrimarySourcePath`
  - `docsPaths`
  - `demoPaths` or `examplePaths`
  - `publicRegistryPaths`
  - `registryDependencyHints`
  - `runtimeDependencyHints`
  - `confidence: 'low'` or `confidence: 'medium'`
  - blockers/unresolved questions explaining why the row is non-installable
- For `chart`, keep the source-backed evidence and the chart foundation blocker
  separate from docs/example-only support.

Recommended schema extension if you change `OriginResolution`:

```ts
resolutionStatus: S.Union([
  S.Literal('source-backed'),
  S.Literal('docs-example-only'),
  S.Literal('foundation-gated'),
])
missingPrimarySourcePath: S.optional(S.String)
publicRegistryPaths: S.Array(S.String)
blockers: S.Array(S.String)
```

Use `S.optional(...)` for optional fields if the repo keeps optional object
properties in this schema. If the repo prefers required fields for script
output, use schema-backed literals and empty strings/arrays consistently, but
do not use plain unvalidated ad hoc objects.

**Verify**:

```bash
bun run test -- scripts/origin-common.test.ts
```

Expected result: existing tests still pass or fail only because the next step
has not updated expectations for the new fields.

### Step 3: Extend shadcn resolution without hiding missing source evidence

Update `shadcnResolution` so docs/example-only rows no longer fail at
`requirePaths([primarySourcePath])`. Do not make every missing shadcn source
silently acceptable.

Required behavior:

- If the primary `styles/base-nova/ui/<slug>.tsx` exists, keep current
  source-backed behavior.
- If the primary source is missing and the slug is one of
  `data-table`, `date-picker`, `toast`, or `typography`, return a
  docs/example-only `OriginResolution` using the reusable held-row data.
- If the primary source is missing for any other shadcn slug, keep failing with
  a clear missing evidence path error.
- Return empty `sourcePaths` for docs/example-only rows. Do not invent source
  paths from examples or public registry JSON.
- Include public registry JSON paths in a dedicated field if Step 2 adds one.
  Do not mix those paths into installable source paths.
- Keep unresolved questions specific to the row.

**Verify**:

```bash
bun run origin:resolve -- https://ui.shadcn.com/docs/components/typography
bun run origin:resolve -- https://ui.shadcn.com/docs/components/data-table
bun run origin:resolve -- https://ui.shadcn.com/docs/components/date-picker
bun run origin:resolve -- https://ui.shadcn.com/docs/components/toast
```

Expected result: all four commands exit 0. Each JSON result has
`originKind: "shadcn"`, empty `sourcePaths`, the correct docs/example evidence,
the missing primary source path, `confidence` no higher than `medium`, and
blockers or unresolved questions that keep the row non-installable.

Also verify the failure guard:

```bash
bun run origin:resolve -- https://ui.shadcn.com/docs/components/not-a-real-held-row
```

Expected result: exits non-zero with a clear unsupported or missing evidence
error. Do not broaden docs/example-only fallback beyond the approved held rows.

### Step 4: Classify typography as docs/examples plus local style primitives

Record the typography decision in the reusable row data and generated dossier:

- `shadcn/typography` is not a single behavior component right now.
- It should be represented as docs/examples plus a local style primitive family
  until a later plan proves an installable API such as text render helpers.
- Its current public registry JSON files and examples are origin evidence only.
- `@/components/language-selector` and `react` are fixture evidence, not
  installable runtime dependencies.
- The row may become the first promotable held row only in the sense that it can
  move from "resolver failure" to "docs/example-only planning-ready"; it must
  not become installable in this plan.

**Verify**:

```bash
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/015-held-row-docs-example-only-preview https://ui.shadcn.com/docs/components/typography
rg -n "style primitive|docs/example|createsRegistryItemFolders|registry-src/shadcn/typography|installable" plans/artifacts/015-held-row-docs-example-only-preview
test ! -d registry-src/shadcn/typography
```

Expected result: the generated artifacts say `createsRegistryItemFolders: false`,
describe typography as docs/examples or style primitives, do not contain an
installable-source claim, and no `registry-src/shadcn/typography` folder exists.

### Step 5: Keep the heavy held rows non-installable

Update the held batch dossier output so `data-table`, `date-picker`, and `toast`
resolve as planning evidence while staying blocked on their real local
foundations.

Required blockers:

- `shadcn/data-table`: local table/query/sorting/filtering/pagination and
  dashboard dependency decisions must exist before implementation planning.
- `shadcn/date-picker`: local calendar/date behavior, popover, field/input,
  range/time/locale/natural-language parsing decisions must exist first.
- `shadcn/toast`: local notification architecture must settle
  `base-ui/toast`, `shadcn/sonner`, `shadcn/toast`, and Foldkit
  messages/commands/subscriptions first.
- `shadcn/chart`: native chart foundation still comes first. Do not wrap
  Recharts as installable registry runtime source.

**Verify**:

```bash
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/015-held-row-docs-example-only-preview https://ui.shadcn.com/docs/components/data-table https://ui.shadcn.com/docs/components/date-picker https://ui.shadcn.com/docs/components/toast https://ui.shadcn.com/docs/components/typography
rg -n "createsRegistryItemFolders|data-table|date-picker|toast|typography|table/query|notification|calendar|style primitive|reject-or-defer" plans/artifacts/015-held-row-docs-example-only-preview
test ! -d registry-src/shadcn/data-table
test ! -d registry-src/shadcn/date-picker
test ! -d registry-src/shadcn/toast
test ! -d registry-src/shadcn/typography
test ! -d registry-src/shadcn/chart
```

Expected result: the dossier includes all four docs/example-only rows, keeps
`createsRegistryItemFolders: false`, and keeps every heavy row blocked on its
local foundation.

### Step 6: Strengthen dependency classification tests

Add or extend tests in `src/registry/validation.test.ts` for the dependency
policy used by held rows.

Minimum expectations:

- `react` and `react-dom` classify as `dev-or-fixture-only`.
- `@tanstack/react-table`, `@dnd-kit/core`, `@dnd-kit/sortable`, `recharts`,
  `sonner`, `date-fns`, `chrono-node`, and `react-day-picker` classify as
  `reject-or-defer`.
- Registry-local ids such as `shadcn/table`, `base-ui/toast`, and `utils/cn`
  classify as `registry-local`.

Do not add any of those runtime libraries to `allowedRuntimeSpecifiers`.

**Verify**:

```bash
bun run test -- src/registry/validation.test.ts
```

Expected result: exits 0 and includes tests for the held-row dependency
classifications.

### Step 7: Add resolver regression tests

Extend `scripts/origin-common.test.ts`.

Minimum tests:

- Source-backed shadcn resolution still works for `separator`.
- `typography` resolves as docs/example-only with:
  - empty `sourcePaths`
  - the missing `typography.tsx` path recorded
  - docs and example paths present
  - public registry JSON paths present if the schema exposes them
  - `runtimeDependencyHints` containing `react`
  - typography classification text in blockers or unresolved questions
- `data-table` resolves as docs/example-only with TanStack/dnd/Sonner/Recharts
  runtime hints still present as evidence.
- `chart` still resolves with
  `repos/ui/apps/v4/styles/base-nova/ui/chart.tsx` as a source path and remains
  gated in held-row dossier output rather than becoming installable.
- A non-held missing shadcn slug still fails.

**Verify**:

```bash
bun run test -- scripts/origin-common.test.ts
```

Expected result: exits 0.

### Step 8: Update plan artifacts and index

Regenerate the plan 015 held-row preview:

```bash
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/015-held-row-docs-example-only-preview https://ui.shadcn.com/docs/components/data-table https://ui.shadcn.com/docs/components/date-picker https://ui.shadcn.com/docs/components/toast https://ui.shadcn.com/docs/components/typography
```

Update `plans/README.md`:

- Change Plan 015 from `TODO` to `DONE` only after all done criteria pass.
- Keep the existing reconciliation log entry if it is still present.
- Add a dependency note that Plan 015 unblocks resolver/dossier intake only;
  it does not unblock implementation for data-table, date-picker, toast, or
  chart.

**Verify**:

```bash
rg -n "015|docs/example-only|typography|data-table|date-picker|toast" plans/README.md plans/artifacts/015-held-row-docs-example-only-preview
```

Expected result: plan 015 is visible in the index and the preview artifacts
contain the four docs/example-only rows.

## Test plan

- `scripts/origin-common.test.ts`: add resolver tests for docs/example-only
  typography and data-table, chart source-backed behavior, and the non-held
  missing-source guard.
- `src/registry/validation.test.ts`: add dependency classification tests for
  held-row runtime hints.
- Script smoke tests:
  - `bun run origin:resolve -- https://ui.shadcn.com/docs/components/typography`
  - `bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/015-held-row-docs-example-only-preview ...`
- Full gates:
  - `bun run registry:check`
  - `bun run typecheck`
  - `bun run test`
  - `bun run check`
  - `bun run build`
  - `git diff --check -- plans scripts src docs`

## Done criteria

All must hold:

- [ ] `bun run origin:resolve -- https://ui.shadcn.com/docs/components/typography` exits 0 and returns docs/example-only, non-installable planning evidence.
- [ ] `data-table`, `date-picker`, and `toast` resolve as docs/example-only planning evidence without primary source paths.
- [ ] A non-held missing shadcn source still fails instead of silently resolving.
- [ ] `shadcn/typography` is classified as docs/examples plus local style primitives, not an installable behavior component.
- [ ] The plan 015 dossier artifacts exist under
      `plans/artifacts/015-held-row-docs-example-only-preview/`.
- [ ] The dossier artifacts preserve `createsRegistryItemFolders: false`.
- [ ] No `registry-src/shadcn/<held-row>/` folders exist for
      `data-table`, `date-picker`, `toast`, `typography`, or `chart`.
- [ ] React remains `dev-or-fixture-only`; TanStack Table, dnd-kit, Recharts,
      Sonner, `date-fns`, `chrono-node`, and React Day Picker remain
      `reject-or-defer`.
- [ ] `shadcn/chart` remains gated on native chart foundation work.
- [ ] `bun run test -- scripts/origin-common.test.ts src/registry/validation.test.ts` exits 0.
- [ ] `bun run registry:check`, `bun run typecheck`, `bun run test`,
      `bun run check`, `bun run build`, and
      `git diff --check -- plans scripts src docs` exit 0.
- [ ] `plans/README.md` status row is updated after successful execution.

## STOP conditions

Stop and report back if:

- Implementing docs/example-only resolver support requires creating
  `registry-src/shadcn/<held-row>/` folders.
- The resolver cannot represent non-installable/docs-only evidence without a
  broad registry schema redesign.
- A step would add React, React DOM, Recharts, TanStack Table, dnd-kit, Sonner,
  `date-fns`, `chrono-node`, React Day Picker, or origin repo paths as allowed
  installable runtime dependencies.
- A docs/example-only row loses its missing-primary-source evidence.
- `shadcn/chart` becomes installable or loses the ADR 0001 native chart
  foundation gate.
- Typography cannot be classified without choosing a public installable API.
  In that case, keep it blocked and report the API decision needed.
- Any origin evidence path listed in the held-row data is missing from the
  pinned local origin repo.
- The code at the current-state excerpts does not match live code after the
  drift check.

## Maintenance notes

This plan should leave the project with a reusable pattern for origin rows that
are real documentation/example surfaces but not source-backed implementation
surfaces. Future table, date-picker, toast, typography, and chart foundation
plans should consume this evidence instead of re-scraping or re-hard-coding the
same rows.

Reviewer focus: make sure the resolver output is honest about confidence and
installability. The useful result is a better blocked intake path; the dangerous
result would be making the registry look more complete than it is.
