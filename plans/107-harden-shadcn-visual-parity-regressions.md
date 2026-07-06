# Plan 107: Harden shadcn visual parity regressions

> **Executor instructions**: Follow this plan step by step. Add the failing
> tests first, confirm they fail for the user-reported behavior, then implement
> the smallest source changes that make those tests pass. Run every verification
> command and confirm the expected result before moving on. If any STOP
> condition occurs, stop and report; do not improvise. When done, update the
> status row for this plan in `plans/README.md` unless a reviewer dispatched you
> and told you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat e6f708a5..HEAD -- src/main.ts src/live-examples.ts tests/e2e src/registry/shadcn/collapsible src/registry/shadcn/context-menu src/registry/shadcn/date-picker src/registry/shadcn/dialog src/registry/shadcn/drawer src/registry/shadcn/dropdown-menu src/registry/shadcn/hover-card src/registry/shadcn/popover src/registry/shadcn/progress src/registry/shadcn/separator src/registry/shadcn/sheet src/registry/shadcn/tabs src/registry/shadcn/toast src/registry/shadcn/tooltip registry/docs/shadcn tests/parity plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" notes against the live code before proceeding. On a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MEDIUM
- **Depends on**: Plan 104, Plan 105, Plan 106
- **Category**: visual parity and regression tests
- **Planned at**: commit `e6f708a5`, 2026-07-05
- **Execution status**: DONE on 2026-07-06 after reviewer verification

## Why this matters

Several user reports are about visual parity rather than pure interaction:
context menu and dropdown do not match origin, date picker lacks a background,
drawer/sheet sizing is wrong, progress and tabs styling are missing or
incorrect, separator examples are absent, toast styles need cleanup, hover card
looks broken, tooltip content changes shape, and collapsible lacks a smooth
transition.

This plan adds browser-level visual regression checks that are stable enough for
CI and grounded in the pinned origin evidence, then fixes the local styles.

## Current state

- `tests/e2e/docs.test.ts` already contains layout helpers such as
  `expectExampleCardsStayInsideMainColumn`,
  `expectPreviewDescendantsStayInsidePreview`, and computed toast diagnostics.
  Extend those helpers instead of adding a screenshot-only suite.
- `playwright.config.ts` already runs a built, prerendered docs site through the
  preview server, so these checks should exercise the shipped docs surface.
- `tests/parity/slots.ts` already defines layered parity concepts for ready
  slots: class tokens, attributes, DOM structure, computed style, colors,
  dimensions, bounding boxes, and keyboard behavior. Reuse that vocabulary for
  any new helper names or assertions.
- Docs ADR 0002 says the site shell does not need to clone shadcn.com exactly,
  but component examples should preserve the origin component behavior, parts,
  and shadcn/base-nova token affordances.
- The user-provided screenshots show:
  - Date picker content with transparent/bleeding background over the code
    sample.
  - Hover card content appearing like unstyled inline text on the page.
  - Input OTP visible slots with broken focus/slot styling. Input OTP is fixed
    by Plan 105; this plan should add any remaining visual checks if needed.

## Failing tests to add first

Add a browser visual regression file such as
`tests/e2e/shadcn-visual-regressions.test.ts`, or extend `docs.test.ts` if the
team prefers a single file. Avoid brittle full-page screenshots. Prefer
component-level computed style, class token, DOM part, geometry, and bounded
preview assertions.

Add tests for these groups:

1. Floating surface style:
   - Dropdown Menu, Context Menu, Menubar, Popover, Hover Card, Tooltip, Select,
     Combobox, and Navigation Menu content must have non-transparent
     background, border or shadow, radius, foreground color, and a higher
     stacking context than preview/code content.
   - Menus and popovers must stay inside the preview or intentionally portal
     into a bounded overlay layer for that preview.
2. Date picker:
   - Panel background is opaque.
   - Panel does not overlap the source code region.
   - Regular and compact examples differ by measurable trigger and/or panel
     dimensions.
