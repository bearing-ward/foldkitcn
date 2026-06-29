import { Array, Match as M, Option, Schema as S, pipe } from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import { cn } from '../../../utils/cn'
import { buttonVariants } from '../button'

// MODEL

type Child = Html | string

export const CalendarDirection = S.Union([S.Literal('ltr'), S.Literal('rtl')])
export type CalendarDirection = typeof CalendarDirection.Type

export const CalendarCaptionLayout = S.Union([
  S.Literal('label'),
  S.Literal('dropdown'),
])
export type CalendarCaptionLayout = typeof CalendarCaptionLayout.Type

export const CalendarSelectionMode = S.Union([S.Literal('single')])
export type CalendarSelectionMode = typeof CalendarSelectionMode.Type

export const CalendarDay = S.Struct({
  isoDate: S.String,
  year: S.Number,
  month: S.Number,
  day: S.Number,
  weekday: S.Number,
  isOutside: S.Boolean,
  isToday: S.Boolean,
  isSelected: S.Boolean,
  isDisabled: S.Boolean,
})
export type CalendarDay = typeof CalendarDay.Type

export const CalendarState = S.Struct({
  visibleMonth: S.String,
  selectedDate: S.OptionFromNullOr(S.String),
  focusedDate: S.OptionFromNullOr(S.String),
})
export type CalendarState = typeof CalendarState.Type

export const CalendarStateOptions = S.Struct({
  visibleMonth: S.optional(S.String),
  selectedDate: S.optional(S.OptionFromNullOr(S.String)),
  focusedDate: S.optional(S.OptionFromNullOr(S.String)),
})
export type CalendarStateOptions = typeof CalendarStateOptions.Type

export const SelectedCalendarDate = m('SelectedCalendarDate', {
  date: S.String,
})
export const PressedCalendarKey = m('PressedCalendarKey', {
  key: S.String,
})
export const ClickedCalendarPreviousMonth = m('ClickedCalendarPreviousMonth')
export const ClickedCalendarNextMonth = m('ClickedCalendarNextMonth')

export const CalendarMessage = S.Union([
  SelectedCalendarDate,
  PressedCalendarKey,
  ClickedCalendarPreviousMonth,
  ClickedCalendarNextMonth,
])
export type CalendarMessage = typeof CalendarMessage.Type

export const calendarState = (
  options: CalendarStateOptions = {},
): CalendarState => ({
  visibleMonth: options.visibleMonth ?? '2025-01',
  selectedDate: options.selectedDate ?? Option.none(),
  focusedDate: options.focusedDate ?? Option.none(),
})

const pad2 = (value: number): string => String(value).padStart(2, '0')

const dateFromParts = (year: number, month: number, day: number): Date =>
  new Date(Date.UTC(year, month - 1, day))

const partsFromDate = (
  date: Date,
): Readonly<{
  year: number
  month: number
  day: number
}> => ({
  year: date.getUTCFullYear(),
  month: date.getUTCMonth() + 1,
  day: date.getUTCDate(),
})

const isoDateFromParts = (year: number, month: number, day: number): string =>
  `${year}-${pad2(month)}-${pad2(day)}`

const monthKeyFromParts = (year: number, month: number): string =>
  `${year}-${pad2(month)}`

const parseIsoDate = (
  isoDate: string,
): Readonly<{ year: number; month: number; day: number }> => {
  const [year = '2025', month = '1', day = '1'] = isoDate.split('-')

  return {
    year: Number.parseInt(year, 10),
    month: Number.parseInt(month, 10),
    day: Number.parseInt(day, 10),
  }
}

const parseMonthKey = (
  monthKey: string,
): Readonly<{ year: number; month: number }> => {
  const [year = '2025', month = '1'] = monthKey.split('-')

  return {
    year: Number.parseInt(year, 10),
    month: Number.parseInt(month, 10),
  }
}

const daysInMonth = (year: number, month: number): number =>
  dateFromParts(year, month + 1, 0).getUTCDate()

const weekdayOf = (year: number, month: number, day: number): number =>
  dateFromParts(year, month, day).getUTCDay()

const addDays = (isoDate: string, delta: number): string => {
  const { year, month, day } = parseIsoDate(isoDate)
  const date = dateFromParts(year, month, day + delta)
  const next = partsFromDate(date)

  return isoDateFromParts(next.year, next.month, next.day)
}

export const addMonths = (monthKey: string, delta: number): string => {
  const { year, month } = parseMonthKey(monthKey)
  const date = dateFromParts(year, month + delta, 1)
  const next = partsFromDate(date)

  return monthKeyFromParts(next.year, next.month)
}

