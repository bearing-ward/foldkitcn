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
  datePickerExampleViews,
  decodeIsoDate,
} from './examples'
import {
  DatePicker,
  datePickerClassName,
  datePickerInit,
  datePickerPanelClassName,
  datePickerSelectDate,
  datePickerTriggerClassName,
} from './index'

const update = (state: unknown) => [state, []] as const

const DatePickerManifest = S.Struct({
  examples: S.Array(S.Struct({ id: S.String, title: S.String })),
})

describe('shadcn/date-picker model', () => {
  test('initializes native CalendarDate selection and hidden ISO input', () => {
    const selectedDate = Calendar.make(2025, 6, 12)
    const model = datePickerInit({
      id: 'date-picker-test',
      today: selectedDate,
      initialSelectedDate: selectedDate,
    })

    expect(Option.getOrUndefined(model.maybeSelectedDate)).toStrictEqual(
      selectedDate,
    )

    Scene.scene(
      {
        update,
        view: () =>
          DatePicker({
            model,
            name: 'date',
            toParentMessage: message => message,
          }),
      },
      Scene.with({}),
      Scene.expect(Scene.selector('input[type="hidden"]')).toHaveValue(
        '2025-06-12',
      ),
    )
  })

  test('selects a date through the native DatePicker update helper', () => {
    const today = Calendar.make(2025, 6, 12)
    const selectedDate = Calendar.make(2025, 6, 14)
    const [nextModel, _commands, maybeOutMessage] = datePickerSelectDate(
      datePickerInit({ id: 'date-picker-select', today }),
      selectedDate,
    )

    expect(Option.getOrUndefined(nextModel.maybeSelectedDate)).toStrictEqual(
      selectedDate,
    )
    expect(Option.getOrUndefined(maybeOutMessage)).toStrictEqual({
      _tag: 'SelectedDate',
      date: selectedDate,
    })
  })

  test('decodes valid ISO dates and rejects invalid values without throwing', () => {
    expect(Option.getOrUndefined(decodeIsoDate('2025-06-12'))).toStrictEqual(
      Calendar.make(2025, 6, 12),
    )
    expect(Option.isNone(decodeIsoDate('June 12, 2025'))).toBeTruthy()
    expect(Option.isNone(decodeIsoDate('2025-02-31'))).toBeTruthy()
  })
})

describe('shadcn/date-picker view', () => {
  test('renders the base Date Picker wrapper and examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => DatePickerDemo() },
        Scene.with({}),
        Scene.expect(
          Scene.role('button', { name: /June 12, 2025/u }),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => DatePickerBasic() },
        Scene.with({}),
        Scene.expect(
          Scene.role('button', { name: /January 6, 2025/u }),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => DatePickerDob() },
        Scene.with({}),
        Scene.expect(Scene.text('Date of birth')).toExist(),
      )
      Scene.scene(
        { update, view: () => DatePickerInput() },
        Scene.with({}),
        Scene.expect(Scene.selector('input')).toHaveValue('2025-06-12'),
      )
      Scene.scene(
        { update, view: () => DatePickerRtl() },
        Scene.with({}),
        Scene.expect(Scene.selector('[dir="rtl"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('exposes stable class helpers', () => {
    expect(datePickerClassName('demo')).toContain('demo')
    expect(datePickerTriggerClassName()).toContain('data-[placeholder=true]')
    expect(datePickerTriggerClassName(undefined, true)).toContain('min-w-36')
  })

  test('exposes opaque panel class helpers', () => {
    expect(datePickerPanelClassName()).toContain('bg-white')
    expect(datePickerPanelClassName()).toContain('shadow-lg')
    expect(datePickerPanelClassName(undefined, true)).toContain('p-2')
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
})

describe('shadcn/date-picker installable source', () => {
  test('keeps forbidden runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      'react-day-picker',
      'date-fns',
      'chrono-node',
      'lucide-react',
      'react',
      '@/',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/date-picker/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/date-picker/index.ts',
      'src/registry/shadcn/date-picker/examples.ts',
    ])

    const installableSourceText = [
      indexModule.default,
      examplesModule.default,
    ].join('\n')

    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
