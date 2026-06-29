import type { Html } from 'foldkit/html'

import { Card, CardContent } from '../card'
import { Calendar } from './index'
import type { CalendarSelectChange } from './index'

type CalendarExampleDefinition = Readonly<{
  id: string
  title: string
  view: () => Html
}>

export type CalendarExampleController<Message> = Readonly<{
  selectedDate?: string
  onSelectDate?: (change: CalendarSelectChange) => Message
}>

const selectedDateConfig = (
  selectedDate: string | undefined,
): Readonly<{ selectedDate?: string }> =>
  selectedDate === undefined ? {} : { selectedDate }

const selectHandlerConfig = <Message>(
  onSelectDate: ((change: CalendarSelectChange) => Message) | undefined,
): Readonly<{
  onSelectDate?: (change: CalendarSelectChange) => Message
}> => (onSelectDate === undefined ? {} : { onSelectDate })

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

export const CalendarDemo = <Message = never>({
  selectedDate = '2025-01-06',
  onSelectDate,
}: CalendarExampleController<Message> = {}): Html =>
  Calendar<Message>({
    mode: 'single',
    visibleMonth: '2025-01',
    ...selectedDateConfig(selectedDate),
    today: '2025-01-06',
    className: 'rounded-lg border',
    captionLayout: 'dropdown',
    ...selectHandlerConfig(onSelectDate),
  })

export const CalendarBasic = <Message = never>({
  selectedDate,
  onSelectDate,
}: CalendarExampleController<Message> = {}): Html =>
  Calendar<Message>({
    mode: 'single',
    visibleMonth: '2025-01',
    ...selectedDateConfig(selectedDate),
    today: '2025-01-06',
    className: 'rounded-lg border',
    ...selectHandlerConfig(onSelectDate),
  })

export const CalendarBookedDates = <Message = never>({
  selectedDate = '2025-01-06',
  onSelectDate,
}: CalendarExampleController<Message> = {}): Html =>
  Card<Message>({
    className: 'mx-auto w-fit p-0',
    children: [
      CardContent<Message>({
        className: 'p-0',
        children: [
          Calendar<Message>({
            mode: 'single',
            visibleMonth: '2025-01',
            ...selectedDateConfig(selectedDate),
            today: '2025-01-06',
            disabledDates: bookedDates,
            ...selectHandlerConfig(onSelectDate),
          }),
        ],
      }),
    ],
  })

export const CalendarRtl = <Message = never>({
  selectedDate = '2025-01-06',
  onSelectDate,
}: CalendarExampleController<Message> = {}): Html =>
  Calendar<Message>({
    mode: 'single',
    visibleMonth: '2025-01',
    ...selectedDateConfig(selectedDate),
    today: '2025-01-06',
    className: 'rounded-lg border [--cell-size:--spacing(9)]',
    captionLayout: 'dropdown',
    dir: 'rtl',
    locale: 'ar-SA',
    weekStartsOn: 6,
    ...selectHandlerConfig(onSelectDate),
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
