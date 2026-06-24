# Plan 004: Generate foundational component dossiers

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` - unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3dcdaaac..HEAD -- .agents/skills/add-registry-component scripts src/registry tests/parity registry-src plans package.json bun.lock vite.config.ts vitest.config.ts oxlint.config.ts oxfmt.config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: 002
- **Category**: direction
- **Planned at**: commit `3dcdaaac`, 2026-06-24

## Why this matters

Button proved the registry, origin evidence, and parity harness path. The next
failure mode is choosing components one at a time without a dependency-aware
sequence, which would make the registry feel serial and ad hoc. This plan
turns the pinned Base UI and shadcn inventories into a foundational backlog
that can feed `add-registry-component` in small, parallel-safe batches.

This plan does not implement components. It prepares the next set of component
dossiers and keeps the high-fidelity bar from Plan 002: each selected component
must carry local origin source, docs, examples, tests/specs when available,
style variants, dependencies, and parity expectations.

## Current state

- Plans 001, 003, and 002 are complete on `main`.
- The editable registry source currently has these item manifests:
  - `registry-src/base-ui/button/item.json`
  - `registry-src/shadcn/button/item.json`
  - `registry-src/utils/cn/item.json`
  - `registry-src/local/example-preview/item.json`
- Button is the only completed origin-backed component batch. Do not add Button
  to the new backlog except as precedent or as a dependency.
- `scripts/origin-common.ts` still resolves only Button URLs. Its
  `resolveOriginUrl` function supports:
  - `https://base-ui.com/react/components/button`
  - `https://ui.shadcn.com/docs/components/button`
  - Button-ish shadcn registry URLs containing `/components/button` or
    `/button.json`
- `scripts/draft-registry-component-plan.ts` is also Button-specific: default
  URLs, dependency classification, origin test classification, and rendered
  plan copy all name Button directly.
- Local Base UI component evidence exists under
  `repos/base-ui/packages/react/src/` and
  `repos/base-ui/docs/src/app/(docs)/react/components/`.
- Local shadcn evidence exists under:
  - `repos/ui/apps/v4/content/docs/components/base/`
  - `repos/ui/apps/v4/content/docs/components/radix/`
  - `repos/ui/apps/v4/styles/base-nova/ui/`
  - `repos/ui/apps/v4/examples/base/`
- The selected backlog is recorded in
  `plans/artifacts/004-foundational-component-backlog/component-backlog.md`.
  Use that artifact as the operator-facing queue.

Relevant local inventory commands from planning:

```bash
find repos/base-ui/packages/react/src -maxdepth 1 -mindepth 1 -type d -print | sed 's#^repos/base-ui/packages/react/src/##' | sort
find repos/base-ui/docs/src/app/\(docs\)/react/components -maxdepth 1 -mindepth 1 -type d -print | sed 's#^repos/base-ui/docs/src/app/(docs)/react/components/##' | sort
find repos/ui/apps/v4/content/docs/components/base -maxdepth 1 -type f | sed 's#^repos/ui/apps/v4/content/docs/components/base/##; s#.mdx$##' | sort
find repos/ui/apps/v4/styles/base-nova/ui -maxdepth 1 -type f | sed 's#^repos/ui/apps/v4/styles/base-nova/ui/##; s#.tsx$##' | sort
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Current resolver smoke | `bun run origin:resolve -- https://base-ui.com/react/components/button` | exit 0, Button origin evidence printed |
| Registry validation | `bun run registry:check` | exit 0, source manifests valid |
| Registry build | `bun run registry:build` | exit 0, generated registry remains valid |
| Parity smoke | `bun run parity:check -- --grep button` | exit 0, Button parity still passes |
| Typecheck | `bun run typecheck` | exit 0 |
| Ultracite check | `bun run check` | exit 0 |
| Build | `bun run build` | exit 0 |
| Git whitespace | `git diff --check` | exit 0 |

After the generic resolver/dossier work in Step 1, these smoke commands must
also exit 0:

```bash
bun run origin:resolve -- https://base-ui.com/react/components/separator
bun run origin:resolve -- https://ui.shadcn.com/docs/components/separator
bun run origin:resolve -- https://base-ui.com/react/components/progress
bun run origin:resolve -- https://ui.shadcn.com/docs/components/progress
bun run origin:resolve -- https://ui.shadcn.com/docs/components/badge
```

## Suggested executor toolkit

- Invoke the repo-local `foldkit` skill before adding Foldkit code.
- Invoke the repo-local `add-registry-component` skill for dossier generation
  after Step 1 generalizes the resolver enough to support non-Button URLs.
- Treat `repos/base-ui/`, `repos/ui/`, and `repos/foldkit/` as read-only
  references. Do not import from those paths in installable registry source.
- Keep the Plan 002 Button implementation as the exemplar for batch shape,
  parity slots, theme token accounting, `toView`/part-renderer decisions, and
  source/runtime boundaries.

## Scope

**In scope**:

- `scripts/origin-common.ts`
- `scripts/draft-registry-component-plan.ts`
- Tests or fixtures needed to prove generic origin resolution and dossier
  generation for the selected backlog
