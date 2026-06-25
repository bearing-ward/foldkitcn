# Plan 014: Implement shadcn Alert and Native Select wrappers

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 7e045720..HEAD -- plans/artifacts/007-remaining-component-dossiers/shadcn-alert plans/artifacts/007-remaining-component-dossiers/shadcn-native-select registry-src/shadcn/alert registry-src/shadcn/native-select src/registry/shadcn/alert src/registry/shadcn/native-select tests/parity/fixtures/origin/shadcn tests/parity/fixtures/foldkit/shadcn tests/parity/slots.ts registry/index.json plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/007-generate-remaining-component-dossiers.md`
- **Category**: feature
- **Planned at**: commit `7e045720`, 2026-06-25

## Why this matters

Alert and Native Select are low-friction shadcn components from the remaining
queue. Alert proves another CVA-to-Schema class-map port and uses the existing
Button in action examples. Native Select proves a styled native form wrapper
with nested option and optgroup helpers, disabled/invalid states, and an inline
icon replacement for `lucide-react`.

## Current state

Alert dossier:

- `plans/artifacts/007-remaining-component-dossiers/shadcn-alert/dossier.json`
  pins shadcn Alert to `95471a0fb95b2b205e1850841e05d93f3fcae659`.
- Origin source: `repos/ui/apps/v4/styles/base-nova/ui/alert.tsx`.
- Origin examples: `alert-action.tsx`, `alert-basic.tsx`,
  `alert-colors.tsx`, `alert-demo.tsx`, `alert-destructive.tsx`,
  `alert-rtl.tsx`.
- Runtime hints include CVA, lucide-react, React, and the language selector.
  Installable source must replace these with Schema class maps, inline SVG
  helpers, and local RTL constants.

Native Select dossier:

- `plans/artifacts/007-remaining-component-dossiers/shadcn-native-select/dossier.json`
  pins shadcn Native Select to the same shadcn ref.
- Origin source: `repos/ui/apps/v4/styles/base-nova/ui/native-select.tsx`.
- Origin examples: `native-select-demo.tsx`, `native-select-disabled.tsx`,
  `native-select-groups.tsx`, `native-select-invalid.tsx`,
  `native-select-rtl.tsx`.

Relevant origin contracts:

- Alert root: `data-slot="alert"`, `role="alert"`, variant classes for
  `default` and `destructive`.
- Alert parts: `data-slot="alert-title"`,
  `data-slot="alert-description"`, and `data-slot="alert-action"`.
- Native Select wrapper: `data-slot="native-select-wrapper"`,
  `data-size`, wrapper class, child `<select>`, and chevron icon with
  `data-slot="native-select-icon"`.
- Native Select option and optgroup both use Canvas system-color classes.

## Commands you will need

| Purpose              | Command                                                                                                                                                                            | Expected on success     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Dossier check        | `test -f plans/artifacts/007-remaining-component-dossiers/shadcn-alert/dossier.json && test -f plans/artifacts/007-remaining-component-dossiers/shadcn-native-select/dossier.json` | exit 0                  |
| Source tests         | `bun run test -- src/registry/shadcn/alert/alert.test.ts src/registry/shadcn/native-select/native-select.test.ts`                                                                  | exit 0                  |
| Origin fixture smoke | `bun run test -- tests/parity/shadcn-origin-runner.test.ts`                                                                                                                        | exit 0                  |
| Registry validation  | `bun run registry:check`                                                                                                                                                           | exit 0                  |
| Registry build       | `bun run registry:build`                                                                                                                                                           | exit 0                  |
| Parity discovery     | `bun run parity:check -- --grep shadcn/alert --dry-run && bun run parity:check -- --grep shadcn/native-select --dry-run`                                                           | each discovers one slot |
| Parity check         | `bun run parity:check -- --grep shadcn/alert && bun run parity:check -- --grep shadcn/native-select`                                                                               | both exit 0             |
| Full tests           | `bun run test`                                                                                                                                                                     | exit 0                  |
| Typecheck            | `bun run typecheck`                                                                                                                                                                | exit 0                  |
| Lint/check           | `bun run check`                                                                                                                                                                    | exit 0                  |
| Build                | `bun run build`                                                                                                                                                                    | exit 0                  |

## Scope

**In scope**:

- `registry-src/shadcn/alert/item.json` (create)
- `registry-src/shadcn/native-select/item.json` (create)
- `src/registry/shadcn/alert/index.ts` (create)
- `src/registry/shadcn/alert/examples.ts` (create)
- `src/registry/shadcn/alert/alert.test.ts` (create)
- `src/registry/shadcn/native-select/index.ts` (create)
- `src/registry/shadcn/native-select/examples.ts` (create)
- `src/registry/shadcn/native-select/native-select.test.ts` (create)
- shadcn parity fixture metadata, origin cases, Foldkit cases, origin aliases,
  and `tests/parity/slots.ts`
- `registry/index.json`
- `plans/README.md`

**Out of scope**:

- Do not implement Alert Dialog. The similarly named origin examples under
  `alert-dialog-*` are not part of this plan.
- Do not implement a generic form/select abstraction.
- Do not add `class-variance-authority` or `lucide-react` to installable
  source.

## Git workflow

- Branch: `codex/014-shadcn-alert-native-select`
- Use conventional commits, for example:
  `feat: add shadcn alert and native select registry items`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Add Alert source and tests

Create `src/registry/shadcn/alert/index.ts`.

Required shape:

- Schema literal `AlertVariant`: `default`, `destructive`
- `AlertStyleOptions`, `AlertTitleStyleOptions`,
  `AlertDescriptionStyleOptions`, and `AlertActionStyleOptions`
- pure class helpers for root and each part
- render helpers for root, title, description, and action using named
  attributes and `toView`
- root helper includes `role="alert"` and `data-slot="alert"`

Create `src/registry/shadcn/alert/alert.test.ts` covering variant classes,
part classes, merged `className`, and root attributes.

**Verify**: `bun run test -- src/registry/shadcn/alert/alert.test.ts` -> exits 0.

### Step 2: Add Native Select source and tests

Create `src/registry/shadcn/native-select/index.ts`.

Required shape:

- Schema literal `NativeSelectSize`: `default`, `sm`
- helpers for wrapper, select, option, optgroup, and icon classes
- `view<Message>(config)` that renders through `toView` with named attributes
  for wrapper, select, and icon
- `optionView<Message>(config)` and `optGroupView<Message>(config)` helpers
  for examples
- inline chevron SVG helper for examples or exported part rendering, replacing
  `lucide-react`

Create `src/registry/shadcn/native-select/native-select.test.ts` covering size
classes/data attributes, disabled wrapper behavior, invalid select attributes,
option/optgroup classes, and icon attributes.

**Verify**:
`bun run test -- src/registry/shadcn/native-select/native-select.test.ts` ->
exits 0.

### Step 3: Add examples

Create Alert and Native Select examples matching the origin demo lists.

Alert:

- Use inline SVGs for lucide icons.
- Use existing local `shadcn/button` only where the origin action example
  requires a button-shaped action.
- Replace RTL language selector data with local constants and record an
  accepted deviation.

Native Select:

- Render real `<select>`, `<option>`, and `<optgroup>` markup.
- Preserve disabled, invalid, groups, default, and RTL examples.
- Use local inline chevron icon helper.

**Verify**: `bun run typecheck` -> exits 0.

### Step 4: Extend parity fixtures

Add all Alert and Native Select cases to shared shadcn origin and Foldkit
fixtures.

Origin runner aliases must include:

- `@/styles/base-nova/ui/alert`
- `@/styles/base-nova/ui-rtl/alert`
- `@/styles/base-nova/ui/native-select`
- `@/styles/base-nova/ui-rtl/native-select`
- `@/styles/base-nova/ui/button` if Alert action examples import Button
- `lucide-react` handling through origin fixture dependencies or aliases
  already accepted for fixture-only usage

Add `shadcn/alert` and `shadcn/native-select` slots to `tests/parity/slots.ts`.

**Verify**: dry-run parity for both slots discovers exactly one slot each and
the expected examples.

### Step 5: Add manifests and build output

Create both manifests.

Alert manifest:

- registry dependencies: `utils/cn` and example dependency on `shadcn/button`
  when action examples need it
- classify CVA as `reject-or-defer`
- classify lucide icons and language selector as fixture-only or accepted local
  deviations
- consumed tokens include `--card`, `--card-foreground`, `--destructive`,
  `--muted-foreground`, `--foreground`, `--ring`, and `--border`

Native Select manifest:

- registry dependency: `utils/cn`
- classify lucide icon dependency as `dev-or-fixture-only`
- consumed tokens include `--input`, `--primary`,
  `--primary-foreground`, `--muted-foreground`, `--ring`, `--destructive`,
  and `--radius-md`

Run `bun run registry:build`.

**Verify**: `bun run registry:check` and `bun run registry:build` -> both exit 0.

## Test plan

- Unit tests for Alert and Native Select render helpers.
- shadcn parity cases for every origin Alert and Native Select example.
- Full gates:
  `bun run parity:check -- --grep shadcn/alert`,
  `bun run parity:check -- --grep shadcn/native-select`, `bun run test`,
  `bun run typecheck`, `bun run check`, and `bun run build`.

## Done criteria

- [ ] `shadcn/alert` and `shadcn/native-select` manifests validate.
- [ ] Both components use Schema-backed options and pure class helpers.
- [ ] All origin examples are replicated with accepted local substitutions.
- [ ] Both parity slots pass.
- [ ] Full validation gates pass.
- [ ] `plans/README.md` row 014 is updated to DONE.

## STOP conditions

Stop and report back if:

- Alert examples accidentally pull in Alert Dialog.
- Native Select needs behavior beyond native form markup.
- Origin fixture aliasing for icons requires adding icon packages to
  installable runtime source.
- Any parity mismatch requires an unplanned visual or DOM deviation.

## Maintenance notes

Alert is another CVA replacement precedent; reviewers should check variant
class exactness. Native Select is likely to inform future field/form wrappers;
review its native attributes and invalid/disabled states carefully.
