# Plan 114: Normalize menu-family origin parity for offsets, styling, and handoff behavior

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan in
> `plans/README.md` - unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
>
> ```sh
> git diff --stat 56edd84b..HEAD -- src/registry/base-ui/menu/index.ts src/registry/base-ui/context-menu/index.ts src/registry/base-ui/menubar/index.ts src/registry/base-ui/navigation-menu/index.ts src/registry/shadcn/dropdown-menu/index.ts src/registry/shadcn/dropdown-menu/examples.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/index.ts src/registry/shadcn/context-menu/examples.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/index.ts src/registry/shadcn/menubar/examples.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/navigation-menu/index.ts src/registry/shadcn/navigation-menu/examples.ts src/registry/shadcn/navigation-menu/navigation-menu.test.ts src/styles.css tests/e2e/shadcn-overlay-menu-regressions.test.ts
> ```
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/043-implement-base-ui-menu-shadcn-dropdown-menu.md, plans/046-implement-base-ui-context-menu-shadcn-context-menu.md, plans/051-implement-base-ui-shadcn-menubar.md, plans/052-implement-base-ui-shadcn-navigation-menu.md, plans/110-reopen-shadcn-overlay-menu-regressions.md
- **Category**: bug, tech-debt
- **Planned at**: commit `56edd84b`, 2026-07-07

## Why this matters

The menu-family components have been repaired in small pieces, so each example
can pass a narrow regression while the family still feels inconsistent. The
reported current failure is that context menu offset is wrong or inconsistent
and menu item styling varies across dropdown menu, context menu, menubar, and
navigation menu instead of following origin as a coherent system. This plan
turns the scattered fixes into one origin-backed pass with failing parity tests
first, then normalizes the implementation so future menu work has one set of
rules instead of another local patch.

## Current state

- `repos/ui/apps/v4/styles/base-nova/ui/dropdown-menu.tsx` is the origin
  reference for shadcn dropdown menu styling. Its top-level content defaults to
  `align="start"`, `alignOffset=0`, `side="bottom"`, `sideOffset=4`, and uses
  the `isolate z-50 outline-none` positioner plus the `cn-menu-target
  cn-menu-translucent ... min-w-32 ... p-1 ... shadow-md ring-1
  ring-foreground/10` content shell at lines 21-50. Items use
  `gap-1.5 rounded-md px-1.5 py-1 text-sm`, left icon sizing, disabled state,
  destructive state, and `data-inset:pl-7` at lines 79-99. Subcontent defaults
  to `alignOffset=-3`, `side="right"`, `sideOffset=0`, `min-w-[96px]`, and
  `shadow-lg` at lines 130-150. Checkbox indicators are right-aligned at lines
  154-180.
- `repos/ui/apps/v4/styles/base-nova/ui/context-menu.tsx` is the origin
  reference for shadcn context menu styling and context positioning. Its
  content defaults to `align="start"`, `alignOffset=4`, `side="right"`, and
  `sideOffset=0` at lines 32-52. Its content, item, subtrigger, separator,
  shortcut, and checked-item classes mirror the dropdown-menu family at lines
  54-180.
- `repos/ui/apps/v4/styles/base-nova/ui/menubar.tsx` is the origin reference
  for shadcn menubar. The root is `flex h-8 items-center gap-0.5 rounded-lg
  border p-[3px]` at lines 25-35. Menubar content defaults to `align="start"`,
  `alignOffset=-4`, `sideOffset=8`, and a `min-w-36 ... p-1 ... shadow-md
  ring-1` shell at lines 70-89. Menubar trigger styling is compact and not
  evenly distributed at lines 54-67.
- Origin menubar checked and radio items put indicators in a left slot
  (`pl-7`, `left-1.5`) at `repos/ui/apps/v4/styles/base-nova/ui/menubar.tsx`
  lines 112-170. The local product direction from recent QA is different:
  menu-family checked indicators should be in the right slot when checked, and
  rows with left icons should reserve the left icon column consistently. Treat
  origin as the reference for spacing, states, widths, offsets, shadows, and
  interaction; treat this right-check rule as an explicit local deviation that
  must be applied uniformly and tested.
- Local shadcn context menu currently matches several origin strings, but it is
  only hand-copied in one wrapper. The content, item, subtrigger, checked-item,
  indicator, separator, and shortcut class helpers live at
  `src/registry/shadcn/context-menu/index.ts:116-202`. The wrapper passes the
  origin-like placement defaults at `src/registry/shadcn/context-menu/index.ts:508-513`.
