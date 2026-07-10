import { DatePicker as UiDatePicker } from '@foldkit/ui'
import type { CalendarAttributes } from '@foldkit/ui/calendar'
import type { AnchorConfig } from '@foldkit/ui/popover'
import { Match as M, Option, Schema as S } from 'effect'
import { Calendar } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const DatePickerModel = UiDatePicker.Model
export type DatePickerModel = typeof DatePickerModel.Type

export const DatePickerMessage = UiDatePicker.Message
export type DatePickerMessage = typeof DatePickerMessage.Type

export const DatePickerOutMessage = UiDatePicker.OutMessage
export type DatePickerOutMessage = typeof DatePickerOutMessage.Type

export const DatePickerDirection = S.Union([S.Literal('ltr'), S.Literal('rtl')])
export type DatePickerDirection = typeof DatePickerDirection.Type

export type DatePickerController<Message = DatePickerMessage> = Readonly<{
  model: DatePickerModel
  toParentMessage: (message: DatePickerMessage) => Message
}>

export type DatePickerConfig<Message = DatePickerMessage> =
  DatePickerController<Message> &
    Readonly<{
      placeholder?: string
      name?: string
      locale?: Calendar.LocaleConfig
      anchor?: AnchorConfig
      className?: string
      triggerClassName?: string
      panelClassName?: string
      isDisabled?: boolean
      dir?: DatePickerDirection
      compact?: boolean
    }>

export const datePickerInit = UiDatePicker.init
export const datePickerUpdate = UiDatePicker.update
export const datePickerSelectDate = UiDatePicker.selectDate
export const datePickerClear = UiDatePicker.clear

// VIEW

const defaultAnchor: AnchorConfig = {
  placement: 'bottom-start',
  gap: 4,
  padding: 8,
}

const triggerBaseClassName =
  'inline-flex h-8 w-fit items-center justify-between gap-2 rounded-lg border border-input bg-background px-2.5 py-1 text-sm font-normal whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[placeholder=true]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50'

const triggerCompactClassName = 'h-7 min-w-36 gap-1.5 px-2 text-xs'

const panelBaseClassName =
  'isolate z-50 w-auto max-w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-neutral-200 bg-popover bg-white p-3 text-popover-foreground text-black shadow-lg ring-1 ring-neutral-950/10 outline-none'

const panelCompactClassName = 'p-2'

const calendarBaseClassName =
  'group/calendar flex w-fit flex-col gap-3 [--cell-size:--spacing(8)]'

const calendarCompactClassName = 'gap-2 [--cell-size:--spacing(7)]'

const calendarHeaderClassName = 'flex items-center justify-between gap-1'

const calendarHeadingButtonClassName =
  'inline-flex h-8 items-center justify-center gap-1 rounded-md px-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

const calendarHeadingClassName = 'text-sm font-medium'

const calendarNavButtonClassName =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50'

const calendarGridClassName = 'grid gap-1 outline-none'

const calendarWeekClassName = 'grid grid-cols-7 gap-1'

const calendarDayCellClassName =
  'group/day relative aspect-square size-(--cell-size) p-0 text-center text-sm'

const calendarDayButtonClassName =
  'flex size-full items-center justify-center rounded-md text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 group-data-[outside-month]/day:text-muted-foreground group-data-[outside-month]/day:opacity-50 group-data-[today]/day:bg-accent group-data-[today]/day:text-accent-foreground group-data-[selected]/day:bg-primary group-data-[selected]/day:text-primary-foreground group-data-[selected]/day:hover:bg-primary group-data-[selected]/day:hover:text-primary-foreground'

const calendarColumnHeaderClassName =
  'flex size-(--cell-size) items-center justify-center rounded-md text-xs font-normal text-muted-foreground'

const monthYearGridClassName =
  'grid min-h-72 grid-cols-3 grid-rows-4 gap-1 outline-none'

const monthYearCellClassName = 'group flex items-center justify-center'

const monthYearButtonClassName =
  'flex h-full min-h-12 w-full items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 group-data-[today]:bg-accent group-data-[today]:text-accent-foreground group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground'

export const datePickerClassName = (
  className: string | undefined = undefined,
): string => cn('relative inline-block', className)

export const datePickerTriggerClassName = (
  className: string | undefined = undefined,
  compact = false,
): string =>
  cn(triggerBaseClassName, compact ? triggerCompactClassName : '', className)

export const datePickerPanelClassName = (
  className: string | undefined = undefined,
  compact = false,
): string =>
  cn(panelBaseClassName, compact ? panelCompactClassName : '', className)

const icon = <Message>(path: string, className = 'size-4 shrink-0'): Html => {
  const h = html<Message>()

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
      h.Class(className),
    ],
    [h.path([h.D(path)], [])],
  )
}

const chevronDownIcon = <Message>(): Html => icon<Message>('m6 9 6 6 6-6')

const chevronLeftIcon = <Message>(): Html =>
  icon<Message>('m15 18-6-6 6-6', 'cn-rtl-flip size-4 shrink-0')

const chevronRightIcon = <Message>(): Html =>
  icon<Message>('m9 18 6-6-6-6', 'cn-rtl-flip size-4 shrink-0')

const triggerLabel = (
  maybeDate: Option.Option<Calendar.CalendarDate>,
  locale: Calendar.LocaleConfig,
  placeholder: string,
): string =>
  Option.match(maybeDate, {
    onNone: () => placeholder,
    onSome: date => Calendar.formatLong(date, locale),
  })

