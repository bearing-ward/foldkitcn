# Plan 002: Add the Button proving batch

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` - unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 24113a13..HEAD -- AGENTS.md package.json bun.lock src tests scripts registry-src registry docs .agents plans vite.config.ts vitest.config.ts oxlint.config.ts oxfmt.config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: 001
- **Category**: feature
- **Planned at**: commit `24113a13`, 2026-06-24

## Execution note

First execution stopped on 2026-06-24 before Step 7. The executor proved that
Base UI Button origin-backed parity can run with a fixture-only DOM bootstrap,
but shadcn Button origin parity could not be rendered from pinned
`repos/ui` source without a bundler/alias layer. Execute
`plans/003-add-shadcn-origin-parity-fixture-bundling.md` first, then refresh
this plan and re-run it.

## Why this matters

Plan 001 built the registry rails. This plan proves those rails with the first
real dependency-complete component batch:

- `base-ui/button`
- `shadcn/button`

Button is the right proving batch because it is small enough to finish, but it
touches the hard parts of this registry: origin evidence, Foldkit-native API
shape, React fixture isolation, exact disabled/focus semantics, shadcn variant
classes, examples, theme tokens, and UI parity.

Do not widen this plan into a general component framework. Button should become
the exemplar for the next one or two origin-backed components.

## Current state

- Plan 001 is complete. The registry now has Effect Schema types,
  `registry-src/`, generated `registry/index.json`, `utils/cn`, origin
  resolution, parity canonicalizers, parity dry-run slots, and the
  `add-registry-component` skill.
- `plans/artifacts/002-button-proving-batch/` contains the generated Button
  dossier preview for this plan. It is planning evidence, not implementation.
- `utils/cn` is already installable and wraps `clsx` plus `tailwind-merge`.
- Current git state at planning time was dirty before this plan:
  `.gitignore`, `.mcp.json`, `package.json`, and `vitest.config.ts` were
  modified, and `bunfig.toml` was untracked. Treat those as pre-existing
  changes unless your dispatcher tells you otherwise.
- `@foldkit/ui` already has a stateless `Button.view`, but it is not a
  drop-in Base UI Button port. In particular, its disabled behavior uses
  `aria-disabled` and keeps `tabindex="0"` by default, while Base UI uses the
  native `disabled` attribute for a disabled native button unless
  `focusableWhenDisabled` is true. Use the Foldkit UI shape as a design
  reference, not as a fidelity shortcut.

## Origin evidence

The local origin resolver returned these immutable refs:

| Origin         | Local repo      | Pinned ref                                 | Confidence |
| -------------- | --------------- | ------------------------------------------ | ---------- |
| Base UI Button | `repos/base-ui` | `ea3818dec91923d4287b38be21322d2e5068d347` | high       |
| shadcn Button  | `repos/ui`      | `95471a0fb95b2b205e1850841e05d93f3fcae659` | medium     |

Required Base UI evidence:

- Source: `repos/base-ui/packages/react/src/button/Button.tsx`
- Behavior: `repos/base-ui/packages/react/src/internals/use-button/useButton.ts`
- Data attributes: `repos/base-ui/packages/react/src/button/ButtonDataAttributes.tsx`
- Docs: `repos/base-ui/docs/src/app/(docs)/react/components/button/page.mdx`
- API docs: `repos/base-ui/docs/src/app/(docs)/react/components/button/types.md`
- Tests: `repos/base-ui/packages/react/src/button/Button.test.tsx`
- Spec: `repos/base-ui/packages/react/src/button/Button.spec.tsx`

Required shadcn evidence:

- Source: `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`
- Docs: `repos/ui/apps/v4/content/docs/components/base/button.mdx`
- Examples:
  - `repos/ui/apps/v4/examples/base/button-demo.tsx`
  - `repos/ui/apps/v4/examples/base/button-default.tsx`
  - `repos/ui/apps/v4/examples/base/button-outline.tsx`
  - `repos/ui/apps/v4/examples/base/button-secondary.tsx`
  - `repos/ui/apps/v4/examples/base/button-ghost.tsx`
  - `repos/ui/apps/v4/examples/base/button-destructive.tsx`
  - `repos/ui/apps/v4/examples/base/button-link.tsx`
  - `repos/ui/apps/v4/examples/base/button-icon.tsx`
  - `repos/ui/apps/v4/examples/base/button-with-icon.tsx`
  - `repos/ui/apps/v4/examples/base/button-size.tsx`
  - `repos/ui/apps/v4/examples/base/button-rounded.tsx`
  - `repos/ui/apps/v4/examples/base/button-spinner.tsx`
  - `repos/ui/apps/v4/examples/base/button-render.tsx`
  - `repos/ui/apps/v4/examples/base/button-rtl.tsx`
- Spinner style source for the spinner example:
  `repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx`
- CLI tests are evidence only:
  `repos/ui/packages/tests/src/tests/add.test.ts` and
  `repos/ui/packages/tests/src/tests/view.test.ts`

Button Group examples under `repos/ui/apps/v4/examples/base/button-group-*.tsx`
are cross-linked from shadcn Button docs, but they belong to a separate Button
Group component family. Do not silently ignore them. Inventory them in this
plan's artifacts and create a follow-up note, but do not implement Button Group
inside this Button proving batch.

## Fidelity target

Base UI Button behavior to preserve:

- Default render target is a native `<button>`.
- Default `type` is `button`; `submit` and `reset` remain supported.
- `data-disabled` is present when disabled.
- Native disabled button, with `focusableWhenDisabled` false:
  - has the native `disabled` attribute
  - does not have `aria-disabled`
  - is not focusable by tab
  - suppresses click, pointer, mouse, Space, and Enter activation
- Native disabled button, with `focusableWhenDisabled` true:
  - does not have the native `disabled` attribute
  - has `aria-disabled="true"`
  - has `tabindex="0"`
  - remains focusable by tab
  - suppresses click, pointer, mouse, Space, and Enter activation
  - allows hover-only behavior where the platform permits it
- Non-native button, with `isNativeButton` false:
  - applies `role="button"`
  - uses `aria-disabled` and `tabindex` for disabled state
  - maps Enter and Space to activation when enabled
  - does not expose link semantics as Button; shadcn link examples use the
    variant class helper on a plain `<a>`
- Origin React `render` and shadcn `asChild` capability maps to Foldkit
  `toView` or named part-renderer composition. Do not add a public `asChild`
  prop.

shadcn Button styling to preserve:

- Export Effect Schema literals for variant and size options.
- Replace `class-variance-authority` with pure local class maps.
- Depend on local `base-ui/button` and `utils/cn`.
- Preserve the `data-slot="button"` attribute.
- Preserve all base-nova variant and size class strings unless a framework
  deviation is recorded and accepted.
- Support link styling through the class helper, not by rendering links through
  the Button primitive.
- Record consumed theme tokens before marking `shadcn/button` installable.

## Commands you will need

| Purpose               | Command                                                                                                                                                                                       | Expected on success                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Refresh dossier       | `bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/002-button-proving-batch https://base-ui.com/react/components/button https://ui.shadcn.com/docs/components/button` | exit 0, artifacts updated                           |
| Registry validation   | `bun run registry:check`                                                                                                                                                                      | exit 0, source manifests valid                      |
| Registry build        | `bun run registry:build`                                                                                                                                                                      | exit 0, `registry/index.json` includes Button items |
| Origin resolver smoke | `bun run origin:resolve -- https://base-ui.com/react/components/button`                                                                                                                       | exit 0, local pinned Base UI Button evidence        |
| Button tests          | `bun run test -- src/registry tests/parity`                                                                                                                                                   | exit 0                                              |
| Full tests            | `bun run test`                                                                                                                                                                                | exit 0                                              |
| Typecheck             | `bun run typecheck`                                                                                                                                                                           | exit 0                                              |
| Ultracite check       | `bun run check`                                                                                                                                                                               | exit 0                                              |
| Build                 | `bun run build`                                                                                                                                                                               | exit 0                                              |
| Parity                | `bun run parity:check -- --grep button`                                                                                                                                                       | exit 0 with real Button parity comparisons          |
| Git whitespace        | `git diff --check`                                                                                                                                                                            | exit 0                                              |

