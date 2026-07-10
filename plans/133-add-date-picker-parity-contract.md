# Plan 133: Add the Date Picker parity contract

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: Plan 128
- **State**: IN PROGRESS

## Goal

Add pinned docs-origin fixture evidence and a ready parity slot for
`shadcn/date-picker`, covering anchored opening, date navigation and selection,
keyboard dismissal, collision behavior, and 390px containment. Remove its Plan
128 exception only when the fixture and workbench case pass.

## Current blocker (2026-07-10)

The local Date Picker examples and native Foldkit implementation exist. The
parity workspace now installs the origin app's `date-fns` and
`react-day-picker` development dependencies, resolves the pinned Base Nova
Calendar and Popover sources, and captures the origin `date-picker-demo` with
neutral fixture data prepared. The local aggregate fixture cannot render this
case: Date Picker is a Foldkit Submodel and the static `htmlToElement` harness
has no active runtime frame, producing `getCurrentFrame called without an
active runtime frame`. The next slice is a dedicated runtime-backed Foldkit
fixture entrypoint; only then should the ready slot and open/select/Escape
workbench recipe be registered.