const renderTriggerContent = <Message>(
  maybeDate: Option.Option<Calendar.CalendarDate>,
  config: Pick<DatePickerConfig<Message>, 'compact' | 'locale' | 'placeholder'>,
): Html => {
  const h = html<Message>()
  const locale = config.locale ?? Calendar.defaultEnglishLocale
  const placeholder = config.placeholder ?? 'Pick a date'

  return h.span(
    [h.Class('flex w-full min-w-0 items-center justify-between gap-1.5')],
    [
      h.span(
        [h.Class('truncate')],
        [triggerLabel(maybeDate, locale, placeholder)],
      ),
      chevronDownIcon<Message>(),
    ],
  )
}

const toCalendarView = <Message>(
  attributes: CalendarAttributes,
  compact = false,
): Html => {
  const h = html<Message>()
  const calendarClassName = cn(
    calendarBaseClassName,
    compact ? calendarCompactClassName : '',
  )

  return M.value(attributes).pipe(
    M.tagsExhaustive({
      Days: days =>
        h.div(
          [...days.root, h.Class(calendarClassName)],
          [
            h.div(
              [h.Class(calendarHeaderClassName)],
              [
                h.button(
                  [
                    ...days.previousMonthButton,
                    h.Class(calendarNavButtonClassName),
                  ],
                  [chevronLeftIcon<Message>()],
                ),
                h.button(
                  [
                    h.Id(days.heading.id),
                    ...days.headingButton,
                    h.Class(calendarHeadingButtonClassName),
                  ],
                  [days.heading.text, chevronDownIcon<Message>()],
                ),
                h.button(
                  [
                    ...days.nextMonthButton,
                    h.Class(calendarNavButtonClassName),
                  ],
                  [chevronRightIcon<Message>()],
                ),
              ],
            ),
            h.div(
              [...days.grid, h.Class(calendarGridClassName)],
              [
                h.div(
                  [...days.headerRow, h.Class(calendarWeekClassName)],
                  days.columnHeaders.map(header =>
                    h.div(
                      [
                        ...header.attributes,
                        h.Class(calendarColumnHeaderClassName),
                      ],
                      [header.name],
                    ),
                  ),
                ),
                ...days.weeks.map(week =>
                  h.div(
                    [...week.attributes, h.Class(calendarWeekClassName)],
                    week.cells.map(cell =>
                      h.div(
                        [
                          ...cell.cellAttributes,
                          h.Class(calendarDayCellClassName),
                        ],
                        [
                          h.button(
                            [
                              ...cell.buttonAttributes,
                              h.Class(calendarDayButtonClassName),
                            ],
                            [cell.label],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      Months: months =>
        h.div(
          [...months.root, h.Class(calendarClassName)],
          [
            h.div(
              [h.Class(`${calendarHeaderClassName} justify-center`)],
              [
                h.button(
                  [
                    h.Id(months.heading.id),
                    ...months.headingButton,
                    h.Class(calendarHeadingButtonClassName),
                  ],
                  [months.heading.text, chevronDownIcon<Message>()],
                ),
              ],
            ),
            h.div(
              [...months.grid, h.Class(monthYearGridClassName)],
              months.cells.map(cell =>
                h.div(
                  [...cell.cellAttributes, h.Class(monthYearCellClassName)],
                  [
                    h.button(
                      [
                        ...cell.buttonAttributes,
                        h.Class(monthYearButtonClassName),
                      ],
                      [cell.shortLabel],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      Years: years =>
        h.div(
          [...years.root, h.Class(calendarClassName)],
          [
            h.div(
              [h.Class(calendarHeaderClassName)],
              [
                h.button(
                  [
                    ...years.previousPageButton,
                    h.Class(calendarNavButtonClassName),
                  ],
                  [chevronLeftIcon<Message>()],
                ),
                h.h2(
                  [h.Id(years.heading.id), h.Class(calendarHeadingClassName)],
                  [years.heading.text],
                ),
                h.button(
                  [
                    ...years.nextPageButton,
                    h.Class(calendarNavButtonClassName),
                  ],
                  [chevronRightIcon<Message>()],
                ),
              ],
            ),
            h.div(
              [...years.grid, h.Class(monthYearGridClassName)],
              years.cells.map(cell =>
                h.div(
                  [...cell.cellAttributes, h.Class(monthYearCellClassName)],
                  [
                    h.button(
                      [
                        ...cell.buttonAttributes,
                        h.Class(monthYearButtonClassName),
                      ],
                      [cell.label],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
    }),
  )
}

export const DatePicker = <Message = DatePickerMessage>(
  config: DatePickerConfig<Message>,
): Html => {
  const h = html<Message>()

  const picker = h.submodel({
    slotId: config.model.id,
    model: config.model,
    view: UiDatePicker.view,
    viewInputs: {
      anchor: config.anchor ?? defaultAnchor,
      triggerContent: maybeDate => renderTriggerContent(maybeDate, config),
      toCalendarView: attributes =>
        toCalendarView<Message>(attributes, config.compact === true),
      ...(config.name === undefined ? {} : { name: config.name }),
      ...(config.isDisabled === undefined
        ? {}
        : { isDisabled: config.isDisabled }),
      className: datePickerClassName(config.className),
      triggerAttributes: [h.DataAttribute('slot', 'popover-trigger')],
      triggerClassName: datePickerTriggerClassName(
        config.triggerClassName,
        config.compact === true,
      ),
      panelClassName: datePickerPanelClassName(
        config.panelClassName,
        config.compact === true,
      ),
    },
    toParentMessage: config.toParentMessage,
  })

  return config.dir === undefined
    ? picker
    : h.div([h.Dir(config.dir)], [picker])
}
