# Plan 100: Implement shadcn Date Picker with native Foldkit Calendar

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat 01b837f0..HEAD -- registry-src/shadcn/date-picker src/registry/shadcn/date-picker src/live-examples.ts src/main.ts scripts/registry-common.ts scripts/registry-component-progress-common.test.ts docs/component-conversion-checklist.json registry`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plan 078 (`shadcn/calendar`), Plan 034 (`shadcn/popover`), Plan 038 (`shadcn/field`), Plan 072 (`shadcn/input-group`)
- **Category**: direction
- **Planned at**: commit `01b837f0`, 2026-07-02

## Why this matters

`shadcn/date-picker` is still blocked even though its local foundations now
exist. The remaining hard part is choosing the right Foldkit-native date model:
the current shadcn Calendar wrapper predates the native `Calendar` APIs and
stores ISO strings, while `@foldkit/ui/DatePicker` already owns a Calendar
submodel using `Calendar.CalendarDate`. This plan promotes Date Picker as an
installable shadcn component by wrapping the native Foldkit UI DatePicker,
styling it like the shadcn base-nova examples, and rejecting the origin
`react-day-picker`, `date-fns`, and `chrono-node` runtimes.

## Current state

- `docs/component-conversion-checklist.json` still marks `shadcn/date-picker`
  as blocked. It has docs/example evidence, no primary source, and unresolved
  questions about local date modeling:

```json
// docs/component-conversion-checklist.json:2328-2354
{
  "itemId": "shadcn/date-picker",
  "originResolutionStatus": "docs-example-only",
  "hasOriginDocs": true,
  "hasOriginSource": false,
  "hasRegistryItem": false,
  "implementationStatus": "dossier-ready",
  "availability": "private",
  "blockers": [
    "No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.",
    "Local calendar/date behavior, popover, field, and input foundations must exist before installable source.",
    "Range, time, locale, and natural-language parsing decisions must be modeled without React DayPicker runtime source."
  ],
  "unresolvedQuestions": [
    "Which local calendar/date model should own single date, range, time, locale, and natural-language parsing flows?",
    "Which parsing and formatting dependencies are acceptable as fixture evidence versus deferred runtime behavior?"
  ]
}
```

- The held-row dossier evidence for Date Picker is docs/example-only and points
  to origin examples plus rejected runtime hints:

```md
<!-- plans/artifacts/098-blocked-component-foundation-preview/plan-preview.md:47-82 -->

- Missing primary source: `repos/ui/apps/v4/styles/base-nova/ui/date-picker.tsx`
- Evidence paths:
  - `repos/ui/apps/v4/content/docs/components/base/date-picker.mdx`
  - `repos/ui/apps/v4/examples/base/date-picker-basic.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-demo.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-dob.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-input.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-natural-language.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-range.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-rtl.tsx`
  - `repos/ui/apps/v4/examples/base/date-picker-time.tsx`
- Runtime hints: `chrono-node`, `date-fns`, `react`, `react-day-picker`
- Registry hints: `shadcn/button`, `shadcn/calendar`, `shadcn/field`,
  `shadcn/input`, `shadcn/input-group`, `shadcn/popover`
```

- The dependency policy already rejects the problematic upstream date packages:

```md
<!-- plans/artifacts/098-blocked-component-foundation-preview/plan-preview.md:194-203 -->

- `react-day-picker`: `reject-or-defer`
- `date-fns`: `reject-or-defer`
- `chrono-node`: `reject-or-defer`
```

- `foldkit` exports the native `Calendar` namespace. Use this import in new
  project source when date calculations are needed:

```ts
// node_modules/foldkit/dist/index.d.ts:1
export * as Calendar from './calendar/public.js'
```

- Native Calendar already has the date helpers this plan needs:

```ts
// repos/foldkit/packages/foldkit/src/calendar/public.ts:1-41
export {
  addDays,
  addMonths,
  addYears,
  CalendarDate,
  CalendarDateFromIsoString,
  defaultEnglishLocale,
  formatLong,
  formatShort,
  make,
  subtractDays,
  subtractMonths,
  subtractYears,
  today,
} from './index.js'
```

```ts
// repos/foldkit/packages/foldkit/src/calendar/calendarDate.ts:73-122
export const CalendarDate = S.Struct({
  year: S.Int,
  month: S.Int.check(S.isBetween({ minimum: 1, maximum: 12 })),
  day: S.Int.check(S.isBetween({ minimum: 1, maximum: 31 })),
}).check(/* validates real month/day combinations */)

