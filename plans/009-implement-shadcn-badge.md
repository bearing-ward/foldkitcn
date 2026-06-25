# Plan 009: Implement shadcn Badge wrapper and examples

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 7e045720..HEAD -- plans/artifacts/004-foundational-component-dossiers/badge registry-src/shadcn/badge src/registry/shadcn/badge tests/parity/fixtures/origin/shadcn tests/parity/fixtures/foldkit/shadcn tests/parity/slots.ts registry/index.json plans/README.md`
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
- **Planned at**: commit `7e045720`, 2026-06-25

## Why this matters

Badge is the smallest shadcn-only styled primitive still missing from the
registry. It proves the registry can replace origin CVA usage with Effect
Schema literals and pure class maps without adding `class-variance-authority`
to installable source. It also exercises shadcn origin fixture aliasing for
`@base-ui/react/use-render` and `@base-ui/react/merge-props`, because the
origin Badge uses Base UI render utilities even though the Foldkit port should
stay a simple native render helper.

## Current state

- `plans/artifacts/004-foundational-component-dossiers/badge/dossier.json`
  pins shadcn Badge to `95471a0fb95b2b205e1850841e05d93f3fcae659`.
- The origin source is `repos/ui/apps/v4/styles/base-nova/ui/badge.tsx`.
- The origin demos to replicate are:
  `badge-colors.tsx`, `badge-demo.tsx`, `badge-icon.tsx`, `badge-link.tsx`,
  `badge-rtl.tsx`, `badge-spinner.tsx`, and `badge-variants.tsx`.
- The dossier records dependency hints for `utils/cn` and `shadcn/spinner`.
  The Badge implementation itself must depend only on `utils/cn`; the spinner
  demo should use an example-local inline SVG helper like the existing shadcn
  Button examples do.

Relevant origin excerpt:

```tsx
// repos/ui/apps/v4/styles/base-nova/ui/badge.tsx
const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: '...',
        secondary: '...',
        destructive: '...',
        outline: '...',
        ghost: '...',
        link: '...',
      },
    },
  },
)
```

Relevant local patterns:

- `src/registry/shadcn/button/index.ts` shows the required class-map pattern:
  Schema literals, `baseClassName`, `variantClassNames`, and a pure
  `buttonVariants` helper.
- `src/registry/shadcn/button/examples.ts` shows how to replace origin icon
  dependencies with local inline SVG helpers.
- `registry-src/shadcn/button/item.json` shows dependency classification:
  `utils/cn` is `registry-local`, `class-variance-authority` is
  `reject-or-defer`, and icon packages are `dev-or-fixture-only`.
- `tests/parity/fixtures/origin/shadcn/runner.ts` already aliases Button,
  Separator, Spinner, `@/lib/utils`, and the language selector for origin
  fixture capture.

## Commands you will need

| Purpose              | Command                                                                          | Expected on success                                   |
| -------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Dossier check        | `test -f plans/artifacts/004-foundational-component-dossiers/badge/dossier.json` | exit 0                                                |
| Source test          | `bun run test -- src/registry/shadcn/badge/badge.test.ts`                        | exit 0                                                |
| Origin fixture smoke | `bun run test -- tests/parity/shadcn-origin-runner.test.ts`                      | exit 0                                                |
| Registry validation  | `bun run registry:check`                                                         | exit 0; all source manifests validate                 |
| Registry build       | `bun run registry:build`                                                         | exit 0; `registry/index.json` includes `shadcn/badge` |
| Parity discovery     | `bun run parity:check -- --grep shadcn/badge --dry-run`                          | exit 0; discovers exactly the Badge slot              |
| Parity check         | `bun run parity:check -- --grep shadcn/badge`                                    | exit 0; Badge examples compare equal                  |
| Full tests           | `bun run test`                                                                   | exit 0                                                |
| Typecheck            | `bun run typecheck`                                                              | exit 0                                                |
| Lint/check           | `bun run check`                                                                  | exit 0                                                |
| Build                | `bun run build`                                                                  | exit 0                                                |

## Scope

**In scope**:

- `registry-src/shadcn/badge/item.json` (create)
- `src/registry/shadcn/badge/index.ts` (create)
- `src/registry/shadcn/badge/examples.ts` (create)
- `src/registry/shadcn/badge/badge.test.ts` (create)
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

- Do not implement `shadcn/spinner` as an installable registry item.
- Do not add `class-variance-authority` to runtime source.
- Do not import from `repos/ui` or `repos/base-ui` in installable source.
- Do not widen this plan to Alert, Kbd, Skeleton, or Card.

## Git workflow

- Branch: `codex/009-shadcn-badge`
- Use conventional commits, for example: `feat: add shadcn badge registry item`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Add the Foldkit-native Badge helper

Create `src/registry/shadcn/badge/index.ts`.

Required shape:

- Use `Schema as S` from Effect.
- Define `BadgeVariant` as Schema literals for `default`, `secondary`,
  `destructive`, `outline`, `ghost`, and `link`.
- Define `BadgeStyleOptions = S.Struct({ variant: S.optional(BadgeVariant), className: S.optional(S.String) })`.
- Export `badgeVariantValues`, `baseClassName`, `variantClassNames`, and
  `badgeVariants(options)`.
- Export `view<Message>(config)` as a render helper, not a Submodel. It should
  bind `const h = html<Message>()` inside the function and call `toView` with
  `badge` attributes.
- Default tag examples should render `<span>`, but composition must be through
  `toView`, not React `render` or public `asChild`.
- Include `h.DataAttribute('slot', 'badge')` and `h.Class(cn(...))`.

**Verify**: `bun run typecheck` -> exits 0, or only fails on later files that
are not created yet in this plan.

### Step 2: Add Badge examples

Create `src/registry/shadcn/badge/examples.ts` with Foldkit versions of all
seven origin examples. Use `src/registry/shadcn/button/examples.ts` as the
structural pattern for inline SVG helpers and RTL constants.

Required example exports:

- `BadgeColors`
- `BadgeDemo`
- `BadgeIcon`
- `BadgeLink`
- `BadgeRtl`
- `BadgeSpinner`
- `BadgeVariants`

For `BadgeSpinner`, use an example-local inline SVG spinner with
`data-slot="spinner"`, `role="status"`, `aria-label="Loading"`, and
`data-icon` placement. This mirrors the existing Button example strategy and
does not create a `shadcn/spinner` runtime dependency.

**Verify**: `bun run typecheck` -> exits 0.

### Step 3: Add focused source tests

Create `src/registry/shadcn/badge/badge.test.ts`.

Cover:

- `badgeVariants()` returns the base class and default variant class.
- Each variant value maps to the exact origin class string.
- `className` is merged with `cn`.
- `view` emits `data-slot="badge"` and the expected class attribute.
- `toView` can render an anchor for link-style examples without an `asChild`
  option.

**Verify**: `bun run test -- src/registry/shadcn/badge/badge.test.ts` -> exits 0.

### Step 4: Add origin and Foldkit parity cases

Update shadcn parity fixture metadata and case maps.

Origin side:

- Add all Badge cases to
  `tests/parity/fixtures/origin/shadcn/case-metadata.ts`.
- Import the seven origin examples in
  `tests/parity/fixtures/origin/shadcn/cases.tsx`.
- Add aliases in `tests/parity/fixtures/origin/shadcn/runner.ts` for
  `@/styles/base-nova/ui/badge`, `@/styles/base-nova/ui-rtl/badge`,
  `@base-ui/react/merge-props`, and `@base-ui/react/use-render` if the origin
  bundle needs them.

Foldkit side:

- Import the seven local examples in
  `tests/parity/fixtures/foldkit/shadcn/cases.ts`.
- Update its `foldkitSourcePath` helper so Badge cases point to
  `src/registry/shadcn/badge/examples.ts`.
- Add Badge `@source` entries to
  `tests/parity/fixtures/origin/shadcn/style.css` and
  `tests/parity/fixtures/foldkit/shadcn/style.css` so Tailwind includes the
  origin Badge classes and local Foldkit Badge/example classes in the fixture
  bundles. Keep the existing Button and Separator entries intact.
- Add a `shadcn/badge` slot in `tests/parity/slots.ts` using the same shadcn
  entrypoints and comparison list as `shadcn/button`.
- Update `tests/parity/canonicalize.test.ts` so the ready-slot discovery
  expectation includes `shadcn/badge` in the actual exported order.

**Verify**: `bun run parity:check -- --grep shadcn/badge --dry-run` ->
discovers exactly one `shadcn/badge` slot and all Badge cases.

### Step 5: Add the registry manifest

Create `registry-src/shadcn/badge/item.json`.

Manifest requirements:

- `id`: `shadcn/badge`
- `namespace`: `shadcn`
- `kind`: `component`
- `installableSourcePaths`: `src/registry/shadcn/badge/index.ts` and
  `src/registry/shadcn/badge/examples.ts`
- `consumedThemeTokens`: include `--primary`, `--primary-foreground`,
  `--secondary`, `--secondary-foreground`, `--destructive`, `--foreground`,
  `--muted`, `--ring`, and `--border`
- provenance should use the pinned shadcn ref and source/docs/example paths
  from the dossier
- dependencies should classify `utils/cn` as `registry-local`, `foldkit`,
  `effect`, `clsx`, and `tailwind-merge` as `allowed-runtime`,
  `class-variance-authority` as `reject-or-defer`, and icon/spinner/language
  selector imports as fixture-only or accepted local deviations
- lifecycle should be `implemented`, `accepted`, `current`, `installable`
  only after parity passes

Run `bun run registry:build` after adding the manifest so `registry/index.json`
is regenerated.

**Verify**: `bun run registry:check` and `bun run registry:build` -> both exit 0.

## Test plan

- New unit tests in `src/registry/shadcn/badge/badge.test.ts`.
- New shadcn parity cases for every origin Badge example.
- Full gate after implementation:
  `bun run parity:check -- --grep shadcn/badge`, `bun run test`,
  `bun run typecheck`, `bun run check`, and `bun run build`.

## Done criteria

- [ ] `registry-src/shadcn/badge/item.json` exists and validates.
- [ ] `src/registry/shadcn/badge/index.ts` exports Schema-derived variant
      types and pure class helpers.
- [ ] All seven origin Badge examples have Foldkit examples and parity cases.
- [ ] `bun run parity:check -- --grep shadcn/badge` exits 0.
- [ ] `bun run registry:check`, `bun run registry:build`, `bun run test`,
      `bun run typecheck`, `bun run check`, and `bun run build` exit 0.
- [ ] `plans/README.md` row 009 is updated to DONE.

## STOP conditions

Stop and report back if:

- The Badge dossier no longer points at the source paths listed above.
- The origin fixture cannot bundle Badge without adding React-only packages to
  installable source.
- Badge examples require an installable `shadcn/spinner` component rather than
  an example-local helper.
- Parity differences require accepting a visual or DOM deviation not described
  in this plan.

## Maintenance notes

When `shadcn/spinner` becomes an installable registry item, revisit
`BadgeSpinner` and decide whether the example-local spinner should be replaced
with the registry item. Reviewers should scrutinize exact class strings and
variant names because Badge is the precedent for replacing CVA in later shadcn
components.
