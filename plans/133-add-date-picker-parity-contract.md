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

The local Date Picker examples and native Foldkit implementation exist, but
the pinned origin demo requires `date-fns`, `lucide-react`, and the origin
Calendar module in addition to the already-shimmed Popover. The parity runner
does not currently provide those aliases, so a ready slot would be
unverifiable. Keep the exception until a bounded origin adapter is added and
 the open, navigation, selection, dismissal, and mobile containment recipes
 can be captured against both implementations.
