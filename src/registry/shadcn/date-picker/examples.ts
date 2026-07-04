import { Option } from 'effect'
import { Calendar } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { Field, FieldDescription, FieldGroup, FieldLabel } from '../field'
import { view as Input } from '../input'
import { InputGroup, InputGroupAddon } from '../input-group'
import {
  DatePicker,
  DatePickerCleared,
  DatePickerRequestedSelectDate,
  datePickerInit,
  decodeCalendarDateIso,
} from './index'
import type { DatePickerMessage, DatePickerModel } from './index'

export type DatePickerExampleController<Message = never> = Readonly<{
  model: DatePickerModel
  toParentMessage: (message: DatePickerMessage) => Message
}>

type DatePickerExampleDefinition = Readonly<{
  id: string
  title: string
  view: <Message = never>(
    controller?: DatePickerExampleController<Message>,
  ) => Html
}>

const today = Calendar.make(2025, 6, 12)

export const datePickerDemoInitialModel = (): DatePickerModel =>
  datePickerInit({
    id: 'date-picker-demo',
    today,
    initialSelectedDate: Calendar.make(2025, 6, 12),
  })

export const datePickerBasicInitialModel = (): DatePickerModel =>
  datePickerInit({
    id: 'date-picker-basic',
    today,
  })

export const datePickerDobInitialModel = (): DatePickerModel =>
  datePickerInit({
    id: 'date-picker-dob',
    today,
    initialSelectedDate: Calendar.make(1990, 6, 12),
    minDate: Calendar.make(1900, 1, 1),
    maxDate: today,
  })

export const datePickerInputInitialModel = (): DatePickerModel =>
  datePickerInit({
    id: 'date-picker-input',
    today,
    initialSelectedDate: Calendar.make(2025, 6, 12),
  })

const arabicLocale: Calendar.LocaleConfig = {
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
  shortDayNames: ['أحد', 'اثن', 'ثلث', 'أرب', 'خمس', 'جمع', 'سبت'],
}

export const datePickerRtlInitialModel = (): DatePickerModel =>
  datePickerInit({
    id: 'date-picker-rtl',
    today,
    initialSelectedDate: Calendar.make(2025, 6, 12),
    locale: arabicLocale,
  })

const staticController = <Message>(
  model: DatePickerModel,
): DatePickerExampleController<Message> => ({
  model,
  toParentMessage: () => {
    throw new Error('Static DatePicker examples require a live controller.')
  },
})

export const datePickerInputMessageFromIsoValue = (
  value: string,
): Option.Option<DatePickerMessage> =>
  Option.map(decodeCalendarDateIso(value), date =>
    DatePickerRequestedSelectDate({ date }),
  )

const inputClassName = 'h-9 min-w-36'

export const DatePickerDemo = <Message = never>(
  controller: DatePickerExampleController<Message> = staticController(
    datePickerDemoInitialModel(),
  ),
): Html =>
  DatePicker({
    model: controller.model,
    toParentMessage: controller.toParentMessage,
    placeholder: 'Pick a date',
    name: 'appointmentDate',
  })

export const DatePickerBasic = <Message = never>(
  controller: DatePickerExampleController<Message> = staticController(
    datePickerBasicInitialModel(),
  ),
): Html =>
  DatePicker({
    model: controller.model,
    toParentMessage: controller.toParentMessage,
    placeholder: 'Select date',
    triggerClassName: 'w-44',
  })

export const DatePickerDob = <Message = never>(
  controller: DatePickerExampleController<Message> = staticController(
    datePickerDobInitialModel(),
  ),
): Html =>
  Field<Message>({
    className: 'max-w-72',
    children: [
      FieldLabel<Message>({
        children: ['Date of birth'],
      }),
      DatePicker({
        model: controller.model,
        toParentMessage: controller.toParentMessage,
        placeholder: 'Pick your birthday',
        name: 'dateOfBirth',
        triggerClassName: 'w-full',
      }),
      FieldDescription<Message>({
        children: ['Dates are limited to January 1, 1900 through today.'],
      }),
    ],
  })

export const DatePickerInput = <Message = never>(
  controller: DatePickerExampleController<Message> = staticController(
    datePickerInputInitialModel(),
  ),
): Html => {
  const h = html<Message>()

  return FieldGroup<Message>({
    className: 'max-w-md',
    children: [
      Field<Message>({
        children: [
          FieldLabel<Message>({
            children: ['Date'],
          }),
          InputGroup<Message>({
            className: 'w-full',
            children: [
              Input<Message>({
                id: 'date-picker-input-field',
                placeholder: 'YYYY-MM-DD',
                className: inputClassName,
                toView: attributes =>
                  h.input([
                    ...attributes.input,
                    h.OnInput(value =>
                      Option.match(datePickerInputMessageFromIsoValue(value), {
                        onNone: () =>
                          controller.toParentMessage(
                            Option.match(controller.model.maybeSelectedDate, {
                              onNone: DatePickerCleared,
                              onSome: date =>
                                DatePickerRequestedSelectDate({ date }),
                            }),
                          ),
                        onSome: controller.toParentMessage,
                      }),
                    ),
                  ]),
              }),
              InputGroupAddon<Message>({
                align: 'inline-end',
                children: [
                  DatePicker({
                    model: controller.model,
                    toParentMessage: controller.toParentMessage,
                    placeholder: 'Pick',
                    compact: true,
                    triggerClassName:
                      'h-7 w-24 border-0 bg-transparent px-2 shadow-none',
                    panelClassName: 'mt-1',
                  }),
                ],
              }),
            ],
          }),
          FieldDescription<Message>({
            children: ['Enter an ISO date or use the picker.'],
          }),
        ],
      }),
    ],
  })
}

export const DatePickerRtl = <Message = never>(
  controller: DatePickerExampleController<Message> = staticController(
    datePickerRtlInitialModel(),
  ),
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Dir('rtl'), h.Class('flex w-full justify-end')],
    [
      DatePicker({
        model: controller.model,
        toParentMessage: controller.toParentMessage,
        placeholder: 'اختر تاريخا',
        locale: arabicLocale,
        dir: 'rtl',
        triggerClassName: 'w-56',
      }),
    ],
  )
}

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
