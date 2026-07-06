# Plan 104: Harden shadcn overlay and menu regressions

> **Executor instructions**: Follow this plan step by step. Add the failing
> tests first, confirm they fail for the user-reported behavior, then implement
> the smallest source changes that make those tests pass. Run every verification
> command and confirm the expected result before moving on. If any STOP
> condition occurs, stop and report; do not improvise. When done, update the
> status row for this plan in `plans/README.md` unless a reviewer dispatched you
> and told you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat e6f708a5..HEAD -- src/main.ts src/live-examples.ts src/scene.test.ts tests/e2e/docs.test.ts src/registry/shadcn/alert-dialog src/registry/shadcn/avatar src/registry/shadcn/breadcrumb src/registry/shadcn/button-group src/registry/shadcn/context-menu src/registry/shadcn/dialog src/registry/shadcn/drawer src/registry/shadcn/dropdown-menu src/registry/shadcn/hover-card src/registry/shadcn/item src/registry/shadcn/menubar src/registry/shadcn/navigation-menu src/registry/shadcn/popover src/registry/shadcn/sheet src/registry/shadcn/tooltip registry/docs/shadcn plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" notes against the live code before proceeding. On a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plan 096, Plan 097, Plan 102
- **Category**: regression tests and behavior
- **Planned at**: commit `e6f708a5`, 2026-07-05
- **Execution status**: DONE on 2026-07-05 after repairing the partial worker
  diff and rerunning the Plan 104 browser acceptance lane.

## Execution resolution

The follow-up repair closed the previous browser acceptance failures and
verified the Plan 104 gate:

```bash
bunx playwright test tests/e2e/docs.test.ts --grep "alert dialog|dialog|dropdown|context menu|menubar|navigation menu|hover card|popover|tooltip|avatar|breadcrumb|button group|item"
```

The repair also passed `bun run typecheck`, the focused shadcn menu Vitest lane,
`bun run registry:check`, `bun run check`, and `git diff --check`.

## Why this matters

Many shadcn docs examples are marked live-ready but do not behave like live
examples. The user's report names broken dropdowns, popovers, tooltips,
hover-cards, menus, and dialogs. This is one failure family: examples either
remain static after Plan 096/097, or their controller wiring opens content but
does not close, dismiss, anchor, or toggle menu item state correctly.

This plan turns those reports into browser and Scene regressions before fixing
the shared overlay/menu preview wiring.

## Current state

- `src/main.ts` owns generic live preview state for overlays and menus:
  select, combobox, overlay, dropdown menu, context menu, menubar, navigation
  menu, and date picker state are initialized in the root model and updated in
  `update`.
- `src/live-examples.ts` already has controller helpers for the general overlay
  family:
  - `overlayController` at lines 1963-1973.
  - `dropdownMenuExample` at lines 1975-1987.
  - `contextMenuExample` at lines 1989-2004.
  - `menubarExample` at lines 2006-2026.
  - `navigationMenuExample` at lines 2028-2038.
  - alert dialog, dialog, drawer, hover card, popover, sheet, and tooltip
    wrappers at lines 2040-2070.
- Several examples in this bug report are still registered with
  `staticExample`, so user interactions have no path back into the Foldkit
  model:
  - `BreadcrumbDropdown`, `AvatarDropdown`, `Bubble*`, `ButtonGroupDropdown`,
    `ButtonGroupPopover`, `ButtonGroupSelect`, `ItemDropdown`, and many sidebar
    variants.
  - This plan covers breadcrumb, avatar, button group, item, and the generic
    overlay/menu examples. Plan 108 covers bubble and sidebar.
- `src/registry/shadcn/dialog/examples.ts` renders close and footer action
  buttons, but the footer helper creates plain buttons that do not close the
  dialog. The user's report says dialog actions and the close button do not
  dismiss.
- `src/registry/shadcn/alert-dialog/examples.ts` renders action and cancel
  buttons. The user's report says only the cancel-like button closes, so action
  buttons need an explicit close path too.
- `src/registry/shadcn/dropdown-menu/examples.ts`,
  `src/registry/shadcn/context-menu/examples.ts`, and
  `src/registry/shadcn/menubar/examples.ts` accept controllers, but the user
  reports broken checkbox menu items, complex menu behavior, and incorrect
  menu styling/functionality. This plan should test behavior first; Plan 107
  follows with stricter visual parity checks.
- `tests/e2e/docs.test.ts` already has useful patterns for live docs smoke
  tests, preview locators, bounding-box checks, and sidebar/menu interactions.
  Extend those helpers instead of creating a parallel browser harness unless
  the file becomes unwieldy.

## Failing tests to add first

Add focused Playwright regressions in `tests/e2e/docs.test.ts`, or in a new
`tests/e2e/shadcn-overlay-menu.test.ts` if that is cleaner. Use component docs
routes and `.live-example-preview` labels, because the user is reporting the
public docs experience.

1. Alert dialog and dialog dismissal:
   - Navigate to `/components/shadcn/alert-dialog`.
   - In `AlertDialogDemo live preview`, open the dialog.
   - Click the cancel button and assert the dialog content is gone.
   - Reopen, click the action/destructive action button, and assert the dialog
     content is gone.
   - Navigate to `/components/shadcn/dialog`.
   - In `DialogDemo live preview`, open the dialog.
   - Click the visible close button and assert content is gone.
   - Reopen, click footer actions such as `Save changes` or `Cancel`, and
     assert content is gone.
