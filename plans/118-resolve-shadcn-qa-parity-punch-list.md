# Plan 118: Resolve the shadcn QA parity punch list except chart and toast

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
>
> ```bash
> git diff --stat a59686fb..HEAD -- src/main.ts src/styles.css tests/e2e/docs.test.ts tests/e2e/shadcn-overlay-menu-regressions.test.ts tests/e2e/shadcn-form-collection-regressions.test.ts src/registry/shadcn/hover-card src/registry/shadcn/popover src/registry/shadcn/bubble src/registry/shadcn/pagination src/registry/shadcn/attachment src/registry/shadcn/data-table src/registry/shadcn/sidebar src/registry/shadcn/card src/registry/shadcn/calendar src/registry/shadcn/date-picker src/registry/shadcn/drawer src/registry/shadcn/field src/registry/shadcn/input registry/docs/shadcn public/r
> ```
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/109-reopen-shadcn-form-and-collection-regressions-with-exact-red-tests.md, plans/110-reopen-shadcn-overlay-and-menu-regressions-with-exact-red-tests.md, plans/111-reopen-shadcn-surface-layout-regressions-with-exact-red-tests.md, plans/116-clone-shadcn-style-docs-preview.md
- **Category**: bug
- **Planned at**: commit `a59686fb`, 2026-07-08

## Why this matters

The user performed a QA sweep against origin `https://ui.shadcn.com/docs/components` and found that local `http://localhost:5173/components/shadcn` still has user-visible parity gaps even after earlier regression-hardening plans are marked done. This plan intentionally ignores the `shadcn/chart` and `shadcn/toast` coverage feedback because the operator explicitly excluded those rows. The remaining work is a browser-facing cleanup pass: local examples should fit in their preview containers, overlays should appear on the requested side and remain anchored, controls should render their expected live state, and the final verification should repeat the same user-perspective QA prompt rather than stopping at unit tests.

## Current state

Relevant files:

- `src/styles.css` - docs preview containment and overlay-positioning overrides.
- `src/main.ts` - component docs example-card renderer and live-preview wrapper.
- `tests/e2e/docs.test.ts` - broad docs/user-surface smoke tests; currently has stale `.example-card` selectors and real overlay assertions.
- `tests/e2e/shadcn-overlay-menu-regressions.test.ts` - focused overlay/menu geometry and dismissal tests.
- `tests/e2e/shadcn-form-collection-regressions.test.ts` - focused form, collection, pagination, progress, OTP, and slider tests.
- `src/registry/shadcn/hover-card/examples.ts` and `src/registry/shadcn/hover-card/index.ts` - Hover Card examples and wrapper geometry attributes.
- `src/registry/shadcn/popover/examples.ts` and `src/registry/shadcn/popover/index.ts` - Popover examples and wrapper geometry attributes.
- `src/registry/shadcn/bubble/examples.ts` - Bubble tooltip/popover composition examples.
- `src/registry/shadcn/pagination/examples.ts` and `src/registry/shadcn/pagination/index.ts` - Pagination examples and rows-per-page live preview.
- `src/registry/shadcn/attachment/examples.ts` and `src/registry/shadcn/attachment/index.ts` - Attachment examples and group layout.
- `src/registry/shadcn/data-table/examples.ts` and `src/registry/shadcn/data-table/index.ts` - Data Table examples and dense task-table layout.
- `src/registry/shadcn/sidebar/examples.ts` and `src/registry/shadcn/sidebar/index.ts` - Sidebar examples and constrained preview layout.
- `src/registry/shadcn/card/examples.ts` and `src/registry/shadcn/card/index.ts` - Card examples including the overflowing edge-to-edge example.
- `src/registry/shadcn/calendar/examples.ts`, `src/registry/shadcn/date-picker/examples.ts`, `src/registry/shadcn/drawer/examples.ts`, `src/registry/shadcn/field/examples.ts`, and `src/registry/shadcn/input/examples.ts` - example-content gaps against origin.
- `registry/docs/shadcn/**` and `public/r/**` - generated artifacts that may need refresh if examples or manifests change.

Repo conventions to preserve:

