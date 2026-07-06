# Plan 110: Reopen shadcn overlay and menu regressions with exact red tests

> **Executor instructions**: Add failing browser regressions before changing
> source. The red tests must reproduce the user's current reports for dropdown
> menu, context menu, menubar, navigation menu, hover card, popover, tooltip,
> table actions, and sidebar action menus. Then fix the smallest shared
> Foldkit-native overlay/menu behavior that makes the tests pass.
>
> **Drift check (run first)**:
> `git diff --stat 0dea03a8..HEAD -- src/main.ts src/live-examples.ts src/scene.test.ts tests/e2e src/registry/shadcn/context-menu src/registry/shadcn/dropdown-menu src/registry/shadcn/hover-card src/registry/shadcn/menubar src/registry/shadcn/navigation-menu src/registry/shadcn/popover src/registry/shadcn/sidebar src/registry/shadcn/table src/registry/shadcn/tooltip registry/docs/shadcn plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the current
> state notes against the live code. On a mismatch, stop and report drift.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plans 104, 107, and 109
- **Category**: regression tests and behavior
- **Planned at**: commit `0dea03a8`, 2026-07-06
- **Execution baseline**: Plan 109 and Plan 112 are already applied in the
  current working tree. Treat their form/control fixes, generated registry
  updates, and shadcn toast removal as baseline work. Do not revert them while
  fixing this overlay/menu layer.
- **Execution note**: Browser red evidence isolated the sidebar action-menu
  offset as the source bug. `TableActions` clipping did not reproduce after two
  browser attempts; the final tests keep a geometry/dismissal guard instead of
  forcing a source change.

## Why this matters

The closed Plan 104/107 overlay lane still leaves the user seeing detached,
mispositioned, touchy, or unstyled menus and floating surfaces. Several
existing tests open one happy-path example, but the current reports involve
all variants, rapid hover/focus cycles, origin-like menu styling, and clipping
inside table/sidebar containers.

This plan adds exact red tests for the surfaces users actually touch, then
fixes shared overlay/menu state, positioning, and styling without introducing
non-Foldkit runtime dependencies.

## Current state

- `tests/e2e/docs.test.ts:786-882` covers one dropdown checkbox flow, one
  context menu, and one menubar transition. It does not sweep all variants or
  compare origin-like geometry/styling.
- `tests/e2e/docs.test.ts:887-968` opens navigation menu, hover card, popover,
  and tooltip, but it does not assert that the navigation overlay can be
  dismissed without obstructing the original menu, nor does it rapidly cycle
  hover/focus states.
- `tests/e2e/docs.test.ts:978-1039` checks a few floating surfaces are
  card-like. It does not cover `PopoverAlignments`, all menu variants, table
  action clipping, or sidebar action offset.
- `src/live-examples.ts:2877-2882`, `2946-2958`, `3054-3075`,
  `3179-3187`, `3352-3357`, `3389-3390`, `3463-3468`, and `3730-3731`
  register the relevant live menu, tooltip, hover-card, table-action, popover,
  and sidebar action examples.
- `src/registry/shadcn/table/examples.ts:357-416` defines `TableActions`; the
  user's screenshot shows its menu clipped at the bottom edge of the table
  surface.
- `src/registry/shadcn/sidebar/examples.ts:1805-1875` defines
  `SidebarMenuAction`; the user's screenshot shows the action menu offset away
  from the trigger and competing with the sidebar boundary.

## Commands you will need

- Unit/Scene tests:
  `bun run test`
  Expected on success: exit 0.
- Focused browser lane:
  `bunx playwright test tests/e2e --grep "dropdown|context menu|menubar|navigation menu|hover card|popover|tooltip|table actions|sidebar menu action"`
  Expected on success: exit 0 after the fix.
- Typecheck:
  `bun run typecheck`
  Expected on success: exit 0.
- Registry validation:
  `bun run registry:check`
  Expected on success: exit 0.
- Lint/check:
  `bun run check`
  Expected on success: exit 0.

## Scope

**In scope**:

- `tests/e2e/docs.test.ts` or a new
  `tests/e2e/shadcn-overlay-menu-regressions.test.ts`
- `src/scene.test.ts` for model/update coverage
- `src/main.ts`
- `src/live-examples.ts`
- `src/registry/shadcn/context-menu/**`
- `src/registry/shadcn/dropdown-menu/**`
- `src/registry/shadcn/hover-card/**`
- `src/registry/shadcn/menubar/**`
- `src/registry/shadcn/navigation-menu/**`
- `src/registry/shadcn/popover/**`
- `src/registry/shadcn/sidebar/**`
- `src/registry/shadcn/table/**`
- `src/registry/shadcn/tooltip/**`

**Out of scope**:

- Data-table page-size and pagination correctness; Plan 109 owns those.
- Drawer, sheet, alert-dialog, dialog, and sidebar sizing; Plan 111 owns those.
- Removing `shadcn/toast`; Plan 112 owns that.
- Reverting or rewriting Plan 109 form/control fixes or Plan 112 toast-removal
  artifacts.

## Git workflow

- Branch: `codex/110-reopen-shadcn-overlay-menu-regressions`.
- Commit per logical fix group if the operator asks for commits.
- Do not push or open a PR unless explicitly instructed.

## Steps

### Step 1: Add exact failing browser regressions

Add tests against public docs routes:

- Dropdown Menu:
  - For `DropdownMenuBasic`, `DropdownMenuCheckboxesIcons`, and
    `DropdownMenuComplex`, assert popup background, border/shadow, radius,
    width, item padding, item gap, disabled style, check placement, submenu
    placement, and trigger anchoring match pinned origin evidence within
    tolerant geometry/style assertions.
  - Assert checkbox indicators appear only for checked items.
- Context Menu:
  - Right-click at deterministic points in every context-menu example.
  - Assert content appears near the pointer, remains fully visible inside the
    preview or its bounded overlay layer, and closes on Escape/outside click.
  - Reproduce every still-present Plan 104 context menu issue before fixing.
- Menubar:
  - Sweep `MenubarDemo`, `MenubarCheckbox`, `MenubarIcons`, `MenubarRadio`,
    `MenubarSubmenu`, and RTL.
  - Assert one active top-level menu at a time, correct submenu placement,
    visible shortcut alignment, correct check/radio indicators, and no clipped
    content.
- Navigation Menu:
  - Open every top-level item.
  - Assert the original top-level trigger list remains visible and usable.
  - Assert Escape, outside click, and re-clicking the active trigger dismiss
    the overlay.
  - Assert overlay content does not obstruct future trigger interaction.
- Hover Card and Tooltip:
  - Rapidly hover/unhover and focus/blur the trigger at least ten cycles.
  - Assert there is never more than one mounted visible content surface.
  - Assert geometry, width, height, and background remain stable across cycles.
- Popover:
  - Cover `PopoverDemo`, `PopoverForm`, and all `PopoverAlignments` cases.
  - Assert start/center/end alignments by comparing trigger and surface x
    coordinates; current screenshots show alignment not working.
- Table Actions and SidebarMenuAction:
  - Open the row action menu for each row in `TableActions`; assert the menu is
    not clipped by the table container and can be dismissed by item click,
    Escape, and outside click.
  - Open each `SidebarMenuAction` menu; assert the popup is attached to the
    clicked ellipsis button and not offset into unrelated sidebar content.
  - If `TableActions` cannot be reproduced after two reasonable attempts, record
    the browser evidence and keep a regression guard for current geometry
    instead of changing unrelated source.

**Verify red**:

```bash
bunx playwright test tests/e2e --grep "dropdown|context menu|menubar|navigation menu|hover card|popover|tooltip|table actions|sidebar menu action"
```

Expected before source fixes: exit nonzero, with failures matching the user's
current overlay/menu reports.

### Step 2: Add or tighten model/update tests

Where the browser failure is caused by state rather than style, add Scene tests
for:

- dropdown/context/menubar checked and radio values
- submenu open state
- navigation-menu active item and dismissal
- hover-card/tooltip open state after rapid enter/leave/focus/blur events
- popover alignment state if represented in the model
- table/sidebar action menu open state keyed by row/action id

**Verify**:

```bash
bun run test -- src/scene.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/navigation-menu/navigation-menu.test.ts src/registry/shadcn/hover-card/hover-card.test.ts src/registry/shadcn/popover/popover.test.ts src/registry/shadcn/table/table.test.ts src/registry/shadcn/tooltip/tooltip.test.ts src/registry/shadcn/sidebar/sidebar.scene.test.ts
```

Expected before source fixes: new tests for the reported broken behavior fail.

### Step 3: Fix shared overlay/menu behavior

Implement the smallest shared fixes:

- Prefer existing local Menu, Popover, Preview Card/Hover Card, Tooltip, and
  Sidebar primitives over per-example absolute positioning.
- Keep state keyed by example id plus menu/popup id so multiple live examples
  cannot affect each other.
- Route all dismissal through messages and update. Do not remove DOM nodes
  imperatively.
- Repair positioning in the shared wrapper or primitive first. Only patch an
  example when the example omitted a required part.
- Ground styling in pinned origin files through each component's
  `registry-src/shadcn/<component>/item.json` evidence and the local
  shadcn/base-nova token contract.

**Verify**:

```bash
bunx playwright test tests/e2e --grep "dropdown|context menu|menubar|navigation menu|hover card|popover|tooltip|table actions|sidebar menu action"
bun run test -- src/scene.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/navigation-menu/navigation-menu.test.ts src/registry/shadcn/hover-card/hover-card.test.ts src/registry/shadcn/popover/popover.test.ts src/registry/shadcn/table/table.test.ts src/registry/shadcn/tooltip/tooltip.test.ts src/registry/shadcn/sidebar/sidebar.scene.test.ts
```

Expected after fixes: exit 0.

### Step 4: Regenerate artifacts only if needed

If source snippets or docs metadata changed, run:

```bash
bun run registry:build
```

Expected: generated artifacts update deterministically.

## Done criteria

- [ ] New browser tests fail before implementation for reproduced overlay/menu
      source bugs, with non-reproduced groups explicitly documented.
- [ ] Dropdown, context menu, menubar, navigation menu, hover card, popover,
      tooltip, table actions, and sidebar action menus are anchored, dismissible,
      styled, and unclipped.
- [ ] Rapid hover/focus cycles do not create bouncing or duplicate hover-card
      and tooltip surfaces.
- [ ] Navigation menu can be dismissed and does not obstruct its own trigger
      list.
- [ ] `bun run test`, focused Playwright, `bun run typecheck`,
      `bun run registry:check`, and `bun run check` pass.
- [ ] No upstream React/Radix/Base UI React runtime packages are imported.

## STOP conditions

- A fix requires adding a second overlay positioning system instead of reusing
  local Popover/Menu foundations.
- A test can only pass with arbitrary sleeps instead of visible roles,
  attributes, bounding boxes, or model-backed state.
- Pinned origin evidence contradicts a user-visible expectation. Stop and
  report the trade-off instead of guessing.
- A fix requires modifying Base UI primitive contracts outside this plan.

## Maintenance notes

Reviewers should inspect whether the fix lands in shared class/state helpers
instead of one-off example hacks. Most failures in this plan are likely shared
overlay/menu problems, and one-off fixes will regress again.
