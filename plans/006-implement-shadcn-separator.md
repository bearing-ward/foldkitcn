# Plan 006: Implement shadcn Separator wrapper and examples

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat e13dfbb7..HEAD -- plans/artifacts/004-foundational-component-dossiers/separator registry-src/shadcn/separator src/registry/shadcn/separator tests/parity/fixtures/origin/shadcn tests/parity/fixtures/foldkit/shadcn tests/parity/shadcn-origin-runner.test.ts tests/parity/slots.ts scripts/parity-dry-run.ts registry/index.json plans/README.md`
>
> Expected drift from plan 005 is allowed only when it is the completed
> `base-ui/separator` dependency, the Base UI parity slot, the generated
> registry index, and the plan index status update. Any other in-scope mismatch
> is a STOP condition. This repository may already have unrelated dirty local
> setup files; do not edit or revert them.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/005-implement-base-ui-separator.md`
- **Category**: feature
- **Planned at**: commit `e13dfbb7`, 2026-06-24

## Why this matters

The shadcn Separator is the styled consumer-facing registry item that proves a
shadcn component can depend on a local Foldkit-native Base UI primitive. It
must preserve the origin base-nova class string and examples while replacing
React, `@base-ui/react/separator`, and the language selector with local
Foldkit-compatible code. The parity harness also needs a small generalization
so multiple shadcn slots can share the browser fixture runner without each slot
accidentally comparing every shadcn example.

## Current state

This plan must run after plan 005. Confirm these files exist before starting:

- `registry-src/base-ui/separator/item.json`
- `src/registry/base-ui/separator/index.ts`
- `tests/parity/fixtures/origin/base-ui/separator.fixture.tsx`
- `tests/parity/fixtures/foldkit/base-ui/separator.fixture.ts`

The separator dossier pins shadcn to
`95471a0fb95b2b205e1850841e05d93f3fcae659`. The shadcn separator resolution
hash, computed with the repo's canonical `hashJson`, is
`65cd557e0d609c74abb2adcb76a999728e6abaff0e23447e5701c713bb3431ef`.

The origin shadcn wrapper is:

```tsx
// repos/ui/apps/v4/styles/base-nova/ui/separator.tsx:3-21
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import { cn } from '@/lib/utils'

function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
        className,
      )}
      {...props}
    />
  )
}
```

The origin examples to replicate are:

- `repos/ui/apps/v4/examples/base/separator-demo.tsx`: max-width text block,
  heading, subtitle, separator, description.
- `repos/ui/apps/v4/examples/base/separator-list.tsx`: definition-list rows
  separated by horizontal separators.
- `repos/ui/apps/v4/examples/base/separator-menu.tsx`: vertical separators,
  including a responsive `hidden md:block` separator.
- `repos/ui/apps/v4/examples/base/separator-vertical.tsx`: compact nav labels
  with vertical separators.
- `repos/ui/apps/v4/examples/base/separator-rtl.tsx`: RTL demo that imports
  `@/components/language-selector`; this must become local fixture/example
  data in Foldkit, not an installable runtime dependency.

Relevant local patterns:

- `src/registry/shadcn/button/index.ts` composes a local Base UI primitive,
  uses Effect Schema-derived style options, exports pure class helpers, adds
  `data-slot`, and applies `cn`.
- `src/registry/shadcn/button/examples.ts` replicates shadcn examples as
  Foldkit `Html` functions. It uses local inline replacements for origin-only
  React dependencies.
- `registry-src/shadcn/button/item.json` records registry dependencies on
  `base-ui/button` and `utils/cn`, runtime dependencies on `foldkit`,
  `effect`, `clsx`, and `tailwind-merge`, and origin-only packages as
  development dependencies.
- `tests/parity/fixtures/origin/shadcn/case-metadata.ts` is the shared case
  table for shadcn origin and Foldkit fixtures.
