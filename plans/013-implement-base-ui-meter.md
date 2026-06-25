# Plan 013: Implement Base UI Meter primitive

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 7e045720..HEAD -- plans/artifacts/007-remaining-component-dossiers/base-ui-meter registry-src/base-ui/meter src/registry/base-ui/meter src/registry/base-ui/progress tests/parity/fixtures/origin/base-ui tests/parity/fixtures/foldkit/base-ui tests/parity/slots.ts registry/index.json plans/README.md`
>
> Expected drift from plan 011 is allowed only when it is the completed
> `base-ui/progress` dependency and any shared helper files it introduced. Any
> mismatch between live Progress helper semantics and this plan is a STOP
> condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/007-generate-remaining-component-dossiers.md`,
  `plans/011-implement-base-ui-progress.md`
- **Category**: feature
- **Planned at**: commit `7e045720`, 2026-06-25

## Why this matters

Meter is a Base UI value primitive that is close enough to Progress to reveal
whether the registry's range-value helpers are reusable. It should not copy a
second incompatible implementation of clamping, formatting, labels, tracks,
indicators, and values. Landing Meter after Progress keeps the behavior model
coherent before form and dashboard components start depending on value
displays.

## Current state

- `plans/artifacts/007-remaining-component-dossiers/base-ui-meter/dossier.json`
  pins Base UI Meter to `ea3818dec91923d4287b38be21322d2e5068d347`.
- Source paths include root, label, track, indicator, and value parts under
  `repos/base-ui/packages/react/src/meter/`.
- Origin tests exist for every Meter part.

The dossier reports no registry dependencies and a runtime hint for
`@base-ui-components/react/meter`, which must be replaced by local Foldkit
source.

Local precedent:

- `src/registry/base-ui/progress/index.ts` from plan 011 is the value-helper
  precedent. Reuse its pure helpers if they are generic enough; otherwise
  extract a small local helper only if doing so reduces duplication without
  changing Progress behavior.

## Commands you will need

| Purpose             | Command                                                                                             | Expected on success              |
| ------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------- |
| Dependency gate     | `test -f registry-src/base-ui/progress/item.json && test -f src/registry/base-ui/progress/index.ts` | exit 0                           |
| Dossier check       | `test -f plans/artifacts/007-remaining-component-dossiers/base-ui-meter/dossier.json`               | exit 0                           |
| Source test         | `bun run test -- src/registry/base-ui/meter/scene.test.ts`                                          | exit 0                           |
| Registry validation | `bun run registry:check`                                                                            | exit 0                           |
| Registry build      | `bun run registry:build`                                                                            | exit 0                           |
| Parity discovery    | `bun run parity:check -- --grep base-ui/meter --dry-run`                                            | discovers exactly one Meter slot |
| Parity check        | `bun run parity:check -- --grep base-ui/meter`                                                      | exit 0                           |
| Full tests          | `bun run test`                                                                                      | exit 0                           |
| Typecheck           | `bun run typecheck`                                                                                 | exit 0                           |
| Lint/check          | `bun run check`                                                                                     | exit 0                           |
| Build               | `bun run build`                                                                                     | exit 0                           |

## Scope

**In scope**:

- `registry-src/base-ui/meter/item.json` (create)
- `src/registry/base-ui/meter/index.ts` (create)
- `src/registry/base-ui/meter/scene.test.ts` (create)
- small shared value helper extracted from `src/registry/base-ui/progress` only
  if plan 011 made extraction clearly safe
- `tests/parity/fixtures/origin/base-ui/meter.fixture.tsx` (create)
- `tests/parity/fixtures/foldkit/base-ui/meter.fixture.ts` (create)
- `tests/parity/slots.ts`
- `registry/index.json`
- `plans/README.md`

**Out of scope**:

- Do not implement shadcn Meter; there is no shadcn Meter row in this batch.
- Do not change Progress public behavior.
- Do not introduce a broad shared range framework unless both Progress and
  Meter actually need the exact abstraction.

