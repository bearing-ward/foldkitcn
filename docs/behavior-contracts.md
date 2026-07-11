# Component and Example Behavior Contracts

## Status

Normative. A public component is not complete when it merely renders. Its
registry manifest must state why the component and each example exist, declare
observable behavior, and pass the browser checks generated from those
declarations.

## Contract boundary

The source of truth is each `registry-src/<namespace>/<component>/item.json`.
Every component and every example must provide:

- `distinguishes`: a non-empty explanation of what this component or example
  adds that the neighboring alternatives do not.
- `behaviorExpectations`: a non-empty list of supported, observable contracts.

`bun run registry:build` copies these declarations into
`registry/docs/<namespace>/<component>.json`. The docs application renders from
those generated artifacts. `tests/e2e/declared-behavior-contracts.test.ts`
reads the same artifacts and executes the declared expectations in Chromium.

Missing declarations fail schema decoding. Unsupported expectation names fail
schema decoding. A declared expectation that does not match browser behavior
fails Playwright and blocks CI.

## Component expectations

- `examples-render-without-errors`: opening the component route must not emit
  browser console errors or uncaught page errors while its examples render.
- `examples-match-declared-behavior`: every example on the component route is
  governed by its own declared expectations; component acceptance is the sum
  of those example contracts.

Public component manifests should declare both expectations. Private schema or
tooling fixtures may declare only the expectation that applies to their
surface.

## Example expectations

- `renders-without-errors`: the example card exists; a `live-ready` example has
  a visible live preview; rendering produces no runtime error.
- `preview-contained`: the resting preview does not create unintended
  horizontal overflow. Floating layers are evaluated after interaction by
  their more specific contracts.
- `closed-content-hidden`: overlay or popup content is absent from the visible
  accessibility tree before its trigger is activated and after dismissal.
- `filters-to-empty-state`: filtering shows only matching items. When no item
  matches, the empty state replaces all groups and items instead of appearing
  beside stale content.
- `focuses-input-on-open`: opening an input-driven modal places keyboard focus
  in its primary input without requiring an extra pointer or keyboard action.
- `interaction-updates-state`: user input changes the dependent, observable
  state rather than only moving a decorative control. Current contracts cover
  controlled progress and overlay open/dismiss behavior.
- `opens-without-scroll`: the opened surface fits its intended demonstration
  geometry without an unintended internal scrollbar. Viewport collision
  scrolling remains valid only when the example explicitly demonstrates it.
- `placement-correct`: an opened floating surface appears on its declared
  physical or logical side without overlapping its trigger. RTL logical sides
  resolve against the example direction.
- `single-submenu-chain`: nested menus may retain their ancestor chain, but
  opening a sibling branch closes the previous sibling and its descendants.
  Orphaned or simultaneous competing branches are a failure.
- `viewport-command-dialog`: the native command dialog owns the complete
  viewport modal layer. Its search input and icon share one horizontal
  centerline, and the input consumes the available row width.

## Selecting expectations

Every example declares `renders-without-errors` and `preview-contained` unless
it is a nonvisual fixture. Add every specific expectation that describes the
example's distinguishing behavior:

| Example behavior                                                         | Required expectation        |
| ------------------------------------------------------------------------ | --------------------------- |
| Dialog, popover, menu, select, tooltip, or other closed overlay          | `closed-content-hidden`     |
| Search or command list that filters local results                        | `filters-to-empty-state`    |
| Slider, input, selection, or trigger changes another visible value/state | `interaction-updates-state` |
| Side, alignment, collision, or RTL placement example                     | `placement-correct`         |
| Large menu intentionally shown without a scroll region                   | `opens-without-scroll`      |
| Nested menu with sibling branches                                        | `single-submenu-chain`      |
| Button-opened CommandDialog                                              | `viewport-command-dialog`   |

An expectation list is not a checklist to minimize. If the title or
`distinguishes` text promises behavior, the corresponding executable
expectation is required. A generic render expectation cannot substitute for an
interaction contract.

## Authoring example

```json
{
  "id": "shadcn/command-basic",
  "title": "CommandBasic",
  "description": "Closed CommandDialog trigger matching the origin surface.",
  "distinguishes": "Demonstrates the default viewport-level command palette.",
  "behaviorExpectations": [
    "renders-without-errors",
    "preview-contained",
    "closed-content-hidden",
    "viewport-command-dialog"
  ],
  "sourcePath": "src/registry/shadcn/command/examples.ts",
  "kind": "demo"
}
```

## Adding a new expectation

An expectation is complete only when one change set includes all of the
following:

1. Add its literal to `ExampleBehaviorExpectation` or
   `ComponentBehaviorExpectation` in `src/registry/schema.ts`.
2. Define its observable pass/fail meaning in this document.
3. Implement its generic browser assertion in
   `tests/e2e/declared-behavior-contracts.test.ts`.
4. Add the expectation to every existing manifest whose description promises
   that behavior.
5. Regenerate registry artifacts with `bun run registry:build`.
6. Run the focused contract red before the fix and green afterward.
7. Run `bun run test`, `bun run test:e2e`, `bun run typecheck`, and
   `bun run check` before shipping.

Do not add an expectation literal without a runner. Do not add a one-off browser
test when the same behavior applies to a reusable family of examples; promote
it to this contract vocabulary.

## Compliance review

Reviewers should reject a component or example when:

- `distinguishes` merely repeats the title or says only “default example.”
- promised interaction is covered only by render/containment expectations.
- the generated docs artifact is stale.
- a popup is visible while closed, clipped by its preview, incorrectly placed,
  or leaves competing branches mounted.
- a controlled input changes itself but not its dependent component.
- browser assertions rely on implementation-only state instead of visible DOM,
  accessibility state, geometry, or user-observable output.

CI runs unit tests, the complete Playwright suite, typecheck, registry checks,
and Ultracite. No component is compliant solely because its unit tests pass.