- `tests/parity/fixtures/origin/shadcn/runner.ts` currently aliases only
  button paths; it must learn separator aliases.
- `scripts/parity-dry-run.ts` currently special-cases only
  `slot.itemId === 'shadcn/button'`; it must support all `shadcn/*` slots and
  filter shadcn browser cases by component prefix.

## Commands you will need

| Purpose                  | Command                                                                                               | Expected on success                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Dependency gate          | `test -f registry-src/base-ui/separator/item.json && test -f src/registry/base-ui/separator/index.ts` | exit 0                                                           |
| Registry dependency gate | `bun run registry:check`                                                                              | exit 0 before shadcn work starts                                 |
| Source test              | `bun run test -- src/registry/shadcn/separator/separator.test.ts`                                     | exit 0; wrapper tests pass                                       |
| Origin fixture smoke     | `bun run test -- tests/parity/shadcn-origin-runner.test.ts`                                           | exit 0; shadcn origin runner captures button and separator cases |
| Registry validation      | `bun run registry:check`                                                                              | exit 0; all source manifests validate                            |
| Registry build           | `bun run registry:build`                                                                              | exit 0; `registry/index.json` includes `shadcn/separator`        |
| Parity discovery         | `bun run parity:check -- --grep shadcn/separator --dry-run`                                           | exit 0; discovers exactly the `shadcn/separator` slot            |
| Parity check             | `bun run parity:check -- --grep shadcn/separator`                                                     | exit 0; all separator examples compare equal                     |
| Full tests               | `bun run test`                                                                                        | exit 0                                                           |
| Typecheck                | `bun run typecheck`                                                                                   | exit 0                                                           |
| Lint/check               | `bun run check`                                                                                       | exit 0                                                           |
| Build                    | `bun run build`                                                                                       | exit 0                                                           |

## Scope

**In scope**:

- `registry-src/shadcn/separator/item.json` (create)
- `src/registry/shadcn/separator/index.ts` (create)
- `src/registry/shadcn/separator/examples.ts` (create)
- `src/registry/shadcn/separator/separator.test.ts` (create)
- `tests/parity/fixtures/origin/shadcn/case-metadata.ts`
- `tests/parity/fixtures/origin/shadcn/cases.tsx`
- `tests/parity/fixtures/origin/shadcn/runner.ts`
- `tests/parity/fixtures/foldkit/shadcn/cases.ts`
- `tests/parity/shadcn-origin-runner.test.ts`
- `tests/parity/slots.ts`
- `scripts/parity-dry-run.ts`
- `registry/index.json`
- `plans/README.md`

**Out of scope**:

- Reworking the Base UI separator primitive from plan 005 except to report a
  blocker if it is missing.
- Adding theme-generation infrastructure.
- Adding docs pages beyond registry examples and generated registry index.
- Editing `repos/base-ui` or `repos/ui`.
- Pulling `@base-ui/react/separator`, React, or
  `@/components/language-selector` into installable source.

## Git workflow

- Branch: `codex/006-shadcn-separator`
- Commit message style: conventional commits, for example
  `feat: add shadcn separator registry item`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Verify the Base UI dependency

Run:

```sh
test -f registry-src/base-ui/separator/item.json && test -f src/registry/base-ui/separator/index.ts
bun run registry:check
```

Expected result: both commands exit 0.

If `base-ui/separator` is missing or registry validation fails because of that
item, stop and report that plan 005 must be completed first.

### Step 2: Implement the shadcn wrapper

Create `src/registry/shadcn/separator/index.ts` using
`src/registry/shadcn/button/index.ts` as the pattern.

Required source shape:

- Import `Schema as S` from `effect`.
- Import `type Attribute, type Html` and `html` from `foldkit/html`.
- Import `cn` from `../../../utils/cn`.
- Import `* as BaseSeparator` from `../../base-ui/separator`.
- Add section headers `// MODEL` and `// VIEW`.
- Define `SeparatorStyleOptions = S.Struct({ className: S.optional(S.String) })`
  and export its schema-derived type.