## Git workflow

- Branch: `codex/013-base-ui-meter`
- Use conventional commits, for example:
  `feat: add base-ui meter registry item`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Confirm and reuse Progress value semantics

Read the completed `src/registry/base-ui/progress/index.ts`. Identify any pure
helper that can be reused for Meter without changing names or behavior in a
confusing way.

If a shared helper is warranted, extract it into a focused file under
`src/registry/base-ui/` or `src/registry/` only when both existing Progress
tests and new Meter tests prove the helper. Keep the helper private to the
registry source unless a future plan needs it public.

**Verify**: `bun run test -- src/registry/base-ui/progress/scene.test.ts` ->
still exits 0.

### Step 2: Add Meter source

Create `src/registry/base-ui/meter/index.ts`.

Required shape:

- Effect Schema-backed options for `value`, `min`, `max`, `low`, `high`,
  `optimum`, `locale`, and supported format options.
- Named part attributes for `root`, `label`, `track`, `indicator`, and
  `value`.
- Root renders meter-appropriate ARIA attributes from the origin source and
  exposes deterministic label association through explicit options rather than
  hidden React context.
- Indicator width reflects the normalized percentage.
- Value text uses the same formatting conventions as the origin tests.

Use `toView`; do not expose `asChild`.

**Verify**: `bun run typecheck` -> exits 0, or only fails because tests are not
created yet.

### Step 3: Port origin Meter tests

Create `src/registry/base-ui/meter/scene.test.ts`.

Cover the origin behavior from root, indicator, label, track, and value tests:

- ARIA attributes and role
- custom range normalization
- clamping
- low/high/optimum attributes if present in the origin root source
- value formatting and text
- indicator width
- labels and part attributes

**Verify**: `bun run test -- src/registry/base-ui/meter/scene.test.ts` -> exits 0.

### Step 4: Add Base UI parity fixtures

Create origin and Foldkit Meter parity fixtures with at least:

- default meter
- custom range
- low/high/optimum case
- label/value/track/indicator composition

Add `base-ui/meter` to `tests/parity/slots.ts` with the standard Base UI
comparison set, excluding keyboard behavior unless an origin keyboard case
exists.

**Verify**: `bun run parity:check -- --grep base-ui/meter --dry-run` ->
discovers exactly one Meter slot.

### Step 5: Add manifest and build output

Create `registry-src/base-ui/meter/item.json`.

Requirements:

- provenance from the dossier, including all source and test paths
- runtime dependencies: `foldkit` and `effect`
- development dependency: `@base-ui-components/react/meter` as
  `replace-with-foldkit`
- deviations: only framework-level context/render replacement deviations
- lifecycle reaches accepted/installable only after parity passes

Run `bun run registry:build`.

**Verify**: `bun run registry:check` and `bun run registry:build` -> both exit 0.

## Test plan

- Scene tests for all Meter value and ARIA semantics.
- Parity fixtures for representative Meter compositions.
- Regression check that Progress tests still pass if any helper was shared.
- Full gates:
  `bun run parity:check -- --grep base-ui/meter`, `bun run test`,
  `bun run typecheck`, `bun run check`, and `bun run build`.

## Done criteria

- [ ] `base-ui/meter` source and manifest exist.
- [ ] Meter reuses or deliberately mirrors Progress value semantics without
      behavioral drift.
- [ ] Meter source tests and parity pass.
- [ ] Progress tests still pass.
- [ ] Full validation gates pass.
- [ ] `plans/README.md` row 013 is updated to DONE.

## STOP conditions

Stop and report back if:

- Progress was not completed or accepted before this plan starts.
- Meter origin semantics differ enough from Progress that shared helpers would
  hide important differences.
- Supporting `low`, `high`, or `optimum` requires unclear API decisions not
  covered by the dossier.

## Maintenance notes

Meter and Progress should stay visibly related but not over-abstracted. A
reviewer should check that any shared helper is small, pure, tested by both
components, and not a premature range-component framework.
