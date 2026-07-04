import { DatePicker as UiDatePicker } from '@foldkit/ui'
import type { CalendarAttributes } from '@foldkit/ui/calendar'
import type { AnchorConfig } from '@foldkit/ui/popover'
import { Match as M, Option, Schema as S } from 'effect'
import { Calendar } from 'foldkit'
import type { Attribute, Html } from 'foldkit/html'
import { childAttributes, html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const DatePickerModel = UiDatePicker.Model
export type DatePickerModel = typeof DatePickerModel.Type

export const DatePickerMessage = UiDatePicker.Message
export type DatePickerMessage = typeof DatePickerMessage.Type

export const DatePickerOutMessage = UiDatePicker.OutMessage
export type DatePickerOutMessage = typeof DatePickerOutMessage.Type

export type DatePickerInitConfig = UiDatePicker.InitConfig

export const datePickerInit = UiDatePicker.init
export const datePickerUpdate = UiDatePicker.update
export const datePickerSelectDate = UiDatePicker.selectDate
export const datePickerClear = UiDatePicker.clear
export const datePickerReflectSelectedDate = UiDatePicker.reflectSelectedDate
export const DatePickerSelectedDate = UiDatePicker.SelectedDate
export const DatePickerChangedViewMonth = UiDatePicker.ChangedViewMonth
export const DatePickerRequestedSelectDate = UiDatePicker.RequestedSelectDate
export const DatePickerCleared = UiDatePicker.Cleared
export const DatePickerOpened = UiDatePicker.Opened

export const encodeCalendarDateIso = S.encodeSync(
  Calendar.CalendarDateFromIsoString,
)

export const decodeCalendarDateIso = S.decodeUnknownOption(
  Calendar.CalendarDateFromIsoString,
)

// VIEW

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
    dir?: 'ltr' | 'rtl'
    compact?: boolean
  }>

export const datePickerAnchor: AnchorConfig = {
  placement: 'bottom-start',
  gap: 4,
  padding: 8,
}

export const datePickerClassName = (
  className: string | undefined = undefined,
): string => cn('relative inline-block', className)

export const datePickerTriggerClassName = (
  className: string | undefined = undefined,
): string =>
  cn(
    'inline-flex h-9 w-56 items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm font-normal shadow-xs transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:hover:bg-input/50',
    className,
  )

export const datePickerPanelClassName = (
  className: string | undefined = undefined,
): string =>
  cn(
    'z-50 w-auto rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-hidden',
    className,
  )

const datePickerBackdropClassName = 'fixed inset-0 z-0'

const triggerContentClassName = 'flex min-w-0 flex-1 items-center gap-2'
const triggerLabelClassName = 'min-w-0 truncate'
const placeholderClassName = 'min-w-0 truncate text-muted-foreground'
const triggerIconClassName = 'size-4 shrink-0 text-muted-foreground'
const calendarWrapperClassName =
  'flex min-h-72 min-w-70 select-none flex-col gap-3'
const calendarHeaderClassName = 'flex items-center justify-between gap-2'
const calendarHeadingButtonClassName =
  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium tabular-nums hover:bg-accent hover:text-accent-foreground'
const calendarHeadingTextClassName = 'text-sm font-medium tabular-nums'
const calendarNavButtonClassName =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50'
const calendarGridClassName = 'flex flex-col gap-1 outline-none'
const calendarHeaderRowClassName = 'grid grid-cols-7 gap-1'
const calendarColumnHeaderClassName =
  'py-1 text-center text-[0.8rem] font-normal text-muted-foreground'
const calendarWeekRowClassName = 'grid grid-cols-7 gap-1'
const calendarCellClassName =
  'group relative flex size-8 items-center justify-center p-0 text-center text-sm'
const calendarDayButtonClassName =
  'inline-flex size-8 items-center justify-center rounded-md text-sm tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 group-data-[outside-month]:text-muted-foreground group-data-[outside-month]:opacity-50 group-data-[today]:bg-accent group-data-[today]:text-accent-foreground group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground group-data-[selected]:hover:bg-primary group-data-[selected]:hover:text-primary-foreground'
const calendarMonthYearGridClassName =
  'grid flex-1 grid-cols-3 grid-rows-4 gap-2 outline-none'
const calendarMonthYearCellClassName = 'group flex items-center justify-center'
const calendarMonthYearButtonClassName =
  'inline-flex h-full min-h-10 w-full items-center justify-center rounded-md text-sm tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 group-data-[today]:bg-accent group-data-[today]:text-accent-foreground group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground'

type IconName = 'calendar' | 'chevronDown' | 'chevronLeft' | 'chevronRight'

const iconPaths: Readonly<Record<IconName, ReadonlyArray<string>>> = {
  calendar: [
    'M8 2v4',
    'M16 2v4',
    'M3 10h18',
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  ],
  chevronDown: ['m6 9 6 6 6-6'],
  chevronLeft: ['m15 18-6-6 6-6'],
  chevronRight: ['m9 18 6-6-6-6'],
}

const icon = (
  name: IconName,
  attributes: ReadonlyArray<Attribute<never>> = [],
): Html => {
  const h = html<never>()

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
      ...attributes,
    ],
    iconPaths[name].map(path => h.path([h.D(path)], [])),
  )
}

