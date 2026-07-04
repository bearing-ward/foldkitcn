# Plan 102: Restore the current Vitest suite to green

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat 5597e535..HEAD -- tests/parity/canonicalize.test.ts tests/parity/parity-dry-run.test.ts tests/parity/slots.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts src/registry/shadcn/dropdown-menu/examples.ts src/registry/shadcn/context-menu/examples.ts src/registry/shadcn/menubar/examples.ts plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `5597e535`, 2026-07-04

## Why this matters

`bun run test` currently exits 1 on `main`, so the repo has lost its basic
regression signal. The failures are narrow and appear to be test drift after
recent shadcn rows landed and after menu example views gained optional
controller arguments. This plan restores the suite by updating stale test
expectations and by making static example smoke tests call example views without
accidentally passing the Scene model as a controller.

## Current state

- `package.json` defines the relevant gates:

```json
// package.json:4-15
"scripts": {
  "dev": "vite",
  "devtools-mcp": "foldkit-devtools-mcp",
  "build": "vite build",
  "preview": "vite preview",
  "docs:prerender": "bun run scripts/prerender.ts",
  "docs:live-preview-gaps": "bun run scripts/report-docs-live-preview-gaps.ts",
  "docs:search": "pagefind",
  "typecheck": "tsc --noEmit",
  "format": "oxfmt --write .",
  "test": "vitest run",
  "lint": "oxlint",
  "check": "ultracite check --disable-nested-config",
```

- `vitest.config.ts` runs tests in `happy-dom` and excludes `tests/e2e`, so the
  fix should not require a browser server:

```ts
// vitest.config.ts:3-13
export default defineConfig({
  test: {
    environment: 'happy-dom',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/repos/**',
      '**/tests/e2e/**',
    ],
    setupFiles: ['./src/vitest-setup.ts'],
```

- The focused current failure command is:

```bash
bun run test -- tests/parity/canonicalize.test.ts tests/parity/parity-dry-run.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts
```

It currently reports `5 failed (5)` test files and `10 failed | 44 passed`.

- `tests/parity/slots.ts` now contains four ready shadcn slots that the expected
  arrays in the parity tests do not include:

```ts
// tests/parity/slots.ts:108-142
{
  itemId: 'shadcn/sonner',
  status: 'ready',
  originFixtureEntrypoint: 'tests/parity/fixtures/origin/shadcn/entry.tsx',
  foldkitFixtureEntrypoint: 'tests/parity/fixtures/foldkit/shadcn/entry.ts',
  comparisons: [
    'class-tokens',
    'attributes',
    'dom-structure',
    'computed-style',
    'colors',
    'dimensions',
    'bounding-box',
    'keyboard-behavior',
  ],
},
{
  itemId: 'shadcn/sidebar',
  status: 'ready',
```

```ts
// tests/parity/slots.ts:141-153
{
  itemId: 'shadcn/marker',
  status: 'ready',
  originFixtureEntrypoint: 'tests/parity/fixtures/origin/shadcn/entry.tsx',
  foldkitFixtureEntrypoint: 'tests/parity/fixtures/foldkit/shadcn/entry.ts',
  comparisons: [
    'class-tokens',
    'attributes',
    'dom-structure',
    'computed-style',
    'colors',
    'dimensions',
    'bounding-box',
  ],
},
```

```ts
// tests/parity/slots.ts:357-369
{
  itemId: 'shadcn/message',
  status: 'ready',
  originFixtureEntrypoint: 'tests/parity/fixtures/origin/shadcn/entry.tsx',
  foldkitFixtureEntrypoint: 'tests/parity/fixtures/foldkit/shadcn/entry.ts',
  comparisons: ['class-tokens', 'attributes', 'dom-structure'],
},
{
  itemId: 'shadcn/message-scroller',
  status: 'ready',
  originFixtureEntrypoint: 'tests/parity/fixtures/origin/shadcn/entry.tsx',
```

- `tests/parity/canonicalize.test.ts` hard-codes the ready slot order but is
  missing those four IDs:

```ts
// tests/parity/canonicalize.test.ts:100-120
test('discovers ready registry parity slots', () => {
  expect(paritySlots.map(slot => slot.itemId)).toStrictEqual([
    'shadcn/aspect-ratio',
    'base-ui/button',
    'base-ui/toggle',
    'base-ui/toggle-group',
    'base-ui/toolbar',
    'base-ui/toast',
    'shadcn/sonner',
    'base-ui/avatar',
    'base-ui/progress',
    'base-ui/meter',
    'base-ui/fieldset',
    'base-ui/slider',
    'base-ui/scroll-area',
    'base-ui/number-field',
    'base-ui/field',
    'base-ui/form',
    'shadcn/alert',
    'shadcn/attachment',
    'shadcn/bubble',
```

- `tests/parity/parity-dry-run.test.ts` has two shadcn namespace expected arrays
  that also need those same four shadcn IDs inserted:

```ts
// tests/parity/parity-dry-run.test.ts:19-27
test('matches all shadcn slots with namespace grep', () => {
  expect(matchingItemIds('shadcn')).toStrictEqual([
    'shadcn/aspect-ratio',
    'shadcn/sonner',
    'shadcn/alert',
    'shadcn/attachment',
    'shadcn/bubble',
    'shadcn/avatar',
```

```ts
// tests/parity/parity-dry-run.test.ts:78-86
expect(matchingItemIds('shadcn/')).toStrictEqual([
  'shadcn/aspect-ratio',
  'shadcn/sonner',
  'shadcn/alert',
  'shadcn/attachment',
  'shadcn/bubble',
  'shadcn/avatar',
```

- The menu example view arrays store functions such as `DropdownMenuBasic`,
  `ContextMenuDemo`, and `MenubarDemo`. Each function accepts an optional
  controller argument:

```ts
// src/registry/shadcn/dropdown-menu/examples.ts:21-28
export type DropdownMenuExampleController<Message> = Readonly<{
  isOpenFor: (menuId: string, defaultOpen: boolean) => boolean
  openSubmenuValuesFor: (
    menuId: string,
    defaultValues: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  onOpenChange: (menuId: string, change: DropdownMenu.MenuOpenChange) => Message
}>
```

```ts
// src/registry/shadcn/context-menu/examples.ts:22-39
export type ContextMenuExampleController<Message> = Readonly<{
  contextPointFor: (
    menuId: string,
  ) => Option.Option<ContextMenu.ContextMenuPoint>
  isOpenFor: (menuId: string, defaultOpen: boolean) => boolean
  openSubmenuValuesFor: (
    menuId: string,
    defaultValues: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  onContextPointChange: (
    menuId: string,
    point: ContextMenu.ContextMenuPoint,
  ) => Message
  onOpenChange: (
    menuId: string,
    change: ContextMenu.ContextMenuOpenChange,
  ) => Message
}>
```

```ts
// src/registry/shadcn/menubar/examples.ts:24-42
export type MenubarExampleController<Message> = Readonly<{
  openMenuValueFor: (
    menubarId: string,
    defaultValue: string | undefined,
  ) => string | undefined
  openSubmenuValuesFor: (
    menubarId: string,
    menuValue: string,
    defaultValues: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  onMenuOpenChange: (
    menubarId: string,
    change: Menubar.MenubarMenuOpenChange,
  ) => Message
  onOpenMenuValueChange: (
```

- The failing smoke tests pass these zero-argument example functions directly to
  `Scene.scene` as a Foldkit view. `Scene.scene` invokes the view with the
  model. That means the empty model object is received as the optional
  controller, causing errors like `controller?.isOpenFor is not a function` and
  `controller?.openMenuValueFor is not a function`.

```ts
// src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts:315-326
test('renders every exported registry example without throwing', () => {
  expect(() => {
    for (const example of dropdownMenuExampleViews) {
      Scene.scene(
        { update, view: example.view },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu"]'),
        ).toBeVisible(),
      )
    }
  }).not.toThrow()
})
```

```ts
// src/registry/shadcn/context-menu/context-menu.test.ts:333-344
test('renders every exported registry example without throwing', () => {
  expect(() => {
    for (const example of contextMenuExampleViews) {
      Scene.scene(
        { update, view: example.view },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="context-menu"]'),
        ).toBeVisible(),
      )
    }
  }).not.toThrow()
})
```

