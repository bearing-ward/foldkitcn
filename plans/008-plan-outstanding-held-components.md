# Plan 008: Plan outstanding held component rows

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 16c50d4a..HEAD -- plans/artifacts/007-remaining-component-dossiers/hold-rows.md scripts/origin-common.ts scripts/draft-registry-component-plan.ts docs/decisions/0001-foldkit-registry-architecture.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/007-generate-remaining-component-dossiers.md`
- **Category**: direction
- **Planned at**: commit `16c50d4a`, 2026-06-24

## Why this matters

Plans 004 and 007 covered every directly resolvable Base UI and shadcn origin
component in the pinned local repositories. Five shadcn rows remain
outstanding because they either lack a `styles/base-nova/ui/<slug>.tsx` source
file or are gated on a native chart foundation. Leaving those rows only as
free-form notes makes the queue look smaller than the real origin surface.

This plan turns the outstanding held rows into explicit, improve-compatible
intake work without implementing registry source or pretending blocked rows
are installable.

## Current state

- `plans/artifacts/007-remaining-component-dossiers/hold-rows.md` lists the
  only outstanding rows:
  - `shadcn/data-table`
  - `shadcn/date-picker`
  - `shadcn/toast`
  - `shadcn/typography`
  - `shadcn/chart`
- `bun run origin:resolve -- https://ui.shadcn.com/docs/components/chart`
  succeeds because `repos/ui/apps/v4/styles/base-nova/ui/chart.tsx` exists.
- The same resolver command currently fails for `data-table`, `date-picker`,
  `toast`, and `typography` because no matching
  `repos/ui/apps/v4/styles/base-nova/ui/<slug>.tsx` file exists.
- `docs/decisions/0001-foldkit-registry-architecture.md` says charts are
  recognized registry vocabulary, but chart items remain deferred until an
  explicit native chart foundation exists.

## Scope

**In scope**:

- `plans/artifacts/008-outstanding-held-component-dossiers/**`
- `plans/README.md`
- `scripts/origin-common.ts` only if docs/example-only shadcn rows are made
  resolvable as non-installable planning evidence
- `scripts/draft-registry-component-plan.ts` only if it needs a small adapter
  for docs/example-only or chart-foundation-blocked dossier output

**Out of scope**:

- Do not create or edit `registry-src/<namespace>/<item>/`.
- Do not create installable component source under `src/registry/`.
- Do not import React, Recharts, TanStack Table, dnd-kit, Sonner, or origin
  repo paths into installable Foldkit source.
- Do not mark `shadcn/chart` installable before a native chart foundation
  exists.
- Do not edit origin repositories under `repos/`.

## Steps

### Step 1: Reconfirm the outstanding set

Read:

- `plans/artifacts/007-remaining-component-dossiers/hold-rows.md`
- `plans/artifacts/008-outstanding-held-component-dossiers/dossier.json`
- `plans/artifacts/008-outstanding-held-component-dossiers/plan-preview.md`

Verify that the outstanding held set is exactly:

```bash
rg -n "shadcn/data-table|shadcn/date-picker|shadcn/toast|shadcn/typography|shadcn/chart" plans/artifacts/008-outstanding-held-component-dossiers
```

Expected result: all five ids are found.

### Step 2: Preserve resolver failure evidence for docs/example-only rows

Run:

```bash
bun run origin:resolve -- https://ui.shadcn.com/docs/components/data-table
bun run origin:resolve -- https://ui.shadcn.com/docs/components/date-picker
bun run origin:resolve -- https://ui.shadcn.com/docs/components/toast
bun run origin:resolve -- https://ui.shadcn.com/docs/components/typography
```

Expected result today: each command exits non-zero with a missing
`repos/ui/apps/v4/styles/base-nova/ui/<slug>.tsx` path. That is evidence for
why these rows need docs/example-only planning support.

If the resolver has already been extended and any command exits 0, compare the
new resolution against the dossier before continuing. The resolution must keep
the row non-installable until dependencies and local foundations are present.

### Step 3: Add docs/example-only planning support

If the current resolver still fails for docs/example-only rows, extend the
planning layer so it can capture shadcn rows with docs and examples but no
primary `styles/base-nova/ui/<slug>.tsx` source.

Requirements:

- Preserve `createsRegistryItemFolders: false`.
- Keep confidence `low` or `medium`; do not imply source parity exists.
- Record docs paths, example paths, public registry JSON paths where present,
  runtime hints, registry-local dependency hints, and unresolved questions.
- Classify React as `dev-or-fixture-only`.
- Classify upstream runtime libraries such as TanStack Table, dnd-kit,
  Recharts, Sonner, `date-fns`, `chrono-node`, and React DayPicker as
  `reject-or-defer` unless a later accepted plan creates a local foundation.
- Treat typography as local style/document primitives rather than a single
  behavior component unless the implementation plan proves otherwise.

Do not create component implementation plans yet; this is intake/unblock work.

### Step 4: Keep chart gated on a native chart foundation

Generate or preserve a chart dossier, but keep it blocked on a native chart
foundation. The plan must explicitly reject installing Recharts into Foldkit
registry runtime source unless a later architecture decision allows it.

The chart dossier may capture:

- `repos/ui/apps/v4/styles/base-nova/ui/chart.tsx`
- shadcn chart docs and examples
- public registry chart JSON files under `repos/ui/apps/v4/public/r/styles/`
- dependency hints for `utils/cn`, `recharts`, React, card, and language
  selector fixtures

### Step 5: Verification

Run:

```bash
bun run check
bun run typecheck
bun run registry:check
git diff --check -- plans scripts docs
```

Expected result: all commands exit 0.

Also verify no implementation folders were created:

```bash
test ! -d registry-src/shadcn/data-table
test ! -d registry-src/shadcn/date-picker
test ! -d registry-src/shadcn/toast
test ! -d registry-src/shadcn/typography
test ! -d registry-src/shadcn/chart
```

## STOP Conditions

- Any change creates `registry-src/shadcn/<held-row>/` or installable
  `src/registry/shadcn/<held-row>/` source.
- The chart row is marked installable before a native chart foundation exists.
- A docs/example-only row loses the reason it was held.
- The planning layer imports from `repos/*` in installable source.
- Dependency classification introduces React, Recharts, TanStack Table, dnd-kit,
  Sonner, or React DayPicker as allowed runtime dependencies.

## Done Criteria

- Outstanding held rows have explicit dossiers or blocked previews under
  `plans/artifacts/008-outstanding-held-component-dossiers/`.
- The five held rows are still visible and no longer hidden behind the 007
  queue.
- Missing resolver support is represented as an explicit next step, not an
  accidental failure.
- No component implementation source is added.
- Verification commands pass.
