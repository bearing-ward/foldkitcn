# Plan 105: Harden shadcn form and selection regressions

> **Executor instructions**: Follow this plan step by step. Add the failing
> tests first, confirm they fail for the user-reported behavior, then implement
> the smallest source changes that make those tests pass. Run every verification
> command and confirm the expected result before moving on. If any STOP
> condition occurs, stop and report; do not improvise. When done, update the
> status row for this plan in `plans/README.md` unless a reviewer dispatched you
> and told you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat e6f708a5..HEAD -- src/main.ts src/live-examples.ts src/scene.test.ts tests/e2e/docs.test.ts src/registry/shadcn/checkbox src/registry/shadcn/collapsible src/registry/shadcn/combobox src/registry/shadcn/field src/registry/shadcn/input-otp src/registry/shadcn/select src/registry/shadcn/slider src/registry/shadcn/switch src/registry/shadcn/tabs registry/docs/shadcn plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" notes against the live code before proceeding. On a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plan 093, Plan 094, Plan 095, Plan 102, Plan 104
- **Category**: regression tests and behavior
- **Planned at**: commit `e6f708a5`, 2026-07-05
- **Execution status**: DONE on 2026-07-05 after reviewer verification

## Why this matters

The user's form-control reports are not isolated styling nits. Select and
combobox examples are broken, checkbox/table selection does not update, field
checkboxes are static, slider movement is missing, Input OTP accepts input
incorrectly, switch descriptions are missing, and tabs/collapsible examples do
not expose the expected state transitions. These are the controls people use to
judge whether the registry is actually interactive.

This plan adds red tests around the public docs examples and then fixes the
shared model-backed live-preview wiring.

## Current state

- `src/main.ts` already has live preview state buckets for input, input OTP,
  slider, select, combobox, checkbox, switch, collapsible, tabs, and data-table
  examples.
- `src/live-examples.ts` has wrappers for:
  - OTP examples at lines 1080-1115.
  - Slider examples at lines 1147-1209.
  - Select examples at lines 1257-1382.
  - Combobox examples starting around line 1443.
  - Collapsible examples at lines 2529-2538.
  - Checkbox examples at lines 2640-2715.
  - Switch examples at lines 2716-2746.
  - Tabs examples at lines 2115-2121 and 2883-2888.
- `CheckboxDescription` is registered through `checkboxPreview` without the
  description text that the origin example shows.
- `CheckboxInTable` registers the select-all checkbox and row checkboxes as
  independent checkbox ids, so selecting all rows has no model-backed aggregate
  effect.
- `SwitchDescription` is registered with only id and label, so its description
  does not render in the live preview.
- `FieldCheckbox` is registered as `staticExample`, and
  `src/registry/shadcn/field/examples.ts` renders a checkbox shell without a
  live controller.
- `src/registry/shadcn/input-otp/index.ts` renders each visible slot as an
  `input`, and the user-provided screenshot shows six visible input boxes with
  odd caret/styling. The origin behavior is one OTP control with styled slots,
  not six unrelated visible text inputs.
- `CollapsibleFileTree` includes a static "Explorer / Outline" tab shell. The
  user's report says tab does not work in the tree-view example.
- `TabsIcons` renders empty `span[data-icon=inline-start]` placeholders, so the
  user sees missing icons.

## Failing tests to add first

Add browser regressions in `tests/e2e/docs.test.ts` or a dedicated
`tests/e2e/shadcn-form-selection.test.ts`.

1. Select examples:
   - Navigate to `/components/shadcn/select`.
   - For every live preview whose title starts with `Select`, click the trigger,
     assert a listbox/options popup appears, choose a non-default option, and
     assert the trigger text and hidden input value update.
   - Assert the popup closes after selection and on Escape.
2. Combobox examples:
   - Navigate to `/components/shadcn/combobox`.
   - Cover every live preview whose title starts with `Combobox`.
   - Open the combobox, type a filter where applicable, choose an option, and
     assert the selected value appears in the trigger/input.
   - Cover multi-select by selecting two values and then removing one.
3. Checkbox and Field:
   - Navigate to `/components/shadcn/checkbox`.
   - In `CheckboxDescription live preview`, assert the description text is
     visible and associated with the checkbox.
   - In `CheckboxInTable live preview`, click the select-all checkbox and assert
     every row checkbox becomes checked; click one row and assert select-all
     enters the correct unchecked or mixed state.
   - Navigate to `/components/shadcn/field`; in `FieldCheckbox live preview`,
     click the checkbox and assert its checked state changes.
4. Switch:
   - Navigate to `/components/shadcn/switch`.
   - In `SwitchDescription live preview`, assert the description text is visible
     and associated with the switch.
   - In `SwitchChoiceCard live preview`, click the choice card body and assert
     the switch state changes while style tokens match the selected state.