If `parity:check -- --grep button` still only supports dry-run discovery when
you start, this plan requires you to upgrade the harness far enough to run the
Button origin and Foldkit fixtures for real.

## Suggested executor toolkit

- Invoke the repo-local Foldkit skill before adding Foldkit code.
- Read from `repos/foldkit/packages/ui/src/button/` for the stateless render
  helper shape.
- Read from `repos/foldkit/packages/foldkit/src/test/scene.ts` and existing
  `Scene` tests when adding interaction coverage.
- Use `repos/base-ui/` and `repos/ui/` as read-only origin references.
- Do not import from origin repos in installable source. Origin repo imports are
  allowed only in fixture/test code that is not listed in any
  `installableSourcePaths`.

## Scope

**In scope** (the only files/directories you should create or modify):

- `registry-src/base-ui/button/**`
- `registry-src/shadcn/button/**`
- `src/registry/**` for the Button implementations, schemas, tests, and parity
  helpers
- `tests/parity/**` for Button origin and Foldkit fixtures plus parity runner
  coverage
- `scripts/**` only when needed to make registry, origin, or parity commands
  support the Button batch
- `registry/index.json`
- `plans/artifacts/002-button-proving-batch/**`
- `plans/README.md` status row update when done
- `package.json`, `bun.lock`, Vite/Vitest/Oxlint/Oxfmt config only for
  deliberate test, parity, or fixture dependencies/configuration

