# Plan 135: Resolve public mobile overflow

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: Plan 128
- **State**: TODO

## Goal

Burn down the 33 shadcn routes with measured 390px horizontal overflow in the
Plan 128 matrix. Work in component-owner batches, preserve origin behavior,
and remove each route's exception only after its actual docs-host browser case
passes. Do not replace the strict contract with clipping at the page root.
