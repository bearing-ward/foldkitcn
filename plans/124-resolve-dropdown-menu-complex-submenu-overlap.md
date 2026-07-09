# Plan 124: Resolve DropdownMenuComplex nested submenu overlap

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat f658fa93..HEAD -- tests/e2e/shadcn-overlay-menu-regressions.test.ts`
> If this file changed since the plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as a
> STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/120-audit-complete-shadcn-ui-ux-parity.md
- **Category**: tests
- **Planned at**: commit `f658fa93`, 2026-07-08

## Why this matters

Plan 123 is blocked because the existing DropdownMenuComplex nested submenu
guard fails when it measures the `More Projects` submenu before geometry has
settled: the immediate overlap can report 44px even though local settled
geometry matches origin at about 4px. The correct fix is not to relax the
origin-backed `<= 8px` assertion and not to change menu source. Instead, the
e2e guard should wait for the browser geometry it means to assert, then keep the
strict threshold.

## Current state

- `tests/e2e/shadcn-overlay-menu-regressions.test.ts` has a helper that reads
  element boxes immediately:

```text
// tests/e2e/shadcn-overlay-menu-regressions.test.ts:23
const assertSurfaceVisible = async (surface: Locator): Promise<Box> => {
  await playwrightExpect(surface).toBeVisible()
  return visibleBox(surface)
}
```

- The failing assertion opens `Open Recent`, stores that submenu box, opens the
  nested `More Projects` submenu, immediately reads the second submenu box, and
  compares the overlap once:

```text
// tests/e2e/shadcn-overlay-menu-regressions.test.ts:250
await complexPreview.getByRole('menuitem', { name: 'Open Recent' }).hover()
await playwrightExpect(complexSubmenus).toHaveCount(1)
const openRecentBox = await assertSurfaceVisible(complexSubmenus.first())
playwrightExpect(
  horizontalOverlap(complexMenuBox, openRecentBox),
).toBeLessThanOrEqual(8)

// tests/e2e/shadcn-overlay-menu-regressions.test.ts:259
await complexPreview
  .getByRole('menuitem', { name: 'More Projects' })
  .hover()
await playwrightExpect(complexSubmenus).toHaveCount(2)
const moreProjectsBox = await assertSurfaceVisible(complexSubmenus.nth(1))
playwrightExpect(
  horizontalOverlap(openRecentBox, moreProjectsBox),
).toBeLessThanOrEqual(8)
```

- Live origin evidence from `https://ui.shadcn.com/docs/components/dropdown-menu`
  on 2026-07-08 at a 1440x1000 viewport:

```text
Complex Menu -> Open Recent -> More Projects
root menu box:        x=660 y=520 width=176 height=475
Open Recent submenu: x=832 y=601 width=153 height=153
More Projects menu:  x=981 y=682 width=141 height=64
root-to-first overlap: 4px
first-to-second overlap: 4px
```

- Local probing against `http://127.0.0.1:5174/components/shadcn/dropdown-menu`
  on the current branch showed the same settled geometry:

```text
root menu:              x=584 y=464 width=224 height=320
Open Recent submenu:   x=804 y=524 width=192 height=120
More Projects submenu: x=992 y=584 width=192 height=64
root-to-first overlap: 4px
first-to-second overlap: 4px
```

So the component placement is already origin-like after the submenu settles.

## Commands you will need

| Purpose                   | Command                                                                                                                                | Expected on success                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Focused overlay e2e       | `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts --grep "dropdown, context menu, menubar, and navigation menu"` | exit 0; both submenu overlap assertions still use `<= 8px` |
| Full relevant overlay e2e | `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts`                                                               | exit 0                                                     |
| Typecheck                 | `bun run typecheck`                                                                                                                    | exit 0, no TypeScript errors                               |
| Lint/check scoped file    | `bunx ultracite check tests/e2e/shadcn-overlay-menu-regressions.test.ts`                                                               | exit 0, no format/lint issues                              |

## Scope

**In scope**:

- `tests/e2e/shadcn-overlay-menu-regressions.test.ts`

**Out of scope**:

- `src/registry/base-ui/menu/index.ts`
- `src/registry/base-ui/menu/scene.test.ts`
- `src/registry/shadcn/dropdown-menu/index.ts`
- `src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts`
- Plan 123 helper file `tests/e2e/floating-surface-assertions.ts`
- `tests/e2e/docs.test.ts`
- Navigation Menu source or tests
- `src/styles.css`
- Generated registry/public artifacts under `registry/**` and `public/r/**`

## Git workflow

- Branch: continue from `codex/123-floating-surface-preview-guards`.
- Commit style: conventional commits, for example
  `test: wait for dropdown submenu geometry`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Reproduce the timing-sensitive failure

Run:
`bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts --grep "dropdown, context menu, menubar, and navigation menu"`

Expected before the fix: the test fails at the `More Projects` overlap
assertion with received overlap near `44` and expected `<= 8`.

If the test already passes, stop and report; Plan 123 can probably be resumed.

### Step 2: Add a settled-overlap assertion helper

In `tests/e2e/shadcn-overlay-menu-regressions.test.ts`, add a small local helper
near `horizontalOverlap` that polls live boxes until the overlap is within the
expected threshold. Suggested shape:

```text
const expectHorizontalOverlapAtMost = async (
  first: Locator,
  second: Locator,
  expectedOverlap: number,
): Promise<void> => {
  await playwrightExpect
    .poll(async () => {
      const firstBox = await box(first)
      const secondBox = await box(second)

      return horizontalOverlap(firstBox, secondBox)
    })
    .toBeLessThanOrEqual(expectedOverlap)
}
```

Use this helper for the two DropdownMenuComplex submenu overlap assertions
instead of measuring each overlap once. Keep the expected value `8`; do not
change it to `64` or any other wider tolerance.

Do not add arbitrary sleeps. The point is to wait for the asserted geometry,
not to delay by a guessed duration.

**Verify**:
`bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts --grep "dropdown, context menu, menubar, and navigation menu"`
-> exit 0.

### Step 3: Run the full relevant gates

Run:

- `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts`
- `bun run typecheck`
- `bunx ultracite check tests/e2e/shadcn-overlay-menu-regressions.test.ts`

All commands must exit 0.

## Test plan

- Keep the existing `DropdownMenuComplex` e2e guard at `<= 8px` for both
  root-to-first-submenu and first-to-second-submenu overlap.
- Make the guard poll until submenu geometry settles instead of reading the
  second submenu immediately after hover.
- Do not add screenshot tests; this fix is a browser-geometry assertion
  stabilization.

## Done criteria

All must hold:

- [ ] The `More Projects` submenu overlap guard remains `<= 8px`.
- [ ] The focused overlay e2e grep exits 0.
- [ ] `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts`
      exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] Scoped Ultracite check exits 0.
- [ ] `git status --short` shows no modified files outside
      `tests/e2e/shadcn-overlay-menu-regressions.test.ts` for this plan.

## STOP conditions

Stop and report back if:

- Passing the test requires changing either `<= 8px` overlap expectation.
- The fix requires touching component source under `src/registry/**`.
- The fix requires touching generated registry/public artifacts.
- The fix requires touching Navigation Menu or Plan 123 helper/source files.
- The focused overlay test still fails after replacing the one-shot overlap
  read with a polling settled-geometry assertion.

## Maintenance notes

- This plan intentionally changes only the e2e timing of an origin-backed
  geometry assertion. It does not change the product behavior.
- Future floating-surface geometry assertions should prefer polling around the
  measured browser geometry when the component has open/close animation classes.