- `.agents/skills/add-registry-component/SKILL.md` if the skill's documented
  workflow needs to stop saying it is Button-only
- `plans/artifacts/004-foundational-component-backlog/**`
- New dossier artifacts under
  `plans/artifacts/004-foundational-component-dossiers/**`
- `plans/README.md` status row update when done

**Out of scope**:

- Do not implement any selected component in `registry-src/` or `src/registry/`
  as part of this plan.
- Do not mark any new registry item installable.
- Do not update or fetch upstream submodules.
- Do not add charts, blocks, theme generation, or documentation-site features.
- Do not widen a component batch after dossier generation uncovers dependencies.
  Record the dependency and defer the dependent component to its own row.

## Steps

### Step 1: Generalize origin resolution beyond Button

Update `scripts/origin-common.ts` so `resolveOriginUrl` can resolve local
evidence for Base UI component docs URLs and shadcn component docs URLs without
hard-coding every path in a bespoke function.

Target behavior:

- Base UI URLs shaped as
  `https://base-ui.com/react/components/<slug>` resolve to:
  - source files under `repos/base-ui/packages/react/src/<slug>/`
  - docs files under
    `repos/base-ui/docs/src/app/(docs)/react/components/<slug>/`
  - demos under that docs folder when present
  - tests/specs under the Base UI package component folder when present
  - `runtimeDependencyHints` containing `@base-ui-components/react/<slug>`
- shadcn URLs shaped as
  `https://ui.shadcn.com/docs/components/<slug>` resolve to:
  - primary source under `repos/ui/apps/v4/styles/base-nova/ui/<slug>.tsx`
    when present
  - style variants under every `repos/ui/apps/v4/styles/base-*/ui/<slug>.tsx`
    and the matching `ui-rtl` variant when present
  - docs under both `content/docs/components/base/<slug>.mdx` and
    `content/docs/components/radix/<slug>.mdx` when present
  - examples matching `repos/ui/apps/v4/examples/base/<slug>-*.tsx`
  - registry dependency hints inferred from source/example imports where the
    import clearly maps to an existing or selected local registry item
  - external runtime hints for packages that must be replaced, shimmed, or kept
    fixture-only

Keep Button behavior equivalent after the refactor. Button may still have
hand-authored overrides for special dependency notes.

**Verify**:

```bash
bun run origin:resolve -- https://base-ui.com/react/components/button
bun run origin:resolve -- https://ui.shadcn.com/docs/components/button
bun run origin:resolve -- https://base-ui.com/react/components/separator
bun run origin:resolve -- https://ui.shadcn.com/docs/components/separator
bun run origin:resolve -- https://base-ui.com/react/components/progress
bun run origin:resolve -- https://ui.shadcn.com/docs/components/progress
bun run origin:resolve -- https://ui.shadcn.com/docs/components/badge
```

Expected result: every command exits 0 and prints local paths from pinned
origin repos. Button still includes its known source, docs, demo, test, and
spec paths.

### Step 2: Make the dossier generator component-neutral

Update `scripts/draft-registry-component-plan.ts` so it can generate a dossier
preview for arbitrary resolved URLs instead of rendering Button-only text.

Target behavior:

- The output directory defaults to a component-neutral path only when no
  `--output` is provided.
- The rendered markdown names the resolved origin components and slugs.
- Dependency classification is derived from the resolved hints and local
  registry namespace rules, not from a Button-only static array.
- Origin test/spec classification includes all discovered test and spec paths.
- The future plan shape says "create these registry items" without naming
  Button unless Button was actually requested.

**Verify**:

```bash
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/004-foundational-component-dossiers/separator https://base-ui.com/react/components/separator https://ui.shadcn.com/docs/components/separator
find plans/artifacts/004-foundational-component-dossiers/separator -type f | sort
rg -n "separator|base-ui/separator|shadcn/separator|Origin Evidence|Future Improve Plan Shape" plans/artifacts/004-foundational-component-dossiers/separator
```

Expected result: `dossier.json` and `plan-preview.md` are written, and neither
file uses Button-only prose for the Separator batch.

### Step 3: Generate the independent starter dossiers

Generate dossiers for the rows marked `Parallel-safe starter` in the backlog
artifact. These rows are intentionally independent so they can become separate
worker branches after the resolver/dossier generator is committed.

Required starter rows:

- `shadcn/badge`
- `shadcn/skeleton`
- `shadcn/kbd`
- `shadcn/aspect-ratio`
- `base-ui/separator` plus `shadcn/separator`
- `base-ui/progress` plus `shadcn/progress`

**Verify**:

```bash
find plans/artifacts/004-foundational-component-dossiers -maxdepth 2 -name dossier.json | sort
rg -n "shadcn/badge|shadcn/skeleton|shadcn/kbd|shadcn/aspect-ratio|base-ui/separator|shadcn/separator|base-ui/progress|shadcn/progress" plans/artifacts/004-foundational-component-dossiers
```

Expected result: at least six starter dossier directories exist and the `rg`
command finds every required registry item name.

