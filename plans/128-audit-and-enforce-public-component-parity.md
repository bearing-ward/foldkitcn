# Plan 128: Audit and enforce public component parity contracts

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: Plans 126 and 131
- **State**: IN PROGRESS, 2026-07-09

## Completed slice

The public surface is now generated from checked-in docs artifacts and enforced
as 100 route contracts plus 442 example contracts. Every row declares an origin
evidence mode, one profile, desktop and 390px viewports, required interaction
recipes, live-renderer state, parity-slot state, and any time-bounded exception.

Pages CI runs both artifact freshness validation and the profile-driven browser
matrix. The browser matrix exercises every public route in its actual docs host
at 1280px and 390px, rejects missing live cards, and rejects unowned overflow.

This slice does not yet satisfy the original plan's evidence-capture or
executable-recipe requirements. Plan 128 remains in progress until the
high-risk workbench and origin/local capture records land.

## Classified backlog

- Plans 132 and 133 add missing Data Table and Date Picker fixture contracts.
- Plan 134 formalizes Typography's docs-only origin contract.
- Plan 135 burns down the 33 measured mobile-overflow exceptions.
- Plan 136 expands the executable workbench across high-risk families.

All exceptions expire on 2026-10-09. The generated audit lives under
`plans/artifacts/128-public-component-parity/`.