```ts
// src/registry/shadcn/menubar/menubar.test.ts:319-328
test('renders every exported registry example without throwing', () => {
  expect(() => {
    for (const example of menubarExampleViews) {
      Scene.scene(
        { update, view: example.view },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="menubar"]')).toBeVisible(),
      )
    }
  }).not.toThrow()
})
```

- The project conventions that matter here:
  - This is a Foldkit and Effect project. Keep Foldkit views as pure functions
    and do not add browser runtime requirements to unit tests.
  - `docs/decisions/0001-foldkit-registry-architecture.md:39-43` says parity
    compares local pinned-origin fixtures against local Foldkit implementations
    and React is allowed only in origin fixture infrastructure.
  - `docs/decisions/0002-foldkit-cn-documentation-site.md:44-49` says component
    preview styling is separate from the docs shell and component parity remains
    scoped to origin component fixtures.

## Commands you will need

| Purpose                  | Command                                                                                                                                                                                                                                           | Expected on success               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Focused current failures | `bun run test -- tests/parity/canonicalize.test.ts tests/parity/parity-dry-run.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts` | exit 0; all 54 focused tests pass |
| Full unit suite          | `bun run test`                                                                                                                                                                                                                                    | exit 0; all Vitest files pass     |
| Typecheck                | `bun run typecheck`                                                                                                                                                                                                                               | exit 0; no TypeScript errors      |
| Registry validation      | `bun run registry:check`                                                                                                                                                                                                                          | exit 0                            |
| Lint/format check        | `bun run check`                                                                                                                                                                                                                                   | exit 0                            |

## Scope

**In scope**:

- `tests/parity/canonicalize.test.ts`
- `tests/parity/parity-dry-run.test.ts`
- `src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts`
- `src/registry/shadcn/context-menu/context-menu.test.ts`
- `src/registry/shadcn/menubar/menubar.test.ts`
- `plans/README.md`

**Out of scope**:

- `tests/parity/slots.ts` — this file already contains the ready slots; do not
  remove or reorder slots to satisfy stale expectations.
- `src/registry/shadcn/*/examples.ts` — the example APIs are valid; the tests
  are calling them with the wrong shape.
- `src/registry/shadcn/*/index.ts` runtime source.
- Any new dev-server requirement for Vitest.
- Any changes under `repos/`; vendored repos are read-only reference.

## Git workflow

- Branch: `codex/102-fix-current-vitest-regressions`
- Commit message style from recent history is conventional commits, for example
  `fix: address data-table review feedback`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Confirm the focused failures still match this plan

Run:

```bash
bun run test -- tests/parity/canonicalize.test.ts tests/parity/parity-dry-run.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts
```

Expected before editing: exit 1 with exactly these five failing files:

- `tests/parity/canonicalize.test.ts`
- `tests/parity/parity-dry-run.test.ts`
- `src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts`
- `src/registry/shadcn/context-menu/context-menu.test.ts`
- `src/registry/shadcn/menubar/menubar.test.ts`

If additional focused failures appear, stop and report drift.

### Step 2: Update the stale parity expected arrays

In `tests/parity/canonicalize.test.ts`, update the expected array in
`discovers ready registry parity slots` to match `paritySlots.map(slot =>
slot.itemId)`. Insert:

- `'shadcn/sidebar'`
- `'shadcn/marker'`

immediately after `'shadcn/sonner'`, and insert:

- `'shadcn/message'`
- `'shadcn/message-scroller'`

immediately after `'shadcn/bubble'`.

In `tests/parity/parity-dry-run.test.ts`, apply the same shadcn insertions to
both namespace-grep expected arrays: `matchingItemIds('shadcn')` and
`matchingItemIds('shadcn/')`.

Do not weaken these tests to compare against themselves. The explicit order is
the useful regression signal.

**Verify**:

```bash
bun run test -- tests/parity/canonicalize.test.ts tests/parity/parity-dry-run.test.ts
```

Expected: exit 0.

### Step 3: Wrap static menu example views before giving them to Scene

