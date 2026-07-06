# Plan 106: Harden shadcn data, date, and carousel regressions

> **Executor instructions**: Follow this plan step by step. Add the failing
> tests first, confirm they fail for the user-reported behavior, then implement
> the smallest source changes that make those tests pass. Run every verification
> command and confirm the expected result before moving on. If any STOP
> condition occurs, stop and report; do not improvise. When done, update the
> status row for this plan in `plans/README.md` unless a reviewer dispatched you
> and told you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat e6f708a5..HEAD -- src/main.ts src/live-examples.ts src/scene.test.ts tests/e2e/docs.test.ts src/registry/shadcn/calendar src/registry/shadcn/carousel src/registry/shadcn/data-table src/registry/shadcn/date-picker src/registry/shadcn/pagination src/registry/shadcn/table registry/docs/shadcn plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" notes against the live code before proceeding. On a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plan 078, Plan 079, Plan 100, Plan 101, Plan 104, Plan 105
- **Category**: regression tests and behavior
- **Planned at**: commit `e6f708a5`, 2026-07-05
- **Execution status**: DONE on 2026-07-05 after reviewer verification

## Why this matters

Calendar, date picker, carousel, data table, pagination, and table actions are
the shadcn examples where users expect state to move. The report says month/date
switching does not work, date picker surfaces bleed into the code area, carousel
lacks smooth Embla-like transitions, data-table column controls are stuck open,
rows-per-page controls do not work, and table actions are inert.

This plan adds regressions around those interactions and then fixes the local
Foldkit models that power the examples.

## Current state

- `src/registry/shadcn/calendar/index.ts` defines native calendar state and
  `updateCalendarState`, including next/previous month messages.
- `src/live-examples.ts` registers calendar examples through `calendarExample`
  at lines 1782-1811.
- `src/registry/shadcn/date-picker/examples.ts` has compact flags and
  deterministic dates, and `src/registry/shadcn/date-picker/index.ts` defines
  trigger/panel classes. The user's screenshot shows the panel bleeding over
  the code block and no visible background separation.
- `src/registry/shadcn/carousel/index.ts` defines a native local state model
  instead of importing Embla. The user's report explicitly calls out that
  shadcn uses Embla Carousel under the hood, so this local API must match the
  public shadcn/Embla semantics that origin examples rely on, without importing
  Embla.
- `src/live-examples.ts` registers carousel examples through
  `carouselExample` at lines 1803-1811.
- `src/registry/shadcn/data-table/examples.ts` composes local table, checkbox,
  select, dropdown menu, and pagination controls. The column visibility menu is
  currently a likely suspect because it is rendered open by default in the
  example helper; verify against live code before changing it.
- `src/live-examples.ts` registers data-table examples through
  `dataTableExample` at lines 1878-1902.
- `TableActions` and pagination examples are static examples in
  `src/live-examples.ts`, so action menus and rows-per-page controls may have no
  model path.

## Failing tests to add first

Add browser regressions in `tests/e2e/docs.test.ts` or a dedicated
`tests/e2e/shadcn-data-date-carousel.test.ts`.

1. Calendar:
   - Navigate to `/components/shadcn/calendar`.
   - In `CalendarDemo live preview`, record the visible month heading.
   - Click next month and previous month controls and assert the heading
     changes correctly.
   - Select a day and assert the selected state moves to that day.
   - Cover at least one range or multiple-month example if present.
2. Date picker:
   - Navigate to `/components/shadcn/date-picker`.
   - In `DatePickerDemo live preview`, open the picker.
   - Assert the panel has an opaque popover/card background, border, shadow,
     and higher stacking context than the code block behind it.
   - Assert the panel is bounded by the preview card and does not overlap the
     code sample below.
   - Select a date and assert the trigger text updates and the panel closes.
   - Compare a regular and compact example: assert compact has a measurably
     smaller trigger and/or panel layout than regular.
