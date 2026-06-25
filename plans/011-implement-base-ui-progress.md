# Plan 011: Implement Base UI Progress primitive

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 72aabe87..HEAD -- plans/artifacts/004-foundational-component-dossiers/progress registry-src/base-ui/progress src/registry/base-ui/progress tests/parity/fixtures/origin/base-ui tests/parity/fixtures/foldkit/base-ui tests/parity/slots.ts registry/index.json plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: `plans/004-generate-foundational-component-dossiers.md`
- **Category**: feature
- **Planned at**: commit `72aabe87`, 2026-06-25

## Why this matters

Progress is the first multi-part Base UI value primitive in this registry. It
establishes how Foldkit ports represent root, label, track, indicator, and
value parts without React context while preserving Base UI ARIA, data
attributes, value clamping, formatting, and indeterminate behavior. shadcn
Progress in plan 012 must depend on this local primitive, so this plan is the
behavior foundation.

## Current state

- `plans/artifacts/004-foundational-component-dossiers/progress/dossier.json`
  pins Base UI Progress to `ea3818dec91923d4287b38be21322d2e5068d347`.
- Source paths include root, label, track, indicator, value, and
  `stateAttributesMapping`.
- Origin tests exist for every part under
  `repos/base-ui/packages/react/src/progress/**`.
- Shared parity slots already include `base-ui/button`, `base-ui/separator`,
  and shadcn `badge`, `button`, `kbd`, `separator`, and `skeleton`. Preserve
  those slots and the generated registry entries while adding Progress.

Relevant origin behavior:

- `Progress.Root` renders a `div` with `role="progressbar"`,
  `aria-valuemin`, `aria-valuemax`, `aria-valuenow` when determinate, and
  `aria-valuetext`.
- `value === null` or a non-finite value is indeterminate.
- Determinate values are clamped to `[min, max]`.
- The indicator receives inline style `{ insetInlineStart: 0, height:
'inherit', width: '<percentage>%' }` when determinate.
- Status maps to `data-progressing`, `data-complete`, or
  `data-indeterminate`.
- The default formatted text is percent unless a format option is provided.

Relevant local patterns:

- `src/registry/base-ui/button/index.ts` and
  `src/registry/base-ui/separator/index.ts` are render-helper primitives that
  expose `toView` part attributes.
- `src/registry/base-ui/button/scene.test.ts` is the source-test style to
  follow.
- `tests/parity/fixtures/origin/base-ui/button.fixture.tsx` and
  `tests/parity/fixtures/foldkit/base-ui/button.fixture.ts` show Base UI
  origin-vs-Foldkit fixture structure.

## Commands you will need

| Purpose             | Command                                                                             | Expected on success                 |
| ------------------- | ----------------------------------------------------------------------------------- | ----------------------------------- |
| Dossier check       | `test -f plans/artifacts/004-foundational-component-dossiers/progress/dossier.json` | exit 0                              |
| Source test         | `bun run test -- src/registry/base-ui/progress/scene.test.ts`                       | exit 0                              |
| Registry validation | `bun run registry:check`                                                            | exit 0                              |
| Registry build      | `bun run registry:build`                                                            | exit 0                              |
| Parity discovery    | `bun run parity:check -- --grep base-ui/progress --dry-run`                         | discovers exactly one Progress slot |
| Parity check        | `bun run parity:check -- --grep base-ui/progress`                                   | exit 0                              |
| Full tests          | `bun run test`                                                                      | exit 0                              |
| Typecheck           | `bun run typecheck`                                                                 | exit 0                              |
| Lint/check          | `bun run check`                                                                     | exit 0                              |
| Build               | `bun run build`                                                                     | exit 0                              |

## Scope

**In scope**:

- `registry-src/base-ui/progress/item.json` (create)
- `src/registry/base-ui/progress/index.ts` (create)
- `src/registry/base-ui/progress/scene.test.ts` (create)
- `tests/parity/fixtures/origin/base-ui/progress.fixture.tsx` (create)
- `tests/parity/fixtures/foldkit/base-ui/progress.fixture.ts` (create)
- `tests/parity/canonicalize.test.ts`
- `tests/parity/slots.ts`
- `registry/index.json`
- `plans/README.md` (reviewer-owned; executor should not edit)

**Out of scope**:

- Do not implement shadcn Progress here; that is plan 012.
- Do not implement Meter here; plan 013 may reuse helper decisions from this
  plan.
- Do not add React context, upstream Base UI imports, or origin repo imports to
  installable source.

## Git workflow

- Branch: `codex/011-base-ui-progress`
- Use conventional commits, for example:
  `feat: add base-ui progress registry item`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Model Progress value normalization

Create `src/registry/base-ui/progress/index.ts`.

Define Schema-backed options:

- `ProgressStatus`: `indeterminate`, `progressing`, `complete`
- `ProgressOptions`: `value`, `min`, `max`, `locale`, and an optional
  serializable format options record if needed
- `ProgressPart`: root, label, track, indicator, value

Add pure helpers:

- `progressState(options)` returns status, clamped value, percentage, formatted
  value, aria value text, min, and max.
- `progressStatusAttributes(h, status)` returns exactly one status data
  attribute.
- `indicatorStyle(percentage)` returns no style for indeterminate progress and
  the origin inline style for determinate progress.

If full `Intl.NumberFormatOptions` cannot be represented cleanly with Effect
Schema, use a minimal Schema-backed subset for the formats required by origin
tests and STOP before widening to an untyped `unknown` bag.

**Verify**: `bun run typecheck` -> exits 0, or only fails because tests are not
created yet.

### Step 2: Add multi-part Foldkit render helpers

Expose a single `view<Message>(config)` helper that accepts a `toView`
function with named attributes:

- `root`
- `label`
- `track`
- `indicator`
- `value`

Required attributes:

- root: `role="progressbar"`, `aria-valuemin`, `aria-valuemax`,
  determinate `aria-valuenow`, `aria-valuetext`, optional
  `aria-labelledby`, and the status data attribute
- label: stable id support through a `labelId` option rather than hidden React
  state
- track: status data attribute
- indicator: status data attribute plus inline width style for determinate
  values
- value: status data attribute and default formatted text support through a
  helper exported from this module

Composition must use `toView`; do not expose public `asChild`.

**Verify**: `bun run typecheck` -> exits 0.

### Step 3: Port Base UI source tests as Scene tests

Create `src/registry/base-ui/progress/scene.test.ts`.

Cover at least:

- root ARIA attributes for value `30`
- `aria-valuenow` updates when `view` receives a different value
- custom range `min=20`, `max=40`, `value=30` produces 50 percent
- overshoot clamps `aria-valuenow` and indicator width
- complete status sets `data-complete`
- min equals max produces zero percent and stable ARIA
- indeterminate value sets `data-indeterminate` and omits `aria-valuenow`
- value text uses percent by default and honors a supported format option

Use `foldkit/test` Scene style where possible, matching existing component
tests in `src/registry/base-ui/button/scene.test.ts`.

**Verify**: `bun run test -- src/registry/base-ui/progress/scene.test.ts` ->
exits 0.

### Step 4: Add Base UI parity fixtures

Create origin and Foldkit fixture modules for Progress.

Origin fixture cases should cover:

- default determinate progress
- custom range
- complete status
- indeterminate status
- label + value + track + indicator composition

Foldkit fixture cases should render equivalent DOM with the local helper.

Add a `base-ui/progress` slot in `tests/parity/slots.ts` with comparisons:
class tokens, attributes, DOM structure, computed style, colors, dimensions,
bounding box, and keyboard behavior only if a keyboard case exists. Progress
does not need keyboard behavior unless the origin fixture actually exposes it.
Keep all existing ready slots intact.
Update `tests/parity/canonicalize.test.ts` so the ready-slot expectation
includes `base-ui/progress` in the actual exported order.

**Verify**: `bun run parity:check -- --grep base-ui/progress --dry-run` ->
discovers exactly one slot.

### Step 5: Add the registry manifest

Create `registry-src/base-ui/progress/item.json`.

Requirements:

- `id`: `base-ui/progress`
- `namespace`: `base-ui`
- installable path: `src/registry/base-ui/progress/index.ts`
- provenance from the dossier, including all root/track/indicator/label/value
  source and test paths
- dependencies: `foldkit` and `effect` allowed at runtime;
  `@base-ui-components/react/progress` classified as `replace-with-foldkit`
- lifecycle: `implemented`, `accepted`, `current`, `installable` after parity
  passes
- deviations: only required framework-level deviations, such as explicit
  `labelId` instead of React-managed label context, with rationale

Run `bun run registry:build`.

**Verify**: `bun run registry:check` and `bun run registry:build` -> both exit 0.

## Test plan

- Scene tests in `src/registry/base-ui/progress/scene.test.ts`.
- Base UI parity fixtures for determinate, custom range, complete,
  indeterminate, and label/value composition cases.
- Full gates:
  `bun run parity:check -- --grep base-ui/progress`, `bun run test`,
  `bun run typecheck`, `bun run check`, and `bun run build`.

## Done criteria

- [ ] `base-ui/progress` source and manifest exist.
- [ ] Progress value normalization is pure, tested, and Schema-backed.
- [ ] Root, label, track, indicator, and value parts expose named attributes
      through `toView`.
- [ ] Base UI origin parity passes for Progress.
- [ ] Full validation gates pass.
- [ ] `plans/README.md` row 011 is updated to DONE.

## STOP conditions

Stop and report back if:

- Matching origin formatting requires arbitrary non-schema runtime data.
- Label association cannot be represented without hidden mutable state.
- Parity requires a required deviation beyond framework-level context removal.
- You need to change the parity harness in a way that breaks Button or
  Separator parity.

## Maintenance notes

Progress sets the value-helper precedent for Meter. Reviewers should inspect
clamping, indeterminate handling, `aria-valuetext`, and accepted deviations
closely; later range/value components should reuse the same semantics.