**Out of scope**:

- Do not implement Button Group, Spinner, icons, charts, blocks, themes, or any
  component other than `base-ui/button` and `shadcn/button` as installable
  registry items.
- Do not rewrite the starter app into the final registry documentation site.
- Do not update or fetch upstream submodules.
- Do not add React, React DOM, Base UI React, or Radix React imports to
  installable source.
- Do not add `class-variance-authority`.
- Do not expose a public Foldkit `asChild` option.

## Implementation steps

### Step 1: Refresh and extend the Button dossier

Rerun the dossier command and keep the artifacts under
`plans/artifacts/002-button-proving-batch/`.

Add a small artifact that inventories every shadcn Button example found under
`repos/ui/apps/v4/examples/base/button*.tsx`, classifies each example as one of:

- `port-now`
- `port-with-example-local-helper`
- `defer-to-button-group`
- `not-applicable`

Expected classification:

- `port-now`: default, demo, outline, secondary, ghost, destructive, link,
  icon, with-icon, size, rounded, render, rtl
- `port-with-example-local-helper`: spinner
- `defer-to-button-group`: all `button-group-*` examples
- `not-applicable`: shadcn CLI installation tests

**Verify**:

```bash
find plans/artifacts/002-button-proving-batch -type f | sort
rg -n "base-ui/button|shadcn/button|focusableWhenDisabled|data-disabled|toView|button-group|spinner" plans/artifacts/002-button-proving-batch
```

### Step 2: Add `base-ui/button` manifest and implementation

Create `registry-src/base-ui/button/item.json` with:

- `id`: `base-ui/button`
- `namespace`: `base-ui`
- `kind`: `component`
- source root matching the manifest path
- origin provenance for Base UI Button with local repo, pinned ref, source,
  docs, demos, tests, spec paths, and inventory hash
- no runtime dependencies other than allowed local/Foldkit dependencies
- lifecycle `implemented`, `accepted`, `current`, `installable` only after all
  behavior and parity gates pass

Implement a Foldkit-native stateless render helper. It should probably live
under `src/registry/base-ui/button/`, unless the live repo has established a
better convention by execution time.

Required API shape:

- Serialisable options are backed by Effect Schema.
- Function-bearing view config may be a TypeScript type that composes those
  schema-backed options with `toView`.
- Use full names such as `Message` and `ViewConfig`.
- Bind `const h = html<Message>()` inside view functions.
- Return Html through `toView({ button: attributes })`.
- Use `isDisabled`, `isFocusableWhenDisabled`, and `isNativeButton` naming for
  Foldkit-native booleans.
- Include type values `button`, `submit`, and `reset`.

Do not add a Model/update pair unless the implementation truly needs state.
Button should remain stateless unless parity evidence proves otherwise.

**Verify**:

```bash
rg -n "base-ui/button|isFocusableWhenDisabled|isNativeButton|data-disabled|aria-disabled|role" registry-src/base-ui/button src/registry
bun run test -- src/registry
```

### Step 3: Port Base UI behavior tests

Port Base UI tests semantically, not mechanically. The important assertions are:

- disabled native buttons use `disabled` and `data-disabled`, not
  `aria-disabled`
- disabled native buttons are not tabbable when
  `isFocusableWhenDisabled` is false