- Re-export or alias the orientation type from the Base UI module only if useful
  for consumers; do not duplicate incompatible orientation schemas.
- Define `SeparatorAttributes<Message>` as
  `BaseSeparator.SeparatorAttributes<Message>`.
- Define `ViewConfig<Message>` as `Omit<BaseSeparator.ViewConfig<Message>, 'toView'>`
  plus `SeparatorStyleOptions` and a local `toView`.
- Export `baseClassName` as exactly:

```ts
'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch'
```

- Export a pure helper such as `separatorClassName(options:
SeparatorStyleOptions = {})` that returns `cn(baseClassName, className)`.
- Add attributes in this order after the Base UI attributes:
  `h.DataAttribute('slot', 'separator')`, then
  `h.Class(separatorClassName({ className }))`.
- Compose `BaseSeparator.view`, passing all base config including `orientation`.

Do not import React, `@base-ui/react/separator`, `@/lib/utils`, or origin files.

**Verify**: `bun run typecheck` should compile the wrapper; if unrelated
pre-existing files fail, capture the error and continue only if the separator
wrapper has no type errors.

### Step 3: Add wrapper tests

Create `src/registry/shadcn/separator/separator.test.ts`.

Cover:

- `baseClassName` equals the exact origin class string.
- `separatorClassName()` includes the base tokens.
- `separatorClassName({ className: 'my-separator' })` preserves the custom
  class and keeps `cn` canonicalization.
- `view` adds `data-slot="separator"`.
- `view` passes through default and vertical orientation attributes from
  `BaseSeparator.view`.
- Installable source for `registry-src/shadcn/separator/item.json` contains no
  forbidden origin/runtime strings after the manifest is added:
  `@base-ui/react`, `@base-ui-components/react`, `react`, `react-dom`,
  `@/components/language-selector`.

Use the existing shadcn button tests as style guidance.

**Verify**: `bun run test -- src/registry/shadcn/separator/separator.test.ts`
passes.

### Step 4: Replicate shadcn examples

Create `src/registry/shadcn/separator/examples.ts` following
`src/registry/shadcn/button/examples.ts`.

Export these functions, each returning `Html`:

- `SeparatorDemo`
- `SeparatorList`
- `SeparatorMenu`
- `SeparatorVertical`
- `SeparatorRtl`

Implementation requirements:

- Bind `const h = html<never>()` inside each exported function.
- Use the local shadcn separator `view` helper from `./index`.
- Preserve origin layout class strings exactly:
  - `flex max-w-sm flex-col gap-4 text-sm`
  - `flex flex-col gap-1.5`
  - `leading-none font-medium`
  - `text-muted-foreground`
  - `flex w-full max-w-sm flex-col gap-2 text-sm`
  - `flex items-center justify-between`
  - `flex items-center gap-2 text-sm md:gap-4`
  - `flex flex-col gap-1`
  - `text-xs text-muted-foreground`
  - `hidden md:block`
  - `hidden flex-col gap-1 md:flex`
  - `flex h-5 items-center gap-4 text-sm`
- Preserve the origin example structure: `dl`, `dt`, `dd`, `span`, and `div`
  should match the origin examples where Foldkit supports them.
- For `SeparatorRtl`, replace the origin `useTranslation` dependency with
  local constants in the example file. It is acceptable to include the origin
  Arabic and Hebrew strings in this file because the example's purpose is RTL
  fidelity. The rendered default should match the origin's Arabic case with
  `dir="rtl"`.

**Verify**: `bun run typecheck` and
`bun run test -- src/registry/shadcn/separator/separator.test.ts` pass.

### Step 5: Extend shadcn parity cases

Update `tests/parity/fixtures/origin/shadcn/case-metadata.ts` with separator
case metadata:

