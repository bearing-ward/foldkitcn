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

The aggregate runner now exposes direct origin/local cases for PopoverBasic,
TooltipDemo, SelectDemo, DialogDemo, and SliderDemo. All five capture without
fixture-root failures. Their initial reports currently contain hard parity
differences (8–10 findings each), which are the next calibration/fix backlog;
the reports are intentionally not accepted as green evidence yet.

The remaining work is to add executable interaction recipes for these cases,
calibrate stable geometry/style/ARIA comparisons against origin, and add the
Date Picker/Data Table cases after Plans 132 and 133 supply their fixture
contracts.
