# Remaining Component Queue

Generated on 2026-06-24 at commit `e13dfbb7` from the pinned local Base UI and
shadcn repositories.

## Definition of Remaining

This queue means: origin component docs/items that are present in the pinned
local origin repos, but are not already represented by either:

- a checked-in registry source item under `registry-src/`, or
- an existing dossier under
  `plans/artifacts/004-foundational-component-dossiers/`.

Current implemented registry items excluded from this queue:

- `base-ui/button`
- `shadcn/button`
- `utils/cn`
- `local/example-preview`

Current foundational dossiers excluded from this queue include the already
queued Button-adjacent and first-wave rows such as `accordion`,
`alert-dialog`, `avatar`, `checkbox`, `collapsible`, `context-menu`, `dialog`,
`dropdown-menu`, `input`, `popover`, `progress`, `radio-group`,
`scroll-area`, `select`, `separator`, `slider`, `switch`, `tabs`, `textarea`,
`toggle`, `toggle-group`, and `tooltip`.

Inventory totals:

- Remaining Base UI items: 16
- Remaining shadcn items: 32
- Remaining origin items total: 48
- Queue rows below: 41, because some rows intentionally pair a Base UI
  primitive with its shadcn wrapper or mapped shadcn analogue.

## Best Next Parallel Rows

These are the lowest-friction rows to pass to `add-registry-component` next.
Keep the high bar: one row per worker, and no more than two origin URLs in one
row.

| Batch | Items | URLs |
| ----- | ----- | ---- |
| A | `base-ui/meter` | `https://base-ui.com/react/components/meter` |
| B | `base-ui/fieldset` | `https://base-ui.com/react/components/fieldset` |
| C | `base-ui/number-field` | `https://base-ui.com/react/components/number-field` |
| D | `shadcn/native-select` | `https://ui.shadcn.com/docs/components/native-select` |
| E | `shadcn/alert` | `https://ui.shadcn.com/docs/components/alert` |
| F | `base-ui/field`, `shadcn/field` | `https://base-ui.com/react/components/field`, `https://ui.shadcn.com/docs/components/field` |

## Full Queue

Rows marked `ready` resolve through the current origin resolver. Rows marked
`hold` are still real remaining components, but need either a local foundation
or a resolver extension before they should be passed directly to
`add-registry-component`.