- `separator-demo` -> `repos/ui/apps/v4/examples/base/separator-demo.tsx`
- `separator-list` -> `repos/ui/apps/v4/examples/base/separator-list.tsx`
- `separator-menu` -> `repos/ui/apps/v4/examples/base/separator-menu.tsx`
- `separator-vertical` ->
  `repos/ui/apps/v4/examples/base/separator-vertical.tsx`
- `separator-rtl` -> `repos/ui/apps/v4/examples/base/separator-rtl.tsx`

Update `tests/parity/fixtures/origin/shadcn/cases.tsx`:

- Import origin `SeparatorDemo` default export.
- Import named `SeparatorList`, `SeparatorMenu`, `SeparatorVertical`, and
  `SeparatorRtl`.
- Add the five ids to the `components` map.

Update `tests/parity/fixtures/foldkit/shadcn/cases.ts`:

- Import the five Foldkit example exports.
- Add the five ids to the `components` map.
- Preserve the current behavior that rewrites `originFilePath` to the local
  Foldkit examples path for Foldkit snapshots.

**Verify**: `bun run typecheck` passes.

### Step 6: Teach the shadcn origin runner about separator

Update `tests/parity/fixtures/origin/shadcn/runner.ts`.

Required alias changes:

- In `originAliasPlugin().resolveId`, add:
  - `@base-ui/react/separator` ->
    `repos/base-ui/packages/react/src/separator/index.ts`
- In `resolve.alias`, add:
  - `@/styles/base-nova/ui/separator` ->
    `repos/ui/apps/v4/styles/base-nova/ui/separator.tsx`
  - `@/styles/base-nova/ui-rtl/separator` ->
    `repos/ui/apps/v4/styles/base-nova/ui-rtl/separator.tsx`

Keep the existing button aliases intact.

Update `tests/parity/shadcn-origin-runner.test.ts` with a separator smoke test:

- Capture `separator-demo`.
- Assert `originFilePath` is
  `repos/ui/apps/v4/examples/base/separator-demo.tsx`.
- Assert the snapshot has non-empty colors/computed styles/dimensions and a
  non-zero bounding box.
- Assert `classTokens` contains `shrink-0` and `bg-border`.
- Assert attributes include `data-slot="separator"` and
  `aria-orientation="horizontal"`.

**Verify**: `bun run test -- tests/parity/shadcn-origin-runner.test.ts`
passes.

### Step 7: Generalize shadcn parity slot handling

Update `scripts/parity-dry-run.ts` so shadcn browser fixture comparison works
for every `shadcn/*` slot, not only `shadcn/button`.

Required behavior:

- Replace `slot.itemId === 'shadcn/button'` with
  `slot.itemId.startsWith('shadcn/')`.
- Add a helper that derives the case grep for a shadcn slot:
  - if the CLI grep is undefined, use the component part of the item id
    (`button` for `shadcn/button`, `separator` for `shadcn/separator`);
  - if the CLI grep contains `/`, also use the component part of the item id;
  - otherwise use the CLI grep directly so case-level greps like
    `separator-rtl` still work.
- Pass that derived grep to both `captureShadcnOriginSnapshots` and
  `captureShadcnFoldkitSnapshots`.

This prevents `--grep shadcn/separator` from capturing and comparing button
cases under the separator slot.

**Verify**:

- `bun run parity:check -- --grep shadcn/button --dry-run` still discovers the
  button slot.
- `bun run parity:check -- --grep shadcn/separator --dry-run` discovers the
  separator slot after step 8 adds it.

### Step 8: Add the shadcn parity slot and manifest

Update `tests/parity/slots.ts` with a new ready slot:

- `itemId`: `shadcn/separator`
- `originFixtureEntrypoint`: `tests/parity/fixtures/origin/shadcn/entry.tsx`
- `foldkitFixtureEntrypoint`: `tests/parity/fixtures/foldkit/shadcn/entry.ts`
- `comparisons`: `class-tokens`, `attributes`, `dom-structure`,
  `computed-style`, `colors`, `dimensions`, `bounding-box`

