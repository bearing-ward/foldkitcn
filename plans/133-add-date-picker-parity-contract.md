# Plan 133: Add the Date Picker parity contract

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: Plan 128
- **State**: DONE, 2026-07-10

## Goal

Add pinned docs-origin fixture evidence and a ready parity slot for
`shadcn/date-picker`, covering anchored opening, date navigation and selection,
keyboard dismissal, collision behavior, and 390px containment. Remove its Plan
128 exception only when the fixture and workbench case pass.

## Result

The local Date Picker examples and native Foldkit implementation exist. The
parity workspace now installs the origin app's `date-fns` and
`react-day-picker` development dependencies, resolves the pinned Base Nova
Calendar and Popover sources, and captures the origin `date-picker-demo` with
neutral fixture data. A dedicated runtime-backed Foldkit fixture mounts the
Date Picker Submodel and completes open/Escape playback on both sides. The
local trigger now matches origin's intrinsic icon-and-label structure, and the
workbench passes with the ready slot registered. The public exception is
removed.
