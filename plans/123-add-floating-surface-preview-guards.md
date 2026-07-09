# Plan 123: Add reusable floating-surface preview guards

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat 1515bdbb..HEAD -- tests/e2e src/styles.css`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/120-audit-complete-shadcn-ui-ux-parity.md
- **Category**: tests
- **Planned at**: commit `1515bdbb`, 2026-07-08

## Why this matters

NavigationMenuDemo recently exposed a blind spot in the shadcn docs regression
suite: a floating surface could be "visible" while still being the wrong
surface, aligned to the wrong trigger, clipped by the docs preview card, or
left open after hovering a link item. That failure pattern is not unique to
Navigation Menu; it also applies to dropdown menu, context menu, menubar,
hover-card, popover, tooltip, select, combobox, table actions, and sidebar
menus. This plan turns those findings into reusable browser-level assertions so
future overlay regressions fail with a precise geometry/clipping/state message
instead of slipping through broad `toBeVisible()` checks.

## Current state

This plan was written after the NavigationMenu follow-up work was investigated
in the working tree. If the NavigationMenu excerpts below are not present in
the executor's checkout, stop and ask whether this plan should be rebased after
that work lands.

- `tests/e2e/docs.test.ts` owns broad docs-surface e2e coverage. It already has
  a rounded `visibleBox` helper and `expectBoxInside`, but those helpers are
  local to this file:

```ts
// tests/e2e/docs.test.ts:134
type GeometrySnapshot = Readonly<{
  height: number
  width: number
  x: number
  y: number
}>

// tests/e2e/docs.test.ts:141
const visibleBox = async (locator: Locator): Promise<GeometrySnapshot> => {
  const box = await locator.boundingBox()
  // ...
}
```

- `tests/e2e/docs.test.ts` now contains a bespoke Navigation Menu regression
  that checks all four hover states and the docs-card overflow escape. This is
  the behavior pattern to generalize, not a one-off to copy-paste everywhere:

```ts
// tests/e2e/docs.test.ts:1001
const openNavigationContents = navigationPreview.locator(
  '[data-slot="navigation-menu-content"][data-open]',
)

// tests/e2e/docs.test.ts:1008
const expectNavigationPanel = async (
  name: string,
  expectedWidth: number,
  expectedText: string,
): Promise<void> => {
  // hover trigger, assert aria-expanded, assert visible, wait for transition,
  // then compare the open content box to the trigger box
}

// tests/e2e/docs.test.ts:1053
await expectNavigationPanel('Getting started', 390, 'Introduction')
await expectNavigationPanel('Components', 606, 'Alert Dialog')
await playwrightExpect(navigationCard).toHaveCSS('overflow', 'visible')
await expectNavigationPanel('With Icon', 207, 'Backlog')
await navigationPreview.getByText('Docs', { exact: true }).hover()
await playwrightExpect(openNavigationContents).toHaveCount(0)
```

- `tests/e2e/docs.test.ts` also has a broader "visual floating surfaces keep
  card styling" smoke, but most assertions stop at card styling or visibility.
  They do not consistently assert active-surface identity, trigger anchoring,
  stale mounted content count, or ancestor clipping:

```ts
// tests/e2e/docs.test.ts:1146
playwrightTest(
  'visual floating surfaces keep card styling',
  async ({ page }) => {
    // HoverCard, Popover, Dropdown Menu, Context Menu, Select, Combobox
    // each calls expectCardLikeFloatingSurface(...).
  },
)
```

- `tests/e2e/shadcn-overlay-menu-regressions.test.ts` has similar local
  geometry helpers and stronger overlay/menu checks, but these helpers are not
  shared with `docs.test.ts`:

```ts
// tests/e2e/shadcn-overlay-menu-regressions.test.ts:8
type Box = Readonly<{
  height: number
  width: number
  x: number
  y: number
}>

// tests/e2e/shadcn-overlay-menu-regressions.test.ts:15
const box = async (locator: Locator): Promise<Box> => {
  const layoutBox = await locator.boundingBox()
  // ...
}