const monthLabel = (monthKey: string, locale: string | undefined): string => {
  const { year, month } = parseMonthKey(monthKey)

  return dateFromParts(year, month, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const dayLabel = (isoDate: string, locale: string | undefined): string => {
  const { year, month, day } = parseIsoDate(isoDate)

  return dateFromParts(year, month, day).toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const normalizedWeekStart = (weekStartsOn: number | undefined): number =>
  weekStartsOn === undefined ? 0 : ((weekStartsOn % 7) + 7) % 7

export const calendarMonthDays = (
  monthKey: string,
  config: Readonly<{
    selectedDate?: string
    today?: string
    disabledDates?: ReadonlyArray<string>
    weekStartsOn?: number
    showOutsideDays?: boolean
  }> = {},
): ReadonlyArray<CalendarDay> => {
  const { year, month } = parseMonthKey(monthKey)
  const firstWeekday = weekdayOf(year, month, 1)
  const weekStartsOn = normalizedWeekStart(config.weekStartsOn)
  const leadingDays = (firstWeekday - weekStartsOn + 7) % 7
  const currentMonthDays = daysInMonth(year, month)
  const totalSlots = Math.ceil((leadingDays + currentMonthDays) / 7) * 7
  const disabledDates = new Set(config.disabledDates ?? [])
  const showOutsideDays = config.showOutsideDays ?? true

  return pipe(
    Array.makeBy(totalSlots, index => {
      const date = dateFromParts(year, month, index - leadingDays + 1)
      const parts = partsFromDate(date)
      const isoDate = isoDateFromParts(parts.year, parts.month, parts.day)
      const isOutside = parts.month !== month

      return {
        isoDate,
        year: parts.year,
        month: parts.month,
        day: parts.day,
        weekday: date.getUTCDay(),
        isOutside,
        isToday: isoDate === config.today,
        isSelected: isoDate === config.selectedDate,
        isDisabled:
          disabledDates.has(isoDate) || (!showOutsideDays && isOutside),
      }
    }),
  )
}

export const updateCalendarState = (
  state: CalendarState,
  message: CalendarMessage,
): CalendarState =>
  M.value(message).pipe(
    M.tagsExhaustive({
      SelectedCalendarDate: ({ date }) => {
        const { year, month } = parseIsoDate(date)

        return {
          visibleMonth: monthKeyFromParts(year, month),
          selectedDate: Option.some(date),
          focusedDate: Option.some(date),
        }
      },
      ClickedCalendarPreviousMonth: () => ({
        visibleMonth: addMonths(state.visibleMonth, -1),
        selectedDate: state.selectedDate,
        focusedDate: state.focusedDate,
      }),
      ClickedCalendarNextMonth: () => ({
        visibleMonth: addMonths(state.visibleMonth, 1),
        selectedDate: state.selectedDate,
        focusedDate: state.focusedDate,
      }),
      PressedCalendarKey: ({ key }) => {
        const focus = pipe(
          state.focusedDate,
          Option.orElse(() => state.selectedDate),
          Option.getOrElse(() => `${state.visibleMonth}-01`),
        )
        const nextDate = (() => {
          if (key === 'ArrowLeft') {
            return addDays(focus, -1)
          }
          if (key === 'ArrowRight') {
            return addDays(focus, 1)
          }
          if (key === 'ArrowUp') {
            return addDays(focus, -7)
          }
          if (key === 'ArrowDown') {
            return addDays(focus, 7)
          }
          if (key === 'Home') {
            const { year, month } = parseIsoDate(focus)
            return isoDateFromParts(year, month, 1)
          }
          if (key === 'End') {
            const { year, month } = parseIsoDate(focus)
            return isoDateFromParts(year, month, daysInMonth(year, month))
          }
          return focus
        })()
        const { year, month } = parseIsoDate(nextDate)

        return {
          selectedDate: state.selectedDate,
          focusedDate: Option.some(nextDate),
          visibleMonth: monthKeyFromParts(year, month),
        }
      },
    }),
  )

// VIEW

export type CalendarSelectChange = Readonly<{ date: string }>

export type CalendarConfig<Message> = Readonly<{
  mode?: CalendarSelectionMode
  visibleMonth?: string
  selectedDate?: string
  focusedDate?: string
  today?: string
  disabledDates?: ReadonlyArray<string>
  showOutsideDays?: boolean
  captionLayout?: CalendarCaptionLayout
  className?: string
  dir?: CalendarDirection
  locale?: string
  weekStartsOn?: number
  onSelectDate?: (change: CalendarSelectChange) => Message
  onPreviousMonth?: Message
  onNextMonth?: Message
  onKeyDown?: (key: string, modifiers: KeyboardModifiers) => Message
  attributes?: ReadonlyArray<Attribute<Message>>
}>

export const calendarBaseClassName =
  'group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent rtl:**:[.rdp-button\\_next>svg]:rotate-180 rtl:**:[.rdp-button\\_previous>svg]:rotate-180'

export const calendarRootBaseClassName = 'w-fit'

export const calendarMonthsBaseClassName =
  'relative flex flex-col gap-4 md:flex-row'

export const calendarMonthBaseClassName = 'flex w-full flex-col gap-4'

export const calendarNavBaseClassName =
  'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1'

export const calendarNavButtonBaseClassName =
  'size-(--cell-size) p-0 select-none aria-disabled:opacity-50'

export const calendarCaptionBaseClassName =
  'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)'

export const calendarCaptionLabelBaseClassName = 'font-medium select-none'

export const calendarCaptionDropdownBaseClassName =
  'cn-calendar-caption-label flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground'

export const calendarCaptionTextBaseClassName = 'cn-calendar-caption text-sm'

export const calendarMonthGridBaseClassName = 'w-full border-collapse'

export const calendarWeekdaysBaseClassName = 'flex'

export const calendarWeekdayBaseClassName =
  'flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none'

export const calendarWeekBaseClassName = 'mt-2 flex w-full'

export const calendarDayBaseClassName =
  'group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius) [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)'

export const calendarTodayBaseClassName =
  'rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none'

export const calendarOutsideBaseClassName =
  'text-muted-foreground aria-selected:text-muted-foreground'

export const calendarDisabledBaseClassName = 'text-muted-foreground opacity-50'

export const calendarHiddenBaseClassName = 'invisible'

export const calendarDayButtonBaseClassName =
  'relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70'

export const calendarClassName = ({
  className,
}: Pick<CalendarConfig<never>, 'className'> = {}): string =>
  cn(calendarBaseClassName, className)

export const calendarDayClassName = (day: CalendarDay): string =>
  cn(
    calendarDayBaseClassName,
    day.isToday ? calendarTodayBaseClassName : undefined,
    day.isOutside ? calendarOutsideBaseClassName : undefined,
    day.isDisabled ? calendarDisabledBaseClassName : undefined,
  )

export const calendarDayButtonClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(
    buttonVariants({ variant: 'ghost', size: 'icon' }),
    calendarDayButtonBaseClassName,
    className,
  )

const calendarChevronIcon = <Message>(
  direction: 'left' | 'right' | 'down',
): Html => {
  const h = html<Message>()
  const path =
    direction === 'left'
      ? 'm15 18-6-6 6-6'
      : direction === 'right'
        ? 'm9 18 6-6-6-6'
        : 'm6 9 6 6 6-6'

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.AriaHidden(true),
      h.Class(direction === 'down' ? 'size-4' : 'cn-rtl-flip size-4'),
    ],
    [h.path([h.D(path)], [])],
  )
}

const weekdayLabels = (
  locale: string | undefined,
  weekStartsOn: number,
): ReadonlyArray<string> =>
  Array.makeBy(7, index => {
    const weekday = (weekStartsOn + index) % 7
    const date = dateFromParts(2025, 1, 5 + weekday)

    return date.toLocaleDateString(locale, {
      weekday: 'short',
      timeZone: 'UTC',
    })
  })

const optionalMessageAttribute = <Message>(
  message: Message | undefined,
  toAttribute: (nextMessage: Message) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  message === undefined ? [] : [toAttribute(message)]

const dayButton = <Message>(
  day: CalendarDay,
  config: CalendarConfig<Message>,
): Html => {
  const h = html<Message>()
  const maybeSelectMessage = day.isDisabled
    ? undefined
    : config.onSelectDate?.({ date: day.isoDate })

  return h.button(
    [
      h.Type('button'),
      h.Class(calendarDayButtonClassName()),
      h.DataAttribute('day', day.isoDate),
      h.DataAttribute('selected-single', String(day.isSelected)),
      ...(day.isSelected ? [h.AriaSelected(true)] : []),
      ...(day.isDisabled ? [h.Disabled(true), h.AriaDisabled(true)] : []),
      h.AriaLabel(dayLabel(day.isoDate, config.locale)),
      ...optionalMessageAttribute(maybeSelectMessage, message =>
        h.OnClick(message),
      ),
      ...(config.onKeyDown === undefined
        ? []
        : [
            h.OnKeyDownPreventDefault((key, modifiers) =>
              Option.fromNullishOr(config.onKeyDown?.(key, modifiers)),
            ),
          ]),
    ],
    [String(day.day)],
  )
}

const dayCell = <Message>(
  day: CalendarDay,
  focusedDate: string | undefined,
  config: CalendarConfig<Message>,
): Html => {
  const h = html<Message>()
  const showOutsideDays = config.showOutsideDays ?? true
  const shouldHide = day.isOutside && !showOutsideDays

  return h.td(
    [
      h.Class(
        cn(
          calendarDayClassName(day),
          shouldHide ? calendarHiddenBaseClassName : undefined,
        ),
      ),
      h.DataAttribute('selected', String(day.isSelected)),
      h.DataAttribute('outside', String(day.isOutside)),
      h.DataAttribute('today', String(day.isToday)),
      h.DataAttribute('disabled', String(day.isDisabled)),
      h.DataAttribute('focused', String(day.isoDate === focusedDate)),
    ],
    [dayButton(day, config)],
  )
}

const chunkWeeks = (
  days: ReadonlyArray<CalendarDay>,
): ReadonlyArray<ReadonlyArray<CalendarDay>> =>
  pipe(
    Array.makeBy(Math.ceil(days.length / 7), index =>
      days.slice(index * 7, index * 7 + 7),
    ),
  )

export const Calendar = <Message>(
  config: CalendarConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const visibleMonth = config.visibleMonth ?? '2025-01'
  const weekStartsOn = normalizedWeekStart(config.weekStartsOn)
  const days = calendarMonthDays(visibleMonth, config)
  const captionLayout = config.captionLayout ?? 'label'

  return h.div(
    [
      h.DataAttribute('slot', 'calendar'),
      h.Class(calendarClassName(config)),
      ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
      ...(config.attributes ?? []),
    ],
    [
      h.div(
        [h.Class(calendarRootBaseClassName)],
        [
          h.div(
            [h.Class(calendarMonthsBaseClassName)],
            [
              h.div(
                [h.Class(calendarMonthBaseClassName)],
                [
                  h.div(
                    [h.Class(calendarNavBaseClassName)],
                    [
                      h.button(
                        [
                          h.Type('button'),
                          h.Class(
                            cn(
                              buttonVariants({ variant: 'ghost' }),
                              calendarNavButtonBaseClassName,
                              'rdp-button_previous',
                            ),
                          ),
                          h.AriaLabel('Go to the previous month'),
                          ...optionalMessageAttribute(
                            config.onPreviousMonth,
                            message => h.OnClick(message),
                          ),
                        ],
                        [calendarChevronIcon('left')],
                      ),
                      h.button(
                        [
                          h.Type('button'),
                          h.Class(
                            cn(
                              buttonVariants({ variant: 'ghost' }),
                              calendarNavButtonBaseClassName,
                              'rdp-button_next',
                            ),
                          ),
                          h.AriaLabel('Go to the next month'),
                          ...optionalMessageAttribute(
                            config.onNextMonth,
                            message => h.OnClick(message),
                          ),
                        ],
                        [calendarChevronIcon('right')],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class(calendarCaptionBaseClassName)],
                    [
                      h.span(
                        [
                          h.Class(
                            cn(
                              calendarCaptionLabelBaseClassName,
                              captionLayout === 'label'
                                ? calendarCaptionTextBaseClassName
                                : calendarCaptionDropdownBaseClassName,
                            ),
                          ),
                        ],
                        captionLayout === 'dropdown'
                          ? [
                              monthLabel(visibleMonth, config.locale),
                              calendarChevronIcon('down'),
                            ]
                          : [monthLabel(visibleMonth, config.locale)],
                      ),
                    ],
                  ),
                  h.table(
                    [h.Class(calendarMonthGridBaseClassName), h.Role('grid')],
                    [
                      h.thead(
                        [],
                        [
                          h.tr(
                            [h.Class(calendarWeekdaysBaseClassName)],
                            [
                              ...weekdayLabels(config.locale, weekStartsOn).map(
                                label =>
                                  h.th(
                                    [h.Class(calendarWeekdayBaseClassName)],
                                    [label],
                                  ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.tbody(
                        [],
                        [
                          ...chunkWeeks(days).map(week =>
                            h.tr(
                              [h.Class(calendarWeekBaseClassName)],
                              [
                                ...week.map(day =>
                                  dayCell(day, config.focusedDate, config),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )
}

export const CalendarDayButton = dayButton
