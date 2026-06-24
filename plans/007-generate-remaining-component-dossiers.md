# Plan 007: Generate remaining component dossiers from the full queue

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat e13dfbb7..HEAD -- plans/artifacts/007-remaining-component-queue plans/artifacts/007-remaining-component-dossiers plans/artifacts/004-foundational-component-dossiers registry-src scripts/origin-common.ts scripts/draft-registry-component-plan.ts plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition. Existing uncommitted plan files 005
> and 006 are expected if they have not been committed yet; do not overwrite
> them.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/004-generate-foundational-component-dossiers.md`
- **Category**: direction
- **Planned at**: commit `e13dfbb7`, 2026-06-24

## Why this matters

Plan 004 created the first foundational component backlog and dossiers. The
next planning bottleneck is knowing which origin components remain before
implementation starts outrunning the intake queue. This plan turns the pinned
Base UI and shadcn inventories into a complete remaining-component queue that
can feed `add-registry-component` in small, dependency-aware rows.

## Current state

- `registry-src/` currently contains origin-backed component manifests for
  `base-ui/button` and `shadcn/button`; `utils/cn` and
  `local/example-preview` are support items.
- `plans/artifacts/004-foundational-component-dossiers/` already contains
  dossiers for the first-wave components, including separator, progress,
  avatar, input, switch, checkbox, radio-group, tabs, collapsible, toggle,
  toggle-group, slider, accordion, dialog, popover, tooltip, select,
  dropdown-menu/menu, alert-dialog, context-menu, and scroll-area.
- The exhaustive remaining queue is recorded in
  `plans/artifacts/007-remaining-component-queue/component-queue.md`.
- That queue was derived from local pinned origin evidence:
  - Base UI docs:
    `repos/base-ui/docs/src/app/(docs)/react/components/`
  - shadcn docs:
    `repos/ui/apps/v4/content/docs/components/base/`
  - shadcn source:
    `repos/ui/apps/v4/styles/base-nova/ui/`
- Current totals in the queue:
  - 16 remaining Base UI items
  - 32 remaining shadcn items
  - 48 remaining origin items total
  - 41 queue rows because several rows pair related origins

The architecture decision that applies here is
`docs/decisions/0001-foldkit-registry-architecture.md`. Relevant constraints:

- Origin repositories are read-only evidence sources, not installable runtime
  dependencies.
- Base UI namespace items are unstyled behavior primitives by default.
- shadcn namespace items are styled Foldkit wrappers or compositions that
  depend on local registry primitives.
- Charts are gated on an explicit native chart foundation.
- Live docs URLs are discovery inputs, not parity oracles.

## Commands you will need

| Purpose                 | Command                                                                                                                                                                      | Expected on success                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------- | -------------------- |
| Base UI inventory       | `find 'repos/base-ui/docs/src/app/(docs)/react/components' -mindepth 1 -maxdepth 1 -type d -print \| sed "s#repos/base-ui/docs/src/app/(docs)/react/components/##" \| sort`  | prints Base UI component slugs              |
| shadcn docs inventory   | `find repos/ui/apps/v4/content/docs/components/base -maxdepth 1 -type f -name '*.mdx' -print \| sed 's#repos/ui/apps/v4/content/docs/components/base/##; s#.mdx$##' \| sort` | prints shadcn docs slugs                    |
| shadcn source inventory | `find repos/ui/apps/v4/styles/base-nova/ui -maxdepth 1 -type f -name '*.tsx' -print \| sed 's#repos/ui/apps/v4/styles/base-nova/ui/##; s#.tsx$##' \| sort`                   | prints shadcn source slugs                  |
| Resolver smoke          | `bun run origin:resolve -- https://base-ui.com/react/components/meter`                                                                                                       | exit 0, local Base UI evidence printed      |
| Resolver smoke          | `bun run origin:resolve -- https://ui.shadcn.com/docs/components/native-select`                                                                                              | exit 0, local shadcn evidence printed       |
| Dossier generation      | `bun run scripts/draft-registry-component-plan.ts --output <output-dir> <url> [<url>]`                                                                                       | writes `dossier.json` and `plan-preview.md` |
| Queue checks            | `rg -n "base-ui/meter                                                                                                                                                        | shadcn/native-select                        | shadcn/chart" plans/artifacts/007-remaining-component-queue/component-queue.md` | finds all listed ids |
| Git whitespace          | `git diff --check -- plans`                                                                                                                                                  | exit 0                                      |