// tests/e2e/shadcn-overlay-menu-regressions.test.ts:34
const assertSurfaceVisible = async (surface: Locator): Promise<Box> => {
  await playwrightExpect(surface).toBeVisible()
  return box(surface)
}
```

- The overlay/menu regression file already contains relevant target cases that
  should move toward the shared helper contract: Navigation Menu
  dismissal-only coverage at `tests/e2e/shadcn-overlay-menu-regressions.test.ts:689`,
  HoverCard side geometry at `tests/e2e/shadcn-overlay-menu-regressions.test.ts:753`,
  Popover alignment geometry at `tests/e2e/shadcn-overlay-menu-regressions.test.ts:814`,
  TableActions clipping guards at `tests/e2e/shadcn-overlay-menu-regressions.test.ts:881`,
  and SidebarMenuAction anchoring at `tests/e2e/shadcn-overlay-menu-regressions.test.ts:903`.

- `src/styles.css` intentionally clips `.live-example-preview` by default and
  then opts specific overlay cases into visible overflow. This is a necessary
  docs-preview safety boundary, but it is also where a surface can be visually
  chopped while the DOM node remains "visible":

```css
/* src/styles.css:690 */
.live-example-preview {
  min-height: 28rem;
  overflow: hidden;
  transform: translateZ(0);
}

