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

The local Foldkit implementation is already available in
`src/registry/shadcn/data-table/examples.ts`, but the pinned origin demo is
not currently importable by the parity runner. The origin fixture imports
`@tanstack/react-table`, `lucide-react`, and the Base Nova Checkbox, Dropdown
Menu, Input, and Table modules. The runner has no TanStack Table or lucide
shim, and those Base Nova module aliases are not registered in
`tests/parity/fixtures/origin/shadcn/runner.ts`. Adding a ready slot now would
make the contract claim evidence that cannot be captured.

The next safe slice is to add a bounded origin adapter (or a deliberately
documented fixture-only reduction) for the static Data Table demo, then wire
the sort/filter/pagination/selection interaction recipes before promoting the
slot. Until that adapter exists, this plan remains IN PROGRESS and the Plan
128 exception stays in place.
