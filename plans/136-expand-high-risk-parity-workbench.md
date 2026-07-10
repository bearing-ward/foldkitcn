# Plan 136: Expand the high-risk parity workbench

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: Plans 128, 132, 133
- **State**: IN PROGRESS, 2026-07-09

## Goal

Add executable origin/local workbench cases for Popover, Tooltip, Dropdown Menu
with submenu, Select or Combobox, Dialog, Date Picker, Data Table, Slider, and
Sonner. Extend the neutral fixture model beyond its current Tabs-specific shape,
promote stable geometry/style/ARIA comparisons to hard results, and keep only
truly nondeterministic screenshots advisory.

## Completed slice

The aggregate fixture now has executable workbench entries for Bubble tooltip,
Bubble popover, Dropdown Menu submenu, Command dialog, Sonner, and native
Select. Hard comparisons cover DOM, attributes, roles, ARIA state, accessible
names, computed styles, dimensions, geometry, and interaction state; screenshots
remain advisory. All six cases resolve in dry-run, and Dropdown Menu submenu
has completed a real origin/local capture.

## Remaining

The dedicated fixture entrypoints for Popover, Tooltip, Select, Dialog, and
Slider are not part of the aggregate runner. They need a harness seam that can
select those fixture modules without importing browser-only Foldkit modules in
the CLI process. Do not substitute aggregate proxies for those component-owned
cases.
