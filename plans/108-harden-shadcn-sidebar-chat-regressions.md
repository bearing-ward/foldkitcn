# Plan 108: Harden shadcn sidebar and chat-family regressions

> **Executor instructions**: Follow this plan step by step. Add the failing
> tests first, confirm they fail for the user-reported behavior, then implement
> the smallest source changes that make those tests pass. Run every verification
> command and confirm the expected result before moving on. If any STOP
> condition occurs, stop and report; do not improvise. When done, update the
> status row for this plan in `plans/README.md` unless a reviewer dispatched you
> and told you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat e6f708a5..HEAD -- src/main.ts src/live-examples.ts src/scene.test.ts tests/e2e/docs.test.ts src/registry/shadcn/bubble src/registry/shadcn/sidebar src/registry/shadcn/toast src/registry/shadcn/tooltip src/registry/shadcn/popover src/registry/shadcn/collapsible registry/docs/shadcn plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" notes against the live code before proceeding. On a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plan 083, Plan 085, Plan 098, Plan 104, Plan 107
- **Category**: regression tests and behavior
- **Planned at**: commit `e6f708a5`, 2026-07-05
- **Execution status**: DONE on 2026-07-06 after reviewer verification

## Why this matters

The sidebar and chat-family examples are high-visibility demos, and the user
reported that they do not match origin style or functionality. Sidebar should
behave like a mini icon sidebar with expandable footer and menus. Bubble demos
should expand, trigger toasts, and show tooltip/popover affordances. Today many
of those examples are live-ready but still static, so they cannot prove the
component system works.

This plan adds explicit docs regressions for the sidebar and bubble failures,
then wires the examples through existing Foldkit state, toast, collapsible,
popover, and tooltip primitives.

## Current state

- `tests/e2e/docs.test.ts` already has a sidebar smoke test that covers
  `SidebarDemo`, dropdown placement, and basic collapsed state for a subset of
  examples.
- `src/live-examples.ts` registers only a subset of sidebar examples as
  controller-aware:
  `SidebarControlled`, `SidebarDemo`, `SidebarFooter`, `SidebarHeader`, and
  `SidebarRtl` are controller-backed, while `SidebarGroupAction`,
  `SidebarGroupCollapsible`, `SidebarMenuAction`, `SidebarMenuBadge`,
  `SidebarMenuCollapsible`, `SidebarMenuSub`, `SidebarMenu`, and `SidebarRsc`
  are static.
- `src/registry/shadcn/sidebar/examples.ts` contains many interactions that are
  currently not covered by the browser test, including group/menu collapsibles,
  menu actions, footer/user menu, and mini/collapsed surfaces.
- `src/live-examples.ts` registers every Bubble example through `staticExample`
  at lines 2354-2373.
- `src/registry/shadcn/bubble/examples.ts` shows the failures directly:
  - `BubbleCollapsibleDemo` renders a "Show more" button with no open-state
    controller.
  - `BubbleLinkButtonDemo` renders three button-like bubble contents with no
    toast or selection handler.
  - `BubbleTooltipDemo` renders a plain button with an aria label but no
    Tooltip.
  - `BubblePopoverDemo` renders a plain "Show error details" button but no
    Popover.

## Failing tests to add first

Add browser regressions in `tests/e2e/docs.test.ts` or a dedicated
`tests/e2e/shadcn-sidebar-chat.test.ts`.

1. Sidebar mini/collapsed behavior:
   - Navigate to `/components/shadcn/sidebar`.
   - In `SidebarDemo live preview`, collapse the sidebar.
   - Assert the sidebar becomes a mini icon rail rather than disappearing or
     keeping full labels.
   - Assert icon buttons remain visible, focusable, and labelled for assistive
     tech.
   - Reopen and assert labels return.
2. Sidebar footer and menus:
   - Open the sidebar footer/user menu, assert it expands above the trigger and
     contains expected account actions.
   - Collapse the sidebar and assert the footer remains usable in mini mode.
   - Activate a footer menu item and assert the menu dismisses.
