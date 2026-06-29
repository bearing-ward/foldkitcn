import type { Html } from 'foldkit/html'

import { Card, CardContent } from '../card'
import { Calendar } from './index'

type CalendarExampleDefinition = Readonly<{
  id: string
  title: string
  view: () => Html
}>

const bookedDates: ReadonlyArray<string> = [
  '2025-01-12',
  '2025-01-13',
  '2025-01-14',
  '2025-01-15',
  '2025-01-16',
  '2025-01-17',
  '2025-01-18',
  '2025-01-19',
  '2025-01-20',
  '2025-01-21',
  '2025-01-22',
  '2025-01-23',
  '2025-01-24',
  '2025-01-25',
  '2025-01-26',
]

export const CalendarDemo = (): Html =>
  Calendar<never>({
    mode: 'single',
    visibleMonth: '2025-01',
    selectedDate: '2025-01-06',
    today: '2025-01-06',
    className: 'rounded-lg border',
    captionLayout: 'dropdown',
  })

export const CalendarBasic = (): Html =>
  Calendar<never>({
    mode: 'single',
    visibleMonth: '2025-01',
    today: '2025-01-06',
    className: 'rounded-lg border',
  })

export const CalendarBookedDates = (): Html =>
  Card<never>({
    className: 'mx-auto w-fit p-0',
    children: [
      CardContent<never>({
        className: 'p-0',
        children: [
          Calendar<never>({
            mode: 'single',
            visibleMonth: '2025-01',
            selectedDate: '2025-01-06',
            today: '2025-01-06',
            disabledDates: bookedDates,
          }),
        ],
      }),
    ],
  })

export const CalendarRtl = (): Html =>
  Calendar<never>({
    mode: 'single',
    visibleMonth: '2025-01',
    selectedDate: '2025-01-06',
    today: '2025-01-06',
    className: 'rounded-lg border [--cell-size:--spacing(9)]',
    captionLayout: 'dropdown',
    dir: 'rtl',
    locale: 'ar-SA',
    weekStartsOn: 6,
  })

export const calendarExampleViews: ReadonlyArray<CalendarExampleDefinition> = [
  {
    id: 'shadcn/calendar-demo',
    title: 'CalendarDemo',
    view: CalendarDemo,
  },
  {
    id: 'shadcn/calendar-basic',
    title: 'CalendarBasic',
    view: CalendarBasic,
  },
  {
    id: 'shadcn/calendar-booked-dates',
    title: 'CalendarBookedDates',
    view: CalendarBookedDates,
  },
  {
    id: 'shadcn/calendar-rtl',
    title: 'CalendarRtl',
    view: CalendarRtl,
  },
]