/* src/styles.css:701 */
.live-example-preview:has([data-slot='context-menu-content'][data-open]),
.live-example-preview:has([data-slot='navigation-menu-content'][data-open]),
.live-example-preview:has(
  [data-slot='sidebar-wrapper'] [data-slot='dropdown-menu-content'][data-open]
) {
  z-index: 20;
  overflow: visible;
  transform: none;
}
```

- The accepted docs-site ADR requires separating docs-shell styling from
  shadcn preview fidelity. Do not "fix" clipping by globally removing preview
  containment:

```md
docs/decisions/0002-foldkit-cn-documentation-site.md:44
The docs shell and component preview styling are separate concerns. The shell
follows the Foldkit identity. shadcn previews render with shadcn/base-nova
tokens so component examples can remain faithful to their registry styling.
```

## Commands you will need

| Purpose                     | Command                                                                                                                                                 | Expected on success                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Targeted docs e2e           | `bunx playwright test tests/e2e/docs.test.ts`                                                                                                           | exit 0, docs e2e file passes         |
| Targeted overlay e2e        | `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts`                                                                                | exit 0, overlay/menu e2e file passes |
| Typecheck                   | `bun run typecheck`                                                                                                                                     | exit 0, no TypeScript errors         |
| Lint/check scoped files     | `bunx ultracite check tests/e2e/docs.test.ts tests/e2e/shadcn-overlay-menu-regressions.test.ts tests/e2e/floating-surface-assertions.ts src/styles.css` | exit 0, no format/lint issues        |
| Full relevant e2e file pass | `bunx playwright test tests/e2e/docs.test.ts tests/e2e/shadcn-overlay-menu-regressions.test.ts`                                                         | exit 0, both files pass              |

Do not run `bun run registry:build` for this plan unless you deliberately touch
registry source files; this plan should normally change tests and possibly
`src/styles.css` only.

## Scope

**In scope**:

- `tests/e2e/floating-surface-assertions.ts` (create)
- `tests/e2e/docs.test.ts`
- `tests/e2e/shadcn-overlay-menu-regressions.test.ts`
- `src/styles.css` only for narrowly scoped docs-preview overflow/clipping
  rules proven by the new tests

**Out of scope**:

- Component primitive or wrapper source under `src/registry/**`
- Generated registry/public artifacts under `registry/**` and `public/r/**`
- Broad visual redesign of docs preview cards
- Pixel-perfect origin screenshot comparison
- Any change to component docs content, examples, or registry metadata

## Git workflow

- Branch: `codex/123-floating-surface-preview-guards`
- Commit style: use the existing conventional style, for example
  `test: add floating surface preview guards`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Extract shared floating-surface geometry helpers

Create `tests/e2e/floating-surface-assertions.ts`. Move the shared shape of
`visibleBox` / `box` into this file without changing behavior. Export:

- `type Box`
- `visibleBox(locator: Locator): Promise<Box>`
- `expectOnlyVisibleSurface(container: Locator, selector: string): Promise<Locator>`
- `expectSurfaceAnchoredToTrigger(surface: Locator, trigger: Locator, options?: { tolerance?: number; settleMs?: number }): Promise<void>`
- `expectEscapingSurfaceHasVisibleOverflow(surface: Locator, previewCard: Locator): Promise<void>`
- `expectNoOpenSurfaces(container: Locator, selector: string): Promise<void>`

Implementation constraints:

- Import `expect as playwrightExpect` from `@playwright/test`.
- Import only types for `Locator`.
- Keep helpers deterministic: use rounded boxes as the existing tests do.
- `expectSurfaceAnchoredToTrigger` should assert:
  - surface is visible,
  - surface overlaps the trigger horizontally,
  - surface is no more than one trigger-height above the trigger unless a side
    option is explicitly added later,
  - default tolerance is small, around 8px.
- `expectEscapingSurfaceHasVisibleOverflow` should compare the surface and card
  boxes. If the surface extends beyond the card on any side, assert the card
  has CSS `overflow: visible`.

**Verify**:
`bunx ultracite check tests/e2e/floating-surface-assertions.ts`
-> exit 0.

### Step 2: Refactor existing local helpers with minimal churn

Update `tests/e2e/docs.test.ts` and
`tests/e2e/shadcn-overlay-menu-regressions.test.ts` to import the shared
`Box`/`visibleBox` helper. Keep file-local helpers that are genuinely
domain-specific, such as side-specific context menu assertions.

Do not rewrite every assertion in these files. The goal is to make the new
floating-surface guardrails reusable while avoiding broad e2e churn.

**Verify**:
`bunx playwright test tests/e2e/docs.test.ts`
-> exit 0.

### Step 3: Add active-surface and clipping assertions to the docs smoke

In `tests/e2e/docs.test.ts`, strengthen the existing
`visual floating surfaces keep card styling` test or add a nearby test that
uses the new helper for these cases:

- `HoverCardDemo`: hover/focus opens exactly one visible
  `[data-slot="hover-card-content"]`, anchored to the trigger, then closes.
- `PopoverDemo` or `PopoverAlignments`: click opens exactly one visible
  `[data-slot="popover-content"][data-open]`, anchored to the active trigger,
  then closes on outside click.
- `DropdownMenuDemo`: click opens exactly one visible
  `[data-slot="dropdown-menu-content"][data-open]`, anchored to the trigger,
  then closes.
- `ContextMenuDemo`: right-click opens exactly one visible
  `[data-slot="context-menu-content"][data-open]` near the click target, and
  the preview/card is not clipping it.
- `SelectDemo` and `ComboboxBasic`: use `[data-open]` locators and assert the
  open surface is anchored or intentionally preview-contained. This catches the
  stale-mounted-content issue that broad `[data-slot="...-content"]` locators
  can miss.

For each case, if the surface extends past the preview card, call
`expectEscapingSurfaceHasVisibleOverflow`. Do not globally set cards or preview
surfaces to `overflow: visible`; only add `src/styles.css` cases for the exact
surface type that needs to escape.

**Verify**:
`bunx playwright test tests/e2e/docs.test.ts --grep "visual floating surfaces"`
-> exit 0.

### Step 4: Strengthen menu-family transition tests

In `tests/e2e/shadcn-overlay-menu-regressions.test.ts`, use the shared helper
for these high-risk transition cases:

- Navigation Menu: keep or move the four-state coverage from `docs.test.ts`
  so it checks `Getting started`, `Components`, `With Icon`, and `Docs`
  against the open `[data-slot="navigation-menu-content"][data-open]` panel.
  Assert `Docs` leaves zero open content.
- Menubar: when moving from `File` to `Edit`, assert exactly one visible
  `[data-slot="menubar-content"]` exists and its box moves near the active
  trigger after the transition settles.
- TableActions: when opening each row action menu, assert the surface remains
  within the table preview tolerance or that the containing preview/card has
  the intended visible overflow.
- SidebarMenuAction: assert the menu remains near either the right or left edge
  of the trigger and is not clipped by the sidebar wrapper or preview card.

Prefer strengthening the existing tests over adding another large e2e file.
However, if the combined file becomes hard to read, creating
`tests/e2e/shadcn-floating-surface-regressions.test.ts` is acceptable as long as
the command table above is updated in the plan index when done.

**Verify**:
`bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts`
-> exit 0.

### Step 5: Fix only docs-preview clipping rules proven by the new tests

If a new test fails only because a surface is correctly positioned but clipped
by `.docs-preview-card`, `.docs-preview-surface`, or `.live-example-preview`,
add the narrowest possible `:has([data-slot='...'][data-open])` rule in
`src/styles.css`.

Use the existing Navigation Menu and Context Menu rules as the pattern:

```css
.live-example-preview:has([data-slot='context-menu-content'][data-open]) {
  z-index: 20;
  overflow: visible;
  transform: none;
}
```

Do not change component source to satisfy a preview-shell clipping failure. If
the surface itself is mispositioned before clipping is considered, stop and
split a component-specific plan.

**Verify**:
`bunx playwright test tests/e2e/docs.test.ts tests/e2e/shadcn-overlay-menu-regressions.test.ts`
-> exit 0.

## Test plan

Add or strengthen tests so they fail for the NavigationMenu class of bug:

- A locator selects stale mounted content instead of the active open surface.
- A surface is visible but anchored to the previous trigger.
- A surface extends beyond the docs card while the card remains
  `overflow: hidden`.
- A link or non-trigger hover leaves the previous popup open.
- Repeated hover/focus/click cycles leave more than one visible surface.

Use the existing NavigationMenu regression in `tests/e2e/docs.test.ts:991` and
the overlay regression helpers in
`tests/e2e/shadcn-overlay-menu-regressions.test.ts:1` as structural patterns.

## Done criteria

All must hold:

- [ ] `tests/e2e/floating-surface-assertions.ts` exists and is imported by at
      least `docs.test.ts` and `shadcn-overlay-menu-regressions.test.ts`.
- [ ] New/strengthened tests cover at least these surface families:
      dropdown menu, context menu, menubar, navigation menu, hover-card,
      popover, tooltip, select, combobox, table actions, and sidebar action
      menu.
- [ ] Open-surface locators use `[data-open]` or another active-state selector
      where the component keeps stale/mounted content in the DOM.
- [ ] Any surface that visually escapes the preview card has a test that checks
      the relevant card/preview overflow is visible.
- [ ] `bunx playwright test tests/e2e/docs.test.ts tests/e2e/shadcn-overlay-menu-regressions.test.ts`
      exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bunx ultracite check tests/e2e/docs.test.ts tests/e2e/shadcn-overlay-menu-regressions.test.ts tests/e2e/floating-surface-assertions.ts src/styles.css`
      exits 0.
- [ ] `git status --short` shows no modified files outside the in-scope list.
- [ ] `plans/README.md` status row for Plan 123 is updated if the executor owns
      the index update.

## STOP conditions

Stop and report back if:

- The NavigationMenu excerpts in this plan are missing; this plan depends on
  the current NavigationMenu findings being present or already landed.
- More than three new red failures appear outside the named high-risk surface
  families; this plan should not become a broad shadcn QA sweep.
- A fix requires touching component source under `src/registry/**`.
- A test can only pass by globally removing `.live-example-preview` or card
  overflow containment.
- Playwright flakiness appears after two attempts with settled-state waits; do
  not add arbitrary long sleeps beyond the short transition waits already used
  by the suite.

## Maintenance notes

- Future floating components should add their docs-preview guard through
  `tests/e2e/floating-surface-assertions.ts` instead of introducing another
  local `box` helper.
- Reviewers should scrutinize new CSS `:has(...)` rules. They should be
  surface-specific and justified by a test that proves clipping, not added as a
  broad escape hatch.
- This plan intentionally does not introduce screenshot or pixel-diff parity.
  The immediate gap is behavioral geometry and clipping detection; visual
  screenshot parity remains a separate, heavier strategy.
