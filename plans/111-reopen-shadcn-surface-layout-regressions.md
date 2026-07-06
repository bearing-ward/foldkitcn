# Plan 111: Reopen shadcn surface layout regressions with exact red tests

> **Executor instructions**: Add failing browser regressions first. These tests
> must reproduce the current user reports for alert-dialog sizing, dialog sticky
> footer/header behavior, drawer and sheet sizing, and sidebar mini-mode layout.
> Then fix the smallest source surface/layout contracts that make those tests
> pass.
>
> **Drift check (run first)**:
> `git diff --stat 0dea03a8..HEAD -- src/main.ts src/live-examples.ts src/scene.test.ts tests/e2e src/registry/shadcn/alert-dialog src/registry/shadcn/dialog src/registry/shadcn/drawer src/registry/shadcn/sheet src/registry/shadcn/sidebar registry/docs/shadcn plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the current
> state notes against live code. On a mismatch, stop and report drift.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MEDIUM
- **Depends on**: Plans 107, 108, 109, and 110
- **Category**: regression tests and visual layout
- **Planned at**: commit `0dea03a8`, 2026-07-06
- **Execution baseline**: Plans 109, 110, and 112 are already applied in the
  current working tree. Treat their form/control fixes, sidebar action-menu
  overlay fix, generated registry updates, and shadcn toast removal as baseline
  work. Do not revert them while fixing this surface/layout layer.
- **Execution note**: Browser red evidence confirmed the drawer top/bottom
  docs-preview height issue and the sidebar/dropdown constrained-layout issue.
  Sheet top/bottom sizing did not produce a distinct red failure after
  reasonable browser attempts, so Sheet source remains unchanged and the final
  test keeps only a neutral visible/inside-preview guard for Sheet.

## Why this matters

The docs examples are now interactive enough to expose layout failures:
`AlertDialogSmall` and media variants are not visually small, the sticky-footer
dialog behaves like it has a sticky header, drawer and sheet top/bottom examples
consume most of the preview, and sidebar mini mode clips footer menus and looks
mis-padded. Existing visual tests mostly assert that panels stay inside the
preview and are shorter than the full preview. That allowed oversized or
misattached surfaces to pass.

This plan adds tighter geometry tests that reflect the user's screenshots and
then fixes class contracts or examples using pinned origin evidence.

## Current state

- `src/registry/shadcn/alert-dialog/index.ts:83-89` gives
  `data-[size=default]` and `data-[size=sm]` the same `max-w-xs` base width.
  The user reports that `AlertDialogSmall` and the media small variant are not
  meaningfully small.
- `src/registry/shadcn/alert-dialog/examples.ts:235-285` defines
  `AlertDialogWithMedia`, `AlertDialogSmall`, and
  `AlertDialogSmallWithMedia`.
- `src/registry/shadcn/dialog/examples.ts:293-333` defines
  `DialogStickyFooter`. The existing browser test at
  `tests/e2e/docs.test.ts:1453-1479` verifies the footer remains visible but
  does not assert that the header scrolls normally or that only the footer is
  sticky.
- `src/registry/shadcn/drawer/index.ts:85-88` allows top/bottom drawer content
  up to `80vh`, while `src/registry/shadcn/drawer/examples.ts:295-311` tries to
  cap side-demo top/bottom panels at `50vh`. The user's screenshot still shows
  top/bottom taking most of the preview.
- `src/registry/shadcn/sheet/index.ts:96-99` sets top/bottom sheet height to
  `h-auto`, and `src/registry/shadcn/sheet/examples.ts:230-247` adds a `50vh`
  cap only in the side demo. The user reports top and bottom still take most
  space.
- `tests/e2e/docs.test.ts:1411-1450` only checks drawer/sheet panels are inside
  the preview and shorter than the preview, which is too weak.
- `src/registry/shadcn/sidebar/index.ts:220-238` defines the icon-collapsed
  width and rail/container padding. The user's screenshots show mini mode
  clipped footer popup, off padding, and constrained menu surfaces.
- `tests/e2e/docs.test.ts:1076-1248` covers some sidebar interactions, but it
  does not assert that mini-mode footer popups escape constrained sidebar
  space, that header controls fit, or that padding matches origin.

## Commands you will need

- Unit/Scene tests:
  `bun run test`
  Expected on success: exit 0.
- Focused browser lane:
  `bunx playwright test tests/e2e --grep "alert dialog|dialog sticky|drawer|sheet|sidebar"`
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
  `tests/e2e/shadcn-surface-layout-regressions.test.ts`
- `src/scene.test.ts` only for state-backed sidebar/layout coverage
- `src/main.ts`
- `src/live-examples.ts`
- `src/registry/shadcn/alert-dialog/**`
- `src/registry/shadcn/dialog/**`
- `src/registry/shadcn/drawer/**`
- `src/registry/shadcn/sheet/**`
- `src/registry/shadcn/sidebar/**`

**Out of scope**:

- Overlay/menu anchoring not specific to sidebar constrained layout; Plan 110
  owns the generic overlay/menu behavior.
- Form controls and table/pagination; Plan 109 owns those.
- Toast removal; Plan 112 owns that.
- Reverting or rewriting Plan 109 form/control fixes, Plan 110 sidebar
  action-menu overlay fixes, or Plan 112 toast-removal artifacts.

## Git workflow

- Branch: `codex/111-reopen-shadcn-surface-layout-regressions`.
- Commit per logical fix group if the operator asks for commits.
- Do not push or open a PR unless explicitly instructed.

## Steps

### Step 1: Add exact failing layout regressions

Add browser tests that assert measurable geometry, not just visibility:

- Alert Dialog:
  - Open `AlertDialogDemo`, `AlertDialogWithMedia`, `AlertDialogSmall`, and
    `AlertDialogSmallWithMedia`.
  - Compare content bounding boxes. Small variants must be measurably smaller
    than default variants in width and/or padding according to pinned origin
    evidence. Media variants must not grow to the default footprint unless
    origin says they should.
  - Assert small content still keeps footer actions visible and not cramped.
- Dialog Sticky Footer:
  - Open `DialogStickyFooter`.
  - Scroll the dialog body.
  - Assert the footer remains visible and has an opaque background.
  - Assert the header/title area is not sticky unless pinned origin evidence
    says it should be. A practical assertion: after scrolling the body, the
    body content changes under the header area while the header does not remain
    fixed over the scrolled content.
- Drawer:
  - Cover `DrawerDemo` and every side in `DrawerWithSides`.
  - Assert top/bottom panels leave a meaningful amount of preview content
    visible. Start with a threshold such as `panel.height <= preview.height *
0.55`, then adjust only if pinned origin evidence requires another value.
  - Assert side panels do not cover the source/code region below the preview.
- Sheet:
  - Cover `SheetDemo` and every side in `SheetSide`.
  - Apply the same top/bottom bounded-height and visible-preview-space
    assertions as drawer.
  - If Sheet top/bottom sizing cannot be reproduced after reasonable browser
    attempts, keep a neutral visible/inside-preview guard instead of changing
    source without red evidence.
- Sidebar mini mode:
  - Collapse `SidebarDemo`, `SidebarFooter`, and `SidebarHeader`.
  - Assert the mini rail has origin-like width and padding, icons are centered,
    labels are visually hidden but accessible, and the footer trigger remains
    visible.
  - Open the footer/user menu in mini mode and assert its bounding box is not
    clipped by the sidebar container.
  - In `SidebarHeader`, assert the workspace select fits within the preview and
    does not collide with the rail boundary.

**Verify red**:

```bash
bunx playwright test tests/e2e --grep "alert dialog|dialog sticky|drawer|sheet|sidebar"
```

Expected before source fixes: exit nonzero, with failures matching the user's
current sizing/clipping reports.

### Step 2: Add focused Scene tests where state matters

Use Scene tests only for state-backed pieces:

- sidebar collapsed state and footer/menu open state
- sidebar selected workspace state if the header select is model-backed
- drawer/sheet open side state if current tests do not cover it

**Verify**:

```bash
bun run test -- src/scene.test.ts src/registry/shadcn/alert-dialog/alert-dialog.test.ts src/registry/shadcn/dialog/dialog.test.ts src/registry/shadcn/drawer/drawer.test.ts src/registry/shadcn/sheet/sheet.test.ts src/registry/shadcn/sidebar/sidebar.scene.test.ts
```

Expected before source fixes: new tests for the reported broken behavior fail
where the failure is representable in Scene.

### Step 3: Fix class contracts and example sizing

Implement small, grounded fixes:

- Alert Dialog:
  - Revisit `alertDialogContentClassName` size tokens so `size="sm"` is a real
    smaller variant.
  - Keep media layout faithful to pinned origin evidence. Do not simply shrink
    everything if origin expects a media-specific grid.
- Dialog:
  - Ensure `DialogStickyFooter` has a sticky footer only. Header/title should
    behave according to origin evidence.
- Drawer and Sheet:
  - Prefer class helper fixes in `index.ts` if top/bottom sizing is globally
    wrong.
  - Prefer example `contentClassName` fixes if only side-demo previews need
    docs-bounded behavior.
  - Keep docs preview containment separate from real installable component
    behavior if origin expects full-viewport overlays outside the docs surface.
- Sidebar:
  - Fix mini-mode width, padding, overflow, and popup container constraints in
    shared Sidebar helpers where possible.
  - If a popup needs to portal within the preview overlay layer, route it
    through the existing local dropdown/menu controller rather than bespoke
    absolute positioning.

**Verify**:

```bash
bunx playwright test tests/e2e --grep "alert dialog|dialog sticky|drawer|sheet|sidebar"
bun run test -- src/scene.test.ts src/registry/shadcn/alert-dialog/alert-dialog.test.ts src/registry/shadcn/dialog/dialog.test.ts src/registry/shadcn/drawer/drawer.test.ts src/registry/shadcn/sheet/sheet.test.ts src/registry/shadcn/sidebar/sidebar.scene.test.ts
```

Expected after fixes: exit 0.

### Step 4: Regenerate artifacts only if needed

If snippets or docs metadata changed, run:

```bash
bun run registry:build
```

Expected: generated artifacts update deterministically.

## Done criteria

- [ ] New browser tests fail before implementation for alert-dialog, dialog,
      drawer, sheet, and sidebar layout issues.
- [ ] AlertDialog small and media variants are measurably distinct from default
      variants in the intended way.
- [ ] Dialog sticky footer has a sticky footer without a misleading sticky
      header.
- [ ] Drawer top/bottom examples no longer consume most of the demo content
      area; Sheet is either similarly fixed from red evidence or explicitly
      documented as non-reproduced with only a neutral guard.
- [ ] Sidebar mini mode keeps icons, header, footer, padding, and popups usable
      and unclipped.
- [ ] `bun run test`, focused Playwright, `bun run typecheck`,
      `bun run registry:check`, and `bun run check` pass.

## STOP conditions

- Pinned origin evidence says an oversized surface is intentional. Stop and
  ask whether docs-preview ergonomics should intentionally deviate from origin.
- A sidebar fix requires hidden global state, cookies, or React context.
- A drawer/sheet docs containment fix would change installable component
  behavior for real app usage in a way origin does not support.
- A layout test can only pass with viewport-specific magic numbers instead of
  ratio-based or origin-backed geometry.

## Maintenance notes

The older visual tests mostly proved surfaces were visible and bounded. This
plan should leave behind stricter geometry assertions so future executors cannot
mark a huge top drawer or clipped sidebar popup as passing.