2. Static dropdown examples become live:
   - Navigate to `/components/shadcn/avatar`, open `AvatarDropdown live preview`,
     assert menu content appears, click a menu item, then assert the menu
     dismisses.
   - Navigate to `/components/shadcn/breadcrumb`, open
     `BreadcrumbDropdown live preview`, assert menu content appears, select an
     item, and assert it dismisses.
   - Navigate to `/components/shadcn/button-group`, cover
     `ButtonGroupDropdown`, `ButtonGroupPopover`, and `ButtonGroupSelect`.
   - Navigate to `/components/shadcn/item`, cover `ItemDropdown`.
3. Menu item state:
   - Navigate to `/components/shadcn/dropdown-menu`.
   - In `DropdownMenuCheckboxes live preview`, toggle a checked menu item and
     assert its ARIA checked state and/or visible check indicator changes while
     unrelated items are unchanged.
   - In the complex dropdown example, open a submenu, assert it is attached to
     the parent item, activate an item, and assert the menu closes.
4. Context menu and menubar:
   - Navigate to `/components/shadcn/context-menu`.
   - Right-click inside `ContextMenuDemo live preview`, assert the menu appears
     near the pointer and closes on Escape and outside click.
   - Navigate to `/components/shadcn/menubar`.
   - Open one top-level menu, arrow or click into another top-level menu, and
     assert only the active menu remains visible.
5. Navigation menu, hover card, popover, and tooltip:
   - Navigate to `/components/shadcn/navigation-menu`; open a navigation panel
     and assert Escape and outside click dismiss it.
   - Navigate to `/components/shadcn/hover-card`; hover/focus the trigger and
     assert the content appears as a positioned floating surface, not inline
     page text.
   - Navigate to `/components/shadcn/popover`; open the popover, assert its
     bounding box remains attached to the trigger before and after a scroll,
     then outside-click and assert it dismisses.
   - Navigate to `/components/shadcn/tooltip`; hover/focus the trigger, assert
     content appears, then unhover/Escape and assert it disappears.

Add supporting Scene tests where a behavior is purely model/update driven:

- `src/scene.test.ts` should cover `UpdatedLiveExampleOverlayOpen`,
  dropdown/menu checked state, submenu open state, menubar active value, and
  navigation-menu active value at the root update level.
- Component-local tests should cover any changed class/attribute helpers, but
  do not use component-local tests as a substitute for the browser regressions.

The red phase is successful only when at least one new test fails for each
reported group above on commit `e6f708a5`.

## Implementation outline

1. Convert static dropdown-like examples to live examples.
   - Replace `staticExample` registrations for `AvatarDropdown`,
     `BreadcrumbDropdown`, `ButtonGroupDropdown`, `ButtonGroupPopover`,
     `ButtonGroupSelect`, and `ItemDropdown` with controller-aware wrappers.
   - Prefer reusing existing dropdown, popover, and select controllers in
     `src/live-examples.ts` instead of adding per-component one-off state.
   - If an example currently hardcodes a static button shell, refactor the
     example to accept the same kind of controller as the primitive it composes.
2. Fix dialog and alert-dialog close semantics.
   - Wire action, cancel, and explicit close buttons through the component's
     close attributes or through the live overlay controller.
   - Preserve Elm Architecture: the click should emit a fact message such as
     an overlay open-change result. Do not imperatively remove DOM nodes.
3. Fix menu checked items and complex menus.
   - Keep menu item state in the root model, keyed by example id and item id.
   - Toggle checkbox/radio menu items through Message/update, not mutable
     local closures.
   - Keep submenu state explicit and example-scoped so two example cards cannot
     affect each other.
4. Fix dismissal and attachment.
   - Reuse the existing local Popover/Dialog/Menu foundations. Do not import
     React, Base UI React, Floating UI React, Radix, or upstream shadcn code.
   - Ensure Escape, outside click, item activation, and trigger re-click produce
     open-change Messages where the component contract supports them.
   - Position popover, tooltip, hover-card, context menu, and menu content
     relative to the trigger or pointer inside the preview, with stable side
     and align data attributes.
5. Regenerate docs artifacts if source metadata or snippets change.
   - Run `bun run registry:build` only after source/doc metadata changes that
     require generated artifacts.

## Acceptance criteria

- The new Playwright tests prove that the user-reported overlay/menu examples
  fail before the fix and pass after the fix.
- All affected examples remain live-ready and are backed by model/update state,
  not static markup with no interactions.
- Dialog and alert-dialog action, cancel, close, outside-click, and Escape paths
  dismiss correctly.
- Dropdown, context menu, menubar, navigation menu, popover, hover card, and
  tooltip content open, remain anchored, and dismiss predictably.
- Checkbox/radio menu items toggle their own visible and ARIA state.
- No source imports from `repos/foldkit`, `repos/ui`, or React-only packages.

## Verification

Run these commands and include the pass/fail result in the executor closeout:

```bash
bun run test
bunx playwright test tests/e2e/docs.test.ts --grep "alert dialog|dialog|dropdown|context menu|menubar|navigation menu|hover card|popover|tooltip|avatar|breadcrumb|button group|item"
bun run typecheck
bun run registry:check
bun run check
```

If docs artifacts changed, also run:

```bash
bun run registry:build
git diff --check -- registry registry-src src tests plans
```

## STOP conditions

- A fix requires importing React, Radix, Base UI React, Floating UI React, or
  upstream shadcn runtime code into installable Foldkit source.
- The same example state would need to live outside the Foldkit model.
- A browser test can only pass by using timing sleeps instead of observable
  roles, attributes, geometry, or model-backed state.
- A component's upstream behavior conflicts with an existing local Foldkit
  primitive contract. Stop and plan the primitive change first.
