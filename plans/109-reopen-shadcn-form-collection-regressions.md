# Plan 109: Reopen shadcn form and collection regressions with exact red tests

> **Executor instructions**: Follow this plan step by step. Add the failing
> regression tests first, run them against the current code, and confirm they
> fail for the user-reported behavior before changing implementation code. Then
> make the smallest Foldkit-native changes that make those tests pass. If a
> reported issue cannot be reproduced by a test, stop and report the exact
> evidence instead of silently dropping it.
>
> **Drift check (run first)**:
> `git diff --stat 0dea03a8..HEAD -- src/main.ts src/live-examples.ts src/scene.test.ts tests/e2e src/registry/shadcn/combobox src/registry/shadcn/data-table src/registry/shadcn/input-otp src/registry/shadcn/pagination src/registry/shadcn/progress src/registry/shadcn/slider registry/docs/shadcn plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" notes against the live code before proceeding. On a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plans 104, 105, 106, and 107
- **Category**: regression tests and behavior
- **Planned at**: commit `0dea03a8`, 2026-07-06

## Why this matters

Plans 104-108 are marked DONE, but the current docs surface still shows broken
form and collection behavior. The user's current report names combobox filter
reset, detached options, clear button failure, missing custom combobox items,
wrong data-table and pagination rows-per-page behavior, pagination checkmarks,
static progress, locked sliders, and Input OTP accepting only two digits. The
existing tests touch some of these components, but they do not assert these
exact failure modes.

This plan tightens the tests before changing source, so the next executor proves
the user's findings first and fixes the behavior under a precise browser gate.

## Current state

- `tests/e2e/docs.test.ts:1028-1039` opens only `ComboboxBasic` and checks that
  a card-like floating surface appears. It does not type into prefilled
  comboboxes, clear the last character, click the clear button, or inspect
  `ComboboxWithCustomItems`.
- `src/live-examples.ts:1533-1620` builds live combobox examples from generic
  item arrays, renders the trigger text as `v`, and renders clear/remove
  buttons as `x`. The component-local static example has the same glyphs at
  `src/registry/shadcn/combobox/examples.ts:169-193`, and `ComboboxPopup` has
  another literal `v` at `src/registry/shadcn/combobox/examples.ts:358-386`.
- `src/live-examples.ts:3632-3712` registers `ComboboxBasic`,
  `ComboboxWithCustomItems`, `ComboboxPopup`, grouped, multi-select, RTL, and
  prefilled examples. The current browser tests do not cover the prefilled or
  custom-item cases.
- `tests/e2e/docs.test.ts:1861-1893` checks `DataTableDemo` with a default of
  two rows, changes to four rows, and checks a selected-row count. It does not
  verify the rows-per-page option set or the checkbox aggregate behavior the
  user reported as inconsistent.
- `src/live-examples.ts:2233-2241` drives pagination rows per page through the
  Select live state, defaulting to `25`. `tests/e2e/docs.test.ts:1898-1912`
  changes `PaginationIconsOnly` to `10`, but does not assert that only the
  selected option shows a check indicator.
- `src/live-examples.ts:3472-3475` still registers `ProgressControlled` and
  `ProgressDemo` with `staticExample`, so the progress docs cannot expose the
  control input the user expects.
- `tests/e2e/docs.test.ts:1936-1945` only counts one logical OTP input and six
  slots. It does not type `123456`, so it can pass while the browser only
  accepts two digits.
- `src/live-examples.ts:3576-3618` registers slider examples through
  `sliderExample`, but the existing browser lane does not drag or keyboard-step
  any slider. The user reports the examples are locked.

## Commands you will need

| Purpose              | Command                                          | Expected on success |
| -------------------- | ------------------------------------------------ | ------------------- | ---------- | -------- | --------- | -------- | -------------------- |
| Unit/Scene tests     | `bun run test`                                   | exit 0              |
| Focused browser lane | `bunx playwright test tests/e2e --grep "combobox | data table          | pagination | progress | input otp | slider"` | exit 0 after the fix |
| Typecheck            | `bun run typecheck`                              | exit 0              |
| Registry validation  | `bun run registry:check`                         | exit 0              |
| Lint/check           | `bun run check`                                  | exit 0              |

## Scope

**In scope**:

- `tests/e2e/docs.test.ts` or a new
  `tests/e2e/shadcn-form-collection-regressions.test.ts`
- `src/scene.test.ts` only for model/update coverage
- `src/main.ts`
- `src/live-examples.ts`
- `src/registry/shadcn/combobox/**`
- `src/registry/shadcn/data-table/**`
- `src/registry/shadcn/input-otp/**`
- `src/registry/shadcn/pagination/**`
- `src/registry/shadcn/progress/**`
- `src/registry/shadcn/slider/**`
- `registry/docs/shadcn/**` only when regenerated from source
- generated registry index/public artifacts after `bun run registry:build`

**Out of scope**:

- Base UI primitives except where a STOP condition proves the shadcn wrapper
  cannot be fixed without a primitive follow-up plan.
- `shadcn/toast`; Plan 112 handles removal.
- Styling-only overlay/menu work; Plan 110 owns that.

## Git workflow

- Branch: `codex/109-reopen-shadcn-form-collection-regressions`.
- Commit per logical fix group if the operator asks for commits.
- Do not push or open a PR unless explicitly instructed.

## Steps

### Step 1: Add exact failing browser regressions

Create a focused Playwright lane. The tests must use public docs routes and
`.live-example-preview` labels because the user's report is about the docs
experience.

Cover these cases:

- Combobox:
  - In a prefilled example such as `ComboboxPopup live preview`, focus the
    input, repeatedly backspace to remove the final character, and assert the
    input remains empty while all options are shown. The old filtered text must
    not be restored.
  - Assert the popup remains anchored to the input or trigger after filtering
    and clearing; compare bounding boxes before and after clearing.
  - Assert the trigger icon is a down-facing caret/chevron icon, not text `v`.
  - Assert the clear button empties the value and input text, updates hidden
    inputs, and does not reopen stale filtered text.
  - Assert `ComboboxWithCustomItems live preview` renders its custom items, not
    the generic framework options.
- Data table:
  - Assert the rows-per-page option set and default match pinned origin evidence
    for the data-table example, not the current local demo accident.
  - Change rows per page and assert visible row count, page status, and page
    index all update.
  - Select all rows, deselect one row, and assert aggregate row count and
    checkbox state stay consistent.
- Pagination:
  - Open `PaginationIconsOnly` rows-per-page Select and assert exactly one
    option has the check indicator and `aria-selected=true`.
  - Change rows per page and assert no other option still displays a checkmark.
- Progress:
  - Add a docs test for `ProgressControlled live preview` that changes a
    numeric control or slider and asserts the visible progress ratio and any
    value label change.
- Input OTP:
  - Type `123456` into `InputOTPDemo live preview`.
  - Assert the value display reads `Value: 123456`.
  - Assert all six slots show one digit, backspace removes one digit, and input
    can resume after the second digit.
- Slider:
  - Drag and keyboard-step at least `SliderDemo`, `SliderRange`, and
    `SliderVertical`.
  - Assert thumb position, `aria-valuenow`, and visible range dimensions change.

**Verify red**:

```bash
bunx playwright test tests/e2e --grep "combobox|data table|pagination|progress|input otp|slider"
```

Expected before source fixes: exit nonzero, with at least one failing assertion
for every component group above. If any group unexpectedly passes, stop and
record which assertion passed and which user report it contradicts.

### Step 2: Add focused model/update tests

Extend `src/scene.test.ts` only where a bug is model-driven:

- Combobox input/value/open state after clear, last-character delete, and custom
  item selection.
- Data-table page-size and selection aggregate transitions.
- Pagination rows-per-page Select value.
- Progress controlled value.
- OTP insert, paste, delete, and backspace.
- Slider pointer/keyboard value changes.

**Verify red or useful coverage**:

```bash
bun run test -- src/scene.test.ts src/registry/shadcn/combobox/combobox.test.ts src/registry/shadcn/data-table/data-table.test.ts src/registry/shadcn/input-otp/input-otp.test.ts src/registry/shadcn/pagination/pagination.test.ts src/registry/shadcn/progress/progress.test.ts src/registry/shadcn/slider/slider.test.ts
```

Expected before source fixes: tests that assert the reported broken behavior
fail. Existing unrelated tests should keep their previous result.

### Step 3: Fix state and view wiring

Implement the smallest Foldkit-native changes:

- Keep all live state in `src/main.ts` Schema model fields and update through
  fact messages. Use `evo()` for immutable updates.
- For combobox, keep `inputValue`, selected value(s), highlighted value, and
  filtered items synchronized after every input edit, clear press, item press,
  and chip removal. Do not derive the input from the selected label after the
  user manually clears the text.
- Replace literal `v` and `x` button text in combobox examples with local icon
  helpers or accessible icon-only markup. Preserve accessible names.
- Make `ComboboxWithCustomItems` use its documented custom item array in the
  live registration.
- For data-table and pagination, use the origin rows-per-page contract and make
  Select item checked indicators reflect only the active value.
- Convert progress controlled docs from static to live state. Use existing
  Foldkit input/slider patterns instead of raw DOM mutation.
- Repair OTP logical input handling so all six digits can be typed or pasted.
- Repair slider pointer/keyboard handling if the red tests show values are not
  changing.

**Verify**:

```bash
bunx playwright test tests/e2e --grep "combobox|data table|pagination|progress|input otp|slider"
bun run test -- src/scene.test.ts src/registry/shadcn/combobox/combobox.test.ts src/registry/shadcn/data-table/data-table.test.ts src/registry/shadcn/input-otp/input-otp.test.ts src/registry/shadcn/pagination/pagination.test.ts src/registry/shadcn/progress/progress.test.ts src/registry/shadcn/slider/slider.test.ts
```

Expected after fixes: exit 0.

### Step 4: Regenerate artifacts only if needed

If source snippets, docs metadata, or registry source changed, run:

```bash
bun run registry:build
```

Expected: generated artifacts update deterministically.

## Done criteria

- [ ] New tests fail on the current broken behavior before implementation.
- [ ] Combobox prefilled clear, final-character deletion, clear button, custom
      items, popup anchoring, and caret icon behavior pass.
- [ ] Data-table rows-per-page and checkbox aggregate behavior pass.
- [ ] Pagination rows-per-page shows only one selected check indicator.
- [ ] Progress exposes a working control input.
- [ ] Input OTP accepts six digits and supports delete/backspace.
- [ ] Slider examples respond to pointer and keyboard input.
- [ ] `bun run test`, focused Playwright, `bun run typecheck`,
      `bun run registry:check`, and `bun run check` pass.
- [ ] No files outside the in-scope list are modified, except generated
      registry/docs/index/public artifacts after `registry:build`.

## STOP conditions

- A fix requires local mutable state outside the Foldkit model/update path.
- A fix requires importing React, Radix, upstream Base UI React, or upstream
  shadcn runtime code into installable source.
- A user-reported issue cannot be reproduced by a test after two reasonable
  attempts. Stop and report the exact manual/browser evidence instead.
- Data-table rows-per-page behavior conflicts with pinned origin evidence. Stop
  and ask whether to follow origin or this repo's docs-specific sample data.

## Maintenance notes

Reviewers should compare the new red tests to the user's list, not merely to
the older Plan 105/106 acceptance tests. The old tests are still valuable, but
they were too broad to catch the exact regressions shown in the current
screenshots.