- Foldkit apps use pure `Model`, `Message`, `init`, `update`, and `view`; do not add React or imperative DOM event handlers.
- Use `html<Message>()` inside view/example functions, not at module scope.
- Use `empty` for absent view output and `evo()` for immutable model updates when touching model code.
- Keep origin packages and React as evidence only. ADR 0001 says shadcn namespace items are styled Foldkit wrappers that depend on local registry primitives, and React/upstream packages are not allowed in installable Foldkit runtime source.
- ADR 0002 says site-level shadcn.com visual parity is not a goal, but component previews should render with shadcn/base-nova tokens so examples remain faithful to their registry styling.
- Do not add `shadcn/chart` or `shadcn/toast`; both are out of scope for this plan.

Current excerpts:

`src/styles.css:652-692` defines the preview box and clips everything by default:

```css
.live-example-preview {
  position: relative;
  container-type: inline-size;
  isolation: isolate;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  min-height: 28rem;
  overflow: hidden;
  padding: 1rem;
  transform: translateZ(0);
}
```

`src/styles.css:765-778` currently pins several positioners to the same fixed preview corner:

```css
.live-example-preview [id*='combobox'][id$='positioner'],
.live-example-preview [id*='hover-card'][id$='positioner'],
.live-example-preview [id*='navigation-menu'][id$='positioner'],
.live-example-preview [id*='tooltip'][id$='positioner'] {
  position: absolute !important;
  inset: 4rem auto auto 1rem !important;
  top: 4rem !important;
  left: 1rem !important;
  transform: none !important;
}
```

`src/styles.css:886-909` also forces many manual-popover surfaces to `top: 0; left: 0`, which can defeat side-specific placement:

```css
.live-example-preview
  [data-slot='hover-card-content'][popover='manual'][data-open],
.live-example-preview
  [data-slot='tooltip-content'][popover='manual'][data-open] {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  display: block !important;
  max-height: 20rem;
  overflow: auto;
}
```

`src/main.ts:3618-3638` renders docs example cards as semantic articles with `docs-preview-card`, not `.example-card`:

```ts
const docsPreviewCardView = (
  example: ExampleDocsArtifact,
  maybeLivePreview: Option.Option<Html>,
  copiedSnippets: HashSet.HashSet<string>,
  docsPreviewCodeOpenValues: Readonly<Record<string, boolean>>,
): Html => {
  const h = html<Message>()
  return h.keyed('article')(
    example.id,
    [
      h.Id(exampleAnchorId(example)),
      h.DataAttribute('slot', 'card'),
      h.DataAttribute('docs-slot', 'docs-preview-card'),
      h.Class(docsCardClassName({ className: 'docs-preview-card' })),
    ],
```

`tests/e2e/docs.test.ts:27-30` still looks for `.example-card`, so some failures are harness drift:

```ts
const expectExampleCardsStayInsideMainColumn = async (page: Page) => {
  const mainBox = await page.locator('#main-content').boundingBox()
  const exampleCards = page.locator('.example-card')
  const count = await exampleCards.count()
```

`tests/e2e/docs.test.ts:1821-1825` has the same stale selector for the date-picker card:

```ts
const datePickerPreview = page.getByLabel('DatePickerDemo live preview')
const datePickerCard = page.locator('.example-card', {
  has: datePickerPreview,
})
```

`tests/e2e/shadcn-overlay-menu-regressions.test.ts:762-776` already asserts Hover Card side placement:

```ts
for (const side of ['left', 'top', 'bottom', 'right'] as const) {
  const sideTrigger = hoverSidesPreview.locator(
    `#hover-card-ltr-${side}-trigger`,
  )
  const sideContent = hoverSidesPreview.locator(
    `[data-slot="hover-card-content"][data-side="${side}"]`,
  )

  await sideTrigger.hover()
  await assertSurfaceVisible(sideContent)
  assertHoverCardContentOnSide(
    side,
    await box(sideTrigger),
    await box(sideContent),
  )
}
```

`src/registry/shadcn/hover-card/examples.ts:141-150` creates the side examples, so the fix should make these same examples position correctly rather than changing the test to weaker expectations:

```ts
export const HoverCardSides = <Message = never>(
  controller: HoverCardExampleController<Message> = {},
): Html => {
  const h = html<never>()
  const sides: ReadonlyArray<HoverCardSide> = ['left', 'top', 'bottom', 'right']

  return h.div(
    [h.Class('flex flex-wrap justify-center gap-2')],
    sides.map(side => sideHoverCard(side, side, controller)),
  )
}
```

`tests/e2e/docs.test.ts:1015-1033` captures the current Popover scroll-anchoring expectation:

```ts
const initialOffset = {
  x: Math.round(contentBox.x - triggerBox.x),
  y: Math.round(contentBox.y - triggerBox.y),
}
await page.evaluate(() => {
  window.scrollBy(0, 160)
})
playwrightExpect({
  x: Math.round(scrolledContentBox.x - scrolledTriggerBox.x),
  y: Math.round(scrolledContentBox.y - scrolledTriggerBox.y),
}).toStrictEqual(initialOffset)
```

`tests/e2e/docs.test.ts:1379-1388` expects the Bubble Popover example to render above its trigger:

```ts
const popover = page.getByLabel('BubblePopoverDemo live preview')
const popoverTrigger = popover.getByRole('button', {
  name: 'Show error details',
})
const popoverContent = popover.locator('[data-slot="popover-content"]')