### Step 4: Generate the first dependency-complete primitive dossiers

Generate dossiers for the first stateful primitive rows from the backlog:

- `base-ui/avatar` plus `shadcn/avatar`
- `base-ui/input` plus `shadcn/input`
- `shadcn/textarea`
- `base-ui/switch` plus `shadcn/switch`
- `base-ui/checkbox` plus `shadcn/checkbox`
- `base-ui/radio-group` plus `shadcn/radio-group`
- `base-ui/tabs` plus `shadcn/tabs`
- `base-ui/collapsible` plus `shadcn/collapsible`

Do not implement the components. These dossiers are the raw material for later
one- or two-component execution plans.

**Verify**:

```bash
find plans/artifacts/004-foundational-component-dossiers -maxdepth 2 -name dossier.json | wc -l
rg -n "base-ui/avatar|shadcn/avatar|base-ui/input|shadcn/input|shadcn/textarea|base-ui/switch|shadcn/switch|base-ui/checkbox|shadcn/checkbox|base-ui/radio-group|shadcn/radio-group|base-ui/tabs|shadcn/tabs|base-ui/collapsible|shadcn/collapsible" plans/artifacts/004-foundational-component-dossiers
```

Expected result: dossier count is at least 14 and the `rg` command finds every
required registry item name.

### Step 5: Generate deferred-but-foundational queue notes

For the remaining foundational rows, create lightweight queue notes if full
dossiers expose dependencies that make them too wide for immediate execution:

- `base-ui/toggle` plus `shadcn/toggle`
- `base-ui/toggle-group` plus `shadcn/toggle-group`
- `base-ui/slider` plus `shadcn/slider`
- `base-ui/accordion` plus `shadcn/accordion`
- `base-ui/dialog` plus `shadcn/dialog`
- `base-ui/popover` plus `shadcn/popover`

Each queue note must name the blocker or dependency layer if the row should not
be handed to a component implementation worker yet.

**Verify**:

```bash
rg -n "base-ui/toggle|shadcn/toggle|base-ui/toggle-group|shadcn/toggle-group|base-ui/slider|shadcn/slider|base-ui/accordion|shadcn/accordion|base-ui/dialog|shadcn/dialog|base-ui/popover|shadcn/popover|blocker|dependency" plans/artifacts/004-foundational-component-dossiers plans/artifacts/004-foundational-component-backlog
```

Expected result: every deferred row is represented either by a dossier or by a
queue note with an explicit dependency/blocker.

### Step 6: Final verification and index update

Run the full checks that protect the planning/dossier tooling:

```bash
bun run registry:check
bun run registry:build
bun run parity:check -- --grep button
bun run typecheck
bun run check
bun run build
git diff --check
```

Expected result: every command exits 0. Then update the Plan 004 row in
`plans/README.md` to `DONE`.

## Test plan

- Add or update tests for generic origin URL resolution if a suitable test
  harness already exists for scripts or registry validation.
- If no script tests exist, use the Step 1 resolver smoke commands as the
  minimum verification gate and keep the generated `dossier.json` files as
  reviewable evidence.
- Do not add component Story/Scene tests in this plan. Those belong to the
  eventual implementation plans generated from these dossiers.

## Done criteria

- [ ] `scripts/origin-common.ts` resolves non-Button Base UI and shadcn docs
  URLs from local pinned origin repos.
- [ ] `scripts/draft-registry-component-plan.ts` generates non-Button dossier
  previews without Button-specific prose or dependencies.
- [ ] `plans/artifacts/004-foundational-component-backlog/component-backlog.md`
  remains the source queue for at least 20 recommended foundational rows.
- [ ] At least six parallel-safe starter dossiers exist under
  `plans/artifacts/004-foundational-component-dossiers/**`.
- [ ] At least 14 total dossier directories exist, or any missing row has an
  explicit queue note with the dependency/blocker.
- [ ] `bun run registry:check` exits 0.
- [ ] `bun run registry:build` exits 0.
- [ ] `bun run parity:check -- --grep button` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run check` exits 0.
- [ ] `bun run build` exits 0.
- [ ] `git diff --check` exits 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Any selected component lacks local origin evidence in both Base UI and shadcn
  where the backlog marks it as a paired row.
- Generalizing the resolver would require fetching live upstream docs or
  changing submodule refs.
- The shadcn source for a selected row imports a component not already present
  in the local registry or the selected backlog, and the dependency cannot be
  represented as a clear follow-up row.
- A selected component expands into a block/chart/documentation-site feature
  instead of a bounded registry component.
- Any verification command fails twice after a reasonable fix attempt.

## Maintenance notes

- Keep one- or two-component implementation batches after this plan. The
  backlog is broad on purpose; implementation should stay narrow.
- The best first parallel workers after this plan are static shadcn-only rows
  and tiny paired primitives: Badge, Skeleton, Kbd, Aspect Ratio, Separator,
  and Progress.
- Overlay components such as Dialog and Popover are foundational, but they
  should wait until the queue notes call out their shared focus, portal,
  floating-positioning, and scroll-lock requirements.