Create `registry-src/shadcn/separator/item.json` by matching
`registry-src/shadcn/button/item.json`.

Required manifest values:

- `schemaVersion`: `1`
- `id`: `shadcn/separator`
- `namespace`: `shadcn`
- `name`: `Separator`
- `kind`: `component`
- `description`: mention that this is a Foldkit-native shadcn base-nova
  Separator wrapper using local Base UI Separator behavior and `cn`.
- `sourceRoot`: `registry-src/shadcn/separator`
- `installableSourcePaths`:
  `["src/registry/shadcn/separator/index.ts", "src/registry/shadcn/separator/examples.ts"]`
- `consumedThemeTokens`: `["--border"]`
- `originProvenance[0].originKind`: `shadcn`
- `originProvenance[0].originName`: `shadcn Separator`
- `originProvenance[0].docsUrl`:
  `https://ui.shadcn.com/docs/components/separator`
- `originProvenance[0].sourceUrl`:
  `https://github.com/shadcn-ui/ui/tree/95471a0fb95b2b205e1850841e05d93f3fcae659/apps/v4/styles/base-nova/ui/separator.tsx`
- `originProvenance[0].localRepoPath`: `repos/ui`
- `originProvenance[0].gitRef`:
  `95471a0fb95b2b205e1850841e05d93f3fcae659`
- `originProvenance[0].inventoryHash`:
  `65cd557e0d609c74abb2adcb76a999728e6abaff0e23447e5701c713bb3431ef`
- `sourcePaths`: `["repos/ui/apps/v4/styles/base-nova/ui/separator.tsx"]`
- `docsPaths`: the two shadcn separator docs paths from the dossier.
- `examplePaths`: all five shadcn separator demo paths from the dossier.
- `testPaths`: `[]`
- Registry dependencies:
  - `base-ui/separator` as `registry-local`, target `base-ui/separator`
  - `utils/cn` as `registry-local`, target `utils/cn`
- Runtime dependencies:
  - `foldkit` as `allowed-runtime`
  - `effect` as `allowed-runtime`
  - `clsx` as `allowed-runtime`
  - `tailwind-merge` as `allowed-runtime`
- Development dependencies:
  - `@base-ui/react/separator` as `replace-with-foldkit`, target
    `base-ui/separator`
  - `react` as `dev-or-fixture-only`
  - `@/components/language-selector` as `reject-or-defer`, with a reason that
    it is replaced by local example constants and origin fixture aliases.
- Examples:
  - `shadcn/separator-demo`
  - `shadcn/separator-list`
  - `shadcn/separator-menu`
  - `shadcn/separator-vertical`
  - `shadcn/separator-rtl`
    Each should point to `src/registry/shadcn/separator/examples.ts` and have
    kind `demo`.
- `parity.itemId`: `shadcn/separator`
- `parity.originFixturePath`: `tests/parity/fixtures/origin/shadcn/entry.tsx`
- `parity.foldkitFixturePath`: `tests/parity/fixtures/foldkit/shadcn/entry.ts`
- `parity.requiredComparisons`: same comparisons as the slot.
- `parity.acceptedDeviationIds`: `["shadcn-separator-local-rtl-data"]`
- `lifecycle`: implemented, accepted parity, current drift, installable.
- `deviations`: one accepted required deviation with id
  `shadcn-separator-local-rtl-data`, explaining that the RTL example uses local
  constants instead of the origin language-selector runtime dependency.

If you want to confirm the provenance hash, run:

```sh
bun -e "import { hashJson } from './scripts/registry-common.ts'; const dossier = await Bun.file('plans/artifacts/004-foundational-component-dossiers/separator/dossier.json').json(); console.log(hashJson(dossier.resolutions.find((resolution) => resolution.originKind === 'shadcn')));"
```

Expected output:

```text
65cd557e0d609c74abb2adcb76a999728e6abaff0e23447e5701c713bb3431ef
```

**Verify**:

- `bun run registry:check` exits 0.
- `bun run parity:check -- --grep shadcn/separator --dry-run` discovers one
  ready slot for `shadcn/separator`.
- `bun run parity:check -- --grep shadcn/separator` passes.

### Step 9: Build the registry index

Run `bun run registry:build`.

Expected result:

- `registry/index.json` changes.
- The generated index contains entries for both `base-ui/separator` and
  `shadcn/separator`.

**Verify**:

```sh
bun -e "const index = await Bun.file('registry/index.json').json(); console.log(index.items.map((entry) => entry.item.id).sort().join('\\n'));"
```

Expected output includes:

```text
base-ui/separator
shadcn/separator
```

### Step 10: Final validation and index update

Run the full validation sequence:

```sh
bun run test
bun run typecheck
bun run check
bun run build
bun run registry:check
bun run parity:check -- --grep shadcn/separator
```

Then update `plans/README.md` row 006 from `TODO` to `DONE`.

**Verify**: all commands exit 0, and `git status --short -- registry-src/shadcn/separator src/registry/shadcn/separator tests/parity/fixtures/origin/shadcn tests/parity/fixtures/foldkit/shadcn tests/parity/shadcn-origin-runner.test.ts tests/parity/slots.ts scripts/parity-dry-run.ts registry/index.json plans/README.md` shows only expected in-scope changes.

## Test plan

- `src/registry/shadcn/separator/separator.test.ts` covers class helper
  fidelity, custom classes, `data-slot`, and orientation passthrough.
- `tests/parity/shadcn-origin-runner.test.ts` adds a browser smoke for the
  pinned origin separator example.
- The shared shadcn parity cases compare the five origin separator examples
  against the five Foldkit example functions.
- `bun run parity:check -- --grep shadcn/separator` validates class tokens,
  attributes, DOM structure, computed style, colors, dimensions, and bounding
  boxes.

## Done criteria

- [ ] `shadcn/separator` composes `base-ui/separator` and never imports React
      or Base UI React in installable source.
- [ ] The exported base class string exactly matches the base-nova origin.
- [ ] All five shadcn separator examples exist as Foldkit `Html` functions.
- [ ] The RTL example is local and does not depend on
      `@/components/language-selector`.
- [ ] The shadcn parity harness supports multiple `shadcn/*` slots with
      component-scoped case filtering.
- [ ] `registry-src/shadcn/separator/item.json` validates and records
      `base-ui/separator` plus `utils/cn` as registry-local dependencies.
- [ ] `registry/index.json` contains `shadcn/separator`.
- [ ] `bun run test`, `bun run typecheck`, `bun run check`, `bun run build`,
      `bun run registry:check`, and
      `bun run parity:check -- --grep shadcn/separator` exit 0.
- [ ] `plans/README.md` marks plan 006 as `DONE`.

## STOP conditions

Stop and report back if:

- Plan 005 has not produced an installable `base-ui/separator`.
- The origin shadcn separator class string differs from the one quoted in this
  plan.
- The shadcn origin fixture cannot bundle `@base-ui/react/separator` with a
  local alias to the pinned Base UI source.
- Parity requires adding a runtime dependency on React, Base UI React,
  `@/components/language-selector`, or any origin repo path to installable
  source.
- The registry schema rejects a local RTL-data deviation for the manifest.
- Any fix appears to require editing files outside this plan's scope.
- A verification command fails twice after a reasonable fix attempt.

## Maintenance notes

- The shadcn parity runner generalization is shared infrastructure. Reviewer
  should confirm button parity still works after adding separator.
- Future shadcn components should reuse the component-prefix shadcn case
  filtering introduced here.
- Future theme work should read `consumedThemeTokens` and confirm `--border`
  is provided by every supported local theme pack.