3. Carousel:
   - Navigate to `/components/shadcn/carousel`.
   - In the default carousel preview, click next and assert:
     - The selected slide index changes.
     - The slide container transform changes.
     - The computed transition property includes transform and has a nonzero
       duration.
     - Previous/next button disabled state matches whether scrolling is
       possible.
   - Add keyboard tests for ArrowLeft/ArrowRight and RTL/orientation where
     examples exist.
   - Add a unit/Scene test that checks the local API shape against the shadcn
     Embla-facing concepts used by origin examples: `api`, `scrollPrev`,
     `scrollNext`, `canScrollPrev`, `canScrollNext`, selected snap/index, and
     orientation. The local implementation does not need to import Embla, but
     the examples must expose equivalent behavior.
4. Data table:
   - Navigate to `/components/shadcn/data-table`.
   - In `DataTableDemo live preview`, click the columns button and assert the
     dropdown opens, then outside-click/Escape and assert it closes.
   - Toggle a column and assert visible table headers/cells update.
   - Change rows per page and assert the number of visible body rows and page
     status text update.
   - Select all rows and assert the selected row count updates.
5. Pagination and table actions:
   - Navigate to `/components/shadcn/pagination`; change rows per page in any
     live example that exposes it and assert visible rows/page status updates.
   - Navigate to `/components/shadcn/table`; in `TableActions live preview`,
     click a row action button/menu trigger and assert an action menu appears
     and can be activated/dismissed.

The red phase is successful only when the new tests fail against
`e6f708a5` for the reported broken behavior.

## Implementation outline

1. Calendar and date picker:
   - Keep calendar/date-picker state in `src/main.ts` and update via existing
     calendar/date-picker messages where possible.
   - Fix any view wiring that ignores the updated calendar state.
   - Fix date-picker panel containment, background, and z-index using local
     shadcn/Foldkit classes, not ad hoc inline positioning.
   - Preserve the compact option as a real layout difference.
2. Carousel:
   - Read the pinned origin carousel source under `repos/ui` and the local
     `src/registry/shadcn/carousel` implementation before changing the API.
   - Match the shadcn public API concepts that come from Embla, but keep the
     implementation native to Foldkit. Do not install or import Embla.
   - Add smooth transform transitions and ensure state changes do not remount
     the slide track in a way that prevents animation.
3. Data table:
   - Keep sorting, filtering, pagination, column visibility, and selection in
     the local `DataTableState`.
   - Fix column menu open state so it is controlled by the live preview model
     and not stuck open.
   - Fix rows-per-page by routing the Select value change into
     `DataTable.setPageSize` and resetting/clamping page index as needed.
4. Pagination and table actions:
   - If pagination docs examples expose rows per page, convert them to
     controller-aware live examples rather than static markup.
   - If `TableActions` is meant to include an action menu, compose the local
     Dropdown Menu and wire it through Plan 104's controller shape.
5. Regenerate docs artifacts if source snippets or metadata change.

## Acceptance criteria

- Calendar next/previous month and day selection work in the docs previews.
- Date picker panels have a real background, do not bleed into code samples,
  select dates, dismiss, and show a visible regular-vs-compact difference.
- Carousel transitions are smooth and expose shadcn/Embla-equivalent behavior
  through the local Foldkit state/API.
- Data-table column menus are not stuck open, column visibility toggles, rows
  per page changes the table, and row selection updates aggregate state.
- Pagination rows-per-page controls and TableActions are interactive when shown
  as live-ready examples.

## Verification

Run these commands and include the pass/fail result in the executor closeout:

```bash
bun run test
bunx playwright test tests/e2e/docs.test.ts --grep "calendar|date picker|carousel|data table|pagination|table"
bun run typecheck
bun run registry:check
bun run check
```

If generated registry artifacts change, also run:

```bash
bun run registry:build
git diff --check -- registry registry-src src tests plans
```

## STOP conditions

- A carousel fix requires importing Embla or any React runtime package into
  installable source.
- Date-picker correctness requires changing the local Calendar primitive API
  beyond this component's wrapper. Stop and plan that primitive change first.
- Data-table rows-per-page or column visibility cannot be represented by the
  existing local `DataTableState` without inventing a second query model.
- A layout test can only pass with arbitrary sleeps or viewport-specific magic
  numbers instead of observable geometry/style constraints.