const datePickerIcon = (name: IconName, className: string): Html => {
  const h = html<never>()
  return icon(name, [h.Class(className), h.AriaHidden(true)])
}

const triggerContent = (
  placeholder: string,
  locale: Calendar.LocaleConfig,
  compact: boolean,
): ((maybeDate: Option.Option<Calendar.CalendarDate>) => Html) => {
  const h = html<never>()

  return maybeDate =>
    h.span(
      [h.Class(triggerContentClassName)],
      [
        datePickerIcon('calendar', triggerIconClassName),
        Option.match(maybeDate, {
          onNone: () => h.span([h.Class(placeholderClassName)], [placeholder]),
          onSome: date =>
            h.span(
              [h.Class(triggerLabelClassName)],
              [
                compact
                  ? Calendar.formatShort(date, locale)
                  : Calendar.formatLong(date, locale),
              ],
            ),
        }),
        datePickerIcon('chevronDown', triggerIconClassName),
      ],
    )
}

const renderCalendar = (attributes: CalendarAttributes): Html => {
  const h = html<never>()

  return M.value(attributes).pipe(
    M.tagsExhaustive({
      Days: days =>
        h.div(
          [...days.root, h.Class(calendarWrapperClassName)],
          [
            h.div(
              [h.Class(calendarHeaderClassName)],
              [
                h.button(
                  [
                    ...days.previousMonthButton,
                    h.Class(calendarNavButtonClassName),
                  ],
                  [datePickerIcon('chevronLeft', 'size-4')],
                ),
                h.button(
                  [
                    h.Id(days.heading.id),
                    ...days.headingButton,
                    h.Class(calendarHeadingButtonClassName),
                  ],
                  [days.heading.text, datePickerIcon('chevronDown', 'size-3')],
                ),
                h.button(
                  [
                    ...days.nextMonthButton,
                    h.Class(calendarNavButtonClassName),
                  ],
                  [datePickerIcon('chevronRight', 'size-4')],
                ),
              ],
            ),
            h.div(
              [...days.grid, h.Class(calendarGridClassName)],
              [
                h.div(
                  [...days.headerRow, h.Class(calendarHeaderRowClassName)],
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
                    [...week.attributes, h.Class(calendarWeekRowClassName)],
                    week.cells.map(cell =>
                      h.div(
                        [
                          ...cell.cellAttributes,
                          h.Class(calendarCellClassName),
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
          [...months.root, h.Class(calendarWrapperClassName)],
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
                  [
                    months.heading.text,
                    datePickerIcon('chevronDown', 'size-3'),
                  ],
                ),
              ],
            ),
            h.div(
              [...months.grid, h.Class(calendarMonthYearGridClassName)],
              months.cells.map(cell =>
                h.div(
                  [
                    ...cell.cellAttributes,
                    h.Class(calendarMonthYearCellClassName),
                  ],
                  [
                    h.button(
                      [
                        ...cell.buttonAttributes,
                        h.Class(calendarMonthYearButtonClassName),
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
          [...years.root, h.Class(calendarWrapperClassName)],
          [
            h.div(
              [h.Class(calendarHeaderClassName)],
              [
                h.button(
                  [
                    ...years.previousPageButton,
                    h.Class(calendarNavButtonClassName),
                  ],
                  [datePickerIcon('chevronLeft', 'size-4')],
                ),
                h.h2(
                  [
                    h.Id(years.heading.id),
                    h.Class(calendarHeadingTextClassName),
                  ],
                  [years.heading.text],
                ),
                h.button(
                  [
                    ...years.nextPageButton,
                    h.Class(calendarNavButtonClassName),
                  ],
                  [datePickerIcon('chevronRight', 'size-4')],
                ),
              ],
            ),
            h.div(
              [...years.grid, h.Class(calendarMonthYearGridClassName)],
              years.cells.map(cell =>
                h.div(
                  [
                    ...cell.cellAttributes,
                    h.Class(calendarMonthYearCellClassName),
                  ],
                  [
                    h.button(
                      [
                        ...cell.buttonAttributes,
                        h.Class(calendarMonthYearButtonClassName),
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

export const DatePicker = <Message>(
  config: DatePickerConfig<Message>,
): Html => {
  const h = html<Message>()
  const locale = config.locale ?? Calendar.defaultEnglishLocale

  return h.submodel({
    slotId: config.model.id,
    model: config.model,
    view: UiDatePicker.view,
    viewInputs: {
      anchor: config.anchor ?? datePickerAnchor,
      triggerContent: triggerContent(
        config.placeholder ?? 'Pick a date',
        locale,
        config.compact ?? false,
      ),
      toCalendarView: renderCalendar,
      backdropClassName: datePickerBackdropClassName,
      className: datePickerClassName(config.className),
      triggerClassName: datePickerTriggerClassName(config.triggerClassName),
      panelClassName: datePickerPanelClassName(config.panelClassName),
      ...(config.name === undefined ? {} : { name: config.name }),
      ...(config.isDisabled === undefined
        ? {}
        : { isDisabled: config.isDisabled }),
      ...(config.dir === undefined
        ? {}
        : {
            attributes: childAttributes([h.Dir(config.dir)]),
            triggerAttributes: childAttributes([h.Dir(config.dir)]),
            panelAttributes: childAttributes([h.Dir(config.dir)]),
          }),
    },
    toParentMessage: config.toParentMessage,
  })
}