| # | Status | Items | URLs to pass to `add-registry-component` | Notes |
| --- | --- | --- | --- | --- |
| 1 | ready | `base-ui/field`, `shadcn/field` | `https://base-ui.com/react/components/field`, `https://ui.shadcn.com/docs/components/field` | Form-field foundation; shadcn field also composes several already dossiered form controls. |
| 2 | ready | `shadcn/label` | `https://ui.shadcn.com/docs/components/label` | Small shadcn-only form helper; useful before card, field, and form examples. |
| 3 | ready | `base-ui/fieldset` | `https://base-ui.com/react/components/fieldset` | Small Base UI form grouping primitive. |
| 4 | ready | `base-ui/form` | `https://base-ui.com/react/components/form` | Base UI form primitive; should stay Effect/Foldkit-native and avoid browser-form side effects in view code. |
| 5 | ready | `base-ui/checkbox-group` | `https://base-ui.com/react/components/checkbox-group` | Complements the existing checkbox dossier; likely shares grouped field semantics. |
| 6 | ready | `base-ui/radio` | `https://base-ui.com/react/components/radio` | Complements the existing radio-group dossier; keep as a top-up primitive. |
| 7 | ready | `base-ui/meter` | `https://base-ui.com/react/components/meter` | Isolated value/ARIA primitive; good parallel starter. |
| 8 | ready | `base-ui/number-field` | `https://base-ui.com/react/components/number-field` | Independent form control with increment/decrement and value canonicalization concerns. |
| 9 | ready | `base-ui/otp-field`, `shadcn/input-otp` | `https://base-ui.com/react/components/otp-field`, `https://ui.shadcn.com/docs/components/input-otp` | Name-mapped pair; shadcn origin uses `input-otp`, Base UI origin uses `otp-field`. |
| 10 | ready | `base-ui/toolbar` | `https://base-ui.com/react/components/toolbar` | Base-only primitive; likely interacts with toggle/toggle-group later. |
| 11 | ready | `base-ui/preview-card`, `shadcn/hover-card` | `https://base-ui.com/react/components/preview-card`, `https://ui.shadcn.com/docs/components/hover-card` | Name-mapped pair; shadcn hover-card depends on Base UI preview-card behavior. |
| 12 | ready | `base-ui/menubar`, `shadcn/menubar` | `https://base-ui.com/react/components/menubar`, `https://ui.shadcn.com/docs/components/menubar` | shadcn menubar also references the already dossiered `base-ui/menu`. |
| 13 | ready | `base-ui/navigation-menu`, `shadcn/navigation-menu` | `https://base-ui.com/react/components/navigation-menu`, `https://ui.shadcn.com/docs/components/navigation-menu` | Large navigation primitive; do after menu/floating decisions if possible. |
| 14 | ready | `base-ui/combobox`, `shadcn/combobox` | `https://base-ui.com/react/components/combobox`, `https://ui.shadcn.com/docs/components/combobox` | Large collection/input primitive; depends on field/item decisions for shadcn examples. |
| 15 | ready | `base-ui/autocomplete` | `https://base-ui.com/react/components/autocomplete` | Base-only collection/input primitive; likely shares combobox internals. |
| 16 | ready | `base-ui/drawer`, `shadcn/drawer` | `https://base-ui.com/react/components/drawer`, `https://ui.shadcn.com/docs/components/drawer` | Name pair, but shadcn drawer has non-Base UI origin dependencies; verify before assuming composition. |
| 17 | ready | `shadcn/sheet` | `https://ui.shadcn.com/docs/components/sheet` | Depends on the already dossiered dialog primitive. |
| 18 | ready | `shadcn/direction` | `https://ui.shadcn.com/docs/components/direction` | Needs a local direction-provider decision; origin runtime hint is Base UI React direction-provider. |
| 19 | ready | `shadcn/native-select` | `https://ui.shadcn.com/docs/components/native-select` | Small shadcn-only native select wrapper; good parallel starter. |
| 20 | ready | `shadcn/alert` | `https://ui.shadcn.com/docs/components/alert` | Small shadcn-only visual component; depends on local button examples and local icons. |
| 21 | ready | `shadcn/card` | `https://ui.shadcn.com/docs/components/card` | Composition primitive; depends on badge, button, input, label, and toggle-group examples. |
| 22 | ready | `shadcn/breadcrumb` | `https://ui.shadcn.com/docs/components/breadcrumb` | Depends on the already dossiered dropdown-menu plus button. |
| 23 | ready | `shadcn/button-group` | `https://ui.shadcn.com/docs/components/button-group` | Broad composition item; wait until input-group, field, select, tooltip, and dropdown-menu are in good shape. |
| 24 | ready | `shadcn/calendar` | `https://ui.shadcn.com/docs/components/calendar` | Requires date/calendar foundation decisions and replacement for React DayPicker. |
| 25 | ready | `shadcn/carousel` | `https://ui.shadcn.com/docs/components/carousel` | Requires native carousel foundation or a deliberate dependency decision for Embla parity. |
| 26 | ready | `shadcn/command` | `https://ui.shadcn.com/docs/components/command` | Requires replacing `cmdk` with a local Foldkit command/list primitive. |
| 27 | ready | `shadcn/empty` | `https://ui.shadcn.com/docs/components/empty` | Composition item over avatar, button, input-group, kbd, and icons. |
| 28 | ready | `shadcn/input-group` | `https://ui.shadcn.com/docs/components/input-group` | High-value form composition; many examples and dependency hints. |
| 29 | ready | `shadcn/item` | `https://ui.shadcn.com/docs/components/item` | Composition primitive for lists/menus; depends on avatar, button, dropdown-menu, and separator. |
| 30 | ready | `shadcn/pagination` | `https://ui.shadcn.com/docs/components/pagination` | Composition over button, field, and select. |
| 31 | ready | `shadcn/resizable` | `https://ui.shadcn.com/docs/components/resizable` | Requires local resize-panel behavior or a deliberate dependency replacement for `react-resizable-panels`. |
| 32 | ready | `shadcn/sidebar` | `https://ui.shadcn.com/docs/components/sidebar` | Large block-like component; run only after sheet, direction, dropdown-menu, tooltip, skeleton, and avatar are accepted. |
| 33 | ready | `shadcn/sonner` | `https://ui.shadcn.com/docs/components/sonner` | Toast alternative; requires a local notification/toast decision before installable source. |
| 34 | ready | `shadcn/spinner` | `https://ui.shadcn.com/docs/components/spinner` | Small visual utility, but examples compose badge/button/empty/input-group/item. |
| 35 | ready | `shadcn/table` | `https://ui.shadcn.com/docs/components/table` | Static table wrapper plus examples using dropdown-menu and buttons. |
| 36 | ready | `base-ui/toast` | `https://base-ui.com/react/components/toast` | Base UI toast primitive; pair with shadcn toast only after docs-only shadcn handling exists. |
| 37 | hold | `shadcn/data-table` | `https://ui.shadcn.com/docs/components/data-table` | Docs/examples exist, but no `styles/base-nova/ui/data-table.tsx`; resolver must support composition/docs-only rows. |
| 38 | hold | `shadcn/date-picker` | `https://ui.shadcn.com/docs/components/date-picker` | Docs/examples exist, but no `styles/base-nova/ui/date-picker.tsx`; depends on calendar, popover, input, and date behavior. |
| 39 | hold | `shadcn/toast` | `https://ui.shadcn.com/docs/components/toast` | Docs/examples exist, but no `styles/base-nova/ui/toast.tsx`; coordinate with `base-ui/toast` and `shadcn/sonner`. |
| 40 | hold | `shadcn/typography` | `https://ui.shadcn.com/docs/components/typography` | Docs/examples exist, but no `styles/base-nova/ui/typography.tsx`; treat as docs/examples or style primitives. |
| 41 | hold | `shadcn/chart` | `https://ui.shadcn.com/docs/components/chart` | ADR 0001 gates charts on an explicit native chart foundation before chart items become installable. |

## Read-Only Derivation Commands

Use these commands to refresh the inventory without mutating the working tree:

```bash
find 'repos/base-ui/docs/src/app/(docs)/react/components' -mindepth 1 -maxdepth 1 -type d -print | sed "s#repos/base-ui/docs/src/app/(docs)/react/components/##" | sort
find repos/ui/apps/v4/content/docs/components/base -maxdepth 1 -type f -name '*.mdx' -print | sed 's#repos/ui/apps/v4/content/docs/components/base/##; s#.mdx$##' | sort
find repos/ui/apps/v4/styles/base-nova/ui -maxdepth 1 -type f -name '*.tsx' -print | sed 's#repos/ui/apps/v4/styles/base-nova/ui/##; s#.tsx$##' | sort
find registry-src -mindepth 2 -maxdepth 3 -name item.json | sort
find plans/artifacts/004-foundational-component-dossiers -maxdepth 2 -name dossier.json | sort
```

Use this command to smoke-test whether a row is directly accepted by the
current origin resolver:

```bash
bun run origin:resolve -- https://ui.shadcn.com/docs/components/native-select
```
