# Plan 132: Add the Data Table parity contract

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: Plan 128
- **State**: IN PROGRESS

## Goal

Add pinned docs-origin fixture evidence and a ready parity slot for
`shadcn/data-table`, covering sort, filter, pagination, selection, empty state,
and constrained desktop/mobile layout. Remove its Plan 128 exception only when
the fixture and workbench case pass.

## Current blocker (2026-07-10)

The pinned TanStack demo now captures directly with the origin app's Base UI,
Lucide, Checkbox, Input, Table, and TanStack dependencies. A runtime-backed
Foldkit fixture drives native Data Table state, and sort plus row-selection
playback completes on both sides. The remaining red evidence is row density:
the five-row origin table is 244.5px tall and Foldkit is 264.5px, a consistent
4px difference per row. Resolve that component-level density mismatch before
registering the ready slot and removing the Plan 128 exception.
