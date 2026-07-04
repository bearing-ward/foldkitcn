import { Option, Schema as S } from 'effect'
import { Calendar } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { InputGroup, InputGroupInput, InputGroupText } from '../input-group'
import { DatePicker, datePickerInit } from './index'
import type {
  DatePickerController,
  DatePickerMessage,
  DatePickerModel,
} from './index'

type DatePickerExampleDefinition = Readonly<{
  id: string
  title: string
  view: () => Html
}>

export type DatePickerExampleController<Message = DatePickerMessage> =
  DatePickerController<Message>

type DatePickerExampleConfig<Message> = Readonly<{
  controller?: DatePickerExampleController<Message> | undefined
  id: string
  today: Calendar.CalendarDate
  initialSelectedDate?: Calendar.CalendarDate | undefined
  minDate?: Calendar.CalendarDate | undefined
  maxDate?: Calendar.CalendarDate | undefined
  locale?: Calendar.LocaleConfig | undefined
  placeholder?: string | undefined
  name?: string | undefined
  className?: string | undefined
  triggerClassName?: string | undefined
  panelClassName?: string | undefined
  dir?: 'ltr' | 'rtl' | undefined
  compact?: boolean | undefined
}>

const deterministicToday = Calendar.make(2025, 6, 12)
const demoSelectedDate = Calendar.make(2025, 6, 12)
const basicSelectedDate = Calendar.make(2025, 1, 6)
const dobSelectedDate = Calendar.make(1995, 6, 12)
const dobMinDate = Calendar.make(1900, 1, 1)
const dobMaxDate = Calendar.make(2010, 12, 31)

export const arabicLocale: Calendar.LocaleConfig = {
  firstDayOfWeek: 'Saturday',
  monthNames: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  shortMonthNames: [
    'ينا',
    'فبر',
    'مار',
    'أبر',
    'ماي',
    'يون',
    'يول',
    'أغس',
    'سبت',
    'أكت',
    'نوف',
    'ديس',
  ],
  dayNames: [
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
  ],
  shortDayNames: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
}

const initialModel = <Message>(
  config: DatePickerExampleConfig<Message>,
): DatePickerModel =>
  datePickerInit({
    id: config.id,
    today: config.today,
    ...(config.initialSelectedDate === undefined
      ? {}
      : { initialSelectedDate: config.initialSelectedDate }),
    ...(config.minDate === undefined ? {} : { minDate: config.minDate }),
    ...(config.maxDate === undefined ? {} : { maxDate: config.maxDate }),
    ...(config.locale === undefined ? {} : { locale: config.locale }),
  })

const controllerFor = <Message = DatePickerMessage>(
  config: DatePickerExampleConfig<Message>,
): DatePickerExampleController<Message | DatePickerMessage> =>
  config.controller ?? {
    model: initialModel(config),
    toParentMessage: message => message,
  }

const picker = <Message = DatePickerMessage>(
  config: DatePickerExampleConfig<Message>,
): Html => {
  const controller = controllerFor(config)

  return DatePicker<Message | DatePickerMessage>({
    ...controller,
    ...(config.placeholder === undefined
      ? {}
      : { placeholder: config.placeholder }),
    ...(config.name === undefined ? {} : { name: config.name }),
    ...(config.locale === undefined ? {} : { locale: config.locale }),
    ...(config.className === undefined ? {} : { className: config.className }),
    ...(config.triggerClassName === undefined
      ? {}
      : { triggerClassName: config.triggerClassName }),
    ...(config.panelClassName === undefined
      ? {}
      : { panelClassName: config.panelClassName }),
    ...(config.dir === undefined ? {} : { dir: config.dir }),
    ...(config.compact === undefined ? {} : { compact: config.compact }),
  })
}

export const decodeIsoDate = (
  value: string,
): Option.Option<Calendar.CalendarDate> =>
  S.decodeUnknownOption(Calendar.CalendarDateFromIsoString)(value)