5. Input OTP:
   - Navigate to `/components/shadcn/input-otp`.
   - Type `123456` into `InputOTPDemo live preview`.
   - Assert the value display reads `Value: 123456`.
   - Assert there is a single tab-stop/input interaction path for the OTP
     control, slots show one character each, backspace moves correctly, and the
     focused slot style is visible.
6. Slider:
   - Navigate to `/components/shadcn/slider`.
   - Drag or keyboard-step the thumb in at least one horizontal and one RTL or
     vertical example.
   - Assert the thumb moves, the indicator bar is visible, and the value text or
     aria value changes.
7. Collapsible and tabs:
   - Navigate to `/components/shadcn/collapsible`.
   - In `CollapsibleFileTree live preview`, click "Outline" and assert the view
     changes from the Explorer tree; click "Explorer" and assert it returns.
   - Toggle a folder and assert the panel opens and closes smoothly enough to
     expose the transition classes that Plan 107 will check visually.
   - Navigate to `/components/shadcn/tabs`; in `TabsIcons live preview`, assert
     actual icons render and selecting the second tab changes active state.

Add Scene/update tests for root model transitions:

- `UpdatedLiveExampleSelectOpen`, `UpdatedLiveExampleSelectValue`.
- Combobox open/input/value/multiple-selection messages.
- Checkbox group/select-all messages if added.
- OTP value update and backspace/delete semantics if modeled in update.
- Slider value changes.
- Switch and field checkbox state.
- Collapsible file-tree tab value if introduced.
- Tabs value changes.

The red phase is successful only when the new tests fail against
`e6f708a5` for the broken behavior described above.

## Implementation outline

1. Keep all control state in the root Foldkit model.
   - Use Schema model fields and `evo()` updates.
   - Add new message facts only when current generic messages cannot express
     the behavior. Do not use `NoOp`.
2. Repair Select and Combobox wiring.
   - Reuse the local Select/Combobox foundations and the existing live-preview
     state buckets.
   - Keep popup open state, input text, highlighted/selected value, hidden
     input, and close-on-select behavior synchronized through update.
3. Repair Checkbox, Field, and Switch examples.
   - Add description support to `checkboxPreview` and switch preview configs.
   - Add table select-all state derived from row ids. The select-all checkbox
     should update all rows, and row changes should update the aggregate state.
   - Convert `FieldCheckbox` to a controller-aware live example.
4. Repair Input OTP.
   - Align the component with the local Base UI OTP Field semantics. Visible
     slots should be styled slots for one logical OTP value, not six unrelated
     visible inputs.
   - Preserve keyboard behavior: typing, paste, arrow navigation, backspace,
     delete, focus ring, and disabled state.
5. Repair Slider.
   - Ensure the track, range/indicator, and thumbs render with visible
     dimensions and stateful style.
   - Ensure pointer and keyboard interactions emit model-backed value changes.
6. Repair CollapsibleFileTree and TabsIcons.
   - If the file-tree tab shell is meant to be interactive, introduce a small
     example-scoped tab value in the model and render distinct Explorer and
     Outline content.
   - Replace empty icon placeholders in `TabsIcons` with local inline SVG
     icons, or remove the icon example from live-ready status if icons are not
     part of the accepted example. Prefer fixing the example.
7. Regenerate docs artifacts if source snippets or metadata change.

## Acceptance criteria

- All Select and Combobox live examples open, filter where applicable, select
  options, update display/hidden value, and dismiss.
- Checkbox descriptions and Switch descriptions are visible and semantically
  associated.
- Checkbox select-all controls all table rows and reflects mixed state.
- FieldCheckbox toggles in the docs preview.
- Input OTP has origin-like slot styling and correct logical input behavior.
- Slider track/range/thumb are visible and pointer/keyboard input changes the
  model-backed value.
- CollapsibleFileTree tabs and folders are interactive.
- Tabs icon examples contain actual icons and state changes.

## Verification

Run these commands and include the pass/fail result in the executor closeout:

```bash
bun run test
bunx playwright test tests/e2e/docs.test.ts --grep "select|combobox|checkbox|field|switch|input otp|slider|collapsible|tabs"
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

- A fix requires local mutable component state outside Foldkit update/model.
- A Select or Combobox behavior requires importing upstream React, cmdk, Radix,
  or Base UI React code.
- Input OTP cannot be fixed without changing the local Base UI OTP primitive
  contract. Stop and plan that primitive change first.
- The desired CollapsibleFileTree "Outline" behavior is not present in the
  pinned origin evidence. Stop and document the product decision instead of
  inventing parity.
