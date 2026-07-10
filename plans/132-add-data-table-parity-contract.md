# Plan 132: Add the Data Table parity contract

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: Plan 128
- **State**: DONE, 2026-07-10

## Goal

Add pinned docs-origin fixture evidence and a ready parity slot for
`shadcn/data-table`, covering sort, filter, pagination, selection, empty state,
and constrained desktop/mobile layout. Remove its Plan 128 exception only when
the fixture and workbench case pass.

## Result

The pinned TanStack demo now captures directly with the origin app's Base UI,
Lucide, Checkbox, Input, Table, and TanStack dependencies. A runtime-backed
Foldkit fixture drives native Data Table state, and sort plus row-selection
playback completes on both sides. The remaining red evidence is row density:
the five-row origin table and Foldkit table now share the same density after
aligning the row action with origin's icon-only control. Sort and row-selection
playback pass without hard differences, the ready slot is registered, and the
Plan 128 exception is removed.