- focusable disabled native buttons use `aria-disabled`, `tabindex="0"`, and no
  native `disabled`
- non-native buttons use `role="button"` and correct `aria-disabled`/tabindex
- disabled buttons suppress click, pointer, mouse, Enter, and Space activation
- enabled non-native buttons activate on Enter and Space
- submit/reset/button type attributes pass through for native buttons

Use Foldkit `Scene` tests where interaction through the rendered view matters.
Use smaller unit tests only for pure attribute builders.

**Verify**:

```bash
bun run test -- src/registry
```

### Step 4: Upgrade Button parity from dry-run to real fixture comparison

Create local origin and Foldkit fixtures for `base-ui/button`.

Origin fixture code may import React and Base UI from the pinned local source or
fixture-only dev dependencies. It must stay under `tests/parity/` or another
fixture-only path that is never listed in `installableSourcePaths`.

Foldkit fixture code must render the new local `base-ui/button` implementation.

Upgrade `bun run parity:check -- --grep button` so it can run the Button
fixtures and compare at least:

- class tokens
- attributes
- DOM structure
- computed style summary
- colors
- dimensions
- bounding box
- keyboard behavior

Use the canonicalization helpers from plan 001 so attribute order, class order,
color formats, and fractional dimensions compare deterministically.

**Verify**:

```bash
bun run parity:check -- --grep base-ui/button
bun run test -- tests/parity
```

### Step 5: Add `shadcn/button` manifest and implementation

Create `registry-src/shadcn/button/item.json` with:

- `id`: `shadcn/button`
- registry dependency on `base-ui/button`
- registry dependency on `utils/cn`
- origin provenance for shadcn Button with source, docs, examples, tests, style
  variants, and inventory hash
- runtime dependency hints from origin recorded as `replace-with-foldkit` or
  `reject-or-defer`, not runtime dependencies
- consumed theme tokens recorded
- lifecycle `implemented`, `accepted`, `current`, `installable` only after
  parity and examples pass

Implement the styled wrapper:

- Use local `base-ui/button`, not upstream Base UI React.
- Use local `cn`, not CVA.
- Declare variant and size literals with Effect Schema.
- Implement pure class mapping for all origin variants:
  `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`.