await popoverTrigger.click()
await playwrightExpect(popoverContent).toBeVisible()
await expectElementAbove(popoverContent, popoverTrigger)
```

`src/registry/shadcn/pagination/examples.ts:124-147` renders only a closed static rows-per-page button when no controller is provided:

```ts
const rowsPerPageSelect = <Message>(
  controller?: PaginationExampleController<Message>,
): Html => {
  if (controller === undefined) {
    const h = html<Message>()

    return h.button(
      [
        h.Id('select-rows-per-page'),
        h.Type('button'),
        h.AriaHasPopup('listbox'),
        h.AriaExpanded(false),
        h.DataAttribute('slot', 'select-trigger'),
      ],
      [
        h.span(
          [h.DataAttribute('slot', 'select-value')],
          [h.span([h.DataAttribute('slot', 'select-value')], [])],
        ),
        chevronDownIcon(),
      ],
    )
  }
```

`src/registry/shadcn/pagination/examples.ts:176-208` currently renders controls but no row list or status in `PaginationIconsOnly`:

```ts
export const PaginationIconsOnly = <Message = never>(
  controller?: PaginationExampleController<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('flex items-center justify-between gap-4')],
    [
      Field<Message>({ ... }),
      Pagination<Message>({
        className: 'mx-0 w-auto',
        children: [
          PaginationContent<Message>({
            children: [
              paginationItem([PaginationPrevious<Message>({ href: '#' })]),
              paginationItem([PaginationNext<Message>({ href: '#' })]),
            ],
          }),
        ],
      }),
    ],
  )
}
```

`tests/e2e/shadcn-form-collection-regressions.test.ts:174-210` expects rows-per-page selection to update rows and status:

```ts
await option10.click()
await playwrightExpect(
  preview.locator('[data-slot="pagination-rows"] li'),
).toHaveCount(10)
await playwrightExpect(
  preview.locator('[data-slot="pagination-status"]'),
).toHaveText('Showing 10 of 25 rows')
```

`src/registry/shadcn/attachment/examples.ts:306-333` uses four `w-64` cards inside a `max-w-sm` group, which overflowed the preview in QA:

```ts
export const AttachmentGroupDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto w-full max-w-sm py-12')],
    [
      AttachmentGroup<never>({
        className: 'w-full',
        children: groupEntries.map(entry =>
          attachmentCard(entry, {
            className: 'w-64',
```

`src/registry/shadcn/data-table/examples.ts:1205-1222` marks the task table as card-backed but the rendered table is wider than the preview:

```ts
export const DataTableTasks = <Message = never>(
  controller: DataTableExampleController<Message> = {},
): Html =>
  renderDataTable({
    controller,
    state: stateFor(controller.state, defaultTaskState),
    rows: taskRows,
    columns: taskColumns,
    rowId: taskRowId,
    copy: taskCopy,
    filterColumnId: 'title',
    title: 'Tasks',
    description:
      'A denser task table with badges, title filtering, column toggles, and page-size controls.',
    card: true,
```

`src/registry/shadcn/card/examples.ts:310-330` is the edge-to-edge card example that QA saw extend below the preview:

```ts
export const CardEdgeToEdge = (): Html => {
  const h = html<never>()

  return Card<never>({
    className: 'mx-auto w-full max-w-sm',
    children: [
      CardHeader<never>({ ... }),
      CardContent<never>({
        className: '-mb-(--card-spacing)',
        children: [
          h.div(
            [
              h.Class(
                '-mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed',
```

Known QA findings to fix, excluding `toast` and `chart`:

- Hover Card side placement: `left`, `right`, `top`, and `bottom` cluster in fixed positions instead of honoring the requested side.
- Popover scroll anchoring: the open Popover horizontal offset changed after scroll in the QA pass.
- Bubble Popover example: content appeared below the trigger even though the example/test expects it above.
- Pagination Icons Only: live preview exposed only a `25` button and no `[data-slot="pagination-rows"]` or `[data-slot="pagination-status"]`.
- Attachment group: items overflowed the preview horizontally.
- Data Table tasks: dense task table overflowed the preview horizontally.
- Sidebar examples: some shell/menu examples overflowed preview height instead of being contained or scrollable.
- Card Edge To Edge: text spilled below the preview container.
- Example-content parity gaps: `calendar`, `date-picker`, `drawer`, `field`, and `input` lack several origin examples. Add only examples that can be represented with existing local Foldkit primitives; document any still-impossible examples as accepted deviations instead of adding fake static markup.
- QA harness drift: update stale `.example-card` selectors to the actual semantic docs card selector so e2e failures distinguish real UI defects from selector drift.

## Commands you will need

| Purpose                      | Command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Expected on success                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Dev server                   | `bun run dev -- --host 127.0.0.1 --port 5173`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Vite serves local docs at `http://localhost:5173`                               |
| Focused overlay e2e          | `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts --workers=1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | exit 0, all tests pass                                                          |
| Focused form/collection e2e  | `bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --workers=1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | exit 0, all tests pass                                                          |
| Focused surface/layout e2e   | `bunx playwright test tests/e2e/shadcn-surface-layout-regressions.test.ts --workers=1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | exit 0, all tests pass                                                          |
| Broad docs e2e               | `bunx playwright test tests/e2e/docs.test.ts --workers=1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | exit 0, all tests pass                                                          |
| Component tests              | `bun run test -- src/registry/shadcn/hover-card/hover-card.test.ts src/registry/shadcn/popover/popover.test.ts src/registry/shadcn/bubble/bubble.test.ts src/registry/shadcn/pagination/pagination.test.ts src/registry/shadcn/attachment/attachment.test.ts src/registry/shadcn/data-table/data-table.test.ts src/registry/shadcn/sidebar/sidebar.scene.test.ts src/registry/shadcn/sidebar/sidebar.story.test.ts src/registry/shadcn/card/card.test.ts src/registry/shadcn/calendar/calendar.test.ts src/registry/shadcn/date-picker/date-picker.test.ts src/registry/shadcn/drawer/drawer.test.ts src/registry/shadcn/field/field.test.ts src/registry/shadcn/input/input.test.ts` | exit 0, all named tests pass                                                    |
| Live preview inventory       | `bun run docs:live-preview-gaps`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | still reports only intentional non-live examples; do not increase missing count |
| Registry generated artifacts | `bun run registry:build && bun run registry:check`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | generated artifacts are current, check exits 0                                  |
| Typecheck                    | `bun run typecheck`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | exit 0, no TypeScript errors                                                    |
| Lint/check                   | `bun run check`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | exit 0                                                                          |
| Full tests                   | `bun run test`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | exit 0                                                                          |
| Build                        | `bun run build`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | exit 0                                                                          |
| Diff hygiene                 | `git diff --check -- src tests registry public/r plans`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | exit 0                                                                          |

## Scope

**In scope**:

- `src/styles.css`
- `src/main.ts`
- `tests/e2e/docs.test.ts`
- `tests/e2e/shadcn-overlay-menu-regressions.test.ts`
- `tests/e2e/shadcn-form-collection-regressions.test.ts`
- `tests/e2e/shadcn-surface-layout-regressions.test.ts`
- `src/registry/shadcn/hover-card/**`
- `src/registry/shadcn/popover/**`
- `src/registry/shadcn/bubble/**`
- `src/registry/shadcn/pagination/**`
- `src/registry/shadcn/attachment/**`
- `src/registry/shadcn/data-table/**`
- `src/registry/shadcn/sidebar/**`
- `src/registry/shadcn/card/**`
- `src/registry/shadcn/calendar/**`
- `src/registry/shadcn/date-picker/**`
- `src/registry/shadcn/drawer/**`
- `src/registry/shadcn/field/**`
- `src/registry/shadcn/input/**`
- Generated docs/registry artifacts under `registry/docs/shadcn/**`, `registry/index.json`, and `public/r/**` if and only if produced by `bun run registry:build`.
- `plans/README.md` status row for this plan.

**Out of scope**:

- `shadcn/chart` and all chart foundation work.
- `shadcn/toast`; do not re-add it to the public shadcn surface.
- Base UI primitive rewrites unless an existing shadcn wrapper cannot be fixed without a narrowly scoped Base UI bug fix. If that happens, STOP and report before editing Base UI.
- React, Radix, upstream Base UI React, Embla, TanStack Table, DayPicker, date-fns, or other runtime dependency additions.
- Site-level visual redesign of the Foldkit CN docs shell.
- Broad refactors of the docs renderer or registry schema.

## Git workflow

- Branch: `codex/118-resolve-shadcn-qa-parity-punch-list`.
- Commit in logical units: test harness repair, overlay positioning, collection/layout fixes, example-content parity, final generated artifacts.
- Use conventional commit-style messages already present in this repo, for example `fix: stabilize shadcn docs parity sweep`.
- Do not push or open a PR unless the operator explicitly instructs you to.

## Steps

### Step 1: Repair stale docs e2e selectors without weakening assertions

Update `tests/e2e/docs.test.ts` helpers and call sites that still use `.example-card` so they target the actual docs card contract:

- Prefer `[data-docs-slot="docs-preview-card"]` if available, or `[data-slot="card"][data-docs-slot="docs-preview-card"]`.
- Keep the existing geometry assertions: cards must remain inside `#main-content`, live-ready cards must have `.live-example-preview`, and date-picker panels must fit within their docs card.
- Do not silence failures by allowing zero cards.

If the rendered docs card lacks a stable attribute because the current code emits `data-docs-slot` in a different attribute spelling, inspect the browser DOM and update either the test selector or the renderer consistently. Do not reintroduce the old `.example-card` class just to satisfy tests unless the docs UI still intentionally exposes that class elsewhere.

**Verify**:

```bash
bunx playwright test tests/e2e/docs.test.ts --grep "button docs|item docs|sidebar docs|calendar date picker" --workers=1
```

Expected: selector-related failures are gone. Remaining failures, if any, should be real layout or interaction assertions.

### Step 2: Fix overlay side placement and scroll anchoring at the shared preview layer

Fix the shared docs-preview positioning rules before touching individual examples:

- Revisit `src/styles.css:765-909`. The current CSS hard-pins hover-card, tooltip, popover, select, combobox, and navigation-menu positioners/content to fixed preview coordinates. Replace this with side-aware positioning that respects `data-side`, `data-align`, and trigger-relative placement inside `.live-example-preview`.
- Preserve the reason these rules exist: overlays must stay visible inside docs examples and must not escape the preview container into the page shell.
- Hover Card side examples must pass physical assertions for `left`, `top`, `bottom`, and `right`.
- Popover content must keep the same trigger-relative offset after the page scrolls.
- Bubble Popover must render above its trigger in `BubblePopoverDemo`.
- Tooltips must remain stable across rapid hover cycles.

Prefer fixing common positioning helpers and CSS once. Only alter `src/registry/shadcn/hover-card/index.ts`, `src/registry/shadcn/popover/index.ts`, or `src/registry/shadcn/bubble/examples.ts` if their emitted data attributes or requested side/align values are wrong.

**Verify**:

```bash
bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts --workers=1
bunx playwright test tests/e2e/docs.test.ts --grep "navigation menu and floating overlays|bubble docs expose" --workers=1
```

Expected: both commands exit 0. Hover Card physical side assertions pass; Popover keeps the same offset after scroll; Bubble Popover content is above the trigger; dismissal still works by outside click and Escape.

### Step 3: Restore live pagination rows-per-page behavior

Fix `PaginationIconsOnly` so it is a real live preview, not a static closed button:

- The preview must render `[data-slot="pagination-rows"] li` rows for the current page size.
- The default page size should match origin and current tests: 25.
- Selecting 10 rows per page must render 10 rows and `[data-slot="pagination-status"]` text `Showing 10 of 25 rows`.
- Reopening the page-size select must mark only the active option with `aria-selected="true"` and `data-selected`.
- Keep the Select integration inside Foldkit message/update flow; do not use direct DOM mutation or local imperative state.

Use `tests/e2e/shadcn-form-collection-regressions.test.ts:174-210` as the acceptance contract. If the page-level live-preview controller is not passing `PaginationExampleController` to `PaginationIconsOnly`, fix that wiring instead of making the no-controller fallback pretend to be interactive.

**Verify**:

```bash
bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --grep "pagination docs" --workers=1
bunx playwright test tests/e2e/docs.test.ts --grep "calendar date picker carousel data table pagination table" --workers=1
bun run test -- src/registry/shadcn/pagination/pagination.test.ts
```

Expected: all commands exit 0, and the docs preview exposes both row list and status.

### Step 4: Fix preview containment for attachment, data-table, sidebar, and card examples

Address each containment bug without hiding useful content:

- `AttachmentGroupDemo`: adjust the group/card width and wrapping so every attachment remains within the preview at 1280x900 desktop and at a narrow mobile viewport. Preserve the origin-like grouped attachment content and action affordances.
- `DataTableTasks`: keep the dense task table but make it bounded by its preview. Prefer a local horizontal scroll container or responsive column constraints that are visible and usable, not clipped by the preview.
- Sidebar examples: constrain tall sidebar/menu examples with an internal scroll region or reduced fixture content so the shell remains inside the preview. Do not let dropdown menus or sidebar actions become clipped.
- `CardEdgeToEdge`: keep the edge-to-edge scrollable content intent but ensure the whole card remains inside the preview. Reduce vertical padding/content or contain the scrollable body rather than letting copy spill below the preview.

Add or strengthen browser assertions in `tests/e2e/shadcn-surface-layout-regressions.test.ts` or `tests/e2e/docs.test.ts` so these exact examples cannot regress:

- `AttachmentGroupDemo live preview`
- `DataTableTasks live preview`
- `SidebarDemo live preview`
- `SidebarMenuSub live preview`
- `SidebarRtl live preview`
- `CardEdgeToEdge live preview`

Use geometry helpers like `visibleBox` and `expectBoxInside`; avoid screenshot-only assertions.

**Verify**:

```bash
bunx playwright test tests/e2e/shadcn-surface-layout-regressions.test.ts --workers=1
bunx playwright test tests/e2e/docs.test.ts --grep "sidebar docs|item docs|button docs" --workers=1
bun run test -- src/registry/shadcn/attachment/attachment.test.ts src/registry/shadcn/data-table/data-table.test.ts src/registry/shadcn/sidebar/sidebar.scene.test.ts src/registry/shadcn/card/card.test.ts
```

Expected: all commands exit 0. No preview descendants in the named examples overflow their preview except intentional scrollable content inside an element whose overflow is `auto` or `scroll`.

### Step 5: Close example-content parity gaps where local foundations already exist

Compare origin and local docs for these components, ignoring `chart` and `toast`:

- `calendar`
- `date-picker`
- `drawer`
- `field`
- `input`
- `carousel`

Add live examples for origin examples that can be represented using existing local primitives and state:

- Calendar: range calendar, month/year selector, presets, date/time picker, custom cell size, week numbers, if the current `Calendar` API supports them. If the API cannot honestly support one, document it as an accepted deviation in the relevant `registry-src/shadcn/<component>/item.json` or docs sidecar rather than adding fake static markup.
- Date Picker: range picker, time picker, natural-language picker, or a documented accepted deviation if native DatePicker support does not exist.
- Drawer: nested, non-modal, snap-points, responsive, or accepted deviations tied to current Foldkit Drawer capabilities.
- Field: select, slider, fieldset, radio, switch, choice card, validation/errors examples using existing local components.
- Input: field, field group, inline, grid, badge, input group, button group, form, RTL examples using existing local components.
- Carousel: options/plugins/loop behavior if supported by the local native carousel model. If loop is still unsupported, add an explicit accepted deviation and a focused test that proves current non-looping behavior is intentional rather than accidental.

For every added example:

- Add it to the component's `examples.ts` export list.
- Ensure it appears in generated docs artifacts after `bun run registry:build`.
- Prefer live examples. Do not increase the `docs:live-preview-gaps` count.
- Keep examples deterministic and self-contained; no network fetches or origin runtime imports.

**Verify**:

```bash
bun run registry:build
bun run docs:live-preview-gaps
bun run registry:check
bun run test -- src/registry/shadcn/calendar/calendar.test.ts src/registry/shadcn/date-picker/date-picker.test.ts src/registry/shadcn/drawer/drawer.test.ts src/registry/shadcn/field/field.test.ts src/registry/shadcn/input/input.test.ts src/registry/shadcn/carousel/story.test.ts src/registry/shadcn/carousel/scene.test.ts
```

Expected: generated artifacts are current, registry check exits 0, and the live preview gap count does not increase. If an example is documented as an accepted deviation, the docs must state why the local Foldkit implementation intentionally differs from origin.

### Step 6: Run the full automated gate suite

Run the focused and broad gates after all fixes and artifact refreshes:

```bash
bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts --workers=1
bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --workers=1
bunx playwright test tests/e2e/shadcn-surface-layout-regressions.test.ts --workers=1
bunx playwright test tests/e2e/docs.test.ts --workers=1
bun run typecheck
bun run check
bun run test
bun run build
git diff --check -- src tests registry public/r plans
```

Expected: all commands exit 0. If Playwright starts a preview server on port 4173, run these commands sequentially with `--workers=1`; do not run multiple Playwright invocations in parallel.

### Step 7: Repeat the user-perspective QA prompt

After automated gates pass, perform a second QA sweep from the user perspective:

1. Start local docs:

   ```bash
   bun run dev -- --host 127.0.0.1 --port 5173
   ```

2. In a real browser or Playwright-controlled Chromium, compare origin `https://ui.shadcn.com/docs/components` against local `http://localhost:5173/components/shadcn`.
3. Ignore only `chart` and `toast`.
4. Recheck the exact original punch-list areas:
   - menu display, position, hover interactivity, and dismissal
   - content fitting inside preview containers
   - carousel behavior, including whether loop support is implemented or explicitly documented as a deviation
   - checkbox/data-table header select-all on and off behavior
   - transitions on overlay/menu/tooltip/popover surfaces
   - dropdown direction and sizing
   - hover-card side positioning
   - input group styling
   - navigation-menu placement and dismissal
   - popover markup/position stability
   - progress controlled input
   - scroll-area custom/native indicator behavior
   - slider interaction
   - tooltip stability/jerkiness
5. Record the result in the implementation summary. If any non-chart/non-toast disparity remains, either fix it within this plan's scope or mark the plan BLOCKED with the exact component, local URL, origin URL, viewport, and reproduction steps.

**Verify**:

The final implementation report must include:

- Components checked.
- Remaining accepted deviations, if any.
- Confirmation that `chart` and `toast` were intentionally ignored.
- Browser/viewport used for the user-perspective pass.
- A statement that no non-chart/non-toast punch-list item remains unresolved, or the exact unresolved blockers.

## Test plan

Add or update tests before or alongside fixes:

- `tests/e2e/docs.test.ts`: update stale docs-card selectors; keep broad user-path checks for popover anchoring, Bubble Popover placement, date-picker containment, carousel interaction, data-table interaction, pagination rows/status, and table actions.
- `tests/e2e/shadcn-overlay-menu-regressions.test.ts`: keep Hover Card physical side assertions and add any missing Popover/Bubble geometry assertions if not covered by `docs.test.ts`.
- `tests/e2e/shadcn-form-collection-regressions.test.ts`: keep Pagination Icons Only rows/status and active-option assertions.
- `tests/e2e/shadcn-surface-layout-regressions.test.ts`: add explicit geometry checks for attachment group, data-table tasks, sidebar menu-sub, sidebar RTL, and Card Edge To Edge containment if they are not already covered.
- Component tests: update the relevant `src/registry/shadcn/*/*.test.ts`, scene, or story tests only when source behavior changes at the component/model level.

Verification:

```bash
bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts --workers=1
bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --workers=1
bunx playwright test tests/e2e/shadcn-surface-layout-regressions.test.ts --workers=1
bunx playwright test tests/e2e/docs.test.ts --workers=1
bun run test
```

Expected: all pass.

## Done criteria

All must hold:

- [ ] No source or docs change adds `shadcn/chart` or `shadcn/toast` back into scope.
- [ ] `tests/e2e/docs.test.ts` no longer depends on `.example-card` for current docs cards.
- [ ] Hover Card left/top/bottom/right examples render on the requested physical side.
- [ ] Popover content remains trigger-anchored after page scroll.
- [ ] Bubble Popover content renders above its trigger and dismisses by outside click and Escape.
- [ ] `PaginationIconsOnly` renders `[data-slot="pagination-rows"] li`, updates to 10 rows, and shows `Showing 10 of 25 rows`.
- [ ] Attachment group, DataTableTasks, sidebar examples, and CardEdgeToEdge fit inside their preview containers or expose intentional internal scroll regions.
- [ ] Example-content gaps for calendar, date-picker, drawer, field, input, and carousel are either filled with live local examples or documented as accepted deviations tied to current Foldkit constraints.
- [ ] `bun run docs:live-preview-gaps` does not regress.
- [ ] `bun run registry:build && bun run registry:check` exits 0.
- [ ] `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts --workers=1` exits 0.
- [ ] `bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --workers=1` exits 0.
- [ ] `bunx playwright test tests/e2e/shadcn-surface-layout-regressions.test.ts --workers=1` exits 0.
- [ ] `bunx playwright test tests/e2e/docs.test.ts --workers=1` exits 0.
- [ ] `bun run typecheck`, `bun run check`, `bun run test`, and `bun run build` exit 0.
- [ ] A second user-perspective origin-vs-local QA pass is completed and reported.
- [ ] `git diff --check -- src tests registry public/r plans` exits 0.
- [ ] `plans/README.md` row 118 is updated from TODO to DONE or BLOCKED.

## STOP conditions

Stop and report back if:

- Fixing a finding requires adding React, Radix, upstream Base UI React, Embla, TanStack Table, DayPicker, date-fns, or another new runtime dependency.
- The change appears to require implementing `shadcn/chart` or re-adding `shadcn/toast`.
- The local component API cannot represent an origin example without fake non-interactive markup and there is no appropriate accepted-deviation field or docs sidecar to record the limitation.
- A required fix appears to need broad Base UI primitive rewrites outside the shadcn wrapper/example scope.
- Any focused Playwright command fails twice after a reasonable fix attempt.
- `bun run registry:build` produces unrelated generated artifact churn outside the shadcn/docs rows touched by this plan.
- The user-perspective QA pass finds a new component family outside this plan's listed scope that needs nontrivial remediation.

## Maintenance notes

- The docs preview CSS is a shared dependency for almost every overlay and scrollable example. Review CSS changes carefully for regressions in dropdown menu, context menu, menubar, select, combobox, tooltip, and navigation-menu examples.
- Keep the tests user-facing. A passing model/story test is not enough if the rendered docs example still clips, jumps, or opens in the wrong direction.
- Accepted deviations should be scarce and explicit. Use them only when the local Foldkit architecture intentionally lacks an origin capability, not to excuse a broken example.
- Future QA sweeps should start from the rendered docs route, not generated artifact counts alone.