## Suggested executor toolkit

- Invoke `add-registry-component` for each queue row if available. It is the
  intended user-facing workflow for these rows.
- For scripted dossier generation, use
  `scripts/draft-registry-component-plan.ts` directly with explicit `--output`
  paths.
- Treat `repos/base-ui/`, `repos/ui/`, and `repos/foldkit/` as read-only
  references. Never import from those paths in installable source.

## Scope

**In scope**:

- `plans/artifacts/007-remaining-component-queue/component-queue.md`
- New dossier outputs under
  `plans/artifacts/007-remaining-component-dossiers/**`
- `plans/README.md`
- `scripts/origin-common.ts` only if a docs-only row must be made resolvable
  in a later sub-step
- `scripts/draft-registry-component-plan.ts` only if a docs-only row must be
  made resolvable in a later sub-step

**Out of scope**:

- Do not implement any component under `registry-src/` or `src/registry/`.
- Do not edit origin repos under `repos/base-ui/`, `repos/ui/`, or
  `repos/foldkit/`.
- Do not mark chart items installable; chart remains gated on a native chart
  foundation.
- Do not combine more than one queue row into a single dossier batch unless
  the queue row already contains a Base UI/shadcn pair.

## Git workflow

- Branch: `codex/007-remaining-component-dossiers`
- Commit message style: conventional commits, for example
  `docs: add remaining component dossier queue`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Reconfirm the remaining queue

Read `plans/artifacts/007-remaining-component-queue/component-queue.md`.

Run the three inventory commands from "Commands you will need" and compare the
results against the queue definition:

- `base-ui/button` and `shadcn/button` are excluded because they are already
  implemented.
- Rows already present under
  `plans/artifacts/004-foundational-component-dossiers/` are excluded.
- The remaining queue still contains 16 Base UI items and 32 shadcn items.

**Verify**:

```bash
rg -n "Remaining Base UI items: 16|Remaining shadcn items: 32|Remaining origin items total: 48" plans/artifacts/007-remaining-component-queue/component-queue.md
```

Expected result: all three count lines are found.

### Step 2: Generate dossiers for the best next parallel rows

Generate the six best next rows first, each into its own directory under
`plans/artifacts/007-remaining-component-dossiers/`:

```bash
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/007-remaining-component-dossiers/base-ui-meter https://base-ui.com/react/components/meter
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/007-remaining-component-dossiers/base-ui-fieldset https://base-ui.com/react/components/fieldset
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/007-remaining-component-dossiers/base-ui-number-field https://base-ui.com/react/components/number-field
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/007-remaining-component-dossiers/shadcn-native-select https://ui.shadcn.com/docs/components/native-select
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/007-remaining-component-dossiers/shadcn-alert https://ui.shadcn.com/docs/components/alert
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/007-remaining-component-dossiers/field https://base-ui.com/react/components/field https://ui.shadcn.com/docs/components/field
```

**Verify**:

```bash
find plans/artifacts/007-remaining-component-dossiers -maxdepth 2 -name dossier.json | sort
rg -n "base-ui/meter|base-ui/fieldset|base-ui/number-field|shadcn/native-select|shadcn/alert|base-ui/field|shadcn/field" plans/artifacts/007-remaining-component-dossiers
```

Expected result: at least six dossier directories exist and every listed item
id is found.

### Step 3: Continue through every ready row

For each row in the "Full Queue" table whose status is `ready`, generate a
matching dossier directory under
`plans/artifacts/007-remaining-component-dossiers/`.

Rules:

- Use one output directory per queue row.
- Use slug names that stay stable, for example `otp-field-input-otp`,
  `preview-card-hover-card`, `navigation-menu`, and `base-ui-toast`.
- Pass both URLs for paired rows.
- Do not include rows marked `hold` in this step.
- If a row's resolver fails even though it is marked `ready`, STOP and report
  the row id and error text.