const isoValue = (model: DatePickerModel): string =>
  Option.match(model.maybeSelectedDate, {
    onNone: () => '',
    onSome: S.encodeSync(Calendar.CalendarDateFromIsoString),
  })

export const DatePickerDemo = <Message = DatePickerMessage>(
  controller?: DatePickerExampleController<Message>,
): Html =>
  picker({
    controller,
    id: 'date-picker-demo',
    today: deterministicToday,
    initialSelectedDate: demoSelectedDate,
    placeholder: 'Pick a date',
  })

export const DatePickerBasic = <Message = DatePickerMessage>(
  controller?: DatePickerExampleController<Message>,
): Html =>
  picker({
    controller,
    id: 'date-picker-basic',
    today: deterministicToday,
    initialSelectedDate: basicSelectedDate,
    placeholder: 'Select date',
    triggerClassName: 'min-w-40',
    compact: true,
  })

export const DatePickerDob = <Message = DatePickerMessage>(
  controller?: DatePickerExampleController<Message>,
): Html => {
  const h = html<Message | DatePickerMessage>()

  return h.div(
    [h.Class('grid w-full max-w-64 gap-2')],
    [
      h.label(
        [
          h.For('date-picker-dob-trigger'),
          h.Class('text-sm font-medium leading-none'),
        ],
        ['Date of birth'],
      ),
      picker({
        controller,
        id: 'date-picker-dob',
        today: deterministicToday,
        initialSelectedDate: dobSelectedDate,
        minDate: dobMinDate,
        maxDate: dobMaxDate,
        placeholder: 'Pick your birthday',
        triggerClassName: 'w-full',
      }),
      h.p(
        [h.Class('text-xs text-muted-foreground')],
        [
          'Dates outside 1900-2010 are disabled by the native DatePicker model.',
        ],
      ),
    ],
  )
}

export const DatePickerInput = <Message = DatePickerMessage>(
  controller?: DatePickerExampleController<Message>,
): Html => {
  const h = html<Message | DatePickerMessage>()
  const resolved = controllerFor({
    controller,
    id: 'date-picker-input',
    today: deterministicToday,
    initialSelectedDate: demoSelectedDate,
  })

  return h.div(
    [h.Class('grid w-full max-w-72 gap-2')],
    [
      InputGroup<Message | DatePickerMessage>({
        children: [
          InputGroupText<Message | DatePickerMessage>({
            children: ['ISO'],
          }),
          InputGroupInput<Message | DatePickerMessage>({
            value: isoValue(resolved.model),
            attributes: [h.Readonly(true), h.AriaLabel('Selected ISO date')],
          }),
        ],
      }),
      DatePicker<Message | DatePickerMessage>({
        ...resolved,
        name: 'date',
        placeholder: 'Pick date',
        triggerClassName: 'w-full',
        compact: true,
      }),
    ],
  )
}

export const DatePickerRtl = <Message = DatePickerMessage>(
  controller?: DatePickerExampleController<Message>,
): Html =>
  picker({
    controller,
    id: 'date-picker-rtl',
    today: deterministicToday,
    initialSelectedDate: demoSelectedDate,
    locale: arabicLocale,
    placeholder: 'اختر التاريخ',
    triggerClassName: 'min-w-52',
    panelClassName: 'text-right',
    dir: 'rtl',
  })

export const datePickerExampleViews: ReadonlyArray<DatePickerExampleDefinition> =
  [
    {
      id: 'shadcn/date-picker-demo',
      title: 'DatePickerDemo',
      view: DatePickerDemo,
    },
    {
      id: 'shadcn/date-picker-basic',
      title: 'DatePickerBasic',
      view: DatePickerBasic,
    },
    {
      id: 'shadcn/date-picker-dob',
      title: 'DatePickerDob',
      view: DatePickerDob,
    },
    {
      id: 'shadcn/date-picker-input',
      title: 'DatePickerInput',
      view: DatePickerInput,
    },
    {
      id: 'shadcn/date-picker-rtl',
      title: 'DatePickerRtl',
      view: DatePickerRtl,
    },
  ]