- Local shadcn menubar has already accumulated special-case fixes: the root adds
  `data-[has-submenu-open]:relative data-[has-submenu-open]:z-50` at
  `src/registry/shadcn/menubar/index.ts:140-141`; each menu wrapper gets
  `relative` via `menubarMenuClassName` at lines 178-181; open menu wrappers
  get `zIndex: 40` and closed triggers get `zIndex: 50` at lines 406-419. Keep
  the repeated hover handoff behavior these fixes protect unless a better
  tested equivalent replaces them.
- Local base menu positioning is shared and CSS-anchor based. Placement data
  attributes put root popup offsets on `config.sideOffset ?? defaultSideOffset`
  and submenu `alignOffset=-3` at `src/registry/base-ui/menu/index.ts:537-566`.
  The positioner sets `position: absolute`, `positionAnchor`, `inset: auto`,
  and `placementStyle(...)` at lines 709-729. Submenu `sideOffset` is `4` in
  `placementStyle` even though the data attribute reports `0` for submenus
  (`src/registry/base-ui/menu/index.ts:602-607` versus lines 545-548). Reconcile
  the DOM data and visual position so tests can rely on one truth.
- Local base context menu overrides only the top-level positioner to a fixed
  `left/top` context point at `src/registry/base-ui/context-menu/index.ts:283-307`;
  submenu popups still use the generic menu positioning at lines 401-414. This
  split is a likely source of context-menu offset drift, especially inside the
  docs preview container.
- Local base menubar currently defaults to `sideOffset=4` and `alignOffset=0`
  at `src/registry/base-ui/menubar/index.ts:128-131`, then passes those into the
  underlying menu options at lines 175-194. The shadcn menubar wrapper must
  override to origin defaults (`sideOffset=8`, `alignOffset=-4`) where origin
  expects them, and base menubar tests must prove its own defaults remain
  deliberate.
- The docs preview still has broad CSS overrides for overlay surfaces. It
  assigns white shadcn preview tokens to many content slots at
  `src/styles.css:707-726`, duplicates generic menu-like surface shadows at
  lines 728-743, then forces menubar content to `position: absolute`, `top: 0`,
  `left: 0` at lines 787-800 and does the same for dropdown, context menu,
  navigation menu, and other content slots at lines 802-823. These rules may be
  necessary for clipped preview cards, but they are also exactly the kind of
  global override that can hide or create offset bugs. Tighten them only when a
  failing test proves they are involved.
- `tests/e2e/shadcn-overlay-menu-regressions.test.ts` already contains useful
  guards for dropdown, context menu, menubar, navigation menu, hover card,
  tooltip, and popover. The menu-family test starts at line 64. It checks
  dropdown basic behavior at lines 69-191, context menu viewport bounds and
  dismissal at lines 192-221, menubar positioning and hover handoff at lines
  222-434, and navigation-menu dismissal at lines 448-455. It does not yet
  encode a comprehensive menu-family parity matrix, context-menu click-to-menu
  offset tolerance, or consistent item slot alignment across dropdown,
  context-menu, and menubar.

Repo conventions that apply:

- Keep `repos/ui/` and `repos/foldkit/` read-only. Do not import from origin
  repositories in installable source; translate behavior into local Foldkit
  code.
- Keep runtime source idiomatic Foldkit: model fields are Schema-backed,
  messages are facts, updates are pure, effects remain in commands, and views
  bind `const h = html<Message>()` inside the view function.
- Do not reintroduce `shadcn/toast`; it was intentionally removed from the
  public shadcn registry surface by Plan 112.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Drift check | `git diff --stat 56edd84b..HEAD -- src/registry/base-ui/menu/index.ts src/registry/base-ui/context-menu/index.ts src/registry/base-ui/menubar/index.ts src/registry/base-ui/navigation-menu/index.ts src/registry/shadcn/dropdown-menu/index.ts src/registry/shadcn/dropdown-menu/examples.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/index.ts src/registry/shadcn/context-menu/examples.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/index.ts src/registry/shadcn/menubar/examples.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/navigation-menu/index.ts src/registry/shadcn/navigation-menu/examples.ts src/registry/shadcn/navigation-menu/navigation-menu.test.ts src/styles.css tests/e2e/shadcn-overlay-menu-regressions.test.ts` | empty output unless later work intentionally touched these paths |