**Verify**:

```bash
rg -n "base-ui/autocomplete|base-ui/checkbox-group|base-ui/combobox|base-ui/drawer|base-ui/form|base-ui/menubar|base-ui/meter|base-ui/navigation-menu|base-ui/number-field|base-ui/otp-field|base-ui/preview-card|base-ui/radio|base-ui/toast|base-ui/toolbar|shadcn/breadcrumb|shadcn/button-group|shadcn/calendar|shadcn/card|shadcn/carousel|shadcn/combobox|shadcn/command|shadcn/direction|shadcn/drawer|shadcn/empty|shadcn/hover-card|shadcn/input-group|shadcn/input-otp|shadcn/item|shadcn/label|shadcn/menubar|shadcn/navigation-menu|shadcn/pagination|shadcn/resizable|shadcn/sheet|shadcn/sidebar|shadcn/sonner|shadcn/spinner|shadcn/table" plans/artifacts/007-remaining-component-dossiers
```

Expected result: every ready item id is found in a generated dossier or plan
preview.

### Step 4: Keep hold rows visible but blocked

Do not force the `hold` rows through the current resolver:

- `shadcn/data-table`
- `shadcn/date-picker`
- `shadcn/toast`
- `shadcn/typography`
- `shadcn/chart`

Create a short markdown note at
`plans/artifacts/007-remaining-component-dossiers/hold-rows.md` that records:

- the five hold ids,
- why each is held,
- what must exist before it can move to `ready`.

If you choose to extend the resolver for docs-only composition rows in this
same plan, keep the change scoped to docs/example-only shadcn rows and do not
change installability rules. `shadcn/chart` must stay held until a native chart
foundation exists.

**Verify**:

```bash
rg -n "shadcn/data-table|shadcn/date-picker|shadcn/toast|shadcn/typography|shadcn/chart" plans/artifacts/007-remaining-component-dossiers/hold-rows.md
```

Expected result: all five hold ids are found.

### Step 5: Update the plan index

When all ready dossiers and the hold note exist, update `plans/README.md` row
007 from `TODO` to `DONE`.

**Verify**:

```bash
git diff --check -- plans
git status --short -- plans/artifacts/007-remaining-component-queue plans/artifacts/007-remaining-component-dossiers plans/007-generate-remaining-component-dossiers.md plans/README.md
```

Expected result: whitespace check exits 0 and status shows only in-scope plan
and artifact changes.

## Test plan

This plan is planning-only. Verification is file- and resolver-based:

- Resolver smoke commands must succeed for direct Base UI and shadcn rows.
- Generated dossiers must include `dossier.json` and `plan-preview.md`.
- `rg` checks must find every ready item id in generated dossiers.
- Hold rows must be recorded in `hold-rows.md` instead of silently skipped.

## Done criteria

- [ ] `plans/artifacts/007-remaining-component-queue/component-queue.md`
      remains the source list for all remaining component intake rows.
- [ ] Every `ready` row in that queue has a generated dossier directory under
      `plans/artifacts/007-remaining-component-dossiers/`.
- [ ] The five `hold` rows are recorded in
      `plans/artifacts/007-remaining-component-dossiers/hold-rows.md`.
- [ ] No component implementation files under `registry-src/` or
      `src/registry/` are modified.
- [ ] `git diff --check -- plans` exits 0.
- [ ] `plans/README.md` marks plan 007 as `DONE`.

## STOP conditions

Stop and report back if:

- The inventory no longer matches the queue counts and the difference is not
  explained by newly committed registry items or dossiers.
- A row marked `ready` fails `bun run origin:resolve`.
- A queue row appears to need more than two origin URLs to be dependency
  complete.
- Completing a row would require implementing component source instead of
  writing dossiers.
- Any change appears necessary outside the in-scope paths.

## Maintenance notes

- The queue intentionally excludes existing foundational dossiers; do not use
  it as the full public surface. Use it as the remaining intake list after
  plan 004.
- `shadcn/chart` is a special case because ADR 0001 gates charts on a native
  chart foundation.
- Rows with many shadcn dependencies should still be implemented later in the
  user's preferred one- or two-component batches after their dossiers exist.
