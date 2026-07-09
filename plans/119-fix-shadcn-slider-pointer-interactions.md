# Plan 119: Fix shadcn Slider live pointer interactions

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
> git diff --stat 72e5f38f..HEAD -- src/main.ts src/live-examples.ts src/registry/base-ui/slider src/registry/shadcn/slider tests/e2e/shadcn-form-collection-regressions.test.ts tests/e2e/docs.test.ts registry/docs/shadcn/slider.json registry/docs/index.json registry/index.json public/r/registry.json public/r/shadcn-slider.json
> ```
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/118-resolve-shadcn-qa-parity-punch-list.md
- **Category**: bug
- **Planned at**: commit `72e5f38f`, 2026-07-08

## Why this matters

The shadcn Slider docs examples are live previews, but pointer interaction is
effectively unusable: clicking a visible slider can jump the value to the max
and leave the user unable to make a normal selection. Existing tests only
assert that values change away from a previous value, so a broken "jump to 100"
path passes. This plan first adds browser tests that reproduce the actual
failure with real rendered geometry, then fixes the docs live-preview data flow
so Slider clicks use the measured control rect instead of a fake viewport-origin
rect.

## Current state

Relevant files:

- `src/registry/base-ui/slider/index.ts` - the headless Slider behavior and
  pointer math helpers used by shadcn Slider.
- `src/registry/shadcn/slider/index.ts` - styled shadcn wrapper around the
  local Base UI Slider.
- `src/registry/shadcn/slider/examples.ts` - installable examples with static
  values.
- `src/live-examples.ts` - docs live-preview wiring for Slider, including the
  hard-coded `sliderControlRect`.
- `src/main.ts` - docs app model, messages, update, subscriptions, and
  `LiveExampleContext` implementation.
- `tests/e2e/shadcn-form-collection-regressions.test.ts` - current e2e suite
  containing weak Slider interaction coverage.
- `src/registry/base-ui/slider/scene.test.ts` and
  `src/registry/shadcn/slider/slider.test.ts` - current component-level Slider
  tests.
- `registry/docs/shadcn/slider.json`, `registry/docs/index.json`,
  `registry/index.json`, `public/r/registry.json`, and
  `public/r/shadcn-slider.json` - generated artifacts to refresh only if source
  examples/manifests change.

Current working-tree note:

- At planning time, `src/styles.css` is already dirty in the operator's main
  checkout with an unrelated `.live-example-preview` centering edit. Treat that
  as pre-existing local work. Do not include `src/styles.css` in this plan
  unless the operator explicitly asks. A clean executor worktree from
  `72e5f38f` will not contain that uncommitted edit.

Repo conventions to preserve:

- Foldkit apps use pure `Model`, `Message`, `init`, `update`, and `view`.
  Messages are facts, not commands.
- Use `m()` for messages and `evo()` from `foldkit/struct` for immutable model
  updates.
- Side effects belong in subscriptions or commands, not in pure update/view
  code. Existing `src/main.ts` subscriptions already translate document
  `pointerdown` events into Foldkit messages for live-example dismissal.
- Use `html<Message>()` inside view functions, not at module scope.
- ADR 0001 says shadcn items are styled Foldkit wrappers that depend on local
  registry primitives. Do not add React, Radix, upstream Base UI React, or
  origin repo runtime imports.

Current excerpts:

`src/live-examples.ts:1212-1280` builds every Slider live preview from model
state and passes `controlRect` through to `SliderView`:

```ts
const sliderExample = (
  config: Readonly<{
    id: string
    defaultValues: ReadonlyArray<number>
    min?: number
    max?: number
    step?: number
    orientation?: 'horizontal' | 'vertical'
    dir?: 'ltr' | 'rtl'
    className?: string
    isDisabled?: boolean
    label?: string
    controlRect?: Readonly<{
      left: number
      right: number
      bottom: number
      width: number
      height: number
    }>
  }>,
): LiveExampleDefinition => ({
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => {
    const h = html<Message>()
    const values = context.sliderValuesFor(
      example,
      config.id,
      config.defaultValues,
    )
    const valueText = values.join(', ')

    return h.div(
      [
        h.Class(
          config.orientation === 'vertical'
            ? 'mx-auto flex items-center justify-center gap-6'
            : 'mx-auto grid w-full max-w-xs gap-3',
        ),
      ],
      [
        SliderView<Message>({
          id: config.id,
          values: [...values],
          min: config.min,
          max: config.max,
          step: config.step,
          orientation: config.orientation,
          dir: config.dir,
          className: config.className,
          isDisabled: config.isDisabled,
          ...(config.controlRect === undefined
            ? {}
            : { controlRect: config.controlRect }),
          onValueChange: change =>
            context.onSliderValueChange(example, config.id, change),
        }),
      ],
    )
  },
})
```

`src/live-examples.ts:1286-1292` defines the fake rect:

```ts
const sliderControlRect = {
  left: 0,
  right: 320,
  bottom: 160,
  width: 320,
  height: 160,
} as const
```

`src/live-examples.ts:3699-3752` applies that same fake rect to every shadcn
Slider live example:

```ts
[liveExampleKey('shadcn/slider', 'SliderDemo')]: sliderExample({
  id: 'slider-demo-live',
  defaultValues: [75],
  max: 100,
  step: 1,
  controlRect: sliderControlRect,
}),
[liveExampleKey('shadcn/slider', 'SliderRange')]: sliderExample({
  id: 'slider-range-live',
  defaultValues: [25, 50],
  max: 100,
  step: 5,
  controlRect: sliderControlRect,
}),
```

`src/registry/base-ui/slider/index.ts:662-688` maps pointer coordinates against
the rect:

```ts
export const pointerValue = (config: {
  readonly pointer: SliderPointer
  readonly rect: SliderControlRect
  readonly min: number
  readonly max: number
  readonly step: number
  readonly orientation: SliderOrientation
  readonly dir: SliderDirection
}): number => {
  const { pointer, rect, min, max, step, orientation, dir } = config
  const controlSize = orientation === 'vertical' ? rect.height : rect.width
  const valueSize = (() => {
    if (orientation === 'vertical') {
      return rect.bottom - pointer.clientY
    }

    if (dir === 'rtl') {
      return rect.right - pointer.clientX
    }

    return pointer.clientX - rect.left
  })()
  const valueRescaled = clamp(valueSize / controlSize, 0, 1)
  const rawValue = (max - min) * valueRescaled + min

  return clamp(roundValueToStep(rawValue, step, min), min, max)
}
```

`src/registry/base-ui/slider/index.ts:946-972` wires pointerdown only when a
caller supplies `controlRect`:

```ts
if (
  config.isDisabled === true ||
  config.controlRect === undefined ||
  config.onValueChange === undefined
) {
  return []
}

