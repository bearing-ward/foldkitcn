# Plan 010: Implement shadcn Skeleton and Kbd primitives

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 16d08fc..HEAD -- plans/artifacts/004-foundational-component-dossiers/skeleton plans/artifacts/004-foundational-component-dossiers/kbd registry-src/shadcn/skeleton registry-src/shadcn/kbd src/registry/shadcn/skeleton src/registry/shadcn/kbd tests/parity/fixtures/origin/shadcn tests/parity/fixtures/foldkit/shadcn tests/parity/canonicalize.test.ts tests/parity/slots.ts registry/index.json plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/004-generate-foundational-component-dossiers.md`
- **Category**: feature
- **Planned at**: commit `16d08fc`, 2026-06-25

## Why this matters

Skeleton and Kbd are tiny shadcn-only primitives that prove static visual
components can be added quickly while still meeting the registry's origin
parity bar. Skeleton exercises animation, dimensions, and layout examples.
Kbd exercises inline semantic markup, grouped inline parts, icon examples, and
examples that reference future sibling components without making those siblings
installable dependencies.

## Current state

Skeleton dossier:

- `plans/artifacts/004-foundational-component-dossiers/skeleton/dossier.json`
  pins shadcn Skeleton to `95471a0fb95b2b205e1850841e05d93f3fcae659`.
- Origin source: `repos/ui/apps/v4/styles/base-nova/ui/skeleton.tsx`.
- Origin examples: `skeleton-avatar.tsx`, `skeleton-card.tsx`,
  `skeleton-demo.tsx`, `skeleton-form.tsx`, `skeleton-rtl.tsx`,
  `skeleton-table.tsx`, and `skeleton-text.tsx`.

Kbd dossier:

- `plans/artifacts/004-foundational-component-dossiers/kbd/dossier.json` pins
  shadcn Kbd to the same shadcn ref.
- Origin source: `repos/ui/apps/v4/styles/base-nova/ui/kbd.tsx`.
- Origin examples: `kbd-button.tsx`, `kbd-demo.tsx`, `kbd-group.tsx`,
  `kbd-input-group.tsx`, `kbd-rtl.tsx`, and `kbd-tooltip.tsx`.

Shared shadcn parity fixtures already include Button, Badge, and Separator
cases. Preserve existing Badge entries in case metadata, origin aliases,
Foldkit case maps, fixture CSS `@source` lists, `tests/parity/slots.ts`, and
`tests/parity/canonicalize.test.ts` while adding Skeleton and Kbd.

Relevant origin excerpts:

```tsx
// repos/ui/apps/v4/styles/base-nova/ui/skeleton.tsx
<div
  data-slot="skeleton"
  className={cn('animate-pulse rounded-md bg-muted', className)}
/>
```

```tsx
// repos/ui/apps/v4/styles/base-nova/ui/kbd.tsx
<kbd
  data-slot="kbd"
  className={cn(
    "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
    className,
  )}