| Unit/scene tests | `bun run test -- src/registry/base-ui/menu/scene.test.ts src/registry/base-ui/context-menu/scene.test.ts src/registry/base-ui/menubar/scene.test.ts src/registry/base-ui/navigation-menu/scene.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/navigation-menu/navigation-menu.test.ts` | exit 0; all named tests pass |
| Browser regression tests | `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts` | exit 0; the menu-family and related overlay tests pass |
| Typecheck | `bun run typecheck` | exit 0 |
| Lint/format check | `bun run check` | exit 0 |
| Build | `bun run build` | exit 0 |
| Registry guard, only if registry source/example metadata changes | `bun run registry:check` | exit 0; no unexpected generated drift |

## Suggested executor toolkit

- Use the local `$tdd` skill if available. This plan requires red tests before
  source changes.
- Keep the upstream origin files open while editing:
  - `repos/ui/apps/v4/styles/base-nova/ui/dropdown-menu.tsx`
  - `repos/ui/apps/v4/styles/base-nova/ui/context-menu.tsx`
  - `repos/ui/apps/v4/styles/base-nova/ui/menubar.tsx`
  - `repos/ui/apps/v4/styles/base-nova/ui/navigation-menu.tsx`
- Use the existing Playwright helpers in
  `tests/e2e/shadcn-overlay-menu-regressions.test.ts` (`box`,
  `assertSurfaceVisible`, `horizontalOverlap`) instead of inventing a second
  geometry helper style.

## Scope

**In scope** (the only non-plan files you should modify):

- `src/registry/base-ui/menu/index.ts`
- `src/registry/base-ui/context-menu/index.ts`
- `src/registry/base-ui/menubar/index.ts`
- `src/registry/base-ui/navigation-menu/index.ts`
- `src/registry/base-ui/menu/scene.test.ts`
- `src/registry/base-ui/context-menu/scene.test.ts`
- `src/registry/base-ui/menubar/scene.test.ts`
- `src/registry/base-ui/navigation-menu/scene.test.ts`
- `src/registry/shadcn/dropdown-menu/index.ts`
- `src/registry/shadcn/dropdown-menu/examples.ts`
- `src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts`
- `src/registry/shadcn/context-menu/index.ts`
- `src/registry/shadcn/context-menu/examples.ts`
- `src/registry/shadcn/context-menu/context-menu.test.ts`
- `src/registry/shadcn/menubar/index.ts`
- `src/registry/shadcn/menubar/examples.ts`
- `src/registry/shadcn/menubar/menubar.test.ts`
- `src/registry/shadcn/navigation-menu/index.ts`
- `src/registry/shadcn/navigation-menu/examples.ts`
- `src/registry/shadcn/navigation-menu/navigation-menu.test.ts`
- `src/styles.css`, only for docs-preview menu positioning/styling shims
- `tests/e2e/shadcn-overlay-menu-regressions.test.ts`
- `plans/README.md`, only to mark this row done after verification

**Out of scope** (do NOT touch, even though they look related):

- `src/registry/shadcn/popover/*`, `src/registry/shadcn/tooltip/*`,
  `src/registry/shadcn/hover-card/*`, and `src/registry/shadcn/select/*` unless
  a shared CSS rule in `src/styles.css` must be narrowed and the existing tests
  for those components prove no regression.
- Dialog, alert dialog, drawer, sheet, sidebar, table, data table, combobox,
  and input OTP. They have separate plans or completed fixes.
- Public/generated registry artifacts unless `bun run registry:check` fails
  solely because example metadata or registry source changed in this plan.
- Any change to the origin repositories under `repos/`.
- Any new dependency.

## Git workflow

- Branch: `codex/114-normalize-menu-origin-parity`
- Commit message style: conventional commits, for example
  `fix: normalize shadcn menu origin parity`
- Keep the work in one logical commit unless the test-first red harness becomes
  useful as a separate checkpoint.
- Do not push or open a PR unless the operator asks.

## Steps

### Step 1: Add red tests for the menu-family parity matrix

Add tests before source changes. Start with
`tests/e2e/shadcn-overlay-menu-regressions.test.ts`, because the current
complaint is visual and interaction parity in docs examples.

Add or extend the existing menu-family test so it fails on the current checkout
for at least these assertions:

- Context menu root content appears at the context point with an origin-derived
  tolerance. Right-click in `ContextMenuDemo live preview` at two known points:
  one near the upper-left interior of the trigger area and one near the lower
  right but still inside the preview. Assert the top-level
  `[data-slot="context-menu-content"][data-open]` top-left is within the
  expected origin offset range for `side="right"`, `alignOffset=4`,
  `sideOffset=0`, and does not jump to the preview card origin. Also assert it
  remains viewport-bounded.
- Context menu submenu opens adjacent to its trigger with no visual overlap
  beyond an 8 px tolerance and no detached gap larger than 12 px. Use the
  existing `horizontalOverlap` helper as the first assertion, then add a
  distance assertion based on bounding boxes.
- Dropdown menu, context menu, and menubar checked rows share the same local
  right-check policy: the label begins after any left icon slot, and the checked
  indicator is to the right of the label. Include at least one row with a left
  icon and one checked row without a left icon.
- Dropdown menu, context menu, and menubar regular rows reserve the same left
  icon column when any sibling in that menu has a left icon. This is the
  previously reported "icon padding forces text/checks into each other" class
  of bug; the test should compare label x positions within the same popup.
- Menubar root trigger items are not evenly spaced. Assert the gaps between
  File/Edit/View/Profiles are compact and origin-like (for example no gap over
  24 px in the default demo), while preserving the existing border/background
  checks.
- Menubar hover handoff continues to re-open previously opened triggers. The
  existing test already covers File -> Edit -> View -> File; extend it to cycle
  File -> Edit -> View -> File -> View -> Edit so a one-shot handoff cannot pass.

Also add or tighten unit/scene tests where they can catch class drift more
cheaply:

- In `src/registry/shadcn/context-menu/context-menu.test.ts`, assert the default
  content options still resolve to `alignOffset=4`, `sideOffset=0`, and that
  subcontent includes the same content shell plus `shadow-lg`.
- In `src/registry/shadcn/menubar/menubar.test.ts`, assert the wrapper uses the
  origin content offsets (`alignOffset=-4`, `sideOffset=8`) while checked-item
  indicators use the documented local right slot.
- In `src/registry/base-ui/menu/scene.test.ts`, add a test that data attributes
  and actual placement styles agree for submenu offsets. Do not accept
  `data-side-offset="0"` while `placementStyle` visually uses `4px` unless the
  test name and code explicitly document that as the intended distinction.

**Verify**:

```sh
bun run test -- src/registry/base-ui/menu/scene.test.ts src/registry/base-ui/context-menu/scene.test.ts src/registry/base-ui/menubar/scene.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts
bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts
```

Expected before fixes: at least one new assertion fails for the current reported
offset/styling behavior. If every new test passes before any implementation
change, stop and replace the tests with assertions that reproduce the user's
current failures.

### Step 2: Normalize the shared base menu placement contract

Review `src/registry/base-ui/menu/index.ts`,
`src/registry/base-ui/context-menu/index.ts`, and
`src/registry/base-ui/menubar/index.ts` together. The goal is to make the base
placement layer internally consistent before shadcn wrappers add origin-specific
styling.

Implementation constraints:

- Keep CSS-anchor positioning for normal dropdown and submenu popups unless a
  failing test proves a specific browser/docs-preview issue. Do not replace the
  positioning system wholesale.
- Make popup data attributes and visual `placementStyle` agree, or document and
  test a deliberately different semantic. In particular, reconcile the current
  submenu split between `placementAttributes` and `sideOffset`.
- Keep context menus anchored to the captured context point for the top-level
  popup. The context point should be the pointer location for pointer-open and
  the existing keyboard fallback point for keyboard-open.
- Ensure context-menu submenus use the same adjacent submenu placement contract
  as dropdown menu submenus. A context top-level fixed positioner must not cause
  submenu coordinates to resolve relative to the wrong ancestor.
- Keep menubar hover handoff behavior intact. Do not remove the z-index or
  backdrop strategy unless the repeated-handoff Playwright cycle remains green
  and the replacement is simpler.

**Verify**:

```sh
bun run test -- src/registry/base-ui/menu/scene.test.ts src/registry/base-ui/context-menu/scene.test.ts src/registry/base-ui/menubar/scene.test.ts
```

Expected after this step: the base menu/context-menu/menubar scene tests pass,
including the new offset contract tests.

### Step 3: Normalize shadcn menu-family style helpers against origin

Update the shadcn wrappers as a family:

- `src/registry/shadcn/dropdown-menu/index.ts`
- `src/registry/shadcn/context-menu/index.ts`
- `src/registry/shadcn/menubar/index.ts`
- `src/registry/shadcn/navigation-menu/index.ts`, only where its menu-like
  popup/list/link styling is part of the same inconsistency

Use origin Base Nova as the source of truth for:

- Content shells: `cn-menu-target`, `cn-menu-translucent`, `z-50`, max height,
  min width, rounded-lg, bg/text tokens, `p-1`, shadow, `ring-1
  ring-foreground/10`, origin transform/animation classes, and outline state.
- Top-level offsets: dropdown `sideOffset=4`, context menu `alignOffset=4` and
  `sideOffset=0`, menubar `alignOffset=-4` and `sideOffset=8`.
- Subcontent offsets: dropdown and menu-like submenus should match origin's
  adjacent behavior (`alignOffset=-3`, right side, no detached gap).
- Item classes: `relative flex cursor-default items-center gap-1.5 rounded-md
  px-1.5 py-1 text-sm outline-hidden select-none`, icon sizing,
  disabled/destructive states, and `data-inset:pl-7` semantics.
- Labels, separators, shortcuts, and subtriggers.

Apply the local right-check policy uniformly:

- Checkbox/radio indicators in dropdown menu, context menu, and menubar should
  render in the right slot.
- Checked rows need `pr-8` for the right indicator.
- If any sibling item in the same popup uses a left icon, every row's text
  should align to the same label column. Prefer a local `reservesLeadingIconSlot`
  option or an equivalent data attribute already used by the examples over
  ad-hoc per-example padding.
- Do not let left icons, labels, shortcuts, subtrigger chevrons, or right checks
  overlap. The visual order should be: optional left-icon slot, label, flexible
  spacer, optional shortcut/chevron/check slot.

Avoid creating a broad abstraction if it hides origin evidence. A small shared
constant/module is acceptable only if it makes dropdown menu, context menu, and
menubar impossible to drift accidentally and the tests name the intended shared
contract.

**Verify**:

```sh
bun run test -- src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/navigation-menu/navigation-menu.test.ts
```

Expected after this step: the shadcn unit/scene tests pass and include explicit
coverage for offsets, slot classes, indicator placement, and icon-slot label
alignment.

### Step 4: Normalize menu examples so they exercise the shared contract

Review the example data in:

- `src/registry/shadcn/dropdown-menu/examples.ts`
- `src/registry/shadcn/context-menu/examples.ts`
- `src/registry/shadcn/menubar/examples.ts`
- `src/registry/shadcn/navigation-menu/examples.ts`

Make the examples intentionally cover the menu-family contract:

- At least one dropdown menu example with shortcuts, disabled item, checked
  items, left icons, separators, and a nested submenu.
- At least one context menu example with the same row types, including a
  submenu chain that proves context-point anchoring does not break submenu
  placement.
- Menubar examples should match origin widths where applicable (`w-44`,
  `w-64`, etc.) and should not use root width or wrapper classes to create even
  spacing. Triggers should size to content with compact gaps.
- Navigation menu examples should remain dismissible and should not obstruct
  the trigger in ways origin does not.

Do not add visible instructional text to the examples. The examples should show
the behavior by being interactive.

**Verify**:

```sh
bun run test -- src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/navigation-menu/navigation-menu.test.ts
```

Expected after this step: all example registration/smoke tests pass and no
example titles/ids are unintentionally removed.

### Step 5: Tighten preview CSS only where it is proven to cause menu drift

Inspect `src/styles.css:707-823` after the base and shadcn changes. Only edit
these preview overrides if a red Playwright assertion proves the preview CSS is
causing the wrong offset, clipping, or styling.

Allowed changes:

- Narrow selectors so menubar-specific absolute placement rules do not affect
  dropdown, context menu, or navigation menu.
- Remove duplicate shadow/background overrides for menu slots if the shadcn
  wrappers now provide the origin class shell directly and tests still pass.
- Preserve clipping protection inside docs preview cards.
- Preserve the existing non-menu overlay behavior for popover, tooltip,
  hover-card, select, combobox, dialog, drawer, and sheet.

Not allowed:

- Do not add another broad `[data-slot$='content']` positioning rule.
- Do not hide an offset bug by increasing tolerance in tests.
- Do not change page layout or docs sidebar CSS as part of this plan.

**Verify**:

```sh
bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts
```

Expected after this step: context menu, dropdown menu, menubar, navigation menu,
hover card, tooltip, and popover tests in that file all pass.