In each of the three menu test files, add a tiny local helper near
`requireExampleView`:

```ts
const staticExampleView =
  (view: ExampleView) =>
  (_model: Model): Html =>
    view()
```

Then change every `Scene.scene` call that currently passes an exported example
view directly so it passes the wrapped view instead:

```ts
// Before
{ update, view: example.view }

// After
{ update, view: staticExampleView(example.view) }
```

Also wrap `requireExampleView(...)` results:

```ts
// Before
{ update, view: requireExampleView(viewById, id) }

// After
{ update, view: staticExampleView(requireExampleView(viewById, id)) }
```

Apply this in:

- `src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts`
- `src/registry/shadcn/context-menu/context-menu.test.ts`
- `src/registry/shadcn/menubar/menubar.test.ts`

Leave calls that already use an explicit zero-argument wrapper alone, such as
`view: () => DropdownMenuBasic()` and `view: () => MenubarDemo()`.

Do not add fake controller objects unless a test is intentionally exercising
controlled behavior. These smoke tests are checking the static exported example
surfaces; the correct fix is to call the examples without a controller.

**Verify**:

```bash
bun run test -- src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts
```

Expected: exit 0.

### Step 4: Run the focused current-failure gate

Run:

```bash
bun run test -- tests/parity/canonicalize.test.ts tests/parity/parity-dry-run.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts
```

Expected: exit 0; all 54 focused tests pass.

### Step 5: Run the full verification gates

Run:

```bash
bun run test
bun run typecheck
bun run registry:check
bun run check
```

Expected: every command exits 0.

During the advisor run, `bun run test` emitted a transient-looking
`ECONNREFUSED` for `localhost:3000`, but the focused failing command did not.
A repository search found no test-local `localhost:3000` call outside
`scripts/prerender.ts`. If the assertion failures are fixed and the full suite
still exits nonzero only because of a `localhost:3000` connection attempt, stop
and report that as a separate failure with the test file or import path that
triggers it. Do not start a dev server or add a server dependency to Vitest
unless you can prove the current unit suite intentionally requires it.

## Test plan

- No new test files are needed.
- Update existing parity expectation tests so they cover the four newly ready
  shadcn parity slots.
- Update existing menu example smoke tests so the exported example views are
  tested as zero-argument static examples instead of being called with the Scene
  model as a controller.
- The required regression command is:

```bash
bun run test -- tests/parity/canonicalize.test.ts tests/parity/parity-dry-run.test.ts src/registry/shadcn/dropdown-menu/dropdown-menu.test.ts src/registry/shadcn/context-menu/context-menu.test.ts src/registry/shadcn/menubar/menubar.test.ts
```

Expected: exit 0.

## Done criteria

All must hold:

- [ ] The focused current-failure Vitest command exits 0.
- [ ] `bun run test` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run registry:check` exits 0.
- [ ] `bun run check` exits 0.
- [ ] `git diff --name-only` shows only the in-scope test files plus
      `plans/README.md` if the executor updates plan status.
- [ ] `plans/README.md` status row for Plan 102 is updated if the executor owns
      index maintenance.

## STOP conditions

Stop and report back without improvising if:

- The focused failure command no longer matches the five files and ten failures
  listed in this plan.
- Fixing the menu test failures appears to require editing
  `src/registry/shadcn/*/examples.ts` or runtime component source.
- A parity test fails because the order or contents of `tests/parity/slots.ts`
  changed after this plan was written.
- The full suite still fails only because of a `localhost:3000` connection
  attempt after the focused failures pass.
- Any verification command fails twice after a reasonable fix attempt.

## Maintenance notes

- When new ready parity slots are added, the explicit expected arrays in
  `tests/parity/canonicalize.test.ts` and
  `tests/parity/parity-dry-run.test.ts` must be updated in the same change.
- When exported registry examples accept optional controllers, Scene tests must
  either wrap the example in a model-ignoring view or provide a real full
  controller intentionally. Passing the example function directly to Scene will
  pass the model as the first argument.
- Reviewers should reject changes that make these tests weaker by deriving the
  expected order directly from the implementation under test.