const { controlRect, onValueChange } = config

return [
  h.OnPointerDown(
    (_pointerType, button, _screenX, _screenY, _time, clientX, clientY) =>
      button === 0
        ? Option.some(
            onValueChange(
              pointerValueChange({
                state,
                pointer: { clientX, clientY },
                rect: controlRect,
              }),
            ),
          )
        : Option.none(),
  ),
]
```

`tests/e2e/shadcn-form-collection-regressions.test.ts:259-321` is too weak. A
jump to max still satisfies `not.toHaveAttribute('aria-valuenow', '76')`:

```ts
await playwrightExpect(demoInput).toHaveAttribute('aria-valuenow', '75')
await demoInput.focus()
await demoInput.press('ArrowRight')
await playwrightExpect(demoInput).toHaveAttribute('aria-valuenow', '76')
const demoThumbBefore = await box(demoThumb)
await dragFromCenter(page, demoThumb, 80, 0)
await playwrightExpect(demoInput).not.toHaveAttribute('aria-valuenow', '76')
await playwrightExpect(await box(demoThumb)).not.toEqual(demoThumbBefore)
```

`src/registry/base-ui/slider/scene.test.ts:182-200` proves pointer math only
with a zero-origin rect, so it misses the docs failure:

```ts
expect(
  Slider.pointerValueChange({
    state,
    pointer: { clientX: 82, clientY: 0 },
    rect: { left: 0, right: 100, bottom: 20, width: 100, height: 20 },
  }),
).toStrictEqual({
  values: [25, 80],
  reason: 'track-press',
  activeThumbIndex: 1,
})
```

## Commands you will need

| Purpose                  | Command                                                                                                             | Expected on success                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------ |
| Focused red/green e2e    | `bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --grep "slider docs" --workers=1`        | Fails before the fix for the new exact click tests, exits 0 after the fix |
| Slider component tests   | `bun run test -- src/registry/base-ui/slider/scene.test.ts src/registry/shadcn/slider/slider.test.ts`               | exit 0                                                                    |
| Broad docs e2e           | `bunx playwright test tests/e2e/docs.test.ts --grep "calendar date picker carousel data table pagination table docs | visual drawer sheet dialog progress separator and tabs" --workers=1`      | exit 0 |
| Full form/collection e2e | `bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --workers=1`                             | exit 0                                                                    |
| Registry artifacts       | `bun run registry:build && bun run registry:check`                                                                  | generated artifacts current, check exits 0                                |
| Typecheck                | `bun run typecheck`                                                                                                 | exit 0                                                                    |
| Lint/check               | `bun run check`                                                                                                     | exit 0                                                                    |
| Full tests               | `bun run test`                                                                                                      | exit 0                                                                    |
| Build                    | `bun run build`                                                                                                     | exit 0                                                                    |
| Diff hygiene             | `git diff --check -- src tests registry public/r plans`                                                             | exit 0                                                                    |

## Scope

**In scope**:

- `src/main.ts`
- `src/live-examples.ts`
- `src/registry/base-ui/slider/**`
- `src/registry/shadcn/slider/**`
- `tests/e2e/shadcn-form-collection-regressions.test.ts`
- `tests/e2e/docs.test.ts` only if the existing broad docs assertion needs a
  stricter Slider check
- Generated Slider/docs registry artifacts under `registry/docs/**`,
  `registry/index.json`, and `public/r/**` if and only if produced by
  `bun run registry:build`
- `plans/README.md` status row for this plan

**Out of scope**:

- `src/styles.css`, including the pre-existing dirty `.live-example-preview`
  centering edit in the operator's checkout
- Any non-Slider component fixes
- Site-wide preview layout changes
- React, Radix, upstream Base UI React, origin repo runtime imports, or new
  runtime dependencies
- Editing `repos/foldkit/`, `node_modules/`, or vendored origin repositories
- Making Slider pointer behavior non-clickable just to avoid the max-jump bug

## Git workflow

- Branch: `codex/119-fix-shadcn-slider-pointer-interactions`
- Commit in logical units: red tests, pointer interaction fix, generated
  artifacts/gates
- Use conventional commit-style messages already present in this repo, for
  example `fix: repair shadcn slider pointer interactions`
- Do not push or open a PR unless the operator explicitly instructs you to.

## Steps

### Step 1: Replace weak Slider e2e assertions with exact red tests

Update `tests/e2e/shadcn-form-collection-regressions.test.ts` before changing
source behavior.

Add helper functions near `dragFromCenter`:

- `clickSliderControlAt(page, control, xPercent, yPercent)`:
  - reads `control.boundingBox()`
  - clicks `box.x + box.width * xPercent`, `box.y + box.height * yPercent`
  - throws if the box is null
- `expectSliderValue(input, value)`:
  - asserts both `aria-valuenow` and `value` when possible, so stale ARIA cannot
    mask a broken input
- Keep `dragFromCenter` if still useful, but do not rely on
  `not.toHaveAttribute` for Slider correctness.

Strengthen the existing `"slider docs respond to drag and keyboard input"`
test or split it into clearer tests. The new tests must fail against the
current code before the source fix:

1. `SliderDemo`:
   - locate `demoControl = demoPreview.locator('[data-base-ui-slider-control]')`
   - assert initial value `75`
   - click the rendered control at 50% x / 50% y and expect value `50`
   - click at 25% x / 50% y and expect value `25`
   - click at 75% x / 50% y and expect value `75`
   - this catches both "first click jumps to 100" and "cannot move back down"
2. `SliderRange`:
   - assert two inputs with initial values `25` and `50`
   - click at 30% x / 50% y and expect values `30` and `50`
   - click at 80% x / 50% y and expect values `30` and `80`
   - verify the active thumb can move down again by clicking 60% and expecting
     the upper value to become `60`
3. `SliderRtl`:
   - click at 25% x / 50% y and expect value `75`
   - click at 75% x / 50% y and expect value `25`
4. `SliderVertical`:
   - click the rendered vertical control at 50% x / 25% y and expect value `75`
   - click at 50% x / 75% y and expect value `25`
5. `SliderDisabled`:
   - click the disabled control at 25%, 50%, and 75%
   - assert value stays `50`

Run the focused test before implementing the fix:

```bash
bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --grep "slider docs" --workers=1
```

Expected before the fix: the new exact click tests fail, typically because
the first click sets a horizontal Slider value to `100` instead of the clicked
percentage. If they do not fail, STOP and report the observed current behavior
because the user-reported bug may already have been changed by drift.

### Step 2: Add pure Slider geometry coverage for offset rects

Extend `src/registry/base-ui/slider/scene.test.ts` with pure helper assertions
that document the geometry contract independent of browser layout:

- LTR horizontal with `rect: { left: 400, right: 720, bottom: 300, width: 320, height: 40 }` and pointer `clientX: 560` maps to value `50`.
- RTL horizontal with the same rect and pointer `clientX: 480` maps to value `75`.
- Vertical with `rect: { left: 400, right: 440, bottom: 500, width: 40, height: 160 }` and pointer `clientY: 380` maps to value `75`.
- Range `pointerValueChange` chooses the nearest thumb and can move a value back down after a previous high value.

These pure tests may already pass because `pointerValue` itself is mostly
correct when given a real rect. Keep them anyway: they prevent future fixes
from weakening the geometry contract while the browser red tests catch the
current live-preview bug.

**Verify**:

```bash
bun run test -- src/registry/base-ui/slider/scene.test.ts
```

Expected: exits 0 before and after the source fix, unless the helper itself has
a separate bug. If this fails before source changes, STOP and report because the
fix has a deeper Base UI math problem than the docs live-preview fake rect.

### Step 3: Replace fake Slider live-preview rects with measured pointer facts

Fix the docs live-preview data flow without adding imperative local state to
Slider views.

Recommended implementation shape:

1. In `src/live-examples.ts`, remove `controlRect` from Slider live-example
   configs and delete the shared `sliderControlRect` constant.
2. Still keep Slider live examples clickable by adding stable data attributes
   in the live wrapper/default render:
   - outer live Slider wrapper: `data-live-example-slider-example-id="<example.id>"`
   - control element: `data-live-example-slider-control="<sliderId>"`
   - root/control should still expose existing Slider slots and
     `data-base-ui-slider-control`
3. Because `SliderView` only exposes attributes, provide a `toView` in
   `sliderExample` that mirrors the current shadcn Slider default structure
   and adds the data attributes to the control element. Preserve the same
   `data-slot` attributes, classes, track, range, thumb, and hidden input
   structure emitted by `src/registry/shadcn/slider/index.ts`.
4. Export or colocate a single source of truth for live Slider configs keyed by
   `sliderId`, containing:
   - default values
   - `min`, `max`, `step`
   - `orientation`
   - `dir`
   - disabled state
5. In `src/main.ts`, add a new message, for example:

   ```ts
   export const PressedLiveExampleSliderControl = m(
     'PressedLiveExampleSliderControl',
     {
       exampleId: S.String,
       sliderId: S.String,
       clientX: S.Number,
       clientY: S.Number,
       rect: SliderControlRect,
     },
   )
   ```

   Use the exact message name that best matches existing naming, but keep it a
   past-tense fact about the pointer press.

6. Add an update branch that:
   - looks up the live Slider config by `sliderId`
   - ignores unknown or disabled slider IDs
   - reads current values from `model.liveExampleSliderValues` using the same
     `liveExampleControlStateKey(exampleId, sliderId)` key as
     `sliderValuesFor`
   - falls back to the config's default values
   - calls `SliderView.sliderState(...)` and
     `SliderView.pointerValueChange(...)` with the measured rect and pointer
   - stores the resulting values with `evo(model, { liveExampleSliderValues: ... })`
7. Add or extend a subscription in `src/main.ts` similar to
   `liveExampleOutsidePointer`:
   - listen to document `pointerdown`
   - ignore non-primary button presses
   - find `event.target.closest('[data-live-example-slider-control]')`
   - find the closest `[data-live-example-slider-example-id]`
   - read `getBoundingClientRect()` from the control element
   - dispatch `PressedLiveExampleSliderControl` with `clientX`, `clientY`, and
     the measured rect
   - do not call `preventDefault`; the native range input and keyboard path
     must remain accessible

The important constraint is that values remain model-owned. The DOM
subscription may measure geometry and translate browser events into a Foldkit
message, but `update` must compute and store the next values. Do not mutate DOM
state directly.

Do not solve this by keeping the hard-coded `left: 0` rect and adjusting CSS or
preview alignment to match it. The control can appear anywhere in the viewport.

**Verify**:

```bash
bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --grep "slider docs" --workers=1
bun run test -- src/registry/base-ui/slider/scene.test.ts src/registry/shadcn/slider/slider.test.ts
```

Expected: all commands exit 0. The e2e test must prove values hit the exact
clicked percentages and can move back down after a prior click.

### Step 4: Preserve keyboard, native input, and disabled behavior

After pointer clicks pass, check that the fix did not regress existing Slider
paths:

- Keyboard:
  - `SliderDemo` focused input `ArrowRight` still changes `75` to `76`.
  - `SliderRange` lower thumb `ArrowRight` still changes `25` to `30`.
  - RTL arrow semantics still follow existing `keyboardValueChange`.
- Native input state:
  - hidden range inputs keep accurate `value`, `aria-valuenow`, `min`, `max`,
    and `step`.
  - value labels in the live preview reflect the model after pointer and
    keyboard changes.
- Disabled:
  - `SliderDisabled` has no pointer effect and still marks disabled parts with
    disabled/data-disabled attributes.

Update `src/registry/shadcn/slider/slider.test.ts` only if the shadcn wrapper
contract changes. Prefer adding behavior assertions in Playwright, because this
bug is about real browser geometry.

**Verify**:

```bash
bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --grep "slider docs" --workers=1
bun run test -- src/registry/shadcn/slider/slider.test.ts
```

Expected: both commands exit 0.

### Step 5: Refresh generated docs/registry artifacts if needed

If source examples, installable source, or manifests changed, run:

```bash
bun run registry:build
```

Then inspect the generated diff. Keep only artifacts caused by the Slider
source changes. If `registry:build` produces unrelated generated churn outside
Slider docs/catalog files, STOP and report.

**Verify**:

```bash
bun run registry:check
```

Expected: exits 0 and reports registry artifacts are current.

### Step 6: Run focused and full gates

Run the focused and canonical gates after the fix:

```bash
bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --workers=1
bunx playwright test tests/e2e/docs.test.ts --grep "calendar date picker carousel data table pagination table docs|visual drawer sheet dialog progress separator and tabs" --workers=1
bun run typecheck
bun run check
bun run test
bun run build
git diff --check -- src tests registry public/r plans
```

Expected: all commands exit 0. If Playwright leaves `test-results/`, remove it
before committing unless the repo intentionally tracks it.

## Test plan

Add tests before implementation:

- `tests/e2e/shadcn-form-collection-regressions.test.ts`
  - exact click-position assertions for `SliderDemo`, `SliderRange`,
    `SliderRtl`, `SliderVertical`, and `SliderDisabled`
  - values can move both up and down after prior pointer interaction
  - no `not.toHaveAttribute` assertions for Slider value correctness
- `src/registry/base-ui/slider/scene.test.ts`
  - offset rect, RTL rect, vertical rect, and range nearest-thumb geometry
    helper coverage
- `src/registry/shadcn/slider/slider.test.ts`
  - only if the wrapper emits new stable data attributes or its default
    structure changes

Verification:

```bash
bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --grep "slider docs" --workers=1
bun run test -- src/registry/base-ui/slider/scene.test.ts src/registry/shadcn/slider/slider.test.ts
```

Expected: the Playwright command fails before the fix and passes after it; the
component tests pass after any necessary source changes.

## Done criteria

All must hold:

- [ ] New Slider e2e tests fail on the current hard-coded-rect behavior before
      the fix.
- [ ] `SliderDemo` pointer clicks at 25%, 50%, and 75% produce exact values
      `25`, `50`, and `75`, not `100`.
- [ ] `SliderRange` pointer clicks update the nearest thumb and can move the
      selected thumb back down after a previous higher click.
- [ ] `SliderRtl` maps visual left/right clicks according to RTL semantics.
- [ ] `SliderVertical` maps visual top/bottom clicks according to vertical
      semantics.
- [ ] `SliderDisabled` ignores pointer clicks.
- [ ] Keyboard and native input behavior still works for Slider docs.
- [ ] The fix does not rely on a hard-coded `left: 0` or fixed preview width.
- [ ] No React, Radix, upstream Base UI React, origin repo runtime imports, or
      new runtime dependencies are added.
- [ ] `bunx playwright test tests/e2e/shadcn-form-collection-regressions.test.ts --workers=1` exits 0.
- [ ] `bun run registry:build && bun run registry:check` exits 0 if generated
      artifacts are affected.
- [ ] `bun run typecheck`, `bun run check`, `bun run test`, and
      `bun run build` exit 0.
- [ ] `git diff --check -- src tests registry public/r plans` exits 0.
- [ ] `src/styles.css` is not modified by this plan.
- [ ] `plans/README.md` row 119 is updated from TODO to DONE or BLOCKED.

## STOP conditions

Stop and report back if:

- The new e2e tests do not reproduce the user's reported max-jump/stuck bug
  before any source fix.
- Fixing the bug appears to require editing `foldkit` package source,
  `repos/foldkit/`, `node_modules/`, or a vendored origin repository.
- Fixing the bug appears to require changing the public `foldkit/html`
  `OnPointerDown` API.
- The only apparent fix is to remove Slider pointer/click interaction entirely.
- You need to modify `src/styles.css` or site-wide preview layout to make the
  hard-coded rect line up with the viewport.
- Any focused Playwright command fails twice after a reasonable fix attempt.
- `bun run registry:build` produces unrelated generated churn outside Slider
  docs/catalog artifacts.

## Maintenance notes

- The user-visible failure came from a mismatch between browser `clientX` /
  `clientY` and a synthetic rect. Future slider work should test real rendered
  geometry, not just pure pointer math.
- Keep the Slider component's value flow model-owned. DOM measurement is an
  event translation detail; the source of truth remains `Model`.
- Reviewers should look closely for hidden regressions in range/multiple thumb
  selection, RTL semantics, vertical semantics, disabled behavior, and keyboard
  accessibility.
