# shadcn Button Example Inventory

Source glob: `repos/ui/apps/v4/examples/base/button*.tsx`

## Port Now

- `button-default.tsx` -> `ButtonDefault`
- `button-demo.tsx` -> `ButtonDemo`
- `button-outline.tsx` -> `ButtonOutline`
- `button-secondary.tsx` -> `ButtonSecondary`
- `button-ghost.tsx` -> `ButtonGhost`
- `button-destructive.tsx` -> `ButtonDestructive`
- `button-link.tsx` -> `ButtonLink`
- `button-icon.tsx` -> `ButtonIcon`
- `button-with-icon.tsx` -> `ButtonWithIcon`
- `button-size.tsx` -> `ButtonSize`
- `button-rounded.tsx` -> `ButtonRounded`
- `button-render.tsx` -> `ButtonRender`
- `button-rtl.tsx` -> `ButtonRtl`

## Port With Example Local Helper

- `button-spinner.tsx` -> `ButtonSpinner`; uses a local, example-only
  `spinner` helper with `data-slot="spinner"`, `role="status"`,
  `aria-label="Loading"`, `size-4 animate-spin`, and the origin
  `data-icon` placement attributes.

## Defer To Button Group

- `button-group-demo.tsx`
- `button-group-dropdown.tsx`
- `button-group-input.tsx`
- `button-group-input-group.tsx`
- `button-group-nested.tsx`
- `button-group-orientation.tsx`
- `button-group-popover.tsx`
- `button-group-rtl.tsx`
- `button-group-select.tsx`
- `button-group-separator.tsx`
- `button-group-size.tsx`
- `button-group-split.tsx`

Follow-up: these examples belong to a dependency-complete `button-group` batch.
They are not installable registry items in plan 002.

## Not Applicable

- `repos/ui/packages/tests/src/tests/add.test.ts`; shadcn CLI installation
  coverage is replaced by this registry workflow.
- `repos/ui/packages/tests/src/tests/view.test.ts`; shadcn CLI registry view
  coverage is evidence only for this batch.