### Step 6: Run final verification and update the roadmap

Run the full verification set:

```sh
bun run test -- src/registry/base-ui/menu/scene.test.ts src/registry/base-ui/context-menu/scene.test.ts src/registry/base-ui/menubar/scene.test.ts src/registry/base-ui/navigation-menu/scene.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/navigation-menu/navigation-menu.test.ts
bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts
bun run typecheck
bun run check
bun run build
```

If any registry metadata/source/example change requires generated registry
artifacts, run:

```sh
bun run registry:check
```

If `registry:check` reports generated drift from this plan's changes, update the
generated files using the repo's established registry build command, then rerun
`bun run registry:check`. If the drift is unrelated to this plan, stop and
report.

Finally, update the Plan 114 row in `plans/README.md` from `TODO` to `DONE`.

**Verify**:

```sh
git status --short
```

Expected after this step: only in-scope files are modified.

## Test plan

New or tightened tests must cover:

- Context menu top-level positioning from two pointer coordinates inside the
  docs preview, with origin-derived tolerance and viewport bounds.
- Context menu submenu adjacency from a context-point-anchored top-level menu.
- Dropdown menu, context menu, and menubar item slot alignment with mixed icon
  and non-icon rows.
- Dropdown menu, context menu, and menubar checked indicator placement in the
  local right slot.
- Menubar compact trigger spacing, not even distribution.
- Menubar repeated hover handoff cycling through previously opened triggers.
- Class/default tests for origin offsets and content/item/separator/shortcut
  class helpers.

Use these structural patterns:

- Playwright geometry and role assertions from
  `tests/e2e/shadcn-overlay-menu-regressions.test.ts`.
- Shadcn slot/class tests from
  `src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts`,
  `src/registry/shadcn/context-menu/context-menu.test.ts`, and
  `src/registry/shadcn/menubar/menubar.test.ts`.
- Base scene tests from `src/registry/base-ui/menu/scene.test.ts` and
  `src/registry/base-ui/context-menu/scene.test.ts`.

## Done criteria

All must hold:

- [ ] New tests fail on the original `56edd84b` behavior or on the first run
      before source fixes, proving they capture the reported offset/styling
      regression.
- [ ] `bun run test -- src/registry/base-ui/menu/scene.test.ts src/registry/base-ui/context-menu/scene.test.ts src/registry/base-ui/menubar/scene.test.ts src/registry/base-ui/navigation-menu/scene.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/navigation-menu/navigation-menu.test.ts` exits 0.
- [ ] `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts`
      exits 0.
- [ ] `bun run typecheck`, `bun run check`, and `bun run build` exit 0.
- [ ] Dropdown menu, context menu, menubar, and navigation menu use a documented
      shared parity policy for offsets, item slots, checked indicators,
      separators, shortcuts, and submenu placement.
- [ ] Context menu top-level and submenu offsets are consistent in docs preview
      and do not jump to the preview card origin.
- [ ] Menubar triggers are compact, not evenly distributed, and hover handoff
      works repeatedly, including previously opened triggers.
- [ ] `plans/README.md` status row for Plan 114 is updated.
- [ ] No out-of-scope source files are modified.

## STOP conditions

Stop and report back if:

- The code at the locations in "Current state" does not match the excerpts.
- You cannot write a failing test for the current context-menu offset or
  menu-item styling issue before changing source.
- A correct fix appears to require changing unrelated overlays such as popover,
  tooltip, hover card, select, combobox, dialog, drawer, or sheet source.
- Origin Base Nova and the local right-check policy conflict in a way that
  cannot be resolved without changing the public API. Report the exact conflict
  and the files/lines involved.
- The existing repeated menubar hover handoff behavior breaks while fixing
  style or offset parity and cannot be restored without a larger redesign.
- `registry:check` reports generated drift unrelated to files touched by this
  plan.
- Any verification command fails twice after a reasonable fix attempt.

## Maintenance notes

- The reviewer should inspect geometry tests carefully. The goal is not looser
  tolerances; it is a stable origin-derived placement contract.
- Keep a short comment or test name documenting the intentional right-check
  deviation from origin menubar. Future origin-parity work should not "fix" it
  back to left checks unless the product direction changes for the whole menu
  family.
- If this plan uncovers that `src/styles.css` preview overrides are the real
  source of cross-overlay drift, file a follow-up plan to replace the broad
  preview overlay shim with component-owned positioning tokens. Do not widen
  this plan to all overlays.
