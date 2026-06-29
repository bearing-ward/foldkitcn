/// <reference types="vite/client" />

import { Option } from 'effect'
import { Scene } from 'foldkit'
import { describe, expect, test } from 'vitest'

import {
  CalendarBasic,
  CalendarBookedDates,
  CalendarDemo,
  CalendarRtl,
  calendarExampleViews,
} from './examples'
import {
  Calendar,
  ClickedCalendarNextMonth,
  ClickedCalendarPreviousMonth,
  PressedCalendarKey,
  SelectedCalendarDate,
  addMonths,
  calendarClassName,
  calendarDayButtonClassName,
  calendarMonthDays,
  calendarState,
  updateCalendarState,
} from './index'

const update = (state: unknown) => [state, []] as const

describe('shadcn/calendar date model', () => {
  test('builds a single-month grid with outside, today, selected, and disabled states', () => {
    const days = calendarMonthDays('2025-01', {
      selectedDate: '2025-01-06',
      today: '2025-01-06',
      disabledDates: ['2025-01-12'],
    })
    const selected = days.find(day => day.isoDate === '2025-01-06')
    const disabled = days.find(day => day.isoDate === '2025-01-12')

    expect(days).toHaveLength(35)
    expect(days[0]?.isoDate).toBe('2024-12-29')
    expect(selected?.isSelected).toBe(true)
    expect(selected?.isToday).toBe(true)
    expect(disabled?.isDisabled).toBe(true)
  })

  test('updates selected date, visible month, and keyboard focus', () => {
    const initial = calendarState({ visibleMonth: '2025-01' })
    const selected = updateCalendarState(
      initial,
      SelectedCalendarDate({ date: '2025-02-03' }),
    )
    const focused = updateCalendarState(
      selected,
      PressedCalendarKey({ key: 'ArrowRight' }),
    )

    expect(selected.visibleMonth).toBe('2025-02')
    expect(Option.getOrUndefined(selected.selectedDate)).toBe('2025-02-03')
    expect(Option.getOrUndefined(focused.focusedDate)).toBe('2025-02-04')
  })

  test('moves between months from messages and helpers', () => {
    expect(addMonths('2025-01', -1)).toBe('2024-12')
    expect(addMonths('2025-12', 1)).toBe('2026-01')
    expect(
      updateCalendarState(
        calendarState({ visibleMonth: '2025-01' }),
        ClickedCalendarPreviousMonth(),
      ).visibleMonth,
    ).toBe('2024-12')
    expect(
      updateCalendarState(
        calendarState({ visibleMonth: '2025-01' }),
        ClickedCalendarNextMonth(),
      ).visibleMonth,
    ).toBe('2025-02')
  })
})

describe('shadcn/calendar view', () => {
  test('renders the base-nova calendar surface and day buttons', () => {
    Scene.scene(
      { update, view: () => CalendarDemo() },
      Scene.with({}),
      Scene.expect(Scene.selector('[data-slot="calendar"]')).toHaveAttr(
        'class',
        calendarClassName({ className: 'rounded-lg border' }),
      ),
      Scene.expect(Scene.role('grid')).toExist(),
      Scene.expect(
        Scene.role('button', { name: 'Monday, January 6, 2025' }),
      ).toExist(),
    )
  })

  test('renders basic, booked, and RTL examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => CalendarBasic() },
        Scene.with({}),
        Scene.expect(Scene.selector('[data-slot="calendar"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => CalendarBookedDates() },
        Scene.with({}),
        Scene.expect(
          Scene.role('button', { name: 'Sunday, January 12, 2025' }),
        ).toHaveAttr('disabled'),
      )
      Scene.scene(
        { update, view: () => CalendarRtl() },
        Scene.with({}),
        Scene.expect(Scene.selector('[data-slot="calendar"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
    }).not.toThrow()
  })

  test('supports controlled selection handlers and class helpers', () => {
    const selected = SelectedCalendarDate({ date: '2025-01-07' })

    Scene.scene(
      {
        update,
        view: () =>
          Calendar({
            visibleMonth: '2025-01',
            onSelectDate: () => selected,
          }),
      },
      Scene.with({}),
      Scene.click(Scene.role('button', { name: 'Tuesday, January 7, 2025' })),
    )

    expect(calendarDayButtonClassName()).toContain(
      'data-[selected-single=true]:bg-primary',
    )
  })

  test('keeps manifest examples aligned with exported examples', async () => {
    const manifestModule =
      (await import('../../../../registry-src/shadcn/calendar/item.json?raw')) as Readonly<{
        default: string
      }>
    const manifest = JSON.parse(manifestModule.default) as Readonly<{
      examples: ReadonlyArray<Readonly<{ id: string; title: string }>>
    }>

    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      calendarExampleViews.map(example => example.id),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      calendarExampleViews.map(example => example.title),
    )
  })
})