3. Sidebar example coverage:
   - For `SidebarGroupCollapsible`, click the group trigger and assert nested
     items appear/disappear.
   - For `SidebarMenuCollapsible`, click menu triggers and assert nested menu
     items appear/disappear.
   - For `SidebarMenuAction`, click the action menu and assert action content
     appears and dismisses.
   - For `SidebarMenuSub`, assert submenus render with correct indentation and
     remain bounded inside the preview.
4. Bubble Collapsible:
   - Navigate to `/components/shadcn/bubble`.
   - In `BubbleCollapsibleDemo live preview`, assert long text is collapsed by
     default, click "Show more", assert full text appears, click "Show less",
     and assert it collapses.
5. Bubble Link Button:
   - In `BubbleLinkButtonDemo live preview`, click each suggested reply.
   - Assert a local shadcn/Sonner toast appears naming the selected reply, and
     repeated clicks create distinct visible toasts.
6. Bubble Tooltip and Popover:
   - In `BubbleTooltipDemo live preview`, hover/focus the read-status button and
     assert a tooltip appears with stable geometry and disappears on unhover or
     Escape.
   - In `BubblePopoverDemo live preview`, click the details button and assert a
     popover appears with error details, remains anchored to the button, and
     dismisses on outside click/Escape.

Add Scene/update tests for any new root messages:

- Sidebar mini/collapsed state and footer menu state if current messages do not
  cover them.
- Sidebar group/menu collapsible state for examples that become live.
- Bubble expanded state.
- Bubble selected-reply toast command/message flow.
- Bubble tooltip/popover open state.

The red phase is successful only when the new tests fail against
`e6f708a5` for the user-reported static/broken behavior.

## Implementation outline

1. Extend controller-aware sidebar registration.
   - Convert the static sidebar examples listed above to use the existing
     sidebar/menu/collapsible controller patterns where possible.
   - Keep state keyed by example id so multiple sidebar previews do not affect
     each other.
2. Align sidebar mini mode with origin.
   - Use the pinned origin evidence and local Plan 083 conventions.
   - Mini mode should show icons, preserve accessible labels, keep actions
     reachable, and not collapse into a blank strip.
3. Repair sidebar footer behavior.
   - Ensure footer/user menus open in the correct direction, expand from the
     trigger, remain visible inside the preview, and dismiss on activation,
     outside click, and Escape.
4. Convert Bubble examples from static to live.
   - Add a Bubble example controller type if needed, or reuse existing
     collapsible/overlay/toast controllers where that keeps the API simpler.
   - `BubbleCollapsibleDemo` should use model-backed collapsed/expanded state.
   - `BubbleLinkButtonDemo` should emit a message and command/toast through the
     existing shadcn toast/Sonner path.
   - `BubbleTooltipDemo` and `BubblePopoverDemo` should compose the local
     Tooltip and Popover components instead of plain buttons.
5. Regenerate docs artifacts if snippets or metadata change.

## Acceptance criteria

- Sidebar mini/collapsed mode matches origin intent: icons remain visible and
  usable, labels return on expand, and footer actions work in both states.
- Sidebar footer, group, menu, submenu, and action examples are interactive
  when marked live-ready.
- Bubble collapsible expands/collapses.
- Bubble link buttons trigger visible toasts.
- Bubble tooltip and popover examples use real floating surfaces that are
  anchored, styled, and dismissible.
- Browser regressions cover every sidebar/bubble issue named in this plan.

## Verification

Run these commands and include the pass/fail result in the executor closeout:

```bash
bun run test
bunx playwright test tests/e2e/docs.test.ts --grep "sidebar|bubble"
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

- A sidebar fix requires React context, cookies, or hidden global mutable state.
- Bubble toasts require importing upstream `sonner`; use the local
  Base UI/shadcn toast foundation instead.
- The origin sidebar behavior conflicts with the local Foldkit Sidebar API
  landed in Plan 083. Stop and plan the primitive/API correction first.
- The examples cannot be made interactive without widening to Message or
  Message Scroller foundations. Stop and write a follow-up plan rather than
  mixing unrelated chat primitives into this one.
