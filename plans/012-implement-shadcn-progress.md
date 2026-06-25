# Plan 012: Implement shadcn Progress wrapper and examples

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 7e045720..HEAD -- plans/artifacts/004-foundational-component-dossiers/progress registry-src/base-ui/progress registry-src/shadcn/progress src/registry/base-ui/progress src/registry/shadcn/progress tests/parity/fixtures/origin/shadcn tests/parity/fixtures/foldkit/shadcn tests/parity/slots.ts registry/index.json plans/README.md`
>
> Expected drift from plan 011 is allowed only when it is the completed
> `base-ui/progress` dependency, Base UI Progress parity slot, generated
> registry index, and plan index status update. Any other in-scope mismatch is
> a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/011-implement-base-ui-progress.md`
- **Category**: feature
- **Planned at**: commit `7e045720`, 2026-06-25

## Why this matters

shadcn Progress proves that a styled shadcn wrapper can compose a local
multi-part Base UI primitive. It also adds the first shadcn value examples,
including controlled and labeled progress, without importing
`@base-ui/react/progress`.

## Current state

The shadcn Progress dossier is part of
`plans/artifacts/004-foundational-component-dossiers/progress/dossier.json`.
It pins shadcn to `95471a0fb95b2b205e1850841e05d93f3fcae659`.

Origin source:

```tsx
// repos/ui/apps/v4/styles/base-nova/ui/progress.tsx
<ProgressPrimitive.Root
  value={value}
  data-slot="progress"
  className={cn('flex flex-wrap gap-3', className)}
>
  {children}
  <ProgressTrack>
    <ProgressIndicator />
  </ProgressTrack>
</ProgressPrimitive.Root>
```

Origin class contracts:

- root: `flex flex-wrap gap-3`
- track:
  `relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted`
- indicator: `h-full bg-primary transition-all`
- label: `text-sm font-medium`
- value: `ml-auto text-sm text-muted-foreground tabular-nums`

Origin examples to replicate:

- `progress-controlled.tsx`
- `progress-demo.tsx`
- `progress-label.tsx`
- `progress-rtl.tsx`

## Commands you will need

| Purpose                  | Command                                                                                             | Expected on success                 |
| ------------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Dependency gate          | `test -f registry-src/base-ui/progress/item.json && test -f src/registry/base-ui/progress/index.ts` | exit 0                              |
| Registry dependency gate | `bun run registry:check`                                                                            | exit 0 before shadcn work starts    |
| Source test              | `bun run test -- src/registry/shadcn/progress/progress.test.ts`                                     | exit 0                              |
| Origin fixture smoke     | `bun run test -- tests/parity/shadcn-origin-runner.test.ts`                                         | exit 0                              |
| Registry validation      | `bun run registry:check`                                                                            | exit 0                              |
| Registry build           | `bun run registry:build`                                                                            | exit 0                              |
| Parity discovery         | `bun run parity:check -- --grep shadcn/progress --dry-run`                                          | discovers exactly one Progress slot |
| Parity check             | `bun run parity:check -- --grep shadcn/progress`                                                    | exit 0                              |
| Full tests               | `bun run test`                                                                                      | exit 0                              |
| Typecheck                | `bun run typecheck`                                                                                 | exit 0                              |
| Lint/check               | `bun run check`                                                                                     | exit 0                              |
| Build                    | `bun run build`                                                                                     | exit 0                              |

## Scope

**In scope**:

- `registry-src/shadcn/progress/item.json` (create)
- `src/registry/shadcn/progress/index.ts` (create)
- `src/registry/shadcn/progress/examples.ts` (create)
- `src/registry/shadcn/progress/progress.test.ts` (create)
- shadcn parity fixture metadata, origin cases, Foldkit cases, origin aliases,
  and `tests/parity/slots.ts`
- `registry/index.json`
- `plans/README.md`

**Out of scope**:

- Do not change `base-ui/progress` behavior except for a clearly required bug
  discovered while using its public API. If that happens, STOP and report.
- Do not implement Slider for `progress-controlled`; use static example data
  unless the origin parity fixture proves interaction is required.
- Do not import `@base-ui/react/progress` in installable source.

## Git workflow

- Branch: `codex/012-shadcn-progress`
- Use conventional commits, for example:
  `feat: add shadcn progress registry item`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Add the shadcn Progress wrapper