3. Dialog, Drawer, and Sheet:
   - Dialog sticky footer remains visible and attached to the dialog content
     while the body scrolls.
   - Drawer and Sheet top/bottom examples do not take the entire demo space
     unless origin evidence says they should. Assert a max height/width
     relative to the preview viewport.
4. Collapsible:
   - Open/close content has transition classes or computed transition duration.
   - The transition does not remount content in a way that drops focus or
     layout anchors.
5. Progress and Slider:
   - Progress track and indicator are both visible.
   - Indicator width reflects value.
   - Slider track, range, and thumb are visible. Plan 105 covers interaction.
6. Separator:
   - Every live-ready separator example renders a visible separator element
     with the correct orientation dimensions.
   - If examples are missing from the docs page, test the expected example
     titles first and let the red test prove the gap.
7. Tabs:
   - Default, line, vertical, and icon examples expose the expected shadcn/base
     styles for list, triggers, active state, content, and icons.
8. Toast:
   - Shadcn toast variants have coherent background, border, foreground, action,
     close, and destructive styles.
   - Stacked toasts retain the Plan 098 hover/focus expansion behavior while
     matching the shadcn wrapper styling.
9. Tooltip:
   - Tooltip content width/height remains stable between first hover and
     repeated hover/focus cycles, and content does not reflow the trigger.

The red phase is successful only when each user-reported visual issue has at
least one failing assertion on commit `e6f708a5`.

## Implementation outline

1. Ground each fix in local or pinned origin evidence.
   - Read the local component source and the pinned origin source/fixtures under
     `repos/ui` before changing style contracts.
   - Do not treat shadcn.com page chrome as component parity; use origin
     component examples and local shadcn/base-nova tokens.
2. Add reusable browser diagnostics.
   - Helpers should return computed background, border, shadow, radius,
     transition, dimensions, z-index, and bounding boxes.
   - Keep assertions semantic enough to survive tiny design-token changes.
3. Fix class helpers, not individual rendered examples, when the broken style is
   shared.
   - Prefer changes in `src/registry/shadcn/<component>/index.ts` class helper
     functions.
   - Fix examples only when the example omitted a required part or option.
4. Keep layout bounded.
   - Date picker, drawer, sheet, popover, hover-card, tooltip, and menus should
     render inside a predictable preview surface and not cover source snippets.
   - Use existing portal/positioning primitives rather than bespoke absolute
     positioning for a single example.
5. Regenerate docs artifacts when snippets or metadata change.

## Acceptance criteria

- The new tests fail before implementation and pass after implementation.
- Floating shadcn surfaces have visible background, border/shadow, radius, and
  stable geometry.
- Date picker, drawer, sheet, dialog footer, hover-card, popover, and tooltip
  are visually bounded and readable.
- Progress, separator, slider, tabs, and toast examples expose visible parts
  matching the local shadcn/base-nova style contract.
- No broad redesign of the docs site shell is needed or included.

## Verification

Run these commands and include the pass/fail result in the executor closeout:

```bash
bun run test
bunx playwright test tests/e2e --grep "visual|dropdown|context menu|date picker|dialog|drawer|sheet|progress|separator|tabs|toast|tooltip|hover card|popover"
bun run typecheck
bun run registry:check
bun run check
```

For any component with an existing ready parity slot, also run the focused
parity check, for example:

```bash
bun run parity:check -- --grep shadcn/progress
bun run parity:check -- --grep shadcn/toast
```

If generated registry artifacts change, also run:

```bash
bun run registry:build
git diff --check -- registry registry-src src tests plans
```

## STOP conditions

- A visual assertion requires matching shadcn.com page chrome instead of the
  origin component/example source.
- The fix would make the docs shell inconsistent with ADR 0002.
- A style change would alter a shared primitive in a way that breaks existing
  Base UI or shadcn parity tests outside this plan's scope.
- The only possible test is a brittle full-page screenshot with no supporting
  DOM/style/geometry assertions.