/>
```

Local patterns to match:

- `src/registry/shadcn/separator/index.ts` for a shadcn wrapper with
  `className`, `cn`, `data-slot`, and `toView`.
- `src/registry/shadcn/button/examples.ts` for inline icon helpers and RTL
  local constants.
- `registry-src/shadcn/separator/item.json` for accepted deviations replacing
  origin language-selector dependencies with local example constants.

## Commands you will need

| Purpose              | Command                                                                                                                                                             | Expected on success     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Dossier check        | `test -f plans/artifacts/004-foundational-component-dossiers/skeleton/dossier.json && test -f plans/artifacts/004-foundational-component-dossiers/kbd/dossier.json` | exit 0                  |
| Source tests         | `bun run test -- src/registry/shadcn/skeleton/skeleton.test.ts src/registry/shadcn/kbd/kbd.test.ts`                                                                 | exit 0                  |
| Origin fixture smoke | `bun run test -- tests/parity/shadcn-origin-runner.test.ts`                                                                                                         | exit 0                  |
| Registry validation  | `bun run registry:check`                                                                                                                                            | exit 0                  |
| Registry build       | `bun run registry:build`                                                                                                                                            | exit 0                  |
| Parity discovery     | `bun run parity:check -- --grep shadcn/skeleton --dry-run && bun run parity:check -- --grep shadcn/kbd --dry-run`                                                   | each discovers one slot |
| Parity check         | `bun run parity:check -- --grep shadcn/skeleton && bun run parity:check -- --grep shadcn/kbd`                                                                       | both exit 0             |
| Full tests           | `bun run test`                                                                                                                                                      | exit 0                  |
| Typecheck            | `bun run typecheck`                                                                                                                                                 | exit 0                  |
| Lint/check           | `bun run check`                                                                                                                                                     | exit 0                  |
| Build                | `bun run build`                                                                                                                                                     | exit 0                  |

## Scope

**In scope**:

- `registry-src/shadcn/skeleton/item.json` (create)
- `registry-src/shadcn/kbd/item.json` (create)
- `src/registry/shadcn/skeleton/index.ts` (create)
- `src/registry/shadcn/skeleton/examples.ts` (create)
- `src/registry/shadcn/skeleton/skeleton.test.ts` (create)
- `src/registry/shadcn/kbd/index.ts` (create)
- `src/registry/shadcn/kbd/examples.ts` (create)
- `src/registry/shadcn/kbd/kbd.test.ts` (create)
- `tests/parity/fixtures/origin/shadcn/case-metadata.ts`
- `tests/parity/fixtures/origin/shadcn/cases.tsx`
- `tests/parity/fixtures/origin/shadcn/runner.ts`
- `tests/parity/fixtures/origin/shadcn/style.css`
- `tests/parity/fixtures/foldkit/shadcn/cases.ts`
- `tests/parity/fixtures/foldkit/shadcn/style.css`
- `tests/parity/canonicalize.test.ts`
- `tests/parity/slots.ts`
- `registry/index.json`
- `plans/README.md`

**Out of scope**:

- Do not implement installable `shadcn/card`, `shadcn/input-group`,
  `shadcn/button-group`, or `shadcn/tooltip`.
- Do not add tooltip behavior. Kbd tooltip examples may use fixture-local
  static wrappers only if needed for visual parity.
- Do not add React, React DOM, or origin repo imports to installable source.

## Git workflow

- Branch: `codex/010-shadcn-skeleton-kbd`
- Use conventional commits, for example:
  `feat: add shadcn skeleton and kbd registry items`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Add Skeleton source and tests

Create `src/registry/shadcn/skeleton/index.ts`.

Required shape:

- Define `SkeletonStyleOptions = S.Struct({ className: S.optional(S.String) })`.
- Export `baseClassName = 'animate-pulse rounded-md bg-muted'`.
- Export `skeletonClassName(options)` using `cn`.
- Export `view<Message>(config)` with `toView({ skeleton: [...] })`.
- Always include `data-slot="skeleton"` and the merged class.

Create `src/registry/shadcn/skeleton/skeleton.test.ts` covering class helper
output, `className` merging, and `data-slot`.

**Verify**: `bun run test -- src/registry/shadcn/skeleton/skeleton.test.ts` ->
exits 0.

### Step 2: Add Kbd source and tests

Create `src/registry/shadcn/kbd/index.ts`.

Required shape:

- Define `KbdStyleOptions` and `KbdGroupStyleOptions` with Effect Schema.
- Export exact `kbdBaseClassName` and `kbdGroupBaseClassName` strings from the
  origin source.
- Export `view<Message>(config)` for `Kbd`, rendering through `toView` with
  `kbd` attributes and `data-slot="kbd"`.
- Export `groupView<Message>(config)` for `KbdGroup`, rendering through
  `toView` with `group` attributes and `data-slot="kbd-group"`.
- Use `<kbd>` for both default examples, matching the origin source even though
  the second function's props type says `div`.

Create `src/registry/shadcn/kbd/kbd.test.ts` covering both helpers.

**Verify**: `bun run test -- src/registry/shadcn/kbd/kbd.test.ts` -> exits 0.

### Step 3: Add examples with local substitutions

Create both `examples.ts` files.

Skeleton:

- Replicate all seven origin examples.
- For `skeleton-card`, use a file-local card shell with the exact base-nova
  Card classes needed for parity; do not import or implement `shadcn/card`.
- For RTL, use local Arabic constants rather than the origin language selector.

Kbd:

- Replicate all six origin examples.
- Use the already-implemented local Button for `kbd-button` where possible.
- For `kbd-input-group` and `kbd-tooltip`, use fixture-local static wrappers
  that reproduce the origin DOM/classes required for the example snapshot.
  Record this as an accepted deviation in `registry-src/shadcn/kbd/item.json`.
- Use inline SVG helpers for lucide icons.

**Verify**: `bun run typecheck` -> exits 0.

### Step 4: Extend shadcn parity fixtures

Update the shared shadcn origin and Foldkit fixture lists for all Skeleton and
Kbd cases.

Origin runner aliases must include:

- `@/styles/base-nova/ui/skeleton`
- `@/styles/base-nova/ui-rtl/skeleton`
- `@/styles/base-nova/ui/kbd`
- `@/styles/base-nova/ui-rtl/kbd`
- any origin-only sibling component paths used by the selected examples, such
  as Card, Input Group, Button Group, Tooltip, and Button
- Add Skeleton and Kbd `@source` entries to
  `tests/parity/fixtures/origin/shadcn/style.css` and
  `tests/parity/fixtures/foldkit/shadcn/style.css` so Tailwind includes both
  origin and Foldkit class tokens in fixture bundles. Keep the existing Button,
  Badge, and Separator source entries intact.

Foldkit fixture cases must map every new case id to the corresponding local
example export and return the correct `sourcePath`.

Add two parity slots:

- `shadcn/skeleton`
- `shadcn/kbd`

Use the standard shadcn comparison list: class tokens, attributes, DOM
structure, computed style, colors, dimensions, and bounding box.
Update `tests/parity/canonicalize.test.ts` so the ready-slot expectation
includes `shadcn/skeleton` and `shadcn/kbd` in the actual exported order.

**Verify**: `bun run parity:check -- --grep shadcn/skeleton --dry-run` and
`bun run parity:check -- --grep shadcn/kbd --dry-run` -> each discovers exactly
one slot.

### Step 5: Add manifests and build the registry

Create both manifests.

Skeleton manifest:

- depends on `utils/cn`
- records `shadcn/card` as a fixture-local/deferred example dependency, not a
  runtime dependency
- consumed tokens include `--muted`

Kbd manifest:

- depends on `utils/cn`
- may depend on `shadcn/button` only for examples, not for the core Kbd helper
- records unavailable sibling example dependencies as accepted deviations
- consumed tokens include `--muted`, `--muted-foreground`, and `--background`

Run `bun run registry:build` after both manifests are in place.

**Verify**: `bun run registry:check` and `bun run registry:build` -> both exit 0.

## Test plan

- Unit tests for Skeleton and Kbd class helpers and render attributes.
- Parity cases for every origin Skeleton and Kbd example.
- Full gates:
  `bun run parity:check -- --grep shadcn/skeleton`,
  `bun run parity:check -- --grep shadcn/kbd`, `bun run test`,
  `bun run typecheck`, `bun run check`, and `bun run build`.

## Done criteria

- [ ] `shadcn/skeleton` and `shadcn/kbd` manifests validate.
- [ ] Both installable source folders exist with Schema-backed style options.
- [ ] All origin examples are represented by Foldkit examples or explicit
      accepted local fixture substitutions.
- [ ] Both parity slots pass.
- [ ] Full registry, test, typecheck, check, and build gates pass.
- [ ] `plans/README.md` row 010 is updated to DONE.

## STOP conditions

Stop and report back if:

- Origin examples require interactive Tooltip/Input Group behavior for parity
  rather than static fixture-local wrappers.
- Adding origin aliases requires changing installable runtime dependencies.
- Any example cannot be represented without touching out-of-scope registry
  components.

## Maintenance notes

When Card, Input Group, Button Group, and Tooltip are implemented, revisit the
accepted deviations in these manifests and examples. This plan should leave a
clear paper trail distinguishing core component dependencies from temporary
example-only substitutions.