- Implement pure class mapping for all origin sizes:
  `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.
- Preserve the base class string and variant/size class strings from
  `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`.
- Export a class helper for plain links, matching shadcn `buttonVariants`.
- Render Button through the local primitive with `data-slot="button"`.

**Verify**:

```bash
rg -n "class-variance-authority|@base-ui/react|@radix-ui/react|react" src registry-src/shadcn/button
bun run test -- src/registry
```

The `rg` command should find no forbidden runtime imports in installable source.
It may find React only in fixture paths if you include them in the searched set;
do not list fixture paths in `installableSourcePaths`.

### Step 6: Replicate shadcn Button examples

Add executable example assets under `registry-src/shadcn/button/` or the
established examples location from the live repo.

Port the Button-only examples listed in Step 1. For icon examples, use local
fixture icons or simple inline Foldkit-rendered SVGs if the exact origin icon
package is not already allowed. The visual shape must still be parity-tested.

For `button-spinner`, add an example-local spinner helper that matches the
origin Spinner DOM contract closely enough for Button example parity:

- `data-slot="spinner"`
- `role="status"`
- `aria-label="Loading"`
- `size-4 animate-spin`
- `data-icon="inline-start"` or `data-icon="inline-end"` where the example
  uses it

Do not create an installable `shadcn/spinner` item in this plan.

For Button Group examples, add an artifact note listing the deferred files and
state that they belong to a later dependency-complete `button-group` batch.

**Verify**:

```bash
rg -n "ButtonDefault|ButtonOutline|ButtonSecondary|ButtonGhost|ButtonDestructive|ButtonLink|ButtonIcon|ButtonWithIcon|ButtonSize|ButtonRounded|ButtonSpinner|ButtonRender|ButtonRtl" registry-src src tests
```

### Step 7: Add shadcn visual parity

Add origin and Foldkit fixtures for shadcn Button default, variants, sizes,
icon, link helper, spinner, and RTL examples.

The parity runner must compare the origin shadcn example against the local
Foldkit example for:

- class token canonicalization
- data attributes
- DOM structure
- computed style summary
- colors
- dimensions
- bounding boxes

If a visual deviation is required because of a Foldkit framework-level
constraint, add a `DeviationRecord` with an explicit rationale and accepted
status before allowing installability.

**Verify**:

```bash
bun run parity:check -- --grep shadcn/button
```

### Step 8: Rebuild and validate registry output

Run registry validation and build. The generated `registry/index.json` must
include `base-ui/button` and `shadcn/button`, include artifact hashes, and show
that `shadcn/button` depends on local `base-ui/button` and `utils/cn`.

**Verify**:

```bash
bun run registry:check
bun run registry:build
rg -n '"id": "base-ui/button"|"id": "shadcn/button"|"target": "base-ui/button"|"target": "utils/cn"' registry/index.json
```

### Step 9: Final verification and index update

Run the full verification set:

```bash
bun run registry:check
bun run registry:build
bun run origin:resolve -- https://base-ui.com/react/components/button
bun run parity:check -- --grep button
bun run test
bun run typecheck
bun run check
bun run build
git diff --check
```

Update `plans/README.md` status for plan 002 to `DONE` only after all commands
pass. If a command cannot be run because the environment lacks a required
browser binary or dependency download, leave the status as `BLOCKED` with a
one-line reason and report the exact failing command.

## Test plan

- Attribute builder tests for Base UI Button native and non-native states.
- Foldkit `Scene` tests for click suppression, focusability, and keyboard
  activation.
- shadcn class helper tests for every variant and size.
- Registry validation tests proving `shadcn/button` depends on local
  `base-ui/button` and `utils/cn`.
- Parity tests for Base UI Button behavior fixtures.
- Parity tests for shadcn Button examples and variants.
- Dossier/example inventory tests or script checks to prove Button Group
  examples were explicitly deferred, not missed.

## Done criteria

ALL must hold:

- [ ] `registry-src/base-ui/button/item.json` exists and validates.
- [ ] `registry-src/shadcn/button/item.json` exists and validates.
- [ ] `base-ui/button` is a Foldkit-native implementation with no React or
      upstream Base UI runtime imports.
- [ ] `base-ui/button` preserves Base UI disabled, focusable disabled,
      non-native, `data-disabled`, role, type, and keyboard behavior.
- [ ] `shadcn/button` depends on local `base-ui/button` and `utils/cn`.
- [ ] `shadcn/button` replaces CVA with Effect Schema literals and pure class
      maps.
- [ ] Direct shadcn Button examples are replicated as executable local examples.
- [ ] Spinner use in Button examples is met locally without creating an
      installable Spinner item.
- [ ] Button Group examples are inventoried and deferred with an explicit
      follow-up note.
- [ ] Real Button parity checks run for origin and Foldkit fixtures.
- [ ] `registry/index.json` includes both Button items and generated hashes.
- [ ] `bun run registry:check`, `bun run registry:build`, `bun run
origin:resolve -- https://base-ui.com/react/components/button`, `bun run
parity:check -- --grep button`, `bun run test`, `bun run typecheck`, `bun
run check`, `bun run build`, and `git diff --check` all exit 0.
- [ ] No files outside the in-scope list are modified.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

Stop and report back without improvising if:

- The Button dossier cannot resolve from local pinned `repos/base-ui` and
  `repos/ui`.
- Preserving Base UI Button behavior appears to require React or upstream Base
  UI imports in installable source.
- The parity harness cannot render origin and Foldkit fixtures without adding
  broad app-level framework dependencies.
- Exact shadcn Button classes require `class-variance-authority`.
- Button Group examples cannot be cleanly deferred without hiding missing Button
  documentation coverage.
- The current uncommitted changes in `.gitignore`, `.mcp.json`, `package.json`,
  `vitest.config.ts`, or `bunfig.toml` conflict with this plan and you cannot
  preserve them cleanly.
- A verification command fails twice after a reasonable fix attempt.

## Maintenance notes

- This batch should teach the registry how to handle the simplest real
  primitive plus a styled wrapper. Extract shared internals only after reuse is
  visible.
- If the Base UI native disabled behavior conflicts with existing
  `@foldkit/ui` Button defaults, favor Base UI fidelity for `base-ui/button`
  and record any necessary framework deviation.
- The next likely plan after this is a small component that exercises a
  stateful primitive, or the deferred Button Group batch if Button docs parity
  makes that the highest-leverage follow-up.
