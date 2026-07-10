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

PopoverBasic now has an executable open/Escape recipe, and the comparator honors
case policies while using client geometry for narrowed roots. Select, Tooltip,
Dropdown Menu, and Sonner have calibrated capture roots; Dialog and Slider keep
geometry advisory because their origin browser shims are synthetic controls.

The interaction recipes for Tooltip, Select, Dialog, and Slider are now
declared and resolve in dry-run. Remaining work is to replace the Dialog and
Slider synthetic shims with faithful origin surfaces, and add the Date
Picker/Data Table cases after Plans 132 and 133 supply their fixture
contracts.

The pinned Base Nova Dialog source now resolves through the existing Base UI
aliases, and origin capture uses the repository's pinned `lucide-react`
dependency instead of the incomplete virtual icon shim. Initial Dialog capture
is faithful. The interaction run now reaches both real implementations; its
remaining failure is local harness state reuse, which leaves the Foldkit dialog
open before the recipe's click step and lets the overlay intercept that click.