export const make = (year: number, month: number, day: number): CalendarDate =>
  S.decodeUnknownSync(CalendarDate)({ year, month, day })
```

```ts
// repos/foldkit/packages/foldkit/src/calendar/calendarDate.ts:217-240
export const CalendarDateFromIsoString = S.String.pipe(
  S.decodeTo(
    CalendarDate,
    SchemaTransformation.transformOrFail({
      decode: input => {
        /* accepts only YYYY-MM-DD */
      },
      encode: ({ year, month, day }) =>
        Effect.succeed(
          `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        ),
    }),
  ),
)
```

```ts
// repos/foldkit/packages/foldkit/src/calendar/arithmetic.ts:76-139
export const addDays = Function.dual(2, (self, n) =>
  n === 0 ? self : fromRataDie(toRataDie(self) + n),
)

export const addMonths = Function.dual(2, (self, n) => {
  const totalMonthsFromZero = self.year * MONTHS_PER_YEAR + (self.month - 1) + n
  const newDay = Math.min(self.day, daysInMonth(newYear, newMonth))
  return unsafeMake(newYear, newMonth, newDay)
})
```

- `@foldkit/ui` already exports a native DatePicker. The installed package has
  the same public export:

```ts
// node_modules/@foldkit/ui/dist/index.d.ts:4
export * as DatePicker from './datePicker/public.js'
```

- The native DatePicker model owns a selected `CalendarDate`, a Calendar
  submodel, and a Popover submodel. It emits an `OutMessage` when a date is
  selected:

```ts
// repos/foldkit/packages/ui/src/datePicker/index.ts:20-25
export const Model = S.Struct({
  id: S.String,
  maybeSelectedDate: S.Option(Calendar.CalendarDate),
  calendar: UiCalendar.Model,
  popover: Popover.Model,
})
```

```ts
// repos/foldkit/packages/ui/src/datePicker/index.ts:84-89
export const SelectedDate = m('SelectedDate', {
  date: Calendar.CalendarDate,
})

export const OutMessage = S.Union([ChangedViewMonth, SelectedDate])
```

```ts
// repos/foldkit/packages/ui/src/datePicker/index.ts:97-138
export type InitConfig = Readonly<{
  id: string
  today: CalendarDate
  initialSelectedDate?: CalendarDate
  locale?: Calendar.LocaleConfig
  minDate?: CalendarDate
  maxDate?: CalendarDate
  disabledDaysOfWeek?: ReadonlyArray<Calendar.DayOfWeek>
  disabledDates?: ReadonlyArray<CalendarDate>
}>

export const init = (config: InitConfig): Model => ({
  maybeSelectedDate: Option.fromNullishOr(config.initialSelectedDate),
  calendar: UiCalendar.init({
    /* same native CalendarDate config */
  }),
  popover: Popover.init({ id: `${config.id}-popover`, contentFocus: true }),
})
```

```ts
// repos/foldkit/packages/ui/src/datePicker/index.ts:408-533
export type ViewInputs = Readonly<{
  anchor: AnchorConfig
  triggerContent: (maybeDate: Option.Option<CalendarDate>) => Html
  toCalendarView: (attributes: UiCalendar.CalendarAttributes) => Html
  name?: string
  triggerClassName?: string
  panelClassName?: string
}>

export const view = defineView<Model, Message, ViewInputs>(
  (model, viewInputs) => {
    const calendarVNode = h.submodel({
      model: model.calendar,
      view: UiCalendar.view,
      viewInputs: { toView: toCalendarView },
      toParentMessage: message => GotCalendarMessage({ message }),
    })
    /* Popover trigger/panel plus optional hidden input */
  },
)
```

- Foldkit website has the closest framework-native implementation reference:

```ts
// repos/foldkit/packages/website/src/page/ui/datePicker.ts:4-5
import { DatePicker } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/popover'
```

```ts
// repos/foldkit/packages/website/src/page/ui/datePicker.ts:96-109
return [
  h.submodel({
    slotId: model.datePickerBasicDemo.id,
    model: model.datePickerBasicDemo,
    view: DatePicker.view,
    viewInputs: {
      anchor: DATE_PICKER_ANCHOR,
      triggerContent,
      triggerClassName,
      panelClassName,
      backdropClassName,
      className: wrapperClassName,
      toCalendarView: attributes =>
        M.value(attributes).pipe(M.tagsExhaustive({ /* Days, Months, Years */ })),
    },
```

- The existing `shadcn/calendar` helper should be treated as style/reference,
  not the date-picker state model. It currently stores ISO strings and performs
  its own `Date` arithmetic:

```ts
// src/registry/shadcn/calendar/index.ts:36-40
export const CalendarState = S.Struct({
  visibleMonth: S.String,
  selectedDate: S.OptionFromNullOr(S.String),
  focusedDate: S.OptionFromNullOr(S.String),
})
```

```ts
// src/registry/shadcn/calendar/index.ts:77-141
const dateFromParts = (year: number, month: number, day: number): Date =>
  new Date(Date.UTC(year, month - 1, day))

const addDays = (isoDate: string, delta: number): string => {
  /* local Date */
}
export const addMonths = (monthKey: string, delta: number): string => {
  /* local Date */
}
```

- Live examples currently have special state plumbing for ISO-string Calendar
  examples:

```ts
// src/main.ts:177
liveExampleCalendarSelectedDates: S.Record(S.String, S.String),
```

```ts
// src/live-examples.ts:1715-1728
const calendarExample = (
  view: CalendarExampleView,
  defaultSelectedDate?: string,
): LiveExampleDefinition => ({
  render: (example, context) => {
    const selectedDate = context.calendarSelectedDateFor(
      example,
      defaultSelectedDate,
    )
    return view({
      ...(selectedDate === undefined ? {} : { selectedDate }),
      onSelectDate: change => context.onCalendarSelectDate(example, change),
    })
  },
})
```

Date Picker needs new live-preview state for native `DatePicker.Model` rather
than reusing `liveExampleCalendarSelectedDates`.

## Commands you will need

| Purpose                      | Command                                                                                                                                                                                                  | Expected on success                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Check origin/progress status | `bun run origin:components:status`                                                                                                                                                                       | exit 0; `shadcn/date-picker` appears blocked/private before the work   |
| Build registry artifacts     | `bun run registry:build`                                                                                                                                                                                 | exit 0; generated registry/docs artifacts include `shadcn/date-picker` |
| Refresh checklist            | `bun run origin:components:write`                                                                                                                                                                        | exit 0; `docs/component-conversion-checklist.json` is updated          |
| Registry gate                | `bun run registry:check`                                                                                                                                                                                 | exit 0                                                                 |
| Focused tests                | `bun run test -- src/registry/shadcn/date-picker/date-picker.test.ts scripts/registry-component-progress-common.test.ts src/scene.test.ts`                                                               | exit 0; all focused tests pass                                         |
| Full relevant tests          | `bun run test -- src/registry/validation.test.ts scripts/origin-common.test.ts scripts/registry-component-progress-common.test.ts src/registry/shadcn/date-picker/date-picker.test.ts src/scene.test.ts` | exit 0                                                                 |
| Typecheck                    | `bun run typecheck`                                                                                                                                                                                      | exit 0                                                                 |
| Lint/check                   | `bun run check`                                                                                                                                                                                          | exit 0                                                                 |
| Build                        | `bun run build`                                                                                                                                                                                          | exit 0                                                                 |

Do not run `bun x ultracite fix` unless the operator explicitly asks; use
targeted edits and then `bun run check`.

## Suggested executor toolkit

- Use the `foldkit` skill if available. This is Foldkit model/message/submodel
  work, not React porting.
- Read `repos/foldkit/packages/ui/src/datePicker/index.ts` before writing the
  wrapper and keep it open while implementing.
- Read `repos/foldkit/packages/website/src/page/ui/datePicker.ts` for the
  native DatePicker + `toCalendarView` adapter pattern.
- Read `src/registry/shadcn/calendar/index.ts` only for base-nova class tokens
  and visual affordances. Do not copy its ISO-string date model into Date Picker.

## Scope

**In scope**:

- `registry-src/shadcn/date-picker/item.json` (create)
- `registry-src/shadcn/date-picker/docs.md` (create)
- `src/registry/shadcn/date-picker/index.ts` (create)
- `src/registry/shadcn/date-picker/examples.ts` (create)
- `src/registry/shadcn/date-picker/date-picker.test.ts` (create)
- `src/live-examples.ts`
- `src/main.ts`
- `scripts/registry-common.ts`
- `scripts/registry-component-progress-common.test.ts`
- Generated registry/docs/checklist artifacts produced by the repo scripts:
  `registry/docs/shadcn/date-picker.json`, `registry/docs/index.json`,
  `registry/index.json`, `registry/shadcn/date-picker.json` if generated by
  the local build, and `docs/component-conversion-checklist.json`.
- Any existing generated docs data file touched by `bun run registry:build` or
  `bun run origin:components:write` as a direct consequence of adding the item.

**Out of scope**:

- Do not rewrite `src/registry/shadcn/calendar/index.ts` in this plan. It can be
  modernized later, but Date Picker should use native `@foldkit/ui/DatePicker`
  now.
- Do not add runtime dependencies on `react`, `react-day-picker`, `date-fns`,
  `chrono-node`, `lucide-react`, or origin-only language selector modules.
- Do not implement range selection unless `@foldkit/ui/DatePicker` exposes a
  native range API in the installed version. At planned-at commit `01b837f0`,
  it only exposes single-date selection.
- Do not implement origin natural-language parsing. Native Calendar supports
  ISO decoding; natural-language parsing is not a date calculation primitive and
  should remain a documented deviation.
- Do not implement time selection in this plan. Time composition needs its own
  model and examples.
- Do not change unrelated held rows (`shadcn/data-table`, `shadcn/chart`) or the
  docs shell layout.

## Git workflow

- Branch: use the current branch unless the operator instructs otherwise. If
  creating a branch manually, use `codex/100-shadcn-date-picker-native-calendar`.
- Commit style: conventional commits are used in recent history. Suggested
  commit message after execution: `feat: add shadcn date picker`.
- Do not push or open a PR unless explicitly instructed.

## Steps

### Step 1: Reconfirm dependency readiness and API availability

Run:

```sh
bun run origin:components:status
rg -n "export \\* as Calendar" node_modules/foldkit/dist/index.d.ts
rg -n "export \\* as DatePicker" node_modules/@foldkit/ui/dist/index.d.ts
```

Confirm:

- `shadcn/date-picker` is still blocked/private before edits.
- `foldkit` exports `Calendar`.
- `@foldkit/ui` exports `DatePicker`.

If any export is missing, STOP. Do not invent a date picker from scratch in this
plan.

**Verify**: the commands exit 0 and show the expected exports.

### Step 2: Create the registry source metadata and docs sidecar

Create `registry-src/shadcn/date-picker/item.json` with:

- `id`: `shadcn/date-picker`
- `namespace`: `shadcn`
- `name`: `Date Picker`
- `kind`: `component`
- `installableSourcePaths`:
  - `src/registry/shadcn/date-picker/index.ts`
  - `src/registry/shadcn/date-picker/examples.ts`
- `originProvenance` using docs/example-only evidence from the plan-preview:
  - `sourcePaths`: empty array
  - `docsPaths`: both base and radix date-picker MDX docs
  - `examplePaths`: all base/radix date-picker examples listed in current state
  - public registry JSON paths for demo/form/presets/range
- `dependencies.registry`:
  - `shadcn/button`
  - `shadcn/calendar`
  - `shadcn/field`
  - `shadcn/input`
  - `shadcn/input-group`
  - `shadcn/popover`
  - `utils/cn`
- `dependencies.runtime`:
  - `foldkit`
  - `@foldkit/ui`
  - `effect`
  - `clsx`
  - `tailwind-merge`
- `dependencies.development` / fixture-only or reject/defer:
  - `react`, `react-day-picker`, `date-fns`, `date-fns/locale`,
    `react-day-picker/locale`, `lucide-react`,
    `@/components/language-selector` as `dev-or-fixture-only`
  - `chrono-node` as `reject-or-defer`
- `examples` for the supported live-ready subset:
  - `DatePickerDemo`
  - `DatePickerBasic`
  - `DatePickerDob`
  - `DatePickerInput`
  - `DatePickerRtl`
- `deviations`:
  - docs/example-only source provenance
  - native Foldkit Calendar/DatePicker instead of React DayPicker
  - local inline SVG icons instead of lucide-react
  - deferred range/time/natural-language examples
- `lifecycle`: `implemented`, `accepted`, `current`, `installable`, `complete`

Create `registry-src/shadcn/date-picker/docs.md` with:

- Overview: wrapper over native Foldkit UI DatePicker and Calendar.
- Foldkit Model: parent owns a `DatePicker.Model` submodel and delegates
  `DatePicker.Message` through `DatePicker.update`.
- Usage: import the generated helper; initialize with `Calendar.make(...)` or
  `Calendar.today` at app boundary; use `Calendar.CalendarDateFromIsoString` for
  ISO input examples.
- Examples: list the five supported live examples and explicitly mention range,
  time, and natural-language examples are deferred.
- Foldkit Differences: no React DayPicker, no date-fns, no chrono-node runtime.

**Verify**:

```sh
test -f registry-src/shadcn/date-picker/item.json
test -f registry-src/shadcn/date-picker/docs.md
node -e "const item=require('./registry-src/shadcn/date-picker/item.json'); console.log(item.id, item.lifecycle.availability, item.examples.map(e=>e.title).join(','))"
```

Expected output includes:

```text
shadcn/date-picker installable DatePickerDemo,DatePickerBasic,DatePickerDob,DatePickerInput,DatePickerRtl
```

### Step 3: Implement the shadcn Date Picker wrapper

Create `src/registry/shadcn/date-picker/index.ts`.

Required architecture:

- Import native Calendar as:

```ts
import { Calendar } from 'foldkit'
```

- Import native UI DatePicker as:

```ts
import { DatePicker as UiDatePicker } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/popover'
```

- Re-export or wrap native types so examples and consumers do not need to know
  the internal `UiDatePicker` alias. Suggested public names:
  - `DatePickerModel`
  - `DatePickerMessage`
  - `DatePickerOutMessage`
  - `datePickerInit`
  - `datePickerUpdate`
  - `DatePicker` view helper
- `DatePicker` should be a Foldkit helper that renders an outer `h.submodel`
  with `view: UiDatePicker.view`, `model`, `toParentMessage`, and shadcn-styled
  `viewInputs`.
- `triggerContent` must format selected dates with
  `Calendar.formatLong(date, locale ?? Calendar.defaultEnglishLocale)` or
  `Calendar.formatShort` where compact examples need it.
- The optional hidden field must use native DatePicker's `name` support. Do not
  manually add a second hidden input.
- `toCalendarView` must handle all native UI Calendar attribute variants:
  `Days`, `Months`, and `Years`, matching the website exemplar and applying
  shadcn/base-nova classes from the existing Calendar item where practical.
- Use inline SVG icon helpers or existing local icon conventions. Do not import
  `lucide-react`.
- All date calculation in this file must use `Calendar` helpers. If a needed
  primitive is genuinely absent, use an Effect primitive and document the reason
  in a short code-level name/test, not a vague comment.

Target API shape:

```ts
export type DatePickerController<Message> = Readonly<{
  model: DatePickerModel
  toParentMessage: (message: DatePickerMessage) => Message
}>

export type DatePickerConfig<Message> = DatePickerController<Message> &
  Readonly<{
    placeholder?: string
    name?: string
    locale?: Calendar.LocaleConfig
    anchor?: AnchorConfig
    className?: string
    triggerClassName?: string
    panelClassName?: string
    isDisabled?: boolean
  }>

export const DatePicker = <Message>(
  config: DatePickerConfig<Message>,
): Html => {
  /* h.submodel with UiDatePicker.view */
}
```

**Verify**:

```sh
bun run typecheck
```

Expected: exit 0. If this fails because exports from `@foldkit/ui` differ from
the vendored reference, STOP and report the mismatch.

### Step 4: Add live-ready examples with native Calendar dates

Create `src/registry/shadcn/date-picker/examples.ts`.

Required examples:

- `DatePickerDemo`: default shadcn docs style trigger with selected date and
  popover Calendar.
- `DatePickerBasic`: minimal date picker with placeholder.
- `DatePickerDob`: birthdate picker using `minDate` / `maxDate` native Calendar
  constraints.
- `DatePickerInput`: date picker composed with `shadcn/input` or
  `shadcn/input-group`; ISO input parsing uses
  `Schema.decodeUnknownEither(Calendar.CalendarDateFromIsoString)` or the
  repo's established Schema decode pattern. Invalid input should stay visible
  and not crash.
- `DatePickerRtl`: direction-aware wrapper and locale labels using
  `Calendar.LocaleConfig`; do not depend on `date-fns/locale` or
  `react-day-picker/locale`.

Each example must accept an optional controller instead of creating hidden
global state:

```ts
export type DatePickerExampleController<Message = never> = Readonly<{
  model: DatePickerModel
  toParentMessage: (message: DatePickerMessage) => Message
}>

export const DatePickerDemo = <Message = never>(
  controller?: DatePickerExampleController<Message>,
): Html => {
  /* static fallback only for code preview, live preview supplies controller */
}
```

The static fallback may call `datePickerInit` with a deterministic
`Calendar.make(2025, 6, 12)` today value so generated snippets render without
runtime flags.

**Verify**:

```sh
bun run test -- src/registry/shadcn/date-picker/date-picker.test.ts
```

Expected at this step: the command may fail because tests are not created yet,
but TypeScript import errors from `examples.ts` should be addressed before
moving on.

### Step 5: Wire Date Picker into docs live previews

Update `src/main.ts` and `src/live-examples.ts` with a new native DatePicker
live state path. Do not reuse `liveExampleCalendarSelectedDates`.

In `src/main.ts`:

- Import the generated Date Picker model/message types from
  `src/registry/shadcn/date-picker`.
- Add a model field for date picker submodels. The exact schema must be
  serializable and match the native UI model, for example:

```ts
liveExampleDatePickerStates: S.Record(S.String, DatePickerModel),
```

- Initialize it to `{}`.
- Add a message such as:

```ts
export const GotLiveExampleDatePickerMessage = m(
  'GotLiveExampleDatePickerMessage',
  {
    exampleId: S.String,
    message: DatePickerMessage,
    initialModel: DatePickerModel,
  },
)
```

- In `update`, find the current model from the record or use `initialModel`,
  delegate through `datePickerUpdate`, store the next model, and map returned
  commands back to `GotLiveExampleDatePickerMessage`. If an OutMessage is
  returned, keep it lifted into the stored submodel state; do not add a parallel
  ISO-string selected-date record unless a specific example requires an
  external domain value.

In `src/live-examples.ts`:

- Import the new examples and controller type.
- Extend `LiveExampleContext` with:
  - `datePickerStateFor(example, initialModel): DatePickerModel`
  - `onDatePickerMessage(example, message, initialModel): Message`
- Add a helper like `datePickerExample(view, initialConfig)` that constructs the
  deterministic initial model with `Calendar.make(...)`, retrieves the current
  stored model, and passes a controller into the example.
- Register all supported examples in `liveExampleDefinitions`.

Important: DatePicker commands can include focus/popover commands from the
native submodels. Preserve and map those commands exactly like other submodel
examples do; do not drop commands to make the compiler pass.

**Verify**:

```sh
bun run typecheck
```

Expected: exit 0.

### Step 6: Register live-ready examples in registry tooling

Update `scripts/registry-common.ts` so `liveReadyExampleExportsByItemId` includes:

```ts
'shadcn/date-picker': new Set([
  'DatePickerDemo',
  'DatePickerBasic',
  'DatePickerDob',
  'DatePickerInput',
  'DatePickerRtl',
])
```

Update `scripts/registry-component-progress-common.test.ts`:

- Remove the assertion that `shadcn/date-picker` readiness is `blocked`.
- Add/adjust assertions so Date Picker is imported/installable and only truly
  blocked rows remain blocked.

**Verify**:

```sh
bun run test -- scripts/registry-component-progress-common.test.ts
```

Expected: exit 0.

### Step 7: Add focused tests

Create `src/registry/shadcn/date-picker/date-picker.test.ts`.

Required test coverage:

- `datePickerInit` stores native `Calendar.CalendarDate` values and exposes a
  hidden ISO value when `name` is supplied.
- Opening the picker delegates through the native Popover/Calendar submodels and
  does not crash.
- Selecting a day updates `maybeSelectedDate`, emits a native `SelectedDate`
  OutMessage, and closes the popover.
- `DatePickerInput` accepts a valid ISO date through
  `Calendar.CalendarDateFromIsoString` and rejects invalid/non-ISO strings
  without crashing.
- `DatePickerDob` enforces `minDate` / `maxDate` through native DatePicker
  config, not local string comparisons.
- Render smoke for `DatePickerDemo`, `DatePickerBasic`, `DatePickerDob`,
  `DatePickerInput`, and `DatePickerRtl`.

Follow the local testing style from nearby registry tests:

- Use `foldkit/test` Story tests for update-level behavior where practical.
- Use Scene tests for accessible render/interactions.
- Keep test file names beside the source.

**Verify**:

```sh
bun run test -- src/registry/shadcn/date-picker/date-picker.test.ts
```

Expected: exit 0 and all new tests pass.

### Step 8: Generate registry/docs artifacts and refresh the checklist

Run:

```sh
bun run registry:build
bun run origin:components:write
```

Then check:

```sh
node - <<'NODE'
const docs = require('./registry/docs/shadcn/date-picker.json')
const checklist = require('./docs/component-conversion-checklist.json')
const row = checklist.components.find((item) => item.itemId === 'shadcn/date-picker')
console.log(docs.itemId, docs.lifecycle.availability, docs.examples.map((example) => example.previewStatus).join(','))
console.log(row.itemId, row.availability, row.readiness)
NODE
```

Expected output:

```text
shadcn/date-picker installable live,live,live,live,live
shadcn/date-picker installable ready
```

If the generated checklist uses a different readiness word for implemented
installable components, match the established value used by other completed
rows. Do not hand-edit generated files except through the repo scripts.

**Verify**:

```sh
bun run registry:check
```

Expected: exit 0.

### Step 9: Add route smoke coverage if needed

If `src/scene.test.ts` already has a generic component-detail route smoke that
covers every docs artifact, no new route test is required. If Date Picker is not
covered by an existing generic route test, add a focused scene test that:

- navigates to `/components/shadcn/date-picker`
- asserts the page heading is `Date Picker`
- asserts an install command or import snippet is present
- asserts each supported example renders a `.live-example-preview`

**Verify**:

```sh
bun run test -- src/scene.test.ts
```

Expected: exit 0.

### Step 10: Run final gates and inspect scope

Run all final verification commands:

```sh
bun run registry:check
bun run test -- src/registry/validation.test.ts scripts/origin-common.test.ts scripts/registry-component-progress-common.test.ts src/registry/shadcn/date-picker/date-picker.test.ts src/scene.test.ts
bun run typecheck
bun run check
bun run build
git status --short
```

Expected:

- All commands exit 0.
- `git status --short` shows only in-scope source, registry, docs/checklist, and
  generated artifacts plus this plan/index if the executor updates plan status.
- No changes to `src/registry/shadcn/calendar/index.ts`.

## Test plan

- `src/registry/shadcn/date-picker/date-picker.test.ts`: new unit/story/scene
  coverage for native DatePicker initialization, opening, selection, hidden
  input ISO value, invalid input handling, min/max constraints, RTL render, and
  all supported examples.
- `scripts/registry-component-progress-common.test.ts`: update blocked-row
  expectations so Date Picker is no longer blocked.
- `src/scene.test.ts`: add or rely on component-detail route coverage proving
  the generated docs page shows live previews.

Verification:

```sh
bun run test -- src/registry/shadcn/date-picker/date-picker.test.ts scripts/registry-component-progress-common.test.ts src/scene.test.ts
```

Expected: exit 0.

## Done criteria

All must hold:

- [ ] `registry-src/shadcn/date-picker/item.json` exists and marks
      `shadcn/date-picker` installable.
- [ ] `src/registry/shadcn/date-picker/index.ts` uses
      `import { Calendar } from 'foldkit'` for date calculations and wraps
      `@foldkit/ui/DatePicker`.
- [ ] No installable source imports `react-day-picker`, `date-fns`,
      `chrono-node`, `lucide-react`, or `react`.
- [ ] Date Picker examples registered in `scripts/registry-common.ts` all render
      as live previews.
- [ ] `docs/component-conversion-checklist.json` no longer reports
      `shadcn/date-picker` as blocked/private.
- [ ] `bun run registry:check` exits 0.
- [ ] Focused tests and full relevant tests listed above exit 0.
- [ ] `bun run typecheck`, `bun run check`, and `bun run build` exit 0.
- [ ] No out-of-scope files are modified.
- [ ] `plans/README.md` status row for Plan 100 is updated to `DONE` after
      review acceptance, or `BLOCKED (...)` if a STOP condition occurs.

## STOP conditions

Stop and report back if:

- `foldkit` no longer exports `Calendar` from `foldkit`.
- `@foldkit/ui` no longer exports `DatePicker`.
- Native `DatePicker.Model` or `DatePicker.update` in the installed package
  differs materially from the vendored reference in `repos/foldkit`.
- The implementation requires a runtime dependency on React, React DayPicker,
  date-fns, chrono-node, or lucide-react.
- The implementation requires rewriting `src/registry/shadcn/calendar/index.ts`.
- Range, time, or natural-language examples are required for acceptance before a
  native Foldkit model exists for them.
- A verification command fails twice after a reasonable fix attempt.

## Maintenance notes

- This plan intentionally creates Date Picker on the newer native
  `Calendar.CalendarDate` path while leaving the older shadcn Calendar ISO
  helper untouched. A later plan should consider modernizing
  `src/registry/shadcn/calendar/index.ts` to the same native Calendar model so
  the two components converge.
- Reviewers should scrutinize command mapping in the live-preview integration.
  Dropping Popover/Calendar commands will produce subtle focus and open/close
  regressions even if render tests pass.
- Deferred examples should stay documented, not silently omitted: range, time,
  and natural-language parsing are not runtime-supported by native DatePicker at
  planned-at commit `01b837f0`.