Create `src/registry/shadcn/progress/index.ts`.

Required exports:

- `ProgressStyleOptions`
- `ProgressTrackStyleOptions`
- `ProgressIndicatorStyleOptions`
- `ProgressLabelStyleOptions`
- `ProgressValueStyleOptions`
- class helpers for each part
- `view<Message>(config)` for the root composition
- optional direct part helpers if needed by examples, but root `view` should
  mirror the origin default composition by including a track and indicator when
  the caller does not provide custom children

The wrapper must compose `BaseProgress.view` and add:

- `data-slot="progress"` and root class
- `data-slot="progress-track"` and track class
- `data-slot="progress-indicator"` and indicator class
- `data-slot="progress-label"` and label class
- `data-slot="progress-value"` and value class

**Verify**: `bun run typecheck` -> exits 0.

### Step 2: Add Progress examples

Create `src/registry/shadcn/progress/examples.ts`.

Replicate all four origin examples. For controlled progress, use deterministic
static state in the example fixture rather than timers or React state; this is
a rendered parity fixture, not an interactive app.

For RTL, replace the origin language selector dependency with local Arabic
constants and record an accepted deviation in the manifest, following
`shadcn/separator`.

**Verify**: `bun run typecheck` -> exits 0.

### Step 3: Add focused wrapper tests

Create `src/registry/shadcn/progress/progress.test.ts`.

Cover:

- every part class helper returns the exact origin class string by default
- `className` merges through `cn`
- root view includes `data-slot="progress"`
- default composition includes track and indicator slots
- label/value helpers preserve Base UI ARIA/value behavior from
  `base-ui/progress`

**Verify**: `bun run test -- src/registry/shadcn/progress/progress.test.ts` ->
exits 0.

### Step 4: Add shadcn parity cases

Add all four Progress examples to shared shadcn origin and Foldkit fixtures.

Origin runner aliases must include:

- `@/styles/base-nova/ui/progress`
- `@/styles/base-nova/ui-rtl/progress`
- `@base-ui/react/progress`

`@base-ui/react/progress` must resolve to the pinned local Base UI origin
source under `repos/base-ui`, not to an installed package.

Add a `shadcn/progress` slot in `tests/parity/slots.ts` using the standard
shadcn comparison list.

**Verify**: `bun run parity:check -- --grep shadcn/progress --dry-run` ->
discovers exactly one slot and four Progress cases.

### Step 5: Add manifest and build output

Create `registry-src/shadcn/progress/item.json`.

Requirements:

- registry dependencies: `base-ui/progress`, `utils/cn`
- runtime dependencies: `foldkit`, `effect`, `clsx`, `tailwind-merge`
- development classifications: `@base-ui/react/progress` is
  `replace-with-foldkit`, React/language selector are fixture-only or accepted
  local deviations
- consumed tokens: `--muted`, `--primary`, and `--muted-foreground`
- examples list all four local examples
- lifecycle reaches `implemented`, `accepted`, `current`, `installable` only
  after parity passes

Run `bun run registry:build`.

**Verify**: `bun run registry:check` and `bun run registry:build` -> both exit 0.

## Test plan

- Wrapper unit tests in `src/registry/shadcn/progress/progress.test.ts`.
- shadcn origin/Foldkit parity cases for all four Progress examples.
- Full gates:
  `bun run parity:check -- --grep shadcn/progress`, `bun run test`,
  `bun run typecheck`, `bun run check`, and `bun run build`.

## Done criteria

- [ ] `shadcn/progress` depends on local `base-ui/progress`.
- [ ] All five origin part class contracts are preserved.
- [ ] All four origin examples are represented.
- [ ] shadcn Progress parity passes.
- [ ] Full validation gates pass.
- [ ] `plans/README.md` row 012 is updated to DONE.

## STOP conditions

Stop and report back if:

- `base-ui/progress` is missing or not accepted when this plan starts.
- Controlled Progress requires real time or interactive slider behavior for
  parity.
- Any required deviation changes user-facing DOM structure or class tokens.

## Maintenance notes

Progress is likely to be reused in blocks and dashboards. Review exact part
class names and the default root composition carefully, because a small
wrapper drift here will make later examples visually wrong.
