/// <reference types="vite/client" />

import { Option, Schema as S } from 'effect'
import { Calendar, Scene } from 'foldkit'
import { describe, expect, test } from 'vitest'

import {
  DatePickerBasic,
  DatePickerDemo,
  DatePickerDob,
  DatePickerInput,
  DatePickerRtl,
  datePickerDobInitialModel,
  datePickerExampleViews,
  datePickerInputMessageFromIsoValue,
} from './examples'
import {
  DatePicker,
  DatePickerOpened,
  DatePickerOutMessage,
  DatePickerRequestedSelectDate,
  DatePickerSelectedDate,
  datePickerInit,
  datePickerUpdate,
  encodeCalendarDateIso,
} from './index'
import type { DatePickerMessage, DatePickerModel } from './index'

const update = (model: DatePickerModel, message: DatePickerMessage) => {
  const [nextModel, commands] = datePickerUpdate(model, message)
  return [nextModel, commands] as const
}

const initialModel = (): DatePickerModel =>
  datePickerInit({
    id: 'date-picker-test',
    today: Calendar.make(2025, 6, 12),
    initialSelectedDate: Calendar.make(2025, 6, 12),
  })

const DatePickerManifest = S.Struct({
  examples: S.Array(S.Struct({ id: S.String, title: S.String })),
})

describe('shadcn/date-picker native model', () => {
  test('stores native CalendarDate values and exposes a hidden ISO value', () => {
    const model = initialModel()

    expect(Option.getOrUndefined(model.maybeSelectedDate)).toStrictEqual(
      Calendar.make(2025, 6, 12),
    )

    Scene.scene(
      {
        update,
        view: pickerModel =>
          DatePicker({
            model: pickerModel,
            toParentMessage: message => message,
            name: 'appointmentDate',
          }),
      },
      Scene.with(model),
      Scene.expect(Scene.selector('input[name="appointmentDate"]')).toHaveAttr(
        'value',
        '2025-06-12',
      ),
    )
  })

  test('opens through the native popover submodel without crashing', () => {
    const [openedModel] = datePickerUpdate(initialModel(), DatePickerOpened())

    expect(openedModel.popover.isOpen).toBeTruthy()
    expect(openedModel.calendar.viewMode).toBe('Days')
  })

  test('selecting a day updates state, emits SelectedDate, and closes the popover', () => {
    const [openedModel] = datePickerUpdate(initialModel(), DatePickerOpened())
    const selectedDate = Calendar.make(2025, 6, 20)
    const [nextModel, _commands, maybeOutMessage] = datePickerUpdate(
      openedModel,
      DatePickerRequestedSelectDate({ date: selectedDate }),
    )

    expect(Option.getOrUndefined(nextModel.maybeSelectedDate)).toStrictEqual(
      selectedDate,
    )
    expect(nextModel.popover.isOpen).toBeFalsy()
    expect(Option.getOrUndefined(maybeOutMessage)).toStrictEqual(
      DatePickerSelectedDate({ date: selectedDate }),
    )
    expect(() =>
      S.decodeUnknownSync(DatePickerOutMessage)(
        Option.getOrThrow(maybeOutMessage),
      ),
    ).not.toThrow()
  })

  test('DatePickerInput decodes valid ISO dates and rejects invalid values', () => {
    const valid = Option.getOrThrow(
      datePickerInputMessageFromIsoValue('2025-07-04'),
    )

    expect(valid).toStrictEqual(
      DatePickerRequestedSelectDate({
        date: Calendar.make(2025, 7, 4),
      }),
    )
    expect(
      Option.isNone(datePickerInputMessageFromIsoValue('July 4, 2025')),
    ).toBeTruthy()
    expect(
      Option.isNone(datePickerInputMessageFromIsoValue('2025-02-30')),
    ).toBeTruthy()
  })

  test('DatePickerDob uses native minDate and maxDate config', () => {
    const model = datePickerDobInitialModel()

    expect(Option.getOrUndefined(model.calendar.maybeMinDate)).toStrictEqual(
      Calendar.make(1900, 1, 1),
    )
    expect(Option.getOrUndefined(model.calendar.maybeMaxDate)).toStrictEqual(
      Calendar.make(2025, 6, 12),
    )
  })
})

describe('shadcn/date-picker view', () => {
  test('renders supported examples', () => {
    const examples = [
      DatePickerDemo,
      DatePickerBasic,
      DatePickerDob,
      DatePickerInput,
      DatePickerRtl,
    ]

    examples.map(view =>
      expect(() => {
        Scene.scene(
          {
            update: (state: unknown) => [state, []] as const,
            view: () => view(),
          },
          Scene.with({}),
          Scene.expect(Scene.selector('button')).toExist(),
        )
      }).not.toThrow(),
    )
  })

  test('keeps manifest examples aligned with exported examples', async () => {
    const manifestModule: Readonly<{ default: string }> =
      await import('../../../../registry-src/shadcn/date-picker/item.json?raw')
    const manifest = S.decodeUnknownSync(DatePickerManifest)(
      JSON.parse(manifestModule.default),
    )

    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      datePickerExampleViews.map(example => example.id),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      datePickerExampleViews.map(example => example.title),
    )
  })

  test('encodes CalendarDate values as ISO strings', () => {
    expect(encodeCalendarDateIso(Calendar.make(2025, 6, 12))).toBe('2025-06-12')
  })
})
